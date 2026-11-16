# 僑生專區網站管理手冊（Rpage 傳承手冊）

中山大學國際事務處「僑生學位生專區」（平台：Rpage）的**網站管理傳承手冊**，讓下一任管理者接手時不用從零摸索；並附上依手冊維護出來的**僑生資訊成果範例**。

- 🌐 網站：`https://<你的帳號>.github.io/nsysu-ocs-wiki/`
- 📜 AI 規則：[CLAUDE.md](./CLAUDE.md)（其他 AI 工具請讀 [AGENTS.md](./AGENTS.md)）

> 管理理念：網頁管理是沒有盡頭的優化；一切以使用者（僑生同學）的體驗為出發點。

## 內容

| 部分 | 內容 |
|---|---|
| 管理手冊（主體） | 交接指南、例行工作（每週／每學期／每年）、名詞解釋、Rpage 四大功能（資訊／模組／頁面／文檔管理）、5 份任務 SOP |
| 成果範例：僑生資訊 | 12 個獎助學金、10 篇僑輔指南、活動／活動回顧／徵才總表 |

## 怎麼更新

```
學到新東西、遇到新問題 → raw/worklog/ → AI 依 CLAUDE.md §4.3 更新手冊
官網新公告            → raw/announcements/ → AI 依 §4.1 更新僑生資訊
每學期                → scripts/check_links.py 檢查連結 → 依 §4.2 核對
```

更新內容**不需要改任何 HTML**。對 AI 說：

```
請先讀 CLAUDE.md。我今天學會……，請依 4.3 更新管理手冊。
```

## 本機預覽與檢查

```bash
python3 scripts/build_index.py   # 重新產生索引
python3 scripts/lint.py          # 健檢，0 errors 才算完成
python3 scripts/check_links.py   # 檢查所有官網連結（需要網路）
python3 -m http.server 8000      # 打開 http://localhost:8000
```

## 資料夾

```
raw/        原始資料（工作紀錄、官網公告、頁面擷取、Rpage 公開文件摘要）
wiki/       整理後的頁面（handbook / sop / scholarships / guides / lists / meta）
templates/  新增頁面用的模板
scripts/    建置、健檢、連結檢查腳本（只用 Python 標準函式庫）
assets/     網站樣式與程式
```

> 本站為個人整理的非官方網站，僑生資訊以[官網公告](https://oia.nsysu.edu.tw/p/412-1308-20533.php?Lang=zh-tw)為準。
