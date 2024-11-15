import { useFrame } from '@react-three/fiber';
import { memo, useEffect, useMemo } from 'react';
import { createNoise3D } from 'simplex-noise';
import {
  BufferGeometry,
  Color,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  TorusGeometry,
  Vector3,
  WebGLProgramParametersWithUniforms,
  WebGLRenderer,
} from 'three';
import { InstancedUniformsMesh } from 'three-instanced-uniforms-mesh';

// https://discourse.threejs.org/t/crossfade-two-materials-on-a-single-mesh/70043/6

export class Trees {
  static useState() {
    return useMemo(() => new Trees(), []);
  }

  static geometry(): BufferGeometry {
    const shape = new TorusGeometry(0.1, 0.025, 16, 100);
    const position = shape.getAttribute('position').clone();
    const index = shape.getIndex();
    const g = new BufferGeometry();
    g.setAttribute('position', position);
    g.setIndex(index);
    return g;
  }

  private material: MeshStandardMaterial;
  private mesh: InstancedUniformsMesh<MeshStandardMaterial>;
  private instances: TreeInstance[] = [];
  private reservedInstances = 100;

  private updateTimeUniform = (time: number) => {};

  private createMaterial(): MeshStandardMaterial {
    const mat = new MeshStandardMaterial();
    mat.color = new Color('red');
    mat.flatShading = true;

    mat.onBeforeCompile = (program) => {
      program.uniforms.time = { value: 0 };
      this.updateTimeUniform = (time) => (program.uniforms.time.value = time);

      program.fragmentShader = program.fragmentShader.replace(
        `#define STANDARD`,
        `#define STANDARD
        uniform float time;`,
      );

      program.fragmentShader = program.fragmentShader.replace(
        '}',
        `
        float red = 0.5 + 0.5 * sin(time);
        float green = 0.5 + 0.5 * sin(time + 2.0);
        float blue = 0.5 + 0.5 * sin(time + 4.0);
        gl_FragColor = vec4(red, green, blue, 1);}`,
      );
    };

    return mat;
  }

  constructor() {
    const { reservedInstances } = this;

    const geom = Trees.geometry();

    const mat = this.createMaterial();

    const mesh = new InstancedUniformsMesh(geom, mat, reservedInstances);
    mesh.receiveShadow = true;

    // Initially, hide all instances
    for (let i = 0; i < reservedInstances; i++) {
      const mat = new Matrix4().scale(new Vector3(0, 0, 0));
      mesh.setMatrixAt(i, mat);
    }

    this.material = mat;
    this.mesh = mesh;
  }

  /**
   * Add a new tree to the instanced mesh at the specified position.
   * The tree's size, color and rotation will vary.
   */
  add = (at: Vector3, normal?: Vector3) => {
    const { mesh, instances } = this;

    const instance = new TreeInstance(this.instances.length, at);
    instances.push(instance);

    mesh.setMatrixAt(instance.index, instance.matrix);
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingBox();
    mesh.computeBoundingSphere();
    // mesh.updateMatrixWorld
  };

  /**
   * Provides the instanced mesh with trees as a React component.
   */
  Component = memo(() => {
    useFrame((state) => this.updateTimeUniform(state.clock.elapsedTime));

    // Disposal
    useEffect(() => () => {}, []);

    return <primitive object={this.mesh} />;
  });
}

class TreeInstance {
  private static noise = createNoise3D();

  readonly index: number;
  readonly matrix: Matrix4;
  readonly color: Color;

  constructor(index: number, position: Vector3) {
    this.index = index;
    this.color = new Color('red');
    this.matrix = new Matrix4();
    this.matrix.setPosition(position);
  }
}
