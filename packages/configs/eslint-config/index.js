module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier", // 必须放在最后，覆盖前面的格式化冲突
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  settings: {
    react: {
      version: "detect", // 自动检测 React 版本
    },
  },
  rules: {
    "react/react-in-jsx-scope": "off", // React 17+ 不需要引入 React
    "@typescript-eslint/no-explicit-any": "warn", // 允许 warn 级别的 any
  },
};
