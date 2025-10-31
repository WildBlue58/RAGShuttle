// 流式输出
// AI SDK 中用于生成流式文本响应的核心函数，支持逐字输出、工具调用和异步处理
import { streamText } from "ai";
// ai-sdk openai 调用方式
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: openai("gpt-3.5-turbo"),
      messages: messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
