import { BoxGeometry, Mesh, MeshStandardNodeMaterial, Scene } from 'three/webgpu';

export function sceneContents(scene: Scene) {
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
