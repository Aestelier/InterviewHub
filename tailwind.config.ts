import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f4f0e8",
        "paper-2": "#ede8de",
        ink: "#0c0a08",
        "ink-2": "#2a261f",
        muted: "#8a8176",
        line: "#d4ccbe",
        ochre: "#7a6046",
        sage: "#687567"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-italic)", "Georgia", "ui-serif", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(12, 10, 8, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
