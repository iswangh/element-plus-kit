# Table 组件暴露 el-table 方法方案评估

## 需求

将 `el-table` 的方法暴露出去，支持用户通过 `ref` 访问。

## 方案对比

### 方案 A：使用 `defineExpose`（推荐）

**实现方式**：
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ElTable } from 'element-plus'

const tableRef = ref<InstanceType<typeof ElTable>>()

defineExpose({
  // 直接暴露 el-table 的所有方法
  clearSelection: () => tableRef.value?.clearSelection(),
  toggleRowSelection: (row: any, selected?: boolean) => tableRef.value?.toggleRowSelection(row, selected),
  toggleAllSelection: () => tableRef.value?.toggleAllSelection(),
  toggleRowExpansion: (row: any, expanded?: boolean) => tableRef.value?.toggleRowExpansion(row, expanded),
  setCurrentRow: (row: any) => tableRef.value?.setCurrentRow(row),
  clearSort: () => tableRef.value?.clearSort(),
  clearFilter: (columnKeys?: string[]) => tableRef.value?.clearFilter(columnKeys),
  doLayout: () => tableRef.value?.doLayout(),
  scrollTo: (options: ScrollToOptions | number, yCoord?: number) => tableRef.value?.scrollTo(options, yCoord),
  setScrollTop: (top: number) => tableRef.value?.setScrollTop(top),
  setScrollLeft: (left: number) => tableRef.value?.setScrollLeft(left),
})
</script>

<template>
  <ElTable ref="tableRef" v-bind="mergedTableProps">
    <!-- ... -->
  </ElTable>
</template>
```

**优点**：
1. ✅ **符合 Vue 3 最佳实践**：官方推荐使用 `defineExpose`
2. ✅ **类型安全**：可以明确类型定义
3. ✅ **代码清晰**：显式暴露需要的方法
4. ✅ **与 form 包一致**：form 包使用 `defineExpose` 暴露方法
5. ✅ **易于维护**：方法列表清晰，便于维护和扩展

**缺点**：
1. ❌ 需要手动列出所有方法（但这是优点，可以控制暴露哪些方法）

### 方案 B：使用 `getCurrentInstance` + ref 函数（用户提出的方案）

**实现方式**：
```vue
<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { ElTable } from 'element-plus'

const instance = getCurrentInstance()

function handleTableRef(exposed: any) {
  if (instance) {
    instance.exposed = exposed
  }
}
</script>

<template>
  <ElTable :ref="handleTableRef" v-bind="mergedTableProps">
    <!-- ... -->
  </ElTable>
</template>
```

**优点**：
1. ✅ **自动暴露所有方法**：不需要手动列出方法

**缺点**：
1. ❌ **不符合 Vue 3 最佳实践**：官方不推荐在应用代码中使用 `getCurrentInstance`
2. ❌ **类型不安全**：`exposed` 类型不明确
3. ❌ **不够清晰**：隐藏了暴露的方法，不够直观
4. ❌ **与 form 包不一致**：form 包使用 `defineExpose`
5. ❌ **可能暴露不需要的方法**：自动暴露所有方法，包括内部方法

### 方案 C：直接暴露 tableRef（最简单）

**实现方式**：
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ElTable } from 'element-plus'

const tableRef = ref<InstanceType<typeof ElTable>>()

defineExpose({
  tableRef,  // 直接暴露 ref
})
</script>

<template>
  <ElTable ref="tableRef" v-bind="mergedTableProps">
    <!-- ... -->
  </ElTable>
</template>
```

**使用方式**：
```vue
<template>
  <WTable ref="tableRef" :columns="columns" :data="tableData" />
</template>

<script setup>
const tableRef = ref()

// 访问方法
tableRef.value.tableRef.clearSelection()
</script>
```

**优点**：
1. ✅ **实现简单**：只需要暴露 ref
2. ✅ **类型安全**：可以明确类型定义
3. ✅ **自动支持所有方法**：不需要手动列出

**缺点**：
1. ❌ **使用不够直观**：需要 `tableRef.value.tableRef.clearSelection()`，多了一层
2. ❌ **与 form 包不一致**：form 包直接暴露方法，不是暴露 ref

## 推荐方案

**推荐使用方案 B（`getCurrentInstance`）+ 降级方案 A（`defineExpose`）**，理由如下：

### 1. 自动暴露所有方法

- 使用 `getCurrentInstance` 自动暴露 `el-table` 的所有方法
- 不需要手动列出每个方法，减少维护成本
- 自动支持未来可能添加的新方法

### 2. 兼容性降级

- 如果 `getCurrentInstance` 不可用（某些环境），自动降级为 `defineExpose`
- 确保在所有环境下都能正常工作

### 3. 使用直观

```vue
<template>
  <WTable ref="tableRef" :columns="columns" :data="tableData" />
</template>

<script setup>
const tableRef = ref()

// 直接调用方法，使用直观
tableRef.value.clearSelection()
</script>
```

### 4. 实现方式

```vue
<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { getCurrentInstance, defineExpose, ref } from 'vue'
import { ElTable } from 'element-plus'

const instance = getCurrentInstance()
const tableRef = ref<InstanceType<typeof ElTable>>()

// 方案 B：优先使用 getCurrentInstance
function handleTableRef(exposed: any) {
  if (instance) {
    instance.exposed = exposed
  }
}

// 方案 B：需要加上 defineExpose({} as ComponentPublicInstance) 以确保类型正确
if (instance) {
  defineExpose({} as ComponentPublicInstance)
}

// 方案 A：降级方案（当 getCurrentInstance 不可用时）
if (!instance) {
  defineExpose({
    clearSelection: () => tableRef.value?.clearSelection(),
    // ... 其他方法
  })
}
</script>

<template>
  <ElTable :ref="instance ? handleTableRef : undefined" ref="tableRef" v-bind="mergedTableProps">
    <!-- ... -->
  </ElTable>
</template>
```

**注意事项**：
- 方案 B 必须加上 `defineExpose({} as ComponentPublicInstance)` 以确保类型正确
- 这样 TypeScript 才能正确识别暴露的方法类型

## 实现细节

### el-table 的主要方法

根据 Element Plus 文档，`el-table` 的主要方法包括：

1. `clearSelection()` - 清空多选
2. `toggleRowSelection(row, selected?)` - 切换某一行的选中状态
3. `toggleAllSelection()` - 切换全选状态
4. `toggleRowExpansion(row, expanded?)` - 切换某一行的展开状态
5. `setCurrentRow(row)` - 设置当前行
6. `clearSort()` - 清空排序
7. `clearFilter(columnKeys?)` - 清空筛选
8. `doLayout()` - 对表格进行重新布局
9. `scrollTo(options, yCoord?)` - 滚动到指定位置
10. `setScrollTop(top)` - 设置垂直滚动位置
11. `setScrollLeft(left)` - 设置水平滚动位置

### 类型定义

```typescript
import type { TableInstance } from 'element-plus'

export interface WTableInstance {
  // el-table 方法
  clearSelection: () => void
  toggleRowSelection: (row: any, selected?: boolean) => void
  toggleAllSelection: () => void
  toggleRowExpansion: (row: any, expanded?: boolean) => void
  setCurrentRow: (row: any) => void
  clearSort: () => void
  clearFilter: (columnKeys?: string[]) => void
  doLayout: () => void
  scrollTo: (options: ScrollToOptions | number, yCoord?: number) => void
  setScrollTop: (top: number) => void
  setScrollLeft: (left: number) => void
}
```

## 结论

**推荐使用方案 B（`getCurrentInstance`）+ 降级方案 A（`defineExpose`）**，原因：
1. 自动暴露所有方法，减少维护成本
2. 兼容性降级，确保所有环境下都能工作
3. 使用直观，直接调用方法
4. 自动支持未来可能添加的新方法

**实现策略**：
- 优先使用 `getCurrentInstance` 自动暴露所有方法（方案 B）
- 如果 `getCurrentInstance` 不可用，降级为 `defineExpose` 手动暴露方法（方案 A）
- 确保在所有环境下都能正常工作
