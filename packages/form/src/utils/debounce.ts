/* eslint-disable ts/no-explicit-any */
/**
 * @file debounce.ts
 * @description 防抖工具函数
 */

/**
 * 防抖函数
 *
 * @param fn - 要防抖的函数
 * @param delay - 延迟时间（毫秒），默认 100ms
 * @returns 防抖后的函数
 *
 * @example
 * ```typescript
 * const debouncedFn = debounce(() => {
 *   console.log('执行防抖函数')
 * }, 300)
 *
 * // 频繁调用时，只会在最后一次调用后 300ms 执行
 * debouncedFn()
 * debouncedFn()
 * debouncedFn() // 只有这一次会执行
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 100,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (this: unknown, ...args: Parameters<T>) {
    if (timer)
      clearTimeout(timer)

    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}
