import { ColorRepresentation, DoubleSide, MeshLambertMaterial, Quaternion } from 'three';

import vertex from './SurfaceStrandMaterial.vertex.glsl';
import fragment from './SurfaceStrandMaterial.fragment.glsl';

export class SurfaceStrandMaterial extends MeshLambertMaterial {
  private uniforms = {
    uTime: { value: 0 },
    uStrandRotation: { value: new Quaternion() },
  };

  setTime = (value: number) => {
    this.uniforms.uTime.value = value;
  };

  setStrandRotation = (value: Quaternion) => {
    this.uniforms.uStrandRotation.value = value;
  };

  constructor(color?: ColorRepresentation) {
    super({ side: DoubleSide, color });
    this.onBeforeCompile = (p) => {
      Object.entries(this.uniforms).forEach(([key, entry]) => {
        p.uniforms[key] = entry;
      });

      p.vertexShader = this.prepareVertexShader(p.vertexShader);
      p.fragmentShader = this.prepareFragmentShader(p.fragmentShader);
    };
  }

  private prepareVertexShader(shader: string): string {
    const match = shader.match(/(.*)void main\s?\(\)\s?\{(.*)\}$/s);
    const definitions = match?.at(1) ?? '';
    const main = match?.at(2) ?? '';

    return vertex.replace('#pragma three_definitions', definitions).replace('#pragma three_main', main);
  }

  private prepareFragmentShader(shader: string): string {
    const match = shader.match(/(.*)void main\s?\(\)\s?\{(.*)\}$/s);
    const definitions = match?.at(1) ?? '';
    const main = match?.at(2) ?? '';

    return fragment.replace('#pragma three_definitions', definitions).replace('#pragma three_main', main);
  }
}
