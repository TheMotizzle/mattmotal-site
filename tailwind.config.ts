import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#ededed",
        accent: "#8b5cf6",
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
        display: ['var(--font-display)'],
        body: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
