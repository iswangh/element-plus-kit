import type { Theme } from 'vitepress'
import ElementPlusKit from '@iswangh/element-plus-kit'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import DefaultTheme from 'vitepress/theme'
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
} satisfies Theme
