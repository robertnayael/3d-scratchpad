#pragma three_definitions

uniform float uTime;
varying float vHeight;
varying float vColorStrength;

void main() {
  #pragma three_main

  vec4 bottomColor = vec4(0.337,0.443,0.0,1.0);
  vec4 topColor = vec4(
    0.286 + 0.2 * vColorStrength, // 0.486
    0.465 + 0.3 * vColorStrength, // 0.565
    0.024,
    1.0
  );
  
  gl_FragColor = mix(bottomColor, topColor, vHeight);
}
