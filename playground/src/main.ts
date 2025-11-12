// import ElementPlusKit from '@iswangh/element-plus-kit'
// import ElementPlus from 'element-plus'
// import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 注册 Element Plus（配置中文语言）
// app.use(ElementPlus, {
//   locale: zhCn,
// })

// 注册 Element Plus Kit（全局导入）
// app.use(ElementPlusKit)

app.mount('#app')
