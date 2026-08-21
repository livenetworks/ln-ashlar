if (typeof window < "u") {
  const d = console.warn;
  console.warn = function(...a) {
    typeof a[0] == "string" && (a[0].startsWith("[ln-") || a[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || d.apply(console, a);
  };
}
const zt = {};
function Rt(d, a) {
  zt[d] || (zt[d] = document.querySelector('[data-ln-template="' + d + '"]'));
  const b = zt[d];
  return b ? b.content.cloneNode(!0) : (console.warn("[" + (a || "ln-core") + '] Template "' + d + '" not found'), null);
}
function C(d, a, b) {
  d.dispatchEvent(new CustomEvent(a, {
    bubbles: !0,
    detail: b || {}
  }));
}
function J(d, a, b) {
  const y = new CustomEvent(a, {
    bubbles: !0,
    cancelable: !0,
    detail: b || {}
  });
  return d.dispatchEvent(y), y;
}
function ue(d, a, b) {
  d._applyFilterAndSort(), d._vStart = -1, d._vEnd = -1, d._render(), d._updateFooter();
  const y = {
    sort: d.currentSort,
    filters: d.currentFilters,
    search: d.currentSearch
  };
  y[b] = d.name, C(d.dom, a, y);
}
function st(d, a) {
  if (!d || !a) return d;
  const b = d.querySelectorAll("[data-ln-field]");
  for (let p = 0; p < b.length; p++) {
    const s = b[p], u = s.getAttribute("data-ln-field");
    a[u] != null && (s.textContent = a[u]);
  }
  const y = d.querySelectorAll("[data-ln-attr]");
  for (let p = 0; p < y.length; p++) {
    const s = y[p], u = s.getAttribute("data-ln-attr").split(",");
    for (let r = 0; r < u.length; r++) {
      const l = u[r].trim().split(":");
      if (l.length !== 2) continue;
      const h = l[0].trim(), c = l[1].trim();
      a[c] != null && s.setAttribute(h, a[c]);
    }
  }
  const g = d.querySelectorAll("[data-ln-show]");
  for (let p = 0; p < g.length; p++) {
    const s = g[p], u = s.getAttribute("data-ln-show");
    u in a && s.classList.toggle("hidden", !a[u]);
  }
  const m = d.querySelectorAll("[data-ln-class]");
  for (let p = 0; p < m.length; p++) {
    const s = m[p], u = s.getAttribute("data-ln-class").split(",");
    for (let r = 0; r < u.length; r++) {
      const l = u[r].trim().split(":");
      if (l.length !== 2) continue;
      const h = l[0].trim(), c = l[1].trim();
      c in a && s.classList.toggle(h, !!a[c]);
    }
  }
  return d;
}
function Re(d, a) {
  d.matches && d.matches("[data-ln-form], [data-ln-fillable]") && d.dispatchEvent(new CustomEvent("ln-fill", { detail: a ?? null, bubbles: !0 }));
  const b = d.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let y = 0; y < b.length; y++)
    b[y].dispatchEvent(new CustomEvent("ln-fill", { detail: a ?? null, bubbles: !0 }));
  return d;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(d) {
  if (!(!d.target.matches || !d.target.matches("[data-ln-fillable]")))
    if (d.detail)
      st(d.target, d.detail);
    else {
      const a = d.target.querySelectorAll("[data-ln-field]");
      for (let b = 0; b < a.length; b++)
        a[b].textContent = "";
    }
})));
function At(d, a) {
  if (!d || !a) return d;
  const b = document.createTreeWalker(d, NodeFilter.SHOW_TEXT);
  for (; b.nextNode(); ) {
    const m = b.currentNode;
    m.textContent.indexOf("{{") !== -1 && (m.textContent = m.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(p, s) {
        return a[s] !== void 0 ? a[s] : "";
      }
    ));
  }
  const y = function(m, p) {
    return a[p] !== void 0 ? a[p] : "";
  }, g = Array.from(d.querySelectorAll("*"));
  d.nodeType === 1 && g.push(d);
  for (let m = 0; m < g.length; m++) {
    const p = g[m], s = p.attributes;
    for (let u = 0; u < s.length; u++) {
      const r = s[u];
      r.value.indexOf("{{") !== -1 && p.setAttribute(r.name, r.value.replace(/\{\{\s*(\w+)\s*\}\}/g, y));
    }
  }
  return d;
}
function Oe(d, a, b, y, g, m) {
  const p = {};
  for (let u = 0; u < d.children.length; u++) {
    const r = d.children[u], l = r.getAttribute("data-ln-key");
    l && (p[l] = r);
  }
  const s = document.createDocumentFragment();
  for (let u = 0; u < a.length; u++) {
    const r = a[u], l = String(y(r));
    let h = p[l];
    if (h)
      g(h, r, u);
    else {
      const c = Rt(b, m);
      if (!c || (At(c, r), h = c.firstElementChild, !h)) continue;
      h.setAttribute("data-ln-key", l), g(h, r, u);
    }
    s.appendChild(h);
  }
  d.textContent = "", d.appendChild(s);
}
function ut(d, a) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      ut(d, a);
    }), console.warn("[" + a + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  d();
}
function mt(d, a, b) {
  if (d) {
    const y = d.querySelector('[data-ln-template="' + a + '"]');
    if (y) return y.content.cloneNode(!0);
  }
  return Rt(a, b);
}
function Xt(d, a) {
  const b = {}, y = d.querySelectorAll("[" + a + "]");
  for (let g = 0; g < y.length; g++)
    b[y[g].getAttribute(a)] = y[g].textContent, y[g].remove();
  return b;
}
function jt(d, a, b, y) {
  if (d.nodeType !== 1) return;
  const m = a.indexOf("[") !== -1 || a.indexOf(".") !== -1 || a.indexOf("#") !== -1 ? a : "[" + a + "]", p = Array.from(d.querySelectorAll(m));
  d.matches && d.matches(m) && p.push(d);
  for (const s of p)
    s[b] || (s[b] = new y(s));
}
function Dt(d) {
  return !!(d.offsetWidth || d.offsetHeight || d.getClientRects().length);
}
function Me(d) {
  const a = d.querySelector('input[name="_method"]');
  return ((a && a.value !== "" ? a.value : d.method) || "").toUpperCase();
}
function he(d, a) {
  const b = !!(a && a.typed), y = a && a.exclude, g = {}, m = d.elements, p = {};
  if (b)
    for (let s = 0; s < m.length; s++) {
      const u = m[s];
      u.name && u.type === "checkbox" && !u.disabled && (p[u.name] = (p[u.name] || 0) + 1);
    }
  for (let s = 0; s < m.length; s++) {
    const u = m[s];
    if (!(!u.name || u.disabled || u.type === "file" || u.type === "submit" || u.type === "button") && !(y && u.matches && u.matches(y)))
      if (u.type === "checkbox")
        b && p[u.name] === 1 ? g[u.name] = u.checked : (g[u.name] || (g[u.name] = []), u.checked && g[u.name].push(u.value));
      else if (u.type === "radio")
        u.checked && (g[u.name] = u.value);
      else if (u.type === "select-multiple") {
        g[u.name] = [];
        for (let r = 0; r < u.options.length; r++)
          u.options[r].selected && g[u.name].push(u.options[r].value);
      } else if (b && u.type === "hidden")
        g[u.name] = u.value;
      else if (b && (u.type === "number" || u.type === "range")) {
        const r = Number(u.value);
        g[u.name] = u.value === "" || isNaN(r) ? null : r;
      } else
        g[u.name] = u.value;
  }
  return g;
}
function Ne(d) {
  if (typeof d != "string") return !!d;
  const a = d.trim().toLowerCase();
  return a !== "false" && a !== "0" && a !== "" && a !== "off" && a !== "no";
}
function fe(d, a) {
  const b = d.elements, y = [], g = {};
  for (let m = 0; m < b.length; m++) {
    const p = b[m];
    p.name && p.type === "checkbox" && (g[p.name] = (g[p.name] || 0) + 1);
  }
  for (let m = 0; m < b.length; m++) {
    const p = b[m];
    if (p.type === "file" || p.type === "submit" || p.type === "button") continue;
    const s = p.getAttribute("data-ln-fill-as") || p.name;
    if (!s || !(s in a)) continue;
    const u = a[s];
    if (p.type === "checkbox") {
      if (Array.isArray(u))
        p.checked = u.indexOf(p.value) !== -1;
      else if (g[p.name] > 1) {
        const r = String(u).split(",").map(function(l) {
          return l.trim();
        });
        p.checked = r.indexOf(p.value) !== -1;
      } else
        p.checked = Ne(u);
      y.push(p);
    } else if (p.type === "radio")
      p.checked = p.value === String(u), y.push(p);
    else if (p.type === "select-multiple") {
      if (Array.isArray(u))
        for (let r = 0; r < p.options.length; r++)
          p.options[r].selected = u.indexOf(p.options[r].value) !== -1;
      y.push(p);
    } else
      p.value = u, y.push(p);
  }
  return y;
}
const ie = {
  mk: "mk-MK",
  de: "de-DE",
  fr: "fr-FR",
  es: "es-ES",
  it: "it-IT",
  nl: "nl-NL",
  pt: "pt-PT",
  ru: "ru-RU",
  bg: "bg-BG",
  hr: "hr-HR",
  sr: "sr-RS",
  sq: "sq-AL",
  el: "el-GR",
  en: "en-US"
};
function $(d) {
  const a = d ? d.closest("[lang]") : null, b = (a ? a.getAttribute("lang") || a.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!b) return "en-US";
  const y = b.trim().toLowerCase();
  return y.indexOf("-") === -1 && ie[y] ? ie[y] : b;
}
function Ot(d) {
  return d.hasAttribute("data-ln-value") ? d.getAttribute("data-ln-value") : d.textContent.trim();
}
function Mt(d) {
  let a = !1;
  for (let b = 0; b < d.length; b++) {
    const y = d[b];
    if (!(y === "" || y == null) && (a = !0, !Number.isFinite(Number(y))))
      return "string";
  }
  return a ? "number" : "string";
}
function Nt(d, a, b, y) {
  if (b === "number") {
    const p = parseFloat(d), s = parseFloat(a);
    return (isNaN(p) ? 0 : p) - (isNaN(s) ? 0 : s);
  }
  const g = d != null ? String(d) : "", m = a != null ? String(a) : "";
  return y ? y.compare(g, m) : g < m ? -1 : g > m ? 1 : 0;
}
function pe(d, a, { get: b, set: y }) {
  Object.defineProperty(d, "value", {
    get: function() {
      return b ? b.call(this) : a.get.call(this);
    },
    set: function(g) {
      y ? y.call(this, g, (m) => a.set.call(this, m)) : a.set.call(this, g);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function Fe() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function Kt() {
  if (typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1), window.lnCore._bootHolds === 0 && window.lnCore._bootQueue)) {
    const d = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let a = 0; a < d.length; a++)
      d[a]();
  }
}
function Pe() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function Tt(d) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(d) : setTimeout(d, 0)) : d();
}
function H(d, a, b, y, g = {}) {
  const m = g.extraAttributes || [], p = g.onAttributeChange || null, s = g.onInit || null;
  function u(l) {
    const h = l || document.body;
    jt(h, d, a, b), s && s(h);
  }
  ut(function() {
    const l = new MutationObserver(function(c) {
      for (let f = 0; f < c.length; f++) {
        const n = c[f];
        if (n.type === "childList") {
          for (let o = 0; o < n.addedNodes.length; o++) {
            const t = n.addedNodes[o];
            t.nodeType === 1 && (jt(t, d, a, b), s && s(t));
          }
          for (let o = 0; o < n.removedNodes.length; o++) {
            const t = n.removedNodes[o];
            if (t.nodeType === 1) {
              const i = d.indexOf("[") !== -1 || d.indexOf(".") !== -1 || d.indexOf("#") !== -1 ? d : "[" + d + "]", _ = Array.from(t.querySelectorAll(i));
              t.matches && t.matches(i) && _.push(t);
              for (let v = 0; v < _.length; v++) {
                const E = _[v];
                if (!document.contains(E)) {
                  const w = E[a];
                  w && typeof w.destroy == "function" && w.destroy();
                }
              }
            }
          }
        } else n.type === "attributes" && (p && n.target[a] ? p(n.target, n.attributeName) : (jt(n.target, d, a, b), s && s(n.target)));
      }
    });
    let h = [];
    if (d.indexOf("[") !== -1) {
      const c = /\[([\w-]+)/g;
      let f;
      for (; (f = c.exec(d)) !== null; )
        h.push(f[1]);
    } else
      h.push(d);
    l.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: h.concat(m)
    });
  }, y || (d.indexOf("[") === -1 ? d.replace("data-", "") : "component")), window[a] = u;
  function r() {
    Pe() > 0 ? Tt(function() {
      u(document.body);
    }) : u(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r(), u;
}
function me(d, a) {
  if (d.ctrlKey || d.metaKey || d.shiftKey || d.altKey || d.button !== 0 || !a) return !1;
  const b = a.getAttribute("href");
  return !(!b || a.getAttribute("target") === "_blank" || a.hasAttribute("download") || b.startsWith("mailto:") || b.startsWith("tel:") || b === "#" || b.startsWith("#") || a.hostname && a.hostname !== window.location.hostname);
}
function tt(...d) {
  return d.filter((a) => a != null && a !== "").map((a, b) => b === 0 ? a.replace(/\/+$/, "") : a.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function Et(d, a) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, d, a ? { Authorization: a } : null);
}
function ge(d, a = "ln-core") {
  try {
    return d ? JSON.parse(d) : {};
  } catch (b) {
    return console.error(`[${a}] Invalid headers JSON:`, b), {};
  }
}
const _e = {};
function Be(d, a) {
  _e[d] = a;
}
function He(d) {
  return _e[d] || { ingress: (a) => a, egress: (a) => a };
}
const be = {};
function Jt(d, a) {
  if (!d || typeof a != "object") return;
  const b = d.toLowerCase().split("-")[0];
  be[b] = a;
}
function qt(d) {
  if (!d) return null;
  const a = d.toLowerCase().split("-")[0];
  return be[a] || null;
}
Jt("mk", {
  monthsLong: [
    "јануари",
    "февруари",
    "март",
    "април",
    "мај",
    "јуни",
    "јули",
    "август",
    "септември",
    "октомври",
    "ноември",
    "декември"
  ],
  monthsShort: [
    "јан",
    "фев",
    "мар",
    "апр",
    "мај",
    "јун",
    "јул",
    "авг",
    "септ",
    "окт",
    "ноем",
    "дек"
  ],
  daysLong: [
    "недела",
    "понеделник",
    "вторник",
    "среда",
    "четврток",
    "петок",
    "сабота"
  ],
  daysShort: [
    "нед",
    "пон",
    "вт",
    "ср",
    "чет",
    "пет",
    "саб"
  ]
});
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = Be, window.lnCore.getDataMapper = He, window.lnCore.registerLocaleFallback = Jt, window.lnCore.getLocaleFallback = qt, window.lnCore.fillTemplate = At, window.lnCore.fill = st, window.lnCore.lnFill = Re, window.lnCore.renderList = Oe);
function Zt(d, a) {
  let b = !1;
  return function() {
    b || (b = !0, queueMicrotask(function() {
      b = !1, d(), a && a();
    }));
  };
}
function ye(d) {
  d = d || {};
  let a = d.windowSize > 0 ? d.windowSize : 1e3, b = d.pageSize > 0 ? d.pageSize : 200, y = d.threshold != null ? d.threshold : 25, g = d.fetchDebounce != null ? d.fetchDebounce : 120;
  const m = typeof d.requestPage == "function" ? d.requestPage : function() {
  }, p = typeof d.onChange == "function" ? d.onChange : function() {
  }, s = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  let l = 0, h = 0, c = 0, f = { sort: null, filters: {}, search: "" }, n = null, o = 0, t = 0, e = !1;
  function i(w) {
    u.set(w, ++o);
  }
  function _() {
    return !!(f && (f.search || f.filters && Object.keys(f.filters).length));
  }
  function v() {
    if (s.size <= a) return;
    const w = Array.from(s.keys()).sort(function(L, q) {
      return (u.get(L) || 0) - (u.get(q) || 0);
    });
    let A = 0;
    for (; s.size > a && A < w.length; )
      s.delete(w[A]), u.delete(w[A]), A++;
  }
  function E(w, A) {
    r.add(w), m(f, w, A);
  }
  return {
    get: function(w) {
      return s.get(w);
    },
    has: function(w) {
      return s.has(w);
    },
    peek: function() {
      return s.size ? s.values().next().value : void 0;
    },
    get logicalTotal() {
      return l;
    },
    get grandTotal() {
      return h;
    },
    get queryGen() {
      return c;
    },
    get size() {
      return s.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(w, A) {
      clearTimeout(n), t = w;
      for (let O = w; O < A; O++)
        s.has(O) && i(O);
      if (l <= 0) return;
      const L = Math.max(0, w - y), q = Math.min(l, A + y), x = Math.floor(L / b), I = Math.floor(Math.max(0, q - 1) / b);
      let k = -1;
      for (let O = x; O <= I; O++) {
        const N = O * b, j = Math.min(b, l - N);
        let U = !1;
        const K = Math.max(N, L), z = Math.min(N + j, q);
        for (let et = K; et < z; et++)
          if (!s.has(et)) {
            U = !0;
            break;
          }
        if (U && !r.has(N)) {
          k = N;
          break;
        }
      }
      k !== -1 && (n = setTimeout(function() {
        E(k, b);
      }, g));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    ingest: function(w) {
      if (w = w || {}, w.queryGen != null && w.queryGen !== c) return;
      e && (s.clear(), u.clear(), e = !1), h = w.total != null ? w.total : h, l = w.filtered != null ? w.filtered : w.data ? w.data.length : l;
      const A = w.offset || 0, L = w.data || [];
      for (let q = 0; q < L.length; q++)
        L[q] != null && (s.set(A + q, L[q]), i(A + q));
      r.delete(A), v(), p();
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(w) {
      w && (f = w), E(0, b);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(w) {
      c++, r.clear(), clearTimeout(n), w && (f = w), e = !0, E(0, b);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      c++, r.clear(), clearTimeout(n), e = !0;
      const w = Math.max(0, Math.floor(t / b) * b);
      E(w, b);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(w) {
      r.delete(w);
    },
    destroy: function() {
      clearTimeout(n), s.clear(), u.clear(), r.clear();
    },
    configure: function(w) {
      w = w || {};
      let A = !1;
      if (w.windowSize != null && w.windowSize > 0 && w.windowSize !== a) {
        const L = w.windowSize < a;
        a = w.windowSize, L && v(), A = !0;
      }
      w.pageSize != null && w.pageSize > 0 && (b = w.pageSize), w.threshold != null && w.threshold >= 0 && (y = w.threshold), w.fetchDebounce != null && w.fetchDebounce >= 0 && (g = w.fetchDebounce), A && p();
    },
    setGrandTotal: function(w) {
      w == null || isNaN(w) || w < 0 || (h = w, _() || (l = w), p());
    }
  };
}
const Ue = "ln:";
let yt = null;
function ve() {
  if (yt !== null) return yt;
  try {
    if (typeof localStorage > "u")
      return yt = !1, !1;
    const d = "__ln_test__";
    localStorage.setItem(d, d), localStorage.removeItem(d), yt = !0;
  } catch {
    yt = !1;
  }
  return yt;
}
function ze() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function we(d, a) {
  const b = a.getAttribute("data-ln-persist"), y = b !== null && b !== "" ? b : a.id;
  return y ? Ue + d + ":" + ze() + ":" + y : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', a), null);
}
function Bt(d, a) {
  if (!ve()) return null;
  const b = we(d, a);
  if (!b) return null;
  try {
    const y = localStorage.getItem(b);
    return y !== null ? JSON.parse(y) : null;
  } catch {
    return null;
  }
}
function bt(d, a, b) {
  if (!ve()) return;
  const y = we(d, a);
  if (y)
    try {
      b == null ? localStorage.removeItem(y) : localStorage.setItem(y, JSON.stringify(b));
    } catch {
    }
}
function Ee(d) {
  return (d || "").replace(/^#/, "");
}
function Ht(d) {
  const a = d === void 0 ? location.hash : d, b = {}, y = Ee(a);
  if (!y) return b;
  const g = y.split("&");
  for (let m = 0; m < g.length; m++) {
    const p = g[m];
    if (!p) continue;
    const s = p.indexOf(":"), u = s > -1 ? p.slice(0, s) : p, r = s > -1 ? p.slice(s + 1) : "";
    if (u)
      try {
        b[u] = decodeURIComponent(r);
      } catch {
        b[u] = r;
      }
  }
  return b;
}
function _t(d) {
  if (!d) return null;
  const a = Ht();
  return d in a ? a[d] : null;
}
function lt(d, a) {
  if (!d) return;
  const b = Ht();
  a == null ? delete b[d] : b[d] = String(a);
  const g = Object.keys(b).map(function(m) {
    const p = b[m];
    return p === "" ? m : m + ":" + encodeURIComponent(p);
  }).join("&");
  Ee(location.hash) !== g && (location.hash = g);
}
function te(d) {
  return d.button === 1 || d.ctrlKey || d.metaKey || d.shiftKey ? !1 : (d.preventDefault(), !0);
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Ht, window.lnCore.hashGet = _t, window.lnCore.hashSet = lt, window.lnCore.hashLinkClick = te);
function Ft(d, a, b, y) {
  const g = typeof y == "number" ? y : 4, m = window.innerWidth, p = window.innerHeight, s = a.width, u = a.height, r = (b || "bottom").split("-"), l = r[0], h = r[1] === "start" || r[1] === "end" ? r[1] : "center", c = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, f = c[l] || c.bottom;
  function n(_) {
    return _ === "top" || _ === "bottom" ? h === "start" ? d.left : h === "end" ? d.right - s : d.left + (d.width - s) / 2 : h === "start" ? d.top : h === "end" ? d.bottom - u : d.top + (d.height - u) / 2;
  }
  function o(_) {
    let v, E, w = !0;
    return _ === "top" ? (v = d.top - g - u, E = n(_), v < 0 && (w = !1)) : _ === "bottom" ? (v = d.bottom + g, E = n(_), v + u > p && (w = !1)) : _ === "left" ? (v = n(_), E = d.left - g - s, E < 0 && (w = !1)) : (v = n(_), E = d.right + g, E + s > m && (w = !1)), { top: v, left: E, side: _, fits: w };
  }
  let t = null;
  for (let _ = 0; _ < f.length; _++) {
    const v = o(f[_]);
    if (v.fits) {
      t = v;
      break;
    }
  }
  t || (t = o(f[0]));
  let e = t.top, i = t.left;
  return s >= m ? i = 0 : (i < 0 && (i = 0), i + s > m && (i = m - s)), u >= p ? e = 0 : (e < 0 && (e = 0), e + u > p && (e = p - u)), { top: e, left: i, placement: t.side };
}
function Wt(d) {
  if (!d) return { width: 0, height: 0 };
  const a = d.style, b = a.visibility, y = a.display, g = a.position;
  a.visibility = "hidden", a.display = "block", a.position = "fixed";
  const m = d.offsetWidth, p = d.offsetHeight;
  return a.visibility = b, a.display = y, a.position = g, { width: m, height: p };
}
let pt = null;
async function oe(d) {
  if (!d) {
    pt = null;
    return;
  }
  try {
    const a = new TextEncoder(), b = await crypto.subtle.digest("SHA-256", a.encode(d));
    pt = await crypto.subtle.importKey(
      "raw",
      b,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (a) {
    console.error("[ln-core/crypto] Key derivation failed:", a), pt = null;
  }
}
function gt() {
  return pt;
}
async function je(d, a = pt) {
  const b = a || pt;
  if (!b || d === void 0 || d === null) return d;
  try {
    const y = new TextEncoder(), g = crypto.getRandomValues(new Uint8Array(12)), m = typeof d == "string" ? d : JSON.stringify(d), p = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: g },
      b,
      y.encode(m)
    ), s = btoa(String.fromCharCode(...g)), u = btoa(String.fromCharCode(...new Uint8Array(p)));
    return {
      encrypted: !0,
      iv: s,
      data: u
    };
  } catch (y) {
    return console.error("[ln-core/crypto] Encryption failed:", y), d;
  }
}
async function Ke(d, a = pt) {
  const b = a || pt;
  if (!d || !d.encrypted || !b) return d;
  try {
    const y = new TextDecoder(), g = Uint8Array.from(atob(d.iv), (u) => u.charCodeAt(0)), m = Uint8Array.from(atob(d.data), (u) => u.charCodeAt(0)), p = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: g },
      b,
      m
    ), s = y.decode(p);
    try {
      return JSON.parse(s);
    } catch {
      return s;
    }
  } catch (y) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", y), { ...d, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const d = window.fetch.bind(window), a = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
  function y(r) {
    return typeof r == "string" ? r : r instanceof URL ? r.href : r instanceof Request ? r.url : String(r);
  }
  function g(r, l) {
    return l && l.method ? String(l.method).toUpperCase() : r instanceof Request ? r.method.toUpperCase() : "GET";
  }
  function m(r, l) {
    return l + " " + r;
  }
  function p(r) {
    return r === "GET" || r === "HEAD";
  }
  function s(r, l) {
    l = l || {};
    const h = y(r), c = g(r, l), f = m(h, c);
    p(c) && a.has(f) && (a.get(f).abort(), a.delete(f));
    const n = new AbortController(), o = l.signal;
    let t = null;
    o && (o.aborted ? n.abort(o.reason) : (t = function() {
      n.abort(o.reason);
    }, o.addEventListener("abort", t, { once: !0 })));
    const e = Object.assign({}, l, { signal: n.signal });
    return a.set(f, n), d(r, e).finally(function() {
      o && t && o.removeEventListener("abort", t), a.get(f) === n && a.delete(f);
    });
  }
  s.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = s;
  function u(r) {
    if (!r.detail || !r.detail.url) return;
    const l = r.target, h = (r.detail.method || (r.detail.body ? "POST" : "GET")).toUpperCase(), c = r.detail.key;
    c && b.has(c) && (b.get(c).abort(), b.delete(c));
    const f = new AbortController(), n = r.detail.signal;
    let o = null;
    n && (n.aborted ? f.abort(n.reason) : (o = function() {
      f.abort(n.reason);
    }, n.addEventListener("abort", o, { once: !0 }))), c && b.set(c, f);
    const t = { method: h, signal: f.signal };
    r.detail.body !== void 0 && (t.body = r.detail.body), window.fetch(r.detail.url, t).then(function(e) {
      n && o && n.removeEventListener("abort", o), c && b.get(c) === f && b.delete(c), C(l, "ln-http:response", {
        ok: e.ok,
        status: e.status,
        response: e
      });
    }).catch(function(e) {
      n && o && n.removeEventListener("abort", o), c && b.get(c) === f && b.delete(c), !(e && e.name === "AbortError") && C(l, "ln-http:error", {
        ok: !1,
        status: 0,
        error: e
      });
    });
  }
  document.addEventListener("ln-http:request", u), window.lnHttp = {
    cancel: function(r) {
      let l = !1;
      return a.forEach(function(h, c) {
        c.endsWith(" " + r) && (h.abort(), a.delete(c), l = !0);
      }), l;
    },
    cancelByKey: function(r) {
      return b.has(r) ? (b.get(r).abort(), b.delete(r), !0) : !1;
    },
    cancelAll: function() {
      a.forEach(function(r) {
        r.abort();
      }), a.clear(), b.forEach(function(r) {
        r.abort();
      }), b.clear();
    },
    get inflight() {
      const r = [];
      return a.forEach(function(l, h) {
        const c = h.indexOf(" ");
        r.push({ method: h.slice(0, c), url: h.slice(c + 1) });
      }), b.forEach(function(l, h) {
        r.push({ key: h });
      }), r;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", u), window.fetch = d, delete window.lnHttp;
    }
  };
})();
(function() {
  const d = "template[data-ln-include]", a = "lnInclude";
  if (window[a] !== void 0) return;
  const b = /* @__PURE__ */ new Map();
  function y(g) {
    if (this.dom = g, this.url = g.getAttribute("data-ln-include"), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    Fe(), this._held = !0;
    const m = this, p = this.url;
    let s = b.get(p);
    return s || (s = fetch(p).then(function(u) {
      if (!u.ok)
        throw new Error("HTTP error! status: " + u.status);
      return u.text();
    }).catch(function(u) {
      throw b.delete(p), u;
    }), b.set(p, s)), s.then(function(u) {
      if (m._destroyed) return;
      const r = document.createElement("template");
      r.innerHTML = u, m.dom.content.appendChild(r.content), C(m.dom, "ln-include:loaded", { target: m.dom, url: m.url }), m._held && (m._held = !1, Kt());
    }).catch(function(u) {
      m._destroyed || (console.error("[ln-include] Failed to fetch template from " + m.url + ":", u), C(m.dom, "ln-include:error", { target: m.dom, url: m.url, error: u }), m._held && (m._held = !1, Kt()));
    }), this;
  }
  y.prototype.destroy = function() {
    this.dom[a] && (this._destroyed = !0, this._held && (this._held = !1, Kt()), delete this.dom[a]);
  }, H(d, a, y, "ln-include");
})();
(function() {
  const d = "data-ln-form", a = "lnForm", b = "data-ln-form-action-edit", y = "data-ln-form-action-method";
  if (window[a] !== void 0) return;
  function g(m) {
    this.dom = m, this._baseAction = m.getAttribute("action") || "";
    const p = this;
    return this._onLnFill = function(s) {
      s.target === p.dom && (s.detail ? (p.fill(s.detail), p._applyActionMode(s.detail)) : p.dom.reset());
    }, this._onReset = function() {
      p._applyActionMode(null);
    }, m.addEventListener("ln-fill", this._onLnFill), m.addEventListener("reset", this._onReset), this;
  }
  g.prototype.fill = function(m) {
    const p = fe(this.dom, m);
    for (let s = 0; s < p.length; s++) {
      const u = p[s], r = u.tagName === "SELECT" || u.type === "checkbox" || u.type === "radio";
      u.dispatchEvent(new Event(r ? "change" : "input", { bubbles: !0 }));
    }
  }, g.prototype._ensureMethodInput = function() {
    let m = this.dom.querySelector('input[name="_method"]');
    return m || (m = document.createElement("input"), m.type = "hidden", m.name = "_method", m.value = "", this.dom.appendChild(m)), m;
  }, g.prototype._applyActionMode = function(m) {
    if (!this.dom.hasAttribute(b)) return;
    const p = m && m.id != null && m.id !== "" ? m.id : null, s = this._ensureMethodInput();
    if (p !== null) {
      const u = this.dom.getAttribute(b);
      u ? this.dom.setAttribute("action", u.replace(":id", encodeURIComponent(p))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(p)), s.value = this.dom.getAttribute(y) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), s.value = "";
  }, g.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), C(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[a]);
  }, H(d, a, g, "ln-form");
})();
(function() {
  const d = "data-ln-validate", a = "lnValidate", b = "data-ln-validate-errors", y = "data-ln-validate-error", g = "ln-validate-valid", m = "ln-validate-invalid", p = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[a] !== void 0) return;
  function s(u) {
    this.dom = u, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const r = this, l = u.tagName, h = u.type, c = l === "SELECT" || h === "checkbox" || h === "radio";
    this._onInput = function() {
      r._touched = !0, r.validate();
    }, this._onChange = function() {
      r._touched = !0, r.validate();
    }, this._onSetCustom = function(n) {
      const o = n.detail && n.detail.error;
      if (!o) return;
      r._customErrors.add(o), r._touched = !0;
      const t = u.closest(".form-element");
      if (t) {
        const e = t.querySelector("[" + y + '="' + o + '"]');
        e && e.classList.remove("hidden");
      }
      u.classList.remove(g), u.classList.add(m), u.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(n) {
      const o = n.detail && n.detail.error, t = u.closest(".form-element");
      if (o) {
        if (r._customErrors.delete(o), t) {
          const e = t.querySelector("[" + y + '="' + o + '"]');
          e && e.classList.add("hidden");
        }
      } else
        r._customErrors.forEach(function(e) {
          if (t) {
            const i = t.querySelector("[" + y + '="' + e + '"]');
            i && i.classList.add("hidden");
          }
        }), r._customErrors.clear();
      r._touched && r.validate();
    }, c || u.addEventListener("input", this._onInput), u.addEventListener("change", this._onChange), u.addEventListener("ln-validate:set-custom", this._onSetCustom), u.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const f = u.form;
    return f && (f.hasAttribute("novalidate") || f.setAttribute("novalidate", ""), this._onFormReset = function() {
      r.reset();
    }, this._onValidateRequest = function(n) {
      r._touched = !0, !r.validate() && n.detail && n.detail.invalidFields && n.detail.invalidFields.push(r.dom);
    }, f.addEventListener("reset", this._onFormReset), f.addEventListener("ln-validate:request-validate", this._onValidateRequest), f._lnValidateGateBound || (f._lnValidateGateBound = !0, f.addEventListener("submit", function(n) {
      const o = { invalidFields: [] };
      C(f, "ln-validate:request-validate", o), o.invalidFields.length > 0 && (n.preventDefault(), o.invalidFields.sort((t, e) => t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), o.invalidFields[0].focus());
    }))), this;
  }
  s.prototype.validate = function() {
    const u = this.dom, r = u.validity, h = u.checkValidity() && this._customErrors.size === 0, c = u.closest(".form-element");
    if (c) {
      const n = c.querySelector("[" + b + "]");
      if (n) {
        const o = n.querySelectorAll("[" + y + "]");
        for (let t = 0; t < o.length; t++) {
          const e = o[t].getAttribute(y), i = p[e];
          i && (r[i] ? o[t].classList.remove("hidden") : o[t].classList.add("hidden"));
        }
      }
    }
    return u.classList.toggle(g, h), u.classList.toggle(m, !h), u.setAttribute("aria-invalid", h ? "false" : "true"), C(u, h ? "ln-validate:valid" : "ln-validate:invalid", { target: u, field: u.name }), h;
  }, s.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(g, m), this.dom.removeAttribute("aria-invalid");
    const u = this.dom.closest(".form-element");
    if (u) {
      const r = u.querySelectorAll("[" + y + "]");
      for (let l = 0; l < r.length; l++)
        r[l].classList.add("hidden");
    }
  }, Object.defineProperty(s.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), s.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const u = this.dom.form;
    u && (this._onFormReset && u.removeEventListener("reset", this._onFormReset), this._onValidateRequest && u.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(g, m), this.dom.removeAttribute("aria-invalid"), C(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[a];
  }, H(d, a, s, "ln-validate");
})();
(function() {
  const d = "data-ln-ajax", a = "lnAjax", b = "data-ln-form-scope";
  if (window[a] !== void 0) return;
  function y(h) {
    if (!h.hasAttribute(d) || h[a]) return;
    h[a] = !0;
    const c = u(h);
    g(c.links), m(c.forms);
  }
  function g(h) {
    for (const c of h) {
      if (c[a + "Trigger"] || c.hostname && c.hostname !== window.location.hostname) continue;
      const f = c.getAttribute("href");
      if (f && f.includes("#")) continue;
      const n = function(o) {
        if (!me(o, c)) return;
        o.preventDefault();
        const t = c.getAttribute("href");
        t && s("GET", t, null, c);
      };
      c.addEventListener("click", n), c[a + "Trigger"] = n;
    }
  }
  function m(h) {
    for (const c of h) {
      if (c[a + "Trigger"]) continue;
      if (c.hasAttribute(b)) {
        c[a + "ScopeWarned"] || (c[a + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const f = function(n) {
        if (n.defaultPrevented) return;
        n.preventDefault();
        const o = c.method.toUpperCase(), t = c.action, e = new FormData(c);
        for (const i of c.querySelectorAll('button, input[type="submit"]'))
          i.disabled = !0;
        s(o, t, e, c, function() {
          for (const i of c.querySelectorAll('button, input[type="submit"]'))
            i.disabled = !1;
        });
      };
      c.addEventListener("submit", f), c[a + "Trigger"] = f;
    }
  }
  function p(h) {
    if (!h[a]) return;
    const c = u(h);
    for (const f of c.links)
      f[a + "Trigger"] && (f.removeEventListener("click", f[a + "Trigger"]), delete f[a + "Trigger"]);
    for (const f of c.forms)
      f[a + "Trigger"] && (f.removeEventListener("submit", f[a + "Trigger"]), delete f[a + "Trigger"]);
    delete h[a];
  }
  function s(h, c, f, n, o) {
    if (J(n, "ln-ajax:before-start", { method: h, url: c }).defaultPrevented) return;
    C(n, "ln-ajax:start", { method: h, url: c }), n.classList.add("ln-ajax--loading");
    const e = document.createElement("span");
    e.className = "ln-ajax-spinner", n.appendChild(e);
    function i() {
      n.classList.remove("ln-ajax--loading");
      const A = n.querySelector(".ln-ajax-spinner");
      A && A.remove(), o && o();
    }
    let _ = c;
    const v = document.querySelector('meta[name="csrf-token"]'), E = v ? v.getAttribute("content") : null;
    f instanceof FormData && E && f.append("_token", E);
    const w = {
      method: h,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (E && (w.headers["X-CSRF-TOKEN"] = E), h === "GET" && f) {
      const A = new URLSearchParams(f);
      _ = c + (c.includes("?") ? "&" : "?") + A.toString();
    } else h !== "GET" && f && (w.body = f);
    fetch(_, w).then(function(A) {
      const L = A.ok;
      return A.json().then(function(q) {
        return { ok: L, status: A.status, data: q };
      });
    }).then(function(A) {
      const L = A.data;
      if (A.ok) {
        if (L.title && (document.title = L.title), L.content)
          for (const q in L.content) {
            const x = document.getElementById(q);
            x && (x.innerHTML = L.content[q]);
          }
        if (n.tagName === "A") {
          const q = n.getAttribute("href");
          q && window.history.pushState({ ajax: !0 }, "", q);
        } else n.tagName === "FORM" && n.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", _);
        C(n, "ln-ajax:success", { method: h, url: _, data: L });
      } else
        C(n, "ln-ajax:error", { method: h, url: _, status: A.status, data: L });
      if (L.message) {
        const q = L.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: q.type || (A.ok ? "success" : "error"),
            title: q.title || "",
            message: q.body || ""
          }
        }));
      }
      C(n, "ln-ajax:complete", { method: h, url: _ }), i();
    }).catch(function(A) {
      C(n, "ln-ajax:error", { method: h, url: _, error: A }), C(n, "ln-ajax:complete", { method: h, url: _ }), i();
    });
  }
  function u(h) {
    const c = { links: [], forms: [] };
    return h.tagName === "A" && h.getAttribute(d) !== "false" ? c.links.push(h) : h.tagName === "FORM" && h.getAttribute(d) !== "false" ? c.forms.push(h) : (c.links = Array.from(h.querySelectorAll('a:not([data-ln-ajax="false"])')), c.forms = Array.from(h.querySelectorAll('form:not([data-ln-ajax="false"])'))), c;
  }
  function r() {
    ut(function() {
      new MutationObserver(function(c) {
        for (const f of c)
          if (f.type === "childList") {
            for (const n of f.addedNodes)
              if (n.nodeType === 1 && (y(n), !n.hasAttribute(d))) {
                for (const t of n.querySelectorAll("[" + d + "]"))
                  y(t);
                const o = n.closest && n.closest("[" + d + "]");
                if (o && o.getAttribute(d) !== "false") {
                  const t = u(n);
                  g(t.links), m(t.forms);
                }
              }
          } else f.type === "attributes" && y(f.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-ajax");
  }
  function l() {
    for (const h of document.querySelectorAll("[" + d + "]"))
      y(h);
  }
  window[a] = y, window[a].destroy = p, r(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", l) : l();
})();
const Ae = {
  navigate: function(d) {
    xt(d, { historyAction: "push" });
  },
  replace: function(d) {
    xt(d, { historyAction: "replace" });
  },
  current: function() {
    return Qt ? {
      path: Gt,
      params: Le,
      query: Te,
      route: Qt,
      regions: Ce
    } : null;
  }
}, ee = "data-ln-route", Se = "lnRoute";
typeof window < "u" && (window.lnRouter = Ae);
const dt = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new WeakMap();
let Ce = /* @__PURE__ */ new Map(), se = !1, Gt = null, Le = {}, Te = {}, Qt = null, $t = !1;
function ae(d, a, b) {
  $t ? queueMicrotask(function() {
    C(d, a, b);
  }) : C(d, a, b);
}
function Pt(d) {
  try {
    const m = new URL(d, window.location.origin);
    d = m.pathname + m.search + m.hash;
  } catch {
  }
  let [a] = d.split("#"), [b, y] = a.split("?");
  const g = {};
  if (y) {
    const m = new URLSearchParams(y);
    for (const [p, s] of m.entries())
      g[p] = s;
  }
  return b = b.replace(/\/+$/, ""), b === "" && (b = "/"), { path: b, query: g };
}
function qe(d, a) {
  if (d.pattern === "*") return 1;
  if (a.pattern === "*") return -1;
  const b = d.segments, y = a.segments, g = Math.max(b.length, y.length);
  for (let m = 0; m < g; m++) {
    const p = b[m], s = y[m];
    if (p === void 0) return 1;
    if (s === void 0) return -1;
    if (p === "*") return 1;
    if (s === "*") return -1;
    const u = p.startsWith(":"), r = s.startsWith(":");
    if (u && !r) return 1;
    if (!u && r) return -1;
  }
  return 0;
}
function xe(d, a) {
  const b = d.split("/").filter(Boolean);
  for (const y of a) {
    if (y.pattern === "*")
      return {
        route: y,
        params: { wildcard: d }
      };
    const g = y.segments, m = {};
    let p = !0;
    if (!(b.length > g.length && g[g.length - 1] !== "*")) {
      for (let s = 0; s < g.length; s++) {
        const u = g[s], r = b[s];
        if (u === "*") {
          m.wildcard = b.slice(s).join("/");
          break;
        }
        if (r === void 0) {
          p = !1;
          break;
        }
        if (u.startsWith(":"))
          m[u.slice(1)] = decodeURIComponent(r);
        else if (u !== r) {
          p = !1;
          break;
        }
      }
      if (p && (g.indexOf("*") !== -1 || b.length <= g.length))
        return { route: y, params: m };
    }
  }
  return null;
}
function Yt(d, a) {
  if (d !== "__primary__") {
    const y = document.getElementById(a.target);
    return y || console.warn(`[ln-router] Explicit target element #${a.target} not found in DOM`), y;
  }
  const b = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return b || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), b;
}
function Ve(d) {
  if (!d) return;
  const a = Array.from(d.querySelectorAll("*")), b = [d].concat(a);
  for (const g of b)
    for (const m of Object.keys(g))
      if (m.startsWith("ln") && g[m] && typeof g[m].destroy == "function")
        try {
          g[m].destroy();
        } catch (p) {
          console.error(`[ln-router] Error destroying component ${m} on element:`, g, p);
        }
  const y = document.querySelectorAll('[data-ln-popover="open"]');
  for (const g of y) {
    const m = g.lnPopover;
    if (m && m.trigger && d.contains(m.trigger))
      try {
        m.destroy();
      } catch (p) {
        console.error("[ln-router] Error destroying open popover:", p);
      }
  }
}
function xt(d, a = {}) {
  const { path: b, query: y } = Pt(d), g = /* @__PURE__ */ new Map();
  for (const [l, h] of dt)
    g.set(l, xe(b, h.sorted));
  const m = dt.has("__primary__"), p = g.get("__primary__");
  if (m && !p) {
    ae(document.body, "ln-router:not-found", { path: b });
    return;
  }
  let s = null;
  if (p && (s = Yt("__primary__", p.route), !s || J(s, "ln-router:before-navigate", {
    from: Gt,
    to: d,
    params: p.params,
    query: y
  }).defaultPrevented))
    return;
  const u = [];
  for (const [l, h] of g) {
    if (!h) continue;
    const c = Yt(l, h.route);
    c && (l !== "__primary__" && c.hasAttribute("data-ln-route-keep") && re.get(c) === h.route.templateNode || u.push({ regionKey: l, match: h, targetEl: c }));
  }
  a.historyAction === "push" ? window.history.pushState(null, "", d) : a.historyAction === "replace" && window.history.replaceState(null, "", d);
  const r = function() {
    for (const { regionKey: l, match: h, targetEl: c } of u) {
      if (!(a.isHydration && c.hasAttribute("data-ln-router-hydrate") && c.children.length > 0)) {
        Ve(c);
        const n = h.route.templateNode.content.cloneNode(!0);
        c.replaceChildren(n);
      }
      if (re.set(c, h.route.templateNode), l === "__primary__" && (h.route.title && (document.title = h.route.title), !a.isHydration)) {
        c.hasAttribute("tabindex") || c.setAttribute("tabindex", "-1");
        const n = c.querySelector("h1, h2, h3, h4, h5, h6");
        n ? (n.setAttribute("tabindex", "-1"), n.focus()) : c.focus(), c.scrollIntoView({ block: "start", behavior: "instant" });
      }
      ae(c, "ln-router:navigated", {
        path: d,
        params: h.params,
        query: y,
        route: h.route,
        target: c,
        region: l
      });
    }
    p && (Gt = d, Le = p.params, Te = y, Qt = p.route), Ce = new Map(
      Array.from(g.entries()).map(([l, h]) => [l, h ? { route: h.route, params: h.params } : null])
    );
  };
  document.startViewTransition && !a.isHydration ? document.startViewTransition(r) : r();
}
function We(d) {
  const a = d.target.closest("a");
  if (!a || !me(d, a)) return;
  const b = a.getAttribute("href"), { path: y } = Pt(b), g = dt.get("__primary__");
  if (!g) return;
  xe(y, g.sorted) && (d.preventDefault(), xt(b, { historyAction: "push" }));
}
function Ge(d, a) {
  const b = Object.keys(d), y = Object.keys(a);
  if (b.length !== y.length) return !1;
  for (let g = 0; g < b.length; g++) {
    const m = b[g];
    if (d[m] !== a[m]) return !1;
  }
  return !0;
}
function Qe() {
  const d = window.location.pathname + window.location.search, a = Ae.current();
  if (a && a.path != null) {
    const b = Pt(d);
    if (Pt(a.path).path === b.path && Ge(a.query, b.query))
      return;
  }
  xt(d, { historyAction: "skip" });
}
function $e() {
  se || (se = !0, ut(function() {
    document.addEventListener("click", We), window.addEventListener("popstate", Qe), $t = !0;
    const d = window.location.pathname + window.location.search + window.location.hash;
    xt(d, { historyAction: "replace", isHydration: !0 }), $t = !1;
  }, "ln-router"));
}
function Ye(d) {
  const a = d.getAttribute(ee);
  if (!a) return;
  const b = d.getAttribute("data-ln-route-target") || null;
  if (b === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${a}" rejected.`);
    return;
  }
  const y = b || "__primary__";
  dt.has(y) || dt.set(y, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const g = dt.get(y);
  if (g.routes.has(a)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${a}" in region "${y}"`);
    return;
  }
  const m = d.getAttribute("data-ln-route-title"), p = a.split("/").filter(Boolean), s = {
    pattern: a,
    segments: p,
    target: b,
    title: m,
    templateNode: d
  }, u = Yt(y, s);
  u && u.contains(d) && console.warn(`[ln-router] Route template with pattern "${a}" is declared inside its own outlet element:`, d), g.routes.set(a, s), g.sorted = Array.from(g.routes.values()).sort(qe);
}
function Xe(d) {
  const a = d.getAttribute(ee);
  if (!a) return;
  const y = d.getAttribute("data-ln-route-target") || null || "__primary__", g = dt.get(y);
  g && (g.routes.delete(a), g.sorted = Array.from(g.routes.values()).sort(qe), g.routes.size === 0 && dt.delete(y));
}
function ke(d) {
  return this.dom = d, Ye(d), this;
}
ke.prototype.destroy = function() {
  Xe(this.dom), delete this.dom[Se];
};
H(ee, Se, ke, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    dt.size > 0 && $e();
  }
});
(function() {
  const d = "data-ln-modal", a = "lnModal";
  if (window[a] !== void 0) return;
  function b(g) {
    this.dom = g, this.isOpen = g.getAttribute(d) === "open";
    const m = this;
    return this._onRequestOpen = function() {
      m.dom.setAttribute(d, "open");
    }, this._onRequestClose = function() {
      m.dom.setAttribute(d, "close");
    }, this._onCancel = function(p) {
      p.preventDefault(), m.dom.setAttribute(d, "close");
    }, this._onClickClose = function(p) {
      const s = p.target.closest("[data-ln-modal-close]");
      s && m.dom.contains(s) && (p.preventDefault(), m.dom.setAttribute(d, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  b.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const g = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + d + '="open"]'),
          function(p) {
            return p !== g;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      C(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[a];
    }
  };
  function y(g) {
    const m = g[a];
    if (!m) return;
    const s = g.getAttribute(d) === "open";
    if (s !== m.isOpen)
      if (s) {
        if (J(g, "ln-modal:before-open", { modalId: g.id, target: g }).defaultPrevented) {
          g.setAttribute(d, "close");
          return;
        }
        m.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof g.showModal == "function" && g.showModal();
        const r = g.querySelector("[autofocus]");
        if (r && Dt(r))
          r.focus();
        else {
          const l = g.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), h = Array.prototype.find.call(l, Dt);
          if (h) h.focus();
          else {
            const c = g.querySelectorAll("a[href], button:not([disabled])"), f = Array.prototype.find.call(c, Dt);
            f && f.focus();
          }
        }
        C(g, "ln-modal:open", { modalId: g.id, target: g });
      } else {
        if (J(g, "ln-modal:before-close", { modalId: g.id, target: g }).defaultPrevented) {
          g.setAttribute(d, "open");
          return;
        }
        m.isOpen = !1, C(g, "ln-modal:close", { modalId: g.id, target: g }), typeof g.close == "function" && g.close(), document.querySelector("[" + d + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  H(d, a, b, "ln-modal", {
    onAttributeChange: y
  });
})();
(function() {
  const d = "data-ln-modal-coordinator", a = "lnModalCoordinator";
  if (window[a] !== void 0) return;
  function b(h, c) {
    if (c) {
      if (h) {
        const n = h.closest("[" + d + "]");
        if (n) {
          if (n.id === c && n.hasAttribute("data-ln-modal")) return n;
          const o = n.querySelector("#" + CSS.escape(c) + '[data-ln-modal], [data-ln-modal="' + c + '"]');
          if (o) return o;
        }
      }
      const f = document.getElementById(c) || document.querySelector('[data-ln-modal="' + c + '"]');
      if (f) return f;
    }
    if (h) {
      const f = h.closest("[" + d + "]");
      if (f) {
        if (f.hasAttribute("data-ln-modal")) return f;
        const o = f.querySelector("[data-ln-modal]");
        if (o) return o;
      }
      const n = h.closest("[data-ln-modal]");
      if (n) return n;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function y(h, c) {
    if (h !== "edit") return "";
    if (c) {
      const f = c.getAttribute("data-ln-fill-id");
      if (f) return f;
    }
    return "edit";
  }
  function g(h) {
    if (!h) return;
    const c = h.querySelectorAll("[data-ln-field]");
    for (let n = 0; n < c.length; n++)
      c[n].textContent = "";
    const f = h.querySelectorAll("form");
    for (let n = 0; n < f.length; n++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(f[n], null) : f[n].reset();
  }
  document.addEventListener("submit", function(h) {
    if (h.defaultPrevented) return;
    const f = h.target.closest("[data-ln-modal]");
    if (f && f.id) {
      try {
        sessionStorage.setItem("ln-modal-pending:" + f.id, "true");
      } catch {
      }
      lt(f.id, null);
    }
  }), document.addEventListener("click", function(h) {
    if (h.ctrlKey || h.metaKey || h.button === 1) return;
    const c = h.target.closest("[data-ln-modal-for]");
    if (c) {
      const n = c.getAttribute("data-ln-modal-for"), o = b(c, n);
      if (o && o.lnModal) {
        h.preventDefault();
        const t = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, e = {}, i = c.dataset;
        for (const E in i) {
          if (!E.startsWith("lnModal") || t[E]) continue;
          const w = E.slice(7);
          w && (e[w.charAt(0).toLowerCase() + w.slice(1)] = i[E]);
        }
        const _ = Object.keys(e).length > 0;
        c.hasAttribute("data-ln-modal-mode") ? o.dataset.lnModalMode = c.getAttribute("data-ln-modal-mode") : o.dataset.lnModalMode = _ ? "edit" : "new", _ && window.lnCore && typeof window.lnCore.fill == "function" ? window.lnCore.fill(o, e) : o.dataset.lnModalMode === "new" && g(o), o.getAttribute("data-ln-modal") === "open" ? C(o, "ln-modal:request-close", {}) : (o.id && lt(o.id, y(o.dataset.lnModalMode, c)), C(o, "ln-modal:request-open", {}));
      }
      return;
    }
    const f = h.target.closest('a[href^="#"]');
    if (f) {
      const n = Ht(f.getAttribute("href"));
      for (const o in n) {
        const t = document.getElementById(o);
        if (t && t.lnModal) {
          if (!te(h)) return;
          lt(o, n[o]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(h) {
    const c = h.target;
    if (!c || !c.lnModal) return;
    (c.dataset.lnModalMode || "new") === "new" && g(c);
  }), document.addEventListener("ln-modal:open", function(h) {
    const c = h.target;
    if (!c || !c.lnModal || !c.id) return;
    let f = _t(c.id);
    f === null && (f = y(c.dataset.lnModalMode, null), lt(c.id, f)), f ? (c.dataset.lnModalMode = "edit", c.dispatchEvent(new CustomEvent("ln-fill:request", {
      bubbles: !0,
      detail: { id: f }
    }))) : (c.dataset.lnModalMode = "new", g(c));
  });
  let m = !1;
  function p() {
    if (!m) {
      m = !0;
      try {
        const h = document.querySelectorAll("[data-ln-modal][id]");
        for (let c = 0; c < h.length; c++) {
          const f = h[c];
          if (!f.lnModal) continue;
          const n = f.id, o = "ln-modal-pending:" + n;
          let t = !1;
          try {
            t = sessionStorage.getItem(o) === "true";
          } catch {
          }
          if (t) {
            try {
              sessionStorage.removeItem(o);
            } catch {
            }
            if (!!(document.querySelector(".has-error, [data-ln-validate-error], .form-error, .alert-danger") || f.querySelector(".has-error, [data-ln-validate-error], .form-error, .alert-danger"))) {
              f.dataset.lnModalMode = "edit", C(f, "ln-modal:request-open", {});
              continue;
            } else {
              lt(n, null), C(f, "ln-modal:request-close", {}), g(f);
              continue;
            }
          }
          const e = _t(n), i = e !== null, _ = f.lnModal.isOpen;
          if (i) {
            const v = e ? "edit" : "new";
            f.dataset.lnModalMode = v, _ ? e ? f.dispatchEvent(new CustomEvent("ln-fill:request", {
              bubbles: !0,
              detail: { id: e }
            })) : g(f) : C(f, "ln-modal:request-open", {});
          } else _ && C(f, "ln-modal:request-close", {});
        }
      } finally {
        m = !1;
      }
    }
  }
  function s() {
    const h = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let c = 0; c < h.length; c++) {
      const f = h[c];
      f.lnModal && _t(f.id) === null && lt(f.id, y(f.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", p);
  function u() {
    s(), p();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    Tt(u);
  }) : Tt(u);
  function r(h) {
    const c = h.target.closest("[data-ln-modal]");
    if (!(!c || !c.lnModal)) {
      if (c.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + c.id);
        } catch {
        }
        lt(c.id, null);
      }
      C(c, "ln-modal:request-close", {}), g(c);
    }
  }
  document.addEventListener("ln-form:success", r), document.addEventListener("ln-ajax:success", r), document.addEventListener("ln-modal:close", function(h) {
    const c = h.target;
    if (!(!c || !c.lnModal)) {
      if (c.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + c.id);
        } catch {
        }
        _t(c.id) !== null && lt(c.id, null);
      }
      c.dataset.lnModalMode === "new" && g(c);
    }
  });
  function l(h) {
    return this.dom = h, this;
  }
  l.prototype.destroy = function() {
    this.dom[a] && delete this.dom[a];
  }, H(d, a, l, "ln-modal-coordinator");
})();
(function() {
  const d = "data-ln-number", a = "lnNumber";
  if (window[a] !== void 0) return;
  const b = {}, y = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(r) {
    if (!b[r]) {
      const l = new Intl.NumberFormat(r, { useGrouping: !0 }), h = l.formatToParts(1234.5);
      let c = "", f = ".";
      for (let n = 0; n < h.length; n++)
        h[n].type === "group" && (c = h[n].value), h[n].type === "decimal" && (f = h[n].value);
      b[r] = { fmt: l, groupSep: c, decimalSep: f };
    }
    return b[r];
  }
  function m(r, l, h) {
    if (h !== null) {
      const c = parseInt(h, 10), f = r + "|d" + c;
      return b[f] || (b[f] = new Intl.NumberFormat(r, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: c })), b[f].format(l);
    }
    return g(r).fmt.format(l);
  }
  function p(r) {
    if (r[a]) return r[a];
    if (r[a] = this, this.dom = r, r.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const l = document.createElement("input");
    l.type = "hidden", l.name = r.name, r.removeAttribute("name"), r.hasAttribute("data-ln-fill-as") && l.setAttribute("data-ln-fill-as", r.getAttribute("data-ln-fill-as")), r.type = "text", r.setAttribute("inputmode", "decimal"), r.insertAdjacentElement("afterend", l), this._hidden = l;
    const h = this;
    Object.defineProperty(l, "value", {
      get: function() {
        return y.get.call(l);
      },
      set: function(f) {
        y.set.call(l, f), f !== "" && !isNaN(parseFloat(f)) ? h._setDisplayRaw(m($(h.dom), parseFloat(f), h.dom.getAttribute("data-ln-number-decimals"))) : h._setDisplayRaw(""), h.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), pe(r, y, {
      get: function() {
        return y.get.call(r);
      },
      set: function(f) {
        if (f === "") {
          h._setDisplayRaw(""), h._setHiddenRaw(""), r.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const n = typeof f == "number" ? f : parseFloat(String(f).replace(/[^\d.-]/g, ""));
        isNaN(n) ? (h._setDisplayRaw(String(f)), h._setHiddenRaw("")) : (h._setHiddenRaw(n), h._setDisplayRaw(m($(r), n, r.getAttribute("data-ln-number-decimals")))), r.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      h._handleInput();
    }, r.addEventListener("input", this._onInput), this._onPaste = function(f) {
      f.preventDefault();
      const n = (f.clipboardData || window.clipboardData).getData("text"), o = g($(r)), t = o.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let e = n.replace(new RegExp("[^0-9\\-" + t + ".]", "g"), "");
      o.groupSep && (e = e.split(o.groupSep).join("")), o.decimalSep !== "." && (e = e.replace(o.decimalSep, "."));
      const i = parseFloat(e);
      h.value = isNaN(i) ? NaN : i;
    }, r.addEventListener("paste", this._onPaste);
    const c = r.value;
    if (c !== "") {
      const f = parseFloat(c);
      isNaN(f) || (this._setHiddenRaw(f), this._setDisplayRaw(m($(r), f, r.getAttribute("data-ln-number-decimals"))), r.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  function s(r) {
    if (typeof r == "number") return isNaN(r) ? null : r;
    if (!r || typeof r != "string") return null;
    let l = r.trim();
    if (l === "") return null;
    l = l.replace(/[\s\u00A0$€£]/g, ""), l.indexOf(",") !== -1 && l.indexOf(".") !== -1 ? l.indexOf(".") < l.indexOf(",") ? l = l.replace(/\./g, "").replace(",", ".") : l = l.replace(/,/g, "") : l.indexOf(",") !== -1 && (l = l.replace(",", ".")), l = l.replace(/[^\d.-]/g, "");
    const h = parseFloat(l);
    return isNaN(h) ? null : h;
  }
  p.prototype._initTextElement = function() {
    const r = this.dom;
    let l = r.getAttribute("data-ln-value"), h = r.getAttribute("data-ln-number"), c = null;
    l !== null && l !== "" ? c = l : h !== null && h !== "" && h !== "true" ? c = h : c = r.textContent.trim();
    const f = s(c);
    f !== null ? (this._rawValue = f, r.hasAttribute("data-ln-value") || r.setAttribute("data-ln-value", String(f)), this._formatTextContent()) : this._rawValue = null;
  }, p.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const r = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = m($(this.dom), this._rawValue, r);
    }
  }, p.prototype._handleInput = function() {
    const r = this.dom, l = g($(r)), h = y.get.call(r);
    if (h === "") {
      this._setHiddenRaw(""), C(r, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (h === "-") {
      this._setHiddenRaw("");
      return;
    }
    const c = r.selectionStart;
    let f = 0;
    for (let A = 0; A < c; A++)
      /[0-9]/.test(h[A]) && f++;
    let n = h;
    if (l.groupSep && (n = n.split(l.groupSep).join("")), n = n.replace(l.decimalSep, "."), h.endsWith(l.decimalSep) || h.endsWith(".")) {
      const A = n.replace(/\.$/, ""), L = parseFloat(A);
      isNaN(L) || this._setHiddenRaw(L);
      return;
    }
    const o = n.indexOf(".");
    if (o !== -1 && n.slice(o + 1).endsWith("0")) {
      const L = parseFloat(n);
      isNaN(L) || this._setHiddenRaw(L);
      return;
    }
    const t = r.getAttribute("data-ln-number-decimals");
    if (t !== null && o !== -1) {
      const A = parseInt(t, 10);
      n.slice(o + 1).length > A && (n = n.slice(0, o + 1 + A));
    }
    const e = parseFloat(n);
    if (isNaN(e)) return;
    const i = r.getAttribute("data-ln-number-min"), _ = r.getAttribute("data-ln-number-max");
    if (i !== null && e < parseFloat(i) || _ !== null && e > parseFloat(_)) return;
    let v;
    if (t !== null)
      v = m($(r), e, t);
    else {
      const A = o !== -1 ? n.slice(o + 1).length : 0;
      if (A > 0) {
        const L = $(r) + "|u" + A;
        b[L] || (b[L] = new Intl.NumberFormat($(r), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), v = b[L].format(e);
      } else
        v = l.fmt.format(e);
    }
    this._setDisplayRaw(v);
    let E = f, w = 0;
    for (let A = 0; A < v.length && E > 0; A++)
      w = A + 1, /[0-9]/.test(v[A]) && E--;
    E > 0 && (w = v.length), r.setSelectionRange(w, w), this._setHiddenRaw(e), C(r, "ln-number:input", { value: e, formatted: v });
  }, p.prototype._setHiddenRaw = function(r) {
    this._hidden && y.set.call(this._hidden, String(r));
  }, p.prototype._setDisplayRaw = function(r) {
    this.isTextElement ? this.dom.textContent = String(r) : y.set.call(this.dom, String(r));
  }, p.prototype._displayFormatted = function(r) {
    this.isTextElement ? this._formatTextContent() : this._setDisplayRaw(m($(this.dom), r, this.dom.getAttribute("data-ln-number-decimals")));
  }, Object.defineProperty(p.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const r = y.get.call(this._hidden);
      return r === "" ? NaN : parseFloat(r);
    },
    set: function(r) {
      if (this.isTextElement) {
        typeof r != "number" || isNaN(r) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = r, this.dom.setAttribute("data-ln-value", String(r)), this._formatTextContent());
        return;
      }
      if (typeof r != "number" || isNaN(r)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(r), this._setDisplayRaw(m($(this.dom), r, this.dom.getAttribute("data-ln-number-decimals"))), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(p.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : y.get.call(this.dom);
    }
  }), p.prototype.destroy = function() {
    this.dom[a] && (this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), C(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function u() {
    new MutationObserver(function() {
      const r = document.querySelectorAll("[" + d + "]");
      for (let l = 0; l < r.length; l++) {
        const h = r[l][a];
        h && (h.isTextElement ? h._formatTextContent() : isNaN(h.value) || h._displayFormatted(h.value));
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  H(d, a, p, "ln-number", {
    extraAttributes: [
      "data-ln-value",
      "data-ln-number-decimals",
      "data-ln-number-min",
      "data-ln-number-max",
      "lang"
    ],
    onAttributeChange: function(r) {
      const l = r[a];
      l && (l.isTextElement ? l._initTextElement() : isNaN(l.value) || l._displayFormatted(l.value));
    }
  }), u();
})();
(function() {
  const d = "data-ln-date", a = "lnDate";
  if (window[a] !== void 0) return;
  const b = {}, y = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(i, _) {
    const v = i + "|" + JSON.stringify(_);
    return b[v] || (b[v] = new Intl.DateTimeFormat(i, _)), b[v];
  }
  const m = /^(short|medium|long)(\s+datetime)?$/, p = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function s(i) {
    return !i || i === "" ? { dateStyle: "medium" } : i.match(m) ? p[i] : null;
  }
  function u(i, _, v) {
    const E = i.getDate(), w = i.getMonth(), A = i.getFullYear(), L = i.getHours(), q = i.getMinutes();
    let x, I;
    const k = qt(v), O = (v || "").toLowerCase().split("-")[0], j = g(v, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0], U = k && j !== O;
    U && k.monthsLong ? x = k.monthsLong[w] : x = g(v, { month: "long" }).format(i), U && k.monthsShort ? I = k.monthsShort[w] : I = g(v, { month: "short" }).format(i);
    const K = {
      yyyy: String(A),
      yy: String(A).slice(-2),
      MMMM: x,
      MMM: I,
      MM: String(w + 1).padStart(2, "0"),
      M: String(w + 1),
      dd: String(E).padStart(2, "0"),
      d: String(E),
      HH: String(L).padStart(2, "0"),
      mm: String(q).padStart(2, "0")
    };
    return _.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(z) {
      return K[z];
    });
  }
  function r(i, _, v) {
    const E = s(_);
    if (E) {
      const w = g(v, E), A = (v || "").toLowerCase().split("-")[0], L = w.resolvedOptions().locale.toLowerCase().split("-")[0];
      return qt(v) && L !== A ? u(i, "dd.MM.yyyy", v) : w.format(i);
    }
    return u(i, _, v);
  }
  function l(i) {
    if (!i) return "";
    const _ = i.getFullYear(), v = String(i.getMonth() + 1).padStart(2, "0"), E = String(i.getDate()).padStart(2, "0");
    return _ + "-" + v + "-" + E;
  }
  function h(i, _, v) {
    C(i.dom, "ln-date:change", {
      value: _,
      formatted: i.dom.value,
      date: v
    }), i.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function c(i, _, v, E) {
    i._setHiddenRaw(_), y.set.call(i._picker, _), i._lastISO = _, E !== void 0 ? (i._isFormatting = !0, i.dom.value = E, i._isFormatting = !1) : v && i._displayFormatted(v), h(i, _, v);
  }
  function f(i) {
    i._setHiddenRaw(""), y.set.call(i._picker, ""), i._isFormatting = !0, i.dom.value = "", i._isFormatting = !1, i._lastISO = "", h(i, "", null);
  }
  n.prototype._initTextElement = function() {
    const i = this.dom;
    let _ = i.getAttribute("data-ln-value"), v = i.getAttribute("data-ln-date"), E = i.getAttribute("datetime"), w = null;
    _ !== null && _ !== "" ? w = _ : E !== null && E !== "" ? w = E : v !== null && v !== "" && v !== "true" && !m.test(v) ? w = v : w = i.textContent.trim();
    let A = o(w) || t(w);
    if (!A && w)
      if (isNaN(w))
        A = new Date(w);
      else {
        const L = Number(w);
        A = new Date(L > 1e11 ? L : L * 1e3);
      }
    if (A && !isNaN(A.getTime())) {
      const L = l(A);
      this._rawValue = L, i.hasAttribute("data-ln-value") || i.setAttribute("data-ln-value", L), this._formatTextContent();
    } else
      this._rawValue = null;
  }, n.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const i = o(this._rawValue);
      if (i) {
        let v = this.dom.getAttribute("data-ln-date-format");
        if (!v) {
          const w = this.dom.getAttribute("data-ln-date");
          w && m.test(w) && (v = w);
        }
        const E = $(this.dom);
        this.dom.textContent = r(i, v || "medium", E);
      }
    }
  };
  function n(i) {
    if (i[a]) return i[a];
    if (i[a] = this, this.dom = i, i.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const _ = this, v = i.value, E = i.name, A = (i.closest(".form-element, form") || i.parentNode).querySelectorAll("[data-ln-date-dict]");
    for (let k = 0; k < A.length; k++) {
      const O = A[k].getAttribute("data-ln-date-dict");
      if (O) {
        const N = Xt(A[k], "data-ln-date-dict-key");
        N["months-long"] && (N.monthsLong = N["months-long"].split(",").map((j) => j.trim())), N["months-short"] && (N.monthsShort = N["months-short"].split(",").map((j) => j.trim())), Jt(O, N);
      }
    }
    const L = document.createElement("span");
    L.setAttribute("data-ln-date-field", ""), i.parentNode.insertBefore(L, i), L.appendChild(i), this._wrapper = L;
    const q = document.createElement("input");
    q.type = "hidden", q.name = E, i.removeAttribute("name"), i.hasAttribute("data-ln-fill-as") && q.setAttribute("data-ln-fill-as", i.getAttribute("data-ln-fill-as")), i.insertAdjacentElement("afterend", q), this._hidden = q;
    const x = document.createElement("input");
    x.type = "date", x.tabIndex = -1, x.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", q.insertAdjacentElement("afterend", x), this._picker = x, i.type = "text";
    const I = document.createElement("button");
    if (I.type = "button", I.setAttribute("aria-label", i.getAttribute("data-ln-date-label") || "Open date picker"), I.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', x.insertAdjacentElement("afterend", I), this._btn = I, this._lastISO = "", Object.defineProperty(q, "value", {
      get: function() {
        return y.get.call(q);
      },
      set: function(k) {
        if (y.set.call(q, k), k && k !== "") {
          const O = o(k);
          O && c(_, k, O);
        } else k === "" && f(_);
      }
    }), pe(i, y, {
      get: function() {
        return y.get.call(i);
      },
      set: function(k, O) {
        if (_._isFormatting) {
          O(k);
          return;
        }
        if (!k || k === "") {
          O(""), f(_);
          return;
        }
        const N = o(k) || t(k);
        if (N) {
          const j = l(N), U = i.getAttribute(d) || "", K = $(i), z = r(N, U, K);
          O(z), c(_, j, N, z);
        } else
          O(String(k)), f(_);
      }
    }), this._onPickerChange = function() {
      const k = x.value;
      if (k) {
        const O = o(k);
        O && c(_, k, O);
      } else
        f(_);
    }, x.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const k = _.dom.value.trim();
      if (k === "") {
        _._lastISO !== "" && f(_);
        return;
      }
      if (_._lastISO) {
        const N = o(_._lastISO);
        if (N) {
          const j = _.dom.getAttribute(d) || "", U = $(_.dom);
          if (k === r(N, j, U)) return;
        }
      }
      const O = t(k);
      if (O) {
        const N = l(O);
        c(_, N, O);
      } else if (_._lastISO) {
        const N = o(_._lastISO);
        N && _._displayFormatted(N);
      } else
        _.dom.value = "";
    }, i.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      _._openPicker();
    }, I.addEventListener("click", this._onBtnClick), v && v !== "") {
      const k = o(v);
      k && c(_, v, k);
    }
    return this;
  }
  function o(i) {
    if (!i || typeof i != "string") return null;
    const _ = i.split("T"), v = _[0].split("-");
    if (v.length < 3) return null;
    const E = parseInt(v[0], 10), w = parseInt(v[1], 10) - 1, A = parseInt(v[2], 10);
    if (isNaN(E) || isNaN(w) || isNaN(A)) return null;
    let L = 0, q = 0;
    if (_[1]) {
      const I = _[1].split(":");
      L = parseInt(I[0], 10) || 0, q = parseInt(I[1], 10) || 0;
    }
    const x = new Date(E, w, A, L, q);
    return x.getFullYear() !== E || x.getMonth() !== w || x.getDate() !== A ? null : x;
  }
  function t(i) {
    if (!i || typeof i != "string" || (i = i.trim(), i.length < 6)) return null;
    let _, v;
    if (i.indexOf(".") !== -1)
      _ = ".", v = i.split(".");
    else if (i.indexOf("/") !== -1)
      _ = "/", v = i.split("/");
    else if (i.indexOf("-") !== -1)
      _ = "-", v = i.split("-");
    else
      return null;
    if (v.length !== 3) return null;
    const E = [];
    for (let x = 0; x < 3; x++) {
      const I = parseInt(v[x], 10);
      if (isNaN(I)) return null;
      E.push(I);
    }
    let w, A, L;
    _ === "." ? (w = E[0], A = E[1], L = E[2]) : _ === "/" ? (A = E[0], w = E[1], L = E[2]) : v[0].length === 4 ? (L = E[0], A = E[1], w = E[2]) : (w = E[0], A = E[1], L = E[2]), L < 100 && (L += L < 50 ? 2e3 : 1900);
    const q = new Date(L, A - 1, w);
    return q.getFullYear() !== L || q.getMonth() !== A - 1 || q.getDate() !== w ? null : q;
  }
  n.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, n.prototype._setHiddenRaw = function(i) {
    y.set.call(this._hidden, i);
  }, n.prototype._displayFormatted = function(i) {
    const _ = this.dom.getAttribute(d) || "", v = $(this.dom);
    this._isFormatting = !0, this.dom.value = r(i, _, v), this._isFormatting = !1;
  }, Object.defineProperty(n.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : y.get.call(this._hidden);
    },
    set: function(i) {
      if (this.isTextElement) {
        if (!i || i === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const v = o(i) || t(i);
        if (!v) return;
        const E = l(v);
        this._rawValue = E, this.dom.setAttribute("data-ln-value", E), this._formatTextContent();
        return;
      }
      if (!i || i === "") {
        f(this);
        return;
      }
      const _ = o(i);
      _ && c(this, i, _);
    }
  }), Object.defineProperty(n.prototype, "date", {
    get: function() {
      const i = this.value;
      return i ? o(i) : null;
    },
    set: function(i) {
      if (!i || !(i instanceof Date) || isNaN(i.getTime())) {
        this.value = "";
        return;
      }
      this.value = l(i);
    }
  }), Object.defineProperty(n.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), n.prototype.destroy = function() {
    if (!this.dom[a]) return;
    if (this.isTextElement) {
      C(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[a];
      return;
    }
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const i = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", i && (this.dom.value = i), C(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[a];
  };
  function e() {
    new MutationObserver(function() {
      const i = document.querySelectorAll("[" + d + "]");
      for (let _ = 0; _ < i.length; _++) {
        const v = i[_][a];
        if (v) {
          if (v.isTextElement)
            v._formatTextContent();
          else if (v.value) {
            const E = o(v.value);
            E && v._displayFormatted(E);
          }
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  H(d, a, n, "ln-date", {
    extraAttributes: ["data-ln-date-format", "data-ln-date-locale", "data-ln-value", "datetime", "lang"],
    onAttributeChange: function(i) {
      const _ = i[a];
      if (_) {
        if (_.isTextElement)
          _._initTextElement();
        else if (_.value) {
          const v = o(_.value);
          v && _._displayFormatted(v);
        }
      }
    }
  }), e();
})();
(function() {
  const d = "data-ln-nav", a = "lnNav";
  if (window[a] !== void 0) return;
  const b = [];
  if (!history._lnNavPatched) {
    const p = history.pushState;
    history.pushState = function() {
      p.apply(history, arguments);
      for (const s of b)
        s();
    }, history._lnNavPatched = !0;
  }
  function y(p) {
    return this.dom = p, this.activeClass = p.getAttribute(d) || "active", this.exact = p.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), b.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(p, { childList: !0, subtree: !0 }), this.update(), this;
  }
  y.prototype.update = function() {
    if (!this.activeClass || J(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const s = Array.from(this.dom.querySelectorAll("a")), u = window.location.pathname, r = g(u);
    for (const l of s) {
      const h = l.getAttribute("href");
      if (!h || h === "#" || h.startsWith("#") || h.startsWith("javascript:") || h.startsWith("mailto:") || h.startsWith("tel:")) {
        l.classList.remove(this.activeClass), l.removeAttribute("aria-current");
        continue;
      }
      if (l.hostname && l.hostname !== window.location.hostname) {
        l.classList.remove(this.activeClass), l.removeAttribute("aria-current");
        continue;
      }
      const c = g(h), f = c === r, n = !this.exact && c !== "/" && r.startsWith(c + "/");
      f || n ? (l.classList.add(this.activeClass), l.setAttribute("aria-current", "page")) : (l.classList.remove(this.activeClass), l.removeAttribute("aria-current"));
    }
    C(this.dom, "ln-nav:update", { target: this.dom });
  }, y.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const p = b.indexOf(this.updateHandler);
    p !== -1 && b.splice(p, 1), C(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[a];
  };
  function g(p) {
    try {
      return new URL(p, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return p.replace(/\/$/, "") || "/";
    }
  }
  function m(p, s) {
    const u = p[a];
    if (u) {
      if (s === d) {
        if (!p.hasAttribute(d)) {
          u.destroy();
          return;
        }
        const r = u.activeClass, l = p.getAttribute(d) || "active";
        if (r !== l) {
          const h = p.querySelectorAll("a");
          for (const c of h)
            r && c.classList.remove(r);
          u.activeClass = l;
        }
      } else s === "data-ln-nav-exact" && (u.exact = p.hasAttribute("data-ln-nav-exact"));
      u.update();
    }
  }
  H(d, a, y, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: m
  });
})();
(function() {
  const d = "data-ln-tabs", a = "lnTabs";
  if (window[a] !== void 0 && window[a] !== null) return;
  function b(m, p) {
    const s = (m.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (s) return s;
    if (m.tagName !== "A") return "";
    const u = m.getAttribute("href") || "";
    if (!u.startsWith("#")) return "";
    const r = u.slice(1);
    if (!r) return "";
    const l = r.split("&");
    if (p)
      for (const f of l) {
        const n = f.indexOf(":");
        if (n > 0 && f.slice(0, n).toLowerCase().trim() === p)
          return f.slice(n + 1).toLowerCase().trim();
      }
    const h = l[l.length - 1] || "", c = h.indexOf(":");
    return (c > 0 ? h.slice(c + 1) : h).toLowerCase().trim();
  }
  function y(m) {
    return this.dom = m, g.call(this), this;
  }
  function g() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const m = this.tabs.filter((u) => u.tagName === "A" && (u.getAttribute("href") || "").startsWith("#")), p = m.length > 0 && m.length === this.tabs.length;
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = p && !!this.nsKey, m.length > 0 && m.length !== this.tabs.length ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : p && !this.nsKey && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const u of this.tabs) {
      const r = b(u, this.nsKey);
      r ? this.mapTabs[r] = u : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', u);
    }
    for (const u of this.panels) {
      const r = (u.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      r && (this.mapPanels[r] = u);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const s = this;
    this._clickHandlers = [];
    for (const u of this.tabs) {
      if (u[a + "Trigger"]) continue;
      const r = function(l) {
        const h = u.tagName === "A";
        if (!h && (l.ctrlKey || l.metaKey || l.button === 1)) return;
        const c = b(u, s.nsKey);
        c && (h && !te(l) || (s.hashEnabled ? _t(s.nsKey) === c ? s.dom.setAttribute("data-ln-tabs-active", c) : lt(s.nsKey, c) : s.dom.setAttribute("data-ln-tabs-active", c)));
      };
      u.addEventListener("click", r), u[a + "Trigger"] = r, s._clickHandlers.push({ el: u, handler: r });
    }
    if (this._onRequestSelect = function(u) {
      const r = u.detail && (u.detail.key || u.detail.tab);
      r && s.dom.setAttribute("data-ln-tabs-active", (r + "").toLowerCase().trim());
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this.dom.addEventListener("ln-tabs:request-activate", this._onRequestSelect), this._hashHandler = function() {
      if (!s.hashEnabled) return;
      const u = _t(s.nsKey);
      s.dom.setAttribute("data-ln-tabs-active", u !== null ? u : s.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let u = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const r = Bt("tabs", this.dom);
        r !== null && r in this.mapPanels && (u = r);
      }
      this.dom.setAttribute("data-ln-tabs-active", u);
    }
  }
  y.prototype._applyActive = function(m) {
    var p;
    (!m || !(m in this.mapPanels)) && (m = this.defaultKey);
    for (const s in this.mapTabs) {
      const u = this.mapTabs[s];
      s === m ? (u.setAttribute("data-active", ""), u.setAttribute("aria-selected", "true")) : (u.removeAttribute("data-active"), u.setAttribute("aria-selected", "false"));
    }
    for (const s in this.mapPanels) {
      const u = this.mapPanels[s], r = s === m;
      u.classList.toggle("hidden", !r), u.setAttribute("aria-hidden", r ? "false" : "true");
    }
    if (this.autoFocus) {
      const s = (p = this.mapPanels[m]) == null ? void 0 : p.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      s && setTimeout(() => s.focus({ preventScroll: !0 }), 0);
    }
    C(this.dom, "ln-tabs:change", { key: m, tab: this.mapTabs[m], panel: this.mapPanels[m] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && bt("tabs", this.dom, m);
  }, y.prototype.destroy = function() {
    if (this.dom[a]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect), this.dom.removeEventListener("ln-tabs:request-activate", this._onRequestSelect);
      for (const { el: m, handler: p } of this._clickHandlers)
        m.removeEventListener("click", p), delete m[a + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), C(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[a];
    }
  }, H(d, a, y, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(m) {
      const p = m.getAttribute("data-ln-tabs-active");
      m[a]._applyActive(p);
    }
  });
})();
(function() {
  const d = "data-ln-toggle", a = "lnToggle";
  if (window[a] !== void 0) return;
  function b(m, p) {
    const s = document.querySelectorAll(
      '[data-ln-toggle-for="' + m.id + '"]'
    );
    for (const u of s)
      u.setAttribute("aria-expanded", p ? "true" : "false");
  }
  function y(m) {
    this.dom = m;
    const p = this;
    if (this._onRequestOpen = function() {
      p.open();
    }, this._onRequestClose = function() {
      p.close();
    }, this._onRequestToggle = function() {
      p.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), m.hasAttribute("data-ln-persist")) {
      const s = Bt("toggle", m);
      s !== null && m.setAttribute(d, s);
    }
    return this.isOpen = m.getAttribute(d) === "open", this.isOpen && m.classList.add("open"), b(m, this.isOpen), this;
  }
  y.prototype.open = function() {
    this.dom.setAttribute(d, "open");
  }, y.prototype.close = function() {
    this.dom.setAttribute(d, "close");
  }, y.prototype.toggle = function() {
    const m = this.dom.getAttribute(d);
    this.dom.setAttribute(d, m === "open" ? "close" : "open");
  }, y.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), C(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function g(m) {
    const p = m[a];
    if (!p) return;
    const u = m.getAttribute(d) === "open";
    if (u !== p.isOpen)
      if (u) {
        if (J(m, "ln-toggle:before-open", { target: m }).defaultPrevented) {
          m.setAttribute(d, "close");
          return;
        }
        p.isOpen = !0, m.classList.add("open"), b(m, !0), C(m, "ln-toggle:open", { target: m }), m.hasAttribute("data-ln-persist") && bt("toggle", m, "open");
      } else {
        if (J(m, "ln-toggle:before-close", { target: m }).defaultPrevented) {
          m.setAttribute(d, "open");
          return;
        }
        p.isOpen = !1, m.classList.remove("open"), b(m, !1), C(m, "ln-toggle:close", { target: m }), m.hasAttribute("data-ln-persist") && bt("toggle", m, "close");
      }
  }
  document.addEventListener("click", function(m) {
    if (m.ctrlKey || m.metaKey || m.button === 1) return;
    const p = m.target.closest("[data-ln-toggle-for]");
    if (p) {
      const s = p.getAttribute("data-ln-toggle-for"), u = document.getElementById(s);
      if (u && u[a]) {
        m.preventDefault();
        const r = p.getAttribute("data-ln-toggle-action") || "toggle";
        if (r === "open")
          u.setAttribute(d, "open");
        else if (r === "close")
          u.setAttribute(d, "close");
        else if (r === "toggle") {
          const l = u.getAttribute(d);
          u.setAttribute(d, l === "open" ? "close" : "open");
        }
      }
    }
  }), H(d, a, y, "ln-toggle", {
    onAttributeChange: g
  });
})();
(function() {
  const d = "data-ln-accordion", a = "lnAccordion";
  if (window[a] !== void 0) return;
  function b(y) {
    return this.dom = y, this._onToggleOpen = function(g) {
      if (g.detail.target.closest("[data-ln-accordion]") !== y) return;
      const m = y.querySelectorAll("[data-ln-toggle]");
      for (const p of m)
        p !== g.detail.target && p.closest("[data-ln-accordion]") === y && p.getAttribute("data-ln-toggle") === "open" && p.setAttribute("data-ln-toggle", "close");
      C(y, "ln-accordion:change", { target: g.detail.target });
    }, y.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  b.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), C(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[a]);
  }, H(d, a, b, "ln-accordion");
})();
(function() {
  const d = "data-ln-dropdown", a = "lnDropdown";
  if (window[a] !== void 0) return;
  function b(y) {
    if (this.dom = y, this.toggleEl = y.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual")), this.triggerBtn = y.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const m of this.toggleEl.children)
        m.setAttribute("role", "menuitem");
    const g = this;
    return this._onRequestOpen = function() {
      g.toggleEl && g.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      g.toggleEl && g.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (g.toggleEl) {
        const m = g.toggleEl.getAttribute("data-ln-toggle");
        g.toggleEl.setAttribute("data-ln-toggle", m === "open" ? "close" : "open");
      }
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this._onToggleOpen = function(m) {
      !m.detail || m.detail.target !== g.toggleEl || (g.triggerBtn && g.triggerBtn.setAttribute("aria-expanded", "true"), typeof g.toggleEl.showPopover == "function" && g.toggleEl.showPopover(), g._reposition(), g._addOutsideClickListener(), g._addScrollRepositionListener(), g._addResizeCloseListener(), C(y, "ln-dropdown:open", { target: m.detail.target }));
    }, this._onToggleClose = function(m) {
      !m.detail || m.detail.target !== g.toggleEl || (g.triggerBtn && g.triggerBtn.setAttribute("aria-expanded", "false"), g._removeOutsideClickListener(), g._removeScrollRepositionListener(), g._removeResizeCloseListener(), g.toggleEl.style.top = "", g.toggleEl.style.left = "", typeof g.toggleEl.hidePopover == "function" && g.toggleEl.matches(":popover-open") && g.toggleEl.hidePopover(), C(y, "ln-dropdown:close", { target: m.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  b.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const y = this.triggerBtn.getBoundingClientRect(), g = Wt(this.toggleEl), m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, p = Ft(y, g, "bottom-end", m);
    this.toggleEl.style.top = p.top + "px", this.toggleEl.style.left = p.left + "px";
  }, b.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const y = this;
    this._boundDocClick = function(g) {
      y.dom.contains(g.target) || y.toggleEl && y.toggleEl.contains(g.target) || y.toggleEl && y.toggleEl.getAttribute("data-ln-toggle") === "open" && y.toggleEl.setAttribute("data-ln-toggle", "close");
    }, y._docClickTimeout = setTimeout(function() {
      y._docClickTimeout = null, document.addEventListener("click", y._boundDocClick);
    }, 0);
  }, b.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, b.prototype._addScrollRepositionListener = function() {
    const y = this;
    this._boundScrollReposition = function() {
      y._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, b.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, b.prototype._addResizeCloseListener = function() {
    const y = this;
    this._boundResizeClose = function() {
      y.toggleEl && y.toggleEl.getAttribute("data-ln-toggle") === "open" && y.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, b.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, b.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), C(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[a]);
  }, H(d, a, b, "ln-dropdown");
})();
(function() {
  const d = "data-ln-popover", a = "lnPopover", b = "data-ln-popover-for", y = "data-ln-popover-position";
  if (window[a] !== void 0) return;
  const g = [];
  let m = null;
  function p() {
    m || (m = function(l) {
      if (l.key !== "Escape" || g.length === 0) return;
      g[g.length - 1].close();
    }, document.addEventListener("keydown", m));
  }
  function s() {
    g.length > 0 || m && (document.removeEventListener("keydown", m), m = null);
  }
  function u(l) {
    this.dom = l, this.isOpen = l.getAttribute(d) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const h = this;
    return this._onRequestOpen = function(c) {
      const f = c.detail && c.detail.trigger ? c.detail.trigger : null;
      h.open(f);
    }, this._onRequestClose = function() {
      h.close();
    }, this._onRequestToggle = function(c) {
      const f = c.detail && c.detail.trigger ? c.detail.trigger : null;
      h.toggle(f);
    }, l.addEventListener("ln-popover:request-open", this._onRequestOpen), l.addEventListener("ln-popover:request-close", this._onRequestClose), l.addEventListener("ln-popover:request-toggle", this._onRequestToggle), l.hasAttribute("tabindex") || l.setAttribute("tabindex", "-1"), l.hasAttribute("role") || l.setAttribute("role", "dialog"), l.hasAttribute("popover") || l.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  u.prototype.open = function(l) {
    this.isOpen || (this.trigger = l || null, this.dom.setAttribute(d, "open"));
  }, u.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(d, "closed");
  }, u.prototype.toggle = function(l) {
    this.isOpen ? this.close() : this.open(l);
  }, u.prototype._applyOpen = function(l) {
    this.isOpen = !0, l && (this.trigger = l), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const h = Wt(this.dom);
    if (this.trigger) {
      const o = this.trigger.getBoundingClientRect(), t = this.dom.getAttribute(y) || "bottom", e = Ft(o, h, t, 8);
      this.dom.style.top = e.top + "px", this.dom.style.left = e.left + "px", this.dom.setAttribute("data-ln-popover-placement", e.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const c = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), f = Array.prototype.find.call(c, Dt);
    f ? f.focus() : this.dom.focus();
    const n = this;
    this._boundDocClick = function(o) {
      n.dom.contains(o.target) || n.trigger && n.trigger.contains(o.target) || n.close();
    }, n._docClickTimeout = setTimeout(function() {
      n._docClickTimeout = null, document.addEventListener("click", n._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!n.trigger) return;
      const o = n.trigger.getBoundingClientRect(), t = Wt(n.dom), e = n.dom.getAttribute(y) || "bottom", i = Ft(o, t, e, 8);
      n.dom.style.top = i.top + "px", n.dom.style.left = i.left + "px", n.dom.setAttribute("data-ln-popover-placement", i.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), g.push(this), p(), C(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, u.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const l = g.indexOf(this);
    l !== -1 && g.splice(l, 1), s(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, C(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, u.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[a], C(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function r(l) {
    this.dom = l;
    const h = l.getAttribute(b);
    return l.setAttribute("aria-haspopup", "dialog"), l.setAttribute("aria-expanded", "false"), l.setAttribute("aria-controls", h), this._onClick = function(c) {
      if (c.ctrlKey || c.metaKey || c.button === 1) return;
      c.preventDefault();
      const f = document.getElementById(h);
      if (!f) return;
      f[a] && (f[a].trigger = l);
      const n = f.getAttribute(d);
      f.setAttribute(d, n === "open" ? "closed" : "open");
    }, l.addEventListener("click", this._onClick), this;
  }
  r.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[a + "Trigger"];
  }, H(d, a, u, "ln-popover", {
    onAttributeChange: function(l) {
      const h = l[a];
      if (!h) return;
      const f = l.getAttribute(d) === "open";
      if (f !== h.isOpen)
        if (f) {
          if (J(l, "ln-popover:before-open", {
            popoverId: l.id,
            target: l,
            trigger: h.trigger
          }).defaultPrevented) {
            l.setAttribute(d, "closed");
            return;
          }
          h._applyOpen(h.trigger);
        } else {
          if (J(l, "ln-popover:before-close", {
            popoverId: l.id,
            target: l,
            trigger: h.trigger
          }).defaultPrevented) {
            l.setAttribute(d, "open");
            return;
          }
          h._applyClose();
        }
    }
  }), H(b, a + "Trigger", r, "ln-popover-trigger");
})();
(function() {
  const d = "data-ln-tooltip-enhance", a = "data-ln-tooltip", b = "data-ln-tooltip-position", y = "lnTooltipEnhance", g = "ln-tooltip-portal";
  if (window[y] !== void 0) return;
  let m = 0, p = null, s = null, u = null, r = null, l = null, h = null;
  function c() {
    return p && p.parentNode || (p = document.getElementById(g), p || (p = document.createElement("div"), p.id = g, document.body.appendChild(p)), p.hasAttribute("popover") || p.setAttribute("popover", "manual")), p;
  }
  function f() {
    h || (h = function(i) {
      i.key === "Escape" && t();
    }, document.addEventListener("keydown", h));
  }
  function n() {
    h && (document.removeEventListener("keydown", h), h = null);
  }
  function o(i) {
    if (u === i) return;
    t();
    const _ = i.getAttribute(a) || i.getAttribute("title");
    if (!_) return;
    c(), typeof p.showPopover == "function" && p.showPopover(), i.hasAttribute("title") && (r = i.getAttribute("title"), i.removeAttribute("title"));
    const v = i.getAttribute("aria-describedby");
    v ? l = v : l = null;
    const E = document.createElement("div");
    E.className = "ln-tooltip", E.textContent = _, i[y + "Uid"] || (m += 1, i[y + "Uid"] = "ln-tooltip-" + m), E.id = i[y + "Uid"], p.appendChild(E);
    const w = E.offsetWidth, A = E.offsetHeight, L = i.getBoundingClientRect(), q = i.getAttribute(b) || "top", x = Ft(L, { width: w, height: A }, q, 6);
    E.style.top = x.top + "px", E.style.left = x.left + "px", E.setAttribute("data-ln-tooltip-placement", x.placement), l ? i.setAttribute("aria-describedby", l + " " + E.id) : i.setAttribute("aria-describedby", E.id), s = E, u = i, f();
  }
  function t() {
    if (!s) {
      n();
      return;
    }
    u && (l !== null ? u.setAttribute("aria-describedby", l) : u.removeAttribute("aria-describedby"), l = null, r !== null && u.setAttribute("title", r)), r = null, s.parentNode && s.parentNode.removeChild(s), s = null, u = null, p && typeof p.hidePopover == "function" && p.matches(":popover-open") && p.hidePopover(), n();
  }
  function e(i) {
    return this.dom = i, i.hasAttribute("data-ln-tooltip-enhanced") || (i.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      o(i);
    }, this._onLeave = function() {
      u === i && !i.contains(document.activeElement) && t();
    }, this._onFocus = function() {
      o(i);
    }, this._onBlur = function() {
      u === i && !i.matches(":hover") && t();
    }, i.addEventListener("mouseenter", this._onEnter), i.addEventListener("mouseleave", this._onLeave), i.addEventListener("focus", this._onFocus, !0), i.addEventListener("blur", this._onBlur, !0), this;
  }
  e.prototype.destroy = function() {
    const i = this.dom;
    i.removeEventListener("mouseenter", this._onEnter), i.removeEventListener("mouseleave", this._onLeave), i.removeEventListener("focus", this._onFocus, !0), i.removeEventListener("blur", this._onBlur, !0), u === i && t(), this._addedEnhancedAttr && i.removeAttribute("data-ln-tooltip-enhanced"), delete i[y], delete i[y + "Uid"], C(i, "ln-tooltip:destroyed", { trigger: i });
  }, H(
    "[" + d + "], [data-ln-tooltip-enhanced], [" + a + "][title]",
    y,
    e,
    "ln-tooltip"
  );
})();
(function() {
  const d = "data-ln-toast", a = "lnToast", b = "ln-toast-item";
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function y(o) {
    if (!(!o || !(o instanceof HTMLElement)) && (o.hasAttribute("popover") || o.setAttribute("popover", "manual"), typeof o.showPopover == "function")) {
      if (o.matches(":popover-open"))
        try {
          o.hidePopover();
        } catch {
        }
      try {
        o.showPopover();
      } catch {
      }
    }
  }
  function g(o) {
    if (!o || !(o instanceof HTMLElement)) return;
    if (o.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof o.hidePopover == "function" && o.matches(":popover-open"))
      try {
        o.hidePopover();
      } catch {
      }
  }
  function m(o) {
    if (!o || o.nodeType !== 1) return;
    const t = Array.from(o.querySelectorAll("[" + d + "]"));
    o.hasAttribute && o.hasAttribute(d) && t.push(o);
    for (const e of t)
      e[a] || new p(e);
  }
  function p(o) {
    this.dom = o, o[a] = this, this.timeoutDefault = parseInt(o.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(o.getAttribute("data-ln-toast-max") || "5", 10);
    const t = Array.from(o.querySelectorAll("[data-ln-toast-item]"));
    for (; t.length > this.max; ) o.removeChild(t.shift());
    for (const e of t) c(e, this);
    return t.length > 0 && y(o), this;
  }
  p.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const o of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        l(o);
      g(this.dom), delete this.dom[a];
    }
  };
  function s(o, t) {
    const e = ((o.type || "") + "").trim().toLowerCase(), i = mt(t, b, "ln-toast");
    if (!i)
      return console.warn('[ln-toast] Template "' + b + '" not found'), null;
    st(i, {
      type: e,
      title: o.title,
      message: typeof o.message == "string" ? o.message : void 0
    });
    const _ = i.firstElementChild;
    if (!_) return null;
    _.hasAttribute("data-ln-toast-item") || _.setAttribute("data-ln-toast-item", ""), _.classList.add("ln-enter");
    const v = _.querySelector(".body");
    v && u(v, o);
    const E = _.querySelector("[data-ln-toast-close]");
    return E && E.addEventListener("click", function() {
      l(_);
    }), _;
  }
  function u(o, t) {
    if (Array.isArray(t.message)) {
      const e = document.createElement("ul");
      for (const i of t.message) {
        const _ = document.createElement("li");
        _.textContent = i, e.appendChild(_);
      }
      o.appendChild(e);
    }
    if (t.data && t.data.errors) {
      const e = document.createElement("ul");
      for (const i of Object.values(t.data.errors).flat()) {
        const _ = document.createElement("li");
        _.textContent = i, e.appendChild(_);
      }
      o.appendChild(e);
    }
  }
  function r(o, t) {
    const e = Array.from(o.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; e.length >= o.max && e.length > 0; ) o.dom.removeChild(e.shift());
    o.dom.appendChild(t), y(o.dom), requestAnimationFrame(() => t.classList.remove("ln-enter"));
  }
  function l(o) {
    if (!o || !o.parentNode) return;
    const t = o.parentNode;
    clearTimeout(o._timer), o.classList.remove("ln-enter"), o.classList.add("ln-out"), setTimeout(() => {
      o.parentNode && (o.parentNode.removeChild(o), g(t));
    }, 200);
  }
  function h(o) {
    let t = o && o.container;
    return typeof t == "string" && (t = document.querySelector(t)), t instanceof HTMLElement || (t = document.querySelector("[" + d + "]") || document.getElementById("ln-toast-container")), t || null;
  }
  function c(o, t) {
    if (o._lnToastHydrated) return;
    o._lnToastHydrated = !0;
    const e = o.querySelector("[data-ln-toast-close]");
    e && e.addEventListener("click", function() {
      l(o);
    });
    const i = o.getAttribute("data-ln-toast-timeout"), _ = i !== null ? parseInt(i, 10) : NaN, v = Number.isFinite(_) ? _ : t.timeoutDefault;
    v > 0 && (o._timer = setTimeout(function() {
      l(o);
    }, v));
  }
  function f(o) {
    const t = o.detail || {}, e = h(t);
    if (!e) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const i = e[a] || new p(e), _ = s(t, e);
    if (!_) return;
    const v = Number.isFinite(t.timeout) ? t.timeout : i.timeoutDefault;
    r(i, _), v > 0 && (_._timer = setTimeout(() => l(_), v));
  }
  function n(o) {
    const t = o && o.detail || {};
    if (t.container) {
      const e = h(t);
      if (e)
        for (const i of Array.from(e.querySelectorAll("[data-ln-toast-item]"))) l(i);
    } else {
      const e = document.querySelectorAll("[" + d + "]");
      for (const i of Array.from(e))
        for (const _ of Array.from(i.querySelectorAll("[data-ln-toast-item]"))) l(_);
    }
  }
  ut(function() {
    window.addEventListener("ln-toast:enqueue", f), window.addEventListener("ln-toast:clear", n), window.addEventListener("ln-modal:open", function() {
      const t = document.querySelectorAll("[" + d + "]");
      for (const e of Array.from(t))
        e.querySelectorAll("[data-ln-toast-item]").length > 0 && y(e);
    }), new MutationObserver(function(t) {
      for (const e of t) {
        if (e.type === "attributes") {
          m(e.target);
          continue;
        }
        for (const i of e.addedNodes)
          m(i);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [d] }), m(document.body);
  }, "ln-toast");
})();
(function() {
  const d = "data-ln-upload", a = "lnUpload", b = "data-ln-upload-dict", y = "data-ln-upload-accept", g = "data-ln-upload-context", m = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-icon-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function p() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const n = document.createElement("div");
    n.innerHTML = m;
    const o = n.firstElementChild;
    o && document.body.appendChild(o);
  }
  if (window[a] !== void 0) return;
  function s(n) {
    if (n === 0) return "0 B";
    const o = 1024, t = ["B", "KB", "MB", "GB"], e = Math.floor(Math.log(n) / Math.log(o));
    return parseFloat((n / Math.pow(o, e)).toFixed(1)) + " " + t[e];
  }
  function u(n) {
    return n.split(".").pop().toLowerCase();
  }
  function r(n) {
    return n === "docx" && (n = "doc"), ["pdf", "doc", "epub"].includes(n) ? "ln-icon-custom-file-" + n : "ln-icon-file";
  }
  function l(n, o) {
    if (!o) return !0;
    const t = "." + u(n.name);
    return o.split(",").map(function(i) {
      return i.trim().toLowerCase();
    }).includes(t.toLowerCase());
  }
  function h(n) {
    if (n.lnUploadAPI) return;
    p();
    const o = Xt(n, b), t = n.querySelector(".ln-upload__zone"), e = n.querySelector(".ln-upload__list"), i = n.getAttribute(y) || "";
    if (!t || !e) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", n);
      return;
    }
    let _ = n.querySelector('input[type="file"]');
    _ || (_ = document.createElement("input"), _.type = "file", _.multiple = !0, _.classList.add("hidden"), i && (_.accept = i.split(",").map(function(P) {
      return P = P.trim(), P.startsWith(".") ? P : "." + P;
    }).join(",")), n.appendChild(_));
    const v = n.getAttribute(d) || "/files/upload", E = n.getAttribute(g) || "", w = n.getAttribute("data-ln-upload-delete") || (v.includes("/upload") ? v.replace(/\/upload\/?$/, "/{id}") : v + "/{id}"), A = /* @__PURE__ */ new Map();
    let L = 0;
    function q() {
      const P = document.querySelector('meta[name="csrf-token"]');
      return P ? P.getAttribute("content") : "";
    }
    function x(P) {
      if (!l(P, i)) {
        const T = o["invalid-type"];
        C(n, "ln-upload:invalid", {
          file: P,
          message: T
        }), C(window, "ln-toast:enqueue", {
          type: "error",
          title: o["invalid-title"] || "Invalid File",
          message: T || o["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const W = "file-" + ++L, X = u(P.name), Ct = r(X), ht = mt(n, "ln-upload-item", "ln-upload");
      if (!ht) return;
      const it = ht.firstElementChild;
      if (!it) return;
      it.setAttribute("data-file-id", W), st(it, {
        name: P.name,
        sizeText: "0%",
        iconHref: "#" + Ct,
        removeLabel: o.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const Lt = it.querySelector(".ln-upload__progress-bar"), ft = it.querySelector('[data-ln-upload-action="remove"]');
      ft && (ft.disabled = !0), e.appendChild(it);
      const ct = new FormData();
      ct.append("file", P);
      const kt = /* @__PURE__ */ new Set();
      n.querySelectorAll("input, select, textarea").forEach(function(T) {
        if (T.name && T.name !== "file_ids[]" && T.type !== "file") {
          if ((T.type === "checkbox" || T.type === "radio") && !T.checked)
            return;
          ct.append(T.name, T.value), kt.add(T.name);
        }
      }), !kt.has("context") && E && ct.append("context", E);
      const Z = new XMLHttpRequest();
      Z.upload.addEventListener("progress", function(T) {
        if (T.lengthComputable) {
          const D = Math.round(T.loaded / T.total * 100);
          Lt.style.width = D + "%", st(it, { sizeText: D + "%" });
        }
      }), Z.addEventListener("load", function() {
        if (Z.status >= 200 && Z.status < 300) {
          let T;
          try {
            T = JSON.parse(Z.responseText);
          } catch {
            S("Invalid response");
            return;
          }
          st(it, { sizeText: s(T.size || P.size), uploading: !1 }), ft && (ft.disabled = !1), A.set(W, {
            serverId: T.id,
            name: T.name,
            size: T.size
          }), I(), C(n, "ln-upload:uploaded", {
            localId: W,
            serverId: T.id,
            name: T.name
          });
        } else {
          let T = o["upload-failed"] || "Upload failed";
          try {
            T = JSON.parse(Z.responseText).message || T;
          } catch {
          }
          S(T);
        }
      }), Z.addEventListener("error", function() {
        S(o["network-error"] || "Network error");
      });
      function S(T) {
        Lt && (Lt.style.width = "100%"), st(it, { sizeText: o.error || "Error", uploading: !1, error: !0 }), ft && (ft.disabled = !1), C(n, "ln-upload:error", {
          file: P,
          message: T
        }), C(window, "ln-toast:enqueue", {
          type: "error",
          title: o["error-title"] || "Upload Error",
          message: T || o["upload-failed"] || "Failed to upload file"
        });
      }
      Z.open("POST", v), Z.setRequestHeader("X-CSRF-TOKEN", q()), Z.setRequestHeader("Accept", "application/json"), Z.send(ct);
    }
    function I() {
      for (const P of n.querySelectorAll('input[name="file_ids[]"]'))
        P.remove();
      for (const [, P] of A) {
        const W = document.createElement("input");
        W.type = "hidden", W.name = "file_ids[]", W.value = P.serverId, n.appendChild(W);
      }
    }
    function k(P) {
      const W = A.get(P), X = e.querySelector('[data-file-id="' + P + '"]');
      if (!W || !W.serverId) {
        X && X.remove(), A.delete(P), I();
        return;
      }
      X && st(X, { deleting: !0 });
      const Ct = w.replace("{id}", W.serverId);
      fetch(Ct, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": q(),
          Accept: "application/json"
        }
      }).then(function(ht) {
        ht.status === 200 ? (X && X.remove(), A.delete(P), I(), C(n, "ln-upload:removed", {
          localId: P,
          serverId: W.serverId
        })) : (X && st(X, { deleting: !1 }), C(window, "ln-toast:enqueue", {
          type: "error",
          title: o["delete-title"] || "Error",
          message: o["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(ht) {
        console.warn("[ln-upload] Delete error:", ht), X && st(X, { deleting: !1 }), C(window, "ln-toast:enqueue", {
          type: "error",
          title: o["network-error"] || "Network error",
          message: o["connection-error"] || "Could not connect to server"
        });
      });
    }
    function O(P) {
      for (const W of P)
        x(W);
      _.value = "";
    }
    const N = function() {
      _.click();
    }, j = function() {
      O(this.files);
    }, U = function(P) {
      P.preventDefault(), P.stopPropagation(), t.classList.add("ln-upload__zone--dragover");
    }, K = function(P) {
      P.preventDefault(), P.stopPropagation(), t.classList.add("ln-upload__zone--dragover");
    }, z = function(P) {
      P.preventDefault(), P.stopPropagation(), t.classList.remove("ln-upload__zone--dragover");
    }, et = function(P) {
      P.preventDefault(), P.stopPropagation(), t.classList.remove("ln-upload__zone--dragover"), O(P.dataTransfer.files);
    }, St = function(P) {
      const W = P.target.closest('[data-ln-upload-action="remove"]');
      if (!W || !e.contains(W) || W.disabled) return;
      const X = W.closest(".ln-upload__item");
      X && k(X.getAttribute("data-file-id"));
    };
    t.addEventListener("click", N), _.addEventListener("change", j), t.addEventListener("dragenter", U), t.addEventListener("dragover", K), t.addEventListener("dragleave", z), t.addEventListener("drop", et), e.addEventListener("click", St), n.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(A.values()).map(function(P) {
          return P.serverId;
        });
      },
      getFiles: function() {
        return Array.from(A.values());
      },
      clear: function() {
        for (const [, P] of A)
          if (P.serverId) {
            const W = w.replace("{id}", P.serverId);
            fetch(W, {
              method: "DELETE",
              headers: {
                "X-CSRF-TOKEN": q(),
                Accept: "application/json"
              }
            });
          }
        A.clear(), e.innerHTML = "", I(), C(n, "ln-upload:cleared", {});
      },
      destroy: function() {
        t.removeEventListener("click", N), _.removeEventListener("change", j), t.removeEventListener("dragenter", U), t.removeEventListener("dragover", K), t.removeEventListener("dragleave", z), t.removeEventListener("drop", et), e.removeEventListener("click", St), A.clear(), e.innerHTML = "", I(), delete n.lnUploadAPI;
      }
    };
  }
  function c() {
    for (const n of document.querySelectorAll("[" + d + "]"))
      h(n);
  }
  function f() {
    ut(function() {
      new MutationObserver(function(o) {
        for (const t of o)
          if (t.type === "childList") {
            for (const e of t.addedNodes)
              if (e.nodeType === 1) {
                e.hasAttribute(d) && h(e);
                for (const i of e.querySelectorAll("[" + d + "]"))
                  h(i);
              }
          } else t.type === "attributes" && t.target.hasAttribute(d) && h(t.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-upload");
  }
  window[a] = {
    init: h,
    initAll: c
  }, f(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", c) : c();
})();
(function() {
  const d = "lnExternalLinks";
  if (window[d] !== void 0) return;
  function a(s) {
    return s.hostname && s.hostname !== window.location.hostname;
  }
  function b(s) {
    if (s.getAttribute("data-ln-external-link") === "processed" || !a(s)) return;
    s.target = "_blank";
    const u = (s.rel || "").split(/\s+/).filter(Boolean);
    u.includes("noopener") || u.push("noopener"), u.includes("noreferrer") || u.push("noreferrer"), s.rel = u.join(" ");
    const r = document.createElement("span");
    r.className = "sr-only", r.textContent = "(opens in new tab)", s.appendChild(r), s.setAttribute("data-ln-external-link", "processed"), C(s, "ln-external-links:processed", {
      link: s,
      href: s.href
    });
  }
  function y(s) {
    s = s || document.body;
    for (const u of s.querySelectorAll("a, area"))
      b(u);
  }
  function g() {
    ut(function() {
      document.body.addEventListener("click", function(s) {
        const u = s.target.closest("a, area");
        u && u.getAttribute("data-ln-external-link") === "processed" && C(u, "ln-external-links:clicked", {
          link: u,
          href: u.href,
          text: u.textContent || u.title || ""
        });
      });
    }, "ln-external-links");
  }
  function m() {
    ut(function() {
      new MutationObserver(function(u) {
        for (const r of u) {
          if (r.type === "childList") {
            for (const l of r.addedNodes)
              if (l.nodeType === 1 && (l.matches && (l.matches("a") || l.matches("area")) && b(l), l.querySelectorAll))
                for (const h of l.querySelectorAll("a, area"))
                  b(h);
          }
          if (r.type === "attributes" && r.attributeName === "href") {
            const l = r.target;
            l.matches && (l.matches("a") || l.matches("area")) && b(l);
          }
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["href"]
      });
    }, "ln-external-links");
  }
  function p() {
    g(), m(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      y();
    }) : y();
  }
  window[d] = {
    process: y
  }, p();
})();
(function() {
  const d = "data-ln-link", a = "lnLink";
  if (window[a] !== void 0) return;
  let b = null;
  function y() {
    b = document.createElement("div"), b.className = "ln-link-status", document.body.appendChild(b);
  }
  function g(e) {
    b && (b.textContent = e, b.classList.add("ln-link-status--visible"));
  }
  function m() {
    b && b.classList.remove("ln-link-status--visible");
  }
  function p(e, i) {
    if (i.target.closest("a, button, input, select, textarea")) return;
    const _ = e.querySelector("a");
    if (!_) return;
    const v = _.getAttribute("href");
    if (!v) return;
    if (i.ctrlKey || i.metaKey || i.button === 1) {
      window.open(v, "_blank");
      return;
    }
    J(e, "ln-link:navigate", { target: e, href: v, link: _ }).defaultPrevented || _.click();
  }
  function s(e) {
    const i = e.querySelector("a");
    if (!i) return;
    const _ = i.getAttribute("href");
    _ && g(_);
  }
  function u() {
    m();
  }
  function r(e) {
    e[a + "Row"] || !e.querySelector("a") || (e[a + "Row"] = !0, e._lnLinkClick = function(_) {
      p(e, _);
    }, e._lnLinkEnter = function() {
      s(e);
    }, e.addEventListener("click", e._lnLinkClick), e.addEventListener("mouseenter", e._lnLinkEnter), e.addEventListener("mouseleave", u));
  }
  function l(e) {
    e[a + "Row"] && (e._lnLinkClick && e.removeEventListener("click", e._lnLinkClick), e._lnLinkEnter && e.removeEventListener("mouseenter", e._lnLinkEnter), e.removeEventListener("mouseleave", u), delete e._lnLinkClick, delete e._lnLinkEnter, delete e[a + "Row"]);
  }
  function h(e) {
    if (!e[a + "Init"]) return;
    const i = e.tagName;
    if (i === "TABLE" || i === "TBODY") {
      const _ = i === "TABLE" && e.querySelector("tbody") || e;
      for (const v of _.querySelectorAll("tr"))
        l(v);
    } else
      l(e);
    delete e[a + "Init"];
  }
  function c(e) {
    if (e[a + "Init"]) return;
    e[a + "Init"] = !0;
    const i = e.tagName;
    if (i === "TABLE" || i === "TBODY") {
      const _ = i === "TABLE" && e.querySelector("tbody") || e;
      for (const v of _.querySelectorAll("tr"))
        r(v);
    } else
      r(e);
  }
  function f(e) {
    e.hasAttribute && e.hasAttribute(d) && c(e);
    const i = e.querySelectorAll ? e.querySelectorAll("[" + d + "]") : [];
    for (const _ of i)
      c(_);
  }
  function n() {
    ut(function() {
      new MutationObserver(function(i) {
        for (const _ of i)
          if (_.type === "childList") {
            for (const v of _.addedNodes)
              if (v.nodeType === 1) {
                f(v);
                const E = v.closest("[" + d + "]");
                if (E)
                  if (v.tagName === "TR")
                    r(v);
                  else {
                    const w = E.tagName;
                    if (w === "TABLE" || w === "TBODY") {
                      const A = v.querySelectorAll ? v.querySelectorAll("tr") : [];
                      for (const L of A)
                        r(L);
                    }
                  }
              }
          } else _.type === "attributes" && (_.target.hasAttribute && _.target.hasAttribute(d) ? f(_.target) : h(_.target));
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-link");
  }
  function o(e) {
    f(e);
  }
  window[a] = { init: o, destroy: h };
  function t() {
    y(), n(), o(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t) : t();
})();
(function() {
  const d = "[data-ln-progress]", a = "lnProgress";
  if (window[a] !== void 0) return;
  function b(p) {
    return this.dom = p, this._attrObserver = null, this._parentObserver = null, m.call(this), y.call(this), g.call(this), this;
  }
  b.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[a]);
  };
  function y() {
    const p = this, s = new MutationObserver(function(u) {
      for (const r of u)
        (r.attributeName === "data-ln-progress" || r.attributeName === "data-ln-progress-max") && m.call(p);
    });
    s.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = s;
  }
  function g() {
    const p = this, s = this.dom.parentElement;
    if (!s) return;
    const u = new MutationObserver(function(r) {
      for (const l of r)
        l.attributeName === "data-ln-progress-max" && m.call(p);
    });
    u.observe(s, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = u;
  }
  function m() {
    const p = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, s = this.dom.parentElement, r = (s && s.hasAttribute("data-ln-progress-max") ? parseFloat(s.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let l = r > 0 ? p / r * 100 : 0;
    l < 0 && (l = 0), l > 100 && (l = 100), this.dom.style.width = l + "%";
    const h = Math.max(0, Math.min(p, r));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(r)), this.dom.setAttribute("aria-valuenow", String(h)), C(this.dom, "ln-progress:change", { target: this.dom, value: p, max: r, percentage: l });
  }
  H(
    d,
    a,
    b,
    "ln-progress"
  );
})();
(function() {
  const d = "data-ln-filter", a = "lnFilter", b = "data-ln-filter-key", y = "data-ln-filter-value", g = "data-ln-filter-hide", m = "data-ln-filter-reset", p = "data-ln-filter-col", s = /* @__PURE__ */ new WeakMap();
  if (window[a] !== void 0) return;
  function u(f) {
    return f.hasAttribute(m) || f.getAttribute(y) === "";
  }
  function r(f) {
    let n = f._filterKey;
    const o = [];
    for (let t = 0; t < f.inputs.length; t++) {
      const e = f.inputs[t];
      if (e.checked && !u(e)) {
        const i = e.getAttribute(y);
        i && o.push(i);
      }
    }
    return { key: n, values: o };
  }
  function l(f, n) {
    if (f.length !== n.length) return !0;
    for (let o = 0; o < f.length; o++) if (f[o] !== n[o]) return !0;
    return !1;
  }
  function h(f) {
    const n = f.dom, o = f.colIndex, t = n.querySelector("template");
    if (!t || o === null) return;
    const e = document.getElementById(f.targetId);
    if (!e) return;
    const i = e.tagName === "TABLE" ? e : e.querySelector("table");
    if (!i || e.hasAttribute("data-ln-table")) return;
    const _ = {}, v = [], E = i.tBodies;
    for (let L = 0; L < E.length; L++) {
      const q = E[L].rows;
      for (let x = 0; x < q.length; x++) {
        const I = q[x].cells[o], k = I ? I.textContent.trim() : "";
        k && !_[k] && (_[k] = !0, v.push(k));
      }
    }
    v.sort(function(L, q) {
      return L.localeCompare(q);
    });
    const w = n.querySelector("[" + b + "]"), A = w ? w.getAttribute(b) : n.getAttribute("data-ln-filter-key") || "col" + o;
    for (let L = 0; L < v.length; L++) {
      const q = t.content.cloneNode(!0), x = q.querySelector("input");
      x && (x.setAttribute(b, A), x.setAttribute(y, v[L]), At(q, { text: v[L] }), n.appendChild(q));
    }
  }
  function c(f) {
    this.dom = f, this.targetId = f.getAttribute(d);
    const n = f.getAttribute(p);
    this.colIndex = n !== null ? parseInt(n, 10) : null, h(this), this.inputs = Array.from(f.querySelectorAll("[" + b + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(b) : null, this._lastSnapshot = null;
    const o = this, t = Zt(
      function() {
        o._render();
      },
      function() {
        o._afterRender();
      }
    );
    this._queueRender = t, this._attachHandlers();
    let e = !1;
    if (f.hasAttribute("data-ln-persist")) {
      const i = Bt("filter", f);
      if (i && i.key && Array.isArray(i.values) && i.values.length > 0) {
        for (let _ = 0; _ < this.inputs.length; _++) {
          const v = this.inputs[_];
          u(v) ? v.checked = !1 : v.getAttribute(b) === i.key && i.values.indexOf(v.getAttribute(y)) !== -1 ? v.checked = !0 : v.checked = !1;
        }
        t(), e = !0;
      }
    }
    if (!e) {
      for (let i = 0; i < this.inputs.length; i++)
        if (this.inputs[i].checked && !u(this.inputs[i])) {
          t();
          break;
        }
    }
    return this;
  }
  c.prototype._attachHandlers = function() {
    const f = this;
    this.inputs.forEach(function(n) {
      n[a + "Bound"] || (n[a + "Bound"] = !0, n._lnFilterChange = function() {
        if (u(n)) {
          for (let o = 0; o < f.inputs.length; o++)
            u(f.inputs[o]) || (f.inputs[o].checked = !1);
          n.checked = !0, f._queueRender();
          return;
        }
        if (n.checked) {
          for (let t = 0; t < f.inputs.length; t++)
            u(f.inputs[t]) && (f.inputs[t].checked = !1);
          let o = !1;
          for (let t = 0; t < f.inputs.length; t++)
            if (u(f.inputs[t])) {
              o = !0;
              break;
            }
          if (o) {
            let t = !0;
            for (let e = 0; e < f.inputs.length; e++)
              if (!u(f.inputs[e]) && !f.inputs[e].checked) {
                t = !1;
                break;
              }
            if (t)
              for (let e = 0; e < f.inputs.length; e++)
                u(f.inputs[e]) ? f.inputs[e].checked = !0 : f.inputs[e].checked = !1;
          }
        } else {
          let o = !1;
          for (let t = 0; t < f.inputs.length; t++)
            if (!u(f.inputs[t]) && f.inputs[t].checked) {
              o = !0;
              break;
            }
          if (!o)
            for (let t = 0; t < f.inputs.length; t++)
              u(f.inputs[t]) && (f.inputs[t].checked = !0);
        }
        f._queueRender();
      }, n.addEventListener("change", n._lnFilterChange));
    });
  }, c.prototype._render = function() {
    const f = this, n = r(this), o = n.key === null || n.values.length === 0, t = [];
    for (let e = 0; e < n.values.length; e++)
      t.push(n.values[e].toLowerCase());
    if (f.colIndex !== null)
      f._filterTableRows(n);
    else {
      const e = document.getElementById(f.targetId);
      if (!e) return;
      const i = e.children;
      for (let _ = 0; _ < i.length; _++) {
        const v = i[_];
        if (o) {
          v.removeAttribute(g);
          continue;
        }
        const E = v.getAttribute("data-" + n.key);
        v.removeAttribute(g), E !== null && t.indexOf(E.toLowerCase()) === -1 && v.setAttribute(g, "true");
      }
    }
  }, c.prototype._afterRender = function() {
    const f = r(this), n = this._lastSnapshot;
    if (!n || n.key !== f.key || l(n.values, f.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: f.key,
        values: f.values.slice()
      });
      const t = n && n.values.length > 0, e = f.values.length === 0;
      t && e && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: f.key, values: f.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (f.key && f.values.length > 0 ? bt("filter", this.dom, { key: f.key, values: f.values.slice() }) : bt("filter", this.dom, null));
  }, c.prototype._dispatchOnBoth = function(f, n) {
    C(this.dom, f, n);
    const o = document.getElementById(this.targetId);
    o && o !== this.dom && C(o, f, n);
  }, c.prototype._filterTableRows = function(f) {
    const n = document.getElementById(this.targetId);
    if (!n) return;
    const o = n.tagName === "TABLE" ? n : n.querySelector("table");
    if (!o || n.hasAttribute("data-ln-table")) return;
    const t = f.key || this._filterKey, e = f.values;
    s.has(o) || s.set(o, {});
    const i = s.get(o);
    if (t && e.length > 0) {
      const w = [];
      for (let A = 0; A < e.length; A++)
        w.push(e[A].toLowerCase());
      i[t] = { col: this.colIndex, values: w };
    } else t && delete i[t];
    const _ = Object.keys(i), v = _.length > 0, E = o.tBodies;
    for (let w = 0; w < E.length; w++) {
      const A = E[w].rows;
      for (let L = 0; L < A.length; L++) {
        const q = A[L];
        if (!v) {
          q.removeAttribute(g);
          continue;
        }
        let x = !0;
        for (let I = 0; I < _.length; I++) {
          const k = i[_[I]], O = q.cells[k.col], N = O ? O.textContent.trim().toLowerCase() : "";
          if (k.values.indexOf(N) === -1) {
            x = !1;
            break;
          }
        }
        x ? q.removeAttribute(g) : q.setAttribute(g, "true");
      }
    }
  }, c.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this.colIndex !== null) {
        const f = document.getElementById(this.targetId);
        if (f) {
          const n = f.tagName === "TABLE" ? f : f.querySelector("table");
          if (n && s.has(n)) {
            const o = s.get(n), t = this._filterKey;
            t && o[t] && delete o[t], Object.keys(o).length === 0 && s.delete(n);
          }
        }
      }
      this.inputs.forEach(function(f) {
        f._lnFilterChange && (f.removeEventListener("change", f._lnFilterChange), delete f._lnFilterChange), delete f[a + "Bound"];
      }), delete this.dom[a];
    }
  }, H(d, a, c, "ln-filter");
})();
(function() {
  const d = "data-ln-search", a = "lnSearch", b = "data-ln-search-for", y = "lnSearchControl", g = "data-ln-search-items", m = "data-ln-search-fields", p = "data-ln-search-exclude", s = "data-ln-search-hide";
  if (window[a] !== void 0) return;
  function r(v) {
    return (v || "").trim().toLowerCase();
  }
  function l(v) {
    return v ? v.split(/\s+/).filter(Boolean) : [];
  }
  function h(v) {
    const E = v.tagName;
    return E === "INPUT" || E === "TEXTAREA" ? v : v.querySelector('[name="search"]') || v.querySelector('input[type="search"]') || v.querySelector('input[type="text"]');
  }
  function c(v) {
    const E = v.getAttribute(m);
    if (E === null) return null;
    const w = E.split(",").map(function(A) {
      return A.trim();
    }).filter(Boolean);
    return w.length ? w : null;
  }
  function f(v, E) {
    const w = v.childNodes;
    for (let A = 0; A < w.length; A++) {
      const L = w[A];
      if (L.nodeType === 3) {
        E.push(L.nodeValue);
        continue;
      }
      L.nodeType === 1 && (L.hasAttribute(p) || f(L, E));
    }
  }
  function n(v) {
    const E = [];
    return f(v, E), E.join(" ").replace(/\s+/g, " ").toLowerCase();
  }
  function o(v, E) {
    if (!v.id) return;
    const w = document.querySelectorAll("[" + b + '="' + v.id + '"]');
    for (const A of w) {
      const L = A[y];
      L && clearTimeout(L._debounceTimer);
      const q = h(A);
      q && q.value !== E && (q.value = E);
    }
  }
  function t(v) {
    if (this.dom = v, this.term = v.getAttribute(d) || "", r(this.term)) {
      const E = this;
      Tt(function() {
        o(E.dom, E.term), E._apply();
      });
    }
    return this;
  }
  t.prototype._apply = function() {
    const v = this.dom, E = r(this.term), w = l(E);
    if (J(v, "ln-search:change", {
      term: E,
      tokens: w,
      targetId: v.id,
      fields: c(v)
    }).defaultPrevented) return;
    const L = v.getAttribute(g), q = L ? v.querySelectorAll(L) : v.children;
    for (let x = 0; x < q.length; x++) {
      const I = q[x];
      if (I.removeAttribute(s), I.hasAttribute(p) || w.length === 0) continue;
      const k = n(I);
      for (let O = 0; O < w.length; O++)
        if (k.indexOf(w[O]) === -1) {
          I.setAttribute(s, "true");
          break;
        }
    }
  }, t.prototype.destroy = function() {
    this.dom[a] && delete this.dom[a];
  };
  function e(v) {
    this.dom = v, this.targetId = v.getAttribute(b), this.input = h(v);
    const E = v.getAttribute("data-ln-search-debounce");
    if (this.debounceTime = E !== null ? parseInt(E, 10) : 500, isNaN(this.debounceTime) && (this.debounceTime = 500), this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const w = this;
      Tt(function() {
        const A = document.getElementById(w.targetId);
        A && ((A.getAttribute(d) || "").trim() || w._write(w.input.value));
      });
    }
    return this;
  }
  e.prototype._write = function(v) {
    const E = document.getElementById(this.targetId);
    E && E.setAttribute(d, v);
  }, e.prototype._attachHandler = function() {
    if (!this.input) return;
    const v = this;
    this._onInput = function() {
      clearTimeout(v._debounceTimer), v._debounceTimer = setTimeout(function() {
        v._write(v.input.value);
      }, v.debounceTime);
    }, this.input.addEventListener("input", this._onInput);
  }, e.prototype.destroy = function() {
    this.dom[y] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[y]);
  };
  function i(v) {
    const E = v.getAttribute("data-ln-search-clear-for");
    if (E) {
      const q = document.getElementById(E), x = document.querySelector("[" + b + '="' + E + '"]'), I = x ? h(x) : null;
      return { target: q, input: I };
    }
    const w = v.closest("[" + d + "]");
    if (w) {
      const q = w.id ? document.querySelector("[" + b + '="' + w.id + '"]') : null, x = q ? h(q) : null;
      return { target: w, input: x };
    }
    const A = v.closest("[" + b + "]");
    if (A) {
      const q = A.getAttribute(b), x = q ? document.getElementById(q) : null, I = h(A);
      return { target: x, input: I };
    }
    const L = v.parentElement;
    if (L) {
      const q = L.querySelector("[" + b + "]");
      if (q) {
        const x = q.getAttribute(b), I = x ? document.getElementById(x) : null, k = h(q);
        return { target: I, input: k };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(v) {
    const E = v.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!E) return;
    const w = i(E);
    if (!(!w.target && !w.input)) {
      if (v.preventDefault(), w.input) {
        const L = (w.input.closest("[" + b + "]") || w.input)[y];
        L && clearTimeout(L._debounceTimer), w.input.value = "", w.input.focus();
      }
      w.target && w.target.setAttribute(d, "");
    }
  });
  function _(v) {
    const E = v[a];
    if (!E) return;
    const w = v.getAttribute(d) || "";
    w !== E.term && (E.term = w, o(v, w), E._apply());
  }
  H(d, a, t, "ln-search", {
    onAttributeChange: _
  }), H(b, y, e, "ln-search-control");
})();
(function() {
  const d = "data-ln-sort", a = "lnSort", b = "data-ln-sort-field", y = "data-ln-sort-state", g = "data-ln-sort-dir", m = "data-ln-sort-items";
  if (window[a] !== void 0) return;
  function p(r, l) {
    if (l) {
      const h = r.querySelector('[data-ln-field="' + l + '"]');
      if (h) return Ot(h);
    }
    return Ot(r);
  }
  function s(r) {
    this.dom = r, this.targetId = r.getAttribute(d), this.field = r.getAttribute(b) || null;
    const l = r.closest("th");
    this.column = !this.field && l ? l.cellIndex : null, this.itemsSelector = r.getAttribute(m) || null, this._initialOrder = null;
    const h = document.getElementById(this.targetId);
    h && (this._initialOrder = this.itemsSelector ? Array.from(h.querySelectorAll(this.itemsSelector)) : Array.from(h.children)), this._target = h;
    const c = this;
    if (this._onClick = function(f) {
      const n = f.target.closest("[" + g + "]");
      n && c._apply(n.getAttribute(g));
    }, r.addEventListener("click", this._onClick), this._onTargetChange = function(f) {
      (c.field ? f.detail.field === c.field : f.detail.column === c.column) || (r.setAttribute(y, "none"), r.hasAttribute("data-ln-persist") && bt("sort", r, null));
    }, h && h.addEventListener("ln-sort:change", this._onTargetChange), r.hasAttribute("data-ln-persist")) {
      const f = Bt("sort", r);
      f && f.direction && queueMicrotask(function() {
        c._apply(f.direction, !0);
      });
    }
    return this;
  }
  s.prototype._apply = function(r, l) {
    this.dom.setAttribute(y, r);
    const h = this._target || document.getElementById(this.targetId);
    if (!h) return;
    const c = {
      field: this.field,
      column: this.column,
      direction: r,
      targetId: this.targetId
    };
    !l && this.dom.hasAttribute("data-ln-persist") && bt("sort", this.dom, r === "none" ? null : c), !J(h, "ln-sort:change", c).defaultPrevented && this._defaultSort(h, r);
  }, s.prototype._defaultSort = function(r, l) {
    const h = this.itemsSelector ? Array.from(r.querySelectorAll(this.itemsSelector)) : Array.from(r.children);
    if (!h.length) return;
    const c = h[0].parentNode;
    let f;
    if (l === "none")
      f = (this._initialOrder || h).filter(function(o) {
        return o.parentNode === c;
      });
    else {
      const o = this.field, t = h.map(function(v) {
        return p(v, o);
      }), e = Mt(t), i = typeof Intl < "u" ? new Intl.Collator($(this.dom), { sensitivity: "base" }) : null, _ = l === "desc" ? -1 : 1;
      f = h.slice().sort(function(v, E) {
        return Nt(p(v, o), p(E, o), e, i) * _;
      });
    }
    const n = document.createDocumentFragment();
    for (let o = 0; o < f.length; o++) n.appendChild(f[o]);
    c.appendChild(n);
  }, s.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("click", this._onClick), this._target && this._target.removeEventListener("ln-sort:change", this._onTargetChange), delete this.dom[a]);
  };
  function u(r, l) {
    const h = r[a];
    if (h)
      if (l === b) {
        h.field = r.getAttribute(b) || null;
        const c = r.closest("th");
        h.column = !h.field && c ? c.cellIndex : null;
      } else l === m && (h.itemsSelector = r.getAttribute(m) || null);
  }
  H(d, a, s, "ln-sort", {
    extraAttributes: [b, m],
    onAttributeChange: u
  });
})();
(function() {
  const d = "data-ln-table", a = "lnTable", b = "data-ln-table-empty";
  if (window[a] !== void 0) return;
  const u = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function r(n, o) {
    if (n == null || isNaN(n)) return "";
    try {
      return new Intl.NumberFormat($(o)).format(n);
    } catch {
      return String(n);
    }
  }
  function l(n) {
    let o = n.parentElement;
    for (; o && o !== document.body && o !== document.documentElement; ) {
      const e = getComputedStyle(o).overflowY;
      if (e === "auto" || e === "scroll") return o;
      o = o.parentElement;
    }
    return null;
  }
  function h(n) {
    const o = n._scrollContainer || l(n.dom);
    return {
      container: o,
      top: o ? o.scrollTop : window.scrollY
    };
  }
  function c(n) {
    n.container ? n.container.scrollTop = n.top : window.scrollTo(window.scrollX, n.top);
  }
  function f(n) {
    this.dom = n, this.table = n.querySelector("table"), this.tbody = n.querySelector("[data-ln-table-body]") || n.querySelector("tbody"), this.thead = n.querySelector("thead");
    const o = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = o ? Array.from(o.querySelectorAll("th")) : [], this._totalSpan = n.querySelector("[data-ln-table-total]"), this._filteredSpan = n.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== n ? this._filteredSpan.parentElement : null), this._selectedSpan = n.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== n ? this._selectedSpan.parentElement : null), this.isDataDriven = n.hasAttribute("data-ln-table-source"), this.name = n.getAttribute(d) || "", this.source = n.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const t = this;
    return this._onSetSearch = function(e) {
      const i = (e.detail && e.detail.query != null ? e.detail.query : e.detail && e.detail.term != null ? e.detail.term : "").trim();
      t.isDataDriven ? (t.currentSearch = i, C(n, "ln-table:search", {
        table: t.name,
        query: t.currentSearch
      }), t._requestData()) : (t._searchTerm = i.toLowerCase(), t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter(), C(n, "ln-table:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      }));
    }, n.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(e) {
      e.preventDefault(), t._onSetSearch(e);
    }, n.addEventListener("ln-search:change", this._onSearchChange), this._onSetFilter = function(e) {
      if (!e.detail) return;
      const i = e.detail.key, _ = e.detail.values;
      if (t.isDataDriven)
        !_ || _.length === 0 ? delete t.currentFilters[i] : t.currentFilters[i] = _, t._requestData();
      else {
        if (!_ || _.length === 0)
          delete t._columnFilters[i];
        else {
          const v = [];
          for (let E = 0; E < _.length; E++)
            v.push(_[E].toLowerCase());
          t._columnFilters[i] = v;
        }
        t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), C(n, "ln-table:filter", {
          term: t._searchTerm,
          matched: t._filteredData.length,
          total: t._data.length
        });
      }
    }, n.addEventListener("ln-table:set-filter", this._onSetFilter), this._onRequestClearFilters = function() {
      t.isDataDriven ? (t.currentFilters = {}, t.currentSearch = "", C(n, "ln-table:clear-filters", { table: t.name }), t._requestData()) : (t._searchTerm = "", t._columnFilters = {}, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter(), C(n, "ln-table:filter", {
        term: "",
        matched: t._filteredData.length,
        total: t._data.length
      }));
    }, n.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectable = n.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._windowed = !1, this._cache = null, this.isDataDriven && n.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(e) {
      const i = e.detail || {};
      if (t._windowed) {
        n.classList.remove("ln-table--loading"), t._cache.ingest(i);
        return;
      }
      t._data = i.data || [], t._lastTotal = i.total != null ? i.total : t._data.length, t._lastFiltered = i.filtered != null ? i.filtered : t._data.length, t.totalCount = t._lastTotal, t.visibleCount = t._lastFiltered, t.isLoaded = !0, n.classList.remove("ln-table--loading"), t._vStart = -1, t._vEnd = -1, t._applyFilterAndSort(), t._render(), t._updateFooter(), C(n, "ln-table:rendered", {
        table: t.name,
        total: t.totalCount,
        visible: t.visibleCount
      });
    }, n.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(e) {
      const i = e.detail && e.detail.loading;
      n.classList.toggle("ln-table--loading", !!i), i && (t.isLoaded = !1);
    }, n.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(e) {
      !t._windowed || !t._cache || t._cache.release(e.detail && e.detail.offset);
    }, n.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !t._windowed || !t._cache || t._cache.revalidate();
    }, n.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !t._windowed || !t._cache || t._requestData();
    }, n.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(e) {
      e.preventDefault(), t.currentSort = e.detail.direction === "none" ? null : { field: e.detail.field, direction: e.detail.direction }, t._requestData();
    }, n.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(e) {
      if (e.target.closest("[data-ln-table-row-select]") || e.target.closest("[data-ln-table-row-action]") || e.target.closest("a") || e.target.closest("button") || e.ctrlKey || e.metaKey || e.button === 1) return;
      const i = e.target.closest("[data-ln-table-row]");
      if (!i) return;
      const _ = i.getAttribute("data-ln-table-row-id"), v = i._lnRecord || {};
      C(n, "ln-table:row-click", {
        table: t.name,
        id: _,
        record: v
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(e) {
      const i = e.target.closest("[data-ln-table-row-action]");
      if (!i) return;
      e.stopPropagation();
      const _ = i.closest("[data-ln-table-row]");
      if (!_) return;
      const v = i.getAttribute("data-ln-table-row-action"), E = _.getAttribute("data-ln-table-row-id"), w = _._lnRecord || {};
      C(n, "ln-table:row-action", {
        table: t.name,
        id: E,
        action: v,
        record: w
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._focusedRowIndex = -1, this._onKeydown = function(e) {
      if (!n.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      const i = t.tbody ? Array.from(t.tbody.querySelectorAll("[data-ln-table-row]")) : [];
      if (i.length)
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault(), t._focusedRowIndex = Math.min(t._focusedRowIndex + 1, i.length - 1), t._focusRow(i);
            break;
          case "ArrowUp":
            e.preventDefault(), t._focusedRowIndex = Math.max(t._focusedRowIndex - 1, 0), t._focusRow(i);
            break;
          case "Home":
            e.preventDefault(), t._focusedRowIndex = 0, t._focusRow(i);
            break;
          case "End":
            e.preventDefault(), t._focusedRowIndex = i.length - 1, t._focusRow(i);
            break;
          case "Enter":
            if (t._focusedRowIndex >= 0 && t._focusedRowIndex < i.length) {
              e.preventDefault();
              const _ = i[t._focusedRowIndex];
              C(n, "ln-table:row-click", {
                table: t.name,
                id: _.getAttribute("data-ln-table-row-id"),
                record: _._lnRecord || {}
              });
            }
            break;
          case " ":
            if (t._selectable && t._focusedRowIndex >= 0 && t._focusedRowIndex < i.length) {
              e.preventDefault();
              const _ = i[t._focusedRowIndex].querySelector("[data-ln-table-row-select]");
              _ && (_.checked = !_.checked, _.dispatchEvent(new Event("change", { bubbles: !0 })));
            }
            break;
        }
    }, document.addEventListener("keydown", this._onKeydown), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : C(n, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      t.tbody.rows.length > 0 && (t._emptyTbodyObserver.disconnect(), t._emptyTbodyObserver = null, t._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(e) {
      e.preventDefault();
      const i = e.detail.direction === "none" ? null : e.detail.direction;
      t._sortCol = i === null ? -1 : e.detail.column, t._sortDir = i, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), C(n, "ln-table:sorted", {
        column: e.detail.column,
        direction: e.detail.direction,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, n.addEventListener("ln-sort:change", this._onSort)), this;
  }
  f.prototype._parseRows = function() {
    const n = this.tbody.rows, o = this.ths;
    this._data = [], n.length > 0 && (this._rowHeight = n[0].offsetHeight || 40), this._lockColumnWidths();
    for (let t = 0; t < n.length; t++) {
      const e = n[t], i = [], _ = [], v = [];
      for (let w = 0; w < e.cells.length; w++) {
        const A = e.cells[w], L = A.textContent.trim();
        i[w] = Ot(A), _[w] = L.toLowerCase(), A.querySelector("[data-ln-table-row-action]") || v.push(L.toLowerCase());
      }
      let E = null;
      if (this.isDataDriven) {
        E = {};
        const w = e.getAttribute("data-ln-table-row-id");
        w != null && (E.id = w);
        for (let A = 0; A < o.length; A++) {
          const L = o[A].getAttribute("data-ln-table-col");
          if (L) {
            const q = A;
            if (q < e.cells.length) {
              const x = e.cells[q];
              E[L] = Ot(x);
            }
          }
        }
      }
      this._data.push({
        values: i,
        rawTexts: _,
        html: e.outerHTML,
        searchText: v.join(" "),
        id: this.isDataDriven && E ? E.id : void 0,
        ...E
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), C(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, f.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const n = (this.currentSearch || "").trim().toLowerCase(), o = n ? n.split(/\s+/).filter(Boolean) : [], t = this.currentFilters || {}, e = Object.keys(t).length > 0;
      if (this._filteredData = this._data.filter(function(A) {
        if (o.length > 0 && !o.every(function(q) {
          for (const x in A)
            if (A.hasOwnProperty(x) && typeof A[x] == "string" && x !== "html" && x !== "searchText" && A[x].toLowerCase().indexOf(q) !== -1)
              return !0;
          return !1;
        }))
          return !1;
        if (e)
          for (const L in t) {
            const q = t[L];
            if (q && q.length > 0) {
              const x = A[L], I = x != null ? String(x) : "";
              if (q.indexOf(I) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const i = this.currentSort.field, v = this.currentSort.direction === "desc" ? -1 : 1, E = this._filteredData.map(function(A) {
        return A[i];
      }), w = Mt(E);
      this._filteredData.sort(function(A, L) {
        return Nt(A[i], L[i], w, u) * v;
      });
    } else {
      const n = this._searchTerm, o = n ? n.split(/\s+/).filter(Boolean) : [], t = this._columnFilters, e = Object.keys(t).length > 0, i = this.ths, _ = {};
      if (e)
        for (let L = 0; L < i.length; L++) {
          const q = i[L].getAttribute("data-ln-table-filter-col");
          q && (_[q] = L);
        }
      if (o.length === 0 && !e ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(L) {
        if (o.length > 0 && !o.every(function(x) {
          return L.searchText.indexOf(x) !== -1;
        }))
          return !1;
        if (e)
          for (const q in t) {
            const x = _[q];
            if (x !== void 0 && t[q].indexOf(L.rawTexts[x]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const v = this._sortCol, E = this._sortDir === "desc" ? -1 : 1, w = this._filteredData.map(function(L) {
        return L.values[v];
      }), A = Mt(w);
      this._filteredData.sort(function(L, q) {
        return Nt(L.values[v], q.values[v], A, u) * E;
      });
    }
  }, f.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const n = document.createElement("colgroup");
    this.ths.forEach(function(o) {
      const t = document.createElement("col");
      t.style.width = o.offsetWidth + "px", n.appendChild(t);
    }), this.table.insertBefore(n, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = n;
  }, f.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const n = this._lastTotal, o = this.visibleCount;
        if (n === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || o === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const n = this._filteredData.length;
        n === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : n > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, f.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const n = this._filteredData, o = document.createDocumentFragment();
      for (let e = 0; e < n.length; e++) {
        const i = this._buildRow(n[e]);
        if (!i) break;
        o.appendChild(i);
      }
      const t = h(this);
      this.tbody.textContent = "", this.tbody.appendChild(o), c(t), this._selectable && this._updateSelectAll();
    } else {
      const n = [], o = this._filteredData;
      for (let e = 0; e < o.length; e++) n.push(o[e].html);
      const t = h(this);
      this.tbody.innerHTML = n.join(""), c(t), this._selectable && this._restoreSelection();
    }
  }, f.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const n = this;
    if (!this._rowHeight)
      if (this._windowed) {
        let t = null;
        const e = this._cache.peek();
        e ? t = this._buildRow(e) : t = this._buildPlaceholderRow(), t && (this.tbody.textContent = "", this.tbody.appendChild(t), this._rowHeight = t.offsetHeight || 40, this.tbody.textContent = "");
      } else if (this.isDataDriven) {
        if (this._data.length > 0) {
          const t = this._buildRow(this._data[0]);
          t && (this.tbody.textContent = "", this.tbody.appendChild(t), this._rowHeight = t.offsetHeight || 40, this.tbody.textContent = "");
        }
      } else {
        const t = this.tbody ? this.tbody.rows : [];
        t.length > 0 && (this._rowHeight = t[0].offsetHeight || 40);
      }
    this.isDataDriven ? this._scrollContainer = l(this.dom) : this._scrollContainer = null;
    const o = this._scrollContainer || window;
    this._scrollHandler = function() {
      n._rafId || (n._rafId = requestAnimationFrame(function() {
        n._rafId = null, n._windowed ? n._renderWindowed() : n._renderVirtual();
      }));
    }, o.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, f.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, f.prototype._renderVirtual = function() {
    const n = this._filteredData, o = n.length, t = this._rowHeight;
    if (!t || !o) return;
    const e = this.thead ? this.thead.offsetHeight : 0, i = this._scrollContainer;
    let _, v;
    if (i) {
      const x = this.table.getBoundingClientRect(), I = i.getBoundingClientRect(), k = x.top - I.top + i.scrollTop + e;
      _ = i.scrollTop - k, v = i.clientHeight;
    } else {
      const k = this.table.getBoundingClientRect().top + window.scrollY + e;
      _ = window.scrollY - k, v = window.innerHeight;
    }
    let E = Math.max(0, Math.floor(_ / t) - 15);
    E = Math.min(E, o);
    const w = Math.min(E + Math.ceil(v / t) + 30, o);
    if (E === this._vStart && w === this._vEnd) return;
    this._vStart = E, this._vEnd = w;
    const A = this.ths.length || 1, L = E * t, q = (o - w) * t;
    if (this.isDataDriven) {
      const x = document.createDocumentFragment();
      if (L > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const O = document.createElement("td");
        O.setAttribute("colspan", A), O.style.height = L + "px", k.appendChild(O), x.appendChild(k);
      }
      for (let k = E; k < w; k++) {
        const O = this._buildRow(n[k]);
        O && x.appendChild(O);
      }
      if (q > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const O = document.createElement("td");
        O.setAttribute("colspan", A), O.style.height = q + "px", k.appendChild(O), x.appendChild(k);
      }
      const I = h(this);
      this.tbody.textContent = "", this.tbody.appendChild(x), c(I), this._selectable && this._updateSelectAll();
    } else {
      let x = "";
      L > 0 && (x += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + A + '" style="height:' + L + 'px;padding:0;border:none"></td></tr>');
      for (let k = E; k < w; k++) x += n[k].html;
      q > 0 && (x += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + A + '" style="height:' + q + 'px;padding:0;border:none"></td></tr>');
      const I = h(this);
      this.tbody.innerHTML = x, c(I), this._selectable && this._restoreSelection();
    }
  }, f.prototype._buildPlaceholderRow = function() {
    const n = document.createElement("tr");
    n.className = "ln-table__placeholder", n.setAttribute("aria-hidden", "true");
    const o = document.createElement("td");
    return o.setAttribute("colspan", this.ths.length || 1), o.style.height = this._rowHeight + "px", n.appendChild(o), n;
  }, f.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const n = this._rowHeight;
    if (!n) return;
    const o = this._cache.logicalTotal, t = this.thead ? this.thead.offsetHeight : 0, e = this._scrollContainer;
    let i, _;
    if (e) {
      const I = this.table.getBoundingClientRect(), k = e.getBoundingClientRect(), O = I.top - k.top + e.scrollTop + t;
      i = e.scrollTop - O, _ = e.clientHeight;
    } else {
      const O = this.table.getBoundingClientRect().top + window.scrollY + t;
      i = window.scrollY - O, _ = window.innerHeight;
    }
    let v = Math.max(0, Math.floor(i / n) - 15);
    v = Math.min(v, o);
    const E = Math.min(v + Math.ceil(_ / n) + 30, o), w = this.ths.length || 1, A = v * n, L = (o - E) * n, q = document.createDocumentFragment();
    if (A > 0) {
      const I = document.createElement("tr");
      I.className = "ln-table__spacer", I.setAttribute("aria-hidden", "true");
      const k = document.createElement("td");
      k.setAttribute("colspan", w), k.style.height = A + "px", I.appendChild(k), q.appendChild(I);
    }
    for (let I = v; I < E; I++)
      if (this._cache.has(I)) {
        const k = this._buildRow(this._cache.get(I));
        k && q.appendChild(k);
      } else
        q.appendChild(this._buildPlaceholderRow());
    if (L > 0) {
      const I = document.createElement("tr");
      I.className = "ln-table__spacer", I.setAttribute("aria-hidden", "true");
      const k = document.createElement("td");
      k.setAttribute("colspan", w), k.style.height = L + "px", I.appendChild(k), q.appendChild(I);
    }
    const x = h(this);
    this.tbody.textContent = "", this.tbody.appendChild(q), c(x), this._vStart = v, this._vEnd = E, this._cache.ensure(v, E);
  }, f.prototype._showEmptyState = function() {
    const n = this.ths.length || 1;
    this.tbody.textContent = "";
    let o = null;
    if (this.isDataDriven) {
      const t = this._lastTotal != null ? this._lastTotal : this._data.length, i = this.visibleCount === 0 && t > 0, _ = i ? this.name + "-empty-filtered" : this.name + "-empty";
      if (o = mt(this.dom, _, "ln-table"), !o) {
        const v = this.dom.querySelector("template[data-ln-table-empty]");
        if (v) {
          const E = i ? "search" : "initial", w = v.content.querySelector('[data-ln-table-empty-when="' + E + '"]') || v.content.firstElementChild;
          w && (o = document.importNode(w, !0));
        }
      }
      if (o)
        if (o.tagName === "TR")
          this.tbody.appendChild(o);
        else {
          const v = document.createElement("td");
          v.setAttribute("colspan", String(n)), v.appendChild(o);
          const E = document.createElement("tr");
          E.className = "ln-table__empty", E.appendChild(v), this.tbody.appendChild(E);
        }
    } else {
      const t = this.dom.querySelector("template[" + b + "]"), e = document.createElement("td");
      e.setAttribute("colspan", String(n)), t && e.appendChild(document.importNode(t.content, !0));
      const i = document.createElement("tr");
      i.className = "ln-table__empty", i.appendChild(e), this.tbody.appendChild(i);
    }
    C(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, f.prototype._fillRow = function(n, o) {
    At(n, o);
    const t = n.querySelectorAll("[data-ln-table-cell-attr]");
    for (let e = 0; e < t.length; e++) {
      const i = t[e], _ = i.getAttribute("data-ln-table-cell-attr").split(",");
      for (let v = 0; v < _.length; v++) {
        const E = _[v].trim().split(":");
        if (E.length !== 2) continue;
        const w = E[0].trim(), A = E[1].trim();
        o[w] != null && i.setAttribute(A, o[w]);
      }
    }
  }, f.prototype._buildRow = function(n) {
    const o = mt(this.dom, this.name + "-row", "ln-table");
    if (!o) return null;
    const t = o.querySelector("[data-ln-table-row]") || o.firstElementChild;
    if (!t) return null;
    if (this._fillRow(t, n), t._lnRecord = n, n.id != null && t.setAttribute("data-ln-table-row-id", n.id), this._selectable && n.id != null && this.selectedIds.has(String(n.id))) {
      t.classList.add("ln-row-selected");
      const e = t.querySelector("[data-ln-table-row-select]");
      e && (e.checked = !0);
    }
    return t;
  }, f.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    ue(this, "ln-table:request-data", "table");
  }, f.prototype._enterWindowedMode = function() {
    const n = this, o = this.dom, t = parseInt(o.getAttribute("data-ln-table-window"), 10), e = parseInt(o.getAttribute("data-ln-table-window-page"), 10), i = parseInt(o.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !n._windowed || !n._cache || (n.totalCount = n._cache.grandTotal, n.visibleCount = n._cache.logicalTotal, n._lastTotal = n._cache.grandTotal, n.isLoaded = !0, n._vStart = -1, n._vEnd = -1, n._render(), n._updateFooter(), C(o, "ln-table:rendered", {
        table: n.name,
        total: n.totalCount,
        visible: n.visibleCount
      }));
    }, this._renderBatch = Zt(this._onCacheChange), this._cache = ye({
      windowSize: t > 0 ? t : 1e3,
      pageSize: e > 0 ? e : 200,
      threshold: i >= 0 ? i : 25,
      fetchDebounce: 120,
      requestPage: function(_, v, E) {
        C(o, "ln-table:request-data", {
          table: n.name,
          sort: _.sort,
          filters: _.filters,
          search: _.search,
          offset: v,
          limit: E,
          queryGen: n._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, f.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let n = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(n) && this._totalSpan) {
        const t = this._totalSpan.textContent.replace(/[^\d]/g, "");
        t && (n = parseInt(t, 10));
      }
      const o = n > 0 ? n : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: o,
        filtered: o
      });
    } else
      this.dom.classList.add("ln-table--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, f.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, f.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const n = this.tbody.querySelectorAll("[data-ln-table-row]");
    let o = n.length > 0;
    for (let t = 0; t < n.length; t++) {
      const e = n[t].getAttribute("data-ln-table-row-id");
      if (e != null && !this.selectedIds.has(e)) {
        o = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = o;
  }, f.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const n = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let o = 0; o < n.length; o++) {
      const t = n[o].getAttribute("data-ln-table-row-id"), e = t != null && this.selectedIds.has(t);
      n[o].classList.toggle("ln-row-selected", e);
      const i = n[o].querySelector("[data-ln-table-row-select]");
      i && (i.checked = e);
    }
    this._updateSelectAll();
  }, Object.defineProperty(f.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), f.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const n = this;
    if (this._onSelectionChange = function(o) {
      const t = o.target.closest("[data-ln-table-row-select]");
      if (!t) return;
      const e = t.closest("[data-ln-table-row]");
      if (!e) return;
      const i = e.getAttribute("data-ln-table-row-id");
      i != null && (t.checked ? (n.selectedIds.add(i), e.classList.add("ln-row-selected")) : (n.selectedIds.delete(i), e.classList.remove("ln-row-selected")), n.selectedCount = n.selectedIds.size, n._updateSelectAll(), n._updateFooter(), C(n.dom, "ln-table:select", {
        table: n.name,
        selectedIds: n.selectedIds,
        count: n.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const o = document.createElement("input");
      o.type = "checkbox";
      const t = n.dom.querySelector('[data-ln-table-dict="select-all"]'), e = n.dom.getAttribute("data-ln-table-select-all-label") || (t ? t.textContent.trim() : null) || "Select all";
      o.setAttribute("aria-label", e), this._selectAllCheckbox.appendChild(o), this._selectAllCheckbox = o;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const o = n._selectAllCheckbox.checked, t = n.tbody ? n.tbody.querySelectorAll("[data-ln-table-row]") : [];
      for (let e = 0; e < t.length; e++) {
        const i = t[e].getAttribute("data-ln-table-row-id"), _ = t[e].querySelector("[data-ln-table-row-select]");
        i != null && (o ? (n.selectedIds.add(i), t[e].classList.add("ln-row-selected")) : (n.selectedIds.delete(i), t[e].classList.remove("ln-row-selected")), _ && (_.checked = o));
      }
      n.selectedCount = n.selectedIds.size, C(n.dom, "ln-table:select-all", {
        table: n.name,
        selected: o
      }), C(n.dom, "ln-table:select", {
        table: n.name,
        selectedIds: n.selectedIds,
        count: n.selectedCount
      }), n._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const o = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let t = 0; t < o.length; t++) {
        const e = o[t].querySelector("[data-ln-table-row-select]"), i = o[t].getAttribute("data-ln-table-row-id");
        e && e.checked && i != null && (this.selectedIds.add(i), o[t].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, f.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const n = this.dom.querySelector("[data-ln-table-col-select]");
    if (n) {
      const o = n.querySelector('input[type="checkbox"]');
      o && o.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const o = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let t = 0; t < o.length; t++) {
        o[t].classList.remove("ln-row-selected");
        const e = o[t].querySelector("[data-ln-table-row-select]");
        e && (e.checked = !1);
      }
    }
    this._updateFooter();
  }, f.prototype._updateFooter = function() {
    let n = 0, o = 0;
    this.isDataDriven ? (n = this._lastTotal != null ? this._lastTotal : this._data.length, o = this.visibleCount) : (n = this._data.length, o = this._filteredData.length);
    const t = o < n;
    if (this._totalSpan && (this._totalSpan.textContent = r(n, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = t ? r(o, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !t), this._selectedSpan) {
      const e = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = e > 0 ? r(e, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", e === 0);
    }
  }, f.prototype._focusRow = function(n) {
    for (let o = 0; o < n.length; o++)
      n[o].classList.remove("ln-row-focused"), n[o].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < n.length) {
      const o = n[this._focusedRowIndex];
      o.classList.add("ln-row-focused"), o.setAttribute("tabindex", "0"), o.focus(), o.scrollIntoView({ block: "nearest" });
    }
  }, f.prototype.destroy = function() {
    this.dom[a] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:set-filter", this._onSetFilter), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), document.removeEventListener("keydown", this._onKeydown), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[a]);
  }, H(d, a, f, "ln-table", {
    extraAttributes: [
      "data-ln-table-window",
      "data-ln-table-window-page",
      "data-ln-table-window-threshold",
      "data-ln-table-count"
    ],
    onAttributeChange: function(n, o) {
      const t = n[a];
      if (!(!t || !t.isDataDriven)) {
        if (o === "data-ln-table-window") {
          const e = n.hasAttribute("data-ln-table-window");
          if (e && !t._windowed)
            t._enterWindowedMode(), t._kickWindowInitial();
          else if (!e && t._windowed)
            t._exitWindowedMode();
          else if (e && t._windowed) {
            const i = parseInt(n.getAttribute("data-ln-table-window"), 10);
            i > 0 && t._cache.configure({ windowSize: i });
          }
          return;
        }
        if (!(!t._windowed || !t._cache)) {
          if (o === "data-ln-table-window-page") {
            const e = parseInt(n.getAttribute("data-ln-table-window-page"), 10);
            e > 0 && t._cache.configure({ pageSize: e });
          } else if (o === "data-ln-table-window-threshold") {
            const e = parseInt(n.getAttribute("data-ln-table-window-threshold"), 10);
            e >= 0 && t._cache.configure({ threshold: e });
          } else if (o === "data-ln-table-count") {
            const e = parseInt(n.getAttribute("data-ln-table-count"), 10);
            e >= 0 && t._cache.setGrandTotal(e);
          }
        }
      }
    }
  });
})();
(function() {
  const d = "data-ln-table-coordinator", a = "lnTableCoordinator";
  if (window[a] !== void 0) return;
  document.addEventListener("keydown", function(g) {
    if (g.key !== "/" || g.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
    const m = document.querySelector("[" + d + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!m) return;
    const p = m.tagName === "INPUT" || m.tagName === "TEXTAREA" ? m : m.querySelector('input[type="search"], input[type="text"], input');
    p && (g.preventDefault(), p.focus());
  });
  function b(g) {
    return this.dom = g, y(this), this;
  }
  function y(g) {
    const m = g.dom;
    function p(s) {
      const u = s.target;
      if (u && u.hasAttribute && u.hasAttribute("data-ln-table")) return u;
      const r = s.detail && s.detail.targetId || u && u.id;
      return r ? m.querySelector('[data-ln-table-source="' + r + '"]') || m.querySelector('[data-ln-table="' + r + '"]') : null;
    }
    g._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(s) {
        if (!s.detail) return;
        const u = p(s);
        if (!u || !u.hasAttribute || !u.hasAttribute("data-ln-table")) return;
        const r = s.detail.key, l = s.detail.values || [], h = u.querySelectorAll("th");
        for (let c = 0; c < h.length; c++)
          if (h[c].getAttribute("data-ln-table-filter-col") === r) {
            const f = h[c].querySelector("[data-ln-table-col-filter]");
            f && f.classList.toggle("ln-filter-active", l.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(s) {
        const u = s.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!u) return;
        const r = u.closest("[data-ln-table]") || m.querySelector("[data-ln-table]");
        if (!r || !r.lnTable) return;
        const l = r.lnTable.name || r.id, h = r.querySelectorAll("th");
        for (let o = 0; o < h.length; o++) {
          const t = h[o].querySelector("[data-ln-table-col-filter]");
          t && t.classList.remove("ln-filter-active");
        }
        const c = r.getAttribute("data-ln-table-source") || r.id, f = c ? document.getElementById(c) : null;
        if (f && f.hasAttribute("data-ln-search"))
          f.setAttribute("data-ln-search", "");
        else {
          const o = c && m.querySelector('[data-ln-search-for="' + c + '"]') || m.querySelector("[data-ln-search-for]");
          if (o) {
            const t = o.tagName === "INPUT" || o.tagName === "TEXTAREA" ? o : o.querySelector("input");
            t && (t.value = "", t.dispatchEvent(new Event("input", { bubbles: !0 })));
          }
        }
        const n = c && m.querySelectorAll('[data-ln-filter="' + c + '"]') || m.querySelectorAll("[data-ln-filter]");
        for (let o = 0; o < n.length; o++) {
          const t = n[o].querySelector("[data-ln-filter-reset]");
          t && (t.checked = !0, t.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        r.hasAttribute("data-ln-table-source") || C(r, "ln-table:request-clear-filters", { table: l });
      }
    }, m.addEventListener("ln-filter:changed", g._handlers.filter), m.addEventListener("click", g._handlers.clear);
  }
  b.prototype.destroy = function() {
    this.dom[a] && (this._handlers && (this.dom.removeEventListener("ln-filter:changed", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[a]);
  }, H(d, a, b, "ln-table-coordinator");
})();
(function() {
  const d = "data-ln-list", a = "lnList", b = "data-ln-list-empty";
  if (window[a] !== void 0) return;
  function u(n, o) {
    if (n == null || isNaN(n)) return "";
    try {
      return new Intl.NumberFormat($(o)).format(n);
    } catch {
      return String(n);
    }
  }
  function r(n) {
    let o = n;
    for (; o && o !== document.body && o !== document.documentElement; ) {
      const e = getComputedStyle(o).overflowY;
      if (e === "auto" || e === "scroll") return o;
      o = o.parentElement;
    }
    return null;
  }
  function l(n) {
    const o = n._scrollContainer || r(n.dom);
    return {
      container: o,
      top: o ? o.scrollTop : window.scrollY
    };
  }
  function h(n) {
    n.container ? n.container.scrollTop = n.top : window.scrollTo(window.scrollX, n.top);
  }
  function c(n) {
    if (!n) return 0;
    const o = getComputedStyle(n), t = parseFloat(o.marginTop) || 0, e = parseFloat(o.marginBottom) || 0;
    return n.offsetHeight + t + e;
  }
  function f(n) {
    this.dom = n, this.tbody = n.querySelector("[data-ln-list-body]") || n, this.isDataDriven = n.hasAttribute("data-ln-list-source"), this.name = n.getAttribute(d) || "", this.source = n.getAttribute("data-ln-list-source") || "", this._totalSpan = n.querySelector("[data-ln-list-total]"), this._filteredSpan = n.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== n ? this._filteredSpan.parentElement : null), this._selectedSpan = n.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== n ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const o = this;
    return this._selectable = n.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._windowed = !1, this._cache = null, this.isDataDriven && n.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._lastTotal = 0, this._lastFiltered = 0, this._onSetData = function(t) {
      const e = t.detail || {};
      if (o._windowed) {
        n.classList.remove("ln-list--loading"), o._cache.ingest(e);
        return;
      }
      o._data = e.data || [], o._lastTotal = e.total != null ? e.total : o._data.length, o._lastFiltered = e.filtered != null ? e.filtered : o._data.length, o.totalCount = o._lastTotal, o.visibleCount = o._lastFiltered, o.isLoaded = !0, n.classList.remove("ln-list--loading"), o._vStart = -1, o._vEnd = -1, o._applyFilterAndSort(), o._render(), o._updateFooter(), C(n, "ln-list:rendered", {
        list: o.name,
        total: o.totalCount,
        visible: o.visibleCount
      });
    }, n.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(t) {
      const e = t.detail && t.detail.loading;
      n.classList.toggle("ln-list--loading", !!e), e && (o.isLoaded = !1);
    }, n.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(t) {
      !o._windowed || !o._cache || o._cache.release(t.detail && t.detail.offset);
    }, n.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !o._windowed || !o._cache || o._cache.revalidate();
    }, n.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !o._windowed || !o._cache || o._requestData();
    }, n.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onClearAll = function(t) {
      t.target.closest("[data-ln-list-clear-all]") && (o.currentFilters = {}, C(n, "ln-list:clear-filters", { list: o.name }), o._requestData());
    }, n.addEventListener("click", this._onClearAll), this._onSort = function(t) {
      t.detail.field != null && (t.preventDefault(), o.currentSort = t.detail.direction === "none" ? null : { field: t.detail.field, direction: t.detail.direction }, o._windowed ? o._requestData() : (o._applyFilterAndSort(), o._vStart = -1, o._vEnd = -1, o._render()));
    }, n.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onItemClick = function(t) {
      if (t.target.closest("[data-ln-item-select]") || t.target.closest("[data-ln-item-action]") || t.target.closest("a") || t.target.closest("button") || t.ctrlKey || t.metaKey || t.button === 1) return;
      const e = t.target.closest("[data-ln-item]");
      if (!e) return;
      const i = e.getAttribute("data-ln-item-id"), _ = e._lnRecord || {};
      C(n, "ln-list:item-click", {
        list: o.name,
        id: i,
        record: _
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(t) {
      const e = t.target.closest("[data-ln-item-action]");
      if (!e) return;
      t.stopPropagation();
      const i = e.closest("[data-ln-item]");
      if (!i) return;
      const _ = e.getAttribute("data-ln-item-action"), v = i.getAttribute("data-ln-item-id"), E = i._lnRecord || {};
      C(n, "ln-list:item-action", {
        list: o.name,
        id: v,
        action: _,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : C(n, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      o.tbody.children.length > 0 && (o._emptyObserver.disconnect(), o._emptyObserver = null, o._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 }))), this;
  }
  f.prototype._parseChildren = function() {
    const n = Array.from(this.tbody.children).filter((o) => !o.classList.contains("ln-list__spacer"));
    this._data = [], n.length > 0 && (this._itemHeight = c(n[0]) || 50);
    for (let o = 0; o < n.length; o++) {
      const t = n[o], e = t.getAttribute("data-ln-item-id") || t.getAttribute("id");
      t.textContent.trim().toLowerCase();
      let i = null;
      if (this.isDataDriven) {
        i = {}, e != null && (i.id = e);
        const _ = t.querySelectorAll("[data-ln-list-field]");
        for (let v = 0; v < _.length; v++) {
          const E = _[v], w = E.getAttribute("data-ln-list-field");
          w && (i[w] = E.textContent.trim());
        }
      }
      this._data.push({
        html: t.outerHTML,
        id: e,
        ...i
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), C(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, f.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      if (this._filteredData = this._data.slice(), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const n = this.currentSort.field, o = this.currentSort.direction === "desc" ? -1 : 1, t = this._filteredData.map(function(_) {
        return _[n];
      }), e = Mt(t), i = typeof Intl < "u" ? new Intl.Collator($(this.dom), { sensitivity: "base" }) : null;
      this._filteredData.sort(function(_, v) {
        return Nt(_[n], v[n], e, i) * o;
      });
    } else
      this._filteredData = this._data.slice();
  }, f.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const n = this._lastTotal, o = this.visibleCount;
        if (n === 0 || this._filteredData.length === 0 || o === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, f.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const n = this._filteredData, o = document.createDocumentFragment();
      for (let e = 0; e < n.length; e++) {
        const i = this._buildItem(n[e]);
        if (!i) break;
        o.appendChild(i);
      }
      const t = l(this);
      this.tbody.textContent = "", this.tbody.appendChild(o), h(t), this._selectable && this._updateSelectAll();
    }
  }, f.prototype._readGridLayout = function() {
    const n = getComputedStyle(this.tbody), o = n.gridTemplateColumns;
    let t = 1;
    if (o && o !== "none") {
      const i = o.trim().split(/\s+/).filter(Boolean);
      i.length > 0 && (t = i.length);
    }
    const e = parseFloat(n.rowGap);
    return { columns: t, rowGap: isNaN(e) ? 0 : e };
  }, f.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const n = this._cache.peek(), o = n ? this._buildItem(n) : this._buildPlaceholderItem();
      o && (this.tbody.textContent = "", this.tbody.appendChild(o), this._itemHeight = c(o) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const n = this._buildItem(this._data[0]);
        n && (this.tbody.textContent = "", this.tbody.appendChild(n), this._itemHeight = c(n) || 50, this.tbody.textContent = "");
      }
    } else {
      const n = this.tbody.children;
      n.length > 0 && (this._itemHeight = c(n[0]) || 50);
    }
  }, f.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const n = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = r(this.dom);
    const o = this._scrollContainer || window;
    this._scrollHandler = function() {
      n._rafId || (n._rafId = requestAnimationFrame(function() {
        n._rafId = null, n._windowed ? n._renderWindowed() : n._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      n._itemHeight = 0, n._measureItemHeight(), n._vStart = -1, n._vEnd = -1, n._windowed ? n._renderWindowed() : n._renderVirtual();
    }, o.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, f.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, f.prototype._renderVirtual = function() {
    const n = this._filteredData, o = n.length, t = this._itemHeight;
    if (!t || !o) return;
    const e = this._scrollContainer;
    let i, _;
    if (e) {
      const U = this.tbody.getBoundingClientRect(), K = e.getBoundingClientRect(), z = e === this.tbody ? 0 : U.top - K.top + e.scrollTop;
      i = e.scrollTop - z, _ = e.clientHeight;
    } else {
      const K = this.tbody.getBoundingClientRect().top + window.scrollY;
      i = window.scrollY - K, _ = window.innerHeight;
    }
    const v = this._readGridLayout(), E = v.columns, w = v.rowGap, A = t + w, L = Math.ceil(o / E);
    let q = Math.max(0, Math.floor(i / A) - 15);
    q = Math.min(q, L);
    const x = Math.ceil(_ / A) + 30, I = Math.min(q + x, L), k = Math.min(q * E, o), O = Math.min(I * E, o);
    if (k === this._vStart && O === this._vEnd) return;
    this._vStart = k, this._vEnd = O;
    const N = q * A, j = (L - I) * A;
    if (this.isDataDriven) {
      const U = document.createDocumentFragment();
      if (N > 0) {
        const z = document.createElement(this.isUl ? "li" : "div");
        z.className = "ln-list__spacer", z.style.height = N + "px", U.appendChild(z);
      }
      for (let z = k; z < O; z++) {
        const et = this._buildItem(n[z]);
        et && U.appendChild(et);
      }
      if (j > 0) {
        const z = document.createElement(this.isUl ? "li" : "div");
        z.className = "ln-list__spacer", z.style.height = j + "px", U.appendChild(z);
      }
      const K = l(this);
      this.tbody.textContent = "", this.tbody.appendChild(U), h(K), this._selectable && this._updateSelectAll();
    } else {
      let U = "";
      N > 0 && (U += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${N}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`);
      for (let z = k; z < O; z++)
        U += n[z].html;
      j > 0 && (U += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${j}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`);
      const K = l(this);
      this.tbody.innerHTML = U, h(K), this._selectable && this._restoreSelection();
    }
  }, f.prototype._buildPlaceholderItem = function() {
    const n = document.createElement(this.isUl ? "li" : "div");
    return n.className = "ln-list__placeholder", n.setAttribute("aria-hidden", "true"), n.style.height = this._itemHeight + "px", n;
  }, f.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const n = this._itemHeight;
    if (!n) return;
    const o = this._scrollContainer;
    let t, e;
    if (o) {
      const K = this.tbody.getBoundingClientRect(), z = o.getBoundingClientRect(), et = o === this.tbody ? 0 : K.top - z.top + o.scrollTop;
      t = o.scrollTop - et, e = o.clientHeight;
    } else {
      const z = this.tbody.getBoundingClientRect().top + window.scrollY;
      t = window.scrollY - z, e = window.innerHeight;
    }
    const i = this._readGridLayout(), _ = i.columns, v = i.rowGap, E = n + v, w = this._cache.logicalTotal, A = Math.ceil(w / _);
    let L = Math.max(0, Math.floor(t / E) - 15);
    L = Math.min(L, A);
    const q = Math.ceil(e / E) + 30, x = Math.min(L + q, A), I = Math.min(L * _, w), k = Math.min(x * _, w), O = L * E, N = (A - x) * E, j = document.createDocumentFragment();
    if (O > 0) {
      const K = document.createElement(this.isUl ? "li" : "div");
      K.className = "ln-list__spacer", K.style.height = O + "px", j.appendChild(K);
    }
    for (let K = I; K < k; K++)
      if (this._cache.has(K)) {
        const z = this._buildItem(this._cache.get(K));
        z && j.appendChild(z);
      } else
        j.appendChild(this._buildPlaceholderItem());
    if (N > 0) {
      const K = document.createElement(this.isUl ? "li" : "div");
      K.className = "ln-list__spacer", K.style.height = N + "px", j.appendChild(K);
    }
    const U = l(this);
    this.tbody.textContent = "", this.tbody.appendChild(j), h(U), this._vStart = I, this._vEnd = k, this._cache.ensure(I, k);
  }, f.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let n = null;
    if (this.isDataDriven) {
      const o = this._lastTotal != null ? this._lastTotal : this._data.length, e = this.visibleCount === 0 && o > 0, i = e ? this.name + "-empty-filtered" : this.name + "-empty";
      if (n = mt(this.dom, i, "ln-list"), !n) {
        const _ = this.dom.querySelector("template[data-ln-empty]");
        if (_) {
          const v = e ? "search" : "initial", E = _.content.querySelector(`[data-ln-empty-when="${v}"]`) || _.content.firstElementChild;
          E && (n = document.importNode(E, !0));
        }
      }
    } else {
      const o = this.dom.querySelector(`template[${b}]`);
      o && (n = document.importNode(o.content, !0));
    }
    if (n)
      if (n.tagName === "LI" || n.tagName === "TR")
        this.tbody.appendChild(n);
      else {
        const o = document.createElement(this.isUl ? "li" : "div");
        o.appendChild(n), this.tbody.appendChild(o);
      }
    C(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch : "",
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, f.prototype._buildItem = function(n) {
    const o = mt(this.dom, this.name + "-row", "ln-list");
    if (!o) return null;
    const t = o.querySelector("[data-ln-item]") || o.firstElementChild;
    if (!t) return null;
    if (At(t, n), st(t, n), t._lnRecord = n, n.id != null && (t.setAttribute("data-ln-item-id", n.id), this._selectable && this.selectedIds.has(String(n.id)))) {
      t.classList.add("ln-item-selected");
      const e = t.querySelector("[data-ln-item-select]");
      e && (e.checked = !0);
    }
    return t;
  }, f.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const n = this;
    this._onSelectionChange = function(o) {
      const t = o.target.closest("[data-ln-item-select]");
      if (!t) return;
      const e = t.closest("[data-ln-item]");
      if (!e) return;
      const i = e.getAttribute("data-ln-item-id");
      i != null && (t.checked ? (n.selectedIds.add(String(i)), e.classList.add("ln-item-selected")) : (n.selectedIds.delete(String(i)), e.classList.remove("ln-item-selected")), n._updateSelectAll(), n._updateFooter(), C(n.dom, "ln-list:select", {
        list: n.name,
        selectedIds: n.selectedIds,
        count: n.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const o = n._selectAllCheckbox.checked, t = n.tbody.querySelectorAll("[data-ln-item]");
      for (let e = 0; e < t.length; e++) {
        const i = t[e], _ = i.getAttribute("data-ln-item-id"), v = i.querySelector("[data-ln-item-select]");
        _ != null && (o ? (n.selectedIds.add(String(_)), i.classList.add("ln-item-selected")) : (n.selectedIds.delete(String(_)), i.classList.remove("ln-item-selected")), v && (v.checked = o));
      }
      C(n.dom, "ln-list:select-all", { list: n.name, selected: o }), C(n.dom, "ln-list:select", {
        list: n.name,
        selectedIds: n.selectedIds,
        count: n.selectedIds.size
      }), n._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, f.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const n = this.tbody.querySelectorAll("[data-ln-item]");
    let o = n.length > 0;
    for (let t = 0; t < n.length; t++) {
      const e = n[t].getAttribute("data-ln-item-id");
      if (e != null && !this.selectedIds.has(String(e))) {
        o = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = o;
  }, f.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    ue(this, "ln-list:request-data", "list");
  }, f.prototype._enterWindowedMode = function() {
    const n = this, o = this.dom, t = parseInt(o.getAttribute("data-ln-list-window"), 10), e = parseInt(o.getAttribute("data-ln-list-window-page"), 10), i = parseInt(o.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !n._windowed || !n._cache || (n.totalCount = n._cache.grandTotal, n.visibleCount = n._cache.logicalTotal, n._lastTotal = n._cache.grandTotal, n.isLoaded = !0, n._vStart = -1, n._vEnd = -1, n._render(), n._updateFooter(), C(o, "ln-list:rendered", {
        list: n.name,
        total: n.totalCount,
        visible: n.visibleCount
      }));
    }, this._renderBatch = Zt(this._onCacheChange), this._cache = ye({
      windowSize: t > 0 ? t : 1e3,
      pageSize: e > 0 ? e : 200,
      threshold: i >= 0 ? i : 25,
      fetchDebounce: 120,
      requestPage: function(_, v, E) {
        C(o, "ln-list:request-data", {
          list: n.name,
          sort: _.sort,
          filters: _.filters,
          search: _.search,
          offset: v,
          limit: E,
          queryGen: n._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, f.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const n = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), o = n > 0 ? n : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: o,
        filtered: o
      });
    } else
      this.dom.classList.add("ln-list--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, f.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, f.prototype._updateFooter = function() {
    let n = 0, o = 0;
    this.isDataDriven ? (n = this._lastTotal != null ? this._lastTotal : this._data.length, o = this.visibleCount) : (n = this._data.length, o = this._filteredData.length);
    const t = o < n;
    if (this._totalSpan && (this._totalSpan.textContent = u(n, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = t ? u(o, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !t), this._selectedSpan) {
      const e = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = e > 0 ? u(e, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", e === 0);
    }
  }, f.prototype.destroy = function() {
    this.dom[a] && (this._disableVirtualScroll(), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("click", this._onClearAll), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[a]);
  }, H(d, a, f, "ln-list", {
    extraAttributes: [
      "data-ln-list-window",
      "data-ln-list-window-page",
      "data-ln-list-window-threshold",
      "data-ln-list-count"
    ],
    onAttributeChange: function(n, o) {
      const t = n[a];
      if (!(!t || !t.isDataDriven)) {
        if (o === "data-ln-list-window") {
          const e = n.hasAttribute("data-ln-list-window");
          if (e && !t._windowed)
            t._enterWindowedMode(), t._kickWindowInitial();
          else if (!e && t._windowed)
            t._exitWindowedMode();
          else if (e && t._windowed) {
            const i = parseInt(n.getAttribute("data-ln-list-window"), 10);
            i > 0 && t._cache.configure({ windowSize: i });
          }
          return;
        }
        if (!(!t._windowed || !t._cache)) {
          if (o === "data-ln-list-window-page") {
            const e = parseInt(n.getAttribute("data-ln-list-window-page"), 10);
            e > 0 && t._cache.configure({ pageSize: e });
          } else if (o === "data-ln-list-window-threshold") {
            const e = parseInt(n.getAttribute("data-ln-list-window-threshold"), 10);
            e >= 0 && t._cache.configure({ threshold: e });
          } else if (o === "data-ln-list-count") {
            const e = parseInt(n.getAttribute("data-ln-list-count"), 10);
            e >= 0 && t._cache.setGrandTotal(e);
          }
        }
      }
    }
  });
})();
(function() {
  const d = "data-ln-circular-progress", a = "lnCircularProgress";
  if (window[a] !== void 0) return;
  const b = "http://www.w3.org/2000/svg", y = 36, g = 16, m = 2 * Math.PI * g;
  function p(h) {
    return this.dom = h, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, u.call(this), l.call(this), r.call(this), this;
  }
  p.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("role"), this.dom.removeAttribute("aria-valuemin"), this.dom.removeAttribute("aria-valuemax"), this.dom.removeAttribute("aria-valuenow"), this.dom.removeAttribute("aria-valuetext"), delete this.dom[a]);
  };
  function s(h, c) {
    const f = document.createElementNS(b, h);
    for (const n in c)
      f.setAttribute(n, c[n]);
    return f;
  }
  function u() {
    this.svg = s("svg", {
      viewBox: "0 0 " + y + " " + y,
      "aria-hidden": "true"
    }), this.trackCircle = s("circle", {
      cx: y / 2,
      cy: y / 2,
      r: g,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = s("circle", {
      cx: y / 2,
      cy: y / 2,
      r: g,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": m,
      "stroke-dashoffset": m,
      transform: "rotate(-90 " + y / 2 + " " + y / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function r() {
    const h = this, c = new MutationObserver(function(f) {
      for (const n of f)
        (n.attributeName === "data-ln-circular-progress" || n.attributeName === "data-ln-circular-progress-max" || n.attributeName === "data-ln-circular-progress-label") && l.call(h);
    });
    c.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max", "data-ln-circular-progress-label"]
    }), this._attrObserver = c;
  }
  function l() {
    const h = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, c = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let f = c > 0 ? h / c * 100 : 0;
    f < 0 && (f = 0), f > 100 && (f = 100);
    const n = m - f / 100 * m;
    this.progressCircle.setAttribute("stroke-dashoffset", n);
    const o = this.dom.getAttribute("data-ln-circular-progress-label"), t = o !== null ? o : Math.round(f) + "%";
    this.labelEl.textContent = t, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(c));
    const e = Math.max(0, Math.min(h, c));
    this.dom.setAttribute("aria-valuenow", String(e)), this.dom.setAttribute("aria-valuetext", t), C(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: h,
      max: c,
      percentage: f
    });
  }
  H(d, a, p, "ln-circular-progress");
})();
(function() {
  const d = "data-ln-sortable", a = "lnSortable", b = "data-ln-sortable-handle";
  if (window[a] !== void 0) return;
  function y(m) {
    this.dom = m, this.isEnabled = m.getAttribute(d) !== "disabled", this._dragging = null, m.setAttribute("aria-roledescription", "sortable list");
    const p = this;
    return this._onPointerDown = function(s) {
      p.isEnabled && p._handlePointerDown(s);
    }, m.addEventListener("pointerdown", this._onPointerDown), this;
  }
  y.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(d, "");
  }, y.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(d, "disabled");
  }, y.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), C(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[a]);
  }, y.prototype._handlePointerDown = function(m) {
    let p = m.target.closest("[" + b + "]"), s;
    if (p) {
      for (s = p; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + b + "]")) return;
      for (s = m.target; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
      p = s;
    }
    const r = Array.from(this.dom.children).indexOf(s);
    if (J(this.dom, "ln-sortable:before-drag", {
      item: s,
      index: r
    }).defaultPrevented) return;
    m.preventDefault(), p.setPointerCapture(m.pointerId), this._dragging = s, s.classList.add("ln-sortable--dragging"), s.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), C(this.dom, "ln-sortable:drag-start", {
      item: s,
      index: r
    });
    const h = this, c = function(n) {
      h._handlePointerMove(n);
    }, f = function(n) {
      h._handlePointerEnd(n), p.removeEventListener("pointermove", c), p.removeEventListener("pointerup", f), p.removeEventListener("pointercancel", f);
    };
    p.addEventListener("pointermove", c), p.addEventListener("pointerup", f), p.addEventListener("pointercancel", f);
  }, y.prototype._handlePointerMove = function(m) {
    if (!this._dragging) return;
    const p = Array.from(this.dom.children), s = this._dragging;
    for (const u of p)
      u.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const u of p) {
      if (u === s) continue;
      const r = u.getBoundingClientRect(), l = r.top + r.height / 2;
      if (m.clientY >= r.top && m.clientY < l) {
        u.classList.add("ln-sortable--drop-before");
        break;
      } else if (m.clientY >= l && m.clientY <= r.bottom) {
        u.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, y.prototype._handlePointerEnd = function(m) {
    if (!this._dragging) return;
    const p = this._dragging, s = Array.from(this.dom.children), u = s.indexOf(p);
    let r = null, l = null;
    for (const h of s) {
      if (h.classList.contains("ln-sortable--drop-before")) {
        r = h, l = "before";
        break;
      }
      if (h.classList.contains("ln-sortable--drop-after")) {
        r = h, l = "after";
        break;
      }
    }
    for (const h of s)
      h.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (p.classList.remove("ln-sortable--dragging"), p.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), r && r !== p) {
      l === "before" ? this.dom.insertBefore(p, r) : this.dom.insertBefore(p, r.nextElementSibling);
      const c = Array.from(this.dom.children).indexOf(p);
      C(this.dom, "ln-sortable:reordered", {
        item: p,
        oldIndex: u,
        newIndex: c
      });
    }
    this._dragging = null;
  };
  function g(m) {
    const p = m[a];
    if (!p) return;
    const s = m.getAttribute(d) !== "disabled";
    s !== p.isEnabled && (p.isEnabled = s, C(m, s ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: m }));
  }
  H(d, a, y, "ln-sortable", {
    onAttributeChange: g
  });
})();
(function() {
  const d = "data-ln-confirm", a = "lnConfirm", b = "data-ln-confirm-timeout";
  if (window[a] !== void 0) return;
  function g(...p) {
    (document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) && console.warn("[ln-confirm]", ...p);
  }
  function m(p) {
    g("constructor called on", p), this.dom = p, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = p.querySelector("[data-ln-confirm-idle]"), this.activeEl = p.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = p.textContent.trim(), this.confirmText = p.getAttribute(d) || "Confirm?");
    const s = this;
    return this._onClick = function(u) {
      if (g("click handler, confirming:", s.confirming, "submitted:", s._submitted, "target:", u.target), !s.confirming)
        u.preventDefault(), u.stopImmediatePropagation(), s._enterConfirm();
      else {
        if (s._submitted) return;
        s._submitted = !0, u.stopPropagation(), s._reset();
      }
    }, p.addEventListener("click", this._onClick), this;
  }
  m.prototype._getTimeout = function() {
    const p = parseFloat(this.dom.getAttribute(b));
    return isNaN(p) || p <= 0 ? 3 : p;
  }, m.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const s = this.activeEl ? this.activeEl.textContent.trim() : "";
      s && (this.dom.setAttribute("aria-label", s), this.dom.setAttribute("aria-live", "polite"));
    } else {
      var p = this.dom.querySelector("svg.ln-icon use");
      p && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = p.getAttribute("href"), p.setAttribute("href", "#ln-icon-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.dom.setAttribute("aria-label", this.confirmText), this.dom.setAttribute("aria-live", "polite")) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), C(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, m.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const p = this, s = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      p._reset();
    }, s);
  }, m.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      var p = this.dom.querySelector("svg.ln-icon use");
      p && this.originalIconHref && p.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, m.prototype.destroy = function() {
    g("destroy called on", this.dom), this.dom[a] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[a]);
  }, H(d, a, m, "ln-confirm");
})();
(function() {
  const d = "data-ln-translations", a = "lnTranslations";
  if (window[a] !== void 0) return;
  const b = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function y(g) {
    this.dom = g, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = g.getAttribute(d + "-default") || "", this.placeholderLabel = g.getAttribute(d + "-placeholder") || "{lang} translation", this.removeLabel = g.getAttribute(d + "-remove-label") || "Remove {lang}", this.badgesEl = g.querySelector("[" + d + "-active]"), this.menuEl = g.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const m = g.getAttribute(d + "-locales");
    if (this.locales = b, m)
      try {
        this.locales = JSON.parse(m);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const p = this;
    return this._onRequestAdd = function(s) {
      s.detail && s.detail.lang && p.addLanguage(s.detail.lang);
    }, this._onRequestRemove = function(s) {
      s.detail && s.detail.lang && p.removeLanguage(s.detail.lang);
    }, g.addEventListener("ln-translations:request-add", this._onRequestAdd), g.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  y.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const g = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const m of g) {
      const p = m.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const s of p)
        s.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, y.prototype._detectExisting = function() {
    const g = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const m of g) {
      const p = m.getAttribute("data-ln-translatable-lang");
      p && p !== this.defaultLang && this.activeLanguages.add(p);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, y.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const g = this;
    let m = 0;
    for (const s in this.locales) {
      if (!this.locales.hasOwnProperty(s) || this.activeLanguages.has(s)) continue;
      m++;
      const u = Rt("ln-translations-menu-item", "ln-translations");
      if (!u) return;
      const r = u.querySelector("[data-ln-translations-lang]");
      r.setAttribute("data-ln-translations-lang", s), r.textContent = this.locales[s], r.addEventListener("click", function(l) {
        l.ctrlKey || l.metaKey || l.button === 1 || (l.preventDefault(), l.stopPropagation(), g.menuEl.getAttribute("data-ln-toggle") === "open" && g.menuEl.setAttribute("data-ln-toggle", "close"), g.addLanguage(s));
      }), this.menuEl.appendChild(u);
    }
    const p = this.dom.querySelector("[" + d + "-add]");
    p && (p.hidden = m === 0);
  }, y.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const g = this;
    this.activeLanguages.forEach(function(m) {
      const p = Rt("ln-translations-badge", "ln-translations");
      if (!p) return;
      const s = p.querySelector("[data-ln-translations-lang]");
      s.setAttribute("data-ln-translations-lang", m);
      const u = s.querySelector("span");
      u.textContent = g.locales[m] || m.toUpperCase();
      const r = s.querySelector("button"), l = g.locales[m] || m.toUpperCase();
      r.setAttribute("aria-label", g.removeLabel.replace("{lang}", l)), r.addEventListener("click", function(h) {
        h.ctrlKey || h.metaKey || h.button === 1 || (h.preventDefault(), h.stopPropagation(), g.removeLanguage(m));
      }), g.badgesEl.appendChild(p);
    });
  }, y.prototype.addLanguage = function(g, m) {
    if (this.activeLanguages.has(g)) return;
    const p = this.locales[g] || g;
    if (J(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: g,
      langName: p
    }).defaultPrevented) return;
    this.activeLanguages.add(g), m = m || {};
    const u = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const r of u) {
      const l = r.getAttribute("data-ln-translatable"), h = r.getAttribute("data-ln-translations-prefix") || "", c = r.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!c) continue;
      const f = c.cloneNode(c.tagName === "SELECT");
      h ? f.name = h + "[trans][" + g + "][" + l + "]" : f.name = "trans[" + g + "][" + l + "]", f.value = m[l] !== void 0 ? m[l] : "", f.removeAttribute("id"), "placeholder" in f && (f.placeholder = this.placeholderLabel.replace("{lang}", p)), f.setAttribute("data-ln-translatable-lang", g);
      const n = r.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), o = n.length > 0 ? n[n.length - 1] : c;
      o.parentNode.insertBefore(f, o.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), C(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: g,
      langName: p
    });
  }, y.prototype.removeLanguage = function(g) {
    if (!this.activeLanguages.has(g) || J(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: g
    }).defaultPrevented) return;
    const p = this.dom.querySelectorAll('[data-ln-translatable-lang="' + g + '"]');
    for (const s of p)
      s.parentNode.removeChild(s);
    this.activeLanguages.delete(g), this._updateDropdown(), this._updateBadges(), C(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: g
    });
  }, y.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, y.prototype.hasLanguage = function(g) {
    return this.activeLanguages.has(g);
  }, y.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const g = this.defaultLang, m = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const p of m)
      p.getAttribute("data-ln-translatable-lang") !== g && p.parentNode.removeChild(p);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[a];
  }, H(d, a, y, "ln-translations");
})();
(function() {
  const d = "data-ln-autosave", a = "lnAutosave", b = "data-ln-autosave-clear", y = "data-ln-autosave-debounce-input", g = "ln-autosave:";
  if (window[a] !== void 0) return;
  function p(l) {
    const h = s(l);
    if (!h) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", l);
      return;
    }
    this.dom = l, this.key = h;
    let c = null;
    function f() {
      const e = he(l, { exclude: "[data-ln-autosave-exclude]" });
      try {
        localStorage.setItem(h, JSON.stringify(e));
      } catch {
        return;
      }
      C(l, "ln-autosave:saved", { target: l, data: e });
    }
    function n() {
      let e;
      try {
        e = localStorage.getItem(h);
      } catch {
        return;
      }
      if (!e) return;
      let i;
      try {
        i = JSON.parse(e);
      } catch {
        return;
      }
      if (J(l, "ln-autosave:before-restore", { target: l, data: i }).defaultPrevented) return;
      const v = fe(l, i);
      for (let E = 0; E < v.length; E++)
        v[E].dispatchEvent(new Event("input", { bubbles: !0 })), v[E].dispatchEvent(new Event("change", { bubbles: !0 }));
      C(l, "ln-autosave:restored", { target: l, data: i });
    }
    function o() {
      try {
        localStorage.removeItem(h);
      } catch {
        return;
      }
      C(l, "ln-autosave:cleared", { target: l });
    }
    this._onFocusout = function(e) {
      const i = e.target;
      u(i) && i.name && !i.hasAttribute("data-ln-autosave-exclude") && f();
    }, this._onChange = function(e) {
      const i = e.target;
      u(i) && i.name && !i.hasAttribute("data-ln-autosave-exclude") && f();
    }, this._onSubmit = function() {
      o();
    }, this._onReset = function() {
      o();
    }, this._onClearClick = function(e) {
      e.target.closest("[" + b + "]") && o();
    }, l.addEventListener("focusout", this._onFocusout), l.addEventListener("change", this._onChange), l.addEventListener("submit", this._onSubmit), l.addEventListener("reset", this._onReset), l.addEventListener("click", this._onClearClick);
    const t = r(l);
    return t > 0 && (this._onInput = function(e) {
      const i = e.target;
      !u(i) || !i.name || i.hasAttribute("data-ln-autosave-exclude") || (c !== null && clearTimeout(c), c = setTimeout(f, t));
    }, l.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return c;
    }, n(), this;
  }
  p.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const l = this._getInputTimer();
        l !== null && clearTimeout(l);
      }
      C(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[a];
    }
  };
  function s(l) {
    const c = l.getAttribute(d) || l.id;
    return c ? g + window.location.pathname + ":" + c : null;
  }
  function u(l) {
    const h = l.tagName;
    return h === "INPUT" || h === "TEXTAREA" || h === "SELECT";
  }
  function r(l) {
    if (!l.hasAttribute(y)) return 0;
    const h = l.getAttribute(y);
    if (h === "" || h === null) return 1e3;
    const c = parseInt(h, 10);
    return isNaN(c) || c < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", l), 1e3) : c;
  }
  H(d, a, p, "ln-autosave");
})();
(function() {
  const d = "data-ln-autoresize", a = "lnAutoresize";
  if (window[a] !== void 0) return;
  function b(y) {
    if (y.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", y.tagName), this;
    this.dom = y;
    const g = this;
    return this._onInput = function() {
      g._resize();
    }, y.addEventListener("input", this._onInput), this._resize(), this;
  }
  b.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, b.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[a]);
  }, H(d, a, b, "ln-autoresize");
})();
(function() {
  const d = "data-ln-editor", a = "lnEditor";
  if (window[a] !== void 0) return;
  const b = {
    P: !0,
    BR: !0,
    STRONG: !0,
    B: !0,
    EM: !0,
    I: !0,
    U: !0,
    S: !0,
    A: !0,
    UL: !0,
    OL: !0,
    LI: !0,
    H2: !0,
    H3: !0,
    H4: !0,
    BLOCKQUOTE: !0,
    PRE: !0,
    CODE: !0,
    DIV: !0
  }, y = {
    bold: "bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "strikeThrough"
  }, g = {
    "heading-2": "h2",
    "heading-3": "h3",
    "heading-4": "h4",
    blockquote: "blockquote",
    code: "pre",
    paragraph: "p"
  }, m = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let p = 0;
  function s(t) {
    return !!(y[t] || g[t] || m[t] || t === "link");
  }
  function u(t) {
    this.dom = t;
    const e = this;
    if (this._textarea = t.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", t), this;
    const i = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), i && this._surface.setAttribute("data-placeholder", i);
    const _ = this._textarea.id;
    if (_) {
      const A = t.querySelector('label[for="' + _ + '"]');
      A && (A.id || (A.id = _ + "-label"), this._surface.setAttribute("aria-labelledby", A.id));
    }
    this._surface.id = _ ? _ + "-surface" : "ln-editor-surface-" + ++p;
    const v = this._textarea.value.trim();
    v && (this._surface.innerHTML = v);
    const E = t.querySelector('[role="toolbar"]');
    if (E && E.nextSibling ? t.insertBefore(this._surface, E.nextSibling) : t.appendChild(this._surface), E) {
      E.setAttribute("aria-controls", this._surface.id);
      const A = E.querySelectorAll("[data-ln-editor-action]");
      for (let L = 0; L < A.length; L++) {
        const q = A[L].getAttribute("data-ln-editor-action");
        s(q) && A[L].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      e._syncToTextarea(), C(e.dom, "ln-editor:changed", {
        html: e._textarea.value,
        target: e.dom
      });
    }, this._onMousedownToolbar = function(A) {
      A.target.closest("[data-ln-editor-action]") && A.preventDefault();
    }, this._onClickToolbar = function(A) {
      const L = A.target.closest("[data-ln-editor-action]");
      if (!L) return;
      const q = L.getAttribute("data-ln-editor-action");
      e._execAction(q);
    }, this._onPaste = function(A) {
      h(e, A);
    }, this._onKeydown = function(A) {
      n(e, A);
    }, this._onSelectionChange = function() {
      document.contains(e._surface) && e._updateActiveStates();
    }, this._onFocus = function() {
      C(e.dom, "ln-editor:focus", { target: e.dom });
    }, this._onBlur = function() {
      e._syncToTextarea(), C(e.dom, "ln-editor:blur", { target: e.dom });
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), E && (E.addEventListener("mousedown", this._onMousedownToolbar), E.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(A) {
      const L = A.detail && A.detail.html;
      L !== void 0 && (e._surface.innerHTML = L, e._syncToTextarea(), C(e.dom, "ln-editor:changed", {
        html: e._textarea.value,
        target: e.dom
      }));
    }, t.addEventListener("ln-editor:set-content", this._onSetContent);
    const w = this._textarea.form;
    return w && (this._onFormReset = function() {
      setTimeout(function() {
        e._surface.innerHTML = e._textarea.value, C(t, "ln-editor:changed", {
          html: e._textarea.value,
          target: t
        });
      }, 0);
    }, w.addEventListener("reset", this._onFormReset)), this;
  }
  u.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, u.prototype._execAction = function(t) {
    if (!(!t || J(this.dom, "ln-editor:before-change", {
      action: t,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), y[t])
        document.execCommand(y[t], !1, null);
      else if (g[t]) {
        const i = g[t], _ = r(this._surface);
        _ && _.toLowerCase() === i ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + i + ">");
      } else m[t] ? document.execCommand(m[t], !1, null) : t === "link" ? o(this) : t === "unlink" ? document.execCommand("unlink", !1, null) : t === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, u.prototype._updateActiveStates = function() {
    const t = this.dom.querySelector('[role="toolbar"]');
    if (!t) return;
    const e = window.getSelection();
    if (!e || e.rangeCount === 0) return;
    const i = e.anchorNode;
    if (!i || !this._surface.contains(i)) return;
    const _ = t.querySelectorAll("[data-ln-editor-action]");
    for (let v = 0; v < _.length; v++) {
      const E = _[v], w = E.getAttribute("data-ln-editor-action");
      let A = !1;
      if (y[w])
        try {
          A = document.queryCommandState(y[w]);
        } catch {
        }
      else if (g[w]) {
        const L = r(this._surface);
        A = L && L.toLowerCase() === g[w];
      } else if (m[w])
        try {
          A = document.queryCommandState(m[w]);
        } catch {
        }
      else w === "link" && (A = !!l(e.anchorNode, "A", this._surface));
      s(w) && E.setAttribute("aria-pressed", String(A)), A ? E.classList.add("ln-editor-active") : E.classList.remove("ln-editor-active");
    }
  }, u.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, u.prototype.setHTML = function(t) {
    this._surface && (this._surface.innerHTML = t, this._syncToTextarea(), C(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, u.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const t = this.dom.querySelector('[role="toolbar"]');
    t && (t.removeEventListener("mousedown", this._onMousedownToolbar), t.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const e = this._textarea ? this._textarea.form : null;
    e && this._onFormReset && e.removeEventListener("reset", this._onFormReset), this._textarea && this._textarea.removeAttribute("data-ln-editor-source");
    const i = this.dom.querySelector(".ln-editor__link-popover");
    i && i.remove(), C(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[a];
  };
  function r(t) {
    const e = window.getSelection();
    if (!e || e.rangeCount === 0) return null;
    let i = e.anchorNode;
    if (!i) return null;
    for (; i && i !== t; ) {
      if (i.nodeType === 1) {
        const _ = i.tagName;
        if (_ === "H2" || _ === "H3" || _ === "H4" || _ === "BLOCKQUOTE" || _ === "PRE" || _ === "P")
          return _;
      }
      i = i.parentNode;
    }
    return null;
  }
  function l(t, e, i) {
    for (; t && t !== i; ) {
      if (t.nodeType === 1 && t.tagName === e)
        return t;
      t = t.parentNode;
    }
    return null;
  }
  function h(t, e) {
    e.preventDefault();
    let i = "";
    if (e.clipboardData && (i = e.clipboardData.getData("text/html"), !i)) {
      const v = e.clipboardData.getData("text/plain");
      v && (i = v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), i = "<p>" + i + "</p>");
    }
    if (!i) return;
    const _ = c(i);
    _ && document.execCommand("insertHTML", !1, _);
  }
  function c(t) {
    const e = document.createElement("div");
    return e.innerHTML = t, f(e), e.innerHTML;
  }
  function f(t) {
    const e = Array.from(t.childNodes);
    for (let i = 0; i < e.length; i++) {
      const _ = e[i];
      if (_.nodeType !== 3) {
        if (_.nodeType !== 1) {
          t.removeChild(_);
          continue;
        }
        if (b[_.tagName]) {
          const v = Array.from(_.attributes);
          for (let E = 0; E < v.length; E++) {
            const w = v[E].name;
            if (_.tagName === "A" && w === "href") {
              const A = _.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(A) || _.removeAttribute("href");
            } else
              _.removeAttribute(w);
          }
          _.tagName === "A" && _.setAttribute("rel", "noopener noreferrer"), f(_);
        } else {
          for (; _.firstChild; )
            t.insertBefore(_.firstChild, _);
          t.removeChild(_);
        }
      }
    }
  }
  function n(t, e) {
    if (!(e.ctrlKey || e.metaKey)) return;
    let i = null;
    switch (e.key.toLowerCase()) {
      case "b":
        i = "bold";
        break;
      case "i":
        i = "italic";
        break;
      case "u":
        i = "underline";
        break;
      case "k":
        i = "link";
        break;
    }
    i && (e.preventDefault(), t._execAction(i));
  }
  function o(t) {
    const e = window.getSelection();
    if (!e || e.rangeCount === 0) return;
    const i = l(e.anchorNode, "A", t._surface), _ = e.getRangeAt(0).cloneRange(), v = t.dom.querySelector(".ln-editor__link-popover");
    v && v.remove();
    const E = mt(t.dom, "ln-editor-link-popover", "ln-editor");
    if (!E) return;
    const w = E.firstElementChild;
    if (!w) return;
    const A = w.querySelector('input[type="url"]'), L = w.querySelector('[data-ln-editor-action="confirm-link"]'), q = w.querySelector('[data-ln-editor-action="cancel-link"]');
    i && (A.value = i.getAttribute("href") || "");
    const x = t.dom.querySelector('[role="toolbar"]');
    x ? x.after(w) : t.dom.insertBefore(w, t._surface), A.focus();
    function I() {
      const N = window.getSelection();
      N.removeAllRanges(), N.addRange(_);
    }
    function k() {
      const N = A.value.trim();
      if (w.remove(), I(), t._surface.focus(), N)
        if (i)
          i.setAttribute("href", N), i.setAttribute("rel", "noopener noreferrer"), t._syncToTextarea(), C(t.dom, "ln-editor:changed", {
            html: t._textarea.value,
            target: t.dom
          });
        else {
          document.execCommand("createLink", !1, N);
          const j = window.getSelection();
          if (j && j.anchorNode) {
            const U = l(j.anchorNode, "A", t._surface);
            U && (U.setAttribute("rel", "noopener noreferrer"), t._syncToTextarea());
          }
        }
      else i && document.execCommand("unlink", !1, null);
    }
    function O() {
      w.remove(), I(), t._surface.focus();
    }
    L.addEventListener("click", k), q.addEventListener("click", O), A.addEventListener("keydown", function(N) {
      N.key === "Enter" ? (N.preventDefault(), k()) : N.key === "Escape" && (N.preventDefault(), O());
    });
  }
  H(d, a, u, "ln-editor");
})();
(function() {
  const d = "lnFill";
  if (window[d] !== void 0) return;
  const a = { lnFillForm: !0, lnFillStore: !0 };
  function b(g) {
    const m = {}, p = g.dataset;
    for (const s in p) {
      if (!s.startsWith("lnFill") || a[s]) continue;
      const u = s.slice(6);
      u && (m[u.charAt(0).toLowerCase() + u.slice(1)] = p[s]);
    }
    return m;
  }
  function y(g, m) {
    const p = window.CSS && CSS.escape ? CSS.escape(m) : m, s = document.querySelectorAll('[data-ln-fill-id="' + p + '"]');
    if (s.length === 0) return null;
    for (let u = 0; u < s.length; u++) {
      const r = s[u].getAttribute("data-ln-fill-form");
      if (r) {
        const l = document.getElementById(r);
        if (l && g.contains(l)) return s[u];
      }
    }
    return s[0];
  }
  document.addEventListener("click", function(g) {
    if (g.ctrlKey || g.metaKey || g.button === 1) return;
    const m = g.target.closest("[data-ln-fill-form]");
    if (!m) return;
    const p = m.getAttribute("href");
    if (p && p.indexOf("#") !== -1) return;
    const s = m.getAttribute("data-ln-fill-form"), u = document.getElementById(s);
    if (!u) return;
    const r = b(m), l = Object.keys(r).length > 0;
    window.lnCore.lnFill(u, l ? r : null);
  }), document.addEventListener("ln-fill:request", function(g) {
    const m = g.detail;
    if (!m) return;
    const p = g.target, s = m.id;
    if (s == null) {
      window.lnCore.lnFill(p, null);
      return;
    }
    const u = y(p, s);
    if (!u) return;
    const r = b(u);
    window.lnCore.lnFill(p, r);
  }), window[d] = !0;
})();
(function() {
  const d = "data-ln-slug-from", a = "lnSlug";
  if (window[a] !== void 0) return;
  function b(g) {
    return String(g).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function y(g) {
    if (g.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", g.tagName), this;
    const m = g.form;
    if (!m)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", g), this;
    const p = g.getAttribute(d), s = m.elements[p];
    if (!s)
      return console.warn('[ln-slug] Source field "' + p + '" not found in form:', g), this;
    if (typeof s.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + p + '" is a RadioNodeList (same-name group) — single source field required:', g), this;
    this.dom = g, this.source = s, this._pristine = g.value === "", this._mirroring = !1;
    const u = this;
    return this._onSource = function() {
      u._pristine && u._mirror();
    }, this._onSlug = function() {
      u._mirroring || (u._pristine = u.dom.value === "");
    }, s.addEventListener("input", this._onSource), g.addEventListener("input", this._onSlug), this;
  }
  y.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = b(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, y.prototype.destroy = function() {
    this.dom[a] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[a]);
  }, H(d, a, y, "ln-slug");
})();
(function() {
  const d = "data-ln-time", a = "lnTime";
  if (window[a] !== void 0) return;
  const b = {}, y = {};
  function g(w) {
    return w.getAttribute("data-ln-time-locale") || $(w);
  }
  function m(w, A) {
    const L = (w || "") + "|" + JSON.stringify(A);
    return b[L] || (b[L] = new Intl.DateTimeFormat(w, A)), b[L];
  }
  function p(w) {
    const A = w || "";
    return y[A] || (y[A] = new Intl.RelativeTimeFormat(w, { numeric: "auto", style: "narrow" })), y[A];
  }
  const s = /* @__PURE__ */ new Set();
  let u = null;
  function r() {
    u || (u = setInterval(h, 6e4));
  }
  function l() {
    u && (clearInterval(u), u = null);
  }
  function h() {
    for (const w of s) {
      if (!document.body.contains(w.dom)) {
        s.delete(w);
        continue;
      }
      e(w);
    }
    s.size === 0 && l();
  }
  function c(w, A) {
    const L = qt(A), q = (A || "").toLowerCase().split("-")[0], x = m(A, { dateStyle: "long", timeStyle: "short" }), I = x.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (L && I !== q && L.monthsLong) {
      const k = L.monthsLong[w.getMonth()], O = w.getDate(), N = w.getFullYear(), j = String(w.getHours()).padStart(2, "0"), U = String(w.getMinutes()).padStart(2, "0");
      return `${O} ${k} ${N} во ${j}:${U}`;
    }
    return x.format(w);
  }
  function f(w, A) {
    const L = /* @__PURE__ */ new Date(), q = { month: "short", day: "numeric" };
    w.getFullYear() !== L.getFullYear() && (q.year = "numeric");
    const x = qt(A), I = (A || "").toLowerCase().split("-")[0], k = m(A, q), O = k.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (x && O !== I && x.monthsShort) {
      const N = x.monthsShort[w.getMonth()], j = w.getDate(), U = w.getFullYear() !== L.getFullYear() ? " " + w.getFullYear() : "";
      return `${j} ${N}${U}`;
    }
    return k.format(w);
  }
  function n(w, A) {
    return m(A, { dateStyle: "medium" }).format(w);
  }
  function o(w, A) {
    return m(A, { timeStyle: "short" }).format(w);
  }
  function t(w, A) {
    const L = Math.floor(Date.now() / 1e3), x = Math.floor(w.getTime() / 1e3) - L, I = Math.abs(x);
    if (I < 10) return p(A).format(0, "second");
    let k, O;
    if (I < 60)
      k = "second", O = x;
    else if (I < 3600)
      k = "minute", O = Math.round(x / 60);
    else if (I < 86400)
      k = "hour", O = Math.round(x / 3600);
    else if (I < 604800)
      k = "day", O = Math.round(x / 86400);
    else if (I < 2592e3)
      k = "week", O = Math.round(x / 604800);
    else
      return f(w, A);
    return p(A).format(O, k);
  }
  function e(w) {
    const A = w.dom.getAttribute("datetime");
    if (!A) return;
    const L = Number(A);
    if (isNaN(L)) return;
    const q = new Date(L * 1e3), x = w.dom.getAttribute(d) || "short", I = g(w.dom);
    let k;
    switch (x) {
      case "relative":
        k = t(q, I);
        break;
      case "full":
        k = c(q, I);
        break;
      case "date":
        k = n(q, I);
        break;
      case "time":
        k = o(q, I);
        break;
      default:
        k = f(q, I);
        break;
    }
    w.dom.textContent = k, x !== "full" && (w.dom.title = c(q, I));
  }
  function i(w) {
    return this.dom = w, e(this), w.getAttribute(d) === "relative" && (s.add(this), r()), this;
  }
  i.prototype.render = function() {
    e(this);
  }, i.prototype.destroy = function() {
    s.delete(this), s.size === 0 && l(), delete this.dom[a];
  };
  function _(w) {
    const A = w[a];
    if (!A) return;
    w.getAttribute(d) === "relative" ? (s.add(A), r()) : (s.delete(A), s.size === 0 && l()), e(A);
  }
  function v(w) {
    w.nodeType === 1 && w.hasAttribute && w.hasAttribute(d) && w[a] && e(w[a]);
  }
  function E() {
    new MutationObserver(function() {
      const w = document.querySelectorAll("[" + d + "]");
      for (let A = 0; A < w.length; A++) {
        const L = w[A][a];
        L && e(L);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  H(d, a, i, "ln-time", {
    extraAttributes: ["datetime", "data-ln-time-locale", "lang"],
    onAttributeChange: _,
    onInit: v
  }), E();
})();
function Je(d) {
  d = d || {};
  let a = d.windowSize > 0 ? d.windowSize : 1e3, b = d.pageSize > 0 ? d.pageSize : 200, y = d.fetchDebounce != null ? d.fetchDebounce : 120;
  const g = typeof d.requestPage == "function" ? d.requestPage : function() {
  }, m = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
  let u = 0, r = 0, l = 0, h = null, c = 0;
  function f(t) {
    p.set(t, ++c);
  }
  function n() {
    if (m.size <= a) return;
    const t = Array.from(m.keys()).sort(function(i, _) {
      return (p.get(i) || 0) - (p.get(_) || 0);
    });
    let e = 0;
    for (; m.size > a && e < t.length; )
      m.delete(t[e]), p.delete(t[e]), e++;
  }
  function o(t, e, i) {
    s.add(t), g(t, e, i);
  }
  return {
    get logicalTotal() {
      return u;
    },
    set logicalTotal(t) {
      u = t;
    },
    get grandTotal() {
      return r;
    },
    set grandTotal(t) {
      r = t;
    },
    get queryGen() {
      return l;
    },
    set queryGen(t) {
      l = t;
    },
    get size() {
      return m.size;
    },
    getId: function(t) {
      if (m.has(t))
        return f(t), m.get(t);
    },
    // The caller asks for an exact range it already decided it needs — the
    // index is an id resolver, not a scroll surface. Prefetch padding is the
    // view's job (it owns the viewport); padding here would fetch a page
    // nobody asked for on top of every page the view asks for.
    ensure: function(t, e, i) {
      if (u <= 0) {
        s.has(0) || (clearTimeout(h), h = setTimeout(function() {
          o(0, b, i);
        }, y));
        return;
      }
      const _ = Math.max(0, t), v = Math.min(u, e), E = Math.floor(_ / b), w = Math.floor(Math.max(0, v - 1) / b);
      let A = -1;
      for (let L = E; L <= w; L++) {
        const q = L * b, x = Math.min(b, u - q);
        let I = !1;
        const k = Math.max(q, _), O = Math.min(q + x, v);
        for (let N = k; N < O; N++)
          if (!m.has(N)) {
            I = !0;
            break;
          }
        if (I && !s.has(q)) {
          A = q;
          break;
        }
      }
      A !== -1 && (clearTimeout(h), h = setTimeout(function() {
        o(A, b, i);
      }, y));
    },
    ingest: function(t, e, i, _, v) {
      if (!(v != null && v !== l)) {
        r = i ?? r, u = _ ?? u;
        for (let E = 0; E < e.length; E++)
          m.set(t + E, e[E]), f(t + E);
        s.delete(t), n();
      }
    },
    // Query change: new generation, positions dropped. The totals are kept
    // as the stale-while-revalidate carry-over the view renders against
    // until the new generation's first page lands in ingest() — same
    // contract as createWindowCache.invalidate().
    reset: function() {
      l++, m.clear(), p.clear(), s.clear(), clearTimeout(h);
    },
    clear: function() {
      m.clear(), p.clear(), s.clear(), clearTimeout(h);
    },
    configure: function(t) {
      if (t = t || {}, t.windowSize != null && t.windowSize > 0 && t.windowSize !== a) {
        const e = t.windowSize < a;
        a = t.windowSize, e && n();
      }
      t.pageSize != null && t.pageSize > 0 && (b = t.pageSize), t.fetchDebounce != null && t.fetchDebounce >= 0 && (y = t.fetchDebounce);
    }
  };
}
(function() {
  const d = "data-ln-data-store", a = "lnDataStore";
  if (window[a] !== void 0) return;
  const b = "ln_app_cache", y = "_meta", g = "1.0";
  let m = null, p = null;
  const s = {};
  function u(S) {
    S && S.name === "QuotaExceededError" && C(document, "ln-data-store:quota-exceeded", { error: S });
  }
  function r() {
    const S = {};
    for (const T of document.querySelectorAll(`[${d}]`)) {
      const D = T.id;
      if (D) {
        const M = T.getAttribute("data-ln-data-store-indexes") || "";
        S[D] = {
          indexes: M.split(",").map((R) => R.trim()).filter(Boolean)
        };
      }
    }
    return S;
  }
  function l() {
    return p || (p = new Promise((S) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), S(null);
      const T = r(), D = Object.keys(T), M = indexedDB.open(b);
      M.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), S(null);
      }, M.onsuccess = (R) => {
        const F = R.target.result, B = Array.from(F.objectStoreNames);
        if (!(!B.includes(y) || D.some((ot) => !B.includes(ot))))
          return h(F), m = F, S(F);
        const G = F.version;
        F.close();
        const Q = indexedDB.open(b, G + 1);
        Q.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, Q.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), S(null);
        }, Q.onupgradeneeded = (ot) => {
          const at = ot.target.result;
          at.objectStoreNames.contains(y) || at.createObjectStore(y, { keyPath: "key" });
          for (const Ut of D)
            if (!at.objectStoreNames.contains(Ut)) {
              const De = at.createObjectStore(Ut, { keyPath: "id" });
              for (const ne of T[Ut].indexes)
                De.createIndex(ne, ne, { unique: !1 });
            }
        }, Q.onsuccess = (ot) => {
          const at = ot.target.result;
          h(at), m = at, S(at);
        };
      };
    }), p);
  }
  function h(S) {
    S.onversionchange = () => {
      S.close(), m = null, p = null;
    };
  }
  function c() {
    return m ? Promise.resolve(m) : (p = null, l());
  }
  async function f(S) {
    if (!gt() || !S) return S;
    const T = { ...S }, D = T.id, M = await je(T);
    return !M || !M.encrypted ? S : {
      id: D,
      encrypted: !0,
      iv: M.iv,
      data: M.data
    };
  }
  async function n(S) {
    return !S || !S.encrypted || !gt() ? S : Ke(S);
  }
  const o = (S, T) => c().then((D) => D ? D.transaction(S, T).objectStore(S) : null);
  function t(S) {
    return new Promise((T, D) => {
      S.onsuccess = () => T(S.result), S.onerror = () => {
        u(S.error), D(S.error);
      };
    });
  }
  const e = (S) => o(S, "readonly").then((T) => T ? t(T.getAll()) : []).then((T) => gt() ? Promise.all(T.map((D) => n(D))) : T), i = (S, T) => o(S, "readonly").then((D) => D ? t(D.get(T)) : null).then((D) => D ? n(D) : null), _ = (S, T) => c().then((D) => {
    if (!D) return [];
    const R = D.transaction(S, "readonly").objectStore(S), F = T.map((B) => t(R.get(B)));
    return Promise.all(F).then((B) => gt() ? Promise.all(B.map((V) => n(V))) : B);
  }), v = (S, T) => (gt() ? f(T) : Promise.resolve(T)).then((M) => o(S, "readwrite").then((R) => R ? t(R.put(M)) : null)), E = (S, T) => o(S, "readwrite").then((D) => D ? t(D.delete(T)) : null), w = (S) => o(S, "readwrite").then((T) => T ? t(T.clear()) : null), A = (S) => o(S, "readonly").then((T) => T ? t(T.count()) : 0), L = (S) => o(y, "readonly").then((T) => T ? t(T.get(S)) : null), q = (S, T) => o(y, "readwrite").then((D) => {
    if (D)
      return T.key = S, t(D.put(T));
  });
  function x(S) {
    this.dom = S, this._name = S.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", S);
    const T = S.getAttribute("data-ln-data-store-stale"), D = parseInt(T, 10);
    this._staleThreshold = T === "never" || T === "-1" ? -1 : isNaN(D) ? 300 : D;
    const M = S.getAttribute("data-ln-data-store-search-fields") || "";
    this._searchFields = M.split(",").map((F) => F.trim()).filter(Boolean), this._handlers = null, this.isLoaded = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null };
    const R = S.getAttribute("data-ln-data-store-window");
    if (R !== null) {
      const F = parseInt(R, 10) || 1e3, B = parseInt(S.getAttribute("data-ln-data-store-window-page"), 10) || 200;
      this._windowIndex = Je({
        windowSize: F,
        pageSize: B,
        requestPage: (V, G, Q) => {
          C(this.dom, "ln-data-store:request-page", {
            store: this._name,
            offset: V,
            limit: G,
            query: Q,
            queryGen: this._windowIndex.queryGen
          });
        }
      });
    } else
      this._windowIndex = null;
    return this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), s[this._name] = this, I(this), this.ready = et(this), this;
  }
  function I(S) {
    S._handlers = {
      create: (T) => k(S, "create", T.detail, () => N(S, T.detail)),
      update: (T) => k(S, "update", T.detail, () => j(S, T.detail)),
      delete: (T) => k(S, "delete", T.detail, () => U(S, T.detail)),
      "bulk-delete": (T) => k(S, "bulk-delete", T.detail, () => K(S, T.detail)),
      "sync-failed": (T) => {
        S.isSyncing = !1, C(S.dom, "ln-data-store:sync-error", {
          store: S._name,
          error: T.detail && T.detail.error,
          status: T.detail && T.detail.status
        });
      }
    };
    for (const [T, D] of Object.entries(S._handlers))
      S.dom.addEventListener(`ln-data-store:request-${T}`, D);
    S._queryHandlers = {
      "ln-search:change": (T) => {
        T.preventDefault();
        const D = T.detail && T.detail.term != null ? T.detail.term : "";
        D !== S.query.search && (S.query.search = D, Z(S));
      },
      "ln-filter:changed": (T) => {
        const D = T.detail && T.detail.key;
        if (!D) return;
        const M = (T.detail.values || []).slice(), R = S.query.filters[D];
        (R ? R.length === M.length && R.every((B, V) => B === M[V]) : !M.length) || (M.length ? S.query.filters[D] = M : delete S.query.filters[D], Z(S));
      },
      "ln-sort:change": (T) => {
        T.preventDefault();
        const D = T.detail && T.detail.field, M = T.detail && T.detail.direction, R = M && M !== "none" ? { field: D, direction: M } : null, F = S.query.sort;
        !F && !R || F && R && F.field === R.field && F.direction === R.direction || (S.query.sort = R, Z(S));
      }
    };
    for (const [T, D] of Object.entries(S._queryHandlers))
      S.dom.addEventListener(T, D);
  }
  function k(S, T, D, M) {
    const R = D && D.requestId;
    return S._mutationChain = S._mutationChain.then(() => S.ready).then(() => {
      if (S.initializationError) throw S.initializationError;
      return M();
    }).catch((F) => z(S, T, R, F)), S._mutationChain;
  }
  function O(S) {
    return A(S._name).then((T) => (S.totalCount = T, S.hasCache = !0, S.isLoaded = !0, q(S._name, {
      schema_version: g,
      last_synced_at: S.lastSyncedAt,
      has_cache: !0,
      record_count: T
    })));
  }
  function N(S, { tempId: T, data: D = {}, requestId: M } = {}) {
    const R = { ...D, id: T };
    return v(S._name, R).then(() => O(S)).then(() => {
      C(S.dom, "ln-data-store:created", { store: S._name, record: R, tempId: T, requestId: M });
    });
  }
  function j(S, { id: T, data: D = {}, requestId: M } = {}) {
    return i(S._name, T).then((R) => {
      if (!R) throw new Error(`Record not found: ${T}`);
      const F = { ...R, ...D }, B = D.id;
      return (B !== void 0 && B !== T ? X(S._name, T, F) : v(S._name, F)).then(() => O(S)).then(() => {
        C(S.dom, "ln-data-store:updated", { store: S._name, record: F, previous: R, requestId: M });
      });
    });
  }
  function U(S, { id: T, requestId: D } = {}) {
    return i(S._name, T).then((M) => {
      if (!M) {
        C(S.dom, "ln-data-store:deleted", { store: S._name, id: T, requestId: D, missing: !0 });
        return;
      }
      return E(S._name, T).then(() => O(S)).then(() => {
        C(S.dom, "ln-data-store:deleted", { store: S._name, id: T, requestId: D });
      });
    });
  }
  function K(S, { ids: T = [], requestId: D } = {}) {
    return T.length ? Promise.all(T.map((M) => i(S._name, M))).then((M) => {
      const R = M.filter(Boolean).map((F) => F.id);
      return W(S._name, R).then(() => O(S)).then(() => {
        C(S.dom, "ln-data-store:deleted", { store: S._name, ids: R, requestId: D });
      });
    }) : (C(S.dom, "ln-data-store:deleted", { store: S._name, ids: [], requestId: D }), Promise.resolve());
  }
  function z(S, T, D, M) {
    console.error("[ln-data-store] " + T + " failed:", M), C(S.dom, "ln-data-store:mutation-error", {
      store: S._name,
      action: T,
      requestId: D,
      error: M
    });
  }
  function et(S) {
    return l().then((T) => {
      if (!T) throw new Error("IndexedDB is unavailable");
      return L(S._name);
    }).then((T) => {
      if (S.initializationError = null, T && T.schema_version === g)
        S.lastSyncedAt = T.last_synced_at || null, S.totalCount = T.record_count || 0, S.hasCache = T.has_cache === !0 || S.totalCount > 0, S.hasCache && (S.isLoaded = !0, C(S.dom, "ln-data-store:ready", { store: S._name, count: S.totalCount, source: "cache" })), S.isInitialized = !0, C(S.dom, "ln-data-store:initialized", { store: S._name, hasCache: S.hasCache, lastSyncedAt: S.lastSyncedAt, count: S.totalCount });
      else {
        if (T && T.schema_version !== g)
          return w(S._name).then(() => q(S._name, { schema_version: g, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            S.isInitialized = !0, S.hasCache = !1, C(S.dom, "ln-data-store:initialized", { store: S._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        S.isInitialized = !0, S.hasCache = !1, C(S.dom, "ln-data-store:initialized", { store: S._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((T) => (S.isInitialized = !0, S.isLoaded = !1, S.hasCache = !1, S.isSyncing = !1, S.initializationError = T, C(S.dom, "ln-data-store:initialization-error", { store: S._name, error: T }), { ok: !1, error: T }));
  }
  function St(S) {
    S.isSyncing = !0, C(S.dom, "ln-data-store:request-remote-sync", { since: S.lastSyncedAt });
  }
  function P(S, T) {
    return c().then((D) => D ? (gt() ? Promise.all(T.map((R) => f(R))) : Promise.resolve(T)).then((R) => new Promise((F, B) => {
      const V = D.transaction(S, "readwrite"), G = V.objectStore(S);
      R.forEach((Q) => G.put(Q)), V.oncomplete = () => F(), V.onerror = () => {
        u(V.error), B(V.error);
      };
    })) : void 0);
  }
  function W(S, T) {
    return c().then((D) => {
      if (D)
        return new Promise((M, R) => {
          const F = D.transaction(S, "readwrite"), B = F.objectStore(S);
          T.forEach((V) => B.delete(V)), F.oncomplete = () => M(), F.onerror = () => R(F.error);
        });
    });
  }
  function X(S, T, D) {
    return (gt() ? f(D) : Promise.resolve(D)).then((R) => c().then((F) => {
      if (F)
        return new Promise((B, V) => {
          const G = F.transaction(S, "readwrite"), Q = G.objectStore(S);
          Q.put(R), Q.delete(T), G.oncomplete = () => B(), G.onerror = () => {
            u(G.error), V(G.error);
          };
        });
    }));
  }
  const Ct = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function ht(S, T) {
    if (!T || !T.field) return S;
    const { field: D, direction: M } = T, R = M === "desc";
    return [...S].sort((F, B) => {
      const V = F[D], G = B[D];
      if (V == null && G == null) return 0;
      if (V == null) return R ? 1 : -1;
      if (G == null) return R ? -1 : 1;
      const Q = typeof V == "string" && typeof G == "string" ? Ct.compare(V, G) : V < G ? -1 : V > G ? 1 : 0;
      return R ? -Q : Q;
    });
  }
  function it(S, T) {
    if (!T) return S;
    const D = Object.keys(T).filter((M) => Array.isArray(T[M]) && T[M].length > 0);
    return D.length ? S.filter(
      (M) => D.every((R) => T[R].map(String).includes(String(M[R])))
    ) : S;
  }
  function Lt(S, T, D) {
    if (!T || !D || !D.length) return S;
    const M = T.toLowerCase();
    return S.filter(
      (R) => D.some((F) => {
        const B = R[F];
        return B != null && String(B).toLowerCase().includes(M);
      })
    );
  }
  function ft(S, T, D) {
    if (!S.length) return 0;
    if (D === "count") return S.length;
    const M = S.map((F) => parseFloat(F[T])).filter((F) => !isNaN(F)), R = M.reduce((F, B) => F + B, 0);
    return D === "sum" ? R : D === "avg" && M.length ? R / M.length : 0;
  }
  function ct(S, T) {
    if (!S.presenters || !S.presenters.computed) return T;
    const D = S.presenters.computed;
    return T.map((M) => {
      if (!M) return null;
      const R = { ...M };
      for (const [F, B] of Object.entries(D))
        try {
          R[F] = B(M);
        } catch (V) {
          console.error(`[ln-data-store] Decorator computed field failed for ${F}`, V);
        }
      return R;
    });
  }
  x.prototype.getAll = function(S = {}) {
    const T = this;
    if (T._windowIndex) {
      const D = S.offset || 0, M = S.limit || 200;
      T._windowIndex.ensure(D, D + M, S);
      const R = [];
      for (let B = D; B < D + M; B++) {
        const V = T._windowIndex.getId(B);
        R.push(V);
      }
      const F = Array.from(new Set(R.filter((B) => B !== void 0)));
      return _(T._name, F).then((B) => {
        const V = /* @__PURE__ */ new Map();
        for (let Q = 0; Q < B.length; Q++) {
          const ot = B[Q];
          ot && V.set(String(ot.id), ot);
        }
        const G = [];
        for (let Q = 0; Q < R.length; Q++) {
          const ot = R[Q];
          if (ot === void 0)
            G.push(null);
          else {
            const at = V.get(String(ot));
            G.push(at || null);
          }
        }
        return {
          data: ct(T, G),
          total: T._windowIndex.grandTotal,
          filtered: T._windowIndex.logicalTotal,
          offset: D,
          queryGen: T._windowIndex.queryGen
        };
      });
    }
    return e(T._name).then((D) => {
      const M = D.length;
      S.filters && (D = it(D, S.filters)), S.search && (D = Lt(D, S.search, T._searchFields));
      const R = D.length;
      if (S.sort && (D = ht(D, S.sort)), S.offset || S.limit) {
        const F = S.offset || 0, B = S.limit || D.length;
        D = D.slice(F, F + B);
      }
      return {
        data: ct(T, D),
        total: M,
        filtered: R
      };
    });
  }, x.prototype.getById = function(S) {
    return i(this._name, S).then((T) => T ? ct(this, [T])[0] : null);
  }, x.prototype.count = function(S) {
    return S ? e(this._name).then((T) => it(T, S).length) : A(this._name);
  }, x.prototype.aggregate = function(S, T) {
    return e(this._name).then((D) => ft(D, S, T));
  }, x.prototype.setPresenters = function(S) {
    this.presenters = S;
  }, x.prototype.applySync = function(S, T, D, M) {
    M = M || {};
    const R = this;
    if (R._windowIndex && M.queryGen != null && M.queryGen !== R._windowIndex.queryGen)
      return Promise.resolve();
    S.length > 0 || T.length > 0;
    let F = Promise.resolve();
    return S.length > 0 && (F = F.then(() => P(R._name, S))), T.length > 0 && (F = F.then(() => W(R._name, T))), F.then(() => {
      if (R._windowIndex && (M.offset != null || M.total != null)) {
        const B = M.offset != null ? M.offset : 0, V = S.map((G) => G.id);
        R._windowIndex.ingest(B, V, M.total, M.filtered, M.queryGen);
      }
    }).then(() => A(R._name)).then((B) => (R.totalCount = M.total !== void 0 ? M.total : B, R.hasCache = !0, q(R._name, {
      schema_version: g,
      last_synced_at: D,
      has_cache: !0,
      record_count: R.totalCount
    }))).then(() => {
      const B = !R.isLoaded;
      R.isLoaded = !0, R.isSyncing = !1, R.lastSyncedAt = D, B ? (C(R.dom, "ln-data-store:loaded", { store: R._name, count: R.totalCount, meta: M }), C(R.dom, "ln-data-store:ready", { store: R._name, count: R.totalCount, source: "server", meta: M })) : C(R.dom, "ln-data-store:synced", {
        store: R._name,
        added: S.length,
        deleted: T.length,
        changed: !0,
        meta: M
      });
    }).catch((B) => {
      R.isSyncing = !1, console.error("[ln-data-store] applySync failed:", B);
    });
  }, x.prototype.applyQuery = function(S, T) {
    T = T || {};
    const D = this;
    let M = Promise.resolve();
    return S.length > 0 && (M = M.then(() => P(D._name, S))), M.then(() => A(D._name)).then((R) => (D.totalCount = T.total !== void 0 ? T.total : R, ct(D, S))).catch((R) => (console.error("[ln-data-store] applyQuery failed:", R), []));
  }, x.prototype.forceSync = function() {
    this.isSyncing || St(this);
  }, x.prototype.fullReload = function() {
    const S = this;
    return w(S._name).then(() => q(S._name, {
      schema_version: g,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      S.isLoaded = !1, S.hasCache = !1, S.lastSyncedAt = null, S.totalCount = 0, St(S);
    });
  }, x.prototype.destroy = function() {
    if (this._windowIndex && (this._windowIndex.clear(), this._windowIndex = null), this._handlers) {
      for (const [S, T] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${S}`, T);
      this._handlers = null;
    }
    if (this._queryHandlers) {
      for (const [S, T] of Object.entries(this._queryHandlers))
        this.dom.removeEventListener(S, T);
      this._queryHandlers = null;
    }
    delete s[this._name], delete this.dom[a], C(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function kt() {
    return c().then((S) => {
      if (!S) return;
      const T = Array.from(S.objectStoreNames);
      return new Promise((D, M) => {
        const R = S.transaction(T, "readwrite");
        T.forEach((F) => R.objectStore(F).clear()), R.oncomplete = () => D(), R.onerror = () => M(R.error);
      });
    }).then(() => {
      Object.values(s).forEach((S) => {
        S.isLoaded = !1, S.isInitialized = !1, S.initializationError = null, S.hasCache = !1, S.isSyncing = !1, S.lastSyncedAt = null, S.totalCount = 0;
      });
    });
  }
  function Z(S) {
    S._windowIndex && S._windowIndex.reset(), C(S.dom, "ln-data-store:query-changed", {
      store: S._name,
      query: {
        filters: Object.assign({}, S.query.filters),
        search: S.query.search,
        sort: S.query.sort ? Object.assign({}, S.query.sort) : null
      }
    });
  }
  H(d, a, x, "ln-data-store"), window[a].clearAll = kt, window[a].init = window[a], window[a].setStorageKey = oe, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = oe);
})();
(function() {
  const d = "data-ln-api-connector", a = "lnApiConnector", b = "lnConnector";
  if (window[a] !== void 0) return;
  function y(s) {
    return s.ok ? s.status === 204 ? null : s.json() : s.json().catch(() => null).then((u) => {
      const r = new Error("HTTP " + s.status + ": " + s.statusText);
      throw r.status = s.status, r.data = u, r;
    });
  }
  function g(s) {
    return this.dom = s, s[a] = this, s[b] = this, this._inflight = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, m(this), this;
  }
  g.prototype.refreshConfig = function() {
    const s = this.dom;
    this.baseUrl = s.getAttribute("data-ln-api-base-url") || "", this.path = s.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin", this.paramKeys = {
      offset: s.getAttribute("data-ln-api-param-offset") || "offset",
      limit: s.getAttribute("data-ln-api-param-limit") || "limit",
      search: s.getAttribute("data-ln-api-param-search") || "search",
      sortField: s.getAttribute("data-ln-api-param-sort-field") || "sort_field",
      sortDir: s.getAttribute("data-ln-api-param-sort-dir") || "sort_dir"
    };
    const u = s.getAttribute("data-ln-api-headers") || "";
    this.headers = ge(u, "ln-api-connector"), (u.toLowerCase().includes("authorization") || u.toLowerCase().includes("bearer") || u.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), C(s, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, g.prototype._reqHeaders = function(s) {
    const u = Object.assign({}, Et(this.headers), { "X-LN-Response": "data" });
    return s && (u["Idempotency-Key"] = s), u;
  }, g.prototype.fetchDelta = function(s, u) {
    const r = this;
    let l = tt(r.baseUrl, r.path);
    s != null && s !== "" && (l += (l.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(s));
    const h = u || "sync";
    r._inflight.has(h) && r._inflight.get(h).abort();
    const c = new AbortController();
    return r._inflight.set(h, c), window.fetch(l, {
      method: "GET",
      headers: r._reqHeaders(),
      credentials: r.credentials,
      signal: c.signal
    }).then(y).finally(function() {
      r._inflight.get(h) === c && r._inflight.delete(h);
    });
  }, g.prototype.query = function(s, u) {
    const r = this;
    s = s || {};
    let l = tt(r.baseUrl, r.path);
    const h = r.paramKeys || {
      offset: "offset",
      limit: "limit",
      search: "search",
      sortField: "sort_field",
      sortDir: "sort_dir"
    }, c = new URLSearchParams();
    s.search && c.append(h.search, s.search), s.offset != null && c.append(h.offset, s.offset), s.limit != null && c.append(h.limit, s.limit), s.sort && s.sort.field && s.sort.direction && (c.append(h.sortField, s.sort.field), c.append(h.sortDir, s.sort.direction)), s.filters && typeof s.filters == "object" && Object.keys(s.filters).forEach((e) => {
      const i = s.filters[e];
      Array.isArray(i) && i.length > 0 && c.append(e, i.join(","));
    });
    const f = c.toString();
    f && (l += (l.indexOf("?") !== -1 ? "&" : "?") + f);
    let n = null;
    u && (r._inflight.has(u) && r._inflight.get(u).abort(), n = new AbortController(), r._inflight.set(u, n));
    const o = {
      method: "GET",
      headers: r._reqHeaders(),
      credentials: r.credentials
    };
    n && (o.signal = n.signal);
    let t = window.fetch(l, o).then(y);
    return u && n && (t = t.finally(function() {
      r._inflight.get(u) === n && r._inflight.delete(u);
    })), t;
  }, g.prototype.create = function(s, u, r) {
    const l = this;
    return window.fetch(tt(l.baseUrl, u || l.path), {
      method: "POST",
      headers: l._reqHeaders(r),
      credentials: l.credentials,
      body: JSON.stringify(s)
    }).then(y);
  }, g.prototype.update = function(s, u, r, l, h) {
    const c = this;
    r != null && (u = Object.assign({}, u, { expected_version: r }));
    const f = l ? tt(c.baseUrl, l) : tt(c.baseUrl, c.path, s);
    return window.fetch(f, {
      method: "PUT",
      headers: c._reqHeaders(h),
      credentials: c.credentials,
      body: JSON.stringify(u)
    }).then(y);
  }, g.prototype.delete = function(s, u, r) {
    const l = this;
    return window.fetch(tt(l.baseUrl, u || l.path, s), {
      method: "DELETE",
      headers: l._reqHeaders(r),
      credentials: l.credentials
    }).then(y);
  }, g.prototype.bulkDelete = function(s, u, r) {
    const l = this;
    return window.fetch(tt(l.baseUrl, u || l.path) + "/bulk-delete", {
      method: "DELETE",
      headers: l._reqHeaders(r),
      credentials: l.credentials,
      body: JSON.stringify({ ids: s })
    }).then(y);
  };
  function m(s) {
    s._handlers = {
      sync: function(r) {
        const l = r.detail || {}, h = l.meta && l.meta.targetEl ? l.meta.targetEl : null;
        s.fetchDelta(l.since, h).then(function(c) {
          C(s.dom, "ln-api-connector:fetched", { data: c, since: l.since, meta: l.meta || null });
        }).catch(function(c) {
          c && c.name === "AbortError" || C(s.dom, "ln-api-connector:error", {
            action: "sync",
            error: c.message,
            status: c.status || 0,
            data: c.data || null,
            since: l.since,
            meta: l.meta || null
          });
        });
      },
      query: function(r) {
        const l = r.detail || {}, h = l.query || l, c = l.meta && l.meta.targetEl ? l.meta.targetEl : null;
        s.query(h, c).then(function(f) {
          const n = f || {};
          C(s.dom, "ln-api-connector:fetched", {
            data: n.data || (Array.isArray(n) ? n : []),
            total: n.total,
            filtered: n.filtered,
            offset: h.offset,
            queryGen: h.queryGen,
            meta: l.meta || null
          });
        }).catch(function(f) {
          f && f.name === "AbortError" || C(s.dom, "ln-api-connector:error", {
            action: "query",
            error: f.message,
            status: f.status || 0,
            data: f.data || null,
            meta: l.meta || null
          });
        });
      },
      create: function(r) {
        const l = r.detail || {};
        s.create(l.data, l.url, l.idempotencyKey).then(function(h) {
          const c = h && h.content !== void 0 ? h.content : h, f = h && h.message ? h.message : null;
          C(s.dom, "ln-api-connector:created", { record: c, tempId: l.tempId, message: f, meta: l.meta || null });
        }).catch(function(h) {
          C(s.dom, "ln-api-connector:error", {
            action: "create",
            error: h.message,
            status: h.status || 0,
            data: h.data || null,
            tempId: l.tempId,
            meta: l.meta || null
          });
        });
      },
      update: function(r) {
        const l = r.detail || {};
        s.update(l.id, l.data, l.expected_version, l.url, l.idempotencyKey).then(function(h) {
          const c = h && h.content !== void 0 ? h.content : h, f = h && h.message ? h.message : null;
          C(s.dom, "ln-api-connector:updated", { record: c, id: l.id, message: f, meta: l.meta || null });
        }).catch(function(h) {
          C(s.dom, "ln-api-connector:error", {
            action: "update",
            error: h.message,
            status: h.status || 0,
            data: h.data || null,
            id: l.id,
            conflictData: h.status === 409 ? h.data : null,
            meta: l.meta || null
          });
        });
      },
      delete: function(r) {
        const l = r.detail || {};
        s.delete(l.id, l.url, l.idempotencyKey).then(function(h) {
          const c = h && h.message ? h.message : null;
          C(s.dom, "ln-api-connector:deleted", { response: h, id: l.id, message: c, meta: l.meta || null });
        }).catch(function(h) {
          C(s.dom, "ln-api-connector:error", {
            action: "delete",
            error: h.message,
            status: h.status || 0,
            data: h.data || null,
            id: l.id,
            meta: l.meta || null
          });
        });
      },
      bulkDelete: function(r) {
        const l = r.detail || {};
        s.bulkDelete(l.ids, l.url, l.idempotencyKey).then(function(h) {
          const c = h && h.message ? h.message : null;
          C(s.dom, "ln-api-connector:bulk-deleted", { response: h, ids: l.ids, message: c, meta: l.meta || null });
        }).catch(function(h) {
          C(s.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: h.message,
            status: h.status || 0,
            data: h.data || null,
            ids: l.ids,
            meta: l.meta || null
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(r) {
      s.dom.addEventListener(r + ":request-sync", s._handlers.sync), s.dom.addEventListener(r + ":request-query", s._handlers.query), s.dom.addEventListener(r + ":request-fetch", s._handlers.query), s.dom.addEventListener(r + ":request-create", s._handlers.create), s.dom.addEventListener(r + ":request-update", s._handlers.update), s.dom.addEventListener(r + ":request-delete", s._handlers.delete), s.dom.addEventListener(r + ":request-bulk-delete", s._handlers.bulkDelete);
    });
  }
  g.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const s = this;
    s._inflight && (s._inflight.forEach(function(u) {
      u.abort();
    }), s._inflight.clear()), s._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(r) {
      s.dom.removeEventListener(r + ":request-sync", s._handlers.sync), s.dom.removeEventListener(r + ":request-query", s._handlers.query), s.dom.removeEventListener(r + ":request-fetch", s._handlers.query), s.dom.removeEventListener(r + ":request-create", s._handlers.create), s.dom.removeEventListener(r + ":request-update", s._handlers.update), s.dom.removeEventListener(r + ":request-delete", s._handlers.delete), s.dom.removeEventListener(r + ":request-bulk-delete", s._handlers.bulkDelete);
    }), s._handlers = null), C(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[a], delete this.dom[b];
  };
  function p(s) {
    const u = s[a];
    u && u.refreshConfig();
  }
  H(d, a, g, "ln-api-connector", {
    extraAttributes: [
      "data-ln-api-base-url",
      "data-ln-api-path",
      "data-ln-api-headers",
      "data-ln-api-param-offset",
      "data-ln-api-param-limit",
      "data-ln-api-param-search",
      "data-ln-api-param-sort-field",
      "data-ln-api-param-sort-dir"
    ],
    onAttributeChange: p
  });
})();
(function() {
  const d = "data-ln-couchdb-connector", a = "lnCouchDbConnector", b = "lnConnector";
  if (window[a] !== void 0) return;
  function y(c) {
    const f = c && c.content !== void 0 ? c.content : c, n = c && c.message ? c.message : null;
    return { content: f, message: n };
  }
  function g(c) {
    return this.dom = c, c[a] = this, c[b] = this, this.refreshConfig(), this._handlers = null, l(this), this;
  }
  g.prototype.refreshConfig = function() {
    const c = this.dom;
    this.url = c.getAttribute("data-ln-couchdb-url") || "", this.db = c.getAttribute("data-ln-couchdb-db") || "", this.auth = c.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const f = c.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = ge(f, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), f.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), C(c, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function m(c, f, n) {
    const o = Object.assign({}, Et(c.headers, c.auth), n || {});
    return f && (o["Idempotency-Key"] = f), o;
  }
  g.prototype.fetchDelta = function(c) {
    const f = this, n = ["include_docs=true", "feed=normal"];
    c && n.push("since=" + encodeURIComponent(c));
    const o = tt(f.url, f.db, "_changes") + "?" + n.join("&");
    return window.fetch(o, { method: "GET", headers: Et(f.headers, f.auth), credentials: f.credentials }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const e = t.results || [];
      return {
        data: e.filter((i) => !i.deleted && i.doc).map((i) => Object.assign({}, i.doc, { id: i.doc._id })),
        deleted: e.filter((i) => i.deleted).map((i) => i.id),
        synced_at: t.last_seq || c || ""
      };
    });
  };
  function p(c, f, n) {
    const o = Object.assign({ _id: f.id }, f);
    return o._id || delete o._id, window.fetch(tt(c.url, c.db), {
      method: "POST",
      headers: m(c, n),
      credentials: c.credentials,
      body: JSON.stringify(o)
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const e = y(t), i = e.content;
      return { record: Object.assign({}, o, { id: i.id, _id: i.id, _rev: i.rev }), message: e.message };
    });
  }
  g.prototype.create = function(c, f) {
    return p(this, c, f).then((n) => n.record);
  };
  function s(c, f, n, o) {
    const t = Object.assign({ id: String(f), _id: String(f) }, n), e = t._rev || t.rev;
    return (e ? Promise.resolve(e) : window.fetch(tt(c.url, c.db, null, f), { method: "GET", headers: Et(c.headers, c.auth), credentials: c.credentials }).then((_) => {
      if (!_.ok) throw new Error("Could not retrieve document for revision mapping");
      return _.json().then((v) => v._rev);
    })).then((_) => {
      const v = Object.assign({}, t, { _rev: _ });
      delete v.rev;
      const E = m(c, o, { "If-Match": _ });
      return window.fetch(tt(c.url, c.db, null, f), {
        method: "PUT",
        headers: E,
        credentials: c.credentials,
        body: JSON.stringify(v)
      }).then((w) => {
        if (w.ok) return w.json().then((A) => {
          const L = y(A);
          return { record: Object.assign({}, v, { _rev: L.content.rev }), message: L.message };
        });
        if (w.status === 409) return w.json().then((A) => {
          const L = new Error("Conflict");
          throw L.status = 409, L.data = A, L;
        });
        throw new Error("HTTP " + w.status + ": " + w.statusText);
      });
    });
  }
  g.prototype.update = function(c, f, n) {
    return s(this, c, f, n).then((o) => o.record);
  };
  function u(c, f, n, o) {
    return (n ? Promise.resolve(n) : window.fetch(tt(c.url, c.db, null, f), { method: "GET", headers: Et(c.headers, c.auth), credentials: c.credentials }).then((e) => {
      if (!e.ok) throw new Error("Could not retrieve document for revision delete");
      return e.json().then((i) => i._rev);
    })).then((e) => {
      const i = tt(c.url, c.db, null, f) + "?rev=" + encodeURIComponent(e);
      return window.fetch(i, { method: "DELETE", headers: m(c, o), credentials: c.credentials }).then((_) => {
        if (!_.ok) throw new Error("HTTP " + _.status + ": " + _.statusText);
        return _.json();
      }).then((_) => {
        const v = y(_);
        return { response: v.content, message: v.message };
      });
    });
  }
  g.prototype.delete = function(c, f, n) {
    return u(this, c, f, n).then((o) => o.response);
  };
  function r(c, f, n) {
    return !f || f.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(tt(c.url, c.db, "_all_docs"), {
      method: "POST",
      headers: Et(c.headers, c.auth),
      credentials: c.credentials,
      body: JSON.stringify({ keys: f })
    }).then((o) => {
      if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
      return o.json();
    }).then((o) => {
      const e = (o.rows || []).filter((i) => !i.error && i.value && i.value.rev).map((i) => ({ _id: i.id, _rev: i.value.rev, _deleted: !0 }));
      return e.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(tt(c.url, c.db, "_bulk_docs"), {
        method: "POST",
        headers: m(c, n),
        credentials: c.credentials,
        body: JSON.stringify({ docs: e })
      }).then((i) => {
        if (!i.ok) throw new Error("HTTP " + i.status + ": " + i.statusText);
        return i.json();
      }).then((i) => {
        const _ = y(i);
        return { response: { ok: !0, results: _.content, deletedCount: e.length }, message: _.message };
      });
    });
  }
  g.prototype.bulkDelete = function(c, f) {
    return r(this, c, f).then((n) => n.response);
  };
  function l(c) {
    c._handlers = {
      sync: function(n) {
        const o = n.detail || {};
        c.fetchDelta(o.since).then(function(t) {
          C(c.dom, "ln-couchdb-connector:fetched", { data: t, since: o.since, meta: o.meta || null });
        }).catch(function(t) {
          C(c.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: t.message,
            status: t.status || 0,
            since: o.since,
            meta: o.meta || null
          });
        });
      },
      create: function(n) {
        const o = n.detail || {};
        p(c, o.data, o.idempotencyKey).then(function(t) {
          C(c.dom, "ln-couchdb-connector:created", { record: t.record, tempId: o.tempId, message: t.message, meta: o.meta || null });
        }).catch(function(t) {
          C(c.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: t.message,
            status: t.status || 0,
            tempId: o.tempId,
            meta: o.meta || null
          });
        });
      },
      update: function(n) {
        const o = n.detail || {}, t = Object.assign({}, o.data);
        o.expected_version !== void 0 && (t._rev = o.expected_version), s(c, o.id, t, o.idempotencyKey).then(function(e) {
          C(c.dom, "ln-couchdb-connector:updated", { record: e.record, id: o.id, message: e.message, meta: o.meta || null });
        }).catch(function(e) {
          C(c.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: e.message,
            status: e.status || 0,
            id: o.id,
            data: e.status === 409 ? e.data : null,
            conflictData: e.status === 409 ? e.data : null,
            meta: o.meta || null
          });
        });
      },
      delete: function(n) {
        const o = n.detail || {};
        u(c, o.id, o.rev, o.idempotencyKey).then(function(t) {
          C(c.dom, "ln-couchdb-connector:deleted", { response: t.response, id: o.id, message: t.message, meta: o.meta || null });
        }).catch(function(t) {
          C(c.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: t.message,
            status: t.status || 0,
            id: o.id,
            meta: o.meta || null
          });
        });
      },
      bulkDelete: function(n) {
        const o = n.detail || {};
        r(c, o.ids, o.idempotencyKey).then(function(t) {
          C(c.dom, "ln-couchdb-connector:bulk-deleted", { response: t.response, ids: o.ids, message: t.message, meta: o.meta || null });
        }).catch(function(t) {
          C(c.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: t.message,
            status: t.status || 0,
            ids: o.ids,
            meta: o.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(n) {
      c.dom.addEventListener(n + ":request-sync", c._handlers.sync), c.dom.addEventListener(n + ":request-fetch", c._handlers.sync), c.dom.addEventListener(n + ":request-create", c._handlers.create), c.dom.addEventListener(n + ":request-update", c._handlers.update), c.dom.addEventListener(n + ":request-delete", c._handlers.delete), c.dom.addEventListener(n + ":request-bulk-delete", c._handlers.bulkDelete);
    });
  }
  g.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const c = this;
    c._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(n) {
      c.dom.removeEventListener(n + ":request-sync", c._handlers.sync), c.dom.removeEventListener(n + ":request-fetch", c._handlers.sync), c.dom.removeEventListener(n + ":request-create", c._handlers.create), c.dom.removeEventListener(n + ":request-update", c._handlers.update), c.dom.removeEventListener(n + ":request-delete", c._handlers.delete), c.dom.removeEventListener(n + ":request-bulk-delete", c._handlers.bulkDelete);
    }), c._handlers = null), C(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[a], delete this.dom[b];
  };
  function h(c) {
    const f = c[a];
    f && f.refreshConfig();
  }
  H(d, a, g, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: h
  });
})();
function Ze(d) {
  return d = d || {}, {
    sort: d.sort,
    filters: d.filters,
    search: d.search,
    offset: d.offset,
    limit: d.limit,
    queryGen: d.queryGen
  };
}
function Vt(d, a) {
  const b = !d || !!d.initializationError;
  return a && (b || !d.isLoaded) ? "remote" : d && !d.initializationError ? "store" : "none";
}
function le(d, a) {
  const b = Object.assign({}, d);
  return a && (b.filters = a.filters, b.search = a.search, b.sort = a.sort), b;
}
class tn {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(a) {
    return new Promise((b, y) => {
      this._pending.set(a, { resolve: b, reject: y });
    });
  }
  resolve(a) {
    return this._settle(a, !1);
  }
  reject(a) {
    return this._settle(a, !0);
  }
  close(a) {
    const b = a || new Error("Mutation receipt registry closed");
    for (const y of this._pending.values()) y.reject(b);
    this._pending.clear();
  }
  _settle(a, b) {
    const y = a && a.requestId;
    if (!y) return !1;
    const g = this._pending.get(y);
    return g ? (this._pending.delete(y), b ? g.reject(a.error || new Error("Store mutation failed")) : g.resolve(a), !0) : !1;
  }
}
(function() {
  const d = "data-ln-data-coordinator", a = "lnDataCoordinator", b = "lnCoordinator", y = "data-ln-form-scope";
  if (window[a] !== void 0) return;
  const g = /* @__PURE__ */ new Set();
  let m = !1, p = null, s = null, u = null;
  function r() {
    m || (m = !0, p = function() {
      C(document, "ln-data-store:online", {}), g.forEach(function(t) {
        t._maybeSync();
      });
    }, s = function() {
      C(document, "ln-data-store:offline", {});
    }, u = function() {
      document.visibilityState === "visible" && g.forEach(function(t) {
        const e = t.findChildren(), i = e.store;
        i && e.connector && i.isInitialized && !i.initializationError && !i.isSyncing && !t._noAutosync && (!i.hasCache || t._isStale()) && i.forceSync();
      });
    }, window.addEventListener("online", p), window.addEventListener("offline", s), document.addEventListener("visibilitychange", u));
  }
  function l() {
    m && (g.size > 0 || (window.removeEventListener("online", p), window.removeEventListener("offline", s), document.removeEventListener("visibilitychange", u), p = null, s = null, u = null, m = !1));
  }
  function h() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
        const i = Math.random() * 16 | 0;
        return (e === "x" ? i : i & 3 | 8).toString(16);
      });
    }
  }
  const c = ["ln-api-connector", "ln-couchdb-connector"];
  function f(t) {
    return this.dom = t, this._name = t.id, this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", t), t[a] = this, t[b] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new tn(), this._dict = Xt(t, "data-ln-data-coordinator-dict"), this._parseStaleAttributes(), this.refreshMapper(), n(this), g.add(this), r(), this._checkInitialSync(), this;
  }
  f.prototype._parseStaleAttributes = function() {
    const e = this.findChildren().storeEl, i = this.dom.getAttribute("data-ln-data-coordinator-stale") || (e ? e.getAttribute("data-ln-data-store-stale") : null), _ = parseInt(i, 10);
    this._staleThreshold = i === "never" || i === "-1" ? -1 : isNaN(_) ? 300 : _;
    const v = this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (e ? e.hasAttribute("data-ln-data-store-no-autosync") : !1);
    this._noAutosync = !!v;
  }, f.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const e = this.findChildren().store;
    return !e || !e.lastSyncedAt ? !0 : Date.now() / 1e3 - e.lastSyncedAt > this._staleThreshold;
  }, f.prototype._maybeSync = function() {
    const t = this.findChildren(), e = t.store;
    !e || e.initializationError || !t.connector || this._noAutosync || !e.isInitialized || e.isSyncing || (!e.hasCache || this._isStale()) && e.forceSync();
  }, f.prototype._checkInitialSync = function() {
    const t = this, i = this.findChildren().store;
    i && Promise.resolve(i.ready).then(function() {
      const _ = t.findChildren(), v = _.store;
      if (v && v.initializationError) {
        t._reportReconciliationError("store-initialize", v.initializationError, null);
        return;
      }
      !v || !_.connector || t._noAutosync || v.isSyncing || (!v.hasCache || t._isStale()) && v.forceSync();
    }).catch(function(_) {
      t._reportReconciliationError("store-initialize", _, null);
    });
  }, f.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const e = this.dom.getAttribute("data-ln-data-mapper") || this.dom.id;
    e && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(e)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(i) {
      return i;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(i) {
      return i;
    });
  }, f.prototype.findChildren = function() {
    const t = this.dom.querySelector("[data-ln-data-store]"), e = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]"), i = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: t,
      connectorEl: e,
      queueEl: i,
      store: t ? t.lnDataStore || t.lnStore : null,
      connector: e ? e.lnConnector || e.lnApiConnector || e.lnCouchDbConnector : null,
      queue: i ? i.lnApiQueue : null
    };
  }, f.prototype._handleSubmitRecord = function(t) {
    const e = this.findChildren();
    if (!e.storeEl) {
      console.warn('[ln-data-coordinator] form submit claimed but no [data-ln-data-store] child found in "' + (this._name || "") + '"');
      return;
    }
    const i = t.data || {}, _ = i.id, v = i.expected_version, E = Object.assign({}, i);
    delete E.id, delete E.expected_version;
    const w = t.method.toUpperCase();
    w === "POST" ? this._fanOutCreate(e, E, t.action) : (w === "PUT" || w === "PATCH") && this._fanOutUpdate(e, _, E, v, t.action);
  }, f.prototype._fanOutCreate = function(t, e, i) {
    this.refreshMapper();
    const _ = "_temp_" + h();
    C(t.storeEl, "ln-data-store:request-create", { tempId: _, data: e }), t.queue ? C(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: _,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(e),
      expectedVersion: null,
      meta: { tempId: _, action: i }
    }) : t.connector && C(t.connectorEl, "ln-api-connector:request-create", {
      data: this.mapper.egress(e),
      url: i,
      meta: { entryId: h(), queued: !1, op: "create", tempId: _ }
    });
  }, f.prototype._fanOutUpdate = function(t, e, i, _, v) {
    this.refreshMapper(), C(t.storeEl, "ln-data-store:request-update", { id: e, data: i }), t.queue ? C(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: e,
      op: "update",
      targetId: e,
      payload: this.mapper.egress(i),
      expectedVersion: _,
      meta: { id: e, action: v }
    }) : t.connector && C(t.connectorEl, "ln-api-connector:request-update", {
      id: e,
      data: this.mapper.egress(i),
      expected_version: _,
      url: v,
      meta: { entryId: h(), queued: !1, op: "update", id: e }
    });
  }, f.prototype._fanOutDelete = function(t, e) {
    this.refreshMapper(), C(t.storeEl, "ln-data-store:request-delete", { id: e }), t.queue ? C(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: e,
      op: "delete",
      targetId: e,
      payload: null,
      expectedVersion: null,
      meta: { id: e }
    }) : t.connector && C(t.connectorEl, "ln-api-connector:request-delete", {
      id: e,
      meta: { entryId: h(), queued: !1, op: "delete", id: e }
    });
  }, f.prototype._fanOutBulkDelete = function(t, e) {
    this.refreshMapper();
    const i = e.join(",");
    C(t.storeEl, "ln-data-store:request-bulk-delete", { ids: e }), t.queue ? C(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: i,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: e },
      expectedVersion: null,
      meta: { bulkKey: i, ids: e }
    }) : t.connector && C(t.connectorEl, "ln-api-connector:request-bulk-delete", {
      ids: e,
      meta: { entryId: h(), queued: !1, op: "bulk-delete", bulkKey: i }
    });
  }, f.prototype._toastFromMessage = function(t) {
    t && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: t.type || "success",
        title: t.title || "",
        message: t.body || ""
      }
    }));
  }, f.prototype._toastFromDict = function(t) {
    const e = this._dict[t];
    e && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: "error", title: "", message: e }
    }));
  }, f.prototype._requestStoreMutation = function(t, e, i) {
    const _ = t.storeEl;
    if (!_) return Promise.reject(new Error("Store element not found"));
    const v = h(), E = this._mutationReceipts.wait(v);
    return C(_, "ln-data-store:request-" + e, Object.assign({}, i, { requestId: v })), E;
  }, f.prototype._reportReconciliationError = function(t, e, i) {
    C(this.dom, "ln-data-coordinator:error", {
      operation: t,
      error: e,
      meta: i || null
    });
  };
  function n(t) {
    t._handlers = {
      sync: function(e) {
        t.refreshMapper();
        const i = t.findChildren();
        if (!i.store || !i.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        C(i.connectorEl, "ln-api-connector:request-sync", { since: e.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(e) {
        const i = t.findChildren();
        if (!i.connectorEl) return;
        const _ = e.detail || {};
        C(i.connectorEl, "ln-api-connector:request-query", {
          query: Object.assign({}, _.query, {
            offset: _.offset,
            limit: _.limit,
            queryGen: _.queryGen
          })
        });
      },
      reqCreate: function(e) {
        const i = t.findChildren();
        i.storeEl && t._fanOutCreate(i, e.detail.data || {}, e.detail.action);
      },
      reqUpdate: function(e) {
        const i = t.findChildren();
        i.storeEl && t._fanOutUpdate(i, e.detail.id, e.detail.data || {}, e.detail.expected_version, e.detail.action);
      },
      reqDelete: function(e) {
        const i = t.findChildren();
        i.storeEl && t._fanOutDelete(i, e.detail.id);
      },
      reqBulkDelete: function(e) {
        const i = t.findChildren();
        i.storeEl && t._fanOutBulkDelete(i, e.detail.ids || []);
      },
      queueFailed: function() {
        t._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(e) {
        t.refreshMapper();
        const i = t.findChildren();
        if (!i.store || !i.connector || !i.queue) return;
        const _ = e.detail || {}, v = _.entryId, E = _.op, w = _.targetId, A = _.payload, L = _.expectedVersion, q = _.meta || {}, x = q.action || null, I = _.idempotencyKey || v;
        E === "create" ? C(i.connectorEl, "ln-api-connector:request-create", {
          data: A,
          url: x,
          idempotencyKey: I,
          meta: { entryId: v, queued: !0, op: "create", tempId: q.tempId }
        }) : E === "update" ? C(i.connectorEl, "ln-api-connector:request-update", {
          id: w,
          data: A,
          expected_version: L,
          url: x,
          idempotencyKey: I,
          meta: { entryId: v, queued: !0, op: "update", id: w }
        }) : E === "delete" ? C(i.connectorEl, "ln-api-connector:request-delete", {
          id: w,
          idempotencyKey: I,
          meta: { entryId: v, queued: !0, op: "delete", id: w }
        }) : E === "bulk-delete" ? C(i.connectorEl, "ln-api-connector:request-bulk-delete", {
          ids: A && A.ids ? A.ids : [],
          idempotencyKey: I,
          meta: { entryId: v, queued: !0, op: "bulk-delete", bulkKey: q.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", E);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(e) {
        const i = e.target;
        if (e.defaultPrevented) return;
        const _ = i.hasAttribute(y) ? i.getAttribute(y) : null;
        if (_ === null) return;
        let v;
        if (_ ? v = _ === t._name : v = i.closest("[data-ln-data-coordinator]") === t.dom, !v) return;
        const E = Me(i);
        if (E !== "POST" && E !== "PUT" && E !== "PATCH") return;
        e.preventDefault();
        const w = he(i);
        delete w._method, delete w._token, t._handleSubmitRecord({ data: w, method: E, action: i.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(e) {
        const i = e.detail.meta || {}, _ = t.findChildren();
        t.refreshMapper();
        const v = e.detail.data;
        let E = [], w = [], A = null;
        Array.isArray(v) ? (E = v, A = Math.floor(Date.now() / 1e3)) : v && (E = Array.isArray(v.data) ? v.data : [], w = Array.isArray(v.deleted) ? v.deleted : [], A = v.synced_at !== void 0 ? v.synced_at : v.since !== void 0 ? v.since : null);
        const L = E.map((q) => t.mapper.ingress(q));
        if (_.store && !_.store.initializationError)
          i.kind ? i.kind === "table" || i.kind === "list" ? _.store.applyQuery(L, { total: e.detail.total }).then(function(q) {
            C(i.targetEl, "ln-" + i.kind + ":set-loading", { loading: !1 }), C(i.targetEl, "ln-" + i.kind + ":set-data", {
              data: q,
              total: e.detail.total !== void 0 ? e.detail.total : q.length,
              filtered: e.detail.filtered !== void 0 ? e.detail.filtered : q.length,
              offset: e.detail.offset,
              queryGen: e.detail.queryGen
            }), t._boundDelivered.set(i.targetEl, !0);
          }) : i.kind === "options" ? _.store.applyQuery(L, { total: e.detail.total }).then(function() {
            return _.store.getAll({});
          }).then(function(q) {
            C(i.targetEl, "ln-options:set-data", { data: q.data });
          }) : i.kind === "stat" && _.store.applyQuery(L, { total: e.detail.total }).then(function() {
            const q = e.detail.filtered !== void 0 ? e.detail.filtered : e.detail.total !== void 0 ? e.detail.total : L.length;
            C(i.targetEl, "ln-stat:set-count", { count: q });
          }) : _.store.applySync(L, w, A || Math.floor(Date.now() / 1e3), {
            total: e.detail.total,
            filtered: e.detail.filtered,
            offset: e.detail.offset,
            queryGen: e.detail.queryGen,
            targetEl: i.targetEl
          });
        else if (i.targetEl && i.kind) {
          if (i.kind === "table" || i.kind === "list" || i.kind === "chart")
            C(i.targetEl, "ln-" + i.kind + ":set-loading", { loading: !1 }), C(i.targetEl, "ln-" + i.kind + ":set-data", {
              data: L,
              total: e.detail.total !== void 0 ? e.detail.total : L.length,
              filtered: e.detail.filtered !== void 0 ? e.detail.filtered : L.length,
              offset: e.detail.offset,
              queryGen: e.detail.queryGen
            }), t._boundDelivered.set(i.targetEl, !0);
          else if (i.kind === "options")
            C(i.targetEl, "ln-options:set-data", { data: L });
          else if (i.kind === "stat") {
            const q = e.detail.filtered !== void 0 ? e.detail.filtered : e.detail.total !== void 0 ? e.detail.total : L.length;
            C(i.targetEl, "ln-stat:set-count", { count: q });
          }
        }
      },
      connCreated: function(e) {
        const i = t.findChildren();
        if (!i.storeEl) return;
        const _ = e.detail.meta || {}, v = t.mapper.ingress(e.detail.record);
        t._requestStoreMutation(i, "update", { id: _.tempId, data: v }).then(function() {
          t._toastFromMessage(e.detail.message), _.queued && i.queue && C(i.queueEl, "ln-api-queue:resolve-create", {
            entryId: _.entryId,
            oldKey: _.tempId,
            newId: v.id
          });
        }).catch(function(E) {
          t._reportReconciliationError("create-reconcile", E, _);
        });
      },
      connUpdated: function(e) {
        const i = t.findChildren();
        if (!i.storeEl) return;
        const _ = e.detail.meta || {}, v = t.mapper.ingress(e.detail.record);
        t._requestStoreMutation(i, "update", { id: _.id, data: v }).then(function() {
          t._toastFromMessage(e.detail.message), _.queued && i.queue && C(i.queueEl, "ln-api-queue:ack", { entryId: _.entryId });
        }).catch(function(E) {
          t._reportReconciliationError("update-reconcile", E, _);
        });
      },
      connDeleted: function(e) {
        const i = t.findChildren();
        if (!i.storeEl) return;
        const _ = e.detail.meta || {};
        t._toastFromMessage(e.detail.message), _.queued && i.queue && C(i.queueEl, "ln-api-queue:ack", { entryId: _.entryId });
      },
      connBulkDeleted: function(e) {
        const i = t.findChildren();
        if (!i.storeEl) return;
        const _ = e.detail.meta || {};
        t._toastFromMessage(e.detail.message), _.queued && i.queue && C(i.queueEl, "ln-api-queue:ack", { entryId: _.entryId });
      },
      connError: function(e) {
        const i = e.detail || {}, _ = i.meta || {}, v = _.op || i.action, E = i.status || 0, w = t.findChildren();
        if (v === "sync") {
          w.storeEl && C(w.storeEl, "ln-data-store:request-sync-failed", {
            error: i.error,
            status: E
          }), console.error("[ln-data-coordinator] Sync failed:", i.error);
          return;
        }
        if (v === "query") {
          _.targetEl && _.kind && (C(_.targetEl, "ln-" + _.kind + ":set-loading", { loading: !1 }), (_.kind === "table" || _.kind === "list") && C(_.targetEl, "ln-" + _.kind + ":page-failed", { offset: _.offset })), t._reportReconciliationError("query", i.error || i, _);
          return;
        }
        if (!w.storeEl) return;
        const A = E === 401 || E === 419, L = E === 0 || E >= 500, q = E === 409 || E === 412;
        if (A) {
          t._toastFromDict("auth"), _.queued && w.queue && C(w.queueEl, "ln-api-queue:nack", { entryId: _.entryId, reason: "auth" });
          return;
        }
        if (L) {
          _.queued && w.queue ? C(w.queueEl, "ln-api-queue:nack", { entryId: _.entryId, reason: "retry" }) : t._toastFromDict("network");
          return;
        }
        let x = Promise.resolve();
        if (q && v === "update") {
          const I = i.data && i.data.remote ? t.mapper.ingress(i.data.remote) : null;
          I && (x = t._requestStoreMutation(w, "update", { id: _.id, data: I })), t._toastFromDict("conflict");
        } else v === "create" && (x = t._requestStoreMutation(w, "delete", { id: _.tempId })), t._toastFromDict("rejected");
        _.queued && w.queue ? x.then(function() {
          C(w.queueEl, "ln-api-queue:nack", { entryId: _.entryId, reason: "drop" });
        }).catch(function(I) {
          t._reportReconciliationError("deterministic-reconcile", I, _);
        }) : x.catch(function(I) {
          t._reportReconciliationError("deterministic-reconcile", I, _);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(e) {
        const i = t.findChildren(), _ = i.store;
        if (!_ || _.initializationError || !i.connector || t._noAutosync || _.isSyncing) return;
        (e.detail || {}).hasCache ? t._isStale() && _.forceSync() : _.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(e) {
        t._serveData(e, "table");
      },
      reqListData: function(e) {
        t._serveData(e, "list");
      },
      reqChartData: function(e) {
        t._serveData(e, "chart");
      },
      reqOptions: function(e) {
        t._serveOptions(e);
      },
      reqStat: function(e) {
        t._serveStat(e);
      },
      refreshQuery: function() {
        t._refreshAll(null, !0);
      },
      refresh: function(e) {
        t._mutationReceipts.resolve(e.detail), t._refreshAll(null, !1);
      },
      mutationError: function(e) {
        t._mutationReceipts.reject(e.detail);
      },
      refreshSynced: function(e) {
        e.detail && e.detail.changed && t._refreshAll(e.detail.meta, !1);
      }
    }, t.dom.addEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.addEventListener("ln-data-store:request-page", t._handlers.requestPage), t.dom.addEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.addEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.addEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.addEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.addEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.addEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.addEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.addEventListener("submit", t._handlers.formSubmit), c.forEach(function(e) {
      t.dom.addEventListener(e + ":fetched", t._handlers.connFetched), t.dom.addEventListener(e + ":created", t._handlers.connCreated), t.dom.addEventListener(e + ":updated", t._handlers.connUpdated), t.dom.addEventListener(e + ":deleted", t._handlers.connDeleted), t.dom.addEventListener(e + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.addEventListener(e + ":error", t._handlers.connError);
    }), document.addEventListener("ln-table:request-data", t._handlers.reqTableData), document.addEventListener("ln-list:request-data", t._handlers.reqListData), document.addEventListener("ln-chart:request-data", t._handlers.reqChartData), document.addEventListener("ln-options:request-data", t._handlers.reqOptions), document.addEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.addEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.addEventListener("ln-data-store:created", t._handlers.refresh), t.dom.addEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.addEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.addEventListener("ln-data-store:mutation-error", t._handlers.mutationError), t.dom.addEventListener("ln-data-store:synced", t._handlers.refreshSynced), t.dom.addEventListener("ln-data-store:query-changed", t._handlers.refreshQuery);
  }
  f.prototype._ownsStore = function(t) {
    const e = this.findChildren();
    return !!(e.store && e.store._name === t && t);
  }, f.prototype._serveData = function(t, e) {
    const i = t.target, _ = e === "table" ? "data-ln-table-source" : e === "list" ? "data-ln-list-source" : "data-ln-chart-source", v = i.getAttribute(_);
    if (!v || !this._ownsStore(v)) return;
    const E = t.detail || {}, w = Ze(E);
    this._boundQueries.set(i, w);
    const A = this.findChildren(), L = this, q = A.store;
    return (q && q.ready ? q.ready : Promise.resolve()).then(function() {
      const I = Vt(q, A.connector), k = le(w, q && q.query);
      if (I === "remote") {
        C(i, "ln-" + e + ":set-loading", { loading: !0 }), C(A.connectorEl, "ln-api-connector:request-query", {
          query: k,
          meta: { targetEl: i, kind: e, offset: k.offset, limit: k.limit }
        });
        return;
      }
      if (I !== "store") {
        C(i, "ln-" + e + ":set-loading", { loading: !1 });
        return;
      }
      return q.getAll(k).then(function(O) {
        const N = {
          data: O.data,
          total: O.total,
          filtered: O.filtered,
          offset: E.offset !== void 0 ? E.offset : O.offset,
          queryGen: E.queryGen !== void 0 ? E.queryGen : O.queryGen
        };
        C(i, "ln-" + e + ":set-data", N), L._boundDelivered.set(i, !0);
      });
    }).catch(function(I) {
      C(i, "ln-" + e + ":set-loading", { loading: !1 }), C(L.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: e,
        store: v,
        target: i,
        error: I
      });
    });
  }, f.prototype._serveOptions = function(t) {
    const e = t.target, i = e.getAttribute("data-ln-options");
    if (!this._ownsStore(i)) return;
    const _ = this.findChildren(), v = _.store, E = v && v.ready ? v.ready : Promise.resolve(), w = this;
    return E.then(function() {
      const A = Vt(v, _.connector);
      if (A === "remote") {
        C(_.connectorEl, "ln-api-connector:request-query", {
          query: {},
          meta: { targetEl: e, kind: "options" }
        });
        return;
      }
      if (A === "store")
        return v.getAll({}).then(function(L) {
          C(e, "ln-options:set-data", { data: L.data });
        });
    }).catch(function(A) {
      w._reportReconciliationError("options-query", A, { targetEl: e, kind: "options" });
    });
  }, f.prototype._serveStat = function(t) {
    const e = t.target, i = e.getAttribute("data-ln-stat");
    if (!this._ownsStore(i)) return;
    const _ = t.detail && t.detail.filters ? t.detail.filters : null, v = this.findChildren(), E = v.store, w = E && E.ready ? E.ready : Promise.resolve(), A = this;
    return w.then(function() {
      const L = Vt(E, v.connector);
      if (L === "remote") {
        C(v.connectorEl, "ln-api-connector:request-query", {
          query: { filters: _ },
          meta: { targetEl: e, kind: "stat" }
        });
        return;
      }
      if (L === "store")
        return E.count(_).then(function(q) {
          C(e, "ln-stat:set-count", { count: q });
        });
    }).catch(function(L) {
      A._reportReconciliationError("stat-query", L, { targetEl: e, kind: "stat" });
    });
  }, f.prototype._refreshAll = function(t, e) {
    const i = this, _ = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let v = 0; v < _.length; v++) {
      const E = _[v];
      let w, A;
      if (E.hasAttribute("data-ln-table-source") ? (w = E.getAttribute("data-ln-table-source"), A = "table") : E.hasAttribute("data-ln-list-source") ? (w = E.getAttribute("data-ln-list-source"), A = "list") : E.hasAttribute("data-ln-chart-source") ? (w = E.getAttribute("data-ln-chart-source"), A = "chart") : E.hasAttribute("data-ln-options") ? (w = E.getAttribute("data-ln-options"), A = "options") : E.hasAttribute("data-ln-stat") && (w = E.getAttribute("data-ln-stat"), A = "stat"), !this._ownsStore(w)) continue;
      const L = this.findChildren().store;
      if (A === "table" || A === "list") {
        const q = A === "table" ? "data-ln-table-window" : "data-ln-list-window";
        if (E.hasAttribute(q)) {
          C(E, "ln-" + A + (e ? ":request-invalidate" : ":request-revalidate"), {});
          continue;
        }
      }
      if (A === "table" || A === "list" || A === "chart") {
        const q = i._boundQueries.get(E) || { sort: null, filters: {}, search: "" };
        (function(x, I) {
          L.getAll(le(q, L.query)).then(function(k) {
            const O = {
              data: k.data,
              total: t && t.total !== void 0 ? t.total : k.total,
              filtered: t && t.filtered !== void 0 ? t.filtered : k.filtered,
              offset: k.offset !== void 0 ? k.offset : t && t.offset !== void 0 ? t.offset : q.offset,
              queryGen: k.queryGen !== void 0 ? k.queryGen : t && t.queryGen !== void 0 ? t.queryGen : q.queryGen
            };
            C(x, "ln-" + I + ":set-loading", { loading: !1 }), C(x, "ln-" + I + ":set-data", O), i._boundDelivered.set(x, !0);
          });
        })(E, A);
      } else if (A === "options")
        (function(q) {
          L.getAll({}).then(function(x) {
            C(q, "ln-options:set-data", { data: x.data });
          });
        })(E);
      else if (A === "stat") {
        const q = E.getAttribute("data-ln-stat-filter");
        let x = null;
        if (q) {
          const I = q.indexOf(":");
          if (I !== -1) {
            const k = q.slice(0, I), O = q.slice(I + 1);
            x = {}, x[k] = [O];
          }
        }
        (function(I, k) {
          L.count(k).then(function(O) {
            C(I, "ln-stat:set-count", { count: O });
          });
        })(E, x);
      }
    }
  }, f.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const t = this;
    t._handlers && (t.dom.removeEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.removeEventListener("ln-data-store:request-page", t._handlers.requestPage), t.dom.removeEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.removeEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.removeEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.removeEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.removeEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.removeEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.removeEventListener("submit", t._handlers.formSubmit), c.forEach(function(e) {
      t.dom.removeEventListener(e + ":fetched", t._handlers.connFetched), t.dom.removeEventListener(e + ":created", t._handlers.connCreated), t.dom.removeEventListener(e + ":updated", t._handlers.connUpdated), t.dom.removeEventListener(e + ":deleted", t._handlers.connDeleted), t.dom.removeEventListener(e + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.removeEventListener(e + ":error", t._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", t._handlers.reqTableData), document.removeEventListener("ln-list:request-data", t._handlers.reqListData), document.removeEventListener("ln-chart:request-data", t._handlers.reqChartData), document.removeEventListener("ln-options:request-data", t._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.removeEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:created", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:mutation-error", t._handlers.mutationError), t.dom.removeEventListener("ln-data-store:synced", t._handlers.refreshSynced), t.dom.removeEventListener("ln-data-store:query-changed", t._handlers.refreshQuery), t._handlers = null), t._boundQueries = null, t._boundDelivered = null, t._mutationReceipts.close(new Error("Data coordinator destroyed")), t._mutationReceipts = null, g.delete(this), l(), delete this.dom[a], delete this.dom[b];
  };
  function o(t, e) {
    const i = t[a];
    i && e === "data-ln-data-mapper" && i.refreshMapper();
  }
  H(d, a, f, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: o
  });
})();
const en = "ln_api_queue", nn = 2, Y = "outbox", nt = "_queue_meta";
function rt(d, a) {
  return d.error || new Error(a);
}
function vt(d, a) {
  return d.bound([a, -1 / 0], [a, 1 / 0]);
}
function ce(d) {
  return "seq:" + d;
}
function It(d) {
  return "paused:" + d;
}
function de(d) {
  d.leaseOwner = null, d.leaseUntil = 0;
}
function on(d, a, b) {
  return typeof d != "string" || d.indexOf(a) === -1 ? d : d.split(a).join(b);
}
function rn(d, a, b, y) {
  const g = /* @__PURE__ */ new Map(), m = [], p = [];
  for (const s of d || [])
    g.has(s.chainKey) || g.set(s.chainKey, []), g.get(s.chainKey).push(s);
  return g.forEach((s, u) => {
    s.sort((l, h) => l.seq - h.seq);
    const r = s[0];
    if (!(!r || r.status === "failed")) {
      if (r.status === "inflight" && (r.leaseUntil || 0) > y) {
        p.push({ chainKey: u, at: r.leaseUntil });
        return;
      }
      if ((r.nextAttemptAt || 0) > y) {
        p.push({ chainKey: u, at: r.nextAttemptAt });
        return;
      }
      r.status = "inflight", r.leaseOwner = a, r.leaseUntil = y + b, r.updatedAt = y, m.push(r);
    }
  }), { entries: m, wakeups: p };
}
function sn(d, a, b, y, g) {
  const m = [], p = [];
  for (const s of d || []) {
    if (s.entryId === a) {
      p.push(s.entryId);
      continue;
    }
    s.chainKey === b && (s.chainKey = y, s.targetId === b && (s.targetId = y), s.meta && s.meta.id === b && (s.meta.id = y), s.meta && typeof s.meta.action == "string" && (s.meta.action = on(s.meta.action, b, y)), s.updatedAt = g, m.push(s));
  }
  return { changed: m, deleted: p };
}
class an {
  constructor(a) {
    a = a || {}, this.indexedDB = a.indexedDB || globalThis.indexedDB, this.keyRange = a.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = a.dbName || en, this.now = a.now || (() => Date.now()), this.uuid = a.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((a, b) => {
      const y = this.indexedDB.open(this.dbName, nn);
      y.onupgradeneeded = (g) => {
        const m = g.target.result;
        let p;
        m.objectStoreNames.contains(Y) ? p = g.target.transaction.objectStore(Y) : p = m.createObjectStore(Y, { keyPath: "entryId" }), p.indexNames.contains("by_scope_chain") || p.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), p.indexNames.contains("by_scope_seq") || p.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), m.objectStoreNames.contains(nt) || m.createObjectStore(nt, { keyPath: "key" });
      }, y.onerror = () => b(rt(y, "Queue database open failed")), y.onsuccess = (g) => {
        this._db = g.target.result, this._db.onversionchange = () => this.close(), a(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((a, b) => {
      const y = this.indexedDB.deleteDatabase(this.dbName);
      y.onsuccess = () => a(), y.onerror = () => b(rt(y, "Queue database delete failed")), y.onblocked = () => b(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(a) {
    return this.open().then((b) => b ? new Promise((y, g) => {
      const p = b.transaction(Y, "readonly").objectStore(Y).index("by_scope_seq").getAll(vt(this.keyRange, a));
      p.onsuccess = () => y(p.result || []), p.onerror = () => g(rt(p, "Queue scope read failed"));
    }) : []);
  }
  enqueue(a, b) {
    return b = b || {}, this.open().then((y) => y ? new Promise((g, m) => {
      const p = y.transaction([nt, Y], "readwrite"), s = p.objectStore(nt), u = p.objectStore(Y), r = ce(a);
      let l = null;
      const h = (f) => {
        const n = f + 1;
        l = {
          entryId: this.uuid(),
          scope: a,
          chainKey: b.chainKey,
          seq: n,
          op: b.op,
          targetId: b.targetId !== void 0 ? b.targetId : null,
          payload: b.payload,
          expectedVersion: b.expectedVersion !== void 0 ? b.expectedVersion : null,
          meta: b.meta || {},
          attempts: 0,
          nextAttemptAt: 0,
          status: "pending",
          leaseOwner: null,
          leaseUntil: 0,
          createdAt: this.now(),
          updatedAt: this.now()
        }, s.put({ key: r, value: n }), u.put(l);
      }, c = s.get(r);
      c.onerror = () => m(rt(c, "Queue sequence read failed")), c.onsuccess = () => {
        const f = c.result;
        if (f && typeof f.value == "number") {
          h(f.value);
          return;
        }
        const n = u.index("by_scope_seq").getAll(vt(this.keyRange, a));
        n.onerror = () => m(rt(n, "Queue sequence migration failed")), n.onsuccess = () => {
          const o = (n.result || []).reduce((t, e) => Math.max(t, e.seq || 0), 0);
          h(o);
        };
      }, p.oncomplete = () => g(l), p.onerror = () => m(p.error || new Error("Queue enqueue transaction failed")), p.onabort = () => m(p.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(a, b, y) {
    return this.open().then((g) => g ? new Promise((m, p) => {
      const s = g.transaction(Y, "readwrite"), u = s.objectStore(Y), r = u.index("by_scope_seq").getAll(vt(this.keyRange, a)), l = this.now();
      let h = { entries: [], wakeups: [] };
      r.onerror = () => p(rt(r, "Queue claim read failed")), r.onsuccess = () => {
        h = rn(r.result || [], b, y, l);
        for (const c of h.entries) u.put(c);
      }, s.oncomplete = () => m(h), s.onerror = () => p(s.error || new Error("Queue claim transaction failed")), s.onabort = () => p(s.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(a, b) {
    return this._updateEntry(a, b, (y, g) => (g.delete(y.entryId), { status: "acked", entry: y }));
  }
  nack(a, b, y, g) {
    g = g || {};
    const m = g.maxAttempts || 8, p = g.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((s) => s ? new Promise((u, r) => {
      const l = s.transaction([Y, nt], "readwrite"), h = l.objectStore(Y), c = l.objectStore(nt), f = h.get(b);
      let n = null;
      f.onerror = () => r(rt(f, "Queue nack read failed")), f.onsuccess = () => {
        const o = f.result;
        if (!(!o || o.scope !== a)) {
          if (y === "drop") {
            h.delete(o.entryId), n = { status: "dropped", entry: o };
            return;
          }
          if (de(o), o.updatedAt = this.now(), y === "auth") {
            o.status = "pending", h.put(o), c.put({ key: It(a), value: !0 }), n = { status: "auth", entry: o };
            return;
          }
          if (y === "retry") {
            if (o.attempts = (o.attempts || 0) + 1, o.attempts >= m) {
              o.status = "failed", o.nextAttemptAt = 0, h.put(o), n = { status: "failed", entry: o };
              return;
            }
            const t = p[Math.min(o.attempts - 1, p.length - 1)];
            o.status = "pending", o.nextAttemptAt = this.now() + t, h.put(o), n = { status: "retry", entry: o, delay: t };
          }
        }
      }, l.oncomplete = () => u(n), l.onerror = () => r(l.error || new Error("Queue nack transaction failed")), l.onabort = () => r(l.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(a, b, y) {
    return this._remapTransaction(a, null, b, y);
  }
  resolveCreate(a, b, y, g) {
    return this._remapTransaction(a, b, y, g);
  }
  _remapTransaction(a, b, y, g) {
    return this.open().then((m) => m ? new Promise((p, s) => {
      const u = m.transaction(Y, "readwrite"), r = u.objectStore(Y), l = r.index("by_scope_seq").getAll(vt(this.keyRange, a));
      let h = { changed: [], deleted: [] };
      l.onerror = () => s(rt(l, "Queue remap read failed")), l.onsuccess = () => {
        h = sn(l.result || [], b, y, g, this.now());
        for (const c of h.deleted) r.delete(c);
        for (const c of h.changed) r.put(c);
      }, u.oncomplete = () => p(h.changed), u.onerror = () => s(u.error || new Error("Queue remap transaction failed")), u.onabort = () => s(u.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(a) {
    return this.open().then((b) => b ? new Promise((y, g) => {
      const m = b.transaction(Y, "readwrite"), p = m.objectStore(Y), s = p.index("by_scope_seq").getAll(vt(this.keyRange, a));
      let u = 0;
      s.onerror = () => g(rt(s, "Queue failed-entry read failed")), s.onsuccess = () => {
        for (const r of s.result || [])
          r.status === "failed" && (r.status = "pending", r.attempts = 0, r.nextAttemptAt = 0, r.updatedAt = this.now(), de(r), p.put(r), u++);
      }, m.oncomplete = () => y(u), m.onerror = () => g(m.error || new Error("Queue failed-entry reset failed")), m.onabort = () => g(m.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(a) {
    return this.open().then((b) => b ? new Promise((y, g) => {
      const p = b.transaction(nt, "readonly").objectStore(nt).get(It(a));
      p.onsuccess = () => y(!!(p.result && p.result.value)), p.onerror = () => g(rt(p, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(a, b) {
    return this.open().then((y) => {
      if (y)
        return new Promise((g, m) => {
          const p = y.transaction(nt, "readwrite");
          p.objectStore(nt).put({ key: It(a), value: !!b }), p.oncomplete = () => g(), p.onerror = () => m(p.error || new Error("Queue pause-state write failed")), p.onabort = () => m(p.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(a) {
    return this.open().then((b) => {
      if (b)
        return new Promise((y, g) => {
          const m = b.transaction([Y, nt], "readwrite"), s = m.objectStore(Y).index("by_scope_seq").openCursor(vt(this.keyRange, a));
          s.onsuccess = (u) => {
            const r = u.target.result;
            r && (r.delete(), r.continue());
          }, s.onerror = () => g(rt(s, "Queue clear failed")), m.objectStore(nt).delete(ce(a)), m.objectStore(nt).delete(It(a)), m.oncomplete = () => y(), m.onerror = () => g(m.error || new Error("Queue clear transaction failed")), m.onabort = () => g(m.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(a, b, y) {
    return this.open().then((g) => g ? new Promise((m, p) => {
      const s = g.transaction(Y, "readwrite"), u = s.objectStore(Y), r = u.get(b);
      let l = null;
      r.onerror = () => p(rt(r, "Queue entry read failed")), r.onsuccess = () => {
        const h = r.result;
        !h || h.scope !== a || (l = y(h, u));
      }, s.oncomplete = () => m(l), s.onerror = () => p(s.error || new Error("Queue entry transaction failed")), s.onabort = () => p(s.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const d = "data-ln-api-queue", a = "lnApiQueue", b = [2e3, 5e3, 15e3, 6e4, 3e5], y = 8, g = 6e4;
  if (window[a] !== void 0) return;
  function m() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (l) => {
        const h = Math.random() * 16 | 0;
        return (l === "x" ? h : h & 3 | 8).toString(16);
      });
    }
  }
  const p = new an({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: m
  });
  function s(r) {
    this.dom = r, r[a] = this;
    const l = r.closest("[data-ln-data-coordinator]");
    this.scope = r.id || (l ? l.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = m(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const h = this;
    return p.open().then((c) => c ? p.getPaused(h.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((c) => (h._paused = !!c, h._paused && C(h.dom, "ln-api-queue:paused", { reason: "auth", restored: !0 }), h._emitPendingCount())).then(() => h._drain()).catch((c) => {
      console.error("[ln-api-queue] Initialization failed:", c), C(h.dom, "ln-api-queue:error", { operation: "initialize", error: c });
    }), this;
  }
  s.prototype._isOnline = function() {
    const r = this.dom.getAttribute("data-ln-api-queue-online");
    return r === "true" ? !0 : r === "false" ? !1 : navigator.onLine;
  }, s.prototype._emitPendingCount = function() {
    const r = this;
    return p.allForScope(r.scope).then((l) => (C(r.dom, "ln-api-queue:pending-count", { count: l.length, scope: r.scope }), l.length === 0 && C(r.dom, "ln-api-queue:drained", { scope: r.scope }), l));
  }, s.prototype._clearTimer = function(r) {
    const l = this._timers.get(r);
    l && (clearTimeout(l), this._timers.delete(r));
  }, s.prototype._scheduleTimer = function(r, l) {
    const h = Math.max(0, l), c = this._timers.get(r);
    c && clearTimeout(c);
    const f = this, n = setTimeout(() => {
      f._timers.delete(r), f._drain();
    }, h);
    this._timers.set(r, n);
  }, s.prototype._drain = function() {
    const r = this;
    return r._paused || !r._isOnline() ? Promise.resolve() : (r._drainPromise || (r._drainPromise = p.claimReady(r.scope, r._workerId, g).then((l) => {
      for (const h of l.wakeups)
        r._scheduleTimer(h.chainKey, h.at - Date.now());
      for (const h of l.entries)
        r._clearTimer(h.chainKey), C(r.dom, "ln-api-queue:send", {
          entryId: h.entryId,
          chainKey: h.chainKey,
          op: h.op,
          targetId: h.targetId,
          payload: h.payload,
          expectedVersion: h.expectedVersion,
          idempotencyKey: h.entryId,
          meta: h.meta
        });
    }).catch((l) => {
      console.error("[ln-api-queue] Drain failed:", l), C(r.dom, "ln-api-queue:error", { operation: "drain", error: l });
    }).finally(() => {
      r._drainPromise = null;
    })), r._drainPromise);
  }, s.prototype._onEnqueue = function(r) {
    const l = this;
    return p.enqueue(l.scope, r.detail || {}).then((h) => {
      if (h)
        return l._emitPendingCount().then((c) => (C(l.dom, "ln-api-queue:enqueued", {
          entryId: h.entryId,
          chainKey: h.chainKey,
          count: c.length
        }), l._drain()));
    }).catch((h) => {
      C(l.dom, "ln-api-queue:error", { operation: "enqueue", error: h });
    });
  }, s.prototype._onAck = function(r) {
    const l = this, h = r.detail || {};
    return p.ack(l.scope, h.entryId).then(() => l._emitPendingCount()).then(() => l._drain()).catch((c) => {
      C(l.dom, "ln-api-queue:error", { operation: "ack", entryId: h.entryId, error: c });
    });
  }, s.prototype._onNack = function(r) {
    const l = this, h = r.detail || {};
    return p.nack(l.scope, h.entryId, h.reason, {
      maxAttempts: y,
      backoff: b
    }).then((c) => {
      if (c)
        return c.status === "failed" ? C(l.dom, "ln-api-queue:failed", {
          entryId: c.entry.entryId,
          chainKey: c.entry.chainKey,
          attempts: c.entry.attempts
        }) : c.status === "retry" ? l._scheduleTimer(c.entry.chainKey, c.delay) : c.status === "auth" && (l._paused = !0, C(l.dom, "ln-api-queue:paused", { reason: "auth" }), C(l.dom, "ln-api-queue:auth-required", {
          entryId: c.entry.entryId,
          chainKey: c.entry.chainKey
        })), l._emitPendingCount().then(() => {
          if (c.status === "dropped") return l._drain();
        });
    }).catch((c) => {
      C(l.dom, "ln-api-queue:error", { operation: "nack", entryId: h.entryId, error: c });
    });
  }, s.prototype._onRemap = function(r) {
    const l = this, h = r.detail || {};
    return p.remap(l.scope, h.oldKey, h.newId).catch((c) => {
      C(l.dom, "ln-api-queue:error", { operation: "remap", error: c });
    });
  }, s.prototype._onResolveCreate = function(r) {
    const l = this, h = r.detail || {};
    return p.resolveCreate(l.scope, h.entryId, h.oldKey, h.newId).then(() => l._emitPendingCount()).then(() => l._drain()).catch((c) => {
      C(l.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: h.entryId,
        error: c
      });
    });
  }, s.prototype._onResume = function() {
    const r = this;
    return p.setPaused(r.scope, !1).then(() => (r._paused = !1, C(r.dom, "ln-api-queue:resumed", {}), r._drain())).catch((l) => {
      C(r.dom, "ln-api-queue:error", { operation: "resume", error: l });
    });
  }, s.prototype._onDrain = function() {
    const r = this;
    return p.resetFailed(r.scope).then(() => {
      const l = r._drainPromise;
      return l ? l.then(() => r._drain()) : r._drain();
    }).catch((l) => {
      C(r.dom, "ln-api-queue:error", { operation: "manual-drain", error: l });
    });
  }, s.prototype._onClear = function() {
    const r = this;
    return r._timers.forEach((l) => clearTimeout(l)), r._timers.clear(), p.clear(r.scope).then(() => {
      r._paused = !1, C(r.dom, "ln-api-queue:pending-count", { count: 0, scope: r.scope }), C(r.dom, "ln-api-queue:drained", { scope: r.scope });
    }).catch((l) => {
      C(r.dom, "ln-api-queue:error", { operation: "clear", error: l });
    });
  }, s.prototype._bindEvents = function() {
    const r = this;
    r._handlers = {
      enqueue: (l) => r._onEnqueue(l),
      ack: (l) => r._onAck(l),
      nack: (l) => r._onNack(l),
      remap: (l) => r._onRemap(l),
      resolveCreate: (l) => r._onResolveCreate(l),
      resume: () => r._onResume(),
      drain: () => r._onDrain(),
      clear: () => r._onClear()
    }, r.dom.addEventListener("ln-api-queue:request-enqueue", r._handlers.enqueue), r.dom.addEventListener("ln-api-queue:ack", r._handlers.ack), r.dom.addEventListener("ln-api-queue:nack", r._handlers.nack), r.dom.addEventListener("ln-api-queue:request-remap", r._handlers.remap), r.dom.addEventListener("ln-api-queue:resolve-create", r._handlers.resolveCreate), r.dom.addEventListener("ln-api-queue:request-resume", r._handlers.resume), r.dom.addEventListener("ln-api-queue:request-drain", r._handlers.drain), r.dom.addEventListener("ln-api-queue:request-clear", r._handlers.clear);
  }, s.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const r = this;
    r.dom.removeEventListener("ln-api-queue:request-enqueue", r._handlers.enqueue), r.dom.removeEventListener("ln-api-queue:ack", r._handlers.ack), r.dom.removeEventListener("ln-api-queue:nack", r._handlers.nack), r.dom.removeEventListener("ln-api-queue:request-remap", r._handlers.remap), r.dom.removeEventListener("ln-api-queue:resolve-create", r._handlers.resolveCreate), r.dom.removeEventListener("ln-api-queue:request-resume", r._handlers.resume), r.dom.removeEventListener("ln-api-queue:request-drain", r._handlers.drain), r.dom.removeEventListener("ln-api-queue:request-clear", r._handlers.clear), window.removeEventListener("online", r._onlineHandler), r._timers.forEach((l) => clearTimeout(l)), r._timers.clear(), C(r.dom, "ln-api-queue:destroyed", { scope: r.scope }), delete r.dom[a];
  };
  function u(r) {
    const l = r[a];
    l && l._drain();
  }
  H(d, a, s, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: u
  });
})();
function Ie(d) {
  if (d == null || d === "") return null;
  const a = Number(d);
  return Number.isFinite(a) ? a : null;
}
function wt(d) {
  return String(Math.round(d * 1e3) / 1e3);
}
function ln(d, a, b) {
  const y = Ie(d);
  return y === null || y < 0 ? 0 : Math.min(y, Math.min(a, b) / 2);
}
function cn(d) {
  if (typeof d != "string") return null;
  const a = d.trim().split(/[\s,]+/).map(Number);
  return a.length !== 4 || a.some((b) => !Number.isFinite(b)) || a[2] <= 0 || a[3] <= 0 ? null : { x: a[0], y: a[1], width: a[2], height: a[3] };
}
function dn(d, a) {
  a = a || {};
  const b = a.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, y = a.xField || "label", g = a.yField || "value", m = a.includeZero !== !1, p = ln(a.padding, b.width, b.height), s = Array.isArray(d) ? d : [], u = [];
  for (let x = 0; x < s.length; x++) {
    const I = s[x] || {}, k = Ie(I[g]);
    k !== null && u.push({
      record: I,
      sourceIndex: x,
      label: I[y] == null ? String(x + 1) : String(I[y]),
      value: k
    });
  }
  if (u.length === 0)
    return {
      points: [],
      linePoints: "",
      areaPoints: "",
      count: 0,
      min: null,
      max: null,
      domainMin: 0,
      domainMax: 1,
      baselineY: b.y + b.height - p
    };
  const r = u.map((x) => x.value), l = Math.min(...r), h = Math.max(...r);
  let c = m ? Math.min(0, l) : l, f = m ? Math.max(0, h) : h;
  if (c === f)
    if (c === 0)
      f = 1;
    else {
      const x = Math.max(Math.abs(c) * 0.1, 1);
      c -= x, f += x;
    }
  const n = b.x + p, o = b.y + p, t = Math.max(0, b.width - p * 2), e = Math.max(0, b.height - p * 2), i = u.length > 1 ? t / (u.length - 1) : 0, _ = f - c, v = (x) => o + (f - x) / _ * e, E = u.map((x, I) => ({
    ...x,
    x: u.length === 1 ? n + t / 2 : n + I * i,
    y: v(x.value)
  })), w = c <= 0 && f >= 0 ? 0 : c, A = v(w), L = E.map((x) => wt(x.x) + "," + wt(x.y)).join(" "), q = [
    wt(E[0].x) + "," + wt(A),
    L,
    wt(E[E.length - 1].x) + "," + wt(A)
  ].join(" ");
  return {
    points: E,
    linePoints: L,
    areaPoints: q,
    count: E.length,
    min: l,
    max: h,
    domainMin: c,
    domainMax: f,
    baselineY: A
  };
}
(function() {
  const d = "data-ln-chart", a = "lnChart", b = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[a] !== void 0) return;
  function y(s) {
    if (!s) return null;
    const u = s.split(":"), r = u[0].trim();
    return r ? {
      field: r,
      direction: u[1] && u[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
    } : null;
  }
  function g(s, u) {
    if (s == null || !Number.isFinite(s)) return "";
    try {
      return new Intl.NumberFormat($(u)).format(s);
    } catch {
      return String(s);
    }
  }
  function m(s, u) {
    s && (s.textContent = u);
  }
  function p(s) {
    this.dom = s, this.name = s.getAttribute(d) || "", this.source = s.getAttribute("data-ln-chart-source") || this.name, this.plot = s.querySelector("[data-ln-chart-plot]"), this.line = s.querySelector("[data-ln-chart-line]"), this.area = s.querySelector("[data-ln-chart-area]"), this.labels = s.querySelector("[data-ln-chart-labels]"), this.empty = s.querySelector("[data-ln-chart-empty]"), this.minimum = s.querySelector("[data-ln-chart-min]"), this.maximum = s.querySelector("[data-ln-chart-max]"), this.count = s.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const u = this;
    return this._onSetData = function(r) {
      const l = r.detail || {};
      u._data = Array.isArray(l.data) ? l.data : [], u.isLoaded = !0, u._setLoading(!1), u._render();
    }, this._onSetLoading = function(r) {
      u._setLoading(!!(r.detail && r.detail.loading));
    }, this._onRefresh = function() {
      u.requestData();
    }, s.addEventListener("ln-chart:set-data", this._onSetData), s.addEventListener("ln-chart:set-loading", this._onSetLoading), s.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  p.prototype._readOptions = function() {
    const s = this.dom.getAttribute("data-ln-chart-padding"), u = s === null ? NaN : Number(s), r = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(u) && u >= 0 ? u : 16,
      type: r === "area" || r === "polygon" ? "area" : "line",
      viewBox: this.plot && cn(this.plot.getAttribute("viewBox")) || b
    };
  }, p.prototype._setLoading = function(s) {
    this.dom.classList.toggle("ln-chart--loading", s), this.dom.setAttribute("aria-busy", s ? "true" : "false");
  }, p.prototype._renderLabels = function(s) {
    if (!this.labels || (this.labels.replaceChildren(), s.count === 0)) return;
    const u = this.name + "-label", r = '[data-ln-template="' + u + '"]';
    if (!this.dom.querySelector(r) && !document.querySelector(r)) return;
    const l = mt(this.dom, u, "ln-chart");
    if (l)
      for (const h of s.points) {
        const c = l.cloneNode(!0);
        At(c, {
          label: h.label,
          value: g(h.value, this.dom)
        }), this.labels.appendChild(c);
      }
  }, p.prototype._render = function() {
    const s = this._readOptions(), u = dn(this._data, s);
    this.model = u, this.line && (this.line.setAttribute("points", u.linePoints), this.line.toggleAttribute("hidden", u.count === 0)), this.area && (this.area.setAttribute("points", u.areaPoints), this.area.toggleAttribute("hidden", u.count === 0 || s.type !== "area"));
    const r = u.count === 0;
    this.dom.classList.toggle("ln-chart--empty", r), this.empty && this.empty.toggleAttribute("hidden", !r), m(this.minimum, g(u.min, this.dom)), m(this.maximum, g(u.max, this.dom)), m(this.count, g(u.count, this.dom)), this._renderLabels(u), C(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: u.count,
      min: u.min,
      max: u.max
    });
  }, p.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, C(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: y(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, p.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[a]);
  }, H(d, a, p, "ln-chart", {
    extraAttributes: [
      "data-ln-chart-source",
      "data-ln-chart-x",
      "data-ln-chart-y",
      "data-ln-chart-type",
      "data-ln-chart-padding",
      "data-ln-chart-zero",
      "data-ln-chart-sort"
    ],
    onAttributeChange: function(s, u) {
      const r = s[a];
      if (r) {
        if (u === "data-ln-chart-source" || u === "data-ln-chart-sort") {
          r.requestData();
          return;
        }
        r._render();
      }
    }
  });
})();
(function() {
  const d = "data-ln-options", a = "lnOptions";
  if (window[a] !== void 0) return;
  function b(y) {
    this.dom = y, this._storeName = y.getAttribute(d), this._valueField = y.getAttribute("data-ln-options-value") || "id", this._labelField = y.getAttribute("data-ln-options-label") || "name";
    const g = this;
    return this._onSetData = function(m) {
      g._rebuild(m.detail.data || []);
    }, y.addEventListener("ln-options:set-data", this._onSetData), C(y, "ln-options:request-data", { options: this._storeName }), this;
  }
  b.prototype._rebuild = function(y) {
    const g = this.dom, m = this._valueField, p = this._labelField, s = g.value, u = g.querySelectorAll("option");
    for (let l = u.length - 1; l >= 0; l--)
      u[l].value !== "" && g.removeChild(u[l]);
    for (let l = 0; l < y.length; l++) {
      const h = y[l], c = document.createElement("option");
      c.value = String(h[m]), c.textContent = h[p] != null ? h[p] : "", g.appendChild(c);
    }
    const r = g.options;
    for (let l = 0; l < r.length; l++)
      if (r[l].value === s) {
        g.value = s;
        break;
      }
  }, b.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[a]);
  }, H(d, a, b, "ln-options");
})();
(function() {
  const d = "data-ln-stat", a = "lnStat";
  if (window[a] !== void 0) return;
  function b(g) {
    if (!g) return null;
    const m = g.indexOf(":");
    if (m === -1) return null;
    const p = g.slice(0, m), s = g.slice(m + 1), u = {};
    return u[p] = [s], u;
  }
  function y(g) {
    return this.dom = g, this._storeName = g.getAttribute(d), this._filters = b(g.getAttribute("data-ln-stat-filter")), this._onSetCount = function(m) {
      g.textContent = String(m.detail.count), g.classList.remove("is-loading");
    }, g.addEventListener("ln-stat:set-count", this._onSetCount), C(g, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  y.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[a]);
  }, H(d, a, y, "ln-stat");
})();
(function() {
  const d = "ln-icon-sprite", a = "#ln-icon-", b = "#ln-icon-custom-", y = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set();
  let m = null;
  const p = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), s = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), u = "lni:", r = "lni:v", l = "1";
  function h() {
    try {
      if (localStorage.getItem(r) !== l) {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const _ = localStorage.key(i);
          _ && _.indexOf(u) === 0 && localStorage.removeItem(_);
        }
        localStorage.setItem(r, l);
      }
    } catch {
    }
  }
  h();
  function c() {
    return m || (m = document.getElementById(d), m || (m = document.createElementNS("http://www.w3.org/2000/svg", "svg"), m.id = d, m.setAttribute("hidden", ""), m.setAttribute("aria-hidden", "true"), m.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(m, document.body.firstChild))), m;
  }
  function f(i) {
    return i.indexOf(b) === 0 ? s + "/" + i.slice(b.length) + ".svg" : p + "/" + i.slice(a.length) + ".svg";
  }
  function n(i, _) {
    const v = _.match(/viewBox="([^"]+)"/), E = v ? v[1] : "0 0 24 24", w = _.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), A = w ? w[1].trim() : "", L = _.match(/<svg([^>]*)>/i), q = L ? L[1] : "", x = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    x.id = i, x.setAttribute("viewBox", E), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(I) {
      const k = q.match(new RegExp(I + '="([^"]*)"'));
      k && x.setAttribute(I, k[1]);
    }), x.innerHTML = A, c().querySelector("defs").appendChild(x);
  }
  function o(i) {
    if (y.has(i) || g.has(i)) return;
    if (i.indexOf(b) === 0 && !s) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", i);
      return;
    }
    const _ = i.slice(1);
    try {
      const E = localStorage.getItem(u + _);
      if (E) {
        n(_, E), y.add(i);
        return;
      }
    } catch {
    }
    g.add(i);
    const v = f(i);
    fetch(v).then(function(E) {
      if (!E.ok) throw new Error(E.status);
      return E.text();
    }).then(function(E) {
      n(_, E), y.add(i), g.delete(i);
      try {
        localStorage.setItem(u + _, E);
      } catch {
      }
    }).catch(function(E) {
      console.error("[ln-icon] Fetch failed for:", _, E), g.delete(i);
    });
  }
  function t(i) {
    const _ = 'use[href^="' + a + '"], use[href^="' + b + '"]', v = i.querySelectorAll ? i.querySelectorAll(_) : [];
    if (i.matches && i.matches(_)) {
      const E = i.getAttribute("href");
      E && o(E);
    }
    Array.prototype.forEach.call(v, function(E) {
      const w = E.getAttribute("href");
      w && o(w);
    });
  }
  function e() {
    t(document), new MutationObserver(function(i) {
      i.forEach(function(_) {
        if (_.type === "childList")
          _.addedNodes.forEach(function(v) {
            v.nodeType === 1 && t(v);
          });
        else if (_.type === "attributes" && _.attributeName === "href") {
          const v = _.target.getAttribute("href");
          v && (v.indexOf(a) === 0 || v.indexOf(b) === 0) && o(v);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", e) : e();
})();
(function() {
  const d = "data-ln-debug", a = "lnDebug";
  if (window[a] !== void 0) return;
  function b(y) {
    return this.dom = y, this;
  }
  b.prototype.destroy = function() {
    delete this.dom[a];
  }, H(d, a, b, "ln-debug");
})();
