<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  source?: string
  title?: string
}

withDefaults(defineProps<Props>(), {
  source: '',
  title: '示例',
})

const showCode = ref(false)
</script>

<template>
  <div class="demo-container">
    <div class="demo-header">
      <span class="demo-title">{{ title }}</span>
      <button class="demo-toggle" @click="showCode = !showCode">
        {{ showCode ? '隐藏代码' : '显示代码' }}
      </button>
    </div>
    <div class="demo-preview">
      <slot />
    </div>
    <div v-if="showCode && source" class="demo-code">
      <pre><code>{{ source }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  margin: 16px 0;
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.demo-title {
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.demo-toggle {
  padding: 4px 12px;
  font-size: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
}

.demo-toggle:hover {
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
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
  color: var(--vp-c-text-1);
}
</style>
