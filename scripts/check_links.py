"""檢查本站所有官網連結是否還打得開（每學期例行工作，見 wiki/handbook/routine-tasks.md）。

用法：python3 scripts/check_links.py
會讀取 wiki/ 所有頁面中的 http(s) 連結與 official_url，逐一測試，列出打不開的連結。
只用 Python 標準函式庫；需要網路。
"""
import re
import ssl
import urllib.request
from wikilib import ROOT, all_pages

URL_RE = re.compile(r"https?://[^\s)\]|>\"'（）]+")


def check(url, timeout=15):
    req = urllib.request.Request(url, method="GET", headers={"User-Agent": "Mozilla/5.0 (link-check)"})
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as r:
            return r.status, None
    except urllib.error.HTTPError as e:
        return e.code, None
    except Exception as e:  # 連線失敗、逾時、憑證錯誤……
        return None, type(e).__name__


def main():
    found = {}
    for pg in all_pages():
        text = pg["body"] + " " + str(pg["meta"].get("official_url", ""))
        for u in URL_RE.findall(text):
            if "localhost" in u:
                continue
            found.setdefault(u.rstrip(".,。、"), set()).add(pg["meta"].get("id"))
    bad = []
    for i, (u, ids) in enumerate(sorted(found.items()), 1):
        code, err = check(u)
        ok = code is not None and code < 400
        print(f"[{i}/{len(found)}] {'✅' if ok else '❌'} {code or err}  {u}")
        if not ok:
            bad.append((u, code or err, sorted(ids)))
    print(f"\n共檢查 {len(found)} 個連結，{len(bad)} 個有問題：")
    for u, why, ids in bad:
        print(f"  ❌ {why}  {u}\n     出現在：{', '.join(ids)}")


if __name__ == "__main__":
    main()
