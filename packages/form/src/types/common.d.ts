/* eslint-disable ts/no-explicit-any */
/** 允许数组类型 */
export type Arrayable<T> = T | T[]

/**
 * 条件类型
 * 支持布尔值或接收数据的函数
 * @template T - 数据类型，默认为 Record<string, any>
 */
export type Condition<T = Record<string, any>> = boolean | ((data: T) => boolean)
