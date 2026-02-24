/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080808',
        panel: '#121212',
        gold: '#d6b25e',
        sand: '#f2e7c8',
        bronze: '#8c6733'
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Manrope', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 30px rgba(214, 178, 94, 0.25)'
      }
    }
  },
  plugins: []
};
