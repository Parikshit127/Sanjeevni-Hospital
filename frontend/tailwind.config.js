/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Sanjivani Hospital Brand Colors
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          DEFAULT: '#243b53', // Dark navy blue from header
        },
        accent: {
          50: '#f0f4f0',
          100: '#d4e4d4',
          200: '#b8d4b8',
          300: '#9cc49c',
          400: '#80b480',
          500: '#6b9b6b',
          600: '#5a8a5a',
          700: '#4a7a4a',
          800: '#3a6a3a',
          900: '#2a5a2a',
          DEFAULT: '#5a8a5a', // Sage green accent
        },
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          cream: '#f5f1e8', // Beige/cream background
        },
      },
    },
  },
  plugins: [],
}

