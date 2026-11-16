"""健檢：依 CLAUDE.md 與 wiki/schema.json 檢查所有頁面。

用法：python3 scripts/lint.py
結果：0 errors 才算通過（CLAUDE.md §5）。warnings 僅供參考。
"""
import json
import re
import sys
from datetime import date
from wikilib import WIKI, RAW, ROOT, LINK_RE, load_schema, all_pages

DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
NAME_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")


def main():
    schema = load_schema()
    pages = all_pages(schema)
    errors, warnings = [], []
    ids = {}

    def err(p, msg):
        errors.append(f"{p.relative_to(ROOT)}: {msg}")

    def warn(p, msg):
        warnings.append(f"{p.relative_to(ROOT)}: {msg}")

    for pg in pages:
        p, m = pg["path"], pg["meta"]
        if not pg["has_fm"]:
            err(p, "缺少 front matter")
            continue
        if not NAME_RE.match(p.stem):
            err(p, "檔名只能用小寫英文、數字、連字號")
        for k in schema["common_required"]:
            if k not in m or m[k] in ("", None):
                err(p, f"缺少必填欄位 `{k}`")
        if m.get("id") != p.stem:
            err(p, f"id `{m.get('id')}` 必須等於檔名 `{p.stem}`")
        if m.get("id") in ids:
            err(p, f"id 重複，與 {ids[m['id']]} 相同")
        ids[m.get("id")] = p.relative_to(ROOT)

        t = m.get("type")
        if t not in schema["types"]:
            err(p, f"type `{t}` 不在 schema.json 中")
            continue
        if t != pg["dir_type"]:
            err(p, f"type `{t}` 的頁面應放在 wiki/{schema['types'][t]['dir']}/")
        for k in schema["types"][t]["required"]:
            if k not in m or m[k] in ("", None):
                err(p, f"type={t} 缺少必填欄位 `{k}`")

        if t == "handbook" and m.get("section") not in schema["sections"]:
            err(p, f"section 只能是 {schema['sections']}")
        if m.get("status") not in schema["statuses"]:
            err(p, f"status 只能是 {schema['statuses']}")
        tags = m.get("tags") or []
        if not isinstance(tags, list) or not 1 <= len(tags) <= 3:
            err(p, "tags 要有 1–3 個")
        for tg in tags if isinstance(tags, list) else []:
            if tg not in schema["tags"]:
                err(p, f"標籤 `{tg}` 不在 schema.json 中")

        for k in ["updated", "deadline", "checked"]:
            if k in m and not DATE_RE.match(str(m[k])):
                err(p, f"`{k}` 格式要是 YYYY-MM-DD")
        if "usual_month" in m and not (isinstance(m["usual_month"], int) and 1 <= m["usual_month"] <= 12):
            err(p, "`usual_month` 要是 1–12 的數字")
        if "official_url" in m and not str(m["official_url"]).startswith("http"):
            err(p, "`official_url` 要是完整網址")
        if len(str(m.get("summary", ""))) > 40:
            warn(p, "summary 建議 30 字以內")

        for s in m.get("sources") or []:
            if not (RAW / s).exists():
                err(p, f"來源 raw/{s} 不存在")
        if t not in ("meta",) and not m.get("sources"):
            err(p, "sources 不可為空")

        for pat in schema["forbidden_patterns"]:
            if pat.lower() in pg["body"].lower():
                err(p, f"含有禁止字詞「{pat}」（CLAUDE.md §3 第 3、4 條）")

        if t == "guide" and DATE_RE.match(str(m.get("checked", ""))):
            age = (date.today() - date.fromisoformat(m["checked"])).days
            if age > 180:
                warn(p, f"已 {age} 天沒有核對官網（CLAUDE.md §4.5）")
        if m.get("status") == "stub":
            warn(p, "待補頁（stub）")
        if m.get("status") == "draft":
            warn(p, "草稿（draft），待管理者確認")

    # 連結檢查
    all_ids = set(ids)
    linked = set()
    for pg in pages:
        for l in pg["links"]:
            linked.add(l)
            if l not in all_ids:
                err(pg["path"], f"連結 [[{l}]] 指向不存在的頁面")
        for a in pg["meta"].get("affects") or []:
            linked.add(a)
            if a not in all_ids:
                err(pg["path"], f"affects 中的 `{a}` 不存在")
    log_text = (WIKI / "log.md").read_text(encoding="utf-8")
    for l in LINK_RE.findall(log_text):
        if l not in all_ids:
            errors.append(f"wiki/log.md: 連結 [[{l}]] 指向不存在的頁面")
    if "<!-- 新紀錄加在這行下面 -->" not in log_text:
        errors.append("wiki/log.md: 缺少「新紀錄加在這行下面」標記")
    for pid, path in ids.items():
        if pid not in linked and pid != "about":
            warnings.append(f"{path}: 孤兒頁（沒有其他頁面連到它）")

    # manifest 是否最新
    mf = WIKI / "manifest.json"
    if not mf.exists() or json.loads(mf.read_text(encoding="utf-8"))["page_count"] != len(pages):
        errors.append("wiki/manifest.json 不是最新的，請執行 python3 scripts/build_index.py")

    for w in warnings:
        print(f"⚠️  {w}")
    for e in errors:
        print(f"❌ {e}")
    print(f"\n結果：{len(errors)} errors, {len(warnings)} warnings（共 {len(pages)} 頁）")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
