if (typeof window < "u") {
  const l = console.warn;
  console.warn = function(...s) {
    typeof s[0] == "string" && (s[0].startsWith("[ln-") || s[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || l.apply(console, s);
  };
}
const Kt = {};
function Nt(l, s) {
  Kt[l] || (Kt[l] = document.querySelector('[data-ln-template="' + l + '"]'));
  const b = Kt[l];
  return b ? b.content.cloneNode(!0) : (console.warn("[" + (s || "ln-core") + '] Template "' + l + '" not found'), null);
}
function L(l, s, b) {
  l.dispatchEvent(new CustomEvent(s, {
    bubbles: !0,
    detail: b || {}
  }));
}
function X(l, s, b) {
  const y = new CustomEvent(s, {
    bubbles: !0,
    cancelable: !0,
    detail: b || {}
  });
  return l.dispatchEvent(y), y;
}
function pe(l, s, b) {
  l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), l._updateFooter();
  const y = {
    sort: l.currentSort,
    filters: l.currentFilters,
    search: l.currentSearch
  };
  y[b] = l.name, L(l.dom, s, y);
}
function lt(l, s) {
  if (!l || !s) return l;
  const b = l.querySelectorAll("[data-ln-field]");
  for (let m = 0; m < b.length; m++) {
    const a = b[m], h = a.getAttribute("data-ln-field");
    s[h] != null && (a.textContent = s[h]);
  }
  const y = l.querySelectorAll("[data-ln-attr]");
  for (let m = 0; m < y.length; m++) {
    const a = y[m], h = a.getAttribute("data-ln-attr").split(",");
    for (let o = 0; o < h.length; o++) {
      const d = h[o].trim().split(":");
      if (d.length !== 2) continue;
      const u = d[0].trim(), c = d[1].trim();
      s[c] != null && a.setAttribute(u, s[c]);
    }
  }
  const _ = l.querySelectorAll("[data-ln-show]");
  for (let m = 0; m < _.length; m++) {
    const a = _[m], h = a.getAttribute("data-ln-show");
    h in s && a.classList.toggle("hidden", !s[h]);
  }
  const p = l.querySelectorAll("[data-ln-class]");
  for (let m = 0; m < p.length; m++) {
    const a = p[m], h = a.getAttribute("data-ln-class").split(",");
    for (let o = 0; o < h.length; o++) {
      const d = h[o].trim().split(":");
      if (d.length !== 2) continue;
      const u = d[0].trim(), c = d[1].trim();
      c in s && a.classList.toggle(u, !!s[c]);
    }
  }
  return l;
}
function Pe(l, s) {
  l.matches && l.matches("[data-ln-form], [data-ln-fillable]") && l.dispatchEvent(new CustomEvent("ln-fill", { detail: s ?? null, bubbles: !0 }));
  const b = l.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let y = 0; y < b.length; y++)
    b[y].dispatchEvent(new CustomEvent("ln-fill", { detail: s ?? null, bubbles: !0 }));
  return l;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(l) {
  if (!(!l.target.matches || !l.target.matches("[data-ln-fillable]")))
    if (l.detail)
      lt(l.target, l.detail);
    else {
      const s = l.target.querySelectorAll("[data-ln-field]");
      for (let b = 0; b < s.length; b++)
        s[b].textContent = "";
    }
})));
function Rt(l, s) {
  if (!l || !s) return l;
  const b = document.createTreeWalker(l, NodeFilter.SHOW_TEXT);
  for (; b.nextNode(); ) {
    const p = b.currentNode;
    p.textContent.indexOf("{{") !== -1 && (p.textContent = p.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(m, a) {
        return s[a] !== void 0 ? s[a] : "";
      }
    ));
  }
  const y = function(p, m) {
    return s[m] !== void 0 ? s[m] : "";
  }, _ = Array.from(l.querySelectorAll("*"));
  l.nodeType === 1 && _.push(l);
  for (let p = 0; p < _.length; p++) {
    const m = _[p], a = m.attributes;
    for (let h = 0; h < a.length; h++) {
      const o = a[h];
      o.value.indexOf("{{") !== -1 && m.setAttribute(o.name, o.value.replace(/\{\{\s*(\w+)\s*\}\}/g, y));
    }
  }
  return l;
}
function He(l, s, b, y, _, p) {
  const m = {};
  for (let h = 0; h < l.children.length; h++) {
    const o = l.children[h], d = o.getAttribute("data-ln-key");
    d && (m[d] = o);
  }
  const a = document.createDocumentFragment();
  for (let h = 0; h < s.length; h++) {
    const o = s[h], d = String(y(o));
    let u = m[d];
    if (u)
      _(u, o, h);
    else {
      const c = Nt(b, p);
      if (!c || (Rt(c, o), u = c.firstElementChild, !u)) continue;
      u.setAttribute("data-ln-key", d), _(u, o, h);
    }
    a.appendChild(u);
  }
  l.textContent = "", l.appendChild(a);
}
function ft(l, s) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      ft(l, s);
    }), console.warn("[" + s + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  l();
}
function _t(l, s, b) {
  if (l) {
    const y = l.querySelector('[data-ln-template="' + s + '"]');
    if (y) return y.content.cloneNode(!0);
  }
  return Nt(s, b);
}
function te(l, s) {
  const b = {}, y = l.querySelectorAll("[" + s + "]");
  for (let _ = 0; _ < y.length; _++)
    b[y[_].getAttribute(s)] = y[_].textContent, y[_].remove();
  return b;
}
function jt(l, s, b, y) {
  if (l.nodeType !== 1) return;
  const p = s.indexOf("[") !== -1 || s.indexOf(".") !== -1 || s.indexOf("#") !== -1 ? s : "[" + s + "]", m = Array.from(l.querySelectorAll(p));
  l.matches && l.matches(p) && m.push(l);
  for (const a of m)
    a[b] || (a[b] = new y(a));
}
function Ft(l) {
  return !!(l.offsetWidth || l.offsetHeight || l.getClientRects().length);
}
function Be(l) {
  const s = l.querySelector('input[name="_method"]');
  return ((s && s.value !== "" ? s.value : l.method) || "").toUpperCase();
}
function me(l, s) {
  const b = !!(s && s.typed), y = s && s.exclude, _ = {}, p = l.elements, m = {};
  if (b)
    for (let a = 0; a < p.length; a++) {
      const h = p[a];
      h.name && h.type === "checkbox" && !h.disabled && (m[h.name] = (m[h.name] || 0) + 1);
    }
  for (let a = 0; a < p.length; a++) {
    const h = p[a];
    if (!(!h.name || h.disabled || h.type === "file" || h.type === "submit" || h.type === "button") && !(y && h.matches && h.matches(y)))
      if (h.type === "checkbox")
        b && m[h.name] === 1 ? _[h.name] = h.checked : (_[h.name] || (_[h.name] = []), h.checked && _[h.name].push(h.value));
      else if (h.type === "radio")
        h.checked && (_[h.name] = h.value);
      else if (h.type === "select-multiple") {
        _[h.name] = [];
        for (let o = 0; o < h.options.length; o++)
          h.options[o].selected && _[h.name].push(h.options[o].value);
      } else if (b && h.type === "hidden")
        _[h.name] = h.value;
      else if (b && (h.type === "number" || h.type === "range")) {
        const o = Number(h.value);
        _[h.name] = h.value === "" || isNaN(o) ? null : o;
      } else
        _[h.name] = h.value;
  }
  return _;
}
function Ue(l) {
  if (typeof l != "string") return !!l;
  const s = l.trim().toLowerCase();
  return s !== "false" && s !== "0" && s !== "" && s !== "off" && s !== "no";
}
function ge(l, s) {
  const b = l.elements, y = [], _ = {};
  for (let p = 0; p < b.length; p++) {
    const m = b[p];
    m.name && m.type === "checkbox" && (_[m.name] = (_[m.name] || 0) + 1);
  }
  for (let p = 0; p < b.length; p++) {
    const m = b[p];
    if (m.type === "file" || m.type === "submit" || m.type === "button") continue;
    const a = m.getAttribute("data-ln-fill-as") || m.name;
    if (!a || !(a in s)) continue;
    const h = s[a];
    if (m.type === "checkbox") {
      if (Array.isArray(h))
        m.checked = h.indexOf(m.value) !== -1;
      else if (_[m.name] > 1) {
        const o = String(h).split(",").map(function(d) {
          return d.trim();
        });
        m.checked = o.indexOf(m.value) !== -1;
      } else
        m.checked = Ue(h);
      y.push(m);
    } else if (m.type === "radio")
      m.checked = m.value === String(h), y.push(m);
    else if (m.type === "select-multiple") {
      if (Array.isArray(h))
        for (let o = 0; o < m.options.length; o++)
          m.options[o].selected = h.indexOf(m.options[o].value) !== -1;
      y.push(m);
    } else
      m.value = h, y.push(m);
  }
  return y;
}
const se = {
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
function $(l) {
  const s = l ? l.closest("[lang]") : null, b = (s ? s.getAttribute("lang") || s.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!b) return "en-US";
  const y = b.trim().toLowerCase();
  return y.indexOf("-") === -1 && se[y] ? se[y] : b;
}
function Ct(l) {
  return l.hasAttribute("data-ln-value") ? l.getAttribute("data-ln-value") : l.textContent.trim();
}
function xt(l) {
  let s = !1;
  for (let b = 0; b < l.length; b++) {
    const y = l[b];
    if (!(y === "" || y == null) && (s = !0, !Number.isFinite(Number(y))))
      return "string";
  }
  return s ? "number" : "string";
}
function kt(l, s, b, y) {
  if (b === "number") {
    const m = parseFloat(l), a = parseFloat(s);
    return (isNaN(m) ? 0 : m) - (isNaN(a) ? 0 : a);
  }
  const _ = l != null ? String(l) : "", p = s != null ? String(s) : "";
  return y ? y.compare(_, p) : _ < p ? -1 : _ > p ? 1 : 0;
}
function _e(l, s, { get: b, set: y }) {
  Object.defineProperty(l, "value", {
    get: function() {
      return b ? b.call(this) : s.get.call(this);
    },
    set: function(_) {
      y ? y.call(this, _, (p) => s.set.call(this, p)) : s.set.call(this, _);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function ze() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function Vt() {
  if (typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1), window.lnCore._bootHolds === 0 && window.lnCore._bootQueue)) {
    const l = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let s = 0; s < l.length; s++)
      l[s]();
  }
}
function Ke() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function ct(l) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(l) : setTimeout(l, 0)) : l();
}
function U(l, s, b, y, _ = {}) {
  const p = _.extraAttributes || [], m = _.onAttributeChange || null, a = _.onInit || null;
  function h(d) {
    const u = d || document.body;
    jt(u, l, s, b), a && a(u);
  }
  ft(function() {
    const d = new MutationObserver(function(c) {
      for (let g = 0; g < c.length; g++) {
        const i = c[g];
        if (i.type === "childList") {
          for (let r = 0; r < i.addedNodes.length; r++) {
            const t = i.addedNodes[r];
            t.nodeType === 1 && (jt(t, l, s, b), a && a(t));
          }
          for (let r = 0; r < i.removedNodes.length; r++) {
            const t = i.removedNodes[r];
            if (t.nodeType === 1) {
              const n = l.indexOf("[") !== -1 || l.indexOf(".") !== -1 || l.indexOf("#") !== -1 ? l : "[" + l + "]", f = Array.from(t.querySelectorAll(n));
              t.matches && t.matches(n) && f.push(t);
              for (let v = 0; v < f.length; v++) {
                const E = f[v];
                if (!document.contains(E)) {
                  const w = E[s];
                  w && typeof w.destroy == "function" && w.destroy();
                }
              }
            }
          }
        } else i.type === "attributes" && (m && i.target[s] ? m(i.target, i.attributeName) : (jt(i.target, l, s, b), a && a(i.target)));
      }
    });
    let u = [];
    if (l.indexOf("[") !== -1) {
      const c = /\[([\w-]+)/g;
      let g;
      for (; (g = c.exec(l)) !== null; )
        u.push(g[1]);
    } else
      u.push(l);
    d.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: u.concat(p)
    });
  }, y || (l.indexOf("[") === -1 ? l.replace("data-", "") : "component")), window[s] = h;
  function o() {
    Ke() > 0 ? ct(function() {
      h(document.body);
    }) : h(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o(), h;
}
function be(l, s) {
  if (l.ctrlKey || l.metaKey || l.shiftKey || l.altKey || l.button !== 0 || !s) return !1;
  const b = s.getAttribute("href");
  return !(!b || s.getAttribute("target") === "_blank" || s.hasAttribute("download") || b.startsWith("mailto:") || b.startsWith("tel:") || b === "#" || b.startsWith("#") || s.hostname && s.hostname !== window.location.hostname);
}
function tt(...l) {
  return l.filter((s) => s != null && s !== "").map((s, b) => b === 0 ? s.replace(/\/+$/, "") : s.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function St(l, s) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, l, s ? { Authorization: s } : null);
}
function ye(l, s = "ln-core") {
  try {
    return l ? JSON.parse(l) : {};
  } catch (b) {
    return console.error(`[${s}] Invalid headers JSON:`, b), {};
  }
}
const ve = {};
function je(l, s) {
  ve[l] = s;
}
function Ve(l) {
  return ve[l] || { ingress: (s) => s, egress: (s) => s };
}
const we = {};
function ee(l, s) {
  if (!l || typeof s != "object") return;
  const b = l.toLowerCase().split("-")[0];
  we[b] = s;
}
function Dt(l) {
  if (!l) return null;
  const s = l.toLowerCase().split("-")[0];
  return we[s] || null;
}
ee("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = je, window.lnCore.getDataMapper = Ve, window.lnCore.registerLocaleFallback = ee, window.lnCore.getLocaleFallback = Dt, window.lnCore.fillTemplate = Rt, window.lnCore.fill = lt, window.lnCore.lnFill = Pe, window.lnCore.renderList = He);
function ne(l, s) {
  let b = !1;
  return function() {
    b || (b = !0, queueMicrotask(function() {
      b = !1, l();
    }));
  };
}
function Ee(l) {
  l = l || {};
  let s = l.windowSize > 0 ? l.windowSize : 1e3, b = l.pageSize > 0 ? l.pageSize : 200, y = l.threshold != null ? l.threshold : 25, _ = l.fetchDebounce != null ? l.fetchDebounce : 120;
  const p = typeof l.requestPage == "function" ? l.requestPage : function() {
  }, m = typeof l.onChange == "function" ? l.onChange : function() {
  }, a = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  let d = 0, u = 0, c = 0, g = { sort: null, filters: {}, search: "" }, i = null, r = 0, t = 0, e = !1;
  function n(w) {
    h.set(w, ++r);
  }
  function f() {
    return !!(g && (g.search || g.filters && Object.keys(g.filters).length));
  }
  function v() {
    if (a.size <= s) return;
    const w = Array.from(a.keys()).sort(function(S, q) {
      return (h.get(S) || 0) - (h.get(q) || 0);
    });
    let A = 0;
    for (; a.size > s && A < w.length; )
      a.delete(w[A]), h.delete(w[A]), A++;
  }
  function E(w, A) {
    o.add(w), p(g, w, A);
  }
  return {
    get: function(w) {
      return a.get(w);
    },
    has: function(w) {
      return a.has(w);
    },
    peek: function() {
      return a.size ? a.values().next().value : void 0;
    },
    get logicalTotal() {
      return d;
    },
    get grandTotal() {
      return u;
    },
    get queryGen() {
      return c;
    },
    get size() {
      return a.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(w, A) {
      clearTimeout(i), t = w;
      for (let R = w; R < A; R++)
        a.has(R) && n(R);
      if (d <= 0) return;
      const S = Math.max(0, w - y), q = Math.min(d, A + y), x = Math.floor(S / b), D = Math.floor(Math.max(0, q - 1) / b);
      let k = -1;
      for (let R = x; R <= D; R++) {
        const F = R * b, B = Math.min(b, d - F);
        let z = !1;
        const j = Math.max(F, S), K = Math.min(F + B, q);
        for (let et = j; et < K; et++)
          if (!a.has(et)) {
            z = !0;
            break;
          }
        if (z && !o.has(F)) {
          k = F;
          break;
        }
      }
      k !== -1 && (i = setTimeout(function() {
        E(k, b);
      }, _));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    ingest: function(w) {
      if (w = w || {}, w.queryGen != null && w.queryGen !== c) return;
      e && (a.clear(), h.clear(), e = !1), u = w.total != null ? w.total : u, d = w.filtered != null ? w.filtered : w.data ? w.data.length : d;
      const A = w.offset || 0, S = w.data || [];
      for (let q = 0; q < S.length; q++)
        S[q] != null && (a.set(A + q, S[q]), n(A + q));
      o.delete(A), v(), m();
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(w) {
      w && (g = w), E(0, b);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(w) {
      c++, o.clear(), clearTimeout(i), w && (g = w), e = !0, E(0, b);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      c++, o.clear(), clearTimeout(i), e = !0;
      const w = Math.max(0, Math.floor(t / b) * b);
      E(w, b);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(w) {
      o.delete(w);
    },
    destroy: function() {
      clearTimeout(i), a.clear(), h.clear(), o.clear();
    },
    configure: function(w) {
      w = w || {};
      let A = !1;
      if (w.windowSize != null && w.windowSize > 0 && w.windowSize !== s) {
        const S = w.windowSize < s;
        s = w.windowSize, S && v(), A = !0;
      }
      w.pageSize != null && w.pageSize > 0 && (b = w.pageSize), w.threshold != null && w.threshold >= 0 && (y = w.threshold), w.fetchDebounce != null && w.fetchDebounce >= 0 && (_ = w.fetchDebounce), A && m();
    },
    setGrandTotal: function(w) {
      w == null || isNaN(w) || w < 0 || (u = w, f() || (d = w), m());
    }
  };
}
const We = "ln:";
let wt = null;
function Ae() {
  if (wt !== null) return wt;
  try {
    if (typeof localStorage > "u")
      return wt = !1, !1;
    const l = "__ln_test__";
    localStorage.setItem(l, l), localStorage.removeItem(l), wt = !0;
  } catch {
    wt = !1;
  }
  return wt;
}
function Ge() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function Se(l, s) {
  const b = s.getAttribute("data-ln-persist"), y = b !== null && b !== "" ? b : s.id;
  return y ? We + l + ":" + Ge() + ":" + y : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', s), null);
}
function Bt(l, s) {
  if (!Ae()) return null;
  const b = Se(l, s);
  if (!b) return null;
  try {
    const y = localStorage.getItem(b);
    return y !== null ? JSON.parse(y) : null;
  } catch {
    return null;
  }
}
function yt(l, s, b) {
  if (!Ae()) return;
  const y = Se(l, s);
  if (y)
    try {
      b == null ? localStorage.removeItem(y) : localStorage.setItem(y, JSON.stringify(b));
    } catch {
    }
}
function Ce(l) {
  return (l || "").replace(/^#/, "");
}
function Ut(l) {
  const s = l === void 0 ? location.hash : l, b = {}, y = Ce(s);
  if (!y) return b;
  const _ = y.split("&");
  for (let p = 0; p < _.length; p++) {
    const m = _[p];
    if (!m) continue;
    const a = m.indexOf(":"), h = a > -1 ? m.slice(0, a) : m, o = a > -1 ? m.slice(a + 1) : "";
    if (h)
      try {
        b[h] = decodeURIComponent(o);
      } catch {
        b[h] = o;
      }
  }
  return b;
}
function rt(l) {
  if (!l) return null;
  const s = Ut();
  return l in s ? s[l] : null;
}
function it(l, s) {
  if (!l) return;
  const b = Ut();
  s == null ? delete b[l] : b[l] = String(s);
  const _ = Object.keys(b).map(function(p) {
    const m = b[p];
    return m === "" ? p : p + ":" + encodeURIComponent(m);
  }).join("&");
  Ce(location.hash) !== _ && (location.hash = _);
}
function ie(l) {
  return l.button === 1 || l.ctrlKey || l.metaKey || l.shiftKey ? !1 : (l.preventDefault(), !0);
}
function vt(l, s) {
  if (!l || !l.hasAttribute("data-ln-hash")) return null;
  const b = l.getAttribute("data-ln-hash");
  if (b && b.trim() !== "") return b.trim();
  const y = l.getAttribute("data-ln-sort") || l.getAttribute("data-ln-search-for") || l.getAttribute("data-ln-search") || l.getAttribute("data-ln-filter") || l.id;
  return y ? s ? y + "-" + s : y : s || null;
}
function Le(l, s) {
  return !s || s === "none" || l === null || l === void 0 ? null : String(l) + "." + s;
}
function Gt(l) {
  return !l || typeof l != "string" ? null : l.endsWith(".asc") ? { fieldOrColumn: l.slice(0, -4), direction: "asc" } : l.endsWith(".desc") ? { fieldOrColumn: l.slice(0, -5), direction: "desc" } : null;
}
function Te(l, s) {
  return !l || !Array.isArray(s) || s.length === 0 ? null : l + ":" + s.map(encodeURIComponent).join(",");
}
function Qt(l) {
  if (!l || typeof l != "string") return null;
  const s = l.indexOf(":");
  if (s === -1) return null;
  const b = l.slice(0, s), y = l.slice(s + 1), _ = y ? y.split(",").map(function(p) {
    try {
      return decodeURIComponent(p);
    } catch {
      return p;
    }
  }).filter(Boolean) : [];
  return { key: b, values: _ };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Ut, window.lnCore.hashGet = rt, window.lnCore.hashSet = it, window.lnCore.hashLinkClick = ie, window.lnCore.resolveHashNamespace = vt, window.lnCore.hashSortEncode = Le, window.lnCore.hashSortDecode = Gt, window.lnCore.hashFilterEncode = Te, window.lnCore.hashFilterDecode = Qt);
function Pt(l, s, b, y) {
  const _ = typeof y == "number" ? y : 4, p = window.innerWidth, m = window.innerHeight, a = s.width, h = s.height, o = (b || "bottom").split("-"), d = o[0], u = o[1] === "start" || o[1] === "end" ? o[1] : "center", c = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, g = c[d] || c.bottom;
  function i(f) {
    return f === "top" || f === "bottom" ? u === "start" ? l.left : u === "end" ? l.right - a : l.left + (l.width - a) / 2 : u === "start" ? l.top : u === "end" ? l.bottom - h : l.top + (l.height - h) / 2;
  }
  function r(f) {
    let v, E, w = !0;
    return f === "top" ? (v = l.top - _ - h, E = i(f), v < 0 && (w = !1)) : f === "bottom" ? (v = l.bottom + _, E = i(f), v + h > m && (w = !1)) : f === "left" ? (v = i(f), E = l.left - _ - a, E < 0 && (w = !1)) : (v = i(f), E = l.right + _, E + a > p && (w = !1)), { top: v, left: E, side: f, fits: w };
  }
  let t = null;
  for (let f = 0; f < g.length; f++) {
    const v = r(g[f]);
    if (v.fits) {
      t = v;
      break;
    }
  }
  t || (t = r(g[0]));
  let e = t.top, n = t.left;
  return a >= p ? n = 0 : (n < 0 && (n = 0), n + a > p && (n = p - a)), h >= m ? e = 0 : (e < 0 && (e = 0), e + h > m && (e = m - h)), { top: e, left: n, placement: t.side };
}
function $t(l) {
  if (!l) return { width: 0, height: 0 };
  const s = l.style, b = s.visibility, y = s.display, _ = s.position;
  s.visibility = "hidden", s.display = "block", s.position = "fixed";
  const p = l.offsetWidth, m = l.offsetHeight;
  return s.visibility = b, s.display = y, s.position = _, { width: p, height: m };
}
let gt = null;
async function ae(l) {
  if (!l) {
    gt = null;
    return;
  }
  try {
    const s = new TextEncoder(), b = await crypto.subtle.digest("SHA-256", s.encode(l));
    gt = await crypto.subtle.importKey(
      "raw",
      b,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (s) {
    console.error("[ln-core/crypto] Key derivation failed:", s), gt = null;
  }
}
function bt() {
  return gt;
}
async function Qe(l, s = gt) {
  const b = s || gt;
  if (!b || l === void 0 || l === null) return l;
  try {
    const y = new TextEncoder(), _ = crypto.getRandomValues(new Uint8Array(12)), p = typeof l == "string" ? l : JSON.stringify(l), m = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: _ },
      b,
      y.encode(p)
    ), a = btoa(String.fromCharCode(..._)), h = btoa(String.fromCharCode(...new Uint8Array(m)));
    return {
      encrypted: !0,
      iv: a,
      data: h
    };
  } catch (y) {
    return console.error("[ln-core/crypto] Encryption failed:", y), l;
  }
}
async function $e(l, s = gt) {
  const b = s || gt;
  if (!l || !l.encrypted || !b) return l;
  try {
    const y = new TextDecoder(), _ = Uint8Array.from(atob(l.iv), (h) => h.charCodeAt(0)), p = Uint8Array.from(atob(l.data), (h) => h.charCodeAt(0)), m = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: _ },
      b,
      p
    ), a = y.decode(m);
    try {
      return JSON.parse(a);
    } catch {
      return a;
    }
  } catch (y) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", y), { ...l, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const l = window.fetch.bind(window), s = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
  function y(o) {
    return typeof o == "string" ? o : o instanceof URL ? o.href : o instanceof Request ? o.url : String(o);
  }
  function _(o, d) {
    return d && d.method ? String(d.method).toUpperCase() : o instanceof Request ? o.method.toUpperCase() : "GET";
  }
  function p(o, d) {
    return d + " " + o;
  }
  function m(o) {
    return o === "GET" || o === "HEAD";
  }
  function a(o, d) {
    d = d || {};
    const u = y(o), c = _(o, d), g = p(u, c);
    m(c) && s.has(g) && (s.get(g).abort(), s.delete(g));
    const i = new AbortController(), r = d.signal;
    let t = null;
    r && (r.aborted ? i.abort(r.reason) : (t = function() {
      i.abort(r.reason);
    }, r.addEventListener("abort", t, { once: !0 })));
    const e = Object.assign({}, d, { signal: i.signal });
    return s.set(g, i), l(o, e).finally(function() {
      r && t && r.removeEventListener("abort", t), s.get(g) === i && s.delete(g);
    });
  }
  a.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = a;
  function h(o) {
    if (!o.detail || !o.detail.url) return;
    const d = o.target, u = (o.detail.method || (o.detail.body ? "POST" : "GET")).toUpperCase(), c = o.detail.key;
    c && b.has(c) && (b.get(c).abort(), b.delete(c));
    const g = new AbortController(), i = o.detail.signal;
    let r = null;
    i && (i.aborted ? g.abort(i.reason) : (r = function() {
      g.abort(i.reason);
    }, i.addEventListener("abort", r, { once: !0 }))), c && b.set(c, g);
    const t = { method: u, signal: g.signal };
    o.detail.body !== void 0 && (t.body = o.detail.body), window.fetch(o.detail.url, t).then(function(e) {
      i && r && i.removeEventListener("abort", r), c && b.get(c) === g && b.delete(c), L(d, "ln-http:response", {
        ok: e.ok,
        status: e.status,
        response: e
      });
    }).catch(function(e) {
      i && r && i.removeEventListener("abort", r), c && b.get(c) === g && b.delete(c), !(e && e.name === "AbortError") && L(d, "ln-http:error", {
        ok: !1,
        status: 0,
        error: e
      });
    });
  }
  document.addEventListener("ln-http:request", h), window.lnHttp = {
    cancel: function(o) {
      let d = !1;
      return s.forEach(function(u, c) {
        c.endsWith(" " + o) && (u.abort(), s.delete(c), d = !0);
      }), d;
    },
    cancelByKey: function(o) {
      return b.has(o) ? (b.get(o).abort(), b.delete(o), !0) : !1;
    },
    cancelAll: function() {
      s.forEach(function(o) {
        o.abort();
      }), s.clear(), b.forEach(function(o) {
        o.abort();
      }), b.clear();
    },
    get inflight() {
      const o = [];
      return s.forEach(function(d, u) {
        const c = u.indexOf(" ");
        o.push({ method: u.slice(0, c), url: u.slice(c + 1) });
      }), b.forEach(function(d, u) {
        o.push({ key: u });
      }), o;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", h), window.fetch = l, delete window.lnHttp;
    }
  };
})();
(function() {
  const l = "template[data-ln-include]", s = "lnInclude";
  if (window[s] !== void 0) return;
  const b = /* @__PURE__ */ new Map();
  function y(_) {
    if (this.dom = _, this.url = _.getAttribute("data-ln-include"), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    ze(), this._held = !0;
    const p = this, m = this.url;
    let a = b.get(m);
    return a || (a = fetch(m).then(function(h) {
      if (!h.ok)
        throw new Error("HTTP error! status: " + h.status);
      return h.text();
    }).catch(function(h) {
      throw b.delete(m), h;
    }), b.set(m, a)), a.then(function(h) {
      if (p._destroyed) return;
      const o = document.createElement("template");
      o.innerHTML = h, p.dom.content.appendChild(o.content), L(p.dom, "ln-include:loaded", { target: p.dom, url: p.url }), p._held && (p._held = !1, Vt());
    }).catch(function(h) {
      p._destroyed || (console.error("[ln-include] Failed to fetch template from " + p.url + ":", h), L(p.dom, "ln-include:error", { target: p.dom, url: p.url, error: h }), p._held && (p._held = !1, Vt()));
    }), this;
  }
  y.prototype.destroy = function() {
    this.dom[s] && (this._destroyed = !0, this._held && (this._held = !1, Vt()), delete this.dom[s]);
  }, U(l, s, y, "ln-include");
})();
(function() {
  const l = "data-ln-form", s = "lnForm", b = "data-ln-form-action-edit", y = "data-ln-form-action-method";
  if (window[s] !== void 0) return;
  function _(p) {
    this.dom = p, this._baseAction = p.getAttribute("action") || "";
    const m = this;
    return this._onLnFill = function(a) {
      a.target === m.dom && (a.detail ? (m.fill(a.detail), m._applyActionMode(a.detail)) : m.dom.reset());
    }, this._onReset = function() {
      m._applyActionMode(null);
    }, p.addEventListener("ln-fill", this._onLnFill), p.addEventListener("reset", this._onReset), this;
  }
  _.prototype.fill = function(p) {
    const m = ge(this.dom, p);
    for (let a = 0; a < m.length; a++) {
      const h = m[a], o = h.tagName === "SELECT" || h.type === "checkbox" || h.type === "radio";
      h.dispatchEvent(new Event(o ? "change" : "input", { bubbles: !0 }));
    }
  }, _.prototype._ensureMethodInput = function() {
    let p = this.dom.querySelector('input[name="_method"]');
    return p || (p = document.createElement("input"), p.type = "hidden", p.name = "_method", p.value = "", this.dom.appendChild(p)), p;
  }, _.prototype._applyActionMode = function(p) {
    if (!this.dom.hasAttribute(b)) return;
    const m = p && p.id != null && p.id !== "" ? p.id : null, a = this._ensureMethodInput();
    if (m !== null) {
      const h = this.dom.getAttribute(b);
      h ? this.dom.setAttribute("action", h.replace(":id", encodeURIComponent(m))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(m)), a.value = this.dom.getAttribute(y) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), a.value = "";
  }, _.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), L(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[s]);
  }, U(l, s, _, "ln-form");
})();
(function() {
  const l = "data-ln-validate", s = "lnValidate", b = "data-ln-validate-errors", y = "data-ln-validate-error", _ = "ln-validate-valid", p = "ln-validate-invalid", m = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[s] !== void 0) return;
  function a(h) {
    this.dom = h, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const o = this, d = h.tagName, u = h.type, c = d === "SELECT" || u === "checkbox" || u === "radio";
    this._onInput = function() {
      o._touched = !0, o.validate();
    }, this._onChange = function() {
      o._touched = !0, o.validate();
    }, this._onSetCustom = function(i) {
      const r = i.detail && i.detail.error;
      if (!r) return;
      o._customErrors.add(r), o._touched = !0;
      const t = h.closest(".form-element");
      if (t) {
        const e = t.querySelector("[" + y + '="' + r + '"]');
        e && e.classList.remove("hidden");
      }
      h.classList.remove(_), h.classList.add(p), h.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(i) {
      const r = i.detail && i.detail.error, t = h.closest(".form-element");
      if (r) {
        if (o._customErrors.delete(r), t) {
          const e = t.querySelector("[" + y + '="' + r + '"]');
          e && e.classList.add("hidden");
        }
      } else
        o._customErrors.forEach(function(e) {
          if (t) {
            const n = t.querySelector("[" + y + '="' + e + '"]');
            n && n.classList.add("hidden");
          }
        }), o._customErrors.clear();
      o._touched && o.validate();
    }, c || h.addEventListener("input", this._onInput), h.addEventListener("change", this._onChange), h.addEventListener("ln-validate:set-custom", this._onSetCustom), h.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const g = h.form;
    return g && (g.hasAttribute("novalidate") || g.setAttribute("novalidate", ""), this._onFormReset = function() {
      o.reset();
    }, this._onValidateRequest = function(i) {
      o._touched = !0, !o.validate() && i.detail && i.detail.invalidFields && i.detail.invalidFields.push(o.dom);
    }, g.addEventListener("reset", this._onFormReset), g.addEventListener("ln-validate:request-validate", this._onValidateRequest), g._lnValidateGateBound || (g._lnValidateGateBound = !0, g.addEventListener("submit", function(i) {
      const r = { invalidFields: [] };
      L(g, "ln-validate:request-validate", r), r.invalidFields.length > 0 && (i.preventDefault(), r.invalidFields.sort((t, e) => t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), r.invalidFields[0].focus());
    }))), this;
  }
  a.prototype.validate = function() {
    const h = this.dom, o = h.validity, u = h.checkValidity() && this._customErrors.size === 0, c = h.closest(".form-element");
    if (c) {
      const i = c.querySelector("[" + b + "]");
      if (i) {
        const r = i.querySelectorAll("[" + y + "]");
        for (let t = 0; t < r.length; t++) {
          const e = r[t].getAttribute(y), n = m[e];
          n && (o[n] ? r[t].classList.remove("hidden") : r[t].classList.add("hidden"));
        }
      }
    }
    return h.classList.toggle(_, u), h.classList.toggle(p, !u), h.setAttribute("aria-invalid", u ? "false" : "true"), L(h, u ? "ln-validate:valid" : "ln-validate:invalid", { target: h, field: h.name }), u;
  }, a.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(_, p), this.dom.removeAttribute("aria-invalid");
    const h = this.dom.closest(".form-element");
    if (h) {
      const o = h.querySelectorAll("[" + y + "]");
      for (let d = 0; d < o.length; d++)
        o[d].classList.add("hidden");
    }
  }, Object.defineProperty(a.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), a.prototype.destroy = function() {
    if (!this.dom[s]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const h = this.dom.form;
    h && (this._onFormReset && h.removeEventListener("reset", this._onFormReset), this._onValidateRequest && h.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(_, p), this.dom.removeAttribute("aria-invalid"), L(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[s];
  }, U(l, s, a, "ln-validate");
})();
(function() {
  const l = "data-ln-ajax", s = "lnAjax", b = "data-ln-form-scope";
  if (window[s] !== void 0) return;
  function y(u) {
    if (!u.hasAttribute(l) || u[s]) return;
    u[s] = !0;
    const c = h(u);
    _(c.links), p(c.forms);
  }
  function _(u) {
    for (const c of u) {
      if (c[s + "Trigger"] || c.hostname && c.hostname !== window.location.hostname) continue;
      const g = c.getAttribute("href");
      if (g && g.includes("#")) continue;
      const i = function(r) {
        if (!be(r, c)) return;
        r.preventDefault();
        const t = c.getAttribute("href");
        t && a("GET", t, null, c);
      };
      c.addEventListener("click", i), c[s + "Trigger"] = i;
    }
  }
  function p(u) {
    for (const c of u) {
      if (c[s + "Trigger"]) continue;
      if (c.hasAttribute(b)) {
        c[s + "ScopeWarned"] || (c[s + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const g = function(i) {
        if (i.defaultPrevented) return;
        i.preventDefault();
        const r = c.method.toUpperCase(), t = c.action, e = new FormData(c);
        for (const n of c.querySelectorAll('button, input[type="submit"]'))
          n.disabled = !0;
        a(r, t, e, c, function() {
          for (const n of c.querySelectorAll('button, input[type="submit"]'))
            n.disabled = !1;
        });
      };
      c.addEventListener("submit", g), c[s + "Trigger"] = g;
    }
  }
  function m(u) {
    if (!u[s]) return;
    const c = h(u);
    for (const g of c.links)
      g[s + "Trigger"] && (g.removeEventListener("click", g[s + "Trigger"]), delete g[s + "Trigger"]);
    for (const g of c.forms)
      g[s + "Trigger"] && (g.removeEventListener("submit", g[s + "Trigger"]), delete g[s + "Trigger"]);
    delete u[s];
  }
  function a(u, c, g, i, r) {
    if (X(i, "ln-ajax:before-start", { method: u, url: c }).defaultPrevented) return;
    L(i, "ln-ajax:start", { method: u, url: c }), i.classList.add("ln-ajax--loading");
    const e = document.createElement("span");
    e.className = "ln-ajax-spinner", i.appendChild(e);
    function n() {
      i.classList.remove("ln-ajax--loading");
      const A = i.querySelector(".ln-ajax-spinner");
      A && A.remove(), r && r();
    }
    let f = c;
    const v = document.querySelector('meta[name="csrf-token"]'), E = v ? v.getAttribute("content") : null;
    g instanceof FormData && E && g.append("_token", E);
    const w = {
      method: u,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (E && (w.headers["X-CSRF-TOKEN"] = E), u === "GET" && g) {
      const A = new URLSearchParams(g);
      f = c + (c.includes("?") ? "&" : "?") + A.toString();
    } else u !== "GET" && g && (w.body = g);
    fetch(f, w).then(function(A) {
      const S = A.ok;
      return A.json().then(function(q) {
        return { ok: S, status: A.status, data: q };
      });
    }).then(function(A) {
      const S = A.data;
      if (A.ok) {
        if (S.title && (document.title = S.title), S.content)
          for (const q in S.content) {
            const x = document.getElementById(q);
            x && (x.innerHTML = S.content[q]);
          }
        if (i.tagName === "A") {
          const q = i.getAttribute("href");
          q && window.history.pushState({ ajax: !0 }, "", q);
        } else i.tagName === "FORM" && i.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", f);
        L(i, "ln-ajax:success", { method: u, url: f, data: S });
      } else
        L(i, "ln-ajax:error", { method: u, url: f, status: A.status, data: S });
      if (S.message) {
        const q = S.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: q.type || (A.ok ? "success" : "error"),
            title: q.title || "",
            message: q.body || ""
          }
        }));
      }
      L(i, "ln-ajax:complete", { method: u, url: f }), n();
    }).catch(function(A) {
      L(i, "ln-ajax:error", { method: u, url: f, error: A }), L(i, "ln-ajax:complete", { method: u, url: f }), n();
    });
  }
  function h(u) {
    const c = { links: [], forms: [] };
    return u.tagName === "A" && u.getAttribute(l) !== "false" ? c.links.push(u) : u.tagName === "FORM" && u.getAttribute(l) !== "false" ? c.forms.push(u) : (c.links = Array.from(u.querySelectorAll('a:not([data-ln-ajax="false"])')), c.forms = Array.from(u.querySelectorAll('form:not([data-ln-ajax="false"])'))), c;
  }
  function o() {
    ft(function() {
      new MutationObserver(function(c) {
        for (const g of c)
          if (g.type === "childList") {
            for (const i of g.addedNodes)
              if (i.nodeType === 1 && (y(i), !i.hasAttribute(l))) {
                for (const t of i.querySelectorAll("[" + l + "]"))
                  y(t);
                const r = i.closest && i.closest("[" + l + "]");
                if (r && r.getAttribute(l) !== "false") {
                  const t = h(i);
                  _(t.links), p(t.forms);
                }
              }
          } else g.type === "attributes" && y(g.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [l]
      });
    }, "ln-ajax");
  }
  function d() {
    for (const u of document.querySelectorAll("[" + l + "]"))
      y(u);
  }
  window[s] = y, window[s].destroy = m, o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", d) : d();
})();
const qe = {
  navigate: function(l) {
    It(l, { historyAction: "push" });
  },
  replace: function(l) {
    It(l, { historyAction: "replace" });
  },
  current: function() {
    return Xt ? {
      path: Yt,
      params: De,
      query: Ie,
      route: Xt,
      regions: ke
    } : null;
  }
}, re = "data-ln-route", xe = "lnRoute";
typeof window < "u" && (window.lnRouter = qe);
const ht = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new WeakMap();
let ke = /* @__PURE__ */ new Map(), ce = !1, Yt = null, De = {}, Ie = {}, Xt = null, Jt = !1;
function de(l, s, b) {
  Jt ? queueMicrotask(function() {
    L(l, s, b);
  }) : L(l, s, b);
}
function Ht(l) {
  try {
    const p = new URL(l, window.location.origin);
    l = p.pathname + p.search + p.hash;
  } catch {
  }
  let [s] = l.split("#"), [b, y] = s.split("?");
  const _ = {};
  if (y) {
    const p = new URLSearchParams(y);
    for (const [m, a] of p.entries())
      _[m] = a;
  }
  return b = b.replace(/\/+$/, ""), b === "" && (b = "/"), { path: b, query: _ };
}
function Re(l, s) {
  if (l.pattern === "*") return 1;
  if (s.pattern === "*") return -1;
  const b = l.segments, y = s.segments, _ = Math.max(b.length, y.length);
  for (let p = 0; p < _; p++) {
    const m = b[p], a = y[p];
    if (m === void 0) return 1;
    if (a === void 0) return -1;
    if (m === "*") return 1;
    if (a === "*") return -1;
    const h = m.startsWith(":"), o = a.startsWith(":");
    if (h && !o) return 1;
    if (!h && o) return -1;
  }
  return 0;
}
function Oe(l, s) {
  const b = l.split("/").filter(Boolean);
  for (const y of s) {
    if (y.pattern === "*")
      return {
        route: y,
        params: { wildcard: l }
      };
    const _ = y.segments, p = {};
    let m = !0;
    if (!(b.length > _.length && _[_.length - 1] !== "*")) {
      for (let a = 0; a < _.length; a++) {
        const h = _[a], o = b[a];
        if (h === "*") {
          p.wildcard = b.slice(a).join("/");
          break;
        }
        if (o === void 0) {
          m = !1;
          break;
        }
        if (h.startsWith(":"))
          p[h.slice(1)] = decodeURIComponent(o);
        else if (h !== o) {
          m = !1;
          break;
        }
      }
      if (m && (_.indexOf("*") !== -1 || b.length <= _.length))
        return { route: y, params: p };
    }
  }
  return null;
}
function Zt(l, s) {
  if (l !== "__primary__") {
    const y = document.getElementById(s.target);
    return y || console.warn(`[ln-router] Explicit target element #${s.target} not found in DOM`), y;
  }
  const b = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return b || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), b;
}
function Ye(l) {
  if (!l) return;
  const s = Array.from(l.querySelectorAll("*")), b = [l].concat(s);
  for (const _ of b)
    for (const p of Object.keys(_))
      if (p.startsWith("ln") && _[p] && typeof _[p].destroy == "function")
        try {
          _[p].destroy();
        } catch (m) {
          console.error(`[ln-router] Error destroying component ${p} on element:`, _, m);
        }
  const y = document.querySelectorAll('[data-ln-popover="open"]');
  for (const _ of y) {
    const p = _.lnPopover;
    if (p && p.trigger && l.contains(p.trigger))
      try {
        p.destroy();
      } catch (m) {
        console.error("[ln-router] Error destroying open popover:", m);
      }
  }
}
function It(l, s = {}) {
  const { path: b, query: y } = Ht(l), _ = /* @__PURE__ */ new Map();
  for (const [d, u] of ht)
    _.set(d, Oe(b, u.sorted));
  const p = ht.has("__primary__"), m = _.get("__primary__");
  if (p && !m) {
    de(document.body, "ln-router:not-found", { path: b });
    return;
  }
  let a = null;
  if (m && (a = Zt("__primary__", m.route), !a || X(a, "ln-router:before-navigate", {
    from: Yt,
    to: l,
    params: m.params,
    query: y
  }).defaultPrevented))
    return;
  const h = [];
  for (const [d, u] of _) {
    if (!u) continue;
    const c = Zt(d, u.route);
    c && (d !== "__primary__" && c.hasAttribute("data-ln-route-keep") && le.get(c) === u.route.templateNode || h.push({ regionKey: d, match: u, targetEl: c }));
  }
  s.historyAction === "push" ? window.history.pushState(null, "", l) : s.historyAction === "replace" && window.history.replaceState(null, "", l);
  const o = function() {
    for (const { regionKey: d, match: u, targetEl: c } of h) {
      if (!(s.isHydration && c.hasAttribute("data-ln-router-hydrate") && c.children.length > 0)) {
        Ye(c);
        const i = u.route.templateNode.content.cloneNode(!0);
        c.replaceChildren(i);
      }
      if (le.set(c, u.route.templateNode), d === "__primary__" && (u.route.title && (document.title = u.route.title), !s.isHydration)) {
        c.hasAttribute("tabindex") || c.setAttribute("tabindex", "-1");
        const i = c.querySelector("h1, h2, h3, h4, h5, h6");
        i ? (i.setAttribute("tabindex", "-1"), i.focus()) : c.focus(), c.scrollIntoView({ block: "start", behavior: "instant" });
      }
      de(c, "ln-router:navigated", {
        path: l,
        params: u.params,
        query: y,
        route: u.route,
        target: c,
        region: d
      });
    }
    m && (Yt = l, De = m.params, Ie = y, Xt = m.route), ke = new Map(
      Array.from(_.entries()).map(([d, u]) => [d, u ? { route: u.route, params: u.params } : null])
    );
  };
  document.startViewTransition && !s.isHydration ? document.startViewTransition(o) : o();
}
function Xe(l) {
  const s = l.target.closest("a");
  if (!s || !be(l, s)) return;
  const b = s.getAttribute("href"), { path: y } = Ht(b), _ = ht.get("__primary__");
  if (!_) return;
  Oe(y, _.sorted) && (l.preventDefault(), It(b, { historyAction: "push" }));
}
function Je(l, s) {
  const b = Object.keys(l), y = Object.keys(s);
  if (b.length !== y.length) return !1;
  for (let _ = 0; _ < b.length; _++) {
    const p = b[_];
    if (l[p] !== s[p]) return !1;
  }
  return !0;
}
function Ze() {
  const l = window.location.pathname + window.location.search, s = qe.current();
  if (s && s.path != null) {
    const b = Ht(l);
    if (Ht(s.path).path === b.path && Je(s.query, b.query))
      return;
  }
  It(l, { historyAction: "skip" });
}
function tn() {
  ce || (ce = !0, ft(function() {
    document.addEventListener("click", Xe), window.addEventListener("popstate", Ze), Jt = !0;
    const l = window.location.pathname + window.location.search + window.location.hash;
    It(l, { historyAction: "replace", isHydration: !0 }), Jt = !1;
  }, "ln-router"));
}
function en(l) {
  const s = l.getAttribute(re);
  if (!s) return;
  const b = l.getAttribute("data-ln-route-target") || null;
  if (b === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${s}" rejected.`);
    return;
  }
  const y = b || "__primary__";
  ht.has(y) || ht.set(y, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const _ = ht.get(y);
  if (_.routes.has(s)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${s}" in region "${y}"`);
    return;
  }
  const p = l.getAttribute("data-ln-route-title"), m = s.split("/").filter(Boolean), a = {
    pattern: s,
    segments: m,
    target: b,
    title: p,
    templateNode: l
  }, h = Zt(y, a);
  h && h.contains(l) && console.warn(`[ln-router] Route template with pattern "${s}" is declared inside its own outlet element:`, l), _.routes.set(s, a), _.sorted = Array.from(_.routes.values()).sort(Re);
}
function nn(l) {
  const s = l.getAttribute(re);
  if (!s) return;
  const y = l.getAttribute("data-ln-route-target") || null || "__primary__", _ = ht.get(y);
  _ && (_.routes.delete(s), _.sorted = Array.from(_.routes.values()).sort(Re), _.routes.size === 0 && ht.delete(y));
}
function Me(l) {
  return this.dom = l, en(l), this;
}
Me.prototype.destroy = function() {
  nn(this.dom), delete this.dom[xe];
};
U(re, xe, Me, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    ht.size > 0 && tn();
  }
});
(function() {
  const l = "data-ln-modal", s = "lnModal";
  if (window[s] !== void 0) return;
  function b(_) {
    this.dom = _, this.isOpen = _.getAttribute(l) === "open";
    const p = this;
    return this._onRequestOpen = function() {
      p.dom.setAttribute(l, "open");
    }, this._onRequestClose = function() {
      p.dom.setAttribute(l, "close");
    }, this._onCancel = function(m) {
      m.preventDefault(), p.dom.setAttribute(l, "close");
    }, this._onClickClose = function(m) {
      const a = m.target.closest("[data-ln-modal-close]");
      a && p.dom.contains(a) && (m.preventDefault(), p.dom.setAttribute(l, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  b.prototype.destroy = function() {
    if (this.dom[s]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const _ = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + l + '="open"]'),
          function(m) {
            return m !== _;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      L(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[s];
    }
  };
  function y(_) {
    const p = _[s];
    if (!p) return;
    const a = _.getAttribute(l) === "open";
    if (a !== p.isOpen)
      if (a) {
        if (X(_, "ln-modal:before-open", { modalId: _.id, target: _ }).defaultPrevented) {
          _.setAttribute(l, "close");
          return;
        }
        p.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof _.showModal == "function" && _.showModal();
        const o = _.querySelector("[autofocus]");
        if (o && Ft(o))
          o.focus();
        else {
          const d = _.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), u = Array.prototype.find.call(d, Ft);
          if (u) u.focus();
          else {
            const c = _.querySelectorAll("a[href], button:not([disabled])"), g = Array.prototype.find.call(c, Ft);
            g && g.focus();
          }
        }
        L(_, "ln-modal:open", { modalId: _.id, target: _ });
      } else {
        if (X(_, "ln-modal:before-close", { modalId: _.id, target: _ }).defaultPrevented) {
          _.setAttribute(l, "open");
          return;
        }
        p.isOpen = !1, L(_, "ln-modal:close", { modalId: _.id, target: _ }), typeof _.close == "function" && _.close(), document.querySelector("[" + l + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  U(l, s, b, "ln-modal", {
    onAttributeChange: y
  });
})();
(function() {
  const l = "data-ln-modal-coordinator", s = "lnModalCoordinator";
  if (window[s] !== void 0) return;
  function b(u, c) {
    if (c) {
      if (u) {
        const i = u.closest("[" + l + "]");
        if (i) {
          if (i.id === c && i.hasAttribute("data-ln-modal")) return i;
          const r = i.querySelector("#" + CSS.escape(c) + '[data-ln-modal], [data-ln-modal="' + c + '"]');
          if (r) return r;
        }
      }
      const g = document.getElementById(c) || document.querySelector('[data-ln-modal="' + c + '"]');
      if (g) return g;
    }
    if (u) {
      const g = u.closest("[" + l + "]");
      if (g) {
        if (g.hasAttribute("data-ln-modal")) return g;
        const r = g.querySelector("[data-ln-modal]");
        if (r) return r;
      }
      const i = u.closest("[data-ln-modal]");
      if (i) return i;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function y(u, c) {
    if (u !== "edit") return "";
    if (c) {
      const g = c.getAttribute("data-ln-fill-id");
      if (g) return g;
    }
    return "edit";
  }
  function _(u) {
    if (!u) return;
    const c = u.querySelectorAll("[data-ln-field]");
    for (let i = 0; i < c.length; i++)
      c[i].textContent = "";
    const g = u.querySelectorAll("form");
    for (let i = 0; i < g.length; i++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(g[i], null) : g[i].reset();
  }
  document.addEventListener("submit", function(u) {
    if (u.defaultPrevented) return;
    const g = u.target.closest("[data-ln-modal]");
    if (g && g.id) {
      try {
        sessionStorage.setItem("ln-modal-pending:" + g.id, "true");
      } catch {
      }
      it(g.id, null);
    }
  }), document.addEventListener("click", function(u) {
    if (u.ctrlKey || u.metaKey || u.button === 1) return;
    const c = u.target.closest("[data-ln-modal-for]");
    if (c) {
      const i = c.getAttribute("data-ln-modal-for"), r = b(c, i);
      if (r && r.lnModal) {
        u.preventDefault();
        const t = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, e = {}, n = c.dataset;
        for (const E in n) {
          if (!E.startsWith("lnModal") || t[E]) continue;
          const w = E.slice(7);
          w && (e[w.charAt(0).toLowerCase() + w.slice(1)] = n[E]);
        }
        const f = Object.keys(e).length > 0;
        c.hasAttribute("data-ln-modal-mode") ? r.dataset.lnModalMode = c.getAttribute("data-ln-modal-mode") : r.dataset.lnModalMode = f ? "edit" : "new", f && window.lnCore && typeof window.lnCore.fill == "function" ? window.lnCore.fill(r, e) : r.dataset.lnModalMode === "new" && _(r), r.getAttribute("data-ln-modal") === "open" ? L(r, "ln-modal:request-close", {}) : (r.id && it(r.id, y(r.dataset.lnModalMode, c)), L(r, "ln-modal:request-open", {}));
      }
      return;
    }
    const g = u.target.closest('a[href^="#"]');
    if (g) {
      const i = Ut(g.getAttribute("href"));
      for (const r in i) {
        const t = document.getElementById(r);
        if (t && t.lnModal) {
          if (!ie(u)) return;
          it(r, i[r]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(u) {
    const c = u.target;
    if (!c || !c.lnModal) return;
    (c.dataset.lnModalMode || "new") === "new" && _(c);
  }), document.addEventListener("ln-modal:open", function(u) {
    const c = u.target;
    if (!c || !c.lnModal || !c.id) return;
    let g = rt(c.id);
    g === null && (g = y(c.dataset.lnModalMode, null), it(c.id, g)), g ? (c.dataset.lnModalMode = "edit", c.dispatchEvent(new CustomEvent("ln-fill:request", {
      bubbles: !0,
      detail: { id: g }
    }))) : (c.dataset.lnModalMode = "new", _(c));
  });
  let p = !1;
  function m() {
    if (!p) {
      p = !0;
      try {
        const u = document.querySelectorAll("[data-ln-modal][id]");
        for (let c = 0; c < u.length; c++) {
          const g = u[c];
          if (!g.lnModal) continue;
          const i = g.id, r = "ln-modal-pending:" + i;
          let t = !1;
          try {
            t = sessionStorage.getItem(r) === "true";
          } catch {
          }
          if (t) {
            try {
              sessionStorage.removeItem(r);
            } catch {
            }
            if (!!(document.querySelector(".has-error, [data-ln-validate-error], .form-error, .alert-danger") || g.querySelector(".has-error, [data-ln-validate-error], .form-error, .alert-danger"))) {
              g.dataset.lnModalMode = "edit", L(g, "ln-modal:request-open", {});
              continue;
            } else {
              it(i, null), L(g, "ln-modal:request-close", {}), _(g);
              continue;
            }
          }
          const e = rt(i), n = e !== null, f = g.lnModal.isOpen;
          if (n) {
            const v = e ? "edit" : "new";
            g.dataset.lnModalMode = v, f ? e ? g.dispatchEvent(new CustomEvent("ln-fill:request", {
              bubbles: !0,
              detail: { id: e }
            })) : _(g) : L(g, "ln-modal:request-open", {});
          } else f && L(g, "ln-modal:request-close", {});
        }
      } finally {
        p = !1;
      }
    }
  }
  function a() {
    const u = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let c = 0; c < u.length; c++) {
      const g = u[c];
      g.lnModal && rt(g.id) === null && it(g.id, y(g.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", m);
  function h() {
    a(), m();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    ct(h);
  }) : ct(h);
  function o(u) {
    const c = u.target.closest("[data-ln-modal]");
    if (!(!c || !c.lnModal)) {
      if (c.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + c.id);
        } catch {
        }
        it(c.id, null);
      }
      L(c, "ln-modal:request-close", {}), _(c);
    }
  }
  document.addEventListener("ln-form:success", o), document.addEventListener("ln-ajax:success", o), document.addEventListener("ln-modal:close", function(u) {
    const c = u.target;
    if (!(!c || !c.lnModal)) {
      if (c.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + c.id);
        } catch {
        }
        rt(c.id) !== null && it(c.id, null);
      }
      c.dataset.lnModalMode === "new" && _(c);
    }
  });
  function d(u) {
    return this.dom = u, this;
  }
  d.prototype.destroy = function() {
    this.dom[s] && delete this.dom[s];
  }, U(l, s, d, "ln-modal-coordinator");
})();
(function() {
  const l = "data-ln-number", s = "lnNumber";
  if (window[s] !== void 0) return;
  const b = {}, y = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function _(o) {
    if (!b[o]) {
      const d = new Intl.NumberFormat(o, { useGrouping: !0 }), u = d.formatToParts(1234.5);
      let c = "", g = ".";
      for (let i = 0; i < u.length; i++)
        u[i].type === "group" && (c = u[i].value), u[i].type === "decimal" && (g = u[i].value);
      b[o] = { fmt: d, groupSep: c, decimalSep: g };
    }
    return b[o];
  }
  function p(o, d, u) {
    if (u !== null) {
      const c = parseInt(u, 10), g = o + "|d" + c;
      return b[g] || (b[g] = new Intl.NumberFormat(o, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: c })), b[g].format(d);
    }
    return _(o).fmt.format(d);
  }
  function m(o) {
    if (o[s]) return o[s];
    if (o[s] = this, this.dom = o, o.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const d = document.createElement("input");
    d.type = "hidden", d.name = o.name, o.removeAttribute("name"), o.hasAttribute("data-ln-fill-as") && d.setAttribute("data-ln-fill-as", o.getAttribute("data-ln-fill-as")), o.type = "text", o.setAttribute("inputmode", "decimal"), o.insertAdjacentElement("afterend", d), this._hidden = d;
    const u = this;
    Object.defineProperty(d, "value", {
      get: function() {
        return y.get.call(d);
      },
      set: function(g) {
        y.set.call(d, g), g !== "" && !isNaN(parseFloat(g)) ? u._setDisplayRaw(p($(u.dom), parseFloat(g), u.dom.getAttribute("data-ln-number-decimals"))) : u._setDisplayRaw(""), u.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), _e(o, y, {
      get: function() {
        return y.get.call(o);
      },
      set: function(g) {
        if (g === "") {
          u._setDisplayRaw(""), u._setHiddenRaw(""), o.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const i = typeof g == "number" ? g : parseFloat(String(g).replace(/[^\d.-]/g, ""));
        isNaN(i) ? (u._setDisplayRaw(String(g)), u._setHiddenRaw("")) : (u._setHiddenRaw(i), u._setDisplayRaw(p($(o), i, o.getAttribute("data-ln-number-decimals")))), o.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      u._handleInput();
    }, o.addEventListener("input", this._onInput), this._onPaste = function(g) {
      g.preventDefault();
      const i = (g.clipboardData || window.clipboardData).getData("text"), r = _($(o)), t = r.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let e = i.replace(new RegExp("[^0-9\\-" + t + ".]", "g"), "");
      r.groupSep && (e = e.split(r.groupSep).join("")), r.decimalSep !== "." && (e = e.replace(r.decimalSep, "."));
      const n = parseFloat(e);
      u.value = isNaN(n) ? NaN : n;
    }, o.addEventListener("paste", this._onPaste);
    const c = o.value;
    if (c !== "") {
      const g = parseFloat(c);
      isNaN(g) || (this._setHiddenRaw(g), this._setDisplayRaw(p($(o), g, o.getAttribute("data-ln-number-decimals"))), o.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  function a(o) {
    if (typeof o == "number") return isNaN(o) ? null : o;
    if (!o || typeof o != "string") return null;
    let d = o.trim();
    if (d === "") return null;
    d = d.replace(/[\s\u00A0$€£]/g, ""), d.indexOf(",") !== -1 && d.indexOf(".") !== -1 ? d.indexOf(".") < d.indexOf(",") ? d = d.replace(/\./g, "").replace(",", ".") : d = d.replace(/,/g, "") : d.indexOf(",") !== -1 && (d = d.replace(",", ".")), d = d.replace(/[^\d.-]/g, "");
    const u = parseFloat(d);
    return isNaN(u) ? null : u;
  }
  m.prototype._initTextElement = function() {
    const o = this.dom;
    let d = o.getAttribute("data-ln-value"), u = o.getAttribute("data-ln-number"), c = null;
    d !== null && d !== "" ? c = d : u !== null && u !== "" && u !== "true" ? c = u : c = o.textContent.trim();
    const g = a(c);
    g !== null ? (this._rawValue = g, o.hasAttribute("data-ln-value") || o.setAttribute("data-ln-value", String(g)), this._formatTextContent()) : this._rawValue = null;
  }, m.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const o = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = p($(this.dom), this._rawValue, o);
    }
  }, m.prototype._handleInput = function() {
    const o = this.dom, d = _($(o)), u = y.get.call(o);
    if (u === "") {
      this._setHiddenRaw(""), L(o, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (u === "-") {
      this._setHiddenRaw("");
      return;
    }
    const c = o.selectionStart;
    let g = 0;
    for (let A = 0; A < c; A++)
      /[0-9]/.test(u[A]) && g++;
    let i = u;
    if (d.groupSep && (i = i.split(d.groupSep).join("")), i = i.replace(d.decimalSep, "."), u.endsWith(d.decimalSep) || u.endsWith(".")) {
      const A = i.replace(/\.$/, ""), S = parseFloat(A);
      isNaN(S) || this._setHiddenRaw(S);
      return;
    }
    const r = i.indexOf(".");
    if (r !== -1 && i.slice(r + 1).endsWith("0")) {
      const S = parseFloat(i);
      isNaN(S) || this._setHiddenRaw(S);
      return;
    }
    const t = o.getAttribute("data-ln-number-decimals");
    if (t !== null && r !== -1) {
      const A = parseInt(t, 10);
      i.slice(r + 1).length > A && (i = i.slice(0, r + 1 + A));
    }
    const e = parseFloat(i);
    if (isNaN(e)) return;
    const n = o.getAttribute("data-ln-number-min"), f = o.getAttribute("data-ln-number-max");
    if (n !== null && e < parseFloat(n) || f !== null && e > parseFloat(f)) return;
    let v;
    if (t !== null)
      v = p($(o), e, t);
    else {
      const A = r !== -1 ? i.slice(r + 1).length : 0;
      if (A > 0) {
        const S = $(o) + "|u" + A;
        b[S] || (b[S] = new Intl.NumberFormat($(o), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), v = b[S].format(e);
      } else
        v = d.fmt.format(e);
    }
    this._setDisplayRaw(v);
    let E = g, w = 0;
    for (let A = 0; A < v.length && E > 0; A++)
      w = A + 1, /[0-9]/.test(v[A]) && E--;
    E > 0 && (w = v.length), o.setSelectionRange(w, w), this._setHiddenRaw(e), L(o, "ln-number:input", { value: e, formatted: v });
  }, m.prototype._setHiddenRaw = function(o) {
    this._hidden && y.set.call(this._hidden, String(o));
  }, m.prototype._setDisplayRaw = function(o) {
    this.isTextElement ? this.dom.textContent = String(o) : y.set.call(this.dom, String(o));
  }, m.prototype._displayFormatted = function(o) {
    this.isTextElement ? this._formatTextContent() : this._setDisplayRaw(p($(this.dom), o, this.dom.getAttribute("data-ln-number-decimals")));
  }, Object.defineProperty(m.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const o = y.get.call(this._hidden);
      return o === "" ? NaN : parseFloat(o);
    },
    set: function(o) {
      if (this.isTextElement) {
        typeof o != "number" || isNaN(o) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = o, this.dom.setAttribute("data-ln-value", String(o)), this._formatTextContent());
        return;
      }
      if (typeof o != "number" || isNaN(o)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(o), this._setDisplayRaw(p($(this.dom), o, this.dom.getAttribute("data-ln-number-decimals"))), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(m.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : y.get.call(this.dom);
    }
  }), m.prototype.destroy = function() {
    this.dom[s] && (this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), L(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[s]);
  };
  function h() {
    new MutationObserver(function() {
      const o = document.querySelectorAll("[" + l + "]");
      for (let d = 0; d < o.length; d++) {
        const u = o[d][s];
        u && (u.isTextElement ? u._formatTextContent() : isNaN(u.value) || u._displayFormatted(u.value));
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  U(l, s, m, "ln-number", {
    extraAttributes: [
      "data-ln-value",
      "data-ln-number-decimals",
      "data-ln-number-min",
      "data-ln-number-max",
      "lang"
    ],
    onAttributeChange: function(o) {
      const d = o[s];
      d && (d.isTextElement ? d._initTextElement() : isNaN(d.value) || d._displayFormatted(d.value));
    }
  }), h();
})();
(function() {
  const l = "data-ln-date", s = "lnDate";
  if (window[s] !== void 0) return;
  const b = {}, y = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function _(n, f) {
    const v = n + "|" + JSON.stringify(f);
    return b[v] || (b[v] = new Intl.DateTimeFormat(n, f)), b[v];
  }
  const p = /^(short|medium|long)(\s+datetime)?$/, m = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function a(n) {
    return !n || n === "" ? { dateStyle: "medium" } : n.match(p) ? m[n] : null;
  }
  function h(n, f, v) {
    const E = n.getDate(), w = n.getMonth(), A = n.getFullYear(), S = n.getHours(), q = n.getMinutes();
    let x, D;
    const k = Dt(v), R = (v || "").toLowerCase().split("-")[0], B = _(v, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0], z = k && B !== R;
    z && k.monthsLong ? x = k.monthsLong[w] : x = _(v, { month: "long" }).format(n), z && k.monthsShort ? D = k.monthsShort[w] : D = _(v, { month: "short" }).format(n);
    const j = {
      yyyy: String(A),
      yy: String(A).slice(-2),
      MMMM: x,
      MMM: D,
      MM: String(w + 1).padStart(2, "0"),
      M: String(w + 1),
      dd: String(E).padStart(2, "0"),
      d: String(E),
      HH: String(S).padStart(2, "0"),
      mm: String(q).padStart(2, "0")
    };
    return f.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(K) {
      return j[K];
    });
  }
  function o(n, f, v) {
    const E = a(f);
    if (E) {
      const w = _(v, E), A = (v || "").toLowerCase().split("-")[0], S = w.resolvedOptions().locale.toLowerCase().split("-")[0];
      return Dt(v) && S !== A ? h(n, "dd.MM.yyyy", v) : w.format(n);
    }
    return h(n, f, v);
  }
  function d(n) {
    if (!n) return "";
    const f = n.getFullYear(), v = String(n.getMonth() + 1).padStart(2, "0"), E = String(n.getDate()).padStart(2, "0");
    return f + "-" + v + "-" + E;
  }
  function u(n, f, v) {
    L(n.dom, "ln-date:change", {
      value: f,
      formatted: n.dom.value,
      date: v
    }), n.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function c(n, f, v, E) {
    n._setHiddenRaw(f), y.set.call(n._picker, f), n._lastISO = f, E !== void 0 ? (n._isFormatting = !0, n.dom.value = E, n._isFormatting = !1) : v && n._displayFormatted(v), u(n, f, v);
  }
  function g(n) {
    n._setHiddenRaw(""), y.set.call(n._picker, ""), n._isFormatting = !0, n.dom.value = "", n._isFormatting = !1, n._lastISO = "", u(n, "", null);
  }
  i.prototype._initTextElement = function() {
    const n = this.dom;
    let f = n.getAttribute("data-ln-value"), v = n.getAttribute("data-ln-date"), E = n.getAttribute("datetime"), w = null;
    f !== null && f !== "" ? w = f : E !== null && E !== "" ? w = E : v !== null && v !== "" && v !== "true" && !p.test(v) ? w = v : w = n.textContent.trim();
    let A = r(w) || t(w);
    if (!A && w)
      if (isNaN(w))
        A = new Date(w);
      else {
        const S = Number(w);
        A = new Date(S > 1e11 ? S : S * 1e3);
      }
    if (A && !isNaN(A.getTime())) {
      const S = d(A);
      this._rawValue = S, n.hasAttribute("data-ln-value") || n.setAttribute("data-ln-value", S), this._formatTextContent();
    } else
      this._rawValue = null;
  }, i.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const n = r(this._rawValue);
      if (n) {
        let v = this.dom.getAttribute("data-ln-date-format");
        if (!v) {
          const w = this.dom.getAttribute("data-ln-date");
          w && p.test(w) && (v = w);
        }
        const E = $(this.dom);
        this.dom.textContent = o(n, v || "medium", E);
      }
    }
  };
  function i(n) {
    if (n[s]) return n[s];
    if (n[s] = this, this.dom = n, n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const f = this, v = n.value, E = n.name, A = (n.closest(".form-element, form") || n.parentNode).querySelectorAll("[data-ln-date-dict]");
    for (let k = 0; k < A.length; k++) {
      const R = A[k].getAttribute("data-ln-date-dict");
      if (R) {
        const F = te(A[k], "data-ln-date-dict-key");
        F["months-long"] && (F.monthsLong = F["months-long"].split(",").map((B) => B.trim())), F["months-short"] && (F.monthsShort = F["months-short"].split(",").map((B) => B.trim())), ee(R, F);
      }
    }
    const S = document.createElement("span");
    S.setAttribute("data-ln-date-field", ""), n.parentNode.insertBefore(S, n), S.appendChild(n), this._wrapper = S;
    const q = document.createElement("input");
    q.type = "hidden", q.name = E, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && q.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.insertAdjacentElement("afterend", q), this._hidden = q;
    const x = document.createElement("input");
    x.type = "date", x.tabIndex = -1, x.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", q.insertAdjacentElement("afterend", x), this._picker = x, n.type = "text";
    const D = document.createElement("button");
    if (D.type = "button", D.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Open date picker"), D.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', x.insertAdjacentElement("afterend", D), this._btn = D, this._lastISO = "", Object.defineProperty(q, "value", {
      get: function() {
        return y.get.call(q);
      },
      set: function(k) {
        if (y.set.call(q, k), k && k !== "") {
          const R = r(k);
          R && c(f, k, R);
        } else k === "" && g(f);
      }
    }), _e(n, y, {
      get: function() {
        return y.get.call(n);
      },
      set: function(k, R) {
        if (f._isFormatting) {
          R(k);
          return;
        }
        if (!k || k === "") {
          R(""), g(f);
          return;
        }
        const F = r(k) || t(k);
        if (F) {
          const B = d(F), z = n.getAttribute(l) || "", j = $(n), K = o(F, z, j);
          R(K), c(f, B, F, K);
        } else
          R(String(k)), g(f);
      }
    }), this._onPickerChange = function() {
      const k = x.value;
      if (k) {
        const R = r(k);
        R && c(f, k, R);
      } else
        g(f);
    }, x.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const k = f.dom.value.trim();
      if (k === "") {
        f._lastISO !== "" && g(f);
        return;
      }
      if (f._lastISO) {
        const F = r(f._lastISO);
        if (F) {
          const B = f.dom.getAttribute(l) || "", z = $(f.dom);
          if (k === o(F, B, z)) return;
        }
      }
      const R = t(k);
      if (R) {
        const F = d(R);
        c(f, F, R);
      } else if (f._lastISO) {
        const F = r(f._lastISO);
        F && f._displayFormatted(F);
      } else
        f.dom.value = "";
    }, n.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      f._openPicker();
    }, D.addEventListener("click", this._onBtnClick), v && v !== "") {
      const k = r(v);
      k && c(f, v, k);
    }
    return this;
  }
  function r(n) {
    if (!n || typeof n != "string") return null;
    const f = n.split("T"), v = f[0].split("-");
    if (v.length < 3) return null;
    const E = parseInt(v[0], 10), w = parseInt(v[1], 10) - 1, A = parseInt(v[2], 10);
    if (isNaN(E) || isNaN(w) || isNaN(A)) return null;
    let S = 0, q = 0;
    if (f[1]) {
      const D = f[1].split(":");
      S = parseInt(D[0], 10) || 0, q = parseInt(D[1], 10) || 0;
    }
    const x = new Date(E, w, A, S, q);
    return x.getFullYear() !== E || x.getMonth() !== w || x.getDate() !== A ? null : x;
  }
  function t(n) {
    if (!n || typeof n != "string" || (n = n.trim(), n.length < 6)) return null;
    let f, v;
    if (n.indexOf(".") !== -1)
      f = ".", v = n.split(".");
    else if (n.indexOf("/") !== -1)
      f = "/", v = n.split("/");
    else if (n.indexOf("-") !== -1)
      f = "-", v = n.split("-");
    else
      return null;
    if (v.length !== 3) return null;
    const E = [];
    for (let x = 0; x < 3; x++) {
      const D = parseInt(v[x], 10);
      if (isNaN(D)) return null;
      E.push(D);
    }
    let w, A, S;
    f === "." ? (w = E[0], A = E[1], S = E[2]) : f === "/" ? (A = E[0], w = E[1], S = E[2]) : v[0].length === 4 ? (S = E[0], A = E[1], w = E[2]) : (w = E[0], A = E[1], S = E[2]), S < 100 && (S += S < 50 ? 2e3 : 1900);
    const q = new Date(S, A - 1, w);
    return q.getFullYear() !== S || q.getMonth() !== A - 1 || q.getDate() !== w ? null : q;
  }
  i.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, i.prototype._setHiddenRaw = function(n) {
    y.set.call(this._hidden, n);
  }, i.prototype._displayFormatted = function(n) {
    const f = this.dom.getAttribute(l) || "", v = $(this.dom);
    this._isFormatting = !0, this.dom.value = o(n, f, v), this._isFormatting = !1;
  }, Object.defineProperty(i.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : y.get.call(this._hidden);
    },
    set: function(n) {
      if (this.isTextElement) {
        if (!n || n === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const v = r(n) || t(n);
        if (!v) return;
        const E = d(v);
        this._rawValue = E, this.dom.setAttribute("data-ln-value", E), this._formatTextContent();
        return;
      }
      if (!n || n === "") {
        g(this);
        return;
      }
      const f = r(n);
      f && c(this, n, f);
    }
  }), Object.defineProperty(i.prototype, "date", {
    get: function() {
      const n = this.value;
      return n ? r(n) : null;
    },
    set: function(n) {
      if (!n || !(n instanceof Date) || isNaN(n.getTime())) {
        this.value = "";
        return;
      }
      this.value = d(n);
    }
  }), Object.defineProperty(i.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), i.prototype.destroy = function() {
    if (!this.dom[s]) return;
    if (this.isTextElement) {
      L(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[s];
      return;
    }
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const n = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", n && (this.dom.value = n), L(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[s];
  };
  function e() {
    new MutationObserver(function() {
      const n = document.querySelectorAll("[" + l + "]");
      for (let f = 0; f < n.length; f++) {
        const v = n[f][s];
        if (v) {
          if (v.isTextElement)
            v._formatTextContent();
          else if (v.value) {
            const E = r(v.value);
            E && v._displayFormatted(E);
          }
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  U(l, s, i, "ln-date", {
    extraAttributes: ["data-ln-date-format", "data-ln-date-locale", "data-ln-value", "datetime", "lang"],
    onAttributeChange: function(n) {
      const f = n[s];
      if (f) {
        if (f.isTextElement)
          f._initTextElement();
        else if (f.value) {
          const v = r(f.value);
          v && f._displayFormatted(v);
        }
      }
    }
  }), e();
})();
(function() {
  const l = "data-ln-nav", s = "lnNav";
  if (window[s] !== void 0) return;
  const b = [];
  if (!history._lnNavPatched) {
    const m = history.pushState;
    history.pushState = function() {
      m.apply(history, arguments);
      for (const a of b)
        a();
    }, history._lnNavPatched = !0;
  }
  function y(m) {
    return this.dom = m, this.activeClass = m.getAttribute(l) || "active", this.exact = m.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), b.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(m, { childList: !0, subtree: !0 }), this.update(), this;
  }
  y.prototype.update = function() {
    if (!this.activeClass || X(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const a = Array.from(this.dom.querySelectorAll("a")), h = window.location.pathname, o = _(h);
    for (const d of a) {
      const u = d.getAttribute("href");
      if (!u || u === "#" || u.startsWith("#") || u.startsWith("javascript:") || u.startsWith("mailto:") || u.startsWith("tel:")) {
        d.classList.remove(this.activeClass), d.removeAttribute("aria-current");
        continue;
      }
      if (d.hostname && d.hostname !== window.location.hostname) {
        d.classList.remove(this.activeClass), d.removeAttribute("aria-current");
        continue;
      }
      const c = _(u), g = c === o, i = !this.exact && c !== "/" && o.startsWith(c + "/");
      g || i ? (d.classList.add(this.activeClass), d.setAttribute("aria-current", "page")) : (d.classList.remove(this.activeClass), d.removeAttribute("aria-current"));
    }
    L(this.dom, "ln-nav:update", { target: this.dom });
  }, y.prototype.destroy = function() {
    if (!this.dom[s]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const m = b.indexOf(this.updateHandler);
    m !== -1 && b.splice(m, 1), L(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[s];
  };
  function _(m) {
    try {
      return new URL(m, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return m.replace(/\/$/, "") || "/";
    }
  }
  function p(m, a) {
    const h = m[s];
    if (h) {
      if (a === l) {
        if (!m.hasAttribute(l)) {
          h.destroy();
          return;
        }
        const o = h.activeClass, d = m.getAttribute(l) || "active";
        if (o !== d) {
          const u = m.querySelectorAll("a");
          for (const c of u)
            o && c.classList.remove(o);
          h.activeClass = d;
        }
      } else a === "data-ln-nav-exact" && (h.exact = m.hasAttribute("data-ln-nav-exact"));
      h.update();
    }
  }
  U(l, s, y, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: p
  });
})();
(function() {
  const l = "data-ln-tabs", s = "lnTabs";
  if (window[s] !== void 0 && window[s] !== null) return;
  function b(p, m) {
    const a = (p.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (a) return a;
    if (p.tagName !== "A") return "";
    const h = p.getAttribute("href") || "";
    if (!h.startsWith("#")) return "";
    const o = h.slice(1);
    if (!o) return "";
    const d = o.split("&");
    if (m)
      for (const g of d) {
        const i = g.indexOf(":");
        if (i > 0 && g.slice(0, i).toLowerCase().trim() === m)
          return g.slice(i + 1).toLowerCase().trim();
      }
    const u = d[d.length - 1] || "", c = u.indexOf(":");
    return (c > 0 ? u.slice(c + 1) : u).toLowerCase().trim();
  }
  function y(p) {
    return this.dom = p, _.call(this), this;
  }
  function _() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const p = this.tabs.filter((h) => h.tagName === "A" && (h.getAttribute("href") || "").startsWith("#")), m = p.length > 0 && p.length === this.tabs.length;
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = m && !!this.nsKey, p.length > 0 && p.length !== this.tabs.length ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : m && !this.nsKey && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const h of this.tabs) {
      const o = b(h, this.nsKey);
      o ? this.mapTabs[o] = h : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', h);
    }
    for (const h of this.panels) {
      const o = (h.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      o && (this.mapPanels[o] = h);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const a = this;
    this._clickHandlers = [];
    for (const h of this.tabs) {
      if (h[s + "Trigger"]) continue;
      const o = function(d) {
        const u = h.tagName === "A";
        if (!u && (d.ctrlKey || d.metaKey || d.button === 1)) return;
        const c = b(h, a.nsKey);
        c && (u && !ie(d) || (a.hashEnabled ? rt(a.nsKey) === c ? a.dom.setAttribute("data-ln-tabs-active", c) : it(a.nsKey, c) : a.dom.setAttribute("data-ln-tabs-active", c)));
      };
      h.addEventListener("click", o), h[s + "Trigger"] = o, a._clickHandlers.push({ el: h, handler: o });
    }
    if (this._onRequestSelect = function(h) {
      const o = h.detail && (h.detail.key || h.detail.tab);
      o && a.dom.setAttribute("data-ln-tabs-active", (o + "").toLowerCase().trim());
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this.dom.addEventListener("ln-tabs:request-activate", this._onRequestSelect), this._hashHandler = function() {
      if (!a.hashEnabled) return;
      const h = rt(a.nsKey);
      a.dom.setAttribute("data-ln-tabs-active", h !== null ? h : a.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let h = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const o = Bt("tabs", this.dom);
        o !== null && o in this.mapPanels && (h = o);
      }
      this.dom.setAttribute("data-ln-tabs-active", h);
    }
  }
  y.prototype._applyActive = function(p) {
    var m;
    (!p || !(p in this.mapPanels)) && (p = this.defaultKey);
    for (const a in this.mapTabs) {
      const h = this.mapTabs[a];
      a === p ? (h.setAttribute("data-active", ""), h.setAttribute("aria-selected", "true")) : (h.removeAttribute("data-active"), h.setAttribute("aria-selected", "false"));
    }
    for (const a in this.mapPanels) {
      const h = this.mapPanels[a], o = a === p;
      h.classList.toggle("hidden", !o), h.setAttribute("aria-hidden", o ? "false" : "true");
    }
    if (this.autoFocus) {
      const a = (m = this.mapPanels[p]) == null ? void 0 : m.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      a && setTimeout(() => a.focus({ preventScroll: !0 }), 0);
    }
    L(this.dom, "ln-tabs:change", { key: p, tab: this.mapTabs[p], panel: this.mapPanels[p] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && yt("tabs", this.dom, p);
  }, y.prototype.destroy = function() {
    if (this.dom[s]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect), this.dom.removeEventListener("ln-tabs:request-activate", this._onRequestSelect);
      for (const { el: p, handler: m } of this._clickHandlers)
        p.removeEventListener("click", m), delete p[s + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), L(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[s];
    }
  }, U(l, s, y, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(p) {
      const m = p.getAttribute("data-ln-tabs-active");
      p[s]._applyActive(m);
    }
  });
})();
(function() {
  const l = "data-ln-toggle", s = "lnToggle";
  if (window[s] !== void 0) return;
  function b(p, m) {
    const a = document.querySelectorAll(
      '[data-ln-toggle-for="' + p.id + '"]'
    );
    for (const h of a)
      h.setAttribute("aria-expanded", m ? "true" : "false");
  }
  function y(p) {
    this.dom = p;
    const m = this;
    if (this._onRequestOpen = function() {
      m.open();
    }, this._onRequestClose = function() {
      m.close();
    }, this._onRequestToggle = function() {
      m.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), p.hasAttribute("data-ln-persist")) {
      const a = Bt("toggle", p);
      a !== null && p.setAttribute(l, a);
    }
    return this.isOpen = p.getAttribute(l) === "open", this.isOpen && p.classList.add("open"), b(p, this.isOpen), this;
  }
  y.prototype.open = function() {
    this.dom.setAttribute(l, "open");
  }, y.prototype.close = function() {
    this.dom.setAttribute(l, "close");
  }, y.prototype.toggle = function() {
    const p = this.dom.getAttribute(l);
    this.dom.setAttribute(l, p === "open" ? "close" : "open");
  }, y.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), L(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[s]);
  };
  function _(p) {
    const m = p[s];
    if (!m) return;
    const h = p.getAttribute(l) === "open";
    if (h !== m.isOpen)
      if (h) {
        if (X(p, "ln-toggle:before-open", { target: p }).defaultPrevented) {
          p.setAttribute(l, "close");
          return;
        }
        m.isOpen = !0, p.classList.add("open"), b(p, !0), L(p, "ln-toggle:open", { target: p }), p.hasAttribute("data-ln-persist") && yt("toggle", p, "open");
      } else {
        if (X(p, "ln-toggle:before-close", { target: p }).defaultPrevented) {
          p.setAttribute(l, "open");
          return;
        }
        m.isOpen = !1, p.classList.remove("open"), b(p, !1), L(p, "ln-toggle:close", { target: p }), p.hasAttribute("data-ln-persist") && yt("toggle", p, "close");
      }
  }
  document.addEventListener("click", function(p) {
    if (p.ctrlKey || p.metaKey || p.button === 1) return;
    const m = p.target.closest("[data-ln-toggle-for]");
    if (m) {
      const a = m.getAttribute("data-ln-toggle-for"), h = document.getElementById(a);
      if (h && h[s]) {
        p.preventDefault();
        const o = m.getAttribute("data-ln-toggle-action") || "toggle";
        if (o === "open")
          h.setAttribute(l, "open");
        else if (o === "close")
          h.setAttribute(l, "close");
        else if (o === "toggle") {
          const d = h.getAttribute(l);
          h.setAttribute(l, d === "open" ? "close" : "open");
        }
      }
    }
  }), U(l, s, y, "ln-toggle", {
    onAttributeChange: _
  });
})();
(function() {
  const l = "data-ln-accordion", s = "lnAccordion";
  if (window[s] !== void 0) return;
  function b(y) {
    return this.dom = y, this._onToggleOpen = function(_) {
      if (_.detail.target.closest("[data-ln-accordion]") !== y) return;
      const p = y.querySelectorAll("[data-ln-toggle]");
      for (const m of p)
        m !== _.detail.target && m.closest("[data-ln-accordion]") === y && m.getAttribute("data-ln-toggle") === "open" && m.setAttribute("data-ln-toggle", "close");
      L(y, "ln-accordion:change", { target: _.detail.target });
    }, y.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  b.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), L(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[s]);
  }, U(l, s, b, "ln-accordion");
})();
(function() {
  const l = "data-ln-dropdown", s = "lnDropdown";
  if (window[s] !== void 0) return;
  function b(y) {
    if (this.dom = y, this.toggleEl = y.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual")), this.triggerBtn = y.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const p of this.toggleEl.children)
        p.setAttribute("role", "menuitem");
    const _ = this;
    return this._onRequestOpen = function() {
      _.toggleEl && _.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      _.toggleEl && _.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (_.toggleEl) {
        const p = _.toggleEl.getAttribute("data-ln-toggle");
        _.toggleEl.setAttribute("data-ln-toggle", p === "open" ? "close" : "open");
      }
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this._onToggleOpen = function(p) {
      !p.detail || p.detail.target !== _.toggleEl || (_.triggerBtn && _.triggerBtn.setAttribute("aria-expanded", "true"), typeof _.toggleEl.showPopover == "function" && _.toggleEl.showPopover(), _._reposition(), _._addOutsideClickListener(), _._addScrollRepositionListener(), _._addResizeCloseListener(), L(y, "ln-dropdown:open", { target: p.detail.target }));
    }, this._onToggleClose = function(p) {
      !p.detail || p.detail.target !== _.toggleEl || (_.triggerBtn && _.triggerBtn.setAttribute("aria-expanded", "false"), _._removeOutsideClickListener(), _._removeScrollRepositionListener(), _._removeResizeCloseListener(), _.toggleEl.style.top = "", _.toggleEl.style.left = "", typeof _.toggleEl.hidePopover == "function" && _.toggleEl.matches(":popover-open") && _.toggleEl.hidePopover(), L(y, "ln-dropdown:close", { target: p.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  b.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const y = this.triggerBtn.getBoundingClientRect(), _ = $t(this.toggleEl), p = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, m = Pt(y, _, "bottom-end", p);
    this.toggleEl.style.top = m.top + "px", this.toggleEl.style.left = m.left + "px";
  }, b.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const y = this;
    this._boundDocClick = function(_) {
      y.dom.contains(_.target) || y.toggleEl && y.toggleEl.contains(_.target) || y.toggleEl && y.toggleEl.getAttribute("data-ln-toggle") === "open" && y.toggleEl.setAttribute("data-ln-toggle", "close");
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
    this.dom[s] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), L(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[s]);
  }, U(l, s, b, "ln-dropdown");
})();
(function() {
  const l = "data-ln-popover", s = "lnPopover", b = "data-ln-popover-for", y = "data-ln-popover-position";
  if (window[s] !== void 0) return;
  const _ = [];
  let p = null;
  function m() {
    p || (p = function(d) {
      if (d.key !== "Escape" || _.length === 0) return;
      _[_.length - 1].close();
    }, document.addEventListener("keydown", p));
  }
  function a() {
    _.length > 0 || p && (document.removeEventListener("keydown", p), p = null);
  }
  function h(d) {
    this.dom = d, this.isOpen = d.getAttribute(l) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const u = this;
    return this._onRequestOpen = function(c) {
      const g = c.detail && c.detail.trigger ? c.detail.trigger : null;
      u.open(g);
    }, this._onRequestClose = function() {
      u.close();
    }, this._onRequestToggle = function(c) {
      const g = c.detail && c.detail.trigger ? c.detail.trigger : null;
      u.toggle(g);
    }, d.addEventListener("ln-popover:request-open", this._onRequestOpen), d.addEventListener("ln-popover:request-close", this._onRequestClose), d.addEventListener("ln-popover:request-toggle", this._onRequestToggle), d.hasAttribute("tabindex") || d.setAttribute("tabindex", "-1"), d.hasAttribute("role") || d.setAttribute("role", "dialog"), d.hasAttribute("popover") || d.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  h.prototype.open = function(d) {
    this.isOpen || (this.trigger = d || null, this.dom.setAttribute(l, "open"));
  }, h.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(l, "closed");
  }, h.prototype.toggle = function(d) {
    this.isOpen ? this.close() : this.open(d);
  }, h.prototype._applyOpen = function(d) {
    this.isOpen = !0, d && (this.trigger = d), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const u = $t(this.dom);
    if (this.trigger) {
      const r = this.trigger.getBoundingClientRect(), t = this.dom.getAttribute(y) || "bottom", e = Pt(r, u, t, 8);
      this.dom.style.top = e.top + "px", this.dom.style.left = e.left + "px", this.dom.setAttribute("data-ln-popover-placement", e.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const c = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), g = Array.prototype.find.call(c, Ft);
    g ? g.focus() : this.dom.focus();
    const i = this;
    this._boundDocClick = function(r) {
      i.dom.contains(r.target) || i.trigger && i.trigger.contains(r.target) || i.close();
    }, i._docClickTimeout = setTimeout(function() {
      i._docClickTimeout = null, document.addEventListener("click", i._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!i.trigger) return;
      const r = i.trigger.getBoundingClientRect(), t = $t(i.dom), e = i.dom.getAttribute(y) || "bottom", n = Pt(r, t, e, 8);
      i.dom.style.top = n.top + "px", i.dom.style.left = n.left + "px", i.dom.setAttribute("data-ln-popover-placement", n.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), _.push(this), m(), L(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, h.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const d = _.indexOf(this);
    d !== -1 && _.splice(d, 1), a(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, L(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, h.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[s], L(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function o(d) {
    this.dom = d;
    const u = d.getAttribute(b);
    return d.setAttribute("aria-haspopup", "dialog"), d.setAttribute("aria-expanded", "false"), d.setAttribute("aria-controls", u), this._onClick = function(c) {
      if (c.ctrlKey || c.metaKey || c.button === 1) return;
      c.preventDefault();
      const g = document.getElementById(u);
      if (!g) return;
      g[s] && (g[s].trigger = d);
      const i = g.getAttribute(l);
      g.setAttribute(l, i === "open" ? "closed" : "open");
    }, d.addEventListener("click", this._onClick), this;
  }
  o.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[s + "Trigger"];
  }, U(l, s, h, "ln-popover", {
    onAttributeChange: function(d) {
      const u = d[s];
      if (!u) return;
      const g = d.getAttribute(l) === "open";
      if (g !== u.isOpen)
        if (g) {
          if (X(d, "ln-popover:before-open", {
            popoverId: d.id,
            target: d,
            trigger: u.trigger
          }).defaultPrevented) {
            d.setAttribute(l, "closed");
            return;
          }
          u._applyOpen(u.trigger);
        } else {
          if (X(d, "ln-popover:before-close", {
            popoverId: d.id,
            target: d,
            trigger: u.trigger
          }).defaultPrevented) {
            d.setAttribute(l, "open");
            return;
          }
          u._applyClose();
        }
    }
  }), U(b, s + "Trigger", o, "ln-popover-trigger");
})();
(function() {
  const l = "data-ln-tooltip-enhance", s = "data-ln-tooltip", b = "data-ln-tooltip-position", y = "lnTooltipEnhance", _ = "ln-tooltip-portal";
  if (window[y] !== void 0) return;
  let p = 0, m = null, a = null, h = null, o = null, d = null, u = null;
  function c() {
    return m && m.parentNode || (m = document.getElementById(_), m || (m = document.createElement("div"), m.id = _, document.body.appendChild(m)), m.hasAttribute("popover") || m.setAttribute("popover", "manual")), m;
  }
  function g() {
    u || (u = function(n) {
      n.key === "Escape" && t();
    }, document.addEventListener("keydown", u));
  }
  function i() {
    u && (document.removeEventListener("keydown", u), u = null);
  }
  function r(n) {
    if (h === n) return;
    t();
    const f = n.getAttribute(s) || n.getAttribute("title");
    if (!f) return;
    c(), typeof m.showPopover == "function" && m.showPopover(), n.hasAttribute("title") && (o = n.getAttribute("title"), n.removeAttribute("title"));
    const v = n.getAttribute("aria-describedby");
    v ? d = v : d = null;
    const E = document.createElement("div");
    E.className = "ln-tooltip", E.textContent = f, n[y + "Uid"] || (p += 1, n[y + "Uid"] = "ln-tooltip-" + p), E.id = n[y + "Uid"], m.appendChild(E);
    const w = E.offsetWidth, A = E.offsetHeight, S = n.getBoundingClientRect(), q = n.getAttribute(b) || "top", x = Pt(S, { width: w, height: A }, q, 6);
    E.style.top = x.top + "px", E.style.left = x.left + "px", E.setAttribute("data-ln-tooltip-placement", x.placement), d ? n.setAttribute("aria-describedby", d + " " + E.id) : n.setAttribute("aria-describedby", E.id), a = E, h = n, g();
  }
  function t() {
    if (!a) {
      i();
      return;
    }
    h && (d !== null ? h.setAttribute("aria-describedby", d) : h.removeAttribute("aria-describedby"), d = null, o !== null && h.setAttribute("title", o)), o = null, a.parentNode && a.parentNode.removeChild(a), a = null, h = null, m && typeof m.hidePopover == "function" && m.matches(":popover-open") && m.hidePopover(), i();
  }
  function e(n) {
    return this.dom = n, n.hasAttribute("data-ln-tooltip-enhanced") || (n.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      r(n);
    }, this._onLeave = function() {
      h === n && !n.contains(document.activeElement) && t();
    }, this._onFocus = function() {
      r(n);
    }, this._onBlur = function() {
      h === n && !n.matches(":hover") && t();
    }, n.addEventListener("mouseenter", this._onEnter), n.addEventListener("mouseleave", this._onLeave), n.addEventListener("focus", this._onFocus, !0), n.addEventListener("blur", this._onBlur, !0), this;
  }
  e.prototype.destroy = function() {
    const n = this.dom;
    n.removeEventListener("mouseenter", this._onEnter), n.removeEventListener("mouseleave", this._onLeave), n.removeEventListener("focus", this._onFocus, !0), n.removeEventListener("blur", this._onBlur, !0), h === n && t(), this._addedEnhancedAttr && n.removeAttribute("data-ln-tooltip-enhanced"), delete n[y], delete n[y + "Uid"], L(n, "ln-tooltip:destroyed", { trigger: n });
  }, U(
    "[" + l + "], [data-ln-tooltip-enhanced], [" + s + "][title]",
    y,
    e,
    "ln-tooltip"
  );
})();
(function() {
  const l = "data-ln-toast", s = "lnToast", b = "ln-toast-item";
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function y(r) {
    if (!(!r || !(r instanceof HTMLElement)) && (r.hasAttribute("popover") || r.setAttribute("popover", "manual"), typeof r.showPopover == "function")) {
      if (r.matches(":popover-open"))
        try {
          r.hidePopover();
        } catch {
        }
      try {
        r.showPopover();
      } catch {
      }
    }
  }
  function _(r) {
    if (!r || !(r instanceof HTMLElement)) return;
    if (r.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof r.hidePopover == "function" && r.matches(":popover-open"))
      try {
        r.hidePopover();
      } catch {
      }
  }
  function p(r) {
    if (!r || r.nodeType !== 1) return;
    const t = Array.from(r.querySelectorAll("[" + l + "]"));
    r.hasAttribute && r.hasAttribute(l) && t.push(r);
    for (const e of t)
      e[s] || new m(e);
  }
  function m(r) {
    this.dom = r, r[s] = this, this.timeoutDefault = parseInt(r.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(r.getAttribute("data-ln-toast-max") || "5", 10);
    const t = Array.from(r.querySelectorAll("[data-ln-toast-item]"));
    for (; t.length > this.max; ) r.removeChild(t.shift());
    for (const e of t) c(e, this);
    return t.length > 0 && y(r), this;
  }
  m.prototype.destroy = function() {
    if (this.dom[s]) {
      for (const r of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        d(r);
      _(this.dom), delete this.dom[s];
    }
  };
  function a(r, t) {
    const e = ((r.type || "") + "").trim().toLowerCase(), n = _t(t, b, "ln-toast");
    if (!n)
      return console.warn('[ln-toast] Template "' + b + '" not found'), null;
    lt(n, {
      type: e,
      title: r.title,
      message: typeof r.message == "string" ? r.message : void 0
    });
    const f = n.firstElementChild;
    if (!f) return null;
    f.hasAttribute("data-ln-toast-item") || f.setAttribute("data-ln-toast-item", ""), f.classList.add("ln-enter");
    const v = f.querySelector(".body");
    v && h(v, r);
    const E = f.querySelector("[data-ln-toast-close]");
    return E && E.addEventListener("click", function() {
      d(f);
    }), f;
  }
  function h(r, t) {
    if (Array.isArray(t.message)) {
      const e = document.createElement("ul");
      for (const n of t.message) {
        const f = document.createElement("li");
        f.textContent = n, e.appendChild(f);
      }
      r.appendChild(e);
    }
    if (t.data && t.data.errors) {
      const e = document.createElement("ul");
      for (const n of Object.values(t.data.errors).flat()) {
        const f = document.createElement("li");
        f.textContent = n, e.appendChild(f);
      }
      r.appendChild(e);
    }
  }
  function o(r, t) {
    const e = Array.from(r.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; e.length >= r.max && e.length > 0; ) r.dom.removeChild(e.shift());
    r.dom.appendChild(t), y(r.dom), requestAnimationFrame(() => t.classList.remove("ln-enter"));
  }
  function d(r) {
    if (!r || !r.parentNode) return;
    const t = r.parentNode;
    clearTimeout(r._timer), r.classList.remove("ln-enter"), r.classList.add("ln-out"), setTimeout(() => {
      r.parentNode && (r.parentNode.removeChild(r), _(t));
    }, 200);
  }
  function u(r) {
    let t = r && r.container;
    return typeof t == "string" && (t = document.querySelector(t)), t instanceof HTMLElement || (t = document.querySelector("[" + l + "]") || document.getElementById("ln-toast-container")), t || null;
  }
  function c(r, t) {
    if (r._lnToastHydrated) return;
    r._lnToastHydrated = !0;
    const e = r.querySelector("[data-ln-toast-close]");
    e && e.addEventListener("click", function() {
      d(r);
    });
    const n = r.getAttribute("data-ln-toast-timeout"), f = n !== null ? parseInt(n, 10) : NaN, v = Number.isFinite(f) ? f : t.timeoutDefault;
    v > 0 && (r._timer = setTimeout(function() {
      d(r);
    }, v));
  }
  function g(r) {
    const t = r.detail || {}, e = u(t);
    if (!e) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const n = e[s] || new m(e), f = a(t, e);
    if (!f) return;
    const v = Number.isFinite(t.timeout) ? t.timeout : n.timeoutDefault;
    o(n, f), v > 0 && (f._timer = setTimeout(() => d(f), v));
  }
  function i(r) {
    const t = r && r.detail || {};
    if (t.container) {
      const e = u(t);
      if (e)
        for (const n of Array.from(e.querySelectorAll("[data-ln-toast-item]"))) d(n);
    } else {
      const e = document.querySelectorAll("[" + l + "]");
      for (const n of Array.from(e))
        for (const f of Array.from(n.querySelectorAll("[data-ln-toast-item]"))) d(f);
    }
  }
  ft(function() {
    window.addEventListener("ln-toast:enqueue", g), window.addEventListener("ln-toast:clear", i), window.addEventListener("ln-modal:open", function() {
      const t = document.querySelectorAll("[" + l + "]");
      for (const e of Array.from(t))
        e.querySelectorAll("[data-ln-toast-item]").length > 0 && y(e);
    }), new MutationObserver(function(t) {
      for (const e of t) {
        if (e.type === "attributes") {
          p(e.target);
          continue;
        }
        for (const n of e.addedNodes)
          p(n);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [l] }), p(document.body);
  }, "ln-toast");
})();
(function() {
  const l = "data-ln-upload", s = "lnUpload", b = "data-ln-upload-dict", y = "data-ln-upload-accept", _ = "data-ln-upload-context", p = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-icon-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function m() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const i = document.createElement("div");
    i.innerHTML = p;
    const r = i.firstElementChild;
    r && document.body.appendChild(r);
  }
  if (window[s] !== void 0) return;
  function a(i) {
    if (i === 0) return "0 B";
    const r = 1024, t = ["B", "KB", "MB", "GB"], e = Math.floor(Math.log(i) / Math.log(r));
    return parseFloat((i / Math.pow(r, e)).toFixed(1)) + " " + t[e];
  }
  function h(i) {
    return i.split(".").pop().toLowerCase();
  }
  function o(i) {
    return i === "docx" && (i = "doc"), ["pdf", "doc", "epub"].includes(i) ? "ln-icon-custom-file-" + i : "ln-icon-file";
  }
  function d(i, r) {
    if (!r) return !0;
    const t = "." + h(i.name);
    return r.split(",").map(function(n) {
      return n.trim().toLowerCase();
    }).includes(t.toLowerCase());
  }
  function u(i) {
    if (i.lnUploadAPI) return;
    m();
    const r = te(i, b), t = i.querySelector(".ln-upload__zone"), e = i.querySelector(".ln-upload__list"), n = i.getAttribute(y) || "";
    if (!t || !e) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", i);
      return;
    }
    let f = i.querySelector('input[type="file"]');
    f || (f = document.createElement("input"), f.type = "file", f.multiple = !0, f.classList.add("hidden"), n && (f.accept = n.split(",").map(function(P) {
      return P = P.trim(), P.startsWith(".") ? P : "." + P;
    }).join(",")), i.appendChild(f));
    const v = i.getAttribute(l) || "/files/upload", E = i.getAttribute(_) || "", w = i.getAttribute("data-ln-upload-delete") || (v.includes("/upload") ? v.replace(/\/upload\/?$/, "/{id}") : v + "/{id}"), A = /* @__PURE__ */ new Map();
    let S = 0;
    function q() {
      const P = document.querySelector('meta[name="csrf-token"]');
      return P ? P.getAttribute("content") : "";
    }
    function x(P) {
      if (!d(P, n)) {
        const T = r["invalid-type"];
        L(i, "ln-upload:invalid", {
          file: P,
          message: T
        }), L(window, "ln-toast:enqueue", {
          type: "error",
          title: r["invalid-title"] || "Invalid File",
          message: T || r["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const W = "file-" + ++S, J = h(P.name), Tt = o(J), pt = _t(i, "ln-upload-item", "ln-upload");
      if (!pt) return;
      const ot = pt.firstElementChild;
      if (!ot) return;
      ot.setAttribute("data-file-id", W), lt(ot, {
        name: P.name,
        sizeText: "0%",
        iconHref: "#" + Tt,
        removeLabel: r.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const qt = ot.querySelector(".ln-upload__progress-bar"), mt = ot.querySelector('[data-ln-upload-action="remove"]');
      mt && (mt.disabled = !0), e.appendChild(ot);
      const ut = new FormData();
      ut.append("file", P);
      const Ot = /* @__PURE__ */ new Set();
      i.querySelectorAll("input, select, textarea").forEach(function(T) {
        if (T.name && T.name !== "file_ids[]" && T.type !== "file") {
          if ((T.type === "checkbox" || T.type === "radio") && !T.checked)
            return;
          ut.append(T.name, T.value), Ot.add(T.name);
        }
      }), !Ot.has("context") && E && ut.append("context", E);
      const Z = new XMLHttpRequest();
      Z.upload.addEventListener("progress", function(T) {
        if (T.lengthComputable) {
          const I = Math.round(T.loaded / T.total * 100);
          qt.style.width = I + "%", lt(ot, { sizeText: I + "%" });
        }
      }), Z.addEventListener("load", function() {
        if (Z.status >= 200 && Z.status < 300) {
          let T;
          try {
            T = JSON.parse(Z.responseText);
          } catch {
            C("Invalid response");
            return;
          }
          lt(ot, { sizeText: a(T.size || P.size), uploading: !1 }), mt && (mt.disabled = !1), A.set(W, {
            serverId: T.id,
            name: T.name,
            size: T.size
          }), D(), L(i, "ln-upload:uploaded", {
            localId: W,
            serverId: T.id,
            name: T.name
          });
        } else {
          let T = r["upload-failed"] || "Upload failed";
          try {
            T = JSON.parse(Z.responseText).message || T;
          } catch {
          }
          C(T);
        }
      }), Z.addEventListener("error", function() {
        C(r["network-error"] || "Network error");
      });
      function C(T) {
        qt && (qt.style.width = "100%"), lt(ot, { sizeText: r.error || "Error", uploading: !1, error: !0 }), mt && (mt.disabled = !1), L(i, "ln-upload:error", {
          file: P,
          message: T
        }), L(window, "ln-toast:enqueue", {
          type: "error",
          title: r["error-title"] || "Upload Error",
          message: T || r["upload-failed"] || "Failed to upload file"
        });
      }
      Z.open("POST", v), Z.setRequestHeader("X-CSRF-TOKEN", q()), Z.setRequestHeader("Accept", "application/json"), Z.send(ut);
    }
    function D() {
      for (const P of i.querySelectorAll('input[name="file_ids[]"]'))
        P.remove();
      for (const [, P] of A) {
        const W = document.createElement("input");
        W.type = "hidden", W.name = "file_ids[]", W.value = P.serverId, i.appendChild(W);
      }
    }
    function k(P) {
      const W = A.get(P), J = e.querySelector('[data-file-id="' + P + '"]');
      if (!W || !W.serverId) {
        J && J.remove(), A.delete(P), D();
        return;
      }
      J && lt(J, { deleting: !0 });
      const Tt = w.replace("{id}", W.serverId);
      fetch(Tt, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": q(),
          Accept: "application/json"
        }
      }).then(function(pt) {
        pt.status === 200 ? (J && J.remove(), A.delete(P), D(), L(i, "ln-upload:removed", {
          localId: P,
          serverId: W.serverId
        })) : (J && lt(J, { deleting: !1 }), L(window, "ln-toast:enqueue", {
          type: "error",
          title: r["delete-title"] || "Error",
          message: r["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(pt) {
        console.warn("[ln-upload] Delete error:", pt), J && lt(J, { deleting: !1 }), L(window, "ln-toast:enqueue", {
          type: "error",
          title: r["network-error"] || "Network error",
          message: r["connection-error"] || "Could not connect to server"
        });
      });
    }
    function R(P) {
      for (const W of P)
        x(W);
      f.value = "";
    }
    const F = function() {
      f.click();
    }, B = function() {
      R(this.files);
    }, z = function(P) {
      P.preventDefault(), P.stopPropagation(), t.classList.add("ln-upload__zone--dragover");
    }, j = function(P) {
      P.preventDefault(), P.stopPropagation(), t.classList.add("ln-upload__zone--dragover");
    }, K = function(P) {
      P.preventDefault(), P.stopPropagation(), t.classList.remove("ln-upload__zone--dragover");
    }, et = function(P) {
      P.preventDefault(), P.stopPropagation(), t.classList.remove("ln-upload__zone--dragover"), R(P.dataTransfer.files);
    }, Lt = function(P) {
      const W = P.target.closest('[data-ln-upload-action="remove"]');
      if (!W || !e.contains(W) || W.disabled) return;
      const J = W.closest(".ln-upload__item");
      J && k(J.getAttribute("data-file-id"));
    };
    t.addEventListener("click", F), f.addEventListener("change", B), t.addEventListener("dragenter", z), t.addEventListener("dragover", j), t.addEventListener("dragleave", K), t.addEventListener("drop", et), e.addEventListener("click", Lt), i.lnUploadAPI = {
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
        A.clear(), e.innerHTML = "", D(), L(i, "ln-upload:cleared", {});
      },
      destroy: function() {
        t.removeEventListener("click", F), f.removeEventListener("change", B), t.removeEventListener("dragenter", z), t.removeEventListener("dragover", j), t.removeEventListener("dragleave", K), t.removeEventListener("drop", et), e.removeEventListener("click", Lt), A.clear(), e.innerHTML = "", D(), delete i.lnUploadAPI;
      }
    };
  }
  function c() {
    for (const i of document.querySelectorAll("[" + l + "]"))
      u(i);
  }
  function g() {
    ft(function() {
      new MutationObserver(function(r) {
        for (const t of r)
          if (t.type === "childList") {
            for (const e of t.addedNodes)
              if (e.nodeType === 1) {
                e.hasAttribute(l) && u(e);
                for (const n of e.querySelectorAll("[" + l + "]"))
                  u(n);
              }
          } else t.type === "attributes" && t.target.hasAttribute(l) && u(t.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [l]
      });
    }, "ln-upload");
  }
  window[s] = {
    init: u,
    initAll: c
  }, g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", c) : c();
})();
(function() {
  const l = "lnExternalLinks";
  if (window[l] !== void 0) return;
  function s(a) {
    return a.hostname && a.hostname !== window.location.hostname;
  }
  function b(a) {
    if (a.getAttribute("data-ln-external-link") === "processed" || !s(a)) return;
    a.target = "_blank";
    const h = (a.rel || "").split(/\s+/).filter(Boolean);
    h.includes("noopener") || h.push("noopener"), h.includes("noreferrer") || h.push("noreferrer"), a.rel = h.join(" ");
    const o = document.createElement("span");
    o.className = "sr-only", o.textContent = "(opens in new tab)", a.appendChild(o), a.setAttribute("data-ln-external-link", "processed"), L(a, "ln-external-links:processed", {
      link: a,
      href: a.href
    });
  }
  function y(a) {
    a = a || document.body;
    for (const h of a.querySelectorAll("a, area"))
      b(h);
  }
  function _() {
    ft(function() {
      document.body.addEventListener("click", function(a) {
        const h = a.target.closest("a, area");
        h && h.getAttribute("data-ln-external-link") === "processed" && L(h, "ln-external-links:clicked", {
          link: h,
          href: h.href,
          text: h.textContent || h.title || ""
        });
      });
    }, "ln-external-links");
  }
  function p() {
    ft(function() {
      new MutationObserver(function(h) {
        for (const o of h) {
          if (o.type === "childList") {
            for (const d of o.addedNodes)
              if (d.nodeType === 1 && (d.matches && (d.matches("a") || d.matches("area")) && b(d), d.querySelectorAll))
                for (const u of d.querySelectorAll("a, area"))
                  b(u);
          }
          if (o.type === "attributes" && o.attributeName === "href") {
            const d = o.target;
            d.matches && (d.matches("a") || d.matches("area")) && b(d);
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
  function m() {
    _(), p(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      y();
    }) : y();
  }
  window[l] = {
    process: y
  }, m();
})();
(function() {
  const l = "data-ln-link", s = "lnLink";
  if (window[s] !== void 0) return;
  let b = null;
  function y() {
    b = document.createElement("div"), b.className = "ln-link-status", document.body.appendChild(b);
  }
  function _(e) {
    b && (b.textContent = e, b.classList.add("ln-link-status--visible"));
  }
  function p() {
    b && b.classList.remove("ln-link-status--visible");
  }
  function m(e, n) {
    if (n.target.closest("a, button, input, select, textarea")) return;
    const f = e.querySelector("a");
    if (!f) return;
    const v = f.getAttribute("href");
    if (!v) return;
    if (n.ctrlKey || n.metaKey || n.button === 1) {
      window.open(v, "_blank");
      return;
    }
    X(e, "ln-link:navigate", { target: e, href: v, link: f }).defaultPrevented || f.click();
  }
  function a(e) {
    const n = e.querySelector("a");
    if (!n) return;
    const f = n.getAttribute("href");
    f && _(f);
  }
  function h() {
    p();
  }
  function o(e) {
    e[s + "Row"] || !e.querySelector("a") || (e[s + "Row"] = !0, e._lnLinkClick = function(f) {
      m(e, f);
    }, e._lnLinkEnter = function() {
      a(e);
    }, e.addEventListener("click", e._lnLinkClick), e.addEventListener("mouseenter", e._lnLinkEnter), e.addEventListener("mouseleave", h));
  }
  function d(e) {
    e[s + "Row"] && (e._lnLinkClick && e.removeEventListener("click", e._lnLinkClick), e._lnLinkEnter && e.removeEventListener("mouseenter", e._lnLinkEnter), e.removeEventListener("mouseleave", h), delete e._lnLinkClick, delete e._lnLinkEnter, delete e[s + "Row"]);
  }
  function u(e) {
    if (!e[s + "Init"]) return;
    const n = e.tagName;
    if (n === "TABLE" || n === "TBODY") {
      const f = n === "TABLE" && e.querySelector("tbody") || e;
      for (const v of f.querySelectorAll("tr"))
        d(v);
    } else
      d(e);
    delete e[s + "Init"];
  }
  function c(e) {
    if (e[s + "Init"]) return;
    e[s + "Init"] = !0;
    const n = e.tagName;
    if (n === "TABLE" || n === "TBODY") {
      const f = n === "TABLE" && e.querySelector("tbody") || e;
      for (const v of f.querySelectorAll("tr"))
        o(v);
    } else
      o(e);
  }
  function g(e) {
    e.hasAttribute && e.hasAttribute(l) && c(e);
    const n = e.querySelectorAll ? e.querySelectorAll("[" + l + "]") : [];
    for (const f of n)
      c(f);
  }
  function i() {
    ft(function() {
      new MutationObserver(function(n) {
        for (const f of n)
          if (f.type === "childList") {
            for (const v of f.addedNodes)
              if (v.nodeType === 1) {
                g(v);
                const E = v.closest("[" + l + "]");
                if (E)
                  if (v.tagName === "TR")
                    o(v);
                  else {
                    const w = E.tagName;
                    if (w === "TABLE" || w === "TBODY") {
                      const A = v.querySelectorAll ? v.querySelectorAll("tr") : [];
                      for (const S of A)
                        o(S);
                    }
                  }
              }
          } else f.type === "attributes" && (f.target.hasAttribute && f.target.hasAttribute(l) ? g(f.target) : u(f.target));
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [l]
      });
    }, "ln-link");
  }
  function r(e) {
    g(e);
  }
  window[s] = { init: r, destroy: u };
  function t() {
    y(), i(), r(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t) : t();
})();
(function() {
  const l = "[data-ln-progress]", s = "lnProgress";
  if (window[s] !== void 0) return;
  function b(m) {
    return this.dom = m, this._attrObserver = null, this._parentObserver = null, p.call(this), y.call(this), _.call(this), this;
  }
  b.prototype.destroy = function() {
    this.dom[s] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[s]);
  };
  function y() {
    const m = this, a = new MutationObserver(function(h) {
      for (const o of h)
        (o.attributeName === "data-ln-progress" || o.attributeName === "data-ln-progress-max") && p.call(m);
    });
    a.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = a;
  }
  function _() {
    const m = this, a = this.dom.parentElement;
    if (!a) return;
    const h = new MutationObserver(function(o) {
      for (const d of o)
        d.attributeName === "data-ln-progress-max" && p.call(m);
    });
    h.observe(a, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = h;
  }
  function p() {
    const m = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, a = this.dom.parentElement, o = (a && a.hasAttribute("data-ln-progress-max") ? parseFloat(a.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let d = o > 0 ? m / o * 100 : 0;
    d < 0 && (d = 0), d > 100 && (d = 100), this.dom.style.width = d + "%";
    const u = Math.max(0, Math.min(m, o));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(o)), this.dom.setAttribute("aria-valuenow", String(u)), L(this.dom, "ln-progress:change", { target: this.dom, value: m, max: o, percentage: d });
  }
  U(
    l,
    s,
    b,
    "ln-progress"
  );
})();
(function() {
  const l = "data-ln-filter", s = "lnFilter", b = "data-ln-filter-key", y = "data-ln-filter-value", _ = "data-ln-filter-hide", p = "data-ln-filter-reset", m = "data-ln-filter-col", a = "data-ln-hash", h = /* @__PURE__ */ new WeakMap();
  if (window[s] !== void 0) return;
  function o(r) {
    return r.hasAttribute(p) || r.getAttribute(y) === "";
  }
  function d(r) {
    const t = r.dom.querySelectorAll("[" + b + "]");
    let e = null;
    const n = [];
    for (let f = 0; f < t.length; f++) {
      const v = t[f];
      if (e || (e = v.getAttribute(b)), v.checked && !o(v)) {
        const E = v.getAttribute(y);
        E && n.push(E);
      }
    }
    return { key: e, values: n, targetId: r.targetId };
  }
  function u(r, t, e) {
    const n = r.querySelectorAll("[" + b + "]"), f = Array.isArray(e) && e.length > 0;
    for (let v = 0; v < n.length; v++) {
      const E = n[v];
      o(E) ? E.checked = !f : f && E.getAttribute(b) === t && e.indexOf(E.getAttribute(y)) !== -1 ? E.checked = !0 : E.checked = !1;
    }
  }
  function c(r, t) {
    if (r.length !== t.length) return !0;
    for (let e = 0; e < r.length; e++) if (r[e] !== t[e]) return !0;
    return !1;
  }
  function g(r) {
    this.dom = r, this.targetId = r.getAttribute(l);
    const t = r.getAttribute(m);
    this.colIndex = t !== null ? parseInt(t, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = vt(r, "filter"), this.hashEnabled = !!this.nsKey;
    const e = this, n = ne(
      function() {
        e._render();
      }
    );
    this._queueRender = n, this._attachHandlers(), this._onHashChange = function() {
      if (e._destroyed || !e.hashEnabled) return;
      const v = rt(e.nsKey), E = Qt(v);
      E && E.key && E.values.length > 0 ? u(e.dom, E.key, E.values) : u(e.dom, null, []), e._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let f = !1;
    if (this.hashEnabled) {
      const v = rt(this.nsKey), E = Qt(v);
      E && E.key && E.values.length > 0 && (u(r, E.key, E.values), ct(function() {
        e._destroyed || e._render();
      }), f = !0);
    }
    if (!f && r.hasAttribute("data-ln-persist")) {
      const v = Bt("filter", r);
      v && v.key && Array.isArray(v.values) && v.values.length > 0 && (u(r, v.key, v.values), ct(function() {
        e._destroyed || e._render();
      }), f = !0);
    }
    if (!f) {
      const v = r.querySelectorAll("[" + b + "]");
      for (let E = 0; E < v.length; E++)
        if (v[E].checked && !o(v[E])) {
          ct(function() {
            e._destroyed || e._render();
          });
          break;
        }
    }
    return this;
  }
  g.prototype._attachHandlers = function() {
    const r = this;
    this._onDomChange = function(t) {
      const e = t.target;
      if (!e || !e.hasAttribute || !e.hasAttribute(b)) return;
      const n = Array.from(r.dom.querySelectorAll("[" + b + "]"));
      if (o(e)) {
        for (let f = 0; f < n.length; f++)
          o(n[f]) || (n[f].checked = !1);
        e.checked = !0, r._queueRender();
        return;
      }
      if (e.checked) {
        for (let v = 0; v < n.length; v++)
          o(n[v]) && (n[v].checked = !1);
        let f = !1;
        for (let v = 0; v < n.length; v++)
          if (o(n[v])) {
            f = !0;
            break;
          }
        if (f) {
          let v = !0;
          for (let E = 0; E < n.length; E++)
            if (!o(n[E]) && !n[E].checked) {
              v = !1;
              break;
            }
          if (v)
            for (let E = 0; E < n.length; E++)
              o(n[E]) ? n[E].checked = !0 : n[E].checked = !1;
        }
      } else {
        let f = !1;
        for (let v = 0; v < n.length; v++)
          if (!o(n[v]) && n[v].checked) {
            f = !0;
            break;
          }
        if (!f)
          for (let v = 0; v < n.length; v++)
            o(n[v]) && (n[v].checked = !0);
      }
      r._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, g.prototype._render = function() {
    const r = this, t = d(this), e = this._lastSnapshot;
    if (!(!e || e.key !== t.key || c(e.values, t.values))) return;
    const f = t.key === null || t.values.length === 0, v = document.getElementById(r.targetId), E = {
      key: t.key,
      values: t.values.slice(),
      targetId: r.targetId
    };
    L(r.dom, "ln-filter:change", E);
    let w = !1;
    v && v !== r.dom && X(v, "ln-filter:change", E).defaultPrevented && (w = !0);
    const A = e && e.values.length > 0, S = t.values.length === 0;
    if (A && S) {
      const x = { targetId: r.targetId };
      L(r.dom, "ln-filter:reset", x), v && v !== r.dom && L(v, "ln-filter:reset", x);
    }
    if (this._lastSnapshot = { key: t.key, values: t.values.slice() }, this.dom.hasAttribute("data-ln-persist") && (t.key && t.values.length > 0 ? yt("filter", this.dom, { key: t.key, values: t.values.slice() }) : yt("filter", this.dom, null)), this.hashEnabled) {
      const x = Te(t.key, t.values);
      it(this.nsKey, x);
    }
    if (w) return;
    const q = [];
    for (let x = 0; x < t.values.length; x++)
      q.push(t.values[x].toLowerCase());
    if (r.colIndex !== null)
      r._filterTableRows(t);
    else {
      if (!v) return;
      const x = v.children;
      for (let D = 0; D < x.length; D++) {
        const k = x[D];
        if (f) {
          k.removeAttribute(_);
          continue;
        }
        const R = k.getAttribute("data-" + t.key);
        k.removeAttribute(_), R !== null && q.indexOf(R.toLowerCase()) === -1 && k.setAttribute(_, "true");
      }
    }
  }, g.prototype._filterTableRows = function(r) {
    const t = document.getElementById(this.targetId);
    if (!t) return;
    const e = t.tagName === "TABLE" ? t : t.querySelector("table");
    if (!e) return;
    const n = r.key || this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex, f = r.values;
    h.has(e) || h.set(e, {});
    const v = h.get(e);
    if (n && f.length > 0) {
      const S = [];
      for (let q = 0; q < f.length; q++)
        S.push(f[q].toLowerCase());
      v[n] = { col: this.colIndex, values: S };
    } else n && delete v[n];
    const E = Object.keys(v), w = E.length > 0, A = e.tBodies;
    for (let S = 0; S < A.length; S++) {
      const q = A[S].rows;
      for (let x = 0; x < q.length; x++) {
        const D = q[x];
        if (!w) {
          D.removeAttribute(_);
          continue;
        }
        let k = !0;
        for (let R = 0; R < E.length; R++) {
          const F = v[E[R]], B = D.cells[F.col], z = B ? B.textContent.trim().toLowerCase() : "";
          if (F.values.indexOf(z) === -1) {
            k = !1;
            break;
          }
        }
        k ? D.removeAttribute(_) : D.setAttribute(_, "true");
      }
    }
  }, g.prototype.destroy = function() {
    if (this.dom[s]) {
      if (this._destroyed = !0, this.colIndex !== null) {
        const r = document.getElementById(this.targetId);
        if (r) {
          const t = r.tagName === "TABLE" ? r : r.querySelector("table");
          if (t && h.has(t)) {
            const e = h.get(t), n = this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex;
            n && e[n] && delete e[n], Object.keys(e).length === 0 && h.delete(t);
          }
        }
      }
      this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[s];
    }
  };
  function i(r, t) {
    const e = r[s];
    !e || e._destroyed || t === a && (e.hashEnabled && e._onHashChange && window.removeEventListener("hashchange", e._onHashChange), e.nsKey = vt(r, "filter"), e.hashEnabled = !!e.nsKey, e.hashEnabled && window.addEventListener("hashchange", e._onHashChange));
  }
  U(l, s, g, "ln-filter", {
    extraAttributes: [a],
    onAttributeChange: i
  });
})();
(function() {
  const l = "data-ln-search", s = "lnSearch", b = "data-ln-search-for", y = "lnSearchControl", _ = "data-ln-search-items", p = "data-ln-search-fields", m = "data-ln-search-exclude", a = "data-ln-search-hide", h = "data-ln-hash";
  if (window[s] !== void 0) return;
  function d(w) {
    const A = vt(w, "search");
    if (A) return A;
    if (w.id) {
      const S = document.querySelector("[" + b + '="' + w.id + '"]');
      if (S) {
        const q = vt(S, "search");
        if (q) return q;
      }
    }
    return null;
  }
  function u(w) {
    return (w || "").trim().toLowerCase();
  }
  function c(w) {
    return w ? w.split(/\s+/).filter(Boolean) : [];
  }
  function g(w) {
    const A = w.tagName;
    return A === "INPUT" || A === "TEXTAREA" ? w : w.querySelector('[name="search"]') || w.querySelector('input[type="search"]') || w.querySelector('input[type="text"]');
  }
  function i(w) {
    const A = w.getAttribute(p);
    if (A === null) return null;
    const S = A.split(",").map(function(q) {
      return q.trim();
    }).filter(Boolean);
    return S.length ? S : null;
  }
  function r(w, A) {
    const S = w.childNodes;
    for (let q = 0; q < S.length; q++) {
      const x = S[q];
      if (x.nodeType === 3) {
        A.push(x.nodeValue);
        continue;
      }
      x.nodeType === 1 && (x.hasAttribute(m) || r(x, A));
    }
  }
  function t(w) {
    if (w._lnSearchText !== void 0) return w._lnSearchText;
    const A = [];
    r(w, A);
    const S = A.join(" ").replace(/\s+/g, " ").toLowerCase();
    return w._lnSearchText = S, S;
  }
  function e(w, A) {
    if (!w.id) return;
    const S = document.querySelectorAll("[" + b + '="' + w.id + '"]');
    for (const q of S) {
      const x = q[y];
      x && clearTimeout(x._debounceTimer);
      const D = g(q);
      D && D.value !== A && (D.value = A);
    }
  }
  function n(w) {
    this.dom = w, this.term = w.getAttribute(l) || "", this._destroyed = !1;
    const A = this;
    return this.nsKey = d(w), this.hashEnabled = !!this.nsKey, this._observer = new MutationObserver(function(S) {
      for (let q = 0; q < S.length; q++) {
        const x = S[q];
        if (x.type === "childList" || x.type === "characterData") {
          const D = x.target;
          if (D && D._lnSearchText !== void 0 && delete D._lnSearchText, D && D.parentElement && D.parentElement._lnSearchText !== void 0 && delete D.parentElement._lnSearchText, x.addedNodes)
            for (let k = 0; k < x.addedNodes.length; k++) {
              const R = x.addedNodes[k];
              R._lnSearchText !== void 0 && delete R._lnSearchText;
            }
        }
      }
    }), this._observer.observe(w, { childList: !0, subtree: !0, characterData: !0 }), this._onHashChange = function() {
      if (A._destroyed || !A.hashEnabled) return;
      const S = rt(A.nsKey), q = A.dom.getAttribute(l) || "";
      S !== null && S !== q ? A.dom.setAttribute(l, S) : S === null && q !== "" && A.dom.setAttribute(l, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), ct(function() {
      if (!A._destroyed) {
        if (A.hashEnabled) {
          const S = rt(A.nsKey);
          if (S !== null && S !== A.term) {
            A.term = S, A.dom.setAttribute(l, S), e(A.dom, S), A._apply();
            return;
          }
        }
        u(A.term) && (e(A.dom, A.term), A._apply());
      }
    }), this;
  }
  n.prototype._apply = function() {
    const w = this.dom, A = u(this.term), S = c(A);
    if (this.hashEnabled && it(this.nsKey, this.term ? this.term : null), X(w, "ln-search:change", {
      term: A,
      tokens: S,
      targetId: w.id,
      fields: i(w)
    }).defaultPrevented) return;
    const x = w.getAttribute(_), D = x ? w.querySelectorAll(x) : w.children;
    for (let k = 0; k < D.length; k++) {
      const R = D[k];
      if (R.removeAttribute(a), R.hasAttribute(m) || S.length === 0) continue;
      const F = t(R);
      for (let B = 0; B < S.length; B++)
        if (F.indexOf(S[B]) === -1) {
          R.setAttribute(a, "true");
          break;
        }
    }
  }, n.prototype.destroy = function() {
    this.dom[s] && (this._destroyed = !0, this._observer && (this._observer.disconnect(), this._observer = null), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[s]);
  };
  function f(w) {
    this.dom = w, this.targetId = w.getAttribute(b), this.input = g(w);
    const A = w.getAttribute("data-ln-search-debounce");
    if (this.debounceTime = A !== null ? parseInt(A, 10) : 500, isNaN(this.debounceTime) && (this.debounceTime = 500), this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const S = this;
      ct(function() {
        const q = document.getElementById(S.targetId);
        q && ((q.getAttribute(l) || "").trim() || S._write(S.input.value));
      });
    }
    return this;
  }
  f.prototype._write = function(w) {
    const A = document.getElementById(this.targetId);
    A && A.setAttribute(l, w);
  }, f.prototype._attachHandler = function() {
    if (!this.input) return;
    const w = this;
    this._onInput = function() {
      clearTimeout(w._debounceTimer), w._debounceTimer = setTimeout(function() {
        w._write(w.input.value);
      }, w.debounceTime);
    }, this.input.addEventListener("input", this._onInput);
  }, f.prototype.destroy = function() {
    this.dom[y] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[y]);
  };
  function v(w) {
    const A = w.getAttribute("data-ln-search-clear-for");
    if (A) {
      const D = document.getElementById(A), k = document.querySelector("[" + b + '="' + A + '"]'), R = k ? g(k) : null;
      return { target: D, input: R };
    }
    const S = w.closest("[" + l + "]");
    if (S) {
      const D = S.id ? document.querySelector("[" + b + '="' + S.id + '"]') : null, k = D ? g(D) : null;
      return { target: S, input: k };
    }
    const q = w.closest("[" + b + "]");
    if (q) {
      const D = q.getAttribute(b), k = D ? document.getElementById(D) : null, R = g(q);
      return { target: k, input: R };
    }
    const x = w.parentElement;
    if (x) {
      const D = x.querySelector("[" + b + "]");
      if (D) {
        const k = D.getAttribute(b), R = k ? document.getElementById(k) : null, F = g(D);
        return { target: R, input: F };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(w) {
    const A = w.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!A) return;
    const S = v(A);
    if (!(!S.target && !S.input)) {
      if (w.preventDefault(), S.input) {
        const x = (S.input.closest("[" + b + "]") || S.input)[y];
        x && clearTimeout(x._debounceTimer), S.input.value = "", S.input.focus();
      }
      S.target && S.target.setAttribute(l, "");
    }
  });
  function E(w, A) {
    const S = w[s];
    if (!S || S._destroyed) return;
    if (A === h) {
      S.hashEnabled && S._onHashChange && window.removeEventListener("hashchange", S._onHashChange), S.nsKey = d(w), S.hashEnabled = !!S.nsKey, S.hashEnabled && window.addEventListener("hashchange", S._onHashChange);
      return;
    }
    const q = w.getAttribute(l) || "";
    q !== S.term && (S.term = q, e(w, q), S._apply());
  }
  U(l, s, n, "ln-search", {
    extraAttributes: [h],
    onAttributeChange: E
  }), U(b, y, f, "ln-search-control");
})();
(function() {
  const l = "data-ln-sort", s = "lnSort", b = "data-ln-sort-field", y = "data-ln-sort-state", _ = "data-ln-sort-dir", p = "data-ln-sort-items", m = "data-ln-hash";
  if (window[s] !== void 0) return;
  const a = /* @__PURE__ */ new WeakMap();
  function h(u, c) {
    if (c) {
      const g = u.querySelector('[data-ln-field="' + c + '"]');
      if (g) return Ct(g);
    }
    return Ct(u);
  }
  function o(u) {
    this.dom = u, this.targetId = u.getAttribute(l), this.field = u.getAttribute(b) || null;
    const c = u.closest("th");
    this.column = !this.field && c ? c.cellIndex : null, this.itemsSelector = u.getAttribute(p) || null, this._state = u.getAttribute(y) || "none", this._destroyed = !1, this.nsKey = vt(u, "sort"), this.hashEnabled = !!this.nsKey;
    const g = this;
    this._onClick = function(r) {
      const t = r.target.closest("[" + _ + "]");
      if (!t) return;
      const e = t.getAttribute(_);
      g._apply(e);
    }, u.addEventListener("click", this._onClick), this._onSortChange = function(r) {
      if (g._destroyed || !r.detail) return;
      const t = g._resolveTarget();
      if (!(t && (r.target === t || t.contains(r.target)) || r.detail.targetId && r.detail.targetId === g.targetId)) return;
      if (g.field !== null && r.detail.field === g.field || g.column !== null && r.detail.column === g.column) {
        r.detail.direction && u.getAttribute(y) !== r.detail.direction && (g._state = r.detail.direction, u.setAttribute(y, r.detail.direction), g._updateAriaSort(r.detail.direction));
        return;
      }
      u.getAttribute(y) !== "none" && (g._state = "none", u.setAttribute(y, "none"), g._updateAriaSort("none")), u.hasAttribute("data-ln-persist") && yt("sort", u, null);
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (g._destroyed || !g.hashEnabled) return;
      const r = rt(g.nsKey), t = Gt(r);
      if (t)
        g.field !== null && t.fieldOrColumn === g.field || g.column !== null && String(g.column) === t.fieldOrColumn ? g._state !== t.direction && g._apply(t.direction, !0) : g._state !== "none" && (g._state = "none", u.setAttribute(y, "none"), g._updateAriaSort("none"));
      else if (g._state !== "none") {
        g._state = "none", u.setAttribute(y, "none"), g._updateAriaSort("none");
        const e = g._resolveTarget();
        e && (X(e, "ln-sort:change", {
          field: g.field,
          column: g.column,
          direction: "none",
          targetId: g.targetId
        }).defaultPrevented || g._defaultSort(e, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let i = !1;
    if (this.hashEnabled) {
      const r = rt(this.nsKey), t = Gt(r);
      t && ((g.field !== null && t.fieldOrColumn === g.field || g.column !== null && String(g.column) === t.fieldOrColumn) && ct(function() {
        g._destroyed || g._apply(t.direction, !0);
      }), i = !0);
    }
    if (!i && u.hasAttribute("data-ln-persist")) {
      const r = Bt("sort", u);
      r && r.direction && r.direction !== "none" && ct(function() {
        g._destroyed || g._apply(r.direction, !0);
      }), i = !0;
    }
    if (!i) {
      const r = u.getAttribute(y);
      r && (r === "asc" || r === "desc") && ct(function() {
        g._destroyed || g._apply(r, !0);
      });
    }
    return this;
  }
  o.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, o.prototype._updateAriaSort = function(u) {
    const c = this.dom.closest("th");
    c && (u === "asc" ? c.setAttribute("aria-sort", "ascending") : u === "desc" ? c.setAttribute("aria-sort", "descending") : c.setAttribute("aria-sort", "none"));
  }, o.prototype._apply = function(u, c) {
    if (this._destroyed) return;
    this._state = u, this.dom.getAttribute(y) !== u && this.dom.setAttribute(y, u), this._updateAriaSort(u);
    const g = this._resolveTarget();
    if (!g) return;
    const i = {
      field: this.field,
      column: this.column,
      direction: u,
      targetId: this.targetId
    };
    if (!c && (this.dom.hasAttribute("data-ln-persist") && yt("sort", this.dom, u === "none" ? null : i), this.hashEnabled)) {
      const t = Le(this.field !== null ? this.field : this.column, u);
      it(this.nsKey, t);
    }
    X(g, "ln-sort:change", i).defaultPrevented || this._defaultSort(g, u);
  }, o.prototype._defaultSort = function(u, c) {
    const g = this.itemsSelector ? Array.from(u.querySelectorAll(this.itemsSelector)) : Array.from(u.children);
    if (!g.length) return;
    const i = g[0].parentNode;
    a.has(u) || a.set(u, g.slice());
    let r;
    if (c === "none")
      r = (a.get(u) || g).filter(function(n) {
        return n.parentNode === i;
      });
    else {
      const e = this.field, n = g.map(function(w) {
        return h(w, e);
      }), f = xt(n), v = typeof Intl < "u" ? new Intl.Collator($(this.dom), { sensitivity: "base" }) : null, E = c === "desc" ? -1 : 1;
      r = g.slice().sort(function(w, A) {
        return kt(h(w, e), h(A, e), f, v) * E;
      });
    }
    const t = document.createDocumentFragment();
    for (let e = 0; e < r.length; e++) t.appendChild(r[e]);
    i.appendChild(t);
  }, o.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[s]);
  };
  function d(u, c) {
    const g = u[s];
    if (!(!g || g._destroyed))
      if (c === b) {
        g.field = u.getAttribute(b) || null;
        const i = u.closest("th");
        g.column = !g.field && i ? i.cellIndex : null;
      } else if (c === p)
        g.itemsSelector = u.getAttribute(p) || null;
      else if (c === y) {
        const i = u.getAttribute(y) || "none";
        i !== g._state && g._apply(i);
      } else c === l ? g.targetId = u.getAttribute(l) : c === m && (g.hashEnabled && g._onHashChange && window.removeEventListener("hashchange", g._onHashChange), g.nsKey = vt(u, "sort"), g.hashEnabled = !!g.nsKey, g.hashEnabled && window.addEventListener("hashchange", g._onHashChange));
  }
  U(l, s, o, "ln-sort", {
    extraAttributes: [b, p, y, m],
    onAttributeChange: d
  });
})();
(function() {
  const l = "data-ln-table", s = "lnTable", b = "data-ln-table-empty";
  if (window[s] !== void 0) return;
  const h = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function o(i, r) {
    if (i == null || isNaN(i)) return "";
    try {
      return new Intl.NumberFormat($(r)).format(i);
    } catch {
      return String(i);
    }
  }
  function d(i) {
    let r = i.parentElement;
    for (; r && r !== document.body && r !== document.documentElement; ) {
      const e = getComputedStyle(r).overflowY;
      if (e === "auto" || e === "scroll") return r;
      r = r.parentElement;
    }
    return null;
  }
  function u(i) {
    const r = i._scrollContainer || d(i.dom);
    return {
      container: r,
      top: r ? r.scrollTop : window.scrollY
    };
  }
  function c(i) {
    i.container ? i.container.scrollTop = i.top : window.scrollTo(window.scrollX, i.top);
  }
  function g(i) {
    this.dom = i, this.table = i.querySelector("table"), this.tbody = i.querySelector("[data-ln-table-body]") || i.querySelector("tbody"), this.thead = i.querySelector("thead");
    const r = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = r ? Array.from(r.querySelectorAll("th")) : [], this._totalSpan = i.querySelector("[data-ln-table-total]"), this._filteredSpan = i.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== i ? this._filteredSpan.parentElement : null), this._selectedSpan = i.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== i ? this._selectedSpan.parentElement : null), this.isDataDriven = i.hasAttribute("data-ln-table-source"), this.name = i.getAttribute(l) || "", this.source = i.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const t = this;
    return this._onSetSearch = function(e) {
      const n = (e.detail && e.detail.query != null ? e.detail.query : e.detail && e.detail.term != null ? e.detail.term : "").trim();
      t.isDataDriven ? (t.currentSearch = n, L(i, "ln-table:search", {
        table: t.name,
        query: t.currentSearch
      }), t._requestData()) : (t._searchTerm = n.toLowerCase(), t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter(), L(i, "ln-table:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      }));
    }, i.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(e) {
      e.preventDefault(), t._onSetSearch(e);
    }, i.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      t.isDataDriven ? (t.currentFilters = {}, t.currentSearch = "", L(i, "ln-table:clear-filters", { table: t.name }), t._requestData()) : (t._searchTerm = "", t._columnFilters = {}, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter(), L(i, "ln-table:filter", {
        term: "",
        matched: t._filteredData.length,
        total: t._data.length
      }));
    }, i.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectable = i.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._windowed = !1, this._cache = null, this.isDataDriven && i.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(e) {
      const n = e.detail || {};
      if (t._windowed) {
        i.classList.remove("ln-table--loading"), t._cache.ingest(n);
        return;
      }
      t._data = n.data || [], t._lastTotal = n.total != null ? n.total : t._data.length, t._lastFiltered = n.filtered != null ? n.filtered : t._data.length, t.totalCount = t._lastTotal, t.visibleCount = t._lastFiltered, t.isLoaded = !0, i.classList.remove("ln-table--loading"), t._vStart = -1, t._vEnd = -1, t._applyFilterAndSort(), t._render(), t._updateFooter(), L(i, "ln-table:rendered", {
        table: t.name,
        total: t.totalCount,
        visible: t.visibleCount
      });
    }, i.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(e) {
      const n = e.detail && e.detail.loading;
      i.classList.toggle("ln-table--loading", !!n), n && (t.isLoaded = !1);
    }, i.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(e) {
      !t._windowed || !t._cache || t._cache.release(e.detail && e.detail.offset);
    }, i.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !t._windowed || !t._cache || t._cache.revalidate();
    }, i.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !t._windowed || !t._cache || t._requestData();
    }, i.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(e) {
      e.preventDefault(), t.currentSort = e.detail.direction === "none" ? null : { field: e.detail.field, direction: e.detail.direction }, t._requestData();
    }, i.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(e) {
      if (e.target.closest("[data-ln-table-row-select]") || e.target.closest("[data-ln-table-row-action]") || e.target.closest("a") || e.target.closest("button") || e.ctrlKey || e.metaKey || e.button === 1) return;
      const n = e.target.closest("[data-ln-table-row]");
      if (!n) return;
      const f = n.getAttribute("data-ln-table-row-id"), v = n._lnRecord || {};
      L(i, "ln-table:row-click", {
        table: t.name,
        id: f,
        record: v
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(e) {
      const n = e.target.closest("[data-ln-table-row-action]");
      if (!n) return;
      e.stopPropagation();
      const f = n.closest("[data-ln-table-row]");
      if (!f) return;
      const v = n.getAttribute("data-ln-table-row-action"), E = f.getAttribute("data-ln-table-row-id"), w = f._lnRecord || {};
      L(i, "ln-table:row-action", {
        table: t.name,
        id: E,
        action: v,
        record: w
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._focusedRowIndex = -1, this._onKeydown = function(e) {
      if (!i.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      const n = t.tbody ? Array.from(t.tbody.querySelectorAll("[data-ln-table-row]")) : [];
      if (n.length)
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault(), t._focusedRowIndex = Math.min(t._focusedRowIndex + 1, n.length - 1), t._focusRow(n);
            break;
          case "ArrowUp":
            e.preventDefault(), t._focusedRowIndex = Math.max(t._focusedRowIndex - 1, 0), t._focusRow(n);
            break;
          case "Home":
            e.preventDefault(), t._focusedRowIndex = 0, t._focusRow(n);
            break;
          case "End":
            e.preventDefault(), t._focusedRowIndex = n.length - 1, t._focusRow(n);
            break;
          case "Enter":
            if (t._focusedRowIndex >= 0 && t._focusedRowIndex < n.length) {
              e.preventDefault();
              const f = n[t._focusedRowIndex];
              L(i, "ln-table:row-click", {
                table: t.name,
                id: f.getAttribute("data-ln-table-row-id"),
                record: f._lnRecord || {}
              });
            }
            break;
          case " ":
            if (t._selectable && t._focusedRowIndex >= 0 && t._focusedRowIndex < n.length) {
              e.preventDefault();
              const f = n[t._focusedRowIndex].querySelector("[data-ln-table-row-select]");
              f && (f.checked = !f.checked, f.dispatchEvent(new Event("change", { bubbles: !0 })));
            }
            break;
        }
    }, document.addEventListener("keydown", this._onKeydown), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : L(i, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      t.tbody.rows.length > 0 && (t._emptyTbodyObserver.disconnect(), t._emptyTbodyObserver = null, t._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(e) {
      e.preventDefault();
      const n = e.detail.direction === "none" ? null : e.detail.direction;
      t._sortCol = n === null ? -1 : e.detail.column, t._sortDir = n, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), L(i, "ln-table:sorted", {
        column: e.detail.column,
        direction: e.detail.direction,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, i.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(e) {
      if (e.preventDefault(), !e.detail) return;
      const n = e.detail.key, f = e.detail.values || [];
      if (n) {
        if (f.length === 0)
          delete t._columnFilters[n];
        else {
          const v = [];
          for (let E = 0; E < f.length; E++)
            v.push(f[E].toLowerCase());
          t._columnFilters[n] = v;
        }
        t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter(), L(i, "ln-table:filter", {
          term: t._searchTerm,
          matched: t._filteredData.length,
          total: t._data.length
        });
      }
    }, i.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  g.prototype._parseRows = function() {
    const i = this.tbody.rows, r = this.ths;
    this._data = [], i.length > 0 && (this._rowHeight = i[0].offsetHeight || 40), this._lockColumnWidths();
    for (let t = 0; t < i.length; t++) {
      const e = i[t], n = [], f = [], v = [];
      for (let w = 0; w < e.cells.length; w++) {
        const A = e.cells[w], S = A.textContent.trim();
        n[w] = Ct(A), f[w] = S.toLowerCase(), A.querySelector("[data-ln-table-row-action]") || v.push(S.toLowerCase());
      }
      let E = null;
      if (this.isDataDriven) {
        E = {};
        const w = e.getAttribute("data-ln-table-row-id");
        w != null && (E.id = w);
        for (let A = 0; A < r.length; A++) {
          const S = r[A].getAttribute("data-ln-table-col");
          if (S) {
            const q = A;
            if (q < e.cells.length) {
              const x = e.cells[q];
              E[S] = Ct(x);
            }
          }
        }
      }
      this._data.push({
        values: n,
        rawTexts: f,
        html: e.outerHTML,
        searchText: v.join(" "),
        id: this.isDataDriven && E ? E.id : void 0,
        ...E
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, g.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const i = (this.currentSearch || "").trim().toLowerCase(), r = i ? i.split(/\s+/).filter(Boolean) : [], t = this.currentFilters || {}, e = Object.keys(t).length > 0;
      if (this._filteredData = this._data.filter(function(A) {
        if (r.length > 0 && !r.every(function(q) {
          for (const x in A)
            if (A.hasOwnProperty(x) && typeof A[x] == "string" && x !== "html" && x !== "searchText" && A[x].toLowerCase().indexOf(q) !== -1)
              return !0;
          return !1;
        }))
          return !1;
        if (e)
          for (const S in t) {
            const q = t[S];
            if (q && q.length > 0) {
              const x = A[S], D = x != null ? String(x) : "";
              if (q.indexOf(D) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const n = this.currentSort.field, v = this.currentSort.direction === "desc" ? -1 : 1, E = this._filteredData.map(function(A) {
        return A[n];
      }), w = xt(E);
      this._filteredData.sort(function(A, S) {
        return kt(A[n], S[n], w, h) * v;
      });
    } else {
      const i = this._searchTerm, r = i ? i.split(/\s+/).filter(Boolean) : [], t = this._columnFilters, e = Object.keys(t).length > 0, n = this.ths, f = {};
      if (e)
        for (let S = 0; S < n.length; S++) {
          const q = n[S].getAttribute("data-ln-table-filter-col");
          q && (f[q] = S);
        }
      if (r.length === 0 && !e ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(S) {
        if (r.length > 0 && !r.every(function(x) {
          return S.searchText.indexOf(x) !== -1;
        }))
          return !1;
        if (e)
          for (const q in t) {
            const x = f[q];
            if (x !== void 0 && t[q].indexOf(S.rawTexts[x]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const v = this._sortCol, E = this._sortDir === "desc" ? -1 : 1, w = this._filteredData.map(function(S) {
        return S.values[v];
      }), A = xt(w);
      this._filteredData.sort(function(S, q) {
        return kt(S.values[v], q.values[v], A, h) * E;
      });
    }
  }, g.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const i = document.createElement("colgroup");
    this.ths.forEach(function(r) {
      const t = document.createElement("col");
      t.style.width = r.offsetWidth + "px", i.appendChild(t);
    }), this.table.insertBefore(i, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = i;
  }, g.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const i = this._lastTotal, r = this.visibleCount;
        if (i === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || r === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const i = this._filteredData.length;
        i === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : i > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, g.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const i = this._filteredData, r = document.createDocumentFragment();
      for (let e = 0; e < i.length; e++) {
        const n = this._buildRow(i[e]);
        if (!n) break;
        r.appendChild(n);
      }
      const t = u(this);
      this.tbody.textContent = "", this.tbody.appendChild(r), c(t), this._selectable && this._updateSelectAll();
    } else {
      const i = [], r = this._filteredData;
      for (let e = 0; e < r.length; e++) i.push(r[e].html);
      const t = u(this);
      this.tbody.innerHTML = i.join(""), c(t), this._selectable && this._restoreSelection();
    }
  }, g.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const i = this;
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
    this.isDataDriven ? this._scrollContainer = d(this.dom) : this._scrollContainer = null;
    const r = this._scrollContainer || window;
    this._scrollHandler = function() {
      i._rafId || (i._rafId = requestAnimationFrame(function() {
        i._rafId = null, i._windowed ? i._renderWindowed() : i._renderVirtual();
      }));
    }, r.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, g.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, g.prototype._renderVirtual = function() {
    const i = this._filteredData, r = i.length, t = this._rowHeight;
    if (!t || !r) return;
    const e = this.thead ? this.thead.offsetHeight : 0, n = this._scrollContainer;
    let f, v;
    if (n) {
      const x = this.table.getBoundingClientRect(), D = n.getBoundingClientRect(), k = x.top - D.top + n.scrollTop + e;
      f = n.scrollTop - k, v = n.clientHeight;
    } else {
      const k = this.table.getBoundingClientRect().top + window.scrollY + e;
      f = window.scrollY - k, v = window.innerHeight;
    }
    let E = Math.max(0, Math.floor(f / t) - 15);
    E = Math.min(E, r);
    const w = Math.min(E + Math.ceil(v / t) + 30, r);
    if (E === this._vStart && w === this._vEnd) return;
    this._vStart = E, this._vEnd = w;
    const A = this.ths.length || 1, S = E * t, q = (r - w) * t;
    if (this.isDataDriven) {
      const x = document.createDocumentFragment();
      if (S > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const R = document.createElement("td");
        R.setAttribute("colspan", A), R.style.height = S + "px", k.appendChild(R), x.appendChild(k);
      }
      for (let k = E; k < w; k++) {
        const R = this._buildRow(i[k]);
        R && x.appendChild(R);
      }
      if (q > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const R = document.createElement("td");
        R.setAttribute("colspan", A), R.style.height = q + "px", k.appendChild(R), x.appendChild(k);
      }
      const D = u(this);
      this.tbody.textContent = "", this.tbody.appendChild(x), c(D), this._selectable && this._updateSelectAll();
    } else {
      let x = "";
      S > 0 && (x += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + A + '" style="height:' + S + 'px;padding:0;border:none"></td></tr>');
      for (let k = E; k < w; k++) x += i[k].html;
      q > 0 && (x += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + A + '" style="height:' + q + 'px;padding:0;border:none"></td></tr>');
      const D = u(this);
      this.tbody.innerHTML = x, c(D), this._selectable && this._restoreSelection();
    }
  }, g.prototype._buildPlaceholderRow = function() {
    const i = document.createElement("tr");
    i.className = "ln-table__placeholder", i.setAttribute("aria-hidden", "true");
    const r = document.createElement("td");
    return r.setAttribute("colspan", this.ths.length || 1), r.style.height = this._rowHeight + "px", i.appendChild(r), i;
  }, g.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const i = this._rowHeight;
    if (!i) return;
    const r = this._cache.logicalTotal, t = this.thead ? this.thead.offsetHeight : 0, e = this._scrollContainer;
    let n, f;
    if (e) {
      const D = this.table.getBoundingClientRect(), k = e.getBoundingClientRect(), R = D.top - k.top + e.scrollTop + t;
      n = e.scrollTop - R, f = e.clientHeight;
    } else {
      const R = this.table.getBoundingClientRect().top + window.scrollY + t;
      n = window.scrollY - R, f = window.innerHeight;
    }
    let v = Math.max(0, Math.floor(n / i) - 15);
    v = Math.min(v, r);
    const E = Math.min(v + Math.ceil(f / i) + 30, r), w = this.ths.length || 1, A = v * i, S = (r - E) * i, q = document.createDocumentFragment();
    if (A > 0) {
      const D = document.createElement("tr");
      D.className = "ln-table__spacer", D.setAttribute("aria-hidden", "true");
      const k = document.createElement("td");
      k.setAttribute("colspan", w), k.style.height = A + "px", D.appendChild(k), q.appendChild(D);
    }
    for (let D = v; D < E; D++)
      if (this._cache.has(D)) {
        const k = this._buildRow(this._cache.get(D));
        k && q.appendChild(k);
      } else
        q.appendChild(this._buildPlaceholderRow());
    if (S > 0) {
      const D = document.createElement("tr");
      D.className = "ln-table__spacer", D.setAttribute("aria-hidden", "true");
      const k = document.createElement("td");
      k.setAttribute("colspan", w), k.style.height = S + "px", D.appendChild(k), q.appendChild(D);
    }
    const x = u(this);
    this.tbody.textContent = "", this.tbody.appendChild(q), c(x), this._vStart = v, this._vEnd = E, this._cache.ensure(v, E);
  }, g.prototype._showEmptyState = function() {
    const i = this.ths.length || 1;
    this.tbody.textContent = "";
    let r = null;
    if (this.isDataDriven) {
      const t = this._lastTotal != null ? this._lastTotal : this._data.length, n = this.visibleCount === 0 && t > 0, f = n ? this.name + "-empty-filtered" : this.name + "-empty";
      if (r = _t(this.dom, f, "ln-table"), !r) {
        const v = this.dom.querySelector("template[data-ln-table-empty]");
        if (v) {
          const E = n ? "search" : "initial", w = v.content.querySelector('[data-ln-table-empty-when="' + E + '"]') || v.content.firstElementChild;
          w && (r = document.importNode(w, !0));
        }
      }
      if (r)
        if (r.tagName === "TR")
          this.tbody.appendChild(r);
        else {
          const v = document.createElement("td");
          v.setAttribute("colspan", String(i)), v.appendChild(r);
          const E = document.createElement("tr");
          E.className = "ln-table__empty", E.appendChild(v), this.tbody.appendChild(E);
        }
    } else {
      const t = this.dom.querySelector("template[" + b + "]"), e = document.createElement("td");
      e.setAttribute("colspan", String(i)), t && e.appendChild(document.importNode(t.content, !0));
      const n = document.createElement("tr");
      n.className = "ln-table__empty", n.appendChild(e), this.tbody.appendChild(n);
    }
    L(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, g.prototype._fillRow = function(i, r) {
    Rt(i, r);
    const t = i.querySelectorAll("[data-ln-table-cell-attr]");
    for (let e = 0; e < t.length; e++) {
      const n = t[e], f = n.getAttribute("data-ln-table-cell-attr").split(",");
      for (let v = 0; v < f.length; v++) {
        const E = f[v].trim().split(":");
        if (E.length !== 2) continue;
        const w = E[0].trim(), A = E[1].trim();
        r[w] != null && n.setAttribute(A, r[w]);
      }
    }
  }, g.prototype._buildRow = function(i) {
    const r = _t(this.dom, this.name + "-row", "ln-table");
    if (!r) return null;
    const t = r.querySelector("[data-ln-table-row]") || r.firstElementChild;
    if (!t) return null;
    if (this._fillRow(t, i), t._lnRecord = i, i.id != null && t.setAttribute("data-ln-table-row-id", i.id), this._selectable && i.id != null && this.selectedIds.has(String(i.id))) {
      t.classList.add("ln-row-selected");
      const e = t.querySelector("[data-ln-table-row-select]");
      e && (e.checked = !0);
    }
    return t;
  }, g.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    pe(this, "ln-table:request-data", "table");
  }, g.prototype._enterWindowedMode = function() {
    const i = this, r = this.dom, t = parseInt(r.getAttribute("data-ln-table-window"), 10), e = parseInt(r.getAttribute("data-ln-table-window-page"), 10), n = parseInt(r.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !i._windowed || !i._cache || (i.totalCount = i._cache.grandTotal, i.visibleCount = i._cache.logicalTotal, i._lastTotal = i._cache.grandTotal, i.isLoaded = !0, i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), L(r, "ln-table:rendered", {
        table: i.name,
        total: i.totalCount,
        visible: i.visibleCount
      }));
    }, this._renderBatch = ne(this._onCacheChange), this._cache = Ee({
      windowSize: t > 0 ? t : 1e3,
      pageSize: e > 0 ? e : 200,
      threshold: n >= 0 ? n : 25,
      fetchDebounce: 120,
      requestPage: function(f, v, E) {
        L(r, "ln-table:request-data", {
          table: i.name,
          sort: f.sort,
          filters: f.filters,
          search: f.search,
          offset: v,
          limit: E,
          queryGen: i._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, g.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let i = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(i) && this._totalSpan) {
        const t = this._totalSpan.textContent.replace(/[^\d]/g, "");
        t && (i = parseInt(t, 10));
      }
      const r = i > 0 ? i : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: r,
        filtered: r
      });
    } else
      this.dom.classList.add("ln-table--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, g.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, g.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const i = this.tbody.querySelectorAll("[data-ln-table-row]");
    let r = i.length > 0;
    for (let t = 0; t < i.length; t++) {
      const e = i[t].getAttribute("data-ln-table-row-id");
      if (e != null && !this.selectedIds.has(e)) {
        r = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = r;
  }, g.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const i = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let r = 0; r < i.length; r++) {
      const t = i[r].getAttribute("data-ln-table-row-id"), e = t != null && this.selectedIds.has(t);
      i[r].classList.toggle("ln-row-selected", e);
      const n = i[r].querySelector("[data-ln-table-row-select]");
      n && (n.checked = e);
    }
    this._updateSelectAll();
  }, Object.defineProperty(g.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), g.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const i = this;
    if (this._onSelectionChange = function(r) {
      const t = r.target.closest("[data-ln-table-row-select]");
      if (!t) return;
      const e = t.closest("[data-ln-table-row]");
      if (!e) return;
      const n = e.getAttribute("data-ln-table-row-id");
      n != null && (t.checked ? (i.selectedIds.add(n), e.classList.add("ln-row-selected")) : (i.selectedIds.delete(n), e.classList.remove("ln-row-selected")), i.selectedCount = i.selectedIds.size, i._updateSelectAll(), i._updateFooter(), L(i.dom, "ln-table:select", {
        table: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const r = document.createElement("input");
      r.type = "checkbox";
      const t = i.dom.querySelector('[data-ln-table-dict="select-all"]'), e = i.dom.getAttribute("data-ln-table-select-all-label") || (t ? t.textContent.trim() : null) || "Select all";
      r.setAttribute("aria-label", e), this._selectAllCheckbox.appendChild(r), this._selectAllCheckbox = r;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const r = i._selectAllCheckbox.checked, t = i.tbody ? i.tbody.querySelectorAll("[data-ln-table-row]") : [];
      for (let e = 0; e < t.length; e++) {
        const n = t[e].getAttribute("data-ln-table-row-id"), f = t[e].querySelector("[data-ln-table-row-select]");
        n != null && (r ? (i.selectedIds.add(n), t[e].classList.add("ln-row-selected")) : (i.selectedIds.delete(n), t[e].classList.remove("ln-row-selected")), f && (f.checked = r));
      }
      i.selectedCount = i.selectedIds.size, L(i.dom, "ln-table:select-all", {
        table: i.name,
        selected: r
      }), L(i.dom, "ln-table:select", {
        table: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedCount
      }), i._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const r = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let t = 0; t < r.length; t++) {
        const e = r[t].querySelector("[data-ln-table-row-select]"), n = r[t].getAttribute("data-ln-table-row-id");
        e && e.checked && n != null && (this.selectedIds.add(n), r[t].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, g.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const i = this.dom.querySelector("[data-ln-table-col-select]");
    if (i) {
      const r = i.querySelector('input[type="checkbox"]');
      r && r.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const r = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let t = 0; t < r.length; t++) {
        r[t].classList.remove("ln-row-selected");
        const e = r[t].querySelector("[data-ln-table-row-select]");
        e && (e.checked = !1);
      }
    }
    this._updateFooter();
  }, g.prototype._updateFooter = function() {
    let i = 0, r = 0;
    this.isDataDriven ? (i = this._lastTotal != null ? this._lastTotal : this._data.length, r = this.visibleCount) : (i = this._data.length, r = this._filteredData.length);
    const t = r < i;
    if (this._totalSpan && (this._totalSpan.textContent = o(i, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = t ? o(r, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !t), this._selectedSpan) {
      const e = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = e > 0 ? o(e, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", e === 0);
    }
  }, g.prototype._focusRow = function(i) {
    for (let r = 0; r < i.length; r++)
      i[r].classList.remove("ln-row-focused"), i[r].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < i.length) {
      const r = i[this._focusedRowIndex];
      r.classList.add("ln-row-focused"), r.setAttribute("tabindex", "0"), r.focus(), r.scrollIntoView({ block: "nearest" });
    }
  }, g.prototype.destroy = function() {
    this.dom[s] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), document.removeEventListener("keydown", this._onKeydown), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[s]);
  }, U(l, s, g, "ln-table", {
    extraAttributes: [
      "data-ln-table-window",
      "data-ln-table-window-page",
      "data-ln-table-window-threshold",
      "data-ln-table-count"
    ],
    onAttributeChange: function(i, r) {
      const t = i[s];
      if (!(!t || !t.isDataDriven)) {
        if (r === "data-ln-table-window") {
          const e = i.hasAttribute("data-ln-table-window");
          if (e && !t._windowed)
            t._enterWindowedMode(), t._kickWindowInitial();
          else if (!e && t._windowed)
            t._exitWindowedMode();
          else if (e && t._windowed) {
            const n = parseInt(i.getAttribute("data-ln-table-window"), 10);
            n > 0 && t._cache.configure({ windowSize: n });
          }
          return;
        }
        if (!(!t._windowed || !t._cache)) {
          if (r === "data-ln-table-window-page") {
            const e = parseInt(i.getAttribute("data-ln-table-window-page"), 10);
            e > 0 && t._cache.configure({ pageSize: e });
          } else if (r === "data-ln-table-window-threshold") {
            const e = parseInt(i.getAttribute("data-ln-table-window-threshold"), 10);
            e >= 0 && t._cache.configure({ threshold: e });
          } else if (r === "data-ln-table-count") {
            const e = parseInt(i.getAttribute("data-ln-table-count"), 10);
            e >= 0 && t._cache.setGrandTotal(e);
          }
        }
      }
    }
  });
})();
(function() {
  const l = "data-ln-table-coordinator", s = "lnTableCoordinator";
  if (window[s] !== void 0) return;
  document.addEventListener("keydown", function(_) {
    if (_.key !== "/" || _.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const p = document.querySelector("[" + l + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!p) return;
    const m = p.tagName === "INPUT" || p.tagName === "TEXTAREA" ? p : p.querySelector('input[type="search"], input[type="text"], input');
    m && (_.preventDefault(), m.focus());
  });
  function b(_) {
    return this.dom = _, y(this), this;
  }
  function y(_) {
    const p = _.dom;
    function m(a) {
      const h = a.target;
      if (h && h.hasAttribute && h.hasAttribute("data-ln-table")) return h;
      const o = a.detail && a.detail.targetId || h && h.id;
      return o ? p.querySelector('[data-ln-table-source="' + o + '"]') || p.querySelector('[data-ln-table="' + o + '"]') : null;
    }
    _._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(a) {
        if (!a.detail) return;
        const h = m(a);
        if (!h || !h.hasAttribute || !h.hasAttribute("data-ln-table")) return;
        const o = a.detail.key, d = a.detail.values || [], u = h.querySelectorAll("th");
        for (let c = 0; c < u.length; c++)
          if (u[c].getAttribute("data-ln-table-filter-col") === o) {
            const g = u[c].querySelector("[data-ln-table-col-filter]");
            g && g.classList.toggle("ln-filter-active", d.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(a) {
        const h = a.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!h) return;
        const o = h.closest("[data-ln-table]") || p.querySelector("[data-ln-table]");
        if (!o || !o.lnTable) return;
        const d = o.lnTable.name || o.id, u = o.querySelectorAll("th");
        for (let t = 0; t < u.length; t++) {
          const e = u[t].querySelector("[data-ln-table-col-filter]");
          e && e.classList.remove("ln-filter-active");
        }
        const c = o.getAttribute("data-ln-table-source") || o.id, g = c ? document.getElementById(c) : null;
        g && g.hasAttribute("data-ln-search") && g.setAttribute("data-ln-search", "");
        const i = c && p.querySelector('[data-ln-search-for="' + c + '"]') || p.querySelector("[data-ln-search-for]");
        if (i) {
          const t = i.tagName === "INPUT" || i.tagName === "TEXTAREA" ? i : i.querySelector("input");
          t && t.value !== "" && (t.value = "", t.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const r = c && p.querySelectorAll('[data-ln-filter="' + c + '"]') || p.querySelectorAll("[data-ln-filter]");
        for (let t = 0; t < r.length; t++) {
          const e = r[t].querySelector("[data-ln-filter-reset]");
          e && (e.checked = !0, e.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        o.hasAttribute("data-ln-table-source") || L(o, "ln-table:request-clear-filters", { table: d });
      }
    }, p.addEventListener("ln-filter:change", _._handlers.filter), p.addEventListener("click", _._handlers.clear);
  }
  b.prototype.destroy = function() {
    this.dom[s] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[s]);
  }, U(l, s, b, "ln-table-coordinator");
})();
(function() {
  const l = "data-ln-list", s = "lnList", b = "data-ln-list-empty";
  if (window[s] !== void 0) return;
  function h(i, r) {
    if (i == null || isNaN(i)) return "";
    try {
      return new Intl.NumberFormat($(r)).format(i);
    } catch {
      return String(i);
    }
  }
  function o(i) {
    let r = i;
    for (; r && r !== document.body && r !== document.documentElement; ) {
      const e = getComputedStyle(r).overflowY;
      if (e === "auto" || e === "scroll") return r;
      r = r.parentElement;
    }
    return null;
  }
  function d(i) {
    const r = i._scrollContainer || o(i.dom);
    return {
      container: r,
      top: r ? r.scrollTop : window.scrollY
    };
  }
  function u(i) {
    i.container ? i.container.scrollTop = i.top : window.scrollTo(window.scrollX, i.top);
  }
  function c(i) {
    if (!i) return 0;
    const r = getComputedStyle(i), t = parseFloat(r.marginTop) || 0, e = parseFloat(r.marginBottom) || 0;
    return i.offsetHeight + t + e;
  }
  function g(i) {
    this.dom = i, this.tbody = i.querySelector("[data-ln-list-body]") || i, this.isDataDriven = i.hasAttribute("data-ln-list-source"), this.name = i.getAttribute(l) || "", this.source = i.getAttribute("data-ln-list-source") || "", this._totalSpan = i.querySelector("[data-ln-list-total]"), this._filteredSpan = i.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== i ? this._filteredSpan.parentElement : null), this._selectedSpan = i.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== i ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const r = this;
    return this._onRequestClearFilters = function() {
      r.isDataDriven ? (r.currentFilters = {}, r.currentSearch = "", L(i, "ln-list:clear-filters", { list: r.name }), r._requestData()) : (r._searchTerm = "", r._filters = {}, r._sortField = null, r._sortDir = null, r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), L(i, "ln-list:filter", {
        term: "",
        matched: r._filteredData.length,
        total: r._data.length
      }));
    }, i.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectable = i.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._windowed = !1, this._cache = null, i.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._lastTotal = 0, this._lastFiltered = 0, this._onSetData = function(t) {
      const e = t.detail || {};
      if (r._windowed) {
        i.classList.remove("ln-list--loading"), r._cache.ingest(e);
        return;
      }
      r._data = e.data || [], r._lastTotal = e.total != null ? e.total : r._data.length, r._lastFiltered = e.filtered != null ? e.filtered : r._data.length, r.totalCount = r._lastTotal, r.visibleCount = r._lastFiltered, r.isLoaded = !0, i.classList.remove("ln-list--loading"), r._vStart = -1, r._vEnd = -1, r._applyFilterAndSort(), r._render(), r._updateFooter(), L(i, "ln-list:rendered", {
        list: r.name,
        total: r.totalCount,
        visible: r.visibleCount
      });
    }, i.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(t) {
      const e = t.detail && t.detail.loading;
      i.classList.toggle("ln-list--loading", !!e), e && (r.isLoaded = !1);
    }, i.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(t) {
      !r._windowed || !r._cache || r._cache.release(t.detail && t.detail.offset);
    }, i.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !r._windowed || !r._cache || r._cache.revalidate();
    }, i.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !r._windowed || !r._cache || r._requestData();
    }, i.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(t) {
      t.detail.field != null && (t.preventDefault(), r.currentSort = t.detail.direction === "none" ? null : { field: t.detail.field, direction: t.detail.direction }, r._windowed ? r._requestData() : (r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), L(i, "ln-list:sorted", {
        field: r.currentSort ? r.currentSort.field : null,
        direction: t.detail.direction,
        matched: r.visibleCount,
        total: r.totalCount
      })));
    }, i.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(t) {
      if (t.target.closest("[data-ln-item-select]") || t.target.closest("[data-ln-item-action]") || t.target.closest("a") || t.target.closest("button") || t.ctrlKey || t.metaKey || t.button === 1) return;
      const e = t.target.closest("[data-ln-item]");
      if (!e) return;
      const n = e.getAttribute("data-ln-item-id"), f = e._lnRecord || {};
      L(i, "ln-list:item-click", {
        list: r.name,
        id: n,
        record: f
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(t) {
      const e = t.target.closest("[data-ln-item-action]");
      if (!e) return;
      t.stopPropagation();
      const n = e.closest("[data-ln-item]");
      if (!n) return;
      const f = e.getAttribute("data-ln-item-action"), v = n.getAttribute("data-ln-item-id"), E = n._lnRecord || {};
      L(i, "ln-list:item-action", {
        list: r.name,
        id: v,
        action: f,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : L(i, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      r.tbody.children.length > 0 && (r._emptyObserver.disconnect(), r._emptyObserver = null, r._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onSearchChange = function(t) {
      t.preventDefault();
      const e = (t.detail && t.detail.term != null ? t.detail.term : "").trim();
      r._searchTerm = e.toLowerCase(), r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), L(i, "ln-list:filter", {
        term: r._searchTerm,
        matched: r._filteredData.length,
        total: r._data.length
      });
    }, i.addEventListener("ln-search:change", this._onSearchChange), this._onFilterChange = function(t) {
      if (t.preventDefault(), !t.detail) return;
      const e = t.detail.key, n = t.detail.values || [];
      if (e) {
        if (n.length === 0)
          delete r._filters[e];
        else {
          const f = [];
          for (let v = 0; v < n.length; v++)
            f.push(n[v].toLowerCase());
          r._filters[e] = f;
        }
        r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), L(i, "ln-list:filter", {
          term: r._searchTerm,
          matched: r._filteredData.length,
          total: r._data.length
        });
      }
    }, i.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(t) {
      if (t.detail && t.detail.field == null) return;
      t.preventDefault();
      const e = t.detail && t.detail.direction === "none" ? null : t.detail && t.detail.direction;
      r._sortField = e === null ? null : t.detail && t.detail.field, r._sortDir = e, r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), L(i, "ln-list:sorted", {
        field: r._sortField,
        direction: t.detail && t.detail.direction,
        matched: r._filteredData.length,
        total: r._data.length
      });
    }, i.addEventListener("ln-sort:change", this._onSort)), this;
  }
  g.prototype._parseChildren = function() {
    const i = Array.from(this.tbody.children).filter((r) => !r.classList.contains("ln-list__spacer"));
    this._data = [], i.length > 0 && (this._itemHeight = c(i[0]) || 50);
    for (let r = 0; r < i.length; r++) {
      const t = i[r], e = t.getAttribute("data-ln-item-id") || t.getAttribute("id"), n = t.textContent.trim().toLowerCase();
      let f = null;
      if (this.isDataDriven) {
        f = {}, e != null && (f.id = e);
        const w = t.querySelectorAll("[data-ln-list-field]");
        for (let A = 0; A < w.length; A++) {
          const S = w[A], q = S.getAttribute("data-ln-list-field");
          q && (f[q] = Ct(S));
        }
      }
      const v = {}, E = t.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let w = 0; w < E.length; w++) {
        const A = E[w], S = A.getAttribute("data-ln-list-field") || A.getAttribute("data-ln-field");
        S && (v[S] = Ct(A));
      }
      for (let w = 0; w < t.attributes.length; w++) {
        const A = t.attributes[w];
        if (A.name.startsWith("data-") && !A.name.startsWith("data-ln-")) {
          const S = A.name.slice(5);
          S && (v[S] = A.value);
        }
      }
      this._data.push({
        html: t.outerHTML,
        id: e,
        searchText: n,
        fields: v,
        ...f || {}
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, g.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      if (this._filteredData = this._data.slice(), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const i = this.currentSort.field, r = this.currentSort.direction === "desc" ? -1 : 1, t = this._filteredData.map(function(f) {
        return f[i];
      }), e = xt(t), n = typeof Intl < "u" ? new Intl.Collator($(this.dom), { sensitivity: "base" }) : null;
      this._filteredData.sort(function(f, v) {
        return kt(f[i], v[i], e, n) * r;
      });
    } else {
      const i = this._searchTerm, r = i ? i.split(/\s+/).filter(Boolean) : [], t = this._filters || {}, e = Object.keys(t).length > 0;
      if (r.length === 0 && !e ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(n) {
        if (r.length > 0 && !r.every(function(v) {
          return n.searchText && n.searchText.indexOf(v) !== -1;
        }))
          return !1;
        if (e)
          for (const f in t) {
            const v = t[f];
            if (v && v.length > 0) {
              const E = n.fields && n.fields[f] !== void 0 ? n.fields[f] : n[f] !== void 0 ? n[f] : null, w = E != null ? String(E).toLowerCase() : "";
              if (v.indexOf(w) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const n = this._sortField, f = this._sortDir === "desc" ? -1 : 1, v = typeof Intl < "u" ? new Intl.Collator($(this.dom), { sensitivity: "base" }) : null, E = this._filteredData.map(function(A) {
          return A.fields && A.fields[n] !== void 0 ? A.fields[n] : A[n];
        }), w = xt(E);
        this._filteredData.sort(function(A, S) {
          const q = A.fields && A.fields[n] !== void 0 ? A.fields[n] : A[n], x = S.fields && S.fields[n] !== void 0 ? S.fields[n] : S[n];
          return kt(q, x, w, v) * f;
        });
      }
    }
  }, g.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const i = this._lastTotal, r = this.visibleCount;
        if (i === 0 || this._filteredData.length === 0 || r === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const i = this._filteredData.length;
        i === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : i > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, g.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const i = this._filteredData, r = document.createDocumentFragment();
      for (let e = 0; e < i.length; e++) {
        const n = this._buildItem(i[e]);
        n && r.appendChild(n);
      }
      const t = d(this);
      this.tbody.textContent = "", this.tbody.appendChild(r), u(t), this._selectable && this._updateSelectAll();
    } else {
      const i = [], r = this._filteredData;
      for (let e = 0; e < r.length; e++) i.push(r[e].html);
      const t = d(this);
      this.tbody.innerHTML = i.join(""), u(t), this._selectable && this._restoreSelection();
    }
  }, g.prototype._readGridLayout = function() {
    const i = getComputedStyle(this.tbody), r = i.gridTemplateColumns;
    let t = 1;
    if (r && r !== "none") {
      const n = r.trim().split(/\s+/).filter(Boolean);
      n.length > 0 && (t = n.length);
    }
    const e = parseFloat(i.rowGap);
    return { columns: t, rowGap: isNaN(e) ? 0 : e };
  }, g.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const i = this._cache.peek(), r = i ? this._buildItem(i) : this._buildPlaceholderItem();
      r && (this.tbody.textContent = "", this.tbody.appendChild(r), this._itemHeight = c(r) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const i = this._buildItem(this._data[0]);
        i && (this.tbody.textContent = "", this.tbody.appendChild(i), this._itemHeight = c(i) || 50, this.tbody.textContent = "");
      }
    } else {
      const i = this.tbody.children;
      i.length > 0 && (this._itemHeight = c(i[0]) || 50);
    }
  }, g.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const i = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = o(this.dom);
    const r = this._scrollContainer || window;
    this._scrollHandler = function() {
      i._rafId || (i._rafId = requestAnimationFrame(function() {
        i._rafId = null, i._windowed ? i._renderWindowed() : i._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      i._itemHeight = 0, i._measureItemHeight(), i._vStart = -1, i._vEnd = -1, i._windowed ? i._renderWindowed() : i._renderVirtual();
    }, r.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, g.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, g.prototype._renderVirtual = function() {
    const i = this._filteredData, r = i.length, t = this._itemHeight;
    if (!t || !r) return;
    const e = this._scrollContainer;
    let n, f;
    if (e) {
      const z = this.tbody.getBoundingClientRect(), j = e.getBoundingClientRect(), K = e === this.tbody ? 0 : z.top - j.top + e.scrollTop;
      n = e.scrollTop - K, f = e.clientHeight;
    } else {
      const j = this.tbody.getBoundingClientRect().top + window.scrollY;
      n = window.scrollY - j, f = window.innerHeight;
    }
    const v = this._readGridLayout(), E = v.columns, w = v.rowGap, A = t + w, S = Math.ceil(r / E);
    let q = Math.max(0, Math.floor(n / A) - 15);
    q = Math.min(q, S);
    const x = Math.ceil(f / A) + 30, D = Math.min(q + x, S), k = Math.min(q * E, r), R = Math.min(D * E, r);
    if (k === this._vStart && R === this._vEnd) return;
    this._vStart = k, this._vEnd = R;
    const F = q * A, B = (S - D) * A;
    if (this.isDataDriven) {
      const z = document.createDocumentFragment();
      if (F > 0) {
        const K = document.createElement(this.isUl ? "li" : "div");
        K.className = "ln-list__spacer", K.setAttribute("aria-hidden", "true"), K.style.height = F + "px", z.appendChild(K);
      }
      for (let K = k; K < R; K++) {
        const et = this._buildItem(i[K]);
        et && z.appendChild(et);
      }
      if (B > 0) {
        const K = document.createElement(this.isUl ? "li" : "div");
        K.className = "ln-list__spacer", K.setAttribute("aria-hidden", "true"), K.style.height = B + "px", z.appendChild(K);
      }
      const j = d(this);
      this.tbody.textContent = "", this.tbody.appendChild(z), u(j), this._selectable && this._updateSelectAll();
    } else {
      let z = "";
      F > 0 && (z += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${F}px"></${this.isUl ? "li" : "div"}>`);
      for (let K = k; K < R; K++)
        z += i[K].html;
      B > 0 && (z += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${B}px"></${this.isUl ? "li" : "div"}>`);
      const j = d(this);
      this.tbody.innerHTML = z, u(j), this._selectable && this._restoreSelection();
    }
  }, g.prototype._buildPlaceholderItem = function() {
    const i = document.createElement(this.isUl ? "li" : "div");
    return i.className = "ln-list__placeholder", i.setAttribute("aria-hidden", "true"), i.style.height = this._itemHeight + "px", i;
  }, g.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const i = this._itemHeight;
    if (!i) return;
    const r = this._scrollContainer;
    let t, e;
    if (r) {
      const j = this.tbody.getBoundingClientRect(), K = r.getBoundingClientRect(), et = r === this.tbody ? 0 : j.top - K.top + r.scrollTop;
      t = r.scrollTop - et, e = r.clientHeight;
    } else {
      const K = this.tbody.getBoundingClientRect().top + window.scrollY;
      t = window.scrollY - K, e = window.innerHeight;
    }
    const n = this._readGridLayout(), f = n.columns, v = n.rowGap, E = i + v, w = this._cache.logicalTotal, A = Math.ceil(w / f);
    let S = Math.max(0, Math.floor(t / E) - 15);
    S = Math.min(S, A);
    const q = Math.ceil(e / E) + 30, x = Math.min(S + q, A), D = Math.min(S * f, w), k = Math.min(x * f, w), R = S * E, F = (A - x) * E, B = document.createDocumentFragment();
    if (R > 0) {
      const j = document.createElement(this.isUl ? "li" : "div");
      j.className = "ln-list__spacer", j.setAttribute("aria-hidden", "true"), j.style.height = R + "px", B.appendChild(j);
    }
    for (let j = D; j < k; j++)
      if (this._cache.has(j)) {
        const K = this._buildItem(this._cache.get(j));
        K && B.appendChild(K);
      } else
        B.appendChild(this._buildPlaceholderItem());
    if (F > 0) {
      const j = document.createElement(this.isUl ? "li" : "div");
      j.className = "ln-list__spacer", j.setAttribute("aria-hidden", "true"), j.style.height = F + "px", B.appendChild(j);
    }
    const z = d(this);
    this.tbody.textContent = "", this.tbody.appendChild(B), u(z), this._vStart = D, this._vEnd = k, this._cache.ensure(D, k);
  }, g.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let i = null;
    if (this.isDataDriven) {
      const r = this._lastTotal != null ? this._lastTotal : this._data.length, e = this.visibleCount === 0 && r > 0, n = e ? this.name + "-empty-filtered" : this.name + "-empty";
      if (i = _t(this.dom, n, "ln-list"), !i) {
        const f = this.dom.querySelector("template[data-ln-empty]");
        if (f) {
          const v = e ? "search" : "initial", E = f.content.querySelector(`[data-ln-empty-when="${v}"]`) || f.content.firstElementChild;
          E && (i = document.importNode(E, !0));
        }
      }
    } else {
      const r = this.dom.querySelector(`template[${b}]`);
      if (r) {
        const t = r.content.firstElementChild;
        t && (i = document.importNode(t, !0));
      }
    }
    if (i)
      if (i.tagName === "LI" || i.tagName === "TR")
        this.tbody.appendChild(i);
      else {
        const r = document.createElement(this.isUl ? "li" : "div");
        r.appendChild(i), this.tbody.appendChild(r);
      }
    L(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, g.prototype._buildItem = function(i) {
    const r = _t(this.dom, this.name + "-row", "ln-list");
    if (!r) return null;
    const t = r.querySelector("[data-ln-item]") || r.firstElementChild;
    if (!t) return null;
    if (Rt(t, i), lt(t, i), t._lnRecord = i, i.id != null && (t.setAttribute("data-ln-item-id", i.id), this._selectable && this.selectedIds.has(String(i.id)))) {
      t.classList.add("ln-item-selected");
      const e = t.querySelector("[data-ln-item-select]");
      e && (e.checked = !0);
    }
    return t;
  }, g.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const i = this.tbody.querySelectorAll("[data-ln-item]");
    for (let r = 0; r < i.length; r++) {
      const t = i[r].getAttribute("data-ln-item-id"), e = t != null && this.selectedIds.has(String(t));
      i[r].classList.toggle("ln-item-selected", e);
      const n = i[r].querySelector("[data-ln-item-select]");
      n && (n.checked = e);
    }
    this._updateSelectAll();
  }, g.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const i = this;
    this._onSelectionChange = function(r) {
      const t = r.target.closest("[data-ln-item-select]");
      if (!t) return;
      const e = t.closest("[data-ln-item]");
      if (!e) return;
      const n = e.getAttribute("data-ln-item-id");
      n != null && (t.checked ? (i.selectedIds.add(String(n)), e.classList.add("ln-item-selected")) : (i.selectedIds.delete(String(n)), e.classList.remove("ln-item-selected")), i._updateSelectAll(), i._updateFooter(), L(i.dom, "ln-list:select", {
        list: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const r = i._selectAllCheckbox.checked, t = i.tbody.querySelectorAll("[data-ln-item]");
      for (let e = 0; e < t.length; e++) {
        const n = t[e], f = n.getAttribute("data-ln-item-id"), v = n.querySelector("[data-ln-item-select]");
        f != null && (r ? (i.selectedIds.add(String(f)), n.classList.add("ln-item-selected")) : (i.selectedIds.delete(String(f)), n.classList.remove("ln-item-selected")), v && (v.checked = r));
      }
      L(i.dom, "ln-list:select-all", { list: i.name, selected: r }), L(i.dom, "ln-list:select", {
        list: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedIds.size
      }), i._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, g.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const i = this.tbody.querySelectorAll("[data-ln-item]");
    let r = i.length > 0;
    for (let t = 0; t < i.length; t++) {
      const e = i[t].getAttribute("data-ln-item-id");
      if (e != null && !this.selectedIds.has(String(e))) {
        r = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = r;
  }, g.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    pe(this, "ln-list:request-data", "list");
  }, g.prototype._enterWindowedMode = function() {
    const i = this, r = this.dom, t = parseInt(r.getAttribute("data-ln-list-window"), 10), e = parseInt(r.getAttribute("data-ln-list-window-page"), 10), n = parseInt(r.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !i._windowed || !i._cache || (i.totalCount = i._cache.grandTotal, i.visibleCount = i._cache.logicalTotal, i._lastTotal = i._cache.grandTotal, i.isLoaded = !0, i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), L(r, "ln-list:rendered", {
        list: i.name,
        total: i.totalCount,
        visible: i.visibleCount
      }));
    }, this._renderBatch = ne(this._onCacheChange), this._cache = Ee({
      windowSize: t > 0 ? t : 1e3,
      pageSize: e > 0 ? e : 200,
      threshold: n >= 0 ? n : 25,
      fetchDebounce: 120,
      requestPage: function(f, v, E) {
        L(r, "ln-list:request-data", {
          list: i.name,
          sort: f.sort,
          filters: f.filters,
          search: f.search,
          offset: v,
          limit: E,
          queryGen: i._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, g.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const i = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), r = i > 0 ? i : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: r,
        filtered: r
      });
    } else
      this.dom.classList.add("ln-list--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, g.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, g.prototype._updateFooter = function() {
    let i = 0, r = 0;
    this.isDataDriven ? (i = this._lastTotal != null ? this._lastTotal : this._data.length, r = this.visibleCount) : (i = this._data.length, r = this._filteredData.length);
    const t = r < i;
    if (this._totalSpan && (this._totalSpan.textContent = h(i, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = t ? h(r, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !t), this._selectedSpan) {
      const e = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = e > 0 ? h(e, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", e === 0);
    }
  }, g.prototype.destroy = function() {
    this.dom[s] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onSearchChange && this.dom.removeEventListener("ln-search:change", this._onSearchChange), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[s]);
  }, U(l, s, g, "ln-list", {
    extraAttributes: [
      "data-ln-list-window",
      "data-ln-list-window-page",
      "data-ln-list-window-threshold",
      "data-ln-list-count"
    ],
    onAttributeChange: function(i, r) {
      const t = i[s];
      if (!(!t || !t.isDataDriven)) {
        if (r === "data-ln-list-window") {
          const e = i.hasAttribute("data-ln-list-window");
          if (e && !t._windowed)
            t._enterWindowedMode(), t._kickWindowInitial();
          else if (!e && t._windowed)
            t._exitWindowedMode();
          else if (e && t._windowed) {
            const n = parseInt(i.getAttribute("data-ln-list-window"), 10);
            n > 0 && t._cache.configure({ windowSize: n });
          }
          return;
        }
        if (!(!t._windowed || !t._cache)) {
          if (r === "data-ln-list-window-page") {
            const e = parseInt(i.getAttribute("data-ln-list-window-page"), 10);
            e > 0 && t._cache.configure({ pageSize: e });
          } else if (r === "data-ln-list-window-threshold") {
            const e = parseInt(i.getAttribute("data-ln-list-window-threshold"), 10);
            e >= 0 && t._cache.configure({ threshold: e });
          } else if (r === "data-ln-list-count") {
            const e = parseInt(i.getAttribute("data-ln-list-count"), 10);
            e >= 0 && t._cache.setGrandTotal(e);
          }
        }
      }
    }
  });
})();
(function() {
  const l = "data-ln-circular-progress", s = "lnCircularProgress";
  if (window[s] !== void 0) return;
  const b = "http://www.w3.org/2000/svg", y = 36, _ = 16, p = 2 * Math.PI * _;
  function m(u) {
    return this.dom = u, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, h.call(this), d.call(this), o.call(this), this;
  }
  m.prototype.destroy = function() {
    this.dom[s] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("role"), this.dom.removeAttribute("aria-valuemin"), this.dom.removeAttribute("aria-valuemax"), this.dom.removeAttribute("aria-valuenow"), this.dom.removeAttribute("aria-valuetext"), delete this.dom[s]);
  };
  function a(u, c) {
    const g = document.createElementNS(b, u);
    for (const i in c)
      g.setAttribute(i, c[i]);
    return g;
  }
  function h() {
    this.svg = a("svg", {
      viewBox: "0 0 " + y + " " + y,
      "aria-hidden": "true"
    }), this.trackCircle = a("circle", {
      cx: y / 2,
      cy: y / 2,
      r: _,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = a("circle", {
      cx: y / 2,
      cy: y / 2,
      r: _,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": p,
      "stroke-dashoffset": p,
      transform: "rotate(-90 " + y / 2 + " " + y / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function o() {
    const u = this, c = new MutationObserver(function(g) {
      for (const i of g)
        (i.attributeName === "data-ln-circular-progress" || i.attributeName === "data-ln-circular-progress-max" || i.attributeName === "data-ln-circular-progress-label") && d.call(u);
    });
    c.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max", "data-ln-circular-progress-label"]
    }), this._attrObserver = c;
  }
  function d() {
    const u = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, c = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let g = c > 0 ? u / c * 100 : 0;
    g < 0 && (g = 0), g > 100 && (g = 100);
    const i = p - g / 100 * p;
    this.progressCircle.setAttribute("stroke-dashoffset", i);
    const r = this.dom.getAttribute("data-ln-circular-progress-label"), t = r !== null ? r : Math.round(g) + "%";
    this.labelEl.textContent = t, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(c));
    const e = Math.max(0, Math.min(u, c));
    this.dom.setAttribute("aria-valuenow", String(e)), this.dom.setAttribute("aria-valuetext", t), L(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: u,
      max: c,
      percentage: g
    });
  }
  U(l, s, m, "ln-circular-progress");
})();
(function() {
  const l = "data-ln-sortable", s = "lnSortable", b = "data-ln-sortable-handle";
  if (window[s] !== void 0) return;
  function y(p) {
    this.dom = p, this.isEnabled = p.getAttribute(l) !== "disabled", this._dragging = null, p.setAttribute("aria-roledescription", "sortable list");
    const m = this;
    return this._onPointerDown = function(a) {
      m.isEnabled && m._handlePointerDown(a);
    }, p.addEventListener("pointerdown", this._onPointerDown), this;
  }
  y.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(l, "");
  }, y.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(l, "disabled");
  }, y.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), L(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[s]);
  }, y.prototype._handlePointerDown = function(p) {
    let m = p.target.closest("[" + b + "]"), a;
    if (m) {
      for (a = m; a && a.parentElement !== this.dom; )
        a = a.parentElement;
      if (!a || a.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + b + "]")) return;
      for (a = p.target; a && a.parentElement !== this.dom; )
        a = a.parentElement;
      if (!a || a.parentElement !== this.dom) return;
      m = a;
    }
    const o = Array.from(this.dom.children).indexOf(a);
    if (X(this.dom, "ln-sortable:before-drag", {
      item: a,
      index: o
    }).defaultPrevented) return;
    p.preventDefault(), m.setPointerCapture(p.pointerId), this._dragging = a, a.classList.add("ln-sortable--dragging"), a.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), L(this.dom, "ln-sortable:drag-start", {
      item: a,
      index: o
    });
    const u = this, c = function(i) {
      u._handlePointerMove(i);
    }, g = function(i) {
      u._handlePointerEnd(i), m.removeEventListener("pointermove", c), m.removeEventListener("pointerup", g), m.removeEventListener("pointercancel", g);
    };
    m.addEventListener("pointermove", c), m.addEventListener("pointerup", g), m.addEventListener("pointercancel", g);
  }, y.prototype._handlePointerMove = function(p) {
    if (!this._dragging) return;
    const m = Array.from(this.dom.children), a = this._dragging;
    for (const h of m)
      h.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const h of m) {
      if (h === a) continue;
      const o = h.getBoundingClientRect(), d = o.top + o.height / 2;
      if (p.clientY >= o.top && p.clientY < d) {
        h.classList.add("ln-sortable--drop-before");
        break;
      } else if (p.clientY >= d && p.clientY <= o.bottom) {
        h.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, y.prototype._handlePointerEnd = function(p) {
    if (!this._dragging) return;
    const m = this._dragging, a = Array.from(this.dom.children), h = a.indexOf(m);
    let o = null, d = null;
    for (const u of a) {
      if (u.classList.contains("ln-sortable--drop-before")) {
        o = u, d = "before";
        break;
      }
      if (u.classList.contains("ln-sortable--drop-after")) {
        o = u, d = "after";
        break;
      }
    }
    for (const u of a)
      u.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (m.classList.remove("ln-sortable--dragging"), m.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), o && o !== m) {
      d === "before" ? this.dom.insertBefore(m, o) : this.dom.insertBefore(m, o.nextElementSibling);
      const c = Array.from(this.dom.children).indexOf(m);
      L(this.dom, "ln-sortable:reordered", {
        item: m,
        oldIndex: h,
        newIndex: c
      });
    }
    this._dragging = null;
  };
  function _(p) {
    const m = p[s];
    if (!m) return;
    const a = p.getAttribute(l) !== "disabled";
    a !== m.isEnabled && (m.isEnabled = a, L(p, a ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: p }));
  }
  U(l, s, y, "ln-sortable", {
    onAttributeChange: _
  });
})();
(function() {
  const l = "data-ln-confirm", s = "lnConfirm", b = "data-ln-confirm-timeout";
  if (window[s] !== void 0) return;
  function _(...m) {
    (document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) && console.warn("[ln-confirm]", ...m);
  }
  function p(m) {
    _("constructor called on", m), this.dom = m, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = m.querySelector("[data-ln-confirm-idle]"), this.activeEl = m.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = m.textContent.trim(), this.confirmText = m.getAttribute(l) || "Confirm?");
    const a = this;
    return this._onClick = function(h) {
      if (_("click handler, confirming:", a.confirming, "submitted:", a._submitted, "target:", h.target), !a.confirming)
        h.preventDefault(), h.stopImmediatePropagation(), a._enterConfirm();
      else {
        if (a._submitted) return;
        a._submitted = !0, h.stopPropagation(), a._reset();
      }
    }, m.addEventListener("click", this._onClick), this;
  }
  p.prototype._getTimeout = function() {
    const m = parseFloat(this.dom.getAttribute(b));
    return isNaN(m) || m <= 0 ? 3 : m;
  }, p.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const a = this.activeEl ? this.activeEl.textContent.trim() : "";
      a && (this.dom.setAttribute("aria-label", a), this.dom.setAttribute("aria-live", "polite"));
    } else {
      var m = this.dom.querySelector("svg.ln-icon use");
      m && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = m.getAttribute("href"), m.setAttribute("href", "#ln-icon-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.dom.setAttribute("aria-label", this.confirmText), this.dom.setAttribute("aria-live", "polite")) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), L(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, p.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const m = this, a = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      m._reset();
    }, a);
  }, p.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      var m = this.dom.querySelector("svg.ln-icon use");
      m && this.originalIconHref && m.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, p.prototype.destroy = function() {
    _("destroy called on", this.dom), this.dom[s] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[s]);
  }, U(l, s, p, "ln-confirm");
})();
(function() {
  const l = "data-ln-translations", s = "lnTranslations";
  if (window[s] !== void 0) return;
  const b = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function y(_) {
    this.dom = _, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = _.getAttribute(l + "-default") || "", this.placeholderLabel = _.getAttribute(l + "-placeholder") || "{lang} translation", this.removeLabel = _.getAttribute(l + "-remove-label") || "Remove {lang}", this.badgesEl = _.querySelector("[" + l + "-active]"), this.menuEl = _.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const p = _.getAttribute(l + "-locales");
    if (this.locales = b, p)
      try {
        this.locales = JSON.parse(p);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const m = this;
    return this._onRequestAdd = function(a) {
      a.detail && a.detail.lang && m.addLanguage(a.detail.lang);
    }, this._onRequestRemove = function(a) {
      a.detail && a.detail.lang && m.removeLanguage(a.detail.lang);
    }, _.addEventListener("ln-translations:request-add", this._onRequestAdd), _.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  y.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const _ = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const p of _) {
      const m = p.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const a of m)
        a.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, y.prototype._detectExisting = function() {
    const _ = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const p of _) {
      const m = p.getAttribute("data-ln-translatable-lang");
      m && m !== this.defaultLang && this.activeLanguages.add(m);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, y.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const _ = this;
    let p = 0;
    for (const a in this.locales) {
      if (!this.locales.hasOwnProperty(a) || this.activeLanguages.has(a)) continue;
      p++;
      const h = Nt("ln-translations-menu-item", "ln-translations");
      if (!h) return;
      const o = h.querySelector("[data-ln-translations-lang]");
      o.setAttribute("data-ln-translations-lang", a), o.textContent = this.locales[a], o.addEventListener("click", function(d) {
        d.ctrlKey || d.metaKey || d.button === 1 || (d.preventDefault(), d.stopPropagation(), _.menuEl.getAttribute("data-ln-toggle") === "open" && _.menuEl.setAttribute("data-ln-toggle", "close"), _.addLanguage(a));
      }), this.menuEl.appendChild(h);
    }
    const m = this.dom.querySelector("[" + l + "-add]");
    m && (m.hidden = p === 0);
  }, y.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const _ = this;
    this.activeLanguages.forEach(function(p) {
      const m = Nt("ln-translations-badge", "ln-translations");
      if (!m) return;
      const a = m.querySelector("[data-ln-translations-lang]");
      a.setAttribute("data-ln-translations-lang", p);
      const h = a.querySelector("span");
      h.textContent = _.locales[p] || p.toUpperCase();
      const o = a.querySelector("button"), d = _.locales[p] || p.toUpperCase();
      o.setAttribute("aria-label", _.removeLabel.replace("{lang}", d)), o.addEventListener("click", function(u) {
        u.ctrlKey || u.metaKey || u.button === 1 || (u.preventDefault(), u.stopPropagation(), _.removeLanguage(p));
      }), _.badgesEl.appendChild(m);
    });
  }, y.prototype.addLanguage = function(_, p) {
    if (this.activeLanguages.has(_)) return;
    const m = this.locales[_] || _;
    if (X(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: _,
      langName: m
    }).defaultPrevented) return;
    this.activeLanguages.add(_), p = p || {};
    const h = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const o of h) {
      const d = o.getAttribute("data-ln-translatable"), u = o.getAttribute("data-ln-translations-prefix") || "", c = o.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!c) continue;
      const g = c.cloneNode(c.tagName === "SELECT");
      u ? g.name = u + "[trans][" + _ + "][" + d + "]" : g.name = "trans[" + _ + "][" + d + "]", g.value = p[d] !== void 0 ? p[d] : "", g.removeAttribute("id"), "placeholder" in g && (g.placeholder = this.placeholderLabel.replace("{lang}", m)), g.setAttribute("data-ln-translatable-lang", _);
      const i = o.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), r = i.length > 0 ? i[i.length - 1] : c;
      r.parentNode.insertBefore(g, r.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: _,
      langName: m
    });
  }, y.prototype.removeLanguage = function(_) {
    if (!this.activeLanguages.has(_) || X(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: _
    }).defaultPrevented) return;
    const m = this.dom.querySelectorAll('[data-ln-translatable-lang="' + _ + '"]');
    for (const a of m)
      a.parentNode.removeChild(a);
    this.activeLanguages.delete(_), this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: _
    });
  }, y.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, y.prototype.hasLanguage = function(_) {
    return this.activeLanguages.has(_);
  }, y.prototype.destroy = function() {
    if (!this.dom[s]) return;
    const _ = this.defaultLang, p = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const m of p)
      m.getAttribute("data-ln-translatable-lang") !== _ && m.parentNode.removeChild(m);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[s];
  }, U(l, s, y, "ln-translations");
})();
(function() {
  const l = "data-ln-autosave", s = "lnAutosave", b = "data-ln-autosave-clear", y = "data-ln-autosave-debounce-input", _ = "ln-autosave:";
  if (window[s] !== void 0) return;
  function m(d) {
    const u = a(d);
    if (!u) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", d);
      return;
    }
    this.dom = d, this.key = u;
    let c = null;
    function g() {
      const e = me(d, { exclude: "[data-ln-autosave-exclude]" });
      try {
        localStorage.setItem(u, JSON.stringify(e));
      } catch {
        return;
      }
      L(d, "ln-autosave:saved", { target: d, data: e });
    }
    function i() {
      let e;
      try {
        e = localStorage.getItem(u);
      } catch {
        return;
      }
      if (!e) return;
      let n;
      try {
        n = JSON.parse(e);
      } catch {
        return;
      }
      if (X(d, "ln-autosave:before-restore", { target: d, data: n }).defaultPrevented) return;
      const v = ge(d, n);
      for (let E = 0; E < v.length; E++)
        v[E].dispatchEvent(new Event("input", { bubbles: !0 })), v[E].dispatchEvent(new Event("change", { bubbles: !0 }));
      L(d, "ln-autosave:restored", { target: d, data: n });
    }
    function r() {
      try {
        localStorage.removeItem(u);
      } catch {
        return;
      }
      L(d, "ln-autosave:cleared", { target: d });
    }
    this._onFocusout = function(e) {
      const n = e.target;
      h(n) && n.name && !n.hasAttribute("data-ln-autosave-exclude") && g();
    }, this._onChange = function(e) {
      const n = e.target;
      h(n) && n.name && !n.hasAttribute("data-ln-autosave-exclude") && g();
    }, this._onSubmit = function() {
      r();
    }, this._onReset = function() {
      r();
    }, this._onClearClick = function(e) {
      e.target.closest("[" + b + "]") && r();
    }, d.addEventListener("focusout", this._onFocusout), d.addEventListener("change", this._onChange), d.addEventListener("submit", this._onSubmit), d.addEventListener("reset", this._onReset), d.addEventListener("click", this._onClearClick);
    const t = o(d);
    return t > 0 && (this._onInput = function(e) {
      const n = e.target;
      !h(n) || !n.name || n.hasAttribute("data-ln-autosave-exclude") || (c !== null && clearTimeout(c), c = setTimeout(g, t));
    }, d.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return c;
    }, i(), this;
  }
  m.prototype.destroy = function() {
    if (this.dom[s]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const d = this._getInputTimer();
        d !== null && clearTimeout(d);
      }
      L(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[s];
    }
  };
  function a(d) {
    const c = d.getAttribute(l) || d.id;
    return c ? _ + window.location.pathname + ":" + c : null;
  }
  function h(d) {
    const u = d.tagName;
    return u === "INPUT" || u === "TEXTAREA" || u === "SELECT";
  }
  function o(d) {
    if (!d.hasAttribute(y)) return 0;
    const u = d.getAttribute(y);
    if (u === "" || u === null) return 1e3;
    const c = parseInt(u, 10);
    return isNaN(c) || c < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", d), 1e3) : c;
  }
  U(l, s, m, "ln-autosave");
})();
(function() {
  const l = "data-ln-autoresize", s = "lnAutoresize";
  if (window[s] !== void 0) return;
  function b(y) {
    if (y.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", y.tagName), this;
    this.dom = y;
    const _ = this;
    return this._onInput = function() {
      _._resize();
    }, y.addEventListener("input", this._onInput), this._resize(), this;
  }
  b.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, b.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[s]);
  }, U(l, s, b, "ln-autoresize");
})();
(function() {
  const l = "data-ln-editor", s = "lnEditor";
  if (window[s] !== void 0) return;
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
  }, _ = {
    "heading-2": "h2",
    "heading-3": "h3",
    "heading-4": "h4",
    blockquote: "blockquote",
    code: "pre",
    paragraph: "p"
  }, p = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let m = 0;
  function a(t) {
    return !!(y[t] || _[t] || p[t] || t === "link");
  }
  function h(t) {
    this.dom = t;
    const e = this;
    if (this._textarea = t.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", t), this;
    const n = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), n && this._surface.setAttribute("data-placeholder", n);
    const f = this._textarea.id;
    if (f) {
      const A = t.querySelector('label[for="' + f + '"]');
      A && (A.id || (A.id = f + "-label"), this._surface.setAttribute("aria-labelledby", A.id));
    }
    this._surface.id = f ? f + "-surface" : "ln-editor-surface-" + ++m;
    const v = this._textarea.value.trim();
    v && (this._surface.innerHTML = v);
    const E = t.querySelector('[role="toolbar"]');
    if (E && E.nextSibling ? t.insertBefore(this._surface, E.nextSibling) : t.appendChild(this._surface), E) {
      E.setAttribute("aria-controls", this._surface.id);
      const A = E.querySelectorAll("[data-ln-editor-action]");
      for (let S = 0; S < A.length; S++) {
        const q = A[S].getAttribute("data-ln-editor-action");
        a(q) && A[S].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      e._syncToTextarea(), L(e.dom, "ln-editor:changed", {
        html: e._textarea.value,
        target: e.dom
      });
    }, this._onMousedownToolbar = function(A) {
      A.target.closest("[data-ln-editor-action]") && A.preventDefault();
    }, this._onClickToolbar = function(A) {
      const S = A.target.closest("[data-ln-editor-action]");
      if (!S) return;
      const q = S.getAttribute("data-ln-editor-action");
      e._execAction(q);
    }, this._onPaste = function(A) {
      u(e, A);
    }, this._onKeydown = function(A) {
      i(e, A);
    }, this._onSelectionChange = function() {
      document.contains(e._surface) && e._updateActiveStates();
    }, this._onFocus = function() {
      L(e.dom, "ln-editor:focus", { target: e.dom });
    }, this._onBlur = function() {
      e._syncToTextarea(), L(e.dom, "ln-editor:blur", { target: e.dom });
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), E && (E.addEventListener("mousedown", this._onMousedownToolbar), E.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(A) {
      const S = A.detail && A.detail.html;
      S !== void 0 && (e._surface.innerHTML = S, e._syncToTextarea(), L(e.dom, "ln-editor:changed", {
        html: e._textarea.value,
        target: e.dom
      }));
    }, t.addEventListener("ln-editor:set-content", this._onSetContent);
    const w = this._textarea.form;
    return w && (this._onFormReset = function() {
      setTimeout(function() {
        e._surface.innerHTML = e._textarea.value, L(t, "ln-editor:changed", {
          html: e._textarea.value,
          target: t
        });
      }, 0);
    }, w.addEventListener("reset", this._onFormReset)), this;
  }
  h.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, h.prototype._execAction = function(t) {
    if (!(!t || X(this.dom, "ln-editor:before-change", {
      action: t,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), y[t])
        document.execCommand(y[t], !1, null);
      else if (_[t]) {
        const n = _[t], f = o(this._surface);
        f && f.toLowerCase() === n ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + n + ">");
      } else p[t] ? document.execCommand(p[t], !1, null) : t === "link" ? r(this) : t === "unlink" ? document.execCommand("unlink", !1, null) : t === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, h.prototype._updateActiveStates = function() {
    const t = this.dom.querySelector('[role="toolbar"]');
    if (!t) return;
    const e = window.getSelection();
    if (!e || e.rangeCount === 0) return;
    const n = e.anchorNode;
    if (!n || !this._surface.contains(n)) return;
    const f = t.querySelectorAll("[data-ln-editor-action]");
    for (let v = 0; v < f.length; v++) {
      const E = f[v], w = E.getAttribute("data-ln-editor-action");
      let A = !1;
      if (y[w])
        try {
          A = document.queryCommandState(y[w]);
        } catch {
        }
      else if (_[w]) {
        const S = o(this._surface);
        A = S && S.toLowerCase() === _[w];
      } else if (p[w])
        try {
          A = document.queryCommandState(p[w]);
        } catch {
        }
      else w === "link" && (A = !!d(e.anchorNode, "A", this._surface));
      a(w) && E.setAttribute("aria-pressed", String(A)), A ? E.classList.add("ln-editor-active") : E.classList.remove("ln-editor-active");
    }
  }, h.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, h.prototype.setHTML = function(t) {
    this._surface && (this._surface.innerHTML = t, this._syncToTextarea(), L(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, h.prototype.destroy = function() {
    if (!this.dom[s]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const t = this.dom.querySelector('[role="toolbar"]');
    t && (t.removeEventListener("mousedown", this._onMousedownToolbar), t.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const e = this._textarea ? this._textarea.form : null;
    e && this._onFormReset && e.removeEventListener("reset", this._onFormReset), this._textarea && this._textarea.removeAttribute("data-ln-editor-source");
    const n = this.dom.querySelector(".ln-editor__link-popover");
    n && n.remove(), L(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[s];
  };
  function o(t) {
    const e = window.getSelection();
    if (!e || e.rangeCount === 0) return null;
    let n = e.anchorNode;
    if (!n) return null;
    for (; n && n !== t; ) {
      if (n.nodeType === 1) {
        const f = n.tagName;
        if (f === "H2" || f === "H3" || f === "H4" || f === "BLOCKQUOTE" || f === "PRE" || f === "P")
          return f;
      }
      n = n.parentNode;
    }
    return null;
  }
  function d(t, e, n) {
    for (; t && t !== n; ) {
      if (t.nodeType === 1 && t.tagName === e)
        return t;
      t = t.parentNode;
    }
    return null;
  }
  function u(t, e) {
    e.preventDefault();
    let n = "";
    if (e.clipboardData && (n = e.clipboardData.getData("text/html"), !n)) {
      const v = e.clipboardData.getData("text/plain");
      v && (n = v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), n = "<p>" + n + "</p>");
    }
    if (!n) return;
    const f = c(n);
    f && document.execCommand("insertHTML", !1, f);
  }
  function c(t) {
    const e = document.createElement("div");
    return e.innerHTML = t, g(e), e.innerHTML;
  }
  function g(t) {
    const e = Array.from(t.childNodes);
    for (let n = 0; n < e.length; n++) {
      const f = e[n];
      if (f.nodeType !== 3) {
        if (f.nodeType !== 1) {
          t.removeChild(f);
          continue;
        }
        if (b[f.tagName]) {
          const v = Array.from(f.attributes);
          for (let E = 0; E < v.length; E++) {
            const w = v[E].name;
            if (f.tagName === "A" && w === "href") {
              const A = f.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(A) || f.removeAttribute("href");
            } else
              f.removeAttribute(w);
          }
          f.tagName === "A" && f.setAttribute("rel", "noopener noreferrer"), g(f);
        } else {
          for (; f.firstChild; )
            t.insertBefore(f.firstChild, f);
          t.removeChild(f);
        }
      }
    }
  }
  function i(t, e) {
    if (!(e.ctrlKey || e.metaKey)) return;
    let n = null;
    switch (e.key.toLowerCase()) {
      case "b":
        n = "bold";
        break;
      case "i":
        n = "italic";
        break;
      case "u":
        n = "underline";
        break;
      case "k":
        n = "link";
        break;
    }
    n && (e.preventDefault(), t._execAction(n));
  }
  function r(t) {
    const e = window.getSelection();
    if (!e || e.rangeCount === 0) return;
    const n = d(e.anchorNode, "A", t._surface), f = e.getRangeAt(0).cloneRange(), v = t.dom.querySelector(".ln-editor__link-popover");
    v && v.remove();
    const E = _t(t.dom, "ln-editor-link-popover", "ln-editor");
    if (!E) return;
    const w = E.firstElementChild;
    if (!w) return;
    const A = w.querySelector('input[type="url"]'), S = w.querySelector('[data-ln-editor-action="confirm-link"]'), q = w.querySelector('[data-ln-editor-action="cancel-link"]');
    n && (A.value = n.getAttribute("href") || "");
    const x = t.dom.querySelector('[role="toolbar"]');
    x ? x.after(w) : t.dom.insertBefore(w, t._surface), A.focus();
    function D() {
      const F = window.getSelection();
      F.removeAllRanges(), F.addRange(f);
    }
    function k() {
      const F = A.value.trim();
      if (w.remove(), D(), t._surface.focus(), F)
        if (n)
          n.setAttribute("href", F), n.setAttribute("rel", "noopener noreferrer"), t._syncToTextarea(), L(t.dom, "ln-editor:changed", {
            html: t._textarea.value,
            target: t.dom
          });
        else {
          document.execCommand("createLink", !1, F);
          const B = window.getSelection();
          if (B && B.anchorNode) {
            const z = d(B.anchorNode, "A", t._surface);
            z && (z.setAttribute("rel", "noopener noreferrer"), t._syncToTextarea());
          }
        }
      else n && document.execCommand("unlink", !1, null);
    }
    function R() {
      w.remove(), D(), t._surface.focus();
    }
    S.addEventListener("click", k), q.addEventListener("click", R), A.addEventListener("keydown", function(F) {
      F.key === "Enter" ? (F.preventDefault(), k()) : F.key === "Escape" && (F.preventDefault(), R());
    });
  }
  U(l, s, h, "ln-editor");
})();
(function() {
  const l = "lnFill";
  if (window[l] !== void 0) return;
  const s = { lnFillForm: !0, lnFillStore: !0 };
  function b(_) {
    const p = {}, m = _.dataset;
    for (const a in m) {
      if (!a.startsWith("lnFill") || s[a]) continue;
      const h = a.slice(6);
      h && (p[h.charAt(0).toLowerCase() + h.slice(1)] = m[a]);
    }
    return p;
  }
  function y(_, p) {
    const m = window.CSS && CSS.escape ? CSS.escape(p) : p, a = document.querySelectorAll('[data-ln-fill-id="' + m + '"]');
    if (a.length === 0) return null;
    for (let h = 0; h < a.length; h++) {
      const o = a[h].getAttribute("data-ln-fill-form");
      if (o) {
        const d = document.getElementById(o);
        if (d && _.contains(d)) return a[h];
      }
    }
    return a[0];
  }
  document.addEventListener("click", function(_) {
    if (_.ctrlKey || _.metaKey || _.button === 1) return;
    const p = _.target.closest("[data-ln-fill-form]");
    if (!p) return;
    const m = p.getAttribute("href");
    if (m && m.indexOf("#") !== -1) return;
    const a = p.getAttribute("data-ln-fill-form"), h = document.getElementById(a);
    if (!h) return;
    const o = b(p), d = Object.keys(o).length > 0;
    window.lnCore.lnFill(h, d ? o : null);
  }), document.addEventListener("ln-fill:request", function(_) {
    const p = _.detail;
    if (!p) return;
    const m = _.target, a = p.id;
    if (a == null) {
      window.lnCore.lnFill(m, null);
      return;
    }
    const h = y(m, a);
    if (!h) return;
    const o = b(h);
    window.lnCore.lnFill(m, o);
  }), window[l] = !0;
})();
(function() {
  const l = "data-ln-slug-from", s = "lnSlug";
  if (window[s] !== void 0) return;
  function b(_) {
    return String(_).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function y(_) {
    if (_.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", _.tagName), this;
    const p = _.form;
    if (!p)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", _), this;
    const m = _.getAttribute(l), a = p.elements[m];
    if (!a)
      return console.warn('[ln-slug] Source field "' + m + '" not found in form:', _), this;
    if (typeof a.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + m + '" is a RadioNodeList (same-name group) — single source field required:', _), this;
    this.dom = _, this.source = a, this._pristine = _.value === "", this._mirroring = !1;
    const h = this;
    return this._onSource = function() {
      h._pristine && h._mirror();
    }, this._onSlug = function() {
      h._mirroring || (h._pristine = h.dom.value === "");
    }, a.addEventListener("input", this._onSource), _.addEventListener("input", this._onSlug), this;
  }
  y.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = b(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, y.prototype.destroy = function() {
    this.dom[s] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[s]);
  }, U(l, s, y, "ln-slug");
})();
(function() {
  const l = "data-ln-time", s = "lnTime";
  if (window[s] !== void 0) return;
  const b = {}, y = {};
  function _(w) {
    return w.getAttribute("data-ln-time-locale") || $(w);
  }
  function p(w, A) {
    const S = (w || "") + "|" + JSON.stringify(A);
    return b[S] || (b[S] = new Intl.DateTimeFormat(w, A)), b[S];
  }
  function m(w) {
    const A = w || "";
    return y[A] || (y[A] = new Intl.RelativeTimeFormat(w, { numeric: "auto", style: "narrow" })), y[A];
  }
  const a = /* @__PURE__ */ new Set();
  let h = null;
  function o() {
    h || (h = setInterval(u, 6e4));
  }
  function d() {
    h && (clearInterval(h), h = null);
  }
  function u() {
    for (const w of a) {
      if (!document.body.contains(w.dom)) {
        a.delete(w);
        continue;
      }
      e(w);
    }
    a.size === 0 && d();
  }
  function c(w, A) {
    const S = Dt(A), q = (A || "").toLowerCase().split("-")[0], x = p(A, { dateStyle: "long", timeStyle: "short" }), D = x.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (S && D !== q && S.monthsLong) {
      const k = S.monthsLong[w.getMonth()], R = w.getDate(), F = w.getFullYear(), B = String(w.getHours()).padStart(2, "0"), z = String(w.getMinutes()).padStart(2, "0");
      return `${R} ${k} ${F} во ${B}:${z}`;
    }
    return x.format(w);
  }
  function g(w, A) {
    const S = /* @__PURE__ */ new Date(), q = { month: "short", day: "numeric" };
    w.getFullYear() !== S.getFullYear() && (q.year = "numeric");
    const x = Dt(A), D = (A || "").toLowerCase().split("-")[0], k = p(A, q), R = k.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (x && R !== D && x.monthsShort) {
      const F = x.monthsShort[w.getMonth()], B = w.getDate(), z = w.getFullYear() !== S.getFullYear() ? " " + w.getFullYear() : "";
      return `${B} ${F}${z}`;
    }
    return k.format(w);
  }
  function i(w, A) {
    return p(A, { dateStyle: "medium" }).format(w);
  }
  function r(w, A) {
    return p(A, { timeStyle: "short" }).format(w);
  }
  function t(w, A) {
    const S = Math.floor(Date.now() / 1e3), x = Math.floor(w.getTime() / 1e3) - S, D = Math.abs(x);
    if (D < 10) return m(A).format(0, "second");
    let k, R;
    if (D < 60)
      k = "second", R = x;
    else if (D < 3600)
      k = "minute", R = Math.round(x / 60);
    else if (D < 86400)
      k = "hour", R = Math.round(x / 3600);
    else if (D < 604800)
      k = "day", R = Math.round(x / 86400);
    else if (D < 2592e3)
      k = "week", R = Math.round(x / 604800);
    else
      return g(w, A);
    return m(A).format(R, k);
  }
  function e(w) {
    const A = w.dom.getAttribute("datetime");
    if (!A) return;
    const S = Number(A);
    if (isNaN(S)) return;
    const q = new Date(S * 1e3), x = w.dom.getAttribute(l) || "short", D = _(w.dom);
    let k;
    switch (x) {
      case "relative":
        k = t(q, D);
        break;
      case "full":
        k = c(q, D);
        break;
      case "date":
        k = i(q, D);
        break;
      case "time":
        k = r(q, D);
        break;
      default:
        k = g(q, D);
        break;
    }
    w.dom.textContent = k, x !== "full" && (w.dom.title = c(q, D));
  }
  function n(w) {
    return this.dom = w, e(this), w.getAttribute(l) === "relative" && (a.add(this), o()), this;
  }
  n.prototype.render = function() {
    e(this);
  }, n.prototype.destroy = function() {
    a.delete(this), a.size === 0 && d(), delete this.dom[s];
  };
  function f(w) {
    const A = w[s];
    if (!A) return;
    w.getAttribute(l) === "relative" ? (a.add(A), o()) : (a.delete(A), a.size === 0 && d()), e(A);
  }
  function v(w) {
    w.nodeType === 1 && w.hasAttribute && w.hasAttribute(l) && w[s] && e(w[s]);
  }
  function E() {
    new MutationObserver(function() {
      const w = document.querySelectorAll("[" + l + "]");
      for (let A = 0; A < w.length; A++) {
        const S = w[A][s];
        S && e(S);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  U(l, s, n, "ln-time", {
    extraAttributes: ["datetime", "data-ln-time-locale", "lang"],
    onAttributeChange: f,
    onInit: v
  }), E();
})();
function rn(l) {
  l = l || {};
  let s = l.windowSize > 0 ? l.windowSize : 1e3, b = l.pageSize > 0 ? l.pageSize : 200, y = l.fetchDebounce != null ? l.fetchDebounce : 120;
  const _ = typeof l.requestPage == "function" ? l.requestPage : function() {
  }, p = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set();
  let h = 0, o = 0, d = 0, u = null, c = 0;
  function g(t) {
    m.set(t, ++c);
  }
  function i() {
    if (p.size <= s) return;
    const t = Array.from(p.keys()).sort(function(n, f) {
      return (m.get(n) || 0) - (m.get(f) || 0);
    });
    let e = 0;
    for (; p.size > s && e < t.length; )
      p.delete(t[e]), m.delete(t[e]), e++;
  }
  function r(t, e, n) {
    a.add(t), _(t, e, n);
  }
  return {
    get logicalTotal() {
      return h;
    },
    set logicalTotal(t) {
      h = t;
    },
    get grandTotal() {
      return o;
    },
    set grandTotal(t) {
      o = t;
    },
    get queryGen() {
      return d;
    },
    set queryGen(t) {
      d = t;
    },
    get size() {
      return p.size;
    },
    getId: function(t) {
      if (p.has(t))
        return g(t), p.get(t);
    },
    // The caller asks for an exact range it already decided it needs — the
    // index is an id resolver, not a scroll surface. Prefetch padding is the
    // view's job (it owns the viewport); padding here would fetch a page
    // nobody asked for on top of every page the view asks for.
    ensure: function(t, e, n) {
      if (h <= 0) {
        a.has(0) || (clearTimeout(u), u = setTimeout(function() {
          r(0, b, n);
        }, y));
        return;
      }
      const f = Math.max(0, t), v = Math.min(h, e), E = Math.floor(f / b), w = Math.floor(Math.max(0, v - 1) / b);
      let A = -1;
      for (let S = E; S <= w; S++) {
        const q = S * b, x = Math.min(b, h - q);
        let D = !1;
        const k = Math.max(q, f), R = Math.min(q + x, v);
        for (let F = k; F < R; F++)
          if (!p.has(F)) {
            D = !0;
            break;
          }
        if (D && !a.has(q)) {
          A = q;
          break;
        }
      }
      A !== -1 && (clearTimeout(u), u = setTimeout(function() {
        r(A, b, n);
      }, y));
    },
    ingest: function(t, e, n, f, v) {
      if (!(v != null && v !== d)) {
        o = n ?? o, h = f ?? h;
        for (let E = 0; E < e.length; E++)
          p.set(t + E, e[E]), g(t + E);
        a.delete(t), i();
      }
    },
    // Query change: new generation, positions dropped. The totals are kept
    // as the stale-while-revalidate carry-over the view renders against
    // until the new generation's first page lands in ingest() — same
    // contract as createWindowCache.invalidate().
    reset: function() {
      d++, p.clear(), m.clear(), a.clear(), clearTimeout(u);
    },
    clear: function() {
      p.clear(), m.clear(), a.clear(), clearTimeout(u);
    },
    configure: function(t) {
      if (t = t || {}, t.windowSize != null && t.windowSize > 0 && t.windowSize !== s) {
        const e = t.windowSize < s;
        s = t.windowSize, e && i();
      }
      t.pageSize != null && t.pageSize > 0 && (b = t.pageSize), t.fetchDebounce != null && t.fetchDebounce >= 0 && (y = t.fetchDebounce);
    }
  };
}
(function() {
  const l = "data-ln-data-store", s = "lnDataStore";
  if (window[s] !== void 0) return;
  const b = "ln_app_cache", y = "_meta", _ = "1.0";
  let p = null, m = null;
  const a = {};
  function h(C) {
    C && C.name === "QuotaExceededError" && L(document, "ln-data-store:quota-exceeded", { error: C });
  }
  function o() {
    const C = {};
    for (const T of document.querySelectorAll(`[${l}]`)) {
      const I = T.id;
      if (I) {
        const M = T.getAttribute("data-ln-data-store-indexes") || "";
        C[I] = {
          indexes: M.split(",").map((O) => O.trim()).filter(Boolean)
        };
      }
    }
    return C;
  }
  function d() {
    return m || (m = new Promise((C) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), C(null);
      const T = o(), I = Object.keys(T), M = indexedDB.open(b);
      M.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), C(null);
      }, M.onsuccess = (O) => {
        const N = O.target.result, H = Array.from(N.objectStoreNames);
        if (!(!H.includes(y) || I.some((st) => !H.includes(st))))
          return u(N), p = N, C(N);
        const G = N.version;
        N.close();
        const Q = indexedDB.open(b, G + 1);
        Q.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, Q.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), C(null);
        }, Q.onupgradeneeded = (st) => {
          const dt = st.target.result;
          dt.objectStoreNames.contains(y) || dt.createObjectStore(y, { keyPath: "key" });
          for (const zt of I)
            if (!dt.objectStoreNames.contains(zt)) {
              const Ne = dt.createObjectStore(zt, { keyPath: "id" });
              for (const oe of T[zt].indexes)
                Ne.createIndex(oe, oe, { unique: !1 });
            }
        }, Q.onsuccess = (st) => {
          const dt = st.target.result;
          u(dt), p = dt, C(dt);
        };
      };
    }), m);
  }
  function u(C) {
    C.onversionchange = () => {
      C.close(), p = null, m = null;
    };
  }
  function c() {
    return p ? Promise.resolve(p) : (m = null, d());
  }
  async function g(C) {
    if (!bt() || !C) return C;
    const T = { ...C }, I = T.id, M = await Qe(T);
    return !M || !M.encrypted ? C : {
      id: I,
      encrypted: !0,
      iv: M.iv,
      data: M.data
    };
  }
  async function i(C) {
    return !C || !C.encrypted || !bt() ? C : $e(C);
  }
  const r = (C, T) => c().then((I) => I ? I.transaction(C, T).objectStore(C) : null);
  function t(C) {
    return new Promise((T, I) => {
      C.onsuccess = () => T(C.result), C.onerror = () => {
        h(C.error), I(C.error);
      };
    });
  }
  const e = (C) => r(C, "readonly").then((T) => T ? t(T.getAll()) : []).then((T) => bt() ? Promise.all(T.map((I) => i(I))) : T), n = (C, T) => r(C, "readonly").then((I) => I ? t(I.get(T)) : null).then((I) => I ? i(I) : null), f = (C, T) => c().then((I) => {
    if (!I) return [];
    const O = I.transaction(C, "readonly").objectStore(C), N = T.map((H) => t(O.get(H)));
    return Promise.all(N).then((H) => bt() ? Promise.all(H.map((V) => i(V))) : H);
  }), v = (C, T) => (bt() ? g(T) : Promise.resolve(T)).then((M) => r(C, "readwrite").then((O) => O ? t(O.put(M)) : null)), E = (C, T) => r(C, "readwrite").then((I) => I ? t(I.delete(T)) : null), w = (C) => r(C, "readwrite").then((T) => T ? t(T.clear()) : null), A = (C) => r(C, "readonly").then((T) => T ? t(T.count()) : 0), S = (C) => r(y, "readonly").then((T) => T ? t(T.get(C)) : null), q = (C, T) => r(y, "readwrite").then((I) => {
    if (I)
      return T.key = C, t(I.put(T));
  });
  function x(C) {
    this.dom = C, this._name = C.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", C);
    const T = C.getAttribute("data-ln-data-store-stale"), I = parseInt(T, 10);
    this._staleThreshold = T === "never" || T === "-1" ? -1 : isNaN(I) ? 300 : I;
    const M = C.getAttribute("data-ln-data-store-search-fields") || "";
    this._searchFields = M.split(",").map((N) => N.trim()).filter(Boolean), this._handlers = null, this.isLoaded = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null };
    const O = C.getAttribute("data-ln-data-store-window");
    if (O !== null) {
      const N = parseInt(O, 10) || 1e3, H = parseInt(C.getAttribute("data-ln-data-store-window-page"), 10) || 200;
      this._windowIndex = rn({
        windowSize: N,
        pageSize: H,
        requestPage: (V, G, Q) => {
          L(this.dom, "ln-data-store:request-page", {
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
    return this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), a[this._name] = this, D(this), this.ready = et(this), this;
  }
  function D(C) {
    C._handlers = {
      create: (T) => k(C, "create", T.detail, () => F(C, T.detail)),
      update: (T) => k(C, "update", T.detail, () => B(C, T.detail)),
      delete: (T) => k(C, "delete", T.detail, () => z(C, T.detail)),
      "bulk-delete": (T) => k(C, "bulk-delete", T.detail, () => j(C, T.detail)),
      "sync-failed": (T) => {
        C.isSyncing = !1, L(C.dom, "ln-data-store:sync-error", {
          store: C._name,
          error: T.detail && T.detail.error,
          status: T.detail && T.detail.status
        });
      }
    };
    for (const [T, I] of Object.entries(C._handlers))
      C.dom.addEventListener(`ln-data-store:request-${T}`, I);
    C._queryHandlers = {
      "ln-search:change": (T) => {
        T.preventDefault();
        const I = T.detail && T.detail.term != null ? T.detail.term : "";
        I !== C.query.search && (C.query.search = I, Z(C));
      },
      "ln-filter:change": (T) => {
        T.preventDefault();
        const I = T.detail && T.detail.key;
        if (!I) return;
        const M = (T.detail.values || []).slice(), O = C.query.filters[I];
        (O ? O.length === M.length && O.every((H, V) => H === M[V]) : !M.length) || (M.length ? C.query.filters[I] = M : delete C.query.filters[I], Z(C));
      },
      "ln-sort:change": (T) => {
        T.preventDefault();
        const I = T.detail && T.detail.field, M = T.detail && T.detail.direction, O = M && M !== "none" ? { field: I, direction: M } : null, N = C.query.sort;
        !N && !O || N && O && N.field === O.field && N.direction === O.direction || (C.query.sort = O, Z(C));
      }
    };
    for (const [T, I] of Object.entries(C._queryHandlers))
      C.dom.addEventListener(T, I);
  }
  function k(C, T, I, M) {
    const O = I && I.requestId;
    return C._mutationChain = C._mutationChain.then(() => C.ready).then(() => {
      if (C.initializationError) throw C.initializationError;
      return M();
    }).catch((N) => K(C, T, O, N)), C._mutationChain;
  }
  function R(C) {
    return A(C._name).then((T) => (C.totalCount = T, C.hasCache = !0, C.isLoaded = !0, q(C._name, {
      schema_version: _,
      last_synced_at: C.lastSyncedAt,
      has_cache: !0,
      record_count: T
    })));
  }
  function F(C, { tempId: T, data: I = {}, requestId: M } = {}) {
    const O = { ...I, id: T };
    return v(C._name, O).then(() => R(C)).then(() => {
      L(C.dom, "ln-data-store:created", { store: C._name, record: O, tempId: T, requestId: M });
    });
  }
  function B(C, { id: T, data: I = {}, requestId: M } = {}) {
    return n(C._name, T).then((O) => {
      if (!O) throw new Error(`Record not found: ${T}`);
      const N = { ...O, ...I }, H = I.id;
      return (H !== void 0 && H !== T ? J(C._name, T, N) : v(C._name, N)).then(() => R(C)).then(() => {
        L(C.dom, "ln-data-store:updated", { store: C._name, record: N, previous: O, requestId: M });
      });
    });
  }
  function z(C, { id: T, requestId: I } = {}) {
    return n(C._name, T).then((M) => {
      if (!M) {
        L(C.dom, "ln-data-store:deleted", { store: C._name, id: T, requestId: I, missing: !0 });
        return;
      }
      return E(C._name, T).then(() => R(C)).then(() => {
        L(C.dom, "ln-data-store:deleted", { store: C._name, id: T, requestId: I });
      });
    });
  }
  function j(C, { ids: T = [], requestId: I } = {}) {
    return T.length ? Promise.all(T.map((M) => n(C._name, M))).then((M) => {
      const O = M.filter(Boolean).map((N) => N.id);
      return W(C._name, O).then(() => R(C)).then(() => {
        L(C.dom, "ln-data-store:deleted", { store: C._name, ids: O, requestId: I });
      });
    }) : (L(C.dom, "ln-data-store:deleted", { store: C._name, ids: [], requestId: I }), Promise.resolve());
  }
  function K(C, T, I, M) {
    console.error("[ln-data-store] " + T + " failed:", M), L(C.dom, "ln-data-store:mutation-error", {
      store: C._name,
      action: T,
      requestId: I,
      error: M
    });
  }
  function et(C) {
    return d().then((T) => {
      if (!T) throw new Error("IndexedDB is unavailable");
      return S(C._name);
    }).then((T) => {
      if (C.initializationError = null, T && T.schema_version === _)
        C.lastSyncedAt = T.last_synced_at || null, C.totalCount = T.record_count || 0, C.hasCache = T.has_cache === !0 || C.totalCount > 0, C.hasCache && (C.isLoaded = !0, L(C.dom, "ln-data-store:ready", { store: C._name, count: C.totalCount, source: "cache" })), C.isInitialized = !0, L(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: C.hasCache, lastSyncedAt: C.lastSyncedAt, count: C.totalCount });
      else {
        if (T && T.schema_version !== _)
          return w(C._name).then(() => q(C._name, { schema_version: _, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            C.isInitialized = !0, C.hasCache = !1, L(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        C.isInitialized = !0, C.hasCache = !1, L(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((T) => (C.isInitialized = !0, C.isLoaded = !1, C.hasCache = !1, C.isSyncing = !1, C.initializationError = T, L(C.dom, "ln-data-store:initialization-error", { store: C._name, error: T }), { ok: !1, error: T }));
  }
  function Lt(C) {
    C.isSyncing = !0, L(C.dom, "ln-data-store:request-remote-sync", { since: C.lastSyncedAt });
  }
  function P(C, T) {
    return c().then((I) => I ? (bt() ? Promise.all(T.map((O) => g(O))) : Promise.resolve(T)).then((O) => new Promise((N, H) => {
      const V = I.transaction(C, "readwrite"), G = V.objectStore(C);
      O.forEach((Q) => G.put(Q)), V.oncomplete = () => N(), V.onerror = () => {
        h(V.error), H(V.error);
      };
    })) : void 0);
  }
  function W(C, T) {
    return c().then((I) => {
      if (I)
        return new Promise((M, O) => {
          const N = I.transaction(C, "readwrite"), H = N.objectStore(C);
          T.forEach((V) => H.delete(V)), N.oncomplete = () => M(), N.onerror = () => O(N.error);
        });
    });
  }
  function J(C, T, I) {
    return (bt() ? g(I) : Promise.resolve(I)).then((O) => c().then((N) => {
      if (N)
        return new Promise((H, V) => {
          const G = N.transaction(C, "readwrite"), Q = G.objectStore(C);
          Q.put(O), Q.delete(T), G.oncomplete = () => H(), G.onerror = () => {
            h(G.error), V(G.error);
          };
        });
    }));
  }
  const Tt = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function pt(C, T) {
    if (!T || !T.field) return C;
    const { field: I, direction: M } = T, O = M === "desc";
    return [...C].sort((N, H) => {
      const V = N[I], G = H[I];
      if (V == null && G == null) return 0;
      if (V == null) return O ? 1 : -1;
      if (G == null) return O ? -1 : 1;
      const Q = typeof V == "string" && typeof G == "string" ? Tt.compare(V, G) : V < G ? -1 : V > G ? 1 : 0;
      return O ? -Q : Q;
    });
  }
  function ot(C, T) {
    if (!T) return C;
    const I = Object.keys(T).filter((M) => Array.isArray(T[M]) && T[M].length > 0);
    return I.length ? C.filter(
      (M) => I.every((O) => T[O].map(String).includes(String(M[O])))
    ) : C;
  }
  function qt(C, T, I) {
    if (!T || !I || !I.length) return C;
    const M = T.toLowerCase();
    return C.filter(
      (O) => I.some((N) => {
        const H = O[N];
        return H != null && String(H).toLowerCase().includes(M);
      })
    );
  }
  function mt(C, T, I) {
    if (!C.length) return 0;
    if (I === "count") return C.length;
    const M = C.map((N) => parseFloat(N[T])).filter((N) => !isNaN(N)), O = M.reduce((N, H) => N + H, 0);
    return I === "sum" ? O : I === "avg" && M.length ? O / M.length : 0;
  }
  function ut(C, T) {
    if (!C.presenters || !C.presenters.computed) return T;
    const I = C.presenters.computed;
    return T.map((M) => {
      if (!M) return null;
      const O = { ...M };
      for (const [N, H] of Object.entries(I))
        try {
          O[N] = H(M);
        } catch (V) {
          console.error(`[ln-data-store] Decorator computed field failed for ${N}`, V);
        }
      return O;
    });
  }
  x.prototype.getAll = function(C = {}) {
    const T = this;
    if (T._windowIndex) {
      const I = C.offset || 0, M = C.limit || 200;
      T._windowIndex.ensure(I, I + M, C);
      const O = [];
      for (let H = I; H < I + M; H++) {
        const V = T._windowIndex.getId(H);
        O.push(V);
      }
      const N = Array.from(new Set(O.filter((H) => H !== void 0)));
      return f(T._name, N).then((H) => {
        const V = /* @__PURE__ */ new Map();
        for (let Q = 0; Q < H.length; Q++) {
          const st = H[Q];
          st && V.set(String(st.id), st);
        }
        const G = [];
        for (let Q = 0; Q < O.length; Q++) {
          const st = O[Q];
          if (st === void 0)
            G.push(null);
          else {
            const dt = V.get(String(st));
            G.push(dt || null);
          }
        }
        return {
          data: ut(T, G),
          total: T._windowIndex.grandTotal,
          filtered: T._windowIndex.logicalTotal,
          offset: I,
          queryGen: T._windowIndex.queryGen
        };
      });
    }
    return e(T._name).then((I) => {
      const M = I.length;
      C.filters && (I = ot(I, C.filters)), C.search && (I = qt(I, C.search, T._searchFields));
      const O = I.length;
      if (C.sort && (I = pt(I, C.sort)), C.offset || C.limit) {
        const N = C.offset || 0, H = C.limit || I.length;
        I = I.slice(N, N + H);
      }
      return {
        data: ut(T, I),
        total: M,
        filtered: O
      };
    });
  }, x.prototype.getById = function(C) {
    return n(this._name, C).then((T) => T ? ut(this, [T])[0] : null);
  }, x.prototype.count = function(C) {
    return C ? e(this._name).then((T) => ot(T, C).length) : A(this._name);
  }, x.prototype.aggregate = function(C, T) {
    return e(this._name).then((I) => mt(I, C, T));
  }, x.prototype.setPresenters = function(C) {
    this.presenters = C;
  }, x.prototype.applySync = function(C, T, I, M) {
    M = M || {};
    const O = this;
    if (O._windowIndex && M.queryGen != null && M.queryGen !== O._windowIndex.queryGen)
      return Promise.resolve();
    C.length > 0 || T.length > 0;
    let N = Promise.resolve();
    return C.length > 0 && (N = N.then(() => P(O._name, C))), T.length > 0 && (N = N.then(() => W(O._name, T))), N.then(() => {
      if (O._windowIndex && (M.offset != null || M.total != null)) {
        const H = M.offset != null ? M.offset : 0, V = C.map((G) => G.id);
        O._windowIndex.ingest(H, V, M.total, M.filtered, M.queryGen);
      }
    }).then(() => A(O._name)).then((H) => (O.totalCount = M.total !== void 0 ? M.total : H, O.hasCache = !0, q(O._name, {
      schema_version: _,
      last_synced_at: I,
      has_cache: !0,
      record_count: O.totalCount
    }))).then(() => {
      const H = !O.isLoaded;
      O.isLoaded = !0, O.isSyncing = !1, O.lastSyncedAt = I, H ? (L(O.dom, "ln-data-store:loaded", { store: O._name, count: O.totalCount, meta: M }), L(O.dom, "ln-data-store:ready", { store: O._name, count: O.totalCount, source: "server", meta: M })) : L(O.dom, "ln-data-store:synced", {
        store: O._name,
        added: C.length,
        deleted: T.length,
        changed: !0,
        meta: M
      });
    }).catch((H) => {
      O.isSyncing = !1, console.error("[ln-data-store] applySync failed:", H);
    });
  }, x.prototype.applyQuery = function(C, T) {
    T = T || {};
    const I = this;
    let M = Promise.resolve();
    return C.length > 0 && (M = M.then(() => P(I._name, C))), M.then(() => A(I._name)).then((O) => (I.totalCount = T.total !== void 0 ? T.total : O, ut(I, C))).catch((O) => (console.error("[ln-data-store] applyQuery failed:", O), []));
  }, x.prototype.forceSync = function() {
    this.isSyncing || Lt(this);
  }, x.prototype.fullReload = function() {
    const C = this;
    return w(C._name).then(() => q(C._name, {
      schema_version: _,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      C.isLoaded = !1, C.hasCache = !1, C.lastSyncedAt = null, C.totalCount = 0, Lt(C);
    });
  }, x.prototype.destroy = function() {
    if (this._windowIndex && (this._windowIndex.clear(), this._windowIndex = null), this._handlers) {
      for (const [C, T] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${C}`, T);
      this._handlers = null;
    }
    if (this._queryHandlers) {
      for (const [C, T] of Object.entries(this._queryHandlers))
        this.dom.removeEventListener(C, T);
      this._queryHandlers = null;
    }
    delete a[this._name], delete this.dom[s], L(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function Ot() {
    return c().then((C) => {
      if (!C) return;
      const T = Array.from(C.objectStoreNames);
      return new Promise((I, M) => {
        const O = C.transaction(T, "readwrite");
        T.forEach((N) => O.objectStore(N).clear()), O.oncomplete = () => I(), O.onerror = () => M(O.error);
      });
    }).then(() => {
      Object.values(a).forEach((C) => {
        C.isLoaded = !1, C.isInitialized = !1, C.initializationError = null, C.hasCache = !1, C.isSyncing = !1, C.lastSyncedAt = null, C.totalCount = 0;
      });
    });
  }
  function Z(C) {
    C._windowIndex && C._windowIndex.reset(), L(C.dom, "ln-data-store:query-changed", {
      store: C._name,
      query: {
        filters: Object.assign({}, C.query.filters),
        search: C.query.search,
        sort: C.query.sort ? Object.assign({}, C.query.sort) : null
      }
    });
  }
  U(l, s, x, "ln-data-store"), window[s].clearAll = Ot, window[s].init = window[s], window[s].setStorageKey = ae, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = ae);
})();
(function() {
  const l = "data-ln-api-connector", s = "lnApiConnector", b = "lnConnector";
  if (window[s] !== void 0) return;
  function y(a) {
    return a.ok ? a.status === 204 ? null : a.json() : a.json().catch(() => null).then((h) => {
      const o = new Error("HTTP " + a.status + ": " + a.statusText);
      throw o.status = a.status, o.data = h, o;
    });
  }
  function _(a) {
    return this.dom = a, a[s] = this, a[b] = this, this._inflight = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, p(this), this;
  }
  _.prototype.refreshConfig = function() {
    const a = this.dom;
    this.baseUrl = a.getAttribute("data-ln-api-base-url") || "", this.path = a.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin", this.paramKeys = {
      offset: a.getAttribute("data-ln-api-param-offset") || "offset",
      limit: a.getAttribute("data-ln-api-param-limit") || "limit",
      search: a.getAttribute("data-ln-api-param-search") || "search",
      sortField: a.getAttribute("data-ln-api-param-sort-field") || "sort_field",
      sortDir: a.getAttribute("data-ln-api-param-sort-dir") || "sort_dir"
    };
    const h = a.getAttribute("data-ln-api-headers") || "";
    this.headers = ye(h, "ln-api-connector"), (h.toLowerCase().includes("authorization") || h.toLowerCase().includes("bearer") || h.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), L(a, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, _.prototype._reqHeaders = function(a) {
    const h = Object.assign({}, St(this.headers), { "X-LN-Response": "data" });
    return a && (h["Idempotency-Key"] = a), h;
  }, _.prototype.fetchDelta = function(a, h) {
    const o = this;
    let d = tt(o.baseUrl, o.path);
    a != null && a !== "" && (d += (d.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(a));
    const u = h || "sync";
    o._inflight.has(u) && o._inflight.get(u).abort();
    const c = new AbortController();
    return o._inflight.set(u, c), window.fetch(d, {
      method: "GET",
      headers: o._reqHeaders(),
      credentials: o.credentials,
      signal: c.signal
    }).then(y).finally(function() {
      o._inflight.get(u) === c && o._inflight.delete(u);
    });
  }, _.prototype.query = function(a, h) {
    const o = this;
    a = a || {};
    let d = tt(o.baseUrl, o.path);
    const u = o.paramKeys || {
      offset: "offset",
      limit: "limit",
      search: "search",
      sortField: "sort_field",
      sortDir: "sort_dir"
    }, c = new URLSearchParams();
    a.search && c.append(u.search, a.search), a.offset != null && c.append(u.offset, a.offset), a.limit != null && c.append(u.limit, a.limit), a.sort && a.sort.field && a.sort.direction && (c.append(u.sortField, a.sort.field), c.append(u.sortDir, a.sort.direction)), a.filters && typeof a.filters == "object" && Object.keys(a.filters).forEach((e) => {
      const n = a.filters[e];
      Array.isArray(n) && n.length > 0 && c.append(e, n.join(","));
    });
    const g = c.toString();
    g && (d += (d.indexOf("?") !== -1 ? "&" : "?") + g);
    let i = null;
    h && (o._inflight.has(h) && o._inflight.get(h).abort(), i = new AbortController(), o._inflight.set(h, i));
    const r = {
      method: "GET",
      headers: o._reqHeaders(),
      credentials: o.credentials
    };
    i && (r.signal = i.signal);
    let t = window.fetch(d, r).then(y);
    return h && i && (t = t.finally(function() {
      o._inflight.get(h) === i && o._inflight.delete(h);
    })), t;
  }, _.prototype.create = function(a, h, o) {
    const d = this;
    return window.fetch(tt(d.baseUrl, h || d.path), {
      method: "POST",
      headers: d._reqHeaders(o),
      credentials: d.credentials,
      body: JSON.stringify(a)
    }).then(y);
  }, _.prototype.update = function(a, h, o, d, u) {
    const c = this;
    o != null && (h = Object.assign({}, h, { expected_version: o }));
    const g = d ? tt(c.baseUrl, d) : tt(c.baseUrl, c.path, a);
    return window.fetch(g, {
      method: "PUT",
      headers: c._reqHeaders(u),
      credentials: c.credentials,
      body: JSON.stringify(h)
    }).then(y);
  }, _.prototype.delete = function(a, h, o) {
    const d = this;
    return window.fetch(tt(d.baseUrl, h || d.path, a), {
      method: "DELETE",
      headers: d._reqHeaders(o),
      credentials: d.credentials
    }).then(y);
  }, _.prototype.bulkDelete = function(a, h, o) {
    const d = this;
    return window.fetch(tt(d.baseUrl, h || d.path) + "/bulk-delete", {
      method: "DELETE",
      headers: d._reqHeaders(o),
      credentials: d.credentials,
      body: JSON.stringify({ ids: a })
    }).then(y);
  };
  function p(a) {
    a._handlers = {
      sync: function(o) {
        const d = o.detail || {}, u = d.meta && d.meta.targetEl ? d.meta.targetEl : null;
        a.fetchDelta(d.since, u).then(function(c) {
          L(a.dom, "ln-api-connector:fetched", { data: c, since: d.since, meta: d.meta || null });
        }).catch(function(c) {
          c && c.name === "AbortError" || L(a.dom, "ln-api-connector:error", {
            action: "sync",
            error: c.message,
            status: c.status || 0,
            data: c.data || null,
            since: d.since,
            meta: d.meta || null
          });
        });
      },
      query: function(o) {
        const d = o.detail || {}, u = d.query || d, c = d.meta && d.meta.targetEl ? d.meta.targetEl : null;
        a.query(u, c).then(function(g) {
          const i = g || {};
          L(a.dom, "ln-api-connector:fetched", {
            data: i.data || (Array.isArray(i) ? i : []),
            total: i.total,
            filtered: i.filtered,
            offset: u.offset,
            queryGen: u.queryGen,
            meta: d.meta || null
          });
        }).catch(function(g) {
          g && g.name === "AbortError" || L(a.dom, "ln-api-connector:error", {
            action: "query",
            error: g.message,
            status: g.status || 0,
            data: g.data || null,
            meta: d.meta || null
          });
        });
      },
      create: function(o) {
        const d = o.detail || {};
        a.create(d.data, d.url, d.idempotencyKey).then(function(u) {
          const c = u && u.content !== void 0 ? u.content : u, g = u && u.message ? u.message : null;
          L(a.dom, "ln-api-connector:created", { record: c, tempId: d.tempId, message: g, meta: d.meta || null });
        }).catch(function(u) {
          L(a.dom, "ln-api-connector:error", {
            action: "create",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            tempId: d.tempId,
            meta: d.meta || null
          });
        });
      },
      update: function(o) {
        const d = o.detail || {};
        a.update(d.id, d.data, d.expected_version, d.url, d.idempotencyKey).then(function(u) {
          const c = u && u.content !== void 0 ? u.content : u, g = u && u.message ? u.message : null;
          L(a.dom, "ln-api-connector:updated", { record: c, id: d.id, message: g, meta: d.meta || null });
        }).catch(function(u) {
          L(a.dom, "ln-api-connector:error", {
            action: "update",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            id: d.id,
            conflictData: u.status === 409 ? u.data : null,
            meta: d.meta || null
          });
        });
      },
      delete: function(o) {
        const d = o.detail || {};
        a.delete(d.id, d.url, d.idempotencyKey).then(function(u) {
          const c = u && u.message ? u.message : null;
          L(a.dom, "ln-api-connector:deleted", { response: u, id: d.id, message: c, meta: d.meta || null });
        }).catch(function(u) {
          L(a.dom, "ln-api-connector:error", {
            action: "delete",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            id: d.id,
            meta: d.meta || null
          });
        });
      },
      bulkDelete: function(o) {
        const d = o.detail || {};
        a.bulkDelete(d.ids, d.url, d.idempotencyKey).then(function(u) {
          const c = u && u.message ? u.message : null;
          L(a.dom, "ln-api-connector:bulk-deleted", { response: u, ids: d.ids, message: c, meta: d.meta || null });
        }).catch(function(u) {
          L(a.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            ids: d.ids,
            meta: d.meta || null
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(o) {
      a.dom.addEventListener(o + ":request-sync", a._handlers.sync), a.dom.addEventListener(o + ":request-query", a._handlers.query), a.dom.addEventListener(o + ":request-fetch", a._handlers.query), a.dom.addEventListener(o + ":request-create", a._handlers.create), a.dom.addEventListener(o + ":request-update", a._handlers.update), a.dom.addEventListener(o + ":request-delete", a._handlers.delete), a.dom.addEventListener(o + ":request-bulk-delete", a._handlers.bulkDelete);
    });
  }
  _.prototype.destroy = function() {
    if (!this.dom[s]) return;
    const a = this;
    a._inflight && (a._inflight.forEach(function(h) {
      h.abort();
    }), a._inflight.clear()), a._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(o) {
      a.dom.removeEventListener(o + ":request-sync", a._handlers.sync), a.dom.removeEventListener(o + ":request-query", a._handlers.query), a.dom.removeEventListener(o + ":request-fetch", a._handlers.query), a.dom.removeEventListener(o + ":request-create", a._handlers.create), a.dom.removeEventListener(o + ":request-update", a._handlers.update), a.dom.removeEventListener(o + ":request-delete", a._handlers.delete), a.dom.removeEventListener(o + ":request-bulk-delete", a._handlers.bulkDelete);
    }), a._handlers = null), L(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[s], delete this.dom[b];
  };
  function m(a) {
    const h = a[s];
    h && h.refreshConfig();
  }
  U(l, s, _, "ln-api-connector", {
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
    onAttributeChange: m
  });
})();
(function() {
  const l = "data-ln-couchdb-connector", s = "lnCouchDbConnector", b = "lnConnector";
  if (window[s] !== void 0) return;
  function y(c) {
    const g = c && c.content !== void 0 ? c.content : c, i = c && c.message ? c.message : null;
    return { content: g, message: i };
  }
  function _(c) {
    return this.dom = c, c[s] = this, c[b] = this, this.refreshConfig(), this._handlers = null, d(this), this;
  }
  _.prototype.refreshConfig = function() {
    const c = this.dom;
    this.url = c.getAttribute("data-ln-couchdb-url") || "", this.db = c.getAttribute("data-ln-couchdb-db") || "", this.auth = c.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const g = c.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = ye(g, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), g.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), L(c, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function p(c, g, i) {
    const r = Object.assign({}, St(c.headers, c.auth), i || {});
    return g && (r["Idempotency-Key"] = g), r;
  }
  _.prototype.fetchDelta = function(c) {
    const g = this, i = ["include_docs=true", "feed=normal"];
    c && i.push("since=" + encodeURIComponent(c));
    const r = tt(g.url, g.db, "_changes") + "?" + i.join("&");
    return window.fetch(r, { method: "GET", headers: St(g.headers, g.auth), credentials: g.credentials }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const e = t.results || [];
      return {
        data: e.filter((n) => !n.deleted && n.doc).map((n) => Object.assign({}, n.doc, { id: n.doc._id })),
        deleted: e.filter((n) => n.deleted).map((n) => n.id),
        synced_at: t.last_seq || c || ""
      };
    });
  };
  function m(c, g, i) {
    const r = Object.assign({ _id: g.id }, g);
    return r._id || delete r._id, window.fetch(tt(c.url, c.db), {
      method: "POST",
      headers: p(c, i),
      credentials: c.credentials,
      body: JSON.stringify(r)
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const e = y(t), n = e.content;
      return { record: Object.assign({}, r, { id: n.id, _id: n.id, _rev: n.rev }), message: e.message };
    });
  }
  _.prototype.create = function(c, g) {
    return m(this, c, g).then((i) => i.record);
  };
  function a(c, g, i, r) {
    const t = Object.assign({ id: String(g), _id: String(g) }, i), e = t._rev || t.rev;
    return (e ? Promise.resolve(e) : window.fetch(tt(c.url, c.db, null, g), { method: "GET", headers: St(c.headers, c.auth), credentials: c.credentials }).then((f) => {
      if (!f.ok) throw new Error("Could not retrieve document for revision mapping");
      return f.json().then((v) => v._rev);
    })).then((f) => {
      const v = Object.assign({}, t, { _rev: f });
      delete v.rev;
      const E = p(c, r, { "If-Match": f });
      return window.fetch(tt(c.url, c.db, null, g), {
        method: "PUT",
        headers: E,
        credentials: c.credentials,
        body: JSON.stringify(v)
      }).then((w) => {
        if (w.ok) return w.json().then((A) => {
          const S = y(A);
          return { record: Object.assign({}, v, { _rev: S.content.rev }), message: S.message };
        });
        if (w.status === 409) return w.json().then((A) => {
          const S = new Error("Conflict");
          throw S.status = 409, S.data = A, S;
        });
        throw new Error("HTTP " + w.status + ": " + w.statusText);
      });
    });
  }
  _.prototype.update = function(c, g, i) {
    return a(this, c, g, i).then((r) => r.record);
  };
  function h(c, g, i, r) {
    return (i ? Promise.resolve(i) : window.fetch(tt(c.url, c.db, null, g), { method: "GET", headers: St(c.headers, c.auth), credentials: c.credentials }).then((e) => {
      if (!e.ok) throw new Error("Could not retrieve document for revision delete");
      return e.json().then((n) => n._rev);
    })).then((e) => {
      const n = tt(c.url, c.db, null, g) + "?rev=" + encodeURIComponent(e);
      return window.fetch(n, { method: "DELETE", headers: p(c, r), credentials: c.credentials }).then((f) => {
        if (!f.ok) throw new Error("HTTP " + f.status + ": " + f.statusText);
        return f.json();
      }).then((f) => {
        const v = y(f);
        return { response: v.content, message: v.message };
      });
    });
  }
  _.prototype.delete = function(c, g, i) {
    return h(this, c, g, i).then((r) => r.response);
  };
  function o(c, g, i) {
    return !g || g.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(tt(c.url, c.db, "_all_docs"), {
      method: "POST",
      headers: St(c.headers, c.auth),
      credentials: c.credentials,
      body: JSON.stringify({ keys: g })
    }).then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status + ": " + r.statusText);
      return r.json();
    }).then((r) => {
      const e = (r.rows || []).filter((n) => !n.error && n.value && n.value.rev).map((n) => ({ _id: n.id, _rev: n.value.rev, _deleted: !0 }));
      return e.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(tt(c.url, c.db, "_bulk_docs"), {
        method: "POST",
        headers: p(c, i),
        credentials: c.credentials,
        body: JSON.stringify({ docs: e })
      }).then((n) => {
        if (!n.ok) throw new Error("HTTP " + n.status + ": " + n.statusText);
        return n.json();
      }).then((n) => {
        const f = y(n);
        return { response: { ok: !0, results: f.content, deletedCount: e.length }, message: f.message };
      });
    });
  }
  _.prototype.bulkDelete = function(c, g) {
    return o(this, c, g).then((i) => i.response);
  };
  function d(c) {
    c._handlers = {
      sync: function(i) {
        const r = i.detail || {};
        c.fetchDelta(r.since).then(function(t) {
          L(c.dom, "ln-couchdb-connector:fetched", { data: t, since: r.since, meta: r.meta || null });
        }).catch(function(t) {
          L(c.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: t.message,
            status: t.status || 0,
            since: r.since,
            meta: r.meta || null
          });
        });
      },
      create: function(i) {
        const r = i.detail || {};
        m(c, r.data, r.idempotencyKey).then(function(t) {
          L(c.dom, "ln-couchdb-connector:created", { record: t.record, tempId: r.tempId, message: t.message, meta: r.meta || null });
        }).catch(function(t) {
          L(c.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: t.message,
            status: t.status || 0,
            tempId: r.tempId,
            meta: r.meta || null
          });
        });
      },
      update: function(i) {
        const r = i.detail || {}, t = Object.assign({}, r.data);
        r.expected_version !== void 0 && (t._rev = r.expected_version), a(c, r.id, t, r.idempotencyKey).then(function(e) {
          L(c.dom, "ln-couchdb-connector:updated", { record: e.record, id: r.id, message: e.message, meta: r.meta || null });
        }).catch(function(e) {
          L(c.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: e.message,
            status: e.status || 0,
            id: r.id,
            data: e.status === 409 ? e.data : null,
            conflictData: e.status === 409 ? e.data : null,
            meta: r.meta || null
          });
        });
      },
      delete: function(i) {
        const r = i.detail || {};
        h(c, r.id, r.rev, r.idempotencyKey).then(function(t) {
          L(c.dom, "ln-couchdb-connector:deleted", { response: t.response, id: r.id, message: t.message, meta: r.meta || null });
        }).catch(function(t) {
          L(c.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: t.message,
            status: t.status || 0,
            id: r.id,
            meta: r.meta || null
          });
        });
      },
      bulkDelete: function(i) {
        const r = i.detail || {};
        o(c, r.ids, r.idempotencyKey).then(function(t) {
          L(c.dom, "ln-couchdb-connector:bulk-deleted", { response: t.response, ids: r.ids, message: t.message, meta: r.meta || null });
        }).catch(function(t) {
          L(c.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: t.message,
            status: t.status || 0,
            ids: r.ids,
            meta: r.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(i) {
      c.dom.addEventListener(i + ":request-sync", c._handlers.sync), c.dom.addEventListener(i + ":request-fetch", c._handlers.sync), c.dom.addEventListener(i + ":request-create", c._handlers.create), c.dom.addEventListener(i + ":request-update", c._handlers.update), c.dom.addEventListener(i + ":request-delete", c._handlers.delete), c.dom.addEventListener(i + ":request-bulk-delete", c._handlers.bulkDelete);
    });
  }
  _.prototype.destroy = function() {
    if (!this.dom[s]) return;
    const c = this;
    c._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(i) {
      c.dom.removeEventListener(i + ":request-sync", c._handlers.sync), c.dom.removeEventListener(i + ":request-fetch", c._handlers.sync), c.dom.removeEventListener(i + ":request-create", c._handlers.create), c.dom.removeEventListener(i + ":request-update", c._handlers.update), c.dom.removeEventListener(i + ":request-delete", c._handlers.delete), c.dom.removeEventListener(i + ":request-bulk-delete", c._handlers.bulkDelete);
    }), c._handlers = null), L(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[s], delete this.dom[b];
  };
  function u(c) {
    const g = c[s];
    g && g.refreshConfig();
  }
  U(l, s, _, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: u
  });
})();
function on(l) {
  return l = l || {}, {
    sort: l.sort,
    filters: l.filters,
    search: l.search,
    offset: l.offset,
    limit: l.limit,
    queryGen: l.queryGen
  };
}
function Wt(l, s) {
  const b = !l || !!l.initializationError;
  return s && (b || !l.isLoaded) ? "remote" : l && !l.initializationError ? "store" : "none";
}
function ue(l, s) {
  const b = Object.assign({}, l);
  return s && (b.filters = s.filters, b.search = s.search, b.sort = s.sort), b;
}
class sn {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(s) {
    return new Promise((b, y) => {
      this._pending.set(s, { resolve: b, reject: y });
    });
  }
  resolve(s) {
    return this._settle(s, !1);
  }
  reject(s) {
    return this._settle(s, !0);
  }
  close(s) {
    const b = s || new Error("Mutation receipt registry closed");
    for (const y of this._pending.values()) y.reject(b);
    this._pending.clear();
  }
  _settle(s, b) {
    const y = s && s.requestId;
    if (!y) return !1;
    const _ = this._pending.get(y);
    return _ ? (this._pending.delete(y), b ? _.reject(s.error || new Error("Store mutation failed")) : _.resolve(s), !0) : !1;
  }
}
(function() {
  const l = "data-ln-data-coordinator", s = "lnDataCoordinator", b = "lnCoordinator", y = "data-ln-form-scope";
  if (window[s] !== void 0) return;
  const _ = /* @__PURE__ */ new Set();
  let p = !1, m = null, a = null, h = null;
  function o() {
    p || (p = !0, m = function() {
      L(document, "ln-data-store:online", {}), _.forEach(function(t) {
        t._maybeSync();
      });
    }, a = function() {
      L(document, "ln-data-store:offline", {});
    }, h = function() {
      document.visibilityState === "visible" && _.forEach(function(t) {
        const e = t.findChildren(), n = e.store;
        n && e.connector && n.isInitialized && !n.initializationError && !n.isSyncing && !t._noAutosync && (!n.hasCache || t._isStale()) && n.forceSync();
      });
    }, window.addEventListener("online", m), window.addEventListener("offline", a), document.addEventListener("visibilitychange", h));
  }
  function d() {
    p && (_.size > 0 || (window.removeEventListener("online", m), window.removeEventListener("offline", a), document.removeEventListener("visibilitychange", h), m = null, a = null, h = null, p = !1));
  }
  function u() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
        const n = Math.random() * 16 | 0;
        return (e === "x" ? n : n & 3 | 8).toString(16);
      });
    }
  }
  const c = ["ln-api-connector", "ln-couchdb-connector"];
  function g(t) {
    return this.dom = t, this._name = t.id, this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", t), t[s] = this, t[b] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new sn(), this._dict = te(t, "data-ln-data-coordinator-dict"), this._parseStaleAttributes(), this.refreshMapper(), i(this), _.add(this), o(), this._checkInitialSync(), this;
  }
  g.prototype._parseStaleAttributes = function() {
    const e = this.findChildren().storeEl, n = this.dom.getAttribute("data-ln-data-coordinator-stale") || (e ? e.getAttribute("data-ln-data-store-stale") : null), f = parseInt(n, 10);
    this._staleThreshold = n === "never" || n === "-1" ? -1 : isNaN(f) ? 300 : f;
    const v = this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (e ? e.hasAttribute("data-ln-data-store-no-autosync") : !1);
    this._noAutosync = !!v;
  }, g.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const e = this.findChildren().store;
    return !e || !e.lastSyncedAt ? !0 : Date.now() / 1e3 - e.lastSyncedAt > this._staleThreshold;
  }, g.prototype._maybeSync = function() {
    const t = this.findChildren(), e = t.store;
    !e || e.initializationError || !t.connector || this._noAutosync || !e.isInitialized || e.isSyncing || (!e.hasCache || this._isStale()) && e.forceSync();
  }, g.prototype._checkInitialSync = function() {
    const t = this, n = this.findChildren().store;
    n && Promise.resolve(n.ready).then(function() {
      const f = t.findChildren(), v = f.store;
      if (v && v.initializationError) {
        t._reportReconciliationError("store-initialize", v.initializationError, null);
        return;
      }
      !v || !f.connector || t._noAutosync || v.isSyncing || (!v.hasCache || t._isStale()) && v.forceSync();
    }).catch(function(f) {
      t._reportReconciliationError("store-initialize", f, null);
    });
  }, g.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const e = this.dom.getAttribute("data-ln-data-mapper") || this.dom.id;
    e && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(e)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(n) {
      return n;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(n) {
      return n;
    });
  }, g.prototype.findChildren = function() {
    const t = this.dom.querySelector("[data-ln-data-store]"), e = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]"), n = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: t,
      connectorEl: e,
      queueEl: n,
      store: t ? t.lnDataStore || t.lnStore : null,
      connector: e ? e.lnConnector || e.lnApiConnector || e.lnCouchDbConnector : null,
      queue: n ? n.lnApiQueue : null
    };
  }, g.prototype._handleSubmitRecord = function(t) {
    const e = this.findChildren();
    if (!e.storeEl) {
      console.warn('[ln-data-coordinator] form submit claimed but no [data-ln-data-store] child found in "' + (this._name || "") + '"');
      return;
    }
    const n = t.data || {}, f = n.id, v = n.expected_version, E = Object.assign({}, n);
    delete E.id, delete E.expected_version;
    const w = t.method.toUpperCase();
    w === "POST" ? this._fanOutCreate(e, E, t.action) : (w === "PUT" || w === "PATCH") && this._fanOutUpdate(e, f, E, v, t.action);
  }, g.prototype._fanOutCreate = function(t, e, n) {
    this.refreshMapper();
    const f = "_temp_" + u();
    L(t.storeEl, "ln-data-store:request-create", { tempId: f, data: e }), t.queue ? L(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: f,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(e),
      expectedVersion: null,
      meta: { tempId: f, action: n }
    }) : t.connector && L(t.connectorEl, "ln-api-connector:request-create", {
      data: this.mapper.egress(e),
      url: n,
      meta: { entryId: u(), queued: !1, op: "create", tempId: f }
    });
  }, g.prototype._fanOutUpdate = function(t, e, n, f, v) {
    this.refreshMapper(), L(t.storeEl, "ln-data-store:request-update", { id: e, data: n }), t.queue ? L(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: e,
      op: "update",
      targetId: e,
      payload: this.mapper.egress(n),
      expectedVersion: f,
      meta: { id: e, action: v }
    }) : t.connector && L(t.connectorEl, "ln-api-connector:request-update", {
      id: e,
      data: this.mapper.egress(n),
      expected_version: f,
      url: v,
      meta: { entryId: u(), queued: !1, op: "update", id: e }
    });
  }, g.prototype._fanOutDelete = function(t, e) {
    this.refreshMapper(), L(t.storeEl, "ln-data-store:request-delete", { id: e }), t.queue ? L(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: e,
      op: "delete",
      targetId: e,
      payload: null,
      expectedVersion: null,
      meta: { id: e }
    }) : t.connector && L(t.connectorEl, "ln-api-connector:request-delete", {
      id: e,
      meta: { entryId: u(), queued: !1, op: "delete", id: e }
    });
  }, g.prototype._fanOutBulkDelete = function(t, e) {
    this.refreshMapper();
    const n = e.join(",");
    L(t.storeEl, "ln-data-store:request-bulk-delete", { ids: e }), t.queue ? L(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: n,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: e },
      expectedVersion: null,
      meta: { bulkKey: n, ids: e }
    }) : t.connector && L(t.connectorEl, "ln-api-connector:request-bulk-delete", {
      ids: e,
      meta: { entryId: u(), queued: !1, op: "bulk-delete", bulkKey: n }
    });
  }, g.prototype._toastFromMessage = function(t) {
    t && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: t.type || "success",
        title: t.title || "",
        message: t.body || ""
      }
    }));
  }, g.prototype._toastFromDict = function(t) {
    const e = this._dict[t];
    e && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: "error", title: "", message: e }
    }));
  }, g.prototype._requestStoreMutation = function(t, e, n) {
    const f = t.storeEl;
    if (!f) return Promise.reject(new Error("Store element not found"));
    const v = u(), E = this._mutationReceipts.wait(v);
    return L(f, "ln-data-store:request-" + e, Object.assign({}, n, { requestId: v })), E;
  }, g.prototype._reportReconciliationError = function(t, e, n) {
    L(this.dom, "ln-data-coordinator:error", {
      operation: t,
      error: e,
      meta: n || null
    });
  };
  function i(t) {
    t._handlers = {
      sync: function(e) {
        t.refreshMapper();
        const n = t.findChildren();
        if (!n.store || !n.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        L(n.connectorEl, "ln-api-connector:request-sync", { since: e.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(e) {
        const n = t.findChildren();
        if (!n.connectorEl) return;
        const f = e.detail || {};
        L(n.connectorEl, "ln-api-connector:request-query", {
          query: Object.assign({}, f.query, {
            offset: f.offset,
            limit: f.limit,
            queryGen: f.queryGen
          })
        });
      },
      reqCreate: function(e) {
        const n = t.findChildren();
        n.storeEl && t._fanOutCreate(n, e.detail.data || {}, e.detail.action);
      },
      reqUpdate: function(e) {
        const n = t.findChildren();
        n.storeEl && t._fanOutUpdate(n, e.detail.id, e.detail.data || {}, e.detail.expected_version, e.detail.action);
      },
      reqDelete: function(e) {
        const n = t.findChildren();
        n.storeEl && t._fanOutDelete(n, e.detail.id);
      },
      reqBulkDelete: function(e) {
        const n = t.findChildren();
        n.storeEl && t._fanOutBulkDelete(n, e.detail.ids || []);
      },
      queueFailed: function() {
        t._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(e) {
        t.refreshMapper();
        const n = t.findChildren();
        if (!n.store || !n.connector || !n.queue) return;
        const f = e.detail || {}, v = f.entryId, E = f.op, w = f.targetId, A = f.payload, S = f.expectedVersion, q = f.meta || {}, x = q.action || null, D = f.idempotencyKey || v;
        E === "create" ? L(n.connectorEl, "ln-api-connector:request-create", {
          data: A,
          url: x,
          idempotencyKey: D,
          meta: { entryId: v, queued: !0, op: "create", tempId: q.tempId }
        }) : E === "update" ? L(n.connectorEl, "ln-api-connector:request-update", {
          id: w,
          data: A,
          expected_version: S,
          url: x,
          idempotencyKey: D,
          meta: { entryId: v, queued: !0, op: "update", id: w }
        }) : E === "delete" ? L(n.connectorEl, "ln-api-connector:request-delete", {
          id: w,
          idempotencyKey: D,
          meta: { entryId: v, queued: !0, op: "delete", id: w }
        }) : E === "bulk-delete" ? L(n.connectorEl, "ln-api-connector:request-bulk-delete", {
          ids: A && A.ids ? A.ids : [],
          idempotencyKey: D,
          meta: { entryId: v, queued: !0, op: "bulk-delete", bulkKey: q.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", E);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(e) {
        const n = e.target;
        if (e.defaultPrevented) return;
        const f = n.hasAttribute(y) ? n.getAttribute(y) : null;
        if (f === null) return;
        let v;
        if (f ? v = f === t._name : v = n.closest("[data-ln-data-coordinator]") === t.dom, !v) return;
        const E = Be(n);
        if (E !== "POST" && E !== "PUT" && E !== "PATCH") return;
        e.preventDefault();
        const w = me(n);
        delete w._method, delete w._token, t._handleSubmitRecord({ data: w, method: E, action: n.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(e) {
        const n = e.detail.meta || {}, f = t.findChildren();
        t.refreshMapper();
        const v = e.detail.data;
        let E = [], w = [], A = null;
        Array.isArray(v) ? (E = v, A = Math.floor(Date.now() / 1e3)) : v && (E = Array.isArray(v.data) ? v.data : [], w = Array.isArray(v.deleted) ? v.deleted : [], A = v.synced_at !== void 0 ? v.synced_at : v.since !== void 0 ? v.since : null);
        const S = E.map((q) => t.mapper.ingress(q));
        if (f.store && !f.store.initializationError)
          n.kind ? n.kind === "table" || n.kind === "list" || n.kind === "chart" ? f.store.applyQuery(S, { total: e.detail.total }).then(function(q) {
            L(n.targetEl, "ln-" + n.kind + ":set-loading", { loading: !1 }), L(n.targetEl, "ln-" + n.kind + ":set-data", {
              data: q,
              total: e.detail.total !== void 0 ? e.detail.total : q.length,
              filtered: e.detail.filtered !== void 0 ? e.detail.filtered : q.length,
              offset: e.detail.offset,
              queryGen: e.detail.queryGen
            }), t._boundDelivered.set(n.targetEl, !0);
          }) : n.kind === "options" ? f.store.applyQuery(S, { total: e.detail.total }).then(function() {
            return f.store.getAll({});
          }).then(function(q) {
            L(n.targetEl, "ln-options:set-data", { data: q.data });
          }) : n.kind === "stat" && f.store.applyQuery(S, { total: e.detail.total }).then(function() {
            const q = e.detail.filtered !== void 0 ? e.detail.filtered : e.detail.total !== void 0 ? e.detail.total : S.length;
            L(n.targetEl, "ln-stat:set-count", { count: q });
          }) : f.store.applySync(S, w, A || Math.floor(Date.now() / 1e3), {
            total: e.detail.total,
            filtered: e.detail.filtered,
            offset: e.detail.offset,
            queryGen: e.detail.queryGen,
            targetEl: n.targetEl
          });
        else if (n.targetEl && n.kind) {
          if (n.kind === "table" || n.kind === "list" || n.kind === "chart")
            L(n.targetEl, "ln-" + n.kind + ":set-loading", { loading: !1 }), L(n.targetEl, "ln-" + n.kind + ":set-data", {
              data: S,
              total: e.detail.total !== void 0 ? e.detail.total : S.length,
              filtered: e.detail.filtered !== void 0 ? e.detail.filtered : S.length,
              offset: e.detail.offset,
              queryGen: e.detail.queryGen
            }), t._boundDelivered.set(n.targetEl, !0);
          else if (n.kind === "options")
            L(n.targetEl, "ln-options:set-data", { data: S });
          else if (n.kind === "stat") {
            const q = e.detail.filtered !== void 0 ? e.detail.filtered : e.detail.total !== void 0 ? e.detail.total : S.length;
            L(n.targetEl, "ln-stat:set-count", { count: q });
          }
        }
      },
      connCreated: function(e) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const f = e.detail.meta || {}, v = t.mapper.ingress(e.detail.record);
        t._requestStoreMutation(n, "update", { id: f.tempId, data: v }).then(function() {
          t._toastFromMessage(e.detail.message), f.queued && n.queue && L(n.queueEl, "ln-api-queue:resolve-create", {
            entryId: f.entryId,
            oldKey: f.tempId,
            newId: v.id
          });
        }).catch(function(E) {
          t._reportReconciliationError("create-reconcile", E, f);
        });
      },
      connUpdated: function(e) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const f = e.detail.meta || {}, v = t.mapper.ingress(e.detail.record);
        t._requestStoreMutation(n, "update", { id: f.id, data: v }).then(function() {
          t._toastFromMessage(e.detail.message), f.queued && n.queue && L(n.queueEl, "ln-api-queue:ack", { entryId: f.entryId });
        }).catch(function(E) {
          t._reportReconciliationError("update-reconcile", E, f);
        });
      },
      connDeleted: function(e) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const f = e.detail.meta || {};
        t._toastFromMessage(e.detail.message), f.queued && n.queue && L(n.queueEl, "ln-api-queue:ack", { entryId: f.entryId });
      },
      connBulkDeleted: function(e) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const f = e.detail.meta || {};
        t._toastFromMessage(e.detail.message), f.queued && n.queue && L(n.queueEl, "ln-api-queue:ack", { entryId: f.entryId });
      },
      connError: function(e) {
        const n = e.detail || {}, f = n.meta || {}, v = f.op || n.action, E = n.status || 0, w = t.findChildren();
        if (v === "sync") {
          w.storeEl && L(w.storeEl, "ln-data-store:request-sync-failed", {
            error: n.error,
            status: E
          }), console.error("[ln-data-coordinator] Sync failed:", n.error);
          return;
        }
        if (v === "query") {
          f.targetEl && f.kind && (L(f.targetEl, "ln-" + f.kind + ":set-loading", { loading: !1 }), (f.kind === "table" || f.kind === "list") && L(f.targetEl, "ln-" + f.kind + ":page-failed", { offset: f.offset })), t._reportReconciliationError("query", n.error || n, f);
          return;
        }
        if (!w.storeEl) return;
        const A = E === 401 || E === 419, S = E === 0 || E >= 500, q = E === 409 || E === 412;
        if (A) {
          t._toastFromDict("auth"), f.queued && w.queue && L(w.queueEl, "ln-api-queue:nack", { entryId: f.entryId, reason: "auth" });
          return;
        }
        if (S) {
          f.queued && w.queue ? L(w.queueEl, "ln-api-queue:nack", { entryId: f.entryId, reason: "retry" }) : t._toastFromDict("network");
          return;
        }
        let x = Promise.resolve();
        if (q && v === "update") {
          const D = n.data && n.data.remote ? t.mapper.ingress(n.data.remote) : null;
          D && (x = t._requestStoreMutation(w, "update", { id: f.id, data: D })), t._toastFromDict("conflict");
        } else v === "create" && (x = t._requestStoreMutation(w, "delete", { id: f.tempId })), t._toastFromDict("rejected");
        f.queued && w.queue ? x.then(function() {
          L(w.queueEl, "ln-api-queue:nack", { entryId: f.entryId, reason: "drop" });
        }).catch(function(D) {
          t._reportReconciliationError("deterministic-reconcile", D, f);
        }) : x.catch(function(D) {
          t._reportReconciliationError("deterministic-reconcile", D, f);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(e) {
        const n = t.findChildren(), f = n.store;
        if (!f || f.initializationError || !n.connector || t._noAutosync || f.isSyncing) return;
        (e.detail || {}).hasCache ? t._isStale() && f.forceSync() : f.forceSync();
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
  g.prototype._ownsStore = function(t) {
    const e = this.findChildren();
    return !!(e.store && e.store._name === t && t);
  }, g.prototype._serveData = function(t, e) {
    const n = t.target, f = e === "table" ? "data-ln-table-source" : e === "list" ? "data-ln-list-source" : "data-ln-chart-source", v = n.getAttribute(f);
    if (!v || !this._ownsStore(v)) return;
    const E = t.detail || {}, w = on(E);
    this._boundQueries.set(n, w);
    const A = this.findChildren(), S = this, q = A.store;
    return (q && q.ready ? q.ready : Promise.resolve()).then(function() {
      const D = Wt(q, A.connector), k = ue(w, q && q.query);
      if (D === "remote") {
        L(n, "ln-" + e + ":set-loading", { loading: !0 }), L(A.connectorEl, "ln-api-connector:request-query", {
          query: k,
          meta: { targetEl: n, kind: e, offset: k.offset, limit: k.limit }
        });
        return;
      }
      if (D !== "store") {
        L(n, "ln-" + e + ":set-loading", { loading: !1 });
        return;
      }
      return q.getAll(k).then(function(R) {
        const F = {
          data: R.data,
          total: R.total,
          filtered: R.filtered,
          offset: E.offset !== void 0 ? E.offset : R.offset,
          queryGen: E.queryGen !== void 0 ? E.queryGen : R.queryGen
        };
        L(n, "ln-" + e + ":set-data", F), S._boundDelivered.set(n, !0);
      });
    }).catch(function(D) {
      L(n, "ln-" + e + ":set-loading", { loading: !1 }), L(S.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: e,
        store: v,
        target: n,
        error: D
      });
    });
  }, g.prototype._serveOptions = function(t) {
    const e = t.target, n = e.getAttribute("data-ln-options");
    if (!this._ownsStore(n)) return;
    const f = this.findChildren(), v = f.store, E = v && v.ready ? v.ready : Promise.resolve(), w = this;
    return E.then(function() {
      const A = Wt(v, f.connector);
      if (A === "remote") {
        L(f.connectorEl, "ln-api-connector:request-query", {
          query: {},
          meta: { targetEl: e, kind: "options" }
        });
        return;
      }
      if (A === "store")
        return v.getAll({}).then(function(S) {
          L(e, "ln-options:set-data", { data: S.data });
        });
    }).catch(function(A) {
      w._reportReconciliationError("options-query", A, { targetEl: e, kind: "options" });
    });
  }, g.prototype._serveStat = function(t) {
    const e = t.target, n = e.getAttribute("data-ln-stat");
    if (!this._ownsStore(n)) return;
    const f = t.detail && t.detail.filters ? t.detail.filters : null, v = this.findChildren(), E = v.store, w = E && E.ready ? E.ready : Promise.resolve(), A = this;
    return w.then(function() {
      const S = Wt(E, v.connector);
      if (S === "remote") {
        L(v.connectorEl, "ln-api-connector:request-query", {
          query: { filters: f },
          meta: { targetEl: e, kind: "stat" }
        });
        return;
      }
      if (S === "store")
        return E.count(f).then(function(q) {
          L(e, "ln-stat:set-count", { count: q });
        });
    }).catch(function(S) {
      A._reportReconciliationError("stat-query", S, { targetEl: e, kind: "stat" });
    });
  }, g.prototype._refreshAll = function(t, e) {
    const n = this, f = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let v = 0; v < f.length; v++) {
      const E = f[v];
      let w, A;
      if (E.hasAttribute("data-ln-table-source") ? (w = E.getAttribute("data-ln-table-source"), A = "table") : E.hasAttribute("data-ln-list-source") ? (w = E.getAttribute("data-ln-list-source"), A = "list") : E.hasAttribute("data-ln-chart-source") ? (w = E.getAttribute("data-ln-chart-source"), A = "chart") : E.hasAttribute("data-ln-options") ? (w = E.getAttribute("data-ln-options"), A = "options") : E.hasAttribute("data-ln-stat") && (w = E.getAttribute("data-ln-stat"), A = "stat"), !this._ownsStore(w)) continue;
      const S = this.findChildren().store;
      if (A === "table" || A === "list") {
        const q = A === "table" ? "data-ln-table-window" : "data-ln-list-window";
        if (E.hasAttribute(q)) {
          L(E, "ln-" + A + (e ? ":request-invalidate" : ":request-revalidate"), {});
          continue;
        }
      }
      if (A === "table" || A === "list" || A === "chart") {
        const q = n._boundQueries.get(E) || { sort: null, filters: {}, search: "" };
        (function(x, D) {
          S.getAll(ue(q, S.query)).then(function(k) {
            const R = {
              data: k.data,
              total: t && t.total !== void 0 ? t.total : k.total,
              filtered: t && t.filtered !== void 0 ? t.filtered : k.filtered,
              offset: k.offset !== void 0 ? k.offset : t && t.offset !== void 0 ? t.offset : q.offset,
              queryGen: k.queryGen !== void 0 ? k.queryGen : t && t.queryGen !== void 0 ? t.queryGen : q.queryGen
            };
            L(x, "ln-" + D + ":set-loading", { loading: !1 }), L(x, "ln-" + D + ":set-data", R), n._boundDelivered.set(x, !0);
          });
        })(E, A);
      } else if (A === "options")
        (function(q) {
          S.getAll({}).then(function(x) {
            L(q, "ln-options:set-data", { data: x.data });
          });
        })(E);
      else if (A === "stat") {
        const q = E.getAttribute("data-ln-stat-filter");
        let x = null;
        if (q) {
          const D = q.indexOf(":");
          if (D !== -1) {
            const k = q.slice(0, D), R = q.slice(D + 1);
            x = {}, x[k] = [R];
          }
        }
        (function(D, k) {
          S.count(k).then(function(R) {
            L(D, "ln-stat:set-count", { count: R });
          });
        })(E, x);
      }
    }
  }, g.prototype.destroy = function() {
    if (!this.dom[s]) return;
    const t = this;
    t._handlers && (t.dom.removeEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.removeEventListener("ln-data-store:request-page", t._handlers.requestPage), t.dom.removeEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.removeEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.removeEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.removeEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.removeEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.removeEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.removeEventListener("submit", t._handlers.formSubmit), c.forEach(function(e) {
      t.dom.removeEventListener(e + ":fetched", t._handlers.connFetched), t.dom.removeEventListener(e + ":created", t._handlers.connCreated), t.dom.removeEventListener(e + ":updated", t._handlers.connUpdated), t.dom.removeEventListener(e + ":deleted", t._handlers.connDeleted), t.dom.removeEventListener(e + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.removeEventListener(e + ":error", t._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", t._handlers.reqTableData), document.removeEventListener("ln-list:request-data", t._handlers.reqListData), document.removeEventListener("ln-chart:request-data", t._handlers.reqChartData), document.removeEventListener("ln-options:request-data", t._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.removeEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:created", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:mutation-error", t._handlers.mutationError), t.dom.removeEventListener("ln-data-store:synced", t._handlers.refreshSynced), t.dom.removeEventListener("ln-data-store:query-changed", t._handlers.refreshQuery), t._handlers = null), t._boundQueries = null, t._boundDelivered = null, t._mutationReceipts.close(new Error("Data coordinator destroyed")), t._mutationReceipts = null, _.delete(this), d(), delete this.dom[s], delete this.dom[b];
  };
  function r(t, e) {
    const n = t[s];
    n && e === "data-ln-data-mapper" && n.refreshMapper();
  }
  U(l, s, g, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: r
  });
})();
const an = "ln_api_queue", ln = 2, Y = "outbox", nt = "_queue_meta";
function at(l, s) {
  return l.error || new Error(s);
}
function Et(l, s) {
  return l.bound([s, -1 / 0], [s, 1 / 0]);
}
function he(l) {
  return "seq:" + l;
}
function Mt(l) {
  return "paused:" + l;
}
function fe(l) {
  l.leaseOwner = null, l.leaseUntil = 0;
}
function cn(l, s, b) {
  return typeof l != "string" || l.indexOf(s) === -1 ? l : l.split(s).join(b);
}
function dn(l, s, b, y) {
  const _ = /* @__PURE__ */ new Map(), p = [], m = [];
  for (const a of l || [])
    _.has(a.chainKey) || _.set(a.chainKey, []), _.get(a.chainKey).push(a);
  return _.forEach((a, h) => {
    a.sort((d, u) => d.seq - u.seq);
    const o = a[0];
    if (!(!o || o.status === "failed")) {
      if (o.status === "inflight" && (o.leaseUntil || 0) > y) {
        m.push({ chainKey: h, at: o.leaseUntil });
        return;
      }
      if ((o.nextAttemptAt || 0) > y) {
        m.push({ chainKey: h, at: o.nextAttemptAt });
        return;
      }
      o.status = "inflight", o.leaseOwner = s, o.leaseUntil = y + b, o.updatedAt = y, p.push(o);
    }
  }), { entries: p, wakeups: m };
}
function un(l, s, b, y, _) {
  const p = [], m = [];
  for (const a of l || []) {
    if (a.entryId === s) {
      m.push(a.entryId);
      continue;
    }
    a.chainKey === b && (a.chainKey = y, a.targetId === b && (a.targetId = y), a.meta && a.meta.id === b && (a.meta.id = y), a.meta && typeof a.meta.action == "string" && (a.meta.action = cn(a.meta.action, b, y)), a.updatedAt = _, p.push(a));
  }
  return { changed: p, deleted: m };
}
class hn {
  constructor(s) {
    s = s || {}, this.indexedDB = s.indexedDB || globalThis.indexedDB, this.keyRange = s.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = s.dbName || an, this.now = s.now || (() => Date.now()), this.uuid = s.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((s, b) => {
      const y = this.indexedDB.open(this.dbName, ln);
      y.onupgradeneeded = (_) => {
        const p = _.target.result;
        let m;
        p.objectStoreNames.contains(Y) ? m = _.target.transaction.objectStore(Y) : m = p.createObjectStore(Y, { keyPath: "entryId" }), m.indexNames.contains("by_scope_chain") || m.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), m.indexNames.contains("by_scope_seq") || m.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), p.objectStoreNames.contains(nt) || p.createObjectStore(nt, { keyPath: "key" });
      }, y.onerror = () => b(at(y, "Queue database open failed")), y.onsuccess = (_) => {
        this._db = _.target.result, this._db.onversionchange = () => this.close(), s(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((s, b) => {
      const y = this.indexedDB.deleteDatabase(this.dbName);
      y.onsuccess = () => s(), y.onerror = () => b(at(y, "Queue database delete failed")), y.onblocked = () => b(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(s) {
    return this.open().then((b) => b ? new Promise((y, _) => {
      const m = b.transaction(Y, "readonly").objectStore(Y).index("by_scope_seq").getAll(Et(this.keyRange, s));
      m.onsuccess = () => y(m.result || []), m.onerror = () => _(at(m, "Queue scope read failed"));
    }) : []);
  }
  enqueue(s, b) {
    return b = b || {}, this.open().then((y) => y ? new Promise((_, p) => {
      const m = y.transaction([nt, Y], "readwrite"), a = m.objectStore(nt), h = m.objectStore(Y), o = he(s);
      let d = null;
      const u = (g) => {
        const i = g + 1;
        d = {
          entryId: this.uuid(),
          scope: s,
          chainKey: b.chainKey,
          seq: i,
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
        }, a.put({ key: o, value: i }), h.put(d);
      }, c = a.get(o);
      c.onerror = () => p(at(c, "Queue sequence read failed")), c.onsuccess = () => {
        const g = c.result;
        if (g && typeof g.value == "number") {
          u(g.value);
          return;
        }
        const i = h.index("by_scope_seq").getAll(Et(this.keyRange, s));
        i.onerror = () => p(at(i, "Queue sequence migration failed")), i.onsuccess = () => {
          const r = (i.result || []).reduce((t, e) => Math.max(t, e.seq || 0), 0);
          u(r);
        };
      }, m.oncomplete = () => _(d), m.onerror = () => p(m.error || new Error("Queue enqueue transaction failed")), m.onabort = () => p(m.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(s, b, y) {
    return this.open().then((_) => _ ? new Promise((p, m) => {
      const a = _.transaction(Y, "readwrite"), h = a.objectStore(Y), o = h.index("by_scope_seq").getAll(Et(this.keyRange, s)), d = this.now();
      let u = { entries: [], wakeups: [] };
      o.onerror = () => m(at(o, "Queue claim read failed")), o.onsuccess = () => {
        u = dn(o.result || [], b, y, d);
        for (const c of u.entries) h.put(c);
      }, a.oncomplete = () => p(u), a.onerror = () => m(a.error || new Error("Queue claim transaction failed")), a.onabort = () => m(a.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(s, b) {
    return this._updateEntry(s, b, (y, _) => (_.delete(y.entryId), { status: "acked", entry: y }));
  }
  nack(s, b, y, _) {
    _ = _ || {};
    const p = _.maxAttempts || 8, m = _.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((a) => a ? new Promise((h, o) => {
      const d = a.transaction([Y, nt], "readwrite"), u = d.objectStore(Y), c = d.objectStore(nt), g = u.get(b);
      let i = null;
      g.onerror = () => o(at(g, "Queue nack read failed")), g.onsuccess = () => {
        const r = g.result;
        if (!(!r || r.scope !== s)) {
          if (y === "drop") {
            u.delete(r.entryId), i = { status: "dropped", entry: r };
            return;
          }
          if (fe(r), r.updatedAt = this.now(), y === "auth") {
            r.status = "pending", u.put(r), c.put({ key: Mt(s), value: !0 }), i = { status: "auth", entry: r };
            return;
          }
          if (y === "retry") {
            if (r.attempts = (r.attempts || 0) + 1, r.attempts >= p) {
              r.status = "failed", r.nextAttemptAt = 0, u.put(r), i = { status: "failed", entry: r };
              return;
            }
            const t = m[Math.min(r.attempts - 1, m.length - 1)];
            r.status = "pending", r.nextAttemptAt = this.now() + t, u.put(r), i = { status: "retry", entry: r, delay: t };
          }
        }
      }, d.oncomplete = () => h(i), d.onerror = () => o(d.error || new Error("Queue nack transaction failed")), d.onabort = () => o(d.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(s, b, y) {
    return this._remapTransaction(s, null, b, y);
  }
  resolveCreate(s, b, y, _) {
    return this._remapTransaction(s, b, y, _);
  }
  _remapTransaction(s, b, y, _) {
    return this.open().then((p) => p ? new Promise((m, a) => {
      const h = p.transaction(Y, "readwrite"), o = h.objectStore(Y), d = o.index("by_scope_seq").getAll(Et(this.keyRange, s));
      let u = { changed: [], deleted: [] };
      d.onerror = () => a(at(d, "Queue remap read failed")), d.onsuccess = () => {
        u = un(d.result || [], b, y, _, this.now());
        for (const c of u.deleted) o.delete(c);
        for (const c of u.changed) o.put(c);
      }, h.oncomplete = () => m(u.changed), h.onerror = () => a(h.error || new Error("Queue remap transaction failed")), h.onabort = () => a(h.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(s) {
    return this.open().then((b) => b ? new Promise((y, _) => {
      const p = b.transaction(Y, "readwrite"), m = p.objectStore(Y), a = m.index("by_scope_seq").getAll(Et(this.keyRange, s));
      let h = 0;
      a.onerror = () => _(at(a, "Queue failed-entry read failed")), a.onsuccess = () => {
        for (const o of a.result || [])
          o.status === "failed" && (o.status = "pending", o.attempts = 0, o.nextAttemptAt = 0, o.updatedAt = this.now(), fe(o), m.put(o), h++);
      }, p.oncomplete = () => y(h), p.onerror = () => _(p.error || new Error("Queue failed-entry reset failed")), p.onabort = () => _(p.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(s) {
    return this.open().then((b) => b ? new Promise((y, _) => {
      const m = b.transaction(nt, "readonly").objectStore(nt).get(Mt(s));
      m.onsuccess = () => y(!!(m.result && m.result.value)), m.onerror = () => _(at(m, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(s, b) {
    return this.open().then((y) => {
      if (y)
        return new Promise((_, p) => {
          const m = y.transaction(nt, "readwrite");
          m.objectStore(nt).put({ key: Mt(s), value: !!b }), m.oncomplete = () => _(), m.onerror = () => p(m.error || new Error("Queue pause-state write failed")), m.onabort = () => p(m.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(s) {
    return this.open().then((b) => {
      if (b)
        return new Promise((y, _) => {
          const p = b.transaction([Y, nt], "readwrite"), a = p.objectStore(Y).index("by_scope_seq").openCursor(Et(this.keyRange, s));
          a.onsuccess = (h) => {
            const o = h.target.result;
            o && (o.delete(), o.continue());
          }, a.onerror = () => _(at(a, "Queue clear failed")), p.objectStore(nt).delete(he(s)), p.objectStore(nt).delete(Mt(s)), p.oncomplete = () => y(), p.onerror = () => _(p.error || new Error("Queue clear transaction failed")), p.onabort = () => _(p.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(s, b, y) {
    return this.open().then((_) => _ ? new Promise((p, m) => {
      const a = _.transaction(Y, "readwrite"), h = a.objectStore(Y), o = h.get(b);
      let d = null;
      o.onerror = () => m(at(o, "Queue entry read failed")), o.onsuccess = () => {
        const u = o.result;
        !u || u.scope !== s || (d = y(u, h));
      }, a.oncomplete = () => p(d), a.onerror = () => m(a.error || new Error("Queue entry transaction failed")), a.onabort = () => m(a.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const l = "data-ln-api-queue", s = "lnApiQueue", b = [2e3, 5e3, 15e3, 6e4, 3e5], y = 8, _ = 6e4;
  if (window[s] !== void 0) return;
  function p() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (d) => {
        const u = Math.random() * 16 | 0;
        return (d === "x" ? u : u & 3 | 8).toString(16);
      });
    }
  }
  const m = new hn({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: p
  });
  function a(o) {
    this.dom = o, o[s] = this;
    const d = o.closest("[data-ln-data-coordinator]");
    this.scope = o.id || (d ? d.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = p(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const u = this;
    return m.open().then((c) => c ? m.getPaused(u.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((c) => (u._paused = !!c, u._paused && L(u.dom, "ln-api-queue:paused", { reason: "auth", restored: !0 }), u._emitPendingCount())).then(() => u._drain()).catch((c) => {
      console.error("[ln-api-queue] Initialization failed:", c), L(u.dom, "ln-api-queue:error", { operation: "initialize", error: c });
    }), this;
  }
  a.prototype._isOnline = function() {
    const o = this.dom.getAttribute("data-ln-api-queue-online");
    return o === "true" ? !0 : o === "false" ? !1 : navigator.onLine;
  }, a.prototype._emitPendingCount = function() {
    const o = this;
    return m.allForScope(o.scope).then((d) => (L(o.dom, "ln-api-queue:pending-count", { count: d.length, scope: o.scope }), d.length === 0 && L(o.dom, "ln-api-queue:drained", { scope: o.scope }), d));
  }, a.prototype._clearTimer = function(o) {
    const d = this._timers.get(o);
    d && (clearTimeout(d), this._timers.delete(o));
  }, a.prototype._scheduleTimer = function(o, d) {
    const u = Math.max(0, d), c = this._timers.get(o);
    c && clearTimeout(c);
    const g = this, i = setTimeout(() => {
      g._timers.delete(o), g._drain();
    }, u);
    this._timers.set(o, i);
  }, a.prototype._drain = function() {
    const o = this;
    return o._paused || !o._isOnline() ? Promise.resolve() : (o._drainPromise || (o._drainPromise = m.claimReady(o.scope, o._workerId, _).then((d) => {
      for (const u of d.wakeups)
        o._scheduleTimer(u.chainKey, u.at - Date.now());
      for (const u of d.entries)
        o._clearTimer(u.chainKey), L(o.dom, "ln-api-queue:send", {
          entryId: u.entryId,
          chainKey: u.chainKey,
          op: u.op,
          targetId: u.targetId,
          payload: u.payload,
          expectedVersion: u.expectedVersion,
          idempotencyKey: u.entryId,
          meta: u.meta
        });
    }).catch((d) => {
      console.error("[ln-api-queue] Drain failed:", d), L(o.dom, "ln-api-queue:error", { operation: "drain", error: d });
    }).finally(() => {
      o._drainPromise = null;
    })), o._drainPromise);
  }, a.prototype._onEnqueue = function(o) {
    const d = this;
    return m.enqueue(d.scope, o.detail || {}).then((u) => {
      if (u)
        return d._emitPendingCount().then((c) => (L(d.dom, "ln-api-queue:enqueued", {
          entryId: u.entryId,
          chainKey: u.chainKey,
          count: c.length
        }), d._drain()));
    }).catch((u) => {
      L(d.dom, "ln-api-queue:error", { operation: "enqueue", error: u });
    });
  }, a.prototype._onAck = function(o) {
    const d = this, u = o.detail || {};
    return m.ack(d.scope, u.entryId).then(() => d._emitPendingCount()).then(() => d._drain()).catch((c) => {
      L(d.dom, "ln-api-queue:error", { operation: "ack", entryId: u.entryId, error: c });
    });
  }, a.prototype._onNack = function(o) {
    const d = this, u = o.detail || {};
    return m.nack(d.scope, u.entryId, u.reason, {
      maxAttempts: y,
      backoff: b
    }).then((c) => {
      if (c)
        return c.status === "failed" ? L(d.dom, "ln-api-queue:failed", {
          entryId: c.entry.entryId,
          chainKey: c.entry.chainKey,
          attempts: c.entry.attempts
        }) : c.status === "retry" ? d._scheduleTimer(c.entry.chainKey, c.delay) : c.status === "auth" && (d._paused = !0, L(d.dom, "ln-api-queue:paused", { reason: "auth" }), L(d.dom, "ln-api-queue:auth-required", {
          entryId: c.entry.entryId,
          chainKey: c.entry.chainKey
        })), d._emitPendingCount().then(() => {
          if (c.status === "dropped") return d._drain();
        });
    }).catch((c) => {
      L(d.dom, "ln-api-queue:error", { operation: "nack", entryId: u.entryId, error: c });
    });
  }, a.prototype._onRemap = function(o) {
    const d = this, u = o.detail || {};
    return m.remap(d.scope, u.oldKey, u.newId).catch((c) => {
      L(d.dom, "ln-api-queue:error", { operation: "remap", error: c });
    });
  }, a.prototype._onResolveCreate = function(o) {
    const d = this, u = o.detail || {};
    return m.resolveCreate(d.scope, u.entryId, u.oldKey, u.newId).then(() => d._emitPendingCount()).then(() => d._drain()).catch((c) => {
      L(d.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: u.entryId,
        error: c
      });
    });
  }, a.prototype._onResume = function() {
    const o = this;
    return m.setPaused(o.scope, !1).then(() => (o._paused = !1, L(o.dom, "ln-api-queue:resumed", {}), o._drain())).catch((d) => {
      L(o.dom, "ln-api-queue:error", { operation: "resume", error: d });
    });
  }, a.prototype._onDrain = function() {
    const o = this;
    return m.resetFailed(o.scope).then(() => {
      const d = o._drainPromise;
      return d ? d.then(() => o._drain()) : o._drain();
    }).catch((d) => {
      L(o.dom, "ln-api-queue:error", { operation: "manual-drain", error: d });
    });
  }, a.prototype._onClear = function() {
    const o = this;
    return o._timers.forEach((d) => clearTimeout(d)), o._timers.clear(), m.clear(o.scope).then(() => {
      o._paused = !1, L(o.dom, "ln-api-queue:pending-count", { count: 0, scope: o.scope }), L(o.dom, "ln-api-queue:drained", { scope: o.scope });
    }).catch((d) => {
      L(o.dom, "ln-api-queue:error", { operation: "clear", error: d });
    });
  }, a.prototype._bindEvents = function() {
    const o = this;
    o._handlers = {
      enqueue: (d) => o._onEnqueue(d),
      ack: (d) => o._onAck(d),
      nack: (d) => o._onNack(d),
      remap: (d) => o._onRemap(d),
      resolveCreate: (d) => o._onResolveCreate(d),
      resume: () => o._onResume(),
      drain: () => o._onDrain(),
      clear: () => o._onClear()
    }, o.dom.addEventListener("ln-api-queue:request-enqueue", o._handlers.enqueue), o.dom.addEventListener("ln-api-queue:ack", o._handlers.ack), o.dom.addEventListener("ln-api-queue:nack", o._handlers.nack), o.dom.addEventListener("ln-api-queue:request-remap", o._handlers.remap), o.dom.addEventListener("ln-api-queue:resolve-create", o._handlers.resolveCreate), o.dom.addEventListener("ln-api-queue:request-resume", o._handlers.resume), o.dom.addEventListener("ln-api-queue:request-drain", o._handlers.drain), o.dom.addEventListener("ln-api-queue:request-clear", o._handlers.clear);
  }, a.prototype.destroy = function() {
    if (!this.dom[s]) return;
    const o = this;
    o.dom.removeEventListener("ln-api-queue:request-enqueue", o._handlers.enqueue), o.dom.removeEventListener("ln-api-queue:ack", o._handlers.ack), o.dom.removeEventListener("ln-api-queue:nack", o._handlers.nack), o.dom.removeEventListener("ln-api-queue:request-remap", o._handlers.remap), o.dom.removeEventListener("ln-api-queue:resolve-create", o._handlers.resolveCreate), o.dom.removeEventListener("ln-api-queue:request-resume", o._handlers.resume), o.dom.removeEventListener("ln-api-queue:request-drain", o._handlers.drain), o.dom.removeEventListener("ln-api-queue:request-clear", o._handlers.clear), window.removeEventListener("online", o._onlineHandler), o._timers.forEach((d) => clearTimeout(d)), o._timers.clear(), L(o.dom, "ln-api-queue:destroyed", { scope: o.scope }), delete o.dom[s];
  };
  function h(o) {
    const d = o[s];
    d && d._drain();
  }
  U(l, s, a, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: h
  });
})();
function Fe(l) {
  if (l == null || l === "") return null;
  const s = Number(l);
  return Number.isFinite(s) ? s : null;
}
function At(l) {
  return String(Math.round(l * 1e3) / 1e3);
}
function fn(l, s, b) {
  const y = Fe(l);
  return y === null || y < 0 ? 0 : Math.min(y, Math.min(s, b) / 2);
}
function pn(l) {
  if (typeof l != "string") return null;
  const s = l.trim().split(/[\s,]+/).map(Number);
  return s.length !== 4 || s.some((b) => !Number.isFinite(b)) || s[2] <= 0 || s[3] <= 0 ? null : { x: s[0], y: s[1], width: s[2], height: s[3] };
}
function mn(l, s) {
  s = s || {};
  const b = s.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, y = s.xField || "label", _ = s.yField || "value", p = s.includeZero !== !1, m = fn(s.padding, b.width, b.height), a = Array.isArray(l) ? l : [], h = [];
  for (let x = 0; x < a.length; x++) {
    const D = a[x] || {}, k = Fe(D[_]);
    k !== null && h.push({
      record: D,
      sourceIndex: x,
      label: D[y] == null ? String(x + 1) : String(D[y]),
      value: k
    });
  }
  if (h.length === 0)
    return {
      points: [],
      linePoints: "",
      areaPoints: "",
      count: 0,
      min: null,
      max: null,
      domainMin: 0,
      domainMax: 1,
      baselineY: b.y + b.height - m
    };
  const o = h.map((x) => x.value), d = Math.min(...o), u = Math.max(...o);
  let c = p ? Math.min(0, d) : d, g = p ? Math.max(0, u) : u;
  if (c === g)
    if (c === 0)
      g = 1;
    else {
      const x = Math.max(Math.abs(c) * 0.1, 1);
      c -= x, g += x;
    }
  const i = b.x + m, r = b.y + m, t = Math.max(0, b.width - m * 2), e = Math.max(0, b.height - m * 2), n = h.length > 1 ? t / (h.length - 1) : 0, f = g - c, v = (x) => r + (g - x) / f * e, E = h.map((x, D) => ({
    ...x,
    x: h.length === 1 ? i + t / 2 : i + D * n,
    y: v(x.value)
  })), w = c <= 0 && g >= 0 ? 0 : c, A = v(w), S = E.map((x) => At(x.x) + "," + At(x.y)).join(" "), q = [
    At(E[0].x) + "," + At(A),
    S,
    At(E[E.length - 1].x) + "," + At(A)
  ].join(" ");
  return {
    points: E,
    linePoints: S,
    areaPoints: q,
    count: E.length,
    min: d,
    max: u,
    domainMin: c,
    domainMax: g,
    baselineY: A
  };
}
(function() {
  const l = "data-ln-chart", s = "lnChart", b = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[s] !== void 0) return;
  function y(a) {
    if (!a) return null;
    const h = a.split(":"), o = h[0].trim();
    return o ? {
      field: o,
      direction: h[1] && h[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
    } : null;
  }
  function _(a, h) {
    if (a == null || !Number.isFinite(a)) return "";
    try {
      return new Intl.NumberFormat($(h)).format(a);
    } catch {
      return String(a);
    }
  }
  function p(a, h) {
    a && (a.textContent = h);
  }
  function m(a) {
    this.dom = a, this.name = a.getAttribute(l) || "", this.source = a.getAttribute("data-ln-chart-source") || this.name, this.plot = a.querySelector("[data-ln-chart-plot]"), this.line = a.querySelector("[data-ln-chart-line]"), this.area = a.querySelector("[data-ln-chart-area]"), this.labels = a.querySelector("[data-ln-chart-labels]"), this.empty = a.querySelector("[data-ln-chart-empty]"), this.minimum = a.querySelector("[data-ln-chart-min]"), this.maximum = a.querySelector("[data-ln-chart-max]"), this.count = a.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const h = this;
    return this._onSetData = function(o) {
      const d = o.detail || {};
      h._data = Array.isArray(d.data) ? d.data : [], h.isLoaded = !0, h._setLoading(!1), h._render();
    }, this._onSetLoading = function(o) {
      h._setLoading(!!(o.detail && o.detail.loading));
    }, this._onRefresh = function() {
      h.requestData();
    }, a.addEventListener("ln-chart:set-data", this._onSetData), a.addEventListener("ln-chart:set-loading", this._onSetLoading), a.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  m.prototype._readOptions = function() {
    const a = this.dom.getAttribute("data-ln-chart-padding"), h = a === null ? NaN : Number(a), o = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(h) && h >= 0 ? h : 16,
      type: o === "area" || o === "polygon" ? "area" : "line",
      viewBox: this.plot && pn(this.plot.getAttribute("viewBox")) || b
    };
  }, m.prototype._setLoading = function(a) {
    this.dom.classList.toggle("ln-chart--loading", a), this.dom.setAttribute("aria-busy", a ? "true" : "false");
  }, m.prototype._renderLabels = function(a) {
    if (!this.labels || (this.labels.replaceChildren(), a.count === 0)) return;
    const h = this.name + "-label", o = '[data-ln-template="' + h + '"]';
    if (!this.dom.querySelector(o) && !document.querySelector(o)) return;
    const d = _t(this.dom, h, "ln-chart");
    if (d)
      for (const u of a.points) {
        const c = d.cloneNode(!0);
        Rt(c, {
          label: u.label,
          value: _(u.value, this.dom)
        }), this.labels.appendChild(c);
      }
  }, m.prototype._render = function() {
    const a = this._readOptions(), h = mn(this._data, a);
    this.model = h, this.line && (this.line.setAttribute("points", h.linePoints), this.line.toggleAttribute("hidden", h.count === 0)), this.area && (this.area.setAttribute("points", h.areaPoints), this.area.toggleAttribute("hidden", h.count === 0 || a.type !== "area"));
    const o = h.count === 0;
    this.dom.classList.toggle("ln-chart--empty", o), this.empty && this.empty.toggleAttribute("hidden", !o), p(this.minimum, _(h.min, this.dom)), p(this.maximum, _(h.max, this.dom)), p(this.count, _(h.count, this.dom)), this._renderLabels(h), L(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: h.count,
      min: h.min,
      max: h.max
    });
  }, m.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, L(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: y(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, m.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[s]);
  }, U(l, s, m, "ln-chart", {
    extraAttributes: [
      "data-ln-chart-source",
      "data-ln-chart-x",
      "data-ln-chart-y",
      "data-ln-chart-type",
      "data-ln-chart-padding",
      "data-ln-chart-zero",
      "data-ln-chart-sort"
    ],
    onAttributeChange: function(a, h) {
      const o = a[s];
      if (o) {
        if (h === "data-ln-chart-source" || h === "data-ln-chart-sort") {
          o.requestData();
          return;
        }
        o._render();
      }
    }
  });
})();
(function() {
  const l = "data-ln-options", s = "lnOptions";
  if (window[s] !== void 0) return;
  function b(y) {
    this.dom = y, this._storeName = y.getAttribute(l), this._valueField = y.getAttribute("data-ln-options-value") || "id", this._labelField = y.getAttribute("data-ln-options-label") || "name";
    const _ = this;
    return this._onSetData = function(p) {
      _._rebuild(p.detail.data || []);
    }, y.addEventListener("ln-options:set-data", this._onSetData), L(y, "ln-options:request-data", { options: this._storeName }), this;
  }
  b.prototype._rebuild = function(y) {
    const _ = this.dom, p = this._valueField, m = this._labelField, a = _.value, h = _.querySelectorAll("option");
    for (let d = h.length - 1; d >= 0; d--)
      h[d].value !== "" && _.removeChild(h[d]);
    for (let d = 0; d < y.length; d++) {
      const u = y[d], c = document.createElement("option");
      c.value = String(u[p]), c.textContent = u[m] != null ? u[m] : "", _.appendChild(c);
    }
    const o = _.options;
    for (let d = 0; d < o.length; d++)
      if (o[d].value === a) {
        _.value = a;
        break;
      }
  }, b.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[s]);
  }, U(l, s, b, "ln-options");
})();
(function() {
  const l = "data-ln-stat", s = "lnStat";
  if (window[s] !== void 0) return;
  function b(_) {
    if (!_) return null;
    const p = _.indexOf(":");
    if (p === -1) return null;
    const m = _.slice(0, p), a = _.slice(p + 1), h = {};
    return h[m] = [a], h;
  }
  function y(_) {
    return this.dom = _, this._storeName = _.getAttribute(l), this._filters = b(_.getAttribute("data-ln-stat-filter")), this._onSetCount = function(p) {
      _.textContent = String(p.detail.count), _.classList.remove("is-loading");
    }, _.addEventListener("ln-stat:set-count", this._onSetCount), L(_, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  y.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[s]);
  }, U(l, s, y, "ln-stat");
})();
(function() {
  const l = "ln-icon-sprite", s = "#ln-icon-", b = "#ln-icon-custom-", y = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set();
  let p = null;
  const m = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), a = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), h = "lni:", o = "lni:v", d = "1";
  function u() {
    try {
      if (localStorage.getItem(o) !== d) {
        for (let n = localStorage.length - 1; n >= 0; n--) {
          const f = localStorage.key(n);
          f && f.indexOf(h) === 0 && localStorage.removeItem(f);
        }
        localStorage.setItem(o, d);
      }
    } catch {
    }
  }
  u();
  function c() {
    return p || (p = document.getElementById(l), p || (p = document.createElementNS("http://www.w3.org/2000/svg", "svg"), p.id = l, p.setAttribute("hidden", ""), p.setAttribute("aria-hidden", "true"), p.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(p, document.body.firstChild))), p;
  }
  function g(n) {
    return n.indexOf(b) === 0 ? a + "/" + n.slice(b.length) + ".svg" : m + "/" + n.slice(s.length) + ".svg";
  }
  function i(n, f) {
    const v = f.match(/viewBox="([^"]+)"/), E = v ? v[1] : "0 0 24 24", w = f.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), A = w ? w[1].trim() : "", S = f.match(/<svg([^>]*)>/i), q = S ? S[1] : "", x = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    x.id = n, x.setAttribute("viewBox", E), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(D) {
      const k = q.match(new RegExp(D + '="([^"]*)"'));
      k && x.setAttribute(D, k[1]);
    }), x.innerHTML = A, c().querySelector("defs").appendChild(x);
  }
  function r(n) {
    if (y.has(n) || _.has(n)) return;
    if (n.indexOf(b) === 0 && !a) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", n);
      return;
    }
    const f = n.slice(1);
    try {
      const E = localStorage.getItem(h + f);
      if (E) {
        i(f, E), y.add(n);
        return;
      }
    } catch {
    }
    _.add(n);
    const v = g(n);
    fetch(v).then(function(E) {
      if (!E.ok) throw new Error(E.status);
      return E.text();
    }).then(function(E) {
      i(f, E), y.add(n), _.delete(n);
      try {
        localStorage.setItem(h + f, E);
      } catch {
      }
    }).catch(function(E) {
      console.error("[ln-icon] Fetch failed for:", f, E), _.delete(n);
    });
  }
  function t(n) {
    const f = 'use[href^="' + s + '"], use[href^="' + b + '"]', v = n.querySelectorAll ? n.querySelectorAll(f) : [];
    if (n.matches && n.matches(f)) {
      const E = n.getAttribute("href");
      E && r(E);
    }
    Array.prototype.forEach.call(v, function(E) {
      const w = E.getAttribute("href");
      w && r(w);
    });
  }
  function e() {
    t(document), new MutationObserver(function(n) {
      n.forEach(function(f) {
        if (f.type === "childList")
          f.addedNodes.forEach(function(v) {
            v.nodeType === 1 && t(v);
          });
        else if (f.type === "attributes" && f.attributeName === "href") {
          const v = f.target.getAttribute("href");
          v && (v.indexOf(s) === 0 || v.indexOf(b) === 0) && r(v);
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
  const l = "data-ln-debug", s = "lnDebug";
  if (window[s] !== void 0) return;
  function b(y) {
    return this.dom = y, this;
  }
  b.prototype.destroy = function() {
    delete this.dom[s];
  }, U(l, s, b, "ln-debug");
})();
