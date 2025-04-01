// src/components/canvas/CanvasWrapper.tsx
'use client';
import React, { Suspense, useMemo } from 'react';
import { Canvas, Props as CanvasProps } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Loader,
} from '@react-three/drei';
import { cn } from '@/lib/utils';

interface CameraSettings {
  position?: [number, number, number];
  fov?: number;
  near?: number;
  far?: number;
}

interface CanvasWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: string;
  className?: string;
  cameraSettings?: CameraSettings;
  canvasProps?: Omit<CanvasProps, 'children'>;
  children: React.ReactNode;
  showLoader?: boolean;
  enableControls?: boolean;
  enableEnvironment?: boolean;
  enableDefaultLights?: boolean;
}

const DEFAULT_CAMERA_SETTINGS: Required<CameraSettings> = {
  position: [0, 2, 5],
  fov: 50,
  near: 0.1,
  far: 1000,
};

// --- Component ---

export function CanvasWrapper({
  height = '400px',
  className,
  cameraSettings: userCameraSettings,
  canvasProps,
  children,
  showLoader = true,
  enableControls = true,
  enableEnvironment = true,
  enableDefaultLights = true,
  ...rest // Pass other div props like id, etc.
}: CanvasWrapperProps) {
  const cameraSettings = useMemo(
    () => ({
      ...DEFAULT_CAMERA_SETTINGS,
      ...userCameraSettings,
    }),
    [userCameraSettings]
  );

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-2xl border-2 border-[#182538] bg-[#131a26] shadow-sm', // Basic styling
        className
      )}
      style={{ height }}
      {...rest}
    >
      <Canvas
        shadows // Enable shadows
        flat // Use linear tone mapping by default - often looks cleaner for product-like visuals
        camera={{ manual: true }} // We provide our own camera
        {...canvasProps} // Allow overriding canvas defaults
      >
        {/* --- Camera --- */}
        {/* We use PerspectiveCamera directly to easily apply settings */}
        <PerspectiveCamera
          makeDefault // Sets this as the default camera
          position={cameraSettings.position}
          fov={cameraSettings.fov}
          near={cameraSettings.near}
          far={cameraSettings.far}
        />

        {/* --- Lighting --- */}
        {enableDefaultLights && (
          <>
            <ambientLight intensity={0.8} />
            <directionalLight
              position={[5, 10, 7]}
              intensity={1.5}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              //   shadow-camera-far={50}
              //   shadow-camera-left={-10}
              //   shadow-camera-right={10}
              //   shadow-camera-top={10}
              //   shadow-camera-bottom={-10}
            />
          </>
        )}

        {/* --- Environment --- */}
        {/* Adds subtle ambient lighting and reflections. Choose a preset. */}
        {/* More presets: 'sunset', 'dawn', 'night', 'warehouse', 'forest', 'apartment', 'studio', 'city', 'park', 'lobby' */}
        {enableEnvironment && (
          <Environment preset="city" background={false} /> // 'false' background keeps canvas transparent/bg color
        )}

        {/* --- Controls --- */}
        {enableControls && (
          <OrbitControls
            makeDefault // Sets these as the default controls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            // autoRotate // Uncomment for automatic rotation
            // autoRotateSpeed={0.5}
          />
        )}

        {/* --- Scene Content --- */}
        {/* Suspense is crucial for async operations within R3F (like useGLTF) */}
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>

      {/* --- Loader --- */}
      {/* Optional: Shows a loading indicator via Drei's portal mechanism */}
      {/* This appears *outside* the Canvas DOM element but is controlled by Suspense inside */}
      {showLoader && <Loader />}
    </div>
  );
}
