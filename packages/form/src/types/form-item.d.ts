import type { FORM_ITEM_COMP_MAP } from '../config'
import type { Condition } from './common'
import type { ElFormItemProps } from './el'
import type { ColProps } from './layout'
import type { GetComponentOptionsType, InferOptionsType, IsOptionsSupported } from './options'

/**
 * 表单组件配置映射类型
 */
export type FormCompConfig = typeof FORM_ITEM_COMP_MAP

/**
 * 根据组件类型获取组件实例类型
 * @template T 组件类型
 */
export type FormItemCompInstance<T extends FormItemComp> = InstanceType<FormCompConfig[T]>

/**
 * 根据组件类型获取组件完整 Props 类型（包含事件处理器）
 * @template T 组件类型
 */
type FormItemCompPropsFull<T extends FormItemComp> = FormItemCompInstance<T>['$props']

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
 * 根据组件类型推断对应的 Props 类型（排除事件处理器）
 * @template T - 组件类型
 */
export type FormItemCompProps<T extends FormItemComp = FormItemComp>
  = Omit<FormItemCompPropsFull<T>, `on${string}`>

/**
 * 根据组件类型推断 options 类型
 * 只有支持 options 的组件才会扩展 options 类型
 * @template T - 组件类型
 */
export type FormItemOptions<T extends FormItemComp> = IsOptionsSupported<T> extends true
  ? InferOptionsType<T, GetComponentOptionsType<T>>
  : never

/**
 * 根据组件类型推断 compProps 类型（扩展版本）
 * 支持扩展属性，如 options 等
 * @template T - 组件类型
 */
export type FormItemCompPropsExtended<T extends FormItemComp> = IsOptionsSupported<T> extends true
  ? FormItemCompProps<T> & { options?: FormItemOptions<T> } // 支持 options 的组件：直接覆盖 options 类型为扩展类型
  : FormItemCompProps<T> // 不支持 options 的组件：使用原始 Props 类型

/**
 * FormItem Props
 *
 * 扩展自 Element Plus 的 FormItem 组件 Props，添加了自定义配置选项
 *
 * @template T - 组件类型
 * @extends {ElFormItemProps} Element Plus FormItem 组件原始 Props
 * @property {T} comp 使用的组件类型
 * @property {FormItemCompPropsExtended<T>} [compProps] 传递给组件的 Props 配置对象
 * @property {Condition} [vIf] 条件渲染控制，支持布尔值或接收表单数据的函数
 * @property {Condition} [vShow] 显示/隐藏控制，支持布尔值或接收表单数据的函数
 *
 * @see {@link https://element-plus.org/zh-CN/component/form.html#form-item-attributes Element Plus Form Item Attributes}
 */
export interface FormItem<T extends FormItemComp = FormItemComp> extends ElFormItemProps {
  prop: string
  comp: T
  compProps?: FormItemCompPropsExtended<T>
  vIf?: Condition
  vShow?: Condition
  colProps?: ColProps
}

/** formItems 配置类型 - 推断每一项的 comp 对应的组件类型 */
export type FormItems = { [K in FormItemComp]: FormItem<K> }[FormItemComp][]
