<!-- eslint-disable ts/no-explicit-any -->
<script setup lang='ts'>
import type { Slot } from 'vue'
import type { EventExtendedParams, FormItem, OptionsConfig, OptionsLoader } from './types'
import { ElFormItem } from 'element-plus'
import { computed, ref, watch, watchEffect } from 'vue'
import { COMPONENT_DEFAULT_CONFIG, FORM_ITEM_COMP_MAP, FORM_ITEM_EXCLUDED_KEYS } from './config'
import { getDepsValues, processDeps } from './utils/options'

interface ProcessedSlot {
  rawSlotName: string
  slotName: string
  slotFn: Slot
}

interface FormSlots {
  formItemSlots: ProcessedSlot[]
  dynamicComponentSlots: Map<string, ProcessedSlot[]>
}

interface Props {
  formItem: FormItem
  index: number
  formData?: Record<string, any>
  dynamicCompEvents: Record<string, (...args: any[]) => any>
  formSlots?: FormSlots
}

interface Emits {
  <T extends Record<string, any>, K extends keyof T>(e: 'change', extendedParams: Omit<EventExtendedParams, 'index'>, value: T[K]): void
}

defineOptions({ name: 'ElementPlusKitFormItem' })

const props = withDefaults(defineProps<Props>(), {
  formData: () => ({}),
  formSlots: () => ({ formItemSlots: [], dynamicComponentSlots: new Map() }),
})

const emit = defineEmits<Emits>()

const modelValue = defineModel()

/** 提取 el-form-item 的属性（排除表单组件自定义的配置） */
const formItemProps = computed(() => {
  const excludedKeysSet = new Set(FORM_ITEM_EXCLUDED_KEYS)
  return Object.fromEntries(
    Object.entries(props.formItem).filter(([key]) => !excludedKeysSet.has(key as typeof FORM_ITEM_EXCLUDED_KEYS[number])),
  )
})

/** 获取 el-form-item 的插槽 */
const formItemSlots = computed(() => props.formSlots.formItemSlots)

/** 根据组件类型配置解析出对应的 Element Plus 组件，未匹配时使用 div 作为降级 */
const resolvedComponent = computed(() => FORM_ITEM_COMP_MAP[props.formItem.comp] || 'div')

/** 事件拓展参数 */
const eventExtendedParams = computed(() => ({ prop: props.formItem.prop, formItem: props.formItem, index: props.index }))

/**
 * 创建动态事件处理器
 * 扩展参数 {prop, formItem} 作为第一个参数传递给事件处理器
 *
 * ⚠️ 事件处理限制：
 * - change 事件不能在这里动态处理，否则会与原生 change 事件冲突导致重复触发
 * - 原生 change 事件会冒泡到父组件，这里只处理非 change 的自定义事件
 */
const dynamicEventHandlers = computed(() => {
  return Object.fromEntries(
    Object.entries(props.dynamicCompEvents).map(([eventName, handler]) => [
      eventName,
      (...args: any[]) => handler(eventExtendedParams.value, ...args),
    ]),
  )
})

/** 解析后的 options 值 */
const resolvedOptions = ref<any[]>([])

/** options 加载状态 */
const isOptionsLoading = ref(false)

/** 检查值是否为空 */
const isEmpty = (val: any) => val == null || val === ''

/** 清空当前字段的值并触发 change 事件 */
function clearValueAndEmit() {
  if (!isEmpty(modelValue.value)) {
    modelValue.value = undefined
    emit('change', eventExtendedParams.value, undefined)
  }
}

/** 处理后的组件属性（包含默认值和用户配置） */
const processedCompAttrs = computed(() => {
  const defaults = COMPONENT_DEFAULT_CONFIG.getDefaults(props.formItem)
  const compAttrs = props.formItem.compAttrs ?? {}

  return {
    ...defaults,
    ...compAttrs,
    ...dynamicEventHandlers.value,
    options: resolvedOptions.value,
    ...(isOptionsLoading.value && { loading: true }),
  }
})

/** 根据 prop 获取对应的动态组件插槽 */
const getDynamicComponentSlots = (prop: string) => props.formSlots.dynamicComponentSlots.get(prop)

/** 执行 loader 函数（支持同步和异步） */
async function executeLoader(loader: OptionsLoader, formData: Record<string, any>) {
  try {
    const result = await loader(formData)
    return Array.isArray(result) ? result : []
  }
  catch (error) {
    console.error(`[FormItem] Failed to load options for field "${props.formItem.prop}":`, error)
    return []
  }
}

/** 加载 options */
async function loadOptions() {
  const { compAttrs } = props.formItem
  if (!compAttrs?.options)
    return

  const options = compAttrs.options

  // 静态模式（数组）：已在 watchEffect 中处理
  if (Array.isArray(options))
    return

  isOptionsLoading.value = true
  try {
    // 函数模式
    if (typeof options === 'function')
      return resolvedOptions.value = (await executeLoader(options, props.formData ?? {}))

    // 对象模式
    if (typeof options === 'object' && typeof (options as OptionsConfig).loader === 'function') {
      const { loader, deps = [] } = options as OptionsConfig
      const formData = props.formData ?? {}
      const depsValues = getDepsValues(deps, formData, props.formItem.prop)
      return resolvedOptions.value = (await executeLoader(loader, { ...formData, ...depsValues }))
    }
  }
  finally {
    isOptionsLoading.value = false
  }
}

/** 获取 options 配置的依赖列表（排除自身并去重） */
const optionsDeps = computed(() => {
  const { compAttrs } = props.formItem
  const options = compAttrs?.options
  if (!options || typeof options !== 'object' || typeof (options as OptionsConfig).loader !== 'function')
    return []

  return processDeps((options as OptionsConfig).deps ?? [], props.formItem.prop)
})

/** 检查依赖值是否发生变化 */
function checkDepsChanged(newValues: any[], oldValues: any[] | undefined): boolean {
  // 初始化时不重置
  if (!oldValues)
    return false

  // 长度不同，说明依赖项发生了变化
  if (newValues.length !== oldValues.length)
    return true

  // 检查是否有依赖项的值发生变化
  return newValues.some((newValue, index) => newValue !== oldValues[index])
}

/** 监听依赖变化（仅对象模式，且配置了 deps） */
watch(
  () => optionsDeps.value.map(dep => props.formData?.[dep]),
  (newValues, oldValues) => {
    const { compAttrs } = props.formItem
    const options = compAttrs?.options
    if (!options || typeof options !== 'object' || typeof (options as OptionsConfig).loader !== 'function')
      return

    // 依赖项的值改变了就重置当前项
    if (checkDepsChanged(newValues, oldValues))
      clearValueAndEmit()

    // 重新加载 options
    loadOptions()
  },
  { deep: true },
)

/** 使用 watchEffect 自动追踪外部 ref 依赖 */
watchEffect(() => {
  const { compAttrs } = props.formItem
  if (!compAttrs?.options)
    return

  const options = compAttrs.options

  // 静态模式（数组）：直接设置到 resolvedOptions
  if (Array.isArray(options)) {
    resolvedOptions.value = options
    return
  }

  // 函数模式：自动追踪外部 ref
  if (typeof options === 'function') {
    loadOptions()
    return
  }

  // 对象模式：根据 immediate 和 deps 决定是否自动加载
  if (options && typeof options === 'object' && typeof options.loader === 'function') {
    const { immediate = true, deps = [] } = options as OptionsConfig

    // 如果 immediate 为 false 且没有 deps，不自动加载（等待依赖变化）
    if (!immediate && deps.length === 0)
      return

    // 执行 loader 时会自动追踪外部 ref
    if (immediate)
      loadOptions()
  }
}, { flush: 'post' })
</script>

<template>
  <ElFormItem v-bind="formItemProps">
    <!-- el-form-item slots -->
    <template v-for="(slot, slotIndex) in formItemSlots" :key="`${slot.rawSlotName}-${slotIndex}`" #[slot.slotName]="slotProps">
      <component :is="slot.slotFn" :value="modelValue" :form="formData" :form-item="formItem" v-bind="slotProps" />
    </template>
    <!-- 标准组件 -->
    <template v-if="formItem.comp !== 'custom'">
      <component
        :is="resolvedComponent"
        v-bind="processedCompAttrs"
        v-model="modelValue"
        @change="$emit('change', eventExtendedParams, $event)"
      >
        <!-- dynamic component slots -->
        <template v-for="(slot, slotIndex) in getDynamicComponentSlots(formItem.prop) ?? []" :key="`${slot.rawSlotName}-${slotIndex}`" #[slot.slotName]="slotProps">
          <component :is="slot.slotFn" :value="modelValue" :form="formData" :form-item="formItem" v-bind="slotProps" />
        </template>
      </component>
    </template>
    <!-- 自定义组件 -->
    <template v-else>
      <slot :name="formItem.prop" :value="modelValue" :form="formData" :form-item="formItem" />
    </template>
  </ElFormItem>
</template>
