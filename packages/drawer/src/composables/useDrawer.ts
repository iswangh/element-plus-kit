import type { App } from 'vue'
import type { DrawerGlobalConfig, DrawerInstance, DrawerOptions, UseDrawerReturn } from '../types'
import { generateId } from '@iswangh/element-plus-kit-core'
import { computed, getCurrentInstance, onUnmounted, ref, watch } from 'vue'
import { createDrawerApp } from '../utils/createDrawerApp'
import { useDrawerStack } from './useDrawerStack'

/**
 * useDrawer 组合式函数
 *
 * 创建抽屉实例管理器，支持全局配置
 *
 * @param globalConfig - 全局配置（页面级别）
 * @returns UseDrawerReturn
 */
export function useDrawer(globalConfig?: DrawerGlobalConfig): UseDrawerReturn {
  const drawerStack = useDrawerStack()

  return {
    use(options: DrawerOptions): DrawerInstance {
      // 合并全局配置和实例配置（实例配置优先）
      const mergedOptions = { ...globalConfig, ...options } as DrawerOptions
      const id = generateId('drawer')
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

      const instance: DrawerInstance = {
        id,
        modelValue,
        loading: finalLoading,
        buttonLoadings: finalButtonLoadings,
        confirmLoading,
        cancelLoading,
      }

      // 注册到抽屉栈
      drawerStack.push(instance)

      // 抽屉应用实例（用于自动渲染）
      let drawerApp: App | null = null
      let drawerContainer: HTMLElement | null = null

      // 清理函数
      function cleanup() {
        if (drawerApp && drawerContainer) {
          drawerApp.unmount()
          drawerContainer.remove()
          drawerApp = null
          drawerContainer = null
        }
        // 从抽屉栈中移除
        drawerStack.pop(instance)
      }

      // watch modelValue 变化，自动创建/销毁抽屉应用
      // 注意：清理逻辑由 destroy-on-close 属性控制，保持与 el-drawer 原生行为一致
      // - destroy-on-close 为 true：在 @closed 事件中调用 cleanup() 卸载 Vue 应用
      // - destroy-on-close 为 false：保留 Vue 应用和 DOM，下次打开时复用
      watch(modelValue, async (newVal: boolean) => {
        if (newVal) {
          // 打开时：创建并挂载抽屉应用
          if (!drawerApp) {
            // 创建容器元素
            drawerContainer = document.createElement('div')
            document.body.appendChild(drawerContainer)

            // 创建抽屉应用（传入 cleanup 函数，在 @closed 事件中根据 destroy-on-close 决定是否调用）
            drawerApp = createDrawerApp(mergedOptions, instance, cleanup)

            // 挂载到容器
            drawerApp.mount(drawerContainer)
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
