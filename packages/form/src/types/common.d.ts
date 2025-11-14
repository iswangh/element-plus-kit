import type { FormItem } from './form-item'

/** 允许数组类型 */
export type Arrayable<T> = T | T[]

/**
 * 事件拓展参数
 * @template K 属性名类型
 */
export interface EventExtendedParams<K = string> {
  prop: K
  index: number
  formItem: FormItem
}
