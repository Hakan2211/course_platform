'use client'; // Required for R3F components and hooks

import React, { useState, useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Stars,
  shaderMaterial,
  useTexture,
  Text,
} from '@react-three/drei';
import * as THREE from 'three';
import {
  BufferGeometry,
  CatmullRomCurve3,
  Vector3,
  Color,
  Object3D,
} from 'three';
import { CanvasWrapper } from '../../canvas3d/canvasWrapper';
import { Node, Color as R3FColor } from '@react-three/fiber';

// Refine global declaration for PulsatingLineMaterial using R3F Node
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Use Node and explicitly define uniform props
      pulsatingLineMaterial: Node<
        THREE.ShaderMaterial,
        typeof THREE.ShaderMaterial
      > & {
        time?: number;
        color?: THREE.Color | string | number; // Match uniform and allow R3F color types
        pulseSpeed?: number;
        pulseLength?: number;
        opacity?: number;
        width?: number;
        transparent?: boolean;
        depthWrite?: boolean;
        blending?: THREE.Blending;
        attach?: string;
      };
    }
  }
}

// --- Shader Material for Pulsating Lines ---
const PulsatingLineMaterial = shaderMaterial(
  {
    time: 0,
    color: new Color(0.1, 0.3, 0.8),
    pulseSpeed: 2.0,
    pulseLength: 0.3,
    opacity: 1.0,
    width: 1.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    uniform float width;
    void main() {
      vUv = uv;
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      gl_Position = projectionMatrix * viewPosition;
    }
  `,
  // Fragment Shader
  `
    uniform float time;
    uniform vec3 color;
    uniform float pulseSpeed;
    uniform float pulseLength;
    uniform float opacity;
    uniform float width;
    varying vec2 vUv;

    void main() {
      // Primary pulse
      float sinePulse = sin(vUv.x * 30.0 - time * pulseSpeed * 3.0) * 0.5 + 0.5;
      float pulse = pow(sinePulse, 1.5);
      
      // Secondary glow effect
      float glow = exp(-pow((vUv.y - 0.5) * 10.0, 2.0)) * 0.5;
      
      // Fade edges
      float fade = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
      float finalAlpha = (pulse + glow) * fade * opacity * 1.5;
      
      // Dynamic color variation
      vec3 finalColor = color + vec3(
        sin(time * 0.3 + vUv.x * 2.0) * 0.05,
        sin(time * 0.25 + vUv.x * 1.5) * 0.05,
        sin(time * 0.2 + vUv.x) * 0.05
      );
      
      if (finalAlpha < 0.01) discard;
      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `
);
extend({ PulsatingLineMaterial });

interface PulsatingLineMaterialProps extends THREE.ShaderMaterial {
  uniforms: {
    time: { value: number };
    color: { value: Color };
    pulseSpeed: { value: number };
    pulseLength: { value: number };
    opacity: { value: number };
    width: { value: number };
  };
}

// --- Helper Function: Lat/Lon to Vector3 ---
function latLonToVector3(
  lat: number,
  lon: number,
  radius: number
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

// --- Financial Centers Data ---
const financialCenters = [
  { name: 'New York', lat: 40.71, lon: -74.0, importance: 1.0 },
  { name: 'London', lat: 51.5, lon: -0.12, importance: 0.9 },
  { name: 'Tokyo', lat: 35.68, lon: 139.69, importance: 0.8 },
  { name: 'Shanghai', lat: 31.23, lon: 121.47, importance: 0.7 },
  { name: 'Hong Kong', lat: 22.32, lon: 114.17, importance: 0.65 },
  { name: 'Singapore', lat: 1.35, lon: 103.82, importance: 0.6 },
  { name: 'Frankfurt', lat: 50.11, lon: 8.68, importance: 0.55 },
  { name: 'Sydney', lat: -33.86, lon: 151.2, importance: 0.5 },
  { name: 'Zurich', lat: 47.37, lon: 8.54, importance: 0.45 },
  { name: 'Dubai', lat: 25.2, lon: 55.27, importance: 0.4 },
];

// --- Capital Flow Lines Component ---
const CapitalFlowLines = ({
  globeRadius,
  assetType,
}: {
  globeRadius: number;
  assetType: string;
}) => {
  const materialRef = useRef<PulsatingLineMaterialProps>(null!);
  const lineRefs = useRef<(THREE.Line | null)[]>([]);
  const particleRefs = useRef<THREE.InstancedMesh[]>([]);

  // Generate flows between financial centers
  const flows = useMemo(() => {
    const baseFlows = [
      { start: 'New York', end: 'London', volume: 0.95 },
      { start: 'New York', end: 'Tokyo', volume: 0.85 },
      { start: 'New York', end: 'Shanghai', volume: 0.8 },
      { start: 'New York', end: 'Hong Kong', volume: 0.75 },
      { start: 'New York', end: 'Singapore', volume: 0.7 },
      { start: 'New York', end: 'Frankfurt', volume: 0.65 },
      { start: 'London', end: 'Frankfurt', volume: 0.9 },
      { start: 'London', end: 'Tokyo', volume: 0.85 },
      { start: 'London', end: 'Singapore', volume: 0.8 },
      { start: 'London', end: 'Dubai', volume: 0.7 },
      { start: 'Tokyo', end: 'Shanghai', volume: 0.8 },
      { start: 'Tokyo', end: 'Hong Kong', volume: 0.75 },
      { start: 'Shanghai', end: 'Hong Kong', volume: 0.85 },
      { start: 'Hong Kong', end: 'Singapore', volume: 0.8 },
      { start: 'Singapore', end: 'Sydney', volume: 0.7 },
      { start: 'Frankfurt', end: 'Zurich', volume: 0.8 },
      { start: 'Dubai', end: 'Singapore', volume: 0.65 },
    ];

    const assetSpecificFlows = [];
    if (assetType === 'stocks') {
      assetSpecificFlows.push(
        { start: 'New York', end: 'Sydney', volume: 0.6 },
        { start: 'London', end: 'Zurich', volume: 0.75 }
      );
    } else if (assetType === 'futures') {
      assetSpecificFlows.push(
        { start: 'New York', end: 'Dubai', volume: 0.6 },
        { start: 'Shanghai', end: 'Singapore', volume: 0.7 }
      );
    } else if (assetType === 'options') {
      assetSpecificFlows.push(
        { start: 'New York', end: 'Zurich', volume: 0.6 },
        { start: 'Tokyo', end: 'Sydney', volume: 0.6 }
      );
    }

    return [...baseFlows, ...assetSpecificFlows];
  }, [assetType]);

  // Convert named locations to coordinates
  const resolvedFlows = useMemo(() => {
    return flows
      .map((flow) => {
        const startCenter = financialCenters.find((c) => c.name === flow.start);
        const endCenter = financialCenters.find((c) => c.name === flow.end);
        if (!startCenter || !endCenter) return null;
        return {
          start: { lat: startCenter.lat, lon: startCenter.lon },
          end: { lat: endCenter.lat, lon: endCenter.lon },
          volume: flow.volume,
          startName: flow.start,
          endName: flow.end,
        };
      })
      .filter((flow) => flow !== null);
  }, [flows]);

  const lines = useMemo(() => {
    return resolvedFlows.map((flow, index) => {
      const startVec = latLonToVector3(
        flow.start.lat,
        flow.start.lon,
        globeRadius
      );
      const endVec = latLonToVector3(flow.end.lat, flow.end.lon, globeRadius);

      const distance = startVec.distanceTo(endVec);
      const midHeight =
        globeRadius * (1.1 + distance * 0.05 + flow.volume * 0.1);
      const midPoint = startVec
        .clone()
        .lerp(endVec, 0.5)
        .normalize()
        .multiplyScalar(midHeight);

      const curve = new CatmullRomCurve3([
        startVec,
        startVec.clone().lerp(midPoint, 0.3),
        midPoint,
        endVec.clone().lerp(midPoint, 0.3),
        endVec,
      ]);

      const points = curve.getPoints(100);
      const geometry = new BufferGeometry().setFromPoints(points);

      const uvs = new Float32Array(points.length * 2);
      for (let i = 0; i < points.length; i++) {
        uvs[i * 2] = i / (points.length - 1);
        uvs[i * 2 + 1] = 0;
      }
      geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

      const volume = flow.volume;
      const color = new Color(
        volume > 0.8 ? 0.9 : volume > 0.5 ? 0.4 : 0.2,
        volume > 0.8 ? 0.8 : volume > 0.5 ? 0.6 : 0.3,
        volume > 0.8 ? 0.2 : volume > 0.5 ? 0.8 : 0.5
      );

      const width = 2 + volume * 4;
      const pulseSpeed = 1.0 + volume * 0.8;

      return {
        geometry,
        color,
        width,
        pulseSpeed,
        startName: flow.startName,
        endName: flow.endName,
        curve,
      };
    });
  }, [resolvedFlows, globeRadius, assetType]);

  // Particle effect for data flow
  const particles = useMemo(() => {
    return lines.map((line) => {
      const particleCount = 20;
      const geometry = new THREE.SphereGeometry(0.02, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: line.color,
        transparent: true,
        opacity: 0.6,
      });
      return { geometry, material, count: particleCount, curve: line.curve };
    });
  }, [lines]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = time;
    }

    lineRefs.current.forEach((line, i) => {
      if (!line || !line.material) return;
      const material = line.material as any;
      //   if (material.uniforms) {
      //     material.uniforms.opacity.value = 0.7 + Math.sin(time + i * 0.3) * 0.2;
      //   }
    });

    particleRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const { curve, count } = particles[i];
      for (let j = 0; j < count; j++) {
        const t = (time * 0.5 + j / count) % 1;
        const point = curve.getPointAt(t);
        const dummy = new THREE.Object3D();
        dummy.position.copy(point);
        dummy.scale.setScalar(0.5 + Math.sin(time + j) * 0.3);
        dummy.updateMatrix();
        mesh.setMatrixAt(j, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    });
  });

  useEffect(() => {
    lineRefs.current = lineRefs.current.slice(0, lines.length);
    particleRefs.current = particleRefs.current.slice(0, lines.length);
  }, [lines]);

  return (
    <group>
      {lines.map((line, index) => (
        <group key={`line-${line.startName}-${line.endName}`}>
          <line
            key={`line-${line.startName}-${line.endName}`}
            geometry={line.geometry}
            // @ts-ignore - Suppress persistent ref type error
            ref={(el: THREE.Line | null) => (lineRefs.current[index] = el)}
          >
            <pulsatingLineMaterial
              ref={index === 0 ? materialRef : undefined}
              attach="material"
              color={line.color}
              pulseSpeed={line.pulseSpeed}
              pulseLength={0.2}
              opacity={0.8}
              width={line.width}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </line>
          <instancedMesh
            ref={(el) => {
              particleRefs.current[index] = el!;
            }}
            args={[
              particles[index].geometry,
              particles[index].material,
              particles[index].count,
            ]}
          />
        </group>
      ))}
    </group>
  );
};

// --- City Markers Component ---
const CityMarkers = ({
  globeRadius,
  assetType,
}: {
  globeRadius: number;
  assetType: string;
}) => {
  const centerRefs = useRef<(THREE.Group | null)[]>([]);

  useEffect(() => {
    centerRefs.current = centerRefs.current.slice(0, financialCenters.length);
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    centerRefs.current.forEach((center, i) => {
      if (!center) return;
      const pulse = Math.sin(time * 1.5 + i * 0.5) * 0.1 + 1;
      center.scale.set(pulse, pulse, pulse);
    });
  });

  return (
    <group>
      {financialCenters.map((center, idx) => {
        const position = latLonToVector3(
          center.lat,
          center.lon,
          globeRadius + 0.02
        );
        const markerSize = 0.03 + center.importance * 0.03;

        let markerColor;
        switch (assetType) {
          case 'futures':
            markerColor = new Color(0.9, 0.5, 0.1);
            break;
          case 'options':
            markerColor = new Color(0.2, 0.6, 0.8);
            break;
          case 'stocks':
          default:
            markerColor = new Color(0.9, 0.8, 0.2);
        }

        return (
          <group
            key={`marker-${center.name}`}
            position={position}
            ref={(el) => {
              centerRefs.current[idx] = el!;
            }}
          >
            <mesh>
              <sphereGeometry args={[markerSize, 16, 16]} />
              <meshStandardMaterial
                color={markerColor}
                emissive={markerColor}
                emissiveIntensity={0.5}
                transparent
                opacity={0.8}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// --- Globe Component ---
const Globe = ({ radius }: { radius: number }) => {
  const texture = useTexture('/textures/earth_texture.jpg');
  const bumpMap = useTexture('/textures/earth_bump.jpg');

  return (
    <mesh rotation={[0, Math.PI * 0.1, 0]}>
      <sphereGeometry args={[radius, 128, 128]} />
      <meshStandardMaterial
        map={texture}
        bumpMap={bumpMap}
        bumpScale={0.05}
        color={texture ? undefined : '#1a3a7a'}
        roughness={0.5}
        metalness={0.2}
      />
    </mesh>
  );
};

// --- Marketplace Highlight Component ---
interface MarketplaceHighlightProps {
  latitude: number;
  longitude: number;
  areaRadiusDegrees: number;
  boxCount: number;
  boxBaseSize: number;
  boxHeightMultiplier: number;
  globeRadius: number;
  assetType: string;
  cityName: string;
}

const MarketplaceHighlight: React.FC<MarketplaceHighlightProps> = ({
  latitude,
  longitude,
  areaRadiusDegrees,
  boxCount,
  boxBaseSize,
  boxHeightMultiplier,
  globeRadius,
  assetType,
  cityName,
}) => {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new Object3D(), []);

  useMemo(() => {
    if (!instancedMeshRef.current) return;

    const baseHeight = boxBaseSize * boxHeightMultiplier;
    const geometry = new THREE.BoxGeometry(
      boxBaseSize,
      baseHeight,
      boxBaseSize
    );
    instancedMeshRef.current.geometry = geometry;

    const color = new Color();
    let baseColor;
    switch (assetType) {
      case 'futures':
        baseColor = new Color(0.9, 0.5, 0.1);
        break;
      case 'options':
        baseColor = new Color(0.2, 0.6, 0.8);
        break;
      case 'stocks':
      default:
        baseColor = new Color(0.9, 0.8, 0.2);
    }

    for (let i = 0; i < boxCount; i++) {
      const randomAngle = Math.random() * Math.PI * 2;
      const randomRadius = Math.pow(Math.random(), 2) * areaRadiusDegrees;
      const pointLat = latitude + randomRadius * Math.sin(randomAngle);
      const pointLon =
        longitude +
        (randomRadius * Math.cos(randomAngle)) /
          Math.cos((latitude * Math.PI) / 180);

      const distFromCenter = randomRadius / areaRadiusDegrees;
      const heightVariation = 1.0 - distFromCenter * 0.8;
      const finalHeight = baseHeight * heightVariation;

      const position = latLonToVector3(
        pointLat,
        pointLon,
        globeRadius + finalHeight / 2
      );
      dummy.position.copy(position);
      const surfaceNormal = position.clone().normalize();
      dummy.up.copy(surfaceNormal);
      dummy.lookAt(0, 0, 0);

      const sizeVariation = 0.8 + Math.random() * 0.4;
      const scale = 1.0 * heightVariation * sizeVariation;
      dummy.scale.set(scale, scale * (1.0 + Math.random() * 0.5), scale);

      dummy.updateMatrix();
      instancedMeshRef.current.setMatrixAt(i, dummy.matrix);

      const colorVariation = 0.8 + Math.random() * 0.4;
      color.copy(baseColor).multiplyScalar(colorVariation);
      instancedMeshRef.current.setColorAt(i, color);
    }

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    if (instancedMeshRef.current.instanceColor) {
      instancedMeshRef.current.instanceColor.needsUpdate = true;
    }
    instancedMeshRef.current.count = boxCount;
  }, [
    boxCount,
    boxBaseSize,
    boxHeightMultiplier,
    latitude,
    longitude,
    areaRadiusDegrees,
    globeRadius,
    assetType,
  ]);

  useFrame(({ clock }) => {
    if (!instancedMeshRef.current || !instancedMeshRef.current.instanceColor)
      return;
    const time = clock.getElapsedTime();
    const tempColor = new Color();

    for (let i = 0; i < boxCount; i++) {
      if ((i + Math.floor(time * 3)) % 20 === 0) {
        instancedMeshRef.current.getColorAt(i, tempColor);
        const pulseFactor = Math.sin(time * 5 + i * 0.5) * 0.2 + 0.9;
        tempColor.multiplyScalar(pulseFactor);
        instancedMeshRef.current.setColorAt(i, tempColor);
      }
    }

    if (instancedMeshRef.current.instanceColor) {
      instancedMeshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group>
      <instancedMesh
        ref={instancedMeshRef}
        args={[undefined, undefined, boxCount]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          roughness={0.4}
          metalness={0.6}
          emissive={
            assetType === 'futures'
              ? '#ff6000'
              : assetType === 'options'
              ? '#00a0ff'
              : '#ffcc00'
          }
          emissiveIntensity={0.2}
        />
      </instancedMesh>
    </group>
  );
};

// --- Company Buildings Component (New York Stocks) ---
const CompanyBuildings = ({
  globeRadius,
  isActive,
}: {
  globeRadius: number;
  isActive: boolean;
}) => {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new Object3D(), []);
  const boxCount = 50;
  const latitude = 40.71;
  const longitude = -74.0;
  const areaRadiusDegrees = 2;

  const companies = useMemo(() => {
    return Array.from({ length: boxCount }, (_, i) => ({
      marketCap: 0.2 + Math.random() * 0.8,
      id: i,
    }));
  }, []);

  useMemo(() => {
    if (!instancedMeshRef.current || !isActive) return;

    const baseSize = 0.05;
    const geometry = new THREE.BoxGeometry(baseSize, baseSize, baseSize);
    instancedMeshRef.current.geometry = geometry;

    companies.forEach((company, i) => {
      const randomAngle = Math.random() * Math.PI * 2;
      const randomRadius = Math.pow(Math.random(), 2) * areaRadiusDegrees;
      const pointLat = latitude + randomRadius * Math.sin(randomAngle);
      const pointLon =
        longitude +
        (randomRadius * Math.cos(randomAngle)) /
          Math.cos((latitude * Math.PI) / 180);

      const height = baseSize * (1 + company.marketCap * 3);
      const position = latLonToVector3(
        pointLat,
        pointLon,
        globeRadius + height / 2
      );

      dummy.position.copy(position);
      const surfaceNormal = position.clone().normalize();
      dummy.up.copy(surfaceNormal);
      dummy.lookAt(0, 0, 0);

      const scale = 0.8 + company.marketCap * 0.8;
      dummy.scale.set(scale, scale * (1 + company.marketCap * 2), scale);

      dummy.updateMatrix();
      instancedMeshRef.current.setMatrixAt(i, dummy.matrix);

      const color = new Color(0.9, 0.9, 1.0).multiplyScalar(
        0.8 + company.marketCap * 0.4
      );
      instancedMeshRef.current.setColorAt(i, color);
    });

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    if (instancedMeshRef.current.instanceColor) {
      instancedMeshRef.current.instanceColor.needsUpdate = true;
    }
  }, [isActive, globeRadius, companies]);

  useFrame(({ clock }) => {
    if (!instancedMeshRef.current || !isActive) return;
    const time = clock.getElapsedTime();
    for (let i = 0; i < boxCount; i++) {
      instancedMeshRef.current.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
      dummy.position.y += Math.sin(time + i) * 0.002;
      dummy.updateMatrix();
      instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
    }
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!isActive) return null;

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[undefined, undefined, boxCount]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.7}
        roughness={0.2}
        metalness={0.8}
        emissive="#00aaff"
        emissiveIntensity={0.3}
      />
    </instancedMesh>
  );
};

// --- Main Visualization Component ---
const TradingFloorViz: React.FC = () => {
  const [assetType, setAssetType] = useState<'stocks' | 'futures' | 'options'>(
    'stocks'
  );
  const globeRadius = 2.5;

  const highlightParams = useMemo(() => {
    switch (assetType) {
      case 'futures':
        return {
          count: 60,
          baseSize: 0.04,
          heightMult: 4.0,
          color: '#FFA500',
          volumeText: '40.3M Contracts Daily',
        };
      case 'options':
        return {
          count: 150,
          baseSize: 0.03,
          heightMult: 2.5,
          color: '#ADD8E6',
          volumeText: '13.56M Contracts Daily',
        };
      case 'stocks':
      default:
        return {
          count: 100,
          baseSize: 0.04,
          heightMult: 3.0,
          color: '#FFFF00',
          volumeText: '1.67B Shares Daily',
        };
    }
  }, [assetType]);

  const centerHighlights = useMemo(() => {
    let centers = [];
    centers.push({
      name: 'New York',
      lat: 40.71,
      lon: -74.0,
      radius: 4,
      count: highlightParams.count,
    });

    if (assetType === 'stocks') {
      centers.push(
        {
          name: 'London',
          lat: 51.5,
          lon: -0.12,
          radius: 3,
          count: Math.floor(highlightParams.count * 0.8),
        },
        {
          name: 'Tokyo',
          lat: 35.68,
          lon: 139.69,
          radius: 3,
          count: Math.floor(highlightParams.count * 0.7),
        }
      );
    } else if (assetType === 'futures') {
      centers.push(
        {
          name: 'Chicago',
          lat: 41.88,
          lon: -87.63,
          radius: 3,
          count: Math.floor(highlightParams.count * 0.9),
        },
        {
          name: 'Shanghai',
          lat: 31.23,
          lon: 121.47,
          radius: 3,
          count: Math.floor(highlightParams.count * 0.6),
        }
      );
    } else if (assetType === 'options') {
      centers.push(
        {
          name: 'Chicago',
          lat: 41.88,
          lon: -87.63,
          radius: 3,
          count: Math.floor(highlightParams.count * 0.7),
        },
        {
          name: 'Hong Kong',
          lat: 22.32,
          lon: 114.17,
          radius: 3,
          count: Math.floor(highlightParams.count * 0.5),
        }
      );
    }

    return centers;
  }, [assetType, highlightParams]);

  const filteredCenterHighlights = useMemo(() => {
    if (assetType === 'stocks') {
      return centerHighlights.filter((center) => center.name !== 'New York');
    }
    return centerHighlights;
  }, [assetType, centerHighlights]);

  return (
    <div className="relative w-full">
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        {(['stocks', 'futures', 'options'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setAssetType(type)}
            className={`px-4 py-2 rounded-xl shadow-lg text-sm md:text-base font-medium transition-all duration-300 backdrop-blur-md bg-opacity-80 ${
              assetType === type
                ? 'bg-white bg-opacity-20 text-white ring-2 ring-white ring-opacity-50 scale-105'
                : 'bg-gray-900 bg-opacity-50 text-gray-300 hover:bg-opacity-70 hover:text-white hover:scale-102'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="absolute top-4 right-4 z-10 bg-black bg-opacity-70 p-3 rounded-lg shadow-lg">
        <h3 className="text-white font-bold text-lg mb-1">
          {assetType.charAt(0).toUpperCase() + assetType.slice(1)} Trading
          Volume
        </h3>
        <p className="text-gray-200 text-sm">{highlightParams.volumeText}</p>
        <p className="text-gray-300 text-xs mt-1">
          {assetType === 'stocks'
            ? 'NYSE, NASDAQ'
            : assetType === 'futures'
            ? 'CME, ICE, EUREX'
            : 'CBOE, OCC, EUREX'}
        </p>
      </div>

      <CanvasWrapper
        cameraSettings={{ position: [0, 0, 7] }}
        enableEnvironment={false}
        height="700px"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <pointLight
            position={[10, 10, 15]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <directionalLight
            position={[-15, 10, -10]}
            intensity={0.8}
            color="#ffffff"
          />
          <directionalLight
            position={[0, 0, -10]}
            intensity={0.4}
            color="#aaffff"
          />
          <spotLight
            position={[5, 10, 2]}
            angle={0.4}
            penumbra={1.0}
            intensity={1.0}
            castShadow
            color={
              assetType === 'futures'
                ? '#ff7b00'
                : assetType === 'options'
                ? '#0077ff'
                : '#ffcc00'
            }
          />
          <Stars
            radius={150}
            depth={60}
            count={5000}
            factor={6}
            saturation={0.5}
            fade
            speed={0.3}
          />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            target={[0, 0, 0]}
            minDistance={globeRadius + 0.8}
            maxDistance={20}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
            autoRotate={false}
            autoRotateSpeed={0.5}
            zoomSpeed={0.8}
          />
          <Globe radius={globeRadius} />
          <CityMarkers globeRadius={globeRadius} assetType={assetType} />
          <CapitalFlowLines globeRadius={globeRadius} assetType={assetType} />
          {filteredCenterHighlights.map((center) => (
            <MarketplaceHighlight
              key={`${assetType}-${center.name}`}
              latitude={center.lat}
              longitude={center.lon}
              areaRadiusDegrees={center.radius}
              boxCount={center.count}
              boxBaseSize={highlightParams.baseSize}
              boxHeightMultiplier={highlightParams.heightMult}
              globeRadius={globeRadius}
              assetType={assetType}
              cityName={center.name}
            />
          ))}
          <CompanyBuildings
            globeRadius={globeRadius}
            isActive={assetType === 'stocks'}
          />
          <mesh>
            <sphereGeometry args={[globeRadius * 1.1, 32, 32]} />
            <meshBasicMaterial
              color={
                assetType === 'futures'
                  ? '#ff7b00'
                  : assetType === 'options'
                  ? '#0077ff'
                  : '#ffcc00'
              }
              transparent
              opacity={0.05}
            />
          </mesh>
        </Suspense>
      </CanvasWrapper>

      <div className="absolute bottom-4 left-4 z-10 bg-black bg-opacity-70 p-3 rounded-lg shadow-lg max-w-md text-white text-sm">
        <h3 className="font-bold mb-1">
          Global Financial Markets:{' '}
          {assetType.charAt(0).toUpperCase() + assetType.slice(1)}
        </h3>
        <p className="text-gray-300 text-xs">
          {assetType === 'stocks'
            ? 'Visualizing 1.67B daily shares across global exchanges. Boxes represent trading volume concentration.'
            : assetType === 'futures'
            ? 'Displaying 40.3M daily contracts. Commodity, financial, and index futures shown by volume.'
            : 'Showing 13.56M daily options contracts. Equity, index, and ETF options by volume.'}
        </p>
      </div>
    </div>
  );
};

export default TradingFloorViz;
