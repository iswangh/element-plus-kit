import type { TagFieldProps, TagOption, TagValue } from '../types'

/**
 * 值匹配选项
 */
interface MatchOptions {
  /** 选项列表 */
  options: TagOption[]
  /** 要匹配的值 */
  value: TagValue
  /** 字段映射配置 */
  fieldProps?: TagFieldProps
  /** 是否宽松匹配 */
  looseMatch?: boolean
}

/**
 * 匹配选项结果
 */
export interface MatchResult {
  /** 匹配到的选项 */
  option: TagOption | null
  /** 匹配到的标签文本 */
  label: string | null
  /** 是否匹配成功 */
  matched: boolean
}

/**
 * 值比较函数（支持宽松匹配）
 */
function compareValues(a: unknown, b: unknown, looseMatch: boolean): boolean {
  if (!looseMatch)
    return a === b

  // 宽松匹配：根据类型组合进行匹配
  const aType = typeof a
  const bType = typeof b

  // 类型相同，直接比较
  if (aType === bType)
    return a === b

  // 布尔值和字符串互相匹配
  switch (`${aType}-${bType}`) {
    case 'boolean-string':
      return a === (b === 'true')
    case 'string-boolean':
      return (a === 'true') === b
    case 'number-string':
      return a === Number(b) || String(a) === b
    case 'string-number':
      return Number(a) === b || a === String(b)
    default:
      return a === b
  }
}

/**
 * 从选项列表中匹配对应的选项
 *
 * @param options - 匹配配置
 * @returns 匹配结果
 */
export function matchOption(options: MatchOptions): MatchResult {
  const {
    options: optionList,
    value,
    fieldProps = { label: 'label', value: 'value' },
    looseMatch = true,
  } = options

  if (!Array.isArray(optionList) || optionList.length === 0) {
    return { option: null, label: null, matched: false }
  }

  const labelKey = fieldProps.label || 'label'
  const valueKey = fieldProps.value || 'value'

  // 查找匹配的选项
  const matchedOption = optionList.find((option) => {
    const optionValue = option[valueKey]
    return compareValues(optionValue, value, looseMatch)
  })

  if (!matchedOption) {
    return { option: null, label: null, matched: false }
  }

  const label = matchedOption[labelKey] as string | undefined
  return {
    option: matchedOption,
    label: label ?? null,
    matched: true,
  }
}
