/**
 * Plop generators for this monorepo.
 *
 * Design goals:
 * - Keep new packages consistent (eslint/prettier/tsconfig wiring)
 * - Allow choosing destination: packages/ or packages/configs/ (or custom)
 * - Default to @niu scoped packages
 */

const path = require("node:path");
const { execSync } = require("node:child_process");

/**
 * Convert a user-provided name into a safe folder name.
 * - "@niu/foo-bar" -> "foo-bar"
 * - "foo-bar" -> "foo-bar"
 */
function toFolderName(raw) {
  const name = String(raw || "").trim();
  if (!name) return "";
  if (name.startsWith("@")) {
    const parts = name.split("/");
    return parts[1] || "";
  }
  return name;
}

/**
 * Ensure we always generate a scoped package name.
 * - "foo" -> "@niu/foo"
 * - "@niu/foo" -> "@niu/foo"
 */
function toScopedName(raw, scope) {
  const name = String(raw || "").trim();
  if (!name) return "";
  if (name.startsWith("@")) return name;
  return `@${scope}/${name}`;
}

module.exports = function (plop) {
  plop.setHelper("eq", (a, b) => a === b);

  // Format generated files to keep diffs clean.
  plop.setActionType("prettier", (answers, config) => {
    const rawFiles = config.files || [];
    if (!rawFiles.length) return "skipped";

    // Resolve handlebars placeholders (e.g. {{packageDir}}) using Plop's renderer.
    const files = rawFiles.map((f) => plop.renderString(String(f), answers));
    if (!files.length) return "skipped";

    execSync(`pnpm -w exec prettier --write ${files.map((f) => `\"${f}\"`).join(" ")}`, {
      stdio: "inherit",
    });
    return "formatted";
  });

  // Allow non-interactive mode via: plop package -- --name foo --kind lib --dir packages --react true
  // We read from process.argv.
  const argv = process.argv;
  const getArg = (key) => {
    const i = argv.indexOf(`--${key}`);
    if (i === -1) return undefined;
    const v = argv[i + 1];
    if (!v || v.startsWith("--")) return "true"; // boolean flag
    return v;
  };
  const cliDefaults = {
    scope: getArg("scope"),
    name: getArg("name"),
    kind: getArg("kind"),
    dir: getArg("dir"),
    react: (() => {
      const v = getArg("react");
      if (v === undefined) return undefined;
      return String(v).toLowerCase() === "true" ? "true" : "false";
    })(),
  };

  plop.setGenerator("package", {
    description: "Create a new workspace package (default @niu/*)",
    prompts: [
      {
        type: "input",
        name: "scope",
        message: "Scope (without @):",
        default: cliDefaults.scope || "niu",
      },
      {
        type: "input",
        name: "name",
        message: "Package name (e.g. foo or @niu/foo):",
        default: cliDefaults.name,
        validate: (v) => (!!String(v || "").trim() ? true : "Package name is required"),
      },
      {
        type: "list",
        name: "kind",
        message: "Package kind:",
        choices: [
          { name: "lib (TS library)", value: "lib" },
          { name: "config (packages/configs/*)", value: "config" },
        ],
        default: cliDefaults.kind || "lib",
      },
      {
        type: "input",
        name: "dir",
        message:
          "Destination directory (relative to repo root). Leave blank to use default for chosen kind:",
        default: cliDefaults.dir || "",
      },
      {
        type: "list",
        name: "react",
        message: "Include React peerDependencies?",
        choices: [
          { name: "No", value: "false" },
          { name: "Yes", value: "true" },
        ],
        default: cliDefaults.react === undefined ? "false" : cliDefaults.react,
      },
    ],
    actions: function (answers) {
      const scope = answers.scope || "niu";
      const react = answers.react === true || answers.react === "true";
      const scopedName = toScopedName(answers.name, scope);
      const folderName = toFolderName(scopedName);

      const defaultBaseDir = answers.kind === "config" ? "packages/configs" : "packages";
      const baseDir = String(answers.dir || "").trim() || defaultBaseDir;
      const packageDir = path.posix.join(baseDir, folderName);

      // Make derived values available to later actions (especially custom ones).
      answers.packageDir = packageDir;
      answers.folderName = folderName;
      answers.scopedName = scopedName;

      return [
        {
          type: "add",
          path: "{{packageDir}}/package.json",
          templateFile: "plop-templates/package/package.json.hbs",
          data: {
            name: scopedName,
            folderName,
            packageDir,
            kind: answers.kind,
            react,
          },
        },
        {
          type: "add",
          path: "{{packageDir}}/tsconfig.json",
          templateFile: "plop-templates/package/tsconfig.json.hbs",
          skipIfExists: true,
          data: { packageDir, kind: answers.kind },
        },
        {
          type: "add",
          path: "{{packageDir}}/src/index.ts",
          templateFile: "plop-templates/package/src-index.ts.hbs",
          skipIfExists: true,
          data: { packageDir },
        },
        {
          type: "add",
          path: "{{packageDir}}/README.md",
          templateFile: "plop-templates/package/README.md.hbs",
          skipIfExists: true,
          data: {
            name: scopedName,
            packageDir,
          },
        },
        {
          type: "prettier",
          files: [
            "{{packageDir}}/package.json",
            "{{packageDir}}/tsconfig.json",
            "{{packageDir}}/src/index.ts",
            "{{packageDir}}/README.md",
          ],
        },
      ];
    },
  });
};
