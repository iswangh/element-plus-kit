import type { ResolverFunction } from 'unplugin-auto-import/types'
import type { ComponentResolver } from 'unplugin-vue-components/types'

/**
 * 组件包映射配置
 */
const COMPONENT_MAP: Record<string, string> = {
  form: 'element-plus-kit-form',
  // 未来扩展
  // table: 'element-plus-kit-table',
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
        from: `@iswangh/${packageName}`,
        // sideEffects 配置：确保样式文件在 Tree Shaking 时不被移除
        // 注意：packages/form/src/index.ts 中已按需导入了所有 Element Plus 组件样式，
        // 当组件被导入时，样式会自动被导入，无需额外配置
        sideEffects: `@iswangh/${packageName}/style.css`,
      }
    },
  }

  // 用于 unplugin-auto-import 的函数解析器
  const autoImportResolver: ResolverFunction = (name: string) => {
    const packageName = resolveComponentName(name)
    if (!packageName)
      return undefined

    return `@iswangh/${packageName}`
  }

  // 合并两个解析器，使其同时支持两种插件
  return Object.assign(componentResolver, autoImportResolver) as ComponentResolver & ResolverFunction
}
