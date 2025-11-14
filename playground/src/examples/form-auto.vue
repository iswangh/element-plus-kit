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
      // 静态模式：直接使用数组
      options: provinces,
      placeholder: '请选择省份',
    },
  },
  {
    prop: 'city',
    label: '城市',
    comp: 'select',
    compAttrs: {
      // 函数模式：根据省份动态加载城市
      options: (formData) => {
        const province = formData.province as string | undefined
        if (!province)
          return []
        // value 格式：省份-城市，通过 value 前缀匹配
        return cities.filter(city => city.value.startsWith(`${province}-`))
      },
      placeholder: '请选择城市',
    },
  },
  {
    prop: 'district',
    label: '区县',
    comp: 'select',
    compAttrs: {
      // 对象模式：依赖省市，支持 immediate 和 deps
      options: {
        loader: (formData) => {
          const city = formData.city as string | undefined
          if (!city)
            return []
          // value 格式：省份-城市-区县，通过 value 前缀匹配
          return districts.filter(district => district.value.startsWith(`${city}-`))
        },
        immediate: true, // 默认 true，立即加载
        deps: ['province', 'city'], // 依赖省市，自动排除自身并去重
      },
      placeholder: '请选择区县',
    },
  },
]

const form = ref({})

const handleChange = (extendedParams: EventExtendedParams, value: any) => {
  console.log('handleChange', extendedParams, value)
}
</script>

<template>
  <div class="test-container">
    <h2>Options 功能测试（省市区三级联动）</h2>
    <p class="description">
      省份：静态模式（数组） | 城市：函数模式（依赖省） | 区县：对象模式（依赖省市）
    </p>
    <w-form :model="form" :form-items="formItems" @change="handleChange" />
    <div class="form-data">
      <h3>表单数据：</h3>
      <pre>{{ JSON.stringify(form, null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>
.test-container {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 20px;
}

.description {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.form-data {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.form-data h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
}

.form-data pre {
  margin: 0;
  font-size: 12px;
  color: #333;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
