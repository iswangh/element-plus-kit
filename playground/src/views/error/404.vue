<script setup lang="ts">
// useRouter 会自动导入，无需手动导入
const router = useRouter()

/**
 * 返回首页
 */
function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="not-found">
    <el-result
      icon="error"
      title="404"
      sub-title="抱歉，您访问的页面不存在"
    >
      <template #extra>
        <el-button type="primary" @click="goHome">
          返回首页
        </el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped lang="scss">
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
</style>
