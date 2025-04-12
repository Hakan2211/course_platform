'use client';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Billboard } from '@react-three/drei';
import { Mesh } from 'three';

const SCALE_FACTOR = 0.0000000005; // Adjust based on your scene scale

interface AssetTowerProps {
  position: [number, number, number];
  name: string;
  dailyVolume: number;
  color: string;
  yearlyGrowth: number;
}

const AssetTower: React.FC<AssetTowerProps> = ({
  position,
  name,
  dailyVolume,
  color,
  yearlyGrowth,
}) => {
  const height = dailyVolume * SCALE_FACTOR;
  const meshRef = useRef<Mesh>(null);

  // Optional animation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group position={position}>
      {/* Base tower representing volume */}
      <Box ref={meshRef} args={[1, height, 1]} position={[0, height / 2, 0]}>
        <meshStandardMaterial color={color} />
      </Box>

      {/* Asset name label */}
      <Billboard position={[0, height + 0.5, 0]}>
        {/* <Text fontSize={0.3} color="white">
          {name}
        </Text>
        <Text fontSize={0.2} position={[0, -0.3, 0]} color="white">
          ${dailyVolume.toLocaleString()}B daily
        </Text>
        <Text
          fontSize={0.2}
          position={[0, -0.6, 0]}
          color={yearlyGrowth > 0 ? 'green' : 'red'}
        >
          {yearlyGrowth > 0 ? '+' : ''}
          {yearlyGrowth}% YoY
        </Text> */}
      </Billboard>
    </group>
  );
};

interface AssetData {
  name: string;
  position: [number, number, number];
  dailyVolume: number;
  color: string;
  yearlyGrowth: number;
}

const AssetTowers: React.FC = () => {
  const assetData: AssetData[] = [
    {
      name: 'Forex',
      position: [-6, 0, 0],
      dailyVolume: 7500,
      color: '#4287f5',
      yearlyGrowth: 0.8,
    },
    {
      name: 'US Equities',
      position: [-3, 0, 0],
      dailyVolume: 1670,
      color: '#42f5a7',
      yearlyGrowth: 22.0,
    },
    {
      name: 'MBS',
      position: [0, 0, 0],
      dailyVolume: 265.7,
      color: '#f542b3',
      yearlyGrowth: 21.1,
    },
    {
      name: 'US Treasuries',
      position: [3, 0, 0],
      dailyVolume: 232.1,
      color: '#f5d242',
      yearlyGrowth: 14.3,
    },
    {
      name: 'Commodities',
      position: [6, 0, 0],
      dailyVolume: 162,
      color: '#f54242',
      yearlyGrowth: -2.5,
    },
  ];

  return (
    <>
      {assetData.map((asset, index) => (
        <AssetTower key={index} {...asset} />
      ))}

      {/* Optional ground plane for reference */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </>
  );
};

export default AssetTowers;
