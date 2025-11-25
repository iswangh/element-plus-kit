import type { ElColProps, ElRowProps } from './el'

/** Row 布局 Props（扩展自 Element Plus Row 组件 Props） */
export type RowProps = ElRowProps & { span?: number }

/** Col 布局 Props（Element Plus Col 组件 Props） */
export type ColProps = ElColProps
