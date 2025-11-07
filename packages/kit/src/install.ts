import type { App } from 'vue'
// 使用包名导入，这是 Monorepo 的标准做法，pnpm workspace 会自动解析
import { WForm } from '@iswangh/element-plus-kit/form'

/**
 * Element Plus Kit 全局安装函数
 *
 * @param app - Vue 应用实例
 */
export function install(app: App) {
  app.component('WForm', WForm)
  // 未来添加其他组件
  // app.component('WTable', WTable)
}

/**
 * 默认导出安装函数
 */
export default {
  install,
}
