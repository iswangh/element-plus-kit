<script setup lang="ts">
</script>

<template>
  <div class="form-index">
    <div class="form-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="scss">
.form-index {
  max-width: 1200px;
  margin: 0 auto;

  &-content {
    padding: 20px 0;
  }
}
</style>
