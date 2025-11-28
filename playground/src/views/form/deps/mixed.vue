<!-- eslint-disable ts/no-explicit-any -->
<script setup lang="ts">
// 不导入，依赖 unplugin-vue-components 和 unplugin-auto-import 自动导入
// ref 会自动导入，无需手动导入
import type { FormItemExtendedEventParams, FormItems } from '@iswangh/element-plus-kit-form'

// 外部状态：用户权限级别
const permissionLevel = ref<'admin' | 'manager' | 'user'>('user')

// 模拟数据
const departments = [
  { label: '技术部', value: 'tech' },
  { label: '产品部', value: 'product' },
  { label: '运营部', value: 'operation' },
  { label: '市场部', value: 'marketing' },
]

const techRoles = [
  { label: '前端开发', value: 'frontend' },
  { label: '后端开发', value: 'backend' },
  { label: '全栈开发', value: 'fullstack' },
  { label: '架构师', value: 'architect' },
]

const productRoles = [
  { label: '产品经理', value: 'pm' },
  { label: '产品助理', value: 'pa' },
  { label: '产品设计师', value: 'designer' },
]

const operationRoles = [
  { label: '运营专员', value: 'specialist' },
  { label: '运营经理', value: 'manager' },
  { label: '数据分析师', value: 'analyst' },
]

const marketingRoles = [
  { label: '市场专员', value: 'specialist' },
  { label: '市场经理', value: 'manager' },
  { label: '品牌经理', value: 'brand' },
]

// 根据权限级别和部门返回不同的功能选项
function getFeaturesByPermissionAndDept(permission: string, dept: string) {
  const features: Record<string, Record<string, any[]>> = {
    admin: {
      tech: [
        { label: '系统配置', value: 'system-config' },
        { label: '用户管理', value: 'user-management' },
        { label: '代码审查', value: 'code-review' },
        { label: '部署管理', value: 'deploy' },
      ],
      product: [
        { label: '产品规划', value: 'planning' },
        { label: '需求管理', value: 'requirements' },
        { label: '数据分析', value: 'analytics' },
        { label: '用户反馈', value: 'feedback' },
      ],
      operation: [
        { label: '数据统计', value: 'statistics' },
        { label: '活动管理', value: 'activities' },
        { label: '用户运营', value: 'user-operation' },
        { label: '内容管理', value: 'content' },
      ],
      marketing: [
        { label: '营销活动', value: 'campaigns' },
        { label: '品牌推广', value: 'branding' },
        { label: '渠道管理', value: 'channels' },
        { label: '数据分析', value: 'analytics' },
      ],
    },
    manager: {
      tech: [
        { label: '代码审查', value: 'code-review' },
        { label: '任务分配', value: 'task-assign' },
        { label: '进度管理', value: 'progress' },
      ],
      product: [
        { label: '需求管理', value: 'requirements' },
        { label: '数据分析', value: 'analytics' },
        { label: '用户反馈', value: 'feedback' },
      ],
      operation: [
        { label: '活动管理', value: 'activities' },
        { label: '用户运营', value: 'user-operation' },
        { label: '数据统计', value: 'statistics' },
      ],
      marketing: [
        { label: '营销活动', value: 'campaigns' },
        { label: '渠道管理', value: 'channels' },
        { label: '数据分析', value: 'analytics' },
      ],
    },
    user: {
      tech: [
        { label: '代码提交', value: 'commit' },
        { label: '任务查看', value: 'view-tasks' },
      ],
      product: [
        { label: '需求查看', value: 'view-requirements' },
        { label: '反馈提交', value: 'submit-feedback' },
      ],
      operation: [
        { label: '活动查看', value: 'view-activities' },
        { label: '数据查看', value: 'view-data' },
      ],
      marketing: [
        { label: '活动查看', value: 'view-campaigns' },
        { label: '数据查看', value: 'view-data' },
      ],
    },
  }

  return features[permission]?.[dept] || []
}

const formItems: FormItems = [
  {
    prop: 'department',
    label: '部门',
    compType: 'select',
    compProps: {
      options: departments,
    },
  },
  {
    prop: 'role',
    label: '角色',
    compType: 'select',
    compProps: {
      // 对象模式：依赖部门字段（内部依赖）
      options: {
        loader: (formData) => {
          const dept = formData.department as string | undefined
          if (!dept)
            return []

          // 根据部门返回不同的角色选项
          if (dept === 'tech')
            return techRoles
          if (dept === 'product')
            return productRoles
          if (dept === 'operation')
            return operationRoles
          if (dept === 'marketing')
            return marketingRoles

          return []
        },
        deps: ['department'], // 内部依赖：依赖部门字段
        immediate: true,
      },
    },
  },
  {
    prop: 'features',
    label: '功能权限',
    compType: 'select',
    compProps: {
      // 对象模式：同时依赖外部状态（permissionLevel）和表单字段（department, role）
      // 注意：配置了 deps 后，内部依赖通过 watch 监听，外部依赖通过 watchEffect 追踪（在 loader 中访问）
      options: {
        loader: (formData) => {
          const dept = formData.department as string | undefined
          const role = formData.role as string | undefined

          if (!dept || !role)
            return []

          // 通过闭包访问外部 ref：permissionLevel（外部依赖，watchEffect 会自动追踪）
          // 通过 formData 访问表单字段：department, role（内部依赖，通过 deps 配置）
          return getFeaturesByPermissionAndDept(permissionLevel.value, dept)
        },
        // 配置内部依赖：依赖部门和角色字段（内部依赖变化时触发）
        // 外部依赖（permissionLevel）通过闭包访问，watchEffect 会自动追踪
        deps: ['department', 'role'],
        immediate: true,
      },
    },
  },
]

const form = ref({})

function onChange(extendedParams: FormItemExtendedEventParams, value: any) {
  console.log('onChange', extendedParams, value)
}
</script>

<template>
  <el-card class="w-full" shadow="hover">
    <template #header>
      <h2 class="text-lg text-gray-800 font-semibold m-0">
        混合依赖测试（内部 + 外部）
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
            测试同时依赖内部依赖（表单字段）和外部依赖（外部 ref）的场景<br>
            部门：静态模式 | 角色：对象模式（deps: ['department']，内部依赖） | 功能权限：对象模式（deps: ['department', 'role']，内部依赖 + 闭包访问 permissionLevel，外部依赖）
          </p>
        </template>
      </el-alert>
      <el-alert
        type="success"
        :closable="false"
        show-icon
      >
        <template #title>
          <strong>外部状态（权限级别）：</strong>
        </template>
        <template #default>
          <div class="flex flex-wrap gap-2.5 items-center">
            <el-tag :type="permissionLevel === 'admin' ? 'danger' : permissionLevel === 'manager' ? 'warning' : 'success'">
              {{ permissionLevel === 'admin' ? '管理员' : permissionLevel === 'manager' ? '经理' : '普通用户' }}
            </el-tag>
            <el-button size="small" @click="permissionLevel = permissionLevel === 'admin' ? 'manager' : permissionLevel === 'manager' ? 'user' : 'admin'">
              切换权限级别
            </el-button>
            <span class="text-xs text-gray-600 italic">切换权限级别后，功能权限选项会根据权限级别、部门和角色动态更新</span>
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
      <el-alert
        type="warning"
        :closable="false"
        show-icon
      >
        <template #title>
          <h3 class="text-base text-gray-800 font-semibold m-0">
            测试步骤：
          </h3>
        </template>
        <template #default>
          <ol class="list-decimal ml-5 my-2">
            <li class="text-sm text-gray-600 my-1">
              选择部门（如：技术部）
            </li>
            <li class="text-sm text-gray-600 my-1">
              观察：角色选项会根据部门动态更新（内部依赖）
            </li>
            <li class="text-sm text-gray-600 my-1">
              选择角色（如：前端开发）
            </li>
            <li class="text-sm text-gray-600 my-1">
              观察：功能权限选项会根据权限级别、部门和角色动态更新（内部依赖 + 外部依赖）
            </li>
            <li class="text-sm text-gray-600 my-1">
              切换权限级别（点击按钮）
            </li>
            <li class="text-sm text-gray-600 my-1">
              观察：功能权限选项会根据新的权限级别更新（外部依赖变化）
            </li>
          </ol>
        </template>
      </el-alert>
    </el-space>
  </el-card>
</template>
