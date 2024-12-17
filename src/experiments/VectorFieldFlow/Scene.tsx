import { Canvas, useThree } from '@react-three/fiber';
import { CameraControls, Grid, PerformanceMonitor } from '@react-three/drei';
import { Leva } from 'leva';
import { Perf } from 'r3f-perf';
import { Contents } from './Contents';
import { useEffect } from 'react';

export function Scene() {
  return (
    <>
      <Canvas shadows={true} camera={{ position: [5, 5, 10] }} style={{ background: 'transparent' }}>
        <PerformanceMonitor>
          <SceneInner />
        </PerformanceMonitor>
        <Perf position="top-left" showGraph={true} />
      </Canvas>
      <Leva flat titleBar={false} hideCopyButton oneLineLabels theme={{ sizes: { rootWidth: '300px' } }} />
    </>
  );
}

function SceneInner() {
  const camera = useThree().camera;

  useEffect(() => {
    camera.position.set(2, 2, 16);
    camera.lookAt(2, 2, 0);
  }, []);

  return (
    <>
      {/* <CameraControls /> */}
      <Grid
        position={[0, 0, 0]}
        infiniteGrid
        fadeDistance={20}
        cellColor={'#ffffff'}
        sectionThickness={0.5}
        rotation={[Math.PI / 2, 0, 0]}
        visible={false}
      />
      <axesHelper />
      <ambientLight intensity={0.3} />
      <spotLight position={[35, 35, 0]} angle={0.13} intensity={2000} castShadow={true} color="rgb(255, 255, 255)" />
      <Contents />
    </>
  );
}
