import { VanillaThree } from '@/common';
import { Experiment } from '..';
import { initialize } from './initialize';

function RenderToTexture() {
  return <VanillaThree.Component initializer={initialize} />;
}

export default {
  title: 'Render to texture',
  id: 'renderToTexture',
  description: '',
  Component: RenderToTexture,
} as Experiment;
