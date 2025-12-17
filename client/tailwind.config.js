/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      // Figma color palette
      primary: '#275BFF',
      dark: '#080B14',
      light: '#DCE1EF',
      'text-gray': '#5F636F',
      'error': '#C91B1B',
      'error-light': '#FCE7E7',
      'error-border': '#F5AAAA',
      'success': '#228B22',
      'success-light': '#E7F5E7',
      'success-border': '#AAF5AA',
      card: '#FFFFFF',
      white: '#FFFFFF',
      transparent: 'transparent',
    },
  },
  plugins: [],
}
