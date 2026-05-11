# Coding Standards & Best Practices

Consistent code is happy code! Let's explore the standards that keep our codebase clean and maintainable. ✨

## 🎯 General Principles

### The Four Pillars

1. **Readability**: Code is read more than written
2. **Consistency**: Follow established patterns
3. **Simplicity**: Prefer simple over clever
4. **Maintainability**: Think of future developers

### Code Philosophy

- **YAGNI** (You Aren't Gonna Need It): Don't add unnecessary features
- **DRY** (Don't Repeat Yourself): Extract reusable code
- **KISS** (Keep It Simple, Stupid): Simple solutions are better
- **SOLID** Principles: Write maintainable OOP code

## 📝 TypeScript Standards

### Always Use Types

```typescript
// ❌ Bad
function calculateXP(contributions) {
  return contributions * 10;
}

// ✅ Good
function calculateXP(contributions: number): number {
  return contributions * 10;
}
```

### Prefer Interfaces for Objects

```typescript
// ❌ Bad
type User = {
  id: string;
  name: string;
};

// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}
```

### Use Enums for Constants

```typescript
// ✅ Good
enum UserLevel {
  Explorer = 1,
  Apprentice = 2,
  Developer = 3,
  Senior = 4,
  Manager = 5,
}
```

### Avoid `any`

```typescript
// ❌ Bad
function processData(data: any) {
  // ...
}

// ✅ Good
function processData(data: UserData) {
  // ...
}

// ✅ Also Good (when truly generic)
function processData<T>(data: T): T {
  // ...
}
```

## ⚛️ React Standards

### Functional Components Only

```typescript
// ❌ Bad
class MyComponent extends React.Component {
  render() {
    return <div>Hello</div>;
  }
}

// ✅ Good
export function MyComponent() {
  return <div>Hello</div>;
}
```

### Custom Hooks for Logic

```typescript
// ✅ Good
function useUserXP(userId: string) {
  const [xp, setXP] = useState(0);
  
  useEffect(() => {
    fetchUserXP(userId).then(setXP);
  }, [userId]);
  
  return xp;
}
```

### Props Interface

```typescript
// ✅ Good
interface AvatarProps {
  userId: string;
  size?: 'small' | 'medium' | 'large';
  showLevel?: boolean;
}

export function Avatar({ 
  userId, 
  size = 'medium', 
  showLevel = true 
}: AvatarProps) {
  // ...
}
```

### Component Organization

```typescript
// File structure within component
// 1. Imports
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';

// 2. Types/Interfaces
interface MyComponentProps {
  // ...
}

// 3. Constants
const MAX_RETRIES = 3;

// 4. Component
export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // 4a. Hooks
  const [state, setState] = useState();
  
  // 4b. Derived state
  const derivedValue = useMemo(() => {}, []);
  
  // 4c. Effects
  useEffect(() => {}, []);
  
  // 4d. Event handlers
  const handleClick = () => {};
  
  // 4e. Render helpers
  const renderContent = () => {};
  
  // 4f. Return JSX
  return <div>{/* ... */}</div>;
}
```

## 🎨 Styling Standards

### Tailwind CSS Usage

```typescript
// ✅ Good: Use Tailwind utilities
<div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
  <Avatar />
  <span className="text-lg font-semibold">User Name</span>
</div>

// ✅ Good: Extract complex styles to components
<Card className="shadow-md">
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### CSS Modules for Custom Styles

```typescript
// styles.module.css
.pixelSprite {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

// Component
import styles from './styles.module.css';

<img src={sprite} className={styles.pixelSprite} />
```

## 🔧 Backend Standards

### RESTful API Design

```typescript
// ✅ Good
GET    /api/users          // List users
GET    /api/users/:id      // Get user
POST   /api/users          // Create user
PUT    /api/users/:id      // Update user
DELETE /api/users/:id      // Delete user
```

### Error Handling

```typescript
// ✅ Good
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  logger.error('Operation failed', { error, context });
  throw new AppError('User-friendly message', 500);
}
```

### Validation

```typescript
// ✅ Good: Use validation libraries
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
  level: z.enum(['Explorer', 'Apprentice', 'Developer']),
});

// Validate incoming data
const validatedData = UserSchema.parse(requestBody);
```

## 📁 File Naming Conventions

```
components/        → UserAvatar.tsx (PascalCase)
hooks/            → useUserXP.ts (camelCase with 'use' prefix)
utils/            → formatXP.ts (camelCase)
types/            → user.types.ts (camelCase with .types suffix)
constants/        → levels.constants.ts (camelCase with .constants suffix)
services/         → userService.ts (camelCase with Service suffix)
```

## 📚 Documentation Standards

### JSDoc for Public APIs

```typescript
/**
 * Calculates the XP required to reach the next level
 * 
 * @param currentLevel - The user's current level (1-5)
 * @param currentXP - The user's current XP points
 * @returns The XP needed to level up
 * @throws {Error} If level is out of valid range
 * 
 * @example
 * ```ts
 * const xpNeeded = calculateXPToNextLevel(3, 1500);
 * console.log(xpNeeded); // 500
 * ```
 */
export function calculateXPToNextLevel(
  currentLevel: number,
  currentXP: number
): number {
  // Implementation
}
```

### README for Each Package

Every package should have a README with:
- Purpose and overview
- Installation instructions
- Usage examples
- API documentation
- Contributing guidelines

## 🧪 Testing Standards

### Test File Naming

```
MyComponent.tsx       → MyComponent.test.tsx
userService.ts        → userService.test.ts
```

### Test Structure

```typescript
describe('calculateXP', () => {
  it('should calculate correct XP for contributions', () => {
    // Arrange
    const contributions = 5;
    const expectedXP = 50;
    
    // Act
    const result = calculateXP(contributions);
    
    // Assert
    expect(result).toBe(expectedXP);
  });
  
  it('should handle edge cases', () => {
    expect(calculateXP(0)).toBe(0);
    expect(calculateXP(-1)).toBe(0);
  });
});
```

### Test Coverage Goals

- **Utilities**: 90%+ coverage
- **Services**: 80%+ coverage
- **Components**: 70%+ coverage
- **Integration**: Critical paths covered

## 🔐 Security Standards

### Environment Variables

```typescript
// ❌ Bad
const apiKey = 'hardcoded-key';

// ✅ Good
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OPENAI_API_KEY is required');
}
```

### Input Sanitization

```typescript
// ✅ Good
import DOMPurify from 'dompurify';

const cleanHTML = DOMPurify.sanitize(userInput);
```

### SQL Injection Prevention

```typescript
// ❌ Bad
await db.query(`SELECT * FROM users WHERE id = ${userId}`);

// ✅ Good
await db.query('SELECT * FROM users WHERE id = $1', [userId]);
```

## 📊 Performance Standards

### Lazy Loading

```typescript
// ✅ Good
const PixelOffice = lazy(() => import('./PixelOffice'));

<Suspense fallback={<Loading />}>
  <PixelOffice />
</Suspense>
```

### Memoization

```typescript
// ✅ Good
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);

const MemoizedComponent = memo(({ data }) => {
  return <ExpensiveRender data={data} />;
});
```

## ✅ Code Review Checklist

Before submitting PR:

- [ ] Code follows TypeScript strict mode
- [ ] All functions have proper types
- [ ] No `any` types (unless necessary)
- [ ] Components follow naming conventions
- [ ] Tests are written and passing
- [ ] No console.logs or debugger statements
- [ ] Error handling is implemented
- [ ] Performance considered
- [ ] Security best practices followed
- [ ] Documentation updated
- [ ] Commits follow conventional commits

## 🎯 Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```
feat(webapp): add user level progression UI
fix(extension): resolve popup not opening
docs(onboarding): update setup guide
test(ai-service): add prompt generation tests
```

## 🚀 Quick Reference

### Auto-format on Save

VS Code will auto-format using Prettier if configured correctly.

### Run Before Committing

```bash
pnpm lint        # Fix linting issues
pnpm format      # Format code
pnpm typecheck   # Check types
pnpm test        # Run tests
```

## 📖 Next Steps

Master the coding standards? Move on to:

1. **[Git Workflow](04-git-workflow.md)** - Learn our branching strategy
2. **[First Contribution](05-first-contribution.md)** - Make your first PR!

---

*Questions about standards? Ask your Code Reviewer AI agent or check [Discussions](https://github.com/notbleaux/NeXeZ-SiteGeiste/discussions)!* 👓
