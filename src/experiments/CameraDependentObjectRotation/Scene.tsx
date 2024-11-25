import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Grid, PerformanceMonitor } from '@react-three/drei';
import { Leva } from 'leva';
import { Perf } from 'r3f-perf';
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
      <axesHelper />
      <Rotation onRotationStateChanged={setCameraControlsDisabled} />
    </>
  );
}
