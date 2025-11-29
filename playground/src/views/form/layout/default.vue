<script setup lang="ts">
import type { FormItems } from '@iswangh/element-plus-kit-form'

const form = ref({})
const useColumnLayout = ref(false)

// 默认配置的表单项（无分栏）
const defaultFormItems: FormItems = [
  {
    prop: 'name',
    label: '姓名',
    compType: 'input',
  },
  {
    prop: 'age',
    label: '年龄',
    compType: 'input-number',
    compProps: {
      min: 0,
      max: 120,
    },
  },
  {
    prop: 'email',
    label: '邮箱',
    compType: 'input',
    compProps: {
      type: 'email',
    },
  },
  {
    prop: 'phone',
    label: '手机号',
    compType: 'input',
  },
  {
    prop: 'address',
    label: '地址',
    compType: 'input',
  },
]

// 分栏布局的表单项
const columnFormItems: FormItems = [
  {
    prop: 'name',
    label: '姓名',
    compType: 'input',
    colProps: {
      span: 12,
    },
  },
  {
    prop: 'age',
    label: '年龄',
    compType: 'input-number',
    colProps: {
      span: 12,
    },
    compProps: {
      min: 0,
      max: 120,
    },
  },
  {
    prop: 'email',
    label: '邮箱',
    compType: 'input',
    colProps: {
      span: 12,
    },
    compProps: {
      type: 'email',
    },
  },
  {
    prop: 'phone',
    label: '手机号',
    compType: 'input',
    colProps: {
      span: 12,
    },
  },
  {
    prop: 'address',
    label: '地址',
    compType: 'input',
    colProps: {
      span: 24,
    },
  },
]

const formItems = computed(() => useColumnLayout.value ? columnFormItems : defaultFormItems)

const rowProps = {
  gutter: 20,
}
</script>

<template>
  <el-card class="w-full" shadow="hover">
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          默认布局
        </h2>
        <el-switch
          v-model="useColumnLayout"
          active-text="分栏布局"
          inactive-text="默认布局"
        />
      </div>
    </template>
    <el-space class="w-full" direction="vertical" :size="20" fill>
      <el-alert
        type="info"
        :closable="false"
        show-icon
      >
        <template #default>
          <p class="text-sm text-gray-600 m-0">
            {{ useColumnLayout ? '通过 rowProps 和 colProps 配置布局，每个表单项占据指定的列数（span）' : '默认配置不使用分栏布局，表单项垂直排列' }}
          </p>
        </template>
      </el-alert>
      <WForm
        :model="form"
        :form-items="formItems"
        :row-props="useColumnLayout ? rowProps : undefined"
      />
    </el-space>
  </el-card>
</template>
