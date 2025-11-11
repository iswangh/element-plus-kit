# GitHub Actions 发布到 npm 配置指南

## 前置准备

### 1. 创建 npm Access Token

1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 点击右上角头像 → **Access Tokens**
3. 点击 **Generate New Token** → **Generate Classic Token**
4. 选择 **Automation** 类型（用于 CI/CD）
5. 复制生成的 token（只显示一次，请妥善保存）

### 2. 配置 GitHub Secrets

1. 进入 GitHub 仓库
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 名称填写：`NPM_TOKEN`
5. 值填写：刚才复制的 npm token
6. 点击 **Add secret**

## 工作流配置

已创建 `.github/workflows/publish.yml` 工作流文件，包含以下功能：

- ✅ 自动安装依赖
- ✅ 代码检查（lint）
- ✅ 类型检查（type-check）
- ✅ 发布到 npm

## 触发方式

### 方式 1：推送标签（推荐）

```bash
# 创建并推送标签
git tag v0.1.0
git push origin v0.1.0
```

### 方式 2：手动触发

1. 进入 GitHub 仓库的 **Actions** 标签页
2. 选择 **Publish to npm** 工作流
3. 点击 **Run workflow** 按钮

## 注意事项

### npm Token 类型

- **Classic Token**：传统 token，有效期较长，适合 CI/CD
- **Granular Access Token**：细粒度 token，更安全但需要定期更新

### 如果使用 Granular Token

如果使用 npm 的 Granular Access Token，需要：

1. 在 npm 中创建 token 时，确保包含 `publish` 权限
2. 在 `setup-node` 步骤中添加 `scope` 配置：

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    registry-url: 'https://registry.npmjs.org'
    scope: '@iswangh' # 替换为你的 scope
```

### 发布前检查

工作流会自动执行：
- `pnpm lint` - 代码检查
- `pnpm type-check` - 类型检查
- `prepublishOnly` 脚本（如果 package.json 中有配置）

### 版本管理

建议使用语义化版本（SemVer）：
- `v0.1.0` - 初始版本
- `v0.1.1` - 补丁版本（bug 修复）
- `v0.2.0` - 次版本（新功能）
- `v1.0.0` - 主版本（重大变更）

## 故障排查

### 错误：ENEEDAUTH

**原因**：npm 认证失败

**解决方案**：
1. 检查 `NPM_TOKEN` secret 是否正确配置
2. 确认 token 是否有效（未过期）
3. 确认 token 是否有 `publish` 权限

### 错误：403 Forbidden

**原因**：没有发布权限或包名冲突

**解决方案**：
1. 确认 npm 账号是否有发布权限
2. 检查包名是否已被占用
3. 确认是否使用了正确的 scope（如 `@iswangh/commitlint-config`）

### 错误：包名已存在

**原因**：版本号已发布

**解决方案**：
1. 更新 `package.json` 中的版本号
2. 创建新的 Git 标签
3. 重新触发发布
