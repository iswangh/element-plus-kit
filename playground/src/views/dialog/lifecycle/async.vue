<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit-dialog'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { h, ref } from 'vue'

const dialog = useDialog()

const userData = ref<{ username: string, email: string } | null>(null)

// 注意：需要获取 zIndex 以确保 MessageBox 的层级高于 dialog
const { modelValue, loading, zIndex } = dialog.use({
  title: '异步钩子',
  width: '500px',
  content: () => h('div', [
    userData.value
      ? h('div', [
          h('p', `用户名: ${userData.value.username}`),
          h('p', `邮箱: ${userData.value.email}`),
        ])
      : null,
  ]),
  // 使用 ElDialog 的原生事件 @opened
  // 注意：onOpened 不接收任何参数，如果需要访问 instance，通过闭包访问
  onOpened: async () => {
    loading.value = true
    ElMessage.info('开始加载数据...')
    // 模拟异步请求
    await new Promise(resolve => setTimeout(resolve, 5000))
    userData.value = {
      username: 'John Doe',
      email: 'john@example.com',
    }
    loading.value = false
    ElMessage.success('数据加载完成')
  },
  // 使用 ElDialog 的原生属性 beforeClose
  // 注意：beforeClose 接收 done 回调函数，不接收 instance 参数
  // 如果需要访问 instance，通过闭包访问（从 dialog.use() 解构的变量）
  beforeClose: async (done) => {
    try {
      // 确保 MessageBox 的 z-index 比当前 dialog 更高
      // 注意：ElMessageBox 的类型定义可能不包含 zIndex，但实际支持
      // 使用类型断言来设置 zIndex（Element Plus 内部支持，但类型定义可能不完整）
      await ElMessageBox.confirm('确定要关闭弹窗吗？', '提示', {
        type: 'warning',
        zIndex: zIndex.value + 1,
      } as Parameters<typeof ElMessageBox.confirm>[2] & { zIndex?: number })
      done()
    }
    catch {
      // 用户取消，不关闭弹窗
    }
  },
  // 使用 ElDialog 的原生事件 @closed
  onClosed: async () => {
    ElMessage.success('弹窗已关闭')
    // 清理数据
    userData.value = null
    loading.value = false
  },
})

function handleOpen() {
  modelValue.value = true
}
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          异步生命周期钩子
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              <code>useDialog</code> 支持 <code>ElDialog</code> 的原生属性 <code>beforeClose</code> 和事件 <code>@opened</code>、<code>@closed</code>，这些钩子支持异步函数，可以在 <code>@opened</code> 中加载数据，在 <code>beforeClose</code> 中确认关闭。
            </p>
          </template>
        </el-alert>
        <div>
          <ElButton type="primary" @click="handleOpen">
            打开弹窗
          </ElButton>
        </div>
      </el-space>
    </el-card>
  </el-space>
</template>
