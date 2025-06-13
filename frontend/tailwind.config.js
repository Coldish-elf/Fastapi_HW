/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#6366f1",
          DEFAULT: "#4f46e5",
          dark: "#4338ca",
        },
        light: {
          background: "#f8fafc",
          foreground: "#ffffff",
          text: {
            DEFAULT: "#1e293b",
            secondary: "#64748b",
          },
          border: "#e2e8f0",
          muted: "#f1f5f9",
        },
        dark: {
          background: "#0f172a",
          foreground: "#1e293b",
          text: {
            DEFAULT: "#e2e8f0",
            secondary: "#94a3b8",
          },
          border: "#334155",
          muted: "#334155",
        },

        status: {
          waiting: "#f59e0b",
          progress: "#3b82f6",
          completed: "#22c55e",
        },

        danger: {
          DEFAULT: "#ef4444",
          hover: "#dc2626",
        },
        success: {
          DEFAULT: "#22c55e",
          hover: "#16a34a",
        },
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        sm: "0.375rem",
        lg: "1rem",
        full: "9999px",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
      },
      boxShadow: {
        DEFAULT:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        md: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        lg: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        none: "none",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
        colors: "background-color, border-color, color, fill, stroke, opacity",
      },
    },
  },
  plugins: [],
};
