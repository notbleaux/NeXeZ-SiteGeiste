import { useState, useEffect, useCallback } from 'react'
import { Plus, CheckSquare, Square, Trash2, Calendar } from 'lucide-react'

interface Task {
  id: string
  title: string
  completed: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: string
  tags: string[]
  createdAt: string
  completedAt?: string
}

const PRIORITY_COLORS = {
  low: 'text-njz-text-subtle border-njz-border',
  medium: 'text-njz-accent-blue border-njz-accent-blue/30',
  high: 'text-njz-accent-orange border-njz-accent-orange/30',
  urgent: 'text-njz-accent-red border-njz-accent-red/30',
}

const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem('sitegeiste-tasks')
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore parse errors
  }
  return []
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem('sitegeiste-tasks', JSON.stringify(tasks))
}

export function TasksModule() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [newTask, setNewTask] = useState('')
  const [newPriority, setNewPriority] = useState<Task['priority']>('medium')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = useCallback(() => {
    if (!newTask.trim()) return
    const task: Task = {
      id: generateId(),
      title: newTask.trim(),
      completed: false,
      priority: newPriority,
      tags: [],
      createdAt: new Date().toISOString(),
    }
    setTasks(prev => [task, ...prev])
    setNewTask('')
    setShowAdd(false)
  }, [newTask, newPriority])

  const toggleTask = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined }
          : t
      )
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    urgent: tasks.filter(t => t.priority === 'urgent' && !t.completed).length,
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-njz-text">Tasks</h2>
          <p className="text-sm text-njz-text-muted">
            {stats.completed}/{stats.total} done · {stats.urgent} urgent
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="p-2 rounded-lg bg-njz-accent-teal/20 text-njz-accent-teal hover:bg-njz-accent-teal/30 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Add Task Form */}
      {showAdd && (
        <div className="mb-4 p-3 rounded-lg bg-njz-bg-elevated border border-njz-border space-y-3">
          <input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="What needs to be done?"
            className="w-full bg-transparent text-njz-text placeholder-njz-text-subtle focus:outline-none"
            autoFocus
          />
          <div className="flex items-center gap-2">
            {( ['low', 'medium', 'high', 'urgent'] as const ).map(p => (
              <button
                key={p}
                onClick={() => setNewPriority(p)}
                className={`px-2 py-1 rounded text-xs border ${PRIORITY_COLORS[p]} ${
                  newPriority === p ? 'bg-njz-bg-overlay' : ''
                }`}
              >
                {PRIORITY_LABELS[p]}
              </button>
            ))}
            <button
              onClick={addTask}
              className="ml-auto px-3 py-1 rounded bg-njz-accent-teal text-njz-bg text-sm font-medium hover:bg-njz-accent-teal/90"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-3">
        {(['all', 'active', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs capitalize transition-colors ${
              filter === f
                ? 'bg-njz-accent-teal/20 text-njz-accent-teal'
                : 'text-njz-text-muted hover:text-njz-text'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-2 -mx-2 px-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-njz-text-subtle">
            <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{filter === 'completed' ? 'No completed tasks yet' : 'No tasks — add one above'}</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className={`group flex items-start gap-3 p-3 rounded-lg border transition-all ${
                task.completed
                  ? 'bg-njz-bg-elevated/30 border-njz-border/30 opacity-60'
                  : 'bg-njz-bg-elevated border-njz-border hover:border-njz-accent-teal/30'
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className="mt-0.5 text-njz-text-subtle hover:text-njz-accent-teal transition-colors"
              >
                {task.completed ? (
                  <CheckSquare className="w-5 h-5 text-njz-accent-teal" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${task.completed ? 'line-through text-njz-text-subtle' : 'text-njz-text'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded border ${PRIORITY_COLORS[task.priority]}`}>
                    {PRIORITY_LABELS[task.priority]}
                  </span>
                  {task.dueDate && (
                    <span className="text-xs text-njz-text-subtle flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded text-njz-text-subtle hover:text-njz-accent-red transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
