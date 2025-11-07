import type { ComponentResolver } from 'unplugin-vue-components/types'

/**
 * Element Plus Kit Resolver
 *
 * 用于 unplugin-vue-components 的按需引入
 *
 * @example
 * ```typescript
 * import Components from 'unplugin-vue-components/vite'
 * import { ElementPlusKitResolver } from '@iswangh/element-plus-kit/resolver'
 *
 * Components({
 *   resolvers: [
 *     ElementPlusResolver(),
 *     ElementPlusKitResolver(),
 *   ],
 * })
 * ```
 */
export function ElementPlusKitResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      // 只处理以 W 开头的组件名
      if (!name.startsWith('W'))
        return undefined

      // 移除 W 前缀并转换为小写
      const componentName = name.slice(1).toLowerCase()

      // 组件包映射
      const componentMap: Record<string, string> = {
        form: 'form',
        // 未来扩展
        // table: 'table',
      }

      const packageName = componentMap[componentName]
      if (!packageName)
        return undefined

      return {
        name,
        from: `@iswangh/element-plus-kit/${packageName}`,
        sideEffects: `@iswangh/element-plus-kit/${packageName}/style.css`,
      }
    },
  }
}
