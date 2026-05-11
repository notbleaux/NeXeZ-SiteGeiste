# PixelOffice Design System

## Overview

The PixelOffice Design System provides a cohesive visual language that combines professional development tooling with approachable pixel art aesthetics. This system ensures consistency across the WebApp, Website, and Browser Extension.

## Design Philosophy

### Core Principles

1. **Professional, Not Childish**: Pixel sprites enhance comprehension without sacrificing tooling quality
2. **Purposeful Metaphors**: Every visual element maps to real project management concepts
3. **Visible Work**: Clear visual indicators of agent state, task progress, and project health
4. **Progressive Disclosure**: Simple interface for beginners, advanced controls for experts
5. **Human Authority**: Always clear that humans own final decisions

## Design Tokens

### Color Palette

#### Primary Colors
```css
--color-primary-50: #f0f9ff;
--color-primary-100: #e0f2fe;
--color-primary-200: #bae6fd;
--color-primary-300: #7dd3fc;
--color-primary-400: #38bdf8;
--color-primary-500: #0ea5e9;  /* Main brand color */
--color-primary-600: #0284c7;
--color-primary-700: #0369a1;
--color-primary-800: #075985;
--color-primary-900: #0c4a6e;
```

#### Agent Role Colors
```css
--color-agent-reviewer: #8b5cf6;     /* Purple - Code Reviewer */
--color-agent-architect: #3b82f6;    /* Blue - Architecture Guide */
--color-agent-hunter: #f59e0b;       /* Amber - Bug Hunter */
--color-agent-tester: #10b981;       /* Green - Test Generator */
--color-agent-deployer: #ef4444;     /* Red - Deployment Manager */
```

#### State Colors
```css
--color-state-idle: #94a3b8;         /* Slate - Available */
--color-state-active: #3b82f6;       /* Blue - Working */
--color-state-success: #10b981;      /* Green - Complete */
--color-state-warning: #f59e0b;      /* Amber - Needs attention */
--color-state-error: #ef4444;        /* Red - Error/Failed */
--color-state-blocked: #f97316;      /* Orange - Blocked */
```

#### Neutral Colors
```css
--color-gray-50: #f8fafc;
--color-gray-100: #f1f5f9;
--color-gray-200: #e2e8f0;
--color-gray-300: #cbd5e1;
--color-gray-400: #94a3b8;
--color-gray-500: #64748b;
--color-gray-600: #475569;
--color-gray-700: #334155;
--color-gray-800: #1e293b;
--color-gray-900: #0f172a;
```

### Typography

#### Font Families
```css
--font-primary: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
--font-pixel: 'Press Start 2P', monospace;  /* For pixel UI elements */
```

#### Font Sizes
```css
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
```

#### Font Weights
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing Scale
```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### Border Radius
```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-full: 9999px;
```

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-pixel: 2px 2px 0 0 rgba(0, 0, 0, 0.25);  /* For pixel art elements */
```

### Animation Timings
```css
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;

--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

## Component Patterns

### Agent Avatar

Display AI agent with pixel sprite and state indicator.

**Variants:**
- Small (32x32px)
- Medium (64x64px)
- Large (128x128px)

**States:**
- Idle (subtle breathing animation)
- Active (working animation)
- Success (celebration animation)
- Error (alert animation)
- Blocked (question mark overlay)

**Props:**
```typescript
interface AgentAvatarProps {
  agentId: string;
  agentType: 'reviewer' | 'architect' | 'hunter' | 'tester' | 'deployer';
  state: 'idle' | 'active' | 'success' | 'error' | 'blocked';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onClick?: () => void;
}
```

### Task Card

Display project tasks with quest-like presentation.

**Variants:**
- Compact (list view)
- Expanded (detail view)
- Mini (dashboard widget)

**Elements:**
- Title and description
- Quest level indicator
- XP reward badge
- Assigned agent avatar(s)
- Status indicator
- Action buttons

**Props:**
```typescript
interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'epic';
    xpReward: number;
    status: 'open' | 'in_progress' | 'review' | 'completed';
    assignedAgents: string[];
  };
  variant?: 'compact' | 'expanded' | 'mini';
  onAction?: (action: string) => void;
}
```

### Progress Bar

Visualize XP, task completion, or other metrics.

**Variants:**
- Linear (horizontal bar)
- Radial (circular progress)
- Stepped (milestone markers)

**Props:**
```typescript
interface ProgressBarProps {
  current: number;
  total: number;
  variant?: 'linear' | 'radial' | 'stepped';
  label?: string;
  showPercentage?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}
```

### Command Palette

Quick access to actions and navigation.

**Features:**
- Fuzzy search
- Keyboard shortcuts
- Recent actions
- Agent quick prompts
- Context-aware suggestions

**Shortcut:** `Cmd/Ctrl + K`

### Notification Toast

Display system messages and agent communications.

**Types:**
- Info (blue)
- Success (green)
- Warning (amber)
- Error (red)
- Agent message (agent color)

**Props:**
```typescript
interface ToastProps {
  type: 'info' | 'success' | 'warning' | 'error' | 'agent';
  title: string;
  message: string;
  agentId?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

## Pixel Sprite Guidelines

### Sprite Specifications

- **Base Size:** 32x32px (scales to 64x64, 128x128)
- **Color Palette:** Max 16 colors per sprite
- **Animation:** 4-8 frames at 200ms per frame
- **Style:** Outlined with 1px black border
- **Export:** PNG with transparency

### Agent Sprite Types

Each agent type has distinct visual characteristics:

1. **Code Reviewer** 👓
   - Glasses accessory
   - Clipboard in hand
   - Purple accent color

2. **Architecture Guide** 📐
   - Blueprint/ruler prop
   - Thoughtful pose
   - Blue accent color

3. **Bug Hunter** 🔍
   - Magnifying glass
   - Detective hat
   - Amber accent color

4. **Test Generator** ✅
   - Checklist clipboard
   - Testing goggles
   - Green accent color

5. **Deployment Manager** ⚓
   - Ship captain hat
   - Control panel
   - Red accent color

### Sprite State Animations

#### Idle State
- Subtle bobbing (2px up/down)
- Occasional blink
- 2-frame loop

#### Working State
- Typing animation (for code tasks)
- Tool interaction (for specific tasks)
- 4-frame loop

#### Success State
- Jump animation
- Sparkle effects
- 6-frame sequence (plays once)

#### Error State
- Shake animation
- Question mark appears
- 4-frame sequence

#### Blocked State
- Stop sign appears
- Character looks confused
- Static with overlay

## Layout Patterns

### PixelOffice Workspace

Main workspace layout with simulated office environment.

**Grid Structure:**
```
┌──────────────────────────────────────────┐
│  Header (Navigation + User Menu)         │
├───────┬──────────────────────────────────┤
│       │  Workspace Area                  │
│ Side  │  ┌────────────────────────────┐ │
│ Panel │  │  Agent Desks (Grid/List)   │ │
│       │  │  ┌───┐ ┌───┐ ┌───┐ ┌───┐  │ │
│ Agent │  │  │ 👓│ │ 📐│ │ 🔍│ │ ✅ │  │ │
│ Roster│  │  └───┘ └───┘ └───┘ └───┘  │ │
│       │  │                            │ │
│ Task  │  │  Task Board / Dashboard    │ │
│ Queue │  └────────────────────────────┘ │
└───────┴──────────────────────────────────┘
```

### Dashboard Layout

Information-dense overview with widgets.

**Widget Grid:**
- 12-column responsive grid
- Widgets span 3-12 columns
- Draggable/customizable (future)

**Key Widgets:**
- Agent status panel (3 col)
- Active tasks (6 col)
- XP progress (3 col)
- Recent activity (6 col)
- Project health (6 col)

## Interaction Patterns

### Agent Interaction

**Click Agent Avatar:**
- Show agent details panel
- Display current task
- Offer quick actions

**Hover Agent:**
- Show tooltip with name and state
- Highlight related tasks
- Display recent activity

### Task Interaction

**Click Task Card:**
- Expand details
- Show sub-tasks
- Display related PRs/issues

**Drag Task:**
- Move between status columns
- Assign to different agents
- Update priority

### Keyboard Shortcuts

```
Cmd/Ctrl + K     → Open command palette
Cmd/Ctrl + /     → Toggle keyboard shortcuts help
Cmd/Ctrl + B     → Toggle sidebar
Cmd/Ctrl + ,     → Open settings
Esc              → Close modals/panels
?                → Show help
```

## Responsive Behavior

### Breakpoints
```css
--screen-sm: 640px;   /* Mobile landscape */
--screen-md: 768px;   /* Tablet */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Large desktop */
--screen-2xl: 1536px; /* Extra large */
```

### Mobile Adaptations

- Single column layout
- Bottom navigation bar
- Collapsible agent roster
- Simplified pixel sprites (24x24px)
- Touch-optimized hit targets (44px min)

## Accessibility

### Requirements

- WCAG 2.1 Level AA compliance
- Keyboard navigation for all interactions
- Screen reader support
- High contrast mode support
- Reduced motion respect
- Focus indicators on all interactive elements

### Color Contrast

All text must meet minimum contrast ratios:
- Normal text: 4.5:1
- Large text (18pt+): 3:1
- UI components: 3:1

### ARIA Labels

All interactive elements and dynamic content must have appropriate ARIA labels:
```html
<button aria-label="Assign task to Code Reviewer agent">
  <AgentAvatar type="reviewer" />
</button>
```

## Dark Mode

Full dark mode support with adjusted color palette:

```css
/* Dark mode overrides */
--bg-primary: #0f172a;
--bg-secondary: #1e293b;
--text-primary: #f1f5f9;
--text-secondary: #cbd5e1;
```

### Sprite Adjustments

- Increased outline contrast
- Lighter accent colors
- Subtle glow effects on active states

## Implementation Guidelines

### CSS-in-JS vs CSS Modules

- **Use CSS Modules** for component-specific styles
- **Use CSS-in-JS** (styled-components/emotion) for dynamic theming
- **Use Tailwind** for utility classes and rapid prototyping

### Component Structure

```typescript
// ComponentName.tsx
import styles from './ComponentName.module.css';

export interface ComponentNameProps {
  // Props
}

export function ComponentName(props: ComponentNameProps) {
  return (
    <div className={styles.container}>
      {/* Component content */}
    </div>
  );
}
```

### Performance Considerations

- Lazy load sprite animations
- Use CSS transforms for animations (GPU accelerated)
- Implement virtualization for long lists
- Optimize sprite sheet loading
- Cache API responses

## Design Tools

### Recommended Tools

- **Figma**: UI design and prototyping
- **Aseprite**: Pixel art creation and animation
- **Storybook**: Component documentation and testing
- **Chromatic**: Visual regression testing

### Design File Structure

```
design/
├── tokens.json          # Design tokens export
├── components/          # Component specs
├── sprites/            # Pixel sprite sources
│   ├── agents/
│   ├── ui-elements/
│   └── animations/
└── mockups/            # Full page designs
```

## Resources

- [Design Tokens Repository](../packages/shared/design-tokens/)
- [Component Library](../packages/shared/ui/)
- [Sprite Assets](../assets/sprites/)
- [Figma Design Files](#) (Coming soon)
- [Storybook Documentation](#) (Coming soon)

---

**Version:** 1.0.0
**Last Updated:** 2026-05-11
**Maintainers:** Design Team
