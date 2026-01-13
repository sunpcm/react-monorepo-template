import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  // 插件
  plugins: [
    react(), // 提供 Fast Refresh 和 JSX 环境
    visualizer({
      open: true, // 构建完自动打开
      gzipSize: true, // 显示 gzip 大小
      brotliSize: true, // 显示 brotli 大小
      filename: "dist/stats.html", // 生成的文件位置
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      // Dataset 服务 (localhost:8080) ===
      "/api/dataset": {
        target: "http://localhost:8080",
        changeOrigin: true,
        // ⚠️ 注意区别：Vite 这里是函数！
        rewrite: (path) => path.replace(/^\/api/, ""),
        // 结果：/api/dataset/list -> /dataset/list
      },

      // Experiments 服务 (localhost:8081) ===
      "/api/experiments": {
        target: "http://localhost:8081",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      // === 代理规则 3：通用/兜底 (localhost:3000) ===
      // 使用正则匹配：匹配所有其他以 /api 开头的
      // 注意：这就要求把具体的规则写在上面，正则写在下面，
      // 或者依靠 key 的特定性（Vite 也是优先匹配更具体的字符串）
      "^/api/.*": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  // 解析
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  // css 预处理
  // 不用配loader，如果想注入全局 scss变量，可以在这里配置
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "@/styles/variables.scss";`
      },
    },
  },

  //构建 - 对应 Webpack 的 output
  build: {
    outDir: "dist",
    minify: "esbuild", // 默认使用 esbuild，速度快
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
});
