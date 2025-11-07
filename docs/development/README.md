# 开发文档

本文档目录包含 Element Plus Kit Monorepo 项目中各个包的详细开发配置说明。

---

## 📋 文档目录

### 包开发文档

- **[Core 包开发文档](./core.md)** - `@iswangh/element-plus-kit-core` 包的完整开发配置说明
- **[Form 包开发文档](./form.md)** - `@iswangh/element-plus-kit-form` 包的完整开发配置说明
- **[Kit 包开发文档](./kit.md)** - `@iswangh/element-plus-kit` 包的完整开发配置说明

---

## 📦 包说明

### Core 包

**包名**：`@iswangh/element-plus-kit-core`

**定位**：核心工具函数包，提供组件库内部使用的通用工具函数。

**特点**：
- 纯 TypeScript 工具函数包
- 不包含 Vue 组件
- 无运行时依赖（除 Vue 作为 peer dependency）

**文档**：[查看 Core 包开发文档](./core.md)

---

### Form 包

**包名**：`@iswangh/element-plus-kit-form`

**定位**：表单组件包，提供动态表单组件。

**特点**：
- 包含 Vue 组件（`.vue` 文件）
- 依赖 Core 包
- 包含样式文件

**文档**：[查看 Form 包开发文档](./form.md)

---

### Kit 包

**包名**：`@iswangh/element-plus-kit`

**定位**：主包，聚合所有组件和工具，提供统一的入口。

**特点**：
- 聚合包（Aggregation Package）
- 重新导出各个子包的功能
- 提供全局安装函数和 Resolver 配置工具
- 最小化源代码，不包含业务组件源代码

**文档**：[查看 Kit 包开发文档](./kit.md)

---

## 🚀 开发命令

### 根目录命令

在项目根目录下，可以使用以下命令进行开发：

```bash
# 启动完整开发环境（推荐）
# 并行启动所有包的 watch 模式和 playground 开发服务器
pnpm dev

# 单独启动包的 watch 模式
# 所有包会监听文件变化并自动重新构建
pnpm dev:packages

# 单独启动 playground 开发服务器
# 用于在浏览器中查看和测试组件
pnpm dev:playground

# 构建所有包（一次性构建，不监听）
pnpm build:packages

# 类型检查 + 构建所有包
pnpm build

# 类型检查
pnpm type-check
```

### 包内命令

在各个包目录下，可以使用以下命令：

```bash
# 进入包目录
cd packages/core  # 或 packages/form、packages/kit

# 启动 watch 模式（监听文件变化并自动重新构建）
pnpm dev

# 构建生产版本
pnpm build

# 类型检查
pnpm type-check
```

### 开发工作流

1. **启动开发环境**：
   ```bash
   pnpm dev
   ```
   - 这会并行启动所有包的 watch 模式和 playground 开发服务器
   - Playground 通过别名直接使用包源码，支持 HMR

2. **修改包代码**：
   - 包的 watch 模式会自动检测变化并重新构建
   - Playground 会通过 HMR 自动更新，无需手动刷新

3. **查看效果**：
   - 浏览器访问 playground 开发服务器地址（通常是 `http://localhost:5173`）
   - 修改代码后立即看到效果

---

## 🔗 相关资源

- [项目 README](../../README.md) - 项目概览和快速开始指南
- [使用指南](../guide/) - 组件使用指南（待完善）

---

**文档维护者**：Element Plus Kit 团队  
**最后更新**：2024年
