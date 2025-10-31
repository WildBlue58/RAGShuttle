# 项目上下文

## 项目目的

RAGShuttle (羽智RAG) 是一个基于 RAG（检索增强生成）技术的专业领域聊天机器人，专注于提供羽毛球相关信息的问答服务。项目使用 AI 流式输出技术，结合向量数据库实现智能检索和生成，为用户提供准确、实时的羽毛球相关信息，包括规则、技巧、装备、比赛等内容。

## 技术栈

### 前端

- **Next.js 15**: React 框架，使用 App Router
- **React 19**: UI 框架
- **TypeScript 5**: 类型安全
- **Tailwind CSS 4**: 样式框架，移动优先设计
- **shadcn/ui**: 组件库（按需加载、可定制）
- **lucide-react**: 图标库
- **react-markdown**: Markdown 渲染组件

### 后端与 AI

- **Vercel AI SDK**:
  - `@ai-sdk/openai`: OpenAI LLM 调用
  - `@ai-sdk/react`: React Hooks API，实现流式输出
  - `ai`: AI SDK 核心包
- **Supabase**: Backend as a Service
  - PostgreSQL 数据库
  - 向量扩展（pgvector）支持
  - 向量相似度计算
- **LangChain**: AI 应用开发框架
  - `@langchain/community`: 社区工具（网页爬虫）
  - `@langchain/core`: 核心模块
  - 文本分块（RecursiveCharacterTextSplitter）

### 工具与依赖

- **Puppeteer**: 无头浏览器，用于网页爬取
- **dotenv**: 环境变量管理
- **ts-node**: TypeScript 执行环境（用于 seed 脚本）

## 项目约定

### 代码风格

- 使用 TypeScript，启用严格模式
- 组件使用函数式组件和 React Hooks
- 使用 `"use client"` 标记客户端组件
- 使用路径别名 `@/*` 引用项目根目录
- 组件 props 使用 TypeScript 接口定义
- 代码注释使用简体中文

### 架构模式

- **组件划分**:
  - `ChatInput`: 输入组件
  - `ChatOutput`: 输出组件
  - UI 组件位于 `components/ui/`（shadcn/ui）
- **API 路由**: Next.js App Router 的 API Routes（`app/api/chat/route.ts`）
- **RAG 流程**:
  1. 用户提问 → 生成 embedding（向量化）
  2. 在 Supabase 中检索相似内容（相似度 > 0.7，返回前 3 条）
  3. 将检索结果作为 context 注入 prompt
  4. 调用 LLM（gpt-4o-mini）生成回答
  5. 流式输出返回前端
- **数据流**:
  - 前端：`useChat` Hook 管理聊天状态和流式输出
  - 后端：`streamText` 生成流式响应，`toDataStreamResponse()` 转换为 Response
- **Prompt 设计原则**:
  - 明确身份定位
  - 任务描述清晰
  - Context 和 Question 分区
  - 约束条件（仅回答羽毛球相关问题）
  - 返回格式规范（Markdown）

### 测试策略

- 当前项目暂未配置测试框架
- 建议未来添加单元测试和集成测试
- 关键测试点：API 路由、向量检索、流式输出

### Git 工作流

- 提交信息使用简体中文
- 提交信息格式：动词开头，描述具体更改
- 示例：`添加流式输出功能`、`修复向量检索阈值问题`

## 领域上下文

### RAG（检索增强生成）实现

1. **知识库构建**:
   - 使用 Puppeteer 爬取网页内容
   - LangChain 文本分块（chunkSize: 512, chunkOverlap: 100）
   - OpenAI embedding 模型（text-embedding-3-small）生成向量
   - 存储到 Supabase `chunks` 表（包含 content, vector, url, date_updated）

2. **向量检索**:
   - Supabase 自定义函数 `get_relevant_chunks`
   - 使用 pgvector 的 `<=>` 运算符计算余弦距离
   - 相似度 = 1 - 距离，按相似度倒序返回
   - 匹配阈值：0.7，返回数量：3

3. **流式输出**:
   - 使用 `streamText` 生成流式响应
   - `useChat` Hook 自动处理流式数据
   - 前端实时渲染 Markdown 格式的回答

### 数据库结构

```sql
CREATE TABLE public.chunks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  content text null,
  vector extensions.vector null,  -- 1536 维向量
  url text null,
  date_updated timestamp without time zone DEFAULT now(),
  CONSTRAINT chunks_pkey PRIMARY KEY (id)
);
```

### Seed 脚本

- 位置：`scripts/seed.ts`
- 运行：`npm run seed`（使用 ts-node）
- 功能：爬取指定网页，分块、向量化并存储到数据库
- 配置：在 `loadData` 函数中配置知识库来源 URL

## 重要约束

- **领域限制**: 仅回答与羽毛球相关的问题，其他问题礼貌拒绝
- **数据更新**: 回答中包含信息最后更新时间，提醒用户信息可能不是最新
- **上下文不足**: 当检索到的上下文不足以回答问题时，基于 LLM 自身知识回答，但需要标注信息可能不准确
- **TypeScript 配置**: seed 脚本需要使用 CommonJS 模块（ts-node 配置）
- **浏览器路径**: Puppeteer 需要根据操作系统配置 Chrome 可执行文件路径

## 外部依赖

### API 服务

- **OpenAI API**:
  - LLM 模型：gpt-4o-mini
  - Embedding 模型：text-embedding-3-small
  - 需要配置 `OPENAI_API_KEY` 和 `OPENAI_API_BASE_URL`

### 数据库服务

- **Supabase**:
  - 需要配置 `SUPABASE_URL` 和 `SUPABASE_KEY`
  - 需要启用 pgvector 扩展
  - 需要创建 `chunks` 表和 `get_relevant_chunks` 函数

### 环境变量

- `OPENAI_API_KEY`: OpenAI API 密钥
- `OPENAI_API_BASE_URL`: OpenAI API 基础 URL（可选，默认使用官方地址）
- `SUPABASE_URL`: Supabase 项目 URL
- `SUPABASE_KEY`: Supabase 服务密钥

## 项目亮点

- **流式输出**: 使用 `useChat` Hook 一行代码完成复杂的流式输出功能
- **响应式设计**: Tailwind CSS 移动优先，`max-w-3xl` 实现跨设备适配
- **类型安全**: TypeScript 严格模式，组件 props 完整类型定义
- **Prompt 工程**: 精心设计的 prompt 模板，确保回答准确性和格式规范
- **向量检索**: 基于 pgvector 的高效相似度搜索
