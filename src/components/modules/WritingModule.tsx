import { useState, useCallback } from 'react'
import { PenTool, Save, Download, Hash } from 'lucide-react'

interface Manuscript {
  id: string
  title: string
  content: string
  wordCount: number
  createdAt: string
  updatedAt: string
}

export function WritingModule() {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>(() => {
    try {
      const raw = localStorage.getItem('sitegeiste-manuscripts')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })
  const [activeId, setActiveId] = useState<string | null>(null)
  const [title, setTitle] = useState('Untitled')
  const [content, setContent] = useState('')
  const [showList, setShowList] = useState(true)

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  const saveManuscript = useCallback(() => {
    if (!content.trim()) return

    const now = new Date().toISOString()
    if (activeId) {
      setManuscripts(prev =>
        prev.map(m =>
          m.id === activeId
            ? { ...m, title, content, wordCount, updatedAt: now }
            : m
        )
      )
    } else {
      const newM: Manuscript = {
        id: Math.random().toString(36).substring(2, 9),
        title: title || 'Untitled',
        content,
        wordCount,
        createdAt: now,
        updatedAt: now,
      }
      setManuscripts(prev => [newM, ...prev])
      setActiveId(newM.id)
    }

    // Persist
    const updated = activeId
      ? manuscripts.map(m => m.id === activeId ? { ...m, title, content, wordCount, updatedAt: now } : m)
      : [{ id: Math.random().toString(36).substring(2, 9), title: title || 'Untitled', content, wordCount, createdAt: now, updatedAt: now }, ...manuscripts]
    localStorage.setItem('sitegeiste-manuscripts', JSON.stringify(updated))
  }, [activeId, title, content, wordCount, manuscripts])

  const loadManuscript = (m: Manuscript) => {
    setActiveId(m.id)
    setTitle(m.title)
    setContent(m.content)
    setShowList(false)
  }

  const exportText = () => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/\s+/g, '_')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PenTool className="w-5 h-5 text-njz-accent-orange" />
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="bg-transparent text-lg font-bold text-njz-text focus:outline-none placeholder-njz-text-subtle"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-njz-text-muted flex items-center gap-1">
            <Hash className="w-3 h-3" />
            {wordCount} words
          </span>
          <button
            onClick={saveManuscript}
            className="p-2 rounded-lg bg-njz-accent-teal/20 text-njz-accent-teal hover:bg-njz-accent-teal/30"
            title="Save"
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={exportText}
            className="p-2 rounded-lg bg-njz-bg-elevated border border-njz-border text-njz-text-muted hover:text-njz-text"
            title="Export"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Manuscript List */}
        {showList && (
          <div className="w-56 flex-shrink-0 space-y-2 overflow-y-auto">
            <button
              onClick={() => {
                setActiveId(null)
                setTitle('Untitled')
                setContent('')
              }}
              className="w-full p-3 rounded-lg border border-dashed border-njz-border text-njz-text-muted hover:text-njz-accent-teal hover:border-njz-accent-teal text-sm"
            >
              + New Manuscript
            </button>
            {manuscripts.map(m => (
              <button
                key={m.id}
                onClick={() => loadManuscript(m)}
                className={`w-full p-3 rounded-lg text-left border transition-colors ${
                  activeId === m.id
                    ? 'border-njz-accent-orange bg-njz-accent-orange/10'
                    : 'border-njz-border bg-njz-bg-elevated hover:border-njz-text-subtle'
                }`}
              >
                <h4 className="text-sm font-medium text-njz-text truncate">{m.title}</h4>
                <p className="text-xs text-njz-text-muted mt-1">
                  {m.wordCount} words · {new Date(m.updatedAt).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Editor */}
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Start writing..."
          className="flex-1 bg-njz-bg-elevated border border-njz-border rounded-lg p-4 text-njz-text placeholder-njz-text-subtle resize-none focus:outline-none focus:border-njz-accent-orange/50 font-mono text-sm leading-relaxed"
        />
      </div>
    </div>
  )
}
