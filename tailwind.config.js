/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        rethink: ["Rethink_Sans", "sans-serif"],
        "rethink-bold": ["Rethink_Sans_Bold", "sans-serif"],
        "rethink-medium": ["Rethink_Sans_Medium", "sans-serif"],
        "rethink-semibold": ["Rethink_Sans_Semibold", "sans-serif"],
        "rethink-extrabold": ["Rethink_Sans_ExtraBold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
