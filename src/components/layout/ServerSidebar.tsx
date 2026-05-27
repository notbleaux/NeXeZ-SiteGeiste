import { Home, Zap, Trophy, Palette, Settings } from 'lucide-react'
import { Workspace } from '../../types'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Zap,
  Trophy,
  Palette,
  Settings,
}

interface ServerSidebarProps {
  workspaces: Workspace[]
  active: string
  onSelect: (id: string) => void
}

export function ServerSidebar({ workspaces, active, onSelect }: ServerSidebarProps) {
  return (
    <nav className="w-18 flex flex-col items-center py-3 gap-2 bg-njz-bg border-r border-njz-border flex-shrink-0">
      {/* Home/Logo */}
      <button
        onClick={() => onSelect('home')}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
          active === 'home'
            ? 'bg-njz-accent-teal text-white rounded-xl'
            : 'bg-njz-bg-elevated text-njz-text-muted hover:bg-njz-accent-teal/20 hover:text-njz-accent-teal'
        }`}
        title="Home"
      >
        <Home className="w-6 h-6" />
      </button>

      <div className="w-8 h-px bg-njz-border my-1" />

      {/* Workspace Icons */}
      {workspaces.filter(w => w.id !== 'home').map(workspace => {
        const Icon = ICON_MAP[workspace.icon] || Zap
        const isActive = active === workspace.id

        return (
          <button
            key={workspace.id}
            onClick={() => onSelect(workspace.id)}
            className={`group relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
              isActive
                ? 'bg-njz-accent-teal text-white rounded-xl'
                : 'bg-njz-bg-elevated text-njz-text-muted hover:bg-njz-accent-teal/20 hover:text-njz-accent-teal'
            }`}
            title={workspace.name}
          >
            <Icon className="w-6 h-6" />
            
            {/* Tooltip */}
            <span className="absolute left-14 bg-njz-bg-overlay text-njz-text text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              {workspace.name}
            </span>

            {/* Active indicator pill */}
            {isActive && (
              <span className="absolute -left-3 w-1 h-8 bg-njz-accent-teal rounded-r-full" />
            )}
          </button>
        )
      })}

      <div className="flex-1" />

      {/* Settings at bottom */}
      <button
        onClick={() => onSelect('settings')}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
          active === 'settings'
            ? 'bg-njz-text-muted text-njz-bg rounded-xl'
            : 'bg-njz-bg-elevated text-njz-text-muted hover:bg-njz-text-muted/20'
        }`}
        title="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>
    </nav>
  )
}