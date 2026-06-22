# 草木染工坊 - 植物染工作坊预约与图案预览平台

## 项目简介

植物染工作坊预约与图案预览平台，面向手作爱好者与亲子家庭，提供从布料选择、染材搭配、扎结方式到图案预览的完整创作流程，同时支持老师端桌台时段管理与取件调度。

- 学员在手机端直观体验染材组合的纹路效果，理解颜色随机性但流程可控
- 老师在平板端高效管理材料准备、桌台分配、亲子协助和取件批次

## 原始需求

> 请制作植物染工作坊预约与图案预览页面，React 页面围绕布料选择、染材余量、扎结方式、图案模板、颜色预览、桌台时段、晾晒取件和亲子协作设计。学员在手机上挑方巾、帆布袋、T 恤或围巾，组合蓝靛、苏木、姜黄、洋葱皮等染材并预览纹路；老师平板端安排材料包、浸泡准备、桌台人数、儿童协助和取件批次。页面应有手作温度，作品预览占核心位置，预约字段围着创作过程自然展开，让用户明白颜色会有随机性但流程不是随意的。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS 3
- **状态管理**: Zustand
- **路由**: React Router DOM v6
- **图标**: Lucide React
- **图案渲染**: Canvas API

## 功能模块

### 学员端（创作工坊页）
- 布料选择：方巾、帆布袋、T恤、围巾四种布料，带材质底色分类
- 染材搭配：蓝靛、苏木、姜黄、洋葱皮、茜草、五倍子六种染材，显示余量进度条与库存预警
- **染材准备提醒**：自动检测库存不足、需提前熬煮、深色布不适用、晾干周期过长四种场景，提供替代色推荐、难度变化、老师预处理需求、取件日期影响说明
- **扎结效果预演**：螺旋、条纹、夹染、渐变、留白五种扎法，每种带难度标签、失败风险等级、预估耗时
- **纹路色块说明**：画布叠加纹路提示与色块分布说明卡，展示每种扎法的纹路样式、色块分布、材质建议
- **失败风险与避坑技巧**：展开详情后显示每种扎法的风险等级、风险描述、具体避坑技巧
- **真实成品差异说明**：明确标注手劲松紧、浸泡时长、布料材质三个维度对成品效果的影响
- 图案模板：按扎结方式分类的纹样灵感库（新增晨曦、深海、樱花、月相等适配新扎法模板）
- 颜色预览：Canvas 实时渲染五种新扎法效果，支持随机换样
- 时段预约：桌台时段选择，支持亲子协作模式
- 晾晒取件：预估晾晒时间与取件流程展示

### 老师端（工作台管理页）
- 材料包管理：染料库存监控，低量预警，面料分布统计
- 浸泡准备：染缸浸泡状态与倒计时管理
- 桌台排期：可视化桌台布局与时段人数管理
- 取件批次：按晾晒完成时间分组，批量标记取件状态

## 启动方式

### 前置要求

- Node.js >= 20
- npm 或 pnpm

### 本地开发启动

#### 1. 安装依赖

```bash
npm install
```

#### 2. 启动开发服务器

```bash
npm run dev
```

访问地址：http://localhost:5173

- 学员端首页：http://localhost:5173/
- 老师端管理页：http://localhost:5173/teacher

### Docker 一键启动（推荐）

#### 前置要求

- Docker >= 20.10
- Docker Compose >= 2.0

#### 启动命令

```bash
docker compose up --build
```

如需后台运行：

```bash
docker compose up --build -d
```

访问地址：http://localhost:5173

停止和清理服务：

```bash
docker compose down
```

查看容器日志：

```bash
docker compose logs -f
```

### 生产构建

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

访问地址：http://localhost:4173

## 目录结构

```
src/
├── components/          # 组件目录
│   ├── teacher/         # 老师端专属组件
│   │   ├── MaterialManager.tsx
│   │   ├── SoakStatusPanel.tsx
│   │   ├── TableSchedule.tsx
│   │   └── PickupBatchList.tsx
│   ├── FabricSelector.tsx      # 布料选择器
│   ├── DyeMaterialPicker.tsx   # 染材搭配区
│   ├── TieMethodSelector.tsx   # 扎结方式选择
│   ├── PatternTemplateGrid.tsx # 图案模板库
│   ├── PatternPreviewCanvas.tsx # 图案预览画布
│   ├── TimeSlotPicker.tsx      # 时段预约
│   ├── PickupInfo.tsx          # 取件信息
│   └── Empty.tsx
├── hooks/
│   ├── useWorkshopStore.ts     # Zustand 状态管理
│   └── useTheme.ts
├── lib/
│   ├── types.ts          # 类型定义
│   ├── mockData.ts       # Mock 数据
│   ├── patternRenderer.ts # Canvas 图案渲染引擎
│   └── utils.ts
├── pages/
│   ├── Workshop.tsx      # 学员端创作工坊页
│   ├── TeacherDashboard.tsx # 老师端工作台
│   └── Home.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## 设计特点

- **手作温度**：暖棕 + 靛蓝主色调，宣纸纹理背景，衬线标题字体
- **核心预览**：图案预览画布居中占据核心位置，实时响应用户选择
- **流程引导**：分步式创作流程，状态可视化，让用户明白每个步骤的意义
- **随机性提示**：明确告知植物染色的随机特性，同时展示流程的专业性
- **响应式设计**：手机端竖屏单列优化，平板端双栏布局
