<script setup lang="ts">
import type { FormActionConfig, FormItems } from '@iswangh/element-plus-kit-form'
import { WForm } from '@iswangh/element-plus-kit'
import { ElMessage } from 'element-plus'

const form = ref({
  hasData: false,
})

const formItems: FormItems = [
  { prop: 'hasData', label: '是否有数据', compType: 'switch' },
  { prop: 'username', label: '用户名', compType: 'input' },
  { prop: 'email', label: '邮箱', compType: 'input', compProps: { type: 'email' } },
]

// 测试 1：根据表单数据动态控制按钮显示
const actionConfig1 = computed<FormActionConfig>(() => ({
  vIf: form.value.hasData,
  buttons: ['submit', 'cancel'],
}))

// 测试 2：根据表单数据动态控制按钮状态（disabled）
const actionConfig2 = computed<FormActionConfig>(() => ({
  vIf: true,
  buttons: [
    {
      eventName: 'submit',
      label: '提交',
      type: 'primary',
      disabled: !form.value.hasData,
    },
    {
      eventName: 'cancel',
      label: '取消',
      disabled: !form.value.hasData,
    },
  ],
}))

// 测试 3：根据表单数据动态控制按钮 loading
const loadingState = ref(false)
const actionConfig3 = computed<FormActionConfig>(() => ({
  vIf: true,
  buttons: [
    {
      eventName: 'submit',
      label: '提交',
      type: 'primary',
      loading: loadingState.value,
      disabled: !form.value.hasData,
    },
    {
      eventName: 'cancel',
      label: '取消',
      disabled: loadingState.value,
    },
  ],
}))

function onAction1(eventName: string) {
  ElMessage.success(`点击了 ${eventName} 按钮`)
}

function onAction2(eventName: string) {
  ElMessage.success(`点击了 ${eventName} 按钮`)
}

async function onAction3(eventName: string) {
  if (eventName === 'submit') {
    loadingState.value = true
    ElMessage.info('开始提交...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    loadingState.value = false
    ElMessage.success('提交完成')
  }
  else if (eventName === 'cancel') {
    ElMessage.info('已取消')
  }
}
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <!-- 测试 1：根据表单数据动态控制按钮显示 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          测试 1：根据表单数据动态控制按钮显示（vIf）
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：通过 <code>vIf</code> 属性根据表单数据动态控制按钮显示。当"是否有数据"开关为开启时，按钮才会显示。
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

    <!-- 测试 2：根据表单数据动态控制按钮状态（disabled） -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          测试 2：根据表单数据动态控制按钮状态（disabled）
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：通过 <code>disabled</code> 属性根据表单数据动态控制按钮状态。当"是否有数据"开关为关闭时，按钮会被禁用。
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

    <!-- 测试 3：根据表单数据动态控制按钮 loading -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          测试 3：根据表单数据动态控制按钮 loading 和 disabled
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：同时使用 <code>loading</code> 和 <code>disabled</code> 属性动态控制按钮状态。<br>
              提交按钮：当"是否有数据"开关为关闭时禁用，提交时显示 loading<br>
              取消按钮：提交时禁用
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
