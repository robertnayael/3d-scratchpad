import { PerspectiveCamera } from 'three/webgpu';

export function setupCamera() {
  const camera = new PerspectiveCamera();
  camera.position.x = 8.3;
  camera.position.y = 1.8;
  camera.position.z = -0.3;
  return camera;
}
