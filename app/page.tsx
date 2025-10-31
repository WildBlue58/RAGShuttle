"use client";
// hooks
import { useChat } from "@ai-sdk/react";
import ChatOutput from "@/components/ChatOutput";
import ChatInput from "@/components/ChatInput";

export default function Home() {
  // 使用 useChat Hook 管理聊天状态和流式输出
  const {
    input, // 输入框的值
    messages, // 消息列表
    status, // 状态（idle | loading | submitted | error）
    handleInputChange, // 输入框变化处理函数
    handleSubmit, // 表单提交处理函数
  } = useChat();

  return (
    <main className="min-h-screen bg-background transition-colors">
      <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-28">
        {/* 页面标题 */}
        <header className="mb-8 md:mb-10">
          <div className="space-y-2 md:space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
              RAGShuttle
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-lg md:text-xl font-semibold text-primary">
                羽智RAG
              </p>
              <div className="h-1 w-1 rounded-full bg-primary/40"></div>
              <p className="text-sm md:text-base text-muted-foreground font-medium">
                基于 RAG 技术的羽毛球专业领域 AI 助手
              </p>
            </div>
          </div>
        </header>

        {/* 聊天消息区域 */}
        <div className="space-y-4 mb-6 max-h-[calc(100vh-240px)] md:max-h-[calc(100vh-280px)] overflow-y-auto scroll-smooth">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 md:py-20 px-4">
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 border border-primary/10">
                <div className="text-4xl md:text-5xl mb-2">🏸</div>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 text-foreground">
                欢迎使用 RAGShuttle
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">
                我可以回答关于羽毛球的规则、技巧、装备、比赛等问题。
                <br className="hidden md:block" />
                试试问我："羽毛球的比赛规则是什么？"
              </p>
            </div>
          ) : (
            <ChatOutput messages={messages} status={status} />
          )}
        </div>
      </div>

      {/* 输入框 - 固定在底部 */}
      <div className="fixed bottom-0 left-0 right-0 pt-4 bg-gradient-to-t from-background via-background/98 to-transparent border-t border-border/50 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 z-10">
        <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 pb-2 md:pb-4">
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
          {/* 技术说明 - 专业且不突兀 */}
          {messages.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-2.5 px-2">
              <div className="relative flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse"></div>
                <span className="absolute h-1.5 w-1.5 rounded-full bg-primary/20 animate-ping"></span>
              </div>
              <p className="text-xs text-muted-foreground/80 text-center font-medium tracking-wide">
                RAG 向量检索 · 语义相似度匹配 · GPT-4o 增强生成
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
