# 部署指南

> 返回 [文档中心](./README.md) | [项目主页](../README.md)

本文档说明如何部署 RAGShuttle (羽智RAG) 项目到生产环境。

## 🚀 Vercel 部署（推荐）

### 1. 准备工作

1. 确保代码已推送到 GitHub
2. 在 [Vercel](https://vercel.com) 注册账号
3. 连接 GitHub 账号

### 2. 部署步骤

1. **导入项目**
   - 点击 "New Project"
   - 选择 GitHub 仓库
   - 导入 RAGShuttle 项目

2. **配置环境变量**

   ```js
   OPENAI_API_KEY=sk-...
   OPENAI_API_BASE_URL=https://api.openai.com/v1
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_KEY=eyJxxx...
   ```

3. **部署设置**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成

### 3. 部署后配置

1. **初始化数据库**
   - 在 Supabase Dashboard 执行 SQL 脚本（见 README.md）
   - 运行 seed 脚本填充知识库：

     ```bash
     npm run seed
     ```

2. **验证部署**
   - 访问部署的 URL
   - 测试聊天功能

---

## 🐳 Docker 部署

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 构建和运行

```bash
docker build -t ragshuttle .
docker run -p 3000:3000 --env-file .env.local ragshuttle
```

---

## ☁️ 其他平台

### Railway

1. 连接 GitHub 仓库
2. 配置环境变量
3. 自动部署

### Render

1. 创建 Web Service
2. 连接 GitHub
3. 配置环境变量和构建命令

---

## 📋 部署检查清单

- [ ] 环境变量已配置
- [ ] 数据库已初始化
- [ ] 知识库已填充（运行 seed）
- [ ] 构建成功
- [ ] 功能测试通过
- [ ] 错误监控已配置（可选）

---

## 🔧 故障排除

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本（需要 18+）
   - 检查依赖安装

2. **API 错误**
   - 验证环境变量是否正确
   - 检查 API 密钥权限

3. **数据库连接失败**
   - 验证 Supabase URL 和 Key
   - 检查网络连接

---

**需要帮助？** 请创建 Issue。
