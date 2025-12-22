<script setup lang="ts">
import type { TagProps, TagValue } from './types'
import type { MatchResult } from './utils'
import { ElTag } from 'element-plus'
import { computed, useAttrs, useSlots } from 'vue'
import { matchOption } from './utils'

defineOptions({ name: 'WTag' })

const props = withDefaults(defineProps<TagProps>(), {
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
  // 优先级：插槽 > label > options + value 匹配 > value 本身 > 空
  if (hasDefaultSlot.value)
    return null // 使用插槽内容

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

/** 获取所有标签的显示文本（用逗号连接） */
const displayText = computed(() => {
  if (hasDefaultSlot.value)
    return null // 使用插槽内容

  // 如果提供了 label，直接使用
  if (props.label)
    return props.label

  // 获取所有标签的显示文本
  const texts = matches.value
    .map((item, index) => getTagDisplayText(item.value, item.match, index))
    .filter((text): text is string => text !== null)

  // 使用自定义分隔符连接
  return texts.length > 0 ? texts.join(props.separator) : null
})
</script>

<template>
  <ElTag v-bind="getTagProps(matches[0]?.match ?? defaultMatch)">
    <slot>{{ displayText }} </slot>
  </ElTag>
</template>
