import { Home, Zap, Trophy, Palette, Settings, MessageSquare, Sparkles } from 'lucide-react'
import { Workspace } from '../../types'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, Zap, Trophy, Palette, Settings, Sparkles,
}

interface MobileNavProps {
  workspaces: Workspace[]
  activeWorkspace: string
  onWorkspaceSelect: (id: string) => void
  onToggleAI: () => void
}

export function MobileNav({ workspaces, activeWorkspace, onWorkspaceSelect, onToggleAI }: MobileNavProps) {
  return (
    <nav className="h-16 bg-njz-bg-elevated border-t border-njz-border flex items-center justify-around px-2 flex-shrink-0">
      {/* Workspace Tabs */}
      {workspaces.slice(0, 4).map(workspace => {
        const Icon = ICON_MAP[workspace.icon] || Sparkles
        const isActive = activeWorkspace === workspace.id

        return (
          <button
            key={workspace.id}
            onClick={() => onWorkspaceSelect(workspace.id)}
            className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors ${
              isActive
                ? 'text-njz-accent-teal'
                : 'text-njz-text-muted'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{workspace.name}</span>
          </button>
        )
      })}

      {/* AI Toggle */}
      <button
        onClick={onToggleAI}
        className="flex flex-col items-center gap-0.5 p-2 rounded-lg text-njz-text-muted"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-[10px] font-medium">AI</span>
      </button>
    </nav>
  )
}
