import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';
import { Perf } from 'r3f-perf';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { CameraControls, Grid, PerformanceMonitor, Reflector } from '@react-three/drei';
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

      <Reflector
        blur={[512, 512]}
        mixBlur={1}
        mixStrength={1}
        resolution={2048}
        args={[10, 10]}
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[0, -1.25, 0]}
        mirror={1}
        minDepthThreshold={0.75}
        maxDepthThreshold={0.95}
        depthScale={1}
      >
        {(Material, props) => <Material metalness={0.5} roughness={1} color={'rgb(70, 70, 70)'} {...props} />}
      </Reflector>

      <EffectComposer>
        <Bloom mipmapBlur={true} luminanceThreshold={0.2} radius={0.5} intensity={1.9} />
      </EffectComposer>
    </>
  );
}
