# @iswangh/element-plus-kit

Element Plus Kit - 基于 Element Plus 的 Vue 3 组件库。

## ✨ 特性

- 🎨 基于 Element Plus，保持一致的视觉风格
- 📦 支持按需安装，减少包体积
- 🔧 支持多种导入方式：全局导入、手动导入、按需引入
- 💪 完整的 TypeScript 类型支持
- 🎯 组件命名规范：所有组件以 `W` 开头（如 `WForm`、`w-form`）
- 📚 详细的文档和示例

## 📦 安装

### 安装全部组件

```bash
npm install @iswangh/element-plus-kit
```

### 按需安装单个组件

```bash
# 安装 Form 组件
npm install @iswangh/element-plus-kit/form
```

## 🚀 快速开始

### 方式一：全局导入

```typescript
import { createApp } from 'vue'
import ElementPlusKit from '@iswangh/element-plus-kit'

const app = createApp(App)
app.use(ElementPlusKit)
```

```vue
<template>
  <WForm :model="form" :form-items="formItems" />
</template>
```

### 方式二：手动导入

```vue
<script setup lang="ts">
import { WForm } from '@iswangh/element-plus-kit'
import type { FormItems } from '@iswangh/element-plus-kit/form'

const formItems: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    comp: 'input',
  },
]

const form = ref({
  username: '',
})
</script>

<template>
  <WForm :model="form" :form-items="formItems" />
</template>
```

### 方式三：按需引入（推荐）

配置 `unplugin-vue-components` 和 `unplugin-auto-import`：

#### 1. 安装依赖

```bash
npm install -D unplugin-vue-components unplugin-auto-import
```

#### 2. 配置 Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { ElementPlusKitResolver, ElementPlusKitAutoImportResolver } from '@iswangh/element-plus-kit/resolver'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        ElementPlusKitAutoImportResolver(),
      ],
      imports: ['vue'],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        ElementPlusKitResolver(),
      ],
    }),
  ],
})
```

#### 3. 使用组件

```vue
<script setup lang="ts">
// 无需手动导入，组件会自动导入
import type { FormItems } from '@iswangh/element-plus-kit/form'

const formItems: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    comp: 'input',
  },
]

const form = ref({
  username: '',
})
</script>

<template>
  <!-- WForm 会自动导入 -->
  <WForm :model="form" :form-items="formItems" />
</template>
```

## 📚 组件列表

### Form 表单组件

动态表单组件，支持通过配置快速生成表单。

- **包名**: `@iswangh/element-plus-kit/form`
- **组件名**: `WForm`
- **文档**: [Form 组件文档](../form/README.md)

## 🔧 Resolver 配置

### ElementPlusKitResolver

用于 `unplugin-vue-components` 的组件自动导入。

```typescript
import { ElementPlusKitResolver } from '@iswangh/element-plus-kit/resolver'
import Components from 'unplugin-vue-components/vite'

Components({
  resolvers: [
    ElementPlusKitResolver(),
  ],
})
```

### ElementPlusKitAutoImportResolver

用于 `unplugin-auto-import` 的 API 自动导入。

```typescript
import { ElementPlusKitAutoImportResolver } from '@iswangh/element-plus-kit/resolver'
import AutoImport from 'unplugin-auto-import/vite'

AutoImport({
  resolvers: [
    ElementPlusKitAutoImportResolver(),
  ],
})
```

## 📖 API 文档

### 全局安装函数

```typescript
import ElementPlusKit from '@iswangh/element-plus-kit'

app.use(ElementPlusKit)
```

### 组件导出

```typescript
import { WForm } from '@iswangh/element-plus-kit'
```

### 类型导出

```typescript
import type {
  ActionConfig,
  ActionConfigButtonItem,
  Arrayable,
  ColAttrs,
  ElFormAttrs,
  EventExtendedParams,
  FormItem,
  FormItems,
  FormItemSlotScope,
  RowAttrs,
} from '@iswangh/element-plus-kit'
```

## 💡 使用示例

### 基础表单

```vue
<script setup lang="ts">
import { WForm } from '@iswangh/element-plus-kit'
import type { FormItems } from '@iswangh/element-plus-kit/form'

const formItems: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    comp: 'input',
    rules: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
  },
  {
    prop: 'email',
    label: '邮箱',
    comp: 'input',
    compAttrs: {
      type: 'email',
    },
    rules: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
  },
]

const form = ref({
  username: '',
  email: '',
})
</script>

<template>
  <WForm :model="form" :form-items="formItems" />
</template>
```

### 带操作按钮的表单

```vue
<script setup lang="ts">
import { WForm } from '@iswangh/element-plus-kit'
import type { FormItems, ActionConfig } from '@iswangh/element-plus-kit/form'

const formItems: FormItems = [
  {
    prop: 'keyword',
    label: '关键词',
    comp: 'input',
  },
]

const actionConfig: ActionConfig = {
  buttons: ['search', 'reset'],
}

const form = ref({
  keyword: '',
})
</script>

<template>
  <WForm
    :model="form"
    :form-items="formItems"
    :action-config="actionConfig"
    @search="handleSearch"
    @reset="handleReset"
  />
</template>
```

## 🔗 相关链接

- [Form 组件文档](../form/README.md)
- [核心工具包文档](../core/README.md)
- [Element Plus 文档](https://element-plus.org/zh-CN/)
- [GitHub 仓库](https://github.com/iswangh/element-plus-kit)

## 📄 许可证

MIT
