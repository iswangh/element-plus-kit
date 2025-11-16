/**
 * @file 检查 Git 分支脚本
 *
 * 确保只能在 main 或 master 分支执行发布操作
 */

import { execSync } from 'node:child_process'
import process from 'node:process'

const ALLOWED_BRANCHES = ['main', 'master']

/**
 * 检查当前 Git 分支是否允许发布
 * @param {string[]} allowedBranches - 允许的分支列表，默认为 ['main', 'master']
 * @returns {boolean} 如果当前分支允许发布返回 true，否则返回 false
 */
export function checkBranch(allowedBranches = ALLOWED_BRANCHES) {
  try {
    const currentBranch = execSync('git branch --show-current', {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim()

    if (!currentBranch) {
      console.error('❌ 错误：无法获取当前 Git 分支')
      console.error('   请确保当前目录是一个 Git 仓库')
      return false
    }

    if (!allowedBranches.includes(currentBranch)) {
      console.error(`❌ 错误：只能在 ${allowedBranches.join(' 或 ')} 分支执行发布操作`)
      console.error(`   当前分支：${currentBranch}`)
      console.error(`   请切换到 ${allowedBranches.join(' 或 ')} 分支后再试`)
      return false
    }

    console.warn(`✅ 当前分支：${currentBranch}，允许发布`)
    return true
  }
  catch (error) {
    console.error('❌ 错误：执行 Git 命令失败')
    console.error(`   错误信息：${error.message}`)
    console.error('   请确保已安装 Git 且当前目录是一个 Git 仓库')
    return false
  }
}

/**
 * 检查分支并退出进程（用于命令行脚本）
 * @param {string[]} allowedBranches - 允许的分支列表，默认为 ['main', 'master']
 */
export function checkBranchAndExit(allowedBranches = ALLOWED_BRANCHES) {
  if (!checkBranch(allowedBranches)) {
    process.exit(1)
  }
}

// 如果作为脚本直接执行，则执行检查并退出
// 通过检查 import.meta.url 是否匹配当前执行的文件路径来判断
const isMainModule = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`
  || process.argv[1]?.endsWith('check-branch.js')
  || process.argv[1]?.includes('check-branch.js')

if (isMainModule) {
  checkBranchAndExit()
}
