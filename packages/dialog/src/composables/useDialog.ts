import type { App } from 'vue'
import type { DialogGlobalConfig, DialogInstance, DialogOptions, UseDialogReturn } from '../types'
import { computed, getCurrentInstance, onUnmounted, ref, watch } from 'vue'
import { createDialogApp } from '../utils/createDialogApp'
import { generateId } from '../utils/generateId'
import { useDialogStack } from './useDialogStack'

/**
 * useDialog 组合式函数
 *
 * 创建弹窗实例管理器，支持全局配置
 *
 * @param globalConfig - 全局配置（页面级别）
 * @returns UseDialogReturn
 */
export function useDialog(globalConfig?: DialogGlobalConfig): UseDialogReturn {
  const dialogStack = useDialogStack()

  return {
    use(options: DialogOptions): DialogInstance {
      // 合并全局配置和实例配置（实例配置优先）
      const mergedOptions = { ...globalConfig, ...options } as DialogOptions
      const id = generateId()
      const modelValue = ref(false)
      const loading = ref(mergedOptions.loading?.value ?? false)
      const buttonLoadings = ref<Record<string, boolean>>(mergedOptions.buttonLoadings?.value ?? {})

      // 如果用户传入了自定义的 loading，使用用户的，否则使用内部的
      const finalLoading = mergedOptions.loading ?? loading
      const finalButtonLoadings = mergedOptions.buttonLoadings ?? buttonLoadings

      // 确认按钮 loading（计算属性）
      const confirmLoading = computed({
        get: () => finalButtonLoadings.value.confirm ?? false,
        set: (value: boolean) => finalButtonLoadings.value.confirm = value,
      })

      // 取消按钮 loading（计算属性）
      const cancelLoading = computed({
        get: () => finalButtonLoadings.value.cancel ?? false,
        set: (value: boolean) => finalButtonLoadings.value.cancel = value,
      })

      // z-index 初始值（会在 push 到栈后自动更新）
      const zIndex = ref(2000)

      const instance: DialogInstance = {
        id,
        modelValue,
        zIndex,
        loading: finalLoading,
        buttonLoadings: finalButtonLoadings,
        confirmLoading,
        cancelLoading,
      }

      // 注册到弹窗栈
      dialogStack.push(instance)

      // 弹窗应用实例（用于自动渲染）
      let dialogApp: App | null = null
      let dialogContainer: HTMLElement | null = null

      // 清理函数
      function cleanup() {
        if (dialogApp && dialogContainer) {
          dialogApp.unmount()
          dialogContainer.remove()
          dialogApp = null
          dialogContainer = null
        }
        // 从弹窗栈中移除
        dialogStack.pop(instance)
      }

      // watch modelValue 变化，自动创建/销毁弹窗应用
      // 注意：清理逻辑由 destroy-on-close 属性控制，保持与 el-dialog 原生行为一致
      // - destroy-on-close 为 true：在 @closed 事件中调用 cleanup() 卸载 Vue 应用
      // - destroy-on-close 为 false：保留 Vue 应用和 DOM，下次打开时复用
      watch(modelValue, async (newVal: boolean) => {
        if (newVal) {
          // 打开时：创建并挂载弹窗应用
          if (!dialogApp) {
            // 创建容器元素
            dialogContainer = document.createElement('div')
            document.body.appendChild(dialogContainer)

            // 创建弹窗应用（传入 cleanup 函数，在 @closed 事件中根据 destroy-on-close 决定是否调用）
            dialogApp = createDialogApp(mergedOptions, instance, cleanup)

            // 挂载到容器
            dialogApp.mount(dialogContainer)
          }
        }
        // 注意：关闭时不立即清理，由 destroy-on-close 和 @closed 事件控制清理时机
      }, { immediate: false })

      // 组件卸载时清理
      if (getCurrentInstance()) {
        onUnmounted(() => cleanup())
      }

      return instance
    },
  }
}
