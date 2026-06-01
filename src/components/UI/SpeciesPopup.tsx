import { Sparkles } from 'lucide-react';
import { usePlanetStore } from '@/contexts/PlanetContext';

export function SpeciesPopup() {
  const { unlockedSpecies, dismissSpeciesPopup } = usePlanetStore();
  
  const popupSpecies = unlockedSpecies.find(s => s.showPopup);
  
  if (!popupSpecies) return null;

  return (
    <div className="fixed top-16 right-4 z-[60] animate-fadeIn max-w-[200px]">
      <div className="bg-ui-dark/95 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-2 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shrink-0">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-[8px] text-white/50">New Discovery!</p>
            <p className="text-xs text-white font-medium truncate">{popupSpecies.species.commonName}</p>
          </div>
          
          <button
            onClick={() => dismissSpeciesPopup(popupSpecies.species.id)}
            className="p-0.5 hover:bg-white/10 rounded transition-colors text-white/40 text-[10px]"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
