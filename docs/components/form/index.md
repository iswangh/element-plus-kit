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
  vIf: true, // 当 inline 为 false 时，必须设置为 true，按钮才会显示（当 inline 为 true 时，默认 vIf 为 true）
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
}
</script>

<template>
  <WForm
    :model="form"
    :form-items="formItems"
    :action-config="actionConfig"
    @action="onAction"
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
  vIf: true, // 当 inline 为 false 时，必须设置为 true，按钮才会显示（当 inline 为 true 时，默认 vIf 为 true）
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
  // 所有按钮点击都会触发 action 事件
  console.log('按钮事件:', eventName)
}
</script>

<template>
  <WForm
    :model="form"
    :form-items="formItems"
    :action-config="actionConfig"
    @action="onAction"
  />
</template>
```

:::

## 布局配置

通过 `inline` 属性和 `rowAttrs`、`colAttrs` 配置表单布局。

**布局逻辑说明**：
- 当 `inline` 为 `true` 时，使用 `ElRow` 和 `ElCol` 进行布局
- 当 `inline` 为 `false`（默认）时：
  - 如果 `rowAttrs` 对象中有配置项（如 `gutter`、`span` 等），会使用 `ElRow` 和 `ElCol` 进行布局
  - 如果 `rowAttrs` 没有配置，即使 `formItem` 的 `colAttrs` 有值，也不会使用 `ElCol`，而是使用普通的 `div` 布局
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

## Options 配置模式

`options` 支持三种配置模式：静态数组、函数模式、对象模式。不同模式适用于不同的使用场景。

### 静态模式（数组）

直接使用数组配置选项，适用于选项固定的场景。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormItems } from '@iswangh/element-plus-kit'

const form = ref({})

const formItems: FormItems = [
  {
    prop: 'province',
    label: '省份',
    comp: 'select',
    compAttrs: {
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

const onChange = (extendedParams: any, value: any) => {
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
import type { FormItems } from '@iswangh/element-plus-kit'

const form = ref({})

const formItems: FormItems = [
  {
    prop: 'category',
    label: '分类',
    comp: 'select',
    compAttrs: {
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
    comp: 'select',
    compAttrs: {
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

const onChange = (extendedParams: any, value: any) => {
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

**自动清理逻辑说明**：
- 当依赖字段变化导致选项更新时，组件会**智能检查**当前值是否在新的选项中
- **如果当前值在新的选项中存在**：保留当前值，**不会自动清理**（支持用户在 `change` 事件中设置的默认值）
- **如果当前值在新的选项中不存在**：自动清理当前值并触发 `change` 事件
- **如果需要强制清理**：即使当前值在新的选项中存在，也需要手动清理（如 `form.value.tags = undefined`）

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormItems } from '@iswangh/element-plus-kit'

const form = ref({})

const formItems: FormItems = [
  {
    prop: 'priority',
    label: '优先级',
    comp: 'select',
    compAttrs: {
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
    comp: 'select',
    compAttrs: {
      // 对象模式：接收 formData 参数，使用 deps 配置表单字段依赖
      // 注意：当优先级变化时，如果标签的当前值（如 'normal' 或 'minor'）在新的选项中存在，
      // 组件会保留该值，不会自动清理。如果需要强制清理，需要手动设置 form.value.tags = undefined
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

const onChange = (extendedParams: any, value: any) => {
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
import type { FormItems } from '@iswangh/element-plus-kit'

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
    comp: 'select',
    compAttrs: {
      options: provinces,
    },
  },
  {
    prop: 'city',
    label: '城市',
    comp: 'select',
    compAttrs: {
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
    comp: 'select',
    compAttrs: {
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

const onChange = (extendedParams: any, value: any) => {
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
import type { FormItems } from '@iswangh/element-plus-kit'

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
    comp: 'select',
    compAttrs: {
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
    comp: 'select',
    compAttrs: {
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
    comp: 'select',
    compAttrs: {
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

const onChange = (extendedParams: any, value: any) => {
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
import type { FormItems } from '@iswangh/element-plus-kit'

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
    comp: 'select',
    compAttrs: {
      options: departments,
    },
  },
  {
    prop: 'role',
    label: '角色',
    comp: 'select',
    compAttrs: {
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
    comp: 'select',
    compAttrs: {
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

const onChange = (extendedParams: any, value: any) => {
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
  vIf?: boolean | ((data: Record<string, any>) => boolean)
  /** 显示/隐藏（v-show），支持布尔值或接收表单数据的函数，可以依赖外部值 */
  vShow?: boolean | ((data: Record<string, any>) => boolean)
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

##### Options 配置

`compAttrs.options` 支持三种配置模式，适用于不同的使用场景。

| 模式 | 配置方式 | 类型 | 说明 |
| --- | --- | --- | --- |
| **静态模式** | 数组 | `any[]` | 直接使用数组配置选项，适用于选项固定的场景 |
| **函数模式** | 函数 | `Function` | 支持同步和异步函数，通过闭包访问外部依赖（包括 `form` ref），执行时机为**初始化**和**依赖变更** |
| **对象模式** | 对象 | `Object` | 通过 `loader`、`immediate`、`deps` 配置选项加载行为 |

**对象模式配置项**：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `loader` | 选项加载器函数，支持同步和异步 | `Function` | - |
| `immediate` | 是否立即加载 | `boolean` | `false` |
| `deps` | 表单字段依赖列表 | `string[]` | `[]` |

**函数模式说明**：
- 支持同步和异步函数，函数签名：`(formData?: Record<string, any>) => any[] | Promise<any[]>`
- 通过闭包访问外部依赖（包括 `form` ref），`watchEffect` 会自动追踪依赖变化
- 可以将 `form` 看作外部依赖，通过 `form.value.xxx` 访问表单字段
- 执行时机：**初始化**（`watchEffect` 首次执行）和**依赖变更**（函数内部访问的响应式数据变化时）

**对象模式说明**：
- `loader`：选项加载器函数，支持同步和异步，函数签名：`(formData: Record<string, any>) => any[] | Promise<any[]>`
- `immediate`：控制是否立即加载，默认值为 `false`（不立即加载）
- `deps`：声明表单字段依赖，当依赖字段变化时自动重新加载选项
- `loader` 执行时机受 `immediate` 和 `deps` 控制：
  - 如果配置了 `deps`：通过 `watch` 监听依赖变化，`immediate` 控制是否立即执行
  - 如果没有 `deps`：通过 `watchEffect` 追踪外部依赖（闭包访问），`immediate` 控制是否立即执行

**依赖变更特别注意**：
- 当依赖字段变化导致选项更新时，组件会**智能检查**当前值是否在新的选项中
- **如果当前值在新的选项中存在**：保留当前值，**不会自动清理**（支持用户在 `change` 事件中设置的默认值）
- **如果当前值在新的选项中不存在**：自动清理当前值并触发 `change` 事件
- **如果需要强制清理**：即使当前值在新的选项中存在，也需要手动清理（如 `form.value.tags = undefined`）

**三种模式说明**：

1. **静态模式（数组）**
   - 直接使用数组配置选项
   - 适用于选项固定的场景
   - 示例：`options: [{ label: '选项1', value: '1' }]`

:::demo 静态模式示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormItems } from '@iswangh/element-plus-kit'

const form = ref({})

const formItems: FormItems = [
  {
    prop: 'priority',
    label: '优先级',
    comp: 'select',
    compAttrs: {
      // 静态模式：直接使用数组配置选项
      options: [
        { label: '高', value: 'high' },
        { label: '中', value: 'medium' },
        { label: '低', value: 'low' },
      ],
    },
  },
  {
    prop: 'status',
    label: '状态',
    comp: 'select',
    compAttrs: {
      // 静态模式：选项固定的场景
      options: [
        { label: '待处理', value: 'pending' },
        { label: '进行中', value: 'processing' },
        { label: '已完成', value: 'completed' },
      ],
    },
  },
]
</script>

<template>
  <WForm :model="form" :form-items="formItems" />
  <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded">
    <h3 class="text-sm font-semibold mb-2">表单数据：</h3>
    <pre class="text-xs">{{ JSON.stringify(form, null, 2) }}</pre>
  </div>
</template>
```

:::

2. **函数模式**
   - 支持同步和异步函数
   - 通过闭包访问外部依赖（包括 `form` ref），`watchEffect` 会自动追踪依赖变化
   - 可以将 `form` 看作外部依赖，通过 `form.value.xxx` 访问表单字段
   - 执行时机：**初始化**（`watchEffect` 首次执行）和**依赖变更**（函数内部访问的响应式数据变化时）
   - **等价于对象模式**：`{ loader: () => [], immediate: true }`（注意：对象模式默认 `immediate: false`，需要显式设置 `immediate: true` 才能达到函数模式的立即加载效果）
   - 示例：
     ```typescript
     options: () => {
       // 通过闭包访问外部 ref，watchEffect 会自动追踪
       return userType.value === 'admin' ? adminOptions : userOptions
     }
     ```

:::demo 函数模式示例（外部依赖）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormItems } from '@iswangh/element-plus-kit'

// 外部状态：用户类型
const userType = ref<'admin' | 'user' | 'guest'>('user')

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

const form = ref({})

const formItems: FormItems = [
  {
    prop: 'userType',
    label: '用户类型',
    comp: 'select',
    compAttrs: {
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
    comp: 'select',
    compAttrs: {
      // 函数模式：通过闭包访问外部 ref（外部依赖）
      // watchEffect 会自动追踪 userType 的变化
      options: () => {
        if (userType.value === 'admin')
          return adminOptions
        if (userType.value === 'user')
          return userOptions
        return guestOptions
      },
    },
  },
]

// 当用户类型字段变化时，同步更新外部状态
const onChange = (extendedParams: any, value: any) => {
  if (extendedParams.prop === 'userType')
    userType.value = value as 'admin' | 'user' | 'guest'
}
</script>

<template>
  <div>
    <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded flex items-center gap-3">
      <strong>外部状态：</strong>
      <el-tag :type="userType === 'admin' ? 'danger' : userType === 'user' ? 'success' : 'info'">
        {{ userType === 'admin' ? '管理员' : userType === 'user' ? '普通用户' : '游客' }}
      </el-tag>
      <el-button size="small" @click="userType = userType === 'admin' ? 'user' : userType === 'user' ? 'guest' : 'admin'">
        切换用户类型
      </el-button>
      <span class="text-xs text-gray-600 dark:text-gray-400">切换后，菜单选项会自动更新</span>
    </div>
    <WForm :model="form" :form-items="formItems" @change="onChange" />
    <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded">
      <h3 class="text-sm font-semibold mb-2">表单数据：</h3>
      <pre class="text-xs">{{ JSON.stringify(form, null, 2) }}</pre>
    </div>
  </div>
</template>
```

:::

3. **对象模式**
   - `loader`：选项加载器函数，支持同步和异步
   - `immediate`：控制是否立即加载，默认值为 `false`（不立即加载）
   - `deps`：声明表单字段依赖，当依赖字段变化时自动重新加载选项，默认值为 `[]`（空数组，不依赖表单字段）
   - `loader` 执行时机受 `immediate` 和 `deps` 控制：
     - 如果配置了 `deps`：通过 `watch` 监听依赖变化，`immediate` 控制是否立即执行
     - 如果没有 `deps`：通过 `watchEffect` 追踪外部依赖（闭包访问），`immediate` 控制是否立即执行
   - 适用于需要声明表单字段依赖的场景
   - 示例：
     ```typescript
     options: {
       loader: (formData) => {
         // 可以通过 formData 访问表单字段（内部依赖）
         // 可以通过闭包访问外部 ref（外部依赖，watchEffect 会自动追踪）
         return getOptionsByFormData(formData)
       },
       deps: ['field1', 'field2'],  // 表单字段依赖（可选）
       immediate: true,              // 立即加载（可选，默认 false，需显式设置）
     }
     ```

:::demo 对象模式示例（基础用法）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormItems } from '@iswangh/element-plus-kit'

const form = ref({})

const formItems: FormItems = [
  {
    prop: 'priority',
    label: '优先级',
    comp: 'select',
    compAttrs: {
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
        immediate: true, // 立即加载（需显式设置，默认 false）
      },
    },
  },
]
</script>

<template>
  <WForm :model="form" :form-items="formItems" />
  <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded">
    <h3 class="text-sm font-semibold mb-2">表单数据：</h3>
    <pre class="text-xs">{{ JSON.stringify(form, null, 2) }}</pre>
  </div>
</template>
```

:::

**依赖说明**：

- **表单字段依赖**：通过 `deps` 配置声明，当依赖字段变化时自动重新加载选项
- **外部状态依赖**：通过闭包访问外部 ref，`watchEffect` 会自动追踪外部状态变化
- **组合依赖**：可以同时使用表单字段依赖和外部状态依赖

:::demo 对象模式示例（内部依赖 - deps 配置）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormItems } from '@iswangh/element-plus-kit'

// 模拟数据
const provinces = [
  { label: '北京市', value: '1' },
  { label: '上海市', value: '2' },
  { label: '广东省', value: '3' },
  { label: '浙江省', value: '4' },
]

const cities = [
  { label: '北京市', value: '1-1' },
  { label: '上海市', value: '2-1' },
  { label: '广州市', value: '3-1' },
  { label: '深圳市', value: '3-2' },
  { label: '珠海市', value: '3-3' },
  { label: '杭州市', value: '4-1' },
  { label: '宁波市', value: '4-2' },
  { label: '温州市', value: '4-3' },
]

const districts = [
  { label: '东城区', value: '1-1-1' },
  { label: '西城区', value: '1-1-2' },
  { label: '黄浦区', value: '2-1-1' },
  { label: '徐汇区', value: '2-1-2' },
  { label: '荔湾区', value: '3-1-1' },
  { label: '越秀区', value: '3-1-2' },
  { label: '罗湖区', value: '3-2-1' },
  { label: '福田区', value: '3-2-2' },
  { label: '香洲区', value: '3-3-1' },
  { label: '斗门区', value: '3-3-2' },
  { label: '上城区', value: '4-1-1' },
  { label: '下城区', value: '4-1-2' },
  { label: '海曙区', value: '4-2-1' },
  { label: '江北区', value: '4-2-2' },
  { label: '鹿城区', value: '4-3-1' },
  { label: '龙湾区', value: '4-3-2' },
]

const form = ref({})

const formItems: FormItems = [
  {
    prop: 'province',
    label: '省份',
    comp: 'select',
    compAttrs: {
      // 静态模式：数组
      options: provinces,
    },
  },
  {
    prop: 'city',
    label: '城市',
    comp: 'select',
    compAttrs: {
      // 对象模式：使用 deps 配置内部依赖
      options: {
        loader: (formData) => {
          const province = formData.province as string | undefined
          if (!province)
            return []
          // value 格式：省份-城市，通过 value 前缀匹配
          return cities.filter(city => city.value.startsWith(`${province}-`))
        },
        deps: ['province'], // 内部依赖：依赖省份字段
        immediate: true,
      },
    },
  },
  {
    prop: 'district',
    label: '区县',
    comp: 'select',
    compAttrs: {
      // 对象模式：依赖省市，使用 deps 配置内部依赖
      options: {
        loader: (formData) => {
          const city = formData.city as string | undefined
          if (!city)
            return []
          // value 格式：省份-城市-区县，通过 value 前缀匹配
          return districts.filter(district => district.value.startsWith(`${city}-`))
        },
        immediate: true,
        deps: ['province', 'city'], // 内部依赖：依赖省市字段
      },
    },
  },
]
</script>

<template>
  <div>
    <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
      省份：静态模式（数组） | 城市：对象模式（deps: ['province']） | 区县：对象模式（deps: ['province', 'city']）
    </p>
    <WForm :model="form" :form-items="formItems" />
    <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded">
      <h3 class="text-sm font-semibold mb-2">表单数据：</h3>
      <pre class="text-xs">{{ JSON.stringify(form, null, 2) }}</pre>
    </div>
  </div>
</template>
```

:::

:::demo 对象模式示例（混合依赖 - 内部 + 外部）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormItems } from '@iswangh/element-plus-kit'

// 外部状态：用户权限级别
const permissionLevel = ref<'admin' | 'manager' | 'user'>('user')

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

// 根据权限级别和部门返回不同的功能选项
function getFeaturesByPermissionAndDept(permission: string, dept: string) {
  const features: Record<string, Record<string, any[]>> = {
    admin: {
      tech: [
        { label: '系统配置', value: 'system-config' },
        { label: '用户管理', value: 'user-management' },
        { label: '代码审查', value: 'code-review' },
      ],
      product: [
        { label: '产品规划', value: 'planning' },
        { label: '需求管理', value: 'requirements' },
        { label: '数据分析', value: 'analytics' },
      ],
    },
    manager: {
      tech: [
        { label: '代码审查', value: 'code-review' },
        { label: '任务分配', value: 'task-assign' },
      ],
      product: [
        { label: '需求管理', value: 'requirements' },
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
    },
  }
  return features[permission]?.[dept] || []
}

const form = ref({})

const formItems: FormItems = [
  {
    prop: 'department',
    label: '部门',
    comp: 'select',
    compAttrs: {
      options: departments,
    },
  },
  {
    prop: 'role',
    label: '角色',
    comp: 'select',
    compAttrs: {
      // 对象模式：依赖部门字段（内部依赖）
      options: {
        loader: (formData) => {
          const dept = formData.department as string | undefined
          if (!dept)
            return []
          if (dept === 'tech')
            return techRoles
          if (dept === 'product')
            return productRoles
          return []
        },
        deps: ['department'], // 内部依赖：依赖部门字段
        immediate: true,
      },
    },
  },
  {
    prop: 'features',
    label: '功能权限',
    comp: 'select',
    compAttrs: {
      // 对象模式：同时依赖外部状态（permissionLevel）和表单字段（department, role）
      // 注意：配置了 deps 后，内部依赖通过 watch 监听，外部依赖通过 watchEffect 追踪（在 loader 中访问）
      options: {
        loader: (formData) => {
          const dept = formData.department as string | undefined
          const role = formData.role as string | undefined
          if (!dept || !role)
            return []
          // 通过闭包访问外部 ref：permissionLevel（外部依赖，watchEffect 会自动追踪）
          // 通过 formData 访问表单字段：department, role（内部依赖，通过 deps 配置）
          return getFeaturesByPermissionAndDept(permissionLevel.value, dept)
        },
        // 配置内部依赖：依赖部门和角色字段（内部依赖变化时触发）
        // 外部依赖（permissionLevel）通过闭包访问，watchEffect 会自动追踪
        deps: ['department', 'role'],
        immediate: true,
      },
    },
  },
]
</script>

<template>
  <div>
    <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded flex items-center gap-3 flex-wrap">
      <strong>外部状态（权限级别）：</strong>
      <el-tag :type="permissionLevel === 'admin' ? 'danger' : permissionLevel === 'manager' ? 'warning' : 'success'">
        {{ permissionLevel === 'admin' ? '管理员' : permissionLevel === 'manager' ? '经理' : '普通用户' }}
      </el-tag>
      <el-button size="small" @click="permissionLevel = permissionLevel === 'admin' ? 'manager' : permissionLevel === 'manager' ? 'user' : 'admin'">
        切换权限级别
      </el-button>
      <span class="text-xs text-gray-600 dark:text-gray-400">切换后，功能权限选项会根据权限级别、部门和角色动态更新</span>
    </div>
    <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
      部门：静态模式 | 角色：对象模式（deps: ['department']，内部依赖） | 功能权限：对象模式（deps: ['department', 'role']，内部依赖 + 闭包访问 permissionLevel，外部依赖）
    </p>
    <WForm :model="form" :form-items="formItems" />
    <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded">
      <h3 class="text-sm font-semibold mb-2">表单数据：</h3>
      <pre class="text-xs">{{ JSON.stringify(form, null, 2) }}</pre>
    </div>
  </div>
</template>
```

:::

**模式等价关系**：

```typescript
// 函数模式
options: () => [{ label: '选项1', value: '1' }]

// 等价于对象模式（显式指定默认值）
options: {
  loader: () => [{ label: '选项1', value: '1' }],
  immediate: true,  // 显式设置为 true（立即加载，默认 false）
  deps: [],          // 默认值：[]（不依赖表单字段）
}

// 等价于对象模式（省略默认值）
options: {
  loader: () => [{ label: '选项1', value: '1' }],
  // immediate 默认为 false（不立即加载），deps 默认为 []（不依赖表单字段）
}
```

**注意**：函数模式和对象模式都会通过 `watchEffect` 自动追踪外部状态依赖（通过闭包访问的外部 ref）。

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
  /** 是否显示操作区域（v-if），默认值：`inline`（当 inline 为 true 时，默认显示；当 inline 为 false 时，默认不显示） */
  vIf?: boolean | ((data: Record<string, any>) => boolean)
  /** 显示/隐藏操作区域（v-show），默认值：`true` */
  vShow?: boolean | ((data: Record<string, any>) => boolean)
  /** 按钮列表，默认值：`inline` 为 `true` 时 `['search', 'reset']`，`inline` 为 `false` 时 `['submit', 'cancel']` */
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
