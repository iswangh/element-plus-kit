/**
 * Element Plus Kit Form Component
 *
 * Form 组件导出
 *
 * 样式导入说明：
 * - WForm 组件已按需导入了所有内部使用的 Element Plus 组件样式
 * - 用户导入 WForm 组件时，样式会自动导入，无需额外配置
 * - 实现了真正的按需导入，只导入使用的组件样式，不导入全部样式
 * - 如果用户需要单独导入样式，可以使用：import '@iswangh/element-plus-kit-form/style.css'
 *
 * 使用示例：
 * ```typescript
 * // 方式一：直接导入组件（推荐，样式会自动导入）
 * import { WForm } from '@iswangh/element-plus-kit-form'
 *
 * // 方式二：单独导入样式（如果需要）
 * import '@iswangh/element-plus-kit-form/style.css'
 * ```
 */

// ============================================
// Element Plus 基础组件样式（WForm 内部使用）
// ============================================
// 表单相关组件
import 'element-plus/es/components/form/style/css'
import 'element-plus/es/components/form-item/style/css'
// 布局组件
import 'element-plus/es/components/row/style/css'
import 'element-plus/es/components/col/style/css'
// 按钮组件
import 'element-plus/es/components/button/style/css'
// 图标组件
import 'element-plus/es/components/icon/style/css'
// ============================================
// Element Plus 表单控件组件样式（动态组件）
// ============================================
// 输入类组件
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/input-number/style/css'
import 'element-plus/es/components/input-tag/style/css'
import 'element-plus/es/components/autocomplete/style/css'
import 'element-plus/es/components/mention/style/css'
// 选择类组件
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/select-v2/style/css'
import 'element-plus/es/components/cascader/style/css'
import 'element-plus/es/components/tree-select/style/css'
// 日期时间类组件
import 'element-plus/es/components/date-picker/style/css'
import 'element-plus/es/components/date-picker-panel/style/css'
import 'element-plus/es/components/time-picker/style/css'
import 'element-plus/es/components/time-select/style/css'
// 其他表单组件
import 'element-plus/es/components/checkbox-group/style/css'
import 'element-plus/es/components/radio-group/style/css'
import 'element-plus/es/components/switch/style/css'
import 'element-plus/es/components/slider/style/css'
import 'element-plus/es/components/rate/style/css'
import 'element-plus/es/components/color-picker/style/css'
import 'element-plus/es/components/color-picker-panel/style/css'
import 'element-plus/es/components/transfer/style/css'
// 导入 WForm 组件的自定义样式
import './style/index.scss'

// 导出组合式函数
export * from './composables'
export { default } from './Form.vue'

export { default as WForm } from './Form.vue'

export type { FormActionConfig, FormItemEventExtendedParams, FormItems, FormItemSlotScope } from './types'
