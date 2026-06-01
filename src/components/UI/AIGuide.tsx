import { usePlanetStore } from '@/contexts/PlanetContext';
import { Sparkles } from 'lucide-react';

export function AIGuide() {
  const { health, aiMessage } = usePlanetStore();

  const getMotivationalMessage = () => {
    // Show AI message if available, otherwise show motivational message
    if (aiMessage) return aiMessage;
    
    if (health.overall < 20) {
      return "This planet needs help! Start by adding rain.";
    } else if (health.overall < 40) {
      return "Good start! Plant more vegetation.";
    } else if (health.overall < 60) {
      return "Great progress! Ecosystem balancing.";
    } else if (health.overall < 80) {
      return "Amazing! Species are noticing!";
    } else {
      return "Incredible! Planet is thriving!";
    }
  };

  return (
    <div className="fixed bottom-20 left-4 z-40 animate-fadeIn max-w-xs">
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/95 to-purple-800/95 backdrop-blur rounded-xl shadow-lg border border-purple-400/40">
        <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
        <p className="text-xs text-white leading-relaxed">{getMotivationalMessage()}</p>
      </div>
    </div>
  );
}
