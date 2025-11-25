<script setup lang="ts">
// 不导入，依赖 unplugin-vue-components 和 unplugin-auto-import 自动导入
// ref 会自动导入，无需手动导入
import type { FormItemExtendedEventParams, FormItems } from '@iswangh/element-plus-kit-form'

// 模拟数据
const provinces = [
  { label: '北京市', value: '1' },
  { label: '上海市', value: '2' },
  { label: '广东省', value: '3' },
  { label: '浙江省', value: '4' },
]

const cities = [
  { label: '北京市', value: '1-1' },
  { label: '上海市', value: '2-1' },
  { label: '广州市', value: '3-1' },
  { label: '深圳市', value: '3-2' },
  { label: '珠海市', value: '3-3' },
  { label: '杭州市', value: '4-1' },
  { label: '宁波市', value: '4-2' },
  { label: '温州市', value: '4-3' },
]

const formItems: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    comp: 'input',
  },
  {
    prop: 'province',
    label: '省份',
    comp: 'select',
    compProps: {
      options: provinces,
    },
  },
  {
    prop: 'city',
    label: '城市（自动清理：默认）',
    comp: 'select',
    compProps: {
      // 对象模式：默认 autoClear 为 true，依赖变化时自动清除值
      options: {
        loader: (formData) => {
          const province = formData.province as string | undefined
          if (!province)
            return []
          return cities.filter(city => city.value.startsWith(`${province}-`))
        },
        deps: ['province'],
        immediate: true,
        // autoClear: true, // 默认值，可以不写
      },
    },
  },
  {
    prop: 'cityCustom',
    label: '城市（自定义处理：autoClear: false）',
    comp: 'select',
    compProps: {
      // 对象模式：autoClear 为 false，用户自己处理值的设置逻辑
      options: {
        loader: (formData) => {
          const province = formData.province as string | undefined
          if (!province)
            return []
          return cities.filter(city => city.value.startsWith(`${province}-`))
        },
        deps: ['province'],
        immediate: true,
      },
    },
  },
]

const form = ref<{ cityCustom?: string }>({})

function onChange({ prop }: FormItemExtendedEventParams, value: any) {
  console.log('onChange', prop, value)

  if (prop === 'province') {
    form.value.cityCustom = value === '1' ? '1-1' : undefined
  }
}
</script>

<template>
  <el-card class="w-full" shadow="hover">
    <template #header>
      <h2 class="text-lg text-gray-800 font-semibold m-0">
        智能清理功能测试
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
            测试自动清理功能：<br>
            <strong>城市（自动清理）</strong>：依赖变化时，如果当前值不在新的选项中，自动清除值<br>
            <strong>城市（自定义处理）</strong>：同样支持自动清理，但用户可以在 change 事件中设置默认值（如果值在新的选项中，会被保留）<br>
            <strong>业务需求示例</strong>：当省份值为 '1' 时，自动设置城市（自定义处理）为 '1-1'（如果 '1-1' 在新的选项中，会被保留）
          </p>
        </template>
      </el-alert>
      <el-alert
        type="warning"
        :closable="false"
        show-icon
      >
        <template #title>
          <h3 class="text-base text-gray-800 font-semibold m-0">
            测试步骤：
          </h3>
        </template>
        <template #default>
          <ol class="list-decimal ml-5 my-2">
            <li class="text-sm text-gray-600 my-1">
              选择省份为 "北京市"（值为 '1'）
            </li>
            <li class="text-sm text-gray-600 my-1">
              观察：城市（自动清理）会被清除，城市（自定义处理）会自动设置为 '1-1'
            </li>
            <li class="text-sm text-gray-600 my-1">
              选择城市（自动清理）的值为 "北京市"（值为 '1-1'）
            </li>
            <li class="text-sm text-gray-600 my-1">
              切换省份为 "上海市"（值为 '2'）
            </li>
            <li class="text-sm text-gray-600 my-1">
              观察：城市（自动清理）会被自动清除，城市（自定义处理）会被手动清除
            </li>
          </ol>
        </template>
      </el-alert>
      <w-form :model="form" :form-items="formItems" @change="onChange" />
      <el-card class="w-full" shadow="never">
        <template #header>
          <h3 class="text-base text-gray-800 font-semibold m-0">
            表单数据
          </h3>
        </template>
        <pre class="text-sm text-gray-600 whitespace-pre-wrap break-all m-0">{{ JSON.stringify(form, null, 2) }}</pre>
      </el-card>
    </el-space>
  </el-card>
</template>
