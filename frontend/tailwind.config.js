/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#1e293b',
          DEFAULT: '#4f46e5',
          light: '#6366f1',
        },
        background: '#f8fafc',
        text: '#1f2937',
        status: {
          waiting: '#EAB308',
          progress: '#3B82F6',
          completed: '#22C55E',
        }
      },
      borderRadius: {
        DEFAULT: '12px',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
