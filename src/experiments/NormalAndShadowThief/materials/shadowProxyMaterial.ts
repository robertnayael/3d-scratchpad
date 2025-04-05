import { normalView, uv, vec4 } from 'three/tsl';
import { MeshStandardNodeMaterial, MeshToonNodeMaterial } from 'three/webgpu';

export function shadowProxyMaterial() {
  const material = new MeshStandardNodeMaterial();

  material.colorNode = vec4(normalView, 1);

  return material;
}
