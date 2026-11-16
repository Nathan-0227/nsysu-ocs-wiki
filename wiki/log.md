# 更新紀錄

<!-- 新紀錄加在這行下面 -->

## 2026-11-15 ｜ 結構 ｜ 改版為「Rpage 網站管理傳承手冊」
- 方向調整：網站主角改為給下一任管理者的管理手冊；僑生資訊保留為「依手冊維護的成果範例」
- 新增手冊：[[handover-guide]]（含管理理念）、[[routine-tasks]]（每週／每學期／每年）、[[glossary]]、[[rpage-info-management]]、[[rpage-modules]]、[[rpage-page-management]]、[[rpage-documents]]
- 更新：[[about]]；[[publish-announcement]]、[[update-event-review]]、[[verify-external-info]] 加上手冊連結
- 結構：schema.json 新增 `handbook` 類型與 `sections`；新增 templates/handbook.md、scripts/check_links.py；CLAUDE.md 改寫 §0 目的與管理理念、§4.2 加入連結檢查、§4.3 改為「更新管理手冊」並新增分類對照表；log 動作類別新增「手冊」
- 來源：raw/worklog/2026-11-15-9.md、raw/pages/rpage-public-docs-2026-11-15.md

## 2026-11-15 ｜ 匯入 ｜ 擴充內容：獎助學金、僑輔指南、活動回顧、徵才
- 新增獎助學金：[[moe-grad-outstanding]]、[[nsysu-needy-grant]]、[[nsysu-learning-assistance]]、[[delta-thai-north]]、[[nsysu-thai-myanmar]]、[[sea-medical-talent]]
- 新增僑輔指南：[[work-in-taiwan]]、[[host-family]]、[[care-support]]、[[clubs]]
- 新增總表：[[event-reviews]]（111–114 學年度 50 則＋每年固定活動表）、[[jobs]]
- 更新：[[naming-rules]]（新增【助學金申請公告】【扶助金申請公告】）、[[events]]、多個獎學金頁移除「本站最高／最低」等已不成立的比較
- 結構：CLAUDE.md §2.1 新增主辦單位縮寫 `moe`、`delta` 與「看不出主辦單位時用主題簡稱」規則；§4.1 新增活動回顧、徵才的匯入方式
- 來源：raw/announcements/2026-03-04 ～ 2026-08-14 共 6 則、2026-11-15-scholarship-list-snapshot.md、2026-11-15-event-review-list-snapshot.md；raw/pages/work-in-taiwan、support-services、clubs

## 2026-11-15 ｜ SOP ｜ 待確認問題回覆（第 13–17 題），維護手冊全數完成
- 更新：[[publish-announcement]]（FB 發布後馬上轉發、格式為標題＋重點＋官網連結；新增「再確認截止日」「盡快公布」提醒）、[[verify-external-info]]（不轉發：與僑生無關、非來自學校）、[[update-event-review]]（批量上傳後逐張補說明）
- 狀態：[[publish-announcement]]、[[naming-rules]]、[[verify-external-info]]、[[update-event-review]] 由 draft 改為 done（管理者同意）
- 來源：raw/worklog/2026-11-15-8.md

## 2026-11-15 ｜ SOP ｜ 待確認問題回覆（第 7–12 題）
- 更新：[[naming-rules]]（新增【徵才轉知】【兼職轉知】【實習轉知】；只有活動回顧在年度後空格）、[[publish-announcement]]（新增「發布後的狀況處理」：更正、延長、截止後；急件用 LINE 聯絡承辦人確認後才發布）
- 來源：raw/worklog/2026-11-15-7.md

## 2026-11-15 ｜ SOP ｜ 待確認問題回覆（第 1–6 題）
- 更新：[[publish-announcement]]（個別頁面設定換僑外組專用 footer、資訊圖檔、加入分類、英文版自行翻譯）、[[update-event-review]]（大圖在「資訊圖檔」分頁）、[[naming-rules]]（確認公告／轉知判斷標準）
- 來源：raw/worklog/2026-11-15-6.md

## 2026-11-15 ｜ SOP ｜ 活動回顧改用「新增大圖」上傳
- 更新：[[update-event-review]]（照片用「上傳大圖」＋大圖說明；排序後要「儲存大圖排序」；標題格式；移除「同意」與「上傳方式」待確認）、[[naming-rules]]（新增【活動回顧】前綴）
- 來源：raw/worklog/2026-11-15-5.md

## 2026-11-15 ｜ SOP ｜ 確認活動回顧的照片順序
- 更新：[[update-event-review]]（第一張大合照 → 中間依流程 → 最後一張幹部照片；移除對應的待確認）
- 來源：raw/worklog/2026-11-15-4.md

## 2026-11-15 ｜ SOP ｜ 新增活動回顧流程
- 新增：[[update-event-review]]（從 FB 相簿挑照片、依流程排列、每張照片加說明）
- 來源：raw/worklog/2026-11-15-3.md

## 2026-11-15 ｜ SOP ｜ 依管理者口述補完發布流程
- 新增：[[verify-external-info]]（外部資訊查證）
- 更新：[[publish-announcement]]（加入資訊來源、與承辦人討論、排版、轉發中山僑聯 FB；下架日期確認為 2099-12-31）、[[naming-rules]]（「轉知」定義改為外部來源）
- 結構：CLAUDE.md §2.1 新增「同一天第 2 筆工作紀錄加 -2」規則；schema.json 新增標籤 `verify`
- 來源：raw/worklog/2026-11-15-2.md
- 待補：後台列表中的「台達電子文教基金會泰北來台僑生獎助學金」尚未建頁

## 2026-11-15 ｜ SOP ｜ 依後台畫面起草維護手冊
- 新增：[[publish-announcement]]、[[naming-rules]]（草稿，待管理者確認）、[[sync-to-wiki]]
- 來源：raw/worklog/2026-11-15.md

## 2026-11-15 ｜ 匯入 ｜ 僑輔項目與活動
- 新增：[[work-permit]]、[[residence]]、[[insurance]]、[[after-graduation]]、[[orientation]]、[[events]]
- 待補：[[tutoring]]（官網資訊不足）
- 來源：raw/pages/*-2026-11-15.md、raw/announcements/2026-11-15-event-list-snapshot.md

## 2026-11-15 ｜ 匯入 ｜ 115 學年度獎學金公告 6 則
- 新增：[[ocac-outstanding]]、[[ocah-scholarship-grant]]、[[ocah-shen-memorial]]、[[ocah-thesis-award]]、[[ocfef-scholarship]]、[[cantonese-tpe-scholarship]]
- 來源：raw/announcements/2026-09-*.md

## 2026-11-15 ｜ 結構 ｜ 建立知識庫
- 建立 CLAUDE.md、AGENTS.md、模板、腳本、網站；新增 [[about]]
