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
