import { useMemo, useRef } from 'react';
import { BufferGeometry, Line, LineBasicMaterial, Vector3 } from 'three';
import { SplineInfo } from './Contents';

// https://github.com/hofk/THREEg.js/blob/master/THREEg.js

export function Spline({ points }: { points: SplineInfo }) {
  const material = useRef(new LineBasicMaterial({ color: 'white' })).current;

  const spline = useMemo(() => {
    const geometry = new BufferGeometry().setFromPoints(points.map((p) => p.position));
    const spline = new Line(geometry, material);
    return spline;
  }, [points]);

  return null;

  return (
    <>
      <primitive object={spline} />
      {points.map((p) => {
        const dir = new Vector3(...p.tangent);
        const origin = new Vector3(...p.position);
        const key = p.position.toArray().join(';');
        return <arrowHelper key={key} args={[dir, origin, 0.5, 'white', 0.1, 0.1]} />;
      })}
    </>
  );
}
