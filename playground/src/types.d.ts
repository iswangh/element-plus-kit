/**
 * Element Plus Kit 类型声明文件（Playground 专用）
 *
 * 此文件仅用于 playground 开发环境，解决 TypeScript 在解析 workspace 依赖时的类型问题。
 *
 * 当包发布到 npm 后，用户安装使用时，TypeScript 会通过 package.json 中的 "types" 字段
 * 自动解析类型定义文件，无需此声明文件。
 *
 * 注意：此文件仅存在于 playground 目录，不会被打包发布。
 */

declare module '@iswangh/element-plus-kit/form' {
  import type { Component } from 'vue'

  export const WForm: Component
  export default WForm

  // 直接从源文件重新导出类型，确保类型提示正常工作
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
  } from '../../packages/form/src/types'
}

declare module '@iswangh/element-plus-kit' {
  import type { App } from 'vue'

  export function install(app: App): void

  declare const _default: {
    install: typeof install
  }
  export default _default

  export { ElementPlusKitAutoImportResolver } from '@iswangh/element-plus-kit/auto-import-resolver'
  export { WForm } from '@iswangh/element-plus-kit/form'

  // 重新导出类型
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
}
