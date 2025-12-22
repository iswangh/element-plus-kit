<script setup lang="ts">
import type { ElTagProps, TagFieldProps, TagOption, TagSlotScope, TagValue } from './types'
import type { MatchResult } from './utils'
import { ElTag } from 'element-plus'
import { computed, useAttrs, useSlots } from 'vue'
import { matchOption } from './utils'

interface Props extends ElTagProps {

  /** 标签文本（优先级高于 options + value 匹配） */
  label?: string
  /** 选项列表（用于根据 value 匹配标签文本） */
  options?: TagOption[]
  /** 当前值（用于从 options 中匹配对应的选项，支持单个值或数组） */
  value?: TagValue | TagValue[]
  /** 字段映射配置（用于自定义 options 中的字段名） */
  props?: TagFieldProps
  /** 是否宽松匹配（默认 true，会将布尔值和字符串 'true'/'false' 互相匹配） */
  looseMatch?: boolean
  /** 数组值渲染时的分隔符（默认 ', '） */
  separator?: string
}

defineOptions({ name: 'WTag' })

const props = withDefaults(defineProps<Props>(), {
  props: () => ({ label: 'label', value: 'value' }),
  looseMatch: true,
  separator: ', ',
})

const attrs = useAttrs()
const slots = useSlots()

/** 当前值 */
const currentValue = computed(() => props.value)

/** 统一处理为数组（单个值转为数组，数组值保持不变） */
const normalizedValues = computed(() => {
  const value = currentValue.value
  return value == null ? [] : Array.isArray(value) ? value : [value]
})

/** 是否有默认插槽 */
const hasDefaultSlot = computed(() => !!slots.default)

/** 默认匹配结果（用于无 options 或匹配失败的情况） */
const defaultMatch: MatchResult = { option: null, label: null, matched: false }

/** 匹配结果列表（统一处理，包含值和匹配结果） */
const matches = computed(() => {
  if (normalizedValues.value.length === 0)
    return []

  const values = normalizedValues.value

  if (!props.options) {
    // 没有 options，返回所有值（匹配失败）
    return values.map(value => ({ value, match: defaultMatch }))
  }

  // 组合值和匹配结果
  return values.map(value => ({
    value,
    match: matchOption({
      options: props.options ?? [],
      value,
      fieldProps: props.props,
      looseMatch: props.looseMatch,
    }),
  }))
})

/** 获取单个标签的属性 */
function getTagProps(match: MatchResult) {
  const baseProps = { ...attrs, ...props }

  // 排除 Tag 组件特有的 props
  const { label: _label, options: _options, value: _value, props: _fieldProps, looseMatch: _looseMatch, separator: _separator, ...elTagProps } = baseProps

  // 如果匹配到了选项，合并选项中的 tagProps
  if (match?.option?.tagProps) {
    return { ...elTagProps, ...match.option.tagProps }
  }

  return elTagProps
}

/** 获取单个标签的显示文本 */
function getTagDisplayText(value: TagValue, match: MatchResult | null, index: number): string | null {
  // 如果提供了 label，直接使用（仅第一个标签时）
  if (props.label && index === 0)
    return props.label

  // 如果匹配成功，显示匹配的标签文本
  if (match?.matched && match.label)
    return match.label

  // 匹配失败时，显示传入的值本身（转换为字符串）
  if (value !== null && value !== undefined)
    return String(value)

  return null
}

/** 计算标签显示文本（不检查插槽状态） */
const computedLabel = computed(() => {
  // 如果提供了 label，直接使用
  if (props.label)
    return props.label

  // 获取所有标签的显示文本
  const texts = matches.value
    .map((item, index) => getTagDisplayText(item.value, item.match, index))
    .filter(text => text != null) as string[]

  // 使用自定义分隔符连接
  return texts.length > 0 ? texts.join(props.separator) : null
})

/** 获取所有标签的显示文本（用逗号连接） */
const displayText = computed(() => hasDefaultSlot.value ? null : computedLabel.value)

/** 插槽作用域数据 */
const slotScope = computed<TagSlotScope>(() => ({
  value: props.value,
  label: computedLabel.value,
  options: matches.value.map(item => item.match.option).filter((option): option is TagOption => option != null),
}))
</script>

<template>
  <ElTag v-bind="getTagProps(matches[0]?.match ?? defaultMatch)">
    <slot v-bind="slotScope">
      {{ displayText }}
    </slot>
  </ElTag>
</template>
