import { useMemo } from 'react';

type SceneState = {};

export const useSceneState = (): SceneState =>
  useMemo(() => {
    return {};
  }, []);
