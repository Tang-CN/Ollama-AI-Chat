# Ollama AI 聊天应用

基于 NestJS + React + TypeScript 的全栈 AI 聊天应用，支持流式数据响应和实时 Markdown 渲染。

## 💻 效果预览

![preview](https://raw.githubusercontent.com/Tang-CN/Ollama-AI-Chat/main/img/ai-chat.gif)

## 🚀 功能特性

### 后端服务 (ollama-service)

- 🚀 基于 NestJS 框架
- 📡 支持 SSE (Server-Sent Events) 流式响应
- 🔧 使用 TypeScript 编写
- 📦 使用 pnpm 作为包管理器
- 🔌 集成 ollama-js 库

### 前端应用 (ollama-chat)

- 🎨 现代化聊天界面设计
- 📱 响应式布局，支持移动端
- 🔄 真正的打字机效果流式响应
- 📝 实时 Markdown 渲染（支持 GFM）
- 🤖 支持多种 AI 模型选择
- 💬 思考动画与回答内容无缝衔接

## 📁 项目结构

```
├── ollama-service/          # 后端服务
│   ├── src/
│   │   ├── ollama/
│   │   │   ├── dto/
│   │   │   │   └── chat.dto.ts      # 数据传输对象
│   │   │   ├── ollama.controller.ts  # 控制器
│   │   │   ├── ollama.service.ts     # 服务层
│   │   │   └── ollama.module.ts      # 模块定义
│   │   ├── app.module.ts             # 主模块
│   │   └── main.ts                   # 应用入口
│   ├── .env                          # 环境变量
│   └── package.json
│
├── ollama-chat/             # 前端应用
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.tsx              # 聊天组件
│   │   │   └── Chat.css              # 聊天样式
│   │   ├── App.tsx                   # 主应用组件
│   │   ├── App.css                   # 应用样式
│   │   ├── main.tsx                  # 应用入口
│   │   └── index.css                 # 全局样式
│   ├── vite.config.ts                # Vite 配置
│   └── package.json
│
└── README.md                # 项目文档
```

## 🛠️ 技术栈

### 后端

- **NestJS**: Node.js 企业级框架
- **TypeScript**: 类型安全的 JavaScript
- **ollama-js**: Ollama 官方 JavaScript SDK
- **RxJS**: 响应式编程库，用于处理流式数据
- **pnpm**: 快速、节省磁盘空间的包管理器

### 前端

- **React 18**: 前端框架
- **TypeScript**: 类型安全
- **Vite**: 构建工具
- **react-markdown**: Markdown 渲染库
- **remark-gfm**: GitHub Flavored Markdown 支持

## 📋 API 接口

### 1. 普通聊天接口

**POST** `/ollama/chat`

```json
// 请求体
{
  "model": "llama2",
  "prompt": "你好，请介绍一下自己"
}

// 响应
{
  "model": "llama2",
  "response": "你好！我是一个AI助手...",
  "done": true
}
```

### 2. 流式聊天接口（推荐）

**POST** `/ollama/chat/stream`

```json
// 请求体
{
  "model": "llama2",
  "prompt": "请写一首关于春天的诗"
}
```

响应：Server-Sent Events 流

```
data: {"content":"春"}
data: {"content":"天"}
data: {"content":"来"}
...
data: [DONE]
```

### 3. 获取模型列表

**GET** `/ollama/models`

```json
// 响应
[
  {
    "name": "llama2:latest",
    "size": 3826793677,
    "modified_at": "2024-01-01T00:00:00Z"
  }
]
```

## 🚀 快速开始

### 前置条件

1. 安装并运行 [Ollama](https://ollama.ai/)
2. 拉取至少一个模型：
   ```bash
   ollama pull llama2
   # 或者使用其他模型
   ollama pull qwen3:0.6b
   ```

### 1. 启动后端服务

```bash
cd ollama-service

# 安装依赖
pnpm install

# 配置环境变量
# 创建 .env 文件，内容：
OLLAMA_HOST=http://localhost:11434

# 启动服务
pnpm run start:dev
```

后端服务默认运行在 `http://localhost:3000`

### 2. 启动前端应用

```bash
cd ollama-chat

# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev
```

前端应用运行在 `http://localhost:5173`

## 💻 使用说明

1. **打开浏览器**：访问 http://localhost:5173
2. **选择模型**：在顶部下拉菜单中选择要使用的 AI 模型
3. **输入消息**：在底部输入框中输入你的问题
4. **发送消息**：按 Enter 键或点击"发送"按钮
5. **查看效果**：体验打字机效果和实时 Markdown 渲染
6. **清空对话**：点击"清空对话"按钮重新开始

## 🔧 测试接口

### 使用 curl 测试普通接口

```bash
curl -X POST http://localhost:3000/ollama/chat \
  -H "Content-Type: application/json" \
  -d '{"model": "llama2", "prompt": "你好"}'
```

### 使用 curl 测试流式接口

```bash
curl -X POST http://localhost:3000/ollama/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"model": "llama2", "prompt": "请写一首诗"}'
```

### 获取模型列表

```bash
curl http://localhost:3000/ollama/models
```

## 🎨 技术亮点

### 1. 打字机效果

- 使用 fetch API + ReadableStream 实现流式响应
- 逐块读取数据并实时更新 UI
- 用户可以看到内容逐字生成的过程

### 2. 实时 Markdown 渲染

- 使用 react-markdown 支持 GitHub Flavored Markdown
- 边接收边解析，不需要等待完整响应
- 支持代码高亮、表格、列表等语法

## 🔧 开发说明

### 前端代理配置

前端开发服务器已配置代理，将 `/ollama` 请求转发到后端：

```typescript
// vite.config.ts
proxy: {
  "/ollama": {
    target: "http://localhost:3000",
    changeOrigin: true
  }
}
```

### 样式定制

- 主色调：`#667eea` (紫色渐变)
- 背景色：`#f5f5f5` (浅灰色)
- 响应式断点：`768px`

## 📄 License

MIT
