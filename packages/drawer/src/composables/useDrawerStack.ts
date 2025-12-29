import type { DrawerInstance } from '../types'
import { Stack } from '@iswangh/element-plus-kit-core'

/**
 * 创建抽屉栈实例
 *
 * @returns Stack 实例
 */
export function useDrawerStack() {
  return new Stack<DrawerInstance>()
}
