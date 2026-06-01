import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlanetStore } from '@/contexts/PlanetContext';

// Grass field around planet
export function GrassField() {
  const health = usePlanetStore(state => state.health);
  const groupRef = useRef<THREE.Group>(null);
  
  // Always call useMemo, but return null if condition not met
  const grassData = useMemo(() => {
    if (health.vegetation < 40) return null;
    const blades = [];
    const count = Math.min(Math.floor(health.vegetation * 2), 100);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.3 + Math.PI * 0.35;
      const r = 2.02;
      blades.push({
        pos: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        ],
        rot: [Math.random() * 0.3, theta, Math.random() * 0.3],
        scale: 0.5 + Math.random() * 0.5
      });
    }
    return blades;
  }, [health.vegetation]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.x = Math.sin(state.clock.elapsedTime * 2 + i) * 0.1;
          child.rotation.z = Math.cos(state.clock.elapsedTime * 1.5 + i) * 0.05;
        }
      });
    }
  });

  if (!grassData) return null;
  
  return (
    <group ref={groupRef}>
      {grassData.map((blade, i) => (
        <mesh key={i} position={blade.pos as [number, number, number]} rotation={blade.rot as [number, number, number]} scale={blade.scale}>
          <coneGeometry args={[0.008, 0.06, 3]} />
          <meshStandardMaterial color="#4CAF50" roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

// Dust particles for polluted planet
export function DustParticles() {
  const health = usePlanetStore(state => state.health);
  const pointsRef = useRef<THREE.Points>(null);
  
  const count = Math.max(0, Math.floor((60 - health.cleanliness) * 3));
  
  const geometry = useMemo(() => {
    if (count <= 0) return null;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 2.2 + Math.random() * 1.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current && geometry) {
      pointsRef.current.rotation.y += 0.002;
    }
  });

  if (!geometry || health.cleanliness > 60) return null;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.025} color="#8B7355" transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

// Trash items for polluted planet
export function TrashItems() {
  const health = usePlanetStore(state => state.health);
  
  const trashCount = Math.max(0, Math.floor((50 - health.cleanliness) * 0.5));
  
  const trashItems = useMemo(() => {
    if (trashCount <= 0) return [];
    return Array.from({ length: trashCount }, (_, i) => {
      const theta = (i / Math.max(1, trashCount)) * Math.PI * 2 + Math.random();
      const phi = Math.random() * Math.PI * 0.5 + Math.PI * 0.25;
      const r = 2.01;
      return {
        pos: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        ] as [number, number, number],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number]
      };
    });
  }, [trashCount]);

  if (trashCount <= 0) return null;
  
  return (
    <group>
      {trashItems.map((item, i) => (
        <mesh key={i} position={item.pos} rotation={item.rot}>
          <cylinderGeometry args={[0.025, 0.018, 0.1, 8]} />
          <meshStandardMaterial color="#5DADE2" roughness={0.5} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// Pollen particles for healthy planet
export function PollenParticles() {
  const health = usePlanetStore(state => state.health);
  const pointsRef = useRef<THREE.Points>(null);
  
  const count = Math.max(0, Math.floor(health.vegetation * 1.5));
  
  const geometry = useMemo(() => {
    if (count <= 0) return null;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 2.3 + Math.random() * 1;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.003;
    }
  });

  if (!geometry || health.overall < 50) return null;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.018} color="#FFD700" transparent opacity={0.5} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

// Water flow effect
export function WaterFlow() {
  const health = usePlanetStore(state => state.health);
  const pointsRef = useRef<THREE.Points>(null);
  
  const count = Math.max(0, Math.floor(health.water * 0.8));
  
  const geometry = useMemo(() => {
    if (count <= 0) return null;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.PI * 0.3 + Math.random() * Math.PI * 0.2;
      const r = 2.05 + Math.random() * 0.1;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [count]);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.01;
    }
  });

  if (!geometry || health.water < 30) return null;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.035} color="#87CEEB" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}
