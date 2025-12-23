<script setup lang="ts">
import type { TagOption } from '@iswangh/element-plus-kit-tag'
import { WTag } from '@iswangh/element-plus-kit'
import { ref } from 'vue'

const options: TagOption[] = [
  { label: '成功', value: 'success', tagProps: { type: 'success' } },
  { label: '警告', value: 'warning', tagProps: { type: 'warning' } },
  { label: '危险', value: 'danger', tagProps: { type: 'danger' } },
]

const value = ref('success')
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          options + value + 插槽一起的使用
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="16" fill>
        <el-alert
          type="info"
          :closable="false"
          show-icon
        >
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              当同时使用 options、value 和插槽时，插槽内容优先显示
            </p>
          </template>
        </el-alert>
        <div>
          <h3 class="text-base text-gray-700 font-medium mb-2">
            插槽优先（即使有 options 和 value）
          </h3>
          <el-space wrap>
            <WTag :options="options" :value="value">
              自定义插槽内容
            </WTag>
            <WTag :options="options" value="warning">
              另一个自定义内容
            </WTag>
          </el-space>
        </div>
        <div>
          <h3 class="text-base text-gray-700 font-medium mb-2">
            仅使用 options 和 value（无插槽）
          </h3>
          <el-space wrap>
            <WTag :options="options" value="success" />
            <WTag :options="options" value="warning" />
            <WTag :options="options" value="danger" />
          </el-space>
        </div>
        <div>
          <h3 class="text-base text-gray-700 font-medium mb-2">
            作用域插槽（使用 value、label、options）
          </h3>
          <el-space wrap direction="vertical" :size="12" class="w-full" fill>
            <div>
              <p class="text-sm text-gray-600 mb-2">
                单个值：
              </p>
              <el-space wrap>
                <WTag :options="options" :value="value">
                  <template #default="{ label, options: matchedOptions }">
                    <span v-if="matchedOptions && matchedOptions.length > 0">
                      ✅ {{ label }} (匹配到 {{ matchedOptions.length }} 个选项)
                    </span>
                    <span v-else>
                      ❌ {{ label }} (匹配失败)
                    </span>
                  </template>
                </WTag>
                <WTag :options="options" value="unknown">
                  <template #default="{ label, options: matchedOptions }">
                    <span v-if="matchedOptions && matchedOptions.length > 0">
                      ✅ {{ label }} (匹配成功)
                    </span>
                    <span v-else>
                      ❌ {{ label }} (匹配失败)
                    </span>
                  </template>
                </WTag>
              </el-space>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-2">
                数组值：
              </p>
              <WTag :options="options" :value="['success', 'warning', 'danger']">
                <template #default="{ value: slotValue, label, options: matchedOptions }">
                  <span>
                    <template v-if="Array.isArray(slotValue)">
                      {{ slotValue.length }} 个值：{{ label }}
                      <span class="text-gray-400 ml-2">
                        (匹配到 {{ matchedOptions && matchedOptions.length || 0 }} 个选项)
                      </span>
                    </template>
                    <template v-else>
                      {{ label }}
                      <span v-if="matchedOptions && matchedOptions.length > 0" class="text-green-600 ml-2">
                        ✅ 匹配成功
                      </span>
                      <span v-else class="text-red-600 ml-2">
                        ❌ 匹配失败
                      </span>
                    </template>
                  </span>
                </template>
              </WTag>
            </div>
          </el-space>
        </div>
      </el-space>
    </el-card>
  </el-space>
</template>
