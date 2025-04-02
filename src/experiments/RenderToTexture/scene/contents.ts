import { BoxGeometry, Mesh, MeshStandardNodeMaterial, Scene } from 'three/webgpu';

export function sceneContents(scene: Scene) {
  const cubes = {
    a: new Mesh(),
    b: new Mesh(),
  };

  cubes.a.geometry = cubes.b.geometry = new BoxGeometry();
  cubes.a.material = new MeshStandardNodeMaterial();
  cubes.b.material = new MeshStandardNodeMaterial({ color: 'orange' });

  scene.add(cubes.a, cubes.b);

  return {
    cubes,
  };
}
