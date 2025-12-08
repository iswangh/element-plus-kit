/* eslint-disable ts/no-explicit-any */
import type { FormItemComp, FormItemCompProps } from './comp'

/**
 * 检查组件类型是否包含 options 属性
 * 通过检查组件实例的 $props 中是否包含 'options' 来判断
 * @template T 组件类型
 */
export type HasOptionsProp<T extends FormItemComp> = 'options' extends keyof FormItemCompProps<T>
  ? true
  : false

/**
 * OptionsLoader 函数类型
 * @param formData 表单数据（外部依赖通过闭包访问）
 * @returns 返回选项数组（支持同步和异步）
 */
export type OptionsLoaderFn = (formData: Record<string, any>) => any[] | Promise<any[]>

/**
 * OptionsLoader 对象模式配置
 */
export interface OptionsLoaderConfig {
  /**
   * 选项加载器函数
   * @param formData 表单数据（外部依赖通过闭包访问）
   * @returns 返回选项数组（支持同步和异步）
   */
  loader: OptionsLoaderFn
  /**
   * 是否立即加载（默认 false，需要显式设置为 true 才会立即加载）
   */
  immediate?: boolean
  /**
   * 依赖字段列表，需要监听并获取
   * 支持内部依赖（表单字段），外部依赖通过闭包访问
   */
  deps?: string[]
}

/**
 * OptionsLoader 类型（支持函数和对象模式）
 * 外部应使用此类型，而不是直接使用 OptionsLoaderFn 或 OptionsLoaderConfig
 */
export type OptionsLoaderType = OptionsLoaderFn | OptionsLoaderConfig
