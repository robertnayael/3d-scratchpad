import { Html } from '@react-three/drei';
import { memo, useMemo } from 'react';
import {
  BufferGeometry,
  Color,
  ColorRepresentation,
  ConeGeometry,
  Euler,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Quaternion,
  Vector3,
  Vector3Tuple,
} from 'three';

const DefaultColor = 'white';
const Up = new Vector3(0, 1, 0);

const vec3 = (v: Vector3 | [number, number, number] = [0, 0, 0]): Vector3 =>
  v instanceof Vector3 ? v.clone() : new Vector3(...v);

function Axis_({
  direction,
  position,
  length = 1,
  noArrow = false,
  color = DefaultColor,
  width: linewidth = 1,
  label,
  labelScale = 1,
  hidden,
}: {
  direction: Vector3 | Vector3Tuple;
  position?: Vector3 | Vector3Tuple;
  length?: number;
  noArrow?: boolean;
  color?: ColorRepresentation;
  width?: number;
  label?: string;
  labelScale?: number;
  hidden?: boolean;
}) {
  const v = useMemo(
    () => ({
      position: vec3(position),
      direction: vec3(direction).normalize(),
      mid: vec3(direction).setLength(length * 0.75),
      rotation: new Euler().setFromQuaternion(new Quaternion().setFromUnitVectors(Up, vec3(direction).normalize())),
      arrowR: linewidth * 0.02,
      arrowH: linewidth * 0.02 * 5,
    }),
    [position, direction, length],
  );

  const line = useMemo(() => {
    const material = new LineBasicMaterial({ color, linewidth });
    const start = new Vector3();
    const end = vec3(Up).setLength(length);
    const geometry = new BufferGeometry().setFromPoints([start, end]);
    return new Line(geometry, material);
  }, [v, color, linewidth, noArrow]);

  const arrow = useMemo(() => {
    const material = new MeshBasicMaterial({ color });
    const geometry = new ConeGeometry(v.arrowR, v.arrowH);
    geometry.translate(
      ...vec3(Up)
        .setLength(length - v.arrowH / 2)
        .toArray(),
    );
    return new Mesh(geometry, material);
  }, [v, color, linewidth]);

  return (
    <>
      <group position={v.position} rotation={v.rotation} visible={!hidden}>
        <primitive object={line} />
        {noArrow ? null : <primitive object={arrow} />}
      </group>
      {!!label && !hidden && <Label position={v.mid} text={label} color={color} scale={labelScale} />}
    </>
  );
}

function Label({
  position,
  text,
  color,
  scale,
}: {
  position: Vector3;
  text: string;
  color: ColorRepresentation;
  scale: number;
}) {
  const { r, g, b } = new Color(color).multiplyScalar(0.8).convertLinearToSRGB();

  const labelStyle = {
    color: 'white',
    background: `rgb(${r * 255 - 50},${g * 255},${b * 255})`,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 4 * scale,
    borderStyle: 'dotted',
    padding: `${4 * scale}px ${8 * scale}px`,
    fontSize: 16 * scale,
    textShadow: 'black 0 0 2px',
    fontFamily: 'monospace',
    fontWeight: 700,
  };

  return (
    <Html transform distanceFactor={1} scale={scale} position={position} sprite style={labelStyle} occlude="blending">
      {text}
    </Html>
  );
}

export const Axis = memo(Axis_);
