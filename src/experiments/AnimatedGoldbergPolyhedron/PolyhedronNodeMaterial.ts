import { attribute, uniform, vec4, vec3, clamp, mix, positionGeometry, mrt, select } from 'three/tsl';
import { MeshLambertNodeMaterial } from 'three/webgpu';
import { cnoise } from './tslUtils';

export function createPolyhedronMaterial() {
  const time = uniform(0);
  const positionAlt = attribute('positionAlt', 'vec3') as ReturnType<typeof vec3>;
  const polygonCenter = attribute('polygonCenter', 'vec3') as ReturnType<typeof vec3>;

  const material = new MeshLambertNodeMaterial({ flatShading: false });

  material.colorNode = vec4(1, 0, 0, 1);

  const displacement = clamp(cnoise(vec4(polygonCenter.mul(5), time)), 0, 1)
    .mul(0.8)
    .mul(2);
  const displacement2 = clamp(cnoise(vec4(polygonCenter.mul(25), time)), 0, 1).mul(0.2);

  material.positionNode = mix(positionGeometry, positionAlt, displacement.add(displacement2));

  const colorA = vec3(0.39, 0.05, 0.53);
  const colorB = vec3(0.96, 0.5, 0.76);
  const finalColor = mix(colorA, colorB, displacement.mul(1.5));
  material.colorNode = clamp(finalColor, vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));

  material.castShadowNode = vec4(0.1, 0, 0.1, 1);

  material.mrtNode = mrt({
    bloomIntensity: select(displacement.greaterThan(0.5), 1, 0),
  });

  return {
    material,
    setTime: (value: number) => (time.value = value),
  };
}
