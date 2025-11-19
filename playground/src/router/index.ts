// 类型导入需要手动导入（类型导入不影响运行时）
import type { RouteRecordRaw } from 'vue-router'
// createRouter、createWebHistory 会自动导入，无需手动导入
import { formRouteMeta } from './modules'

/**
 * 路由元信息类型
 */
interface RouteMetaConfig {
  title: string
  description?: string
  showInSidebar?: boolean
}

/**
 * 合并所有模块的路由元信息
 */
const routeMetaMap: Record<string, RouteMetaConfig> = {
  '/': { title: '首页', showInSidebar: true },
  '/error/404': { title: '404 - 页面未找到', showInSidebar: false },
  ...formRouteMeta,
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
 * 确保父路由存在，如果不存在则创建
 */
function ensureParentRoute(
  parentPath: string,
  routeMap: Map<string, RouteRecordRaw>,
  rootRoutes: RouteRecordRaw[],
): RouteRecordRaw {
  // 如果父路由已存在，直接返回
  const existing = routeMap.get(parentPath)
  if (existing)
    return existing

  const parentParts = parentPath.split('/').filter(Boolean)

  // 查找父路由的 index.vue 文件
  const parentIndexPath = `${parentPath}/index.vue`
  const parentIndexFile = Object.keys(modules).find(f => f.includes(parentIndexPath.replace('../views', '')))

  // 获取父路由的元信息
  const parentMeta = routeMetaMap[parentPath] || {
    title: parentParts[parentParts.length - 1]?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Page',
    showInSidebar: true,
  }

  // 如果父路由还有父路由，递归创建
  let routePath: string
  if (parentParts.length > 1) {
    // 如果有父路由，使用相对路径（最后一个路径段）
    routePath = parentParts[parentParts.length - 1] || ''
  }
  else {
    // 如果没有父路由，使用绝对路径
    routePath = parentPath
  }

  // 创建父路由
  const parentRoute: RouteRecordRaw = {
    path: routePath,
    name: pathToName(parentPath),
    component: parentIndexFile
      ? modules[parentIndexFile] as () => Promise<unknown>
      : () => Promise.resolve({ default: { template: '<router-view />' } }),
    meta: {
      ...parentMeta,
      showInSidebar: parentMeta.showInSidebar ?? true,
    },
    children: [],
  }

  // 如果父路由还有父路由，递归创建
  if (parentParts.length > 1) {
    const grandParentPath = `/${parentParts.slice(0, -1).join('/')}`
    const grandParentRoute = ensureParentRoute(grandParentPath, routeMap, rootRoutes)
    if (!grandParentRoute.children)
      grandParentRoute.children = []
    grandParentRoute.children.push(parentRoute)
  }
  else {
    rootRoutes.push(parentRoute)
  }

  routeMap.set(parentPath, parentRoute)
  return parentRoute
}

/**
 * 构建嵌套路由结构
 */
function buildNestedRoutes(routeItems: RouteItem[]): RouteRecordRaw[] {
  const routeMap = new Map<string, RouteRecordRaw>()
  const rootRoutes: RouteRecordRaw[] = []

  // 按路径深度排序（浅层在前）
  const sortedItems = [...routeItems].sort((a, b) => {
    const depthA = a.path.split('/').filter(Boolean).length
    const depthB = b.path.split('/').filter(Boolean).length
    return depthA - depthB
  })

  for (const item of sortedItems) {
    const pathParts = item.path.split('/').filter(Boolean)

    // 根路径
    if (item.path === '/') {
      const route: RouteRecordRaw = {
        path: '/',
        name: item.name,
        component: item.component,
        meta: {
          ...item.meta,
        },
        children: [],
      }
      rootRoutes.push(route)
      routeMap.set('/', route)
      continue
    }

    // 一级路由
    if (pathParts.length === 1) {
      // 检查是否已存在（可能由 ensureParentRoute 创建）
      const existing = routeMap.get(item.path)
      if (existing) {
        // 如果已存在，更新组件（使用实际的 index.vue 组件）
        existing.component = item.component
        existing.meta = {
          ...item.meta,
        }
      }
      else {
        const route: RouteRecordRaw = {
          path: item.path,
          name: item.name,
          component: item.component,
          meta: {
            ...item.meta,
          },
          children: [],
        }
        rootRoutes.push(route)
        routeMap.set(item.path, route)
      }
    }
    else {
      // 多级路由
      const parentPath = `/${pathParts.slice(0, -1).join('/')}`

      // 检查当前项是否是 index.vue（父路由本身）
      if (item.isIndex) {
        // index.vue 应该更新对应路径的路由组件
        // 先确保父路由存在（如果不存在，会创建）
        ensureParentRoute(parentPath, routeMap, rootRoutes)

        // 检查当前路径的路由是否已存在
        const existing = routeMap.get(item.path)
        if (existing) {
          // 如果已存在（可能由 ensureParentRoute 创建），更新组件
          existing.component = item.component
          existing.meta = {
            ...item.meta,
          }
        }
        else {
          // 如果不存在，需要创建路由并添加到父路由的 children
          const parentRoute = ensureParentRoute(parentPath, routeMap, rootRoutes)
          const route: RouteRecordRaw = {
            path: pathParts[pathParts.length - 1] || '',
            name: item.name,
            component: item.component,
            meta: {
              ...item.meta,
            },
            children: [],
          }

          if (!parentRoute.children)
            parentRoute.children = []
          parentRoute.children.push(route)

          // 使用完整路径作为 key，用于查找
          routeMap.set(item.path, route)
        }
      }
      else {
        // 非 index.vue，查找或创建父路由，然后创建子路由
        const parentRoute = ensureParentRoute(parentPath, routeMap, rootRoutes)

        // 子路由使用相对路径（相对于父路由）
        const childPath = pathParts[pathParts.length - 1] || ''
        const route: RouteRecordRaw = {
          path: childPath,
          name: item.name,
          component: item.component,
          meta: {
            ...item.meta,
          },
          children: [],
        }

        // 将当前路由添加到父路由的 children
        if (!parentRoute.children)
          parentRoute.children = []
        parentRoute.children.push(route)

        // 使用完整路径作为 key，用于查找
        routeMap.set(item.path, route)
      }
    }
  }

  return rootRoutes
}

/**
 * 生成路由配置
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

  // 构建嵌套路由
  const routes = buildNestedRoutes(routeItems)

  // 确保首页路由在第一位
  const homeIndex = routes.findIndex(r => r.path === '/')
  if (homeIndex > 0) {
    const homeRoute = routes.splice(homeIndex, 1)[0]
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
