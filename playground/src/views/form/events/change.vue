<script setup lang="ts">
import type { FormItemExtendedEventParams, FormItems } from '@iswangh/element-plus-kit-form'
import { WForm } from '@iswangh/element-plus-kit'
import { ElMessage } from 'element-plus'

const form = ref({
  username: '',
  email: '',
  age: 0,
  gender: '',
})

const changeLog = ref<Array<{ time: string, prop: string, value: any, extendedParams: FormItemExtendedEventParams }>>([])

const formItems: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    comp: 'input',
  },
  {
    prop: 'email',
    label: '邮箱',
    comp: 'input',
    compProps: {
      type: 'email',
    },
  },
  {
    prop: 'age',
    label: '年龄',
    comp: 'input-number',
    compProps: {
      min: 0,
      max: 120,
    },
  },
  {
    prop: 'gender',
    label: '性别',
    comp: 'select',
    compProps: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
    },
  },
]

function onChange(extendedParams: FormItemExtendedEventParams, value: any) {
  const time = new Date().toLocaleTimeString()
  changeLog.value.unshift({
    time,
    prop: extendedParams.prop,
    value,
    extendedParams: { ...extendedParams },
  })

  ElMessage.info(`${extendedParams.prop} 已更改为: ${JSON.stringify(value)}`)

  // 限制日志数量
  if (changeLog.value.length > 10)
    changeLog.value = changeLog.value.slice(0, 10)
}

function clearLog() {
  changeLog.value = []
}
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <!-- 示例：change 事件监听 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          change 事件监听
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：通过 <code>@change</code> 事件监听字段值的变化。事件回调函数接收两个参数：<code>extendedParams</code>（扩展参数，包含 prop、index、formItem 等信息）和 <code>value</code>（新值）。
            </p>
          </template>
        </el-alert>
        <WForm
          :model="form"
          :form-items="formItems"
          label-width="100px"
          @change="onChange"
        />
        <el-card class="w-full" shadow="never">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base text-gray-800 font-semibold m-0">
                变更日志
              </h3>
              <el-button size="small" @click="clearLog">
                清空日志
              </el-button>
            </div>
          </template>
          <el-space class="w-full" direction="vertical" :size="10" fill>
            <div
              v-for="(log, index) in changeLog"
              :key="index"
              class="p-2 bg-gray-50 rounded"
            >
              <div class="text-xs text-gray-500 mb-1">
                {{ log.time }}
              </div>
              <div class="text-sm text-gray-700">
                <strong>{{ log.prop }}</strong>: {{ JSON.stringify(log.value) }}
              </div>
              <details class="mt-1">
                <summary class="text-xs text-gray-500 cursor-pointer">
                  查看扩展参数
                </summary>
                <pre class="text-xs text-gray-600 mt-1 whitespace-pre-wrap break-all">{{ JSON.stringify(log.extendedParams, null, 2) }}</pre>
              </details>
            </div>
            <el-empty v-if="changeLog.length === 0" :image-size="80" description="暂无变更记录" />
          </el-space>
        </el-card>
      </el-space>
    </el-card>
  </el-space>
</template>
