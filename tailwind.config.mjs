/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#faf7f2',
          100: '#f4ede1',
          200: '#e8dbca',
          300: '#d7c2a7',
          400: '#c2a382',
          500: '#b08b65',
          600: '#9b7352',
          700: '#7e5a42',
          800: '#674a38',
          900: '#543d30',
        },
        brass: {
          50: '#fbf9ed',
          100: '#f6f0cf',
          200: '#ede09f',
          300: '#dfca6a',
          400: '#d2b442',
          500: '#b8962d',
          600: '#947222',
          700: '#75541e',
          800: '#62451f',
          900: '#533a1e',
        },
        iron: {
          800: '#1e232a',
          900: '#14181f',
          950: '#0d1015',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        mono: ['"JetBrains Mono"', 'Consolas', '"Courier New"', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
