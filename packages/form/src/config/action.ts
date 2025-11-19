import type { ActionConfig, ActionConfigButtonItem } from '../types'
import { Refresh, Search } from '@element-plus/icons-vue'
import { DEFAULT_SCROLL_OPTIONS } from './scroll'

/**
 * 表单动作按钮默认配置
 */
export const DEFAULT_FORM_ACTION_BUTTONS: Record<string, Partial<Omit<ActionConfigButtonItem, 'eventName'>>> = {
  search: { label: '搜索', icon: Search, type: 'primary' },
  reset: { label: '重置', icon: Refresh },
  submit: { label: '确认', type: 'primary' },
  cancel: { label: '取消' },
  expand: { type: 'text' },
}

/**
 * 展开/收起功能默认滚动选项
 */
export const DEFAULT_EXPAND_SCROLL_OPTIONS = DEFAULT_SCROLL_OPTIONS

/**
 * 表单动作默认配置
 */
export const ACTION_DEFAULT_CONFIG = {
  getDefaults(inline?: boolean, actionConfig?: ActionConfig) {
    const actionDefaults = this.buildActionAttrs(inline)
    return {
      ...actionDefaults,
      ...actionConfig,

    }
  },
  generateActionButtons(inline?: boolean) {
    return inline ? ['search', 'reset'] : ['submit', 'cancel']
  },
  buildActionAttrs(inline?: boolean) {
    return {
      buttons: this.generateActionButtons(inline),
      vIf: inline,
      autoExpandOnError: true,
      vShow: true,
    }
  },
}
