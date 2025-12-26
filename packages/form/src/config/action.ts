import type { FormActionButtonItem, FormActionConfig } from '../types'
import { Refresh, Search } from '@element-plus/icons-vue'

/**
 * 表单动作按钮默认配置
 */
export const DEFAULT_FORM_ACTION_BUTTONS: Record<string, Partial<Omit<FormActionButtonItem, 'eventName'>>> = {
  search: { label: '搜索', icon: Search, type: 'primary' },
  reset: { label: '重置', icon: Refresh },
  submit: { label: '确认', type: 'primary' },
  cancel: { label: '取消' },
  expand: { link: true },
}

/**
 * 表单动作默认配置
 */
export const FORM_ACTION_DEFAULT_CONFIG = {
  /**
   * 获取动作默认属性
   */
  getDefaults(inline?: boolean, actionConfig?: FormActionConfig) {
    const actionProps = this.buildActionProps(inline)
    return { ...actionProps, ...actionConfig }
  },
  /**
   * 获取动作按钮列表
   */
  getActionButtons(inline?: boolean) {
    return inline ? ['search', 'reset'] : ['submit', 'cancel']
  },
  /**
   * 构建动作属性
   */
  buildActionProps(inline?: boolean) {
    return {
      buttons: this.getActionButtons(inline),
      vIf: inline,
      autoExpandOnError: true,
      vShow: true,
    }
  },
}
