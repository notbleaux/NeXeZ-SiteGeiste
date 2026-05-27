import { Persona } from './personas';

/**
 * MCP (Model Context Protocol) Client for RAT-OS Integration
 * Based on Notion Templates Research Report I-018 (MCP Connector concept)
 * 
 * Provides standardized interface for SiteGeiste modules to communicate
 * with RAT-OS backend services via MCP protocol.
 * 
 * Currently supports:
 * - @njz-os/focus-engine
 * - @njz-os/audio-engine
 * - @njz-os/writing
 * - @njz-os/learning-cards
 * - @njz-os/progression
 */

export interface MCPConfig {
  endpoint: string;
  apiKey?: string;
  timeout: number;
  retries: number;
}

export interface MCPRequest {
  tool: string;
  method: string;
  params: Record<string, unknown>;
  personaId?: string;
  moduleId?: string;
  taskId?: string;
}

export interface MCPResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  metadata?: {
    duration: number;
    tool: string;
    cached: boolean;
  };
}

export interface MCPTool {
  name: string;
  description: string;
  params: Record<string, string>;
  returns: string;
}

export const RAT_OS_TOOLS: Record<string, MCPTool[]> = {
  'focus-engine': [
    {
      name: 'session.start',
      description: 'Start a focus session',
      params: { duration: 'number (minutes)', mode: 'string (deep/shallow)' },
      returns: 'Session object with ID and start time'
    },
    {
      name: 'session.stop',
      description: 'Stop current focus session',
      params: { sessionId: 'string' },
      returns: 'Session summary with duration and interruptions'
    },
    {
      name: 'session.getStats',
      description: 'Get focus session statistics',
      params: { period: 'string (day/week/month)' },
      returns: 'Statistics object with total time, sessions count, average duration'
    },
    {
      name: 'distraction.block',
      description: 'Block distracting websites/apps',
      params: { sites: 'string[]', duration: 'number (minutes)' },
      returns: 'Block status'
    },
    {
      name: 'distraction.unblock',
      description: 'Unblock previously blocked sites',
      params: { blockId: 'string' },
      returns: 'Unblock confirmation'
    }
  ],
  'audio-engine': [
    {
      name: 'soundscape.load',
      description: 'Load a soundscape preset',
      params: { preset: 'string (rain/wind/fire/ocean/etc)', volume: 'number (0-1)' },
      returns: 'Audio player instance'
    },
    {
      name: 'soundscape.play',
      description: 'Start playing loaded soundscape',
      params: { playerId: 'string' },
      returns: 'Playback status'
    },
    {
      name: 'soundscape.pause',
      description: 'Pause current soundscape',
      params: { playerId: 'string' },
      returns: 'Pause status'
    },
    {
      name: 'soundscape.stop',
      description: 'Stop and unload soundscape',
      params: { playerId: 'string' },
      returns: 'Stop confirmation'
    },
    {
      name: 'soundscape.getPresets',
      description: 'List available soundscape presets',
      params: {},
      returns: 'Array of preset objects with name, description, duration'
    }
  ],
  'writing': [
    {
      name: 'manuscript.create',
      description: 'Create a new manuscript',
      params: { title: 'string', template: 'string (novel/article/blog)' },
      returns: 'Manuscript object with ID'
    },
    {
      name: 'manuscript.save',
      description: 'Save manuscript content',
      params: { manuscriptId: 'string', content: 'string', version: 'string' },
      returns: 'Save confirmation with version'
    },
    {
      name: 'manuscript.export',
      description: 'Export manuscript to format',
      params: { manuscriptId: 'string', format: 'string (txt/md/pdf/docx)' },
      returns: 'Export URL or blob'
    },
    {
      name: 'manuscript.getVersions',
      description: 'Get version history',
      params: { manuscriptId: 'string' },
      returns: 'Array of version objects'
    }
  ],
  'learning-cards': [
    {
      name: 'deck.create',
      description: 'Create a flashcard deck',
      params: { title: 'string', category: 'string' },
      returns: 'Deck object with ID'
    },
    {
      name: 'card.add',
      description: 'Add flashcard to deck',
      params: { deckId: 'string', front: 'string', back: 'string', difficulty: 'string (easy/medium/hard)' },
      returns: 'Card object'
    },
    {
      name: 'session.start',
      description: 'Start review session',
      params: { deckId: 'string', mode: 'string (review/learn/exam)' },
      returns: 'Session with first card'
    },
    {
      name: 'session.submitAnswer',
      description: 'Submit answer and get next card',
      params: { sessionId: 'string', correct: 'boolean' },
      returns: 'Next card or session summary'
    }
  ],
  'progression': [
    {
      name: 'xp.add',
      description: 'Add XP to user account',
      params: { amount: 'number', source: 'string (task/focus/writing/etc)' },
      returns: 'Updated XP total'
    },
    {
      name: 'level.get',
      description: 'Get current level and progress',
      params: {},
      returns: 'Level object with XP, level, nextLevelXP'
    },
    {
      name: 'achievement.check',
      description: 'Check and award achievements',
      params: { achievementId: 'string' },
      returns: 'Achievement status'
    },
    {
      name: 'stats.get',
      description: 'Get comprehensive progress stats',
      params: { period: 'string (week/month/year/all)' },
      returns: 'Stats object with XP, tasks, focus time, streaks'
    }
  ]
};

// Default config (production would use env vars)
const DEFAULT_CONFIG: MCPConfig = {
  endpoint: '/api/mcp', // Proxy through SiteGeiste backend
  timeout: 30000,
  retries: 3
};

let mcpConfig: MCPConfig = DEFAULT_CONFIG;

export function configureMCP(config: Partial<MCPConfig>): void {
  mcpConfig = { ...mcpConfig, ...config };
}

/**
 * Execute MCP tool call
 * Currently mocked for frontend-only build; will connect to RAT-OS backend
 */
export async function executeMCP(request: MCPRequest): Promise<MCPResponse> {
  const startTime = Date.now();

  // In production, this would be:
  // const response = await fetch(mcpConfig.endpoint, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${mcpConfig.apiKey}` },
  //   body: JSON.stringify(request)
  // });

  // For now, return mock responses based on tool name
  const mockResponse = generateMockResponse(request);
  
  return {
    success: true,
    data: mockResponse,
    metadata: {
      duration: Date.now() - startTime,
      tool: request.tool,
      cached: false
    }
  };
}

function generateMockResponse(request: MCPRequest): unknown {
  const { tool, method } = request;

  // Focus Engine mocks
  if (tool === 'focus-engine') {
    switch (method) {
      case 'session.start':
        return {
          sessionId: `focus_${Date.now()}`,
          startTime: new Date().toISOString(),
          duration: request.params.duration || 25,
          mode: request.params.mode || 'deep',
          status: 'active'
        };
      case 'session.stop':
        return {
          sessionId: request.params.sessionId,
          actualDuration: 23,
          interruptions: 1,
          status: 'completed'
        };
      case 'session.getStats':
        return {
          period: request.params.period,
          totalMinutes: 240,
          sessionsCount: 8,
          averageDuration: 30,
          streak: 3
        };
      case 'distraction.block':
        return {
          blockId: `block_${Date.now()}`,
          sites: request.params.sites,
          duration: request.params.duration,
          status: 'active'
        };
    }
  }

  // Audio Engine mocks
  if (tool === 'audio-engine') {
    switch (method) {
      case 'soundscape.load':
        return {
          playerId: `audio_${Date.now()}`,
          preset: request.params.preset,
          volume: request.params.volume || 0.5,
          duration: 'infinite',
          status: 'loaded'
        };
      case 'soundscape.getPresets':
        return [
          { name: 'rain', description: 'Gentle rain on rooftop', duration: 'infinite', category: 'nature' },
          { name: 'wind', description: 'Soft breeze through trees', duration: 'infinite', category: 'nature' },
          { name: 'ocean', description: 'Waves crashing on shore', duration: 'infinite', category: 'nature' },
          { name: 'fire', description: 'Crackling fireplace', duration: 'infinite', category: 'ambient' },
          { name: 'music', description: 'Ambient study music', duration: 'infinite', category: 'music' }
        ];
      case 'soundscape.play':
      case 'soundscape.pause':
      case 'soundscape.stop':
        return { playerId: request.params.playerId, status: method.split('.')[1] };
    }
  }

  // Writing mocks
  if (tool === 'writing') {
    switch (method) {
      case 'manuscript.create':
        return {
          manuscriptId: `ms_${Date.now()}`,
          title: request.params.title,
          template: request.params.template,
          createdAt: new Date().toISOString(),
          wordCount: 0
        };
      case 'manuscript.save':
        return {
          manuscriptId: request.params.manuscriptId,
          version: request.params.version || 'v1',
          savedAt: new Date().toISOString(),
          wordCount: request.params.content?.toString().split(/\s+/).length || 0
        };
      case 'manuscript.export':
        return {
          manuscriptId: request.params.manuscriptId,
          format: request.params.format,
          url: `data:text/plain,${encodeURIComponent('Exported content')}`,
          exportedAt: new Date().toISOString()
        };
    }
  }

  // Learning Cards mocks
  if (tool === 'learning-cards') {
    switch (method) {
      case 'deck.create':
        return {
          deckId: `deck_${Date.now()}`,
          title: request.params.title,
          category: request.params.category,
          cardCount: 0,
          createdAt: new Date().toISOString()
        };
      case 'card.add':
        return {
          cardId: `card_${Date.now()}`,
          deckId: request.params.deckId,
          front: request.params.front,
          back: request.params.back,
          difficulty: request.params.difficulty
        };
      case 'session.start':
        return {
          sessionId: `learn_${Date.now()}`,
          deckId: request.params.deckId,
          mode: request.params.mode,
          totalCards: 10,
          currentCard: 1,
          card: {
            front: 'What is the capital of France?',
            back: 'Paris'
          }
        };
    }
  }

  // Progression mocks
  if (tool === 'progression') {
    switch (method) {
      case 'xp.add':
        return {
          added: request.params.amount,
          total: 1250,
          source: request.params.source,
          levelUp: false
        };
      case 'level.get':
        return {
          xp: 1250,
          level: 5,
          nextLevelXP: 2000,
          progress: 62.5,
          title: 'Adept'
        };
      case 'stats.get':
        return {
          period: request.params.period,
          totalXP: 1250,
          tasksCompleted: 12,
          focusMinutes: 240,
          currentStreak: 3,
          bestStreak: 7
        };
    }
  }

  return { status: 'unknown_tool', tool, method };
}

/**
 * Get available tools for a service
 */
export function getTools(service: string): MCPTool[] {
  return RAT_OS_TOOLS[service] || [];
}

/**
 * Get all available services
 */
export function getServices(): string[] {
  return Object.keys(RAT_OS_TOOLS);
}

/**
 * Check if MCP is configured
 */
export function isMCPConfigured(): boolean {
  return !!mcpConfig.endpoint;
}

/**
 * Build persona-aware MCP request
 */
export function buildRequest(
  tool: string,
  method: string,
  params: Record<string, unknown>,
  persona?: Persona
): MCPRequest {
  return {
    tool,
    method,
    params,
    personaId: persona?.id
  };
}
