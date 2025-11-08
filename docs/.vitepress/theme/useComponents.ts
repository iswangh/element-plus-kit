import type { App } from 'vue'
// @ts-expect-error - vitepress-theme-demoblock 可能没有类型声明
import Demo from 'vitepress-theme-demoblock/dist/client/components/Demo.vue'
// @ts-expect-error - vitepress-theme-demoblock 可能没有类型声明
import DemoBlock from 'vitepress-theme-demoblock/dist/client/components/DemoBlock.vue'

/**
 * 注册组件
 *
 * 注册 vitepress-theme-demoblock 所需的组件
 */
export function useComponents(app: App) {
  app.component('Demo', Demo)
  app.component('DemoBlock', DemoBlock)
}
