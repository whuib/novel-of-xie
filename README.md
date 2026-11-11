# 光棍节觉醒

一个用 Hexo 构建、通过 GitHub Pages 发布的单本小说阅读站。网站包含首页、目录、正文页；阅读进度、日夜模式、字号和行距设置只保存在读者自己的浏览器中。

## 本地预览

需要 Node.js 20 或更新版本。在项目根目录运行：

```bash
npm ci
npm run dev
```

打开终端提示的本地地址，通常为 `http://localhost:4000/novel-of-xie/`。发布前可运行 `npm run build` 检查生成结果。生成文件位于 `public/`，无需手动提交。

## 更新章节

在 `source/chapters/` 编辑独立的 Markdown 文件。`fictions/fiction.md` 是拆分前的原稿备份，网站不会读取它。

新增章节时，复制一篇现有文件并修改文件名、正文和开头的 YAML 信息：

```yaml
---
layout: chapter
title: '第十五章：新的故事'
order: 14
chapter_number: 15
kind: main
permalink: chapters/017/
---

这里开始写正文。
```

- `order` 控制目录和上下篇的顺序，须唯一；要插在现有两章之间时，调整后续章节的 `order`。
- `chapter_number` 是显示在目录中的正文章号；番外不需要此字段，使用 `kind: extra`。
- `permalink` 是固定网址，须唯一。已发布章节尽量不要修改，以免旧链接失效。
- 目录与上下篇链接会在构建时自动更新。

原稿的第十章之后直接是第十二章；本站沿用原编号，未自行补写第十一章。现有 13 章正文和 3 篇番外均已导入。

## 修改网站信息

书名、简介、作者和站点地址在项目根目录的 `_config.yml`。首页的介绍文字在 `themes/paper/layout/home.ejs`。样式在 `themes/paper/source/css/reader.css`。

如果仓库名或域名发生变化，请同时修改 `_config.yml` 中的 `url` 和 `root`，再运行构建验证链接。

## 部署

站点预设发布地址为 [https://whuib.github.io/novel-of-xie/](https://whuib.github.io/novel-of-xie/)。将代码推送到 `whuib/novel-of-xie` 的 `main` 分支后，GitHub Actions 会自动构建并部署。首次发布时，在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。之后每次推送都会更新网站。可在仓库 **Actions** 页面查看运行结果。
