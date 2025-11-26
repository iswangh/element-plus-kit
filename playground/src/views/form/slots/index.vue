<script setup lang="ts">
import type { FormItems } from '@iswangh/element-plus-kit-form'
import { Edit, Lock, Search, User } from '@element-plus/icons-vue'
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
    comp: 'input',
  },
  {
    prop: 'password',
    label: '密码',
    comp: 'input',
    compProps: {
      type: 'password',
      showPassword: true,
    },
  },
  {
    prop: 'email',
    label: '邮箱',
    comp: 'input',
    compProps: {
      type: 'email',
    },
  },
]

// 示例 2：表单项插槽（label、error）
const formItems2: FormItems = [
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
    rules: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
  },
]

// 示例 3：自定义组件插槽（comp: 'custom'）
const formItems3: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    comp: 'input',
  },
  {
    prop: 'customField',
    label: '自定义字段',
    comp: 'custom',
  },
]

// 示例 4：混合使用所有插槽类型
const formItems4: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    comp: 'input',
  },
  {
    prop: 'password',
    label: '密码',
    comp: 'input',
    compProps: {
      type: 'password',
      showPassword: true,
    },
  },
  {
    prop: 'email',
    label: '邮箱',
    comp: 'input',
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
    comp: 'custom',
  },
  {
    prop: 'customField2',
    label: '自定义字段2',
    comp: 'custom',
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

    <!-- 示例 2：表单项插槽（label、error） -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 2：表单项插槽（label、error）
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：使用表单项插槽自定义表单项内容，如 <code>label</code>、<code>error</code> 等。
              <br>
              <strong>插槽命名规则</strong>：<code>form-item-{slotName}</code>，如 <code>form-item-email-label</code>。
            </p>
          </template>
        </el-alert>
        <WForm :model="form" :form-items="formItems2" label-width="100px">
          <!-- 表单项插槽：form-item-email-label -->
          <template #form-item-email-label="{ formItem }">
            <span style="color: #409eff">
              {{ formItem.label }}（自定义标签）
            </span>
          </template>
        </WForm>
      </el-space>
    </el-card>

    <!-- 示例 3：自定义组件插槽（comp: 'custom'） -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 3：自定义组件插槽（comp: 'custom'）
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
              {{ formItem.label }}（自定义标签）
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
