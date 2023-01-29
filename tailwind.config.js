/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        dot: ["DotGothic16"],
        bungee: ["Bungee"],
        nico: ["Nico Moji"],
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      cursor: ["disabled"],
    },
  },
  container: {
    center: true,
    padding: {
      DEFAULT: "16px",
      sm: "24px",
    },
  },
  plugins: [require("@tailwindcss/forms")],
  important: true,
};
