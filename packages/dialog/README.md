# @iswangh/element-plus-kit-dialog

Element Plus Kit Dialog 组件，基于 Element Plus Dialog 的封装组件，提供组合式函数 `useDialog`，支持完全独立使用，无需在模板中添加组件。

## 📦 安装

```bash
npm install @iswangh/element-plus-kit-dialog
```

**注意**：此包依赖 `vue` 和 `element-plus`，安装时会自动安装。

## 🚀 快速开始

### 基础用法

**useDialog 组合式函数（完全独立使用，无需模板组件）：**

```vue
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit-dialog'

const dialog = useDialog()

const { modelValue } = dialog.use({
  title: '基础弹窗',
  content: '这是弹窗内容',
})

// 打开弹窗（弹窗会自动渲染到 DOM，无需在模板中添加组件）
function handleOpen() {
  modelValue.value = true
}
</script>

<template>
  <el-button @click="handleOpen">打开弹窗</el-button>
  <!-- 注意：无需添加任何组件，useDialog 会自动渲染弹窗 -->
</template>
```

### 引入样式

**重要说明**：useDialog 已按需导入了 Element Plus Dialog 组件样式，用户导入时样式会自动导入，**无需额外配置**。

#### 自动导入（默认，推荐）

直接导入即可，样式会自动导入：

```typescript
import { useDialog } from '@iswangh/element-plus-kit-dialog'
```

#### 单独导入样式（可选）

如果需要在 CSS 文件中单独导入样式，可以使用：

```typescript
import '@iswangh/element-plus-kit-dialog/style.css'
```

## 📖 API 文档

### useDialog 组合式函数

#### useDialog(globalConfig?)

创建弹窗实例管理器，支持全局配置。

**参数：**
- `globalConfig`（可选）：页面级别的全局配置，会被所有 `dialog.use()` 创建的实例继承

**返回值：**
- `UseDialogReturn`：包含 `use` 方法的对象

**示例：**

```typescript
import { useDialog } from '@iswangh/element-plus-kit-dialog'
import { h, ref } from 'vue'

// 创建带全局配置的 dialog 实例
const dialog = useDialog({
  width: '600px',
  closeOnClickModal: false,
  destroyOnClose: true,
  scrollbarProps: {
    maxHeight: '400px',
  },
  loadingProps: {
    text: '加载中...',
  },
})

// 创建弹窗实例
const { modelValue, loading, buttonLoadings, confirmLoading, cancelLoading } = dialog.use({
  title: '编辑用户',
  content: () => h('div', '弹窗内容'),
  // 或者使用 slots
  slots: {
    default: () => h('div', '弹窗内容'),
    header: () => h('div', '自定义头部'),
    footer: () => h('div', '自定义底部'),
  },
})

// 控制弹窗显示/隐藏
modelValue.value = true

// 控制弹窗 loading
loading.value = true

// 控制按钮 loading（方式1：使用 buttonLoadings）
buttonLoadings.value.confirm = true

// 控制按钮 loading（方式2：使用快捷方式）
confirmLoading.value = true
cancelLoading.value = true
```

#### dialog.use(options)

创建弹窗实例。

**参数：**
- `options`：Dialog 选项，会继承 `useDialog()` 传入的全局配置

**返回值：**
- `DialogInstance`：弹窗实例，包含 `modelValue`、`loading`、`buttonLoadings` 等响应式状态

**DialogOptions：**

支持 [`ElDialog`](https://element-plus.org/zh-CN/component/dialog.html) 所有的属性（包括 `beforeClose`、`@opened`、`@closed` 等生命周期钩子）。

**拓展属性**：

- `content`：内容（支持字符串、VNode、组件、渲染函数）
  - 字符串：直接显示文本内容
  - VNode：Vue 虚拟节点
  - Component：Vue 组件
  - 渲染函数：`() => string | Component | VNode`，通过闭包访问响应式状态
- `scrollbarProps`：el-scrollbar 的属性配置（Partial<ElScrollbarProps>）
  - 常用属性：`maxHeight`（最大高度）、`height`（固定高度）等
  - el-scrollbar 始终内置使用，提供统一的滚动体验
- `loadingProps`：el-loading 的属性配置（Partial<ElLoadingOptions>）
  - 常用属性：`text`（加载文本）、`spinner`（自定义加载图标）、`background`（遮罩背景色）等
  - 不设置默认值，保持与 el-loading 原生行为一致
- `slots`：插槽（header、footer、title、default）
  - 所有插槽函数通过闭包访问响应式状态，不接收 `instance` 参数
  - `slots.default` 优先级高于 `content` 属性
- `onConfirm`：确认按钮钩子（可选）
- `onCancel`：取消按钮钩子（可选）
- `loading`：弹窗 loading 状态（Ref<boolean>，可选）
  - 如果传入则使用用户的，否则使用内部的
  - 弹窗 loading 只作用在弹窗内容区域，不是整个弹窗
- `buttonLoadings`：按钮 loading 状态（Ref<Record<string, boolean>>，可选）
  - 如果传入则使用用户的，否则使用内部的
  - 键名对应按钮的 eventName（如 'confirm'、'cancel' 等）

**注意**：
- 生命周期钩子（`beforeClose`、`@opened`、`@closed`）直接使用 `ElDialog` 的原生支持，无需额外定义
- `@opened` 和 `@closed` 事件不接收 `instance` 参数，通过闭包访问响应式状态
- `content` 和 `slots` 的渲染函数通过闭包访问（从 `dialog.use()` 解构的变量），不接收 `instance` 参数

**DialogInstance：**

- `id`：唯一标识符（string）
- `modelValue`：v-model 绑定的响应式值（Ref<boolean>），唯一控制方式
  - 直接设置 `modelValue.value = true/false` 即可控制弹窗显示/隐藏
  - 使用 `modelValue` 命名，符合 Vue 3 v-model 标准和 Element Plus 规范
- `loading`：弹窗加载状态（Ref<boolean>），自动显示遮罩层
  - 弹窗 loading 只作用在弹窗内容区域，不是整个弹窗
  - 通过 `instance.loading.value = true/false` 控制
- `buttonLoadings`：统一的按钮 loading 管理（Ref<Record<string, boolean>>）
  - 键名对应按钮的 eventName（如 'confirm'、'cancel'、'draft' 等）
  - 直接使用 `buttonLoadings.value.buttonName = true/false` 即可
- `confirmLoading`：确认按钮 loading（WritableComputedRef<boolean>），快捷方式
  - 等同于 `buttonLoadings.value.confirm`
  - 可以直接设置 `confirmLoading.value = true/false`
- `cancelLoading`：取消按钮 loading（WritableComputedRef<boolean>），快捷方式
  - 等同于 `buttonLoadings.value.cancel`
  - 可以直接设置 `cancelLoading.value = true/false`

## 💡 使用建议

**核心特性：**
- ✅ `useDialog` 完全独立使用，通过 `createDialogApp` 自动创建和挂载 Vue 应用，弹窗自动渲染到 DOM，**无需在模板中添加任何组件**
- ✅ 只使用 `v-model` 控制弹窗显示/隐藏（`modelValue.value = true/false`）
- ✅ 支持 `ElDialog` 的原生生命周期钩子（`beforeClose`、`@opened`、`@closed`），支持异步
- ✅ 内置 loading 状态管理（弹窗和按钮级别）
  - 弹窗 loading：通过 `instance.loading.value = true/false` 控制，自动显示遮罩层
  - 按钮 loading：通过 `instance.buttonLoadings.value.buttonName = true/false` 或 `instance.confirmLoading.value = true/false` 控制
- ✅ 支持多个弹窗实例，自动管理 z-index（通过 DialogStack 自动分配和更新）
- ✅ 完全透传 Element Plus Dialog 的所有属性、事件、插槽
- ✅ 内置 el-scrollbar，提供统一的滚动体验，支持 `scrollbarProps` 自定义配置
- ✅ 支持 `loadingProps` 自定义 el-loading 配置，保持与 el-loading 原生行为一致

**数据共享模式：**
- 所有插槽函数和 `content` 渲染函数通过闭包访问响应式状态
- 在 `onOpened` 中获取的数据可以通过响应式变量在 `default`、`header`、`footer` 等插槽中共享使用
- 自定义组件可以通过 props 传递数据，通过事件监听处理组件暴露的事件

## 📚 更多示例

### 基础示例

```typescript
import { useDialog } from '@iswangh/element-plus-kit-dialog'
import { ElButton, ElMessage } from 'element-plus'

const dialog = useDialog()

const { modelValue, loading } = dialog.use({
  title: '基础弹窗',
  width: '500px',
  content: '这是弹窗内容',
  onOpened: async () => {
    loading.value = true
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 2000))
    loading.value = false
    ElMessage.success('数据加载完成')
  },
})
```

### 使用插槽

```typescript
import { useDialog } from '@iswangh/element-plus-kit-dialog'
import { ElButton, ElMessage } from 'element-plus'
import { h } from 'vue'

const dialog = useDialog()

const { modelValue, confirmLoading, cancelLoading } = dialog.use({
  width: '500px',
  slots: {
    header: () => h('div', { style: { fontWeight: 'bold' } }, '自定义头部'),
    default: () => h('div', '这是弹窗内容区域'),
    footer: () => h('div', { style: { textAlign: 'right' } }, [
      h(ElButton, {
        loading: cancelLoading.value,
        onClick: () => {
          modelValue.value = false
        },
      }, () => '取消'),
      h(ElButton, {
        type: 'primary',
        loading: confirmLoading.value,
        onClick: async () => {
          confirmLoading.value = true
          await new Promise(resolve => setTimeout(resolve, 2000))
          confirmLoading.value = false
          ElMessage.success('操作完成')
          modelValue.value = false
        },
      }, () => '确认'),
    ]),
  },
})
```

### 数据共享示例

```typescript
import { useDialog } from '@iswangh/element-plus-kit-dialog'
import { ElButton, ElMessage } from 'element-plus'
import { h, ref } from 'vue'

const dialog = useDialog()

// 在 onOpened 中获取的数据可以通过响应式变量在插槽中共享使用
const userData = ref<{ username: string, email: string } | null>(null)

const { modelValue, loading } = dialog.use({
  title: '数据共享示例',
  width: '600px',
  slots: {
    default: () => {
      // 在 default 插槽中访问 onOpened 中获取的数据（通过闭包访问）
      if (!userData.value) {
        return h('div', '数据加载中...')
      }
      return h('div', [
        h('p', `用户名: ${userData.value.username}`),
        h('p', `邮箱: ${userData.value.email}`),
      ])
    },
  },
  onOpened: async () => {
    loading.value = true
    // 模拟异步请求
    await new Promise(resolve => setTimeout(resolve, 2000))
    userData.value = {
      username: 'John Doe',
      email: 'john@example.com',
    }
    loading.value = false
    ElMessage.success('数据加载完成')
  },
  onClosed: () => {
    // 清理数据
    userData.value = null
  },
})
```

### scrollbarProps 和 loadingProps 配置

```typescript
import { useDialog } from '@iswangh/element-plus-kit-dialog'
import { h } from 'vue'

const dialog = useDialog()

const { modelValue, loading } = dialog.use({
  title: '滚动和 Loading 配置',
  width: '500px',
  scrollbarProps: {
    maxHeight: '300px',
  },
  loadingProps: {
    text: '正在加载数据...',
    background: 'rgba(0, 0, 0, 0.7)',
  },
  slots: {
    default: () => h('div', Array.from({ length: 20 }, (_, i) => 
      h('p', `这是第 ${i + 1} 行内容，用于测试滚动功能。`)
    )),
  },
})

// 控制 loading
loading.value = true
```

## 🔗 相关链接

- [主包文档](../kit/README.md)
- [Element Plus Dialog 文档](https://element-plus.org/zh-CN/component/dialog.html)
- [详细使用示例和可交互文档](../../docs/components/dialog/index.md)

## 📄 许可证

Apache-2.0
