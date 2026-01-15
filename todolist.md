# Monorepo 性能优化待办清单

基于对当前项目的分析，以下是可以进行的性能优化建议：

---

## 1. 🚀 Turborepo 构建优化

### 1.1 启用 Remote Caching（远程缓存）

- [ ] **配置 Turbo Remote Caching**
  - 当前状态：仅使用本地缓存
  - **操作**：登录 Vercel 并启用远程缓存
  ```bash
  npx turbo login
  npx turbo link
  ```
  - **收益**：CI/CD 和团队成员之间共享构建缓存，大幅减少重复构建时间

### 1.2 优化 Turbo 任务配置

- [ ] **添加 `inputs` 精确控制缓存失效**
  - 当前状态：默认使用所有文件作为输入
  - **操作**：在 `turbo.json` 中配置更精确的 inputs
  ```json
  {
    "tasks": {
      "build": {
        "dependsOn": ["^build"],
        "inputs": ["src/**", "package.json", "tsconfig.json"],
        "outputs": ["dist/**"]
      }
    }
  }
  ```
  - **收益**：只有相关文件变化时才重新构建

- [ ] **添加 `lint` 和 `typecheck` 任务**
  - **操作**：
  ```json
  {
    "tasks": {
      "lint": {
        "dependsOn": ["^lint"],
        "cache": true
      },
      "typecheck": {
        "dependsOn": ["^typecheck"],
        "cache": true
      }
    }
  }
  ```
  - **收益**：利用缓存加速 lint 和类型检查

---

## 2. 📦 Webpack App 性能优化

### 2.1 构建速度优化

- [ ] **使用 SWC 替代 Babel**
  - 当前状态：使用 `babel-loader` 编译 TypeScript/JSX
  - **操作**：安装 `swc-loader` 替代 `babel-loader`
  ```bash
  pnpm add -D @swc/core swc-loader -F webpack-app
  ```
  - **收益**：编译速度提升 10-20 倍

- [ ] **启用持久化缓存（Persistent Caching）**
  - **操作**：在 `webpack.common.js` 中添加：
  ```javascript
  module.exports = {
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename]
      }
    }
  }
  ```
  - **收益**：二次构建速度提升 80%+

- [ ] **使用 `thread-loader` 并行编译**
  - **操作**：在耗时的 loader 前添加 `thread-loader`
  - **收益**：多核 CPU 并行处理，加速编译

### 2.2 生产包体积优化

- [ ] **添加 CSS 压缩**
  - 当前状态：CSS 未压缩
  - **操作**：使用 `css-minimizer-webpack-plugin`
  ```bash
  pnpm add -D css-minimizer-webpack-plugin -F webpack-app
  ```
  ```javascript
  optimization: {
    minimizer: [
      `...`, // 保留默认的 JS 压缩
      new CssMinimizerPlugin()
    ]
  }
  ```

- [ ] **优化 `splitChunks` 配置**
  - 当前状态：使用默认配置 `chunks: 'all'`
  - **操作**：精细化配置代码分割
  ```javascript
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 10
        }
      }
    }
  }
  ```
  - **收益**：更好的缓存利用率，减少用户加载量

- [ ] **添加 Gzip/Brotli 预压缩**
  - **操作**：使用 `compression-webpack-plugin`
  ```bash
  pnpm add -D compression-webpack-plugin -F webpack-app
  ```
  - **收益**：减少服务器运行时压缩开销

- [ ] **配置 Tree Shaking 优化**
  - **操作**：确保 `package.json` 中设置 `"sideEffects": false` 或精确配置
  - **收益**：移除未使用的代码

---

## 3. ⚡ Vite App 性能优化

### 3.1 生产构建优化

- [ ] **优化 `manualChunks` 配置**
  - 当前状态：仅分离了 `react` 和 `react-dom`
  - **操作**：添加更多分包策略
  ```typescript
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react';
            return 'vendor';
          }
        }
      }
    }
  }
  ```

- [ ] **启用 Gzip/Brotli 预压缩**
  - **操作**：安装 `vite-plugin-compression`
  ```bash
  pnpm add -D vite-plugin-compression -F vite-app
  ```
  ```typescript
  import compression from 'vite-plugin-compression'
  
  plugins: [
    compression({ algorithm: 'gzip' }),
    compression({ algorithm: 'brotliCompress', ext: '.br' })
  ]
  ```
  - **收益**：生成预压缩文件，减少服务器压缩开销

- [ ] **开启 CSS 代码分割**
  - **操作**：确保 `build.cssCodeSplit: true`（默认开启）

### 3.2 开发体验优化

- [ ] **预构建依赖优化**
  - **操作**：显式声明需要预构建的依赖
  ```typescript
  optimizeDeps: {
    include: ['react', 'react-dom', '@niu/ui-lib']
  }
  ```
  - **收益**：避免开发时的依赖重新发现和预构建

---

## 4. 🔧 TypeScript 编译优化

- [ ] **使用 `incremental` 增量编译**
  - **操作**：在 `tsconfig` 中启用
  ```json
  {
    "compilerOptions": {
      "incremental": true,
      "tsBuildInfoFile": "./.tsbuildinfo"
    }
  }
  ```
  - **收益**：TypeScript 增量编译，加速类型检查

- [ ] **使用 Project References（项目引用）**
  - **操作**：配置 `references` 实现增量构建
  - **收益**：大型 monorepo 中显著提升类型检查速度

---

## 5. 📊 包体积分析与监控

- [ ] **设置包体积预算（Bundle Budget）**
  - **操作**：使用 `bundlesize` 或 `size-limit` 工具
  ```bash
  pnpm add -D size-limit @size-limit/preset-app -w
  ```
  - 在 `package.json` 中配置：
  ```json
  {
    "size-limit": [
      { "path": "apps/vite-app/dist/**/*.js", "limit": "200 KB" },
      { "path": "apps/webpack-app/dist/**/*.js", "limit": "200 KB" }
    ]
  }
  ```
  - **收益**：CI 中自动检测包体积增长

- [ ] **定期分析打包结果**
  - 当前状态：已配置 `rollup-plugin-visualizer` 和 `webpack-bundle-analyzer`
  - **操作**：定期运行 `pnpm build` 并分析报告，识别大依赖

---

## 6. 🌐 运行时性能优化

- [ ] **实现路由懒加载**
  - **操作**：使用 `React.lazy` + `Suspense`
  ```tsx
  const Dashboard = React.lazy(() => import('./pages/Dashboard'))
  ```
  - **收益**：减少首屏加载体积

- [ ] **图片优化**
  - **操作**：
    - 使用 WebP/AVIF 格式
    - 配置 `vite-plugin-imagemin` 或 `image-minimizer-webpack-plugin`
    - 实现图片懒加载
  - **收益**：减少图片体积 50%+

- [ ] **添加资源预加载/预获取**
  - **操作**：为关键资源添加 `<link rel="preload">`
  - **收益**：提升首屏加载速度

---

## 7. 🛠 依赖优化

- [ ] **审查依赖大小**
  - **操作**：使用 `bundlephobia.com` 检查依赖体积
  - 考虑替换大型依赖为轻量替代品（如 `date-fns` 替代 `moment`）

- [ ] **移除未使用的依赖**
  - **操作**：使用 `depcheck` 工具
  ```bash
  npx depcheck apps/vite-app
  npx depcheck apps/webpack-app
  ```

---

## 优先级建议

| 优先级 | 优化项 | 预期收益 |
|--------|--------|----------|
| 🔴 高 | Webpack 持久化缓存 | 构建速度提升 80%+ |
| 🔴 高 | SWC 替代 Babel | 编译速度提升 10x |
| 🔴 高 | Turbo Remote Caching | CI 构建时间减半 |
| 🟡 中 | Gzip/Brotli 预压缩 | 传输体积减少 70% |
| 🟡 中 | 优化 splitChunks | 更好的缓存命中率 |
| 🟡 中 | TypeScript 增量编译 | 类型检查加速 50%+ |
| 🟢 低 | 路由懒加载 | 首屏体积减少 |
| 🟢 低 | 图片优化 | 资源体积减少 50%+ |


# Monorepo 修复与性能优化待办清单

基于对项目的深度审查，我已将你的优化建议与我发现的**关键配置错误**进行了整合。请优先完成 **第 0 部分** 的修复，这直接关系到构建产物的正确性。

## 0. 🚨 紧急修复（必须优先执行）

这些问题严重影响项目的正常运行和构建质量：

- [ ] **💥 修复 Webpack App 生产构建模式**
  - **现状**：`apps/webpack-app/package.json` 的 `build` 命令使用了 `NODE_ENV=development`。
  - **后果**：生产包未压缩，体积巨大（包含 React 调试代码），性能极差。
  - **操作**：修改为 `cross-env NODE_ENV=production webpack --config build/webpack.prod.js`。

- [ ] **💥 修复 Root `dev` 启动命令**
  - **现状**：根目录 `dev` 运行 `turbo start`，但子应用（vite-app/webpack-app）仅有 `dev` 脚本。
  - **后果**：`pnpm dev` 无法启动项目。
  - **操作**：将根目录脚本改为 `"dev": "turbo dev"`，并确保 `turbo.json` 有 `dev` 管道。

- [ ] **💥 解决 React 版本冲突**
  - **现状**：`apps` 使用 React 19，但 `@niu/ui-lib` 的 `peerDependencies` 限制为 React 18。
  - **操作**：更新 `packages/ui-lib/package.json` 的 peerDependencies 允许 `^19.0.0`。

- [ ] **🔧 为 ui-lib 添加 TypeScript 配置**
  - **问题**：`packages/ui-lib` 缺少 `tsconfig.json`，导致 IDE 支持不佳。
  - **操作**：添加继承自 `@niu/tsconfig/react.json` 的配置。

---

## 1. 🚀 Turborepo 构建体系优化

- [ ] **✅ 修正 `build` 任务输入 (Inputs)**
  - **说明**：原建议遗漏了配置文件。修改配置应触发重建。
  - **配置**：
    ```json
    "inputs": ["src/**", "package.json", "tsconfig.json", "build/**", "vite.config.ts", ".babelrc", ".env*"]
    ```

- [ ] **✅ 启用 Remote Caching**
- [ ] **✅ 添加 `lint` 和 `typecheck` 管道**

---

## 2. 📦 Webpack App 深度优化

- [ ] **✅ 启用 Webpack 5 持久化缓存 (Filesystem Cache)**
  - **优先级**：🔴 高
  - **操作**：在 `webpack.common.js` 中添加 `cache: { type: 'filesystem' }`。

- [ ] **✅ 配置 SideEffects (Tree Shaking)**
  - **优先级**：🟡 中
  - **操作**：在 `apps/webpack-app/package.json` 中添加 `"sideEffects": ["*.css", "*.scss"]`。

- [ ] **✅ 使用 SWC 替代 Babel**
  - **说明**：配置 loader 时需保留 `include` 路径以支持 `ui-lib`。

- [ ] **✅ CSS 压缩与 SplitChunks 优化** (同原计划)

---

## 3. ⚡ Vite App 深度优化

- [ ] **✅ 启用 `server.warmup` (Vite 5+)**
  - **说明**：预热常用文件，加速开发服务器首屏加载。
  - **配置**：`server: { warmup: { clientFiles: ['./src/App.tsx'] } }`

- [ ] **✅ 启用 Gzip/Brotli 预压缩** (同原计划)
- [ ] **✅ 优化 ManualChunks** (同原计划)

---

## 4. 🛠 依赖与工程化

- [ ] **✅ 依赖去重 (Deduplication)**
  - **操作**：运行 `pnpm dedupe` 以合并重复依赖。

- [ ] **✅ TypeScript 增量构建** (同原计划)

## 优先级建议

1. **紧急修复 (第 0 部分)**
2. **构建缓存 (Turbo Inputs + Webpack FS Cache)**
3. **编译器升级 (SWC)**
4. **其余优化**