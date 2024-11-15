import experiments from '@/experiments';
import { RouteObject } from 'react-router-dom';

export const catalogRoutes: RouteObject[] = experiments.map((e) => ({
  path: e.id,
  element: <e.Component />,
}));
