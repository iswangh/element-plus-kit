# Dialog 弹窗

基于 Element Plus Dialog 的封装组件，提供组合式函数 `useDialog`，支持完全独立使用，无需在模板中添加组件。

## 基础用法

`useDialog` 组合式函数完全独立使用，弹窗自动渲染到 DOM，无需在模板中添加任何组件。

:::demo

```vue
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit'

const dialog = useDialog()

const { modelValue } = dialog.use({
  title: '基础弹窗',
  width: '500px',
  content: '这是使用 useDialog 组合式函数创建的弹窗内容。弹窗会自动渲染到 DOM，无需在模板中添加组件。',
})
</script>

<template>
  <el-button type="primary" @click="modelValue = true">
    打开弹窗
  </el-button>
</template>
```

:::

## content 属性

`content` 属性支持多种类型：字符串、VNode、组件、渲染函数。渲染函数通过闭包访问响应式状态，不接收 `instance` 参数。

:::demo

```vue
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit'
import { h, defineComponent } from 'vue'

const dialog = useDialog()

// 示例1：字符串
const { modelValue: stringVisible } = dialog.use({
  title: 'content 属性 - 字符串',
  width: '500px',
  content: '这是使用 content 属性传入的字符串内容。',
})

// 示例2：渲染函数返回字符串
const { modelValue: functionStringVisible } = dialog.use({
  title: 'content 属性 - 函数返回字符串',
  width: '500px',
  content: () => `当前时间: ${new Date().toLocaleString()}`,
})

// 示例3：渲染函数返回 VNode
const { modelValue: functionVNodeVisible, id } = dialog.use({
  title: 'content 属性 - 函数返回 VNode',
  width: '500px',
  content: () => h('div', [
    h('p', { style: { color: '#409EFF' } }, '这是使用 h() 函数创建的 VNode'),
    h('p', `弹窗 ID: ${id}`),
  ]),
})

// 示例4：渲染函数返回 Component
const ContentComponent = defineComponent({
  props: {
    message: {
      type: String,
      default: '这是自定义组件',
    },
  },
  setup(props) {
    return () => h('div', { style: { padding: '16px', backgroundColor: '#F5F7FA', borderRadius: '4px' } }, [
      h('p', { style: { fontWeight: 'bold' } }, props.message),
      h('p', { style: { color: '#909399', fontSize: '12px' } }, '这是通过 content 属性传入的自定义组件'),
    ])
  },
})

const { modelValue: componentVisible } = dialog.use({
  title: 'content 属性 - 函数返回 Component',
  width: '500px',
  content: () => ContentComponent,
})
</script>

<template>
  <el-space>
    <el-button type="primary" @click="stringVisible = true">
      字符串内容
    </el-button>
    <el-button type="primary" @click="functionStringVisible = true">
      函数返回字符串
    </el-button>
    <el-button type="primary" @click="functionVNodeVisible = true">
      函数返回 VNode
    </el-button>
    <el-button type="primary" @click="componentVisible = true">
      函数返回 Component
    </el-button>
  </el-space>
</template>
```

:::

## 插槽使用

使用 `slots` 属性自定义弹窗的头部、内容、底部等区域。所有插槽函数通过闭包访问响应式状态，不接收 `instance` 参数。`slots.default` 优先级高于 `content` 属性。

:::demo

```vue
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit'
import { ElButton } from 'element-plus'
import { h } from 'vue'

const dialog = useDialog()

const { modelValue, confirmLoading, cancelLoading } = dialog.use({
  width: '500px',
  slots: {
    header: () => h('div', { style: { fontWeight: 'bold', color: '#409EFF' } }, '自定义头部'),
    default: () => h('div', '这是弹窗内容区域，使用 slots.default 定义。'),
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
          modelValue.value = false
        },
      }, () => '确认'),
    ]),
  },
})
</script>

<template>
  <el-button type="primary" @click="modelValue = true">
    打开弹窗（使用插槽）
  </el-button>
</template>
```

:::

## 弹窗 Loading

通过 `instance.loading.value = true/false` 控制弹窗 loading 状态，loading 遮罩层只作用在弹窗内容区域，不是整个弹窗。

:::demo

```vue
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit'
import { ElButton, ElMessage } from 'element-plus'

const dialog = useDialog()

const { modelValue, loading } = dialog.use({
  title: '弹窗 Loading',
  width: '500px',
  content: '这个弹窗展示了弹窗 loading 功能，loading 遮罩层只作用在内容区域。',
})

function handleOpen() {
  modelValue.value = true
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据加载完成')
  }, 2000)
}
</script>

<template>
  <el-button type="primary" @click="handleOpen">
    弹窗 Loading（默认配置）
  </el-button>
</template>
```

:::

## 自定义 Loading 配置

通过 `loadingProps` 自定义 el-loading 配置，保持与 el-loading 原生行为一致。

:::demo

```vue
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit'
import { ElButton, ElMessage } from 'element-plus'

const dialog = useDialog()

const { modelValue, loading } = dialog.use({
  title: '自定义 Loading 配置',
  width: '500px',
  content: '这个弹窗展示了自定义 loadingProps 功能。',
  loadingProps: {
    text: '正在加载数据...',
    background: 'rgba(0, 0, 0, 0.7)',
  },
})

function handleOpen() {
  modelValue.value = true
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据加载完成')
  }, 2000)
}
</script>

<template>
  <el-button type="primary" @click="handleOpen">
    自定义 Loading（loadingProps）
  </el-button>
</template>
```

:::

## scrollbarProps 配置

通过 `scrollbarProps` 配置 el-scrollbar 属性，控制内容区域的滚动行为。el-scrollbar 始终内置使用，提供统一的滚动体验。

:::demo

```vue
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit'
import { ElButton } from 'element-plus'
import { h } from 'vue'

const dialog = useDialog()

const { modelValue } = dialog.use({
  title: 'scrollbarProps 配置',
  width: '500px',
  scrollbarProps: {
    maxHeight: '300px',
  },
  content: () => h('div', Array.from({ length: 20 }, (_, i) => 
    h('p', { style: { margin: '8px 0' } }, `这是第 ${i + 1} 行内容，用于测试滚动功能。当内容超过 maxHeight 时，会出现滚动条。`)
  )),
})
</script>

<template>
  <el-button type="primary" @click="modelValue = true">
    scrollbarProps 配置（maxHeight）
  </el-button>
</template>
```

:::

## 按钮 Loading

通过 `buttonLoadings` 或快捷方式 `confirmLoading`、`cancelLoading` 控制按钮级别的 loading 状态。

:::demo

```vue
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit'
import { ElButton, ElMessage } from 'element-plus'
import { h } from 'vue'

const dialog = useDialog()

// 方式1：使用 buttonLoadings
const { modelValue: buttonLoadingVisible, buttonLoadings } = dialog.use({
  title: '按钮 Loading',
  width: '500px',
  content: '这个弹窗展示了按钮级别的 loading 功能。',
  slots: {
    footer: () => h('div', { style: { textAlign: 'right' } }, [
      h(ElButton, {
        loading: buttonLoadings.value.cancel,
        onClick: async () => {
          buttonLoadings.value.cancel = true
          await new Promise(resolve => setTimeout(resolve, 2000))
          buttonLoadings.value.cancel = false
          ElMessage.success('取消操作完成')
        },
      }, () => '取消'),
      h(ElButton, {
        type: 'primary',
        loading: buttonLoadings.value.confirm,
        onClick: async () => {
          buttonLoadings.value.confirm = true
          await new Promise(resolve => setTimeout(resolve, 2000))
          buttonLoadings.value.confirm = false
          ElMessage.success('确认操作完成')
        },
      }, () => '确认'),
    ]),
  },
})

// 方式2：使用快捷方式
const { modelValue: quickLoadingVisible, cancelLoading, confirmLoading } = dialog.use({
  title: '按钮 Loading 快捷方式',
  width: '500px',
  content: '这个弹窗展示了使用 confirmLoading 和 cancelLoading 快捷方式。',
  slots: {
    footer: () => h('div', { style: { textAlign: 'right' } }, [
      h(ElButton, {
        loading: cancelLoading.value,
        onClick: async () => {
          cancelLoading.value = true
          await new Promise(resolve => setTimeout(resolve, 2000))
          cancelLoading.value = false
          ElMessage.success('取消操作完成')
        },
      }, () => '取消'),
      h(ElButton, {
        type: 'primary',
        loading: confirmLoading.value,
        onClick: async () => {
          confirmLoading.value = true
          await new Promise(resolve => setTimeout(resolve, 2000))
          confirmLoading.value = false
          ElMessage.success('确认操作完成')
        },
      }, () => '确认'),
    ]),
  },
})
</script>

<template>
  <el-space>
    <el-button type="primary" @click="buttonLoadingVisible = true">
      按钮 Loading（buttonLoadings）
    </el-button>
    <el-button type="primary" @click="quickLoadingVisible = true">
      按钮 Loading（快捷方式）
    </el-button>
  </el-space>
</template>
```

:::

## el-dialog 原生功能

`useDialog` 完全支持 `el-dialog` 的所有原生属性、事件和插槽，直接透传，无需额外配置。

:::demo

```vue
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'

const dialog = useDialog()

// 示例1：基础属性
const { modelValue: basicVisible } = dialog.use({
  title: '基础属性示例',
  width: '500px',
  content: '这是使用 el-dialog 原生属性创建的弹窗。支持 width、title、close-on-click-modal 等所有原生属性。',
})

// 示例2：关闭行为控制
const { modelValue: closeBehaviorVisible } = dialog.use({
  title: '关闭行为控制',
  width: '500px',
  content: '这个弹窗设置了 close-on-click-modal="false"，点击遮罩层不会关闭。',
  closeOnClickModal: false,
  closeOnPressEscape: true,
})

// 示例3：destroy-on-close
const { modelValue: destroyVisible } = dialog.use({
  title: 'destroy-on-close',
  width: '500px',
  content: '这个弹窗设置了 destroy-on-close="true"，关闭时会销毁 DOM。',
  destroyOnClose: true,
})

// 示例4：beforeClose 钩子
const { modelValue: beforeCloseVisible } = dialog.use({
  title: 'beforeClose 钩子',
  width: '500px',
  content: '这个弹窗设置了 beforeClose 钩子，关闭前会弹出确认对话框。',
  beforeClose: async (done) => {
    try {
      await ElMessageBox.confirm('确定要关闭弹窗吗？', '提示', {
        type: 'warning',
        zIndex: 3000,
      } as Parameters<typeof ElMessageBox.confirm>[2] & { zIndex?: number })
      done()
    }
    catch {
      // 用户取消，不关闭弹窗
    }
  },
})

// 示例5：onOpened 事件
const { modelValue: openedVisible } = dialog.use({
  title: 'onOpened 事件',
  width: '500px',
  content: '这个弹窗设置了 onOpened 事件，打开时会触发。',
  onOpened: () => {
    ElMessage.success('弹窗已打开')
  },
})

// 示例6：onClosed 事件
const { modelValue: closedVisible } = dialog.use({
  title: 'onClosed 事件',
  width: '500px',
  content: '这个弹窗设置了 onClosed 事件，关闭时会触发。',
  onClosed: () => {
    ElMessage.success('弹窗已关闭')
  },
})
</script>

<template>
  <el-space direction="vertical" :size="20" fill>
    <el-alert type="info" :closable="false" show-icon>
      <template #default>
        <p class="text-sm text-gray-600 m-0">
          <code>useDialog</code> 完全支持 <code>el-dialog</code> 的所有原生属性、事件和插槽，直接透传，无需额外配置。
        </p>
      </template>
    </el-alert>

    <el-space>
      <el-button type="primary" @click="basicVisible = true">
        基础属性示例
      </el-button>
      <el-button type="primary" @click="closeBehaviorVisible = true">
        关闭行为控制
      </el-button>
      <el-button type="primary" @click="destroyVisible = true">
        destroy-on-close
      </el-button>
      <el-button type="primary" @click="beforeCloseVisible = true">
        beforeClose 钩子
      </el-button>
      <el-button type="primary" @click="openedVisible = true">
        onOpened 事件
      </el-button>
      <el-button type="primary" @click="closedVisible = true">
        onClosed 事件
      </el-button>
    </el-space>
  </el-space>
</template>
```

:::

## 生命周期钩子

`useDialog` 支持 `ElDialog` 的原生属性 `beforeClose` 和事件 `@opened`、`@closed`，支持异步操作。

:::demo

```vue
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { h, ref } from 'vue'

const dialog = useDialog()

const userData = ref<{ username: string, email: string } | null>(null)

const { modelValue, loading } = dialog.use({
  title: '异步钩子',
  width: '500px',
  content: () => h('div', [
    userData.value
      ? h('div', [
          h('p', `用户名: ${userData.value.username}`),
          h('p', `邮箱: ${userData.value.email}`),
        ])
      : null,
  ]),
  // 使用 ElDialog 的原生事件 @opened
  // 注意：onOpened 不接收任何参数，如果需要访问 instance，通过闭包访问
  onOpened: async () => {
    loading.value = true
    ElMessage.info('开始加载数据...')
    // 模拟异步请求
    await new Promise(resolve => setTimeout(resolve, 2000))
    userData.value = {
      username: 'John Doe',
      email: 'john@example.com',
    }
    loading.value = false
    ElMessage.success('数据加载完成')
  },
  // 使用 ElDialog 的原生属性 beforeClose
  // 注意：beforeClose 接收 done 回调函数，不接收 instance 参数
  // 如果需要访问 instance，通过闭包访问（从 dialog.use() 解构的变量）
  beforeClose: async (done) => {
    try {
      await ElMessageBox.confirm('确定要关闭弹窗吗？', '提示', {
        type: 'warning',
        zIndex: 3000,
      } as Parameters<typeof ElMessageBox.confirm>[2] & { zIndex?: number })
      done()
    }
    catch {
      // 用户取消，不关闭弹窗
    }
  },
  // 使用 ElDialog 的原生事件 @closed
  onClosed: async () => {
    ElMessage.success('弹窗已关闭')
    userData.value = null
  },
})
</script>

<template>
  <el-button type="primary" @click="modelValue = true">
    打开弹窗（异步钩子）
  </el-button>
</template>
```

:::

## 数据共享

在 `onOpened` 中获取的数据可以通过响应式变量在 `default`、`header`、`footer` 等插槽中共享使用。所有插槽的渲染函数都通过闭包访问响应式状态。

:::demo

```vue
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit'
import { ElButton, ElMessage } from 'element-plus'
import { h, ref } from 'vue'

const dialog = useDialog()

// 示例1：onOpened 中获取数据，在 default 插槽中使用
const userData = ref<{ username: string, email: string } | null>(null)

const { modelValue: dataSharingVisible, loading } = dialog.use({
  title: '数据共享示例',
  width: '600px',
  slots: {
    default: () => {
      // 在 default 插槽中访问 onOpened 中获取的数据（通过闭包访问）
      if (!userData.value) {
        return h('div', '数据加载中...')
      }
      return h('div', [
        h('p', { style: { fontWeight: 'bold' } }, '用户信息：'),
        h('p', `用户名: ${userData.value.username}`),
        h('p', `邮箱: ${userData.value.email}`),
      ])
    },
  },
  onOpened: async () => {
    loading.value = true
    ElMessage.info('开始加载数据...')
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
</script>

<template>
  <el-button type="primary" @click="dataSharingVisible = true">
    数据共享示例
  </el-button>
</template>
```

:::

## 全局配置

通过 `useDialog(globalConfig)` 传入全局配置，所有 `dialog.use()` 创建的实例都会继承全局配置，实例配置会覆盖全局配置。

:::demo

```vue
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit'
import { ElButton } from 'element-plus'
import { h } from 'vue'

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

// 实例1：继承全局配置
const { modelValue: globalConfigVisible1 } = dialog.use({
  title: '继承全局配置',
  content: '这个弹窗继承了全局配置：width="600px"、closeOnClickModal=false、destroyOnClose=true。',
})

// 实例2：覆盖全局配置
const { modelValue: globalConfigVisible2 } = dialog.use({
  title: '覆盖全局配置',
  width: '500px', // 覆盖全局配置的 width
  closeOnClickModal: true, // 覆盖全局配置的 closeOnClickModal
  content: '这个弹窗覆盖了全局配置：width="500px"、closeOnClickModal=true。',
})
</script>

<template>
  <el-space>
    <el-button type="primary" @click="globalConfigVisible1 = true">
      继承全局配置
    </el-button>
    <el-button type="primary" @click="globalConfigVisible2 = true">
      覆盖全局配置
    </el-button>
  </el-space>
</template>
```

:::

## 多个弹窗实例

支持创建多个弹窗实例，自动管理 z-index（通过 DialogStack 自动分配和更新）。

:::demo

```vue
<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit'
import { ElButton } from 'element-plus'

const dialog = useDialog()

// 创建多个弹窗实例
const { modelValue: dialog1Visible } = dialog.use({
  title: '弹窗 1',
  width: '400px',
  content: '这是第一个弹窗。',
})

const { modelValue: dialog2Visible } = dialog.use({
  title: '弹窗 2',
  width: '400px',
  content: '这是第二个弹窗。',
})

const { modelValue: dialog3Visible } = dialog.use({
  title: '弹窗 3',
  width: '400px',
  content: '这是第三个弹窗。',
})

function openAll() {
  dialog1Visible.value = true
  setTimeout(() => {
    dialog2Visible.value = true
  }, 300)
  setTimeout(() => {
    dialog3Visible.value = true
  }, 600)
}
</script>

<template>
  <el-space>
    <el-button type="primary" @click="dialog1Visible = true">
      打开弹窗 1
    </el-button>
    <el-button type="primary" @click="dialog2Visible = true">
      打开弹窗 2
    </el-button>
    <el-button type="primary" @click="dialog3Visible = true">
      打开弹窗 3
    </el-button>
    <el-button type="success" @click="openAll">
      依次打开所有弹窗
    </el-button>
  </el-space>
</template>
```

:::

## API

### 组合式函数

#### useDialog

##### useDialog(globalConfig?)

创建弹窗实例管理器，支持全局配置。

**参数：**

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| globalConfig | 页面级别的全局配置，会被所有 `dialog.use()` 创建的实例继承 | `DialogGlobalConfig` | - |

**返回值：**

- `UseDialogReturn`：包含 `use` 方法的对象

##### dialog.use(options)

创建弹窗实例。

**参数：**

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 弹窗选项，会继承 `useDialog()` 传入的全局配置 | `DialogOptions` | - |

**返回值：**

- `DialogInstance`：弹窗实例，包含 `modelValue`、`loading`、`buttonLoadings` 等响应式状态

#### DialogOptions

支持 [`ElDialog`](https://element-plus.org/zh-CN/component/dialog.html)。

**拓展属性**：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 内容（支持字符串、VNode、组件、渲染函数） | `string \| VNode \| Component \| (() => string \| Component \| VNode)` | - |
| scrollbarProps | el-scrollbar 的属性配置 | `Partial<ElScrollbarProps>` | - |
| loadingProps | el-loading 的属性配置 | `Partial<ElLoadingOptions>` | - |
| slots | 插槽（header、footer、title、default） | `{ default?: () => VNode, header?: () => VNode, footer?: () => VNode, title?: () => VNode }` | - |
| onConfirm | 确认按钮钩子（可选） | `() => void \| Promise<void>` | - |
| onCancel | 取消按钮钩子（可选） | `() => void` | - |
| loading | 弹窗 loading 状态（可选，如果传入则使用用户的，否则使用内部的） | `Ref<boolean>` | - |
| buttonLoadings | 按钮 loading 状态（可选，如果传入则使用用户的，否则使用内部的） | `Ref<Record<string, boolean>>` | - |

**注意**：
- 生命周期钩子（`beforeClose`、`@opened`、`@closed`）直接使用 `ElDialog` 的原生支持，无需额外定义
- `@opened` 和 `@closed` 事件不接收 `instance` 参数，通过闭包访问响应式状态
- `content` 和 `slots` 的渲染函数通过闭包访问（从 `dialog.use()` 解构的变量），不接收 `instance` 参数
- `slots.default` 优先级高于 `content` 属性

#### DialogInstance

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| id | 唯一标识符 | `string` |
| modelValue | v-model 绑定的响应式值（唯一控制方式） | `Ref<boolean>` |
| loading | 弹窗加载状态（自动显示遮罩层） | `Ref<boolean>` |
| buttonLoadings | 统一的按钮 loading 管理（响应式） | `Ref<Record<string, boolean>>` |
| confirmLoading | 确认按钮 loading（快捷方式，计算属性） | `WritableComputedRef<boolean>` |
| cancelLoading | 取消按钮 loading（快捷方式，计算属性） | `WritableComputedRef<boolean>` |

#### DialogGlobalConfig

支持 [`ElDialog`](https://element-plus.org/zh-CN/component/dialog.html) 所有的属性。

**拓展属性**：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| scrollbarProps | el-scrollbar 的属性配置（全局配置） | `Partial<ElScrollbarProps>` | - |
| loadingProps | el-loading 的属性配置（全局配置） | `Partial<ElLoadingOptions>` | - |
