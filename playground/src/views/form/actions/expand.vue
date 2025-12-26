<script setup lang="ts">
import type { FormActionConfig, FormItems } from '@iswangh/element-plus-kit'
import { WForm } from '@iswangh/element-plus-kit'

const form = ref({})
const formRef = ref<InstanceType<typeof WForm>>()

// 基础表单项（至少10个）
const baseFormItems: FormItems = [
  { prop: 'name', label: '姓名', compType: 'input' },
  { prop: 'age', label: '年龄', compType: 'input-number', compProps: { min: 0, max: 120 } },
  { prop: 'email', label: '邮箱', compType: 'input', compProps: { type: 'email' } },
  { prop: 'phone', label: '手机号', compType: 'input' },
  { prop: 'gender', label: '性别', compType: 'select', compProps: { options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] } },
  { prop: 'birthday', label: '生日', compType: 'date-picker', compProps: { type: 'date' } },
  { prop: 'address', label: '地址', compType: 'input' },
  { prop: 'city', label: '城市', compType: 'input' },
  { prop: 'province', label: '省份', compType: 'input' },
  { prop: 'postcode', label: '邮编', compType: 'input' },
  { prop: 'company', label: '公司', compType: 'input' },
  { prop: 'position', label: '职位', compType: 'input' },
  { prop: 'remark', label: '备注', compType: 'input' },
]

// 示例 1：count（前三个）
const actionConfig1: FormActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { count: 3 },
}

// 示例 2：include（白名单：中间三个）
const actionConfig2: FormActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { include: ['email', 'phone', 'gender'] },
}

// 示例 3：exclude（黑名单：中间三个）
const actionConfig3: FormActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { exclude: ['email', 'phone', 'gender'] },
}

// 示例 4：受控模式（中间三个）
const actionConfig4: FormActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { include: ['email', 'phone', 'gender'] },
}

// 示例 5：与 vIf 一起使用
const formItems5: FormItems = [
  { prop: 'name', label: '姓名', compType: 'input' },
  { prop: 'age', label: '年龄', compType: 'input-number', compProps: { min: 0, max: 120 } },
  { prop: 'email', label: '邮箱', compType: 'input', compProps: { type: 'email' } },
  { prop: 'phone', label: '手机号', compType: 'input', vIf: data => !!data?.email },
  { prop: 'gender', label: '性别', compType: 'select', compProps: { options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] }, vIf: data => !!data?.phone },
  { prop: 'birthday', label: '生日', compType: 'date-picker', compProps: { type: 'date' }, vIf: data => !!data?.gender },
  { prop: 'address', label: '地址', compType: 'input' },
  { prop: 'remark', label: '备注', compType: 'input' },
]

const actionConfig5: FormActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { include: ['email', 'phone', 'gender'] },
}

// 示例 6：与 vShow 一起使用
const formItems6: FormItems = [
  { prop: 'name', label: '姓名', compType: 'input' },
  { prop: 'age', label: '年龄', compType: 'input-number', compProps: { min: 0, max: 120 } },
  { prop: 'email', label: '邮箱', compType: 'input', compProps: { type: 'email' } },
  { prop: 'phone', label: '手机号', compType: 'input', vShow: data => !!data?.email },
  { prop: 'gender', label: '性别', compType: 'select', compProps: { options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] }, vShow: data => !!data?.phone },
  { prop: 'birthday', label: '生日', compType: 'date-picker', compProps: { type: 'date' }, vShow: data => !!data?.gender },
  { prop: 'address', label: '地址', compType: 'input' },
  { prop: 'remark', label: '备注', compType: 'input' },
]

const actionConfig6: FormActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { include: ['email', 'phone', 'gender'] },
}

// 示例 7：与 vIf vShow 一起使用
const formItems7: FormItems = [
  { prop: 'name', label: '姓名', compType: 'input' },
  { prop: 'age', label: '年龄', compType: 'input-number', compProps: { min: 0, max: 120 } },
  { prop: 'email', label: '邮箱', compType: 'input', compProps: { type: 'email' } },
  { prop: 'phone', label: '手机号', compType: 'input', vIf: data => !!data?.email, vShow: data => !!data?.email },
  { prop: 'gender', label: '性别', compType: 'select', compProps: { options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] }, vIf: data => !!data?.phone, vShow: data => !!data?.phone },
  { prop: 'birthday', label: '生日', compType: 'date-picker', compProps: { type: 'date' }, vIf: data => !!data?.gender, vShow: data => !!data?.gender },
  { prop: 'address', label: '地址', compType: 'input' },
  { prop: 'remark', label: '备注', compType: 'input' },
]

const actionConfig7: FormActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { include: ['email', 'phone', 'gender'] },
}

// 示例 8：rowProps 和 colProps 布局配置（每行 4 个）
const formItems8: FormItems = [
  { prop: 'name', label: '姓名', compType: 'input', colProps: { span: 6 } },
  { prop: 'age', label: '年龄', compType: 'input-number', compProps: { min: 0, max: 120 }, colProps: { span: 6 } },
  { prop: 'email', label: '邮箱', compType: 'input', compProps: { type: 'email' }, colProps: { span: 6 } },
  { prop: 'phone', label: '手机号', compType: 'input', colProps: { span: 6 } },
  { prop: 'gender', label: '性别', compType: 'select', compProps: { options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] }, colProps: { span: 6 } },
  { prop: 'birthday', label: '生日', compType: 'date-picker', compProps: { type: 'date' }, colProps: { span: 6 } },
  { prop: 'address', label: '地址', compType: 'input', colProps: { span: 6 } },
  { prop: 'city', label: '城市', compType: 'input', colProps: { span: 6 } },
  { prop: 'province', label: '省份', compType: 'input', colProps: { span: 6 } },
  { prop: 'postcode', label: '邮编', compType: 'input', colProps: { span: 6 } },
  { prop: 'company', label: '公司', compType: 'input', colProps: { span: 6 } },
  { prop: 'position', label: '职位', compType: 'input', colProps: { span: 6 } },
  { prop: 'remark', label: '备注', compType: 'input', colProps: { span: 6 } },
]

const rowProps8 = {
  gutter: 20,
}

const actionConfig8: FormActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { count: 6 },
}

// 示例 9：鼠标悬停自动展开/收起
const actionConfig9: FormActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { count: 3, autoExpandOnHover: true },
}

// 示例 10：使用对象数组配置 buttons（展开放在第一位）
const actionConfig10: FormActionConfig = {
  buttons: [
    { eventName: 'expand', link: true }, // Element Plus 2.x 推荐使用 link 属性替代 type: 'text'
    { eventName: 'search', label: '搜索', type: 'primary' },
    { eventName: 'reset', label: '重置' },
  ],
  expand: { count: 3 },
}

// 示例 11：展开按钮使用圆形主题色 plain 样式
const actionConfig11: FormActionConfig = {
  buttons: [
    { eventName: 'expand', type: 'primary', plain: true, circle: true },
    { eventName: 'search', label: '搜索', type: 'primary' },
    { eventName: 'reset', label: '重置' },
  ],
  expand: { count: 3 },
}

// 示例 12：v-model:expanded 双向绑定（受控模式）
const isExpanded12 = ref(false)
const actionConfig12: FormActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { count: 3 },
}

// 示例 13：展开/收起后自动滚动到表单中心
const actionConfig13: FormActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: {
    count: 3,
    scrollOnToggle: true,
    scrollIntoViewOptions: {
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    },
  },
}

// 测试区域：滚动选项配置
const scrollBlockOptions = [
  { label: '顶部', value: 'start' },
  { label: '中心', value: 'center' },
  { label: '底部', value: 'end' },
  { label: '最近', value: 'nearest' },
] as const

const scrollBehaviorOptions = [
  { label: '平滑', value: 'smooth' },
  { label: '立即', value: 'auto' },
] as const

const selectedScrollBlock = ref<ScrollLogicalPosition>('center')
const selectedScrollBehavior = ref<ScrollBehavior>('smooth')

// 测试区域的 actionConfig（动态配置 scrollIntoViewOptions）
const testActionConfig = computed<FormActionConfig>(() => ({
  buttons: ['search', 'reset', 'expand'],
  expand: {
    count: 3,
    scrollOnToggle: true,
    scrollIntoViewOptions: {
      behavior: selectedScrollBehavior.value,
      block: selectedScrollBlock.value,
      inline: 'nearest',
    },
  },
}))

// 手动控制方法
function expandForm() {
  formRef.value?.toggleExpand(true)
}

function collapseForm() {
  formRef.value?.toggleExpand(false)
}

function toggleForm() {
  formRef.value?.toggleExpand()
}

// 计算属性：当前展开状态（用于模板显示）
const currentExpanded = computed(() => formRef.value?.expanded ?? false)

/**
 * 处理重置事件
 * 将重置数据合并到表单模型中
 *
 * @param resetData - 重置数据对象
 */
function onReset(resetData: Record<string, unknown>) {
  for (const [key, value] of Object.entries(resetData)) {
    if (value === undefined)
      delete (form.value as Record<string, unknown>)[key]
    else
      (form.value as Record<string, unknown>)[key] = value
  }
}
</script>

<template>
  <div>
    <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
    <el-affix :offset="0">
      <el-alert type="info" :closable="false" show-icon>
        <template #default>
          <p class="text-sm text-gray-600 m-0">
            <strong>注意</strong>：展开/折叠功能仅在 <code>inline</code> 模式下有效，按钮位置固定在 action 按钮右侧。
            对于默认布局（非 inline），建议使用 <code>el-collapse</code> 组件包裹表单。
          </p>
        </template>
      </el-alert>
    </el-affix>
    <div class="mb-4" />
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
          @reset="onReset"
        />
      </el-card>

      <!-- 示例 2：include（白名单） -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <h2 class="text-lg text-gray-800 font-semibold m-0">
            示例 2：include（白名单：中间三个：email、phone、gender）
          </h2>
        </template>
        <WForm
          :model="form"
          inline
          :form-items="baseFormItems"
          :action-config="actionConfig2"
          @reset="onReset"
        />
      </el-card>

      <!-- 示例 3：exclude（黑名单） -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <h2 class="text-lg text-gray-800 font-semibold m-0">
            示例 3：exclude（黑名单：中间三个：email、phone、gender）
          </h2>
        </template>
        <WForm
          :model="form"
          inline
          :form-items="baseFormItems"
          :action-config="actionConfig3"
          @reset="onReset"
        />
      </el-card>

      <!-- 示例 4：受控模式（中间三个） -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg text-gray-800 font-semibold m-0">
              示例 4：受控模式（中间三个：email、phone、gender）
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
              <el-button size="small" disabled>
                状态：{{ currentExpanded ? '展开' : '折叠' }}
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
          @reset="onReset"
        />
        <el-alert type="info" :closable="false" show-icon class="mt-4">
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              当前展开状态：{{ currentExpanded ? '展开' : '折叠' }}
            </p>
          </template>
        </el-alert>
      </el-card>

      <!-- 示例 5：与 vIf 一起使用 -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <h2 class="text-lg text-gray-800 font-semibold m-0">
            示例 5：与 vIf 一起使用（phone、gender、birthday 根据前一个字段联动显示）
          </h2>
        </template>
        <el-space class="w-full" direction="vertical" :size="20" fill>
          <el-alert type="warning" :closable="false" show-icon>
            <template #default>
              <p class="text-sm text-gray-600 m-0">
                说明：输入邮箱后，手机号才会显示；输入手机号后，性别才会显示；选择性别后，生日才会显示。
              </p>
            </template>
          </el-alert>
          <WForm
            :model="form"
            inline
            :form-items="formItems5"
            :action-config="actionConfig5"
            @reset="onReset"
          />
        </el-space>
      </el-card>

      <!-- 示例 6：与 vShow 一起使用 -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <h2 class="text-lg text-gray-800 font-semibold m-0">
            示例 6：与 vShow 一起使用（phone、gender、birthday 根据前一个字段联动显示）
          </h2>
        </template>
        <el-space class="w-full" direction="vertical" :size="20" fill>
          <el-alert type="warning" :closable="false" show-icon>
            <template #default>
              <p class="text-sm text-gray-600 m-0">
                说明：输入邮箱后，手机号才会显示；输入手机号后，性别才会显示；选择性别后，生日才会显示。
              </p>
            </template>
          </el-alert>
          <WForm
            :model="form"
            inline
            :form-items="formItems6"
            :action-config="actionConfig6"
            @reset="onReset"
          />
        </el-space>
      </el-card>

      <!-- 示例 7：与 vIf vShow 一起使用 -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <h2 class="text-lg text-gray-800 font-semibold m-0">
            示例 7：与 vIf vShow 一起使用（phone、gender、birthday 根据前一个字段联动显示）
          </h2>
        </template>
        <el-space class="w-full" direction="vertical" :size="20" fill>
          <el-alert type="warning" :closable="false" show-icon>
            <template #default>
              <p class="text-sm text-gray-600 m-0">
                说明：输入邮箱后，手机号才会显示；输入手机号后，性别才会显示；选择性别后，生日才会显示。
              </p>
            </template>
          </el-alert>
          <WForm
            :model="form"
            inline
            :form-items="formItems7"
            :action-config="actionConfig7"
            @reset="onReset"
          />
        </el-space>
      </el-card>

      <!-- 示例 8：rowProps 和 colProps 布局配置 -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <h2 class="text-lg text-gray-800 font-semibold m-0">
            示例 8：rowProps 和 colProps 布局配置（inline 模式，每行 4 个表单项）
          </h2>
        </template>
        <el-space class="w-full" direction="vertical" :size="20" fill>
          <el-alert type="info" :closable="false" show-icon>
            <template #default>
              <p class="text-sm text-gray-600 m-0">
                说明：通过 <code>rowProps</code> 配置行布局（如 <code>gutter: 20</code>），通过 <code>colProps</code> 配置每个表单项的列布局（如 <code>span: 6</code> 表示每行 4 个表单项）。
              </p>
            </template>
          </el-alert>
          <WForm
            :model="form"
            inline
            :form-items="formItems8"
            :row-props="rowProps8"
            :action-config="actionConfig8"
            @reset="onReset"
          />
        </el-space>
      </el-card>

      <!-- 示例 9：鼠标悬停自动展开/收起 -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <h2 class="text-lg text-gray-800 font-semibold m-0">
            示例 9：鼠标悬停自动展开/收起
          </h2>
        </template>
        <el-space class="w-full" direction="vertical" :size="20" fill>
          <el-alert type="info" :closable="false" show-icon>
            <template #default>
              <p class="text-sm text-gray-600 m-0">
                说明：通过 <code>expand: { count: 3, autoExpandOnHover: true }</code> 启用鼠标悬停自动展开功能。
                <br>
                <strong>交互说明</strong>：
                <br>
                • 鼠标移入展开图标区域时，表单会自动展开（延迟 500ms）
                <br>
                • 如果手动点击展开/收起按钮，则锁定状态，不再受鼠标移入影响
              </p>
            </template>
          </el-alert>
          <WForm
            :model="form"
            inline
            :form-items="baseFormItems"
            :action-config="actionConfig9"
            @reset="onReset"
          />
        </el-space>
      </el-card>

      <!-- 示例 10：使用对象数组配置 buttons（展开放在第一位） -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <h2 class="text-lg text-gray-800 font-semibold m-0">
            示例 10：使用对象数组配置 buttons（展开放在第一位）
          </h2>
        </template>
        <el-space class="w-full" direction="vertical" :size="20" fill>
          <el-alert type="info" :closable="false" show-icon>
            <template #default>
              <p class="text-sm text-gray-600 m-0">
                说明：通过对象数组配置 <code>buttons</code>，可以自定义按钮的顺序和属性。
                <br>
                <strong>配置说明</strong>：
                <br>
                • 展开按钮放在第一位，使用 <code>link: true</code> 属性（Element Plus 2.x 推荐使用 link 属性替代 type: 'text'）
                <br>
                • 搜索按钮使用 <code>type: 'primary'</code> 样式
                <br>
                • 重置按钮使用默认样式
              </p>
            </template>
          </el-alert>
          <WForm
            :model="form"
            inline
            :form-items="baseFormItems"
            :action-config="actionConfig10"
            @reset="onReset"
          />
        </el-space>
      </el-card>

      <!-- 示例 11：展开按钮使用圆形主题色 plain 样式 -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <h2 class="text-lg text-gray-800 font-semibold m-0">
            示例 11：展开按钮使用圆形主题色 plain 样式
          </h2>
        </template>
        <el-space class="w-full" direction="vertical" :size="20" fill>
          <el-alert type="info" :closable="false" show-icon>
            <template #default>
              <p class="text-sm text-gray-600 m-0">
                说明：通过对象数组配置 <code>buttons</code>，可以自定义展开按钮的样式。
                <br>
                <strong>配置说明</strong>：
                <br>
                • 展开按钮使用 <code>type: 'primary'</code> 主题色
                <br>
                • 使用 <code>plain: true</code> 实现 plain 样式（浅色背景）
                <br>
                • 使用 <code>circle: true</code> 实现圆形按钮
              </p>
            </template>
          </el-alert>
          <WForm
            :model="form"
            inline
            :form-items="baseFormItems"
            :action-config="actionConfig11"
            @reset="onReset"
          />
        </el-space>
      </el-card>

      <!-- 示例 12：v-model:expanded 双向绑定（受控模式） -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg text-gray-800 font-semibold m-0">
              示例 12：v-model:expanded 双向绑定（受控模式）
            </h2>
            <div class="flex gap-2">
              <el-button size="small" @click="isExpanded12 = true">
                展开
              </el-button>
              <el-button size="small" @click="isExpanded12 = false">
                折叠
              </el-button>
              <el-button size="small" @click="isExpanded12 = !isExpanded12">
                切换
              </el-button>
            </div>
          </div>
        </template>
        <el-space class="w-full" direction="vertical" :size="20" fill>
          <el-alert type="info" :closable="false" show-icon>
            <template #default>
              <p class="text-sm text-gray-600 m-0">
                说明：通过 <code>v-model:expanded</code> 实现双向绑定，外部可以完全控制展开/折叠状态。
                <br>
                <strong>使用场景</strong>：
                <br>
                • 配合路由缓存（keep-alive）保持状态
                <br>
                • 配合 localStorage/sessionStorage 实现持久化
                <br>
                • 多个表单实例共享展开状态
                <br>
                <strong>当前状态</strong>：{{ isExpanded12 ? '展开' : '折叠' }}
              </p>
            </template>
          </el-alert>
          <WForm
            v-model:expanded="isExpanded12"
            :model="form"
            inline
            :form-items="baseFormItems"
            :action-config="actionConfig12"
            @reset="onReset"
          />
        </el-space>
      </el-card>

      <!-- 示例 13：展开/收起后自动滚动到表单中心 -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <h2 class="text-lg text-gray-800 font-semibold m-0">
            示例 13：展开/收起后自动滚动到表单中心
          </h2>
        </template>
        <el-space class="w-full" direction="vertical" :size="20" fill>
          <el-alert type="info" :closable="false" show-icon>
            <template #default>
              <p class="text-sm text-gray-600 m-0">
                说明：通过 <code>expand: { count: 3, scrollOnToggle: true, scrollIntoViewOptions: {...} }</code> 启用展开/收起后自动滚动功能。
                <br>
                <strong>功能说明</strong>：
                <br>
                • 展开/收起动画完成后（延迟 250ms），表单会自动滚动到指定位置
                <br>
                • 默认滚动到页面中心（<code>block: 'center'</code>），使用平滑滚动动画（<code>behavior: 'smooth'</code>）
                <br>
                • 可通过 <code>scrollIntoViewOptions</code> 自定义滚动行为（如 <code>block: 'start'</code> 滚动到顶部，<code>block: 'end'</code> 滚动到底部）
                <br>
                • 适用于表单较长，展开/收起后需要重新定位的场景
              </p>
            </template>
          </el-alert>
          <WForm
            :model="form"
            inline
            :form-items="baseFormItems"
            :action-config="actionConfig13"
            @reset="onReset"
          />
        </el-space>
      </el-card>

      <!-- 测试区域：展开/收起后自动滚动到表单中心 -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <h2 class="text-lg text-gray-800 font-semibold m-0">
            测试区域：展开/收起后自动滚动到表单中心
          </h2>
        </template>
        <el-space class="w-full" direction="vertical" :size="20" fill>
          <el-alert type="warning" :closable="false" show-icon>
            <template #default>
              <p class="text-sm text-gray-600 m-0">
                <strong>测试说明</strong>：此区域用于测试自动滚动功能。请先滚动页面，然后点击展开/收起按钮，观察表单是否自动滚动到指定位置。
              </p>
            </template>
          </el-alert>
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-4 flex-wrap">
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">滚动位置：</span>
                <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
                <el-radio-group v-model="selectedScrollBlock" size="small">
                  <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
                  <el-radio-button
                    v-for="option in scrollBlockOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </el-radio-button>
                </el-radio-group>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">滚动行为：</span>
                <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
                <el-radio-group v-model="selectedScrollBehavior" size="small">
                  <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
                  <el-radio-button
                    v-for="option in scrollBehaviorOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="mt-2 text-xs text-gray-500">
              当前配置：<code>{{ JSON.stringify(testActionConfig.expand?.scrollIntoViewOptions) }}</code>
            </div>
          </div>
          <div class="h-screen bg-gray-100 flex items-center justify-center">
            <p class="text-gray-500">
              上方空白区域（用于测试滚动）
            </p>
          </div>
          <WForm
            :model="form"
            inline
            :form-items="baseFormItems"
            :action-config="testActionConfig"
            @reset="onReset"
          />
          <div class="h-screen bg-gray-100 flex items-center justify-center">
            <p class="text-gray-500">
              下方空白区域（用于测试滚动）
            </p>
          </div>
        </el-space>
      </el-card>
    </el-space>
  </div>
</template>

<style lang="scss" scoped>
</style>
