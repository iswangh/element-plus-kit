<script setup lang="ts">
import { WTag } from '@iswangh/element-plus-kit'
</script>

<template>
  <el-card class="w-full" shadow="hover">
    <template #header>
      <h2 class="text-lg text-gray-800 font-semibold m-0">
        基础用法
      </h2>
    </template>
    <el-space class="w-full" direction="vertical" :size="20" fill>
      <el-alert
        type="info"
        :closable="false"
        show-icon
      >
        <template #default>
          <p class="text-sm text-gray-600 m-0">
            从主包手动导入 WTag 组件
          </p>
        </template>
      </el-alert>
      <div>
        <h3 class="text-base text-gray-700 font-medium mb-2">
          基础标签
        </h3>
        <el-space wrap>
          <WTag>标签</WTag>
          <WTag type="success">
            成功
          </WTag>
          <WTag type="info">
            信息
          </WTag>
          <WTag type="warning">
            警告
          </WTag>
          <WTag type="danger">
            危险
          </WTag>
        </el-space>
      </div>
      <div>
        <h3 class="text-base text-gray-700 font-medium mb-2">
          可关闭标签
        </h3>
        <el-space wrap>
          <WTag closable>
            可关闭
          </WTag>
          <WTag type="success" closable>
            成功
          </WTag>
          <WTag type="info" closable>
            信息
          </WTag>
          <WTag type="warning" closable>
            警告
          </WTag>
          <WTag type="danger" closable>
            危险
          </WTag>
        </el-space>
      </div>
      <div>
        <h3 class="text-base text-gray-700 font-medium mb-2">
          不同尺寸
        </h3>
        <el-space wrap>
          <WTag size="large">
            大标签
          </WTag>
          <WTag size="default">
            默认标签
          </WTag>
          <WTag size="small">
            小标签
          </WTag>
        </el-space>
      </div>
      <div>
        <h3 class="text-base text-gray-700 font-medium mb-2">
          不同主题
        </h3>
        <el-space wrap>
          <WTag effect="dark">
            深色
          </WTag>
          <WTag effect="light">
            浅色
          </WTag>
          <WTag effect="plain">
            朴素
          </WTag>
        </el-space>
      </div>
    </el-space>
  </el-card>
</template>
