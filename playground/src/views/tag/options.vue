<script setup lang="ts">
import type { TagOption } from '@iswangh/element-plus-kit-tag'
import { WTag } from '@iswangh/element-plus-kit'
import { ref } from 'vue'

// 示例 1: options + value 的使用
const options1: TagOption[] = [
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
  { label: '选项3', value: 3 },
]

const value1 = ref(1)
const values1 = ref([1, 2])

// 示例 2: options + value + 插槽一起的使用
const options2: TagOption[] = [
  { label: '成功', value: 'success', tagProps: { type: 'success' as const } },
  { label: '警告', value: 'warning', tagProps: { type: 'warning' as const } },
  { label: '危险', value: 'danger', tagProps: { type: 'danger' as const } },
]

const value2 = ref('success')

// 示例 3: options + value + looseMatch 对比示例
// 场景 1: 数字 1 匹配字符串 '1'
const options3Scene1: TagOption[] = [
  { label: '字符串1', value: '1' },
]

// 场景 2: 字符串 '1' 匹配数字 1
const options3Scene2: TagOption[] = [
  { label: '数字1', value: 1 },
]

// 场景 3: 布尔值 true 匹配字符串 'true'
const options3Scene3: TagOption[] = [
  { label: '字符串true', value: 'true' },
]

// 场景 4: 字符串 'true' 匹配布尔值 true
const options3Scene4: TagOption[] = [
  { label: '布尔true', value: true },
]

// 示例 4: options + value + props 传入 name id 的使用
const options4: TagOption[] = [
  { name: '苹果', id: 'apple' },
  { name: '香蕉', id: 'banana' },
  { name: '橙子', id: 'orange' },
]

const value4 = ref('apple')
const values4 = ref(['apple', 'banana'])

// 布尔值和字符串抹平示例
const optionsBoolean: TagOption[] = [
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
            多个值匹配（用户遍历渲染）
          </h3>
          <el-space wrap>
            <WTag
              :options="options1"
              :value="values1"
            />
          </el-space>
          <el-space wrap class="mt-2">
            <WTag
              v-for="val in [2, 3]"
              :key="val"
              :options="options1"
              :value="val"
            />
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
        <div>
          <h3 class="text-base text-gray-700 font-medium mb-2">
            作用域插槽（使用 value、label、options）
          </h3>
          <el-space wrap direction="vertical" :size="12" class="w-full" fill>
            <div>
              <p class="text-sm text-gray-600 mb-2">
                单个值：
              </p>
              <el-space wrap>
                <WTag :options="options2" :value="value2">
                  <template #default="{ label, options }">
                    <span v-if="options.length > 0">
                      ✅ {{ label }} (匹配到 {{ options.length }} 个选项)
                    </span>
                    <span v-else>
                      ❌ {{ label }} (匹配失败)
                    </span>
                  </template>
                </WTag>
                <WTag :options="options2" value="unknown">
                  <template #default="{ label, options }">
                    <span v-if="options.length > 0">
                      ✅ {{ label }} (匹配成功)
                    </span>
                    <span v-else>
                      ❌ {{ label }} (匹配失败)
                    </span>
                  </template>
                </WTag>
              </el-space>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-2">
                数组值：
              </p>
              <WTag :options="options2" :value="['success', 'warning', 'danger']">
                <template #default="{ value, label, options }">
                  <span>
                    <template v-if="Array.isArray(value)">
                      {{ value.length }} 个值：{{ label }}
                      <span class="text-gray-400 ml-2">
                        (匹配到 {{ options.length }} 个选项)
                      </span>
                    </template>
                    <template v-else>
                      {{ label }}
                      <span v-if="options.length > 0" class="text-green-600 ml-2">
                        ✅ 匹配成功
                      </span>
                      <span v-else class="text-red-600 ml-2">
                        ❌ 匹配失败
                      </span>
                    </template>
                  </span>
                </template>
              </WTag>
            </div>
          </el-space>
        </div>
      </el-space>
    </el-card>

    <!-- 示例 3: options + value + looseMatch 对比示例 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          looseMatch 对比示例
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
              <strong>宽松匹配（looseMatch: true，默认）</strong>：数字和字符串可以互相匹配，布尔值和字符串 'true'/'false' 可以互相匹配<br>
              <strong>严格匹配（looseMatch: false）</strong>：类型必须完全匹配，否则无法匹配
            </p>
          </template>
        </el-alert>
        <div>
          <el-space direction="vertical" :size="16" class="w-full" fill>
            <!-- 场景 1: 数字 1 匹配字符串 '1' -->
            <div class="border border-gray-200 rounded p-4 w-full">
              <div class="text-sm font-medium text-gray-700 mb-3">
                场景 1：值 = <code class="px-1 py-0.5 bg-gray-100 rounded">数字 1</code>，选项值 = <code class="px-1 py-0.5 bg-gray-100 rounded">字符串 '1'</code>
              </div>
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="bg-green-50 border border-green-200 rounded p-3">
                    <div class="text-xs text-green-700 font-medium mb-2">
                      ✅ 宽松匹配（looseMatch: true）
                    </div>
                    <div class="text-sm text-gray-600 mb-2">
                      可以匹配，显示标签：
                    </div>
                    <WTag :options="options3Scene1" :value="1" />
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="bg-red-50 border border-red-200 rounded p-3">
                    <div class="text-xs text-red-700 font-medium mb-2">
                      ❌ 严格匹配（looseMatch: false）
                    </div>
                    <div class="text-sm text-gray-600 mb-2">
                      无法匹配，回显值：
                    </div>
                    <WTag :options="options3Scene1" :value="1" :loose-match="false" />
                  </div>
                </el-col>
              </el-row>
            </div>
            <!-- 场景 2: 字符串 '1' 匹配数字 1 -->
            <div class="border border-gray-200 rounded p-4 w-full">
              <div class="text-sm font-medium text-gray-700 mb-3">
                场景 2：值 = <code class="px-1 py-0.5 bg-gray-100 rounded">字符串 '1'</code>，选项值 = <code class="px-1 py-0.5 bg-gray-100 rounded">数字 1</code>
              </div>
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="bg-green-50 border border-green-200 rounded p-3">
                    <div class="text-xs text-green-700 font-medium mb-2">
                      ✅ 宽松匹配（looseMatch: true）
                    </div>
                    <div class="text-sm text-gray-600 mb-2">
                      可以匹配，显示标签：
                    </div>
                    <WTag :options="options3Scene2" value="1" />
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="bg-red-50 border border-red-200 rounded p-3">
                    <div class="text-xs text-red-700 font-medium mb-2">
                      ❌ 严格匹配（looseMatch: false）
                    </div>
                    <div class="text-sm text-gray-600 mb-2">
                      无法匹配，回显值：
                    </div>
                    <WTag :options="options3Scene2" value="1" :loose-match="false" />
                  </div>
                </el-col>
              </el-row>
            </div>
            <!-- 场景 3: 布尔值 true 匹配字符串 'true' -->
            <div class="border border-gray-200 rounded p-4 w-full">
              <div class="text-sm font-medium text-gray-700 mb-3">
                场景 3：值 = <code class="px-1 py-0.5 bg-gray-100 rounded">布尔值 true</code>，选项值 = <code class="px-1 py-0.5 bg-gray-100 rounded">字符串 'true'</code>
              </div>
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="bg-green-50 border border-green-200 rounded p-3">
                    <div class="text-xs text-green-700 font-medium mb-2">
                      ✅ 宽松匹配（looseMatch: true）
                    </div>
                    <div class="text-sm text-gray-600 mb-2">
                      可以匹配，显示标签：
                    </div>
                    <WTag :options="options3Scene3" :value="true" />
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="bg-red-50 border border-red-200 rounded p-3">
                    <div class="text-xs text-red-700 font-medium mb-2">
                      ❌ 严格匹配（looseMatch: false）
                    </div>
                    <div class="text-sm text-gray-600 mb-2">
                      无法匹配，回显值：
                    </div>
                    <WTag :options="options3Scene3" :value="true" :loose-match="false" />
                  </div>
                </el-col>
              </el-row>
            </div>
            <!-- 场景 4: 字符串 'true' 匹配布尔值 true -->
            <div class="border border-gray-200 rounded p-4 w-full">
              <div class="text-sm font-medium text-gray-700 mb-3">
                场景 4：值 = <code class="px-1 py-0.5 bg-gray-100 rounded">字符串 'true'</code>，选项值 = <code class="px-1 py-0.5 bg-gray-100 rounded">布尔值 true</code>
              </div>
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="bg-green-50 border border-green-200 rounded p-3">
                    <div class="text-xs text-green-700 font-medium mb-2">
                      ✅ 宽松匹配（looseMatch: true）
                    </div>
                    <div class="text-sm text-gray-600 mb-2">
                      可以匹配，显示标签：
                    </div>
                    <WTag :options="options3Scene4" value="true" />
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="bg-red-50 border border-red-200 rounded p-3">
                    <div class="text-xs text-red-700 font-medium mb-2">
                      ❌ 严格匹配（looseMatch: false）
                    </div>
                    <div class="text-sm text-gray-600 mb-2">
                      无法匹配，回显值：
                    </div>
                    <WTag :options="options3Scene4" value="true" :loose-match="false" />
                  </div>
                </el-col>
              </el-row>
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
            多个值匹配（用户遍历渲染）
          </h3>
          <el-space wrap>
            <WTag
              v-for="val in values4"
              :key="val"
              :options="options4"
              :value="val"
              :props="{ label: 'name', value: 'id' }"
            />
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
