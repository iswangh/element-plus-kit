/* eslint-disable ts/no-explicit-any */
import type { VNode } from 'vue'
import type { FormItemComp, FormItemCompSlots } from './comp'
import type { ElFormItemSlots } from './el'
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

/**
 * 插槽渲染函数类型
 *
 * 允许返回 VNode 或 VNode[]，兼容 h() 函数返回单个 VNode 的情况
 * Vue 的 component :is 可以接受返回 VNode 或 VNode[] 的函数
 * 用于插槽配置，提供比 Vue 的 Slot 类型更灵活的返回值支持
 * 接受 FormItemSlotScope 参数（或扩展类型），包含 value、form、formItem 等属性
 * 使用泛型支持扩展参数类型，如 FormItemSlotScope & { label: string } 用于 label 插槽
 */
export type SlotRenderFn<T extends FormItemSlotScope = FormItemSlotScope> = (props: T) => VNode | VNode[]

/**
 * 动态组件插槽配置类型
 *
 * @template T - 组件类型
 */
export type CompSlotsConfig<T extends FormItemComp> = {
  [K in keyof FormItemCompSlots<T>]?: SlotRenderFn
}

/**
 * FormItem 插槽配置类型
 */
export type FormItemSlotsConfig = {
  [K in keyof ElFormItemSlots]?: SlotRenderFn
}
