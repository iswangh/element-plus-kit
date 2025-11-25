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
    // Vue 单文件组件支持
    vue(),
    // 类型声明文件生成插件
    dts({
      // 包含的文件：所有 src 目录下的文件
      include: ['src/**/*'],
      // 排除的文件：测试文件
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
      // 输出目录：dist
      outDir: 'dist',
      // 复制类型声明文件到输出目录
      copyDtsFiles: true,
      // 日志级别：静默（不输出日志）
      logLevel: 'silent',
    }),
  ],
  // esbuild 配置：开发时转换和生产构建压缩
  esbuild: {
    // 移除所有注释（包括 JSDoc 注释）
    legalComments: 'none',
    // 移除 console 和 debugger
    drop: ['console', 'debugger'],
  },
  build: {
    // 库模式配置
    lib: {
      // 入口文件
      entry: resolve(__dirname, 'src/index.ts'),
      // 库名称（用于 UMD 格式，当前仅使用 ES 格式）
      name: 'ElementPlusKitForm',
      // 输出文件名
      fileName: 'index',
      // 输出格式：仅 ES 模块
      formats: ['es'],
    },
    rollupOptions: {
      // 外部依赖：不打包到库中，由使用者提供
      external: ['vue', 'element-plus', '@iswangh/element-plus-kit-core'],
      output: {
        // 全局变量映射（用于 UMD 格式，当前未使用）
        globals: {
          'vue': 'Vue',
          'element-plus': 'ElementPlus',
        },
        // 样式文件输出名称：统一输出为 style.css
        assetFileNames: 'style.css',
      },
    },
    // 禁用 CSS 代码分割：所有样式合并到一个文件
    cssCodeSplit: false,
    // 使用 esbuild 进行代码压缩和优化
    minify: 'esbuild',
  },
})
