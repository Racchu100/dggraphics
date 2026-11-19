/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dp: {
          navy: "#17243A",
          navyDark: "#0F1726",
          navyLight: "#23334F",
          orange: "#F47B35",
          orangeHover: "#E06822",
          orangeLight: "#FFF4EE",
          softGrey: "#F5F6F8",
          charcoal: "#242833",
          muted: "#777F8C",
          border: "#E2E5EB",
          card: "#FFFFFF",
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
          info: "#3B82F6",
        },
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "Manrope", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
