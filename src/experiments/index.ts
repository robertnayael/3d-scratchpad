import { ComponentType } from 'react';
import CameraDependentObjectRotation from './CameraDependentObjectRotation';
import SurfaceStrands from './SurfaceStrands';
import Wireframe from './Wireframe';
import WindSway from './WindSway';

export type Experiment = {
  title: string;
  id: string;
  description: string;
  Component: ComponentType;
};

export default [CameraDependentObjectRotation, SurfaceStrands, Wireframe, WindSway] as Experiment[];
