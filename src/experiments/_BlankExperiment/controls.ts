import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { getStore } from './store';

export function setupControls() {
  const { camera, renderer, onSettingsChange } = getStore();

  // "Steal" zoom behavior from `TrackballControls` to enable smooth zoom,
  // as `OrbitControls` don't provide zoom smoothing even with damping enabled.

  const orbitControls = new OrbitControls(camera, renderer.domElement);
  const trackballControls = new TrackballControls(camera, renderer.domElement);

  orbitControls.enableDamping = true;
  orbitControls.dampingFactor = 0.1;
  orbitControls.enableZoom = false;

  trackballControls.noRotate = true;
  trackballControls.noPan = true;
  trackballControls.noZoom = false;

  onSettingsChange(({ controlsEnabled }) => {
    orbitControls.enabled = controlsEnabled;
    trackballControls.enabled = controlsEnabled;
  });

  return {
    update: (deltaTime: number) => {
      const target = orbitControls.target;
      trackballControls.target.set(target.x, target.y, target.z);
      orbitControls.update(deltaTime);
      trackballControls.update();
    },
  };
}
