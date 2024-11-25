import {
  ArrowHelper,
  Color,
  ColorRepresentation,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Quaternion,
  SphereGeometry,
  Vector3,
} from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { CameraControls, Grid, PerformanceMonitor } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import { useMemo, useRef, useState } from 'react';
import { useSpherePoints } from './useSpherePoints';
import { useObjectRotation } from '../CameraDependentObjectRotation/useObjectRotation';

export function Scene() {
  return (
    <>
      <Canvas shadows={true} camera={{ position: [5, 5, 10] }}>
        <PerformanceMonitor>
          <Contents />
        </PerformanceMonitor>
        <Perf position="top-left" showGraph={true} />
      </Canvas>
    </>
  );
}

const count = 1000;
const radius = 1;
const center = new Vector3(1, 1, 1);

function Contents() {
  const [sphereMat] = useState(new MeshStandardMaterial({ color: 'rgb(0,150,0)', flatShading: false }));
  const sphereGeom = useMemo(() => new SphereGeometry(radius, 80, 80), []);

  const points = useSpherePoints(count, radius);

  const [rotation, accumulate] = useDirectionAccumulator();

  const refs = {
    group: useRef<Group>(null),
    ball: useRef<Mesh>(null),
  };

  const [cameraControlsDisabled, setCameraControlsDisabled] = useState(false);
  const bindRotationEvents = useObjectRotation({
    objectRef: refs.ball,
    onRotationStateChanged: setCameraControlsDisabled,
    onRotate: ({ rotation, rotationDelta }) => {
      refs.group.current!.quaternion.set(...rotation.toArray());
      accumulate(rotationDelta);
    },
  });

  return (
    <>
      <CameraControls enabled={!cameraControlsDisabled} />
      <Grid position={[0, 0.0, 0]} infiniteGrid fadeDistance={20} cellColor={'#ffffff'} sectionThickness={0.5} />
      <ambientLight intensity={0.3} />
      <spotLight position={[35, 35, 0]} angle={0.13} intensity={2000} castShadow={true} color="rgb(255, 255, 255)" />
      <axesHelper scale={1} />

      <group position={center} ref={refs.group}>
        <mesh geometry={sphereGeom} material={sphereMat} ref={refs.ball} {...bindRotationEvents()} />
        {points.map((point) => (
          <SurfaceItem
            anchor={point}
            rotation={rotation}
            parent={refs.group.current!}
            key={point.toArray().join(';')}
          />
        ))}
      </group>
    </>
  );
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
    newRotation = capRotation(newRotation, MathUtils.degToRad(90));
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
