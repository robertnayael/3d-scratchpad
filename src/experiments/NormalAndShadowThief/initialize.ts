import { PCFSoftShadowMap, Scene, WebGPURenderer } from 'three/webgpu';
import { VanillaThree } from '@/common';
import { disposeStore, setStore } from './store';
import { sceneContents } from './scene/contents';
import { setupPostProcessing } from './postProcessing';
import { setupControls } from './controls';
import { setupCamera } from './camera';
import { initializeSettings } from './settings';

export const initialize: VanillaThree.Initializer = async ({ domContainer, handleViewportChange, handleCleanup }) => {
  const renderer = await new WebGPURenderer({ antialias: false, forceWebGL: true }).init();
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  domContainer.appendChild(renderer.domElement);

  const { onSettingsChange, disposeSettingsGui } = initializeSettings();

  const { camera } = setStore({
    renderer,
    camera: setupCamera(),
    onSettingsChange,
    scenes: {
      main: new Scene(),
      proxy: new Scene(),
    },
  });

  const controls = setupControls();

  const postProcessing = setupPostProcessing();

  renderer.setAnimationLoop((deltaTime) => {
    controls.update(deltaTime);
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
    disposeStore();
    disposeSettingsGui();
  });

  await sceneContents();
};
