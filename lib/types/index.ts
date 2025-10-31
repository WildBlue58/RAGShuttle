/**
 * 项目全局类型定义
 */

/**
 * 向量数据库中的 chunk 项
 */
export interface ChunkItem {
  id: string;
  content: string;
  url: string | null;
  date_updated: string;
  similarity: number;
}

/**
 * 聊天消息接口
 */
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * 系统提示消息
 */
export interface SystemPrompt {
  role: "system";
  content: string;
}

