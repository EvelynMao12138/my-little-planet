import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SunEffect() {
  const groupRef = useRef<THREE.Group>(null);
  const raysRef = useRef<THREE.LineSegments>(null!);
  
  const rayGeometry = useMemo(() => {
    const count = 12;
    const positions: number[] = [];
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const length = 0.8;
      
      // Create line from planet surface outward
      const startX = Math.cos(angle) * 2.1;
      const startY = Math.sin(angle) * 2.1;
      const endX = Math.cos(angle) * (2.1 + length);
      const endY = Math.sin(angle) * (2.1 + length);
      
      positions.push(startX, startY, 0, endX, endY, 0);
    }
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Pulsing glow effect
    const pulse = Math.sin(state.clock.getElapsedTime() * 3) * 0.2 + 0.8;
    if (raysRef.current) {
      raysRef.current.material = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#fbbf24'),
        transparent: true,
        opacity: pulse * 0.5,
        blending: THREE.AdditiveBlending,
      });
    }
    
    // Rotate rays slowly
    groupRef.current.rotation.z += 0.01;
  });

  return (
    <group ref={groupRef} position={[3, 3, 2]}>
      {/* Sun orb */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Glow */}
      <mesh scale={[1.5, 1.5, 1.5]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Light rays */}
      <lineSegments ref={raysRef} geometry={rayGeometry}>
        <lineBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
