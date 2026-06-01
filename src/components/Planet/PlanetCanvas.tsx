import { useRef, useMemo, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { usePlanetStore, animalSpecies, plantSpecies } from '@/contexts/PlanetContext';
import { ParticleField } from '../Particles/ParticleField';
import { RainEffect } from '../Particles/RainEffect';
import { SunEffect } from '../Particles/SunEffect';
import { PlantEffect } from '../Particles/PlantEffect';
import { MagicEffect, MagicBurst } from '../Particles/MagicEffect';
import { GrassField, DustParticles, TrashItems, PollenParticles, WaterFlow } from './PlanetTextures';
import { useAudioSynth } from '@/hooks/useAudioSynth';

// Create terrain texture
function createTerrainTexture(health: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  
  const healthFactor = health / 100;
  
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 256; x++) {
      const noise = Math.sin(x * 0.1) * Math.cos(y * 0.2) + 
                   Math.sin(x * 0.2 + y * 0.1) * 0.5;
      const combined = noise / 1.5;
      
      let r, g, b;
      
      if (combined < -0.2) {
        r = 30; g = 90; b = 180;
      } else if (healthFactor < 0.3) {
        r = 139 + combined * 30; g = 90 + combined * 20; b = 43;
      } else if (healthFactor < 0.6) {
        const t = (healthFactor - 0.3) / 0.3;
        r = 139 - 63 * t; g = 90 + 25 * t; b = 43 + 21 * t;
      } else {
        const t = (healthFactor - 0.6) / 0.4;
        r = 76 - 42 * t; g = 115 + 24 * t; b = 64 - 30 * t;
      }
      
      ctx.fillStyle = `rgb(${Math.max(0, Math.min(255, r))}, ${Math.max(0, Math.min(255, g))}, ${Math.max(0, Math.min(255, b))})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Tree
function TreeModel({ scale }: { scale: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.015, 0.025, 0.2, 6]} />
        <meshStandardMaterial color="#5D4037" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <coneGeometry args={[0.12, 0.2, 6]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <coneGeometry args={[0.08, 0.15, 6]} />
        <meshStandardMaterial color="#388E3C" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Flower
function FlowerModel({ scale }: { scale: number }) {
  const petalColor = '#E91E63';
  return (
    <group scale={scale}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.005, 0.007, 0.1, 6]} />
        <meshStandardMaterial color="#4CAF50" roughness={0.8} />
      </mesh>
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle * Math.PI / 180) * 0.018, 0.13, Math.sin(angle * Math.PI / 180) * 0.018]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshStandardMaterial color={petalColor} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 0.13, 0]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#FFC107" roughness={0.5} />
      </mesh>
    </group>
  );
}

// Mushroom
function MushroomModel({ scale }: { scale: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.02, 0.025, 0.08, 8]} />
        <meshStandardMaterial color="#ECE4B7" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.05, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#D84315" roughness={0.7} />
      </mesh>
    </group>
  );
}

// Fern
function FernModel({ scale }: { scale: number }) {
  return (
    <group scale={scale}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <mesh key={i} position={[0, 0.04, 0]} rotation={[0.7, angle * Math.PI / 180, 0]}>
          <boxGeometry args={[0.008, 0.12, 0.03]} />
          <meshStandardMaterial color="#4CAF50" roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

// Cactus
function CactusModel({ scale }: { scale: number }) {
  return (
    <group scale={scale}>
      <mesh>
        <cylinderGeometry args={[0.025, 0.03, 0.18, 8]} />
        <meshStandardMaterial color="#689F38" roughness={0.8} />
      </mesh>
      <mesh position={[0.04, 0.06, 0]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.015, 0.02, 0.06, 8]} />
        <meshStandardMaterial color="#689F38" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Bamboo
function BambooModel({ scale }: { scale: number }) {
  return (
    <group scale={scale}>
      {[0, 0.03, -0.03].map((x, i) => (
        <mesh key={i} position={[x, 0.08, 0]}>
          <cylinderGeometry args={[0.008, 0.01, 0.16, 6]} />
          <meshStandardMaterial color="#8BC34A" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// Bush
function BushModel({ scale }: { scale: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#4CAF50" roughness={0.8} />
      </mesh>
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle * Math.PI / 180) * 0.04, 0.06, Math.sin(angle * Math.PI / 180) * 0.04]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#388E3C" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// Rabbit
function RabbitModel({ scale }: { scale: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) groupRef.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 4)) * 0.015;
  });
  return (
    <group ref={groupRef} scale={scale}>
      <mesh position={[0, 0.035, 0]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#E8E8E8" roughness={0.8} />
      </mesh>
      <mesh position={[0.025, 0.07, 0]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshStandardMaterial color="#F5F5F5" roughness={0.8} />
      </mesh>
      <mesh position={[0.015, 0.1, 0.008]} rotation={[0, 0, 0.25]}>
        <capsuleGeometry args={[0.008, 0.04, 4, 8]} />
        <meshStandardMaterial color="#E8E8E8" roughness={0.8} />
      </mesh>
      <mesh position={[0.035, 0.1, 0.008]} rotation={[0, 0, -0.25]}>
        <capsuleGeometry args={[0.008, 0.04, 4, 8]} />
        <meshStandardMaterial color="#E8E8E8" roughness={0.8} />
      </mesh>
      <mesh position={[0.04, 0.075, 0.02]}>
        <sphereGeometry args={[0.006, 8, 8]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.3} />
      </mesh>
    </group>
  );
}

// Bird
function BirdModel({ scale }: { scale: number }) {
  const wingRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (wingRef.current) wingRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8) * 0.35;
  });
  return (
    <group scale={scale}>
      <mesh>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial color="#1976D2" roughness={0.8} />
      </mesh>
      <group ref={wingRef} position={[0, 0, 0.015]}>
        <mesh rotation={[0.5, 0, 0.6]}>
          <boxGeometry args={[0.055, 0.006, 0.025]} />
          <meshStandardMaterial color="#1565C0" roughness={0.8} />
        </mesh>
      </group>
      <mesh position={[0.05, 0.01, 0]} rotation={[0, 0, -0.8]}>
        <coneGeometry args={[0.008, 0.025, 6]} />
        <meshStandardMaterial color="#FFA000" roughness={0.6} />
      </mesh>
    </group>
  );
}

// Deer
function DeerModel({ scale }: { scale: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.06, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#8D6E63" roughness={0.8} />
      </mesh>
      <mesh position={[0.05, 0.12, 0]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial color="#8D6E63" roughness={0.8} />
      </mesh>
      <mesh position={[0.04, 0.18, 0.008]} rotation={[0.2, 0, 0.7]}>
        <cylinderGeometry args={[0.004, 0.006, 0.05, 6]} />
        <meshStandardMaterial color="#5D4037" roughness={0.9} />
      </mesh>
      <mesh position={[0.06, 0.18, -0.008]} rotation={[-0.2, 0, -0.7]}>
        <cylinderGeometry args={[0.004, 0.006, 0.05, 6]} />
        <meshStandardMaterial color="#5D4037" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Fox
function FoxModel({ scale }: { scale: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.01;
  });
  return (
    <group ref={groupRef} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#FF7043" roughness={0.8} />
      </mesh>
      <mesh position={[0.04, 0.015, 0]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color="#FF7043" roughness={0.8} />
      </mesh>
      <mesh position={[0.065, 0.01, 0]}>
        <sphereGeometry args={[0.015, 12, 12]} />
        <meshStandardMaterial color="#FFE0B2" roughness={0.8} />
      </mesh>
      <mesh position={[0.03, 0.055, 0.01]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.01, 0.035, 4]} />
        <meshStandardMaterial color="#FF7043" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Owl
function OwlModel({ scale }: { scale: number }) {
  return (
    <group scale={scale}>
      <mesh>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#795548" roughness={0.8} />
      </mesh>
      <mesh position={[0.04, 0, 0]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial color="#BCAAA4" roughness={0.8} />
      </mesh>
      <mesh position={[0.055, 0.008, 0.018]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshStandardMaterial color="#FFC107" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0.02, 0.055, 0]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.008, 0.025, 4]} />
        <meshStandardMaterial color="#5D4037" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Butterfly
function ButterflyModel({ scale }: { scale: number }) {
  const wingRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (wingRef.current) wingRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 10) * 0.2;
  });
  return (
    <group ref={wingRef} scale={scale}>
      <mesh position={[0, 0.012, 0]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#5D4037" roughness={0.8} />
      </mesh>
      <mesh position={[0.025, 0.012, 0.005]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.03, 0.006, 0.02]} />
        <meshStandardMaterial color="#E91E63" roughness={0.6} />
      </mesh>
      <mesh position={[-0.025, 0.012, 0.005]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.03, 0.006, 0.02]} />
        <meshStandardMaterial color="#9C27B0" roughness={0.6} />
      </mesh>
    </group>
  );
}

// Squirrel
function SquirrelModel({ scale }: { scale: number }) {
  const tailRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (tailRef.current) tailRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.2;
  });
  return (
    <group scale={scale}>
      <mesh position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#A1887F" roughness={0.8} />
      </mesh>
      <mesh position={[0.03, 0.06, 0]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshStandardMaterial color="#A1887F" roughness={0.8} />
      </mesh>
      <group ref={tailRef} position={[-0.04, 0.05, 0]} rotation={[0, 0, -1]}>
        <mesh>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#A1887F" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

// Bee
function BeeModel({ scale }: { scale: number }) {
  const wingRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (wingRef.current) wingRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 20) * 0.3;
  });
  return (
    <group scale={scale}>
      <mesh>
        <sphereGeometry args={[0.02, 12, 12]} />
        <meshStandardMaterial color="#FFC107" roughness={0.8} />
      </mesh>
      <mesh position={[0.025, 0.005, 0]} rotation={[0, 0, -0.8]}>
        <coneGeometry args={[0.006, 0.02, 6]} />
        <meshStandardMaterial color="#212121" roughness={0.6} />
      </mesh>
      <group ref={wingRef} position={[0, 0.015, 0]}>
        <mesh rotation={[0.3, 0, 0.8]}>
          <boxGeometry args={[0.04, 0.002, 0.02]} />
          <meshStandardMaterial color="#E3F2FD" roughness={0.3} transparent opacity={0.7} />
        </mesh>
      </group>
      <mesh position={[0, 0.022, 0.01]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshStandardMaterial color="#212121" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Grass patch with wind animation
function GrassPatch({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const offset = position[0] + i * 0.5;
          child.rotation.x = Math.sin(state.clock.elapsedTime * 2 + offset) * 0.15;
          child.rotation.z = Math.cos(state.clock.elapsedTime * 1.5 + offset) * 0.08;
        }
      });
    }
  });

  const blades = useMemo(() => {
    const result = [];
    for (let i = 0; i < 12; i++) {
      result.push({
        pos: [(Math.random() - 0.5) * 0.2, 0, (Math.random() - 0.5) * 0.2] as [number, number, number],
        rot: [0, Math.random() * Math.PI * 2, 0] as [number, number, number],
        scale: 0.5 + Math.random() * 0.5
      });
    }
    return result;
  }, []);

  return (
    <group ref={groupRef} position={position}>
      {blades.map((blade, i) => (
        <mesh key={i} position={blade.pos} rotation={blade.rot} scale={blade.scale}>
          <coneGeometry args={[0.008, 0.08, 3]} />
          <meshStandardMaterial color="#4CAF50" roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

// Stone patch with random sizes
function StonePatch({ position }: { position: [number, number, number] }) {
  const stones = useMemo(() => {
    const result = [];
    const count = 2 + Math.floor(Math.random() * 3); // 2-4 stones
    for (let i = 0; i < count; i++) {
      const scale = 0.1 + Math.random() * 0.2; // Random size
      result.push({
        pos: [(Math.random() - 0.5) * 0.15, scale * 0.3, (Math.random() - 0.5) * 0.15] as [number, number, number],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
        scale: [scale, scale * 0.6, scale] as [number, number, number]
      });
    }
    return result;
  }, []);

  return (
    <group position={position}>
      {stones.map((stone, i) => (
        <mesh key={i} position={stone.pos} rotation={stone.rot} scale={stone.scale}>
          <dodecahedronGeometry args={[0.1, 0]} />
          <meshStandardMaterial color="#808080" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// House model for cities/buildings
function HouseModel({ scale }: { scale: number }) {
  return (
    <group scale={scale}>
      {/* House base */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.15, 0.15, 0.12]} />
        <meshStandardMaterial color="#D2691E" roughness={0.8} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 0.22, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.12, 0.1, 4]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.05, 0.061]}>
        <boxGeometry args={[0.04, 0.06, 0.01]} />
        <meshStandardMaterial color="#4A3728" roughness={0.9} />
      </mesh>
      {/* Window */}
      <mesh position={[0.05, 0.12, 0.061]}>
        <boxGeometry args={[0.03, 0.03, 0.01]} />
        <meshStandardMaterial color="#87CEEB" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}

// Building model (taller)
function BuildingModel({ scale }: { scale: number }) {
  return (
    <group scale={scale}>
      {/* Main building */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.1, 0.35, 0.1]} />
        <meshStandardMaterial color="#696969" roughness={0.7} />
      </mesh>
      {/* Windows */}
      {[-0.03, 0.03].map((x, xi) => 
        [-0.05, 0.05, 0.15].map((y, yi) => (
          <mesh key={`w-${xi}-${yi}`} position={[x, y + 0.1, 0.051]}>
            <boxGeometry args={[0.025, 0.025, 0.01]} />
            <meshStandardMaterial color="#87CEEB" roughness={0.3} metalness={0.5} />
          </mesh>
        ))
      )}
      {/* Antenna */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.08, 6]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Placed items with quaternion for surface alignment
function PlacedItems() {
  const { placedItems, selectedItem, selectItem, showSpeciesLabels } = usePlanetStore();
  
  return (
    <group>
      {placedItems.map((item) => {
        const isSelected = selectedItem?.id === item.id;
        const pos = new THREE.Vector3(...item.position);
        const normal = pos.clone().normalize();
        const up = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normal);
        
        return (
          <AnimatedItem 
            key={item.id} 
            item={item}
            isSelected={isSelected}
            pos={pos}
            normal={normal}
            quaternion={quaternion}
            onSelect={() => selectItem(isSelected ? null : item)}
            showLabels={showSpeciesLabels}
          />
        );
      })}
    </group>
  );
}

// Individual item with animation for animals
function AnimatedItem({ item, isSelected, pos, normal, quaternion, onSelect, showLabels }: {
  item: PlacedItem;
  isSelected: boolean;
  pos: THREE.Vector3;
  normal: THREE.Vector3;
  quaternion: THREE.Quaternion;
  onSelect: () => void;
  showLabels: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const isAnimal = item.type === 'animal';
  const meshRef = useRef<THREE.Group>(null);
  
  // Generate random movement parameters based on item ID for unique per-animal movement
  const idHash = item.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const speed1 = 0.8 + (idHash % 10) * 0.2; // Speed between 0.8-1.8
  const speed2 = 0.6 + ((idHash * 7) % 10) * 0.15; // Different speed for 2nd axis
  const range1 = 0.08 + (idHash % 5) * 0.04; // Range 0.08-0.24
  const range2 = 0.06 + ((idHash * 3) % 5) * 0.03; // Range 0.06-0.21
  const phaseOffset = (idHash * 0.1) % (Math.PI * 2); // Random starting phase
  
  // Random direction for movement (flip signs)
  const dir1 = (idHash % 2 === 0) ? 1 : -1;
  const dir2 = ((idHash * 3) % 2 === 0) ? 1 : -1;
  
  useFrame((state) => {
    if (meshRef.current && isAnimal) {
      const time = state.clock.elapsedTime;
      
      // Calculate tangent vectors for surface movement
      const tangent1 = new THREE.Vector3(-normal.z, 0, normal.x).normalize();
      const tangent2 = new THREE.Vector3().crossVectors(normal, tangent1).normalize();
      
      // Unique wandering pattern for each animal
      const offset = dir1 * Math.sin(time * speed1 + phaseOffset) * range1;
      const offset2 = dir2 * Math.cos(time * speed2 + phaseOffset * 1.5) * range2;
      
      // Move along surface
      const newPos = pos.clone()
        .add(tangent1.clone().multiplyScalar(offset))
        .add(tangent2.clone().multiplyScalar(offset2))
        .normalize()
        .multiplyScalar(2.05);
      
      meshRef.current.position.set(newPos.x, newPos.y, newPos.z);
      
      // Update quaternion for new position
      const newNormal = newPos.clone().normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const newQuat = new THREE.Quaternion().setFromUnitVectors(up, newNormal);
      meshRef.current.quaternion.copy(newQuat);
    }
  });
  
  // Scale increased by 0.8x
  const scaleMultiplier = 1.8;
  const finalScale = item.scale * scaleMultiplier;
  
  return (
    <group 
      ref={groupRef}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      {/* Static base position for non-animals, reference for animals */}
      <group 
        ref={meshRef}
        position={[pos.x, pos.y, pos.z]}
        quaternion={quaternion}
      >
        {isSelected && (
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
          </mesh>
        )}
        
        {item.type === 'plant' && (
          <>
            {item.species === 'oak' && <TreeModel scale={finalScale} />}
            {item.species === 'pine' && <TreeModel scale={finalScale} />}
            {item.species === 'flower' && <FlowerModel scale={finalScale} />}
            {item.species === 'mushroom' && <MushroomModel scale={finalScale} />}
            {item.species === 'fern' && <FernModel scale={finalScale} />}
            {item.species === 'cactus' && <CactusModel scale={finalScale} />}
            {item.species === 'bamboo' && <BambooModel scale={finalScale} />}
            {item.species === 'bush' && <BushModel scale={finalScale} />}
          </>
        )}
        
        {item.type === 'animal' && (
          <>
            {item.species === 'rabbit' && <RabbitModel scale={finalScale} />}
            {item.species === 'bird' && <BirdModel scale={finalScale} />}
            {item.species === 'deer' && <DeerModel scale={finalScale} />}
            {item.species === 'fox' && <FoxModel scale={finalScale} />}
            {item.species === 'owl' && <OwlModel scale={finalScale} />}
            {item.species === 'butterfly' && <ButterflyModel scale={finalScale} />}
            {item.species === 'squirrel' && <SquirrelModel scale={finalScale} />}
            {item.species === 'bee' && <BeeModel scale={finalScale} />}
          </>
        )}
        
        {item.type === 'vegetation' && (
          <>
            {item.species === 'house' && <HouseModel scale={finalScale} />}
            {item.species === 'building' && <BuildingModel scale={finalScale} />}
            {item.species === 'grass' && <GrassPatch position={[pos.x, pos.y, pos.z]} />}
            {item.species === 'stone' && <StonePatch position={[pos.x, pos.y, pos.z]} />}
          </>
        )}
      </group>
    </group>
  );
}

// Brush patches with grass and stones
function BrushPatches() {
  const { placedItems, health } = usePlanetStore();
  
  const patches = useMemo(() => {
    const grassPatches: [number, number, number][] = [];
    const stonePatches: [number, number, number][] = [];
    
    placedItems.forEach(item => {
      if (item.type === 'vegetation') {
        if (item.species === 'grass') {
          grassPatches.push(item.position);
        } else {
          stonePatches.push(item.position);
        }
      }
    });
    
    return { grassPatches, stonePatches };
  }, [placedItems]);
  
  // Show vegetation if water is sufficient
  const showVegetation = health.water > 15;
  
  return (
    <group>
      {showVegetation && patches.grassPatches.map((pos, i) => (
        <group key={`grass-${i}`} position={pos}>
          <GrassPatch position={pos} />
        </group>
      ))}
      {showVegetation && patches.stonePatches.map((pos, i) => (
        <group key={`stone-${i}`} position={pos}>
          <StonePatch position={pos} />
        </group>
      ))}
    </group>
  );
}

// Main Planet
function Planet({ onClick }: { onClick: (point: THREE.Vector3, normal: THREE.Vector3) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { health, handPosition, isPinching } = usePlanetStore();
  const [hovered, setHovered] = useState(false);
  const { playPlacementSound } = useAudioSynth();
  
  const texture = useMemo(() => createTerrainTexture(health.overall), [health.overall]);
  
  const planetColor = useMemo(() => {
    const healthFactor = health.overall / 100;
    const dry = new THREE.Color('#A0522D');
    const green = new THREE.Color('#22c55e');
    return new THREE.Color().lerpColors(dry, green, healthFactor);
  }, [health.overall]);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
      if (handPosition && !isPinching) {
        meshRef.current.rotation.y += handPosition.x * delta * 0.2;
        meshRef.current.rotation.x += handPosition.y * delta * 0.15;
      }
    }
  });

  const handleClick = useCallback((e: THREE.Event) => {
    e.stopPropagation();
    const point = e.point as THREE.Vector3;
    const normal = point.clone().normalize();
    const offsetPoint = point.clone().add(normal.clone().multiplyScalar(0.1));
    onClick(offsetPoint, normal);
    playPlacementSound();
  }, [onClick, playPlacementSound]);

  return (
    <group>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <sphereGeometry args={[2, 48, 24]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.85}
          metalness={0.05}
          emissive={planetColor}
          emissiveIntensity={hovered ? 0.08 : 0.02}
        />
      </mesh>
      
      <mesh scale={[1.05, 1.05, 1.05]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color={health.overall > 50 ? '#22c55e' : '#f59e0b'}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
      
      <GrassField />
      <DustParticles />
      <TrashItems />
      <PollenParticles />
      <WaterFlow />
      <PlacedItems />
    </group>
  );
}

// Simple Decorations
function Decorations() {
  return (
    <group>
      <mesh position={[5, 1, -3]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#c9c9c9" roughness={0.9} />
      </mesh>
      {[...Array(3)].map((_, i) => (
        <mesh key={i} position={[Math.sin(i * 2) * 6, Math.cos(i * 1.7) * 4, Math.sin(i * 0.8) * 5]}>
          <dodecahedronGeometry args={[0.12, 0]} />
          <meshStandardMaterial color="#666666" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function CameraController() {
  const { camera } = useThree();
  const { isPinching, pinchDistance, handPosition } = usePlanetStore();
  const targetDistance = useRef(6);
  
  useFrame(() => {
    if (isPinching) {
      targetDistance.current = Math.max(2.5, Math.min(15, 6 + (0.15 - pinchDistance) * 20));
    }
    const currentDistance = camera.position.length();
    const newDistance = THREE.MathUtils.lerp(currentDistance, targetDistance.current, 0.06);
    camera.position.normalize().multiplyScalar(newDistance);
    
    if (handPosition) {
      camera.position.x += handPosition.x * 0.008;
      camera.position.y += handPosition.y * 0.008;
    }
  });
  
  return (
    <OrbitControls enablePan={false} minDistance={2.5} maxDistance={15} enableDamping dampingFactor={0.05} />
  );
}

function Scene({ onPlanetClick }: { onPlanetClick: (point: THREE.Vector3, normal: THREE.Vector3) => void }) {
  const { activeEffects, handPosition, isPalmOpen, showMagicBurst } = usePlanetStore();
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.25} color="#3b82f6" />
      <pointLight position={[0, 5, 0]} intensity={0.15} color="#FFD700" />
      
      <Stars radius={100} depth={50} count={2500} factor={3} saturation={0} fade speed={1} />
      
      <Planet onClick={onPlanetClick} />
      <Decorations />
      <ParticleField />
      
      {(handPosition && isPalmOpen) && <MagicEffect position={[handPosition.x * 0.3, handPosition.y * 0.3, 0]} />}
      
      {activeEffects.includes('rain') && <RainEffect />}
      {activeEffects.includes('sun') && <SunEffect />}
      {activeEffects.includes('plant') && <PlantEffect />}
      
      {showMagicBurst && <MagicBurst position={showMagicBurst.position} color={showMagicBurst.color} />}
      
      <CameraController />
    </>
  );
}

export function PlanetCanvas() {
  const { selectedTool, applyAction, placeItem } = usePlanetStore();
  const { playPlacementSound } = useAudioSynth();

  const handlePlanetClick = useCallback((point: THREE.Vector3, _normal: THREE.Vector3) => {
    if (selectedTool === 'plant') {
      const species = plantSpecies[Math.floor(Math.random() * plantSpecies.length)].id;
      placeItem({
        type: 'plant',
        species,
        position: [point.x, point.y, point.z],
        rotation: [0, 0, 0],
        scale: 0.4 + Math.random() * 0.4,
      });
    } else if (selectedTool === 'animals') {
      const species = animalSpecies[Math.floor(Math.random() * animalSpecies.length)].id;
      placeItem({
        type: 'animal',
        species,
        position: [point.x, point.y, point.z],
        rotation: [0, 0, 0],
        scale: 0.5 + Math.random() * 0.5,
      });
    } else if (selectedTool === 'vegetation') {
      // City/building brush - houses and buildings
      const buildingTypes = ['house', 'house', 'building']; // 66% houses, 33% buildings
      placeItem({
        type: 'vegetation',
        species: buildingTypes[Math.floor(Math.random() * buildingTypes.length)],
        position: [point.x, point.y, point.z],
        rotation: [0, 0, 0],
        scale: 0.8 + Math.random() * 0.4,
      });
    }
    
    applyAction(selectedTool);
    playPlacementSound();
  }, [selectedTool, applyAction, placeItem, playPlacementSound]);

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <Scene onPlanetClick={handlePlanetClick} />
      </Canvas>
    </div>
  );
}
