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

const districts = [
  { label: '东城区', value: '1-1-1' },
  { label: '西城区', value: '1-1-2' },
  { label: '黄浦区', value: '2-1-1' },
  { label: '徐汇区', value: '2-1-2' },
  { label: '荔湾区', value: '3-1-1' },
  { label: '越秀区', value: '3-1-2' },
  { label: '罗湖区', value: '3-2-1' },
  { label: '福田区', value: '3-2-2' },
  { label: '香洲区', value: '3-3-1' },
  { label: '斗门区', value: '3-3-2' },
  { label: '上城区', value: '4-1-1' },
  { label: '下城区', value: '4-1-2' },
  { label: '海曙区', value: '4-2-1' },
  { label: '江北区', value: '4-2-2' },
  { label: '鹿城区', value: '4-3-1' },
  { label: '龙湾区', value: '4-3-2' },
]

const form = ref<Record<string, any>>({})

const formItems: FormItems = [
  {
    prop: 'province',
    label: '省份',
    compType: 'select',
    compProps: {
      options: provinces,
    },
  },
  {
    prop: 'city',
    label: '城市',
    compType: 'select',
    compProps: {
      options: () => {
        const province = form.value.province as string | undefined
        if (!province)
          return []
        return cities.filter(city => city.value.startsWith(`${province}-`))
      },
    },
  },
  {
    prop: 'district',
    label: '区县',
    compType: 'select',
    compProps: {
      options: () => {
        const city = form.value.city as string | undefined
        if (!city)
          return []
        return districts.filter(district => district.value.startsWith(`${city}-`))
      },
    },
  },
]

function onChange(extendedParams: FormItemExtendedEventParams, value: any) {
  console.log('onChange', extendedParams, value)
}
</script>

<template>
  <el-card class="w-full" shadow="hover">
    <template #header>
      <h2 class="text-lg text-gray-800 font-semibold m-0">
        函数模式测试
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
            使用函数模式动态加载选项：<br>
            省份：静态模式（数组） | 城市：函数模式（闭包访问 form.value.province） | 区县：函数模式（闭包访问 form.value.city）
          </p>
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
