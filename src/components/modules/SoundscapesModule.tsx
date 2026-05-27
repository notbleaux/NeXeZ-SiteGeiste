import { useState, useRef, useEffect } from 'react'
import { Pause, Volume2, Wind, Waves, CloudRain, Flame, Music } from 'lucide-react'

interface SoundscapeTrack {
  id: string
  title: string
  icon: string
  category: 'focus' | 'relax' | 'sleep'
  duration: number
  url?: string
}

const TRACKS: SoundscapeTrack[] = [
  { id: 'rain', title: 'Gentle Rain', icon: 'CloudRain', category: 'focus', duration: 300 },
  { id: 'waves', title: 'Ocean Waves', icon: 'Waves', category: 'relax', duration: 300 },
  { id: 'wind', title: 'Forest Wind', icon: 'Wind', category: 'focus', duration: 300 },
  { id: 'fire', title: 'Crackling Fire', icon: 'Flame', category: 'relax', duration: 300 },
  { id: 'ambient', title: 'Deep Ambient', icon: 'Music', category: 'sleep', duration: 600 },
]

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  CloudRain, Waves, Wind, Flame, Music,
}

export function SoundscapesModule() {
  const [playing, setPlaying] = useState<string | null>(null)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const togglePlay = (trackId: string) => {
    if (playing === trackId) {
      audioRef.current?.pause()
      setPlaying(null)
    } else {
      audioRef.current?.pause()
      // In production, this would load from RAT-OS audio-engine
      const audio = new Audio(`/soundscapes/${trackId}.mp3`)
      audio.loop = true
      audio.volume = volume
      audio.play().catch(() => {})
      audioRef.current = audio
      setPlaying(trackId)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-njz-text">Soundscapes</h2>
        <p className="text-sm text-njz-text-muted">Binaural beats & ambient audio</p>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-njz-bg-elevated border border-njz-border">
        <Volume2 className="w-5 h-5 text-njz-text-muted" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={e => {
            const v = parseFloat(e.target.value)
            setVolume(v)
            if (audioRef.current) audioRef.current.volume = v
          }}
          className="flex-1 accent-njz-accent-teal"
        />
        <span className="text-sm text-njz-text-muted w-12 text-right">{Math.round(volume * 100)}%</span>
      </div>

      {/* Tracks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {TRACKS.map(track => {
          const Icon = ICON_MAP[track.icon] || Music
          const isPlaying = playing === track.id

          return (
            <button
              key={track.id}
              onClick={() => togglePlay(track.id)}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all text-left ${
                isPlaying
                  ? 'border-njz-accent-teal bg-njz-accent-teal/10'
                  : 'border-njz-border bg-njz-bg-elevated hover:border-njz-accent-teal/30'
              }`}
            >
              <div className={`p-3 rounded-full ${isPlaying ? 'bg-njz-accent-teal/20' : 'bg-njz-bg-overlay'}`}>
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-njz-accent-teal" />
                ) : (
                  <Icon className="w-5 h-5 text-njz-text-muted" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-njz-text">{track.title}</h3>
                <p className="text-xs text-njz-text-muted capitalize">{track.category} · {track.duration}s</p>
              </div>
              {isPlaying && (
                <div className="flex gap-0.5">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="w-1 bg-njz-accent-teal rounded-full animate-pulse"
                      style={{ height: `${12 + Math.random() * 16}px`, animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
