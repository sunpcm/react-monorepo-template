/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Vite app 特有的样式扩展（如果有的话）
    },
  },
};
