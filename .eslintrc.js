module.exports = {
  root: true, // 【核心】告诉 ESLint 停止向上查找，这里就是老大
  // 继承我们写的共享配置
  // 这样根目录下的脚本文件也能享受到 Lint 检查
  extends: ["@niu/eslint-config"],
};
