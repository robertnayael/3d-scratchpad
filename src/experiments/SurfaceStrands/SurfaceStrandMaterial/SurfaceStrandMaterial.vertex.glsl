#pragma three_definitions

uniform float uTime;
uniform vec4 uStrandRotation;

varying float vHeight;

attribute vec3 aSurfaceNormal;

vec3 applyQuaternion(vec3 v, vec4 q) {
    vec3 t = 2.0 * cross(q.xyz, v);
    return v + q.w * t + cross(q.xyz, t);
}

vec4 conjugateQuaternion(vec4 q) {
    return vec4(-q.xyz, q.w);
}

vec3 projectOnPlane(vec3 v, vec3 planeNormal) {
    vec3 n = normalize(planeNormal);
    return v - dot(v, n) * n;
}

void main() {
  #pragma three_main


  vHeight = uv.y; // 0...1

  float displaceAtHeight = 1.0 - cos(3.1416 * 0.5 * vHeight);
  
  mat4 modelRotationMatrix = mat4(1.0); // TODO: What about other non-translation transforms?
  modelRotationMatrix[0] = modelMatrix[0];
  modelRotationMatrix[1] = modelMatrix[1];
  modelRotationMatrix[2] = modelMatrix[2];
  mat4 modelTranslationMatrix = mat4(1.0);
  modelTranslationMatrix[3] = vec4(modelMatrix[3].xyz, 1.0);
  
  vec4 pos = modelRotationMatrix * instanceMatrix * vec4( position, 1.0 );
  vec3 fullDisplacement = applyQuaternion(pos.xyz, uStrandRotation);
  pos.xyz = mix(pos.xyz, fullDisplacement, displaceAtHeight);


  gl_Position = projectionMatrix * viewMatrix * modelTranslationMatrix * pos;
}
