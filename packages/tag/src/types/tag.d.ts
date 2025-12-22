/* eslint-disable ts/no-explicit-any */
import type { ElTagProps } from './el'

/**
 * 标签值类型
 */
export type TagValue = string | number | boolean | null | undefined

/**
 * 字段映射配置
 * 用于指定 options 中的字段名
 * 与 Element Plus 保持一致，使用 props 命名
 */
export interface TagFieldProps {
  /** 标签文本字段名，默认为 'label' */
  label?: string
  /** 标签值字段名，默认为 'value' */
  value?: string
}

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
 * 标签选项类型
 */
export interface TagOption {
  /** 标签文本（如果使用默认字段映射） */
  label?: string
  /** 标签值（如果使用默认字段映射） */
  value?: unknown
  /** 标签属性（传递给 ElTag 的属性） */
  tagProps?: ElTagProps
  /** 允许其他自定义字段 */
  [key: string]: any
}
