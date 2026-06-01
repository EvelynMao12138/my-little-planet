import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlanetStore } from '@/contexts/PlanetContext';

export function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const { health, handPosition, isPalmOpen, isPinching } = usePlanetStore();
  
  // Create particle geometry
  const { positions, velocities, colors } = useMemo(() => {
    const count = 800;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Distribute particles in a shell around the planet
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2.8 + Math.random() * 2;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random velocities for gentle floating
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
      
      // Color based on particle type (green, blue, white, golden)
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        // Green particles (nature)
        colors[i * 3] = 0.13 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0.77 + Math.random() * 0.1;
        colors[i * 3 + 2] = 0.1 + Math.random() * 0.1;
      } else if (colorChoice < 0.7) {
        // Blue particles (water/air)
        colors[i * 3] = 0.2 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      } else if (colorChoice < 0.9) {
        // White particles (stars/dust)
        colors[i * 3] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 2] = 1.0;
      } else {
        // Golden particles (energy/sun)
        colors[i * 3] = 0.96 + Math.random() * 0.04;
        colors[i * 3 + 1] = 0.75 + Math.random() * 0.15;
        colors[i * 3 + 2] = 0.2 + Math.random() * 0.2;
      }
    }
    
    return { positions, velocities, colors };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const positionAttribute = pointsRef.current.geometry.getAttribute('position');
    const positions = positionAttribute.array as Float32Array;
    
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < positions.length / 3; i++) {
      const i3 = i * 3;
      
      // Base floating motion
      positions[i3] += Math.sin(time * 0.5 + i) * 0.002;
      positions[i3 + 1] += Math.cos(time * 0.3 + i * 0.5) * 0.002;
      positions[i3 + 2] += Math.sin(time * 0.4 + i * 0.7) * 0.002;
      
      // Hand interaction - push/pull
      if (handPosition && isPalmOpen) {
        // Push outward
        const dx = positions[i3] - handPosition.x;
        const dy = positions[i3 + 1] - handPosition.y;
        const dz = positions[i3 + 2] - handPosition.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 3 && dist > 0.1) {
          const force = 0.02 / (dist * dist);
          positions[i3] += dx * force;
          positions[i3 + 1] += dy * force;
          positions[i3 + 2] += dz * force;
        }
      }
      
      if (handPosition && isPinching) {
        // Pull inward
        const dx = positions[i3] - handPosition.x;
        const dy = positions[i3 + 1] - handPosition.y;
        const dz = positions[i3 + 2] - handPosition.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 3 && dist > 0.5) {
          const force = 0.01;
          positions[i3] -= dx * force;
          positions[i3 + 1] -= dy * force;
          positions[i3 + 2] -= dz * force;
        }
      }
      
      // Keep particles in shell
      const distFromCenter = Math.sqrt(
        positions[i3] * positions[i3] +
        positions[i3 + 1] * positions[i3 + 1] +
        positions[i3 + 2] * positions[i3 + 2]
      );
      
      if (distFromCenter < 2.5) {
        // Too close, push outward
        positions[i3] *= 1.01;
        positions[i3 + 1] *= 1.01;
        positions[i3 + 2] *= 1.01;
      } else if (distFromCenter > 5) {
        // Too far, pull inward
        positions[i3] *= 0.99;
        positions[i3 + 1] *= 0.99;
        positions[i3 + 2] *= 0.99;
      }
    }
    
    positionAttribute.needsUpdate = true;
    
    // Rotate the whole particle field slowly
    pointsRef.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
