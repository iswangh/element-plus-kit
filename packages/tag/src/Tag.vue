<!-- eslint-disable ts/no-explicit-any -->
<script setup lang="ts">
import type { TagProps } from './types'
import { ElTag } from 'element-plus'
import { computed, useAttrs, useSlots } from 'vue'

defineOptions({ name: 'WTag' })

const props = withDefaults(defineProps<TagProps>(), {
  props: () => ({ label: 'label', value: 'value' }),
  looseMatch: true,
})

const attrs = useAttrs()
const slots = useSlots()

const mergedProps = computed(() => ({ ...attrs, ...props }))

/** 是否有插槽 */
const hasSlot = computed(() => !!slots.default)

// 字段配置（默认使用 label 和 value）
// const fieldKeys = computed(() => ({
//   label: props.props?.label || 'label',
//   value: props.props?.value || 'value',
// }))

const valueList = computed(() => Array.isArray(props.value) ? props.value : [props.value])
</script>

<template>
  <ElTag v-if="hasSlot" v-bind="mergedProps">
    <slot />
  </ElTag>
  <template v-else>
    <div>
      <div>options: {{ options }}</div>
      <div>valueList:   {{ valueList }}</div>
    </div>
  </template>
</template>
