import { CameraControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { StandardObject } from './StandardObject';
import { Parrot } from './Parrot';

export function WireframeScene() {
  return (
    <Canvas shadows={true} camera={{ position: [5, 5, 5] }} style={{ background: 'radial-gradient(#f6f6f6, #d0d0d0)' }}>
      <CameraControls />
      <spotLight position={[4, 4, 4]} intensity={50} castShadow={true} />
      <ambientLight intensity={0.2} />
      <StandardObject variant="torusKnot" color="yellow" position={[-4, 3, 2]} />
      <StandardObject variant="torus" color="lightgreen" position={[4, 0, -2]} />
      <StandardObject variant="sphere" color="pink" position={[-4, -1, -7]} />
      <Parrot position={[0, 0, 0]} />
    </Canvas>
  );
}
