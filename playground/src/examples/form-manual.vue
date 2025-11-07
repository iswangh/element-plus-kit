<script setup lang="ts">
import type { FormItems } from '@iswangh/element-plus-kit/form'
import { WForm } from '@iswangh/element-plus-kit'
import { ref } from 'vue'

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
    compAttrs: {
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
  <div class="test-container">
    <h2>手动导入测试</h2>
    <p>从主包手动导入组件</p>
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
