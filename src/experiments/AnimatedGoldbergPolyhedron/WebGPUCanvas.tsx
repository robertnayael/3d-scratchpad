import { useState } from 'react';
import * as THREE from 'three/webgpu';
import { Canvas, CanvasProps, extend, Frameloop } from '@react-three/fiber';

export function WebGPUCanvas(canvasProps: CanvasProps & { background?: THREE.ColorRepresentation }) {
  const [frameloop, setFrameloop] = useState<Frameloop>('never');

  return (
    <Canvas
      {...canvasProps}
      frameloop={frameloop}
      gl={async (props) => {
        extend(THREE as any);
        const renderer = new THREE.WebGPURenderer({
          ...(props as ConstructorParameters<typeof THREE.WebGPURenderer>[0]),
          antialias: false,
          forceWebGL: false,
        });
        if (canvasProps.background) {
          renderer.setClearColor(canvasProps.background);
        }
        await renderer.init();
        setFrameloop('always');
        return renderer;
      }}
    />
  );
}
