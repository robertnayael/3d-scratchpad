import { useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three/webgpu';

type PostProcessingSetup<T> = (scene: THREE.Scene, camera: THREE.Camera, postProcessing: THREE.PostProcessing) => T;

export function usePostprocessing<T = never>(setup: PostProcessingSetup<T>): T | null {
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const renderer = useThree((s) => s.gl as unknown as THREE.WebGPURenderer);

  const [postProcessingState, setPostProcessingState] = useState<T | null>(null);

  // For some reason, postprocessing doesn't work if this is not present
  useFrame(() => {}, Infinity);

  useEffect(() => {
    const postProcessing = new THREE.PostProcessing(renderer);
    postProcessing.outputColorTransform = false;
    renderer.setAnimationLoop(() => postProcessing.render());

    const state = setup(scene, camera, postProcessing);
    setPostProcessingState(state);

    return () => {
      renderer.setAnimationLoop(null);
      postProcessing.dispose();
    };
  }, [scene, camera, renderer]);

  return postProcessingState;
}
