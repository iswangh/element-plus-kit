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

交互式选择流程：

1. **选择要包含的包**（空格选择，回车确认）
   - `@iswangh/element-plus-kit-core`
   - `@iswangh/element-plus-kit-form`
   - `@iswangh/element-plus-kit`

2. **选择 major 版本**（直接回车 = 不选择 = 不是 major）
   - 提示：`Which packages should have a major bump?`
   - **选择 patch/minor**：直接回车（不选择任何包）
   - **选择 major**：选择包后回车

3. **选择 minor 版本**（如果上一步没选 major，会继续问）
   - 提示：`Which packages should have a minor bump?`
   - **选择 patch**：直接回车（不选择任何包）
   - **选择 minor**：选择包后回车

4. **输入变更描述**
   - 简要描述本次变更的内容
   - 将出现在 CHANGELOG.md 中

**版本选择规则**：
- 不选 major + 不选 minor = **patch**（0.1.2 → 0.1.3）
- 不选 major + 选 minor = **minor**（0.1.2 → 0.2.0）
- 选 major = **major**（0.1.2 → 1.0.0）

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
- 发布到 npm（每个包的 `prepublishOnly` 钩子会自动执行构建和类型检查）
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

## ⚙️ 配置说明

配置文件：`.changeset/config.json`

- **access**: `"public"` - 包发布为公开包
- **baseBranch**: `"main"` - 基础分支（用于比较变更）
- **updateInternalDependencies**: `"patch"` - 内部依赖更新策略
- **ignore**: `["element-plus-kit-playground", "element-plus-kit-docs"]` - 忽略的包（不发布）
- **pre**: 预执行钩子
  - **version**: 在 `changeset version` 执行前自动检查分支（使用 `@iswangh/script` 包）
  - **publish**: 在 `changeset publish` 执行前自动检查分支（使用 `@iswangh/script` 包）

### 分支检查机制

Changesets 通过 pre 钩子自动检查分支：
- 执行 `changeset version` 前，自动检查当前分支是否为 `main` 或 `master`
- 执行 `changeset publish` 前，自动检查当前分支是否为 `main` 或 `master`
- 如果分支不正确，会阻止执行并提示错误信息

**实现方式**：
- 使用 `@iswangh/script` 包提供的 `check-branch` 命令
- 通过 `npx @iswangh/script check-branch` 调用，无需安装依赖
- 默认允许 `main` 和 `master` 分支

## 📚 更多信息

- [Changesets 官方文档](https://github.com/changesets/changesets)
- [常见问题](https://github.com/changesets/changesets/blob/main/docs/common-questions.md)
