import { useMemo, useState } from 'react';
import { MeshProps, useFrame, useThree } from '@react-three/fiber';
import { BufferGeometry, ColorRepresentation, Material, SphereGeometry, TorusGeometry, TorusKnotGeometry } from 'three';
import { MeshWireframedMaterial } from './MeshWireframedMaterial';

type Variant = 'torus' | 'torusKnot' | 'sphere';

export function StandardObject({
  color,
  position,
  variant,
}: {
  color: ColorRepresentation;
  position: MeshProps['position'];
  variant: Variant;
}) {
  const geometry = useGeometry(variant);
  const material = useMaterial(color);

  return <mesh geometry={geometry} material={material} position={position} />;
}

const useGeometry = (v: Variant): BufferGeometry =>
  useMemo(
    () =>
      MeshWireframedMaterial.addBarycentricCoordinates(
        {
          torus: new TorusGeometry(1, 0.3, 8, 30),
          torusKnot: new TorusKnotGeometry(1, 0.3, 100, 10),
          sphere: new SphereGeometry(1, 32, 16),
        }[v].toNonIndexed(),
        true,
      ),
    [v],
  );

const useMaterial = (color: ColorRepresentation): Material => {
  const [material] = useState(
    new MeshWireframedMaterial({
      color,
    }),
  );

  const cursor = useThree((s) => s.pointer);

  useFrame(({ clock }) => {
    material.time = clock.getElapsedTime();
    material.cursor = cursor;
  });

  return material;
};
