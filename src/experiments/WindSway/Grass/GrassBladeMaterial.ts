import { DoubleSide, MeshStandardMaterial, Vector3 } from 'three';

import vertex from './GrassBladeMaterial.vertex.glsl';
import fragment from './GrassBladeMaterial.fragment.glsl';

export class GrassBladeMaterial extends MeshStandardMaterial {
  private uniforms = {
    uTime: { value: 0 },
    uWindDirection: { value: new Vector3(1, 0, 1) },
    uWindStrength: { value: 1.0 },
  };

  set time(elapsedTime: number) {
    this.uniforms.uTime.value = elapsedTime;
  }

  constructor() {
    super({ side: DoubleSide });
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
