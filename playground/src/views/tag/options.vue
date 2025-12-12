<script setup lang="ts">
import { WTag } from '@iswangh/element-plus-kit'

// 示例 1: options + value 的使用
const options1 = [
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
  { label: '选项3', value: 3 },
]

const value1 = ref(1)

// 示例 2: options + value + 插槽一起的使用
const options2 = [
  { label: '成功', value: 'success', tagProps: { type: 'success' as const } },
  { label: '警告', value: 'warning', tagProps: { type: 'warning' as const } },
  { label: '危险', value: 'danger', tagProps: { type: 'danger' as const } },
]

const value2 = ref('success')

// 示例 3: options + value + looseMatch 为 false 的使用
const options3 = [
  { label: '数字1', value: 1 },
  { label: '字符串1', value: '1' },
  { label: '布尔true', value: true },
  { label: '字符串true', value: 'true' },
]

const value3Number = ref(1)
const value3String = ref('1')
const value3Boolean = ref(true)
const value3StringBoolean = ref('true')

// 示例 4: options + value + props 传入 name id 的使用
const options4 = [
  { name: '苹果', id: 'apple' },
  { name: '香蕉', id: 'banana' },
  { name: '橙子', id: 'orange' },
]

const value4 = ref('apple')

// 布尔值和字符串抹平示例
const optionsBoolean = [
  { label: '是', value: true },
  { label: '否', value: false },
]

const valueBooleanTrue = ref(true)
const valueBooleanStringTrue = ref('true')
const valueBooleanFalse = ref(false)
const valueBooleanStringFalse = ref('false')
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <!-- 示例 1: options + value 的使用 -->
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
            <WTag :options="options1" :value="value1" />
            <WTag :options="options1" :value="2" />
            <WTag :options="options1" :value="3" />
          </el-space>
        </div>
        <div>
          <h3 class="text-base text-gray-700 font-medium mb-2">
            数组值匹配
          </h3>
          <el-space wrap>
            <WTag :options="options1" :value="[1, 2]" />
            <WTag :options="options1" :value="[2, 3]" />
          </el-space>
        </div>
      </el-space>
    </el-card>

    <!-- 示例 2: options + value + 插槽一起的使用 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          options + value + 插槽一起的使用
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
              当同时使用 options、value 和插槽时，插槽内容优先显示
            </p>
          </template>
        </el-alert>
        <div>
          <h3 class="text-base text-gray-700 font-medium mb-2">
            插槽优先（即使有 options 和 value）
          </h3>
          <el-space wrap>
            <WTag :options="options2" :value="value2">
              自定义插槽内容
            </WTag>
            <WTag :options="options2" value="warning">
              另一个自定义内容
            </WTag>
          </el-space>
        </div>
        <div>
          <h3 class="text-base text-gray-700 font-medium mb-2">
            仅使用 options 和 value（无插槽）
          </h3>
          <el-space wrap>
            <WTag :options="options2" value="success" />
            <WTag :options="options2" value="warning" />
            <WTag :options="options2" value="danger" />
          </el-space>
        </div>
      </el-space>
    </el-card>

    <!-- 示例 3: options + value + looseMatch 为 false 的使用 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          options + value + looseMatch 为 false 的使用
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="16" fill>
        <el-alert
          type="warning"
          :closable="false"
          show-icon
        >
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              当 looseMatch 为 false 时，使用严格相等比较，类型必须完全匹配
            </p>
          </template>
        </el-alert>
        <div>
          <h3 class="text-base text-gray-700 font-medium mb-2">
            严格匹配（looseMatch: false）
          </h3>
          <el-space wrap direction="vertical" :size="12">
            <div>
              <p class="text-sm text-gray-600 mb-1">
                数字 1 匹配数字 1：
              </p>
              <WTag :options="options3" :value="value3Number" :loose-match="false" />
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">
                字符串 '1' 匹配字符串 '1'：
              </p>
              <WTag :options="options3" :value="value3String" :loose-match="false" />
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">
                布尔值 true 匹配布尔值 true：
              </p>
              <WTag :options="options3" :value="value3Boolean" :loose-match="false" />
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">
                字符串 'true' 匹配字符串 'true'：
              </p>
              <WTag :options="options3" :value="value3StringBoolean" :loose-match="false" />
            </div>
          </el-space>
        </div>
        <div>
          <h3 class="text-base text-gray-700 font-medium mb-2">
            对比：宽松匹配（looseMatch: true，默认）
          </h3>
          <el-space wrap direction="vertical" :size="12">
            <div>
              <p class="text-sm text-gray-600 mb-1">
                数字 1 可以匹配字符串 '1'：
              </p>
              <WTag :options="options3" :value="1" />
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">
                字符串 '1' 可以匹配数字 1：
              </p>
              <WTag :options="options3" value="1" />
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">
                布尔值 true 可以匹配字符串 'true'：
              </p>
              <WTag :options="options3" :value="true" />
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">
                字符串 'true' 可以匹配布尔值 true：
              </p>
              <WTag :options="options3" value="true" />
            </div>
          </el-space>
        </div>
      </el-space>
    </el-card>

    <!-- 示例 4: options + value + props 传入 name id 的使用 -->
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
            <WTag :options="options4" :value="value4" :props="{ label: 'name', value: 'id' }" />
            <WTag :options="options4" value="banana" :props="{ label: 'name', value: 'id' }" />
            <WTag :options="options4" value="orange" :props="{ label: 'name', value: 'id' }" />
          </el-space>
        </div>
        <div>
          <h3 class="text-base text-gray-700 font-medium mb-2">
            数组值匹配
          </h3>
          <el-space wrap>
            <WTag :options="options4" :value="['apple', 'banana']" :props="{ label: 'name', value: 'id' }" />
          </el-space>
        </div>
      </el-space>
    </el-card>

    <!-- 布尔值和字符串抹平示例 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          布尔值和字符串抹平示例
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="16" fill>
        <el-alert
          type="success"
          :closable="false"
          show-icon
        >
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              当 looseMatch 为 true（默认）时，布尔值和字符串 'true'/'false' 可以互相匹配
            </p>
          </template>
        </el-alert>
        <div>
          <h3 class="text-base text-gray-700 font-medium mb-2">
            布尔值 true 匹配字符串 'true'
          </h3>
          <el-space wrap>
            <WTag :options="optionsBoolean" :value="valueBooleanTrue" />
            <WTag :options="optionsBoolean" :value="valueBooleanStringTrue" />
          </el-space>
        </div>
        <div>
          <h3 class="text-base text-gray-700 font-medium mb-2">
            布尔值 false 匹配字符串 'false'
          </h3>
          <el-space wrap>
            <WTag :options="optionsBoolean" :value="valueBooleanFalse" />
            <WTag :options="optionsBoolean" :value="valueBooleanStringFalse" />
          </el-space>
        </div>
      </el-space>
    </el-card>
  </el-space>
</template>
