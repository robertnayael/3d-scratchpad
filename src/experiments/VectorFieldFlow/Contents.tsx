import { useState } from 'react';
import { Spline } from './Spline';

import { SplineCurve, Vector2 } from 'three';
import { VectorFieldMesh } from './VectorFieldMesh';

// nice example: https://80.lv/articles/stylized-water-production-tips/
// water tutorial: https://ameye.dev/notes/stylized-water-shader/

export type SplineInfo = {
  position: Vector2;
  tangent: Vector2;
}[];

export function Contents() {
  const [points] = useState(createSplineCurve({ sampleLength: 0.5 }));
  // return <Spline points={curve.points} />;
  return (
    <>
      <Spline points={points} />
      <VectorFieldMesh points={points} />
    </>
  );
}

function createSplineCurve({ sampleLength }: { sampleLength: number }) {
  const curve = new SplineCurve([
    new Vector2(-14, -8),
    new Vector2(-10, -5),
    new Vector2(-12, 4),
    new Vector2(-12, 10),
    new Vector2(-8, 10),
    new Vector2(-5, 5),
    new Vector2(-2, 2),
    new Vector2(2, 0),
    new Vector2(5, -5),
    new Vector2(10, 0),
    new Vector2(8, 1),
    new Vector2(8, 2),
    new Vector2(10, 2),
    new Vector2(13, -0),
    new Vector2(13, 2),
    new Vector2(12, 6),
    new Vector2(10, 9),
    new Vector2(5, 9),
    new Vector2(4, 14),
  ]);
  curve.computeFrenetFrames(10, false);
  // const points = curve.getPoints(50);

  const length = curve.getLength();
  const step = sampleLength / length;

  const points: SplineInfo = [];

  curve.getPoint(1);
  curve.getTangent(1);

  for (let l = 0; l <= 1; l += step) {
    points.push({
      position: curve.getPointAt(l),
      tangent: curve.getTangentAt(l),
    });
  }

  return points;
}
