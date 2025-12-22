# Tag 标签组件

标签组件，基于 Element Plus Tag 的封装组件，支持通过选项列表自动匹配标签文本。

## 基础用法

WTag 组件继承所有 Element Plus Tag 的属性，可以直接使用。

:::demo

```vue
<script setup lang="ts">
import { WTag } from '@iswangh/element-plus-kit'
</script>

<template>
  <el-space wrap>
    <WTag>标签</WTag>
    <WTag type="success">成功</WTag>
    <WTag type="info">信息</WTag>
    <WTag type="warning">警告</WTag>
    <WTag type="danger">危险</WTag>
  </el-space>
</template>
```

:::

### 可关闭标签

:::demo

```vue
<script setup lang="ts">
import { WTag } from '@iswangh/element-plus-kit'
</script>

<template>
  <el-space wrap>
    <WTag closable>可关闭</WTag>
    <WTag type="success" closable>成功</WTag>
    <WTag type="info" closable>信息</WTag>
    <WTag type="warning" closable>警告</WTag>
    <WTag type="danger" closable>危险</WTag>
  </el-space>
</template>
```

:::

### 不同尺寸

:::demo

```vue
<script setup lang="ts">
import { WTag } from '@iswangh/element-plus-kit'
</script>

<template>
  <el-space wrap>
    <WTag size="large">大标签</WTag>
    <WTag size="default">默认标签</WTag>
    <WTag size="small">小标签</WTag>
  </el-space>
</template>
```

:::

### 不同主题

:::demo

```vue
<script setup lang="ts">
import { WTag } from '@iswangh/element-plus-kit'
</script>

<template>
  <el-space wrap>
    <WTag effect="dark">深色</WTag>
    <WTag effect="light">浅色</WTag>
    <WTag effect="plain">朴素</WTag>
  </el-space>
</template>
```

:::

## Options + Value 用法

通过 `options` 和 `value` 属性，可以从选项列表中自动匹配对应的标签文本。

### 单个值匹配

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WTag } from '@iswangh/element-plus-kit'
import type { TagOption } from '@iswangh/element-plus-kit-tag'

const options: TagOption[] = [
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
  { label: '选项3', value: 3 },
]

const value = ref(1)
</script>

<template>
  <el-space wrap>
    <WTag :options="options" :value="value" />
    <WTag :options="options" :value="2" />
    <WTag :options="options" :value="3" />
  </el-space>
</template>
```

:::

### 数组值匹配

当 `value` 为数组时，会在单个标签内使用分隔符（默认 `', '`）连接显示所有匹配的标签文本。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WTag } from '@iswangh/element-plus-kit'
import type { TagOption } from '@iswangh/element-plus-kit-tag'

const options: TagOption[] = [
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
  { label: '选项3', value: 3 },
]

const values = ref([1, 2])
</script>

<template>
  <el-space wrap>
    <WTag :options="options" :value="values" />
    <WTag
      v-for="val in [2, 3]"
      :key="val"
      :options="options"
      :value="val"
    />
  </el-space>
</template>
```

:::

### 自定义分隔符

通过 `separator` 属性可以自定义数组值渲染时的分隔符。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WTag } from '@iswangh/element-plus-kit'
import type { TagOption } from '@iswangh/element-plus-kit-tag'

const options: TagOption[] = [
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
  { label: '选项3', value: 3 },
]

const values = ref([1, 2, 3])
</script>

<template>
  <el-space wrap>
    <WTag :options="options" :value="values" />
    <WTag :options="options" :value="values" separator=" | " />
    <WTag :options="options" :value="values" separator=" · " />
  </el-space>
</template>
```

:::

## 插槽使用

当使用插槽时，插槽内容优先级最高，会覆盖 `label` 和 `options + value` 匹配的结果。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WTag } from '@iswangh/element-plus-kit'
import type { TagOption } from '@iswangh/element-plus-kit-tag'

const options: TagOption[] = [
  { label: '成功', value: 'success', tagProps: { type: 'success' as const } },
  { label: '警告', value: 'warning', tagProps: { type: 'warning' as const } },
  { label: '危险', value: 'danger', tagProps: { type: 'danger' as const } },
]

const value = ref('success')
</script>

<template>
  <el-space wrap>
    <WTag :options="options" :value="value">
      自定义插槽内容
    </WTag>
    <WTag :options="options" value="warning">
      另一个自定义内容
    </WTag>
    <WTag :options="options" value="success" />
    <WTag :options="options" value="warning" />
    <WTag :options="options" value="danger" />
  </el-space>
</template>
```

:::

## Label 属性

通过 `label` 属性可以直接指定标签文本，优先级高于 `options + value` 匹配。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WTag } from '@iswangh/element-plus-kit'
import type { TagOption } from '@iswangh/element-plus-kit-tag'

const options: TagOption[] = [
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
]

const value = ref(1)
</script>

<template>
  <el-space wrap>
    <WTag :options="options" :value="value" label="自定义标签文本" />
    <WTag :options="options" :value="value" />
  </el-space>
</template>
```

:::

## 字段映射

通过 `props` 属性可以自定义 `options` 中的字段名，与 Element Plus 保持一致。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WTag } from '@iswangh/element-plus-kit'
import type { TagOption } from '@iswangh/element-plus-kit-tag'

const options: TagOption[] = [
  { name: '苹果', id: 'apple' },
  { name: '香蕉', id: 'banana' },
  { name: '橙子', id: 'orange' },
]

const value = ref('apple')
const values = ref(['apple', 'banana'])
</script>

<template>
  <el-space wrap>
    <WTag :options="options" :value="value" :props="{ label: 'name', value: 'id' }" />
    <WTag :options="options" value="banana" :props="{ label: 'name', value: 'id' }" />
    <WTag :options="options" value="orange" :props="{ label: 'name', value: 'id' }" />
    <WTag
      v-for="val in values"
      :key="val"
      :options="options"
      :value="val"
      :props="{ label: 'name', value: 'id' }"
    />
  </el-space>
</template>
```

:::

## 宽松匹配

通过 `looseMatch` 属性可以控制匹配模式。默认值为 `true`，支持宽松匹配（数字和字符串可以互相匹配，布尔值和字符串 'true'/'false' 可以互相匹配）。

:::demo

```vue
<script setup lang="ts">
import { WTag } from '@iswangh/element-plus-kit'
import type { TagOption } from '@iswangh/element-plus-kit-tag'

// 场景 1: 数字 1 匹配字符串 '1'
const options3Scene1: TagOption[] = [
  { label: '字符串1', value: '1' },
]

// 场景 2: 字符串 '1' 匹配数字 1
const options3Scene2: TagOption[] = [
  { label: '数字1', value: 1 },
]

// 场景 3: 布尔值 true 匹配字符串 'true'
const options3Scene3: TagOption[] = [
  { label: '字符串true', value: 'true' },
]

// 场景 4: 字符串 'true' 匹配布尔值 true
const options3Scene4: TagOption[] = [
  { label: '布尔true', value: true },
]
</script>

<template>
  <el-space direction="vertical" :size="16" class="w-full" fill>
    <!-- 场景 1: 数字 1 匹配字符串 '1' -->
    <div class="border border-gray-200 rounded p-4 w-full">
      <div class="text-sm font-medium text-gray-700 mb-3">
        场景 1：值 = <code class="px-1 py-0.5 bg-gray-100 rounded">数字 1</code>，选项值 = <code class="px-1 py-0.5 bg-gray-100 rounded">字符串 '1'</code>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="bg-green-50 border border-green-200 rounded p-3">
            <div class="text-xs text-green-700 font-medium mb-2">
              ✅ 宽松匹配（looseMatch: true）
            </div>
            <div class="text-sm text-gray-600 mb-2">
              可以匹配，显示标签：
            </div>
            <WTag :options="options3Scene1" :value="1" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="bg-red-50 border border-red-200 rounded p-3">
            <div class="text-xs text-red-700 font-medium mb-2">
              ❌ 严格匹配（looseMatch: false）
            </div>
            <div class="text-sm text-gray-600 mb-2">
              无法匹配，回显值：
            </div>
            <WTag :options="options3Scene1" :value="1" :loose-match="false" />
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 场景 2: 字符串 '1' 匹配数字 1 -->
    <div class="border border-gray-200 rounded p-4 w-full">
      <div class="text-sm font-medium text-gray-700 mb-3">
        场景 2：值 = <code class="px-1 py-0.5 bg-gray-100 rounded">字符串 '1'</code>，选项值 = <code class="px-1 py-0.5 bg-gray-100 rounded">数字 1</code>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="bg-green-50 border border-green-200 rounded p-3">
            <div class="text-xs text-green-700 font-medium mb-2">
              ✅ 宽松匹配（looseMatch: true）
            </div>
            <div class="text-sm text-gray-600 mb-2">
              可以匹配，显示标签：
            </div>
            <WTag :options="options3Scene2" value="1" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="bg-red-50 border border-red-200 rounded p-3">
            <div class="text-xs text-red-700 font-medium mb-2">
              ❌ 严格匹配（looseMatch: false）
            </div>
            <div class="text-sm text-gray-600 mb-2">
              无法匹配，回显值：
            </div>
            <WTag :options="options3Scene2" value="1" :loose-match="false" />
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 场景 3: 布尔值 true 匹配字符串 'true' -->
    <div class="border border-gray-200 rounded p-4 w-full">
      <div class="text-sm font-medium text-gray-700 mb-3">
        场景 3：值 = <code class="px-1 py-0.5 bg-gray-100 rounded">布尔值 true</code>，选项值 = <code class="px-1 py-0.5 bg-gray-100 rounded">字符串 'true'</code>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="bg-green-50 border border-green-200 rounded p-3">
            <div class="text-xs text-green-700 font-medium mb-2">
              ✅ 宽松匹配（looseMatch: true）
            </div>
            <div class="text-sm text-gray-600 mb-2">
              可以匹配，显示标签：
            </div>
            <WTag :options="options3Scene3" :value="true" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="bg-red-50 border border-red-200 rounded p-3">
            <div class="text-xs text-red-700 font-medium mb-2">
              ❌ 严格匹配（looseMatch: false）
            </div>
            <div class="text-sm text-gray-600 mb-2">
              无法匹配，回显值：
            </div>
            <WTag :options="options3Scene3" :value="true" :loose-match="false" />
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 场景 4: 字符串 'true' 匹配布尔值 true -->
    <div class="border border-gray-200 rounded p-4 w-full">
      <div class="text-sm font-medium text-gray-700 mb-3">
        场景 4：值 = <code class="px-1 py-0.5 bg-gray-100 rounded">字符串 'true'</code>，选项值 = <code class="px-1 py-0.5 bg-gray-100 rounded">布尔值 true</code>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="bg-green-50 border border-green-200 rounded p-3">
            <div class="text-xs text-green-700 font-medium mb-2">
              ✅ 宽松匹配（looseMatch: true）
            </div>
            <div class="text-sm text-gray-600 mb-2">
              可以匹配，显示标签：
            </div>
            <WTag :options="options3Scene4" value="true" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="bg-red-50 border border-red-200 rounded p-3">
            <div class="text-xs text-red-700 font-medium mb-2">
              ❌ 严格匹配（looseMatch: false）
            </div>
            <div class="text-sm text-gray-600 mb-2">
              无法匹配，回显值：
            </div>
            <WTag :options="options3Scene4" value="true" :loose-match="false" />
          </div>
        </el-col>
      </el-row>
    </div>
  </el-space>
</template>
```

:::

## 选项属性

在 `options` 中可以通过 `tagProps` 属性为每个选项配置标签属性（如 `type`、`effect` 等）。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WTag } from '@iswangh/element-plus-kit'
import type { TagOption } from '@iswangh/element-plus-kit-tag'

const options: TagOption[] = [
  { label: '成功', value: 'success', tagProps: { type: 'success' as const } },
  { label: '信息', value: 'info', tagProps: { type: 'info' as const } },
  { label: '警告', value: 'warning', tagProps: { type: 'warning' as const } },
  { label: '危险', value: 'danger', tagProps: { type: 'danger' as const } },
]

const value = ref('success')
</script>

<template>
  <el-space wrap>
    <WTag :options="options" :value="value" />
    <WTag :options="options" value="info" />
    <WTag :options="options" value="warning" />
    <WTag :options="options" value="danger" />
  </el-space>
</template>
```

:::

## API

### 属性

支持 [`ElTag`](https://element-plus.org/zh-CN/component/tag.html#tag-attributes) 所有的属性。

**拓展属性**：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签文本（优先级高于 options + value 匹配） | `string` | - |
| options | 选项列表（用于根据 value 匹配标签文本） | `TagOption[]` | - |
| value | 当前值（用于从 options 中匹配对应的选项，支持单个值或数组） | `TagValue \| TagValue[]` | - |
| props | 字段映射配置（用于自定义 options 中的字段名） | `TagFieldProps` | `{ label: 'label', value: 'value' }` |
| looseMatch | 是否宽松匹配（默认 true，会将布尔值和字符串 'true'/'false' 互相匹配） | `boolean` | `true` |
| separator | 数组值渲染时的分隔符 | `string` | `', '` |

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

### 事件

支持 [`ElTag`](https://element-plus.org/zh-CN/component/tag.html#tag-events) 所有的事件。

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| close | 关闭 Tag 时触发的事件 | `(event: MouseEvent) => void` |
| click | 点击 Tag 时触发的事件 | `(event: MouseEvent) => void` |

### 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 标签内容（优先级最高，会覆盖 label 和 options + value 匹配的结果） |
