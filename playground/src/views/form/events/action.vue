<script setup lang="ts">
import type { FormActionConfig, FormItems } from '@iswangh/element-plus-kit-form'
import { WForm } from '@iswangh/element-plus-kit'
import { ElMessage } from 'element-plus'

const form = ref({
  username: '',
  email: '',
})

const actionLog = ref<Array<{ time: string, eventName: string, data?: unknown }>>([])

const formItems: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    compType: 'input',
  },
  {
    prop: 'email',
    label: '邮箱',
    compType: 'input',
    compProps: {
      type: 'email',
    },
  },
]

const actionConfig: FormActionConfig = {
  buttons: [
    'search',
    'reset',
    { eventName: 'custom1', label: '自定义1', type: 'primary' },
    { eventName: 'custom2', label: '自定义2', type: 'success' },
  ],
}

function onAction(eventName: string, data?: unknown) {
  const time = new Date().toLocaleTimeString()
  actionLog.value.unshift({
    time,
    eventName,
    data,
  })

  ElMessage.success(`触发了 ${eventName} 事件${data ? `，数据: ${JSON.stringify(data)}` : ''}`)

  // 限制日志数量
  if (actionLog.value.length > 10)
    actionLog.value = actionLog.value.slice(0, 10)
}

function onSearch() {
  ElMessage.info('触发了 search 事件（预设事件）')
}

function onReset(resetData: Record<string, unknown>) {
  ElMessage.info(`触发了 reset 事件（预设事件），重置数据: ${JSON.stringify(resetData)}`)
}

function clearLog() {
  actionLog.value = []
}
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <!-- 示例：action 事件监听 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          action 事件监听
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：通过 <code>@action</code> 事件监听所有按钮点击事件（包括预设按钮和自定义按钮）。事件回调函数接收两个参数：<code>eventName</code>（事件名称）和 <code>data</code>（可选的数据）。
            </p>
          </template>
        </el-alert>
        <el-alert type="warning" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              <strong>注意</strong>：预设事件（search、reset、submit、cancel、expand）会同时触发对应的事件（如 <code>@search</code>）和 <code>@action</code> 事件。如果同时监听了预设事件和 <code>@action</code>，会导致重复处理。
            </p>
          </template>
        </el-alert>
        <WForm
          :model="form"
          :form-items="formItems"
          :action-config="actionConfig"
          label-width="100px"
          @action="onAction"
          @search="onSearch"
          @reset="onReset"
        />
        <el-card class="w-full" shadow="never">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base text-gray-800 font-semibold m-0">
                事件日志
              </h3>
              <el-button size="small" @click="clearLog">
                清空日志
              </el-button>
            </div>
          </template>
          <el-space class="w-full" direction="vertical" :size="10" fill>
            <div
              v-for="(log, index) in actionLog"
              :key="index"
              class="p-2 bg-gray-50 rounded"
            >
              <div class="text-xs text-gray-500 mb-1">
                {{ log.time }}
              </div>
              <div class="text-sm text-gray-700">
                <strong>{{ log.eventName }}</strong>
                <span v-if="log.data" class="ml-2 text-gray-600">
                  (数据: {{ JSON.stringify(log.data) }})
                </span>
              </div>
            </div>
            <el-empty v-if="actionLog.length === 0" :image-size="80" description="暂无事件记录" />
          </el-space>
        </el-card>
      </el-space>
    </el-card>
  </el-space>
</template>
