import { CameraControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { StandardObject } from './StandardObject';

export function WireframeScene() {
  return (
    <Canvas shadows={true} camera={{ position: [0, 0, 3] }} style={{ background: 'radial-gradient(#f6f6f6, #d0d0d0)' }}>
      <CameraControls />
      <spotLight position={[4, 4, 4]} intensity={50} castShadow={true} />
      <ambientLight intensity={1} />
      <StandardObject variant="torusKnot" color="yellow" position={[0, 0, 0]} />
      <StandardObject variant="torus" color="lightgreen" position={[2, 0, -2]} />
      <StandardObject variant="sphere" color="pink" position={[-2, -1, -3]} />
    </Canvas>
  );
}
