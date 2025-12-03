'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Html,
} from '@react-three/drei';
import * as THREE from 'three';
import { BatteryState } from './types';

// Augment JSX.IntrinsicElements to include Three.js elements used in R3F.
// This resolves TypeScript errors when R3F global types are not correctly picked up.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      capsuleGeometry: any;
      meshPhysicalMaterial: any;
      cylinderGeometry: any;
      ambientLight: any;
      pointLight: any;
      spotLight: any;
    }
  }
}

interface SceneProps {
  batteryState: BatteryState;
}

const HeadMesh = ({ batteryState }: { batteryState: BatteryState }) => {
  const headRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const liquidRef = useRef<THREE.Mesh>(null);

  // Animation logic
  useFrame((state) => {
    if (!headRef.current) return;

    // Gentle floating
    headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;

    // Glitch effect when low battery
    if (batteryState.isGlitching) {
      const glitchIntensity = 0.05;
      headRef.current.position.x = (Math.random() - 0.5) * glitchIntensity;
      headRef.current.position.y = (Math.random() - 0.5) * glitchIntensity;

      if (glowRef.current) {
        // Flicker opacity
        const material = glowRef.current.material as THREE.MeshStandardMaterial;
        material.opacity = 0.5 + Math.random() * 0.5;
      }
    } else {
      // Reset position
      headRef.current.position.lerp(new THREE.Vector3(0, 0, 0), 0.1);
      if (glowRef.current) {
        const material = glowRef.current.material as THREE.MeshStandardMaterial;
        material.opacity = 0.3; // Base opacity
      }
    }

    // Liquid Level Animation (Lerp to target)
    if (liquidRef.current) {
      // Map 0-100 level to physical height logic
      // Max height approx 0.8 units
      const targetScaleY = Math.max(0.01, batteryState.level / 100);
      liquidRef.current.scale.y = THREE.MathUtils.lerp(
        liquidRef.current.scale.y,
        targetScaleY,
        0.1
      );

      // Adjust position so it shrinks from top down (pivot at bottom)
      // Cylinder height is 1. We position center.
      // If scale is 1, pos is 0. If scale is 0.5, pos should be -0.25 (half of the missing height)
      // Actually, easiest to put geometry pivot at bottom, but let's do math
      // Base Y = -0.3. Full Height = 0.6.
      // Center Y = Base Y + (Height * Scale / 2)
      const fullHeight = 0.6;
      const baseY = 0.1; // Forehead location relative center

      // We want the battery in the forehead.
      liquidRef.current.position.y = THREE.MathUtils.lerp(
        liquidRef.current.position.y,
        0.2 + 0.5 * targetScaleY * 0.5 - 0.25,
        0.1
      );
    }
  });

  return (
    <group ref={headRef}>
      {/* Wireframe Head */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#475569"
          wireframe
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner "Brain" Ghost for volume */}
      <mesh scale={0.9}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#1e293b"
          transparent
          opacity={0.5}
          side={THREE.BackSide}
        />
      </mesh>

      {/* The Battery Container (PFC Area) */}
      <group position={[0, 0.3, 0.8]} rotation={[0.2, 0, 0]}>
        {/* Glass Shell */}
        <mesh>
          <capsuleGeometry args={[0.25, 0.5, 4, 8]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.9}
            opacity={0.3}
            transparent
            roughness={0.1}
            thickness={0.1}
          />
        </mesh>

        {/* The Liquid (Fuel) */}
        <mesh ref={liquidRef} position={[0, -0.25, 0]}>
          {/* Cylinder simulating liquid inside capsule */}
          <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />
          <meshStandardMaterial
            color={batteryState.color}
            emissive={batteryState.color}
            emissiveIntensity={batteryState.isGlitching ? 1 : 2}
            toneMapped={false}
          />
        </mesh>

        {/* Label floating above */}
        <Html position={[0, 0.5, 0]} center>
          <div
            className={`text-xs font-mono px-2 py-1 rounded bg-black/80 backdrop-blur border border-white/10 whitespace-nowrap transition-colors duration-300 ${
              batteryState.isGlitching
                ? 'text-red-500 animate-pulse'
                : 'text-slate-300'
            }`}
          >
            PFC BATTERY: {Math.round(batteryState.level)}%
          </div>
        </Html>
      </group>
    </group>
  );
};

export const PrefrontalBattery: React.FC<SceneProps> = ({ batteryState }) => {
  return (
    <div className="w-full h-96 relative rounded-xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 border border-slate-700 shadow-2xl">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight
          position={[-10, 0, 10]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          color={batteryState.color}
        />

        <HeadMesh batteryState={batteryState} />

        <Environment preset="city" />
      </Canvas>

      {/* Overlay Title */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <h3 className="text-slate-400 text-sm font-bold tracking-wider uppercase">
          Biological Fuel Gauge
        </h3>
        <p className="text-slate-500 text-xs">
          Prefrontal Cortex Visualization
        </p>
      </div>
    </div>
  );
};
