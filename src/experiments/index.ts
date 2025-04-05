import { ComponentType } from 'react';
import CameraDependentObjectRotation from './CameraDependentObjectRotation';
import AnimatedGoldbergPolyhedron from './AnimatedGoldbergPolyhedron';
import SurfaceStrands from './SurfaceStrands';
import VectorFieldFlow from './VectorFieldFlow';
import Wireframe from './Wireframe';
import WindSway from './WindSway';
import RenderToTexture from './RenderToTexture';
import NormalAndShadowThief from './NormalAndShadowThief';

export type Experiment = {
  title: string;
  id: string;
  description: string;
  Component: ComponentType;
};

export default [
  AnimatedGoldbergPolyhedron,
  CameraDependentObjectRotation,
  SurfaceStrands,
  VectorFieldFlow,
  Wireframe,
  WindSway,
  RenderToTexture,
  NormalAndShadowThief,
] as Experiment[];
