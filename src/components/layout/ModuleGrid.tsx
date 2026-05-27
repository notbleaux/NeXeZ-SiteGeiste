import { ReactNode } from 'react'

interface ModuleGridProps {
  children: ReactNode
}

export function ModuleGrid({ children }: ModuleGridProps) {
  return (
    <div className="h-full w-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {children}
      </div>
    </div>
  )
}