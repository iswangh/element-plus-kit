<script setup lang="ts">
interface Props {
  source?: string
}

defineProps<Props>()
</script>

<template>
  <div class="demo-wrapper">
    <div class="demo-preview">
      <slot />
    </div>
    <div v-if="source" class="demo-code">
      <pre><code>{{ source }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.demo-wrapper {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  margin: 16px 0;
}

.demo-preview {
  padding: 24px;
  background: var(--vp-c-bg);
}

.demo-code {
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
}

.demo-code pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
}

.demo-code code {
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
}
</style>
