import { Scene, WebGPURenderer } from 'three/webgpu';
import { VanillaThree } from '@/common';
import { sceneContents } from './scene/contents';
import { sceneLights } from './scene/lights';
import { setupPostProcessing } from './postProcessing';
import { setupControls } from './controls';
import { setupCamera } from './camera';

export const initialize: VanillaThree.Initializer = async ({ domContainer, handleViewportChange, handleCleanup }) => {
  const renderer = await new WebGPURenderer({ antialias: false, forceWebGL: true }).init();
  domContainer.appendChild(renderer.domElement);

  const { camera, innerCamera } = setupCamera();
  const controls = setupControls(camera, renderer);

  const scene = new Scene();
  const { cubes } = sceneContents(scene);
  sceneLights(scene);

  const postProcessing = setupPostProcessing(renderer, scene, camera, innerCamera, cubes);

  renderer.setAnimationLoop((deltaTime) => {
    controls.update(deltaTime);

    // Keep in sync with main camera but maintain constant aspect ratio
    innerCamera.copy(camera);
    innerCamera.aspect = 1;
    innerCamera.updateProjectionMatrix();

    postProcessing.render();
  });

  handleViewportChange(({ width, height, aspect, pixelRatio }) => {
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
  });

  handleCleanup(() => {
    renderer.dispose();
  });
};
