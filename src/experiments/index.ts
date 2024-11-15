import { ComponentType } from 'react';
import Wireframe from './Wireframe';
import WindSway from './WindSway';

export type Experiment = {
  title: string;
  id: string;
  description: string;
  Component: ComponentType;
};

export default [Wireframe, WindSway] as Experiment[];
