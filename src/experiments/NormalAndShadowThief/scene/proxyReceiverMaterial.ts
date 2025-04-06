import {
  cameraWorldMatrix,
  faceDirection,
  Fn,
  If,
  mix,
  mrt,
  normalView,
  pass,
  positionGeometry,
  positionWorld,
  rtt,
  select,
  time,
  uniform,
  vec3,
  vec4,
  viewportUV,
} from 'three/tsl';
import { Color, DoubleSide, MeshStandardNodeMaterial } from 'three/webgpu';
import { cnoise } from '@/experiments/AnimatedGoldbergPolyhedron/tslUtils';
import { quadMeshMaps } from '../assets';
import { getStore } from '../store';

// TODO: blend proxy normal fully for quads that are too perpendicular?

// TODO: use a fixed sun position and darken fragments further from the sun.
// Maybe also lighten the ones that are nearest?

// TODO: use a fixed sun position to dynamically increase stolen normal blending to `1`
// when object is viewed sideways to the sun direction. This is where quads get ugly.
// Otherwise, keep some original normals for a hint of internal geometry.

// TODO: use depth derivatves to outline leaves,
// but fade out the outline as quads get too perpendicular to view direction.

// TODO: configurable Fresnel effect?

// TODO: add displacement controlled by global wind direction and strength;
// displace positions frontal to the wind stronger
// (the wind-side of the geometry should squish a bit)
// This will require knowing the model's total dimensions

// TODO: Convert the material to a class.

/**
 * We assume there is a special proxy scene with just the counterparts
 * of any objects using this material. The counterparts are simple volumes,
 * and represent the "idealized" version of an otherwise noisy geometry.
 * We also assume that this material will be applied to an object with a dense,
 * quad-based geometry that inscribes into the simplified counterpart.
 *
 * The proxy scene is rendered to textures containing the view-space normals
 * and world-space positions of the proxy objects.
 *
 * The proxy's normals are stolen from there and mixed with the actual normals
 * of the real geometry, so the shading is smooth but with a hind of the underlying shape.
 *
 * The proxy's world position is assigned as the real geometry's position for receiving shadows.
 * As a result, we effectively avoid self-shadows and most importantly, make the object
 * receive smooth, rounded, "ideal" shadows. This also can be combined with the real world position
 * to avoid and effect which is too uncanny.
 *
 * There is one issue with this approach: when the camera gets very close and the main object is still
 * visible, but the proxy one not, there's nothing to steal. The ideal solution would be
 * to use a modified, zoomed out camera for rendering the proxy scene and somehow modify
 * the mapping of the resulting texture to proxy receiver fragments. Here, a simpler approach is used:
 * if that happens, we just fall back to the standard values for normals and shadow positions.
 */
export async function proxyReceiverMaterial() {
  const { scenes, camera, onSettingsChange } = getStore();

  /*--- UNIFORMS ---*/

  const normalStealStrength = uniform(0.95);
  const shadowStealStrength = uniform(0.8);
  const showNormals = uniform(0);
  const fixBacksideNormals = uniform(1);

  const showProxyMisses = uniform(0); // toggle manually to test if proxy is big enough
  const diffuseColor = vec3(0.337, 0.443, 0.0).toVar();

  onSettingsChange((settings) => {
    normalStealStrength.value = settings.normalStealStrength;
    shadowStealStrength.value = settings.shadowStealStrength;
    showNormals.value = +settings.showNormals;
    fixBacksideNormals.value = +settings.fixBacksideNormals;
  });

  const maps = await quadMeshMaps();

  const material = new MeshStandardNodeMaterial();

  material.alphaMap = maps.alpha;
  material.alphaTest = 0.5;

  // Make sure we get black by default. This way, we can test if no proxy was rendered
  // at a particular fragment (which shouldn't happen if it's large enough and well positioned).
  scenes.proxy.background = new Color(0x000000);

  const proxyPass = pass(scenes.proxy, camera);
  proxyPass.setMRT(
    mrt({
      output: positionWorld,
      normal: normalView,
    }),
  );

  const backsideNormalsFix = select(fixBacksideNormals, faceDirection, 1);

  /*--- NORMAL STEALING ---*/

  // Steal proxy's normal:
  const proxyNormalViewTex = rtt(proxyPass.getTextureNode('normal'));
  proxyNormalViewTex.uvNode = viewportUV;

  // Revert the standard behavior where backface normals get flipped
  // (we don't want this for two-sided quads):
  material.side = DoubleSide;
  const proxyNormalView = proxyNormalViewTex.mul(backsideNormalsFix);
  const standardNormalView = normalView.mul(backsideNormalsFix);

  // Mix stolen normal with regular one:
  const fakeNormalView = mix(standardNormalView, proxyNormalView, normalStealStrength);

  // Apply faked normal, or use default if proxy value not available (camera too close)
  const proxyNormalMissing = proxyNormalView.xyz.length().equal(0);
  const finalNormalView = select(proxyNormalMissing, standardNormalView, fakeNormalView);
  material.normalNode = finalNormalView;

  /*--- SHADOW POSITION STEALING ---*/

  // Steal proxy's world position
  const proxyPositionWorld = rtt(proxyPass.getTextureNode('output')).label('proxyPositionWorld');
  proxyPositionWorld.uvNode = viewportUV;

  // Mix proxy's position with regular position for shadow reception:
  const fakeWorldPosition = mix(positionWorld, proxyPositionWorld.xyz, shadowStealStrength);

  // Apply faked world pos, or use default if proxy value not available (camera too close)
  const proxyPositionMissing = proxyPositionWorld.xyz.length().equal(0);
  material.shadowPositionNode = select(proxyPositionMissing, positionWorld, fakeWorldPosition);

  /*--- IDLE ANIMATION ---*/

  const displace = cnoise(vec4(positionWorld.mul(2), time))
    .mul(0.05)
    .add(0.95);
  material.positionNode = positionGeometry.mul(displace);

  /*--- COLOR ---*/

  material.colorNode = Fn(() => {
    const color = diffuseColor.toVar();

    // Debug: visualize final normals
    If(showNormals.equal(1), () => {
      const fakeNormalWorld = cameraWorldMatrix.transformDirection(finalNormalView.mul(faceDirection)).xyz;
      color.rgb.assign(fakeNormalWorld);
    });

    // Debug: show proxy texture misses in purple; otherwise white
    If(showProxyMisses.equal(1), () => {
      const okColor = vec3(1, 1, 1);
      const errorColor = vec3(1, 0, 1);
      color.rgb.assign(select(proxyPositionMissing.or(proxyNormalMissing), errorColor, okColor));
    });

    return color;
  })();

  return material;
}
