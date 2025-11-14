/* eslint-disable ts/no-explicit-any */
import type { ElCol, ElRow, FormItemInstance, FormRules } from 'element-plus'

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
export type ElFormItemAttrs = FormItemInstance['$props']

/** Element Plus Row 组件属性 */
export type ElRowAttrs = InstanceType<typeof ElRow>['$props']

/** Element Plus Col 组件属性 */
export type ElColAttrs = InstanceType<typeof ElCol>['$props']
