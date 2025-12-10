/**
 * 清理状态管理组合式函数
 * 用于管理依赖变更时的清理操作，支持用户在 change 事件中设置默认值
 */
export function useClearState() {
  let changing = false
  let hasUserValue = false
  let shouldKeepValue = false

  return {
    /** 是否正在处理依赖变更 */
    get changing() {
      return changing
    },

    /** 用户是否在 change 事件中设置了值 */
    get hasUserValue() {
      return hasUserValue
    },

    /** 是否应该保留值（异步加载完成后，值在新的选项中） */
    get shouldKeepValue() {
      return shouldKeepValue
    },

    /** 开始依赖变更处理 */
    start() {
      changing = true
      hasUserValue = false
      shouldKeepValue = false
    },

    /** 结束依赖变更处理 */
    end() {
      changing = false
      hasUserValue = false
      // 不立即重置 shouldKeepValue，让 clearValue 的 nextTick 回调能够检查到
      // shouldKeepValue 会在下一次 start() 时重置
    },

    /** 标记用户在 change 事件中设置了值 */
    markValue() {
      hasUserValue = true
    },

    /** 标记应该保留值（异步加载完成后，值在新的选项中） */
    markShouldKeepValue() {
      shouldKeepValue = true
    },
  }
}
