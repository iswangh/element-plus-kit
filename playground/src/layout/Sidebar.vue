<script setup lang="ts">
import type { PropType } from 'vue'
import type { RouteRecordNormalized } from 'vue-router'
import router from '@/router'
import { formRouteMeta, tagRouteMeta } from '@/router/modules'

const route = useRoute()

/**
 * 侧边栏菜单项类型
 */
interface MenuItemType {
  key: string
  label: string
  path: string
  children?: MenuItemType[]
}

/**
 * 递归渲染菜单项组件
 */
const MenuItem = defineComponent({
  name: 'MenuItem',
  props: {
    item: {
      type: Object as PropType<MenuItemType>,
      required: true,
    },
  },
  setup(props) {
    return () => {
      const { item } = props
      // 有子菜单且子菜单不为空
      if (item.children && item.children.length > 0) {
        // 使用 resolveComponent 解析组件（使用 PascalCase 组件名）
        const SubMenu = resolveComponent('ElSubMenu')
        return h(
          SubMenu,
          {
            index: item.path,
          },
          {
            title: () => h('span', item.label),
            default: () => item.children!.map(child => h(MenuItem, { key: child.key, item: child })),
          },
        )
      }
      // 无子菜单
      const MenuItemComponent = resolveComponent('ElMenuItem')
      return h(MenuItemComponent, { index: item.path }, () => item.label)
    }
  },
})

/**
 * 从路由配置中提取侧边栏菜单
 */
const menuItems = computed(() => {
  const routes = router.getRoutes()
  const filteredRoutes = routes.filter(r => r.meta?.showInSidebar !== false)
  const menuTree = buildMenuTree(filteredRoutes)
  return menuTree
})

/**
 * 获取路由元信息中的中文标题
 */
function getRouteTitle(path: string): string | undefined {
  // 从 formRouteMeta 中查找
  const formMeta = formRouteMeta[path as keyof typeof formRouteMeta]
  if (formMeta)
    return formMeta.title

  // 从 tagRouteMeta 中查找
  const tagMeta = tagRouteMeta[path as keyof typeof tagRouteMeta]
  if (tagMeta)
    return tagMeta.title

  // 从路由中查找
  const route = router.getRoutes().find(r => getFullPath(r) === path)
  return route?.meta?.title as string | undefined
}

/**
 * 确保父菜单存在，如果不存在则创建
 */
function ensureParentMenu(
  parentPath: string,
  menuMap: Map<string, MenuItemType>,
  rootMenus: MenuItemType[],
  routes: RouteRecordNormalized[],
): MenuItemType {
  // 如果父菜单已存在，直接返回
  const existing = menuMap.get(parentPath)
  if (existing)
    return existing

  // 优先从路由元信息中获取中文标题，其次从路由中获取，最后使用路径转换
  const parentLabel = getRouteTitle(parentPath)
    || routes.find(r => getFullPath(r) === parentPath)?.meta?.title as string | undefined
    || parentPath.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || parentPath

  const parentParts = parentPath.split('/').filter(Boolean)

  // 创建父菜单
  const newParentMenu: MenuItemType = {
    key: `parent-${parentPath}`,
    label: parentLabel,
    path: parentPath,
    children: [],
  }

  // 如果父菜单还有父菜单，递归创建
  if (parentParts.length > 1) {
    const grandParentPath = `/${parentParts.slice(0, -1).join('/')}`
    const grandParentMenu = ensureParentMenu(grandParentPath, menuMap, rootMenus, routes)
    if (!grandParentMenu.children)
      grandParentMenu.children = []
    grandParentMenu.children.push(newParentMenu)
  }
  else {
    rootMenus.push(newParentMenu)
  }

  menuMap.set(parentPath, newParentMenu)
  return newParentMenu
}

/**
 * 获取路由的完整路径（处理嵌套路由的相对路径）
 */
function getFullPath(route: RouteRecordNormalized): string {
  // 如果路径以 / 开头，说明是绝对路径，直接返回
  if (route.path.startsWith('/'))
    return route.path

  // 如果是相对路径，需要通过路由名称推断完整路径
  // 路由名称格式：form-basic-auto -> /form/basic/auto
  if (route.name && typeof route.name === 'string') {
    const pathFromName = `/${route.name.split('-').join('/')}`
    return pathFromName
  }

  // 如果无法从名称推断，尝试通过查找父路由来构建完整路径
  // 获取所有路由，查找可能的父路由
  const allRoutes = router.getRoutes()
  for (const parentRoute of allRoutes) {
    // 如果父路由有子路由，且当前路由是其中一个子路由
    // 通过比较路由名称或路径来判断
    if (parentRoute.children) {
      const isChild = parentRoute.children.some(child =>
        child.name === route.name || child.path === route.path,
      )
      if (isChild) {
        const parentPath = getFullPath(parentRoute)
        return `${parentPath === '/' ? '' : parentPath}/${route.path}`
      }
    }
  }

  // 如果无法找到父路由，直接返回路径（添加 / 前缀）
  return `/${route.path}`
}

/**
 * 构建菜单树结构
 */
function buildMenuTree(routes: RouteRecordNormalized[]): MenuItemType[] {
  const menuMap = new Map<string, MenuItemType>()
  const rootMenus: MenuItemType[] = []

  // 排序逻辑：优先使用 meta.order，其次按路径深度，最后按路径字符串
  const sortedRoutes = [...routes].sort((a, b) => {
    const fullPathA = getFullPath(a)
    const fullPathB = getFullPath(b)

    // 首页始终在第一位
    if (fullPathA === '/')
      return -1
    if (fullPathB === '/')
      return 1

    // 优先使用 meta.order 字段（如果存在）
    const orderA = (a.meta?.order as number | undefined) ?? Number.MAX_SAFE_INTEGER
    const orderB = (b.meta?.order as number | undefined) ?? Number.MAX_SAFE_INTEGER

    if (orderA !== orderB)
      return orderA - orderB

    // 如果 order 相同，按路径深度排序（浅层在前）
    const depthA = fullPathA.split('/').filter(Boolean).length
    const depthB = fullPathB.split('/').filter(Boolean).length
    if (depthA !== depthB)
      return depthA - depthB

    // 如果深度相同，按路径字符串排序
    return fullPathA.localeCompare(fullPathB)
  })

  for (const routeItem of sortedRoutes) {
    const fullPath = getFullPath(routeItem)
    const pathParts = fullPath.split('/').filter(Boolean)

    // 优先从路由元信息中获取中文标题，其次从路由 meta 中获取，最后使用路由名称
    const menuLabel = getRouteTitle(fullPath)
      || (routeItem.meta?.title as string | undefined)
      || routeItem.name as string

    const menuItem: MenuItemType = {
      key: routeItem.name as string,
      label: menuLabel,
      path: fullPath,
      children: [],
    }

    // 如果是根路径，直接添加到根菜单
    if (_isEmpty(pathParts) || fullPath === '/') {
      rootMenus.push(menuItem)
      menuMap.set('/', menuItem)
      continue
    }

    // 查找父菜单
    if (pathParts.length === 1) {
      // 一级菜单
      rootMenus.push(menuItem)
      menuMap.set(fullPath, menuItem)
    }
    else {
      // 多级菜单，查找或创建父菜单
      const parentPath = `/${pathParts.slice(0, -1).join('/')}`
      const parentMenu = ensureParentMenu(parentPath, menuMap, rootMenus, routes)

      // 将当前菜单项添加到父菜单的 children
      if (!parentMenu.children)
        parentMenu.children = []
      parentMenu.children.push(menuItem)

      menuMap.set(fullPath, menuItem)
    }
  }

  // 对每个菜单的 children 进行排序
  function sortMenuChildren(menus: MenuItemType[]) {
    for (const menu of menus) {
      if (menu.children && menu.children.length > 0) {
        // 按 order 字段排序，如果没有 order 则按路径排序
        menu.children.sort((a, b) => {
          const routeA = routes.find(r => getFullPath(r) === a.path)
          const routeB = routes.find(r => getFullPath(r) === b.path)
          const orderA = (routeA?.meta?.order as number | undefined) ?? Number.MAX_SAFE_INTEGER
          const orderB = (routeB?.meta?.order as number | undefined) ?? Number.MAX_SAFE_INTEGER

          if (orderA !== orderB)
            return orderA - orderB

          return a.path.localeCompare(b.path)
        })

        // 递归排序子菜单
        sortMenuChildren(menu.children)
      }
    }
  }

  sortMenuChildren(rootMenus)

  return rootMenus
}

/**
 * 当前激活的路由路径
 */
const activePath = computed(() => route.path)

/**
 * 获取默认展开的菜单路径数组
 * 默认不展开任何菜单
 */
function getDefaultOpeneds(): string[] {
  return []
}
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">
        Element Plus Kit
      </h2>
    </div>
    <el-menu
      :default-active="activePath"
      :default-openeds="getDefaultOpeneds()"
      :unique-opened="true"
      router
      class="sidebar-menu"
    >
      <MenuItem
        v-for="menuItem in menuItems"
        :key="menuItem.key"
        :item="menuItem"
      />
    </el-menu>
  </div>
</template>

<style scoped lang="scss">
.sidebar {
  width: 240px;
  height: 100vh;
  background-color: #fff;
  border-right: 1px solid #e4e7ed;
  overflow-y: auto;

  &-header {
    padding: 16px;
    border-bottom: 1px solid #e4e7ed;
  }

  &-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }

  &-menu {
    border-right: none;
  }
}
</style>
