import ElementPlusKit from '@iswangh/element-plus-kit'
import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import App from './App.vue'
import 'element-plus/dist/index.css'

const app = createApp(App)

// 注册 Element Plus
app.use(ElementPlus)

// 注册 Element Plus Kit（全局导入）
app.use(ElementPlusKit)

app.mount('#app')
