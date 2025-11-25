<script setup lang="ts">
import type { ActionConfig, FormItems } from '@iswangh/element-plus-kit-form'
import { Delete, Download, Edit, Setting, Upload } from '@element-plus/icons-vue'
import { WForm } from '@iswangh/element-plus-kit'
import { ElMessage } from 'element-plus'

const form = ref({})

const formItems: FormItems = [
  { prop: 'username', label: '用户名', comp: 'input' },
  { prop: 'email', label: '邮箱', comp: 'input', compProps: { type: 'email' } },
  { prop: 'phone', label: '手机号', comp: 'input' },
]

// 测试 1：完全自定义按钮
const actionConfig1: ActionConfig = {
  vIf: true,
  buttons: [
    { eventName: 'download', label: '下载', icon: Download, type: 'primary' },
    { eventName: 'upload', label: '上传', icon: Upload, type: 'success' },
    { eventName: 'edit', label: '编辑', icon: Edit, type: 'warning' },
    { eventName: 'delete', label: '删除', icon: Delete, type: 'danger' },
  ],
}

// 测试 2：自定义按钮样式
const actionConfig2: ActionConfig = {
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
const actionConfig3: ActionConfig = {
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
const actionConfig4: ActionConfig = {
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
  <div class="custom-test">
    <el-card shadow="hover" class="mb-4">
      <template #header>
        <div class="flex items-center gap-2">
          <el-icon><Setting /></el-icon>
          <span class="font-semibold">自定义按钮测试</span>
        </div>
      </template>
      <div class="space-y-6">
        <!-- 测试 1：完全自定义按钮 -->
        <div>
          <h3 class="mb-2 text-base font-medium">
            测试 1：完全自定义按钮（带图标）
          </h3>
          <WForm
            :model="form"
            :form-items="formItems"
            :action-config="actionConfig1"
            label-width="100px"
            @action="onAction1"
          />
        </div>

        <!-- 测试 2：自定义按钮样式 -->
        <el-divider />
        <div>
          <h3 class="mb-2 text-base font-medium">
            测试 2：自定义按钮样式
          </h3>
          <WForm
            :model="form"
            :form-items="formItems"
            :action-config="actionConfig2"
            label-width="100px"
            @action="onAction2"
          />
        </div>

        <!-- 测试 3：自定义按钮大小和形状 -->
        <el-divider />
        <div>
          <h3 class="mb-2 text-base font-medium">
            测试 3：自定义按钮大小和形状
          </h3>
          <WForm
            :model="form"
            :form-items="formItems"
            :action-config="actionConfig3"
            label-width="100px"
            @action="onAction3"
          />
        </div>

        <!-- 测试 4：混合使用 -->
        <el-divider />
        <div>
          <h3 class="mb-2 text-base font-medium">
            测试 4：混合使用预设和自定义按钮
          </h3>
          <WForm
            :model="form"
            :form-items="formItems"
            :action-config="actionConfig4"
            label-width="100px"
            @action="onAction4"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.custom-test {
  padding: 20px;
}
</style>
