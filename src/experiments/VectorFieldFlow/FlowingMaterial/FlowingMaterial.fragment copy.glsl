#pragma three_definitions

// https://advances.realtimerendering.com/s2010/Vlachos-Waterflow(SIGGRAPH%202010%20Advanced%20RealTime%20Rendering%20Course).pdf

uniform float uTime;
uniform sampler2D tMap0;
uniform sampler2D tMap1;
uniform vec4 config;

varying vec2 vUv;
varying vec2 vFlowDirection;
varying float vFlowSpeed;


void main() {
  #pragma three_main

  float scale = 10.0;

  float flowMapOffset0 = config.x;
  float flowMapOffset1 = config.y;
  float halfCycle = config.z;

  vec2 flow = -1.0 * vFlowDirection * vFlowSpeed * 1.0;


  // https://graphtoy.com/?f1(x,t)=clamp(fract(x),0,1/2)*2&v1=false&f2(x,t)=1-f1(x+t*0.2)&v2=false&f3(x,t)=1-(f2(x,t)+f2(-x,-t))&v3=false&f4(x,t)=f3(x+0/2,t)&v4=true&f5(x,t)=f3(x+1/2,t)&v5=true&f6(x,t)=&v6=false&grid=1&coords=0.010224352426860511,0.030673057280581534,4.6265194731543815
  // https://graphtoy.com/?f1(x,t)=clamp(fract(x),0,1/2)*2&v1=false&f2(x,t)=1-f1(x+t*0.2)&v2=false&f3(x,t)=1-(f2(x,t)+f2(-x,-t))&v3=false&f4(x,t)=f3(x+0/2,t)&v4=true&f5(x,t)=f3(x+1/2,t)&v5=true&f6(x,t)=&v6=false&grid=1&coords=0.010224352426860511,0.030673057280581534,4.6265194731543815
  // https://www.youtube.com/watch?v=FvbPnndigL4&t=1724s

  // https://catlikecoding.com/unity/tutorials/flow/texture-distortion/

  vec2 vUvAlt = fract(vUv.xy + vec2(0.15, 0.15));

  // sample normal maps (distort uvs with flowdata)
  vec4 normalColor0 = texture2D( tMap0, ( vUv * scale ) + flow * flowMapOffset0 );
  vec4 normalColor1 = texture2D( tMap1, ( vUvAlt * scale ) + flow * flowMapOffset1 );

  // linear interpolate to get the final normal color
  float flowLerp = abs( halfCycle - flowMapOffset0 ) / halfCycle;
  vec4 normalColor = mix( normalColor0, normalColor1, flowLerp );

  // calculate normal vector
  vec3 flowColor = normalize( vec3( normalColor.r * 2.0 - 1.0, normalColor.g,  normalColor.b * 2.0 - 1.0 ) );

  vec4 noColor = vec4(0.0, 0.0, 0.0, 0.0);

vec4 flowColor4 = vec4(flowColor, 1.0);
vec4 f = flowColor4;
  vec4 finalColor = vec4(f.r + f.g + f.b, f.r + f.g + f.b, f.r + f.g + f.b, 1.0);

  gl_FragColor = flowColor4;


  float brightness = dot(normalColor.rgb, vec3(0.299, 0.587, 0.114));
  float threshold = 0.5;
  normalColor.a = brightness > threshold ? 1.0 : 0.0;
  // normalColor.a = mix(0.0, 1.0, brightness);
  // normalColor = vec4(brightness, brightness, brightness, 1.0);

  vec4 blue = vec4(0.0, 1.0, 1.0, 1.0);
  vec4 halfBlue = blue * 0.5;

  vec4 final = normalColor * 0.25 + halfBlue * 0.75;

  // gl_FragColor = mix(blue, final, max(0.0, vFlowSpeed + 0.0));
  gl_FragColor = final;

  gl_FragColor.a = mix(0.0, 1.0, min(1.0, vFlowSpeed));

  // if (vFlowSpeed == 0.0) {
  //   gl_FragColor.a = 0.5;
  // }

  // gl_FragColor = blue;

  // gl_FragColor = mix(noColor, blue, vFlowSpeed);

}

  // vec2 direction = vFlowDirection * vFlowSpeed;
  // float speed = 0.0;
  // vec2 offset = direction * fract(uTime) * speed; 
  // vec2 offset = direction * mod(uTime * speed, 1.0); 
  // vec2 offset = direction * speed; 
  // vec2 flowUv = vUv + offset;
  // vec4 mapColor = texture2D( tMap1, ( flowUv ) );
  // vec4 noColor = vec4(0.0, 0.0, 0.0, 0.0);
  // float test = direction.y * fract(uTime) * speed;
  // gl_FragColor = vec4(direction.x, direction.y, 0.0, 0.0);
  // gl_FragColor = vec4((test) * 1.0, 0.0, 0.0, 1.0);
  // gl_FragColor = mix(noColor, mapColor, vFlowSpeed + 0.05);