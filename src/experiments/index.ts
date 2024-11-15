import { ComponentType } from 'react';
import WindSway from './WindSway';

export type Experiment = {
  title: string;
  id: string;
  description: string;
  Component: ComponentType;
};

export default [WindSway] as Experiment[];
