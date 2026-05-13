# @nexez/design-tokens

PixelOffice design tokens for consistent theming across all NeXeZ SiteGeiste applications.

## Installation

```bash
pnpm add @nexez/design-tokens
```

## Usage

```typescript
import { theme, colors, agentConfig } from '@nexez/design-tokens';

// Use theme colors
const primaryColor = theme.colors.primary[500];

// Use agent colors
const reviewerColor = theme.colors.agent.reviewer;

// Access agent configuration
const codeReviewer = agentConfig.reviewer;
console.log(codeReviewer.name); // "Code Reviewer"
console.log(codeReviewer.icon); // "👓"
```

## Design Tokens

### Colors
- Primary brand colors
- Agent role colors
- State colors
- Neutral grays
- Semantic colors

### Typography
- Font families (primary, mono, pixel)
- Font sizes
- Font weights
- Line heights

### Spacing
- Consistent spacing scale (0-20)

### Other Tokens
- Border radius
- Shadows
- Animations
- Breakpoints
- Z-index layers

## Agent Configuration

Pre-configured agent types with colors, icons, and roles:
- Code Reviewer (👓)
- Architecture Guide (📐)
- Bug Hunter (🔍)
- Test Generator (✅)
- Deployment Manager (⚓)

## Quest Levels

Quest difficulty levels with icons and XP multipliers:
- Beginner (⭐)
- Intermediate (⭐⭐)
- Advanced (⭐⭐⭐)
- Epic (⭐⭐⭐⭐)

## TypeScript Support

Full TypeScript support with exported types:
```typescript
import type { Theme, AgentType, QuestLevel, AgentState } from '@nexez/design-tokens';
```
