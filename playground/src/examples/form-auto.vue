<script setup lang="ts">
// 不导入，依赖 unplugin-vue-components 自动导入
import type { FormItems } from '@iswangh/element-plus-kit/form'
import { ref } from 'vue'

const formItems = [
  {
    prop: 'select',
    label: '选择器',
    comp: 'select',
    compAttrs: {
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
      ],
    },
  },
  {
    prop: 'date',
    label: '日期',
    comp: 'date-picker',
  },
] satisfies FormItems

const form = ref({
  select: '',
  date: '',
})
</script>

<template>
  <div class="test-container">
    <h2>按需导入测试（自动导入）</h2>
    <p>组件自动导入，无需手动 import</p>
    <!-- WForm 应该被自动导入 -->
    <WForm :model="form" :form-items="formItems" />
  </div>
</template>

<style scoped>
.test-container {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>
