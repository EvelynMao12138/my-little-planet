import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Plant {
  position: THREE.Vector3;
  scale: number;
  type: 'tree' | 'flower' | 'grass';
  growthPhase: number;
  maxScale: number;
}

export function PlantEffect() {
  const groupRef = useRef<THREE.Group>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  
  // Spawn new plants periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (plants.length < 20) {
        const newPlant: Plant = {
          position: new THREE.Vector3(
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            2 + Math.random() * 1
          ),
          scale: 0,
          type: ['tree', 'flower', 'grass'][Math.floor(Math.random() * 3)] as Plant['type'],
          growthPhase: 0,
          maxScale: 0.1 + Math.random() * 0.2,
        };
        setPlants(prev => [...prev, newPlant]);
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, [plants.length]);
  
  // Grow plants over time
  useFrame((_state, delta) => {
    setPlants(prevPlants => 
      prevPlants.map(plant => ({
        ...plant,
        growthPhase: Math.min(1, plant.growthPhase + delta * 0.5),
        scale: plant.maxScale * easeOutElastic(plant.growthPhase),
      }))
    );
    
    // Rotate entire group slowly
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });
  
  return (
    <group ref={groupRef}>
      {plants.map((plant, index) => (
        <group
          key={index}
          position={[plant.position.x, plant.position.y, plant.position.z]}
          scale={plant.scale}
        >
          {plant.type === 'tree' && (
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.02, 0.03, 0.3, 6]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
          )}
          {plant.type === 'tree' && (
            <mesh position={[0, 0.4, 0]}>
              <coneGeometry args={[0.1, 0.3, 6]} />
              <meshStandardMaterial color="#22c55e" />
            </mesh>
          )}
          {plant.type === 'flower' && (
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.01, 0.02, 0.2, 6]} />
              <meshStandardMaterial color="#22c55e" />
            </mesh>
          )}
          {plant.type === 'flower' && (
            <mesh position={[0, 0.2, 0]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={0.3} />
            </mesh>
          )}
          {plant.type === 'grass' && (
            <>
              <mesh position={[0.02, 0.08, 0]} rotation={[0, 0, 0.2]}>
                <coneGeometry args={[0.01, 0.15, 4]} />
                <meshStandardMaterial color="#22c55e" />
              </mesh>
              <mesh position={[-0.02, 0.08, 0]} rotation={[0, 0, -0.2]}>
                <coneGeometry args={[0.01, 0.12, 4]} />
                <meshStandardMaterial color="#15803d" />
              </mesh>
              <mesh position={[0, 0.1, 0.02]} rotation={[0.2, 0, 0]}>
                <coneGeometry args={[0.01, 0.1, 4]} />
                <meshStandardMaterial color="#22c55e" />
              </mesh>
            </>
          )}
        </group>
      ))}
    </group>
  );
}

function easeOutElastic(x: number): number {
  const c4 = (2 * Math.PI) / 3;
  return x === 0
    ? 0
    : x === 1
    ? 1
    : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}
