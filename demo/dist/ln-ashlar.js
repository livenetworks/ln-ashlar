if (typeof window < "u") {
  const c = console.warn;
  console.warn = function(...a) {
    typeof a[0] == "string" && (a[0].startsWith("[ln-") || a[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || c.apply(console, a);
  };
}
const Kt = {};
function Nt(c, a) {
  Kt[c] || (Kt[c] = document.querySelector('[data-ln-template="' + c + '"]'));
  const b = Kt[c];
  return b ? b.content.cloneNode(!0) : (console.warn("[" + (a || "ln-core") + '] Template "' + c + '" not found'), null);
}
function L(c, a, b) {
  c.dispatchEvent(new CustomEvent(a, {
    bubbles: !0,
    detail: b || {}
  }));
}
function X(c, a, b) {
  const y = new CustomEvent(a, {
    bubbles: !0,
    cancelable: !0,
    detail: b || {}
  });
  return c.dispatchEvent(y), y;
}
function pe(c, a, b) {
  c._applyFilterAndSort(), c._vStart = -1, c._vEnd = -1, c._render(), c._updateFooter();
  const y = {
    sort: c.currentSort,
    filters: c.currentFilters,
    search: c.currentSearch
  };
  y[b] = c.name, L(c.dom, a, y);
}
function lt(c, a) {
  if (!c || !a) return c;
  const b = c.querySelectorAll("[data-ln-field]");
  for (let f = 0; f < b.length; f++) {
    const o = b[f], l = o.getAttribute("data-ln-field");
    a[l] != null && (o.textContent = a[l]);
  }
  const y = c.querySelectorAll("[data-ln-attr]");
  for (let f = 0; f < y.length; f++) {
    const o = y[f], l = o.getAttribute("data-ln-attr").split(",");
    for (let s = 0; s < l.length; s++) {
      const d = l[s].trim().split(":");
      if (d.length !== 2) continue;
      const h = d[0].trim(), u = d[1].trim();
      a[u] != null && o.setAttribute(h, a[u]);
    }
  }
  const _ = c.querySelectorAll("[data-ln-show]");
  for (let f = 0; f < _.length; f++) {
    const o = _[f], l = o.getAttribute("data-ln-show");
    l in a && o.classList.toggle("hidden", !a[l]);
  }
  const m = c.querySelectorAll("[data-ln-class]");
  for (let f = 0; f < m.length; f++) {
    const o = m[f], l = o.getAttribute("data-ln-class").split(",");
    for (let s = 0; s < l.length; s++) {
      const d = l[s].trim().split(":");
      if (d.length !== 2) continue;
      const h = d[0].trim(), u = d[1].trim();
      u in a && o.classList.toggle(h, !!a[u]);
    }
  }
  return c;
}
function Pe(c, a) {
  c.matches && c.matches("[data-ln-form], [data-ln-fillable]") && c.dispatchEvent(new CustomEvent("ln-fill", { detail: a ?? null, bubbles: !0 }));
  const b = c.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let y = 0; y < b.length; y++)
    b[y].dispatchEvent(new CustomEvent("ln-fill", { detail: a ?? null, bubbles: !0 }));
  return c;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(c) {
  if (!(!c.target.matches || !c.target.matches("[data-ln-fillable]")))
    if (c.detail)
      lt(c.target, c.detail);
    else {
      const a = c.target.querySelectorAll("[data-ln-field]");
      for (let b = 0; b < a.length; b++)
        a[b].textContent = "";
    }
})));
function Rt(c, a) {
  if (!c || !a) return c;
  const b = document.createTreeWalker(c, NodeFilter.SHOW_TEXT);
  for (; b.nextNode(); ) {
    const m = b.currentNode;
    m.textContent.indexOf("{{") !== -1 && (m.textContent = m.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(f, o) {
        return a[o] !== void 0 ? a[o] : "";
      }
    ));
  }
  const y = function(m, f) {
    return a[f] !== void 0 ? a[f] : "";
  }, _ = Array.from(c.querySelectorAll("*"));
  c.nodeType === 1 && _.push(c);
  for (let m = 0; m < _.length; m++) {
    const f = _[m], o = f.attributes;
    for (let l = 0; l < o.length; l++) {
      const s = o[l];
      s.value.indexOf("{{") !== -1 && f.setAttribute(s.name, s.value.replace(/\{\{\s*(\w+)\s*\}\}/g, y));
    }
  }
  return c;
}
function He(c, a, b, y, _, m) {
  const f = {};
  for (let l = 0; l < c.children.length; l++) {
    const s = c.children[l], d = s.getAttribute("data-ln-key");
    d && (f[d] = s);
  }
  const o = document.createDocumentFragment();
  for (let l = 0; l < a.length; l++) {
    const s = a[l], d = String(y(s));
    let h = f[d];
    if (h)
      _(h, s, l);
    else {
      const u = Nt(b, m);
      if (!u || (Rt(u, s), h = u.firstElementChild, !h)) continue;
      h.setAttribute("data-ln-key", d), _(h, s, l);
    }
    o.appendChild(h);
  }
  c.textContent = "", c.appendChild(o);
}
function ft(c, a) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      ft(c, a);
    }), console.warn("[" + a + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  c();
}
function _t(c, a, b) {
  if (c) {
    const y = c.querySelector('[data-ln-template="' + a + '"]');
    if (y) return y.content.cloneNode(!0);
  }
  return Nt(a, b);
}
function te(c, a) {
  const b = {}, y = c.querySelectorAll("[" + a + "]");
  for (let _ = 0; _ < y.length; _++)
    b[y[_].getAttribute(a)] = y[_].textContent, y[_].remove();
  return b;
}
function jt(c, a, b, y) {
  if (c.nodeType !== 1) return;
  const m = a.indexOf("[") !== -1 || a.indexOf(".") !== -1 || a.indexOf("#") !== -1 ? a : "[" + a + "]", f = Array.from(c.querySelectorAll(m));
  c.matches && c.matches(m) && f.push(c);
  for (const o of f)
    o[b] || (o[b] = new y(o));
}
function Ft(c) {
  return !!(c.offsetWidth || c.offsetHeight || c.getClientRects().length);
}
function Be(c) {
  const a = c.querySelector('input[name="_method"]');
  return ((a && a.value !== "" ? a.value : c.method) || "").toUpperCase();
}
function me(c, a) {
  const b = !!(a && a.typed), y = a && a.exclude, _ = {}, m = c.elements, f = {};
  if (b)
    for (let o = 0; o < m.length; o++) {
      const l = m[o];
      l.name && l.type === "checkbox" && !l.disabled && (f[l.name] = (f[l.name] || 0) + 1);
    }
  for (let o = 0; o < m.length; o++) {
    const l = m[o];
    if (!(!l.name || l.disabled || l.type === "file" || l.type === "submit" || l.type === "button") && !(y && l.matches && l.matches(y)))
      if (l.type === "checkbox")
        b && f[l.name] === 1 ? _[l.name] = l.checked : (_[l.name] || (_[l.name] = []), l.checked && _[l.name].push(l.value));
      else if (l.type === "radio")
        l.checked && (_[l.name] = l.value);
      else if (l.type === "select-multiple") {
        _[l.name] = [];
        for (let s = 0; s < l.options.length; s++)
          l.options[s].selected && _[l.name].push(l.options[s].value);
      } else if (b && l.type === "hidden")
        _[l.name] = l.value;
      else if (b && (l.type === "number" || l.type === "range")) {
        const s = Number(l.value);
        _[l.name] = l.value === "" || isNaN(s) ? null : s;
      } else
        _[l.name] = l.value;
  }
  return _;
}
function Ue(c) {
  if (typeof c != "string") return !!c;
  const a = c.trim().toLowerCase();
  return a !== "false" && a !== "0" && a !== "" && a !== "off" && a !== "no";
}
function ge(c, a) {
  const b = c.elements, y = [], _ = {};
  for (let m = 0; m < b.length; m++) {
    const f = b[m];
    f.name && f.type === "checkbox" && (_[f.name] = (_[f.name] || 0) + 1);
  }
  for (let m = 0; m < b.length; m++) {
    const f = b[m];
    if (f.type === "file" || f.type === "submit" || f.type === "button") continue;
    const o = f.getAttribute("data-ln-fill-as") || f.name;
    if (!o || !(o in a)) continue;
    const l = a[o];
    if (f.type === "checkbox") {
      if (Array.isArray(l))
        f.checked = l.indexOf(f.value) !== -1;
      else if (_[f.name] > 1) {
        const s = String(l).split(",").map(function(d) {
          return d.trim();
        });
        f.checked = s.indexOf(f.value) !== -1;
      } else
        f.checked = Ue(l);
      y.push(f);
    } else if (f.type === "radio")
      f.checked = f.value === String(l), y.push(f);
    else if (f.type === "select-multiple") {
      if (Array.isArray(l))
        for (let s = 0; s < f.options.length; s++)
          f.options[s].selected = l.indexOf(f.options[s].value) !== -1;
      y.push(f);
    } else
      f.value = l, y.push(f);
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
function $(c) {
  const a = c ? c.closest("[lang]") : null, b = (a ? a.getAttribute("lang") || a.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!b) return "en-US";
  const y = b.trim().toLowerCase();
  return y.indexOf("-") === -1 && se[y] ? se[y] : b;
}
function Ct(c) {
  return c.hasAttribute("data-ln-value") ? c.getAttribute("data-ln-value") : c.textContent.trim();
}
function xt(c) {
  let a = !1;
  for (let b = 0; b < c.length; b++) {
    const y = c[b];
    if (!(y === "" || y == null) && (a = !0, !Number.isFinite(Number(y))))
      return "string";
  }
  return a ? "number" : "string";
}
function kt(c, a, b, y) {
  if (b === "number") {
    const f = parseFloat(c), o = parseFloat(a);
    return (isNaN(f) ? 0 : f) - (isNaN(o) ? 0 : o);
  }
  const _ = c != null ? String(c) : "", m = a != null ? String(a) : "";
  return y ? y.compare(_, m) : _ < m ? -1 : _ > m ? 1 : 0;
}
function _e(c, a, { get: b, set: y }) {
  Object.defineProperty(c, "value", {
    get: function() {
      return b ? b.call(this) : a.get.call(this);
    },
    set: function(_) {
      y ? y.call(this, _, (m) => a.set.call(this, m)) : a.set.call(this, _);
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
    const c = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let a = 0; a < c.length; a++)
      c[a]();
  }
}
function Ke() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function ct(c) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(c) : setTimeout(c, 0)) : c();
}
function z(c, a, b, y, _ = {}) {
  const m = _.extraAttributes || [], f = _.onAttributeChange || null, o = _.onInit || null;
  function l(d) {
    const h = d || document.body;
    jt(h, c, a, b), o && o(h);
  }
  ft(function() {
    const d = new MutationObserver(function(u) {
      for (let g = 0; g < u.length; g++) {
        const i = u[g];
        if (i.type === "childList") {
          for (let r = 0; r < i.addedNodes.length; r++) {
            const t = i.addedNodes[r];
            t.nodeType === 1 && (jt(t, c, a, b), o && o(t));
          }
          for (let r = 0; r < i.removedNodes.length; r++) {
            const t = i.removedNodes[r];
            if (t.nodeType === 1) {
              const n = c.indexOf("[") !== -1 || c.indexOf(".") !== -1 || c.indexOf("#") !== -1 ? c : "[" + c + "]", p = Array.from(t.querySelectorAll(n));
              t.matches && t.matches(n) && p.push(t);
              for (let v = 0; v < p.length; v++) {
                const E = p[v];
                if (!document.contains(E)) {
                  const w = E[a];
                  w && typeof w.destroy == "function" && w.destroy();
                }
              }
            }
          }
        } else i.type === "attributes" && (f && i.target[a] ? f(i.target, i.attributeName) : (jt(i.target, c, a, b), o && o(i.target)));
      }
    });
    let h = [];
    if (c.indexOf("[") !== -1) {
      const u = /\[([\w-]+)/g;
      let g;
      for (; (g = u.exec(c)) !== null; )
        h.push(g[1]);
    } else
      h.push(c);
    d.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: h.concat(m)
    });
  }, y || (c.indexOf("[") === -1 ? c.replace("data-", "") : "component")), window[a] = l;
  function s() {
    Ke() > 0 ? ct(function() {
      l(document.body);
    }) : l(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", s) : s(), l;
}
function be(c, a) {
  if (c.ctrlKey || c.metaKey || c.shiftKey || c.altKey || c.button !== 0 || !a) return !1;
  const b = a.getAttribute("href");
  return !(!b || a.getAttribute("target") === "_blank" || a.hasAttribute("download") || b.startsWith("mailto:") || b.startsWith("tel:") || b === "#" || b.startsWith("#") || a.hostname && a.hostname !== window.location.hostname);
}
function tt(...c) {
  return c.filter((a) => a != null && a !== "").map((a, b) => b === 0 ? a.replace(/\/+$/, "") : a.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function St(c, a) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, c, a ? { Authorization: a } : null);
}
function ye(c, a = "ln-core") {
  try {
    return c ? JSON.parse(c) : {};
  } catch (b) {
    return console.error(`[${a}] Invalid headers JSON:`, b), {};
  }
}
const ve = {};
function je(c, a) {
  ve[c] = a;
}
function Ve(c) {
  return ve[c] || { ingress: (a) => a, egress: (a) => a };
}
const we = {};
function ee(c, a) {
  if (!c || typeof a != "object") return;
  const b = c.toLowerCase().split("-")[0];
  we[b] = a;
}
function It(c) {
  if (!c) return null;
  const a = c.toLowerCase().split("-")[0];
  return we[a] || null;
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = je, window.lnCore.getDataMapper = Ve, window.lnCore.registerLocaleFallback = ee, window.lnCore.getLocaleFallback = It, window.lnCore.fillTemplate = Rt, window.lnCore.fill = lt, window.lnCore.lnFill = Pe, window.lnCore.renderList = He);
function ne(c, a) {
  let b = !1;
  return function() {
    b || (b = !0, queueMicrotask(function() {
      b = !1, c();
    }));
  };
}
function Ee(c) {
  c = c || {};
  let a = c.windowSize > 0 ? c.windowSize : 1e3, b = c.pageSize > 0 ? c.pageSize : 200, y = c.threshold != null ? c.threshold : 25, _ = c.fetchDebounce != null ? c.fetchDebounce : 120;
  const m = typeof c.requestPage == "function" ? c.requestPage : function() {
  }, f = typeof c.onChange == "function" ? c.onChange : function() {
  }, o = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
  let d = 0, h = 0, u = 0, g = { sort: null, filters: {}, search: "" }, i = null, r = 0, t = 0, e = !1;
  function n(w) {
    l.set(w, ++r);
  }
  function p() {
    return !!(g && (g.search || g.filters && Object.keys(g.filters).length));
  }
  function v() {
    if (o.size <= a) return;
    const w = Array.from(o.keys()).sort(function(S, T) {
      return (l.get(S) || 0) - (l.get(T) || 0);
    });
    let A = 0;
    for (; o.size > a && A < w.length; )
      o.delete(w[A]), l.delete(w[A]), A++;
  }
  function E(w, A) {
    s.add(w), m(g, w, A);
  }
  return {
    get: function(w) {
      return o.get(w);
    },
    has: function(w) {
      return o.has(w);
    },
    peek: function() {
      return o.size ? o.values().next().value : void 0;
    },
    get logicalTotal() {
      return d;
    },
    get grandTotal() {
      return h;
    },
    get queryGen() {
      return u;
    },
    get size() {
      return o.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(w, A) {
      clearTimeout(i), t = w;
      for (let R = w; R < A; R++)
        o.has(R) && n(R);
      if (d <= 0) return;
      const S = Math.max(0, w - y), T = Math.min(d, A + y), x = Math.floor(S / b), I = Math.floor(Math.max(0, T - 1) / b);
      let k = -1;
      for (let R = x; R <= I; R++) {
        const N = R * b, K = Math.min(b, d - N);
        let P = !1;
        const U = Math.max(N, S), j = Math.min(N + K, T);
        for (let et = U; et < j; et++)
          if (!o.has(et)) {
            P = !0;
            break;
          }
        if (P && !s.has(N)) {
          k = N;
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
      if (w = w || {}, w.queryGen != null && w.queryGen !== u) return;
      e && (o.clear(), l.clear(), e = !1), h = w.total != null ? w.total : h, d = w.filtered != null ? w.filtered : w.data ? w.data.length : d;
      const A = w.offset || 0, S = w.data || [];
      for (let T = 0; T < S.length; T++)
        S[T] != null && (o.set(A + T, S[T]), n(A + T));
      s.delete(A), v(), f();
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(w) {
      w && (g = w), E(0, b);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(w) {
      u++, s.clear(), clearTimeout(i), w && (g = w), e = !0, E(0, b);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      u++, s.clear(), clearTimeout(i), e = !0;
      const w = Math.max(0, Math.floor(t / b) * b);
      E(w, b);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(w) {
      s.delete(w);
    },
    destroy: function() {
      clearTimeout(i), o.clear(), l.clear(), s.clear();
    },
    configure: function(w) {
      w = w || {};
      let A = !1;
      if (w.windowSize != null && w.windowSize > 0 && w.windowSize !== a) {
        const S = w.windowSize < a;
        a = w.windowSize, S && v(), A = !0;
      }
      w.pageSize != null && w.pageSize > 0 && (b = w.pageSize), w.threshold != null && w.threshold >= 0 && (y = w.threshold), w.fetchDebounce != null && w.fetchDebounce >= 0 && (_ = w.fetchDebounce), A && f();
    },
    setGrandTotal: function(w) {
      w == null || isNaN(w) || w < 0 || (h = w, p() || (d = w), f());
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
    const c = "__ln_test__";
    localStorage.setItem(c, c), localStorage.removeItem(c), wt = !0;
  } catch {
    wt = !1;
  }
  return wt;
}
function Ge() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function Se(c, a) {
  const b = a.getAttribute("data-ln-persist"), y = b !== null && b !== "" ? b : a.id;
  return y ? We + c + ":" + Ge() + ":" + y : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', a), null);
}
function Bt(c, a) {
  if (!Ae()) return null;
  const b = Se(c, a);
  if (!b) return null;
  try {
    const y = localStorage.getItem(b);
    return y !== null ? JSON.parse(y) : null;
  } catch {
    return null;
  }
}
function yt(c, a, b) {
  if (!Ae()) return;
  const y = Se(c, a);
  if (y)
    try {
      b == null ? localStorage.removeItem(y) : localStorage.setItem(y, JSON.stringify(b));
    } catch {
    }
}
function Ce(c) {
  return (c || "").replace(/^#/, "");
}
function Ut(c) {
  const a = c === void 0 ? location.hash : c, b = {}, y = Ce(a);
  if (!y) return b;
  const _ = y.split("&");
  for (let m = 0; m < _.length; m++) {
    const f = _[m];
    if (!f) continue;
    const o = f.indexOf(":"), l = o > -1 ? f.slice(0, o) : f, s = o > -1 ? f.slice(o + 1) : "";
    if (l)
      try {
        b[l] = decodeURIComponent(s);
      } catch {
        b[l] = s;
      }
  }
  return b;
}
function rt(c) {
  if (!c) return null;
  const a = Ut();
  return c in a ? a[c] : null;
}
function it(c, a) {
  if (!c) return;
  const b = Ut();
  a == null ? delete b[c] : b[c] = String(a);
  const _ = Object.keys(b).map(function(m) {
    const f = b[m];
    return f === "" ? m : m + ":" + encodeURIComponent(f);
  }).join("&");
  Ce(location.hash) !== _ && (location.hash = _);
}
function ie(c) {
  return c.button === 1 || c.ctrlKey || c.metaKey || c.shiftKey ? !1 : (c.preventDefault(), !0);
}
function vt(c, a) {
  if (!c || !c.hasAttribute("data-ln-hash")) return null;
  const b = c.getAttribute("data-ln-hash");
  if (b && b.trim() !== "") return b.trim();
  const y = c.getAttribute("data-ln-sort") || c.getAttribute("data-ln-search-for") || c.getAttribute("data-ln-search") || c.getAttribute("data-ln-filter") || c.id;
  return y ? a ? y + "-" + a : y : a || null;
}
function Le(c, a) {
  return !a || a === "none" || c === null || c === void 0 ? null : String(c) + "." + a;
}
function Gt(c) {
  return !c || typeof c != "string" ? null : c.endsWith(".asc") ? { fieldOrColumn: c.slice(0, -4), direction: "asc" } : c.endsWith(".desc") ? { fieldOrColumn: c.slice(0, -5), direction: "desc" } : null;
}
function Te(c, a) {
  return !c || !Array.isArray(a) || a.length === 0 ? null : c + ":" + a.map(encodeURIComponent).join(",");
}
function Qt(c) {
  if (!c || typeof c != "string") return null;
  const a = c.indexOf(":");
  if (a === -1) return null;
  const b = c.slice(0, a), y = c.slice(a + 1), _ = y ? y.split(",").map(function(m) {
    try {
      return decodeURIComponent(m);
    } catch {
      return m;
    }
  }).filter(Boolean) : [];
  return { key: b, values: _ };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Ut, window.lnCore.hashGet = rt, window.lnCore.hashSet = it, window.lnCore.hashLinkClick = ie, window.lnCore.resolveHashNamespace = vt, window.lnCore.hashSortEncode = Le, window.lnCore.hashSortDecode = Gt, window.lnCore.hashFilterEncode = Te, window.lnCore.hashFilterDecode = Qt);
function Pt(c, a, b, y) {
  const _ = typeof y == "number" ? y : 4, m = window.innerWidth, f = window.innerHeight, o = a.width, l = a.height, s = (b || "bottom").split("-"), d = s[0], h = s[1] === "start" || s[1] === "end" ? s[1] : "center", u = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, g = u[d] || u.bottom;
  function i(p) {
    return p === "top" || p === "bottom" ? h === "start" ? c.left : h === "end" ? c.right - o : c.left + (c.width - o) / 2 : h === "start" ? c.top : h === "end" ? c.bottom - l : c.top + (c.height - l) / 2;
  }
  function r(p) {
    let v, E, w = !0;
    return p === "top" ? (v = c.top - _ - l, E = i(p), v < 0 && (w = !1)) : p === "bottom" ? (v = c.bottom + _, E = i(p), v + l > f && (w = !1)) : p === "left" ? (v = i(p), E = c.left - _ - o, E < 0 && (w = !1)) : (v = i(p), E = c.right + _, E + o > m && (w = !1)), { top: v, left: E, side: p, fits: w };
  }
  let t = null;
  for (let p = 0; p < g.length; p++) {
    const v = r(g[p]);
    if (v.fits) {
      t = v;
      break;
    }
  }
  t || (t = r(g[0]));
  let e = t.top, n = t.left;
  return o >= m ? n = 0 : (n < 0 && (n = 0), n + o > m && (n = m - o)), l >= f ? e = 0 : (e < 0 && (e = 0), e + l > f && (e = f - l)), { top: e, left: n, placement: t.side };
}
function $t(c) {
  if (!c) return { width: 0, height: 0 };
  const a = c.style, b = a.visibility, y = a.display, _ = a.position;
  a.visibility = "hidden", a.display = "block", a.position = "fixed";
  const m = c.offsetWidth, f = c.offsetHeight;
  return a.visibility = b, a.display = y, a.position = _, { width: m, height: f };
}
let gt = null;
async function ae(c) {
  if (!c) {
    gt = null;
    return;
  }
  try {
    const a = new TextEncoder(), b = await crypto.subtle.digest("SHA-256", a.encode(c));
    gt = await crypto.subtle.importKey(
      "raw",
      b,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (a) {
    console.error("[ln-core/crypto] Key derivation failed:", a), gt = null;
  }
}
function bt() {
  return gt;
}
async function Qe(c, a = gt) {
  const b = a || gt;
  if (!b || c === void 0 || c === null) return c;
  try {
    const y = new TextEncoder(), _ = crypto.getRandomValues(new Uint8Array(12)), m = typeof c == "string" ? c : JSON.stringify(c), f = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: _ },
      b,
      y.encode(m)
    ), o = btoa(String.fromCharCode(..._)), l = btoa(String.fromCharCode(...new Uint8Array(f)));
    return {
      encrypted: !0,
      iv: o,
      data: l
    };
  } catch (y) {
    return console.error("[ln-core/crypto] Encryption failed:", y), c;
  }
}
async function $e(c, a = gt) {
  const b = a || gt;
  if (!c || !c.encrypted || !b) return c;
  try {
    const y = new TextDecoder(), _ = Uint8Array.from(atob(c.iv), (l) => l.charCodeAt(0)), m = Uint8Array.from(atob(c.data), (l) => l.charCodeAt(0)), f = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: _ },
      b,
      m
    ), o = y.decode(f);
    try {
      return JSON.parse(o);
    } catch {
      return o;
    }
  } catch (y) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", y), { ...c, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const c = window.fetch.bind(window), a = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
  function y(s) {
    return typeof s == "string" ? s : s instanceof URL ? s.href : s instanceof Request ? s.url : String(s);
  }
  function _(s, d) {
    return d && d.method ? String(d.method).toUpperCase() : s instanceof Request ? s.method.toUpperCase() : "GET";
  }
  function m(s, d) {
    return d + " " + s;
  }
  function f(s) {
    return s === "GET" || s === "HEAD";
  }
  function o(s, d) {
    d = d || {};
    const h = y(s), u = _(s, d), g = m(h, u);
    f(u) && a.has(g) && (a.get(g).abort(), a.delete(g));
    const i = new AbortController(), r = d.signal;
    let t = null;
    r && (r.aborted ? i.abort(r.reason) : (t = function() {
      i.abort(r.reason);
    }, r.addEventListener("abort", t, { once: !0 })));
    const e = Object.assign({}, d, { signal: i.signal });
    return a.set(g, i), c(s, e).finally(function() {
      r && t && r.removeEventListener("abort", t), a.get(g) === i && a.delete(g);
    });
  }
  o.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = o;
  function l(s) {
    if (!s.detail || !s.detail.url) return;
    const d = s.target, h = (s.detail.method || (s.detail.body ? "POST" : "GET")).toUpperCase(), u = s.detail.key;
    u && b.has(u) && (b.get(u).abort(), b.delete(u));
    const g = new AbortController(), i = s.detail.signal;
    let r = null;
    i && (i.aborted ? g.abort(i.reason) : (r = function() {
      g.abort(i.reason);
    }, i.addEventListener("abort", r, { once: !0 }))), u && b.set(u, g);
    const t = { method: h, signal: g.signal };
    s.detail.body !== void 0 && (t.body = s.detail.body), window.fetch(s.detail.url, t).then(function(e) {
      i && r && i.removeEventListener("abort", r), u && b.get(u) === g && b.delete(u), L(d, "ln-http:response", {
        ok: e.ok,
        status: e.status,
        response: e
      });
    }).catch(function(e) {
      i && r && i.removeEventListener("abort", r), u && b.get(u) === g && b.delete(u), !(e && e.name === "AbortError") && L(d, "ln-http:error", {
        ok: !1,
        status: 0,
        error: e
      });
    });
  }
  document.addEventListener("ln-http:request", l), window.lnHttp = {
    cancel: function(s) {
      let d = !1;
      return a.forEach(function(h, u) {
        u.endsWith(" " + s) && (h.abort(), a.delete(u), d = !0);
      }), d;
    },
    cancelByKey: function(s) {
      return b.has(s) ? (b.get(s).abort(), b.delete(s), !0) : !1;
    },
    cancelAll: function() {
      a.forEach(function(s) {
        s.abort();
      }), a.clear(), b.forEach(function(s) {
        s.abort();
      }), b.clear();
    },
    get inflight() {
      const s = [];
      return a.forEach(function(d, h) {
        const u = h.indexOf(" ");
        s.push({ method: h.slice(0, u), url: h.slice(u + 1) });
      }), b.forEach(function(d, h) {
        s.push({ key: h });
      }), s;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", l), window.fetch = c, delete window.lnHttp;
    }
  };
})();
(function() {
  const c = "template[data-ln-include]", a = "lnInclude";
  if (window[a] !== void 0) return;
  const b = /* @__PURE__ */ new Map();
  function y(_) {
    if (this.dom = _, this.url = _.getAttribute("data-ln-include"), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    ze(), this._held = !0;
    const m = this, f = this.url;
    let o = b.get(f);
    return o || (o = fetch(f).then(function(l) {
      if (!l.ok)
        throw new Error("HTTP error! status: " + l.status);
      return l.text();
    }).catch(function(l) {
      throw b.delete(f), l;
    }), b.set(f, o)), o.then(function(l) {
      if (m._destroyed) return;
      const s = document.createElement("template");
      s.innerHTML = l, m.dom.content.appendChild(s.content), L(m.dom, "ln-include:loaded", { target: m.dom, url: m.url }), m._held && (m._held = !1, Vt());
    }).catch(function(l) {
      m._destroyed || (console.error("[ln-include] Failed to fetch template from " + m.url + ":", l), L(m.dom, "ln-include:error", { target: m.dom, url: m.url, error: l }), m._held && (m._held = !1, Vt()));
    }), this;
  }
  y.prototype.destroy = function() {
    this.dom[a] && (this._destroyed = !0, this._held && (this._held = !1, Vt()), delete this.dom[a]);
  }, z(c, a, y, "ln-include");
})();
(function() {
  const c = "data-ln-form", a = "lnForm", b = "data-ln-form-action-edit", y = "data-ln-form-action-method";
  if (window[a] !== void 0) return;
  function _(m) {
    this.dom = m, this._baseAction = m.getAttribute("action") || "";
    const f = this;
    return this._onLnFill = function(o) {
      o.target === f.dom && (o.detail ? (f.fill(o.detail), f._applyActionMode(o.detail)) : f.dom.reset());
    }, this._onReset = function() {
      f._applyActionMode(null);
    }, m.addEventListener("ln-fill", this._onLnFill), m.addEventListener("reset", this._onReset), this;
  }
  _.prototype.fill = function(m) {
    const f = ge(this.dom, m);
    for (let o = 0; o < f.length; o++) {
      const l = f[o], s = l.tagName === "SELECT" || l.type === "checkbox" || l.type === "radio";
      l.dispatchEvent(new Event(s ? "change" : "input", { bubbles: !0 }));
    }
  }, _.prototype._ensureMethodInput = function() {
    let m = this.dom.querySelector('input[name="_method"]');
    return m || (m = document.createElement("input"), m.type = "hidden", m.name = "_method", m.value = "", this.dom.appendChild(m)), m;
  }, _.prototype._applyActionMode = function(m) {
    if (!this.dom.hasAttribute(b)) return;
    const f = m && m.id != null && m.id !== "" ? m.id : null, o = this._ensureMethodInput();
    if (f !== null) {
      const l = this.dom.getAttribute(b);
      l ? this.dom.setAttribute("action", l.replace(":id", encodeURIComponent(f))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(f)), o.value = this.dom.getAttribute(y) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), o.value = "";
  }, _.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), L(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[a]);
  }, z(c, a, _, "ln-form");
})();
(function() {
  const c = "data-ln-validate", a = "lnValidate", b = "data-ln-validate-errors", y = "data-ln-validate-error", _ = "ln-validate-valid", m = "ln-validate-invalid", f = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[a] !== void 0) return;
  function o(l) {
    this.dom = l, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const s = this, d = l.tagName, h = l.type, u = d === "SELECT" || h === "checkbox" || h === "radio";
    this._onInput = function() {
      s._touched = !0, s.validate();
    }, this._onChange = function() {
      s._touched = !0, s.validate();
    }, this._onSetCustom = function(i) {
      const r = i.detail && i.detail.error;
      if (!r) return;
      s._customErrors.add(r), s._touched = !0;
      const t = l.closest(".form-element");
      if (t) {
        const e = t.querySelector("[" + y + '="' + r + '"]');
        e && e.classList.remove("hidden");
      }
      l.classList.remove(_), l.classList.add(m), l.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(i) {
      const r = i.detail && i.detail.error, t = l.closest(".form-element");
      if (r) {
        if (s._customErrors.delete(r), t) {
          const e = t.querySelector("[" + y + '="' + r + '"]');
          e && e.classList.add("hidden");
        }
      } else
        s._customErrors.forEach(function(e) {
          if (t) {
            const n = t.querySelector("[" + y + '="' + e + '"]');
            n && n.classList.add("hidden");
          }
        }), s._customErrors.clear();
      s._touched && s.validate();
    }, u || l.addEventListener("input", this._onInput), l.addEventListener("change", this._onChange), l.addEventListener("ln-validate:set-custom", this._onSetCustom), l.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const g = l.form;
    return g && (g.hasAttribute("novalidate") || g.setAttribute("novalidate", ""), this._onFormReset = function() {
      s.reset();
    }, this._onValidateRequest = function(i) {
      s._touched = !0, !s.validate() && i.detail && i.detail.invalidFields && i.detail.invalidFields.push(s.dom);
    }, g.addEventListener("reset", this._onFormReset), g.addEventListener("ln-validate:request-validate", this._onValidateRequest), g._lnValidateGateBound || (g._lnValidateGateBound = !0, g.addEventListener("submit", function(i) {
      const r = { invalidFields: [] };
      L(g, "ln-validate:request-validate", r), r.invalidFields.length > 0 && (i.preventDefault(), r.invalidFields.sort((t, e) => t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), r.invalidFields[0].focus());
    }))), this;
  }
  o.prototype.validate = function() {
    const l = this.dom, s = l.validity, h = l.checkValidity() && this._customErrors.size === 0, u = l.closest(".form-element");
    if (u) {
      const i = u.querySelector("[" + b + "]");
      if (i) {
        const r = i.querySelectorAll("[" + y + "]");
        for (let t = 0; t < r.length; t++) {
          const e = r[t].getAttribute(y), n = f[e];
          n && (s[n] ? r[t].classList.remove("hidden") : r[t].classList.add("hidden"));
        }
      }
    }
    return l.classList.toggle(_, h), l.classList.toggle(m, !h), l.setAttribute("aria-invalid", h ? "false" : "true"), L(l, h ? "ln-validate:valid" : "ln-validate:invalid", { target: l, field: l.name }), h;
  }, o.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(_, m), this.dom.removeAttribute("aria-invalid");
    const l = this.dom.closest(".form-element");
    if (l) {
      const s = l.querySelectorAll("[" + y + "]");
      for (let d = 0; d < s.length; d++)
        s[d].classList.add("hidden");
    }
  }, Object.defineProperty(o.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), o.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const l = this.dom.form;
    l && (this._onFormReset && l.removeEventListener("reset", this._onFormReset), this._onValidateRequest && l.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(_, m), this.dom.removeAttribute("aria-invalid"), L(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[a];
  }, z(c, a, o, "ln-validate");
})();
(function() {
  const c = "data-ln-ajax", a = "lnAjax", b = "data-ln-form-scope";
  if (window[a] !== void 0) return;
  function y(h) {
    if (!h.hasAttribute(c) || h[a]) return;
    h[a] = !0;
    const u = l(h);
    _(u.links), m(u.forms);
  }
  function _(h) {
    for (const u of h) {
      if (u[a + "Trigger"] || u.hostname && u.hostname !== window.location.hostname) continue;
      const g = u.getAttribute("href");
      if (g && g.includes("#")) continue;
      const i = function(r) {
        if (!be(r, u)) return;
        r.preventDefault();
        const t = u.getAttribute("href");
        t && o("GET", t, null, u);
      };
      u.addEventListener("click", i), u[a + "Trigger"] = i;
    }
  }
  function m(h) {
    for (const u of h) {
      if (u[a + "Trigger"]) continue;
      if (u.hasAttribute(b)) {
        u[a + "ScopeWarned"] || (u[a + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const g = function(i) {
        if (i.defaultPrevented) return;
        i.preventDefault();
        const r = u.method.toUpperCase(), t = u.action, e = new FormData(u);
        for (const n of u.querySelectorAll('button, input[type="submit"]'))
          n.disabled = !0;
        o(r, t, e, u, function() {
          for (const n of u.querySelectorAll('button, input[type="submit"]'))
            n.disabled = !1;
        });
      };
      u.addEventListener("submit", g), u[a + "Trigger"] = g;
    }
  }
  function f(h) {
    if (!h[a]) return;
    const u = l(h);
    for (const g of u.links)
      g[a + "Trigger"] && (g.removeEventListener("click", g[a + "Trigger"]), delete g[a + "Trigger"]);
    for (const g of u.forms)
      g[a + "Trigger"] && (g.removeEventListener("submit", g[a + "Trigger"]), delete g[a + "Trigger"]);
    delete h[a];
  }
  function o(h, u, g, i, r) {
    if (X(i, "ln-ajax:before-start", { method: h, url: u }).defaultPrevented) return;
    L(i, "ln-ajax:start", { method: h, url: u }), i.classList.add("ln-ajax--loading");
    const e = document.createElement("span");
    e.className = "ln-ajax-spinner", i.appendChild(e);
    function n() {
      i.classList.remove("ln-ajax--loading");
      const A = i.querySelector(".ln-ajax-spinner");
      A && A.remove(), r && r();
    }
    let p = u;
    const v = document.querySelector('meta[name="csrf-token"]'), E = v ? v.getAttribute("content") : null;
    g instanceof FormData && E && g.append("_token", E);
    const w = {
      method: h,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (E && (w.headers["X-CSRF-TOKEN"] = E), h === "GET" && g) {
      const A = new URLSearchParams(g);
      p = u + (u.includes("?") ? "&" : "?") + A.toString();
    } else h !== "GET" && g && (w.body = g);
    fetch(p, w).then(function(A) {
      const S = A.ok;
      return A.json().then(function(T) {
        return { ok: S, status: A.status, data: T };
      });
    }).then(function(A) {
      const S = A.data;
      if (A.ok) {
        if (S.title && (document.title = S.title), S.content)
          for (const T in S.content) {
            const x = document.getElementById(T);
            x && (x.innerHTML = S.content[T]);
          }
        if (i.tagName === "A") {
          const T = i.getAttribute("href");
          T && window.history.pushState({ ajax: !0 }, "", T);
        } else i.tagName === "FORM" && i.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", p);
        L(i, "ln-ajax:success", { method: h, url: p, data: S });
      } else
        L(i, "ln-ajax:error", { method: h, url: p, status: A.status, data: S });
      if (S.message) {
        const T = S.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: T.type || (A.ok ? "success" : "error"),
            title: T.title || "",
            message: T.body || ""
          }
        }));
      }
      L(i, "ln-ajax:complete", { method: h, url: p }), n();
    }).catch(function(A) {
      L(i, "ln-ajax:error", { method: h, url: p, error: A }), L(i, "ln-ajax:complete", { method: h, url: p }), n();
    });
  }
  function l(h) {
    const u = { links: [], forms: [] };
    return h.tagName === "A" && h.getAttribute(c) !== "false" ? u.links.push(h) : h.tagName === "FORM" && h.getAttribute(c) !== "false" ? u.forms.push(h) : (u.links = Array.from(h.querySelectorAll('a:not([data-ln-ajax="false"])')), u.forms = Array.from(h.querySelectorAll('form:not([data-ln-ajax="false"])'))), u;
  }
  function s() {
    ft(function() {
      new MutationObserver(function(u) {
        for (const g of u)
          if (g.type === "childList") {
            for (const i of g.addedNodes)
              if (i.nodeType === 1 && (y(i), !i.hasAttribute(c))) {
                for (const t of i.querySelectorAll("[" + c + "]"))
                  y(t);
                const r = i.closest && i.closest("[" + c + "]");
                if (r && r.getAttribute(c) !== "false") {
                  const t = l(i);
                  _(t.links), m(t.forms);
                }
              }
          } else g.type === "attributes" && y(g.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [c]
      });
    }, "ln-ajax");
  }
  function d() {
    for (const h of document.querySelectorAll("[" + c + "]"))
      y(h);
  }
  window[a] = y, window[a].destroy = f, s(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", d) : d();
})();
const qe = {
  navigate: function(c) {
    Dt(c, { historyAction: "push" });
  },
  replace: function(c) {
    Dt(c, { historyAction: "replace" });
  },
  current: function() {
    return Xt ? {
      path: Yt,
      params: Ie,
      query: De,
      route: Xt,
      regions: ke
    } : null;
  }
}, re = "data-ln-route", xe = "lnRoute";
typeof window < "u" && (window.lnRouter = qe);
const ht = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new WeakMap();
let ke = /* @__PURE__ */ new Map(), ce = !1, Yt = null, Ie = {}, De = {}, Xt = null, Jt = !1;
function de(c, a, b) {
  Jt ? queueMicrotask(function() {
    L(c, a, b);
  }) : L(c, a, b);
}
function Ht(c) {
  try {
    const m = new URL(c, window.location.origin);
    c = m.pathname + m.search + m.hash;
  } catch {
  }
  let [a] = c.split("#"), [b, y] = a.split("?");
  const _ = {};
  if (y) {
    const m = new URLSearchParams(y);
    for (const [f, o] of m.entries())
      _[f] = o;
  }
  return b = b.replace(/\/+$/, ""), b === "" && (b = "/"), { path: b, query: _ };
}
function Re(c, a) {
  if (c.pattern === "*") return 1;
  if (a.pattern === "*") return -1;
  const b = c.segments, y = a.segments, _ = Math.max(b.length, y.length);
  for (let m = 0; m < _; m++) {
    const f = b[m], o = y[m];
    if (f === void 0) return 1;
    if (o === void 0) return -1;
    if (f === "*") return 1;
    if (o === "*") return -1;
    const l = f.startsWith(":"), s = o.startsWith(":");
    if (l && !s) return 1;
    if (!l && s) return -1;
  }
  return 0;
}
function Oe(c, a) {
  const b = c.split("/").filter(Boolean);
  for (const y of a) {
    if (y.pattern === "*")
      return {
        route: y,
        params: { wildcard: c }
      };
    const _ = y.segments, m = {};
    let f = !0;
    if (!(b.length > _.length && _[_.length - 1] !== "*")) {
      for (let o = 0; o < _.length; o++) {
        const l = _[o], s = b[o];
        if (l === "*") {
          m.wildcard = b.slice(o).join("/");
          break;
        }
        if (s === void 0) {
          f = !1;
          break;
        }
        if (l.startsWith(":"))
          m[l.slice(1)] = decodeURIComponent(s);
        else if (l !== s) {
          f = !1;
          break;
        }
      }
      if (f && (_.indexOf("*") !== -1 || b.length <= _.length))
        return { route: y, params: m };
    }
  }
  return null;
}
function Zt(c, a) {
  if (c !== "__primary__") {
    const y = document.getElementById(a.target);
    return y || console.warn(`[ln-router] Explicit target element #${a.target} not found in DOM`), y;
  }
  const b = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return b || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), b;
}
function Ye(c) {
  if (!c) return;
  const a = Array.from(c.querySelectorAll("*")), b = [c].concat(a);
  for (const _ of b)
    for (const m of Object.keys(_))
      if (m.startsWith("ln") && _[m] && typeof _[m].destroy == "function")
        try {
          _[m].destroy();
        } catch (f) {
          console.error(`[ln-router] Error destroying component ${m} on element:`, _, f);
        }
  const y = document.querySelectorAll('[data-ln-popover="open"]');
  for (const _ of y) {
    const m = _.lnPopover;
    if (m && m.trigger && c.contains(m.trigger))
      try {
        m.destroy();
      } catch (f) {
        console.error("[ln-router] Error destroying open popover:", f);
      }
  }
}
function Dt(c, a = {}) {
  const { path: b, query: y } = Ht(c), _ = /* @__PURE__ */ new Map();
  for (const [d, h] of ht)
    _.set(d, Oe(b, h.sorted));
  const m = ht.has("__primary__"), f = _.get("__primary__");
  if (m && !f) {
    de(document.body, "ln-router:not-found", { path: b });
    return;
  }
  let o = null;
  if (f && (o = Zt("__primary__", f.route), !o || X(o, "ln-router:before-navigate", {
    from: Yt,
    to: c,
    params: f.params,
    query: y
  }).defaultPrevented))
    return;
  const l = [];
  for (const [d, h] of _) {
    if (!h) continue;
    const u = Zt(d, h.route);
    u && (d !== "__primary__" && u.hasAttribute("data-ln-route-keep") && le.get(u) === h.route.templateNode || l.push({ regionKey: d, match: h, targetEl: u }));
  }
  a.historyAction === "push" ? window.history.pushState(null, "", c) : a.historyAction === "replace" && window.history.replaceState(null, "", c);
  const s = function() {
    for (const { regionKey: d, match: h, targetEl: u } of l) {
      if (!(a.isHydration && u.hasAttribute("data-ln-router-hydrate") && u.children.length > 0)) {
        Ye(u);
        const i = h.route.templateNode.content.cloneNode(!0);
        u.replaceChildren(i);
      }
      if (le.set(u, h.route.templateNode), d === "__primary__" && (h.route.title && (document.title = h.route.title), !a.isHydration)) {
        u.hasAttribute("tabindex") || u.setAttribute("tabindex", "-1");
        const i = u.querySelector("h1, h2, h3, h4, h5, h6");
        i ? (i.setAttribute("tabindex", "-1"), i.focus()) : u.focus(), u.scrollIntoView({ block: "start", behavior: "instant" });
      }
      de(u, "ln-router:navigated", {
        path: c,
        params: h.params,
        query: y,
        route: h.route,
        target: u,
        region: d
      });
    }
    f && (Yt = c, Ie = f.params, De = y, Xt = f.route), ke = new Map(
      Array.from(_.entries()).map(([d, h]) => [d, h ? { route: h.route, params: h.params } : null])
    );
  };
  document.startViewTransition && !a.isHydration ? document.startViewTransition(s) : s();
}
function Xe(c) {
  const a = c.target.closest("a");
  if (!a || !be(c, a)) return;
  const b = a.getAttribute("href"), { path: y } = Ht(b), _ = ht.get("__primary__");
  if (!_) return;
  Oe(y, _.sorted) && (c.preventDefault(), Dt(b, { historyAction: "push" }));
}
function Je(c, a) {
  const b = Object.keys(c), y = Object.keys(a);
  if (b.length !== y.length) return !1;
  for (let _ = 0; _ < b.length; _++) {
    const m = b[_];
    if (c[m] !== a[m]) return !1;
  }
  return !0;
}
function Ze() {
  const c = window.location.pathname + window.location.search, a = qe.current();
  if (a && a.path != null) {
    const b = Ht(c);
    if (Ht(a.path).path === b.path && Je(a.query, b.query))
      return;
  }
  Dt(c, { historyAction: "skip" });
}
function tn() {
  ce || (ce = !0, ft(function() {
    document.addEventListener("click", Xe), window.addEventListener("popstate", Ze), Jt = !0;
    const c = window.location.pathname + window.location.search + window.location.hash;
    Dt(c, { historyAction: "replace", isHydration: !0 }), Jt = !1;
  }, "ln-router"));
}
function en(c) {
  const a = c.getAttribute(re);
  if (!a) return;
  const b = c.getAttribute("data-ln-route-target") || null;
  if (b === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${a}" rejected.`);
    return;
  }
  const y = b || "__primary__";
  ht.has(y) || ht.set(y, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const _ = ht.get(y);
  if (_.routes.has(a)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${a}" in region "${y}"`);
    return;
  }
  const m = c.getAttribute("data-ln-route-title"), f = a.split("/").filter(Boolean), o = {
    pattern: a,
    segments: f,
    target: b,
    title: m,
    templateNode: c
  }, l = Zt(y, o);
  l && l.contains(c) && console.warn(`[ln-router] Route template with pattern "${a}" is declared inside its own outlet element:`, c), _.routes.set(a, o), _.sorted = Array.from(_.routes.values()).sort(Re);
}
function nn(c) {
  const a = c.getAttribute(re);
  if (!a) return;
  const y = c.getAttribute("data-ln-route-target") || null || "__primary__", _ = ht.get(y);
  _ && (_.routes.delete(a), _.sorted = Array.from(_.routes.values()).sort(Re), _.routes.size === 0 && ht.delete(y));
}
function Me(c) {
  return this.dom = c, en(c), this;
}
Me.prototype.destroy = function() {
  nn(this.dom), delete this.dom[xe];
};
z(re, xe, Me, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    ht.size > 0 && tn();
  }
});
(function() {
  const c = "data-ln-modal", a = "lnModal";
  if (window[a] !== void 0) return;
  function b(_) {
    this.dom = _, this.isOpen = _.getAttribute(c) === "open";
    const m = this;
    return this._onRequestOpen = function() {
      m.dom.setAttribute(c, "open");
    }, this._onRequestClose = function() {
      m.dom.setAttribute(c, "close");
    }, this._onCancel = function(f) {
      f.preventDefault(), m.dom.setAttribute(c, "close");
    }, this._onClickClose = function(f) {
      const o = f.target.closest("[data-ln-modal-close]");
      o && m.dom.contains(o) && (f.preventDefault(), m.dom.setAttribute(c, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  b.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const _ = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + c + '="open"]'),
          function(f) {
            return f !== _;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      L(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[a];
    }
  };
  function y(_) {
    const m = _[a];
    if (!m) return;
    const o = _.getAttribute(c) === "open";
    if (o !== m.isOpen)
      if (o) {
        if (X(_, "ln-modal:before-open", { modalId: _.id, target: _ }).defaultPrevented) {
          _.setAttribute(c, "close");
          return;
        }
        m.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof _.showModal == "function" && _.showModal();
        const s = _.querySelector("[autofocus]");
        if (s && Ft(s))
          s.focus();
        else {
          const d = _.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), h = Array.prototype.find.call(d, Ft);
          if (h) h.focus();
          else {
            const u = _.querySelectorAll("a[href], button:not([disabled])"), g = Array.prototype.find.call(u, Ft);
            g && g.focus();
          }
        }
        L(_, "ln-modal:open", { modalId: _.id, target: _ });
      } else {
        if (X(_, "ln-modal:before-close", { modalId: _.id, target: _ }).defaultPrevented) {
          _.setAttribute(c, "open");
          return;
        }
        m.isOpen = !1, L(_, "ln-modal:close", { modalId: _.id, target: _ }), typeof _.close == "function" && _.close(), document.querySelector("[" + c + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  z(c, a, b, "ln-modal", {
    onAttributeChange: y
  });
})();
(function() {
  const c = "data-ln-modal-coordinator", a = "lnModalCoordinator";
  if (window[a] !== void 0) return;
  function b(h, u) {
    if (u) {
      if (h) {
        const i = h.closest("[" + c + "]");
        if (i) {
          if (i.id === u && i.hasAttribute("data-ln-modal")) return i;
          const r = i.querySelector("#" + CSS.escape(u) + '[data-ln-modal], [data-ln-modal="' + u + '"]');
          if (r) return r;
        }
      }
      const g = document.getElementById(u) || document.querySelector('[data-ln-modal="' + u + '"]');
      if (g) return g;
    }
    if (h) {
      const g = h.closest("[" + c + "]");
      if (g) {
        if (g.hasAttribute("data-ln-modal")) return g;
        const r = g.querySelector("[data-ln-modal]");
        if (r) return r;
      }
      const i = h.closest("[data-ln-modal]");
      if (i) return i;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function y(h, u) {
    if (h !== "edit") return "";
    if (u) {
      const g = u.getAttribute("data-ln-fill-id");
      if (g) return g;
    }
    return "edit";
  }
  function _(h) {
    if (!h) return;
    const u = h.querySelectorAll("[data-ln-field]");
    for (let i = 0; i < u.length; i++)
      u[i].textContent = "";
    const g = h.querySelectorAll("form");
    for (let i = 0; i < g.length; i++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(g[i], null) : g[i].reset();
  }
  document.addEventListener("submit", function(h) {
    if (h.defaultPrevented) return;
    const g = h.target.closest("[data-ln-modal]");
    if (g && g.id) {
      try {
        sessionStorage.setItem("ln-modal-pending:" + g.id, "true");
      } catch {
      }
      it(g.id, null);
    }
  }), document.addEventListener("click", function(h) {
    if (h.ctrlKey || h.metaKey || h.button === 1) return;
    const u = h.target.closest("[data-ln-modal-for]");
    if (u) {
      const i = u.getAttribute("data-ln-modal-for"), r = b(u, i);
      if (r && r.lnModal) {
        h.preventDefault();
        const t = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, e = {}, n = u.dataset;
        for (const E in n) {
          if (!E.startsWith("lnModal") || t[E]) continue;
          const w = E.slice(7);
          w && (e[w.charAt(0).toLowerCase() + w.slice(1)] = n[E]);
        }
        const p = Object.keys(e).length > 0;
        u.hasAttribute("data-ln-modal-mode") ? r.dataset.lnModalMode = u.getAttribute("data-ln-modal-mode") : r.dataset.lnModalMode = p ? "edit" : "new", p && window.lnCore && typeof window.lnCore.fill == "function" ? window.lnCore.fill(r, e) : r.dataset.lnModalMode === "new" && _(r), r.getAttribute("data-ln-modal") === "open" ? L(r, "ln-modal:request-close", {}) : (r.id && it(r.id, y(r.dataset.lnModalMode, u)), L(r, "ln-modal:request-open", {}));
      }
      return;
    }
    const g = h.target.closest('a[href^="#"]');
    if (g) {
      const i = Ut(g.getAttribute("href"));
      for (const r in i) {
        const t = document.getElementById(r);
        if (t && t.lnModal) {
          if (!ie(h)) return;
          it(r, i[r]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(h) {
    const u = h.target;
    if (!u || !u.lnModal) return;
    (u.dataset.lnModalMode || "new") === "new" && _(u);
  }), document.addEventListener("ln-modal:open", function(h) {
    const u = h.target;
    if (!u || !u.lnModal || !u.id) return;
    let g = rt(u.id);
    g === null && (g = y(u.dataset.lnModalMode, null), it(u.id, g)), g ? (u.dataset.lnModalMode = "edit", u.dispatchEvent(new CustomEvent("ln-fill:request", {
      bubbles: !0,
      detail: { id: g }
    }))) : (u.dataset.lnModalMode = "new", _(u));
  });
  let m = !1;
  function f() {
    if (!m) {
      m = !0;
      try {
        const h = document.querySelectorAll("[data-ln-modal][id]");
        for (let u = 0; u < h.length; u++) {
          const g = h[u];
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
          const e = rt(i), n = e !== null, p = g.lnModal.isOpen;
          if (n) {
            const v = e ? "edit" : "new";
            g.dataset.lnModalMode = v, p ? e ? g.dispatchEvent(new CustomEvent("ln-fill:request", {
              bubbles: !0,
              detail: { id: e }
            })) : _(g) : L(g, "ln-modal:request-open", {});
          } else p && L(g, "ln-modal:request-close", {});
        }
      } finally {
        m = !1;
      }
    }
  }
  function o() {
    const h = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let u = 0; u < h.length; u++) {
      const g = h[u];
      g.lnModal && rt(g.id) === null && it(g.id, y(g.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", f);
  function l() {
    o(), f();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    ct(l);
  }) : ct(l);
  function s(h) {
    const u = h.target.closest("[data-ln-modal]");
    if (!(!u || !u.lnModal)) {
      if (u.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + u.id);
        } catch {
        }
        it(u.id, null);
      }
      L(u, "ln-modal:request-close", {}), _(u);
    }
  }
  document.addEventListener("ln-form:success", s), document.addEventListener("ln-ajax:success", s), document.addEventListener("ln-modal:close", function(h) {
    const u = h.target;
    if (!(!u || !u.lnModal)) {
      if (u.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + u.id);
        } catch {
        }
        rt(u.id) !== null && it(u.id, null);
      }
      u.dataset.lnModalMode === "new" && _(u);
    }
  });
  function d(h) {
    return this.dom = h, this;
  }
  d.prototype.destroy = function() {
    this.dom[a] && delete this.dom[a];
  }, z(c, a, d, "ln-modal-coordinator");
})();
(function() {
  const c = "data-ln-number", a = "lnNumber";
  if (window[a] !== void 0) return;
  const b = {}, y = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function _(s) {
    if (!b[s]) {
      const d = new Intl.NumberFormat(s, { useGrouping: !0 }), h = d.formatToParts(1234.5);
      let u = "", g = ".";
      for (let i = 0; i < h.length; i++)
        h[i].type === "group" && (u = h[i].value), h[i].type === "decimal" && (g = h[i].value);
      b[s] = { fmt: d, groupSep: u, decimalSep: g };
    }
    return b[s];
  }
  function m(s, d, h) {
    if (h !== null) {
      const u = parseInt(h, 10), g = s + "|d" + u;
      return b[g] || (b[g] = new Intl.NumberFormat(s, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: u })), b[g].format(d);
    }
    return _(s).fmt.format(d);
  }
  function f(s) {
    if (s[a]) return s[a];
    if (s[a] = this, this.dom = s, s.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const d = document.createElement("input");
    d.type = "hidden", d.name = s.name, s.removeAttribute("name"), s.hasAttribute("data-ln-fill-as") && d.setAttribute("data-ln-fill-as", s.getAttribute("data-ln-fill-as")), s.type = "text", s.setAttribute("inputmode", "decimal"), s.insertAdjacentElement("afterend", d), this._hidden = d;
    const h = this;
    Object.defineProperty(d, "value", {
      get: function() {
        return y.get.call(d);
      },
      set: function(g) {
        y.set.call(d, g), g !== "" && !isNaN(parseFloat(g)) ? h._setDisplayRaw(m($(h.dom), parseFloat(g), h.dom.getAttribute("data-ln-number-decimals"))) : h._setDisplayRaw(""), h.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), _e(s, y, {
      get: function() {
        return y.get.call(s);
      },
      set: function(g) {
        if (g === "") {
          h._setDisplayRaw(""), h._setHiddenRaw(""), s.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const i = typeof g == "number" ? g : parseFloat(String(g).replace(/[^\d.-]/g, ""));
        isNaN(i) ? (h._setDisplayRaw(String(g)), h._setHiddenRaw("")) : (h._setHiddenRaw(i), h._setDisplayRaw(m($(s), i, s.getAttribute("data-ln-number-decimals")))), s.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      h._handleInput();
    }, s.addEventListener("input", this._onInput), this._onPaste = function(g) {
      g.preventDefault();
      const i = (g.clipboardData || window.clipboardData).getData("text"), r = _($(s)), t = r.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let e = i.replace(new RegExp("[^0-9\\-" + t + ".]", "g"), "");
      r.groupSep && (e = e.split(r.groupSep).join("")), r.decimalSep !== "." && (e = e.replace(r.decimalSep, "."));
      const n = parseFloat(e);
      h.value = isNaN(n) ? NaN : n;
    }, s.addEventListener("paste", this._onPaste);
    const u = s.value;
    if (u !== "") {
      const g = parseFloat(u);
      isNaN(g) || (this._setHiddenRaw(g), this._setDisplayRaw(m($(s), g, s.getAttribute("data-ln-number-decimals"))), s.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  function o(s) {
    if (typeof s == "number") return isNaN(s) ? null : s;
    if (!s || typeof s != "string") return null;
    let d = s.trim();
    if (d === "") return null;
    d = d.replace(/[\s\u00A0$€£]/g, ""), d.indexOf(",") !== -1 && d.indexOf(".") !== -1 ? d.indexOf(".") < d.indexOf(",") ? d = d.replace(/\./g, "").replace(",", ".") : d = d.replace(/,/g, "") : d.indexOf(",") !== -1 && (d = d.replace(",", ".")), d = d.replace(/[^\d.-]/g, "");
    const h = parseFloat(d);
    return isNaN(h) ? null : h;
  }
  f.prototype._initTextElement = function() {
    const s = this.dom;
    let d = s.getAttribute("data-ln-value"), h = s.getAttribute("data-ln-number"), u = null;
    d !== null && d !== "" ? u = d : h !== null && h !== "" && h !== "true" ? u = h : u = s.textContent.trim();
    const g = o(u);
    g !== null ? (this._rawValue = g, s.hasAttribute("data-ln-value") || s.setAttribute("data-ln-value", String(g)), this._formatTextContent()) : this._rawValue = null;
  }, f.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const s = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = m($(this.dom), this._rawValue, s);
    }
  }, f.prototype._handleInput = function() {
    const s = this.dom, d = _($(s)), h = y.get.call(s);
    if (h === "") {
      this._setHiddenRaw(""), L(s, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (h === "-") {
      this._setHiddenRaw("");
      return;
    }
    const u = s.selectionStart;
    let g = 0;
    for (let A = 0; A < u; A++)
      /[0-9]/.test(h[A]) && g++;
    let i = h;
    if (d.groupSep && (i = i.split(d.groupSep).join("")), i = i.replace(d.decimalSep, "."), h.endsWith(d.decimalSep) || h.endsWith(".")) {
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
    const t = s.getAttribute("data-ln-number-decimals");
    if (t !== null && r !== -1) {
      const A = parseInt(t, 10);
      i.slice(r + 1).length > A && (i = i.slice(0, r + 1 + A));
    }
    const e = parseFloat(i);
    if (isNaN(e)) return;
    const n = s.getAttribute("data-ln-number-min"), p = s.getAttribute("data-ln-number-max");
    if (n !== null && e < parseFloat(n) || p !== null && e > parseFloat(p)) return;
    let v;
    if (t !== null)
      v = m($(s), e, t);
    else {
      const A = r !== -1 ? i.slice(r + 1).length : 0;
      if (A > 0) {
        const S = $(s) + "|u" + A;
        b[S] || (b[S] = new Intl.NumberFormat($(s), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), v = b[S].format(e);
      } else
        v = d.fmt.format(e);
    }
    this._setDisplayRaw(v);
    let E = g, w = 0;
    for (let A = 0; A < v.length && E > 0; A++)
      w = A + 1, /[0-9]/.test(v[A]) && E--;
    E > 0 && (w = v.length), s.setSelectionRange(w, w), this._setHiddenRaw(e), L(s, "ln-number:input", { value: e, formatted: v });
  }, f.prototype._setHiddenRaw = function(s) {
    this._hidden && y.set.call(this._hidden, String(s));
  }, f.prototype._setDisplayRaw = function(s) {
    this.isTextElement ? this.dom.textContent = String(s) : y.set.call(this.dom, String(s));
  }, f.prototype._displayFormatted = function(s) {
    this.isTextElement ? this._formatTextContent() : this._setDisplayRaw(m($(this.dom), s, this.dom.getAttribute("data-ln-number-decimals")));
  }, Object.defineProperty(f.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const s = y.get.call(this._hidden);
      return s === "" ? NaN : parseFloat(s);
    },
    set: function(s) {
      if (this.isTextElement) {
        typeof s != "number" || isNaN(s) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = s, this.dom.setAttribute("data-ln-value", String(s)), this._formatTextContent());
        return;
      }
      if (typeof s != "number" || isNaN(s)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(s), this._setDisplayRaw(m($(this.dom), s, this.dom.getAttribute("data-ln-number-decimals"))), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(f.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : y.get.call(this.dom);
    }
  }), f.prototype.destroy = function() {
    this.dom[a] && (this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), L(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function l() {
    new MutationObserver(function() {
      const s = document.querySelectorAll("[" + c + "]");
      for (let d = 0; d < s.length; d++) {
        const h = s[d][a];
        h && (h.isTextElement ? h._formatTextContent() : isNaN(h.value) || h._displayFormatted(h.value));
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  z(c, a, f, "ln-number", {
    extraAttributes: [
      "data-ln-value",
      "data-ln-number-decimals",
      "data-ln-number-min",
      "data-ln-number-max",
      "lang"
    ],
    onAttributeChange: function(s) {
      const d = s[a];
      d && (d.isTextElement ? d._initTextElement() : isNaN(d.value) || d._displayFormatted(d.value));
    }
  }), l();
})();
(function() {
  const c = "data-ln-date", a = "lnDate";
  if (window[a] !== void 0) return;
  const b = {}, y = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function _(n, p) {
    const v = n + "|" + JSON.stringify(p);
    return b[v] || (b[v] = new Intl.DateTimeFormat(n, p)), b[v];
  }
  const m = /^(short|medium|long)(\s+datetime)?$/, f = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function o(n) {
    return !n || n === "" ? { dateStyle: "medium" } : n.match(m) ? f[n] : null;
  }
  function l(n, p, v) {
    const E = n.getDate(), w = n.getMonth(), A = n.getFullYear(), S = n.getHours(), T = n.getMinutes();
    let x, I;
    const k = It(v), R = (v || "").toLowerCase().split("-")[0], K = _(v, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0], P = k && K !== R;
    P && k.monthsLong ? x = k.monthsLong[w] : x = _(v, { month: "long" }).format(n), P && k.monthsShort ? I = k.monthsShort[w] : I = _(v, { month: "short" }).format(n);
    const U = {
      yyyy: String(A),
      yy: String(A).slice(-2),
      MMMM: x,
      MMM: I,
      MM: String(w + 1).padStart(2, "0"),
      M: String(w + 1),
      dd: String(E).padStart(2, "0"),
      d: String(E),
      HH: String(S).padStart(2, "0"),
      mm: String(T).padStart(2, "0")
    };
    return p.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(j) {
      return U[j];
    });
  }
  function s(n, p, v) {
    const E = o(p);
    if (E) {
      const w = _(v, E), A = (v || "").toLowerCase().split("-")[0], S = w.resolvedOptions().locale.toLowerCase().split("-")[0];
      return It(v) && S !== A ? l(n, "dd.MM.yyyy", v) : w.format(n);
    }
    return l(n, p, v);
  }
  function d(n) {
    if (!n) return "";
    const p = n.getFullYear(), v = String(n.getMonth() + 1).padStart(2, "0"), E = String(n.getDate()).padStart(2, "0");
    return p + "-" + v + "-" + E;
  }
  function h(n, p, v) {
    L(n.dom, "ln-date:change", {
      value: p,
      formatted: n.dom.value,
      date: v
    }), n.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function u(n, p, v, E) {
    n._setHiddenRaw(p), y.set.call(n._picker, p), n._lastISO = p, E !== void 0 ? (n._isFormatting = !0, n.dom.value = E, n._isFormatting = !1) : v && n._displayFormatted(v), h(n, p, v);
  }
  function g(n) {
    n._setHiddenRaw(""), y.set.call(n._picker, ""), n._isFormatting = !0, n.dom.value = "", n._isFormatting = !1, n._lastISO = "", h(n, "", null);
  }
  i.prototype._initTextElement = function() {
    const n = this.dom;
    let p = n.getAttribute("data-ln-value"), v = n.getAttribute("data-ln-date"), E = n.getAttribute("datetime"), w = null;
    p !== null && p !== "" ? w = p : E !== null && E !== "" ? w = E : v !== null && v !== "" && v !== "true" && !m.test(v) ? w = v : w = n.textContent.trim();
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
          w && m.test(w) && (v = w);
        }
        const E = $(this.dom);
        this.dom.textContent = s(n, v || "medium", E);
      }
    }
  };
  function i(n) {
    if (n[a]) return n[a];
    if (n[a] = this, this.dom = n, n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const p = this, v = n.value, E = n.name, A = (n.closest(".form-element, form") || n.parentNode).querySelectorAll("[data-ln-date-dict]");
    for (let k = 0; k < A.length; k++) {
      const R = A[k].getAttribute("data-ln-date-dict");
      if (R) {
        const N = te(A[k], "data-ln-date-dict-key");
        N["months-long"] && (N.monthsLong = N["months-long"].split(",").map((K) => K.trim())), N["months-short"] && (N.monthsShort = N["months-short"].split(",").map((K) => K.trim())), ee(R, N);
      }
    }
    const S = document.createElement("span");
    S.setAttribute("data-ln-date-field", ""), n.parentNode.insertBefore(S, n), S.appendChild(n), this._wrapper = S;
    const T = document.createElement("input");
    T.type = "hidden", T.name = E, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && T.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.insertAdjacentElement("afterend", T), this._hidden = T;
    const x = document.createElement("input");
    x.type = "date", x.tabIndex = -1, x.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", T.insertAdjacentElement("afterend", x), this._picker = x, n.type = "text";
    const I = document.createElement("button");
    if (I.type = "button", I.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Open date picker"), I.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', x.insertAdjacentElement("afterend", I), this._btn = I, this._lastISO = "", Object.defineProperty(T, "value", {
      get: function() {
        return y.get.call(T);
      },
      set: function(k) {
        if (y.set.call(T, k), k && k !== "") {
          const R = r(k);
          R && u(p, k, R);
        } else k === "" && g(p);
      }
    }), _e(n, y, {
      get: function() {
        return y.get.call(n);
      },
      set: function(k, R) {
        if (p._isFormatting) {
          R(k);
          return;
        }
        if (!k || k === "") {
          R(""), g(p);
          return;
        }
        const N = r(k) || t(k);
        if (N) {
          const K = d(N), P = n.getAttribute(c) || "", U = $(n), j = s(N, P, U);
          R(j), u(p, K, N, j);
        } else
          R(String(k)), g(p);
      }
    }), this._onPickerChange = function() {
      const k = x.value;
      if (k) {
        const R = r(k);
        R && u(p, k, R);
      } else
        g(p);
    }, x.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const k = p.dom.value.trim();
      if (k === "") {
        p._lastISO !== "" && g(p);
        return;
      }
      if (p._lastISO) {
        const N = r(p._lastISO);
        if (N) {
          const K = p.dom.getAttribute(c) || "", P = $(p.dom);
          if (k === s(N, K, P)) return;
        }
      }
      const R = t(k);
      if (R) {
        const N = d(R);
        u(p, N, R);
      } else if (p._lastISO) {
        const N = r(p._lastISO);
        N && p._displayFormatted(N);
      } else
        p.dom.value = "";
    }, n.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      p._openPicker();
    }, I.addEventListener("click", this._onBtnClick), v && v !== "") {
      const k = r(v);
      k && u(p, v, k);
    }
    return this;
  }
  function r(n) {
    if (!n || typeof n != "string") return null;
    const p = n.split("T"), v = p[0].split("-");
    if (v.length < 3) return null;
    const E = parseInt(v[0], 10), w = parseInt(v[1], 10) - 1, A = parseInt(v[2], 10);
    if (isNaN(E) || isNaN(w) || isNaN(A)) return null;
    let S = 0, T = 0;
    if (p[1]) {
      const I = p[1].split(":");
      S = parseInt(I[0], 10) || 0, T = parseInt(I[1], 10) || 0;
    }
    const x = new Date(E, w, A, S, T);
    return x.getFullYear() !== E || x.getMonth() !== w || x.getDate() !== A ? null : x;
  }
  function t(n) {
    if (!n || typeof n != "string" || (n = n.trim(), n.length < 6)) return null;
    let p, v;
    if (n.indexOf(".") !== -1)
      p = ".", v = n.split(".");
    else if (n.indexOf("/") !== -1)
      p = "/", v = n.split("/");
    else if (n.indexOf("-") !== -1)
      p = "-", v = n.split("-");
    else
      return null;
    if (v.length !== 3) return null;
    const E = [];
    for (let x = 0; x < 3; x++) {
      const I = parseInt(v[x], 10);
      if (isNaN(I)) return null;
      E.push(I);
    }
    let w, A, S;
    p === "." ? (w = E[0], A = E[1], S = E[2]) : p === "/" ? (A = E[0], w = E[1], S = E[2]) : v[0].length === 4 ? (S = E[0], A = E[1], w = E[2]) : (w = E[0], A = E[1], S = E[2]), S < 100 && (S += S < 50 ? 2e3 : 1900);
    const T = new Date(S, A - 1, w);
    return T.getFullYear() !== S || T.getMonth() !== A - 1 || T.getDate() !== w ? null : T;
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
    const p = this.dom.getAttribute(c) || "", v = $(this.dom);
    this._isFormatting = !0, this.dom.value = s(n, p, v), this._isFormatting = !1;
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
      const p = r(n);
      p && u(this, n, p);
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
    if (!this.dom[a]) return;
    if (this.isTextElement) {
      L(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[a];
      return;
    }
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const n = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", n && (this.dom.value = n), L(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[a];
  };
  function e() {
    new MutationObserver(function() {
      const n = document.querySelectorAll("[" + c + "]");
      for (let p = 0; p < n.length; p++) {
        const v = n[p][a];
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
  z(c, a, i, "ln-date", {
    extraAttributes: ["data-ln-date-format", "data-ln-date-locale", "data-ln-value", "datetime", "lang"],
    onAttributeChange: function(n) {
      const p = n[a];
      if (p) {
        if (p.isTextElement)
          p._initTextElement();
        else if (p.value) {
          const v = r(p.value);
          v && p._displayFormatted(v);
        }
      }
    }
  }), e();
})();
(function() {
  const c = "data-ln-nav", a = "lnNav";
  if (window[a] !== void 0) return;
  const b = [];
  if (!history._lnNavPatched) {
    const f = history.pushState;
    history.pushState = function() {
      f.apply(history, arguments);
      for (const o of b)
        o();
    }, history._lnNavPatched = !0;
  }
  function y(f) {
    return this.dom = f, this.activeClass = f.getAttribute(c) || "active", this.exact = f.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), b.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(f, { childList: !0, subtree: !0 }), this.update(), this;
  }
  y.prototype.update = function() {
    if (!this.activeClass || X(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const o = Array.from(this.dom.querySelectorAll("a")), l = window.location.pathname, s = _(l);
    for (const d of o) {
      const h = d.getAttribute("href");
      if (!h || h === "#" || h.startsWith("#") || h.startsWith("javascript:") || h.startsWith("mailto:") || h.startsWith("tel:")) {
        d.classList.remove(this.activeClass), d.removeAttribute("aria-current");
        continue;
      }
      if (d.hostname && d.hostname !== window.location.hostname) {
        d.classList.remove(this.activeClass), d.removeAttribute("aria-current");
        continue;
      }
      const u = _(h), g = u === s, i = !this.exact && u !== "/" && s.startsWith(u + "/");
      g || i ? (d.classList.add(this.activeClass), d.setAttribute("aria-current", "page")) : (d.classList.remove(this.activeClass), d.removeAttribute("aria-current"));
    }
    L(this.dom, "ln-nav:update", { target: this.dom });
  }, y.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const f = b.indexOf(this.updateHandler);
    f !== -1 && b.splice(f, 1), L(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[a];
  };
  function _(f) {
    try {
      return new URL(f, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return f.replace(/\/$/, "") || "/";
    }
  }
  function m(f, o) {
    const l = f[a];
    if (l) {
      if (o === c) {
        if (!f.hasAttribute(c)) {
          l.destroy();
          return;
        }
        const s = l.activeClass, d = f.getAttribute(c) || "active";
        if (s !== d) {
          const h = f.querySelectorAll("a");
          for (const u of h)
            s && u.classList.remove(s);
          l.activeClass = d;
        }
      } else o === "data-ln-nav-exact" && (l.exact = f.hasAttribute("data-ln-nav-exact"));
      l.update();
    }
  }
  z(c, a, y, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: m
  });
})();
(function() {
  const c = "data-ln-tabs", a = "lnTabs";
  if (window[a] !== void 0 && window[a] !== null) return;
  function b(m, f) {
    const o = (m.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (o) return o;
    if (m.tagName !== "A") return "";
    const l = m.getAttribute("href") || "";
    if (!l.startsWith("#")) return "";
    const s = l.slice(1);
    if (!s) return "";
    const d = s.split("&");
    if (f)
      for (const g of d) {
        const i = g.indexOf(":");
        if (i > 0 && g.slice(0, i).toLowerCase().trim() === f)
          return g.slice(i + 1).toLowerCase().trim();
      }
    const h = d[d.length - 1] || "", u = h.indexOf(":");
    return (u > 0 ? h.slice(u + 1) : h).toLowerCase().trim();
  }
  function y(m) {
    return this.dom = m, _.call(this), this;
  }
  function _() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const m = this.tabs.filter((l) => l.tagName === "A" && (l.getAttribute("href") || "").startsWith("#")), f = m.length > 0 && m.length === this.tabs.length;
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = f && !!this.nsKey, m.length > 0 && m.length !== this.tabs.length ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : f && !this.nsKey && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const l of this.tabs) {
      const s = b(l, this.nsKey);
      s ? this.mapTabs[s] = l : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', l);
    }
    for (const l of this.panels) {
      const s = (l.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      s && (this.mapPanels[s] = l);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const o = this;
    this._clickHandlers = [];
    for (const l of this.tabs) {
      if (l[a + "Trigger"]) continue;
      const s = function(d) {
        const h = l.tagName === "A";
        if (!h && (d.ctrlKey || d.metaKey || d.button === 1)) return;
        const u = b(l, o.nsKey);
        u && (h && !ie(d) || (o.hashEnabled ? rt(o.nsKey) === u ? o.dom.setAttribute("data-ln-tabs-active", u) : it(o.nsKey, u) : o.dom.setAttribute("data-ln-tabs-active", u)));
      };
      l.addEventListener("click", s), l[a + "Trigger"] = s, o._clickHandlers.push({ el: l, handler: s });
    }
    if (this._onRequestSelect = function(l) {
      const s = l.detail && (l.detail.key || l.detail.tab);
      s && o.dom.setAttribute("data-ln-tabs-active", (s + "").toLowerCase().trim());
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this.dom.addEventListener("ln-tabs:request-activate", this._onRequestSelect), this._hashHandler = function() {
      if (!o.hashEnabled) return;
      const l = rt(o.nsKey);
      o.dom.setAttribute("data-ln-tabs-active", l !== null ? l : o.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let l = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const s = Bt("tabs", this.dom);
        s !== null && s in this.mapPanels && (l = s);
      }
      this.dom.setAttribute("data-ln-tabs-active", l);
    }
  }
  y.prototype._applyActive = function(m) {
    var f;
    (!m || !(m in this.mapPanels)) && (m = this.defaultKey);
    for (const o in this.mapTabs) {
      const l = this.mapTabs[o];
      o === m ? (l.setAttribute("data-active", ""), l.setAttribute("aria-selected", "true")) : (l.removeAttribute("data-active"), l.setAttribute("aria-selected", "false"));
    }
    for (const o in this.mapPanels) {
      const l = this.mapPanels[o], s = o === m;
      l.classList.toggle("hidden", !s), l.setAttribute("aria-hidden", s ? "false" : "true");
    }
    if (this.autoFocus) {
      const o = (f = this.mapPanels[m]) == null ? void 0 : f.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      o && setTimeout(() => o.focus({ preventScroll: !0 }), 0);
    }
    L(this.dom, "ln-tabs:change", { key: m, tab: this.mapTabs[m], panel: this.mapPanels[m] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && yt("tabs", this.dom, m);
  }, y.prototype.destroy = function() {
    if (this.dom[a]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect), this.dom.removeEventListener("ln-tabs:request-activate", this._onRequestSelect);
      for (const { el: m, handler: f } of this._clickHandlers)
        m.removeEventListener("click", f), delete m[a + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), L(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[a];
    }
  }, z(c, a, y, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(m) {
      const f = m.getAttribute("data-ln-tabs-active");
      m[a]._applyActive(f);
    }
  });
})();
(function() {
  const c = "data-ln-toggle", a = "lnToggle";
  if (window[a] !== void 0) return;
  function b(m, f) {
    const o = document.querySelectorAll(
      '[data-ln-toggle-for="' + m.id + '"]'
    );
    for (const l of o)
      l.setAttribute("aria-expanded", f ? "true" : "false");
  }
  function y(m) {
    this.dom = m;
    const f = this;
    if (this._onRequestOpen = function() {
      f.open();
    }, this._onRequestClose = function() {
      f.close();
    }, this._onRequestToggle = function() {
      f.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), m.hasAttribute("data-ln-persist")) {
      const o = Bt("toggle", m);
      o !== null && m.setAttribute(c, o);
    }
    return this.isOpen = m.getAttribute(c) === "open", this.isOpen && m.classList.add("open"), b(m, this.isOpen), this;
  }
  y.prototype.open = function() {
    this.dom.setAttribute(c, "open");
  }, y.prototype.close = function() {
    this.dom.setAttribute(c, "close");
  }, y.prototype.toggle = function() {
    const m = this.dom.getAttribute(c);
    this.dom.setAttribute(c, m === "open" ? "close" : "open");
  }, y.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), L(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function _(m) {
    const f = m[a];
    if (!f) return;
    const l = m.getAttribute(c) === "open";
    if (l !== f.isOpen)
      if (l) {
        if (X(m, "ln-toggle:before-open", { target: m }).defaultPrevented) {
          m.setAttribute(c, "close");
          return;
        }
        f.isOpen = !0, m.classList.add("open"), b(m, !0), L(m, "ln-toggle:open", { target: m }), m.hasAttribute("data-ln-persist") && yt("toggle", m, "open");
      } else {
        if (X(m, "ln-toggle:before-close", { target: m }).defaultPrevented) {
          m.setAttribute(c, "open");
          return;
        }
        f.isOpen = !1, m.classList.remove("open"), b(m, !1), L(m, "ln-toggle:close", { target: m }), m.hasAttribute("data-ln-persist") && yt("toggle", m, "close");
      }
  }
  document.addEventListener("click", function(m) {
    if (m.ctrlKey || m.metaKey || m.button === 1) return;
    const f = m.target.closest("[data-ln-toggle-for]");
    if (f) {
      const o = f.getAttribute("data-ln-toggle-for"), l = document.getElementById(o);
      if (l && l[a]) {
        m.preventDefault();
        const s = f.getAttribute("data-ln-toggle-action") || "toggle";
        if (s === "open")
          l.setAttribute(c, "open");
        else if (s === "close")
          l.setAttribute(c, "close");
        else if (s === "toggle") {
          const d = l.getAttribute(c);
          l.setAttribute(c, d === "open" ? "close" : "open");
        }
      }
    }
  }), z(c, a, y, "ln-toggle", {
    onAttributeChange: _
  });
})();
(function() {
  const c = "data-ln-accordion", a = "lnAccordion";
  if (window[a] !== void 0) return;
  function b(y) {
    return this.dom = y, this._onToggleOpen = function(_) {
      if (_.detail.target.closest("[data-ln-accordion]") !== y) return;
      const m = y.querySelectorAll("[data-ln-toggle]");
      for (const f of m)
        f !== _.detail.target && f.closest("[data-ln-accordion]") === y && f.getAttribute("data-ln-toggle") === "open" && f.setAttribute("data-ln-toggle", "close");
      L(y, "ln-accordion:change", { target: _.detail.target });
    }, y.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  b.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), L(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[a]);
  }, z(c, a, b, "ln-accordion");
})();
(function() {
  const c = "data-ln-dropdown", a = "lnDropdown", b = "data-ln-dropdown-position", y = "data-ln-dropdown-placement", _ = "bottom-end";
  if (window[a] !== void 0) return;
  function m(f) {
    this.dom = f, this.toggleEl = f.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = f.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const o = this;
    return this._onRequestOpen = function() {
      o.toggleEl && o.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      o.toggleEl && o.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (o.toggleEl) {
        const l = o.toggleEl.getAttribute("data-ln-toggle");
        o.toggleEl.setAttribute("data-ln-toggle", l === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(l) {
      const s = o.toggleEl && o.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (l.key === "Escape") {
        s && (l.preventDefault(), l.stopPropagation(), o.toggleEl.setAttribute("data-ln-toggle", "close"), o.triggerBtn && o.triggerBtn.focus());
        return;
      }
      if (l.key === "Tab") {
        s && (o.triggerBtn && o.triggerBtn.focus(), o.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const d = o._getMenuItems();
      if (d.length === 0) return;
      if (!s && (l.key === "ArrowDown" || l.key === "ArrowUp")) {
        l.preventDefault(), o.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const u = o._getMenuItems();
          u.length > 0 && o._focusItem(u, l.key === "ArrowDown" ? 0 : u.length - 1);
        }, 0);
        return;
      }
      if (!s) return;
      const h = d.indexOf(document.activeElement);
      if (l.key === "ArrowDown") {
        l.preventDefault();
        const u = h < d.length - 1 ? h + 1 : 0;
        o._focusItem(d, u);
      } else if (l.key === "ArrowUp") {
        l.preventDefault();
        const u = h > 0 ? h - 1 : d.length - 1;
        o._focusItem(d, u);
      } else l.key === "Home" ? (l.preventDefault(), o._focusItem(d, 0)) : l.key === "End" && (l.preventDefault(), o._focusItem(d, d.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(l) {
      !l.detail || l.detail.target !== o.toggleEl || (o.triggerBtn && o.triggerBtn.setAttribute("aria-expanded", "true"), typeof o.toggleEl.showPopover == "function" && o.toggleEl.showPopover(), o._initMenuAria(), o._reposition(), o._addOutsideClickListener(), o._addScrollRepositionListener(), o._addResizeCloseListener(), L(f, "ln-dropdown:open", { target: l.detail.target }));
    }, this._onToggleClose = function(l) {
      !l.detail || l.detail.target !== o.toggleEl || (o.triggerBtn && o.triggerBtn.setAttribute("aria-expanded", "false"), o._removeOutsideClickListener(), o._removeScrollRepositionListener(), o._removeResizeCloseListener(), o.toggleEl.style.top = "", o.toggleEl.style.left = "", o.toggleEl.removeAttribute(y), typeof o.toggleEl.hidePopover == "function" && o.toggleEl.matches(":popover-open") && o.toggleEl.hidePopover(), L(f, "ln-dropdown:close", { target: l.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  m.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const f = this.toggleEl.querySelectorAll("li");
    for (const l of f)
      l.setAttribute("role", "none");
    const o = this._getMenuItems();
    for (let l = 0; l < o.length; l++)
      o[l].setAttribute("role", "menuitem"), o[l].setAttribute("tabindex", l === 0 ? "0" : "-1");
  }, m.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, m.prototype._focusItem = function(f, o) {
    for (let l = 0; l < f.length; l++)
      f[l].setAttribute("tabindex", l === o ? "0" : "-1");
    f[o] && f[o].focus();
  }, m.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const f = this.triggerBtn.getBoundingClientRect(), o = $t(this.toggleEl), l = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, s = this.dom.getAttribute(b) || _, d = Pt(f, o, s, l);
    this.toggleEl.style.top = d.top + "px", this.toggleEl.style.left = d.left + "px", this.toggleEl.setAttribute(y, d.placement);
  }, m.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const f = this;
    this._boundDocClick = function(o) {
      f.dom.contains(o.target) || f.toggleEl && f.toggleEl.contains(o.target) || f.toggleEl && f.toggleEl.getAttribute("data-ln-toggle") === "open" && f.toggleEl.setAttribute("data-ln-toggle", "close");
    }, f._docClickTimeout = setTimeout(function() {
      f._docClickTimeout = null, document.addEventListener("click", f._boundDocClick);
    }, 0);
  }, m.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, m.prototype._addScrollRepositionListener = function() {
    const f = this;
    this._boundScrollReposition = function() {
      f._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, m.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, m.prototype._addResizeCloseListener = function() {
    const f = this;
    this._boundResizeClose = function() {
      f.toggleEl && f.toggleEl.getAttribute("data-ln-toggle") === "open" && f.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, m.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, m.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute(y), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), L(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[a]);
  }, z(c, a, m, "ln-dropdown");
})();
(function() {
  const c = "data-ln-popover", a = "lnPopover", b = "data-ln-popover-for", y = "data-ln-popover-position";
  if (window[a] !== void 0) return;
  const _ = [];
  let m = null;
  function f() {
    m || (m = function(d) {
      if (d.key !== "Escape" || _.length === 0) return;
      _[_.length - 1].close();
    }, document.addEventListener("keydown", m));
  }
  function o() {
    _.length > 0 || m && (document.removeEventListener("keydown", m), m = null);
  }
  function l(d) {
    this.dom = d, this.isOpen = d.getAttribute(c) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const h = this;
    return this._onRequestOpen = function(u) {
      const g = u.detail && u.detail.trigger ? u.detail.trigger : null;
      h.open(g);
    }, this._onRequestClose = function() {
      h.close();
    }, this._onRequestToggle = function(u) {
      const g = u.detail && u.detail.trigger ? u.detail.trigger : null;
      h.toggle(g);
    }, d.addEventListener("ln-popover:request-open", this._onRequestOpen), d.addEventListener("ln-popover:request-close", this._onRequestClose), d.addEventListener("ln-popover:request-toggle", this._onRequestToggle), d.hasAttribute("tabindex") || d.setAttribute("tabindex", "-1"), d.hasAttribute("role") || d.setAttribute("role", "dialog"), d.hasAttribute("popover") || d.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  l.prototype.open = function(d) {
    this.isOpen || (this.trigger = d || null, this.dom.setAttribute(c, "open"));
  }, l.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(c, "closed");
  }, l.prototype.toggle = function(d) {
    this.isOpen ? this.close() : this.open(d);
  }, l.prototype._applyOpen = function(d) {
    this.isOpen = !0, d && (this.trigger = d), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const h = $t(this.dom);
    if (this.trigger) {
      const r = this.trigger.getBoundingClientRect(), t = this.dom.getAttribute(y) || "bottom", e = Pt(r, h, t, 8);
      this.dom.style.top = e.top + "px", this.dom.style.left = e.left + "px", this.dom.setAttribute("data-ln-popover-placement", e.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const u = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), g = Array.prototype.find.call(u, Ft);
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
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), _.push(this), f(), L(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, l.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const d = _.indexOf(this);
    d !== -1 && _.splice(d, 1), o(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, L(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, l.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[a], L(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function s(d) {
    this.dom = d;
    const h = d.getAttribute(b);
    return d.setAttribute("aria-haspopup", "dialog"), d.setAttribute("aria-expanded", "false"), d.setAttribute("aria-controls", h), this._onClick = function(u) {
      if (u.ctrlKey || u.metaKey || u.button === 1) return;
      u.preventDefault();
      const g = document.getElementById(h);
      if (!g) return;
      g[a] && (g[a].trigger = d);
      const i = g.getAttribute(c);
      g.setAttribute(c, i === "open" ? "closed" : "open");
    }, d.addEventListener("click", this._onClick), this;
  }
  s.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[a + "Trigger"];
  }, z(c, a, l, "ln-popover", {
    onAttributeChange: function(d) {
      const h = d[a];
      if (!h) return;
      const g = d.getAttribute(c) === "open";
      if (g !== h.isOpen)
        if (g) {
          if (X(d, "ln-popover:before-open", {
            popoverId: d.id,
            target: d,
            trigger: h.trigger
          }).defaultPrevented) {
            d.setAttribute(c, "closed");
            return;
          }
          h._applyOpen(h.trigger);
        } else {
          if (X(d, "ln-popover:before-close", {
            popoverId: d.id,
            target: d,
            trigger: h.trigger
          }).defaultPrevented) {
            d.setAttribute(c, "open");
            return;
          }
          h._applyClose();
        }
    }
  }), z(b, a + "Trigger", s, "ln-popover-trigger");
})();
(function() {
  const c = "data-ln-tooltip-enhance", a = "data-ln-tooltip", b = "data-ln-tooltip-position", y = "lnTooltipEnhance", _ = "ln-tooltip-portal";
  if (window[y] !== void 0) return;
  let m = 0, f = null, o = null, l = null, s = null, d = null, h = null;
  function u() {
    return f && f.parentNode || (f = document.getElementById(_), f || (f = document.createElement("div"), f.id = _, document.body.appendChild(f)), f.hasAttribute("popover") || f.setAttribute("popover", "manual")), f;
  }
  function g() {
    h || (h = function(n) {
      n.key === "Escape" && t();
    }, document.addEventListener("keydown", h));
  }
  function i() {
    h && (document.removeEventListener("keydown", h), h = null);
  }
  function r(n) {
    if (l === n) return;
    t();
    const p = n.getAttribute(a) || n.getAttribute("title");
    if (!p) return;
    u(), typeof f.showPopover == "function" && f.showPopover(), n.hasAttribute("title") && (s = n.getAttribute("title"), n.removeAttribute("title"));
    const v = n.getAttribute("aria-describedby");
    v ? d = v : d = null;
    const E = document.createElement("div");
    E.className = "ln-tooltip", E.textContent = p, n[y + "Uid"] || (m += 1, n[y + "Uid"] = "ln-tooltip-" + m), E.id = n[y + "Uid"], f.appendChild(E);
    const w = E.offsetWidth, A = E.offsetHeight, S = n.getBoundingClientRect(), T = n.getAttribute(b) || "top", x = Pt(S, { width: w, height: A }, T, 6);
    E.style.top = x.top + "px", E.style.left = x.left + "px", E.setAttribute("data-ln-tooltip-placement", x.placement), d ? n.setAttribute("aria-describedby", d + " " + E.id) : n.setAttribute("aria-describedby", E.id), o = E, l = n, g();
  }
  function t() {
    if (!o) {
      i();
      return;
    }
    l && (d !== null ? l.setAttribute("aria-describedby", d) : l.removeAttribute("aria-describedby"), d = null, s !== null && l.setAttribute("title", s)), s = null, o.parentNode && o.parentNode.removeChild(o), o = null, l = null, f && typeof f.hidePopover == "function" && f.matches(":popover-open") && f.hidePopover(), i();
  }
  function e(n) {
    return this.dom = n, n.hasAttribute("data-ln-tooltip-enhanced") || (n.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      r(n);
    }, this._onLeave = function() {
      l === n && !n.contains(document.activeElement) && t();
    }, this._onFocus = function() {
      r(n);
    }, this._onBlur = function() {
      l === n && !n.matches(":hover") && t();
    }, n.addEventListener("mouseenter", this._onEnter), n.addEventListener("mouseleave", this._onLeave), n.addEventListener("focus", this._onFocus, !0), n.addEventListener("blur", this._onBlur, !0), this;
  }
  e.prototype.destroy = function() {
    const n = this.dom;
    n.removeEventListener("mouseenter", this._onEnter), n.removeEventListener("mouseleave", this._onLeave), n.removeEventListener("focus", this._onFocus, !0), n.removeEventListener("blur", this._onBlur, !0), l === n && t(), this._addedEnhancedAttr && n.removeAttribute("data-ln-tooltip-enhanced"), delete n[y], delete n[y + "Uid"], L(n, "ln-tooltip:destroyed", { trigger: n });
  }, z(
    "[" + c + "], [data-ln-tooltip-enhanced], [" + a + "][title]",
    y,
    e,
    "ln-tooltip"
  );
})();
(function() {
  const c = "data-ln-toast", a = "lnToast", b = "ln-toast-item";
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
  function m(r) {
    if (!r || r.nodeType !== 1) return;
    const t = Array.from(r.querySelectorAll("[" + c + "]"));
    r.hasAttribute && r.hasAttribute(c) && t.push(r);
    for (const e of t)
      e[a] || new f(e);
  }
  function f(r) {
    this.dom = r, r[a] = this, this.timeoutDefault = parseInt(r.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(r.getAttribute("data-ln-toast-max") || "5", 10);
    const t = Array.from(r.querySelectorAll("[data-ln-toast-item]"));
    for (; t.length > this.max; ) r.removeChild(t.shift());
    for (const e of t) u(e, this);
    return t.length > 0 && y(r), this;
  }
  f.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const r of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        d(r);
      _(this.dom), delete this.dom[a];
    }
  };
  function o(r, t) {
    const e = ((r.type || "") + "").trim().toLowerCase(), n = _t(t, b, "ln-toast");
    if (!n)
      return console.warn('[ln-toast] Template "' + b + '" not found'), null;
    lt(n, {
      type: e,
      title: r.title,
      message: typeof r.message == "string" ? r.message : void 0
    });
    const p = n.firstElementChild;
    if (!p) return null;
    p.hasAttribute("data-ln-toast-item") || p.setAttribute("data-ln-toast-item", ""), p.classList.add("ln-enter");
    const v = p.querySelector(".body");
    v && l(v, r);
    const E = p.querySelector("[data-ln-toast-close]");
    return E && E.addEventListener("click", function() {
      d(p);
    }), p;
  }
  function l(r, t) {
    if (Array.isArray(t.message)) {
      const e = document.createElement("ul");
      for (const n of t.message) {
        const p = document.createElement("li");
        p.textContent = n, e.appendChild(p);
      }
      r.appendChild(e);
    }
    if (t.data && t.data.errors) {
      const e = document.createElement("ul");
      for (const n of Object.values(t.data.errors).flat()) {
        const p = document.createElement("li");
        p.textContent = n, e.appendChild(p);
      }
      r.appendChild(e);
    }
  }
  function s(r, t) {
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
  function h(r) {
    let t = r && r.container;
    return typeof t == "string" && (t = document.querySelector(t)), t instanceof HTMLElement || (t = document.querySelector("[" + c + "]") || document.getElementById("ln-toast-container")), t || null;
  }
  function u(r, t) {
    if (r._lnToastHydrated) return;
    r._lnToastHydrated = !0;
    const e = r.querySelector("[data-ln-toast-close]");
    e && e.addEventListener("click", function() {
      d(r);
    });
    const n = r.getAttribute("data-ln-toast-timeout"), p = n !== null ? parseInt(n, 10) : NaN, v = Number.isFinite(p) ? p : t.timeoutDefault;
    v > 0 && (r._timer = setTimeout(function() {
      d(r);
    }, v));
  }
  function g(r) {
    const t = r.detail || {}, e = h(t);
    if (!e) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const n = e[a] || new f(e), p = o(t, e);
    if (!p) return;
    const v = Number.isFinite(t.timeout) ? t.timeout : n.timeoutDefault;
    s(n, p), v > 0 && (p._timer = setTimeout(() => d(p), v));
  }
  function i(r) {
    const t = r && r.detail || {};
    if (t.container) {
      const e = h(t);
      if (e)
        for (const n of Array.from(e.querySelectorAll("[data-ln-toast-item]"))) d(n);
    } else {
      const e = document.querySelectorAll("[" + c + "]");
      for (const n of Array.from(e))
        for (const p of Array.from(n.querySelectorAll("[data-ln-toast-item]"))) d(p);
    }
  }
  ft(function() {
    window.addEventListener("ln-toast:enqueue", g), window.addEventListener("ln-toast:clear", i), window.addEventListener("ln-modal:open", function() {
      const t = document.querySelectorAll("[" + c + "]");
      for (const e of Array.from(t))
        e.querySelectorAll("[data-ln-toast-item]").length > 0 && y(e);
    }), new MutationObserver(function(t) {
      for (const e of t) {
        if (e.type === "attributes") {
          m(e.target);
          continue;
        }
        for (const n of e.addedNodes)
          m(n);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [c] }), m(document.body);
  }, "ln-toast");
})();
(function() {
  const c = "data-ln-upload", a = "lnUpload", b = "data-ln-upload-dict", y = "data-ln-upload-accept", _ = "data-ln-upload-context", m = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-icon-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function f() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const i = document.createElement("div");
    i.innerHTML = m;
    const r = i.firstElementChild;
    r && document.body.appendChild(r);
  }
  if (window[a] !== void 0) return;
  function o(i) {
    if (i === 0) return "0 B";
    const r = 1024, t = ["B", "KB", "MB", "GB"], e = Math.floor(Math.log(i) / Math.log(r));
    return parseFloat((i / Math.pow(r, e)).toFixed(1)) + " " + t[e];
  }
  function l(i) {
    return i.split(".").pop().toLowerCase();
  }
  function s(i) {
    return i === "docx" && (i = "doc"), ["pdf", "doc", "epub"].includes(i) ? "ln-icon-custom-file-" + i : "ln-icon-file";
  }
  function d(i, r) {
    if (!r) return !0;
    const t = "." + l(i.name);
    return r.split(",").map(function(n) {
      return n.trim().toLowerCase();
    }).includes(t.toLowerCase());
  }
  function h(i) {
    if (i.lnUploadAPI) return;
    f();
    const r = te(i, b), t = i.querySelector(".ln-upload__zone"), e = i.querySelector(".ln-upload__list"), n = i.getAttribute(y) || "";
    if (!t || !e) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", i);
      return;
    }
    let p = i.querySelector('input[type="file"]');
    p || (p = document.createElement("input"), p.type = "file", p.multiple = !0, p.classList.add("hidden"), n && (p.accept = n.split(",").map(function(H) {
      return H = H.trim(), H.startsWith(".") ? H : "." + H;
    }).join(",")), i.appendChild(p));
    const v = i.getAttribute(c) || "/files/upload", E = i.getAttribute(_) || "", w = i.getAttribute("data-ln-upload-delete") || (v.includes("/upload") ? v.replace(/\/upload\/?$/, "/{id}") : v + "/{id}"), A = /* @__PURE__ */ new Map();
    let S = 0;
    function T() {
      const H = document.querySelector('meta[name="csrf-token"]');
      return H ? H.getAttribute("content") : "";
    }
    function x(H) {
      if (!d(H, n)) {
        const q = r["invalid-type"];
        L(i, "ln-upload:invalid", {
          file: H,
          message: q
        }), L(window, "ln-toast:enqueue", {
          type: "error",
          title: r["invalid-title"] || "Invalid File",
          message: q || r["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const W = "file-" + ++S, J = l(H.name), Tt = s(J), pt = _t(i, "ln-upload-item", "ln-upload");
      if (!pt) return;
      const ot = pt.firstElementChild;
      if (!ot) return;
      ot.setAttribute("data-file-id", W), lt(ot, {
        name: H.name,
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
      ut.append("file", H);
      const Ot = /* @__PURE__ */ new Set();
      i.querySelectorAll("input, select, textarea").forEach(function(q) {
        if (q.name && q.name !== "file_ids[]" && q.type !== "file") {
          if ((q.type === "checkbox" || q.type === "radio") && !q.checked)
            return;
          ut.append(q.name, q.value), Ot.add(q.name);
        }
      }), !Ot.has("context") && E && ut.append("context", E);
      const Z = new XMLHttpRequest();
      Z.upload.addEventListener("progress", function(q) {
        if (q.lengthComputable) {
          const D = Math.round(q.loaded / q.total * 100);
          qt.style.width = D + "%", lt(ot, { sizeText: D + "%" });
        }
      }), Z.addEventListener("load", function() {
        if (Z.status >= 200 && Z.status < 300) {
          let q;
          try {
            q = JSON.parse(Z.responseText);
          } catch {
            C("Invalid response");
            return;
          }
          lt(ot, { sizeText: o(q.size || H.size), uploading: !1 }), mt && (mt.disabled = !1), A.set(W, {
            serverId: q.id,
            name: q.name,
            size: q.size
          }), I(), L(i, "ln-upload:uploaded", {
            localId: W,
            serverId: q.id,
            name: q.name
          });
        } else {
          let q = r["upload-failed"] || "Upload failed";
          try {
            q = JSON.parse(Z.responseText).message || q;
          } catch {
          }
          C(q);
        }
      }), Z.addEventListener("error", function() {
        C(r["network-error"] || "Network error");
      });
      function C(q) {
        qt && (qt.style.width = "100%"), lt(ot, { sizeText: r.error || "Error", uploading: !1, error: !0 }), mt && (mt.disabled = !1), L(i, "ln-upload:error", {
          file: H,
          message: q
        }), L(window, "ln-toast:enqueue", {
          type: "error",
          title: r["error-title"] || "Upload Error",
          message: q || r["upload-failed"] || "Failed to upload file"
        });
      }
      Z.open("POST", v), Z.setRequestHeader("X-CSRF-TOKEN", T()), Z.setRequestHeader("Accept", "application/json"), Z.send(ut);
    }
    function I() {
      for (const H of i.querySelectorAll('input[name="file_ids[]"]'))
        H.remove();
      for (const [, H] of A) {
        const W = document.createElement("input");
        W.type = "hidden", W.name = "file_ids[]", W.value = H.serverId, i.appendChild(W);
      }
    }
    function k(H) {
      const W = A.get(H), J = e.querySelector('[data-file-id="' + H + '"]');
      if (!W || !W.serverId) {
        J && J.remove(), A.delete(H), I();
        return;
      }
      J && lt(J, { deleting: !0 });
      const Tt = w.replace("{id}", W.serverId);
      fetch(Tt, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": T(),
          Accept: "application/json"
        }
      }).then(function(pt) {
        pt.status === 200 ? (J && J.remove(), A.delete(H), I(), L(i, "ln-upload:removed", {
          localId: H,
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
    function R(H) {
      for (const W of H)
        x(W);
      p.value = "";
    }
    const N = function() {
      p.click();
    }, K = function() {
      R(this.files);
    }, P = function(H) {
      H.preventDefault(), H.stopPropagation(), t.classList.add("ln-upload__zone--dragover");
    }, U = function(H) {
      H.preventDefault(), H.stopPropagation(), t.classList.add("ln-upload__zone--dragover");
    }, j = function(H) {
      H.preventDefault(), H.stopPropagation(), t.classList.remove("ln-upload__zone--dragover");
    }, et = function(H) {
      H.preventDefault(), H.stopPropagation(), t.classList.remove("ln-upload__zone--dragover"), R(H.dataTransfer.files);
    }, Lt = function(H) {
      const W = H.target.closest('[data-ln-upload-action="remove"]');
      if (!W || !e.contains(W) || W.disabled) return;
      const J = W.closest(".ln-upload__item");
      J && k(J.getAttribute("data-file-id"));
    };
    t.addEventListener("click", N), p.addEventListener("change", K), t.addEventListener("dragenter", P), t.addEventListener("dragover", U), t.addEventListener("dragleave", j), t.addEventListener("drop", et), e.addEventListener("click", Lt), i.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(A.values()).map(function(H) {
          return H.serverId;
        });
      },
      getFiles: function() {
        return Array.from(A.values());
      },
      clear: function() {
        for (const [, H] of A)
          if (H.serverId) {
            const W = w.replace("{id}", H.serverId);
            fetch(W, {
              method: "DELETE",
              headers: {
                "X-CSRF-TOKEN": T(),
                Accept: "application/json"
              }
            });
          }
        A.clear(), e.innerHTML = "", I(), L(i, "ln-upload:cleared", {});
      },
      destroy: function() {
        t.removeEventListener("click", N), p.removeEventListener("change", K), t.removeEventListener("dragenter", P), t.removeEventListener("dragover", U), t.removeEventListener("dragleave", j), t.removeEventListener("drop", et), e.removeEventListener("click", Lt), A.clear(), e.innerHTML = "", I(), delete i.lnUploadAPI;
      }
    };
  }
  function u() {
    for (const i of document.querySelectorAll("[" + c + "]"))
      h(i);
  }
  function g() {
    ft(function() {
      new MutationObserver(function(r) {
        for (const t of r)
          if (t.type === "childList") {
            for (const e of t.addedNodes)
              if (e.nodeType === 1) {
                e.hasAttribute(c) && h(e);
                for (const n of e.querySelectorAll("[" + c + "]"))
                  h(n);
              }
          } else t.type === "attributes" && t.target.hasAttribute(c) && h(t.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [c]
      });
    }, "ln-upload");
  }
  window[a] = {
    init: h,
    initAll: u
  }, g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", u) : u();
})();
(function() {
  const c = "lnExternalLinks";
  if (window[c] !== void 0) return;
  function a(o) {
    return o.hostname && o.hostname !== window.location.hostname;
  }
  function b(o) {
    if (o.getAttribute("data-ln-external-link") === "processed" || !a(o)) return;
    o.target = "_blank";
    const l = (o.rel || "").split(/\s+/).filter(Boolean);
    l.includes("noopener") || l.push("noopener"), l.includes("noreferrer") || l.push("noreferrer"), o.rel = l.join(" ");
    const s = document.createElement("span");
    s.className = "sr-only", s.textContent = "(opens in new tab)", o.appendChild(s), o.setAttribute("data-ln-external-link", "processed"), L(o, "ln-external-links:processed", {
      link: o,
      href: o.href
    });
  }
  function y(o) {
    o = o || document.body;
    for (const l of o.querySelectorAll("a, area"))
      b(l);
  }
  function _() {
    ft(function() {
      document.body.addEventListener("click", function(o) {
        const l = o.target.closest("a, area");
        l && l.getAttribute("data-ln-external-link") === "processed" && L(l, "ln-external-links:clicked", {
          link: l,
          href: l.href,
          text: l.textContent || l.title || ""
        });
      });
    }, "ln-external-links");
  }
  function m() {
    ft(function() {
      new MutationObserver(function(l) {
        for (const s of l) {
          if (s.type === "childList") {
            for (const d of s.addedNodes)
              if (d.nodeType === 1 && (d.matches && (d.matches("a") || d.matches("area")) && b(d), d.querySelectorAll))
                for (const h of d.querySelectorAll("a, area"))
                  b(h);
          }
          if (s.type === "attributes" && s.attributeName === "href") {
            const d = s.target;
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
  function f() {
    _(), m(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      y();
    }) : y();
  }
  window[c] = {
    process: y
  }, f();
})();
(function() {
  const c = "data-ln-link", a = "lnLink";
  if (window[a] !== void 0) return;
  let b = null;
  function y() {
    b = document.createElement("div"), b.className = "ln-link-status", document.body.appendChild(b);
  }
  function _(e) {
    b && (b.textContent = e, b.classList.add("ln-link-status--visible"));
  }
  function m() {
    b && b.classList.remove("ln-link-status--visible");
  }
  function f(e, n) {
    if (n.target.closest("a, button, input, select, textarea")) return;
    const p = e.querySelector("a");
    if (!p) return;
    const v = p.getAttribute("href");
    if (!v) return;
    if (n.ctrlKey || n.metaKey || n.button === 1) {
      window.open(v, "_blank");
      return;
    }
    X(e, "ln-link:navigate", { target: e, href: v, link: p }).defaultPrevented || p.click();
  }
  function o(e) {
    const n = e.querySelector("a");
    if (!n) return;
    const p = n.getAttribute("href");
    p && _(p);
  }
  function l() {
    m();
  }
  function s(e) {
    e[a + "Row"] || !e.querySelector("a") || (e[a + "Row"] = !0, e._lnLinkClick = function(p) {
      f(e, p);
    }, e._lnLinkEnter = function() {
      o(e);
    }, e.addEventListener("click", e._lnLinkClick), e.addEventListener("mouseenter", e._lnLinkEnter), e.addEventListener("mouseleave", l));
  }
  function d(e) {
    e[a + "Row"] && (e._lnLinkClick && e.removeEventListener("click", e._lnLinkClick), e._lnLinkEnter && e.removeEventListener("mouseenter", e._lnLinkEnter), e.removeEventListener("mouseleave", l), delete e._lnLinkClick, delete e._lnLinkEnter, delete e[a + "Row"]);
  }
  function h(e) {
    if (!e[a + "Init"]) return;
    const n = e.tagName;
    if (n === "TABLE" || n === "TBODY") {
      const p = n === "TABLE" && e.querySelector("tbody") || e;
      for (const v of p.querySelectorAll("tr"))
        d(v);
    } else
      d(e);
    delete e[a + "Init"];
  }
  function u(e) {
    if (e[a + "Init"]) return;
    e[a + "Init"] = !0;
    const n = e.tagName;
    if (n === "TABLE" || n === "TBODY") {
      const p = n === "TABLE" && e.querySelector("tbody") || e;
      for (const v of p.querySelectorAll("tr"))
        s(v);
    } else
      s(e);
  }
  function g(e) {
    e.hasAttribute && e.hasAttribute(c) && u(e);
    const n = e.querySelectorAll ? e.querySelectorAll("[" + c + "]") : [];
    for (const p of n)
      u(p);
  }
  function i() {
    ft(function() {
      new MutationObserver(function(n) {
        for (const p of n)
          if (p.type === "childList") {
            for (const v of p.addedNodes)
              if (v.nodeType === 1) {
                g(v);
                const E = v.closest("[" + c + "]");
                if (E)
                  if (v.tagName === "TR")
                    s(v);
                  else {
                    const w = E.tagName;
                    if (w === "TABLE" || w === "TBODY") {
                      const A = v.querySelectorAll ? v.querySelectorAll("tr") : [];
                      for (const S of A)
                        s(S);
                    }
                  }
              }
          } else p.type === "attributes" && (p.target.hasAttribute && p.target.hasAttribute(c) ? g(p.target) : h(p.target));
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [c]
      });
    }, "ln-link");
  }
  function r(e) {
    g(e);
  }
  window[a] = { init: r, destroy: h };
  function t() {
    y(), i(), r(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t) : t();
})();
(function() {
  const c = "[data-ln-progress]", a = "lnProgress";
  if (window[a] !== void 0) return;
  function b(f) {
    return this.dom = f, this._attrObserver = null, this._parentObserver = null, m.call(this), y.call(this), _.call(this), this;
  }
  b.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[a]);
  };
  function y() {
    const f = this, o = new MutationObserver(function(l) {
      for (const s of l)
        (s.attributeName === "data-ln-progress" || s.attributeName === "data-ln-progress-max") && m.call(f);
    });
    o.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = o;
  }
  function _() {
    const f = this, o = this.dom.parentElement;
    if (!o) return;
    const l = new MutationObserver(function(s) {
      for (const d of s)
        d.attributeName === "data-ln-progress-max" && m.call(f);
    });
    l.observe(o, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = l;
  }
  function m() {
    const f = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, o = this.dom.parentElement, s = (o && o.hasAttribute("data-ln-progress-max") ? parseFloat(o.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let d = s > 0 ? f / s * 100 : 0;
    d < 0 && (d = 0), d > 100 && (d = 100), this.dom.style.width = d + "%";
    const h = Math.max(0, Math.min(f, s));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(s)), this.dom.setAttribute("aria-valuenow", String(h)), L(this.dom, "ln-progress:change", { target: this.dom, value: f, max: s, percentage: d });
  }
  z(
    c,
    a,
    b,
    "ln-progress"
  );
})();
(function() {
  const c = "data-ln-filter", a = "lnFilter", b = "data-ln-filter-key", y = "data-ln-filter-value", _ = "data-ln-filter-hide", m = "data-ln-filter-reset", f = "data-ln-filter-col", o = "data-ln-hash", l = /* @__PURE__ */ new WeakMap();
  if (window[a] !== void 0) return;
  function s(r) {
    return r.hasAttribute(m) || r.getAttribute(y) === "";
  }
  function d(r) {
    const t = r.dom.querySelectorAll("[" + b + "]");
    let e = null;
    const n = [];
    for (let p = 0; p < t.length; p++) {
      const v = t[p];
      if (e || (e = v.getAttribute(b)), v.checked && !s(v)) {
        const E = v.getAttribute(y);
        E && n.push(E);
      }
    }
    return { key: e, values: n, targetId: r.targetId };
  }
  function h(r, t, e) {
    const n = r.querySelectorAll("[" + b + "]"), p = Array.isArray(e) && e.length > 0;
    for (let v = 0; v < n.length; v++) {
      const E = n[v];
      s(E) ? E.checked = !p : p && E.getAttribute(b) === t && e.indexOf(E.getAttribute(y)) !== -1 ? E.checked = !0 : E.checked = !1;
    }
  }
  function u(r, t) {
    if (r.length !== t.length) return !0;
    for (let e = 0; e < r.length; e++) if (r[e] !== t[e]) return !0;
    return !1;
  }
  function g(r) {
    this.dom = r, this.targetId = r.getAttribute(c);
    const t = r.getAttribute(f);
    this.colIndex = t !== null ? parseInt(t, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = vt(r, "filter"), this.hashEnabled = !!this.nsKey;
    const e = this, n = ne(
      function() {
        e._render();
      }
    );
    this._queueRender = n, this._attachHandlers(), this._onHashChange = function() {
      if (e._destroyed || !e.hashEnabled) return;
      const v = rt(e.nsKey), E = Qt(v);
      E && E.key && E.values.length > 0 ? h(e.dom, E.key, E.values) : h(e.dom, null, []), e._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let p = !1;
    if (this.hashEnabled) {
      const v = rt(this.nsKey), E = Qt(v);
      E && E.key && E.values.length > 0 && (h(r, E.key, E.values), ct(function() {
        e._destroyed || e._render();
      }), p = !0);
    }
    if (!p && r.hasAttribute("data-ln-persist")) {
      const v = Bt("filter", r);
      v && v.key && Array.isArray(v.values) && v.values.length > 0 && (h(r, v.key, v.values), ct(function() {
        e._destroyed || e._render();
      }), p = !0);
    }
    if (!p) {
      const v = r.querySelectorAll("[" + b + "]");
      for (let E = 0; E < v.length; E++)
        if (v[E].checked && !s(v[E])) {
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
      if (s(e)) {
        for (let p = 0; p < n.length; p++)
          s(n[p]) || (n[p].checked = !1);
        e.checked = !0, r._queueRender();
        return;
      }
      if (e.checked) {
        for (let v = 0; v < n.length; v++)
          s(n[v]) && (n[v].checked = !1);
        let p = !1;
        for (let v = 0; v < n.length; v++)
          if (s(n[v])) {
            p = !0;
            break;
          }
        if (p) {
          let v = !0;
          for (let E = 0; E < n.length; E++)
            if (!s(n[E]) && !n[E].checked) {
              v = !1;
              break;
            }
          if (v)
            for (let E = 0; E < n.length; E++)
              s(n[E]) ? n[E].checked = !0 : n[E].checked = !1;
        }
      } else {
        let p = !1;
        for (let v = 0; v < n.length; v++)
          if (!s(n[v]) && n[v].checked) {
            p = !0;
            break;
          }
        if (!p)
          for (let v = 0; v < n.length; v++)
            s(n[v]) && (n[v].checked = !0);
      }
      r._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, g.prototype._render = function() {
    const r = this, t = d(this), e = this._lastSnapshot;
    if (!(!e || e.key !== t.key || u(e.values, t.values))) return;
    const p = t.key === null || t.values.length === 0, v = document.getElementById(r.targetId), E = {
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
    const T = [];
    for (let x = 0; x < t.values.length; x++)
      T.push(t.values[x].toLowerCase());
    if (r.colIndex !== null)
      r._filterTableRows(t);
    else {
      if (!v) return;
      const x = v.children;
      for (let I = 0; I < x.length; I++) {
        const k = x[I];
        if (p) {
          k.removeAttribute(_);
          continue;
        }
        const R = k.getAttribute("data-" + t.key);
        k.removeAttribute(_), R !== null && T.indexOf(R.toLowerCase()) === -1 && k.setAttribute(_, "true");
      }
    }
  }, g.prototype._filterTableRows = function(r) {
    const t = document.getElementById(this.targetId);
    if (!t) return;
    const e = t.tagName === "TABLE" ? t : t.querySelector("table");
    if (!e) return;
    const n = r.key || this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex, p = r.values;
    l.has(e) || l.set(e, {});
    const v = l.get(e);
    if (n && p.length > 0) {
      const S = [];
      for (let T = 0; T < p.length; T++)
        S.push(p[T].toLowerCase());
      v[n] = { col: this.colIndex, values: S };
    } else n && delete v[n];
    const E = Object.keys(v), w = E.length > 0, A = e.tBodies;
    for (let S = 0; S < A.length; S++) {
      const T = A[S].rows;
      for (let x = 0; x < T.length; x++) {
        const I = T[x];
        if (!w) {
          I.removeAttribute(_);
          continue;
        }
        let k = !0;
        for (let R = 0; R < E.length; R++) {
          const N = v[E[R]], K = I.cells[N.col], P = K ? K.textContent.trim().toLowerCase() : "";
          if (N.values.indexOf(P) === -1) {
            k = !1;
            break;
          }
        }
        k ? I.removeAttribute(_) : I.setAttribute(_, "true");
      }
    }
  }, g.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this._destroyed = !0, this.colIndex !== null) {
        const r = document.getElementById(this.targetId);
        if (r) {
          const t = r.tagName === "TABLE" ? r : r.querySelector("table");
          if (t && l.has(t)) {
            const e = l.get(t), n = this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex;
            n && e[n] && delete e[n], Object.keys(e).length === 0 && l.delete(t);
          }
        }
      }
      this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[a];
    }
  };
  function i(r, t) {
    const e = r[a];
    !e || e._destroyed || t === o && (e.hashEnabled && e._onHashChange && window.removeEventListener("hashchange", e._onHashChange), e.nsKey = vt(r, "filter"), e.hashEnabled = !!e.nsKey, e.hashEnabled && window.addEventListener("hashchange", e._onHashChange));
  }
  z(c, a, g, "ln-filter", {
    extraAttributes: [o],
    onAttributeChange: i
  });
})();
(function() {
  const c = "data-ln-search", a = "lnSearch", b = "data-ln-search-for", y = "lnSearchControl", _ = "data-ln-search-items", m = "data-ln-search-fields", f = "data-ln-search-exclude", o = "data-ln-search-hide", l = "data-ln-hash";
  if (window[a] !== void 0) return;
  function d(w) {
    const A = vt(w, "search");
    if (A) return A;
    if (w.id) {
      const S = document.querySelector("[" + b + '="' + w.id + '"]');
      if (S) {
        const T = vt(S, "search");
        if (T) return T;
      }
    }
    return null;
  }
  function h(w) {
    return (w || "").trim().toLowerCase();
  }
  function u(w) {
    return w ? w.split(/\s+/).filter(Boolean) : [];
  }
  function g(w) {
    const A = w.tagName;
    return A === "INPUT" || A === "TEXTAREA" ? w : w.querySelector('[name="search"]') || w.querySelector('input[type="search"]') || w.querySelector('input[type="text"]');
  }
  function i(w) {
    const A = w.getAttribute(m);
    if (A === null) return null;
    const S = A.split(",").map(function(T) {
      return T.trim();
    }).filter(Boolean);
    return S.length ? S : null;
  }
  function r(w, A) {
    const S = w.childNodes;
    for (let T = 0; T < S.length; T++) {
      const x = S[T];
      if (x.nodeType === 3) {
        A.push(x.nodeValue);
        continue;
      }
      x.nodeType === 1 && (x.hasAttribute(f) || r(x, A));
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
    for (const T of S) {
      const x = T[y];
      x && clearTimeout(x._debounceTimer);
      const I = g(T);
      I && I.value !== A && (I.value = A);
    }
  }
  function n(w) {
    this.dom = w, this.term = w.getAttribute(c) || "", this._destroyed = !1;
    const A = this;
    return this.nsKey = d(w), this.hashEnabled = !!this.nsKey, this._observer = new MutationObserver(function(S) {
      for (let T = 0; T < S.length; T++) {
        const x = S[T];
        if (x.type === "childList" || x.type === "characterData") {
          const I = x.target;
          if (I && I._lnSearchText !== void 0 && delete I._lnSearchText, I && I.parentElement && I.parentElement._lnSearchText !== void 0 && delete I.parentElement._lnSearchText, x.addedNodes)
            for (let k = 0; k < x.addedNodes.length; k++) {
              const R = x.addedNodes[k];
              R._lnSearchText !== void 0 && delete R._lnSearchText;
            }
        }
      }
    }), this._observer.observe(w, { childList: !0, subtree: !0, characterData: !0 }), this._onHashChange = function() {
      if (A._destroyed || !A.hashEnabled) return;
      const S = rt(A.nsKey), T = A.dom.getAttribute(c) || "";
      S !== null && S !== T ? A.dom.setAttribute(c, S) : S === null && T !== "" && A.dom.setAttribute(c, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), ct(function() {
      if (!A._destroyed) {
        if (A.hashEnabled) {
          const S = rt(A.nsKey);
          if (S !== null && S !== A.term) {
            A.term = S, A.dom.setAttribute(c, S), e(A.dom, S), A._apply();
            return;
          }
        }
        h(A.term) && (e(A.dom, A.term), A._apply());
      }
    }), this;
  }
  n.prototype._apply = function() {
    const w = this.dom, A = h(this.term), S = u(A);
    if (this.hashEnabled && it(this.nsKey, this.term ? this.term : null), X(w, "ln-search:change", {
      term: A,
      tokens: S,
      targetId: w.id,
      fields: i(w)
    }).defaultPrevented) return;
    const x = w.getAttribute(_), I = x ? w.querySelectorAll(x) : w.children;
    for (let k = 0; k < I.length; k++) {
      const R = I[k];
      if (R.removeAttribute(o), R.hasAttribute(f) || S.length === 0) continue;
      const N = t(R);
      for (let K = 0; K < S.length; K++)
        if (N.indexOf(S[K]) === -1) {
          R.setAttribute(o, "true");
          break;
        }
    }
  }, n.prototype.destroy = function() {
    this.dom[a] && (this._destroyed = !0, this._observer && (this._observer.disconnect(), this._observer = null), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[a]);
  };
  function p(w) {
    this.dom = w, this.targetId = w.getAttribute(b), this.input = g(w);
    const A = w.getAttribute("data-ln-search-debounce");
    if (this.debounceTime = A !== null ? parseInt(A, 10) : 500, isNaN(this.debounceTime) && (this.debounceTime = 500), this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const S = this;
      ct(function() {
        const T = document.getElementById(S.targetId);
        T && ((T.getAttribute(c) || "").trim() || S._write(S.input.value));
      });
    }
    return this;
  }
  p.prototype._write = function(w) {
    const A = document.getElementById(this.targetId);
    A && A.setAttribute(c, w);
  }, p.prototype._attachHandler = function() {
    if (!this.input) return;
    const w = this;
    this._onInput = function() {
      clearTimeout(w._debounceTimer), w._debounceTimer = setTimeout(function() {
        w._write(w.input.value);
      }, w.debounceTime);
    }, this.input.addEventListener("input", this._onInput);
  }, p.prototype.destroy = function() {
    this.dom[y] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[y]);
  };
  function v(w) {
    const A = w.getAttribute("data-ln-search-clear-for");
    if (A) {
      const I = document.getElementById(A), k = document.querySelector("[" + b + '="' + A + '"]'), R = k ? g(k) : null;
      return { target: I, input: R };
    }
    const S = w.closest("[" + c + "]");
    if (S) {
      const I = S.id ? document.querySelector("[" + b + '="' + S.id + '"]') : null, k = I ? g(I) : null;
      return { target: S, input: k };
    }
    const T = w.closest("[" + b + "]");
    if (T) {
      const I = T.getAttribute(b), k = I ? document.getElementById(I) : null, R = g(T);
      return { target: k, input: R };
    }
    const x = w.parentElement;
    if (x) {
      const I = x.querySelector("[" + b + "]");
      if (I) {
        const k = I.getAttribute(b), R = k ? document.getElementById(k) : null, N = g(I);
        return { target: R, input: N };
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
      S.target && S.target.setAttribute(c, "");
    }
  });
  function E(w, A) {
    const S = w[a];
    if (!S || S._destroyed) return;
    if (A === l) {
      S.hashEnabled && S._onHashChange && window.removeEventListener("hashchange", S._onHashChange), S.nsKey = d(w), S.hashEnabled = !!S.nsKey, S.hashEnabled && window.addEventListener("hashchange", S._onHashChange);
      return;
    }
    const T = w.getAttribute(c) || "";
    T !== S.term && (S.term = T, e(w, T), S._apply());
  }
  z(c, a, n, "ln-search", {
    extraAttributes: [l],
    onAttributeChange: E
  }), z(b, y, p, "ln-search-control");
})();
(function() {
  const c = "data-ln-sort", a = "lnSort", b = "data-ln-sort-field", y = "data-ln-sort-state", _ = "data-ln-sort-dir", m = "data-ln-sort-items", f = "data-ln-hash";
  if (window[a] !== void 0) return;
  const o = /* @__PURE__ */ new WeakMap();
  function l(h, u) {
    if (u) {
      const g = h.querySelector('[data-ln-field="' + u + '"]');
      if (g) return Ct(g);
    }
    return Ct(h);
  }
  function s(h) {
    this.dom = h, this.targetId = h.getAttribute(c), this.field = h.getAttribute(b) || null;
    const u = h.closest("th");
    this.column = !this.field && u ? u.cellIndex : null, this.itemsSelector = h.getAttribute(m) || null, this._state = h.getAttribute(y) || "none", this._destroyed = !1, this.nsKey = vt(h, "sort"), this.hashEnabled = !!this.nsKey;
    const g = this;
    this._onClick = function(r) {
      const t = r.target.closest("[" + _ + "]");
      if (!t) return;
      const e = t.getAttribute(_);
      g._apply(e);
    }, h.addEventListener("click", this._onClick), this._onSortChange = function(r) {
      if (g._destroyed || !r.detail) return;
      const t = g._resolveTarget();
      if (!(t && (r.target === t || t.contains(r.target)) || r.detail.targetId && r.detail.targetId === g.targetId)) return;
      if (g.field !== null && r.detail.field === g.field || g.column !== null && r.detail.column === g.column) {
        r.detail.direction && h.getAttribute(y) !== r.detail.direction && (g._state = r.detail.direction, h.setAttribute(y, r.detail.direction), g._updateAriaSort(r.detail.direction));
        return;
      }
      h.getAttribute(y) !== "none" && (g._state = "none", h.setAttribute(y, "none"), g._updateAriaSort("none")), h.hasAttribute("data-ln-persist") && yt("sort", h, null);
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (g._destroyed || !g.hashEnabled) return;
      const r = rt(g.nsKey), t = Gt(r);
      if (t)
        g.field !== null && t.fieldOrColumn === g.field || g.column !== null && String(g.column) === t.fieldOrColumn ? g._state !== t.direction && g._apply(t.direction, !0) : g._state !== "none" && (g._state = "none", h.setAttribute(y, "none"), g._updateAriaSort("none"));
      else if (g._state !== "none") {
        g._state = "none", h.setAttribute(y, "none"), g._updateAriaSort("none");
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
    if (!i && h.hasAttribute("data-ln-persist")) {
      const r = Bt("sort", h);
      r && r.direction && r.direction !== "none" && ct(function() {
        g._destroyed || g._apply(r.direction, !0);
      }), i = !0;
    }
    if (!i) {
      const r = h.getAttribute(y);
      r && (r === "asc" || r === "desc") && ct(function() {
        g._destroyed || g._apply(r, !0);
      });
    }
    return this;
  }
  s.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, s.prototype._updateAriaSort = function(h) {
    const u = this.dom.closest("th");
    u && (h === "asc" ? u.setAttribute("aria-sort", "ascending") : h === "desc" ? u.setAttribute("aria-sort", "descending") : u.setAttribute("aria-sort", "none"));
  }, s.prototype._apply = function(h, u) {
    if (this._destroyed) return;
    this._state = h, this.dom.getAttribute(y) !== h && this.dom.setAttribute(y, h), this._updateAriaSort(h);
    const g = this._resolveTarget();
    if (!g) return;
    const i = {
      field: this.field,
      column: this.column,
      direction: h,
      targetId: this.targetId
    };
    if (!u && (this.dom.hasAttribute("data-ln-persist") && yt("sort", this.dom, h === "none" ? null : i), this.hashEnabled)) {
      const t = Le(this.field !== null ? this.field : this.column, h);
      it(this.nsKey, t);
    }
    X(g, "ln-sort:change", i).defaultPrevented || this._defaultSort(g, h);
  }, s.prototype._defaultSort = function(h, u) {
    const g = this.itemsSelector ? Array.from(h.querySelectorAll(this.itemsSelector)) : Array.from(h.children);
    if (!g.length) return;
    const i = g[0].parentNode;
    o.has(h) || o.set(h, g.slice());
    let r;
    if (u === "none")
      r = (o.get(h) || g).filter(function(n) {
        return n.parentNode === i;
      });
    else {
      const e = this.field, n = g.map(function(w) {
        return l(w, e);
      }), p = xt(n), v = typeof Intl < "u" ? new Intl.Collator($(this.dom), { sensitivity: "base" }) : null, E = u === "desc" ? -1 : 1;
      r = g.slice().sort(function(w, A) {
        return kt(l(w, e), l(A, e), p, v) * E;
      });
    }
    const t = document.createDocumentFragment();
    for (let e = 0; e < r.length; e++) t.appendChild(r[e]);
    i.appendChild(t);
  }, s.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[a]);
  };
  function d(h, u) {
    const g = h[a];
    if (!(!g || g._destroyed))
      if (u === b) {
        g.field = h.getAttribute(b) || null;
        const i = h.closest("th");
        g.column = !g.field && i ? i.cellIndex : null;
      } else if (u === m)
        g.itemsSelector = h.getAttribute(m) || null;
      else if (u === y) {
        const i = h.getAttribute(y) || "none";
        i !== g._state && g._apply(i);
      } else u === c ? g.targetId = h.getAttribute(c) : u === f && (g.hashEnabled && g._onHashChange && window.removeEventListener("hashchange", g._onHashChange), g.nsKey = vt(h, "sort"), g.hashEnabled = !!g.nsKey, g.hashEnabled && window.addEventListener("hashchange", g._onHashChange));
  }
  z(c, a, s, "ln-sort", {
    extraAttributes: [b, m, y, f],
    onAttributeChange: d
  });
})();
(function() {
  const c = "data-ln-table", a = "lnTable", b = "data-ln-table-empty";
  if (window[a] !== void 0) return;
  const l = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function s(i, r) {
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
  function h(i) {
    const r = i._scrollContainer || d(i.dom);
    return {
      container: r,
      top: r ? r.scrollTop : window.scrollY
    };
  }
  function u(i) {
    i.container ? i.container.scrollTop = i.top : window.scrollTo(window.scrollX, i.top);
  }
  function g(i) {
    this.dom = i, this.table = i.querySelector("table"), this.tbody = i.querySelector("[data-ln-table-body]") || i.querySelector("tbody"), this.thead = i.querySelector("thead");
    const r = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = r ? Array.from(r.querySelectorAll("th")) : [], this._totalSpan = i.querySelector("[data-ln-table-total]"), this._filteredSpan = i.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== i ? this._filteredSpan.parentElement : null), this._selectedSpan = i.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== i ? this._selectedSpan.parentElement : null), this.isDataDriven = i.hasAttribute("data-ln-table-source"), this.name = i.getAttribute(c) || "", this.source = i.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
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
      const p = n.getAttribute("data-ln-table-row-id"), v = n._lnRecord || {};
      L(i, "ln-table:row-click", {
        table: t.name,
        id: p,
        record: v
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(e) {
      const n = e.target.closest("[data-ln-table-row-action]");
      if (!n) return;
      e.stopPropagation();
      const p = n.closest("[data-ln-table-row]");
      if (!p) return;
      const v = n.getAttribute("data-ln-table-row-action"), E = p.getAttribute("data-ln-table-row-id"), w = p._lnRecord || {};
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
              const p = n[t._focusedRowIndex];
              L(i, "ln-table:row-click", {
                table: t.name,
                id: p.getAttribute("data-ln-table-row-id"),
                record: p._lnRecord || {}
              });
            }
            break;
          case " ":
            if (t._selectable && t._focusedRowIndex >= 0 && t._focusedRowIndex < n.length) {
              e.preventDefault();
              const p = n[t._focusedRowIndex].querySelector("[data-ln-table-row-select]");
              p && (p.checked = !p.checked, p.dispatchEvent(new Event("change", { bubbles: !0 })));
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
      const n = e.detail.key, p = e.detail.values || [];
      if (n) {
        if (p.length === 0)
          delete t._columnFilters[n];
        else {
          const v = [];
          for (let E = 0; E < p.length; E++)
            v.push(p[E].toLowerCase());
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
      const e = i[t], n = [], p = [], v = [];
      for (let w = 0; w < e.cells.length; w++) {
        const A = e.cells[w], S = A.textContent.trim();
        n[w] = Ct(A), p[w] = S.toLowerCase(), A.querySelector("[data-ln-table-row-action]") || v.push(S.toLowerCase());
      }
      let E = null;
      if (this.isDataDriven) {
        E = {};
        const w = e.getAttribute("data-ln-table-row-id");
        w != null && (E.id = w);
        for (let A = 0; A < r.length; A++) {
          const S = r[A].getAttribute("data-ln-table-col");
          if (S) {
            const T = A;
            if (T < e.cells.length) {
              const x = e.cells[T];
              E[S] = Ct(x);
            }
          }
        }
      }
      this._data.push({
        values: n,
        rawTexts: p,
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
        if (r.length > 0 && !r.every(function(T) {
          for (const x in A)
            if (A.hasOwnProperty(x) && typeof A[x] == "string" && x !== "html" && x !== "searchText" && A[x].toLowerCase().indexOf(T) !== -1)
              return !0;
          return !1;
        }))
          return !1;
        if (e)
          for (const S in t) {
            const T = t[S];
            if (T && T.length > 0) {
              const x = A[S], I = x != null ? String(x) : "";
              if (T.indexOf(I) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const n = this.currentSort.field, v = this.currentSort.direction === "desc" ? -1 : 1, E = this._filteredData.map(function(A) {
        return A[n];
      }), w = xt(E);
      this._filteredData.sort(function(A, S) {
        return kt(A[n], S[n], w, l) * v;
      });
    } else {
      const i = this._searchTerm, r = i ? i.split(/\s+/).filter(Boolean) : [], t = this._columnFilters, e = Object.keys(t).length > 0, n = this.ths, p = {};
      if (e)
        for (let S = 0; S < n.length; S++) {
          const T = n[S].getAttribute("data-ln-table-filter-col");
          T && (p[T] = S);
        }
      if (r.length === 0 && !e ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(S) {
        if (r.length > 0 && !r.every(function(x) {
          return S.searchText.indexOf(x) !== -1;
        }))
          return !1;
        if (e)
          for (const T in t) {
            const x = p[T];
            if (x !== void 0 && t[T].indexOf(S.rawTexts[x]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const v = this._sortCol, E = this._sortDir === "desc" ? -1 : 1, w = this._filteredData.map(function(S) {
        return S.values[v];
      }), A = xt(w);
      this._filteredData.sort(function(S, T) {
        return kt(S.values[v], T.values[v], A, l) * E;
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
      const t = h(this);
      this.tbody.textContent = "", this.tbody.appendChild(r), u(t), this._selectable && this._updateSelectAll();
    } else {
      const i = [], r = this._filteredData;
      for (let e = 0; e < r.length; e++) i.push(r[e].html);
      const t = h(this);
      this.tbody.innerHTML = i.join(""), u(t), this._selectable && this._restoreSelection();
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
    let p, v;
    if (n) {
      const x = this.table.getBoundingClientRect(), I = n.getBoundingClientRect(), k = x.top - I.top + n.scrollTop + e;
      p = n.scrollTop - k, v = n.clientHeight;
    } else {
      const k = this.table.getBoundingClientRect().top + window.scrollY + e;
      p = window.scrollY - k, v = window.innerHeight;
    }
    let E = Math.max(0, Math.floor(p / t) - 15);
    E = Math.min(E, r);
    const w = Math.min(E + Math.ceil(v / t) + 30, r);
    if (E === this._vStart && w === this._vEnd) return;
    this._vStart = E, this._vEnd = w;
    const A = this.ths.length || 1, S = E * t, T = (r - w) * t;
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
      if (T > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const R = document.createElement("td");
        R.setAttribute("colspan", A), R.style.height = T + "px", k.appendChild(R), x.appendChild(k);
      }
      const I = h(this);
      this.tbody.textContent = "", this.tbody.appendChild(x), u(I), this._selectable && this._updateSelectAll();
    } else {
      let x = "";
      S > 0 && (x += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + A + '" style="height:' + S + 'px;padding:0;border:none"></td></tr>');
      for (let k = E; k < w; k++) x += i[k].html;
      T > 0 && (x += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + A + '" style="height:' + T + 'px;padding:0;border:none"></td></tr>');
      const I = h(this);
      this.tbody.innerHTML = x, u(I), this._selectable && this._restoreSelection();
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
    let n, p;
    if (e) {
      const I = this.table.getBoundingClientRect(), k = e.getBoundingClientRect(), R = I.top - k.top + e.scrollTop + t;
      n = e.scrollTop - R, p = e.clientHeight;
    } else {
      const R = this.table.getBoundingClientRect().top + window.scrollY + t;
      n = window.scrollY - R, p = window.innerHeight;
    }
    let v = Math.max(0, Math.floor(n / i) - 15);
    v = Math.min(v, r);
    const E = Math.min(v + Math.ceil(p / i) + 30, r), w = this.ths.length || 1, A = v * i, S = (r - E) * i, T = document.createDocumentFragment();
    if (A > 0) {
      const I = document.createElement("tr");
      I.className = "ln-table__spacer", I.setAttribute("aria-hidden", "true");
      const k = document.createElement("td");
      k.setAttribute("colspan", w), k.style.height = A + "px", I.appendChild(k), T.appendChild(I);
    }
    for (let I = v; I < E; I++)
      if (this._cache.has(I)) {
        const k = this._buildRow(this._cache.get(I));
        k && T.appendChild(k);
      } else
        T.appendChild(this._buildPlaceholderRow());
    if (S > 0) {
      const I = document.createElement("tr");
      I.className = "ln-table__spacer", I.setAttribute("aria-hidden", "true");
      const k = document.createElement("td");
      k.setAttribute("colspan", w), k.style.height = S + "px", I.appendChild(k), T.appendChild(I);
    }
    const x = h(this);
    this.tbody.textContent = "", this.tbody.appendChild(T), u(x), this._vStart = v, this._vEnd = E, this._cache.ensure(v, E);
  }, g.prototype._showEmptyState = function() {
    const i = this.ths.length || 1;
    this.tbody.textContent = "";
    let r = null;
    if (this.isDataDriven) {
      const t = this._lastTotal != null ? this._lastTotal : this._data.length, n = this.visibleCount === 0 && t > 0, p = n ? this.name + "-empty-filtered" : this.name + "-empty";
      if (r = _t(this.dom, p, "ln-table"), !r) {
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
      const n = t[e], p = n.getAttribute("data-ln-table-cell-attr").split(",");
      for (let v = 0; v < p.length; v++) {
        const E = p[v].trim().split(":");
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
      requestPage: function(p, v, E) {
        L(r, "ln-table:request-data", {
          table: i.name,
          sort: p.sort,
          filters: p.filters,
          search: p.search,
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
        const n = t[e].getAttribute("data-ln-table-row-id"), p = t[e].querySelector("[data-ln-table-row-select]");
        n != null && (r ? (i.selectedIds.add(n), t[e].classList.add("ln-row-selected")) : (i.selectedIds.delete(n), t[e].classList.remove("ln-row-selected")), p && (p.checked = r));
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
    if (this._totalSpan && (this._totalSpan.textContent = s(i, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = t ? s(r, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !t), this._selectedSpan) {
      const e = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = e > 0 ? s(e, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", e === 0);
    }
  }, g.prototype._focusRow = function(i) {
    for (let r = 0; r < i.length; r++)
      i[r].classList.remove("ln-row-focused"), i[r].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < i.length) {
      const r = i[this._focusedRowIndex];
      r.classList.add("ln-row-focused"), r.setAttribute("tabindex", "0"), r.focus(), r.scrollIntoView({ block: "nearest" });
    }
  }, g.prototype.destroy = function() {
    this.dom[a] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), document.removeEventListener("keydown", this._onKeydown), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[a]);
  }, z(c, a, g, "ln-table", {
    extraAttributes: [
      "data-ln-table-window",
      "data-ln-table-window-page",
      "data-ln-table-window-threshold",
      "data-ln-table-count"
    ],
    onAttributeChange: function(i, r) {
      const t = i[a];
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
  const c = "data-ln-table-coordinator", a = "lnTableCoordinator";
  if (window[a] !== void 0) return;
  document.addEventListener("keydown", function(_) {
    if (_.key !== "/" || _.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const m = document.querySelector("[" + c + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!m) return;
    const f = m.tagName === "INPUT" || m.tagName === "TEXTAREA" ? m : m.querySelector('input[type="search"], input[type="text"], input');
    f && (_.preventDefault(), f.focus());
  });
  function b(_) {
    return this.dom = _, y(this), this;
  }
  function y(_) {
    const m = _.dom;
    function f(o) {
      const l = o.target;
      if (l && l.hasAttribute && l.hasAttribute("data-ln-table")) return l;
      const s = o.detail && o.detail.targetId || l && l.id;
      return s ? m.querySelector('[data-ln-table-source="' + s + '"]') || m.querySelector('[data-ln-table="' + s + '"]') : null;
    }
    _._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(o) {
        if (!o.detail) return;
        const l = f(o);
        if (!l || !l.hasAttribute || !l.hasAttribute("data-ln-table")) return;
        const s = o.detail.key, d = o.detail.values || [], h = l.querySelectorAll("th");
        for (let u = 0; u < h.length; u++)
          if (h[u].getAttribute("data-ln-table-filter-col") === s) {
            const g = h[u].querySelector("[data-ln-table-col-filter]");
            g && g.classList.toggle("ln-filter-active", d.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(o) {
        const l = o.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!l) return;
        const s = l.closest("[data-ln-table]") || m.querySelector("[data-ln-table]");
        if (!s || !s.lnTable) return;
        const d = s.lnTable.name || s.id, h = s.querySelectorAll("th");
        for (let t = 0; t < h.length; t++) {
          const e = h[t].querySelector("[data-ln-table-col-filter]");
          e && e.classList.remove("ln-filter-active");
        }
        const u = s.getAttribute("data-ln-table-source") || s.id, g = u ? document.getElementById(u) : null;
        g && g.hasAttribute("data-ln-search") && g.setAttribute("data-ln-search", "");
        const i = u && m.querySelector('[data-ln-search-for="' + u + '"]') || m.querySelector("[data-ln-search-for]");
        if (i) {
          const t = i.tagName === "INPUT" || i.tagName === "TEXTAREA" ? i : i.querySelector("input");
          t && t.value !== "" && (t.value = "", t.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const r = u && m.querySelectorAll('[data-ln-filter="' + u + '"]') || m.querySelectorAll("[data-ln-filter]");
        for (let t = 0; t < r.length; t++) {
          const e = r[t].querySelector("[data-ln-filter-reset]");
          e && (e.checked = !0, e.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        s.hasAttribute("data-ln-table-source") || L(s, "ln-table:request-clear-filters", { table: d });
      }
    }, m.addEventListener("ln-filter:change", _._handlers.filter), m.addEventListener("click", _._handlers.clear);
  }
  b.prototype.destroy = function() {
    this.dom[a] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[a]);
  }, z(c, a, b, "ln-table-coordinator");
})();
(function() {
  const c = "data-ln-list", a = "lnList", b = "data-ln-list-empty";
  if (window[a] !== void 0) return;
  function l(i, r) {
    if (i == null || isNaN(i)) return "";
    try {
      return new Intl.NumberFormat($(r)).format(i);
    } catch {
      return String(i);
    }
  }
  function s(i) {
    let r = i;
    for (; r && r !== document.body && r !== document.documentElement; ) {
      const e = getComputedStyle(r).overflowY;
      if (e === "auto" || e === "scroll") return r;
      r = r.parentElement;
    }
    return null;
  }
  function d(i) {
    const r = i._scrollContainer || s(i.dom);
    return {
      container: r,
      top: r ? r.scrollTop : window.scrollY
    };
  }
  function h(i) {
    i.container ? i.container.scrollTop = i.top : window.scrollTo(window.scrollX, i.top);
  }
  function u(i) {
    if (!i) return 0;
    const r = getComputedStyle(i), t = parseFloat(r.marginTop) || 0, e = parseFloat(r.marginBottom) || 0;
    return i.offsetHeight + t + e;
  }
  function g(i) {
    this.dom = i, this.tbody = i.querySelector("[data-ln-list-body]") || i, this.isDataDriven = i.hasAttribute("data-ln-list-source"), this.name = i.getAttribute(c) || "", this.source = i.getAttribute("data-ln-list-source") || "", this._totalSpan = i.querySelector("[data-ln-list-total]"), this._filteredSpan = i.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== i ? this._filteredSpan.parentElement : null), this._selectedSpan = i.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== i ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
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
      const n = e.getAttribute("data-ln-item-id"), p = e._lnRecord || {};
      L(i, "ln-list:item-click", {
        list: r.name,
        id: n,
        record: p
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(t) {
      const e = t.target.closest("[data-ln-item-action]");
      if (!e) return;
      t.stopPropagation();
      const n = e.closest("[data-ln-item]");
      if (!n) return;
      const p = e.getAttribute("data-ln-item-action"), v = n.getAttribute("data-ln-item-id"), E = n._lnRecord || {};
      L(i, "ln-list:item-action", {
        list: r.name,
        id: v,
        action: p,
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
          const p = [];
          for (let v = 0; v < n.length; v++)
            p.push(n[v].toLowerCase());
          r._filters[e] = p;
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
    this._data = [], i.length > 0 && (this._itemHeight = u(i[0]) || 50);
    for (let r = 0; r < i.length; r++) {
      const t = i[r], e = t.getAttribute("data-ln-item-id") || t.getAttribute("id"), n = t.textContent.trim().toLowerCase();
      let p = null;
      if (this.isDataDriven) {
        p = {}, e != null && (p.id = e);
        const w = t.querySelectorAll("[data-ln-list-field]");
        for (let A = 0; A < w.length; A++) {
          const S = w[A], T = S.getAttribute("data-ln-list-field");
          T && (p[T] = Ct(S));
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
        ...p || {}
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, g.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      if (this._filteredData = this._data.slice(), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const i = this.currentSort.field, r = this.currentSort.direction === "desc" ? -1 : 1, t = this._filteredData.map(function(p) {
        return p[i];
      }), e = xt(t), n = typeof Intl < "u" ? new Intl.Collator($(this.dom), { sensitivity: "base" }) : null;
      this._filteredData.sort(function(p, v) {
        return kt(p[i], v[i], e, n) * r;
      });
    } else {
      const i = this._searchTerm, r = i ? i.split(/\s+/).filter(Boolean) : [], t = this._filters || {}, e = Object.keys(t).length > 0;
      if (r.length === 0 && !e ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(n) {
        if (r.length > 0 && !r.every(function(v) {
          return n.searchText && n.searchText.indexOf(v) !== -1;
        }))
          return !1;
        if (e)
          for (const p in t) {
            const v = t[p];
            if (v && v.length > 0) {
              const E = n.fields && n.fields[p] !== void 0 ? n.fields[p] : n[p] !== void 0 ? n[p] : null, w = E != null ? String(E).toLowerCase() : "";
              if (v.indexOf(w) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const n = this._sortField, p = this._sortDir === "desc" ? -1 : 1, v = typeof Intl < "u" ? new Intl.Collator($(this.dom), { sensitivity: "base" }) : null, E = this._filteredData.map(function(A) {
          return A.fields && A.fields[n] !== void 0 ? A.fields[n] : A[n];
        }), w = xt(E);
        this._filteredData.sort(function(A, S) {
          const T = A.fields && A.fields[n] !== void 0 ? A.fields[n] : A[n], x = S.fields && S.fields[n] !== void 0 ? S.fields[n] : S[n];
          return kt(T, x, w, v) * p;
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
      this.tbody.textContent = "", this.tbody.appendChild(r), h(t), this._selectable && this._updateSelectAll();
    } else {
      const i = [], r = this._filteredData;
      for (let e = 0; e < r.length; e++) i.push(r[e].html);
      const t = d(this);
      this.tbody.innerHTML = i.join(""), h(t), this._selectable && this._restoreSelection();
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
      r && (this.tbody.textContent = "", this.tbody.appendChild(r), this._itemHeight = u(r) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const i = this._buildItem(this._data[0]);
        i && (this.tbody.textContent = "", this.tbody.appendChild(i), this._itemHeight = u(i) || 50, this.tbody.textContent = "");
      }
    } else {
      const i = this.tbody.children;
      i.length > 0 && (this._itemHeight = u(i[0]) || 50);
    }
  }, g.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const i = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = s(this.dom);
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
    let n, p;
    if (e) {
      const P = this.tbody.getBoundingClientRect(), U = e.getBoundingClientRect(), j = e === this.tbody ? 0 : P.top - U.top + e.scrollTop;
      n = e.scrollTop - j, p = e.clientHeight;
    } else {
      const U = this.tbody.getBoundingClientRect().top + window.scrollY;
      n = window.scrollY - U, p = window.innerHeight;
    }
    const v = this._readGridLayout(), E = v.columns, w = v.rowGap, A = t + w, S = Math.ceil(r / E);
    let T = Math.max(0, Math.floor(n / A) - 15);
    T = Math.min(T, S);
    const x = Math.ceil(p / A) + 30, I = Math.min(T + x, S), k = Math.min(T * E, r), R = Math.min(I * E, r);
    if (k === this._vStart && R === this._vEnd) return;
    this._vStart = k, this._vEnd = R;
    const N = T * A, K = (S - I) * A;
    if (this.isDataDriven) {
      const P = document.createDocumentFragment();
      if (N > 0) {
        const j = document.createElement(this.isUl ? "li" : "div");
        j.className = "ln-list__spacer", j.setAttribute("aria-hidden", "true"), j.style.height = N + "px", P.appendChild(j);
      }
      for (let j = k; j < R; j++) {
        const et = this._buildItem(i[j]);
        et && P.appendChild(et);
      }
      if (K > 0) {
        const j = document.createElement(this.isUl ? "li" : "div");
        j.className = "ln-list__spacer", j.setAttribute("aria-hidden", "true"), j.style.height = K + "px", P.appendChild(j);
      }
      const U = d(this);
      this.tbody.textContent = "", this.tbody.appendChild(P), h(U), this._selectable && this._updateSelectAll();
    } else {
      let P = "";
      N > 0 && (P += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${N}px"></${this.isUl ? "li" : "div"}>`);
      for (let j = k; j < R; j++)
        P += i[j].html;
      K > 0 && (P += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${K}px"></${this.isUl ? "li" : "div"}>`);
      const U = d(this);
      this.tbody.innerHTML = P, h(U), this._selectable && this._restoreSelection();
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
      const U = this.tbody.getBoundingClientRect(), j = r.getBoundingClientRect(), et = r === this.tbody ? 0 : U.top - j.top + r.scrollTop;
      t = r.scrollTop - et, e = r.clientHeight;
    } else {
      const j = this.tbody.getBoundingClientRect().top + window.scrollY;
      t = window.scrollY - j, e = window.innerHeight;
    }
    const n = this._readGridLayout(), p = n.columns, v = n.rowGap, E = i + v, w = this._cache.logicalTotal, A = Math.ceil(w / p);
    let S = Math.max(0, Math.floor(t / E) - 15);
    S = Math.min(S, A);
    const T = Math.ceil(e / E) + 30, x = Math.min(S + T, A), I = Math.min(S * p, w), k = Math.min(x * p, w), R = S * E, N = (A - x) * E, K = document.createDocumentFragment();
    if (R > 0) {
      const U = document.createElement(this.isUl ? "li" : "div");
      U.className = "ln-list__spacer", U.setAttribute("aria-hidden", "true"), U.style.height = R + "px", K.appendChild(U);
    }
    for (let U = I; U < k; U++)
      if (this._cache.has(U)) {
        const j = this._buildItem(this._cache.get(U));
        j && K.appendChild(j);
      } else
        K.appendChild(this._buildPlaceholderItem());
    if (N > 0) {
      const U = document.createElement(this.isUl ? "li" : "div");
      U.className = "ln-list__spacer", U.setAttribute("aria-hidden", "true"), U.style.height = N + "px", K.appendChild(U);
    }
    const P = d(this);
    this.tbody.textContent = "", this.tbody.appendChild(K), h(P), this._vStart = I, this._vEnd = k, this._cache.ensure(I, k);
  }, g.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let i = null;
    if (this.isDataDriven) {
      const r = this._lastTotal != null ? this._lastTotal : this._data.length, e = this.visibleCount === 0 && r > 0, n = e ? this.name + "-empty-filtered" : this.name + "-empty";
      if (i = _t(this.dom, n, "ln-list"), !i) {
        const p = this.dom.querySelector("template[data-ln-empty]");
        if (p) {
          const v = e ? "search" : "initial", E = p.content.querySelector(`[data-ln-empty-when="${v}"]`) || p.content.firstElementChild;
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
        const n = t[e], p = n.getAttribute("data-ln-item-id"), v = n.querySelector("[data-ln-item-select]");
        p != null && (r ? (i.selectedIds.add(String(p)), n.classList.add("ln-item-selected")) : (i.selectedIds.delete(String(p)), n.classList.remove("ln-item-selected")), v && (v.checked = r));
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
      requestPage: function(p, v, E) {
        L(r, "ln-list:request-data", {
          list: i.name,
          sort: p.sort,
          filters: p.filters,
          search: p.search,
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
    if (this._totalSpan && (this._totalSpan.textContent = l(i, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = t ? l(r, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !t), this._selectedSpan) {
      const e = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = e > 0 ? l(e, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", e === 0);
    }
  }, g.prototype.destroy = function() {
    this.dom[a] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onSearchChange && this.dom.removeEventListener("ln-search:change", this._onSearchChange), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[a]);
  }, z(c, a, g, "ln-list", {
    extraAttributes: [
      "data-ln-list-window",
      "data-ln-list-window-page",
      "data-ln-list-window-threshold",
      "data-ln-list-count"
    ],
    onAttributeChange: function(i, r) {
      const t = i[a];
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
  const c = "data-ln-circular-progress", a = "lnCircularProgress";
  if (window[a] !== void 0) return;
  const b = "http://www.w3.org/2000/svg", y = 36, _ = 16, m = 2 * Math.PI * _;
  function f(h) {
    return this.dom = h, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, l.call(this), d.call(this), s.call(this), this;
  }
  f.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("role"), this.dom.removeAttribute("aria-valuemin"), this.dom.removeAttribute("aria-valuemax"), this.dom.removeAttribute("aria-valuenow"), this.dom.removeAttribute("aria-valuetext"), delete this.dom[a]);
  };
  function o(h, u) {
    const g = document.createElementNS(b, h);
    for (const i in u)
      g.setAttribute(i, u[i]);
    return g;
  }
  function l() {
    this.svg = o("svg", {
      viewBox: "0 0 " + y + " " + y,
      "aria-hidden": "true"
    }), this.trackCircle = o("circle", {
      cx: y / 2,
      cy: y / 2,
      r: _,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = o("circle", {
      cx: y / 2,
      cy: y / 2,
      r: _,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": m,
      "stroke-dashoffset": m,
      transform: "rotate(-90 " + y / 2 + " " + y / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function s() {
    const h = this, u = new MutationObserver(function(g) {
      for (const i of g)
        (i.attributeName === "data-ln-circular-progress" || i.attributeName === "data-ln-circular-progress-max" || i.attributeName === "data-ln-circular-progress-label") && d.call(h);
    });
    u.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max", "data-ln-circular-progress-label"]
    }), this._attrObserver = u;
  }
  function d() {
    const h = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, u = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let g = u > 0 ? h / u * 100 : 0;
    g < 0 && (g = 0), g > 100 && (g = 100);
    const i = m - g / 100 * m;
    this.progressCircle.setAttribute("stroke-dashoffset", i);
    const r = this.dom.getAttribute("data-ln-circular-progress-label"), t = r !== null ? r : Math.round(g) + "%";
    this.labelEl.textContent = t, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(u));
    const e = Math.max(0, Math.min(h, u));
    this.dom.setAttribute("aria-valuenow", String(e)), this.dom.setAttribute("aria-valuetext", t), L(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: h,
      max: u,
      percentage: g
    });
  }
  z(c, a, f, "ln-circular-progress");
})();
(function() {
  const c = "data-ln-sortable", a = "lnSortable", b = "data-ln-sortable-handle";
  if (window[a] !== void 0) return;
  function y(m) {
    this.dom = m, this.isEnabled = m.getAttribute(c) !== "disabled", this._dragging = null, m.setAttribute("aria-roledescription", "sortable list");
    const f = this;
    return this._onPointerDown = function(o) {
      f.isEnabled && f._handlePointerDown(o);
    }, m.addEventListener("pointerdown", this._onPointerDown), this;
  }
  y.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(c, "");
  }, y.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(c, "disabled");
  }, y.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), L(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[a]);
  }, y.prototype._handlePointerDown = function(m) {
    let f = m.target.closest("[" + b + "]"), o;
    if (f) {
      for (o = f; o && o.parentElement !== this.dom; )
        o = o.parentElement;
      if (!o || o.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + b + "]")) return;
      for (o = m.target; o && o.parentElement !== this.dom; )
        o = o.parentElement;
      if (!o || o.parentElement !== this.dom) return;
      f = o;
    }
    const s = Array.from(this.dom.children).indexOf(o);
    if (X(this.dom, "ln-sortable:before-drag", {
      item: o,
      index: s
    }).defaultPrevented) return;
    m.preventDefault(), f.setPointerCapture(m.pointerId), this._dragging = o, o.classList.add("ln-sortable--dragging"), o.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), L(this.dom, "ln-sortable:drag-start", {
      item: o,
      index: s
    });
    const h = this, u = function(i) {
      h._handlePointerMove(i);
    }, g = function(i) {
      h._handlePointerEnd(i), f.removeEventListener("pointermove", u), f.removeEventListener("pointerup", g), f.removeEventListener("pointercancel", g);
    };
    f.addEventListener("pointermove", u), f.addEventListener("pointerup", g), f.addEventListener("pointercancel", g);
  }, y.prototype._handlePointerMove = function(m) {
    if (!this._dragging) return;
    const f = Array.from(this.dom.children), o = this._dragging;
    for (const l of f)
      l.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const l of f) {
      if (l === o) continue;
      const s = l.getBoundingClientRect(), d = s.top + s.height / 2;
      if (m.clientY >= s.top && m.clientY < d) {
        l.classList.add("ln-sortable--drop-before");
        break;
      } else if (m.clientY >= d && m.clientY <= s.bottom) {
        l.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, y.prototype._handlePointerEnd = function(m) {
    if (!this._dragging) return;
    const f = this._dragging, o = Array.from(this.dom.children), l = o.indexOf(f);
    let s = null, d = null;
    for (const h of o) {
      if (h.classList.contains("ln-sortable--drop-before")) {
        s = h, d = "before";
        break;
      }
      if (h.classList.contains("ln-sortable--drop-after")) {
        s = h, d = "after";
        break;
      }
    }
    for (const h of o)
      h.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (f.classList.remove("ln-sortable--dragging"), f.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), s && s !== f) {
      d === "before" ? this.dom.insertBefore(f, s) : this.dom.insertBefore(f, s.nextElementSibling);
      const u = Array.from(this.dom.children).indexOf(f);
      L(this.dom, "ln-sortable:reordered", {
        item: f,
        oldIndex: l,
        newIndex: u
      });
    }
    this._dragging = null;
  };
  function _(m) {
    const f = m[a];
    if (!f) return;
    const o = m.getAttribute(c) !== "disabled";
    o !== f.isEnabled && (f.isEnabled = o, L(m, o ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: m }));
  }
  z(c, a, y, "ln-sortable", {
    onAttributeChange: _
  });
})();
(function() {
  const c = "data-ln-confirm", a = "lnConfirm", b = "data-ln-confirm-timeout";
  if (window[a] !== void 0) return;
  function _(...f) {
    (document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) && console.warn("[ln-confirm]", ...f);
  }
  function m(f) {
    _("constructor called on", f), this.dom = f, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = f.querySelector("[data-ln-confirm-idle]"), this.activeEl = f.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = f.textContent.trim(), this.confirmText = f.getAttribute(c) || "Confirm?");
    const o = this;
    return this._onClick = function(l) {
      if (_("click handler, confirming:", o.confirming, "submitted:", o._submitted, "target:", l.target), !o.confirming)
        l.preventDefault(), l.stopImmediatePropagation(), o._enterConfirm();
      else {
        if (o._submitted) return;
        o._submitted = !0, l.stopPropagation(), o._reset();
      }
    }, f.addEventListener("click", this._onClick), this;
  }
  m.prototype._getTimeout = function() {
    const f = parseFloat(this.dom.getAttribute(b));
    return isNaN(f) || f <= 0 ? 3 : f;
  }, m.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const o = this.activeEl ? this.activeEl.textContent.trim() : "";
      o && (this.dom.setAttribute("aria-label", o), this.dom.setAttribute("aria-live", "polite"));
    } else {
      var f = this.dom.querySelector("svg.ln-icon use");
      f && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = f.getAttribute("href"), f.setAttribute("href", "#ln-icon-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.dom.setAttribute("aria-label", this.confirmText), this.dom.setAttribute("aria-live", "polite")) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), L(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, m.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const f = this, o = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      f._reset();
    }, o);
  }, m.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      var f = this.dom.querySelector("svg.ln-icon use");
      f && this.originalIconHref && f.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, m.prototype.destroy = function() {
    _("destroy called on", this.dom), this.dom[a] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[a]);
  }, z(c, a, m, "ln-confirm");
})();
(function() {
  const c = "data-ln-translations", a = "lnTranslations";
  if (window[a] !== void 0) return;
  const b = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function y(_) {
    this.dom = _, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = _.getAttribute(c + "-default") || "", this.placeholderLabel = _.getAttribute(c + "-placeholder") || "{lang} translation", this.removeLabel = _.getAttribute(c + "-remove-label") || "Remove {lang}", this.badgesEl = _.querySelector("[" + c + "-active]"), this.menuEl = _.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const m = _.getAttribute(c + "-locales");
    if (this.locales = b, m)
      try {
        this.locales = JSON.parse(m);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const f = this;
    return this._onRequestAdd = function(o) {
      o.detail && o.detail.lang && f.addLanguage(o.detail.lang);
    }, this._onRequestRemove = function(o) {
      o.detail && o.detail.lang && f.removeLanguage(o.detail.lang);
    }, _.addEventListener("ln-translations:request-add", this._onRequestAdd), _.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  y.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const _ = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const m of _) {
      const f = m.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const o of f)
        o.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, y.prototype._detectExisting = function() {
    const _ = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const m of _) {
      const f = m.getAttribute("data-ln-translatable-lang");
      f && f !== this.defaultLang && this.activeLanguages.add(f);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, y.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const _ = this;
    let m = 0;
    for (const o in this.locales) {
      if (!this.locales.hasOwnProperty(o) || this.activeLanguages.has(o)) continue;
      m++;
      const l = Nt("ln-translations-menu-item", "ln-translations");
      if (!l) return;
      const s = l.querySelector("[data-ln-translations-lang]");
      s.setAttribute("data-ln-translations-lang", o), s.textContent = this.locales[o], s.addEventListener("click", function(d) {
        d.ctrlKey || d.metaKey || d.button === 1 || (d.preventDefault(), d.stopPropagation(), _.menuEl.getAttribute("data-ln-toggle") === "open" && _.menuEl.setAttribute("data-ln-toggle", "close"), _.addLanguage(o));
      }), this.menuEl.appendChild(l);
    }
    const f = this.dom.querySelector("[" + c + "-add]");
    f && (f.hidden = m === 0);
  }, y.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const _ = this;
    this.activeLanguages.forEach(function(m) {
      const f = Nt("ln-translations-badge", "ln-translations");
      if (!f) return;
      const o = f.querySelector("[data-ln-translations-lang]");
      o.setAttribute("data-ln-translations-lang", m);
      const l = o.querySelector("span");
      l.textContent = _.locales[m] || m.toUpperCase();
      const s = o.querySelector("button"), d = _.locales[m] || m.toUpperCase();
      s.setAttribute("aria-label", _.removeLabel.replace("{lang}", d)), s.addEventListener("click", function(h) {
        h.ctrlKey || h.metaKey || h.button === 1 || (h.preventDefault(), h.stopPropagation(), _.removeLanguage(m));
      }), _.badgesEl.appendChild(f);
    });
  }, y.prototype.addLanguage = function(_, m) {
    if (this.activeLanguages.has(_)) return;
    const f = this.locales[_] || _;
    if (X(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: _,
      langName: f
    }).defaultPrevented) return;
    this.activeLanguages.add(_), m = m || {};
    const l = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const s of l) {
      const d = s.getAttribute("data-ln-translatable"), h = s.getAttribute("data-ln-translations-prefix") || "", u = s.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!u) continue;
      const g = u.cloneNode(u.tagName === "SELECT");
      h ? g.name = h + "[trans][" + _ + "][" + d + "]" : g.name = "trans[" + _ + "][" + d + "]", g.value = m[d] !== void 0 ? m[d] : "", g.removeAttribute("id"), "placeholder" in g && (g.placeholder = this.placeholderLabel.replace("{lang}", f)), g.setAttribute("data-ln-translatable-lang", _);
      const i = s.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), r = i.length > 0 ? i[i.length - 1] : u;
      r.parentNode.insertBefore(g, r.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: _,
      langName: f
    });
  }, y.prototype.removeLanguage = function(_) {
    if (!this.activeLanguages.has(_) || X(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: _
    }).defaultPrevented) return;
    const f = this.dom.querySelectorAll('[data-ln-translatable-lang="' + _ + '"]');
    for (const o of f)
      o.parentNode.removeChild(o);
    this.activeLanguages.delete(_), this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: _
    });
  }, y.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, y.prototype.hasLanguage = function(_) {
    return this.activeLanguages.has(_);
  }, y.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const _ = this.defaultLang, m = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const f of m)
      f.getAttribute("data-ln-translatable-lang") !== _ && f.parentNode.removeChild(f);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[a];
  }, z(c, a, y, "ln-translations");
})();
(function() {
  const c = "data-ln-autosave", a = "lnAutosave", b = "data-ln-autosave-clear", y = "data-ln-autosave-debounce-input", _ = "ln-autosave:";
  if (window[a] !== void 0) return;
  function f(d) {
    const h = o(d);
    if (!h) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", d);
      return;
    }
    this.dom = d, this.key = h;
    let u = null;
    function g() {
      const e = me(d, { exclude: "[data-ln-autosave-exclude]" });
      try {
        localStorage.setItem(h, JSON.stringify(e));
      } catch {
        return;
      }
      L(d, "ln-autosave:saved", { target: d, data: e });
    }
    function i() {
      let e;
      try {
        e = localStorage.getItem(h);
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
        localStorage.removeItem(h);
      } catch {
        return;
      }
      L(d, "ln-autosave:cleared", { target: d });
    }
    this._onFocusout = function(e) {
      const n = e.target;
      l(n) && n.name && !n.hasAttribute("data-ln-autosave-exclude") && g();
    }, this._onChange = function(e) {
      const n = e.target;
      l(n) && n.name && !n.hasAttribute("data-ln-autosave-exclude") && g();
    }, this._onSubmit = function() {
      r();
    }, this._onReset = function() {
      r();
    }, this._onClearClick = function(e) {
      e.target.closest("[" + b + "]") && r();
    }, d.addEventListener("focusout", this._onFocusout), d.addEventListener("change", this._onChange), d.addEventListener("submit", this._onSubmit), d.addEventListener("reset", this._onReset), d.addEventListener("click", this._onClearClick);
    const t = s(d);
    return t > 0 && (this._onInput = function(e) {
      const n = e.target;
      !l(n) || !n.name || n.hasAttribute("data-ln-autosave-exclude") || (u !== null && clearTimeout(u), u = setTimeout(g, t));
    }, d.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return u;
    }, i(), this;
  }
  f.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const d = this._getInputTimer();
        d !== null && clearTimeout(d);
      }
      L(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[a];
    }
  };
  function o(d) {
    const u = d.getAttribute(c) || d.id;
    return u ? _ + window.location.pathname + ":" + u : null;
  }
  function l(d) {
    const h = d.tagName;
    return h === "INPUT" || h === "TEXTAREA" || h === "SELECT";
  }
  function s(d) {
    if (!d.hasAttribute(y)) return 0;
    const h = d.getAttribute(y);
    if (h === "" || h === null) return 1e3;
    const u = parseInt(h, 10);
    return isNaN(u) || u < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", d), 1e3) : u;
  }
  z(c, a, f, "ln-autosave");
})();
(function() {
  const c = "data-ln-autoresize", a = "lnAutoresize";
  if (window[a] !== void 0) return;
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
    this.dom[a] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[a]);
  }, z(c, a, b, "ln-autoresize");
})();
(function() {
  const c = "data-ln-editor", a = "lnEditor";
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
  }, _ = {
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
  let f = 0;
  function o(t) {
    return !!(y[t] || _[t] || m[t] || t === "link");
  }
  function l(t) {
    this.dom = t;
    const e = this;
    if (this._textarea = t.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", t), this;
    const n = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), n && this._surface.setAttribute("data-placeholder", n);
    const p = this._textarea.id;
    if (p) {
      const A = t.querySelector('label[for="' + p + '"]');
      A && (A.id || (A.id = p + "-label"), this._surface.setAttribute("aria-labelledby", A.id));
    }
    this._surface.id = p ? p + "-surface" : "ln-editor-surface-" + ++f;
    const v = this._textarea.value.trim();
    v && (this._surface.innerHTML = v);
    const E = t.querySelector('[role="toolbar"]');
    if (E && E.nextSibling ? t.insertBefore(this._surface, E.nextSibling) : t.appendChild(this._surface), E) {
      E.setAttribute("aria-controls", this._surface.id);
      const A = E.querySelectorAll("[data-ln-editor-action]");
      for (let S = 0; S < A.length; S++) {
        const T = A[S].getAttribute("data-ln-editor-action");
        o(T) && A[S].setAttribute("aria-pressed", "false");
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
      const T = S.getAttribute("data-ln-editor-action");
      e._execAction(T);
    }, this._onPaste = function(A) {
      h(e, A);
    }, this._onKeydown = function(A) {
      i(e, A);
    }, this._onSelectionChange = function() {
      document.contains(e._surface) && e._updateActiveStates();
    }, this._onFocus = function() {
      L(e.dom, "ln-editor:focus", { target: e.dom });
    }, this._onBlur = function() {
      e._syncToTextarea(), L(e.dom, "ln-editor:blur", { target: e.dom });
    }, this._onTextareaInput = function() {
      e._surface.innerHTML !== e._textarea.value && (e._surface.innerHTML = e._textarea.value, L(e.dom, "ln-editor:changed", {
        html: e._textarea.value,
        target: e.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), E && (E.addEventListener("mousedown", this._onMousedownToolbar), E.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(A) {
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
  l.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, l.prototype._execAction = function(t) {
    if (!(!t || X(this.dom, "ln-editor:before-change", {
      action: t,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), y[t])
        document.execCommand(y[t], !1, null);
      else if (_[t]) {
        const n = _[t], p = s(this._surface);
        p && p.toLowerCase() === n ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + n + ">");
      } else m[t] ? document.execCommand(m[t], !1, null) : t === "link" ? r(this) : t === "unlink" ? document.execCommand("unlink", !1, null) : t === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, l.prototype._updateActiveStates = function() {
    const t = this.dom.querySelector('[role="toolbar"]');
    if (!t) return;
    const e = window.getSelection();
    if (!e || e.rangeCount === 0) return;
    const n = e.anchorNode;
    if (!n || !this._surface.contains(n)) return;
    const p = t.querySelectorAll("[data-ln-editor-action]");
    for (let v = 0; v < p.length; v++) {
      const E = p[v], w = E.getAttribute("data-ln-editor-action");
      let A = !1;
      if (y[w])
        try {
          A = document.queryCommandState(y[w]);
        } catch {
        }
      else if (_[w]) {
        const S = s(this._surface);
        A = S && S.toLowerCase() === _[w];
      } else if (m[w])
        try {
          A = document.queryCommandState(m[w]);
        } catch {
        }
      else w === "link" && (A = !!d(e.anchorNode, "A", this._surface));
      o(w) && E.setAttribute("aria-pressed", String(A)), A ? E.classList.add("ln-editor-active") : E.classList.remove("ln-editor-active");
    }
  }, l.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, l.prototype.setHTML = function(t) {
    this._surface && (this._surface.innerHTML = t, this._syncToTextarea(), L(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, l.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const t = this.dom.querySelector('[role="toolbar"]');
    t && (t.removeEventListener("mousedown", this._onMousedownToolbar), t.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const e = this._textarea ? this._textarea.form : null;
    if (e && this._onFormReset && e.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const n = this.dom.querySelector(".ln-editor__link-popover");
      n && n.remove();
    }
    L(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[a];
  };
  function s(t) {
    const e = window.getSelection();
    if (!e || e.rangeCount === 0) return null;
    let n = e.anchorNode;
    if (!n) return null;
    for (; n && n !== t; ) {
      if (n.nodeType === 1) {
        const p = n.tagName;
        if (p === "H2" || p === "H3" || p === "H4" || p === "BLOCKQUOTE" || p === "PRE" || p === "P")
          return p;
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
  function h(t, e) {
    e.preventDefault();
    let n = "";
    if (e.clipboardData && (n = e.clipboardData.getData("text/html"), !n)) {
      const v = e.clipboardData.getData("text/plain");
      v && (n = v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), n = "<p>" + n + "</p>");
    }
    if (!n) return;
    const p = u(n);
    p && document.execCommand("insertHTML", !1, p);
  }
  function u(t) {
    const e = document.createElement("div");
    return e.innerHTML = t, g(e), e.innerHTML;
  }
  function g(t) {
    const e = Array.from(t.childNodes);
    for (let n = 0; n < e.length; n++) {
      const p = e[n];
      if (p.nodeType !== 3) {
        if (p.nodeType !== 1) {
          t.removeChild(p);
          continue;
        }
        if (b[p.tagName]) {
          const v = Array.from(p.attributes);
          for (let E = 0; E < v.length; E++) {
            const w = v[E].name;
            if (p.tagName === "A" && w === "href") {
              const A = p.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(A) || p.removeAttribute("href");
            } else
              p.removeAttribute(w);
          }
          p.tagName === "A" && p.setAttribute("rel", "noopener noreferrer"), g(p);
        } else {
          for (; p.firstChild; )
            t.insertBefore(p.firstChild, p);
          t.removeChild(p);
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
    const n = d(e.anchorNode, "A", t._surface), p = e.getRangeAt(0).cloneRange();
    t._closeLinkPopover && t._closeLinkPopover();
    const v = _t(t.dom, "ln-editor-link-popover", "ln-editor");
    if (!v) return;
    const E = v.firstElementChild;
    if (!E) return;
    const w = E.querySelector('input[type="url"]'), A = E.querySelector('[data-ln-editor-action="confirm-link"]'), S = E.querySelector('[data-ln-editor-action="cancel-link"]');
    n && (w.value = n.getAttribute("href") || "");
    const T = t.dom.querySelector('[role="toolbar"]');
    T ? T.after(E) : t.dom.insertBefore(E, t._surface), w.focus();
    function x() {
      const P = window.getSelection();
      P.removeAllRanges(), P.addRange(p);
    }
    function I() {
      document.removeEventListener("mousedown", K), t._closeLinkPopover = null, E.remove();
    }
    function k() {
      const P = w.value.trim();
      if (I(), x(), t._surface.focus(), P)
        if (n)
          n.setAttribute("href", P), n.setAttribute("rel", "noopener noreferrer"), t._syncToTextarea(), L(t.dom, "ln-editor:changed", {
            html: t._textarea.value,
            target: t.dom
          });
        else {
          document.execCommand("createLink", !1, P);
          const U = window.getSelection();
          if (U && U.anchorNode) {
            const j = d(U.anchorNode, "A", t._surface);
            j && (j.setAttribute("rel", "noopener noreferrer"), t._syncToTextarea());
          }
        }
      else n && document.execCommand("unlink", !1, null);
    }
    function R() {
      I(), x(), t._surface.focus();
    }
    function N() {
      I();
    }
    function K(P) {
      const U = t.dom.contains(P.target) && P.target.closest('[data-ln-editor-action="link"]');
      !E.contains(P.target) && !U && N();
    }
    t._closeLinkPopover = I, A.addEventListener("click", k), S.addEventListener("click", R), w.addEventListener("keydown", function(P) {
      P.key === "Enter" ? (P.preventDefault(), k()) : P.key === "Escape" && (P.preventDefault(), R());
    }), document.addEventListener("mousedown", K);
  }
  z(c, a, l, "ln-editor");
})();
(function() {
  const c = "lnFill";
  if (window[c] !== void 0) return;
  const a = { lnFillForm: !0, lnFillStore: !0 };
  function b(_) {
    const m = {}, f = _.dataset;
    for (const o in f) {
      if (!o.startsWith("lnFill") || a[o]) continue;
      const l = o.slice(6);
      l && (m[l.charAt(0).toLowerCase() + l.slice(1)] = f[o]);
    }
    return m;
  }
  function y(_, m) {
    const f = window.CSS && CSS.escape ? CSS.escape(m) : m, o = document.querySelectorAll('[data-ln-fill-id="' + f + '"]');
    if (o.length === 0) return null;
    for (let l = 0; l < o.length; l++) {
      const s = o[l].getAttribute("data-ln-fill-form");
      if (s) {
        const d = document.getElementById(s);
        if (d && _.contains(d)) return o[l];
      }
    }
    return o[0];
  }
  document.addEventListener("click", function(_) {
    if (_.ctrlKey || _.metaKey || _.button === 1) return;
    const m = _.target.closest("[data-ln-fill-form]");
    if (!m) return;
    const f = m.getAttribute("href");
    if (f && f.indexOf("#") !== -1) return;
    const o = m.getAttribute("data-ln-fill-form"), l = document.getElementById(o);
    if (!l) return;
    const s = b(m), d = Object.keys(s).length > 0;
    window.lnCore.lnFill(l, d ? s : null);
  }), document.addEventListener("ln-fill:request", function(_) {
    const m = _.detail;
    if (!m) return;
    const f = _.target, o = m.id;
    if (o == null) {
      window.lnCore.lnFill(f, null);
      return;
    }
    const l = y(f, o);
    if (!l) return;
    const s = b(l);
    window.lnCore.lnFill(f, s);
  }), window[c] = !0;
})();
(function() {
  const c = "data-ln-slug-from", a = "lnSlug";
  if (window[a] !== void 0) return;
  function b(_) {
    return String(_).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function y(_) {
    if (_.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", _.tagName), this;
    const m = _.form;
    if (!m)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", _), this;
    const f = _.getAttribute(c), o = m.elements[f];
    if (!o)
      return console.warn('[ln-slug] Source field "' + f + '" not found in form:', _), this;
    if (typeof o.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + f + '" is a RadioNodeList (same-name group) — single source field required:', _), this;
    this.dom = _, this.source = o, this._pristine = _.value === "", this._mirroring = !1;
    const l = this;
    return this._onSource = function() {
      l._pristine && l._mirror();
    }, this._onSlug = function() {
      l._mirroring || (l._pristine = l.dom.value === "");
    }, o.addEventListener("input", this._onSource), _.addEventListener("input", this._onSlug), this;
  }
  y.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = b(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, y.prototype.destroy = function() {
    this.dom[a] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[a]);
  }, z(c, a, y, "ln-slug");
})();
(function() {
  const c = "data-ln-time", a = "lnTime";
  if (window[a] !== void 0) return;
  const b = {}, y = {};
  function _(w) {
    return w.getAttribute("data-ln-time-locale") || $(w);
  }
  function m(w, A) {
    const S = (w || "") + "|" + JSON.stringify(A);
    return b[S] || (b[S] = new Intl.DateTimeFormat(w, A)), b[S];
  }
  function f(w) {
    const A = w || "";
    return y[A] || (y[A] = new Intl.RelativeTimeFormat(w, { numeric: "auto", style: "narrow" })), y[A];
  }
  const o = /* @__PURE__ */ new Set();
  let l = null;
  function s() {
    l || (l = setInterval(h, 6e4));
  }
  function d() {
    l && (clearInterval(l), l = null);
  }
  function h() {
    for (const w of o) {
      if (!document.body.contains(w.dom)) {
        o.delete(w);
        continue;
      }
      e(w);
    }
    o.size === 0 && d();
  }
  function u(w, A) {
    const S = It(A), T = (A || "").toLowerCase().split("-")[0], x = m(A, { dateStyle: "long", timeStyle: "short" }), I = x.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (S && I !== T && S.monthsLong) {
      const k = S.monthsLong[w.getMonth()], R = w.getDate(), N = w.getFullYear(), K = String(w.getHours()).padStart(2, "0"), P = String(w.getMinutes()).padStart(2, "0");
      return `${R} ${k} ${N} во ${K}:${P}`;
    }
    return x.format(w);
  }
  function g(w, A) {
    const S = /* @__PURE__ */ new Date(), T = { month: "short", day: "numeric" };
    w.getFullYear() !== S.getFullYear() && (T.year = "numeric");
    const x = It(A), I = (A || "").toLowerCase().split("-")[0], k = m(A, T), R = k.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (x && R !== I && x.monthsShort) {
      const N = x.monthsShort[w.getMonth()], K = w.getDate(), P = w.getFullYear() !== S.getFullYear() ? " " + w.getFullYear() : "";
      return `${K} ${N}${P}`;
    }
    return k.format(w);
  }
  function i(w, A) {
    return m(A, { dateStyle: "medium" }).format(w);
  }
  function r(w, A) {
    return m(A, { timeStyle: "short" }).format(w);
  }
  function t(w, A) {
    const S = Math.floor(Date.now() / 1e3), x = Math.floor(w.getTime() / 1e3) - S, I = Math.abs(x);
    if (I < 10) return f(A).format(0, "second");
    let k, R;
    if (I < 60)
      k = "second", R = x;
    else if (I < 3600)
      k = "minute", R = Math.round(x / 60);
    else if (I < 86400)
      k = "hour", R = Math.round(x / 3600);
    else if (I < 604800)
      k = "day", R = Math.round(x / 86400);
    else if (I < 2592e3)
      k = "week", R = Math.round(x / 604800);
    else
      return g(w, A);
    return f(A).format(R, k);
  }
  function e(w) {
    const A = w.dom.getAttribute("datetime");
    if (!A) return;
    const S = Number(A);
    if (isNaN(S)) return;
    const T = new Date(S * 1e3), x = w.dom.getAttribute(c) || "short", I = _(w.dom);
    let k;
    switch (x) {
      case "relative":
        k = t(T, I);
        break;
      case "full":
        k = u(T, I);
        break;
      case "date":
        k = i(T, I);
        break;
      case "time":
        k = r(T, I);
        break;
      default:
        k = g(T, I);
        break;
    }
    w.dom.textContent = k, x !== "full" && (w.dom.title = u(T, I));
  }
  function n(w) {
    return this.dom = w, e(this), w.getAttribute(c) === "relative" && (o.add(this), s()), this;
  }
  n.prototype.render = function() {
    e(this);
  }, n.prototype.destroy = function() {
    o.delete(this), o.size === 0 && d(), delete this.dom[a];
  };
  function p(w) {
    const A = w[a];
    if (!A) return;
    w.getAttribute(c) === "relative" ? (o.add(A), s()) : (o.delete(A), o.size === 0 && d()), e(A);
  }
  function v(w) {
    w.nodeType === 1 && w.hasAttribute && w.hasAttribute(c) && w[a] && e(w[a]);
  }
  function E() {
    new MutationObserver(function() {
      const w = document.querySelectorAll("[" + c + "]");
      for (let A = 0; A < w.length; A++) {
        const S = w[A][a];
        S && e(S);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  z(c, a, n, "ln-time", {
    extraAttributes: ["datetime", "data-ln-time-locale", "lang"],
    onAttributeChange: p,
    onInit: v
  }), E();
})();
function rn(c) {
  c = c || {};
  let a = c.windowSize > 0 ? c.windowSize : 1e3, b = c.pageSize > 0 ? c.pageSize : 200, y = c.fetchDebounce != null ? c.fetchDebounce : 120;
  const _ = typeof c.requestPage == "function" ? c.requestPage : function() {
  }, m = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  let l = 0, s = 0, d = 0, h = null, u = 0;
  function g(t) {
    f.set(t, ++u);
  }
  function i() {
    if (m.size <= a) return;
    const t = Array.from(m.keys()).sort(function(n, p) {
      return (f.get(n) || 0) - (f.get(p) || 0);
    });
    let e = 0;
    for (; m.size > a && e < t.length; )
      m.delete(t[e]), f.delete(t[e]), e++;
  }
  function r(t, e, n) {
    o.add(t), _(t, e, n);
  }
  return {
    get logicalTotal() {
      return l;
    },
    set logicalTotal(t) {
      l = t;
    },
    get grandTotal() {
      return s;
    },
    set grandTotal(t) {
      s = t;
    },
    get queryGen() {
      return d;
    },
    set queryGen(t) {
      d = t;
    },
    get size() {
      return m.size;
    },
    getId: function(t) {
      if (m.has(t))
        return g(t), m.get(t);
    },
    // The caller asks for an exact range it already decided it needs — the
    // index is an id resolver, not a scroll surface. Prefetch padding is the
    // view's job (it owns the viewport); padding here would fetch a page
    // nobody asked for on top of every page the view asks for.
    ensure: function(t, e, n) {
      if (l <= 0) {
        o.has(0) || (clearTimeout(h), h = setTimeout(function() {
          r(0, b, n);
        }, y));
        return;
      }
      const p = Math.max(0, t), v = Math.min(l, e), E = Math.floor(p / b), w = Math.floor(Math.max(0, v - 1) / b);
      let A = -1;
      for (let S = E; S <= w; S++) {
        const T = S * b, x = Math.min(b, l - T);
        let I = !1;
        const k = Math.max(T, p), R = Math.min(T + x, v);
        for (let N = k; N < R; N++)
          if (!m.has(N)) {
            I = !0;
            break;
          }
        if (I && !o.has(T)) {
          A = T;
          break;
        }
      }
      A !== -1 && (clearTimeout(h), h = setTimeout(function() {
        r(A, b, n);
      }, y));
    },
    ingest: function(t, e, n, p, v) {
      if (!(v != null && v !== d)) {
        s = n ?? s, l = p ?? l;
        for (let E = 0; E < e.length; E++)
          m.set(t + E, e[E]), g(t + E);
        o.delete(t), i();
      }
    },
    // Query change: new generation, positions dropped. The totals are kept
    // as the stale-while-revalidate carry-over the view renders against
    // until the new generation's first page lands in ingest() — same
    // contract as createWindowCache.invalidate().
    reset: function() {
      d++, m.clear(), f.clear(), o.clear(), clearTimeout(h);
    },
    clear: function() {
      m.clear(), f.clear(), o.clear(), clearTimeout(h);
    },
    configure: function(t) {
      if (t = t || {}, t.windowSize != null && t.windowSize > 0 && t.windowSize !== a) {
        const e = t.windowSize < a;
        a = t.windowSize, e && i();
      }
      t.pageSize != null && t.pageSize > 0 && (b = t.pageSize), t.fetchDebounce != null && t.fetchDebounce >= 0 && (y = t.fetchDebounce);
    }
  };
}
(function() {
  const c = "data-ln-data-store", a = "lnDataStore";
  if (window[a] !== void 0) return;
  const b = "ln_app_cache", y = "_meta", _ = "1.0";
  let m = null, f = null;
  const o = {};
  function l(C) {
    C && C.name === "QuotaExceededError" && L(document, "ln-data-store:quota-exceeded", { error: C });
  }
  function s() {
    const C = {};
    for (const q of document.querySelectorAll(`[${c}]`)) {
      const D = q.id;
      if (D) {
        const M = q.getAttribute("data-ln-data-store-indexes") || "";
        C[D] = {
          indexes: M.split(",").map((O) => O.trim()).filter(Boolean)
        };
      }
    }
    return C;
  }
  function d() {
    return f || (f = new Promise((C) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), C(null);
      const q = s(), D = Object.keys(q), M = indexedDB.open(b);
      M.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), C(null);
      }, M.onsuccess = (O) => {
        const F = O.target.result, B = Array.from(F.objectStoreNames);
        if (!(!B.includes(y) || D.some((st) => !B.includes(st))))
          return h(F), m = F, C(F);
        const G = F.version;
        F.close();
        const Q = indexedDB.open(b, G + 1);
        Q.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, Q.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), C(null);
        }, Q.onupgradeneeded = (st) => {
          const dt = st.target.result;
          dt.objectStoreNames.contains(y) || dt.createObjectStore(y, { keyPath: "key" });
          for (const zt of D)
            if (!dt.objectStoreNames.contains(zt)) {
              const Ne = dt.createObjectStore(zt, { keyPath: "id" });
              for (const oe of q[zt].indexes)
                Ne.createIndex(oe, oe, { unique: !1 });
            }
        }, Q.onsuccess = (st) => {
          const dt = st.target.result;
          h(dt), m = dt, C(dt);
        };
      };
    }), f);
  }
  function h(C) {
    C.onversionchange = () => {
      C.close(), m = null, f = null;
    };
  }
  function u() {
    return m ? Promise.resolve(m) : (f = null, d());
  }
  async function g(C) {
    if (!bt() || !C) return C;
    const q = { ...C }, D = q.id, M = await Qe(q);
    return !M || !M.encrypted ? C : {
      id: D,
      encrypted: !0,
      iv: M.iv,
      data: M.data
    };
  }
  async function i(C) {
    return !C || !C.encrypted || !bt() ? C : $e(C);
  }
  const r = (C, q) => u().then((D) => D ? D.transaction(C, q).objectStore(C) : null);
  function t(C) {
    return new Promise((q, D) => {
      C.onsuccess = () => q(C.result), C.onerror = () => {
        l(C.error), D(C.error);
      };
    });
  }
  const e = (C) => r(C, "readonly").then((q) => q ? t(q.getAll()) : []).then((q) => bt() ? Promise.all(q.map((D) => i(D))) : q), n = (C, q) => r(C, "readonly").then((D) => D ? t(D.get(q)) : null).then((D) => D ? i(D) : null), p = (C, q) => u().then((D) => {
    if (!D) return [];
    const O = D.transaction(C, "readonly").objectStore(C), F = q.map((B) => t(O.get(B)));
    return Promise.all(F).then((B) => bt() ? Promise.all(B.map((V) => i(V))) : B);
  }), v = (C, q) => (bt() ? g(q) : Promise.resolve(q)).then((M) => r(C, "readwrite").then((O) => O ? t(O.put(M)) : null)), E = (C, q) => r(C, "readwrite").then((D) => D ? t(D.delete(q)) : null), w = (C) => r(C, "readwrite").then((q) => q ? t(q.clear()) : null), A = (C) => r(C, "readonly").then((q) => q ? t(q.count()) : 0), S = (C) => r(y, "readonly").then((q) => q ? t(q.get(C)) : null), T = (C, q) => r(y, "readwrite").then((D) => {
    if (D)
      return q.key = C, t(D.put(q));
  });
  function x(C) {
    this.dom = C, this._name = C.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", C);
    const q = C.getAttribute("data-ln-data-store-stale"), D = parseInt(q, 10);
    this._staleThreshold = q === "never" || q === "-1" ? -1 : isNaN(D) ? 300 : D;
    const M = C.getAttribute("data-ln-data-store-search-fields") || "";
    this._searchFields = M.split(",").map((F) => F.trim()).filter(Boolean), this._handlers = null, this.isLoaded = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null };
    const O = C.getAttribute("data-ln-data-store-window");
    if (O !== null) {
      const F = parseInt(O, 10) || 1e3, B = parseInt(C.getAttribute("data-ln-data-store-window-page"), 10) || 200;
      this._windowIndex = rn({
        windowSize: F,
        pageSize: B,
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
    return this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), o[this._name] = this, I(this), this.ready = et(this), this;
  }
  function I(C) {
    C._handlers = {
      create: (q) => k(C, "create", q.detail, () => N(C, q.detail)),
      update: (q) => k(C, "update", q.detail, () => K(C, q.detail)),
      delete: (q) => k(C, "delete", q.detail, () => P(C, q.detail)),
      "bulk-delete": (q) => k(C, "bulk-delete", q.detail, () => U(C, q.detail)),
      "sync-failed": (q) => {
        C.isSyncing = !1, L(C.dom, "ln-data-store:sync-error", {
          store: C._name,
          error: q.detail && q.detail.error,
          status: q.detail && q.detail.status
        });
      }
    };
    for (const [q, D] of Object.entries(C._handlers))
      C.dom.addEventListener(`ln-data-store:request-${q}`, D);
    C._queryHandlers = {
      "ln-search:change": (q) => {
        q.preventDefault();
        const D = q.detail && q.detail.term != null ? q.detail.term : "";
        D !== C.query.search && (C.query.search = D, Z(C));
      },
      "ln-filter:change": (q) => {
        q.preventDefault();
        const D = q.detail && q.detail.key;
        if (!D) return;
        const M = (q.detail.values || []).slice(), O = C.query.filters[D];
        (O ? O.length === M.length && O.every((B, V) => B === M[V]) : !M.length) || (M.length ? C.query.filters[D] = M : delete C.query.filters[D], Z(C));
      },
      "ln-sort:change": (q) => {
        q.preventDefault();
        const D = q.detail && q.detail.field, M = q.detail && q.detail.direction, O = M && M !== "none" ? { field: D, direction: M } : null, F = C.query.sort;
        !F && !O || F && O && F.field === O.field && F.direction === O.direction || (C.query.sort = O, Z(C));
      }
    };
    for (const [q, D] of Object.entries(C._queryHandlers))
      C.dom.addEventListener(q, D);
  }
  function k(C, q, D, M) {
    const O = D && D.requestId;
    return C._mutationChain = C._mutationChain.then(() => C.ready).then(() => {
      if (C.initializationError) throw C.initializationError;
      return M();
    }).catch((F) => j(C, q, O, F)), C._mutationChain;
  }
  function R(C) {
    return A(C._name).then((q) => (C.totalCount = q, C.hasCache = !0, C.isLoaded = !0, T(C._name, {
      schema_version: _,
      last_synced_at: C.lastSyncedAt,
      has_cache: !0,
      record_count: q
    })));
  }
  function N(C, { tempId: q, data: D = {}, requestId: M } = {}) {
    const O = { ...D, id: q };
    return v(C._name, O).then(() => R(C)).then(() => {
      L(C.dom, "ln-data-store:created", { store: C._name, record: O, tempId: q, requestId: M });
    });
  }
  function K(C, { id: q, data: D = {}, requestId: M } = {}) {
    return n(C._name, q).then((O) => {
      if (!O) throw new Error(`Record not found: ${q}`);
      const F = { ...O, ...D }, B = D.id;
      return (B !== void 0 && B !== q ? J(C._name, q, F) : v(C._name, F)).then(() => R(C)).then(() => {
        L(C.dom, "ln-data-store:updated", { store: C._name, record: F, previous: O, requestId: M });
      });
    });
  }
  function P(C, { id: q, requestId: D } = {}) {
    return n(C._name, q).then((M) => {
      if (!M) {
        L(C.dom, "ln-data-store:deleted", { store: C._name, id: q, requestId: D, missing: !0 });
        return;
      }
      return E(C._name, q).then(() => R(C)).then(() => {
        L(C.dom, "ln-data-store:deleted", { store: C._name, id: q, requestId: D });
      });
    });
  }
  function U(C, { ids: q = [], requestId: D } = {}) {
    return q.length ? Promise.all(q.map((M) => n(C._name, M))).then((M) => {
      const O = M.filter(Boolean).map((F) => F.id);
      return W(C._name, O).then(() => R(C)).then(() => {
        L(C.dom, "ln-data-store:deleted", { store: C._name, ids: O, requestId: D });
      });
    }) : (L(C.dom, "ln-data-store:deleted", { store: C._name, ids: [], requestId: D }), Promise.resolve());
  }
  function j(C, q, D, M) {
    console.error("[ln-data-store] " + q + " failed:", M), L(C.dom, "ln-data-store:mutation-error", {
      store: C._name,
      action: q,
      requestId: D,
      error: M
    });
  }
  function et(C) {
    return d().then((q) => {
      if (!q) throw new Error("IndexedDB is unavailable");
      return S(C._name);
    }).then((q) => {
      if (C.initializationError = null, q && q.schema_version === _)
        C.lastSyncedAt = q.last_synced_at || null, C.totalCount = q.record_count || 0, C.hasCache = q.has_cache === !0 || C.totalCount > 0, C.hasCache && (C.isLoaded = !0, L(C.dom, "ln-data-store:ready", { store: C._name, count: C.totalCount, source: "cache" })), C.isInitialized = !0, L(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: C.hasCache, lastSyncedAt: C.lastSyncedAt, count: C.totalCount });
      else {
        if (q && q.schema_version !== _)
          return w(C._name).then(() => T(C._name, { schema_version: _, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            C.isInitialized = !0, C.hasCache = !1, L(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        C.isInitialized = !0, C.hasCache = !1, L(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((q) => (C.isInitialized = !0, C.isLoaded = !1, C.hasCache = !1, C.isSyncing = !1, C.initializationError = q, L(C.dom, "ln-data-store:initialization-error", { store: C._name, error: q }), { ok: !1, error: q }));
  }
  function Lt(C) {
    C.isSyncing = !0, L(C.dom, "ln-data-store:request-remote-sync", { since: C.lastSyncedAt });
  }
  function H(C, q) {
    return u().then((D) => D ? (bt() ? Promise.all(q.map((O) => g(O))) : Promise.resolve(q)).then((O) => new Promise((F, B) => {
      const V = D.transaction(C, "readwrite"), G = V.objectStore(C);
      O.forEach((Q) => G.put(Q)), V.oncomplete = () => F(), V.onerror = () => {
        l(V.error), B(V.error);
      };
    })) : void 0);
  }
  function W(C, q) {
    return u().then((D) => {
      if (D)
        return new Promise((M, O) => {
          const F = D.transaction(C, "readwrite"), B = F.objectStore(C);
          q.forEach((V) => B.delete(V)), F.oncomplete = () => M(), F.onerror = () => O(F.error);
        });
    });
  }
  function J(C, q, D) {
    return (bt() ? g(D) : Promise.resolve(D)).then((O) => u().then((F) => {
      if (F)
        return new Promise((B, V) => {
          const G = F.transaction(C, "readwrite"), Q = G.objectStore(C);
          Q.put(O), Q.delete(q), G.oncomplete = () => B(), G.onerror = () => {
            l(G.error), V(G.error);
          };
        });
    }));
  }
  const Tt = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function pt(C, q) {
    if (!q || !q.field) return C;
    const { field: D, direction: M } = q, O = M === "desc";
    return [...C].sort((F, B) => {
      const V = F[D], G = B[D];
      if (V == null && G == null) return 0;
      if (V == null) return O ? 1 : -1;
      if (G == null) return O ? -1 : 1;
      const Q = typeof V == "string" && typeof G == "string" ? Tt.compare(V, G) : V < G ? -1 : V > G ? 1 : 0;
      return O ? -Q : Q;
    });
  }
  function ot(C, q) {
    if (!q) return C;
    const D = Object.keys(q).filter((M) => Array.isArray(q[M]) && q[M].length > 0);
    return D.length ? C.filter(
      (M) => D.every((O) => q[O].map(String).includes(String(M[O])))
    ) : C;
  }
  function qt(C, q, D) {
    if (!q || !D || !D.length) return C;
    const M = q.toLowerCase();
    return C.filter(
      (O) => D.some((F) => {
        const B = O[F];
        return B != null && String(B).toLowerCase().includes(M);
      })
    );
  }
  function mt(C, q, D) {
    if (!C.length) return 0;
    if (D === "count") return C.length;
    const M = C.map((F) => parseFloat(F[q])).filter((F) => !isNaN(F)), O = M.reduce((F, B) => F + B, 0);
    return D === "sum" ? O : D === "avg" && M.length ? O / M.length : 0;
  }
  function ut(C, q) {
    if (!C.presenters || !C.presenters.computed) return q;
    const D = C.presenters.computed;
    return q.map((M) => {
      if (!M) return null;
      const O = { ...M };
      for (const [F, B] of Object.entries(D))
        try {
          O[F] = B(M);
        } catch (V) {
          console.error(`[ln-data-store] Decorator computed field failed for ${F}`, V);
        }
      return O;
    });
  }
  x.prototype.getAll = function(C = {}) {
    const q = this;
    if (q._windowIndex) {
      const D = C.offset || 0, M = C.limit || 200;
      q._windowIndex.ensure(D, D + M, C);
      const O = [];
      for (let B = D; B < D + M; B++) {
        const V = q._windowIndex.getId(B);
        O.push(V);
      }
      const F = Array.from(new Set(O.filter((B) => B !== void 0)));
      return p(q._name, F).then((B) => {
        const V = /* @__PURE__ */ new Map();
        for (let Q = 0; Q < B.length; Q++) {
          const st = B[Q];
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
          data: ut(q, G),
          total: q._windowIndex.grandTotal,
          filtered: q._windowIndex.logicalTotal,
          offset: D,
          queryGen: q._windowIndex.queryGen
        };
      });
    }
    return e(q._name).then((D) => {
      const M = D.length;
      C.filters && (D = ot(D, C.filters)), C.search && (D = qt(D, C.search, q._searchFields));
      const O = D.length;
      if (C.sort && (D = pt(D, C.sort)), C.offset || C.limit) {
        const F = C.offset || 0, B = C.limit || D.length;
        D = D.slice(F, F + B);
      }
      return {
        data: ut(q, D),
        total: M,
        filtered: O
      };
    });
  }, x.prototype.getById = function(C) {
    return n(this._name, C).then((q) => q ? ut(this, [q])[0] : null);
  }, x.prototype.count = function(C) {
    return C ? e(this._name).then((q) => ot(q, C).length) : A(this._name);
  }, x.prototype.aggregate = function(C, q) {
    return e(this._name).then((D) => mt(D, C, q));
  }, x.prototype.setPresenters = function(C) {
    this.presenters = C;
  }, x.prototype.applySync = function(C, q, D, M) {
    M = M || {};
    const O = this;
    if (O._windowIndex && M.queryGen != null && M.queryGen !== O._windowIndex.queryGen)
      return Promise.resolve();
    C.length > 0 || q.length > 0;
    let F = Promise.resolve();
    return C.length > 0 && (F = F.then(() => H(O._name, C))), q.length > 0 && (F = F.then(() => W(O._name, q))), F.then(() => {
      if (O._windowIndex && (M.offset != null || M.total != null)) {
        const B = M.offset != null ? M.offset : 0, V = C.map((G) => G.id);
        O._windowIndex.ingest(B, V, M.total, M.filtered, M.queryGen);
      }
    }).then(() => A(O._name)).then((B) => (O.totalCount = M.total !== void 0 ? M.total : B, O.hasCache = !0, T(O._name, {
      schema_version: _,
      last_synced_at: D,
      has_cache: !0,
      record_count: O.totalCount
    }))).then(() => {
      const B = !O.isLoaded;
      O.isLoaded = !0, O.isSyncing = !1, O.lastSyncedAt = D, B ? (L(O.dom, "ln-data-store:loaded", { store: O._name, count: O.totalCount, meta: M }), L(O.dom, "ln-data-store:ready", { store: O._name, count: O.totalCount, source: "server", meta: M })) : L(O.dom, "ln-data-store:synced", {
        store: O._name,
        added: C.length,
        deleted: q.length,
        changed: !0,
        meta: M
      });
    }).catch((B) => {
      O.isSyncing = !1, console.error("[ln-data-store] applySync failed:", B);
    });
  }, x.prototype.applyQuery = function(C, q) {
    q = q || {};
    const D = this;
    let M = Promise.resolve();
    return C.length > 0 && (M = M.then(() => H(D._name, C))), M.then(() => A(D._name)).then((O) => (D.totalCount = q.total !== void 0 ? q.total : O, ut(D, C))).catch((O) => (console.error("[ln-data-store] applyQuery failed:", O), []));
  }, x.prototype.forceSync = function() {
    this.isSyncing || Lt(this);
  }, x.prototype.fullReload = function() {
    const C = this;
    return w(C._name).then(() => T(C._name, {
      schema_version: _,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      C.isLoaded = !1, C.hasCache = !1, C.lastSyncedAt = null, C.totalCount = 0, Lt(C);
    });
  }, x.prototype.destroy = function() {
    if (this._windowIndex && (this._windowIndex.clear(), this._windowIndex = null), this._handlers) {
      for (const [C, q] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${C}`, q);
      this._handlers = null;
    }
    if (this._queryHandlers) {
      for (const [C, q] of Object.entries(this._queryHandlers))
        this.dom.removeEventListener(C, q);
      this._queryHandlers = null;
    }
    delete o[this._name], delete this.dom[a], L(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function Ot() {
    return u().then((C) => {
      if (!C) return;
      const q = Array.from(C.objectStoreNames);
      return new Promise((D, M) => {
        const O = C.transaction(q, "readwrite");
        q.forEach((F) => O.objectStore(F).clear()), O.oncomplete = () => D(), O.onerror = () => M(O.error);
      });
    }).then(() => {
      Object.values(o).forEach((C) => {
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
  z(c, a, x, "ln-data-store"), window[a].clearAll = Ot, window[a].init = window[a], window[a].setStorageKey = ae, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = ae);
})();
(function() {
  const c = "data-ln-api-connector", a = "lnApiConnector", b = "lnConnector";
  if (window[a] !== void 0) return;
  function y(o) {
    return o.ok ? o.status === 204 ? null : o.json() : o.json().catch(() => null).then((l) => {
      const s = new Error("HTTP " + o.status + ": " + o.statusText);
      throw s.status = o.status, s.data = l, s;
    });
  }
  function _(o) {
    return this.dom = o, o[a] = this, o[b] = this, this._inflight = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, m(this), this;
  }
  _.prototype.refreshConfig = function() {
    const o = this.dom;
    this.baseUrl = o.getAttribute("data-ln-api-base-url") || "", this.path = o.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin", this.paramKeys = {
      offset: o.getAttribute("data-ln-api-param-offset") || "offset",
      limit: o.getAttribute("data-ln-api-param-limit") || "limit",
      search: o.getAttribute("data-ln-api-param-search") || "search",
      sortField: o.getAttribute("data-ln-api-param-sort-field") || "sort_field",
      sortDir: o.getAttribute("data-ln-api-param-sort-dir") || "sort_dir"
    };
    const l = o.getAttribute("data-ln-api-headers") || "";
    this.headers = ye(l, "ln-api-connector"), (l.toLowerCase().includes("authorization") || l.toLowerCase().includes("bearer") || l.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), L(o, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, _.prototype._reqHeaders = function(o) {
    const l = Object.assign({}, St(this.headers), { "X-LN-Response": "data" });
    return o && (l["Idempotency-Key"] = o), l;
  }, _.prototype.fetchDelta = function(o, l) {
    const s = this;
    let d = tt(s.baseUrl, s.path);
    o != null && o !== "" && (d += (d.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(o));
    const h = l || "sync";
    s._inflight.has(h) && s._inflight.get(h).abort();
    const u = new AbortController();
    return s._inflight.set(h, u), window.fetch(d, {
      method: "GET",
      headers: s._reqHeaders(),
      credentials: s.credentials,
      signal: u.signal
    }).then(y).finally(function() {
      s._inflight.get(h) === u && s._inflight.delete(h);
    });
  }, _.prototype.query = function(o, l) {
    const s = this;
    o = o || {};
    let d = tt(s.baseUrl, s.path);
    const h = s.paramKeys || {
      offset: "offset",
      limit: "limit",
      search: "search",
      sortField: "sort_field",
      sortDir: "sort_dir"
    }, u = new URLSearchParams();
    o.search && u.append(h.search, o.search), o.offset != null && u.append(h.offset, o.offset), o.limit != null && u.append(h.limit, o.limit), o.sort && o.sort.field && o.sort.direction && (u.append(h.sortField, o.sort.field), u.append(h.sortDir, o.sort.direction)), o.filters && typeof o.filters == "object" && Object.keys(o.filters).forEach((e) => {
      const n = o.filters[e];
      Array.isArray(n) && n.length > 0 && u.append(e, n.join(","));
    });
    const g = u.toString();
    g && (d += (d.indexOf("?") !== -1 ? "&" : "?") + g);
    let i = null;
    l && (s._inflight.has(l) && s._inflight.get(l).abort(), i = new AbortController(), s._inflight.set(l, i));
    const r = {
      method: "GET",
      headers: s._reqHeaders(),
      credentials: s.credentials
    };
    i && (r.signal = i.signal);
    let t = window.fetch(d, r).then(y);
    return l && i && (t = t.finally(function() {
      s._inflight.get(l) === i && s._inflight.delete(l);
    })), t;
  }, _.prototype.create = function(o, l, s) {
    const d = this;
    return window.fetch(tt(d.baseUrl, l || d.path), {
      method: "POST",
      headers: d._reqHeaders(s),
      credentials: d.credentials,
      body: JSON.stringify(o)
    }).then(y);
  }, _.prototype.update = function(o, l, s, d, h) {
    const u = this;
    s != null && (l = Object.assign({}, l, { expected_version: s }));
    const g = d ? tt(u.baseUrl, d) : tt(u.baseUrl, u.path, o);
    return window.fetch(g, {
      method: "PUT",
      headers: u._reqHeaders(h),
      credentials: u.credentials,
      body: JSON.stringify(l)
    }).then(y);
  }, _.prototype.delete = function(o, l, s) {
    const d = this;
    return window.fetch(tt(d.baseUrl, l || d.path, o), {
      method: "DELETE",
      headers: d._reqHeaders(s),
      credentials: d.credentials
    }).then(y);
  }, _.prototype.bulkDelete = function(o, l, s) {
    const d = this;
    return window.fetch(tt(d.baseUrl, l || d.path) + "/bulk-delete", {
      method: "DELETE",
      headers: d._reqHeaders(s),
      credentials: d.credentials,
      body: JSON.stringify({ ids: o })
    }).then(y);
  };
  function m(o) {
    o._handlers = {
      sync: function(s) {
        const d = s.detail || {}, h = d.meta && d.meta.targetEl ? d.meta.targetEl : null;
        o.fetchDelta(d.since, h).then(function(u) {
          L(o.dom, "ln-api-connector:fetched", { data: u, since: d.since, meta: d.meta || null });
        }).catch(function(u) {
          u && u.name === "AbortError" || L(o.dom, "ln-api-connector:error", {
            action: "sync",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            since: d.since,
            meta: d.meta || null
          });
        });
      },
      query: function(s) {
        const d = s.detail || {}, h = d.query || d, u = d.meta && d.meta.targetEl ? d.meta.targetEl : null;
        o.query(h, u).then(function(g) {
          const i = g || {};
          L(o.dom, "ln-api-connector:fetched", {
            data: i.data || (Array.isArray(i) ? i : []),
            total: i.total,
            filtered: i.filtered,
            offset: h.offset,
            queryGen: h.queryGen,
            meta: d.meta || null
          });
        }).catch(function(g) {
          g && g.name === "AbortError" || L(o.dom, "ln-api-connector:error", {
            action: "query",
            error: g.message,
            status: g.status || 0,
            data: g.data || null,
            meta: d.meta || null
          });
        });
      },
      create: function(s) {
        const d = s.detail || {};
        o.create(d.data, d.url, d.idempotencyKey).then(function(h) {
          const u = h && h.content !== void 0 ? h.content : h, g = h && h.message ? h.message : null;
          L(o.dom, "ln-api-connector:created", { record: u, tempId: d.tempId, message: g, meta: d.meta || null });
        }).catch(function(h) {
          L(o.dom, "ln-api-connector:error", {
            action: "create",
            error: h.message,
            status: h.status || 0,
            data: h.data || null,
            tempId: d.tempId,
            meta: d.meta || null
          });
        });
      },
      update: function(s) {
        const d = s.detail || {};
        o.update(d.id, d.data, d.expected_version, d.url, d.idempotencyKey).then(function(h) {
          const u = h && h.content !== void 0 ? h.content : h, g = h && h.message ? h.message : null;
          L(o.dom, "ln-api-connector:updated", { record: u, id: d.id, message: g, meta: d.meta || null });
        }).catch(function(h) {
          L(o.dom, "ln-api-connector:error", {
            action: "update",
            error: h.message,
            status: h.status || 0,
            data: h.data || null,
            id: d.id,
            conflictData: h.status === 409 ? h.data : null,
            meta: d.meta || null
          });
        });
      },
      delete: function(s) {
        const d = s.detail || {};
        o.delete(d.id, d.url, d.idempotencyKey).then(function(h) {
          const u = h && h.message ? h.message : null;
          L(o.dom, "ln-api-connector:deleted", { response: h, id: d.id, message: u, meta: d.meta || null });
        }).catch(function(h) {
          L(o.dom, "ln-api-connector:error", {
            action: "delete",
            error: h.message,
            status: h.status || 0,
            data: h.data || null,
            id: d.id,
            meta: d.meta || null
          });
        });
      },
      bulkDelete: function(s) {
        const d = s.detail || {};
        o.bulkDelete(d.ids, d.url, d.idempotencyKey).then(function(h) {
          const u = h && h.message ? h.message : null;
          L(o.dom, "ln-api-connector:bulk-deleted", { response: h, ids: d.ids, message: u, meta: d.meta || null });
        }).catch(function(h) {
          L(o.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: h.message,
            status: h.status || 0,
            data: h.data || null,
            ids: d.ids,
            meta: d.meta || null
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(s) {
      o.dom.addEventListener(s + ":request-sync", o._handlers.sync), o.dom.addEventListener(s + ":request-query", o._handlers.query), o.dom.addEventListener(s + ":request-fetch", o._handlers.query), o.dom.addEventListener(s + ":request-create", o._handlers.create), o.dom.addEventListener(s + ":request-update", o._handlers.update), o.dom.addEventListener(s + ":request-delete", o._handlers.delete), o.dom.addEventListener(s + ":request-bulk-delete", o._handlers.bulkDelete);
    });
  }
  _.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const o = this;
    o._inflight && (o._inflight.forEach(function(l) {
      l.abort();
    }), o._inflight.clear()), o._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(s) {
      o.dom.removeEventListener(s + ":request-sync", o._handlers.sync), o.dom.removeEventListener(s + ":request-query", o._handlers.query), o.dom.removeEventListener(s + ":request-fetch", o._handlers.query), o.dom.removeEventListener(s + ":request-create", o._handlers.create), o.dom.removeEventListener(s + ":request-update", o._handlers.update), o.dom.removeEventListener(s + ":request-delete", o._handlers.delete), o.dom.removeEventListener(s + ":request-bulk-delete", o._handlers.bulkDelete);
    }), o._handlers = null), L(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[a], delete this.dom[b];
  };
  function f(o) {
    const l = o[a];
    l && l.refreshConfig();
  }
  z(c, a, _, "ln-api-connector", {
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
    onAttributeChange: f
  });
})();
(function() {
  const c = "data-ln-couchdb-connector", a = "lnCouchDbConnector", b = "lnConnector";
  if (window[a] !== void 0) return;
  function y(u) {
    const g = u && u.content !== void 0 ? u.content : u, i = u && u.message ? u.message : null;
    return { content: g, message: i };
  }
  function _(u) {
    return this.dom = u, u[a] = this, u[b] = this, this.refreshConfig(), this._handlers = null, d(this), this;
  }
  _.prototype.refreshConfig = function() {
    const u = this.dom;
    this.url = u.getAttribute("data-ln-couchdb-url") || "", this.db = u.getAttribute("data-ln-couchdb-db") || "", this.auth = u.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const g = u.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = ye(g, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), g.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), L(u, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function m(u, g, i) {
    const r = Object.assign({}, St(u.headers, u.auth), i || {});
    return g && (r["Idempotency-Key"] = g), r;
  }
  _.prototype.fetchDelta = function(u) {
    const g = this, i = ["include_docs=true", "feed=normal"];
    u && i.push("since=" + encodeURIComponent(u));
    const r = tt(g.url, g.db, "_changes") + "?" + i.join("&");
    return window.fetch(r, { method: "GET", headers: St(g.headers, g.auth), credentials: g.credentials }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const e = t.results || [];
      return {
        data: e.filter((n) => !n.deleted && n.doc).map((n) => Object.assign({}, n.doc, { id: n.doc._id })),
        deleted: e.filter((n) => n.deleted).map((n) => n.id),
        synced_at: t.last_seq || u || ""
      };
    });
  };
  function f(u, g, i) {
    const r = Object.assign({ _id: g.id }, g);
    return r._id || delete r._id, window.fetch(tt(u.url, u.db), {
      method: "POST",
      headers: m(u, i),
      credentials: u.credentials,
      body: JSON.stringify(r)
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const e = y(t), n = e.content;
      return { record: Object.assign({}, r, { id: n.id, _id: n.id, _rev: n.rev }), message: e.message };
    });
  }
  _.prototype.create = function(u, g) {
    return f(this, u, g).then((i) => i.record);
  };
  function o(u, g, i, r) {
    const t = Object.assign({ id: String(g), _id: String(g) }, i), e = t._rev || t.rev;
    return (e ? Promise.resolve(e) : window.fetch(tt(u.url, u.db, null, g), { method: "GET", headers: St(u.headers, u.auth), credentials: u.credentials }).then((p) => {
      if (!p.ok) throw new Error("Could not retrieve document for revision mapping");
      return p.json().then((v) => v._rev);
    })).then((p) => {
      const v = Object.assign({}, t, { _rev: p });
      delete v.rev;
      const E = m(u, r, { "If-Match": p });
      return window.fetch(tt(u.url, u.db, null, g), {
        method: "PUT",
        headers: E,
        credentials: u.credentials,
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
  _.prototype.update = function(u, g, i) {
    return o(this, u, g, i).then((r) => r.record);
  };
  function l(u, g, i, r) {
    return (i ? Promise.resolve(i) : window.fetch(tt(u.url, u.db, null, g), { method: "GET", headers: St(u.headers, u.auth), credentials: u.credentials }).then((e) => {
      if (!e.ok) throw new Error("Could not retrieve document for revision delete");
      return e.json().then((n) => n._rev);
    })).then((e) => {
      const n = tt(u.url, u.db, null, g) + "?rev=" + encodeURIComponent(e);
      return window.fetch(n, { method: "DELETE", headers: m(u, r), credentials: u.credentials }).then((p) => {
        if (!p.ok) throw new Error("HTTP " + p.status + ": " + p.statusText);
        return p.json();
      }).then((p) => {
        const v = y(p);
        return { response: v.content, message: v.message };
      });
    });
  }
  _.prototype.delete = function(u, g, i) {
    return l(this, u, g, i).then((r) => r.response);
  };
  function s(u, g, i) {
    return !g || g.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(tt(u.url, u.db, "_all_docs"), {
      method: "POST",
      headers: St(u.headers, u.auth),
      credentials: u.credentials,
      body: JSON.stringify({ keys: g })
    }).then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status + ": " + r.statusText);
      return r.json();
    }).then((r) => {
      const e = (r.rows || []).filter((n) => !n.error && n.value && n.value.rev).map((n) => ({ _id: n.id, _rev: n.value.rev, _deleted: !0 }));
      return e.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(tt(u.url, u.db, "_bulk_docs"), {
        method: "POST",
        headers: m(u, i),
        credentials: u.credentials,
        body: JSON.stringify({ docs: e })
      }).then((n) => {
        if (!n.ok) throw new Error("HTTP " + n.status + ": " + n.statusText);
        return n.json();
      }).then((n) => {
        const p = y(n);
        return { response: { ok: !0, results: p.content, deletedCount: e.length }, message: p.message };
      });
    });
  }
  _.prototype.bulkDelete = function(u, g) {
    return s(this, u, g).then((i) => i.response);
  };
  function d(u) {
    u._handlers = {
      sync: function(i) {
        const r = i.detail || {};
        u.fetchDelta(r.since).then(function(t) {
          L(u.dom, "ln-couchdb-connector:fetched", { data: t, since: r.since, meta: r.meta || null });
        }).catch(function(t) {
          L(u.dom, "ln-couchdb-connector:error", {
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
        f(u, r.data, r.idempotencyKey).then(function(t) {
          L(u.dom, "ln-couchdb-connector:created", { record: t.record, tempId: r.tempId, message: t.message, meta: r.meta || null });
        }).catch(function(t) {
          L(u.dom, "ln-couchdb-connector:error", {
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
        r.expected_version !== void 0 && (t._rev = r.expected_version), o(u, r.id, t, r.idempotencyKey).then(function(e) {
          L(u.dom, "ln-couchdb-connector:updated", { record: e.record, id: r.id, message: e.message, meta: r.meta || null });
        }).catch(function(e) {
          L(u.dom, "ln-couchdb-connector:error", {
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
        l(u, r.id, r.rev, r.idempotencyKey).then(function(t) {
          L(u.dom, "ln-couchdb-connector:deleted", { response: t.response, id: r.id, message: t.message, meta: r.meta || null });
        }).catch(function(t) {
          L(u.dom, "ln-couchdb-connector:error", {
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
        s(u, r.ids, r.idempotencyKey).then(function(t) {
          L(u.dom, "ln-couchdb-connector:bulk-deleted", { response: t.response, ids: r.ids, message: t.message, meta: r.meta || null });
        }).catch(function(t) {
          L(u.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: t.message,
            status: t.status || 0,
            ids: r.ids,
            meta: r.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(i) {
      u.dom.addEventListener(i + ":request-sync", u._handlers.sync), u.dom.addEventListener(i + ":request-fetch", u._handlers.sync), u.dom.addEventListener(i + ":request-create", u._handlers.create), u.dom.addEventListener(i + ":request-update", u._handlers.update), u.dom.addEventListener(i + ":request-delete", u._handlers.delete), u.dom.addEventListener(i + ":request-bulk-delete", u._handlers.bulkDelete);
    });
  }
  _.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const u = this;
    u._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(i) {
      u.dom.removeEventListener(i + ":request-sync", u._handlers.sync), u.dom.removeEventListener(i + ":request-fetch", u._handlers.sync), u.dom.removeEventListener(i + ":request-create", u._handlers.create), u.dom.removeEventListener(i + ":request-update", u._handlers.update), u.dom.removeEventListener(i + ":request-delete", u._handlers.delete), u.dom.removeEventListener(i + ":request-bulk-delete", u._handlers.bulkDelete);
    }), u._handlers = null), L(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[a], delete this.dom[b];
  };
  function h(u) {
    const g = u[a];
    g && g.refreshConfig();
  }
  z(c, a, _, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: h
  });
})();
function on(c) {
  return c = c || {}, {
    sort: c.sort,
    filters: c.filters,
    search: c.search,
    offset: c.offset,
    limit: c.limit,
    queryGen: c.queryGen
  };
}
function Wt(c, a) {
  const b = !c || !!c.initializationError;
  return a && (b || !c.isLoaded) ? "remote" : c && !c.initializationError ? "store" : "none";
}
function ue(c, a) {
  const b = Object.assign({}, c);
  return a && (b.filters = a.filters, b.search = a.search, b.sort = a.sort), b;
}
class sn {
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
    const _ = this._pending.get(y);
    return _ ? (this._pending.delete(y), b ? _.reject(a.error || new Error("Store mutation failed")) : _.resolve(a), !0) : !1;
  }
}
(function() {
  const c = "data-ln-data-coordinator", a = "lnDataCoordinator", b = "lnCoordinator", y = "data-ln-form-scope";
  if (window[a] !== void 0) return;
  const _ = /* @__PURE__ */ new Set();
  let m = !1, f = null, o = null, l = null;
  function s() {
    m || (m = !0, f = function() {
      L(document, "ln-data-store:online", {}), _.forEach(function(t) {
        t._maybeSync();
      });
    }, o = function() {
      L(document, "ln-data-store:offline", {});
    }, l = function() {
      document.visibilityState === "visible" && _.forEach(function(t) {
        const e = t.findChildren(), n = e.store;
        n && e.connector && n.isInitialized && !n.initializationError && !n.isSyncing && !t._noAutosync && (!n.hasCache || t._isStale()) && n.forceSync();
      });
    }, window.addEventListener("online", f), window.addEventListener("offline", o), document.addEventListener("visibilitychange", l));
  }
  function d() {
    m && (_.size > 0 || (window.removeEventListener("online", f), window.removeEventListener("offline", o), document.removeEventListener("visibilitychange", l), f = null, o = null, l = null, m = !1));
  }
  function h() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
        const n = Math.random() * 16 | 0;
        return (e === "x" ? n : n & 3 | 8).toString(16);
      });
    }
  }
  const u = ["ln-api-connector", "ln-couchdb-connector"];
  function g(t) {
    return this.dom = t, this._name = t.id, this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", t), t[a] = this, t[b] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new sn(), this._dict = te(t, "data-ln-data-coordinator-dict"), this._parseStaleAttributes(), this.refreshMapper(), i(this), _.add(this), s(), this._checkInitialSync(), this;
  }
  g.prototype._parseStaleAttributes = function() {
    const e = this.findChildren().storeEl, n = this.dom.getAttribute("data-ln-data-coordinator-stale") || (e ? e.getAttribute("data-ln-data-store-stale") : null), p = parseInt(n, 10);
    this._staleThreshold = n === "never" || n === "-1" ? -1 : isNaN(p) ? 300 : p;
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
      const p = t.findChildren(), v = p.store;
      if (v && v.initializationError) {
        t._reportReconciliationError("store-initialize", v.initializationError, null);
        return;
      }
      !v || !p.connector || t._noAutosync || v.isSyncing || (!v.hasCache || t._isStale()) && v.forceSync();
    }).catch(function(p) {
      t._reportReconciliationError("store-initialize", p, null);
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
    const n = t.data || {}, p = n.id, v = n.expected_version, E = Object.assign({}, n);
    delete E.id, delete E.expected_version;
    const w = t.method.toUpperCase();
    w === "POST" ? this._fanOutCreate(e, E, t.action) : (w === "PUT" || w === "PATCH") && this._fanOutUpdate(e, p, E, v, t.action);
  }, g.prototype._fanOutCreate = function(t, e, n) {
    this.refreshMapper();
    const p = "_temp_" + h();
    L(t.storeEl, "ln-data-store:request-create", { tempId: p, data: e }), t.queue ? L(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: p,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(e),
      expectedVersion: null,
      meta: { tempId: p, action: n }
    }) : t.connector && L(t.connectorEl, "ln-api-connector:request-create", {
      data: this.mapper.egress(e),
      url: n,
      meta: { entryId: h(), queued: !1, op: "create", tempId: p }
    });
  }, g.prototype._fanOutUpdate = function(t, e, n, p, v) {
    this.refreshMapper(), L(t.storeEl, "ln-data-store:request-update", { id: e, data: n }), t.queue ? L(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: e,
      op: "update",
      targetId: e,
      payload: this.mapper.egress(n),
      expectedVersion: p,
      meta: { id: e, action: v }
    }) : t.connector && L(t.connectorEl, "ln-api-connector:request-update", {
      id: e,
      data: this.mapper.egress(n),
      expected_version: p,
      url: v,
      meta: { entryId: h(), queued: !1, op: "update", id: e }
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
      meta: { entryId: h(), queued: !1, op: "delete", id: e }
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
      meta: { entryId: h(), queued: !1, op: "bulk-delete", bulkKey: n }
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
    const p = t.storeEl;
    if (!p) return Promise.reject(new Error("Store element not found"));
    const v = h(), E = this._mutationReceipts.wait(v);
    return L(p, "ln-data-store:request-" + e, Object.assign({}, n, { requestId: v })), E;
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
        const p = e.detail || {};
        L(n.connectorEl, "ln-api-connector:request-query", {
          query: Object.assign({}, p.query, {
            offset: p.offset,
            limit: p.limit,
            queryGen: p.queryGen
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
        const p = e.detail || {}, v = p.entryId, E = p.op, w = p.targetId, A = p.payload, S = p.expectedVersion, T = p.meta || {}, x = T.action || null, I = p.idempotencyKey || v;
        E === "create" ? L(n.connectorEl, "ln-api-connector:request-create", {
          data: A,
          url: x,
          idempotencyKey: I,
          meta: { entryId: v, queued: !0, op: "create", tempId: T.tempId }
        }) : E === "update" ? L(n.connectorEl, "ln-api-connector:request-update", {
          id: w,
          data: A,
          expected_version: S,
          url: x,
          idempotencyKey: I,
          meta: { entryId: v, queued: !0, op: "update", id: w }
        }) : E === "delete" ? L(n.connectorEl, "ln-api-connector:request-delete", {
          id: w,
          idempotencyKey: I,
          meta: { entryId: v, queued: !0, op: "delete", id: w }
        }) : E === "bulk-delete" ? L(n.connectorEl, "ln-api-connector:request-bulk-delete", {
          ids: A && A.ids ? A.ids : [],
          idempotencyKey: I,
          meta: { entryId: v, queued: !0, op: "bulk-delete", bulkKey: T.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", E);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(e) {
        const n = e.target;
        if (e.defaultPrevented) return;
        const p = n.hasAttribute(y) ? n.getAttribute(y) : null;
        if (p === null) return;
        let v;
        if (p ? v = p === t._name : v = n.closest("[data-ln-data-coordinator]") === t.dom, !v) return;
        const E = Be(n);
        if (E !== "POST" && E !== "PUT" && E !== "PATCH") return;
        e.preventDefault();
        const w = me(n);
        delete w._method, delete w._token, t._handleSubmitRecord({ data: w, method: E, action: n.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(e) {
        const n = e.detail.meta || {}, p = t.findChildren();
        t.refreshMapper();
        const v = e.detail.data;
        let E = [], w = [], A = null;
        Array.isArray(v) ? (E = v, A = Math.floor(Date.now() / 1e3)) : v && (E = Array.isArray(v.data) ? v.data : [], w = Array.isArray(v.deleted) ? v.deleted : [], A = v.synced_at !== void 0 ? v.synced_at : v.since !== void 0 ? v.since : null);
        const S = E.map((T) => t.mapper.ingress(T));
        if (p.store && !p.store.initializationError)
          n.kind ? n.kind === "table" || n.kind === "list" || n.kind === "chart" ? p.store.applyQuery(S, { total: e.detail.total }).then(function(T) {
            L(n.targetEl, "ln-" + n.kind + ":set-loading", { loading: !1 }), L(n.targetEl, "ln-" + n.kind + ":set-data", {
              data: T,
              total: e.detail.total !== void 0 ? e.detail.total : T.length,
              filtered: e.detail.filtered !== void 0 ? e.detail.filtered : T.length,
              offset: e.detail.offset,
              queryGen: e.detail.queryGen
            }), t._boundDelivered.set(n.targetEl, !0);
          }) : n.kind === "options" ? p.store.applyQuery(S, { total: e.detail.total }).then(function() {
            return p.store.getAll({});
          }).then(function(T) {
            L(n.targetEl, "ln-options:set-data", { data: T.data });
          }) : n.kind === "stat" && p.store.applyQuery(S, { total: e.detail.total }).then(function() {
            const T = e.detail.filtered !== void 0 ? e.detail.filtered : e.detail.total !== void 0 ? e.detail.total : S.length;
            L(n.targetEl, "ln-stat:set-count", { count: T });
          }) : p.store.applySync(S, w, A || Math.floor(Date.now() / 1e3), {
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
            const T = e.detail.filtered !== void 0 ? e.detail.filtered : e.detail.total !== void 0 ? e.detail.total : S.length;
            L(n.targetEl, "ln-stat:set-count", { count: T });
          }
        }
      },
      connCreated: function(e) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const p = e.detail.meta || {}, v = t.mapper.ingress(e.detail.record);
        t._requestStoreMutation(n, "update", { id: p.tempId, data: v }).then(function() {
          t._toastFromMessage(e.detail.message), p.queued && n.queue && L(n.queueEl, "ln-api-queue:resolve-create", {
            entryId: p.entryId,
            oldKey: p.tempId,
            newId: v.id
          });
        }).catch(function(E) {
          t._reportReconciliationError("create-reconcile", E, p);
        });
      },
      connUpdated: function(e) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const p = e.detail.meta || {}, v = t.mapper.ingress(e.detail.record);
        t._requestStoreMutation(n, "update", { id: p.id, data: v }).then(function() {
          t._toastFromMessage(e.detail.message), p.queued && n.queue && L(n.queueEl, "ln-api-queue:ack", { entryId: p.entryId });
        }).catch(function(E) {
          t._reportReconciliationError("update-reconcile", E, p);
        });
      },
      connDeleted: function(e) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const p = e.detail.meta || {};
        t._toastFromMessage(e.detail.message), p.queued && n.queue && L(n.queueEl, "ln-api-queue:ack", { entryId: p.entryId });
      },
      connBulkDeleted: function(e) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const p = e.detail.meta || {};
        t._toastFromMessage(e.detail.message), p.queued && n.queue && L(n.queueEl, "ln-api-queue:ack", { entryId: p.entryId });
      },
      connError: function(e) {
        const n = e.detail || {}, p = n.meta || {}, v = p.op || n.action, E = n.status || 0, w = t.findChildren();
        if (v === "sync") {
          w.storeEl && L(w.storeEl, "ln-data-store:request-sync-failed", {
            error: n.error,
            status: E
          }), console.error("[ln-data-coordinator] Sync failed:", n.error);
          return;
        }
        if (v === "query") {
          p.targetEl && p.kind && (L(p.targetEl, "ln-" + p.kind + ":set-loading", { loading: !1 }), (p.kind === "table" || p.kind === "list") && L(p.targetEl, "ln-" + p.kind + ":page-failed", { offset: p.offset })), t._reportReconciliationError("query", n.error || n, p);
          return;
        }
        if (!w.storeEl) return;
        const A = E === 401 || E === 419, S = E === 0 || E >= 500, T = E === 409 || E === 412;
        if (A) {
          t._toastFromDict("auth"), p.queued && w.queue && L(w.queueEl, "ln-api-queue:nack", { entryId: p.entryId, reason: "auth" });
          return;
        }
        if (S) {
          p.queued && w.queue ? L(w.queueEl, "ln-api-queue:nack", { entryId: p.entryId, reason: "retry" }) : t._toastFromDict("network");
          return;
        }
        let x = Promise.resolve();
        if (T && v === "update") {
          const I = n.data && n.data.remote ? t.mapper.ingress(n.data.remote) : null;
          I && (x = t._requestStoreMutation(w, "update", { id: p.id, data: I })), t._toastFromDict("conflict");
        } else v === "create" && (x = t._requestStoreMutation(w, "delete", { id: p.tempId })), t._toastFromDict("rejected");
        p.queued && w.queue ? x.then(function() {
          L(w.queueEl, "ln-api-queue:nack", { entryId: p.entryId, reason: "drop" });
        }).catch(function(I) {
          t._reportReconciliationError("deterministic-reconcile", I, p);
        }) : x.catch(function(I) {
          t._reportReconciliationError("deterministic-reconcile", I, p);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(e) {
        const n = t.findChildren(), p = n.store;
        if (!p || p.initializationError || !n.connector || t._noAutosync || p.isSyncing) return;
        (e.detail || {}).hasCache ? t._isStale() && p.forceSync() : p.forceSync();
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
    }, t.dom.addEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.addEventListener("ln-data-store:request-page", t._handlers.requestPage), t.dom.addEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.addEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.addEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.addEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.addEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.addEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.addEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.addEventListener("submit", t._handlers.formSubmit), u.forEach(function(e) {
      t.dom.addEventListener(e + ":fetched", t._handlers.connFetched), t.dom.addEventListener(e + ":created", t._handlers.connCreated), t.dom.addEventListener(e + ":updated", t._handlers.connUpdated), t.dom.addEventListener(e + ":deleted", t._handlers.connDeleted), t.dom.addEventListener(e + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.addEventListener(e + ":error", t._handlers.connError);
    }), document.addEventListener("ln-table:request-data", t._handlers.reqTableData), document.addEventListener("ln-list:request-data", t._handlers.reqListData), document.addEventListener("ln-chart:request-data", t._handlers.reqChartData), document.addEventListener("ln-options:request-data", t._handlers.reqOptions), document.addEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.addEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.addEventListener("ln-data-store:created", t._handlers.refresh), t.dom.addEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.addEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.addEventListener("ln-data-store:mutation-error", t._handlers.mutationError), t.dom.addEventListener("ln-data-store:synced", t._handlers.refreshSynced), t.dom.addEventListener("ln-data-store:query-changed", t._handlers.refreshQuery);
  }
  g.prototype._ownsStore = function(t) {
    const e = this.findChildren();
    return !!(e.store && e.store._name === t && t);
  }, g.prototype._serveData = function(t, e) {
    const n = t.target, p = e === "table" ? "data-ln-table-source" : e === "list" ? "data-ln-list-source" : "data-ln-chart-source", v = n.getAttribute(p);
    if (!v || !this._ownsStore(v)) return;
    const E = t.detail || {}, w = on(E);
    this._boundQueries.set(n, w);
    const A = this.findChildren(), S = this, T = A.store;
    return (T && T.ready ? T.ready : Promise.resolve()).then(function() {
      const I = Wt(T, A.connector), k = ue(w, T && T.query);
      if (I === "remote") {
        L(n, "ln-" + e + ":set-loading", { loading: !0 }), L(A.connectorEl, "ln-api-connector:request-query", {
          query: k,
          meta: { targetEl: n, kind: e, offset: k.offset, limit: k.limit }
        });
        return;
      }
      if (I !== "store") {
        L(n, "ln-" + e + ":set-loading", { loading: !1 });
        return;
      }
      return T.getAll(k).then(function(R) {
        const N = {
          data: R.data,
          total: R.total,
          filtered: R.filtered,
          offset: E.offset !== void 0 ? E.offset : R.offset,
          queryGen: E.queryGen !== void 0 ? E.queryGen : R.queryGen
        };
        L(n, "ln-" + e + ":set-data", N), S._boundDelivered.set(n, !0);
      });
    }).catch(function(I) {
      L(n, "ln-" + e + ":set-loading", { loading: !1 }), L(S.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: e,
        store: v,
        target: n,
        error: I
      });
    });
  }, g.prototype._serveOptions = function(t) {
    const e = t.target, n = e.getAttribute("data-ln-options");
    if (!this._ownsStore(n)) return;
    const p = this.findChildren(), v = p.store, E = v && v.ready ? v.ready : Promise.resolve(), w = this;
    return E.then(function() {
      const A = Wt(v, p.connector);
      if (A === "remote") {
        L(p.connectorEl, "ln-api-connector:request-query", {
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
    const p = t.detail && t.detail.filters ? t.detail.filters : null, v = this.findChildren(), E = v.store, w = E && E.ready ? E.ready : Promise.resolve(), A = this;
    return w.then(function() {
      const S = Wt(E, v.connector);
      if (S === "remote") {
        L(v.connectorEl, "ln-api-connector:request-query", {
          query: { filters: p },
          meta: { targetEl: e, kind: "stat" }
        });
        return;
      }
      if (S === "store")
        return E.count(p).then(function(T) {
          L(e, "ln-stat:set-count", { count: T });
        });
    }).catch(function(S) {
      A._reportReconciliationError("stat-query", S, { targetEl: e, kind: "stat" });
    });
  }, g.prototype._refreshAll = function(t, e) {
    const n = this, p = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let v = 0; v < p.length; v++) {
      const E = p[v];
      let w, A;
      if (E.hasAttribute("data-ln-table-source") ? (w = E.getAttribute("data-ln-table-source"), A = "table") : E.hasAttribute("data-ln-list-source") ? (w = E.getAttribute("data-ln-list-source"), A = "list") : E.hasAttribute("data-ln-chart-source") ? (w = E.getAttribute("data-ln-chart-source"), A = "chart") : E.hasAttribute("data-ln-options") ? (w = E.getAttribute("data-ln-options"), A = "options") : E.hasAttribute("data-ln-stat") && (w = E.getAttribute("data-ln-stat"), A = "stat"), !this._ownsStore(w)) continue;
      const S = this.findChildren().store;
      if (A === "table" || A === "list") {
        const T = A === "table" ? "data-ln-table-window" : "data-ln-list-window";
        if (E.hasAttribute(T)) {
          L(E, "ln-" + A + (e ? ":request-invalidate" : ":request-revalidate"), {});
          continue;
        }
      }
      if (A === "table" || A === "list" || A === "chart") {
        const T = n._boundQueries.get(E) || { sort: null, filters: {}, search: "" };
        (function(x, I) {
          S.getAll(ue(T, S.query)).then(function(k) {
            const R = {
              data: k.data,
              total: t && t.total !== void 0 ? t.total : k.total,
              filtered: t && t.filtered !== void 0 ? t.filtered : k.filtered,
              offset: k.offset !== void 0 ? k.offset : t && t.offset !== void 0 ? t.offset : T.offset,
              queryGen: k.queryGen !== void 0 ? k.queryGen : t && t.queryGen !== void 0 ? t.queryGen : T.queryGen
            };
            L(x, "ln-" + I + ":set-loading", { loading: !1 }), L(x, "ln-" + I + ":set-data", R), n._boundDelivered.set(x, !0);
          });
        })(E, A);
      } else if (A === "options")
        (function(T) {
          S.getAll({}).then(function(x) {
            L(T, "ln-options:set-data", { data: x.data });
          });
        })(E);
      else if (A === "stat") {
        const T = E.getAttribute("data-ln-stat-filter");
        let x = null;
        if (T) {
          const I = T.indexOf(":");
          if (I !== -1) {
            const k = T.slice(0, I), R = T.slice(I + 1);
            x = {}, x[k] = [R];
          }
        }
        (function(I, k) {
          S.count(k).then(function(R) {
            L(I, "ln-stat:set-count", { count: R });
          });
        })(E, x);
      }
    }
  }, g.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const t = this;
    t._handlers && (t.dom.removeEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.removeEventListener("ln-data-store:request-page", t._handlers.requestPage), t.dom.removeEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.removeEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.removeEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.removeEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.removeEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.removeEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.removeEventListener("submit", t._handlers.formSubmit), u.forEach(function(e) {
      t.dom.removeEventListener(e + ":fetched", t._handlers.connFetched), t.dom.removeEventListener(e + ":created", t._handlers.connCreated), t.dom.removeEventListener(e + ":updated", t._handlers.connUpdated), t.dom.removeEventListener(e + ":deleted", t._handlers.connDeleted), t.dom.removeEventListener(e + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.removeEventListener(e + ":error", t._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", t._handlers.reqTableData), document.removeEventListener("ln-list:request-data", t._handlers.reqListData), document.removeEventListener("ln-chart:request-data", t._handlers.reqChartData), document.removeEventListener("ln-options:request-data", t._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.removeEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:created", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:mutation-error", t._handlers.mutationError), t.dom.removeEventListener("ln-data-store:synced", t._handlers.refreshSynced), t.dom.removeEventListener("ln-data-store:query-changed", t._handlers.refreshQuery), t._handlers = null), t._boundQueries = null, t._boundDelivered = null, t._mutationReceipts.close(new Error("Data coordinator destroyed")), t._mutationReceipts = null, _.delete(this), d(), delete this.dom[a], delete this.dom[b];
  };
  function r(t, e) {
    const n = t[a];
    n && e === "data-ln-data-mapper" && n.refreshMapper();
  }
  z(c, a, g, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: r
  });
})();
const an = "ln_api_queue", ln = 2, Y = "outbox", nt = "_queue_meta";
function at(c, a) {
  return c.error || new Error(a);
}
function Et(c, a) {
  return c.bound([a, -1 / 0], [a, 1 / 0]);
}
function he(c) {
  return "seq:" + c;
}
function Mt(c) {
  return "paused:" + c;
}
function fe(c) {
  c.leaseOwner = null, c.leaseUntil = 0;
}
function cn(c, a, b) {
  return typeof c != "string" || c.indexOf(a) === -1 ? c : c.split(a).join(b);
}
function dn(c, a, b, y) {
  const _ = /* @__PURE__ */ new Map(), m = [], f = [];
  for (const o of c || [])
    _.has(o.chainKey) || _.set(o.chainKey, []), _.get(o.chainKey).push(o);
  return _.forEach((o, l) => {
    o.sort((d, h) => d.seq - h.seq);
    const s = o[0];
    if (!(!s || s.status === "failed")) {
      if (s.status === "inflight" && (s.leaseUntil || 0) > y) {
        f.push({ chainKey: l, at: s.leaseUntil });
        return;
      }
      if ((s.nextAttemptAt || 0) > y) {
        f.push({ chainKey: l, at: s.nextAttemptAt });
        return;
      }
      s.status = "inflight", s.leaseOwner = a, s.leaseUntil = y + b, s.updatedAt = y, m.push(s);
    }
  }), { entries: m, wakeups: f };
}
function un(c, a, b, y, _) {
  const m = [], f = [];
  for (const o of c || []) {
    if (o.entryId === a) {
      f.push(o.entryId);
      continue;
    }
    o.chainKey === b && (o.chainKey = y, o.targetId === b && (o.targetId = y), o.meta && o.meta.id === b && (o.meta.id = y), o.meta && typeof o.meta.action == "string" && (o.meta.action = cn(o.meta.action, b, y)), o.updatedAt = _, m.push(o));
  }
  return { changed: m, deleted: f };
}
class hn {
  constructor(a) {
    a = a || {}, this.indexedDB = a.indexedDB || globalThis.indexedDB, this.keyRange = a.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = a.dbName || an, this.now = a.now || (() => Date.now()), this.uuid = a.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((a, b) => {
      const y = this.indexedDB.open(this.dbName, ln);
      y.onupgradeneeded = (_) => {
        const m = _.target.result;
        let f;
        m.objectStoreNames.contains(Y) ? f = _.target.transaction.objectStore(Y) : f = m.createObjectStore(Y, { keyPath: "entryId" }), f.indexNames.contains("by_scope_chain") || f.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), f.indexNames.contains("by_scope_seq") || f.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), m.objectStoreNames.contains(nt) || m.createObjectStore(nt, { keyPath: "key" });
      }, y.onerror = () => b(at(y, "Queue database open failed")), y.onsuccess = (_) => {
        this._db = _.target.result, this._db.onversionchange = () => this.close(), a(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((a, b) => {
      const y = this.indexedDB.deleteDatabase(this.dbName);
      y.onsuccess = () => a(), y.onerror = () => b(at(y, "Queue database delete failed")), y.onblocked = () => b(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(a) {
    return this.open().then((b) => b ? new Promise((y, _) => {
      const f = b.transaction(Y, "readonly").objectStore(Y).index("by_scope_seq").getAll(Et(this.keyRange, a));
      f.onsuccess = () => y(f.result || []), f.onerror = () => _(at(f, "Queue scope read failed"));
    }) : []);
  }
  enqueue(a, b) {
    return b = b || {}, this.open().then((y) => y ? new Promise((_, m) => {
      const f = y.transaction([nt, Y], "readwrite"), o = f.objectStore(nt), l = f.objectStore(Y), s = he(a);
      let d = null;
      const h = (g) => {
        const i = g + 1;
        d = {
          entryId: this.uuid(),
          scope: a,
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
        }, o.put({ key: s, value: i }), l.put(d);
      }, u = o.get(s);
      u.onerror = () => m(at(u, "Queue sequence read failed")), u.onsuccess = () => {
        const g = u.result;
        if (g && typeof g.value == "number") {
          h(g.value);
          return;
        }
        const i = l.index("by_scope_seq").getAll(Et(this.keyRange, a));
        i.onerror = () => m(at(i, "Queue sequence migration failed")), i.onsuccess = () => {
          const r = (i.result || []).reduce((t, e) => Math.max(t, e.seq || 0), 0);
          h(r);
        };
      }, f.oncomplete = () => _(d), f.onerror = () => m(f.error || new Error("Queue enqueue transaction failed")), f.onabort = () => m(f.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(a, b, y) {
    return this.open().then((_) => _ ? new Promise((m, f) => {
      const o = _.transaction(Y, "readwrite"), l = o.objectStore(Y), s = l.index("by_scope_seq").getAll(Et(this.keyRange, a)), d = this.now();
      let h = { entries: [], wakeups: [] };
      s.onerror = () => f(at(s, "Queue claim read failed")), s.onsuccess = () => {
        h = dn(s.result || [], b, y, d);
        for (const u of h.entries) l.put(u);
      }, o.oncomplete = () => m(h), o.onerror = () => f(o.error || new Error("Queue claim transaction failed")), o.onabort = () => f(o.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(a, b) {
    return this._updateEntry(a, b, (y, _) => (_.delete(y.entryId), { status: "acked", entry: y }));
  }
  nack(a, b, y, _) {
    _ = _ || {};
    const m = _.maxAttempts || 8, f = _.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((o) => o ? new Promise((l, s) => {
      const d = o.transaction([Y, nt], "readwrite"), h = d.objectStore(Y), u = d.objectStore(nt), g = h.get(b);
      let i = null;
      g.onerror = () => s(at(g, "Queue nack read failed")), g.onsuccess = () => {
        const r = g.result;
        if (!(!r || r.scope !== a)) {
          if (y === "drop") {
            h.delete(r.entryId), i = { status: "dropped", entry: r };
            return;
          }
          if (fe(r), r.updatedAt = this.now(), y === "auth") {
            r.status = "pending", h.put(r), u.put({ key: Mt(a), value: !0 }), i = { status: "auth", entry: r };
            return;
          }
          if (y === "retry") {
            if (r.attempts = (r.attempts || 0) + 1, r.attempts >= m) {
              r.status = "failed", r.nextAttemptAt = 0, h.put(r), i = { status: "failed", entry: r };
              return;
            }
            const t = f[Math.min(r.attempts - 1, f.length - 1)];
            r.status = "pending", r.nextAttemptAt = this.now() + t, h.put(r), i = { status: "retry", entry: r, delay: t };
          }
        }
      }, d.oncomplete = () => l(i), d.onerror = () => s(d.error || new Error("Queue nack transaction failed")), d.onabort = () => s(d.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(a, b, y) {
    return this._remapTransaction(a, null, b, y);
  }
  resolveCreate(a, b, y, _) {
    return this._remapTransaction(a, b, y, _);
  }
  _remapTransaction(a, b, y, _) {
    return this.open().then((m) => m ? new Promise((f, o) => {
      const l = m.transaction(Y, "readwrite"), s = l.objectStore(Y), d = s.index("by_scope_seq").getAll(Et(this.keyRange, a));
      let h = { changed: [], deleted: [] };
      d.onerror = () => o(at(d, "Queue remap read failed")), d.onsuccess = () => {
        h = un(d.result || [], b, y, _, this.now());
        for (const u of h.deleted) s.delete(u);
        for (const u of h.changed) s.put(u);
      }, l.oncomplete = () => f(h.changed), l.onerror = () => o(l.error || new Error("Queue remap transaction failed")), l.onabort = () => o(l.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(a) {
    return this.open().then((b) => b ? new Promise((y, _) => {
      const m = b.transaction(Y, "readwrite"), f = m.objectStore(Y), o = f.index("by_scope_seq").getAll(Et(this.keyRange, a));
      let l = 0;
      o.onerror = () => _(at(o, "Queue failed-entry read failed")), o.onsuccess = () => {
        for (const s of o.result || [])
          s.status === "failed" && (s.status = "pending", s.attempts = 0, s.nextAttemptAt = 0, s.updatedAt = this.now(), fe(s), f.put(s), l++);
      }, m.oncomplete = () => y(l), m.onerror = () => _(m.error || new Error("Queue failed-entry reset failed")), m.onabort = () => _(m.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(a) {
    return this.open().then((b) => b ? new Promise((y, _) => {
      const f = b.transaction(nt, "readonly").objectStore(nt).get(Mt(a));
      f.onsuccess = () => y(!!(f.result && f.result.value)), f.onerror = () => _(at(f, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(a, b) {
    return this.open().then((y) => {
      if (y)
        return new Promise((_, m) => {
          const f = y.transaction(nt, "readwrite");
          f.objectStore(nt).put({ key: Mt(a), value: !!b }), f.oncomplete = () => _(), f.onerror = () => m(f.error || new Error("Queue pause-state write failed")), f.onabort = () => m(f.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(a) {
    return this.open().then((b) => {
      if (b)
        return new Promise((y, _) => {
          const m = b.transaction([Y, nt], "readwrite"), o = m.objectStore(Y).index("by_scope_seq").openCursor(Et(this.keyRange, a));
          o.onsuccess = (l) => {
            const s = l.target.result;
            s && (s.delete(), s.continue());
          }, o.onerror = () => _(at(o, "Queue clear failed")), m.objectStore(nt).delete(he(a)), m.objectStore(nt).delete(Mt(a)), m.oncomplete = () => y(), m.onerror = () => _(m.error || new Error("Queue clear transaction failed")), m.onabort = () => _(m.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(a, b, y) {
    return this.open().then((_) => _ ? new Promise((m, f) => {
      const o = _.transaction(Y, "readwrite"), l = o.objectStore(Y), s = l.get(b);
      let d = null;
      s.onerror = () => f(at(s, "Queue entry read failed")), s.onsuccess = () => {
        const h = s.result;
        !h || h.scope !== a || (d = y(h, l));
      }, o.oncomplete = () => m(d), o.onerror = () => f(o.error || new Error("Queue entry transaction failed")), o.onabort = () => f(o.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const c = "data-ln-api-queue", a = "lnApiQueue", b = [2e3, 5e3, 15e3, 6e4, 3e5], y = 8, _ = 6e4;
  if (window[a] !== void 0) return;
  function m() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (d) => {
        const h = Math.random() * 16 | 0;
        return (d === "x" ? h : h & 3 | 8).toString(16);
      });
    }
  }
  const f = new hn({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: m
  });
  function o(s) {
    this.dom = s, s[a] = this;
    const d = s.closest("[data-ln-data-coordinator]");
    this.scope = s.id || (d ? d.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = m(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const h = this;
    return f.open().then((u) => u ? f.getPaused(h.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((u) => (h._paused = !!u, h._paused && L(h.dom, "ln-api-queue:paused", { reason: "auth", restored: !0 }), h._emitPendingCount())).then(() => h._drain()).catch((u) => {
      console.error("[ln-api-queue] Initialization failed:", u), L(h.dom, "ln-api-queue:error", { operation: "initialize", error: u });
    }), this;
  }
  o.prototype._isOnline = function() {
    const s = this.dom.getAttribute("data-ln-api-queue-online");
    return s === "true" ? !0 : s === "false" ? !1 : navigator.onLine;
  }, o.prototype._emitPendingCount = function() {
    const s = this;
    return f.allForScope(s.scope).then((d) => (L(s.dom, "ln-api-queue:pending-count", { count: d.length, scope: s.scope }), d.length === 0 && L(s.dom, "ln-api-queue:drained", { scope: s.scope }), d));
  }, o.prototype._clearTimer = function(s) {
    const d = this._timers.get(s);
    d && (clearTimeout(d), this._timers.delete(s));
  }, o.prototype._scheduleTimer = function(s, d) {
    const h = Math.max(0, d), u = this._timers.get(s);
    u && clearTimeout(u);
    const g = this, i = setTimeout(() => {
      g._timers.delete(s), g._drain();
    }, h);
    this._timers.set(s, i);
  }, o.prototype._drain = function() {
    const s = this;
    return s._paused || !s._isOnline() ? Promise.resolve() : (s._drainPromise || (s._drainPromise = f.claimReady(s.scope, s._workerId, _).then((d) => {
      for (const h of d.wakeups)
        s._scheduleTimer(h.chainKey, h.at - Date.now());
      for (const h of d.entries)
        s._clearTimer(h.chainKey), L(s.dom, "ln-api-queue:send", {
          entryId: h.entryId,
          chainKey: h.chainKey,
          op: h.op,
          targetId: h.targetId,
          payload: h.payload,
          expectedVersion: h.expectedVersion,
          idempotencyKey: h.entryId,
          meta: h.meta
        });
    }).catch((d) => {
      console.error("[ln-api-queue] Drain failed:", d), L(s.dom, "ln-api-queue:error", { operation: "drain", error: d });
    }).finally(() => {
      s._drainPromise = null;
    })), s._drainPromise);
  }, o.prototype._onEnqueue = function(s) {
    const d = this;
    return f.enqueue(d.scope, s.detail || {}).then((h) => {
      if (h)
        return d._emitPendingCount().then((u) => (L(d.dom, "ln-api-queue:enqueued", {
          entryId: h.entryId,
          chainKey: h.chainKey,
          count: u.length
        }), d._drain()));
    }).catch((h) => {
      L(d.dom, "ln-api-queue:error", { operation: "enqueue", error: h });
    });
  }, o.prototype._onAck = function(s) {
    const d = this, h = s.detail || {};
    return f.ack(d.scope, h.entryId).then(() => d._emitPendingCount()).then(() => d._drain()).catch((u) => {
      L(d.dom, "ln-api-queue:error", { operation: "ack", entryId: h.entryId, error: u });
    });
  }, o.prototype._onNack = function(s) {
    const d = this, h = s.detail || {};
    return f.nack(d.scope, h.entryId, h.reason, {
      maxAttempts: y,
      backoff: b
    }).then((u) => {
      if (u)
        return u.status === "failed" ? L(d.dom, "ln-api-queue:failed", {
          entryId: u.entry.entryId,
          chainKey: u.entry.chainKey,
          attempts: u.entry.attempts
        }) : u.status === "retry" ? d._scheduleTimer(u.entry.chainKey, u.delay) : u.status === "auth" && (d._paused = !0, L(d.dom, "ln-api-queue:paused", { reason: "auth" }), L(d.dom, "ln-api-queue:auth-required", {
          entryId: u.entry.entryId,
          chainKey: u.entry.chainKey
        })), d._emitPendingCount().then(() => {
          if (u.status === "dropped") return d._drain();
        });
    }).catch((u) => {
      L(d.dom, "ln-api-queue:error", { operation: "nack", entryId: h.entryId, error: u });
    });
  }, o.prototype._onRemap = function(s) {
    const d = this, h = s.detail || {};
    return f.remap(d.scope, h.oldKey, h.newId).catch((u) => {
      L(d.dom, "ln-api-queue:error", { operation: "remap", error: u });
    });
  }, o.prototype._onResolveCreate = function(s) {
    const d = this, h = s.detail || {};
    return f.resolveCreate(d.scope, h.entryId, h.oldKey, h.newId).then(() => d._emitPendingCount()).then(() => d._drain()).catch((u) => {
      L(d.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: h.entryId,
        error: u
      });
    });
  }, o.prototype._onResume = function() {
    const s = this;
    return f.setPaused(s.scope, !1).then(() => (s._paused = !1, L(s.dom, "ln-api-queue:resumed", {}), s._drain())).catch((d) => {
      L(s.dom, "ln-api-queue:error", { operation: "resume", error: d });
    });
  }, o.prototype._onDrain = function() {
    const s = this;
    return f.resetFailed(s.scope).then(() => {
      const d = s._drainPromise;
      return d ? d.then(() => s._drain()) : s._drain();
    }).catch((d) => {
      L(s.dom, "ln-api-queue:error", { operation: "manual-drain", error: d });
    });
  }, o.prototype._onClear = function() {
    const s = this;
    return s._timers.forEach((d) => clearTimeout(d)), s._timers.clear(), f.clear(s.scope).then(() => {
      s._paused = !1, L(s.dom, "ln-api-queue:pending-count", { count: 0, scope: s.scope }), L(s.dom, "ln-api-queue:drained", { scope: s.scope });
    }).catch((d) => {
      L(s.dom, "ln-api-queue:error", { operation: "clear", error: d });
    });
  }, o.prototype._bindEvents = function() {
    const s = this;
    s._handlers = {
      enqueue: (d) => s._onEnqueue(d),
      ack: (d) => s._onAck(d),
      nack: (d) => s._onNack(d),
      remap: (d) => s._onRemap(d),
      resolveCreate: (d) => s._onResolveCreate(d),
      resume: () => s._onResume(),
      drain: () => s._onDrain(),
      clear: () => s._onClear()
    }, s.dom.addEventListener("ln-api-queue:request-enqueue", s._handlers.enqueue), s.dom.addEventListener("ln-api-queue:ack", s._handlers.ack), s.dom.addEventListener("ln-api-queue:nack", s._handlers.nack), s.dom.addEventListener("ln-api-queue:request-remap", s._handlers.remap), s.dom.addEventListener("ln-api-queue:resolve-create", s._handlers.resolveCreate), s.dom.addEventListener("ln-api-queue:request-resume", s._handlers.resume), s.dom.addEventListener("ln-api-queue:request-drain", s._handlers.drain), s.dom.addEventListener("ln-api-queue:request-clear", s._handlers.clear);
  }, o.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const s = this;
    s.dom.removeEventListener("ln-api-queue:request-enqueue", s._handlers.enqueue), s.dom.removeEventListener("ln-api-queue:ack", s._handlers.ack), s.dom.removeEventListener("ln-api-queue:nack", s._handlers.nack), s.dom.removeEventListener("ln-api-queue:request-remap", s._handlers.remap), s.dom.removeEventListener("ln-api-queue:resolve-create", s._handlers.resolveCreate), s.dom.removeEventListener("ln-api-queue:request-resume", s._handlers.resume), s.dom.removeEventListener("ln-api-queue:request-drain", s._handlers.drain), s.dom.removeEventListener("ln-api-queue:request-clear", s._handlers.clear), window.removeEventListener("online", s._onlineHandler), s._timers.forEach((d) => clearTimeout(d)), s._timers.clear(), L(s.dom, "ln-api-queue:destroyed", { scope: s.scope }), delete s.dom[a];
  };
  function l(s) {
    const d = s[a];
    d && d._drain();
  }
  z(c, a, o, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: l
  });
})();
function Fe(c) {
  if (c == null || c === "") return null;
  const a = Number(c);
  return Number.isFinite(a) ? a : null;
}
function At(c) {
  return String(Math.round(c * 1e3) / 1e3);
}
function fn(c, a, b) {
  const y = Fe(c);
  return y === null || y < 0 ? 0 : Math.min(y, Math.min(a, b) / 2);
}
function pn(c) {
  if (typeof c != "string") return null;
  const a = c.trim().split(/[\s,]+/).map(Number);
  return a.length !== 4 || a.some((b) => !Number.isFinite(b)) || a[2] <= 0 || a[3] <= 0 ? null : { x: a[0], y: a[1], width: a[2], height: a[3] };
}
function mn(c, a) {
  a = a || {};
  const b = a.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, y = a.xField || "label", _ = a.yField || "value", m = a.includeZero !== !1, f = fn(a.padding, b.width, b.height), o = Array.isArray(c) ? c : [], l = [];
  for (let x = 0; x < o.length; x++) {
    const I = o[x] || {}, k = Fe(I[_]);
    k !== null && l.push({
      record: I,
      sourceIndex: x,
      label: I[y] == null ? String(x + 1) : String(I[y]),
      value: k
    });
  }
  if (l.length === 0)
    return {
      points: [],
      linePoints: "",
      areaPoints: "",
      count: 0,
      min: null,
      max: null,
      domainMin: 0,
      domainMax: 1,
      baselineY: b.y + b.height - f
    };
  const s = l.map((x) => x.value), d = Math.min(...s), h = Math.max(...s);
  let u = m ? Math.min(0, d) : d, g = m ? Math.max(0, h) : h;
  if (u === g)
    if (u === 0)
      g = 1;
    else {
      const x = Math.max(Math.abs(u) * 0.1, 1);
      u -= x, g += x;
    }
  const i = b.x + f, r = b.y + f, t = Math.max(0, b.width - f * 2), e = Math.max(0, b.height - f * 2), n = l.length > 1 ? t / (l.length - 1) : 0, p = g - u, v = (x) => r + (g - x) / p * e, E = l.map((x, I) => ({
    ...x,
    x: l.length === 1 ? i + t / 2 : i + I * n,
    y: v(x.value)
  })), w = u <= 0 && g >= 0 ? 0 : u, A = v(w), S = E.map((x) => At(x.x) + "," + At(x.y)).join(" "), T = [
    At(E[0].x) + "," + At(A),
    S,
    At(E[E.length - 1].x) + "," + At(A)
  ].join(" ");
  return {
    points: E,
    linePoints: S,
    areaPoints: T,
    count: E.length,
    min: d,
    max: h,
    domainMin: u,
    domainMax: g,
    baselineY: A
  };
}
(function() {
  const c = "data-ln-chart", a = "lnChart", b = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[a] !== void 0) return;
  function y(o) {
    if (!o) return null;
    const l = o.split(":"), s = l[0].trim();
    return s ? {
      field: s,
      direction: l[1] && l[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
    } : null;
  }
  function _(o, l) {
    if (o == null || !Number.isFinite(o)) return "";
    try {
      return new Intl.NumberFormat($(l)).format(o);
    } catch {
      return String(o);
    }
  }
  function m(o, l) {
    o && (o.textContent = l);
  }
  function f(o) {
    this.dom = o, this.name = o.getAttribute(c) || "", this.source = o.getAttribute("data-ln-chart-source") || this.name, this.plot = o.querySelector("[data-ln-chart-plot]"), this.line = o.querySelector("[data-ln-chart-line]"), this.area = o.querySelector("[data-ln-chart-area]"), this.labels = o.querySelector("[data-ln-chart-labels]"), this.empty = o.querySelector("[data-ln-chart-empty]"), this.minimum = o.querySelector("[data-ln-chart-min]"), this.maximum = o.querySelector("[data-ln-chart-max]"), this.count = o.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const l = this;
    return this._onSetData = function(s) {
      const d = s.detail || {};
      l._data = Array.isArray(d.data) ? d.data : [], l.isLoaded = !0, l._setLoading(!1), l._render();
    }, this._onSetLoading = function(s) {
      l._setLoading(!!(s.detail && s.detail.loading));
    }, this._onRefresh = function() {
      l.requestData();
    }, o.addEventListener("ln-chart:set-data", this._onSetData), o.addEventListener("ln-chart:set-loading", this._onSetLoading), o.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  f.prototype._readOptions = function() {
    const o = this.dom.getAttribute("data-ln-chart-padding"), l = o === null ? NaN : Number(o), s = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(l) && l >= 0 ? l : 16,
      type: s === "area" || s === "polygon" ? "area" : "line",
      viewBox: this.plot && pn(this.plot.getAttribute("viewBox")) || b
    };
  }, f.prototype._setLoading = function(o) {
    this.dom.classList.toggle("ln-chart--loading", o), this.dom.setAttribute("aria-busy", o ? "true" : "false");
  }, f.prototype._renderLabels = function(o) {
    if (!this.labels || (this.labels.replaceChildren(), o.count === 0)) return;
    const l = this.name + "-label", s = '[data-ln-template="' + l + '"]';
    if (!this.dom.querySelector(s) && !document.querySelector(s)) return;
    const d = _t(this.dom, l, "ln-chart");
    if (d)
      for (const h of o.points) {
        const u = d.cloneNode(!0);
        Rt(u, {
          label: h.label,
          value: _(h.value, this.dom)
        }), this.labels.appendChild(u);
      }
  }, f.prototype._render = function() {
    const o = this._readOptions(), l = mn(this._data, o);
    this.model = l, this.line && (this.line.setAttribute("points", l.linePoints), this.line.toggleAttribute("hidden", l.count === 0)), this.area && (this.area.setAttribute("points", l.areaPoints), this.area.toggleAttribute("hidden", l.count === 0 || o.type !== "area"));
    const s = l.count === 0;
    this.dom.classList.toggle("ln-chart--empty", s), this.empty && this.empty.toggleAttribute("hidden", !s), m(this.minimum, _(l.min, this.dom)), m(this.maximum, _(l.max, this.dom)), m(this.count, _(l.count, this.dom)), this._renderLabels(l), L(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: l.count,
      min: l.min,
      max: l.max
    });
  }, f.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, L(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: y(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, f.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[a]);
  }, z(c, a, f, "ln-chart", {
    extraAttributes: [
      "data-ln-chart-source",
      "data-ln-chart-x",
      "data-ln-chart-y",
      "data-ln-chart-type",
      "data-ln-chart-padding",
      "data-ln-chart-zero",
      "data-ln-chart-sort"
    ],
    onAttributeChange: function(o, l) {
      const s = o[a];
      if (s) {
        if (l === "data-ln-chart-source" || l === "data-ln-chart-sort") {
          s.requestData();
          return;
        }
        s._render();
      }
    }
  });
})();
(function() {
  const c = "data-ln-options", a = "lnOptions";
  if (window[a] !== void 0) return;
  function b(y) {
    this.dom = y, this._storeName = y.getAttribute(c), this._valueField = y.getAttribute("data-ln-options-value") || "id", this._labelField = y.getAttribute("data-ln-options-label") || "name";
    const _ = this;
    return this._onSetData = function(m) {
      _._rebuild(m.detail.data || []);
    }, y.addEventListener("ln-options:set-data", this._onSetData), L(y, "ln-options:request-data", { options: this._storeName }), this;
  }
  b.prototype._rebuild = function(y) {
    const _ = this.dom, m = this._valueField, f = this._labelField, o = _.value, l = _.querySelectorAll("option");
    for (let d = l.length - 1; d >= 0; d--)
      l[d].value !== "" && _.removeChild(l[d]);
    for (let d = 0; d < y.length; d++) {
      const h = y[d], u = document.createElement("option");
      u.value = String(h[m]), u.textContent = h[f] != null ? h[f] : "", _.appendChild(u);
    }
    const s = _.options;
    for (let d = 0; d < s.length; d++)
      if (s[d].value === o) {
        _.value = o;
        break;
      }
  }, b.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[a]);
  }, z(c, a, b, "ln-options");
})();
(function() {
  const c = "data-ln-stat", a = "lnStat";
  if (window[a] !== void 0) return;
  function b(_) {
    if (!_) return null;
    const m = _.indexOf(":");
    if (m === -1) return null;
    const f = _.slice(0, m), o = _.slice(m + 1), l = {};
    return l[f] = [o], l;
  }
  function y(_) {
    return this.dom = _, this._storeName = _.getAttribute(c), this._filters = b(_.getAttribute("data-ln-stat-filter")), this._onSetCount = function(m) {
      _.textContent = String(m.detail.count), _.classList.remove("is-loading");
    }, _.addEventListener("ln-stat:set-count", this._onSetCount), L(_, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  y.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[a]);
  }, z(c, a, y, "ln-stat");
})();
(function() {
  const c = "ln-icon-sprite", a = "#ln-icon-", b = "#ln-icon-custom-", y = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set();
  let m = null;
  const f = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), o = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), l = "lni:", s = "lni:v", d = "1";
  function h() {
    try {
      if (localStorage.getItem(s) !== d) {
        for (let n = localStorage.length - 1; n >= 0; n--) {
          const p = localStorage.key(n);
          p && p.indexOf(l) === 0 && localStorage.removeItem(p);
        }
        localStorage.setItem(s, d);
      }
    } catch {
    }
  }
  h();
  function u() {
    return m || (m = document.getElementById(c), m || (m = document.createElementNS("http://www.w3.org/2000/svg", "svg"), m.id = c, m.setAttribute("hidden", ""), m.setAttribute("aria-hidden", "true"), m.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(m, document.body.firstChild))), m;
  }
  function g(n) {
    return n.indexOf(b) === 0 ? o + "/" + n.slice(b.length) + ".svg" : f + "/" + n.slice(a.length) + ".svg";
  }
  function i(n, p) {
    const v = p.match(/viewBox="([^"]+)"/), E = v ? v[1] : "0 0 24 24", w = p.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), A = w ? w[1].trim() : "", S = p.match(/<svg([^>]*)>/i), T = S ? S[1] : "", x = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    x.id = n, x.setAttribute("viewBox", E), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(I) {
      const k = T.match(new RegExp(I + '="([^"]*)"'));
      k && x.setAttribute(I, k[1]);
    }), x.innerHTML = A, u().querySelector("defs").appendChild(x);
  }
  function r(n) {
    if (y.has(n) || _.has(n)) return;
    if (n.indexOf(b) === 0 && !o) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", n);
      return;
    }
    const p = n.slice(1);
    try {
      const E = localStorage.getItem(l + p);
      if (E) {
        i(p, E), y.add(n);
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
      i(p, E), y.add(n), _.delete(n);
      try {
        localStorage.setItem(l + p, E);
      } catch {
      }
    }).catch(function(E) {
      console.error("[ln-icon] Fetch failed for:", p, E), _.delete(n);
    });
  }
  function t(n) {
    const p = 'use[href^="' + a + '"], use[href^="' + b + '"]', v = n.querySelectorAll ? n.querySelectorAll(p) : [];
    if (n.matches && n.matches(p)) {
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
      n.forEach(function(p) {
        if (p.type === "childList")
          p.addedNodes.forEach(function(v) {
            v.nodeType === 1 && t(v);
          });
        else if (p.type === "attributes" && p.attributeName === "href") {
          const v = p.target.getAttribute("href");
          v && (v.indexOf(a) === 0 || v.indexOf(b) === 0) && r(v);
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
  const c = "data-ln-debug", a = "lnDebug";
  if (window[a] !== void 0) return;
  function b(y) {
    return this.dom = y, this;
  }
  b.prototype.destroy = function() {
    delete this.dom[a];
  }, z(c, a, b, "ln-debug");
})();
