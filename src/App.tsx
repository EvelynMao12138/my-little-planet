import { useEffect, useRef, useState } from 'react';
import { usePlanetStore, ActionTool } from '@/contexts/PlanetContext';
import { useMouseGesture } from '@/hooks/useHandTracking';
import { useAudioSynth } from '@/hooks/useAudioSynth';
import { usePlanetDecay } from '@/hooks/usePlanetDecay';
import { PlanetCanvas } from './components/Planet/PlanetCanvas';
import { Toolbar } from './components/UI/Toolbar';
import { HealthPanel } from './components/UI/HealthPanel';
import { InstructionsPanel } from './components/UI/InstructionsPanel';
import { AIGuide } from './components/UI/AIGuide';
import { VoiceControl } from './components/Voice/VoiceControl';
import { ModelInfoPanel } from './components/UI/ModelInfoPanel';
import { RandomEvents } from './components/UI/RandomEvents';
import { SpeciesGallery } from './components/UI/SpeciesGallery';
import { SpeciesPopup } from './components/UI/SpeciesPopup';
import { SpeciesPanel } from './components/UI/SpeciesPanel';
import { MobileStatsPanel } from './components/UI/MobileStatsPanel';
import { PermissionsManager } from './components/Permissions/PermissionsManager';
import { RotateCcw, Volume2, BookOpen } from 'lucide-react';

const shortcutMap: Record<string, ActionTool> = {
  'r': 'rain',
  's': 'sun',
  'p': 'plant',
  'c': 'clean',
  'a': 'animals',
  'v': 'vegetation',
};

function AppContent() {
  const selectedTool = usePlanetStore(state => state.selectedTool);
  const soundEnabled = usePlanetStore(state => state.soundEnabled);
  const health = usePlanetStore(state => state.health);
  const magicMode = usePlanetStore(state => state.magicMode);
  const webcamActive = usePlanetStore(state => state.webcamActive);
  const unlockedSpecies = usePlanetStore(state => state.unlockedSpecies);

  const setSelectedTool = usePlanetStore(state => state.setSelectedTool);
  const resetPlanet = usePlanetStore(state => state.resetPlanet);
  const toggleVoice = usePlanetStore(state => state.toggleVoice);
  const toggleSound = usePlanetStore(state => state.toggleSound);
  const setWebcamActive = usePlanetStore(state => state.setWebcamActive);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [showGallery, setShowGallery] = useState(false);

  const { initAudio } = useAudioSynth();
  useMouseGesture();
  usePlanetDecay();

  useEffect(() => {
    const setupWebcam = async () => {
      if (webcamActive && !webcamStream) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: 1280, height: 720 }
          });
          setWebcamStream(stream);
          if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
          console.error('Webcam error:', err);
          setWebcamActive(false);
        }
      } else if (!webcamActive && webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
        setWebcamStream(null);
        if (videoRef.current) videoRef.current.srcObject = null;
      }
    };
    setupWebcam();
    return () => { if (webcamStream) webcamStream.getTracks().forEach(track => track.stop()); };
  }, [webcamActive, webcamStream, setWebcamActive]);

  useEffect(() => {
    const handleFirstInteraction = () => { initAudio(); };
    document.addEventListener('click', handleFirstInteraction, { once: true });
    return () => document.removeEventListener('click', handleFirstInteraction);
  }, [initAudio]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      if (shortcutMap[key]) { setSelectedTool(shortcutMap[key]); return; }
      if (key === 'm' && !e.ctrlKey && !e.metaKey) { toggleVoice(); return; }
      if (key === 'b') { toggleSound(); return; }
      if (key === 'escape') { resetPlanet(); return; }
      if (key === 'g') { setShowGallery(true); return; }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedTool, toggleVoice, toggleSound, resetPlanet]);

  const getBackgroundStyle = () => {
    const healthFactor = health.overall / 100;
    let starsOpacity = 0.4;
    let nebulaOpacity = 0.2;
    if (health.cleanliness < 25) { starsOpacity = 0.1; nebulaOpacity = 0; }
    else if (healthFactor > 0.75) { starsOpacity = 0.6; nebulaOpacity = 0.3; }
    return { starsOpacity, nebulaOpacity };
  };

  const bgStyle = getBackgroundStyle();

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {webcamActive && webcamStream && (
        <video ref={videoRef} autoPlay playsInline muted className="fixed inset-0 w-full h-full object-cover z-0" style={{ transform: 'scaleX(-1)' }} />
      )}

      <div className="fixed inset-0 transition-all duration-2000" style={{
        background: health.cleanliness < 25
          ? 'radial-gradient(ellipse at center, hsl(30, 15%, 20%) 0%, hsl(20, 20%, 10%) 50%, hsl(15, 25%, 5%) 100%)'
          : health.overall > 75
          ? 'radial-gradient(ellipse at center, hsl(260, 50%, 15%) 0%, hsl(280, 40%, 10%) 50%, hsl(300, 30%, 5%) 100%)'
          : 'radial-gradient(ellipse at center, hsl(240, 40%, 10%) 0%, hsl(260, 30%, 5%) 50%, hsl(280, 25%, 3%) 100%)',
        opacity: webcamActive ? 0.7 : 1
      }} />
      
      {health.overall > 50 && (
        <div className="fixed inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(138, 43, 226, ${bgStyle.nebulaOpacity}) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 70%, rgba(0, 191, 255, ${bgStyle.nebulaOpacity * 0.7}) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 50%, rgba(255, 105, 180, ${bgStyle.nebulaOpacity * 0.5}) 0%, transparent 50%)
          `,
        }} />
      )}

      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `
          radial-gradient(2px 2px at 20px 30px, white, transparent),
          radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
          radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.9), transparent),
          radial-gradient(2px 2px at 130px 80px, rgba(255,255,255,0.6), transparent),
          radial-gradient(1px 1px at 160px 120px, white, transparent)
        `,
        backgroundSize: '200px 200px',
        opacity: bgStyle.starsOpacity,
      }} />

      {magicMode && (
        <div className="fixed inset-0 pointer-events-none animate-pulse" style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.3) 0%, transparent 30%),
            radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.3) 0%, transparent 30%),
            radial-gradient(circle at 50% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 40%)
          `,
        }} />
      )}
      
      {health.cleanliness < 40 && (
        <div className="fixed inset-0 pointer-events-none" style={{ background: `rgba(139, 119, 101, ${(40 - health.cleanliness) / 100})` }} />
      )}
      
      <div className="relative h-full flex flex-col z-10">
        {/* Header */}
        <header className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-b from-black/40 to-transparent shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-eco-green to-eco-blue flex items-center justify-center ${magicMode ? 'animate-bounce' : ''}`}>
              <span className="text-base sm:text-lg">🌍</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-base sm:text-lg text-white drop-shadow-lg">My Planet</h1>
              <p className="text-[8px] sm:text-[10px] text-white/60">Balance the ecosystem</p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile: Info button */}
            <button onClick={() => setShowGallery(true)} className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1 rounded-lg text-xs transition-all ${unlockedSpecies.length > 0 ? 'bg-eco-purple/30 text-eco-purple hover:bg-eco-purple/40' : 'bg-white/10 text-white/50'}`}>
              <BookOpen className="w-3 h-3.5 sm:w-3.5 sm:w-3.5 h-3.5" />
              <span className="hidden sm:inline">{unlockedSpecies.length}</span>
            </button>
            
            <VoiceControl />
            <button onClick={toggleSound} className={`p-1.5 sm:p-2 rounded-lg transition-all ${soundEnabled ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'}`}>
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button onClick={resetPlanet} className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white/70 hover:text-white">
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex relative overflow-hidden">
          {/* Desktop: Left sidebar */}
          <aside className="hidden lg:block w-64 p-3 overflow-auto z-10">
            <InstructionsPanel />
          </aside>

          <main className="flex-1 relative z-0">
            <PlanetCanvas />
            <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-1 sm:py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
              <p className="text-[10px] sm:text-xs text-white/90">
                <span className="text-eco-green font-medium capitalize">{selectedTool}</span>
                <span className="text-white/50 ml-1 sm:ml-2">(Click)</span>
              </p>
            </div>
          </main>

          {/* Desktop: Right sidebar */}
          <aside className="hidden md:block w-64 p-3 overflow-auto z-10 flex flex-col gap-3">
            <HealthPanel />
            <SpeciesPanel />
          </aside>
        </div>

        {/* Mobile: Stats panel with health bar */}
        <MobileStatsPanel />

        <Toolbar />
        <AIGuide />
        <ModelInfoPanel />
        <RandomEvents />
        <SpeciesPopup />
        <SpeciesGallery isOpen={showGallery} onClose={() => setShowGallery(false)} />
        <PermissionsManager />
        <MobileStatsPanel />
      </div>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
