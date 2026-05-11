/**
 * PixelOffice Design Tokens
 *
 * Core design tokens for consistent theming across all NeXeZ SiteGeiste applications.
 * Based on the PixelOffice Design System specification.
 */

export const colors = {
  // Primary brand colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Agent role colors
  agent: {
    reviewer: '#8b5cf6',      // Purple - Code Reviewer
    architect: '#3b82f6',     // Blue - Architecture Guide
    hunter: '#f59e0b',        // Amber - Bug Hunter
    tester: '#10b981',        // Green - Test Generator
    deployer: '#ef4444',      // Red - Deployment Manager
  },

  // State colors
  state: {
    idle: '#94a3b8',          // Slate - Available
    active: '#3b82f6',        // Blue - Working
    success: '#10b981',       // Green - Complete
    warning: '#f59e0b',       // Amber - Needs attention
    error: '#ef4444',         // Red - Error/Failed
    blocked: '#f97316',       // Orange - Blocked
  },

  // Neutral/gray scale
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  // Semantic colors
  semantic: {
    info: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
} as const;

export const typography = {
  fontFamily: {
    primary: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
    pixel: "'Press Start 2P', monospace",
  },

  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  pixel: '2px 2px 0 0 rgba(0, 0, 0, 0.25)',
} as const;

export const animation = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  easing: {
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export const breakpoints = {
  sm: '640px',    // Mobile landscape
  md: '768px',    // Tablet
  lg: '1024px',   // Desktop
  xl: '1280px',   // Large desktop
  '2xl': '1536px', // Extra large
} as const;

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  modal: 1200,
  popover: 1300,
  tooltip: 1400,
  toast: 1500,
} as const;

// Quest level configurations
export const questLevels = {
  beginner: {
    icon: '⭐',
    color: colors.semantic.success,
    xpMultiplier: 1,
  },
  intermediate: {
    icon: '⭐⭐',
    color: colors.primary[500],
    xpMultiplier: 2,
  },
  advanced: {
    icon: '⭐⭐⭐',
    color: colors.semantic.warning,
    xpMultiplier: 3,
  },
  epic: {
    icon: '⭐⭐⭐⭐',
    color: colors.agent.reviewer,
    xpMultiplier: 5,
  },
} as const;

// Agent configurations
export const agentConfig = {
  reviewer: {
    name: 'Code Reviewer',
    icon: '👓',
    color: colors.agent.reviewer,
    role: 'Reviews code quality and best practices',
  },
  architect: {
    name: 'Architecture Guide',
    icon: '📐',
    color: colors.agent.architect,
    role: 'Provides system design guidance',
  },
  hunter: {
    name: 'Bug Hunter',
    icon: '🔍',
    color: colors.agent.hunter,
    role: 'Identifies and tracks bugs',
  },
  tester: {
    name: 'Test Generator',
    icon: '✅',
    color: colors.agent.tester,
    role: 'Creates and manages tests',
  },
  deployer: {
    name: 'Deployment Manager',
    icon: '⚓',
    color: colors.agent.deployer,
    role: 'Manages deployments and releases',
  },
} as const;

// Export all tokens as a single theme object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animation,
  breakpoints,
  zIndex,
  questLevels,
  agentConfig,
} as const;

export type Theme = typeof theme;
export type AgentType = keyof typeof agentConfig;
export type QuestLevel = keyof typeof questLevels;
export type AgentState = keyof typeof colors.state;

export default theme;
