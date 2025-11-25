/* eslint-disable ts/no-explicit-any */
import type { OptionsConfig } from '../types'

/**
 * 处理依赖列表：排除自身并去重
 * @param deps 依赖字段列表
 * @param currentProp 当前字段名，用于排除自己
 */
export function processDeps(deps: string[], currentProp?: string): string[] {
  if (!deps || deps.length === 0)
    return []

  // 去重并排除自身
  const uniqueDeps = Array.from(new Set(deps))
  return currentProp ? uniqueDeps.filter(dep => dep !== currentProp) : uniqueDeps
}

/**
 * 获取依赖值
 * @param deps 依赖字段列表
 * @param formData 表单数据（外部依赖通过闭包访问）
 * @param currentProp 当前字段名，用于排除自己
 */
export function getDepsValues(deps: string[], formData: Record<string, any>, currentProp?: string): Record<string, any> {
  const processedDeps = processDeps(deps, currentProp)
  return Object.fromEntries(processedDeps.map(dep => [dep, formData[dep]]))
}

/**
 * 检查是否为对象模式的 options 配置
 * @param options - 待检查的选项配置
 * @returns 是否为对象模式配置
 */
export function isOptionsConfig(options: any): options is OptionsConfig {
  return options && typeof options === 'object' && typeof options.loader === 'function'
}
