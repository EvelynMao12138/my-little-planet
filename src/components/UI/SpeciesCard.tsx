import { useState } from 'react';
import { Species } from '@/data/species';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SpeciesCardProps {
  species: Species;
  isNew?: boolean;
}

const statusColors: Record<string, string> = {
  'Critically Endangered': '#ef4444',
  'Endangered': '#f59e0b',
  'Threatened': '#3b82f6',
  'Vulnerable': '#8b5cf6',
};

export function SpeciesCard({ species, isNew = false }: SpeciesCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const statusColor = statusColors[species.status] || '#888';

  return (
    <div
      className={`rounded-lg overflow-hidden transition-all ${isNew ? 'ring-1 ring-cyan-400/50' : ''}`}
      style={{
        background: `linear-gradient(135deg, ${statusColor}10 0%, transparent 100%)`,
        border: `1px solid ${statusColor}25`,
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-2 flex items-center gap-2 text-left hover:bg-white/5 transition-colors"
      >
        {/* Image */}
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/20 flex-shrink-0">
          {!imageError ? (
            <img 
              src={species.imageUrl} 
              alt={species.commonName}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-800 to-green-600">
              <span className="text-white/60 text-lg">🐾</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-xs text-white truncate">{species.commonName}</h4>
          <p className="text-[9px] text-white/40">{species.habitat}</p>
        </div>
        <span
          className="px-1.5 py-0.5 rounded text-[8px] font-medium shrink-0"
          style={{
            backgroundColor: `${statusColor}20`,
            color: statusColor,
          }}
        >
          {species.status === 'Critically Endangered' ? 'Crit. End.' : 
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
        <div className="px-2 pb-2 space-y-1.5 animate-fadeIn">
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
          
          <p className="text-[9px] text-white/40 italic">{species.scientificName}</p>
          <p className="text-[10px] text-white/70 leading-relaxed">{species.description}</p>
          <div className="text-[9px] text-white/60">
            <span className="text-white/40">Population: </span>
            <span className="font-mono">{species.population}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {species.threats.slice(0, 3).map((threat, i) => (
              <span key={i} className="px-1.5 py-0.5 bg-red-500/20 text-red-400/80 rounded text-[8px]">
                {threat}
              </span>
            ))}
          </div>
          <div className="p-1.5 bg-cyan-500/10 rounded text-[9px] text-white/70">
            <span className="text-cyan-400/80 text-[8px]">Recovery: </span>
            {species.returnReason}
          </div>
        </div>
      )}
    </div>
  );
}
