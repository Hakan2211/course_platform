'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Color, BackSide, MeshStandardMaterial } from 'three';
import { Stars, Text, Float } from '@react-three/drei';
import { RoomData, GameStatus } from './types';

// Augment JSX namespace to recognize Three.js intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      fog: any;
      ambientLight: any;
      pointLight: any;
      planeGeometry: any;
      meshStandardMaterial: any;
      boxGeometry: any;
    }
  }
}

interface MazeEnvironmentProps {
  room: RoomData;
  gameStatus: GameStatus;
  choiceResult: boolean | null;
}

export const MazeEnvironment: React.FC<MazeEnvironmentProps> = ({
  room,
  gameStatus,
  choiceResult,
}) => {
  const meshRef = useRef<Mesh>(null);
  const leftWallRef = useRef<Mesh>(null);
  const rightWallRef = useRef<Mesh>(null);
  const floorRef = useRef<Mesh>(null);
  const ceilingRef = useRef<Mesh>(null);

  // Dynamic color for the environment based on the room theme
  const themeColor = useMemo(
    () => new Color(room.colorTheme),
    [room.colorTheme]
  );

  useFrame((state, delta) => {
    // Animation Logic based on Trap Type and Status

    // 1. Loss Aversion: Walls Closing
    if (
      room.visualTrap === 'walls-closing' &&
      leftWallRef.current &&
      rightWallRef.current
    ) {
      if (gameStatus === 'PLAYING') {
        // Slowly close walls
        const speed = 0.5;
        // Start closer for "Narrow Corridor" feel
        if (leftWallRef.current.position.x < -1.5) {
          leftWallRef.current.position.x += delta * speed;
        }
        if (rightWallRef.current.position.x > 1.5) {
          rightWallRef.current.position.x -= delta * speed;
        }
      } else if (gameStatus === 'FEEDBACK') {
        if (choiceResult === false) {
          // CRUSH
          if (leftWallRef.current.position.x < -0.5)
            leftWallRef.current.position.x += delta * 8;
          if (rightWallRef.current.position.x > 0.5)
            rightWallRef.current.position.x -= delta * 8;
        } else {
          // Reset / Open up
          if (leftWallRef.current.position.x > -6)
            leftWallRef.current.position.x -= delta * 4;
          if (rightWallRef.current.position.x < 6)
            rightWallRef.current.position.x += delta * 4;
        }
      } else {
        // Reset positions for new room (Intro/Game Over)
        leftWallRef.current.position.x = -6;
        rightWallRef.current.position.x = 6;
      }
    } else {
      // For non-wall rooms, keep them wide
      if (leftWallRef.current) leftWallRef.current.position.x = -8;
      if (rightWallRef.current) rightWallRef.current.position.x = 8;
    }

    // 2. Overconfidence: Pit
    if (room.visualTrap === 'pit' && floorRef.current) {
      if (gameStatus === 'FEEDBACK' && choiceResult === false) {
        floorRef.current.position.y -= delta * 10; // Fall fast
      } else {
        floorRef.current.position.y = -2; // Reset
      }
    }

    // 3. Sunk Cost: Quicksand (Camera sinking handled in parent, visual handled here)
    if (room.visualTrap === 'quicksand' && floorRef.current) {
      // Pulse the floor opacity/color
      const material = floorRef.current.material as MeshStandardMaterial;
      if (material) {
        material.opacity = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
        material.transparent = true;
      }
    }
  });

  return (
    <group>
      {/* Dynamic Fog - reduced density to see more */}
      <fog
        attach="fog"
        args={[
          room.colorTheme,
          1, // Near
          gameStatus === 'FEEDBACK' && !choiceResult
            ? 5 // Very dense if failed
            : 30 / (room.fogDensity * 10), // Further visibility normally
        ]}
      />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight
        position={[0, 4, 0]}
        intensity={2}
        color={themeColor}
        distance={20}
        decay={2}
      />
      <pointLight position={[0, 2, 5]} intensity={1} color="white" />

      {/* Environment Group with Float for 3D feel */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Floor */}
        <mesh
          ref={floorRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -2, 0]}
        >
          <planeGeometry args={[50, 200]} />
          <meshStandardMaterial
            color={
              room.visualTrap === 'pit'
                ? '#b45309' // Gold-ish brown
                : room.visualTrap === 'quicksand'
                ? '#3f2e21'
                : '#1a1a1a'
            }
            roughness={room.visualTrap === 'mirrors' ? 0.05 : 0.8}
            metalness={room.visualTrap === 'mirrors' ? 0.95 : 0.2}
          />
        </mesh>

        {/* Ceiling */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
          <planeGeometry args={[50, 200]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>

        {/* Left Wall */}
        <mesh ref={leftWallRef} position={[-6, 3, 0]}>
          <boxGeometry args={[1, 10, 200]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={room.visualTrap === 'mirrors' ? 0.9 : 0.4}
            roughness={room.visualTrap === 'mirrors' ? 0.1 : 0.6}
          />
        </mesh>

        {/* Right Wall */}
        <mesh ref={rightWallRef} position={[6, 3, 0]}>
          <boxGeometry args={[1, 10, 200]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={room.visualTrap === 'mirrors' ? 0.9 : 0.4}
            roughness={room.visualTrap === 'mirrors' ? 0.1 : 0.6}
          />
        </mesh>

        {/* 3D Text for Room Title floating in distance */}
        <group position={[0, 1, -10]}>
          <Text
            color={themeColor}
            fontSize={1.5}
            maxWidth={12}
            lineHeight={1}
            letterSpacing={0.05}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#000"
          >
            {room.biasName}
          </Text>
        </group>
      </Float>

      {/* Floating Particles/Stars for movement effect */}
      <Stars
        radius={40}
        depth={60}
        count={5000}
        factor={4}
        saturation={0.5}
        fade
        speed={1}
      />
    </group>
  );
};
