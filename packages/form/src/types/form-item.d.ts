/* eslint-disable ts/no-explicit-any */
import type { FormCompConfig } from './common'
import type { ElFormItemAttrs } from './el'
import type { ColAttrs } from './layout'
import type { GetComponentOptionsType, InferOptionsType, IsOptionsSupported } from './options'

/**
 * 支持的表单组件枚举
 *
 * 显式定义所有可用的组件键名，确保类型提示正常工作
 * 注意：由于 FORM_ITEM_COMP_MAP 使用了 Record<string, any> 避免类型推断超出限制，
 * 我们需要显式定义键名类型，而不是从 typeof FORM_ITEM_COMP_MAP 中提取
 */
export type FormItemComp
  = | 'autocomplete'
    | 'cascader'
    | 'checkbox'
    | 'color-picker'
    | 'color-picker-panel'
    | 'date-picker'
    | 'date-picker-panel'
    | 'input'
    | 'input-number'
    | 'input-tag'
    | 'mention'
    | 'radio'
    | 'rate'
    | 'select'
    | 'select-v2'
    | 'slider'
    | 'switch'
    | 'time-picker'
    | 'time-select'
    | 'transfer'
    | 'tree-select'
    | 'custom'

/**
 * 根据组件类型推断对应的属性类型（排除事件处理器）
 * @template T - 组件类型
 */
export type FormItemCompAttrs<T extends FormItemComp = FormItemComp>
  = Omit<InstanceType<FormCompConfig[T]>['$props'], `on${string}`>

/**
 * 根据组件类型推断 options 类型
 * 只有支持 options 的组件才会扩展 options 类型
 * @template C - 组件类型
 */
export type FormItemOptions<C extends FormItemComp> = IsOptionsSupported<C> extends true
  ? InferOptionsType<C, GetComponentOptionsType<C>>
  : never

/**
 * FormItem 属性
 *
 * 扩展自 Element Plus 的 FormItem 组件属性，添加了自定义配置选项
 *
 * @template C - 组件类型
 * @extends {ElFormItemAttrs} Element Plus FormItem 组件原始属性
 * @property {C} comp 使用的组件类型
 * @property {FormItemCompAttrs<C>} [compAttrs] 传递给组件的属性配置对象
 * @property {boolean | ((data?: any) => boolean)} [vIf] 条件渲染控制，支持布尔值或接收表单数据的函数
 * @property {boolean | ((data?: any) => boolean)} [vShow] 显示/隐藏控制，支持布尔值或接收表单数据的函数
 *
 * @see {@link https://element-plus.org/zh-CN/component/form.html#form-item-attributes Element Plus Form Item Attributes}
 */
export interface FormItem<
  C extends FormItemComp = FormItemComp,
> extends ElFormItemAttrs {
  prop: string
  comp: C
  compAttrs?: IsOptionsSupported<C> extends true
    ? FormItemCompAttrs<C> & { options?: FormItemOptions<C> } // 支持 options 的组件：直接覆盖 options 类型为扩展类型
    : FormItemCompAttrs<C> // 不支持 options 的组件：使用原始属性类型
  vIf?: boolean | ((data: Record<string, any>) => boolean)
  vShow?: boolean | ((data: Record<string, any>) => boolean)
  colAttrs?: ColAttrs
}

/** formItems 配置类型 - 推断每一项的 comp 对应的组件类型 */
export type FormItems = { [K in FormItemComp]: FormItem<K> }[FormItemComp][]
