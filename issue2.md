# Monorepo 优化清单（按优先级逐个修）

> 目标：把当前 repo 的“正确性风险”先消掉，再做一致性、性能与工程化体验提升。
>
> 说明：每条都尽量写成“可执行任务 + 验收标准”，你可以按勾选顺序一个个改。

## P0（优先级最高）：正确性 / 产物一致性

### 1) Webpack prod 的 CSS/PostCSS/Tailwind 管道与 dev 不一致

- [ ] 对齐 `apps/webpack-app/config/webpack.prod.js` 与 `apps/webpack-app/config/webpack.dev.js` 的 CSS rules
  - 背景：dev 有 `postcss-loader`，prod 没有，可能导致生产环境 Tailwind 指令/主题导入无法正确处理。
  - 现状参考：
    - dev：`apps/webpack-app/config/webpack.dev.js`
    - prod：`apps/webpack-app/config/webpack.prod.js`
    - CSS 入口：`apps/webpack-app/src/styles.css`
  - 验收标准：
    - `pnpm -C apps/webpack-app build` 产物样式与 dev 一致（至少页面基础样式、Tailwind utility 生效）
    - 生产构建后的 CSS 中包含预期的 Tailwind 输出（非仅原始 @import/@tailwind）

### 2) 统一 PostCSS 配置来源，避免“看似抽包，实际各用各的”

- [ ] Webpack 与 Vite 都统一读取各自 app 下的 `postcss.config.js`（内部再引用 `@niu/postcss-config`）
  - 背景：`apps/webpack-app/config/webpack.dev.js` 里手写了 `postcssOptions.plugins`，容易与 `apps/webpack-app/postcss.config.js` 漂移。
  - 现状参考：
    - `apps/vite-app/postcss.config.js`
    - `apps/webpack-app/postcss.config.js`
    - `packages/postcss-config/index.js`
  - 验收标准：
    - 只维护一份 PostCSS 插件链配置（减少双写）
    - dev/prod 输出一致，且 Tailwind + autoprefixer 生效

### 3) React 版本与 ui-lib peerDependencies 冲突

- [ ] 放宽 `packages/ui-lib/package.json` 的 `peerDependencies.react` / `peerDependencies.react-dom`（支持 React 19）
  - 背景：apps 用 React 19，ui-lib peer 可能还卡 18（会导致安装冲突或重复 React）。
  - 验收标准：
    - 全仓 `pnpm install` 无 peer 冲突（或至少不再阻塞）
    - 运行时不出现 hooks 相关错误（多份 React）

## P1：构建/任务体系（Turborepo & 脚本一致性）

### 4) Turbo inputs/outputs 完整性（提升缓存命中与可靠性）

- [ ] 为 `build/lint/typecheck/test/dev` 任务补齐 inputs/outputs
  - 建议 inputs（按你项目实际使用裁剪）：
    - 源码：`src/**`
    - 构建配置：`vite.config.ts`、`webpack.*.js`、`tsconfig*.json`
    - 样式配置：`postcss.config.js`、`tailwind.config.js`、`packages/tailwind-config/**`
    - 环境变量：`.env*`
  - 建议 outputs：
    - apps: `dist/**`
    - packages (若有 build): `dist/**` 或 `build/**`
  - 验收标准：
    - 相同输入多次执行 `turbo build` 能命中缓存
    - 改动配置文件会正确触发 rebuild

### 5) 根脚本对齐：从 root 统一跑 dev/build/lint/typecheck

- [ ] 在根 `package.json` 里确保 `dev/build/lint/typecheck` 能通过 turbo 驱动所有 workspace
  - 验收标准：
    - root 执行 `pnpm dev` 能启动（至少 vite-app/webpack-app 的 dev）
    - root 执行 `pnpm lint` / `pnpm typecheck` 能跑通（或明确哪些包暂不参与）

## P2：Webpack App 性能与产物优化（可逐步做）

### 6) 生产环境明确为 production + 压缩/拆包完善

- [ ] 确保 Webpack prod 构建的 `mode`/`NODE_ENV` 为 production
  - 备注：关注 `apps/webpack-app/.babelrc.js` 是否对 env 判断/配置有影响。
  - 验收标准：
    - 产物被压缩（JS/CSS 体积显著下降）
    - 不包含明显 dev-only 逻辑

- [ ] 引入 CSS 压缩（例如 `css-minimizer-webpack-plugin`）
  - 验收标准：
    - 生产 CSS 最小化输出

- [ ] 完善 SplitChunks 与 chunkFilename 命名（见 `apps/webpack-app/TODO.md`）
  - 验收标准：
    - chunk 命名可读
    - vendor 拆分合理，首次加载与缓存友好

### 7) 构建速度：webpack filesystem cache / SWC

- [ ] 开启 Webpack filesystem cache（cache: { type: 'filesystem' }）
- [ ] 评估 Babel → SWC（`swc-loader`）
  - 验收标准：
    - cold build/增量 build 时间缩短（你可以本地简单对比）

## P3：Vite App 体验与依赖预构建

### 8) optimizeDeps/warmup 可选优化

- [ ] 视情况添加 `optimizeDeps.include`（如：`react`、`react-dom`、`@niu/ui-lib`）
- [ ] 视情况添加 `server.warmup`（提升首次打开/切页速度）
  - 验收标准：
    - dev 首次启动/首屏时间改善（以你本机体验为准）

## P4：Packages（共享包）工程化完善

### 9) ui-lib 补齐 tsconfig / 构建产物 / types

- [ ] 为 `packages/ui-lib` 增加 `tsconfig.json`（或引用 `packages/tsconfig/react.json`）
- [ ] 明确 `main/module/types/exports`（确保 ts 与 bundler 都能稳定消费）
  - 验收标准：
    - apps 引用 `@niu/ui-lib` 时 TS 类型正常
    - 打包/运行不依赖源码路径耦合（根据你是否要 build ui-lib 决定）

### 10) tailwind-config：JS preset 与 CSS theme 的导入语义清晰化

- [ ] 确认 apps 里 `@import "@niu/tailwind-config";` 实际导入的是 CSS（或通过 exports 显式指向 `theme.css`）
  - 现状参考：
    - `packages/tailwind-config/theme.css`
    - `apps/vite-app/src/styles.css`
    - `apps/webpack-app/src/styles.css`
  - 验收标准：
    - 两个 app 均能正常加载该主题（dev/prod 都一致）

## P5：工程一致性与后续增强（可排期）

### 11) 配置文件模块制式统一（CJS/ESM）

- [ ] 统一 repo 内配置文件的模块风格（建议“配置文件统一 CJS”更兼容）
  - 验收标准：
    - Node 运行配置文件无兼容问题
    - 减少 `export default` 与 `module.exports` 混用导致的边界坑

### 12) 体积预算与可视化

- [ ] 引入 `size-limit`（或类似方案）并写入 CI
- [ ] 保留/完善 bundle analyzer（你 repo 里已有相关 TODO）
  - 验收标准：
    - PR 能看到体积变化（或至少超阈值会失败）

## 建议修改顺序（推荐）

1. P0-1：对齐 Webpack prod CSS/PostCSS/Tailwind（最可能直接影响线上样式）
2. P0-3：React peerDependencies 冲突（避免多份 React）
3. P1：Turbo inputs/outputs + root scripts（让全仓命令稳定可用）
4. P2：Webpack cache + SWC（提升效率）
5. P4/P5：ui-lib/types、导入语义、体积预算与一致性治理
