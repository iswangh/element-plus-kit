/* eslint-disable ts/no-explicit-any */

/**
 * 检查值是否为空
 */
export function isEmpty(val: any): boolean {
  return val == null || val === ''
}

/**
 * 检查当前值是否在新的选项中
 * 用于判断是否需要自动清理值：如果值在新的选项中，保留；否则清理
 * @param currentValue - 当前值
 * @param options - 选项数组
 * @returns 是否在选项中（true 表示在选项中，不需要清理；false 表示不在，需要清理）
 */
export function checkValueInOptions(currentValue: any, options: any[]): boolean {
  // 如果新选项为空数组，说明依赖被清空了，无论当前值是否为空，都应该清理
  if (options.length === 0)
    return false // 返回 false 表示需要清理

  if (isEmpty(currentValue))
    return true // 当前值为空，认为在选项中（不需要清理）

  // 检查当前值是否在选项中（支持对象格式 { value, label } 和原始值格式）
  return options.some((option) => {
    const optionValue = typeof option === 'object' && option !== null ? option.value : option
    return optionValue === currentValue
  })
}
