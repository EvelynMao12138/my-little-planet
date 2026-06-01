import { MousePointer2, Hand, Mic, Volume2, Keyboard, RotateCcw, ZoomIn } from 'lucide-react';
import { usePlanetStore } from '@/contexts/PlanetContext';

export function InstructionsPanel() {
  const { showInstructions, toggleInstructions, handTrackingEnabled } = usePlanetStore();

  const controls = [
    {
      icon: <MousePointer2 className="w-5 h-5" />,
      title: 'Click to Apply',
      description: 'Click anywhere on the planet to apply the selected action',
    },
    {
      icon: <RotateCcw className="w-5 h-5" />,
      title: 'Drag to Rotate',
      description: 'Click and drag to rotate the planet around',
    },
    {
      icon: <ZoomIn className="w-5 h-5" />,
      title: 'Scroll to Zoom',
      description: 'Use mouse wheel to zoom in and out',
    },
    {
      icon: <Hand className="w-5 h-5" />,
      title: 'Hand Gestures',
      description: handTrackingEnabled
        ? 'Use open palm to push particles, pinch to pull'
        : 'Enable webcam for hand gesture control',
    },
    {
      icon: <Mic className="w-5 h-5" />,
      title: 'Voice Commands',
      description: 'Say "make it rain", "plant trees", "clean trash", etc.',
    },
    {
      icon: <Keyboard className="w-5 h-5" />,
      title: 'Keyboard Shortcuts',
      description: 'R=rain, S=sun, P=plant, C=clean, A=animals, V=build city',
    },
  ];

  return (
    <div className="bg-ui-dark/80 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <button
        onClick={toggleInstructions}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">📖</span>
          <h2 className="font-display text-white">How to Play</h2>
        </div>
        <span className="text-white/40 text-sm">
          {showInstructions ? 'Hide' : 'Show'}
        </span>
      </button>

      {/* Content */}
      {showInstructions && (
        <div className="px-4 pb-4 space-y-3 animate-fadeIn">
          {/* Mission Statement */}
          <div className="p-3 bg-gradient-to-r from-eco-green/20 to-eco-blue/20 rounded-xl border border-white/10">
            <h3 className="text-sm font-display text-eco-green mb-1">Your Mission</h3>
            <p className="text-xs text-white/70">
              Restore the damaged planet by using rain, sunlight, plants, and care. 
              Watch as life returns and endangered species discover your restored world!
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-2">
            {controls.map((control, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-eco-teal flex-shrink-0">
                  {control.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-white">{control.title}</h4>
                  <p className="text-[10px] text-white/50">{control.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Voice Commands Quick Reference */}
          <div className="p-3 bg-white/5 rounded-xl">
            <h3 className="text-xs font-display text-white/80 mb-2 flex items-center gap-1.5">
              <Mic className="w-3 h-3" /> Voice Commands
            </h3>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              {['"make it rain"', '"add sun"', '"plant trees"', '"clean trash"', '"add animals"', '"add vegetation"'].map(
                (cmd, i) => (
                  <span key={i} className="px-2 py-1 bg-white/5 rounded text-white/60 font-mono">
                    {cmd}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Sound Moods */}
          <div className="p-3 bg-white/5 rounded-xl">
            <h3 className="text-xs font-display text-white/80 mb-2 flex items-center gap-1.5">
              <Volume2 className="w-3 h-3" /> Sound Moods
            </h3>
            <p className="text-[10px] text-white/50 mb-2">
              Use the sound buttons to change the ambient atmosphere
            </p>
            <div className="flex gap-1.5 text-[10px]">
              {['🏜️ Dry', '🌧️ Rain', '🌲 Forest', '🦁 Wildlife'].map((mood, i) => (
                <span key={i} className="px-2 py-1 bg-white/5 rounded text-white/60">
                  {mood}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
