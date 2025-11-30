import type { Condition } from './common'
import type { FormItemComp, FormItemCompProps } from './comp'
import type { ElFormItemProps } from './el'
import type { ColProps } from './layout'
import type { InferOptionsType, IsOptionsSupported } from './options'

/**
 * 根据组件类型推断 options 类型
 * 只有支持 options 的组件才会扩展 options 类型
 * @template T - 组件类型
 */
export type FormItemOptions<T extends FormItemComp> = IsOptionsSupported<T> extends true
  ? InferOptionsType<T>
  : never

/**
 * 根据组件类型推断 compProps 类型（扩展版本）
 * 支持扩展属性，如 options 等
 * @template T - 组件类型
 */
export type FormItemCompPropsExtended<T extends FormItemComp> = IsOptionsSupported<T> extends true
  ? Omit<FormItemCompProps<T>, 'options'> & { options?: FormItemOptions<T> } // 支持 options 的组件：先排除原始 options，再添加扩展的 options 类型
  : FormItemCompProps<T> // 不支持 options 的组件：使用原始 Props 类型

/**
 * FormItem Props
 *
 * 扩展自 Element Plus 的 FormItem 组件 Props，添加了自定义配置选项
 *
 * @template T - 组件类型
 * @extends {ElFormItemProps} Element Plus FormItem 组件原始 Props（包含事件处理器）
 * @property {T} compType 使用的组件类型
 * @property {FormItemCompPropsExtended<T>} [compProps] 传递给组件的 Props 配置对象（包含事件处理器，用于动态组件）
 * @property {Condition} [vIf] 条件渲染控制，支持布尔值或接收表单数据的函数
 * @property {Condition} [vShow] 显示/隐藏控制，支持布尔值或接收表单数据的函数
 *
 * @see {@link https://element-plus.org/zh-CN/component/form.html#form-item-attributes Element Plus Form Item Attributes}
 */
export interface FormItem<T extends FormItemComp = FormItemComp> extends ElFormItemProps {
  prop: string
  compType: T
  compProps?: FormItemCompPropsExtended<T> // 包含事件处理器（动态组件的事件）
  vIf?: Condition
  vShow?: Condition
  colProps?: ColProps
}

/** formItems 配置类型 - 推断每一项的 compType 对应的组件类型 */
export type FormItems = { [K in FormItemComp]: FormItem<K> }[FormItemComp][]
