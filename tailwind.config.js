/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FFF8E7',
          200: '#FAEBD7',
          300: '#EAD6A8',
        },
        coffee: {
          400: '#8D6E63',
          600: '#5D4037',
          800: '#3E2723',
        },
        rank: {
          gold: '#F59E0B',
          red: '#EF4444',
          eternal: '#A855F7',
          badge: '#D35400',
        },
        ui: {
          blue: '#60A5FA',
          gold: '#FBBF24',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        rounded: ['Varela Round', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(93, 64, 55, 0.1), 0 2px 4px -1px rgba(93, 64, 55, 0.06)',
        'inner-gold': 'inset 0 0 0 3px #FBBF24',
        'inner-gray': 'inset 0 0 0 2px #E5E7EB',
      }
    },
  },
  plugins: [],
}
