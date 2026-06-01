import { useState, useEffect } from 'react';
import { usePlanetStore } from '@/contexts/PlanetContext';
import { Radio, X, Sparkles } from 'lucide-react';

interface NewsEvent {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  timestamp: number;
}

const positiveEvents = [
  { title: 'Rare Bird Spotted!', description: 'A flock of migratory birds chose your planet as home!' },
  { title: 'Forest Expansion', description: 'New trees sprouting in barren areas!' },
  { title: 'Clean Water Found', description: 'Underground springs discovered!' },
  { title: 'Species Migration', description: 'A family of foxes has arrived!' },
  { title: 'Butterfly Migration', description: 'Colorful butterflies visiting!' },
  { title: 'Coral Recovery', description: 'Underwater ecosystems regenerating!' },
  { title: 'Air Quality Improved', description: 'Oxygen levels rising!' },
  { title: 'New Species Arrived!', description: 'An endangered species discovered your planet!' },
];

const negativeEvents = [
  { title: 'Drought Warning', description: 'Water levels dropping. Use rain!' },
  { title: 'Pollution Alert', description: 'Toxic waste detected!' },
  { title: 'Habitat Loss', description: 'Animals leaving!' },
  { title: 'Soil Degradation', description: 'Ground becoming barren!' },
  { title: 'Ecosystem Imbalance', description: 'Food chain disrupted!' },
  { title: 'Rising Temperatures', description: 'Heat affecting wildlife!' },
];

const neutralEvents = [
  { title: 'Meteor Shower', description: 'Beautiful meteor shower tonight!' },
  { title: 'Cosmic Alignment', description: 'Rare planetary alignment!' },
  { title: 'Solar Flare', description: 'Sun emitting powerful flare!' },
  { title: 'Aurora Borealis', description: 'Stunning auroras visible!' },
  { title: 'Comet Passing', description: 'Bright comet approach!' },
];

export function RandomEvents() {
  const { health } = usePlanetStore();
  const [currentEvent, setCurrentEvent] = useState<NewsEvent | null>(null);
  const [showEvent, setShowEvent] = useState(false);

  useEffect(() => {
    const generateEvent = () => {
      let pool: typeof positiveEvents | typeof negativeEvents | typeof neutralEvents;
      
      if (health.overall > 70) {
        pool = Math.random() > 0.3 ? positiveEvents : neutralEvents;
      } else if (health.overall < 30) {
        pool = Math.random() > 0.3 ? negativeEvents : neutralEvents;
      } else {
        pool = Math.random() > 0.5 ? neutralEvents : Math.random() > 0.5 ? positiveEvents : negativeEvents;
      }
      
      const randomEvent = pool[Math.floor(Math.random() * pool.length)];
      
      const newEvent: NewsEvent = {
        id: Date.now().toString(),
        title: randomEvent.title,
        description: randomEvent.description,
        type: pool === positiveEvents ? 'positive' : pool === negativeEvents ? 'negative' : 'neutral',
        timestamp: Date.now(),
      };
      
      setCurrentEvent(newEvent);
      setShowEvent(true);
      
      setTimeout(() => {
        setShowEvent(false);
      }, 4000);
    };

    // Show first event quickly
    const firstTimer = setTimeout(generateEvent, 2000);
    
    // Then show events periodically
    const interval = setInterval(generateEvent, 15000);
    
    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, [health.overall]);

  if (!showEvent || !currentEvent) return null;

  const colors = {
    positive: {
      bg: 'from-green-600',
      border: 'border-green-400',
      icon: 'text-green-300',
      bgSolid: 'rgba(34, 197, 94, 0.9)',
    },
    negative: {
      bg: 'from-red-600',
      border: 'border-red-400',
      icon: 'text-red-300',
      bgSolid: 'rgba(220, 38, 38, 0.9)',
    },
    neutral: {
      bg: 'from-purple-600',
      border: 'border-purple-400',
      icon: 'text-purple-300',
      bgSolid: 'rgba(147, 51, 234, 0.9)',
    },
  };

  const color = colors[currentEvent.type];

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
      <div 
        className={`bg-gradient-to-b ${color.bg} to-transparent backdrop-blur-md rounded-2xl border-2 ${color.border} shadow-2xl max-w-md`}
        style={{ background: `linear-gradient(to bottom, ${color.bgSolid}, transparent)` }}
      >
        <div className="flex items-start gap-3 p-4">
          <div className="p-2.5 bg-white/20 rounded-xl">
            {currentEvent.type === 'positive' ? (
              <Sparkles className={`w-6 h-6 ${color.icon}`} />
            ) : (
              <Radio className={`w-6 h-6 ${color.icon}`} />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg mb-0.5">{currentEvent.title}</h3>
            <p className="text-white/90 text-sm leading-relaxed">{currentEvent.description}</p>
          </div>
          
          <button 
            onClick={() => setShowEvent(false)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>
      </div>
    </div>
  );
}
