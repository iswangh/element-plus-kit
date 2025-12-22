import type { ElTag } from 'element-plus'

/**
 * Element Plus Tag 完整 Props 类型（包含事件监听器）
 */
type ElTagPropsFull = InstanceType<typeof ElTag>['$props']

/**
 * Element Plus Tag 常用属性
 *
 * 使用 Pick 提取常用属性，简化类型复杂度
 */
type ElTagPropsCommon = Pick<
  ElTagPropsFull,
  | 'type'
  | 'closable'
  | 'disableTransitions'
  | 'hit'
  | 'color'
  | 'size'
  | 'effect'
  | 'round'
>

/**
 * Element Plus Tag Events
 *
 * 从 ElTag 组件实例的 $props 中提取事件类型
 * 事件监听器以 on 开头，如 onClick、onClose
 */
type ElTagEvents = {
  [K in keyof ElTagPropsFull as K extends `on${string}` ? K : never]: ElTagPropsFull[K]
}

/**
 * Element Plus Tag Props
 *
 * 结合常用属性和事件类型，对外暴露完整的 ElTag 属性类型
 * 使用常用属性而不是完整的 ElTagPropsBase，避免类型复杂度问题
 */
export type ElTagProps = ElTagPropsCommon & ElTagEvents
