import type { DialogInstance } from '../types'

/**
 * 弹窗栈管理类
 *
 * 用于管理多个弹窗实例
 */
export class DialogStack {
  private stack: DialogInstance[] = []

  /**
   * 添加弹窗实例到栈中
   *
   * @param instance - Dialog 实例
   */
  push(instance: DialogInstance) {
    this.stack.push(instance)
  }

  /**
   * 从栈中移除弹窗实例
   *
   * @param instance - Dialog 实例
   */
  pop(instance: DialogInstance) {
    const index = this.stack.findIndex(i => i.id === instance.id)
    if (index > -1) {
      this.stack.splice(index, 1)
    }
  }

  /**
   * 获取最上层的弹窗实例
   *
   * @returns 最上层的弹窗实例，如果没有则返回 undefined
   */
  getTop(): DialogInstance | undefined {
    return this.stack[this.stack.length - 1]
  }
}

/**
 * 创建弹窗栈实例
 *
 * @returns DialogStack 实例
 */
export function useDialogStack() {
  return new DialogStack()
}
