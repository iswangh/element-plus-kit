/**
 * 生成方法与别名的映射数组
 *
 * @param {string[]} methods - 需要导入的方法名数组
 * @param {string} [aliasPrefix] - 别名前缀（默认：''）
 * @returns {[string, string][]} 格式为 [[方法名, 别名], ...] 的二维数组
 *
 * @example
 * // 基础用法（默认无前缀）
 * createImportMappings(['get', 'set']);
 * // 返回 [['get', 'get'], ['set', 'set']]
 *
 * @example
 * // 自定义前缀
 * createImportMappings(['debounce', 'throttle'], 'lodash_');
 * // 返回 [['debounce', 'lodash_debounce'], ['throttle', 'lodash_throttle']]
 */
export function createImportMappings(
  methods: string[],
  aliasPrefix = '',
): [string, string][] {
  return methods.map(method => [method, `${aliasPrefix}${method}`])
}
