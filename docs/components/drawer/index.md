# Drawer 抽屉

基于 Element Plus Drawer 的封装组件，提供组合式函数 `useDrawer`，支持完全独立使用，无需在模板中添加组件。

## 基础用法

`useDrawer` 组合式函数完全独立使用，抽屉自动渲染到 DOM，无需在模板中添加任何组件。

:::demo

```vue
<script setup lang="ts">
import { useDrawer } from '@iswangh/element-plus-kit'

const drawer = useDrawer()

const { modelValue } = drawer.use({
  title: '基础抽屉',
  size: '500px',
  content: '这是使用 useDrawer 组合式函数创建的抽屉内容。抽屉会自动渲染到 DOM，无需在模板中添加组件。',
})
</script>

<template>
  <el-button type="primary" @click="modelValue = true">
    打开抽屉
  </el-button>
</template>
```

:::

## content 属性

`content` 属性支持多种类型：字符串、VNode、组件、渲染函数。渲染函数通过闭包访问响应式状态，不接收 `instance` 参数。

:::demo

```vue
<script setup lang="ts">
import { useDrawer } from '@iswangh/element-plus-kit'
import { h, defineComponent } from 'vue'

const drawer = useDrawer()

// 示例1：字符串
const { modelValue: stringVisible } = drawer.use({
  title: 'content 属性 - 字符串',
  size: '500px',
  content: '这是使用 content 属性传入的字符串内容。',
})

// 示例2：渲染函数返回字符串
const { modelValue: functionStringVisible } = drawer.use({
  title: 'content 属性 - 函数返回字符串',
  size: '500px',
  content: () => `当前时间: ${new Date().toLocaleString()}`,
})

// 示例3：渲染函数返回 VNode
const { modelValue: functionVNodeVisible, id } = drawer.use({
  title: 'content 属性 - 函数返回 VNode',
  size: '500px',
  content: () => h('div', [
    h('p', { style: { color: '#409EFF' } }, '这是使用 h() 函数创建的 VNode'),
    h('p', `抽屉 ID: ${id}`),
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

const { modelValue: componentVisible } = drawer.use({
  title: 'content 属性 - 函数返回 Component',
  size: '500px',
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

使用 `slots` 属性自定义抽屉的头部、内容、底部等区域。所有插槽函数通过闭包访问响应式状态，不接收 `instance` 参数。`slots.default` 优先级高于 `content` 属性。

:::demo

```vue
<script setup lang="ts">
import { useDrawer } from '@iswangh/element-plus-kit'
import { ElButton } from 'element-plus'
import { h } from 'vue'

const drawer = useDrawer()

const { modelValue, confirmLoading, cancelLoading } = drawer.use({
  size: '500px',
  slots: {
    header: () => h('div', { style: { fontWeight: 'bold', color: '#409EFF' } }, '自定义头部'),
    default: () => h('div', '这是抽屉内容区域，使用 slots.default 定义。'),
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
    打开抽屉（使用插槽）
  </el-button>
</template>
```

:::

## 抽屉 Loading

通过 `instance.loading.value = true/false` 控制抽屉 loading 状态，loading 遮罩层只作用在抽屉内容区域，不是整个抽屉。

:::demo

```vue
<script setup lang="ts">
import { useDrawer } from '@iswangh/element-plus-kit'
import { ElButton, ElMessage } from 'element-plus'

const drawer = useDrawer()

const { modelValue, loading } = drawer.use({
  title: '抽屉 Loading',
  size: '500px',
  content: '这个抽屉展示了抽屉 loading 功能，loading 遮罩层只作用在内容区域。',
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
    抽屉 Loading（默认配置）
  </el-button>
</template>
```

:::

## 自定义 Loading 配置

通过 `loadingProps` 自定义 el-loading 配置，保持与 el-loading 原生行为一致。

:::demo

```vue
<script setup lang="ts">
import { useDrawer } from '@iswangh/element-plus-kit'
import { ElButton, ElMessage } from 'element-plus'

const drawer = useDrawer()

const { modelValue, loading } = drawer.use({
  title: '自定义 Loading 配置',
  size: '500px',
  content: '这个抽屉展示了自定义 loadingProps 功能。',
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

## size 控制

通过 `size` 属性控制抽屉的大小，支持固定像素值（如 `300px`、`500px`）和百分比值（如 `50%`）。抽屉的高度通过 `size` 属性控制，内容区域使用原生滚动，当内容超出时自动显示滚动条。

:::demo

```vue
<script setup lang="ts">
import { useDrawer } from '@iswangh/element-plus-kit'
import { ElButton } from 'element-plus'
import { h } from 'vue'

const drawer = useDrawer()

// 小尺寸
const { modelValue: sizeSmallVisible } = drawer.use({
  title: 'size 控制 - 小尺寸（300px）',
  size: '300px',
  content: () => h('div', Array.from({ length: 50 }, (_, i) => h('p', { style: { margin: '8px 0' } }, `这是第 ${i + 1} 行内容，用于测试滚动效果。当内容超出抽屉高度时，会自动显示滚动条。`))),
})

// 中等尺寸
const { modelValue: sizeMediumVisible } = drawer.use({
  title: 'size 控制 - 中等尺寸（500px）',
  size: '500px',
  content: () => h('div', Array.from({ length: 50 }, (_, i) => h('p', { style: { margin: '8px 0' } }, `这是第 ${i + 1} 行内容，用于测试滚动效果。当内容超出抽屉高度时，会自动显示滚动条。`))),
})

// 百分比
const { modelValue: sizePercentVisible } = drawer.use({
  title: 'size 控制 - 百分比（50%）',
  size: '50%',
  content: () => h('div', Array.from({ length: 100 }, (_, i) => h('p', { style: { margin: '8px 0' } }, `这是第 ${i + 1} 行内容，用于测试滚动效果。使用百分比单位时，抽屉大小会根据视口大小自适应。`))),
})
</script>

<template>
  <el-space>
    <el-button type="primary" @click="sizeSmallVisible = true">
      小尺寸（300px）
    </el-button>
    <el-button type="primary" @click="sizeMediumVisible = true">
      中等尺寸（500px）
    </el-button>
    <el-button type="primary" @click="sizePercentVisible = true">
      百分比（50%）
    </el-button>
  </el-space>
</template>
```

:::

## 按钮 Loading

通过 `buttonLoadings` 或快捷方式 `confirmLoading`、`cancelLoading` 控制按钮级别的 loading 状态。

:::demo

```vue
<script setup lang="ts">
import { useDrawer } from '@iswangh/element-plus-kit'
import { ElButton, ElMessage } from 'element-plus'
import { h } from 'vue'

const drawer = useDrawer()

// 方式1：使用 buttonLoadings
const { modelValue: buttonLoadingVisible, buttonLoadings } = drawer.use({
  title: '按钮 Loading',
  size: '500px',
  content: '这个抽屉展示了按钮级别的 loading 功能。',
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
const { modelValue: quickLoadingVisible, cancelLoading, confirmLoading } = drawer.use({
  title: '按钮 Loading 快捷方式',
  size: '500px',
  content: '这个抽屉展示了使用 confirmLoading 和 cancelLoading 快捷方式。',
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

## el-drawer 原生功能

`useDrawer` 完全支持 `el-drawer` 的所有原生属性、事件和插槽，直接透传，无需额外配置。

:::demo

```vue
<script setup lang="ts">
import { useDrawer } from '@iswangh/element-plus-kit'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'

const drawer = useDrawer()

// 示例1：基础属性
const { modelValue: basicVisible } = drawer.use({
  title: '基础属性示例',
  size: '500px',
  content: '这是使用 el-drawer 原生属性创建的抽屉。支持 size、title、direction 等所有原生属性。',
})

// 示例2：关闭行为控制
const { modelValue: closeBehaviorVisible } = drawer.use({
  title: '关闭行为控制',
  size: '500px',
  content: '这个抽屉设置了 close-on-click-modal="false"，点击遮罩层不会关闭。',
  closeOnClickModal: false,
  closeOnPressEscape: true,
})

// 示例3：destroy-on-close
const { modelValue: destroyVisible } = drawer.use({
  title: 'destroy-on-close',
  size: '500px',
  content: '这个抽屉设置了 destroy-on-close="true"，关闭时会销毁 DOM。',
  destroyOnClose: true,
})

// 示例4：beforeClose 钩子
const { modelValue: beforeCloseVisible } = drawer.use({
  title: 'beforeClose 钩子',
  size: '500px',
  content: '这个抽屉设置了 beforeClose 钩子，关闭前会弹出确认对话框。',
  beforeClose: async (done) => {
    try {
      await ElMessageBox.confirm('确定要关闭抽屉吗？', '提示', {
        type: 'warning',
        zIndex: 3000,
      } as Parameters<typeof ElMessageBox.confirm>[2] & { zIndex?: number })
      done()
    }
    catch {
      // 用户取消，不关闭抽屉
    }
  },
})

// 示例5：onOpened 事件
const { modelValue: openedVisible } = drawer.use({
  title: 'onOpened 事件',
  size: '500px',
  content: '这个抽屉设置了 onOpened 事件，打开时会触发。',
  onOpened: () => {
    ElMessage.success('抽屉已打开')
  },
})

// 示例6：onClosed 事件
const { modelValue: closedVisible } = drawer.use({
  title: 'onClosed 事件',
  size: '500px',
  content: '这个抽屉设置了 onClosed 事件，关闭时会触发。',
  onClosed: () => {
    ElMessage.success('抽屉已关闭')
  },
})

// 示例7：不同方向
const { modelValue: directionRtlVisible } = drawer.use({
  title: '从右侧滑出',
  size: '400px',
  direction: 'rtl',
  content: '这个抽屉从右侧滑出（direction=rtl）。',
})

const { modelValue: directionLtrVisible } = drawer.use({
  title: '从左侧滑出',
  size: '400px',
  direction: 'ltr',
  content: '这个抽屉从左侧滑出（direction=ltr）。',
})

const { modelValue: directionTtbVisible } = drawer.use({
  title: '从上侧滑出',
  size: '400px',
  direction: 'ttb',
  content: '这个抽屉从上侧滑出（direction=ttb）。',
})

const { modelValue: directionBttVisible } = drawer.use({
  title: '从下侧滑出',
  size: '400px',
  direction: 'btt',
  content: '这个抽屉从下侧滑出（direction=btt）。',
})
</script>

<template>
  <el-space direction="vertical" :size="20" fill>
    <el-alert type="info" :closable="false" show-icon>
      <template #default>
        <p class="text-sm text-gray-600 m-0">
          <code>useDrawer</code> 完全支持 <code>el-drawer</code> 的所有原生属性、事件和插槽，直接透传，无需额外配置。
        </p>
      </template>
    </el-alert>

    <el-space wrap>
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

    <el-divider content-position="left">
      <span class="text-base font-semibold">不同方向</span>
    </el-divider>
    <el-space wrap>
      <el-button type="primary" @click="directionRtlVisible = true">
        从右侧滑出
      </el-button>
      <el-button type="primary" @click="directionLtrVisible = true">
        从左侧滑出
      </el-button>
      <el-button type="primary" @click="directionTtbVisible = true">
        从上侧滑出
      </el-button>
      <el-button type="primary" @click="directionBttVisible = true">
        从下侧滑出
      </el-button>
    </el-space>
  </el-space>
</template>
```

:::

## 生命周期钩子

`useDrawer` 支持 `ElDrawer` 的原生属性 `beforeClose` 和事件 `@opened`、`@closed`，支持异步操作。

:::demo

```vue
<script setup lang="ts">
import { useDrawer } from '@iswangh/element-plus-kit'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { h, ref } from 'vue'

const drawer = useDrawer()

const userData = ref<{ username: string, email: string } | null>(null)

const { modelValue, loading } = drawer.use({
  title: '异步钩子',
  size: '500px',
  content: () => h('div', [
    userData.value
      ? h('div', [
          h('p', `用户名: ${userData.value.username}`),
          h('p', `邮箱: ${userData.value.email}`),
        ])
      : null,
  ]),
  // 使用 ElDrawer 的原生事件 @opened
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
  // 使用 ElDrawer 的原生属性 beforeClose
  // 注意：beforeClose 接收 done 回调函数，不接收 instance 参数
  // 如果需要访问 instance，通过闭包访问（从 drawer.use() 解构的变量）
  beforeClose: async (done) => {
    try {
      await ElMessageBox.confirm('确定要关闭抽屉吗？', '提示', {
        type: 'warning',
        zIndex: 3000,
      } as Parameters<typeof ElMessageBox.confirm>[2] & { zIndex?: number })
      done()
    }
    catch {
      // 用户取消，不关闭抽屉
    }
  },
  // 使用 ElDrawer 的原生事件 @closed
  onClosed: async () => {
    ElMessage.success('抽屉已关闭')
    userData.value = null
  },
})
</script>

<template>
  <el-button type="primary" @click="modelValue = true">
    打开抽屉（异步钩子）
  </el-button>
</template>
```

:::

## 数据共享

在 `onOpened` 中获取的数据可以通过响应式变量在 `default`、`header`、`footer` 等插槽中共享使用。所有插槽的渲染函数都通过闭包访问响应式状态。

:::demo

```vue
<script setup lang="ts">
import { useDrawer } from '@iswangh/element-plus-kit'
import { ElButton, ElMessage } from 'element-plus'
import { h, ref } from 'vue'

const drawer = useDrawer()

// 示例1：onOpened 中获取数据，在 default 插槽中使用
const userData = ref<{ username: string, email: string } | null>(null)

const { modelValue: dataSharingVisible, loading } = drawer.use({
  title: '数据共享示例',
  size: '600px',
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

通过 `useDrawer(globalConfig)` 传入全局配置，所有 `drawer.use()` 创建的实例都会继承全局配置，实例配置会覆盖全局配置。

:::demo

```vue
<script setup lang="ts">
import { useDrawer } from '@iswangh/element-plus-kit'
import { ElButton } from 'element-plus'
import { h } from 'vue'

// 创建带全局配置的 drawer 实例
const drawer = useDrawer({
  size: '600px',
  closeOnClickModal: false,
  destroyOnClose: true,
  loadingProps: {
    text: '加载中...',
  },
})

// 实例1：继承全局配置
const { modelValue: globalConfigVisible1 } = drawer.use({
  title: '继承全局配置',
  content: '这个抽屉继承了全局配置：size="600px"、closeOnClickModal=false、destroyOnClose=true。',
})

// 实例2：覆盖全局配置
const { modelValue: globalConfigVisible2 } = drawer.use({
  title: '覆盖全局配置',
  size: '500px', // 覆盖全局配置的 size
  closeOnClickModal: true, // 覆盖全局配置的 closeOnClickModal
  content: '这个抽屉覆盖了全局配置：size="500px"、closeOnClickModal=true。',
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

## 多个抽屉实例

支持创建多个抽屉实例，自动管理 z-index（通过 DrawerStack 自动分配和更新）。

:::demo

```vue
<script setup lang="ts">
import { useDrawer } from '@iswangh/element-plus-kit'
import { ElButton } from 'element-plus'

const drawer = useDrawer()

// 创建多个抽屉实例
const { modelValue: drawer1Visible } = drawer.use({
  title: '抽屉 1',
  size: '400px',
  content: '这是第一个抽屉。',
})

const { modelValue: drawer2Visible } = drawer.use({
  title: '抽屉 2',
  size: '400px',
  content: '这是第二个抽屉。',
})

const { modelValue: drawer3Visible } = drawer.use({
  title: '抽屉 3',
  size: '400px',
  content: '这是第三个抽屉。',
})

function openAll() {
  drawer1Visible.value = true
  setTimeout(() => {
    drawer2Visible.value = true
  }, 300)
  setTimeout(() => {
    drawer3Visible.value = true
  }, 600)
}
</script>

<template>
  <el-space>
    <el-button type="primary" @click="drawer1Visible = true">
      打开抽屉 1
    </el-button>
    <el-button type="primary" @click="drawer2Visible = true">
      打开抽屉 2
    </el-button>
    <el-button type="primary" @click="drawer3Visible = true">
      打开抽屉 3
    </el-button>
    <el-button type="success" @click="openAll">
      依次打开所有抽屉
    </el-button>
  </el-space>
</template>
```

:::

## API

### 组合式函数

#### useDrawer

##### useDrawer(globalConfig?)

创建抽屉实例管理器，支持全局配置。

**参数：**

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| globalConfig | 页面级别的全局配置，会被所有 `drawer.use()` 创建的实例继承 | `DrawerGlobalConfig` | - |

**返回值：**

- `UseDrawerReturn`：包含 `use` 方法的对象

##### drawer.use(options)

创建抽屉实例。

**参数：**

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 抽屉选项，会继承 `useDrawer()` 传入的全局配置 | `DrawerOptions` | - |

**返回值：**

- `DrawerInstance`：抽屉实例，包含 `modelValue`、`loading`、`buttonLoadings` 等响应式状态

#### DrawerOptions

支持 [`ElDrawer`](https://element-plus.org/zh-CN/component/drawer.html) 的所有属性（包括 `beforeClose`、`@opened`、`@closed` 等生命周期钩子）。

**拓展属性**：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 内容（支持字符串、VNode、组件、渲染函数） | `string \| VNode \| Component \| (() => string \| Component \| VNode)` | - |
| loadingProps | el-loading 的属性配置 | `Partial<ElLoadingOptions>` | - |
| slots | 插槽（header、footer、title、default） | `{ default?: () => VNode, header?: () => VNode, footer?: () => VNode, title?: () => VNode }` | - |
| onConfirm | 确认按钮钩子（可选） | `() => void \| Promise<void>` | - |
| onCancel | 取消按钮钩子（可选） | `() => void` | - |
| loading | 抽屉 loading 状态（可选，如果传入则使用用户的，否则使用内部的） | `Ref<boolean>` | - |
| buttonLoadings | 按钮 loading 状态（可选，如果传入则使用用户的，否则使用内部的） | `Ref<Record<string, boolean>>` | - |

**注意**：
- 生命周期钩子（`beforeClose`、`@opened`、`@closed`）直接使用 `ElDrawer` 的原生支持，无需额外定义
- `@opened` 和 `@closed` 事件不接收 `instance` 参数，通过闭包访问响应式状态
- `content` 和 `slots` 的渲染函数通过闭包访问（从 `drawer.use()` 解构的变量），不接收 `instance` 参数
- `slots.default` 优先级高于 `content` 属性
- 抽屉的大小通过 `size` 属性控制，内容区域使用原生滚动，当内容超出时自动显示滚动条

#### DrawerInstance

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| id | 唯一标识符 | `string` |
| modelValue | v-model 绑定的响应式值（唯一控制方式） | `Ref<boolean>` |
| loading | 抽屉加载状态（自动显示遮罩层） | `Ref<boolean>` |
| buttonLoadings | 统一的按钮 loading 管理（响应式） | `Ref<Record<string, boolean>>` |
| confirmLoading | 确认按钮 loading（快捷方式，计算属性） | `WritableComputedRef<boolean>` |
| cancelLoading | 取消按钮 loading（快捷方式，计算属性） | `WritableComputedRef<boolean>` |

#### DrawerGlobalConfig

支持 [`ElDrawer`](https://element-plus.org/zh-CN/component/drawer.html) 所有的属性。

**拓展属性**：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| loadingProps | el-loading 的属性配置（全局配置） | `Partial<ElLoadingOptions>` | - |
