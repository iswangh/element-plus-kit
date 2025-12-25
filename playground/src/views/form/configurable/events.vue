<script setup lang="ts">
/* eslint-disable no-console */
import type { FormItemEventExtendedParams, FormItems } from '@iswangh/element-plus-kit'
import { WForm } from '@iswangh/element-plus-kit'
import { ElMessage } from 'element-plus'

// 第一个卡片：可配置化事件
const form1 = ref({
  username: '',
  email: '',
})

const formItems1: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    compType: 'input',
    compProps: {
      placeholder: '请输入用户名',
      // 动态组件的事件在 compProps 中定义
      onBlur: (event: FocusEvent) => {
        const time = new Date().toLocaleTimeString()
        const logEntry = {
          time,
          event: 'onBlur',
          source: '配置（compProps）',
          prop: 'username',
          args: [event],
        }
        console.log('[可配置化事件] onBlur 触发:', logEntry)
        ElMessage.info('onBlur 事件触发（来自配置）')
      },
      onFocus: (event: FocusEvent) => {
        const time = new Date().toLocaleTimeString()
        const logEntry = {
          time,
          event: 'onFocus',
          source: '配置（compProps）',
          prop: 'username',
          args: [event],
        }
        console.log('[可配置化事件] onFocus 触发:', logEntry)
        ElMessage.info('onFocus 事件触发（来自配置）')
      },
    },
  },
  {
    prop: 'email',
    label: '邮箱',
    compType: 'input',
    compProps: {
      type: 'email',
      placeholder: '请输入邮箱',
      onBlur: (event: FocusEvent) => {
        const time = new Date().toLocaleTimeString()
        const logEntry = {
          time,
          event: 'onBlur',
          source: '配置（compProps）',
          prop: 'email',
          args: [event],
        }
        console.log('[可配置化事件] onBlur 触发:', logEntry)
        ElMessage.info('onBlur 事件触发（来自配置）')
      },
    },
  },
]

// 第二个卡片：可配置化事件和 WForm 事件的优先级
const form2 = ref({
  username: '',
  email: '',
})

const formItems2: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    compType: 'input',
    compProps: {
      placeholder: '请输入用户名',
      // 配置中的事件（优先级高）
      onBlur: (event: FocusEvent) => {
        const time = new Date().toLocaleTimeString()
        const logEntry = {
          time,
          event: 'onBlur',
          source: '配置（compProps）',
          prop: 'username',
          args: [event],
        }
        console.log('[优先级验证] onBlur 触发（配置，优先级高）:', logEntry)
        ElMessage.success('onBlur 事件触发（来自配置，优先级高）')
      },
      onFocus: (event: FocusEvent) => {
        const time = new Date().toLocaleTimeString()
        const logEntry = {
          time,
          event: 'onFocus',
          source: '配置（compProps）',
          prop: 'username',
          args: [event],
        }
        console.log('[优先级验证] onFocus 触发（配置，优先级高）:', logEntry)
        ElMessage.success('onFocus 事件触发（来自配置，优先级高）')
      },
    },
  },
  {
    prop: 'email',
    label: '邮箱',
    compType: 'input',
    compProps: {
      type: 'email',
      placeholder: '请输入邮箱',
      // 这个字段没有在配置中定义事件，会使用 WForm 标签上的事件
    },
  },
]

// WForm 标签上的事件（优先级低，会被配置中的同名事件覆盖）
// 注意：事件处理器的第一个参数是 FormItemEventExtendedParams（包含 prop, formItem, index），后续参数是原始事件参数
function handleTagBlur(extendedParams: FormItemEventExtendedParams, event: FocusEvent) {
  const time = new Date().toLocaleTimeString()
  const logEntry = {
    time,
    event: 'onBlur',
    source: 'WForm 标签',
    prop: extendedParams.prop,
    args: [event],
  }
  console.log('[优先级验证] onBlur 触发（WForm 标签，优先级低）:', logEntry)
  ElMessage.warning(`onBlur 事件触发（来自 WForm 标签，优先级低）: ${extendedParams.prop}`)
}

function handleTagFocus(extendedParams: FormItemEventExtendedParams, event: FocusEvent) {
  const time = new Date().toLocaleTimeString()
  const logEntry = {
    time,
    event: 'onFocus',
    source: 'WForm 标签',
    prop: extendedParams.prop,
    args: [event],
  }
  console.log('[优先级验证] onFocus 触发（WForm 标签，优先级低）:', logEntry)
  ElMessage.warning(`onFocus 事件触发（来自 WForm 标签，优先级低）: ${extendedParams.prop}`)
}
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <!-- 第一个卡片：可配置化事件 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          可配置化事件
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：在 formItem 配置对象中定义事件处理器。动态组件的事件在 <code>compProps</code> 中定义，formItem 的事件在配置对象顶层定义。
              <br>
              <strong>提示：</strong>打开浏览器控制台（F12）可以查看详细的事件打印信息。
            </p>
          </template>
        </el-alert>
        <WForm
          :model="form1"
          :form-items="formItems1"
          label-width="100px"
        />
      </el-space>
    </el-card>

    <!-- 第二个卡片：可配置化事件和 WForm 事件的优先级 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          可配置化事件和 WForm 事件的优先级
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="warning" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：同时在 WForm 标签和 <code>compProps</code> 中定义同名事件，验证配置中的事件优先级更高。
              <br>
              <strong>username</strong> 字段：配置中定义了 <code>onBlur</code> 和 <code>onFocus</code>，会覆盖 WForm 标签上的同名事件。
              <br>
              <strong>email</strong> 字段：配置中未定义事件，会使用 WForm 标签上的事件。
              <br>
              <strong>提示：</strong>打开浏览器控制台（F12）可以查看详细的事件打印信息和优先级验证。
            </p>
          </template>
        </el-alert>
        <WForm
          :model="form2"
          :form-items="formItems2"
          label-width="100px"
          v-bind="{
            onBlur: handleTagBlur,
            onFocus: handleTagFocus,
          }"
        />
      </el-space>
    </el-card>
  </el-space>
</template>
