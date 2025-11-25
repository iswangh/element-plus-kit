<script setup lang="ts">
// 不导入，依赖 unplugin-vue-components 和 unplugin-auto-import 自动导入
// ref 会自动导入，无需手动导入
import type { FormItemExtendedEventParams, FormItems } from '@iswangh/element-plus-kit-form'

// 外部状态：用户类型
const userType = ref<'admin' | 'user' | 'guest'>('user')

// 模拟数据
const adminOptions = [
  { label: '系统管理', value: 'system' },
  { label: '用户管理', value: 'user' },
  { label: '权限管理', value: 'permission' },
]

const userOptions = [
  { label: '个人信息', value: 'profile' },
  { label: '我的订单', value: 'orders' },
  { label: '我的收藏', value: 'favorites' },
]

const guestOptions = [
  { label: '登录', value: 'login' },
  { label: '注册', value: 'register' },
]

const formItems: FormItems = [
  {
    prop: 'userType',
    label: '用户类型',
    comp: 'select',
    compProps: {
      options: [
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' },
        { label: '游客', value: 'guest' },
      ],
    },
  },
  {
    prop: 'menu',
    label: '菜单选项',
    comp: 'select',
    compProps: {
      // 函数模式：通过闭包访问外部 ref（外部依赖）
      options: () => {
        // 通过闭包访问外部 ref：userType
        // 注意：这里访问的是外部的 userType，而不是表单数据中的 userType
        if (userType.value === 'admin')
          return adminOptions
        if (userType.value === 'user')
          return userOptions
        return guestOptions
      },
    },
  },
  {
    prop: 'action',
    label: '操作选项',
    comp: 'select',
    compProps: {
      // 对象模式：同时依赖外部 ref（userType）和表单字段（menu）
      options: {
        loader: (formData) => {
          // 通过闭包访问外部 ref：userType（外部依赖，watchEffect 会自动追踪）
          // 通过 formData 访问表单字段：menu（内部依赖，通过 deps 配置）
          const menu = formData.menu as string | undefined
          if (!menu)
            return []

          // 根据外部状态和表单数据返回选项
          if (userType.value === 'admin') {
            if (menu === 'system')
              return [{ label: '查看系统日志', value: 'view-logs' }, { label: '清理缓存', value: 'clear-cache' }]
            if (menu === 'user')
              return [{ label: '添加用户', value: 'add-user' }, { label: '删除用户', value: 'delete-user' }]
          }
          else if (userType.value === 'user') {
            if (menu === 'profile')
              return [{ label: '编辑资料', value: 'edit' }, { label: '修改密码', value: 'change-password' }]
            if (menu === 'orders')
              return [{ label: '查看订单', value: 'view' }, { label: '取消订单', value: 'cancel' }]
          }

          return []
        },
        // 配置内部依赖：依赖菜单字段（内部依赖变化时触发）
        // 外部依赖（userType）通过闭包访问，watchEffect 会自动追踪
        deps: ['menu'],
        immediate: true,
      },
    },
  },
]

const form = ref({})

function onChange(extendedParams: FormItemExtendedEventParams, value: any) {
  console.log('onChange', extendedParams, value)
  // 当用户类型字段变化时，同步更新外部状态
  if (extendedParams.prop === 'userType')
    userType.value = value as 'admin' | 'user' | 'guest'
}
</script>

<template>
  <el-card class="w-full" shadow="hover">
    <template #header>
      <h2 class="text-lg text-gray-800 font-semibold m-0">
        外部依赖测试（闭包访问）
      </h2>
    </template>
    <el-space class="w-full" direction="vertical" :size="20" fill>
      <el-alert
        type="info"
        :closable="false"
        show-icon
      >
        <template #default>
          <p class="text-sm text-gray-600 m-0">
            通过闭包访问外部 ref（<code class="example-code">userType</code>）作为外部依赖<br>
            用户类型：静态模式 | 菜单选项：函数模式（闭包访问 <code class="example-code">userType</code>） | 操作选项：对象模式（闭包访问 <code class="example-code">userType</code> 和表单数据）
          </p>
        </template>
      </el-alert>
      <el-alert
        type="success"
        :closable="false"
        show-icon
      >
        <template #title>
          <strong>外部状态：</strong>
        </template>
        <template #default>
          <div class="flex flex-wrap gap-2.5 items-center">
            <el-tag :type="userType === 'admin' ? 'danger' : userType === 'user' ? 'success' : 'info'">
              {{ userType === 'admin' ? '管理员' : userType === 'user' ? '普通用户' : '游客' }}
            </el-tag>
            <el-button size="small" @click="userType = userType === 'admin' ? 'user' : userType === 'user' ? 'guest' : 'admin'">
              切换用户类型
            </el-button>
          </div>
        </template>
      </el-alert>
      <w-form :model="form" :form-items="formItems" @change="onChange" />
      <el-card class="w-full" shadow="never">
        <template #header>
          <h3 class="text-base text-gray-800 font-semibold m-0">
            表单数据
          </h3>
        </template>
        <pre class="text-sm text-gray-600 whitespace-pre-wrap break-all m-0">{{ JSON.stringify(form, null, 2) }}</pre>
      </el-card>
    </el-space>
  </el-card>
</template>
