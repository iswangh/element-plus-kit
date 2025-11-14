import type { FORM_ITEM_COMP_MAP } from '../config'

/** 允许数组类型 */
export type Arrayable<T> = T | T[]

/**
 * 表单组件配置映射类型
 * 共享类型定义，避免在多个文件中重复定义导致冲突
 */
export type FormCompConfig = typeof FORM_ITEM_COMP_MAP
