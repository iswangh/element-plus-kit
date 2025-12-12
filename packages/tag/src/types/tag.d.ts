/* eslint-disable ts/no-explicit-any */
import type { ElTagProps } from './el'

/**
 * 字段配置（用于指定 options 中的字段名）
 */
export interface FieldProps {
  label?: string
  value?: string
}

/**
 * 选项数据类型
 */
export interface TagOption {
  [key: string | number]: any
  /** 每个选项的标签属性 */
  tagProps?: Partial<ElTagProps>
}

/**
 * 值类型
 */
export type TagValue = string | number | boolean | Date | null | undefined
/**
 * WTag 组件 Props
 */
export interface TagProps extends Partial<ElTagProps> {
  props?: FieldProps
  options?: TagOption[]
  /** 当前值（单个值或数组，用于从 options 中匹配对应的选项） */
  value?: TagValue | TagValue[]
  /** 是否宽松匹配 */
  looseMatch?: boolean
}
