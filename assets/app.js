// 中山僑生資訊站：讀取 wiki/manifest.json，渲染各頁面。
// 內容更新不需要改這個檔案（CLAUDE.md §3 第 7 條）。
(() => {
  const app = document.getElementById("app");
  let M = null; // manifest
  const byId = {};
  const cache = {};

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const link = id => `#/p/${id}`;
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };

  // ---------- 獎學金狀態（由截止日即時計算） ----------
  function deadlineState(p) {
    const dl = new Date(p.deadline + "T23:59:59");
    const days = Math.ceil((dl - today()) / 86400000) - 1;
    if (days >= 0) {
      return days <= 14
        ? { cls: "b-soon", text: `即將截止・剩 ${days} 天`, rank: days }
        : { cls: "b-open", text: `開放中・剩 ${days} 天`, rank: days };
    }
    const now = today();
    const m = p.usual_month;
    const year = m > now.getMonth() + 1 ? now.getFullYear() : now.getFullYear() + 1;
    return { cls: "b-closed", text: `已截止・預計 ${year} 年 ${m} 月公告`, rank: 1000 + (year * 12 + m) };
  }
  const statusBadge = p =>
    p.status === "stub" ? `<span class="badge b-stub">待補</span>` :
    p.status === "draft" ? `<span class="badge b-draft">草稿・待確認</span>` : "";

  // ---------- Markdown ----------
  function renderMd(src) {
    const body = src.replace(/^---\n[\s\S]*?\n---\n?/, "");
    const withLinks = body.replace(/\[\[([a-z0-9-]+)(?:\\?\|([^\]]+))?\]\]/g, (_, id, text) => {
      const t = text || (byId[id] ? byId[id].title : id);
      return `[${t}](${link(id)})`;
    });
    return marked.parse(withLinks, { gfm: true });
  }
  async function fetchText(path) {
    if (!cache[path]) {
      const r = await fetch(path, { cache: "no-cache" });
      if (!r.ok) throw new Error(path);
      cache[path] = await r.text();
    }
    return cache[path];
  }

  // ---------- 卡片 ----------
  function scholarshipCard(p) {
    const s = deadlineState(p);
    return `<a class="card" href="${link(p.id)}">
      <span class="badge ${s.cls}">${s.text}</span>
      <h3>${esc(p.title)}</h3>
      <div class="amount">${esc(p.amount)}</div>
      <p>${esc(p.audience)}</p>
      <div class="meta"><span>截止 ${esc(p.deadline)}</span><span>${esc(p.academic_year)} 學年度</span></div>
    </a>`;
  }
  function plainCard(p) {
    const isSop = p.type === "sop";
    return `<a class="card ${isSop ? "card-sop" : ""}" href="${link(p.id)}">
      <span class="badge ${isSop ? "b-sop" : "b-type"}">${esc(M.types[p.type])}</span> ${statusBadge(p)}
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.summary)}</p>
      <div class="meta"><span>更新 ${esc(p.updated)}</span>${p.checked ? `<span>官網核對 ${esc(p.checked)}</span>` : ""}</div>
    </a>`;
  }
  const ofType = t => M.pages.filter(p => p.type === t);
  const sortScholarships = list => [...list].sort((a, b) => deadlineState(a).rank - deadlineState(b).rank);

  // ---------- 首頁 ----------
  async function home() {
    const sch = sortScholarships(ofType("scholarship"));
    const openCount = sch.filter(p => deadlineState(p).rank < 1000).length;
    const logHtml = await recentLog(2);
    app.innerHTML = `
      <section class="hero">
        <div>
          <h1>僑生要找的資訊，<br>一個主題一頁。</h1>
          <p>把中山大學國際事務處的僑生公告，整理成好查的獎學金、居留、工作許可與保險資料。</p>
        </div>
        <div class="stats">
          <div class="stat"><b>${openCount}</b><span>開放中獎學金</span></div>
          <div class="stat"><b>${M.page_count}</b><span>頁資料</span></div>
          <div class="stat"><b>${esc(M.last_updated.slice(5))}</b><span>最後更新</span></div>
        </div>
      </section>
      <div class="notice">⚠️ 本站為<strong>非官方整理</strong>，金額、資格與截止日請以每頁附的官網公告為準。</div>

      <section class="section">
        <div class="section-head"><h2>獎學金</h2><a href="#/list/scholarship" class="sub">全部 ${sch.length} 項 →</a></div>
        ${openCount === 0 ? `<p class="sub" style="color:var(--muted);margin-top:-6px">目前沒有開放中的獎學金。下方依「預計下次公告」排序，提早準備成績單和證明文件。</p>` : ""}
        <div class="grid">${sch.slice(0, 6).map(scholarshipCard).join("")}</div>
      </section>

      <section class="section">
        <div class="section-head"><h2>僑輔指南</h2><a href="#/list/guide" class="sub">全部 →</a></div>
        <div class="grid">${ofType("guide").map(plainCard).join("")}</div>
      </section>

      <section class="section">
        <div class="section-head"><h2>活動與徵才總表</h2></div>
        <div class="grid">${ofType("list").map(plainCard).join("")}</div>
      </section>

      <section class="section section-b">
        <div class="section-head"><h2>官網維護手冊</h2><span class="sub">給管理者與接手的人</span></div>
        <div class="flow" style="margin-bottom:14px">
          <span>學校發新公告</span><i>→</i><span>照 SOP 在官網發布</span><i>→</i><span>原文存進 raw/</span><i>→</i><span>AI 依 CLAUDE.md 更新本站</span>
        </div>
        <div class="grid">${ofType("sop").map(plainCard).join("")}</div>
      </section>

      <section class="section">
        <div class="section-head"><h2>最近更新</h2><a href="#/log" class="sub">完整紀錄 →</a></div>
        <div class="article">${logHtml}</div>
      </section>`;
  }

  async function recentLog(n) {
    const src = await fetchText("wiki/log.md");
    const parts = src.split(/\n(?=## )/).slice(1, n + 1).join("\n");
    return renderMd(parts);
  }

  // ---------- 獎學金月份時程（依 usual_month 自動產生） ----------
  function timeline(list) {
    const cur = today().getMonth() + 1;
    const cols = Array.from({ length: 12 }, (_, i) => i + 1).map(m => {
      const items = list.filter(p => p.usual_month === m);
      return `<div class="tl-col ${m === cur ? "tl-now" : ""}">
        <div class="tl-month">${m} 月${m === cur ? "・本月" : ""}</div>
        ${items.map(p => `<a class="tl-item" href="${link(p.id)}" title="${esc(p.summary)}">${esc(p.title)}</a>`).join("")}
      </div>`;
    }).join("");
    return `<div class="timeline-wrap">
      <h3 class="tl-title">一年中，各獎學金通常幾月公告</h3>
      <div class="timeline">${cols}</div>
      <p class="tl-note">依各獎學金最近一次公告的月份推算，實際以官網為準。</p>
    </div>`;
  }

  // ---------- 列表頁 ----------
  function list(type) {
    const all = type === "scholarship" ? sortScholarships(ofType(type)) : ofType(type);
    const titles = { scholarship: "獎學金", guide: "僑輔指南", sop: "官網維護手冊" };
    const notes = {
      scholarship: "依截止狀態排序：開放中 → 已截止（依預計下次公告時間）。",
      guide: "每頁都標示「官網核對日期」，超過半年未核對的頁面會在健檢時被提醒。",
      sop: "記錄在官網後台發布公告的步驟。標示「草稿」的 SOP 還需要管理者確認細節。",
    };
    app.innerHTML = `
      <div class="section ${type === "sop" ? "section-b" : ""}">
        <div class="section-head"><h2>${titles[type]}</h2><span class="sub">${all.length} 頁</span></div>
        <p style="color:var(--muted);margin-top:-6px">${notes[type]}</p>
        ${type === "scholarship" ? timeline(all) : ""}
        <div class="toolbar"><input class="search" id="q" placeholder="搜尋標題、對象、摘要…" autocomplete="off"></div>
        <div class="grid" id="items"></div>
      </div>`;
    const draw = q => {
      const ql = q.trim().toLowerCase();
      const items = all.filter(p => !ql || [p.title, p.summary, p.audience, p.organizer].join(" ").toLowerCase().includes(ql));
      document.getElementById("items").innerHTML =
        items.map(type === "scholarship" ? scholarshipCard : plainCard).join("") || `<p>找不到符合的頁面。</p>`;
    };
    document.getElementById("q").addEventListener("input", e => draw(e.target.value));
    draw("");
  }

  // ---------- 內容頁 ----------
  async function page(id) {
    const p = byId[id];
    if (!p) { app.innerHTML = `<p>找不到頁面 <code>${esc(id)}</code>。<a href="#/">回首頁</a></p>`; return; }
    const html = renderMd(await fetchText(p.path));
    const backlinks = M.pages.filter(x => x.id !== id && (x.links.includes(id)));
    const sops = M.pages.filter(x => x.type === "sop" && (x.affects || []).includes(id));
    const isSop = p.type === "sop";

    let facts = "";
    if (p.type === "scholarship") {
      const s = deadlineState(p);
      facts = `<div class="facts">
        <div class="fact"><small>狀態</small><span class="badge ${s.cls}">${s.text}</span></div>
        <div class="fact"><small>金額</small><b>${esc(p.amount)}</b></div>
        <div class="fact"><small>截止日（${esc(p.academic_year)} 學年度）</small><b>${esc(p.deadline)}</b></div>
        <div class="fact"><small>主辦</small><b>${esc(p.organizer)}</b></div>
      </div>`;
    }
    const official = p.official_url
      ? `<div class="panel"><a class="official-btn" href="${esc(p.official_url)}" target="_blank" rel="noopener">查看官網原文 ↗</a></div>` : "";
    const affects = isSop && p.affects?.length
      ? `<div class="panel"><h4>這個 SOP 會影響</h4><ul>${p.affects.map(a => `<li><a href="${link(a)}">${esc(byId[a]?.title || a)}</a></li>`).join("")}</ul></div>` : "";
    const relatedSop = sops.length
      ? `<div class="panel"><h4>相關維護手冊</h4><ul>${sops.map(x => `<li><a href="${link(x.id)}">${esc(x.title)}</a></li>`).join("")}</ul></div>` : "";
    const back = backlinks.length
      ? `<div class="panel"><h4>哪些頁面提到這裡</h4><ul>${backlinks.map(x => `<li><a href="${link(x.id)}">${esc(x.title)}</a></li>`).join("")}</ul></div>` : "";

    app.innerHTML = `
      <div class="article-layout">
        <article class="article ${isSop ? "is-sop" : ""}">
          <span class="badge ${isSop ? "b-sop" : "b-type"}">${esc(M.types[p.type])}</span> ${statusBadge(p)}
          <h1>${esc(p.title)}</h1>
          <p class="lead">${esc(p.summary)}</p>
          ${facts}
          ${html}
        </article>
        <aside>
          ${official}
          <div class="panel"><h4>頁面資訊</h4>
            <ul>
              <li>最後更新：${esc(p.updated)}</li>
              ${p.checked ? `<li>官網核對：${esc(p.checked)}</li>` : ""}
              <li>標籤：${(p.tags || []).map(t => esc(M.tags[t] || t)).join("、")}</li>
              <li>檔案：<code>${esc(p.path)}</code></li>
            </ul>
          </div>
          ${affects}${relatedSop}${back}
        </aside>
      </div>`;
    window.scrollTo(0, 0);
  }

  async function logPage() {
    const src = await fetchText("wiki/log.md");
    app.innerHTML = `<article class="article"><span class="badge b-type">更新紀錄</span>${renderMd(src.replace(/^# .*\n/, "<h1>更新紀錄</h1>\n"))}</article>`;
  }

  // ---------- 路由 ----------
  function setActive(key) {
    document.querySelectorAll("#nav a").forEach(a => a.classList.toggle("active", a.dataset.route === key));
  }
  async function route() {
    const h = location.hash.replace(/^#/, "") || "/";
    const [, kind, arg] = h.split("/");
    try {
      if (!kind) { setActive("home"); await home(); }
      else if (kind === "list") { setActive(arg); list(arg); }
      else if (kind === "p") {
        const t = byId[arg]?.type;
        setActive(arg === "events" ? "events" : t === "list" ? "events" : t);
        await page(arg);
      }
      else if (kind === "log") { setActive("log"); await logPage(); }
      else { app.innerHTML = `<p>找不到頁面。<a href="#/">回首頁</a></p>`; }
    } catch (e) {
      app.innerHTML = `<p>載入失敗：${esc(e.message)}。若是在本機開啟，請用 <code>python3 -m http.server 8000</code> 啟動後再瀏覽。</p>`;
    }
  }

  fetch("wiki/manifest.json", { cache: "no-cache" })
    .then(r => r.json())
    .then(m => { M = m; M.pages.forEach(p => (byId[p.id] = p)); window.addEventListener("hashchange", route); route(); })
    .catch(() => {
      app.innerHTML = `<p>無法讀取 <code>wiki/manifest.json</code>。若是直接雙擊開啟 HTML，請改用 <code>python3 -m http.server 8000</code> 在本機預覽。</p>`;
    });
})();
