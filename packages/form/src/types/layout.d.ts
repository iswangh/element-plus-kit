import type { ElColAttrs, ElRowAttrs } from './el'

/** Row 布局属性（扩展自 Element Plus Row 组件属性） */
export type RowAttrs = ElRowAttrs & { span?: number }

/** Col 布局属性（Element Plus Col 组件属性） */
export type ColAttrs = ElColAttrs
