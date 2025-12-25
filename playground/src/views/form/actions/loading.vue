<script setup lang="ts">
import type { FormActionConfig, FormItems } from '@iswangh/element-plus-kit'
import { WForm } from '@iswangh/element-plus-kit'
import { ElMessage } from 'element-plus'

const form = ref({})

const formItems: FormItems = [
  { prop: 'username', label: '用户名', compType: 'input' },
  { prop: 'email', label: '邮箱', compType: 'input', compProps: { type: 'email' } },
  { prop: 'phone', label: '手机号', compType: 'input' },
]

// 测试内置按钮的 loading 支持
const loadingStates = ref({
  search: false,
  reset: false,
  submit: false,
  cancel: false,
})

// 测试 1：内置按钮通过配置传入 loading
const actionConfig1 = computed<FormActionConfig>(() => ({
  vIf: true,
  buttons: [
    { eventName: 'search', label: '搜索', type: 'primary', loading: loadingStates.value.search },
    { eventName: 'reset', label: '重置', loading: loadingStates.value.reset },
  ],
}))

// 测试 2：自定义按钮的 loading
const actionConfig2 = computed<FormActionConfig>(() => ({
  vIf: true,
  buttons: [
    { eventName: 'submit', label: '提交', type: 'primary', loading: loadingStates.value.submit },
    { eventName: 'cancel', label: '取消', loading: loadingStates.value.cancel },
  ],
}))

// 测试 3：混合使用（预设按钮字符串 + 自定义按钮对象）
const customLoading = ref(false)
const actionConfig3 = computed<FormActionConfig>(() => ({
  vIf: true,
  buttons: [
    'search',
    { eventName: 'reset', label: '重置', loading: loadingStates.value.reset },
    { eventName: 'custom', label: '自定义按钮', type: 'success', loading: customLoading.value },
  ],
}))

async function onAction1(eventName: string) {
  if (eventName === 'search') {
    loadingStates.value.search = true
    ElMessage.info('开始搜索...')
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 2000))
    loadingStates.value.search = false
    ElMessage.success('搜索完成')
  }
  else if (eventName === 'reset') {
    loadingStates.value.reset = true
    ElMessage.info('开始重置...')
    await new Promise(resolve => setTimeout(resolve, 1000))
    loadingStates.value.reset = false
    ElMessage.success('重置完成')
  }
}

async function onAction2(eventName: string) {
  if (eventName === 'submit') {
    loadingStates.value.submit = true
    ElMessage.info('开始提交...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    loadingStates.value.submit = false
    ElMessage.success('提交完成')
  }
  else if (eventName === 'cancel') {
    loadingStates.value.cancel = true
    ElMessage.info('开始取消...')
    await new Promise(resolve => setTimeout(resolve, 1000))
    loadingStates.value.cancel = false
    ElMessage.success('取消完成')
  }
}

async function onAction3(eventName: string) {
  if (eventName === 'search') {
    ElMessage.info('搜索按钮（预设按钮，无 loading）')
  }
  else if (eventName === 'reset') {
    loadingStates.value.reset = true
    ElMessage.info('开始重置...')
    await new Promise(resolve => setTimeout(resolve, 1000))
    loadingStates.value.reset = false
    ElMessage.success('重置完成')
  }
  else if (eventName === 'custom') {
    customLoading.value = true
    ElMessage.info('自定义按钮点击')
    await new Promise(resolve => setTimeout(resolve, 1000))
    customLoading.value = false
    ElMessage.success('自定义操作完成')
  }
}
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <!-- 测试 1：内置按钮通过配置传入 loading -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          测试 1：内置按钮通过配置传入 loading
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：通过配置传入 <code>loading</code> 属性，控制内置按钮的加载状态。
            </p>
          </template>
        </el-alert>
        <WForm
          :model="form"
          :form-items="formItems"
          :action-config="actionConfig1"
          label-width="100px"
          @action="onAction1"
        />
      </el-space>
    </el-card>

    <!-- 测试 2：自定义按钮的 loading -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          测试 2：自定义按钮的 loading
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：自定义按钮同样支持 <code>loading</code> 属性，可以控制加载状态。
            </p>
          </template>
        </el-alert>
        <WForm
          :model="form"
          :form-items="formItems"
          :action-config="actionConfig2"
          label-width="100px"
          @action="onAction2"
        />
      </el-space>
    </el-card>

    <!-- 测试 3：混合使用 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          测试 3：混合使用（预设按钮字符串 + 自定义按钮对象）
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：可以混合使用预设按钮（字符串）和自定义按钮（对象），自定义按钮支持 <code>loading</code> 属性。
            </p>
          </template>
        </el-alert>
        <WForm
          :model="form"
          :form-items="formItems"
          :action-config="actionConfig3"
          label-width="100px"
          @action="onAction3"
        />
      </el-space>
    </el-card>
  </el-space>
</template>
