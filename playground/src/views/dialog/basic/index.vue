<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit-dialog'
import { ElButton } from 'element-plus'

const dialog = useDialog()

const { modelValue: visible, loading } = dialog.use({
  title: '基础弹窗',
  width: '500px',
  content: '这是使用 useDialog 组合式函数创建的弹窗内容。弹窗会自动渲染到 DOM，无需在模板中添加组件。',
  onOpened: async () => {
    loading.value = true
  },
})
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          useDialog 基础用法
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <div>
          <ElButton type="primary" @click="visible = true">
            打开弹窗
          </ElButton>
        </div>
      </el-space>
    </el-card>
  </el-space>
</template>
