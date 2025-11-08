import process from 'node:process'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind4,
  transformerCompileClass,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

// 判断当前环境（Vite 会自动注入 NODE_ENV）
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  presets: [
    presetWind4(),
    // 属性化预设
    presetAttributify({
      prefix: 'un-', // 添加前缀避免与原生属性冲突
      prefixedOnly: false, // 同时支持带前缀和不带前缀的属性
    }),
    // 图标支持
    presetIcons({
      scale: 1.2, // 图标大小
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
        'flex-shrink': '0', // 防止图标在 flex 布局中被压缩
      },
    }),
  ],
  transformers: [
    transformerDirectives(), // 支持 @apply, @screen 等指令
    transformerVariantGroup(), // 支持分组语法：hover:(bg-blue-500 text-white)
    ...(isProduction ? [transformerCompileClass()] : []), // 压缩类名,仅在生产环境生效
  ],
  theme: {},
  safelist: [],
})
