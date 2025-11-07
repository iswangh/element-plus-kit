<script setup lang="ts">
import AutoComponents from './examples/form-auto.vue'
import FormGlobal from './examples/form-global.vue'
import FormManual from './examples/form-manual.vue'
</script>

<template>
  <div class="app-container">
    <h1>Element Plus Kit Playground</h1>
    <FormGlobal />
    <FormManual />
    <AutoComponents />
  </div>
</template>

<style lang="scss" scoped>
@import './styles/index.scss';
</style>
