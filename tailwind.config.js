/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#C71585',
        secondary: '#A020F0',
        success: '#22c55e',
        warning: '#f97316',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
};