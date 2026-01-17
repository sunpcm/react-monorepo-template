/**
 * Shared Prettier config for this monorepo.
 *
 * Keep it minimal and predictable; extend only when there's a strong need.
 */
module.exports = {
  printWidth: 100,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  arrowParens: "always",
  endOfLine: "lf",
  plugins: ["prettier-plugin-tailwindcss"],
};
