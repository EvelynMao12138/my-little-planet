import { X, MapPin, Users, AlertTriangle, Heart } from 'lucide-react';
import { usePlanetStore } from '@/contexts/PlanetContext';
import { speciesData } from '@/data/species';
import { useState, useEffect } from 'react';

const plantDescriptions: Record<string, { name: string; description: string }> = {
  oak: { name: 'Oak Tree', description: 'A majestic deciduous tree that provides habitat for hundreds of species. Oaks can live for hundreds of years and produce acorns that feed many animals.' },
  pine: { name: 'Pine Tree', description: 'An evergreen conifer that thrives in various climates. Pine forests provide shelter and food for wildlife throughout the year.' },
  flower: { name: 'Wildflower', description: 'Colorful flowers that attract pollinators like bees and butterflies. They are essential for ecosystem biodiversity.' },
  mushroom: { name: 'Mushroom', description: 'Fungi that decompose organic matter and form symbiotic relationships with plant roots, improving soil health.' },
  fern: { name: 'Fern', description: 'Ancient plants that thrive in shady, moist environments. They provide ground cover and prevent soil erosion.' },
  cactus: { name: 'Cactus', description: 'Drought-resistant plants that store water in their thick stems. They provide habitat for desert wildlife.' },
  bamboo: { name: 'Bamboo', description: 'Fast-growing grasses that grow in dense groves. They provide food for pandas and habitat for many species.' },
  bush: { name: 'Berry Bush', description: 'Shrubs that produce berries eaten by birds and mammals. They provide shelter and food throughout the seasons.' },
};

const animalDescriptions: Record<string, { name: string; description: string }> = {
  rabbit: { name: 'Rabbit', description: 'Small mammals that graze on grass and vegetation. They are prey for many predators and help control plant growth.' },
  bird: { name: 'Bird', description: 'Avian creatures that pollinate plants and control insect populations. Their songs add to the ecosystem diversity.' },
  deer: { name: 'Deer', description: 'Graceful herbivores that browse on leaves and grasses. They shape forest vegetation through their feeding habits.' },
  fox: { name: 'Fox', description: 'Clever omnivores that help control rodent populations. They are indicators of a healthy ecosystem.' },
  owl: { name: 'Owl', description: 'Nocturnal birds of prey that hunt rodents and small mammals. They are important for controlling pest populations.' },
  butterfly: { name: 'Butterfly', description: 'Pollinators that transfer pollen between flowers, enabling plant reproduction. Their presence indicates environmental health.' },
  squirrel: { name: 'Squirrel', description: 'Tree-dwelling rodents that cache seeds and help disperse trees. They are prey for birds of prey.' },
  bee: { name: 'Bee', description: 'Essential pollinators that support plant reproduction. Their decline would dramatically impact ecosystems worldwide.' },
};

export function ModelInfoPanel() {
  const { selectedItem, selectItem, health } = usePlanetStore();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [selectedItem?.id]);

  if (!selectedItem) return null;

  const isAnimal = selectedItem.type === 'animal';
  const isPlant = selectedItem.type === 'plant';
  const isBuilding = selectedItem.type === 'vegetation';

  let title = '';
  let description = '';
  let imageUrl = '';

  if (isAnimal) {
    const animalInfo = animalDescriptions[selectedItem.species];
    title = animalInfo?.name || selectedItem.species;
    description = animalInfo?.description || 'A creature on this planet.';
  } else if (isPlant) {
    const plantInfo = plantDescriptions[selectedItem.species];
    title = plantInfo?.name || selectedItem.species;
    description = plantInfo?.description || 'A plant on this planet.';
  } else if (isBuilding) {
    title = selectedItem.species === 'house' ? 'House' : 'Building';
    description = 'Human settlement that contributes to pollution but provides shelter.';
  }

  const endangeredSpecies = speciesData.find(s => 
    s.commonName.toLowerCase().includes(selectedItem.species.toLowerCase()) ||
    selectedItem.species.toLowerCase().includes(s.commonName.toLowerCase().split(' ')[0])
  );

  if (endangeredSpecies) {
    imageUrl = endangeredSpecies.imageUrl;
  }

  const getStatusMessage = () => {
    if (isAnimal) {
      if (health.animals > 70) return 'This species is thriving!';
      if (health.animals > 40) return 'Doing well, needs more vegetation.';
      return 'Needs help - planet needs more plants.';
    } else if (isPlant) {
      if (health.vegetation > 70) return 'Plants are flourishing!';
      if (health.vegetation > 40) return 'Growing well, providing food.';
      return 'Needs water and sunlight.';
    }
    return 'Human development impacts the environment.';
  };

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-fadeIn max-w-md w-[90vw]">
      <div className="bg-ui-dark/95 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg overflow-hidden">
        <div className="relative">
          {imageUrl ? (
            <div className="h-28 bg-black/30">
              <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="h-16 bg-gradient-to-r from-eco-green/40 to-eco-blue/40" />
          )}
          
          <button
            onClick={() => selectItem(null)}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-ui-dark to-transparent">
            <h3 className="text-base font-display text-white">{title}</h3>
            {endangeredSpecies && (
              <span 
                className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-medium"
                style={{
                  backgroundColor: endangeredSpecies.status === 'Critically Endangered' ? '#ef444420' : 
                                   endangeredSpecies.status === 'Endangered' ? '#f59e0b20' : '#3b82f620',
                  color: endangeredSpecies.status === 'Critically Endangered' ? '#ef4444' : 
                         endangeredSpecies.status === 'Endangered' ? '#f59e0b' : '#3b82f6',
                }}
              >
                {endangeredSpecies.status}
              </span>
            )}
          </div>
        </div>

        <div className="p-3 space-y-3">
          <div className="flex items-center gap-2 text-xs text-white/70">
            <Heart className="w-4 h-4 text-eco-red" />
            <span>{getStatusMessage()}</span>
          </div>

          <p className="text-xs text-white/80 leading-relaxed">{description}</p>

          {endangeredSpecies && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-start gap-2 text-[10px]">
                <MapPin className="w-3 h-3 text-eco-blue mt-0.5 shrink-0" />
                <div>
                  <span className="text-white/50">Habitat: </span>
                  <span className="text-white/70">{endangeredSpecies.habitat}</span>
                </div>
              </div>
              
              <div className="flex items-start gap-2 text-[10px]">
                <Users className="w-3 h-3 text-eco-green mt-0.5 shrink-0" />
                <div>
                  <span className="text-white/50">Population: </span>
                  <span className="text-white/70 font-mono">{endangeredSpecies.population}</span>
                </div>
              </div>
              
              <div className="flex items-start gap-2 text-[10px]">
                <AlertTriangle className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-white/50">Threats: </span>
                  <span className="text-white/70">{endangeredSpecies.threats.join(', ')}</span>
                </div>
              </div>
              
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <p className="text-[9px] text-cyan-400 uppercase tracking-wide mb-0.5">Why They Returned</p>
                <p className="text-[10px] text-white/80">{endangeredSpecies.returnReason}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
