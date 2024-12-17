import { Clock, DoubleSide, MeshStandardMaterial, Texture } from 'three';

import vertex from './FlowingMaterial.vertex.glsl';
import fragment from './FlowingMaterial.fragment.glsl';

export class FlowingMaterial extends MeshStandardMaterial {
  private debugMode = false;

  private uniforms = {
    uTime: { value: 0 },
    _DebugMap: { value: new Texture() },
  };

  private setElapsedTime = (value: number) => {
    if (this.debugMode) return;
    this.uniforms.uTime.value = value;
  };

  setDebugTime = (value: number) => {
    if (value === 0) {
      this.debugMode = false;
    } else {
      this.debugMode = true;
      this.uniforms.uTime.value = value;
    }
  };

  setDebugMap = (value: Texture) => {
    this.uniforms._DebugMap.value = value;
  };

  setTexture = (a: Texture, b: Texture) => {
    this.uniforms.tMap0.value = a;
    this.uniforms.tMap1.value = b;
  };

  constructor() {
    super({ side: DoubleSide, transparent: true });
    this.onBeforeCompile = (p) => {
      Object.entries(this.uniforms).forEach(([key, entry]) => {
        p.uniforms[key] = entry;
      });

      p.vertexShader = this.prepareVertexShader(p.vertexShader);
      p.fragmentShader = this.prepareFragmentShader(p.fragmentShader);
    };

    const clock = new Clock();

    this.onBeforeRender = () => this.setElapsedTime(clock.getElapsedTime());
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
