"use client";
import type { Message } from "ai";
import ReactMarkdown from "react-markdown";

interface ChatOutputProps {
  messages: Message[];
  status: string;
}

export default function ChatOutput({ messages, status }: ChatOutputProps) {
  return (
    <div className="space-y-1">
      {messages.map((message, index) =>
        message.role === "user" ? (
          <div key={index} className="message-enter">
            <UserChat content={message.content} />
          </div>
        ) : (
          <div key={index} className="message-enter">
            <AssistantChat content={message.content} />
          </div>
        )
      )}
      {status === "submitted" && (
        <div className="flex items-center gap-3 text-muted-foreground text-sm md:text-base mb-5 pl-1">
          <div className="flex gap-1">
            <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
            <div className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></div>
            <div className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:0.4s]"></div>
          </div>
          <span className="font-medium">正在生成回答...</span>
        </div>
      )}
      {status === "error" && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-5 shadow-sm">
          <p className="text-destructive font-semibold mb-1.5">发生错误</p>
          <p className="text-destructive/80 text-sm">
            请稍后重试，或检查网络连接
          </p>
        </div>
      )}
    </div>
  );
}

const UserChat = ({ content }: { content: string }) => {
  return (
    <div className="ml-auto max-w-[85%] md:max-w-[80%] w-fit mb-5">
      <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 shadow-md border border-primary/20 hover:shadow-lg transition-shadow">
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </p>
      </div>
    </div>
  );
};

// 检测并优化日期信息的显示
const optimizeContent = (content: string): string => {
  // 移除重复的日期更新信息（如果 AI 仍然输出了）
  // 匹配各种可能的日期格式：
  // - "信息最后更新日期：2023年10月"
  // - "信息最后更新日期: 2023年10月"
  // - "最后更新：2023年10月"
  // - "Date Updated: 2023-10"
  const datePatterns = [
    /信息最后更新日期[：:]\s*\d{4}年\d{1,2}月/gi,
    /最后更新[：:]\s*\d{4}年\d{1,2}月/gi,
    /信息最后更新[：:]\s*\d{4}年\d{1,2}月/gi,
    /Date Updated[：:]\s*\d{4}[-/]\d{1,2}/gi,
  ];

  let optimized = content;

  // 检查是否有日期信息
  let hasDateInfo = false;
  for (const pattern of datePatterns) {
    if (pattern.test(optimized)) {
      hasDateInfo = true;
      break;
    }
  }

  // 如果有日期信息，尝试移除回答末尾的重复日期提示
  if (hasDateInfo) {
    // 移除回答末尾单独的日期信息段落（可能在段落末尾或单独成段）
    optimized = optimized.replace(
      /\n*\s*信息最后更新日期[：:]\s*\d{4}年\d{1,2}月\s*\n*/gi,
      ""
    );
    optimized = optimized.replace(
      /\n*\s*最后更新[：:]\s*\d{4}年\d{1,2}月\s*\n*/gi,
      ""
    );
    // 清理多余的空行
    optimized = optimized.replace(/\n{3,}/g, "\n\n");
  }

  return optimized.trim();
};

const AssistantChat = ({ content }: { content: string }) => {
  const optimizedContent = optimizeContent(content);

  return (
    <div className="pr-4 md:pr-8 w-full mb-5">
      <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert prose-p:leading-relaxed prose-p:text-foreground prose-headings:text-foreground prose-headings:font-semibold prose-strong:text-foreground prose-strong:font-semibold">
        <ReactMarkdown
          components={{
            p: ({ children }) => {
              // 检查是否包含日期信息（处理各种可能的格式）
              const text = Array.isArray(children)
                ? children
                    .map((c) => (typeof c === "string" ? c : String(c)))
                    .join("")
                : String(children);

              const isDateInfo =
                /(信息)?最后更新|Date Updated/i.test(text) &&
                /\d{4}年?\d{0,2}月?|\d{4}[-/]\d{1,2}/.test(text);

              return (
                <p
                  className={`mb-4 last:mb-0 leading-relaxed ${
                    isDateInfo
                      ? "text-muted-foreground/50 text-xs mt-2 pt-2 border-t border-border/20 opacity-70"
                      : "text-foreground/90"
                  }`}
                >
                  {children}
                </p>
              );
            },
            a: ({ href, children }) => (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={href}
                className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
              >
                {children}
              </a>
            ),
            code: ({ node, className, children, ...props }) => {
              const isInline = !className;
              return isInline ? (
                <code
                  className="bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono text-foreground border border-border/50"
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            ul: ({ children }) => (
              <ul className="my-4 ml-6 space-y-2 list-disc text-foreground/90">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="my-4 ml-6 space-y-2 list-decimal text-foreground/90">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary/30 pl-4 my-4 italic text-muted-foreground">
                {children}
              </blockquote>
            ),
          }}
        >
          {optimizedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};
