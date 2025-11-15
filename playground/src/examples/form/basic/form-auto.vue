<script setup lang="ts">
// 不导入，依赖 unplugin-vue-components 自动导入
import type { FormItems } from '@iswangh/element-plus-kit-form'
import { ref } from 'vue'

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

const form = ref({})
</script>

<template>
  <el-card class="example-container" shadow="hover">
    <template #header>
      <h2 class="example-title m-0">
        自动导入测试
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
            使用 unplugin-vue-components 自动导入组件，无需手动导入
          </p>
        </template>
      </el-alert>
      <WForm :model="form" :form-items="formItems" />
    </el-space>
  </el-card>
</template>
