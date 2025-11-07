<!-- eslint-disable ts/no-explicit-any -->
<script setup lang='ts'>
import type { FormInstance, FormItemProp } from 'element-plus'
import type { ActionConfig, Arrayable, ElFormAttrs, EventExtendedParams, FormItems, FormItemSlotScope, RowAttrs } from './types'
import { checkCondition } from '../utils'
import { DEFAULT_FORM_ATTRS } from './config'
import FormAction from './FormAction.vue'
import FormItemComp from './FormItem.vue'

interface Props extends ElFormAttrs {
  formItems: FormItems
  rowAttrs?: RowAttrs
  actionConfig?: ActionConfig
}

interface Emits {
  (e: 'validate', prop: FormItemProp, isValid: boolean, message: string): void
  <T extends Record<string, any>, K extends keyof T>(e: 'change', extendedParams: EventExtendedParams, value: T[K]): void
  (e: 'action', eventName: string): void
  (e: 'search'): void
  (e: 'reset'): void
  (e: 'submit'): void
  (e: 'cancel'): void
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
  [key: string]: (props: FormItemSlotScope) => any
}

defineOptions({ name: 'ElementPlusKitForm' })

const props = withDefaults(defineProps<Props>(), {
  model: () => ({}),
  rowAttrs: () => ({}),
  actionConfig: () => ({}),
})
const emit = defineEmits<Emits>()

defineSlots<Slots>()

const attrs = useAttrs()

/**
 * 提取动态组件的事件
 *
 * 这里不需要显式排除 defineEmits 中定义的事件，因为 useAttrs 会自动过滤掉
 *
 */
const dynamicCompEvents = computed(() => {
  return Object.fromEntries(
    Object.entries(attrs).filter(([key, value]) =>
      key.startsWith('on') && typeof value === 'function',
    ),
  ) as Record<string, (prop: string, ...args: any) => void>
})

/** 提取并合并 form 属性 */
const mergedAttrs = computed(() => {
  const { formItems: _f, actionConfig: _a, rowAttrs: _r, ...rest } = props

  // 过滤掉所有事件（以 on 开头且为函数的属性）
  const filteredAttrs = Object.fromEntries(
    Object.entries(attrs).filter(([key, value]) =>
      !(key.startsWith('on') && typeof value === 'function'),
    ),
  )

  return { ...rest, ...DEFAULT_FORM_ATTRS, ...filteredAttrs }
})

/**
 * 过滤出需要渲染的 formItem
 *   - 根据 vIf 条件过滤表单项
 *   - 处理每一项的 colAttrs.span 的默认值,默认为 rowAttrs.span
 */
const filteredFormItems = computed(() => {
  const { span: defaultSpan } = props?.rowAttrs ?? {}
  return props.formItems.filter(v => checkCondition({ condition: v.vIf, data: props.model, defaultValue: true })).map((v) => {
    const { colAttrs = {} } = v ?? {}
    return { ...v, colAttrs: { ...colAttrs, span: colAttrs.span ?? defaultSpan } }
  })
})

const slots = useSlots()

/**
 * 获取动态组件对应的插槽
 * @param prefix 动态组件名称前缀
 * @returns 动态组件插槽配置数组
 */
function getSlotsByPrefix(prefix: string) {
  const result = []
  for (const name in slots) {
    if (name.startsWith(prefix)) {
      result.push({
        rawSlotName: name,
        slotName: name.replace(prefix, ''),
        slotFn: slots[name]!,
      })
    }
  }
  return result
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
const shouldRenderRow = computed(() => ((props.rowAttrs && Object.keys(props.rowAttrs).length > 0)))

/** 布局组件 */
const layoutComponents = computed(() => ({
  row: mergedAttrs.value.inline || shouldRenderRow.value ? ElRow : 'div',
  col: shouldRenderRow.value ? ElCol : 'div',
}))

const formRef = ref<FormInstance>()

/**
 * 处理动作按钮事件
 */
async function onAction({ eventName }: { eventName: string }) {
  // 定义需要验证的事件
  const validateEvents = ['submit', 'search']
  // 定义需要重置的事件
  const resetEvents = ['cancel', 'reset']

  if ([...validateEvents, ...resetEvents].includes(eventName)) {
    validateEvents.includes(eventName) && await formRef.value?.validate?.()
    resetEvents.includes(eventName) && formRef.value?.resetFields?.()
    emit(eventName as EmitEventName)
  }

  emit('action', eventName)
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
})
</script>

<template>
  <el-form
    ref="formRef"
    v-bind="mergedAttrs"
    :model="model"
    @validate="(prop, isValid, message) => $emit('validate', prop, isValid, message)"
    @submit.prevent
  >
    <component :is="layoutComponents.row" v-bind="rowAttrs">
      <component :is="layoutComponents.col" v-for="(v, i) in filteredFormItems" v-show="checkCondition({ condition: v.vShow, data: props.model, defaultValue: true })" :key="`${v.prop}-${i}`" v-bind="v.colAttrs">
        <FormItemComp
          v-model="model[v.prop]"
          :form-item="v"
          :form-data="model"
          :dynamic-comp-events="dynamicCompEvents"
          :form-slots="slotsCache"
          :index="i"
          @change="(extendedParams, value) => $emit('change', extendedParams, value)"
        />
      </component>
      <FormAction :inline="mergedAttrs.inline" :action-slot="$slots.action" :config="actionConfig" @action="onAction" />
    </component>
  </el-form>
</template>
