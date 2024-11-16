#pragma three_definitions

attribute vec3 barycentric;
varying vec3 vBarycentric;
varying vec2 vScreenPosition;
varying vec3 vWorldNormal;
varying vec3 vWorldFragPos;

void main() {
  #pragma three_main

  vScreenPosition = gl_Position.xy / gl_Position.w * 0.5 + 0.5;

  vBarycentric = barycentric;

  // We need these for determining face direction relative to camera (front/backfacing):
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldFragPos = worldPos.xyz;
}
