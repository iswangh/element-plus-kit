import type { ElTagProps } from './el'
import type { TagFieldProps } from './field'
import type { TagOption } from './option'

/**
 * 标签值类型
 */
export type TagValue = string | number | boolean | null | undefined

/**
 * 标签插槽作用域参数
 *
 * 标签插槽的作用域参数，包含当前值、匹配的标签文本和匹配到的选项对象
 * 用于自定义标签内容的渲染
 *
 * @property {TagValue | TagValue[]} value 当前值（可能是单个值或数组）
 * @property {string | null} label 匹配到的标签文本（单个值直接返回，数组值用分隔符拼接）
 * @property {TagOption[]} options 所有匹配到的选项对象数组
 */
export interface TagSlotScope {
  /** 当前值（可能是单个值或数组） */
  value: TagValue | TagValue[]
  /** 匹配到的标签文本（单个值直接返回，数组值用分隔符拼接） */
  label: string | null
  /** 所有匹配到的选项对象数组 */
  options: TagOption[]
}

/**
 * WTag 组件 Props
 */
export interface TagProps extends /* @vue-ignore */ Partial<ElTagProps> {
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
