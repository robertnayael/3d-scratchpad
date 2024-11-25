import { useRef, useState } from 'react';
import { BoxGeometry, Mesh, MeshNormalMaterial } from 'three';
import { useObjectRotation } from './useObjectRotation';

export function Rotation({ onRotationStateChanged }: { onRotationStateChanged: (rotating: boolean) => void }) {
  const [mat] = useState(new MeshNormalMaterial());
  const [geo] = useState(new BoxGeometry(0.5, 0.5, 0.5));

  const meshRef = useRef<Mesh>(null);

  const bind = useObjectRotation({
    objectRef: meshRef,
    onRotationStateChanged,
  });

  return (
    <>
      <mesh position={[1, 1, 1]} geometry={geo} material={mat} {...bind()} ref={meshRef} />
    </>
  );
}
