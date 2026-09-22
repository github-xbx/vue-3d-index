import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue';
import { createPinia } from 'pinia'   // 导入 createPinia


const app = createApp(App)
const pinia = createPinia()           // 创建 pinia 实例

app.use(router)
app.use(Antd)
app.use(pinia)

app.mount('#app')
