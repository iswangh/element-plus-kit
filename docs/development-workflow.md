# 开发与发布流程指南

## 📋 概述

本文档说明在 monorepo 中修改源代码后的开发流程、本地测试方法以及打包发布顺序。

---

## 🔧 修改源代码后的工作流程

### 1. 修改 `packages/core` 源代码

**修改后需要做的操作：**

#### 方式一：使用 watch 模式（推荐用于开发）

```bash
# 在 core 包目录下启动 watch 模式
cd packages/core
pnpm dev

# 或者从根目录执行
pnpm --filter @iswangh/element-plus-kit/core dev
```

**说明：**
- `dev` 脚本会启动 `vite build --watch`，自动监听文件变化并重新构建
- 修改源代码后会自动重新构建，无需手动操作
- 适合频繁修改代码的开发场景

#### 方式二：手动构建（用于验证）

```bash
# 构建 core 包
cd packages/core
pnpm build

# 或者从根目录执行
pnpm --filter @iswangh/element-plus-kit/core build
```

**说明：**
- 手动执行一次构建，验证代码是否正确
- 构建产物会输出到 `packages/core/dist` 目录

### 2. 修改 `packages/form` 源代码

**修改后需要做的操作：**

```bash
# 方式一：watch 模式（推荐）
cd packages/form
pnpm dev

# 方式二：手动构建
cd packages/form
pnpm build
```

**重要提示：**
- 如果 `form` 依赖 `core`，修改 `core` 后需要重新构建 `core`，然后 `form` 才能使用最新版本
- 使用 `workspace:*` 协议时，pnpm 会自动链接本地包，但需要重新构建才能生效

### 3. 修改 `packages/kit` 源代码

**修改后需要做的操作：**

```bash
# 方式一：watch 模式（推荐）
cd packages/kit
pnpm dev

# 方式二：手动构建
cd packages/kit
pnpm build
```

**重要提示：**
- `kit` 依赖 `form`，如果修改了 `form`，需要先重新构建 `form`
- 同样，如果 `form` 依赖的 `core` 有修改，需要按顺序重新构建

---

## 🧪 本地环境测试

### 方法一：使用 Playground（推荐）

Playground 是项目内置的测试环境，使用 `workspace:*` 协议自动链接本地包。

#### 1. 构建依赖的包

```bash
# 如果修改了 core，先构建 core
pnpm --filter @iswangh/element-plus-kit/core build

# 如果修改了 form，先构建 form（会自动使用最新的 core）
pnpm --filter @iswangh/element-plus-kit/form build

# 如果修改了 kit，先构建 kit（会自动使用最新的 form）
pnpm --filter @iswangh/element-plus-kit build
```

#### 2. 启动 Playground 开发服务器

```bash
# 进入 playground 目录
cd playground

# 启动开发服务器
pnpm dev

# 或者从根目录执行
pnpm --filter element-plus-kit-playground dev
```

#### 3. 访问测试页面

- 开发服务器地址：`http://localhost:5173`
- 在浏览器中打开，测试组件功能

#### 4. 实时测试（推荐工作流）

**同时启动多个 watch 模式：**

```bash
# 终端 1：监听 core 变化
pnpm --filter @iswangh/element-plus-kit/core dev

# 终端 2：监听 form 变化
pnpm --filter @iswangh/element-plus-kit/form dev

# 终端 3：监听 kit 变化（如果需要）
pnpm --filter @iswangh/element-plus-kit dev

# 终端 4：启动 playground
pnpm --filter element-plus-kit-playground dev
```

这样修改任何源代码后，会自动重新构建，playground 会自动刷新。

### 方法二：在外部项目中测试

#### 1. 使用 pnpm link（临时测试）

```bash
# 在项目根目录
cd packages/core
pnpm link --global

cd ../form
pnpm link --global

cd ../kit
pnpm link --global

# 在外部测试项目中
cd /path/to/test-project
pnpm link --global @iswangh/element-plus-kit/core
pnpm link --global @iswangh/element-plus-kit/form
pnpm link --global @iswangh/element-plus-kit
```

#### 2. 使用本地路径（临时测试）

在测试项目的 `package.json` 中：

```json
{
  "dependencies": {
    "@iswangh/element-plus-kit/core": "file:../element-plus-kit/packages/core",
    "@iswangh/element-plus-kit/form": "file:../element-plus-kit/packages/form",
    "@iswangh/element-plus-kit": "file:../element-plus-kit/packages/kit"
  }
}
```

然后执行：

```bash
pnpm install
```

---

## 📦 打包和发布到 npm

### 发布顺序

**必须按照以下顺序发布，因为存在依赖关系：**

```
core → form → kit
```

**依赖关系说明：**
- `form` 依赖 `core`
- `kit` 依赖 `form`

### 发布前检查清单

- [ ] 所有代码已提交到 Git
- [ ] 类型检查通过：`pnpm type-check`
- [ ] 代码检查通过：`pnpm lint`
- [ ] 所有包构建成功
- [ ] 版本号已更新（如果需要）

### 发布步骤

#### 1. 清理旧构建

```bash
# 清理所有包的构建产物
pnpm --filter "@iswangh/element-plus-kit/*" clean
```

#### 2. 按顺序构建所有包

```bash
# 第一步：构建 core
pnpm --filter @iswangh/element-plus-kit/core build

# 第二步：构建 form（依赖 core）
pnpm --filter @iswangh/element-plus-kit/form build

# 第三步：构建 kit（依赖 form）
pnpm --filter @iswangh/element-plus-kit build
```

或者使用根目录的构建脚本（会并行构建，但需要确保依赖顺序）：

```bash
# 从根目录构建所有包（包含类型检查）
pnpm build
```

#### 3. 验证构建结果

```bash
# 检查 dist 目录是否存在
ls packages/core/dist
ls packages/form/dist
ls packages/kit/dist

# 检查类型定义文件
ls packages/*/dist/*.d.ts

# 检查样式文件（form 包）
ls packages/form/dist/style.css
```

#### 4. 登录 npm（如果未登录）

```bash
npm login
```

#### 5. 按顺序发布包

```bash
# 第一步：发布 core
cd packages/core
npm publish

# 第二步：发布 form
cd ../form
npm publish

# 第三步：发布 kit
cd ../kit
npm publish
```

或者使用 pnpm 从根目录发布：

```bash
# 发布 core
pnpm --filter @iswangh/element-plus-kit/core publish

# 发布 form
pnpm --filter @iswangh/element-plus-kit/form publish

# 发布 kit
pnpm --filter @iswangh/element-plus-kit publish
```

#### 6. 创建 Git Tag（可选）

```bash
# 创建版本标签
git tag v0.1.0

# 推送标签
git push origin v0.1.0
```

### 发布后验证

#### 1. 检查 npm 包页面

- https://www.npmjs.com/package/@iswangh/element-plus-kit/core
- https://www.npmjs.com/package/@iswangh/element-plus-kit/form
- https://www.npmjs.com/package/@iswangh/element-plus-kit

#### 2. 测试安装

```bash
# 创建临时测试目录
mkdir test-install
cd test-install
npm init -y

# 安装包
npm install @iswangh/element-plus-kit

# 验证安装
ls node_modules/@iswangh/element-plus-kit/
```

---

## 🚀 推荐的日常开发工作流

### 场景 1：修改 core 包

```bash
# 1. 启动 core 的 watch 模式
pnpm --filter @iswangh/element-plus-kit/core dev

# 2. 启动 playground（会自动使用最新的 core）
pnpm --filter element-plus-kit-playground dev

# 3. 修改 core 源代码，自动重新构建
# 4. 在 playground 中测试
```

### 场景 2：修改 form 包

```bash
# 1. 如果 core 有修改，先启动 core 的 watch
pnpm --filter @iswangh/element-plus-kit/core dev

# 2. 启动 form 的 watch 模式
pnpm --filter @iswangh/element-plus-kit/form dev

# 3. 启动 playground
pnpm --filter element-plus-kit-playground dev

# 4. 修改 form 源代码，自动重新构建
# 5. 在 playground 中测试
```

### 场景 3：修改 kit 包

```bash
# 1. 确保 form 和 core 都已构建（或启动 watch）
pnpm --filter @iswangh/element-plus-kit/core dev
pnpm --filter @iswangh/element-plus-kit/form dev

# 2. 启动 kit 的 watch 模式
pnpm --filter @iswangh/element-plus-kit dev

# 3. 启动 playground
pnpm --filter element-plus-kit-playground dev

# 4. 修改 kit 源代码，自动重新构建
# 5. 在 playground 中测试
```

---

## ⚠️ 注意事项

### 1. 依赖关系

- 修改 `core` 后，依赖它的 `form` 需要重新构建
- 修改 `form` 后，依赖它的 `kit` 需要重新构建
- 使用 `workspace:*` 时，pnpm 会自动链接，但需要重新构建才能生效

### 2. 版本号管理

- 发布前记得更新版本号
- 建议使用 [Semantic Versioning](https://semver.org/)
- 可以使用 `changeset` 或 `lerna` 管理版本

### 3. 构建产物

- 构建产物在 `packages/*/dist` 目录
- 发布时只会发布 `dist` 目录和 `README.md`
- 确保 `package.json` 中的 `files` 字段配置正确

### 4. 类型定义

- 构建时会自动生成类型定义文件（`.d.ts`）
- 确保 `tsconfig.json` 中 `declaration: true`
- 发布后用户可以通过 `import type` 使用类型

---

## 📝 快速参考命令

### 构建命令

```bash
# 构建单个包
pnpm --filter @iswangh/element-plus-kit/core build
pnpm --filter @iswangh/element-plus-kit/form build
pnpm --filter @iswangh/element-plus-kit build

# 构建所有包（包含类型检查）
pnpm build

# Watch 模式
pnpm --filter @iswangh/element-plus-kit/core dev
pnpm --filter @iswangh/element-plus-kit/form dev
pnpm --filter @iswangh/element-plus-kit dev
```

### 测试命令

```bash
# 启动 playground
pnpm --filter element-plus-kit-playground dev

# 类型检查
pnpm type-check

# 代码检查
pnpm lint
```

### 发布命令

```bash
# 发布单个包
pnpm --filter @iswangh/element-plus-kit/core publish
pnpm --filter @iswangh/element-plus-kit/form publish
pnpm --filter @iswangh/element-plus-kit publish
```
