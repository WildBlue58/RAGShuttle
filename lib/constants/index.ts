/**
 * 项目全局常量配置
 */

/**
 * 向量搜索配置
 */
export const VECTOR_SEARCH_CONFIG = {
  matchThreshold: 0.7, // 相似度阈值
  matchCount: 3, // 返回结果数量
} as const;

/**
 * AI 模型配置
 */
export const AI_MODELS = {
  embedding: "text-embedding-3-small",
  llm: "gpt-4o-mini",
} as const;

/**
 * 文本分块配置
 */
export const TEXT_CHUNK_CONFIG = {
  chunkSize: 512, // 切割的长度 512 个字符 包含一个比较独立的语意
  chunkOverlap: 100, // 切割的重叠长度 100 个字符 一句话被切断容错
} as const;

