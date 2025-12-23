<script setup lang="ts">
import type { CheckTagOption, TagFieldProps, TagValue } from './types'
import type { ElCheckTagProps, ElSpaceProps } from './types/el'
import { ElCheckTag, ElSpace } from 'element-plus'
import { computed, useAttrs } from 'vue'

interface Props extends /* @vue-ignore */ ElCheckTagProps {
  /** 是否多选（默认 false，单选） */
  multiple?: boolean
  /** 选项列表 */
  options?: CheckTagOption[]
  /** 当前值（单选：TagValue，多选：TagValue[]） */
  modelValue?: TagValue | TagValue[]
  /** 字段映射配置 */
  props?: TagFieldProps
  /** Space 组件配置 */
  spaceConfig?: Partial<ElSpaceProps>
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
  if (!props.options)
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
  if (!props.options)
    return []
  // 过滤掉不在 options 中的值
  return valueArray.filter((v) => {
    return props.options!.some((opt) => {
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
  // 组件级别禁用
  if (props.disabled)
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

/** 处理 ElCheckTag 的 onChange 事件（组件内部使用） */
function handleCheckTagChange(option: CheckTagOption, optionValue: TagValue) {
  // ElCheckTag 的 change 事件在点击时触发，checked 是新的状态
  // 我们不需要使用 checked 参数，因为我们自己管理状态
  // 直接触发点击处理逻辑
  handleTagClick(option, optionValue)
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

/** 获取传递给 ElCheckTag 的属性 */
function getCheckTagProps(option: CheckTagOption) {
  const baseProps = { ...attrs, ...props }
  // 排除 CheckTag 组件特有的 props
  const { multiple: _multiple, options: _options, modelValue: _modelValue, props: _fieldProps, onChange: _onChange, ...elCheckTagProps } = baseProps

  // 合并选项中的 tagProps（选项级别的属性优先级更高）
  if (option.tagProps) {
    return { ...elCheckTagProps, ...option.tagProps }
  }

  return elCheckTagProps
}
</script>

<template>
  <ElSpace v-bind="props.spaceConfig">
    <ElCheckTag
      v-for="(option, index) in (options || [])"
      :key="`${getOptionValue(option)}-${index}`"
      v-bind="getCheckTagProps(option)"
      :checked="isChecked(getOptionValue(option))"
      :disabled="props.disabled || option.disabled"
      @change="(checked: boolean) => {
        const optionValue = getOptionValue(option)
        handleCheckTagChange(option, optionValue)
      }"
    >
      {{ getOptionLabel(option) }}
    </ElCheckTag>
  </ElSpace>
</template>
