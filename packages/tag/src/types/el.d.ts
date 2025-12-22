/**
 * Element Plus Tag Props
 *
 * 手动定义常用属性，避免在 .d.ts 文件中使用 typeof 导致的类型解析问题
 * 与 form 包的 ElFormProps 保持一致的定义方式
 *
 * @see {@link https://element-plus.org/zh-CN/component/tag.html#tag-attributes Element Plus Tag Attributes}
 */
export interface ElTagProps {
  type?: 'success' | 'info' | 'warning' | 'danger'
  closable?: boolean
  disableTransitions?: boolean
  hit?: boolean
  color?: string
  size?: 'large' | 'default' | 'small'
  effect?: 'dark' | 'light' | 'plain'
  round?: boolean
  /** 关闭 Tag 时触发的事件 */
  onClose?: (event: MouseEvent) => void
  /** 点击 Tag 时触发的事件 */
  onClick?: (event: MouseEvent) => void
}
