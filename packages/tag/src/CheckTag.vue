<script setup lang="ts">
import type { CheckTagOption, TagFieldProps, TagValue } from './types'
import type { ElCheckTagProps, ElSpaceProps } from './types/el'
import { ElCheckTag, ElSpace } from 'element-plus'
import { computed, useAttrs } from 'vue'

interface Props extends /* @vue-ignore */ ElCheckTagProps {
  /** 选项列表 */
  options: CheckTagOption[]
  /** 是否多选（默认 false，单选） */
  multiple?: boolean
  /** 当前值（单选：TagValue，多选：TagValue[]） */
  modelValue?: TagValue | TagValue[]
  /** 字段映射配置 */
  props?: TagFieldProps
  /** Space 组件属性 */
  spaceProps?: Partial<ElSpaceProps>
  /** 是否禁用（组件级别） */
  disabled?: boolean
}

defineOptions({ name: 'WCheckTag' })

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  props: () => ({ label: 'label', value: 'value' }),
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: TagValue | TagValue[]): void
  (e: 'change', value: TagValue | TagValue[]): void
}>()

const attrs = useAttrs()

/** 基础属性（排除 CheckTag 组件特有的 props） */
const baseCheckTagProps = computed(() => {
  const baseProps = { ...props, ...attrs }
  // 排除 CheckTag 组件特有的 props 和 key（key 由 v-for 单独处理）
  const { multiple: _multiple, options: _options, modelValue: _modelValue, props: _fieldProps, onChange: _onChange, key: _key, ...elCheckTagProps } = baseProps
  return elCheckTagProps
})

/** 获取传递给 ElCheckTag 的属性 */
function getCheckTagProps(option: CheckTagOption) {
  const baseProps = baseCheckTagProps.value

  // 合并选项中的 tagProps（选项级别的属性优先级更高）
  // 同时排除 tagProps 中的 key
  if (option.tagProps) {
    const { key: _tagKey, ...tagPropsWithoutKey } = option.tagProps
    return { ...baseProps, ...tagPropsWithoutKey }
  }

  return baseProps
}

/** 单选模式：获取单个值（如果传入数组，取第一个元素） */
const singleValue = computed(() => {
  if (props.multiple)
    return undefined
  const val = props.modelValue
  return Array.isArray(val) ? val[0] : val
})

/** 单选模式：验证并清空无效值 */
const validatedSingleValue = computed(() => {
  if (props.multiple)
    return undefined
  const val = singleValue.value
  if (val == null)
    return null
  const isValid = props.options.some((opt) => {
    const optValue = opt[props.props?.value || 'value']
    return optValue === val
  })
  return isValid ? val : null
})

/** 多选模式：获取数组值 */
const multipleValues = computed(() => {
  if (!props.multiple)
    return []
  const valueArray = Array.isArray(props.modelValue) ? props.modelValue : []
  // 过滤掉不在 options 中的值
  return valueArray.filter((v) => {
    return props.options.some((opt) => {
      const optValue = opt[props.props?.value || 'value']
      return optValue === v
    })
  })
})

/** 判断选项是否被选中 */
function isChecked(optionValue: TagValue): boolean {
  if (props.multiple) {
    const currentValues = multipleValues.value
    return currentValues.includes(optionValue)
  }
  else {
    const currentValue = validatedSingleValue.value
    return currentValue === optionValue
  }
}

/** 处理标签点击 */
function handleTagClick(option: CheckTagOption, optionValue: TagValue) {
  // 组件级别禁用（使用 baseCheckTagProps.disabled，已合并 props 和 attrs）
  if (baseCheckTagProps.value.disabled)
    return
  // 选项级别禁用
  if (option.disabled)
    return

  if (props.multiple) {
    // 多选：切换选中状态
    const currentValues = multipleValues.value
    const index = currentValues.findIndex(v => v === optionValue)
    let newValues: TagValue[]
    if (index >= 0) {
      // 已选中，移除
      newValues = currentValues.filter((_, i) => i !== index)
    }
    else {
      // 未选中，添加
      newValues = [...currentValues, optionValue]
    }
    emit('update:modelValue', newValues)
    emit('change', newValues)
  }
  else {
    // 单选：切换选择（不能取消选中）
    const currentValue = validatedSingleValue.value
    if (currentValue === optionValue) {
      // 已选中，不处理（不能取消选中）
      return
    }
    // 选中新项
    emit('update:modelValue', optionValue)
    emit('change', optionValue)
  }
}

/** 获取选项的显示文本 */
function getOptionLabel(option: CheckTagOption): string {
  const labelKey = props.props?.label || 'label'
  const label = option[labelKey] as string | undefined
  return label ?? ''
}

/** 获取选项的值 */
function getOptionValue(option: CheckTagOption): TagValue {
  const valueKey = props.props?.value || 'value'
  const value = option[valueKey]
  return value as TagValue
}

/** 获取选项的 key（用于 v-for） */
function getOptionKey(option: CheckTagOption, index: number): PropertyKey {
  const value = getOptionValue(option)
  // Vue 的 key 需要是 PropertyKey（string | number | symbol），不能是 boolean
  // 将值转换为字符串，如果为 null/undefined，使用 index
  if (value == null)
    return index
  if (typeof value === 'boolean')
    return String(value)
  if (typeof value === 'string' || typeof value === 'number')
    return value
  return String(value)
}
</script>

<template>
  <ElSpace v-bind="props.spaceProps">
    <ElCheckTag
      v-for="(option, index) in options"
      :key="getOptionKey(option, index)"
      v-bind="getCheckTagProps(option)"
      :checked="isChecked(getOptionValue(option))"
      :disabled="baseCheckTagProps.disabled || option.disabled"
      @change="() => handleTagClick(option, getOptionValue(option))"
    >
      {{ getOptionLabel(option) }}
    </ElCheckTag>
  </ElSpace>
</template>
