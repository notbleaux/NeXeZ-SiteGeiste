# Git Workflow & Branching Strategy

Master the art of version control the NeXeZ way! 🌿

## 🌳 Branch Strategy

We use **Git Flow** with a gamification twist:

```
main (production)
  ↑
develop (integration)
  ↑
feature/* (new features)
bugfix/* (bug fixes)
hotfix/* (urgent fixes)
release/* (release prep)
```

### Branch Types

#### `main`
- Production-ready code
- Protected branch
- Requires PR approval
- Auto-deploys to production

#### `develop`
- Integration branch
- Latest development changes
- Base for feature branches
- Auto-deploys to staging

#### `feature/*`
- New features and enhancements
- Branch from: `develop`
- Merge to: `develop`
- Naming: `feature/add-pixel-sprite-animation`

#### `bugfix/*`
- Non-urgent bug fixes
- Branch from: `develop`
- Merge to: `develop`
- Naming: `bugfix/fix-xp-calculation`

#### `hotfix/*`
- Urgent production fixes
- Branch from: `main`
- Merge to: `main` AND `develop`
- Naming: `hotfix/fix-login-crash`

#### `release/*`
- Release preparation
- Branch from: `develop`
- Merge to: `main` AND `develop`
- Naming: `release/v1.2.0`

## 🚀 Standard Workflow

### Starting New Work

```bash
# 1. Update your local develop branch
git checkout develop
git pull origin develop

# 2. Create your feature branch
git checkout -b feature/my-awesome-feature

# 3. Make your changes
# ... code, code, code ...

# 4. Commit your work
git add .
git commit -m "feat(webapp): add awesome feature"

# 5. Push to remote
git push origin feature/my-awesome-feature

# 6. Open Pull Request on GitHub
```

### Working on Feature

```bash
# Regular commits as you work
git add specific-files
git commit -m "feat(scope): descriptive message"

# Keep your branch updated with develop
git fetch origin
git rebase origin/develop

# Push updates
git push origin feature/my-awesome-feature
```

### Completing Feature

```bash
# 1. Ensure tests pass
pnpm test

# 2. Ensure lint passes
pnpm lint

# 3. Type check
pnpm typecheck

# 4. Update from develop one last time
git rebase origin/develop

# 5. Force push if needed (after rebase)
git push --force-with-lease origin feature/my-awesome-feature

# 6. Open or update Pull Request
```

## 📝 Commit Messages

### Conventional Commits Format

```
type(scope): subject

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code change that neither fixes bug nor adds feature
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `build`: Build system or dependencies
- `ci`: CI configuration
- `chore`: Other changes (tooling, etc.)
- `revert`: Revert previous commit

### Scopes

Common scopes in our project:
- `webapp`: Main web application
- `extension`: Browser extension
- `website`: Marketing website
- `backend`: Backend services
- `shared`: Shared packages
- `ai-service`: AI integration
- `pixel-sprites`: Sprite system
- `game-engine`: Gamification engine
- `docs`: Documentation
- `ci`: CI/CD pipeline

### Examples

```bash
# Good commit messages
git commit -m "feat(webapp): add pixel character customization"
git commit -m "fix(extension): resolve popup display on Firefox"
git commit -m "docs(onboarding): update setup instructions"
git commit -m "test(ai-service): add prompt generation tests"
git commit -m "refactor(game-engine): optimize XP calculation"

# With body
git commit -m "feat(webapp): add achievement notification system

Implements toast notifications when users unlock achievements.
Includes sound effects and sprite animations.

Closes #123"
```

## 🔄 Pull Request Process

### Creating a PR

1. **Push your branch** to GitHub
2. **Open Pull Request** from your branch to `develop`
3. **Fill out PR template** completely
4. **Add labels** (quest level, type, etc.)
5. **Request reviews** from team members
6. **Link related issues** (Closes #123)

### PR Requirements

✅ Before requesting review:
- All tests pass
- Linting passes
- Type checking passes
- No merge conflicts
- PR description is complete
- Screenshots added (for UI changes)
- Documentation updated

### Review Process

1. **AI Agent Review**: Automatic code review by AI
2. **Peer Review**: 1-2 team members review
3. **Address Feedback**: Make requested changes
4. **Re-request Review**: After making changes
5. **Approval**: Get required approvals
6. **Merge**: Squash and merge to develop

## 🎮 Gamified Git Commands

### Quest Branches

When working on a quest:

```bash
# Create quest branch
git checkout -b quest/123-implement-sprite-system

# Regular commits
git commit -m "feat(pixel-sprites): add base sprite class"
git commit -m "feat(pixel-sprites): implement animation system"
git commit -m "test(pixel-sprites): add sprite tests"

# Complete quest
git commit -m "feat(pixel-sprites): complete sprite system

Quest #123 completed!
- Implemented sprite rendering
- Added animation support
- Full test coverage

XP Earned: 150
Achievement Unlocked: Pixel Artist"
```

## 🔧 Useful Git Commands

### Keeping Branch Updated

```bash
# Rebase on develop (preferred)
git fetch origin
git rebase origin/develop

# If conflicts, resolve and continue
git add resolved-files
git rebase --continue

# Merge develop (alternative)
git fetch origin
git merge origin/develop
```

### Undoing Changes

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo changes to specific file
git checkout -- filename

# Undo all local changes
git reset --hard origin/your-branch
```

### Stashing Changes

```bash
# Stash current changes
git stash

# List stashes
git stash list

# Apply last stash
git stash pop

# Apply specific stash
git stash apply stash@{0}
```

### Viewing History

```bash
# View commit history
git log --oneline --graph

# View file changes
git diff

# View changes in specific file
git diff filename

# View commit details
git show commit-hash
```

## 🚨 Common Scenarios

### Fixing Merge Conflicts

```bash
# 1. Fetch latest
git fetch origin

# 2. Start rebase
git rebase origin/develop

# 3. Git will pause at conflicts
# 4. Open conflicted files and resolve
# 5. Mark as resolved
git add resolved-files

# 6. Continue rebase
git rebase --continue

# 7. Force push
git push --force-with-lease origin your-branch
```

### Updating PR with New Commits

```bash
# Make changes
git add .
git commit -m "fix: address review feedback"
git push origin your-branch

# PR automatically updates!
```

### Squashing Commits

```bash
# Interactive rebase for last 3 commits
git rebase -i HEAD~3

# Mark commits as 'squash' or 'fixup'
# Save and close editor
# Update commit message if needed
# Force push
git push --force-with-lease origin your-branch
```

## 📋 Branch Cleanup

### After PR Merge

```bash
# Delete local branch
git branch -d feature/my-feature

# Delete remote branch (if not auto-deleted)
git push origin --delete feature/my-feature

# Prune deleted remote branches
git fetch --prune

# Update develop
git checkout develop
git pull origin develop
```

## 🎯 Best Practices

### Do's ✅

- Commit often with clear messages
- Keep commits focused and atomic
- Rebase on develop before creating PR
- Write descriptive commit messages
- Link commits to issues when relevant
- Test before pushing
- Keep branches short-lived (< 1 week)

### Don'ts ❌

- Don't commit directly to `main` or `develop`
- Don't commit secrets or sensitive data
- Don't commit generated files
- Don't force push to shared branches
- Don't mix unrelated changes in one commit
- Don't use vague commit messages
- Don't leave branches stale

## 🔐 Protected Branches

### `main` Branch Rules

- Requires PR approval (2 reviewers)
- Status checks must pass
- No force push allowed
- No deletion allowed
- Auto-deploys to production

### `develop` Branch Rules

- Requires PR approval (1 reviewer)
- Status checks must pass
- No force push allowed
- Auto-deploys to staging

## 📚 Git Configuration

### Recommended Git Config

```bash
# Set your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Use main as default branch
git config --global init.defaultBranch main

# Enable auto-prune
git config --global fetch.prune true

# Set default pull behavior
git config --global pull.rebase true

# Pretty log alias
git config --global alias.lg "log --graph --oneline --decorate"
```

## 🎮 Achievement: Git Master

Complete these to unlock the Git Master achievement:

- [ ] Create your first feature branch
- [ ] Make your first commit
- [ ] Open your first PR
- [ ] Successfully rebase on develop
- [ ] Resolve a merge conflict
- [ ] Review someone else's PR
- [ ] Complete 10 PRs

## 📖 Next Steps

Git workflow mastered? Time for action:

1. **[First Contribution](05-first-contribution.md)** - Make your first PR!

---

*Git questions? Ask in [Discussions](https://github.com/notbleaux/NeXeZ-SiteGeiste/discussions) or consult your AI mentor!* 🌿
