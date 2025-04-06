import GUI from 'lil-gui';

const defaultSettings = {
  controlsEnabled: true,
  bloomEnabled: true,
};

type Settings = typeof defaultSettings;

type SettingsListener = (settings: Settings) => void;

export type OnSettingsChange = (listener: SettingsListener) => void;

type InitializeSettingsResult = {
  onSettingsChange: OnSettingsChange;
  disposeSettingsGui: () => void;
};

export function initializeSettings(): InitializeSettingsResult {
  const gui = new GUI({ title: 'Settings', width: 300 });

  const settings = { ...defaultSettings };

  //

  gui.add(settings, 'controlsEnabled').name('enable controls');
  gui.add(settings, 'bloomEnabled').name('bloom');

  //

  const reset = gui.addFolder('Reset');
  reset.add({ restoreSettings: () => gui.reset() }, 'restoreSettings').name('Restore defaults');

  const listeners = new Set<SettingsListener>();
  const registerListener = (listener: SettingsListener) => {
    listeners.add(listener);
    listener(settings);
  };
  gui.onChange(() => listeners.forEach((listener) => listener(settings)));

  return {
    onSettingsChange: registerListener,
    disposeSettingsGui: () => gui.destroy(),
  };
}
