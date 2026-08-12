/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './App.tsx',
    './components/**/*.{ts,tsx}',
    './services/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#05070A', 2: '#0C1117', 3: '#111820' },
        sf: {
          50: '#e8f0ff',
          100: '#d1e2ff',
          200: '#9DC4FF',
          300: '#6BA3FF',
          400: '#6BA3FF',
          500: '#4A7FD4',
          600: '#3A6AB8',
          700: '#2A559C',
          800: '#1A4080',
          900: '#0A2B64',
        },
        glass: {
          DEFAULT: 'rgba(255,255,255,0.03)',
          border: '#1C2536',
          hover: 'rgba(255,255,255,0.08)',
        },
        dim: '#4A5568',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"SFMono-Regular"', 'Consolas', '"Liberation Mono"', 'monospace'],
        outfit: ['Outfit', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        glow: 'glow 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        glow: {
          '0%,100%': { boxShadow: '0 0 20px rgba(107,163,255,0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(107,163,255,0.3)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
