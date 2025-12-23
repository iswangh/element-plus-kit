import type { App, Component } from 'vue'
// 使用包名导入，这是 Monorepo 的标准做法，pnpm workspace 会自动解析
import { WForm } from '@iswangh/element-plus-kit-form'
import { WCheckTag, WTag } from '@iswangh/element-plus-kit-tag'

/**
 * Element Plus Kit 全局安装函数
 *
 * @param app - Vue 应用实例
 */
export function install(app: App) {
  app.component('WForm', WForm)
  // 使用 Component 类型断言避免类型推断过深的问题
  // 这是处理 Vue 3 + TypeScript 中复杂组件类型推断的标准做法
  app.component('WTag', WTag as Component)
  app.component('WCheckTag', WCheckTag as Component)
  // 未来添加其他组件
  // app.component('WTable', WTable)
}

/**
 * 默认导出安装函数
 */
export default { install }
