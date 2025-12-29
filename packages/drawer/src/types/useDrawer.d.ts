import type { Component, Ref, VNode, WritableComputedRef } from 'vue'
import type { ElDrawerProps, ElLoadingOptions } from './el'

/**
 * Drawer 选项
 *
 * 注意：
 * - 继承 ElDrawerProps，直接透传所有 el-drawer 的属性、事件、插槽
 * - 不重复定义 el-drawer 已有的属性、事件、插槽
 * - 只添加我们自己的扩展属性
 */
export interface DrawerOptions extends /* @vue-ignore */ Partial<ElDrawerProps> {
  /**
   * 内容（支持字符串、VNode、组件、渲染函数）
   * 渲染函数通过闭包访问（从 drawer.use() 解构的变量），不接收 instance 参数
   * 渲染函数可以返回 string、Component 或 VNode，系统会自动处理
   */
  content?: string | VNode | Component | (() => string | Component | VNode)

  /**
   * el-loading 的属性配置
   * 用于控制 loading 遮罩层的显示效果
   * 常用属性：text（加载文本）、spinner（自定义加载图标）、background（遮罩背景色）等
   * 不设置默认值，保持与 el-loading 原生行为一致
   */
  loadingProps?: Partial<ElLoadingOptions>

  /**
   * 插槽（el-drawer 的插槽，直接透传）
   * 渲染函数通过闭包访问（从 drawer.use() 解构的变量），不接收 instance 参数
   */
  slots?: {
    default?: () => VNode
    header?: () => VNode
    footer?: () => VNode
    title?: () => VNode
  }

  /**
   * 业务操作钩子（可选，提供快捷方式）
   * 如果用户需要自定义按钮，可以不使用这些钩子，自己定义按钮和事件处理
   */
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void

  /**
   * Loading 状态（可选，如果传入则使用用户的，否则使用内部的）
   * 抽屉 loading 只作用在抽屉内容区域，不是整个抽屉
   */
  loading?: Ref<boolean>
  buttonLoadings?: Ref<Record<string, boolean>>
}

/**
 * Drawer 实例
 */
export interface DrawerInstance {
  /**
   * 唯一标识符
   */
  id: string

  /**
   * v-model 绑定的响应式值（唯一控制方式）
   * 直接设置 modelValue.value = true/false 即可控制抽屉
   * 使用 modelValue 命名，符合 Vue 3 v-model 标准和 Element Plus 规范
   */
  modelValue: Ref<boolean>

  /**
   * 抽屉加载状态（自动显示遮罩层）
   */
  loading: Ref<boolean>

  /**
   * 统一的按钮 loading 管理（响应式）
   * 键名对应按钮的 eventName（如 'confirm'、'cancel'、'draft' 等）
   * 直接使用 buttonLoadings.value.buttonName = true/false 即可
   */
  buttonLoadings: Ref<Record<string, boolean>>

  /**
   * 确认按钮 loading（快捷方式，计算属性）
   * 等同于 buttonLoadings.value.confirm
   * 可以直接设置 confirmLoading.value = true/false
   */
  confirmLoading: WritableComputedRef<boolean>

  /**
   * 取消按钮 loading（快捷方式，计算属性）
   * 等同于 buttonLoadings.value.cancel
   * 可以直接设置 cancelLoading.value = true/false
   */
  cancelLoading: WritableComputedRef<boolean>

  // 注意：不提供 open/close/toggle 方法，保持 API 简洁
  // 只使用 modelValue v-model 控制，通过 watch 自动触发生命周期钩子
}

/**
 * useDrawer 全局配置（页面级别）
 */
export interface DrawerGlobalConfig extends Partial<ElDrawerProps> {
  /**
   * el-loading 的属性配置（全局配置）
   * 在 drawer.use() 时会继承，实例配置会覆盖全局配置
   */
  loadingProps?: Partial<ElLoadingOptions>
}

/**
 * useDrawer 返回值
 */
export interface UseDrawerReturn {
  /**
   * 创建抽屉实例（组合式函数）
   * @param options - 抽屉选项，会继承 useDrawer() 传入的全局配置
   */
  use: (options: DrawerOptions) => DrawerInstance
}
