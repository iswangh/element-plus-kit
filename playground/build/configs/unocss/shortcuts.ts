/**
 * @file UnoCSS 自定义快捷方式配置
 *
 * 定义了 UnoCSS 的自定义快捷方式，包括常用布局、Flex 布局等组合类名。
 * 这些快捷方式可以简化常用的 CSS 类名组合，提高开发效率。
 *
 * @see {@link https://unocss.dev/config/shortcuts UnoCSS 快捷方式配置文档}
 */

import type { UserShortcuts } from 'unocss'

export const flexShortcuts: UserShortcuts = [
  // 基础布局
  ['flex-row', 'flex flex-row'],
  ['flex-col', 'flex flex-col'],

  // 常用组合
  ['flex-center', 'flex justify-center items-center'],
  ['flex-between-center', 'flex justify-between items-center'],
  ['flex-around-center', 'flex justify-around items-center'],
  ['flex-evenly-center', 'flex justify-evenly items-center'],

  ['flex-start-center', 'flex justify-start items-center'],
  ['flex-end-center', 'flex justify-end items-center'],

  ['flex-center-start', 'flex justify-center items-start'],
  ['flex-center-end', 'flex justify-center items-end'],
]

export const layoutShortcuts: UserShortcuts = [
  // 传统居中方式：使用 transform
  ['absolute-center', 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'],
  // 现代居中方式：使用 inset 和 auto margin
  ['absolute-center-inset', 'absolute inset-0 m-auto'],
]

export const containerShortcuts: UserShortcuts = [
  // 容器样式
  ['container-center', 'max-w-1200 mx-auto px-5'],
  ['card', 'bg-white rounded shadow p-4'],
  ['card-hover', 'card transition-shadow hover:shadow-lg'],
]

export const exampleShortcuts: UserShortcuts = [
  // 示例组件容器
  ['example-container', 'mb-5'],
  ['example-title', 'text-xl font-bold text-gray-800'],
  ['example-description', 'text-sm text-gray-600 leading-relaxed'],
  ['example-code', 'bg-gray-50 px-2 py-1 rounded text-xs font-mono text-gray-700'],
  ['example-form-data', 'mt-6'],
  ['example-form-data-title', 'text-base font-semibold text-gray-700'],
  ['example-form-data-content', 'text-xs font-mono text-gray-600 whitespace-pre-wrap break-words'],
  ['example-external-state', 'mb-4'],
  ['example-test-tips', 'mb-4'],
  ['example-test-tips-title', 'text-base font-semibold text-yellow-700'],
  ['example-test-tips-list', 'm-0 pl-5'],
  ['example-test-tips-item', 'mb-2 leading-relaxed'],
]

export const unoShortcuts: UserShortcuts = [
  ['full', 'w-full h-full'],
  ...flexShortcuts,
  ...layoutShortcuts,
  ...containerShortcuts,
  ...exampleShortcuts,
]
