import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black:      "#080808",
          "black-2":  "#111",
          white:      "#FAFAF8",
          off:        "#F2EEE6",
          cream:      "#F8F4ED",
          "cream-2":  "#EFE9DA",
          gold:       "#C49530",
          "gold-2":   "#D9AA4A",
          "gold-3":   "#ECC96A",
          "gold-lt":  "#D4A84B",
          vino:       "#5C1515",
          charcoal:   "#141414",
          mid:        "#6B6460",
        },
      },
      fontFamily: {
        display: ["Cormorant", "Georgia", "serif"],
        body:    ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        brand: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
