<!-- eslint-disable no-console -->
<script setup lang="ts">
// 不导入，依赖 unplugin-vue-components 和 unplugin-auto-import 自动导入
// ref 会自动导入，无需手动导入
import type { FormItemEventExtendedParams, FormItems } from '@iswangh/element-plus-kit-form'

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
    compType: 'input',
  },
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
      optionsLoader: {
        loader: (formData: Record<string, unknown>) => {
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
  {
    prop: 'cityCustom',
    label: '自定义城市',
    compType: 'select',
    compProps: {
      // 对象模式：用户自己处理值的设置逻辑
      optionsLoader: {
        loader: (formData: Record<string, unknown>) => {
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

// 对象模式示例数据
const objectModeForm = ref<{ priority?: string, tags?: string }>({})

const objectModeFormItems: FormItems = [
  {
    prop: 'priority',
    label: '优先级',
    compType: 'select',
    compProps: {
      // 对象模式：基础用法
      optionsLoader: {
        loader: () => {
          // 可以在这里进行异步操作
          return [
            { label: '高', value: 'high' },
            { label: '中', value: 'medium' },
            { label: '低', value: 'low' },
          ]
        },
        immediate: true, // 立即加载
      },
    },
  },
  {
    prop: 'tags',
    label: '标签',
    compType: 'select',
    compProps: {
      // 对象模式：接收 formData 参数，使用 deps 配置表单字段依赖
      // 注意：当优先级变化时，如果标签的当前值（如 'normal' 或 'minor'）在新的选项中存在，
      // 组件会保留该值，不会自动清理。如果需要强制清理，需要手动设置 form.value.tags = undefined
      optionsLoader: {
        loader: (formData: Record<string, unknown>) => {
          // 可以根据表单数据动态返回选项
          const priority = formData.priority as string | undefined
          if (priority === 'high') {
            return [
              { label: '紧急', value: 'urgent' },
              { label: '重要', value: 'important' },
            ]
          }
          return [
            { label: '普通', value: 'normal' },
            { label: '次要', value: 'minor' },
          ]
        },
        deps: ['priority'], // 表单字段依赖：依赖优先级字段
        immediate: true, // 立即加载
      },
    },
  },
]

function onChange({ prop }: FormItemEventExtendedParams, value: unknown) {
  console.log('onChange', prop, value)

  if (prop === 'province') {
    form.value.cityCustom = value === '1' ? '1-1' : undefined
  }
}

function onObjectModeChange({ prop }: FormItemEventExtendedParams, value: unknown) {
  console.log('onObjectModeChange', prop, value)

  // 测试：当优先级变化时，如果值为 'high'，自动设置标签为 'urgent'
  if (prop === 'priority') {
    if (value === 'high') {
      // 在 change 事件中设置默认值
      objectModeForm.value.tags = 'urgent'
    }
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
            <strong>城市（自动清理）</strong>：依赖变化时，如果当前值不在新的选项中，自动清除值（使用 optionsLoader）<br>
            <strong>城市（自定义处理）</strong>：同样支持自动清理，但用户可以在 change 事件中设置默认值（如果值在新的选项中，会被保留，使用 optionsLoader）<br>
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

  <!-- 对象模式和依赖变更特别注意示例 -->
  <el-card class="w-full mt-6" shadow="hover">
    <template #header>
      <h2 class="text-lg text-gray-800 font-semibold m-0">
        对象模式和依赖变更特别注意示例
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
            <strong>对象模式</strong>：使用对象配置（optionsLoader），支持 <code>loader</code>、<code>deps</code>、<code>immediate</code> 等选项。<br>
            <strong>依赖变更特别注意</strong>：<br>
            • 当依赖字段变化导致选项更新时，组件会<strong>检查</strong>当前值是否在新的选项中<br>
            • <strong>如果当前值在新的选项中存在</strong>：保留当前值，<strong>不会自动清理</strong><br>
            • <strong>如果当前值在新的选项中不存在</strong>：自动清理当前值并触发 <code>change</code> 事件<br>
            • <strong>如果需要强制清理</strong>：即使当前值在新的选项中存在，也需要手动清理。可以在 <code>change</code> 事件中根据业务逻辑进行清理（如 <code>form.value.tags = undefined</code>）
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
            测试步骤（依赖变更特别注意）：
          </h3>
        </template>
        <template #default>
          <ol class="list-decimal ml-5 my-2">
            <li class="text-sm text-gray-600 my-1">
              选择优先级为 "中" 或 "低"，标签会自动加载为 "普通" 或 "次要"
            </li>
            <li class="text-sm text-gray-600 my-1">
              选择标签为 "普通"（值为 'normal'）
            </li>
            <li class="text-sm text-gray-600 my-1">
              切换优先级为 "高"，观察：标签选项变为 "紧急" 和 "重要"，但当前值 "普通" 不在新选项中，<strong>会自动清理</strong>
            </li>
            <li class="text-sm text-gray-600 my-1">
              选择标签为 "紧急"（值为 'urgent'）
            </li>
            <li class="text-sm text-gray-600 my-1">
              切换优先级为 "中"，观察：标签选项变为 "普通" 和 "次要"，当前值 "紧急" 不在新选项中，<strong>会自动清理</strong>
            </li>
            <li class="text-sm text-gray-600 my-1">
              <strong>特殊情况</strong>：如果标签值为 "普通"（'normal'），切换优先级从 "中" 到 "低" 时，由于 "普通" 在新的选项中仍然存在，<strong>不会自动清理</strong>，值会被保留
            </li>
          </ol>
        </template>
      </el-alert>
      <w-form :model="objectModeForm" :form-items="objectModeFormItems" @change="onObjectModeChange" />
      <el-card class="w-full" shadow="never">
        <template #header>
          <h3 class="text-base text-gray-800 font-semibold m-0">
            表单数据
          </h3>
        </template>
        <pre class="text-sm text-gray-600 whitespace-pre-wrap break-all m-0">{{ JSON.stringify(objectModeForm, null, 2) }}</pre>
      </el-card>
    </el-space>
  </el-card>
</template>
