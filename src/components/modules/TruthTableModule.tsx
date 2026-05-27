import { useState } from 'react'
import { Search, CheckCircle, XCircle, AlertTriangle, HelpCircle, ExternalLink, Shield, Sparkles, Plus, Trash2 } from 'lucide-react'

interface TruthClaim {
  id: string
  claim: string
  status: 'verified' | 'false' | 'mixed' | 'unverified'
  evidence: string[]
  confidence: 'high' | 'medium' | 'low'
  sources: string[]
  checkedAt: string
  checkedBy: string
  notes: string
}

interface TruthTable {
  id: string
  title: string
  topic: string
  claims: TruthClaim[]
  createdAt: string
  updatedAt: string
}

export function TruthTableModule() {
  const [tables, setTables] = useState<TruthTable[]>(() => {
    const stored = localStorage.getItem('helix_truth_tables')
    return stored ? JSON.parse(stored) : []
  })
  const [activeTable, setActiveTable] = useState<TruthTable | null>(null)
  const [newTableTitle, setNewTableTitle] = useState('')
  const [newTableTopic, setNewTableTopic] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newClaim, setNewClaim] = useState('')
  const [checking, setChecking] = useState(false)

  const saveTables = (updated: TruthTable[]) => {
    setTables(updated)
    localStorage.setItem('helix_truth_tables', JSON.stringify(updated))
  }

  const createTable = () => {
    if (!newTableTitle.trim()) return
    const table: TruthTable = {
      id: `table_${Date.now()}`,
      title: newTableTitle,
      topic: newTableTopic || 'General',
      claims: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    saveTables([...tables, table])
    setActiveTable(table)
    setNewTableTitle('')
    setNewTableTopic('')
    setShowCreateForm(false)
  }

  const addClaim = () => {
    if (!newClaim.trim() || !activeTable) return
    const claim: TruthClaim = {
      id: `claim_${Date.now()}`,
      claim: newClaim,
      status: 'unverified',
      evidence: [],
      confidence: 'low',
      sources: [],
      checkedAt: '',
      checkedBy: 'Helix',
      notes: ''
    }
    const updated = tables.map(t =>
      t.id === activeTable.id
        ? { ...t, claims: [...t.claims, claim], updatedAt: new Date().toISOString() }
        : t
    )
    saveTables(updated)
    setActiveTable({ ...activeTable, claims: [...activeTable.claims, claim] })
    setNewClaim('')
  }

  const verifyClaim = (claimId: string) => {
    if (!activeTable) return
    setChecking(true)
    setTimeout(() => {
      const updated = tables.map(t => {
        if (t.id !== activeTable.id) return t
        return {
          ...t,
          claims: t.claims.map(c => {
            if (c.id !== claimId) return c
            // Simulate verification
            const mockEvidence = [
              'Source 1: Official documentation confirms this claim',
              'Source 2: Independent verification from reputable outlet'
            ]
            return {
              ...c,
              status: 'verified' as const,
              evidence: mockEvidence,
              confidence: 'high' as const,
              sources: ['docs.example.com', 'reputable-source.com'],
              checkedAt: new Date().toISOString(),
              notes: 'Claim verified with ≥2 high-quality independent sources'
            }
          }),
          updatedAt: new Date().toISOString()
        }
      })
      saveTables(updated)
      setActiveTable(updated.find(t => t.id === activeTable.id) || null)
      setChecking(false)
    }, 1500)
  }

  const deleteTable = (tableId: string) => {
    const updated = tables.filter(t => t.id !== tableId)
    saveTables(updated)
    if (activeTable?.id === tableId) setActiveTable(null)
  }

  const deleteClaim = (claimId: string) => {
    if (!activeTable) return
    const updated = tables.map(t =>
      t.id === activeTable.id
        ? { ...t, claims: t.claims.filter(c => c.id !== claimId) }
        : t
    )
    saveTables(updated)
    setActiveTable({ ...activeTable, claims: activeTable.claims.filter(c => c.id !== claimId) })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'false': return <XCircle className="w-5 h-5 text-red-400" />
      case 'mixed': return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      default: return <HelpCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="px-2 py-0.5 rounded text-xs bg-green-900/30 text-green-400 border border-green-900/50">Verified</span>
      case 'false':
        return <span className="px-2 py-0.5 rounded text-xs bg-red-900/30 text-red-400 border border-red-900/50">False</span>
      case 'mixed':
        return <span className="px-2 py-0.5 rounded text-xs bg-yellow-900/30 text-yellow-400 border border-yellow-900/50">Mixed</span>
      default:
        return <span className="px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-400 border border-gray-700">Unverified</span>
    }
  }

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return <span className="text-xs text-green-400">High Confidence</span>
      case 'medium':
        return <span className="text-xs text-yellow-400">Medium Confidence</span>
      default:
        return <span className="text-xs text-gray-400">Low Confidence</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-njz-accent-teal/20">
          <Shield className="w-5 h-5 text-njz-accent-teal" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-njz-text">Truth Tables</h2>
          <p className="text-sm text-njz-text-muted">Helix fact-checking protocol</p>
        </div>
      </div>

      {!activeTable ? (
        <>
          {/* Create New Table */}
          <div className="bg-njz-bg-overlay rounded-lg p-4">
            {!showCreateForm ? (
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 text-njz-accent-teal hover:underline text-sm"
              >
                <Plus className="w-4 h-4" />
                New Truth Table
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={newTableTitle}
                  onChange={e => setNewTableTitle(e.target.value)}
                  placeholder="Table title (e.g., 'ZeSporteXte Analytics Claims')"
                  className="w-full bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text placeholder:text-njz-text-subtle"
                />
                <input
                  type="text"
                  value={newTableTopic}
                  onChange={e => setNewTableTopic(e.target.value)}
                  placeholder="Topic area (optional)"
                  className="w-full bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text placeholder:text-njz-text-subtle"
                />
                <div className="flex gap-2">
                  <button
                    onClick={createTable}
                    className="px-4 py-2 bg-njz-accent-teal rounded-lg text-white text-sm font-medium"
                  >
                    Create Table
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

          {/* Tables List */}
          {tables.length === 0 ? (
            <div className="text-center py-12 text-njz-text-muted">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No truth tables yet</p>
              <p className="text-xs mt-1">Create a table to start fact-checking claims</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tables.map(table => (
                <button
                  key={table.id}
                  onClick={() => setActiveTable(table)}
                  className="w-full text-left bg-njz-bg-overlay hover:bg-njz-bg-surface rounded-lg p-4 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-njz-text font-medium text-sm">{table.title}</h3>
                      <p className="text-xs text-njz-text-muted mt-0.5">
                        {table.topic} • {table.claims.length} claims
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-njz-text-muted">
                        {table.claims.filter(c => c.status === 'verified').length} verified
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); deleteTable(table.id) }}
                        className="p-1 text-njz-text-muted hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Active Table */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTable(null)}
              className="text-sm text-njz-text-muted hover:text-njz-text"
            >
              ← Back to tables
            </button>
            <button
              onClick={() => deleteTable(activeTable.id)}
              className="p-1.5 text-njz-text-muted hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-njz-bg-overlay rounded-lg p-4">
            <h3 className="text-njz-text font-semibold">{activeTable.title}</h3>
            <p className="text-xs text-njz-text-muted mt-0.5">{activeTable.topic}</p>
          </div>

          {/* Add Claim */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newClaim}
              onChange={e => setNewClaim(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addClaim()}
              placeholder="Enter a claim to verify..."
              className="flex-1 bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text placeholder:text-njz-text-subtle"
            />
            <button
              onClick={addClaim}
              className="px-3 py-2 bg-njz-accent-teal rounded-lg text-white text-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Claims Table */}
          {activeTable.claims.length === 0 ? (
            <div className="text-center py-8 text-njz-text-muted">
              <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No claims yet</p>
              <p className="text-xs mt-1">Add claims above to start verification</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTable.claims.map(claim => (
                <div
                  key={claim.id}
                  className="bg-njz-bg-overlay rounded-lg p-4 border border-njz-border"
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon(claim.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-njz-text">{claim.claim}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusBadge(claim.status)}
                        {claim.confidence !== 'low' && getConfidenceBadge(claim.confidence)}
                        {claim.checkedAt && (
                          <span className="text-xs text-njz-text-muted">
                            Checked: {new Date(claim.checkedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Evidence */}
                      {claim.evidence.length > 0 && (
                        <div className="mt-3 space-y-1">
                          <p className="text-xs font-medium text-njz-text-muted">Evidence:</p>
                          {claim.evidence.map((ev, i) => (
                            <p key={i} className="text-xs text-njz-text-muted pl-3 border-l-2 border-njz-accent-teal/50">
                              {ev}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Sources */}
                      {claim.sources.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {claim.sources.map((src, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-njz-bg border border-njz-border text-njz-text-muted"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {src}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Notes */}
                      {claim.notes && (
                        <p className="mt-2 text-xs text-njz-text-muted italic">{claim.notes}</p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        {claim.status === 'unverified' && (
                          <button
                            onClick={() => verifyClaim(claim.id)}
                            disabled={checking}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-njz-accent-teal/20 hover:bg-njz-accent-teal/30 rounded-lg text-xs text-njz-accent-teal font-medium transition-colors disabled:opacity-50"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            {checking ? 'Verifying...' : 'Verify with Helix'}
                          </button>
                        )}
                        <button
                          onClick={() => deleteClaim(claim.id)}
                          className="p-1.5 text-njz-text-muted hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
