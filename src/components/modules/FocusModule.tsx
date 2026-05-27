import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw, Coffee, Brain, Volume2 } from 'lucide-react'

type TimerMode = 'focus' | 'short-break' | 'long-break'

const TIMER_CONFIG: Record<TimerMode, { minutes: number; label: string; color: string }> = {
  focus: { minutes: 25, label: 'Focus', color: 'text-njz-accent-teal' },
  'short-break': { minutes: 5, label: 'Short Break', color: 'text-njz-accent-green' },
  'long-break': { minutes: 15, label: 'Long Break', color: 'text-njz-accent-purple' },
}

export function FocusModule() {
  const [mode, setMode] = useState<TimerMode>('focus')
  const [timeLeft, setTimeLeft] = useState(TIMER_CONFIG.focus.minutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(0)

  const config = TIMER_CONFIG[mode]

  useEffect(() => {
    setTimeLeft(config.minutes * 60)
    setIsRunning(false)
  }, [mode])

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false)
          if (mode === 'focus') {
            setSessions(s => s + 1)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, mode])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = 1 - (timeLeft / (config.minutes * 60))

  const toggleTimer = useCallback(() => {
    setIsRunning(prev => !prev)
  }, [])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(config.minutes * 60)
  }, [config.minutes])

  return (
    <div className="space-y-6">
      {/* Timer Card */}
      <div className="glass-panel p-6 md:p-8 rounded-2xl text-center max-w-md mx-auto">
        {/* Mode Selector */}
        <div className="flex justify-center gap-2 mb-6">
          {(Object.keys(TIMER_CONFIG) as TimerMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-njz-accent-teal/10 text-njz-accent-teal'
                  : 'text-njz-text-muted hover:bg-njz-bg-overlay'
              }`}
            >
              {TIMER_CONFIG[m].label}
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          {/* Progress Ring */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-njz-bg-overlay"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress)}`}
              className={config.color}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>

          {/* Time Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-mono font-bold text-njz-text">
              {formatTime(timeLeft)}
            </span>
            <span className={`text-sm mt-1 ${config.color}`}>
              {isRunning ? 'Running' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          <button
            onClick={toggleTimer}
            className={`p-4 rounded-xl transition-colors ${
              isRunning
                ? 'bg-njz-accent-red/10 text-njz-accent-red hover:bg-njz-accent-red/20'
                : 'bg-njz-accent-teal text-white hover:bg-njz-accent-teal/80'
            }`}
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>

          <button
            onClick={resetTimer}
            className="p-4 rounded-xl bg-njz-bg-overlay text-njz-text-muted hover:bg-njz-bg hover:text-njz-text transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-njz-accent-teal" />
            <span className="text-xs text-njz-text-muted">Sessions</span>
          </div>
          <p className="text-2xl font-bold text-njz-text">{sessions}</p>
        </div>

        <div className="glass-panel p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Coffee className="w-4 h-4 text-njz-accent-orange" />
            <span className="text-xs text-njz-text-muted">Breaks</span>
          </div>
          <p className="text-2xl font-bold text-njz-text">{Math.floor(sessions / 4)}</p>
        </div>

        <div className="glass-panel p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-4 h-4 text-njz-accent-purple" />
            <span className="text-xs text-njz-text-muted">Soundscape</span>
          </div>
          <p className="text-sm text-njz-text-muted">Off</p>
        </div>

        <div className="glass-panel p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-njz-accent-green" />
            <span className="text-xs text-njz-text-muted">Streak</span>
          </div>
          <p className="text-2xl font-bold text-njz-text">0</p>
        </div>
      </div>

      {/* Current Task */}
      <div className="glass-panel p-4 rounded-lg">
        <h3 className="text-sm font-semibold text-njz-text mb-3">Current Focus</h3>
        <input
          type="text"
          placeholder="What are you working on?"
          className="w-full bg-njz-bg border border-njz-border rounded-lg px-4 py-3 text-njz-text placeholder:text-njz-text-subtle focus:outline-none focus:border-njz-accent-teal/50"
        />
      </div>
    </div>
  )
}
