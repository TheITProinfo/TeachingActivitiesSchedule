# 教学活动日程表管理系统

基于 Next.js 和 Supabase 构建的现代化教学活动管理系统，支持公开查询和后台管理功能。

## ✨ 功能特性

### 公开页面
- 📅 **实时筛选**：支持日期范围、活动标题、演讲者姓名多条件筛选
- 🔄 **自动刷新**：输入变化自动更新搜索结果
- 📱 **响应式设计**：完美适配电脑和移动设备
- 🎨 **简洁美观**：教学场景专属的清爽界面

### 管理后台
- 🔐 **安全认证**：OAuth 登录（支持 Google 和 GitHub）
- ✏️ **活动管理**：完整的增删改查功能
- 👥 **权限控制**：仅 admin 用户可访问
- 🛡️ **RLS 保护**：数据库级别的安全策略

### 数据字段
- 活动标题
- 开始时间
- 结束时间
- 地点
- 演讲者
- 活动描述

## 🛠️ 技术栈

- **前端框架**：Next.js 14 (App Router)
- **开发语言**：JavaScript
- **样式方案**：Tailwind CSS
- **后端服务**：Supabase (数据库 + 认证)
- **测试框架**：Jest + React Testing Library

## 📁 项目结构

```
demo2/
├── app/                          # Next.js App Router 页面
│   ├── admin/                    # 管理后台
│   │   ├── layout.js            # 管理后台布局（认证检查）
│   │   └── page.js              # 管理后台主页面
│   ├── auth/                     # 认证相关
│   │   └── callback/            # OAuth 回调
│   │       └── route.js
│   ├── login/                    # 登录页面
│   │   └── page.js
│   ├── globals.css              # 全局样式
│   ├── layout.js                # 根布局
│   └── page.js                  # 首页（公开页面）
├── components/                   # React 组件
│   ├── admin/                    # 管理后台组件
│   │   ├── ActivityForm.js      # 活动表单
│   │   └── ActivityList.js      # 活动列表
│   ├── ActivityCard.js          # 活动卡片
│   └── SearchFilters.js         # 搜索筛选
├── lib/                          # 工具库
│   ├── supabase/                # Supabase 客户端
│   │   ├── client.js            # 浏览器端客户端
│   │   ├── server.js            # 服务端客户端
│   │   └── middleware.js        # 会话刷新中间件
│   └── utils/                    # 工具函数
│       ├── checkAdmin.js        # 权限检查
│       └── formatDate.js        # 日期格式化
├── __tests__/                    # 测试文件
│   ├── search.test.js           # 搜索功能测试
│   └── admin.test.js            # 管理功能测试
├── middleware.js                 # Next.js 中间件（路由保护）
├── supabase-schema.sql          # 数据库架构 SQL
├── package.json                  # 项目依赖
├── next.config.js               # Next.js 配置
├── tailwind.config.js           # Tailwind 配置
├── jest.config.js               # Jest 配置
└── README.md                     # 项目文档
```

## 🚀 快速开始

### 1. 环境要求

- Node.js >= 18.0.0
- npm 或 yarn
- Supabase 账号

### 2. 安装依赖

```bash
cd demo2
npm install
```

### 3. 配置环境变量

复制 `.env.local.example` 为 `.env.local`：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入您的 Supabase 凭据：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> 💡 在 [Supabase Dashboard](https://app.supabase.com) 的项目设置 > API 中获取这些密钥

### 4. 配置 Supabase

#### 4.1 创建数据库表和 RLS 策略

1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 选择您的项目
3. 进入 SQL Editor
4. 复制 `supabase-schema.sql` 的全部内容并执行

这将创建：
- `teaching_activities` 表（存储活动数据）
- `user_roles` 表（管理用户角色）
- RLS 策略（权限控制）
- 10 条模拟教学活动数据

#### 4.2 配置 OAuth 认证

1. 在 Supabase Dashboard 中，进入 Authentication > Providers
2. 启用 Google 和/或 GitHub 提供商
3. 配置回调 URL：`http://localhost:3000/auth/callback`（开发环境）

#### 4.3 设置管理员用户

1. 使用 OAuth 登录一次（创建用户账号）
2. 在 Supabase Dashboard 的 Authentication > Users 中找到您的用户 ID
3. 在 SQL Editor 中执行以下命令（替换 `YOUR_USER_UUID`）：

```sql
INSERT INTO user_roles (user_id, role) 
VALUES ('YOUR_USER_UUID', 'admin');
```

### 5. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🧪 测试

### 运行所有测试

```bash
npm test
```

### 运行测试并查看覆盖率

```bash
npm run test:coverage
```

### 监听模式运行测试

```bash
npm run test:watch
```

## 📝 使用说明

### 公开页面

1. 访问首页查看所有教学活动
2. 使用筛选条件：
   - **日期范围**：选择开始和结束日期
   - **活动标题**：输入关键词搜索
   - **演讲者姓名**：输入演讲者名字
3. 筛选条件实时生效，无需点击搜索按钮
4. 点击"重置筛选"清除所有条件

### 管理后台

1. 点击导航栏的"管理后台"或访问 `/admin`
2. 使用 Google 或 GitHub 账号登录
3. 登录后可以：
   - 查看所有活动列表
   - 点击"+ 新增活动"创建新活动
   - 点击"编辑"修改现有活动
   - 点击"删除"移除活动（需确认）

> ⚠️ 只有被设置为 admin 角色的用户才能访问管理后台

## 🔒 安全性

### RLS 策略

数据库使用 Row Level Security (RLS) 强制执行权限：

- ✅ **所有人**（包括匿名用户）：可查看活动
- ✅ **Admin 用户**：可增删改查活动
- ❌ **普通用户**：无法修改活动数据

### 环境变量安全

- `NEXT_PUBLIC_*` 变量会暴露给浏览器，仅包含公开信息
- `SUPABASE_SERVICE_ROLE_KEY` 仅在服务端使用，永不暴露

## 🌐 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量（与 `.env.local` 相同）
4. 更新 Supabase OAuth 回调 URL 为生产域名

### 其他平台

项目可部署到任何支持 Next.js 的平台：
- Netlify
- Railway
- AWS Amplify
- 自托管服务器

## 🐛 常见问题

### Q: 登录后无法访问管理后台？
A: 确保您的用户已在 `user_roles` 表中设置为 admin 角色。

### Q: 筛选功能不工作？
A: 检查浏览器控制台是否有错误，确认 Supabase 连接正常。

### Q: 测试失败？
A: 运行 `npm install` 确保所有依赖已安装，检查 Jest 配置。

### Q: OAuth 登录失败？
A: 检查 Supabase Dashboard 中 OAuth 提供商配置和回调 URL 设置。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题，请通过 GitHub Issues 联系。

---

**技术支持**: Next.js 14 + Supabase + Tailwind CSS  
**开发语言**: JavaScript (ES6+)  
**数据库**: PostgreSQL (Supabase)
