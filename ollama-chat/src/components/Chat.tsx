import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Chat.css";

interface Message {
  role: "user" | "assistant";
  content: string;
  isThinking?: boolean;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("qwen3:0.6b");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const assistantMessage: Message = {
      role: "assistant",
      content: "",
      isThinking: true
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch("/ollama/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          prompt: input
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("无法获取响应流");
      }

      let fullContent = "";
      let hasReceivedContent = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              break;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                if (!hasReceivedContent) {
                  hasReceivedContent = true;
                  // 收到第一个内容时，移除思考状态
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                      role: "assistant",
                      content: "",
                      isThinking: false
                    };
                    return newMessages;
                  });
                }
                fullContent += parsed.content;
                // 实时更新消息内容，实现打字机效果
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: "assistant",
                    content: fullContent,
                    isThinking: false
                  };
                  return newMessages;
                });
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (error: any) {
      console.error("发送消息失败:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: "assistant",
          content: `错误: ${error.message || "发送消息失败"}`,
          isThinking: false
        };
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>🤖 Ollama AI 聊天</h1>
        <div className="header-controls">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="model-select"
          >
            <option value="qwen3:0.6b">Qwen3 0.6B</option>
            <option value="llama2">Llama2</option>
          </select>
          <button onClick={clearChat} className="clear-btn">
            清空对话
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <h2>👋 你好！</h2>
            <p>我是 AI 助手，有什么可以帮你的吗？</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === "user" ? "👤" : "🤖"}
              </div>
              <div className="message-content">
                <div className="message-role">
                  {msg.role === "user" ? "你" : "AI"}
                </div>
                <div className="message-text">
                  {msg.isThinking ? (
                    <span className="typing-indicator">思考中</span>
                  ) : msg.role === "assistant" ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入你的消息... (按 Enter 发送)"
          disabled={loading}
          rows={1}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="send-btn"
        >
          {loading ? "发送中..." : "发送"}
        </button>
      </div>
    </div>
  );
};

export default Chat;
