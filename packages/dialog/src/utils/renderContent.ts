import type { Component, VNode } from 'vue'
import type { DialogInstance } from '../types'
import { h } from 'vue'

/**
 * 渲染内容
 *
 * 支持字符串、VNode、组件、渲染函数
 * 渲染函数可以返回 string、Component 或 VNode，系统会自动递归处理
 * 渲染函数通过闭包访问，不接收 instance 参数
 *
 * @param content - 内容（字符串、VNode、组件、渲染函数）
 * @param instance - Dialog 实例（用于判断是否为渲染函数）
 * @returns VNode
 */
export function renderContent(
  content?: string | VNode | Component | (() => string | Component | VNode),
  instance?: DialogInstance,
): VNode | null {
  if (!content)
    return null

  // 字符串
  if (typeof content === 'string') {
    return h('div', content)
  }

  // VNode
  if (typeof content === 'object' && 'type' in content) {
    return content as VNode
  }

  // 渲染函数或组件
  if (typeof content === 'function') {
    // 判断是渲染函数还是组件构造函数
    // 渲染函数不接收参数（通过闭包访问）
    // 组件构造函数不接收参数或接收 props
    if (instance && content.length === 0) {
      // 渲染函数：不接收参数，可能返回 string | Component | VNode
      const result = (content as () => string | Component | VNode)()
      // 递归处理：如果返回 string 或 Component，转换为 VNode
      return renderContent(result, instance)
    }
    // 组件构造函数
    return h(content as Component, {})
  }

  // 组件（对象形式）
  return h(content as Component, {})
}
