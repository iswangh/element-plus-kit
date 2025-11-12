<!-- eslint-disable ts/no-explicit-any -->
<script setup lang="ts">
import type { Slot } from 'vue'
import type { ActionConfig, ActionConfigButtonItem } from './types'
import { ElButton, ElFormItem } from 'element-plus'
import { computed } from 'vue'
import { ACTION_DEFAULT_CONFIG, DEFAULT_FORM_ACTION_BUTTONS } from './config'

interface Props {
  inline?: boolean
  actionSlot?: Slot
  config?: ActionConfig
}

interface Emits {
  (e: 'action', payload: { eventName: string, data?: any }): void
}

defineOptions({ name: 'ElementPlusKitFormItemAction' })

const props = withDefaults(defineProps<Props>(), {
  inline: false,
  config: () => ({}), // 默认值在 processedActionAttrs 中处理
})

defineEmits<Emits>()

/** 处理后的动作组件属性（合并默认配置和用户自定义配置） */
const processedActionAttrs = computed(() => {
  return { ...props, config: { ...ACTION_DEFAULT_CONFIG.getDefaults(props.inline, props.config) } }
})

/** 标准化后的按钮列表（ 将字符串类型的按钮配置转换为完整的按钮对象，确保每个按钮都有 eventName 属性） */
const normalizedButtons = computed(() => {
  const { buttons } = processedActionAttrs.value.config

  return buttons.map((v) => {
    if (typeof v === 'string') {
      const defaultButton = DEFAULT_FORM_ACTION_BUTTONS[v]
      return defaultButton ? { ...defaultButton, eventName: v } as ActionConfigButtonItem : { label: v.toUpperCase(), eventName: v } as ActionConfigButtonItem
    }
    return v
  }) as ActionConfigButtonItem[]
})

/** 提取 el-button 的属性（排除自定的属性） */
const btnAttrs = computed(() => {
  return (btn: ActionConfigButtonItem) => {
    const { label: _label, eventName: _eventName, ...rest } = btn
    return { ...rest }
  }
})
</script>

<template>
  <ElFormItem v-if="processedActionAttrs.config.vIf" v-show="processedActionAttrs.config.vShow" prop="action">
    <template v-if="!actionSlot">
      <ElButton v-for="(btn, i) in normalizedButtons" :key="`${btn.label}-${i}`" v-bind="btnAttrs(btn)" @click="$emit('action', { eventName: btn.eventName })">
        {{ btn.label ?? '' }}
      </ElButton>
    </template>
    <component :is="actionSlot" v-else prop="action" />
  </ElFormItem>
</template>
