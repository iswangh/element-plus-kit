<script setup lang="ts">
import type { FormItems, RowAttrs } from '@iswangh/element-plus-kit-form'

const form = ref({})
const useColumnLayout = ref(false)

// 默认 inline 布局（无分栏）
const defaultFormItems: FormItems = [
  {
    prop: 'name',
    label: '姓名',
    comp: 'input',
  },
  {
    prop: 'age',
    label: '年龄',
    comp: 'input-number',
    compAttrs: {
      min: 0,
      max: 120,
    },
  },
  {
    prop: 'email',
    label: '邮箱',
    comp: 'input',
    compAttrs: {
      type: 'email',
    },
  },
  {
    prop: 'phone',
    label: '手机号',
    comp: 'input',
  },
  {
    prop: 'gender',
    label: '性别',
    comp: 'select',
    compAttrs: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
    },
  },
  {
    prop: 'birthday',
    label: '生日',
    comp: 'date-picker',
    compAttrs: {
      type: 'date',
    },
  },
]

// 分栏布局的 inline 表单项
const columnFormItems: FormItems = [
  {
    prop: 'name',
    label: '姓名',
    comp: 'input',
    colAttrs: {
      span: 6,
    },
  },
  {
    prop: 'age',
    label: '年龄',
    comp: 'input-number',
    colAttrs: {
      span: 6,
    },
    compAttrs: {
      min: 0,
      max: 120,
    },
  },
  {
    prop: 'email',
    label: '邮箱',
    comp: 'input',
    colAttrs: {
      span: 6,
    },
    compAttrs: {
      type: 'email',
    },
  },
  {
    prop: 'phone',
    label: '手机号',
    comp: 'input',
    colAttrs: {
      span: 6,
    },
  },
  {
    prop: 'gender',
    label: '性别',
    comp: 'select',
    colAttrs: {
      span: 6,
    },
    compAttrs: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
    },
  },
  {
    prop: 'birthday',
    label: '生日',
    comp: 'date-picker',
    colAttrs: {
      span: 6,
    },
    compAttrs: {
      type: 'date',
    },
  },
  {
    prop: 'address',
    label: '地址',
    comp: 'input',
    colAttrs: {
      span: 12,
    },
  },
  {
    prop: 'remark',
    label: '备注',
    comp: 'input',
    colAttrs: {
      span: 12,
    },
  },
]

const formItems = computed(() => useColumnLayout.value ? columnFormItems : defaultFormItems)

const rowAttrs: RowAttrs = {
  gutter: 20,
}
</script>

<template>
  <el-card class="w-full" shadow="hover">
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          一行展示布局（Inline）
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
            {{ useColumnLayout ? '使用 inline 属性配合 colAttrs 配置，表单项在一行内按指定列数分布' : '使用 inline 属性，表单项在一行内展示，适合字段较少的场景' }}
          </p>
        </template>
      </el-alert>
      <WForm
        :model="form"
        :form-items="formItems"
        :row-attrs="useColumnLayout ? rowAttrs : undefined"
        inline
      />
    </el-space>
  </el-card>
</template>
