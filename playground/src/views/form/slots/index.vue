<script setup lang="ts">
import type { FormItems } from '@iswangh/element-plus-kit-form'
import { Edit, Lock, QuestionFilled, Search, User, WarningFilled } from '@element-plus/icons-vue'
import { WForm } from '@iswangh/element-plus-kit'

const form = ref({
  username: '',
  password: '',
  email: '',
  customField: '',
  customField2: '',
})

// 示例 1：动态组件插槽（prefix、suffix）
const formItems1: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    compType: 'input',
  },
  {
    prop: 'password',
    label: '密码',
    compType: 'input',
    compProps: {
      type: 'password',
      showPassword: true,
    },
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

// 示例 2-1：通用表单项插槽（form-item-label、form-item-error）
const formItems2a: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    compType: 'input',
    rules: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    ],
  },
  {
    prop: 'email',
    label: '邮箱',
    compType: 'input',
    compProps: {
      type: 'email',
    },
    rules: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
  },
  {
    prop: 'phone',
    label: '手机号',
    compType: 'input',
    rules: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
    ],
  },
]

// 示例 2-2：特定字段的表单项插槽（form-item-{prop}-label、form-item-{prop}-error）
const formItems2b: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    compType: 'input',
    rules: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    ],
  },
  {
    prop: 'email',
    label: '邮箱',
    compType: 'input',
    compProps: {
      type: 'email',
    },
    rules: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
  },
  {
    prop: 'phone',
    label: '手机号',
    compType: 'input',
    rules: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
    ],
  },
  {
    prop: 'password',
    label: '密码',
    compType: 'input',
    compProps: {
      type: 'password',
      showPassword: true,
    },
    rules: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 8, message: '密码长度不能少于 8 位', trigger: 'blur' },
    ],
  },
]

// 示例 3：自定义组件插槽（compType: 'custom'）
const formItems3: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    compType: 'input',
  },
  {
    prop: 'customField',
    label: '自定义字段',
    compType: 'custom',
  },
]

// 示例 4：混合使用所有插槽类型
const formItems4: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    compType: 'input',
  },
  {
    prop: 'password',
    label: '密码',
    compType: 'input',
    compProps: {
      type: 'password',
      showPassword: true,
    },
  },
  {
    prop: 'email',
    label: '邮箱',
    compType: 'input',
    compProps: {
      type: 'email',
    },
    rules: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
  },
  {
    prop: 'customField',
    label: '自定义字段',
    compType: 'custom',
  },
  {
    prop: 'customField2',
    label: '自定义字段2',
    compType: 'custom',
  },
]
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <!-- 示例 1：动态组件插槽（prefix、suffix） -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 1：动态组件插槽（prefix、suffix）
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：使用动态组件插槽自定义组件内部插槽，如 <code>prefix</code>、<code>suffix</code> 等。
              <br>
              <strong>插槽命名规则</strong>：<code>{prop}-{slotName}</code>，如 <code>username-prefix</code>、<code>email-suffix</code>。
            </p>
          </template>
        </el-alert>
        <WForm :model="form" :form-items="formItems1" label-width="100px">
          <!-- 动态组件插槽：username-prefix -->
          <template #username-prefix>
            <el-icon><User /></el-icon>
          </template>

          <!-- 动态组件插槽：password-prefix -->
          <template #password-prefix>
            <el-icon><Lock /></el-icon>
          </template>

          <!-- 动态组件插槽：email-suffix -->
          <template #email-suffix>
            <el-icon><Search /></el-icon>
          </template>
        </WForm>
      </el-space>
    </el-card>

    <!-- 示例 2-1：通用表单项插槽（form-item-label、form-item-error） -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 2-1：通用表单项插槽（form-item-label、form-item-error）
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：使用通用表单项插槽 <code>form-item-label</code> 和 <code>form-item-error</code>，会应用到所有表单项。
              <br>
              <strong>插槽命名规则</strong>：<code>form-item-{slotName}</code>，如 <code>form-item-label</code>、<code>form-item-error</code>。
              <br>
              <strong>作用域参数</strong>：<code>{ value, form, formItem, ...elFormItemProps }</code>。
            </p>
          </template>
        </el-alert>
        <WForm :model="form" :form-items="formItems2a" label-width="120px">
          <!-- 通用表单项插槽：form-item-label（应用到所有字段） -->
          <template #form-item-label="{ formItem, label }">
            <span class="flex items-center gap-1">
              <span>{{ label }}</span>
              <el-tag v-if="formItem?.rules?.some((r: any) => r.required)" size="small" type="danger" effect="plain">必填</el-tag>
            </span>
          </template>

          <!-- 通用表单项插槽：form-item-error（自定义错误信息显示） -->
          <template #form-item-error="{ error }">
            <div class="flex items-center gap-1 text-red-500">
              <el-icon><WarningFilled /></el-icon>
              <span class="font-medium">{{ error }}</span>
            </div>
          </template>
        </WForm>
      </el-space>
    </el-card>

    <!-- 示例 2-2：特定字段的表单项插槽（form-item-{prop}-label、form-item-{prop}-error） -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 2-2：特定字段的表单项插槽（form-item-{prop}-label、form-item-{prop}-error）
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：使用特定字段的表单项插槽，可以针对特定字段自定义标签和错误信息。
              <br>
              <strong>插槽命名规则</strong>：<code>form-item-{prop}-{slotName}</code>，如 <code>form-item-email-label</code>、<code>form-item-phone-error</code>。
              <br>
              <strong>优先级</strong>：特定字段插槽优先级高于通用插槽。
            </p>
          </template>
        </el-alert>
        <WForm :model="form" :form-items="formItems2b" label-width="100px">
          <!-- 特定字段插槽：form-item-email-label（只应用于 email 字段） -->
          <template #form-item-email-label="{ formItem }">
            <span class="flex items-center gap-1">
              <el-icon class="text-blue-500"><Edit /></el-icon>
              <span class="font-semibold text-blue-600">{{ formItem?.label }}</span>
              <el-tag size="small" type="danger" effect="plain">必填</el-tag>
            </span>
          </template>

          <!-- 特定字段插槽：form-item-phone-label（只应用于 phone 字段） -->
          <template #form-item-phone-label="{ formItem }">
            <span class="flex items-center gap-2">
              <span>{{ formItem?.label }}</span>
              <el-tooltip content="请输入11位手机号码" placement="top">
                <el-icon class="text-gray-400 cursor-help"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>

          <!-- 特定字段插槽：form-item-password-error（只应用于 password 字段） -->
          <template #form-item-password-error="{ error }">
            <div class="flex items-center gap-1 text-red-500">
              <el-icon><WarningFilled /></el-icon>
              <span class="font-medium">{{ error }}</span>
            </div>
          </template>
        </WForm>
      </el-space>
    </el-card>

    <!-- 示例 3：自定义组件插槽（compType: 'custom'） -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 3：自定义组件插槽（compType: 'custom'）
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：当 <code>comp</code> 为 <code>'custom'</code> 时，使用自定义组件插槽完全自定义表单项内容。
              <br>
              <strong>插槽命名规则</strong>：直接使用 <code>{prop}</code>，如 <code>customField</code>。
              <br>
              <strong>作用域参数</strong>：<code>{ value, form, formItem }</code>。
            </p>
          </template>
        </el-alert>
        <WForm :model="form" :form-items="formItems3" label-width="100px">
          <!-- 自定义组件插槽：customField -->
          <template #customField>
            <el-input
              v-model="form.customField"
              placeholder="自定义输入框"
              clearable
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </template>
        </WForm>
      </el-space>
    </el-card>

    <!-- 示例 4：混合使用所有插槽类型 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 4：混合使用所有插槽类型
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：可以在同一个表单中混合使用所有类型的插槽。
            </p>
          </template>
        </el-alert>
        <WForm :model="form" :form-items="formItems4" label-width="100px">
          <!-- 动态组件插槽：username-prefix -->
          <template #username-prefix>
            <el-icon><User /></el-icon>
          </template>

          <!-- 动态组件插槽：password-prefix -->
          <template #password-prefix>
            <el-icon><Lock /></el-icon>
          </template>

          <!-- 表单项插槽：form-item-email-label -->
          <template #form-item-email-label="{ formItem }">
            <span style="color: #409eff">
              {{ formItem?.label }}（自定义标签）
            </span>
          </template>

          <!-- 自定义组件插槽：customField -->
          <template #customField>
            <el-input
              v-model="form.customField"
              placeholder="自定义输入框"
              clearable
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </template>

          <!-- 自定义组件插槽：customField2 -->
          <template #customField2>
            <el-input
              v-model="form.customField2"
              placeholder="自定义输入框2"
              clearable
            >
              <template #prefix>
                <el-icon><Edit /></el-icon>
              </template>
            </el-input>
          </template>
        </WForm>
      </el-space>
    </el-card>
  </el-space>
</template>
