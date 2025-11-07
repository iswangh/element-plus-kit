# @iswangh/element-plus-kit-core

Element Plus Kit 核心工具函数包，提供组件库内部使用的通用工具函数。

## 📦 安装

```bash
npm install @iswangh/element-plus-kit-core
```

## 🚀 快速开始

```typescript
import { checkCondition } from '@iswangh/element-plus-kit-core'
```

## 📖 API 文档

### checkCondition

条件渲染判断函数，用于处理表单项的条件渲染逻辑，支持布尔值或返回布尔值的函数。

#### 类型定义

```typescript
interface CheckConditionOptions<T = unknown> {
  condition?: boolean | ((data: T) => boolean)
  data?: T
  defaultValue?: boolean
}

function checkCondition<T = unknown>(
  options: CheckConditionOptions<T>
): boolean
```

#### 参数说明

- `condition` - 判断条件
  - 当为 `boolean` 时：直接返回该布尔值
  - 当为 `function` 时：执行函数并返回结果，函数接收 `data` 作为参数
  - 当为 `undefined` 时：返回 `defaultValue`
- `data` - 数据上下文，传递给条件函数的数据对象
- `defaultValue` - 默认返回值，当 `condition` 为 `undefined` 或条件函数执行出错时返回此值，默认为 `false`

#### 返回值

- `boolean` - 条件判断结果

#### 使用示例

```typescript
// 1. 布尔值条件
const result1 = checkCondition({
  condition: true,
  defaultValue: false
})
// result1: true

// 2. 函数条件（带数据上下文）
const formData = { username: 'admin', age: 25 }
const result2 = checkCondition({
  condition: (data) => data.username === 'admin',
  data: formData
})
// result2: true

// 3. 未定义条件，使用默认值
const result3 = checkCondition({
  condition: undefined
})
// result3: false（使用默认值 false）

// 4. 明确要求显示的情况
const result4 = checkCondition({
  condition: undefined,
  defaultValue: true  // 显式设置为 true
})
// result4: true
```

#### 错误处理

函数内部会捕获所有异常，当条件函数执行出错时，会返回 `defaultValue` 并在控制台输出警告信息，不会抛出错误。

## 🔗 相关链接

- [主包文档](../kit/README.md)
- [Form 组件文档](../form/README.md)
