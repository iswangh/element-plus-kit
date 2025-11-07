import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 工作区路径别名：使用相对路径，严禁使用包名
      '@/core': resolve(__dirname, '../core/src/index.ts'),
      '@/form': resolve(__dirname, '../form/src/index.ts'),
      '@/kit': resolve(__dirname, 'src/index.ts'),
    },
  },
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
