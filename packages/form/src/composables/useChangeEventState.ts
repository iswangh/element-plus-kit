/* eslint-disable ts/no-explicit-any */
/**
 * Change 事件状态管理组合式函数
 * 用于区分不同类型的值变化，防止重复触发 change 事件
 */
export function useChangeEventState() {
  let isClearing = false
  let isUserInteraction = false
  let valueBeforeClear: any = null
  let justCleared = false

  return {
    /** 是否正在清理 */
    get isClearing() {
      return isClearing
    },

    /** 是否用户交互 */
    get isUserInteraction() {
      return isUserInteraction
    },

    /**
     * 开始清理操作
     * @param value - 清理前的值
     */
    startClearing(value: any) {
      isClearing = true
      valueBeforeClear = value
      justCleared = true
    },

    /**
     * 结束清理操作（在 nextTick 中调用）
     */
    endClearing() {
      isClearing = false
      valueBeforeClear = null
      justCleared = false
    },

    /**
     * 开始用户交互
     */
    startUserInteraction() {
      isUserInteraction = true
    },

    /**
     * 结束用户交互（在 nextTick 中调用）
     */
    endUserInteraction() {
      isUserInteraction = false
    },

    /**
     * 判断是否是清理操作
     * @param oldValue - 旧值
     * @param newValue - 新值
     * @param isEmpty - 检查值是否为空的函数
     */
    isClearingOperation(oldValue: any, newValue: any, isEmpty: (val: any) => boolean): boolean {
      // 如果正在清理，说明是程序化清理操作
      if (isClearing)
        return true

      // 如果刚刚执行了清理操作，说明是程序化清理操作（双重保险）
      if (justCleared)
        return true

      // 如果值是从有值变为 undefined，且 oldValue 等于 valueBeforeClear，说明是清理操作
      if (!isEmpty(oldValue) && isEmpty(newValue) && oldValue === valueBeforeClear)
        return true

      return false
    },
  }
}
