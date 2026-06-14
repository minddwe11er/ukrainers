import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#fafaf8",
        surface: "#ffffff",
        border: "#e8e6e0",
        "border-light": "#f0ede8",
        text: "#1a1a18",
        "text-secondary": "#555550",
        "text-tertiary": "#999994",
        accent: "#2c5aa0",
        "accent-light": "#eef2fa",
        "accent-text": "#1e3f75",
        warn: "#c17f24",
        "warn-light": "#fdf4e7",
        "warn-text": "#8a5a18",
      },
      fontFamily: {
        display: "'Playfair Display', Georgia, serif",
        body: "'Inter', system-ui, sans-serif",
      },
      fontSize: {
        "10.5": "10.5px",
        "11": "11px",
        "12": "12px",
        "12.5": "12.5px",
        "13": "13px",
        "13.5": "13.5px",
        "14": "14px",
        "15": "15px",
        "15.5": "15.5px",
        "17": "17px",
        "18": "18px",
        "19": "19px",
        "21": "21px",
        "26": "26px",
      },
      padding: {
        "1.75": "1.75rem",
        "1.5": "1.5rem",
        "1.375": "1.375rem",
        "1.125": "1.125rem",
        "0.75": "0.75rem",
        "0.875": "0.875rem",
      },
      margin: {
        "1.25": "1.25rem",
        "1.5": "1.5rem",
      },
      gap: {
        "0.625": "0.625rem",
        "1.25": "1.25rem",
        "1.375": "1.375rem",
        "2.5": "2.5rem",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,0.06)",
        md: "0 4px 12px rgba(0,0,0,0.08)",
      },
      maxWidth: {
        portal: "940px",
      },
      width: {
        sidebar: "255px",
      },
      lineHeight: {
        "1.35": "1.35",
        "1.45": "1.45",
        "1.65": "1.65",
        "1.78": "1.78",
      },
      letterSpacing: {
        "-0.01": "-0.01em",
        "-0.015": "-0.015em",
        "0.04": "0.04em",
        "0.07": "0.07em",
      },
    },
  },
  plugins: [],
};

export default config;
