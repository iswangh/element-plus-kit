/* eslint-disable ts/no-explicit-any */
import type { FormCompConfig } from './common'
import type { FormItemComp } from './form-item'

/**
 * 检查组件类型是否包含 options 属性
 * 通过检查组件实例的 $props 中是否包含 'options' 来判断
 * @template C 组件类型
 */
type HasOptionsProp<C extends FormItemComp> = 'options' extends keyof InstanceType<FormCompConfig[C]>['$props']
  ? true
  : false

/**
 * 判断组件是否支持 options 属性
 * 动态从组件类型定义中判断，不硬编码组件名称
 * @template C 组件类型
 */
export type IsOptionsSupported<C extends FormItemComp> = HasOptionsProp<C>

/**
 * 支持 options 属性的组件类型
 * 通过类型系统自动提取，不硬编码
 */
export type OptionsSupportedComp = FormItemComp extends infer C
  ? C extends FormItemComp
    ? IsOptionsSupported<C> extends true
      ? C
      : never
    : never
  : never

/**
 * Options 加载器函数类型
 * @param formData 表单数据（外部依赖通过闭包访问）
 * @returns 返回选项数组（支持同步和异步）
 */
export type OptionsLoader = (formData: Record<string, any>) => any[] | Promise<any[]>

/**
 * Options 对象模式配置
 */
export interface OptionsConfig {
  /**
   * 选项加载器函数
   * @param formData 表单数据（外部依赖通过闭包访问）
   * @returns 返回选项数组（支持同步和异步）
   */
  loader: OptionsLoader
  /**
   * 是否立即加载（默认 true，同函数模式默认初始化获取）
   */
  immediate?: boolean
  /**
   * 依赖字段列表，需要监听并获取
   * 支持内部依赖（表单字段），外部依赖通过闭包访问
   */
  deps?: string[]
}

/**
 * 根据组件类型推断 options 类型
 * @template C 组件类型
 * @template T 组件实例类型
 */
export type InferOptionsType<C extends FormItemComp, T = any> = IsOptionsSupported<C> extends true
  ? T[] | OptionsLoader | OptionsConfig
  : never

/**
 * 获取组件原始的 options 类型
 * 从组件实例的 $props 中提取 options 属性的类型
 * @template C 组件类型
 */
export type GetComponentOptionsType<C extends FormItemComp> = IsOptionsSupported<C> extends true
  ? InstanceType<FormCompConfig[C]>['$props']['options']
  : never

/**
 * 检查组件类型是否包含 loading 属性
 * @template C 组件类型
 */
type HasLoadingProp<C extends FormItemComp> = 'loading' extends keyof InstanceType<FormCompConfig[C]>['$props']
  ? true
  : false

/**
 * 判断组件是否支持 loading 属性
 * @template C 组件类型
 */
export type IsLoadingSupported<C extends FormItemComp> = HasLoadingProp<C>
