import { Camera, Mesh, MeshStandardNodeMaterial, PostProcessing, Renderer, Scene } from 'three/webgpu';
import { pass, time } from 'three/tsl';
import { gaussianBlur } from 'three/addons/tsl/display/GaussianBlurNode.js';

/*
  Render one cube and use the result as the texture on the other cube.
  
  Instead of toggling object visibility, it would be better to use
  different scenes or layers, but I specifically wanted to try this with a single scene.

  And instead of using a second `PostProcessing` instance, it's possible to create
  a `RenderTarget` with some extra setup.
*/

export function setupPostProcessing(
  renderer: Renderer,
  scene: Scene,
  camera: Camera,
  innerCamera: Camera,
  cubes: Record<'a' | 'b', Mesh>,
) {
  const postProcessingA = new PostProcessing(renderer);
  const postProcessingB = new PostProcessing(renderer);

  const scenePassA = pass(scene, camera);
  const scenePassB = pass(scene, innerCamera);

  postProcessingA.outputNode = scenePassA;
  postProcessingB.outputNode = scenePassB;

  const blurStrength = time.toVec2().sin();

  (cubes.a.material as MeshStandardNodeMaterial).colorNode = gaussianBlur(scenePassB, blurStrength, 20);

  return {
    render: () => {
      cubes.a.visible = false;
      cubes.b.visible = true;

      postProcessingB.render();

      cubes.a.visible = true;
      cubes.b.visible = false;

      postProcessingA.render();
    },
  };
}
