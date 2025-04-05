import { PerspectiveCamera, Scene } from 'three';
import { Renderer } from 'three/webgpu';
import { OnSettingsChange } from './settings';

export type Store = {
  renderer: Renderer;
  camera: PerspectiveCamera;
  onSettingsChange: OnSettingsChange;
  scenes: {
    main: Scene;
    proxy: Scene;
  };
};

let CURRENT_STORE: Store | null = null;

export function getStore() {
  if (!CURRENT_STORE) {
    throw new Error('Store accessed before it was initialized');
  }
  return CURRENT_STORE;
}

export function setStore(store: Store): Store {
  CURRENT_STORE = store;
  return store;
}
