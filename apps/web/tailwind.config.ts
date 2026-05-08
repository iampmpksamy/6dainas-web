import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: '#020617',
        surface: {
          DEFAULT: '#080d1a',
          high:     '#0d1526',
          elevated: '#111827',
        },
        primary: {
          DEFAULT: '#7c3aed',
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          400: '#a78bfa',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          900: '#2e1065',
        },
        electric: {
          DEFAULT: '#3b82f6',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'ui-sans-serif', 'system-ui'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
        'electric-gradient':'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
        'cyber-gradient':   'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
      },
      boxShadow: {
        glass:          '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        primary:        '0 0 20px rgba(124,58,237,0.5), 0 0 60px rgba(124,58,237,0.15)',
        'primary-sm':   '0 0 10px rgba(124,58,237,0.35)',
        'primary-glow': '0 0 40px rgba(124,58,237,0.25), 0 20px 40px rgba(0,0,0,0.5)',
        electric:       '0 0 20px rgba(59,130,246,0.5), 0 0 60px rgba(59,130,246,0.15)',
        'electric-sm':  '0 0 10px rgba(59,130,246,0.35)',
        'card-hover':   '0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(124,58,237,0.08)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite',
        'slide-up':   'slide-up 0.5s cubic-bezier(0.16,1,0.3,1)',
        'fade-in':    'fade-in 0.4s ease-out',
        'float':      'float 4s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(124,58,237,0.3)' },
          '50%':      { boxShadow: '0 0 25px rgba(124,58,237,0.6)' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config
