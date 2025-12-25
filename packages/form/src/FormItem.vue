<!-- eslint-disable ts/no-explicit-any -->
<script setup lang='ts'>
import type { Slot } from 'vue'
import type { FormItem, FormItemEventExtendedParams } from './types'
import { ElFormItem } from 'element-plus'
import { computed, nextTick, watch } from 'vue'
import { useChangeEventState } from './composables'
import { COMP_DEFAULT_CONFIG, FORM_ITEM_COMP_MAP, FORM_ITEM_EXCLUDED_KEYS } from './config'

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
  return Object.fromEntries(Object.entries(props.formItem).filter(([key]) => !FORM_ITEM_EXCLUDED_KEYS.includes(key as typeof FORM_ITEM_EXCLUDED_KEYS[number])))
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

// Change 事件状态管理（仅用于防止重复触发 change 事件）
const changeEventState = useChangeEventState()

/**
 * 处理用户交互的 change 事件
 * @param event - change 事件的值
 */
function onChange(event: any) {
  changeEventState.start()
  emit('change', eventExtendedParams.value, event)
  // 在下一个 tick 时重置标志，避免影响 watch modelValue 的判断
  nextTick(() => changeEventState.end())
}

/** 处理后的组件属性（包含默认值和用户配置） */
const processedCompProps = computed(() => {
  const defaults = COMP_DEFAULT_CONFIG.getDefaults(props.formItem)
  const compProps = props.formItem.compProps ?? {}
  const { optionsLoader: _optionsLoader, slots: _compSlots, ...restCompProps } = compProps as any

  // 排除事件处理器的辅助函数
  const excludeEvents = (obj: Record<string, any>) => Object.fromEntries(Object.entries(obj).filter(([key]) => !key.startsWith('on')))

  // 提取事件处理器
  const compEventHandlers = Object.fromEntries(Object.entries(compProps).filter(([key, value]) => key.startsWith('on') && typeof value === 'function'))

  // 排除事件处理器的属性
  const excludedDefaults = excludeEvents(defaults)
  const excludedRestCompProps = excludeEvents(restCompProps)

  return {
    ...excludedDefaults,
    ...excludedRestCompProps,
    ...dynamicEventHandlers.value,
    ...compEventHandlers,
  }
})

/** 获取动态组件插槽（已在 Form.vue 中合并配置插槽和模板插槽） */
function getDynamicCompSlots(prop: string) {
  const slots = props.formSlots.dynamicCompSlots.get(prop)
  return slots && slots.length > 0 ? slots : undefined
}

/** 监听 modelValue 的变化，处理程序化设置值的情况 */
watch(
  () => modelValue.value,
  (newValue, oldValue) => {
    // 用户交互已在 @change 中处理，不需要重复触发
    if (changeEventState.isUserInteractionDuring)
      return

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
