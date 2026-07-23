import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    '../../packages/ui/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // ── Design Token Colors (UI_DESIGN_SYSTEM.md §2) ──────
      colors: {
        // Background layers
        'bg-base':     '#050A14',
        'bg-surface':  '#0A1628',
        'bg-elevated': '#0F1F3D',
        'bg-overlay':  '#162845',

        // Brand blue palette
        brand: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },

        // Cyan accent
        'accent-cyan': '#06B6D4',

        // Text hierarchy
        'text-primary':   '#E8EDF7',
        'text-secondary': '#8FA8CC',
        'text-tertiary':  '#4A6A99',

        // Border palette
        'border-subtle':  'rgba(56, 97, 170, 0.20)',
        'border-default': 'rgba(56, 97, 170, 0.35)',
        'border-strong':  'rgba(56, 97, 170, 0.60)',

        // Risk/status colors
        risk: {
          critical: '#DC2626',
          high:     '#EA580C',
          medium:   '#CA8A04',
          low:      '#16A34A',
        },

        // Visualization palette
        viz: {
          1: '#3B82F6',
          2: '#06B6D4',
          3: '#8B5CF6',
          4: '#F59E0B',
          5: '#EF4444',
          6: '#10B981',
          7: '#F97316',
          8: '#EC4899',
        },
      },

      // ── Typography (UI_DESIGN_SYSTEM.md §3) ──────────────
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Fira Code', 'monospace'],
      },

      fontSize: {
        'display-xl': ['4rem',    { lineHeight: '1.1', fontWeight: '700' }],
        'display-lg': ['3rem',    { lineHeight: '1.1', fontWeight: '700' }],
        'heading-xl': ['1.875rem',{ lineHeight: '1.25', fontWeight: '700' }],
        'heading-lg': ['1.5rem',  { lineHeight: '1.25', fontWeight: '600' }],
        'heading-md': ['1.25rem', { lineHeight: '1.375', fontWeight: '600' }],
        'heading-sm': ['1.125rem',{ lineHeight: '1.375', fontWeight: '600' }],
        'body-xl':    ['1.125rem',{ lineHeight: '1.625' }],
        'body-lg':    ['1rem',    { lineHeight: '1.5' }],
        'body-md':    ['0.875rem',{ lineHeight: '1.5' }],
        'body-sm':    ['0.75rem', { lineHeight: '1.5' }],
        'body-xs':    ['0.625rem',{ lineHeight: '1.5' }],
      },

      // ── Spacing (UI_DESIGN_SYSTEM.md §4) ─────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },

      // ── Animations (UI_DESIGN_SYSTEM.md §7) ──────────────
      transitionTimingFunction: {
        'enter':  'cubic-bezier(0.16, 1, 0.3, 1)',
        'exit':   'cubic-bezier(0.4, 0, 1, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      keyframes: {
        'pulse-ring': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to:   { transform: 'translateX(0)',    opacity: '1' },
        },
        'fade-up': {
          from: { transform: 'translateY(8px)', opacity: '0' },
          to:   { transform: 'translateY(0)',   opacity: '1' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(59,130,246,0.3)' },
          '50%':      { boxShadow: '0 0 20px rgba(59,130,246,0.7)' },
        },
      },

      animation: {
        'pulse-ring':      'pulse-ring 1s ease-in-out infinite',
        'slide-in-right':  'slide-in-right 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-up':         'fade-up 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer':         'shimmer 2s linear infinite',
        'glow-pulse':      'glow-pulse 2s ease-in-out infinite',
      },

      // ── Border radius ─────────────────────────────────────
      borderRadius: {
        'sm':  '0.375rem',
        'md':  '0.5rem',
        'lg':  '0.75rem',
        'xl':  '1rem',
        '2xl': '1.25rem',
      },

      // ── Box shadows ───────────────────────────────────────
      boxShadow: {
        'glass':   '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card':    '0 4px 16px rgba(0,0,0,0.3)',
        'glow-sm': '0 0 8px rgba(59,130,246,0.4)',
        'glow-lg': '0 0 24px rgba(59,130,246,0.5)',
        'danger':  '0 0 12px rgba(220,38,38,0.4)',
      },

      // ── Backdrop blur ─────────────────────────────────────
      backdropBlur: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
      },
    },
  },
  plugins: [],
}

export default config
