<script setup lang="ts">
import type { FormItems } from '@iswangh/element-plus-kit-form'
import { WForm } from '@iswangh/element-plus-kit'
import { ElMessage } from 'element-plus'

const form = ref({
  username: '',
  email: '',
  phone: '',
})

const formRef = ref<InstanceType<typeof WForm>>()

const validationResults = ref<Record<string, { isValid: boolean, message: string }>>({})

const formItems: FormItems = [
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

function onValidate(prop: string, isValid: boolean, message: string) {
  validationResults.value[prop] = { isValid, message }
  ElMessage({
    type: isValid ? 'success' : 'error',
    message: `${prop}: ${isValid ? '验证通过' : message}`,
    duration: 2000,
  })
}

async function validateAll() {
  try {
    await formRef.value?.validate()
    ElMessage.success('所有字段验证通过')
  }
  catch {
    ElMessage.error('表单验证失败，请检查输入')
  }
}

function validateField(prop: string) {
  formRef.value?.validateField(prop)
}

function clearValidation(prop?: string) {
  if (prop) {
    formRef.value?.clearValidate(prop)
    delete validationResults.value[prop]
  }
  else {
    formRef.value?.clearValidate()
    validationResults.value = {}
  }
}

function resetFields(prop?: string) {
  if (prop) {
    formRef.value?.resetFields(prop)
  }
  else {
    formRef.value?.resetFields()
  }
  validationResults.value = {}
  ElMessage.success(prop ? `已重置 ${prop} 字段` : '已重置所有字段')
}

function scrollToField(prop: string) {
  formRef.value?.scrollToField(prop)
  ElMessage.info(`已滚动到 ${prop} 字段`)
}
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <!-- 示例 1：validate 事件监听 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 1：validate 事件监听
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：通过 <code>@validate</code> 事件监听字段验证结果，可以实时获取每个字段的验证状态和错误信息。
            </p>
          </template>
        </el-alert>
        <WForm
          ref="formRef"
          :model="form"
          :form-items="formItems"
          label-width="100px"
          @validate="onValidate"
        />
        <el-card class="w-full" shadow="never">
          <template #header>
            <h3 class="text-base text-gray-800 font-semibold m-0">
              验证结果
            </h3>
          </template>
          <el-space class="w-full" direction="vertical" :size="10" fill>
            <div
              v-for="(result, prop) in validationResults"
              :key="prop"
              class="flex items-center gap-2"
            >
              <el-tag :type="result.isValid ? 'success' : 'danger'">
                {{ result.isValid ? '通过' : '失败' }}
              </el-tag>
              <span class="text-sm text-gray-600">
                {{ prop }}: {{ result.message || '验证通过' }}
              </span>
            </div>
            <el-empty v-if="Object.keys(validationResults).length === 0" :image-size="80" description="暂无验证结果" />
          </el-space>
        </el-card>
      </el-space>
    </el-card>

    <!-- 示例 2：手动验证方法 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 2：手动验证方法
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：通过表单实例的方法手动触发验证，包括 <code>validate()</code>（验证所有字段）、<code>validateField(prop)</code>（验证指定字段）、<code>clearValidate(prop)</code>（清除验证）等。
            </p>
          </template>
        </el-alert>
        <WForm
          ref="formRef"
          :model="form"
          :form-items="formItems"
          label-width="100px"
          @validate="onValidate"
        />
        <el-space class="w-full" direction="horizontal" :size="10" wrap>
          <el-button type="primary" @click="validateAll">
            验证所有字段
          </el-button>
          <el-button @click="validateField('username')">
            验证用户名
          </el-button>
          <el-button @click="validateField('email')">
            验证邮箱
          </el-button>
          <el-button @click="validateField('phone')">
            验证手机号
          </el-button>
          <el-button @click="clearValidation()">
            清除所有验证
          </el-button>
        </el-space>
      </el-space>
    </el-card>

    <!-- 示例 3：表单方法（resetFields、scrollToField） -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 3：表单方法（resetFields、scrollToField）
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：表单实例还提供了其他实用方法，包括 <code>resetFields(prop)</code>（重置字段）和 <code>scrollToField(prop)</code>（滚动到指定字段）。
            </p>
          </template>
        </el-alert>
        <WForm
          ref="formRef"
          :model="form"
          :form-items="formItems"
          label-width="100px"
          @validate="onValidate"
        />
        <el-space class="w-full" direction="horizontal" :size="10" wrap>
          <el-button @click="resetFields()">
            重置所有字段
          </el-button>
          <el-button @click="resetFields('username')">
            重置用户名
          </el-button>
          <el-button @click="resetFields('email')">
            重置邮箱
          </el-button>
          <el-button @click="resetFields('phone')">
            重置手机号
          </el-button>
          <el-button @click="scrollToField('username')">
            滚动到用户名
          </el-button>
          <el-button @click="scrollToField('email')">
            滚动到邮箱
          </el-button>
          <el-button @click="scrollToField('phone')">
            滚动到手机号
          </el-button>
        </el-space>
      </el-space>
    </el-card>
  </el-space>
</template>
