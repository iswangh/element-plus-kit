export const tagRouteMeta = {
  // Tag 父菜单（不在侧边栏显示，仅用于获取中文标题）
  '/tag': { title: '标签组件', showInSidebar: false },
  // 基础示例 (order: 10) - 放在表单组件下面
  '/tag/basic': { title: '基础示例', showInSidebar: true, order: 10 },
  // 选项示例 (order: 11) - options 和 value 的使用
  '/tag/options': { title: '选项示例', showInSidebar: true, order: 11 },
  '/tag/options/static': { title: '静态选项', description: '使用静态 options 数组配置选项', showInSidebar: true, order: 1 },
  '/tag/options/slots': { title: '插槽示例', description: '使用插槽自定义标签内容', showInSidebar: true, order: 2 },
  '/tag/options/loose-match': { title: '宽松匹配', description: '宽松匹配和严格匹配的对比', showInSidebar: true, order: 3 },
  '/tag/options/field-mapping': { title: '字段映射', description: '自定义字段映射配置', showInSidebar: true, order: 4 },
} as const
