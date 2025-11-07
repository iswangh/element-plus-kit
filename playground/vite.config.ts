import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
// 直接导入 resolver 文件，避免通过 index.ts（因为 index.ts 使用了别名，在 Node.js 环境中无法解析）
import { ElementPlusKitAutoImportResolver } from '../packages/kit/src/auto-import-resolver.ts'
import { ElementPlusKitResolver } from '../packages/kit/src/resolver.ts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        ElementPlusKitAutoImportResolver(),
      ],
      imports: ['vue'],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        ElementPlusKitResolver(),
      ],
    }),
  ],
  resolve: {
    alias: [
      // 使用数组形式，更具体的路径放在前面，确保优先匹配
      {
        find: '@iswangh/element-plus-kit/form/style.css',
        replacement: resolve(__dirname, '../packages/form/src/style.css'),
      },
      {
        find: '@iswangh/element-plus-kit/form',
        replacement: resolve(__dirname, '../packages/form/src/index.ts'),
      },
      {
        find: '@iswangh/element-plus-kit/core',
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
      // 支持 packages/kit 内部使用的别名路径
      {
        find: '@/form',
        replacement: resolve(__dirname, '../packages/form/src/index.ts'),
      },
      {
        find: '@/core',
        replacement: resolve(__dirname, '../packages/core/src/index.ts'),
      },
      {
        find: '@/kit',
        replacement: resolve(__dirname, '../packages/kit/src/index.ts'),
      },
    ],
    dedupe: ['vue', 'element-plus'],
  },
  optimizeDeps: {
    // 注意：不在这里预构建 packages，因为它们在内部使用了别名路径
    // Vite 会在运行时通过 resolve.alias 正确解析这些路径
    // 如果需要预构建，需要先解决别名冲突问题（@ 别名指向 playground/src）
    esbuildOptions: {
      // 配置 esbuild 别名解析，支持 packages/kit 内部使用的别名路径
      // 注意：这里的别名需要与 resolve.alias 保持一致
      alias: {
        '@/form': resolve(__dirname, '../packages/form/src/index.ts'),
        '@/core': resolve(__dirname, '../packages/core/src/index.ts'),
        '@/kit': resolve(__dirname, '../packages/kit/src/index.ts'),
      },
    },
  },
})
