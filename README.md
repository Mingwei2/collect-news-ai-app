# 新闻收集与AI分析系统

## 项目介绍

本项目是一个新闻收集与AI分析系统，可以通过设定关键词自动收集相关新闻，并使用AI进行智能分析和总结。系统支持定时任务，可以按照设定的时间间隔自动获取最新新闻并进行分析，帮助用户及时了解特定主题的新闻动态。

### 主要功能

- 通过关键词收集相关新闻
- 使用OpenAI进行新闻内容分析
- 支持多种分析方法
- 定时自动执行收集和分析任务
- 查看历史分析结果
- 聊天界面，支持与AI进行交互

## 项目架构

本项目采用前后端分离的架构，包含以下主要组件：

### 前端 (Frontend)

- **技术栈**：Next.js 15、React 19、TypeScript、Tailwind CSS
- **UI组件**：使用Shadncn UI和自定义组件构建现代化界面
- **功能模块**：
  - 任务管理界面：创建、查看和管理新闻收集任务
  - 聊天界面：与AI助手进行交互
  - 任务详情展示：查看任务执行结果和历史记录

### 后端 (Backend)

- **技术栈**：NestJS、TypeScript、SQLite、TypeORM
- **核心服务**：
  - NewsService: 负责从新闻API获取新闻数据
  - OpenAiService: 与OpenAI API交互，进行新闻内容分析
  - TaskService: 管理定时任务的创建、执行和状态维护
  - ChatService: 处理用户与AI的对话功能
- **数据存储**：使用SQLite数据库存储任务信息和分析结果

### 系统工作流程

1. 用户通过前端界面创建新闻收集任务，设定关键词、执行频率和分析方法
2. 后端系统按照设定的时间间隔从新闻API获取相关新闻
3. 系统将收集到的新闻发送给OpenAI进行分析和总结
4. 分析结果保存到数据库并可在前端界面查看
5. 用户可以通过聊天界面与AI进行交互，了解更多信息

## 环境要求

- Node.js 20.x+
- npm 或 yarn
- OpenAI API 密钥
- 新闻API密钥（NewsAPI）

## 如何运行

### 后端启动

```bash
cd backend
npm install
npm run start:dev
```

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

系统默认后端运行在 http://localhost:3001，前端运行在 http://localhost:3000

## 配置说明

后端需要在.env文件中配置以下环境变量：
- OPENAI_API_KEY: OpenAI API密钥
- NEWS_API_KEY: 新闻API密钥
- NEWS_API_URL: 新闻API地址
