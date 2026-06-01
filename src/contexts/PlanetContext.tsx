import { create } from 'zustand';
import { Species, speciesData } from '@/data/species';

export type ActionTool = 'rain' | 'sun' | 'plant' | 'clean' | 'animals' | 'vegetation';
export type SoundMood = 'dry' | 'rain' | 'forest' | 'wildlife' | 'polluted';

export interface PlanetHealth {
  overall: number;
  water: number;
  vegetation: number;
  animals: number;
  cleanliness: number;
  energy: number;
}

export interface PlacedItem {
  id: string;
  type: 'animal' | 'plant' | 'vegetation';
  species: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  createdAt: number;
  health: number;
}

export interface UnlockedSpecies {
  species: Species;
  unlockedAt: number;
  showPopup: boolean;
  modelPosition?: [number, number, number];
}

interface PlanetState {
  health: PlanetHealth;
  selectedTool: ActionTool;
  placedItems: PlacedItem[];
  selectedItem: PlacedItem | null;
  unlockedSpecies: UnlockedSpecies[];
  soundMood: SoundMood;
  soundEnabled: boolean;
  magicMode: boolean;
  lastMagicTime: number;
  handTrackingEnabled: boolean;
  handPosition: { x: number; y: number; z: number } | null;
  isPinching: boolean;
  pinchDistance: number;
  isPalmOpen: boolean;
  voiceEnabled: boolean;
  lastVoiceCommand: string | null;
  showInstructions: boolean;
  showAIGuide: boolean;
  aiMessage: string | null;
  activeEffects: string[];
  showMagicBurst: { position: [number, number, number]; color: string } | null;
  webcamActive: boolean;
  lastUpdateTime: number;
  showSpeciesLabels: boolean;
  
  setSelectedTool: (tool: ActionTool) => void;
  applyAction: (action: ActionTool, intensity?: number) => void;
  placeItem: (item: Omit<PlacedItem, 'id' | 'createdAt' | 'health'>) => void;
  selectItem: (item: PlacedItem | null) => void;
  updateHealth: (updates: Partial<PlanetHealth>) => void;
  unlockSpecies: (species: Species, position?: [number, number, number]) => void;
  dismissSpeciesPopup: (speciesId: string) => void;
  setSoundMood: (mood: SoundMood) => void;
  toggleSound: () => void;
  triggerMagic: () => void;
  setMagicMode: (active: boolean) => void;
  setShowMagicBurst: (burst: { position: [number, number, number]; color: string } | null) => void;
  setHandTracking: (enabled: boolean) => void;
  setHandPosition: (pos: { x: number; y: number; z: number } | null) => void;
  setIsPinching: (pinching: boolean) => void;
  setPinchDistance: (distance: number) => void;
  setIsPalmOpen: (open: boolean) => void;
  toggleVoice: () => void;
  setLastVoiceCommand: (cmd: string | null) => void;
  toggleInstructions: () => void;
  toggleAIGuide: () => void;
  showAIMessage: (message: string) => void;
  hideAIMessage: () => void;
  addEffect: (effect: string) => void;
  removeEffect: (effect: string) => void;
  setWebcamActive: (active: boolean) => void;
  updatePlanetTick: () => void;
  toggleSpeciesLabels: () => void;
  resetPlanet: () => void;
}

const initialHealth: PlanetHealth = {
  overall: 25,
  water: 40,
  vegetation: 20,
  animals: 15,
  cleanliness: 30,
  energy: 35,
};

export const plantSpecies = [
  { id: 'oak', name: 'Oak', color: '#5D4037', leafColor: '#2E7D32' },
  { id: 'flower', name: 'Flower', color: '#4CAF50', petalColor: '#E91E63' },
  { id: 'mushroom', name: 'Mushroom', color: '#ECE4B7', capColor: '#D84315' },
  { id: 'fern', name: 'Fern', color: '#4CAF50', leafColor: '#388E3C' },
  { id: 'cactus', name: 'Cactus', color: '#689F38', spineColor: '#558B2F' },
  { id: 'bamboo', name: 'Bamboo', color: '#8BC34A', leafColor: '#7CB342' },
  { id: 'pine', name: 'Pine', color: '#5D4037', leafColor: '#1B5E20' },
  { id: 'bush', name: 'Berry Bush', color: '#5D4037', berryColor: '#9C27B0' },
];

export const animalSpecies = [
  { id: 'rabbit', name: 'Rabbit', color: '#E8E8E8', earColor: '#F5F5F5' },
  { id: 'bird', name: 'Bird', color: '#1976D2', wingColor: '#1565C0' },
  { id: 'deer', name: 'Deer', color: '#8D6E63', antlerColor: '#5D4037' },
  { id: 'fox', name: 'Fox', color: '#FF7043', bellyColor: '#FFE0B2' },
  { id: 'owl', name: 'Owl', color: '#795548', eyeColor: '#FFC107' },
  { id: 'butterfly', name: 'Butterfly', color: '#E91E63', wingColor: '#9C27B0' },
  { id: 'squirrel', name: 'Squirrel', color: '#A1887F', bellyColor: '#D7CCC8' },
  { id: 'bee', name: 'Bee', color: '#FFC107', stripeColor: '#212121' },
];

export const usePlanetStore = create<PlanetState>((set, get) => ({
  health: { ...initialHealth },
  selectedTool: 'rain',
  placedItems: [],
  selectedItem: null,
  unlockedSpecies: [],
  soundMood: 'polluted',
  soundEnabled: true,
  magicMode: false,
  lastMagicTime: 0,
  handTrackingEnabled: false,
  handPosition: null,
  isPinching: false,
  pinchDistance: 0,
  isPalmOpen: false,
  voiceEnabled: false,
  lastVoiceCommand: null,
  showInstructions: true,
  showAIGuide: true,
  aiMessage: null,
  activeEffects: [],
  showMagicBurst: null,
  webcamActive: false,
  lastUpdateTime: Date.now(),
  showSpeciesLabels: true,

  setSelectedTool: (tool) => set({ selectedTool: tool }),

  applyAction: (action, intensity = 1) => {
    const { health, addEffect, showAIMessage, setSoundMood } = get();
    const updates: Partial<PlanetHealth> = {};
    let message = '';

    switch (action) {
      case 'rain':
        updates.water = Math.min(100, health.water + 12 * intensity);
        message = ['Rain falls! 💧', 'Water rises! 💧', 'Life awakens! 💧'][Math.floor(Math.random() * 3)];
        addEffect('rain');
        break;
      case 'sun':
        updates.energy = Math.min(100, health.energy + 10 * intensity);
        if (health.water > 60) {
          updates.water = Math.max(0, health.water - 8);
          message = '☀️ Sun evaporates water... balanced!';
        } else {
          message = '☀️ Perfect sunlight!';
        }
        addEffect('sun');
        break;
      case 'plant':
        if (health.water < 20) {
          message = '🌱 Too dry! Add water first.';
        } else {
          updates.vegetation = Math.min(100, health.vegetation + 10 * intensity);
          updates.water = Math.max(0, health.water - 5);
          message = ['🌱 Seeds sprout!', '🌱 New life!', '🌱 Forest grows!'][Math.floor(Math.random() * 3)];
          addEffect('plant');
        }
        break;
      case 'clean':
        updates.cleanliness = Math.min(100, health.cleanliness + 18 * intensity);
        message = ['✨ Clean!', '✨ Fresh air!', '✨ Planet purified!'][Math.floor(Math.random() * 3)];
        break;
      case 'animals':
        if (health.vegetation < 15) {
          message = '🐾 Not enough habitat!';
        } else if (health.cleanliness < 20) {
          message = '🐾 Too dirty! Clean first.';
        } else {
          updates.animals = Math.min(100, health.animals + 10 * intensity);
          updates.vegetation = Math.max(0, health.vegetation - 3);
          updates.cleanliness = Math.max(0, health.cleanliness - 2);
          message = ['🐾 Wildlife returns!', '🐾 Animals appear!', '🐾 Ecosystem grows!'][Math.floor(Math.random() * 3)];
        }
        break;
      case 'vegetation':
        // Buildings reduce cleanliness but show human presence
        updates.cleanliness = Math.max(0, health.cleanliness - 10 * intensity);
        message = ['🏠 City grows!', '🏗️ Development...', '🏘️ Settlement built!'][Math.floor(Math.random() * 3)];
        break;
    }

    const newHealth = { ...health, ...updates };
    newHealth.overall = Math.round(
      (newHealth.water + newHealth.vegetation + newHealth.animals + 
       newHealth.cleanliness + newHealth.energy) / 5
    );
    updates.overall = newHealth.overall;

    set({ health: { ...health, ...updates } });
    if (message) showAIMessage(message);

    if (newHealth.cleanliness < 25) setSoundMood('polluted');
    else if (newHealth.overall > 75) setSoundMood('forest');
    else if (newHealth.animals > 60) setSoundMood('wildlife');
    else if (newHealth.water > 50) setSoundMood('rain');

    // Check species unlocks
    const state = get();
    if (newHealth.overall >= 30 && state.unlockedSpecies.length === 0) {
      const species = speciesData[Math.floor(Math.random() * 3)];
      state.unlockSpecies(species, [2.5, 0, 0]);
    }
    if (newHealth.overall >= 55 && state.unlockedSpecies.length === 1) {
      const species = speciesData[3 + Math.floor(Math.random() * 3)];
      state.unlockSpecies(species, [-2.5, 0.5, 0]);
    }
    if (newHealth.overall >= 80 && state.unlockedSpecies.length === 2) {
      const remaining = speciesData.filter(s => !state.unlockedSpecies.some(us => us.species.id === s.id));
      if (remaining.length > 0) {
        state.unlockSpecies(remaining[Math.floor(Math.random() * remaining.length)], [0, 2.5, 0]);
      }
    }
  },

  placeItem: (item) => {
    const newItem: PlacedItem = {
      ...item,
      id: `${item.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      health: 100,
    };
    set({ placedItems: [...get().placedItems, newItem].slice(-60) });
  },

  selectItem: (item) => set({ selectedItem: item }),

  updateHealth: (updates) => {
    const { health } = get();
    const newHealth = { ...health, ...updates };
    newHealth.overall = Math.round(
      (newHealth.water + newHealth.vegetation + newHealth.animals + 
       newHealth.cleanliness + newHealth.energy) / 5
    );
    set({ health: newHealth });
  },

  unlockSpecies: (species, position = [2.5, 0, 0]) => {
    const { unlockedSpecies } = get();
    if (!unlockedSpecies.some(s => s.species.id === species.id)) {
      set({ unlockedSpecies: [...unlockedSpecies, { species, unlockedAt: Date.now(), showPopup: true, modelPosition: position }] });
    }
  },

  dismissSpeciesPopup: (speciesId) => {
    set({
      unlockedSpecies: get().unlockedSpecies.map(s =>
        s.species.id === speciesId ? { ...s, showPopup: false } : s
      )
    });
  },

  setSoundMood: (mood) => set({ soundMood: mood }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  triggerMagic: () => {
    const now = Date.now();
    if (now - get().lastMagicTime < 500) return;
    
    const { health, showAIMessage, setShowMagicBurst } = get();
    const stats: (keyof PlanetHealth)[] = ['water', 'vegetation', 'animals', 'cleanliness', 'energy'];
    const stat = stats[Math.floor(Math.random() * stats.length)];
    const change = Math.floor(Math.random() * 20) - 5;
    
    const currentValue = health[stat] as number;
    const newValue = Math.max(0, Math.min(100, currentValue + change));
    const updates: Partial<PlanetHealth> = { [stat]: newValue };
    
    const newHealth = { ...health, ...updates };
    newHealth.overall = Math.round(
      (newHealth.water + newHealth.vegetation + newHealth.animals + 
       newHealth.cleanliness + newHealth.energy) / 5
    );
    updates.overall = newHealth.overall;

    set({ health: { ...health, ...updates }, lastMagicTime: now, magicMode: true });
    get().addEffect(['rain', 'sun', 'plant'][Math.floor(Math.random() * 3)]);
    
    const colors = ['#FFD700', '#a855f7', '#22c55e', '#3b82f6', '#f59e0b'];
    setShowMagicBurst({
      position: [(Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, 2.5],
      color: colors[Math.floor(Math.random() * colors.length)]
    });
    setTimeout(() => setShowMagicBurst(null), 1000);
    
    showAIMessage(`✨ Magic! ${stat} ${change >= 0 ? '+' : ''}${change}!`);
    setTimeout(() => set({ magicMode: false }), 2000);
  },

  setShowMagicBurst: (burst) => set({ showMagicBurst: burst }),

  setHandTracking: (enabled) => set({ handTrackingEnabled: enabled }),
  setHandPosition: (pos) => set({ handPosition: pos }),
  setIsPinching: (pinching) => set({ isPinching: pinching }),
  setPinchDistance: (distance) => set({ pinchDistance: distance }),
  setIsPalmOpen: (open) => set({ isPalmOpen: open }),

  toggleVoice: () => set((state) => ({ voiceEnabled: !state.voiceEnabled })),
  setLastVoiceCommand: (cmd) => set({ lastVoiceCommand: cmd }),

  toggleInstructions: () => set((state) => ({ showInstructions: !state.showInstructions })),
  toggleAIGuide: () => set((state) => ({ showAIGuide: !state.showAIGuide })),

  showAIMessage: (message) => {
    set({ aiMessage: message });
    setTimeout(() => set({ aiMessage: null }), 5000);
  },
  hideAIMessage: () => set({ aiMessage: null }),

  addEffect: (effect) => {
    const { activeEffects } = get();
    if (!activeEffects.includes(effect)) {
      set({ activeEffects: [...activeEffects, effect] });
    }
    setTimeout(() => get().removeEffect(effect), 3000);
  },
  removeEffect: (effect) => {
    set({ activeEffects: get().activeEffects.filter(e => e !== effect) });
  },

  setWebcamActive: (active) => set({ webcamActive: active }),

  updatePlanetTick: () => {
    const { health, lastUpdateTime } = get();
    const now = Date.now();
    const deltaSeconds = (now - lastUpdateTime) / 1000;
    
    // Decay multiplier based on time elapsed
    const decayMultiplier = Math.min(deltaSeconds / 3, 2); // Cap at 2x to prevent huge jumps
    
    if (decayMultiplier < 0.3) return; // Only update every ~1 second minimum
    
    const updates: Partial<PlanetHealth> = {};
    
    // Water evaporates (faster with high energy)
    if (health.water > 8) {
      const evapRate = (0.8 + (health.energy / 100) * 1.2) * decayMultiplier;
      updates.water = Math.max(0, health.water - evapRate);
    }
    
    // Energy decreases
    if (health.energy > 8) {
      updates.energy = Math.max(0, health.energy - 0.8 * decayMultiplier);
    }
    
    // Vegetation needs water
    if (health.vegetation > 5) {
      let decayRate = 0.6 * decayMultiplier;
      if (health.water < 20) decayRate += 1.5 * decayMultiplier;
      updates.vegetation = Math.max(0, health.vegetation - decayRate);
    }
    
    // Animals need vegetation and cleanliness
    if (health.animals > 5) {
      let decayRate = 0.5 * decayMultiplier;
      if (health.vegetation < 20) decayRate += 1.2 * decayMultiplier;
      if (health.cleanliness < 30) decayRate += 0.8 * decayMultiplier;
      updates.animals = Math.max(0, health.animals - decayRate);
    }
    
    // Cleanliness decreases slowly
    if (health.cleanliness > 10) {
      updates.cleanliness = Math.max(0, health.cleanliness - 0.5);
    }
    
    if (Object.keys(updates).length > 0) {
      const newHealth = { ...health, ...updates };
      newHealth.overall = Math.round(
        (newHealth.water + newHealth.vegetation + newHealth.animals + 
         newHealth.cleanliness + newHealth.energy) / 5
      );
      updates.overall = newHealth.overall;
      set({ health: { ...health, ...updates }, lastUpdateTime: now });
    } else {
      set({ lastUpdateTime: now });
    }
  },

  toggleSpeciesLabels: () => set((state) => ({ showSpeciesLabels: !state.showSpeciesLabels })),

  resetPlanet: () => set({
    health: { ...initialHealth },
    placedItems: [],
    selectedItem: null,
    unlockedSpecies: [],
    activeEffects: [],
    soundMood: 'polluted',
    aiMessage: 'Welcome! Balance this planet.',
    lastUpdateTime: Date.now(),
  }),
}));
