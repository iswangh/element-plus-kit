# VitePress 自动部署到 GitHub Pages 文档

本文档详细说明了如何配置 VitePress 文档自动部署到 GitHub Pages，包括 GitHub Actions 工作流配置、VitePress 配置以及部署流程的完整说明。

---

## 📋 目录

- [概述](#概述)
- [GitHub Actions 工作流配置](#github-actions-工作流配置)
  - [deploy-docs.yml 详解](#deploy-docsyml-详解)
  - [ci.yml 详解](#ciyml-详解)
- [VitePress 配置说明](#vitepress-配置说明)
- [部署流程](#部署流程)
- [GitHub Pages 设置](#github-pages-设置)
- [常见问题](#常见问题)

---

## 概述

本项目使用 GitHub Actions 自动将 VitePress 文档部署到 GitHub Pages。部署流程包括：

1. **代码检查**：通过 CI 工作流进行代码质量检查
2. **自动构建**：当代码推送到 main 分支时，自动构建文档
3. **自动部署**：将构建产物部署到 GitHub Pages

### 文件结构

```
.github/
└── workflows/
    ├── ci.yml              # CI 工作流（代码检查）
    └── deploy-docs.yml     # 部署工作流（文档部署）

docs/
├── .vitepress/
│   └── config.ts          # VitePress 配置文件
├── package.json           # 文档项目的依赖配置
└── ...                    # 文档源文件
```

---

## GitHub Actions 工作流配置

GitHub Actions 是 GitHub 提供的 CI/CD 服务，通过 YAML 配置文件定义自动化工作流。

### YAML 基础概念

YAML（YAML Ain't Markup Language）是一种人类可读的数据序列化标准，常用于配置文件。

**基本语法**：
- 使用缩进表示层级关系（通常使用 2 个空格）
- 使用 `:` 分隔键值对
- 使用 `-` 表示列表项
- 使用 `#` 表示注释

**示例**：
```yaml
name: 工作流名称          # 字符串值
on:                      # 对象值
  push:                  # 嵌套对象
    branches: [main]      # 数组值
```

---

## deploy-docs.yml 详解

`deploy-docs.yml` 是专门用于部署文档到 GitHub Pages 的工作流配置文件。

### 完整配置（带注释）

```yaml
# 工作流名称，在 GitHub Actions 界面中显示
name: Deploy Docs

# 触发条件
on:
  # 当代码推送到 main 分支时自动触发
  push:
    branches: [main]
  # 允许手动触发工作流（在 GitHub Actions 界面中点击 "Run workflow"）
  workflow_dispatch:

# 权限配置
permissions:
  contents: read      # 允许读取仓库内容（需要读取代码和配置文件）
  pages: write        # 允许写入 GitHub Pages（需要部署构建产物）
  id-token: write     # 允许写入 OIDC token（用于 GitHub Pages 身份验证）

# 并发控制
concurrency:
  group: pages                    # 并发组名称，同一组内的工作流会排队执行，避免并发部署冲突
  cancel-in-progress: false       # 不取消正在运行的工作流，等待当前部署完成

# 作业定义
jobs:
  # 作业名称（可以自定义）
  build-and-deploy:
    # 指定运行环境：使用最新的 Ubuntu 系统
    runs-on: ubuntu-latest
    # 部署环境配置
    environment:
      name: github-pages          # GitHub Pages 的特殊环境（需要在仓库设置中创建）
      # 获取部署后的 URL，${{ }} 是 GitHub Actions 的表达式语法，用于引用步骤的输出
      url: ${{ steps.deployment.outputs.page_url }}

    # 步骤列表
    steps:
      # 步骤 1：检出代码
      - name: Checkout
        # 使用官方提供的检出代码的 Action
        uses: actions/checkout@v4
        with:
          # 获取完整的 Git 历史记录（用于生成站点地图等）
          fetch-depth: 0

      # 步骤 2：设置 pnpm（必须在 Setup Node.js 之前执行）
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10              # 指定 pnpm 版本

      # 步骤 3：设置 Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'       # 指定 Node.js 版本
          cache: pnpm              # 启用 pnpm 的依赖缓存，加速后续构建

      # 步骤 4：安装依赖
      - name: Install dependencies
        # 执行 shell 命令
        run: pnpm install --frozen-lockfile
        # --frozen-lockfile：使用锁文件中的精确版本，不更新锁文件

      # 步骤 5：构建项目包（core、form、kit）
      - name: Build packages
        run: pnpm build:packages
        # 文档可能依赖这些包，需要先构建

      # 步骤 6：构建文档
      - name: Build docs
        # 指定工作目录：在 docs 目录下执行命令
        working-directory: ./docs
        # 执行 docs/package.json 中的 build 脚本
        run: pnpm build
        # 环境变量
        env:
          # 设置 VitePress 的 base 路径
          # 因为部署在子目录下（https://username.github.io/repo-name/），需要设置 base 路径
          VITE_BASE: /element-plus-kit/

      # 步骤 7：配置 GitHub Pages 环境
      - name: Setup Pages
        uses: actions/configure-pages@v4
        # 准备部署环境，检查权限等

      # 步骤 8：上传构建产物
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # 指定构建产物的路径：VitePress 构建后的文件位于此目录
          path: ./docs/.vitepress/dist

      # 步骤 9：部署到 GitHub Pages
      - name: Deploy to GitHub Pages
        # 给步骤设置 ID，可以通过 steps.deployment.outputs 访问步骤的输出（如部署 URL）
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## ci.yml 详解

`ci.yml` 是用于代码质量检查的工作流，不负责部署。

### 完整配置（带注释）

```yaml
# 工作流名称
name: CI

# 触发条件
on:
  # 当代码推送到 main 或 dev 分支时触发
  push:
    branches: [main, dev]
  # 当创建 PR 到 main 或 dev 分支时触发
  pull_request:
    branches: [main, dev]

# 作业定义
jobs:
  # 作业 1：代码检查
  lint-and-test:
    # 指定运行环境：使用最新的 Ubuntu 系统
    runs-on: ubuntu-latest

    # 步骤列表
    steps:
      # 步骤 1：检出代码
      - uses: actions/checkout@v4

      # 步骤 2：设置 Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'       # 指定 Node.js 版本

      # 步骤 3：设置 pnpm
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10              # 指定 pnpm 版本

      # 步骤 4：安装依赖
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        # --frozen-lockfile：使用锁文件中的精确版本，不更新锁文件

      # 步骤 5：代码风格检查
      - name: Lint
        run: pnpm lint
        # 检查代码风格和规范

      # 步骤 6：类型检查
      - name: Type check
        run: pnpm type-check
        # 检查 TypeScript 类型错误

      # 步骤 7：构建包
      - name: Build packages
        run: pnpm build:packages
        # 验证包能否正常构建

  # 作业 2：文档构建验证
  build-docs:
    # 指定运行环境：使用最新的 Ubuntu 系统
    runs-on: ubuntu-latest
    # 依赖 lint-and-test 作业：只有代码检查通过后才会构建文档
    needs: lint-and-test

    # 步骤列表
    steps:
      # 步骤 1：检出代码
      - uses: actions/checkout@v4

      # 步骤 2：设置 Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'       # 指定 Node.js 版本

      # 步骤 3：设置 pnpm
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10              # 指定 pnpm 版本

      # 步骤 4：安装依赖
      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      # 步骤 5：构建项目包
      - name: Build packages
        run: pnpm build:packages

      # 步骤 6：构建文档（验证）
      - name: Build docs
        # 指定工作目录：在 docs 目录下执行命令
        working-directory: ./docs
        # 执行 docs/package.json 中的 build 脚本
        run: pnpm build
        # 环境变量
        env:
          # 设置 VitePress 的 base 路径（用于验证构建是否正确）
          VITE_BASE: /element-plus-kit/

      # 注意：部署由 deploy-docs.yml 工作流专门处理，这里只负责构建验证
```

---

## VitePress 配置说明

VitePress 配置文件位于 `docs/.vitepress/config.ts`。

### Base 路径配置

```typescript
base: process.env.VITE_BASE || '/',
```

- **作用**：设置文档的基础路径
- **本地开发**：`base: '/'`（根路径）
- **GitHub Pages 部署**：`base: '/element-plus-kit/'`（子目录）
- **说明**：通过环境变量 `VITE_BASE` 控制，部署时设置为 `/element-plus-kit/`

### 排除文件配置

```typescript
// 排除 development 目录，不参与构建
srcExclude: ['**/development/**'],
```

- **作用**：排除指定目录或文件，不参与 VitePress 构建
- **说明**：
  - `development` 目录包含开发文档，不需要部署到生产环境
  - 使用 glob 模式匹配：`**/development/**` 表示排除所有 `development` 目录及其子文件
  - 可以排除多个路径：`srcExclude: ['**/development/**', '**/temp/**']`

### Favicon 路径配置

```typescript
head: [
  ['link', { rel: 'icon', href: `${process.env.VITE_BASE || '/'}favicon.ico` }],
]
```

- **作用**：设置网站图标路径
- **说明**：需要根据 base 路径动态调整，确保图标能正确加载

### 构建输出目录

- **默认输出**：`docs/.vitepress/dist/`
- **部署路径**：GitHub Actions 工作流中指定为 `./docs/.vitepress/dist`
- **排除的文件**：`development` 目录下的所有文件不会出现在构建输出中

---

## 部署流程

### 自动部署流程

1. **代码推送**：开发者将代码推送到 `main` 分支
2. **触发工作流**：GitHub Actions 检测到 push 事件，触发 `deploy-docs.yml`
3. **环境准备**：
   - 检出代码
   - 安装 pnpm 和 Node.js
   - 安装项目依赖
4. **构建阶段**：
   - 构建项目包（core、form、kit）
   - 构建 VitePress 文档（使用 base 路径 `/element-plus-kit/`）
5. **部署阶段**：
   - 配置 GitHub Pages 环境
   - 上传构建产物
   - 部署到 GitHub Pages
6. **完成**：文档自动更新到 `https://username.github.io/element-plus-kit/`

### 手动触发部署

1. 进入 GitHub 仓库的 **Actions** 标签页
2. 选择 **Deploy Docs** 工作流
3. 点击 **Run workflow** 按钮
4. 选择分支（通常是 `main`）
5. 点击 **Run workflow** 确认

---

## GitHub Pages 设置

### 初始设置

1. 进入仓库的 **Settings** → **Pages**
2. 在 **Source** 部分，选择 **GitHub Actions**
3. 保存设置

### 环境配置

1. 进入 **Settings** → **Environments**
2. 如果不存在 `github-pages` 环境，GitHub 会自动创建
3. 可以配置环境保护规则（可选）

### 验证部署

1. 部署完成后，访问 `https://username.github.io/repo-name/`
2. 如果看到 VitePress 文档页面，说明部署成功
3. 如果看到 README.md 内容，说明：
   - GitHub Pages 源设置不正确（应选择 "GitHub Actions"）
   - 或工作流未正确执行

---

## 常见问题

### Q1: 部署后网站显示 README.md 内容而不是 VitePress 内容

**原因**：
- GitHub Pages 源设置不正确
- 工作流未正确执行

**解决方案**：
1. 检查 **Settings** → **Pages** → **Source** 是否设置为 "GitHub Actions"
2. 检查 **Actions** 标签页中的工作流是否成功执行
3. 查看工作流日志，确认是否有错误

### Q2: 工作流失败，提示 "Unable to locate executable file: pnpm"

**原因**：
- pnpm 设置顺序不正确
- Node.js 的 `cache: pnpm` 需要在 Setup pnpm 之后

**解决方案**：
确保工作流中的顺序是：
1. Setup pnpm（先）
2. Setup Node.js（后，使用 `cache: pnpm`）

### Q3: 资源路径 404 错误

**原因**：
- Base 路径配置不正确
- 资源路径未使用 base 前缀

**解决方案**：
1. 确认部署时设置了 `VITE_BASE: /element-plus-kit/`
2. 检查 VitePress 配置中的资源路径是否使用了 base 路径
3. 验证构建后的 HTML 文件中的资源路径是否正确

### Q4: 工作流未触发

**原因**：
- 触发条件配置不正确
- 推送的分支不匹配

**解决方案**：
1. 检查 `on.push.branches` 配置
2. 确认推送的分支名称（如 `main` 而不是 `master`）
3. 可以手动触发测试（使用 `workflow_dispatch`）

### Q5: 并发部署冲突

**原因**：
- 多个部署同时进行
- `concurrency` 配置不正确

**解决方案**：
1. 检查 `concurrency.group` 配置
2. 设置 `cancel-in-progress: false` 让部署排队执行
3. 等待当前部署完成后再触发新的部署

### Q6: 环境变量未生效

**原因**：
- 环境变量作用域不正确
- 环境变量名称错误

**解决方案**：
1. 确认环境变量设置在正确的步骤中
2. 检查环境变量名称（如 `VITE_BASE` 而不是 `BASE`）
3. 验证构建命令是否在设置了环境变量的步骤中执行

---

## 总结

通过 GitHub Actions 自动部署 VitePress 文档到 GitHub Pages 的流程包括：

1. **配置工作流**：创建 `deploy-docs.yml` 定义部署流程
2. **配置 VitePress**：设置 base 路径和资源路径
3. **设置 GitHub Pages**：选择 "GitHub Actions" 作为源
4. **自动部署**：每次 push 到 main 分支自动部署

关键配置点：
- ✅ pnpm 和 Node.js 的设置顺序
- ✅ Base 路径的环境变量设置
- ✅ 构建产物路径的正确指定
- ✅ GitHub Pages 权限配置

遵循本文档的配置，即可实现 VitePress 文档的自动部署。
