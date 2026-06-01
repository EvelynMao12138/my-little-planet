import { useState } from 'react';
import { Species } from '@/data/species';
import { X, BookOpen, ChevronRight } from 'lucide-react';
import { usePlanetStore } from '@/contexts/PlanetContext';

interface SpeciesGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SpeciesGallery({ isOpen, onClose }: SpeciesGalleryProps) {
  const { unlockedSpecies } = usePlanetStore();
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-ui-dark rounded-2xl border border-white/20 max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-eco-purple/20 rounded-xl">
              <BookOpen className="w-5 h-5 text-eco-purple" />
            </div>
            <div>
              <h2 className="font-display text-lg text-white">Species Gallery</h2>
              <p className="text-xs text-white/50">Discovered {unlockedSpecies.length} / 10 species</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>
        
        {/* Species Grid */}
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {unlockedSpecies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/60">No species discovered yet</p>
              <p className="text-white/40 text-sm mt-2">Reach 30% planet health to discover species!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {unlockedSpecies.map(({ species }) => (
                <div 
                  key={species.id}
                  className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => setSelectedSpecies(species)}
                >
                  <div className="flex gap-3 p-3 items-center">
                    {/* Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/20 flex-shrink-0">
                      <img 
                        src={species.imageUrl} 
                        alt={species.commonName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-display text-sm text-white">{species.commonName}</h3>
                      </div>
                      <p className="text-[10px] text-white/40 italic mb-1">{species.scientificName}</p>
                      <p className="text-[10px] text-white/60 line-clamp-1">{species.description}</p>
                    </div>
                    
                    <ChevronRight className="w-4 h-4 text-white/40 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Species Detail Modal */}
        {selectedSpecies && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedSpecies(null)}>
            <div 
              className="bg-ui-dark rounded-2xl border border-white/20 max-w-md w-full overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Image */}
              <div className="h-40 bg-black/30">
                <img 
                  src={selectedSpecies.imageUrl} 
                  alt={selectedSpecies.commonName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              
              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-xl text-white">{selectedSpecies.commonName}</h3>
                    <p className="text-white/50 text-sm italic">{selectedSpecies.scientificName}</p>
                  </div>
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: selectedSpecies.status === 'Critically Endangered' ? '#ef444420' : 
                                      selectedSpecies.status === 'Endangered' ? '#f59e0b20' : '#3b82f620',
                      color: selectedSpecies.status === 'Critically Endangered' ? '#ef4444' : 
                             selectedSpecies.status === 'Endangered' ? '#f59e0b' : '#3b82f6',
                    }}
                  >
                    {selectedSpecies.status === 'Critically Endangered' ? 'Critically Endangered' : 
                     selectedSpecies.status === 'Endangered' ? 'Endangered' : 'Threatened'}
                  </span>
                </div>
                
                <div className="text-xs text-white/40">
                  <span className="uppercase tracking-wider">Habitat:</span>
                  <span className="text-white/70 ml-2">{selectedSpecies.habitat}</span>
                </div>
                
                <p className="text-sm text-white/80 leading-relaxed">{selectedSpecies.description}</p>
                
                <div className="text-xs text-white/40">
                  <span className="uppercase tracking-wider">Population:</span>
                  <span className="text-white/70 ml-2 font-mono">{selectedSpecies.population}</span>
                </div>
                
                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider">Main Threats:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedSpecies.threats.map((threat, i) => (
                      <span key={i} className="px-2 py-0.5 bg-red-500/20 text-red-400/90 rounded text-xs">
                        {threat}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <span className="text-[10px] text-cyan-400 uppercase tracking-wider">Why They Returned</span>
                  <p className="text-xs text-white/80 mt-1">{selectedSpecies.returnReason}</p>
                </div>
                
                <button 
                  onClick={() => setSelectedSpecies(null)}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
