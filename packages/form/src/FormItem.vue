<!-- eslint-disable ts/no-explicit-any -->
<script setup lang='ts'>
import type { Slot } from 'vue'
import type { EventExtendedParams, FormItem } from './types'
import { computed } from 'vue'
import { COMPONENT_DEFAULT_CONFIG, FORM_ITEM_COMP_MAP, FORM_ITEM_EXCLUDED_KEYS } from './config'

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

defineEmits<Emits>()

const modelValue = defineModel()

/**
 * 提取表单项的属性（排除特定的键）
 * @returns 不包含排除键的属性对象
 */
function extractFormItemProps() {
  const excludedKeysSet = new Set(FORM_ITEM_EXCLUDED_KEYS)
  return Object.fromEntries(
    Object.entries(props.formItem).filter(([key]) => !excludedKeysSet.has(key as typeof FORM_ITEM_EXCLUDED_KEYS[number])),
  )
}

/** 提取 el-form-item 的属性（排除表单组件自定义的配置） */
const formItemProps = computed(() => extractFormItemProps())

/** 获取 el-form-item 的插槽 */
const formItemSlots = computed(() => props.formSlots.formItemSlots)

/** 根据组件类型配置解析出对应的 Element Plus 组件，未匹配时使用 div 作为降级 */
const resolvedComponent = computed(() => FORM_ITEM_COMP_MAP[props.formItem.comp] || 'div')

/** 事件拓展参数 */
const eventExtendedParams = computed(() => {
  const { formItem, index } = props
  return { prop: formItem.prop, formItem, index }
})

/**
 * 创建动态事件处理器
 *
 * 扩展参数 {prop, formItem} 作为第一个参数传递给事件处理器
 *
 * ⚠️ 事件处理限制：
 * - change 事件不能在这里动态处理，否则会与原生 change 事件冲突导致重复触发
 * - 原生 change 事件会冒泡到父组件，这里只处理非 change 的自定义事件
 *
 * @returns 处理后的动态事件处理器
 */
function createDynamicEventHandlers(): Record<string, (...args: any[]) => any> {
  const handlers: Record<string, (...args: any[]) => any> = {}

  for (const [eventName, handler] of Object.entries(props.dynamicCompEvents)) {
    // 确保第一的参数为 拓展参数
    handlers[eventName] = (...args: any[]) => handler(eventExtendedParams.value, ...args)
  }

  return handlers
}

const dynamicEventHandlers = computed(() => createDynamicEventHandlers())

/** 处理后的组件属性（包含默认值和用户配置） */
const processedCompAttrs = computed(() => ({ ...COMPONENT_DEFAULT_CONFIG.getDefaults(props.formItem), ...dynamicEventHandlers.value }))

/** 根据 prop 获取对应的动态组件插槽 */
const dynamicComponentSlots = computed(() => (prop: string) => props.formSlots.dynamicComponentSlots.get(prop))
</script>

<template>
  <el-form-item v-bind="formItemProps">
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
        <template v-for="(slot, slotIndex) in dynamicComponentSlots(formItem.prop)" :key="`${slot.rawSlotName}-${slotIndex}`" #[slot.slotName]="slotProps">
          <component :is="slot.slotFn" :value="modelValue" :form="formData" :form-item="formItem" v-bind="slotProps" />
        </template>
      </component>
    </template>
    <!-- 自定义组件 -->
    <template v-else>
      <slot :name="formItem.prop" :value="modelValue" :form="formData" :form-item="formItem" />
    </template>
  </el-form-item>
</template>
