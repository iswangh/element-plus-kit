<script setup lang="ts">
import type { Component } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { computed, ref } from 'vue'
import {
  AutoComponents,
  FormAutoClear,
  FormDepsExternal,
  FormDepsInternal,
  FormDepsMixed,
  FormGlobal,
  FormManual,
  FormOptionsFunction,
  FormOptionsObject,
} from './examples'

const locale = zhCn

interface ExampleItem {
  key: string
  component: Component
  label: string
}

interface ExampleGroup {
  key: string
  label: string
  examples: ExampleItem[]
}

const groups: ExampleGroup[] = [
  {
    key: 'basic',
    label: '基础测试组',
    examples: [
      { key: 'formAuto', component: AutoComponents, label: '自动导入测试' },
      { key: 'formGlobal', component: FormGlobal, label: '全局导入测试' },
      { key: 'formManual', component: FormManual, label: '手动导入测试' },
    ],
  },
  {
    key: 'deps',
    label: '依赖测试组',
    examples: [
      { key: 'formDepsInternal', component: FormDepsInternal, label: '内部依赖测试' },
      { key: 'formDepsExternal', component: FormDepsExternal, label: '外部依赖测试' },
      { key: 'formDepsMixed', component: FormDepsMixed, label: '混合依赖测试' },
      { key: 'formAutoClear', component: FormAutoClear, label: '智能清理功能测试' },
      { key: 'formOptionsFunction', component: FormOptionsFunction, label: '函数模式测试' },
      { key: 'formOptionsObject', component: FormOptionsObject, label: '对象模式测试' },
    ],
  },
]

const activeGroup = ref(groups[0]?.key ?? '')

const controls = ref<Record<string, boolean>>(
  Object.fromEntries(
    groups.flatMap(group => group.examples.map(example => [example.key, true])),
  ),
)

const currentGroup = computed(() => groups.find(g => g.key === activeGroup.value))

const visibleExamples = computed(() =>
  currentGroup.value?.examples.filter(example => controls.value[example.key]) ?? [],
)
</script>

<template>
  <el-config-provider :locale="locale">
    <div class="container-center">
      <el-card class="mb-5" shadow="never">
        <template #header>
          <h1 class="text-2xl font-bold m-0">
            Element Plus Kit Playground
          </h1>
        </template>
        <el-radio-group v-model="activeGroup">
          <el-radio
            v-for="group in groups"
            :key="group.key"
            :value="group.key"
            size="large"
          >
            {{ group.label }}
          </el-radio>
        </el-radio-group>
      </el-card>

      <template v-if="currentGroup">
        <el-card class="mb-5" shadow="never">
          <template #header>
            <span class="text-base text-primary-500 font-semibold">{{ currentGroup.label }} - 单独显示控制</span>
          </template>
          <div class="flex flex-wrap gap-4">
            <el-checkbox
              v-for="example in currentGroup.examples"
              :key="example.key"
              v-model="controls[example.key]"
            >
              {{ example.label }}
            </el-checkbox>
          </div>
        </el-card>

        <component
          :is="example.component"
          v-for="example in visibleExamples"
          :key="example.key"
        />
      </template>
    </div>
  </el-config-provider>
</template>
