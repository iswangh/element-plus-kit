# Form 表单组件

动态表单组件，支持通过配置快速生成表单，提供开箱即用的表单解决方案。

## 基础用法

通过配置 `formItems` 数组，快速生成表单。支持所有 Element Plus 表单组件类型。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormItems } from '@iswangh/element-plus-kit'

const form = ref({
  checkbox: [],
  inputTag: [],
  transfer: [],
})

const formItems: FormItems = [
  {
    prop: 'input',
    label: '输入框',
    comp: 'input',
    compAttrs: {
      clearable: true,
    },
  },
  {
    prop: 'inputNumber',
    label: '数字输入框',
    comp: 'input-number',
    compAttrs: {
      min: 0,
      max: 100,
      step: 1,
    },
  },
  {
    prop: 'textarea',
    label: '文本域',
    comp: 'input',
    compAttrs: {
      type: 'textarea',
      rows: 3,
    },
  },
  {
    prop: 'select',
    label: '选择器',
    comp: 'select',
    compAttrs: {
      options: [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
      ],
    },
  },
  {
    prop: 'autocomplete',
    label: '自动完成',
    comp: 'autocomplete',
    compAttrs: {
      fetchSuggestions: () => [],
    },
  },
  {
    prop: 'cascader',
    label: '级联选择器',
    comp: 'cascader',
    compAttrs: {
      options: [
        {
          value: 'beijing',
          label: '北京',
          children: [
            { value: 'dongcheng', label: '东城' },
            { value: 'xicheng', label: '西城' },
          ],
        },
        {
          value: 'shanghai',
          label: '上海',
          children: [
            { value: 'huangpu', label: '黄浦' },
            { value: 'xuhui', label: '徐汇' },
          ],
        },
      ],
    },
  },
  {
    prop: 'datePicker',
    label: '日期选择器',
    comp: 'date-picker',
    compAttrs: {
      type: 'date',
    },
  },
  {
    prop: 'timePicker',
    label: '时间选择器',
    comp: 'time-picker',
    compAttrs: {},
  },
  {
    prop: 'timeSelect',
    label: '时间选择',
    comp: 'time-select',
    compAttrs: {},
  },
  {
    prop: 'switch',
    label: '开关',
    comp: 'switch',
  },
  {
    prop: 'radio',
    label: '单选框',
    comp: 'radio',
    compAttrs: {
      options: [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
      ],
    },
  },
  {
    prop: 'checkbox',
    label: '复选框',
    comp: 'checkbox',
    compAttrs: {
      options: [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
      ],
    },
  },
  {
    prop: 'rate',
    label: '评分',
    comp: 'rate',
  },
  {
    prop: 'slider',
    label: '滑块',
    comp: 'slider',
  },
  {
    prop: 'colorPicker',
    label: '颜色选择器',
    comp: 'color-picker',
  },
  {
    prop: 'inputTag',
    label: '标签输入',
    comp: 'input-tag',
  },
  {
    prop: 'transfer',
    label: '穿梭框',
    comp: 'transfer',
    compAttrs: {
      data: [
        { key: 1, label: '选项1' },
        { key: 2, label: '选项2' },
        { key: 3, label: '选项3' },
        { key: 4, label: '选项4' },
      ],
      props: {
        key: 'key',
        label: 'label',
      },
    },
  },
  {
    prop: 'treeSelect',
    label: '树形选择器',
    comp: 'tree-select',
    compAttrs: {
      data: [
        {
          value: '1',
          label: '一级 1',
          children: [
            { value: '1-1', label: '二级 1-1' },
            { value: '1-2', label: '二级 1-2' },
          ],
        },
        {
          value: '2',
          label: '一级 2',
          children: [
            { value: '2-1', label: '二级 2-1' },
            { value: '2-2', label: '二级 2-2' },
          ],
        },
      ],
    },
  },
]
</script>

<template>
  <WForm :model="form" :form-items="formItems" />
</template>
```

:::

## 表单验证

支持 Element Plus 的表单验证规则和自定义验证函数。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormItems, ActionConfig } from '@iswangh/element-plus-kit'

const form = ref({})

// 自定义验证函数：确认密码
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value !== form.value.password) {
    callback(new Error('两次输入的密码不一致'))
  }
  else {
    callback()
  }
}

const formItems: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    comp: 'input',
    rules: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
    ],
    compAttrs: {
      clearable: true,
    },
  },
  {
    prop: 'password',
    label: '密码',
    comp: 'input',
    rules: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' },
    ],
    compAttrs: {
      type: 'password',
      showPassword: true,
      clearable: true,
    },
  },
  {
    prop: 'confirmPassword',
    label: '确认密码',
    comp: 'input',
    rules: [
      { required: true, message: '请再次输入密码', trigger: 'blur' },
      { validator: validateConfirmPassword, trigger: 'blur' },
    ],
    compAttrs: {
      type: 'password',
      showPassword: true,
      clearable: true,
    },
  },
]

const actionConfig: ActionConfig = {
  vIf: true, // 必须设置为 true，按钮才会显示
  buttons: ['submit', 'cancel'],
}

const handleAction = (eventName: string) => {
  if (eventName === 'submit') {
    ElMessage.success('提交成功！')
    console.log('表单数据:', form.value)
  }
  else if (eventName === 'cancel') {
    ElMessage.info('已取消')
  }
}
</script>

<template>
  <WForm
    :model="form"
    :form-items="formItems"
    :action-config="actionConfig"
    @action="handleAction"
  />
</template>
```

:::

## 条件渲染

使用 `vIf` 或 `vShow` 实现表单项的条件显示。`vIf` 依赖表单内部值，`vShow` 可以依赖外部值。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Document, InfoFilled, Setting } from '@element-plus/icons-vue'
import type { FormItems } from '@iswangh/element-plus-kit'

// 外部状态
const externalStatus = ref(false)

const form = ref({
  // 内部值：用于 vIf
  hasEmail: false,
  // 内部值：用于 vIf
  hasPhone: false,
  // 内部值：用于 vShow
  hasAddress: false,
})

const formItems: FormItems = [
  {
    prop: 'hasEmail',
    label: '填写邮箱',
    comp: 'switch',
  },
  {
    prop: 'email',
    label: '邮箱',
    comp: 'input',
    // vIf: 依赖表单内部值，条件为 false 时不会渲染 DOM
    vIf: (data) => data?.hasEmail === true,
    rules: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
    compAttrs: {
      type: 'email',
      clearable: true,
    },
  },
  {
    prop: 'hasPhone',
    label: '填写手机',
    comp: 'switch',
  },
  {
    prop: 'phone',
    label: '手机号',
    comp: 'input',
    // vShow: 依赖表单内部值，条件为 false 时隐藏但保留 DOM
    vShow: (data) => data?.hasPhone === true,
    rules: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
    ],
    compAttrs: {
      clearable: true,
    },
  },
  {
    prop: 'address',
    label: '地址',
    comp: 'input',
    // vShow: 依赖外部值
    vShow: () => externalStatus.value === true,
    compAttrs: {
      clearable: true,
    },
  },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 控制开关区域 -->
    <el-card shadow="hover" class="rounded-lg">
      <template #header>
        <div class="flex items-center gap-2">
          <el-icon><Setting /></el-icon>
          <span class="font-semibold text-base">控制开关</span>
        </div>
      </template>
      <div class="flex flex-col gap-5">
        <!-- 外部值控制 -->
        <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1.5">
              <el-tag type="warning" size="small" effect="plain">外部值</el-tag>
              <span class="font-medium text-gray-800 dark:text-gray-200">控制地址字段显示</span>
            </div>
            <el-text type="info" size="small" class="text-gray-500 dark:text-gray-400">
              地址字段使用 vShow，依赖外部值 externalStatus
            </el-text>
          </div>
          <el-switch
            v-model="externalStatus"
            active-text="显示"
            inactive-text="隐藏"
            class="ml-4"
          />
        </div>

        <!-- 表单内部值控制 -->
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <div class="flex items-center gap-2 mb-1.5">
            <el-tag type="primary" size="small" effect="plain">内部值</el-tag>
            <span class="font-medium text-gray-800 dark:text-gray-200">表单内开关控制</span>
          </div>
          <el-text type="info" size="small" class="text-gray-500 dark:text-gray-400">
            通过表单内的开关控制邮箱和手机号字段的显示
          </el-text>
        </div>
      </div>
    </el-card>

    <!-- 表单渲染区域 -->
    <el-card shadow="hover" class="rounded-lg">
      <template #header>
        <div class="flex items-center gap-2">
          <el-icon><Document /></el-icon>
          <span class="font-semibold text-base">表单渲染</span>
        </div>
      </template>
      <WForm :model="form" :form-items="formItems" />
      <el-divider class="my-5" />
      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
        <div class="flex flex-col gap-3">
          <div class="flex items-start gap-3">
            <el-icon class="text-blue-500 mt-0.5"><InfoFilled /></el-icon>
            <div>
              <div class="font-medium text-gray-800 dark:text-gray-200 mb-1">邮箱字段</div>
              <el-text type="info" size="small" class="text-gray-500 dark:text-gray-400">
                使用 <el-text code size="small">vIf</el-text>，依赖表单内部值 <el-text code size="small">hasEmail</el-text>（表单内开关控制）
              </el-text>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <el-icon class="text-blue-500 mt-0.5"><InfoFilled /></el-icon>
            <div>
              <div class="font-medium text-gray-800 dark:text-gray-200 mb-1">手机号字段</div>
              <el-text type="info" size="small" class="text-gray-500 dark:text-gray-400">
                使用 <el-text code size="small">vShow</el-text>，依赖表单内部值 <el-text code size="small">hasPhone</el-text>（表单内开关控制）
              </el-text>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <el-icon class="text-green-500 mt-0.5"><InfoFilled /></el-icon>
            <div>
              <div class="font-medium text-gray-800 dark:text-gray-200 mb-1">地址字段</div>
              <el-text type="info" size="small" class="text-gray-500 dark:text-gray-400">
                使用 <el-text code size="small">vShow</el-text>，依赖外部值 <el-text code size="small">externalStatus</el-text>（上方开关控制）
              </el-text>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
```

:::

## 操作按钮

通过 `actionConfig` 配置表单底部的操作按钮。注意：`action` 事件和 `submit`、`cancel`、`search`、`reset` 事件不能同时使用，因为所有按钮点击都会统一触发一次 `action` 事件。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormItems, ActionConfig } from '@iswangh/element-plus-kit'

const form = ref({})

const formItems: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    comp: 'input',
    compAttrs: {
      clearable: true,
    },
  },
  {
    prop: 'email',
    label: '邮箱',
    comp: 'input',
    compAttrs: {
      type: 'email',
      clearable: true,
    },
  },
]

const actionConfig: ActionConfig = {
  vIf: true, // 必须设置为 true，按钮才会显示
  buttons: ['submit', 'cancel'],
}

const handleAction = (eventName: string) => {
  if (eventName === 'submit') {
    ElMessage.success('提交成功！')
    console.log('表单数据:', form.value)
  }
  else if (eventName === 'cancel') {
    ElMessage.info('已取消')
  }
  // 所有按钮点击都会触发 action 事件
  console.log('按钮事件:', eventName)
}
</script>

<template>
  <WForm
    :model="form"
    :form-items="formItems"
    :action-config="actionConfig"
    @action="handleAction"
  />
</template>
```

:::

## 布局配置

通过 `inline` 属性和 `rowAttrs`、`colAttrs` 配置表单布局。

**布局逻辑说明**：
- 当 `inline` 为 `true` 时，使用 `ElRow` 和 `ElCol` 进行布局
- 当 `inline` 为 `false`（默认）时：
  - 如果 `rowAttrs` 对象中有配置项（如 `gutter`、`span` 等），也会使用 `ElRow` 和 `ElCol` 进行布局
  - 如果 `formItem` 的 `colAttrs` 也有值（如 `span`），同样会使用 `ElCol` 进行布局
  - 如果两者都没有配置，则使用普通的 `div` 布局

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormItems, RowAttrs } from '@iswangh/element-plus-kit'

const form = ref({})

const formItems: FormItems = [
  {
    prop: 'name',
    label: '姓名',
    comp: 'input',
    colAttrs: {
      span: 12,
    },
    compAttrs: {},
  },
  {
    prop: 'age',
    label: '年龄',
    comp: 'input-number',
    colAttrs: {
      span: 12,
    },
    compAttrs: {
      min: 0,
      max: 120,
    },
  },
  {
    prop: 'email',
    label: '邮箱',
    comp: 'input',
    colAttrs: {
      span: 12,
    },
    compAttrs: {
      type: 'email',
    },
  },
  {
    prop: 'phone',
    label: '手机号',
    comp: 'input',
    colAttrs: {
      span: 12,
    },
    compAttrs: {},
  },
]

const rowAttrs: RowAttrs = {
  gutter: 20,
}
</script>

<template>
  <div>
    <h3>非 inline 布局（默认）</h3>
    <p>通过 rowAttrs 和 colAttrs 配置布局</p>
    <WForm :model="form" :form-items="formItems" :row-attrs="rowAttrs" />
    
    <h3 style="margin-top: 40px">inline 布局</h3>
    <WForm :model="form" :form-items="formItems" inline />
  </div>
</template>
```

:::

## API

### Attributes

**继承 Element Plus Form 属性**：组件继承所有 [`ElForm`](https://element-plus.org/zh-CN/component/form.html#form-attributes) 的属性。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model | 表单数据对象 | `Record<string, any>` | `{}` |
| formItems | 表单项配置数组，详见 [FormItem 配置](#formitem-配置) | `FormItems` | `[]` |
| rowAttrs | 行布局属性（ElRow 属性） | `RowAttrs` | `{}` |
| actionConfig | 操作按钮配置，详见 [ActionConfig 配置](#actionconfig-配置) | `ActionConfig` | `{}` |

#### FormItem 配置

`formItems` 数组中每一项的配置类型。

##### 基础配置

```typescript
interface FormItem<C extends FormItemComp = FormItemComp> extends ElFormItemAttrs {
  /** 表单字段名（必填） */
  prop: string
  /** 组件类型（必填） */
  comp: FormItemComp
  /** 组件属性配置，根据组件类型自动推断 */
  compAttrs?: FormItemCompAttrs<C>
  /** 条件渲染（v-if），支持布尔值或接收表单数据的函数，依赖表单内部值 */
  vIf?: boolean | ((data?: any) => boolean)
  /** 显示/隐藏（v-show），支持布尔值或接收表单数据的函数，可以依赖外部值 */
  vShow?: boolean | ((data?: any) => boolean)
  /** 列布局属性（ElCol 属性） */
  colAttrs?: ColAttrs
  /** 验证规则 */
  rules?: FormRules
  // ... 其他 ElFormItem 属性（如 label、required、error 等）
}
```

##### 支持的组件类型

`comp` 字段支持以下组件类型：

- [`input`](https://element-plus.org/zh-CN/component/input.html) - 输入框（支持 `type: 'textarea'` 实现文本域）
- [`input-number`](https://element-plus.org/zh-CN/component/input-number.html) - 数字输入框
- [`input-tag`](https://element-plus.org/zh-CN/component/input-tag.html) - 标签输入
- [`select`](https://element-plus.org/zh-CN/component/select.html) - 选择器
- [`select-v2`](https://element-plus.org/zh-CN/component/select-v2.html) - 虚拟列表选择器
- [`autocomplete`](https://element-plus.org/zh-CN/component/autocomplete.html) - 自动完成
- [`cascader`](https://element-plus.org/zh-CN/component/cascader.html) - 级联选择器
- [`tree-select`](https://element-plus.org/zh-CN/component/tree-select.html) - 树形选择器
- [`date-picker`](https://element-plus.org/zh-CN/component/date-picker.html) - 日期选择器
- [`date-picker-panel`](https://element-plus.org/zh-CN/component/date-picker.html#date-picker-panel-%E6%97%A5%E6%9C%9F%E9%80%89%E6%8B%A9%E9%9D%A2%E6%9D%BF) - 日期选择面板
- [`time-picker`](https://element-plus.org/zh-CN/component/time-picker.html) - 时间选择器
- [`time-select`](https://element-plus.org/zh-CN/component/time-select.html) - 时间选择
- [`switch`](https://element-plus.org/zh-CN/component/switch.html) - 开关
- [`radio`](https://element-plus.org/zh-CN/component/radio.html) - 单选框（配合 `options` 属性）
- [`checkbox`](https://element-plus.org/zh-CN/component/checkbox.html) - 复选框（配合 `options` 属性）
- [`rate`](https://element-plus.org/zh-CN/component/rate.html) - 评分
- [`slider`](https://element-plus.org/zh-CN/component/slider.html) - 滑块
- [`color-picker`](https://element-plus.org/zh-CN/component/color-picker.html) - 颜色选择器
- [`color-picker-panel`](https://element-plus.org/zh-CN/component/color-picker.html#color-picker-panel-%E9%A2%9C%E8%89%B2%E9%80%89%E6%8B%A9%E9%9D%A2%E6%9D%BF) - 颜色选择面板
- [`transfer`](https://element-plus.org/zh-CN/component/transfer.html) - 穿梭框
- [`mention`](https://element-plus.org/zh-CN/component/mention.html) - 提及
- `custom` - 自定义组件（通过插槽实现）

##### 使用示例

```typescript
const formItems: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    comp: 'input',
    compAttrs: {
      clearable: true,
    },
    rules: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
    // 条件渲染：只有当其他字段存在时才显示
    vIf: (data) => !!data?.otherField,
    // 列布局：设置占用的列数
    colAttrs: {
      span: 12,
    },
  },
  {
    prop: 'age',
    label: '年龄',
    comp: 'input-number',
    compAttrs: {
      min: 0,
      max: 120,
      step: 1,
    },
    colAttrs: {
      span: 12,
    },
  },
  {
    prop: 'customField',
    label: '自定义字段',
    comp: 'custom', // 使用 custom 类型，通过插槽自定义
  },
]
```

**自定义组件示例**：

```vue
<template>
  <WForm :model="form" :form-items="formItems">
    <!-- 通过 prop 名称自定义组件 -->
    <template #customField="{ value, form, formItem }">
      <el-input v-model="form.customField" placeholder="自定义输入框">
        <template #prefix>
          <el-icon><User /></el-icon>
        </template>
      </el-input>
    </template>
  </WForm>
</template>
```

#### ActionConfig 配置

`actionConfig` 的配置类型，用于自定义表单底部的操作按钮。

```typescript
interface ActionConfig {
  /** 是否显示操作区域（v-if） */
  vIf?: boolean | ((data?: any) => boolean)
  /** 显示/隐藏操作区域（v-show） */
  vShow?: boolean | ((data?: any) => boolean)
  /** 按钮列表 */
  buttons?: ActionConfigButtons[]
}
```

##### 预设按钮

支持以下预设按钮：

- `'submit'` - 确认按钮（默认：主要按钮）
- `'reset'` - 重置按钮
- `'search'` - 搜索按钮（默认：主要按钮，带搜索图标）
- `'cancel'` - 取消按钮

##### 自定义按钮

```typescript
interface ActionConfigButtonItem extends Partial<ButtonProps> {
  /** 按钮文字 */
  label?: string
  /** 事件名称（必填） */
  eventName: string
}
```

##### 使用示例

```typescript
const actionConfig: ActionConfig = {
  vIf: true, // 必须设置为 true，按钮才会显示
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

**注意**：当表单 `inline` 为 `true` 时，默认按钮为 `['search', 'reset']`；当 `inline` 为 `false` 时，默认按钮为 `['submit', 'cancel']`。如果设置了 `actionConfig.buttons`，则使用自定义配置。

### Events

**继承 Element Plus Form 事件**：组件继承所有 [`ElForm`](https://element-plus.org/zh-CN/component/form.html#form-events) 的事件。

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| change | 表单项值变化事件 | `(extendedParams: EventExtendedParams, value: any)` |
| action | 操作按钮点击事件 | `(eventName: string)` |

**注意**：
- `change` 事件的第一个参数固定为 `extendedParams`（包含 `prop`、`index`、`formItem`），第二个参数为变化后的值
- 动态组件的事件（如 `@input`、`@focus`、`@blur` 等）的第一个参数固定为 `extendedParams`，后续参数为原始事件参数
- `action` 事件和 `submit`、`cancel`、`search`、`reset` 事件不能同时使用，因为所有按钮点击都会统一触发一次 `action` 事件

### Slots

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| `{prop}` | 自定义组件插槽，当 `comp` 为 `custom` 时使用 | `FormItemSlotScope` |
| `form-item-{prop}` | 表单项插槽，用于自定义表单项内容 | `FormItemSlotScope` |
| `{prop}-{slotName}` | 动态组件插槽，如 `username-prefix`、`email-suffix` | `FormItemSlotScope` |
| `action` | 自定义操作按钮区域 | - |

**插槽作用域参数 `FormItemSlotScope`**：
- `value`: 当前表单项组件的值
- `form`: 表单数据对象
- `formItem`: 表单项配置对象

**插槽使用说明**：
- **自定义组件插槽**：当 `formItem.comp` 为 `custom` 时，可以通过 `{prop}` 插槽名称自定义整个表单项的内容
- **表单项插槽**：通过 `form-item-{prop}` 可以自定义 `el-form-item` 的插槽（如 `label`、`error` 等）
- **动态组件插槽**：通过 `{prop}-{slotName}` 可以自定义组件内部的插槽（如 `prefix`、`suffix`、`prepend`、`append` 等）
