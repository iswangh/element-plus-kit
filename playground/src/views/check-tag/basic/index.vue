<script setup lang="ts">
import type { CheckTagOption } from '@iswangh/element-plus-kit-tag'
import { WCheckTag } from '@iswangh/element-plus-kit'
import { ref } from 'vue'

const singleOptions: CheckTagOption[] = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
]

const multipleOptions: CheckTagOption[] = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
  { label: '选项4', value: '4' },
]

const singleValue = ref<string | null>(null)
const multipleValue = ref<string[]>([])
</script>

<template>
  <el-card class="w-full" shadow="hover">
    <template #header>
      <h2 class="text-lg text-gray-800 font-semibold m-0">
        基础用法
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
            从主包手动导入 WCheckTag 组件
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
          />
        </el-space>
      </div>
      <div>
        <h3 class="text-base text-gray-700 font-medium mb-2">
          多选模式
        </h3>
        <el-space wrap>
          <WCheckTag
            v-model="multipleValue"
            :options="multipleOptions"
            multiple
          />
        </el-space>
      </div>
      <div>
        <h3 class="text-base text-gray-700 font-medium mb-2">
          不同类型
        </h3>
        <el-space wrap>
          <WCheckTag
            v-model="singleValue"
            :options="[
              { label: '成功', value: 'success', tagProps: { type: 'success' } },
              { label: '信息', value: 'info', tagProps: { type: 'info' } },
              { label: '警告', value: 'warning', tagProps: { type: 'warning' } },
              { label: '危险', value: 'danger', tagProps: { type: 'danger' } },
            ]"
          />
        </el-space>
      </div>
      <div>
        <h3 class="text-base text-gray-700 font-medium mb-2">
          禁用状态
        </h3>
        <el-space wrap>
          <WCheckTag
            v-model="singleValue"
            :options="[
              { label: '正常', value: 'normal' },
              { label: '禁用选项', value: 'disabled', disabled: true },
              { label: '正常2', value: 'normal2' },
            ]"
          />
        </el-space>
      </div>
    </el-space>
  </el-card>
</template>
