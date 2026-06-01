import { Mic, MicOff, AlertCircle, Volume2 } from 'lucide-react';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { usePlanetStore } from '@/contexts/PlanetContext';
import { useState, useEffect } from 'react';

export function VoiceControl() {
  const { isListening, toggleListening, isSupported, transcript } = useVoiceCommands();
  const { voiceEnabled } = usePlanetStore();
  const [showHelp, setShowHelp] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  // Show transcript briefly when received
  useEffect(() => {
    if (transcript) {
      setShowTranscript(true);
      const timer = setTimeout(() => setShowTranscript(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [transcript]);

  const handleClick = () => {
    if (!isSupported && !isListening) {
      setShowHelp(true);
      setTimeout(() => setShowHelp(false), 3000);
    }
    toggleListening();
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`relative p-3 rounded-xl transition-all ${
          isListening
            ? 'bg-purple-500/50 ring-2 ring-purple-400 animate-pulse'
            : voiceEnabled
            ? 'bg-white/10 hover:bg-white/20'
            : 'bg-white/5 hover:bg-white/10'
        }`}
        title={isListening ? 'Listening... Click to stop' : 'Voice Commands'}
      >
        {isListening ? (
          <>
            <Mic className="w-6 h-6 text-purple-300" />
            {/* Animated sound waves */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
              <div className="w-1 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </>
        ) : (
          <MicOff className="w-6 h-6 text-white/50" />
        )}
      </button>

      {/* Help tooltip */}
      {showHelp && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/95 rounded-lg text-xs text-white whitespace-nowrap z-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            Use Chrome browser for voice commands
          </div>
        </div>
      )}

      {/* Transcript display */}
      {showTranscript && transcript && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-2 bg-purple-600/95 rounded-xl text-xs text-white whitespace-nowrap z-50 shadow-lg">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            "{transcript}"
          </div>
        </div>
      )}

      {/* Status indicator */}
      {!isListening && !voiceEnabled && (
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white/30" title="Voice inactive" />
      )}
    </div>
  );
}
