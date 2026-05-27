import { useState } from 'react'
import { Brain, Lightbulb, RotateCcw, CheckCircle, XCircle, BookOpen, Sun, Moon, Scale, Plus, Trash2, ChevronDown, ChevronUp, Save } from 'lucide-react'

// === Flashcard Types ===
interface FlashCard {
  id: string
  front: string
  back: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  lastReviewed?: string
  nextReview?: string
}

const SAMPLE_CARDS: FlashCard[] = [
  { id: '1', front: 'What is the primary neurotransmitter for focus?', back: 'Dopamine', category: 'Neuroscience', difficulty: 'medium' },
  { id: '2', front: 'Pomodoro Technique duration', back: '25 min work + 5 min break', category: 'Productivity', difficulty: 'easy' },
  { id: '3', front: 'What does "RAT-OS" stand for?', back: 'Rapid Adaptive Task Operating System', category: 'NJZ', difficulty: 'medium' },
  { id: '4', front: 'Optimal sleep cycles per night', back: '4-6 cycles (90 min each)', category: 'Health', difficulty: 'easy' },
]

// === Dostoevsky Journal Types ===
interface JournalEntry {
  id: string
  type: 'morning' | 'evening' | 'conscience'
  content: string
  shadowWork: string[]
  lightWork: string[]
  mood: 'dark' | 'neutral' | 'light'
  createdAt: string
}

interface ConscienceCheck {
  id: string
  question: string
  rating: number // 1-5
  notes: string
  date: string
}

const CONSCIENCE_QUESTIONS = [
  "Did I act with integrity today?",
  "Did I harm anyone through my actions or inaction?",
  "Did I avoid necessary confrontations?",
  "Did I prioritize comfort over growth?",
  "Did I speak truth when silence was easier?",
  "Did I show compassion to myself?",
  "Did my actions align with my stated values?",
]

export function BrainTrainModule() {
  // === State ===
  const [activeTab, setActiveTab] = useState<'flashcards' | 'journal'>('flashcards')

  // Flashcard state
  const [cards] = useState<FlashCard[]>(SAMPLE_CARDS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [attempted, setAttempted] = useState(0)
  const [sessionComplete, setSessionComplete] = useState(false)

  // Journal state
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const stored = localStorage.getItem('dostoevsky_journal')
    return stored ? JSON.parse(stored) : []
  })
  const [journalType, setJournalType] = useState<'morning' | 'evening' | 'conscience'>('morning')
  const [journalContent, setJournalContent] = useState('')
  const [shadowItems, setShadowItems] = useState<string[]>([])
  const [lightItems, setLightItems] = useState<string[]>([])
  const [mood, setMood] = useState<'dark' | 'neutral' | 'light'>('neutral')
  const [newItem, setNewItem] = useState('')
  const [itemType, setItemType] = useState<'shadow' | 'light'>('shadow')
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  // Conscience check state
  const [conscienceChecks, setConscienceChecks] = useState<ConscienceCheck[]>(() => {
    const stored = localStorage.getItem('dostoevsky_conscience')
    return stored ? JSON.parse(stored) : []
  })
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [currentRating, setCurrentRating] = useState(3)
  const [currentNotes, setCurrentNotes] = useState('')
  const [showConscienceResults, setShowConscienceResults] = useState(false)

  const currentCard = cards[currentIndex]

  // === Flashcard Functions ===
  const handleAnswer = (wasCorrect: boolean) => {
    setAttempted(prev => prev + 1)
    if (wasCorrect) setCorrect(prev => prev + 1)
    if (currentIndex >= cards.length - 1) {
      setSessionComplete(true)
    } else {
      setCurrentIndex(prev => prev + 1)
      setShowAnswer(false)
    }
  }

  const resetFlashcards = () => {
    setCurrentIndex(0)
    setShowAnswer(false)
    setCorrect(0)
    setAttempted(0)
    setSessionComplete(false)
  }

  // === Journal Functions ===
  const saveEntries = (updated: JournalEntry[]) => {
    setEntries(updated)
    localStorage.setItem('dostoevsky_journal', JSON.stringify(updated))
  }

  const addItem = () => {
    if (!newItem.trim()) return
    if (itemType === 'shadow') {
      setShadowItems([...shadowItems, newItem.trim()])
    } else {
      setLightItems([...lightItems, newItem.trim()])
    }
    setNewItem('')
  }

  const removeItem = (index: number, type: 'shadow' | 'light') => {
    if (type === 'shadow') {
      setShadowItems(shadowItems.filter((_, i) => i !== index))
    } else {
      setLightItems(lightItems.filter((_, i) => i !== index))
    }
  }

  const saveJournalEntry = () => {
    const entry: JournalEntry = {
      id: `entry_${Date.now()}`,
      type: journalType,
      content: journalContent,
      shadowWork: [...shadowItems],
      lightWork: [...lightItems],
      mood,
      createdAt: new Date().toISOString()
    }
    saveEntries([entry, ...entries])
    setJournalContent('')
    setShadowItems([])
    setLightItems([])
    setMood('neutral')
  }

  const deleteEntry = (id: string) => {
    saveEntries(entries.filter(e => e.id !== id))
  }

  // === Conscience Functions ===
  const saveConscienceChecks = (updated: ConscienceCheck[]) => {
    setConscienceChecks(updated)
    localStorage.setItem('dostoevsky_conscience', JSON.stringify(updated))
  }

  const submitConscienceAnswer = () => {
    const check: ConscienceCheck = {
      id: `check_${Date.now()}`,
      question: CONSCIENCE_QUESTIONS[currentQuestion],
      rating: currentRating,
      notes: currentNotes,
      date: new Date().toISOString()
    }
    saveConscienceChecks([...conscienceChecks, check])
    setCurrentNotes('')
    setCurrentRating(3)
    if (currentQuestion < CONSCIENCE_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setShowConscienceResults(true)
      setCurrentQuestion(0)
    }
  }

  const resetConscience = () => {
    setShowConscienceResults(false)
    setCurrentQuestion(0)
    setCurrentRating(3)
    setCurrentNotes('')
  }

  const getMoodIcon = (m: string) => {
    switch (m) {
      case 'dark': return <Moon className="w-4 h-4 text-purple-400" />
      case 'light': return <Sun className="w-4 h-4 text-yellow-400" />
      default: return <Scale className="w-4 h-4 text-gray-400" />
    }
  }

  const getMoodLabel = (m: string) => {
    switch (m) {
      case 'dark': return 'Shadow'
      case 'light': return 'Light'
      default: return 'Neutral'
    }
  }

  // === Render ===
  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header with Tabs */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-njz-accent-teal/20">
            <Brain className="w-5 h-5 text-njz-accent-teal" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-njz-text">Brain Train</h2>
            <p className="text-sm text-njz-text-muted">Flashcards & Dostoevsky Journal</p>
          </div>
        </div>

        <div className="flex gap-1 bg-njz-bg-overlay rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              activeTab === 'flashcards'
                ? 'bg-njz-accent-teal/20 text-njz-accent-teal font-medium'
                : 'text-njz-text-muted hover:text-njz-text'
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              activeTab === 'journal'
                ? 'bg-njz-accent-teal/20 text-njz-accent-teal font-medium'
                : 'text-njz-text-muted hover:text-njz-text'
            }`}
          >
            Dostoevsky Journal
          </button>
        </div>
      </div>

      {/* Flashcards Tab */}
      {activeTab === 'flashcards' && (
        <div className="flex-1 flex flex-col">
          {sessionComplete ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <Brain className="w-16 h-16 text-njz-accent-teal" />
              <h2 className="text-2xl font-bold text-njz-text">Session Complete</h2>
              <div className="text-center space-y-2">
                <p className="text-4xl font-bold text-njz-accent-teal">
                  {Math.round((correct / attempted) * 100)}%
                </p>
                <p className="text-sm text-njz-text-muted">{correct} / {attempted} correct</p>
              </div>
              <button
                onClick={resetFlashcards}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-njz-accent-teal/20 text-njz-accent-teal hover:bg-njz-accent-teal/30"
              >
                <RotateCcw className="w-4 h-4" />
                Start New Session
              </button>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-njz-text-muted mb-1">
                  <span>Card {currentIndex + 1} of {cards.length}</span>
                  <span>{correct} correct</span>
                </div>
                <div className="h-1 bg-njz-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-njz-accent-teal transition-all"
                    style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Card */}
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-lg">
                  <div className="glass-panel p-8 rounded-xl text-center space-y-6 min-h-[200px] flex flex-col justify-center">
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      currentCard.difficulty === 'easy' ? 'border-njz-accent-green text-njz-accent-green' :
                      currentCard.difficulty === 'medium' ? 'border-njz-accent-orange text-njz-accent-orange' :
                      'border-njz-accent-red text-njz-accent-red'
                    }`}>
                      {currentCard.category} · {currentCard.difficulty}
                    </span>

                    <p className="text-lg text-njz-text">{currentCard.front}</p>

                    {showAnswer ? (
                      <>
                        <div className="border-t border-njz-border pt-4">
                          <p className="text-xl font-semibold text-njz-accent-teal">{currentCard.back}</p>
                        </div>
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => handleAnswer(false)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-njz-accent-red/20 text-njz-accent-red hover:bg-njz-accent-red/30"
                          >
                            <XCircle className="w-4 h-4" />
                            Incorrect
                          </button>
                          <button
                            onClick={() => handleAnswer(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-njz-accent-green/20 text-njz-accent-green hover:bg-njz-accent-green/30"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Correct
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => setShowAnswer(true)}
                        className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-njz-accent-teal/20 text-njz-accent-teal hover:bg-njz-accent-teal/30"
                      >
                        <Lightbulb className="w-4 h-4" />
                        Show Answer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Dostoevsky Journal Tab */}
      {activeTab === 'journal' && (
        <div className="flex-1 flex flex-col space-y-4 overflow-y-auto">
          {/* Journal Type Selector */}
          <div className="flex gap-2">
            {(['morning', 'evening', 'conscience'] as const).map(type => (
              <button
                key={type}
                onClick={() => {
                  setJournalType(type)
                  setShowHistory(false)
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  journalType === type && !showHistory
                    ? 'bg-njz-accent-teal/20 text-njz-accent-teal border border-njz-accent-teal/30'
                    : 'bg-njz-bg-overlay text-njz-text-muted border border-njz-border hover:text-njz-text'
                }`}
              >
                {type === 'morning' && <Sun className="w-3 h-3 inline mr-1" />}
                {type === 'evening' && <Moon className="w-3 h-3 inline mr-1" />}
                {type === 'conscience' && <Scale className="w-3 h-3 inline mr-1" />}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ml-auto ${
                showHistory
                  ? 'bg-njz-accent-purple/20 text-njz-accent-purple border border-njz-accent-purple/30'
                  : 'bg-njz-bg-overlay text-njz-text-muted border border-njz-border'
              }`}
            >
              <BookOpen className="w-3 h-3 inline mr-1" />
              History
            </button>
          </div>

          {/* History View */}
          {showHistory ? (
            <div className="space-y-2">
              {entries.length === 0 ? (
                <div className="text-center py-8 text-njz-text-muted">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No journal entries yet</p>
                </div>
              ) : (
                entries.map(entry => (
                  <div key={entry.id} className="bg-njz-bg-overlay rounded-lg border border-njz-border">
                    <button
                      onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                      className="w-full flex items-center justify-between p-3"
                    >
                      <div className="flex items-center gap-2">
                        {getMoodIcon(entry.mood)}
                        <span className="text-sm font-medium text-njz-text">
                          {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)} Pages
                        </span>
                        <span className="text-xs text-njz-text-muted">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {expandedEntry === entry.id ? (
                          <ChevronUp className="w-4 h-4 text-njz-text-muted" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-njz-text-muted" />
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); deleteEntry(entry.id) }}
                          className="p-1 text-njz-text-muted hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </button>

                    {expandedEntry === entry.id && (
                      <div className="px-3 pb-3 space-y-3">
                        {entry.content && (
                          <div>
                            <p className="text-xs text-njz-text-muted mb-1">Entry</p>
                            <p className="text-sm text-njz-text whitespace-pre-wrap">{entry.content}</p>
                          </div>
                        )}
                        {entry.shadowWork.length > 0 && (
                          <div>
                            <p className="text-xs text-njz-text-muted mb-1">Shadow Work</p>
                            <ul className="space-y-1">
                              {entry.shadowWork.map((item, i) => (
                                <li key={i} className="text-sm text-red-400 flex items-center gap-1.5">
                                  <Moon className="w-3 h-3" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {entry.lightWork.length > 0 && (
                          <div>
                            <p className="text-xs text-njz-text-muted mb-1">Light Work</p>
                            <ul className="space-y-1">
                              {entry.lightWork.map((item, i) => (
                                <li key={i} className="text-sm text-yellow-400 flex items-center gap-1.5">
                                  <Sun className="w-3 h-3" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <>
              {/* Morning / Evening Journal Form */}
              {journalType !== 'conscience' && (
                <div className="space-y-4">
                  {/* Mood Selection */}
                  <div>
                    <p className="text-xs font-medium text-njz-text-muted mb-2">
                      {journalType === 'morning' ? 'Morning Mood' : 'Evening Reflection'}
                    </p>
                    <div className="flex gap-2">
                      {(['dark', 'neutral', 'light'] as const).map(m => (
                        <button
                          key={m}
                          onClick={() => setMood(m)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                            mood === m
                              ? m === 'dark' ? 'bg-purple-900/30 text-purple-400 border border-purple-800' :
                                m === 'light' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800' :
                                'bg-gray-800 text-gray-300 border border-gray-700'
                              : 'bg-njz-bg-overlay text-njz-text-muted border border-njz-border hover:text-njz-text'
                          }`}
                        >
                          {getMoodIcon(m)}
                          {getMoodLabel(m)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Free Writing */}
                  <div>
                    <p className="text-xs font-medium text-njz-text-muted mb-2">
                      {journalType === 'morning' ? 'Morning Pages' : 'Evening Reflection'}
                    </p>
                    <textarea
                      value={journalContent}
                      onChange={e => setJournalContent(e.target.value)}
                      placeholder={
                        journalType === 'morning'
                          ? "Stream of consciousness... What's on your mind this morning?"
                          : "Reflect on your day... What moved you? What drained you?"
                      }
                      className="w-full h-32 bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text placeholder:text-njz-text-subtle resize-none"
                    />
                  </div>

                  {/* Shadow/Light Work */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Shadow */}
                    <div className="bg-njz-bg-overlay rounded-lg p-3 border border-njz-border">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Moon className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-medium text-njz-text">Shadow Work</span>
                      </div>
                      <ul className="space-y-1 mb-2">
                        {shadowItems.map((item, i) => (
                          <li key={i} className="text-xs text-purple-400 flex items-center justify-between">
                            <span>• {item}</span>
                            <button
                              onClick={() => removeItem(i, 'shadow')}
                              className="text-njz-text-muted hover:text-red-400"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                      {itemType === 'shadow' && (
                        <div className="flex gap-1">
                          <input
                            type="text"
                            value={newItem}
                            onChange={e => setNewItem(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addItem()}
                            placeholder="Add shadow item..."
                            className="flex-1 bg-njz-bg border border-njz-border rounded px-2 py-1 text-xs text-njz-text"
                          />
                          <button
                            onClick={() => { setItemType('shadow'); addItem(); }}
                            className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Light */}
                    <div className="bg-njz-bg-overlay rounded-lg p-3 border border-njz-border">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sun className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs font-medium text-njz-text">Light Work</span>
                      </div>
                      <ul className="space-y-1 mb-2">
                        {lightItems.map((item, i) => (
                          <li key={i} className="text-xs text-yellow-400 flex items-center justify-between">
                            <span>• {item}</span>
                            <button
                              onClick={() => removeItem(i, 'light')}
                              className="text-njz-text-muted hover:text-red-400"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                      {itemType === 'light' && (
                        <div className="flex gap-1">
                          <input
                            type="text"
                            value={newItem}
                            onChange={e => setNewItem(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addItem()}
                            placeholder="Add light item..."
                            className="flex-1 bg-njz-bg border border-njz-border rounded px-2 py-1 text-xs text-njz-text"
                          />
                          <button
                            onClick={() => { setItemType('light'); addItem(); }}
                            className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Item Type Toggle */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setItemType('shadow')}
                      className={`px-3 py-1.5 rounded text-xs ${
                        itemType === 'shadow'
                          ? 'bg-purple-900/30 text-purple-400 border border-purple-800'
                          : 'bg-njz-bg-overlay text-njz-text-muted border border-njz-border'
                      }`}
                    >
                      <Moon className="w-3 h-3 inline mr-1" />
                      Add Shadow
                    </button>
                    <button
                      onClick={() => setItemType('light')}
                      className={`px-3 py-1.5 rounded text-xs ${
                        itemType === 'light'
                          ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
                          : 'bg-njz-bg-overlay text-njz-text-muted border border-njz-border'
                      }`}
                    >
                      <Sun className="w-3 h-3 inline mr-1" />
                      Add Light
                    </button>
                  </div>

                  {/* Save */}
                  <button
                    onClick={saveJournalEntry}
                    disabled={!journalContent.trim() && shadowItems.length === 0 && lightItems.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-njz-accent-teal rounded-lg text-white text-sm font-medium disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    Save Entry
                  </button>
                </div>
              )}

              {/* Conscience Check Form */}
              {journalType === 'conscience' && !showConscienceResults && (
                <div className="space-y-4">
                  <div className="bg-njz-bg-overlay rounded-lg p-4 border border-njz-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-njz-text-muted">
                        Question {currentQuestion + 1} of {CONSCIENCE_QUESTIONS.length}
                      </span>
                      <span className="text-xs text-njz-text-muted">
                        {Math.round(((currentQuestion + 1) / CONSCIENCE_QUESTIONS.length) * 100)}%
                      </span>
                    </div>
                    <div className="h-1 bg-njz-border rounded-full mb-4">
                      <div
                        className="h-full bg-njz-accent-teal transition-all rounded-full"
                        style={{ width: `${((currentQuestion + 1) / CONSCIENCE_QUESTIONS.length) * 100}%` }}
                      />
                    </div>

                    <p className="text-sm text-njz-text font-medium mb-4">
                      {CONSCIENCE_QUESTIONS[currentQuestion]}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-njz-text-muted mb-2">Self-Assessment (1-5)</p>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(n => (
                            <button
                              key={n}
                              onClick={() => setCurrentRating(n)}
                              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                                currentRating === n
                                  ? 'bg-njz-accent-teal text-white'
                                  : 'bg-njz-bg border border-njz-border text-njz-text-muted hover:text-njz-text'
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-njz-text-muted mt-1">
                          <span>Strongly Disagree</span>
                          <span>Strongly Agree</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-njz-text-muted mb-2">Notes (optional)</p>
                        <textarea
                          value={currentNotes}
                          onChange={e => setCurrentNotes(e.target.value)}
                          placeholder="Why this rating? What evidence supports it?"
                          className="w-full h-20 bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text placeholder:text-njz-text-subtle resize-none"
                        />
                      </div>

                      <button
                        onClick={submitConscienceAnswer}
                        className="w-full py-2 bg-njz-accent-teal rounded-lg text-white text-sm font-medium"
                      >
                        {currentQuestion < CONSCIENCE_QUESTIONS.length - 1 ? 'Next Question' : 'Complete Check'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Conscience Results */}
              {journalType === 'conscience' && showConscienceResults && (
                <div className="space-y-4">
                  <div className="bg-njz-bg-overlay rounded-lg p-4 border border-njz-border text-center">
                    <Scale className="w-12 h-12 mx-auto mb-3 text-njz-accent-teal" />
                    <h3 className="text-njz-text font-semibold mb-2">Conscience Check Complete</h3>
                    <p className="text-sm text-njz-text-muted mb-4">
                      Average score: {(
                        conscienceChecks
                          .filter(c => c.date > new Date(Date.now() - 86400000).toISOString())
                          .reduce((sum, c) => sum + c.rating, 0) /
                        Math.max(1, conscienceChecks.filter(c => c.date > new Date(Date.now() - 86400000).toISOString()).length)
                      ).toFixed(1)} / 5
                    </p>
                    <button
                      onClick={resetConscience}
                      className="px-4 py-2 bg-njz-accent-teal/20 text-njz-accent-teal rounded-lg text-sm"
                    >
                      <RotateCcw className="w-4 h-4 inline mr-1" />
                      Start New Check
                    </button>
                  </div>

                  {/* Recent Checks */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-njz-text-muted uppercase">Recent Answers</p>
                    {conscienceChecks
                      .filter(c => c.date > new Date(Date.now() - 86400000).toISOString())
                      .map(check => (
                        <div key={check.id} className="bg-njz-bg rounded-lg p-3 border border-njz-border">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-njz-text">{check.question}</p>
                            <span className={`text-xs font-medium ${
                              check.rating >= 4 ? 'text-green-400' :
                              check.rating >= 3 ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {check.rating}/5
                            </span>
                          </div>
                          {check.notes && (
                            <p className="text-xs text-njz-text-muted">{check.notes}</p>
                          )}
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
