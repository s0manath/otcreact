/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e1e9ff',
          200: '#c7d6ff',
          300: '#a1bbff',
          400: '#7395ff',
          500: '#4a6bff',
          600: '#2b44ff',
          700: '#1b2eff',
          800: '#1525d1',
          900: '#1826a5',
        }
      }
    },
  },
  plugins: [],
}
