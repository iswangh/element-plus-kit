<script setup lang="ts">
import type { FormItems } from '@iswangh/element-plus-kit-form'
import { WForm } from '@iswangh/element-plus-kit'

const form = ref({
  hasAccount: false,
  accountType: '',
  username: '',
  email: '',
  phone: '',
  company: '',
  license: '',
})

// 示例 1：vIf 布尔值
const formItems1: FormItems = [
  {
    prop: 'hasAccount',
    label: '已有账号',
    comp: 'switch',
  },
  {
    prop: 'username',
    label: '用户名',
    comp: 'input',
    vIf: () => form.value.hasAccount,
  },
  {
    prop: 'email',
    label: '邮箱',
    comp: 'input',
    compProps: {
      type: 'email',
    },
    vIf: () => form.value.hasAccount,
  },
]

// 示例 2：vIf 函数模式（根据表单数据动态显示）
const formItems2: FormItems = [
  {
    prop: 'accountType',
    label: '账号类型',
    comp: 'select',
    compProps: {
      options: [
        { label: '个人', value: 'personal' },
        { label: '企业', value: 'company' },
      ],
    },
  },
  {
    prop: 'username',
    label: '用户名',
    comp: 'input',
    vIf: data => data.accountType === 'personal',
  },
  {
    prop: 'email',
    label: '邮箱',
    comp: 'input',
    compProps: {
      type: 'email',
    },
    vIf: data => data.accountType === 'personal',
  },
  {
    prop: 'company',
    label: '公司名称',
    comp: 'input',
    vIf: data => data.accountType === 'company',
  },
  {
    prop: 'license',
    label: '营业执照号',
    comp: 'input',
    vIf: data => data.accountType === 'company',
  },
]

// 示例 3：vIf 链式依赖
const formItems3: FormItems = [
  {
    prop: 'hasAccount',
    label: '已有账号',
    comp: 'switch',
  },
  {
    prop: 'username',
    label: '用户名',
    comp: 'input',
    vIf: data => !!data.hasAccount,
  },
  {
    prop: 'email',
    label: '邮箱',
    comp: 'input',
    compProps: {
      type: 'email',
    },
    vIf: data => !!data.hasAccount && !!data.username,
  },
  {
    prop: 'phone',
    label: '手机号',
    comp: 'input',
    vIf: data => !!data.hasAccount && !!data.username && !!data.email,
  },
]
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <!-- 示例 1：vIf 布尔值 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 1：vIf 布尔值
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：使用函数返回布尔值控制字段的显示/隐藏。当"已有账号"开关为开启时，用户名和邮箱字段才会显示。
            </p>
          </template>
        </el-alert>
        <WForm :model="form" :form-items="formItems1" label-width="100px" />
      </el-space>
    </el-card>

    <!-- 示例 2：vIf 函数模式（根据表单数据动态显示） -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 2：vIf 函数模式（根据表单数据动态显示）
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：根据"账号类型"选择不同的字段显示。选择"个人"时显示用户名和邮箱，选择"企业"时显示公司名称和营业执照号。
            </p>
          </template>
        </el-alert>
        <WForm :model="form" :form-items="formItems2" label-width="100px" />
      </el-space>
    </el-card>

    <!-- 示例 3：vIf 链式依赖 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 3：vIf 链式依赖
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：字段之间形成链式依赖关系。只有在前一个字段有值的情况下，后一个字段才会显示。
            </p>
          </template>
        </el-alert>
        <WForm :model="form" :form-items="formItems3" label-width="100px" />
      </el-space>
    </el-card>
  </el-space>
</template>
