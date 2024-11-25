import { ComponentType } from 'react';
import CameraDependentObjectRotation from './CameraDependentObjectRotation';
import DynamicSurfaceDisplacement from './DynamicSurfaceDisplacement';
import Wireframe from './Wireframe';
import WindSway from './WindSway';

export type Experiment = {
  title: string;
  id: string;
  description: string;
  Component: ComponentType;
};

export default [CameraDependentObjectRotation, DynamicSurfaceDisplacement, Wireframe, WindSway] as Experiment[];
