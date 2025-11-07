import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/**
 * Kit 包构建配置
 *
 * 主包，聚合所有组件和工具，提供统一的入口
 */
export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
      outDir: 'dist',
      copyDtsFiles: true,
      rollupTypes: true,
      logLevel: 'silent',
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        resolver: resolve(__dirname, 'src/resolver.ts'),
      },
      name: 'ElementPlusKit',
      fileName: (format, entryName) => `${entryName}.js`,
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
        'element-plus',
        '@iswangh/element-plus-kit/form',
        '@iswangh/element-plus-kit/core',
      ],
      output: {
        globals: {
          'vue': 'Vue',
          'element-plus': 'ElementPlus',
        },
      },
    },
  },
})
