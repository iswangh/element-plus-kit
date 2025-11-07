import type { ResolverFunction } from 'unplugin-auto-import/types'
import type { ComponentResolver } from 'unplugin-vue-components/types'

/**
 * 组件包映射配置
 */
const COMPONENT_MAP: Record<string, string> = {
  form: 'form',
  // 未来扩展
  // table: 'table',
}

/**
 * 解析组件名称
 */
function resolveComponentName(name: string): string | undefined {
  // 只处理以 W 开头的组件名
  if (!name.startsWith('W'))
    return undefined

  // 移除 W 前缀并转换为小写
  const componentName = name.slice(1).toLowerCase()

  return COMPONENT_MAP[componentName]
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
      const packageName = resolveComponentName(name)
      if (!packageName)
        return undefined

      return {
        name,
        from: `@iswangh/element-plus-kit/${packageName}`,
        sideEffects: `@iswangh/element-plus-kit/${packageName}/style.css`,
      }
    },
  }

  // 用于 unplugin-auto-import 的函数解析器
  const autoImportResolver: ResolverFunction = (name: string) => {
    const packageName = resolveComponentName(name)
    if (!packageName)
      return undefined

    return `@iswangh/element-plus-kit/${packageName}`
  }

  // 合并两个解析器，使其同时支持两种插件
  return Object.assign(componentResolver, autoImportResolver) as ComponentResolver & ResolverFunction
}
