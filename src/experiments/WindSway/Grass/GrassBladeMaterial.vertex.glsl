#pragma three_definitions

uniform float uTime;
uniform vec3 uWindDirection;
uniform float uWindStrength;

varying float vColorStrength;
varying float vHeight;

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

void main() {
  #pragma three_main

  float noise = smoothNoise(mvPosition.xz * 0.5 + vec2(0., uTime));

  vHeight = position.y; // 0...1
  vColorStrength = noise; // 0...1

  float maxDisplace = 0.5;
  float displaceAtHeight = 1.0 - cos(3.1416 * 0.5 * vHeight);

  vec3 wind = normalize(uWindDirection);
  wind *= maxDisplace * displaceAtHeight * noise * uWindStrength;


  vec4 displace = modelViewMatrix * vec4(wind, 0.0);
  displace =  projectionMatrix * displace;
  
  gl_Position += displace;

}
