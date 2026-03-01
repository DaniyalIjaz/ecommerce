/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCFB',
          100: '#F7F5F2',
          200: '#EDE9E4',
          300: '#E0DAD3',
        },
        stone: {
          400: '#8B7355',
          500: '#6B5B4A',
          600: '#5A4A3A',
          700: '#3D3329',
          800: '#2A231C',
          900: '#1A1612',
        },
        terracotta: {
          400: '#E07A5F',
          500: '#C45C3E',
          600: '#A84D33',
          700: '#8B3E28',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Prata', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(26, 22, 18, 0.07), 0 10px 20px -2px rgba(26, 22, 18, 0.04)',
        'card': '0 4px 20px -2px rgba(26, 22, 18, 0.08)',
        'card-hover': '0 12px 40px -8px rgba(26, 22, 18, 0.12)',
      },
    },
  },
  plugins: [],
}
