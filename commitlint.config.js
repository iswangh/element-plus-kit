/**
 * @file Commitlint 配置文件
 *
 * 专为规范化 Git 提交信息设计，验证 Git 提交信息格式，确保团队提交信息规范统一
 *
 * @see {@link https://commitlint.js.org/ Commitlint 官方网站}
 * @see {@link https://www.conventionalcommits.org/zh-hans/v1.0.0/ Conventional Commits 规范}
 */

export default {
  /**
   * 继承配置
   */
  extends: ['@commitlint/config-conventional'],
  /**
   * 提交信息规则
   */
  rules: {
    // 提交类型枚举
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复 bug
        'refactor', // 代码重构
        'style', // 代码格式调整
        'perf', // 性能优化
        'test', // 测试相关
        'build', // 构建配置
        'ci', // CI/CD 配置
        'docs', // 文档更新
        'chore', // 日常维护
        'revert', // 回滚操作
      ],
    ],

    // 提交类型大小写
    'type-case': [2, 'always', 'lowercase'],

    // 提交类型不能为空
    'type-empty': [2, 'never'],

    // 作用域可以为空
    'scope-empty': [0],

    // body 前应有空行
    'body-leading-blank': [1, 'always'],

    // footer 前应有空行
    'footer-leading-blank': [1, 'always'],

    // 提交描述不能为空
    'subject-empty': [2, 'never'],

    // 提交描述不能以点号结尾
    'subject-full-stop': [2, 'never', '.'],

    // 提交信息最大长度
    'header-max-length': [2, 'always', 100],
  },
}
