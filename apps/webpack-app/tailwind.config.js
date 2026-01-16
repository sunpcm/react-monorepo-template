/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "../../packages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Webpack app 特有的样式扩展
    },
  },
};
