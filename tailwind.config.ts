import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0B1026",
        "midnight-muted": "#111633",
        "midnight-elevated": "#161d3f",
        aurora: "#6200EE",
        aqua: "#00BCD4",
        "aqua-soft": "#26d4e9",
        "slate-200": "#A7B7D9",
        "slate-300": "#8C9BC0",
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 20px 45px -20px rgba(98, 0, 238, 0.55)",
        "glow-teal": "0 20px 45px -20px rgba(0, 188, 212, 0.55)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        pulseSlow: "pulseSlow 6s ease-in-out infinite",
        float: "float 8s ease-in-out infinite",
      },
      keyframes: {
        pulseSlow: {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "0.6" },
        },
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
          "100%": { transform: "translateY(0px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
