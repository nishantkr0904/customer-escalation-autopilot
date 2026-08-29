import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0a0a1a', // slate-950
          secondary: '#0f172a', // slate-900
          surface: 'rgba(30, 41, 59, 0.5)', // slate-800/50 glass surface
        },
        brand: {
          primary: '#6366f1', // indigo-500
          hover: '#4f46e5', // indigo-600
        },
        severity: {
          low: '#22c55e', // green-500
          medium: '#f59e0b', // amber-500
          high: '#f97316', // orange-500
          critical: '#ef4444', // red-500
        },
        status: {
          healthy: '#34d399', // emerald-400
          degraded: '#facc15', // yellow-400
          down: '#f87171', // red-400
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-indigo': '0 0 20px -5px rgba(99, 102, 241, 0.4)',
        'glow-red': '0 0 20px -5px rgba(239, 68, 68, 0.5)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-critical': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 10px 4px rgba(239, 68, 68, 0.4)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s infinite',
        'pulse-critical': 'pulse-critical 2s infinite ease-in-out',
        'fade-in': 'fade-in 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
