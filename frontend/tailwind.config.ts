import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        glass: "rgba(15, 23, 42, 0.6)",
        accent: "#22d3ee",
        accentSoft: "#0ea5e9",
        glow: "#67e8f9"
      },
      boxShadow: {
        glow: "0 0 30px rgba(34, 211, 238, 0.25)"
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      backgroundImage: {
        "mesh": "radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.25), transparent 35%), radial-gradient(circle at 80% 10%, rgba(34, 211, 238, 0.2), transparent 40%), radial-gradient(circle at 50% 80%, rgba(56, 189, 248, 0.15), transparent 45%)"
      }
    }
  },
  plugins: []
};

export default config;
