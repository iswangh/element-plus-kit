# 安装

## 环境要求

- **Node.js**: `^20.19.0 || >=22.12.0`
- **Vue**: `^3.5.23`
- **Element Plus**: `^2.11.7`

## 安装步骤

### 1. 安装 Element Plus Kit

```bash
# npm
npm install @iswangh/element-plus-kit

# pnpm
pnpm add @iswangh/element-plus-kit

# yarn
yarn add @iswangh/element-plus-kit
```

### 2. 安装 Element Plus（如果尚未安装）

```bash
# npm
npm install element-plus

# pnpm
pnpm add element-plus

# yarn
yarn add element-plus
```

### 3. 引入样式

**重要说明**：WForm 组件已按需导入了所有内部使用的 Element Plus 组件样式，用户导入组件时样式会自动导入，**无需额外配置**。

如果需要在 CSS 文件中单独导入样式，可以使用：

```typescript
import '@iswangh/element-plus-kit-form/style.css'
```

**注意**：此样式文件已包含 WForm 内部使用的所有 Element Plus 组件样式（按需导入），无需再导入 Element Plus 的全局样式。

## 配置 Element Plus

Element Plus Kit 基于 Element Plus 构建，需要在使用 Element Plus Kit 的项目中配置 Element Plus：

```typescript
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import ElementPlusKit from '@iswangh/element-plus-kit'
import App from './App.vue'
// 注意：WForm 组件已按需导入了所有内部使用的 Element Plus 组件样式，无需导入全局样式

const app = createApp(App)

// 配置 Element Plus 使用中文
app.use(ElementPlus, {
  locale: zhCn,
})

// 注册 Element Plus Kit
app.use(ElementPlusKit)

app.mount('#app')
```

## 按需引入配置

如果需要按需引入组件，需要安装额外的依赖：

```bash
# npm
npm install -D unplugin-vue-components unplugin-auto-import

# pnpm
pnpm add -D unplugin-vue-components unplugin-auto-import

# yarn
yarn add -D unplugin-vue-components unplugin-auto-import
```

然后配置 Vite（参考 [快速开始](/guide/getting-started)）。
