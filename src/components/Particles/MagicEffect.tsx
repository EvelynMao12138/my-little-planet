import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlanetStore } from '@/contexts/PlanetContext';

export function MagicEffect({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const { health } = usePlanetStore();
  
  const count = 50;
  
  const { positions, velocities, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities: number[] = [];
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = Math.random() * 0.5;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      velocities.push(
        (Math.random() - 0.5) * 0.02,
        Math.random() * 0.03 + 0.01,
        (Math.random() - 0.5) * 0.02
      );
      
      // Magic colors: gold, purple, green, cyan
      const colorChoice = Math.random();
      if (colorChoice < 0.3) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.84; colors[i * 3 + 2] = 0;
      } else if (colorChoice < 0.6) {
        colors[i * 3] = 0.66; colors[i * 3 + 1] = 0.33; colors[i * 3 + 2] = 0.88;
      } else if (colorChoice < 0.8) {
        colors[i * 3] = 0.13; colors[i * 3 + 1] = 0.77; colors[i * 3 + 2] = 0.37;
      } else {
        colors[i * 3] = 0.08; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 0.9;
      }
      
      sizes[i] = Math.random() * 0.05 + 0.02;
    }
    
    return { positions, velocities, colors, sizes };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, colors, sizes]);

  useFrame((state) => {
    if (!groupRef.current || !particlesRef.current) return;
    
    // Rotate entire effect
    groupRef.current.rotation.y += 0.02;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
    
    // Animate particles
    const pos = particlesRef.current.geometry.getAttribute('position').array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] += velocities[i * 3];
      pos[i3 + 1] += velocities[i * 3 + 1];
      pos[i3 + 2] += velocities[i * 3 + 2];
      
      // Reset particles that go too high
      if (pos[i3 + 1] > 1) {
        pos[i3] = (Math.random() - 0.5) * 0.5;
        pos[i3 + 1] = -0.5;
        pos[i3 + 2] = (Math.random() - 0.5) * 0.5;
      }
    }
    particlesRef.current.geometry.getAttribute('position').needsUpdate = true;
    
    // Pulse scale
    const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef} position={position}>
      <points ref={particlesRef} geometry={geometry}>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Central glow */}
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Outer glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.02, 8, 32]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Magic burst effect for random changes
export function MagicBurst({ position, color = '#FFD700' }: { position: [number, number, number]; color?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  const count = 30;
  
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities: number[] = [];
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 0.03 + Math.random() * 0.05;
      velocities.push(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.sin(phi) * Math.sin(theta) * speed,
        Math.cos(phi) * speed
      );
    }
    
    return { positions, velocities };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame((state, delta) => {
    if (!groupRef.current || !particlesRef.current) return;
    
    const pos = particlesRef.current.geometry.getAttribute('position').array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] += velocities[i * 3];
      pos[i3 + 1] += velocities[i * 3 + 1];
      pos[i3 + 2] += velocities[i * 3 + 2];
    }
    particlesRef.current.geometry.getAttribute('position').needsUpdate = true;
    
    // Fade out
    if (particlesRef.current.material instanceof THREE.PointsMaterial) {
      particlesRef.current.material.opacity -= delta * 0.5;
    }
    
    groupRef.current.scale.addScalar(delta * 2);
  });

  return (
    <group ref={groupRef} position={position}>
      <points ref={particlesRef} geometry={geometry}>
        <pointsMaterial
          size={0.08}
          color={color}
          transparent
          opacity={1}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// Druid aura effect
export function DruidAura({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && active) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      const scale = 1.5 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      meshRef.current.scale.setScalar(scale);
    }
  });

  if (!active) return null;

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusGeometry args={[2.5, 0.02, 8, 64]} />
      <meshBasicMaterial
        color="#22c55e"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
