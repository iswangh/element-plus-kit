/**
 * Form 模块路由元信息配置
 */
export const formRouteMeta = {
  '/form': { title: 'Form 组件', showInSidebar: true },
  '/form/basic': { title: '基础示例', showInSidebar: true },
  '/form/basic/auto': { title: '自动导入', description: '使用 unplugin-vue-components 自动导入组件', showInSidebar: true },
  '/form/basic/global': { title: '全局导入', description: '使用 app.use() 全局注册组件', showInSidebar: true },
  '/form/basic/manual': { title: '手动导入', description: '手动导入组件使用', showInSidebar: true },
  '/form/deps': { title: '依赖示例', showInSidebar: true },
  '/form/deps/internal': { title: '内部依赖', description: '选项依赖表单内部字段', showInSidebar: true },
  '/form/deps/external': { title: '外部依赖', description: '选项依赖外部状态', showInSidebar: true },
  '/form/deps/mixed': { title: '混合依赖', description: '选项依赖内部和外部状态', showInSidebar: true },
  '/form/deps/auto-clear': { title: '智能清理', description: '选项变化时自动清理无效值', showInSidebar: true },
  '/form/options': { title: '选项示例', showInSidebar: true },
  '/form/options/function': { title: '函数模式', description: '使用函数加载选项', showInSidebar: true },
  '/form/options/object': { title: '对象模式', description: '使用对象配置加载选项', showInSidebar: true },
  '/form/layout': { title: '布局示例', showInSidebar: true },
  '/form/layout/default': { title: '默认布局', description: '通过 rowAttrs 和 colAttrs 配置布局', showInSidebar: true },
  '/form/layout/inline': { title: '一行展示', description: '使用 inline 属性，表单项在一行内展示', showInSidebar: true },
  '/form/expand': { title: '展开/折叠', description: '表单字段展开/折叠功能', showInSidebar: true },
} as const
