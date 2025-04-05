import { MeshStandardNodeMaterial, Scene } from 'three/webgpu';

export function shadowProxyReceiverMaterial(proxyScene: Scene) {
  const material = new MeshStandardNodeMaterial();

  return material;
}
