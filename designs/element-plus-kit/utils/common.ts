/**
 * 条件判断选项类型定义
 */
interface CheckConditionOptions<T = unknown> {
  condition?: boolean | ((data: T) => boolean)
  data?: T
  defaultValue?: boolean
}

/**
 * 条件渲染判断函数
 *
 * 用于处理表单项的条件渲染逻辑，支持布尔值或返回布尔值的函数。
 * 主要用于 v-if 和 v-show 指令的条件判断，支持动态数据依赖。
 *
 * @template T - 数据上下文的类型，默认为 unknown
 *
 * @param {CheckConditionOptions<T>} options - 条件判断配置选项
 * @param {boolean | ((data: T) => boolean)} [options.condition] - 判断条件
 *   - 当为 boolean 时：直接返回该布尔值
 *   - 当为 function 时：执行函数并返回结果，函数接收 data 作为参数
 *   - 当为 undefined 时：返回 defaultValue
 * @param {T} [options.data] - 数据上下文，传递给条件函数的数据对象
 * @param {boolean} [options.defaultValue] - 默认返回值
 *   - 当 condition 为 undefined 时返回此值
 *   - 当条件函数执行出错时返回此值
 *
 * @returns {boolean} 条件判断结果
 *
 * @throws 不会抛出错误，所有异常都会被捕获并返回 defaultValue
 *
 * @example
 * ```typescript
 * // 1. 布尔值条件
 * const result1 = checkCondition({
 *   condition: true,
 *   defaultValue: false
 * });
 * // result1: true
 *
 * // 2. 函数条件（带数据上下文）
 * const formData = { username: 'admin', age: 25 };
 * const result2 = checkCondition({
 *   condition: (data) => data.username === 'admin',
 *   data: formData
 * });
 * // result2: true
 *
 * // 3. 未定义条件，使用默认值
 * const result3 = checkCondition({
 *   condition: undefined
 * });
 * // result3: false（使用默认值 false）
 *
 * // 4. 明确要求显示的情况
 * const result4 = checkCondition({
 *   condition: undefined,
 *   defaultValue: true  // 显式设置为 true
 * });
 * // result4: true
 * ```
 */
export function checkCondition<T = unknown>(
  options: CheckConditionOptions<T>,
) {
  const { condition, data, defaultValue = false } = options

  if (condition === undefined)
    return defaultValue

  try {
    return typeof condition === 'function' ? condition(data!) : condition
  }
  catch (error) {
    console.warn('checkCondition function execution error:', error)
    return defaultValue
  }
}
