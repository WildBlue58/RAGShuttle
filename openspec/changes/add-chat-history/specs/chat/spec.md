# 聊天功能规范

## ADDED Requirements

### Requirement: 聊天历史记录存储
系统 SHALL 将所有用户消息和 AI 回复保存到数据库中，包括对话的元数据信息。

#### Scenario: 保存新消息
- **WHEN** 用户发送消息或 AI 生成回复
- **THEN** 消息内容、角色、时间戳和关联的对话 ID 被保存到 messages 表
- **AND** 关联的 conversation 记录的 updated_at 字段被更新

#### Scenario: 创建新对话
- **WHEN** 用户开始新的对话（无 conversation_id）
- **THEN** 系统自动创建新的 conversation 记录
- **AND** conversation 的 title 初始化为第一条用户消息的前 50 个字符（如果超过则截断）

### Requirement: 对话列表管理
系统 SHALL 提供对话列表功能，允许用户查看、切换、创建、删除和重命名对话。

#### Scenario: 查看对话列表
- **WHEN** 用户打开应用
- **THEN** 侧边栏显示所有未删除的对话列表
- **AND** 对话按 updated_at 倒序排列（最近更新的在前）

#### Scenario: 切换对话
- **WHEN** 用户点击对话列表中的某个对话
- **THEN** 系统加载该对话的所有历史消息
- **AND** 聊天界面显示该对话的完整消息历史
- **AND** 当前选中的对话在列表中高亮显示

#### Scenario: 创建新对话
- **WHEN** 用户点击"新建对话"按钮
- **THEN** 系统创建一个新的对话记录
- **AND** 对话标题初始化为"新对话"或第一条消息的前 50 个字符
- **AND** 聊天界面清空，准备接收新消息

#### Scenario: 删除对话
- **WHEN** 用户点击对话的删除按钮
- **THEN** 系统将对话标记为已删除（is_deleted = true）
- **AND** 对话从列表中移除
- **AND** 关联的消息保留在数据库中（软删除）

#### Scenario: 重命名对话
- **WHEN** 用户点击对话标题并输入新名称
- **THEN** 系统更新对话的 title 字段
- **AND** 对话列表立即反映新标题

### Requirement: 历史消息加载
系统 SHALL 支持加载指定对话的所有历史消息，并正确显示在聊天界面中。

#### Scenario: 加载历史消息
- **WHEN** 用户选择某个已有对话
- **THEN** 系统从数据库中查询该对话的所有消息
- **AND** 消息按 created_at 正序排列
- **AND** 消息正确显示在 ChatOutput 组件中
- **AND** 用户消息和 AI 回复正确区分显示

#### Scenario: 空对话状态
- **WHEN** 用户创建一个新对话但尚未发送消息
- **THEN** 聊天界面显示空状态提示
- **AND** 提示用户可以开始提问

## MODIFIED Requirements

### Requirement: 聊天消息处理
系统 SHALL 处理用户消息并生成 AI 回复，同时保存消息到数据库。

#### Scenario: 发送消息并保存
- **WHEN** 用户发送消息
- **THEN** 消息立即显示在聊天界面中
- **AND** 消息保存到当前对话的 messages 表中
- **AND** 系统生成 AI 回复并流式输出
- **AND** AI 回复完成后也保存到 messages 表中

#### Scenario: 继续现有对话
- **WHEN** 用户在现有对话中发送新消息
- **THEN** 新消息追加到该对话的消息列表中
- **AND** AI 回复时考虑该对话的历史上下文
- **AND** 所有消息按时间顺序正确显示

