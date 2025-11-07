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

```typescript
import '@iswangh/element-plus-kit-form/style.css'
```

## 使用方式

### 方式一：全局导入

```vue
<script setup lang="ts">
import { createApp } from 'vue'
import ElementPlusKit from '@iswangh/element-plus-kit'

const app = createApp(App)
app.use(ElementPlusKit)
</script>

<template>
  <WForm :model="form" :form-items="formItems" />
</template>
```

### 方式二：手动导入

```vue
<script setup lang="ts">
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
