import type { DrawerInstance } from '../types'

/**
 * 抽屉栈管理类
 *
 * 用于管理多个抽屉实例
 */
export class DrawerStack {
  private stack: DrawerInstance[] = []

  /**
   * 添加抽屉实例到栈中
   *
   * @param instance - Drawer 实例
   */
  push(instance: DrawerInstance) {
    this.stack.push(instance)
  }

  /**
   * 从栈中移除抽屉实例
   *
   * @param instance - Drawer 实例
   */
  pop(instance: DrawerInstance) {
    const index = this.stack.findIndex(i => i.id === instance.id)
    if (index > -1) {
      this.stack.splice(index, 1)
    }
  }

  /**
   * 获取最上层的抽屉实例
   *
   * @returns 最上层的抽屉实例，如果没有则返回 undefined
   */
  getTop(): DrawerInstance | undefined {
    return this.stack[this.stack.length - 1]
  }
}

/**
 * 创建抽屉栈实例
 *
 * @returns DrawerStack 实例
 */
export function useDrawerStack() {
  return new DrawerStack()
}
