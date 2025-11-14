import type { ButtonProps } from 'element-plus'

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
