'use client';

// components/TimeComparisonViz.tsx
import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Mesh } from 'three';

type TimeFrame = 'daily' | 'monthly' | 'yearly';

const ASSET_COLORS: Record<string, string> = {
  forex: '#4287f5',
  usEquities: '#42f5a7',
  treasuries: '#f5d242',
  mbs: '#f542b3',
  derivatives: '#8142f5',
  commodities: '#f54242',
};

// Convert volume to visible height with optional log scale
const getBarHeight = (
  volume: number,
  useLog = true,
  scaleFactor = 0.5
): number => {
  if (useLog) {
    return Math.log10(volume + 1) * scaleFactor;
  }
  return volume * 0.00000001 * scaleFactor;
};

interface AssetBarProps {
  position: [number, number, number];
  width: number;
  depth: number;
  assetName: string;
  dailyVolume: number;
  monthlyVolume: number;
  yearlyVolume: number;
  timeFrame: TimeFrame;
}

// Bar representing an asset class
const AssetBar: React.FC<AssetBarProps> = ({
  position,
  width,
  depth,
  assetName,
  dailyVolume,
  monthlyVolume,
  yearlyVolume,
  timeFrame,
}) => {
  const meshRef = useRef<Mesh>(null);

  let volume: number;
  let label: string;
  switch (timeFrame) {
    case 'yearly':
      volume = yearlyVolume;
      label = `$${(yearlyVolume / 1000).toFixed(1)}T yearly`;
      break;
    case 'monthly':
      volume = monthlyVolume;
      label = `$${monthlyVolume.toFixed(1)}T monthly`;
      break;
    default: // daily
      volume = dailyVolume;
      label = `$${dailyVolume.toFixed(1)}B daily`;
  }

  const height = getBarHeight(volume, true);
  const color = ASSET_COLORS[assetName];

  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={[width, height, depth]}
        position={[0, height / 2, 0]}
      >
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </Box>

      {/* <Text
        position={[0, -0.3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.25}
        color="white"
      >
        {assetName.toUpperCase()}
      </Text>

      <Text position={[0, height + 0.3, 0]} fontSize={0.2} color="white">
        {label}
      </Text> */}
    </group>
  );
};

interface AssetData {
  assetName: string;
  position: [number, number, number];
  dailyVolume: number;
  monthlyVolume: number;
  yearlyVolume: number;
}

const TimeComparisonViz: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('daily');

  // Asset data with daily, monthly and yearly volumes
  const assetData: AssetData[] = [
    {
      assetName: 'forex',
      position: [-5, 0, 0],
      dailyVolume: 7500,
      monthlyVolume: (7500 * 30) / 1000,
      yearlyVolume: (7500 * 365) / 1000,
    },
    {
      assetName: 'usEquities',
      position: [-3, 0, 0],
      dailyVolume: 1670,
      monthlyVolume: (1670 * 30) / 1000,
      yearlyVolume: (1670 * 365) / 1000,
    },
    {
      assetName: 'treasuries',
      position: [-1, 0, 0],
      dailyVolume: 232.1,
      monthlyVolume: (232.1 * 30) / 1000,
      yearlyVolume: (232.1 * 365) / 1000,
    },
    {
      assetName: 'mbs',
      position: [1, 0, 0],
      dailyVolume: 265.7,
      monthlyVolume: (265.7 * 30) / 1000,
      yearlyVolume: (265.7 * 365) / 1000,
    },
    {
      assetName: 'derivatives',
      position: [3, 0, 0],
      dailyVolume: 439.2,
      monthlyVolume: (439.2 * 30) / 1000,
      yearlyVolume: (439.2 * 365) / 1000,
    },
    {
      assetName: 'commodities',
      position: [5, 0, 0],
      dailyVolume: 162,
      monthlyVolume: (162 * 30) / 1000,
      yearlyVolume: (162 * 365) / 1000,
    },
  ];

  // Toggle between time frames (UI controls)
  const handleTimeFrameChange = (newTimeFrame: TimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  return (
    <>
      {assetData.map((asset, index) => (
        <AssetBar
          key={index}
          {...asset}
          width={1.5}
          depth={1.5}
          timeFrame={timeFrame}
        />
      ))}

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* UI Controls */}
      <Html position={[0, 6, 0]}>
        <div
          style={{
            background: 'rgba(0,0,0,0.7)',
            padding: '15px',
            borderRadius: '10px',
            color: 'white',
            textAlign: 'center',
            width: '300px',
          }}
        >
          <h2>Asset Transaction Volumes</h2>
          <p>US Equities represent only 0.42% of global financial flows</p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '10px 0',
            }}
          >
            <button
              onClick={() => handleTimeFrameChange('daily')}
              style={{
                background: timeFrame === 'daily' ? '#4287f5' : '#333',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Daily View
            </button>
            <button
              onClick={() => handleTimeFrameChange('monthly')}
              style={{
                background: timeFrame === 'monthly' ? '#4287f5' : '#333',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Monthly View
            </button>
            <button
              onClick={() => handleTimeFrameChange('yearly')}
              style={{
                background: timeFrame === 'yearly' ? '#4287f5' : '#333',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Yearly View
            </button>
          </div>
          <p>Note: Using logarithmic scale to show relative differences</p>
        </div>
      </Html>
    </>
  );
};

export default TimeComparisonViz;
