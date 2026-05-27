import { useState, useEffect, useCallback } from 'react'
import { X, Send, Bot, User, Sparkles, Lightbulb, Heart, Search, Palette, Settings, ChevronDown, Activity, CheckCircle, AlertTriangle, Clock, ListTodo, Zap } from 'lucide-react'
import { Persona, getAllPersonas, getPersona } from '../../services/personas'
import { getPendingTasks, getEscalatedTasks, getActiveTasks, checkTimeouts, JobTask } from '../../services/jobQueue'
import { getSessionLogs, getCurrentSession } from '../../services/stateHub'

interface AISidebarProps {
  onClose: () => void
  currentModule?: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  personaId?: string
}

type SidebarView = 'chat' | 'queue' | 'session' | 'personas'

export function AISidebar({ onClose, currentModule = 'welcome' }: AISidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to SiteGeiste Multi-Agent Workspace. I am the Strategist — your central orchestrator. Select a persona below for specialized assistance.',
      timestamp: new Date(),
      personaId: 'strategist',
    },
  ])
  const [input, setInput] = useState('')
  const [activePersona, setActivePersona] = useState<Persona>(getPersona('strategist'))
  const [view, setView] = useState<SidebarView>('chat')
  const [pendingTasks, setPendingTasks] = useState<JobTask[]>([])
  const [escalatedTasks, setEscalatedTasks] = useState<JobTask[]>([])
  const [activeTasks, setActiveTasks] = useState<JobTask[]>([])
  const [sessionInfo, setSessionInfo] = useState(getCurrentSession())
  const [showPersonaSelector, setShowPersonaSelector] = useState(false)

  const personas = getAllPersonas()

  // Load tasks periodically
  useEffect(() => {
    const interval = setInterval(() => {
      checkTimeouts()
      setPendingTasks(getPendingTasks())
      setEscalatedTasks(getEscalatedTasks())
      setActiveTasks(getActiveTasks())
      setSessionInfo(getCurrentSession())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Initial load
  useEffect(() => {
    setPendingTasks(getPendingTasks())
    setEscalatedTasks(getEscalatedTasks())
    setActiveTasks(getActiveTasks())
  }, [])

  const handleSend = useCallback(() => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')

    // Generate persona-aware response
    setTimeout(() => {
      const response = generatePersonaResponse(activePersona, input, currentModule)

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        personaId: activePersona.id,
      }
      setMessages(prev => [...prev, aiMsg])
    }, 800)
  }, [input, activePersona, currentModule])

  const selectPersona = (personaId: string) => {
    const persona = getPersona(personaId)
    setActivePersona(persona)
    setShowPersonaSelector(false)

    // Add system message about persona switch
    const switchMsg: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Switched to **${persona.name}** — ${persona.role}. ${persona.description}`,
      timestamp: new Date(),
      personaId: persona.id,
    }
    setMessages(prev => [...prev, switchMsg])
  }

  const getPersonaIcon = (personaId: string) => {
    switch (personaId) {
      case 'strategist': return <Sparkles className="w-4 h-4" />
      case 'edison': return <Lightbulb className="w-4 h-4" />
      case 'dostoevsky': return <Heart className="w-4 h-4" />
      case 'helix': return <Search className="w-4 h-4" />
      case 'momo': return <Palette className="w-4 h-4" />
      case 'jessie': return <Settings className="w-4 h-4" />
      default: return <Bot className="w-4 h-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />
      case 'claimed':
      case 'in_progress': return <Activity className="w-4 h-4 text-njz-accent-teal" />
      case 'complete': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'failed':
      case 'escalated': return <AlertTriangle className="w-4 h-4 text-red-400" />
      default: return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <aside className="w-80 bg-njz-bg-elevated border-l border-njz-border flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="h-14 border-b border-njz-border flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${activePersona.color} bg-opacity-20`}>
            {getPersonaIcon(activePersona.id)}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-njz-text text-sm">{activePersona.name}</span>
            <span className="text-xs text-njz-text-muted">{activePersona.role}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowPersonaSelector(!showPersonaSelector)}
            className="p-1.5 rounded-lg hover:bg-njz-bg-overlay text-njz-text-muted"
            title="Switch Persona"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-njz-bg-overlay text-njz-text-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Persona Selector Dropdown */}
      {showPersonaSelector && (
        <div className="border-b border-njz-border bg-njz-bg-overlay p-2 space-y-1 max-h-48 overflow-y-auto">
          {personas.map(persona => (
            <button
              key={persona.id}
              onClick={() => selectPersona(persona.id)}
              className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
                activePersona.id === persona.id
                  ? 'bg-njz-accent-teal/20 text-njz-accent-teal'
                  : 'hover:bg-njz-bg text-njz-text'
              }`}
            >
              <div className={persona.color}>{getPersonaIcon(persona.id)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{persona.name}</div>
                <div className="text-xs text-njz-text-muted truncate">{persona.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* View Tabs */}
      <div className="flex border-b border-njz-border">
        {[
          { id: 'chat' as SidebarView, label: 'Chat', icon: <Bot className="w-3.5 h-3.5" /> },
          { id: 'queue' as SidebarView, label: 'Queue', icon: <ListTodo className="w-3.5 h-3.5" /> },
          { id: 'session' as SidebarView, label: 'Session', icon: <Activity className="w-3.5 h-3.5" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
              view === tab.id
                ? 'text-njz-accent-teal border-b-2 border-njz-accent-teal'
                : 'text-njz-text-muted hover:text-njz-text'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chat View */}
      {view === 'chat' && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'assistant'
                    ? 'bg-njz-accent-teal/20'
                    : 'bg-njz-accent-purple/20'
                }`}>
                  {msg.role === 'assistant'
                    ? (msg.personaId ? (
                      <div className={getPersona(msg.personaId).color}>
                        {getPersonaIcon(msg.personaId)}
                      </div>
                    ) : <Bot className="w-4 h-4 text-njz-accent-teal" />)
                    : <User className="w-4 h-4 text-njz-accent-purple" />
                  }
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  msg.role === 'assistant'
                    ? 'bg-njz-bg-overlay text-njz-text'
                    : 'bg-njz-accent-teal text-white'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-njz-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={`Ask ${activePersona.name}...`}
                className="flex-1 bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text placeholder:text-njz-text-subtle focus:outline-none focus:border-njz-accent-teal/50"
              />
              <button
                onClick={handleSend}
                className="p-2 bg-njz-accent-teal rounded-lg text-white hover:bg-njz-accent-teal/80 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Queue View */}
      {view === 'queue' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-njz-bg-overlay rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-njz-accent-teal">{pendingTasks.length}</div>
              <div className="text-xs text-njz-text-muted">Pending</div>
            </div>
            <div className="bg-njz-bg-overlay rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-yellow-400">{activeTasks.length}</div>
              <div className="text-xs text-njz-text-muted">Active</div>
            </div>
            <div className="bg-njz-bg-overlay rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-red-400">{escalatedTasks.length}</div>
              <div className="text-xs text-njz-text-muted">Escalated</div>
            </div>
          </div>

          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-njz-text-muted uppercase mb-2">Pending</h3>
              <div className="space-y-2">
                {pendingTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="bg-njz-bg-overlay rounded-lg p-3 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(task.status)}
                      <span className="text-njz-text font-medium truncate">{task.title}</span>
                    </div>
                    <div className="text-xs text-njz-text-muted">{task.moduleId} • {task.priority}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Escalated Tasks */}
          {escalatedTasks.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-red-400 uppercase mb-2">Escalated</h3>
              <div className="space-y-2">
                {escalatedTasks.map(task => (
                  <div key={task.id} className="bg-red-900/20 border border-red-900/30 rounded-lg p-3 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-njz-text font-medium truncate">{task.title}</span>
                    </div>
                    <div className="text-xs text-red-300">{task.escalationReason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pendingTasks.length === 0 && escalatedTasks.length === 0 && (
            <div className="text-center py-8 text-njz-text-muted">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <p className="text-sm">All tasks complete</p>
            </div>
          )}
        </div>
      )}

      {/* Session View */}
      {view === 'session' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Session Info */}
          <div className="bg-njz-bg-overlay rounded-lg p-4">
            <h3 className="text-sm font-semibold text-njz-text mb-2">Current Session</h3>
            <div className="space-y-1 text-xs text-njz-text-muted">
              <div className="flex justify-between">
                <span>ID:</span>
                <span className="text-njz-text font-mono">{sessionInfo.id.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="text-njz-text">{sessionInfo.duration}</span>
              </div>
            </div>
          </div>

          {/* Active Persona */}
          <div className="bg-njz-bg-overlay rounded-lg p-4">
            <h3 className="text-sm font-semibold text-njz-text mb-2">Active Persona</h3>
            <div className="flex items-center gap-2">
              <div className={activePersona.color}>{getPersonaIcon(activePersona.id)}</div>
              <div>
                <div className="text-sm font-medium text-njz-text">{activePersona.name}</div>
                <div className="text-xs text-njz-text-muted">{activePersona.role}</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-sm font-semibold text-njz-text mb-2">Recent Activity</h3>
            <div className="space-y-2">
              {getSessionLogs({ limit: 5 }).map(log => (
                <div key={log.id} className="bg-njz-bg-overlay rounded-lg p-2 text-xs">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap className="w-3 h-3 text-njz-accent-teal" />
                    <span className="text-njz-text font-medium">{log.action}</span>
                  </div>
                  <div className="text-njz-text-muted">
                    {log.moduleId} • {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

// Generate persona-aware response (placeholder — will connect to real LLM)
function generatePersonaResponse(persona: Persona, input: string, moduleId: string): string {
  // Route to appropriate response generator
  switch (persona.id) {
    case 'edison':
      return `**Edison Experiment Protocol Activated**

I've analyzed your request: "${input}". Let's break this into a testable hypothesis:

**Hypothesis:** [Your idea] can be validated through a structured experiment.

**Experiment Design:**
1. **Variable:** Define the single variable to test
2. **Control:** Establish baseline metrics
3. **Measurement:** Define success criteria
4. **Duration:** Recommend 1-2 week trial

Would you like me to draft a detailed BOM (Bill of Materials) and test matrix for this experiment?`

    case 'dostoevsky':
      return `*Dostoevsky adjusts his spectacles and leans forward*

"${input}"... You bring me a question that touches the human paradox. Let us not rush to answers.

**Shadow Work:** What part of yourself resists this question? What fear or desire hides beneath?

**Light Work:** What virtue in you already knows the direction, even if the path is unclear?

**The Paradox:** Every choice contains its opposite. To choose one thing is to grieve another. This is not failure — this is the weight of being human.

Shall we explore what you are truly asking, beneath the words?`

    case 'helix':
      return `**Helix Fact-Check Protocol**

Claim identified: "${input}"

**Truth Table (Preliminary):**
| Claim | Status | Evidence | Confidence |
|-------|--------|----------|------------|
| Primary claim | UNVERIFIED | Awaiting sources | — |

**Required for verification:**
- ≥2 high-quality independent sources
- Official filings or reputable outlets
- Absolute dates (e.g., 2025-09-26)

Please provide specific claims to fact-check, and I will verify with source attribution. I cannot speculate — only verify.`

    case 'momo':
      return `**Momo Creative Territory Card**

Input: "${input}"

**Creative Territory 1: [Core Promise]**
- One-liner: *What we stand for*
- Signature asset: Visual/verbal hook
- Do: Brand-aligned actions
- Don't: Cliche territory

**Creative Territory 2: [Alternative Route]**
- One-liner: *Different angle, same promise*
- Signature asset: Platform-specific optimization
- Do: Unexpected but ownable
- Don't: Imitation of competitors

**Creative Territory 3: [Experimental Route]**
- One-liner: *Stretch positioning*
- Signature asset: High-risk, high-reward
- Feasibility flag: Timeline/cost assessment needed

Which territory shall we deepen?`

    case 'jessie':
      return `**Jessie Ops Schema**

Request: "${input}"

**Recommended Schema:**
1. **Database:** Create table with these fields
2. **Views:** Filter by status (Active/Complete/Archive)
3. **Templates:** Auto-fill for recurring items
4. **SOP:** Step-by-step workflow

**Implementation Steps:**
- Do this → See that
- Do this → See that
- Do this → See that

**Optimization:** Numbered checklist for fastest execution. Minimal clicks. Printable template available.

Shall I draft the full schema spec with field types and relations?`

    case 'strategist':
    default:
      return `**Strategist Analysis**

Input received: "${input}"

**Intent Classification:** User is interacting with ${moduleId} module.

**Routing Recommendation:**
- For experimentation → Switch to **Edison**
- For introspection → Switch to **Dostoevsky**
- For fact-checking → Switch to **Helix**
- For creative work → Switch to **Momo**
- For system design → Switch to **Jessie**

**Current Session:** ${getCurrentSession().duration} active.

How would you like to proceed?`
  }
}
