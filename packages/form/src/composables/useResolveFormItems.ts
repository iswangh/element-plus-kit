/**
 * @file useResolveFormItems.ts
 * @description 解析表单项的组合式函数，提供获取解析后的表单项和选项的方法
 */
import type { FormItem, FormItems } from '../types'

/** FormItem 组件实例的 Map 类型 */
type FormItemRefsMap = Map<string, { getResolvedFormItem?: () => Promise<FormItem> }>

/** prop 参数类型 */
type PropParam = string | string[] | undefined

/** 映射函数类型 */
type MapperFn<T> = (prop: string, resolvedFormItem: FormItem | undefined) => Promise<T> | T

/** 过滤函数类型 */
type FilterFn = (prop: string, formItem: FormItems[number] | undefined) => boolean

/**
 * 判断 prop 参数是否为字符串类型
 *
 * @param prop - 表单项的 prop（可选）
 * @returns 是否为字符串类型
 */
function isStringParam(prop?: PropParam): boolean {
  return typeof prop === 'string'
}

/**
 * 规范化 prop 参数为 prop 列表
 *
 * @param formItems - 表单项配置数组
 * @param prop - 表单项的 prop（可选）
 * @returns prop 列表
 */
function normalizePropList(formItems: FormItems, prop?: PropParam): string[] {
  if (!prop)
    return formItems.map(item => item.prop)
  return typeof prop === 'string' ? [prop] : prop
}

/**
 * 检查 formItem 是否有 options 或 optionsLoader 配置
 *
 * @param item - 表单项配置
 * @returns 是否有 options 或 optionsLoader
 */
function hasOptionsConfig(item: FormItems[number]): boolean {
  const compProps = item.compProps ?? {}
  return 'options' in compProps || 'optionsLoader' in compProps
}

/**
 * 解析表单项的核心逻辑
 *
 * @param formItems - 表单项配置数组
 * @param formItemRefs - FormItem 组件实例的 Map
 * @param prop - 表单项的 prop（可选）
 * @param mapper - 可选的映射函数，将 prop 和 resolvedFormItem 转换为对应的结果，默认返回 resolvedFormItem
 * @param filter - 可选的过滤函数，用于过滤要处理的 prop
 * @returns Promise，resolve 时返回对应的数据结构
 */
async function resolveFormItems<T = FormItem>(
  formItems: FormItems,
  formItemRefs: FormItemRefsMap,
  prop: PropParam,
  mapper?: MapperFn<T>,
  filter?: FilterFn,
): Promise<T | T[] | undefined> {
  const targetProps = normalizePropList(formItems, prop)
  const isString = isStringParam(prop)

  // 应用过滤函数（如果提供）
  const propsToProcess = filter
    ? targetProps.filter(prop => filter(prop, formItems.find(item => item.prop === prop)))
    : targetProps

  if (propsToProcess.length === 0)
    return isString ? undefined : []

  const settledResults = await Promise.allSettled(
    propsToProcess.map(async (prop) => {
      try {
        const formItemRef = formItemRefs.get(prop)
        const resolvedFormItem = await formItemRef?.getResolvedFormItem?.()
        if (mapper)
          return mapper(prop, resolvedFormItem)
        return resolvedFormItem as T | undefined
      }
      catch {
        return undefined
      }
    }),
  )

  const results = settledResults
    .map(result => result.status === 'fulfilled' ? result.value : undefined)
    .filter(Boolean) as T[]

  return isString ? results[0] as T | undefined : results
}

/**
 * 解析表单项的组合函数
 *
 * @param formItems - 表单项配置数组
 * @param formItemRefs - FormItem 组件实例的 Map
 * @returns 返回两个方法：getResolvedFormItems 和 getResolvedOptions
 */
export function useResolveFormItems(formItems: FormItems, formItemRefs: FormItemRefsMap) {
  /**
   * 获取解析后的表单项（等待 options 加载完成）
   *
   * @param prop - 表单项的 prop（可选）
   *   - 字符串：解析单个 prop，返回 FormItem
   *   - 数组：解析多个 prop，返回 FormItem 数组
   *   - 不传：解析所有 prop，返回 FormItem 数组
   * @returns Promise，resolve 时返回解析后的 formItem（compProps.options 已赋值）
   */
  const getResolvedFormItems = (prop?: PropParam) => resolveFormItems(formItems, formItemRefs, prop)

  /**
   * 获取解析后的 options（等待 options 加载完成）
   *
   * @param prop - 表单项的 prop（可选）
   *   - 字符串：查询单个 prop，返回 options 数组
   *   - 数组：查询多个 prop，返回 [{prop, options}] 格式
   *   - 不传：查询所有有 options 或 optionsLoader 的 prop，返回 [{prop, options}] 格式
   * @returns Promise，resolve 时返回对应的数据结构
   */
  const getResolvedOptions = (prop?: PropParam) => {
    const isString = isStringParam(prop)
    return resolveFormItems(
      formItems,
      formItemRefs,
      prop,
      async (prop, resolvedFormItem) => {
        if (!resolvedFormItem)
          return isString ? [] : { prop, options: [] }
        const options = Array.isArray(resolvedFormItem.compProps?.options) ? resolvedFormItem.compProps.options : []
        return isString ? options : { prop, options }
      },
      (_, formItem) => !!formItem && hasOptionsConfig(formItem),
    )
  }

  return { getResolvedFormItems, getResolvedOptions }
}
