# Table 组件完整设计方案

> 本文档包含 Table 组件的完整设计需求、API 设计和实现方案。

## 目录

- [需求概述](#需求概述)
- [核心需求](#核心需求)
- [API 设计](#api-设计)
- [文件结构](#文件结构)
- [实现细节](#实现细节)
- [使用示例](#使用示例)
- [实现优先级](#实现优先级)

---

## 需求概述

### 设计目标

基于 `el-table` 提供**配置化表格组件**：
- **WTable 组件**：通过配置化列定义，简化表格使用

**核心功能支持：**
- ✅ 配置化列定义（`columns` 属性）
- ✅ 支持 `render` 函数自定义列内容
- ✅ 支持 `slots` 对象配置插槽（参考 form 包）
- ✅ 支持模板插槽（参考 form 包）
- ✅ 完全透传 Element Plus Table 的所有属性、事件、插槽
- ✅ 类型继承，不重复定义已有类型
- ✅ 暴露 `el-table` 的方法，支持通过 `ref` 访问（优先使用 `getCurrentInstance`，降级为 `defineExpose`）

### 方案说明

**WTable 组件**
- ✅ 配置化列定义，减少模板代码
- ✅ 支持 `render` 函数和 `slots` 对象两种自定义列方式
- ✅ 完全透传原生属性和事件，保持灵活性
- ✅ 完整的 TypeScript 类型支持

### 包结构

- **包名**：`@iswangh/element-plus-kit-table`
- **位置**：`packages/table/`
- **依赖**：无（独立包，不依赖其他内部包）

---

## 核心需求

### 1. 配置化列定义

**需求：**
- 通过 `columns` 数组配置表格列
- 支持所有 `el-table-column` 的属性
- 支持 `render` 函数自定义列内容（等价于 `slots.default`，用于渲染 default 插槽）
- 支持 `slots` 对象配置插槽（参考 form 包的设计）
  - `slots.default`：列内容插槽（等价于 `render` 函数）
  - `slots.header`：表头插槽
- 支持模板插槽（参考 form 包的设计）
  - 方式一：使用列的 `prop` 作为插槽名称（`#{prop}`），用于 default 插槽
  - 方式二：使用前缀匹配（`#{prop}-${slotName}`），支持所有插槽（如 `#{prop}-default`、`#{prop}-header`）
  - 优先级：配置插槽（`render`、`slots`）> 模板插槽

**实现：**
```typescript
const columns: TableColumn[] = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', sortable: true },
  {
    prop: 'status',
    label: '状态',
    render: ({ row }) => h('span', { style: { color: 'red' } }, row.status),
  },
  { 
    prop: 'actions', 
    label: '操作', 
    slots: {
      default: ({ row }) => h('div', [
        h(ElButton, { onClick: () => handleEdit(row) }, '编辑'),
        h(ElButton, { onClick: () => handleDelete(row) }, '删除'),
      ]),
    },
  },
]

<WTable :columns="columns" :data="tableData" />
```

### 2. 类型继承（不额外定义）

**需求：**
- `WTableProps` 继承 `ElTableProps`
- `TableColumn` 继承 `ElTableColumnProps`
- 不重复定义已有类型

**实现：**
```typescript
interface WTableProps extends /* @vue-ignore */ Partial<ElTableProps> {
  columns: TableColumn[]
}

interface TableColumn extends /* @vue-ignore */ Partial<ElTableColumnProps> {
  prop: string
  label: string
  /** 自定义渲染函数 */
  render?: (scope: { row: any, column: any, $index: number }) => VNode
  /** 插槽配置对象（支持 default、header 等插槽） */
  slots?: {
    default?: (scope: { row: any, column: any, $index: number }) => VNode | VNode[]
    header?: (scope: { column: any, $index: number }) => VNode | VNode[]
  }
}
```

### 3. 属性/事件/插槽透传

**需求：**
- 使用 `v-bind` 透传所有 `el-table` 属性（包含事件）
- 使用 `useAttrs` 处理未声明的属性（包含事件）
- 透传所有 `el-table` 插槽

**实现：**
```typescript
const { columns, ...elTableProps } = props
const attrs = useAttrs()

const mergedTableProps = computed(() => ({
  ...elTableProps,
  ...attrs,  // 包含事件属性，v-bind 会自动处理
}))

<ElTable v-bind="mergedTableProps">
  <!-- 列渲染 -->
  <!-- 插槽透传 -->
</ElTable>
```

---

## API 设计

### WTable Props

```typescript
interface WTableProps extends /* @vue-ignore */ Partial<ElTableProps> {
  /** 列配置数组 */
  columns: TableColumn[]
}
```

### TableColumn

```typescript
interface TableColumn extends /* @vue-ignore */ Partial<ElTableColumnProps> {
  /** 列属性名（对应数据字段） */
  prop: string
  /** 列标题 */
  label: string
  /** 自定义渲染函数 */
  render?: (scope: { row: any, column: any, $index: number }) => VNode
  /** 插槽配置对象（支持 default、header 等插槽） */
  slots?: {
    default?: (scope: { row: any, column: any, $index: number }) => VNode | VNode[]
    header?: (scope: { column: any, $index: number }) => VNode | VNode[]
  }
}
```

---

## 文件结构

```
packages/table/
├── src/
│   ├── components/
│   │   ├── Table.vue          # WTable 主组件
│   │   └── index.ts           # 组件导出
│   ├── types/
│   │   ├── el.d.ts            # Element Plus 类型扩展
│   │   ├── table.d.ts         # WTable 组件类型
│   │   ├── column.d.ts        # TableColumn 类型
│   │   └── index.d.ts         # 类型导出
│   └── index.ts               # 包入口文件
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 文件清单

### 需要创建的文件

1. **packages/table/src/components/Table.vue** - WTable 主组件
2. **packages/table/src/components/index.ts** - 组件导出
3. **packages/table/src/types/el.d.ts** - Element Plus 类型扩展
4. **packages/table/src/types/table.d.ts** - WTable 组件类型
5. **packages/table/src/types/column.d.ts** - TableColumn 类型
6. **packages/table/src/types/index.d.ts** - 类型导出
7. **packages/table/src/index.ts** - 包入口文件
8. **packages/table/package.json** - 包配置
9. **packages/table/tsconfig.json** - TypeScript 配置
10. **packages/table/vite.config.ts** - Vite 构建配置
11. **packages/table/README.md** - 包文档

---

## 实现细节

### 1. packages/table/src/components/Table.vue

```vue
<script setup lang="ts">
import type { ComponentPublicInstance, Slot } from 'vue'
import type { TableColumn } from '../types'
import { ElTable, ElTableColumn } from 'element-plus'
import { computed, defineExpose, getCurrentInstance, ref, useAttrs, useSlots } from 'vue'

interface Props extends /* @vue-ignore */ Partial<ElTableProps> {
  /** 列配置数组 */
  columns: TableColumn[]
}

defineOptions({ name: 'WTable' })

const props = defineProps<Props>()
const attrs = useAttrs()
const slots = useSlots()

// 分离自己的属性和 el-table 的属性
const { columns, ...elTableProps } = props

// 合并属性（包含事件，v-bind 会自动处理）
const mergedTableProps = computed(() => ({
  ...elTableProps,
  ...attrs,  // attrs 中包含事件属性（onXxx），v-bind 会自动处理
}))

// el-table 的 ref
const tableRef = ref<InstanceType<typeof ElTable>>()

// 获取当前组件实例（用于方案 B：优先使用 getCurrentInstance）
const instance = getCurrentInstance()

/**
 * 处理 el-table 的 ref（方案 B：优先使用 getCurrentInstance）
 * 如果 getCurrentInstance 可用，则自动暴露所有方法
 * 否则降级为方案 A：使用 defineExpose 手动暴露方法
 */
function handleTableRef(exposed: any) {
  if (instance) {
    // 方案 B：使用 getCurrentInstance 自动暴露所有方法
    instance.exposed = exposed
  }
}

// 方案 B：需要加上 defineExpose({} as ComponentPublicInstance) 以确保类型正确
if (instance) {
  defineExpose({} as ComponentPublicInstance)
}

// 方案 A：降级方案，使用 defineExpose 手动暴露方法（当 getCurrentInstance 不可用时）
if (!instance) {
  defineExpose({
    // el-table 方法
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
}

interface ProcessedSlot {
  rawSlotName: string
  slotName: string
  slotFn: Slot
}

/**
 * 获取列的模板插槽（通过前缀匹配）
 * @param prop 列的 prop 属性
 * @returns 模板插槽数组
 */
function getSlotsByPrefix(prop: string): ProcessedSlot[] {
  const prefix = `${prop}-`
  return Object.keys(slots)
    .filter(name => name.startsWith(prefix))
    .map(name => ({
      rawSlotName: name,
      slotName: name.replace(prefix, ''),
      slotFn: slots[name]!,
    }))
}

/**
 * 将 SlotRenderFn 转换为 Slot
 * @param slotFn SlotRenderFn 函数
 * @returns Vue 的 Slot 函数
 */
function wrapSlotRenderFn(slotFn: (scope: any) => any): Slot {
  return (...args: any[]) => {
    const result = slotFn(args[0] ?? {})
    return Array.isArray(result) ? result : [result]
  }
}

/**
 * 合并配置插槽和模板插槽
 * @param configSlots 配置插槽对象
 * @param templateSlots 模板插槽数组
 * @param prop 列的 prop 属性
 * @returns 合并后的插槽数组
 */
function mergeSlots(
  configSlots: TableColumn['slots'] | undefined,
  templateSlots: ProcessedSlot[],
  prop: string,
): ProcessedSlot[] {
  if (!configSlots && templateSlots.length === 0)
    return []

  const merged: ProcessedSlot[] = []
  const configSlotNames = new Set<string>()

  // 先添加配置插槽（优先级高）
  if (configSlots) {
    for (const [slotName, slotFn] of Object.entries(configSlots)) {
      if (slotFn != null) {
        configSlotNames.add(slotName)
        merged.push({
          rawSlotName: `${prop}-${slotName}`,
          slotName,
          slotFn: wrapSlotRenderFn(slotFn),
        })
      }
    }
  }

  // 再添加模板插槽（如果配置插槽中不存在同名插槽）
  for (const templateSlot of templateSlots) {
    if (!configSlotNames.has(templateSlot.slotName))
      merged.push(templateSlot)
  }

  return merged
}

/**
 * 获取列的合并插槽（配置插槽 + 模板插槽）
 * @param column 列配置
 * @returns 合并后的插槽数组
 */
function getColumnMergedSlots(column: TableColumn): ProcessedSlot[] {
  const templateSlots = getSlotsByPrefix(column.prop)
  return mergeSlots(column.slots, templateSlots, column.prop)
}

// 获取列的插槽配置（排除 default，因为 default 已在前面单独处理）
function getColumnSlots(column: TableColumn) {
  const mergedSlots = getColumnMergedSlots(column)
  return Object.fromEntries(
    mergedSlots
      .filter(slot => slot.slotName !== 'default')
      .map(slot => [slot.slotName, slot.slotFn]),
  )
}

// 获取列的 default 插槽（配置插槽 + 模板插槽）
function getColumnDefaultSlot(column: TableColumn): Slot | undefined {
  const mergedSlots = getColumnMergedSlots(column)
  const defaultSlot = mergedSlots.find(slot => slot.slotName === 'default')
  return defaultSlot?.slotFn
}
</script>

<template>
  <ElTable :ref="instance ? handleTableRef : undefined" ref="tableRef" v-bind="mergedTableProps">
    <ElTableColumn
      v-for="column in columns"
      :key="column.prop"
      v-bind="column"
    >
      <!-- 支持 render 函数（渲染 default 插槽，优先级最高） -->
      <template v-if="column.render" #default="scope">
        <component :is="() => column.render!(scope)" />
      </template>
      
      <!-- 支持 slots.default（配置插槽，等价于 render 函数，渲染 default 插槽） -->
      <template v-else-if="column.slots?.default" #default="scope">
        <component :is="() => column.slots!.default!(scope)" />
      </template>
      
      <!-- 支持模板插槽 default（#{prop}-default 或 #{prop}） -->
      <template v-else-if="getColumnDefaultSlot(column)" #default="scope">
        <component :is="getColumnDefaultSlot(column)!" v-bind="scope" />
      </template>
      
      <!-- 支持模板插槽（备选方案：使用列的 prop 作为插槽名称） -->
      <template v-else-if="slots[column.prop]" #default="scope">
        <slot :name="column.prop" v-bind="scope" />
      </template>
      
      <!-- 遍历合并后的插槽对象，渲染其他插槽（header 等，排除 default） -->
      <template v-for="(slotFn, slotName) in getColumnSlots(column)" :key="slotName" #[slotName]="scope">
        <component :is="slotFn" v-bind="scope" />
      </template>
    </ElTableColumn>
    
    <!-- 透传其他插槽 -->
    <template v-for="(slot, name) in slots" #[name]="scope">
      <slot :name="name" v-bind="scope" />
    </template>
  </ElTable>
</template>
```

### 2. packages/table/src/components/index.ts

```typescript
export { default as WTable } from './Table.vue'
```

### 3. packages/table/src/types/el.d.ts

```typescript
import type { ElTable, ElTableColumn } from 'element-plus'

/** Element Plus Table Props */
export type ElTableProps = InstanceType<typeof ElTable>['$props']

/** Element Plus TableColumn Props */
export type ElTableColumnProps = InstanceType<typeof ElTableColumn>['$props']
```

### 4. packages/table/src/types/column.d.ts

```typescript
import type { VNode } from 'vue'
import type { ElTableColumnProps } from './el'

/**
 * 表格列配置
 *
 * 继承 ElTableColumnProps，支持所有 el-table-column 的属性
 */
export interface TableColumn extends /* @vue-ignore */ Partial<ElTableColumnProps> {
  /** 列属性名（对应数据字段） */
  prop: string
  /** 列标题 */
  label: string
  /** 自定义渲染函数（等价于 slots.default，用于渲染列内容） */
  render?: (scope: { row: any, column: any, $index: number }) => VNode
  /** 插槽配置对象（支持 default、header 等插槽） */
  slots?: {
    /** 列内容插槽（等价于 render 函数） */
    default?: (scope: { row: any, column: any, $index: number }) => VNode | VNode[]
    /** 表头插槽 */
    header?: (scope: { column: any, $index: number }) => VNode | VNode[]
  }
}
```

### 5. packages/table/src/types/table.d.ts

```typescript
import type { ElTableProps } from './el'
import type { TableColumn } from './column'

/**
 * WTable 组件 Props
 *
 * 继承 ElTableProps，支持所有 el-table 的属性
 */
export interface WTableProps extends /* @vue-ignore */ Partial<ElTableProps> {
  /** 列配置数组 */
  columns: TableColumn[]
}
```

### 6. packages/table/src/types/index.d.ts

```typescript
export * from './el'
export * from './table'
export * from './column'
```

### 7. packages/table/src/index.ts

```typescript
// 样式导入
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'

export { WTable } from './components'

// 导出类型
export type { TableColumn, WTableProps } from './types'
```

### 8. packages/table/package.json

```json
{
  "name": "@iswangh/element-plus-kit-table",
  "type": "module",
  "version": "0.0.1",
  "description": "Element Plus Kit Table 组件包",
  "license": "Apache-2.0",
  "sideEffects": [
    "./dist/index.js",
    "./dist/style.css"
  ],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "sideEffects": [
        "./dist/index.js",
        "./dist/style.css"
      ]
    },
    "./style.css": "./dist/style.css"
  },
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": [
    "README.md",
    "dist"
  ],
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch",
    "type-check": "vue-tsc --build",
    "prepublishOnly": "pnpm type-check && pnpm build"
  },
  "peerDependencies": {
    "element-plus": "^2.11.7",
    "vue": "^3.5.23"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.3",
    "element-plus": "^2.13.0",
    "sass": "^1.97.1",
    "typescript": "^5.9.3",
    "vite": "^7.3.0",
    "vite-plugin-dts": "^4.5.4",
    "vue": "^3.5.26",
    "vue-tsc": "^3.2.1"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

### 9. packages/table/tsconfig.json

```json
{
  "extends": "../../tsconfig.app.json",
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "../../node_modules/.tmp/packages-table.tsbuildinfo",
    "baseUrl": ".",
    "rootDir": "./src",
    "paths": {},
    "declaration": true,
    "declarationMap": true,
    "noEmit": false,
    "outDir": "./dist"
  },
  "vueCompilerOptions": {
    "target": 3
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 10. packages/table/vite.config.ts

```typescript
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/**
 * Table 包构建配置
 *
 * Table 组件包，不依赖其他内部包
 */
export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
      outDir: 'dist',
      copyDtsFiles: true,
      logLevel: 'silent',
    }),
  ],
  esbuild: {
    legalComments: 'none',
    drop: ['console', 'debugger'],
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ElementPlusKitTable',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', 'element-plus'],
      output: {
        globals: {
          'vue': 'Vue',
          'element-plus': 'ElementPlus',
        },
        assetFileNames: 'style.css',
      },
    },
    cssCodeSplit: false,
    minify: 'esbuild',
  },
})
```

### 11. packages/table/README.md

```markdown
# @iswangh/element-plus-kit-table

Element Plus Kit Table 组件，基于 Element Plus Table 的封装组件，提供配置化列定义。

## 📦 安装

\`\`\`bash
npm install @iswangh/element-plus-kit-table
\`\`\`

## 🚀 快速开始

### 基础用法

\`\`\`vue
<script setup lang="ts">
import { WTable } from '@iswangh/element-plus-kit-table'
import type { TableColumn } from '@iswangh/element-plus-kit-table'

const columns: TableColumn[] = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', sortable: true },
]

const tableData = [
  { name: '张三', age: 20 },
  { name: '李四', age: 25 },
]
</script>

<template>
  <WTable :columns="columns" :data="tableData" />
</template>
\`\`\`

### 引入样式

**重要说明**：WTable 组件已按需导入了 Element Plus Table 组件样式，用户导入组件时样式会自动导入，**无需额外配置**。

#### 自动导入（默认，推荐）

直接导入组件即可，样式会自动导入：

\`\`\`typescript
import { WTable } from '@iswangh/element-plus-kit-table'
\`\`\`

#### 单独导入样式（可选）

如果需要在 CSS 文件中单独导入样式，可以使用：

\`\`\`typescript
import '@iswangh/element-plus-kit-table/style.css'
\`\`\`

## 📖 API 文档

### Props

WTable 组件继承所有 Element Plus Table 的属性，详情请参考 [Element Plus Table 文档](https://element-plus.org/zh-CN/component/table.html)。

**拓展属性**：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 列配置数组 | `TableColumn[]` | - |

### TableColumn

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| prop | 列属性名（对应数据字段） | `string` | - |
| label | 列标题 | `string` | - |
| render | 自定义渲染函数（等价于 slots.default，用于渲染列内容） | `(scope: { row: any, column: any, $index: number }) => VNode` | - |
| slots | 插槽配置对象 | `{ default?: (scope) => VNode, header?: (scope) => VNode }` | - |

**Element Plus TableColumn 属性**：TableColumn 继承所有 `el-table-column` 的属性，如 `width`、`minWidth`、`fixed`、`sortable`、`filterable` 等。

## 🔗 相关链接

- [主包文档](../kit/README.md)
- [Element Plus Table 文档](https://element-plus.org/zh-CN/component/table.html)
```

---

## 使用示例

### 基础用法

```vue
<script setup lang="ts">
import { WTable } from '@iswangh/element-plus-kit-table'
import type { TableColumn } from '@iswangh/element-plus-kit-table'

const columns: TableColumn[] = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', sortable: true },
  { prop: 'email', label: '邮箱' },
]

const tableData = [
  { name: '张三', age: 20, email: 'zhangsan@example.com' },
  { name: '李四', age: 25, email: 'lisi@example.com' },
]
</script>

<template>
  <WTable :columns="columns" :data="tableData" stripe border />
</template>
```

### 使用 render 函数

```vue
<script setup lang="ts">
import { WTable } from '@iswangh/element-plus-kit-table'
import type { TableColumn } from '@iswangh/element-plus-kit-table'
import { h } from 'vue'

const columns: TableColumn[] = [
  { prop: 'name', label: '姓名' },
  {
    prop: 'status',
    label: '状态',
    render: ({ row }) => {
      const color = row.status === 'active' ? 'green' : 'red'
      return h('span', { style: { color } }, row.status)
    },
  },
]

const tableData = [
  { name: '张三', status: 'active' },
  { name: '李四', status: 'inactive' },
]
</script>

<template>
  <WTable :columns="columns" :data="tableData" />
</template>
```

### 使用 slots 配置对象

```vue
<script setup lang="ts">
import { WTable } from '@iswangh/element-plus-kit-table'
import type { TableColumn } from '@iswangh/element-plus-kit-table'
import { ElButton } from 'element-plus'
import { h } from 'vue'

const columns: TableColumn[] = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  {
    prop: 'actions',
    label: '操作',
    slots: {
      default: ({ row }) => h('div', [
        h(ElButton, { size: 'small', onClick: () => handleEdit(row) }, '编辑'),
        h(ElButton, { size: 'small', type: 'danger', onClick: () => handleDelete(row) }, '删除'),
      ]),
    },
  },
]

const tableData = [
  { name: '张三', age: 20 },
  { name: '李四', age: 25 },
]

function handleEdit(row: any) {
  console.log('编辑', row)
}

function handleDelete(row: any) {
  console.log('删除', row)
}
</script>

<template>
  <WTable :columns="columns" :data="tableData" />
</template>
```

### 使用模板插槽（备选方案）

如果需要在模板中使用插槽，可以通过列的 `prop` 作为插槽名称：

```vue
<script setup lang="ts">
import { WTable } from '@iswangh/element-plus-kit-table'
import type { TableColumn } from '@iswangh/element-plus-kit-table'
import { ElButton } from 'element-plus'

const columns: TableColumn[] = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'actions', label: '操作' },  // 不配置 slots，使用模板插槽
]

const tableData = [
  { name: '张三', age: 20 },
  { name: '李四', age: 25 },
]

function handleEdit(row: any) {
  console.log('编辑', row)
}

function handleDelete(row: any) {
  console.log('删除', row)
}
</script>

<template>
  <WTable :columns="columns" :data="tableData">
    <!-- 使用列的 prop 作为插槽名称 -->
    <template #actions="{ row }">
      <ElButton size="small" @click="handleEdit(row)">编辑</ElButton>
      <ElButton size="small" type="danger" @click="handleDelete(row)">删除</ElButton>
    </template>
  </WTable>
</template>
```

### 使用 ref 访问方法

通过 `ref` 访问 `el-table` 的方法：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WTable } from '@iswangh/element-plus-kit-table'
import type { TableColumn } from '@iswangh/element-plus-kit-table'
import { ElButton } from 'element-plus'

const columns: TableColumn[] = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
]

const tableData = [
  { name: '张三', age: 20 },
  { name: '李四', age: 25 },
]

const tableRef = ref<InstanceType<typeof WTable>>()

function handleClearSelection() {
  tableRef.value?.clearSelection()
}

function handleToggleAllSelection() {
  tableRef.value?.toggleAllSelection()
}
</script>

<template>
  <div>
    <ElButton @click="handleClearSelection">清空选择</ElButton>
    <ElButton @click="handleToggleAllSelection">切换全选</ElButton>
    <WTable ref="tableRef" :columns="columns" :data="tableData" />
  </div>
</template>
```

### 完整功能示例

```vue
<script setup lang="ts">
import { WTable } from '@iswangh/element-plus-kit-table'
import type { TableColumn } from '@iswangh/element-plus-kit-table'
import { ElButton, ElTag } from 'element-plus'
import { h, ref } from 'vue'

const columns: TableColumn[] = [
  { prop: 'name', label: '姓名', width: '120px' },
  { prop: 'age', label: '年龄', sortable: true, width: '100px' },
  {
    prop: 'status',
    label: '状态',
    render: ({ row }) => {
      const type = row.status === 'active' ? 'success' : 'danger'
      return h(ElTag, { type }, () => row.status === 'active' ? '启用' : '禁用')
    },
  },
  {
    prop: 'actions',
    label: '操作',
    width: '200px',
    fixed: 'right',
    slots: {
      default: ({ row }) => h('div', [
        h(ElButton, { size: 'small', onClick: () => handleEdit(row) }, '编辑'),
        h(ElButton, { size: 'small', type: 'danger', onClick: () => handleDelete(row) }, '删除'),
      ]),
    },
  },
]

const tableData = ref([
  { name: '张三', age: 20, status: 'active' },
  { name: '李四', age: 25, status: 'inactive' },
])

const selectedRows = ref([])

const tableRef = ref<InstanceType<typeof WTable>>()

function handleEdit(row: any) {
  console.log('编辑', row)
}

function handleDelete(row: any) {
  console.log('删除', row)
}

function handleClearSelection() {
  tableRef.value?.clearSelection()
}
</script>

<template>
  <div>
    <ElButton @click="handleClearSelection">清空选择</ElButton>
    <WTable
      ref="tableRef"
      :columns="columns"
      :data="tableData"
      stripe
      border
      @selection-change="selectedRows = $event"
    />
  </div>
</template>
```

---

## Playground 示例

### 需要创建的示例文件

1. **playground/src/views/table/basic/index.vue** - 基础用法示例
2. **playground/src/views/table/native/index.vue** - el-table 原生功能示例
3. **playground/src/views/table/extended/index.vue** - 扩展功能示例（render 和 slot）
4. **playground/src/views/table/data-sharing/index.vue** - 数据共享示例

### 路由配置

#### playground/src/router/modules/table.ts

```typescript
export const tableRouteMeta = {
  // Table 父菜单（不在侧边栏显示，仅用于获取中文标题，但需要 order 值用于排序）
  '/table': { title: '表格', showInSidebar: false, order: 6 },
  // 基础示例 (order: 1) - 入门必看
  '/table/basic': { title: '基础示例', showInSidebar: true, order: 1 },
  '/table/basic/index': { title: '基础用法', description: 'WTable 基础用法', showInSidebar: true, order: 1 },
  // el-table 原生功能 (order: 2)
  '/table/native': { title: 'el-table 原生功能', showInSidebar: true, order: 2 },
  '/table/native/index': { title: '原生功能示例', description: 'el-table 原生属性、事件、插槽', showInSidebar: true, order: 1 },
  // 扩展功能 (order: 3)
  '/table/extended': { title: '扩展功能', showInSidebar: true, order: 3 },
  '/table/extended/index': { title: '扩展功能示例', description: 'render 函数和 slots 使用', showInSidebar: true, order: 1 },
  // 数据共享 (order: 4)
  '/table/data-sharing': { title: '数据共享', showInSidebar: true, order: 4 },
  '/table/data-sharing/index': { title: '数据共享示例', description: '插槽间数据共享', showInSidebar: true, order: 1 },
} as const
```

#### playground/src/router/modules/index.ts

```typescript
/**
 * 路由模块聚合导出
 */
export * from './check-tag'
export * from './dialog'
export * from './drawer'
export * from './form'
export * from './tag'
export * from './table'  // 新增
```

#### playground/src/router/index.ts

```typescript
import { checkTagRouteMeta, dialogRouteMeta, drawerRouteMeta, formRouteMeta, tagRouteMeta, tableRouteMeta } from './modules'

const routeMetaMap: Record<string, RouteMetaConfig> = {
  '/': { title: '首页', showInSidebar: true },
  '/error/404': { title: '404 - 页面未找到', showInSidebar: false },
  ...formRouteMeta,
  ...tagRouteMeta,
  ...checkTagRouteMeta,
  ...dialogRouteMeta,
  ...drawerRouteMeta,
  ...tableRouteMeta,  // 新增
}
```

### Playground 示例文件内容

#### 1. playground/src/views/table/basic/index.vue

```vue
<script setup lang="ts">
import { WTable } from '@iswangh/element-plus-kit'
import type { TableColumn } from '@iswangh/element-plus-kit'
import { ElButton } from 'element-plus'

const columns: TableColumn[] = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', sortable: true },
  { prop: 'email', label: '邮箱' },
]

const tableData = [
  { name: '张三', age: 20, email: 'zhangsan@example.com' },
  { name: '李四', age: 25, email: 'lisi@example.com' },
  { name: '王五', age: 30, email: 'wangwu@example.com' },
]
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          WTable 基础用法
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              通过配置 <code>columns</code> 数组快速生成表格，支持所有 <code>el-table</code> 和 <code>el-table-column</code> 的原生属性。
            </p>
          </template>
        </el-alert>
        <WTable :columns="columns" :data="tableData" stripe border />
      </el-space>
    </el-card>
  </el-space>
</template>
```

#### 2. playground/src/views/table/native/index.vue

```vue
<script setup lang="ts">
import { WTable } from '@iswangh/element-plus-kit'
import type { TableColumn } from '@iswangh/element-plus-kit'
import { ElButton, ElMessage } from 'element-plus'
import { ref } from 'vue'

const columns: TableColumn[] = [
  { prop: 'name', label: '姓名', width: '120px' },
  { prop: 'age', label: '年龄', sortable: true, width: '100px' },
  { prop: 'email', label: '邮箱' },
]

const tableData = ref([
  { name: '张三', age: 20, email: 'zhangsan@example.com' },
  { name: '李四', age: 25, email: 'lisi@example.com' },
  { name: '王五', age: 30, email: 'wangwu@example.com' },
])

const selectedRows = ref([])
const tableRef = ref<InstanceType<typeof WTable>>()

function handleSelectionChange(selection: any[]) {
  selectedRows.value = selection
  ElMessage.success(`已选择 ${selection.length} 行`)
}

function handleSortChange({ column, prop, order }: any) {
  ElMessage.info(`排序：${prop} - ${order}`)
}
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          el-table 原生功能示例
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              <code>WTable</code> 完全支持 <code>el-table</code> 的所有原生属性、事件和插槽，直接透传，无需额外配置。
            </p>
          </template>
        </el-alert>
        <WTable
          ref="tableRef"
          :columns="columns"
          :data="tableData"
          stripe
          border
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        />
        
        <div>
          <ElButton @click="tableRef?.clearSelection()">清空选择</ElButton>
          <ElButton @click="tableRef?.toggleAllSelection()">切换全选</ElButton>
        </div>
      </el-space>
    </el-card>
  </el-space>
</template>
```

#### 3. playground/src/views/table/extended/index.vue

```vue
<script setup lang="ts">
import { WTable } from '@iswangh/element-plus-kit'
import type { TableColumn } from '@iswangh/element-plus-kit'
import { ElButton, ElTag } from 'element-plus'
import { h } from 'vue'

const columns: TableColumn[] = [
  { prop: 'name', label: '姓名', width: '120px' },
  { prop: 'age', label: '年龄', sortable: true, width: '100px' },
  {
    prop: 'status',
    label: '状态（render 函数）',
    render: ({ row }) => {
      const type = row.status === 'active' ? 'success' : 'danger'
      return h(ElTag, { type }, () => row.status === 'active' ? '启用' : '禁用')
    },
  },
  {
    prop: 'actions',
    label: '操作（slots）',
    width: '200px',
    fixed: 'right',
    slots: {
      default: ({ row }) => h('div', [
        h(ElButton, { size: 'small', onClick: () => handleEdit(row) }, '编辑'),
        h(ElButton, { size: 'small', type: 'danger', onClick: () => handleDelete(row) }, '删除'),
      ]),
    },
  },
]

const tableData = [
  { name: '张三', age: 20, status: 'active' },
  { name: '李四', age: 25, status: 'inactive' },
  { name: '王五', age: 30, status: 'active' },
]

function handleEdit(row: any) {
  console.log('编辑', row)
}

function handleDelete(row: any) {
  console.log('删除', row)
}
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          扩展功能示例
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              <code>WTable</code> 支持 <code>render</code> 函数和 <code>slots</code> 对象两种方式自定义列内容。
            </p>
          </template>
        </el-alert>
        <WTable :columns="columns" :data="tableData" stripe border>
          <template #actions="{ row }">
            <ElButton size="small" @click="handleEdit(row)">编辑</ElButton>
            <ElButton size="small" type="danger" @click="handleDelete(row)">删除</ElButton>
          </template>
        </WTable>
      </el-space>
    </el-card>
  </el-space>
</template>
```

#### 4. playground/src/views/table/data-sharing/index.vue

```vue
<script setup lang="ts">
import { WTable } from '@iswangh/element-plus-kit'
import type { TableColumn } from '@iswangh/element-plus-kit'
import { ElButton } from 'element-plus'
import { ref } from 'vue'

const columns: TableColumn[] = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  {
    prop: 'actions',
    label: '操作',
    slots: {
      default: ({ row }) => h('div', [
        h(ElButton, { size: 'small', onClick: () => handleEdit(row) }, '编辑'),
        h(ElButton, { size: 'small', type: 'danger', onClick: () => handleDelete(row) }, '删除'),
      ]),
    },
  },
]

const tableData = ref([
  { name: '张三', age: 20 },
  { name: '李四', age: 25 },
])

const editRow = ref<any>(null)

function handleEdit(row: any) {
  editRow.value = row
  console.log('编辑', row)
}
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          数据共享示例
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              使用 <code>slots</code> 配置对象时，可以通过作用域参数访问行数据，实现数据共享。
            </p>
          </template>
        </el-alert>
        <WTable :columns="columns" :data="tableData" stripe border />
        <div v-if="editRow">
          <p>当前编辑行：{{ editRow.name }}</p>
        </div>
      </el-space>
    </el-card>
  </el-space>
</template>
```

---

## Kit 包集成

### 需要更新的文件

#### 1. packages/kit/src/index.ts

```typescript
export * from './utils'

export * from '@iswangh/element-plus-kit-dialog'
export type * from '@iswangh/element-plus-kit-dialog'

export * from '@iswangh/element-plus-kit-drawer'
export type * from '@iswangh/element-plus-kit-drawer'

export * from '@iswangh/element-plus-kit-form'
export type * from '@iswangh/element-plus-kit-form'

export * from '@iswangh/element-plus-kit-tag'
export type * from '@iswangh/element-plus-kit-tag'

export * from '@iswangh/element-plus-kit-table'  // 新增
export type * from '@iswangh/element-plus-kit-table'  // 新增
```

#### 2. packages/kit/package.json

```json
{
  "dependencies": {
    "@iswangh/element-plus-kit-dialog": "workspace:*",
    "@iswangh/element-plus-kit-drawer": "workspace:*",
    "@iswangh/element-plus-kit-form": "workspace:*",
    "@iswangh/element-plus-kit-tag": "workspace:*",
    "@iswangh/element-plus-kit-table": "workspace:*"  // 新增
  }
}
```

#### 3. packages/kit/vite.config.ts

```typescript
rollupOptions: {
  external: [
    'vue',
    'element-plus',
    '@iswangh/element-plus-kit-core',
    '@iswangh/element-plus-kit-form',
    '@iswangh/element-plus-kit-tag',
    '@iswangh/element-plus-kit-dialog',
    '@iswangh/element-plus-kit-drawer',
    '@iswangh/element-plus-kit-table',  // 新增
  ],
}
```

#### 4. packages/kit/tsconfig.json

```json
{
  "references": [
    { "path": "../form" },
    { "path": "../tag" },
    { "path": "../dialog" },
    { "path": "../drawer" },
    { "path": "../table" }  // 新增
  ]
}
```

#### 5. tsconfig.json（根目录）

```json
{
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/dialog" },
    { "path": "./packages/drawer" },
    { "path": "./packages/form" },
    { "path": "./packages/kit" },
    { "path": "./packages/tag" },
    { "path": "./packages/table" }  // 新增
  ]
}
```

---

## 文档站点配置

### 需要更新的文件

#### 1. docs/.vitepress/config.ts

```typescript
sidebar: {
  '/components/': [
    {
      text: '组件',
      items: [
        { text: 'Form 表单', link: '/components/form/' },
        { text: 'Tag 标签', link: '/components/tag/' },
        { text: 'CheckTag 可选标签', link: '/components/check-tag/' },
        { text: 'Dialog 弹窗', link: '/components/dialog/' },
        { text: 'Drawer 抽屉', link: '/components/drawer/' },
        { text: 'Table 表格', link: '/components/table/' },  // 新增
      ],
    },
  ],
}

// optimizeDeps.include
optimizeDeps: {
  include: [
    '@iswangh/element-plus-kit-dialog',
    '@iswangh/element-plus-kit-drawer',
    '@iswangh/element-plus-kit-table',  // 新增
  ],
}

// ssr.noExternal
ssr: {
  noExternal: [
    '@iswangh/element-plus-kit-dialog',
    '@iswangh/element-plus-kit-drawer',
    '@iswangh/element-plus-kit-table',  // 新增
  ],
}
```

### 需要创建的文档文件

#### docs/components/table/index.md

```markdown
# Table 表格

基于 Element Plus Table 的封装组件，提供配置化列定义。

## 基础用法

通过配置 `columns` 数组快速生成表格。

:::demo

\`\`\`vue
<script setup lang="ts">
import { WTable } from '@iswangh/element-plus-kit'
import type { TableColumn } from '@iswangh/element-plus-kit'

const columns: TableColumn[] = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', sortable: true },
]

const tableData = [
  { name: '张三', age: 20 },
  { name: '李四', age: 25 },
]
</script>

<template>
  <WTable :columns="columns" :data="tableData" />
</template>
\`\`\`

:::

## columns 配置

`columns` 数组支持所有 `el-table-column` 的属性，同时支持 `render` 函数和 `slots` 对象配置插槽。`render` 函数等价于 `slots.default`，都用于渲染列内容（default 插槽）。

### render 函数

使用 `render` 函数自定义列内容。

:::demo

\`\`\`vue
<script setup lang="ts">
import { WTable } from '@iswangh/element-plus-kit'
import type { TableColumn } from '@iswangh/element-plus-kit'
import { ElTag } from 'element-plus'
import { h } from 'vue'

const columns: TableColumn[] = [
  { prop: 'name', label: '姓名' },
  {
    prop: 'status',
    label: '状态',
    render: ({ row }) => {
      const type = row.status === 'active' ? 'success' : 'danger'
      return h(ElTag, { type }, () => row.status === 'active' ? '启用' : '禁用')
    },
  },
]

const tableData = [
  { name: '张三', status: 'active' },
  { name: '李四', status: 'inactive' },
]
</script>

<template>
  <WTable :columns="columns" :data="tableData" />
</template>
\`\`\`

:::

### 使用模板插槽

支持两种模板插槽方式：

#### 方式一：使用列的 prop 作为插槽名称（default 插槽）

当列未配置 `render` 和 `slots.default` 时，可以使用列的 `prop` 作为插槽名称。

:::demo

\`\`\`vue
<script setup lang="ts">
import { WTable } from '@iswangh/element-plus-kit'
import type { TableColumn } from '@iswangh/element-plus-kit'
import { ElButton } from 'element-plus'

const columns: TableColumn[] = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'actions', label: '操作' },  // 不配置 render 和 slots，使用模板插槽
]

const tableData = [
  { name: '张三', age: 20 },
  { name: '李四', age: 25 },
]
</script>

<template>
  <WTable :columns="columns" :data="tableData">
    <!-- 使用列的 prop 作为插槽名称（default 插槽） -->
    <template #actions="{ row }">
      <ElButton size="small">编辑</ElButton>
      <ElButton size="small" type="danger">删除</ElButton>
    </template>
  </WTable>
</template>
\`\`\`

:::

#### 方式二：使用前缀匹配（支持所有插槽）

使用 `${prop}-${slotName}` 格式的插槽名称，可以同时支持 default、header 等所有插槽。

:::demo

\`\`\`vue
<script setup lang="ts">
import { WTable } from '@iswangh/element-plus-kit'
import type { TableColumn } from '@iswangh/element-plus-kit'
import { ElTag } from 'element-plus'

const columns: TableColumn[] = [
  { prop: 'name', label: '姓名' },
  {
    prop: 'status',
    label: '状态',
    // 不配置 render 和 slots，使用模板插槽
  },
]

const tableData = [
  { name: '张三', status: 'active' },
  { name: '李四', status: 'inactive' },
]
</script>

<template>
  <WTable :columns="columns" :data="tableData">
    <!-- 使用前缀匹配：status-default（列内容插槽） -->
    <template #status-default="{ row }">
      <ElTag :type="row.status === 'active' ? 'success' : 'danger'">
        {{ row.status === 'active' ? '启用' : '禁用' }}
      </ElTag>
    </template>
    
    <!-- 使用前缀匹配：status-header（表头插槽） -->
    <template #status-header="{ column }">
      <strong>{{ column.label }}</strong>
    </template>
  </WTable>
</template>
\`\`\`

:::

#### 方式三：配置插槽与模板插槽混合使用

配置插槽优先级高于模板插槽。如果配置了 `slots.default`，则不会使用模板插槽 `#{prop}-default`。

:::demo

\`\`\`vue
<script setup lang="ts">
import { WTable } from '@iswangh/element-plus-kit'
import type { TableColumn } from '@iswangh/element-plus-kit'
import { ElButton } from 'element-plus'
import { h } from 'vue'

const columns: TableColumn[] = [
  { prop: 'name', label: '姓名' },
  {
    prop: 'actions',
    label: '操作',
    slots: {
      default: ({ row }) => h(ElButton, { size: 'small' }, '编辑'),  // 配置插槽
    },
  },
]

const tableData = [
  { name: '张三' },
  { name: '李四' },
]
</script>

<template>
  <WTable :columns="columns" :data="tableData">
    <!-- 配置插槽优先级高，此模板插槽不会生效 -->
    <template #actions-default="{ row }">
      <ElButton size="small" type="danger">删除</ElButton>
    </template>
    
    <!-- 但可以使用模板插槽配置 header -->
    <template #actions-header="{ column }">
      <strong>{{ column.label }}</strong>
    </template>
  </WTable>
</template>
\`\`\`

:::

## API

### Props

WTable 组件继承所有 Element Plus Table 的属性，详情请参考 [Element Plus Table 文档](https://element-plus.org/zh-CN/component/table.html)。

**拓展属性**：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 列配置数组 | `TableColumn[]` | - |

### TableColumn

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| prop | 列属性名（对应数据字段） | `string` | - |
| label | 列标题 | `string` | - |
| render | 自定义渲染函数（等价于 slots.default，用于渲染列内容） | `(scope: { row: any, column: any, $index: number }) => VNode` | - |
| slots | 插槽配置对象 | `{ default?: (scope) => VNode, header?: (scope) => VNode }` | - |

**Element Plus TableColumn 属性**：TableColumn 继承所有 `el-table-column` 的属性，如 `width`、`minWidth`、`fixed`、`sortable`、`filterable` 等。

**插槽说明**：
- `render` 函数：等价于 `slots.default`，用于渲染列内容（`el-table-column` 的 default 插槽）
- `slots.default`：列内容插槽，等价于 `render` 函数，对应 `el-table-column` 的默认插槽
- `slots.header`：表头插槽，对应 `el-table-column` 的 `header` 插槽
- **模板插槽支持**（参考 form 包）：
  - 方式一：使用列的 `prop` 作为插槽名称（`#{prop}`），用于 default 插槽
  - 方式二：使用前缀匹配（`#{prop}-${slotName}`），支持所有插槽（如 `#{prop}-default`、`#{prop}-header`）
  - 优先级：配置插槽（`render`、`slots`）> 模板插槽

**注意**：
- `render` 和 `slots.default` 是等价的，都用于渲染列内容。如果同时配置，`render` 优先级更高
- 配置插槽优先级高于模板插槽。如果配置了 `slots.default`，则不会使用模板插槽 `#{prop}-default`

## 🔗 相关链接

- [主包文档](../../kit/README.md)
- [Element Plus Table 文档](https://element-plus.org/zh-CN/component/table.html)
```

---

## 实现优先级

### P0（必须实现）

1. ✅ 配置化列定义（`columns` 属性）
2. ✅ 支持 `render` 函数
3. ✅ 支持 `slots` 对象配置插槽
4. ✅ 类型继承（不额外定义）
5. ✅ 属性/事件/插槽透传

### P1（集成相关）

6. ✅ Kit 包集成（导出和依赖）
7. ✅ Playground 示例（基础、原生、扩展、数据共享）
8. ✅ 路由配置
9. ✅ 文档站点配置

---
