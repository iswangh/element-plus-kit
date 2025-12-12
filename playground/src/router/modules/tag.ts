export const tagRouteMeta = {
  // Tag 父菜单（不在侧边栏显示，仅用于获取中文标题）
  '/tag': { title: '标签组件', showInSidebar: false },
  // 基础示例 (order: 1) - 入门必看
  '/tag/basic': { title: '基础示例', showInSidebar: true, order: 1 },
} as const
