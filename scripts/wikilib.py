"""共用工具：讀取 schema、front matter 與 wiki 連結（只用 Python 標準函式庫）。"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WIKI = ROOT / "wiki"
RAW = ROOT / "raw"

# [[id]]、[[id|文字]]，表格內可寫成 [[id\|文字]]
LINK_RE = re.compile(r"\[\[([a-z0-9-]+)(?:\\?\|[^\]]+)?\]\]")
FM_RE = re.compile(r"^---\n(.*?)\n---\n?(.*)$", re.S)


def load_schema():
    return json.loads((WIKI / "schema.json").read_text(encoding="utf-8"))


def parse_value(v):
    v = v.strip()
    if v.startswith("[") and v.endswith("]"):
        inner = v[1:-1].strip()
        return [x.strip() for x in inner.split(",") if x.strip()] if inner else []
    if re.fullmatch(r"\d+", v):
        return int(v)
    return v


def read_page(path: Path):
    text = path.read_text(encoding="utf-8")
    m = FM_RE.match(text)
    if not m:
        return None, text
    meta = {}
    for line in m.group(1).splitlines():
        if " #" in line:
            line = line.split(" #", 1)[0]
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = parse_value(v)
    return meta, m.group(2)


def all_pages(schema=None):
    schema = schema or load_schema()
    pages = []
    for tname, t in schema["types"].items():
        for p in sorted((WIKI / t["dir"]).glob("*.md")):
            meta, body = read_page(p)
            pages.append({"path": p, "dir_type": tname, "meta": meta or {}, "has_fm": meta is not None,
                          "body": body, "links": sorted(set(LINK_RE.findall(body)))})
    return pages
