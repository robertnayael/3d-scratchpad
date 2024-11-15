import { useEffect, useRef } from 'react';
import { useAnimations } from '@react-three/drei';
import { Mesh, MeshStandardMaterial } from 'three';
import { MeshProps, useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshWireframedMaterial } from './MeshWireframedMaterial';
import ParrotModel from './Parrot.glb';

export function Parrot({ position }: { position?: MeshProps['position'] }) {
  const group = useRef();
  const gltf = useLoader(GLTFLoader, ParrotModel);
  const { actions } = useAnimations(gltf.animations, group);

  useEffect(() => {
    actions['parrot_A_']?.play();
  }, [actions]);

  const mesh = gltf.nodes['mesh_0'] as Mesh;

  useEffect(() => {
    mesh.geometry = mesh.geometry.toNonIndexed();
    MeshWireframedMaterial.addBarycentricCoordinates(mesh.geometry);
    mesh.geometry.computeVertexNormals();
    const oldMaterial = mesh.material as MeshStandardMaterial;
    const newMaterial = new MeshWireframedMaterial(oldMaterial as unknown as Record<string, never>);
    mesh.material = newMaterial;
  }, [mesh]);

  const cursor = useThree((s) => s.pointer);
  useFrame(({ clock }) => {
    const material = mesh.material as MeshWireframedMaterial;
    material.time = clock.getElapsedTime();
    material.cursor = cursor;
  });

  return <primitive object={mesh} ref={group} scale={0.1} position={position} />;
}
