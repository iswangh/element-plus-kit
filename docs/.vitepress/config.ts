import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/**
 * VitePress 配置
 *
 * 用于生成可交互的使用文档
 */
export default defineConfig({
  title: 'Element Plus Kit',
  description: '基于 Element Plus 的 Vue 3 组件库',
  base: '/element-plus-kit/',
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'Element Plus Kit',
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/' },
      { text: '开发', link: '/development/' },
      {
        text: '链接',
        items: [
          { text: 'Gitee 仓库', link: 'https://gitee.com/iswangh/element-plus-kit' },
          { text: 'GitHub 仓库', link: 'https://github.com/iswangh/element-plus-kit' },
          { text: 'Element Plus', link: 'https://element-plus.org/zh-CN/' },
        ],
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
      '/development/': [
        {
          text: '开发文档',
          items: [
            { text: '开发指南', link: '/development/' },
            { text: 'Core 包', link: '/development/core' },
            { text: 'Form 包', link: '/development/form' },
            { text: 'Kit 包', link: '/development/kit' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/iswangh/element-plus-kit' },
      { icon: { svg: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512zm-22.222-768H256v170.667h233.778v-170.667zm0 256H256v170.667h233.778V512zm0 256H256v170.667h233.778V768zm256-512H512v170.667h233.778V256zm0 256H512v170.667h233.778V512zm0 256H512v170.667h233.778V768z"/></svg>' }, link: 'https://gitee.com/iswangh/element-plus-kit' },
    ],
    footer: {
      message: '基于 Element Plus 构建',
      copyright: 'Copyright © 2024 Element Plus Kit',
    },
    search: {
      provider: 'local',
      options: {
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
  },
  vite: {
    resolve: {
      alias: {
        '@': resolve(__dirname, '../'),
        '@packages': resolve(__dirname, '../../../packages'),
        '@playground': resolve(__dirname, '../../../playground/src'),
      },
    },
    server: {
      fs: {
        allow: ['..'],
      },
    },
  },
})
