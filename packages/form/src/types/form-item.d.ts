/* eslint-disable ts/no-explicit-any */
import type { FORM_ITEM_COMP_MAP } from '../config'
import type { ElColAttrs, ElFormItemAttrs, ElRowAttrs } from './el'

/** Row 布局属性（扩展自 Element Plus Row 组件属性） */
export type RowAttrs = ElRowAttrs & { span?: number }

/** Col 布局属性（Element Plus Col 组件属性） */
export type ColAttrs = ElColAttrs

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

/** 表单组件配置映射类型 */
type FormCompConfig = typeof FORM_ITEM_COMP_MAP

/**
 * 根据组件类型推断对应的属性类型（排除事件处理器）
 * @template T - 组件类型
 */
export type FormItemCompAttrs<T extends FormItemComp = FormItemComp>
  = Omit<InstanceType<FormCompConfig[T]>['$props'], `on${string}`>

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
  compAttrs?: FormItemCompAttrs<C> // 根据具体的 C 类型推断
  vIf?: boolean | ((data: Record<string, any>) => boolean)
  vShow?: boolean | ((data: Record<string, any>) => boolean)
  colAttrs?: ColAttrs
}

/** formItems 配置类型 - 推断每一项的 comp 对应的组件类型 */
export type FormItems = { [K in FormItemComp]: FormItem<K> }[FormItemComp][]

/**
 * 表单项插槽作用域参数
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
