import type { ElCheckTagProps } from './el'
import type { TagOption } from './tag'

/**
 * CheckTag 选项类型
 *
 * 扩展 TagOption，添加 CheckTag 特有的属性
 * tagProps 覆盖父类的 ElTagProps，使用 ElCheckTagProps
 */
export interface CheckTagOption extends TagOption {
  /** 单个选项是否禁用 */
  disabled?: boolean
  /** 标签属性（传递给 ElCheckTag 的属性，覆盖父类的 tagProps） */
  tagProps?: ElCheckTagProps
}
