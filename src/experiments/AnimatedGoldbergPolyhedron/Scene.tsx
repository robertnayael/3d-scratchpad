import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';
import { Perf } from 'r3f-perf';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { CameraControls, Grid, MeshReflectorMaterial, PerformanceMonitor } from '@react-three/drei';
import { Polyhedron } from './Polyhedron';

export function Scene() {
  return (
    <>
      <Canvas shadows={true} camera={{ position: [1.25, 0.01, 1.25], fov: 100 }}>
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
  return (
    <>
      <CameraControls minPolarAngle={1.6} maxPolarAngle={1.6} />
      <Grid
        position={[0, 0, 0]}
        infiniteGrid
        fadeDistance={20}
        cellColor={'#ffffff'}
        sectionThickness={0.5}
        cellSize={0.1}
        visible={false}
      />
      <ambientLight intensity={0.3} />
      <spotLight position={[35, 35, 35]} angle={0.13} intensity={20000} castShadow={true} color="rgb(255, 255, 255)" />
      <Polyhedron />

      <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, -1.25, 0]}>
        <planeGeometry args={[10, 10]} />
        <MeshReflectorMaterial
          blur={2048}
          mixBlur={1}
          mixStrength={0.2}
          mixContrast={1}
          resolution={2048}
          mirror={1}
          depthScale={1}
          depthToBlurRatioBias={0.25}
          distortion={1}
          reflectorOffset={0.1}
        />
      </mesh>

      <EffectComposer>
        <Bloom mipmapBlur={true} luminanceThreshold={0.2} radius={0.5} intensity={1.9} />
      </EffectComposer>
    </>
  );
}
