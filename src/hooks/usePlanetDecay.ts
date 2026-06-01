import { useEffect, useRef } from 'react';
import { usePlanetStore } from '@/contexts/PlanetContext';

export function usePlanetDecay() {
  const updatePlanetTick = usePlanetStore(state => state.updatePlanetTick);
  const tickRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    tickRef.current = setInterval(() => {
      updatePlanetTick();
    }, 2000);
    
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [updatePlanetTick]);
}
