<!-- eslint-disable ts/no-explicit-any -->
<script setup lang="ts">
import type { FormItems } from '@iswangh/element-plus-kit-form'
import { Edit, Lock, QuestionFilled, Search, User } from '@element-plus/icons-vue'
import { WForm } from '@iswangh/element-plus-kit'
import { h } from 'vue'

const form1 = ref({
  username: '',
  email: '',
  password: '',
})

// 示例 1：可配置化插槽（FormItem 插槽和动态组件插槽）
const formItems1: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    compType: 'input',
    // FormItem 插槽配置
    slots: {
      label: props => h('span', { class: 'flex items-center gap-1' }, [
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
]

// 示例 2：可配置化插槽和模板插槽的优先级
const form2 = ref({
  username: '',
  email: '',
  password: '',
})

const formItems2: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    compType: 'input',
    // 配置中的插槽（优先级高）
    slots: {
      label: props => h('span', { class: 'text-blue-600 font-semibold' }, [
        h('i', { class: 'el-icon-user mr-1' }),
        props.formItem.label,
      ]),
    },
    compProps: {
      placeholder: '请输入用户名',
      slots: {
        prefix: () => h(User, { class: 'text-blue-500' }),
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
      // 这个字段没有在配置中定义插槽，会使用模板插槽
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
        prefix: () => h(Lock, { class: 'text-green-500' }),
      },
    },
  },
]

// 示例 3：混合使用配置插槽和模板插槽
const form3 = ref({
  username: '',
  email: '',
  phone: '',
})

const formItems3: FormItems = [
  {
    prop: 'username',
    label: '用户名',
    compType: 'input',
    rules: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
    // 配置中的 FormItem 插槽
    slots: {
      label: props => h('span', { class: 'flex items-center gap-1' }, [
        h('span', props.formItem.label),
        h('span', { class: 'text-red-500' }, '*'),
      ]),
      error: props => h('div', { class: 'flex items-center gap-1 text-red-500' }, [
        h('i', { class: 'el-icon-warning' }),
        h('span', { class: 'font-medium' }, props.error),
      ]),
    },
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
      // 使用模板插槽
    },
    rules: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
  },
  {
    prop: 'phone',
    label: '手机号',
    compType: 'input',
    compProps: {
      placeholder: '请输入手机号',
      slots: {
        prefix: () => h('i', { class: 'el-icon-phone text-gray-400' }),
      },
    },
    rules: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
    ],
  },
]

// 示例 4：自定义组件插槽（compType: 'custom'）
const form4 = ref({
  customField1: '',
  customField2: '',
  customField3: '',
  customField4: '',
  customField5: '',
})

// 示例 5：验证 slots.default 和 compProps.slots.default 的优先级
const form5 = ref({
  customField6: '',
})

const formItems4: FormItems = [
  {
    prop: 'customField1',
    label: '自定义字段1（slots.default）',
    compType: 'custom',
    // 使用 slots.default 定义自定义组件（formItem 的 default 插槽）
    slots: {
      default: props => h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'text-gray-500' }, 'slots.default：'),
        h('input', {
          class: 'el-input__inner',
          value: props.value,
          onInput: (e: Event) => {
            form4.value.customField1 = (e.target as HTMLInputElement).value
          },
          placeholder: '请输入内容',
        }),
      ]),
    },
  },
  {
    prop: 'customField2',
    label: '自定义字段2（slots.default）',
    compType: 'custom',
    // 使用 slots.default 定义自定义组件（formItem 的 default 插槽）
    slots: {
      default: props => h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'text-gray-500' }, 'slots.default：'),
        h('input', {
          class: 'el-input__inner',
          value: props.value,
          onInput: (e: Event) => {
            form4.value.customField2 = (e.target as HTMLInputElement).value
          },
          placeholder: '请输入内容',
        }),
      ]),
    },
  },
  {
    prop: 'customField3',
    label: '自定义字段3（模板插槽）',
    compType: 'custom',
    // 使用模板插槽定义自定义组件（在模板中定义）
  },
  {
    prop: 'customField4',
    label: '自定义字段4（配置插槽 + 模板插槽）',
    compType: 'custom',
    // 配置插槽（优先级高，会被使用）
    compProps: {
      slots: {
        default: props => h('div', { class: 'flex items-center gap-2' }, [
          h('span', { class: 'text-blue-500 font-semibold' }, '配置插槽（优先级高）：'),
          h('input', {
            class: 'el-input__inner',
            value: props.value,
            onInput: (e: Event) => {
              form4.value.customField4 = (e.target as HTMLInputElement).value
            },
            placeholder: '请输入内容',
          }),
        ]),
      },
    },
  },
  {
    prop: 'customField5',
    label: '自定义字段5（验证 slots.default 是否等于模板 custom）',
    compType: 'custom',
    // 使用 slots.default（formItem 的 default 插槽）
    // 对应的模板插槽应该是 #form-item-default，而不是 #customField5
    slots: {
      default: props => h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'text-green-500 font-semibold' }, 'slots.default（对应模板插槽 #form-item-default）：'),
        h('input', {
          class: 'el-input__inner',
          value: props.value,
          onInput: (e: Event) => {
            form4.value.customField5 = (e.target as HTMLInputElement).value
          },
          placeholder: '请输入内容',
        }),
      ]),
    },
  },
]

const formItems5: FormItems = [
  {
    prop: 'customField6',
    label: '自定义字段6（验证 compType=custom 时只使用 slots.default）',
    compType: 'custom',
    // 当 compType === 'custom' 时，是自定义组件，不应该使用 compProps.slots
    // compProps 是用于动态组件的属性配置，自定义组件只使用 slots.default
    slots: {
      default: () => h('div', { class: 'text-red-500 font-semibold text-2xl' }, '123'),
    },
    // compProps.slots.default 不会被使用（即使定义了也会被忽略）
    compProps: {
      slots: {
        default: () => h('div', { class: 'text-blue-500 font-semibold text-2xl' }, '456'),
      },
    },
  },
]

// 示例 6：同时使用 form-item-default 和 custom 模板插槽
const form6 = ref({
  fieldWithFormItemDefault: '',
  fieldWithCustom: '',
})

const formItems6: FormItems = [
  {
    prop: 'fieldWithFormItemDefault',
    label: '字段1（使用 #form-item-default）',
    compType: 'custom',
    // 不定义配置插槽，使用模板插槽 #form-item-default
  },
  {
    prop: 'fieldWithCustom',
    label: '字段2（使用 #{prop}）',
    compType: 'custom',
    // 不定义配置插槽，使用模板插槽 #{prop}（即 #fieldWithCustom）
  },
]
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <!-- 示例 1：可配置化插槽 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 1：可配置化插槽
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：在 formItem 配置对象中定义插槽。FormItem 插槽在 <code>slots</code> 字段中定义，动态组件插槽在 <code>compProps.slots</code> 中定义。
              <br>
              <strong>FormItem 插槽</strong>：用于自定义 el-form-item 的插槽（如 label、error）。
              <br>
              <strong>动态组件插槽</strong>：用于自定义动态组件的插槽（如 prefix、suffix）。
            </p>
          </template>
        </el-alert>
        <WForm
          :model="form1"
          :form-items="formItems1"
          label-width="100px"
        />
      </el-space>
    </el-card>

    <!-- 示例 2：可配置化插槽和模板插槽的优先级 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 2：可配置化插槽和模板插槽的优先级
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="warning" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：同时在配置和模板中定义同名插槽，验证配置中的插槽优先级更高。
              <br>
              <strong>username</strong> 字段：配置中定义了 <code>slots.label</code> 和 <code>compProps.slots.prefix</code>，会覆盖模板插槽。
              <br>
              <strong>email</strong> 字段：配置中未定义插槽，会使用模板插槽。
              <br>
              <strong>password</strong> 字段：配置中定义了 <code>compProps.slots.prefix</code>，会覆盖模板插槽。
            </p>
          </template>
        </el-alert>
        <WForm
          :model="form2"
          :form-items="formItems2"
          label-width="100px"
        >
          <!-- 模板插槽：username-prefix（会被配置插槽覆盖） -->
          <template #username-prefix>
            <el-icon><Search /></el-icon>
          </template>

          <!-- 模板插槽：email-prefix（会使用，因为配置中未定义） -->
          <template #email-prefix>
            <el-icon><Edit /></el-icon>
          </template>

          <!-- 模板插槽：password-prefix（会被配置插槽覆盖） -->
          <template #password-prefix>
            <el-icon><Search /></el-icon>
          </template>
        </WForm>
      </el-space>
    </el-card>

    <!-- 示例 3：混合使用配置插槽和模板插槽 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 3：混合使用配置插槽和模板插槽
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：可以在同一个表单中混合使用配置插槽和模板插槽。
              <br>
              <strong>username</strong> 字段：使用配置插槽（FormItem 插槽和动态组件插槽）。
              <br>
              <strong>email</strong> 字段：使用模板插槽（动态组件插槽）。
              <br>
              <strong>phone</strong> 字段：使用配置插槽（动态组件插槽）。
            </p>
          </template>
        </el-alert>
        <WForm
          :model="form3"
          :form-items="formItems3"
          label-width="100px"
        >
          <!-- 模板插槽：email-prefix -->
          <template #email-prefix>
            <el-icon><Edit /></el-icon>
          </template>

          <!-- 模板插槽：email-suffix -->
          <template #email-suffix>
            <el-icon><QuestionFilled /></el-icon>
          </template>
        </WForm>
      </el-space>
    </el-card>

    <!-- 示例 4：自定义组件插槽（compType: 'custom'） -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 4：自定义组件插槽（compType: 'custom'）
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：当 <code>compType</code> 为 <code>'custom'</code> 时，可以使用配置插槽或模板插槽完全自定义表单项内容。
              <br>
              <strong>slots.default</strong>：在 <code>slots.default</code> 中定义（formItem 的 default 插槽），优先级最高。
              <br>
              <strong>模板插槽 #{prop}</strong>：直接使用 <code>{prop}</code> 作为插槽名，如 <code>#customField3</code>，优先级次之。
              <br>
              <strong>模板插槽 #form-item-default</strong>：对应 <code>slots.default</code>，优先级最低。
              <br>
              <strong>优先级顺序</strong>：<code>slots.default</code>（配置插槽）&gt; 模板插槽 <code>#{prop}</code> &gt; 模板插槽 <code>#form-item-default</code>。
              <br>
              <strong>重要说明</strong>：<code>compType === 'custom'</code> 时，不应该使用 <code>compProps.slots</code>，因为 <code>compProps</code> 是用于动态组件的属性配置。
              <br>
              <strong>重要说明</strong>：<code>slots.default</code> 对应模板插槽 <code>#form-item-default</code>，而不是 <code>#{prop}</code>。
              <br>
              <strong>模板插槽</strong>：<code>#{prop}</code>（如 <code>#customField3</code>）是另一种方式，优先级最低。
              <br>
              <strong>作用域参数</strong>：<code>{ value, form, formItem }</code>。
            </p>
          </template>
        </el-alert>
        <WForm
          :model="form4"
          :form-items="formItems4"
          label-width="150px"
        >
          <!-- 模板插槽：customField3 -->
          <template #customField3="{ form }">
            <div class="flex items-center gap-2">
              <span class="text-gray-500">模板插槽：</span>
              <el-input
                v-model="form.customField3"
                placeholder="请输入内容（模板插槽 custom）"
                clearable
              >
                <template #prefix>
                  <el-icon><Edit /></el-icon>
                </template>
              </el-input>
            </div>
          </template>

          <!-- 模板插槽：customField4（会被配置插槽覆盖） -->
          <template #customField4="{ form }">
            <div class="flex items-center gap-2">
              <span class="text-red-500">模板插槽（会被配置插槽覆盖）：</span>
              <el-input
                v-model="form.customField4"
                placeholder="请输入内容（模板插槽 custom）"
                clearable
              >
                <template #prefix>
                  <el-icon><Edit /></el-icon>
                </template>
              </el-input>
            </div>
          </template>

          <!-- 模板插槽：form-item-default（对应 slots.default） -->
          <template #form-item-default="{ form }">
            <div class="flex items-center gap-2">
              <span class="text-orange-500 font-semibold">模板插槽 #form-item-default（对应 slots.default）：</span>
              <el-input
                v-model="form.customField5"
                placeholder="请输入内容（模板插槽 #form-item-default）"
                clearable
              >
                <template #prefix>
                  <el-icon><Edit /></el-icon>
                </template>
              </el-input>
            </div>
          </template>
        </WForm>
      </el-space>
    </el-card>

    <!-- 示例 5：验证 compType=custom 时只使用 slots.default -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 5：验证 compType=custom 时只使用 slots.default
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：当 <code>compType</code> 为 <code>'custom'</code> 时，是自定义组件，不应该使用 <code>compProps.slots</code>。
              <br>
              <strong>compProps</strong>：是用于动态组件的属性配置（如 <code>el-input</code>、<code>el-select</code> 等），不应该在 <code>compType === 'custom'</code> 时使用。
              <br>
              <strong>slots.default</strong>：显示数字 <code>123</code>（红色），这是 formItem 的 default 插槽，用于自定义组件。
              <br>
              <strong>compProps.slots.default</strong>：显示数字 <code>456</code>（蓝色），但不会被使用，因为 <code>compType === 'custom'</code> 时不会使用 <code>compProps.slots</code>。
              <br>
              <strong>预期结果</strong>：应该显示 <code>123</code>（红色），而不是 <code>456</code>（蓝色）。
            </p>
          </template>
        </el-alert>
        <WForm
          :model="form5"
          :form-items="formItems5"
          label-width="150px"
        />
      </el-space>
    </el-card>

    <!-- 示例 6：同时使用 form-item-default 和 custom 模板插槽 -->
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          示例 6：同时使用 form-item-default 和 custom 模板插槽
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              说明：测试同时使用两种模板插槽方式。
              <br>
              <strong>字段1</strong>：使用模板插槽 <code>#form-item-default</code>，对应 <code>slots.default</code>（配置插槽）。
              <br>
              <strong>字段2</strong>：使用模板插槽 <code>#{prop}</code>（即 <code>#fieldWithCustom</code>），这是另一种模板插槽方式。
              <br>
              <strong>区别</strong>：
              <br>
              - <code>#form-item-default</code>：通用的 form-item default 插槽，适用于所有字段。
              <br>
              - <code>#{prop}</code>：特定字段的插槽，只适用于对应的字段。
              <br>
              <strong>优先级</strong>：如果同时定义了 <code>#form-item-default</code> 和 <code>#{prop}</code>，<code>#{prop}</code> 优先级更高。
            </p>
          </template>
        </el-alert>
        <WForm
          :model="form6"
          :form-items="formItems6"
          label-width="200px"
        >
          <!-- 模板插槽：form-item-default（适用于所有字段） -->
          <template #form-item-default="{ form, formItem }">
            <div class="flex items-center gap-2">
              <span class="text-purple-500 font-semibold">#form-item-default：</span>
              <el-input
                v-model="form[formItem.prop]"
                :placeholder="`请输入${formItem.label}（#form-item-default）`"
                clearable
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </div>
          </template>

          <!-- 模板插槽：fieldWithCustom（特定字段，优先级高于 #form-item-default） -->
          <template #fieldWithCustom="{ form }">
            <div class="flex items-center gap-2">
              <span class="text-indigo-500 font-semibold">#{prop}（#fieldWithCustom）：</span>
              <el-input
                v-model="form.fieldWithCustom"
                placeholder="请输入字段2（#{prop}）"
                clearable
              >
                <template #prefix>
                  <el-icon><Edit /></el-icon>
                </template>
              </el-input>
            </div>
          </template>
        </WForm>
      </el-space>
    </el-card>
  </el-space>
</template>
