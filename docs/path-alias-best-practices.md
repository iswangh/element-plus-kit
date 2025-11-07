# Monorepo 路径别名最佳实践

本文档说明在 Monorepo 项目中路径别名的使用规范和最佳实践。

---

## 📋 核心原则

### ✅ 推荐：使用包名导入

在 Monorepo 的**包内部**，应该使用**包名导入**，而不是路径别名。

```typescript
// ✅ 推荐：使用包名导入
import { checkCondition } from '@iswangh/element-plus-kit/core'
import { WForm } from '@iswangh/element-plus-kit/form'
```

### ❌ 不推荐：使用路径别名

```typescript
// ❌ 不推荐：使用路径别名
import { checkCondition } from '@/core'
import { WForm } from '@/form'
```

### ❌ 不推荐：使用相对路径

```typescript
// ❌ 不推荐：使用相对路径
import { checkCondition } from '../../core/src/index'
import { WForm } from '../form/src/index'
```

---

## 🏢 大厂最佳实践

### 1. **Vercel / Next.js**

- **Monorepo 包内部**：使用包名导入（如 `@vercel/xxx`）
- **应用项目**：使用路径别名（如 `@/components`）指向项目内部文件

### 2. **Vue / Vite**

- **Monorepo 包内部**：使用包名导入（如 `@vue/xxx`）
- **应用项目**：使用路径别名（如 `@/components`）指向项目内部文件

### 3. **Element Plus**

- **Monorepo 包内部**：使用包名导入（如 `@element-plus/xxx`）
- **应用项目**：使用路径别名指向项目内部文件

---

## 🎯 为什么使用包名导入？

### 1. **pnpm workspace 自动解析**

pnpm workspace 会自动将包名解析到工作区内的源码：

```json
// pnpm-workspace.yaml
packages:
  - 'packages/*'
```

当你在代码中使用 `@iswangh/element-plus-kit/core` 时，pnpm 会自动：
- 在工作区内查找对应的包
- 解析到包的源码（开发时）或构建产物（发布后）

### 2. **与发布后一致**

使用包名导入，开发环境和发布后的使用方式完全一致：

```typescript
// 开发时（Monorepo 内部）
import { checkCondition } from '@iswangh/element-plus-kit/core'

// 发布后（用户安装使用）
import { checkCondition } from '@iswangh/element-plus-kit/core'
// 完全相同的导入方式！
```

### 3. **更好的类型推断**

TypeScript 可以通过 `package.json` 的 `exports` 字段正确解析类型：

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  }
}
```

### 4. **简化配置**

不需要维护路径别名配置：
- ❌ 不需要在 `tsconfig.json` 中配置 `paths`
- ❌ 不需要在 `vite.config.ts` 中配置 `alias`
- ✅ 减少配置复杂度
- ✅ 避免配置不一致的问题

---

## 📝 配置说明

### tsconfig.json

**不配置 `paths`**：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "rootDir": "./src"
    // 不配置 paths，使用包名导入即可
  }
}
```

**为什么不需要**：
- TypeScript 会通过 `package.json` 的 `exports` 字段解析包名
- pnpm workspace 会自动解析工作区内的包

---

### vite.config.ts

**不配置 `alias`**：

```typescript
export default defineConfig({
  resolve: {
    // 不需要配置别名，使用包名导入即可
    // pnpm workspace 会自动解析 @iswangh/element-plus-kit/core 等包名
  },
})
```

**为什么不需要**：
- Vite 原生支持通过 `package.json` 的 `exports` 字段解析包名
- pnpm workspace 会自动解析工作区内的包

---

## 🔍 references 和 vueCompilerOptions 的必要性

### `references` - 必需

```json
{
  "references": [
    {
      "path": "../core",
      "prepend": false
    }
  ]
}
```

**为什么必需**：
- ✅ **支持跨包的类型引用**：form 包可以引用 core 包的类型定义
- ✅ **启用增量编译**：只重新编译变更的包，大幅提升编译速度
- ✅ **提升编译性能**：TypeScript 可以并行编译多个包
- ✅ **类型安全**：确保包之间的类型依赖关系正确
- ✅ **启用 `composite: true` 的前提**：项目引用是启用 composite 模式的前提

---

### `vueCompilerOptions` - 必需（包含 Vue 组件的包）

```json
{
  "vueCompilerOptions": {
    "target": 3,
    "globalTypesPath": "../../node_modules/.tmp/vue-global-types.d.ts"
  }
}
```

**为什么必需**：
- ✅ **Vue 3 的 TypeScript 支持必需**：没有此配置，`.vue` 文件中的 TypeScript 类型检查无法正常工作
- ✅ **类型推断**：确保 Vue 组件的 props、emits、slots 等类型正确推断
- ✅ **类型检查**：确保模板中的类型错误能被正确检测

**适用场景**：
- **包含 Vue 组件的包必需**：form 包包含 `.vue` 文件，必须配置
- **纯 TypeScript 包不需要**：core 包不包含 Vue 组件，不需要此配置

---

## 📊 对比总结

| 方案 | 开发时 | 发布后 | 配置复杂度 | 类型推断 | 推荐度 |
|------|--------|--------|-----------|---------|--------|
| **包名导入** | `@iswangh/element-plus-kit/core` | `@iswangh/element-plus-kit/core` | 低（无需配置） | ✅ 优秀 | ⭐⭐⭐⭐⭐ |
| **路径别名** | `@/core` | 需要配置 | 中（需同步配置） | ⚠️ 一般 | ⭐⭐ |
| **相对路径** | `../../core/src/index` | 不适用 | 低（无需配置） | ⚠️ 一般 | ⭐ |

---

## 🎯 最终建议

### 在 Monorepo 包内部

1. **使用包名导入**：`@iswangh/element-plus-kit/core`
2. **不配置 `paths`**：移除 `tsconfig.json` 中的 `paths` 配置
3. **不配置 `alias`**：移除 `vite.config.ts` 中的 `alias` 配置
4. **保留 `references`**：在 `tsconfig.json` 中保留项目引用配置
5. **保留 `vueCompilerOptions`**：包含 Vue 组件的包必须保留此配置

### 在应用项目（如 playground）

1. **可以使用路径别名**：`@/components` 指向项目内部文件
2. **包导入使用包名**：`@iswangh/element-plus-kit/form` 导入包

---

## 📚 相关资源

- [pnpm workspace 文档](https://pnpm.io/workspaces)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Vue 3 TypeScript 支持](https://vuejs.org/guide/typescript/overview.html)

---

**文档维护者**：Element Plus Kit 团队  
**最后更新**：2024年
