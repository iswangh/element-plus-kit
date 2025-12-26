<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit-dialog'
import { ElButton, ElMessage } from 'element-plus'
import { h, ref } from 'vue'

const dialog = useDialog({})

const openedCount = ref(0)
const beforeCloseCount = ref(0)
const closedCount = ref(0)

const { modelValue } = dialog.use({
  title: '生命周期钩子',
  width: '500px',
  content: () => h('div', [
    h('p', `opened 触发次数: ${openedCount.value}`),
    h('p', `beforeClose 触发次数: ${beforeCloseCount.value}`),
    h('p', `closed 触发次数: ${closedCount.value}`),
  ]),
  // 使用 ElDialog 的原生属性 beforeClose
  beforeClose: (done) => {
    beforeCloseCount.value++
    ElMessage.info('beforeClose 钩子已触发')
    done()
  },
  // 使用 ElDialog 的原生事件 @opened
  onOpened: () => {
    openedCount.value++
    ElMessage.success('opened 事件已触发')
  },
  // 使用 ElDialog 的原生事件 @closed
  onClosed: () => {
    closedCount.value++
    ElMessage.success('closed 事件已触发')
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
          生命周期钩子
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              <code>useDialog</code> 支持 <code>ElDialog</code> 的原生属性 <code>beforeClose</code> 和事件 <code>@opened</code>、<code>@closed</code>。
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
