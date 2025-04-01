'use client';

import { useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Environment, Loader, PerspectiveCamera } from '@react-three/drei';
import { cn } from '@/lib/utils';

export function CanvasWrapper({
  height = '400px',
  className,
  cameraSettings: userCameraSettings,
  canvasProps,
  children,
  showLoader = true,
  enableControls = true,
  enableEnvironment = true,
  debug = false,
  ...rest
}: {
  height?: string;
  className?: string;
  cameraSettings?: Record<string, any>;
  canvasProps?: Record<string, any>;
  children: React.ReactNode;
  showLoader?: boolean;
  enableControls?: boolean;
  enableEnvironment?: boolean;
  debug?: boolean;
}) {
  const cameraSettings = useMemo(
    () => ({
      position: [0, 0, 5],
      fov: 75,
      near: 0.1,
      far: 1000,
      ...userCameraSettings,
    }),
    [userCameraSettings]
  );

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-2xl border-2 border-[#182538] bg-[#131a26] shadow-sm'
      )}
      style={{ height }}
      {...rest}
    >
      <Canvas camera={{ manual: true }} {...canvasProps}>
        <PerspectiveCamera
          makeDefault
          position={[0, 0, 5]}
          fov={75}
          near={0.1}
          far={1000}
          {...userCameraSettings}
        />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 7]} intensity={1.5} castShadow />
        {enableEnvironment && <Environment preset="city" />}
        {enableControls && <OrbitControls />}

        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
      {showLoader && <Loader />}
    </div>
  );
}
