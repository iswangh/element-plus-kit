import type { FormProps } from 'element-plus'
import { DEFAULT_SCROLL_OPTIONS } from './scroll'

/**
 * 表单属性默认配置
 */
export const DEFAULT_FORM_PROPS = {
  showMessage: true,
  scrollToError: true,
  scrollIntoViewOptions: DEFAULT_SCROLL_OPTIONS,
} as unknown as Partial<FormProps>
