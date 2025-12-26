export const dialogRouteMeta = {
  // Dialog 父菜单（不在侧边栏显示，仅用于获取中文标题，但需要 order 值用于排序）
  '/dialog': { title: '弹窗组件', showInSidebar: false, order: 4 },
  // 基础示例 (order: 1) - 入门必看
  '/dialog/basic': { title: '基础示例', showInSidebar: true, order: 1 },
  '/dialog/basic/index': { title: '基础用法', description: 'useDialog 基础用法', showInSidebar: true, order: 1 },
  // el-dialog 原生功能 (order: 2)
  '/dialog/native': { title: 'el-dialog 原生功能', showInSidebar: true, order: 2 },
  '/dialog/native/index': { title: '原生功能示例', description: 'el-dialog 原生属性、事件、插槽', showInSidebar: true, order: 1 },
  // 扩展功能 (order: 3)
  '/dialog/extended': { title: '扩展功能', showInSidebar: true, order: 3 },
  '/dialog/extended/index': { title: '扩展功能示例', description: 'content、loading、scrollbarProps、loadingProps', showInSidebar: true, order: 1 },
  // 数据共享 (order: 4)
  '/dialog/data-sharing': { title: '数据共享', showInSidebar: true, order: 4 },
  '/dialog/data-sharing/index': { title: '数据共享示例', description: '插槽间数据共享、自定义组件数据传递', showInSidebar: true, order: 1 },
  // 生命周期示例 (order: 2)
  '/dialog/lifecycle': { title: '生命周期', showInSidebar: true, order: 2 },
  '/dialog/lifecycle/hooks': { title: '生命周期钩子', description: 'onOpened、onBeforeClose、onClosed 的使用', showInSidebar: true, order: 1 },
  '/dialog/lifecycle/async': { title: '异步钩子', description: '异步生命周期钩子的使用', showInSidebar: true, order: 2 },
  // Loading 示例 (order: 3)
  '/dialog/loading': { title: 'Loading 状态', showInSidebar: true, order: 3 },
  '/dialog/loading/global': { title: '全局 Loading', description: '全局 loading 遮罩层（只作用在内容区域）', showInSidebar: true, order: 1 },
  '/dialog/loading/button': { title: '按钮 Loading', description: '按钮级别的 loading 状态', showInSidebar: true, order: 2 },
  '/dialog/loading/custom': { title: '自定义按钮', description: '自定义按钮的 loading 状态', showInSidebar: true, order: 3 },
  // 表单集成示例 (order: 4)
  '/dialog/form': { title: '表单集成', showInSidebar: true, order: 4 },
  '/dialog/form/basic': { title: '表单弹窗', description: '基础表单弹窗示例', showInSidebar: true, order: 1 },
  '/dialog/form/with-form': { title: 'WForm 集成', description: '与 WForm 组件集成示例', showInSidebar: true, order: 2 },
  // 多实例示例 (order: 5)
  '/dialog/multiple': { title: '多实例', showInSidebar: true, order: 5 },
  '/dialog/multiple/instances': { title: '多弹窗实例', description: '同一页面多个弹窗实例', showInSidebar: true, order: 1 },
  '/dialog/multiple/z-index': { title: 'Z-Index 管理', description: '自动管理 z-index', showInSidebar: true, order: 2 },
  // 高级示例 (order: 6)
  '/dialog/advanced': { title: '高级示例', showInSidebar: true, order: 6 },
  '/dialog/advanced/global-config': { title: '全局配置', description: '页面级别全局配置', showInSidebar: true, order: 1 },
  '/dialog/advanced/before-close': { title: '关闭前确认', description: 'onBeforeClose 阻止关闭', showInSidebar: true, order: 2 },
  '/dialog/advanced/slots': { title: '插槽使用', description: 'header、footer 等插槽的使用', showInSidebar: true, order: 3 },
  '/dialog/advanced/content-height': { title: '内容区域滚动', description: 'scrollbarProps 控制内容区域滚动行为', showInSidebar: true, order: 4 },
} as const
