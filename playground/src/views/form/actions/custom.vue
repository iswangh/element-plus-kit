<script setup lang="ts">
import type { FormActionConfig, FormItems } from '@iswangh/element-plus-kit'
import { Delete, Download, Edit, Upload } from '@element-plus/icons-vue'
import { WForm } from '@iswangh/element-plus-kit'
import { ElMessage } from 'element-plus'

const form = ref({})

const formItems: FormItems = [
  { prop: 'username', label: '用户名', compType: 'input' },
  { prop: 'email', label: '邮箱', compType: 'input', compProps: { type: 'email' } },
  { prop: 'phone', label: '手机号', compType: 'input' },
]

// 测试 1：完全自定义按钮
const actionConfig1: FormActionConfig = {
  vIf: true,
  buttons: [
    { eventName: 'download', label: '下载', icon: Download, type: 'primary' },
    { eventName: 'upload', label: '上传', icon: Upload, type: 'success' },
    { eventName: 'edit', label: '编辑', icon: Edit, type: 'warning' },
    { eventName: 'delete', label: '删除', icon: Delete, type: 'danger' },
  ],
}

// 测试 2：自定义按钮样式
const actionConfig2: FormActionConfig = {
  vIf: true,
  buttons: [
    { eventName: 'primary', label: '主要按钮', type: 'primary' },
    { eventName: 'success', label: '成功按钮', type: 'success' },
    { eventName: 'info', label: '信息按钮', type: 'info' },
    { eventName: 'warning', label: '警告按钮', type: 'warning' },
    { eventName: 'danger', label: '危险按钮', type: 'danger' },
  ],
}

// 测试 3：自定义按钮大小和形状
const actionConfig3: FormActionConfig = {
  vIf: true,
  buttons: [
    { eventName: 'large', label: '大按钮', size: 'large' },
    { eventName: 'default', label: '默认按钮', size: 'default' },
    { eventName: 'small', label: '小按钮', size: 'small' },
    { eventName: 'circle', label: '圆形', circle: true },
    { eventName: 'round', label: '圆角', round: true },
  ],
}

// 测试 4：混合使用预设和自定义按钮
const actionConfig4: FormActionConfig = {
  vIf: true,
  buttons: [
    'search',
    'reset',
    { eventName: 'custom1', label: '自定义1', type: 'primary' },
    { eventName: 'custom2', label: '自定义2', type: 'success' },
  ],
}

function onAction1(eventName: string) {
  ElMessage.success(`点击了 ${eventName} 按钮`)
}

function onAction2(eventName: string) {
  ElMessage.success(`点击了 ${eventName} 按钮`)
}

function onAction3(eventName: string) {
  ElMessage.success(`点击了 ${eventName} 按钮`)
}

function onAction4(eventName: string) {
  // 注意：预设事件（search、reset、submit、cancel、expand）会同时触发对应的事件和 @action 事件
  // 如果同时监听了预设事件（如 @search）和 @action，会导致重复处理
  // 这里只监听 @action，所以所有事件都会在这里处理
  ElMessage.success(`点击了 ${eventName} 按钮`)
}
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <!-- 测试 1：完全自定义按钮 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          测试 1：完全自定义按钮（带图标）
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：使用对象数组配置按钮，支持自定义图标、类型等属性。
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

    <!-- 测试 2：自定义按钮样式 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          测试 2：自定义按钮样式
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：通过 <code>type</code> 属性自定义按钮样式，支持 <code>primary</code>、<code>success</code>、<code>info</code>、<code>warning</code>、<code>danger</code>。
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

    <!-- 测试 3：自定义按钮大小和形状 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          测试 3：自定义按钮大小和形状
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：通过 <code>size</code> 属性控制按钮大小，通过 <code>circle</code> 和 <code>round</code> 属性控制按钮形状。
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

    <!-- 测试 4：混合使用 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          测试 4：混合使用预设和自定义按钮
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：可以混合使用预设按钮（字符串）和自定义按钮（对象），灵活配置按钮组合。
            </p>
          </template>
        </el-alert>
        <WForm
          :model="form"
          :form-items="formItems"
          :action-config="actionConfig4"
          label-width="100px"
          @action="onAction4"
        />
      </el-space>
    </el-card>
  </el-space>
</template>
