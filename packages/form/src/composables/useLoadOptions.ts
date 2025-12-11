/* eslint-disable ts/no-explicit-any */
import type { FormItems } from '../types'
import { ref, toRaw } from 'vue'

/**
 * 选项结果类型
 */
type OptionsResult = any[] | Array<{ prop: string, options: any[] }>

/**
 * 选项加载组合式函数
 *
 * @param formItems - 表单配置项
 * @param formData - 表单数据（可选），会传递给 optionsLoader 函数
 * @returns 加载函数、获取函数和加载状态
 *
 * @example
 *
 * const form = ref({ province: '1' })
 * const formItems = ref<FormItems>([
 *   {
 *     prop: 'city',
 *     compType: 'select',
 *     compProps: {
 *       optionsLoader: (formData) => {
 *         const province = formData?.province || form.value.province
 *         return fetch(`/api/cities?province=${province}`).then(r => r.json())
 *       },
 *     },
 *   },
 * ])
 *
 * const { loadOptions, getOptions, loading } = useLoadOptions(formItems.value, form.value)
 *
 * // 加载单个字段的选项
 * await loadOptions('city')
 *
 * // 加载多个字段的选项
 * await loadOptions(['city', 'district'])
 *
 * // 加载所有有 optionsLoader 的字段
 * await loadOptions()
 *
 * // 获取单个字段的选项
 * const cityOptions = getOptions('city')  // 返回: any[]
 *
 * // 获取多个字段的选项
 * const options = getOptions(['city', 'district'])  // 返回: [{prop: 'city', options: [...]}, ...]
 *
 * // 获取所有字段的选项
 * const allOptions = getOptions()  // 返回: [{prop: 'city', options: [...]}, ...]
 */
// 使用 any[] 避免深度类型推断导致的"类型实例化过深"错误
export function useLoadOptions(formItems: any[], formData?: Record<string, any>) {
  const loading = ref(false)

  /**
   * 获取候选字段（内部辅助函数）
   */
  function getCandidateFormItems(props?: string | string[]): FormItems {
    const innerFormItems = formItems as FormItems
    return props
      ? (Array.isArray(props) ? props : [props])
          .map(prop => innerFormItems.find(item => item.prop === prop))
          .filter((item): item is NonNullable<typeof item> => !!item)
      : innerFormItems
  }

  /**
   * 加载选项
   *
   * @param props - 字段名或字段名数组，不传则加载所有有 optionsLoader 的字段
   * @returns Promise<void>
   */
  async function loadOptions(props?: string | string[]): Promise<void> {
    loading.value = true

    try {
      const candidateFormItems = getCandidateFormItems(props)
      const targetFormItems = candidateFormItems.filter(item => typeof item.compProps?.optionsLoader === 'function')

      const promises = targetFormItems.map(async (formItem) => {
        try {
          const optionsLoader = formItem.compProps.optionsLoader
          const options = await optionsLoader(formData)
          formItem.compProps.options = Array.isArray(options) ? options : []
        }
        catch (error) {
          const fieldName = formItem.label || formItem.prop
          console.error(`[useLoadOptions] 字段 "${fieldName}" (${formItem.prop}) 的选项加载失败，已跳过该字段:`, error)
          // 失败时设置默认值，确保 options 始终是数组
          formItem.compProps.options = []
        }
      })

      await Promise.allSettled(promises)
    }
    finally {
      loading.value = false
    }
  }

  /**
   * 获取选项
   *
   * @param props - 字段名或字段名数组，不传则获取所有字段的选项
   * @returns 单个字段（字符串）返回选项数组 `any[]`，多个字段（数组）或全部（不传）返回 `Array<{prop: string, options: any[]}>`
   */
  function getOptions(props?: string | string[]): OptionsResult {
    const candidateFormItems = getCandidateFormItems(props)
    const targetFormItems = candidateFormItems.filter(item => Array.isArray(item.compProps?.options))

    // 单个字段：返回选项数组
    if (props && !Array.isArray(props)) {
      const formItem = targetFormItems.find(item => item.prop === props)
      const options = formItem?.compProps?.options
      return options ? toRaw(options) : []
    }

    // 多个字段或全部：返回 [{prop, options}] 数组
    return targetFormItems.map(item => ({
      prop: item.prop,
      options: item.compProps?.options ? toRaw(item.compProps.options) : [],
    }))
  }

  return { loading, loadOptions, getOptions }
}
