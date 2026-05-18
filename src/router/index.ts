import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'

// 动态获取基础路径，与 Vite 配置保持一致
const baseUrl = import.meta.env.VITE_BASE_URL || '/'

console.log('router=>baseUrl',baseUrl)

const router = createRouter({
  history: createWebHistory(baseUrl),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    }
  ]
})

export default router