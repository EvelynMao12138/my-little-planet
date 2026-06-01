import { useState } from 'react';
import { Species } from '@/data/species';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { usePlanetStore } from '@/contexts/PlanetContext';

const statusColors: Record<string, string> = {
  'Critically Endangered': '#ef4444',
  'Endangered': '#f59e0b',
  'Threatened': '#3b82f6',
  'Vulnerable': '#8b5cf6',
};

function SpeciesCard({ species, expanded, onToggle }: { 
  species: Species; 
  expanded: boolean;
  onToggle: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  const statusColor = statusColors[species.status] || '#888';

  return (
    <div
      className="rounded-lg overflow-hidden transition-all"
      style={{
        background: `linear-gradient(135deg, ${statusColor}10 0%, transparent 100%)`,
        border: `1px solid ${statusColor}25`,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full p-2 flex items-center gap-2 text-left hover:bg-white/5 transition-colors"
      >
        {/* Image */}
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/20 flex-shrink-0">
          {!imageError ? (
            <img 
              src={species.imageUrl} 
              alt={species.commonName}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-800 to-green-600">
              <span className="text-white/60 text-sm">🐾</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-[11px] text-white font-medium leading-tight">{species.commonName}</h4>
          <p className="text-[8px] text-white/50 italic leading-tight mt-0.5">{species.scientificName}</p>
        </div>
        
        <span
          className="px-1 py-0.5 rounded text-[7px] font-medium shrink-0"
          style={{
            backgroundColor: `${statusColor}20`,
            color: statusColor,
          }}
        >
          {species.status === 'Critically Endangered' ? 'Crit.End.' : 
           species.status === 'Endangered' ? 'Endangered' : 
           species.status === 'Threatened' ? 'Threatened' : 'Vulnerable'}
        </span>
        
        {expanded ? (
          <ChevronUp className="w-3 h-3 text-white/40 shrink-0" />
        ) : (
          <ChevronDown className="w-3 h-3 text-white/40 shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-2 pb-2 space-y-2 animate-fadeIn border-t border-white/5 pt-2">
          {/* Large image */}
          <div className="rounded-lg overflow-hidden h-28 bg-black/20">
            {!imageError ? (
              <img 
                src={species.imageUrl} 
                alt={species.commonName}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-800 to-green-600">
                <span className="text-white/60 text-2xl">🐾</span>
              </div>
            )}
          </div>
          
          <div className="text-[9px] text-white/60 leading-relaxed">
            <span className="text-white/40">Habitat: </span>
            <span>{species.habitat}</span>
          </div>
          
          <p className="text-[10px] text-white/80 leading-relaxed">{species.description}</p>
          
          <div className="flex justify-between text-[9px]">
            <div>
              <span className="text-white/40">Population: </span>
              <span className="text-white/70 font-mono">{species.population}</span>
            </div>
          </div>
          
          <div>
            <span className="text-[8px] text-white/40 uppercase tracking-wide">Threats: </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {species.threats.map((threat, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-red-500/20 text-red-400/80 rounded text-[8px]">
                  {threat}
                </span>
              ))}
            </div>
          </div>
          
          <div className="p-1.5 bg-cyan-500/10 rounded-lg">
            <span className="text-[8px] text-cyan-400 uppercase tracking-wide">Recovery: </span>
            <p className="text-[9px] text-white/80 mt-0.5 leading-relaxed">{species.returnReason}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function SpeciesPanel() {
  const { unlockedSpecies } = usePlanetStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-ui-dark/90 backdrop-blur-md rounded-xl border border-eco-purple/30 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-2 border-b border-white/10 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-eco-purple" />
        <h3 className="text-xs font-medium text-white">Endangered Species</h3>
        <span className="text-[10px] text-white/40">({unlockedSpecies.length})</span>
      </div>

      {/* Content */}
      <div className="p-2 max-h-56 overflow-y-auto">
        {unlockedSpecies.length === 0 ? (
          <div className="text-center py-3">
            <p className="text-[10px] text-white/40">No species discovered yet</p>
            <p className="text-[9px] text-white/30 mt-1">Reach 30% health!</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {unlockedSpecies.map((unlocked) => (
              <div 
                key={unlocked.species.id}
                className={Date.now() - unlocked.unlockedAt < 5000 ? 'ring-1 ring-cyan-400/50 rounded-lg' : ''}
              >
                <SpeciesCard 
                  species={unlocked.species} 
                  expanded={expandedId === unlocked.species.id}
                  onToggle={() => toggleExpand(unlocked.species.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
