/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        earth: {
          50: '#FAF6F0',
          100: '#F0E8D8',
          200: '#E0D0B0',
          300: '#C8B088',
          400: '#B09068',
          500: '#8B6F47',
          600: '#6E5736',
          700: '#503F27',
          800: '#352818',
          900: '#1E160E',
        },
        indigo: {
          50: '#EDF2F5',
          100: '#D0DDE5',
          200: '#A3BBCB',
          300: '#6E93AB',
          400: '#4A738E',
          500: '#2D4A5E',
          600: '#243C4D',
          700: '#1A2E3B',
          800: '#11202A',
          900: '#0A1318',
        },
        turmeric: {
          50: '#FDF8EB',
          100: '#F9EDCC',
          200: '#F0D699',
          300: '#E6BF66',
          400: '#D4A843',
          500: '#B8902E',
          600: '#926F22',
          700: '#6D531A',
          800: '#483712',
          900: '#2A1F0B',
        },
        madder: {
          50: '#FCEAE8',
          100: '#F5C4BF',
          200: '#E88E85',
          300: '#D65A4D',
          400: '#B83D30',
          500: '#8F2E24',
          600: '#6B221B',
          700: '#4A1812',
          800: '#320F0C',
          900: '#1E0907',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'paper': "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      animation: {
        'bounce-select': 'bounceSelect 0.4s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shake': 'shake 0.4s ease-in-out',
      },
      keyframes: {
        bounceSelect: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-3px)' },
          '40%': { transform: 'translateX(3px)' },
          '60%': { transform: 'translateX(-2px)' },
          '80%': { transform: 'translateX(2px)' },
        },
      },
    },
  },
  plugins: [],
};
