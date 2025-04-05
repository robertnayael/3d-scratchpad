import { AmbientLight, DirectionalLight } from 'three/webgpu';
import { getStore } from '../store';

export function sceneLights() {
  const lights = {
    directional: new DirectionalLight(),
    ambient: new AmbientLight(),
  };

  lights.directional.castShadow = true;
  lights.directional.shadow.mapSize.setLength(2048);
  lights.directional.shadow.bias = -0.0002;

  const { scenes, onSettingsChange } = getStore();

  scenes.main.add(lights.directional, lights.ambient);

  onSettingsChange((settings) => {
    lights.directional.intensity = settings.directionalLightIntensity;
    lights.ambient.intensity = settings.ambientLightIntensity;

    rotateLight(lights.directional, settings.lightDirection);
  });
}

function rotateLight(light: DirectionalLight, angle: number) {
  const radius = 4;
  light.position.set(Math.sin(angle) * radius, 3.5, Math.cos(angle) * radius);
}
