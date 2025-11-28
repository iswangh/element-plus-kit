/**
 * 清理状态管理组合式函数
 * 用于管理依赖变更时的清理操作，支持用户在 change 事件中设置默认值
 */
export function useClearState() {
  let changing = false
  let hasUserValue = false

  return {
    /** 是否正在处理依赖变更 */
    get changing() {
      return changing
    },

    /** 用户是否在 change 事件中设置了值 */
    get hasUserValue() {
      return hasUserValue
    },

    /** 开始依赖变更处理 */
    start() {
      changing = true
      hasUserValue = false
    },

    /** 结束依赖变更处理 */
    end() {
      changing = false
      hasUserValue = false
    },

    /** 标记用户在 change 事件中设置了值 */
    markValue() {
      hasUserValue = true
    },
  }
}
