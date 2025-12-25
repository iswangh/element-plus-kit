<script setup lang="ts">
// 不导入，依赖 unplugin-auto-import 和 unplugin-vue-components 自动导入
// Vue API（ref、computed、watch 等）和 Vue Router API（useRoute、useRouter 等）会自动导入
// Element Plus 组件和 Element Plus Kit 组件也会自动导入
import type { FormItems } from '@iswangh/element-plus-kit'

const formItems: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    compType: 'input',
  },
  {
    prop: 'email',
    label: '邮箱',
    compType: 'input',
    compProps: {
      type: 'email',
    },
  },
]

const form = ref({})
</script>

<template>
  <el-card class="w-full" shadow="hover">
    <template #header>
      <h2 class="text-lg text-gray-800 font-semibold m-0">
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
          <p class="text-sm text-gray-600 m-0">
            使用 unplugin-vue-components 自动导入组件，无需手动导入
          </p>
        </template>
      </el-alert>
      <WForm :model="form" :form-items="formItems" />
    </el-space>
  </el-card>
</template>
