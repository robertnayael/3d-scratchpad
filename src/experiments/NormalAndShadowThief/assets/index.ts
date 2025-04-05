import { BufferGeometry, Mesh, TextureLoader } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import quadMeshModel from './quadMesh.glb';
import alphaMapImage from './alphaMap.png';

export async function quadMeshGeometry() {
  const model = await new GLTFLoader().loadAsync(quadMeshModel);

  const meshes = model.scene.children as Mesh[];

  const mainGeometry = meshes.find((item) => item.name === 'Quads')?.geometry;
  const proxyGeometry = meshes.find((item) => item.name === 'Icosphere')?.geometry;

  if (!(mainGeometry instanceof BufferGeometry) || !(proxyGeometry instanceof BufferGeometry)) {
    throw new Error('Could not load geometry from GLB model');
  }

  return {
    main: mainGeometry,
    proxy: proxyGeometry,
  };
}

export async function quadMeshMaps() {
  const alphaMap = await new TextureLoader().loadAsync(alphaMapImage);

  return {
    alpha: alphaMap,
  };
}
