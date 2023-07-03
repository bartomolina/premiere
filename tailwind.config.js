/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./ui/**/*.{js,ts,jsx,tsx,mdx}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  daisyui: {
    themes: ["lemonade", "business"],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
