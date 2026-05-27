/**
 * State Hub for SiteGeiste Multi-Agent Orchestration
 * Centralized state management with cross-module synchronization
 * Based on Notion Templates Research Report I-018 (State Hub concept)
 *
 * Features:
 * - Atomic state updates with locking
 * - Cross-module state sharing
 * - Session persistence (localStorage + sync to RAT-OS)
 * - State history/audit trail
 * - Optimistic updates with rollback
 */

export interface StateEntry {
  key: string;
  value: unknown;
  moduleId: string;
  personaId?: string;
  timestamp: string;
  version: number;
  locked: boolean;
  lockedBy?: string;
  lockExpires?: string;
}

export interface SessionLog {
  id: string;
  timestamp: string;
  moduleId: string;
  personaId?: string;
  action: string;
  details: Record<string, unknown>;
  stateBefore?: Record<string, unknown>;
  stateAfter?: Record<string, unknown>;
  taskId?: string;
}

export interface StateHubState {
  entries: Record<string, StateEntry>;
  sessionLogs: SessionLog[];
  activeSession: string;
  sessionStarted: string;
  lastSync: string;
  syncEnabled: boolean;
}

const HUB_KEY = 'sitegeiste_state_hub';
const LOCK_TIMEOUT_MS = 30000; // 30 seconds
const MAX_LOGS = 100;

function generateId(): string {
  return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function loadHub(): StateHubState {
  try {
    const stored = localStorage.getItem(HUB_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Fallback
  }
  return {
    entries: {},
    sessionLogs: [],
    activeSession: generateId(),
    sessionStarted: new Date().toISOString(),
    lastSync: new Date().toISOString(),
    syncEnabled: false
  };
}

function saveHub(state: StateHubState): void {
  localStorage.setItem(HUB_KEY, JSON.stringify(state));
}

/**
 * Set state entry with optional locking
 */
export function setState(
  key: string,
  value: unknown,
  moduleId: string,
  options?: {
    personaId?: string;
    lock?: boolean;
    lockTimeoutMs?: number;
  }
): StateEntry | null {
  const hub = loadHub();

  // Check if key is locked by another module
  const existing = hub.entries[key];
  if (existing?.locked && existing.lockedBy !== moduleId) {
    // Check if lock expired
    if (existing.lockExpires) {
      const expires = new Date(existing.lockExpires).getTime();
      if (Date.now() < expires) {
        return null; // Still locked
      }
    } else {
      return null; // Locked with no expiry
    }
  }

  const entry: StateEntry = {
    key,
    value,
    moduleId,
    personaId: options?.personaId,
    timestamp: new Date().toISOString(),
    version: (existing?.version || 0) + 1,
    locked: options?.lock || false,
    lockedBy: options?.lock ? moduleId : undefined,
    lockExpires: options?.lock
      ? new Date(Date.now() + (options.lockTimeoutMs || LOCK_TIMEOUT_MS)).toISOString()
      : undefined
  };

  hub.entries[key] = entry;
  saveHub(hub);

  return entry;
}

/**
 * Get state entry
 */
export function getState(key: string): StateEntry | undefined {
  const hub = loadHub();
  return hub.entries[key];
}

/**
 * Get all state keys for a module
 */
export function getModuleState(moduleId: string): Record<string, unknown> {
  const hub = loadHub();
  const result: Record<string, unknown> = {};

  Object.values(hub.entries).forEach(entry => {
    if (entry.moduleId === moduleId) {
      result[entry.key] = entry.value;
    }
  });

  return result;
}

/**
 * Get shared state (cross-module)
 */
export function getSharedState(): Record<string, StateEntry> {
  const hub = loadHub();
  return hub.entries;
}

/**
 * Release lock on a state entry
 */
export function releaseLock(key: string, moduleId: string): boolean {
  const hub = loadHub();
  const entry = hub.entries[key];

  if (!entry || !entry.locked || entry.lockedBy !== moduleId) {
    return false;
  }

  entry.locked = false;
  entry.lockedBy = undefined;
  entry.lockExpires = undefined;

  saveHub(hub);
  return true;
}

/**
 * Log session action
 */
export function logSession(
  moduleId: string,
  action: string,
  details: Record<string, unknown>,
  options?: {
    personaId?: string;
    taskId?: string;
    stateBefore?: Record<string, unknown>;
    stateAfter?: Record<string, unknown>;
  }
): SessionLog {
  const hub = loadHub();

  const log: SessionLog = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    moduleId,
    personaId: options?.personaId,
    action,
    details,
    stateBefore: options?.stateBefore,
    stateAfter: options?.stateAfter,
    taskId: options?.taskId
  };

  hub.sessionLogs.unshift(log);

  // Keep only last MAX_LOGS
  if (hub.sessionLogs.length > MAX_LOGS) {
    hub.sessionLogs = hub.sessionLogs.slice(0, MAX_LOGS);
  }

  saveHub(hub);
  return log;
}

/**
 * Get session logs with optional filtering
 */
export function getSessionLogs(options?: {
  moduleId?: string;
  personaId?: string;
  taskId?: string;
  limit?: number;
}): SessionLog[] {
  const hub = loadHub();
  let logs = hub.sessionLogs;

  if (options?.moduleId) {
    logs = logs.filter(l => l.moduleId === options.moduleId);
  }

  if (options?.personaId) {
    logs = logs.filter(l => l.personaId === options.personaId);
  }

  if (options?.taskId) {
    logs = logs.filter(l => l.taskId === options.taskId);
  }

  if (options?.limit) {
    logs = logs.slice(0, options.limit);
  }

  return logs;
}

/**
 * Get current session info
 */
export function getCurrentSession(): { id: string; started: string; duration: string } {
  const hub = loadHub();
  const started = new Date(hub.sessionStarted);
  const now = new Date();
  const durationMs = now.getTime() - started.getTime();

  const hours = Math.floor(durationMs / 3600000);
  const minutes = Math.floor((durationMs % 3600000) / 60000);

  return {
    id: hub.activeSession,
    started: hub.sessionStarted,
    duration: `${hours}h ${minutes}m`
  };
}

/**
 * Start new session
 */
export function startNewSession(): void {
  const hub = loadHub();
  hub.activeSession = generateId();
  hub.sessionStarted = new Date().toISOString();
  hub.lastSync = new Date().toISOString();
  saveHub(hub);
}

/**
 * Enable/disable sync to RAT-OS backend
 */
export function setSyncEnabled(enabled: boolean): void {
  const hub = loadHub();
  hub.syncEnabled = enabled;
  saveHub(hub);
}

/**
 * Export hub state for backup/debugging
 */
export function exportHub(): string {
  return JSON.stringify(loadHub(), null, 2);
}

/**
 * Clear all state (use with caution)
 */
export function clearHub(): void {
  localStorage.removeItem(HUB_KEY);
}

/**
 * Get session summary for AI context
 */
export function getSessionSummary(): string {
  const hub = loadHub();
  const session = getCurrentSession();

  const moduleCounts: Record<string, number> = {};
  hub.sessionLogs.forEach(log => {
    moduleCounts[log.moduleId] = (moduleCounts[log.moduleId] || 0) + 1;
  });

  const topModules = Object.entries(moduleCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return `
## Session Summary
- Session ID: ${session.id}
- Started: ${session.started}
- Duration: ${session.duration}
- Total Actions: ${hub.sessionLogs.length}
- Active State Entries: ${Object.keys(hub.entries).length}
- Top Modules: ${topModules.map(([m, c]) => `${m}(${c})`).join(', ') || 'None yet'}
`;
}
