import { useThree, MeshProps, GroupProps } from '@react-three/fiber';
import { RefObject, useState } from 'react';
import { useDrag } from 'react-use-gesture';
import { type Mesh, type Group, Quaternion, Vector3 } from 'three';

type Axes = {
  x: Vector3;
  y: Vector3;
  z: Vector3;
};

type RotationInfo = {
  /**
   * Camera-aligned X, Y and Z axes. Think the world basis rotated the same way as the camera.
   */
  cameraAlignedBasis: Axes;
  rotation: Quaternion;
  rotationDelta: Quaternion;
};

type ObjectRotationOptions<T> = {
  objectRef: RefObject<T>;
  disabled?: boolean;
  responsiveness?: number;
  onRotationStateChanged?: (rotating: boolean) => void;
  onRotate?: (info: RotationInfo) => void;
  /** Axis for applying rotation based on pointer delta X (ie. horizontal pointer movement ) */
  horizontalAxis?: Vector3 | (() => Vector3);
  /** Axis for applying rotation based on pointer delta Y (ie. vertical pointer movement ) */
  verticalAxis?: Vector3 | ((info: RotationInfo) => Vector3);
  /**
   * If enabled, the greater delta value (x/y) will be picked on each move event, and the other one ignored.
   * Makes rotation a bit more "stable", but less responsive on diagonal cursor movements.
   */
  greaterDeltaOnly?: boolean;
};

export function useObjectRotation<T extends Mesh | Group>({
  objectRef,
  disabled,
  responsiveness = 10,
  onRotationStateChanged,
  onRotate,
  horizontalAxis,
  verticalAxis,
}: ObjectRotationOptions<T>): () => T extends Mesh ? MeshProps : GroupProps {
  const { size, camera } = useThree();

  const [rotation] = useState(new Quaternion());

  return useDrag(({ delta: [dx, dy], dragging }) => {
    onRotationStateChanged?.(dragging);
    const screenDelta = {
      x: (dx / size.height) * responsiveness,
      y: (dy / size.height) * responsiveness,
    };

    if (Math.abs(screenDelta.x) < Math.abs(screenDelta.y)) screenDelta.x = 0;
    else screenDelta.y = 0;

    const relativeX = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion).normalize();
    const relativeY = new Vector3(0, 1, 0).applyQuaternion(camera.quaternion).normalize();
    const relativeZ = new Vector3(0, 0, 1).applyQuaternion(camera.quaternion).normalize();

    const worldX = new Vector3(1, 0, 0);
    const worldY = new Vector3(0, 1, 0);

    const rotationDelta = new Quaternion().multiplyQuaternions(
      new Quaternion().setFromAxisAngle(relativeX, screenDelta.y),
      new Quaternion().setFromAxisAngle(worldY, screenDelta.x),
    );

    rotation.premultiply(rotationDelta);

    onRotate?.({
      cameraAlignedBasis: {
        x: relativeX,
        y: relativeY,
        z: relativeZ,
      },
      rotation: rotation.clone(),
      rotationDelta: rotationDelta.clone(),
    });
  }) as () => T extends Mesh ? MeshProps : GroupProps; // https://github.com/pmndrs/use-gesture/issues/182#issuecomment-2477605945
}
