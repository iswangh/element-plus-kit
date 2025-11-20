/**
 * @file useAutoExpandOnHover.ts
 * @description 鼠标悬停自动展开组合式函数
 */
import type { ComputedRef, Ref } from 'vue'
import { nextTick, onBeforeUnmount } from 'vue'

/**
 * 鼠标悬停自动展开组合式函数
 *
 * @param isExpanded - 展开/折叠状态
 * @param autoExpandOnHover - 是否启用鼠标悬停自动展开
 * @param onToggleExpanded - 切换展开/折叠状态的回调函数
 * @returns 鼠标事件处理函数和记录手动操作状态的函数
 */
export function useAutoExpandOnHover(
  isExpanded: Ref<boolean>,
  autoExpandOnHover: ComputedRef<boolean> | Ref<boolean>,
  onToggleExpanded: (value: boolean) => void,
) {
  // 是否手动操作过（手动点击展开/收起后锁定，直到鼠标移出才允许自动展开）
  let manuallyToggled = false
  // 鼠标移入定时器（延迟 500ms 后自动展开）
  let mouseEnterTimer: ReturnType<typeof setTimeout> | null = null
  // 鼠标移出重置定时器（延迟 100ms 后重置手动操作状态，避免与点击事件冲突）
  let mouseLeaveResetTimer: ReturnType<typeof setTimeout> | null = null

  /**
   * 清理所有定时器
   */
  function clearTimers() {
    if (mouseEnterTimer) {
      clearTimeout(mouseEnterTimer)
      mouseEnterTimer = null
    }
    if (mouseLeaveResetTimer) {
      clearTimeout(mouseLeaveResetTimer)
      mouseLeaveResetTimer = null
    }
  }

  /**
   * 鼠标移入处理（延迟展开）
   * 延迟 500ms 后自动展开，如果用户手动操作过则不会触发展开
   */
  function onMouseEnter() {
    if (!autoExpandOnHover.value || manuallyToggled)
      return

    if (mouseEnterTimer)
      clearTimeout(mouseEnterTimer)

    mouseEnterTimer = setTimeout(() => {
      // 双重检查：确保展开状态和手动操作状态都满足条件
      if (!isExpanded.value && !manuallyToggled)
        onToggleExpanded(true)
    }, 500)
  }

  /**
   * 鼠标移出处理（清理定时器并延迟重置手动操作状态）
   * 使用 nextTick + setTimeout 延迟重置，避免与点击事件冲突
   */
  function onMouseLeave() {
    if (mouseEnterTimer) {
      clearTimeout(mouseEnterTimer)
      mouseEnterTimer = null
    }

    if (mouseLeaveResetTimer)
      clearTimeout(mouseLeaveResetTimer)

    // 延迟重置手动操作状态，确保点击事件已经处理完成
    nextTick(() => {
      mouseLeaveResetTimer = setTimeout(() => {
        manuallyToggled = false
        mouseLeaveResetTimer = null
      }, 100)
    })
  }

  /**
   * 记录手动操作状态
   * 当用户手动点击展开/收起按钮时调用，阻止自动展开功能
   */
  function recordManualToggle() {
    if (!autoExpandOnHover.value)
      return

    manuallyToggled = true
    clearTimers()
  }

  onBeforeUnmount(clearTimers)

  return {
    onMouseEnter,
    onMouseLeave,
    recordManualToggle,
  }
}
