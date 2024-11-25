import { useRef, useState } from 'react';
import { BoxGeometry, Mesh, MeshNormalMaterial, TorusKnotGeometry } from 'three';
import { useObjectRotation } from './useObjectRotation';

export function Rotation({ onRotationStateChanged }: { onRotationStateChanged: (rotating: boolean) => void }) {
  const [mat] = useState(new MeshNormalMaterial());
  const [geo] = useState(new TorusKnotGeometry(1));

  const meshRef = useRef<Mesh>(null);

  const bind = useObjectRotation({
    objectRef: meshRef,
    onRotationStateChanged,
    onRotate: ({ rotation }) => meshRef.current!.quaternion.set(...rotation.toArray()),
  });

  return (
    <>
      <mesh position={[1, 1, 1]} geometry={geo} material={mat} {...bind()} ref={meshRef} />
    </>
  );
}
