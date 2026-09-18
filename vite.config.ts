import { defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'



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
    server: {
      port: Number(env.VITE_APP_PORT) || 8080, // 端口号
      open: false, // 启动服务时自动打开浏览器
      strictPort: true,  // 端口被占用时直接失败，而不是换端口
      // proxy: {
      //   '/api': {
      //     target: env.VITE_API_URL, // 代理目标地址
      //     changeOrigin: true, // 是否改变请求源
      //     rewrite: (path) => path.replace(/^\/api/, '') // 重写路径
      //   }
      // }
    },
    plugins: [vue(), tailwindcss()],
    resolve:{
      alias: {
        '@': path.resolve(__dirname, 'src')  // 设置 @ 指向 src 目录
      }
    },
    define: {
      'import.meta.env.JAVA_QWEN_APIKEY': JSON.stringify(env.java_qwen_apikey) // 将环境变量注入到代码中
    },
    optimizeDeps:{
    include: [
      'vue'
    ]
    },
    base: env.VITE_BASE_URL || '/',  //基础路径，影响所有资源引用
    publicDir: 'public',
  }
})



