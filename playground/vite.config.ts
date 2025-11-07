import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { ElementPlusKitResolver } from '../packages/kit/src/utils/resolver'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        ElementPlusKitResolver(),
      ],
      imports: ['vue'],
      dts: resolve(__dirname, './types/auto-imports.d.ts'),
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        ElementPlusKitResolver(),
      ],
      dts: resolve(__dirname, './types/components.d.ts'),
    }),
  ],
  resolve: {
    alias: [
      // 样式文件别名：开发环境中将样式文件指向源码，因为 dist 目录还未构建
      // 支持单独导入样式：import '@iswangh/element-plus-kit-form/style.css'
      {
        find: '@iswangh/element-plus-kit-form/style.css',
        replacement: resolve(__dirname, '../packages/form/src/style/index.scss'),
      },
      // 包名别名：开发环境中指向源码，确保 HMR 正常工作
      {
        find: '@iswangh/element-plus-kit-form',
        replacement: resolve(__dirname, '../packages/form/src/index.ts'),
      },
      {
        find: '@iswangh/element-plus-kit-core',
        replacement: resolve(__dirname, '../packages/core/src/index.ts'),
      },
      {
        find: '@iswangh/element-plus-kit',
        replacement: resolve(__dirname, '../packages/kit/src/index.ts'),
      },
      // playground 内部别名
      {
        find: '@',
        replacement: resolve(__dirname, './src'),
      },
    ],
    dedupe: ['vue', 'element-plus'],
  },
  optimizeDeps: {
    // 注意：不在这里预构建 packages，让 Vite 在运行时通过 resolve.alias 正确解析
    esbuildOptions: {
      // 配置 esbuild 别名解析，与 resolve.alias 保持一致
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  },
})
