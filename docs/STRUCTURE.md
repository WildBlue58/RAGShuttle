# 📚 文档结构说明

本文档说明 RAGShuttle 项目的文档组织结构。

## 文档分类

### 🏠 根目录

- **`README.md`** - 项目主入口文档
  - 项目简介、快速开始、技术栈
  - 包含指向其他文档的链接

### 📖 `/docs` - 用户文档

面向用户和开发者的完整文档集合：

- **`README.md`** - 文档中心索引，所有文档的导航入口
- **`contributing.md`** - 贡献指南，如何参与项目
- **`deployment.md`** - 部署指南，生产环境部署说明
- **`project-highlights.md`** - 技术亮点，适合简历和作品集
- **`project-structure.md`** - 项目结构，代码组织说明
- **`STRUCTURE.md`** - 文档结构说明（本文件）

### 🔧 `/openspec` - 开发规范文档

规范驱动开发相关文档：

- **`AGENTS.md`** - AI 助手使用指南
- **`project.md`** - 项目技术栈和上下文
- **`工作流说明.md`** - OpenSpec 工作流详细说明
- **`specs/`** - 功能规范（已实现的功能）
- **`changes/`** - 变更提案（待实现/进行中的功能）

## 文档组织原则

### 1. 清晰分层

- **根目录**：快速入口（README.md）
- **docs/**：完整文档集合
- **openspec/**：开发规范文档

### 2. 易于查找

- 所有文档都有清晰的标题和导航链接
- 文档中心提供完整的索引
- 文档间相互链接，便于跳转

### 3. 分类明确

- **用户文档**（docs/）：面向使用者和贡献者
- **开发规范**（openspec/）：面向开发者内部流程

## 文档导航

### 快速查找指南

| 需求 | 推荐文档 |
|------|---------|
| 快速了解项目 | [README.md](../README.md) |
| 部署项目 | [docs/deployment.md](./deployment.md) |
| 参与贡献 | [docs/contributing.md](./contributing.md) |
| 写简历项目 | [docs/project-highlights.md](./project-highlights.md) |
| 了解代码结构 | [docs/project-structure.md](./project-structure.md) |
| 使用 OpenSpec | [openspec/工作流说明.md](../openspec/工作流说明.md) |
| AI 助手指南 | [openspec/AGENTS.md](../openspec/AGENTS.md) |

## 文档维护

- 所有文档使用简体中文
- 保持文档与代码同步更新
- 新文档应添加到相应的分类目录
- 重要变更应在相关文档中更新

---

**最后更新**: 2025-01-31
