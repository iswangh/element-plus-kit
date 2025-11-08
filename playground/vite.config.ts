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
    // Vue 单文件组件支持
    vue(),
    // 自动导入插件：自动导入 Vue API 和组件
    AutoImport({
      // 解析器：Element Plus 和 Element Plus Kit 的自动导入解析器
      resolvers: [
        ElementPlusResolver(),
        ElementPlusKitResolver(),
      ],
      // 自动导入的模块：Vue API（ref、computed 等）
      imports: ['vue'],
      // 类型声明文件输出路径
      dts: resolve(__dirname, './types/auto-imports.d.ts'),
    }),
    // 组件自动导入插件：自动导入组件，无需手动 import
    Components({
      // 解析器：Element Plus 和 Element Plus Kit 的组件解析器
      resolvers: [
        ElementPlusResolver(),
        ElementPlusKitResolver(),
      ],
      // 类型声明文件输出路径
      dts: resolve(__dirname, './types/components.d.ts'),
    }),
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
    // 依赖去重：确保 vue 和 element-plus 只使用一个版本
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
