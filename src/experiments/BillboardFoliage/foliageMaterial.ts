import { vec3, attribute, faceDirection, materialNormal, normalView, texture } from 'three/tsl';
import { Material, MeshStandardNodeMaterial, TextureLoader } from 'three/webgpu';
import foliageMapFile from './map1.png';

export function foliageMaterial(): Material {
  const loader = new TextureLoader();
  const foliageMap = loader.load(foliageMapFile);
  foliageMap.generateMipmaps = true;

  console.log(foliageMapFile);
  const material = new MeshStandardNodeMaterial({
    side: 2,
    flatShading: false,
    wireframe: false,
    color: 'green',
    roughness: 1,
  });

  // const quadPlaneNormal = attribute('quadPlaneNormal', 'vec3');
  // const quadAlignment = ???

  const diff = vec3(0, 0, 1).dot(normalView); // TODO:

  const cameraFacingNormal = vec3(0, 0, 1).mul(faceDirection);
  const originalNormal = vec3(materialNormal).mul(faceDirection);
  // const originalNormal = vec3(positionView).mul(faceDirection);
  const newNormal = originalNormal.mul(diff).add(cameraFacingNormal.mul(diff.oneMinus())).normalize();

  material.normalNode = newNormal;

  material.alphaTestNode = texture(foliageMap).rgb.oneMinus();

  return material;
}
