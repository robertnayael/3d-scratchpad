import { useState } from 'react';
import { createGeometry } from './geometry';
import { PolyhedronMaterial } from './PolyhedronMaterial';
import { useFrame } from '@react-three/fiber';

export function Polyhedron(): React.ReactNode {
  const [geometry] = useState(createGeometry());
  const [material] = useState(new PolyhedronMaterial());

  useFrame(({ clock }) => {
    material.setTime(clock.getElapsedTime());
  });

  return (
    <>
      <mesh geometry={geometry} material={material} />
      <mesh>
        <sphereGeometry />
        <meshStandardMaterial color="black" />
      </mesh>
    </>
  );
}
