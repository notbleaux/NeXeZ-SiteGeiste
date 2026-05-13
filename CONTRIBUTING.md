# Contributing to NeXeZ SiteGeiste

Thank you for your interest in contributing to NeXeZ SiteGeiste! This document provides guidelines and instructions for contributing.

## 🎮 Our Philosophy

Contributing to NeXeZ SiteGeiste is designed to be a gamified, social experience. You'll earn XP, unlock achievements, and grow alongside your pixel character as you contribute!

## 🚀 Getting Started

### First-Time Contributors

1. **Read the Welcome Guide**: Start with [docs/onboarding/00-welcome.md](docs/onboarding/00-welcome.md)
2. **Set Up Your Environment**: Follow [docs/onboarding/01-setup-guide.md](docs/onboarding/01-setup-guide.md)
3. **Take the Tour**: Complete the interactive onboarding tutorial
4. **Find Your First Quest**: Check issues labeled `good-first-issue` or `quest:beginner`

### Experience Levels

We use a progressive complexity system:

- **Level 1 - Explorer** 🔍: Documentation, small fixes
- **Level 2 - Apprentice** 🎓: Bug fixes, tests
- **Level 3 - Developer** 💻: Features, refactoring
- **Level 4 - Senior** 🏆: Architecture, complex features
- **Level 5 - Manager** 👑: AI agent orchestration, project oversight

## 📋 Development Workflow

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/NeXeZ-SiteGeiste.git
cd NeXeZ-SiteGeiste

# Add upstream remote
git remote add upstream https://github.com/notbleaux/NeXeZ-SiteGeiste.git
```

### 2. Create a Branch

```bash
# Update your fork
git checkout develop
git pull upstream develop

# Create a feature branch
git checkout -b feature/your-feature-name
# or for bugs
git checkout -b bugfix/your-bug-fix
```

### 3. Make Changes

- Write clean, readable code following our [coding standards](docs/onboarding/03-coding-standards.md)
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass: `pnpm test`
- Run linting: `pnpm lint`
- Type-check: `pnpm typecheck`

### 4. Commit Your Changes

We follow conventional commits:

```bash
# Format: <type>(<scope>): <description>

git commit -m "feat(webapp): add pixel sprite animation system"
git commit -m "fix(extension): resolve popup not opening issue"
git commit -m "docs(onboarding): update setup guide"
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub:
- Use a clear, descriptive title
- Fill out the PR template completely
- Reference any related issues
- Add screenshots/GIFs for UI changes
- Request review from appropriate team members

## 🎯 Finding Work

### Issues and Quests

We organize work as "quests" to make contributions more engaging:

- `quest:beginner` - Great for first-time contributors
- `quest:intermediate` - For developers with some experience
- `quest:advanced` - Complex features requiring deep knowledge
- `quest:epic` - Large features spanning multiple PRs

### Quest Rewards

Completing quests earns you:
- **XP Points**: Track your contribution impact
- **Achievements**: Unlock badges and recognition
- **Level Ups**: Progress through contributor levels
- **Pixel Character Upgrades**: Enhance your virtual avatar

## 🏆 Achievements

Unlock these achievements by contributing:

- **First Steps** 👣: Make your first commit
- **Bug Squasher** 🐛: Fix 5 bugs
- **Test Champion** ✅: Add 50+ test cases
- **Documentation Hero** 📚: Write/update 10 docs
- **Code Reviewer** 👀: Review 20 PRs
- **Feature Master** ⭐: Ship 3 major features
- **Pixel Artist** 🎨: Contribute pixel sprites
- **AI Whisperer** 🤖: Enhance AI agent interactions

## ✅ Code Quality Standards

### TypeScript

- Use TypeScript strict mode
- Define proper types (avoid `any`)
- Document complex types with JSDoc

### Testing

- Write unit tests for utilities and functions
- Add integration tests for features
- Include E2E tests for critical user flows
- Aim for 80%+ code coverage

### Documentation

- Add JSDoc comments for public APIs
- Update README files when changing packages
- Document complex algorithms inline
- Create/update architecture docs for major changes

### Style

- Use Prettier for formatting (automatic via pre-commit hook)
- Follow ESLint rules
- Use meaningful variable/function names
- Keep functions small and focused

## 🔍 Code Review Process

1. **Automated Checks**: CI/CD runs linting, tests, type-checking
2. **AI Review**: Our Code Reviewer agent provides initial feedback
3. **Peer Review**: Team members review your code
4. **Iterate**: Address feedback and push updates
5. **Approval**: Get approval from 1-2 reviewers
6. **Merge**: Maintainers merge your PR
7. **Celebration**: Your achievement unlocks! 🎉

## 🐛 Bug Reports

When reporting bugs, include:

- **Clear title**: Concise description of the issue
- **Steps to reproduce**: Detailed steps to trigger the bug
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: OS, browser, versions
- **Screenshots**: If applicable
- **Logs**: Relevant error messages

Use our bug report template when creating issues.

## 💡 Feature Requests

For new feature ideas:

- Check if similar requests exist
- Describe the problem it solves
- Propose a solution
- Consider alternatives
- Provide use cases
- Add mockups/diagrams if applicable

Use our feature request template when creating issues.

## 🤝 Community Guidelines

### Be Respectful

- Treat everyone with respect
- Welcome newcomers
- Provide constructive feedback
- Celebrate others' contributions

### Be Collaborative

- Help others when you can
- Share knowledge generously
- Pair program on complex issues
- Participate in discussions

### Be Professional

- Keep communication clear and concise
- Stay on topic
- Respect different viewpoints
- Follow the code of conduct

## 🎨 Design Contributions

Contributing pixel art or UI designs?

1. Follow our [PixelOffice design guide](docs/architecture/pixel-office-ui.md)
2. Use 16x16 or 32x32 pixel dimensions
3. Maintain consistent color palette
4. Create sprite sheets for animations
5. Include both light and dark mode variants

## 📦 Package-Specific Guidelines

### Shared Packages

Changes to shared packages affect all consumers:
- Ensure backward compatibility
- Update version following semver
- Document breaking changes
- Test across all dependent packages

### WebApp

- Follow React best practices
- Use Zustand for state management
- Implement responsive design
- Add Storybook stories for components

### Extension

- Follow Manifest V3 guidelines
- Test in Chrome, Firefox, and Edge
- Keep bundle size minimal
- Respect user privacy

### Backend Services

- Follow REST/GraphQL best practices
- Implement proper error handling
- Add rate limiting
- Write comprehensive API tests

## 🔐 Security

**Never commit:**
- API keys or secrets
- Credentials or passwords
- Personal data
- Environment files (.env)

If you discover a security vulnerability:
1. **DO NOT** open a public issue
2. Email security@nexez-sitegeiste.com
3. Provide detailed information
4. Allow time for fix before disclosure

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

## ❓ Questions?

- Join our [Discussions](https://github.com/notbleaux/NeXeZ-SiteGeiste/discussions)
- Ask in issue comments
- Reach out to maintainers

## 🎉 Thank You!

Every contribution, no matter how small, helps make NeXeZ SiteGeiste better. We appreciate your time and effort!

Happy coding, and may your pixel character grow strong! 💪🎮
