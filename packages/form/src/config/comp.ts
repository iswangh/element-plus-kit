/* eslint-disable ts/no-explicit-any */
import type { FormItem } from '../types'
import { WCheckTag } from '@iswangh/element-plus-kit-tag'
import { ElAutocomplete, ElCascader, ElCheckbox, ElCheckboxGroup, ElColorPicker, ElColorPickerPanel, ElDatePicker, ElDatePickerPanel, ElInput, ElInputNumber, ElInputTag, ElMention, ElRadioGroup, ElRate, ElSelect, ElSelectV2, ElSlider, ElSwitch, ElTimePicker, ElTimeSelect, ElTransfer, ElTreeSelect } from 'element-plus'

/**
 * 拓展的组件映射
 * 导出以便在类型文件中使用 typeof 提取类型
 */
export const EXPAND_COMP_MAP: Record<string, any> = {
  'custom': 'div',
  'w-check-tag': WCheckTag,
} as const

/**
 * Element Plus 组件映射
 *
 * 使用显式类型注解避免类型推断超出编译器序列化限制
 */
const EL_COMP_MAP = {
  'autocomplete': ElAutocomplete,
  'cascader': ElCascader,
  'checkbox': ElCheckbox,
  'checkbox-group': ElCheckboxGroup,
  'color-picker-panel': ElColorPickerPanel,
  'color-picker': ElColorPicker,
  'date-picker-panel': ElDatePickerPanel,
  'date-picker': ElDatePicker,
  'input': ElInput,
  'input-number': ElInputNumber,
  'input-tag': ElInputTag,
  'mention': ElMention,
  'radio-group': ElRadioGroup,
  'rate': ElRate,
  'select': ElSelect,
  'select-v2': ElSelectV2,
  'slider': ElSlider,
  'switch': ElSwitch,
  'time-picker': ElTimePicker,
  'time-select': ElTimeSelect,
  'transfer': ElTransfer,
  'tree-select': ElTreeSelect,
} as const

/**
 * 表单组件类型映射配置
 *
 * 使用显式类型注解避免类型推断超出编译器序列化限制
 * 类型提示通过 keyof 提取键名，不依赖完整的类型定义
 *
 * 注意：虽然这里使用 Record<string, any>，但实际的类型定义
 * 通过类型工具在 comp.d.ts 中从 EL_COMP_MAP 和 EXPAND_COMP_MAP 提取
 */
export const FORM_ITEM_COMP_MAP = { ...EL_COMP_MAP, ...EXPAND_COMP_MAP } as unknown as Record<string, any>

/**
 * 动态组件默认配置
 */
export const COMP_DEFAULT_CONFIG = {
  /**
   * 获取组件默认属性
   */
  getDefaults(formItem: FormItem) {
    const { compType, compProps = {} } = formItem

    // 组件类型
    const compTypeCategory = this.getCompType(compType)

    // 组件默认属性
    const compDefaults = this.buildCompProps(formItem, compTypeCategory)

    return {
      ...compDefaults,
      ...compProps, // 用户配置最后合并，优先级最高
    }
  },

  /**
   * 判断组件类型
   */
  getCompType(comp: string) {
    // 输入类组件
    const inputComps: readonly string[] = ['autocomplete', 'input', 'input-number', 'input-tag', 'mention']

    // 选择类组件
    const selectComps: readonly string[] = ['cascader', 'select', 'select-v2', 'tree-select', 'w-check-tag']

    // 日期类组件
    const pickerComps: readonly string[] = ['date-picker', 'time-select', 'time-picker']

    if (inputComps.includes(comp))
      return 'input'
    if (selectComps.includes(comp))
      return 'select'
    if (pickerComps.includes(comp))
      return 'picker'

    return 'other'
  },

  /**
   * 动态生成 placeholder
   */
  generatePlaceholder(formItem: FormItem, type: string) {
    const { label, compType } = formItem as FormItem & { label?: string }

    const _label = label ? `${label}` : ''

    if (type === 'input') {
      if (compType === 'input-number')
        return '请输入'

      return `请输入${_label}`
    }

    if ((['select', 'picker'] as readonly string[]).includes(type))
      return `请选择${_label}`

    return ''
  },

  /**
   * 构建组件属性
   */
  buildCompProps(formItem: FormItem, type: string) {
    const defaults: Record<string, any> = {}
    if ((['input', 'select', 'picker'] as readonly string[]).includes(type)) {
      defaults.placeholder = this.generatePlaceholder(formItem, type)
      defaults.clearable = true
    }
    if ((['select'] as readonly string[]).includes(type)) {
      defaults.filterable = true
    }

    return defaults
  },
}
