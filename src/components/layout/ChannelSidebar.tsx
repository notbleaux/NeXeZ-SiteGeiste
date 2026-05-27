import { Sparkles, Target, CheckSquare, Music, Shield, PenTool, Brain, Globe, ChevronDown } from 'lucide-react'
import { Workspace, Module } from '../../types'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Target, CheckSquare, Music, Shield, PenTool, Brain, Globe,
}

interface ChannelSidebarProps {
  workspace: Workspace
  modules: Module[]
  active: string
  onSelect: (id: string) => void
  mobile?: boolean
}

export function ChannelSidebar({ workspace, modules, active, onSelect, mobile }: ChannelSidebarProps) {
  return (
    <aside className={`flex flex-col bg-njz-bg-elevated border-r border-njz-border ${mobile ? 'w-full h-full' : 'w-60'} flex-shrink-0`}>
      {/* Workspace Header */}
      <div className="p-4 border-b border-njz-border">
        <button className="flex items-center justify-between w-full text-left hover:bg-njz-bg-overlay/50 rounded-lg p-2 -mx-2 transition-colors">
          <span className="font-semibold text-njz-text truncate">{workspace.name}</span>
          <ChevronDown className="w-4 h-4 text-njz-text-subtle" />
        </button>
      </div>

      {/* Module List */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-2 mb-2">
          <span className="text-xs font-semibold text-njz-text-subtle uppercase tracking-wider px-2">
            Modules
          </span>
        </div>

        <div className="space-y-0.5 px-2">
          {modules.map(module => {
            const Icon = ICON_MAP[module.icon] || Sparkles
            const isActive = active === module.id
            const isComingSoon = module.status === 'coming-soon'

            return (
              <button
                key={module.id}
                onClick={() => !isComingSoon && onSelect(module.id)}
                disabled={isComingSoon}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-njz-accent-teal/10 text-njz-accent-teal'
                    : isComingSoon
                    ? 'text-njz-text-subtle/50 cursor-not-allowed'
                    : 'text-njz-text-muted hover:bg-njz-bg-overlay hover:text-njz-text'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? module.color : ''}`} />
                <span className="truncate">{module.name}</span>
                {isComingSoon && (
                  <span className="ml-auto text-[10px] bg-njz-bg-overlay px-1.5 py-0.5 rounded text-njz-text-subtle">
                    Soon
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* User Status Footer */}
      <div className="p-3 border-t border-njz-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-njz-accent-teal/20 flex items-center justify-center">
            <span className="text-xs font-bold text-njz-accent-teal">EN</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-njz-text truncate">Elijah Bleaux</p>
            <p className="text-xs text-njz-accent-teal">● Online</p>
          </div>
        </div>
      </div>
    </aside>
  )
}