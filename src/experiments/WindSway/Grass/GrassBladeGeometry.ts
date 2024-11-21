import { PlaneGeometry } from 'three';

export class GrassBladeGeometry extends PlaneGeometry {
  constructor() {
    super(0.01, 1, 1, 4);
    this.translate(0, 0.5, 0);
  }
}
