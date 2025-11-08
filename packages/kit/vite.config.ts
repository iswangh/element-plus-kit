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
      // 合并类型声明文件：将多个入口的类型声明合并
      rollupTypes: true,
      // 日志级别：静默（不输出日志）
      logLevel: 'silent',
    }),
  ],
  build: {
    // 库模式配置
    lib: {
      // 多入口配置：支持多个入口点
      entry: {
        // 主入口：组件库主入口
        index: resolve(__dirname, 'src/index.ts'),
        // resolver 入口：用于 unplugin-vue-components 的自动导入解析器
        resolver: resolve(__dirname, 'src/utils/resolver.ts'),
      },
      // 库名称（用于 UMD 格式，当前仅使用 ES 格式）
      name: 'ElementPlusKit',
      // 输出文件名：根据入口名称生成
      fileName: (format, entryName) => `${entryName}.js`,
      // 输出格式：仅 ES 模块
      formats: ['es'],
    },
    rollupOptions: {
      // 外部依赖：不打包到库中，由使用者提供
      external: [
        'vue',
        'element-plus',
        '@iswangh/element-plus-kit-form',
        '@iswangh/element-plus-kit-core',
      ],
      output: {
        // 全局变量映射（用于 UMD 格式，当前未使用）
        globals: {
          'vue': 'Vue',
          'element-plus': 'ElementPlus',
        },
      },
    },
  },
})
