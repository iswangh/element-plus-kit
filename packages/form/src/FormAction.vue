<!-- eslint-disable ts/no-explicit-any -->
<script setup lang="ts">
import type { Slot } from 'vue'
import type { ActionConfig, ActionConfigButtonItem } from './types'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElButton, ElFormItem, ElIcon } from 'element-plus'
import { computed } from 'vue'
import { ACTION_DEFAULT_CONFIG, DEFAULT_FORM_ACTION_BUTTONS } from './config'

interface Props {
  inline?: boolean
  actionSlot?: Slot
  config?: ActionConfig
  /** 展开/折叠状态（仅在 buttons 包含 'expand' 时有效） */
  expanded?: boolean
}

interface Emits {
  (e: 'action', payload: { eventName: string, data?: any }): void
}

defineOptions({ name: 'ElementPlusKitFormItemAction' })

const props = withDefaults(defineProps<Props>(), {
  inline: false,
  config: () => ({}), // 默认值在 processedActionAttrs 中处理
  expanded: false,
})

const emit = defineEmits<Emits>()

/** 处理后的动作组件属性（合并默认配置和用户自定义配置） */
const processedActionAttrs = computed(() => ({
  ...props,
  config: { ...ACTION_DEFAULT_CONFIG.getDefaults(props.inline, props.config) },
}))

/**
 * 标准化后的按钮列表
 * 将字符串类型的按钮配置转换为完整的按钮对象，确保每个按钮都有 eventName 属性
 */
const normalizedButtons = computed(() => {
  const { buttons } = processedActionAttrs.value.config

  return buttons.map((v) => {
    if (typeof v !== 'string')
      return v

    const defaultButton = DEFAULT_FORM_ACTION_BUTTONS[v]
    return defaultButton
      ? { ...defaultButton, eventName: v }
      : { label: v.toUpperCase(), eventName: v }
  })
})

/** 是否显示展开/折叠按钮 */
const showExpandButton = computed(() => {
  const { buttons } = processedActionAttrs.value.config
  return buttons.some(v => (typeof v === 'string' ? v === 'expand' : v.eventName === 'expand'))
})

/** 展开/折叠按钮配置 */
const expandButtonConfig = computed((): ActionConfigButtonItem => {
  const expandButton = normalizedButtons.value.find(v => v.eventName === 'expand')
  if (expandButton)
    return expandButton
  // 返回默认配置，确保包含 eventName
  return { ...DEFAULT_FORM_ACTION_BUTTONS.expand, eventName: 'expand' }
})

/** 提取 el-button 的属性（排除自定义属性） */
const getBtnAttrs = (btn: ActionConfigButtonItem) => {
  const { label: _label, eventName: _eventName, ...rest } = btn
  return rest
}

/** 处理展开/折叠按钮点击 */
function handleExpandClick() {
  emit('action', { eventName: 'expand' })
}
</script>

<template>
  <ElFormItem v-if="processedActionAttrs.config.vIf" v-show="processedActionAttrs.config.vShow" prop="action">
    <template v-if="!actionSlot">
      <!-- 操作按钮（排除 expand 按钮） -->
      <ElButton v-for="(btn, i) in normalizedButtons.filter((v: ActionConfigButtonItem) => v.eventName !== 'expand')" :key="`${btn.label}-${i}`" v-bind="getBtnAttrs(btn)" @click="$emit('action', { eventName: btn.eventName })">
        {{ btn.label ?? '' }}
      </ElButton>
      <!-- 展开/折叠按钮（在 action 按钮右边，仅在 buttons 包含 'expand' 时显示） -->
      <ElButton
        v-if="showExpandButton && inline"
        key="expand"
        v-bind="getBtnAttrs(expandButtonConfig)"
        :aria-expanded="expanded"
        :aria-label="expanded ? '收起' : '展开'"
        @click="handleExpandClick"
      >
        <ElIcon class="expand-toggle-icon" :class="{ 'is-expanded': expanded }">
          <ArrowDown />
        </ElIcon>
      </ElButton>
      <slot />
    </template>
    <component :is="actionSlot" v-else prop="action" />
  </ElFormItem>
</template>

<style scoped>
.expand-toggle-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: rotate(0deg);
  will-change: transform;
}

.expand-toggle-icon.is-expanded {
  transform: rotate(180deg);
}
</style>
