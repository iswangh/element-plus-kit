<script setup lang="ts">
import type { FormItems } from '@iswangh/element-plus-kit-form'
import { WForm } from '@iswangh/element-plus-kit'

const form = ref({
  showAdvanced: false,
  accountType: '',
  username: '',
  email: '',
  phone: '',
  advancedOption1: '',
  advancedOption2: '',
})

// 示例 1：vShow 布尔值
const formItems1: FormItems = [
  {
    prop: 'showAdvanced',
    label: '显示高级选项',
    comp: 'switch',
  },
  {
    prop: 'username',
    label: '用户名',
    comp: 'input',
  },
  {
    prop: 'email',
    label: '邮箱',
    comp: 'input',
    compProps: {
      type: 'email',
    },
  },
  {
    prop: 'advancedOption1',
    label: '高级选项1',
    comp: 'input',
    vShow: () => form.value.showAdvanced,
  },
  {
    prop: 'advancedOption2',
    label: '高级选项2',
    comp: 'input',
    vShow: () => form.value.showAdvanced,
  },
]

// 示例 2：vShow 函数模式（根据表单数据动态显示）
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
  },
  {
    prop: 'email',
    label: '邮箱',
    comp: 'input',
    compProps: {
      type: 'email',
    },
    vShow: data => data.accountType === 'personal',
  },
  {
    prop: 'phone',
    label: '手机号',
    comp: 'input',
    vShow: data => data.accountType === 'company',
  },
]

// 示例 3：vShow 与 vIf 的区别
const formItems3: FormItems = [
  {
    prop: 'username',
    label: '用户名（vIf）',
    comp: 'input',
    vIf: () => form.value.showAdvanced,
  },
  {
    prop: 'email',
    label: '邮箱（vShow）',
    comp: 'input',
    compProps: {
      type: 'email',
    },
    vShow: () => form.value.showAdvanced,
  },
]
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <!-- 示例 1：vShow 布尔值 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 1：vShow 布尔值
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：使用 <code>vShow</code> 控制字段的显示/隐藏。与 <code>vIf</code> 不同，<code>vShow</code> 使用 <code>v-show</code> 指令，字段始终存在于 DOM 中，只是通过 CSS 控制显示/隐藏。
            </p>
          </template>
        </el-alert>
        <WForm :model="form" :form-items="formItems1" label-width="100px" />
      </el-space>
    </el-card>

    <!-- 示例 2：vShow 函数模式 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 2：vShow 函数模式（根据表单数据动态显示）
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：根据"账号类型"选择不同的字段显示。选择"个人"时显示邮箱，选择"企业"时显示手机号。
            </p>
          </template>
        </el-alert>
        <WForm :model="form" :form-items="formItems2" label-width="100px" />
      </el-space>
    </el-card>

    <!-- 示例 3：vShow 与 vIf 的区别 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 3：vShow 与 vIf 的区别
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="warning" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              <strong>vIf 与 vShow 的区别：</strong><br>
              • <code>vIf</code>：条件为 false 时，元素不会渲染到 DOM 中（完全移除）<br>
              • <code>vShow</code>：条件为 false 时，元素仍然存在于 DOM 中，只是通过 CSS <code>display: none</code> 隐藏<br>
              • <code>vIf</code> 适合频繁切换的场景，<code>vShow</code> 适合需要保持 DOM 结构的场景
            </p>
          </template>
        </el-alert>
        <div class="mb-4">
          <el-switch
            v-model="form.showAdvanced"
            active-text="显示高级选项"
            inactive-text="隐藏高级选项"
          />
        </div>
        <WForm :model="form" :form-items="formItems3" label-width="100px" />
      </el-space>
    </el-card>
  </el-space>
</template>
