/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../lodge-shared/components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Lodge theme colors
        'lodge-green': '#10b981',
        'lodge-blue': '#3b82f6',
        'lodge-purple': '#8b5cf6',
        'obsidian': '#02040a',
        'bg-secondary': '#060b14',
        'bg-tertiary': '#0f172a',
        'bg-hover': '#1e293b',
      },
      fontFamily: {
        mono: ['monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 8px #10b981',
        'glow-blue': '0 0 8px #3b82f6',
        'glow-red': '0 0 8px #ef4444',
      }
    },
  },
  plugins: [],
}
