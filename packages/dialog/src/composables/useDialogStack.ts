import type { DialogInstance } from '../types'
import { Stack } from '@iswangh/element-plus-kit-core'

/**
 * 创建弹窗栈实例
 *
 * @returns Stack 实例
 */
export function useDialogStack() {
  return new Stack<DialogInstance>()
}
