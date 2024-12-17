import { Clock, DoubleSide, MeshStandardMaterial, Texture, Vector2, Vector4 } from 'three';

import vertex from './FlowingMaterial.vertex.glsl';
import fragment from './FlowingMaterial.fragment.glsl';

const cycle = 0.15; // a cycle of a flow map phase
const halfCycle = cycle * 0.5;
const flowSpeed = 0.1;

export class FlowingMaterial extends MeshStandardMaterial {
  private uniforms = {
    uTime: { value: 0 },
    tDebugMap: { value: new Texture() },
    tMap0: { value: new Texture() },
    tMap1: { value: new Texture() },
    config: { value: new Vector4(0, halfCycle, halfCycle, 0) },
  };

  setTime = (delta: number) => {
    // this.uniforms.uTime.value = delta;
    // const config = this.uniforms.config;
    // config.value.x += flowSpeed * delta; // flowMapOffset0
    // config.value.y = config.value.x + halfCycle; // flowMapOffset1
    // if (config.value.x >= cycle) {
    //   console.log('reset1');
    //   config.value.x = 0;
    //   config.value.y = halfCycle;
    // } else if (config.value.y >= cycle) {
    //   console.log('reset2');
    //   config.value.y = config.value.y - cycle;
    // }
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
    const scope = this;

    function updateFlow() {
      const delta = clock.getDelta();
      const config = scope.uniforms['config'];

      config.value.x += flowSpeed * delta; // flowMapOffset0
      config.value.y = config.value.x + halfCycle; // flowMapOffset1

      // Important: The distance between offsets should be always the value of "halfCycle".
      // Moreover, both offsets should be in the range of [ 0, cycle ].
      // This approach ensures a smooth water flow and avoids "reset" effects.

      if (config.value.x >= cycle) {
        config.value.x = 0;
        config.value.y = halfCycle;
      } else if (config.value.y >= cycle) {
        config.value.y = config.value.y - cycle;
      }
    }

    this.onBeforeRender = function (renderer, scene, camera) {
      updateFlow();
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
