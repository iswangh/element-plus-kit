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

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans',
    'Helvetica Neue', sans-serif;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
