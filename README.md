# monorepo-study-note

A small monorepo for studying and comparing modern frontend tooling.

- **Package manager**: pnpm workspaces
- **Task runner / build pipeline**: Turborepo
- **Linting**: ESLint v9 (Flat Config)

## Repo structure

- `apps/`
  - `vite-app/`: React app powered by Vite
  - `webpack-app/`: React app powered by Webpack 5
- `packages/`
  - `ui-lib/`: `@niu/ui-lib` shared UI library
  - `configs/`
    - `eslint-config/`: `@niu/eslint-config` shared ESLint preset (Flat Config export)
    - `postcss-config/`: `@niu/postcss-config`
    - `tailwind-config/`: `@niu/tailwind-config`
    - `tsconfig/`: `@niu/tsconfig`

## Prerequisites

- Node.js (recent LTS recommended)
- pnpm (pinned by root `package.json#packageManager`)

## Quick start

```bash
pnpm -w install
pnpm dev
```

## Common scripts (root)

```bash
pnpm dev
pnpm dev:vite
pnpm dev:webpack

pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

### Bundle analysis

```bash
pnpm -w build:analyze:vite
pnpm -w build:analyze:webpack
```

## ESLint (v9 Flat Config)

- Root config: `eslint.config.js`
- Shared preset: `packages/configs/eslint-config` (published as `@niu/eslint-config`)

## Version management with pnpm catalog

This repo uses **pnpm catalog** (`pnpm-workspace.yaml`) to centralize versions for shared, cross-workspace dependencies.

In workspace `package.json`, shared deps typically use:

- `"catalog:"` — version comes from the root catalog

## Troubleshooting

### pnpm warning: "Ignored build scripts" (e.g. `esbuild`, `core-js-pure`)

During `pnpm install`, you may see:

> Ignored build scripts: core-js-pure@..., esbuild@...

What it means:

- Some packages define `install/postinstall/prepare` scripts.
- pnpm may skip running certain dependency scripts by default (security measure).

If you ever hit errors that look like missing native binaries (often related to `esbuild`), you can explicitly allow scripts via:

```bash
pnpm approve-builds
```

## Quality gates

```bash
pnpm -w lint
pnpm -w typecheck
pnpm -w test
pnpm -w build
```

## Notes

- Improvement checklist and audit history: `issue2.md`
