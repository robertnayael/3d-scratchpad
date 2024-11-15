import { MathUtils, Vector3 } from 'three';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Grid, PerformanceMonitor } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import { Trees } from './Trees';

export function Scene() {
  return (
    <Canvas shadows={true} camera={{ position: [0, 0, 10] }}>
      <PerformanceMonitor>
        <Contents />
      </PerformanceMonitor>
      <Perf position="top-left" showGraph={true} />
    </Canvas>
  );
}

function Contents() {
  const trees = Trees.useState();
  return (
    <>
      <CameraControls />
      <Grid position={[0, -0.01, 0]} infiniteGrid fadeDistance={20} cellColor={'#ffffff'} sectionThickness={0.5} />
      <ambientLight intensity={1} />
      <spotLight
        position={[20, 20, 20]}
        angle={0.13}
        penumbra={1}
        decay={0}
        intensity={5}
        castShadow={true}
        color="rgb(255, 255, 255)"
      />
      <Terrain onAddTree={trees.add} />
      <trees.Component />
    </>
  );
}

function Terrain({ onAddTree }: { onAddTree: (at: Vector3) => void }) {
  return (
    <mesh onClick={(e) => onAddTree(e.point)} rotation={[MathUtils.degToRad(90), 0, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshLambertMaterial color={'green'} side={2} />
    </mesh>
  );
}
