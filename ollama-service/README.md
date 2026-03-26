# Ollama Service

基于 NestJS 和 ollama-js 库实现的 Ollama API 服务，支持流式数据响应。

## 功能特性

- 🚀 基于 NestJS 框架
- 📡 支持 SSE (Server-Sent Events) 流式响应
- 🔧 使用 TypeScript 编写
- 📦 使用 pnpm 作为包管理器
- 🔌 集成 ollama-js 库

## API 接口

### 1. 普通聊天接口

**POST** `/ollama/chat`

请求体：

```json
{
  "model": "llama2",
  "prompt": "你好，请介绍一下自己"
}
```

响应：

```json
{
  "model": "llama2",
  "response": "你好！我是一个AI助手...",
  "done": true
}
```

### 2. 流式聊天接口

#### 方式一：POST 流式接口（推荐）

**POST** `/ollama/chat/stream`

请求体：

```json
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

#### 方式二：SSE 接口（仅支持 GET）

**GET** `/ollama/chat/sse`

> ⚠️ 注意：SSE 规范只支持 GET 请求，无法通过请求体发送数据。如需 POST 请求，请使用上面的 `/ollama/chat/stream` 接口。

**前端使用示例：**

```javascript
// POST 流式接口（推荐）
const response = await fetch('http://localhost:3000/ollama/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: 'llama2', prompt: '你好' }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      if (data === '[DONE]') {
        console.log('完成');
      } else {
        const { content } = JSON.parse(data);
        console.log(content);
      }
    }
  }
}
```

### 3. 获取模型列表

**GET** `/ollama/models`

响应：

```json
[
  {
    "name": "llama2:latest",
    "size": 3826793677,
    "modified_at": "2024-01-01T00:00:00Z"
  }
]
```

## 安装和运行

### 前置条件

1. 安装并运行 [Ollama](https://ollama.ai/)
2. 拉取至少一个模型：
   ```bash
   ollama pull llama2
   ```

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

创建 `.env` 文件：

```env
OLLAMA_HOST=http://localhost:11434
```

### 运行服务

```bash
# 开发模式（推荐）
pnpm run start:dev

# 或者使用简写
pnpm run dev

# 生产模式
pnpm run build
pnpm run start:prod
```

服务默认运行在 `http://localhost:3000`

## 测试接口

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

## 项目结构

```
src/
├── ollama/
│   ├── dto/
│   │   └── chat.dto.ts      # 数据传输对象
│   ├── ollama.controller.ts  # 控制器
│   ├── ollama.service.ts     # 服务层
│   └── ollama.module.ts      # 模块定义
├── app.module.ts             # 主模块
└── main.ts                   # 应用入口
```

## 技术栈

- **NestJS**: Node.js 企业级框架
- **TypeScript**: 类型安全的 JavaScript
- **ollama-js**: Ollama 官方 JavaScript SDK
- **RxJS**: 响应式编程库，用于处理流式数据
- **pnpm**: 快速、节省磁盘空间的包管理器

## License

MIT
