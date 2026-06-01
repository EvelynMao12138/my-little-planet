import { CloudRain, Sun, Sprout, Trash2, Bird, Building2, Hand, Camera, CameraOff, HelpCircle, Video, VideoOff, Check, X } from 'lucide-react';
import { usePlanetStore, ActionTool } from '@/contexts/PlanetContext';
import { useHandTracking } from '@/hooks/useHandTracking';
import { useState, useEffect } from 'react';

const tools: { id: ActionTool; label: string; icon: React.ReactNode; shortcut: string }[] = [
  { id: 'rain', label: 'Rain', icon: <CloudRain className="w-5 h-5" />, shortcut: 'R' },
  { id: 'sun', label: 'Sunlight', icon: <Sun className="w-5 h-5" />, shortcut: 'S' },
  { id: 'plant', label: 'Plant Trees', icon: <Sprout className="w-5 h-5" />, shortcut: 'P' },
  { id: 'clean', label: 'Clean Trash', icon: <Trash2 className="w-5 h-5" />, shortcut: 'C' },
  { id: 'animals', label: 'Add Animals', icon: <Bird className="w-5 h-5" />, shortcut: 'A' },
  { id: 'vegetation', label: 'Build City', icon: <Building2 className="w-5 h-5" />, shortcut: 'V' },
];

export function Toolbar() {
  const { selectedTool, setSelectedTool, handTrackingEnabled } = usePlanetStore();
  const { initializeHandTracking, stopHandTracking, isLoading, videoRef } = useHandTracking();
  const [showWebcamHelp, setShowWebcamHelp] = useState(false);
  const [showWebcamPreview, setShowWebcamPreview] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Show status messages
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleToggleHandTracking = async () => {
    if (handTrackingEnabled) {
      stopHandTracking();
      setShowWebcamPreview(false);
      setStatusMessage('Camera disabled');
    } else {
      setStatusMessage('Starting camera...');
      try {
        await initializeHandTracking();
        setShowWebcamPreview(true);
        setStatusMessage('Camera active!');
      } catch {
        setStatusMessage('Camera failed');
      }
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
      {/* Webcam Help Modal */}
      {showWebcamHelp && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowWebcamHelp(false)}>
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md border border-white/20" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl text-white mb-4 flex items-center gap-2">
              <Video className="w-6 h-6 text-cyan-400" />
              How to Use Webcam Control
            </h3>
            
            <div className="space-y-4 text-white/80 text-sm">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">1</span>
                <div>
                  <p className="font-medium text-white">Click "Enable Camera"</p>
                  <p className="text-white/60">Allow browser to access your webcam</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center text-green-400 font-bold">2</span>
                <div>
                  <p className="font-medium text-white">Show Your Hand</p>
                  <p className="text-white/60">Camera detects hand movements</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-orange-500/30 flex items-center justify-center text-orange-400 font-bold">3</span>
                <div>
                  <p className="font-medium text-white">Control the Planet</p>
                  <ul className="text-white/60 mt-1 space-y-1">
                    <li>✋ <strong>Open Palm</strong> - Move to rotate</li>
                    <li>🤏 <strong>Pinch</strong> - Zoom in/out</li>
                    <li>👆 <strong>Point</strong> - Select items</li>
                  </ul>
                </div>
              </div>
              
              <button 
                onClick={() => setShowWebcamHelp(false)}
                className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Status Message Toast */}
      {statusMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
          <div className="px-4 py-2 bg-gray-900/95 backdrop-blur rounded-lg border border-white/20 shadow-lg">
            <span className="text-sm text-white">{statusMessage}</span>
          </div>
        </div>
      )}
      
      {/* Gesture Status Bar */}
      <div className="max-w-3xl mx-auto mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
            handTrackingEnabled 
              ? 'bg-cyan-500/30 ring-2 ring-cyan-400' 
              : 'bg-white/10'
          }`}>
            {handTrackingEnabled ? (
              <Video className="w-4 h-4 text-cyan-400" />
            ) : (
              <Hand className="w-4 h-4 text-white/50" />
            )}
            <span className={`text-xs font-medium ${
              handTrackingEnabled ? 'text-cyan-300' : 'text-white/60'
            }`}>
              {isLoading ? 'Loading...' : handTrackingEnabled ? 'Webcam Active' : 'Mouse Mode'}
            </span>
            {handTrackingEnabled && (
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </div>
          
          {handTrackingEnabled && (
            <div className="hidden md:flex gap-4 text-[10px] text-white/50">
              <span>✋ Move = rotate</span>
              <span>🤏 Pinch = zoom</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWebcamHelp(true)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/60 transition-colors"
            title="Webcam help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleToggleHandTracking}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              handTrackingEnabled
                ? 'bg-cyan-500/40 text-cyan-300 ring-2 ring-cyan-400/50'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Starting...</span>
              </>
            ) : handTrackingEnabled ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span>Camera On</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>Enable Camera</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-center gap-2 max-w-4xl mx-auto">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setSelectedTool(tool.id)}
            className={`group relative flex flex-col items-center px-4 py-3 rounded-xl transition-all ${
              selectedTool === tool.id
                ? 'bg-white/20 ring-2 ring-white/30 shadow-lg'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <span className={`mb-1 transition-colors ${
              selectedTool === tool.id ? 'text-white' : 'text-white/70 group-hover:text-white'
            }`}>
              {tool.icon}
            </span>
            <span className={`text-xs font-medium transition-colors ${
              selectedTool === tool.id ? 'text-white' : 'text-white/50'
            }`}>
              {tool.label}
            </span>
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-mono bg-white/20 rounded text-white/60">
              {tool.shortcut}
            </span>
          </button>
        ))}
      </div>

      {/* Webcam Preview */}
      {showWebcamPreview && handTrackingEnabled && videoRef.current && (
        <div className="fixed bottom-36 right-4 w-48 h-36 rounded-xl overflow-hidden border-2 border-cyan-400/50 shadow-2xl z-50">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <p className="text-[10px] text-white/90 font-medium">Hand Tracking Active</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
