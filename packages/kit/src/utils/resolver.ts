import type { ResolverFunction } from 'unplugin-auto-import/types'
import type { ComponentResolver } from 'unplugin-vue-components/types'

/**
 * 主包名称：
 * resolver 统一指向主包，由主包负责 re-export 子模块。
 * 这样业务侧只安装 @iswangh/element-plus-kit 即可在 pnpm 严格依赖下正常解析。
 */
const MAIN_PACKAGE_NAME = '@iswangh/element-plus-kit'

/**
 * 对外暴露给 resolver 的组件白名单（精确匹配）
 */
const EXPOSED_COMPONENTS = new Set([
  'WForm',
  'WTag',
  'WCheckTag',
  // 未来扩展
  // 'WTable',
  // 'WTableColumn',
])

/** 主包内统一样式副作用子路径（与 package.json exports 一致） */
const RESOLVER_STYLE_SIDE_EFFECTS = `${MAIN_PACKAGE_NAME}/resolver-side-effects`

/**
 * 解析组件名称
 *
 * 使用精确匹配，确保只匹配已暴露的组件，并统一从主包导入。
 */
function resolveComponentName(name: string): string | undefined {
  if (!name.startsWith('W'))
    return undefined

  return EXPOSED_COMPONENTS.has(name) ? name : undefined
}

/**
 * Element Plus Kit Resolver
 *
 * 统一解析器，同时支持 unplugin-vue-components 和 unplugin-auto-import
 *
 * @example
 * ```typescript
 * import Components from 'unplugin-vue-components/vite'
 * import AutoImport from 'unplugin-auto-import/vite'
 * import { ElementPlusKitResolver } from '@iswangh/element-plus-kit/resolver'
 *
 * Components({
 *   resolvers: [
 *     ElementPlusResolver(),
 *     ElementPlusKitResolver(),
 *   ],
 * })
 *
 * AutoImport({
 *   resolvers: [
 *     ElementPlusResolver(),
 *     ElementPlusKitResolver(),
 *   ],
 * })
 * ```
 */
export function ElementPlusKitResolver(): ComponentResolver & ResolverFunction {
  // 用于 unplugin-vue-components 的组件解析器
  const componentResolver: ComponentResolver = {
    type: 'component',
    resolve: (name: string) => {
      const componentName = resolveComponentName(name)
      if (!componentName)
        return undefined

      return {
        name: componentName,
        from: MAIN_PACKAGE_NAME,
        sideEffects: RESOLVER_STYLE_SIDE_EFFECTS,
      }
    },
  }

  // 用于 unplugin-auto-import 的函数解析器
  const autoImportResolver: ResolverFunction = (name: string) => {
    const componentName = resolveComponentName(name)
    if (!componentName)
      return undefined

    return MAIN_PACKAGE_NAME
  }

  // 合并两个解析器，使其同时支持两种插件
  return Object.assign(componentResolver, autoImportResolver) as ComponentResolver & ResolverFunction
}
