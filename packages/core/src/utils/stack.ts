/**
 * 栈管理类（泛型）
 *
 * 用于管理多个实例的栈结构
 *
 * @template T - 实例类型，必须包含 id 属性
 */
export class Stack<T extends { id: string }> {
  private stack: T[] = []

  /**
   * 添加实例到栈中
   *
   * @param instance - 实例
   */
  push(instance: T) {
    this.stack.push(instance)
  }

  /**
   * 从栈中移除实例
   *
   * @param instance - 实例
   */
  pop(instance: T) {
    const index = this.stack.findIndex(i => i.id === instance.id)
    if (index > -1) {
      this.stack.splice(index, 1)
    }
  }

  /**
   * 获取最上层的实例
   *
   * @returns 最上层的实例，如果没有则返回 undefined
   */
  getTop(): T | undefined {
    return this.stack[this.stack.length - 1]
  }
}
