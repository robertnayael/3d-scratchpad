import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  MeshStandardMaterial,
  MeshStandardMaterialParameters,
  Vector2,
  Vector3,
} from 'three';

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
    return shader
      .replace('void main()', `${glsl.vert.variables}\nvoid main()`)
      .replace(/}\s*$/, `${glsl.vert.main}\n}`);
  }

  private prepareFragmentShader(shader: string): string {
    return shader
      .replace('void main()', `${glsl.frag.variables}\n${glsl.frag.functions.join('\n')}\nvoid main()`)
      .replace(/}\s*$/, `${glsl.frag.main}\n}`);
  }
}

const glsl = {
  vert: {
    variables: `
attribute vec3 barycentric;
varying vec3 vBarycentric;
varying vec2 vScreenPosition;
varying vec3 vWorldNormal;
varying vec3 vWorldFragPos;
    `,
    main: `
vScreenPosition = gl_Position.xy / gl_Position.w * 0.5 + 0.5;

vBarycentric = barycentric;
// vPosition = position.xyz;
// vUv = uv;

// We need these for determining face direction relative to camera (front/backfacing):
vWorldNormal = normalize(mat3(modelMatrix) * normal);
vec4 worldPos = modelMatrix * vec4(position, 1.0);
vWorldFragPos = worldPos.xyz;
    `,
  },
  frag: {
    variables: `
uniform float uThicknessModifier;
uniform float uMidThickness;
uniform float uEndThickness;
    
uniform vec3 uWireframeColorFront;
uniform vec3 uWireframeColorBack;

uniform vec2 uCursor;
uniform float uTime;

varying vec3 vBarycentric;
varying vec2 vScreenPosition;
varying vec3 vWorldNormal;
varying vec3 vWorldFragPos;
    `,
    functions: [
      /* cnoise */ `
//	Classic Perlin 3D Noise 
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec4 permute (vec4 x) {return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt (vec4 r) {return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade (vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise (vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}
      `,
      /* aastep */ `
float aastep (float threshold, float dist) {
  float afwidth = fwidth(dist) * 0.5;
  return smoothstep(threshold - afwidth, threshold + afwidth, dist);
}
      `,
      /* wireframe */ `
vec4 getWireframeColor (vec3 barycentric) {
  // signed distance for the wireframe edge
  float d = min(min(barycentric.x, barycentric.y), barycentric.z);

  float positionAlong = max(barycentric.x, barycentric.y); // 0...1
  if (barycentric.y < barycentric.x && barycentric.y < barycentric.z) {
    positionAlong = 1.0 - positionAlong;
  }

  float thickness = uThicknessModifier * mix(
    uMidThickness,
    uEndThickness,
    (1.0 - sin(positionAlong * PI))
  );

  float edge = 1.0 - aastep(thickness, d);

  vec3 viewDir = normalize(cameraPosition - vWorldFragPos);
  bool isBackFacing = dot(vWorldNormal, viewDir) < 0.0;

  vec4 outColor = vec4(uWireframeColorFront, edge);
  if (isBackFacing) {
    outColor.rgb = uWireframeColorBack;
  }

  return outColor;
}
      `,
    ],
    main: `

vec4 defaultColor = gl_FragColor;
vec4 wireframeColor = getWireframeColor(vBarycentric);

float ns = cnoise(vec3(vScreenPosition * 10.0, uTime * 0.3));
float threshold = 0.2 + ns * 0.1;
vec2 cursorPos = (uCursor + 1.0) / 2.0; // -1...1 to 0...1
float distance = length(vScreenPosition - cursorPos);

float intensity = smoothstep(threshold, threshold * 0.5, distance);
float intensityA = smoothstep(threshold * 0.75, threshold * 0.5, distance);

gl_FragColor = mix(wireframeColor, defaultColor, intensity);
gl_FragColor.a = mix(wireframeColor.a, defaultColor.a, intensityA);

    `,
  },
};
