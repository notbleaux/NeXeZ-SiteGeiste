import { useState } from 'react'
import { Layout, Plus, Trash2, Clock, FileText, Archive } from 'lucide-react'

interface KanbanCard {
  id: string
  title: string
  description: string
  column: 'research' | 'wip' | 'standby'
  priority: 'low' | 'medium' | 'high' | 'critical'
  tags: string[]
  createdAt: string
  updatedAt: string
  dueDate?: string
  linkedModule?: string
}

interface StudioBoard {
  id: string
  name: string
  description: string
  cards: KanbanCard[]
  createdAt: string
}

const COLUMN_CONFIG = {
  research: { label: 'Research', color: 'bg-blue-900/30 border-blue-800', icon: FileText },
  wip: { label: 'WIP', color: 'bg-yellow-900/30 border-yellow-800', icon: Clock },
  standby: { label: 'Standby', color: 'bg-gray-800/50 border-gray-700', icon: Archive }
}

export function StudioModule() {
  const [boards, setBoards] = useState<StudioBoard[]>(() => {
    const stored = localStorage.getItem('sitegeiste_studio_boards')
    return stored ? JSON.parse(stored) : []
  })
  const [activeBoard, setActiveBoard] = useState<StudioBoard | null>(null)
  const [showCreateBoard, setShowCreateBoard] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')
  const [showAddCard, setShowAddCard] = useState<string | null>(null)
  const [newCard, setNewCard] = useState<{
    title: string
    description: string
    priority: 'low' | 'medium' | 'high' | 'critical'
    tags: string[]
    tagInput: string
  }>({
    title: '',
    description: '',
    priority: 'medium' as const,
    tags: [] as string[],
    tagInput: ''
  })
  const [draggingCard, setDraggingCard] = useState<string | null>(null)

  const saveBoards = (updated: StudioBoard[]) => {
    setBoards(updated)
    localStorage.setItem('sitegeiste_studio_boards', JSON.stringify(updated))
  }

  const createBoard = () => {
    if (!newBoardName.trim()) return
    const board: StudioBoard = {
      id: `board_${Date.now()}`,
      name: newBoardName,
      description: '',
      cards: [],
      createdAt: new Date().toISOString()
    }
    saveBoards([...boards, board])
    setActiveBoard(board)
    setNewBoardName('')
    setShowCreateBoard(false)
  }

  const deleteBoard = (id: string) => {
    const updated = boards.filter(b => b.id !== id)
    saveBoards(updated)
    if (activeBoard?.id === id) setActiveBoard(null)
  }

  const addCard = (column: 'research' | 'wip' | 'standby') => {
    if (!newCard.title.trim() || !activeBoard) return
    const card: KanbanCard = {
      id: `card_${Date.now()}`,
      title: newCard.title,
      description: newCard.description,
      column,
      priority: newCard.priority,
      tags: [...newCard.tags],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const updated = boards.map(b =>
      b.id === activeBoard.id
        ? { ...b, cards: [...b.cards, card] }
        : b
    )
    saveBoards(updated)
    setActiveBoard({ ...activeBoard, cards: [...activeBoard.cards, card] })
    setNewCard({ title: '', description: '', priority: 'medium', tags: [], tagInput: '' })
    setShowAddCard(null)
  }

  const moveCard = (cardId: string, toColumn: 'research' | 'wip' | 'standby') => {
    if (!activeBoard) return
    const updated = boards.map(b =>
      b.id === activeBoard.id
        ? {
            ...b,
            cards: b.cards.map(c =>
              c.id === cardId ? { ...c, column: toColumn, updatedAt: new Date().toISOString() } : c
            )
          }
        : b
    )
    saveBoards(updated)
    setActiveBoard({
      ...activeBoard,
      cards: activeBoard.cards.map(c =>
        c.id === cardId ? { ...c, column: toColumn, updatedAt: new Date().toISOString() } : c
      )
    })
    setDraggingCard(null)
  }

  const deleteCard = (cardId: string) => {
    if (!activeBoard) return
    const updated = boards.map(b =>
      b.id === activeBoard.id
        ? { ...b, cards: b.cards.filter(c => c.id !== cardId) }
        : b
    )
    saveBoards(updated)
    setActiveBoard({ ...activeBoard, cards: activeBoard.cards.filter(c => c.id !== cardId) })
  }

  const addTag = () => {
    if (!newCard.tagInput.trim()) return
    if (newCard.tags.includes(newCard.tagInput.trim())) return
    setNewCard({ ...newCard, tags: [...newCard.tags, newCard.tagInput.trim()], tagInput: '' })
  }

  const removeTag = (tag: string) => {
    setNewCard({ ...newCard, tags: newCard.tags.filter(t => t !== tag) })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-900/50 text-red-400 border-red-800'
      case 'high': return 'bg-orange-900/50 text-orange-400 border-orange-800'
      case 'medium': return 'bg-yellow-900/50 text-yellow-400 border-yellow-800'
      default: return 'bg-gray-800 text-gray-400 border-gray-700'
    }
  }

  const columnCards = (column: string) => {
    if (!activeBoard) return []
    return activeBoard.cards.filter(c => c.column === column)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-njz-accent-teal/20">
          <Layout className="w-5 h-5 text-njz-accent-teal" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-njz-text">Studio</h2>
          <p className="text-sm text-njz-text-muted">Research / WIP / Standby boards</p>
        </div>
      </div>

      {!activeBoard ? (
        <>
          {/* Create Board */}
          <div className="bg-njz-bg-overlay rounded-lg p-4">
            {!showCreateBoard ? (
              <button
                onClick={() => setShowCreateBoard(true)}
                className="flex items-center gap-2 text-njz-accent-teal hover:underline text-sm"
              >
                <Plus className="w-4 h-4" />
                New Board
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={newBoardName}
                  onChange={e => setNewBoardName(e.target.value)}
                  placeholder="Board name (e.g., 'ZeSporteXte Feature Pipeline')"
                  className="w-full bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text placeholder:text-njz-text-subtle"
                />
                <div className="flex gap-2">
                  <button
                    onClick={createBoard}
                    className="px-4 py-2 bg-njz-accent-teal rounded-lg text-white text-sm font-medium"
                  >
                    Create Board
                  </button>
                  <button
                    onClick={() => setShowCreateBoard(false)}
                    className="px-4 py-2 border border-njz-border rounded-lg text-njz-text text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Boards List */}
          {boards.length === 0 ? (
            <div className="text-center py-12 text-njz-text-muted">
              <Layout className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No boards yet</p>
              <p className="text-xs mt-1">Create a board to organize your work</p>
            </div>
          ) : (
            <div className="space-y-2">
              {boards.map(board => (
                <button
                  key={board.id}
                  onClick={() => setActiveBoard(board)}
                  className="w-full text-left bg-njz-bg-overlay hover:bg-njz-bg-surface rounded-lg p-4 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-njz-text font-medium text-sm">{board.name}</h3>
                      <p className="text-xs text-njz-text-muted mt-0.5">
                        {board.cards.length} cards • 
                        {board.cards.filter(c => c.column === 'research').length} research • 
                        {board.cards.filter(c => c.column === 'wip').length} wip • 
                        {board.cards.filter(c => c.column === 'standby').length} standby
                      </p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); deleteBoard(board.id) }}
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
          {/* Active Board Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveBoard(null)}
              className="text-sm text-njz-text-muted hover:text-njz-text"
            >
              ← Back to boards
            </button>
            <button
              onClick={() => deleteBoard(activeBoard.id)}
              className="p-1.5 text-njz-text-muted hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-njz-bg-overlay rounded-lg p-4">
            <h3 className="text-njz-text font-semibold">{activeBoard.name}</h3>
            <p className="text-xs text-njz-text-muted">
              {activeBoard.cards.length} total cards
            </p>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-3 gap-3 min-h-[400px]">
            {(Object.keys(COLUMN_CONFIG) as Array<'research' | 'wip' | 'standby'>).map(column => {
              const config = COLUMN_CONFIG[column]
              const cards = columnCards(column)
              const Icon = config.icon

              return (
                <div
                  key={column}
                  className={`rounded-lg border ${config.color} p-3`}
                  onDragOver={e => {
                    e.preventDefault()
                    e.dataTransfer.dropEffect = 'move'
                  }}
                  onDrop={e => {
                    e.preventDefault()
                    const cardId = e.dataTransfer.getData('text/plain')
                    if (cardId && draggingCard === cardId) {
                      moveCard(cardId, column)
                    }
                  }}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-njz-text-muted" />
                      <span className="text-sm font-medium text-njz-text">{config.label}</span>
                      <span className="text-xs text-njz-text-muted">({cards.length})</span>
                    </div>
                    <button
                      onClick={() => setShowAddCard(column)}
                      className="p-1 text-njz-text-muted hover:text-njz-accent-teal"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2">
                    {cards.map(card => (
                      <div
                        key={card.id}
                        draggable
                        onDragStart={e => {
                          e.dataTransfer.setData('text/plain', card.id)
                          setDraggingCard(card.id)
                        }}
                        onDragEnd={() => setDraggingCard(null)}
                        className="bg-njz-bg rounded-lg p-3 border border-njz-border cursor-move hover:border-njz-accent-teal/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-njz-text">{card.title}</h4>
                          <button
                            onClick={() => deleteCard(card.id)}
                            className="p-0.5 text-njz-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {card.description && (
                          <p className="text-xs text-njz-text-muted mt-1 line-clamp-2">{card.description}</p>
                        )}

                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] border ${getPriorityColor(card.priority)}`}>
                            {card.priority}
                          </span>
                          {card.tags.map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] bg-njz-bg border border-njz-border text-njz-text-muted">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 mt-2 text-[10px] text-njz-text-muted">
                          <Clock className="w-3 h-3" />
                          {new Date(card.createdAt).toLocaleDateString()}
                        </div>

                        {/* Move buttons */}
                        <div className="flex gap-1 mt-2">
                          {column !== 'research' && (
                            <button
                              onClick={() => moveCard(card.id, 'research')}
                              className="text-[10px] px-2 py-0.5 bg-blue-900/30 text-blue-400 rounded hover:bg-blue-900/50"
                            >
                              ← Research
                            </button>
                          )}
                          {column !== 'wip' && (
                            <button
                              onClick={() => moveCard(card.id, 'wip')}
                              className="text-[10px] px-2 py-0.5 bg-yellow-900/30 text-yellow-400 rounded hover:bg-yellow-900/50"
                            >
                              {column === 'research' ? '→ WIP' : '← WIP'}
                            </button>
                          )}
                          {column !== 'standby' && (
                            <button
                              onClick={() => moveCard(card.id, 'standby')}
                              className="text-[10px] px-2 py-0.5 bg-gray-700 text-gray-400 rounded hover:bg-gray-600"
                            >
                              → Standby
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Card Form */}
                  {showAddCard === column && (
                    <div className="mt-2 bg-njz-bg rounded-lg p-3 border border-njz-border">
                      <input
                        type="text"
                        value={newCard.title}
                        onChange={e => setNewCard({ ...newCard, title: e.target.value })}
                        placeholder="Card title"
                        className="w-full bg-transparent text-sm text-njz-text placeholder:text-njz-text-subtle border-none outline-none mb-2"
                        autoFocus
                      />
                      <textarea
                        value={newCard.description}
                        onChange={e => setNewCard({ ...newCard, description: e.target.value })}
                        placeholder="Description (optional)"
                        className="w-full h-16 bg-njz-bg border border-njz-border rounded px-2 py-1 text-xs text-njz-text placeholder:text-njz-text-subtle resize-none mb-2"
                      />
                      <div className="flex items-center gap-2 mb-2">
                        <select
                          value={newCard.priority}
                          onChange={e => setNewCard({ ...newCard, priority: e.target.value as 'low' | 'medium' | 'high' | 'critical' })}
                          className="text-xs bg-njz-bg border border-njz-border rounded px-2 py-1 text-njz-text"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        <input
                          type="text"
                          value={newCard.tagInput}
                          onChange={e => setNewCard({ ...newCard, tagInput: e.target.value })}
                          onKeyDown={e => e.key === 'Enter' && addTag()}
                          placeholder="Add tag..."
                          className="flex-1 bg-njz-bg border border-njz-border rounded px-2 py-1 text-xs text-njz-text placeholder:text-njz-text-subtle"
                        />
                        <button onClick={addTag} className="text-xs text-njz-accent-teal px-2">Add</button>
                      </div>
                      {newCard.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {newCard.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-njz-bg border border-njz-border text-njz-text">
                              {tag}
                              <button onClick={() => removeTag(tag)} className="text-njz-text-muted hover:text-red-400">×</button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => addCard(column)}
                          className="px-3 py-1.5 bg-njz-accent-teal rounded text-white text-xs font-medium"
                        >
                          Add Card
                        </button>
                        <button
                          onClick={() => {
                            setShowAddCard(null)
                            setNewCard({ title: '', description: '', priority: 'medium', tags: [], tagInput: '' })
                          }}
                          className="px-3 py-1.5 border border-njz-border rounded text-njz-text text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
