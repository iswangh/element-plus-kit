import type { DialogInstance } from '../types'

/**
 * 弹窗栈管理类
 *
 * 用于管理多个弹窗实例，自动管理 z-index
 * 通过更新 DialogInstance 的 zIndex 属性来管理层级，而不是直接操作 DOM
 */
export class DialogStack {
  private stack: DialogInstance[] = []
  private baseZIndex = 2000

  /**
   * 添加弹窗实例到栈中
   *
   * @param instance - Dialog 实例
   */
  push(instance: DialogInstance) {
    this.stack.push(instance)
    this.updateZIndex()
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
      this.updateZIndex()
    }
  }

  /**
   * 更新所有弹窗的 z-index
   * 通过更新 DialogInstance 的 zIndex 属性，由 el-dialog 原生处理 z-index
   */
  private updateZIndex() {
    this.stack.forEach((instance, index) => {
      // 计算每个实例的 z-index
      const zIndex = this.baseZIndex + index
      // 更新实例的 zIndex 属性（响应式），el-dialog 会自动应用
      if (instance.zIndex) {
        instance.zIndex.value = zIndex
      }
    })
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
