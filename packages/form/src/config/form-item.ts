/**
 * 需要从 FormItem 中排除的自定义属性键名
 * 这些属性不会传递给 el-form-item 组件
 */
export const FORM_ITEM_EXCLUDED_KEYS = ['compType', 'compProps', 'slots', 'vIf', 'vShow'] as const
