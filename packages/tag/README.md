# @iswangh/element-plus-kit-tag

Element Plus Kit Tag 组件，基于 Element Plus Tag 的封装组件。

## 📦 安装

```bash
npm install @iswangh/element-plus-kit-tag
```

## 🚀 快速开始

### 基础用法

```vue
<script setup lang="ts">
import { WTag } from '@iswangh/element-plus-kit-tag'
</script>

<template>
  <WTag>标签</WTag>
</template>
```

### 引入样式

**重要说明**：WTag 组件已按需导入了 Element Plus Tag 组件样式，用户导入组件时样式会自动导入，**无需额外配置**。

#### 自动导入（默认，推荐）

直接导入组件即可，样式会自动导入：

```typescript
import { WTag } from '@iswangh/element-plus-kit-tag'
```

#### 单独导入样式（可选）

如果需要在 CSS 文件中单独导入样式，可以使用：

```typescript
import '@iswangh/element-plus-kit-tag/style.css'
```

## 📖 API 文档

### Props

WTag 组件继承所有 Element Plus Tag 的属性，详情请参考 [Element Plus Tag 文档](https://element-plus.org/zh-CN/component/tag.html)。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 类型 | `'success' \| 'info' \| 'warning' \| 'danger'` | `''` |
| closable | 是否可关闭 | `boolean` | `false` |
| disable-transitions | 是否禁用渐变动画 | `boolean` | `false` |
| hit | 是否有边框描边 | `boolean` | `false` |
| color | 背景色 | `string` | `''` |
| size | 尺寸 | `'large' \| 'default' \| 'small'` | `'default'` |
| effect | 主题 | `'dark' \| 'light' \| 'plain'` | `'light'` |
| round | 是否圆形 | `boolean` | `false` |

### Events

WTag 组件继承所有 Element Plus Tag 的事件，详情请参考 [Element Plus Tag 文档](https://element-plus.org/zh-CN/component/tag.html)。

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| close | 关闭 Tag 时触发的事件 | `(event: MouseEvent) => void` |
| click | 点击 Tag 时触发的事件 | `(event: MouseEvent) => void` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 标签内容 |

## 💡 使用示例

### 基础用法

```vue
<template>
  <WTag>标签</WTag>
  <WTag type="success">成功</WTag>
  <WTag type="info">信息</WTag>
  <WTag type="warning">警告</WTag>
  <WTag type="danger">危险</WTag>
</template>
```

### 可关闭标签

```vue
<template>
  <WTag closable @close="handleClose">可关闭标签</WTag>
</template>

<script setup lang="ts">
const handleClose = () => {
  console.log('标签已关闭')
}
</script>
```

### 不同尺寸

```vue
<template>
  <WTag size="large">大标签</WTag>
  <WTag size="default">默认标签</WTag>
  <WTag size="small">小标签</WTag>
</template>
```

### 不同主题

```vue
<template>
  <WTag effect="dark">深色</WTag>
  <WTag effect="light">浅色</WTag>
  <WTag effect="plain">朴素</WTag>
</template>
```

## 🔗 相关链接

- [主包文档](../kit/README.md)
- [Element Plus 文档](https://element-plus.org/zh-CN/)

