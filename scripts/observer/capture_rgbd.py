"""Read-only ROS capture: exact-stamp RGB/depth pairs, no scene mutation."""
import hashlib
import json
import struct
import sys
import time
import zlib
from pathlib import Path

import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy
from sensor_msgs.msg import Image, CameraInfo
from std_msgs.msg import String

sys.path.insert(0, '/ws/robot2-cad/sim/ros_nodes')
from rgbd_estimator_core import estimate_carton

ROOT = Path(sys.argv[1] if len(sys.argv)>1 else '/capture')
ROOT.mkdir(parents=True, exist_ok=True)
MAX_FRAMES = int(sys.argv[2]) if len(sys.argv)>2 else 18
SCENARIO = Path('/ws/robot2-cad/sim/scenarios/horizontal_indexed_multi_carton.json')
cfg = json.loads(SCENARIO.read_text())
qos_profile_sensor_data = QoSProfile(depth=5, reliability=ReliabilityPolicy.RELIABLE)

def stamp(message):
    return message.header.stamp.sec * 1000000000 + message.header.stamp.nanosec

def png_rgb(message, path):
    """Losslessly encode the native sensor bytes; no resampling or grading."""
    if message.encoding not in ('rgb8', 'bgr8'):
        raise ValueError(message.encoding)
    raw = bytes(message.data)
    rows = []
    for y in range(message.height):
        row = raw[y*message.step:y*message.step + message.width*3]
        if message.encoding == 'bgr8':
            row = bytes(c for i in range(0,len(row),3) for c in row[i:i+3][::-1])
        rows.append(b'\x00' + row)
    def chunk(kind, data):
        return struct.pack('!I', len(data)) + kind + data + struct.pack('!I', zlib.crc32(kind+data)&0xffffffff)
    path.write_bytes(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR',struct.pack('!2I5B',message.width,message.height,8,2,0,0,0)) + chunk(b'IDAT',zlib.compress(b''.join(rows),9)) + chunk(b'IEND',b''))

class Capture(Node):
    def __init__(self):
        super().__init__('observer_slide_capture')
        self.rgb = {}; self.depth = {}; self.info = None
        self.phase = ''; self.metadata = None; self.count = 0
        self.last_saved = -1; self.background_saved = False
        self.created = time.monotonic(); self.first_valid = None
        self.create_subscription(Image,'/robot2/perception/overhead/image',lambda m:self.frame('rgb',m),qos_profile_sensor_data)
        self.create_subscription(Image,'/robot2/perception/overhead/depth_image',lambda m:self.frame('depth',m),qos_profile_sensor_data)
        self.create_subscription(CameraInfo,'/robot2/perception/overhead/camera_info',self.camera_info,qos_profile_sensor_data)
        self.create_subscription(String,'/robot2/supervisor/task_phase',self.task_phase,10)
        self.create_subscription(String,'/robot2/sensors/camera/metadata',self.camera_metadata,10)
        print('CAPTURE_READY',flush=True)

    def task_phase(self,m): self.phase=m.data
    def camera_metadata(self,m):
        try: self.metadata=json.loads(m.data)
        except ValueError: pass
    def camera_info(self,m): self.info=m

    def frame(self,kind,m):
        key=stamp(m); cache=getattr(self,kind); cache[key]=m
        while len(cache)>8: del cache[next(iter(cache))]
        if key in self.rgb and key in self.depth and self.info is not None:
            if key-self.last_saved < 400000000: return
            rgb=self.rgb.pop(key); depth=self.depth.pop(key)
            c=cfg['sensors']['overhead_camera']
            estimate=estimate_carton(rgb=bytes(rgb.data),rgb_encoding=rgb.encoding,rgb_step=rgb.step,depth=bytes(depth.data),depth_encoding=depth.encoding,depth_step=depth.step,width=rgb.width,height=rgb.height,camera_k=list(self.info.k),camera_origin_world_m=cfg['calibration']['translation_m'],product_height_m=cfg['process']['product_size_m'][2],sample_stride=1,target_world_xy_m=cfg['environment']['pick_carton_center_m'][:2],roi_half_extents_m=c['target_roi_half_extents_m'],top_plane_depth_half_band_m=c['top_plane_depth_half_band_m'])
            if estimate.get('valid'):
                self.count+=1; name=f'frame-{self.count:02d}'
                if self.first_valid is None: self.first_valid=time.monotonic()
            elif not self.background_saved:
                name='background'; self.background_saved=True
            else: return
            self.last_saved=key
            folder=ROOT/name; folder.mkdir(exist_ok=True)
            png_rgb(rgb,folder/'rgb.png')
            (folder/'depth.f32').write_bytes(bytes(depth.data))
            data={'schema':'robot2.presentation.rgbd_capture.v1','native_stamp_ns':key,'rgb_stamp_ns':stamp(rgb),'depth_stamp_ns':stamp(depth),'camera_info_stamp_ns':stamp(self.info),'rgb_frame':rgb.header.frame_id,'depth_frame':depth.header.frame_id,'width':rgb.width,'height':rgb.height,'rgb_encoding':rgb.encoding,'rgb_step':rgb.step,'depth_encoding':depth.encoding,'depth_step':depth.step,'depth_bigendian':depth.is_bigendian,'camera_k':list(self.info.k),'camera_origin_world_m':cfg['calibration']['translation_m'],'product_height_m':cfg['process']['product_size_m'][2],'target_world_xy_m':cfg['environment']['pick_carton_center_m'][:2],'roi_half_extents_m':c['target_roi_half_extents_m'],'bias_correction_world_m':cfg['calibration']['simulation_estimator_bias_correction']['correction_world_m'],'scenario_sha256':hashlib.sha256(SCENARIO.read_bytes()).hexdigest(),'estimator_sha256':hashlib.sha256(Path('/ws/robot2-cad/sim/ros_nodes/rgbd_estimator_core.py').read_bytes()).hexdigest(),'phase':self.phase,'estimate':estimate,'nearby_supervisor_metadata_not_exact_pair':self.metadata}
            (folder/'observation.json').write_text(json.dumps(data,indent=2)+'\n')
            print(json.dumps({'saved':name,'stamp_s':key/1e9,'phase':self.phase,'valid':estimate.get('valid'),'points':estimate.get('depth_plane_sample_count'),'bounds':estimate.get('plane_bounds_pixel')}),flush=True)

rclpy.init(); node=Capture()
try:
    while rclpy.ok() and node.count<MAX_FRAMES and time.monotonic()-node.created<360:
        rclpy.spin_once(node,timeout_sec=.15)
finally:
    print('CAPTURE_FINISHED',node.count,flush=True)
    node.destroy_node(); rclpy.shutdown()
