# vue-3d-index

一个基于 Vue 3 + Three.js 构建的个人网站项目，提供现代化的 3D 交互体验。

## 特性

- 🎨 现代化 Vue 3 框架
- 🌐 3D 渲染能力（Three.js）
- ⚡ 快速开发体验（Vite）
- 📱 响应式设计
- 🔀 客户端路由（Vue Router）

## 快速开始

### 环境要求

- Node.js >= 18
- npm 或 yarn

### 安装

克隆项目并安装依赖：

```bash
git clone https://github.com/your-username/vue-3d-index.git
cd vue-3d-index
npm install
```

### 开发

启动本地开发服务器：

```bash
npm run dev
```

项目默认在 `http://localhost:5173` 运行。

### 构建

打包项目用于生产环境：

```bash
npm run build
```

编译输出文件位于 `dist` 目录。

### 预览

预览生产构建结果：

```bash
npm run preview
```

## 项目结构

```
vue-3d-index/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # Vue 组件
│   ├── views/          # 页面组件
│   ├── App.vue         # 根组件
│   └── main.ts         # 应用入口
├── public/             # 公共文件
├── package.json        # 项目配置
└── README.md          # 本文件
```

## 技术栈

| 技术 | 版本 | 描述 |
|------|------|------|
| Vue | 3.5+ | 渐进式 JavaScript 框架 |
| Three.js | 0.184+ | 3D JavaScript 库 |
| Vue Router | 4.6+ | Vue 的官方路由库 |
| TypeScript | 6.0+ | JavaScript 超集 |
| Vite | 8.0+ | 下一代前端构建工具 |

## 常见问题

**Q: 如何添加 3D 模型？**

A: 在 Three.js 中加载 3D 模型，具体方法请参考 [Three.js 官方文档](https://threejs.org/docs/)。

**Q: 支持哪些浏览器？**

A: 支持所有现代浏览器（Chrome、Firefox、Safari、Edge）。

## 贡献指南

欢迎提交 Issue 和 Pull Request。请先阅读 [贡献指南](./CONTRIBUTING.md)（如果存在）。

## 许可证

[MIT](./LICENSE)

## 相关资源

- [Vue 3 官方文档](https://vuejs.org/)
- [Three.js 官方文档](https://threejs.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Vue Router 官方文档](https://router.vuejs.org/)
