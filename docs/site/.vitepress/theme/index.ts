import type { Theme } from 'vitepress'
import ElementPlusKit from '@iswangh/element-plus-kit'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import DefaultTheme from 'vitepress/theme'
import DemoContainer from './components/DemoContainer.vue'
import 'element-plus/dist/index.css'
import '@iswangh/element-plus-kit-form/style.css'
import './style.css'

/**
 * VitePress 主题配置
 *
 * 集成 Element Plus 和 Element Plus Kit
 */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册 Element Plus（配置中文语言）
    app.use(ElementPlus, {
      locale: zhCn,
    })
    // 注册 Element Plus Kit
    app.use(ElementPlusKit)
    // 注册全局组件
    app.component('DemoContainer', DemoContainer)
  },
} satisfies Theme
