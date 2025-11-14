<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import AutoComponents from './examples/form-auto.vue'
// import FormGlobal from './examples/form-global.vue'
// import FormManual from './examples/form-manual.vue'

const locale = zhCn
</script>

<template>
  <el-config-provider :locale="locale">
    <div class="app-container">
      <h1>Element Plus Kit Playground</h1>
      <!-- <FormGlobal /> -->
      <!-- <FormManual /> -->
      <AutoComponents />
    </div>
  </el-config-provider>
</template>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
