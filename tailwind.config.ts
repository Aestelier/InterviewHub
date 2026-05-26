import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f7f3ea",
        ink: "#20201d",
        muted: "#69665f",
        line: "#ded7c8",
        ochre: "#9b7a46",
        sage: "#687567"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Georgia", "ui-serif", "serif"]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(32, 32, 29, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
