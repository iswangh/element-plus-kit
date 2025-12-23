export const checkTagRouteMeta = {
  // CheckTag 父菜单（不在侧边栏显示，仅用于获取中文标题，但需要 order 值用于排序）
  '/check-tag': { title: '可选标签组件', showInSidebar: false, order: 3 },
  // 基础示例 (order: 1) - 放在表单组件下面
  '/check-tag/basic': { title: '基础示例', showInSidebar: true, order: 1 },
  // 选项示例 (order: 2) - options 和 value 的使用
  '/check-tag/options': { title: '选项示例', showInSidebar: true, order: 2 },
  '/check-tag/options/field-mapping': { title: '字段映射', description: '自定义字段映射配置', showInSidebar: true, order: 1 },
} as const
