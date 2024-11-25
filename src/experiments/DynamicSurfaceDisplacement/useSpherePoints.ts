import { useMemo } from 'react';
import { Vector3 } from 'three';

export function useSpherePoints(count: number, radius: number) {
  return useMemo(() => generateSpherePoints(count, radius), [count, radius]);
}

function generateSpherePoints(count: number, radius: number): Vector3[] {
  const points = [];

  for (let i = 0; i < count; i++) {
    // Generate random spherical coordinates
    const theta = Math.random() * 2 * Math.PI; // Longitude
    const phi = Math.acos(2 * Math.random() - 1); // Latitude

    // Convert spherical coordinates to Cartesian coordinates
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    // Offset the point by the sphere's center
    const point = new Vector3(x, y, z);
    points.push(point);
  }

  return points;
}
