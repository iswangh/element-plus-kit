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
    label: '产品名称',
    compType: 'input',
  },
  {
    prop: 'inputNumber',
    label: '库存数量',
    compType: 'input-number',
  },
  {
    prop: 'textarea',
    label: '产品描述',
    compType: 'input',
    compProps: {
      type: 'textarea',
      rows: 3,
    },
  },
  {
    prop: 'select',
    label: '产品分类',
    compType: 'select',
    compProps: {
      options: [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
      ],
    },
  },
  {
    prop: 'autocomplete',
    label: '地址搜索',
    compType: 'autocomplete',
    compProps: {
      fetchSuggestions: () => [],
    },
  },
  {
    prop: 'cascader',
    label: '省市区',
    compType: 'cascader',
    compProps: {
      style: { width: '100%' },
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
    label: '创建日期',
    compType: 'date-picker',
    compProps: {
      style: { width: '100%' },
      type: 'date',
    },
  },
  {
    prop: 'timePicker',
    label: '开始时间',
    compType: 'time-picker',
    compProps: {
      style: { width: '100%' },
    },
  },
  {
    prop: 'timeSelect',
    label: '预约时间',
    compType: 'time-select',
    compProps: {
      style: { width: '100%' },
    },
  },
  {
    prop: 'switch',
    label: '启用状态',
    compType: 'switch',
  },
  {
    prop: 'radio',
    label: '优先级',
    compType: 'radio',
    compProps: {
      options: [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
      ],
    },
  },
  {
    prop: 'checkbox',
    label: '兴趣爱好',
    compType: 'checkbox',
    compProps: {
      options: [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
      ],
    },
  },
  {
    prop: 'rate',
    label: '满意度评分',
    compType: 'rate',
  },
  {
    prop: 'slider',
    label: '价格区间',
    compType: 'slider',
  },
  {
    prop: 'colorPicker',
    label: '主题颜色',
    compType: 'color-picker',
  },
  {
    prop: 'inputTag',
    label: '标签',
    compType: 'input-tag',
  },
  {
    prop: 'transfer',
    label: '权限分配',
    compType: 'transfer',
    compProps: {
      data: [
        { key: 1, label: '选项1' },
        { key: 2, label: '选项2' },
        { key: 3, label: '选项3' },
        { key: 4, label: '选项4' },
      ],
      props: { key: 'key', label: 'label' },
    },
  },
  {
    prop: 'treeSelect',
    label: '部门选择',
    compType: 'tree-select',
    compProps: {
      style: { width: '100%' },
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
  <WForm :model="form" :form-items="formItems" label-width="100px" />
</template>

```

:::

## 插槽使用

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { User, Lock, Search } from '@element-plus/icons-vue'
import type { FormItems } from '@iswangh/element-plus-kit'

const form = ref({})

const formItems: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    compType: 'input',
  },
  {
    prop: 'password',
    label: '密码',
    compType: 'input',
    compProps: {
      type: 'password',
      showPassword: true,
    },
  },
  {
    prop: 'email',
    label: '邮箱',
    compType: 'input',
    compProps: {
      type: 'email',
    },
  },
  {
    prop: 'customField',
    label: '自定义字段',
    compType: 'custom',
  },
]
</script>

<template>
  <WForm :model="form" :form-items="formItems" label-width="180px">
    <!-- 动态组件插槽：username-prefix -->
    <template #username-prefix>
      <el-icon><User /></el-icon>
    </template>

    <!-- 动态组件插槽：password-prefix -->
    <template #password-prefix>
      <el-icon><Lock /></el-icon>
    </template>

    <!-- 动态组件插槽：email-suffix -->
    <template #email-suffix>
      <el-icon><Search /></el-icon>
    </template>

    <!-- 表单项插槽：form-item-label -->
    <template #form-item-label="{ formItem }">
      <span style="color: #409eff">{{ formItem.label }}（自定义标签）</span>
    </template>

    <!-- 自定义组件插槽：customField -->
    <template #customField="{ value, form, formItem }">
      <el-input
        v-model="form.customField"
        placeholder="自定义输入框"
        clearable
      >
        <template #prefix>
          <el-icon><User /></el-icon>
        </template>
      </el-input>
    </template>
  </WForm>
</template>
```

:::

## 可配置化

除了使用模板插槽和在 `WForm` 标签上监听事件，还可以在 `formItems` 配置对象中直接定义插槽和事件处理器，这种方式称为"可配置化"。

> **⚠️ 注意**：可配置化插槽在 VitePress demo 块中可能无法正常工作（VitePress 在编译时无法正确序列化函数类型的 props）。如果需要查看效果，建议在本地 demo 查看。
### 插槽

可配置化插槽支持两种类型：

- **FormItem 插槽**：在配置对象的 `slots` 字段中定义，用于自定义 `el-form-item` 的插槽（如 `label`、`error` 等）
- **动态组件插槽**：在 `compProps.slots` 字段中定义，用于自定义动态组件的插槽（如 `prefix`、`suffix` 等）

**优先级**：可配置化插槽优先级高于模板插槽，如果同时定义了可配置化插槽和模板插槽，会优先使用可配置化插槽。

:::demo

```vue
<script setup lang="ts">
import { ref, h } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormItems } from '@iswangh/element-plus-kit'

const form = ref({
  username: '',
  email: '',
  password: '',
})

const formItems: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    compType: 'input',
    // FormItem 插槽配置
    slots: {
      label: (props) => h('span', { class: 'flex items-center gap-1' }, [
        h('span', props.formItem.label),
        h('span', { class: 'text-red-500' }, '*'),
      ]),
    },
    // 动态组件插槽配置
    compProps: {
      placeholder: '请输入用户名',
      slots: {
        prefix: () => h(User, { class: 'text-gray-400' }),
      },
    },
  },
  {
    prop: 'email',
    label: '邮箱',
    compType: 'input',
    compProps: {
      type: 'email',
      placeholder: '请输入邮箱',
      slots: {
        prefix: () => h('span', {}, '123'),
        suffix: () => h('span', { class: 'text-gray-400 text-xs' }, '必填'),
      },
    },
  },
  {
    prop: 'password',
    label: '密码',
    compType: 'input',
    compProps: {
      type: 'password',
      showPassword: true,
      placeholder: '请输入密码',
      slots: {
        prefix: () => h(Lock, { class: 'text-gray-400' }),
      },
    },
  },
]
</script>

<template>
  <WForm :model="form" :form-items="formItems" label-width="80px" />
</template>
```

:::

### 事件

可配置化事件支持在 `compProps` 中定义动态组件的事件处理器。

- **动态组件事件**：在 `compProps` 中定义，事件名以 `on` 开头（如 `onBlur`、`onFocus`、`onInput` 等）
- **优先级**：可配置化事件优先级高于 `WForm` 标签上的事件，如果同时定义了可配置化事件和标签事件，会优先使用可配置化事件

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormItems } from '@iswangh/element-plus-kit'
import { ElMessage } from 'element-plus'

const form = ref({
  username: '',
  email: '',
})

const formItems: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    compType: 'input',
    compProps: {
      placeholder: '请输入用户名',
      // 动态组件的事件在 compProps 中定义
      onBlur: (event: FocusEvent) => {
        ElMessage.info('onBlur 事件触发（来自配置）')
        console.log('onBlur 事件:', event)
      },
      onFocus: (event: FocusEvent) => {
        ElMessage.info('onFocus 事件触发（来自配置）')
        console.log('onFocus 事件:', event)
      },
    },
  },
  {
    prop: 'email',
    label: '邮箱',
    compType: 'input',
    compProps: {
      type: 'email',
      placeholder: '请输入邮箱',
      onBlur: (event: FocusEvent) => {
        ElMessage.info('onBlur 事件触发（来自配置）')
        console.log('onBlur 事件:', event)
      },
    },
  },
]
</script>

<template>
  <WForm :model="form" :form-items="formItems" label-width="100px" />
</template>
```

:::

## 条件渲染

使用 `vIf` 或 `vShow` 实现表单项的条件显示。两者都支持布尔值或接收表单数据的函数，函数可以通过参数访问表单数据，也可以通过闭包访问外部值。

- **`vIf`**：条件渲染（v-if），条件为 `false` 时不会渲染 DOM
- **`vShow`**：显示/隐藏（v-show），条件为 `false` 时隐藏但保留 DOM

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Document, InfoFilled, Setting } from '@element-plus/icons-vue'
import type { FormRules } from 'element-plus'
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
    compType: 'switch',
  },
  {
    prop: 'email',
    label: '邮箱',
    compType: 'input',
    compProps: {
      type: 'email',
    },
    vIf: (data) => data?.hasEmail === true,
  },
  {
    prop: 'hasPhone',
    label: '填写手机',
    compType: 'switch',
  },
  {
    prop: 'phone',
    label: '手机号',
    compType: 'input',
    vShow: (data) => data?.hasPhone === true,
  },
  {
    prop: 'address',
    label: '地址',
    compType: 'input',
    vShow: () => externalStatus.value === true,
  },
]

// 验证规则
const rules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
}
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
      <WForm :model="form" :rules="rules" :form-items="formItems" label-width="100px" />
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

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormItems, FormActionConfig } from '@iswangh/element-plus-kit'

const form = ref({})

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

const actionConfig: FormActionConfig = {
  vIf: true, // 当 inline 为 false 时，需要显式设置为 true 才会显示按钮
  buttons: ['submit', 'cancel'],
}

const onAction = (eventName: string) => {
  if (eventName === 'submit') {
    ElMessage.success('提交成功！')
    console.log('表单数据:', form.value)
  }
  else if (eventName === 'cancel') {
    ElMessage.info('已取消')
  }
  // 所有预设按钮（submit、cancel、search、reset、expand）点击都会触发 action 事件
  console.log('按钮事件:', eventName)
}
</script>

<template>
  <WForm
    :model="form"
    :form-items="formItems"
    :action-config="actionConfig"
    label-width="100px"
    @action="onAction"
  />
</template>
```

:::

## 布局配置

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormItems } from '@iswangh/element-plus-kit'

const form = ref({})

// 分栏布局的表单项（配置了 colProps）
const columnFormItems: FormItems = [
  {
    prop: 'name',
    label: '姓名',
    compType: 'input',
    colProps: {
      span: 12,
    },
  },
  {
    prop: 'age',
    label: '年龄',
    compType: 'input-number',
    colProps: {
      span: 12,
    },
    compProps: {
      min: 0,
      max: 120,
    },
  },
  {
    prop: 'email',
    label: '邮箱',
    compType: 'input',
    colProps: {
      span: 12,
    },
    compProps: {
      type: 'email',
    },
  },
  {
    prop: 'phone',
    label: '手机号',
    compType: 'input',
    colProps: {
      span: 12,
    },
  },
]

// 默认布局的表单项（无 colProps）
const defaultFormItems: FormItems = [
  {
    prop: 'name',
    label: '姓名',
    compType: 'input',
  },
  {
    prop: 'age',
    label: '年龄',
    compType: 'input-number',
    compProps: {
      min: 0,
      max: 120,
    },
  },
  {
    prop: 'email',
    label: '邮箱',
    compType: 'input',
    compProps: {
      type: 'email',
    },
  },
  {
    prop: 'phone',
    label: '手机号',
    compType: 'input',
  },
]

const rowProps = {
  gutter: 20,
}
</script>

<template>
  <div>
    <h3>场景 1：非 inline 模式 + rowProps + colProps（分栏布局）</h3>
    <p class="text-sm text-gray-600 mb-2">配置了 rowProps 和 colProps，表单项按指定列数分布</p>
    <WForm :model="form" :form-items="columnFormItems" :row-props="rowProps" />
    
    <h3 style="margin-top: 40px">场景 2：非 inline 模式 + 无 rowProps（默认布局）</h3>
    <p class="text-sm text-gray-600 mb-2">未配置 rowProps，即使设置了 colProps 也不会生效，表单项垂直排列</p>
    <WForm :model="form" :form-items="columnFormItems" />
    
    <h3 style="margin-top: 40px">场景 3：inline 模式 + rowProps + colProps（分栏布局）</h3>
    <p class="text-sm text-gray-600 mb-2">配置了 rowProps 和 colProps，表单项在一行内按指定列数分布</p>
    <WForm :model="form" :form-items="columnFormItems" :row-props="rowProps" inline />
    
    <h3 style="margin-top: 40px">场景 4：inline 模式 + 无 rowProps（默认布局）</h3>
    <p class="text-sm text-gray-600 mb-2">未配置 rowProps，表单项在一行内按默认方式排列（colProps 不会生效）</p>
    <WForm :model="form" :form-items="defaultFormItems" inline />
    
    <h3 style="margin-top: 40px">场景 5：colProps 有配置但 rowProps 无配置（不生效）</h3>
    <p class="text-sm text-gray-600 mb-2">⚠️ 即使设置了 colProps，如果 rowProps 没有配置，colProps 也不会生效</p>
    <WForm :model="form" :form-items="columnFormItems" />
  </div>
</template>
```

:::

### Inline 模式下的展开/收起功能

展开/收起功能仅在 `inline` 模式下可用，通过 `actionConfig.buttons` 包含 `'expand'` 来启用。适用于字段较多、需要默认隐藏部分字段的场景。

#### 基础展开/收起功能

通过 `expand` 配置展开规则，支持三种方式：`count`（按数量）、`include`（白名单）、`exclude`（黑名单）。

##### 使用 count 配置（按数量展开）

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormActionConfig, FormItems } from '@iswangh/element-plus-kit'

const form = ref({})

const formItems: FormItems = [
  { prop: 'name', label: '姓名', compType: 'input' },
  { prop: 'age', label: '年龄', compType: 'input-number', compProps: { min: 0, max: 120 } },
  { prop: 'email', label: '邮箱', compType: 'input', compProps: { type: 'email' } },
  { prop: 'phone', label: '手机号', compType: 'input' },
  { prop: 'gender', label: '性别', compType: 'select', compProps: { options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] } },
  { prop: 'birthday', label: '生日', compType: 'date-picker', compProps: { type: 'date' } },
  { prop: 'address', label: '地址', compType: 'input' },
  { prop: 'city', label: '城市', compType: 'input' },
]

const actionConfig: FormActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: {
    count: 3, // 默认展开前 3 个字段
  },
}
</script>

<template>
  <WForm
    :model="form"
    inline
    label-width="40px"
    :form-items="formItems"
    :action-config="actionConfig"
  />
</template>
```

:::

##### 使用 include 配置（白名单）

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormActionConfig, FormItems } from '@iswangh/element-plus-kit'

const form = ref({})

const formItems: FormItems = [
  { prop: 'name', label: '姓名', compType: 'input' },
  { prop: 'age', label: '年龄', compType: 'input-number', compProps: { min: 0, max: 120 } },
  { prop: 'email', label: '邮箱', compType: 'input', compProps: { type: 'email' } },
  { prop: 'phone', label: '手机号', compType: 'input' },
  { prop: 'gender', label: '性别', compType: 'select', compProps: { options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] } },
  { prop: 'birthday', label: '生日', compType: 'date-picker', compProps: { type: 'date' } },
  { prop: 'address', label: '地址', compType: 'input' },
]

const actionConfig: FormActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: {
    include: ['name', 'email', 'phone'], // 只展开指定的字段
  },
}
</script>

<template>
  <WForm
    :model="form"
    inline
    label-width="54px"
    :form-items="formItems"
    :action-config="actionConfig"
  />
</template>
```

:::

##### 使用 exclude 配置（黑名单）

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormActionConfig, FormItems } from '@iswangh/element-plus-kit'

const form = ref({})

const formItems: FormItems = [
  { prop: 'name', label: '姓名', compType: 'input' },
  { prop: 'age', label: '年龄', compType: 'input-number', compProps: { min: 0, max: 120 } },
  { prop: 'email', label: '邮箱', compType: 'input', compProps: { type: 'email' } },
  { prop: 'phone', label: '手机号', compType: 'input' },
  { prop: 'address', label: '地址', compType: 'input' },
  { prop: 'city', label: '城市', compType: 'input' },
  { prop: 'province', label: '省份', compType: 'input' },
  { prop: 'postcode', label: '邮编', compType: 'input' },
]

const actionConfig: FormActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: {
    exclude: ['address', 'city', 'province', 'postcode'], // 折叠指定的字段
  },
}
</script>

<template>
  <WForm
    :model="form"
    inline
    label-width="54px"
    :form-items="formItems"
    :action-config="actionConfig"
  />
</template>
```

:::

##### 分栏布局 + 展开/收起功能

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormActionConfig, FormItems, RowProps } from '@iswangh/element-plus-kit'

const form = ref({})

const formItems: FormItems = [
  { prop: 'name', label: '姓名', compType: 'input', colProps: { span: 8 } },
  { prop: 'age', label: '年龄', compType: 'input-number', compProps: { min: 0, max: 120 }, colProps: { span: 8 } },
  { prop: 'email', label: '邮箱', compType: 'input', compProps: { type: 'email' }, colProps: { span: 8 } },
  { prop: 'phone', label: '手机号', compType: 'input', colProps: { span: 8 } },
  { prop: 'gender', label: '性别', compType: 'select', compProps: { options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] }, colProps: { span: 8 } },
  { prop: 'birthday', label: '生日', compType: 'date-picker', compProps: { type: 'date' }, colProps: { span: 8 } },
  { prop: 'address', label: '地址', compType: 'input', colProps: { span: 8 } },
  { prop: 'city', label: '城市', compType: 'input', colProps: { span: 8 } },
  { prop: 'province', label: '省份', compType: 'input', colProps: { span: 8 } },
  { prop: 'postcode', label: '邮编', compType: 'input', colProps: { span: 8 } },
]

const rowProps = {
  gutter: 20,
}

const actionConfig: FormActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: {
    count: 6, // 默认展开前 6 个字段（前两行）
  },
}
</script>

<template>
  <WForm
    :model="form"
    inline
    label-width="54px"
    :form-items="formItems"
    :row-props="rowProps"
    :action-config="actionConfig"
  />
</template>
```

:::

#### 鼠标悬停自动展开

通过 `autoExpandOnHover: true` 启用鼠标悬停自动展开功能。**注意**：此功能仅支持自动展开，不支持自动收起。如果手动点击展开/收起按钮，则会锁定状态，不再受鼠标移入影响。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormActionConfig, FormItems } from '@iswangh/element-plus-kit'

const form = ref({})

const formItems: FormItems = [
  { prop: 'name', label: '姓名', compType: 'input' },
  { prop: 'age', label: '年龄', compType: 'input-number', compProps: { min: 0, max: 120 } },
  { prop: 'email', label: '邮箱', compType: 'input', compProps: { type: 'email' } },
  { prop: 'phone', label: '手机号', compType: 'input' },
  { prop: 'gender', label: '性别', compType: 'select', compProps: { options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] } },
  { prop: 'birthday', label: '生日', compType: 'date-picker', compProps: { type: 'date' } },
  { prop: 'address', label: '地址', compType: 'input' },
  { prop: 'city', label: '城市', compType: 'input' },
]

const actionConfig: FormActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: {
    count: 3,
    autoExpandOnHover: true, // 启用鼠标悬停自动展开
  },
}
</script>

<template>
  <WForm
    :model="form"
    inline
    label-width="54px"
    :form-items="formItems"
    :action-config="actionConfig"
  />
</template>
```

:::

#### 展开/收起自动滚动

通过 `scrollOnToggle: true` 启用展开/收起后自动滚动功能。可以通过 [`scrollIntoViewOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) 配置滚动行为，支持自定义滚动位置（`block`）、滚动方式（`behavior`）等选项。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormActionConfig, FormItems } from '@iswangh/element-plus-kit'

const form = ref({})

const formItems: FormItems = [
  { prop: 'name', label: '姓名', compType: 'input' },
  { prop: 'age', label: '年龄', compType: 'input-number', compProps: { min: 0, max: 120 } },
  { prop: 'email', label: '邮箱', compType: 'input', compProps: { type: 'email' } },
  { prop: 'phone', label: '手机号', compType: 'input' },
  { prop: 'gender', label: '性别', compType: 'select', compProps: { options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] } },
  { prop: 'birthday', label: '生日', compType: 'date-picker', compProps: { type: 'date' } },
  { prop: 'address', label: '地址', compType: 'input' },
  { prop: 'city', label: '城市', compType: 'input' },
]

const actionConfig: FormActionConfig = {
  buttons: ['search', 'reset', 'expand'],
  expand: {
    count: 3,
    scrollOnToggle: true, // 启用展开/收起后自动滚动
    scrollIntoViewOptions: {
      behavior: 'smooth', // 平滑滚动
      block: 'center', // 滚动到中心位置
      inline: 'nearest', // 水平方向最近位置
    },
  },
}
</script>

<template>
  <WForm
    :model="form"
    inline
    label-width="54px"
    :form-items="formItems"
    :action-config="actionConfig"
  />
</template>
```

:::

## Options 配置模式

`options` 支持三种配置模式：静态数组、函数模式、对象模式。不同模式适用于不同的使用场景。

### 静态模式（数组）

直接使用数组配置选项，适用于选项固定的场景。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormItemEventExtendedParams, FormItems } from '@iswangh/element-plus-kit'

const form = ref({})

const formItems: FormItems = [
  {
    prop: 'province',
    label: '省份',
    compType: 'select',
    compProps: {
      // 静态模式：直接使用数组
      options: [
        { label: '北京市', value: '1' },
        { label: '上海市', value: '2' },
        { label: '广东省', value: '3' },
        { label: '浙江省', value: '4' },
      ],
    },
  },
]

const onChange = (extendedParams: FormItemEventExtendedParams, value: any) => {
  console.log('onChange', extendedParams.prop, value)
}
</script>

<template>
  <WForm :model="form" :form-items="formItems" @change="onChange" />
</template>
```

:::

### 函数模式

使用函数动态加载选项，支持同步和异步。函数可以接收 `formData` 参数，也可以不接收参数。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormItemEventExtendedParams, FormItems } from '@iswangh/element-plus-kit'

const form = ref({})

const formItems: FormItems = [
  {
    prop: 'category',
    label: '分类',
    compType: 'select',
    compProps: {
      // 函数模式：动态返回选项数组
      options: () => {
        // 可以在这里进行异步操作或复杂逻辑
        return [
          { label: '电子产品', value: 'electronics' },
          { label: '服装配饰', value: 'clothing' },
          { label: '食品饮料', value: 'food' },
          { label: '图书音像', value: 'books' },
        ]
      },
    },
  },
  {
    prop: 'status',
    label: '状态',
    compType: 'select',
    compProps: {
      // 函数模式：接收 formData 参数
      options: (formData) => {
        // 可以根据表单数据动态返回选项
        const category = formData.category as string | undefined
        if (category === 'electronics')
          return [
            { label: '在售', value: 'on-sale' },
            { label: '缺货', value: 'out-of-stock' },
            { label: '下架', value: 'offline' },
          ]
        return [
          { label: '可用', value: 'available' },
          { label: '不可用', value: 'unavailable' },
        ]
      },
    },
  },
]

const onChange = (extendedParams: FormItemEventExtendedParams, value: any) => {
  console.log('onChange', extendedParams.prop, value)
}
</script>

<template>
  <WForm :model="form" :form-items="formItems" @change="onChange" />
</template>
```

:::

### 对象模式

使用对象配置，支持 `loader`、`deps`、`immediate` 等选项。`loader` 是加载选项的函数，`deps` 用于声明表单字段依赖，`immediate` 控制是否立即加载。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormItemEventExtendedParams, FormItems } from '@iswangh/element-plus-kit'

const form = ref({})

const formItems: FormItems = [
  {
    prop: 'priority',
    label: '优先级',
    compType: 'select',
    compProps: {
      // 对象模式：基础用法
      options: {
        loader: () => {
          // 可以在这里进行异步操作
          return [
            { label: '高', value: 'high' },
            { label: '中', value: 'medium' },
            { label: '低', value: 'low' },
          ]
        },
        immediate: true, // 立即加载
      },
    },
  },
  {
    prop: 'tags',
    label: '标签',
    compType: 'select',
    compProps: {
      // 对象模式：接收 formData 参数，使用 deps 配置表单字段依赖
      options: {
        loader: (formData) => {
          // 可以根据表单数据动态返回选项
          const priority = formData.priority as string | undefined
          if (priority === 'high')
            return [
              { label: '紧急', value: 'urgent' },
              { label: '重要', value: 'important' },
            ]
          return [
            { label: '普通', value: 'normal' },
            { label: '次要', value: 'minor' },
          ]
        },
        deps: ['priority'], // 表单字段依赖：依赖优先级字段
        immediate: true, // 立即加载
      },
    },
  },
]

const onChange = (extendedParams: FormItemEventExtendedParams, value: any) => {
  console.log('onChange', extendedParams.prop, value)
}
</script>

<template>
  <WForm :model="form" :form-items="formItems" @change="onChange" />
</template>
```

:::

## 选项依赖

Options 支持表单字段依赖和外部状态依赖，可以单独使用或组合使用。

### 表单字段依赖

通过 `deps` 配置声明表单字段依赖，当依赖字段变化时自动重新加载选项。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormItemEventExtendedParams, FormItems } from '@iswangh/element-plus-kit'

const form = ref({})

const provinces = [
  { label: '北京市', value: '1' },
  { label: '上海市', value: '2' },
  { label: '广东省', value: '3' },
  { label: '浙江省', value: '4' },
]

const cities: Record<string, any[]> = {
  '1': [
    { label: '北京市', value: '1-1' },
  ],
  '2': [
    { label: '上海市', value: '2-1' },
  ],
  '3': [
    { label: '广州市', value: '3-1' },
    { label: '深圳市', value: '3-2' },
    { label: '珠海市', value: '3-3' },
  ],
  '4': [
    { label: '杭州市', value: '4-1' },
    { label: '宁波市', value: '4-2' },
    { label: '温州市', value: '4-3' },
  ],
}

const districts: Record<string, any[]> = {
  '1-1': [
    { label: '东城区', value: '1-1-1' },
    { label: '西城区', value: '1-1-2' },
  ],
  '2-1': [
    { label: '黄浦区', value: '2-1-1' },
    { label: '徐汇区', value: '2-1-2' },
  ],
  '3-1': [
    { label: '荔湾区', value: '3-1-1' },
    { label: '越秀区', value: '3-1-2' },
  ],
  '3-2': [
    { label: '罗湖区', value: '3-2-1' },
    { label: '福田区', value: '3-2-2' },
  ],
  '3-3': [
    { label: '香洲区', value: '3-3-1' },
    { label: '斗门区', value: '3-3-2' },
  ],
  '4-1': [
    { label: '上城区', value: '4-1-1' },
    { label: '下城区', value: '4-1-2' },
  ],
  '4-2': [
    { label: '海曙区', value: '4-2-1' },
    { label: '江北区', value: '4-2-2' },
  ],
  '4-3': [
    { label: '鹿城区', value: '4-3-1' },
    { label: '龙湾区', value: '4-3-2' },
  ],
}

const formItems: FormItems = [
  {
    prop: 'province',
    label: '省份',
    compType: 'select',
    compProps: {
      options: provinces,
    },
  },
  {
    prop: 'city',
    label: '城市',
    compType: 'select',
    compProps: {
      options: {
        loader: (formData) => {
          const province = formData.province as string | undefined
          if (!province)
            return []
          return cities[province] || []
        },
        deps: ['province'], // 表单字段依赖：依赖省份字段
        immediate: true,
      },
    },
  },
  {
    prop: 'district',
    label: '区县',
    compType: 'select',
    compProps: {
      options: {
        loader: (formData) => {
          const city = formData.city as string | undefined
          if (!city)
            return []
          return districts[city] || []
        },
        deps: ['city'], // 表单字段依赖：依赖城市字段
        immediate: true,
      },
    },
  },
]

const onChange = (extendedParams: FormItemEventExtendedParams, value: any) => {
  console.log('onChange', extendedParams.prop, value)
}
</script>

<template>
  <WForm :model="form" :form-items="formItems" @change="onChange" />
</template>
```

:::

### 外部状态依赖

通过闭包访问外部 ref，`watchEffect` 会自动追踪外部状态变化。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormItemEventExtendedParams, FormItems } from '@iswangh/element-plus-kit'

// 外部状态：用户类型
const userType = ref<'admin' | 'user' | 'guest'>('user')

const form = ref({})

const adminOptions = [
  { label: '系统管理', value: 'system' },
  { label: '用户管理', value: 'user' },
  { label: '权限管理', value: 'permission' },
]

const userOptions = [
  { label: '个人信息', value: 'profile' },
  { label: '我的订单', value: 'orders' },
  { label: '我的收藏', value: 'favorites' },
]

const guestOptions = [
  { label: '登录', value: 'login' },
  { label: '注册', value: 'register' },
]

const formItems: FormItems = [
  {
    prop: 'userType',
    label: '用户类型',
    compType: 'select',
    compProps: {
      options: [
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' },
        { label: '游客', value: 'guest' },
      ],
    },
  },
  {
    prop: 'menu',
    label: '菜单选项',
    compType: 'select',
    compProps: {
      // 函数模式：通过闭包访问外部 ref（外部状态依赖）
      options: () => {
        // 通过闭包访问外部 ref：userType
        if (userType.value === 'admin')
          return adminOptions
        if (userType.value === 'user')
          return userOptions
        return guestOptions
      },
    },
  },
  {
    prop: 'action',
    label: '操作选项',
    compType: 'select',
    compProps: {
      // 函数模式：通过闭包访问外部 ref（外部状态依赖）
      options: () => {
        // 通过闭包访问外部 ref：userType（外部状态依赖，watchEffect 会自动追踪）
        if (userType.value === 'admin')
          return [
            { label: '查看系统日志', value: 'view-logs' },
            { label: '清理缓存', value: 'clear-cache' },
            { label: '添加用户', value: 'add-user' },
            { label: '删除用户', value: 'delete-user' },
          ]
        if (userType.value === 'user')
          return [
            { label: '编辑资料', value: 'edit' },
            { label: '修改密码', value: 'change-password' },
            { label: '查看订单', value: 'view' },
            { label: '取消订单', value: 'cancel' },
          ]
        return [
          { label: '登录', value: 'login' },
          { label: '注册', value: 'register' },
        ]
      },
    },
  },
]

const onChange = (extendedParams: FormItemEventExtendedParams, value: any) => {
  console.log('onChange', extendedParams.prop, value)
}
</script>

<template>
  <div>
    <div style="margin-bottom: 20px; padding: 15px; background-color: #f0f9ff; border-radius: 4px; border: 1px solid #bae6fd;">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
        <strong style="color: #0369a1;">外部状态：</strong>
        <el-tag :type="userType === 'admin' ? 'danger' : userType === 'user' ? 'success' : 'info'" size="default">
          {{ userType === 'admin' ? '管理员' : userType === 'user' ? '普通用户' : '游客' }}
        </el-tag>
        <el-button size="small" type="primary" @click="userType = userType === 'admin' ? 'user' : userType === 'user' ? 'guest' : 'admin'">
          切换用户类型
        </el-button>
      </div>
      <div style="color: #666; font-size: 13px; line-height: 1.5;">
        💡 切换用户类型后，菜单选项和操作选项会根据外部状态自动更新（通过 watchEffect 自动追踪）
      </div>
    </div>
    <WForm :model="form" :form-items="formItems" @change="onChange" />
  </div>
</template>
```

:::

### 组合依赖（表单字段 + 外部状态）

同时使用表单字段依赖（`deps` 配置）和外部状态依赖（闭包访问），适用于复杂的依赖场景。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormItemEventExtendedParams, FormItems } from '@iswangh/element-plus-kit'

// 外部状态：用户权限级别
const permissionLevel = ref<'admin' | 'manager' | 'user'>('user')

const form = ref({})

const departments = [
  { label: '技术部', value: 'tech' },
  { label: '产品部', value: 'product' },
  { label: '运营部', value: 'operation' },
  { label: '市场部', value: 'marketing' },
]

const techRoles = [
  { label: '前端开发', value: 'frontend' },
  { label: '后端开发', value: 'backend' },
  { label: '全栈开发', value: 'fullstack' },
  { label: '架构师', value: 'architect' },
]

const productRoles = [
  { label: '产品经理', value: 'pm' },
  { label: '产品助理', value: 'pa' },
  { label: '产品设计师', value: 'designer' },
]

const operationRoles = [
  { label: '运营专员', value: 'specialist' },
  { label: '运营经理', value: 'manager' },
  { label: '数据分析师', value: 'analyst' },
]

const marketingRoles = [
  { label: '市场专员', value: 'specialist' },
  { label: '市场经理', value: 'manager' },
  { label: '品牌经理', value: 'brand' },
]

// 根据权限级别和部门返回不同的功能选项
function getFeaturesByPermissionAndDept(permission: string, dept: string) {
  const features: Record<string, Record<string, any[]>> = {
    admin: {
      tech: [
        { label: '系统配置', value: 'system-config' },
        { label: '用户管理', value: 'user-management' },
        { label: '代码审查', value: 'code-review' },
        { label: '部署管理', value: 'deploy' },
      ],
      product: [
        { label: '产品规划', value: 'planning' },
        { label: '需求管理', value: 'requirements' },
        { label: '数据分析', value: 'analytics' },
        { label: '用户反馈', value: 'feedback' },
      ],
      operation: [
        { label: '数据统计', value: 'statistics' },
        { label: '活动管理', value: 'activities' },
        { label: '用户运营', value: 'user-operation' },
        { label: '内容管理', value: 'content' },
      ],
      marketing: [
        { label: '营销活动', value: 'campaigns' },
        { label: '品牌推广', value: 'branding' },
        { label: '渠道管理', value: 'channels' },
        { label: '数据分析', value: 'analytics' },
      ],
    },
    manager: {
      tech: [
        { label: '代码审查', value: 'code-review' },
        { label: '任务分配', value: 'task-assign' },
        { label: '进度管理', value: 'progress' },
      ],
      product: [
        { label: '需求管理', value: 'requirements' },
        { label: '数据分析', value: 'analytics' },
        { label: '用户反馈', value: 'feedback' },
      ],
      operation: [
        { label: '活动管理', value: 'activities' },
        { label: '用户运营', value: 'user-operation' },
        { label: '数据统计', value: 'statistics' },
      ],
      marketing: [
        { label: '营销活动', value: 'campaigns' },
        { label: '渠道管理', value: 'channels' },
        { label: '数据分析', value: 'analytics' },
      ],
    },
    user: {
      tech: [
        { label: '代码提交', value: 'commit' },
        { label: '任务查看', value: 'view-tasks' },
      ],
      product: [
        { label: '需求查看', value: 'view-requirements' },
        { label: '反馈提交', value: 'submit-feedback' },
      ],
      operation: [
        { label: '活动查看', value: 'view-activities' },
        { label: '数据查看', value: 'view-data' },
      ],
      marketing: [
        { label: '活动查看', value: 'view-campaigns' },
        { label: '数据查看', value: 'view-data' },
      ],
    },
  }

  return features[permission]?.[dept] || []
}

const formItems: FormItems = [
  {
    prop: 'department',
    label: '部门',
    compType: 'select',
    compProps: {
      options: departments,
    },
  },
  {
    prop: 'role',
    label: '角色',
    compType: 'select',
    compProps: {
      // 对象模式：依赖部门字段（表单字段依赖）
      options: {
        loader: (formData) => {
          const dept = formData.department as string | undefined
          if (!dept)
            return []

          if (dept === 'tech')
            return techRoles
          if (dept === 'product')
            return productRoles
          if (dept === 'operation')
            return operationRoles
          if (dept === 'marketing')
            return marketingRoles

          return []
        },
        deps: ['department'], // 表单字段依赖：依赖部门字段
        immediate: true,
      },
    },
  },
  {
    prop: 'features',
    label: '功能权限',
    compType: 'select',
    compProps: {
      // 对象模式：同时依赖外部状态（permissionLevel）和表单字段（department, role）
      // 注意：配置了 deps 后，表单字段依赖通过 watch 监听，外部状态依赖通过 watchEffect 追踪（在 loader 中访问）
      options: {
        loader: (formData) => {
          const dept = formData.department as string | undefined
          const role = formData.role as string | undefined

          if (!dept || !role)
            return []

          // 通过闭包访问外部 ref：permissionLevel（外部状态依赖，watchEffect 会自动追踪）
          // 通过 formData 访问表单字段：department, role（表单字段依赖，通过 deps 配置）
          return getFeaturesByPermissionAndDept(permissionLevel.value, dept)
        },
        // 配置表单字段依赖：依赖部门和角色字段（表单字段依赖变化时触发）
        // 外部状态依赖（permissionLevel）通过闭包访问，watchEffect 会自动追踪
        deps: ['department', 'role'],
        immediate: true,
      },
    },
  },
]

const onChange = (extendedParams: FormItemEventExtendedParams, value: any) => {
  console.log('onChange', extendedParams.prop, value)
}
</script>

<template>
  <div>
    <div style="margin-bottom: 20px; padding: 15px; background-color: #f0f9ff; border-radius: 4px; border: 1px solid #bae6fd;">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
        <strong style="color: #0369a1;">外部状态（权限级别）：</strong>
        <el-tag :type="permissionLevel === 'admin' ? 'danger' : permissionLevel === 'manager' ? 'warning' : 'success'" size="default">
          {{ permissionLevel === 'admin' ? '管理员' : permissionLevel === 'manager' ? '经理' : '普通用户' }}
        </el-tag>
        <el-button size="small" type="primary" @click="permissionLevel = permissionLevel === 'admin' ? 'manager' : permissionLevel === 'manager' ? 'user' : 'admin'">
          切换权限级别
        </el-button>
      </div>
      <div style="color: #666; font-size: 13px; line-height: 1.5;">
        💡 切换权限级别后，功能权限选项会根据权限级别（外部状态依赖）、部门和角色（表单字段依赖）动态更新
      </div>
    </div>
    <WForm :model="form" :form-items="formItems" @change="onChange" />
  </div>
</template>
```

:::

## API

### Attributes

支持 [`ElForm`](https://element-plus.org/zh-CN/component/form#form-attributes) 所有的属性。

**拓展属性**：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| formItems | 表单项配置数组，详见 [FormItem 配置](#formitem-配置) | `FormItems` | `[]` |
| rowProps | 行布局属性，详见 [rowProps 配置](#rowprops-配置) | `RowProps` | `{}` |
| actionConfig | 操作按钮配置，详见 [actionConfig 配置](#actionconfig-配置) | `FormActionConfig` | `{}` |
| expanded | 展开/折叠状态（双向绑定，仅在 `inline` 模式下且 `actionConfig.buttons` 包含 `'expand'` 时可用） | `boolean` | `false` |

#### FormItem 配置

`formItems` 数组中每一项的配置类型。

##### 基础配置

支持 [`ElFormItem`](https://element-plus.org/zh-CN/component/form#formitem-api) 所有的属性。

**拓展属性**：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| prop | 表单字段名（必填） | `string` | - |
| compType | 组件类型（必填） | `FormItemComp` | - |
| compProps | 组件属性配置，根据组件类型自动推断。<br>对于支持 options 的组件（如 select、cascader、radio、checkbox 等），`compProps.options` 支持三种模式：<br>1. 静态数组：`options: [{ label: '选项1', value: '1' }]`<br>2. 函数模式：`options: (formData) => [{ label: '选项1', value: '1' }]`<br>3. 对象模式：`options: { loader: (formData) => [...], deps: ['field1'], immediate: true }`<br><br>`compProps` 还支持：<br>- `compProps.slots`：动态组件插槽配置（如 `prefix`、`suffix` 等），使用 `h()` 函数创建 VNode<br><br>详见 [Options 配置](#options-配置) 和 [可配置化](#可配置化) | `FormItemCompProps<C>` | - |
| slots | FormItem 插槽配置，用于自定义 `el-form-item` 的插槽（如 `label`、`error` 等），使用 `h()` 函数创建 VNode。详见 [可配置化 - 插槽](#插槽) | `FormItemSlotsConfig` | - |
| vIf | 条件渲染（v-if），支持布尔值或接收表单数据的函数。函数可以依赖表单内部值或外部状态 | `boolean \| ((data: Record<string, any>) => boolean)` | `true` |
| vShow | 显示/隐藏（v-show），支持布尔值或接收表单数据的函数。函数可以依赖表单内部值或外部状态 | `boolean \| ((data: Record<string, any>) => boolean)` | `true` |
| colProps | 列布局属性，详见 [`ElCol`](https://element-plus.org/zh-CN/component/layout#col-attributes) 组件属性 | `ColProps` | - |

##### 支持的组件类型

`compType` 字段支持以下组件类型：

| 组件类型 | 说明 | 默认值 | 文档链接 |
| --- | --- | --- | --- |
| `input` | 输入框（支持 `type: 'textarea'` 实现文本域） | `{ placeholder: '请输入${label}'（动态），clearable: true }` | [Element Plus Input](https://element-plus.org/zh-CN/component/input.html) |
| `input-number` | 数字输入框 | `{ placeholder: '请输入', clearable: true }` | [Element Plus InputNumber](https://element-plus.org/zh-CN/component/input-number.html) |
| `input-tag` | 标签输入 | `{ placeholder: '请输入${label}'（动态），clearable: true }` | [Element Plus InputTag](https://element-plus.org/zh-CN/component/input-tag.html) |
| `select` | 选择器 | `{ placeholder: '请选择${label}'（动态），clearable: true, filterable: true }` | [Element Plus Select](https://element-plus.org/zh-CN/component/select.html) |
| `select-v2` | 虚拟列表选择器 | `{ placeholder: '请选择${label}'（动态），clearable: true, filterable: true }` | [Element Plus SelectV2](https://element-plus.org/zh-CN/component/select-v2.html) |
| `autocomplete` | 自动完成 | `{ placeholder: '请输入${label}'（动态），clearable: true }` | [Element Plus Autocomplete](https://element-plus.org/zh-CN/component/autocomplete.html) |
| `cascader` | 级联选择器 | `{ placeholder: '请选择${label}'（动态），clearable: true, filterable: true }` | [Element Plus Cascader](https://element-plus.org/zh-CN/component/cascader.html) |
| `tree-select` | 树形选择器 | `{ placeholder: '请选择${label}'（动态），clearable: true, filterable: true }` | [Element Plus TreeSelect](https://element-plus.org/zh-CN/component/tree-select.html) |
| `date-picker` | 日期选择器 | `{ placeholder: '请选择${label}'（动态），clearable: true }` | [Element Plus DatePicker](https://element-plus.org/zh-CN/component/date-picker.html) |
| `date-picker-panel` | 日期选择面板 | - | [Element Plus DatePickerPanel](https://element-plus.org/zh-CN/component/date-picker.html#date-picker-panel-%E6%97%A5%E6%9C%9F%E9%80%89%E6%8B%A9%E9%9D%A2%E6%9D%BF) |
| `time-picker` | 时间选择器 | `{ placeholder: '请选择${label}'（动态），clearable: true }` | [Element Plus TimePicker](https://element-plus.org/zh-CN/component/time-picker.html) |
| `time-select` | 时间选择 | `{ placeholder: '请选择${label}'（动态），clearable: true }` | [Element Plus TimeSelect](https://element-plus.org/zh-CN/component/time-select.html) |
| `switch` | 开关 | - | [Element Plus Switch](https://element-plus.org/zh-CN/component/switch.html) |
| `radio` | 单选框（配合 `options` 属性，实际渲染 [`ElRadioGroup`](https://element-plus.org/zh-CN/component/radio#options-%E5%B1%9E%E6%80%A7)） | - | [Element Plus Radio](https://element-plus.org/zh-CN/component/radio.html) |
| `checkbox` | 复选框（配合 `options` 属性，实际渲染 [`ElCheckboxGroup`](https://element-plus.org/zh-CN/component/checkbox#options-%E5%B1%9E%E6%80%A7)） | - | [Element Plus Checkbox](https://element-plus.org/zh-CN/component/checkbox.html) |
| `rate` | 评分 | - | [Element Plus Rate](https://element-plus.org/zh-CN/component/rate.html) |
| `slider` | 滑块 | - | [Element Plus Slider](https://element-plus.org/zh-CN/component/slider.html) |
| `color-picker` | 颜色选择器 | - | [Element Plus ColorPicker](https://element-plus.org/zh-CN/component/color-picker.html) |
| `color-picker-panel` | 颜色选择面板 | - | [Element Plus ColorPickerPanel](https://element-plus.org/zh-CN/component/color-picker.html#color-picker-panel-%E9%A2%9C%E8%89%B2%E9%80%89%E6%8B%A9%E9%9D%A2%E6%9D%BF) |
| `transfer` | 穿梭框 | - | [Element Plus Transfer](https://element-plus.org/zh-CN/component/transfer.html) |
| `mention` | 提及 | `{ placeholder: '请输入${label}'（动态），clearable: true }` | [Element Plus Mention](https://element-plus.org/zh-CN/component/mention.html) |
| `custom` | 自定义组件（通过插槽实现） | - | - |

##### Options 配置

`compProps.options` 支持三种配置模式，适用于不同的使用场景。

| 模式 | 类型 | 说明 |
| --- | --- | --- |
| **静态** | `any[]` | 直接使用数组配置选项，适用于选项固定的场景 |
| **函数** | `(formData: Record<string, any>) => any[] \| Promise<any[]>` | 支持同步和异步函数，通过闭包访问外部依赖（包括 `form` ref），执行时机为**初始化**和**依赖变更** |
| **对象** | `OptionsConfig` | 通过 `loader`、`immediate`、`deps` 配置选项加载行为 |

**对象模式配置项**：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `loader` | 选项加载器函数，支持同步和异步 | `(formData: Record<string, any>) => any[] \| Promise<any[]>` | - |
| `immediate` | 是否立即加载 | `boolean` | `false` |
| `deps` | 表单字段依赖列表 | `string[]` | `[]` |

#### rowProps 配置

支持 [`ElRow`](https://element-plus.org/zh-CN/component/layout#row-attributes) 所有的属性。

**拓展属性**：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| span | 默认列数（用于 `colProps.span` 的默认值） | `number` | - |

#### actionConfig 配置

`actionConfig` 用于自定义表单底部的操作按钮。

**拓展属性**：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| vIf | 是否显示操作区域（支持函数动态判断） | `boolean \| ((data?: Record<string, any>) => boolean)` | `inline` 为 `true` 时默认为 `true`，`inline` 为 `false` 时默认为 `false` |
| vShow | 显示/隐藏操作区域（支持函数动态判断，使用 v-show） | `boolean \| ((data?: Record<string, any>) => boolean)` | `true` |
| buttons | 按钮列表，详见 [buttons 配置](#buttons-配置) | `FormActionButtons[]` | `inline` 为 `true` 时默认为 `['search', 'reset']`，`inline` 为 `false` 时默认为 `['submit', 'cancel']` |
| expand | 默认展开规则（仅在 `buttons` 包含 `'expand'` 时生效），详见 [expand 配置](#expand-配置) | `FormExpandRule` | - |

##### buttons 配置

`buttons` 支持预设按钮字符串或自定义按钮对象。

**预设按钮**：

| 按钮类型 | 说明 | 默认样式 |
| --- | --- | --- |
| `'submit'` | 确认按钮 | 主要按钮（`type: 'primary'`） |
| `'reset'` | 重置按钮 | 默认按钮（带刷新图标） |
| `'search'` | 搜索按钮 | 主要按钮（`type: 'primary'`，带搜索图标） |
| `'cancel'` | 取消按钮 | 默认按钮 |
| `'expand'` | 展开/折叠按钮 | 文本按钮（`type: 'text'`，仅在 `inline` 模式下可用） |

**自定义按钮**：

支持 [`ElButton`](https://element-plus.org/zh-CN/component/button.html#button-attributes) 所有的属性。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `eventName` | 事件名称（必填） | `string` | - |
| `label` | 按钮文字 | `string` | - |

##### expand 配置

`expand` 用于配置展开/折叠规则，支持三种配置方式：

| 配置方式 | 说明 | 类型 | 示例 |
| --- | --- | --- | --- |
| count | 按字段数量展开（从第一个开始） | `{ count: number } & FormExpandRuleBase` | `{ count: 3 }` |
| include | 指定展示的字段（白名单，字段 prop 数组） | `{ include: string[] } & FormExpandRuleBase` | `{ include: ['field1', 'field2'] }` |
| exclude | 指定折叠的字段（黑名单，字段 prop 数组） | `{ exclude: string[] } & FormExpandRuleBase` | `{ exclude: ['field3', 'field4'] }` |

**配置优先级**：`exclude` > `include` > `count`

**FormExpandRuleBase 基础配置**：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| autoExpandOnHover | 是否启用鼠标悬停自动展开功能 | `boolean` | `false` |
| scrollOnToggle | 是否在展开/收起后自动滚动到表单中心 | `boolean` | `false` |
| scrollIntoViewOptions | 自定义滚动选项（仅在 `scrollOnToggle` 为 `true` 时生效），详见 [`scrollIntoViewOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) 文档 | `ScrollIntoViewOptions` | `{ behavior: 'smooth', block: 'center', inline: 'nearest' }` |

### Events

支持 [`ElForm`](https://element-plus.org/zh-CN/component/form.html#form-events) 所有的事件。

**拓展事件**：

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| change | 表单项值变化事件 | `<T extends Record<string, any>, K extends keyof T>(extendedParams: FormItemEventExtendedParams, value: T[K]) => void` |
| action | 操作按钮点击事件 | `(eventName: string, data?: unknown) => void` |
| search | 搜索按钮点击事件 | `() => void` |
| reset | 重置按钮点击事件 | `(resetData: Record<string, unknown>) => void` |
| submit | 提交按钮点击事件 | `() => void` |
| cancel | 取消按钮点击事件 | `() => void` |
| expand | 展开状态变化事件 | `(value: boolean) => void` |
| `@{EventName}` | 动态组件事件（如 `@input`、`@focus`、`@blur` 等） | `(extendedParams: FormItemEventExtendedParams, ...args: any[]) => void` |

**注意**：
- 动态组件的事件（例如 `change`、`input`、`focus`、`blur` 等）的第一个参数固定为 `extendedParams`（包含 `prop`、`index`、`formItem`），后续参数为原始事件参数
- 预设事件（`@submit`、`@cancel`、`@search`、`@reset`、`@expand`）是为了方便使用而提供的。当点击这些预设按钮时，组件会先触发对应的事件，然后还会统一触发一次 `@action` 事件
- **不建议同时监听 `@action` 和预设事件**，因为会导致重复处理。如果必须混用，则不能在 `@action` 事件中处理 `eventName` 为这 5 个预设按钮名称（`submit`、`cancel`、`search`、`reset`、`expand`）的逻辑

### Slots

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| `{prop}` | 自定义组件插槽，当 `compType` 为 `custom` 时使用 | `FormItemSlotScope` |
| `form-item-{prop}` | 表单项插槽，用于自定义表单项内容 | `FormItemSlotScope` |
| `{prop}-{slotName}` | 动态组件插槽，如 `username-prefix`、`email-suffix` | `FormItemSlotScope` |
| `action` | 自定义操作按钮区域 | - |

**插槽作用域参数 `FormItemSlotScope`**：

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| `value` | 当前表单项组件的值 | `any` |
| `form` | 表单数据对象 | `Record<string, any>` |
| `formItem` | 表单项配置对象 | `FormItem` |

### Methods

支持 [`ElForm`](https://element-plus.org/zh-CN/component/form.html#form-methods) 所有的方法。

**拓展方法**：

| 方法名 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `expanded` | 获取当前展开状态（getter） | - | `boolean` |
| `toggleExpand` | 切换或设置展开/折叠状态 | `(value?: boolean)` | - |
