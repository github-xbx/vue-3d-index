# vue-3d-index

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

一个基于 Vue 3 与 Three.js 的个人作品集项目，现已演进为 pnpm monorepo：包含 3D 交互首页、AI Agent 对话应用，以及可复用的 LangChain 能力封装包。

## 项目结构

```
vue-3d-index/
├── apps/
│   ├── 3d-index-web/              # 3D 交互首页
│   └── agent-web/                 # AI Agent 对话应用
├── packages/
│   └── ai-langchain/              # LangChain 能力封装包
├── docs/                          # 协议与接口文档
├── Jenkinsfile                    # Jenkins 流水线
├── deploy-remote.sh               # 远程部署脚本
├── pnpm-workspace.yaml            # workspace 配置
└── README.md
```

## 模块说明

| 模块 | 包名 | 说明 |
|------|------|------|
| [apps/3d-index-web](./apps/3d-index-web) | `@app/3d-index-web` | 3D 交互首页。Three.js 渲染背景与几何模型，配合 Vue 组件呈现视觉与文案内容 |
| [apps/agent-web](./apps/agent-web) | `@app/agent-web` | AI Agent 对话应用。集成 CopilotKit、Ant Design Vue 与 Tailwind CSS，覆盖 CopilotKit 对话、LangChain 流式对话、设计对话三类页面 |
| [packages/ai-langchain](./packages/ai-langchain) | `@packages/ai-langchain` | LangChain 能力封装包。向上层应用提供模型实例、Chat Provider 与自定义 XRequest，由上层注入流式产出方式 |

### apps/3d-index-web

- 技术栈：Vue 3 + TypeScript + Three.js + Vue Router + Vite
- 主要代码：
  - `src/components/ThreeBackground.vue` —— 3D 背景画布
  - `src/composables/three/` —— 场景编排（`PortfolioScene.ts`）与几何模型（`GeometricModels.ts`）
  - `src/views/HomePage.vue` —— 首页
- 路由：`/`

### apps/agent-web

- 技术栈：Vue 3 + TypeScript + Ant Design Vue + `@antdv-next/x` + `@copilotkit/vue` + Tailwind CSS + Vite
- 依赖 `@packages/ai-langchain`（通过 `workspace:*` 协议引用）
- 路由：

  | 路径 | 页面 | 说明 |
  |------|------|------|
  | `/copilot` | `views/ai/CopilotPage.vue` | 基于 CopilotKit 的对话页 |
  | `/test` | `views/langchain/Test.vue` | LangChain 流式对话验证页 |
  | `/chat` | `views/chat/DesignChat.vue` | 设计风格对话页 |

  注意：未定义根路径 `/` 的路由，启动后请访问 `http://localhost:8091/copilot`。

### packages/ai-langchain

- 构建工具：tsdown，输出 ESM 与类型声明到 `dist/`
- 对外导出：

  | 导出路径 | 内容 |
  |----------|------|
  | `@packages/ai-langchain` | 入口，聚合导出全部能力 |
  | `./services/AliyunModel` | `AliyunModel`，创建兼容 OpenAI 接口的模型实例（默认模型 `qwen3.7-flash`） |
  | `./services/LangChainChatProvider` | `LangChainChatProvider`，对接 `@antdv-next/x-sdk` 的 Chat Provider |
  | `./services/LangChainXRequest` | `LangChainXRequest`，将 LangChain 异步迭代器的 token 手动回喂给 SDK |

  `agent-web` 通过 `workspace:*` 引用该包，消费的是 `dist/` 中的构建产物。因此修改源码后需重新构建才能生效：

  ```bash
  pnpm build:ai-langchain
  ```

## 快速开始

### 环境要求

- Node.js >= 20
- pnpm >= 9

### 安装

```bash
git clone https://github.com/your-username/vue-3d-index.git
cd vue-3d-index
pnpm install
```

### 常用脚本

根 `package.json` 提供了以下快捷脚本，在仓库根目录即可执行：

| 命令 | 作用 |
|------|------|
| `pnpm 3d-index-web` | 启动 3D 交互首页开发服务器 |
| `pnpm agent-web` | 启动 AI Agent 对话应用开发服务器 |
| `pnpm build:ai-langchain` | 构建 `@packages/ai-langchain` |

### 开发

```bash
# 3D 交互首页，默认 http://localhost:8081
pnpm 3d-index-web

# AI Agent 对话应用，默认 http://localhost:8091
pnpm agent-web
```

也可以进入应用目录直接启动：

```bash
cd apps/agent-web && pnpm dev
```

开发服务器端口由 `.env.development` 中的 `VITE_APP_PORT` 控制，并开启 `strictPort`：端口被占用时直接启动失败，而不会自动切换端口。

### 构建

`packages/ai-langchain` 已配置 `build` 脚本，直接使用根脚本构建：

```bash
pnpm build:ai-langchain
```

`apps` 下的应用目前仅配置了 `dev` 脚本，生产构建通过 pnpm 过滤器调用 Vite：

```bash
# 类型检查
pnpm --filter @app/3d-index-web exec vue-tsc -b

# 生产构建，产物输出到对应应用的 dist/ 目录
pnpm --filter @app/3d-index-web exec vite build
```

## 环境变量

各应用在自身目录下维护 `.env.development` 与 `.env.production`，由 `vite.config.ts` 通过 `loadEnv(mode, process.cwd(), '')` 加载。

| 变量 | 说明 |
|------|------|
| `VITE_BASE_URL` | 应用基础路径，同时作为 Vue Router 的 `history` base |
| `VITE_API_URL` | 后端接口地址 |
| `VITE_APP_TITLE` | 应用标题 |
| `VITE_APP_PORT` | 开发服务器端口 |
| `VITE_AI_URL` | 仅 `agent-web`：CopilotKit / AG-UI 后端地址 |

此外，`vite.config.ts` 中的 `define` 会把以小写 `java_qwen_apikey` 定义的变量注入为 `import.meta.env.JAVA_QWEN_APIKEY`。由于该变量不以 `VITE_` 开头，不会被 Vite 自动暴露，需在 `.env` 文件中显式定义；同时请注意 `define` 的注入结果会进入前端产物，不要在其中放置生产环境密钥。

## 部署

项目提供两套 CI/CD 配置：

- **GitHub Actions**（[.github/workflows/build.yml](./.github/workflows/build.yml)）：推送到 `main` / `master` 或提交 PR 时触发，安装依赖、构建并上传 `dist/` 作为构建产物。
- **Jenkins**（[Jenkinsfile](./Jenkinsfile)）：支持选择分支与是否清理 `node_modules`，构建后通过 SSH 调用 [deploy-remote.sh](./deploy-remote.sh) 部署。

`deploy-remote.sh` 的部署流程：

1. 解压上传的构建包
2. 备份旧版本（默认保留最近 5 份）
3. 替换宿主机部署目录
4. 设置文件权限
5. 校验并重载 Docker 容器内的 Nginx，校验失败时自动回滚
6. 清理临时文件与过期备份

> 说明：`Jenkinsfile` 与 `build.yml` 仍围绕早期单体结构编写——在仓库根目录执行 `npm install` 与 `npm run build`，并使用 npm 作为包管理器。当前仓库已改为 pnpm workspace 结构，根目录不再提供 `build` 脚本，因此这两套流水线会直接失败，尚未适配 monorepo 的构建方式。部署路径、容器名称等参数同样需按实际环境调整。

## 文档

- [CopilotKit AG-UI 协议接口文档](./docs/copilotkit-ag-ui-api.md) —— 后端需实现的 HTTP 接口与 SSE 返回格式

## 许可证

[MIT](./LICENSE)

## 相关资源

- [Vue 3 官方文档](https://vuejs.org/)
- [Three.js 官方文档](https://threejs.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Vue Router 官方文档](https://router.vuejs.org/)
- [pnpm workspace 文档](https://pnpm.io/workspaces)
- [LangChain.js 文档](https://js.langchain.com/)
