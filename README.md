# 中山僑生資訊站（非官方整理）

把國立中山大學國際事務處「僑生學位生」專區的公告，整理成**一個主題一頁**的知識庫，並附上官網維護手冊（SOP）。

- 🌐 網站：`https://<你的帳號>.github.io/nsysu-ocs-wiki/`
- 📜 AI 規則：[CLAUDE.md](./CLAUDE.md)（其他 AI 工具請讀 [AGENTS.md](./AGENTS.md)）

## 兩個部分

| 部分 | 內容 | 讀者 |
|---|---|---|
| A. 僑生資訊 | 獎學金（含截止狀態）、僑輔指南、活動總表 | 在校僑生 |
| B. 維護手冊 | 官網後台發布公告的 SOP、命名規則 | 官網管理者與接手的人 |

## 資料怎麼更新

```
raw/（原始資料，只增不改） → AI 依 CLAUDE.md 整理 → wiki/（Markdown 頁面）
    → scripts/build_index.py 產生 wiki/manifest.json → 網站自動顯示
```

更新內容**不需要改任何 HTML**。對 AI 說：

```
請先讀 CLAUDE.md。官網有一則新公告：<網址>，請依 4.1 更新。
```

## 本機預覽與檢查

```bash
python3 scripts/build_index.py   # 重新產生索引
python3 scripts/lint.py          # 健檢，0 errors 才算完成
python3 -m http.server 8000      # 打開 http://localhost:8000
```

## 資料夾

```
raw/        原始資料（官網公告、頁面擷取、工作紀錄）
wiki/       整理後的頁面（scholarships / guides / lists / sop / meta）
templates/  新增頁面用的模板
scripts/    建置與健檢腳本（只用 Python 標準函式庫）
assets/     網站樣式與程式
```

> 本站為個人整理，所有資訊以[官網公告](https://oia.nsysu.edu.tw/p/412-1308-20533.php?Lang=zh-tw)為準。
