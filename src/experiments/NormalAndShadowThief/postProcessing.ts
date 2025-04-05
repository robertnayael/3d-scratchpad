import { PostProcessing } from 'three/webgpu';
import { pass } from 'three/tsl';
import { getStore } from './store';
import { smaa } from 'three/examples/jsm/tsl/display/SMAANode.js';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';

export function setupPostProcessing() {
  const { renderer, scenes, camera, onSettingsChange } = getStore();

  const mainScenePass = pass(scenes.main, camera);
  const proxyScenePass = pass(scenes.proxy, camera);

  const mainSceneBloomPass = bloom(mainScenePass.getTextureNode(), 0.2, 0.1, 0.4);

  const outputs = {
    main: smaa(mainScenePass).add(mainSceneBloomPass),
    proxy: proxyScenePass,
  };

  const postProcessing = new PostProcessing(renderer);

  onSettingsChange(({ activeScene, bloom, showNormals }) => {
    mainSceneBloomPass.strength.value = showNormals ? 0 : bloom.strength;
    mainSceneBloomPass.radius.value = bloom.radius;
    mainSceneBloomPass.threshold.value = bloom.threshold;

    const currentOutput = outputs[activeScene];
    if (postProcessing.outputNode === currentOutput) return;
    postProcessing.outputNode = currentOutput;
    postProcessing.needsUpdate = true;
  });

  return {
    render: () => {
      postProcessing.render();
    },
  };
}
