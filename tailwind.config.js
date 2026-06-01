/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          DEFAULT: '#0a0a1a',
          dust: '#1a1a3a',
        },
        eco: {
          green: '#22c55e',
          'green-dark': '#15803d',
          blue: '#3b82f6',
          sky: '#0ea5e9',
          orange: '#f59e0b',
          amber: '#fbbf24',
          purple: '#a855f7',
          red: '#ef4444',
          teal: '#14b8a6',
        },
        ui: {
          dark: '#0f172a',
          'dark-light': '#1e293b',
          light: '#f8fafc',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        display: ['Fredoka One', 'cursive'],
        body: ['Nunito', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.4)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.4)',
        'glow-orange': '0 0 20px rgba(245, 158, 11, 0.4)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.4)',
      },
    },
  },
  plugins: [],
}
