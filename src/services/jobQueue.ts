/**
 * Job Queue System for SiteGeiste Multi-Agent Orchestration
 * Based on Notion Templates Research Report I-018 (Multi-Agent Command Center)
 * 
 * Features:
 * - Atomic claim protocol (prevents duplicate execution)
 * - Task status lifecycle: pending → claimed → in_progress → complete/failed/escalated
 * - Priority levels (low, normal, high, critical)
 * - Timeout handling with escalation
 * - Session log integration
 */

export type TaskStatus = 'pending' | 'claimed' | 'in_progress' | 'complete' | 'failed' | 'escalated' | 'cancelled';
export type TaskPriority = 'low' | 'normal' | 'high' | 'critical';

export interface JobTask {
  id: string;
  title: string;
  description: string;
  moduleId: string;
  personaId: string;
  status: TaskStatus;
  priority: TaskPriority;
  claimedBy?: string;
  claimedAt?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  timeoutMinutes: number;
  payload: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: string;
  escalationReason?: string;
  retryCount: number;
  maxRetries: number;
  tags: string[];
}

export interface JobQueueState {
  tasks: JobTask[];
  lastSync: string;
  queueEnabled: boolean;
  maxConcurrent: number;
}

const QUEUE_KEY = 'sitegeiste_job_queue';
const MAX_CONCURRENT_DEFAULT = 3;

function generateId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function loadQueue(): JobQueueState {
  try {
    const stored = localStorage.getItem(QUEUE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Fallback to empty queue
  }
  return {
    tasks: [],
    lastSync: new Date().toISOString(),
    queueEnabled: true,
    maxConcurrent: MAX_CONCURRENT_DEFAULT
  };
}

function saveQueue(state: JobQueueState): void {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(state));
}

export function enqueueTask(
  title: string,
  description: string,
  moduleId: string,
  personaId: string,
  options?: {
    priority?: TaskPriority;
    timeoutMinutes?: number;
    payload?: Record<string, unknown>;
    maxRetries?: number;
    tags?: string[];
  }
): JobTask {
  const queue = loadQueue();
  
  const task: JobTask = {
    id: generateId(),
    title,
    description,
    moduleId,
    personaId,
    status: 'pending',
    priority: options?.priority || 'normal',
    createdAt: new Date().toISOString(),
    timeoutMinutes: options?.timeoutMinutes || 5,
    payload: options?.payload || {},
    retryCount: 0,
    maxRetries: options?.maxRetries || 3,
    tags: options?.tags || []
  };
  
  queue.tasks.push(task);
  saveQueue(queue);
  
  return task;
}

export function claimTask(taskId: string, claimerId: string): JobTask | null {
  const queue = loadQueue();
  const task = queue.tasks.find(t => t.id === taskId);
  
  if (!task || task.status !== 'pending') {
    return null; // Task not found or already claimed
  }
  
  // Atomic claim: check concurrent limit
  const activeCount = queue.tasks.filter(t => 
    t.status === 'claimed' || t.status === 'in_progress'
  ).length;
  
  if (activeCount >= queue.maxConcurrent) {
    return null; // At capacity
  }
  
  task.status = 'claimed';
  task.claimedBy = claimerId;
  task.claimedAt = new Date().toISOString();
  
  saveQueue(queue);
  return task;
}

export function startTask(taskId: string): JobTask | null {
  const queue = loadQueue();
  const task = queue.tasks.find(t => t.id === taskId);
  
  if (!task || task.status !== 'claimed') {
    return null;
  }
  
  task.status = 'in_progress';
  task.startedAt = new Date().toISOString();
  
  saveQueue(queue);
  return task;
}

export function completeTask(
  taskId: string, 
  result?: Record<string, unknown>
): JobTask | null {
  const queue = loadQueue();
  const task = queue.tasks.find(t => t.id === taskId);
  
  if (!task || task.status !== 'in_progress') {
    return null;
  }
  
  task.status = 'complete';
  task.completedAt = new Date().toISOString();
  task.result = result || {};
  
  saveQueue(queue);
  return task;
}

export function failTask(taskId: string, error: string): JobTask | null {
  const queue = loadQueue();
  const task = queue.tasks.find(t => t.id === taskId);
  
  if (!task || task.status !== 'in_progress') {
    return null;
  }
  
  task.retryCount++;
  
  if (task.retryCount >= task.maxRetries) {
    task.status = 'escalated';
    task.escalationReason = `Failed after ${task.retryCount} retries: ${error}`;
    task.error = error;
  } else {
    task.status = 'pending'; // Re-queue for retry
    task.error = error;
  }
  
  saveQueue(queue);
  return task;
}

export function cancelTask(taskId: string): JobTask | null {
  const queue = loadQueue();
  const task = queue.tasks.find(t => t.id === taskId);
  
  if (!task || ['complete', 'escalated'].includes(task.status)) {
    return null;
  }
  
  task.status = 'cancelled';
  saveQueue(queue);
  return task;
}

export function getTask(taskId: string): JobTask | undefined {
  const queue = loadQueue();
  return queue.tasks.find(t => t.id === taskId);
}

export function getPendingTasks(): JobTask[] {
  const queue = loadQueue();
  return queue.tasks
    .filter(t => t.status === 'pending')
    .sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
}

export function getActiveTasks(): JobTask[] {
  const queue = loadQueue();
  return queue.tasks.filter(t => 
    t.status === 'claimed' || t.status === 'in_progress'
  );
}

export function getCompletedTasks(): JobTask[] {
  const queue = loadQueue();
  return queue.tasks
    .filter(t => t.status === 'complete')
    .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime());
}

export function getEscalatedTasks(): JobTask[] {
  const queue = loadQueue();
  return queue.tasks.filter(t => t.status === 'escalated');
}

export function getAllTasks(): JobTask[] {
  return loadQueue().tasks;
}

export function getTasksByModule(moduleId: string): JobTask[] {
  const queue = loadQueue();
  return queue.tasks.filter(t => t.moduleId === moduleId);
}

export function getTasksByPersona(personaId: string): JobTask[] {
  const queue = loadQueue();
  return queue.tasks.filter(t => t.personaId === personaId);
}

/**
 * Timeout checker — call periodically to escalate timed-out tasks
 */
export function checkTimeouts(): JobTask[] {
  const queue = loadQueue();
  const now = new Date().getTime();
  const escalated: JobTask[] = [];
  
  queue.tasks.forEach(task => {
    if (task.status !== 'in_progress' || !task.startedAt) return;
    
    const startTime = new Date(task.startedAt).getTime();
    const timeoutMs = task.timeoutMinutes * 60 * 1000;
    
    if (now - startTime > timeoutMs) {
      task.status = 'escalated';
      task.escalationReason = `Timeout exceeded: ${task.timeoutMinutes} minutes`;
      escalated.push(task);
    }
  });
  
  if (escalated.length > 0) {
    saveQueue(queue);
  }
  
  return escalated;
}

/**
 * Cleanup old completed tasks (keep last 50)
 */
export function cleanupCompletedTasks(): void {
  const queue = loadQueue();
  const completed = queue.tasks.filter(t => t.status === 'complete');
  
  if (completed.length > 50) {
    const toRemove = completed.slice(50);
    queue.tasks = queue.tasks.filter(t => !toRemove.includes(t));
    saveQueue(queue);
  }
}

export function clearQueue(): void {
  localStorage.removeItem(QUEUE_KEY);
}

/**
 * Export queue for debugging/backup
 */
export function exportQueue(): string {
  return JSON.stringify(loadQueue(), null, 2);
}

/**
 * Import queue from backup
 */
export function importQueue(json: string): boolean {
  try {
    const parsed = JSON.parse(json);
    if (parsed.tasks && Array.isArray(parsed.tasks)) {
      saveQueue(parsed);
      return true;
    }
  } catch {
    return false;
  }
  return false;
}
