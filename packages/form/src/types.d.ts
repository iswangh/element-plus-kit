/* eslint-disable ts/no-explicit-any */
import type { ButtonProps, ElCol, ElRow, FormItemInstance, FormRules } from 'element-plus'
import type { FORM_ITEM_COMP_MAP } from './config'

/**
 * Element Plus Form Attributes
 *
 * 由于 `FormInstance['$slots']` 类型定义存在问题，
 * 暂时无法直接使用 `FormInstance['$props']`，
 * 因此手动定义了部分常用属性以确保类型安全。
 *
 * @see {@link https://element-plus.org/zh-CN/component/form.html#form-attributes Element Plus Form Attributes}
 */
export interface ElFormAttrs {
  // 数据相关
  model?: Record<string, any>
  rules?: FormRules

  // 布局相关
  inline?: boolean
  labelPosition?: 'left' | 'right' | 'top'
  labelWidth?: string | number
  labelSuffix?: string

  // 样式相关
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  hideRequiredAsterisk?: boolean

  // 验证相关
  showMessage?: boolean
  inlineMessage?: boolean
  statusIcon?: boolean
  validateOnRuleChange?: boolean
  scrollToError?: boolean
  scrollIntoViewOptions?: ScrollIntoViewOptions
}

/** Element Plus FormItem 属性 */
type ElFormItemAttrs = FormItemInstance['$props']

/** 表单组件配置映射类型 */
type FormCompConfig = typeof FORM_ITEM_COMP_MAP

/** 支持的表单组件枚举 */
export type FormItemComp = keyof FormCompConfig

/**
 * 根据组件类型推断对应的属性类型（排除事件处理器）
 * @template T - 组件类型
 */
export type FormItemCompAttrs<T extends FormItemComp = FormItemComp>
  = Omit<InstanceType<FormCompConfig[T]>['$props'], `on${string}`>

export type RowAttrs = InstanceType<typeof ElRow>['$props'] & { span?: number }

export type ColAttrs = InstanceType<typeof ElCol>['$props']

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
  vIf?: boolean | ((data?: any) => boolean)
  vShow?: boolean | ((data?: any) => boolean)
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

/** 允许数组类型 */
export type Arrayable<T> = T | T[]

/**
 * 标准化的表单操作按钮配置项
 *
 * @extends {ButtonProps} el-button 的属性
 * @property {string} label 按钮文字
 * @property {string} eventName 事件名称
 */
export interface ActionConfigButtonItem extends Partial<ButtonProps> {
  label?: string
  eventName: string
}

/** 表单操作按钮配置项  */
export type ActionConfigButtons = ActionConfigButtonItem | 'submit' | 'cancel' | 'search' | 'reset'

/**
 * 表单操作项配置
 *
 * @property {boolean | ((data?: any) => boolean)} vIf 是否显示
 * @property {boolean | ((data?: any) => boolean)} vShow 是否显示
 * @property {ActionConfigButtons[]} buttons 按钮列表
 */
export interface ActionConfig {
  vIf?: boolean | ((data?: any) => boolean)
  vShow?: boolean | ((data?: any) => boolean)
  buttons?: ActionConfigButtons[]
}

/**
 * 事件拓展参数
 * @template K 属性名类型
 */
export interface EventExtendedParams<K = string> {
  prop: K
  index: number
  formItem: FormItem
}
