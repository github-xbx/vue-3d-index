import { defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/

export default defineConfig(({ command, mode }) => {
  // 加载环境变量 
  //loadEnv() 的第三个参数是环境变量前缀，传 '' 表示加载所有变量
  //如果只想加载 VITE_ 开头的变量，可以省略第三个参数（默认就是 'VITE_'）
  const env = loadEnv(mode, process.cwd(), '')
  
  // 调试输出
  console.log('═══════════════════════════════════')
  console.log('命令:', command)        // serve 或 build
  console.log('模式:', mode)           // development 或 production
  console.log('VITE_BASE_URL:', env.VITE_BASE_URL)
  console.log('VITE_API_URL:', env.VITE_API_URL)
  console.log('═══════════════════════════════════')

  return {
     plugins: [vue()],
     base: env.VITE_BASE_URL || '/',  //基础路径，影响所有资源引用
     publicDir: 'public',
  }
})



