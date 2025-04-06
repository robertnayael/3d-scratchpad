import { PostProcessing } from 'three/webgpu';
import { pass } from 'three/tsl';
import { smaa } from 'three/addons/tsl/display/SMAANode.js';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';
import { getStore } from './store';

export function setupPostProcessing() {
  const { renderer, scene, camera } = getStore();

  const postProcessing = new PostProcessing(renderer);

  const scenePass = pass(scene, camera);
  const smaaPass = smaa(scenePass);

  const bloomPass = bloom(scenePass.getTextureNode(), 0.2, 0.1, 0.4);

  const outputs = {
    withBloom: smaaPass.add(bloomPass),
    noBloom: smaaPass,
  };

  getStore().onSettingsChange(({ bloomEnabled }) => {
    if (bloomEnabled) {
      postProcessing.outputNode = outputs.withBloom;
    } else {
      postProcessing.outputNode = outputs.noBloom;
    }
    postProcessing.needsUpdate = true;
  });

  return postProcessing;
}
