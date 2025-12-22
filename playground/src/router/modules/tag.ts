export const tagRouteMeta = {
  // Tag 父菜单（不在侧边栏显示，仅用于获取中文标题）
  '/tag': { title: '标签组件', showInSidebar: false },
  // 基础示例 (order: 10) - 放在表单组件下面
  '/tag/basic': { title: '基础示例', showInSidebar: true, order: 10 },
  // 选项示例 (order: 11) - options 和 value 的使用
  '/tag/options': { title: '选项示例', description: 'options 和 value 的使用示例', showInSidebar: true, order: 11 },
} as const
