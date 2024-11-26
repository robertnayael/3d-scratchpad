import { useMemo, useRef, useState } from 'react';
import {
  ArrowHelper,
  BufferGeometry,
  Color,
  ColorRepresentation,
  ConeGeometry,
  DodecahedronGeometry,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  OctahedronGeometry,
  Quaternion,
  SphereGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  Vector3,
} from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { CameraControls, Grid, PerformanceMonitor, SoftShadows } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { useObjectRotation } from '../CameraDependentObjectRotation/useObjectRotation';
import { SurfaceStrandMaterial } from './SurfaceStrandMaterial';

export function Scene() {
  return (
    <>
      <Canvas shadows={true} camera={{ position: [5, 5, 10] }} style={{ background: 'rgba(20, 80, 200, 0.5)' }}>
        <PerformanceMonitor>
          <Contents />
        </PerformanceMonitor>
        <Perf position="top-left" showGraph={true} />
      </Canvas>
    </>
  );
}

function Contents() {
  const geometry1 = useMemo(() => new TorusGeometry(2.5), []);
  const geometry2 = useMemo(() => new TorusKnotGeometry(2), []);
  const geometry3 = useMemo(() => new DodecahedronGeometry(3, 0), []);
  // const geometry4 = useMemo(() => new TorusKnotGeometry(3, 0.2, 100, 12, 1, 5), []);
  const geometry4 = useMemo(() => new OctahedronGeometry(1, 5), []);

  // const points = useSpherePoints(count, 2);

  const [cameraControlsDisabled, setCameraControlsDisabled] = useState(false);

  return (
    <>
      <CameraControls enabled={!cameraControlsDisabled} />
      <Grid position={[0, -7.5, 0]} infiniteGrid fadeDistance={20} cellColor={'#ffffff'} sectionThickness={0.5} />
      <ambientLight intensity={0.5} />
      <spotLight position={[35, 35, 0]} angle={0.23} intensity={30000} castShadow={true} color="rgb(255, 255, 255)" />
      <spotLight
        position={[-35, -35, 0]}
        angle={Math.PI / 2}
        intensity={5000}
        castShadow={true}
        color="rgb(255, 255, 255)"
      />
      <SoftShadows focus={5} samples={5} size={5} />
      <axesHelper position={[0, -5, 0]} />

      <Object
        geometry={geometry1}
        color={'rgb(255,255,255)'}
        position={[1, 1, 1]}
        strands={30000}
        onRotationStateChanged={setCameraControlsDisabled}
      />
      <Object
        geometry={geometry2}
        color={'rgb(102,50,20)'}
        position={[-3, -1, -5]}
        strands={30000}
        onRotationStateChanged={setCameraControlsDisabled}
      />
      <Object
        geometry={geometry3}
        color={'rgb(200,10,120)'}
        position={[4, -4, -3]}
        strands={30000}
        onRotationStateChanged={setCameraControlsDisabled}
      />
      <Object
        geometry={geometry4}
        color={'rgb(50,200,50)'}
        position={[0, 5, -3]}
        strands={20000}
        onRotationStateChanged={setCameraControlsDisabled}
      />
    </>
  );
}

function Object({
  geometry,
  color,
  strands,
  position,
  onRotationStateChanged,
}: {
  geometry: BufferGeometry;
  color: ColorRepresentation;
  strands: number;
  position: [number, number, number];
  onRotationStateChanged: (rotating: boolean) => void;
}) {
  const refs = {
    group: useRef<Group>(null),
    surface: useRef<Mesh>(null),
  };

  const [material] = useState(new MeshStandardMaterial({ color, side: 1 }));

  const [rotation, accumulate] = useDirectionAccumulator();

  const bindRotationEvents = useObjectRotation({
    objectRef: refs.surface,
    onRotationStateChanged,
    onRotate: ({ rotation, rotationDelta }) => {
      refs.group.current!.quaternion.set(...rotation.toArray());
      accumulate(rotationDelta);
    },
  });

  return (
    <group position={position} ref={refs.group}>
      <mesh
        geometry={geometry}
        material={material}
        ref={refs.surface}
        castShadow
        receiveShadow
        {...bindRotationEvents()}
      />

      <SurfaceItems surfaceMesh={refs.surface.current} rotation={rotation} color={color} count={strands} />
    </group>
  );
}

function SurfaceItems({
  surfaceMesh,
  rotation,
  count,
  color,
}: {
  surfaceMesh: Mesh | null;
  rotation: Quaternion;
  count: number;
  color: ColorRepresentation;
}) {
  const [material] = useState(new SurfaceStrandMaterial(color));

  const geometry = useMemo(() => {
    const g = new ConeGeometry(0.02, 0.7, 5, 5);
    g.translate(0, 0.35, 0);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);

  useFrame(({ clock }) => {
    material.setTime(clock.getElapsedTime());
    material.setStrandRotation(rotation);
  });

  const mesh = useMemo(() => {
    if (!surfaceMesh) {
      return;
    }

    const itemsMesh = new InstancedMesh(geometry, material, count);

    const sampler = new MeshSurfaceSampler(surfaceMesh).build();

    const position = new Vector3();
    const normal = new Vector3();
    const dummy = new Object3D();

    const instanceNormals = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      sampler.sample(position, normal);

      instanceNormals[i * 3 + 0] = normal.x;
      instanceNormals[i * 3 + 1] = normal.y;
      instanceNormals[i * 3 + 2] = normal.z;

      normal.add(position);
      dummy.position.copy(position);
      dummy.lookAt(normal);
      dummy.updateMatrix();
      itemsMesh.setMatrixAt(i, dummy.matrix);
    }

    itemsMesh.geometry.setAttribute('aSurfaceNormal', new InstancedBufferAttribute(instanceNormals, 3));
    itemsMesh.geometry.attributes.aSurfaceNormal.needsUpdate = true;

    itemsMesh.receiveShadow = true;
    itemsMesh.castShadow = true;

    return itemsMesh;
  }, [surfaceMesh]);

  return mesh ? <primitive object={mesh} /> : null;
}

function VisualizeRotation({
  rotation,
  color,
  base,
}: {
  rotation: Quaternion;
  color: ColorRepresentation;
  base: Vector3;
}) {
  const arrow = useRef<ArrowHelper>(null);
  const origin = new Vector3(0, 0, 0);
  useFrame(() => {
    const rotated = base.clone().applyQuaternion(rotation).normalize();
    arrow.current!.setDirection(rotated);
  });

  const [material] = useState(new MeshStandardMaterial({ color: 'white' }));
  const [geometry] = useState(new SphereGeometry(0.2));

  return (
    <>
      <arrowHelper args={[base, origin, 0.4, color]} ref={arrow} />
      <mesh material={material} geometry={geometry} />
    </>
  );
}

function useDirectionAccumulator() {
  const [rotation] = useState(new Quaternion());

  function accumulate(rotationDelta: Quaternion) {
    const delta = rotationDelta.clone().conjugate();
    let newRotation = rotation.clone().premultiply(delta);
    newRotation = capRotation(newRotation, MathUtils.degToRad(120));
    rotation.set(...newRotation.toArray());
  }

  useFrame(() => {
    const angle = 2 * Math.acos(rotation.w);

    if (angle > 0.01) {
      rotation.set(...scaleRotation(rotation, 0.9).toArray());
    }
  });

  return [rotation, accumulate] as const;
}

/**
 * Caps the rotation of a quaternion to a maximum angle while preserving the rotation axis.
 *
 * @param rotation - The quaternion representing the rotation.
 * @param maxRad - The maximum allowable angle in radians.
 * @returns A new quaternion with the capped rotation.
 */
function capRotation(rotation: Quaternion, maxRad: number): Quaternion {
  // Ensure the max angle is non-negative
  maxRad = Math.max(0, maxRad);

  // Extract the axis and angle from the quaternion
  const axis = new Vector3();
  rotation.normalize();
  const angle = 2 * Math.acos(rotation.w); // Calculate the current rotation angle

  // If the current angle exceeds the maximum, cap it
  const cappedAngle = Math.min(angle, maxRad);

  // Reconstruct the quaternion with the capped angle
  return new Quaternion().setFromAxisAngle(axis.set(rotation.x, rotation.y, rotation.z).normalize(), cappedAngle);
}

/**
 * Scales the rotation of a quaternion by a given factor, maintaining the same axis.
 *
 * @param rotation - The original quaternion representing the rotation.
 * @param factor - The scaling factor (0...), where 1 keeps the rotation unchanged and 0 results in no rotation.
 * @returns A new quaternion with the scaled rotation.
 */
function scaleRotation(rotation: Quaternion, factor: number): Quaternion {
  factor = Math.max(0, factor);

  // Extract the axis and angle of rotation from the quaternion
  const axis = new Vector3();
  const angle = 2 * Math.acos(rotation.w); // Angle is 2 * acos(w)

  // Normalize the axis vector (to account for any floating-point errors)
  rotation.normalize();
  axis.set(rotation.x, rotation.y, rotation.z).normalize();

  // Scale the angle by the given factor
  const scaledAngle = angle * factor;

  // Create and return a new quaternion with the scaled rotation
  return new Quaternion().setFromAxisAngle(axis, scaledAngle);
}

function SurfaceItem({ anchor, rotation, parent }: { anchor: Vector3; rotation: Quaternion; parent: Object3D }) {
  const arrow = useRef<ArrowHelper>(null);
  const [color] = useState(new Color(0, 0.1 + 0.5 * Math.random(), 0));

  useFrame(() => {
    const normal = anchor.clone().normalize();

    const parentRotation = new Quaternion();
    parent.getWorldQuaternion(parentRotation);
    const worldNormal = normal.clone().applyQuaternion(parentRotation);

    const direction = worldNormal.applyQuaternion(rotation);

    direction.applyQuaternion(parentRotation.clone().conjugate()).projectOnPlane(normal);

    arrow.current!.setDirection(direction.clone().normalize());
    arrow.current!.setLength(direction.length() * 0.2);
  });

  return <arrowHelper args={[new Vector3(0, 0, 0), anchor, 0.05, color]} ref={arrow} />;
}
