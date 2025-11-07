# Form 表单组件

动态表单组件，支持通过配置快速生成表单。

## 基础用法

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormItems } from '@iswangh/element-plus-kit'

const form = ref({
  username: '',
  email: '',
})

const formItems: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    comp: 'input',
  },
  {
    prop: 'email',
    label: '邮箱',
    comp: 'input',
  },
]
</script>

<template>
  <WForm :model="form" :form-items="formItems" />
</template>
```

:::

## 更多示例

查看 [Form 组件完整文档](../../../../packages/form/README.md) 了解更多用法。
