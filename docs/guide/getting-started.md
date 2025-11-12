# 快速开始

## 安装

使用你喜欢的包管理器安装：

```bash
# npm
npm install @iswangh/element-plus-kit

# pnpm
pnpm add @iswangh/element-plus-kit

# yarn
yarn add @iswangh/element-plus-kit
```

## 引入样式

**重要说明**：WForm 组件已按需导入了所有内部使用的 Element Plus 组件样式，用户导入组件时样式会自动导入，**无需额外配置**。

如果用户需要单独导入样式文件（例如在 CSS 文件中导入），可以使用：

```typescript
import '@iswangh/element-plus-kit-form/style.css'
```

**注意**：此样式文件已包含 WForm 内部使用的所有 Element Plus 组件样式，无需再导入 Element Plus 的全局样式。

## 使用方式

### 方式一：全局导入

在 `main.ts` 中配置：

```typescript
import { createApp } from 'vue'
import ElementPlusKit from '@iswangh/element-plus-kit'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlusKit)
app.mount('#app')
```

然后在组件中直接使用：

```vue
<template>
  <WForm :model="form" :form-items="formItems" />
</template>
```

### 方式二：手动导入

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WForm } from '@iswangh/element-plus-kit'
import type { FormItems } from '@iswangh/element-plus-kit'

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

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { ElementPlusKitResolver } from '@iswangh/element-plus-kit/resolver'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        ElementPlusKitResolver(),
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

然后就可以直接使用组件，无需手动导入：

```vue
<template>
  <WForm :model="form" :form-items="formItems" />
</template>
```
