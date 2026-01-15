import baseConfig from "@niu/tailwind-config";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [baseConfig],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // 如果 ui-lib 用了 Tailwind 类名，也要包含
    "../../packages/ui-lib/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Vite app 特有的样式扩展（如果有的话）
    },
  },
};
