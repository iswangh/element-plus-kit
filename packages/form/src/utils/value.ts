/* eslint-disable ts/no-explicit-any */
import { isEmpty } from './lodash'

/**
 * 检查值是否在选项中的参数
 */
export interface CheckValueInOptionsParams {
  /** 当前值（支持单个值或数组值） */
  modelValue: any
  /** 选项数组 */
  options: any[]
  /** 表单项配置，用于获取组件类型等信息 */
  formItem: { compType: string }
}

/**
 * 检查级联路径是否在级联选项中
 */
function checkCascaderPath(path: any[], options: any[]): boolean {
  if (path.length === 0)
    return true

  const [firstValue, ...restPath] = path
  const option = options.find((opt) => {
    const v = typeof opt === 'object' && opt !== null ? opt.value : opt
    return v === firstValue
  })

  if (!option)
    return false

  if (restPath.length > 0) {
    const children = typeof option === 'object' && option !== null ? option.children : undefined
    if (!Array.isArray(children) || children.length === 0)
      return false
    return checkCascaderPath(restPath, children)
  }

  return true
}

/**
 * 检查当前值是否在新的选项中
 * 用于判断是否需要自动清理值：如果值在新的选项中，保留；否则清理
 * @param params - 检查参数
 * @returns 是否在选项中（true 表示在选项中，不需要清理；false 表示不在，需要清理）
 */
export function checkValueInOptions(params: CheckValueInOptionsParams): boolean {
  const { modelValue, options, formItem } = params

  // 如果新选项为空数组，说明依赖被清空了，无论当前值是否为空，都应该清理
  if (options.length === 0)
    return false // 返回 false 表示需要清理

  if (isEmpty(modelValue))
    return true // 当前值为空，认为在选项中（不需要清理）

  // cascader 特殊处理：检查路径数组是否在级联选项中
  if (formItem.compType === 'cascader' && Array.isArray(modelValue)) {
    if (modelValue.length === 0)
      return true
    return checkCascaderPath(modelValue, options)
  }

  // 提取选项值数组（支持对象格式 { value, label } 和原始值格式）
  const optionValues = options.map((option) => {
    return typeof option === 'object' && option !== null ? option.value : option
  })

  // 如果当前值是数组（如 checkbox），检查数组中的每个值是否都在选项中
  if (Array.isArray(modelValue)) {
    return modelValue.length === 0 ? true : modelValue.every(v => optionValues.includes(v))
  }

  // 单个值：检查当前值是否在选项中
  return optionValues.includes(modelValue) // 单个值：检查当前值是否在选项中
}
