<script setup lang="ts">
import type { ActionConfig, FormItems, RowAttrs } from '@iswangh/element-plus-kit-form'
import { WForm } from '@iswangh/element-plus-kit'
import { ElMessage } from 'element-plus'

const form = ref({})
const formRef = ref<InstanceType<typeof WForm>>()

// 基础表单项（至少10个）
const baseFormItems: FormItems = [
  { prop: 'name', label: '姓名', comp: 'input' },
  { prop: 'age', label: '年龄', comp: 'input-number', compAttrs: { min: 0, max: 120 } },
  { prop: 'email', label: '邮箱', comp: 'input', compAttrs: { type: 'email' } },
  { prop: 'phone', label: '手机号', comp: 'input' },
  { prop: 'gender', label: '性别', comp: 'select', compAttrs: { options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] } },
  { prop: 'birthday', label: '生日', comp: 'date-picker', compAttrs: { type: 'date' } },
  { prop: 'address', label: '地址', comp: 'input' },
  { prop: 'city', label: '城市', comp: 'input' },
  { prop: 'province', label: '省份', comp: 'input' },
  { prop: 'postcode', label: '邮编', comp: 'input' },
  { prop: 'company', label: '公司', comp: 'input' },
  { prop: 'position', label: '职位', comp: 'input' },
  { prop: 'remark', label: '备注', comp: 'input' },
]

// 示例 1：count（前三个）
const actionConfig1: ActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { count: 3 },
}

// 示例 2：include（白名单：中间三个）
const actionConfig2: ActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { include: ['email', 'phone', 'gender'] },
}

// 示例 3：exclude（黑名单：中间三个）
const actionConfig3: ActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { exclude: ['email', 'phone', 'gender'] },
}

// 示例 4：受控模式（中间三个）
const actionConfig4: ActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { include: ['email', 'phone', 'gender'] },
}

// 示例 5：与 vIf 一起使用
const formItems5: FormItems = [
  { prop: 'name', label: '姓名', comp: 'input' },
  { prop: 'age', label: '年龄', comp: 'input-number', compAttrs: { min: 0, max: 120 } },
  { prop: 'email', label: '邮箱', comp: 'input', compAttrs: { type: 'email' } },
  { prop: 'phone', label: '手机号', comp: 'input', vIf: data => !!data?.email },
  { prop: 'gender', label: '性别', comp: 'select', compAttrs: { options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] }, vIf: data => !!data?.phone },
  { prop: 'birthday', label: '生日', comp: 'date-picker', compAttrs: { type: 'date' }, vIf: data => !!data?.gender },
  { prop: 'address', label: '地址', comp: 'input' },
  { prop: 'remark', label: '备注', comp: 'input' },
]

const actionConfig5: ActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { include: ['email', 'phone', 'gender'] },
}

// 示例 6：与 vShow 一起使用
const formItems6: FormItems = [
  { prop: 'name', label: '姓名', comp: 'input' },
  { prop: 'age', label: '年龄', comp: 'input-number', compAttrs: { min: 0, max: 120 } },
  { prop: 'email', label: '邮箱', comp: 'input', compAttrs: { type: 'email' } },
  { prop: 'phone', label: '手机号', comp: 'input', vShow: data => !!data?.email },
  { prop: 'gender', label: '性别', comp: 'select', compAttrs: { options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] }, vShow: data => !!data?.phone },
  { prop: 'birthday', label: '生日', comp: 'date-picker', compAttrs: { type: 'date' }, vShow: data => !!data?.gender },
  { prop: 'address', label: '地址', comp: 'input' },
  { prop: 'remark', label: '备注', comp: 'input' },
]

const actionConfig6: ActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { include: ['email', 'phone', 'gender'] },
}

// 示例 7：与 vIf vShow 一起使用
const formItems7: FormItems = [
  { prop: 'name', label: '姓名', comp: 'input' },
  { prop: 'age', label: '年龄', comp: 'input-number', compAttrs: { min: 0, max: 120 } },
  { prop: 'email', label: '邮箱', comp: 'input', compAttrs: { type: 'email' } },
  { prop: 'phone', label: '手机号', comp: 'input', vIf: data => !!data?.email, vShow: data => !!data?.email },
  { prop: 'gender', label: '性别', comp: 'select', compAttrs: { options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] }, vIf: data => !!data?.phone, vShow: data => !!data?.phone },
  { prop: 'birthday', label: '生日', comp: 'date-picker', compAttrs: { type: 'date' }, vIf: data => !!data?.gender, vShow: data => !!data?.gender },
  { prop: 'address', label: '地址', comp: 'input' },
  { prop: 'remark', label: '备注', comp: 'input' },
]

const actionConfig7: ActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { include: ['email', 'phone', 'gender'] },
}

// 示例 8：rowAttrs 和 colAttrs 布局配置（每行 4 个）
const formItems8: FormItems = [
  { prop: 'name', label: '姓名', comp: 'input', colAttrs: { span: 6 } },
  { prop: 'age', label: '年龄', comp: 'input-number', compAttrs: { min: 0, max: 120 }, colAttrs: { span: 6 } },
  { prop: 'email', label: '邮箱', comp: 'input', compAttrs: { type: 'email' }, colAttrs: { span: 6 } },
  { prop: 'phone', label: '手机号', comp: 'input', colAttrs: { span: 6 } },
  { prop: 'gender', label: '性别', comp: 'select', compAttrs: { options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] }, colAttrs: { span: 6 } },
  { prop: 'birthday', label: '生日', comp: 'date-picker', compAttrs: { type: 'date' }, colAttrs: { span: 6 } },
  { prop: 'address', label: '地址', comp: 'input', colAttrs: { span: 6 } },
  { prop: 'city', label: '城市', comp: 'input', colAttrs: { span: 6 } },
  { prop: 'province', label: '省份', comp: 'input', colAttrs: { span: 6 } },
  { prop: 'postcode', label: '邮编', comp: 'input', colAttrs: { span: 6 } },
  { prop: 'company', label: '公司', comp: 'input', colAttrs: { span: 6 } },
  { prop: 'position', label: '职位', comp: 'input', colAttrs: { span: 6 } },
  { prop: 'remark', label: '备注', comp: 'input', colAttrs: { span: 6 } },
]

const rowAttrs8: RowAttrs = {
  gutter: 20,
}

const actionConfig8: ActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { count: 6 },
}

// 示例 9：鼠标悬停自动展开/收起
const actionConfig9: ActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: { count: 3, autoExpandOnHover: true },
}

// 示例 10：使用对象数组配置 buttons（展开放在第一位）
const actionConfig10: ActionConfig = {
  buttons: [
    { eventName: 'expand', type: 'text' },
    { eventName: 'search', label: '搜索', type: 'primary' },
    { eventName: 'reset', label: '重置' },
  ],
  expand: { count: 3 },
}

// 示例 11：展开按钮使用圆形主题色 plain 样式
const actionConfig11: ActionConfig = {
  buttons: [
    { eventName: 'expand', type: 'primary', plain: true, circle: true },
    { eventName: 'search', label: '搜索', type: 'primary' },
    { eventName: 'reset', label: '重置' },
  ],
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
          @reset="onReset"
        />
        <el-alert type="info" :closable="false" show-icon class="m-t-4">
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
        <el-alert type="warning" :closable="false" show-icon class="mb-4">
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
      </el-card>

      <!-- 示例 6：与 vShow 一起使用 -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <h2 class="text-lg text-gray-800 font-semibold m-0">
            示例 6：与 vShow 一起使用（phone、gender、birthday 根据前一个字段联动显示）
          </h2>
        </template>
        <el-alert type="warning" :closable="false" show-icon class="mb-4">
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
      </el-card>

      <!-- 示例 7：与 vIf vShow 一起使用 -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <h2 class="text-lg text-gray-800 font-semibold m-0">
            示例 7：与 vIf vShow 一起使用（phone、gender、birthday 根据前一个字段联动显示）
          </h2>
        </template>
        <el-alert type="warning" :closable="false" show-icon class="mb-4">
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
      </el-card>

      <!-- 示例 8：rowAttrs 和 colAttrs 布局配置 -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <h2 class="text-lg text-gray-800 font-semibold m-0">
            示例 8：rowAttrs 和 colAttrs 布局配置（inline 模式，每行 4 个表单项）
          </h2>
        </template>
        <el-alert type="info" :closable="false" show-icon class="mb-4">
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：通过 <code>rowAttrs</code> 配置行布局（如 <code>gutter: 20</code>），通过 <code>colAttrs</code> 配置每个表单项的列布局（如 <code>span: 6</code> 表示每行 4 个表单项）。
            </p>
          </template>
        </el-alert>
        <WForm
          :model="form"
          inline
          :form-items="formItems8"
          :row-attrs="rowAttrs8"
          :action-config="actionConfig8"
          @reset="onReset"
        />
      </el-card>

      <!-- 示例 9：鼠标悬停自动展开/收起 -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <h2 class="text-lg text-gray-800 font-semibold m-0">
            示例 9：鼠标悬停自动展开/收起
          </h2>
        </template>
        <el-alert type="info" :closable="false" show-icon class="mb-4">
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
      </el-card>

      <!-- 示例 10：使用对象数组配置 buttons（展开放在第一位） -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <h2 class="text-lg text-gray-800 font-semibold m-0">
            示例 10：使用对象数组配置 buttons（展开放在第一位）
          </h2>
        </template>
        <el-alert type="info" :closable="false" show-icon class="mb-4">
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：通过对象数组配置 <code>buttons</code>，可以自定义按钮的顺序和属性。
              <br>
              <strong>配置说明</strong>：
              <br>
              • 展开按钮放在第一位，使用 <code>type: 'text'</code> 样式
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
      </el-card>

      <!-- 示例 11：展开按钮使用圆形主题色 plain 样式 -->
      <el-card class="w-full" shadow="hover">
        <template #header>
          <h2 class="text-lg text-gray-800 font-semibold m-0">
            示例 11：展开按钮使用圆形主题色 plain 样式
          </h2>
        </template>
        <el-alert type="info" :closable="false" show-icon class="mb-4">
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
