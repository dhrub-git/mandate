import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1e3a5f',
          green: '#10b981',
          dark: '#0f172a',
          light: '#f8fafc',
        }
      },
      fontFamily: {
        mono: ['Space Mono', 'monospace'],
        sans: ['Geist', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
