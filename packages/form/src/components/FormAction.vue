<!-- eslint-disable ts/no-explicit-any -->
<script setup lang="ts">
import type { Slot } from 'vue'
import type { FormActionButtonItem, FormActionConfig } from '../types'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElButton, ElFormItem, ElIcon } from 'element-plus'
import { computed } from 'vue'
import { DEFAULT_FORM_ACTION_BUTTONS, FORM_ACTION_DEFAULT_CONFIG } from '../config'

interface Props {
  inline?: boolean
  actionSlot?: Slot
  config?: FormActionConfig
  /** 展开/折叠状态（仅在 buttons 包含 'expand' 时有效） */
  expanded?: boolean
  /** 是否启用鼠标悬停自动展开 */
  autoExpandOnHover?: boolean
  /** 鼠标移入事件处理函数（用于空白区域和展开图标） */
  onMouseEnter?: () => void
  /** 鼠标移出事件处理函数（用于空白区域和展开图标） */
  onMouseLeave?: () => void
}

interface Emits {
  (e: 'action', payload: { eventName: string, data?: any }): void
}

defineOptions({ name: 'ElementPlusKitFormItemAction' })

const props = withDefaults(defineProps<Props>(), {
  inline: false,
  config: () => ({}), // 默认值在 processedActionProps 中处理
  expanded: false,
})

const emit = defineEmits<Emits>()

/** 处理后的动作组件属性（合并默认配置和用户自定义配置） */
const processedActionProps = computed(() => ({ ...props, config: { ...FORM_ACTION_DEFAULT_CONFIG.getDefaults(props.inline, props.config) } }))

/**
 * 标准化后的按钮列表
 * 将字符串类型的按钮配置转换为完整的按钮对象，确保每个按钮都有 eventName 属性
 */
const normalizedButtons = computed(() => {
  const { buttons } = processedActionProps.value.config

  return buttons.map((v) => {
    if (typeof v !== 'string')
      return v

    const defaultButton = DEFAULT_FORM_ACTION_BUTTONS[v]
    return defaultButton
      ? { ...defaultButton, eventName: v }
      : { label: v.toUpperCase(), eventName: v }
  })
})

/**
 * 判断按钮是否为展开/折叠按钮
 */
function isExpandButton(btn: FormActionButtonItem): boolean {
  return btn.eventName === 'expand'
}

/** 提取 el-button 的属性（排除自定义属性） */
function getBtnProps(btn: FormActionButtonItem) {
  const { label: _label, eventName: _eventName, ...rest } = btn

  // 如果是 expand 按钮，添加特殊属性
  if (isExpandButton(btn)) {
    const expandLabel = props.expanded ? '收起' : '展开'
    return {
      ...rest,
      'title': expandLabel,
      'aria-label': expandLabel,
      'aria-expanded': props.expanded,
    }
  }

  return rest
}

/**
 * 处理按钮点击事件
 *
 * @param btn - 按钮配置
 */
function onButtonClick(btn: FormActionButtonItem) {
  const eventName = btn.eventName
  const data = isExpandButton(btn) ? props.expanded : undefined
  emit('action', { eventName, data })
}

/**
 * 处理按钮鼠标移入事件
 *
 * @param btn - 按钮配置
 */
function onButtonMouseEnter(btn: FormActionButtonItem) {
  if (isExpandButton(btn) && props.autoExpandOnHover)
    props.onMouseEnter?.()
}

/**
 * 处理按钮鼠标移出事件
 *
 * @param btn - 按钮配置
 */
function onButtonMouseLeave(btn: FormActionButtonItem) {
  if (isExpandButton(btn) && props.autoExpandOnHover)
    props.onMouseLeave?.()
}
</script>

<template>
  <ElFormItem
    v-if="processedActionProps.config.vIf"
    v-show="processedActionProps.config.vShow"
    prop="action"
  >
    <template v-if="!actionSlot">
      <!-- 统一处理所有按钮（包括 expand 按钮） -->
      <ElButton
        v-for="(btn, i) in normalizedButtons"
        :key="`${btn.eventName}-${i}`"
        v-bind="getBtnProps(btn)"
        @mouseenter="onButtonMouseEnter(btn)"
        @mouseleave="onButtonMouseLeave(btn)"
        @click="onButtonClick(btn)"
      >
        <!-- expand 按钮：显示图标（仅在 inline 模式下显示） -->
        <template v-if="isExpandButton(btn) && inline">
          <ElIcon class="expand-toggle-icon" :class="{ 'is-expanded': expanded }">
            <ArrowDown />
          </ElIcon>
        </template>
        <!-- 其他按钮：显示文字 -->
        <template v-else>
          {{ btn.label ?? '' }}
        </template>
      </ElButton>
      <slot />
    </template>
    <component :is="actionSlot" v-else prop="action" />
  </ElFormItem>
</template>

<style lang="scss" scoped>
.expand-toggle-icon {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &.is-expanded {
    transform: rotate(-180deg);
  }
}
</style>
