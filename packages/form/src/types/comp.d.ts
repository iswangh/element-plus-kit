import type { ElAutocomplete, ElCascader, ElCheckboxGroup, ElColorPicker, ElColorPickerPanel, ElDatePicker, ElDatePickerPanel, ElInput, ElInputNumber, ElInputTag, ElMention, ElRadioGroup, ElRate, ElSelect, ElSelectV2, ElSlider, ElSwitch, ElTimePicker, ElTimeSelect, ElTransfer, ElTreeSelect } from 'element-plus'
import type { EXPAND_COMP_MAP } from '../config'

/**
 * Element Plus 组件映射类型
 *
 * 手动定义类型映射，避免从 EL_COMP_MAP 使用 typeof 时类型推断超出编译器序列化限制
 * 与 comp.ts 中的 EL_COMP_MAP 保持同步
 */
interface ElCompMap {
  readonly 'autocomplete': typeof ElAutocomplete
  readonly 'cascader': typeof ElCascader
  readonly 'checkbox': typeof ElCheckboxGroup
  readonly 'color-picker-panel': typeof ElColorPickerPanel
  readonly 'color-picker': typeof ElColorPicker
  readonly 'date-picker-panel': typeof ElDatePickerPanel
  readonly 'date-picker': typeof ElDatePicker
  readonly 'input': typeof ElInput
  readonly 'input-number': typeof ElInputNumber
  readonly 'input-tag': typeof ElInputTag
  readonly 'mention': typeof ElMention
  readonly 'radio': typeof ElRadioGroup
  readonly 'rate': typeof ElRate
  readonly 'select': typeof ElSelect
  readonly 'select-v2': typeof ElSelectV2
  readonly 'slider': typeof ElSlider
  readonly 'switch': typeof ElSwitch
  readonly 'time-picker': typeof ElTimePicker
  readonly 'time-select': typeof ElTimeSelect
  readonly 'transfer': typeof ElTransfer
  readonly 'tree-select': typeof ElTreeSelect
}

/**
 * 表单组件配置映射类型
 *
 * 合并 Element Plus 组件映射和扩展组件映射的类型
 * - ElCompMap: 手动定义，避免类型推断超出限制
 * - typeof EXPAND_COMP_MAP: 从运行时值提取类型（简单映射，不会超出限制）
 *
 * 注意：不使用 typeof FORM_ITEM_COMP_MAP，因为 FORM_ITEM_COMP_MAP 使用了
 * Record<string, any> 避免类型推断超出编译器序列化限制
 */
export type FormCompConfig = ElCompMap & typeof EXPAND_COMP_MAP

/**
 * 支持的表单组件枚举
 *
 * 显式定义所有可用的组件键名，确保类型提示正常工作
 * 注意：由于 FORM_ITEM_COMP_MAP 使用了 Record<string, any> 避免类型推断超出限制，
 * 我们需要显式定义键名类型，而不是从 typeof FORM_ITEM_COMP_MAP 中提取
 */
export type FormItemComp
  = | 'autocomplete'
    | 'cascader'
    | 'checkbox'
    | 'color-picker'
    | 'color-picker-panel'
    | 'date-picker'
    | 'date-picker-panel'
    | 'input'
    | 'input-number'
    | 'input-tag'
    | 'mention'
    | 'radio'
    | 'rate'
    | 'select'
    | 'select-v2'
    | 'slider'
    | 'switch'
    | 'time-picker'
    | 'time-select'
    | 'transfer'
    | 'tree-select'
    | 'custom'

/**
 * 根据组件类型获取组件实例类型
 * @template T 组件类型
 */
export type FormItemCompInstance<T extends FormItemComp> = InstanceType<FormCompConfig[T]>

/**
 * 根据组件类型获取组件完整 Props 类型（包含事件处理器）
 * @template T 组件类型
 */
type FormItemCompPropsFull<T extends FormItemComp> = FormItemCompInstance<T>['$props']

/**
 * 根据组件类型推断对应的 Props 类型（排除事件处理器）
 * @template T - 组件类型
 */
export type FormItemCompProps<T extends FormItemComp = FormItemComp>
  = Omit<FormItemCompPropsFull<T>, `on${string}`>
