/* eslint-disable ts/no-explicit-any */
import type { FormItem } from './form-item'

/**
 * 表单项事件扩展参数
 *
 * 表单组件事件的扩展参数，包含字段名、索引和表单项配置
 * 用于 change 等事件，未来可扩展用于其他表单项相关事件
 *
 * @template K 属性名类型
 * @property {K} prop 表单字段名
 * @property {number} index 表单项索引
 * @property {FormItem} formItem 表单项配置
 */
export interface FormItemEventExtendedParams<K = string> {
  prop: K
  index: number
  formItem: FormItem
}

/**
 * 表单项插槽作用域参数
 *
 * 表单项插槽的作用域参数，包含当前值、表单数据和表单项配置
 * 用于 form-item 插槽、动态组件插槽、自定义组件插槽等
 *
 * @property {any} value 当前表单项组件的值
 * @property {Record<string, any>} form 表单数据
 * @property {FormItem} formItem 表单项配置
 */
export interface FormItemSlotScope {
  value: any
  form: Record<string, any>
  formItem: FormItem
  [key: string]: any // 允许 el-form-item 的其他作用域参数
}
