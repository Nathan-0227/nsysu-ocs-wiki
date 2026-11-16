---
id: about
title: 關於本站
type: meta
tags: [site]
status: done
updated: 2026-11-15
sources: []
summary: 本站是什麼、為什麼做、怎麼一直更新
---

## 這是什麼

中山大學國際事務處「[僑生學位生專區](https://oia.nsysu.edu.tw/p/412-1308-20533.php?Lang=zh-tw)」（平台為 Rpage）的**網站管理傳承手冊**，由目前的網站管理者整理，目的是讓下一任接手時不用從零摸索。

> ⚠️ 本站為個人整理的非官方網站。僑生資訊請以官網公告為準。

## 兩個部分

| 部分 | 內容 |
|---|---|
| **管理手冊（主體）** | [[handover-guide]]、[[routine-tasks]]、[[glossary]]、Rpage 四大功能說明，以及 5 份任務 SOP |
| **成果範例：僑生資訊** | 依手冊維護出來的獎學金、僑輔指南、活動與徵才總表：把官網依日期排列的公告整理成一個主題一頁 |

## 資料怎麼一直更新

```
管理者學到新東西、遇到新問題、回答待確認
  → 寫進 raw/worklog/ → AI 依 CLAUDE.md §4.3 更新管理手冊
官網發布新公告（照 SOP）
  → 原文存進 raw/ → AI 依 CLAUDE.md §4.1 更新僑生資訊
每學期
  → scripts/check_links.py 檢查所有官網連結 → 依 §4.2 核對
全部完成後
  → build_index.py 產生 manifest.json；lint.py 自動驗收（0 errors）
  → 網站自動顯示最新內容，不用改 HTML
```

規則全部寫在專案根目錄的 `CLAUDE.md`，每次變更都記錄在「更新紀錄」。
