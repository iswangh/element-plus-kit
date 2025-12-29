/**
 * 生成唯一 ID
 *
 * @param prefix - ID 前缀，默认为 'id'
 * @returns 唯一 ID 字符串
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
