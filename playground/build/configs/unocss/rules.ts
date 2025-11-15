/**
 * @file UnoCSS 自定义规则配置
 *
 * 定义了 UnoCSS 的自定义规则，包括文本截断等常用样式规则。
 * 注意：margin 和 padding 规则已由 presetWind4 提供，无需重复定义。
 *
 * @see {@link https://unocss.dev/config/rules UnoCSS 规则配置文档}
 */

import type { Rule } from 'unocss'

export const textTruncateRules: Rule[] = [
  // 多行截断：truncate-2 → 2行，truncate-3 → 3行...
  [/^truncate-(\d+)$/, ([, lines]) => ({
    'overflow': 'hidden',
    'display': '-webkit-box',
    'lineClamp': lines,
    '-webkit-line-clamp': lines,
    '-webkit-box-orient': 'vertical',
    'wordWrap': 'break-word',
    'wordBreak': 'break-all',
    'padding-bottom': '1px',
    'transform': 'translateZ(0)',
  })],
]

export const unoRules: Rule[] = [
  ...textTruncateRules,
]
