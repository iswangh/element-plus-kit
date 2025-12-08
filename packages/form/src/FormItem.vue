<!-- eslint-disable ts/no-explicit-any -->
<script setup lang='ts'>
import type { Slot } from 'vue'
import type { FormItem, FormItemEventExtendedParams, OptionsLoaderConfig, OptionsLoaderFn } from './types'
import { ElFormItem } from 'element-plus'
import { computed, nextTick, ref, watch, watchEffect } from 'vue'
import { useChangeEventState, useClearState } from './composables'
import { COMP_DEFAULT_CONFIG, FORM_ITEM_COMP_MAP, FORM_ITEM_EXCLUDED_KEYS } from './config'
import { checkValueInOptions, getDepsValues, isEmpty, isOptionsConfig, processDeps } from './utils'

interface ProcessedSlot {
  rawSlotName: string
  slotName: string
  slotFn: Slot
}

interface FormSlots {
  formItemSlots: Map<string, ProcessedSlot[]> // 按字段处理的 FormItem 插槽（包含命名插槽和默认插槽）
  dynamicCompSlots: Map<string, ProcessedSlot[]>
}

interface Props {
  formItem: FormItem
  index: number
  formData?: Record<string, any>
  dynamicCompEvents: Record<string, (...args: any[]) => any>
  formSlots?: FormSlots
}

interface Emits {
  <T extends Record<string, any>, K extends keyof T>(e: 'change', extendedParams: Omit<FormItemEventExtendedParams, 'index'>, value: T[K]): void
}

defineOptions({ name: 'ElementPlusKitFormItem' })

const props = withDefaults(defineProps<Props>(), {
  formData: () => ({}),
  formSlots: () => ({ formItemSlots: new Map(), dynamicCompSlots: new Map() }),
})

const emit = defineEmits<Emits>()

const modelValue = defineModel()

/** 提取 el-form-item 的属性（排除表单组件自定义的配置） */
const formItemProps = computed(() => {
  return Object.fromEntries(
    Object.entries(props.formItem).filter(([key]) => !FORM_ITEM_EXCLUDED_KEYS.includes(key as typeof FORM_ITEM_EXCLUDED_KEYS[number])),
  )
})

/** 获取 FormItem 插槽（命名插槽和默认插槽） */
const formItemSlots = computed(() => {
  const all = props.formSlots.formItemSlots.get(props.formItem.prop) ?? []
  return {
    named: all.filter(slot => slot.slotName !== 'default'),
    default: all.find(slot => slot.slotName === 'default'),
  }
})

/** 根据组件类型配置解析出对应的 Element Plus 组件，未匹配时使用 div 作为降级 */
const resolvedComp = computed(() => FORM_ITEM_COMP_MAP[props.formItem.compType] || 'div')

/** 事件扩展参数 */
const eventExtendedParams = computed(() => ({ prop: props.formItem.prop, formItem: props.formItem, index: props.index }))

/**
 * 创建动态事件处理器（来自 WForm 标签的事件，向后兼容）
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

/** 动态加载的 options 值（仅存储通过 optionsLoader 加载的结果） */
const loadedOptions = ref<any[]>([])

/** options 加载状态 */
const loadOptionsLoading = ref(false)

/** 解析后的 options 值（统一处理静态 options 和动态 optionsLoader 的优先级逻辑） */
const resolvedOptions = computed(() => {
  const compProps = props.formItem.compProps ?? {}
  const { options } = compProps
  const hasOptions = 'options' in compProps
  const hasOptionsLoader = 'optionsLoader' in compProps

  // 如果配置了 optionsLoader（动态加载），优先使用动态加载的结果
  if (hasOptionsLoader) {
    // 已加载完成（有数据）或加载失败/未开始（空数组）：使用动态加载的结果
    if (loadedOptions.value.length > 0 || !loadOptionsLoading.value)
      return loadedOptions.value
    // 加载中时，如果有静态 options 则使用作为初始值，提供更好的用户体验
    // 如果配置了 options 属性，即使值为 undefined，也应该返回空数组（表示有配置但为空）
    return hasOptions ? (options ?? []) : []
  }

  // 没有 optionsLoader，使用静态数组
  // 如果配置了 options 属性，即使值为 undefined，也应该返回空数组（表示有配置但为空）
  return hasOptions ? (options ?? []) : undefined
})

// Change 事件状态管理（仅用于防止重复触发 change 事件）
const changeEventState = useChangeEventState()

// 清理状态管理（用于管理依赖变更时的清理操作，支持用户在 change 事件中设置默认值）
const clearState = useClearState()

/**
 * 处理用户交互的 change 事件
 * @param event - change 事件的值
 */
function onChange(event: any) {
  changeEventState.start()
  emit('change', eventExtendedParams.value, event)
  // 在下一个 tick 时重置标志，避免影响 watch modelValue 的判断
  nextTick(() => {
    changeEventState.end()
  })
}

/** 处理后的组件属性（包含默认值和用户配置） */
const processedCompProps = computed(() => {
  const defaults = COMP_DEFAULT_CONFIG.getDefaults(props.formItem)
  const compProps = props.formItem.compProps ?? {}
  const { optionsLoader, slots: _compSlots, ...restCompProps } = compProps

  // 排除事件处理器的辅助函数
  const excludeEvents = (obj: Record<string, any>) => Object.fromEntries(Object.entries(obj).filter(([key]) => !key.startsWith('on')))

  // 提取事件处理器
  const compEventHandlers = Object.fromEntries(Object.entries(compProps).filter(([key, value]) => key.startsWith('on') && typeof value === 'function'))

  // 判断是否有动态加载器（用于判断是否需要 loading 状态）
  const hasOptionsLoader = 'optionsLoader' in compProps
  const isDynamic = hasOptionsLoader && (typeof optionsLoader === 'function' || isOptionsConfig(optionsLoader))

  // 排除事件处理器的属性
  const excludedDefaults = excludeEvents(defaults)
  const excludedRestCompProps = excludeEvents(restCompProps)

  return {
    ...excludedDefaults,
    ...excludedRestCompProps,
    ...dynamicEventHandlers.value,
    ...compEventHandlers,
    ...(resolvedOptions.value != null && { options: resolvedOptions.value, ...(isDynamic && { loading: loadOptionsLoading.value }) }),
  }
})

/** 获取动态组件插槽（已在 Form.vue 中合并配置插槽和模板插槽） */
function getDynamicCompSlots(prop: string) {
  const slots = props.formSlots.dynamicCompSlots.get(prop)
  return slots && slots.length > 0 ? slots : undefined
}

/**
 * 执行 optionsLoader 函数（支持同步和异步）
 * @param loader - 选项加载器函数
 * @param formData - 表单数据
 * @returns 选项数组
 */
async function executeOptionsLoader(loader: OptionsLoaderFn, formData: Record<string, any>) {
  try {
    const result = await loader(formData)
    return Array.isArray(result) ? result : []
  }
  catch (error) {
    console.error(`[FormItem] 加载字段 "${props.formItem.prop}" 的选项失败:`, error)
    return []
  }
}

/** 获取对象模式的 optionsLoader 配置（非对象模式时返回 null） */
function getOptionsLoaderConfig(): OptionsLoaderConfig | null {
  const optionsLoader = props.formItem.compProps?.optionsLoader
  return isOptionsConfig(optionsLoader) ? optionsLoader : null
}

/**
 * 清空当前字段的值（仅负责把值变成 undefined，不直接 emit change）
 *
 * 核心思路：
 * - 依赖字段变化时，先标记当前值为「待清空」
 * - 真正清空放在 nextTick，给外层 @change 回调机会写入「新默认值」
 * - 如果外层在依赖变更过程中写入了新值（hasUserValue），则不再清空，避免覆盖业务逻辑
 * - 是否触发 change(undefined) 或 change(新值)，由后面的 watch(modelValue) 统一处理
 */
function clearValue() {
  // 已经是空值就不用处理了
  if (isEmpty(modelValue.value))
    return

  // 延迟到下一个 tick 再真正清空：
  // - 先让依赖字段的 @change 回调（可能设置默认值）执行
  // - 如果用户在回调里设置了新值（clearState.hasUserValue = true），就不再清空
  const prev = modelValue.value
  nextTick(() => {
    // 依赖变更过程中已经设置了新值，保持新值，不再清空
    if (clearState.changing && clearState.hasUserValue)
      return

    // 如果期间值已经被其它逻辑改掉（例如手动重置），不再重复清空
    if (modelValue.value !== prev)
      return

    modelValue.value = undefined
  })
}

/**
 * 检查当前值是否在新的选项中，如果不在则清理（仅选择类组件）
 * 输入类组件（如 mention）允许输入任意文本，不需要自动清理
 * @param options - 选项数组
 */
function clearIfNotInOptions(options: any[]) {
  const { formItem } = props

  // 输入类组件允许输入任意文本，不需要自动清理
  const compTypeCategory = COMP_DEFAULT_CONFIG.getCompType(formItem.compType)
  if (compTypeCategory === 'input')
    return

  // 如果当前值在新的选项中存在，不需要清理
  if (checkValueInOptions({ modelValue: modelValue.value, options, formItem }))
    return

  clearValue()
}

/**
 * 加载 options（函数模式 / 对象模式）
 *
 * @param isDependencyChange - 是否由依赖字段变更触发：
 * - true：先通过 clearValue 清空当前值，再按最新依赖重新加载 options
 * - false：仅基于当前 formData 加载 options，并根据新 options 决定是否清理当前值
 */
async function loadOptions(isDependencyChange = false) {
  const optionsLoader = props.formItem.compProps?.optionsLoader
  // optionsLoader 为空时不需要处理（静态数组不会调用此函数）
  if (!optionsLoader)
    return

  // 依赖变更时，先清理（允许用户在 change 事件中设置默认值）
  if (isDependencyChange) {
    clearState.start()
    clearValue()
    // 等待清理完成，确保用户在 change 事件中设置的值不会被后续清理
    await nextTick()
  }

  loadOptionsLoading.value = true
  try {
    const formData = props.formData ?? {}

    let result: any[]

    // 根据 optionsLoader 类型选择处理方式
    const loaderType = typeof optionsLoader === 'function' ? 'function' : isOptionsConfig(optionsLoader) ? 'config' : 'unknown'
    switch (loaderType) {
      case 'function':
        result = await executeOptionsLoader(optionsLoader, formData)
        break
      case 'config': {
        const { loader, deps = [] } = optionsLoader
        const depsValues = getDepsValues(deps, formData, props.formItem.prop)
        result = await executeOptionsLoader(loader, { ...formData, ...depsValues })
        break
      }
      default:
        return
    }

    loadedOptions.value = result

    // 依赖变更时已清理过，不再清理（允许用户在 change 事件中设置的值）
    if (!isDependencyChange)
      clearIfNotInOptions(result)
  }
  finally {
    loadOptionsLoading.value = false
    if (isDependencyChange)
      clearState.end()
  }
}

/** 获取 optionsLoader 配置的依赖列表（排除自身并去重，用于内部 watch） */
const optionsDeps = computed(() => {
  const config = getOptionsLoaderConfig()
  return config ? processDeps(config.deps ?? [], props.formItem.prop) : []
})

/** 获取 optionsLoader 配置的 immediate 选项（缺省视为 false） */
const optionsImmediate = computed(() => {
  const config = getOptionsLoaderConfig()
  return config ? (config.immediate ?? false) : false
})

/** 监听对象模式 optionsLoader 的字段依赖（仅当配置了 deps 时生效） */
watch(
  () => {
    // 使用对象包装依赖字段，确保 watch 能正确追踪每个依赖字段的变化
    const deps = optionsDeps.value
    return Object.fromEntries(deps.map(dep => [dep, props.formData?.[dep]]))
  },
  () => {
    const config = getOptionsLoaderConfig()
    if (!config)
      return

    // 依赖变更时：先清理当前字段值（支持在 change 中设置默认值），然后基于新依赖重新加载 options
    loadOptions(true)
  },
  { deep: true, immediate: optionsImmediate.value },
)

/** 使用 watchEffect 自动追踪 optionsLoader 中的外部依赖（函数模式 / 对象模式通用） */
watchEffect(() => {
  const optionsLoader = props.formItem.compProps?.optionsLoader
  if (!optionsLoader)
    return

  // 函数模式：直接调用 loadOptions，watchEffect 会自动追踪 loadOptions 内部调用的 loader 中访问的外部 ref
  if (typeof optionsLoader === 'function')
    return loadOptions()

  // 对象模式：根据 immediate 和 deps 决定是否自动加载
  if (isOptionsConfig(optionsLoader)) {
    const { immediate = false, deps = [] } = optionsLoader

    // 配置了 deps 时，内部依赖通过 watch 监听，外部依赖（通过闭包访问）通过 watchEffect 追踪
    // 注意：内部依赖变化时，watch 会触发 loadOptions，这里只处理外部依赖变化的情况
    if (deps.length > 0) {
      // 有 deps 时，如果 immediate 为 true，直接调用 loadOptions（watchEffect 会自动追踪 loadOptions 内部调用的 loader）
      // 如果 immediate 为 false，只调用 loader 来追踪外部依赖（不处理返回值，不加载数据）
      if (immediate) {
        loadOptions()
      }
      else {
        // immediate 为 false 时，只追踪外部依赖，不加载数据
        const { loader } = optionsLoader
        const formData = props.formData ?? {}
        const depsValues = getDepsValues(deps, formData, props.formItem.prop)
        try {
          // 调用 loader 来触发 watchEffect 的依赖追踪（不处理返回值）
          loader({ ...formData, ...depsValues })
        }
        catch {
        // 忽略错误，这里只用于追踪依赖
        }
      }
      return
    }

    // immediate 为 false 且没有 deps 时，不自动加载（等待依赖变化）
    if (!immediate)
      return

    // 没有 deps 时，直接调用 loadOptions，watchEffect 会自动追踪 loadOptions 内部调用的 loader 中访问的外部 ref
    loadOptions()
  }
})

/** 监听 modelValue 的变化，处理程序化设置值的情况 */
watch(
  () => modelValue.value,
  (newValue, oldValue) => {
    // 用户交互已在 @change 中处理，不需要重复触发
    if (changeEventState.isUser)
      return

    // 正在处理依赖变更时，需要特殊处理
    if (clearState.changing) {
      // 依赖变更导致值被清空：
      // - 旧值非空，新值为空，且用户没有在 change 回调中设置新值：触发一次 change(undefined)
      if (isEmpty(newValue)) {
        if (!isEmpty(oldValue) && !clearState.hasUserValue)
          emit('change', eventExtendedParams.value, undefined)
        return
      }

      // 依赖变更过程中，用户在 change 回调中设置了新值：
      // 只触发一次 change(新值)，并标记 hasUserValue，避免后续清空
      clearState.markValue()
      emit('change', eventExtendedParams.value, newValue)
      return
    }

    // 值发生变化时，触发 change 事件（与 Element Plus 行为保持一致："选中值发生变化时触发"）
    // 注意：初始化时（oldValue 为 undefined）如果设置了值，也应该触发 change
    if (newValue !== oldValue)
      emit('change', eventExtendedParams.value, newValue)
  },
)
</script>

<template>
  <ElFormItem v-bind="formItemProps">
    <!-- el-form-item 命名插槽（label、error 等） -->
    <template v-for="(slot, slotIndex) in formItemSlots.named" :key="`${slot.rawSlotName}-${slotIndex}`" #[slot.slotName]="slotProps">
      <!-- 使用 span 包裹确保只有一个根元素，避免 TransitionGroup 警告 -->
      <span v-if="slot.slotName === 'error'">
        <component :is="slot.slotFn" v-bind="{ value: modelValue, form: formData, formItem, ...slotProps }" />
      </span>
      <component :is="slot.slotFn" v-else v-bind="{ value: modelValue, form: formData, formItem, ...slotProps }" />
    </template>
    <!-- Element Plus 标准组件 -->
    <template v-if="formItem.compType !== 'custom'">
      <component
        :is="resolvedComp"
        v-bind="processedCompProps"
        v-model="modelValue"
        @change="onChange"
      >
        <!-- 动态组件插槽 -->
        <template v-for="(slot, slotIndex) in getDynamicCompSlots(formItem.prop) ?? []" :key="`${slot.rawSlotName}-${slotIndex}`" #[slot.slotName]="slotProps">
          <component :is="slot.slotFn" v-bind="{ value: modelValue, form: formData, formItem, ...slotProps }" />
        </template>
      </component>
    </template>
    <!-- 自定义组件（使用 el-form-item 默认插槽） -->
    <template v-else-if="formItem.compType === 'custom'">
      <component
        :is="formItemSlots.default.slotFn"
        v-if="formItemSlots.default"
        v-bind="{ value: modelValue, form: formData, formItem }"
      />
    </template>
  </ElFormItem>
</template>
