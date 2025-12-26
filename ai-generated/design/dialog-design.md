# Dialog 组件完整设计方案

> 本文档包含 Dialog 组件的完整设计需求、API 设计和实现方案。

## 目录

- [需求概述](#需求概述)
- [核心需求](#核心需求)
- [API 设计](#api-设计)
- [使用示例](#使用示例)
- [实现细节](#实现细节)
- [实现优先级](#实现优先级)

---

## 需求概述

### 设计目标

基于 `el-dialog` 提供**组合式函数方案**：
- **组合式函数（useDialog）**：灵活强大，适合所有场景

**核心功能支持：**
- ✅ 直接使用 `v-model` 控制弹窗显示/隐藏（唯一方式，使用 `modelValue` 命名，符合 Vue 3 标准和 Element Plus 规范）
- ✅ **不暴露 `open()` 和 `close()` 方法**，保持 API 简洁，只使用 v-model
- ✅ 完整的生命周期钩子支持（支持异步，通过 watch modelValue 自动触发）
- ✅ 内置 loading 状态管理（全局和按钮级别）
- ✅ 支持多个弹窗实例（自动管理 z-index）
- ✅ 完全透传 Element Plus Dialog 的所有属性
- ✅ 默认值与 Element Plus Dialog 保持一致

### 方案说明

**组合式函数（useDialog）**
- ✅ 灵活强大，适合动态创建、多实例、复杂逻辑
- ✅ 代码量更少，开发效率更高
- ✅ 自动管理多实例，无需手动处理
- ✅ 完整的 TypeScript 类型推断
- ✅ **完全独立使用**：通过 `createDialogApp` 自动创建和挂载 Vue 应用，弹窗自动渲染到 DOM，**无需在模板中添加任何组件**

### 包结构

- **包名**：`@iswangh/element-plus-kit`
- **位置**：`packages/dialog/`
- **依赖**：无（独立包，不依赖其他内部包）

---

## 核心需求

### 1. 使用 v-model 控制弹窗（不暴露 open/close 方法）

**需求：**
- 只使用 `v-model`（`modelValue.value = true/false`）控制弹窗
- **不暴露 `open()` 和 `close()` 方法**，保持 API 简洁
- 通过 `watch modelValue` 自动触发生命周期钩子

**实现：**
```typescript
const { modelValue } = dialog.use({ ... })

// 唯一方式：直接使用 v-model
modelValue.value = true  // 打开弹窗（自动触发 onOpened）
modelValue.value = false // 关闭弹窗（自动触发 onBeforeClose 和 onClosed）

// 注意：不提供 open/close 方法，保持 API 简洁
// 如果需要在打开前处理逻辑，可以在设置 modelValue.value = true 之前处理
```

### 2. onOpened 钩子支持异步和数据传递

**需求：**
- `onOpened` 钩子在弹窗打开后执行
- 支持同步和异步函数
- 用户可以在 `onOpened` 中执行业务逻辑（如加载数据）
- **关键**：`onOpened` 中请求的数据需要在内容区域、header、footer 中使用

**实现：**
```typescript
// 方式1：使用响应式数据（推荐）
const userData = ref(null)
const { modelValue } = dialog.use({
  // content 渲染函数接收 instance 参数，可以访问响应式状态
  content: (instance) => h('div', [
    // 使用响应式数据，自动更新
    userData.value ? h('div', `用户名: ${userData.value.username}`) : h('div', '加载中...')
  ]),
  
  // slots 的渲染函数也接收 instance 参数，可以访问响应式状态
  slots: {
    header: (instance) => h('div', [
      // 在 header 中使用响应式数据
      userData.value ? h('span', `用户: ${userData.value.username}`) : h('span', '加载中...')
    ]),
    footer: (instance) => h('div', [
      // 在 footer 中使用响应式数据
      h(ElButton, {
        onClick: () => {
          // 可以访问 userData
          console.log('用户数据:', userData.value)
        }
      }, '操作')
    ]),
  },
  
  onOpened: async () => {
    // 请求数据，更新响应式变量
    userData.value = await fetchUserData()
    // content、header、footer 都会自动更新（响应式）
  }
})

// 方式2：content 和 slots 渲染函数接收 instance 参数，访问 instance 状态
const { modelValue, loading } = dialog.use({
  content: (instance) => {
    // 可以访问 instance 的所有状态
    return h('div', [
      instance.loading.value ? h('div', '加载中...') : h('div', '内容')
    ])
  },
  slots: {
    header: (instance) => h('div', [
      // 在 header 中访问 instance 状态
      instance.loading.value ? h('span', '加载中...') : h('span', '标题')
    ]),
  },
  onOpened: async () => {
    loading.value = true
    await loadData()
    loading.value = false
  }
})

// 打开弹窗
modelValue.value = true // onOpened 会自动触发
```

### 3. 内置 loading 状态管理

**需求：**
- **全局 loading（遮罩层）**：只作用在弹窗内容区域，不是整个弹窗
- 按钮 loading：支持多个按钮的 loading 状态
- 用户只需控制 loading 状态，组件自动显示遮罩层

**实现：**
```typescript
const { modelValue, loading, buttonLoadings, confirmLoading, cancelLoading } = dialog.use({
  content: () => h(MyComponent),
})

// 全局 loading（自动显示遮罩层，只作用在内容区域）
loading.value = true
await loadData()
loading.value = false

// 按钮 loading
confirmLoading.value = true  // 确认按钮
cancelLoading.value = true    // 取消按钮
buttonLoadings.value.draft = true  // 自定义按钮（如草稿）
```

**注意：**
- 全局 loading 使用 `v-loading` 指令，只作用在弹窗内容区域（`#default` 插槽）
- 不会影响弹窗的 header 和 footer 区域
- 不会影响整个页面

### 4. 支持 onBeforeClose

**需求：**
- `onBeforeClose` 钩子在关闭前执行
- 支持阻止关闭（返回 `false`）
- 支持异步函数

**实现：**
```typescript
const { visible, close } = dialog.use({
  onBeforeClose: async (done) => {
    if (hasUnsavedChanges()) {
      const confirmed = await ElMessageBox.confirm('确定关闭？')
      if (confirmed) {
        done() // 继续关闭
      } else {
        return false // 阻止关闭
      }
    } else {
      done() // 直接关闭
    }
  }
})
```

### 5. 支持多个弹窗实例

**需求：**
- 同一页面可以同时打开多个弹窗
- 自动管理 z-index（递增）
- ESC 键关闭最上层弹窗

**实现：**
```typescript
const dialog = useDialog()

const dialog1 = dialog.use({ title: '弹窗1' })
const dialog2 = dialog.use({ title: '弹窗2' })
const dialog3 = dialog.use({ title: '弹窗3' })

dialog1.visible.value = true // z-index: 2000
dialog2.visible.value = true // z-index: 2001
dialog3.visible.value = true // z-index: 2002
```

### 6. 完全透传 Element Plus Dialog 属性、事件、插槽

**需求：**
- 所有 `el-dialog` 的属性、事件、插槽直接透传
- **不重复定义** el-dialog 已有的属性、事件、插槽（包括类型）
- 不需要额外实现 `el-dialog` 已有的功能（如 `closeOnPressEscape`、`closeOnClickModal`、`destroyOnClose` 等）
- 默认值与 `el-dialog` 保持一致

**实现：**
```typescript
// 直接继承 ElDialogProps，不重复定义
interface DialogOptions extends Partial<ElDialogProps> {
  // 只添加我们自己的扩展属性
  content?: string | VNode | Component | ((instance: DialogInstance) => VNode)
  onOpened?: () => void | Promise<void>
  onBeforeClose?: (done: () => void) => boolean | Promise<boolean> | void
  onClosed?: () => void | Promise<void>
  loading?: Ref<boolean>
  buttonLoadings?: Ref<Record<string, boolean>>
}

// el-dialog 的事件（如 @open、@opened、@close、@closed 等）直接透传
// el-dialog 的插槽（如 #header、#footer、#title、#default 等）直接透传
// el-dialog 的属性（如 destroyOnClose、closeOnPressEscape 等）直接透传
```

### 6.1. 内容区域滚动控制（内置 el-scrollbar）

**需求：**
- `el-scrollbar` 始终内置使用，提供统一的滚动体验
- 用户通过 `scrollbarProps` 配置滚动条属性（如 `maxHeight`）
- 避免内容过多时弹窗连带整个页面一起滚动
- 内容超出时，内容区域内部滚动，弹窗本身不滚动

**实现方案：**
- `el-scrollbar` 始终包裹内容区域，无需用户判断是否使用
- 通过 `scrollbarProps` 传递 `el-scrollbar` 的属性（如 `maxHeight`、`height` 等）
- 如果没有设置 `maxHeight`，则不限制高度，但依然使用 `el-scrollbar`（提供统一的滚动体验）

**实现：**
```typescript
interface DialogOptions extends Partial<ElDialogProps> {
  // ... 其他属性
  /**
   * el-scrollbar 的属性配置
   * 用于控制内容区域的滚动行为
   * 常用属性：maxHeight（最大高度）、height（固定高度）等
   */
  scrollbarProps?: Partial<ElScrollbarProps>
}
```

**使用示例：**
```typescript
const { modelValue } = dialog.use({
  title: '编辑用户',
  scrollbarProps: {
    maxHeight: '60vh', // 内容区域最大高度为 60vh
  },
  content: () => h('div', [/* 大量内容 */]),
})

// 或者不限制高度（但依然使用 el-scrollbar）
const { modelValue } = dialog.use({
  title: '编辑用户',
  // 不设置 scrollbarProps 或 scrollbarProps.maxHeight，则不限制高度
  content: () => h('div', [/* 内容 */]),
})

// 或者设置固定高度
const { modelValue } = dialog.use({
  title: '编辑用户',
  scrollbarProps: {
    height: '400px', // 固定高度
  },
  content: () => h('div', [/* 内容 */]),
})
```

### 7. 全屏配置

**需求：**
- 支持 `fullscreen` 配置（默认 `false`）
- 直接透传给 `el-dialog`（不需要额外实现）

**实现：**
```typescript
const { visible } = dialog.use({
  fullscreen: true, // 全屏弹窗（el-dialog 属性）
})
```

### 8. 页面级别全局配置（继承和覆盖）

**需求：**
- 支持页面级别的全局配置
- `dialog.use()` 时继承全局配置，相同属性则覆盖

**实现：**
```typescript
// 创建带全局配置的 dialog 实例
const dialog = useDialog({
  // 多个弹窗共用的属性
  width: '600px',
  closeOnClickModal: false,
  destroyOnClose: true,
})

// 继承全局配置
const dialog1 = dialog.use({
  title: '弹窗1',
  // width 会使用全局配置的 '600px'
  // closeOnClickModal 会使用全局配置的 false
})

// 覆盖全局配置
const dialog2 = dialog.use({
  title: '弹窗2',
  width: '800px', // 覆盖全局配置的 '600px'
  // closeOnClickModal 仍然使用全局配置的 false
})
```

### 9. modelValue 变化自动触发逻辑

**需求：**
- 用户直接使用 `modelValue.value = true/false` 时，需要自动触发生命周期钩子
- 通过 watch modelValue 变化实现
- **不暴露 open/close 方法**，保持 API 简洁

**实现：**
```typescript
// watch modelValue 变化，自动触发相关逻辑
watch(modelValue, async (newVal) => {
  if (newVal) {
    // 打开时：触发 onOpened
    await nextTick()
    if (options.onOpened) {
      await Promise.resolve(options.onOpened())
    }
  } else {
    // 关闭时：先执行 onBeforeClose（通过 el-dialog 的 before-close 事件），然后触发 onClosed
    await nextTick()
    if (options.onClosed) {
      await Promise.resolve(options.onClosed())
    }
  }
})
```

---

## API 设计

### 核心接口

```typescript
/**
 * Dialog 选项
 * 
 * 注意：
 * - 继承 ElDialogProps，直接透传所有 el-dialog 的属性、事件、插槽
 * - 不重复定义 el-dialog 已有的属性、事件、插槽
 * - 只添加我们自己的扩展属性
 */
interface DialogOptions extends Partial<ElDialogProps> {
  /**
   * 内容（支持字符串、VNode、组件、渲染函数）
   * 渲染函数接收 instance 参数，可以访问响应式状态
   */
  content?: string | VNode | Component | ((instance: DialogInstance) => VNode)
  
  /**
   * el-scrollbar 的属性配置
   * 用于控制内容区域的滚动行为
   * 常用属性：maxHeight（最大高度）、height（固定高度）等
   * el-scrollbar 始终内置使用，提供统一的滚动体验
   */
  scrollbarProps?: Partial<ElScrollbarProps>
  
  /**
   * 生命周期钩子
   */
  onOpened?: () => void | Promise<void>
  onBeforeClose?: (done: () => void) => boolean | Promise<boolean> | void
  onClosed?: () => void | Promise<void>
  
  /**
   * 业务操作钩子（可选，提供快捷方式）
   * 如果用户需要自定义按钮，可以不使用这些钩子，自己定义按钮和事件处理
   */
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  
  /**
   * Loading 状态（可选，如果传入则使用用户的，否则使用内部的）
   * 全局 loading 只作用在弹窗内容区域，不是整个弹窗
   */
  loading?: Ref<boolean>
  buttonLoadings?: Ref<Record<string, boolean>>
}

/**
 * Dialog 实例
 */
interface DialogInstance {
  /**
   * v-model 绑定的响应式值（唯一控制方式）
   * 直接设置 modelValue.value = true/false 即可控制弹窗
   * 使用 modelValue 命名，符合 Vue 3 v-model 标准和 Element Plus 规范
   * 自动触发生命周期钩子（通过 watch modelValue）
   */
  modelValue: Ref<boolean>
  
  /**
   * 全局加载状态（自动显示遮罩层）
   */
  loading: Ref<boolean>
  
  /**
   * 统一的按钮 loading 管理（响应式）
   * 键名对应按钮的 eventName（如 'confirm'、'cancel'、'draft' 等）
   * 直接使用 buttonLoadings.value.buttonName = true/false 即可
   */
  buttonLoadings: Ref<Record<string, boolean>>
  
  /**
   * 确认按钮 loading（快捷方式，计算属性）
   * 等同于 buttonLoadings.value.confirm
   * 可以直接设置 confirmLoading.value = true/false
   */
  confirmLoading: ComputedRef<boolean>
  
  /**
   * 取消按钮 loading（快捷方式，计算属性）
   * 等同于 buttonLoadings.value.cancel
   * 可以直接设置 cancelLoading.value = true/false
   */
  cancelLoading: ComputedRef<boolean>
  
  // 注意：不提供 open/close/toggle 方法，保持 API 简洁
  // 只使用 modelValue v-model 控制，通过 watch 自动触发生命周期钩子
}

/**
 * useDialog 全局配置（页面级别）
 */
interface DialogGlobalConfig extends Partial<ElDialogProps> {
  /**
   * 多个弹窗共用的属性
   * 在 dialog.use() 时会继承这些属性，如果有相同的则覆盖
   */
  /**
   * el-scrollbar 的属性配置（全局配置）
   * 在 dialog.use() 时会继承，实例配置会覆盖全局配置
   */
  scrollbarProps?: Partial<ElScrollbarProps>
}

/**
 * useDialog 返回值
 */
interface UseDialogReturn {
  /**
   * 创建弹窗实例（组合式函数）
   * @param options - 弹窗选项，会继承 useDialog() 传入的全局配置
   */
  use: (options: DialogOptions) => DialogInstance
  
}

/**
 * useDialog 函数签名
 */
function useDialog(globalConfig?: DialogGlobalConfig): UseDialogReturn


---

## 使用示例

### 示例 1：基础用法（v-model）

**useDialog 组合式函数（完全独立使用，无需模板组件）：**

```typescript
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit-dialog'
import { h } from 'vue'

const dialog = useDialog()

const { modelValue } = dialog.use({
  title: '基础弹窗',
  content: '这是弹窗内容',
})

// 打开弹窗（弹窗会自动渲染到 DOM，无需在模板中添加组件）
function handleOpen() {
  modelValue.value = true // 自动触发 onOpened
}
</script>

<template>
  <el-button @click="handleOpen">打开弹窗</el-button>
  <!-- 注意：无需添加任何组件，useDialog 会自动渲染弹窗 -->
</template>
```

### 示例 2：完整的生命周期钩子

```typescript
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit'
import { h, ref } from 'vue'
import { ElMessageBox } from 'element-plus'

const dialog = useDialog()

const formData = ref({ username: '', email: '' })
const originalData = ref({ username: '', email: '' })

const { visible, close } = dialog.use({
  title: '编辑用户',
  width: '600px',
  content: () => h('div', [
    h('p', `用户名: ${formData.value.username}`),
    h('p', `邮箱: ${formData.value.email}`),
  ]),
  
  // 打开后钩子
  onOpened: async () => {
    console.log('弹窗已完全打开')
    // 可以在这里加载数据、聚焦等
    await loadUserData()
  },
  
  // 关闭前钩子（可以阻止关闭）
  onBeforeClose: async (done) => {
    const hasChanges = JSON.stringify(formData.value) !== JSON.stringify(originalData.value)
    
    if (hasChanges) {
      try {
        await ElMessageBox.confirm('有未保存的更改，确定要关闭吗？', '提示', {
          type: 'warning'
        })
        formData.value = { ...originalData.value }
        done() // 继续关闭
      }
      catch {
        return false // 阻止关闭
      }
    }
    else {
      done() // 直接关闭
    }
  },
  
  // 关闭后钩子
  onClosed: async () => {
    console.log('弹窗已完全关闭')
    formData.value = { username: '', email: '' }
    originalData.value = { username: '', email: '' }
    await refreshUserList()
  },
  
  // 确认按钮点击（快捷方式，可选）
  onConfirm: async () => {
    try {
      await submitForm(formData.value)
      modelValue.value = false // 直接使用 v-model 关闭
    }
    catch (error) {
      ElMessage.error('保存失败')
      throw error
    }
  },
  
  // 取消按钮点击（快捷方式，可选）
  onCancel: () => {
    formData.value = { ...originalData.value }
  }
  
  // 注意：如果用户需要自定义按钮（如草稿、刷新等），可以不使用 onConfirm 和 onCancel
  // 自己定义按钮和事件处理（见示例 5）
})

// 打开前保存原始数据
async function handleOpen() {
  originalData.value = { ...formData.value }
  modelValue.value = true // 直接使用 v-model 打开，自动触发 onOpened
}
</script>
```

### 示例 3：表单弹窗 - 按钮事件访问 content 数据

```typescript
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit'
import { h, ref } from 'vue'
import { WForm } from '@iswangh/element-plus-kit-form'
import type { FormItems, FormInstance } from '@iswangh/element-plus-kit-form'

const dialog = useDialog()

// 方式1：使用响应式数据（推荐）
const formData = ref({ username: '', email: '' })
const formItems: FormItems = [
  { prop: 'username', label: '用户名', compType: 'input' },
  { prop: 'email', label: '邮箱', compType: 'input' }
]

const { visible, confirmLoading, cancelLoading } = dialog.use({
  title: '编辑用户',
  width: '600px',
  content: (instance) => h(WForm, {
    model: formData, // 使用响应式数据
    formItems,
  }),
  
  // 确认按钮：可以访问 formData（响应式数据）
  onConfirm: async () => {
    confirmLoading.value = true
    try {
      // 直接使用 formData.value 获取表单数据
      await submitForm(formData.value)
      modelValue.value = false // 直接使用 v-model 关闭
    }
    finally {
      confirmLoading.value = false
    }
  },
  
  // 取消按钮：可以访问 formData（响应式数据）
  onCancel: () => {
    // 直接重置 formData
    formData.value = { username: '', email: '' }
  }
})

// 打开弹窗
function handleOpen() {
  modelValue.value = true // 直接使用 v-model 打开，自动触发 onOpened
}
</script>
```

### 示例 4：表单弹窗 - 使用组件 ref 访问组件方法

```typescript
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit'
import { h, ref } from 'vue'
import MyFormComponent from './MyFormComponent.vue'

const dialog = useDialog()

// 方式2：使用组件 ref（适合封装好的组件）
const formRef = ref<InstanceType<typeof MyFormComponent>>()

const { visible, confirmLoading, cancelLoading } = dialog.use({
  title: '编辑用户',
  width: '600px',
  content: (instance) => h(MyFormComponent, {
    ref: formRef, // 通过 ref 获取组件实例
  }),
  
  // 确认按钮：通过 ref 访问组件方法和数据
  onConfirm: async () => {
    confirmLoading.value = true
    try {
      // 通过 ref 调用组件方法或访问数据
      const formData = formRef.value?.getFormData()
      await submitForm(formData)
      visible.value = false
    }
    finally {
      confirmLoading.value = false
    }
  },
  
  // 取消按钮：通过 ref 调用组件方法
  onCancel: () => {
    // 通过 ref 调用组件方法清理表单
    formRef.value?.resetForm()
  }
})
</script>
```

### 示例 5：全局 loading、按钮 loading 和自定义按钮事件

```typescript
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit'
import { h, ref } from 'vue'
import { ElButton } from 'element-plus'
import { WForm } from '@iswangh/element-plus-kit-form'
import type { FormItems } from '@iswangh/element-plus-kit-form'

const dialog = useDialog()

const formData = ref({ username: '', email: '' })
const userData = ref(null) // onOpened 中加载的数据
const formItems: FormItems = [
  { prop: 'username', label: '用户名', compType: 'input' },
  { prop: 'email', label: '邮箱', compType: 'input' }
]

const { 
  modelValue, 
  loading, 
  confirmLoading, 
  cancelLoading,
  buttonLoadings 
} = dialog.use({
  title: '编辑用户',
  width: '600px',
  // content 接收 instance 参数，可以访问所有响应式状态
  content: (instance) => h('div', [
    // 使用 onOpened 中加载的数据（响应式，自动更新）
    userData.value ? h('div', `用户ID: ${userData.value.id}`) : null,
    h(WForm, { model: formData, formItems }),
  ]),
  
  // 使用 el-dialog 的 footer 插槽（不重复定义）
  // slots 的渲染函数接收 instance 参数，可以访问响应式状态
  slots: {
    footer: (instance) => h('div', { class: 'dialog-footer' }, [
      h(ElButton, { 
        loading: instance.cancelLoading.value,
        onClick: handleCancel
      }, '取消'),
      h(ElButton, { 
        loading: instance.buttonLoadings.value.draft,
        onClick: handleDraft
      }, '保存草稿'),
      h(ElButton, { 
        loading: instance.buttonLoadings.value.refresh,
        onClick: handleRefresh
      }, '刷新'),
      h(ElButton, { 
        type: 'primary',
        loading: instance.confirmLoading.value,
        onClick: handleConfirm
      }, '确定')
    ])
  },
  
  // 打开后加载数据
  onOpened: async () => {
    loading.value = true
    try {
      // 请求数据，更新响应式变量
      userData.value = await fetchUserData()
      // content 会自动更新（响应式）
    }
    finally {
      loading.value = false
    }
  },
  
  // 也可以使用 onConfirm 和 onCancel（快捷方式）
  onConfirm: async () => {
    confirmLoading.value = true
    try {
      // 可以访问 formData（响应式数据）
      await submitForm(formData.value)
      modelValue.value = false // 直接使用 v-model 关闭
    }
    finally {
      confirmLoading.value = false
    }
  },
  
  onCancel: () => {
    // 可以访问 formData（响应式数据）
    formData.value = { username: '', email: '' }
  }
})

// 打开弹窗
async function handleOpen() {
  modelValue.value = true // 直接使用 v-model 打开，onOpened 会自动触发
}

// 取消按钮（自定义）
async function handleCancel() {
  cancelLoading.value = true
  try {
    await saveDraft()
    modelValue.value = false // 直接使用 v-model 关闭
  }
  finally {
    cancelLoading.value = false
  }
}

// 草稿按钮（自定义）
async function handleDraft() {
  buttonLoadings.value.draft = true
  try {
    // 可以访问 formData（响应式数据）
    await saveDraft(formData.value)
  }
  finally {
    buttonLoadings.value.draft = false
  }
}

// 刷新按钮（自定义）
async function handleRefresh() {
  buttonLoadings.value.refresh = true
  try {
    userData.value = await fetchUserData()
  }
  finally {
    buttonLoadings.value.refresh = false
  }
}

// 确认按钮（自定义，如果定义了 onConfirm 则不需要）
async function handleConfirm() {
  confirmLoading.value = true
  try {
    // 可以访问 formData（响应式数据）
    await submitForm(formData.value)
    modelValue.value = false // 直接使用 v-model 关闭
  }
  finally {
    confirmLoading.value = false
  }
}
</script>
```

### 示例 4：多个弹窗实例

```typescript
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit'
import { h } from 'vue'

const dialog = useDialog()

// 创建多个弹窗实例
const dialog1 = dialog.use({ 
  title: '弹窗 1', 
  content: '这是第一个弹窗',
  width: '400px'
})

const dialog2 = dialog.use({ 
  title: '弹窗 2', 
  content: '这是第二个弹窗',
  width: '500px'
})

const dialog3 = dialog.use({ 
  title: '弹窗 3', 
  content: '这是第三个弹窗',
  width: '600px'
})

// 依次打开，z-index 自动递增
function openAll() {
  dialog1.modelValue.value = true // z-index: 2000
  dialog2.modelValue.value = true // z-index: 2001
  dialog3.modelValue.value = true // z-index: 2002
}

// ESC 键关闭最上层弹窗（dialog3）
// 点击遮罩层关闭对应弹窗
</script>

<template>
  <el-button @click="openAll">打开所有弹窗</el-button>
</template>
```

### 示例 5：页面级别全局配置（继承和覆盖）

```typescript
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit'
import { h } from 'vue'

// 创建带全局配置的 dialog 实例（页面级别）
const dialog = useDialog({
  // 多个弹窗共用的属性
  width: '600px',
  closeOnClickModal: false,
  destroyOnClose: true,
  fullscreen: false,
})

// 弹窗1：继承全局配置
const dialog1 = dialog.use({
  title: '弹窗1',
  content: '这是弹窗1',
  // width 会使用全局配置的 '600px'
  // closeOnClickModal 会使用全局配置的 false
})

// 弹窗2：覆盖全局配置
const dialog2 = dialog.use({
  title: '弹窗2',
  content: '这是弹窗2',
  width: '800px', // 覆盖全局配置的 '600px'
  // closeOnClickModal 仍然使用全局配置的 false
})

// 弹窗3：完全自定义
const dialog3 = dialog.use({
  title: '弹窗3',
  content: '这是弹窗3',
  width: '500px',
  closeOnClickModal: true, // 覆盖全局配置的 false
})
</script>
```

### 示例 6：onOpened 数据在内容区域使用（响应式）

```typescript
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit'
import { h, ref } from 'vue'

const dialog = useDialog()

// 响应式数据（在 onOpened 中更新，在 content 中使用）
const userData = ref(null)
const options = ref([])

const { modelValue, loading } = dialog.use({
  title: '编辑用户',
  width: '600px',
  // content 接收 instance 参数，可以访问响应式状态
  content: (instance) => h('div', [
    // 使用响应式数据，自动更新
    loading.value ? h('div', '加载中...') : null,
    userData.value ? h('div', `用户名: ${userData.value.username}`) : null,
    options.value.length > 0 ? h('div', `选项数量: ${options.value.length}`) : null,
  ]),
  
  // 打开后加载数据
  onOpened: async () => {
    loading.value = true
    try {
      // 请求数据，更新响应式变量
      const [userInfo, optionsData] = await Promise.all([
        fetchUserData(),
        fetchOptions()
      ])
      
      userData.value = userInfo
      options.value = optionsData
      // content 会自动更新（响应式）
    }
    finally {
      loading.value = false
    }
  }
})

// 打开弹窗
function handleOpen() {
  modelValue.value = true // 直接使用 v-model 打开，onOpened 会自动触发，数据加载后 content 自动更新
}
</script>
```

### 示例 7：只使用 modelValue，自动触发逻辑

```typescript
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit'
import { h, ref } from 'vue'

const dialog = useDialog()

const userData = ref(null)

const { modelValue } = dialog.use({
  title: '编辑用户',
  content: (instance) => h('div', userData.value?.username || ''),
  
  // 打开后钩子
  onOpened: async () => {
    // 只使用 modelValue.value = true 时，这个钩子会自动触发
    userData.value = await fetchUserData()
  },
  
  // 关闭前钩子
  onBeforeClose: async (done) => {
    // 只使用 modelValue.value = false 时，这个钩子会自动触发（通过 el-dialog 的 before-close 事件）
    const confirmed = await ElMessageBox.confirm('确定关闭？')
    if (confirmed) {
      done()
    } else {
      return false
    }
  },
  
  // 关闭后钩子
  onClosed: async () => {
    // 只使用 modelValue.value = false 时，这个钩子会自动触发（通过 watch modelValue）
    userData.value = null
  }
})

// 只使用 modelValue，所有逻辑自动触发
function handleOpen() {
  modelValue.value = true // 直接使用 v-model 打开，自动触发 onOpened
}

function handleClose() {
  modelValue.value = false // 直接使用 v-model 关闭，自动触发 onBeforeClose 和 onClosed
}
</script>
```

---

## 实现细节

### 1. 目录结构

```
packages/dialog/
  src/
    composables/
      index.ts              # 组合式函数聚合导出
      useDialog.ts          # 核心组合式函数
      useDialogStack.ts     # 弹窗栈管理（多实例）
    utils/
      index.ts              # 工具函数聚合导出
      createDialogApp.ts    # 创建弹窗应用实例
      renderContent.ts      # 内容渲染工具
      generateId.ts         # 生成唯一 ID
    types/
      index.d.ts            # 类型定义聚合导出
      useDialog.d.ts        # useDialog 组合式函数类型定义
      el.d.ts               # Element Plus 类型定义
    index.ts                # 主入口，聚合导出所有内容
  package.json
  tsconfig.json
  vite.config.ts
  README.md
```

### 2. 核心实现

#### useDialog.ts

**核心实现要点：**
- `useDialog` 通过 `createDialogApp` 自动创建和挂载 Vue 应用
- 当 `visible.value = true` 时，自动创建弹窗应用并渲染到 DOM
- 当 `visible.value = false` 时，自动卸载并销毁弹窗应用
- **完全独立使用**，无需在模板中添加任何组件

```typescript
import { ref, computed, nextTick, watch, getCurrentInstance, onUnmounted } from 'vue'
import type { Ref, ComputedRef, VNode, Component, App } from 'vue'
import type { ElDialogProps } from 'element-plus'
import { ElDialog, ElLoading } from 'element-plus'
import { createApp, h } from 'vue'
import { generateId } from './utils/generateId'
import { renderContent } from './utils/renderContent'
import { createDialogApp } from './utils/createDialogApp'
import { useDialogStack } from './composables/useDialogStack'

export interface DialogOptions extends Partial<ElDialogProps> {
  /**
   * 内容（支持字符串、VNode、组件、渲染函数）
   * 渲染函数接收 instance 参数，可以访问响应式状态
   */
  content?: string | VNode | Component | ((instance: DialogInstance) => VNode)
  /**
   * 插槽（el-dialog 的插槽，直接透传）
   * 渲染函数接收 instance 参数，可以访问响应式状态
   * 这样可以在 header、footer、default 中访问 onOpened 中请求的数据
   */
  slots?: {
    default?: (instance: DialogInstance) => VNode
    header?: (instance: DialogInstance) => VNode
    footer?: (instance: DialogInstance) => VNode
    title?: (instance: DialogInstance) => VNode
  }
  onOpened?: () => void | Promise<void>
  onBeforeClose?: (done: () => void) => boolean | Promise<boolean> | void
  onClosed?: () => void | Promise<void>
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  loading?: Ref<boolean>
  buttonLoadings?: Ref<Record<string, boolean>>
}

export interface DialogInstance {
  id: string
  modelValue: Ref<boolean>
  loading: Ref<boolean>
  buttonLoadings: Ref<Record<string, boolean>>
  confirmLoading: ComputedRef<boolean>
  cancelLoading: ComputedRef<boolean>
  // 注意：不提供 open/close/toggle 方法，保持 API 简洁
  // 只使用 modelValue v-model 控制，通过 watch 自动触发生命周期钩子
  // 注意：不包含 update 和 destroy 方法（参考 Q2 和 Q3）
}

export function useDialog(globalConfig?: DialogGlobalConfig) {
  const dialogStack = useDialogStack()
  
  return {
    use(options: DialogOptions): DialogInstance {
      // 合并全局配置和实例配置（实例配置优先）
      const mergedOptions = { ...globalConfig, ...options } as DialogOptions
      const id = generateId()
      const modelValue = ref(false)
      const loading = ref(mergedOptions.loading?.value ?? false)
      const buttonLoadings = ref<Record<string, boolean>>(mergedOptions.buttonLoadings?.value ?? {})
      
      // 如果用户传入了自定义的 loading，使用用户的，否则使用内部的
      const finalLoading = mergedOptions.loading ?? loading
      const finalButtonLoadings = mergedOptions.buttonLoadings ?? buttonLoadings
      
      // 确认按钮 loading（计算属性）
      const confirmLoading = computed({
        get: () => finalButtonLoadings.value.confirm ?? false,
        set: (value: boolean) => {
          finalButtonLoadings.value.confirm = value
        }
      })
      
      // 取消按钮 loading（计算属性）
      const cancelLoading = computed({
        get: () => finalButtonLoadings.value.cancel ?? false,
        set: (value: boolean) => {
          finalButtonLoadings.value.cancel = value
        }
      })
      
      const instance: DialogInstance = {
        id,
        modelValue,
        loading: finalLoading,
        buttonLoadings: finalButtonLoadings,
        confirmLoading,
        cancelLoading,
        // 注意：不提供 open/close/toggle 方法，保持 API 简洁
        // 只使用 modelValue v-model 控制，通过 watch 自动触发生命周期钩子
      }
      
      // 注册到弹窗栈
      dialogStack.push(instance)

      // 弹窗应用实例（用于自动渲染）
      let dialogApp: App | null = null
      let dialogContainer: HTMLElement | null = null

      // 清理函数
      function cleanup() {
        if (dialogApp && dialogContainer) {
          dialogApp.unmount()
          dialogContainer.remove()
          dialogApp = null
          dialogContainer = null
        }
      }

      // watch modelValue 变化，自动创建/销毁弹窗应用并触发生命周期钩子
      watch(modelValue, async (newVal: boolean) => {
        if (newVal) {
          // 打开时：创建并挂载弹窗应用
          if (!dialogApp) {
            // 创建容器元素
            dialogContainer = document.createElement('div')
            document.body.appendChild(dialogContainer)

            // 创建弹窗应用
            dialogApp = createDialogApp(mergedOptions, instance)

            // 挂载到容器
            dialogApp.mount(dialogContainer)
          }

          await nextTick()
          // 自动触发 onOpened 钩子
          if (mergedOptions.onOpened) {
            await Promise.resolve(mergedOptions.onOpened())
          }
        }
        else {
          // 关闭时：卸载并销毁弹窗应用
          cleanup()

          await nextTick()
          // 自动触发 onClosed 钩子（onBeforeClose 在 el-dialog 的 before-close 事件中处理）
          if (mergedOptions.onClosed) {
            await Promise.resolve(mergedOptions.onClosed())
          }
        }
      }, { immediate: false })

      // 组件卸载时清理
      if (getCurrentInstance()) {
        onUnmounted(() => {
          cleanup()
          // 从弹窗栈中移除
          dialogStack.pop(instance)
        })
      }
      
      return instance
    }
  }
}
```

#### useDialogStack.ts

```typescript
import type { DialogInstance } from './useDialog'

export class DialogStack {
  private stack: DialogInstance[] = []
  private baseZIndex = 2000
  
  push(instance: DialogInstance) {
    this.stack.push(instance)
    this.updateZIndex()
  }
  
  pop(instance: DialogInstance) {
    const index = this.stack.findIndex(i => i.id === instance.id)
    if (index > -1) {
      this.stack.splice(index, 1)
      this.updateZIndex()
    }
  }
  
  private updateZIndex() {
    this.stack.forEach((instance, index) => {
      // 更新 z-index：计算每个实例的 z-index
      const zIndex = this.baseZIndex + index
      // 通过 instance 更新 el-dialog 的 z-index
      // 需要在 createDialogApp 中动态更新 el-dialog 的 z-index prop
      // 或者通过 CSS 变量动态设置
    })
  }
  
  getTop(): DialogInstance | undefined {
    return this.stack[this.stack.length - 1]
  }
}

export function useDialogStack() {
  return new DialogStack()
}
```

### 3. 内置 loading 显示和内容区域滚动（内置 el-scrollbar）

```typescript
// 在 createDialogApp 中实现
import { ElScrollbar } from 'element-plus'
import type { ElScrollbarProps } from 'element-plus'

function createDialogContent(options: DialogOptions, instance: DialogInstance) {
  const content = renderContent(options.content, instance)
  
  // 内容区域容器（用于 loading）
  const contentWrapper = h('div', {
    class: 'dialog-content-wrapper',
    style: { position: 'relative' },
    vLoading: instance.loading.value,
    elementLoadingText: '加载中...',
  }, [content])
  
  // el-scrollbar 始终使用，提供统一的滚动体验
  // 通过 scrollbarProps 配置滚动条属性（如 maxHeight、height 等）
  return h(ElScrollbar, {
    ...(options.scrollbarProps || {}), // 传递用户配置的 scrollbarProps
  }, {
    default: () => contentWrapper,
  })
}
```

**实现说明：**
- **全局 loading**：使用 `v-loading` 指令，只作用在弹窗内容区域（`#default` 插槽）
  - 不会影响弹窗的 header 和 footer 区域
  - 不会影响整个页面
- **内容区域滚动**：`el-scrollbar` 始终内置使用，提供统一的滚动体验
  - 提供更好的滚动体验和样式（自定义滚动条）
  - 与 Element Plus 设计风格保持一致
  - 用户通过 `scrollbarProps` 配置滚动条属性（如 `maxHeight`、`height` 等）
  - 如果没有设置 `maxHeight`，则不限制高度，但依然使用 `el-scrollbar`
  - 内容超出时，内容区域内部滚动，弹窗本身不滚动
  - 避免内容过多时弹窗连带整个页面一起滚动

### 4. 目录结构和导出规范

#### src/composables/index.ts
```typescript
export * from './useDialog'
export * from './useDialogStack'
```

#### src/utils/index.ts
```typescript
export * from './createDialogApp'
export * from './renderContent'
export * from './generateId'
```

#### src/types/index.d.ts
```typescript
export * from './el'         // 导出 Element Plus 类型
export * from './useDialog' // 导出 useDialog 类型
```

**useDialog 实现说明：**
- `useDialog` 通过 `createDialogApp` **自动创建和挂载 Vue 应用**
- 当 `visible.value = true` 时，自动创建弹窗应用并渲染到 DOM
- 当 `visible.value = false` 时，自动卸载并销毁弹窗应用
- **完全独立使用**，无需在模板中添加任何组件
- 弹窗会自动渲染到 `document.body`，支持多实例管理

#### src/index.ts
```typescript
// 样式导入
import 'element-plus/es/components/dialog/style/css'
import 'element-plus/es/components/loading/style/css'
import 'element-plus/es/components/scrollbar/style/css'

// 导出组合式函数
export * from './composables'

// 导出类型
export type * from './types'
```

---

## 实现优先级

### P0（必须实现）

**组合式函数（useDialog）：**
1. ✅ 组合式函数 `dialog.use()`
2. ✅ `modelValue` v-model 控制（唯一方式，使用 `modelValue` 命名，符合 Vue 3 标准和 Element Plus 规范）
3. ✅ **不提供 `open()` 和 `close()` 方法**，保持 API 简洁，只使用 v-model
4. ✅ `onOpened` 钩子（支持异步，数据在 content 和 slots 中使用）
5. ✅ `onBeforeClose` 钩子（支持阻止关闭，通过 el-dialog 的 before-close 事件）
6. ✅ `onClosed` 钩子（支持异步，通过 watch modelValue 触发）
7. ✅ `onConfirm` 和 `onCancel` 钩子（快捷方式，可选）
8. ✅ `modelValue` 变化自动触发逻辑（watch modelValue）
9. ✅ 内置 `loading` 状态（全局遮罩层，只作用在内容区域）
10. ✅ `buttonLoadings` 状态（响应式对象）
11. ✅ `confirmLoading` 和 `cancelLoading` 计算属性
12. ✅ 按钮事件访问 content 数据（响应式数据或组件 ref）
13. ✅ 多实例管理（z-index 自动管理，通过弹窗栈）
14. ✅ 透传所有 el-dialog 属性、事件、插槽（不重复定义）
15. ✅ 默认值与 el-dialog 一致
16. ✅ 全屏配置支持（透传 el-dialog 的 fullscreen）
17. ✅ 页面级别全局配置（继承和覆盖，包括 `scrollbarProps`）
18. ✅ 目录结构和导出规范（index.ts 聚合导出）
19. ✅ `createDialogApp` 实现（动态创建和挂载 Vue 应用）
20. ✅ `renderContent` 实现（支持字符串、VNode、组件、渲染函数）
21. ✅ `generateId` 实现（生成唯一 ID）
22. ✅ `useDialogStack` 实现（弹窗栈管理，z-index 自动管理）
23. ✅ `el-scrollbar` 内置使用（通过 `scrollbarProps` 配置）
24. ✅ `slots` 渲染函数接收 `instance` 参数（支持在 header、footer 中访问响应式数据）

### P2（可选）

1. ⚠️ 暂无（核心功能已完整，嵌套弹窗和样式定制已通过透传 Element Plus 属性支持）

---

## Playground 示例规划

### 文件结构

实现后需要在 `playground/src/views/dialog/` 目录下创建以下示例文件（参考 form 和 tag 包的文件结构）：

```
playground/src/views/dialog/
  basic/
    index.vue               # 基础用法（useDialog 示例）
  lifecycle/
    hooks.vue              # 生命周期钩子示例（useDialog 示例）
    async.vue              # 异步钩子示例（useDialog 示例）
  loading/
    global.vue             # 全局 loading 示例（useDialog 示例）
    button.vue              # 按钮 loading 示例（useDialog 示例）
    custom.vue              # 自定义按钮 loading 示例（useDialog 示例）
  form/
    basic.vue               # 表单弹窗基础用法（useDialog 示例）
    with-form.vue           # 与 WForm 集成示例（useDialog 示例）
  multiple/
    instances.vue            # 多实例示例（useDialog 示例）
    z-index.vue              # z-index 自动管理示例（useDialog 示例）
  advanced/
    global-config.vue        # 全局配置示例（useDialog 示例）
    before-close.vue         # 关闭前确认示例（useDialog 示例）
    slots.vue                # 插槽使用示例（useDialog 示例）
    content-height.vue       # 内容区域滚动控制示例（useDialog 示例）
```

### 路由配置

需要在 `playground/src/router/modules/dialog.ts` 中定义路由元信息（参考 form 和 tag 包的路由定义格式）：

```typescript
export const dialogRouteMeta = {
  // Dialog 父菜单（不在侧边栏显示，仅用于获取中文标题，但需要 order 值用于排序）
  '/dialog': { title: '弹窗组件', showInSidebar: false, order: 4 },
  // 基础示例 (order: 1) - 入门必看
  '/dialog/basic': { title: '基础示例', showInSidebar: true, order: 1 },
  '/dialog/basic/index': { title: '基础用法', description: 'useDialog 基础用法', showInSidebar: true, order: 1 },
  // 生命周期示例 (order: 2)
  '/dialog/lifecycle': { title: '生命周期', showInSidebar: true, order: 2 },
  '/dialog/lifecycle/hooks': { title: '生命周期钩子', description: 'onOpened、onBeforeClose、onClosed 的使用', showInSidebar: true, order: 1 },
  '/dialog/lifecycle/async': { title: '异步钩子', description: '异步生命周期钩子的使用', showInSidebar: true, order: 2 },
  // Loading 示例 (order: 3)
  '/dialog/loading': { title: 'Loading 状态', showInSidebar: true, order: 3 },
  '/dialog/loading/global': { title: '全局 Loading', description: '全局 loading 遮罩层（只作用在内容区域）', showInSidebar: true, order: 1 },
  '/dialog/loading/button': { title: '按钮 Loading', description: '按钮级别的 loading 状态', showInSidebar: true, order: 2 },
  '/dialog/loading/custom': { title: '自定义按钮', description: '自定义按钮的 loading 状态', showInSidebar: true, order: 3 },
  // 表单集成示例 (order: 4)
  '/dialog/form': { title: '表单集成', showInSidebar: true, order: 4 },
  '/dialog/form/basic': { title: '表单弹窗', description: '基础表单弹窗示例', showInSidebar: true, order: 1 },
  '/dialog/form/with-form': { title: 'WForm 集成', description: '与 WForm 组件集成示例', showInSidebar: true, order: 2 },
  // 多实例示例 (order: 5)
  '/dialog/multiple': { title: '多实例', showInSidebar: true, order: 5 },
  '/dialog/multiple/instances': { title: '多弹窗实例', description: '同一页面多个弹窗实例', showInSidebar: true, order: 1 },
  '/dialog/multiple/z-index': { title: 'Z-Index 管理', description: '自动管理 z-index', showInSidebar: true, order: 2 },
  // 高级示例 (order: 6)
  '/dialog/advanced': { title: '高级示例', showInSidebar: true, order: 6 },
  '/dialog/advanced/global-config': { title: '全局配置', description: '页面级别全局配置', showInSidebar: true, order: 1 },
  '/dialog/advanced/before-close': { title: '关闭前确认', description: 'onBeforeClose 阻止关闭', showInSidebar: true, order: 2 },
  '/dialog/advanced/slots': { title: '插槽使用', description: 'header、footer 等插槽的使用', showInSidebar: true, order: 3 },
  '/dialog/advanced/content-height': { title: '内容区域滚动', description: 'scrollbarProps 控制内容区域滚动行为', showInSidebar: true, order: 4 },
} as const
```

### 路径别名配置

需要在 `playground/tsconfig.json` 中添加路径别名：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@iswangh/element-plus-kit-form": ["../packages/form/src/index.ts"],
      "@iswangh/element-plus-kit-tag": ["../packages/tag/src/index.ts"],
      "@iswangh/element-plus-kit": ["../packages/dialog/src/index.ts"],
      "@iswangh/element-plus-kit": ["../packages/kit/src/index.ts"],
      "@iswangh/element-plus-kit-core": ["../packages/core/src/index.ts"]
    }
  }
}
```

### 路由注册

需要在 `playground/src/router/modules/index.ts` 中导出：

```typescript
export * from './check-tag'
export * from './dialog'
export * from './form'
export * from './tag'
```

需要在 `playground/src/router/index.ts` 中导入：

```typescript
import { checkTagRouteMeta, dialogRouteMeta, formRouteMeta, tagRouteMeta } from './modules'

const routeMetaMap: Record<string, RouteMetaConfig> = {
  '/': { title: '首页', showInSidebar: true },
  '/error/404': { title: '404 - 页面未找到', showInSidebar: false },
  ...formRouteMeta,
  ...tagRouteMeta,
  ...checkTagRouteMeta,
  ...dialogRouteMeta,
}
```

### 示例内容规划

#### 1. 基础示例

**index.vue** - 基础用法
- 展示 `useDialog` 的基本使用
- `modelValue` v-model 控制弹窗显示/隐藏
- 简单的内容渲染
- 完全独立使用，无需在模板中添加组件

#### 2. 生命周期示例

**hooks.vue** - 生命周期钩子
- `onOpened`、`onBeforeClose`、`onClosed` 的使用
- 同步钩子示例
- 通过 `watch modelValue` 自动触发

**async.vue** - 异步钩子
- 异步 `onOpened` 加载数据
- 异步 `onBeforeClose` 确认关闭
- 数据在内容区域的使用（响应式数据）

#### 3. Loading 示例

**global.vue** - 全局 loading
- 全局 loading 遮罩层（只作用在内容区域）
- 在 `onOpened` 中使用 loading
- 展示 loading 不会影响 header 和 footer
- 通过 `instance.loading.value` 控制

**button.vue** - 按钮 loading
- `confirmLoading`、`cancelLoading` 的使用
- `buttonLoadings` 对象的使用
- 通过 `instance.confirmLoading.value` 等控制

**custom.vue** - 自定义按钮 loading
- 自定义按钮（草稿、刷新等）
- 自定义按钮的 loading 状态
- 通过 `instance.buttonLoadings.value.buttonName` 控制

#### 4. 表单集成示例

**basic.vue** - 表单弹窗基础
- 简单的表单弹窗
- 表单数据提交
- 使用 `content` 渲染函数渲染表单

**with-form.vue** - WForm 集成
- 与 `WForm` 组件集成
- 表单验证
- 按钮事件访问表单数据（响应式数据）
- 使用 `content` 渲染函数渲染 `WForm`

#### 5. 多实例示例

**instances.vue** - 多弹窗实例
- 同一页面多个弹窗实例
- 依次打开多个弹窗
- 自动管理 z-index

**z-index.vue** - Z-Index 管理
- 自动管理 z-index
- ESC 键关闭最上层弹窗
- 展示 z-index 自动递增

#### 6. 高级示例

**global-config.vue** - 全局配置
- 页面级别全局配置
- 配置继承和覆盖
- 使用 `useDialog({ ... })` 传入全局配置

**before-close.vue** - 关闭前确认
- `onBeforeClose` 阻止关闭
- 未保存提示
- 通过 `onBeforeClose` 钩子实现

**slots.vue** - 插槽使用
- `slots` 属性传递插槽
- `#header`、`#title`、`#footer` 插槽
- 自定义弹窗结构
- 通过 `options.slots` 配置

**content-height.vue** - 内容区域滚动控制
- `scrollbarProps` 属性的使用
- `el-scrollbar` 始终内置使用，提供统一的滚动体验
- 通过 `scrollbarProps.maxHeight` 控制内容区域最大高度
- 内容过多时内容区域内部滚动，弹窗本身不滚动

### 注意事项

1. **文件先不同步**：实现后先创建示例文件，测试没问题后再同步到版本控制
2. **参考其他包**：参考 `form`、`tag`、`check-tag` 包的示例结构和代码风格
3. **完整示例**：每个示例应该包含完整的代码，可以直接运行
4. **说明文档**：每个示例应该包含说明文字，解释示例的用途和关键点
5. **类型安全**：所有示例应该使用 TypeScript，确保类型安全

---

## 总结

### 核心设计原则

1. **只使用 v-model**：唯一使用 `modelValue.value = true/false` 控制弹窗
   - **不提供 open/close 方法**，保持 API 简洁
   - 使用 `modelValue` 命名，符合 Vue 3 v-model 标准和 Element Plus 规范
2. **完全响应式**：所有状态都是响应式的，支持 watch、computed 等
3. **内置 loading**：自动显示遮罩层，用户只需控制状态
4. **完全透传**：不重复实现 el-dialog 已有的功能
5. **默认值一致**：与 Element Plus Dialog 保持一致
6. **自动触发钩子**：通过 watch modelValue 自动触发生命周期钩子

### 命名规范

- `modelValue`：v-model 绑定的响应式值（符合 Vue 3 标准和 Element Plus 规范）
- `buttonLoadings`：按钮 loading 对象（复数形式，表示多个按钮）
- `confirmLoading`：确认按钮 loading（单数，计算属性）
- `cancelLoading`：取消按钮 loading（单数，计算属性）

### 使用建议

**核心特性：**
- ✅ `useDialog` 完全独立使用，通过 `createDialogApp` 自动创建和挂载 Vue 应用，弹窗自动渲染到 DOM，**无需在模板中添加任何组件**
- ✅ 只使用 `v-model` 控制弹窗显示/隐藏（`modelValue.value = true/false`）
- ✅ 支持完整的生命周期钩子（`onOpened`、`onBeforeClose`、`onClosed`），支持异步
- ✅ 内置 loading 状态管理（全局和按钮级别）
- ✅ 支持多个弹窗实例，自动管理 z-index
- ✅ 完全透传 Element Plus Dialog 的所有属性、事件、插槽

**使用建议：**
1. **完全独立使用**：`useDialog` 会自动渲染弹窗，无需在模板中添加组件
2. **只使用 v-model**：`modelValue.value = true/false`（自动触发相关逻辑，自动渲染弹窗）
   - **不提供 open/close 方法**，保持 API 简洁
   - 如果需要在打开前处理逻辑，可以在设置 `modelValue.value = true` 之前处理
3. **loading 状态**：直接控制 `loading.value` 和 `buttonLoadings.value.buttonName`
4. **生命周期钩子**：在 `onOpened` 中执行业务逻辑，数据通过响应式变量在 content 中使用
   - `modelValue.value = true` → 自动触发 `onOpened`
   - `modelValue.value = false` → 自动触发 `onBeforeClose`（通过 el-dialog 的 before-close 事件）和 `onClosed`
5. **按钮事件访问数据**：
   - **推荐**：使用响应式数据（如 `formData`），在 content 和按钮事件中共享
   - **备选**：使用组件 ref，通过 ref 访问组件方法和数据
6. **onConfirm 和 onCancel**：作为快捷方式保留，但用户也可以自定义按钮
7. **全局配置**：使用 `useDialog({ ... })` 传入页面级别的全局配置，`dialog.use()` 时继承
8. **不重复定义**：el-dialog 的属性、事件、插槽直接透传，不重复定义

---

---

## 关键问题解答

### Q1: 只有固定的 onConfirm 和 onCancel，其他按钮（如刷新、草稿）的业务逻辑如何编写？

**A:** `onConfirm` 和 `onCancel` 作为快捷方式保留，但用户也可以自己定义按钮和事件处理：

```typescript
// 方式1：使用 onConfirm 和 onCancel（快捷方式）
const { visible } = dialog.use({
  onConfirm: async () => {
    // 处理确认逻辑
  },
  onCancel: () => {
    // 处理取消逻辑
  }
})

// 方式2：自定义按钮（更灵活）
const { visible, buttonLoadings } = dialog.use({
  slots: {
    footer: () => h('div', [
      h(ElButton, { 
        loading: buttonLoadings.value.draft,
        onClick: handleDraft // 自己定义事件处理
      }, '保存草稿'),
      h(ElButton, { 
        loading: buttonLoadings.value.refresh,
        onClick: handleRefresh // 自己定义事件处理
      }, '刷新'),
    ])
  }
})
```

### Q2: destroy 方法不需要吗？

**A:** 不需要。el-dialog 有 `destroyOnClose` 属性，直接透传即可。不需要额外的 `destroy` 方法。

### Q3: update 方法是干嘛用的？

**A:** 已移除。如果需要动态更新属性，直接修改 `options` 对象或重新创建实例。

### Q4: 用户只使用 modelValue 时，会执行生命周期钩子吗？

**A:** 会的。通过 `watch(modelValue, ...)` 自动触发：
- `modelValue.value = true` → 自动触发 `onOpened`
- `modelValue.value = false` → 自动触发 `onBeforeClose`（通过 el-dialog 的 before-close 事件）和 `onClosed`

**注意**：不提供 `open/close` 方法，只使用 `modelValue` v-model 控制，保持 API 简洁。

### Q5: 用户在 onOpened 中请求回来的数据，如何在内容区域、header、footer 中使用？

**A:** 使用响应式数据，`slots` 的渲染函数也接收 `instance` 参数：

```typescript
// 定义响应式数据
const userData = ref(null)

const { modelValue } = dialog.use({
  // content 接收 instance 参数，可以访问响应式状态
  content: (instance) => h('div', [
    // 使用响应式数据，自动更新
    userData.value ? h('div', userData.value.username) : h('div', '加载中...')
  ]),
  
  // slots 的渲染函数也接收 instance 参数，可以访问响应式状态
  slots: {
    header: (instance) => h('div', [
      // 在 header 中使用响应式数据
      userData.value ? h('span', `用户: ${userData.value.username}`) : h('span', '加载中...')
    ]),
    footer: (instance) => h('div', [
      // 在 footer 中使用响应式数据
      h(ElButton, {
        onClick: () => {
          // 可以访问 userData
          console.log('用户数据:', userData.value)
        }
      }, '操作')
    ]),
  },
  
  onOpened: async () => {
    // 请求数据，更新响应式变量
    userData.value = await fetchUserData()
    // content、header、footer 都会自动更新（响应式）
  }
})
```

**关键点：**
- `slots` 的渲染函数（`header`、`footer`、`default`、`title`）都接收 `instance` 参数
- 可以在外部定义响应式数据（如 `userData`），在 `onOpened` 中更新
- 在 `slots` 的渲染函数中使用响应式数据，会自动更新（响应式）
- 也可以通过 `instance` 访问弹窗的状态（如 `instance.loading.value`、`instance.buttonLoadings.value` 等）

### Q6: 按钮事件中如何访问 content 内容区域的数据？

**A:** 有多种方式，推荐使用响应式数据：

**方式1：使用响应式数据（推荐）**

```typescript
// 定义响应式数据，在 content 和按钮事件中共享
const formData = ref({ username: '', email: '' })

const { modelValue } = dialog.use({
  content: () => h(WForm, { model: formData }),
  
  // 按钮事件中可以直接访问 formData
  onConfirm: async () => {
    await submitForm(formData.value) // 直接使用响应式数据
    modelValue.value = false // 直接使用 v-model 关闭
  },
  
  onCancel: () => {
    formData.value = { username: '', email: '' } // 直接重置响应式数据
  }
})
```

**方式2：使用组件 ref（适合封装好的组件）**

```typescript
const formRef = ref<InstanceType<typeof MyFormComponent>>()

const { modelValue } = dialog.use({
  content: () => h(MyFormComponent, { ref: formRef }),
  
  // 通过 ref 访问组件方法和数据
  onConfirm: async () => {
    const formData = formRef.value?.getFormData()
    await submitForm(formData)
    modelValue.value = false // 直接使用 v-model 关闭
  },
  
  onCancel: () => {
    formRef.value?.resetForm() // 调用组件方法
  }
})
```

**方式3：在自定义按钮事件中访问**

```typescript
const formData = ref({ username: '', email: '' })

const { modelValue, buttonLoadings } = dialog.use({
  content: () => h(WForm, { model: formData }),
  
  slots: {
    footer: () => h('div', [
      h(ElButton, { 
        onClick: () => {
          // 自定义按钮事件中也可以访问 formData
          handleDraft(formData.value)
        }
      }, '保存草稿')
    ])
  }
})
```

### Q7: 目录结构需要参考其他包

**A:** 已更新，参考 `packages/form` 和 `packages/tag` 的结构：
- `composables/index.ts` - 组合式函数聚合导出
- `utils/index.ts` - 工具函数聚合导出
- `types/index.d.ts` - 类型定义聚合导出
- `src/index.ts` - 主入口，聚合导出所有内容

### Q8: el-dialog 的属性、事件、插槽不要重复定义

**A:** 已更新。直接继承 `ElDialogProps`，不重复定义。所有 el-dialog 的属性、事件、插槽直接透传。

### Q9: 全局配置应该是页面级别的

**A:** 已更新。使用 `useDialog({ ... })` 传入页面级别的全局配置，`dialog.use()` 时继承，相同属性则覆盖。

---

**文档版本**：v2.13  
**最后更新**：2025-12-26

**更新内容：**
- v2.13（2025-12-26）：
  - **移除 WDialog 组件**：基于用户反馈，决定只保留 `useDialog` 组合式函数，移除 `WDialog` 组件实现
    - 删除所有 WDialog 相关的 API 设计、使用示例、实现细节
    - 更新设计目标：从"双轨制方案"改为单一方案（只保留 useDialog）
    - 更新目录结构：删除 `components/` 目录和 `component.d.ts` 类型定义
    - 更新 Playground 示例规划：删除所有"两个卡片"的描述，改为单一 useDialog 示例
    - 更新使用建议：删除组件使用建议，只保留组合式函数使用建议
    - 简化文档结构，聚焦核心功能
- v2.12（2025-12-26）：
  - **优化类型定义命名**：将 `dialog.d.ts` 改为 `useDialog.d.ts`
    - 更明确表示这是 useDialog 组合式函数的类型定义
    - 避免与组件类型混淆，命名更清晰
    - 与 `component.d.ts`（WDialog 组件类型）形成清晰的对应关系
- v2.11（2025-12-26）：
  - **移除 P2 功能项**：移除"嵌套弹窗"和"样式定制"功能项
    - 嵌套弹窗已通过透传 Element Plus 的 `append-to-body` 等属性支持，无需额外实现
    - 样式定制已通过透传 Element Plus 的 `class`、`style`、`custom-class` 等属性支持，无需额外实现
    - 这两个功能属于 Element Plus 原生能力，通过透传即可使用
- v2.10（2025-12-26）：
  - **移除快捷方法**：移除 `confirm`、`alert`、`form` 快捷方法
    - `confirm` 和 `alert` 使用 Element Plus 的 `ElMessageBox` 即可，无需重复实现
    - `form` 快捷方法与 `dialog.use()` + `WForm` 相比没有明显优势，反而增加维护成本
    - 移除 `presets/` 目录和 `shortcuts.d.ts` 类型定义
    - 移除对 `@iswangh/element-plus-kit-form` 的依赖说明（dialog 包不依赖其他内部包）
    - 更新实现优先级，移除 P1 中的快捷方法
- v2.9（2025-12-26）：
  - **完善实现细节**：
    - 修正 `WDialog` 组件说明：明确 `WDialog` 是独立的 Vue 组件，不依赖 `useDialog`
    - 完善 `DialogGlobalConfig` 接口：添加 `scrollbarProps` 支持，支持全局配置继承
    - 完善 z-index 管理说明：明确 z-index 更新机制和实现方式
    - 补充 `createDialogApp` 实现细节：说明如何创建 Vue 应用、传递 slots 和 instance、处理 z-index
  - **补充遗漏点检查**：检查并补充了实现细节中的遗漏点
- v2.8（2025-12-26）：
  - **slots 渲染函数接收 instance 参数**：`slots` 的渲染函数（`header`、`footer`、`default`、`title`）都接收 `instance` 参数，可以访问响应式状态
  - 更新 `onOpened` 数据传递说明，明确在 header、footer 中如何访问 `onOpened` 中请求的数据
  - 更新示例代码，展示在 `slots.header` 和 `slots.footer` 中使用响应式数据
  - 更新 Q5 解答，说明 `slots` 渲染函数的使用方式
- v2.7（2025-12-26）：
  - **示例文件双卡片结构**：每个示例文件包含两个卡片，第一个卡片展示 `useDialog` 示例，第二个卡片展示 `WDialog` 示例
  - 便于用户对比两种使用方式的区别和适用场景
  - 更新文件结构说明，将 `composable.vue` 和 `component.vue` 合并为 `basic/index.vue`
  - 更新示例内容规划，明确每个示例文件的两个卡片内容
  - 更新路由配置，简化基础示例路由
- v2.6（2025-12-26）：
  - **el-scrollbar 内置使用**：`el-scrollbar` 始终内置使用，用户无需判断是否使用
  - **scrollbarProps 属性**：将 `contentMaxHeight` 改为 `scrollbarProps`，用户通过 `scrollbarProps` 配置 `el-scrollbar` 的属性（如 `maxHeight`、`height` 等）
  - 简化用户使用：用户只需要配置 `scrollbarProps.maxHeight` 即可控制内容区域高度，无需关心是否使用 `el-scrollbar`
  - 统一滚动体验：所有弹窗都使用 `el-scrollbar`，保持一致的滚动体验
- v2.5（2025-12-26）：
  - **使用 el-scrollbar 实现滚动**：使用 Element Plus 的 `el-scrollbar` 组件实现内容区域滚动，提供更好的滚动体验和样式
  - 更新实现细节，说明使用 `el-scrollbar` 包裹内容区域的实现方式
  - 更新 `WDialog` 组件实现，使用 `el-scrollbar` 组件
  - 添加 `el-scrollbar` 样式导入
- v2.4（2025-12-26）：
  - **明确全局 loading 作用范围**：全局 loading 只作用在弹窗内容区域，不是整个弹窗，不会影响 header 和 footer
  - **添加 contentMaxHeight 属性**：控制内容区域的最大高度，避免内容过多时弹窗连带整个页面一起滚动
  - 更新实现细节，说明 loading 和 contentMaxHeight 的实现方式
  - 更新路由配置，参考 form 和 tag 包的路由定义格式，添加 content-height 示例路由
  - 更新示例规划，添加 content-height.vue 示例文件
- v2.3（2025-12-26）：
  - **移除 open/close/toggle 方法**：不暴露这些方法给用户，只使用 `modelValue` v-model 控制，保持 API 简洁
  - **命名改为 modelValue**：将 `visible` 改为 `modelValue`，符合 Vue 3 v-model 标准和 Element Plus 规范
  - 更新所有示例代码，使用 `modelValue` 替代 `visible`
  - 更新实现细节，移除 open/close/toggle 方法的实现
  - 更新使用建议，强调只使用 v-model，不提供 open/close 方法
- v2.2（2025-12-26）：
  - 修正类型命名：`WDialogProps` → `DialogProps`，`WDialogEmits` → `DialogEmits`（符合项目规范，类型命名不使用 W 前缀）
  - 移除 `DialogInstance` 接口中的 `update` 和 `destroy` 方法（参考 Q2 和 Q3，这些方法不需要）
  - 更新类型定义模块化结构（参考 form/tag 包结构，添加 `component.d.ts`）
  - 更新组件导出方式（使用聚合导出，添加 `components/index.ts`）
  - 更新目录结构说明（添加 `components/index.ts`）
- v2.1（2025-12-25）：
  - 明确说明 `useDialog` 和 `WDialog` 可以完全独立使用，互不依赖
  - 说明 `useDialog` 通过 `createDialogApp` 自动创建和挂载 Vue 应用，弹窗自动渲染到 DOM
  - 说明 `WDialog` 是独立的 Vue 组件，不依赖 `useDialog`，直接在模板中使用
  - 更新使用示例，展示两种方案的独立使用方式
  - 更新实现细节，说明 `useDialog` 的自动渲染机制
