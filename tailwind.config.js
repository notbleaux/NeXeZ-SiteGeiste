/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // NJZ Design Tokens (from @njz-os/ui)
        'njz-bg': {
          DEFAULT: '#0F172A',
          elevated: '#1E293B',
          overlay: '#334155',
        },
        'njz-text': {
          DEFAULT: '#F8FAFC',
          muted: '#94A3B8',
          subtle: '#64748B',
        },
        'njz-accent': {
          teal: '#14B8A6',
          orange: '#F97316',
          purple: '#8B5CF6',
          red: '#EF4444',
          green: '#22C55E',
        },
        'njz-border': {
          DEFAULT: '#334155',
          hover: '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
}