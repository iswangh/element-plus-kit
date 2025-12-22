/**
 * Element Plus Kit Tag Component
 *
 * Tag 组件导出
 *
 * 样式导入说明：
 * - WTag 组件已按需导入了 Element Plus Tag 组件样式
 * - 用户导入 WTag 组件时，样式会自动导入，无需额外配置
 * - 实现了真正的按需导入，只导入使用的组件样式，不导入全部样式
 * - 如果用户需要单独导入样式，可以使用：import '@iswangh/element-plus-kit-tag/style.css'
 *
 * 使用示例：
 * ```typescript
 * // 方式一：直接导入组件（推荐，样式会自动导入）
 * import { WTag } from '@iswangh/element-plus-kit-tag'
 *
 * // 方式二：单独导入样式（如果需要）
 * import '@iswangh/element-plus-kit-tag/style.css'
 * ```
 */

// ============================================
// Element Plus Tag 组件样式
// ============================================
import 'element-plus/es/components/tag/style/css'

// 导出 WTag 组件
export { default } from './Tag.vue'

export { default as WTag } from './Tag.vue'

export type { TagFieldProps, TagOption, TagSlotScope, TagValue } from './types'
