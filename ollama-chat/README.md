# Ollama Chat - React 前端

基于 React 18 + TypeScript 的 Ollama AI 聊天界面。

## 功能特性

- 🎨 现代化聊天界面设计
- 📱 响应式布局，支持移动端
- 🔄 流式对话响应
- 🤖 支持多种 AI 模型选择
- 💬 实时消息显示

## 技术栈

- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具

## 快速开始

### 前置条件

1. 确保 Ollama 后端服务正在运行：

   ```bash
   cd ../ollama-service
   pnpm run start:dev
   ```

2. 确保 Ollama 服务已启动并加载了模型

### 安装和运行

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev
```

应用将运行在 http://localhost:5173/

## 使用说明

1. **选择模型**：在顶部下拉菜单中选择要使用的 AI 模型
2. **输入消息**：在底部输入框中输入你的问题
3. **发送消息**：按 Enter 键或点击"发送"按钮
4. **清空对话**：点击"清空对话"按钮重新开始

## API 接口

前端通过以下接口与后端通信：

- `POST /ollama/chat/stream` - 流式聊天接口
- `GET /ollama/models` - 获取可用模型列表

## 项目结构

```
src/
├── components/
│   ├── Chat.tsx        # 聊天组件
│   └── Chat.css        # 聊天样式
├── App.tsx             # 主应用组件
├── App.css             # 应用样式
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 开发说明

### 代理配置

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

## License

MIT
