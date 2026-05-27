import { useState } from 'react'
import { Shield, Plus, Trash2, Globe, Lock } from 'lucide-react'

interface BlockRule {
  id: string
  domain: string
  blockType: 'always' | 'focus-only' | 'scheduled'
  scheduleStart?: string
  scheduleEnd?: string
}

const DEFAULT_RULES: BlockRule[] = [
  { id: '1', domain: 'twitter.com', blockType: 'focus-only' },
  { id: '2', domain: 'reddit.com', blockType: 'focus-only' },
  { id: '3', domain: 'instagram.com', blockType: 'always' },
]

export function BlockerModule() {
  const [rules, setRules] = useState<BlockRule[]>(() => {
    try {
      const raw = localStorage.getItem('sitegeiste-blocker-rules')
      return raw ? JSON.parse(raw) : DEFAULT_RULES
    } catch { return DEFAULT_RULES }
  })
  const [newDomain, setNewDomain] = useState('')
  const [newType, setNewType] = useState<BlockRule['blockType']>('focus-only')
  const [focusActive, setFocusActive] = useState(false)

  const addRule = () => {
    if (!newDomain.trim()) return
    const rule: BlockRule = {
      id: Math.random().toString(36).substring(2, 9),
      domain: newDomain.trim(),
      blockType: newType,
    }
    const updated = [rule, ...rules]
    setRules(updated)
    localStorage.setItem('sitegeiste-blocker-rules', JSON.stringify(updated))
    setNewDomain('')
  }

  const removeRule = (id: string) => {
    const updated = rules.filter(r => r.id !== id)
    setRules(updated)
    localStorage.setItem('sitegeiste-blocker-rules', JSON.stringify(updated))
  }

  const activeRules = rules.filter(r =>
    r.blockType === 'always' || (r.blockType === 'focus-only' && focusActive)
  )

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-njz-text">Blocker</h2>
        <p className="text-sm text-njz-text-muted">Distraction blocking & focus protection</p>
      </div>

      {/* Focus Toggle */}
      <div className={`p-4 rounded-lg border mb-4 transition-colors ${
        focusActive ? 'border-njz-accent-red bg-njz-accent-red/10' : 'border-njz-border bg-njz-bg-elevated'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className={`w-6 h-6 ${focusActive ? 'text-njz-accent-red' : 'text-njz-text-muted'}`} />
            <div>
              <h3 className="font-medium text-njz-text">Focus Mode</h3>
              <p className="text-xs text-njz-text-muted">
                {focusActive
                  ? `${activeRules.length} sites blocked`
                  : 'Toggle to block focus-only rules'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setFocusActive(!focusActive)}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              focusActive ? 'bg-njz-accent-red' : 'bg-njz-border'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-njz-bg transition-transform ${
                focusActive ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Add Rule */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newDomain}
          onChange={e => setNewDomain(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addRule()}
          placeholder="example.com"
          className="flex-1 bg-njz-bg-elevated border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text placeholder-njz-text-subtle focus:outline-none focus:border-njz-accent-red"
        />
        <select
          value={newType}
          onChange={e => setNewType(e.target.value as BlockRule['blockType'])}
          className="bg-njz-bg-elevated border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text"
        >
          <option value="focus-only">Focus Only</option>
          <option value="always">Always</option>
        </select>
        <button
          onClick={addRule}
          className="p-2 rounded-lg bg-njz-accent-red/20 text-njz-accent-red hover:bg-njz-accent-red/30"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Rules List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {rules.map(rule => {
          const isBlocked = rule.blockType === 'always' || (rule.blockType === 'focus-only' && focusActive)

          return (
            <div
              key={rule.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                isBlocked
                  ? 'border-njz-accent-red/30 bg-njz-accent-red/5'
                  : 'border-njz-border bg-njz-bg-elevated'
              }`}
            >
              {isBlocked ? (
                <Lock className="w-4 h-4 text-njz-accent-red" />
              ) : (
                <Globe className="w-4 h-4 text-njz-text-muted" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-njz-text">{rule.domain}</p>
                <p className="text-xs text-njz-text-muted">{rule.blockType === 'always' ? 'Always blocked' : 'Blocked during focus'}</p>
              </div>
              <button
                onClick={() => removeRule(rule.id)}
                className="p-1 rounded text-njz-text-subtle hover:text-njz-accent-red transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
