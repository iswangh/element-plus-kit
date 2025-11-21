<script setup lang="ts">
// ref 会自动导入，无需手动导入
import type { FormItems } from '@iswangh/element-plus-kit'

const form = ref({})

const formItems: FormItems = [
  {
    prop: 'priority',
    label: '优先级',
    comp: 'select',
    compAttrs: {
      // 对象模式：基础用法
      options: {
        loader: () => {
          // 可以在这里进行异步操作
          return [
            { label: '高', value: 'high' },
            { label: '中', value: 'medium' },
            { label: '低', value: 'low' },
          ]
        },
        immediate: true, // 立即加载
      },
    },
  },
  {
    prop: 'tags',
    label: '标签',
    comp: 'select',
    compAttrs: {
      // 对象模式：接收 formData 参数，使用 deps 配置表单字段依赖
      options: {
        loader: (formData) => {
          // 可以根据表单数据动态返回选项
          const priority = formData.priority as string | undefined
          if (priority === 'high') {
            return [
              { label: '紧急', value: 'urgent' },
              { label: '重要', value: 'important' },
            ]
          }
          return [
            { label: '普通', value: 'normal' },
            { label: '次要', value: 'minor' },
          ]
        },
        deps: ['priority'], // 表单字段依赖：依赖优先级字段
        immediate: true, // 立即加载
      },
    },
  },
]

function onChange(extendedParams: any, value: any) {
  console.log('onChange', extendedParams.prop, value)
}
</script>

<template>
  <el-card class="w-full" shadow="hover">
    <template #header>
      <h2 class="text-lg text-gray-800 font-semibold m-0">
        对象模式测试
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
            使用对象模式配置选项加载：<br>
            优先级：对象模式（immediate: true） | 标签：对象模式（deps: ['priority'], immediate: true）
          </p>
        </template>
      </el-alert>
      <WForm :model="form" :form-items="formItems" @change="onChange" />
      <el-card class="w-full" shadow="never">
        <template #header>
          <h3 class="text-base text-gray-800 font-semibold m-0">
            表单数据
          </h3>
        </template>
        <pre class="text-sm text-gray-600 whitespace-pre-wrap break-all m-0">{{ JSON.stringify(form, null, 2) }}</pre>
      </el-card>
    </el-space>
  </el-card>
</template>
