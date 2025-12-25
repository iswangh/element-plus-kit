/* eslint-disable ts/no-explicit-any */
import type { ElCol, ElRow, FormItemInstance, FormRules } from 'element-plus'

/** Element Plus Form Props */
export interface ElFormProps {
  model?: Record<string, any>
  rules?: FormRules
  inline?: boolean
  labelPosition?: 'left' | 'right' | 'top'
  labelWidth?: string | number
  labelSuffix?: string
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  hideRequiredAsterisk?: boolean
  requireAsteriskPosition?: 'left' | 'right'
  showMessage?: boolean
  inlineMessage?: boolean
  statusIcon?: boolean
  validateOnRuleChange?: boolean
  scrollToError?: boolean
  scrollIntoViewOptions?: ScrollIntoViewOptions
}

/** Element Plus FormItem Props */
export type ElFormItemProps = FormItemInstance['$props']

/** Element Plus FormItem Slots */
export type ElFormItemSlots = FormItemInstance['$slots']

/** Element Plus Row 组件 Props */
export type ElRowProps = InstanceType<typeof ElRow>['$props']

/** Element Plus Col 组件 Props */
export type ElColProps = InstanceType<typeof ElCol>['$props']
