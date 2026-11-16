# CLAUDE.md — 僑生專區 Rpage 網站管理傳承手冊（員工手冊）

> 每次開始工作前，先完整讀完這份文件。不確定的地方，**先問，不要猜**。
> 本文件依「好老闆要說清楚三件事」撰寫：**要什麼成品（§2）→ 有什麼限制（§3）→ 怎麼算做完（§5）**。

---

## 0. 這個專案是什麼

這是國立中山大學國際事務處「僑生學位生」專區（以下稱「官網」，平台為 **Rpage**）的**網站管理傳承手冊**。

**目的：讓下一任網站管理者接手時，不用從零摸索。** 前任管理者的經驗、後台操作、例行工作與遇過的問題，都整理在這裡，並且隨著工作持續更新。

**管理理念**（寫手冊、改網站時都要以此為準）：網頁管理是沒有盡頭的優化；一切以**使用者（僑生同學）的體驗**為出發點。

本專案有兩個部分：

| 部分 | 給誰看 | 內容 |
|---|---|---|
| **B. 管理手冊（主體）** | 官網管理者與接手的人 | 交接指南、例行工作、名詞解釋、Rpage 功能說明（`handbook/`），以及任務 SOP（`sop/`） |
| **A. 僑生資訊（成果範例）** | 在校僑生 | 依手冊維護出來的成果：獎學金、僑輔指南、活動與徵才總表，把官網「依日期排列的公告」整理成**一個主題一頁** |

兩個部分用同一個流程串起來：

```
學校發新公告
  ├─ B：管理者照 SOP 在官網（Rpage）發布
  └─ A：把公告整理進 raw/ → AI 依本手冊更新 wiki/ → 網站自動更新
管理者學到新東西、遇到新問題
  └─ B：寫進 raw/worklog/ → AI 依 §4.3 更新管理手冊
```

**核心原則：資料和網頁分開。** 更新內容只動 `raw/` 和 `wiki/`，永遠不需要改 HTML。

---

## 1. 專案結構

```
.
├── CLAUDE.md                ← 本手冊（規則唯一來源）
├── AGENTS.md                ← 給其他 AI 工具的入口：「請讀 CLAUDE.md」
├── README.md                ← 給人看的專案說明
├── index.html               ← 網站入口（勿改）
├── assets/style.css, app.js ← 樣式與程式（勿改，除非使用者要求改版）
├── raw/                     ← 原始資料（只能新增，不能修改或刪除）
│   ├── announcements/       ← 官網公告（獎學金、活動、工讀……）
│   ├── pages/               ← 官網常設頁面（僑輔項目、法令……）
│   ├── pages/rpage-*        ← Rpage 公開操作文件摘要（外部參考）
│   └── worklog/             ← 管理者的工作紀錄（B 的主要資料來源）
├── wiki/
│   ├── schema.json          ← 允許的頁面類型、欄位、標籤、手冊章節、禁止字詞
│   ├── handbook/            ← B：管理手冊（交接指南、例行工作、名詞解釋、Rpage 功能）
│   ├── scholarships/        ← A：獎學金頁（一個獎學金一頁，跨年度更新）
│   ├── guides/              ← A：僑輔指南頁（一個主題一頁）
│   ├── lists/               ← A：總表（events 活動、event-reviews 活動回顧、jobs 徵才；新資料加在最上面）
│   ├── sop/                 ← B：任務 SOP（一個作業一頁）
│   ├── meta/                ← 關於本站
│   ├── log.md               ← 更新紀錄（只在最上方新增）
│   ├── index.md             ← 自動產生，勿手動編輯
│   └── manifest.json        ← 自動產生，勿手動編輯（網站靠它運作）
├── templates/               ← handbook.md / sop.md / scholarship.md / guide.md 模板
└── scripts/
    ├── build_index.py       ← 掃描 wiki/ → 產生 index.md 與 manifest.json
    ├── lint.py              ← 健檢：欄位、日期、連結、來源、禁止字詞
    └── check_links.py       ← 檢查所有官網連結是否還打得開（每學期例行工作，需要網路）
```

---

## 2. 要什麼成品：頁面規格

### 2.1 檔案命名

一律**小寫英文、數字、連字號**；不可有中文、空白、底線。頁面 id = 檔名（不含 `.md`），全站唯一。

| 類型 | 位置與檔名 | 範例 |
|---|---|---|
| 公告原始資料 | `raw/announcements/YYYY-MM-DD-類別-簡稱.md`（日期 = 官網發布日） | `raw/announcements/2026-09-07-scholarship-ocac-outstanding.md` |
| 頁面原始資料 | `raw/pages/簡稱-YYYY-MM-DD.md`（日期 = 擷取日） | `raw/pages/work-permit-2026-11-15.md` |
| 工作紀錄 | `raw/worklog/YYYY-MM-DD.md`；同一天第 2 筆起加 `-2`、`-3`（不可改舊檔） | `raw/worklog/2026-11-15-2.md` |
| 獎學金頁 | `wiki/scholarships/主辦單位縮寫-簡稱.md`（**不含年度**） | `wiki/scholarships/ocac-outstanding.md` |
| 僑輔指南 | `wiki/guides/主題.md` | `wiki/guides/work-permit.md` |
| SOP | `wiki/sop/動作-對象.md` | `wiki/sop/publish-announcement.md` |
| 管理手冊 | `wiki/handbook/主題.md`；Rpage 功能頁一律以 `rpage-` 開頭 | `wiki/handbook/rpage-modules.md` |

`類別` 只能用：`scholarship`、`event`、`job`、`news`、`regulation`。

主辦單位縮寫：`ocac` 僑委會、`ocah` 華僑協會總會、`ocfef` 僑聯文教基金會、`moe` 教育部、`delta` 台達電子文教基金會、`nsysu` 中山大學（公告沒寫出資單位、由學校受理時也用 `nsysu`）；其他單位用英文簡稱，第一次使用時寫進 `schema.json` 的 `organizers` 與 log。**完全看不出主辦單位**時，改用主題簡稱（例：`sea-medical-talent`）。

### 2.2 Front matter

所有頁面共同必填（順序固定）：

```yaml
---
id: work-permit               # = 檔名
title: 僑生工作許可            # 中文標題
type: guide                   # handbook / sop / scholarship / guide / list / meta
tags: [work]                  # 1–3 個，只能用 schema.json 的 tags
status: done                  # done（完成）/ stub（待補）/ draft（草稿，SOP 待管理者確認）
updated: 2026-11-15           # 最後修改日 YYYY-MM-DD，每次修改都要改
sources: [pages/work-permit-2026-11-15.md]   # raw/ 底下的相對路徑
summary: 一句話（30 字以內）
---
```

各類型**額外必填**欄位（lint 會檢查）：

| type | 額外欄位 | 說明 |
|---|---|---|
| `scholarship` | `organizer` | 主辦單位全名 |
| | `audience` | 申請對象，例：大學部二年級以上僑生 |
| | `amount` | 金額文字，例：20,000 元 |
| | `academic_year` | 最新一次公告的民國學年度，例：115 |
| | `deadline` | 最新一次的截止日，**西元** YYYY-MM-DD |
| | `usual_month` | 通常每年幾月公告（數字），讓網站在截止後顯示「預計明年 X 月公告」 |
| | `official_url` | 最新一則官網公告網址 |
| `handbook` | `section` | 手冊章節，只能用 `schema.json` 的 `sections`：新手上路、例行工作、Rpage 功能、名詞解釋 |
| `guide` | `official_url` | 官網對應頁面網址 |
| | `checked` | 最後一次到官網核對內容的日期 |
| `sop` | `affects` | 這個 SOP 會影響哪些 A 頁面的 id（可為空 `[]`） |

### 2.3 內文段落（照模板，順序固定）

- **管理手冊**（`templates/handbook.md`）：`一句話重點` → `這是什麼` → `在僑生專區怎麼用` → `注意事項` → `相關頁面` → `待確認`（交接指南、例行工作、名詞解釋可依內容調整小節，但第一段一定是 `一句話重點`）
- **獎學金**（`templates/scholarship.md`）：`重點一覽`（表格）→ `申請資格` → `應備文件` → `申請方式` → `歷年紀錄` → `注意事項`
- **僑輔指南**（`templates/guide.md`）：`一句話重點` → `詳細說明` → `常見問題` → `相關頁面`
- **SOP**（`templates/sop.md`）：`什麼時候用` → `步驟` → `檢查清單` → `常見錯誤` → `待確認`
- **活動總表**（`wiki/lists/events.md`）：一張表，欄位 `日期｜類型｜活動名稱｜主辦｜連結`，**新活動加在表格最上面**。

### 2.4 連結與寫作

- 頁面互連用 `[[頁面id]]` 或 `[[頁面id|顯示文字]]`；在表格內要寫成 `[[id\|文字]]`。網站會自動算出「反向連結」。
- 標題從 `##` 開始（`#` 由網站自動用 title 產生）。不寫 HTML。
- **繁體中文、台灣用語**；日期在內文可寫民國，但 front matter 一律西元。
- 一段不超過 4 行；能用表格就用表格。
- 官網沒寫的資訊寫「官網未載明」，**不可自己補數字**。

---

## 3. 有什麼限制

### ✅ 可以
- 在 `raw/` 新增檔案；在 `wiki/` 新增或修改頁面；在 `wiki/log.md` 最上方新增紀錄。
- 修改 `wiki/schema.json` 新增標籤或主辦單位縮寫（須在 log 說明）。

### ❌ 不可以
1. **不可修改或刪除 `raw/` 的任何檔案。** 原始資料是證據。
2. **不可編造。** 只寫 raw 裡有的內容；自己的提醒要放在 `> 💡 提醒：` 區塊，讓讀者分得出來。
3. **不可寫個人姓名、私人電話、私人 email。** 承辦人一律寫職稱（例：「僑外組僑生業務承辦人」），電話只寫官網公開的總機與分機。
4. **不可寫任何官網後台資訊**：後台網址、帳號、密碼、後台截圖、未公開的內部規定。SOP 只寫「步驟與欄位名稱」。
5. **一個獎學金只有一頁。** 新年度公告 → 更新原頁並把舊資料移到「歷年紀錄」，**不可另開新頁**。新增前先查 `wiki/index.md`。
6. **不可手動編輯** `wiki/index.md`、`wiki/manifest.json`。
7. **不可修改** `index.html`、`assets/`，除非使用者明確要求。
8. **不可刪除頁面。** 過時就改內文並在 log 說明，或先問使用者。
9. 不可使用 `schema.json` 以外的 type、tags。

---

## 4. 工作流程（SOP for AI）

### 4.1 匯入新公告（最常用）
使用者說「官網有新公告，幫我更新」並提供公告內容或網址時：

1. 把公告內容存成 `raw/announcements/YYYY-MM-DD-類別-簡稱.md`（照 §2.1），開頭寫上原始網址與擷取日期。
2. 判斷類別並查 `wiki/index.md`：
   - **獎學金，已有頁面** → 更新原頁：把舊年度的重點一覽搬到「歷年紀錄」表格最上面一列，再改寫成新年度內容；更新 `academic_year`、`deadline`、`official_url`、`updated`、`sources`。
   - **獎學金，沒有頁面** → 複製 `templates/scholarship.md` 建新頁。
   - **活動** → 在 `wiki/lists/events.md` 表格最上面加一列。
   - **活動回顧** → 在 `wiki/lists/event-reviews.md` 對應學年度的表格加一列，並更新「每年固定舉辦的活動」表的 ✓。
   - **徵才、兼職、實習** → 在 `wiki/lists/jobs.md` 表格最上面加一列。
   - **規定變動**（工作許可、居留、保險……）→ 更新對應的 guide 頁，並更新 `checked`。
3. **動手前先列出計畫**（要新增／更新哪些檔案）給使用者確認。
4. 執行修改。
5. 檢查 B：這次發布有沒有用到 SOP 沒寫到的步驟？有的話在對應 SOP 的「待確認」加一條。
6. `python3 scripts/build_index.py`
7. `python3 scripts/lint.py`，修到 **0 errors**。
8. 在 `wiki/log.md` 新增紀錄（格式 §4.6）。
9. 回報變更清單。

### 4.2 核對官網常設頁面（每學期一次，或使用者要求時）
1. 執行 `python3 scripts/check_links.py`，列出打不開的連結，回報給使用者。
2. 重新擷取官網頁面，存成新的 `raw/pages/簡稱-YYYY-MM-DD.md`（舊檔保留）。
3. 和 guide 頁比對；有差異就更新內容，沒差異也要更新 `checked`。
4. build → lint → log（動作類別「核對」）。
5. 對應的人工作業清單見 `wiki/handbook/routine-tasks.md`。

### 4.3 整理工作紀錄，更新管理手冊（B）
使用者口述經驗、提供後台截圖，或在 `raw/worklog/` 新增工作紀錄時：
1. 先把口述內容存成新的 `raw/worklog/YYYY-MM-DD(-N).md`（截圖只記下欄位名稱和步驟，**截圖本身不放進專案**）。
2. 判斷內容屬於哪一類，更新對應頁面；沒有對應頁面 → 提議新增（先問）：

   | 內容 | 更新到 |
   |---|---|
   | 某個作業的步驟、遇到的錯誤 | `sop/` 的「步驟」或「常見錯誤」 |
   | Rpage 某個功能怎麼用 | `handbook/rpage-*.md` |
   | 新的後台或專區用語 | `handbook/glossary.md` 的表格 |
   | 固定時間要做的事 | `handbook/routine-tasks.md` |
   | 管理理念、給下一任的提醒 | `handbook/handover-guide.md` |

3. 使用者回答了某頁「待確認」裡的問題 → 寫進內文，並從「待確認」刪掉那一條。
4. SOP 由 `draft` 改為 `done` **只能由使用者決定**。
5. build → lint → log（動作類別 `SOP` 或 `手冊`）。

### 4.4 問答
優先根據 wiki 回答並列出頁面 id；答案涉及截止日或金額時，一定附上 `official_url`，並提醒「以官網公告為準」。

### 4.5 健檢
執行 `lint.py`，另外檢查：截止日已過但 `usual_month` 即將到來的獎學金（提醒使用者留意官網）、`checked` 超過 6 個月的 guide、孤兒頁、stub 頁。

### 4.6 更新紀錄格式
加在 `wiki/log.md` 的 `<!-- 新紀錄加在這行下面 -->` 正下方：

```markdown
## 2026-11-15 ｜ 匯入 ｜ 115年度僑委會傑出及學行優良僑生獎學金
- 新增：[[ocac-outstanding]]
- 更新：[[events]]（新增 1 筆活動）
- 來源：raw/announcements/2026-09-07-scholarship-ocac-outstanding.md
```
動作類別只能用：`匯入`、`更新`、`核對`、`修正`、`SOP`、`手冊`、`結構`。

---

## 5. 怎麼算做完（驗收標準）

- [ ] `python3 scripts/lint.py` 顯示 **0 errors**
- [ ] 已執行 `python3 scripts/build_index.py`
- [ ] 每個有改的頁面，`updated` 都是今天
- [ ] `wiki/log.md` 有新紀錄
- [ ] `git status` 顯示 `raw/` 只有新增、沒有修改
- [ ] 內容沒有個人姓名、後台資訊（lint 會檢查部分禁止字詞，但仍要自己看一遍）
- [ ] 已向使用者回報變更清單

本機預覽：在專案根目錄執行 `python3 -m http.server 8000`，打開 http://localhost:8000 。

---

## 6. 範例指令

```
請先讀 CLAUDE.md。官網有一則新的獎學金公告：<網址或貼上內容>，請依 4.1 更新。
```
```
請先讀 CLAUDE.md。我寫了今天的工作紀錄 raw/worklog/2026-11-20.md，請依 4.3 更新 SOP。
```
```
請先讀 CLAUDE.md，幫我做一次健檢（4.5）。
```
```
請先讀 CLAUDE.md。我今天學會用 Rpage 的頁籤模組做首頁分頁，步驟是……，請依 4.3 更新管理手冊。
```
