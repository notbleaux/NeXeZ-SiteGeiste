# System Architecture Overview

Understanding the architecture is key to contributing effectively. Let's explore how NeXeZ SiteGeiste is structured! 🏗️

## 🎯 High-Level Architecture

NeXeZ SiteGeiste follows a **monorepo microservices architecture** with a gamified frontend layer.

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface Layer                 │
│  ┌──────────┐  ┌───────────┐  ┌─────────────────────┐ │
│  │  WebApp  │  │ Extension │  │  Marketing Website  │ │
│  └──────────┘  └───────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────┐
│             PixelOffice Visualization Layer             │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Pixel Sprites • Animations • Game Engine       │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────┐
│                   API Gateway Layer                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Request Routing • Auth • Rate Limiting         │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────┐
│                  Backend Services Layer                 │
│ ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌──────────┐ │
│ │AI Service│ │Auth Svc  │ │Project Svc │ │Game Svc  │ │
│ └──────────┘ └──────────┘ └────────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────┐
│                     Data Layer                          │
│  ┌──────────────┐    ┌─────────────┐                   │
│  │  PostgreSQL  │    │    Redis    │                   │
│  │   Database   │    │    Cache    │                   │
│  └──────────────┘    └─────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

## 📦 Monorepo Structure

### Shared Packages (`packages/shared/`)

Common code reused across all applications:

- **types**: TypeScript type definitions and interfaces
- **utils**: Utility functions and helpers
- **ai-client**: AI service integration library
- **pixel-sprites**: Pixel art sprite system
- **game-engine**: Gamification engine core

### Frontend Applications

#### WebApp (`packages/webapp/`)
The main application featuring:
- Project management interface
- AI agent interaction
- PixelOffice visualization
- Gamification dashboard
- User onboarding flows

**Tech Stack:**
- React 18+ with TypeScript
- Next.js 14+ (App Router)
- Zustand for state management
- Tailwind CSS for styling
- Phaser.js for game mechanics

#### Browser Extension (`packages/extension/`)
Brings NeXeZ experience to the browser:
- Quick access popup
- Context-aware suggestions
- Integration with developer tools
- Cross-platform (Chrome, Firefox, Edge)

**Tech Stack:**
- Manifest V3
- React for UI
- Message passing for communication
- Storage API for persistence

#### Website (`packages/website/`)
Marketing and landing pages:
- Product information
- Documentation portal
- Blog and updates
- Community showcase

**Tech Stack:**
- Next.js 14+ (Static Generation)
- MDX for content
- Tailwind CSS

### Backend Services (`packages/backend/`)

#### API Gateway
- Request routing
- Authentication/Authorization
- Rate limiting
- Request/Response transformation

#### AI Service
- Integration with OpenAI, Claude, Deepseek
- Prompt management
- Context handling
- Agent personality system

#### Auth Service
- User authentication
- OAuth integration
- JWT token management
- Session handling

#### Project Service
- Project management logic
- Task tracking
- Team collaboration
- Progress analytics

#### Game Engine Service
- XP and level calculations
- Achievement tracking
- Quest management
- Leaderboard logic

#### Storage Service
- File uploads
- Asset management
- S3 integration

## 🔄 Data Flow

### User Action Flow

```
User Action → Frontend Component → State Manager → API Client
                                                       ↓
                                                   API Gateway
                                                       ↓
                                           Backend Service(s)
                                                       ↓
                                                   Database
                                                       ↓
                                         Response ← ← ← ←
```

### AI Agent Flow

```
User Query → AI Agent UI → AI Client → AI Service → OpenAI/Claude
                                                          ↓
                                                    Process Response
                                                          ↓
                                            Update Agent State
                                                          ↓
                                      Render Pixel Animation
                                                          ↓
                                        Display to User
```

## 🎮 Gamification Architecture

### XP & Achievement System

```
Contribution Event → Event Tracker → XP Calculator
                                           ↓
                                    Update User Stats
                                           ↓
                          Check Achievement Criteria
                                           ↓
                           Unlock New Achievements
                                           ↓
                              Trigger Animations
                                           ↓
                                    Notify User
```

### Quest System

Quests are GitHub issues with special labels and metadata:
- `quest:beginner`, `quest:intermediate`, `quest:advanced`, `quest:epic`
- XP rewards and achievement unlocks
- Prerequisites and dependencies
- AI agent assistance recommendations

## 🔒 Security Architecture

### Authentication Flow

```
User Login → OAuth Provider → Auth Service → JWT Token
                                                  ↓
                                          Store in HttpOnly Cookie
                                                  ↓
                                          Subsequent Requests
                                                  ↓
                                          Token Validation
                                                  ↓
                                          Access Granted/Denied
```

### API Security Layers

1. **Rate Limiting**: Prevent abuse
2. **Input Validation**: Sanitize all inputs
3. **CORS**: Restrict origins
4. **CSRF Protection**: Token-based
5. **SQL Injection Prevention**: Parameterized queries
6. **XSS Protection**: Content Security Policy

## 🚀 Deployment Architecture

### Environments

- **Development**: Local development machines
- **Staging**: Pre-production testing (AWS ECS)
- **Production**: Live environment (AWS ECS + CloudFront)

### Infrastructure

```
GitHub Actions → Build & Test → Docker Images
                                      ↓
                                 Push to ECR
                                      ↓
                                Deploy to ECS
                                      ↓
                      Load Balancer + Auto Scaling
                                      ↓
                               CloudFront CDN
```

## 📊 Monitoring & Observability

- **APM**: Application Performance Monitoring
- **Error Tracking**: Sentry integration
- **Logging**: Structured JSON logs
- **Metrics**: Custom business metrics
- **Tracing**: Distributed tracing

## 🔧 Development Tools

### Build System
- **pnpm workspaces**: Monorepo management
- **Turborepo**: Build orchestration (optional)
- **TypeScript**: Type safety
- **ESLint & Prettier**: Code quality

### Testing Strategy
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Supertest for APIs
- **E2E Tests**: Playwright
- **Visual Regression**: Chromatic (optional)

## 📚 Key Architectural Decisions

### Why Monorepo?
- Shared code reuse
- Atomic commits across packages
- Consistent tooling
- Simplified dependency management

### Why Microservices?
- Independent scaling
- Technology flexibility
- Fault isolation
- Team autonomy

### Why Gamification?
- Increased engagement
- Lower barrier to entry
- Clear progression path
- Fun learning experience

## 🎯 Design Patterns Used

- **Repository Pattern**: Data access abstraction
- **Factory Pattern**: Creating AI agents
- **Observer Pattern**: Event handling
- **Strategy Pattern**: Different AI providers
- **Singleton Pattern**: Service instances
- **Decorator Pattern**: Middleware chains

## 🔮 Future Architecture Plans

- GraphQL API layer
- WebSocket for real-time features
- Event-driven architecture with message queues
- Service mesh for microservices
- Edge computing for pixel rendering

## 📖 Next Steps

Now that you understand the architecture:

1. **[Coding Standards](03-coding-standards.md)** - Learn our conventions
2. **[Git Workflow](04-git-workflow.md)** - Master our process
3. **[First Contribution](05-first-contribution.md)** - Start contributing!

---

*Questions about the architecture? Ask in [Discussions](https://github.com/notbleaux/NeXeZ-SiteGeiste/discussions) or consult your AI Architecture Guide!* 📐
