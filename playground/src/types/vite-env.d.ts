/// <reference types="vite/client" />

/**
 * Vite 环境类型定义
 */
interface ImportMeta {
  /**
   * 动态导入模块
   * @param pattern - 文件匹配模式
   * @param options - 导入选项
   * @param options.eager - 是否立即导入模块
   * @param options.import - 指定导入的命名导出
   * @param options.query - 附加到导入路径的查询参数
   */
  glob: <T = unknown>(
    pattern: string,
    options?: {
      eager?: boolean
      import?: string
      query?: string | Record<string, string | number | boolean>
    },
  ) => Record<string, () => Promise<T>>
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
