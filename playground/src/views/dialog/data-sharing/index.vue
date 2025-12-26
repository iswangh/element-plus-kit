<script setup lang="ts">
import { useDialog } from '@iswangh/element-plus-kit-dialog'
import { ElButton, ElMessage } from 'element-plus'
import { defineComponent, h, ref } from 'vue'

const dialog = useDialog()

// 示例1：onOpened 中获取数据，在 default 插槽中使用
const userData = ref<{ username: string, email: string } | null>(null)

const { modelValue: dataSharingVisible, loading } = dialog.use({
  title: '数据共享示例',
  width: '600px',
  slots: {
    default: () => {
      // 在 default 插槽中访问 onOpened 中获取的数据（通过闭包访问）
      if (!userData.value) {
        return h('div', '数据加载中...')
      }
      return h('div', [
        h('p', { style: { fontWeight: 'bold' } }, '用户信息：'),
        h('p', `用户名: ${userData.value.username}`),
        h('p', `邮箱: ${userData.value.email}`),
      ])
    },
  },
  onOpened: async () => {
    loading.value = true
    ElMessage.info('开始加载数据...')
    // 模拟异步请求
    await new Promise(resolve => setTimeout(resolve, 2000))
    userData.value = {
      username: 'John Doe',
      email: 'john@example.com',
    }
    loading.value = false
    ElMessage.success('数据加载完成')
  },
  onClosed: () => {
    // 清理数据
    userData.value = null
  },
})

// 示例2：在 header 插槽中访问 default 插槽的数据
const headerData = ref<{ title: string, count: number } | null>(null)
const contentData = ref<string[]>([])

const { modelValue: headerDataSharingVisible } = dialog.use({
  width: '600px',
  slots: {
    header: () => {
      // 在 header 插槽中访问数据（通过闭包访问）
      if (!headerData.value) {
        return h('div', '加载中...')
      }
      return h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
        h('span', { style: { fontWeight: 'bold', color: '#409EFF' } }, headerData.value.title),
        h('span', { style: { color: '#909399' } }, `共 ${headerData.value.count} 条`),
      ])
    },
    default: () => {
      // 在 default 插槽中访问数据（通过闭包访问）
      if (contentData.value.length === 0) {
        return h('div', '暂无数据')
      }
      return h('div', [
        ...contentData.value.map(item => h('p', item)),
      ])
    },
  },
  onOpened: async () => {
    // 模拟异步请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    headerData.value = {
      title: '数据列表',
      count: 5,
    }
    contentData.value = [
      '数据项 1',
      '数据项 2',
      '数据项 3',
      '数据项 4',
      '数据项 5',
    ]
  },
  onClosed: () => {
    headerData.value = null
    contentData.value = []
  },
})

// 示例3：自定义组件中使用数据
const CustomUserCard = defineComponent({
  props: {
    user: {
      type: Object as () => { username: string, email: string } | null,
      default: null,
    },
  },
  emits: ['update:user', 'change'],
  setup(props, { emit }) {
    return () => {
      if (!props.user) {
        return h('div', '加载中...')
      }
      return h('div', {
        style: {
          padding: '16px',
          border: '1px solid #DCDFE6',
          borderRadius: '4px',
          backgroundColor: '#F5F7FA',
        },
      }, [
        h('p', { style: { fontWeight: 'bold', marginBottom: '8px' } }, '用户信息'),
        h('p', `用户名: ${props.user.username}`),
        h('p', `邮箱: ${props.user.email}`),
        h(ElButton, {
          type: 'primary',
          size: 'small',
          onClick: () => {
            // 触发 update:user 事件
            emit('update:user', {
              username: `${props.user!.username} (已更新)`,
              email: props.user!.email,
            })
            // 触发 change 事件
            emit('change', { username: props.user!.username, email: props.user!.email })
          },
        }, () => '更新用户信息'),
      ])
    }
  },
})

const componentUserData = ref<{ username: string, email: string } | null>(null)

const { modelValue: componentDataSharingVisible, loading: componentLoading } = dialog.use({
  title: '自定义组件数据传递',
  width: '600px',
  slots: {
    default: () => {
      // 将数据传递给自定义组件，并处理组件事件（通过闭包访问）
      return h(CustomUserCard, {
        'user': componentUserData.value,
        // 处理 update:user 事件（v-model 模式）
        'onUpdate:user': (newUser: { username: string, email: string }) => {
          componentUserData.value = newUser
          ElMessage.success('用户信息已更新')
        },
        // 处理 change 事件
        'onChange': (user: { username: string, email: string }) => {
          ElMessage.info(`change 事件触发: ${user.username}`)
        },
      })
    },
  },
  onOpened: async () => {
    componentLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 2000))
    componentUserData.value = {
      username: 'Jane Smith',
      email: 'jane@example.com',
    }
    componentLoading.value = false
  },
  onClosed: () => {
    componentUserData.value = null
  },
})

// 示例4：多个插槽共享数据
const sharedData = ref<{ message: string, timestamp: string } | null>(null)

const { modelValue: multiSlotSharingVisible } = dialog.use({
  width: '600px',
  slots: {
    header: () => {
      // header 插槽访问共享数据（通过闭包访问）
      return h('div', { style: { fontWeight: 'bold' } }, sharedData.value?.message || '标题')
    },
    default: () => {
      // default 插槽访问共享数据（通过闭包访问）
      return h('div', [
        h('p', '这是 default 插槽的内容'),
        sharedData.value && h('p', { style: { color: '#909399', fontSize: '12px' } }, `更新时间: ${sharedData.value.timestamp}`),
      ])
    },
    footer: () => {
      // footer 插槽访问共享数据（通过闭包访问）
      return h('div', { style: { textAlign: 'right' } }, [
        sharedData.value && h('span', { style: { marginRight: '12px', color: '#909399', fontSize: '12px' } }, `数据时间: ${sharedData.value.timestamp}`),
        h(ElButton, {
          onClick: () => {
            multiSlotSharingVisible.value = false
          },
        }, () => '关闭'),
      ])
    },
  },
  onOpened: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    sharedData.value = {
      message: '共享数据标题',
      timestamp: new Date().toLocaleString(),
    }
  },
  onClosed: () => {
    sharedData.value = null
  },
})

// 示例5：在插槽中访问 instance 的响应式状态
const { modelValue: instanceStateVisible, id: instanceStateId, loading: instanceStateLoading, zIndex: instanceStateZIndex, buttonLoadings: instanceStateButtonLoadings } = dialog.use({
  title: '访问 instance 响应式状态',
  width: '600px',
  slots: {
    header: () => {
      // 在 header 中访问 instance 的 loading 状态（通过闭包访问）
      return h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
        h('span', { style: { fontWeight: 'bold' } }, '弹窗标题'),
        instanceStateLoading.value && h('span', { style: { color: '#409EFF', fontSize: '12px' } }, '加载中...'),
      ])
    },
    default: () => {
      // 在 default 中访问 instance 的状态（通过闭包访问）
      return h('div', [
        h('p', `弹窗 ID: ${instanceStateId}`),
        h('p', `Loading 状态: ${instanceStateLoading.value ? '是' : '否'}`),
        h('p', `Z-Index: ${instanceStateZIndex.value}`),
      ])
    },
    footer: () => {
      // 在 footer 中访问 instance 的 buttonLoadings（通过闭包访问）
      return h('div', { style: { textAlign: 'right' } }, [
        h(ElButton, {
          loading: instanceStateButtonLoadings.value.cancel,
          onClick: async () => {
            instanceStateButtonLoadings.value.cancel = true
            await new Promise(resolve => setTimeout(resolve, 1000))
            instanceStateButtonLoadings.value.cancel = false
            instanceStateVisible.value = false
          },
        }, () => '取消'),
        h(ElButton, {
          type: 'primary',
          loading: instanceStateButtonLoadings.value.confirm,
          onClick: async () => {
            instanceStateButtonLoadings.value.confirm = true
            await new Promise(resolve => setTimeout(resolve, 1000))
            instanceStateButtonLoadings.value.confirm = false
            ElMessage.success('操作完成')
          },
        }, () => '确认'),
      ])
    },
  },
})
</script>

<template>
  <el-space class="w-full" direction="vertical" :size="20" fill>
    <el-card class="w-full" shadow="hover">
      <template #header>
        <h2 class="text-lg text-gray-800 font-semibold m-0">
          数据共享示例
        </h2>
      </template>
      <el-space class="w-full" direction="vertical" :size="20" fill>
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            <p class="text-sm text-gray-600 m-0">
              在 <code>onOpened</code> 中获取的数据可以通过响应式变量在 <code>default</code>、<code>header</code>、<code>footer</code> 等插槽中共享使用。所有插槽的渲染函数都接收 <code>instance</code> 参数，可以访问响应式状态。
            </p>
          </template>
        </el-alert>

        <el-divider content-position="left">
          <span class="text-base font-semibold">onOpened 数据在 default 插槽中使用</span>
        </el-divider>
        <div>
          <ElButton type="primary" @click="dataSharingVisible = true">
            数据共享示例
          </ElButton>
          <p class="text-sm text-gray-500 mt-2">
            在 <code>onOpened</code> 中异步获取数据，然后在 <code>default</code> 插槽中显示。
          </p>
        </div>

        <el-divider content-position="left">
          <span class="text-base font-semibold">header 插槽访问 default 插槽数据</span>
        </el-divider>
        <div>
          <ElButton type="primary" @click="headerDataSharingVisible = true">
            Header 和 Default 数据共享
          </ElButton>
          <p class="text-sm text-gray-500 mt-2">
            <code>header</code> 插槽和 <code>default</code> 插槽共享同一份数据，可以同时访问和显示。
          </p>
        </div>

        <el-divider content-position="left">
          <span class="text-base font-semibold">自定义组件数据传递</span>
        </el-divider>
        <div>
          <ElButton type="primary" @click="componentDataSharingVisible = true">
            自定义组件数据传递
          </ElButton>
          <p class="text-sm text-gray-500 mt-2">
            在 <code>default</code> 插槽中使用自定义组件，通过 props 传递在 <code>onOpened</code> 中获取的数据。
          </p>
        </div>

        <el-divider content-position="left">
          <span class="text-base font-semibold">多个插槽共享数据</span>
        </el-divider>
        <div>
          <ElButton type="primary" @click="multiSlotSharingVisible = true">
            多个插槽共享数据
          </ElButton>
          <p class="text-sm text-gray-500 mt-2">
            <code>header</code>、<code>default</code>、<code>footer</code> 插槽都可以访问同一份共享数据。
          </p>
        </div>

        <el-divider content-position="left">
          <span class="text-base font-semibold">访问 instance 响应式状态</span>
        </el-divider>
        <div>
          <ElButton type="primary" @click="instanceStateVisible = true">
            访问 instance 响应式状态
          </ElButton>
          <p class="text-sm text-gray-500 mt-2">
            所有插槽的渲染函数都接收 <code>instance</code> 参数，可以访问 <code>instance.loading</code>、<code>instance.buttonLoadings</code>、<code>instance.zIndex</code> 等响应式状态。
          </p>
        </div>
      </el-space>
    </el-card>
  </el-space>
</template>
