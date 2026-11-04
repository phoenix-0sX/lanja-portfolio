import type { Config } from 'tailwindcss';

const rgb = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: [
    './app/components/**/*.{vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.ts',
    './app/composables/**/*.ts',
    './app/data/**/*.ts',
    './app/app.vue',
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens, switched by the .dark class (see assets/css/main.css)
        page: rgb('page'),
        card: rgb('card'),
        muted: rgb('muted'),
        ink: rgb('ink'),
        soft: rgb('soft'),
        line: rgb('line'),
        accent: rgb('accent'),
        // Palette taken from the design mockups
        brand: {
          DEFAULT: '#00BE63',
          light: '#7FDA58',
          deep: '#049348',
          leaf: '#5FA840',
        },
        art: {
          1: rgb('art-1'),
          2: rgb('art-2'),
        },
      },
      fontFamily: {
        sans: [
          '"Inter Variable"',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Noto Color Emoji"',
        ],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgb(0 0 0 / 0.18)',
        glow: '0 0 0 1px rgb(var(--accent) / 0.25), 0 0 18px -4px rgb(var(--accent) / 0.45)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -8px, 0)' },
        },
        // Slow wandering path; every square sets its own --dx / --dy / --rot (see BackgroundSquares).
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
          '25%': {
            transform:
              'translate3d(var(--dx), calc(var(--dy) * 0.35), 0) rotate(calc(var(--rot) * 0.5))',
          },
          '50%': {
            transform:
              'translate3d(calc(var(--dx) * 0.4), var(--dy), 0) rotate(var(--rot))',
          },
          '75%': {
            transform:
              'translate3d(calc(var(--dx) * -0.6), calc(var(--dy) * 0.5), 0) rotate(calc(var(--rot) * 0.4))',
          },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(22px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.86)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        breathe: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(4px, -6px, 0) scale(1.045)' },
        },
        bob: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -10px, 0)' },
        },
      },
      animation: {
        float: 'float 6s cubic-bezier(0.37, 0, 0.63, 1) infinite',
        drift: 'drift 26s cubic-bezier(0.37, 0, 0.63, 1) infinite',
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pop-in': 'pop-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        breathe: 'breathe 9s cubic-bezier(0.37, 0, 0.63, 1) infinite',
        bob: 'bob 7s cubic-bezier(0.37, 0, 0.63, 1) infinite',
      },
    },
  },
} satisfies Config;
