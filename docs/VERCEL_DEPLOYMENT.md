# Vercel 部署检查清单

## ✅ 构建测试结果

### 本地构建测试

- ✅ **构建成功** - `npm run build` 完成
- ✅ **类型检查通过** - `npm run type-check` 无错误
- ✅ **生产构建优化** - Next.js 15 自动优化

### 构建输出

```
Route (app)                         Size  First Load JS
┌ ○ /                              84 kB         197 kB
├ ○ /_not-found                      0 B         113 kB
├ ƒ /api/chat                        0 B            0 B
└ ○ /icon.svg                        0 B            0 B
```

## 📋 Vercel 部署前检查

### 1. 环境变量配置（必需）

在 Vercel 项目设置中添加以下环境变量：

```env
OPENAI_API_KEY=sk-...                      # OpenAI API 密钥（必需）
OPENAI_API_BASE_URL=https://api.openai.com/v1  # OpenAI API 基础 URL（可选）
SUPABASE_URL=https://xxx.supabase.co      # Supabase 项目 URL（必需）
SUPABASE_KEY=eyJxxx...                     # Supabase 服务密钥（必需）
```

**配置步骤：**

1. 进入 Vercel 项目设置
2. 点击 "Environment Variables"
3. 添加上述变量
4. 选择环境（Production, Preview, Development）

### 2. 构建配置

- **Framework Preset**: Next.js（自动检测）
- **Build Command**: `npm run build`（已在 package.json 配置）
- **Output Directory**: `.next`（Next.js 自动）
- **Install Command**: `npm install`（默认）

### 3. Supabase 数据库准备

在部署前确保：

1. **创建表结构**

   ```sql
   CREATE TABLE public.chunks (
     id uuid NOT NULL DEFAULT gen_random_uuid(),
     content text null,
     vector extensions.vector(1536) null,
     url text null,
     date_updated timestamp without time zone DEFAULT now(),
     CONSTRAINT chunks_pkey PRIMARY KEY (id)
   );
   ```

2. **创建向量搜索函数**

   ```sql
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

3. **启用 pgvector 扩展**

   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

### 4. 填充知识库（部署后）

部署成功后，在本地运行 seed 脚本填充知识库：

```bash
npm run seed
```

**注意：** seed 脚本需要在本地运行，因为 Puppeteer 需要浏览器环境。

## 🚀 部署步骤

### 方法 1：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

### 方法 2：通过 GitHub 集成

1. 推送代码到 GitHub
2. 在 [Vercel Dashboard](https://vercel.com/dashboard) 点击 "New Project"
3. 导入 GitHub 仓库
4. 配置环境变量
5. 点击 "Deploy"

## 🔍 部署后验证

1. **检查构建日志**
   - 确认构建成功
   - 检查是否有警告

2. **功能测试**
   - [ ] 访问首页正常
   - [ ] 聊天功能正常工作
   - [ ] 向量检索功能正常
   - [ ] 流式输出正常
   - [ ] 错误处理正常

3. **性能检查**
   - 检查页面加载速度
   - 检查 API 响应时间
   - 检查构建产物大小

## ⚠️ 注意事项

1. **Turbopack**: 当前使用 `--turbopack` 标志，Vercel 会自动使用适合的构建工具
2. **Puppeteer**: seed 脚本需要本地运行，因为需要浏览器环境
3. **环境变量**: 确保所有必需的环境变量都已配置
4. **数据库连接**: 确保 Supabase 允许来自 Vercel 的请求

## 🐛 常见问题

### 构建失败

- 检查环境变量是否正确配置
- 检查 Node.js 版本（Vercel 默认使用 18.x）
- 查看构建日志获取详细错误信息

### API 路由 500 错误

- 检查环境变量（特别是 SUPABASE_URL 和 SUPABASE_KEY）
- 检查 Supabase 数据库连接
- 查看 Vercel Function Logs

### 向量搜索不工作

- 确认 pgvector 扩展已启用
- 确认 `get_relevant_chunks` 函数已创建
- 确认知识库已填充（运行 seed）

## 📊 监控建议

- 使用 Vercel Analytics 监控性能
- 配置错误监控（Sentry 等）
- 监控 API 使用量和成本
