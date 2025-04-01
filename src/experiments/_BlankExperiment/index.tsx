import { VanillaThree } from '@/common';
import { Experiment } from '..';
import { initialize } from './initialize';

function BlankExperiment() {
  return <VanillaThree.Component initializer={initialize} />;
}

export default {
  title: 'Blank experiment',
  id: 'blankExperiment',
  description: '',
  Component: BlankExperiment,
} as Experiment;
