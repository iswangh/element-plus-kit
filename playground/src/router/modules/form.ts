export const formRouteMeta = {
  // Form 父菜单（不在侧边栏显示，仅用于获取中文标题）
  '/form': { title: '表单组件', showInSidebar: false },
  // 基础示例 (order: 1) - 入门必看
  '/form/basic': { title: '基础示例', showInSidebar: true, order: 1 },
  '/form/basic/auto': { title: '自动导入', description: '使用 unplugin-vue-components 自动导入组件', showInSidebar: true, order: 1 },
  '/form/basic/global': { title: '全局导入', description: '使用 app.use() 全局注册组件', showInSidebar: true, order: 2 },
  '/form/basic/manual': { title: '手动导入', description: '手动导入组件使用', showInSidebar: true, order: 3 },
  // 组件类型示例 (order: 2) - 了解所有支持的组件类型
  '/form/components': { title: '组件类型', showInSidebar: true, order: 2 },
  '/form/components/index': { title: '所有组件', description: '展示所有支持的组件类型', showInSidebar: true, order: 1 },
  // 布局示例 (order: 3) - 了解如何配置表单布局
  '/form/layout': { title: '布局示例', showInSidebar: true, order: 3 },
  '/form/layout/default': { title: '默认布局', description: '通过 rowProps 和 colProps 配置布局', showInSidebar: true, order: 1 },
  '/form/layout/inline': { title: '一行展示', description: '使用 inline 属性，表单项在一行内展示', showInSidebar: true, order: 2 },
  // 条件渲染示例 (order: 4) - 了解如何控制字段显示/隐藏
  '/form/conditional': { title: '条件渲染', showInSidebar: true, order: 4 },
  '/form/conditional/vif': { title: 'vIf 条件渲染', description: '使用 vIf 控制字段显示/隐藏', showInSidebar: true, order: 1 },
  '/form/conditional/vshow': { title: 'vShow 显示/隐藏', description: '使用 vShow 控制字段显示/隐藏', showInSidebar: true, order: 2 },
  '/form/conditional/mixed': { title: '混合使用', description: 'vIf 和 vShow 混合使用', showInSidebar: true, order: 3 },
  // 选项示例 (order: 5) - 了解如何配置选项数据
  '/form/options': { title: '选项示例', showInSidebar: true, order: 5 },
  '/form/options/function': { title: '函数模式', description: '使用函数加载选项', showInSidebar: true, order: 1 },
  '/form/options/object': { title: '对象模式', description: '使用对象配置加载选项', showInSidebar: true, order: 2 },
  // 依赖示例 (order: 6) - 了解选项依赖功能
  '/form/deps': { title: '依赖示例', showInSidebar: true, order: 6 },
  '/form/deps/internal': { title: '内部依赖', description: '选项依赖表单内部字段', showInSidebar: true, order: 1 },
  '/form/deps/external': { title: '外部依赖', description: '选项依赖外部状态', showInSidebar: true, order: 2 },
  '/form/deps/mixed': { title: '混合依赖', description: '选项依赖内部和外部状态', showInSidebar: true, order: 3 },
  '/form/deps/auto-clear': { title: '智能清理', description: '选项变化时自动清理无效值', showInSidebar: true, order: 4 },
  // 插槽示例 (order: 7) - 了解插槽功能
  '/form/slots': { title: '插槽示例', showInSidebar: true, order: 8 },
  // 可配置化示例 (order: 9) - 了解可配置化事件和插槽
  '/form/configurable': { title: '可配置化示例', showInSidebar: true, order: 9 },
  '/form/configurable/events': { title: '事件配置', description: '可配置化事件和 WForm 事件的优先级', showInSidebar: true, order: 1 },
  '/form/configurable/slots': { title: '插槽配置', description: '可配置化插槽和模板插槽的优先级', showInSidebar: true, order: 2 },
  // 操作按钮 (order: 9) - 了解操作按钮配置（放在最后，因为依赖前面的知识）
  '/form/actions': { title: '操作按钮', showInSidebar: true, order: 9 },
  '/form/actions/expand': { title: '展开/折叠', description: '表单字段展开/折叠功能', showInSidebar: true, order: 1 },
  '/form/actions/loading': { title: 'Loading 状态', description: '测试按钮的 loading 状态支持', showInSidebar: true, order: 2 },
  '/form/actions/custom': { title: '自定义按钮', description: '测试自定义按钮配置', showInSidebar: true, order: 3 },
  '/form/actions/dynamic': { title: '动态控制', description: '测试动态控制按钮状态', showInSidebar: true, order: 4 },
} as const
