import { useEffect } from 'react';
import { Leva, useControls } from 'leva';
import { float, mrt, output, pass } from 'three/tsl';
import { CameraControls, Stats } from '@react-three/drei';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';
import { smaa } from 'three/addons/tsl/display/SMAANode.js';
import { WebGPUCanvas } from './WebGPUCanvas';
import { usePostprocessing } from './usePostprocessing';
import { Polyhedron } from './Polyhedron';

export function Scene() {
  return (
    <>
      <WebGPUCanvas shadows={'variance'} camera={{ position: [1.25, 0.01, 1.25], fov: 100 }} background={0x333333}>
        <Stats showPanel={0} />
        <Contents />
      </WebGPUCanvas>
      <Leva flat titleBar={false} hideCopyButton oneLineLabels={false} theme={{ sizes: { rootWidth: '400px' } }} />
    </>
  );
}

function Contents() {
  const postProcessing = usePostprocessing((scene, camera, postProcessing) => {
    const scenePass = pass(scene, camera);
    scenePass.setMRT(
      mrt({
        output,
        bloomIntensity: float(0),
      }),
    );

    const outputPass = scenePass.getTextureNode();
    const smaaPass = smaa(outputPass);
    const bloomIntensityPass = scenePass.getTextureNode('bloomIntensity');
    const bloomPass = bloom(smaaPass.mul(bloomIntensityPass), 0, 0, 0);
    postProcessing.outputNode = smaaPass.add(bloomPass).renderOutput();

    return {
      bloomPass,
    };
  });

  const settings = {
    bloom: useControls('Bloom', {
      strength: {
        label: 'strength',
        value: 0.3,
        min: 0,
        max: 5,
        step: 0.01,
      },
      radius: {
        label: 'radius',
        value: 0,
        min: 0,
        max: 1,
        step: 0.01,
      },
    }),
  };

  useEffect(() => {
    if (!postProcessing) return;
    postProcessing.bloomPass.strength.value = settings.bloom.strength;
    postProcessing.bloomPass.radius.value = settings.bloom.radius;
  }, [settings.bloom, postProcessing]);

  return (
    <>
      <CameraControls /*minPolarAngle={1.6} maxPolarAngle={1.6}*/ />
      <ambientLight intensity={0.1} />
      <spotLight
        position={[5, 5, 5]}
        angle={Math.PI / 20}
        intensity={400}
        castShadow={true}
        shadow-camera-near={7}
        shadow-camera-far={10}
        shadow-blurSamples={20}
        shadow-radius={10}
        // shadow-bias={-0.025}
        // shadow-mapSize={[2048, 2048]}
        color="rgb(255, 255, 255)"
      />
      <Polyhedron />
    </>
  );
}
