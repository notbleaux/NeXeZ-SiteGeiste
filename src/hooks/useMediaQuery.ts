import { useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useState(() => {
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  })

  return matches
}

export function useMobile(): boolean {
  return useMediaQuery('(max-width: 768px)')
}

export function useTablet(): boolean {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
}
