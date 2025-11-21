// createApp 会自动导入，无需手动导入
import App from './App.vue'
import router from './router'
import 'virtual:uno.css'
// 导入 Element Plus 样式（ElMessage 等服务组件需要样式支持）
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
