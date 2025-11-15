<script setup lang="ts">
import type { FormItems } from '@iswangh/element-plus-kit-form'
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
  <el-card class="example-container" shadow="hover">
    <template #header>
      <h2 class="example-title m-0">
        全局导入测试
      </h2>
    </template>
    <el-space class="w-full" direction="vertical" :size="20" fill>
      <el-alert
        type="info"
        :closable="false"
        show-icon
      >
        <template #default>
          <p class="example-description m-0">
            使用全局注册的方式导入组件
          </p>
        </template>
      </el-alert>
      <WForm :model="form" :form-items="formItems" />
    </el-space>
  </el-card>
</template>
