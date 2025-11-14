/* eslint-disable ts/no-explicit-any */
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
  const result: Record<string, any> = {}
  for (const dep of processedDeps) {
    result[dep] = formData[dep]
  }
  return result
}
