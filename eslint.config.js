/**
 * @file ESLint 配置文件
 *
 * 基于 @iswangh/eslint-config 的代码规范配置，集成了 Vue、TypeScript 和 JSX 支持，统一项目代码风格，提高代码质量和可维护性
 *
 * @see {@link https://eslint.org/ ESLint 官方网站}
 * @see {@link http://eslint.cn/ ESLint 中文文档}
 * @see {@link https://gitee.com/iswangh/eslint-config @iswangh/eslint-config 仓库}
 */

import iswangh from '@iswangh/eslint-config'

export default iswangh({ unocss: true })
