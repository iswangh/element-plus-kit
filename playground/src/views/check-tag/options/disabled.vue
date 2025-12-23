<script setup lang="ts">
import type { CheckTagOption } from '@iswangh/element-plus-kit-tag'
import { WCheckTag } from '@iswangh/element-plus-kit'
import { ref } from 'vue'

const options: CheckTagOption[] = [
  { label: '正常', value: 'normal' },
  { label: '禁用选项', value: 'disabled', disabled: true },
  { label: '正常2', value: 'normal2' },
]

const singleValue = ref<string | null>(null)
const multipleValue = ref<string[]>([])
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          禁用状态
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
              支持组件级别和选项级别的禁用状态。组件级禁用优先级大于选项级禁用。
            </p>
          </template>
        </el-alert>
        <div>
          <h3 class="text-base text-gray-700 font-medium mb-2">
            选项级别禁用
          </h3>
          <el-space wrap>
            <WCheckTag
              v-model="singleValue"
              :options="options"
            />
          </el-space>
          <p class="text-sm text-gray-500 text-xs mt-2">
            单选模式：只有标记为 <code>disabled: true</code> 的选项被禁用
          </p>
        </div>
        <div>
          <h3 class="text-base text-gray-700 font-medium mb-2">
            选项级别禁用（多选模式）
          </h3>
          <el-space wrap>
            <WCheckTag
              v-model="multipleValue"
              :options="options"
              multiple
            />
          </el-space>
          <p class="text-sm text-gray-500 text-xs mt-2">
            多选模式：只有标记为 <code>disabled: true</code> 的选项被禁用
          </p>
        </div>
        <div>
          <h3 class="text-base text-gray-700 font-medium mb-2">
            组件级别禁用
          </h3>
          <el-space wrap>
            <WCheckTag
              v-model="singleValue"
              :options="options"
              disabled
            />
          </el-space>
          <p class="text-sm text-gray-500 text-xs mt-2">
            组件级禁用：所有选项都被禁用，无论选项本身的 <code>disabled</code> 属性
          </p>
        </div>
        <div>
          <h3 class="text-base text-gray-700 font-medium mb-2">
            组件级别禁用（多选模式）
          </h3>
          <el-space wrap>
            <WCheckTag
              v-model="multipleValue"
              :options="options"
              multiple
              disabled
            />
          </el-space>
          <p class="text-sm text-gray-500 text-xs mt-2">
            组件级禁用：所有选项都被禁用，无论选项本身的 <code>disabled</code> 属性
          </p>
        </div>
      </el-space>
    </el-card>
  </el-space>
</template>
