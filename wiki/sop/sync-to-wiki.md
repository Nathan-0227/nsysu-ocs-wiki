---
id: sync-to-wiki
title: SOP：官網發布後同步到本站
type: sop
tags: [site, cms]
status: done
updated: 2026-11-15
sources: [worklog/2026-11-15.md]
summary: 官網發布後，把公告交給 AI 依 CLAUDE.md 更新本站
affects: [events, ocac-outstanding, ocah-scholarship-grant, ocah-shen-memorial, ocah-thesis-award, ocfef-scholarship, cantonese-tpe-scholarship, work-permit, residence, insurance, after-graduation]
---

## 什麼時候用

照 [[publish-announcement]] 在官網發布完一則公告之後；或官網的僑輔項目頁面內容有改動時。

## 步驟

1. 複製官網公告的網址或全文。
2. 開啟 AI 工具（Claude Code、Codex 等），在本專案資料夾輸入：
   ```
   請先讀 CLAUDE.md。官網有一則新公告：<網址或貼上內容>，請依 4.1 更新。
   ```
3. AI 會先列出計畫（要新增或更新哪些頁），**確認後**再讓它動手。
4. AI 完成後會自動執行 `build_index.py` 和 `lint.py`，並寫入更新紀錄。
5. 本機預覽：`python3 -m http.server 8000` → 打開 http://localhost:8000 。
6. 沒問題就 commit 並 push 到 GitHub，網站約 1 分鐘後更新。

## 檢查清單

- [ ] 公告原文已存到 `raw/announcements/`
- [ ] 同一個獎學金沒有被建成兩頁
- [ ] 首頁「獎學金」區的截止狀態正確
- [ ] lint 0 errors
- [ ] `wiki/log.md` 有新紀錄

## 常見錯誤

| 錯誤 | 後果 | 怎麼避免 |
|---|---|---|
| 新年度的獎學金另開一頁 | 歷年資料分散 | CLAUDE.md §3 第 5 條；動手前看 AI 的計畫 |
| 內容出現承辦人姓名 | 個資外流 | lint 會擋部分字詞，push 前自己再看一次 |

## 待確認

（無）
