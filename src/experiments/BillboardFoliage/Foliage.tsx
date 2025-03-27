import { useState } from 'react';
import { foliageGeometry } from './foliageGeometry';
import { foliageMaterial } from './foliageMaterial';

export function Foliage() {
  const [geometry] = useState(foliageGeometry);
  const [material] = useState(foliageMaterial);

  return <mesh geometry={geometry} material={material} />;
}
