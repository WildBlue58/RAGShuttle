# RAGShuttle (羽智RAG) - 羽毛球专业领域 AI 聊天机器人

<div align="center">

![RAGShuttle](https://img.shields.io/badge/RAGShuttle-羽智RAG-blue?style=for-the-badge&logo=badminton)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![RAG](https://img.shields.io/badge/RAG-Enabled-green?style=for-the-badge)

一个基于 RAG（检索增强生成）技术的专业领域 AI 聊天机器人，专注于提供准确的羽毛球相关信息问答服务。

**🌐 [在线演示](https://rag-shuttle.vercel.app/)** • [功能特性](#-功能特性) • [技术栈](#-技术栈) • [快速开始](#-快速开始) • [项目结构](#-项目结构) • [部署](#-部署)

</div>

---

## 📋 项目简介

**RAGShuttle (羽智RAG)** 是一个智能聊天机器人应用，结合了 **RAG（检索增强生成）**技术、**向量数据库**和 **大语言模型**，为用户提供专业的羽毛球领域知识问答服务。项目展示了现代全栈开发、AI 应用开发和系统架构设计的最佳实践。

🌐 **[在线体验](https://rag-shuttle.vercel.app/)**

**项目名称含义：**

- **RAG** - Retrieval-Augmented Generation（检索增强生成），核心技术
- **Shuttle** - 羽毛球英文术语，代表专业领域
- **羽智** - 羽毛球智慧，中文名称，简洁易记

### 核心特性

- ✅ **RAG 架构**：结合向量检索和 LLM 生成，确保回答准确性和相关性
- ✅ **流式输出**：实时显示 AI 回答，提升用户体验
- ✅ **类型安全**：完整的 TypeScript 类型定义，确保代码质量
- ✅ **响应式设计**：移动端优先，完美适配各种设备
- ✅ **错误处理**：完善的错误处理和用户反馈机制
- ✅ **规范驱动开发**：使用 OpenSpec 进行需求管理和开发流程规范

---

## 🚀 功能特性

### 核心功能

1. **智能问答**
   - 基于向量相似度检索相关上下文
   - 结合 LLM 生成准确、专业的回答
   - 支持 Markdown 格式输出，包含链接和引用来源

2. **流式响应**
   - 实时流式输出，逐字显示 AI 回答
   - 优化的加载状态和错误提示

3. **知识库管理**
   - 支持从 Wikipedia 等网页爬取内容
   - 自动文本分块和向量化
   - 高效的向量相似度搜索

### 技术亮点

- **RAG 实现**：完整的检索增强生成流程
- **向量数据库**：使用 Supabase + pgvector 进行高效的语义搜索
- **AI SDK 集成**：使用 Vercel AI SDK 实现流式输出
- **现代化 UI**：shadcn/ui + Tailwind CSS，美观且可定制
- **类型安全**：严格的 TypeScript 类型检查

---

## 🛠 技术栈

### 前端

- **Next.js 15** - React 框架，App Router
- **React 19** - UI 框架
- **TypeScript 5** - 类型安全
- **Tailwind CSS 4** - 样式框架
- **shadcn/ui** - 组件库
- **lucide-react** - 图标库
- **react-markdown** - Markdown 渲染

### 后端与 AI

- **Vercel AI SDK** - AI 应用开发框架
  - `@ai-sdk/openai` - OpenAI LLM 调用
  - `@ai-sdk/react` - React Hooks，流式输出
- **Supabase** - Backend as a Service
  - PostgreSQL + pgvector 向量扩展
  - 向量相似度搜索
- **LangChain** - AI 应用框架
  - `@langchain/community` - 网页爬虫工具
  - `@langchain/core` - 核心模块

### 工具与依赖

- **Puppeteer** - 无头浏览器，网页爬取
- **dotenv** - 环境变量管理
- **ts-node** - TypeScript 执行环境

---

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm / pnpm / yarn
- Chrome 浏览器（用于 Puppeteer）

### 安装步骤

1. **克隆项目**

```bash
git clone <repository-url>
cd ragshuttle
```

2. **安装依赖**

```bash
npm install
# 或
pnpm install
```

3. **配置环境变量**

创建 `.env.local` 文件：

```env
# OpenAI 配置
OPENAI_API_KEY=your_openai_api_key
OPENAI_API_BASE_URL=https://api.openai.com/v1  # 可选

# Supabase 配置
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
```

4. **初始化数据库**

在 Supabase 中执行以下 SQL：

```sql
-- 创建 chunks 表
CREATE TABLE public.chunks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  content text null,
  vector extensions.vector(1536) null,
  url text null,
  date_updated timestamp without time zone DEFAULT now(),
  CONSTRAINT chunks_pkey PRIMARY KEY (id)
);

-- 创建向量搜索函数
CREATE OR REPLACE FUNCTION get_relevant_chunks(
  query_vector vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  content text,
  url text,
  date_updated timestamp,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    content,
    url,
    date_updated,
    1 - (vector <=> query_vector) as similarity
  FROM chunks
  WHERE 1 - (vector <=> query_vector) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;
```

5. **填充知识库**

```bash
npm run seed
```

6. **启动开发服务器**

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

---

## 📁 项目结构

> 💡 查看 [详细的项目结构说明](./docs/project-structure.md) 了解完整的目录组织方式

```
RAGShuttle/
├── app/                          # Next.js App Router
│   ├── api/
│   │   └── chat/
│   │       └── route.ts         # 聊天 API 路由（RAG 实现）
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 主页面
├── components/                    # React 组件
│   ├── ui/                       # shadcn/ui 组件
│   │   ├── button.tsx
│   │   └── input.tsx
│   ├── ChatInput.tsx            # 聊天输入组件
│   └── ChatOutput.tsx           # 聊天输出组件
├── lib/                          # 工具函数和配置
│   ├── utils.ts                 # 通用工具函数
│   ├── types/                   # TypeScript 类型定义
│   │   └── index.ts
│   └── constants/               # 常量配置
│       └── index.ts
├── scripts/                      # 脚本文件
│   └── seed.ts                  # 知识库填充脚本
├── openspec/                     # OpenSpec 规范文档
│   ├── project.md               # 项目上下文
│   ├── specs/                   # 功能规范
│   └── changes/                 # 变更提案
├── package.json                  # 项目依赖
├── tsconfig.json                 # TypeScript 配置
└── README.md                     # 项目文档
```

---

## 🏗 架构设计

### RAG 流程

1. **用户提问** → 生成文本向量嵌入（OpenAI Embedding）
2. **向量检索** → 在 Supabase 中搜索相似内容（pgvector）
3. **上下文注入** → 将检索结果作为上下文注入 Prompt
4. **LLM 生成** → 使用 GPT-4o-mini 生成回答
5. **流式输出** → 实时返回回答给前端

### 数据流

```
用户输入 → Embedding → 向量搜索 → 上下文检索 
  ↓
Prompt 构建 → LLM 生成 → 流式输出 → 前端渲染
```

---

## 🎨 UI/UX 特性

- **响应式设计**：移动端优先，完美适配各种屏幕
- **现代化界面**：使用 shadcn/ui 组件，美观且一致
- **实时反馈**：加载状态、错误提示、流式输出动画
- **无障碍支持**：遵循 WCAG 标准，支持屏幕阅读器

---

## 📝 开发规范

### 代码风格

- TypeScript 严格模式
- 函数式组件 + React Hooks
- 完整的类型定义
- 中文代码注释

### 提交规范

- 使用简体中文提交信息
- 格式：`动词 + 描述`
- 示例：`修复向量检索阈值问题`、`优化聊天界面响应式布局`

---

## 🚢 部署

> 💡 查看 [详细的部署指南](./docs/deployment.md) 了解完整的部署流程

### 🌐 在线演示

**项目已部署到 Vercel，可在线体验：**

👉 **[https://rag-shuttle.vercel.app/](https://rag-shuttle.vercel.app/)**

### 快速部署（Vercel）

1. 推送代码到 GitHub
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 配置环境变量
4. 部署完成

### 环境变量配置

确保在部署平台配置以下环境变量：

- `OPENAI_API_KEY`
- `OPENAI_API_BASE_URL` (可选)
- `SUPABASE_URL`
- `SUPABASE_KEY`

---

## 🧪 测试

```bash
# 类型检查
npm run type-check

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

---

## 📚 更多文档

- **[📚 文档中心](./docs/README.md)** - 完整的文档索引
- **[🚀 部署指南](./docs/deployment.md)** - 详细部署说明
- **[🤝 贡献指南](./docs/contributing.md)** - 如何参与贡献
- **[✨ 技术亮点](./docs/project-highlights.md)** - 核心技术总结
- **[📁 项目结构](./docs/project-structure.md)** - 目录结构说明

### 学习资源

- [Next.js 文档](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Supabase 向量搜索](https://supabase.com/docs/guides/ai)
- [LangChain 文档](https://js.langchain.com/)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！查看 [贡献指南](./docs/contributing.md) 了解详情。

---

## 📄 许可证

MIT License

---

## 🙏 致谢

- [Vercel AI SDK](https://sdk.vercel.ai/) - 优秀的 AI 应用开发框架
- [Supabase](https://supabase.com/) - 强大的 Backend as a Service
- [shadcn/ui](https://ui.shadcn.com/) - 美观的组件库

---

<div align="center">

**用 ❤️ 和 ☕ 构建**

Made with Next.js, TypeScript, and RAG

</div>
