import { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { createGeometry } from './geometry';
import { createPolyhedronMaterial } from './PolyhedronNodeMaterial';

export function Polyhedron(): React.ReactNode {
  const [geometry] = useState(createGeometry());
  const [m] = useState(createPolyhedronMaterial());

  useFrame(({ clock }) => {
    m.setTime(clock.getElapsedTime());
  });

  return (
    <>
      <mesh geometry={geometry} material={m.material} castShadow receiveShadow />
      <mesh castShadow>
        <sphereGeometry />
        <meshBasicMaterial color={0x000000} />
      </mesh>
    </>
  );
}
