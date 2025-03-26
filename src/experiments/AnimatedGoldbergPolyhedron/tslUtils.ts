// Three.js Transpiler r174

import { vec4, mod, Fn, mul, sub, floor, fract, abs, step, dot, float, mix, vec2 } from 'three/tsl';

export const permute = /*#__PURE__*/ Fn(([x_immutable]: [ReturnType<typeof vec4>]) => {
  const x = vec4(x_immutable).toVar();

  return mod(x.mul(34.0).add(1.0).mul(x), 289.0);
}).setLayout({
  name: 'permute',
  type: 'vec4',
  inputs: [{ name: 'x', type: 'vec4' }],
});

export const taylorInvSqrt = /*#__PURE__*/ Fn(([r_immutable]: [ReturnType<typeof vec4>]) => {
  const r = vec4(r_immutable).toVar();

  return sub(1.79284291400159, mul(0.85373472095314, r));
}).setLayout({
  name: 'taylorInvSqrt',
  type: 'vec4',
  inputs: [{ name: 'r', type: 'vec4' }],
});

export const fade = /*#__PURE__*/ Fn(([t_immutable]: [ReturnType<typeof vec4>]) => {
  const t = vec4(t_immutable).toVar();

  return t
    .mul(t)
    .mul(t)
    .mul(t.mul(t.mul(6.0).sub(15.0)).add(10.0));
}).setLayout({
  name: 'fade',
  type: 'vec4',
  inputs: [{ name: 't', type: 'vec4' }],
});

export const cnoise = /*#__PURE__*/ Fn(([P_immutable]: [ReturnType<typeof vec4>]) => {
  const P = vec4(P_immutable).toVar();
  const Pi0 = vec4(floor(P)).toVar();
  const Pi1 = vec4(Pi0.add(1.0)).toVar();
  Pi0.assign(mod(Pi0, 289.0));
  Pi1.assign(mod(Pi1, 289.0));
  const Pf0 = vec4(fract(P)).toVar();
  const Pf1 = vec4(Pf0.sub(1.0)).toVar();
  const ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x).toVar();
  const iy = vec4(Pi0.yy, Pi1.yy).toVar();
  const iz0 = vec4(Pi0.zzzz).toVar();
  const iz1 = vec4(Pi1.zzzz).toVar();
  const iw0 = vec4(Pi0.wwww).toVar();
  const iw1 = vec4(Pi1.wwww).toVar();
  const ixy = vec4(permute(permute(ix).add(iy))).toVar();
  const ixy0 = vec4(permute(ixy.add(iz0))).toVar();
  const ixy1 = vec4(permute(ixy.add(iz1))).toVar();
  const ixy00 = vec4(permute(ixy0.add(iw0))).toVar();
  const ixy01 = vec4(permute(ixy0.add(iw1))).toVar();
  const ixy10 = vec4(permute(ixy1.add(iw0))).toVar();
  const ixy11 = vec4(permute(ixy1.add(iw1))).toVar();
  const gx00 = vec4(ixy00.div(7.0)).toVar();
  const gy00 = vec4(floor(gx00).div(7.0)).toVar();
  const gz00 = vec4(floor(gy00).div(6.0)).toVar();
  gx00.assign(fract(gx00).sub(0.5));
  gy00.assign(fract(gy00).sub(0.5));
  gz00.assign(fract(gz00).sub(0.5));
  const gw00 = vec4(vec4(0.75).sub(abs(gx00)).sub(abs(gy00)).sub(abs(gz00))).toVar();
  const sw00 = vec4(step(gw00, vec4(0.0))).toVar();
  gx00.subAssign(sw00.mul(step(0.0, gx00).sub(0.5)));
  gy00.subAssign(sw00.mul(step(0.0, gy00).sub(0.5)));
  const gx01 = vec4(ixy01.div(7.0)).toVar();
  const gy01 = vec4(floor(gx01).div(7.0)).toVar();
  const gz01 = vec4(floor(gy01).div(6.0)).toVar();
  gx01.assign(fract(gx01).sub(0.5));
  gy01.assign(fract(gy01).sub(0.5));
  gz01.assign(fract(gz01).sub(0.5));
  const gw01 = vec4(vec4(0.75).sub(abs(gx01)).sub(abs(gy01)).sub(abs(gz01))).toVar();
  const sw01 = vec4(step(gw01, vec4(0.0))).toVar();
  gx01.subAssign(sw01.mul(step(0.0, gx01).sub(0.5)));
  gy01.subAssign(sw01.mul(step(0.0, gy01).sub(0.5)));
  const gx10 = vec4(ixy10.div(7.0)).toVar();
  const gy10 = vec4(floor(gx10).div(7.0)).toVar();
  const gz10 = vec4(floor(gy10).div(6.0)).toVar();
  gx10.assign(fract(gx10).sub(0.5));
  gy10.assign(fract(gy10).sub(0.5));
  gz10.assign(fract(gz10).sub(0.5));
  const gw10 = vec4(vec4(0.75).sub(abs(gx10)).sub(abs(gy10)).sub(abs(gz10))).toVar();
  const sw10 = vec4(step(gw10, vec4(0.0))).toVar();
  gx10.subAssign(sw10.mul(step(0.0, gx10).sub(0.5)));
  gy10.subAssign(sw10.mul(step(0.0, gy10).sub(0.5)));
  const gx11 = vec4(ixy11.div(7.0)).toVar();
  const gy11 = vec4(floor(gx11).div(7.0)).toVar();
  const gz11 = vec4(floor(gy11).div(6.0)).toVar();
  gx11.assign(fract(gx11).sub(0.5));
  gy11.assign(fract(gy11).sub(0.5));
  gz11.assign(fract(gz11).sub(0.5));
  const gw11 = vec4(vec4(0.75).sub(abs(gx11)).sub(abs(gy11)).sub(abs(gz11))).toVar();
  const sw11 = vec4(step(gw11, vec4(0.0))).toVar();
  gx11.subAssign(sw11.mul(step(0.0, gx11).sub(0.5)));
  gy11.subAssign(sw11.mul(step(0.0, gy11).sub(0.5)));
  const g0000 = vec4(gx00.x, gy00.x, gz00.x, gw00.x).toVar();
  const g1000 = vec4(gx00.y, gy00.y, gz00.y, gw00.y).toVar();
  const g0100 = vec4(gx00.z, gy00.z, gz00.z, gw00.z).toVar();
  const g1100 = vec4(gx00.w, gy00.w, gz00.w, gw00.w).toVar();
  const g0010 = vec4(gx10.x, gy10.x, gz10.x, gw10.x).toVar();
  const g1010 = vec4(gx10.y, gy10.y, gz10.y, gw10.y).toVar();
  const g0110 = vec4(gx10.z, gy10.z, gz10.z, gw10.z).toVar();
  const g1110 = vec4(gx10.w, gy10.w, gz10.w, gw10.w).toVar();
  const g0001 = vec4(gx01.x, gy01.x, gz01.x, gw01.x).toVar();
  const g1001 = vec4(gx01.y, gy01.y, gz01.y, gw01.y).toVar();
  const g0101 = vec4(gx01.z, gy01.z, gz01.z, gw01.z).toVar();
  const g1101 = vec4(gx01.w, gy01.w, gz01.w, gw01.w).toVar();
  const g0011 = vec4(gx11.x, gy11.x, gz11.x, gw11.x).toVar();
  const g1011 = vec4(gx11.y, gy11.y, gz11.y, gw11.y).toVar();
  const g0111 = vec4(gx11.z, gy11.z, gz11.z, gw11.z).toVar();
  const g1111 = vec4(gx11.w, gy11.w, gz11.w, gw11.w).toVar();
  const norm00 = vec4(
    taylorInvSqrt(vec4(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100))),
  ).toVar();
  g0000.mulAssign(norm00.x);
  g0100.mulAssign(norm00.y);
  g1000.mulAssign(norm00.z);
  g1100.mulAssign(norm00.w);
  const norm01 = vec4(
    taylorInvSqrt(vec4(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101))),
  ).toVar();
  g0001.mulAssign(norm01.x);
  g0101.mulAssign(norm01.y);
  g1001.mulAssign(norm01.z);
  g1101.mulAssign(norm01.w);
  const norm10 = vec4(
    taylorInvSqrt(vec4(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110))),
  ).toVar();
  g0010.mulAssign(norm10.x);
  g0110.mulAssign(norm10.y);
  g1010.mulAssign(norm10.z);
  g1110.mulAssign(norm10.w);
  const norm11 = vec4(
    taylorInvSqrt(vec4(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111))),
  ).toVar();
  g0011.mulAssign(norm11.x);
  g0111.mulAssign(norm11.y);
  g1011.mulAssign(norm11.z);
  g1111.mulAssign(norm11.w);
  const n0000 = float(dot(g0000, Pf0)).toVar();
  const n1000 = float(dot(g1000, vec4(Pf1.x, Pf0.yzw))).toVar();
  const n0100 = float(dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw))).toVar();
  const n1100 = float(dot(g1100, vec4(Pf1.xy, Pf0.zw))).toVar();
  const n0010 = float(dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w))).toVar();
  const n1010 = float(dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w))).toVar();
  const n0110 = float(dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w))).toVar();
  const n1110 = float(dot(g1110, vec4(Pf1.xyz, Pf0.w))).toVar();
  const n0001 = float(dot(g0001, vec4(Pf0.xyz, Pf1.w))).toVar();
  const n1001 = float(dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w))).toVar();
  const n0101 = float(dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w))).toVar();
  const n1101 = float(dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w))).toVar();
  const n0011 = float(dot(g0011, vec4(Pf0.xy, Pf1.zw))).toVar();
  const n1011 = float(dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw))).toVar();
  const n0111 = float(dot(g0111, vec4(Pf0.x, Pf1.yzw))).toVar();
  const n1111 = float(dot(g1111, Pf1)).toVar();
  const fade_xyzw = vec4(fade(Pf0)).toVar();
  const n_0w = vec4(mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw.w)).toVar();
  const n_1w = vec4(mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), fade_xyzw.w)).toVar();
  const n_zw = vec4(mix(n_0w, n_1w, fade_xyzw.z)).toVar();
  const n_yzw = vec2(mix(n_zw.xy, n_zw.zw, fade_xyzw.y)).toVar();
  const n_xyzw = float(mix(n_yzw.x, n_yzw.y, fade_xyzw.x)).toVar();

  return mul(2.2, n_xyzw);
}).setLayout({
  name: 'cnoise',
  type: 'float',
  inputs: [{ name: 'P', type: 'vec4' }],
});
