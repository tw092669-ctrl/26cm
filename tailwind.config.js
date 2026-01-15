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
          50: '#FFF9F5',
          100: '#FFF3E9',
          200: '#FFE8D6',
          300: '#FFD4B0',
        },
        coffee: {
          400: '#A78B7A',
          600: '#6B5B4E',
          800: '#3E3530',
        },
        rank: {
          gold: '#F59E0B',
          red: '#EF4444',
          eternal: '#A855F7',
          badge: '#D35400',
        },
        ui: {
          blue: '#5BA8C6',
          gold: '#FBBF24',
          coral: '#FF9F8A',
          pink: '#FFB8C1',
          teal: '#7FD4C1',
          peach: '#FFD5B8',
          lavender: '#C5A8E9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        rounded: ['Varela Round', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(93, 64, 55, 0.1), 0 2px 4px -1px rgba(93, 64, 55, 0.06)',
        'card-hover': '0 10px 20px -5px rgba(93, 64, 55, 0.15), 0 4px 8px -2px rgba(93, 64, 55, 0.08)',
        'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 4px 25px rgba(0, 0, 0, 0.1)',
        'inner-gold': 'inset 0 0 0 3px #FBBF24',
        'inner-gray': 'inset 0 0 0 2px #E5E7EB',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
}
