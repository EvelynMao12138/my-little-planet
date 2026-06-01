# My Planet, My Hands - Specification

## Concept & Vision

"My Planet, My Hands" is an immersive 3D ecology education experience where students restore a living planet through gesture, voice, and touch. The app feels like tending a magical terrarium suspended in space—serene yet alive, educational yet playful. Every interaction teaches ecological concepts through embodied actions: rain nurtures, sun energizes, seeds grow, trash harms, animals thrive, vegetation flourishes.

## Design Language

### Aesthetic Direction
A cosmic nursery: the planet floats in deep space with a subtle aurora glow, surrounded by particle fields that respond to user presence. Think "NASA meets Studio Ghibli"—scientific wonder with organic warmth.

### Color Palette
- **Space Background**: #0a0a1a (deep void), #1a1a3a (cosmic dust)
- **Primary Green**: #22c55e (healthy vegetation), #15803d (deep forest)
- **Water Blue**: #3b82f6 (fresh water), #0ea5e9 (sky)
- **Energy Orange**: #f59e0b (sunlight), #fbbf24 (warm glow)
- **UI Dark**: #0f172a (slate-900), #1e293b (slate-800)
- **UI Light**: #f8fafc (slate-50), #e2e8f0 (slate-200)
- **Accent Purple**: #a855f7 (magic/AI elements)
- **Danger Red**: #ef4444 (endangered/warning)
- **Success Teal**: #14b8a6 (restoration complete)

### Typography
- **Display**: "Fredoka One" (playful, rounded, child-friendly)
- **UI/Body**: "Nunito" (clean, readable, friendly)
- **Mono**: "JetBrains Mono" (stats, numbers)

### Spatial System
- 8px base unit
- Border radius: 12px (cards), 8px (buttons), 9999px (pills)
- Shadows: layered for depth, colored glows for interactive elements

### Motion Philosophy
- Planet rotation: smooth damping, 0.05 lerp factor
- Particles: physics-based with gentle gravity, wind drift
- UI transitions: 200-300ms ease-out
- Celebration effects: 500ms burst with particle spray
- Health bar: smooth animated fill

### Visual Assets
- Icons: Lucide React (consistent stroke weight)
- 3D: Low-poly planet, simple geometric decorations
- Particles: PointsMaterial with custom shaders for glow
- Sprites: SVG icons for toolbar items and species

## Layout & Structure

### Main Layout
```
┌────────────────────────────────────────────────────────────┐
│  Header: Title + Voice Status + Settings                    │
├──────────────┬─────────────────────────┬────────────────────┤
│              │                         │                    │
│  Instructions│    3D Planet Canvas     │   Planet Health    │
│  Panel       │    (React Three Fiber)  │   Panel           │
│              │                         │                    │
│  - Hand      │    - Rotatable sphere   │   - Health %      │
│    gestures  │    - Particle effects   │   - Water bar     │
│  - Controls  │    - Click to restore  │   - Vegetation    │
│  - Tips      │                         │   - Animals       │
│              │                         │   - Cleanliness   │
│              │                         │                    │
│              │                         │   Species Cards   │
│              │                         │   (unlockable)    │
│              │                         │                    │
├──────────────┴─────────────────────────┴────────────────────┤
│  Toolbar: Rain | Sun | Plant | Clean | Animals | Vegetation│
├────────────────────────────────────────────────────────────┤
│  Eco Sound Synth: Mode selector | Volume | Visualizer      │
└────────────────────────────────────────────────────────────┘
```

### Responsive Strategy
- Desktop-first (1200px+): Full three-column layout
- Tablet (768px-1199px): Collapsible side panels
- Mobile (< 768px): Stacked layout with floating toolbar

## Features & Interactions

### 1. Planet Rotation & Zoom
- **Mouse**: Drag to rotate, scroll to zoom (0.8x to 2x)
- **Hand Tracking**: Open palm moves planet rotation
- **Pinch**: Zoom in/out
- **Fallback**: Arrow keys rotate, +/- zoom

### 2. Restoration Actions
Each action has visual feedback and score impact:

| Action | Effect | Visual | Score |
|--------|--------|--------|-------|
| Rain | +Water | Blue particles falling | +5 water |
| Sun | +Energy | Golden glow, warmth rays | +3 energy |
| Plant Seeds | +Vegetation | Sprouts grow from click point | +8 vegetation |
| Clean Trash | +Cleanliness | Trash icons fade away | +10 cleanliness |
| Add Animals | +Animals | Animal icons appear | +6 animals |
| Add Vegetation | +Vegetation | Trees/flowers spread | +4 vegetation |

### 3. Voice Commands
Commands trigger corresponding actions:
- "make it rain" → Rain action
- "add sun" / "sunshine" → Sun action
- "plant trees" / "grow" → Plant Seeds
- "clean trash" / "clean" → Clean Trash
- "add animals" / "animals" → Add Animals
- "more plants" / "vegetation" → Add Vegetation

Visual feedback: Voice indicator pulses when listening, shows transcript

### 4. Particle Interaction System
- 500+ particles surrounding planet
- **Push**: Open palm / mouse drag creates outward wave
- **Pull**: Pinch / click creates inward spiral
- **Wave**: Horizontal hand movement creates horizontal wave
- **Burst**: Double click creates particle explosion

### 5. Eco Sound Synthesizer
Sound layers controlled by vertical position:

| Position | Layer Mix | Filter |
|----------|-----------|--------|
| High (Y > 60%) | Birds 70%, Wind 30% | High-pass 2kHz |
| Mid (30-60%) | Forest 60%, Birds 40% | Band-pass 500Hz-2kHz |
| Low (Y < 30%) | Wind 50%, Drone 40%, Rain 10% | Low-pass 500Hz |

Sound moods (keyboard M to cycle):
- **Dry**: Baseline ambient, minimal layers
- **Rain**: Rain layer at 80%, thunder rumbles
- **Forest**: Full forest, birds, rustling
- **Wildlife**: Animal sounds, movement

### 6. Planet Health System
Base health = average of all categories (0-100)
Categories decay slowly over time (1 point per 30 seconds) to encourage interaction

Thresholds for unlocks:
- **30%**: First endangered species appears
- **60%**: Second endangered species
- **90%**: Third and final endangered species

### 7. Species Discovery Cards
6 species in pool, 3 randomly unlocked at thresholds:

1. **Amur Leopard** (Panthera pardus orientalis)
   - Habitat: Temperate forests of Russian Far East
   - Status: Critically Endangered (~100 left)
   - Threats: Poaching, habitat loss
   - Return reason: Restored forest canopy provides hunting grounds

2. **California Condor** (Gymnogyps californianus)
   - Habitat: Rocky shrubland, beaches
   - Status: Critically Endangered (~500 left)
   - Threats: Lead poisoning, habitat loss
   - Return reason: Clean skies and reduced human disturbance

3. **Monarch Butterfly** (Danaus plexippus)
   - Habitat: Milkweed fields, forest overwintering sites
   - Status: Endangered
   - Threats: Pesticides, habitat loss, climate change
   - Return reason: Abundant milkweed and flowering plants

4. **Sea Otter** (Enhydra lutris)
   - Habitat: Coastal waters, kelp forests
   - Status: Threatened
   - Threats: Oil spills, entanglement, food scarcity
   - Return reason: Clean water and restored kelp forests

5. **Red Panda** (Ailurus fulgens)
   - Habitat: Temperate forests with bamboo
   - Status: Endangered
   - Threats: Habitat loss, poaching, inbreeding
   - Return reason: Dense bamboo forests and cool climate restored

6. **Axolotl** (Ambystoma mexicanum)
   - Habitat: Xochimilco canals, Mexico
   - Status: Critically Endangered
   - Threats: Water pollution, invasive species
   - Return reason: Clean water channels and native vegetation

Each card includes a reflection question for students.

### 8. AI Guide "Eco"
A friendly floating character that provides contextual feedback:
- Appears after actions with encouraging messages
- Explains ecological connections
- Celebrates milestones
- Uses randomized responses for variety

## Component Inventory

### PlanetCanvas
- States: loading, ready, error
- Contains: Sphere, decorations, click handler
- Props: onAction, selectedTool, healthLevel

### ParticleField
- States: idle (gentle drift), active (user interaction), celebration (burst)
- Custom shader for glow effect
- Physics simulation

### ToolbarButton
- States: default, hover, active/selected, disabled
- Icon + label
- Keyboard shortcut hint
- Tooltip on hover

### HealthPanel
- Animated progress bars for each category
- Overall health percentage with glow
- Unlock indicators

### SpeciesCard
- States: locked (greyed silhouette), unlocked (full reveal with animation)
- Flip animation on reveal
- Contains all species data

### VoiceIndicator
- States: inactive, listening (pulsing), recognized (checkmark), error
- Shows transcript of last command
- Toggle button

### SoundSynthPanel
- Mode selector buttons
- Vertical position visualizer
- Layer activity indicators
- Volume slider

### AIGuideBubble
- Speech bubble with message
- Fade in/out animation
- Close button
- Connection line to guide avatar

### InstructionsPanel
- Collapsible accordion
- Icons for each interaction type
- Keyboard shortcuts listed

## Technical Approach

### Framework & Libraries
- **React 18** with TypeScript
- **Vite** for bundling
- **React Three Fiber** (@react-three/fiber)
- **Drei** (@react-three/drei) for helpers
- **Tailwind CSS** for styling
- **Web Speech API** for voice commands
- **Web Audio API** for sound synthesis

### State Management
- React Context for global state (health, selected tool, sound settings)
- useState/useReducer for local component state
- Zustand optional for complex interactions

### Key Architecture
```
src/
├── components/
│   ├── Planet/
│   │   ├── PlanetCanvas.tsx
│   │   ├── PlanetMesh.tsx
│   │   ├── Decorations.tsx
│   │   └── styles.css
│   ├── Particles/
│   │   ├── ParticleField.tsx
│   │   └── ParticleEffect.tsx
│   ├── UI/
│   │   ├── Toolbar.tsx
│   │   ├── HealthPanel.tsx
│   │   ├── SpeciesCard.tsx
│   │   ├── InstructionsPanel.tsx
│   │   └── AIGuide.tsx
│   ├── Audio/
│   │   └── SoundSynth.tsx
│   └── Voice/
│       └── VoiceControl.tsx
├── hooks/
│   ├── usePlanetHealth.ts
│   ├── useVoiceCommands.ts
│   ├── useHandTracking.ts
│   └── useAudioSynth.ts
├── contexts/
│   └── PlanetContext.tsx
├── data/
│   └── species.ts
├── utils/
│   └── helpers.ts
├── App.tsx
├── main.tsx
└── index.css
```

### Performance Considerations
- Particle count capped at 1000
- Instanced meshes for repeated elements
- RequestAnimationFrame for smooth animations
- Debounced voice recognition
- Lazy load species images

### Accessibility
- Full keyboard navigation (Tab, Enter, Escape, arrow keys)
- ARIA labels on all interactive elements
- Screen reader announcements for state changes
- High contrast mode support
- Reduced motion preference respected
