/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0A2342',
        emerald: '#2ECC71',
        coral: '#FF6B6B',
      },
    },
  },
  plugins: [],
}
