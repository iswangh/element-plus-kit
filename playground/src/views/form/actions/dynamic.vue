<script setup lang="ts">
import type { ActionConfig, FormItems } from '@iswangh/element-plus-kit-form'
import { Connection } from '@element-plus/icons-vue'
import { WForm } from '@iswangh/element-plus-kit'
import { ElMessage } from 'element-plus'

const form = ref({
  hasData: false,
})

const formItems: FormItems = [
  { prop: 'hasData', label: '是否有数据', comp: 'switch' },
  { prop: 'username', label: '用户名', comp: 'input' },
  { prop: 'email', label: '邮箱', comp: 'input', compAttrs: { type: 'email' } },
]

// 测试 1：根据表单数据动态控制按钮显示
const actionConfig1 = computed<ActionConfig>(() => ({
  vIf: form.value.hasData,
  buttons: ['submit', 'cancel'],
}))

// 测试 2：根据表单数据动态控制按钮状态（disabled）
const actionConfig2 = computed<ActionConfig>(() => ({
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
const actionConfig3 = computed<ActionConfig>(() => ({
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
  <div class="dynamic-test">
    <el-card shadow="hover" class="mb-4">
      <template #header>
        <div class="flex items-center gap-2">
          <el-icon><Connection /></el-icon>
          <span class="font-semibold">动态控制按钮状态测试</span>
        </div>
      </template>
      <div class="space-y-6">
        <!-- 测试 1：根据表单数据动态控制按钮显示 -->
        <div>
          <h3 class="mb-2 text-base font-medium">
            测试 1：根据表单数据动态控制按钮显示（vIf）
          </h3>
          <p class="mb-2 text-sm text-gray-500">
            当"是否有数据"开关为开启时，按钮才会显示
          </p>
          <WForm
            :model="form"
            :form-items="formItems"
            :action-config="actionConfig1"
            label-width="100px"
            @action="onAction1"
          />
        </div>

        <!-- 测试 2：根据表单数据动态控制按钮状态（disabled） -->
        <el-divider />
        <div>
          <h3 class="mb-2 text-base font-medium">
            测试 2：根据表单数据动态控制按钮状态（disabled）
          </h3>
          <p class="mb-2 text-sm text-gray-500">
            当"是否有数据"开关为关闭时，按钮会被禁用
          </p>
          <WForm
            :model="form"
            :form-items="formItems"
            :action-config="actionConfig2"
            label-width="100px"
            @action="onAction2"
          />
        </div>

        <!-- 测试 3：根据表单数据动态控制按钮 loading -->
        <el-divider />
        <div>
          <h3 class="mb-2 text-base font-medium">
            测试 3：根据表单数据动态控制按钮 loading 和 disabled
          </h3>
          <p class="mb-2 text-sm text-gray-500">
            提交按钮：当"是否有数据"开关为关闭时禁用，提交时显示 loading<br>
            取消按钮：提交时禁用
          </p>
          <WForm
            :model="form"
            :form-items="formItems"
            :action-config="actionConfig3"
            label-width="100px"
            @action="onAction3"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.dynamic-test {
  padding: 20px;
}
</style>
