#pragma three_definitions

varying float vIntensity;

void main() {

  vec3 colorA = vec3(0.39, 0.05, 0.53);
  // vec3 colorB = vec3(.4, .4, 1.5);
  vec3 colorB = vec3(0.96, 0.5, 0.76);

  vec3 finalColor = mix(colorA, colorB, vIntensity * 1.5);
  finalColor = clamp(finalColor, vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));

  vec4 diffuseColor = vec4( finalColor, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

  // gl_FragColor = vec4(finalColor, 1.0);
}
