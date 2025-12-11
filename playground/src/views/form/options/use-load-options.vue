<!-- eslint-disable no-console -->
<!-- eslint-disable ts/no-explicit-any -->
<script setup lang='ts'>
import type { FormItemEventExtendedParams, FormItems } from '@iswangh/element-plus-kit-form'
import { useLoadOptions, WForm } from '@iswangh/element-plus-kit'
import { ref } from 'vue'
import { cities, districts, provinces } from './data'

// ========== 同步示例 ==========
const form1 = ref<{
  province?: string
  city?: string
  district?: string
}>({})

const formItems1 = ref<FormItems>([
  {
    prop: 'province',
    label: '省份',
    compType: 'select',
    compProps: {
      placeholder: '请选择省份',
      options: provinces,
    },
  },
  {
    prop: 'city',
    label: '城市',
    compType: 'select',
    compProps: {
      placeholder: '请选择城市',
      options: [],
      // 同步 optionsLoader
      optionsLoader: () => {
        const province = form1.value.province
        return province ? cities.filter(city => city.value.startsWith(`${province}-`)) : []
      },
    },
  },
  {
    prop: 'district',
    label: '区县',
    compType: 'select',
    compProps: {
      placeholder: '请选择区县',
      options: [],
      // 同步 optionsLoader
      optionsLoader: () => {
        const city = form1.value.city
        return city ? districts.filter(district => district.value.startsWith(`${city}-`)) : []
      },
    },
  },
])

const { loadOptions: loadOptions1, loading: loading1, getOptions: getOptions1 } = useLoadOptions(formItems1.value, form1.value)

async function onChange1(extendedParams: FormItemEventExtendedParams) {
  // 当省份变化时，加载城市选项，清空城市和区县
  if (extendedParams.prop === 'province') {
    form1.value.city = undefined
    form1.value.district = undefined
    await loadOptions1('city')
  }

  // 当城市变化时，加载区县选项，清空区县
  if (extendedParams.prop === 'city') {
    form1.value.district = undefined
    await loadOptions1('district')
  }

  console.log('getOptions1', getOptions1())
}

// ========== 异步示例 ==========
const form2 = ref<{
  province?: string
  city?: string
  district?: string
}>({})

const formItems2 = ref<FormItems>([
  {
    prop: 'province',
    label: '省份',
    compType: 'select',
    compProps: {
      placeholder: '请选择省份',
      options: provinces,
    },
  },
  {
    prop: 'city',
    label: '城市',
    compType: 'select',
    compProps: {
      placeholder: '请选择城市',
      options: [],
      // 异步 optionsLoader（模拟 5 秒延迟）
      optionsLoader: async () => {
        await new Promise(resolve => setTimeout(resolve, 5000))
        const province = form2.value.province
        return province ? cities.filter(city => city.value.startsWith(`${province}-`)) : []
      },
    },
  },
  {
    prop: 'district',
    label: '区县',
    compType: 'select',
    compProps: {
      placeholder: '请选择区县',
      options: [],
      // 异步 optionsLoader（模拟 5 秒延迟）
      optionsLoader: async () => {
        await new Promise(resolve => setTimeout(resolve, 5000))
        const city = form2.value.city
        return city ? districts.filter(district => district.value.startsWith(`${city}-`)) : []
      },
    },
  },
])

const { loadOptions: loadOptions2, loading: loading2, getOptions: getOptions2 } = useLoadOptions(formItems2.value, form2.value)

async function onChange2(extendedParams: FormItemEventExtendedParams) {
  // 当省份变化时，加载城市选项，清空城市和区县
  if (extendedParams.prop === 'province') {
    form2.value.city = undefined
    form2.value.district = undefined
    await loadOptions2('city')
  }

  // 当城市变化时，加载区县选项，清空区县
  if (extendedParams.prop === 'city') {
    form2.value.district = undefined
    await loadOptions2('district')
  }

  console.log('getOptions2', getOptions2())
}
</script>

<template>
  <div class="space-y-6">
    <!-- 同步示例 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold">同步函数</span>
        </div>
      </template>

      <div class="space-y-4">
        <div class="rounded-lg bg-gray-50 p-4">
          <div class="mb-4 text-sm text-gray-600">
            <strong>说明</strong>：使用 <code class="example-code">useLoadOptions</code> 组合式函数手动加载选项，<code class="example-code">optionsLoader</code> 为同步函数。
          </div>
          <div class="mb-4 text-sm text-gray-600">
            <strong>特点</strong>：
            <ul class="ml-6 mt-2 list-disc space-y-1">
              <li>使用 <code class="example-code">useLoadOptions</code> 获取 <code class="example-code">loadOptions</code> 函数和 <code class="example-code">loading</code> 状态</li>
              <li>在 <code class="example-code">onChange</code> 事件中调用 <code class="example-code">loadOptions</code> 加载选项</li>
              <li><code class="example-code">optionsLoader</code> 为同步函数，立即返回结果</li>
              <li>适合数据量小、计算简单的场景</li>
            </ul>
          </div>
        </div>

        <div class="space-y-2">
          <div v-if="loading1" class="text-sm text-gray-500">
            加载中...
          </div>
          <WForm
            :model="form1"
            :form-items="formItems1"
            @change="onChange1"
          />
        </div>
      </div>
    </el-card>

    <!-- 异步示例 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold">异步函数（模拟 5 秒延迟）</span>
          <el-tag v-if="loading2" type="info" size="small">
            加载中...
          </el-tag>
        </div>
      </template>

      <div class="space-y-4">
        <div class="rounded-lg bg-gray-50 p-4">
          <div class="mb-4 text-sm text-gray-600">
            <strong>说明</strong>：使用 <code class="example-code">useLoadOptions</code> 组合式函数手动加载选项，<code class="example-code">optionsLoader</code> 为异步函数（模拟 5 秒延迟）。
          </div>
          <div class="mb-4 text-sm text-gray-600">
            <strong>特点</strong>：
            <ul class="ml-6 mt-2 list-disc space-y-1">
              <li>使用 <code class="example-code">useLoadOptions</code> 获取 <code class="example-code">loadOptions</code> 函数和 <code class="example-code">loading</code> 状态</li>
              <li>在 <code class="example-code">onChange</code> 事件中调用 <code class="example-code">loadOptions</code> 加载选项</li>
              <li><code class="example-code">optionsLoader</code> 为异步函数，返回 Promise</li>
              <li>通过 <code class="example-code">loading</code> 状态显示加载状态</li>
              <li>适合需要请求接口、数据量大的场景</li>
            </ul>
          </div>
        </div>

        <WForm
          :model="form2"
          :form-items="formItems2"
          @change="onChange2"
        />
      </div>
    </el-card>
  </div>
</template>
