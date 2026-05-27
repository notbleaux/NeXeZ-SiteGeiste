/**
 * Persona Memory System for SiteGeiste
 * Persistent per-persona memory across sessions
 * Based on Notion Templates Research I-019, I-022, I-023 memory concepts
 * 
 * Features:
 * - Per-persona memory storage (preferences, history, patterns)
 * - Memory types: facts, preferences, patterns, relationships, goals
 * - Auto-summarization for long histories
 * - Memory retrieval with relevance scoring
 * - Privacy: memories isolated per persona
 */

export type MemoryType = 'fact' | 'preference' | 'pattern' | 'relationship' | 'goal' | 'reflection' | 'limitation';

export interface MemoryEntry {
  id: string;
  personaId: string;
  type: MemoryType;
  key: string;           // e.g., "user_preferred_work_hours"
  value: string;         // The memory content
  context?: string;      // Optional context about when/why this was formed
  importance: number;    // 1-10, higher = more important
  createdAt: string;
  updatedAt: string;
  accessCount: number;   // How many times retrieved
  lastAccessed?: string;
  tags: string[];
  source: 'explicit' | 'inferred' | 'user_stated' | 'observed';
  confidence: number;    // 0-1, how sure we are about this memory
}

export interface PersonaMemoryState {
  entries: MemoryEntry[];
  personaId: string;
  summary: string;       // Auto-generated summary of key memories
  lastSummaryUpdate: string;
  memoryLimit: number;   // Max entries before summarization
}

const MEMORY_KEY_PREFIX = 'sitegeiste_persona_memory_';
const DEFAULT_MEMORY_LIMIT = 100;

function getStorageKey(personaId: string): string {
  return `${MEMORY_KEY_PREFIX}${personaId}`;
}

function generateId(): string {
  return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function loadPersonaMemory(personaId: string): PersonaMemoryState {
  try {
    const stored = localStorage.getItem(getStorageKey(personaId));
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Fallback
  }
  return {
    entries: [],
    personaId,
    summary: '',
    lastSummaryUpdate: new Date().toISOString(),
    memoryLimit: DEFAULT_MEMORY_LIMIT
  };
}

function savePersonaMemory(state: PersonaMemoryState): void {
  localStorage.setItem(getStorageKey(state.personaId), JSON.stringify(state));
}

/**
 * Store a memory for a persona
 */
export function storeMemory(
  personaId: string,
  type: MemoryType,
  key: string,
  value: string,
  options?: {
    context?: string;
    importance?: number;
    tags?: string[];
    source?: 'explicit' | 'inferred' | 'user_stated' | 'observed';
    confidence?: number;
  }
): MemoryEntry {
  const state = loadPersonaMemory(personaId);
  const now = new Date().toISOString();

  // Check if memory with this key already exists
  const existingIndex = state.entries.findIndex(e => e.key === key && e.type === type);

  if (existingIndex >= 0) {
    // Update existing
    const existing = state.entries[existingIndex];
    existing.value = value;
    existing.updatedAt = now;
    existing.importance = options?.importance ?? existing.importance;
    existing.context = options?.context ?? existing.context;
    existing.tags = options?.tags ?? existing.tags;
    existing.confidence = options?.confidence ?? existing.confidence;
    existing.source = options?.source ?? existing.source;

    savePersonaMemory(state);
    return existing;
  }

  // Create new memory
  const entry: MemoryEntry = {
    id: generateId(),
    personaId,
    type,
    key,
    value,
    context: options?.context,
    importance: options?.importance ?? 5,
    createdAt: now,
    updatedAt: now,
    accessCount: 0,
    tags: options?.tags ?? [],
    source: options?.source ?? 'inferred',
    confidence: options?.confidence ?? 0.7
  };

  state.entries.push(entry);

  // Check if we need to summarize
  if (state.entries.length > state.memoryLimit) {
    summarizeMemories(state);
  }

  savePersonaMemory(state);
  return entry;
}

/**
 * Retrieve memories for a persona
 */
export function retrieveMemories(
  personaId: string,
  options?: {
    type?: MemoryType;
    tags?: string[];
    minImportance?: number;
    query?: string;        // Fuzzy search
    limit?: number;
    sortBy?: 'importance' | 'recency' | 'access';
  }
): MemoryEntry[] {
  const state = loadPersonaMemory(personaId);
  let results = [...state.entries];

  // Filter by type
  if (options?.type) {
    results = results.filter(e => e.type === options.type);
  }

  // Filter by tags
  if (options?.tags && options.tags.length > 0) {
    results = results.filter(e =>
      options.tags!.some(tag => e.tags.includes(tag))
    );
  }

  // Filter by importance
  if (options?.minImportance) {
    results = results.filter(e => e.importance >= options.minImportance!);
  }

  // Fuzzy search
  if (options?.query) {
    const query = options.query.toLowerCase();
    results = results.filter(e =>
      e.key.toLowerCase().includes(query) ||
      e.value.toLowerCase().includes(query) ||
      e.context?.toLowerCase().includes(query)
    );
  }

  // Sort
  const sortBy = options?.sortBy ?? 'importance';
  results.sort((a, b) => {
    switch (sortBy) {
      case 'importance':
        return b.importance - a.importance;
      case 'recency':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'access':
        return b.accessCount - a.accessCount;
      default:
        return 0;
    }
  });

  // Update access counts
  const now = new Date().toISOString();
  results.slice(0, options?.limit ?? 10).forEach(e => {
    e.accessCount++;
    e.lastAccessed = now;
  });

  savePersonaMemory(state);

  return results.slice(0, options?.limit ?? 10);
}

/**
 * Get a specific memory by key
 */
export function getMemory(personaId: string, key: string, type?: MemoryType): MemoryEntry | undefined {
  const state = loadPersonaMemory(personaId);
  const entry = state.entries.find(e => e.key === key && (!type || e.type === type));

  if (entry) {
    entry.accessCount++;
    entry.lastAccessed = new Date().toISOString();
    savePersonaMemory(state);
  }

  return entry;
}

/**
 * Delete a memory
 */
export function deleteMemory(personaId: string, memoryId: string): boolean {
  const state = loadPersonaMemory(personaId);
  const initialLength = state.entries.length;
  state.entries = state.entries.filter(e => e.id !== memoryId);

  if (state.entries.length < initialLength) {
    savePersonaMemory(state);
    return true;
  }
  return false;
}

/**
 * Get memory summary for persona context
 */
export function getMemorySummary(personaId: string): string {
  const state = loadPersonaMemory(personaId);

  if (state.summary && state.entries.length <= state.memoryLimit) {
    return state.summary;
  }

  // Generate fresh summary
  summarizeMemories(state);
  return state.summary;
}

/**
 * Auto-summarize memories when limit exceeded
 */
function summarizeMemories(state: PersonaMemoryState): void {
  const topMemories = [...state.entries]
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 20);

  const summary = topMemories.map(e =>
    `[${e.type}] ${e.key}: ${e.value.substring(0, 100)}${e.value.length > 100 ? '...' : ''}`
  ).join('\n');

  state.summary = summary;
  state.lastSummaryUpdate = new Date().toISOString();

  // Archive old memories (keep top 50 by importance)
  const kept = [...state.entries]
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 50);

  state.entries = kept;
  savePersonaMemory(state);
}

/**
 * Get all memories across all personas
 */
export function getAllMemories(): Record<string, PersonaMemoryState> {
  const result: Record<string, PersonaMemoryState> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(MEMORY_KEY_PREFIX)) {
      const personaId = key.replace(MEMORY_KEY_PREFIX, '');
      try {
        result[personaId] = JSON.parse(localStorage.getItem(key) || '{}');
      } catch {
        // Skip invalid entries
      }
    }
  }

  return result;
}

/**
 * Clear all memories for a persona
 */
export function clearPersonaMemory(personaId: string): void {
  localStorage.removeItem(getStorageKey(personaId));
}

/**
 * Export memories for backup
 */
export function exportMemories(personaId: string): string {
  return JSON.stringify(loadPersonaMemory(personaId), null, 2);
}

/**
 * Import memories from backup
 */
export function importMemories(personaId: string, json: string): boolean {
  try {
    const parsed = JSON.parse(json);
    if (parsed.entries && Array.isArray(parsed.entries)) {
      parsed.personaId = personaId;
      savePersonaMemory(parsed);
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

/**
 * Store an interaction memory (what the user told the persona)
 */
export function storeInteraction(
  personaId: string,
  userMessage: string,
  assistantResponse: string,
  moduleContext?: string
): void {
  storeMemory(personaId, 'pattern', `interaction_${Date.now()}`, userMessage, {
    context: `Response: ${assistantResponse.substring(0, 200)}${assistantResponse.length > 200 ? '...' : ''}${moduleContext ? ` | Module: ${moduleContext}` : ''}`,
    importance: 3,
    source: 'observed',
    tags: ['interaction', moduleContext ?? 'general']
  });
}

/**
 * Get memories formatted for persona prompt context
 */
export function getMemoriesForPrompt(personaId: string, contextQuery?: string): string {
  const memories = retrieveMemories(personaId, {
    query: contextQuery,
    minImportance: 5,
    limit: 15,
    sortBy: 'importance'
  });

  if (memories.length === 0) {
    return '';
  }

  const sections: Record<string, MemoryEntry[]> = {};
  memories.forEach(m => {
    if (!sections[m.type]) sections[m.type] = [];
    sections[m.type].push(m);
  });

  const parts: string[] = ['## Memory Context'];

  Object.entries(sections).forEach(([type, entries]) => {
    parts.push(`\n### ${type.charAt(0).toUpperCase() + type.slice(1)}s`);
    entries.forEach(e => {
      parts.push(`- ${e.key}: ${e.value.substring(0, 150)}${e.value.length > 150 ? '...' : ''}`);
    });
  });

  return parts.join('\n');
}