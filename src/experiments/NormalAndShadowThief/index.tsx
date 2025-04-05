import { VanillaThree } from '@/common';
import { Experiment } from '..';
import { initialize } from './initialize';

function NormalAndShadowThief() {
  return <VanillaThree.Component initializer={initialize} />;
}

export default {
  title: 'normal & shadow thief',
  id: 'normalAndShadowThief',
  description: '',
  Component: NormalAndShadowThief,
} as Experiment;
