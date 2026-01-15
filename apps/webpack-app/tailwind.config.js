import baseConfig from "@niu/tailwind-config";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [baseConfig],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    // 如果 ui-lib 用了 Tailwind 类名，也要包含
    "../../packages/ui-lib/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Webpack app 特有的样式扩展
    },
  },
};
