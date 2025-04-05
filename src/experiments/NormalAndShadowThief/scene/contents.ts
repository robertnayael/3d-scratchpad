import { BufferGeometry } from 'three';
import { vec3 } from 'three/tsl';
import { CircleGeometry, Mesh, MeshBasicNodeMaterial, MeshStandardNodeMaterial, SphereGeometry } from 'three/webgpu';
import { quadMeshGeometry } from '../assets';
import { getStore } from '../store';
import { sceneLights } from './lights';
import { proxyReceiverMaterial } from './proxyReceiverMaterial';

export async function sceneContents() {
  const geometries = await quadMeshGeometry();

  mainMesh(geometries.main);
  proxyMesh(geometries.proxy, 'preview');
  proxyMesh(geometries.proxy);
  sceneLights();
  groundMesh();
  dummyShadowCaster();
}

async function mainMesh(geometry: BufferGeometry) {
  const mesh = new Mesh();
  mesh.geometry = geometry;
  mesh.material = await proxyReceiverMaterial();
  mesh.castShadow = true;

  getStore().scenes.main.add(mesh);

  getStore().onSettingsChange(({ shadowsEnabled }) => {
    mesh.receiveShadow = shadowsEnabled;
  });
}

async function proxyMesh(geometry: BufferGeometry, purpose: 'actualProxy' | 'preview' = 'actualProxy') {
  const { scenes, onSettingsChange } = getStore();

  const mesh = new Mesh();
  mesh.geometry = geometry;
  mesh.receiveShadow = true;

  onSettingsChange(({ proxyScale }) => {
    mesh.scale.x = mesh.scale.y = mesh.scale.z = proxyScale;
  });

  if (purpose === 'actualProxy') {
    scenes.proxy.add(mesh);
    mesh.material = new MeshBasicNodeMaterial();
    mesh.castShadow = true;
  } else {
    scenes.main.add(mesh);
    const material = new MeshStandardNodeMaterial();
    material.colorNode = vec3(0.337, 0.443, 0.0);
    material.transparent = true;
    material.opacity = 0.5;
    mesh.material = material;

    onSettingsChange(({ proxyPreview }) => (mesh.visible = proxyPreview));
  }
}

function groundMesh() {
  const mesh = new Mesh();
  mesh.receiveShadow = true;
  mesh.geometry = new CircleGeometry(4, 64);
  mesh.material = new MeshStandardNodeMaterial({ color: 'rgb(100, 100, 100)' });
  mesh.rotateX(-Math.PI / 2);
  mesh.position.y = -1;

  const scene = getStore().scenes.main;
  scene.add(mesh);
}

function dummyShadowCaster() {
  const mesh = new Mesh();
  mesh.castShadow = true;
  mesh.geometry = new SphereGeometry(0.5);
  mesh.material = new MeshStandardNodeMaterial({ color: 'rgb(100, 100, 100)' });
  mesh.position.y = 2;
  mesh.position.x = 2;
  mesh.position.z = 2;

  const scene = getStore().scenes.main;
  scene.add(mesh);
}
