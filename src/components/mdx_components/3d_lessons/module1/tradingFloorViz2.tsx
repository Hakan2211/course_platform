'use client'; // Required for R3F components and hooks

import React, { useState, useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Stars,
  shaderMaterial, // Using shaderMaterial again
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
// Removed MeshLine import
import { CanvasWrapper } from '../../canvas3d/canvasWrapper'; // Assuming this exists

// --- Shader Material (For Lines - Volume Representation) ---
const PulsatingLineMaterial = shaderMaterial(
  // Uniforms
  {
    time: 0,
    color: new Color(0.1, 0.3, 0.8),
    pulseSpeed: 1.0, // Base speed, modulated by volume
    baseOpacity: 0.5, // Base opacity, modulated by volume
    volumeIntensity: 0.5, // How much volume affects pulse/opacity (0 to 1)
    // lineWidth: 1.0, // Not directly applicable to THREE.Line rendering but keep if shader logic uses it
  },
  // Vertex Shader (Simple passthrough)
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader (Volume Indication through Pulse & Opacity)
  `
    uniform float time;
    uniform vec3 color;
    uniform float pulseSpeed;       // Modulated by volume in component
    uniform float baseOpacity;      // Modulated by volume in component
    uniform float volumeIntensity;  // Flow volume (0-1)
    varying vec2 vUv;

    void main() {
      // Pulse effect: intensity and speed increase with volumeIntensity
      float speed = pulseSpeed * (1.0 + volumeIntensity * 1.5); // Faster pulse for higher volume
      float pulseStrength = 0.4 + volumeIntensity * 0.6; // Stronger pulse effect (max amplitude)

      // Sine wave for pulsing brightness along the line
      float sinePulse = sin(vUv.x * 25.0 - time * speed) * 0.5 + 0.5; // 0 to 1 range
      float pulseValue = pow(sinePulse, 1.8); // Sharper pulse peak

      // Fade edges smoothly
      float fade = smoothstep(0.0, 0.03, vUv.x) * smoothstep(1.0, 0.97, vUv.x);

      // Final opacity: Base opacity (volume-dependent) + pulse effect (volume-dependent)
      // Higher volume lines are generally more opaque and pulse more intensely
      float finalOpacity = baseOpacity           // Base visibility based on volume
                           + pulseValue * pulseStrength * 0.8 // Add the scaled pulse effect
                           + volumeIntensity * 0.1; // Small constant boost for high volume
      finalOpacity = clamp(finalOpacity * fade, 0.0, 1.0); // Apply fade and clamp

      // Subtle color shimmer remains
      vec3 finalColor = color + vec3(sin(time * 0.3 + vUv.x * 8.0) * 0.05);

      if (finalOpacity < 0.01) discard; // Optimize rendering

      gl_FragColor = vec4(finalColor, finalOpacity);
    }
  `
);
extend({ PulsatingLineMaterial });

interface PulsatingLineMaterialProps extends THREE.ShaderMaterial {
  uniforms: {
    time: { value: number };
    color: { value: Color };
    pulseSpeed: { value: number };
    baseOpacity: { value: number };
    volumeIntensity: { value: number };
    // lineWidth?: { value: number }; // Optional as it's not directly used by Line renderer
  };
}

// --- Helper Function Lat/Lon (Keep as is) ---
function latLonToVector3(
  lat: number,
  lon: number,
  radius: number
): THREE.Vector3 {
  /* ... no changes ... */
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

// --- Financial Centers Data (Keep as is) ---
const financialCenters = [
  /* ... no changes ... */
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
  { name: 'Chicago', lat: 41.88, lon: -87.63, importance: 0.85 },
];

// --- Capital Flow Lines Component (Using THREE.Line + Custom Shader) ---
const CapitalFlowLines = ({
  globeRadius,
  assetType,
}: {
  globeRadius: number;
  assetType: string;
}) => {
  const lineRefs = useRef<
    (THREE.Line<
      THREE.BufferGeometry,
      THREE.Material | THREE.Material[]
    > | null)[]
  >([]); // Explicit type for ref array
  // Single ref for time update is efficient if staggering isn't needed
  const sharedMaterialRef = useRef<PulsatingLineMaterialProps>(null!);

  // --- Flow Data Logic (Keep as is) ---
  const flows = useMemo(() => {
    /* ... same flow generation logic ... */
    const baseFlows = [
      { start: 'New York', end: 'London', volume: 0.95 },
      { start: 'New York', end: 'Tokyo', volume: 0.85 },
      { start: 'New York', end: 'Chicago', volume: 0.9 },
      { start: 'New York', end: 'Shanghai', volume: 0.8 },
      { start: 'New York', end: 'Hong Kong', volume: 0.75 },
      { start: 'New York', end: 'Frankfurt', volume: 0.65 },
      { start: 'London', end: 'Frankfurt', volume: 0.9 },
      { start: 'London', end: 'Tokyo', volume: 0.85 },
      { start: 'London', end: 'Singapore', volume: 0.8 },
      { start: 'London', end: 'Zurich', volume: 0.7 },
      { start: 'Tokyo', end: 'Shanghai', volume: 0.8 },
      { start: 'Tokyo', end: 'Hong Kong', volume: 0.75 },
      { start: 'Shanghai', end: 'Hong Kong', volume: 0.85 },
      { start: 'Hong Kong', end: 'Singapore', volume: 0.8 },
      { start: 'Chicago', end: 'London', volume: 0.8 },
      { start: 'Chicago', end: 'Tokyo', volume: 0.7 },
      { start: 'Frankfurt', end: 'Zurich', volume: 0.8 },
    ];
    const assetSpecificFlows = [];
    if (assetType === 'stocks') {
      assetSpecificFlows.push(
        { start: 'New York', end: 'Sydney', volume: 0.6 },
        { start: 'London', end: 'Hong Kong', volume: 0.7 }
      );
    } else if (assetType === 'futures') {
      assetSpecificFlows.push(
        { start: 'Chicago', end: 'Singapore', volume: 0.75 },
        { start: 'Chicago', end: 'Frankfurt', volume: 0.7 },
        { start: 'New York', end: 'Dubai', volume: 0.6 }
      );
    } else if (assetType === 'options') {
      assetSpecificFlows.push(
        { start: 'Chicago', end: 'Hong Kong', volume: 0.7 },
        { start: 'New York', end: 'Zurich', volume: 0.65 },
        { start: 'London', end: 'Shanghai', volume: 0.6 }
      );
    }
    const uniqueFlows = [];
    const seenPairs = new Set();
    for (const flow of [...baseFlows, ...assetSpecificFlows]) {
      const pair1 = `${flow.start}-${flow.end}`;
      const pair2 = `${flow.end}-${flow.start}`;
      if (!seenPairs.has(pair1) && !seenPairs.has(pair2)) {
        uniqueFlows.push(flow);
        seenPairs.add(pair1);
      }
    }
    return uniqueFlows;
  }, [assetType]);

  // --- Resolve Flows Logic (Keep as is) ---
  const resolvedFlows = useMemo(() => {
    /* ... same resolving logic ... */
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
      .filter((flow): flow is NonNullable<typeof flow> => flow !== null);
  }, [flows]);

  // --- Generate Line Data (Geometry + Shader Params) ---
  const linesData = useMemo(() => {
    return resolvedFlows.map((flow) => {
      const startVec = latLonToVector3(
        flow.start.lat,
        flow.start.lon,
        globeRadius
      );
      const endVec = latLonToVector3(flow.end.lat, flow.end.lon, globeRadius);

      const distance = startVec.distanceTo(endVec);
      // Subtle curve adjustments
      const midHeight =
        globeRadius * (1.02 + distance * 0.01 + flow.volume * 0.04);
      const midPoint = startVec
        .clone()
        .lerp(endVec, 0.5)
        .normalize()
        .multiplyScalar(midHeight);

      const curve = new CatmullRomCurve3(
        [
          startVec,
          startVec.clone().lerp(midPoint, 0.35),
          midPoint,
          endVec.clone().lerp(midPoint, 0.35),
          endVec,
        ],
        false,
        'catmullrom',
        0.4 // Slightly lower tension
      );

      const points = curve.getPoints(80); // Fewer points can be okay for Line
      const geometry = new BufferGeometry().setFromPoints(points);

      // UVs are essential for the shader to map the pulse
      const uvs = new Float32Array(points.length * 2);
      for (let i = 0; i < points.length; i++) {
        uvs[i * 2] = i / (points.length - 1); // U: 0 to 1 along the line
        uvs[i * 2 + 1] = 0; // V: unused
      }
      geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

      // Determine Color
      let color;
      switch (assetType) {
        case 'futures':
          color = new Color(0.9, 0.5, 0.1);
          break; // Orange
        case 'options':
          color = new Color(0.2, 0.6, 0.8);
          break; // Blue
        case 'stocks':
        default:
          color = new Color(0.9, 0.8, 0.2);
          break; // Yellow-gold
      }

      // Shader Parameters based on Volume
      const volumeIntensity = flow.volume; // Direct mapping (0-1)
      // Adjust base opacity: e.g., 0.2 at volume 0, up to 0.6 at volume 1
      const baseOpacity = 0.2 + volumeIntensity * 0.4;
      // Adjust base pulse speed: e.g., 0.8 at volume 0, up to 2.0 at volume 1
      const pulseSpeed = 0.8 + volumeIntensity * 1.2;

      return {
        geometry,
        color,
        pulseSpeed,
        baseOpacity,
        volumeIntensity, // Pass the raw volume intensity to the shader
        startName: flow.startName,
        endName: flow.endName,
      };
    });
  }, [resolvedFlows, globeRadius, assetType]);

  // --- Animation: Update Shader Time ---
  useFrame(({ clock }) => {
    // Update shared time uniform once per frame
    if (sharedMaterialRef.current) {
      sharedMaterialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  // Store line refs
  useEffect(() => {
    lineRefs.current = lineRefs.current.slice(0, linesData.length);
  }, [linesData]);

  return (
    <group>
      {linesData.map((line, index) => (
        <primitive
          key={`line-${line.startName}-${line.endName}-${assetType}`} // Key ensures recreation on asset change
          object={new THREE.Line(line.geometry)}
          ref={(
            el: THREE.Line<
              THREE.BufferGeometry,
              THREE.Material | THREE.Material[]
            > | null
          ) => {
            lineRefs.current[index] = el as THREE.Line<
              THREE.BufferGeometry,
              THREE.Material | THREE.Material[]
            > | null;
          }} // Typed ref callback
        >
          {/* @ts-ignore // Keep ts-ignore for pulsatingLineMaterial if necessary, but uniforms should be typed */}
          <pulsatingLineMaterial
            // Assign the shared ref only to the first material instance
            ref={index === 0 ? sharedMaterialRef : undefined}
            attach="material"
            color={line.color}
            // Pass uniforms using the standard R3F syntax
            uniforms-pulseSpeed-value={line.pulseSpeed}
            uniforms-baseOpacity-value={line.baseOpacity}
            uniforms-volumeIntensity-value={line.volumeIntensity}
            transparent // Must be true for opacity/blending
            depthWrite={false}
            blending={THREE.AdditiveBlending} // Glow effect
          />
        </primitive>
      ))}
    </group>
  );
};

// --- City Markers Component (Keep as is) ---
const CityMarkers = ({
  globeRadius,
  assetType,
}: {
  globeRadius: number;
  assetType: string;
}) => {
  const centerRefs = useRef<(THREE.Group | null)[]>([]); // Ensure ref type is correct
  useEffect(() => {
    centerRefs.current = centerRefs.current.slice(0, financialCenters.length);
  }, []);
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    centerRefs.current.forEach((center, i) => {
      if (!center) return;
      const pulse = Math.sin(time * 1.5 + i * 0.5) * 0.05 + 1;
      center.scale.set(pulse, pulse, pulse);
    });
  });
  return (
    <group>
      {' '}
      {financialCenters.map((center, idx) => {
        const position = latLonToVector3(
          center.lat,
          center.lon,
          globeRadius + 0.01
        );
        const markerSize = 0.015 + center.importance * 0.025;
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
            break;
        }
        return (
          <group
            key={`marker-${center.name}`}
            position={position}
            ref={(el) => {
              centerRefs.current[idx] = el as THREE.Group | null;
            }} // Typed ref callback
          >
            {' '}
            <mesh>
              {' '}
              <sphereGeometry args={[markerSize, 16, 16]} />{' '}
              <meshStandardMaterial
                color={markerColor}
                emissive={markerColor}
                emissiveIntensity={0.4}
                transparent
                opacity={0.9}
                roughness={0.5}
                metalness={0.1}
              />{' '}
            </mesh>{' '}
          </group>
        );
      })}{' '}
    </group>
  );
};

// --- Globe Component (Keep as is) ---
const Globe = ({ radius }: { radius: number }) => {
  /* ... same code as before ... */
  const texture = useTexture('/textures/earth_texture.jpg');
  const bumpMap = useTexture('/textures/earth_bump.jpg');
  return (
    <mesh rotation={[0, Math.PI * 0.1, 0]}>
      {' '}
      <sphereGeometry args={[radius, 64, 64]} />{' '}
      <meshStandardMaterial
        map={texture}
        bumpMap={bumpMap}
        bumpScale={0.03}
        color={texture ? undefined : '#1a3a7a'}
        roughness={0.6}
        metalness={0.2}
      />{' '}
    </mesh>
  );
};

// --- Marketplace Highlight Component (Boxes - Unchanged, only rendering logic changes) ---
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
  assetType /* cityName */,
}) => {
  /* ... same InstancedMesh implementation as before ... */
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new Object3D(), []);
  // Recalculate geometry and instance data when relevant props change
  useMemo(() => {
    if (!instancedMeshRef.current) return;
    const baseHeight = boxBaseSize * boxHeightMultiplier;

    // Update geometry (no need to check parameters as BufferGeometry doesn't have them)
    instancedMeshRef.current.geometry.dispose(); // Dispose old geometry
    instancedMeshRef.current.geometry = new THREE.BoxGeometry(
      boxBaseSize,
      baseHeight,
      boxBaseSize
    );

    // Rest of the instance calculation logic remains the same
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
        break;
    }
    for (let i = 0; i < boxCount; i++) {
      const randomAngle = Math.random() * Math.PI * 2;
      const randomRadius = Math.pow(Math.random(), 1.5) * areaRadiusDegrees;
      const pointLat = latitude + randomRadius * Math.sin(randomAngle);
      const pointLon =
        longitude +
        (randomRadius * Math.cos(randomAngle)) /
          Math.cos((latitude * Math.PI) / 180);
      const distFromCenter = randomRadius / areaRadiusDegrees;
      const heightVariation = 1.0 - distFromCenter * 0.7;
      const finalHeight =
        baseHeight * heightVariation * (0.8 + Math.random() * 0.4);
      const position = latLonToVector3(
        pointLat,
        pointLon,
        globeRadius + finalHeight / 2
      );
      dummy.position.copy(position);
      const surfaceNormal = position.clone().normalize();
      dummy.up.copy(surfaceNormal);
      const lookAtTarget = new Vector3(0, 0, 0);
      dummy.lookAt(lookAtTarget);
      const baseScale = 0.7 + Math.random() * 0.6;
      const heightScaleFactor = finalHeight / baseHeight;
      dummy.scale.set(
        baseScale * (1.2 - heightScaleFactor * 0.4),
        heightScaleFactor,
        baseScale * (1.2 - heightScaleFactor * 0.4)
      );
      dummy.updateMatrix();
      instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
      const colorVariation = 0.85 + Math.random() * 0.3;
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
    const pulseFrequency = 5;
    const pulseSpeed = 4;
    for (let i = 0; i < instancedMeshRef.current.count; i++) {
      instancedMeshRef.current.getColorAt(i, tempColor);
      if (
        (i + Math.floor(time * pulseSpeed)) % (boxCount / pulseFrequency) <
        1
      ) {
        const pulseFactor =
          Math.sin(time * pulseSpeed * 1.5 + i * 0.1) * 0.15 + 0.9;
        tempColor.multiplyScalar(pulseFactor);
        instancedMeshRef.current.setColorAt(i, tempColor);
      }
    }
    if (instancedMeshRef.current.instanceColor) {
      instancedMeshRef.current.instanceColor.needsUpdate = true;
    }
  });
  const materialProps = useMemo(() => {
    let emissiveColor = '#000000';
    switch (assetType) {
      case 'futures':
        emissiveColor = '#ff6000';
        break;
      case 'options':
        emissiveColor = '#00a0ff';
        break;
      case 'stocks':
      default:
        emissiveColor = '#ffcc00';
        break;
    }
    return {
      roughness: 0.6,
      metalness: 0.4,
      emissive: emissiveColor,
      emissiveIntensity: 0.15,
    };
  }, [assetType]);
  return (
    <group>
      {' '}
      <instancedMesh
        ref={instancedMeshRef}
        args={[undefined, undefined, boxCount]}
        castShadow
        receiveShadow
      >
        {' '}
        <meshStandardMaterial key={assetType} {...materialProps} />{' '}
      </instancedMesh>{' '}
    </group>
  );
};

// --- Main Visualization Component (Strict Conditional NYC Box Rendering) ---
const TradingFloorViz: React.FC = () => {
  const [assetType, setAssetType] = useState<'stocks' | 'futures' | 'options'>(
    'stocks'
  );
  const globeRadius = 2.5;

  // Display parameters, including specific box settings ONLY for stocks
  const displayParams = useMemo(() => {
    const nycStockBoxConfig = {
      count: 180, // Even denser for NYC stocks
      baseSize: 0.025, // Slightly smaller base
      heightMult: 5.0, // Taller buildings
      areaRadius: 3.8, // Focused area
    };

    switch (assetType) {
      case 'futures':
        return {
          volumeText: '40.3M Contracts Daily',
          exchanges: 'CME, ICE, EUREX',
          description:
            'Visualizing global futures contracts. Lines indicate major capital flows, pulsing with volume.',
          glowColor: '#ff7b00',
          nycBoxConfig: null, // Explicitly null
        };
      case 'options':
        return {
          volumeText: '13.56M Contracts Daily',
          exchanges: 'CBOE, OCC, EUREX',
          description:
            'Visualizing global options contracts. Lines indicate major capital flows, pulsing with volume.',
          glowColor: '#0077ff',
          nycBoxConfig: null, // Explicitly null
        };
      case 'stocks':
      default:
        return {
          volumeText: '1.67B Shares Daily',
          exchanges: 'NYSE, NASDAQ',
          description:
            'Visualizing 1.67B daily shares. Boxes represent company/trading concentration in New York.',
          glowColor: '#ffdd00',
          nycBoxConfig: nycStockBoxConfig, // Add config only for stocks
        };
    }
  }, [assetType]);

  // Prepare props for MarketplaceHighlight ONLY if it's stocks and config exists
  const newYorkHighlightData = useMemo(() => {
    const nyc = financialCenters.find((c) => c.name === 'New York');
    if (assetType === 'stocks' && displayParams.nycBoxConfig && nyc) {
      return {
        cityName: nyc.name,
        latitude: nyc.lat,
        longitude: nyc.lon,
        areaRadiusDegrees: displayParams.nycBoxConfig.areaRadius,
        boxCount: displayParams.nycBoxConfig.count,
        boxBaseSize: displayParams.nycBoxConfig.baseSize,
        boxHeightMultiplier: displayParams.nycBoxConfig.heightMult,
      };
    }
    return null; // No boxes for NYC otherwise
  }, [assetType, displayParams]);

  return (
    <>
      <div className="relative w-full">
        {/* UI Elements (Buttons, Info Panels) - Unchanged */}
        <div className="absolute top-4 left-4 z-10 flex space-x-2">
          {(['stocks', 'futures', 'options'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setAssetType(type)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-md text-xs md:text-sm font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                assetType === type
                  ? type === 'stocks'
                    ? 'bg-yellow-500 text-black ring-yellow-300 transform scale-105'
                    : type === 'futures'
                    ? 'bg-orange-500 text-white ring-orange-300 transform scale-105'
                    : 'bg-blue-500 text-white ring-blue-300 transform scale-105'
                  : 'bg-gray-700 bg-opacity-80 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              {' '}
              {type.charAt(0).toUpperCase() + type.slice(1)}{' '}
            </button>
          ))}
        </div>
        <div className="absolute top-4 right-4 z-10 bg-black bg-opacity-70 backdrop-blur-sm p-3 rounded-lg shadow-lg max-w-xs">
          <h3 className="text-white font-semibold text-base md:text-lg mb-1">
            {' '}
            {assetType.charAt(0).toUpperCase() + assetType.slice(1)} Volume{' '}
          </h3>
          <p className="text-gray-200 text-xs md:text-sm">
            {displayParams.volumeText}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Exchanges: {displayParams.exchanges}
          </p>
        </div>

        <CanvasWrapper enableEnvironment={false} height="700px">
          <Suspense fallback={null}>
            {/* Scene setup (Lighting, Stars, Controls) - Unchanged */}
            <ambientLight intensity={0.3} />
            <pointLight
              position={[10, 10, 15]}
              intensity={0.8}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <directionalLight
              position={[-15, 15, -10]}
              intensity={0.5}
              color="#ffffff"
            />
            <spotLight
              position={[8, 12, 5]}
              angle={0.4}
              penumbra={0.6}
              intensity={1.2}
              castShadow
              color={displayParams.glowColor}
            />
            <Stars
              radius={150}
              depth={60}
              count={7000}
              factor={5}
              saturation={0.1}
              fade
              speed={0.4}
            />
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              target={[0, 0, 0]}
              minDistance={globeRadius + 0.5}
              maxDistance={15}
              maxPolarAngle={Math.PI}
              minPolarAngle={0}
              autoRotate={true}
              autoRotateSpeed={0.15}
              zoomSpeed={0.7}
            />

            {/* Globe */}
            <Globe radius={globeRadius} />

            {/* City Markers (Always visible) */}
            <CityMarkers globeRadius={globeRadius} assetType={assetType} />

            {/* Capital Flow Lines (Using custom shader, key forces update) */}
            <CapitalFlowLines
              key={assetType}
              globeRadius={globeRadius}
              assetType={assetType}
            />

            {/* CONDITIONAL Rendering of NYC Boxes */}
            {newYorkHighlightData && (
              <MarketplaceHighlight
                key={`${assetType}-NYC-Boxes`} // Unique key for this instance
                latitude={newYorkHighlightData.latitude}
                longitude={newYorkHighlightData.longitude}
                areaRadiusDegrees={newYorkHighlightData.areaRadiusDegrees}
                boxCount={newYorkHighlightData.boxCount}
                boxBaseSize={newYorkHighlightData.boxBaseSize}
                boxHeightMultiplier={newYorkHighlightData.boxHeightMultiplier}
                globeRadius={globeRadius}
                assetType={assetType} // Pass assetType for consistent material
                cityName={newYorkHighlightData.cityName}
              />
            )}

            {/* Atmospheric Glow - Unchanged */}
            <mesh scale={[1.02, 1.02, 1.02]}>
              {' '}
              <sphereGeometry args={[globeRadius, 64, 64]} />{' '}
              <meshBasicMaterial
                color={displayParams.glowColor}
                transparent
                opacity={0.04}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                side={THREE.BackSide}
              />{' '}
            </mesh>
          </Suspense>
        </CanvasWrapper>

        {/* Bottom description panel (Updated text) */}
        <div className="absolute bottom-4 left-4 z-10 bg-black bg-opacity-70 backdrop-blur-sm p-3 rounded-lg shadow-lg max-w-sm text-white text-xs md:text-sm">
          <h3 className="font-semibold mb-1">
            {' '}
            Global Financial Markets:{' '}
            {assetType.charAt(0).toUpperCase() + assetType.slice(1)}{' '}
          </h3>
          <p className="text-gray-300 text-xs">
            {displayParams.description}
            {assetType === 'stocks'
              ? ' Higher density boxes in NYC indicate greater trading activity.'
              : ''}
          </p>
        </div>
      </div>
    </>
  );
};

export default TradingFloorViz;
