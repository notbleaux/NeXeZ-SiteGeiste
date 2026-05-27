import { useState } from 'react'
import { Lightbulb, FlaskConical, Target, ClipboardList, TrendingUp, Plus, Trash2, Play, CheckCircle, XCircle, Clock, FileText } from 'lucide-react'

interface Experiment {
  id: string
  name: string
  hypothesis: string
  variable: string
  control: string
  metrics: string[]
  duration: string
  status: 'draft' | 'running' | 'completed' | 'cancelled'
  results?: {
    outcome: 'success' | 'failure' | 'inconclusive'
    observations: string
    data: string
    conclusion: string
  }
  createdAt: string
  completedAt?: string
}

interface BOMItem {
  id: string
  name: string
  quantity: number
  unit: string
  cost: number
  notes: string
}

export function ExperimentModule() {
  const [experiments, setExperiments] = useState<Experiment[]>(() => {
    const stored = localStorage.getItem('edison_experiments')
    return stored ? JSON.parse(stored) : []
  })
  const [activeExperiment, setActiveExperiment] = useState<Experiment | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newExperiment, setNewExperiment] = useState({
    name: '',
    hypothesis: '',
    variable: '',
    control: '',
    metrics: [''],
    duration: '1 week'
  })
  const [bom, setBom] = useState<BOMItem[]>([])
  const [showBOM, setShowBOM] = useState(false)

  const saveExperiments = (updated: Experiment[]) => {
    setExperiments(updated)
    localStorage.setItem('edison_experiments', JSON.stringify(updated))
  }

  const createExperiment = () => {
    if (!newExperiment.name.trim() || !newExperiment.hypothesis.trim()) return
    
    const exp: Experiment = {
      id: `exp_${Date.now()}`,
      name: newExperiment.name,
      hypothesis: newExperiment.hypothesis,
      variable: newExperiment.variable,
      control: newExperiment.control,
      metrics: newExperiment.metrics.filter(m => m.trim()),
      duration: newExperiment.duration,
      status: 'draft',
      createdAt: new Date().toISOString()
    }
    
    saveExperiments([...experiments, exp])
    setActiveExperiment(exp)
    setNewExperiment({ name: '', hypothesis: '', variable: '', control: '', metrics: [''], duration: '1 week' })
    setShowCreateForm(false)
    
    // Generate default BOM
    generateBOM(exp)
  }

  const generateBOM = (_exp: Experiment) => {
    const defaultBOM: BOMItem[] = [
      { id: `bom_${Date.now()}_1`, name: 'Time allocation', quantity: 1, unit: 'hours/day', cost: 0, notes: 'Personal time investment' },
      { id: `bom_${Date.now()}_2`, name: 'Measurement tool', quantity: 1, unit: 'tool', cost: 0, notes: 'Tracking mechanism' },
      { id: `bom_${Date.now()}_3`, name: 'Control environment', quantity: 1, unit: 'setup', cost: 0, notes: 'Baseline conditions' }
    ]
    setBom(defaultBOM)
  }

  const startExperiment = (expId: string) => {
    const updated = experiments.map(e =>
      e.id === expId ? { ...e, status: 'running' as const } : e
    )
    saveExperiments(updated)
    if (activeExperiment?.id === expId) {
      setActiveExperiment({ ...activeExperiment, status: 'running' })
    }
  }

  const completeExperiment = (expId: string, outcome: 'success' | 'failure' | 'inconclusive') => {
    const updated = experiments.map(e =>
      e.id === expId ? {
        ...e,
        status: 'completed' as const,
        completedAt: new Date().toISOString(),
        results: {
          outcome,
          observations: 'Experiment completed. Detailed observations logged.',
          data: 'Metrics data collected during experiment period.',
          conclusion: outcome === 'success'
            ? 'Hypothesis validated. Variable showed expected impact.'
            : outcome === 'failure'
            ? 'Hypothesis rejected. Variable did not produce expected effect.'
            : 'Results inconclusive. Further testing required.'
        }
      } : e
    )
    saveExperiments(updated)
    if (activeExperiment?.id === expId) {
      setActiveExperiment(updated.find(e => e.id === expId) || null)
    }
  }

  const deleteExperiment = (expId: string) => {
    const updated = experiments.filter(e => e.id !== expId)
    saveExperiments(updated)
    if (activeExperiment?.id === expId) setActiveExperiment(null)
  }

  const addBOMItem = () => {
    setBom([...bom, {
      id: `bom_${Date.now()}_${bom.length + 1}`,
      name: '',
      quantity: 1,
      unit: 'unit',
      cost: 0,
      notes: ''
    }])
  }

  const updateBOMItem = (id: string, field: keyof BOMItem, value: string | number) => {
    setBom(bom.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const removeBOMItem = (id: string) => {
    setBom(bom.filter(item => item.id !== id))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <FlaskConical className="w-5 h-5 text-njz-accent-teal" />
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-400" />
      default: return <FileText className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-400 border border-gray-700">Draft</span>
      case 'running':
        return <span className="px-2 py-0.5 rounded text-xs bg-njz-accent-teal/20 text-njz-accent-teal border border-njz-accent-teal/30">Running</span>
      case 'completed':
        return <span className="px-2 py-0.5 rounded text-xs bg-green-900/30 text-green-400 border border-green-900/50">Completed</span>
      case 'cancelled':
        return <span className="px-2 py-0.5 rounded text-xs bg-red-900/30 text-red-400 border border-red-900/50">Cancelled</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-yellow-400/20">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-njz-text">Experiments</h2>
          <p className="text-sm text-njz-text-muted">Edison experimentation protocol</p>
        </div>
      </div>

      {!activeExperiment ? (
        <>
          {/* Create New Experiment */}
          <div className="bg-njz-bg-overlay rounded-lg p-4">
            {!showCreateForm ? (
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 text-njz-accent-teal hover:underline text-sm"
              >
                <Plus className="w-4 h-4" />
                New Experiment
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={newExperiment.name}
                  onChange={e => setNewExperiment({ ...newExperiment, name: e.target.value })}
                  placeholder="Experiment name"
                  className="w-full bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text placeholder:text-njz-text-subtle"
                />
                <textarea
                  value={newExperiment.hypothesis}
                  onChange={e => setNewExperiment({ ...newExperiment, hypothesis: e.target.value })}
                  placeholder="Hypothesis: If [variable], then [expected outcome]..."
                  className="w-full h-20 bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text placeholder:text-njz-text-subtle resize-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newExperiment.variable}
                    onChange={e => setNewExperiment({ ...newExperiment, variable: e.target.value })}
                    placeholder="Variable to test"
                    className="w-full bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text placeholder:text-njz-text-subtle"
                  />
                  <input
                    type="text"
                    value={newExperiment.control}
                    onChange={e => setNewExperiment({ ...newExperiment, control: e.target.value })}
                    placeholder="Control (baseline)"
                    className="w-full bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text placeholder:text-njz-text-subtle"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={createExperiment}
                    className="px-4 py-2 bg-njz-accent-teal rounded-lg text-white text-sm font-medium"
                  >
                    Create Experiment
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-njz-border rounded-lg text-njz-text text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Experiments List */}
          {experiments.length === 0 ? (
            <div className="text-center py-12 text-njz-text-muted">
              <FlaskConical className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No experiments yet</p>
              <p className="text-xs mt-1">Create an experiment to test a hypothesis</p>
            </div>
          ) : (
            <div className="space-y-2">
              {experiments.map(exp => (
                <button
                  key={exp.id}
                  onClick={() => setActiveExperiment(exp)}
                  className="w-full text-left bg-njz-bg-overlay hover:bg-njz-bg-surface rounded-lg p-4 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(exp.status)}
                      <div>
                        <h3 className="text-njz-text font-medium text-sm">{exp.name}</h3>
                        <p className="text-xs text-njz-text-muted mt-0.5 line-clamp-2">
                          {exp.hypothesis}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusBadge(exp.status)}
                          <span className="text-xs text-njz-text-muted">{exp.duration}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); deleteExperiment(exp.id) }}
                      className="p-1 text-njz-text-muted hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Active Experiment */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveExperiment(null)}
              className="text-sm text-njz-text-muted hover:text-njz-text"
            >
              ← Back to experiments
            </button>
            <button
              onClick={() => deleteExperiment(activeExperiment.id)}
              className="p-1.5 text-njz-text-muted hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Experiment Details */}
          <div className="bg-njz-bg-overlay rounded-lg p-4 border border-njz-border">
            <div className="flex items-center gap-3 mb-3">
              {getStatusIcon(activeExperiment.status)}
              <div>
                <h3 className="text-njz-text font-semibold">{activeExperiment.name}</h3>
                {getStatusBadge(activeExperiment.status)}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-njz-text-muted uppercase">Hypothesis</p>
                <p className="text-sm text-njz-text mt-0.5">{activeExperiment.hypothesis}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium text-njz-text-muted uppercase">Variable</p>
                  <p className="text-sm text-njz-text mt-0.5">{activeExperiment.variable}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-njz-text-muted uppercase">Control</p>
                  <p className="text-sm text-njz-text mt-0.5">{activeExperiment.control}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-njz-text-muted uppercase">Metrics</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {activeExperiment.metrics.map((metric, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-xs bg-njz-bg border border-njz-border text-njz-text">
                      <Target className="w-3 h-3 inline mr-1" />
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-njz-text-muted">
                <Clock className="w-3.5 h-3.5" />
                Duration: {activeExperiment.duration}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              {activeExperiment.status === 'draft' && (
                <button
                  onClick={() => startExperiment(activeExperiment.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-njz-accent-teal rounded-lg text-white text-sm font-medium"
                >
                  <Play className="w-4 h-4" />
                  Start Experiment
                </button>
              )}
              {activeExperiment.status === 'running' && (
                <>
                  <button
                    onClick={() => completeExperiment(activeExperiment.id, 'success')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-900/30 border border-green-900/50 rounded-lg text-sm text-green-400"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Success
                  </button>
                  <button
                    onClick={() => completeExperiment(activeExperiment.id, 'failure')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-900/30 border border-red-900/50 rounded-lg text-sm text-red-400"
                  >
                    <XCircle className="w-4 h-4" />
                    Mark Failure
                  </button>
                  <button
                    onClick={() => completeExperiment(activeExperiment.id, 'inconclusive')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-yellow-900/30 border border-yellow-900/50 rounded-lg text-sm text-yellow-400"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Inconclusive
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Results */}
          {activeExperiment.results && (
            <div className="bg-njz-bg-overlay rounded-lg p-4 border border-njz-border">
              <h4 className="text-sm font-semibold text-njz-text mb-3">Results</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-njz-text-muted">Outcome: </span>
                  <span className={`text-sm font-medium ${
                    activeExperiment.results.outcome === 'success' ? 'text-green-400' :
                    activeExperiment.results.outcome === 'failure' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {activeExperiment.results.outcome.charAt(0).toUpperCase() + activeExperiment.results.outcome.slice(1)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-njz-text-muted">Observations: </span>
                  <span className="text-sm text-njz-text">{activeExperiment.results.observations}</span>
                </div>
                <div>
                  <span className="text-xs text-njz-text-muted">Conclusion: </span>
                  <span className="text-sm text-njz-text">{activeExperiment.results.conclusion}</span>
                </div>
              </div>
            </div>
          )}

          {/* BOM */}
          <div className="bg-njz-bg-overlay rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-njz-text flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                Bill of Materials
              </h4>
              <button
                onClick={() => setShowBOM(!showBOM)}
                className="text-xs text-njz-text-muted hover:text-njz-text"
              >
                {showBOM ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showBOM && (
              <div className="space-y-2">
                {bom.map(item => (
                  <div key={item.id} className="grid grid-cols-[1fr,auto,auto,auto] gap-2 items-center">
                    <input
                      type="text"
                      value={item.name}
                      onChange={e => updateBOMItem(item.id, 'name', e.target.value)}
                      placeholder="Item name"
                      className="bg-njz-bg border border-njz-border rounded px-2 py-1 text-xs text-njz-text"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={e => updateBOMItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-16 bg-njz-bg border border-njz-border rounded px-2 py-1 text-xs text-njz-text text-center"
                    />
                    <input
                      type="text"
                      value={item.unit}
                      onChange={e => updateBOMItem(item.id, 'unit', e.target.value)}
                      className="w-20 bg-njz-bg border border-njz-border rounded px-2 py-1 text-xs text-njz-text"
                    />
                    <button
                      onClick={() => removeBOMItem(item.id)}
                      className="p-1 text-njz-text-muted hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addBOMItem}
                  className="flex items-center gap-1 text-xs text-njz-accent-teal hover:underline"
                >
                  <Plus className="w-3 h-3" />
                  Add Item
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}