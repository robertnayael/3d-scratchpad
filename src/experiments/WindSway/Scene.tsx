import { MathUtils, Vector3 } from 'three';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Grid, PerformanceMonitor } from '@react-three/drei';
import { Perf } from 'r3f-perf';

import { Grass } from './Grass';

export function Scene() {
  return (
    <Canvas shadows={true} camera={{ position: [5, 5, 10] }}>
      <PerformanceMonitor>
        <Contents />
      </PerformanceMonitor>
      <Perf position="top-left" showGraph={true} />
    </Canvas>
  );
}

function Contents() {
  const grass = Grass.use();

  return (
    <>
      <CameraControls />
      <Grid position={[0, 0.49, 0]} infiniteGrid fadeDistance={20} cellColor={'#ffffff'} sectionThickness={0.5} />
      <ambientLight intensity={0.3} />
      <spotLight position={[35, 35, 0]} angle={0.13} intensity={2000} castShadow={true} color="rgb(255, 255, 255)" />
      <Terrain onAddTree={grass.populate} />
      <grass.Component />
    </>
  );
}

function Terrain({ onAddTree }: { onAddTree: (at: Vector3) => void }) {
  return (
    <mesh onDoubleClick={(e) => onAddTree(e.point)} rotation={[MathUtils.degToRad(90), 0, 0]} position={[0, 0.5, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color={`#567100`} side={2} />
    </mesh>
  );
}
