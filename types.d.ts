/**
 * Element Plus Kit 类型声明文件
 *
 * 此文件仅用于本地开发环境（monorepo workspace），解决 TypeScript 在解析 workspace 依赖时的类型问题。
 *
 * 当包发布到 npm 后，用户安装使用时，TypeScript 会通过 package.json 中的 "types" 字段
 * 自动解析类型定义文件，无需此声明文件。
 *
 * 注意：此文件仅存在于开发环境，不会被打包发布。
 */

// 从源文件导入类型定义，用于在 declare module 中重新导出
import type {
  ActionConfig,
  ActionConfigButtonItem,
  Arrayable,
  ColAttrs,
  ElFormAttrs,
  EventExtendedParams,
  FormItem,
  FormItems,
  FormItemSlotScope,
  RowAttrs,
} from './packages/form/src/types'

declare module '@iswangh/element-plus-kit' {
  import type { App } from 'vue'

  export function install(app: App): void

  declare const _default: {
    install: typeof install
  }
  export default _default

  export { ElementPlusKitAutoImportResolver } from '@iswangh/element-plus-kit/auto-import-resolver'
  export { WForm } from '@iswangh/element-plus-kit/form'

  export type {
    ActionConfig,
    ActionConfigButtonItem,
    Arrayable,
    ColAttrs,
    ElFormAttrs,
    EventExtendedParams,
    FormItem,
    FormItems,
    FormItemSlotScope,
    RowAttrs,
  } from '@iswangh/element-plus-kit/form'

  export { ElementPlusKitResolver } from '@iswangh/element-plus-kit/resolver'
}

declare module '@iswangh/element-plus-kit/form' {
  import type { Component } from 'vue'

  export const WForm: Component
  export default WForm

  // 重新导出类型（从文件顶部导入的类型）
  export type {
    ActionConfig,
    ActionConfigButtonItem,
    Arrayable,
    ColAttrs,
    ElFormAttrs,
    EventExtendedParams,
    FormItem,
    FormItems,
    FormItemSlotScope,
    RowAttrs,
  }
}
