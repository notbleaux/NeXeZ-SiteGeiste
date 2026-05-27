import { useState, useCallback } from 'react'
import { Module, Workspace } from './types'
import { useMobile } from './hooks/useMediaQuery'
import { ServerSidebar } from './components/layout/ServerSidebar'
import { ChannelSidebar } from './components/layout/ChannelSidebar'
import { Header } from './components/layout/Header'
import { ModuleGrid } from './components/layout/ModuleGrid'
import { AISidebar } from './components/layout/AISidebar'
import { MobileNav } from './components/layout/MobileNav'
import { WelcomeModule } from './components/modules/WelcomeModule'
import { FocusModule } from './components/modules/FocusModule'

const WORKSPACES: Workspace[] = [
  { id: 'home', name: 'Home', icon: 'Home', modules: ['welcome', 'focus', 'tasks'] },
  { id: 'rat-os', name: 'RAT-OS', icon: 'Zap', modules: ['focus', 'soundscapes', 'blocker', 'writing', 'brain-train', 'polyworld'] },
  { id: 'zesportexte', name: 'ZeSporteXte', icon: 'Trophy', modules: ['rotas', 'sator', 'opera', 'arepo'] },
  { id: 'nuevue', name: 'NueVue', icon: 'Palette', modules: ['assets', 'viz', 'stream'] },
  { id: 'settings', name: 'Settings', icon: 'Settings', modules: ['account', 'preferences', 'api-keys'] },
]

const MODULES: Module[] = [
  { id: 'welcome', name: 'Welcome', icon: 'Sparkles', color: 'text-njz-accent-purple', description: 'Your NJZ dashboard', status: 'active' },
  { id: 'focus', name: 'Focus', icon: 'Target', color: 'text-njz-accent-teal', description: 'Pomodoro & deep work', status: 'active' },
  { id: 'tasks', name: 'Tasks', icon: 'CheckSquare', color: 'text-njz-accent-green', description: 'To-do & planner', status: 'coming-soon' },
  { id: 'soundscapes', name: 'Soundscapes', icon: 'Music', color: 'text-njz-accent-purple', description: 'Binaural beats & ambient', status: 'coming-soon' },
  { id: 'blocker', name: 'Blocker', icon: 'Shield', color: 'text-njz-accent-red', description: 'Distraction blocking', status: 'coming-soon' },
  { id: 'writing', name: 'Writing', icon: 'PenTool', color: 'text-njz-accent-orange', description: 'Manuscript & streaks', status: 'coming-soon' },
  { id: 'brain-train', name: 'Brain Train', icon: 'Brain', color: 'text-njz-accent-teal', description: 'Cognitive training', status: 'coming-soon' },
  { id: 'polyworld', name: 'PolyCo', icon: 'Globe', color: 'text-njz-accent-green', description: 'Pixel metaverse', status: 'coming-soon' },
]

function App() {
  const isMobile = useMobile()
  const [activeWorkspace, setActiveWorkspace] = useState('home')
  const [activeModule, setActiveModule] = useState('welcome')
  const [showAI, setShowAI] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const currentWorkspace = WORKSPACES.find(w => w.id === activeWorkspace) || WORKSPACES[0]
  const currentModule = MODULES.find(m => m.id === activeModule) || MODULES[0]

  const handleModuleSelect = useCallback((moduleId: string) => {
    setActiveModule(moduleId)
    setShowMobileMenu(false)
  }, [])

  const handleWorkspaceSelect = useCallback((workspaceId: string) => {
    setActiveWorkspace(workspaceId)
    const ws = WORKSPACES.find(w => w.id === workspaceId)
    if (ws && ws.modules.length > 0) {
      setActiveModule(ws.modules[0])
    }
  }, [])

  const renderModule = () => {
    switch (activeModule) {
      case 'welcome':
        return <WelcomeModule onSelectModule={handleModuleSelect} modules={MODULES} />
      case 'focus':
        return <FocusModule />
      default:
        return <WelcomeModule onSelectModule={handleModuleSelect} modules={MODULES} />
    }
  }

  return (
    <div className="flex h-screen w-screen bg-njz-bg text-njz-text overflow-hidden">
      {/* Server Sidebar (leftmost) - always visible on desktop, hidden on mobile */}
      {!isMobile && (
        <ServerSidebar
          workspaces={WORKSPACES}
          active={activeWorkspace}
          onSelect={handleWorkspaceSelect}
        />
      )}

      {/* Channel Sidebar - module list */}
      {!isMobile && (
        <ChannelSidebar
          workspace={currentWorkspace}
          modules={MODULES.filter(m => currentWorkspace.modules.includes(m.id))}
          active={activeModule}
          onSelect={handleModuleSelect}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          workspace={currentWorkspace}
          module={currentModule}
          showAI={showAI}
          onToggleAI={() => setShowAI(!showAI)}
          onToggleMenu={() => setShowMobileMenu(!showMobileMenu)}
          isMobile={isMobile}
        />

        <main className="flex-1 overflow-hidden">
          <ModuleGrid>
            {renderModule()}
          </ModuleGrid>
        </main>

        {/* Mobile Navigation */}
        {isMobile && (
          <MobileNav
            workspaces={WORKSPACES}
            activeWorkspace={activeWorkspace}
            onWorkspaceSelect={handleWorkspaceSelect}
            onToggleAI={() => setShowAI(!showAI)}
          />
        )}
      </div>

      {/* AI Sidebar - right panel */}
      {!isMobile && showAI && (
        <AISidebar onClose={() => setShowAI(false)} />
      )}

      {/* Mobile AI Sheet */}
      {isMobile && showAI && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowAI(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-njz-bg-elevated border-l border-njz-border" onClick={e => e.stopPropagation()}>
            <AISidebar onClose={() => setShowAI(false)} />
          </div>
        </div>
      )}

      {/* Mobile Menu Sheet */}
      {isMobile && showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-njz-bg-elevated border-r border-njz-border" onClick={e => e.stopPropagation()}>
            <ChannelSidebar
              workspace={currentWorkspace}
              modules={MODULES.filter(m => currentWorkspace.modules.includes(m.id))}
              active={activeModule}
              onSelect={handleModuleSelect}
              mobile
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
