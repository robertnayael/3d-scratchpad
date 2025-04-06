import { Scene, WebGPURenderer } from 'three/webgpu';
import { VanillaThree } from '@/common';
import { initializeSettings } from './settings';
import { setupContents } from './scene/contents';
import { setupPostProcessing } from './postProcessing';
import { setupControls } from './controls';
import { setupCamera } from './camera';
import { setStore } from './store';

export const initialize: VanillaThree.Initializer = async ({ domContainer, handleViewportChange, handleCleanup }) => {
  const renderer = await new WebGPURenderer({ antialias: false, forceWebGL: true }).init();
  domContainer.appendChild(renderer.domElement);

  const { onSettingsChange, disposeSettingsGui } = initializeSettings();

  const { camera } = setStore({
    renderer,
    onSettingsChange,
    camera: setupCamera(),
    scene: new Scene(),
  });

  const controls = setupControls();

  const { animation } = setupContents();

  const postProcessing = setupPostProcessing();

  renderer.setAnimationLoop((deltaTime) => {
    controls.update(deltaTime);
    animation();
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
    disposeSettingsGui();
  });
};
