import type { Theme } from 'vitepress'
import ElementPlusKit from '@iswangh/element-plus-kit'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { onMounted, watch } from 'vue'
import { useComponents } from './useComponents'
import 'element-plus/dist/index.css'
import '@iswangh/element-plus-kit-form/style.css'
import 'uno.css'
import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import './style.scss'

/**
 * VitePress 主题配置
 *
 * 集成 Element Plus 和 Element Plus Kit
 */
export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    // 注册 Element Plus（配置中文语言）
    ctx.app.use(ElementPlus, {
      locale: zhCn,
    })
    // 注册 Element Plus Kit
    ctx.app.use(ElementPlusKit)
    // 注册 vitepress-theme-demoblock 组件
    useComponents(ctx.app)
  },
  setup() {
    // 获取 VitePress 的主题状态
    const { isDark } = useData()

    // 同步 Element Plus 的暗色模式
    const updateElementPlusTheme = () => {
      const html = document.documentElement
      if (isDark.value) {
        html.classList.add('dark')
      }
      else {
        html.classList.remove('dark')
      }
    }

    // 监听主题变化
    watch(
      () => isDark.value,
      () => {
        updateElementPlusTheme()
      },
      { immediate: true },
    )

    // 组件挂载时同步主题
    onMounted(() => {
      updateElementPlusTheme()
    })
  },
} satisfies Theme
