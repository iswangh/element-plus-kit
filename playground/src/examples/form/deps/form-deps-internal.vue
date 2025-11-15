<script setup lang="ts">
// 不导入，依赖 unplugin-vue-components 自动导入
import type { EventExtendedParams, FormItems } from '@iswangh/element-plus-kit-form'
import { ref } from 'vue'

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

const formItems: FormItems = [
  {
    prop: 'province',
    label: '省份',
    comp: 'select',
    compAttrs: {
      options: provinces,
    },
  },
  {
    prop: 'city',
    label: '城市',
    comp: 'select',
    compAttrs: {
      // 对象模式：使用 deps 配置内部依赖
      options: {
        loader: (formData) => {
          const province = formData.province as string | undefined
          if (!province)
            return []
          // value 格式：省份-城市，通过 value 前缀匹配
          return cities.filter(city => city.value.startsWith(`${province}-`))
        },
        deps: ['province'], // 内部依赖：依赖省份字段
        immediate: true,
      },
    },
  },
  {
    prop: 'district',
    label: '区县',
    comp: 'select',
    compAttrs: {
      // 对象模式：依赖省市，使用 deps 配置内部依赖
      options: {
        loader: (formData) => {
          const city = formData.city as string | undefined
          if (!city)
            return []
          // value 格式：省份-城市-区县，通过 value 前缀匹配
          return districts.filter(district => district.value.startsWith(`${city}-`))
        },
        immediate: true,
        deps: ['province', 'city'], // 内部依赖：依赖省市字段
      },
    },
  },
]

const form = ref({})

const onChange = (extendedParams: EventExtendedParams, value: any) => {
  console.log('onChange', extendedParams, value)
}
</script>

<template>
  <el-card class="example-container" shadow="hover">
    <template #header>
      <h2 class="example-title m-0">
        内部依赖测试（deps 配置）
      </h2>
    </template>
    <el-space class="w-full" direction="vertical" :size="20" fill>
      <el-alert
        type="info"
        :closable="false"
        show-icon
      >
        <template #default>
          <p class="example-description m-0">
            使用对象模式的 <code class="example-code">deps</code> 配置来声明内部依赖（表单字段）<br>
            省份：静态模式（数组） | 城市：对象模式（deps: ['province']） | 区县：对象模式（deps: ['province', 'city']）
          </p>
        </template>
      </el-alert>
      <w-form :model="form" :form-items="formItems" @change="onChange" />
      <el-card class="example-form-data" shadow="never">
        <template #header>
          <h3 class="example-form-data-title m-0">
            表单数据
          </h3>
        </template>
        <pre class="example-form-data-content">{{ JSON.stringify(form, null, 2) }}</pre>
      </el-card>
    </el-space>
  </el-card>
</template>
