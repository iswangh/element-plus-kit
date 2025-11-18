import type { ActionConfigButtons } from '../types'

/**
 * 判断按钮列表中是否包含指定的事件名
 *
 * @param buttons - 按钮配置数组
 * @param eventName - 事件名称
 * @returns 是否包含该事件名
 */
export function hasButtonEvent(buttons: ActionConfigButtons[] | string[] | undefined, eventName: string): boolean {
  if (!buttons)
    return false
  return buttons.some(v => (typeof v === 'string' ? v === eventName : v.eventName === eventName))
}
