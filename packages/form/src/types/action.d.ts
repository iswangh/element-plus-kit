/* eslint-disable ts/no-explicit-any */
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

/**
 * 表单操作按钮配置项
 *
 * 可以是标准化的按钮配置对象，也可以是预定义的按钮类型字符串
 */
export type ActionConfigButtons = ActionConfigButtonItem | 'submit' | 'cancel' | 'search' | 'reset' | 'expand'

/**
 * 默认展开规则（联合类型）
 *
 * 用于配置表单默认展开哪些字段，支持三种配置方式：
 * - `count`：按字段数量展开（从第一个开始）
 * - `include`：指定展示的字段（白名单，字段 prop 数组）
 * - `exclude`：指定折叠的字段（黑名单，字段 prop 数组）
 *
 * **配置优先级**：`exclude` > `include` > `count`
 *
 * **鼠标悬停自动展开**：
 * - `autoExpandOnHover`：是否启用鼠标悬停自动展开功能
 *   - 当鼠标移入表单区域时自动展开（延迟 500ms）
 *   - 如果用户手动点击展开/收起按钮，则锁定状态，不再受鼠标移入影响
 */
export type ExpandRule
  = | { count: number, autoExpandOnHover?: boolean }
    | { include: string[], autoExpandOnHover?: boolean }
    | { exclude: string[], autoExpandOnHover?: boolean }

/**
 * 表单操作项配置
 */
export interface ActionConfig {
  /** 是否显示操作区域（支持函数动态判断） */
  vIf?: boolean | ((data?: any) => boolean)
  /** 是否显示操作区域（支持函数动态判断，使用 v-show） */
  vShow?: boolean | ((data?: any) => boolean)
  /** 操作按钮配置数组 */
  buttons?: ActionConfigButtons[]
  /** 默认展开规则（仅在 buttons 包含 'expand' 时生效） */
  expand?: ExpandRule
}
