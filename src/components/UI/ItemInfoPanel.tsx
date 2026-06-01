import { X } from 'lucide-react';
import { usePlanetStore, animalSpecies, plantSpecies } from '@/contexts/PlanetContext';

const speciesEmojis: Record<string, string> = {
  oak: '🌳', pine: '🌲', flower: '🌸', mushroom: '🍄', fern: '🌿',
  cactus: '🌵', bamboo: '🎋', bush: '🌱',
  rabbit: '🐰', bird: '🐦', deer: '🦌', fox: '🦊', owl: '🦉',
  butterfly: '🦋', squirrel: '🐿️', bee: '🐝',
};

export function ItemInfoPanel() {
  const { selectedItem, selectItem, health } = usePlanetStore();

  if (!selectedItem) return null;

  const isAnimal = selectedItem.type === 'animal';
  const speciesData = isAnimal 
    ? animalSpecies.find(s => s.id === selectedItem.species)
    : plantSpecies.find(s => s.id === selectedItem.species);
  
  const emoji = speciesEmojis[selectedItem.species] || (isAnimal ? '🐾' : '🌱');

  const getHealthImpact = () => {
    if (isAnimal) {
      if (health.animals > 70) return 'Species thriving! Ecosystem is healthy.';
      if (health.animals > 40) return 'Doing well, needs more vegetation.';
      return 'Needs help - planet needs more plants and clean water.';
    } else {
      if (health.vegetation > 70) return 'Plants flourishing! They help clean the air.';
      if (health.vegetation > 40) return 'Growing well, providing food for animals.';
      return 'Needs water and sunlight to grow stronger.';
    }
  };

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 animate-fadeIn max-w-sm">
      <div className="bg-ui-dark/95 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-3 flex items-center justify-between bg-gradient-to-r from-eco-green/30 to-eco-blue/30">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{emoji}</span>
            <div>
              <h3 className="text-sm text-white font-medium">{speciesData?.name || selectedItem.species}</h3>
              <p className="text-[10px] text-white/60 capitalize">{selectedItem.type}</p>
            </div>
          </div>
          <button
            onClick={() => selectItem(null)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          <p className="text-xs text-white/70">{getHealthImpact()}</p>
          
          <div className="flex justify-between text-center">
            <div className="px-3 py-1.5 bg-white/5 rounded-lg">
              <p className="text-sm font-medium text-eco-blue">{Math.round(health.water)}%</p>
              <p className="text-[9px] text-white/40">Water</p>
            </div>
            <div className="px-3 py-1.5 bg-white/5 rounded-lg">
              <p className="text-sm font-medium text-eco-green">{Math.round(health.vegetation)}%</p>
              <p className="text-[9px] text-white/40">Plants</p>
            </div>
            <div className="px-3 py-1.5 bg-white/5 rounded-lg">
              <p className="text-sm font-medium text-eco-orange">{Math.round(health.animals)}%</p>
              <p className="text-[9px] text-white/40">Animals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
