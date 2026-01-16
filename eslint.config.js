/**
 * ESLint v9 Flat Config
 *
 * - We keep the repo-wide rules in `@niu/eslint-config`.
 * - This root config mainly wires it up and adds Node-specific overrides for build/config files.
 */

module.exports = [
  // Replaces legacy `.eslintignore` (deprecated in ESLint v9)
  {
    ignores: [
      "**/dist/**",
      "**/.turbo/**",
      "**/.vite/**",
      "**/.webpack_cache/**",
      "**/node_modules/**",
    ],
  },

  // Base rules shared across apps/packages
  ...require("@niu/eslint-config"),

  // Node-ish config/build files (CommonJS/TS configs)
  {
    files: [
      "**/config/webpack.*.js",
      "**/build/webpack.*.js",
      "**/.babelrc.js",
      "**/postcss.config.js",
      "**/eslint.config.js",
      "**/vite.config.{ts,js}",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        process: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
      "no-var": "off",
    },
  },
];
