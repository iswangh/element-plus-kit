<script setup lang="ts">
import type { TagOption } from '@iswangh/element-plus-kit-tag'
import { WTag } from '@iswangh/element-plus-kit'
import { ref } from 'vue'

const options: TagOption[] = [
  { name: '苹果', id: 'apple' },
  { name: '香蕉', id: 'banana' },
  { name: '橙子', id: 'orange' },
]

const value = ref('apple')
const values = ref(['apple', 'banana'])
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          options + value + props 传入 name id 的使用
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="16" fill>
        <el-alert
          type="info"
          :closable="false"
          show-icon
        >
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              通过 props 属性自定义字段映射，支持使用 name、id 等字段名
            </p>
          </template>
        </el-alert>
        <div>
          <h3 class="text-base text-gray-700 font-medium mb-2">
            自定义字段映射（props: { label: 'name', value: 'id' }）
          </h3>
          <el-space wrap>
            <WTag :options="options" :value="value" :props="{ label: 'name', value: 'id' }" />
            <WTag :options="options" value="banana" :props="{ label: 'name', value: 'id' }" />
            <WTag :options="options" value="orange" :props="{ label: 'name', value: 'id' }" />
          </el-space>
        </div>
        <div>
          <h3 class="text-base text-gray-700 font-medium mb-2">
            多个值匹配（用户遍历渲染）
          </h3>
          <el-space wrap>
            <WTag
              v-for="val in values"
              :key="val"
              :options="options"
              :value="val"
              :props="{ label: 'name', value: 'id' }"
            />
          </el-space>
        </div>
      </el-space>
    </el-card>
  </el-space>
</template>
