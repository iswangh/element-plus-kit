/**
 * Element Plus Kit
 *
 * 主包入口，聚合所有组件
 */

export { ElementPlusKitAutoImportResolver } from './auto-import-resolver'
// 导出全局安装函数
export { default } from './install'

export { install } from './install'
// 导出 Resolver
export { ElementPlusKitResolver } from './resolver'

// 导出 Form 组件
// 使用包名导入，这是 Monorepo 的标准做法，pnpm workspace 会自动解析
export { WForm } from '@iswangh/element-plus-kit/form'
// 导出类型
export type {
  ActionConfig,
  ActionConfigButtonItem,
  Arrayable,
  ColAttrs,
  ElFormAttrs,
  EventExtendedParams,
  FormItem,
  FormItemComp,
  FormItemCompAttrs,
  FormItems,
  FormItemSlotScope,
  RowAttrs,
} from '@iswangh/element-plus-kit/form'
