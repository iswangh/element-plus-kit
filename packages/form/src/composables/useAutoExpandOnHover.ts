/**
 * @file useAutoExpandOnHover.ts
 * @description 鼠标悬停自动展开组合式函数
 */
import type { ComputedRef, Ref } from 'vue'
import { onBeforeUnmount } from 'vue'

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
  // 是否手动锁定展开状态（手动点击展开/收起后锁定，不受鼠标移入影响）
  let manuallyExpanded = false

  // 鼠标移入定时器
  let mouseEnterTimer: ReturnType<typeof setTimeout> | null = null

  /**
   * 鼠标移入处理（延迟展开）
   */
  function onMouseEnter() {
    if (!autoExpandOnHover.value || manuallyExpanded)
      return

    if (mouseEnterTimer)
      clearTimeout(mouseEnterTimer)

    mouseEnterTimer = setTimeout(() => {
      if (!isExpanded.value)
        onToggleExpanded(true)
    }, 500)
  }

  /**
   * 鼠标移出处理（清理定时器，防止在移出时触发展开）
   */
  function onMouseLeave() {
    if (!mouseEnterTimer)
      return

    clearTimeout(mouseEnterTimer)
    mouseEnterTimer = null
  }

  /**
   * 记录手动操作状态
   *
   * @param value - 展开/折叠状态
   */
  function recordManualToggle(value: boolean) {
    if (autoExpandOnHover.value)
      manuallyExpanded = value
  }

  // 组件卸载时清理定时器
  onBeforeUnmount(() => {
    if (mouseEnterTimer)
      clearTimeout(mouseEnterTimer)
  })

  return {
    onMouseEnter,
    onMouseLeave,
    recordManualToggle,
  }
}
