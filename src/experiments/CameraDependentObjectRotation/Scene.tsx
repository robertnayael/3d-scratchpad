import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Grid, PerformanceMonitor } from '@react-three/drei';
import { Leva } from 'leva';
import { Perf } from 'r3f-perf';
import { Axis } from '@/helpers/Axis';
import { Rotation } from './Rotation';

export function Scene() {
  return (
    <>
      <Canvas shadows={true} camera={{ position: [5, 5, 10] }}>
        <PerformanceMonitor>
          <Contents />
        </PerformanceMonitor>
        <Perf position="top-left" showGraph={true} />
      </Canvas>
      <Leva flat titleBar={false} hideCopyButton oneLineLabels theme={{ sizes: { rootWidth: '300px' } }} />
    </>
  );
}

function Contents() {
  const [cameraControlsDisabled, setCameraControlsDisabled] = useState(false);

  return (
    <>
      <CameraControls enabled={!cameraControlsDisabled} />
      <Grid infiniteGrid fadeDistance={20} cellColor={'#ffffff'} sectionThickness={0.5} />
      <Rotation onRotationStateChanged={setCameraControlsDisabled} />
      <group position={[-2, 0, 2]}>
        <Axis direction={[1, 0, 0]} length={2} color="blue" label="X" />
        <Axis direction={[0, 1, 0]} length={2} color="orange" label="Y" />
        <Axis direction={[0, 0, -1]} length={2} color="green" label="Z" />
      </group>
    </>
  );
}
