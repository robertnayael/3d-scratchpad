import { Leva } from 'leva';
import { CameraControls, Stats } from '@react-three/drei';
import { WebGPUCanvas } from './WebGPUCanvas';
import { Foliage } from './Foliage';

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
  return (
    <>
      <CameraControls />
      <ambientLight intensity={1} />
      <spotLight
        position={[20, 20, 20]}
        angle={Math.PI / 20}
        intensity={4000}
        castShadow={true}
        // shadow-camera-near={7}
        // shadow-camera-far={10}
        // shadow-blurSamples={20}
        // shadow-radius={10}
        // shadow-bias={-0.025}
        // shadow-mapSize={[2048, 2048]}
        color="rgb(255, 255, 255)"
        visible={true}
      />
      {/* <hemisphereLight /> */}
      <directionalLight position={[-20, 0, -20]} intensity={5} visible={false} />
      <Foliage />
    </>
  );
}
