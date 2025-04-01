import { Camera, PostProcessing, Renderer, Scene } from 'three/webgpu';
import { pass } from 'three/tsl';
import { smaa } from 'three/addons/tsl/display/SMAANode.js';

export function setupPostProcessing(renderer: Renderer, scene: Scene, camera: Camera) {
  const postProcessing = new PostProcessing(renderer);

  const scenePass = pass(scene, camera);
  const smaaPass = smaa(scenePass);

  postProcessing.outputNode = smaaPass;

  return postProcessing;
}
