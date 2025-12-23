# CheckTag 可选标签组件

可选标签组件，基于 Element Plus CheckTag 的封装组件，支持单选和多选模式，适用于标签选择场景。


## 基础用法

WCheckTag 组件支持单选和多选两种模式，通过 `multiple` 属性控制。

### 单选模式

单选模式下，只能选择一个选项，且不能取消选中（只能切换选择）。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WCheckTag } from '@iswangh/element-plus-kit'
import type { CheckTagOption } from '@iswangh/element-plus-kit-tag'

const options: CheckTagOption[] = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
]

const value = ref<string | null>(null)
</script>

<template>
  <WCheckTag v-model="value" :options="options" />
</template>
```

:::

### 多选模式

多选模式下，可以选择多个选项，支持取消选中。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WCheckTag } from '@iswangh/element-plus-kit'
import type { CheckTagOption } from '@iswangh/element-plus-kit-tag'

const options: CheckTagOption[] = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
  { label: '选项4', value: '4' },
]

const values = ref<string[]>([])
</script>

<template>
  <WCheckTag v-model="values" :options="options" multiple />
</template>
```

:::

### 不同类型

通过 `tagProps` 可以为每个选项配置不同的类型（如 `success`、`info`、`warning`、`danger`）。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WCheckTag } from '@iswangh/element-plus-kit'
import type { CheckTagOption } from '@iswangh/element-plus-kit-tag'

const options: CheckTagOption[] = [
  { label: '成功', value: 'success', tagProps: { type: 'success' } },
  { label: '信息', value: 'info', tagProps: { type: 'info' } },
  { label: '警告', value: 'warning', tagProps: { type: 'warning' } },
  { label: '危险', value: 'danger', tagProps: { type: 'danger' } },
]

const value = ref<string | null>(null)
</script>

<template>
  <WCheckTag v-model="value" :options="options" />
</template>
```

:::

### 禁用状态

支持组件级别和选项级别的禁用状态。组件级禁用优先级大于选项级禁用。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WCheckTag } from '@iswangh/element-plus-kit'
import type { CheckTagOption } from '@iswangh/element-plus-kit-tag'

const options: CheckTagOption[] = [
  { label: '正常', value: 'normal' },
  { label: '禁用选项', value: 'disabled', disabled: true },
  { label: '正常2', value: 'normal2' },
]

const singleValue = ref<string | null>(null)
const multipleValue = ref<string[]>([])
</script>

<template>
  <el-space direction="vertical" :size="20" fill>
    <div>
      <h3 class="text-base text-gray-700 font-medium mb-2">
        选项级别禁用
      </h3>
      <el-space wrap>
        <WCheckTag v-model="singleValue" :options="options" />
      </el-space>
      <p class="text-sm text-gray-500 text-xs mt-2">
        单选模式：只有标记为 <code>disabled: true</code> 的选项被禁用
      </p>
    </div>
    <div>
      <h3 class="text-base text-gray-700 font-medium mb-2">
        选项级别禁用（多选模式）
      </h3>
      <el-space wrap>
        <WCheckTag v-model="multipleValue" :options="options" multiple />
      </el-space>
      <p class="text-sm text-gray-500 text-xs mt-2">
        多选模式：只有标记为 <code>disabled: true</code> 的选项被禁用
      </p>
    </div>
    <div>
      <h3 class="text-base text-gray-700 font-medium mb-2">
        组件级别禁用
      </h3>
      <el-space wrap>
        <WCheckTag v-model="singleValue" :options="options" disabled />
      </el-space>
      <p class="text-sm text-gray-500 text-xs mt-2">
        组件级禁用：所有选项都被禁用，无论选项本身的 <code>disabled</code> 属性
      </p>
    </div>
    <div>
      <h3 class="text-base text-gray-700 font-medium mb-2">
        组件级别禁用（多选模式）
      </h3>
      <el-space wrap>
        <WCheckTag v-model="multipleValue" :options="options" multiple disabled />
      </el-space>
      <p class="text-sm text-gray-500 text-xs mt-2">
        组件级禁用：所有选项都被禁用，无论选项本身的 <code>disabled</code> 属性
      </p>
    </div>
  </el-space>
</template>
```

:::

## 字段映射

通过 `props` 属性可以自定义 `options` 中的字段名，支持不同的数据结构。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WCheckTag } from '@iswangh/element-plus-kit'
import type { CheckTagOption } from '@iswangh/element-plus-kit-tag'

const singleOptions: CheckTagOption[] = [
  { text: '选项1', id: '1' },
  { text: '选项2', id: '2' },
  { text: '选项3', id: '3' },
]

const multipleOptions: CheckTagOption[] = [
  { text: '选项1', id: '1' },
  { text: '选项2', id: '2' },
  { text: '选项3', id: '3' },
  { text: '选项4', id: '4' },
]

const singleValue = ref<string | null>(null)
const multipleValue = ref<string[]>([])

const fieldProps = {
  label: 'text',
  value: 'id',
}
</script>

<template>
  <el-space direction="vertical" :size="20" fill>
    <div>
      <h3 class="text-base text-gray-700 font-medium mb-2">
        单选模式
      </h3>
      <WCheckTag
        v-model="singleValue"
        :options="singleOptions"
        :props="fieldProps"
      />
    </div>
    <div>
      <h3 class="text-base text-gray-700 font-medium mb-2">
        多选模式
      </h3>
      <WCheckTag
        v-model="multipleValue"
        :options="multipleOptions"
        :props="fieldProps"
        multiple
      />
    </div>
  </el-space>
</template>
```

:::

## Space 组件属性

通过 `spaceProps` 属性可以配置 `ElSpace` 组件的属性，控制标签之间的间距和布局。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WCheckTag } from '@iswangh/element-plus-kit'
import type { CheckTagOption } from '@iswangh/element-plus-kit-tag'

const options: CheckTagOption[] = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
  { label: '选项4', value: '4' },
]

const value = ref<string | null>(null)
</script>

<template>
  <el-space direction="vertical" :size="20" fill>
    <div>
      <h3 class="text-base text-gray-700 font-medium mb-2">
        默认间距
      </h3>
      <WCheckTag v-model="value" :options="options" />
    </div>
    <div>
      <h3 class="text-base text-gray-700 font-medium mb-2">
        自定义间距（size: 20）
      </h3>
      <WCheckTag v-model="value" :options="options" :space-props="{ size: 20 }" />
    </div>
    <div>
      <h3 class="text-base text-gray-700 font-medium mb-2">
        垂直布局（direction: vertical）
      </h3>
      <WCheckTag
        v-model="value"
        :options="options"
        :space-props="{ direction: 'vertical', size: 12 }"
      />
    </div>
    <div>
      <h3 class="text-base text-gray-700 font-medium mb-2">
        自动换行（wrap: true）
      </h3>
      <WCheckTag
        v-model="value"
        :options="options"
        :space-props="{ wrap: true }"
      />
    </div>
  </el-space>
</template>
```

:::

## 值验证和过滤

### 单选模式值验证

单选模式下，如果 `modelValue` 不在 `options` 中，会自动清空为 `null`。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WCheckTag } from '@iswangh/element-plus-kit'
import type { CheckTagOption } from '@iswangh/element-plus-kit-tag'

const options: CheckTagOption[] = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
]

// 初始值不在 options 中，会被自动清空为 null
const value = ref<string | null>('invalid')
</script>

<template>
  <div>
    <p class="text-sm text-gray-600 mb-2">
      当前值：<code>{{ value ?? 'null' }}</code>
    </p>
    <WCheckTag v-model="value" :options="options" />
    <p class="text-sm text-gray-500 mt-2">
      说明：如果初始值不在 options 中，会自动清空为 null
    </p>
  </div>
</template>
```

:::

### 多选模式值过滤

多选模式下，会自动过滤掉不在 `options` 中的值，只保留有效值。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WCheckTag } from '@iswangh/element-plus-kit'
import type { CheckTagOption } from '@iswangh/element-plus-kit-tag'

const options: CheckTagOption[] = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
]

// 初始值包含无效值，会被自动过滤
const values = ref<string[]>(['1', 'invalid', '2', 'another-invalid'])
</script>

<template>
  <div>
    <p class="text-sm text-gray-600 mb-2">
      当前值：<code>{{ JSON.stringify(values) }}</code>
    </p>
    <WCheckTag v-model="values" :options="options" multiple />
    <p class="text-sm text-gray-500 mt-2">
      说明：无效值会被自动过滤，只保留在 options 中的值
    </p>
  </div>
</template>
```

:::

## API

### 属性

支持 [`ElCheckTag`](https://element-plus.org/zh-CN/component/tag.html#check-tag-attributes) 所有的属性。

**拓展属性**：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 选项列表（必填） | `CheckTagOption[]` | - |
| multiple | 是否多选（默认 false，单选） | `boolean` | `false` |
| modelValue | 当前值（单选：`TagValue`，多选：`TagValue[]`） | `TagValue \| TagValue[]` | - |
| props | 字段映射配置（用于自定义 options 中的字段名） | `TagFieldProps` | `{ label: 'label', value: 'value' }` |
| spaceProps | Space 组件属性（用于配置标签之间的间距和布局） | `Partial<ElSpaceProps>` | - |

**Element Plus CheckTag 属性**：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| disabled | 是否禁用（组件级别） | `boolean` | `false` |
| type | 类型 | `'success' \| 'info' \| 'warning' \| 'danger'` | `''` |

#### CheckTagOption 配置

`options` 数组中每一项的配置类型。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签文本（如果使用默认字段映射） | `string` | - |
| value | 标签值（如果使用默认字段映射） | `unknown` | - |
| disabled | 单个选项是否禁用 | `boolean` | `false` |
| tagProps | 标签属性（传递给 ElCheckTag 的属性） | `Partial<ElCheckTagProps>` | - |
| [key: string] | 允许其他自定义字段 | `any` | - |

#### TagFieldProps 配置

`props` 字段映射配置。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签文本字段名 | `string` | `'label'` |
| value | 标签值字段名 | `string` | `'value'` |

#### ElSpaceProps 配置

`spaceProps` Space 组件属性配置，支持 [`ElSpace`](https://element-plus.org/zh-CN/component/space.html#space-attributes) 所有的属性。

常用属性：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 间距大小 | `number \| string \| [number, number]` | `8` |
| direction | 排列方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| wrap | 是否自动换行 | `boolean` | `false` |
| fill | 是否填充容器 | `boolean` | `false` |

### 事件

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 值更新事件（v-model） | `(value: TagValue \| TagValue[]) => void` |
| change | 值变化事件 | `(value: TagValue \| TagValue[]) => void` |

**事件说明**：

- `change`：值变化时触发，单选模式返回 `TagValue`，多选模式返回 `TagValue[]`
