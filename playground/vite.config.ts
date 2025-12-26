import type { PluginOption } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import UnoCSS from '@unocss/vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { ElementPlusKitResolver } from '../packages/kit/src/utils/resolver'
import { lodashImports } from './build'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    // 自动导入插件
    AutoImport({
      dts: './src/types/auto-imports.d.ts',
      imports: [
        'vue',
        {
          'vue-router': ['createRouter', 'createWebHistory', 'useRouter', 'useRoute', 'useLink', 'onBeforeRouteLeave', 'onBeforeRouteUpdate'],
          'lodash-es': lodashImports,
        },
      ],
      resolvers: [
        ElementPlusResolver(),
        ElementPlusKitResolver(),
      ],
    }) as PluginOption,
    // 自动注册组件
    Components({
      dts: './src/types/components.d.ts',
      resolvers: [
        ElementPlusResolver(),
        ElementPlusKitResolver(),
      ],
    }) as PluginOption,
  ],
  resolve: {
    // 路径别名配置：用于开发时直接引用包源码，支持 HMR
    alias: [
      // 样式文件别名：开发环境中将样式文件指向源码，因为 dist 目录还未构建
      // 支持单独导入样式：import '@iswangh/element-plus-kit-form/style.css'
      {
        find: '@iswangh/element-plus-kit-form/style.css',
        replacement: resolve(__dirname, '../packages/form/src/style/index.scss'),
      },
      {
        find: '@iswangh/element-plus-kit-tag/style.css',
        replacement: resolve(__dirname, '../packages/tag/src/index.ts'),
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
        find: '@iswangh/element-plus-kit-dialog',
        replacement: resolve(__dirname, '../packages/dialog/src/index.ts'),
      },
      {
        find: '@iswangh/element-plus-kit-tag',
        replacement: resolve(__dirname, '../packages/tag/src/index.ts'),
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
  server: {
    port: 5173,
    host: true,
  },
})
