# Backend Service Templates

## Overview

This document provides templates and specifications for backend services in the NeXeZ SiteGeiste platform.

## Service Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     API Gateway                             │
│  - Route requests                                           │
│  - Authentication middleware                                │
│  - Rate limiting                                            │
│  - Request/Response transformation                          │
└─────────────────────┬──────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
┌───────▼──────┐             ┌──────▼────────┐
│ Auth Service │             │ Project Svc   │
│              │             │               │
│ - Login      │             │ - CRUD ops    │
│ - Register   │             │ - Task mgmt   │
│ - JWT tokens │             │ - Team collab │
└──────────────┘             └───────────────┘
        │                           │
        │      ┌────────────────────┤
        │      │                    │
┌───────▼──────▼───┐        ┌──────▼────────┐
│ AI Agent Service │        │ Game Engine   │
│                  │        │   Service     │
│ - Chat           │        │               │
│ - Code review    │        │ - XP calc     │
│ - Task assign    │        │ - Levels      │
│ - Multi-provider │        │ - Achievemnts │
└──────────────────┘        └───────────────┘
        │                           │
        └─────────────┬─────────────┘
                      │
            ┌─────────▼──────────┐
            │ Storage Service    │
            │                    │
            │ - File uploads     │
            │ - Asset management │
            │ - S3 integration   │
            └────────────────────┘
```

## 1. Authentication Service

### Service Definition

```typescript
// packages/backend/auth-service/src/types.ts

export interface AuthService {
  // User registration
  register(data: RegisterData): Promise<AuthResponse>;

  // User login
  login(credentials: LoginCredentials): Promise<AuthResponse>;

  // Token operations
  verifyToken(token: string): Promise<TokenPayload>;
  refreshToken(refreshToken: string): Promise<AuthResponse>;
  revokeToken(token: string): Promise<void>;

  // OAuth
  initiateOAuth(provider: OAuthProvider): Promise<OAuthRedirect>;
  handleOAuthCallback(code: string, state: string): Promise<AuthResponse>;

  // Password management
  requestPasswordReset(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
}

export type OAuthProvider = 'google' | 'github' | 'discord';
export type UserRole = 'user' | 'admin' | 'developer';
```

### API Endpoints

```
POST   /auth/register                 - Register new user
POST   /auth/login                    - Login user
POST   /auth/logout                   - Logout user
POST   /auth/refresh                  - Refresh access token
POST   /auth/forgot-password          - Request password reset
POST   /auth/reset-password           - Reset password
GET    /auth/oauth/:provider          - Initiate OAuth flow
GET    /auth/oauth/:provider/callback - Handle OAuth callback
GET    /auth/me                       - Get current user
PUT    /auth/me                       - Update current user
```

### Implementation Template

```typescript
// packages/backend/auth-service/src/service.ts

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthService, RegisterData, LoginCredentials, AuthResponse } from './types';

export class AuthServiceImpl implements AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtSecret: string,
    private jwtExpiry: string
  ) {}

  async register(data: RegisterData): Promise<AuthResponse> {
    // 1. Validate input
    await this.validateRegistration(data);

    // 2. Check if user exists
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('User already exists');
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 4. Create user
    const user = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      username: data.username,
      role: 'user',
    });

    // 5. Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
      expiresIn: 3600,
    };
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // 1. Find user
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // 2. Verify password
    const validPassword = await bcrypt.compare(
      credentials.password,
      user.password
    );
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    // 3. Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
      expiresIn: 3600,
    };
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as TokenPayload;
      return payload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  private generateAccessToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      this.jwtSecret,
      { expiresIn: this.jwtExpiry }
    );
  }

  private generateRefreshToken(user: User): string {
    return jwt.sign(
      { userId: user.id },
      this.jwtSecret,
      { expiresIn: '7d' }
    );
  }

  private sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...sanitized } = user;
    return sanitized;
  }

  private async validateRegistration(data: RegisterData): Promise<void> {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }

    // Password strength
    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // Username validation
    if (data.username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }
  }
}
```

## 2. AI Agent Service

### Service Definition

```typescript
// packages/backend/ai-service/src/types.ts

export interface AIAgentService {
  // Chat with agent
  chat(agentId: string, message: string, context?: ChatContext): Promise<ChatResponse>;

  // Task operations
  assignTask(agentId: string, taskId: string): Promise<TaskAssignment>;
  getAgentTasks(agentId: string): Promise<Task[]>;
  completeTask(agentId: string, taskId: string, result: TaskResult): Promise<void>;

  // Agent management
  getAgent(agentId: string): Promise<Agent>;
  getAllAgents(): Promise<Agent[]>;
  updateAgentState(agentId: string, state: AgentState): Promise<void>;

  // Code operations
  reviewCode(agentId: string, code: string, language: string): Promise<CodeReview>;
  suggestFix(agentId: string, issue: Issue): Promise<CodeSuggestion>;
  generateTests(agentId: string, code: string): Promise<TestCode>;
}

export interface Agent {
  id: string;
  type: AgentType;
  name: string;
  state: AgentState;
  currentTask?: string;
  provider: AIProvider;
  model: string;
}

export type AgentType = 'reviewer' | 'architect' | 'hunter' | 'tester' | 'deployer';
export type AgentState = 'idle' | 'active' | 'success' | 'error' | 'blocked';
export type AIProvider = 'openai' | 'anthropic' | 'deepseek';

export interface ChatContext {
  projectId?: string;
  fileContext?: string[];
  conversationHistory?: ChatMessage[];
}

export interface ChatResponse {
  message: string;
  agentId: string;
  timestamp: Date;
  tokens: number;
  suggestions?: string[];
}

export interface CodeReview {
  summary: string;
  issues: CodeIssue[];
  suggestions: string[];
  rating: number; // 0-100
}

export interface CodeIssue {
  line: number;
  column: number;
  severity: 'info' | 'warning' | 'error';
  message: string;
  suggestion?: string;
}
```

### API Endpoints

```
POST   /ai/chat                       - Chat with agent
POST   /ai/agents/:id/assign          - Assign task to agent
GET    /ai/agents                     - Get all agents
GET    /ai/agents/:id                 - Get specific agent
PUT    /ai/agents/:id/state           - Update agent state
GET    /ai/agents/:id/tasks           - Get agent tasks
POST   /ai/code/review                - Request code review
POST   /ai/code/suggest-fix           - Get fix suggestion
POST   /ai/code/generate-tests        - Generate test code
```

### Implementation Template

```typescript
// packages/backend/ai-service/src/service.ts

import { AIAgentService, Agent, ChatContext, ChatResponse } from './types';

export class AIAgentServiceImpl implements AIAgentService {
  constructor(
    private providers: Map<AIProvider, AIClient>,
    private agentRepository: AgentRepository
  ) {}

  async chat(
    agentId: string,
    message: string,
    context?: ChatContext
  ): Promise<ChatResponse> {
    // 1. Get agent configuration
    const agent = await this.getAgent(agentId);

    // 2. Build prompt with context
    const prompt = this.buildPrompt(agent, message, context);

    // 3. Get AI provider
    const provider = this.providers.get(agent.provider);
    if (!provider) {
      throw new Error(`Provider ${agent.provider} not configured`);
    }

    // 4. Send request to AI
    const response = await provider.complete({
      model: agent.model,
      messages: prompt,
      maxTokens: 2000,
    });

    // 5. Log interaction
    await this.logInteraction(agentId, message, response);

    return {
      message: response.content,
      agentId,
      timestamp: new Date(),
      tokens: response.tokens,
      suggestions: this.extractSuggestions(response.content),
    };
  }

  async reviewCode(
    agentId: string,
    code: string,
    language: string
  ): Promise<CodeReview> {
    const agent = await this.getAgent(agentId);

    // Build code review prompt
    const prompt = `Review the following ${language} code and provide feedback:

\`\`\`${language}
${code}
\`\`\`

Please provide:
1. A summary of the code quality
2. Any issues found (with line numbers)
3. Suggestions for improvement
4. An overall rating (0-100)`;

    const response = await this.chat(agentId, prompt);

    // Parse response into structured format
    return this.parseCodeReview(response.message);
  }

  private buildPrompt(
    agent: Agent,
    message: string,
    context?: ChatContext
  ): ChatMessage[] {
    const messages: ChatMessage[] = [];

    // System message with agent persona
    messages.push({
      role: 'system',
      content: this.getAgentPersona(agent.type),
    });

    // Add context if provided
    if (context?.fileContext) {
      messages.push({
        role: 'system',
        content: `Relevant files:\n${context.fileContext.join('\n')}`,
      });
    }

    // Add conversation history
    if (context?.conversationHistory) {
      messages.push(...context.conversationHistory);
    }

    // Add user message
    messages.push({
      role: 'user',
      content: message,
    });

    return messages;
  }

  private getAgentPersona(type: AgentType): string {
    const personas = {
      reviewer: 'You are a meticulous Code Reviewer. Review code for quality, best practices, and potential issues.',
      architect: 'You are an experienced Software Architect. Provide guidance on system design and architecture decisions.',
      hunter: 'You are a detail-oriented Bug Hunter. Find and diagnose issues in code and systems.',
      tester: 'You are a thorough Test Engineer. Generate comprehensive test cases and ensure quality.',
      deployer: 'You are a reliable Deployment Manager. Handle deployments and infrastructure concerns.',
    };

    return personas[type];
  }
}
```

## 3. Project Service

### Service Definition

```typescript
// packages/backend/project-service/src/types.ts

export interface ProjectService {
  // Project CRUD
  createProject(data: CreateProjectData): Promise<Project>;
  getProject(projectId: string): Promise<Project>;
  updateProject(projectId: string, data: UpdateProjectData): Promise<Project>;
  deleteProject(projectId: string): Promise<void>;
  listProjects(userId: string): Promise<Project[]>;

  // Task operations
  createTask(projectId: string, data: CreateTaskData): Promise<Task>;
  getTask(taskId: string): Promise<Task>;
  updateTask(taskId: string, data: UpdateTaskData): Promise<Task>;
  deleteTask(taskId: string): Promise<void>;
  listTasks(projectId: string, filter?: TaskFilter): Promise<Task[]>;

  // Team operations
  addMember(projectId: string, userId: string, role: ProjectRole): Promise<void>;
  removeMember(projectId: string, userId: string): Promise<void>;
  updateMemberRole(projectId: string, userId: string, role: ProjectRole): Promise<void>;
  listMembers(projectId: string): Promise<ProjectMember[]>;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  status: ProjectStatus;
  health: ProjectHealth;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  level: QuestLevel;
  xpReward: number;
  status: TaskStatus;
  assignedAgents: string[];
  progress: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectStatus = 'active' | 'archived' | 'completed';
export type TaskStatus = 'open' | 'claimed' | 'in_progress' | 'review' | 'blocked' | 'completed';
export type QuestLevel = 'beginner' | 'intermediate' | 'advanced' | 'epic';
export type ProjectRole = 'owner' | 'admin' | 'developer' | 'viewer';
```

### API Endpoints

```
POST   /projects                      - Create project
GET    /projects                      - List projects
GET    /projects/:id                  - Get project
PUT    /projects/:id                  - Update project
DELETE /projects/:id                  - Delete project

POST   /projects/:id/tasks            - Create task
GET    /projects/:id/tasks            - List tasks
GET    /tasks/:id                     - Get task
PUT    /tasks/:id                     - Update task
DELETE /tasks/:id                     - Delete task

POST   /projects/:id/members          - Add member
GET    /projects/:id/members          - List members
PUT    /projects/:id/members/:userId  - Update member role
DELETE /projects/:id/members/:userId  - Remove member
```

## 4. Game Engine Service

### Service Definition

```typescript
// packages/backend/game-engine-service/src/types.ts

export interface GameEngineService {
  // XP operations
  awardXP(userId: string, amount: number, reason: string): Promise<XPResult>;
  getUserXP(userId: string): Promise<UserProgress>;
  calculateLevel(xp: number): Promise<LevelInfo>;

  // Achievement operations
  unlockAchievement(userId: string, achievementId: string): Promise<void>;
  getUserAchievements(userId: string): Promise<Achievement[]>;
  checkAchievementProgress(userId: string): Promise<AchievementProgress[]>;

  // Quest operations
  createQuest(data: CreateQuestData): Promise<Quest>;
  claimQuest(userId: string, questId: string): Promise<void>;
  completeQuest(userId: string, questId: string): Promise<QuestReward>;

  // Leaderboard
  getLeaderboard(type: LeaderboardType, limit: number): Promise<LeaderboardEntry[]>;
}

export interface UserProgress {
  userId: string;
  level: number;
  currentXP: number;
  nextLevelXP: number;
  totalXP: number;
  achievementsUnlocked: number;
  questsCompleted: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpValue: number;
  unlockedAt?: Date;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  level: QuestLevel;
  xpReward: number;
  requirements: QuestRequirement[];
  status: QuestStatus;
}

export type LeaderboardType = 'xp' | 'quests' | 'contributions';
```

### API Endpoints

```
POST   /game/xp/award                 - Award XP to user
GET    /game/xp/:userId               - Get user XP/level
POST   /game/achievements/unlock      - Unlock achievement
GET    /game/achievements/:userId     - Get user achievements
POST   /game/quests                   - Create quest
POST   /game/quests/:id/claim         - Claim quest
POST   /game/quests/:id/complete      - Complete quest
GET    /game/leaderboard/:type        - Get leaderboard
```

## 5. Storage Service

### Service Definition

```typescript
// packages/backend/storage-service/src/types.ts

export interface StorageService {
  // File operations
  uploadFile(file: File, metadata: FileMetadata): Promise<FileUploadResult>;
  getFile(fileId: string): Promise<File>;
  deleteFile(fileId: string): Promise<void>;
  listFiles(filter: FileFilter): Promise<File[]>;

  // Asset operations
  uploadAsset(asset: Asset, type: AssetType): Promise<string>;
  getAssetUrl(assetId: string): Promise<string>;

  // Sprite operations
  uploadSprite(sprite: Sprite): Promise<string>;
  getSpriteSheet(agentType: AgentType): Promise<SpriteSheet>;
}

export interface FileMetadata {
  userId: string;
  projectId?: string;
  filename: string;
  mimetype: string;
  size: number;
}

export interface FileUploadResult {
  fileId: string;
  url: string;
  cdnUrl?: string;
}

export type AssetType = 'sprite' | 'image' | 'document' | 'archive';
```

### API Endpoints

```
POST   /storage/upload                - Upload file
GET    /storage/files/:id             - Get file
DELETE /storage/files/:id             - Delete file
GET    /storage/files                 - List files
POST   /storage/assets                - Upload asset
GET    /storage/assets/:id            - Get asset URL
POST   /storage/sprites               - Upload sprite
GET    /storage/sprites/:type         - Get sprite sheet
```

## Service Communication

### Inter-Service Communication Pattern

```typescript
// Shared event bus for service communication
export interface EventBus {
  publish(event: ServiceEvent): Promise<void>;
  subscribe(eventType: string, handler: EventHandler): void;
}

export interface ServiceEvent {
  type: string;
  source: string;
  timestamp: Date;
  data: any;
}

// Example events
export const Events = {
  USER_REGISTERED: 'user.registered',
  TASK_COMPLETED: 'task.completed',
  AGENT_STATE_CHANGED: 'agent.state.changed',
  XP_AWARDED: 'game.xp.awarded',
  ACHIEVEMENT_UNLOCKED: 'game.achievement.unlocked',
};
```

### Error Handling Pattern

```typescript
export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
};
```

---

**Version**: 1.0.0
**Last Updated**: 2026-05-13
**Maintainer**: Backend Team
