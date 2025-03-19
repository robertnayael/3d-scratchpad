import { MeshLambertMaterial } from 'three';

import vertex from './PolyhedronMaterial.vertex.glsl';
import fragment from './PolyhedronMaterial.fragment.glsl';

export class PolyhedronMaterial extends MeshLambertMaterial {
  private uniforms = {
    uTime: { value: 0 },
  };

  setTime = (value: number) => {
    this.uniforms.uTime.value = value;
  };

  constructor() {
    super({ flatShading: false });
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
    console.log(shader);
    const match = shader.match(/(.*)void main\s?\(\)\s?\{(.*)\}$/s);
    const definitions = match?.at(1) ?? '';
    const main = match?.at(2) ?? '';

    return fragment.replace('#pragma three_definitions', definitions).replace('#pragma three_main', main);
  }
}
