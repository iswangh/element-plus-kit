<script setup lang="ts">
import { useDrawer } from '@iswangh/element-plus-kit'
import { ElButton } from 'element-plus'

const drawer = useDrawer()

const { modelValue: visible, loading } = drawer.use({
  title: '基础抽屉',
  size: '500px',
  content: '这是使用 useDrawer 组合式函数创建的抽屉内容。抽屉会自动渲染到 DOM，无需在模板中添加组件。',
  onOpened: async () => {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 2000))
    loading.value = false
  },
})
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          useDrawer 基础用法
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <div>
          <ElButton type="primary" @click="visible = true">
            打开抽屉
          </ElButton>
        </div>
      </el-space>
    </el-card>
  </el-space>
</template>
