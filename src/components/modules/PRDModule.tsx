import { useState } from 'react'
import { FileText, CheckCircle, AlertTriangle, Plus, Trash2, Download, Copy, ChevronDown, ChevronUp } from 'lucide-react'

interface PRDSection {
  id: string
  title: string
  content: string
  status: 'draft' | 'review' | 'approved'
  required: boolean
}

interface PRD {
  id: string
  name: string
  version: string
  context: string
  goals: string
  sections: PRDSection[]
  createdAt: string
  updatedAt: string
}

const DEFAULT_SECTIONS: PRDSection[] = [
  { id: 'context', title: 'Context & Problem', content: '', status: 'draft', required: true },
  { id: 'goals', title: 'Goals & KPIs', content: '', status: 'draft', required: true },
  { id: 'constraints', title: 'Constraints & Assumptions', content: '', status: 'draft', required: true },
  { id: 'personas', title: 'User Personas', content: '', status: 'draft', required: true },
  { id: 'requirements', title: 'Functional Requirements', content: '', status: 'draft', required: true },
  { id: 'non-functional', title: 'Non-Functional Requirements', content: '', status: 'draft', required: false },
  { id: 'risks', title: 'Risks & Mitigations', content: '', status: 'draft', required: true },
  { id: 'timeline', title: 'Timeline & Milestones', content: '', status: 'draft', required: true },
  { id: 'stakeholders', title: 'Stakeholders & Approvals', content: '', status: 'draft', required: false },
  { id: 'appendix', title: 'Appendix', content: '', status: 'draft', required: false }
]

export function PRDModule() {
  const [prds, setPrds] = useState<PRD[]>(() => {
    const stored = localStorage.getItem('zesportexte_prds')
    return stored ? JSON.parse(stored) : []
  })
  const [activePRD, setActivePRD] = useState<PRD | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const savePrds = (updated: PRD[]) => {
    setPrds(updated)
    localStorage.setItem('zesportexte_prds', JSON.stringify(updated))
  }

  const createPRD = () => {
    if (!newName.trim()) return
    const prd: PRD = {
      id: `prd_${Date.now()}`,
      name: newName,
      version: '0.1.0',
      context: '',
      goals: '',
      sections: DEFAULT_SECTIONS.map(s => ({ ...s })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    savePrds([...prds, prd])
    setActivePRD(prd)
    setNewName('')
    setShowCreate(false)
    setExpandedSections(prd.sections.map(s => s.id))
  }

  const updateSection = (sectionId: string, content: string) => {
    if (!activePRD) return
    const updated = prds.map(p =>
      p.id === activePRD.id
        ? {
            ...p,
            sections: p.sections.map(s => s.id === sectionId ? { ...s, content } : s),
            updatedAt: new Date().toISOString()
          }
        : p
    )
    savePrds(updated)
    setActivePRD(updated.find(p => p.id === activePRD.id) || null)
  }

  const updateSectionStatus = (sectionId: string, status: 'draft' | 'review' | 'approved') => {
    if (!activePRD) return
    const updated = prds.map(p =>
      p.id === activePRD.id
        ? {
            ...p,
            sections: p.sections.map(s => s.id === sectionId ? { ...s, status } : s),
            updatedAt: new Date().toISOString()
          }
        : p
    )
    savePrds(updated)
    setActivePRD(updated.find(p => p.id === activePRD.id) || null)
  }

  const updatePRDMeta = (field: 'name' | 'version' | 'context' | 'goals', value: string) => {
    if (!activePRD) return
    const updated = prds.map(p =>
      p.id === activePRD.id ? { ...p, [field]: value, updatedAt: new Date().toISOString() } : p
    )
    savePrds(updated)
    setActivePRD(updated.find(p => p.id === activePRD.id) || null)
  }

  const deletePRD = (id: string) => {
    const updated = prds.filter(p => p.id !== id)
    savePrds(updated)
    if (activePRD?.id === id) setActivePRD(null)
  }

  const toggleSection = (id: string) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const exportPRD = (prd: PRD) => {
    const content = `# ${prd.name}
**Version:** ${prd.version}
**Last Updated:** ${new Date(prd.updatedAt).toLocaleDateString()}

## Context & Problem
${prd.context || '_Not documented_'}

## Goals & KPIs
${prd.goals || '_Not documented_'}

${prd.sections.map(s => `## ${s.title}\n${s.content || '_Not documented_'}\n\n**Status:** ${s.status}${s.required ? ' (Required)' : ''}`).join('\n\n---\n\n')}
`

    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${prd.name.toLowerCase().replace(/\s+/g, '-')}-prd.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = (prd: PRD) => {
    const content = JSON.stringify(prd, null, 2)
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const completionPercentage = (prd: PRD) => {
    const completed = prd.sections.filter(s => s.content.trim().length > 0).length
    return Math.round((completed / prd.sections.length) * 100)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'review': return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      default: return <FileText className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-njz-accent-teal/20">
          <FileText className="w-5 h-5 text-njz-accent-teal" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-njz-text">PRD Manager</h2>
          <p className="text-sm text-njz-text-muted">Product Requirement Documents for ZeSporteXte</p>
        </div>
      </div>

      {!activePRD ? (
        <>
          {/* Create PRD */}
          <div className="bg-njz-bg-overlay rounded-lg p-4">
            {!showCreate ? (
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 text-njz-accent-teal hover:underline text-sm"
              >
                <Plus className="w-4 h-4" />
                New PRD
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="PRD name (e.g., 'ZeSporteXte Analytics Platform')"
                  className="w-full bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text placeholder:text-njz-text-subtle"
                />
                <div className="flex gap-2">
                  <button
                    onClick={createPRD}
                    className="px-4 py-2 bg-njz-accent-teal rounded-lg text-white text-sm font-medium"
                  >
                    Create PRD
                  </button>
                  <button
                    onClick={() => setShowCreate(false)}
                    className="px-4 py-2 border border-njz-border rounded-lg text-njz-text text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PRDs List */}
          {prds.length === 0 ? (
            <div className="text-center py-12 text-njz-text-muted">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No PRDs yet</p>
              <p className="text-xs mt-1">Create a PRD to document ZeSporteXte requirements</p>
            </div>
          ) : (
            <div className="space-y-2">
              {prds.map(prd => (
                <button
                  key={prd.id}
                  onClick={() => {
                    setActivePRD(prd)
                    setExpandedSections(prd.sections.map(s => s.id))
                  }}
                  className="w-full text-left bg-njz-bg-overlay hover:bg-njz-bg-surface rounded-lg p-4 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-njz-text font-medium text-sm">{prd.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-njz-text-muted">v{prd.version}</span>
                        <span className="text-xs text-njz-text-muted">
                          {completionPercentage(prd)}% complete
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); deletePRD(prd.id) }}
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
          {/* Active PRD */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActivePRD(null)}
              className="text-sm text-njz-text-muted hover:text-njz-text"
            >
              ← Back to PRDs
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(activePRD)}
                className="p-1.5 text-njz-text-muted hover:text-njz-text"
                title={copied ? 'Copied!' : 'Copy JSON'}
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => exportPRD(activePRD)}
                className="p-1.5 text-njz-text-muted hover:text-njz-text"
                title="Export as Markdown"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => deletePRD(activePRD.id)}
                className="p-1.5 text-njz-text-muted hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* PRD Meta */}
          <div className="bg-njz-bg-overlay rounded-lg p-4 border border-njz-border space-y-3">
            <input
              type="text"
              value={activePRD.name}
              onChange={e => updatePRDMeta('name', e.target.value)}
              className="w-full bg-transparent text-njz-text font-semibold text-lg border-none outline-none"
            />
            <div className="flex items-center gap-2 text-xs text-njz-text-muted">
              <span>Version: </span>
              <input
                type="text"
                value={activePRD.version}
                onChange={e => updatePRDMeta('version', e.target.value)}
                className="bg-njz-bg border border-njz-border rounded px-2 py-0.5 w-20 text-center"
              />
              <span>• Updated: {new Date(activePRD.updatedAt).toLocaleDateString()}</span>
            </div>

            <div>
              <label className="text-xs font-medium text-njz-text-muted uppercase">Context & Problem</label>
              <textarea
                value={activePRD.context}
                onChange={e => updatePRDMeta('context', e.target.value)}
                placeholder="Describe the context and problem this PRD addresses..."
                className="w-full h-20 bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text placeholder:text-njz-text-subtle resize-none mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-njz-text-muted uppercase">Goals & KPIs</label>
              <textarea
                value={activePRD.goals}
                onChange={e => updatePRDMeta('goals', e.target.value)}
                placeholder="Define measurable goals and key performance indicators..."
                className="w-full h-20 bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text placeholder:text-njz-text-subtle resize-none mt-1"
              />
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-3">
            {activePRD.sections.map(section => (
              <div key={section.id} className="bg-njz-bg-overlay rounded-lg border border-njz-border">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-2">
                    {getStatusIcon(section.status)}
                    <span className="text-sm font-medium text-njz-text">{section.title}</span>
                    {section.required && (
                      <span className="text-xs text-red-400">*</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={section.status}
                      onChange={e => {
                        e.stopPropagation()
                        updateSectionStatus(section.id, e.target.value as 'draft' | 'review' | 'approved')
                      }}
                      className="text-xs bg-njz-bg border border-njz-border rounded px-2 py-1 text-njz-text"
                    >
                      <option value="draft">Draft</option>
                      <option value="review">Review</option>
                      <option value="approved">Approved</option>
                    </select>
                    {expandedSections.includes(section.id) ? (
                      <ChevronUp className="w-4 h-4 text-njz-text-muted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-njz-text-muted" />
                    )}
                  </div>
                </button>

                {expandedSections.includes(section.id) && (
                  <div className="px-4 pb-4">
                    <textarea
                      value={section.content}
                      onChange={e => updateSection(section.id, e.target.value)}
                      placeholder={`Document ${section.title.toLowerCase()}...`}
                      className="w-full h-32 bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text placeholder:text-njz-text-subtle resize-none"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}