<script setup lang="ts">
import { useDrawer } from '@iswangh/element-plus-kit'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { h, ref } from 'vue'

const drawer = useDrawer()

// 示例1：基础属性
const { modelValue: basicVisible } = drawer.use({
  title: '基础属性示例',
  size: '500px',
  content: '这是使用 el-drawer 原生属性创建的抽屉。支持 size、title、direction 等所有原生属性。',
})

// 示例2：关闭行为控制
const { modelValue: closeBehaviorVisible } = drawer.use({
  title: '关闭行为控制',
  size: '500px',
  content: '这个抽屉设置了 close-on-click-modal="false"，点击遮罩层不会关闭。',
  closeOnClickModal: false,
  closeOnPressEscape: true,
})

// 示例3：destroy-on-close
const { modelValue: destroyVisible } = drawer.use({
  title: 'destroy-on-close',
  size: '500px',
  content: '这个抽屉设置了 destroy-on-close="true"，关闭时会销毁 DOM。',
  destroyOnClose: true,
})

// 示例4：beforeClose 钩子
const { modelValue: beforeCloseVisible } = drawer.use({
  title: 'beforeClose 钩子',
  size: '500px',
  content: '关闭前会触发 beforeClose 钩子，可以阻止关闭。',
  beforeClose: async (done) => {
    try {
      await ElMessageBox.confirm('确定要关闭吗？', '提示', {
        type: 'warning',
        zIndex: 3000,
      } as Parameters<typeof ElMessageBox.confirm>[2] & { zIndex?: number })
      done()
    }
    catch {
      // 用户取消，不关闭
    }
  },
})

// 示例5：onOpened 事件
const openedCount = ref(0)
const { modelValue: openedVisible } = drawer.use({
  title: 'onOpened 事件',
  size: '500px',
  content: () => h('div', [
    h('p', `抽屉已打开 ${openedCount.value} 次`),
  ]),
  onOpened: () => {
    openedCount.value++
    ElMessage.success('onOpened 事件已触发')
  },
})

// 示例6：onClosed 事件
const closedCount = ref(0)
const { modelValue: closedVisible } = drawer.use({
  title: 'onClosed 事件',
  size: '500px',
  content: () => h('div', [
    h('p', `抽屉已关闭 ${closedCount.value} 次`),
  ]),
  onClosed: () => {
    closedCount.value++
    ElMessage.success('onClosed 事件已触发')
  },
})

// 示例7：插槽使用
const { modelValue: slotsVisible } = drawer.use({
  size: '500px',
  slots: {
    header: () => h('div', { style: { color: '#409EFF', fontWeight: 'bold' } }, '自定义 Header'),
    default: () => h('div', [
      h('p', '这是 default 插槽的内容'),
      h('p', '支持使用渲染函数自定义内容'),
    ]),
    footer: () => h('div', { style: { textAlign: 'right' } }, [
      h(ElButton, { onClick: () => { slotsVisible.value = false } }, () => '关闭'),
    ]),
  },
})

// 示例8：size 控制（测试滚动效果）
const { modelValue: sizeSmallVisible } = drawer.use({
  title: 'size 控制 - 小尺寸（300px）',
  size: '300px',
  content: () => h('div', Array.from({ length: 50 }, (_, i) => h('p', { style: { margin: '8px 0' } }, `这是第 ${i + 1} 行内容，用于测试滚动效果。当内容超出抽屉高度时，会自动显示滚动条。`))),
})

const { modelValue: sizeMediumVisible } = drawer.use({
  title: 'size 控制 - 中等尺寸（500px）',
  size: '500px',
  content: () => h('div', Array.from({ length: 50 }, (_, i) => h('p', { style: { margin: '8px 0' } }, `这是第 ${i + 1} 行内容，用于测试滚动效果。当内容超出抽屉高度时，会自动显示滚动条。`))),
})

const { modelValue: sizeLargeVisible } = drawer.use({
  title: 'size 控制 - 大尺寸（800px）',
  size: '800px',
  content: () => h('div', Array.from({ length: 50 }, (_, i) => h('p', { style: { margin: '8px 0' } }, `这是第 ${i + 1} 行内容，用于测试滚动效果。当内容超出抽屉高度时，会自动显示滚动条。`))),
})

const { modelValue: sizePercentVisible } = drawer.use({
  title: 'size 控制 - 百分比（50%）',
  size: '50%',
  content: () => h('div', Array.from({ length: 100 }, (_, i) => h('p', { style: { margin: '8px 0' } }, `这是第 ${i + 1} 行内容，用于测试滚动效果。使用百分比单位时，抽屉大小会根据视口大小自适应。`))),
})

// 示例9：不同方向
const { modelValue: directionRtlVisible } = drawer.use({
  title: '从右侧滑出',
  size: '400px',
  direction: 'rtl',
  content: '这个抽屉从右侧滑出（direction=rtl）。',
})

const { modelValue: directionLtrVisible } = drawer.use({
  title: '从左侧滑出',
  size: '400px',
  direction: 'ltr',
  content: '这个抽屉从左侧滑出（direction=ltr）。',
})

const { modelValue: directionTtbVisible } = drawer.use({
  title: '从上侧滑出',
  size: '400px',
  direction: 'ttb',
  content: '这个抽屉从上侧滑出（direction=ttb）。',
})

const { modelValue: directionBttVisible } = drawer.use({
  title: '从下侧滑出',
  size: '400px',
  direction: 'btt',
  content: '这个抽屉从下侧滑出（direction=btt）。',
})
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          el-drawer 原生功能示例
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              <code>useDrawer</code> 完全支持 <code>el-drawer</code> 的所有原生属性、事件和插槽，直接透传，无需额外配置。
            </p>
          </template>
        </el-alert>

        <el-divider content-position="left">
          <span class="text-base font-semibold">基础属性</span>
        </el-divider>
        <div>
          <ElButton type="primary" @click="basicVisible = true">
            基础属性示例
          </ElButton>
        </div>

        <el-divider content-position="left">
          <span class="text-base font-semibold">关闭行为控制</span>
        </el-divider>
        <div>
          <ElButton type="primary" @click="closeBehaviorVisible = true">
            关闭行为控制
          </ElButton>
        </div>

        <el-divider content-position="left">
          <span class="text-base font-semibold">destroy-on-close</span>
        </el-divider>
        <div>
          <ElButton type="primary" @click="destroyVisible = true">
            destroy-on-close
          </ElButton>
        </div>

        <el-divider content-position="left">
          <span class="text-base font-semibold">beforeClose 钩子</span>
        </el-divider>
        <div>
          <ElButton type="primary" @click="beforeCloseVisible = true">
            beforeClose 钩子
          </ElButton>
        </div>

        <el-divider content-position="left">
          <span class="text-base font-semibold">onOpened 事件</span>
        </el-divider>
        <div>
          <ElButton type="primary" @click="openedVisible = true">
            onOpened 事件
          </ElButton>
        </div>

        <el-divider content-position="left">
          <span class="text-base font-semibold">onClosed 事件</span>
        </el-divider>
        <div>
          <ElButton type="primary" @click="closedVisible = true">
            onClosed 事件
          </ElButton>
        </div>

        <el-divider content-position="left">
          <span class="text-base font-semibold">插槽使用</span>
        </el-divider>
        <div>
          <ElButton type="primary" @click="slotsVisible = true">
            插槽使用（header、footer、default）
          </ElButton>
        </div>

        <el-divider content-position="left">
          <span class="text-base font-semibold">size 控制（测试滚动效果）</span>
        </el-divider>
        <el-space wrap>
          <ElButton type="primary" @click="sizeSmallVisible = true">
            小尺寸（300px）
          </ElButton>
          <ElButton type="primary" @click="sizeMediumVisible = true">
            中等尺寸（500px）
          </ElButton>
          <ElButton type="primary" @click="sizeLargeVisible = true">
            大尺寸（800px）
          </ElButton>
          <ElButton type="primary" @click="sizePercentVisible = true">
            百分比（50%）
          </ElButton>
        </el-space>
        <p class="text-sm text-gray-500 mt-2">
          展示 <code>size</code> 属性的不同值：固定像素值（如 <code>300px</code>、<code>500px</code>、<code>800px</code>）和百分比值（如 <code>50%</code>）。当内容超出抽屉高度时，会自动显示滚动条。
        </p>

        <el-divider content-position="left">
          <span class="text-base font-semibold">不同方向</span>
        </el-divider>
        <el-space wrap>
          <ElButton type="primary" @click="directionRtlVisible = true">
            从右侧滑出
          </ElButton>
          <ElButton type="primary" @click="directionLtrVisible = true">
            从左侧滑出
          </ElButton>
          <ElButton type="primary" @click="directionTtbVisible = true">
            从上侧滑出
          </ElButton>
          <ElButton type="primary" @click="directionBttVisible = true">
            从下侧滑出
          </ElButton>
        </el-space>
        <p class="text-sm text-gray-500 mt-2">
          展示 <code>direction</code> 属性的不同值：<code>rtl</code>（右侧）、<code>ltr</code>（左侧）、<code>ttb</code>（上侧）、<code>btt</code>（下侧）。
        </p>
      </el-space>
    </el-card>
  </el-space>
</template>
