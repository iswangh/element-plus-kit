# Changesets

欢迎使用 Changesets！这是一个用于管理 Monorepo 版本和发布的工具。

## 📖 使用文档

完整的文档请参考：[Changesets 官方文档](https://github.com/changesets/changesets)

## 🚀 快速开始

### 1. 创建变更集（Changeset）

在代码修改后，创建变更集文件来记录变更：

```bash
pnpm changeset
```

或者使用：

```bash
nr changeset
```

交互式选择：
- 受影响的包（core、form、kit）
- 变更类型（patch、minor、major）
- 变更描述

### 2. 更新版本号

根据变更集文件更新版本号和依赖：

```bash
pnpm version
```

或者：

```bash
nr version
```

这个命令会：
- 读取 `.changeset/` 目录下的变更集文件
- 自动更新包的版本号
- 自动更新内部依赖版本
- 生成或更新 CHANGELOG.md
- 删除已处理的变更集文件

### 3. 发布包

发布所有需要发布的包：

```bash
pnpm release
```

或者：

```bash
nr release
```

这个命令会：
- 检查分支（必须在 main 或 master 分支）
- 构建所有包
- 发布到 npm
- 自动处理依赖顺序（core → form → kit）

## 📝 完整发布流程

### 方式一：使用 Changesets（推荐）

```bash
# 1. 开发完成后，创建变更集
pnpm changeset

# 2. 提交变更集文件
git add .changeset/
git commit -m "chore: add changeset"

# 3. 合并到 main 分支后，更新版本号
pnpm version

# 4. 提交版本更新和 CHANGELOG
git add .
git commit -m "chore: version packages"
git push

# 5. 发布包
pnpm release
```

### 方式二：使用旧脚本（备选）

如果不想使用 Changesets，仍可使用旧的发布脚本：

```bash
# 发布 patch 版本
pnpm publish:patch

# 发布 minor 版本
pnpm publish:minor

# 发布 major 版本
pnpm publish:major
```

## ⚙️ 配置说明

配置文件：`.changeset/config.json`

- **access**: `"public"` - 包发布为公开包
- **baseBranch**: `"main"` - 基础分支
- **updateInternalDependencies**: `"patch"` - 内部依赖更新策略
- **ignore**: `["playground", "docs"]` - 忽略的包（不发布）

## 📚 更多信息

- [Changesets 官方文档](https://github.com/changesets/changesets)
- [常见问题](https://github.com/changesets/changesets/blob/main/docs/common-questions.md)
