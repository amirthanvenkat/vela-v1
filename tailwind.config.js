/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#1B2D4F',
        coral: '#FF6B6B',
        blush: '#FFF8F5',
        leaf: '#4CAF82',
        deepnavy: '#0D1B2A',
        charcoal: '#1C1C1C',
        slate2: '#7A8899',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
};
