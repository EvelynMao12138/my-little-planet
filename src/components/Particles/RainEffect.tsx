import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function RainEffect() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const geometry = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Start from above the planet
      const angle = Math.random() * Math.PI * 2;
      const height = 3 + Math.random() * 2;
      const radius = Math.random() * 2;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      velocities[i] = 0.05 + Math.random() * 0.03;
    }
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.userData.velocities = velocities;
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const positionAttribute = pointsRef.current.geometry.getAttribute('position');
    const positions = positionAttribute.array as Float32Array;
    const velocities = pointsRef.current.geometry.userData.velocities as Float32Array;
    
    for (let i = 0; i < positions.length / 3; i++) {
      const i3 = i * 3;
      
      // Fall down
      positions[i3 + 1] -= velocities[i];
      
      // Wind sway
      positions[i3] += Math.sin(state.clock.getElapsedTime() * 2 + i) * 0.01;
      positions[i3 + 2] += Math.cos(state.clock.getElapsedTime() * 2 + i) * 0.01;
      
      // Reset when hitting planet surface or going too low
      if (positions[i3 + 1] < -2.5) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 2;
        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = 4 + Math.random() * 2;
        positions[i3 + 2] = Math.sin(angle) * radius;
      }
    }
    
    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.04}
        color="#3b82f6"
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
