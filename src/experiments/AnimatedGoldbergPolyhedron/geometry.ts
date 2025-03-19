import { BufferAttribute, BufferGeometry, Mesh, MeshStandardMaterial, Triangle, Vector3 } from 'three';
import { pairwise } from '@/utils';
import sample1 from './data/polyhedron1.json';

const sample = sample1;

/** Order polygon boundary clock-wise */
function orderBoundary(boundary: Vector3[]): Vector3[] {
  const b = boundary.map((b) => new Vector3(+b.x, +b.y, +b.z));
  const o = new Vector3(0, 0, 0);
  const t = new Triangle(b[0], b[1], b[2]);
  const flip = t.getNormal(o).dot(b[0]) < 0;
  return flip ? b.reverse() : b;
}

/** Resize polygon boundary around center */
function resizeBoundary(boundary: Vector3[], center: Vector3, ratio: number): Vector3[] {
  if (ratio <= 0) throw new Error('Boundary resize ration must be greater than zero');
  const c = center;
  return boundary.map((v) => {
    const diff = v.clone().sub(c);
    diff.multiply(new Vector3().addScalar(ratio));
    return diff.add(c);
  });
}

/** Move polygon boundary relative to origin (which is also the Goldberg polyhedron center) */
function offsetBoundary(boundary: Vector3[], offset: number): Vector3[] {
  const b = boundary.map((v) => {
    return v.clone().multiplyScalar(offset);
  });
  return b;
}

/** Create geometry for a polygon */
function closePolygon(boundary: Vector3[], polygonCenter: Vector3) {
  const polygonNormal = polygonCenter.clone().normalize().toArray();

  const position: number[] = [];
  const normal: number[] = [];

  const c = boundary[0];
  pairwise(boundary).forEach(([a, b]) => {
    position.push(+a.x, +a.y, +a.z, +b.x, +b.y, +b.z, +c.x, +c.y, +c.z);
    normal.push(...polygonNormal, ...polygonNormal, ...polygonNormal);
  });

  return {
    position,
    normal,
  };
}

/** Create geometry for sides between 2 boundaries, or "rings" */
function closeWalls(boundaries: Vector3[][]) {
  const position: Vector3[] = [];
  const normal: Vector3[] = [];

  pairwise(boundaries)
    .slice(0, -1)
    .forEach(([bottom, top]) => {
      const bSegs = pairwise(bottom);
      const tSegs = pairwise(top);

      tSegs.forEach((segmentTop, i) => {
        const segmentBottom = bSegs[i];
        const [a, b] = segmentTop;
        const [c, d] = segmentBottom;

        // prettier-ignore
        position.push(
          b,a,d,
          c,d,a,
        );

        const sideNormal = new Vector3();
        new Triangle(b, a, d).getNormal(sideNormal);
        normal.push(...Array(6).fill(sideNormal));
      });
    });

  return {
    position: position.flatMap((p) => p.toArray()),
    normal: normal.flatMap((p) => p.toArray()),
  };
}

/**
 * Create a column out of a single pentagonal/hexagonal face of a Goldber polyhedron.
 * Also calculate an alternative version of the column's positions, with the top vertices
 * higher up (i.e. farther from the polyhedron center).
 */
function createColumn(polygon: Vector3[], center: Vector3) {
  // Values for buffer attributes
  const position: number[] = [];
  const positionAlt: number[] = [];
  const normal: number[] = [];

  // Column base
  let bottom = orderBoundary(polygon);
  bottom = resizeBoundary(bottom, center, 0.9);
  // Column cap in "rest" mode (quite low)
  const topLow = offsetBoundary(bottom, 1.01);
  // Column cap in "active" mode (taller)
  const topHigh = offsetBoundary(bottom, 1.2);

  const cap = closePolygon(topLow, center);
  const capAlt = closePolygon(topHigh, center);

  const walls = closeWalls([bottom, topLow]);
  const wallsAlt = closeWalls([bottom, topHigh]);

  position.push(...cap.position);
  position.push(...walls.position);

  positionAlt.push(...capAlt.position);
  positionAlt.push(...wallsAlt.position);

  normal.push(...cap.normal);
  normal.push(...walls.normal);

  return {
    position,
    positionAlt,
    normal,
  };
}

export function createGeometry(): BufferGeometry {
  const geometry = new BufferGeometry();

  const position: number[] = [];
  const positionAlt: number[] = [];
  const normal: number[] = [];
  const polygonCenter: number[] = [];

  sample.forEach((face) => {
    const polygon = face.boundary.map((b) => new Vector3(+b.x, +b.y, +b.z));
    const center = new Vector3(+face.center.x, +face.center.y, +face.center.z);
    const column = createColumn(polygon, center);

    position.push(...column.position);
    positionAlt.push(...column.positionAlt);
    normal.push(...column.normal);
    polygonCenter.push(
      ...Array(column.position.length / 3)
        .fill(center.toArray())
        .flat(),
    );
  });

  geometry.setAttribute('position', new BufferAttribute(new Float32Array(position), 3));
  geometry.setAttribute('positionAlt', new BufferAttribute(new Float32Array(positionAlt), 3));
  geometry.setAttribute('normal', new BufferAttribute(new Float32Array(normal), 3));
  geometry.setAttribute('polygonCenter', new BufferAttribute(new Float32Array(polygonCenter), 3));

  return geometry;
}
