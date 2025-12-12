/**
 * Element Plus Kit
 *
 * 主包入口，聚合所有组件
 */

// 导出类型（统一从 types 导出，避免代码重复）
export type * from './types'
// 导出工具函数（安装函数和 Resolver）
export { default, ElementPlusKitResolver, install } from './utils'
// 导出 Form 组件和组合式函数
// 使用包名导入，这是 Monorepo 的标准做法，pnpm workspace 会自动解析
export { useLoadOptions, WForm } from '@iswangh/element-plus-kit-form'
// 导出 Tag 组件
export { WTag } from '@iswangh/element-plus-kit-tag'
