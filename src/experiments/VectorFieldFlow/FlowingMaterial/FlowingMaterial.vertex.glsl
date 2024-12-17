#pragma three_definitions

uniform float uTime;
attribute float flowSpeed;
attribute vec2 flowDirection;

varying vec2 vUv;
varying float vFlowSpeed;
varying vec2 vFlowDirection;

void main() {
  #pragma three_main

  vUv = uv;
  vFlowSpeed = flowSpeed;
  vFlowDirection = flowDirection;
}
