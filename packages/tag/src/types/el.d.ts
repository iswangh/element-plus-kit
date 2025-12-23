import type { ElCheckTag, ElSpace, ElTag } from 'element-plus'

/**
 * Element Plus Tag Props
 *
 * @see {@link https://element-plus.org/zh-CN/component/tag.html#tag-attributes Element Plus Tag Attributes}
 */
export type ElTagProps = InstanceType<typeof ElTag>['$props']

/**
 * Element Plus CheckTag Props
 *
 * @see {@link https://element-plus.org/zh-CN/component/tag.html#check-tag-attributes Element Plus CheckTag Attributes}
 */
export type ElCheckTagProps = InstanceType<typeof ElCheckTag>['$props']

/**
 * Element Plus Space Props
 *
 * @see {@link https://element-plus.org/zh-CN/component/space.html#space-attributes Element Plus Space Attributes}
 */
export type ElSpaceProps = InstanceType<typeof ElSpace>['$props']
