# Widget Component Specifications

## Overview

This document provides detailed specifications for PixelOffice widget components used across the platform.

## 1. Agent Avatar Widget

### Purpose
Display AI agent representation with pixel sprite and current state.

### Visual Design
```
┌─────────────┐
│   ┌─────┐   │
│   │ 👓  │   │  32x32px sprite
│   └─────┘   │
│  [Idle]     │  State label
│  Code Review │  Role label
└─────────────┘
```

### Component API

```typescript
interface AgentAvatarProps {
  agent: {
    id: string;
    name: string;
    type: 'reviewer' | 'architect' | 'hunter' | 'tester' | 'deployer';
    state: 'idle' | 'active' | 'success' | 'error' | 'blocked';
    currentTask?: string;
  };
  size?: 'sm' | 'md' | 'lg';  // 24px, 32px, 64px
  showLabel?: boolean;
  showState?: boolean;
  interactive?: boolean;
  onClick?: (agentId: string) => void;
  onHover?: (agentId: string) => void;
}
```

### States

| State | Indicator | Animation | Color |
|-------|-----------|-----------|-------|
| idle | Green dot | Breathing | #94a3b8 |
| active | Blue pulse | Working | #3b82f6 |
| success | Green check | Celebrate | #10b981 |
| error | Red X | Shake | #ef4444 |
| blocked | Orange ! | Question | #f97316 |

### Interactions

- **Click**: Open agent detail panel
- **Hover**: Show tooltip with current task
- **Right-click**: Context menu (assign task, chat, view history)

### Accessibility

```html
<div
  role="button"
  aria-label="Code Reviewer agent, currently idle, click to interact"
  tabindex="0"
>
  <!-- Avatar content -->
</div>
```

## 2. Task Card Widget

### Purpose
Display project tasks with quest-inspired presentation.

### Visual Design

```
┌─────────────────────────────────────────┐
│ ⚔️ [EPIC] Implement Authentication      │
├─────────────────────────────────────────┤
│ Level: ⭐⭐⭐⭐ Epic                     │
│ XP: 200 points                          │
│                                         │
│ Implement JWT-based authentication with │
│ OAuth integration and session mgmt...   │
│                                         │
│ 👓 Assigned: Code Reviewer              │
│ Status: [████████░░] 80% Complete       │
│                                         │
│ [Details] [Chat] [Update]               │
└─────────────────────────────────────────┘
```

### Component API

```typescript
interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'epic';
    xpReward: number;
    status: 'open' | 'claimed' | 'in_progress' | 'review' | 'blocked' | 'completed';
    progress?: number;  // 0-100
    assignedAgents: string[];
    dueDate?: Date;
    tags?: string[];
  };
  variant?: 'compact' | 'expanded' | 'mini';
  draggable?: boolean;
  onAction?: (action: 'view' | 'chat' | 'update' | 'assign') => void;
  onDragStart?: (taskId: string) => void;
}
```

### Variants

#### Compact (List View)
- Single line with essential info
- Icon + Title + Status + XP
- 60px height

#### Expanded (Detail View)
- Full card with all details
- Description visible
- Action buttons
- 200px+ height

#### Mini (Dashboard Widget)
- Minimal info
- Icon + Title only
- 40px height

### Level Indicators

```typescript
const levelIcons = {
  beginner: '⭐',
  intermediate: '⭐⭐',
  advanced: '⭐⭐⭐',
  epic: '⭐⭐⭐⭐'
};

const levelColors = {
  beginner: '#10b981',    // Green
  intermediate: '#3b82f6', // Blue
  advanced: '#f59e0b',    // Amber
  epic: '#8b5cf6'         // Purple
};
```

## 3. Progress Bar Widget

### Purpose
Visualize XP, task completion, or other progress metrics.

### Visual Design

#### Linear Variant
```
Level 3 Developer
[████████████████████████░░░░░░░░░░░░░░] 842/1000 XP
```

#### Radial Variant
```
     ░░█████░░
   ░░█████████░░
  ░░███    ████░░
  ░██  80%   ██░
  ░░███    ████░░
   ░░█████████░░
     ░░█████░░
```

#### Stepped Variant
```
●━━━●━━━●━━━○━━━○  Milestone 3 of 5
```

### Component API

```typescript
interface ProgressBarProps {
  current: number;
  total: number;
  variant?: 'linear' | 'radial' | 'stepped';
  label?: string;
  showPercentage?: boolean;
  showValues?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  milestones?: Array<{
    value: number;
    label: string;
  }>;
}
```

### Animations

- Smooth fill transition (300ms ease-out)
- Pulse on milestone reached
- Sparkle effect on completion

## 4. Notification Toast Widget

### Purpose
Display temporary messages and agent communications.

### Visual Design

```
┌────────────────────────────────────────┐
│ 👓 Code Reviewer                [×]    │
├────────────────────────────────────────┤
│ I've found 3 potential issues in       │
│ authentication.ts. Would you like      │
│ me to create a detailed report?        │
│                                        │
│ [View Issues] [Dismiss]                │
└────────────────────────────────────────┘
```

### Component API

```typescript
interface ToastProps {
  type: 'info' | 'success' | 'warning' | 'error' | 'agent';
  title: string;
  message: string;
  agentId?: string;
  duration?: number;  // Auto-dismiss after ms (0 = persistent)
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}
```

### Toast Types

| Type | Icon | Color | Default Duration |
|------|------|-------|------------------|
| info | ℹ️ | Blue | 5000ms |
| success | ✅ | Green | 5000ms |
| warning | ⚠️ | Amber | 8000ms |
| error | ❌ | Red | 0 (persistent) |
| agent | 🤖 | Agent color | 10000ms |

### Positioning

```
Screen Layout:
┌─────────────────────────────┐
│ [top-center]                │
│                [top-right]  │
│                             │
│                             │
│ [bottom-center]             │
│             [bottom-right]  │
└─────────────────────────────┘
```

### Stack Behavior

- Max 3 toasts visible
- Older toasts dismissed automatically
- Pause auto-dismiss on hover
- Stack from bottom up (newest at bottom)

## 5. Command Palette Widget

### Purpose
Quick access to actions, navigation, and agent interactions.

### Visual Design

```
┌──────────────────────────────────────────┐
│ 🔍 Type a command or search...           │
├──────────────────────────────────────────┤
│ Recent                                   │
│ ► View Dashboard                         │
│ ► Open Task #42                          │
│ ► Chat with Bug Hunter              Cmd+B│
│                                          │
│ Actions                                  │
│ ► Create New Task                   Cmd+N│
│ ► Assign Agent                      Cmd+A│
│ ► Deploy to Staging                      │
│                                          │
│ Agents                                   │
│ ► 👓 Code Reviewer - Ask a question     │
│ ► 📐 Architecture Guide - Get advice    │
└──────────────────────────────────────────┘
```

### Component API

```typescript
interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandGroup[];
  recentCommands: Command[];
  onExecute: (commandId: string) => void;
  placeholder?: string;
  maxResults?: number;
}

interface CommandGroup {
  id: string;
  label: string;
  commands: Command[];
}

interface Command {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  category?: string;
  action: () => void;
  keywords?: string[];  // For search matching
}
```

### Features

- **Fuzzy Search**: Match commands by keywords
- **Keyboard Navigation**: Arrow keys + Enter
- **Categories**: Recent, Actions, Navigation, Agents
- **Shortcuts**: Display keyboard shortcuts
- **Agent Quick Chat**: Type `@agent` to chat

### Keyboard Shortcuts

```
Cmd/Ctrl + K    → Open palette
Escape          → Close palette
Arrow Up/Down   → Navigate results
Enter           → Execute selected
Tab             → Switch categories
Backspace       → Clear search
```

### Search Patterns

```
"task"          → Search all commands
"@code"         → Filter to Code Reviewer agent
"#42"           → Jump to task #42
"/deploy"       → Filter to deployment commands
```

## 6. Agent Status Panel Widget

### Purpose
Display comprehensive agent status and activity.

### Visual Design

```
┌────────────────────────────────────────┐
│ 👓 Code Reviewer                       │
├────────────────────────────────────────┤
│ Status: Active                         │
│ Current Task: Reviewing PR #123        │
│ Progress: [████████░░] 80%             │
│                                        │
│ Recent Activity:                       │
│ • Completed code review      2m ago    │
│ • Found 3 issues             5m ago    │
│ • Started new review         10m ago   │
│                                        │
│ Stats Today:                           │
│ Tasks Completed: 5                     │
│ Issues Found: 12                       │
│ Lines Reviewed: 1,234                  │
│                                        │
│ [Chat] [Assign Task] [View History]   │
└────────────────────────────────────────┘
```

### Component API

```typescript
interface AgentStatusPanelProps {
  agent: {
    id: string;
    name: string;
    type: AgentType;
    state: AgentState;
    currentTask?: Task;
    recentActivity: Activity[];
    stats: AgentStats;
  };
  showActivity?: boolean;
  showStats?: boolean;
  onAction?: (action: 'chat' | 'assign' | 'history') => void;
}

interface AgentStats {
  tasksCompletedToday: number;
  issuesFound: number;
  linesReviewed: number;
  averageCompletionTime: number;
}
```

## 7. Project Health Dashboard Widget

### Purpose
Display overall project health metrics.

### Visual Design

```
┌────────────────────────────────────────┐
│ Project Health: MyApp                  │
├────────────────────────────────────────┤
│ Overall: ●●●●○ 82%                    │
│                                        │
│ Code Quality    ●●●●● 95%  ✅         │
│ Test Coverage   ●●●●○ 78%  ⚠️         │
│ Documentation   ●●●○○ 60%  ⚠️         │
│ Performance     ●●●●● 92%  ✅         │
│ Security        ●●●●● 100% ✅         │
│                                        │
│ Active Issues: 3  │  Open PRs: 2      │
│ Last Deploy: 2h ago                    │
│                                        │
│ [View Details] [Run Checks]            │
└────────────────────────────────────────┘
```

### Component API

```typescript
interface ProjectHealthProps {
  project: {
    id: string;
    name: string;
    overallHealth: number;
    metrics: HealthMetric[];
    issues: {
      active: number;
      critical: number;
    };
    pullRequests: {
      open: number;
      needsReview: number;
    };
    lastDeploy?: Date;
  };
  onViewDetails?: () => void;
  onRunChecks?: () => void;
}

interface HealthMetric {
  id: string;
  label: string;
  value: number;  // 0-100
  status: 'good' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
}
```

### Health Indicators

- **●●●●● (90-100%)**: Excellent (green)
- **●●●●○ (75-89%)**: Good (blue)
- **●●●○○ (50-74%)**: Needs attention (amber)
- **●●○○○ (25-49%)**: Poor (orange)
- **●○○○○ (0-24%)**: Critical (red)

## 8. Activity Feed Widget

### Purpose
Real-time stream of project activity.

### Visual Design

```
┌────────────────────────────────────────┐
│ Activity Feed                      [•] │
├────────────────────────────────────────┤
│ 👓 reviewed PR #123            2m ago  │
│ 🔍 found bug in auth.ts        5m ago  │
│ ✅ completed test suite        10m ago │
│ 📐 updated system design       15m ago │
│ ⚓ deployed to staging          1h ago  │
│ 👓 opened new PR #124           2h ago │
│                                        │
│ [Load More] [Filter]                   │
└────────────────────────────────────────┘
```

### Component API

```typescript
interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
  showTimestamps?: boolean;
  showAgentAvatars?: boolean;
  filter?: {
    agentTypes?: AgentType[];
    activityTypes?: ActivityType[];
  };
  onLoadMore?: () => void;
  onFilterChange?: (filter: ActivityFilter) => void;
}

interface Activity {
  id: string;
  agentId: string;
  agentType: AgentType;
  type: ActivityType;
  description: string;
  timestamp: Date;
  relatedId?: string;  // PR #, Issue #, etc.
}

type ActivityType =
  | 'task_completed'
  | 'pr_opened'
  | 'pr_reviewed'
  | 'issue_found'
  | 'deployment'
  | 'test_run'
  | 'code_committed';
```

### Real-time Updates

- Live indicator (•) shows active connection
- New activities animate in from top
- Auto-scroll when user at top
- Pause updates when user scrolling
- Highlight new items briefly

## Common Patterns

### Loading States

All widgets should show skeleton loading:

```
┌────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░                       │
│ ░░░░░░░ ░░░░░░░░░░                    │
│ ░░░░░░░░░░░░                          │
└────────────────────────────────────────┘
```

### Empty States

```
┌────────────────────────────────────────┐
│           📋                           │
│     No tasks yet                       │
│  Create your first task to get started │
│                                        │
│       [Create Task]                    │
└────────────────────────────────────────┘
```

### Error States

```
┌────────────────────────────────────────┐
│           ⚠️                           │
│   Failed to load widget                │
│  Check your connection and try again   │
│                                        │
│       [Retry] [Dismiss]                │
└────────────────────────────────────────┘
```

## Implementation Guidelines

### React Component Structure

```typescript
// Widget.tsx
export function Widget({ ...props }: WidgetProps) {
  const [state, setState] = useState();

  // Loading state
  if (isLoading) {
    return <WidgetSkeleton />;
  }

  // Error state
  if (error) {
    return <WidgetError error={error} onRetry={refetch} />;
  }

  // Empty state
  if (isEmpty) {
    return <WidgetEmpty />;
  }

  // Main content
  return (
    <div className="widget">
      {/* Widget content */}
    </div>
  );
}
```

### Styling

- Use design tokens from design system
- Implement with CSS Modules or Tailwind
- Support light/dark themes
- Ensure responsive behavior
- Add hover/focus states

### Testing

Each widget should have:
- Unit tests for logic
- Component tests for rendering
- Interaction tests for user actions
- Visual regression tests
- Accessibility tests

---

**Version:** 1.0.0
**Last Updated:** 2026-05-11
**Maintainers:** Frontend Team
