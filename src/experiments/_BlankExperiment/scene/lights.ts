import { AmbientLight, DirectionalLight } from 'three/webgpu';
import { getStore } from '../store';

export function setupLights() {
  const { scene } = getStore();

  const lights = {
    directional: new DirectionalLight(),
    ambient: new AmbientLight(),
  };

  lights.directional.position.x = 5;
  lights.directional.position.y = 10;
  lights.directional.position.z = 15;
  lights.directional.intensity = 3;

  scene.add(lights.directional, lights.ambient);
}
