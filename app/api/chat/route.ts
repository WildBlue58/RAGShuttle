import { embed, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createClient } from "@supabase/supabase-js";
import { VECTOR_SEARCH_CONFIG, AI_MODELS } from "@/lib/constants";
import type { ChunkItem, ChatMessage, SystemPrompt } from "@/lib/types";

// 初始化客户端
const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_KEY ?? ""
);

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
});

/**
 * 生成文本的向量嵌入
 * @param message 用户消息
 * @returns 向量嵌入数组
 */
async function generateEmbedding(message: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: openai.embedding(AI_MODELS.embedding),
      value: message,
    });
    return embedding;
  } catch (error) {
    console.error("生成向量嵌入失败:", error);
    throw new Error("无法生成文本向量，请稍后重试");
  }
}

/**
 * 从向量数据库检索相关上下文
 * @param embedding 查询向量
 * @returns 格式化的上下文字符串
 */
async function fetchRelevantContext(embedding: number[]): Promise<string> {
  try {
    const { data, error } = await supabase.rpc("get_relevant_chunks", {
      query_vector: embedding,
      match_threshold: VECTOR_SEARCH_CONFIG.matchThreshold,
      match_count: VECTOR_SEARCH_CONFIG.matchCount,
    });

    if (error) {
      console.error("向量检索失败:", error);
      throw new Error("无法检索相关上下文信息");
    }

    if (!data || data.length === 0) {
      return "未找到相关上下文信息";
    }

    // 格式化上下文，只包含必要的元数据
    const formattedChunks = (data as ChunkItem[]).map((item) => ({
      content: item.content,
      url: item.url,
      dateUpdated: item.date_updated,
    }));

    return JSON.stringify(formattedChunks);
  } catch (error) {
    console.error("获取相关上下文失败:", error);
    throw error;
  }
}

/**
 * 创建系统提示词
 * @param context 检索到的上下文信息
 * @param userQuestion 用户问题
 * @returns 系统提示消息对象
 */
function createPrompt(context: string, userQuestion: string): SystemPrompt {
  return {
    role: "system",
    content: `
    你是一个专业的羽毛球助手，提供关于羽毛球的信息。请使用以下上下文来回答问题：
    ---------------- 
    上下文开始
    ${context}
    上下文结束
    ---------------- 
    
    请以 Markdown 格式返回答案。答案应清晰、专业、易于阅读。
    
    重要提示：
    - 不要在回答末尾重复显示"信息最后更新日期"，这些信息已经包含在上下文中
    - 如果回答中需要引用来源，可以自然地提到来源链接
    - 如果上述上下文不足以完整回答问题，可以基于你自身的知识提供回答，但需要在回答中明确标注"以下信息可能不完整或不准确"
    - 如果用户询问与羽毛球无关的问题，请礼貌地告知用户你只能回答关于羽毛球的问题
    
    ----------------
    问题: ${userQuestion}
    ----------------
    `,
  };
}

/**
 * 处理聊天 API 请求
 * @param req 请求对象
 * @returns 流式响应
 */
export async function POST(req: Request): Promise<Response> {
  try {
    // 验证请求格式
    const body = await req.json();
    if (!body.messages || !Array.isArray(body.messages)) {
      return new Response(
        JSON.stringify({ error: "无效的请求格式：缺少 messages 字段" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const messages: ChatMessage[] = body.messages;
    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "消息列表不能为空" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const latestMessage = messages[messages.length - 1];
    if (!latestMessage?.content) {
      return new Response(
        JSON.stringify({ error: "最后一条消息内容不能为空" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 生成向量嵌入
    const embedding = await generateEmbedding(latestMessage.content);

    // 检索相关上下文
    const context = await fetchRelevantContext(embedding);

    // 创建提示词
    const prompt = createPrompt(context, latestMessage.content);

    // 生成流式响应
    const result = streamText({
      model: openai(AI_MODELS.llm),
      messages: [prompt, ...messages],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("聊天 API 处理失败:", error);
    const errorMessage =
      error instanceof Error ? error.message : "服务器内部错误";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
