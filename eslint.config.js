/**
 * ESLint v9 Flat Config
 *
 * - We keep the repo-wide rules in `@biu/eslint-config`.
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
  ...require("@biu/eslint-config"),
];
