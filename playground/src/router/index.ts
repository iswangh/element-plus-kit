/**
 * @file 路由配置
 * @description 动态生成路由配置，支持扁平化路由结构，菜单栏支持多级嵌套显示
 * @module playground/src/router
 */
// 类型导入需要手动导入（类型导入不影响运行时）
import type { RouteRecordRaw } from 'vue-router'
// createRouter、createWebHistory 会自动导入，无需手动导入
import { checkTagRouteMeta, dialogRouteMeta, formRouteMeta, tagRouteMeta } from './modules'

/**
 * 路由元信息类型
 */
interface RouteMetaConfig {
  title: string
  description?: string
  showInSidebar?: boolean
  order?: number // 菜单排序顺序，数字越小越靠前
}

/**
 * 合并所有模块的路由元信息
 */
const routeMetaMap: Record<string, RouteMetaConfig> = {
  '/': { title: '首页', showInSidebar: true },
  '/error/404': { title: '404 - 页面未找到', showInSidebar: false },
  ...formRouteMeta,
  ...tagRouteMeta,
  ...checkTagRouteMeta,
  ...dialogRouteMeta,
}

/**
 * 动态导入所有视图组件
 */
const modules = import.meta.glob<{ default: () => Promise<unknown> }>('../views/**/*.vue', { eager: false })

/**
 * 路由项接口
 */
interface RouteItem {
  path: string
  name: string
  component: () => Promise<unknown>
  meta: RouteMetaConfig
  filePath: string
  isIndex: boolean
}

/**
 * 将文件路径转换为路由路径
 * @example '../views/form/basic/auto.vue' -> '/form/basic/auto'
 * @example '../views/form/basic/index.vue' -> '/form/basic'
 * @example '../views/home/index.vue' -> '/' (首页)
 */
function pathToRoute(filePath: string): string {
  const path = filePath
    .replace('../views', '')
    .replace(/\.vue$/, '')
    .replace(/\/$/, '') || '/'

  // 特殊处理：home/index.vue 对应根路径
  if (path === '/home/index' || path === 'home/index')
    return '/'

  // 如果是 index.vue，返回父路径
  if (path.endsWith('/index'))
    return path.replace('/index', '') || '/'

  return path
}

/**
 * 判断是否为 index.vue 文件
 */
function isIndexFile(filePath: string): boolean {
  return filePath.endsWith('/index.vue') || filePath.endsWith('index.vue')
}

/**
 * 生成路由名称（路径转 kebab-case）
 * @example '/form/basic/auto' -> 'form-basic-auto'
 */
function pathToName(path: string): string {
  return path
    .split('/')
    .filter(Boolean)
    .join('-') || 'home'
}

/**
 * 构建扁平化路由结构（所有路由都是根路由的直接子路由）
 * 保持路径层级用于菜单栏嵌套显示
 * @param routeItems - 路由项数组
 * @returns 扁平化的路由配置数组
 */
function buildNestedRoutes(routeItems: RouteItem[]): RouteRecordRaw[] {
  const rootRoutes: RouteRecordRaw[] = []

  // 按路径深度排序（浅层在前）
  const sortedItems = [...routeItems].sort((a, b) => {
    const depthA = a.path.split('/').filter(Boolean).length
    const depthB = b.path.split('/').filter(Boolean).length
    return depthA - depthB
  })

  for (const item of sortedItems) {
    // 根路径
    if (item.path === '/') {
      const route: RouteRecordRaw = {
        path: '/',
        name: item.name,
        component: item.component,
        meta: {
          ...item.meta,
        },
      }
      rootRoutes.push(route)
      continue
    }

    // 所有其他路由都作为根路由的直接子路由（扁平化）
    // 使用完整路径作为路由路径，保持路径层级用于菜单栏嵌套显示
    const route: RouteRecordRaw = {
      path: item.path,
      name: item.name,
      component: item.component,
      meta: {
        ...item.meta,
      },
    }
    rootRoutes.push(route)
  }

  return rootRoutes
}

/**
 * 生成路由配置
 * @returns 路由配置数组
 */
function generateRoutes(): RouteRecordRaw[] {
  const routeItems: RouteItem[] = []

  // 收集所有路由项
  for (const [filePath, module] of Object.entries(modules)) {
    // 跳过 error 目录下的文件（404 路由单独处理）
    if (filePath.includes('/error/'))
      continue

    const path = pathToRoute(filePath)
    const isIndex = isIndexFile(filePath)

    // 获取路由元信息
    const meta = routeMetaMap[path] || {
      title: path.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Page',
      showInSidebar: path !== '/',
    }

    routeItems.push({
      path,
      name: pathToName(path),
      component: module as () => Promise<unknown>,
      meta: {
        ...meta,
        showInSidebar: meta.showInSidebar ?? path !== '/',
      },
      filePath,
      isIndex,
    })
  }

  // 构建扁平化路由（所有路由都是根路由的直接子路由）
  const routes = buildNestedRoutes(routeItems)

  // 确保首页路由在第一位
  const homeIndex = routes.findIndex(r => r.path === '/')
  if (homeIndex > 0) {
    const homeRoute = routes.splice(homeIndex, 1)[0]
    if (homeRoute)
      routes.unshift(homeRoute)
  }

  // 添加 404 路由
  routes.push({
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/error/404.vue'),
    meta: {
      title: '404 - 页面未找到',
      showInSidebar: false,
    },
  })

  return routes
}

/**
 * 创建路由实例
 */
export const router = createRouter({
  history: createWebHistory(),
  routes: generateRoutes(),
})

/**
 * 路由守卫：设置页面标题
 */
router.beforeEach((to, _from, next) => {
  if (to.meta?.title) {
    document.title = `${to.meta.title} - Element Plus Kit Playground`
  }
  next()
})

export default router
