/**
 * @file ESLint 配置文件
 *
 * 基于 @antfu/eslint-config 的代码规范配置，集成了 Vue、TypeScript 和 JSX 支持，统一项目代码风格，提高代码质量和可维护性
 *
 * @see {@link https://eslint.org/ ESLint 官方网站}
 * @see {@link http://eslint.cn/ ESLint 中文文档}
 * @see {@link https://github.com/antfu/eslint-config @antfu/eslint-config GitHub 仓库}
 */

import antfu from '@antfu/eslint-config'
import unusedImports from 'eslint-plugin-unused-imports'

export default antfu(
  {
    vue: true,
    typescript: true,
    jsx: true,
    formatters: true,
    stylistic: { printWidth: 100 },
    rules: {
      'antfu/top-level-function': 'off', // 允许使用箭头函数声明顶级函数
    },
  },
  { plugins: { unusedImports } },
  {
    rules: {
      // unusedImports
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': ['error', { vars: 'all', varsIgnorePattern: '^_' }],
    },
  },
  // 全局规则
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'import', next: '*' }, // import 语句后需要空行
        { blankLine: 'never', prev: '*', next: 'import' }, // 禁止 import 前有空行
      ],
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/block-lang': ['error', { script: { lang: 'ts' } }], // 块语言限制
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn', // 允许使用 any 但不推荐，会警告
      '@typescript-eslint/no-empty-interface': ['warn', { allowSingleExtends: true }], // 允许接口定义为空，但会警告，继承不会
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'], // 普通变量用 camelCase，常量用 UPPER_CASE
          leadingUnderscore: 'allow', // 允许 _private 形式的私有变量
          filter: {
            // 允许配置文件中的 __dirname 和 __filename
            regex: '^(__dirname|__filename)$',
            match: false,
          },
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        { selector: 'class', format: ['PascalCase'] },
        { selector: 'enum', format: ['PascalCase'] },
        { selector: 'interface', format: ['PascalCase'] },
        { selector: 'typeAlias', format: ['PascalCase'] },
      ],
    },
  },
  {
    // 忽略文件配置
    ignores: [
      'dist/',
      'output/',
      '**/.output/',
      '**/.nuxt/',
      '**/.vite/',
      'node_modules/',
      '.bun/',
      '.pnpm-debug.log',
      'yarn-error.log',
      'coverage/',
      'temp/',
      'tmp/',
      'src/types/generated/',
      '**/*.generated.d.ts',
      '**/*.md',
      '.workflow/', // Gitee CI/CD 配置文件，不需要 ESLint 检查
    ],
  },
)
