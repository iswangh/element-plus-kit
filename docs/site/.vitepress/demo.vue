<template>
  <div class="demo-container">
    <div class="demo-source">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.demo-source {
  padding: 24px;
  background: var(--vp-c-bg);
}
</style>
