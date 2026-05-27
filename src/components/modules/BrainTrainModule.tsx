import { useState } from 'react'
import { Brain, Lightbulb, RotateCcw, CheckCircle, XCircle } from 'lucide-react'

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

export function BrainTrainModule() {
  const [cards] = useState<FlashCard[]>(SAMPLE_CARDS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [attempted, setAttempted] = useState(0)
  const [sessionComplete, setSessionComplete] = useState(false)

  const currentCard = cards[currentIndex]

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

  const reset = () => {
    setCurrentIndex(0)
    setShowAnswer(false)
    setCorrect(0)
    setAttempted(0)
    setSessionComplete(false)
  }

  if (sessionComplete) {
    const percentage = Math.round((correct / attempted) * 100)

    return (
      <div className="h-full flex flex-col items-center justify-center space-y-6">
        <Brain className="w-16 h-16 text-njz-accent-teal" />
        <h2 className="text-2xl font-bold text-njz-text">Session Complete</h2>
        <div className="text-center space-y-2">
          <p className="text-4xl font-bold text-njz-accent-teal">{percentage}%</p>
          <p className="text-sm text-njz-text-muted">{correct} / {attempted} correct</p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-njz-accent-teal/20 text-njz-accent-teal hover:bg-njz-accent-teal/30"
        >
          <RotateCcw className="w-4 h-4" />
          Start New Session
        </button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-njz-text">Brain Train</h2>
        <p className="text-sm text-njz-text-muted">Flashcards & cognitive training</p>
      </div>

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
    </div>
  )
}
