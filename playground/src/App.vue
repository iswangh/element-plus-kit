<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { AppLayout } from './layout'

const locale = zhCn
</script>

<template>
  <el-config-provider :locale="locale">
    <AppLayout />
  </el-config-provider>
</template>
