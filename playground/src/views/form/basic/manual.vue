<script setup lang="ts">
// ref 会自动导入，无需手动导入
import type { FormItems } from '@iswangh/element-plus-kit-form'
import { WForm } from '@iswangh/element-plus-kit'

const formItems = [
  {
    prop: 'username',
    label: '用户名',
    comp: 'input',
  },
  {
    prop: 'age',
    label: '年龄',
    comp: 'input-number',
    compProps: {
      min: 0,
      max: 120,
    },
  },
] satisfies FormItems

const form = ref({
  username: '',
  age: 0,
})
</script>

<template>
  <el-card class="w-full" shadow="hover">
    <template #header>
      <h2 class="text-lg text-gray-800 font-semibold m-0">
        手动导入测试
      </h2>
    </template>
    <el-space class="w-full" direction="vertical" :size="20" fill>
      <el-alert
        type="info"
        :closable="false"
        show-icon
      >
        <template #default>
          <p class="text-sm text-gray-600 m-0">
            从主包手动导入组件
          </p>
        </template>
      </el-alert>
      <WForm :model="form" :form-items="formItems" />
    </el-space>
  </el-card>
</template>
