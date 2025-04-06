import { PerspectiveCamera, Scene } from 'three';
import { Renderer } from 'three/webgpu';
import { OnSettingsChange } from './settings';

export type Store = {
  onSettingsChange: OnSettingsChange;
  renderer: Renderer;
  camera: PerspectiveCamera;
  scene: Scene;
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

export function disposeStore() {
  CURRENT_STORE = null;
}
