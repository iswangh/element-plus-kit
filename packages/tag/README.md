# @iswangh/element-plus-kit-tag

Element Plus Kit Tag 组件，基于 Element Plus Tag 的封装组件。

## 📦 安装

```bash
npm install @iswangh/element-plus-kit-tag
```

## 🚀 快速开始

### 基础用法

```vue
<script setup lang="ts">
import { WTag } from '@iswangh/element-plus-kit-tag'
</script>

<template>
  <WTag>标签</WTag>
</template>
```

### 引入样式

**重要说明**：WTag 组件已按需导入了 Element Plus Tag 组件样式，用户导入组件时样式会自动导入，**无需额外配置**。

#### 自动导入（默认，推荐）

直接导入组件即可，样式会自动导入：

```typescript
import { WTag } from '@iswangh/element-plus-kit-tag'
```

#### 单独导入样式（可选）

如果需要在 CSS 文件中单独导入样式，可以使用：

```typescript
import '@iswangh/element-plus-kit-tag/style.css'
```

## 📖 API 文档

### Props

WTag 组件继承所有 Element Plus Tag 的属性，详情请参考 [Element Plus Tag 文档](https://element-plus.org/zh-CN/component/tag.html)。

**拓展属性**：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签文本（优先级高于 options + value 匹配） | `string` | - |
| options | 选项列表（用于根据 value 匹配标签文本） | `TagOption[]` | - |
| value | 当前值（用于从 options 中匹配对应的选项，支持单个值或数组） | `TagValue \| TagValue[]` | - |
| props | 字段映射配置（用于自定义 options 中的字段名） | `TagFieldProps` | `{ label: 'label', value: 'value' }` |
| looseMatch | 是否宽松匹配（默认 true，会将布尔值和字符串 'true'/'false' 互相匹配） | `boolean` | `true` |
| separator | 数组值渲染时的分隔符 | `string` | `', '` |

**Element Plus Tag 属性**：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 类型 | `'success' \| 'info' \| 'warning' \| 'danger'` | `''` |
| closable | 是否可关闭 | `boolean` | `false` |
| disable-transitions | 是否禁用渐变动画 | `boolean` | `false` |
| hit | 是否有边框描边 | `boolean` | `false` |
| color | 背景色 | `string` | `''` |
| size | 尺寸 | `'large' \| 'default' \| 'small'` | `'default'` |
| effect | 主题 | `'dark' \| 'light' \| 'plain'` | `'light'` |
| round | 是否圆形 | `boolean` | `false` |

#### TagOption 配置

`options` 数组中每一项的配置类型。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签文本（如果使用默认字段映射） | `string` | - |
| value | 标签值（如果使用默认字段映射） | `unknown` | - |
| tagProps | 标签属性（传递给 ElTag 的属性） | `Partial<ElTagProps>` | - |
| [key: string] | 允许其他自定义字段 | `any` | - |

#### TagFieldProps 配置

`props` 字段映射配置。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签文本字段名 | `string` | `'label'` |
| value | 标签值字段名 | `string` | `'value'` |

### Events

WTag 组件继承所有 Element Plus Tag 的事件，详情请参考 [Element Plus Tag 文档](https://element-plus.org/zh-CN/component/tag.html)。

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| close | 关闭 Tag 时触发的事件 | `(event: MouseEvent) => void` |
| click | 点击 Tag 时触发的事件 | `(event: MouseEvent) => void` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 标签内容（优先级最高，会覆盖 label 和 options + value 匹配的结果） |

### 显示优先级

标签文本的显示优先级（从高到低）：

1. **插槽内容**：如果提供了 `default` 插槽，优先显示插槽内容
2. **label 属性**：如果提供了 `label` 属性，显示 `label` 的值
3. **options + value 匹配**：如果提供了 `options` 和 `value`，从 `options` 中匹配对应的标签文本
4. **value 本身**：如果匹配失败，显示 `value` 本身（转换为字符串）
5. **空**：如果 `value` 为 `null` 或 `undefined`，不显示内容

### 匹配规则

#### 宽松匹配（looseMatch: true，默认）

- 数字和字符串可以互相匹配（如 `1` 和 `'1'`）
- 布尔值和字符串可以互相匹配（如 `true` 和 `'true'`，`false` 和 `'false'`）
- 类型相同时使用严格相等比较（`===`）

#### 严格匹配（looseMatch: false）

- 类型必须完全匹配，否则无法匹配
- 匹配失败时，显示传入的 `value` 本身（转换为字符串）

### 数组值处理

当 `value` 为数组时：

- 组件内部会将数组值统一处理
- 在单个标签内使用 `separator`（默认 `', '`）连接显示所有匹配的标签文本
- 如果某个值匹配失败，显示该值本身（转换为字符串）
- 如果所有值都匹配失败，显示所有值用分隔符连接

## 💡 使用示例

### 基础用法

```vue
<template>
  <WTag>标签</WTag>
  <WTag type="success">成功</WTag>
  <WTag type="info">信息</WTag>
  <WTag type="warning">警告</WTag>
  <WTag type="danger">危险</WTag>
</template>
```

### Options + Value 用法

通过 `options` 和 `value` 属性，可以从选项列表中自动匹配对应的标签文本。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WTag } from '@iswangh/element-plus-kit-tag'
import type { TagOption } from '@iswangh/element-plus-kit-tag'

const options: TagOption[] = [
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
  { label: '选项3', value: 3 },
]

const value = ref(1)
</script>

<template>
  <WTag :options="options" :value="value" />
</template>
```

### 数组值匹配

当 `value` 为数组时，会在单个标签内使用分隔符连接显示所有匹配的标签文本。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WTag } from '@iswangh/element-plus-kit-tag'
import type { TagOption } from '@iswangh/element-plus-kit-tag'

const options: TagOption[] = [
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
  { label: '选项3', value: 3 },
]

const values = ref([1, 2])
</script>

<template>
  <!-- 数组值在单个标签内显示 -->
  <WTag :options="options" :value="values" />
  
  <!-- 或用户遍历渲染多个标签 -->
  <WTag
    v-for="val in values"
    :key="val"
    :options="options"
    :value="val"
  />
</template>
```

### 字段映射

通过 `props` 属性可以自定义 `options` 中的字段名。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WTag } from '@iswangh/element-plus-kit-tag'
import type { TagOption } from '@iswangh/element-plus-kit-tag'

const options: TagOption[] = [
  { name: '苹果', id: 'apple' },
  { name: '香蕉', id: 'banana' },
  { name: '橙子', id: 'orange' },
]

const value = ref('apple')
</script>

<template>
  <WTag
    :options="options"
    :value="value"
    :props="{ label: 'name', value: 'id' }"
  />
</template>
```

### 宽松匹配

通过 `looseMatch` 属性可以控制匹配模式。默认值为 `true`，支持宽松匹配。

```vue
<script setup lang="ts">
import { WTag } from '@iswangh/element-plus-kit-tag'
import type { TagOption } from '@iswangh/element-plus-kit-tag'

const options: TagOption[] = [
  { label: '数字1', value: 1 },
  { label: '字符串1', value: '1' },
]
</script>

<template>
  <!-- 宽松匹配：数字 1 可以匹配字符串 '1' -->
  <WTag :options="options" :value="1" />
  
  <!-- 严格匹配：数字 1 无法匹配字符串 '1'，显示传入的值 -->
  <WTag :options="options" :value="1" :loose-match="false" />
</template>
```

### 自定义分隔符

通过 `separator` 属性可以自定义数组值渲染时的分隔符。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WTag } from '@iswangh/element-plus-kit-tag'
import type { TagOption } from '@iswangh/element-plus-kit-tag'

const options: TagOption[] = [
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
  { label: '选项3', value: 3 },
]

const values = ref([1, 2, 3])
</script>

<template>
  <!-- 默认分隔符（', '） -->
  <WTag :options="options" :value="values" />
  
  <!-- 自定义分隔符 -->
  <WTag :options="options" :value="values" separator=" | " />
</template>
```

### 插槽使用

当使用插槽时，插槽内容优先级最高。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WTag } from '@iswangh/element-plus-kit-tag'
import type { TagOption } from '@iswangh/element-plus-kit-tag'

const options: TagOption[] = [
  { label: '成功', value: 'success' },
]

const value = ref('success')
</script>

<template>
  <!-- 插槽内容优先显示 -->
  <WTag :options="options" :value="value">
    自定义插槽内容
  </WTag>
</template>
```

### 选项属性

在 `options` 中可以通过 `tagProps` 属性为每个选项配置标签属性。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WTag } from '@iswangh/element-plus-kit-tag'
import type { TagOption } from '@iswangh/element-plus-kit-tag'

const options: TagOption[] = [
  { label: '成功', value: 'success', tagProps: { type: 'success' as const } },
  { label: '警告', value: 'warning', tagProps: { type: 'warning' as const } },
  { label: '危险', value: 'danger', tagProps: { type: 'danger' as const } },
]

const value = ref('success')
</script>

<template>
  <WTag :options="options" :value="value" />
</template>
```

## 🔗 相关链接

- [主包文档](../kit/README.md)
- [Element Plus 文档](https://element-plus.org/zh-CN/)
