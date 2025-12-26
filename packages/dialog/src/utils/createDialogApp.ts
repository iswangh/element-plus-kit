import type { App, VNode } from 'vue'
import type { DialogInstance, DialogOptions } from '../types'
import { ElDialog, ElLoading, ElScrollbar } from 'element-plus'
import { computed, createApp, h, nextTick, watch } from 'vue'
import { renderContent } from './renderContent'

/**
 * 创建弹窗内容区域
 *
 * @param options - Dialog 选项
 * @param instance - Dialog 实例
 * @returns VNode
 */
function createDialogContent(options: DialogOptions, instance: DialogInstance): VNode | null {
  // 如果有 slots.default，优先使用，否则使用 content 属性
  const content = options.slots?.default?.() ?? renderContent(options.content, instance)

  if (!content)
    return null

  // contentWrapper 在外层（用于 loading），scrollbar 在内层
  // 这样 loading 时整个区域（包括滚动条）都被遮罩，禁用所有交互
  return h('div', {
    class: 'dialog-content-wrapper',
    style: { position: 'relative', minHeight: '50px' },
  }, [
    h(ElScrollbar, {
      ...(options.scrollbarProps || {}),
    }, {
      default: () => content,
    }),
  ])
}

/**
 * 创建弹窗应用实例
 *
 * @param options - Dialog 选项
 * @param instance - Dialog 实例
 * @param cleanup - 清理回调函数（仅在 destroy-on-close 为 true 时调用）
 * @returns Vue 应用实例
 */
export function createDialogApp(options: DialogOptions, instance: DialogInstance, cleanup?: () => void): App {
  // 提取用户传入的 onClosed 和 destroy-on-close（在 setup 外部提取，避免每次渲染都执行）
  const userOnClosed = 'onClosed' in options ? options.onClosed : undefined
  const destroyOnClose = 'destroyOnClose' in options ? options.destroyOnClose ?? false : false

  // 提取 el-dialog 的属性（排除我们自己的扩展属性，在 setup 外部提取，避免每次渲染都执行）
  const {
    content: _content,
    scrollbarProps: _scrollbarProps,
    loadingProps: _loadingProps,
    slots: _slots,
    onConfirm: _onConfirm,
    onCancel: _onCancel,
    loading: _loading,
    buttonLoadings: _buttonLoadings,
    zIndex: userZIndex,
    onClosed: _onClosed,
    ...elDialogProps
  } = options

  // 合并 loading 配置（使用用户配置，不设置默认值，保持与 el-loading 原生行为一致）
  // 注意：target 会在 showLoading 中动态设置，不在这里设置
  const loadingConfig = options.loadingProps || {}

  // 创建 Vue 应用
  const app = createApp({
    setup() {
      // Loading 实例引用（用于管理 loading 状态）
      // 注意：el-loading 以服务方式调用时，对同一个 target 可能是单例的
      // 如果在前一个 loading 关闭前再次调用，可能返回现有实例而非创建新实例
      let loadingInstance: ReturnType<typeof ElLoading.service> | null = null

      // 隐藏 loading 的辅助函数
      function hideLoading() {
        if (loadingInstance) {
          loadingInstance.close()
          loadingInstance = null
        }
      }

      // 显示 loading 的辅助函数
      function showLoading() {
        // 如果已有 loading 实例，先关闭（避免重复创建）
        // 注意：即使 el-loading 是单例的，我们也需要先关闭，确保状态正确
        hideLoading()

        // 等待 DOM 渲染完成后再查找元素并显示 loading
        nextTick(() => {
          const contentWrapper = document.querySelector(`#${instance.id} .dialog-content-wrapper`)
          if (!contentWrapper)
            return

          // 创建新的 loading 实例（使用用户配置的 loadingProps）
          // 如果 el-loading 对同一个 target 是单例的，这里会返回现有实例或创建新实例
          loadingInstance = ElLoading.service({ target: contentWrapper as HTMLElement, ...loadingConfig })
        })
      }

      // 监听 loading 状态和弹窗打开状态，动态显示/隐藏 loading
      watch([() => instance.loading.value, () => instance.modelValue.value], ([loading, isOpen]) => {
        if (!isOpen)
          return hideLoading()

        // 如果弹窗已打开且需要显示 loading，调用 showLoading
        // showLoading 内部会使用 nextTick 等待 DOM 渲染完成
        loading ? showLoading() : hideLoading()
      }, { immediate: true })

      // z-index 计算属性（确保响应式更新）
      // 优先级：用户设置的 zIndex > DialogStack 管理的 zIndex > undefined（不传递，让 el-dialog 使用默认行为）
      const zIndex = computed(() => userZIndex ?? instance.zIndex.value)

      // 处理关闭事件
      function onClose() {
        instance.modelValue.value = false
      }

      // 处理 closed 事件（在弹窗完全关闭后触发）
      async function onClosed() {
        try {
          // 先调用用户传入的 onClosed（如果存在）
          if (userOnClosed)
            await Promise.resolve(userOnClosed())
        }
        finally {
          // 只有当 destroy-on-close 为 true 时，才执行清理回调
          // 这样保持与 el-dialog 原生行为一致
          // 使用 finally 确保即使 userOnClosed 抛出错误，cleanup 也会执行
          if (destroyOnClose && cleanup)
            cleanup()
        }
      }

      // 构建插槽（在 setup 中构建，避免每次渲染都重新创建）
      const userSlots = options.slots
      const slots: Record<string, () => VNode | null> = {
        default: () => createDialogContent(options, instance),
        ...(userSlots?.header && { header: () => userSlots.header!() }),
        ...(userSlots?.title && { title: () => userSlots.title!() }),
        ...(userSlots?.footer && { footer: () => userSlots.footer!() }),
      }

      return () => h(ElDialog, {
        'id': instance.id,
        'modelValue': instance.modelValue.value,
        'onUpdate:modelValue': (value: boolean) => instance.modelValue.value = value,
        // 只有当 zIndex 有值时才传递，否则让 el-dialog 使用默认行为
        ...(zIndex.value != null && { zIndex: zIndex.value }),
        onClose,
        onClosed,
        ...elDialogProps,
      }, slots)
    },
  })

  app.use(ElLoading)

  return app
}
