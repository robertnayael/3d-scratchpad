#pragma three_definitions

// Based on "Texture Distortion" (published 2018-05-30) by Jasper Flick
// available at: https://catlikecoding.com/unity/tutorials/flow/texture-distortion

uniform float uTime;
uniform sampler2D _DebugMap;

varying vec2 vUv;
varying vec2 vFlowDirection;
varying float vFlowSpeed;

float N (vec2 st) {
  return fract( sin( dot( st.xy, vec2(12.9898,78.233 ) ) ) *  43758.5453123);
}

float smoothNoise( vec2 ip ){
  vec2 lv = fract( ip );
  vec2 id = floor( ip );
  
  lv = lv * lv * ( 3. - 2. * lv );
  
  float bl = N( id );
  float br = N( id + vec2( 1, 0 ));
  float b = mix( bl, br, lv.x );
  
  float tl = N( id + vec2( 0, 1 ));
  float tr = N( id + vec2( 1, 1 ));
  float t = mix( tl, tr, lv.x );
  
  return mix( b, t, lv.y );
}

vec3 flowUv(
  vec2 uv,
  vec2 flowVector,
  vec2 jump,
  float tiling,
  float time,
  bool applyOffset
) {
  float phaseOffset = applyOffset ? 0.5 : 0.0;
  float progress = fract(time + phaseOffset);
  vec3 uvw;
	uvw.xy = uv - flowVector * progress;
  uvw.xy *= tiling;
	uvw.xy += phaseOffset;
  uvw.xy += (time - progress) * jump;
  uvw.z = 1.0 - abs(1.0 - 2.0 * progress);
  return uvw;
}

// 
vec4 flowColor() {
  float flowNoise = 70.0;
  float flowSpeed = 0.05 * vFlowSpeed;
  float tiling = 6.0;
  float speed = 0.5;// * smoothNoise(vUv.xy) * 5.0;
  float jump = 0.2;

  float noise = smoothNoise(vUv.xy * flowNoise);

  vec2 flowVector = vFlowDirection * flowSpeed;
  float time = uTime * speed + noise;

  vec3 uvwA = flowUv(vUv, flowVector, vec2(jump, jump), tiling, time, false);
  vec3 uvwB = flowUv(vUv, flowVector, vec2(jump, jump), tiling, time, true);

  vec4 texA = texture2D(_DebugMap, uvwA.xy) * uvwA.z;
  vec4 texB = texture2D(_DebugMap, uvwB.xy) * uvwB.z;

   return texA + texB;
}

void main() {
  #pragma three_main

  vec4 normalColor = flowColor();

  vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
  vec4 blue = vec4(0.0, 0.5, 1.0, 1.0);
  vec4 halfBlue = blue * 0.5;

  vec4 final = normalColor * 0.35 + halfBlue * 0.75;

  float brightness = dot(normalColor.rgb, vec3(0.299, 0.587, 0.114));
  float threshold = 0.5;
  normalColor.a = brightness > threshold ? 1.0 : 0.0;


  gl_FragColor = final * 2.0;

  gl_FragColor.a = mix(0.0, 1.0, min(1.0, vFlowSpeed));

}

