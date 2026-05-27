import { ArrowRight, Clock, Target, Zap, Music, Shield, PenTool, Brain, Globe } from 'lucide-react'
import { Module } from '../../types'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Target, Clock, Zap, Music, Shield, PenTool, Brain, Globe,
}

interface WelcomeModuleProps {
  onSelectModule: (id: string) => void
  modules: Module[]
}

export function WelcomeModule({ onSelectModule, modules }: WelcomeModuleProps) {
  const activeModules = modules.filter(m => m.status === 'active')
  const comingSoon = modules.filter(m => m.status === 'coming-soon')

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-njz-text mb-3">
          Welcome to <span className="text-njz-accent-teal">SiteGeiste</span>
        </h1>
        <p className="text-njz-text-muted text-lg max-w-lg mx-auto">
          Your AI workspace hub. Focus, create, and collaborate with NJZ intelligence.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeModules.map(module => {
          const Icon = ICON_MAP[module.icon] || Target

          return (
            <button
              key={module.id}
              onClick={() => onSelectModule(module.id)}
              className="glass-panel hover-lift p-5 rounded-xl text-left group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-njz-bg-overlay ${module.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-njz-text-subtle group-hover:text-njz-accent-teal transition-colors" />
              </div>
              <h3 className="font-semibold text-njz-text mb-1">{module.name}</h3>
              <p className="text-sm text-njz-text-muted">{module.description}</p>
            </button>
          )
        })}
      </div>

      {/* Coming Soon */}
      {comingSoon.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-njz-text mb-3">Coming Soon</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {comingSoon.slice(0, 4).map(module => {
              const Icon = ICON_MAP[module.icon] || Target

              return (
                <div
                  key={module.id}
                  className="bg-njz-bg-elevated/50 border border-njz-border/50 p-4 rounded-lg opacity-60"
                >
                  <Icon className={`w-5 h-5 mb-2 ${module.color}`} />
                  <h4 className="text-sm font-medium text-njz-text">{module.name}</h4>
                  <p className="text-xs text-njz-text-subtle mt-1">{module.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-njz-accent-teal">0</p>
          <p className="text-xs text-njz-text-muted mt-1">Focus Sessions</p>
        </div>
        <div className="glass-panel p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-njz-accent-purple">0</p>
          <p className="text-xs text-njz-text-muted mt-1">Tasks Done</p>
        </div>
        <div className="glass-panel p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-njz-accent-orange">0h</p>
          <p className="text-xs text-njz-text-muted mt-1">Deep Work</p>
        </div>
        <div className="glass-panel p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-njz-accent-green">0</p>
          <p className="text-xs text-njz-text-muted mt-1">Day Streak</p>
        </div>
      </div>
    </div>
  )
}
