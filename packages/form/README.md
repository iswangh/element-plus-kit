# @iswangh/element-plus-kit-form

Element Plus Kit Form 组件，基于 Element Plus 的动态表单组件，支持通过配置快速生成表单。

## 📦 安装

```bash
npm install @iswangh/element-plus-kit-form
```

**注意**：此包依赖 `@iswangh/element-plus-kit-core`，安装时会自动安装。

## 🚀 快速开始

### 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WForm } from '@iswangh/element-plus-kit-form'
import type { FormItems } from '@iswangh/element-plus-kit-form'

const formItems: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    compType: 'input',
  },
  {
    prop: 'email',
    label: '邮箱',
    compType: 'input',
    compProps: {
      type: 'email',
    },
  },
]

const form = ref({
  username: '',
  email: '',
})
</script>

<template>
  <WForm :model="form" :form-items="formItems" />
</template>
```

### 引入样式

**重要说明**：WForm 组件已按需导入了所有内部使用的 Element Plus 组件样式，用户导入组件时样式会自动导入，**无需额外配置**。

#### 自动导入（默认，推荐）

直接导入组件即可，样式会自动导入：

```typescript
import { WForm } from '@iswangh/element-plus-kit-form'
```

#### 单独导入样式（可选）

如果需要在 CSS 文件中单独导入样式，可以使用：

```typescript
import '@iswangh/element-plus-kit-form/style.css'
```

**注意**：此样式文件已包含 WForm 内部使用的所有 Element Plus 组件样式（按需导入，约 185KB，gzip 约 24KB），无需再导入 Element Plus 的全局样式。

## 📖 API 文档

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model | 表单数据对象 | `Record<string, any>` | `{}` |
| formItems | 表单项配置数组 | `FormItems` | `[]` |
| rowProps | 行布局属性（ElRow 属性） | `RowProps` | `{}` |
| actionConfig | 操作按钮配置 | `ActionConfig` | `{}` |

**继承 Element Plus Form 属性**：组件继承所有 `ElForm` 的属性，如 `rules`、`labelPosition`、`size` 等。

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| validate | 表单项验证事件 | `(prop: FormItemProp, isValid: boolean, message: string)` |
| change | 表单项值变化事件 | `(extendedParams: FormItemEventExtendedParams, value: any)` |
| action | 操作按钮点击事件 | `(eventName: string)` |
| search | 搜索按钮点击事件 | - |
| reset | 重置按钮点击事件 | - |
| submit | 提交按钮点击事件 | - |
| cancel | 取消按钮点击事件 | - |
| expand | 展开状态变化事件 | `(value: boolean)` |

### Slots

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| `{prop}` | 自定义组件插槽，当 `compType` 为 `custom` 时使用 | `FormItemSlotScope` |
| `form-item-{prop}` | 表单项插槽，用于自定义表单项内容 | `FormItemSlotScope` |
| `{prop}-{slotName}` | 动态组件插槽，如 `username-prefix`、`email-suffix` | `FormItemSlotScope` |
| `expand-toggle` | 展开/折叠按钮插槽，用于自定义按钮 | `{ expanded: boolean, toggle: (value?: boolean) => void }` |

### FormItem 配置

#### 基础配置

```typescript
interface FormItem<C extends FormItemComp = FormItemComp> {
  prop: string                    // 表单字段名（必填）
  label: string                   // 标签文本
  compType: FormItemComp              // 组件类型（必填）
  compProps?: FormItemCompProps<C> // 组件属性配置
  // 对于支持 options 的组件（如 select、cascader、radio、checkbox 等），compProps.options 支持三种模式：
  // 1. 静态数组：options: [{ label: '选项1', value: '1' }]
  // 2. 函数模式：options: (formData) => [{ label: '选项1', value: '1' }]
  // 3. 对象模式：options: { loader: (formData) => [...], deps: ['field1'], immediate: true }
  vIf?: boolean | ((data?: any) => boolean)  // 条件渲染（v-if）
  vShow?: boolean | ((data?: any) => boolean) // 显示/隐藏（v-show）
  colProps?: ColProps             // 列布局属性（ElCol 属性）
  // ... 其他 ElFormItem 属性
}
```

#### 支持的组件类型

组件支持以下 Element Plus 表单组件：

- `autocomplete` - 自动完成输入框
- `cascader` - 级联选择器
- `checkbox` - 复选框组
- `color-picker` - 颜色选择器
- `color-picker-panel` - 颜色选择器面板
- `date-picker` - 日期选择器
- `date-picker-panel` - 日期选择器面板
- `input` - 输入框
- `input-number` - 数字输入框
- `input-tag` - 标签输入框
- `mention` - 提及输入框
- `radio` - 单选框组
- `rate` - 评分
- `select` - 选择器
- `select-v2` - 虚拟列表选择器
- `slider` - 滑块
- `switch` - 开关
- `time-picker` - 时间选择器
- `time-select` - 时间选择
- `transfer` - 穿梭框
- `tree-select` - 树形选择器
- `custom` - 自定义组件（使用插槽）

#### 使用示例

```typescript
const formItems: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    compType: 'input',
    compProps: {
      placeholder: '请输入用户名',
      clearable: true,
    },
    rules: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
  },
  {
    prop: 'age',
    label: '年龄',
    compType: 'input-number',
    compProps: {
      min: 0,
      max: 120,
      step: 1,
    },
    // 条件渲染：只有当 username 存在时才显示
    vIf: (data) => !!data?.username,
  },
  {
    prop: 'gender',
    label: '性别',
    compType: 'select',
    compProps: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
    },
  },
]
```

### ActionConfig 配置

操作按钮配置用于自定义表单底部的操作按钮。

```typescript
interface ActionConfig {
  vIf?: boolean | ((data?: any) => boolean)  // 是否显示操作区域
  vShow?: boolean | ((data?: any) => boolean) // 显示/隐藏操作区域
  buttons?: ActionConfigButtons[]            // 按钮列表
  expand?: ExpandRule                        // 默认展开规则（仅在 buttons 包含 'expand' 时生效）
}
```

#### 预设按钮

支持以下预设按钮：

- `'submit'` - 提交按钮
- `'reset'` - 重置按钮
- `'search'` - 搜索按钮
- `'cancel'` - 取消按钮
- `'expand'` - 展开/折叠按钮（仅在 `inline` 模式下可用）

#### 自定义按钮

```typescript
interface ActionConfigButtonItem extends Partial<ButtonProps> {
  label?: string      // 按钮文字
  eventName: string   // 事件名称（必填）
}
```

#### 使用示例

```typescript
const actionConfig: ActionConfig = {
  buttons: [
    'submit',
    'reset',
    {
      label: '自定义按钮',
      eventName: 'custom',
      type: 'primary',
    },
  ],
}
```

## 💡 高级用法

### 条件渲染

使用 `vIf` 或 `vShow` 实现表单项的条件显示：

```typescript
const formItems: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    compType: 'input',
  },
  {
    prop: 'email',
    label: '邮箱',
    compType: 'input',
    // 只有当用户名存在时才显示邮箱字段
    vIf: (data) => !!data?.username,
  },
]
```

### 自定义插槽

使用插槽自定义表单项内容：

```vue
<template>
  <WForm :model="form" :form-items="formItems">
    <template #username-prefix="{ formItem }">
      <el-icon><User /></el-icon>
    </template>
  </WForm>
</template>
```

### 表单验证

```typescript
const formItems: FormItems = [
  {
    prop: 'email',
    label: '邮箱',
    compType: 'input',
    rules: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
  },
]
```

### 监听事件

```vue
<template>
  <WForm
    :model="form"
    :form-items="formItems"
    @change="onChange"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
const onChange = (extendedParams: FormItemEventExtendedParams, value: any) => {
  console.log('字段变化:', extendedParams.prop, value)
}

const onSubmit = () => {
  console.log('提交表单:', form.value)
}
</script>
```

### 展开/折叠功能

表单支持展开/折叠功能，可以控制表单项的显示和隐藏，适用于字段较多的表单场景。

**重要说明**：
- 展开/折叠功能仅在 `inline` 模式下可用（`inline: true`）
- 通过 `actionConfig.buttons` 包含 `'expand'` 来启用展开/折叠功能
- 通过 `actionConfig.expand` 配置展开规则

#### 基础用法

```vue
<template>
  <WForm
    :model="form"
    :form-items="formItems"
    inline
    :action-config="{
      buttons: ['expand', 'search', 'reset'],
      expand: {
        count: 3, // 默认展开前 3 个字段
      },
    }"
  />
</template>
```

#### 配置说明

展开规则通过 `actionConfig.expand` 配置，支持三种配置方式：

| 配置方式 | 说明 | 类型 | 示例 |
| --- | --- | --- | --- |
| `count` | 按字段数量展开（从第一个开始） | `{ count: number }` | `{ count: 3 }` |
| `include` | 指定展示的字段（白名单，字段 prop 数组） | `{ include: string[] }` | `{ include: ['field1', 'field2'] }` |
| `exclude` | 指定折叠的字段（黑名单，字段 prop 数组） | `{ exclude: string[] }` | `{ exclude: ['field3', 'field4'] }` |

**配置优先级**：`exclude` > `include` > `count`

#### 展开规则高级配置

展开规则还支持以下高级配置：

| 配置项 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `autoExpandOnHover` | 是否启用鼠标悬停自动展开功能 | `boolean` | `false` |
| `scrollOnToggle` | 是否在展开/收起后自动滚动到表单中心 | `boolean` | `false` |
| `scrollIntoViewOptions` | 自定义滚动选项（仅在 `scrollOnToggle` 为 true 时生效） | `ScrollIntoViewOptions` | `{ behavior: 'smooth', block: 'center', inline: 'nearest' }` |

**使用示例**：

```typescript
const actionConfig: ActionConfig = {
  buttons: ['expand', 'search', 'reset'],
  expand: {
    count: 3, // 默认展开前 3 个字段
    autoExpandOnHover: true, // 鼠标悬停时自动展开
    scrollOnToggle: true, // 展开/收起后自动滚动
  },
}
```

#### 受控模式

使用 `v-model:expanded` 实现受控模式：

```vue
<template>
  <WForm
    v-model:expanded="isExpanded"
    :model="form"
    :form-items="formItems"
    inline
    :action-config="{
      buttons: ['expand', 'search', 'reset'],
      expand: { count: 3 },
    }"
  />
  <el-button @click="formRef?.toggleExpand(true)">展开</el-button>
  <el-button @click="formRef?.toggleExpand(false)">折叠</el-button>
</template>

<script setup lang="ts">
const isExpanded = ref(false)
const formRef = ref<InstanceType<typeof WForm>>()

// 或者使用组件暴露的方法
function toggle() {
  formRef.value?.toggleExpand() // 切换
  formRef.value?.toggleExpand(true) // 展开
  formRef.value?.toggleExpand(false) // 折叠
}

// 或者直接使用 v-model:expanded
function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}
</script>
```

#### 自定义按钮

使用 `expand-toggle` 插槽自定义展开/折叠按钮：

```vue
<template>
  <WForm
    :model="form"
    :form-items="formItems"
    inline
    :action-config="{
      buttons: ['expand', 'search', 'reset'],
      expand: { count: 3 },
    }"
  >
    <template #expand-toggle="{ expanded, toggle }">
      <el-button type="success" :icon="expanded ? ArrowUp : ArrowDown" @click="toggle()">
        {{ expanded ? '收起高级搜索' : '展开高级搜索' }}
      </el-button>
    </template>
  </WForm>
</template>
```

## 🔗 相关链接

- [主包文档](../kit/README.md)
- [核心工具包文档](../core/README.md)
- [Element Plus 文档](https://element-plus.org/zh-CN/)
