import { Droplets, Leaf, PawPrint, Sparkles, Sun, Heart, Eye, EyeOff } from 'lucide-react';
import { usePlanetStore } from '@/contexts/PlanetContext';
import { getStatusColor } from '@/utils/helpers';

const categories = [
  { key: 'water', label: 'Water', icon: <Droplets className="w-4 h-4" />, color: '#3b82f6' },
  { key: 'vegetation', label: 'Vegetation', icon: <Leaf className="w-4 h-4" />, color: '#22c55e' },
  { key: 'animals', label: 'Animals', icon: <PawPrint className="w-4 h-4" />, color: '#f59e0b' },
  { key: 'cleanliness', label: 'Cleanliness', icon: <Sparkles className="w-4 h-4" />, color: '#14b8a6' },
  { key: 'energy', label: 'Energy', icon: <Sun className="w-4 h-4" />, color: '#fbbf24' },
];

export function HealthPanel() {
  const { health, showSpeciesLabels, toggleSpeciesLabels } = usePlanetStore();
  const overallColor = getStatusColor(health.overall);

  return (
    <div className="bg-ui-dark/80 backdrop-blur-md rounded-2xl p-4 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-eco-red" />
          <h2 className="font-display text-sm text-white">Planet Health</h2>
        </div>
        <button
          onClick={toggleSpeciesLabels}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          title={showSpeciesLabels ? 'Hide labels' : 'Show labels'}
        >
          {showSpeciesLabels ? (
            <Eye className="w-4 h-4 text-white/50" />
          ) : (
            <EyeOff className="w-4 h-4 text-white/50" />
          )}
        </button>
      </div>

      {/* Overall Health */}
      <div className="text-center mb-3">
        <span className="text-2xl font-display" style={{ color: overallColor }}>
          {health.overall}%
        </span>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-1">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${health.overall}%`,
              backgroundColor: overallColor,
              boxShadow: `0 0 10px ${overallColor}40`,
            }}
          />
        </div>
      </div>

      {/* Category Bars */}
      <div className="space-y-2">
        {categories.map((cat) => {
          const value = health[cat.key as keyof typeof health] as number;
          const catColor = getStatusColor(value);
          
          return (
            <div key={cat.key} className="flex items-center gap-2">
              <div className="w-6 flex justify-center" style={{ color: catColor }}>
                {cat.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-white/60">{cat.label}</span>
                  <span className="font-mono" style={{ color: catColor }}>{Math.round(value)}%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${value}%`,
                      backgroundColor: catColor,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Balance Tips */}
      <div className="mt-3 p-2 bg-white/5 rounded-lg">
        <p className="text-[9px] text-white/40 mb-1">Balance Tips:</p>
        <div className="text-[8px] text-white/30 space-y-0.5">
          <div>• High energy evaporates water</div>
          <div>• Animals need plants + cleanliness</div>
          <div>• Buildings reduce cleanliness</div>
        </div>
      </div>
    </div>
  );
}
