# Scripts 目录

本目录包含项目使用的工具脚本。

## 📁 文件结构

```
scripts/
├── index.js              # 聚合导出入口
├── check-branch.js       # 分支检查脚本
└── README.md            # 本文件
```

## 🚀 使用方式

### 方式一：直接执行脚本（命令行）

```bash
# 检查分支（直接执行脚本）
node scripts/check-branch.js
```

**注意**：分支检查已集成到 Changesets 的 pre 钩子中，执行 `pnpm version` 或 `pnpm release` 时会自动检查，无需手动执行。

### 方式二：作为模块导入

```javascript
// 导入单个函数
import { checkBranch, checkBranchAndExit } from './scripts/index.js'

// 使用 checkBranch（返回布尔值）
if (checkBranch()) {
  console.log('分支检查通过')
}

// 使用 checkBranchAndExit（检查失败会退出进程）
checkBranchAndExit()
```

### 方式三：从聚合入口导入

```javascript
// 从聚合入口导入所有脚本功能
import * as scripts from './scripts/index.js'

// 使用
scripts.checkBranch()
scripts.checkBranchAndExit()
```

## 📝 脚本说明

### check-branch.js

检查当前 Git 分支是否允许发布操作。

**功能**：
- 检查当前分支是否为 `main` 或 `master`
- 如果不是允许的分支，输出错误信息并退出（直接执行时）
- 返回布尔值（作为模块导入时）

**导出函数**：
- `checkBranch(allowedBranches?)` - 检查分支，返回布尔值
- `checkBranchAndExit(allowedBranches?)` - 检查分支，失败时退出进程

**参数**：
- `allowedBranches` (可选): 允许的分支列表，默认为 `['main', 'master']`

**使用示例**：

```javascript
import { checkBranch } from './scripts/index.js'

// 使用默认分支列表
if (checkBranch()) {
  console.log('可以发布')
}

// 使用自定义分支列表
if (checkBranch(['main', 'master', 'release'])) {
  console.log('可以发布')
}
```

## 🔧 添加新脚本

添加新脚本时，请遵循以下规范：

1. **创建脚本文件**：在 `scripts/` 目录下创建新的 `.js` 文件
2. **导出函数**：使用 `export` 导出需要对外暴露的函数
3. **更新聚合导出**：在 `scripts/index.js` 中添加导出
4. **添加文档**：在本文件中添加脚本说明

**示例**：

```javascript
// scripts/new-script.js
/**
 * @file 新脚本说明
 */

export function newFunction() {
  // 实现逻辑
}

// 如果作为脚本直接执行
if (import.meta.url.endsWith(process.argv[1]?.replace(/\\/g, '/'))) {
  newFunction()
}
```

```javascript
// scripts/index.js
export { newFunction } from './new-script.js'
```

## 📚 更多信息

- 脚本遵循 ES Module 规范
- 所有脚本都支持作为命令行工具和模块两种使用方式
- 脚本使用 TypeScript JSDoc 注释提供类型提示
