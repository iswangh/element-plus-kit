<script setup lang="ts">
import { useDrawer } from '@iswangh/element-plus-kit'
import { ElButton, ElMessage } from 'element-plus'
import { defineComponent, h } from 'vue'

const drawer = useDrawer()

// 示例1：content 属性（字符串）
const { modelValue: contentStringVisible } = drawer.use({
  title: 'content 属性 - 字符串',
  size: '500px',
  content: '这是使用 content 属性传入的字符串内容。',
})

// 示例2：content 属性（渲染函数返回字符串）
const { modelValue: contentFunctionStringVisible } = drawer.use({
  title: 'content 属性 - 函数返回字符串',
  size: '500px',
  content: () => `当前时间: ${new Date().toLocaleString()}`,
})

// 示例3：content 属性（渲染函数返回 VNode）
const { modelValue: contentFunctionVNodeVisible, id: contentFunctionVNodeId } = drawer.use({
  title: 'content 属性 - 函数返回 VNode',
  size: '500px',
  content: () => h('div', [
    h('p', { style: { color: '#409EFF' } }, '这是使用 h() 函数创建的 VNode'),
    h('p', `抽屉 ID: ${contentFunctionVNodeId}`),
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

const { modelValue: contentComponentVisible } = drawer.use({
  title: 'content 属性 - 函数返回 Component',
  size: '500px',
  content: () => ContentComponent,
})

// 示例4：抽屉 loading
const { modelValue: globalLoadingVisible, loading: globalLoading } = drawer.use({
  title: '抽屉 Loading',
  size: '500px',
  content: '这个抽屉展示了抽屉 loading 功能，loading 遮罩层只作用在内容区域。',
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
const { modelValue: customLoadingVisible, loading: customLoading } = drawer.use({
  title: '自定义 Loading 配置',
  size: '500px',
  content: '这个抽屉展示了自定义 loadingProps 功能。',
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

// 示例6：size 控制抽屉大小和滚动
const { modelValue: sizeVisible } = drawer.use({
  title: 'size 控制抽屉大小',
  size: '500px',
  content: () => h('div', Array.from({ length: 200 }, (_, i) => h('p', `这是第 ${i + 1} 行内容，用于测试滚动功能。抽屉的高度通过 size 属性控制，内容区域使用原生滚动。`))),
})

// 示例6.1：size 控制（包含头部、底部、内容）
const { modelValue: sizeFullVisible } = drawer.use({
  size: '400px',
  direction: 'ttb',
  slots: {
    header: () => h('div', [
      h('h3', { style: { margin: 0, fontWeight: 'bold', color: '#409EFF' } }, '抽屉标题'),
      h('p', { style: { margin: '8px 0 0', fontSize: '12px', color: '#909399' } }, '这是头部区域，用于展示标题和说明信息'),
    ]),
    default: () => h('div', Array.from({ length: 200 }, (_, i) => h('p', { style: { margin: '8px 0' } }, `这是第 ${i + 1} 行内容，用于测试滚动功能。抽屉的高度通过 size 属性控制，内容区域使用原生滚动。`))),
    footer: () => h('div', [
      h(ElButton, {
        onClick: () => {
          sizeFullVisible.value = false
        },
      }, () => '取消'),
      h(ElButton, {
        type: 'primary',
        onClick: () => {
          ElMessage.success('确认操作')
          sizeFullVisible.value = false
        },
      }, () => '确认'),
    ]),
  },
})

// 示例7：按钮 loading
const { modelValue: buttonLoadingVisible, buttonLoadings: buttonLoadingButtonLoadings } = drawer.use({
  title: '按钮 Loading',
  size: '500px',
  content: '这个抽屉展示了按钮级别的 loading 功能。',
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
const { modelValue: quickLoadingVisible, cancelLoading: quickCancelLoading, confirmLoading: quickConfirmLoading } = drawer.use({
  title: '按钮 Loading 快捷方式',
  size: '500px',
  content: '这个抽屉展示了使用 confirmLoading 和 cancelLoading 快捷方式。',
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
              <code>useDrawer</code> 在 <code>el-drawer</code> 基础上扩展了以下功能：<code>content</code>、<code>loading</code>、<code>buttonLoadings</code>、<code>loadingProps</code>。抽屉的大小通过 <code>size</code> 属性控制，内容区域使用原生滚动。
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
          <span class="text-base font-semibold">抽屉 Loading</span>
        </el-divider>
        <div>
          <ElButton type="primary" @click="handleGlobalLoading">
            抽屉 Loading（默认配置）
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
          <span class="text-base font-semibold">size 控制</span>
        </el-divider>
        <el-space>
          <ElButton type="primary" @click="sizeVisible = true">
            size 控制抽屉大小
          </ElButton>
          <ElButton type="primary" @click="sizeFullVisible = true">
            size 控制（头部+底部+内容）
          </ElButton>
        </el-space>
        <p class="text-sm text-gray-500 mt-2">
          抽屉的大小通过 <code>size</code> 属性控制，内容区域使用原生滚动。当内容超出时，会自动显示滚动条。
        </p>

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
