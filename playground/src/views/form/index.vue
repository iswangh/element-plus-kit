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
  width: 100%;

  &-content {
    padding: 20px 0;
  }
}
</style>
