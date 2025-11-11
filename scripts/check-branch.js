/**
 * @file 检查 Git 分支脚本
 *
 * 确保只能在 main 或 master 分支执行发布操作
 */

import { execSync } from 'node:child_process'
import process from 'node:process'

const ALLOWED_BRANCHES = ['main', 'master']

const currentBranch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim()

if (!ALLOWED_BRANCHES.includes(currentBranch)) {
  console.error(`❌ 错误：只能在 ${ALLOWED_BRANCHES.join(' 或 ')} 分支执行发布操作`)
  console.error(`   当前分支：${currentBranch}`)
  console.error(`   请切换到 ${ALLOWED_BRANCHES.join(' 或 ')} 分支后再试`)
  process.exit(1)
}

console.warn(`✅ 当前分支：${currentBranch}，允许发布`)
