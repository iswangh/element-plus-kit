<script setup lang="ts">
import type { TagOption } from '@iswangh/element-plus-kit-tag'
import { WTag } from '@iswangh/element-plus-kit'
import { ref } from 'vue'

const options: TagOption[] = [
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
  { label: '选项3', value: 3 },
]

const value = ref(1)
const values = ref([1, 2])
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          options + value 的使用
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
              通过 options 和 value 属性，从选项列表中匹配对应的标签文本
            </p>
          </template>
        </el-alert>
        <div>
          <h3 class="text-base text-gray-700 font-medium mb-2">
            单个值匹配
          </h3>
          <el-space wrap>
            <WTag :options="options" :value="value" />
            <WTag :options="options" :value="2" />
            <WTag :options="options" :value="3" />
          </el-space>
        </div>
        <div>
          <h3 class="text-base text-gray-700 font-medium mb-2">
            多个值匹配（用户遍历渲染）
          </h3>
          <el-space wrap>
            <WTag
              :options="options"
              :value="values"
            />
          </el-space>
          <el-space wrap class="mt-2">
            <WTag
              v-for="val in [2, 3]"
              :key="val"
              :options="options"
              :value="val"
            />
          </el-space>
        </div>
      </el-space>
    </el-card>
  </el-space>
</template>
