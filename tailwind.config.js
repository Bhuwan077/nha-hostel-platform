/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nha: {
          blue: '#1E3A8A',
          navy: '#0F172A',
          gold: '#D97706',
          crimson: '#DC2626',
          emerald: '#059669',
          surface: '#F8FAFC'
        }
      }
    },
  },
  plugins: [],
}
