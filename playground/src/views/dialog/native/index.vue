<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit-dialog'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { h, ref } from 'vue'

const dialog = useDialog()

// 示例1：基础属性
const { modelValue: basicVisible } = dialog.use({
  title: '基础属性示例',
  width: '500px',
  content: '这是使用 el-dialog 原生属性创建的弹窗。支持 width、title、close-on-click-modal 等所有原生属性。',
})

// 示例2：关闭行为控制
const { modelValue: closeBehaviorVisible } = dialog.use({
  title: '关闭行为控制',
  width: '500px',
  content: '这个弹窗设置了 close-on-click-modal="false"，点击遮罩层不会关闭。',
  closeOnClickModal: false,
  closeOnPressEscape: true,
})

// 示例3：destroy-on-close
const { modelValue: destroyVisible } = dialog.use({
  title: 'destroy-on-close',
  width: '500px',
  content: '这个弹窗设置了 destroy-on-close="true"，关闭时会销毁 DOM。',
  destroyOnClose: true,
})

// 示例4：beforeClose 钩子
// 注意：需要获取 zIndex 以确保 MessageBox 的层级高于 dialog
const { modelValue: beforeCloseVisible, zIndex: beforeCloseZIndex } = dialog.use({
  title: 'beforeClose 钩子',
  width: '500px',
  content: '关闭前会触发 beforeClose 钩子，可以阻止关闭。',
  // 注意：beforeClose 接收 done 回调函数，不接收 instance 参数
  // 如果需要访问 instance，通过闭包访问（从 dialog.use() 解构的变量）
  beforeClose: async (done) => {
    try {
      // 确保 MessageBox 的 z-index 比当前 dialog 更高
      // 注意：ElMessageBox 的类型定义可能不包含 zIndex，但实际支持
      // 使用类型断言来设置 zIndex（Element Plus 内部支持，但类型定义可能不完整）
      await ElMessageBox.confirm('确定要关闭吗？', '提示', {
        type: 'warning',
        zIndex: beforeCloseZIndex.value + 1,
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
const { modelValue: openedVisible } = dialog.use({
  title: 'onOpened 事件',
  width: '500px',
  content: () => h('div', [
    h('p', `弹窗已打开 ${openedCount.value} 次`),
  ]),
  onOpened: () => {
    openedCount.value++
    ElMessage.success('onOpened 事件已触发')
  },
})

// 示例6：onClosed 事件
const closedCount = ref(0)
const { modelValue: closedVisible } = dialog.use({
  title: 'onClosed 事件',
  width: '500px',
  content: () => h('div', [
    h('p', `弹窗已关闭 ${closedCount.value} 次`),
  ]),
  onClosed: () => {
    closedCount.value++
    ElMessage.success('onClosed 事件已触发')
  },
})

// 示例7：插槽使用
const { modelValue: slotsVisible } = dialog.use({
  width: '500px',
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

// 示例8：全屏弹窗
const { modelValue: fullscreenVisible } = dialog.use({
  title: '全屏弹窗',
  fullscreen: true,
  content: '这是一个全屏弹窗，设置了 fullscreen="true"。',
})

// 示例9：居中布局
const { modelValue: centerVisible } = dialog.use({
  title: '居中布局',
  width: '500px',
  center: true,
  content: '这个弹窗设置了 center="true"，内容居中显示。',
})
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          el-dialog 原生功能示例
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              <code>useDialog</code> 完全支持 <code>el-dialog</code> 的所有原生属性、事件和插槽，直接透传，无需额外配置。
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
          <span class="text-base font-semibold">全屏弹窗</span>
        </el-divider>
        <div>
          <ElButton type="primary" @click="fullscreenVisible = true">
            全屏弹窗
          </ElButton>
        </div>

        <el-divider content-position="left">
          <span class="text-base font-semibold">居中布局</span>
        </el-divider>
        <div>
          <ElButton type="primary" @click="centerVisible = true">
            居中布局
          </ElButton>
        </div>
      </el-space>
    </el-card>
  </el-space>
</template>
