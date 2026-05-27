# 电影动漫推荐墙升级 Spec

## Why
现有页面为纯静态展示页，缺少交互筛选、搜索、点赞收藏等功能。需要升级为具备完整交互能力、动效丰富、移动端适配的单页应用，满足"项目实训（一）第二次课"的全部验收标准。

## What Changes
- 新增分类筛选功能（按"动画电影/科幻电影/动漫"标签筛选卡片）
- 新增搜索功能（按标题关键字实时搜索过滤）
- 新增加载状态提示（模拟数据加载过程）
- 新增点赞/收藏系统（基于 localStorage 持久化存储）
- 新增 Lightbox 画廊效果（点击卡片图片放大预览）
- **替换** Unsplash 占位图为 AI 生成的主题图片（6张，按电影/动漫主题生成）
- 增强动画效果：保留现有滚动淡入 + 卡片 hover 放大，新增筛选切换过渡动画
- 所有 CSS/JS 内联到单个 HTML 文件，确保可直接运行
- 保持使用现有 CSS 变量体系

## Impact
- Affected specs: 无（新项目首次规格）
- Affected code: `index.html`（完全重写为单文件）、`styles.css`（合并入 HTML）、`script.js`（合并入 HTML）

## ADDED Requirements

### Requirement: 分类筛选
系统 SHALL 提供按标签类型的分类筛选按钮组，用户点击后仅显示对应分类的卡片。

#### Scenario: 筛选"动画电影"
- **WHEN** 用户点击"动画电影"筛选按钮
- **THEN** 仅显示标签为"动画电影"的卡片，其余卡片平滑隐藏

#### Scenario: 重置筛选
- **WHEN** 用户点击"全部"按钮
- **THEN** 显示全部卡片

### Requirement: 关键字搜索
系统 SHALL 提供搜索输入框，用户输入关键字后实时过滤卡片。

#### Scenario: 搜索"千"
- **WHEN** 用户在搜索框输入"千"
- **THEN** 仅显示标题包含"千"的卡片（"千与千寻"）

#### Scenario: 清空搜索
- **WHEN** 用户清空搜索框
- **THEN** 恢复当前筛选分类下的全部卡片

### Requirement: 加载状态提示
系统 SHALL 在页面初始加载和筛选/搜索操作时显示加载状态指示器。

#### Scenario: 页面初次加载
- **WHEN** 页面首次打开
- **THEN** 显示 loading 动画，持续 800ms 后显示内容

#### Scenario: 筛选切换
- **WHEN** 用户切换筛选分类
- **THEN** 卡片区域短暂显示过渡动画（200ms），再呈现结果

### Requirement: 点赞收藏系统
系统 SHALL 为每张卡片提供点赞按钮，点赞状态存储在 localStorage 中，刷新页面后保持。

#### Scenario: 点赞一张卡片
- **WHEN** 用户点击卡片的点赞按钮
- **THEN** 按钮变为已点赞状态（红色爱心），计数+1，状态存入 localStorage

#### Scenario: 取消点赞
- **WHEN** 用户再次点击已点赞的卡片按钮
- **THEN** 按钮恢复未点赞状态，计数-1，localStorage 更新

#### Scenario: 刷新页面后保留状态
- **WHEN** 用户刷新页面
- **THEN** 之前点赞的卡片仍显示为已点赞状态

### Requirement: AI 生成图片
系统 SHALL 使用 AI 生成的电影/动漫主题图片替换现有的 Unsplash 占位图。

#### Scenario: 每张卡片展示 AI 图片
- **WHEN** 页面加载完成
- **THEN** 6张卡片均展示与内容匹配的 AI 生成图片

### Requirement: Lightbox 画廊
系统 SHALL 支持点击卡片图片弹出 Lightbox 全屏预览。

#### Scenario: 打开 Lightbox
- **WHEN** 用户点击卡片图片
- **THEN** 全屏遮罩层展示大图，带关闭按钮和键盘 ESC 关闭

#### Scenario: 关闭 Lightbox
- **WHEN** 用户点击关闭按钮或按 ESC 键
- **THEN** Lightbox 平滑关闭

### Requirement: 动效增强
系统 SHALL 包含至少2种动效。

#### Scenario: 卡片滚动淡入
- **WHEN** 卡片进入视口
- **THEN** 卡片以淡入+上移动画呈现（已有，保留）

#### Scenario: 卡片 hover 放大
- **WHEN** 鼠标悬停在卡片上
- **THEN** 卡片上浮 8px + 阴影加深 + 图片放大 1.05 倍（已有，保留）

#### Scenario: 筛选切换过渡
- **WHEN** 筛选条件变化
- **THEN** 卡片以缩放/透明度过渡动画切换显示

### Requirement: 移动端适配
系统 SHALL 在手机端正常展示和交互。

#### Scenario: 手机端布局
- **WHEN** 视口宽度 ≤ 768px
- **THEN** 卡片单列排列，筛选按钮组换行，搜索框占满宽度

### Requirement: 代码规范
系统 SHALL 保持代码结构清晰，关键逻辑有注释，CSS 使用已有变量体系。