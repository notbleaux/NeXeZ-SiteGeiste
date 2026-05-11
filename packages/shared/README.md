# Shared Packages

Common code reused across all NeXeZ SiteGeiste applications.

## Packages

- **types**: TypeScript type definitions and interfaces
- **utils**: Utility functions and helpers
- **ai-client**: AI service integration library
- **pixel-sprites**: Pixel art sprite system
- **game-engine**: Gamification engine core

## Usage

Import shared packages in your application:

```typescript
import { User, Quest } from '@nexez/types';
import { formatXP, calculateLevel } from '@nexez/utils';
import { AIClient } from '@nexez/ai-client';
```

## Development

Each package has its own package.json and can be developed independently.

```bash
# Install dependencies
pnpm install

# Build all shared packages
pnpm --filter './packages/shared/**' build

# Test all shared packages
pnpm --filter './packages/shared/**' test
```
