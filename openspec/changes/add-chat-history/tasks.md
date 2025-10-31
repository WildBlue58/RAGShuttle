# 实现任务清单

## 1. 数据库设计

- [ ] 1.1 在 Supabase 中创建 `conversations` 表
  - id (uuid, primary key)
  - title (text)
  - created_at (timestamp)
  - updated_at (timestamp)
  - is_deleted (boolean, default false)
- [ ] 1.2 在 Supabase 中创建 `messages` 表
  - id (uuid, primary key)
  - conversation_id (uuid, foreign key to conversations)
  - role (text: 'user' | 'assistant')
  - content (text)
  - created_at (timestamp)
- [ ] 1.3 创建数据库索引优化查询性能
  - conversations 表：created_at, is_deleted
  - messages 表：conversation_id, created_at

## 2. 后端 API 实现

- [ ] 2.1 修改 `app/api/chat/route.ts`
  - 在 POST 方法中添加对话创建逻辑（如果 conversation_id 不存在）
  - 保存用户消息到 messages 表
  - 保存 AI 回复到 messages 表
  - 更新 conversation 的 updated_at 时间戳
- [ ] 2.2 创建 `app/api/conversations/route.ts`
  - GET: 获取用户的所有对话列表（按 updated_at 倒序）
  - POST: 创建新对话
  - PATCH: 更新对话标题
  - DELETE: 软删除对话
- [ ] 2.3 创建 `app/api/conversations/[id]/messages/route.ts`
  - GET: 获取指定对话的所有消息

## 3. 前端组件实现

- [ ] 3.1 创建 `components/ConversationList.tsx`
  - 显示对话列表
  - 支持对话切换
  - 支持创建新对话
  - 支持删除对话
  - 支持重命名对话
- [ ] 3.2 修改 `app/page.tsx`
  - 添加侧边栏布局
  - 集成 ConversationList 组件
  - 根据选中的对话 ID 加载历史消息
  - 传递 conversation_id 给 useChat Hook
- [ ] 3.3 修改 `components/ChatInput.tsx`
  - 支持传入 conversation_id（可选）
- [ ] 3.4 修改 `components/ChatOutput.tsx`
  - 支持加载和显示历史消息

## 4. 状态管理

- [ ] 4.1 实现对话选择状态管理
  - 当前选中的对话 ID
  - 对话列表数据
- [ ] 4.2 实现消息加载逻辑
  - 切换对话时加载历史消息
  - 新消息追加到现有消息列表

## 5. UI/UX 优化

- [ ] 5.1 添加加载状态指示器
- [ ] 5.2 添加空状态提示（无对话时）
- [ ] 5.3 实现对话标题自动生成（使用第一条消息的前 50 个字符）
- [ ] 5.4 优化移动端响应式布局

## 6. 测试与验证

- [ ] 6.1 测试对话创建和消息保存
- [ ] 6.2 测试对话切换和历史消息加载
- [ ] 6.3 测试对话删除功能
- [ ] 6.4 测试对话重命名功能
- [ ] 6.5 验证页面刷新后对话列表和数据完整性
