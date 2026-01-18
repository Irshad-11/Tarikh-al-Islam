/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'islamic-green': '#062C21',
        'deep-green':    '#041F18',
        'gold':          '#D4AF37',
        'gold-dark':     '#B8972E',
        'parchment':     '#F5F0E1',
        'offwhite':      '#F8F1E9',
        'stone':         '#E0D9C9',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'subtle-map': "url('/src/assets/images/old-map-watermark.png')", // add later
        'manuscript': "url('/src/assets/images/manuscript-texture.png')",
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(212, 175, 55, 0.25)',
      }
    },
  },
  plugins: [
  require('@tailwindcss/typography'),
],
}