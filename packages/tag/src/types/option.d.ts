/* eslint-disable ts/no-explicit-any */
import type { ElTagProps } from './el'

/**
 * 标签选项类型
 */
export interface TagOption {
  /** 标签文本（如果使用默认字段映射） */
  label?: string
  /** 标签值（如果使用默认字段映射） */
  value?: unknown
  /** 标签属性（传递给 ElTag 的属性） */
  tagProps?: Partial<ElTagProps>
  /** 允许其他自定义字段 */
  [key: string]: any
}
