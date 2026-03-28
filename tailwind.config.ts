import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#D4A847',
          'gold-light': '#E8C96A',
          'gold-dark': '#B8922F',
          green: '#8B9E6B',
          'green-dark': '#6B7D53',
          bg: '#0f0e0c',
          surface: '#1c1a16',
          'surface-2': '#252219',
          border: '#2e2b22',
          text: '#f0ede6',
          muted: '#8a8070',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
