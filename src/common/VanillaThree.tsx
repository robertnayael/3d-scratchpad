import { EffectCallback, useEffect, useRef } from 'react';

export default useEffectOnce;

export namespace VanillaThree {
  /**
   * Function for setting up all Three.js components,
   * including the scene, render, rendering loop and cameras.
   *
   * @returns A promise to notify that everything is ready to run
   *          (eg. the renderer has initialized).
   */
  export type Initializer = (params: Params) => Promise<void>;
  export type Params = {
    /** Element which the renderer should attach to */
    domContainer: HTMLDivElement;
    /** Registers a function to run everytime the viewport dimensions change */
    handleViewportChange: (handler: ViewportChangeHandler) => void;
    /** Registers a cleanup function to free up resources */
    handleCleanup: (handler: CleanUpHandler) => void;
  };
  export type Viewport = {
    width: number;
    height: number;
    aspect: number;
    pixelRatio: number;
  };
  export type ViewportChangeHandler = (viewport: Viewport) => void;
  export type CleanUpHandler = () => void;

  /**
   * Simple React component that runs an {@link Initializer} function,
   * creates a div viewport for attaching a Three.js renderer, notifies
   * viewport size changes and performs any cleanup specified by the {@link Initializer}.
   *
   * The idea here is to provide a barebones space for a "vanilla" Three.js setup
   * that fits into a larger React application.
   */
  function ThreeCanvasComponent({ initializer }: { initializer: Initializer }) {
    const initializerHasRun = useRef(false);
    const container = useRef<HTMLDivElement>(null);
    const viewportChangeHandler = useRef<ViewportChangeHandler>(null);
    const cleanupHandler = useRef<CleanUpHandler>(() => {});

    useEffectOnce(() => {
      if (initializerHasRun.current) return;
      initializerHasRun.current = true;

      const initialization = initializer({
        domContainer: container.current!,
        handleViewportChange: (handler) => (viewportChangeHandler.current = handler),
        handleCleanup: (handler) => (cleanupHandler.current = handler),
      });

      const notifyViewportChange = () =>
        viewportChangeHandler.current?.({
          width: window.innerWidth,
          height: window.innerHeight,
          aspect: window.innerWidth / window.innerHeight,
          pixelRatio: window.devicePixelRatio,
        });

      initialization.then(notifyViewportChange);
      window.addEventListener('resize', notifyViewportChange);

      return () => {
        window.removeEventListener('resize', notifyViewportChange);
        cleanupHandler.current?.();
      };
    });

    return <div ref={container} />;
  }

  export const Component = ThreeCanvasComponent;
}

/**
 * Ensures that both the effect *and* the cleanup function only run once,
 * even in strict mode.
 */
function useEffectOnce(effect: EffectCallback) {
  const destroyFunc = useRef<void | any>(null);
  const calledOnce = useRef(false);
  const renderAfterCalled = useRef(false);

  if (calledOnce.current) {
    renderAfterCalled.current = true;
  }

  useEffect(() => {
    if (calledOnce.current) {
      return;
    }

    calledOnce.current = true;
    destroyFunc.current = effect();

    return () => {
      if (!renderAfterCalled.current) {
        return;
      }

      if (destroyFunc.current) {
        destroyFunc.current();
      }
    };
  }, []);
}
