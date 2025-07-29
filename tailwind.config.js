/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#A553C4',
        secondary: '#6636DD',
        success: '#22c55e',
        warning: '#2D1397',
        danger: '#2D1397',
      },
    },
  },
  plugins: [],
};