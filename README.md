<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 《拉集》 (LAJI JOURNAL)

> **凡俗之料，皆可成集。**

《拉集》(LAJI JOURNAL) 是一本致力于传播高度可疑、极其具体且无意中令人捧腹的学术研究的数字期刊系统。我们相信，即使是最普通的问题，也值得拥有一个看起来很严肃的 PDF。

## 🌟 核心功能

- **自动化学术评估**：每篇论文自动生成“影响因子”、“引用数”及“评审得分”，营造专业的学术仪象。
- **AI 自动化收录**：基于 Gemini 3.1 的自动化解析（及手动兜底解析），高效提取中英双语摘要、关键词等元数据。
- **精品渲染排版**：支持上标引用渲染的内置 Markdown 阅读器，并提供精排版的学术风格 PDF 预览。
- **自动归档管理**：文件处理后自动搬运至期刊目录，并在 `src/data/papers.ts` 中自动注册，保持项目高度有序。

## 🚀 快速开始

### 环境依赖
- Node.js (v18+)

### 安装与运行
1. **安装依赖**：
   ```bash
   npm install
   ```
2. **配置 API Key**：
   在根目录下创建 `.env` 文件并填入你的 Gemini API Key：
   ```env
   GEMINI_API_KEY=你的_API_KEY
   ```
3. **本地开发**：
   ```bash
   npm run dev
   ```

## 📥 自动化收录流程

要收录新的 Markdown 论文，只需：

1. 将 `.md` 文件放入根目录的 `src/data/papers/unknown/` 文件夹下。
2. 运行自动化导入脚本：
   ```bash
   npx tsx scripts/import_papers.ts
   ```
3. 脚本将自动：
   - 提取元数据并生成随机学术指标。
   - 将 MD 转换为精美的学术 PDF。
   - 将原文件与 PDF 移动到正式归档目录。
   - 自动更新主注册表。

---

*“凡俗之料，皆可成集。”*
