# 变更提案：添加聊天历史记录功能

## 为什么

当前系统在页面刷新后聊天记录会丢失，用户体验不佳。用户希望能够保存和查看历史聊天记录，以便回顾之前的对话内容。

## 变更内容

- **新增**: 在 Supabase 数据库中创建 `conversations` 和 `messages` 表来存储聊天记录
- **新增**: 实现对话列表功能，显示所有历史对话
- **新增**: 实现对话切换功能，用户可以选择不同的对话查看
- **新增**: 实现对话创建、删除、重命名功能
- **修改**: 修改聊天 API 路由，自动保存消息到数据库
- **修改**: 修改前端页面，添加侧边栏显示对话列表

## 影响范围

- **受影响的功能模块**:
  - 聊天功能 (`app/api/chat/route.ts`)
  - 前端主页面 (`app/page.tsx`)
  - 数据库架构（新增表结构）

- **受影响的代码文件**:
  - `app/api/chat/route.ts` - 需要添加消息保存逻辑
  - `app/page.tsx` - 需要添加对话列表 UI
  - `components/ChatInput.tsx` - 可能需要传递对话 ID
  - `components/ChatOutput.tsx` - 需要支持加载历史消息

- **数据库变更**:
  - 新增 `conversations` 表（id, title, created_at, updated_at）
  - 新增 `messages` 表（id, conversation_id, role, content, created_at）

## 技术考虑

- 使用 Supabase 作为数据存储
- 对话标题自动生成（使用第一条用户消息的前 50 个字符）
- 支持对话重命名功能
- 实现软删除（is_deleted 标记）以便未来恢复
