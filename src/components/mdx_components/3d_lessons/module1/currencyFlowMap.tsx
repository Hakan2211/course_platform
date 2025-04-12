'use client';

// components/CurrencyFlowMap.tsx
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Material } from 'three';

// Helper to create curved lines between points
interface CurvedLineProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  thickness: number;
  speed: number;
  flowVolume: number;
}

const CurvedLine: React.FC<CurvedLineProps> = ({
  start,
  end,
  color,
  thickness,
  speed,
  flowVolume,
}) => {
  const lineRef = useRef<{ material: Material & { dashOffset: number } }>(null);
  const curve = useMemo(() => {
    const middleHeight = Math.max(2, Math.log10(flowVolume) * 0.8);
    const curvePoints: THREE.Vector3[] = [];
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(
        (start[0] + end[0]) / 2,
        middleHeight,
        (start[2] + end[2]) / 2
      ),
      new THREE.Vector3(...end)
    );

    for (let i = 0; i <= 50; i++) {
      curvePoints.push(curve.getPoint(i / 50));
    }
    return curvePoints;
  }, [start, end, flowVolume]);

  // Flow animation
  useFrame(({ clock }) => {
    if (lineRef.current) {
      const t = clock.getElapsedTime();
      lineRef.current.material.dashOffset = -t * speed;
    }
  });

  return (
    <Line
      ref={lineRef as any}
      points={curve}
      color={color}
      lineWidth={thickness}
      dashed
      dashSize={0.2}
      dashScale={10}
      dashOffset={0}
    />
  );
};

// Region node representing a financial center
interface RegionNodeProps {
  position: [number, number, number];
  name: string;
  totalVolume: number;
  color: string;
}

const RegionNode: React.FC<RegionNodeProps> = ({
  position,
  name,
  totalVolume,
  color,
}) => {
  const size = Math.log10(totalVolume) * 0.3;

  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[size, size, 0.2, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* <Text position={[0, 0.5, 0]} fontSize={0.3} color="white">
        {name}
      </Text>

      <Text position={[0, 0.2, 0]} fontSize={0.2} color="#aaa">
        ${totalVolume}B daily
      </Text> */}
    </group>
  );
};

interface RegionData {
  name: string;
  position: [number, number, number];
  totalVolume: number;
  color: string;
}

interface FlowData {
  from: string;
  to: string;
  volume: number;
  color: string;
}

const CurrencyFlowMap: React.FC = () => {
  // Financial regions data
  const regions: RegionData[] = [
    {
      name: 'New York',
      position: [-5, 0, -2],
      totalVolume: 6000,
      color: '#4287f5',
    },
    {
      name: 'London',
      position: [0, 0, -4],
      totalVolume: 4000,
      color: '#f542b3',
    },
    {
      name: 'Tokyo',
      position: [5, 0, -2],
      totalVolume: 1200,
      color: '#f5d242',
    },
    {
      name: 'Frankfurt',
      position: [1, 0, -2],
      totalVolume: 800,
      color: '#8142f5',
    },
    {
      name: 'Shanghai',
      position: [4, 0, 0],
      totalVolume: 700,
      color: '#f54242',
    },
    { name: 'Sydney', position: [3, 0, 3], totalVolume: 350, color: '#42f5a7' },
    { name: 'Mumbai', position: [0, 0, 2], totalVolume: 180, color: '#f5a742' },
    {
      name: 'Johannesburg',
      position: [-3, 0, 4],
      totalVolume: 80,
      color: '#42f5f5',
    },
  ];

  // Flow connections between regions
  const flows: FlowData[] = [
    { from: 'New York', to: 'London', volume: 3200, color: '#4287f5' },
    { from: 'London', to: 'Tokyo', volume: 1800, color: '#f542b3' },
    { from: 'New York', to: 'Tokyo', volume: 1200, color: '#42f5a7' },
    { from: 'London', to: 'Frankfurt', volume: 980, color: '#f542b3' },
    { from: 'New York', to: 'Shanghai', volume: 750, color: '#4287f5' },
    { from: 'Tokyo', to: 'Shanghai', volume: 650, color: '#f5d242' },
    { from: 'London', to: 'Mumbai', volume: 320, color: '#f542b3' },
    { from: 'New York', to: 'Sydney', volume: 280, color: '#4287f5' },
    { from: 'London', to: 'Johannesburg', volume: 120, color: '#f542b3' },
    { from: 'New York', to: 'Johannesburg', volume: 60, color: '#4287f5' },
  ];

  return (
    <>
      {/* Render region nodes */}
      {regions.map((region, i) => (
        <RegionNode key={i} {...region} />
      ))}

      {/* Render flow connections */}
      {flows.map((flow, i) => {
        const startRegion = regions.find((r) => r.name === flow.from);
        const endRegion = regions.find((r) => r.name === flow.to);

        if (startRegion && endRegion) {
          return (
            <CurvedLine
              key={i}
              start={startRegion.position}
              end={endRegion.position}
              color={flow.color}
              thickness={Math.log10(flow.volume) * 0.05}
              speed={0.5}
              flowVolume={flow.volume}
            />
          );
        }
        return null;
      })}

      {/* Legend */}
      <Html position={[-7, 3, 0]}>
        <div
          style={{
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            width: '200px',
          }}
        >
          <h3>Global Financial Flows</h3>
          <p>Line thickness: transaction volume</p>
          <p>Node size: regional importance</p>
        </div>
      </Html>
    </>
  );
};

export default CurrencyFlowMap;
