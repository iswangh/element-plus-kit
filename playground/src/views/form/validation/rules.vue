<script setup lang="ts">
import type { FormItems } from '@iswangh/element-plus-kit-form'
import { WForm } from '@iswangh/element-plus-kit'

const form = ref({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  age: 0,
  url: '',
})

// 示例 1：基础验证规则（required、type、pattern）
const formItems1: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    comp: 'input',
    rules: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    ],
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
    prop: 'phone',
    label: '手机号',
    comp: 'input',
    rules: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
    ],
  },
]

// 示例 2：自定义验证器（validator）
const formItems2: FormItems = [
  {
    prop: 'password',
    label: '密码',
    comp: 'input',
    compProps: {
      type: 'password',
      showPassword: true,
    },
    rules: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (!value) {
            callback()
            return
          }
          if (value.length < 8) {
            callback(new Error('密码长度不能少于 8 位'))
            return
          }
          if (!/[A-Z]/.test(value)) {
            callback(new Error('密码必须包含至少一个大写字母'))
            return
          }
          if (!/[a-z]/.test(value)) {
            callback(new Error('密码必须包含至少一个小写字母'))
            return
          }
          if (!/\d/.test(value)) {
            callback(new Error('密码必须包含至少一个数字'))
            return
          }
          callback()
        },
        trigger: 'blur',
      },
    ],
  },
  {
    prop: 'confirmPassword',
    label: '确认密码',
    comp: 'input',
    compProps: {
      type: 'password',
      showPassword: true,
    },
    rules: [
      { required: true, message: '请再次输入密码', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (!value) {
            callback()
            return
          }
          if (value !== form.value.password) {
            callback(new Error('两次输入的密码不一致'))
            return
          }
          callback()
        },
        trigger: 'blur',
      },
    ],
  },
]

// 示例 3：数字范围验证
const formItems3: FormItems = [
  {
    prop: 'age',
    label: '年龄',
    comp: 'input-number',
    compProps: {
      min: 0,
      max: 120,
    },
    rules: [
      { required: true, message: '请输入年龄', trigger: 'blur' },
      { type: 'number', min: 18, max: 65, message: '年龄必须在 18 到 65 岁之间', trigger: 'blur' },
    ],
  },
]

// 示例 4：URL 验证
const formItems4: FormItems = [
  {
    prop: 'url',
    label: '网址',
    comp: 'input',
    rules: [
      { required: true, message: '请输入网址', trigger: 'blur' },
      { type: 'url', message: '请输入正确的网址格式', trigger: 'blur' },
    ],
  },
]
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <!-- 示例 1：基础验证规则 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 1：基础验证规则（required、type、pattern）
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：使用基础验证规则，包括 <code>required</code>（必填）、<code>type</code>（类型验证）、<code>pattern</code>（正则表达式验证）等。
            </p>
          </template>
        </el-alert>
        <WForm :model="form" :form-items="formItems1" label-width="100px" />
      </el-space>
    </el-card>

    <!-- 示例 2：自定义验证器 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 2：自定义验证器（validator）
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：使用 <code>validator</code> 自定义验证函数，可以实现复杂的验证逻辑，如密码强度验证、确认密码验证等。
            </p>
          </template>
        </el-alert>
        <WForm :model="form" :form-items="formItems2" label-width="100px" />
      </el-space>
    </el-card>

    <!-- 示例 3：数字范围验证 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 3：数字范围验证
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：使用 <code>type: 'number'</code> 配合 <code>min</code> 和 <code>max</code> 进行数字范围验证。
            </p>
          </template>
        </el-alert>
        <WForm :model="form" :form-items="formItems3" label-width="100px" />
      </el-space>
    </el-card>

    <!-- 示例 4：URL 验证 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 4：URL 验证
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：使用 <code>type: 'url'</code> 进行网址格式验证。
            </p>
          </template>
        </el-alert>
        <WForm :model="form" :form-items="formItems4" label-width="100px" />
      </el-space>
    </el-card>
  </el-space>
</template>
