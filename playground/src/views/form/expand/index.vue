<script setup lang="ts">
import type { ActionConfig, FormItems } from '@iswangh/element-plus-kit-form'
import { WForm } from '@iswangh/element-plus-kit'
import { ElMessage } from 'element-plus'

const form = ref({})
const formRef = ref<InstanceType<typeof WForm>>()

// 基础表单项
const baseFormItems: FormItems = [
  { prop: 'name', label: '姓名', comp: 'input' },
  { prop: 'age', label: '年龄', comp: 'input-number', compAttrs: { min: 0, max: 120 } },
  { prop: 'email', label: '邮箱', comp: 'input', compAttrs: { type: 'email' } },
  { prop: 'phone', label: '手机号', comp: 'input' },
  { prop: 'gender', label: '性别', comp: 'select', compAttrs: { options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] } },
  { prop: 'birthday', label: '生日', comp: 'date-picker', compAttrs: { type: 'date' } },
  { prop: 'address', label: '地址', comp: 'input' },
  { prop: 'remark', label: '备注', comp: 'input', compAttrs: { type: 'textarea', rows: 3 } },
]

// 示例 1：count
const actionConfig1: ActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { count: 3 },
}

// 示例 2：include（白名单：只展示指定字段）
const actionConfig2: ActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { include: ['name', 'age', 'email'] },
}

// 示例 3：exclude（黑名单：折叠指定字段）
const actionConfig3: ActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { exclude: ['address', 'remark'] },
}

// 示例 4：受控模式
const actionConfig4: ActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { count: 3 },
}

// 手动控制方法
function expandForm() {
  formRef.value?.toggleExpanded(true)
}

function collapseForm() {
  formRef.value?.toggleExpanded(false)
}

function toggleForm() {
  formRef.value?.toggleExpanded()
}

function checkExpanded() {
  const expanded = formRef.value?.expanded ?? false
  ElMessage.info(`当前展开状态: ${expanded ? '展开' : '折叠'}`)
}

// 计算属性：当前展开状态（用于模板显示）
const currentExpanded = computed(() => formRef.value?.expanded ?? false)
</script>

<template>
  <div class="p-4">
    <el-alert type="info" :closable="false" show-icon class="mb-4">
      <template #default>
        <p class="text-sm text-gray-600 m-0">
          <strong>注意</strong>：展开/折叠功能仅在 <code>inline</code> 模式下有效，按钮位置固定在 action 按钮右侧。
          对于默认布局（非 inline），建议使用 <code>el-collapse</code> 组件包裹表单。
        </p>
      </template>
    </el-alert>
    <el-space class="w-full" direction="vertical" :size="20" fill>
      <!-- 示例 1：count -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <h2 class="text-lg text-gray-800 font-semibold m-0">
            示例 1：count（默认展开前 3 个字段）
          </h2>
        </template>
        <WForm
          :model="form"
          inline
          :form-items="baseFormItems"
          :action-config="actionConfig1"
        />
      </el-card>

      <!-- 示例 2：include（白名单） -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <h2 class="text-lg text-gray-800 font-semibold m-0">
            示例 2：include（白名单：只展示指定字段）
          </h2>
        </template>
        <WForm
          :model="form"
          inline
          :form-items="baseFormItems"
          :action-config="actionConfig2"
        />
      </el-card>

      <!-- 示例 3：exclude（黑名单） -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <h2 class="text-lg text-gray-800 font-semibold m-0">
            示例 3：exclude（黑名单：折叠指定字段）
          </h2>
        </template>
        <WForm
          :model="form"
          inline
          :form-items="baseFormItems"
          :action-config="actionConfig3"
        />
      </el-card>

      <!-- 示例 4：受控模式 -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg text-gray-800 font-semibold m-0">
              示例 4：受控模式（通过 ref 控制）
            </h2>
            <div class="flex gap-2">
              <el-button size="small" @click="expandForm">
                展开
              </el-button>
              <el-button size="small" @click="collapseForm">
                折叠
              </el-button>
              <el-button size="small" @click="toggleForm">
                切换
              </el-button>
              <el-button size="small" @click="checkExpanded">
                检查状态
              </el-button>
            </div>
          </div>
        </template>
        <WForm
          ref="formRef"
          :model="form"
          inline
          :form-items="baseFormItems"
          :action-config="actionConfig4"
        />
        <el-alert type="info" :closable="false" show-icon class="m-t-4">
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              当前展开状态：{{ currentExpanded ? '展开' : '折叠' }}
            </p>
          </template>
        </el-alert>
      </el-card>
    </el-space>
  </div>
</template>

<style scoped>
.custom-expand-btn {
  border-radius: 20px;
  padding: 8px 20px;
  font-weight: bold;
}
</style>
