<!-- eslint-disable no-console -->
<!-- eslint-disable ts/no-explicit-any -->
<script setup lang='ts'>
import type { FormItemEventExtendedParams, FormItems } from '@iswangh/element-plus-kit'
import { WForm } from '@iswangh/element-plus-kit'
import { ref } from 'vue'
import { cities, districts, provinces } from './data'

const form = ref<{
  province?: string
  city?: string
  district?: string
}>({})

const formItems = ref<FormItems>([
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
    },
  },
  {
    prop: 'district',
    label: '区县',
    compType: 'select',
    compProps: {
      placeholder: '请选择区县',
      options: [],
    },
  },
])

function onChange(extendedParams: FormItemEventExtendedParams, value: unknown) {
  console.log('onChange', extendedParams, value)

  // 当省份变化时，更新城市选项，清空城市和区县
  if (extendedParams.prop === 'province') {
    const province = value as string
    const cityItem = formItems.value[1]

    if (cityItem?.compProps) {
      const cityOptions = province
        ? cities.filter(city => city.value.startsWith(`${province}-`))
        : []
      cityItem.compProps.options = cityOptions
    }

    form.value.city = undefined
    form.value.district = undefined
  }

  // 当城市变化时，更新区县选项，清空区县
  if (extendedParams.prop === 'city') {
    const city = value as string
    const districtItem = formItems.value[2]

    if (districtItem?.compProps) {
      const districtOptions = city
        ? districts.filter(district => district.value.startsWith(`${city}-`))
        : []
      districtItem.compProps.options = districtOptions
    }

    form.value.district = undefined
  }
}
</script>

<template>
  <el-card class="w-full" shadow="hover">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="text-lg font-semibold">静态模式</span>
      </div>
    </template>

    <div class="space-y-4">
      <div class="rounded-lg bg-gray-50 p-4">
        <div class="mb-4 text-sm text-gray-600">
          <strong>说明</strong>：使用静态 <code class="example-code">options</code> 数组配置选项，通过 <code class="example-code">computed</code> 实现级联关系。
        </div>
        <div class="mb-4 text-sm text-gray-600">
          <strong>特点</strong>：
          <ul class="ml-6 mt-2 list-disc space-y-1">
            <li>所有选项数据都在前端，无需请求接口</li>
            <li>在 <code class="example-code">onChange</code> 事件中根据依赖字段更新选项</li>
            <li>在 <code class="example-code">onChange</code> 事件中处理清空逻辑</li>
            <li>适合数据量小、变化不频繁的场景</li>
          </ul>
        </div>
      </div>

      <WForm
        :model="form"
        :form-items="formItems"
        @change="onChange"
      />
    </div>
  </el-card>
</template>
