import { PerspectiveCamera } from 'three/webgpu';

export function setupCamera() {
  const camera = new PerspectiveCamera();
  camera.position.z = 5;

  const innerCamera = new PerspectiveCamera();
  innerCamera.position.z = 5;

  return { camera, innerCamera };
}
