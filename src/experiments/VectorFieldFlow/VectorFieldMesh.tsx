import { useEffect, useMemo, useState } from 'react';
import { SplineInfo } from './Contents';
import { BufferGeometry, Color, Float32BufferAttribute, PlaneGeometry, RepeatWrapping, Vector2, Vector3 } from 'three';
import { FlowingMaterial } from './FlowingMaterial';
import { useTexture } from '@react-three/drei';
import causticsMap from './caustics2.jpg';
import { useControls } from 'leva';

type VertexInfo = {
  closestSplinePosition: Vector2;
  vertexPosition: Vector2;
  direction: Vector2;
  distance: number;
};

export function VectorFieldMesh({ points }: { points: SplineInfo }) {
  const [material] = useState(new FlowingMaterial());
  const caustics = useTexture(causticsMap);
  caustics.wrapS = caustics.wrapT = RepeatWrapping;
  material.setDebugMap(caustics);

  const settings = useControls({
    time: {
      label: 'Time progress (0 = automatic)',
      value: 0,
      min: 0,
      max: 20,
      step: 0.01,
    },
    showDirections: {
      label: 'Show flow vectors',
      value: false,
    },
    streamWidth: {
      label: 'Stream width',
      value: 3,
      min: 1,
      max: 50,
      step: 1,
    },
  });

  useEffect(() => {
    material.setDebugTime(settings.time);
  }, [settings]);

  const [geometry] = useState(new PlaneGeometry(30, 30, 60, 60));

  const [arrows] = useMemo(() => {
    // const offset = child.geometry.boundingBox.getCenter(matrix);
    // geometry.translate(20, 20, 0);

    // setColorAttrByPosition(geometry);
    console.time('Mesh attrs');
    const pointsWithDirection = setAttrsBySpline(geometry, points, settings.streamWidth);
    // console.timeEnd('Mesh attrs');

    const arrows = pointsWithDirection.map((p) => {
      const dir = new Vector3(...p.direction);
      const origin = new Vector3(...p.vertexPosition);
      const key = origin.toArray().join(';');
      return <arrowHelper args={[dir, origin, 0.5 * (1 - p.distance), 'orange', 0.1, 0.1]} key={key} />;
    });

    return [arrows];
  }, [points, settings.streamWidth]);

  return (
    <group>
      <mesh geometry={geometry} material={material} />
      {settings.showDirections && <group position={[-0, -0, 0.1]}>{arrows}</group>}
      {/* <group position={[-0, -0, 0.1]}>{arrows}</group> */}
    </group>
  );
}

function setAttrsBySpline(geometry: BufferGeometry, points: SplineInfo, threshold: number) {
  const pos = geometry.getAttribute('position');

  const colors: number[] = [];
  const flowSpeed: number[] = [];
  const flowDirection: number[] = [];
  const relevantPoints: VertexInfo[] = [];

  for (let i = 0; i < pos.count * pos.itemSize; i += pos.itemSize) {
    const [x, y] = [pos.array.at(i)!, pos.array.at(i + 1)!];

    const result = getClosestSplinePoint(new Vector2(x, y), points, threshold);
    const distance = result?.distance ?? 1;
    const direction = result?.direction ?? new Vector2();

    if (result) relevantPoints.push(result);

    colors.push(...new Color(0, 0.25 - distance / 4, 0).toArray());
    flowSpeed.push(1 - distance);
    flowDirection.push(...direction.toArray());
  }

  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  geometry.setAttribute('flowSpeed', new Float32BufferAttribute(flowSpeed, 1));
  geometry.setAttribute('flowDirection', new Float32BufferAttribute(flowDirection, 2));

  return relevantPoints;
}

function getClosestSplinePoint(point: Vector2, points: SplineInfo, threshold: number): VertexInfo | null {
  let candidate: SplineInfo[number] | undefined;
  let candidateDistance = Infinity;

  points.forEach((newCandidate) => {
    const distance = point.distanceTo(newCandidate.position);
    if (distance <= threshold && distance < candidateDistance) {
      candidate = newCandidate;
      candidateDistance = distance;
    }
  });

  if (!candidate) {
    return null;
  }

  return {
    closestSplinePosition: candidate.position,
    vertexPosition: point,
    direction: candidate.tangent.clone().normalize(),
    distance: candidateDistance / threshold,
  };
}

function setColorAttrByPosition(geometry: BufferGeometry) {
  const pos = geometry.getAttribute('position');

  const colors: number[] = [];

  for (let i = 0; i < pos.count * pos.itemSize; i += pos.itemSize) {
    const [x, y] = [pos.array.at(i)!, pos.array.at(i + 1)!];
    colors.push(...new Color(x / 40, y / 40, 0).toArray());
  }

  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  return geometry;
}
