/**
 * @file lodash 方法配置
 *
 * 配置项目中需要按需导入的 lodash-es 方法列表，用于自动导入插件。
 * 通过 unplugin-auto-import 插件自动导入这些方法，无需手动 import。
 *
 * @see {@link https://www.lodashjs.com/} Lodash 中文文档
 * @see {@link https://github.com/lodash/lodash} Lodash GitHub 仓库
 * @see {@link https://lodash.com/docs/} Lodash 英文文档
 */

import { createImportMappings } from '../utils'

/**
 * 需要按需导入的lodash方法
 */
const lodashMethods = [
  'get', // 获取对象属性值
  'set', // 设置对象属性值
  'has', // 检查对象是否包含属性
  'cloneDeep', // 深拷贝对象
  'omit', // 排除指定属性
  'omitBy', // 根据条件排除属性
  'pick', // 选择指定属性
  'isEmpty', // 检查值是否为空
  'debounce', // 防抖函数
  'throttle', // 节流函数
  'once', // 只执行一次的函数
  'isUndefined', // 检查是否为 undefined
  'isString', // 检查是否为字符串
  'isNumber', // 检查是否为数字
  'isArray', // 检查是否为数组
  'isObject', // 检查是否为对象
  'isFunction', // 检查是否为函数
  'isEqual', // 深度比较两个值是否相等
  'map', // 数组映射
  'filter', // 数组过滤
  'find', // 查找数组元素
  'orderBy', // 数组排序
]

/**
 * 生成lodash方法与别名的映射数组
 */
export const lodashImports = createImportMappings(lodashMethods, '_')
