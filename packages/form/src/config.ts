/* eslint-disable ts/no-explicit-any */
import type { FormProps } from 'element-plus'
import type { ActionConfig, ActionConfigButtonItem, FormItem } from './types'
import { Refresh, Search } from '@element-plus/icons-vue'
import { ElAutocomplete, ElCascader, ElCheckboxGroup, ElColorPicker, ElColorPickerPanel, ElDatePicker, ElDatePickerPanel, ElInput, ElInputNumber, ElInputTag, ElMention, ElRadioGroup, ElRate, ElSelect, ElSelectV2, ElSlider, ElSwitch, ElTimePicker, ElTimeSelect, ElTransfer, ElTreeSelect } from 'element-plus'

/**
 * 表单组件配置常量
 */

/**
 * 需要从 FormItem 中排除的自定义属性键名
 * 这些属性不会传递给 el-form-item 组件
 */
export const FORM_ITEM_EXCLUDED_KEYS = ['comp', 'compAttrs', 'vIf', 'vShow'] as const

/**
 * 拓展的组件映射
 */
const EXPAND_COMP_MAP = {

} as const

/**
 * Element Plus 组件映射
 *
 * 使用显式类型注解避免类型推断超出编译器序列化限制
 */
const EL_COMP_MAP: Record<string, any> = {
  'autocomplete': ElAutocomplete,
  'cascader': ElCascader,
  'checkbox': ElCheckboxGroup,
  'color-picker-panel': ElColorPickerPanel,
  'color-picker': ElColorPicker,
  'date-picker-panel': ElDatePickerPanel,
  'date-picker': ElDatePicker,
  'input': ElInput,
  'input-number': ElInputNumber,
  'input-tag': ElInputTag,
  'mention': ElMention,
  'radio': ElRadioGroup,
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
 */
export const FORM_ITEM_COMP_MAP: Record<string, any> = {
  ...EL_COMP_MAP,
  ...EXPAND_COMP_MAP,
} as const

/**
 * 动态组件默认配置
 */
export const COMPONENT_DEFAULT_CONFIG = {
  /**
   * 获取组件默认属性
   */
  getDefaults(formItem: FormItem) {
    const { comp, compAttrs = {} } = formItem

    // 组件类型
    const compType = this.getComponentType(comp)

    // 组件默认属性
    const compDefaults = this.buildComponentAttrs(formItem, compType)

    return {
      ...compDefaults,
      ...compAttrs, // 用户配置最后合并，优先级最高
    }
  },

  /**
   * 判断组件类型
   */
  getComponentType(comp: string) {
    // 输入类组件
    const inputComponents: readonly string[] = ['autocomplete', 'input', 'input-number', 'input-tag', 'mention']

    // 选择类组件
    const selectComponents: readonly string[] = ['cascader', 'select', 'select-v2', 'tree-select']

    // 日期类组件
    const pickerComponents: readonly string[] = ['date-picker', 'time-select', 'time-picker']

    if (inputComponents.includes(comp))
      return 'input'
    if (selectComponents.includes(comp))
      return 'select'
    if (pickerComponents.includes(comp))
      return 'picker'

    return 'other'
  },

  /**
   * 动态生成 placeholder
   */
  generatePlaceholder(formItem: FormItem, type: string) {
    const { label, comp } = formItem as FormItem & { label?: string }

    const _label = label ? `${label}` : ''

    if (type === 'input') {
      if (comp === 'input-number')
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
  buildComponentAttrs(formItem: FormItem, type: string) {
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

/**
 * 表单属性默认配置
 */
export const DEFAULT_FORM_ATTRS = {
  showMessage: true,
  scrollToError: true,
  scrollIntoViewOptions: {
    behavior: 'smooth', // 平滑滚动
    block: 'center', // 垂直居中，让错误项在视窗中间
    inline: 'nearest', // 水平方向保持最近位置
  },
} as unknown as Partial<FormProps>

/**
 * 表单动作按钮默认配置
 */
export const DEFAULT_FORM_ACTION_BUTTONS: Record<string, Partial<Omit<ActionConfigButtonItem, 'eventName'>>> = {
  search: { label: '搜索', icon: Search, type: 'primary' } as Partial<Omit<ActionConfigButtonItem, 'eventName'>>,
  reset: { label: '重置', icon: Refresh } as Partial<Omit<ActionConfigButtonItem, 'eventName'>>,
  submit: { label: '确认', type: 'primary' } as Partial<Omit<ActionConfigButtonItem, 'eventName'>>,
  cancel: { label: '取消' } as Partial<Omit<ActionConfigButtonItem, 'eventName'>>,
}

/**
 * 表单动作默认配置
 */
export const ACTION_DEFAULT_CONFIG = {
  getDefaults(inline?: boolean, actionConfig?: ActionConfig) {
    const actionDefaults = this.buildActionAttrs(inline)
    return {
      ...actionDefaults,
      ...actionConfig,

    }
  },
  generateActionButtons(inline?: boolean) {
    return inline ? ['search', 'reset'] : ['submit', 'cancel']
  },
  buildActionAttrs(inline?: boolean) {
    return {
      buttons: this.generateActionButtons(inline),
      vIf: inline,
      vShow: true,
    }
  },
}
