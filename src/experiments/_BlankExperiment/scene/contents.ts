import { BoxGeometry, Mesh, MeshStandardNodeMaterial } from 'three/webgpu';
import { setupLights } from './lights';
import { getStore } from '../store';

export function setupContents() {
  const { scene } = getStore();

  setupLights();

  const cube = new Mesh();
  cube.geometry = new BoxGeometry();
  cube.material = new MeshStandardNodeMaterial({ color: 'orange' });
  scene.add(cube);

  return {
    animation: () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    },
  };
}
