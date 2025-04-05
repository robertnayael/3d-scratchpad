import GUI from 'lil-gui';

const defaultSettings = {
  activeScene: 'main' as 'main' | 'proxy',
  normalStealStrength: 0.98,
  shadowStealStrength: 0.8,
  proxyScale: 0.78,
  fixBacksideNormals: true,
  proxyPreview: false,
  showNormals: false,
  shadowsEnabled: true,
  ambientLightIntensity: 0.4,
  directionalLightIntensity: 7,
  lightDirection: Math.PI / 4,
  bloom: {
    strength: 0.25,
    radius: 0.1,
    threshold: 0.4,
  },
};

type Settings = typeof defaultSettings;

type SettingsListener = (settings: Settings) => void;

export type OnSettingsChange = (listener: SettingsListener) => void;

type InitializeSettingsResult = {
  onSettingsChange: OnSettingsChange;
  disposeSettingsGui: () => void;
};

export function initializeSettings(): InitializeSettingsResult {
  const gui = new GUI({ title: 'Proxy receiver', width: 300 });

  const settings = { ...defaultSettings };

  const listeners = new Set<SettingsListener>();
  const registerListener = (listener: SettingsListener) => {
    listeners.add(listener);
    listener(settings);
  };
  gui.onChange(() => listeners.forEach((listener) => listener(settings)));

  gui.add(settings, 'normalStealStrength').name('steal normals').min(0).max(1).step(0.01);
  gui.add(settings, 'shadowStealStrength').name('steal shadows').min(0).max(1).step(0.01);
  gui.add(settings, 'proxyScale').name('proxy object scale').min(0).max(2).step(0.01);
  gui.add(settings, 'fixBacksideNormals').name('fix backside normals');
  gui.add(settings, 'shadowsEnabled').name('receive shadows');

  const preview = gui.addFolder('Preview');
  preview.add(settings, 'activeScene').name('active scene').options({ 'Main scene': 'main', 'Proxy scene': 'proxy' });
  preview.add(settings, 'showNormals').name('show normals');
  preview.add(settings, 'proxyPreview').name('visualize proxy object');

  const lights = gui.addFolder('Lighting');
  lights.add(settings, 'ambientLightIntensity').name('ambient intensity').min(0).max(5).step(0.1);
  lights.add(settings, 'directionalLightIntensity').name('directional intensity').min(0).max(15).step(0.1);
  lights.add(settings, 'lightDirection').name('direction').min(0).max(Math.PI);

  const bloom = gui.addFolder('Bloom');
  bloom.add(settings.bloom, 'strength').name('strength').min(0).max(1).step(0.01);
  bloom.add(settings.bloom, 'radius').name('radius').min(0).max(1).step(0.01);
  bloom.add(settings.bloom, 'threshold').name('threshold').min(0).max(1).step(0.01);

  const reset = gui.addFolder('Reset');
  reset.add({ restoreSettings: () => gui.reset() }, 'restoreSettings').name('Restore defaults');

  return {
    onSettingsChange: registerListener,
    disposeSettingsGui: () => gui.destroy(),
  };
}
