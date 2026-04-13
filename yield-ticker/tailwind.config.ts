import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        terminal: {
          bg: '#020608',
          surface: '#040d10',
          border: '#0a2030',
          dim: '#071820',
        },
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        green: {
          400: '#4ade80',
          500: '#22c55e',
        },
        red: {
          400: '#f87171',
          500: '#ef4444',
        },
        amber: {
          400: '#fbbf24',
        },
      },
      animation: {
        'ticker-scroll': 'ticker-scroll 30s linear infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.4s ease forwards',
        'slide-up': 'slide-up 0.3s ease forwards',
        'slide-in-right': 'slide-in-right 0.35s ease forwards',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'scan-line': 'scan-line 8s linear infinite',
        'number-flicker': 'number-flicker 0.15s ease',
      },
      keyframes: {
        'ticker-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.8)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'number-flicker': {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.3' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6,182,212,0.15), 0 0 40px rgba(6,182,212,0.05)',
        'glow-green': '0 0 20px rgba(74,222,128,0.15)',
        'glow-red': '0 0 20px rgba(248,113,113,0.15)',
        'inner-glow': 'inset 0 1px 0 rgba(6,182,212,0.1)',
      },
    },
  },
  plugins: [],
}

export default config
