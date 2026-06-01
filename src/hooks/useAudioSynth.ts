import { useEffect, useRef, useCallback, useState } from 'react';
import { usePlanetStore } from '@/contexts/PlanetContext';

export const useAudioSynth = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const isInitializedRef = useRef(false);
  const isPlayingRef = useRef(false);
  
  const { soundEnabled, health } = usePlanetStore();

  const initAudio = useCallback(async () => {
    if (isInitializedRef.current) return;
    
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      
      const masterGain = ctx.createGain();
      masterGain.gain.value = soundEnabled ? 0.3 : 0;
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Ambient wind noise
      const windGain = ctx.createGain();
      windGain.gain.value = 0.06;
      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.value = 800;
      windFilter.Q.value = 0.3;
      
      const windBuffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
      const windData = windBuffer.getChannelData(0);
      for (let i = 0; i < windData.length; i++) {
        windData[i] = Math.random() * 2 - 1;
      }
      
      const windSource = ctx.createBufferSource();
      windSource.buffer = windBuffer;
      windSource.loop = true;
      windSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(masterGain);
      windSource.start();

      isInitializedRef.current = true;
      isPlayingRef.current = true;
    } catch (error) {
      console.error('Audio init failed:', error);
    }
  }, [soundEnabled]);

  // Initialize on mount
  useEffect(() => {
    initAudio();
  }, [initAudio]);

  // Wind chime placement sound
  const playPlacementSound = useCallback(() => {
    if (!audioContextRef.current || !masterGainRef.current || !isPlayingRef.current) {
      initAudio();
    }
    
    const ctx = audioContextRef.current;
    if (!ctx) return;
    
    const now = ctx.currentTime;
    
    // Wind chime frequencies (pentatonic scale)
    const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66];
    const numNotes = 3 + Math.floor(Math.random() * 3);
    const startIdx = Math.floor(Math.random() * (pentatonic.length - numNotes));
    
    for (let i = 0; i < numNotes; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = pentatonic[startIdx + i] * (0.98 + Math.random() * 0.04);
      
      const startTime = now + i * 0.12;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 2 + Math.random());
      
      osc.connect(gain);
      gain.connect(masterGainRef.current!);
      
      osc.start(startTime);
      osc.stop(startTime + 3);
    }
    
    // Shimmer
    const shimmerOsc = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmerOsc.type = 'sine';
    shimmerOsc.frequency.value = pentatonic[startIdx] * 2;
    shimmerGain.gain.setValueAtTime(0, now);
    shimmerGain.gain.linearRampToValueAtTime(0.08, now + 0.05);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    shimmerOsc.connect(shimmerGain);
    shimmerGain.connect(masterGainRef.current!);
    shimmerOsc.start(now);
    shimmerOsc.stop(now + 2);
  }, [initAudio]);

  // Magic sparkle sound
  const playMagicSound = useCallback(() => {
    if (!audioContextRef.current || !masterGainRef.current) return;
    
    const ctx = audioContextRef.current;
    const now = ctx.currentTime;
    
    const sparkleNotes = [1046.50, 1318.51, 1567.98, 2093.00];
    
    sparkleNotes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq * (0.99 + Math.random() * 0.02);
      
      gain.gain.setValueAtTime(0, now + i * 0.06);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.06 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.6);
      
      osc.connect(gain);
      gain.connect(masterGainRef.current!);
      
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.7);
    });
  }, []);

  // Toggle master volume
  useEffect(() => {
    if (masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        soundEnabled ? 0.3 : 0,
        audioContextRef.current.currentTime,
        0.1
      );
      if (soundEnabled) isPlayingRef.current = true;
    }
  }, [soundEnabled]);

  return {
    initAudio,
    playPlacementSound,
    playMagicSound,
  };
};
