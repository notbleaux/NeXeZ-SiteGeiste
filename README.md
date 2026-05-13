# NeXeZ SiteGeiste

> Enterprise platform combining WebApp, Browser Extension, and Website with PixelOffice-inspired AI Agent Visualization and Gamified Project Management

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-8.x-orange)](https://pnpm.io/)

## 🎮 Overview

NeXeZ SiteGeiste is a comprehensive enterprise platform that revolutionizes developer onboarding and project management through:

- **🎨 PixelOffice Visualization**: Pixel sprite art characters representing AI agents
- **🤖 AI Agent Integration**: Standard AI interactions with intelligent project management (Claude, OpenAI, Deepseek)
- **🎯 Gamified Experience**: Manager simulation game mechanics for intuitive project navigation
- **🚀 Multi-Platform**: WebApp, Browser Extension, and Website
- **📚 Developer Onboarding**: Personalized, social-intuitive learning experience
- **🏢 Enterprise Ready**: Full startup foundation with development-to-production pipeline

## 🏗️ Architecture

This is a monorepo managed with pnpm workspaces, containing:

### Packages
- **`packages/shared`**: Shared libraries (types, utils, ai-client, pixel-sprites, game-engine)
- **`packages/webapp`**: Main web application (React/Next.js)
- **`packages/extension`**: Browser extension (Manifest V3)
- **`packages/website`**: Marketing/landing website
- **`packages/backend`**: Backend services (API gateway, AI service, auth, etc.)

### Infrastructure
- **Terraform**: Infrastructure as Code for cloud resources
- **Docker**: Container configurations for all services
- **Kubernetes**: Orchestration manifests for production deployment

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker (optional, for containerized development)

### Installation

```bash
# Clone the repository
git clone https://github.com/notbleaux/NeXeZ-SiteGeiste.git
cd NeXeZ-SiteGeiste

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development servers
pnpm dev
```

### First-Time Setup

For a guided setup experience, run:

```bash
./scripts/setup/install-dependencies.sh
```

This will:
1. Install all dependencies
2. Set up your development environment
3. Initialize databases
4. Introduce you to your AI agent mentor 🤖

## 📖 Documentation

- **[Onboarding Guide](docs/onboarding/00-welcome.md)**: Start here if you're new!
- **[Architecture Overview](docs/architecture/system-design.md)**: System design and architecture
- **[API Documentation](docs/api/)**: API specifications for all services
- **[Contributing Guide](CONTRIBUTING.md)**: How to contribute to this project

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev              # Start all packages in development mode
pnpm dev:webapp       # Start only the webapp
pnpm dev:extension    # Start only the extension
pnpm dev:website      # Start only the website

# Building
pnpm build            # Build all packages
pnpm build:webapp     # Build only the webapp
pnpm build:extension  # Build only the extension

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:e2e         # Run end-to-end tests

# Code Quality
pnpm lint             # Lint all packages
pnpm format           # Format all files
pnpm typecheck        # Type-check all packages

# Cleanup
pnpm clean            # Remove all build artifacts and node_modules
```

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `release/*` - Release preparation

## 🎮 Gamification Features

- **XP System**: Earn experience points for contributions
- **Achievement Badges**: Unlock badges (First PR, Bug Squasher, Test Champion)
- **Virtual Office**: Your pixel character in a virtual workspace
- **Daily Quests**: Aligned with project needs
- **Leaderboards**: Team-focused friendly competition

## 🤖 AI Agents

Meet your AI team members:

- **Code Reviewer** 👓: Reviews your code and provides feedback
- **Architecture Guide** 📐: Helps with design decisions
- **Bug Hunter** 🔍: Identifies potential issues
- **Test Generator** ✅: Creates test cases
- **Deployment Manager** ⚓: Manages deployments

## 📊 Technology Stack

### Frontend
- React 18+ with TypeScript
- Next.js 14+ for webapp and website
- Zustand for state management
- Tailwind CSS for styling
- Phaser.js for game engine

### Backend
- Node.js with NestJS
- PostgreSQL database
- Redis for caching
- GraphQL API

### AI Integration
- OpenAI API
- Anthropic Claude API
- Deepseek AI API
- Kimi AI API

### DevOps
- GitHub Actions for CI/CD
- Docker for containerization
- Kubernetes for orchestration
- Terraform for infrastructure

## 🔒 Security

- Environment variable management
- API key rotation
- CORS configuration
- Rate limiting
- Input validation and sanitization
- Regular dependency audits

See [Security Policy](docs/deployment/production.md#security) for details.

## 📈 Monitoring & Analytics

- Application Performance Monitoring (APM)
- Error tracking with Sentry
- User analytics dashboard
- AI agent performance metrics

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Inspired by:
- PixelOffice for the visual style
- Game Dev Tycoon for gamification mechanics
- GitHub Copilot for AI assistance patterns

## 📮 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/notbleaux/NeXeZ-SiteGeiste/issues)
- **Discussions**: [GitHub Discussions](https://github.com/notbleaux/NeXeZ-SiteGeiste/discussions)

---

Made with ❤️ by the NeXeZ team. Let's build something amazing together! 🚀
