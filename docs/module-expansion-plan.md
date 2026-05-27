# Module Expansion & RAT-OS Integration Plan

## Current State
- **Active Modules**: Welcome, Focus
- **Coming Soon**: Tasks, Soundscapes, Blocker, Writing, Brain Train, PolyCo
- **Workspaces**: Home, RAT-OS, ZeSporteXte, NueVue, Settings

## Phase 1: Implement Core RAT-OS Modules

### 1. Tasks Module (@njz-os/progression integration)
- Wire to progression API for XP/level tracking
- Task CRUD with localStorage persistence
- Priority matrix (Eisenhower)

### 2. Soundscapes Module (@njz-os/audio-engine integration)
- Use Soundscape interface from audio-engine
- Player controls (play/pause/volume)
- Category filtering

### 3. Writing Module (@njz-os/writing integration)
- Manuscript editor interface
- Export capabilities
- Word count / streak tracking

### 4. Blocker Module (@njz-os/focus-engine integration)
- Distraction site blocking
- Session-based rules
- Integration with focus sessions

### 5. Brain Train Module (@njz-os/learning-cards integration)
- Flashcard system
- Spaced repetition
- Cognitive games

### 6. PolyCo Module (@njz-os/polyworld integration)
- Pixel avatar system
- World navigation
- Social presence

## Phase 2: Settings & Account Modules

### Settings Module
- Theme preferences
- Notification settings
- API key management
- Workspace customization

### Account Module
- Profile display
- Stats dashboard
- Achievement badges

## Implementation Order

1. Tasks (highest utility)
2. Settings (enables customization)
3. Soundscapes (RAT-OS audio-engine)
4. Writing (RAT-OS writing)
5. Blocker (RAT-OS focus-engine)
6. Brain Train (RAT-OS learning-cards)
7. PolyCo (RAT-OS polyworld)
