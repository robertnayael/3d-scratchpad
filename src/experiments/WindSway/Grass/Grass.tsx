import { memo, useMemo } from 'react';
import { Matrix4, MeshStandardMaterial, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { InstancedUniformsMesh } from 'three-instanced-uniforms-mesh';

import { GrassBladeMaterial } from './GrassBladeMaterial';
import { GrassBladeGeometry } from './GrassBladeGeometry';

export class Grass {
  static Count = 50_000;

  static use() {
    return useMemo(() => new Grass(), []);
  }

  private material: GrassBladeMaterial;
  private mesh: InstancedUniformsMesh<MeshStandardMaterial>;

  constructor() {
    this.material = new GrassBladeMaterial();
    this.mesh = new InstancedUniformsMesh(new GrassBladeGeometry(), this.material, Grass.Count);
    this.mesh.count = 0;
  }

  Component = memo(() => {
    useFrame((state) => (this.material.time = state.clock.elapsedTime));

    return <primitive object={this.mesh} />;
  });

  populate = () => {
    for (let i = 0; i < Grass.Count; i++) {
      const position = new Vector3(Math.random() * 10 - 5, 0.5, Math.random() * 10 - 5);
      this.addBlade(i, position);
    }

    const { mesh } = this;
    mesh.count = Grass.Count;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingBox();
    mesh.computeBoundingSphere();
    mesh.updateMatrixWorld;
  };

  private addBlade = (instanceIndex: number, position: Vector3) => {
    const { mesh } = this;

    const matrix = new Matrix4();
    matrix.makeRotationY(Math.random() * Math.PI);
    matrix.setPosition(position);

    mesh.setMatrixAt(instanceIndex, matrix);
  };
}
