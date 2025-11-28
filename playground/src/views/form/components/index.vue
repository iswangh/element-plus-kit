<script setup lang="ts">
import type { FormItems } from '@iswangh/element-plus-kit-form'
import { WForm } from '@iswangh/element-plus-kit'

const form = ref({
  // 输入类组件
  input: '',
  inputNumber: 0,
  inputTag: [],
  autocomplete: '',
  mention: '',
  // 选择类组件
  select: '',
  selectMultiple: [],
  selectV2: '',
  cascader: [],
  treeSelect: '',
  // 日期时间类组件
  datePicker: '',
  datePickerPanel: '',
  timePicker: '',
  timeSelect: '',
  // 其他组件
  checkbox: [],
  radio: '',
  switch: false,
  slider: 0,
  rate: 0,
  colorPicker: '',
  colorPickerPanel: '',
  transfer: [],
})

// 示例 1：输入类组件
const inputFormItems: FormItems = [
  {
    prop: 'input',
    label: '输入框',
    compType: 'input',
    compProps: {
      placeholder: '请输入内容',
    },
  },
  {
    prop: 'inputNumber',
    label: '数字输入框',
    compType: 'input-number',
    compProps: {
      min: 0,
      max: 100,
      step: 1,
    },
  },
  {
    prop: 'inputTag',
    label: '标签输入框',
    compType: 'input-tag',
    compProps: {
      placeholder: '请输入标签',
    },
  },
  {
    prop: 'autocomplete',
    label: '自动完成',
    compType: 'autocomplete',
    compProps: {
      placeholder: '请输入内容',
      fetchSuggestions: (queryString: string, cb: (suggestions: any[]) => void) => {
        const suggestions = [
          { value: '选项1' },
          { value: '选项2' },
          { value: '选项3' },
        ].filter(item => item.value.includes(queryString))
        cb(suggestions)
      },
    },
  },
  {
    prop: 'mention',
    label: '提及',
    compType: 'mention',
    compProps: {
      placeholder: '请输入 @ 提及用户',
      options: [
        { label: '用户1', value: '用户1' },
        { label: '用户2', value: '用户2' },
        { label: '用户3', value: '用户3' },
      ],
    },
  },
]

// 示例 2：选择类组件
const selectFormItems: FormItems = [
  {
    prop: 'select',
    label: '选择器',
    compType: 'select',
    compProps: {
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
        { label: '选项3', value: '3' },
      ],
    },
  },
  {
    prop: 'selectMultiple',
    label: '多选选择器',
    compType: 'select',
    compProps: {
      multiple: true,
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
        { label: '选项3', value: '3' },
        { label: '选项4', value: '4' },
        { label: '选项5', value: '5' },
      ],
    },
  },
  {
    prop: 'selectV2',
    label: '虚拟列表选择器',
    compType: 'select-v2',
    compProps: {
      options: Array.from({ length: 100 }, (_, i) => ({
        label: `选项${i + 1}`,
        value: `${i + 1}`,
      })),
    },
  },
  {
    prop: 'cascader',
    label: '级联选择器',
    compType: 'cascader',
    compProps: {
      options: [
        {
          value: '1',
          label: '选项1',
          children: [
            { value: '1-1', label: '选项1-1' },
            { value: '1-2', label: '选项1-2' },
          ],
        },
        {
          value: '2',
          label: '选项2',
          children: [
            { value: '2-1', label: '选项2-1' },
            { value: '2-2', label: '选项2-2' },
          ],
        },
      ],
    },
  },
  {
    prop: 'treeSelect',
    label: '树形选择器',
    compType: 'tree-select',
    compProps: {
      data: [
        {
          value: '1',
          label: '节点1',
          children: [
            { value: '1-1', label: '节点1-1' },
            { value: '1-2', label: '节点1-2' },
          ],
        },
        {
          value: '2',
          label: '节点2',
          children: [
            { value: '2-1', label: '节点2-1' },
            { value: '2-2', label: '节点2-2' },
          ],
        },
      ],
    },
  },
]

// 示例 3：日期时间类组件
const dateTimeFormItems: FormItems = [
  {
    prop: 'datePicker',
    label: '日期选择器',
    compType: 'date-picker',
    compProps: {
      type: 'date',
      placeholder: '请选择日期',
    },
  },
  {
    prop: 'datePickerPanel',
    label: '日期面板',
    compType: 'date-picker-panel',
    compProps: {
      type: 'date',
    },
  },
  {
    prop: 'timePicker',
    label: '时间选择器',
    compType: 'time-picker',
    compProps: {
      placeholder: '请选择时间',
    },
  },
  {
    prop: 'timeSelect',
    label: '时间选择',
    compType: 'time-select',
    compProps: {
      placeholder: '请选择时间',
    },
  },
]

// 示例 4：其他组件
const otherFormItems: FormItems = [
  {
    prop: 'checkbox',
    label: '复选框组',
    compType: 'checkbox',
    compProps: {
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
        { label: '选项3', value: '3' },
      ],
    },
  },
  {
    prop: 'radio',
    label: '单选框组',
    compType: 'radio',
    compProps: {
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
        { label: '选项3', value: '3' },
      ],
    },
  },
  {
    prop: 'switch',
    label: '开关',
    compType: 'switch',
  },
  {
    prop: 'slider',
    label: '滑块',
    compType: 'slider',
    compProps: {
      min: 0,
      max: 100,
    },
  },
  {
    prop: 'rate',
    label: '评分',
    compType: 'rate',
    compProps: {
      max: 5,
    },
  },
  {
    prop: 'colorPicker',
    label: '颜色选择器',
    compType: 'color-picker',
  },
  {
    prop: 'colorPickerPanel',
    label: '颜色面板',
    compType: 'color-picker-panel',
  },
  {
    prop: 'transfer',
    label: '穿梭框',
    compType: 'transfer',
    compProps: {
      data: Array.from({ length: 10 }, (_, i) => ({
        key: `${i + 1}`,
        label: `选项${i + 1}`,
      })),
    },
  },
]
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <!-- 示例 1：输入类组件 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 1：输入类组件
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：输入类组件包括 <code>input</code>、<code>input-number</code>、<code>input-tag</code>、<code>autocomplete</code>、<code>mention</code> 等。
            </p>
          </template>
        </el-alert>
        <WForm :model="form" :form-items="inputFormItems" label-width="120px" />
      </el-space>
    </el-card>

    <!-- 示例 2：选择类组件 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 2：选择类组件
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：选择类组件包括 <code>select</code>、<code>select-v2</code>、<code>cascader</code>、<code>tree-select</code> 等。
            </p>
          </template>
        </el-alert>
        <WForm :model="form" :form-items="selectFormItems" label-width="120px" />
      </el-space>
    </el-card>

    <!-- 示例 3：日期时间类组件 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 3：日期时间类组件
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：日期时间类组件包括 <code>date-picker</code>、<code>date-picker-panel</code>、<code>time-picker</code>、<code>time-select</code> 等。
            </p>
          </template>
        </el-alert>
        <WForm :model="form" :form-items="dateTimeFormItems" label-width="120px" />
      </el-space>
    </el-card>

    <!-- 示例 4：其他组件 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 4：其他组件
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：其他组件包括 <code>checkbox</code>、<code>radio</code>、<code>switch</code>、<code>slider</code>、<code>rate</code>、<code>color-picker</code>、<code>color-picker-panel</code>、<code>transfer</code> 等。
            </p>
          </template>
        </el-alert>
        <WForm :model="form" :form-items="otherFormItems" label-width="120px" />
      </el-space>
    </el-card>
  </el-space>
</template>
