/**
 * 生成唯一 ID
 *
 * @returns 唯一 ID 字符串
 */
export function generateId(): string {
  return `dialog-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
