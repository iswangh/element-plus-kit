import type { ElTagProps } from './el'
import type { TagFieldProps } from './field'
import type { TagOption } from './option'

/**
 * 标签值类型
 */
export type TagValue = string | number | boolean | null | undefined

/**
 * WTag 组件 Props
 */
export interface TagProps extends Partial<ElTagProps> {
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
