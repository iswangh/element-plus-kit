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
 * OptionsLoader 类型
 */
export type OptionsLoaderType = (formData?: Record<string, any>) => any[] | Promise<any[]>
