import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/**
 * Form 包构建配置
 *
 * 表单组件包，依赖 core 包
 */
export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
      outDir: 'dist',
      copyDtsFiles: true,
      skipDiagnostics: false,
      logLevel: 'silent',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ElementPlusKitForm',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', 'element-plus', '@iswangh/element-plus-kit/core'],
      output: {
        globals: {
          'vue': 'Vue',
          'element-plus': 'ElementPlus',
        },
        assetFileNames: 'style.css',
      },
    },
    cssCodeSplit: false,
  },
})
