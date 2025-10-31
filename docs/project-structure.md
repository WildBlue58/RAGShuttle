# 项目结构说明

> 返回 [文档中心](./README.md) | [项目主页](../README.md)

本文档详细说明 RAGShuttle 项目的目录结构和组织方式。

## 📁 目录结构

```
RAGShuttle/
├── app/                          # Next.js App Router
│   ├── api/                      # API 路由
│   │   └── chat/
│   │       └── route.ts         # 聊天 API（RAG 实现）
│   ├── globals.css               # 全局样式
│   ├── icon.svg                  # 应用图标
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 主页面
│
├── components/                   # React 组件
│   ├── ui/                       # shadcn/ui 基础组件
│   │   ├── button.tsx
│   │   └── input.tsx
│   ├── ChatInput.tsx            # 聊天输入组件
│   └── ChatOutput.tsx           # 聊天输出组件
│
├── lib/                          # 工具函数和配置
│   ├── utils.ts                 # 通用工具函数（cn、clsx 等）
│   ├── types/                   # TypeScript 类型定义
│   │   └── index.ts             # 全局类型（ChunkItem、ChatMessage 等）
│   └── constants/               # 常量配置
│       └── index.ts             # 配置常量（向量搜索、AI 模型等）
│
├── scripts/                      # 脚本文件
│   └── seed.ts                  # 知识库填充脚本（爬虫 + 向量化）
│
├── public/                       # 静态资源
│   └── favicon.svg              # 网站图标
│
├── openspec/                     # OpenSpec 规范文档
│   ├── AGENTS.md                # AI 助手使用指南
│   ├── project.md                # 项目上下文和技术栈
│   ├── 工作流说明.md            # OpenSpec 工作流说明
│   ├── specs/                   # 功能规范（已实现）
│   └── changes/                 # 变更提案（待实现/进行中）
│       ├── add-chat-history/    # 聊天历史功能提案
│       ├── convert-to-badminton-domain/  # 领域迁移提案
│       └── archive/             # 已归档的变更
│
├── .gitignore                    # Git 忽略文件
├── components.json               # shadcn/ui 配置
├── next.config.ts                # Next.js 配置
├── package.json                  # 项目依赖和脚本
├── postcss.config.mjs            # PostCSS 配置
├── tsconfig.json                 # TypeScript 配置
│
├── README.md                     # 项目主文档
├── docs/                          # 项目文档
│   ├── README.md                 # 文档中心索引
│   ├── contributing.md           # 贡献指南
│   ├── deployment.md             # 部署指南
│   ├── project-highlights.md     # 技术亮点总结
│   └── project-structure.md      # 项目结构说明（本文件）
```

## 📋 目录说明

### `/app` - Next.js 应用目录
使用 Next.js 15 App Router，包含：
- **页面和布局**：`page.tsx`、`layout.tsx`
- **API 路由**：`api/chat/route.ts` 实现 RAG 聊天接口
- **全局样式**：`globals.css`

### `/components` - React 组件
- **业务组件**：`ChatInput`、`ChatOutput`
- **UI 基础组件**：`ui/` 目录下的 shadcn/ui 组件

### `/lib` - 工具库
- **`utils.ts`**：通用工具函数（如 `cn` 函数用于 className 合并）
- **`types/`**：集中的类型定义，避免类型分散
- **`constants/`**：配置常量，便于统一管理和修改

### `/scripts` - 脚本文件
- **`seed.ts`**：知识库构建脚本，负责爬取、分块、向量化数据

### `/public` - 静态资源
- 存放不需要构建处理的静态文件（图标、图片等）

### `/openspec` - 规范文档
- 使用 OpenSpec 进行规范驱动开发
- 维护功能规范和变更提案

## 🎯 设计原则

### 1. 单一职责
每个目录和文件都有明确的职责，避免功能混杂。

### 2. 可扩展性
- `lib/types/` 和 `lib/constants/` 便于后续扩展
- `components/` 按功能分类组织

### 3. 类型安全
- 所有类型定义集中在 `lib/types/`
- 使用 TypeScript 严格模式

### 4. 配置集中化
- 常量配置集中在 `lib/constants/`
- 环境变量通过 `.env` 管理

## 📝 文件命名规范

- **组件文件**：PascalCase（如 `ChatInput.tsx`）
- **工具文件**：camelCase（如 `utils.ts`）
- **类型文件**：`index.ts`（便于导入）
- **常量文件**：`index.ts`（便于导入）

## 🔄 导入路径规范

使用路径别名 `@/` 引用项目根目录：

```typescript
// 类型导入
import type { ChunkItem, ChatMessage } from "@/lib/types";

// 常量导入
import { VECTOR_SEARCH_CONFIG, AI_MODELS } from "@/lib/constants";

// 组件导入
import ChatInput from "@/components/ChatInput";
```

## 🚀 扩展指南

### 添加新功能时
1. **新组件**：放在 `components/` 相应位置
2. **新类型**：添加到 `lib/types/index.ts`
3. **新常量**：添加到 `lib/constants/index.ts`
4. **新 API**：在 `app/api/` 下创建新路由

### 添加新脚本时
1. 放在 `scripts/` 目录
2. 在 `package.json` 中添加对应脚本命令

---

**最后更新**: 2025-01-31

