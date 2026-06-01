import { useState } from 'react';
import { X } from 'lucide-react';
import { HealthPanel } from './HealthPanel';
import { SpeciesPanel } from './SpeciesPanel';
import { MobileHealthBar } from './MobileHealthBar';

export function MobileStatsPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Compact Health Bar - shown when panel is closed */}
      <div className="md:hidden fixed bottom-16 left-2 right-16 z-20">
        <MobileHealthBar onExpand={() => setIsOpen(true)} />
      </div>

      {/* Toggle Button - Bottom right on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-16 right-2 z-30 md:hidden p-3 bg-gray-900/90 backdrop-blur rounded-full border border-white/20 shadow-lg hover:bg-gray-800 transition-colors"
      >
        <span className="text-lg">📊</span>
      </button>

      {/* Slide-up Panel */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 md:hidden transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-gray-900/95 backdrop-blur-lg rounded-t-3xl border-t border-white/20 p-4 max-h-[70vh] overflow-auto">
          {/* Header drag handle */}
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-1 bg-white/30 rounded-full" />
          </div>

          {/* Close button */}
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <HealthPanel />
            <SpeciesPanel />
          </div>
        </div>
      </div>
    </>
  );
}
