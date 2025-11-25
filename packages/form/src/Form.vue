<!-- eslint-disable ts/no-explicit-any -->
<script setup lang='ts'>
/**
 * @file Form.vue
 * @description 表单组件，支持动态配置、展开/折叠、条件渲染等功能
 */
import type { FormInstance, FormItemProp } from 'element-plus'
import type { Arrayable, ElFormProps, FormActionConfig, FormItemExtendedEventParams, FormItems, FormItemSlotScope, RowProps } from './types'
import { checkCondition } from '@iswangh/element-plus-kit-core'
import { ElCol, ElForm, ElRow } from 'element-plus'
import { computed, nextTick, onMounted, ref, useAttrs, useSlots, watch } from 'vue'
import { useAutoExpandOnHover } from './composables'
import { DEFAULT_FORM_PROPS } from './config'
import { DEFAULT_SCROLL_OPTIONS } from './config/scroll'
import FormAction from './FormAction.vue'
import FormItemComp from './FormItem.vue'
import { debounce, deepCloneValue, hasButtonEvent } from './utils'

interface Props extends ElFormProps {
  formItems: FormItems
  rowProps?: RowProps
  actionConfig?: FormActionConfig
}

interface Emits {
  (e: 'validate', prop: FormItemProp, isValid: boolean, message: string): void
  <T extends Record<string, any>, K extends keyof T>(e: 'change', extendedParams: FormItemExtendedEventParams, value: T[K]): void
  (e: 'action', eventName: string, data?: unknown): void
  (e: 'search'): void
  (e: 'reset', resetData: Record<string, unknown>): void
  (e: 'submit'): void
  (e: 'cancel'): void
  (e: 'expand', value: boolean): void
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

defineOptions({ name: 'WForm' })

const props = withDefaults(defineProps<Props>(), {
  model: () => ({}),
  rowProps: () => ({}),
  actionConfig: () => ({}),
})
const emit = defineEmits<Emits>()

defineSlots<Slots>()

const attrs = useAttrs()

/**
 * 判断是否为事件属性
 *
 * @param key - 属性键名
 * @param value - 属性值
 * @returns 是否为事件属性
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
  ) as Record<string, (prop: string, ...args: unknown[]) => void>
})

/** 提取并合并 form 属性 */
const mergedAttrs = computed(() => {
  const { formItems: _f, actionConfig: _a, rowProps: _r, ...rest } = props

  const filteredAttrs = Object.fromEntries(
    Object.entries(attrs).filter(([key, value]) => !isEventAttribute(key, value)),
  )

  return { ...rest, ...DEFAULT_FORM_PROPS, ...filteredAttrs }
})

// 展开/折叠状态（支持 v-model:expanded）
const isExpanded = defineModel<boolean>('expanded', { default: false })

// 监听 isExpanded 变化，同步触发 expand 事件
watch(
  isExpanded,
  (value) => {
    emit('expand', value)
  },
)

/**
 * 判断是否启用展开/折叠功能（通过 actionConfig.buttons 是否包含 'expand' 来判断）
 */
const expandEnabled = computed(() => {
  if (!mergedAttrs.value.inline)
    return false
  return hasButtonEvent(props.actionConfig?.buttons, 'expand')
})

/**
 * 是否启用鼠标悬停自动展开功能
 * 默认值为 false
 */
const autoExpandOnHover = computed((): boolean => {
  if (!expandEnabled.value)
    return false
  const expandRule = props.actionConfig?.expand
  if (!expandRule)
    return false
  return expandRule.autoExpandOnHover === true
})

// 鼠标悬停自动展开功能
const { onMouseEnter, onMouseLeave, recordManualToggle } = useAutoExpandOnHover(
  isExpanded,
  autoExpandOnHover,
  (value) => {
    isExpanded.value = value
  },
)

const formRef = ref<FormInstance>()

/**
 * 切换或设置表单展开/折叠状态
 *
 * @param value - 可选，不传参则切换状态，传布尔值则设置状态
 */
function toggleExpand(value?: boolean) {
  const newValue = value ?? !isExpanded.value
  isExpanded.value = newValue
  recordManualToggle()

  // 如果启用了自动滚动，在动画完成后滚动到表单中心
  const expandRule = props.actionConfig?.expand
  if (expandRule?.scrollOnToggle) {
    // 等待 DOM 更新和动画完成（动画时长约 250ms）
    nextTick(() => {
      setTimeout(() => formRef.value?.$el?.scrollIntoView?.(expandRule.scrollIntoViewOptions ?? DEFAULT_SCROLL_OPTIONS), 250)
    })
  }
}

/**
 * 过滤出需要渲染的 formItem（仅根据 vIf 条件，不包含展开/折叠状态）
 * - 根据 vIf 条件过滤表单项
 * - 处理每一项的 colProps.span 的默认值，默认为 rowProps.span
 */
const filteredFormItems = computed(() => {
  const { span: defaultSpan } = props.rowProps
  return props.formItems
    .filter(v => checkCondition({ condition: v.vIf, data: props.model, defaultValue: true }))
    .map((v) => {
      const { colProps = {} } = v ?? {}
      return { ...v, colProps: { ...colProps, span: colProps.span ?? defaultSpan } }
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
function shouldCollapseField(field: FormItems[number], fieldIndex: number): boolean {
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
const shouldRenderRow = computed(() => Object.keys(props.rowProps ?? {}).length > 0)

/** 布局组件 */
const layoutComponents = computed(() => ({
  row: mergedAttrs.value.inline || shouldRenderRow.value ? ElRow : 'div',
  col: shouldRenderRow.value ? ElCol : 'div',
}))

/**
 * 获取所有表单项的 prop 列表
 */
const allFormItemProps = computed(() => props.formItems.map(item => item.prop))

/**
 * 获取可折叠字段的 prop 列表
 */
const collapsedFieldProps = computed(() => {
  if (!expandEnabled.value)
    return []

  const expandRule = props.actionConfig?.expand
  if (!expandRule)
    return []

  return filteredFormItems.value
    .map((field, index) => ({ field, index }))
    .filter(({ field, index }) => {
      if ('exclude' in expandRule && expandRule.exclude.includes(field.prop))
        return true
      if ('include' in expandRule && !expandRule.include.includes(field.prop))
        return true
      if ('count' in expandRule && index >= expandRule.count)
        return true
      return false
    })
    .map(({ field }) => field.prop)
})

/**
 * 可折叠字段的初始值快照
 */
const collapsedFieldsInitialValues = ref<Record<string, unknown>>({})

/**
 * 记录可折叠字段的初始值
 * 在组件挂载时和配置变化时调用
 */
function recordInitialValues() {
  collapsedFieldsInitialValues.value = {}
  for (const prop of collapsedFieldProps.value) {
    const value = props.model[prop]
    collapsedFieldsInitialValues.value[prop] = deepCloneValue(value)
  }
}

/**
 * 防抖版本的 recordInitialValues
 * 用于配置变化时的频繁调用优化（延迟 100ms）
 */
const debouncedRecordInitialValues = debounce(recordInitialValues, 100)

/**
 * 获取重置数据（可折叠字段的初始值）
 *
 * @returns 可折叠字段的重置数据对象
 */
function getResetData(): Record<string, unknown> {
  const resetData: Record<string, unknown> = {}
  for (const prop of collapsedFieldProps.value) {
    const initialValue = collapsedFieldsInitialValues.value[prop]
    resetData[prop] = initialValue != null ? deepCloneValue(initialValue) : undefined
  }
  return resetData
}

/**
 * 处理重置逻辑（内部使用）
 * 清除验证状态并重置非可折叠字段
 */
function onReset() {
  formRef.value?.clearValidate?.(collapsedFieldProps.value)

  const nonCollapsedProps = allFormItemProps.value.filter(prop => !collapsedFieldProps.value.includes(prop))
  if (nonCollapsedProps.length > 0)
    formRef.value?.resetFields?.(nonCollapsedProps)
}

/**
 * 处理动作按钮事件
 *
 * @param payload - 事件数据对象
 * @param payload.eventName - 事件名称
 */
async function onAction({ eventName }: { eventName: string }) {
  const validateEvents = ['submit', 'search']
  const resetEvents = ['cancel', 'reset']

  // 处理展开/折叠事件
  if (eventName === 'expand') {
    toggleExpand()
    // expand 事件由 watch(isExpanded, ...) 自动触发，无需手动 emit
    emit('action', eventName, isExpanded.value)
    return
  }

  if (validateEvents.includes(eventName))
    await formRef.value?.validate?.()

  if (resetEvents.includes(eventName)) {
    if (eventName === 'reset') {
      // reset 事件：传递重置数据给外部处理
      const resetData = getResetData()
      onReset()
      emit('reset', resetData)
      emit('action', eventName, resetData)
      return
    }
    // cancel 事件：保持原有逻辑
    formRef.value?.resetFields?.()
  }

  emit(eventName as EmitEventName)
  emit('action', eventName)
}

/**
 * 处理表单验证事件
 *
 * @param prop - 表单项 prop
 * @param isValid - 是否有效
 * @param message - 验证消息
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
  toggleExpand,
})

// 组件挂载时记录初始值
onMounted(() => {
  recordInitialValues()
})

// 监听 formItems 或 expand 配置变化，重新记录初始值（使用防抖优化）
watch(
  [() => props.formItems, () => props.actionConfig?.expand],
  () => {
    debouncedRecordInitialValues()
  },
  { deep: true },
)
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
      v-bind="rowProps"
    >
      <TransitionGroup
        v-if="expandEnabled"
        name="form-item"
        tag="div"
        class="form-items-transition"
      >
        <component
          :is="layoutComponents.col"
          v-for="(v, i) in visibleFormItems"
          v-show="checkCondition({ condition: v.vShow, data: props.model, defaultValue: true })"
          :key="`${v.prop}-${v._originalIndex ?? i}`"
          v-bind="v.colProps"
        >
          <FormItemComp
            v-model="model[v.prop]"
            :form-item="v"
            :form-data="model"
            :dynamic-comp-events="dynamicCompEvents"
            :form-slots="slotsCache"
            :index="v._originalIndex ?? i"
            @change="(extendedParams: FormItemExtendedEventParams, value: unknown) => emit('change', extendedParams, value)"
          />
        </component>
      </TransitionGroup>
      <template v-else>
        <component
          :is="layoutComponents.col"
          v-for="(v, i) in visibleFormItems"
          v-show="checkCondition({ condition: v.vShow, data: props.model, defaultValue: true })"
          :key="`${v.prop}-${v._originalIndex ?? i}`"
          v-bind="v.colProps"
        >
          <FormItemComp
            v-model="model[v.prop]"
            :form-item="v"
            :form-data="model"
            :dynamic-comp-events="dynamicCompEvents"
            :form-slots="slotsCache"
            :index="v._originalIndex ?? i"
            @change="(extendedParams: FormItemExtendedEventParams, value: unknown) => emit('change', extendedParams, value)"
          />
        </component>
      </template>
      <FormAction
        :inline="mergedAttrs.inline"
        :action-slot="$slots.action"
        :config="actionConfig"
        :expanded="isExpanded"
        :auto-expand-on-hover="autoExpandOnHover"
        :on-mouse-enter="onMouseEnter"
        :on-mouse-leave="onMouseLeave"
        @action="onAction"
      />
    </component>
  </ElForm>
</template>

<style lang="scss" scoped>
.form-items-transition {
  display: contents;
}

.form-item-enter-active {
  transition:
    opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-item-leave-active {
  transition:
    opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-item-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}

.form-item-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
