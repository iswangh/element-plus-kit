import 'vue-router'

/**
 * 扩展 Vue Router 的 RouteMeta 类型
 */
declare module 'vue-router' {
  interface RouteMeta {
    /** 路由标题 */
    title: string
    /** 路由描述 */
    description?: string
    /** 路由图标 */
    icon?: string
    /** 是否在侧边栏显示 */
    showInSidebar?: boolean
  }
}
