/** Values recomputed from evidence/observer-camera/hd/capture.json.
 * This HD illustration changes only sensor raster size, not its pose or FOV.
 * The nominal 640px bias correction is deliberately NOT applied.
 */
export const observerCapture = {
  width: 1920, height: 1440,
  stampNs: 36762000000,
  center: [577, 401.5],
  bounds: [455, 218, 699, 585],
  imageAxisRad: 1.5707568068003115,
  medianDepthM: 2.2400002479553223,
  acceptedPixels: 90159,
  position: [1.7203709597504946, 0.6257522059166071, 0.7499997520446778],
  yawRad: 3.9519994584846785e-05,
  biasCorrectionApplied: false,
} as const
