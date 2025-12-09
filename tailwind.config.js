/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ea580c', // Orange-600 (Requested Orange)
        secondary: '#1f2937', // Gray-800 for text contrast
        accent: '#f59e0b', // Amber-500
        light: '#ffffff',
        dark: '#1c1917'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
        gujarati: ['var(--font-shrikhand)', 'cursive']
      }
    },
  },
  plugins: [],
}
