<!-- eslint-disable ts/no-explicit-any -->
<script setup lang='ts'>
import type { Slot } from 'vue'
import type { FormItem, FormItemExtendedEventParams, OptionsConfig, OptionsLoader } from './types'
import { ElFormItem } from 'element-plus'
import { computed, nextTick, ref, watch, watchEffect } from 'vue'
import { useChangeEventState } from './composables'
import { COMP_DEFAULT_CONFIG, FORM_ITEM_COMP_MAP, FORM_ITEM_EXCLUDED_KEYS } from './config'
import { checkValueInOptions, getDepsValues, isEmpty, isOptionsConfig, processDeps } from './utils'

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
  <T extends Record<string, any>, K extends keyof T>(e: 'change', extendedParams: Omit<FormItemExtendedEventParams, 'index'>, value: T[K]): void
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
const resolvedComp = computed(() => FORM_ITEM_COMP_MAP[props.formItem.comp] || 'div')

/** 事件扩展参数 */
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

// Change 事件状态管理
const changeEventState = useChangeEventState()

/**
 * 清空当前字段的值并触发 change 事件
 */
function clearValueAndEmit() {
  if (!isEmpty(modelValue.value)) {
    // 如果正在清理，避免重复触发
    if (changeEventState.isClearing)
      return

    // 记录清理前的值并设置清理状态
    changeEventState.startClearing(modelValue.value)

    // 清空值并触发 change 事件
    modelValue.value = undefined
    emit('change', eventExtendedParams.value, undefined)

    // 使用 nextTick 确保在下一个 tick 时重置标志，避免影响后续的正常 change 事件
    nextTick(() => {
      changeEventState.endClearing()
    })
  }
}

/**
 * 处理用户交互的 change 事件
 * @param event - change 事件的值
 */
function onChange(event: any) {
  // 如果正在清理，说明是程序化清理操作，不需要触发用户交互的 change 事件
  if (!changeEventState.isClearing) {
    changeEventState.startUserInteraction()
    emit('change', eventExtendedParams.value, event)
    // 使用 nextTick 确保在下一个 tick 时重置标志，避免影响 watch modelValue 的判断
    nextTick(() => {
      changeEventState.endUserInteraction()
    })
  }
}

/** 处理后的组件属性（包含默认值和用户配置） */
const processedCompProps = computed(() => {
  const defaults = COMP_DEFAULT_CONFIG.getDefaults(props.formItem)
  const compProps = props.formItem.compProps ?? {}

  // 只有当 compProps 中有 options 字段时，才设置 options 属性
  const hasOptions = 'options' in compProps

  return {
    ...defaults,
    ...compProps,
    ...dynamicEventHandlers.value,
    ...(hasOptions && {
      options: resolvedOptions.value,
      loading: isOptionsLoading.value,
    }),
  }
})

/** 根据 prop 获取对应的动态组件插槽 */
function getDynamicComponentSlots(prop: string) {
  return props.formSlots.dynamicComponentSlots.get(prop)
}

/**
 * 执行 loader 函数（支持同步和异步）
 * @param loader - 选项加载器函数
 * @param formData - 表单数据
 * @returns 选项数组
 */
async function executeLoader(loader: OptionsLoader, formData: Record<string, any>) {
  try {
    const result = await loader(formData)
    return Array.isArray(result) ? result : []
  }
  catch (error) {
    console.error(`[FormItem] 加载字段 "${props.formItem.prop}" 的选项失败:`, error)
    return []
  }
}

/**
 * 获取对象模式的 options 配置
 * @returns 对象模式配置或 null
 */
function getOptionsConfig(): OptionsConfig | null {
  const options = props.formItem.compProps?.options
  return isOptionsConfig(options) ? options : null
}

/**
 * 加载 options
 * 支持函数模式和对象模式，自动处理依赖和异步加载
 * 加载完成后自动检查并清理无效值（仅当当前值不在新选项中时才清理）
 *
 * 智能清理逻辑：
 * - 如果当前值在新的选项中，保留（支持用户在 change 事件中设置的默认值）
 * - 如果当前值不在新的选项中，自动清理并触发 change 事件
 */
async function loadOptions() {
  const options = props.formItem.compProps?.options
  if (!options)
    return

  // 静态模式（数组）：已在 watchEffect 中处理
  if (Array.isArray(options))
    return

  isOptionsLoading.value = true
  try {
    // 函数模式
    if (typeof options === 'function') {
      const newOptions = await executeLoader(options, props.formData ?? {})
      resolvedOptions.value = newOptions
      // 加载完成后，智能检查并清理：如果当前值不在新选项中，才清理
      if (!checkValueInOptions(modelValue.value, newOptions)) {
        clearValueAndEmit()
      }
    }
    // 对象模式
    else if (isOptionsConfig(options)) {
      const { loader, deps = [] } = options
      const formData = props.formData ?? {}
      const depsValues = getDepsValues(deps, formData, props.formItem.prop)
      const newOptions = await executeLoader(loader, { ...formData, ...depsValues })
      resolvedOptions.value = newOptions
      // 加载完成后，智能检查并清理：如果当前值不在新选项中，才清理
      if (!checkValueInOptions(modelValue.value, newOptions)) {
        clearValueAndEmit()
      }
    }
  }
  finally {
    isOptionsLoading.value = false
  }
}

/**
 * 处理静态模式 options（数组）
 * @param options - 选项数组
 */
function handleStaticOptions(options: any[]) {
  resolvedOptions.value = options
  // 检查当前值是否在新的选项中，如果不在则清理
  if (!checkValueInOptions(modelValue.value, options))
    clearValueAndEmit()
}

/**
 * 处理函数模式 options
 */
function handleFunctionOptions() {
  loadOptions()
}

/**
 * 处理对象模式 options
 * @param config - 对象模式配置
 */
function handleObjectOptions(config: OptionsConfig) {
  const { immediate = false, deps = [], loader } = config

  // 如果配置了 deps，内部依赖通过 watch 监听，但外部依赖（通过闭包访问）仍需要通过 watchEffect 追踪
  // 所以即使配置了 deps，也需要追踪外部依赖
  // 注意：内部依赖变化时，watch 会触发 loadOptions，这里只处理外部依赖变化的情况
  if (deps.length > 0) {
    // 追踪外部依赖：同步调用 loader 函数来追踪外部 ref（watchEffect 会追踪 loader 中访问的外部 ref）
    // 注意：这里只用于追踪依赖，不处理返回值
    const formData = props.formData ?? {}
    const depsValues = getDepsValues(deps, formData, props.formItem.prop)
    try {
      loader({ ...formData, ...depsValues })
    }
    catch {
      // 忽略错误，这里只用于追踪依赖
    }
    // 如果 immediate 为 true，执行 loadOptions 来加载选项
    if (immediate)
      loadOptions()
    return
  }

  // 如果 immediate 为 false 且没有 deps，不自动加载（等待依赖变化）
  if (!immediate)
    return

  // 执行 loader 时会自动追踪外部 ref（没有 deps 时）
  loadOptions()
}

/** 获取 options 配置的依赖列表（排除自身并去重） */
const optionsDeps = computed(() => {
  const config = getOptionsConfig()
  return config ? processDeps(config.deps ?? [], props.formItem.prop) : []
})

/** 获取 options 配置的 immediate 选项 */
const optionsImmediate = computed(() => {
  const config = getOptionsConfig()
  return config ? (config.immediate ?? false) : false
})

/** 监听依赖变化（仅对象模式，且配置了 deps） */
watch(
  () => {
    // 创建一个对象来追踪依赖字段的值，确保 watch 能正确追踪变化
    const deps = optionsDeps.value
    const result: Record<string, any> = {}
    for (const dep of deps) {
      result[dep] = props.formData?.[dep]
    }
    return result
  },
  () => {
    const config = getOptionsConfig()
    if (!config)
      return

    // 重新加载 options（loadOptions 内部会检查并清理无效值，并触发 change 事件）
    loadOptions()
  },
  { deep: true, immediate: optionsImmediate.value },
)

/** 使用 watchEffect 自动追踪外部 ref 依赖 */
watchEffect(() => {
  const options = props.formItem.compProps?.options
  if (!options)
    return

  // 静态模式
  if (Array.isArray(options)) {
    handleStaticOptions(options)
    return
  }

  // 函数模式：自动追踪外部 ref
  if (typeof options === 'function') {
    handleFunctionOptions()
    return
  }

  // 对象模式：根据 immediate 和 deps 决定是否自动加载
  if (isOptionsConfig(options)) {
    handleObjectOptions(options)
  }
})

/** 监听 modelValue 的变化，处理程序化设置值的情况 */
watch(
  () => modelValue.value,
  (newValue, oldValue) => {
    // 如果是清理操作，已经在 clearValueAndEmit 中处理了 change 事件，不需要重复触发
    if (changeEventState.isClearingOperation(oldValue, newValue, isEmpty))
      return

    // 如果是用户交互，已经在 @change 中处理了，不需要重复触发
    if (changeEventState.isUserInteraction)
      return

    // 如果值发生变化，说明是外部程序化设置的值，需要触发 change 事件
    // 与 Element Plus 的行为保持一致："选中值发生变化时触发"
    // 注意：初始化时（oldValue 为 undefined）如果设置了值，也应该触发 change
    if (newValue !== oldValue) {
      emit('change', eventExtendedParams.value, newValue)
    }
  },
)
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
        :is="resolvedComp"
        v-bind="processedCompProps"
        v-model="modelValue"
        @change="onChange"
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
