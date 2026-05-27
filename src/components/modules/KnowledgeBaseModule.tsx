import { useState } from 'react'
import { BookOpen, Plus, Trash2, Search, User, Building2, FileText, Edit3, Save, X, Star } from 'lucide-react'

interface KnowledgeDoc {
  id: string
  title: string
  content: string
  category: 'company' | 'employee' | 'policy' | 'guide' | 'reference'
  tags: string[]
  author: string
  createdAt: string
  updatedAt: string
  version: string
  starred: boolean
  views: number
}

interface EmployeeProfile {
  id: string
  name: string
  role: string
  department: string
  email: string
  docs: string[] // doc IDs they authored
}

const DEFAULT_DOCS: KnowledgeDoc[] = [
  {
    id: 'doc_1',
    title: 'NJZ Workspace Overview',
    content: `# NJZ Workspace Overview\n\n## Mission\nThe NJZ Workspace is a unified creative ecosystem for digital production, analytics, and personal productivity.\n\n## Components\n- **SiteGeiste**: Workspace management\n- **RAT-OS**: Task operating system\n- **ZeSporteXte**: eSports analytics platform\n- **NueVue**: Creative production suite\n- **PolyCo**: Pixel metaverse\n\n## Quick Links\n- GitHub: github.com/notbleaux\n- Deployed: notbleaux.github.io/NeXeZ-SiteGeiste`,
    category: 'company',
    tags: ['overview', 'getting-started'],
    author: 'Elijah Bleaux',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-28T00:00:00Z',
    version: '1.0.0',
    starred: true,
    views: 42
  },
  {
    id: 'doc_2',
    title: 'TENET Architecture Guide',
    content: `# TENET Architecture\n\n## Philosophy\nThe TENET system is named after the Sator Square - a medieval Latin palindrome.\n\n## Layers\n1. **TENET** (meta): WorldHUBs database\n2. **tenet** (game): Game-specific worlds\n3. **tezet** (4 HUBs):\n   - ROTAS: Raw stats\n   - SATOR: Analytics\n   - OPERA: Pro scene\n   - AREPO: Community\n\n## Naming\nAll names read the same forward and backward - a deliberate architectural symmetry.`,
    category: 'reference',
    tags: ['architecture', 'tenet', 'design'],
    author: 'Elijah Bleaux',
    createdAt: '2026-05-15T00:00:00Z',
    updatedAt: '2026-05-28T00:00:00Z',
    version: '2.1.0',
    starred: true,
    views: 28
  },
  {
    id: 'doc_3',
    title: 'ZeSporteXte Data Sources',
    content: `# Data Sources\n\n## Primary\n- **PandaScore API**: Real-time eSports data (has token)\n\n## Supplementary\n- **HLTV.org**: CS2 historical data\n- **VLR.gg**: Valorant community data\n- **Liquidpedia**: Both games (cross-reference)\n\n## Strategy\nMulti-source verification for accuracy. Primary + supplementary cross-reference.`,
    category: 'reference',
    tags: ['data', 'api', 'zesportexte'],
    author: 'Kimi',
    createdAt: '2026-05-20T00:00:00Z',
    updatedAt: '2026-05-28T00:00:00Z',
    version: '1.0.0',
    starred: false,
    views: 15
  }
]

const DEFAULT_PROFILES: EmployeeProfile[] = [
  { id: 'emp_1', name: 'Elijah Bleaux', role: 'Founder / Product Lead', department: 'Management', email: 'eli@njz.work', docs: ['doc_1', 'doc_2'] },
  { id: 'emp_2', name: 'Kimi', role: 'Technical Partner / AI', department: 'Engineering', email: 'kimi@njz.work', docs: ['doc_3'] }
]

const CATEGORIES = {
  company: { label: 'Company', icon: Building2, color: 'text-njz-accent-teal' },
  employee: { label: 'Employee', icon: User, color: 'text-njz-accent-purple' },
  policy: { label: 'Policy', icon: FileText, color: 'text-njz-accent-orange' },
  guide: { label: 'Guide', icon: BookOpen, color: 'text-njz-accent-green' },
  reference: { label: 'Reference', icon: Star, color: 'text-yellow-400' }
}

export function KnowledgeBaseModule() {
  const [docs, setDocs] = useState<KnowledgeDoc[]>(() => {
    const stored = localStorage.getItem('sitegeiste_kb_docs')
    return stored ? JSON.parse(stored) : DEFAULT_DOCS
  })
  const [profiles] = useState<EmployeeProfile[]>(DEFAULT_PROFILES)
  const [activeDoc, setActiveDoc] = useState<KnowledgeDoc | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string | 'all'>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [newDoc, setNewDoc] = useState({
    title: '',
    content: '',
    category: 'reference' as const,
    tags: [] as string[],
    tagInput: ''
  })
  const [showEmployeeView, setShowEmployeeView] = useState(false)

  const saveDocs = (updated: KnowledgeDoc[]) => {
    setDocs(updated)
    localStorage.setItem('sitegeiste_kb_docs', JSON.stringify(updated))
  }

  const createDoc = () => {
    if (!newDoc.title.trim()) return
    const doc: KnowledgeDoc = {
      id: `doc_${Date.now()}`,
      title: newDoc.title,
      content: newDoc.content,
      category: newDoc.category,
      tags: [...newDoc.tags],
      author: 'Elijah Bleaux',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '0.1.0',
      starred: false,
      views: 0
    }
    saveDocs([doc, ...docs])
    setNewDoc({ title: '', content: '', category: 'reference', tags: [], tagInput: '' })
    setShowCreate(false)
    setActiveDoc(doc)
  }

  const updateDoc = () => {
    if (!activeDoc || !editTitle.trim()) return
    const updated = docs.map(d =>
      d.id === activeDoc.id
        ? {
            ...d,
            title: editTitle,
            content: editContent,
            updatedAt: new Date().toISOString(),
            version: incrementVersion(d.version)
          }
        : d
    )
    saveDocs(updated)
    setActiveDoc({ ...activeDoc, title: editTitle, content: editContent, updatedAt: new Date().toISOString(), version: incrementVersion(activeDoc.version) })
    setEditing(false)
  }

  const incrementVersion = (v: string) => {
    const parts = v.split('.').map(Number)
    parts[2] = (parts[2] || 0) + 1
    return parts.join('.')
  }

  const deleteDoc = (id: string) => {
    const updated = docs.filter(d => d.id !== id)
    saveDocs(updated)
    if (activeDoc?.id === id) setActiveDoc(null)
  }

  const toggleStar = (id: string) => {
    const updated = docs.map(d => d.id === id ? { ...d, starred: !d.starred } : d)
    saveDocs(updated)
    if (activeDoc?.id === id) setActiveDoc({ ...activeDoc, starred: !activeDoc.starred })
  }

  const incrementViews = (doc: KnowledgeDoc) => {
    const updated = docs.map(d => d.id === doc.id ? { ...d, views: d.views + 1 } : d)
    saveDocs(updated)
    setActiveDoc({ ...doc, views: doc.views + 1 })
  }

  const addTag = () => {
    if (!newDoc.tagInput.trim()) return
    if (newDoc.tags.includes(newDoc.tagInput.trim())) return
    setNewDoc({ ...newDoc, tags: [...newDoc.tags, newDoc.tagInput.trim()], tagInput: '' })
  }

  const removeTag = (tag: string) => {
    setNewDoc({ ...newDoc, tags: newDoc.tags.filter(t => t !== tag) })
  }

  const filteredDocs = docs.filter(d => {
    const matchesSearch = !searchQuery ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || d.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const renderMarkdown = (content: string) => {
    // Simple markdown renderer
    const lines = content.split('\n')
    return lines.map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold text-njz-text mt-4 mb-2">{line.slice(2)}</h1>
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-semibold text-njz-text mt-3 mb-2">{line.slice(3)}</h2>
      if (line.startsWith('### ')) return <h3 key={i} className="text-base font-medium text-njz-text mt-2 mb-1">{line.slice(4)}</h3>
      if (line.startsWith('- ')) return <li key={i} className="text-sm text-njz-text ml-4">{line.slice(2)}</li>
      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) return <li key={i} className="text-sm text-njz-text ml-4">{line.slice(3)}</li>
      if (line.trim() === '') return <div key={i} className="h-2" />
      if (line.startsWith('```')) return <div key={i} className="h-0" />
      return <p key={i} className="text-sm text-njz-text">{line}</p>
    })
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-njz-accent-teal/20">
          <BookOpen className="w-5 h-5 text-njz-accent-teal" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-njz-text">Knowledge Base</h2>
          <p className="text-sm text-njz-text-muted">Company & Employee documentation</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowEmployeeView(!showEmployeeView)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showEmployeeView
                ? 'bg-njz-accent-purple/20 text-njz-accent-purple border border-njz-accent-purple/30'
                : 'bg-njz-bg-overlay text-njz-text-muted border border-njz-border'
            }`}
          >
            <User className="w-3.5 h-3.5 inline mr-1" />
            People
          </button>
          {!activeDoc && !showEmployeeView && (
            <button
              onClick={() => setShowCreate(true)}
              className="px-3 py-1.5 bg-njz-accent-teal rounded-lg text-white text-xs font-medium"
            >
              <Plus className="w-3.5 h-3.5 inline mr-1" />
              New Doc
            </button>
          )}
        </div>
      </div>

      {showEmployeeView ? (
        <>
          {/* Employee Directory */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-njz-text-muted uppercase">Team Directory</p>
            {profiles.map(profile => (
              <div key={profile.id} className="bg-njz-bg-overlay rounded-lg p-4 border border-njz-border">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-njz-accent-purple/20">
                    <User className="w-5 h-5 text-njz-accent-purple" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-njz-text">{profile.name}</h3>
                    <p className="text-xs text-njz-text-muted">{profile.role}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-njz-text-muted">
                      <span>{profile.department}</span>
                      <span>•</span>
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {profile.docs.map(docId => {
                        const doc = docs.find(d => d.id === docId)
                        if (!doc) return null
                        return (
                          <button
                            key={docId}
                            onClick={() => {
                              setShowEmployeeView(false)
                              setActiveDoc(doc)
                            }}
                            className="px-2 py-1 rounded text-[10px] bg-njz-bg border border-njz-border text-njz-text hover:border-njz-accent-teal/50"
                          >
                            <FileText className="w-3 h-3 inline mr-1" />
                            {doc.title}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : !activeDoc ? (
        <>
          {/* Search & Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-njz-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search docs, tags, content..."
                className="w-full bg-njz-bg border border-njz-border rounded-lg pl-9 pr-3 py-2 text-sm text-njz-text placeholder:text-njz-text-subtle"
              />
            </div>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORIES).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Create Form */}
          {showCreate && (
            <div className="bg-njz-bg-overlay rounded-lg p-4 border border-njz-border space-y-3">
              <input
                type="text"
                value={newDoc.title}
                onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                placeholder="Document title"
                className="w-full bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text"
              />
              <select
                value={newDoc.category}
                onChange={e => setNewDoc({ ...newDoc, category: e.target.value as any })}
                className="w-full bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text"
              >
                {Object.entries(CATEGORIES).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <textarea
                value={newDoc.content}
                onChange={e => setNewDoc({ ...newDoc, content: e.target.value })}
                placeholder="# Write in Markdown...\n\n## Section\n- Bullet point\n- Another point"
                className="w-full h-40 bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text placeholder:text-njz-text-subtle resize-none"
              />
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={newDoc.tagInput}
                  onChange={e => setNewDoc({ ...newDoc, tagInput: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && addTag()}
                  placeholder="Add tag..."
                  className="flex-1 bg-njz-bg border border-njz-border rounded px-2 py-1 text-xs text-njz-text"
                />
                <button onClick={addTag} className="px-2 py-1 text-njz-accent-teal text-xs">Add</button>
              </div>
              {newDoc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {newDoc.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-njz-bg border border-njz-border text-njz-text">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="text-njz-text-muted hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={createDoc}
                  className="px-4 py-2 bg-njz-accent-teal rounded-lg text-white text-sm font-medium"
                >
                  Create Document
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

          {/* Doc List */}
          <div className="space-y-2 flex-1 overflow-y-auto">
            {filteredDocs.length === 0 ? (
              <div className="text-center py-8 text-njz-text-muted">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No documents found</p>
              </div>
            ) : (
              filteredDocs.map(doc => {
                const cat = CATEGORIES[doc.category as keyof typeof CATEGORIES]
                const Icon = cat?.icon || FileText
                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setActiveDoc(doc)
                      incrementViews(doc)
                    }}
                    className="w-full text-left bg-njz-bg-overlay hover:bg-njz-bg-surface rounded-lg p-3 border border-njz-border transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <Icon className={`w-4 h-4 mt-0.5 ${cat?.color || 'text-njz-text-muted'}`} />
                        <div>
                          <h3 className="text-sm font-medium text-njz-text">{doc.title}</h3>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-njz-text-muted">
                            <span>v{doc.version}</span>
                            <span>•</span>
                            <span>{doc.author}</span>
                            <span>•</span>
                            <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {doc.tags.map(tag => (
                              <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] bg-njz-bg border border-njz-border text-njz-text-muted">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={e => { e.stopPropagation(); toggleStar(doc.id) }}
                          className={`p-1 ${doc.starred ? 'text-yellow-400' : 'text-njz-text-muted hover:text-yellow-400'}`}
                        >
                          <Star className="w-4 h-4" fill={doc.starred ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); deleteDoc(doc.id) }}
                          className="p-1 text-njz-text-muted hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </>
      ) : (
        <>
          {/* Active Document */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setActiveDoc(null)
                setEditing(false)
              }}
              className="text-sm text-njz-text-muted hover:text-njz-text"
            >
              ← Back to docs
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (editing) {
                    updateDoc()
                  } else {
                    setEditTitle(activeDoc.title)
                    setEditContent(activeDoc.content)
                    setEditing(true)
                  }
                }}
                className="p-1.5 text-njz-text-muted hover:text-njz-accent-teal"
              >
                {editing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              </button>
              {editing && (
                <button
                  onClick={() => {
                    setEditing(false)
                    setEditTitle('')
                    setEditContent('')
                  }}
                  className="p-1.5 text-njz-text-muted hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => toggleStar(activeDoc.id)}
                className={`p-1.5 ${activeDoc.starred ? 'text-yellow-400' : 'text-njz-text-muted hover:text-yellow-400'}`}
              >
                <Star className="w-4 h-4" fill={activeDoc.starred ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => deleteDoc(activeDoc.id)}
                className="p-1.5 text-njz-text-muted hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Doc Meta */}
          <div className="bg-njz-bg-overlay rounded-lg p-3 border border-njz-border">
            <div className="flex items-center gap-2 mb-2">
              {(() => {
                const cat = CATEGORIES[activeDoc.category as keyof typeof CATEGORIES]
                const Icon = cat?.icon || FileText
                return <Icon className={`w-4 h-4 ${cat?.color || 'text-njz-text-muted'}`} />
              })()}
              <span className="text-xs text-njz-text-muted capitalize">{activeDoc.category}</span>
              <span className="text-xs text-njz-text-muted">• v{activeDoc.version}</span>
              <span className="text-xs text-njz-text-muted">• {activeDoc.views} views</span>
            </div>
            {editing ? (
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className="w-full bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-lg font-semibold text-njz-text"
              />
            ) : (
              <h2 className="text-lg font-semibold text-njz-text">{activeDoc.title}</h2>
            )}
            <div className="flex items-center gap-3 mt-1 text-xs text-njz-text-muted">
              <span>By {activeDoc.author}</span>
              <span>• Updated {new Date(activeDoc.updatedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {activeDoc.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-njz-bg border border-njz-border text-njz-text-muted">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-njz-bg-overlay rounded-lg p-4 border border-njz-border overflow-y-auto">
            {editing ? (
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                className="w-full h-full bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text resize-none"
              />
            ) : (
              <div className="prose prose-invert max-w-none">
                {renderMarkdown(activeDoc.content)}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
