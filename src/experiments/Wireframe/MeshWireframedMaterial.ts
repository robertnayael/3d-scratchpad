import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  MeshStandardMaterial,
  MeshStandardMaterialParameters,
  Vector2,
  Vector3,
} from 'three';
import vertex from './MeshWireframedMaterial.vertex.glsl';
import fragment from './MeshWireframedMaterial.fragment.glsl';

type MeshWireframedMaterialParameters = Omit<
  MeshStandardMaterialParameters,
  'transparent' | 'depthWrite' | 'depthTest' | 'side'
>;

/**
 * Extension of the {@link MeshStandardMaterial}, which combines the standard color
 * combined with a stylized wireframe.
 *
 * Applicable to unindexed geometries with a custom `barycentric` attribute.
 *
 * Inspired by https://github.com/mattdesl/webgl-wireframes
 */
export class MeshWireframedMaterial extends MeshStandardMaterial {
  /**
   * Adds a custom `barycentric` attribute to the geometry.
   *
   * @param bufferGeometry input geometry (will be modified in place)
   * @param removeEdge visually removes some edges from the final wireframe
   * @returns same geometry instance
   */
  static addBarycentricCoordinates(bufferGeometry: BufferGeometry, removeEdge = false): BufferGeometry {
    const attrib = bufferGeometry.getIndex() || bufferGeometry.getAttribute('position');
    const count = attrib.count / 3;
    const barycentric = [];

    // for each triangle in the geometry, add the barycentric coordinates
    for (let i = 0; i < count; i++) {
      const even = i % 2 === 0;
      const Q = removeEdge ? 1 : 0;
      if (even) {
        barycentric.push(0, 0, 1, 0, 1, 0, 1, 0, Q);
      } else {
        barycentric.push(0, 1, 0, 0, 0, 1, 1, 0, Q);
      }
    }

    const array = new Float32Array(barycentric);
    const attribute = new BufferAttribute(array, 3);
    bufferGeometry.setAttribute('barycentric', attribute);
    return bufferGeometry;
  }

  private _uniforms = {
    uCursor: { value: new Vector2(-1, -1) },
    uTime: { value: 0 },
    uThicknessModifier: { value: 1.0 },
    uMidThickness: { value: 0.0075 },
    uEndThickness: { value: 0.025 },
    uWireframeColorFront: { value: new Vector3(0.2, 0.2, 0.2) },
    uWireframeColorBack: { value: new Vector3(0.8, 0.8, 0.8) },
  };

  set cursor(position: Vector2) {
    this._uniforms.uCursor.value = position;
  }

  set time(elapsedTime: number) {
    this._uniforms.uTime.value = elapsedTime;
  }

  constructor(params?: MeshWireframedMaterialParameters) {
    super(params);

    // this.customProgramCacheKey = () => Math.random().toString();

    this.transparent = true;
    this.depthTest = true;
    this.side = DoubleSide;

    this.onBeforeCompile = (p) => {
      Object.entries(this._uniforms).forEach(([key, entry]) => {
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
