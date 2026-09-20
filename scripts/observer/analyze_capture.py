"""Derive presentation layers from an exact-stamp sensor pair, without retouching RGB."""
import hashlib
import json
import math
import shutil
import sys
from pathlib import Path
import numpy as np
from PIL import Image

sys.dont_write_bytecode=True
SOURCE=Path(sys.argv[3] if len(sys.argv)>3 else '/Users/macair/Documents/robot2-cad/sim/ros_nodes/rgbd_estimator_core.py')
sys.path.insert(0,str(SOURCE.parent))
from rgbd_estimator_core import estimate_carton

frame=Path(sys.argv[1]); out=Path(sys.argv[2]); out.mkdir(parents=True,exist_ok=True)
meta_path=frame/('observation.json' if (frame/'observation.json').exists() else 'capture.json')
meta=json.loads(meta_path.read_text())
assert meta['rgb_stamp_ns']==meta['depth_stamp_ns']==meta['camera_info_stamp_ns']
rgb_path=Path(sys.argv[4]) if len(sys.argv)>4 else frame/'rgb.png'
assert hashlib.sha256(SOURCE.read_bytes()).hexdigest()==meta['estimator_sha256']
rgb=np.asarray(Image.open(rgb_path).convert('RGB'))
h,w=rgb.shape[:2]
assert (w,h)==(meta['width'],meta['height'])
raw_depth=(frame/'depth.f32').read_bytes()
dtype='>f4' if meta['depth_bigendian'] else '<f4'
depth=np.frombuffer(raw_depth,dtype=dtype).reshape(h,meta['depth_step']//4)[:,:w]
estimate=estimate_carton(rgb=rgb.tobytes(),rgb_encoding='rgb8',rgb_step=w*3,depth=raw_depth,depth_encoding=meta['depth_encoding'],depth_step=meta['depth_step'],width=w,height=h,camera_k=meta['camera_k'],camera_origin_world_m=meta['camera_origin_world_m'],product_height_m=meta['product_height_m'],sample_stride=1,target_world_xy_m=meta['target_world_xy_m'],roi_half_extents_m=meta['roi_half_extents_m'],top_plane_depth_half_band_m=.003)
assert estimate==meta['estimate'] and estimate['valid']
u,v=np.meshgrid(np.arange(w),np.arange(h)); k=meta['camera_k']; ox,oy,oz=meta['camera_origin_world_m']
wx=ox-(v-k[5])*depth/k[4]; wy=oy-(u-k[2])*depth/k[0]
tx,ty=meta['target_world_xy_m']; hx,hy=meta['roi_half_extents_m']
roi=np.isfinite(depth)&(depth>=1.8)&(depth<=2.7)&(np.abs(wx-tx)<=hx)&(np.abs(wy-ty)<=hy)
r,g,b=rgb.astype(float).transpose(2,0,1)
brown=roi&(r>=55)&(r>1.12*g)&(g>1.05*b)
values=np.sort(depth[brown]); median=float(values[len(values)//2])
mask=roi&(np.abs(depth.astype(float)-median)<=.003)
assert int(mask.sum())==estimate['depth_plane_sample_count']
ys,xs=np.nonzero(mask)
bounds=[int(xs.min()),int(ys.min()),int(xs.max()),int(ys.max())]
assert bounds==estimate['plane_bounds_pixel']
du=xs-xs.mean();dv=ys-ys.mean()
image_angle=.5*math.atan2(2*np.mean(du*dv),np.mean(du*du)-np.mean(dv*dv))

# A categorical mask is analytical output, not an alteration of source pixels.
layer=np.zeros((h,w,4),dtype=np.uint8);layer[mask]=[30,211,204,76]
Image.fromarray(layer).save(out/'surface-mask.png')
seed=np.zeros((h,w,4),dtype=np.uint8);seed[brown]=[211,152,53,90]
Image.fromarray(seed).save(out/'color-seed.png')

# Explicit scientific color mapping of the actual 32-bit metric depth channel.
stops=np.array([[12,44,58],[22,103,123],[92,170,173],[238,242,233]],float)
zmin,zmax=1.,3.3
t=np.where(np.isfinite(depth),np.clip((depth-zmin)/(zmax-zmin),0,1)*3,0)
lo=np.floor(t).astype(int).clip(0,2);alpha=(t-lo)[...,None]
mapped=np.clip(stops[lo]*(1-alpha)+stops[lo+1]*alpha,0,255).astype(np.uint8)
mapped[~np.isfinite(depth)]=[13,24,33]
Image.fromarray(mapped).save(out/'depth.png')
shutil.copyfile(rgb_path,out/'rgb.png')
shutil.copyfile(frame/'depth.f32',out/'depth.f32')
shutil.copyfile(meta_path,out/'capture.json')

is_nominal=w==640 and h==480
position=estimate['position_world_m']
if is_nominal: position=[a+b for a,b in zip(position,meta['bias_correction_world_m'])]
result={
 'schema':'robot2.presentation.annotated_camera.v1',
 'capture_file':'capture.json',
 'native_width':w,'native_height':h,
 'stamp_ns':meta['native_stamp_ns'],'phase':meta['phase'],
 'image_center_px':estimate['centroid_pixel'],'image_bounds_px':bounds,
 'image_principal_axis_rad':image_angle,'world_yaw_rad':estimate['yaw_world_rad'],
 'median_depth_m':estimate['median_depth_m'],'band_half_width_m':.003,
 'accepted_pixels':int(mask.sum()),'color_seed_pixels':int(brown.sum()),
 'position_world_m':position,'bias_correction_applied':is_nominal,
 'resolution_role':'nominal' if is_nominal else 'presentation_only_higher_raster_same_pose_fov_geometry',
 'depth_colormap':{'min_m':zmin,'max_m':zmax,'stops_rgb':stops.astype(int).tolist(),'outside_range':'clipped; invalid dark ink'},
 'annotation_method':'Original estimator re-run at stride 1; exact pixel mask reproduced and count/bounds asserted. Principal axis computed from those same pixel coordinates.',
 'source_rgb_sha256':hashlib.sha256((out/'rgb.png').read_bytes()).hexdigest(),
 'source_depth_sha256':hashlib.sha256(raw_depth).hexdigest(),
 'source_estimator_sha256':meta['estimator_sha256'],
 'scene_note':'Simplified Gazebo simulation geometry, not camera footage from the physical robot.',
 'safety_note':'Illustration acquisition, no qualification or safety credit.'
}
(out/'analysis.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
