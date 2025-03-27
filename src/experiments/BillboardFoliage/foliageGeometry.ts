import {
  BufferAttribute,
  BufferGeometry,
  ConeGeometry,
  PlaneGeometry,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export function foliageGeometry(): BufferGeometry {
  // const sphere = new SphereGeometry(1, 20, 20).toNonIndexed();
  const sphere = new ConeGeometry(1, 2, 20, 10).toNonIndexed();
  // const sphere = new TorusGeometry(4, 2, 30, 100).toNonIndexed();

  const vertices = toVertices(sphere);

  const quads = vertices.map((vertex) => {
    const quad = new PlaneGeometry(1, 1);
    const rotation = new Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    quad.rotateX(rotation.x);
    quad.rotateY(rotation.y);
    quad.rotateZ(rotation.z);
    quad.translate(...vertex.position.toArray());

    const vCount = quad.getAttribute('position').count;

    // const stolenNormals = new Array(vCount).fill(normal.toArray()).flat();
    // quad.setAttribute('normal', new BufferAttribute(new Float32Array(stolenNormals), 3));

    // Basically, "steal" normals from the sphere
    // TODO: normalize position vector
    quad.setAttribute('normal', new BufferAttribute(new Float32Array(quad.getAttribute('position').array), 3));
    const quadPlaneNormals = new Array(vCount).fill(rotation.toArray()).flat();
    quad.setAttribute('quadPlaneNormal', new BufferAttribute(new Float32Array(quadPlaneNormals), 3));

    return quad;
  });

  const merged = BufferGeometryUtils.mergeGeometries(quads);
  // merged.computeVertexNormals();
  merged.computeBoundingSphere();

  return merged;
  return sphere;
}

type Vertex = {
  position: Vector3;
  normal: Vector3;
};

function toVertices(geometry: BufferGeometry) {
  const positions = geometry.getAttribute('position');
  const normals = geometry.getAttribute('normal');

  const vertices: Vertex[] = [];
  const ids: string[] = [];

  for (let i = 0; i < positions.count * 3; i += 3) {
    const position = new Vector3(positions.array.at(i), positions.array.at(i + 1), positions.array.at(i + 2));
    const normal = new Vector3(normals.array.at(i), normals.array.at(i + 1), normals.array.at(i + 2));
    const id = `${position.toArray().join(';')}`;

    if (!ids.includes(id)) {
      ids.push(id);
      vertices.push({ position, normal });
    }
  }

  return vertices;
}
