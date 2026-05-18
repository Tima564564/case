import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#05070d",
        panel: "rgba(15, 20, 35, 0.74)",
        cyanGlow: "#00f0ff",
        violetGlow: "#9b5cff",
        mythic: "#ff4df3",
        legendary: "#ffbd4a"
      },
      boxShadow: {
        neon: "0 0 32px rgba(0, 240, 255, .22), inset 0 1px 0 rgba(255,255,255,.08)",
        mythic: "0 0 30px rgba(255, 77, 243, .34)"
      },
      backdropBlur: {
        glass: "22px"
      }
    }
  },
  plugins: []
};

export default config;
