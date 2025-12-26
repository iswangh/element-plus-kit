<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit-dialog'
import { ElButton, ElMessage } from 'element-plus'
import { defineComponent, h } from 'vue'

const dialog = useDialog()

// 示例1：content 属性（字符串）
const { modelValue: contentStringVisible } = dialog.use({
  title: 'content 属性 - 字符串',
  width: '500px',
  content: '这是使用 content 属性传入的字符串内容。',
})

// 示例2：content 属性（渲染函数返回字符串）
const { modelValue: contentFunctionStringVisible } = dialog.use({
  title: 'content 属性 - 函数返回字符串',
  width: '500px',
  content: () => `当前时间: ${new Date().toLocaleString()}`,
})

// 示例3：content 属性（渲染函数返回 VNode）
const { modelValue: contentFunctionVNodeVisible, id: contentFunctionVNodeId } = dialog.use({
  title: 'content 属性 - 函数返回 VNode',
  width: '500px',
  content: () => h('div', [
    h('p', { style: { color: '#409EFF' } }, '这是使用 h() 函数创建的 VNode'),
    h('p', `弹窗 ID: ${contentFunctionVNodeId}`),
  ]),
})

// 示例3.1：content 属性（渲染函数返回 Component）
const ContentComponent = defineComponent({
  props: {
    message: {
      type: String,
      default: '这是自定义组件',
    },
  },
  setup(props) {
    return () => h('div', { style: { padding: '16px', backgroundColor: '#F5F7FA', borderRadius: '4px' } }, [
      h('p', { style: { fontWeight: 'bold' } }, props.message),
      h('p', { style: { color: '#909399', fontSize: '12px' } }, '这是通过 content 属性传入的自定义组件'),
    ])
  },
})

const { modelValue: contentComponentVisible } = dialog.use({
  title: 'content 属性 - 函数返回 Component',
  width: '500px',
  content: () => ContentComponent,
})

// 示例4：全局 loading
const { modelValue: globalLoadingVisible, loading: globalLoading } = dialog.use({
  title: '全局 Loading',
  width: '500px',
  content: '这个弹窗展示了全局 loading 功能，loading 遮罩层只作用在内容区域。',
})

function handleGlobalLoading() {
  globalLoadingVisible.value = true
  globalLoading.value = true
  setTimeout(() => {
    globalLoading.value = false
    ElMessage.success('数据加载完成')
  }, 2000)
}

// 示例5：自定义 loadingProps
const { modelValue: customLoadingVisible, loading: customLoading } = dialog.use({
  title: '自定义 Loading 配置',
  width: '500px',
  content: '这个弹窗展示了自定义 loadingProps 功能。',
  loadingProps: {
    text: '正在加载数据...',
    background: 'rgba(0, 0, 0, 0.7)',
  },
})

function handleCustomLoading() {
  customLoadingVisible.value = true
  customLoading.value = true
  setTimeout(() => {
    customLoading.value = false
    ElMessage.success('数据加载完成')
  }, 2000)
}

// 示例6：scrollbarProps
const { modelValue: scrollbarVisible } = dialog.use({
  title: 'scrollbarProps 配置',
  width: '500px',
  scrollbarProps: {
    maxHeight: '300px',
  },
  content: () => h('div', Array.from({ length: 20 }, (_, i) => h('p', `这是第 ${i + 1} 行内容，用于测试滚动功能。`))),
})

// 示例6.1：scrollbarProps（包含头部、底部、内容）
const { modelValue: scrollbarFullVisible } = dialog.use({
  width: '500px',
  scrollbarProps: {
    maxHeight: '300px',
  },
  slots: {
    header: () => h('div', [
      h('h3', { style: { margin: 0, fontWeight: 'bold', color: '#409EFF' } }, '弹窗标题'),
      h('p', { style: { margin: '8px 0 0', fontSize: '12px', color: '#909399' } }, '这是头部区域，用于展示标题和说明信息'),
    ]),
    default: () => h('div', Array.from({ length: 20 }, (_, i) => h('p', { style: { margin: '8px 0' } }, `这是第 ${i + 1} 行内容，用于测试滚动功能。当内容超过 maxHeight 时，会出现滚动条。`))),
    footer: () => h('div', [
      h(ElButton, {
        onClick: () => {
          scrollbarFullVisible.value = false
        },
      }, () => '取消'),
      h(ElButton, {
        type: 'primary',
        onClick: () => {
          ElMessage.success('确认操作')
          scrollbarFullVisible.value = false
        },
      }, () => '确认'),
    ]),
  },
})

// 示例7：按钮 loading
const { modelValue: buttonLoadingVisible, buttonLoadings: buttonLoadingButtonLoadings } = dialog.use({
  title: '按钮 Loading',
  width: '500px',
  content: '这个弹窗展示了按钮级别的 loading 功能。',
  slots: {
    footer: () => h('div', { style: { textAlign: 'right' } }, [
      h(ElButton, {
        loading: buttonLoadingButtonLoadings.value.cancel,
        onClick: async () => {
          buttonLoadingButtonLoadings.value.cancel = true
          await new Promise(resolve => setTimeout(resolve, 2000))
          buttonLoadingButtonLoadings.value.cancel = false
          ElMessage.success('取消操作完成')
        },
      }, () => '取消'),
      h(ElButton, {
        type: 'primary',
        loading: buttonLoadingButtonLoadings.value.confirm,
        onClick: async () => {
          buttonLoadingButtonLoadings.value.confirm = true
          await new Promise(resolve => setTimeout(resolve, 2000))
          buttonLoadingButtonLoadings.value.confirm = false
          ElMessage.success('确认操作完成')
        },
      }, () => '确认'),
    ]),
  },
})

// 示例8：使用 confirmLoading 和 cancelLoading 快捷方式
const { modelValue: quickLoadingVisible, cancelLoading: quickCancelLoading, confirmLoading: quickConfirmLoading } = dialog.use({
  title: '按钮 Loading 快捷方式',
  width: '500px',
  content: '这个弹窗展示了使用 confirmLoading 和 cancelLoading 快捷方式。',
  slots: {
    footer: () => h('div', { style: { textAlign: 'right' } }, [
      h(ElButton, {
        loading: quickCancelLoading.value,
        onClick: async () => {
          quickCancelLoading.value = true
          await new Promise(resolve => setTimeout(resolve, 2000))
          quickCancelLoading.value = false
          ElMessage.success('取消操作完成')
        },
      }, () => '取消'),
      h(ElButton, {
        type: 'primary',
        loading: quickConfirmLoading.value,
        onClick: async () => {
          quickConfirmLoading.value = true
          await new Promise(resolve => setTimeout(resolve, 2000))
          quickConfirmLoading.value = false
          ElMessage.success('确认操作完成')
        },
      }, () => '确认'),
    ]),
  },
})
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
              <code>useDialog</code> 在 <code>el-dialog</code> 基础上扩展了以下功能：<code>content</code>、<code>loading</code>、<code>buttonLoadings</code>、<code>scrollbarProps</code>、<code>loadingProps</code>。
            </p>
          </template>
        </el-alert>

        <el-divider content-position="left">
          <span class="text-base font-semibold">content 属性</span>
        </el-divider>
        <el-space>
          <ElButton type="primary" @click="contentStringVisible = true">
            字符串内容
          </ElButton>
          <ElButton type="primary" @click="contentFunctionStringVisible = true">
            函数返回字符串
          </ElButton>
          <ElButton type="primary" @click="contentFunctionVNodeVisible = true">
            函数返回 VNode
          </ElButton>
          <ElButton type="primary" @click="contentComponentVisible = true">
            函数返回 Component
          </ElButton>
        </el-space>

        <el-divider content-position="left">
          <span class="text-base font-semibold">全局 Loading</span>
        </el-divider>
        <div>
          <ElButton type="primary" @click="handleGlobalLoading">
            全局 Loading（默认配置）
          </ElButton>
        </div>

        <el-divider content-position="left">
          <span class="text-base font-semibold">自定义 Loading 配置</span>
        </el-divider>
        <div>
          <ElButton type="primary" @click="handleCustomLoading">
            自定义 Loading（loadingProps）
          </ElButton>
        </div>

        <el-divider content-position="left">
          <span class="text-base font-semibold">scrollbarProps</span>
        </el-divider>
        <el-space>
          <ElButton type="primary" @click="scrollbarVisible = true">
            scrollbarProps 配置（maxHeight）
          </ElButton>
          <ElButton type="primary" @click="scrollbarFullVisible = true">
            scrollbarProps 配置（头部+底部+内容）
          </ElButton>
        </el-space>

        <el-divider content-position="left">
          <span class="text-base font-semibold">按钮 Loading</span>
        </el-divider>
        <el-space>
          <ElButton type="primary" @click="buttonLoadingVisible = true">
            按钮 Loading（buttonLoadings）
          </ElButton>
          <ElButton type="primary" @click="quickLoadingVisible = true">
            按钮 Loading（快捷方式）
          </ElButton>
        </el-space>
      </el-space>
    </el-card>
  </el-space>
</template>
