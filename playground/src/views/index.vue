<script setup lang="ts">

</script>

<template>
  <div class="home">
    <el-card shadow="never">
      <template #header>
        <h1 class="text-2xl font-bold m-0">
          Element Plus Kit Playground
        </h1>
      </template>
      <div class="home-content">
        <p class="text-gray-600 mb-4">
          欢迎使用 Element Plus Kit Playground，这是一个用于测试和演示 Element Plus Kit 组件的开发环境。
        </p>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.home {
  max-width: 800px;
  margin: 0 auto;

  &-content {
    padding: 20px 0;
  }
}
</style>
