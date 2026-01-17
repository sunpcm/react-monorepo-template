/* global require, module */
/* eslint-disable @typescript-eslint/no-require-imports */

const js = require("@eslint/js");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const tseslint = require("typescript-eslint");

/**
 * Flat Config for ESLint v9.
 *
 * This is a small shared preset used by the repo root `eslint.config.js`.
 */
module.exports = [
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  // React rules
  {
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    settings: {
      react: {
        // In a monorepo, eslint may run with CWD at repo root where `react` isn't installed.
        // Using `detect` would warn in that case, so we pin a modern React major.
        version: "19.0",
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      // React 17+ doesn't need React in scope
      "react/react-in-jsx-scope": "off",
    },
  },

  // Common repo choices
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // Node/CommonJS config files (webpack/vite/postcss/eslint configs, etc.)
  // Keeping this here avoids duplicating globals/relaxed rules in the repo root eslint.config.js.
  {
    files: [
      "**/*.cjs",
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
