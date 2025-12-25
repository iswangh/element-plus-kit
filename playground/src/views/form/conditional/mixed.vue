<script setup lang="ts">
import type { FormItems } from '@iswangh/element-plus-kit'
import { WForm } from '@iswangh/element-plus-kit'

const form = ref({
  hasAccount: false,
  accountType: '',
  username: '',
  email: '',
  phone: '',
  showAdvanced: false,
  advancedOption: '',
})

// 示例：vIf 和 vShow 混合使用
const formItems: FormItems = [
  {
    prop: 'hasAccount',
    label: '已有账号',
    compType: 'switch',
  },
  {
    prop: 'accountType',
    label: '账号类型',
    compType: 'select',
    compProps: {
      options: [
        { label: '个人', value: 'personal' },
        { label: '企业', value: 'company' },
      ],
    },
    vIf: data => !!data.hasAccount,
  },
  {
    prop: 'username',
    label: '用户名',
    compType: 'input',
    vIf: data => !!data.hasAccount && !!data.accountType,
  },
  {
    prop: 'email',
    label: '邮箱',
    compType: 'input',
    compProps: {
      type: 'email',
    },
    vShow: data => data.accountType === 'personal',
  },
  {
    prop: 'phone',
    label: '手机号',
    compType: 'input',
    vShow: data => data.accountType === 'company',
  },
  {
    prop: 'showAdvanced',
    label: '显示高级选项',
    compType: 'switch',
    vIf: data => !!data.hasAccount && !!data.accountType && !!data.username,
  },
  {
    prop: 'advancedOption',
    label: '高级选项',
    compType: 'input',
    vShow: data => !!data.showAdvanced,
  },
]
</script>

<template>
  <el-card class="w-full" shadow="hover">
    <template #header>
      <h2 class="text-lg text-gray-800 font-semibold m-0">
        vIf 和 vShow 混合使用
      </h2>
    </template>
    <el-space class="w-full" direction="vertical" :size="20" fill>
      <el-alert type="info" :closable="false" show-icon>
        <template #default>
          <p class="text-sm text-gray-600 m-0">
            说明：可以在同一个表单中混合使用 <code>vIf</code> 和 <code>vShow</code>。<br>
            • 使用 <code>vIf</code> 控制主要字段的显示（如账号类型、用户名等）<br>
            • 使用 <code>vShow</code> 控制次要字段的显示（如邮箱、手机号等）<br>
            • 根据业务需求选择合适的条件渲染方式
          </p>
        </template>
      </el-alert>
      <WForm :model="form" :form-items="formItems" label-width="100px" />
    </el-space>
  </el-card>
</template>
