import { Droplets, Leaf, PawPrint, Sparkles, Sun } from 'lucide-react';
import { usePlanetStore } from '@/contexts/PlanetContext';
import { getStatusColor } from '@/utils/helpers';

const categories = [
  { key: 'water', label: 'Water', icon: <Droplets className="w-3 h-3" />, color: '#3b82f6' },
  { key: 'vegetation', label: 'Vegetation', icon: <Leaf className="w-3 h-3" />, color: '#22c55e' },
  { key: 'animals', label: 'Animals', icon: <PawPrint className="w-3 h-3" />, color: '#f59e0b' },
  { key: 'cleanliness', label: 'Clean', icon: <Sparkles className="w-3 h-3" />, color: '#14b8a6' },
  { key: 'energy', label: 'Energy', icon: <Sun className="w-3 h-3" />, color: '#fbbf24' },
];

export function MobileHealthBar() {
  const { health } = usePlanetStore();
  const overallColor = getStatusColor(health.overall);

  return (
    <div className="bg-black/80 backdrop-blur-md rounded-xl p-2 border border-white/10">
      {/* Overall */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] text-white/70">Health</span>
        <span className="text-sm font-display" style={{ color: overallColor }}>
          {health.overall}%
        </span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${health.overall}%`, backgroundColor: overallColor }}
        />
      </div>

      {/* Stats row */}
      <div className="flex justify-between">
        {categories.map((cat) => {
          const value = health[cat.key as keyof typeof health] as number;
          const catColor = getStatusColor(value);
          return (
            <div key={cat.key} className="flex flex-col items-center gap-0.5">
              <div style={{ color: catColor }}>{cat.icon}</div>
              <div className="h-1 w-6 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${value}%`, backgroundColor: catColor }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
