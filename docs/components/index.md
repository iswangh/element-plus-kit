---
layout: page
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => {
  // 自动重定向到 Form 组件文档
  router.go('/components/form/')
})
</script>

正在跳转到 Form 组件文档...
