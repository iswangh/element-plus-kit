<script setup lang="ts">
import type { CheckTagOption } from '@iswangh/element-plus-kit-tag'
import { WCheckTag } from '@iswangh/element-plus-kit'
import { ref } from 'vue'

const singleOptions: CheckTagOption[] = [
  { text: '选项1', id: '1' },
  { text: '选项2', id: '2' },
  { text: '选项3', id: '3' },
]

const multipleOptions: CheckTagOption[] = [
  { text: '选项1', id: '1' },
  { text: '选项2', id: '2' },
  { text: '选项3', id: '3' },
  { text: '选项4', id: '4' },
]

const singleValue = ref<string | null>(null)
const multipleValue = ref<string[]>([])

const fieldProps = {
  label: 'text',
  value: 'id',
}
</script>

<template>
  <el-card class="w-full" shadow="hover">
    <template #header>
      <h2 class="text-lg text-gray-800 font-semibold m-0">
        字段映射
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
            使用自定义字段映射配置，支持不同的数据结构
          </p>
        </template>
      </el-alert>
      <div>
        <h3 class="text-base text-gray-700 font-medium mb-2">
          单选模式
        </h3>
        <el-space wrap>
          <WCheckTag
            v-model="singleValue"
            :options="singleOptions"
            :props="fieldProps"
          />
        </el-space>
        <p class="text-sm text-gray-500 text-xs mt-2">
          选项数据结构：<code>{{ JSON.stringify(singleOptions[0], null, 2) }}</code>
        </p>
      </div>
      <div>
        <h3 class="text-base text-gray-700 font-medium mb-2">
          多选模式
        </h3>
        <el-space wrap>
          <WCheckTag
            v-model="multipleValue"
            :options="multipleOptions"
            :props="fieldProps"
            multiple
          />
        </el-space>
        <p class="text-sm text-gray-500 text-xs mt-2">
          选项数据结构：<code>{{ JSON.stringify(multipleOptions[0], null, 2) }}</code>
        </p>
      </div>
    </el-space>
  </el-card>
</template>
