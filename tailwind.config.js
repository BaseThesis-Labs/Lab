/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          bg: '#0A0A0A',
          surface: '#111111',
          border: '#1F1F1F',
          muted: '#737373',
          dim: '#A3A3A3',
          text: '#EDEDED',
        },
        accent: {
          DEFAULT: '#E8D9BE',
          dim: '#9C8E74',
          soft: '#2A2419',
        },
      },
      fontFamily: {
        sans: ['"Geist Variable"', 'Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'monospace'],
        serif: ['"Fraunces Variable"', 'ui-serif', 'Georgia', 'serif'],
      },
      fontSize: {
        display: ['clamp(2.5rem, 6vw, 5.5rem)', { lineHeight: '0.98', letterSpacing: '-0.035em' }],
        'display-sm': ['clamp(2rem, 4.5vw, 3.5rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
      },
      maxWidth: {
        content: '1200px',
      },
      letterSpacing: {
        micro: '0.18em',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(-33.333%, 0, 0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.85)' },
        },
        dashFlow: {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '-40' },
        },
      },
      animation: {
        marquee: 'marquee 52s linear infinite',
        'pulse-dot': 'pulseDot 1.8s ease-in-out infinite',
        'dash-flow': 'dashFlow 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};
