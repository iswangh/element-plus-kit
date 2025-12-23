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

/**
 * Element Plus CheckTag Props
 *
 * 手动定义常用属性，避免在 .d.ts 文件中使用 typeof 导致的类型解析问题
 * 与 form 包的 ElFormProps 保持一致的定义方式
 *
 * @see {@link https://element-plus.org/zh-CN/component/tag.html#check-tag-attributes Element Plus CheckTag Attributes}
 */
export interface ElCheckTagProps {
  /** 是否禁用 */
  disabled?: boolean
  /** 类型 */
  type?: 'primary' | 'success' | 'info' | 'warning' | 'danger'
  /** 点击时触发的事件（组件内部使用，参数为 checked 状态） */
  onChange?: (checked: boolean) => void
}

/**
 * Element Plus Space Props
 *
 * 手动定义常用属性，避免在 .d.ts 文件中使用 typeof 导致的类型解析问题
 * 与 form 包的 ElFormProps 保持一致的定义方式
 *
 * @see {@link https://element-plus.org/zh-CN/component/space.html#space-attributes Element Plus Space Attributes}
 */
export interface ElSpaceProps {
  /** 间距方向 */
  direction?: 'horizontal' | 'vertical'
  /** 间距大小 */
  size?: 'small' | 'default' | 'large' | number | [number, number]
  /** 是否自动换行 */
  wrap?: boolean
  /** 是否填充容器 */
  fill?: boolean
  /** 填充比例 */
  fillRatio?: number
  /** 对齐方式 */
  alignment?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
}
