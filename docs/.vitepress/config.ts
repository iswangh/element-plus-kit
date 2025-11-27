import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitepress'
import { demoblockPlugin, demoblockVitePlugin } from 'vitepress-theme-demoblock'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/**
 * VitePress 配置
 *
 * 用于生成可交互的使用文档
 */
export default defineConfig({
  title: 'Element Plus Kit',
  description: '基于 Element Plus 二次封装的组件库',
  // 本地开发时使用根路径，部署到子目录时使用 /element-plus-kit/
  // 可以通过环境变量 VITE_BASE 来覆盖，例如：VITE_BASE=/element-plus-kit/ pnpm docs:build
  base: process.env.VITE_BASE || '/',
  lang: 'zh-CN',
  // 排除 development 目录，不参与构建
  srcExclude: ['**/development/**'],
  head: [
    ['link', { rel: 'icon', href: `${process.env.VITE_BASE || '/'}favicon.ico` }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
  ],
  markdown: {
    config: (md) => {
      // 使用 vitepress-theme-demoblock 插件
      md.use(demoblockPlugin)
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Element Plus Kit',
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/form/' },
      {
        text: 'Element Plus',
        link: 'https://element-plus.org/zh-CN/',
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' },
          ],
        },
      ],
      '/components/': [
        {
          text: '组件',
          items: [
            { text: 'Form 表单', link: '/components/form/' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'gitee', link: 'https://gitee.com/iswangh/element-plus-kit' },
      { icon: 'github', link: 'https://github.com/iswangh/element-plus-kit' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@iswangh/element-plus-kit' },
    ],
    footer: {
      message: '基于 Element Plus 构建',
      copyright: 'Copyright © 2024 Element Plus Kit',
    },
    search: {
      provider: 'local',
      options: {
        // 排除开发文档目录
        _render(src, env, md) {
          // 排除 development 目录下的所有文件
          if (env.relativePath?.includes('development/') || env.relativePath?.startsWith('development/')) {
            return ''
          }
          return md.render(src, env)
        },
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },
    editLink: {
      pattern: 'https://gitee.com/iswangh/element-plus-kit/edit/main/docs/:path',
      text: '在 Gitee 上编辑此页',
    },
    lastUpdated: {
      text: '最后更新于',
    },
    outline: {
      level: [2, 3], // 显示 h2 和 h3 标题
      label: 'On this page',
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: { api: 'modern-compiler' },
      },
    },
    plugins: [
      // Vite 版本不兼容：VitePress 使用 Vite 5.4.21，UnoCSS 使用 Vite 7.2.0
      // eslint-disable-next-line ts/no-explicit-any
      UnoCSS() as any,
      // vitepress-theme-demoblock 的 Vite 插件
      demoblockVitePlugin(),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, '../'),
        '@packages': resolve(__dirname, '../../../packages'),
        '@playground': resolve(__dirname, '../../../playground/src'),
      },
    },
    server: {
      port: 5174,
      fs: {
        // 允许访问父目录，以便访问 packages 和 playground
        allow: ['..', '../..', '../../..'],
      },
    },
    optimizeDeps: {
      // 预构建依赖，提升开发体验
      include: ['element-plus', 'vue', '@iswangh/element-plus-kit'],
    },
  },
  // 构建结束钩子 - 生成站点地图
  buildEnd: async (siteConfig) => {
    // 简单的站点地图生成逻辑
    // 如果需要更完整的 sitemap，可以使用专门的插件
    const { writeFileSync } = await import('node:fs')
    const { resolve: resolvePath } = await import('node:path')
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteConfig.site.base}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
    writeFileSync(resolvePath(siteConfig.outDir, 'sitemap.xml'), sitemap)
  },
})
