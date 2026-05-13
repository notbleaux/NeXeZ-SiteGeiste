# Development Environment Setup Guide

Welcome, adventurer! Let's get your development environment ready for your first quest. 🚀

## 📋 Prerequisites

Before we begin, make sure you have these tools installed:

### Required Software

1. **Node.js** (v18.0.0 or higher)
   ```bash
   # Check your version
   node --version

   # Download from: https://nodejs.org/
   # We recommend using nvm (Node Version Manager) for easy version management
   ```

2. **pnpm** (v8.0.0 or higher)
   ```bash
   # Install pnpm globally
   npm install -g pnpm

   # Check your version
   pnpm --version
   ```

3. **Git**
   ```bash
   # Check if installed
   git --version

   # Download from: https://git-scm.com/
   ```

4. **VS Code** (recommended) or your preferred IDE
   - Download from: https://code.visualstudio.com/

### Optional but Recommended

- **Docker Desktop** - For containerized development
  - Download from: https://www.docker.com/products/docker-desktop/

- **PostgreSQL** - For local database development
  - Download from: https://www.postgresql.org/download/

- **Redis** - For caching
  - Download from: https://redis.io/download/

## 🎮 Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/notbleaux/NeXeZ-SiteGeiste.git

# Navigate to the project directory
cd NeXeZ-SiteGeiste
```

### Step 2: Install Dependencies

```bash
# Install all dependencies using pnpm
pnpm install
```

This will install dependencies for all packages in the monorepo. Grab a coffee ☕ while pnpm works its magic!

### Step 3: Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Open .env in your editor and fill in your values
```

**Important environment variables to configure:**

```env
# AI Service API Keys (get free trials from providers)
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here

# Database (use default for local development)
DATABASE_URL=postgresql://localhost:5432/nexez_db
REDIS_URL=redis://localhost:6379

# Keep these for local development
NODE_ENV=development
PORT=3000
```

### Step 4: Database Setup

If running locally (without Docker):

```bash
# Create the database
createdb nexez_db

# Run migrations (when available)
pnpm --filter backend db:migrate
```

Or use Docker:

```bash
# Start PostgreSQL and Redis containers
docker-compose up -d postgres redis
```

### Step 5: Verify Installation

```bash
# Run type checking
pnpm typecheck

# Run linting
pnpm lint

# Ensure everything builds
pnpm build
```

If all commands complete successfully, you're ready to go! 🎉

## 🚀 Running the Development Servers

### Start Everything

```bash
# Start all packages in development mode
pnpm dev
```

This will start:
- WebApp at `http://localhost:3000`
- Backend API at `http://localhost:3001`
- Website at `http://localhost:3002`

### Start Individual Packages

```bash
# Start only the webapp
pnpm --filter webapp dev

# Start only the extension
pnpm --filter extension dev

# Start only the website
pnpm --filter website dev

# Start backend services
pnpm --filter api-gateway dev
```

## 🛠️ IDE Setup (VS Code)

### Recommended Extensions

Install these extensions for the best development experience:

```bash
# Install recommended extensions (VS Code will prompt you)
# Or install manually:
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-azuretools.vscode-docker
code --install-extension prisma.prisma
```

**Recommended extensions:**
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Docker
- Prisma (if using Prisma ORM)
- GitLens
- Error Lens
- Import Cost

### VS Code Settings

The repository includes VS Code settings in `.vscode/settings.json`. These will:
- Auto-format on save
- Run ESLint automatically
- Configure proper TypeScript settings

## 🐛 Troubleshooting

### Common Issues

**1. pnpm install fails**

```bash
# Clear pnpm cache
pnpm store prune

# Try installing again
pnpm install
```

**2. Port already in use**

```bash
# Find and kill the process using the port
# On macOS/Linux:
lsof -ti:3000 | xargs kill

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**3. Database connection fails**

```bash
# Check if PostgreSQL is running
# On macOS:
brew services list

# On Linux:
sudo systemctl status postgresql

# On Windows: Check Services app
```

**4. Module not found errors**

```bash
# Clean install
pnpm clean
pnpm install
```

**5. TypeScript errors**

```bash
# Rebuild TypeScript
pnpm build
pnpm typecheck
```

## 🧪 Verify Everything Works

Run the test suite:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## 🎮 Your First Quest Begins!

Congratulations! Your development environment is ready. Time to meet your AI agent mentor and start your first quest!

Run the onboarding script:

```bash
./scripts/setup/welcome.sh
```

This will:
1. Introduce you to your AI agent mentor 🤖
2. Give you a tour of the codebase
3. Assign your first quest
4. Set up your pixel character

## 📚 Next Steps

Your setup is complete! Continue your journey:

1. ✅ Setup Guide (you are here!)
2. **[Architecture Overview](02-architecture.md)** - Understand the system
3. **[Coding Standards](03-coding-standards.md)** - Learn our conventions
4. **[Git Workflow](04-git-workflow.md)** - Master our process
5. **[First Contribution](05-first-contribution.md)** - Make your mark!

## 🆘 Need Help?

- Check the [FAQ](../faq.md)
- Ask in [GitHub Discussions](https://github.com/notbleaux/NeXeZ-SiteGeiste/discussions)
- Open an [issue](https://github.com/notbleaux/NeXeZ-SiteGeiste/issues)
- Consult your AI agent mentors in the app!

---

*Setup complete! Ready to code? Let's go!* 🚀
