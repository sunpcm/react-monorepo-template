module.exports = {
  root: true, // 【核心】告诉 ESLint 停止向上查找，这里就是老大
  // 继承我们写的共享配置
  // 这样根目录下的脚本文件也能享受到 Lint 检查
  extends: ["@niu/eslint-config"],
  overrides: [
    {
      // 匹配模式优化：
      // 使用 **/ 可以同时匹配 apps/ 和 packages/ 下的配置文件
      files: [
        "**/config/webpack.*.js", // Webpack 配置
        "**/build/webpack.*.js", // 兼容旧目录
        "**/.babelrc.js", // Babel 配置
        "**/postcss.config.js", // PostCSS 配置
        "**/.eslintrc.js", // ESLint 自身配置
        "**/vite.config.ts", // Vite 配置 (通常是 TS，但如果是 JS 也需要 node 环境)
      ],
      env: {
        node: true, // 关键：开启 Node 全局变量支持 (识别 module, require, __dirname)
      },
      rules: {
        // 允许使用 require（配置文件中很常见）
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/no-var-requires": "off",
        // 允许使用 var (可选，有些老配置文件可能用 var)
        "no-var": "off",
      },
    },
  ],
};
