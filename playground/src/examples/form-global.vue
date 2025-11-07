<script setup lang="ts">
import type { FormItems } from '@iswangh/element-plus-kit/form'
import { ref } from 'vue'

// 全局注册（在 main.ts 中调用）
// const app = createApp(App)
// app.use(ElementPlusKit)

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
    compAttrs: {
      type: 'email',
    },
  },
]

const form = ref({
  username: '',
  email: '',
})
</script>

<template>
  <div class="test-container">
    <h2>全局导入测试</h2>
    <p>使用全局注册的方式导入组件</p>
    <WForm :model="form" :form-items="formItems" />
  </div>
</template>

<style scoped>
.test-container {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>
