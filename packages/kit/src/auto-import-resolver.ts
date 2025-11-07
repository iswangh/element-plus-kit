import type { ResolverFunction } from 'unplugin-auto-import/types'

/**
 * Element Plus Kit Auto Import Resolver
 *
 * 用于 unplugin-auto-import 的自动导入
 */
export function ElementPlusKitAutoImportResolver(): ResolverFunction {
  return (name: string) => {
    if (!name.startsWith('W'))
      return undefined

    const componentName = name.slice(1).toLowerCase()
    const componentMap: Record<string, string> = {
      form: 'form',
    }

    const packageName = componentMap[componentName]
    if (!packageName)
      return undefined

    return `@iswangh/element-plus-kit/${packageName}`
  }
}
