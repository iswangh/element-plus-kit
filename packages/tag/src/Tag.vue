<!-- eslint-disable ts/no-explicit-any -->
<script setup lang="ts">
import type { TagProps } from 'element-plus'
import { ElTag } from 'element-plus'
import { useAttrs } from 'vue'

type Props = Partial<TagProps>

defineOptions({ name: 'WTag' })

const props = defineProps<Props>()

const attrs = useAttrs()
</script>

<template>
  <ElTag v-bind="{ ...attrs, ...props }">
    <slot />
  </ElTag>
</template>
