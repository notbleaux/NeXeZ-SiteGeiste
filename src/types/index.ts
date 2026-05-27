export interface Module {
  id: string
  name: string
  icon: string
  color: string
  description: string
  status: 'active' | 'coming-soon' | 'beta'
}

export interface Workspace {
  id: string
  name: string
  icon: string
  modules: string[]
}

export interface User {
  id: string
  name: string
  avatar?: string
  status: 'online' | 'away' | 'focus' | 'offline'
}

export type Theme = 'dark' | 'darker' | 'midnight'
export type PanelSize = 'compact' | 'comfortable' | 'spacious'
