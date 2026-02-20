/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'bison-yellow': '#FFC72C',
        'bison-green': '#006341',
        'bison-gold': '#FFD700',
        'bison-dark': '#0f0f0f',
        'bison-bg': '#0a4d2e',
        'bison-card': '#1a1a1a',
        'bison-border': '#333333',
      },
      boxShadow: {
        'bison': '0 0 20px rgba(255, 199, 44, 0.3)',
        'bison-green': '0 0 20px rgba(0, 99, 65, 0.3)',
      }
    },
  },
  plugins: [],
}
