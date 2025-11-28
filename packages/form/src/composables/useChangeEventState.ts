/**
 * Change 事件状态管理组合式函数
 * 用于区分不同类型的值变化，防止重复触发 change 事件
 */
export function useChangeEventState() {
  let isUser = false

  return {
    /** 是否用户交互 */
    get isUser() {
      return isUser
    },

    /** 开始用户交互 */
    start() {
      isUser = true
    },

    /** 结束用户交互（在 nextTick 中调用） */
    end() {
      isUser = false
    },
  }
}
