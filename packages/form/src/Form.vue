<!-- eslint-disable ts/no-explicit-any -->
<script setup lang='ts'>
import type { FormInstance, FormItemProp } from 'element-plus'
import type { ActionConfig, Arrayable, ElFormAttrs, EventExtendedParams, FormItems, FormItemSlotScope, RowAttrs } from './types'
import { checkCondition } from '@iswangh/element-plus-kit-core'
import { ElCol, ElForm, ElRow } from 'element-plus'
import { computed, ref, useAttrs, useSlots } from 'vue'
import { DEFAULT_FORM_ATTRS } from './config'
import FormAction from './FormAction.vue'
import FormItemComp from './FormItem.vue'
import { hasButtonEvent } from './utils'

interface Props extends ElFormAttrs {
  formItems: FormItems
  rowAttrs?: RowAttrs
  actionConfig?: ActionConfig
}

interface Emits {
  (e: 'validate', prop: FormItemProp, isValid: boolean, message: string): void
  <T extends Record<string, any>, K extends keyof T>(e: 'change', extendedParams: EventExtendedParams, value: T[K]): void
  (e: 'action', eventName: string, data?: any): void
  (e: 'search'): void
  (e: 'reset'): void
  (e: 'submit'): void
  (e: 'cancel'): void
  (e: 'expanded', value: boolean): void
}

type EmitEventName = Exclude<keyof Emits, 'validate' | 'change' | 'action'>

interface Slots {
  /**
   * FormItem 通用插槽
   * @example #form-item-label
   */
  [key: `form-item-${string}`]: (props: FormItemSlotScope) => any

  /**
   * 动态组件插槽
   * @example #username-prefix, #email-suffix
   */
  [key: `${string}-${string}`]: (props: FormItemSlotScope) => any

  /**
   * 自定义组件插槽
   * @example #custom-field
   */
  [key: string]: ((props: FormItemSlotScope) => any) | ((props: { expanded: boolean, toggle: (value?: boolean) => void }) => any)
  /**
   * 展开/折叠按钮插槽
   * @example #expand-toggle="{ expanded, toggle }"
   */
  // @ts-expect-error - expand-toggle 插槽类型与索引签名不兼容，但运行时正常
  'expand-toggle'?: (props: { expanded: boolean, toggle: (value?: boolean) => void }) => any
}

defineOptions({ name: 'WForm' })

const props = withDefaults(defineProps<Props>(), {
  model: () => ({}),
  rowAttrs: () => ({}),
  actionConfig: () => ({}),
})
const emit = defineEmits<Emits>()

defineSlots<Slots>()

const attrs = useAttrs()

/**
 * 判断是否为事件属性
 */
function isEventAttribute(key: string, value: unknown): boolean {
  return key.startsWith('on') && typeof value === 'function'
}

/**
 * 提取动态组件的事件
 * useAttrs 会自动过滤掉 defineEmits 中定义的事件
 */
const dynamicCompEvents = computed(() => {
  return Object.fromEntries(
    Object.entries(attrs).filter(([key, value]) => isEventAttribute(key, value)),
  ) as Record<string, (prop: string, ...args: any) => void>
})

/** 提取并合并 form 属性 */
const mergedAttrs = computed(() => {
  const { formItems: _f, actionConfig: _a, rowAttrs: _r, ...rest } = props

  const filteredAttrs = Object.fromEntries(
    Object.entries(attrs).filter(([key, value]) => !isEventAttribute(key, value)),
  )

  return { ...rest, ...DEFAULT_FORM_ATTRS, ...filteredAttrs }
})

// 展开/折叠状态（内置响应式）
const isExpanded = ref(false)

/**
 * 切换或设置表单展开/折叠状态
 *
 * @param value - 可选，不传参则切换状态，传布尔值则设置状态
 */
function toggleExpanded(value?: boolean) {
  isExpanded.value = value === undefined ? !isExpanded.value : value
}

/**
 * 判断是否启用展开/折叠功能（通过 actionConfig.buttons 是否包含 'expand' 来判断）
 */
const expandEnabled = computed(() => {
  if (!mergedAttrs.value.inline)
    return false
  return hasButtonEvent(props.actionConfig?.buttons, 'expand')
})

/**
 * 过滤出需要渲染的 formItem（仅根据 vIf 条件，不包含展开/折叠状态）
 * - 根据 vIf 条件过滤表单项
 * - 处理每一项的 colAttrs.span 的默认值，默认为 rowAttrs.span
 */
const filteredFormItems = computed(() => {
  const { span: defaultSpan } = props.rowAttrs
  return props.formItems
    .filter(v => checkCondition({ condition: v.vIf, data: props.model, defaultValue: true }))
    .map((v) => {
      const { colAttrs = {} } = v ?? {}
      return { ...v, colAttrs: { ...colAttrs, span: colAttrs.span ?? defaultSpan } }
    })
})

/**
 * 根据展开/折叠状态过滤出需要渲染的 formItem
 * - 基于 filteredFormItems，根据展开/折叠状态进一步过滤
 * - 保留原始索引信息，用于 shouldCollapseField 等函数
 */
const visibleFormItems = computed(() => {
  return filteredFormItems.value
    .map((v, originalIndex) => ({ ...v, _originalIndex: originalIndex }))
    .filter((v) => {
      const originalIndex = v._originalIndex
      // 如果展开/折叠功能未启用，则显示所有字段
      if (!expandEnabled.value)
        return true
      // 如果功能已启用，则根据展开状态和配置决定是否显示
      return !shouldCollapseField(v, originalIndex)
    })
})

/**
 * 判断字段是否应该被折叠
 *
 * @param field - 表单项配置对象
 * @param fieldIndex - 字段在数组中的索引
 * @returns 是否应该被折叠
 */
function shouldCollapseField(field: any, fieldIndex: number): boolean {
  // 如果功能未开启，则不应该被折叠
  if (!expandEnabled.value)
    return false

  // 如果已展开，则不应该被折叠
  if (isExpanded.value)
    return false

  const expandRule = props.actionConfig?.expand
  if (!expandRule)
    return false

  // 优先级 1：exclude（黑名单）
  if ('exclude' in expandRule && expandRule.exclude.length > 0 && expandRule.exclude.includes(field.prop))
    return true

  // 优先级 2：include（白名单）
  if ('include' in expandRule && expandRule.include.length > 0 && !expandRule.include.includes(field.prop))
    return true

  // 优先级 3：count
  if ('count' in expandRule && fieldIndex >= expandRule.count)
    return true

  return false
}

const slots = useSlots()

/**
 * 获取动态组件对应的插槽
 * @param prefix 动态组件名称前缀
 * @returns 动态组件插槽配置数组
 */
function getSlotsByPrefix(prefix: string) {
  return Object.keys(slots)
    .filter(name => name.startsWith(prefix))
    .map(name => ({
      rawSlotName: name,
      slotName: name.replace(prefix, ''),
      slotFn: slots[name]!,
    }))
}

/** 缓存 el-form-item 和动态组件的插槽配置 */
const slotsCache = computed(() => {
  const formItemSlots = getSlotsByPrefix('form-item-')
  const dynamicComponentSlots = new Map()

  // 缓存字段插槽
  for (const item of filteredFormItems.value) {
    const fieldSlots = getSlotsByPrefix(`${item.prop}-`)
    if (fieldSlots.length > 0) {
      dynamicComponentSlots.set(item.prop, fieldSlots)
    }
  }

  return { formItemSlots, dynamicComponentSlots }
})

/** 判断是否渲染 el-row */
const shouldRenderRow = computed(() => Object.keys(props.rowAttrs ?? {}).length > 0)

/** 布局组件 */
const layoutComponents = computed(() => ({
  row: mergedAttrs.value.inline || shouldRenderRow.value ? ElRow : 'div',
  col: shouldRenderRow.value ? ElCol : 'div',
}))

const formRef = ref<FormInstance>()

/**
 * 处理动作按钮事件
 */
async function onAction({ eventName}: { eventName: string }) {
  const validateEvents = ['submit', 'search']
  const resetEvents = ['cancel', 'reset']

  // 处理展开/折叠事件
  // 传递给外界的值使用 isExpanded.value,而不是使用子组件抛出的值
  if (eventName === 'expanded') {
    toggleExpanded()
    emit('expanded', isExpanded.value)
    emit('action', eventName, isExpanded.value)
    return
  }

  if (validateEvents.includes(eventName))
    await formRef.value?.validate?.()

  if (resetEvents.includes(eventName))
    formRef.value?.resetFields?.()

  emit(eventName as EmitEventName)
  emit('action', eventName)
}

/**
 * 处理表单验证事件
 */
function onValidate(prop: FormItemProp, isValid: boolean, message: string) {
  emit('validate', prop, isValid, message)
}

defineExpose({
  // element-plus form exposes
  get fields() {
    return formRef.value?.fields
  },
  getField: (prop: FormItemProp) => formRef.value?.getField?.(prop),
  validate: () => formRef.value?.validate?.(),
  validateField: (props: Arrayable<FormItemProp>) => formRef.value?.validateField?.(props),
  resetFields: (props?: Arrayable<FormItemProp>) => formRef.value?.resetFields?.(props),
  clearValidate: (props?: Arrayable<FormItemProp>) => formRef.value?.clearValidate?.(props),
  scrollToField: (prop: FormItemProp) => formRef.value?.scrollToField?.(prop),
  // 展开/折叠控制方法
  get expanded() {
    return isExpanded.value
  },
  toggleExpanded,
})
</script>

<template>
  <ElForm
    ref="formRef"
    v-bind="mergedAttrs"
    :model="model"
    @validate="onValidate"
    @submit.prevent
  >
    <component
      :is="layoutComponents.row"
      v-bind="rowAttrs"
    >
      <component
        :is="layoutComponents.col"
        v-for="(v, i) in visibleFormItems"
        v-show="checkCondition({ condition: v.vShow, data: props.model, defaultValue: true })"
        :key="`${v.prop}-${v._originalIndex ?? i}`"
        v-bind="v.colAttrs"
      >
        <FormItemComp
          v-model="model[v.prop]"
          :form-item="v"
          :form-data="model"
          :dynamic-comp-events="dynamicCompEvents"
          :form-slots="slotsCache"
          :index="v._originalIndex ?? i"
          @change="(extendedParams: EventExtendedParams, value: any) => emit('change', extendedParams, value)"
        />
      </component>
      <FormAction
        :inline="mergedAttrs.inline"
        :action-slot="$slots.action"
        :config="actionConfig"
        :expanded="isExpanded"
        @action="onAction"
      />
    </component>
  </ElForm>
</template>
