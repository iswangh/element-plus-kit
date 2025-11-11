/**
 * @file Commitlint 配置文件
 *
 * 专为规范化 Git 提交信息设计，验证 Git 提交信息格式，确保团队提交信息规范统一
 *
 * @see {@link https://commitlint.js.org/ Commitlint 官方网站}
 * @see {@link https://www.conventionalcommits.org/zh-hans/v1.0.0/ Conventional Commits 规范}
 */

// 规则级别常量
const RULE_LEVEL = {
  DISABLED: 0, // 禁用规则
  WARNING: 1, // 警告级别
  ERROR: 2, // 错误级别
}

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // ========== 提交类型规则 ==========
    /** 提交类型枚举 */
    'type-enum': [
      RULE_LEVEL.ERROR,
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
    /** 提交类型大小写 */
    'type-case': [RULE_LEVEL.ERROR, 'always', 'lowercase'],
    /** 提交类型不能为空 */
    'type-empty': [RULE_LEVEL.ERROR, 'never'],

    // ========== 作用域规则 ==========
    /** 作用域可以为空 */
    'scope-empty': [RULE_LEVEL.DISABLED],

    // ========== 主题规则 ==========
    /** 提交描述不能为空 */
    'subject-empty': [RULE_LEVEL.ERROR, 'never'],
    /** 提交描述不能以点号结尾 */
    'subject-full-stop': [RULE_LEVEL.ERROR, 'never', '.'],

    // ========== 头部规则 ==========
    /** 提交信息最大长度 */
    'header-max-length': [RULE_LEVEL.ERROR, 'always', 100],

    // ========== Body 规则 ==========
    /** body 前应有空行 */
    'body-leading-blank': [RULE_LEVEL.WARNING, 'always'],

    // ========== Footer 规则 ==========
    /** footer 前应有空行 */
    'footer-leading-blank': [RULE_LEVEL.WARNING, 'always'],

    // ========== 自定义规则 ==========
    /** 禁止使用中文冒号（Conventional Commits 格式要求使用英文冒号） */
    'no-chinese-colon': [RULE_LEVEL.ERROR, 'always'],
  },
  plugins: [
    {
      rules: {
        /**
         * 禁止使用中文冒号
         * Conventional Commits 格式要求使用英文冒号 (:)
         */
        'no-chinese-colon': ({ raw }) => {
          if (/：/.test(raw)) {
            return [
              false,
              '提交信息中包含中文冒号，请使用英文冒号(:)代替中文冒号(：)',
            ]
          }
          return [true, '']
        },
      },
    },
  ],
}
