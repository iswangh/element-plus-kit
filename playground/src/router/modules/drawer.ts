export const drawerRouteMeta = {
  // Drawer 父菜单（不在侧边栏显示，仅用于获取中文标题，但需要 order 值用于排序）
  '/drawer': { title: '抽屉', showInSidebar: false, order: 5 },
  // 基础示例 (order: 1) - 入门必看
  '/drawer/basic': { title: '基础示例', showInSidebar: true, order: 1 },
  '/drawer/basic/index': { title: '基础用法', description: 'useDrawer 基础用法', showInSidebar: true, order: 1 },
  // el-drawer 原生功能 (order: 2)
  '/drawer/native': { title: 'el-drawer 原生功能', showInSidebar: true, order: 2 },
  '/drawer/native/index': { title: '原生功能示例', description: 'el-drawer 原生属性、事件、插槽', showInSidebar: true, order: 1 },
  // 扩展功能 (order: 3)
  '/drawer/extended': { title: '扩展功能', showInSidebar: true, order: 3 },
  '/drawer/extended/index': { title: '扩展功能示例', description: 'content、loading、scrollbarProps、loadingProps', showInSidebar: true, order: 1 },
  // 数据共享 (order: 4)
  '/drawer/data-sharing': { title: '数据共享', showInSidebar: true, order: 4 },
  '/drawer/data-sharing/index': { title: '数据共享示例', description: '插槽间数据共享、自定义组件数据传递', showInSidebar: true, order: 1 },
} as const
