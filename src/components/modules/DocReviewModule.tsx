import { useState } from 'react'
import { MessageSquare, CheckCircle, XCircle, Eye, FileText, User, Plus, Trash2, Edit3, RotateCcw, Send } from 'lucide-react'

interface ReviewComment {
  id: string
  author: string
  text: string
  lineNumber?: number
  createdAt: string
  resolved: boolean
}

interface ReviewDoc {
  id: string
  title: string
  content: string
  author: string
  status: 'draft' | 'in-review' | 'approved' | 'rejected' | 'changes-requested'
  reviewers: string[]
  comments: ReviewComment[]
  createdAt: string
  updatedAt: string
  version: string
}

const SAMPLE_DOCS: ReviewDoc[] = [
  {
    id: 'review_1',
    title: 'ZeSporteXte PRD - Analytics Module',
    content: `# Analytics Module PRD\n\n## Objective\nBuild a comprehensive analytics dashboard for eSports data.\n\n## Features\n- Real-time match tracking\n- Player performance metrics\n- Team comparison tools\n- Historical trend analysis\n\n## Technical Requirements\n- React frontend\n- FastAPI backend\n- PostgreSQL database\n- Redis caching layer`,
    author: 'Elijah Bleaux',
    status: 'in-review',
    reviewers: ['Kimi', 'Review Bot'],
    comments: [
      {
        id: 'c1',
        author: 'Kimi',
        text: 'Consider adding WebSocket support for real-time updates instead of polling.',
        createdAt: '2026-05-25T10:00:00Z',
        resolved: false
      },
      {
        id: 'c2',
        author: 'Review Bot',
        text: 'Redis caching layer needs TTL specification. Recommend 5-min default.',
        createdAt: '2026-05-26T14:00:00Z',
        resolved: true
      }
    ],
    createdAt: '2026-05-20T00:00:00Z',
    updatedAt: '2026-05-28T00:00:00Z',
    version: '1.2.0'
  },
  {
    id: 'review_2',
    title: 'NJZ Brand Guidelines v3',
    content: `# Brand Guidelines\n\n## Colors\n- Primary: #0F172A (Dark Slate)\n- Accent: #2DD4BF (Teal)\n- Secondary: #F97316 (Orange)\n\n## Typography\n- Headings: Geometric Sans\n- Body: System Sans\n- Code: Monospace\n\n## Voice\nDirect, competent, occasionally impatient with repetition.`,
    author: 'Elijah Bleaux',
    status: 'approved',
    reviewers: ['Kimi'],
    comments: [],
    createdAt: '2026-05-15T00:00:00Z',
    updatedAt: '2026-05-22T00:00:00Z',
    version: '3.0.0'
  }
]

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'text-gray-400 bg-gray-800 border-gray-700', icon: FileText },
  'in-review': { label: 'In Review', color: 'text-yellow-400 bg-yellow-900/30 border-yellow-800', icon: Eye },
  approved: { label: 'Approved', color: 'text-green-400 bg-green-900/30 border-green-800', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'text-red-400 bg-red-900/30 border-red-800', icon: XCircle },
  'changes-requested': { label: 'Changes Requested', color: 'text-orange-400 bg-orange-900/30 border-orange-800', icon: RotateCcw }
}

export function DocReviewModule() {
  const [docs, setDocs] = useState<ReviewDoc[]>(() => {
    const stored = localStorage.getItem('sitegeiste_doc_reviews')
    return stored ? JSON.parse(stored) : SAMPLE_DOCS
  })
  const [activeDoc, setActiveDoc] = useState<ReviewDoc | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | 'all'>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [newDoc, setNewDoc] = useState({ title: '', content: '', author: 'Elijah Bleaux' })
  const [newComment, setNewComment] = useState('')
  const [showResolved, setShowResolved] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState('')

  const saveDocs = (updated: ReviewDoc[]) => {
    setDocs(updated)
    localStorage.setItem('sitegeiste_doc_reviews', JSON.stringify(updated))
  }

  const createDoc = () => {
    if (!newDoc.title.trim()) return
    const doc: ReviewDoc = {
      id: `review_${Date.now()}`,
      title: newDoc.title,
      content: newDoc.content,
      author: newDoc.author,
      status: 'draft',
      reviewers: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '0.1.0'
    }
    saveDocs([doc, ...docs])
    setNewDoc({ title: '', content: '', author: 'Elijah Bleaux' })
    setShowCreate(false)
    setActiveDoc(doc)
  }

  const addComment = () => {
    if (!newComment.trim() || !activeDoc) return
    const comment: ReviewComment = {
      id: `c_${Date.now()}`,
      author: 'Elijah Bleaux',
      text: newComment,
      createdAt: new Date().toISOString(),
      resolved: false
    }
    const updated = docs.map(d =>
      d.id === activeDoc.id
        ? { ...d, comments: [...d.comments, comment], updatedAt: new Date().toISOString() }
        : d
    )
    saveDocs(updated)
    setActiveDoc({ ...activeDoc, comments: [...activeDoc.comments, comment], updatedAt: new Date().toISOString() })
    setNewComment('')
  }

  const toggleResolveComment = (commentId: string) => {
    if (!activeDoc) return
    const updated = docs.map(d =>
      d.id === activeDoc.id
        ? {
            ...d,
            comments: d.comments.map(c =>
              c.id === commentId ? { ...c, resolved: !c.resolved } : c
            )
          }
        : d
    )
    saveDocs(updated)
    setActiveDoc({
      ...activeDoc,
      comments: activeDoc.comments.map(c =>
        c.id === commentId ? { ...c, resolved: !c.resolved } : c
      )
    })
  }

  const changeStatus = (status: ReviewDoc['status']) => {
    if (!activeDoc) return
    const updated = docs.map(d =>
      d.id === activeDoc.id
        ? { ...d, status, updatedAt: new Date().toISOString() }
        : d
    )
    saveDocs(updated)
    setActiveDoc({ ...activeDoc, status, updatedAt: new Date().toISOString() })
  }

  const updateContent = () => {
    if (!activeDoc || !editContent.trim()) return
    const updated = docs.map(d =>
      d.id === activeDoc.id
        ? { ...d, content: editContent, updatedAt: new Date().toISOString() }
        : d
    )
    saveDocs(updated)
    setActiveDoc({ ...activeDoc, content: editContent, updatedAt: new Date().toISOString() })
    setEditing(false)
  }

  const deleteDoc = (id: string) => {
    const updated = docs.filter(d => d.id !== id)
    saveDocs(updated)
    if (activeDoc?.id === id) setActiveDoc(null)
  }

  const filteredDocs = docs.filter(d => {
    const matchesSearch = !searchQuery ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusConfig = (status: string) => STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft

  const renderMarkdown = (content: string) => {
    const lines = content.split('\n')
    return lines.map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold text-njz-text mt-4 mb-2">{line.slice(2)}</h1>
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-semibold text-njz-text mt-3 mb-2">{line.slice(3)}</h2>
      if (line.startsWith('- ')) return <li key={i} className="text-sm text-njz-text ml-4">{line.slice(2)}</li>
      if (line.trim() === '') return <div key={i} className="h-2" />
      return <p key={i} className="text-sm text-njz-text">{line}</p>
    })
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-njz-accent-orange/20">
          <MessageSquare className="w-5 h-5 text-njz-accent-orange" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-njz-text">Doc Review</h2>
          <p className="text-sm text-njz-text-muted">Async document review & approval</p>
        </div>
        {!activeDoc && (
          <button
            onClick={() => setShowCreate(true)}
            className="px-3 py-1.5 bg-njz-accent-orange rounded-lg text-white text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5 inline mr-1" />
            New Doc
          </button>
        )}
      </div>

      {!activeDoc ? (
        <>
          {/* Search & Filter */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="flex-1 bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text placeholder:text-njz-text-subtle"
            />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text"
            >
              <option value="all">All Status</option>
              {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
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
              <textarea
                value={newDoc.content}
                onChange={e => setNewDoc({ ...newDoc, content: e.target.value })}
                placeholder="# Document content (Markdown)..."
                className="w-full h-32 bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text placeholder:text-njz-text-subtle resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={createDoc}
                  className="px-4 py-2 bg-njz-accent-orange rounded-lg text-white text-sm font-medium"
                >
                  Create for Review
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
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No documents</p>
              </div>
            ) : (
              filteredDocs.map(doc => {
                const status = getStatusConfig(doc.status)
                const StatusIcon = status.icon
                const unresolvedCount = doc.comments.filter(c => !c.resolved).length
                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setActiveDoc(doc)
                      setEditing(false)
                    }}
                    className="w-full text-left bg-njz-bg-overlay hover:bg-njz-bg-surface rounded-lg p-3 border border-njz-border transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusIcon className={`w-4 h-4 ${status.color.split(' ')[0]}`} />
                          <h3 className="text-sm font-medium text-njz-text">{doc.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-njz-text-muted">
                          <span>By {doc.author}</span>
                          <span>• v{doc.version}</span>
                          <span>• {doc.comments.length} comments</span>
                          {unresolvedCount > 0 && (
                            <span className="text-orange-400">• {unresolvedCount} unresolved</span>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </>
      ) : (
        <>
          {/* Active Document Review */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setActiveDoc(null)
                setEditing(false)
              }}
              className="text-sm text-njz-text-muted hover:text-njz-text"
            >
              ← Back to reviews
            </button>
            <div className="flex items-center gap-2">
              {editing ? (
                <>
                  <button
                    onClick={updateContent}
                    className="px-3 py-1.5 bg-njz-accent-green rounded text-white text-xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5 inline mr-1" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-3 py-1.5 border border-njz-border rounded text-njz-text text-xs"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setEditContent(activeDoc.content)
                    setEditing(true)
                  }}
                  className="p-1.5 text-njz-text-muted hover:text-njz-accent-teal"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => deleteDoc(activeDoc.id)}
                className="p-1.5 text-njz-text-muted hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-4 h-full">
            {/* Document Content */}
            <div className="flex-1 flex flex-col space-y-3">
              <div className="bg-njz-bg-overlay rounded-lg p-3 border border-njz-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-njz-text font-semibold">{activeDoc.title}</h3>
                  {(() => {
                    const status = getStatusConfig(activeDoc.status)
                    return <span className={`px-2 py-0.5 rounded text-xs border ${status.color}`}>{status.label}</span>
                  })()}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-njz-text-muted">
                  <span>By {activeDoc.author}</span>
                  <span>• v{activeDoc.version}</span>
                  <span>• Updated {new Date(activeDoc.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

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

              {/* Status Actions */}
              {!editing && (
                <div className="flex gap-2">
                  <button
                    onClick={() => changeStatus('approved')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      activeDoc.status === 'approved'
                        ? 'bg-green-900/30 text-green-400 border border-green-800'
                        : 'bg-njz-bg-overlay text-njz-text-muted border border-njz-border hover:text-green-400'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5 inline mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => changeStatus('changes-requested')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      activeDoc.status === 'changes-requested'
                        ? 'bg-orange-900/30 text-orange-400 border border-orange-800'
                        : 'bg-njz-bg-overlay text-njz-text-muted border border-njz-border hover:text-orange-400'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                    Request Changes
                  </button>
                  <button
                    onClick={() => changeStatus('rejected')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      activeDoc.status === 'rejected'
                        ? 'bg-red-900/30 text-red-400 border border-red-800'
                        : 'bg-njz-bg-overlay text-njz-text-muted border border-njz-border hover:text-red-400'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5 inline mr-1" />
                    Reject
                  </button>
                  <button
                    onClick={() => changeStatus('in-review')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      activeDoc.status === 'in-review'
                        ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
                        : 'bg-njz-bg-overlay text-njz-text-muted border border-njz-border hover:text-yellow-400'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 inline mr-1" />
                    Mark In Review
                  </button>
                </div>
              )}
            </div>

            {/* Comments Sidebar */}
            <div className="w-72 bg-njz-bg-overlay rounded-lg border border-njz-border flex flex-col">
              <div className="p-3 border-b border-njz-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-njz-text">
                    Comments ({activeDoc.comments.filter(c => !c.resolved || showResolved).length})
                  </span>
                  <button
                    onClick={() => setShowResolved(!showResolved)}
                    className="text-[10px] text-njz-text-muted hover:text-njz-text"
                  >
                    {showResolved ? 'Hide resolved' : 'Show resolved'}
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {activeDoc.comments
                  .filter(c => !c.resolved || showResolved)
                  .map(comment => (
                    <div
                      key={comment.id}
                      className={`p-2.5 rounded-lg border ${
                        comment.resolved
                          ? 'bg-njz-bg border-njz-border opacity-50'
                          : 'bg-njz-bg border-njz-border'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3 h-3 text-njz-text-muted" />
                          <span className="text-xs font-medium text-njz-text">{comment.author}</span>
                        </div>
                        <button
                          onClick={() => toggleResolveComment(comment.id)}
                          className={`p-0.5 ${
                            comment.resolved
                              ? 'text-green-400'
                              : 'text-njz-text-muted hover:text-green-400'
                          }`}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-njz-text">{comment.text}</p>
                      <span className="text-[10px] text-njz-text-muted">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}

                {activeDoc.comments.filter(c => !c.resolved || showResolved).length === 0 && (
                  <div className="text-center py-4 text-njz-text-muted">
                    <MessageSquare className="w-6 h-6 mx-auto mb-1 opacity-50" />
                    <p className="text-xs">No comments</p>
                  </div>
                )}
              </div>

              {/* Add Comment */}
              <div className="p-3 border-t border-njz-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addComment()}
                    placeholder="Add comment..."
                    className="flex-1 bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-xs text-njz-text placeholder:text-njz-text-subtle"
                  />
                  <button
                    onClick={addComment}
                    className="px-3 py-2 bg-njz-accent-orange/20 rounded-lg text-njz-accent-orange"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
