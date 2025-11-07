# Element Plus Kit Monorepo

Element Plus Kit 是一个基于 Element Plus 的 Vue 3 组件库 Monorepo 项目，提供高质量的组件和工具函数。

## 📋 项目介绍

Element Plus Kit 是一个 Monorepo 项目，包含以下包：

- **`@iswangh/element-plus-kit/core`** - 核心工具函数包，提供组件库内部使用的通用工具函数
- **`@iswangh/element-plus-kit/form`** - 表单组件包，提供动态表单组件
- **`@iswangh/element-plus-kit`** - 主包，聚合所有组件和工具，提供统一的入口

### 核心功能

- 🎨 基于 Element Plus，保持一致的视觉风格
- 📦 支持按需安装，减少包体积
- 🔧 支持多种导入方式：全局导入、手动导入、按需引入
- 💪 完整的 TypeScript 类型支持
- 🎯 组件命名规范：所有组件以 `W` 开头（如 `WForm`、`w-form`）
- 📚 详细的文档和示例

### 应用场景

- 企业级后台管理系统
- 数据展示和表单处理应用
- 需要快速构建表单的 Vue 3 项目

## 🛠 技术栈说明

### 核心技术

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具
- **Element Plus** - 基于 Vue 3 的组件库

### 关键依赖版本

- Vue: `^3.5.23`
- TypeScript: `^5.9.2`
- Vite: `^7.1.5`
- Element Plus: `^2.11.7`

### 开发工具

- **pnpm** - 快速、节省磁盘空间的包管理器
- **ESLint** - 代码质量检查工具（基于 @antfu/eslint-config）
- **vue-tsc** - Vue 3 的 TypeScript 类型检查工具
- **Husky** - Git Hooks 工具
- **Commitlint** - 提交信息规范检查

## 📁 目录结构说明

```
element-plus-kit/
├── packages/              # 包目录
│   ├── core/             # 核心工具函数包
│   │   ├── src/          # 源代码
│   │   ├── dist/         # 构建产物
│   │   ├── package.json  # 包配置
│   │   ├── tsconfig.json # TypeScript 配置
│   │   └── vite.config.ts # Vite 构建配置
│   ├── form/             # 表单组件包
│   │   ├── src/          # 源代码
│   │   ├── dist/         # 构建产物
│   │   ├── package.json  # 包配置
│   │   ├── tsconfig.json # TypeScript 配置
│   │   └── vite.config.ts # Vite 构建配置
│   └── kit/              # 主包
│       ├── src/          # 源代码
│       ├── dist/         # 构建产物
│       ├── package.json  # 包配置
│       ├── tsconfig.json # TypeScript 配置
│       └── vite.config.ts # Vite 构建配置
├── playground/           # 本地开发测试环境
│   ├── src/              # 示例代码
│   └── vite.config.ts    # Vite 开发配置
├── docs/                 # 文档目录
│   ├── development/      # 开发文档（按功能模块划分）
│   └── guide/            # 使用指南（按功能模块划分）
├── package.json          # 根目录包配置
├── pnpm-workspace.yaml   # pnpm workspace 配置
├── tsconfig.json         # TypeScript 项目引用配置
└── tsconfig.app.json     # TypeScript 基础配置
```

### 包依赖关系

```
core (独立包)
  ↓
form (依赖 core)
  ↓
kit (依赖 form 和 core)
```

## 🚀 快速开始

### 环境要求

- **Node.js**: `^20.19.0 || >=22.12.0`（推荐使用 Volta 管理版本）
- **包管理器**: pnpm（必须）
- **操作系统**: Windows、macOS、Linux

### 安装步骤

1. **克隆项目**

```bash
git clone <repository-url>
cd element-plus-kit
```

2. **安装依赖**

```bash
pnpm install
```

3. **验证环境**

```bash
# 检查 Node.js 版本（Volta 会自动切换）
node --version

# 检查 pnpm 版本
pnpm --version
```

### 开发环境启动

**启动开发服务器**

```bash
pnpm dev
```

这将：
- 并行启动所有包的 watch 模式（自动监听文件变化并重新构建）
- 启动 playground 开发服务器（可在浏览器中查看和测试组件）

**说明**：
- Playground 通过别名直接使用包源码，支持 HMR（热模块替换）
- 包的 watch 模式会在后台自动构建，保持 `dist` 目录同步
- 修改包代码后，playground 会自动更新，无需手动刷新

**单独运行**（可选）：

```bash
# 只启动包的 watch 模式
pnpm dev:packages

# 只启动 playground 开发服务器
pnpm dev:playground

# 构建所有包（一次性构建，不监听）
pnpm build:packages
```

### 配置 Element Plus

Element Plus Kit 基于 Element Plus 构建，在使用 Element Plus Kit 的项目中需要配置 Element Plus 的全局属性（如语言、尺寸等）。

**配置中文语言**：

```typescript
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import ElementPlusKit from '@iswangh/element-plus-kit'
import 'element-plus/dist/index.css'

const app = createApp(App)

// 配置 Element Plus 使用中文
app.use(ElementPlus, {
  locale: zhCn,
})

// 注册 Element Plus Kit
app.use(ElementPlusKit)

app.mount('#app')
```

更多配置说明请参考 [Element Plus Kit 文档](./packages/kit/README.md#%EF%B8%8F-配置-element-plus)

> **重要**：Element Plus 的全局配置应在使用 Element Plus Kit 的项目中处理，而不是在组件库包中。这样可以保持组件库的灵活性，让不同的项目根据自身需求进行配置。

### 构建和部署

1. **类型检查 + 构建所有包**

```bash
pnpm build
```

2. **单独构建某个包**

```bash
# 构建 core 包
cd packages/core && pnpm build

# 构建 form 包
cd packages/form && pnpm build

# 构建 kit 包
cd packages/kit && pnpm build
```

3. **发布包**

```bash
# 发布单个包（按依赖顺序）
pnpm publish:core
pnpm publish:form
pnpm publish:kit

# 或发布所有包
pnpm publish:all
```

## 📖 开发指南

### 代码规范

- **代码风格**: 遵循 ESLint 配置（基于 @antfu/eslint-config）
- **提交规范**: 遵循 Conventional Commits 格式
- **类型安全**: 启用 TypeScript 严格模式
- **注释规范**: 公共 API 必须使用 JSDoc 注释

### 开发工作流

1. **创建功能分支**

```bash
git checkout -b feat/your-feature-name
```

2. **开发代码**

```bash
# 启动完整开发环境（推荐）
pnpm dev

# 或单独启动某个包的 watch 模式
cd packages/core && pnpm dev
```

3. **代码检查**

```bash
# 检查代码规范
pnpm lint

# 自动修复可修复的问题
pnpm lint:fix

# 类型检查
pnpm type-check
```

4. **提交代码**

```bash
# 提交信息格式：<type>(<scope>): <subject>
git commit -m "feat(form): 添加新的表单组件"
```

### 常用命令

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm build:packages

# 类型检查 + 构建
pnpm build

# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 修复代码问题
pnpm lint:fix

# 开发模式（并行启动包的 watch 模式和 playground）
pnpm dev

# 单独启动包的 watch 模式
pnpm dev:packages

# 单独启动 playground 开发服务器
pnpm dev:playground
```

## 📚 文档

- **使用指南**: 查看各包的 README.md
  - [主包文档](./packages/kit/README.md)
  - [Form 组件文档](./packages/form/README.md)
  - [核心工具包文档](./packages/core/README.md)
- **开发文档**: 查看 `docs/development/` 目录
  - [开发文档索引](./docs/development/README.md)
  - [Core 包开发文档](./docs/development/core.md)
  - [Form 包开发文档](./docs/development/form.md)
  - [Kit 包开发文档](./docs/development/kit.md)
- **使用指南**: 查看 `docs/guide/` 目录（待完善）

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feat/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feat/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 [Apache License 2.0](LICENSE) 开源协议。

### 许可证说明

- **许可证类型**：Apache License 2.0
- **许可证文件**：[LICENSE](./LICENSE)
- **官方链接**：https://www.apache.org/licenses/LICENSE-2.0

### 主要权利

- ✅ **商业使用**：允许商业使用
- ✅ **修改**：允许修改代码
- ✅ **分发**：允许分发代码
- ✅ **专利授权**：提供专利授权保护
- ✅ **私有使用**：允许私有使用

### 主要义务

- 📝 **保留版权声明**：必须保留原始版权声明
- 📝 **包含许可证**：分发时必须包含 LICENSE 文件
- 📝 **标注修改**：修改的文件需要标注变更

### 免责声明

本软件按"原样"提供，不提供任何明示或暗示的担保。

## 🔗 相关链接

- [Element Plus 文档](https://element-plus.org/zh-CN/)
- [Vue 3 文档](https://cn.vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/zh/)
