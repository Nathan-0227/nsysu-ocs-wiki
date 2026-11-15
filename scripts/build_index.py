"""掃描 wiki/ 所有頁面，產生：
  - wiki/manifest.json：網站讀取用
  - wiki/index.md：給人和 AI 查閱的目錄

用法：python3 scripts/build_index.py
"""
import json
from wikilib import WIKI, ROOT, LINK_RE, load_schema, all_pages

BASE_FIELDS = ["id", "title", "type", "tags", "status", "updated", "summary"]


def main():
    schema = load_schema()
    pages = all_pages(schema)
    order = list(schema["types"].keys())
    entries = []
    for p in pages:
        m = p["meta"]
        e = {k: m.get(k) for k in BASE_FIELDS}
        e["path"] = p["path"].relative_to(ROOT).as_posix()
        for k in schema["types"].get(m.get("type"), {}).get("required", []):
            e[k] = m.get(k)
        e["links"] = p["links"]
        entries.append(e)
    entries.sort(key=lambda e: (order.index(e["type"]) if e["type"] in order else 99, e["id"] or ""))

    log_links = sorted(set(LINK_RE.findall((WIKI / "log.md").read_text(encoding="utf-8"))))
    manifest = {
        "generated_by": "scripts/build_index.py",
        "page_count": len(entries),
        "last_updated": max((str(e["updated"]) for e in entries), default=""),
        "types": {k: v["label"] for k, v in schema["types"].items()},
        "tags": schema["tags"],
        "log_links": log_links,
        "pages": entries,
    }
    (WIKI / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = ["# 索引（自動產生，請勿手動編輯）", "",
             f"共 {len(entries)} 頁。執行 `python3 scripts/build_index.py` 重新產生。", ""]
    for t, tdef in schema["types"].items():
        group = [e for e in entries if e["type"] == t]
        if not group:
            continue
        extra = " 截止日 |" if t == "scholarship" else ""
        lines += [f"## {tdef['label']}（{t}）", "", f"| id | 標題 | 狀態 |{extra} 摘要 |",
                  "|---|---|---|" + ("---|" if extra else "") + "---|"]
        for e in group:
            st = {"done": "✅", "stub": "📝 待補", "draft": "🟡 草稿"}.get(e["status"], e["status"])
            dl = f" {e.get('deadline')} |" if extra else ""
            lines.append(f"| [[{e['id']}]] | {e['title']} | {st} |{dl} {e['summary']} |")
        lines.append("")
    (WIKI / "index.md").write_text("\n".join(lines), encoding="utf-8")
    print(f"已產生 wiki/manifest.json 與 wiki/index.md（{len(entries)} 頁）")


if __name__ == "__main__":
    main()
