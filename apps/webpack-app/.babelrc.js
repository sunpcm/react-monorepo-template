module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV);

  const isDevelopment = process.env.NODE_ENV === "development";
  const isProduction = process.env.NODE_ENV === "production";

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          useBuiltIns: "usage",
          corejs: { version: 3, proposals: true },
          modules: false,
          debug: isDevelopment,
        },
      ],
      [
        "@babel/preset-react",
        {
          runtime: "automatic",
          development: isDevelopment,
          ...(isProduction && { removeProperties: { removeImport: true } }),
        },
      ],
      "@babel/preset-typescript",
    ],
    plugins: [
      // ✅ React Fast Refresh 必须放在最前面
      isDevelopment && "react-refresh/babel",

      // ✅ transform-runtime 放在后面，并配置 skipHelperValidation
      [
        "@babel/plugin-transform-runtime",
        {
          helpers: true,
          regenerator: true,
          // ⚠️ 关键配置：跳过辅助函数验证，避免与 react-refresh 冲突
          skipHelperValidation: true,
        },
      ],
    ].filter(Boolean),
  };
};
