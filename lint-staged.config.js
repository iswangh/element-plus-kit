/**
 * @file Lint-Staged 配置文件
 *
 * 用于配置 Git 提交前需要执行的 lint 任务，对暂存区文件进行代码规范检查和自动修复
 *
 * @see {@link https://github.com/okonet/lint-staged Lint-Staged GitHub 仓库}
 */

export default {
  '*.{js,jsx,ts,tsx,vue,css,less,scss,json,yaml,yml}': ['eslint --fix'],
}
