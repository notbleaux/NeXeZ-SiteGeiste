import { Menu, MessageSquare, Bell, Search } from 'lucide-react'
import { Workspace, Module } from '../../types'

interface HeaderProps {
  workspace: Workspace
  module: Module
  showAI: boolean
  onToggleAI: () => void
  onToggleMenu: () => void
  isMobile: boolean
}

export function Header({ workspace, module, showAI, onToggleAI, onToggleMenu, isMobile }: HeaderProps) {
  return (
    <header className="h-14 border-b border-njz-border bg-njz-bg flex items-center justify-between px-4 flex-shrink-0">
      {/* Left: Mobile menu + breadcrumb */}
      <div className="flex items-center gap-3">
        {isMobile && (
          <button
            onClick={onToggleMenu}
            className="p-2 rounded-lg hover:bg-njz-bg-elevated text-njz-text-muted"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2 text-sm">
          <span className="text-njz-text-subtle font-medium">{workspace.name}</span>
          <span className="text-njz-text-subtle">/</span>
          <span className="text-njz-text font-semibold">{module.name}</span>
        </div>
      </div>

      {/* Center: Search (hidden on mobile) */}
      {!isMobile && (
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-njz-text-subtle" />
            <input
              type="text"
              placeholder="Search modules, tasks, AI..."
              className="w-full bg-njz-bg-elevated border border-njz-border rounded-lg pl-9 pr-4 py-1.5 text-sm text-njz-text placeholder:text-njz-text-subtle focus:outline-none focus:border-njz-accent-teal/50"
            />
          </div>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleAI}
          className={`p-2 rounded-lg transition-colors ${
            showAI
              ? 'bg-njz-accent-teal/10 text-njz-accent-teal'
              : 'hover:bg-njz-bg-elevated text-njz-text-muted'
          }`}
          title="AI Chat"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        <button className="p-2 rounded-lg hover:bg-njz-bg-elevated text-njz-text-muted relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-njz-accent-red rounded-full" />
        </button>
      </div>
    </header>
  )
}