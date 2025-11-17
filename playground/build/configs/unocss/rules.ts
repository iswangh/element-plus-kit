/**
 * @file UnoCSS 自定义规则配置
 *
 * 定义了 UnoCSS 的自定义规则，包括 margin、padding、文本截断等常用样式规则。
 * 这些规则扩展了 UnoCSS 的默认功能，提供更灵活的样式定制能力。
 *
 * @see {@link https://unocss.dev/config/rules UnoCSS 规则配置文档}
 */

import type { Rule } from 'unocss'

export const marginRules: Rule[] = [
  // 基础 margin
  [/^m-(\d+)$/, ([, d]) => ({ margin: `${Number(d) * 0.25}rem` })],

  // 单独控制
  [/^mt-(\d+)$/, ([, d]) => ({ 'margin-top': `${Number(d) * 0.25}rem` })],
  [/^mr-(\d+)$/, ([, d]) => ({ 'margin-right': `${Number(d) * 0.25}rem` })],
  [/^mb-(\d+)$/, ([, d]) => ({ 'margin-bottom': `${Number(d) * 0.25}rem` })],
  [/^ml-(\d+)$/, ([, d]) => ({ 'margin-left': `${Number(d) * 0.25}rem` })],

  // 水平和垂直方向简写
  [/^mx-(\d+)$/, ([, d]) => ({
    'margin-left': `${Number(d) * 0.25}rem`,
    'margin-right': `${Number(d) * 0.25}rem`,
  })],
  [/^my-(\d+)$/, ([, d]) => ({
    'margin-top': `${Number(d) * 0.25}rem`,
    'margin-bottom': `${Number(d) * 0.25}rem`,
  })],

  // 复合值规则 (2个值: vertical horizontal)
  [/^m-(\d+)-(\d+)$/, ([, d1, d2]) => ({
    margin: `${Number(d1) * 0.25}rem ${Number(d2) * 0.25}rem`,
  })],

  // 复合值规则 (3个值: top horizontal bottom)
  [/^m-(\d+)-(\d+)-(\d+)$/, ([, d1, d2, d3]) => ({
    margin: `${Number(d1) * 0.25}rem ${Number(d2) * 0.25}rem ${Number(d3) * 0.25}rem`,
  })],

  // 复合值规则 (4个值: top right bottom left)
  [/^m-(\d+)-(\d+)-(\d+)-(\d+)$/, ([, d1, d2, d3, d4]) => ({
    margin: `${Number(d1) * 0.25}rem ${Number(d2) * 0.25}rem ${Number(d3) * 0.25}rem ${Number(d4) * 0.25}rem`,
  })],
]

export const paddingRules: Rule[] = [
  // 基础 padding
  [/^p-(\d+)$/, ([, d]) => ({ padding: `${Number(d) * 0.25}rem` })],

  // 单独控制
  [/^pt-(\d+)$/, ([, d]) => ({ 'padding-top': `${Number(d) * 0.25}rem` })],
  [/^pr-(\d+)$/, ([, d]) => ({ 'padding-right': `${Number(d) * 0.25}rem` })],
  [/^pb-(\d+)$/, ([, d]) => ({ 'padding-bottom': `${Number(d) * 0.25}rem` })],
  [/^pl-(\d+)$/, ([, d]) => ({ 'padding-left': `${Number(d) * 0.25}rem` })],

  // 水平和垂直方向简写
  [/^px-(\d+)$/, ([, d]) => ({
    'padding-left': `${Number(d) * 0.25}rem`,
    'padding-right': `${Number(d) * 0.25}rem`,
  })],
  [/^py-(\d+)$/, ([, d]) => ({
    'padding-top': `${Number(d) * 0.25}rem`,
    'padding-bottom': `${Number(d) * 0.25}rem`,
  })],

  // 复合值规则 (2个值: vertical horizontal)
  [/^p-(\d+)-(\d+)$/, ([, d1, d2]) => ({
    padding: `${Number(d1) * 0.25}rem ${Number(d2) * 0.25}rem`,
  })],

  // 复合值规则 (3个值: top horizontal bottom)
  [/^p-(\d+)-(\d+)-(\d+)$/, ([, d1, d2, d3]) => ({
    padding: `${Number(d1) * 0.25}rem ${Number(d2) * 0.25}rem ${Number(d3) * 0.25}rem`,
  })],

  // 复合值规则 (4个值: top right bottom left)
  [/^p-(\d+)-(\d+)-(\d+)-(\d+)$/, ([, d1, d2, d3, d4]) => ({
    padding: `${Number(d1) * 0.25}rem ${Number(d2) * 0.25}rem ${Number(d3) * 0.25}rem ${Number(d4) * 0.25}rem`,
  })],
]

export const textTruncateRules: Rule[] = [
  // 单行截断（UnoCSS 原生已有，此处仅作为对比说明）
  // ['truncate', { overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }],

  // 多行截断：truncate-2 → 2行，truncate-3 → 3行...
  [/^truncate-(\d+)$/, ([, lines]) => ({
    'overflow': 'hidden',
    'display': '-webkit-box',
    'lineClamp': lines,
    '-webkit-line-clamp': lines,
    '-webkit-box-orient': 'vertical',
    'wordWrap': 'break-word', // 允许长单词或URL换行
    'wordBreak': 'break-all', // 强制断行
    'padding-bottom': '1px', /* 解决像素偏差 */
    'transform': 'translateZ(0)', /* 触发 GPU 渲染，减少渲染偏差 */
  })],
]

export const unoRules = [
  ...marginRules,
  ...paddingRules,
  ...textTruncateRules,
]
