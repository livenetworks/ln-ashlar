if (typeof window < "u") {
  const l = console.warn;
  console.warn = function(...a) {
    typeof a[0] == "string" && (a[0].startsWith("[ln-") || a[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || l.apply(console, a);
  };
}
const Mt = {};
function Tt(l, a) {
  Mt[l] || (Mt[l] = document.querySelector('[data-ln-template="' + l + '"]'));
  const b = Mt[l];
  return b ? b.content.cloneNode(!0) : (console.warn("[" + (a || "ln-core") + '] Template "' + l + '" not found'), null);
}
function L(l, a, b) {
  l.dispatchEvent(new CustomEvent(a, {
    bubbles: !0,
    detail: b || {}
  }));
}
function G(l, a, b) {
  const v = new CustomEvent(a, {
    bubbles: !0,
    cancelable: !0,
    detail: b || {}
  });
  return l.dispatchEvent(v), v;
}
function de(l, a, b) {
  l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), l._updateFooter();
  const v = {
    sort: l.currentSort,
    filters: l.currentFilters,
    search: l.currentSearch
  };
  v[b] = l.name, L(l.dom, a, v);
}
function et(l, a) {
  if (!l || !a) return l;
  const b = l.querySelectorAll("[data-ln-field]");
  for (let u = 0; u < b.length; u++) {
    const o = b[u], c = o.getAttribute("data-ln-field");
    a[c] != null && (o.textContent = a[c]);
  }
  const v = l.querySelectorAll("[data-ln-attr]");
  for (let u = 0; u < v.length; u++) {
    const o = v[u], c = o.getAttribute("data-ln-attr").split(",");
    for (let r = 0; r < c.length; r++) {
      const f = c[r].trim().split(":");
      if (f.length !== 2) continue;
      const p = f[0].trim(), m = f[1].trim();
      a[m] != null && o.setAttribute(p, a[m]);
    }
  }
  const _ = l.querySelectorAll("[data-ln-show]");
  for (let u = 0; u < _.length; u++) {
    const o = _[u], c = o.getAttribute("data-ln-show");
    c in a && o.classList.toggle("hidden", !a[c]);
  }
  const h = l.querySelectorAll("[data-ln-class]");
  for (let u = 0; u < h.length; u++) {
    const o = h[u], c = o.getAttribute("data-ln-class").split(",");
    for (let r = 0; r < c.length; r++) {
      const f = c[r].trim().split(":");
      if (f.length !== 2) continue;
      const p = f[0].trim(), m = f[1].trim();
      m in a && o.classList.toggle(p, !!a[m]);
    }
  }
  return l;
}
function Be(l, a) {
  l.matches && l.matches("[data-ln-form], [data-ln-fillable]") && l.dispatchEvent(new CustomEvent("ln-fill", { detail: a ?? null, bubbles: !0 }));
  const b = l.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let v = 0; v < b.length; v++)
    b[v].dispatchEvent(new CustomEvent("ln-fill", { detail: a ?? null, bubbles: !0 }));
  return l;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(l) {
  if (!(!l.target.matches || !l.target.matches("[data-ln-fillable]")))
    if (l.detail)
      et(l.target, l.detail);
    else {
      const a = l.target.querySelectorAll("[data-ln-field]");
      for (let b = 0; b < a.length; b++)
        a[b].textContent = "";
    }
})));
function At(l, a) {
  if (!l || !a) return l;
  const b = document.createTreeWalker(l, NodeFilter.SHOW_TEXT);
  for (; b.nextNode(); ) {
    const h = b.currentNode;
    h.textContent.indexOf("{{") !== -1 && (h.textContent = h.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(u, o) {
        return a[o] !== void 0 ? a[o] : "";
      }
    ));
  }
  const v = function(h, u) {
    return a[u] !== void 0 ? a[u] : "";
  }, _ = Array.from(l.querySelectorAll("*"));
  l.nodeType === 1 && _.push(l);
  for (let h = 0; h < _.length; h++) {
    const u = _[h], o = u.attributes;
    for (let c = 0; c < o.length; c++) {
      const r = o[c];
      r.value.indexOf("{{") !== -1 && u.setAttribute(r.name, r.value.replace(/\{\{\s*(\w+)\s*\}\}/g, v));
    }
  }
  return l;
}
function Ue(l, a, b, v, _, h) {
  const u = {};
  for (let c = 0; c < l.children.length; c++) {
    const r = l.children[c], f = r.getAttribute("data-ln-key");
    f && (u[f] = r);
  }
  const o = document.createDocumentFragment();
  for (let c = 0; c < a.length; c++) {
    const r = a[c], f = String(v(r));
    let p = u[f];
    if (p)
      _(p, r, c);
    else {
      const m = Tt(b, h);
      if (!m || (At(m, r), p = m.firstElementChild, !p)) continue;
      p.setAttribute("data-ln-key", f), _(p, r, c);
    }
    o.appendChild(p);
  }
  l.textContent = "", l.appendChild(o);
}
function lt(l, a) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      lt(l, a);
    }), console.warn("[" + a + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  l();
}
function ct(l, a, b) {
  if (l) {
    const v = l.querySelector('[data-ln-template="' + a + '"]');
    if (v) return v.content.cloneNode(!0);
  }
  return Tt(a, b);
}
function kt(l, a) {
  const b = {}, v = l.querySelectorAll("[" + a + "]");
  for (let _ = 0; _ < v.length; _++)
    b[v[_].getAttribute(a)] = v[_].textContent, v[_].remove();
  return b;
}
function Ft(l, a, b, v) {
  if (l.nodeType !== 1) return;
  const h = a.indexOf("[") !== -1 || a.indexOf(".") !== -1 || a.indexOf("#") !== -1 ? a : "[" + a + "]", u = Array.from(l.querySelectorAll(h));
  l.matches && l.matches(h) && u.push(l);
  for (const o of u)
    o[b] || (o[b] = new v(o));
}
function Lt(l) {
  return !!(l.offsetWidth || l.offsetHeight || l.getClientRects().length);
}
function ze(l) {
  const a = l.querySelector('input[name="_method"]');
  return ((a && a.value !== "" ? a.value : l.method) || "").toUpperCase();
}
function ue(l, a) {
  const b = !!(a && a.typed), v = a && a.exclude, _ = {}, h = l.elements, u = {};
  if (b)
    for (let o = 0; o < h.length; o++) {
      const c = h[o];
      c.name && c.type === "checkbox" && !c.disabled && (u[c.name] = (u[c.name] || 0) + 1);
    }
  for (let o = 0; o < h.length; o++) {
    const c = h[o];
    if (!(!c.name || c.disabled || c.type === "file" || c.type === "submit" || c.type === "button") && !(v && c.matches && c.matches(v)))
      if (c.type === "checkbox")
        b && u[c.name] === 1 ? _[c.name] = c.checked : (_[c.name] || (_[c.name] = []), c.checked && _[c.name].push(c.value));
      else if (c.type === "radio")
        c.checked && (_[c.name] = c.value);
      else if (c.type === "select-multiple") {
        _[c.name] = [];
        for (let r = 0; r < c.options.length; r++)
          c.options[r].selected && _[c.name].push(c.options[r].value);
      } else if (b && c.type === "hidden")
        _[c.name] = c.value;
      else if (b && (c.type === "number" || c.type === "range")) {
        const r = Number(c.value);
        _[c.name] = c.value === "" || isNaN(r) ? null : r;
      } else
        _[c.name] = c.value;
  }
  return _;
}
function Ke(l) {
  if (typeof l != "string") return !!l;
  const a = l.trim().toLowerCase();
  return a !== "false" && a !== "0" && a !== "" && a !== "off" && a !== "no";
}
function he(l, a) {
  const b = l.elements, v = [], _ = {};
  for (let h = 0; h < b.length; h++) {
    const u = b[h];
    u.name && u.type === "checkbox" && (_[u.name] = (_[u.name] || 0) + 1);
  }
  for (let h = 0; h < b.length; h++) {
    const u = b[h];
    if (u.type === "file" || u.type === "submit" || u.type === "button") continue;
    const o = u.getAttribute("data-ln-fill-as") || u.name;
    if (!o || !(o in a)) continue;
    const c = a[o];
    if (u.type === "checkbox") {
      if (Array.isArray(c))
        u.checked = c.indexOf(u.value) !== -1;
      else if (_[u.name] > 1) {
        const r = String(c).split(",").map(function(f) {
          return f.trim();
        });
        u.checked = r.indexOf(u.value) !== -1;
      } else
        u.checked = Ke(c);
      v.push(u);
    } else if (u.type === "radio")
      u.checked = u.value === String(c), v.push(u);
    else if (u.type === "select-multiple") {
      if (Array.isArray(c))
        for (let r = 0; r < u.options.length; r++)
          u.options[r].selected = c.indexOf(u.options[r].value) !== -1;
      v.push(u);
    } else
      u.value = c, v.push(u);
  }
  return v;
}
const ee = {
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
function W(l) {
  const a = l ? l.closest("[lang]") : null, b = (a ? a.getAttribute("lang") || a.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!b) return "en-US";
  const v = b.trim().toLowerCase();
  return v.indexOf("-") === -1 && ee[v] ? ee[v] : b;
}
function _t(l) {
  return l.hasAttribute("data-ln-value") ? l.getAttribute("data-ln-value") : l.textContent.trim();
}
function yt(l) {
  let a = !1;
  for (let b = 0; b < l.length; b++) {
    const v = l[b];
    if (!(v === "" || v == null) && (a = !0, !Number.isFinite(Number(v))))
      return "string";
  }
  return a ? "number" : "string";
}
function vt(l, a, b, v) {
  if (b === "number") {
    const u = parseFloat(l), o = parseFloat(a);
    return (isNaN(u) ? 0 : u) - (isNaN(o) ? 0 : o);
  }
  const _ = l != null ? String(l) : "", h = a != null ? String(a) : "";
  return v ? v.compare(_, h) : _ < h ? -1 : _ > h ? 1 : 0;
}
function fe(l, a, { get: b, set: v }) {
  Object.defineProperty(l, "value", {
    get: function() {
      return b ? b.call(this) : a.get.call(this);
    },
    set: function(_) {
      v ? v.call(this, _, (h) => a.set.call(this, h)) : a.set.call(this, _);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function je() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function Nt() {
  if (typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1), window.lnCore._bootHolds === 0 && window.lnCore._bootQueue)) {
    const l = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let a = 0; a < l.length; a++)
      l[a]();
  }
}
function Ve() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function nt(l) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(l) : setTimeout(l, 0)) : l();
}
function B(l, a, b, v, _ = {}) {
  const h = _.extraAttributes || [], u = _.onAttributeChange || null, o = _.onInit || null;
  function c(f) {
    const p = f || document.body;
    Ft(p, l, a, b), o && o(p);
  }
  lt(function() {
    const f = new MutationObserver(function(m) {
      for (let y = 0; y < m.length; y++) {
        const i = m[y];
        if (i.type === "childList") {
          for (let s = 0; s < i.addedNodes.length; s++) {
            const t = i.addedNodes[s];
            t.nodeType === 1 && (Ft(t, l, a, b), o && o(t));
          }
          for (let s = 0; s < i.removedNodes.length; s++) {
            const t = i.removedNodes[s];
            if (t.nodeType === 1) {
              const n = l.indexOf("[") !== -1 || l.indexOf(".") !== -1 || l.indexOf("#") !== -1 ? l : "[" + l + "]", d = Array.from(t.querySelectorAll(n));
              t.matches && t.matches(n) && d.push(t);
              for (let g = 0; g < d.length; g++) {
                const E = d[g];
                if (!document.contains(E)) {
                  const w = E[a];
                  w && typeof w.destroy == "function" && w.destroy();
                }
              }
            }
          }
        } else i.type === "attributes" && (u && i.target[a] ? u(i.target, i.attributeName) : (Ft(i.target, l, a, b), o && o(i.target)));
      }
    });
    let p = [];
    if (l.indexOf("[") !== -1) {
      const m = /\[([\w-]+)/g;
      let y;
      for (; (y = m.exec(l)) !== null; )
        p.push(y[1]);
    } else
      p.push(l);
    f.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: p.concat(h)
    });
  }, v || (l.indexOf("[") === -1 ? l.replace("data-", "") : "component")), window[a] = c;
  function r() {
    Ve() > 0 ? nt(function() {
      c(document.body);
    }) : c(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r(), c;
}
function pe(l, a) {
  if (l.ctrlKey || l.metaKey || l.shiftKey || l.altKey || l.button !== 0 || !a) return !1;
  const b = a.getAttribute("href");
  return !(!b || a.getAttribute("target") === "_blank" || a.hasAttribute("download") || b.startsWith("mailto:") || b.startsWith("tel:") || b === "#" || b.startsWith("#") || a.hostname && a.hostname !== window.location.hostname);
}
function st(...l) {
  return l.filter((a) => a != null && a !== "").map((a, b) => b === 0 ? a.replace(/\/+$/, "") : a.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function bt(l, a) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, l, a ? { Authorization: a } : null);
}
function me(l, a = "ln-core") {
  try {
    return l ? JSON.parse(l) : {};
  } catch (b) {
    return console.error(`[${a}] Invalid headers JSON:`, b), {};
  }
}
const ge = {};
function We(l, a) {
  ge[l] = a;
}
function Ge(l) {
  return ge[l] || { ingress: (a) => a, egress: (a) => a };
}
const _e = {};
function Wt(l, a) {
  if (!l || typeof a != "object") return;
  const b = l.toLowerCase().split("-")[0];
  _e[b] = a;
}
function wt(l) {
  if (!l) return null;
  const a = l.toLowerCase().split("-")[0];
  return _e[a] || null;
}
Wt("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = We, window.lnCore.getDataMapper = Ge, window.lnCore.registerLocaleFallback = Wt, window.lnCore.getLocaleFallback = wt, window.lnCore.fillTemplate = At, window.lnCore.fill = et, window.lnCore.lnFill = Be, window.lnCore.renderList = Ue);
function Gt(l, a) {
  let b = !1;
  return function() {
    b || (b = !0, queueMicrotask(function() {
      b = !1, l();
    }));
  };
}
function be(l) {
  l = l || {};
  let a = l.windowSize > 0 ? l.windowSize : 1e3, b = l.pageSize > 0 ? l.pageSize : 200, v = l.threshold != null ? l.threshold : 25, _ = l.fetchDebounce != null ? l.fetchDebounce : 120;
  const h = typeof l.requestPage == "function" ? l.requestPage : function() {
  }, u = typeof l.onChange == "function" ? l.onChange : function() {
  }, o = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  let f = 0, p = 0, m = 0, y = { sort: null, filters: {}, search: "" }, i = null, s = 0, t = 0, e = !1;
  function n(w) {
    c.set(w, ++s);
  }
  function d() {
    return !!(y && (y.search || y.filters && Object.keys(y.filters).length));
  }
  function g() {
    if (o.size <= a) return;
    const w = Array.from(o.keys()).sort(function(S, q) {
      return (c.get(S) || 0) - (c.get(q) || 0);
    });
    let A = 0;
    for (; o.size > a && A < w.length; )
      o.delete(w[A]), c.delete(w[A]), A++;
  }
  function E(w, A) {
    r.add(w), h(y, w, A);
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
      return f;
    },
    get grandTotal() {
      return p;
    },
    get queryGen() {
      return m;
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
      if (f <= 0) return;
      const S = Math.max(0, w - v), q = Math.min(f, A + v), T = Math.floor(S / b), x = Math.floor(Math.max(0, q - 1) / b);
      let k = -1;
      for (let R = T; R <= x; R++) {
        const N = R * b, z = Math.min(b, f - N);
        let H = !1;
        const U = Math.max(N, S), K = Math.min(N + z, q);
        for (let it = U; it < K; it++)
          if (!o.has(it)) {
            H = !0;
            break;
          }
        if (H && !r.has(N)) {
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
      if (w = w || {}, w.queryGen != null && w.queryGen !== m) return;
      e && (o.clear(), c.clear(), e = !1), p = w.total != null ? w.total : p, f = w.filtered != null ? w.filtered : w.data ? w.data.length : f;
      const A = w.offset || 0, S = w.data || [];
      for (let q = 0; q < S.length; q++)
        S[q] != null && (o.set(A + q, S[q]), n(A + q));
      r.delete(A), g(), u();
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(w) {
      w && (y = w), E(0, b);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(w) {
      m++, r.clear(), clearTimeout(i), w && (y = w), e = !0, E(0, b);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      m++, r.clear(), clearTimeout(i), e = !0;
      const w = Math.max(0, Math.floor(t / b) * b);
      E(w, b);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(w) {
      r.delete(w);
    },
    destroy: function() {
      clearTimeout(i), o.clear(), c.clear(), r.clear();
    },
    configure: function(w) {
      w = w || {};
      let A = !1;
      if (w.windowSize != null && w.windowSize > 0 && w.windowSize !== a) {
        const S = w.windowSize < a;
        a = w.windowSize, S && g(), A = !0;
      }
      w.pageSize != null && w.pageSize > 0 && (b = w.pageSize), w.threshold != null && w.threshold >= 0 && (v = w.threshold), w.fetchDebounce != null && w.fetchDebounce >= 0 && (_ = w.fetchDebounce), A && u();
    },
    setGrandTotal: function(w) {
      w == null || isNaN(w) || w < 0 || (p = w, d() || (f = w), u());
    }
  };
}
const Qe = "ln:";
let pt = null;
function ye() {
  if (pt !== null) return pt;
  try {
    if (typeof localStorage > "u")
      return pt = !1, !1;
    const l = "__ln_test__";
    localStorage.setItem(l, l), localStorage.removeItem(l), pt = !0;
  } catch {
    pt = !1;
  }
  return pt;
}
function $e() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function ve(l, a) {
  const b = a.getAttribute("data-ln-persist"), v = b !== null && b !== "" ? b : a.id;
  return v ? Qe + l + ":" + $e() + ":" + v : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', a), null);
}
function It(l, a) {
  if (!ye()) return null;
  const b = ve(l, a);
  if (!b) return null;
  try {
    const v = localStorage.getItem(b);
    return v !== null ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}
function ht(l, a, b) {
  if (!ye()) return;
  const v = ve(l, a);
  if (v)
    try {
      b == null ? localStorage.removeItem(v) : localStorage.setItem(v, JSON.stringify(b));
    } catch {
    }
}
function we(l) {
  return (l || "").replace(/^#/, "");
}
function Dt(l) {
  const a = l === void 0 ? location.hash : l, b = {}, v = we(a);
  if (!v) return b;
  const _ = v.split("&");
  for (let h = 0; h < _.length; h++) {
    const u = _[h];
    if (!u) continue;
    const o = u.indexOf(":"), c = o > -1 ? u.slice(0, o) : u, r = o > -1 ? u.slice(o + 1) : "";
    if (c)
      try {
        b[c] = decodeURIComponent(r);
      } catch {
        b[c] = r;
      }
  }
  return b;
}
function X(l) {
  if (!l) return null;
  const a = Dt();
  return l in a ? a[l] : null;
}
function J(l, a) {
  if (!l) return;
  const b = Dt();
  a == null ? delete b[l] : b[l] = String(a);
  const _ = Object.keys(b).map(function(h) {
    const u = b[h];
    return u === "" ? h : h + ":" + encodeURIComponent(u);
  }).join("&");
  we(location.hash) !== _ && (location.hash = _);
}
function Qt(l) {
  return l.button === 1 || l.ctrlKey || l.metaKey || l.shiftKey ? !1 : (l.preventDefault(), !0);
}
function ft(l, a) {
  if (!l || !l.hasAttribute("data-ln-hash")) return null;
  const b = l.getAttribute("data-ln-hash");
  if (b && b.trim() !== "") return b.trim();
  const v = l.getAttribute("data-ln-sort") || l.getAttribute("data-ln-search-for") || l.getAttribute("data-ln-search") || l.getAttribute("data-ln-filter") || l.id;
  return v ? a ? v + "-" + a : v : a || null;
}
function Ee(l, a) {
  return !a || a === "none" || l === null || l === void 0 ? null : String(l) + "." + a;
}
function Ht(l) {
  return !l || typeof l != "string" ? null : l.endsWith(".asc") ? { fieldOrColumn: l.slice(0, -4), direction: "asc" } : l.endsWith(".desc") ? { fieldOrColumn: l.slice(0, -5), direction: "desc" } : null;
}
function Ae(l, a) {
  return !l || !Array.isArray(a) || a.length === 0 ? null : l + ":" + a.map(encodeURIComponent).join(",");
}
function Bt(l) {
  if (!l || typeof l != "string") return null;
  const a = l.indexOf(":");
  if (a === -1) return null;
  const b = l.slice(0, a), v = l.slice(a + 1), _ = v ? v.split(",").map(function(h) {
    try {
      return decodeURIComponent(h);
    } catch {
      return h;
    }
  }).filter(Boolean) : [];
  return { key: b, values: _ };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Dt, window.lnCore.hashGet = X, window.lnCore.hashSet = J, window.lnCore.hashLinkClick = Qt, window.lnCore.resolveHashNamespace = ft, window.lnCore.hashSortEncode = Ee, window.lnCore.hashSortDecode = Ht, window.lnCore.hashFilterEncode = Ae, window.lnCore.hashFilterDecode = Bt);
function qt(l, a, b, v) {
  const _ = typeof v == "number" ? v : 4, h = window.innerWidth, u = window.innerHeight, o = a.width, c = a.height, r = (b || "bottom").split("-"), f = r[0], p = r[1] === "start" || r[1] === "end" ? r[1] : "center", m = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, y = m[f] || m.bottom;
  function i(d) {
    return d === "top" || d === "bottom" ? p === "start" ? l.left : p === "end" ? l.right - o : l.left + (l.width - o) / 2 : p === "start" ? l.top : p === "end" ? l.bottom - c : l.top + (l.height - c) / 2;
  }
  function s(d) {
    let g, E, w = !0;
    return d === "top" ? (g = l.top - _ - c, E = i(d), g < 0 && (w = !1)) : d === "bottom" ? (g = l.bottom + _, E = i(d), g + c > u && (w = !1)) : d === "left" ? (g = i(d), E = l.left - _ - o, E < 0 && (w = !1)) : (g = i(d), E = l.right + _, E + o > h && (w = !1)), { top: g, left: E, side: d, fits: w };
  }
  let t = null;
  for (let d = 0; d < y.length; d++) {
    const g = s(y[d]);
    if (g.fits) {
      t = g;
      break;
    }
  }
  t || (t = s(y[0]));
  let e = t.top, n = t.left;
  return o >= h ? n = 0 : (n < 0 && (n = 0), n + o > h && (n = h - o)), c >= u ? e = 0 : (e < 0 && (e = 0), e + c > u && (e = u - c)), { top: e, left: n, placement: t.side };
}
function Ut(l) {
  if (!l) return { width: 0, height: 0 };
  const a = l.style, b = a.visibility, v = a.display, _ = a.position;
  a.visibility = "hidden", a.display = "block", a.position = "fixed";
  const h = l.offsetWidth, u = l.offsetHeight;
  return a.visibility = b, a.display = v, a.position = _, { width: h, height: u };
}
let at = null;
async function ne(l) {
  if (!l) {
    at = null;
    return;
  }
  try {
    const a = new TextEncoder(), b = await crypto.subtle.digest("SHA-256", a.encode(l));
    at = await crypto.subtle.importKey(
      "raw",
      b,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (a) {
    console.error("[ln-core/crypto] Key derivation failed:", a), at = null;
  }
}
function dt() {
  return at;
}
async function Xe(l, a = at) {
  const b = a || at;
  if (!b || l === void 0 || l === null) return l;
  try {
    const v = new TextEncoder(), _ = crypto.getRandomValues(new Uint8Array(12)), h = typeof l == "string" ? l : JSON.stringify(l), u = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: _ },
      b,
      v.encode(h)
    ), o = btoa(String.fromCharCode(..._)), c = btoa(String.fromCharCode(...new Uint8Array(u)));
    return {
      encrypted: !0,
      iv: o,
      data: c
    };
  } catch (v) {
    return console.error("[ln-core/crypto] Encryption failed:", v), l;
  }
}
async function Ye(l, a = at) {
  const b = a || at;
  if (!l || !l.encrypted || !b) return l;
  try {
    const v = new TextDecoder(), _ = Uint8Array.from(atob(l.iv), (c) => c.charCodeAt(0)), h = Uint8Array.from(atob(l.data), (c) => c.charCodeAt(0)), u = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: _ },
      b,
      h
    ), o = v.decode(u);
    try {
      return JSON.parse(o);
    } catch {
      return o;
    }
  } catch (v) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", v), { ...l, decryptionError: !0 };
  }
}
function Je(l) {
  if (typeof l == "string") return l;
  if (l && typeof l == "object") {
    if (typeof l.href == "string") return l.href;
    if (typeof l.url == "string") return l.url;
  }
  return String(l || "");
}
function Ze(l, a) {
  return a && a.method ? String(a.method).toUpperCase() : l && typeof l == "object" && l.method ? String(l.method).toUpperCase() : "GET";
}
function tn(l, a) {
  return (a || "GET") + " " + (l || "");
}
function en(l) {
  const a = (l || "").toUpperCase();
  return a === "GET" || a === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const l = window.fetch.bind(window), a = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
  function v(u, o) {
    o = o || {};
    const c = Je(u), r = Ze(u, o), f = tn(c, r);
    en(r) && a.has(f) && (a.get(f).abort(), a.delete(f));
    const p = new AbortController(), m = o.signal;
    let y = null;
    m && (m.aborted ? p.abort(m.reason) : (y = function() {
      p.abort(m.reason);
    }, m.addEventListener("abort", y, { once: !0 })));
    const i = Object.assign({}, o, { signal: p.signal });
    return a.set(f, p), l(u, i).finally(function() {
      m && y && m.removeEventListener("abort", y), a.get(f) === p && a.delete(f);
    });
  }
  v.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = v;
  function _(u) {
    if (!u.detail || !u.detail.url) return;
    const o = u.target, c = (u.detail.method || (u.detail.body ? "POST" : "GET")).toUpperCase(), r = u.detail.key;
    r && b.has(r) && (b.get(r).abort(), b.delete(r));
    const f = new AbortController(), p = u.detail.signal;
    let m = null;
    p && (p.aborted ? f.abort(p.reason) : (m = function() {
      f.abort(p.reason);
    }, p.addEventListener("abort", m, { once: !0 }))), r && b.set(r, f);
    const y = { method: c, signal: f.signal };
    u.detail.body !== void 0 && (y.body = u.detail.body), window.fetch(u.detail.url, y).then(function(i) {
      p && m && p.removeEventListener("abort", m), r && b.get(r) === f && b.delete(r), L(o, "ln-http:response", {
        ok: i.ok,
        status: i.status,
        response: i
      });
    }).catch(function(i) {
      p && m && p.removeEventListener("abort", m), r && b.get(r) === f && b.delete(r), !(i && i.name === "AbortError") && L(o, "ln-http:error", {
        ok: !1,
        status: 0,
        error: i
      });
    });
  }
  function h(u) {
    const o = u.detail || {};
    o.all ? window.lnHttp.cancelAll() : o.key ? window.lnHttp.cancelByKey(o.key) : o.url && window.lnHttp.cancel(o.url);
  }
  document.addEventListener("ln-http:request", _), document.addEventListener("ln-http:cancel", h), window.lnHttp = {
    cancel: function(u) {
      let o = !1;
      return a.forEach(function(c, r) {
        r.endsWith(" " + u) && (c.abort(), a.delete(r), o = !0);
      }), o;
    },
    cancelByKey: function(u) {
      return b.has(u) ? (b.get(u).abort(), b.delete(u), !0) : !1;
    },
    cancelAll: function() {
      a.forEach(function(u) {
        u.abort();
      }), a.clear(), b.forEach(function(u) {
        u.abort();
      }), b.clear();
    },
    get inflight() {
      const u = [];
      return a.forEach(function(o, c) {
        const r = c.indexOf(" ");
        u.push({ method: c.slice(0, r), url: c.slice(r + 1) });
      }), b.forEach(function(o, c) {
        u.push({ key: c });
      }), u;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", _), document.removeEventListener("ln-http:cancel", h), window.fetch = l, delete window.lnHttp;
    }
  };
})();
(function() {
  const l = "template[data-ln-include]", a = "lnInclude";
  if (window[a] !== void 0) return;
  const b = /* @__PURE__ */ new Map();
  function v(_) {
    if (this.dom = _, this.url = _.getAttribute("data-ln-include"), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    je(), this._held = !0;
    const h = this, u = this.url;
    let o = b.get(u);
    return o || (o = fetch(u).then(function(c) {
      if (!c.ok)
        throw new Error("HTTP error! status: " + c.status);
      return c.text();
    }).catch(function(c) {
      throw b.delete(u), c;
    }), b.set(u, o)), o.then(function(c) {
      if (h._destroyed) return;
      const r = document.createElement("template");
      r.innerHTML = c, h.dom.content.appendChild(r.content), L(h.dom, "ln-include:loaded", { target: h.dom, url: h.url }), h._held && (h._held = !1, Nt());
    }).catch(function(c) {
      h._destroyed || (console.error("[ln-include] Failed to fetch template from " + h.url + ":", c), L(h.dom, "ln-include:error", { target: h.dom, url: h.url, error: c }), h._held && (h._held = !1, Nt()));
    }), this;
  }
  v.prototype.destroy = function() {
    this.dom[a] && (this._destroyed = !0, this._held && (this._held = !1, Nt()), delete this.dom[a]);
  }, B(l, a, v, "ln-include");
})();
(function() {
  const l = "data-ln-form", a = "lnForm", b = "data-ln-form-action-edit", v = "data-ln-form-action-method";
  if (window[a] !== void 0) return;
  function _(h) {
    this.dom = h, this._baseAction = h.getAttribute("action") || "";
    const u = this;
    return this._onLnFill = function(o) {
      o.target === u.dom && (o.detail ? (u.fill(o.detail), u._applyActionMode(o.detail)) : u.dom.reset());
    }, this._onReset = function() {
      u._applyActionMode(null);
    }, h.addEventListener("ln-fill", this._onLnFill), h.addEventListener("reset", this._onReset), this;
  }
  _.prototype.fill = function(h) {
    const u = he(this.dom, h);
    for (let o = 0; o < u.length; o++) {
      const c = u[o], r = c.tagName === "SELECT" || c.type === "checkbox" || c.type === "radio";
      c.dispatchEvent(new Event(r ? "change" : "input", { bubbles: !0 }));
    }
  }, _.prototype._ensureMethodInput = function() {
    let h = this.dom.querySelector('input[name="_method"]');
    return h || (h = document.createElement("input"), h.type = "hidden", h.name = "_method", h.value = "", this.dom.appendChild(h)), h;
  }, _.prototype._applyActionMode = function(h) {
    if (!this.dom.hasAttribute(b)) return;
    const u = h && h.id != null && h.id !== "" ? h.id : null, o = this._ensureMethodInput();
    if (u !== null) {
      const c = this.dom.getAttribute(b);
      c ? this.dom.setAttribute("action", c.replace(":id", encodeURIComponent(u))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(u)), o.value = this.dom.getAttribute(v) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), o.value = "";
  }, _.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), L(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[a]);
  }, B(l, a, _, "ln-form");
})();
(function() {
  const l = "data-ln-validate", a = "lnValidate", b = "data-ln-validate-errors", v = "data-ln-validate-error", _ = "ln-validate-valid", h = "ln-validate-invalid", u = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[a] !== void 0) return;
  function o(c) {
    this.dom = c, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const r = this, f = c.tagName, p = c.type, m = f === "SELECT" || p === "checkbox" || p === "radio";
    this._onInput = function() {
      r._touched = !0, r.validate();
    }, this._onChange = function() {
      r._touched = !0, r.validate();
    }, this._onSetCustom = function(i) {
      const s = i.detail && i.detail.error;
      if (!s) return;
      r._customErrors.add(s), r._touched = !0;
      const t = c.closest(".form-element");
      if (t) {
        const e = t.querySelector("[" + v + '="' + s + '"]');
        e && e.classList.remove("hidden");
      }
      c.classList.remove(_), c.classList.add(h), c.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(i) {
      const s = i.detail && i.detail.error, t = c.closest(".form-element");
      if (s) {
        if (r._customErrors.delete(s), t) {
          const e = t.querySelector("[" + v + '="' + s + '"]');
          e && e.classList.add("hidden");
        }
      } else
        r._customErrors.forEach(function(e) {
          if (t) {
            const n = t.querySelector("[" + v + '="' + e + '"]');
            n && n.classList.add("hidden");
          }
        }), r._customErrors.clear();
      r._touched && r.validate();
    }, m || c.addEventListener("input", this._onInput), c.addEventListener("change", this._onChange), c.addEventListener("ln-validate:set-custom", this._onSetCustom), c.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const y = c.form;
    return y && (y.hasAttribute("novalidate") || y.setAttribute("novalidate", ""), this._onFormReset = function() {
      r.reset();
    }, this._onValidateRequest = function(i) {
      r._touched = !0, !r.validate() && i.detail && i.detail.invalidFields && i.detail.invalidFields.push(r.dom);
    }, y.addEventListener("reset", this._onFormReset), y.addEventListener("ln-validate:request-validate", this._onValidateRequest), y._lnValidateGateBound || (y._lnValidateGateBound = !0, y.addEventListener("submit", function(i) {
      const s = { invalidFields: [] };
      L(y, "ln-validate:request-validate", s), s.invalidFields.length > 0 && (i.preventDefault(), s.invalidFields.sort((t, e) => t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), s.invalidFields[0].focus());
    }))), this;
  }
  o.prototype.validate = function() {
    const c = this.dom, r = c.validity, p = c.checkValidity() && this._customErrors.size === 0, m = c.closest(".form-element");
    if (m) {
      const i = m.querySelector("[" + b + "]");
      if (i) {
        const s = i.querySelectorAll("[" + v + "]");
        for (let t = 0; t < s.length; t++) {
          const e = s[t].getAttribute(v), n = u[e];
          n && (r[n] ? s[t].classList.remove("hidden") : s[t].classList.add("hidden"));
        }
      }
    }
    return c.classList.toggle(_, p), c.classList.toggle(h, !p), c.setAttribute("aria-invalid", p ? "false" : "true"), L(c, p ? "ln-validate:valid" : "ln-validate:invalid", { target: c, field: c.name }), p;
  }, o.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(_, h), this.dom.removeAttribute("aria-invalid");
    const c = this.dom.closest(".form-element");
    if (c) {
      const r = c.querySelectorAll("[" + v + "]");
      for (let f = 0; f < r.length; f++)
        r[f].classList.add("hidden");
    }
  }, Object.defineProperty(o.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), o.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const c = this.dom.form;
    c && (this._onFormReset && c.removeEventListener("reset", this._onFormReset), this._onValidateRequest && c.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(_, h), this.dom.removeAttribute("aria-invalid"), L(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[a];
  }, B(l, a, o, "ln-validate");
})();
(function() {
  const l = "data-ln-ajax", a = "lnAjax", b = "data-ln-form-scope";
  if (window[a] !== void 0) return;
  function v(p) {
    if (!p.hasAttribute(l) || p[a]) return;
    p[a] = !0;
    const m = c(p);
    _(m.links), h(m.forms);
  }
  function _(p) {
    for (const m of p) {
      if (m[a + "Trigger"] || m.hostname && m.hostname !== window.location.hostname) continue;
      const y = m.getAttribute("href");
      if (y && y.includes("#")) continue;
      const i = function(s) {
        if (!pe(s, m)) return;
        s.preventDefault();
        const t = m.getAttribute("href");
        t && o("GET", t, null, m);
      };
      m.addEventListener("click", i), m[a + "Trigger"] = i;
    }
  }
  function h(p) {
    for (const m of p) {
      if (m[a + "Trigger"]) continue;
      if (m.hasAttribute(b)) {
        m[a + "ScopeWarned"] || (m[a + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const y = function(i) {
        if (i.defaultPrevented) return;
        i.preventDefault();
        const s = m.method.toUpperCase(), t = m.action, e = new FormData(m);
        for (const n of m.querySelectorAll('button, input[type="submit"]'))
          n.disabled = !0;
        o(s, t, e, m, function() {
          for (const n of m.querySelectorAll('button, input[type="submit"]'))
            n.disabled = !1;
        });
      };
      m.addEventListener("submit", y), m[a + "Trigger"] = y;
    }
  }
  function u(p) {
    if (!p[a]) return;
    const m = c(p);
    for (const y of m.links)
      y[a + "Trigger"] && (y.removeEventListener("click", y[a + "Trigger"]), delete y[a + "Trigger"]);
    for (const y of m.forms)
      y[a + "Trigger"] && (y.removeEventListener("submit", y[a + "Trigger"]), delete y[a + "Trigger"]);
    delete p[a];
  }
  function o(p, m, y, i, s) {
    if (G(i, "ln-ajax:before-start", { method: p, url: m }).defaultPrevented) return;
    L(i, "ln-ajax:start", { method: p, url: m }), i.classList.add("ln-ajax--loading");
    const e = document.createElement("span");
    e.className = "ln-ajax-spinner", i.appendChild(e);
    function n() {
      i.classList.remove("ln-ajax--loading");
      const A = i.querySelector(".ln-ajax-spinner");
      A && A.remove(), s && s();
    }
    let d = m;
    const g = document.querySelector('meta[name="csrf-token"]'), E = g ? g.getAttribute("content") : null;
    y instanceof FormData && E && y.append("_token", E);
    const w = {
      method: p,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (E && (w.headers["X-CSRF-TOKEN"] = E), p === "GET" && y) {
      const A = new URLSearchParams(y);
      d = m + (m.includes("?") ? "&" : "?") + A.toString();
    } else p !== "GET" && y && (w.body = y);
    fetch(d, w).then(function(A) {
      const S = A.ok, q = A.status;
      return A.text().then(function(T) {
        let x = null, k = null;
        if (T && T.trim())
          try {
            x = JSON.parse(T);
          } catch (R) {
            k = R;
          }
        return { ok: S, status: q, data: x, parseError: k };
      });
    }).then(function(A) {
      const S = A.status, q = A.data, T = A.parseError;
      if (A.ok && !T) {
        if (q && q.title && (document.title = q.title), q && q.content)
          for (const x in q.content) {
            const k = document.getElementById(x);
            k && (k.innerHTML = q.content[x]);
          }
        if (i.tagName === "A") {
          const x = i.getAttribute("href");
          x && window.history.pushState({ ajax: !0 }, "", x);
        } else i.tagName === "FORM" && i.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", d);
        L(i, "ln-ajax:success", { method: p, url: d, data: q });
      } else
        L(i, "ln-ajax:error", {
          method: p,
          url: d,
          status: S,
          data: q,
          error: T || null
        });
      L(i, "ln-ajax:complete", { method: p, url: d }), n();
    }).catch(function(A) {
      L(i, "ln-ajax:error", { method: p, url: d, status: 0, data: null, error: A }), L(i, "ln-ajax:complete", { method: p, url: d }), n();
    });
  }
  function c(p) {
    const m = { links: [], forms: [] };
    return p.tagName === "A" && p.getAttribute(l) !== "false" ? m.links.push(p) : p.tagName === "FORM" && p.getAttribute(l) !== "false" ? m.forms.push(p) : (m.links = Array.from(p.querySelectorAll('a:not([data-ln-ajax="false"])')), m.forms = Array.from(p.querySelectorAll('form:not([data-ln-ajax="false"])'))), m;
  }
  function r() {
    lt(function() {
      new MutationObserver(function(m) {
        for (const y of m)
          if (y.type === "childList") {
            for (const i of y.addedNodes)
              if (i.nodeType === 1 && (v(i), !i.hasAttribute(l))) {
                for (const t of i.querySelectorAll("[" + l + "]"))
                  v(t);
                const s = i.closest && i.closest("[" + l + "]");
                if (s && s.getAttribute(l) !== "false") {
                  const t = c(i);
                  _(t.links), h(t.forms);
                }
              }
          } else y.type === "attributes" && v(y.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [l]
      });
    }, "ln-ajax");
  }
  function f() {
    for (const p of document.querySelectorAll("[" + l + "]"))
      v(p);
  }
  window[a] = v, window[a].destroy = u, r(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", f) : f();
})();
const Se = {
  navigate: function(l) {
    Et(l, { historyAction: "push" });
  },
  replace: function(l) {
    Et(l, { historyAction: "replace" });
  },
  current: function() {
    return Kt ? {
      path: zt,
      params: Te,
      query: qe,
      route: Kt,
      regions: Le
    } : null;
  }
}, $t = "data-ln-route", Ce = "lnRoute";
typeof window < "u" && (window.lnRouter = Se);
const ot = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new WeakMap();
let Le = /* @__PURE__ */ new Map(), re = !1, zt = null, Te = {}, qe = {}, Kt = null, jt = !1;
function oe(l, a, b) {
  jt ? queueMicrotask(function() {
    L(l, a, b);
  }) : L(l, a, b);
}
function xt(l) {
  try {
    const h = new URL(l, window.location.origin);
    l = h.pathname + h.search + h.hash;
  } catch {
  }
  let [a] = l.split("#"), [b, v] = a.split("?");
  const _ = {};
  if (v) {
    const h = new URLSearchParams(v);
    for (const [u, o] of h.entries())
      _[u] = o;
  }
  return b = b.replace(/\/+$/, ""), b === "" && (b = "/"), { path: b, query: _ };
}
function xe(l, a) {
  if (l.pattern === "*") return 1;
  if (a.pattern === "*") return -1;
  const b = l.segments, v = a.segments, _ = Math.max(b.length, v.length);
  for (let h = 0; h < _; h++) {
    const u = b[h], o = v[h];
    if (u === void 0) return 1;
    if (o === void 0) return -1;
    if (u === "*") return 1;
    if (o === "*") return -1;
    const c = u.startsWith(":"), r = o.startsWith(":");
    if (c && !r) return 1;
    if (!c && r) return -1;
  }
  return 0;
}
function ke(l, a) {
  const b = l.split("/").filter(Boolean);
  for (const v of a) {
    if (v.pattern === "*")
      return {
        route: v,
        params: { wildcard: l }
      };
    const _ = v.segments, h = {};
    let u = !0;
    if (!(b.length > _.length && _[_.length - 1] !== "*")) {
      for (let o = 0; o < _.length; o++) {
        const c = _[o], r = b[o];
        if (c === "*") {
          h.wildcard = b.slice(o).join("/");
          break;
        }
        if (r === void 0) {
          u = !1;
          break;
        }
        if (c.startsWith(":"))
          h[c.slice(1)] = decodeURIComponent(r);
        else if (c !== r) {
          u = !1;
          break;
        }
      }
      if (u && (_.indexOf("*") !== -1 || b.length <= _.length))
        return { route: v, params: h };
    }
  }
  return null;
}
function Vt(l, a) {
  if (l !== "__primary__") {
    const v = document.getElementById(a.target);
    return v || console.warn(`[ln-router] Explicit target element #${a.target} not found in DOM`), v;
  }
  const b = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return b || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), b;
}
function nn(l) {
  if (!l) return;
  const a = Array.from(l.querySelectorAll("*")), b = [l].concat(a);
  for (const _ of b)
    for (const h of Object.keys(_))
      if (h.startsWith("ln") && _[h] && typeof _[h].destroy == "function")
        try {
          _[h].destroy();
        } catch (u) {
          console.error(`[ln-router] Error destroying component ${h} on element:`, _, u);
        }
  const v = document.querySelectorAll('[data-ln-popover="open"]');
  for (const _ of v) {
    const h = _.lnPopover;
    if (h && h.trigger && l.contains(h.trigger))
      try {
        h.destroy();
      } catch (u) {
        console.error("[ln-router] Error destroying open popover:", u);
      }
  }
}
function Et(l, a = {}) {
  const { path: b, query: v } = xt(l), _ = /* @__PURE__ */ new Map();
  for (const [f, p] of ot)
    _.set(f, ke(b, p.sorted));
  const h = ot.has("__primary__"), u = _.get("__primary__");
  if (h && !u) {
    oe(document.body, "ln-router:not-found", { path: b });
    return;
  }
  let o = null;
  if (u && (o = Vt("__primary__", u.route), !o || G(o, "ln-router:before-navigate", {
    from: zt,
    to: l,
    params: u.params,
    query: v
  }).defaultPrevented))
    return;
  const c = [];
  for (const [f, p] of _) {
    if (!p) continue;
    const m = Vt(f, p.route);
    m && (f !== "__primary__" && m.hasAttribute("data-ln-route-keep") && ie.get(m) === p.route.templateNode || c.push({ regionKey: f, match: p, targetEl: m }));
  }
  a.historyAction === "push" ? window.history.pushState(null, "", l) : a.historyAction === "replace" && window.history.replaceState(null, "", l);
  const r = function() {
    for (const { regionKey: f, match: p, targetEl: m } of c) {
      if (!(a.isHydration && m.hasAttribute("data-ln-router-hydrate") && m.children.length > 0)) {
        nn(m);
        const i = p.route.templateNode.content.cloneNode(!0);
        m.replaceChildren(i);
      }
      if (ie.set(m, p.route.templateNode), f === "__primary__" && (p.route.title && (document.title = p.route.title), !a.isHydration)) {
        m.hasAttribute("tabindex") || m.setAttribute("tabindex", "-1");
        const i = m.querySelector("h1, h2, h3, h4, h5, h6");
        i ? (i.setAttribute("tabindex", "-1"), i.focus()) : m.focus(), m.scrollIntoView({ block: "start", behavior: "instant" });
      }
      oe(m, "ln-router:navigated", {
        path: l,
        params: p.params,
        query: v,
        route: p.route,
        target: m,
        region: f
      });
    }
    u && (zt = l, Te = u.params, qe = v, Kt = u.route), Le = new Map(
      Array.from(_.entries()).map(([f, p]) => [f, p ? { route: p.route, params: p.params } : null])
    );
  };
  document.startViewTransition && !a.isHydration ? document.startViewTransition(r) : r();
}
function rn(l) {
  const a = l.target.closest("a");
  if (!a || !pe(l, a)) return;
  const b = a.getAttribute("href"), { path: v } = xt(b), _ = ot.get("__primary__");
  if (!_) return;
  ke(v, _.sorted) && (l.preventDefault(), Et(b, { historyAction: "push" }));
}
function on(l, a) {
  const b = Object.keys(l), v = Object.keys(a);
  if (b.length !== v.length) return !1;
  for (let _ = 0; _ < b.length; _++) {
    const h = b[_];
    if (l[h] !== a[h]) return !1;
  }
  return !0;
}
function sn() {
  const l = window.location.pathname + window.location.search, a = Se.current();
  if (a && a.path != null) {
    const b = xt(l);
    if (xt(a.path).path === b.path && on(a.query, b.query))
      return;
  }
  Et(l, { historyAction: "skip" });
}
function an() {
  re || (re = !0, lt(function() {
    document.addEventListener("click", rn), window.addEventListener("popstate", sn), jt = !0;
    const l = window.location.pathname + window.location.search + window.location.hash;
    Et(l, { historyAction: "replace", isHydration: !0 }), jt = !1;
  }, "ln-router"));
}
function ln(l) {
  const a = l.getAttribute($t);
  if (!a) return;
  const b = l.getAttribute("data-ln-route-target") || null;
  if (b === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${a}" rejected.`);
    return;
  }
  const v = b || "__primary__";
  ot.has(v) || ot.set(v, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const _ = ot.get(v);
  if (_.routes.has(a)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${a}" in region "${v}"`);
    return;
  }
  const h = l.getAttribute("data-ln-route-title"), u = a.split("/").filter(Boolean), o = {
    pattern: a,
    segments: u,
    target: b,
    title: h,
    templateNode: l
  }, c = Vt(v, o);
  c && c.contains(l) && console.warn(`[ln-router] Route template with pattern "${a}" is declared inside its own outlet element:`, l), _.routes.set(a, o), _.sorted = Array.from(_.routes.values()).sort(xe);
}
function cn(l) {
  const a = l.getAttribute($t);
  if (!a) return;
  const v = l.getAttribute("data-ln-route-target") || null || "__primary__", _ = ot.get(v);
  _ && (_.routes.delete(a), _.sorted = Array.from(_.routes.values()).sort(xe), _.routes.size === 0 && ot.delete(v));
}
function Ie(l) {
  return this.dom = l, ln(l), this;
}
Ie.prototype.destroy = function() {
  cn(this.dom), delete this.dom[Ce];
};
B($t, Ce, Ie, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    ot.size > 0 && an();
  }
});
(function() {
  const l = "data-ln-modal", a = "lnModal";
  if (window[a] !== void 0) return;
  function b(_) {
    this.dom = _, this.isOpen = _.getAttribute(l) === "open";
    const h = this;
    return this._onRequestOpen = function() {
      h.dom.setAttribute(l, "open");
    }, this._onRequestClose = function() {
      h.dom.setAttribute(l, "close");
    }, this._onCancel = function(u) {
      u.preventDefault(), h.dom.setAttribute(l, "close");
    }, this._onClickClose = function(u) {
      const o = u.target.closest("[data-ln-modal-close]");
      o && h.dom.contains(o) && (u.preventDefault(), h.dom.setAttribute(l, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  b.prototype.open = function() {
    this.dom.setAttribute(l, "open");
  }, b.prototype.close = function() {
    this.dom.setAttribute(l, "close");
  }, b.prototype.toggle = function() {
    const _ = this.dom.getAttribute(l);
    this.dom.setAttribute(l, _ === "open" ? "close" : "open");
  }, b.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const _ = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + l + '="open"]'),
          function(u) {
            return u !== _;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      L(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[a];
    }
  };
  function v(_) {
    const h = _[a];
    if (!h) return;
    const o = _.getAttribute(l) === "open";
    if (o !== h.isOpen)
      if (o) {
        if (G(_, "ln-modal:before-open", { modalId: _.id, target: _ }).defaultPrevented) {
          _.setAttribute(l, "close");
          return;
        }
        h.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof _.showModal == "function" && _.showModal();
        const r = _.querySelector("[autofocus]");
        if (r && Lt(r))
          r.focus();
        else {
          const f = _.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), p = Array.prototype.find.call(f, Lt);
          if (p) p.focus();
          else {
            const m = _.querySelectorAll("a[href], button:not([disabled])"), y = Array.prototype.find.call(m, Lt);
            y && y.focus();
          }
        }
        L(_, "ln-modal:open", { modalId: _.id, target: _ });
      } else {
        if (G(_, "ln-modal:before-close", { modalId: _.id, target: _ }).defaultPrevented) {
          _.setAttribute(l, "open");
          return;
        }
        h.isOpen = !1, L(_, "ln-modal:close", { modalId: _.id, target: _ }), typeof _.close == "function" && _.close(), document.querySelector("[" + l + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  B(l, a, b, "ln-modal", {
    onAttributeChange: v
  });
})();
(function() {
  const l = "data-ln-ui-coordinator", a = "lnUiCoordinator", b = "data-ln-ui-coordinator-dict";
  if (window[a] !== void 0) return;
  function v(t) {
    const e = {};
    let n = t;
    const d = [];
    for (; n; ) {
      const g = n.closest("[" + l + "]");
      if (!g) break;
      g[a] && g[a].dict && d.unshift(g[a].dict), n = g.parentElement;
    }
    for (const g of d)
      Object.assign(e, g);
    return e;
  }
  function _(t, e) {
    if (e) {
      if (t) {
        const d = t.closest("[" + l + "]");
        if (d) {
          if (d.id === e && d.hasAttribute("data-ln-modal")) return d;
          const g = d.querySelector("#" + CSS.escape(e) + '[data-ln-modal], [data-ln-modal="' + e + '"]');
          if (g) return g;
        }
      }
      const n = document.getElementById(e) || document.querySelector('[data-ln-modal="' + e + '"]');
      if (n) return n;
    }
    if (t) {
      const n = t.closest("[" + l + "]");
      if (n) {
        if (n.hasAttribute("data-ln-modal")) return n;
        const g = n.querySelector("[data-ln-modal]");
        if (g) return g;
      }
      const d = t.closest("[data-ln-modal]");
      if (d) return d;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function h(t, e) {
    if (t !== "edit") return "";
    if (e) {
      const n = e.getAttribute("data-ln-fill-id");
      if (n) return n;
    }
    return "edit";
  }
  function u(t) {
    if (!t) return;
    const e = t.querySelectorAll("[data-ln-field]");
    for (let d = 0; d < e.length; d++)
      e[d].textContent = "";
    const n = t.querySelectorAll("form");
    for (let d = 0; d < n.length; d++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(n[d], null) : n[d].reset();
  }
  document.addEventListener("click", function(t) {
    if (t.ctrlKey || t.metaKey || t.button === 1) return;
    const e = t.target.closest("[data-ln-modal-for]");
    if (e) {
      const d = e.getAttribute("data-ln-modal-for"), g = _(e, d);
      if (g && g.lnModal) {
        t.preventDefault();
        const E = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, w = {}, A = e.dataset;
        for (const T in A) {
          if (!T.startsWith("lnModal") || E[T]) continue;
          const x = T.slice(7);
          x && (w[x.charAt(0).toLowerCase() + x.slice(1)] = A[T]);
        }
        const S = Object.keys(w).length > 0;
        e.hasAttribute("data-ln-modal-mode") ? g.dataset.lnModalMode = e.getAttribute("data-ln-modal-mode") : g.dataset.lnModalMode = S ? "edit" : "new", S && window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(g, w) : g.dataset.lnModalMode === "new" && u(g), g.getAttribute("data-ln-modal") === "open" ? L(g, "ln-modal:request-close", {}) : (g.id && J(g.id, h(g.dataset.lnModalMode, e)), L(g, "ln-modal:request-open", {}));
      }
      return;
    }
    const n = t.target.closest('a[href^="#"]');
    if (n) {
      const d = Dt(n.getAttribute("href"));
      for (const g in d) {
        const E = document.getElementById(g);
        if (E && E.lnModal) {
          if (!Qt(t)) return;
          J(g, d[g]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(t) {
    const e = t.target;
    if (!e || !e.lnModal) return;
    (e.dataset.lnModalMode || "new") === "new" && u(e);
  }), document.addEventListener("ln-modal:open", function(t) {
    const e = t.target;
    if (!e || !e.lnModal || !e.id) return;
    let n = X(e.id);
    n === null && (n = h(e.dataset.lnModalMode, null), J(e.id, n)), n ? (e.dataset.lnModalMode = "edit", e.dispatchEvent(new CustomEvent("ln-fill:request", {
      bubbles: !0,
      detail: { id: n }
    }))) : (e.dataset.lnModalMode = "new", u(e));
  });
  let o = !1;
  function c() {
    if (!o) {
      o = !0;
      try {
        const t = document.querySelectorAll("[data-ln-modal][id]");
        for (let e = 0; e < t.length; e++) {
          const n = t[e];
          if (!n.lnModal) continue;
          const d = n.id, g = X(d), E = g !== null, w = n.lnModal.isOpen;
          if (E) {
            const A = g ? "edit" : "new";
            n.dataset.lnModalMode = A, w ? g ? n.dispatchEvent(new CustomEvent("ln-fill:request", {
              bubbles: !0,
              detail: { id: g }
            })) : u(n) : L(n, "ln-modal:request-open", {});
          } else w && L(n, "ln-modal:request-close", {});
        }
      } finally {
        o = !1;
      }
    }
  }
  function r() {
    const t = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let e = 0; e < t.length; e++) {
      const n = t[e];
      n.lnModal && X(n.id) === null && J(n.id, h(n.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", c);
  function f() {
    r(), c();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    nt(f);
  }) : nt(f);
  function p(t) {
    const n = (t.detail || {}).data;
    if (n && n.message) {
      const g = n.message;
      window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
        detail: {
          type: g.type || "success",
          title: g.title || "",
          message: g.body || ""
        }
      }));
    }
    const d = t.target.closest("[data-ln-modal]");
    d && d.lnModal && (d.id && J(d.id, null), L(d, "ln-modal:request-close", {}), u(d));
  }
  function m(t) {
    const e = t.detail || {}, n = e.data, d = e.status || 0, g = v(t.target);
    if (n && n.message) {
      const E = n.message;
      window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
        detail: {
          type: E.type || "error",
          title: E.title || "",
          message: E.body || ""
        }
      }));
    } else d === 0 ? window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: g["network-error-title"] || "",
        message: g["network-error"] || "Network error"
      }
    })) : window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: g["server-error-title"] || "",
        message: g["server-error"] || "Server error"
      }
    }));
  }
  document.addEventListener("ln-ajax:success", p), document.addEventListener("ln-ajax:error", m);
  function y(t) {
    const e = t.detail || {}, n = v(t.target), d = e.message || (e.reason === "max-size" ? n["upload-max-size"] || "File is too large" : e.reason === "max-files" ? n["upload-max-files"] || "Maximum file count exceeded" : n["upload-invalid-type"] || "This file type is not allowed"), g = n["upload-invalid-title"] || "Invalid File";
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: g,
        message: d
      }
    }));
  }
  function i(t) {
    const e = t.detail || {}, n = v(t.target), d = e.message || n["upload-failed"] || "Failed to upload file", g = n["upload-error-title"] || "Upload Error";
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: g,
        message: d
      }
    }));
  }
  document.addEventListener("ln-upload:invalid", y), document.addEventListener("ln-upload:error", i), document.addEventListener("ln-modal:close", function(t) {
    const e = t.target;
    !e || !e.lnModal || (e.id && X(e.id) !== null && J(e.id, null), e.dataset.lnModalMode === "new" && u(e));
  });
  function s(t) {
    return this.dom = t, this.dict = kt(t, b), this;
  }
  s.prototype.destroy = function() {
    this.dom[a] && (this.dict = {}, delete this.dom[a]);
  }, B(l, a, s, "ln-ui-coordinator");
})();
(function() {
  const l = "data-ln-number", a = "lnNumber";
  if (window[a] !== void 0) return;
  const b = {}, v = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function _(r) {
    if (!b[r]) {
      const f = new Intl.NumberFormat(r, { useGrouping: !0 }), p = f.formatToParts(1234.5);
      let m = "", y = ".";
      for (let i = 0; i < p.length; i++)
        p[i].type === "group" && (m = p[i].value), p[i].type === "decimal" && (y = p[i].value);
      b[r] = { fmt: f, groupSep: m, decimalSep: y };
    }
    return b[r];
  }
  function h(r, f, p) {
    if (p !== null) {
      const m = parseInt(p, 10), y = r + "|d" + m;
      return b[y] || (b[y] = new Intl.NumberFormat(r, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: m })), b[y].format(f);
    }
    return _(r).fmt.format(f);
  }
  function u(r) {
    if (r[a]) return r[a];
    if (r[a] = this, this.dom = r, r.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const f = document.createElement("input");
    f.type = "hidden", f.name = r.name, r.removeAttribute("name"), r.hasAttribute("data-ln-fill-as") && f.setAttribute("data-ln-fill-as", r.getAttribute("data-ln-fill-as")), r.type = "text", r.setAttribute("inputmode", "decimal"), r.insertAdjacentElement("afterend", f), this._hidden = f;
    const p = this;
    Object.defineProperty(f, "value", {
      get: function() {
        return v.get.call(f);
      },
      set: function(y) {
        v.set.call(f, y), y !== "" && !isNaN(parseFloat(y)) ? p._setDisplayRaw(h(W(p.dom), parseFloat(y), p.dom.getAttribute("data-ln-number-decimals"))) : p._setDisplayRaw(""), p.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), fe(r, v, {
      get: function() {
        return v.get.call(r);
      },
      set: function(y) {
        if (y === "") {
          p._setDisplayRaw(""), p._setHiddenRaw(""), r.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const i = typeof y == "number" ? y : parseFloat(String(y).replace(/[^\d.-]/g, ""));
        isNaN(i) ? (p._setDisplayRaw(String(y)), p._setHiddenRaw("")) : (p._setHiddenRaw(i), p._setDisplayRaw(h(W(r), i, r.getAttribute("data-ln-number-decimals")))), r.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      p._handleInput();
    }, r.addEventListener("input", this._onInput), this._onPaste = function(y) {
      y.preventDefault();
      const i = (y.clipboardData || window.clipboardData).getData("text"), s = _(W(r)), t = s.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let e = i.replace(new RegExp("[^0-9\\-" + t + ".]", "g"), "");
      s.groupSep && (e = e.split(s.groupSep).join("")), s.decimalSep !== "." && (e = e.replace(s.decimalSep, "."));
      const n = parseFloat(e);
      p.value = isNaN(n) ? NaN : n;
    }, r.addEventListener("paste", this._onPaste);
    const m = r.value;
    if (m !== "") {
      const y = parseFloat(m);
      isNaN(y) || (this._setHiddenRaw(y), this._setDisplayRaw(h(W(r), y, r.getAttribute("data-ln-number-decimals"))), r.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  function o(r) {
    if (typeof r == "number") return isNaN(r) ? null : r;
    if (!r || typeof r != "string") return null;
    let f = r.trim();
    if (f === "") return null;
    f = f.replace(/[\s\u00A0$€£]/g, ""), f.indexOf(",") !== -1 && f.indexOf(".") !== -1 ? f.indexOf(".") < f.indexOf(",") ? f = f.replace(/\./g, "").replace(",", ".") : f = f.replace(/,/g, "") : f.indexOf(",") !== -1 && (f = f.replace(",", ".")), f = f.replace(/[^\d.-]/g, "");
    const p = parseFloat(f);
    return isNaN(p) ? null : p;
  }
  u.prototype._initTextElement = function() {
    const r = this.dom;
    let f = r.getAttribute("data-ln-value"), p = r.getAttribute("data-ln-number"), m = null;
    f !== null && f !== "" ? m = f : p !== null && p !== "" && p !== "true" ? m = p : m = r.textContent.trim();
    const y = o(m);
    y !== null ? (this._rawValue = y, r.hasAttribute("data-ln-value") || r.setAttribute("data-ln-value", String(y)), this._formatTextContent()) : this._rawValue = null;
  }, u.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const r = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = h(W(this.dom), this._rawValue, r);
    }
  }, u.prototype._handleInput = function() {
    const r = this.dom, f = _(W(r)), p = v.get.call(r);
    if (p === "") {
      this._setHiddenRaw(""), L(r, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (p === "-") {
      this._setHiddenRaw("");
      return;
    }
    const m = r.selectionStart;
    let y = 0;
    for (let A = 0; A < m; A++)
      /[0-9]/.test(p[A]) && y++;
    let i = p;
    if (f.groupSep && (i = i.split(f.groupSep).join("")), i = i.replace(f.decimalSep, "."), p.endsWith(f.decimalSep) || p.endsWith(".")) {
      const A = i.replace(/\.$/, ""), S = parseFloat(A);
      isNaN(S) || this._setHiddenRaw(S);
      return;
    }
    const s = i.indexOf(".");
    if (s !== -1 && i.slice(s + 1).endsWith("0")) {
      const S = parseFloat(i);
      isNaN(S) || this._setHiddenRaw(S);
      return;
    }
    const t = r.getAttribute("data-ln-number-decimals");
    if (t !== null && s !== -1) {
      const A = parseInt(t, 10);
      i.slice(s + 1).length > A && (i = i.slice(0, s + 1 + A));
    }
    const e = parseFloat(i);
    if (isNaN(e)) return;
    const n = r.getAttribute("data-ln-number-min"), d = r.getAttribute("data-ln-number-max");
    if (n !== null && e < parseFloat(n) || d !== null && e > parseFloat(d)) return;
    let g;
    if (t !== null)
      g = h(W(r), e, t);
    else {
      const A = s !== -1 ? i.slice(s + 1).length : 0;
      if (A > 0) {
        const S = W(r) + "|u" + A;
        b[S] || (b[S] = new Intl.NumberFormat(W(r), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), g = b[S].format(e);
      } else
        g = f.fmt.format(e);
    }
    this._setDisplayRaw(g);
    let E = y, w = 0;
    for (let A = 0; A < g.length && E > 0; A++)
      w = A + 1, /[0-9]/.test(g[A]) && E--;
    E > 0 && (w = g.length), r.setSelectionRange(w, w), this._setHiddenRaw(e), L(r, "ln-number:input", { value: e, formatted: g });
  }, u.prototype._setHiddenRaw = function(r) {
    this._hidden && v.set.call(this._hidden, String(r));
  }, u.prototype._setDisplayRaw = function(r) {
    this.isTextElement ? this.dom.textContent = String(r) : v.set.call(this.dom, String(r));
  }, u.prototype._displayFormatted = function(r) {
    this.isTextElement ? this._formatTextContent() : this._setDisplayRaw(h(W(this.dom), r, this.dom.getAttribute("data-ln-number-decimals")));
  }, Object.defineProperty(u.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const r = v.get.call(this._hidden);
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
      this._setHiddenRaw(r), this._setDisplayRaw(h(W(this.dom), r, this.dom.getAttribute("data-ln-number-decimals"))), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(u.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : v.get.call(this.dom);
    }
  }), u.prototype.destroy = function() {
    this.dom[a] && (this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), L(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function c() {
    new MutationObserver(function() {
      const r = document.querySelectorAll("[" + l + "]");
      for (let f = 0; f < r.length; f++) {
        const p = r[f][a];
        p && (p.isTextElement ? p._formatTextContent() : isNaN(p.value) || p._displayFormatted(p.value));
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  B(l, a, u, "ln-number", {
    extraAttributes: [
      "data-ln-value",
      "data-ln-number-decimals",
      "data-ln-number-min",
      "data-ln-number-max",
      "lang"
    ],
    onAttributeChange: function(r) {
      const f = r[a];
      f && (f.isTextElement ? f._initTextElement() : isNaN(f.value) || f._displayFormatted(f.value));
    }
  }), c();
})();
(function() {
  const l = "data-ln-date", a = "lnDate";
  if (window[a] !== void 0) return;
  const b = {}, v = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function _(n, d) {
    const g = n + "|" + JSON.stringify(d);
    return b[g] || (b[g] = new Intl.DateTimeFormat(n, d)), b[g];
  }
  const h = /^(short|medium|long)(\s+datetime)?$/, u = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function o(n) {
    return !n || n === "" ? { dateStyle: "medium" } : n.match(h) ? u[n] : null;
  }
  function c(n, d, g) {
    const E = n.getDate(), w = n.getMonth(), A = n.getFullYear(), S = n.getHours(), q = n.getMinutes();
    let T, x;
    const k = wt(g), R = (g || "").toLowerCase().split("-")[0], z = _(g, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0], H = k && z !== R;
    H && k.monthsLong ? T = k.monthsLong[w] : T = _(g, { month: "long" }).format(n), H && k.monthsShort ? x = k.monthsShort[w] : x = _(g, { month: "short" }).format(n);
    const U = {
      yyyy: String(A),
      yy: String(A).slice(-2),
      MMMM: T,
      MMM: x,
      MM: String(w + 1).padStart(2, "0"),
      M: String(w + 1),
      dd: String(E).padStart(2, "0"),
      d: String(E),
      HH: String(S).padStart(2, "0"),
      mm: String(q).padStart(2, "0")
    };
    return d.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(K) {
      return U[K];
    });
  }
  function r(n, d, g) {
    const E = o(d);
    if (E) {
      const w = _(g, E), A = (g || "").toLowerCase().split("-")[0], S = w.resolvedOptions().locale.toLowerCase().split("-")[0];
      return wt(g) && S !== A ? c(n, "dd.MM.yyyy", g) : w.format(n);
    }
    return c(n, d, g);
  }
  function f(n) {
    if (!n) return "";
    const d = n.getFullYear(), g = String(n.getMonth() + 1).padStart(2, "0"), E = String(n.getDate()).padStart(2, "0");
    return d + "-" + g + "-" + E;
  }
  function p(n, d, g) {
    L(n.dom, "ln-date:change", {
      value: d,
      formatted: n.dom.value,
      date: g
    }), n.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function m(n, d, g, E) {
    n._setHiddenRaw(d), v.set.call(n._picker, d), n._lastISO = d, E !== void 0 ? (n._isFormatting = !0, n.dom.value = E, n._isFormatting = !1) : g && n._displayFormatted(g), p(n, d, g);
  }
  function y(n) {
    n._setHiddenRaw(""), v.set.call(n._picker, ""), n._isFormatting = !0, n.dom.value = "", n._isFormatting = !1, n._lastISO = "", p(n, "", null);
  }
  i.prototype._initTextElement = function() {
    const n = this.dom;
    let d = n.getAttribute("data-ln-value"), g = n.getAttribute("data-ln-date"), E = n.getAttribute("datetime"), w = null;
    d !== null && d !== "" ? w = d : E !== null && E !== "" ? w = E : g !== null && g !== "" && g !== "true" && !h.test(g) ? w = g : w = n.textContent.trim();
    let A = s(w) || t(w);
    if (!A && w)
      if (isNaN(w))
        A = new Date(w);
      else {
        const S = Number(w);
        A = new Date(S > 1e11 ? S : S * 1e3);
      }
    if (A && !isNaN(A.getTime())) {
      const S = f(A);
      this._rawValue = S, n.hasAttribute("data-ln-value") || n.setAttribute("data-ln-value", S), this._formatTextContent();
    } else
      this._rawValue = null;
  }, i.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const n = s(this._rawValue);
      if (n) {
        let g = this.dom.getAttribute("data-ln-date-format");
        if (!g) {
          const w = this.dom.getAttribute("data-ln-date");
          w && h.test(w) && (g = w);
        }
        const E = W(this.dom);
        this.dom.textContent = r(n, g || "medium", E);
      }
    }
  };
  function i(n) {
    if (n[a]) return n[a];
    if (n[a] = this, this.dom = n, n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const d = this, g = n.value, E = n.name, A = (n.closest(".form-element, form") || n.parentNode).querySelectorAll("[data-ln-date-dict]");
    for (let k = 0; k < A.length; k++) {
      const R = A[k].getAttribute("data-ln-date-dict");
      if (R) {
        const N = kt(A[k], "data-ln-date-dict-key");
        N["months-long"] && (N.monthsLong = N["months-long"].split(",").map((z) => z.trim())), N["months-short"] && (N.monthsShort = N["months-short"].split(",").map((z) => z.trim())), Wt(R, N);
      }
    }
    const S = document.createElement("span");
    S.setAttribute("data-ln-date-field", ""), n.parentNode.insertBefore(S, n), S.appendChild(n), this._wrapper = S;
    const q = document.createElement("input");
    q.type = "hidden", q.name = E, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && q.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.insertAdjacentElement("afterend", q), this._hidden = q;
    const T = document.createElement("input");
    T.type = "date", T.tabIndex = -1, T.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", q.insertAdjacentElement("afterend", T), this._picker = T, n.type = "text";
    const x = document.createElement("button");
    if (x.type = "button", x.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Open date picker"), x.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', T.insertAdjacentElement("afterend", x), this._btn = x, this._lastISO = "", Object.defineProperty(q, "value", {
      get: function() {
        return v.get.call(q);
      },
      set: function(k) {
        if (v.set.call(q, k), k && k !== "") {
          const R = s(k);
          R && m(d, k, R);
        } else k === "" && y(d);
      }
    }), fe(n, v, {
      get: function() {
        return v.get.call(n);
      },
      set: function(k, R) {
        if (d._isFormatting) {
          R(k);
          return;
        }
        if (!k || k === "") {
          R(""), y(d);
          return;
        }
        const N = s(k) || t(k);
        if (N) {
          const z = f(N), H = n.getAttribute(l) || "", U = W(n), K = r(N, H, U);
          R(K), m(d, z, N, K);
        } else
          R(String(k)), y(d);
      }
    }), this._onPickerChange = function() {
      const k = T.value;
      if (k) {
        const R = s(k);
        R && m(d, k, R);
      } else
        y(d);
    }, T.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const k = d.dom.value.trim();
      if (k === "") {
        d._lastISO !== "" && y(d);
        return;
      }
      if (d._lastISO) {
        const N = s(d._lastISO);
        if (N) {
          const z = d.dom.getAttribute(l) || "", H = W(d.dom);
          if (k === r(N, z, H)) return;
        }
      }
      const R = t(k);
      if (R) {
        const N = f(R);
        m(d, N, R);
      } else if (d._lastISO) {
        const N = s(d._lastISO);
        N && d._displayFormatted(N);
      } else
        d.dom.value = "";
    }, n.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      d._openPicker();
    }, x.addEventListener("click", this._onBtnClick), g && g !== "") {
      const k = s(g);
      k && m(d, g, k);
    }
    return this;
  }
  function s(n) {
    if (!n || typeof n != "string") return null;
    const d = n.split("T"), g = d[0].split("-");
    if (g.length < 3) return null;
    const E = parseInt(g[0], 10), w = parseInt(g[1], 10) - 1, A = parseInt(g[2], 10);
    if (isNaN(E) || isNaN(w) || isNaN(A)) return null;
    let S = 0, q = 0;
    if (d[1]) {
      const x = d[1].split(":");
      S = parseInt(x[0], 10) || 0, q = parseInt(x[1], 10) || 0;
    }
    const T = new Date(E, w, A, S, q);
    return T.getFullYear() !== E || T.getMonth() !== w || T.getDate() !== A ? null : T;
  }
  function t(n) {
    if (!n || typeof n != "string" || (n = n.trim(), n.length < 6)) return null;
    let d, g;
    if (n.indexOf(".") !== -1)
      d = ".", g = n.split(".");
    else if (n.indexOf("/") !== -1)
      d = "/", g = n.split("/");
    else if (n.indexOf("-") !== -1)
      d = "-", g = n.split("-");
    else
      return null;
    if (g.length !== 3) return null;
    const E = [];
    for (let T = 0; T < 3; T++) {
      const x = parseInt(g[T], 10);
      if (isNaN(x)) return null;
      E.push(x);
    }
    let w, A, S;
    d === "." ? (w = E[0], A = E[1], S = E[2]) : d === "/" ? (A = E[0], w = E[1], S = E[2]) : g[0].length === 4 ? (S = E[0], A = E[1], w = E[2]) : (w = E[0], A = E[1], S = E[2]), S < 100 && (S += S < 50 ? 2e3 : 1900);
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
    v.set.call(this._hidden, n);
  }, i.prototype._displayFormatted = function(n) {
    const d = this.dom.getAttribute(l) || "", g = W(this.dom);
    this._isFormatting = !0, this.dom.value = r(n, d, g), this._isFormatting = !1;
  }, Object.defineProperty(i.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : v.get.call(this._hidden);
    },
    set: function(n) {
      if (this.isTextElement) {
        if (!n || n === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const g = s(n) || t(n);
        if (!g) return;
        const E = f(g);
        this._rawValue = E, this.dom.setAttribute("data-ln-value", E), this._formatTextContent();
        return;
      }
      if (!n || n === "") {
        y(this);
        return;
      }
      const d = s(n);
      d && m(this, n, d);
    }
  }), Object.defineProperty(i.prototype, "date", {
    get: function() {
      const n = this.value;
      return n ? s(n) : null;
    },
    set: function(n) {
      if (!n || !(n instanceof Date) || isNaN(n.getTime())) {
        this.value = "";
        return;
      }
      this.value = f(n);
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
      const n = document.querySelectorAll("[" + l + "]");
      for (let d = 0; d < n.length; d++) {
        const g = n[d][a];
        if (g) {
          if (g.isTextElement)
            g._formatTextContent();
          else if (g.value) {
            const E = s(g.value);
            E && g._displayFormatted(E);
          }
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  B(l, a, i, "ln-date", {
    extraAttributes: ["data-ln-date-format", "data-ln-date-locale", "data-ln-value", "datetime", "lang"],
    onAttributeChange: function(n) {
      const d = n[a];
      if (d) {
        if (d.isTextElement)
          d._initTextElement();
        else if (d.value) {
          const g = s(d.value);
          g && d._displayFormatted(g);
        }
      }
    }
  }), e();
})();
(function() {
  const l = "data-ln-nav", a = "lnNav";
  if (window[a] !== void 0) return;
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const h = history.pushState;
    history.pushState = function() {
      h.apply(history, arguments);
      for (const o of history._lnNavCallbacks)
        o();
    };
    const u = history.replaceState;
    history.replaceState = function() {
      u.apply(history, arguments);
      for (const o of history._lnNavCallbacks)
        o();
    }, history._lnNavPatched = !0;
  }
  function b(h) {
    return this.dom = h, this.activeClass = h.getAttribute(l) || "active", this.exact = h.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(h, { childList: !0, subtree: !0 }), this.update(), this;
  }
  b.prototype.update = function() {
    if (!this.activeClass || G(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const u = Array.from(this.dom.querySelectorAll("a")), o = window.location.pathname, c = v(o), r = [];
    for (const f of u) {
      const p = f.getAttribute("href");
      if (!p || p === "#" || p.startsWith("#") || p.startsWith("javascript:") || p.startsWith("mailto:") || p.startsWith("tel:")) {
        f.classList.remove(this.activeClass), f.removeAttribute("aria-current");
        continue;
      }
      if (f.hostname && f.hostname !== window.location.hostname) {
        f.classList.remove(this.activeClass), f.removeAttribute("aria-current");
        continue;
      }
      const m = v(p), y = m === c, i = !this.exact && m !== "/" && c.startsWith(m + "/");
      y || i ? (f.classList.add(this.activeClass), f.setAttribute("aria-current", "page"), r.push(f)) : (f.classList.remove(this.activeClass), f.removeAttribute("aria-current"));
    }
    L(this.dom, "ln-nav:update", { target: this.dom, activeLinks: r });
  }, b.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const h = history._lnNavCallbacks.indexOf(this.updateHandler);
    h !== -1 && history._lnNavCallbacks.splice(h, 1), L(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[a];
  };
  function v(h) {
    try {
      return new URL(h, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return h.replace(/\/$/, "") || "/";
    }
  }
  function _(h, u) {
    const o = h[a];
    if (o) {
      if (u === l) {
        if (!h.hasAttribute(l)) {
          o.destroy();
          return;
        }
        const c = o.activeClass, r = h.getAttribute(l) || "active";
        if (c !== r) {
          const f = h.querySelectorAll("a");
          for (const p of f)
            c && p.classList.remove(c);
          o.activeClass = r;
        }
      } else u === "data-ln-nav-exact" && (o.exact = h.hasAttribute("data-ln-nav-exact"));
      o.update();
    }
  }
  B(l, a, b, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: _
  });
})();
(function() {
  const l = "data-ln-tabs", a = "lnTabs";
  if (window[a] !== void 0 && window[a] !== null) return;
  function b(h, u) {
    const o = (h.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (o) return o;
    if (h.tagName !== "A") return "";
    const c = h.getAttribute("href") || "";
    if (!c.startsWith("#")) return "";
    const r = c.slice(1);
    if (!r) return "";
    const f = r.split("&");
    if (u)
      for (const y of f) {
        const i = y.indexOf(":");
        if (i > 0 && y.slice(0, i).toLowerCase().trim() === u)
          return y.slice(i + 1).toLowerCase().trim();
      }
    const p = f[f.length - 1] || "", m = p.indexOf(":");
    return (m > 0 ? p.slice(m + 1) : p).toLowerCase().trim();
  }
  function v(h) {
    return this.dom = h, this.activeKey = null, _.call(this), this;
  }
  function _() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const h = this.tabs.filter((c) => c.tagName === "A" && (c.getAttribute("href") || "").startsWith("#")), u = h.length > 0 && h.length === this.tabs.length;
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = u && !!this.nsKey, h.length > 0 && h.length !== this.tabs.length ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : u && !this.nsKey && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const c of this.tabs) {
      const r = b(c, this.nsKey);
      r ? this.mapTabs[r] = c : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', c);
    }
    for (const c of this.panels) {
      const r = (c.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      r && (this.mapPanels[r] = c);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const o = this;
    this._clickHandlers = [];
    for (const c of this.tabs) {
      if (c[a + "Trigger"]) continue;
      const r = function(f) {
        const p = c.tagName === "A";
        if (!p && (f.ctrlKey || f.metaKey || f.button === 1)) return;
        const m = b(c, o.nsKey);
        m && (p && !Qt(f) || (o.hashEnabled ? X(o.nsKey) === m ? o.dom.setAttribute("data-ln-tabs-active", m) : J(o.nsKey, m) : o.dom.setAttribute("data-ln-tabs-active", m)));
      };
      c.addEventListener("click", r), c[a + "Trigger"] = r, o._clickHandlers.push({ el: c, handler: r });
    }
    if (this._onRequestSelect = function(c) {
      const r = c.detail && (c.detail.key || c.detail.tab);
      r && o.select(r);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!o.hashEnabled) return;
      const c = X(o.nsKey);
      o.dom.setAttribute("data-ln-tabs-active", c !== null ? c : o.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let c = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const r = It("tabs", this.dom);
        r !== null && r in this.mapPanels && (c = r);
      }
      this.dom.setAttribute("data-ln-tabs-active", c);
    }
  }
  v.prototype.select = function(h) {
    const u = (h + "").toLowerCase().trim();
    u && (this.hashEnabled ? X(this.nsKey) === u ? this.dom.setAttribute("data-ln-tabs-active", u) : J(this.nsKey, u) : this.dom.setAttribute("data-ln-tabs-active", u));
  }, v.prototype._applyActive = function(h) {
    var o;
    if ((!h || !(h in this.mapPanels)) && (h = this.defaultKey), h === this.activeKey) return;
    const u = this.activeKey;
    if (u !== null && G(this.dom, "ln-tabs:before-change", {
      key: h,
      previousKey: u,
      tab: this.mapTabs[h],
      panel: this.mapPanels[h],
      target: this.dom
    }).defaultPrevented) {
      u in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", u), this.hashEnabled && X(this.nsKey) !== u && J(this.nsKey, u));
      return;
    }
    this.activeKey = h;
    for (const c in this.mapTabs) {
      const r = this.mapTabs[c];
      c === h ? (r.setAttribute("data-active", ""), r.setAttribute("aria-selected", "true")) : (r.removeAttribute("data-active"), r.setAttribute("aria-selected", "false"));
    }
    for (const c in this.mapPanels) {
      const r = this.mapPanels[c], f = c === h;
      r.classList.toggle("hidden", !f), r.setAttribute("aria-hidden", f ? "false" : "true");
    }
    if (this.autoFocus) {
      const c = (o = this.mapPanels[h]) == null ? void 0 : o.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      c && setTimeout(() => c.focus({ preventScroll: !0 }), 0);
    }
    L(this.dom, "ln-tabs:change", {
      key: h,
      previousKey: u,
      tab: this.mapTabs[h],
      panel: this.mapPanels[h],
      target: this.dom
    }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && ht("tabs", this.dom, h);
  }, v.prototype.destroy = function() {
    if (this.dom[a]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: h, handler: u } of this._clickHandlers)
        h.removeEventListener("click", u), delete h[a + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), L(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[a];
    }
  }, B(l, a, v, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(h) {
      const u = h.getAttribute("data-ln-tabs-active");
      h[a]._applyActive(u);
    }
  });
})();
(function() {
  const l = "data-ln-toggle", a = "lnToggle";
  if (window[a] !== void 0) return;
  function b(h, u) {
    const o = document.querySelectorAll(
      '[data-ln-toggle-for="' + h.id + '"]'
    );
    for (const c of o)
      c.setAttribute("aria-expanded", u ? "true" : "false");
  }
  function v(h) {
    this.dom = h;
    const u = this;
    if (this._onRequestOpen = function() {
      u.open();
    }, this._onRequestClose = function() {
      u.close();
    }, this._onRequestToggle = function() {
      u.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), h.hasAttribute("data-ln-persist")) {
      const o = It("toggle", h);
      o !== null && h.setAttribute(l, o);
    }
    return this.isOpen = h.getAttribute(l) === "open", this.isOpen && h.classList.add("open"), b(h, this.isOpen), this;
  }
  v.prototype.open = function() {
    this.dom.setAttribute(l, "open");
  }, v.prototype.close = function() {
    this.dom.setAttribute(l, "close");
  }, v.prototype.toggle = function() {
    const h = this.dom.getAttribute(l);
    this.dom.setAttribute(l, h === "open" ? "close" : "open");
  }, v.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), L(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function _(h) {
    const u = h[a];
    if (!u) return;
    const c = h.getAttribute(l) === "open";
    if (c !== u.isOpen)
      if (c) {
        if (G(h, "ln-toggle:before-open", { target: h }).defaultPrevented) {
          h.setAttribute(l, "close");
          return;
        }
        u.isOpen = !0, h.classList.add("open"), b(h, !0), L(h, "ln-toggle:open", { target: h }), h.hasAttribute("data-ln-persist") && ht("toggle", h, "open");
      } else {
        if (G(h, "ln-toggle:before-close", { target: h }).defaultPrevented) {
          h.setAttribute(l, "open");
          return;
        }
        u.isOpen = !1, h.classList.remove("open"), b(h, !1), L(h, "ln-toggle:close", { target: h }), h.hasAttribute("data-ln-persist") && ht("toggle", h, "close");
      }
  }
  document.addEventListener("click", function(h) {
    if (h.ctrlKey || h.metaKey || h.button === 1) return;
    const u = h.target.closest("[data-ln-toggle-for]");
    if (u) {
      const o = u.getAttribute("data-ln-toggle-for"), c = document.getElementById(o);
      if (c && c[a]) {
        h.preventDefault();
        const r = u.getAttribute("data-ln-toggle-action") || "toggle";
        if (r === "open")
          c.setAttribute(l, "open");
        else if (r === "close")
          c.setAttribute(l, "close");
        else if (r === "toggle") {
          const f = c.getAttribute(l);
          c.setAttribute(l, f === "open" ? "close" : "open");
        }
      }
    }
  }), B(l, a, v, "ln-toggle", {
    onAttributeChange: _
  });
})();
(function() {
  const l = "data-ln-accordion", a = "lnAccordion";
  if (window[a] !== void 0) return;
  function b(v) {
    return this.dom = v, this._onToggleOpen = function(_) {
      if (_.detail.target.closest("[data-ln-accordion]") !== v) return;
      const h = v.querySelectorAll("[data-ln-toggle]");
      for (const u of h)
        u !== _.detail.target && u.closest("[data-ln-accordion]") === v && u.getAttribute("data-ln-toggle") === "open" && u.setAttribute("data-ln-toggle", "close");
      L(v, "ln-accordion:change", { target: _.detail.target });
    }, v.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  b.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), L(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[a]);
  }, B(l, a, b, "ln-accordion");
})();
(function() {
  const l = "data-ln-dropdown", a = "lnDropdown", b = "data-ln-dropdown-position", v = "data-ln-dropdown-placement", _ = "bottom-end";
  if (window[a] !== void 0) return;
  function h(u) {
    this.dom = u, this.toggleEl = u.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = u.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const o = this;
    return this._onRequestOpen = function() {
      o.toggleEl && o.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      o.toggleEl && o.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (o.toggleEl) {
        const c = o.toggleEl.getAttribute("data-ln-toggle");
        o.toggleEl.setAttribute("data-ln-toggle", c === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(c) {
      const r = o.toggleEl && o.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (c.key === "Escape") {
        r && (c.preventDefault(), c.stopPropagation(), o.toggleEl.setAttribute("data-ln-toggle", "close"), o.triggerBtn && o.triggerBtn.focus());
        return;
      }
      if (c.key === "Tab") {
        r && (o.triggerBtn && o.triggerBtn.focus(), o.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const f = o._getMenuItems();
      if (f.length === 0) return;
      if (!r && (c.key === "ArrowDown" || c.key === "ArrowUp")) {
        c.preventDefault(), o.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const m = o._getMenuItems();
          m.length > 0 && o._focusItem(m, c.key === "ArrowDown" ? 0 : m.length - 1);
        }, 0);
        return;
      }
      if (!r) return;
      const p = f.indexOf(document.activeElement);
      if (c.key === "ArrowDown") {
        c.preventDefault();
        const m = p < f.length - 1 ? p + 1 : 0;
        o._focusItem(f, m);
      } else if (c.key === "ArrowUp") {
        c.preventDefault();
        const m = p > 0 ? p - 1 : f.length - 1;
        o._focusItem(f, m);
      } else c.key === "Home" ? (c.preventDefault(), o._focusItem(f, 0)) : c.key === "End" && (c.preventDefault(), o._focusItem(f, f.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(c) {
      !c.detail || c.detail.target !== o.toggleEl || (o.triggerBtn && o.triggerBtn.setAttribute("aria-expanded", "true"), typeof o.toggleEl.showPopover == "function" && o.toggleEl.showPopover(), o._initMenuAria(), o._reposition(), o._addOutsideClickListener(), o._addScrollRepositionListener(), o._addResizeCloseListener(), L(u, "ln-dropdown:open", { target: c.detail.target }));
    }, this._onToggleClose = function(c) {
      !c.detail || c.detail.target !== o.toggleEl || (o.triggerBtn && o.triggerBtn.setAttribute("aria-expanded", "false"), o._removeOutsideClickListener(), o._removeScrollRepositionListener(), o._removeResizeCloseListener(), o.toggleEl.style.top = "", o.toggleEl.style.left = "", o.toggleEl.removeAttribute(v), typeof o.toggleEl.hidePopover == "function" && o.toggleEl.matches(":popover-open") && o.toggleEl.hidePopover(), L(u, "ln-dropdown:close", { target: c.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  h.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const u = this.toggleEl.querySelectorAll("li");
    for (const c of u)
      c.setAttribute("role", "none");
    const o = this._getMenuItems();
    for (let c = 0; c < o.length; c++)
      o[c].setAttribute("role", "menuitem"), o[c].setAttribute("tabindex", c === 0 ? "0" : "-1");
  }, h.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, h.prototype._focusItem = function(u, o) {
    for (let c = 0; c < u.length; c++)
      u[c].setAttribute("tabindex", c === o ? "0" : "-1");
    u[o] && u[o].focus();
  }, h.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const u = this.triggerBtn.getBoundingClientRect(), o = Ut(this.toggleEl), c = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, r = this.dom.getAttribute(b) || _, f = qt(u, o, r, c);
    this.toggleEl.style.top = f.top + "px", this.toggleEl.style.left = f.left + "px", this.toggleEl.setAttribute(v, f.placement);
  }, h.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const u = this;
    this._boundDocClick = function(o) {
      u.dom.contains(o.target) || u.toggleEl && u.toggleEl.contains(o.target) || u.toggleEl && u.toggleEl.getAttribute("data-ln-toggle") === "open" && u.toggleEl.setAttribute("data-ln-toggle", "close");
    }, u._docClickTimeout = setTimeout(function() {
      u._docClickTimeout = null, document.addEventListener("click", u._boundDocClick);
    }, 0);
  }, h.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, h.prototype._addScrollRepositionListener = function() {
    const u = this;
    this._boundScrollReposition = function() {
      u._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, h.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, h.prototype._addResizeCloseListener = function() {
    const u = this;
    this._boundResizeClose = function() {
      u.toggleEl && u.toggleEl.getAttribute("data-ln-toggle") === "open" && u.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, h.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, h.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute(v), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), L(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[a]);
  }, B(l, a, h, "ln-dropdown");
})();
(function() {
  const l = "data-ln-popover", a = "lnPopover", b = "data-ln-popover-for", v = "data-ln-popover-position";
  if (window[a] !== void 0) return;
  const _ = [];
  let h = null;
  function u() {
    h || (h = function(f) {
      if (f.key !== "Escape" || _.length === 0) return;
      _[_.length - 1].close();
    }, document.addEventListener("keydown", h));
  }
  function o() {
    _.length > 0 || h && (document.removeEventListener("keydown", h), h = null);
  }
  function c(f) {
    this.dom = f, this.isOpen = f.getAttribute(l) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const p = this;
    return this._onRequestOpen = function(m) {
      const y = m.detail && m.detail.trigger ? m.detail.trigger : null;
      p.open(y);
    }, this._onRequestClose = function() {
      p.close();
    }, this._onRequestToggle = function(m) {
      const y = m.detail && m.detail.trigger ? m.detail.trigger : null;
      p.toggle(y);
    }, f.addEventListener("ln-popover:request-open", this._onRequestOpen), f.addEventListener("ln-popover:request-close", this._onRequestClose), f.addEventListener("ln-popover:request-toggle", this._onRequestToggle), f.hasAttribute("tabindex") || f.setAttribute("tabindex", "-1"), f.hasAttribute("role") || f.setAttribute("role", "dialog"), f.hasAttribute("popover") || f.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  c.prototype.open = function(f) {
    this.isOpen || (this.trigger = f || null, this.dom.setAttribute(l, "open"));
  }, c.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(l, "closed");
  }, c.prototype.toggle = function(f) {
    this.isOpen ? this.close() : this.open(f);
  }, c.prototype._applyOpen = function(f) {
    this.isOpen = !0, f && (this.trigger = f), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const p = Ut(this.dom);
    if (this.trigger) {
      const s = this.trigger.getBoundingClientRect(), t = this.dom.getAttribute(v) || "bottom", e = qt(s, p, t, 8);
      this.dom.style.top = e.top + "px", this.dom.style.left = e.left + "px", this.dom.setAttribute("data-ln-popover-placement", e.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const m = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), y = Array.prototype.find.call(m, Lt);
    y ? y.focus() : this.dom.focus();
    const i = this;
    this._boundDocClick = function(s) {
      i.dom.contains(s.target) || i.trigger && i.trigger.contains(s.target) || i.close();
    }, i._docClickTimeout = setTimeout(function() {
      i._docClickTimeout = null, document.addEventListener("click", i._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!i.trigger) return;
      const s = i.trigger.getBoundingClientRect(), t = Ut(i.dom), e = i.dom.getAttribute(v) || "bottom", n = qt(s, t, e, 8);
      i.dom.style.top = n.top + "px", i.dom.style.left = n.left + "px", i.dom.setAttribute("data-ln-popover-placement", n.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), _.push(this), u(), L(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, c.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const f = _.indexOf(this);
    f !== -1 && _.splice(f, 1), o(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, L(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, c.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[a], L(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function r(f) {
    this.dom = f;
    const p = f.getAttribute(b);
    return f.setAttribute("aria-haspopup", "dialog"), f.setAttribute("aria-expanded", "false"), f.setAttribute("aria-controls", p), this._onClick = function(m) {
      if (m.ctrlKey || m.metaKey || m.button === 1) return;
      m.preventDefault();
      const y = document.getElementById(p);
      if (!y) return;
      y[a] && (y[a].trigger = f);
      const i = y.getAttribute(l);
      y.setAttribute(l, i === "open" ? "closed" : "open");
    }, f.addEventListener("click", this._onClick), this;
  }
  r.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[a + "Trigger"];
  }, B(l, a, c, "ln-popover", {
    onAttributeChange: function(f) {
      const p = f[a];
      if (!p) return;
      const y = f.getAttribute(l) === "open";
      if (y !== p.isOpen)
        if (y) {
          if (G(f, "ln-popover:before-open", {
            popoverId: f.id,
            target: f,
            trigger: p.trigger
          }).defaultPrevented) {
            f.setAttribute(l, "closed");
            return;
          }
          p._applyOpen(p.trigger);
        } else {
          if (G(f, "ln-popover:before-close", {
            popoverId: f.id,
            target: f,
            trigger: p.trigger
          }).defaultPrevented) {
            f.setAttribute(l, "open");
            return;
          }
          p._applyClose();
        }
    }
  }), B(b, a + "Trigger", r, "ln-popover-trigger");
})();
(function() {
  const l = "data-ln-tooltip-enhance", a = "data-ln-tooltip", b = "data-ln-tooltip-position", v = "lnTooltipEnhance", _ = "ln-tooltip-portal";
  if (window[v] !== void 0) return;
  let h = 0, u = null, o = null, c = null, r = null, f = null, p = null;
  function m() {
    return u && u.parentNode || (u = document.getElementById(_), u || (u = document.createElement("div"), u.id = _, document.body.appendChild(u)), u.hasAttribute("popover") || u.setAttribute("popover", "manual")), u;
  }
  function y() {
    p || (p = function(n) {
      n.key === "Escape" && t();
    }, document.addEventListener("keydown", p));
  }
  function i() {
    p && (document.removeEventListener("keydown", p), p = null);
  }
  function s(n) {
    if (c === n) return;
    t();
    const d = n.getAttribute(a) || n.getAttribute("title");
    if (!d) return;
    m(), typeof u.showPopover == "function" && u.showPopover(), n.hasAttribute("title") && (r = n.getAttribute("title"), n.removeAttribute("title"));
    const g = n.getAttribute("aria-describedby");
    g ? f = g : f = null;
    const E = document.createElement("div");
    E.className = "ln-tooltip", E.textContent = d, n[v + "Uid"] || (h += 1, n[v + "Uid"] = "ln-tooltip-" + h), E.id = n[v + "Uid"], u.appendChild(E);
    const w = E.offsetWidth, A = E.offsetHeight, S = n.getBoundingClientRect(), q = n.getAttribute(b) || "top", T = qt(S, { width: w, height: A }, q, 6);
    E.style.top = T.top + "px", E.style.left = T.left + "px", E.setAttribute("data-ln-tooltip-placement", T.placement), f ? n.setAttribute("aria-describedby", f + " " + E.id) : n.setAttribute("aria-describedby", E.id), o = E, c = n, y();
  }
  function t() {
    if (!o) {
      i();
      return;
    }
    c && (f !== null ? c.setAttribute("aria-describedby", f) : c.removeAttribute("aria-describedby"), f = null, r !== null && c.setAttribute("title", r)), r = null, o.parentNode && o.parentNode.removeChild(o), o = null, c = null, u && typeof u.hidePopover == "function" && u.matches(":popover-open") && u.hidePopover(), i();
  }
  function e(n) {
    return this.dom = n, n.hasAttribute("data-ln-tooltip-enhanced") || (n.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      s(n);
    }, this._onLeave = function() {
      c === n && !n.contains(document.activeElement) && t();
    }, this._onFocus = function() {
      s(n);
    }, this._onBlur = function() {
      c === n && !n.matches(":hover") && t();
    }, n.addEventListener("mouseenter", this._onEnter), n.addEventListener("mouseleave", this._onLeave), n.addEventListener("focus", this._onFocus, !0), n.addEventListener("blur", this._onBlur, !0), this;
  }
  e.prototype.destroy = function() {
    const n = this.dom;
    n.removeEventListener("mouseenter", this._onEnter), n.removeEventListener("mouseleave", this._onLeave), n.removeEventListener("focus", this._onFocus, !0), n.removeEventListener("blur", this._onBlur, !0), c === n && t(), this._addedEnhancedAttr && n.removeAttribute("data-ln-tooltip-enhanced"), delete n[v], delete n[v + "Uid"], L(n, "ln-tooltip:destroyed", { trigger: n });
  }, B(
    "[" + l + "], [data-ln-tooltip-enhanced], [" + a + "][title]",
    v,
    e,
    "ln-tooltip"
  );
})();
(function() {
  const l = "data-ln-toast", a = "lnToast", b = "ln-toast-item";
  if (window[a] !== void 0) return;
  function v(i) {
    if (!(!i || !(i instanceof HTMLElement)) && (i.hasAttribute("popover") || i.setAttribute("popover", "manual"), typeof i.showPopover == "function")) {
      if (i.matches(":popover-open"))
        try {
          i.hidePopover();
        } catch {
        }
      try {
        i.showPopover();
      } catch {
      }
    }
  }
  function _(i) {
    if (!i || !(i instanceof HTMLElement)) return;
    if (i.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof i.hidePopover == "function" && i.matches(":popover-open"))
      try {
        i.hidePopover();
      } catch {
      }
  }
  function h(i) {
    this.dom = i, i[a] = this, this.timeoutDefault = parseInt(i.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(i.getAttribute("data-ln-toast-max") || "5", 10);
    const s = Array.from(i.querySelectorAll("[data-ln-toast-item]"));
    for (; s.length > this.max; ) i.removeChild(s.shift());
    for (const t of s) p(t, this);
    return s.length > 0 && v(i), this;
  }
  h.prototype.enqueue = function(i) {
    if (!i) return;
    const s = u(i, this.dom);
    if (!s) return;
    const t = Number.isFinite(i.timeout) ? i.timeout : this.timeoutDefault;
    c(this, s), t > 0 && (s._timer = setTimeout(() => r(s), t));
  }, h.prototype.clear = function() {
    for (const i of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      r(i);
  }, h.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const i of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        r(i);
      _(this.dom), L(this.dom, "ln-toast:destroyed", { target: this.dom }), delete this.dom[a];
    }
  };
  function u(i, s) {
    const t = ((i.type || "") + "").trim().toLowerCase(), e = ct(s, b, "ln-toast");
    if (!e)
      return console.warn('[ln-toast] Template "' + b + '" not found'), null;
    et(e, {
      type: t,
      title: i.title,
      message: typeof i.message == "string" ? i.message : void 0
    });
    const n = e.firstElementChild;
    if (!n) return null;
    n.hasAttribute("data-ln-toast-item") || n.setAttribute("data-ln-toast-item", ""), n.classList.add("ln-enter");
    const d = n.querySelector(".body");
    d && o(d, i);
    const g = n.querySelector("[data-ln-toast-close]");
    return g && g.addEventListener("click", function() {
      r(n);
    }), n;
  }
  function o(i, s) {
    if (Array.isArray(s.message)) {
      const t = document.createElement("ul");
      for (const e of s.message) {
        const n = document.createElement("li");
        n.textContent = e, t.appendChild(n);
      }
      i.appendChild(t);
    }
    if (s.data && s.data.errors) {
      const t = document.createElement("ul");
      for (const e of Object.values(s.data.errors).flat()) {
        const n = document.createElement("li");
        n.textContent = e, t.appendChild(n);
      }
      i.appendChild(t);
    }
  }
  function c(i, s) {
    const t = Array.from(i.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; t.length >= i.max && t.length > 0; ) i.dom.removeChild(t.shift());
    i.dom.appendChild(s), v(i.dom), requestAnimationFrame(() => s.classList.remove("ln-enter"));
  }
  function r(i) {
    if (!i || !i.parentNode) return;
    const s = i.parentNode;
    clearTimeout(i._timer), i.classList.remove("ln-enter"), i.classList.add("ln-out"), setTimeout(() => {
      i.parentNode && (i.parentNode.removeChild(i), _(s));
    }, 200);
  }
  function f(i) {
    let s = i && i.container;
    return typeof s == "string" && (s = document.querySelector(s)), s instanceof HTMLElement || (s = document.querySelector("[" + l + "]") || document.getElementById("ln-toast-container")), s || null;
  }
  function p(i, s) {
    if (i._lnToastHydrated) return;
    i._lnToastHydrated = !0;
    const t = i.querySelector("[data-ln-toast-close]");
    t && t.addEventListener("click", function() {
      r(i);
    });
    const e = i.getAttribute("data-ln-toast-timeout"), n = e !== null ? parseInt(e, 10) : NaN, d = Number.isFinite(n) ? n : s.timeoutDefault;
    d > 0 && (i._timer = setTimeout(function() {
      r(i);
    }, d));
  }
  function m(i) {
    const s = i.detail || {}, t = f(s);
    if (!t) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (t[a] || (t[a] = new h(t))).enqueue(s);
  }
  function y(i) {
    const s = i && i.detail || {};
    if (s.container) {
      const t = f(s);
      t && (t[a] || (t[a] = new h(t))).clear();
    } else {
      const t = document.querySelectorAll("[" + l + "]");
      for (const e of Array.from(t))
        (e[a] || (e[a] = new h(e))).clear();
    }
  }
  lt(function() {
    window.addEventListener("ln-toast:enqueue", m), window.addEventListener("ln-toast:clear", y), window.addEventListener("ln-modal:open", function() {
      const i = document.querySelectorAll("[" + l + "]");
      for (const s of Array.from(i))
        s.querySelectorAll("[data-ln-toast-item]").length > 0 && v(s);
    });
  }, "ln-toast"), B(l, a, h, "ln-toast");
})();
(function() {
  const l = "data-ln-upload", a = "lnUpload", b = "data-ln-upload-dict", v = "data-ln-upload-accept", _ = "data-ln-upload-delete", h = "data-ln-upload-max-size", u = "data-ln-upload-max-files", o = "data-ln-upload-file-field", c = "data-ln-upload-ids-field", r = "file", f = "file_ids[]";
  if (window[a] !== void 0) return;
  function p(e) {
    return e ? e.split(",").map(function(n) {
      return n.trim().toLowerCase();
    }).filter(Boolean).map(function(n) {
      return n.startsWith(".") ? n.slice(1) : n;
    }) : null;
  }
  function m(e) {
    return !e || !e.includes(".") ? "" : e.split(".").pop().toLowerCase();
  }
  function y(e, n) {
    if (!n || n.length === 0) return !0;
    const d = m(e.name), g = (e.type || "").toLowerCase();
    return n.some(function(E) {
      if (E.includes("/")) {
        if (E.endsWith("/*")) {
          const w = E.slice(0, -1);
          return g.startsWith(w);
        }
        return g === E;
      }
      return d === E;
    });
  }
  function i(e, n, d) {
    if (typeof e != "number" || isNaN(e) || e === 0)
      return "0 " + (d["unit-b"] || "B");
    const g = 1024, E = [
      d["unit-b"] || "B",
      d["unit-kb"] || "KB",
      d["unit-mb"] || "MB",
      d["unit-gb"] || "GB"
    ], w = Math.floor(Math.log(e) / Math.log(g)), A = Math.min(w, E.length - 1), S = e / Math.pow(g, A);
    return new Intl.NumberFormat(n, {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0
    }).format(S) + " " + E[A];
  }
  function s() {
    const e = document.querySelector('meta[name="csrf-token"]');
    return e ? e.getAttribute("content") : "";
  }
  function t(e) {
    this.dom = e, this.dict = kt(e, b), this.locale = W(e), this.zone = e.querySelector("[data-ln-upload-zone]") || e, this.list = e.querySelector("[data-ln-upload-list]"), this.input = e.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', e), this.uploadUrl = e.getAttribute(l) || "", this.deleteUrlPattern = e.getAttribute(_) || "", this.fileFieldName = e.getAttribute(o) || r, this.idsFieldName = e.getAttribute(c) || f, this.maxSize = parseInt(e.getAttribute(h), 10) || 0, this.maxFiles = parseInt(e.getAttribute(u), 10) || 0;
    const n = e.getAttribute(v) || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = p(n), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  t.prototype._hydrate = function() {
    const e = this;
    if (!this.list) return;
    const n = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let g = 0; g < n.length; g++) {
      const E = n[g], w = E.getAttribute("data-ln-upload-id"), A = "file-" + ++e.fileIdCounter;
      E.setAttribute("data-ln-upload-local-id", A);
      const S = E.querySelector('[data-ln-field="name"]'), q = E.querySelector('[data-ln-field="sizeText"]'), T = E.getAttribute("data-ln-upload-size"), x = T ? parseInt(T, 10) : null;
      e.uploadedFiles.set(A, {
        serverId: w || null,
        name: S ? S.textContent.trim() : "",
        size: x !== null && !isNaN(x) ? x : q ? q.textContent.trim() : ""
      });
    }
    const d = this.dom.querySelectorAll('input[type="hidden"]');
    for (let g = 0; g < d.length; g++) {
      const E = d[g];
      if (E.name === e.idsFieldName && E.value && !Array.from(e.uploadedFiles.values()).some(function(A) {
        return String(A.serverId) === String(E.value);
      })) {
        const A = "file-" + ++e.fileIdCounter;
        e.uploadedFiles.set(A, {
          serverId: E.value,
          name: "",
          size: ""
        });
      }
    }
    this._syncHiddenInputs();
  }, t.prototype._syncHiddenInputs = function() {
    const e = this, n = this.dom.querySelectorAll('input[type="hidden"]');
    for (let d = 0; d < n.length; d++)
      n[d].name === e.idsFieldName && n[d].remove();
    for (const [, d] of this.uploadedFiles)
      if (d.serverId) {
        const g = document.createElement("input");
        g.type = "hidden", g.name = e.idsFieldName, g.value = d.serverId, e.dom.appendChild(g);
      }
  }, t.prototype._bindEvents = function() {
    const e = this;
    this._onZoneClick = function(n) {
      e.zone === e.dom && n.target.closest("[data-ln-upload-list], [data-ln-upload-action], input, button, a") || e.input && n.target !== e.input && e.input.click();
    }, this._onInputChange = function() {
      e.input && e.input.files && (e.upload(e.input.files), e.input.value = "");
    }, this._onDragEnter = function(n) {
      n.preventDefault(), n.stopPropagation(), e._dragDepth++, e.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragOver = function(n) {
      n.preventDefault(), n.stopPropagation(), e.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragLeave = function(n) {
      n.preventDefault(), n.stopPropagation(), e._dragDepth--, e._dragDepth <= 0 && (e._dragDepth = 0, e.zone.removeAttribute("data-ln-upload-state"));
    }, this._onDrop = function(n) {
      n.preventDefault(), n.stopPropagation(), e._dragDepth = 0, e.zone.removeAttribute("data-ln-upload-state"), n.dataTransfer && n.dataTransfer.files && e.upload(n.dataTransfer.files);
    }, this._onListClick = function(n) {
      const d = n.target.closest('[data-ln-upload-action="remove"]');
      if (!d || !e.list || !e.list.contains(d) || d.disabled) return;
      const g = d.closest("[data-ln-upload-item]");
      if (g) {
        const E = g.getAttribute("data-ln-upload-local-id");
        E && e.remove(E);
      }
    }, this._onRequestUpload = function(n) {
      n.detail && n.detail.files && e.upload(n.detail.files);
    }, this._onRequestRemove = function(n) {
      if (n.detail) {
        const d = n.detail.localId !== void 0 ? n.detail.localId : n.detail.serverId;
        d !== void 0 && e.remove(d);
      }
    }, this._onRequestClear = function() {
      e.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, t.prototype.upload = function(e) {
    const n = this, d = Array.from(e);
    for (let g = 0; g < d.length; g++) {
      const E = d[g];
      if (n.maxFiles > 0 && n.uploadedFiles.size >= n.maxFiles) {
        L(n.dom, "ln-upload:invalid", {
          file: E,
          reason: "max-files"
        });
        continue;
      }
      if (!y(E, n.allowedExts)) {
        L(n.dom, "ln-upload:invalid", {
          file: E,
          reason: "accept"
        });
        continue;
      }
      if (n.maxSize > 0 && E.size > n.maxSize) {
        L(n.dom, "ln-upload:invalid", {
          file: E,
          reason: "max-size"
        });
        continue;
      }
      G(n.dom, "ln-upload:before-upload", { file: E }).defaultPrevented || n._uploadSingleFile(E);
    }
  }, t.prototype._uploadSingleFile = function(e) {
    const n = this, d = "file-" + ++n.fileIdCounter, g = m(e.name);
    let E = null;
    if (this.list) {
      const T = ct(this.dom, "ln-upload-item", "ln-upload");
      if (T && (E = T.firstElementChild, E)) {
        E.setAttribute("data-ln-upload-item", ""), E.setAttribute("data-ln-upload-local-id", d), E.setAttribute("data-ln-upload-ext", g), E.setAttribute("data-ln-upload-state", "uploading"), et(E, {
          name: e.name,
          sizeText: "0%",
          removeLabel: n.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const x = E.querySelector('[data-ln-upload-action="remove"]');
        x && (x.disabled = !0);
        const k = E.querySelector("[data-ln-progress]");
        k && k.setAttribute("data-ln-progress", "0"), n.list.appendChild(E);
      }
    }
    const w = new FormData();
    w.append(n.fileFieldName, e);
    const A = this.dom.querySelectorAll("input, select, textarea");
    for (let T = 0; T < A.length; T++) {
      const x = A[T];
      !x.name || x.name === n.idsFieldName || x.type === "file" || (x.type === "checkbox" || x.type === "radio") && !x.checked || w.append(x.name, x.value);
    }
    const S = new XMLHttpRequest();
    n.uploadedFiles.set(d, {
      serverId: null,
      name: e.name,
      size: e.size,
      xhr: S
    }), S.upload.addEventListener("progress", function(T) {
      if (T.lengthComputable) {
        const x = Math.round(T.loaded / T.total * 100);
        if (E) {
          const k = E.querySelector("[data-ln-progress]");
          k && k.setAttribute("data-ln-progress", String(x)), et(E, { sizeText: x + "%" });
        }
        L(n.dom, "ln-upload:progress", {
          localId: d,
          file: e,
          percent: x,
          loaded: T.loaded,
          total: T.total
        });
      }
    }), S.addEventListener("load", function() {
      const T = n.uploadedFiles.get(d);
      if (T && delete T.xhr, S.status >= 200 && S.status < 300) {
        let x;
        try {
          x = JSON.parse(S.responseText);
        } catch (R) {
          q(n.dict.error || "Error", S.status, R);
          return;
        }
        const k = x.id || x.serverId;
        if (E) {
          E.removeAttribute("data-ln-upload-state"), k && E.setAttribute("data-ln-upload-id", String(k)), et(E, {
            sizeText: i(x.size || e.size, n.locale, n.dict),
            uploading: !1
          });
          const R = E.querySelector('[data-ln-upload-action="remove"]');
          R && (R.disabled = !1);
        }
        T && (T.serverId = k, T.size = x.size || e.size, T.name = x.name || e.name), n._syncHiddenInputs(), L(n.dom, "ln-upload:uploaded", {
          localId: d,
          serverId: k,
          name: x.name || e.name,
          size: x.size || e.size,
          response: x
        });
      } else {
        let x = "";
        try {
          x = JSON.parse(S.responseText).message || "";
        } catch {
        }
        q(x, S.status, null);
      }
    }), S.addEventListener("error", function() {
      const T = n.uploadedFiles.get(d);
      T && delete T.xhr, q("", 0, null);
    });
    function q(T, x, k) {
      if (E) {
        E.setAttribute("data-ln-upload-state", "error"), et(E, {
          sizeText: n.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const R = E.querySelector('[data-ln-upload-action="remove"]');
        R && (R.disabled = !1);
      }
      L(n.dom, "ln-upload:error", {
        file: e,
        message: T,
        status: x,
        error: k
      });
    }
    n.uploadUrl ? (S.open("POST", n.uploadUrl), S.setRequestHeader("X-CSRF-TOKEN", s()), S.setRequestHeader("X-Requested-With", "XMLHttpRequest"), S.setRequestHeader("Accept", "application/json"), S.send(w)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, t.prototype.remove = function(e) {
    const n = this;
    let d = null, g = null;
    if (n.uploadedFiles.has(e))
      d = e, g = n.uploadedFiles.get(e);
    else
      for (const [S, q] of n.uploadedFiles)
        if (String(q.serverId) === String(e)) {
          d = S, g = q;
          break;
        }
    if (!d || !g || G(n.dom, "ln-upload:before-remove", {
      localId: d,
      serverId: g.serverId
    }).defaultPrevented) return;
    const w = n.list ? n.list.querySelector('[data-ln-upload-local-id="' + d + '"]') : null;
    if (g.xhr && typeof g.xhr.abort == "function" && g.xhr.abort(), !g.serverId) {
      w && w.remove(), n.uploadedFiles.delete(d), n._syncHiddenInputs(), L(n.dom, "ln-upload:removed", { localId: d, serverId: null });
      return;
    }
    let A = null;
    if (n.deleteUrlPattern ? A = n.deleteUrlPattern.replace("{id}", encodeURIComponent(g.serverId)) : n.uploadUrl && n.uploadUrl.includes("{id}") && (A = n.uploadUrl.replace("{id}", encodeURIComponent(g.serverId))), !A) {
      w && w.remove(), n.uploadedFiles.delete(d), n._syncHiddenInputs(), L(n.dom, "ln-upload:removed", { localId: d, serverId: g.serverId });
      return;
    }
    w && (w.setAttribute("data-ln-upload-state", "deleting"), et(w, { deleting: !0 })), fetch(A, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": s(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(S) {
      S.ok ? (w && w.remove(), n.uploadedFiles.delete(d), n._syncHiddenInputs(), L(n.dom, "ln-upload:removed", {
        localId: d,
        serverId: g.serverId
      })) : (w && (w.removeAttribute("data-ln-upload-state"), et(w, { deleting: !1 })), L(n.dom, "ln-upload:error", {
        file: g,
        message: "",
        status: S.status
      }));
    }).catch(function(S) {
      w && (w.removeAttribute("data-ln-upload-state"), et(w, { deleting: !1 })), L(n.dom, "ln-upload:error", {
        file: g,
        message: "",
        status: 0,
        error: S
      });
    });
  }, t.prototype.clear = function() {
    const e = this;
    if (!G(e.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, d] of this.uploadedFiles)
        if (d.xhr && typeof d.xhr.abort == "function" && d.xhr.abort(), d.serverId) {
          let g = null;
          e.deleteUrlPattern ? g = e.deleteUrlPattern.replace("{id}", encodeURIComponent(d.serverId)) : e.uploadUrl && e.uploadUrl.includes("{id}") && (g = e.uploadUrl.replace("{id}", encodeURIComponent(d.serverId))), g && fetch(g, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": s(),
              "X-Requested-With": "XMLHttpRequest",
              Accept: "application/json"
            }
          }).catch(function() {
          });
        }
      e.uploadedFiles.clear(), e.list && (e.list.innerHTML = ""), e._syncHiddenInputs(), L(e.dom, "ln-upload:cleared", {});
    }
  }, t.prototype.getFileIds = function() {
    return Array.from(this.uploadedFiles.values()).map(function(e) {
      return e.serverId;
    }).filter(Boolean);
  }, t.prototype.getFiles = function() {
    return Array.from(this.uploadedFiles.values()).map(function(e) {
      return {
        serverId: e.serverId,
        name: e.name,
        size: e.size
      };
    });
  }, t.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const [, e] of this.uploadedFiles)
        e.xhr && typeof e.xhr.abort == "function" && e.xhr.abort();
      this.zone.removeEventListener("click", this._onZoneClick), this.input && this.input.removeEventListener("change", this._onInputChange), this.zone.removeEventListener("dragenter", this._onDragEnter), this.zone.removeEventListener("dragover", this._onDragOver), this.zone.removeEventListener("dragleave", this._onDragLeave), this.zone.removeEventListener("drop", this._onDrop), this.list && this.list.removeEventListener("click", this._onListClick), this.dom.removeEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.removeEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.removeEventListener("ln-upload:request-clear", this._onRequestClear), this.uploadedFiles.clear(), this.dict = {}, L(this.dom, "ln-upload:destroyed", { target: this.dom }), delete this.dom[a];
    }
  }, B(l, a, t, "ln-upload");
})();
(function() {
  const l = "lnExternalLinks";
  if (window[l] !== void 0) return;
  function a(o) {
    return o.hostname && o.hostname !== window.location.hostname;
  }
  function b(o) {
    if (o.getAttribute("data-ln-external-link") === "processed" || !a(o)) return;
    o.target = "_blank";
    const c = (o.rel || "").split(/\s+/).filter(Boolean);
    c.includes("noopener") || c.push("noopener"), c.includes("noreferrer") || c.push("noreferrer"), o.rel = c.join(" ");
    const r = document.createElement("span");
    r.className = "sr-only", r.textContent = "(opens in new tab)", o.appendChild(r), o.setAttribute("data-ln-external-link", "processed"), L(o, "ln-external-links:processed", {
      link: o,
      href: o.href
    });
  }
  function v(o) {
    o = o || document.body;
    for (const c of o.querySelectorAll("a, area"))
      b(c);
  }
  function _() {
    lt(function() {
      document.body.addEventListener("click", function(o) {
        const c = o.target.closest("a, area");
        c && c.getAttribute("data-ln-external-link") === "processed" && L(c, "ln-external-links:clicked", {
          link: c,
          href: c.href,
          text: c.textContent || c.title || ""
        });
      });
    }, "ln-external-links");
  }
  function h() {
    lt(function() {
      new MutationObserver(function(c) {
        for (const r of c) {
          if (r.type === "childList") {
            for (const f of r.addedNodes)
              if (f.nodeType === 1 && (f.matches && (f.matches("a") || f.matches("area")) && b(f), f.querySelectorAll))
                for (const p of f.querySelectorAll("a, area"))
                  b(p);
          }
          if (r.type === "attributes" && r.attributeName === "href") {
            const f = r.target;
            f.matches && (f.matches("a") || f.matches("area")) && b(f);
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
  function u() {
    _(), h(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      v();
    }) : v();
  }
  window[l] = {
    process: v
  }, u();
})();
(function() {
  const l = "data-ln-link", a = "lnLink";
  if (window[a] !== void 0) return;
  let b = null;
  function v() {
    b = document.createElement("div"), b.className = "ln-link-status", document.body.appendChild(b);
  }
  function _(e) {
    b && (b.textContent = e, b.classList.add("ln-link-status--visible"));
  }
  function h() {
    b && b.classList.remove("ln-link-status--visible");
  }
  function u(e, n) {
    if (n.target.closest("a, button, input, select, textarea")) return;
    const d = e.querySelector("a");
    if (!d) return;
    const g = d.getAttribute("href");
    if (!g) return;
    if (n.ctrlKey || n.metaKey || n.button === 1) {
      window.open(g, "_blank");
      return;
    }
    G(e, "ln-link:navigate", { target: e, href: g, link: d }).defaultPrevented || d.click();
  }
  function o(e) {
    const n = e.querySelector("a");
    if (!n) return;
    const d = n.getAttribute("href");
    d && _(d);
  }
  function c() {
    h();
  }
  function r(e) {
    e[a + "Row"] || !e.querySelector("a") || (e[a + "Row"] = !0, e._lnLinkClick = function(d) {
      u(e, d);
    }, e._lnLinkEnter = function() {
      o(e);
    }, e.addEventListener("click", e._lnLinkClick), e.addEventListener("mouseenter", e._lnLinkEnter), e.addEventListener("mouseleave", c));
  }
  function f(e) {
    e[a + "Row"] && (e._lnLinkClick && e.removeEventListener("click", e._lnLinkClick), e._lnLinkEnter && e.removeEventListener("mouseenter", e._lnLinkEnter), e.removeEventListener("mouseleave", c), delete e._lnLinkClick, delete e._lnLinkEnter, delete e[a + "Row"]);
  }
  function p(e) {
    if (!e[a + "Init"]) return;
    const n = e.tagName;
    if (n === "TABLE" || n === "TBODY") {
      const d = n === "TABLE" && e.querySelector("tbody") || e;
      for (const g of d.querySelectorAll("tr"))
        f(g);
    } else
      f(e);
    delete e[a + "Init"];
  }
  function m(e) {
    if (e[a + "Init"]) return;
    e[a + "Init"] = !0;
    const n = e.tagName;
    if (n === "TABLE" || n === "TBODY") {
      const d = n === "TABLE" && e.querySelector("tbody") || e;
      for (const g of d.querySelectorAll("tr"))
        r(g);
    } else
      r(e);
  }
  function y(e) {
    e.hasAttribute && e.hasAttribute(l) && m(e);
    const n = e.querySelectorAll ? e.querySelectorAll("[" + l + "]") : [];
    for (const d of n)
      m(d);
  }
  function i() {
    lt(function() {
      new MutationObserver(function(n) {
        for (const d of n)
          if (d.type === "childList") {
            for (const g of d.addedNodes)
              if (g.nodeType === 1) {
                y(g);
                const E = g.closest("[" + l + "]");
                if (E)
                  if (g.tagName === "TR")
                    r(g);
                  else {
                    const w = E.tagName;
                    if (w === "TABLE" || w === "TBODY") {
                      const A = g.querySelectorAll ? g.querySelectorAll("tr") : [];
                      for (const S of A)
                        r(S);
                    }
                  }
              }
          } else d.type === "attributes" && (d.target.hasAttribute && d.target.hasAttribute(l) ? y(d.target) : p(d.target));
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [l]
      });
    }, "ln-link");
  }
  function s(e) {
    y(e);
  }
  window[a] = { init: s, destroy: p };
  function t() {
    v(), i(), s(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t) : t();
})();
(function() {
  const l = "[data-ln-progress]", a = "lnProgress";
  if (window[a] !== void 0) return;
  function b(u) {
    return this.dom = u, this._attrObserver = null, this._parentObserver = null, h.call(this), v.call(this), _.call(this), this;
  }
  b.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[a]);
  };
  function v() {
    const u = this, o = new MutationObserver(function(c) {
      for (const r of c)
        (r.attributeName === "data-ln-progress" || r.attributeName === "data-ln-progress-max") && h.call(u);
    });
    o.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = o;
  }
  function _() {
    const u = this, o = this.dom.parentElement;
    if (!o) return;
    const c = new MutationObserver(function(r) {
      for (const f of r)
        f.attributeName === "data-ln-progress-max" && h.call(u);
    });
    c.observe(o, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = c;
  }
  function h() {
    const u = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, o = this.dom.parentElement, r = (o && o.hasAttribute("data-ln-progress-max") ? parseFloat(o.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let f = r > 0 ? u / r * 100 : 0;
    f < 0 && (f = 0), f > 100 && (f = 100), this.dom.style.width = f + "%";
    const p = Math.max(0, Math.min(u, r));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(r)), this.dom.setAttribute("aria-valuenow", String(p)), L(this.dom, "ln-progress:change", { target: this.dom, value: u, max: r, percentage: f });
  }
  B(
    l,
    a,
    b,
    "ln-progress"
  );
})();
(function() {
  const l = "data-ln-filter", a = "lnFilter", b = "data-ln-filter-key", v = "data-ln-filter-value", _ = "data-ln-filter-hide", h = "data-ln-filter-reset", u = "data-ln-filter-col", o = "data-ln-hash", c = /* @__PURE__ */ new WeakMap();
  if (window[a] !== void 0) return;
  function r(s) {
    return s.hasAttribute(h) || s.getAttribute(v) === "";
  }
  function f(s) {
    const t = s.dom.querySelectorAll("[" + b + "]");
    let e = null;
    const n = [];
    for (let d = 0; d < t.length; d++) {
      const g = t[d];
      if (e || (e = g.getAttribute(b)), g.checked && !r(g)) {
        const E = g.getAttribute(v);
        E && n.push(E);
      }
    }
    return { key: e, values: n, targetId: s.targetId };
  }
  function p(s, t, e) {
    const n = s.querySelectorAll("[" + b + "]"), d = Array.isArray(e) && e.length > 0;
    for (let g = 0; g < n.length; g++) {
      const E = n[g];
      r(E) ? E.checked = !d : d && E.getAttribute(b) === t && e.indexOf(E.getAttribute(v)) !== -1 ? E.checked = !0 : E.checked = !1;
    }
  }
  function m(s, t) {
    if (s.length !== t.length) return !0;
    for (let e = 0; e < s.length; e++) if (s[e] !== t[e]) return !0;
    return !1;
  }
  function y(s) {
    this.dom = s, this.targetId = s.getAttribute(l);
    const t = s.getAttribute(u);
    this.colIndex = t !== null ? parseInt(t, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = ft(s, "filter"), this.hashEnabled = !!this.nsKey;
    const e = this, n = Gt(
      function() {
        e._render();
      }
    );
    this._queueRender = n, this._attachHandlers(), this._onHashChange = function() {
      if (e._destroyed || !e.hashEnabled) return;
      const g = X(e.nsKey), E = Bt(g);
      E && E.key && E.values.length > 0 ? p(e.dom, E.key, E.values) : p(e.dom, null, []), e._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let d = !1;
    if (this.hashEnabled) {
      const g = X(this.nsKey), E = Bt(g);
      E && E.key && E.values.length > 0 && (p(s, E.key, E.values), nt(function() {
        e._destroyed || e._render();
      }), d = !0);
    }
    if (!d && s.hasAttribute("data-ln-persist")) {
      const g = It("filter", s);
      g && g.key && Array.isArray(g.values) && g.values.length > 0 && (p(s, g.key, g.values), nt(function() {
        e._destroyed || e._render();
      }), d = !0);
    }
    if (!d) {
      const g = s.querySelectorAll("[" + b + "]");
      for (let E = 0; E < g.length; E++)
        if (g[E].checked && !r(g[E])) {
          nt(function() {
            e._destroyed || e._render();
          });
          break;
        }
    }
    return this;
  }
  y.prototype._attachHandlers = function() {
    const s = this;
    this._onDomChange = function(t) {
      const e = t.target;
      if (!e || !e.hasAttribute || !e.hasAttribute(b)) return;
      const n = Array.from(s.dom.querySelectorAll("[" + b + "]"));
      if (r(e)) {
        for (let d = 0; d < n.length; d++)
          r(n[d]) || (n[d].checked = !1);
        e.checked = !0, s._queueRender();
        return;
      }
      if (e.checked) {
        for (let g = 0; g < n.length; g++)
          r(n[g]) && (n[g].checked = !1);
        let d = !1;
        for (let g = 0; g < n.length; g++)
          if (r(n[g])) {
            d = !0;
            break;
          }
        if (d) {
          let g = !0;
          for (let E = 0; E < n.length; E++)
            if (!r(n[E]) && !n[E].checked) {
              g = !1;
              break;
            }
          if (g)
            for (let E = 0; E < n.length; E++)
              r(n[E]) ? n[E].checked = !0 : n[E].checked = !1;
        }
      } else {
        let d = !1;
        for (let g = 0; g < n.length; g++)
          if (!r(n[g]) && n[g].checked) {
            d = !0;
            break;
          }
        if (!d)
          for (let g = 0; g < n.length; g++)
            r(n[g]) && (n[g].checked = !0);
      }
      s._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, y.prototype._render = function() {
    const s = this, t = f(this), e = this._lastSnapshot;
    if (!(!e || e.key !== t.key || m(e.values, t.values))) return;
    const d = t.key === null || t.values.length === 0, g = document.getElementById(s.targetId), E = {
      key: t.key,
      values: t.values.slice(),
      targetId: s.targetId
    };
    L(s.dom, "ln-filter:change", E);
    let w = !1;
    g && g !== s.dom && G(g, "ln-filter:change", E).defaultPrevented && (w = !0);
    const A = e && e.values.length > 0, S = t.values.length === 0;
    if (A && S) {
      const T = { targetId: s.targetId };
      L(s.dom, "ln-filter:reset", T), g && g !== s.dom && L(g, "ln-filter:reset", T);
    }
    if (this._lastSnapshot = { key: t.key, values: t.values.slice() }, this.dom.hasAttribute("data-ln-persist") && (t.key && t.values.length > 0 ? ht("filter", this.dom, { key: t.key, values: t.values.slice() }) : ht("filter", this.dom, null)), this.hashEnabled) {
      const T = Ae(t.key, t.values);
      J(this.nsKey, T);
    }
    if (w) return;
    const q = [];
    for (let T = 0; T < t.values.length; T++)
      q.push(t.values[T].toLowerCase());
    if (s.colIndex !== null)
      s._filterTableRows(t);
    else {
      if (!g) return;
      const T = g.children;
      for (let x = 0; x < T.length; x++) {
        const k = T[x];
        if (d) {
          k.removeAttribute(_);
          continue;
        }
        const R = k.getAttribute("data-" + t.key);
        k.removeAttribute(_), R !== null && q.indexOf(R.toLowerCase()) === -1 && k.setAttribute(_, "true");
      }
    }
  }, y.prototype._filterTableRows = function(s) {
    const t = document.getElementById(this.targetId);
    if (!t) return;
    const e = t.tagName === "TABLE" ? t : t.querySelector("table");
    if (!e) return;
    const n = s.key || this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex, d = s.values;
    c.has(e) || c.set(e, {});
    const g = c.get(e);
    if (n && d.length > 0) {
      const S = [];
      for (let q = 0; q < d.length; q++)
        S.push(d[q].toLowerCase());
      g[n] = { col: this.colIndex, values: S };
    } else n && delete g[n];
    const E = Object.keys(g), w = E.length > 0, A = e.tBodies;
    for (let S = 0; S < A.length; S++) {
      const q = A[S].rows;
      for (let T = 0; T < q.length; T++) {
        const x = q[T];
        if (!w) {
          x.removeAttribute(_);
          continue;
        }
        let k = !0;
        for (let R = 0; R < E.length; R++) {
          const N = g[E[R]], z = x.cells[N.col], H = z ? z.textContent.trim().toLowerCase() : "";
          if (N.values.indexOf(H) === -1) {
            k = !1;
            break;
          }
        }
        k ? x.removeAttribute(_) : x.setAttribute(_, "true");
      }
    }
  }, y.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this._destroyed = !0, this.colIndex !== null) {
        const s = document.getElementById(this.targetId);
        if (s) {
          const t = s.tagName === "TABLE" ? s : s.querySelector("table");
          if (t && c.has(t)) {
            const e = c.get(t), n = this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex;
            n && e[n] && delete e[n], Object.keys(e).length === 0 && c.delete(t);
          }
        }
      }
      this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[a];
    }
  };
  function i(s, t) {
    const e = s[a];
    !e || e._destroyed || t === o && (e.hashEnabled && e._onHashChange && window.removeEventListener("hashchange", e._onHashChange), e.nsKey = ft(s, "filter"), e.hashEnabled = !!e.nsKey, e.hashEnabled && window.addEventListener("hashchange", e._onHashChange));
  }
  B(l, a, y, "ln-filter", {
    extraAttributes: [o],
    onAttributeChange: i
  });
})();
(function() {
  const l = "data-ln-search", a = "lnSearch", b = "data-ln-search-for", v = "lnSearchControl", _ = "data-ln-search-items", h = "data-ln-search-fields", u = "data-ln-search-exclude", o = "data-ln-search-hide", c = "data-ln-hash";
  if (window[a] !== void 0) return;
  function f(w) {
    const A = ft(w, "search");
    if (A) return A;
    if (w.id) {
      const S = document.querySelector("[" + b + '="' + w.id + '"]');
      if (S) {
        const q = ft(S, "search");
        if (q) return q;
      }
    }
    return null;
  }
  function p(w) {
    return (w || "").trim().toLowerCase();
  }
  function m(w) {
    return w ? w.split(/\s+/).filter(Boolean) : [];
  }
  function y(w) {
    const A = w.tagName;
    return A === "INPUT" || A === "TEXTAREA" ? w : w.querySelector('[name="search"]') || w.querySelector('input[type="search"]') || w.querySelector('input[type="text"]');
  }
  function i(w) {
    const A = w.getAttribute(h);
    if (A === null) return null;
    const S = A.split(",").map(function(q) {
      return q.trim();
    }).filter(Boolean);
    return S.length ? S : null;
  }
  function s(w, A) {
    const S = w.childNodes;
    for (let q = 0; q < S.length; q++) {
      const T = S[q];
      if (T.nodeType === 3) {
        A.push(T.nodeValue);
        continue;
      }
      T.nodeType === 1 && (T.hasAttribute(u) || s(T, A));
    }
  }
  function t(w) {
    if (w._lnSearchText !== void 0) return w._lnSearchText;
    const A = [];
    s(w, A);
    const S = A.join(" ").replace(/\s+/g, " ").toLowerCase();
    return w._lnSearchText = S, S;
  }
  function e(w, A) {
    if (!w.id) return;
    const S = document.querySelectorAll("[" + b + '="' + w.id + '"]');
    for (const q of S) {
      const T = q[v];
      T && clearTimeout(T._debounceTimer);
      const x = y(q);
      x && x.value !== A && (x.value = A);
    }
  }
  function n(w) {
    this.dom = w, this.term = w.getAttribute(l) || "", this._destroyed = !1;
    const A = this;
    return this.nsKey = f(w), this.hashEnabled = !!this.nsKey, this._observer = new MutationObserver(function(S) {
      for (let q = 0; q < S.length; q++) {
        const T = S[q];
        if (T.type === "childList" || T.type === "characterData") {
          const x = T.target;
          if (x && x._lnSearchText !== void 0 && delete x._lnSearchText, x && x.parentElement && x.parentElement._lnSearchText !== void 0 && delete x.parentElement._lnSearchText, T.addedNodes)
            for (let k = 0; k < T.addedNodes.length; k++) {
              const R = T.addedNodes[k];
              R._lnSearchText !== void 0 && delete R._lnSearchText;
            }
        }
      }
    }), this._observer.observe(w, { childList: !0, subtree: !0, characterData: !0 }), this._onHashChange = function() {
      if (A._destroyed || !A.hashEnabled) return;
      const S = X(A.nsKey), q = A.dom.getAttribute(l) || "";
      S !== null && S !== q ? A.dom.setAttribute(l, S) : S === null && q !== "" && A.dom.setAttribute(l, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), nt(function() {
      if (!A._destroyed) {
        if (A.hashEnabled) {
          const S = X(A.nsKey);
          if (S !== null && S !== A.term) {
            A.term = S, A.dom.setAttribute(l, S), e(A.dom, S), A._apply();
            return;
          }
        }
        p(A.term) && (e(A.dom, A.term), A._apply());
      }
    }), this;
  }
  n.prototype._apply = function() {
    const w = this.dom, A = p(this.term), S = m(A);
    if (this.hashEnabled && J(this.nsKey, this.term ? this.term : null), G(w, "ln-search:change", {
      term: A,
      tokens: S,
      targetId: w.id,
      fields: i(w)
    }).defaultPrevented) return;
    const T = w.getAttribute(_), x = T ? w.querySelectorAll(T) : w.children;
    for (let k = 0; k < x.length; k++) {
      const R = x[k];
      if (R.removeAttribute(o), R.hasAttribute(u) || S.length === 0) continue;
      const N = t(R);
      for (let z = 0; z < S.length; z++)
        if (N.indexOf(S[z]) === -1) {
          R.setAttribute(o, "true");
          break;
        }
    }
  }, n.prototype.destroy = function() {
    this.dom[a] && (this._destroyed = !0, this._observer && (this._observer.disconnect(), this._observer = null), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[a]);
  };
  function d(w) {
    this.dom = w, this.targetId = w.getAttribute(b), this.input = y(w);
    const A = w.getAttribute("data-ln-search-debounce");
    if (this.debounceTime = A !== null ? parseInt(A, 10) : 500, isNaN(this.debounceTime) && (this.debounceTime = 500), this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const S = this;
      nt(function() {
        const q = document.getElementById(S.targetId);
        q && ((q.getAttribute(l) || "").trim() || S._write(S.input.value));
      });
    }
    return this;
  }
  d.prototype._write = function(w) {
    const A = document.getElementById(this.targetId);
    A && A.setAttribute(l, w);
  }, d.prototype._attachHandler = function() {
    if (!this.input) return;
    const w = this;
    this._onInput = function() {
      clearTimeout(w._debounceTimer), w._debounceTimer = setTimeout(function() {
        w._write(w.input.value);
      }, w.debounceTime);
    }, this.input.addEventListener("input", this._onInput);
  }, d.prototype.destroy = function() {
    this.dom[v] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[v]);
  };
  function g(w) {
    const A = w.getAttribute("data-ln-search-clear-for");
    if (A) {
      const x = document.getElementById(A), k = document.querySelector("[" + b + '="' + A + '"]'), R = k ? y(k) : null;
      return { target: x, input: R };
    }
    const S = w.closest("[" + l + "]");
    if (S) {
      const x = S.id ? document.querySelector("[" + b + '="' + S.id + '"]') : null, k = x ? y(x) : null;
      return { target: S, input: k };
    }
    const q = w.closest("[" + b + "]");
    if (q) {
      const x = q.getAttribute(b), k = x ? document.getElementById(x) : null, R = y(q);
      return { target: k, input: R };
    }
    const T = w.parentElement;
    if (T) {
      const x = T.querySelector("[" + b + "]");
      if (x) {
        const k = x.getAttribute(b), R = k ? document.getElementById(k) : null, N = y(x);
        return { target: R, input: N };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(w) {
    const A = w.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!A) return;
    const S = g(A);
    if (!(!S.target && !S.input)) {
      if (w.preventDefault(), S.input) {
        const T = (S.input.closest("[" + b + "]") || S.input)[v];
        T && clearTimeout(T._debounceTimer), S.input.value = "", S.input.focus();
      }
      S.target && S.target.setAttribute(l, "");
    }
  });
  function E(w, A) {
    const S = w[a];
    if (!S || S._destroyed) return;
    if (A === c) {
      S.hashEnabled && S._onHashChange && window.removeEventListener("hashchange", S._onHashChange), S.nsKey = f(w), S.hashEnabled = !!S.nsKey, S.hashEnabled && window.addEventListener("hashchange", S._onHashChange);
      return;
    }
    const q = w.getAttribute(l) || "";
    q !== S.term && (S.term = q, e(w, q), S._apply());
  }
  B(l, a, n, "ln-search", {
    extraAttributes: [c],
    onAttributeChange: E
  }), B(b, v, d, "ln-search-control");
})();
(function() {
  const l = "data-ln-sort", a = "lnSort", b = "data-ln-sort-field", v = "data-ln-sort-state", _ = "data-ln-sort-dir", h = "data-ln-sort-items", u = "data-ln-hash";
  if (window[a] !== void 0) return;
  const o = /* @__PURE__ */ new WeakMap();
  function c(p, m) {
    if (m) {
      const y = p.querySelector('[data-ln-field="' + m + '"]');
      if (y) return _t(y);
    }
    return _t(p);
  }
  function r(p) {
    this.dom = p, this.targetId = p.getAttribute(l), this.field = p.getAttribute(b) || null;
    const m = p.closest("th");
    this.column = !this.field && m ? m.cellIndex : null, this.itemsSelector = p.getAttribute(h) || null, this._state = p.getAttribute(v) || "none", this._destroyed = !1, this.nsKey = ft(p, "sort"), this.hashEnabled = !!this.nsKey;
    const y = this;
    this._onClick = function(s) {
      const t = s.target.closest("[" + _ + "]");
      if (!t) return;
      const e = t.getAttribute(_);
      y._apply(e);
    }, p.addEventListener("click", this._onClick), this._onSortChange = function(s) {
      if (y._destroyed || !s.detail) return;
      const t = y._resolveTarget();
      if (!(t && (s.target === t || t.contains(s.target)) || s.detail.targetId && s.detail.targetId === y.targetId)) return;
      if (y.field !== null && s.detail.field === y.field || y.column !== null && s.detail.column === y.column) {
        s.detail.direction && p.getAttribute(v) !== s.detail.direction && (y._state = s.detail.direction, p.setAttribute(v, s.detail.direction), y._updateAriaSort(s.detail.direction));
        return;
      }
      p.getAttribute(v) !== "none" && (y._state = "none", p.setAttribute(v, "none"), y._updateAriaSort("none")), p.hasAttribute("data-ln-persist") && ht("sort", p, null);
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (y._destroyed || !y.hashEnabled) return;
      const s = X(y.nsKey), t = Ht(s);
      if (t)
        y.field !== null && t.fieldOrColumn === y.field || y.column !== null && String(y.column) === t.fieldOrColumn ? y._state !== t.direction && y._apply(t.direction, !0) : y._state !== "none" && (y._state = "none", p.setAttribute(v, "none"), y._updateAriaSort("none"));
      else if (y._state !== "none") {
        y._state = "none", p.setAttribute(v, "none"), y._updateAriaSort("none");
        const e = y._resolveTarget();
        e && (G(e, "ln-sort:change", {
          field: y.field,
          column: y.column,
          direction: "none",
          targetId: y.targetId
        }).defaultPrevented || y._defaultSort(e, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let i = !1;
    if (this.hashEnabled) {
      const s = X(this.nsKey), t = Ht(s);
      t && ((y.field !== null && t.fieldOrColumn === y.field || y.column !== null && String(y.column) === t.fieldOrColumn) && nt(function() {
        y._destroyed || y._apply(t.direction, !0);
      }), i = !0);
    }
    if (!i && p.hasAttribute("data-ln-persist")) {
      const s = It("sort", p);
      s && s.direction && s.direction !== "none" && nt(function() {
        y._destroyed || y._apply(s.direction, !0);
      }), i = !0;
    }
    if (!i) {
      const s = p.getAttribute(v);
      s && (s === "asc" || s === "desc") && nt(function() {
        y._destroyed || y._apply(s, !0);
      });
    }
    return this;
  }
  r.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, r.prototype._updateAriaSort = function(p) {
    const m = this.dom.closest("th");
    m && (p === "asc" ? m.setAttribute("aria-sort", "ascending") : p === "desc" ? m.setAttribute("aria-sort", "descending") : m.setAttribute("aria-sort", "none"));
  }, r.prototype._apply = function(p, m) {
    if (this._destroyed) return;
    this._state = p, this.dom.getAttribute(v) !== p && this.dom.setAttribute(v, p), this._updateAriaSort(p);
    const y = this._resolveTarget();
    if (!y) return;
    const i = {
      field: this.field,
      column: this.column,
      direction: p,
      targetId: this.targetId
    };
    if (!m && (this.dom.hasAttribute("data-ln-persist") && ht("sort", this.dom, p === "none" ? null : i), this.hashEnabled)) {
      const t = Ee(this.field !== null ? this.field : this.column, p);
      J(this.nsKey, t);
    }
    G(y, "ln-sort:change", i).defaultPrevented || this._defaultSort(y, p);
  }, r.prototype._defaultSort = function(p, m) {
    const y = this.itemsSelector ? Array.from(p.querySelectorAll(this.itemsSelector)) : Array.from(p.children);
    if (!y.length) return;
    const i = y[0].parentNode;
    o.has(p) || o.set(p, y.slice());
    let s;
    if (m === "none")
      s = (o.get(p) || y).filter(function(n) {
        return n.parentNode === i;
      });
    else {
      const e = this.field, n = y.map(function(w) {
        return c(w, e);
      }), d = yt(n), g = typeof Intl < "u" ? new Intl.Collator(W(this.dom), { sensitivity: "base" }) : null, E = m === "desc" ? -1 : 1;
      s = y.slice().sort(function(w, A) {
        return vt(c(w, e), c(A, e), d, g) * E;
      });
    }
    const t = document.createDocumentFragment();
    for (let e = 0; e < s.length; e++) t.appendChild(s[e]);
    i.appendChild(t);
  }, r.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[a]);
  };
  function f(p, m) {
    const y = p[a];
    if (!(!y || y._destroyed))
      if (m === b) {
        y.field = p.getAttribute(b) || null;
        const i = p.closest("th");
        y.column = !y.field && i ? i.cellIndex : null;
      } else if (m === h)
        y.itemsSelector = p.getAttribute(h) || null;
      else if (m === v) {
        const i = p.getAttribute(v) || "none";
        i !== y._state && y._apply(i);
      } else m === l ? y.targetId = p.getAttribute(l) : m === u && (y.hashEnabled && y._onHashChange && window.removeEventListener("hashchange", y._onHashChange), y.nsKey = ft(p, "sort"), y.hashEnabled = !!y.nsKey, y.hashEnabled && window.addEventListener("hashchange", y._onHashChange));
  }
  B(l, a, r, "ln-sort", {
    extraAttributes: [b, h, v, u],
    onAttributeChange: f
  });
})();
(function() {
  const l = "data-ln-table", a = "lnTable", b = "data-ln-table-empty";
  if (window[a] !== void 0) return;
  const c = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function r(i, s) {
    if (i == null || isNaN(i)) return "";
    try {
      return new Intl.NumberFormat(W(s)).format(i);
    } catch {
      return String(i);
    }
  }
  function f(i) {
    let s = i.parentElement;
    for (; s && s !== document.body && s !== document.documentElement; ) {
      const e = getComputedStyle(s).overflowY;
      if (e === "auto" || e === "scroll") return s;
      s = s.parentElement;
    }
    return null;
  }
  function p(i) {
    const s = i._scrollContainer || f(i.dom);
    return {
      container: s,
      top: s ? s.scrollTop : window.scrollY
    };
  }
  function m(i) {
    i.container ? i.container.scrollTop = i.top : window.scrollTo(window.scrollX, i.top);
  }
  function y(i) {
    this.dom = i, this.table = i.querySelector("table"), this.tbody = i.querySelector("[data-ln-table-body]") || i.querySelector("tbody"), this.thead = i.querySelector("thead");
    const s = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = s ? Array.from(s.querySelectorAll("th")) : [], this._totalSpan = i.querySelector("[data-ln-table-total]"), this._filteredSpan = i.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== i ? this._filteredSpan.parentElement : null), this._selectedSpan = i.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== i ? this._selectedSpan.parentElement : null), this.isDataDriven = i.hasAttribute("data-ln-table-source"), this.name = i.getAttribute(l) || "", this.source = i.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
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
      const d = n.getAttribute("data-ln-table-row-id"), g = n._lnRecord || {};
      L(i, "ln-table:row-click", {
        table: t.name,
        id: d,
        record: g
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(e) {
      const n = e.target.closest("[data-ln-table-row-action]");
      if (!n) return;
      e.stopPropagation();
      const d = n.closest("[data-ln-table-row]");
      if (!d) return;
      const g = n.getAttribute("data-ln-table-row-action"), E = d.getAttribute("data-ln-table-row-id"), w = d._lnRecord || {};
      L(i, "ln-table:row-action", {
        table: t.name,
        id: E,
        action: g,
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
              const d = n[t._focusedRowIndex];
              L(i, "ln-table:row-click", {
                table: t.name,
                id: d.getAttribute("data-ln-table-row-id"),
                record: d._lnRecord || {}
              });
            }
            break;
          case " ":
            if (t._selectable && t._focusedRowIndex >= 0 && t._focusedRowIndex < n.length) {
              e.preventDefault();
              const d = n[t._focusedRowIndex].querySelector("[data-ln-table-row-select]");
              d && (d.checked = !d.checked, d.dispatchEvent(new Event("change", { bubbles: !0 })));
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
      const n = e.detail.key, d = e.detail.values || [];
      if (n) {
        if (d.length === 0)
          delete t._columnFilters[n];
        else {
          const g = [];
          for (let E = 0; E < d.length; E++)
            g.push(d[E].toLowerCase());
          t._columnFilters[n] = g;
        }
        t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter(), L(i, "ln-table:filter", {
          term: t._searchTerm,
          matched: t._filteredData.length,
          total: t._data.length
        });
      }
    }, i.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  y.prototype._parseRows = function() {
    const i = this.tbody.rows, s = this.ths;
    this._data = [], i.length > 0 && (this._rowHeight = i[0].offsetHeight || 40), this._lockColumnWidths();
    for (let t = 0; t < i.length; t++) {
      const e = i[t], n = [], d = [], g = [];
      for (let w = 0; w < e.cells.length; w++) {
        const A = e.cells[w], S = A.textContent.trim();
        n[w] = _t(A), d[w] = S.toLowerCase(), A.querySelector("[data-ln-table-row-action]") || g.push(S.toLowerCase());
      }
      let E = null;
      if (this.isDataDriven) {
        E = {};
        const w = e.getAttribute("data-ln-table-row-id");
        w != null && (E.id = w);
        for (let A = 0; A < s.length; A++) {
          const S = s[A].getAttribute("data-ln-table-col");
          if (S) {
            const q = A;
            if (q < e.cells.length) {
              const T = e.cells[q];
              E[S] = _t(T);
            }
          }
        }
      }
      this._data.push({
        values: n,
        rawTexts: d,
        html: e.outerHTML,
        searchText: g.join(" "),
        id: this.isDataDriven && E ? E.id : void 0,
        ...E
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, y.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const i = (this.currentSearch || "").trim().toLowerCase(), s = i ? i.split(/\s+/).filter(Boolean) : [], t = this.currentFilters || {}, e = Object.keys(t).length > 0;
      if (this._filteredData = this._data.filter(function(A) {
        if (s.length > 0 && !s.every(function(q) {
          for (const T in A)
            if (A.hasOwnProperty(T) && typeof A[T] == "string" && T !== "html" && T !== "searchText" && A[T].toLowerCase().indexOf(q) !== -1)
              return !0;
          return !1;
        }))
          return !1;
        if (e)
          for (const S in t) {
            const q = t[S];
            if (q && q.length > 0) {
              const T = A[S], x = T != null ? String(T) : "";
              if (q.indexOf(x) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const n = this.currentSort.field, g = this.currentSort.direction === "desc" ? -1 : 1, E = this._filteredData.map(function(A) {
        return A[n];
      }), w = yt(E);
      this._filteredData.sort(function(A, S) {
        return vt(A[n], S[n], w, c) * g;
      });
    } else {
      const i = this._searchTerm, s = i ? i.split(/\s+/).filter(Boolean) : [], t = this._columnFilters, e = Object.keys(t).length > 0, n = this.ths, d = {};
      if (e)
        for (let S = 0; S < n.length; S++) {
          const q = n[S].getAttribute("data-ln-table-filter-col");
          q && (d[q] = S);
        }
      if (s.length === 0 && !e ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(S) {
        if (s.length > 0 && !s.every(function(T) {
          return S.searchText.indexOf(T) !== -1;
        }))
          return !1;
        if (e)
          for (const q in t) {
            const T = d[q];
            if (T !== void 0 && t[q].indexOf(S.rawTexts[T]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const g = this._sortCol, E = this._sortDir === "desc" ? -1 : 1, w = this._filteredData.map(function(S) {
        return S.values[g];
      }), A = yt(w);
      this._filteredData.sort(function(S, q) {
        return vt(S.values[g], q.values[g], A, c) * E;
      });
    }
  }, y.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const i = document.createElement("colgroup");
    this.ths.forEach(function(s) {
      const t = document.createElement("col");
      t.style.width = s.offsetWidth + "px", i.appendChild(t);
    }), this.table.insertBefore(i, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = i;
  }, y.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const i = this._lastTotal, s = this.visibleCount;
        if (i === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || s === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const i = this._filteredData.length;
        i === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : i > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, y.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const i = this._filteredData, s = document.createDocumentFragment();
      for (let e = 0; e < i.length; e++) {
        const n = this._buildRow(i[e]);
        if (!n) break;
        s.appendChild(n);
      }
      const t = p(this);
      this.tbody.textContent = "", this.tbody.appendChild(s), m(t), this._selectable && this._updateSelectAll();
    } else {
      const i = [], s = this._filteredData;
      for (let e = 0; e < s.length; e++) i.push(s[e].html);
      const t = p(this);
      this.tbody.innerHTML = i.join(""), m(t), this._selectable && this._restoreSelection();
    }
  }, y.prototype._enableVirtualScroll = function() {
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
    this.isDataDriven ? this._scrollContainer = f(this.dom) : this._scrollContainer = null;
    const s = this._scrollContainer || window;
    this._scrollHandler = function() {
      i._rafId || (i._rafId = requestAnimationFrame(function() {
        i._rafId = null, i._windowed ? i._renderWindowed() : i._renderVirtual();
      }));
    }, s.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, y.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, y.prototype._renderVirtual = function() {
    const i = this._filteredData, s = i.length, t = this._rowHeight;
    if (!t || !s) return;
    const e = this.thead ? this.thead.offsetHeight : 0, n = this._scrollContainer;
    let d, g;
    if (n) {
      const T = this.table.getBoundingClientRect(), x = n.getBoundingClientRect(), k = T.top - x.top + n.scrollTop + e;
      d = n.scrollTop - k, g = n.clientHeight;
    } else {
      const k = this.table.getBoundingClientRect().top + window.scrollY + e;
      d = window.scrollY - k, g = window.innerHeight;
    }
    let E = Math.max(0, Math.floor(d / t) - 15);
    E = Math.min(E, s);
    const w = Math.min(E + Math.ceil(g / t) + 30, s);
    if (E === this._vStart && w === this._vEnd) return;
    this._vStart = E, this._vEnd = w;
    const A = this.ths.length || 1, S = E * t, q = (s - w) * t;
    if (this.isDataDriven) {
      const T = document.createDocumentFragment();
      if (S > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const R = document.createElement("td");
        R.setAttribute("colspan", A), R.style.height = S + "px", k.appendChild(R), T.appendChild(k);
      }
      for (let k = E; k < w; k++) {
        const R = this._buildRow(i[k]);
        R && T.appendChild(R);
      }
      if (q > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const R = document.createElement("td");
        R.setAttribute("colspan", A), R.style.height = q + "px", k.appendChild(R), T.appendChild(k);
      }
      const x = p(this);
      this.tbody.textContent = "", this.tbody.appendChild(T), m(x), this._selectable && this._updateSelectAll();
    } else {
      let T = "";
      S > 0 && (T += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + A + '" style="height:' + S + 'px;padding:0;border:none"></td></tr>');
      for (let k = E; k < w; k++) T += i[k].html;
      q > 0 && (T += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + A + '" style="height:' + q + 'px;padding:0;border:none"></td></tr>');
      const x = p(this);
      this.tbody.innerHTML = T, m(x), this._selectable && this._restoreSelection();
    }
  }, y.prototype._buildPlaceholderRow = function() {
    const i = document.createElement("tr");
    i.className = "ln-table__placeholder", i.setAttribute("aria-hidden", "true");
    const s = document.createElement("td");
    return s.setAttribute("colspan", this.ths.length || 1), s.style.height = this._rowHeight + "px", i.appendChild(s), i;
  }, y.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const i = this._rowHeight;
    if (!i) return;
    const s = this._cache.logicalTotal, t = this.thead ? this.thead.offsetHeight : 0, e = this._scrollContainer;
    let n, d;
    if (e) {
      const x = this.table.getBoundingClientRect(), k = e.getBoundingClientRect(), R = x.top - k.top + e.scrollTop + t;
      n = e.scrollTop - R, d = e.clientHeight;
    } else {
      const R = this.table.getBoundingClientRect().top + window.scrollY + t;
      n = window.scrollY - R, d = window.innerHeight;
    }
    let g = Math.max(0, Math.floor(n / i) - 15);
    g = Math.min(g, s);
    const E = Math.min(g + Math.ceil(d / i) + 30, s), w = this.ths.length || 1, A = g * i, S = (s - E) * i, q = document.createDocumentFragment();
    if (A > 0) {
      const x = document.createElement("tr");
      x.className = "ln-table__spacer", x.setAttribute("aria-hidden", "true");
      const k = document.createElement("td");
      k.setAttribute("colspan", w), k.style.height = A + "px", x.appendChild(k), q.appendChild(x);
    }
    for (let x = g; x < E; x++)
      if (this._cache.has(x)) {
        const k = this._buildRow(this._cache.get(x));
        k && q.appendChild(k);
      } else
        q.appendChild(this._buildPlaceholderRow());
    if (S > 0) {
      const x = document.createElement("tr");
      x.className = "ln-table__spacer", x.setAttribute("aria-hidden", "true");
      const k = document.createElement("td");
      k.setAttribute("colspan", w), k.style.height = S + "px", x.appendChild(k), q.appendChild(x);
    }
    const T = p(this);
    this.tbody.textContent = "", this.tbody.appendChild(q), m(T), this._vStart = g, this._vEnd = E, this._cache.ensure(g, E);
  }, y.prototype._showEmptyState = function() {
    const i = this.ths.length || 1;
    this.tbody.textContent = "";
    let s = null;
    if (this.isDataDriven) {
      const t = this._lastTotal != null ? this._lastTotal : this._data.length, n = this.visibleCount === 0 && t > 0, d = n ? this.name + "-empty-filtered" : this.name + "-empty";
      if (s = ct(this.dom, d, "ln-table"), !s) {
        const g = this.dom.querySelector("template[data-ln-table-empty]");
        if (g) {
          const E = n ? "search" : "initial", w = g.content.querySelector('[data-ln-table-empty-when="' + E + '"]') || g.content.firstElementChild;
          w && (s = document.importNode(w, !0));
        }
      }
      if (s)
        if (s.tagName === "TR")
          this.tbody.appendChild(s);
        else {
          const g = document.createElement("td");
          g.setAttribute("colspan", String(i)), g.appendChild(s);
          const E = document.createElement("tr");
          E.className = "ln-table__empty", E.appendChild(g), this.tbody.appendChild(E);
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
  }, y.prototype._fillRow = function(i, s) {
    At(i, s);
    const t = i.querySelectorAll("[data-ln-table-cell-attr]");
    for (let e = 0; e < t.length; e++) {
      const n = t[e], d = n.getAttribute("data-ln-table-cell-attr").split(",");
      for (let g = 0; g < d.length; g++) {
        const E = d[g].trim().split(":");
        if (E.length !== 2) continue;
        const w = E[0].trim(), A = E[1].trim();
        s[w] != null && n.setAttribute(A, s[w]);
      }
    }
  }, y.prototype._buildRow = function(i) {
    const s = ct(this.dom, this.name + "-row", "ln-table");
    if (!s) return null;
    const t = s.querySelector("[data-ln-table-row]") || s.firstElementChild;
    if (!t) return null;
    if (this._fillRow(t, i), t._lnRecord = i, i.id != null && t.setAttribute("data-ln-table-row-id", i.id), this._selectable && i.id != null && this.selectedIds.has(String(i.id))) {
      t.classList.add("ln-row-selected");
      const e = t.querySelector("[data-ln-table-row-select]");
      e && (e.checked = !0);
    }
    return t;
  }, y.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    de(this, "ln-table:request-data", "table");
  }, y.prototype._enterWindowedMode = function() {
    const i = this, s = this.dom, t = parseInt(s.getAttribute("data-ln-table-window"), 10), e = parseInt(s.getAttribute("data-ln-table-window-page"), 10), n = parseInt(s.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !i._windowed || !i._cache || (i.totalCount = i._cache.grandTotal, i.visibleCount = i._cache.logicalTotal, i._lastTotal = i._cache.grandTotal, i.isLoaded = !0, i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), L(s, "ln-table:rendered", {
        table: i.name,
        total: i.totalCount,
        visible: i.visibleCount
      }));
    }, this._renderBatch = Gt(this._onCacheChange), this._cache = be({
      windowSize: t > 0 ? t : 1e3,
      pageSize: e > 0 ? e : 200,
      threshold: n >= 0 ? n : 25,
      fetchDebounce: 120,
      requestPage: function(d, g, E) {
        L(s, "ln-table:request-data", {
          table: i.name,
          sort: d.sort,
          filters: d.filters,
          search: d.search,
          offset: g,
          limit: E,
          queryGen: i._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, y.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let i = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(i) && this._totalSpan) {
        const t = this._totalSpan.textContent.replace(/[^\d]/g, "");
        t && (i = parseInt(t, 10));
      }
      const s = i > 0 ? i : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: s,
        filtered: s
      });
    } else
      this.dom.classList.add("ln-table--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, y.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, y.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const i = this.tbody.querySelectorAll("[data-ln-table-row]");
    let s = i.length > 0;
    for (let t = 0; t < i.length; t++) {
      const e = i[t].getAttribute("data-ln-table-row-id");
      if (e != null && !this.selectedIds.has(e)) {
        s = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = s;
  }, y.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const i = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let s = 0; s < i.length; s++) {
      const t = i[s].getAttribute("data-ln-table-row-id"), e = t != null && this.selectedIds.has(t);
      i[s].classList.toggle("ln-row-selected", e);
      const n = i[s].querySelector("[data-ln-table-row-select]");
      n && (n.checked = e);
    }
    this._updateSelectAll();
  }, Object.defineProperty(y.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), y.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const i = this;
    if (this._onSelectionChange = function(s) {
      const t = s.target.closest("[data-ln-table-row-select]");
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
      const s = document.createElement("input");
      s.type = "checkbox";
      const t = i.dom.querySelector('[data-ln-table-dict="select-all"]'), e = i.dom.getAttribute("data-ln-table-select-all-label") || (t ? t.textContent.trim() : null) || "Select all";
      s.setAttribute("aria-label", e), this._selectAllCheckbox.appendChild(s), this._selectAllCheckbox = s;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const s = i._selectAllCheckbox.checked, t = i.tbody ? i.tbody.querySelectorAll("[data-ln-table-row]") : [];
      for (let e = 0; e < t.length; e++) {
        const n = t[e].getAttribute("data-ln-table-row-id"), d = t[e].querySelector("[data-ln-table-row-select]");
        n != null && (s ? (i.selectedIds.add(n), t[e].classList.add("ln-row-selected")) : (i.selectedIds.delete(n), t[e].classList.remove("ln-row-selected")), d && (d.checked = s));
      }
      i.selectedCount = i.selectedIds.size, L(i.dom, "ln-table:select-all", {
        table: i.name,
        selected: s
      }), L(i.dom, "ln-table:select", {
        table: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedCount
      }), i._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const s = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let t = 0; t < s.length; t++) {
        const e = s[t].querySelector("[data-ln-table-row-select]"), n = s[t].getAttribute("data-ln-table-row-id");
        e && e.checked && n != null && (this.selectedIds.add(n), s[t].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, y.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const i = this.dom.querySelector("[data-ln-table-col-select]");
    if (i) {
      const s = i.querySelector('input[type="checkbox"]');
      s && s.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const s = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let t = 0; t < s.length; t++) {
        s[t].classList.remove("ln-row-selected");
        const e = s[t].querySelector("[data-ln-table-row-select]");
        e && (e.checked = !1);
      }
    }
    this._updateFooter();
  }, y.prototype._updateFooter = function() {
    let i = 0, s = 0;
    this.isDataDriven ? (i = this._lastTotal != null ? this._lastTotal : this._data.length, s = this.visibleCount) : (i = this._data.length, s = this._filteredData.length);
    const t = s < i;
    if (this._totalSpan && (this._totalSpan.textContent = r(i, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = t ? r(s, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !t), this._selectedSpan) {
      const e = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = e > 0 ? r(e, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", e === 0);
    }
  }, y.prototype._focusRow = function(i) {
    for (let s = 0; s < i.length; s++)
      i[s].classList.remove("ln-row-focused"), i[s].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < i.length) {
      const s = i[this._focusedRowIndex];
      s.classList.add("ln-row-focused"), s.setAttribute("tabindex", "0"), s.focus(), s.scrollIntoView({ block: "nearest" });
    }
  }, y.prototype.destroy = function() {
    this.dom[a] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), document.removeEventListener("keydown", this._onKeydown), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[a]);
  }, B(l, a, y, "ln-table", {
    extraAttributes: [
      "data-ln-table-window",
      "data-ln-table-window-page",
      "data-ln-table-window-threshold",
      "data-ln-table-count"
    ],
    onAttributeChange: function(i, s) {
      const t = i[a];
      if (!(!t || !t.isDataDriven)) {
        if (s === "data-ln-table-window") {
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
          if (s === "data-ln-table-window-page") {
            const e = parseInt(i.getAttribute("data-ln-table-window-page"), 10);
            e > 0 && t._cache.configure({ pageSize: e });
          } else if (s === "data-ln-table-window-threshold") {
            const e = parseInt(i.getAttribute("data-ln-table-window-threshold"), 10);
            e >= 0 && t._cache.configure({ threshold: e });
          } else if (s === "data-ln-table-count") {
            const e = parseInt(i.getAttribute("data-ln-table-count"), 10);
            e >= 0 && t._cache.setGrandTotal(e);
          }
        }
      }
    }
  });
})();
(function() {
  const l = "data-ln-table-coordinator", a = "lnTableCoordinator";
  if (window[a] !== void 0) return;
  document.addEventListener("keydown", function(_) {
    if (_.key !== "/" || _.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const h = document.querySelector("[" + l + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!h) return;
    const u = h.tagName === "INPUT" || h.tagName === "TEXTAREA" ? h : h.querySelector('input[type="search"], input[type="text"], input');
    u && (_.preventDefault(), u.focus());
  });
  function b(_) {
    return this.dom = _, v(this), this;
  }
  function v(_) {
    const h = _.dom;
    function u(o) {
      const c = o.target;
      if (c && c.hasAttribute && c.hasAttribute("data-ln-table")) return c;
      const r = o.detail && o.detail.targetId || c && c.id;
      return r ? h.querySelector('[data-ln-table-source="' + r + '"]') || h.querySelector('[data-ln-table="' + r + '"]') : null;
    }
    _._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(o) {
        if (!o.detail) return;
        const c = u(o);
        if (!c || !c.hasAttribute || !c.hasAttribute("data-ln-table")) return;
        const r = o.detail.key, f = o.detail.values || [], p = c.querySelectorAll("th");
        for (let m = 0; m < p.length; m++)
          if (p[m].getAttribute("data-ln-table-filter-col") === r) {
            const y = p[m].querySelector("[data-ln-table-col-filter]");
            y && y.classList.toggle("ln-filter-active", f.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(o) {
        const c = o.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!c) return;
        const r = c.closest("[data-ln-table]") || h.querySelector("[data-ln-table]");
        if (!r || !r.lnTable) return;
        const f = r.lnTable.name || r.id, p = r.querySelectorAll("th");
        for (let t = 0; t < p.length; t++) {
          const e = p[t].querySelector("[data-ln-table-col-filter]");
          e && e.classList.remove("ln-filter-active");
        }
        const m = r.getAttribute("data-ln-table-source") || r.id, y = m ? document.getElementById(m) : null;
        y && y.hasAttribute("data-ln-search") && y.setAttribute("data-ln-search", "");
        const i = m && h.querySelector('[data-ln-search-for="' + m + '"]') || h.querySelector("[data-ln-search-for]");
        if (i) {
          const t = i.tagName === "INPUT" || i.tagName === "TEXTAREA" ? i : i.querySelector("input");
          t && t.value !== "" && (t.value = "", t.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const s = m && h.querySelectorAll('[data-ln-filter="' + m + '"]') || h.querySelectorAll("[data-ln-filter]");
        for (let t = 0; t < s.length; t++) {
          const e = s[t].querySelector("[data-ln-filter-reset]");
          e && (e.checked = !0, e.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        r.hasAttribute("data-ln-table-source") || L(r, "ln-table:request-clear-filters", { table: f });
      }
    }, h.addEventListener("ln-filter:change", _._handlers.filter), h.addEventListener("click", _._handlers.clear);
  }
  b.prototype.destroy = function() {
    this.dom[a] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[a]);
  }, B(l, a, b, "ln-table-coordinator");
})();
(function() {
  const l = "data-ln-list", a = "lnList", b = "data-ln-list-empty";
  if (window[a] !== void 0) return;
  function c(i, s) {
    if (i == null || isNaN(i)) return "";
    try {
      return new Intl.NumberFormat(W(s)).format(i);
    } catch {
      return String(i);
    }
  }
  function r(i) {
    let s = i;
    for (; s && s !== document.body && s !== document.documentElement; ) {
      const e = getComputedStyle(s).overflowY;
      if (e === "auto" || e === "scroll") return s;
      s = s.parentElement;
    }
    return null;
  }
  function f(i) {
    const s = i._scrollContainer || r(i.dom);
    return {
      container: s,
      top: s ? s.scrollTop : window.scrollY
    };
  }
  function p(i) {
    i.container ? i.container.scrollTop = i.top : window.scrollTo(window.scrollX, i.top);
  }
  function m(i) {
    if (!i) return 0;
    const s = getComputedStyle(i), t = parseFloat(s.marginTop) || 0, e = parseFloat(s.marginBottom) || 0;
    return i.offsetHeight + t + e;
  }
  function y(i) {
    this.dom = i, this.tbody = i.querySelector("[data-ln-list-body]") || i, this.isDataDriven = i.hasAttribute("data-ln-list-source"), this.name = i.getAttribute(l) || "", this.source = i.getAttribute("data-ln-list-source") || "", this._totalSpan = i.querySelector("[data-ln-list-total]"), this._filteredSpan = i.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== i ? this._filteredSpan.parentElement : null), this._selectedSpan = i.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== i ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const s = this;
    return this._onRequestClearFilters = function() {
      s.isDataDriven ? (s.currentFilters = {}, s.currentSearch = "", L(i, "ln-list:clear-filters", { list: s.name }), s._requestData()) : (s._searchTerm = "", s._filters = {}, s._sortField = null, s._sortDir = null, s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), s._updateFooter(), L(i, "ln-list:filter", {
        term: "",
        matched: s._filteredData.length,
        total: s._data.length
      }));
    }, i.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectable = i.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._windowed = !1, this._cache = null, i.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._lastTotal = 0, this._lastFiltered = 0, this._onSetData = function(t) {
      const e = t.detail || {};
      if (s._windowed) {
        i.classList.remove("ln-list--loading"), s._cache.ingest(e);
        return;
      }
      s._data = e.data || [], s._lastTotal = e.total != null ? e.total : s._data.length, s._lastFiltered = e.filtered != null ? e.filtered : s._data.length, s.totalCount = s._lastTotal, s.visibleCount = s._lastFiltered, s.isLoaded = !0, i.classList.remove("ln-list--loading"), s._vStart = -1, s._vEnd = -1, s._applyFilterAndSort(), s._render(), s._updateFooter(), L(i, "ln-list:rendered", {
        list: s.name,
        total: s.totalCount,
        visible: s.visibleCount
      });
    }, i.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(t) {
      const e = t.detail && t.detail.loading;
      i.classList.toggle("ln-list--loading", !!e), e && (s.isLoaded = !1);
    }, i.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(t) {
      !s._windowed || !s._cache || s._cache.release(t.detail && t.detail.offset);
    }, i.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !s._windowed || !s._cache || s._cache.revalidate();
    }, i.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !s._windowed || !s._cache || s._requestData();
    }, i.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(t) {
      t.detail.field != null && (t.preventDefault(), s.currentSort = t.detail.direction === "none" ? null : { field: t.detail.field, direction: t.detail.direction }, s._windowed ? s._requestData() : (s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), s._updateFooter(), L(i, "ln-list:sorted", {
        field: s.currentSort ? s.currentSort.field : null,
        direction: t.detail.direction,
        matched: s.visibleCount,
        total: s.totalCount
      })));
    }, i.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(t) {
      if (t.target.closest("[data-ln-item-select]") || t.target.closest("[data-ln-item-action]") || t.target.closest("a") || t.target.closest("button") || t.ctrlKey || t.metaKey || t.button === 1) return;
      const e = t.target.closest("[data-ln-item]");
      if (!e) return;
      const n = e.getAttribute("data-ln-item-id"), d = e._lnRecord || {};
      L(i, "ln-list:item-click", {
        list: s.name,
        id: n,
        record: d
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(t) {
      const e = t.target.closest("[data-ln-item-action]");
      if (!e) return;
      t.stopPropagation();
      const n = e.closest("[data-ln-item]");
      if (!n) return;
      const d = e.getAttribute("data-ln-item-action"), g = n.getAttribute("data-ln-item-id"), E = n._lnRecord || {};
      L(i, "ln-list:item-action", {
        list: s.name,
        id: g,
        action: d,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : L(i, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      s.tbody.children.length > 0 && (s._emptyObserver.disconnect(), s._emptyObserver = null, s._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onSearchChange = function(t) {
      t.preventDefault();
      const e = (t.detail && t.detail.term != null ? t.detail.term : "").trim();
      s._searchTerm = e.toLowerCase(), s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), s._updateFooter(), L(i, "ln-list:filter", {
        term: s._searchTerm,
        matched: s._filteredData.length,
        total: s._data.length
      });
    }, i.addEventListener("ln-search:change", this._onSearchChange), this._onFilterChange = function(t) {
      if (t.preventDefault(), !t.detail) return;
      const e = t.detail.key, n = t.detail.values || [];
      if (e) {
        if (n.length === 0)
          delete s._filters[e];
        else {
          const d = [];
          for (let g = 0; g < n.length; g++)
            d.push(n[g].toLowerCase());
          s._filters[e] = d;
        }
        s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), s._updateFooter(), L(i, "ln-list:filter", {
          term: s._searchTerm,
          matched: s._filteredData.length,
          total: s._data.length
        });
      }
    }, i.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(t) {
      if (t.detail && t.detail.field == null) return;
      t.preventDefault();
      const e = t.detail && t.detail.direction === "none" ? null : t.detail && t.detail.direction;
      s._sortField = e === null ? null : t.detail && t.detail.field, s._sortDir = e, s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), s._updateFooter(), L(i, "ln-list:sorted", {
        field: s._sortField,
        direction: t.detail && t.detail.direction,
        matched: s._filteredData.length,
        total: s._data.length
      });
    }, i.addEventListener("ln-sort:change", this._onSort)), this;
  }
  y.prototype._parseChildren = function() {
    const i = Array.from(this.tbody.children).filter((s) => !s.classList.contains("ln-list__spacer"));
    this._data = [], i.length > 0 && (this._itemHeight = m(i[0]) || 50);
    for (let s = 0; s < i.length; s++) {
      const t = i[s], e = t.getAttribute("data-ln-item-id") || t.getAttribute("id"), n = t.textContent.trim().toLowerCase();
      let d = null;
      if (this.isDataDriven) {
        d = {}, e != null && (d.id = e);
        const w = t.querySelectorAll("[data-ln-list-field]");
        for (let A = 0; A < w.length; A++) {
          const S = w[A], q = S.getAttribute("data-ln-list-field");
          q && (d[q] = _t(S));
        }
      }
      const g = {}, E = t.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let w = 0; w < E.length; w++) {
        const A = E[w], S = A.getAttribute("data-ln-list-field") || A.getAttribute("data-ln-field");
        S && (g[S] = _t(A));
      }
      for (let w = 0; w < t.attributes.length; w++) {
        const A = t.attributes[w];
        if (A.name.startsWith("data-") && !A.name.startsWith("data-ln-")) {
          const S = A.name.slice(5);
          S && (g[S] = A.value);
        }
      }
      this._data.push({
        html: t.outerHTML,
        id: e,
        searchText: n,
        fields: g,
        ...d || {}
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, y.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      if (this._filteredData = this._data.slice(), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const i = this.currentSort.field, s = this.currentSort.direction === "desc" ? -1 : 1, t = this._filteredData.map(function(d) {
        return d[i];
      }), e = yt(t), n = typeof Intl < "u" ? new Intl.Collator(W(this.dom), { sensitivity: "base" }) : null;
      this._filteredData.sort(function(d, g) {
        return vt(d[i], g[i], e, n) * s;
      });
    } else {
      const i = this._searchTerm, s = i ? i.split(/\s+/).filter(Boolean) : [], t = this._filters || {}, e = Object.keys(t).length > 0;
      if (s.length === 0 && !e ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(n) {
        if (s.length > 0 && !s.every(function(g) {
          return n.searchText && n.searchText.indexOf(g) !== -1;
        }))
          return !1;
        if (e)
          for (const d in t) {
            const g = t[d];
            if (g && g.length > 0) {
              const E = n.fields && n.fields[d] !== void 0 ? n.fields[d] : n[d] !== void 0 ? n[d] : null, w = E != null ? String(E).toLowerCase() : "";
              if (g.indexOf(w) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const n = this._sortField, d = this._sortDir === "desc" ? -1 : 1, g = typeof Intl < "u" ? new Intl.Collator(W(this.dom), { sensitivity: "base" }) : null, E = this._filteredData.map(function(A) {
          return A.fields && A.fields[n] !== void 0 ? A.fields[n] : A[n];
        }), w = yt(E);
        this._filteredData.sort(function(A, S) {
          const q = A.fields && A.fields[n] !== void 0 ? A.fields[n] : A[n], T = S.fields && S.fields[n] !== void 0 ? S.fields[n] : S[n];
          return vt(q, T, w, g) * d;
        });
      }
    }
  }, y.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const i = this._lastTotal, s = this.visibleCount;
        if (i === 0 || this._filteredData.length === 0 || s === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const i = this._filteredData.length;
        i === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : i > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, y.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const i = this._filteredData, s = document.createDocumentFragment();
      for (let e = 0; e < i.length; e++) {
        const n = this._buildItem(i[e]);
        n && s.appendChild(n);
      }
      const t = f(this);
      this.tbody.textContent = "", this.tbody.appendChild(s), p(t), this._selectable && this._updateSelectAll();
    } else {
      const i = [], s = this._filteredData;
      for (let e = 0; e < s.length; e++) i.push(s[e].html);
      const t = f(this);
      this.tbody.innerHTML = i.join(""), p(t), this._selectable && this._restoreSelection();
    }
  }, y.prototype._readGridLayout = function() {
    const i = getComputedStyle(this.tbody), s = i.gridTemplateColumns;
    let t = 1;
    if (s && s !== "none") {
      const n = s.trim().split(/\s+/).filter(Boolean);
      n.length > 0 && (t = n.length);
    }
    const e = parseFloat(i.rowGap);
    return { columns: t, rowGap: isNaN(e) ? 0 : e };
  }, y.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const i = this._cache.peek(), s = i ? this._buildItem(i) : this._buildPlaceholderItem();
      s && (this.tbody.textContent = "", this.tbody.appendChild(s), this._itemHeight = m(s) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const i = this._buildItem(this._data[0]);
        i && (this.tbody.textContent = "", this.tbody.appendChild(i), this._itemHeight = m(i) || 50, this.tbody.textContent = "");
      }
    } else {
      const i = this.tbody.children;
      i.length > 0 && (this._itemHeight = m(i[0]) || 50);
    }
  }, y.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const i = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = r(this.dom);
    const s = this._scrollContainer || window;
    this._scrollHandler = function() {
      i._rafId || (i._rafId = requestAnimationFrame(function() {
        i._rafId = null, i._windowed ? i._renderWindowed() : i._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      i._itemHeight = 0, i._measureItemHeight(), i._vStart = -1, i._vEnd = -1, i._windowed ? i._renderWindowed() : i._renderVirtual();
    }, s.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, y.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, y.prototype._renderVirtual = function() {
    const i = this._filteredData, s = i.length, t = this._itemHeight;
    if (!t || !s) return;
    const e = this._scrollContainer;
    let n, d;
    if (e) {
      const H = this.tbody.getBoundingClientRect(), U = e.getBoundingClientRect(), K = e === this.tbody ? 0 : H.top - U.top + e.scrollTop;
      n = e.scrollTop - K, d = e.clientHeight;
    } else {
      const U = this.tbody.getBoundingClientRect().top + window.scrollY;
      n = window.scrollY - U, d = window.innerHeight;
    }
    const g = this._readGridLayout(), E = g.columns, w = g.rowGap, A = t + w, S = Math.ceil(s / E);
    let q = Math.max(0, Math.floor(n / A) - 15);
    q = Math.min(q, S);
    const T = Math.ceil(d / A) + 30, x = Math.min(q + T, S), k = Math.min(q * E, s), R = Math.min(x * E, s);
    if (k === this._vStart && R === this._vEnd) return;
    this._vStart = k, this._vEnd = R;
    const N = q * A, z = (S - x) * A;
    if (this.isDataDriven) {
      const H = document.createDocumentFragment();
      if (N > 0) {
        const K = document.createElement(this.isUl ? "li" : "div");
        K.className = "ln-list__spacer", K.setAttribute("aria-hidden", "true"), K.style.height = N + "px", H.appendChild(K);
      }
      for (let K = k; K < R; K++) {
        const it = this._buildItem(i[K]);
        it && H.appendChild(it);
      }
      if (z > 0) {
        const K = document.createElement(this.isUl ? "li" : "div");
        K.className = "ln-list__spacer", K.setAttribute("aria-hidden", "true"), K.style.height = z + "px", H.appendChild(K);
      }
      const U = f(this);
      this.tbody.textContent = "", this.tbody.appendChild(H), p(U), this._selectable && this._updateSelectAll();
    } else {
      let H = "";
      N > 0 && (H += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${N}px"></${this.isUl ? "li" : "div"}>`);
      for (let K = k; K < R; K++)
        H += i[K].html;
      z > 0 && (H += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${z}px"></${this.isUl ? "li" : "div"}>`);
      const U = f(this);
      this.tbody.innerHTML = H, p(U), this._selectable && this._restoreSelection();
    }
  }, y.prototype._buildPlaceholderItem = function() {
    const i = document.createElement(this.isUl ? "li" : "div");
    return i.className = "ln-list__placeholder", i.setAttribute("aria-hidden", "true"), i.style.height = this._itemHeight + "px", i;
  }, y.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const i = this._itemHeight;
    if (!i) return;
    const s = this._scrollContainer;
    let t, e;
    if (s) {
      const U = this.tbody.getBoundingClientRect(), K = s.getBoundingClientRect(), it = s === this.tbody ? 0 : U.top - K.top + s.scrollTop;
      t = s.scrollTop - it, e = s.clientHeight;
    } else {
      const K = this.tbody.getBoundingClientRect().top + window.scrollY;
      t = window.scrollY - K, e = window.innerHeight;
    }
    const n = this._readGridLayout(), d = n.columns, g = n.rowGap, E = i + g, w = this._cache.logicalTotal, A = Math.ceil(w / d);
    let S = Math.max(0, Math.floor(t / E) - 15);
    S = Math.min(S, A);
    const q = Math.ceil(e / E) + 30, T = Math.min(S + q, A), x = Math.min(S * d, w), k = Math.min(T * d, w), R = S * E, N = (A - T) * E, z = document.createDocumentFragment();
    if (R > 0) {
      const U = document.createElement(this.isUl ? "li" : "div");
      U.className = "ln-list__spacer", U.setAttribute("aria-hidden", "true"), U.style.height = R + "px", z.appendChild(U);
    }
    for (let U = x; U < k; U++)
      if (this._cache.has(U)) {
        const K = this._buildItem(this._cache.get(U));
        K && z.appendChild(K);
      } else
        z.appendChild(this._buildPlaceholderItem());
    if (N > 0) {
      const U = document.createElement(this.isUl ? "li" : "div");
      U.className = "ln-list__spacer", U.setAttribute("aria-hidden", "true"), U.style.height = N + "px", z.appendChild(U);
    }
    const H = f(this);
    this.tbody.textContent = "", this.tbody.appendChild(z), p(H), this._vStart = x, this._vEnd = k, this._cache.ensure(x, k);
  }, y.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let i = null;
    if (this.isDataDriven) {
      const s = this._lastTotal != null ? this._lastTotal : this._data.length, e = this.visibleCount === 0 && s > 0, n = e ? this.name + "-empty-filtered" : this.name + "-empty";
      if (i = ct(this.dom, n, "ln-list"), !i) {
        const d = this.dom.querySelector("template[data-ln-empty]");
        if (d) {
          const g = e ? "search" : "initial", E = d.content.querySelector(`[data-ln-empty-when="${g}"]`) || d.content.firstElementChild;
          E && (i = document.importNode(E, !0));
        }
      }
    } else {
      const s = this.dom.querySelector(`template[${b}]`);
      if (s) {
        const t = s.content.firstElementChild;
        t && (i = document.importNode(t, !0));
      }
    }
    if (i)
      if (i.tagName === "LI" || i.tagName === "TR")
        this.tbody.appendChild(i);
      else {
        const s = document.createElement(this.isUl ? "li" : "div");
        s.appendChild(i), this.tbody.appendChild(s);
      }
    L(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, y.prototype._buildItem = function(i) {
    const s = ct(this.dom, this.name + "-row", "ln-list");
    if (!s) return null;
    const t = s.querySelector("[data-ln-item]") || s.firstElementChild;
    if (!t) return null;
    if (At(t, i), et(t, i), t._lnRecord = i, i.id != null && (t.setAttribute("data-ln-item-id", i.id), this._selectable && this.selectedIds.has(String(i.id)))) {
      t.classList.add("ln-item-selected");
      const e = t.querySelector("[data-ln-item-select]");
      e && (e.checked = !0);
    }
    return t;
  }, y.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const i = this.tbody.querySelectorAll("[data-ln-item]");
    for (let s = 0; s < i.length; s++) {
      const t = i[s].getAttribute("data-ln-item-id"), e = t != null && this.selectedIds.has(String(t));
      i[s].classList.toggle("ln-item-selected", e);
      const n = i[s].querySelector("[data-ln-item-select]");
      n && (n.checked = e);
    }
    this._updateSelectAll();
  }, y.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const i = this;
    this._onSelectionChange = function(s) {
      const t = s.target.closest("[data-ln-item-select]");
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
      const s = i._selectAllCheckbox.checked, t = i.tbody.querySelectorAll("[data-ln-item]");
      for (let e = 0; e < t.length; e++) {
        const n = t[e], d = n.getAttribute("data-ln-item-id"), g = n.querySelector("[data-ln-item-select]");
        d != null && (s ? (i.selectedIds.add(String(d)), n.classList.add("ln-item-selected")) : (i.selectedIds.delete(String(d)), n.classList.remove("ln-item-selected")), g && (g.checked = s));
      }
      L(i.dom, "ln-list:select-all", { list: i.name, selected: s }), L(i.dom, "ln-list:select", {
        list: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedIds.size
      }), i._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, y.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const i = this.tbody.querySelectorAll("[data-ln-item]");
    let s = i.length > 0;
    for (let t = 0; t < i.length; t++) {
      const e = i[t].getAttribute("data-ln-item-id");
      if (e != null && !this.selectedIds.has(String(e))) {
        s = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = s;
  }, y.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    de(this, "ln-list:request-data", "list");
  }, y.prototype._enterWindowedMode = function() {
    const i = this, s = this.dom, t = parseInt(s.getAttribute("data-ln-list-window"), 10), e = parseInt(s.getAttribute("data-ln-list-window-page"), 10), n = parseInt(s.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !i._windowed || !i._cache || (i.totalCount = i._cache.grandTotal, i.visibleCount = i._cache.logicalTotal, i._lastTotal = i._cache.grandTotal, i.isLoaded = !0, i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), L(s, "ln-list:rendered", {
        list: i.name,
        total: i.totalCount,
        visible: i.visibleCount
      }));
    }, this._renderBatch = Gt(this._onCacheChange), this._cache = be({
      windowSize: t > 0 ? t : 1e3,
      pageSize: e > 0 ? e : 200,
      threshold: n >= 0 ? n : 25,
      fetchDebounce: 120,
      requestPage: function(d, g, E) {
        L(s, "ln-list:request-data", {
          list: i.name,
          sort: d.sort,
          filters: d.filters,
          search: d.search,
          offset: g,
          limit: E,
          queryGen: i._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, y.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const i = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), s = i > 0 ? i : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: s,
        filtered: s
      });
    } else
      this.dom.classList.add("ln-list--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, y.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, y.prototype._updateFooter = function() {
    let i = 0, s = 0;
    this.isDataDriven ? (i = this._lastTotal != null ? this._lastTotal : this._data.length, s = this.visibleCount) : (i = this._data.length, s = this._filteredData.length);
    const t = s < i;
    if (this._totalSpan && (this._totalSpan.textContent = c(i, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = t ? c(s, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !t), this._selectedSpan) {
      const e = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = e > 0 ? c(e, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", e === 0);
    }
  }, y.prototype.destroy = function() {
    this.dom[a] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onSearchChange && this.dom.removeEventListener("ln-search:change", this._onSearchChange), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[a]);
  }, B(l, a, y, "ln-list", {
    extraAttributes: [
      "data-ln-list-window",
      "data-ln-list-window-page",
      "data-ln-list-window-threshold",
      "data-ln-list-count"
    ],
    onAttributeChange: function(i, s) {
      const t = i[a];
      if (!(!t || !t.isDataDriven)) {
        if (s === "data-ln-list-window") {
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
          if (s === "data-ln-list-window-page") {
            const e = parseInt(i.getAttribute("data-ln-list-window-page"), 10);
            e > 0 && t._cache.configure({ pageSize: e });
          } else if (s === "data-ln-list-window-threshold") {
            const e = parseInt(i.getAttribute("data-ln-list-window-threshold"), 10);
            e >= 0 && t._cache.configure({ threshold: e });
          } else if (s === "data-ln-list-count") {
            const e = parseInt(i.getAttribute("data-ln-list-count"), 10);
            e >= 0 && t._cache.setGrandTotal(e);
          }
        }
      }
    }
  });
})();
(function() {
  const l = "data-ln-circular-progress", a = "lnCircularProgress";
  if (window[a] !== void 0) return;
  const b = "http://www.w3.org/2000/svg", v = 36, _ = 16, h = 2 * Math.PI * _;
  function u(p) {
    return this.dom = p, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, c.call(this), f.call(this), r.call(this), this;
  }
  u.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("role"), this.dom.removeAttribute("aria-valuemin"), this.dom.removeAttribute("aria-valuemax"), this.dom.removeAttribute("aria-valuenow"), this.dom.removeAttribute("aria-valuetext"), delete this.dom[a]);
  };
  function o(p, m) {
    const y = document.createElementNS(b, p);
    for (const i in m)
      y.setAttribute(i, m[i]);
    return y;
  }
  function c() {
    this.svg = o("svg", {
      viewBox: "0 0 " + v + " " + v,
      "aria-hidden": "true"
    }), this.trackCircle = o("circle", {
      cx: v / 2,
      cy: v / 2,
      r: _,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = o("circle", {
      cx: v / 2,
      cy: v / 2,
      r: _,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": h,
      "stroke-dashoffset": h,
      transform: "rotate(-90 " + v / 2 + " " + v / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function r() {
    const p = this, m = new MutationObserver(function(y) {
      for (const i of y)
        (i.attributeName === "data-ln-circular-progress" || i.attributeName === "data-ln-circular-progress-max" || i.attributeName === "data-ln-circular-progress-label") && f.call(p);
    });
    m.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max", "data-ln-circular-progress-label"]
    }), this._attrObserver = m;
  }
  function f() {
    const p = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, m = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let y = m > 0 ? p / m * 100 : 0;
    y < 0 && (y = 0), y > 100 && (y = 100);
    const i = h - y / 100 * h;
    this.progressCircle.setAttribute("stroke-dashoffset", i);
    const s = this.dom.getAttribute("data-ln-circular-progress-label"), t = s !== null ? s : Math.round(y) + "%";
    this.labelEl.textContent = t, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(m));
    const e = Math.max(0, Math.min(p, m));
    this.dom.setAttribute("aria-valuenow", String(e)), this.dom.setAttribute("aria-valuetext", t), L(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: p,
      max: m,
      percentage: y
    });
  }
  B(l, a, u, "ln-circular-progress");
})();
(function() {
  const l = "data-ln-sortable", a = "lnSortable", b = "data-ln-sortable-handle";
  if (window[a] !== void 0) return;
  function v(h) {
    this.dom = h, this.isEnabled = h.getAttribute(l) !== "disabled", this._dragging = null, h.setAttribute("aria-roledescription", "sortable list");
    const u = this;
    return this._onPointerDown = function(o) {
      u.isEnabled && u._handlePointerDown(o);
    }, h.addEventListener("pointerdown", this._onPointerDown), this;
  }
  v.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(l, "");
  }, v.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(l, "disabled");
  }, v.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), L(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[a]);
  }, v.prototype._handlePointerDown = function(h) {
    let u = h.target.closest("[" + b + "]"), o;
    if (u) {
      for (o = u; o && o.parentElement !== this.dom; )
        o = o.parentElement;
      if (!o || o.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + b + "]")) return;
      for (o = h.target; o && o.parentElement !== this.dom; )
        o = o.parentElement;
      if (!o || o.parentElement !== this.dom) return;
      u = o;
    }
    const r = Array.from(this.dom.children).indexOf(o);
    if (G(this.dom, "ln-sortable:before-drag", {
      item: o,
      index: r
    }).defaultPrevented) return;
    h.preventDefault(), u.setPointerCapture(h.pointerId), this._dragging = o, o.classList.add("ln-sortable--dragging"), o.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), L(this.dom, "ln-sortable:drag-start", {
      item: o,
      index: r
    });
    const p = this, m = function(i) {
      p._handlePointerMove(i);
    }, y = function(i) {
      p._handlePointerEnd(i), u.removeEventListener("pointermove", m), u.removeEventListener("pointerup", y), u.removeEventListener("pointercancel", y);
    };
    u.addEventListener("pointermove", m), u.addEventListener("pointerup", y), u.addEventListener("pointercancel", y);
  }, v.prototype._handlePointerMove = function(h) {
    if (!this._dragging) return;
    const u = Array.from(this.dom.children), o = this._dragging;
    for (const c of u)
      c.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const c of u) {
      if (c === o) continue;
      const r = c.getBoundingClientRect(), f = r.top + r.height / 2;
      if (h.clientY >= r.top && h.clientY < f) {
        c.classList.add("ln-sortable--drop-before");
        break;
      } else if (h.clientY >= f && h.clientY <= r.bottom) {
        c.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, v.prototype._handlePointerEnd = function(h) {
    if (!this._dragging) return;
    const u = this._dragging, o = Array.from(this.dom.children), c = o.indexOf(u);
    let r = null, f = null;
    for (const p of o) {
      if (p.classList.contains("ln-sortable--drop-before")) {
        r = p, f = "before";
        break;
      }
      if (p.classList.contains("ln-sortable--drop-after")) {
        r = p, f = "after";
        break;
      }
    }
    for (const p of o)
      p.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (u.classList.remove("ln-sortable--dragging"), u.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), r && r !== u) {
      f === "before" ? this.dom.insertBefore(u, r) : this.dom.insertBefore(u, r.nextElementSibling);
      const m = Array.from(this.dom.children).indexOf(u);
      L(this.dom, "ln-sortable:reordered", {
        item: u,
        oldIndex: c,
        newIndex: m
      });
    }
    this._dragging = null;
  };
  function _(h) {
    const u = h[a];
    if (!u) return;
    const o = h.getAttribute(l) !== "disabled";
    o !== u.isEnabled && (u.isEnabled = o, L(h, o ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: h }));
  }
  B(l, a, v, "ln-sortable", {
    onAttributeChange: _
  });
})();
(function() {
  const l = "data-ln-confirm", a = "lnConfirm", b = "data-ln-confirm-timeout";
  if (window[a] !== void 0) return;
  function _(...u) {
    (document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) && console.warn("[ln-confirm]", ...u);
  }
  function h(u) {
    _("constructor called on", u), this.dom = u, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = u.querySelector("[data-ln-confirm-idle]"), this.activeEl = u.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = u.textContent.trim(), this.confirmText = u.getAttribute(l) || "Confirm?");
    const o = this;
    return this._onClick = function(c) {
      if (_("click handler, confirming:", o.confirming, "submitted:", o._submitted, "target:", c.target), !o.confirming)
        c.preventDefault(), c.stopImmediatePropagation(), o._enterConfirm();
      else {
        if (o._submitted) return;
        o._submitted = !0, c.stopPropagation(), o._reset();
      }
    }, u.addEventListener("click", this._onClick), this;
  }
  h.prototype._getTimeout = function() {
    const u = parseFloat(this.dom.getAttribute(b));
    return isNaN(u) || u <= 0 ? 3 : u;
  }, h.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const o = this.activeEl ? this.activeEl.textContent.trim() : "";
      o && (this.dom.setAttribute("aria-label", o), this.dom.setAttribute("aria-live", "polite"));
    } else {
      var u = this.dom.querySelector("svg.ln-icon use");
      u && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = u.getAttribute("href"), u.setAttribute("href", "#ln-icon-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.dom.setAttribute("aria-label", this.confirmText), this.dom.setAttribute("aria-live", "polite")) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), L(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, h.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const u = this, o = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      u._reset();
    }, o);
  }, h.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      var u = this.dom.querySelector("svg.ln-icon use");
      u && this.originalIconHref && u.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, h.prototype.destroy = function() {
    _("destroy called on", this.dom), this.dom[a] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[a]);
  }, B(l, a, h, "ln-confirm");
})();
(function() {
  const l = "data-ln-translations", a = "lnTranslations";
  if (window[a] !== void 0) return;
  const b = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function v(_) {
    this.dom = _, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = _.getAttribute(l + "-default") || "", this.placeholderLabel = _.getAttribute(l + "-placeholder") || "{lang} translation", this.removeLabel = _.getAttribute(l + "-remove-label") || "Remove {lang}", this.badgesEl = _.querySelector("[" + l + "-active]"), this.menuEl = _.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const h = _.getAttribute(l + "-locales");
    if (this.locales = b, h)
      try {
        this.locales = JSON.parse(h);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const u = this;
    return this._onRequestAdd = function(o) {
      o.detail && o.detail.lang && u.addLanguage(o.detail.lang);
    }, this._onRequestRemove = function(o) {
      o.detail && o.detail.lang && u.removeLanguage(o.detail.lang);
    }, _.addEventListener("ln-translations:request-add", this._onRequestAdd), _.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  v.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const _ = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const h of _) {
      const u = h.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const o of u)
        o.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, v.prototype._detectExisting = function() {
    const _ = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const h of _) {
      const u = h.getAttribute("data-ln-translatable-lang");
      u && u !== this.defaultLang && this.activeLanguages.add(u);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, v.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const _ = this;
    let h = 0;
    for (const o in this.locales) {
      if (!this.locales.hasOwnProperty(o) || this.activeLanguages.has(o)) continue;
      h++;
      const c = Tt("ln-translations-menu-item", "ln-translations");
      if (!c) return;
      const r = c.querySelector("[data-ln-translations-lang]");
      r.setAttribute("data-ln-translations-lang", o), r.textContent = this.locales[o], r.addEventListener("click", function(f) {
        f.ctrlKey || f.metaKey || f.button === 1 || (f.preventDefault(), f.stopPropagation(), _.menuEl.getAttribute("data-ln-toggle") === "open" && _.menuEl.setAttribute("data-ln-toggle", "close"), _.addLanguage(o));
      }), this.menuEl.appendChild(c);
    }
    const u = this.dom.querySelector("[" + l + "-add]");
    u && (u.hidden = h === 0);
  }, v.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const _ = this;
    this.activeLanguages.forEach(function(h) {
      const u = Tt("ln-translations-badge", "ln-translations");
      if (!u) return;
      const o = u.querySelector("[data-ln-translations-lang]");
      o.setAttribute("data-ln-translations-lang", h);
      const c = o.querySelector("span");
      c.textContent = _.locales[h] || h.toUpperCase();
      const r = o.querySelector("button"), f = _.locales[h] || h.toUpperCase();
      r.setAttribute("aria-label", _.removeLabel.replace("{lang}", f)), r.addEventListener("click", function(p) {
        p.ctrlKey || p.metaKey || p.button === 1 || (p.preventDefault(), p.stopPropagation(), _.removeLanguage(h));
      }), _.badgesEl.appendChild(u);
    });
  }, v.prototype.addLanguage = function(_, h) {
    if (this.activeLanguages.has(_)) return;
    const u = this.locales[_] || _;
    if (G(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: _,
      langName: u
    }).defaultPrevented) return;
    this.activeLanguages.add(_), h = h || {};
    const c = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const r of c) {
      const f = r.getAttribute("data-ln-translatable"), p = r.getAttribute("data-ln-translations-prefix") || "", m = r.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!m) continue;
      const y = m.cloneNode(m.tagName === "SELECT");
      p ? y.name = p + "[trans][" + _ + "][" + f + "]" : y.name = "trans[" + _ + "][" + f + "]", y.value = h[f] !== void 0 ? h[f] : "", y.removeAttribute("id"), "placeholder" in y && (y.placeholder = this.placeholderLabel.replace("{lang}", u)), y.setAttribute("data-ln-translatable-lang", _);
      const i = r.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), s = i.length > 0 ? i[i.length - 1] : m;
      s.parentNode.insertBefore(y, s.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: _,
      langName: u
    });
  }, v.prototype.removeLanguage = function(_) {
    if (!this.activeLanguages.has(_) || G(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: _
    }).defaultPrevented) return;
    const u = this.dom.querySelectorAll('[data-ln-translatable-lang="' + _ + '"]');
    for (const o of u)
      o.parentNode.removeChild(o);
    this.activeLanguages.delete(_), this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: _
    });
  }, v.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, v.prototype.hasLanguage = function(_) {
    return this.activeLanguages.has(_);
  }, v.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const _ = this.defaultLang, h = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const u of h)
      u.getAttribute("data-ln-translatable-lang") !== _ && u.parentNode.removeChild(u);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[a];
  }, B(l, a, v, "ln-translations");
})();
(function() {
  const l = "data-ln-autosave", a = "lnAutosave", b = "data-ln-autosave-clear", v = "data-ln-autosave-debounce-input", _ = '[data-ln-autosave-exclude], input[type="password"]', h = "ln-autosave:";
  if (window[a] !== void 0) return;
  function o(p) {
    const m = c(p);
    if (!m) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", p);
      return;
    }
    this.dom = p, this.key = m;
    let y = null;
    function i() {
      const n = ue(p, { exclude: _ });
      try {
        localStorage.setItem(m, JSON.stringify(n));
      } catch {
        return;
      }
      L(p, "ln-autosave:saved", { target: p, data: n });
    }
    function s() {
      let n;
      try {
        n = localStorage.getItem(m);
      } catch {
        return;
      }
      if (!n) return;
      let d;
      try {
        d = JSON.parse(n);
      } catch {
        return;
      }
      if (G(p, "ln-autosave:before-restore", { target: p, data: d }).defaultPrevented) return;
      const E = he(p, d);
      for (let w = 0; w < E.length; w++)
        E[w].dispatchEvent(new Event("input", { bubbles: !0 })), E[w].dispatchEvent(new Event("change", { bubbles: !0 }));
      L(p, "ln-autosave:restored", { target: p, data: d });
    }
    function t() {
      try {
        localStorage.removeItem(m);
      } catch {
        return;
      }
      L(p, "ln-autosave:cleared", { target: p });
    }
    this._onFocusout = function(n) {
      const d = n.target;
      r(d) && d.name && !d.matches(_) && i();
    }, this._onChange = function(n) {
      const d = n.target;
      r(d) && d.name && !d.matches(_) && i();
    }, this._onSubmit = function() {
      t();
    }, this._onReset = function() {
      t();
    }, this._onClearClick = function(n) {
      n.target.closest("[" + b + "]") && t();
    }, p.addEventListener("focusout", this._onFocusout), p.addEventListener("change", this._onChange), p.addEventListener("submit", this._onSubmit), p.addEventListener("reset", this._onReset), p.addEventListener("click", this._onClearClick);
    const e = f(p);
    return e > 0 && (this._onInput = function(n) {
      const d = n.target;
      !r(d) || !d.name || d.matches(_) || (y !== null && clearTimeout(y), y = setTimeout(i, e));
    }, p.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return y;
    }, s(), this;
  }
  o.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const p = this._getInputTimer();
        p !== null && clearTimeout(p);
      }
      L(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[a];
    }
  };
  function c(p) {
    const y = p.getAttribute(l) || p.id;
    return y ? h + window.location.pathname + ":" + y : null;
  }
  function r(p) {
    const m = p.tagName;
    return m === "INPUT" || m === "TEXTAREA" || m === "SELECT";
  }
  function f(p) {
    if (!p.hasAttribute(v)) return 0;
    const m = p.getAttribute(v);
    if (m === "" || m === null) return 1e3;
    const y = parseInt(m, 10);
    return isNaN(y) || y < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", p), 1e3) : y;
  }
  B(l, a, o, "ln-autosave");
})();
(function() {
  const l = "data-ln-autoresize", a = "lnAutoresize";
  if (window[a] !== void 0) return;
  function b(v) {
    if (v.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", v.tagName), this;
    this.dom = v;
    const _ = this;
    return this._onInput = function() {
      _._resize();
    }, v.addEventListener("input", this._onInput), this._resize(), this;
  }
  b.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, b.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[a]);
  }, B(l, a, b, "ln-autoresize");
})();
(function() {
  const l = "data-ln-editor", a = "lnEditor";
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
  }, v = {
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
  }, h = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let u = 0;
  function o(t) {
    return !!(v[t] || _[t] || h[t] || t === "link");
  }
  function c(t) {
    this.dom = t;
    const e = this;
    if (this._textarea = t.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", t), this;
    const n = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), n && this._surface.setAttribute("data-placeholder", n);
    const d = this._textarea.id;
    if (d) {
      const A = t.querySelector('label[for="' + d + '"]');
      A && (A.id || (A.id = d + "-label"), this._surface.setAttribute("aria-labelledby", A.id));
    }
    this._surface.id = d ? d + "-surface" : "ln-editor-surface-" + ++u;
    const g = this._textarea.value.trim();
    g && (this._surface.innerHTML = g);
    const E = t.querySelector('[role="toolbar"]');
    if (E && E.nextSibling ? t.insertBefore(this._surface, E.nextSibling) : t.appendChild(this._surface), E) {
      E.setAttribute("aria-controls", this._surface.id);
      const A = E.querySelectorAll("[data-ln-editor-action]");
      for (let S = 0; S < A.length; S++) {
        const q = A[S].getAttribute("data-ln-editor-action");
        o(q) && A[S].setAttribute("aria-pressed", "false");
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
      p(e, A);
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
  c.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, c.prototype._execAction = function(t) {
    if (!(!t || G(this.dom, "ln-editor:before-change", {
      action: t,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), v[t])
        document.execCommand(v[t], !1, null);
      else if (_[t]) {
        const n = _[t], d = r(this._surface);
        d && d.toLowerCase() === n ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + n + ">");
      } else h[t] ? document.execCommand(h[t], !1, null) : t === "link" ? s(this) : t === "unlink" ? document.execCommand("unlink", !1, null) : t === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, c.prototype._updateActiveStates = function() {
    const t = this.dom.querySelector('[role="toolbar"]');
    if (!t) return;
    const e = window.getSelection();
    if (!e || e.rangeCount === 0) return;
    const n = e.anchorNode;
    if (!n || !this._surface.contains(n)) return;
    const d = t.querySelectorAll("[data-ln-editor-action]");
    for (let g = 0; g < d.length; g++) {
      const E = d[g], w = E.getAttribute("data-ln-editor-action");
      let A = !1;
      if (v[w])
        try {
          A = document.queryCommandState(v[w]);
        } catch {
        }
      else if (_[w]) {
        const S = r(this._surface);
        A = S && S.toLowerCase() === _[w];
      } else if (h[w])
        try {
          A = document.queryCommandState(h[w]);
        } catch {
        }
      else w === "link" && (A = !!f(e.anchorNode, "A", this._surface));
      o(w) && E.setAttribute("aria-pressed", String(A)), A ? E.classList.add("ln-editor-active") : E.classList.remove("ln-editor-active");
    }
  }, c.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, c.prototype.setHTML = function(t) {
    this._surface && (this._surface.innerHTML = t, this._syncToTextarea(), L(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, c.prototype.destroy = function() {
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
  function r(t) {
    const e = window.getSelection();
    if (!e || e.rangeCount === 0) return null;
    let n = e.anchorNode;
    if (!n) return null;
    for (; n && n !== t; ) {
      if (n.nodeType === 1) {
        const d = n.tagName;
        if (d === "H2" || d === "H3" || d === "H4" || d === "BLOCKQUOTE" || d === "PRE" || d === "P")
          return d;
      }
      n = n.parentNode;
    }
    return null;
  }
  function f(t, e, n) {
    for (; t && t !== n; ) {
      if (t.nodeType === 1 && t.tagName === e)
        return t;
      t = t.parentNode;
    }
    return null;
  }
  function p(t, e) {
    e.preventDefault();
    let n = "";
    if (e.clipboardData && (n = e.clipboardData.getData("text/html"), !n)) {
      const g = e.clipboardData.getData("text/plain");
      g && (n = g.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), n = "<p>" + n + "</p>");
    }
    if (!n) return;
    const d = m(n);
    d && document.execCommand("insertHTML", !1, d);
  }
  function m(t) {
    const e = document.createElement("div");
    return e.innerHTML = t, y(e), e.innerHTML;
  }
  function y(t) {
    const e = Array.from(t.childNodes);
    for (let n = 0; n < e.length; n++) {
      const d = e[n];
      if (d.nodeType !== 3) {
        if (d.nodeType !== 1) {
          t.removeChild(d);
          continue;
        }
        if (b[d.tagName]) {
          const g = Array.from(d.attributes);
          for (let E = 0; E < g.length; E++) {
            const w = g[E].name;
            if (d.tagName === "A" && w === "href") {
              const A = d.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(A) || d.removeAttribute("href");
            } else
              d.removeAttribute(w);
          }
          d.tagName === "A" && d.setAttribute("rel", "noopener noreferrer"), y(d);
        } else {
          for (; d.firstChild; )
            t.insertBefore(d.firstChild, d);
          t.removeChild(d);
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
  function s(t) {
    const e = window.getSelection();
    if (!e || e.rangeCount === 0) return;
    const n = f(e.anchorNode, "A", t._surface), d = e.getRangeAt(0).cloneRange();
    t._closeLinkPopover && t._closeLinkPopover();
    const g = ct(t.dom, "ln-editor-link-popover", "ln-editor");
    if (!g) return;
    const E = g.firstElementChild;
    if (!E) return;
    const w = E.querySelector('input[type="url"]'), A = E.querySelector('[data-ln-editor-action="confirm-link"]'), S = E.querySelector('[data-ln-editor-action="cancel-link"]');
    n && (w.value = n.getAttribute("href") || "");
    const q = t.dom.querySelector('[role="toolbar"]');
    q ? q.after(E) : t.dom.insertBefore(E, t._surface), w.focus();
    function T() {
      const H = window.getSelection();
      H.removeAllRanges(), H.addRange(d);
    }
    function x() {
      document.removeEventListener("mousedown", z), t._closeLinkPopover = null, E.remove();
    }
    function k() {
      const H = w.value.trim();
      if (x(), T(), t._surface.focus(), H)
        if (n)
          n.setAttribute("href", H), n.setAttribute("rel", "noopener noreferrer"), t._syncToTextarea(), L(t.dom, "ln-editor:changed", {
            html: t._textarea.value,
            target: t.dom
          });
        else {
          document.execCommand("createLink", !1, H);
          const U = window.getSelection();
          if (U && U.anchorNode) {
            const K = f(U.anchorNode, "A", t._surface);
            K && (K.setAttribute("rel", "noopener noreferrer"), t._syncToTextarea());
          }
        }
      else n && document.execCommand("unlink", !1, null);
    }
    function R() {
      x(), T(), t._surface.focus();
    }
    function N() {
      x();
    }
    function z(H) {
      const U = t.dom.contains(H.target) && H.target.closest('[data-ln-editor-action="link"]');
      !E.contains(H.target) && !U && N();
    }
    t._closeLinkPopover = x, A.addEventListener("click", k), S.addEventListener("click", R), w.addEventListener("keydown", function(H) {
      H.key === "Enter" ? (H.preventDefault(), k()) : H.key === "Escape" && (H.preventDefault(), R());
    }), document.addEventListener("mousedown", z);
  }
  B(l, a, c, "ln-editor");
})();
(function() {
  const l = "lnFill";
  if (window[l] !== void 0) return;
  const a = { lnFillForm: !0, lnFillStore: !0 };
  function b(_) {
    const h = {}, u = _.dataset;
    for (const o in u) {
      if (!o.startsWith("lnFill") || a[o]) continue;
      const c = o.slice(6);
      c && (h[c.charAt(0).toLowerCase() + c.slice(1)] = u[o]);
    }
    return h;
  }
  function v(_, h) {
    const u = window.CSS && CSS.escape ? CSS.escape(h) : h, o = document.querySelectorAll('[data-ln-fill-id="' + u + '"]');
    if (o.length === 0) return null;
    for (let c = 0; c < o.length; c++) {
      const r = o[c].getAttribute("data-ln-fill-form");
      if (r) {
        const f = document.getElementById(r);
        if (f && _.contains(f)) return o[c];
      }
    }
    return o[0];
  }
  document.addEventListener("click", function(_) {
    if (_.ctrlKey || _.metaKey || _.button === 1) return;
    const h = _.target.closest("[data-ln-fill-form]");
    if (!h) return;
    const u = h.getAttribute("href");
    if (u && u.indexOf("#") !== -1) return;
    const o = h.getAttribute("data-ln-fill-form"), c = document.getElementById(o);
    if (!c) return;
    const r = b(h), f = Object.keys(r).length > 0;
    window.lnCore.lnFill(c, f ? r : null);
  }), document.addEventListener("ln-fill:request", function(_) {
    const h = _.detail;
    if (!h) return;
    const u = _.target, o = h.id;
    if (o == null) {
      window.lnCore.lnFill(u, null);
      return;
    }
    const c = v(u, o);
    if (!c) return;
    const r = b(c);
    window.lnCore.lnFill(u, r);
  }), window[l] = !0;
})();
(function() {
  const l = "data-ln-slug-from", a = "lnSlug";
  if (window[a] !== void 0) return;
  function b(_) {
    return String(_).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function v(_) {
    if (_.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", _.tagName), this;
    const h = _.form;
    if (!h)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", _), this;
    const u = _.getAttribute(l), o = h.elements[u];
    if (!o)
      return console.warn('[ln-slug] Source field "' + u + '" not found in form:', _), this;
    if (typeof o.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + u + '" is a RadioNodeList (same-name group) — single source field required:', _), this;
    this.dom = _, this.source = o, this._pristine = _.value === "", this._mirroring = !1;
    const c = this;
    return this._onSource = function() {
      c._pristine && c._mirror();
    }, this._onSlug = function() {
      c._mirroring || (c._pristine = c.dom.value === "");
    }, o.addEventListener("input", this._onSource), _.addEventListener("input", this._onSlug), this;
  }
  v.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = b(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, v.prototype.destroy = function() {
    this.dom[a] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[a]);
  }, B(l, a, v, "ln-slug");
})();
(function() {
  const l = "data-ln-time", a = "lnTime";
  if (window[a] !== void 0) return;
  const b = {}, v = {};
  function _(w) {
    return w.getAttribute("data-ln-time-locale") || W(w);
  }
  function h(w, A) {
    const S = (w || "") + "|" + JSON.stringify(A);
    return b[S] || (b[S] = new Intl.DateTimeFormat(w, A)), b[S];
  }
  function u(w) {
    const A = w || "";
    return v[A] || (v[A] = new Intl.RelativeTimeFormat(w, { numeric: "auto", style: "narrow" })), v[A];
  }
  const o = /* @__PURE__ */ new Set();
  let c = null;
  function r() {
    c || (c = setInterval(p, 6e4));
  }
  function f() {
    c && (clearInterval(c), c = null);
  }
  function p() {
    for (const w of o) {
      if (!document.body.contains(w.dom)) {
        o.delete(w);
        continue;
      }
      e(w);
    }
    o.size === 0 && f();
  }
  function m(w, A) {
    const S = wt(A), q = (A || "").toLowerCase().split("-")[0], T = h(A, { dateStyle: "long", timeStyle: "short" }), x = T.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (S && x !== q && S.monthsLong) {
      const k = S.monthsLong[w.getMonth()], R = w.getDate(), N = w.getFullYear(), z = String(w.getHours()).padStart(2, "0"), H = String(w.getMinutes()).padStart(2, "0");
      return `${R} ${k} ${N} во ${z}:${H}`;
    }
    return T.format(w);
  }
  function y(w, A) {
    const S = /* @__PURE__ */ new Date(), q = { month: "short", day: "numeric" };
    w.getFullYear() !== S.getFullYear() && (q.year = "numeric");
    const T = wt(A), x = (A || "").toLowerCase().split("-")[0], k = h(A, q), R = k.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (T && R !== x && T.monthsShort) {
      const N = T.monthsShort[w.getMonth()], z = w.getDate(), H = w.getFullYear() !== S.getFullYear() ? " " + w.getFullYear() : "";
      return `${z} ${N}${H}`;
    }
    return k.format(w);
  }
  function i(w, A) {
    return h(A, { dateStyle: "medium" }).format(w);
  }
  function s(w, A) {
    return h(A, { timeStyle: "short" }).format(w);
  }
  function t(w, A) {
    const S = Math.floor(Date.now() / 1e3), T = Math.floor(w.getTime() / 1e3) - S, x = Math.abs(T);
    if (x < 10) return u(A).format(0, "second");
    let k, R;
    if (x < 60)
      k = "second", R = T;
    else if (x < 3600)
      k = "minute", R = Math.round(T / 60);
    else if (x < 86400)
      k = "hour", R = Math.round(T / 3600);
    else if (x < 604800)
      k = "day", R = Math.round(T / 86400);
    else if (x < 2592e3)
      k = "week", R = Math.round(T / 604800);
    else
      return y(w, A);
    return u(A).format(R, k);
  }
  function e(w) {
    const A = w.dom.getAttribute("datetime");
    if (!A) return;
    const S = Number(A);
    if (isNaN(S)) return;
    const q = new Date(S * 1e3), T = w.dom.getAttribute(l) || "short", x = _(w.dom);
    let k;
    switch (T) {
      case "relative":
        k = t(q, x);
        break;
      case "full":
        k = m(q, x);
        break;
      case "date":
        k = i(q, x);
        break;
      case "time":
        k = s(q, x);
        break;
      default:
        k = y(q, x);
        break;
    }
    w.dom.textContent = k, T !== "full" && (w.dom.title = m(q, x));
  }
  function n(w) {
    return this.dom = w, e(this), w.getAttribute(l) === "relative" && (o.add(this), r()), this;
  }
  n.prototype.render = function() {
    e(this);
  }, n.prototype.destroy = function() {
    o.delete(this), o.size === 0 && f(), delete this.dom[a];
  };
  function d(w) {
    const A = w[a];
    if (!A) return;
    w.getAttribute(l) === "relative" ? (o.add(A), r()) : (o.delete(A), o.size === 0 && f()), e(A);
  }
  function g(w) {
    w.nodeType === 1 && w.hasAttribute && w.hasAttribute(l) && w[a] && e(w[a]);
  }
  function E() {
    new MutationObserver(function() {
      const w = document.querySelectorAll("[" + l + "]");
      for (let A = 0; A < w.length; A++) {
        const S = w[A][a];
        S && e(S);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  B(l, a, n, "ln-time", {
    extraAttributes: ["datetime", "data-ln-time-locale", "lang"],
    onAttributeChange: d,
    onInit: g
  }), E();
})();
function dn(l) {
  l = l || {};
  let a = l.windowSize > 0 ? l.windowSize : 1e3, b = l.pageSize > 0 ? l.pageSize : 200, v = l.fetchDebounce != null ? l.fetchDebounce : 120;
  const _ = typeof l.requestPage == "function" ? l.requestPage : function() {
  }, h = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  let c = 0, r = 0, f = 0, p = null, m = 0;
  function y(t) {
    u.set(t, ++m);
  }
  function i() {
    if (h.size <= a) return;
    const t = Array.from(h.keys()).sort(function(n, d) {
      return (u.get(n) || 0) - (u.get(d) || 0);
    });
    let e = 0;
    for (; h.size > a && e < t.length; )
      h.delete(t[e]), u.delete(t[e]), e++;
  }
  function s(t, e, n) {
    o.add(t), _(t, e, n);
  }
  return {
    get logicalTotal() {
      return c;
    },
    set logicalTotal(t) {
      c = t;
    },
    get grandTotal() {
      return r;
    },
    set grandTotal(t) {
      r = t;
    },
    get queryGen() {
      return f;
    },
    set queryGen(t) {
      f = t;
    },
    get size() {
      return h.size;
    },
    getId: function(t) {
      if (h.has(t))
        return y(t), h.get(t);
    },
    // The caller asks for an exact range it already decided it needs — the
    // index is an id resolver, not a scroll surface. Prefetch padding is the
    // view's job (it owns the viewport); padding here would fetch a page
    // nobody asked for on top of every page the view asks for.
    ensure: function(t, e, n) {
      if (c <= 0) {
        o.has(0) || (clearTimeout(p), p = setTimeout(function() {
          s(0, b, n);
        }, v));
        return;
      }
      const d = Math.max(0, t), g = Math.min(c, e), E = Math.floor(d / b), w = Math.floor(Math.max(0, g - 1) / b);
      let A = -1;
      for (let S = E; S <= w; S++) {
        const q = S * b, T = Math.min(b, c - q);
        let x = !1;
        const k = Math.max(q, d), R = Math.min(q + T, g);
        for (let N = k; N < R; N++)
          if (!h.has(N)) {
            x = !0;
            break;
          }
        if (x && !o.has(q)) {
          A = q;
          break;
        }
      }
      A !== -1 && (clearTimeout(p), p = setTimeout(function() {
        s(A, b, n);
      }, v));
    },
    ingest: function(t, e, n, d, g) {
      if (!(g != null && g !== f)) {
        r = n ?? r, c = d ?? c;
        for (let E = 0; E < e.length; E++)
          h.set(t + E, e[E]), y(t + E);
        o.delete(t), i();
      }
    },
    // Query change: new generation, positions dropped. The totals are kept
    // as the stale-while-revalidate carry-over the view renders against
    // until the new generation's first page lands in ingest() — same
    // contract as createWindowCache.invalidate().
    reset: function() {
      f++, h.clear(), u.clear(), o.clear(), clearTimeout(p);
    },
    clear: function() {
      h.clear(), u.clear(), o.clear(), clearTimeout(p);
    },
    configure: function(t) {
      if (t = t || {}, t.windowSize != null && t.windowSize > 0 && t.windowSize !== a) {
        const e = t.windowSize < a;
        a = t.windowSize, e && i();
      }
      t.pageSize != null && t.pageSize > 0 && (b = t.pageSize), t.fetchDebounce != null && t.fetchDebounce >= 0 && (v = t.fetchDebounce);
    }
  };
}
(function() {
  const l = "data-ln-data-store", a = "lnDataStore";
  if (window[a] !== void 0) return;
  const b = "ln_app_cache", v = "_meta", _ = "1.0";
  let h = null, u = null;
  const o = {};
  function c(C) {
    C && C.name === "QuotaExceededError" && L(document, "ln-data-store:quota-exceeded", { error: C });
  }
  function r() {
    const C = {};
    for (const I of document.querySelectorAll(`[${l}]`)) {
      const D = I.id;
      if (D) {
        const M = I.getAttribute("data-ln-data-store-indexes") || "";
        C[D] = {
          indexes: M.split(",").map((O) => O.trim()).filter(Boolean)
        };
      }
    }
    return C;
  }
  function f() {
    return u || (u = new Promise((C) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), C(null);
      const I = r(), D = Object.keys(I), M = indexedDB.open(b);
      M.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), C(null);
      }, M.onsuccess = (O) => {
        const F = O.target.result, P = Array.from(F.objectStoreNames);
        if (!(!P.includes(v) || D.some((Z) => !P.includes(Z))))
          return p(F), h = F, C(F);
        const V = F.version;
        F.close();
        const Q = indexedDB.open(b, V + 1);
        Q.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, Q.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), C(null);
        }, Q.onupgradeneeded = (Z) => {
          const rt = Z.target.result;
          rt.objectStoreNames.contains(v) || rt.createObjectStore(v, { keyPath: "key" });
          for (const Ot of D)
            if (!rt.objectStoreNames.contains(Ot)) {
              const He = rt.createObjectStore(Ot, { keyPath: "id" });
              for (const te of I[Ot].indexes)
                He.createIndex(te, te, { unique: !1 });
            }
        }, Q.onsuccess = (Z) => {
          const rt = Z.target.result;
          p(rt), h = rt, C(rt);
        };
      };
    }), u);
  }
  function p(C) {
    C.onversionchange = () => {
      C.close(), h = null, u = null;
    };
  }
  function m() {
    return h ? Promise.resolve(h) : (u = null, f());
  }
  async function y(C) {
    if (!dt() || !C) return C;
    const I = { ...C }, D = I.id, M = await Xe(I);
    return !M || !M.encrypted ? C : {
      id: D,
      encrypted: !0,
      iv: M.iv,
      data: M.data
    };
  }
  async function i(C) {
    return !C || !C.encrypted || !dt() ? C : Ye(C);
  }
  const s = (C, I) => m().then((D) => D ? D.transaction(C, I).objectStore(C) : null);
  function t(C) {
    return new Promise((I, D) => {
      C.onsuccess = () => I(C.result), C.onerror = () => {
        c(C.error), D(C.error);
      };
    });
  }
  const e = (C) => s(C, "readonly").then((I) => I ? t(I.getAll()) : []).then((I) => dt() ? Promise.all(I.map((D) => i(D))) : I), n = (C, I) => s(C, "readonly").then((D) => D ? t(D.get(I)) : null).then((D) => D ? i(D) : null), d = (C, I) => m().then((D) => {
    if (!D) return [];
    const O = D.transaction(C, "readonly").objectStore(C), F = I.map((P) => t(O.get(P)));
    return Promise.all(F).then((P) => dt() ? Promise.all(P.map((j) => i(j))) : P);
  }), g = (C, I) => (dt() ? y(I) : Promise.resolve(I)).then((M) => s(C, "readwrite").then((O) => O ? t(O.put(M)) : null)), E = (C, I) => s(C, "readwrite").then((D) => D ? t(D.delete(I)) : null), w = (C) => s(C, "readwrite").then((I) => I ? t(I.clear()) : null), A = (C) => s(C, "readonly").then((I) => I ? t(I.count()) : 0), S = (C) => s(v, "readonly").then((I) => I ? t(I.get(C)) : null), q = (C, I) => s(v, "readwrite").then((D) => {
    if (D)
      return I.key = C, t(D.put(I));
  });
  function T(C) {
    this.dom = C, this._name = C.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", C);
    const I = C.getAttribute("data-ln-data-store-stale"), D = parseInt(I, 10);
    this._staleThreshold = I === "never" || I === "-1" ? -1 : isNaN(D) ? 300 : D;
    const M = C.getAttribute("data-ln-data-store-search-fields") || "";
    this._searchFields = M.split(",").map((F) => F.trim()).filter(Boolean), this._handlers = null, this.isLoaded = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null };
    const O = C.getAttribute("data-ln-data-store-window");
    if (O !== null) {
      const F = parseInt(O, 10) || 1e3, P = parseInt(C.getAttribute("data-ln-data-store-window-page"), 10) || 200;
      this._windowIndex = dn({
        windowSize: F,
        pageSize: P,
        requestPage: (j, V, Q) => {
          L(this.dom, "ln-data-store:request-page", {
            store: this._name,
            offset: j,
            limit: V,
            query: Q,
            queryGen: this._windowIndex.queryGen
          });
        }
      });
    } else
      this._windowIndex = null;
    return this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), o[this._name] = this, x(this), this.ready = it(this), this;
  }
  function x(C) {
    C._handlers = {
      create: (I) => k(C, "create", I.detail, () => N(C, I.detail)),
      update: (I) => k(C, "update", I.detail, () => z(C, I.detail)),
      delete: (I) => k(C, "delete", I.detail, () => H(C, I.detail)),
      "bulk-delete": (I) => k(C, "bulk-delete", I.detail, () => U(C, I.detail)),
      "sync-failed": (I) => {
        C.isSyncing = !1, L(C.dom, "ln-data-store:sync-error", {
          store: C._name,
          error: I.detail && I.detail.error,
          status: I.detail && I.detail.status
        });
      }
    };
    for (const [I, D] of Object.entries(C._handlers))
      C.dom.addEventListener(`ln-data-store:request-${I}`, D);
    C._queryHandlers = {
      "ln-search:change": (I) => {
        I.preventDefault();
        const D = I.detail && I.detail.term != null ? I.detail.term : "";
        D !== C.query.search && (C.query.search = D, Rt(C));
      },
      "ln-filter:change": (I) => {
        I.preventDefault();
        const D = I.detail && I.detail.key;
        if (!D) return;
        const M = (I.detail.values || []).slice(), O = C.query.filters[D];
        (O ? O.length === M.length && O.every((P, j) => P === M[j]) : !M.length) || (M.length ? C.query.filters[D] = M : delete C.query.filters[D], Rt(C));
      },
      "ln-sort:change": (I) => {
        I.preventDefault();
        const D = I.detail && I.detail.field, M = I.detail && I.detail.direction, O = M && M !== "none" ? { field: D, direction: M } : null, F = C.query.sort;
        !F && !O || F && O && F.field === O.field && F.direction === O.direction || (C.query.sort = O, Rt(C));
      }
    };
    for (const [I, D] of Object.entries(C._queryHandlers))
      C.dom.addEventListener(I, D);
  }
  function k(C, I, D, M) {
    const O = D && D.requestId;
    return C._mutationChain = C._mutationChain.then(() => C.ready).then(() => {
      if (C.initializationError) throw C.initializationError;
      return M();
    }).catch((F) => K(C, I, O, F)), C._mutationChain;
  }
  function R(C) {
    return A(C._name).then((I) => (C.totalCount = I, C.hasCache = !0, C.isLoaded = !0, q(C._name, {
      schema_version: _,
      last_synced_at: C.lastSyncedAt,
      has_cache: !0,
      record_count: I
    })));
  }
  function N(C, { tempId: I, data: D = {}, requestId: M } = {}) {
    const O = { ...D, id: I };
    return g(C._name, O).then(() => R(C)).then(() => {
      L(C.dom, "ln-data-store:created", { store: C._name, record: O, tempId: I, requestId: M });
    });
  }
  function z(C, { id: I, data: D = {}, requestId: M } = {}) {
    return n(C._name, I).then((O) => {
      if (!O) throw new Error(`Record not found: ${I}`);
      const F = { ...O, ...D }, P = D.id;
      return (P !== void 0 && P !== I ? Re(C._name, I, F) : g(C._name, F)).then(() => R(C)).then(() => {
        L(C.dom, "ln-data-store:updated", { store: C._name, record: F, previous: O, requestId: M });
      });
    });
  }
  function H(C, { id: I, requestId: D } = {}) {
    return n(C._name, I).then((M) => {
      if (!M) {
        L(C.dom, "ln-data-store:deleted", { store: C._name, id: I, requestId: D, missing: !0 });
        return;
      }
      return E(C._name, I).then(() => R(C)).then(() => {
        L(C.dom, "ln-data-store:deleted", { store: C._name, id: I, requestId: D });
      });
    });
  }
  function U(C, { ids: I = [], requestId: D } = {}) {
    return I.length ? Promise.all(I.map((M) => n(C._name, M))).then((M) => {
      const O = M.filter(Boolean).map((F) => F.id);
      return Jt(C._name, O).then(() => R(C)).then(() => {
        L(C.dom, "ln-data-store:deleted", { store: C._name, ids: O, requestId: D });
      });
    }) : (L(C.dom, "ln-data-store:deleted", { store: C._name, ids: [], requestId: D }), Promise.resolve());
  }
  function K(C, I, D, M) {
    console.error("[ln-data-store] " + I + " failed:", M), L(C.dom, "ln-data-store:mutation-error", {
      store: C._name,
      action: I,
      requestId: D,
      error: M
    });
  }
  function it(C) {
    return f().then((I) => {
      if (!I) throw new Error("IndexedDB is unavailable");
      return S(C._name);
    }).then((I) => {
      if (C.initializationError = null, I && I.schema_version === _)
        C.lastSyncedAt = I.last_synced_at || null, C.totalCount = I.record_count || 0, C.hasCache = I.has_cache === !0 || C.totalCount > 0, C.hasCache && (C.isLoaded = !0, L(C.dom, "ln-data-store:ready", { store: C._name, count: C.totalCount, source: "cache" })), C.isInitialized = !0, L(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: C.hasCache, lastSyncedAt: C.lastSyncedAt, count: C.totalCount });
      else {
        if (I && I.schema_version !== _)
          return w(C._name).then(() => q(C._name, { schema_version: _, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            C.isInitialized = !0, C.hasCache = !1, L(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        C.isInitialized = !0, C.hasCache = !1, L(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((I) => (C.isInitialized = !0, C.isLoaded = !1, C.hasCache = !1, C.isSyncing = !1, C.initializationError = I, L(C.dom, "ln-data-store:initialization-error", { store: C._name, error: I }), { ok: !1, error: I }));
  }
  function Xt(C) {
    C.isSyncing = !0, L(C.dom, "ln-data-store:request-remote-sync", { since: C.lastSyncedAt });
  }
  function Yt(C, I) {
    return m().then((D) => D ? (dt() ? Promise.all(I.map((O) => y(O))) : Promise.resolve(I)).then((O) => new Promise((F, P) => {
      const j = D.transaction(C, "readwrite"), V = j.objectStore(C);
      O.forEach((Q) => V.put(Q)), j.oncomplete = () => F(), j.onerror = () => {
        c(j.error), P(j.error);
      };
    })) : void 0);
  }
  function Jt(C, I) {
    return m().then((D) => {
      if (D)
        return new Promise((M, O) => {
          const F = D.transaction(C, "readwrite"), P = F.objectStore(C);
          I.forEach((j) => P.delete(j)), F.oncomplete = () => M(), F.onerror = () => O(F.error);
        });
    });
  }
  function Re(C, I, D) {
    return (dt() ? y(D) : Promise.resolve(D)).then((O) => m().then((F) => {
      if (F)
        return new Promise((P, j) => {
          const V = F.transaction(C, "readwrite"), Q = V.objectStore(C);
          Q.put(O), Q.delete(I), V.oncomplete = () => P(), V.onerror = () => {
            c(V.error), j(V.error);
          };
        });
    }));
  }
  const Oe = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function Me(C, I) {
    if (!I || !I.field) return C;
    const { field: D, direction: M } = I, O = M === "desc";
    return [...C].sort((F, P) => {
      const j = F[D], V = P[D];
      if (j == null && V == null) return 0;
      if (j == null) return O ? 1 : -1;
      if (V == null) return O ? -1 : 1;
      const Q = typeof j == "string" && typeof V == "string" ? Oe.compare(j, V) : j < V ? -1 : j > V ? 1 : 0;
      return O ? -Q : Q;
    });
  }
  function Zt(C, I) {
    if (!I) return C;
    const D = Object.keys(I).filter((M) => Array.isArray(I[M]) && I[M].length > 0);
    return D.length ? C.filter(
      (M) => D.every((O) => I[O].map(String).includes(String(M[O])))
    ) : C;
  }
  function Fe(C, I, D) {
    if (!I || !D || !D.length) return C;
    const M = I.toLowerCase();
    return C.filter(
      (O) => D.some((F) => {
        const P = O[F];
        return P != null && String(P).toLowerCase().includes(M);
      })
    );
  }
  function Ne(C, I, D) {
    if (!C.length) return 0;
    if (D === "count") return C.length;
    const M = C.map((F) => parseFloat(F[I])).filter((F) => !isNaN(F)), O = M.reduce((F, P) => F + P, 0);
    return D === "sum" ? O : D === "avg" && M.length ? O / M.length : 0;
  }
  function St(C, I) {
    if (!C.presenters || !C.presenters.computed) return I;
    const D = C.presenters.computed;
    return I.map((M) => {
      if (!M) return null;
      const O = { ...M };
      for (const [F, P] of Object.entries(D))
        try {
          O[F] = P(M);
        } catch (j) {
          console.error(`[ln-data-store] Decorator computed field failed for ${F}`, j);
        }
      return O;
    });
  }
  T.prototype.getAll = function(C = {}) {
    const I = this;
    if (I._windowIndex) {
      const D = C.offset || 0, M = C.limit || 200;
      I._windowIndex.ensure(D, D + M, C);
      const O = [];
      for (let P = D; P < D + M; P++) {
        const j = I._windowIndex.getId(P);
        O.push(j);
      }
      const F = Array.from(new Set(O.filter((P) => P !== void 0)));
      return d(I._name, F).then((P) => {
        const j = /* @__PURE__ */ new Map();
        for (let Q = 0; Q < P.length; Q++) {
          const Z = P[Q];
          Z && j.set(String(Z.id), Z);
        }
        const V = [];
        for (let Q = 0; Q < O.length; Q++) {
          const Z = O[Q];
          if (Z === void 0)
            V.push(null);
          else {
            const rt = j.get(String(Z));
            V.push(rt || null);
          }
        }
        return {
          data: St(I, V),
          total: I._windowIndex.grandTotal,
          filtered: I._windowIndex.logicalTotal,
          offset: D,
          queryGen: I._windowIndex.queryGen
        };
      });
    }
    return e(I._name).then((D) => {
      const M = D.length;
      C.filters && (D = Zt(D, C.filters)), C.search && (D = Fe(D, C.search, I._searchFields));
      const O = D.length;
      if (C.sort && (D = Me(D, C.sort)), C.offset || C.limit) {
        const F = C.offset || 0, P = C.limit || D.length;
        D = D.slice(F, F + P);
      }
      return {
        data: St(I, D),
        total: M,
        filtered: O
      };
    });
  }, T.prototype.getById = function(C) {
    return n(this._name, C).then((I) => I ? St(this, [I])[0] : null);
  }, T.prototype.count = function(C) {
    return C ? e(this._name).then((I) => Zt(I, C).length) : A(this._name);
  }, T.prototype.aggregate = function(C, I) {
    return e(this._name).then((D) => Ne(D, C, I));
  }, T.prototype.setPresenters = function(C) {
    this.presenters = C;
  }, T.prototype.applySync = function(C, I, D, M) {
    M = M || {};
    const O = this;
    if (O._windowIndex && M.queryGen != null && M.queryGen !== O._windowIndex.queryGen)
      return Promise.resolve();
    C.length > 0 || I.length > 0;
    let F = Promise.resolve();
    return C.length > 0 && (F = F.then(() => Yt(O._name, C))), I.length > 0 && (F = F.then(() => Jt(O._name, I))), F.then(() => {
      if (O._windowIndex && (M.offset != null || M.total != null)) {
        const P = M.offset != null ? M.offset : 0, j = C.map((V) => V.id);
        O._windowIndex.ingest(P, j, M.total, M.filtered, M.queryGen);
      }
    }).then(() => A(O._name)).then((P) => (O.totalCount = M.total !== void 0 ? M.total : P, O.hasCache = !0, q(O._name, {
      schema_version: _,
      last_synced_at: D,
      has_cache: !0,
      record_count: O.totalCount
    }))).then(() => {
      const P = !O.isLoaded;
      O.isLoaded = !0, O.isSyncing = !1, O.lastSyncedAt = D, P ? (L(O.dom, "ln-data-store:loaded", { store: O._name, count: O.totalCount, meta: M }), L(O.dom, "ln-data-store:ready", { store: O._name, count: O.totalCount, source: "server", meta: M })) : L(O.dom, "ln-data-store:synced", {
        store: O._name,
        added: C.length,
        deleted: I.length,
        changed: !0,
        meta: M
      });
    }).catch((P) => {
      O.isSyncing = !1, console.error("[ln-data-store] applySync failed:", P);
    });
  }, T.prototype.applyQuery = function(C, I) {
    I = I || {};
    const D = this;
    let M = Promise.resolve();
    return C.length > 0 && (M = M.then(() => Yt(D._name, C))), M.then(() => A(D._name)).then((O) => (D.totalCount = I.total !== void 0 ? I.total : O, St(D, C))).catch((O) => (console.error("[ln-data-store] applyQuery failed:", O), []));
  }, T.prototype.forceSync = function() {
    this.isSyncing || Xt(this);
  }, T.prototype.fullReload = function() {
    const C = this;
    return w(C._name).then(() => q(C._name, {
      schema_version: _,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      C.isLoaded = !1, C.hasCache = !1, C.lastSyncedAt = null, C.totalCount = 0, Xt(C);
    });
  }, T.prototype.destroy = function() {
    if (this._windowIndex && (this._windowIndex.clear(), this._windowIndex = null), this._handlers) {
      for (const [C, I] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${C}`, I);
      this._handlers = null;
    }
    if (this._queryHandlers) {
      for (const [C, I] of Object.entries(this._queryHandlers))
        this.dom.removeEventListener(C, I);
      this._queryHandlers = null;
    }
    delete o[this._name], delete this.dom[a], L(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function Pe() {
    return m().then((C) => {
      if (!C) return;
      const I = Array.from(C.objectStoreNames);
      return new Promise((D, M) => {
        const O = C.transaction(I, "readwrite");
        I.forEach((F) => O.objectStore(F).clear()), O.oncomplete = () => D(), O.onerror = () => M(O.error);
      });
    }).then(() => {
      Object.values(o).forEach((C) => {
        C.isLoaded = !1, C.isInitialized = !1, C.initializationError = null, C.hasCache = !1, C.isSyncing = !1, C.lastSyncedAt = null, C.totalCount = 0;
      });
    });
  }
  function Rt(C) {
    C._windowIndex && C._windowIndex.reset(), L(C.dom, "ln-data-store:query-changed", {
      store: C._name,
      query: {
        filters: Object.assign({}, C.query.filters),
        search: C.query.search,
        sort: C.query.sort ? Object.assign({}, C.query.sort) : null
      }
    });
  }
  B(l, a, T, "ln-data-store"), window[a].clearAll = Pe, window[a].init = window[a], window[a].setStorageKey = ne, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = ne);
})();
const un = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function ut(...l) {
  return l.filter((a) => a != null && a !== "").map((a, b) => {
    const v = String(a);
    return b === 0 ? v.replace(/\/+$/, "") : v.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function hn(l, a) {
  if (!l || typeof l != "object") return "";
  const b = Object.assign({}, un);
  if (a && typeof a == "object")
    for (const _ in a)
      a[_] !== void 0 && a[_] !== null && a[_] !== "" && (b[_] = a[_]);
  const v = new URLSearchParams();
  return l.search && v.append(b.search, l.search), l.offset != null && v.append(b.offset, l.offset), l.limit != null && v.append(b.limit, l.limit), l.sort && l.sort.field && l.sort.direction && (v.append(b.sortField, l.sort.field), v.append(b.sortDir, l.sort.direction)), l.filters && typeof l.filters == "object" && Object.keys(l.filters).forEach((_) => {
    const h = l.filters[_];
    Array.isArray(h) && h.length > 0 && v.append(_, h.join(","));
  }), v.toString();
}
function fn(l, a, b) {
  let v = ut(l, a);
  return b && (v += (v.indexOf("?") !== -1 ? "&" : "?") + b), v;
}
function se(l) {
  const a = l && l.content !== void 0 ? l.content : l, b = l && l.message ? l.message : null;
  return { record: a, message: b };
}
(function() {
  const l = "data-ln-api-connector", a = "lnApiConnector", b = "lnConnector";
  if (window[a] !== void 0) return;
  function v(o) {
    return o.ok ? o.status === 204 ? null : o.json() : o.json().catch(() => null).then((c) => {
      const r = new Error("HTTP " + o.status + ": " + o.statusText);
      throw r.status = o.status, r.data = c, r;
    });
  }
  function _(o) {
    return this.dom = o, o[a] = this, o[b] = this, this._inflight = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, h(this), this;
  }
  _.prototype.refreshConfig = function() {
    const o = this.dom;
    this.baseUrl = o.getAttribute("data-ln-api-base-url") || "", this.path = o.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin", this.rawHeaders = o.getAttribute("data-ln-api-headers"), this.headers = me(this.rawHeaders);
    const c = {}, r = o.getAttribute("data-ln-api-param-offset");
    r && (c.offset = r);
    const f = o.getAttribute("data-ln-api-param-limit");
    f && (c.limit = f);
    const p = o.getAttribute("data-ln-api-param-search");
    p && (c.search = p);
    const m = o.getAttribute("data-ln-api-param-sort-field");
    m && (c.sortField = m);
    const y = o.getAttribute("data-ln-api-param-sort-dir");
    y && (c.sortDir = y), this.paramKeys = c, L(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, _.prototype._reqHeaders = function(o) {
    const c = Object.assign({}, this.headers);
    return !c.Accept && !c.accept && (c.Accept = "application/json"), !c["Content-Type"] && !c["content-type"] && (c["Content-Type"] = "application/json"), o && (c["X-Idempotency-Key"] = o), c;
  }, _.prototype.cancel = function(o) {
    return o && this._inflight.has(o) ? (this._inflight.get(o).abort(), this._inflight.delete(o), !0) : !1;
  }, _.prototype.fetchDelta = function(o, c) {
    const r = this;
    let f = ut(r.baseUrl, r.path);
    o != null && o !== "" && (f += (f.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(o));
    const p = c || "sync";
    r._inflight.has(p) && r._inflight.get(p).abort();
    const m = new AbortController();
    return r._inflight.set(p, m), window.fetch(f, {
      method: "GET",
      headers: r._reqHeaders(),
      credentials: r.credentials,
      signal: m.signal
    }).then(v).finally(function() {
      r._inflight.get(p) === m && r._inflight.delete(p);
    });
  }, _.prototype.query = function(o, c) {
    const r = this, f = hn(o, r.paramKeys), p = fn(r.baseUrl, r.path, f), m = c || "query";
    r._inflight.has(m) && r._inflight.get(m).abort();
    const y = new AbortController();
    return r._inflight.set(m, y), window.fetch(p, {
      method: "GET",
      headers: r._reqHeaders(),
      credentials: r.credentials,
      signal: y.signal
    }).then(v).finally(function() {
      r._inflight.get(m) === y && r._inflight.delete(m);
    });
  }, _.prototype.create = function(o, c, r) {
    const f = this;
    return window.fetch(ut(f.baseUrl, c || f.path), {
      method: "POST",
      headers: f._reqHeaders(r),
      credentials: f.credentials,
      body: JSON.stringify(o)
    }).then(v);
  }, _.prototype.update = function(o, c, r, f, p) {
    const m = this;
    r != null && (c = Object.assign({}, c, { expected_version: r }));
    const y = f ? ut(m.baseUrl, f) : ut(m.baseUrl, m.path, o);
    return window.fetch(y, {
      method: "PUT",
      headers: m._reqHeaders(p),
      credentials: m.credentials,
      body: JSON.stringify(c)
    }).then(v);
  }, _.prototype.delete = function(o, c, r) {
    const f = this;
    return window.fetch(ut(f.baseUrl, c || f.path, o), {
      method: "DELETE",
      headers: f._reqHeaders(r),
      credentials: f.credentials
    }).then(v);
  }, _.prototype.bulkDelete = function(o, c, r) {
    const f = this;
    return window.fetch(ut(f.baseUrl, c || f.path, "bulk-delete"), {
      method: "DELETE",
      headers: f._reqHeaders(r),
      credentials: f.credentials,
      body: JSON.stringify({ ids: o })
    }).then(v);
  };
  function h(o) {
    o._handlers = {
      sync: function(c) {
        const r = c.detail || {}, f = r.meta && r.meta.targetEl ? r.meta.targetEl : null;
        o.fetchDelta(r.since, f).then(function(p) {
          L(o.dom, "ln-api-connector:fetched", { data: p, since: r.since, meta: r.meta || null });
        }).catch(function(p) {
          p && p.name === "AbortError" || L(o.dom, "ln-api-connector:error", {
            action: "sync",
            error: p.message,
            status: p.status || 0,
            data: p.data || null,
            since: r.since,
            meta: r.meta || null
          });
        });
      },
      query: function(c) {
        const r = c.detail || {}, f = r.query || r, p = r.meta && r.meta.targetEl ? r.meta.targetEl : null;
        o.query(f, p).then(function(m) {
          const y = m || {};
          L(o.dom, "ln-api-connector:fetched", {
            data: y.data || (Array.isArray(y) ? y : []),
            total: y.total,
            filtered: y.filtered,
            offset: f.offset,
            queryGen: f.queryGen,
            meta: r.meta || null
          });
        }).catch(function(m) {
          m && m.name === "AbortError" || L(o.dom, "ln-api-connector:error", {
            action: "query",
            error: m.message,
            status: m.status || 0,
            data: m.data || null,
            meta: r.meta || null
          });
        });
      },
      cancel: function(c) {
        const r = c.detail || {}, f = r.meta && r.meta.targetEl ? r.meta.targetEl : r.targetEl || r.key;
        f && o.cancel(f);
      },
      create: function(c) {
        const r = c.detail || {};
        o.create(r.data, r.url, r.idempotencyKey).then(function(f) {
          const p = se(f);
          L(o.dom, "ln-api-connector:created", {
            record: p.record,
            tempId: r.tempId,
            message: p.message,
            meta: r.meta || null
          });
        }).catch(function(f) {
          f && f.name === "AbortError" || L(o.dom, "ln-api-connector:error", {
            action: "create",
            error: f.message,
            status: f.status || 0,
            data: f.data || null,
            tempId: r.tempId,
            meta: r.meta || null
          });
        });
      },
      update: function(c) {
        const r = c.detail || {};
        o.update(r.id, r.data, r.expected_version, r.url, r.idempotencyKey).then(function(f) {
          const p = se(f);
          L(o.dom, "ln-api-connector:updated", {
            record: p.record,
            id: r.id,
            message: p.message,
            meta: r.meta || null
          });
        }).catch(function(f) {
          f && f.name === "AbortError" || L(o.dom, "ln-api-connector:error", {
            action: "update",
            error: f.message,
            status: f.status || 0,
            data: f.data || null,
            id: r.id,
            conflictData: f.status === 409 ? f.data : null,
            meta: r.meta || null
          });
        });
      },
      delete: function(c) {
        const r = c.detail || {};
        o.delete(r.id, r.url, r.idempotencyKey).then(function(f) {
          const p = f && f.message ? f.message : null;
          L(o.dom, "ln-api-connector:deleted", {
            response: f,
            id: r.id,
            message: p,
            meta: r.meta || null
          });
        }).catch(function(f) {
          f && f.name === "AbortError" || L(o.dom, "ln-api-connector:error", {
            action: "delete",
            error: f.message,
            status: f.status || 0,
            data: f.data || null,
            id: r.id,
            meta: r.meta || null
          });
        });
      },
      bulkDelete: function(c) {
        const r = c.detail || {};
        o.bulkDelete(r.ids, r.url, r.idempotencyKey).then(function(f) {
          const p = f && f.message ? f.message : null;
          L(o.dom, "ln-api-connector:bulk-deleted", {
            response: f,
            ids: r.ids,
            message: p,
            meta: r.meta || null
          });
        }).catch(function(f) {
          f && f.name === "AbortError" || L(o.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: f.message,
            status: f.status || 0,
            data: f.data || null,
            ids: r.ids,
            meta: r.meta || null
          });
        });
      }
    }, o.dom.addEventListener("ln-api-connector:request-sync", o._handlers.sync), o.dom.addEventListener("ln-api-connector:request-query", o._handlers.query), o.dom.addEventListener("ln-api-connector:request-fetch", o._handlers.query), o.dom.addEventListener("ln-api-connector:request-cancel", o._handlers.cancel), o.dom.addEventListener("ln-api-connector:request-create", o._handlers.create), o.dom.addEventListener("ln-api-connector:request-update", o._handlers.update), o.dom.addEventListener("ln-api-connector:request-delete", o._handlers.delete), o.dom.addEventListener("ln-api-connector:request-bulk-delete", o._handlers.bulkDelete);
  }
  _.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const o = this;
    o._inflight && (o._inflight.forEach(function(c) {
      c.abort();
    }), o._inflight.clear()), o._handlers && (o.dom.removeEventListener("ln-api-connector:request-sync", o._handlers.sync), o.dom.removeEventListener("ln-api-connector:request-query", o._handlers.query), o.dom.removeEventListener("ln-api-connector:request-fetch", o._handlers.query), o.dom.removeEventListener("ln-api-connector:request-cancel", o._handlers.cancel), o.dom.removeEventListener("ln-api-connector:request-create", o._handlers.create), o.dom.removeEventListener("ln-api-connector:request-update", o._handlers.update), o.dom.removeEventListener("ln-api-connector:request-delete", o._handlers.delete), o.dom.removeEventListener("ln-api-connector:request-bulk-delete", o._handlers.bulkDelete), o._handlers = null), L(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[a], delete this.dom[b];
  };
  function u(o) {
    const c = o[a];
    c && c.refreshConfig();
  }
  B(l, a, _, "ln-api-connector", {
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
    onAttributeChange: u
  });
})();
(function() {
  const l = "data-ln-couchdb-connector", a = "lnCouchDbConnector", b = "lnConnector";
  if (window[a] !== void 0) return;
  function v(m) {
    const y = m && m.content !== void 0 ? m.content : m, i = m && m.message ? m.message : null;
    return { content: y, message: i };
  }
  function _(m) {
    return this.dom = m, m[a] = this, m[b] = this, this.refreshConfig(), this._handlers = null, f(this), this;
  }
  _.prototype.refreshConfig = function() {
    const m = this.dom;
    this.url = m.getAttribute("data-ln-couchdb-url") || "", this.db = m.getAttribute("data-ln-couchdb-db") || "", this.auth = m.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const y = m.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = me(y, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), y.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), L(m, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function h(m, y, i) {
    const s = Object.assign({}, bt(m.headers, m.auth), i || {});
    return y && (s["Idempotency-Key"] = y), s;
  }
  _.prototype.fetchDelta = function(m) {
    const y = this, i = ["include_docs=true", "feed=normal"];
    m && i.push("since=" + encodeURIComponent(m));
    const s = st(y.url, y.db, "_changes") + "?" + i.join("&");
    return window.fetch(s, { method: "GET", headers: bt(y.headers, y.auth), credentials: y.credentials }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const e = t.results || [];
      return {
        data: e.filter((n) => !n.deleted && n.doc).map((n) => Object.assign({}, n.doc, { id: n.doc._id })),
        deleted: e.filter((n) => n.deleted).map((n) => n.id),
        synced_at: t.last_seq || m || ""
      };
    });
  };
  function u(m, y, i) {
    const s = Object.assign({ _id: y.id }, y);
    return s._id || delete s._id, window.fetch(st(m.url, m.db), {
      method: "POST",
      headers: h(m, i),
      credentials: m.credentials,
      body: JSON.stringify(s)
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const e = v(t), n = e.content;
      return { record: Object.assign({}, s, { id: n.id, _id: n.id, _rev: n.rev }), message: e.message };
    });
  }
  _.prototype.create = function(m, y) {
    return u(this, m, y).then((i) => i.record);
  };
  function o(m, y, i, s) {
    const t = Object.assign({ id: String(y), _id: String(y) }, i), e = t._rev || t.rev;
    return (e ? Promise.resolve(e) : window.fetch(st(m.url, m.db, null, y), { method: "GET", headers: bt(m.headers, m.auth), credentials: m.credentials }).then((d) => {
      if (!d.ok) throw new Error("Could not retrieve document for revision mapping");
      return d.json().then((g) => g._rev);
    })).then((d) => {
      const g = Object.assign({}, t, { _rev: d });
      delete g.rev;
      const E = h(m, s, { "If-Match": d });
      return window.fetch(st(m.url, m.db, null, y), {
        method: "PUT",
        headers: E,
        credentials: m.credentials,
        body: JSON.stringify(g)
      }).then((w) => {
        if (w.ok) return w.json().then((A) => {
          const S = v(A);
          return { record: Object.assign({}, g, { _rev: S.content.rev }), message: S.message };
        });
        if (w.status === 409) return w.json().then((A) => {
          const S = new Error("Conflict");
          throw S.status = 409, S.data = A, S;
        });
        throw new Error("HTTP " + w.status + ": " + w.statusText);
      });
    });
  }
  _.prototype.update = function(m, y, i) {
    return o(this, m, y, i).then((s) => s.record);
  };
  function c(m, y, i, s) {
    return (i ? Promise.resolve(i) : window.fetch(st(m.url, m.db, null, y), { method: "GET", headers: bt(m.headers, m.auth), credentials: m.credentials }).then((e) => {
      if (!e.ok) throw new Error("Could not retrieve document for revision delete");
      return e.json().then((n) => n._rev);
    })).then((e) => {
      const n = st(m.url, m.db, null, y) + "?rev=" + encodeURIComponent(e);
      return window.fetch(n, { method: "DELETE", headers: h(m, s), credentials: m.credentials }).then((d) => {
        if (!d.ok) throw new Error("HTTP " + d.status + ": " + d.statusText);
        return d.json();
      }).then((d) => {
        const g = v(d);
        return { response: g.content, message: g.message };
      });
    });
  }
  _.prototype.delete = function(m, y, i) {
    return c(this, m, y, i).then((s) => s.response);
  };
  function r(m, y, i) {
    return !y || y.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(st(m.url, m.db, "_all_docs"), {
      method: "POST",
      headers: bt(m.headers, m.auth),
      credentials: m.credentials,
      body: JSON.stringify({ keys: y })
    }).then((s) => {
      if (!s.ok) throw new Error("HTTP " + s.status + ": " + s.statusText);
      return s.json();
    }).then((s) => {
      const e = (s.rows || []).filter((n) => !n.error && n.value && n.value.rev).map((n) => ({ _id: n.id, _rev: n.value.rev, _deleted: !0 }));
      return e.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(st(m.url, m.db, "_bulk_docs"), {
        method: "POST",
        headers: h(m, i),
        credentials: m.credentials,
        body: JSON.stringify({ docs: e })
      }).then((n) => {
        if (!n.ok) throw new Error("HTTP " + n.status + ": " + n.statusText);
        return n.json();
      }).then((n) => {
        const d = v(n);
        return { response: { ok: !0, results: d.content, deletedCount: e.length }, message: d.message };
      });
    });
  }
  _.prototype.bulkDelete = function(m, y) {
    return r(this, m, y).then((i) => i.response);
  };
  function f(m) {
    m._handlers = {
      sync: function(i) {
        const s = i.detail || {};
        m.fetchDelta(s.since).then(function(t) {
          L(m.dom, "ln-couchdb-connector:fetched", { data: t, since: s.since, meta: s.meta || null });
        }).catch(function(t) {
          L(m.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: t.message,
            status: t.status || 0,
            since: s.since,
            meta: s.meta || null
          });
        });
      },
      create: function(i) {
        const s = i.detail || {};
        u(m, s.data, s.idempotencyKey).then(function(t) {
          L(m.dom, "ln-couchdb-connector:created", { record: t.record, tempId: s.tempId, message: t.message, meta: s.meta || null });
        }).catch(function(t) {
          L(m.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: t.message,
            status: t.status || 0,
            tempId: s.tempId,
            meta: s.meta || null
          });
        });
      },
      update: function(i) {
        const s = i.detail || {}, t = Object.assign({}, s.data);
        s.expected_version !== void 0 && (t._rev = s.expected_version), o(m, s.id, t, s.idempotencyKey).then(function(e) {
          L(m.dom, "ln-couchdb-connector:updated", { record: e.record, id: s.id, message: e.message, meta: s.meta || null });
        }).catch(function(e) {
          L(m.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: e.message,
            status: e.status || 0,
            id: s.id,
            data: e.status === 409 ? e.data : null,
            conflictData: e.status === 409 ? e.data : null,
            meta: s.meta || null
          });
        });
      },
      delete: function(i) {
        const s = i.detail || {};
        c(m, s.id, s.rev, s.idempotencyKey).then(function(t) {
          L(m.dom, "ln-couchdb-connector:deleted", { response: t.response, id: s.id, message: t.message, meta: s.meta || null });
        }).catch(function(t) {
          L(m.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: t.message,
            status: t.status || 0,
            id: s.id,
            meta: s.meta || null
          });
        });
      },
      bulkDelete: function(i) {
        const s = i.detail || {};
        r(m, s.ids, s.idempotencyKey).then(function(t) {
          L(m.dom, "ln-couchdb-connector:bulk-deleted", { response: t.response, ids: s.ids, message: t.message, meta: s.meta || null });
        }).catch(function(t) {
          L(m.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: t.message,
            status: t.status || 0,
            ids: s.ids,
            meta: s.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector"].forEach(function(i) {
      m.dom.addEventListener(i + ":request-sync", m._handlers.sync), m.dom.addEventListener(i + ":request-fetch", m._handlers.sync), m.dom.addEventListener(i + ":request-create", m._handlers.create), m.dom.addEventListener(i + ":request-update", m._handlers.update), m.dom.addEventListener(i + ":request-delete", m._handlers.delete), m.dom.addEventListener(i + ":request-bulk-delete", m._handlers.bulkDelete);
    });
  }
  _.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const m = this;
    m._handlers && (["ln-couchdb-connector", "ln-api-connector"].forEach(function(i) {
      m.dom.removeEventListener(i + ":request-sync", m._handlers.sync), m.dom.removeEventListener(i + ":request-fetch", m._handlers.sync), m.dom.removeEventListener(i + ":request-create", m._handlers.create), m.dom.removeEventListener(i + ":request-update", m._handlers.update), m.dom.removeEventListener(i + ":request-delete", m._handlers.delete), m.dom.removeEventListener(i + ":request-bulk-delete", m._handlers.bulkDelete);
    }), m._handlers = null), L(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[a], delete this.dom[b];
  };
  function p(m) {
    const y = m[a];
    y && y.refreshConfig();
  }
  B(l, a, _, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: p
  });
})();
function pn(l) {
  return l = l || {}, {
    sort: l.sort,
    filters: l.filters,
    search: l.search,
    offset: l.offset,
    limit: l.limit,
    queryGen: l.queryGen
  };
}
function Pt(l, a) {
  const b = !l || !!l.initializationError;
  return a && (b || !l.isLoaded) ? "remote" : l && !l.initializationError ? "store" : "none";
}
function ae(l, a) {
  const b = Object.assign({}, l);
  return a && (b.filters = a.filters, b.search = a.search, b.sort = a.sort), b;
}
class mn {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(a) {
    return new Promise((b, v) => {
      this._pending.set(a, { resolve: b, reject: v });
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
    for (const v of this._pending.values()) v.reject(b);
    this._pending.clear();
  }
  _settle(a, b) {
    const v = a && a.requestId;
    if (!v) return !1;
    const _ = this._pending.get(v);
    return _ ? (this._pending.delete(v), b ? _.reject(a.error || new Error("Store mutation failed")) : _.resolve(a), !0) : !1;
  }
}
(function() {
  const l = "data-ln-data-coordinator", a = "lnDataCoordinator", b = "lnCoordinator", v = "data-ln-form-scope";
  if (window[a] !== void 0) return;
  const _ = /* @__PURE__ */ new Set();
  let h = !1, u = null, o = null, c = null;
  function r() {
    h || (h = !0, u = function() {
      L(document, "ln-data-store:online", {}), _.forEach(function(t) {
        t._maybeSync();
      });
    }, o = function() {
      L(document, "ln-data-store:offline", {});
    }, c = function() {
      document.visibilityState === "visible" && _.forEach(function(t) {
        const e = t.findChildren(), n = e.store;
        n && e.connector && n.isInitialized && !n.initializationError && !n.isSyncing && !t._noAutosync && (!n.hasCache || t._isStale()) && n.forceSync();
      });
    }, window.addEventListener("online", u), window.addEventListener("offline", o), document.addEventListener("visibilitychange", c));
  }
  function f() {
    h && (_.size > 0 || (window.removeEventListener("online", u), window.removeEventListener("offline", o), document.removeEventListener("visibilitychange", c), u = null, o = null, c = null, h = !1));
  }
  function p() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
        const n = Math.random() * 16 | 0;
        return (e === "x" ? n : n & 3 | 8).toString(16);
      });
    }
  }
  const m = ["ln-api-connector", "ln-couchdb-connector"];
  function y(t) {
    return this.dom = t, this._name = t.id, this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", t), t[a] = this, t[b] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new mn(), this._dict = kt(t, "data-ln-data-coordinator-dict"), this._parseStaleAttributes(), this.refreshMapper(), i(this), _.add(this), r(), this._checkInitialSync(), this;
  }
  y.prototype._parseStaleAttributes = function() {
    const e = this.findChildren().storeEl, n = this.dom.getAttribute("data-ln-data-coordinator-stale") || (e ? e.getAttribute("data-ln-data-store-stale") : null), d = parseInt(n, 10);
    this._staleThreshold = n === "never" || n === "-1" ? -1 : isNaN(d) ? 300 : d;
    const g = this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (e ? e.hasAttribute("data-ln-data-store-no-autosync") : !1);
    this._noAutosync = !!g;
  }, y.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const e = this.findChildren().store;
    return !e || !e.lastSyncedAt ? !0 : Date.now() / 1e3 - e.lastSyncedAt > this._staleThreshold;
  }, y.prototype._maybeSync = function() {
    const t = this.findChildren(), e = t.store;
    !e || e.initializationError || !t.connector || this._noAutosync || !e.isInitialized || e.isSyncing || (!e.hasCache || this._isStale()) && e.forceSync();
  }, y.prototype._checkInitialSync = function() {
    const t = this, n = this.findChildren().store;
    n && Promise.resolve(n.ready).then(function() {
      const d = t.findChildren(), g = d.store;
      if (g && g.initializationError) {
        t._reportReconciliationError("store-initialize", g.initializationError, null);
        return;
      }
      !g || !d.connector || t._noAutosync || g.isSyncing || (!g.hasCache || t._isStale()) && g.forceSync();
    }).catch(function(d) {
      t._reportReconciliationError("store-initialize", d, null);
    });
  }, y.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const e = this.dom.getAttribute("data-ln-data-mapper") || this.dom.id;
    e && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(e)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(n) {
      return n;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(n) {
      return n;
    });
  }, y.prototype.findChildren = function() {
    const t = this.dom.querySelector("[data-ln-data-store]"), e = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]"), n = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: t,
      connectorEl: e,
      queueEl: n,
      store: t ? t.lnDataStore || t.lnStore : null,
      connector: e ? e.lnConnector || e.lnApiConnector || e.lnCouchDbConnector : null,
      queue: n ? n.lnApiQueue : null
    };
  }, y.prototype._handleSubmitRecord = function(t) {
    const e = this.findChildren();
    if (!e.storeEl) {
      console.warn('[ln-data-coordinator] form submit claimed but no [data-ln-data-store] child found in "' + (this._name || "") + '"');
      return;
    }
    const n = t.data || {}, d = n.id, g = n.expected_version, E = Object.assign({}, n);
    delete E.id, delete E.expected_version;
    const w = t.method.toUpperCase();
    w === "POST" ? this._fanOutCreate(e, E, t.action) : (w === "PUT" || w === "PATCH") && this._fanOutUpdate(e, d, E, g, t.action);
  }, y.prototype._fanOutCreate = function(t, e, n) {
    this.refreshMapper();
    const d = "_temp_" + p();
    L(t.storeEl, "ln-data-store:request-create", { tempId: d, data: e }), t.queue ? L(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: d,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(e),
      expectedVersion: null,
      meta: { tempId: d, action: n }
    }) : t.connector && L(t.connectorEl, "ln-api-connector:request-create", {
      data: this.mapper.egress(e),
      url: n,
      meta: { entryId: p(), queued: !1, op: "create", tempId: d }
    });
  }, y.prototype._fanOutUpdate = function(t, e, n, d, g) {
    this.refreshMapper(), L(t.storeEl, "ln-data-store:request-update", { id: e, data: n }), t.queue ? L(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: e,
      op: "update",
      targetId: e,
      payload: this.mapper.egress(n),
      expectedVersion: d,
      meta: { id: e, action: g }
    }) : t.connector && L(t.connectorEl, "ln-api-connector:request-update", {
      id: e,
      data: this.mapper.egress(n),
      expected_version: d,
      url: g,
      meta: { entryId: p(), queued: !1, op: "update", id: e }
    });
  }, y.prototype._fanOutDelete = function(t, e) {
    this.refreshMapper(), L(t.storeEl, "ln-data-store:request-delete", { id: e }), t.queue ? L(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: e,
      op: "delete",
      targetId: e,
      payload: null,
      expectedVersion: null,
      meta: { id: e }
    }) : t.connector && L(t.connectorEl, "ln-api-connector:request-delete", {
      id: e,
      meta: { entryId: p(), queued: !1, op: "delete", id: e }
    });
  }, y.prototype._fanOutBulkDelete = function(t, e) {
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
      meta: { entryId: p(), queued: !1, op: "bulk-delete", bulkKey: n }
    });
  }, y.prototype._toastFromMessage = function(t) {
    t && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: t.type || "success",
        title: t.title || "",
        message: t.body || ""
      }
    }));
  }, y.prototype._toastFromDict = function(t) {
    const e = this._dict[t];
    e && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: "error", title: "", message: e }
    }));
  }, y.prototype._requestStoreMutation = function(t, e, n) {
    const d = t.storeEl;
    if (!d) return Promise.reject(new Error("Store element not found"));
    const g = p(), E = this._mutationReceipts.wait(g);
    return L(d, "ln-data-store:request-" + e, Object.assign({}, n, { requestId: g })), E;
  }, y.prototype._reportReconciliationError = function(t, e, n) {
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
        const d = e.detail || {};
        L(n.connectorEl, "ln-api-connector:request-query", {
          query: Object.assign({}, d.query, {
            offset: d.offset,
            limit: d.limit,
            queryGen: d.queryGen
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
        const d = e.detail || {}, g = d.entryId, E = d.op, w = d.targetId, A = d.payload, S = d.expectedVersion, q = d.meta || {}, T = q.action || null, x = d.idempotencyKey || g;
        E === "create" ? L(n.connectorEl, "ln-api-connector:request-create", {
          data: A,
          url: T,
          idempotencyKey: x,
          meta: { entryId: g, queued: !0, op: "create", tempId: q.tempId }
        }) : E === "update" ? L(n.connectorEl, "ln-api-connector:request-update", {
          id: w,
          data: A,
          expected_version: S,
          url: T,
          idempotencyKey: x,
          meta: { entryId: g, queued: !0, op: "update", id: w }
        }) : E === "delete" ? L(n.connectorEl, "ln-api-connector:request-delete", {
          id: w,
          idempotencyKey: x,
          meta: { entryId: g, queued: !0, op: "delete", id: w }
        }) : E === "bulk-delete" ? L(n.connectorEl, "ln-api-connector:request-bulk-delete", {
          ids: A && A.ids ? A.ids : [],
          idempotencyKey: x,
          meta: { entryId: g, queued: !0, op: "bulk-delete", bulkKey: q.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", E);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(e) {
        const n = e.target;
        if (e.defaultPrevented) return;
        const d = n.hasAttribute(v) ? n.getAttribute(v) : null;
        if (d === null) return;
        let g;
        if (d ? g = d === t._name : g = n.closest("[data-ln-data-coordinator]") === t.dom, !g) return;
        const E = ze(n);
        if (E !== "POST" && E !== "PUT" && E !== "PATCH") return;
        e.preventDefault();
        const w = ue(n);
        delete w._method, delete w._token, t._handleSubmitRecord({ data: w, method: E, action: n.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(e) {
        const n = e.detail.meta || {}, d = t.findChildren();
        t.refreshMapper();
        const g = e.detail.data;
        let E = [], w = [], A = null;
        Array.isArray(g) ? (E = g, A = Math.floor(Date.now() / 1e3)) : g && (E = Array.isArray(g.data) ? g.data : [], w = Array.isArray(g.deleted) ? g.deleted : [], A = g.synced_at !== void 0 ? g.synced_at : g.since !== void 0 ? g.since : null);
        const S = E.map((q) => t.mapper.ingress(q));
        if (d.store && !d.store.initializationError)
          n.kind ? n.kind === "table" || n.kind === "list" || n.kind === "chart" ? d.store.applyQuery(S, { total: e.detail.total }).then(function(q) {
            L(n.targetEl, "ln-" + n.kind + ":set-loading", { loading: !1 }), L(n.targetEl, "ln-" + n.kind + ":set-data", {
              data: q,
              total: e.detail.total !== void 0 ? e.detail.total : q.length,
              filtered: e.detail.filtered !== void 0 ? e.detail.filtered : q.length,
              offset: e.detail.offset,
              queryGen: e.detail.queryGen
            }), t._boundDelivered.set(n.targetEl, !0);
          }) : n.kind === "options" ? d.store.applyQuery(S, { total: e.detail.total }).then(function() {
            return d.store.getAll({});
          }).then(function(q) {
            L(n.targetEl, "ln-options:set-data", { data: q.data });
          }) : n.kind === "stat" && d.store.applyQuery(S, { total: e.detail.total }).then(function() {
            const q = e.detail.filtered !== void 0 ? e.detail.filtered : e.detail.total !== void 0 ? e.detail.total : S.length;
            L(n.targetEl, "ln-stat:set-count", { count: q });
          }) : d.store.applySync(S, w, A || Math.floor(Date.now() / 1e3), {
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
        const d = e.detail.meta || {}, g = t.mapper.ingress(e.detail.record);
        t._requestStoreMutation(n, "update", { id: d.tempId, data: g }).then(function() {
          t._toastFromMessage(e.detail.message), d.queued && n.queue && L(n.queueEl, "ln-api-queue:resolve-create", {
            entryId: d.entryId,
            oldKey: d.tempId,
            newId: g.id
          });
        }).catch(function(E) {
          t._reportReconciliationError("create-reconcile", E, d);
        });
      },
      connUpdated: function(e) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const d = e.detail.meta || {}, g = t.mapper.ingress(e.detail.record);
        t._requestStoreMutation(n, "update", { id: d.id, data: g }).then(function() {
          t._toastFromMessage(e.detail.message), d.queued && n.queue && L(n.queueEl, "ln-api-queue:ack", { entryId: d.entryId });
        }).catch(function(E) {
          t._reportReconciliationError("update-reconcile", E, d);
        });
      },
      connDeleted: function(e) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const d = e.detail.meta || {};
        t._toastFromMessage(e.detail.message), d.queued && n.queue && L(n.queueEl, "ln-api-queue:ack", { entryId: d.entryId });
      },
      connBulkDeleted: function(e) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const d = e.detail.meta || {};
        t._toastFromMessage(e.detail.message), d.queued && n.queue && L(n.queueEl, "ln-api-queue:ack", { entryId: d.entryId });
      },
      connError: function(e) {
        const n = e.detail || {}, d = n.meta || {}, g = d.op || n.action, E = n.status || 0, w = t.findChildren();
        if (g === "sync") {
          w.storeEl && L(w.storeEl, "ln-data-store:request-sync-failed", {
            error: n.error,
            status: E
          }), console.error("[ln-data-coordinator] Sync failed:", n.error);
          return;
        }
        if (g === "query") {
          d.targetEl && d.kind && (L(d.targetEl, "ln-" + d.kind + ":set-loading", { loading: !1 }), (d.kind === "table" || d.kind === "list") && L(d.targetEl, "ln-" + d.kind + ":page-failed", { offset: d.offset })), t._reportReconciliationError("query", n.error || n, d);
          return;
        }
        if (!w.storeEl) return;
        const A = E === 401 || E === 419, S = E === 0 || E >= 500, q = E === 409 || E === 412;
        if (A) {
          t._toastFromDict("auth"), d.queued && w.queue && L(w.queueEl, "ln-api-queue:nack", { entryId: d.entryId, reason: "auth" });
          return;
        }
        if (S) {
          d.queued && w.queue ? L(w.queueEl, "ln-api-queue:nack", { entryId: d.entryId, reason: "retry" }) : t._toastFromDict("network");
          return;
        }
        let T = Promise.resolve();
        if (q && g === "update") {
          const x = n.data && n.data.remote ? t.mapper.ingress(n.data.remote) : null;
          x && (T = t._requestStoreMutation(w, "update", { id: d.id, data: x })), t._toastFromDict("conflict");
        } else g === "create" && (T = t._requestStoreMutation(w, "delete", { id: d.tempId })), t._toastFromDict("rejected");
        d.queued && w.queue ? T.then(function() {
          L(w.queueEl, "ln-api-queue:nack", { entryId: d.entryId, reason: "drop" });
        }).catch(function(x) {
          t._reportReconciliationError("deterministic-reconcile", x, d);
        }) : T.catch(function(x) {
          t._reportReconciliationError("deterministic-reconcile", x, d);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(e) {
        const n = t.findChildren(), d = n.store;
        if (!d || d.initializationError || !n.connector || t._noAutosync || d.isSyncing) return;
        (e.detail || {}).hasCache ? t._isStale() && d.forceSync() : d.forceSync();
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
    }, t.dom.addEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.addEventListener("ln-data-store:request-page", t._handlers.requestPage), t.dom.addEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.addEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.addEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.addEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.addEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.addEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.addEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.addEventListener("submit", t._handlers.formSubmit), m.forEach(function(e) {
      t.dom.addEventListener(e + ":fetched", t._handlers.connFetched), t.dom.addEventListener(e + ":created", t._handlers.connCreated), t.dom.addEventListener(e + ":updated", t._handlers.connUpdated), t.dom.addEventListener(e + ":deleted", t._handlers.connDeleted), t.dom.addEventListener(e + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.addEventListener(e + ":error", t._handlers.connError);
    }), document.addEventListener("ln-table:request-data", t._handlers.reqTableData), document.addEventListener("ln-list:request-data", t._handlers.reqListData), document.addEventListener("ln-chart:request-data", t._handlers.reqChartData), document.addEventListener("ln-options:request-data", t._handlers.reqOptions), document.addEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.addEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.addEventListener("ln-data-store:created", t._handlers.refresh), t.dom.addEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.addEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.addEventListener("ln-data-store:mutation-error", t._handlers.mutationError), t.dom.addEventListener("ln-data-store:synced", t._handlers.refreshSynced), t.dom.addEventListener("ln-data-store:query-changed", t._handlers.refreshQuery);
  }
  y.prototype._ownsStore = function(t) {
    const e = this.findChildren();
    return !!(e.store && e.store._name === t && t);
  }, y.prototype._serveData = function(t, e) {
    const n = t.target, d = e === "table" ? "data-ln-table-source" : e === "list" ? "data-ln-list-source" : "data-ln-chart-source", g = n.getAttribute(d);
    if (!g || !this._ownsStore(g)) return;
    const E = t.detail || {}, w = pn(E);
    this._boundQueries.set(n, w);
    const A = this.findChildren(), S = this, q = A.store;
    return (q && q.ready ? q.ready : Promise.resolve()).then(function() {
      const x = Pt(q, A.connector), k = ae(w, q && q.query);
      if (x === "remote") {
        L(n, "ln-" + e + ":set-loading", { loading: !0 }), L(A.connectorEl, "ln-api-connector:request-query", {
          query: k,
          meta: { targetEl: n, kind: e, offset: k.offset, limit: k.limit }
        });
        return;
      }
      if (x !== "store") {
        L(n, "ln-" + e + ":set-loading", { loading: !1 });
        return;
      }
      return q.getAll(k).then(function(R) {
        const N = {
          data: R.data,
          total: R.total,
          filtered: R.filtered,
          offset: E.offset !== void 0 ? E.offset : R.offset,
          queryGen: E.queryGen !== void 0 ? E.queryGen : R.queryGen
        };
        L(n, "ln-" + e + ":set-data", N), S._boundDelivered.set(n, !0);
      });
    }).catch(function(x) {
      L(n, "ln-" + e + ":set-loading", { loading: !1 }), L(S.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: e,
        store: g,
        target: n,
        error: x
      });
    });
  }, y.prototype._serveOptions = function(t) {
    const e = t.target, n = e.getAttribute("data-ln-options");
    if (!this._ownsStore(n)) return;
    const d = this.findChildren(), g = d.store, E = g && g.ready ? g.ready : Promise.resolve(), w = this;
    return E.then(function() {
      const A = Pt(g, d.connector);
      if (A === "remote") {
        L(d.connectorEl, "ln-api-connector:request-query", {
          query: {},
          meta: { targetEl: e, kind: "options" }
        });
        return;
      }
      if (A === "store")
        return g.getAll({}).then(function(S) {
          L(e, "ln-options:set-data", { data: S.data });
        });
    }).catch(function(A) {
      w._reportReconciliationError("options-query", A, { targetEl: e, kind: "options" });
    });
  }, y.prototype._serveStat = function(t) {
    const e = t.target, n = e.getAttribute("data-ln-stat");
    if (!this._ownsStore(n)) return;
    const d = t.detail && t.detail.filters ? t.detail.filters : null, g = this.findChildren(), E = g.store, w = E && E.ready ? E.ready : Promise.resolve(), A = this;
    return w.then(function() {
      const S = Pt(E, g.connector);
      if (S === "remote") {
        L(g.connectorEl, "ln-api-connector:request-query", {
          query: { filters: d },
          meta: { targetEl: e, kind: "stat" }
        });
        return;
      }
      if (S === "store")
        return E.count(d).then(function(q) {
          L(e, "ln-stat:set-count", { count: q });
        });
    }).catch(function(S) {
      A._reportReconciliationError("stat-query", S, { targetEl: e, kind: "stat" });
    });
  }, y.prototype._refreshAll = function(t, e) {
    const n = this, d = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let g = 0; g < d.length; g++) {
      const E = d[g];
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
        (function(T, x) {
          S.getAll(ae(q, S.query)).then(function(k) {
            const R = {
              data: k.data,
              total: t && t.total !== void 0 ? t.total : k.total,
              filtered: t && t.filtered !== void 0 ? t.filtered : k.filtered,
              offset: k.offset !== void 0 ? k.offset : t && t.offset !== void 0 ? t.offset : q.offset,
              queryGen: k.queryGen !== void 0 ? k.queryGen : t && t.queryGen !== void 0 ? t.queryGen : q.queryGen
            };
            L(T, "ln-" + x + ":set-loading", { loading: !1 }), L(T, "ln-" + x + ":set-data", R), n._boundDelivered.set(T, !0);
          });
        })(E, A);
      } else if (A === "options")
        (function(q) {
          S.getAll({}).then(function(T) {
            L(q, "ln-options:set-data", { data: T.data });
          });
        })(E);
      else if (A === "stat") {
        const q = E.getAttribute("data-ln-stat-filter");
        let T = null;
        if (q) {
          const x = q.indexOf(":");
          if (x !== -1) {
            const k = q.slice(0, x), R = q.slice(x + 1);
            T = {}, T[k] = [R];
          }
        }
        (function(x, k) {
          S.count(k).then(function(R) {
            L(x, "ln-stat:set-count", { count: R });
          });
        })(E, T);
      }
    }
  }, y.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const t = this;
    t._handlers && (t.dom.removeEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.removeEventListener("ln-data-store:request-page", t._handlers.requestPage), t.dom.removeEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.removeEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.removeEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.removeEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.removeEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.removeEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.removeEventListener("submit", t._handlers.formSubmit), m.forEach(function(e) {
      t.dom.removeEventListener(e + ":fetched", t._handlers.connFetched), t.dom.removeEventListener(e + ":created", t._handlers.connCreated), t.dom.removeEventListener(e + ":updated", t._handlers.connUpdated), t.dom.removeEventListener(e + ":deleted", t._handlers.connDeleted), t.dom.removeEventListener(e + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.removeEventListener(e + ":error", t._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", t._handlers.reqTableData), document.removeEventListener("ln-list:request-data", t._handlers.reqListData), document.removeEventListener("ln-chart:request-data", t._handlers.reqChartData), document.removeEventListener("ln-options:request-data", t._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.removeEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:created", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:mutation-error", t._handlers.mutationError), t.dom.removeEventListener("ln-data-store:synced", t._handlers.refreshSynced), t.dom.removeEventListener("ln-data-store:query-changed", t._handlers.refreshQuery), t._handlers = null), t._boundQueries = null, t._boundDelivered = null, t._mutationReceipts.close(new Error("Data coordinator destroyed")), t._mutationReceipts = null, _.delete(this), f(), delete this.dom[a], delete this.dom[b];
  };
  function s(t, e) {
    const n = t[a];
    n && e === "data-ln-data-mapper" && n.refreshMapper();
  }
  B(l, a, y, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: s
  });
})();
const gn = "ln_api_queue", _n = 2, $ = "outbox", Y = "_queue_meta";
function tt(l, a) {
  return l.error || new Error(a);
}
function mt(l, a) {
  return l.bound([a, -1 / 0], [a, 1 / 0]);
}
function le(l) {
  return "seq:" + l;
}
function Ct(l) {
  return "paused:" + l;
}
function ce(l) {
  l.leaseOwner = null, l.leaseUntil = 0;
}
function bn(l, a, b) {
  return typeof l != "string" || l.indexOf(a) === -1 ? l : l.split(a).join(b);
}
function yn(l, a, b, v) {
  const _ = /* @__PURE__ */ new Map(), h = [], u = [];
  for (const o of l || [])
    _.has(o.chainKey) || _.set(o.chainKey, []), _.get(o.chainKey).push(o);
  return _.forEach((o, c) => {
    o.sort((f, p) => f.seq - p.seq);
    const r = o[0];
    if (!(!r || r.status === "failed")) {
      if (r.status === "inflight" && (r.leaseUntil || 0) > v) {
        u.push({ chainKey: c, at: r.leaseUntil });
        return;
      }
      if ((r.nextAttemptAt || 0) > v) {
        u.push({ chainKey: c, at: r.nextAttemptAt });
        return;
      }
      r.status = "inflight", r.leaseOwner = a, r.leaseUntil = v + b, r.updatedAt = v, h.push(r);
    }
  }), { entries: h, wakeups: u };
}
function vn(l, a, b, v, _) {
  const h = [], u = [];
  for (const o of l || []) {
    if (o.entryId === a) {
      u.push(o.entryId);
      continue;
    }
    o.chainKey === b && (o.chainKey = v, o.targetId === b && (o.targetId = v), o.meta && o.meta.id === b && (o.meta.id = v), o.meta && typeof o.meta.action == "string" && (o.meta.action = bn(o.meta.action, b, v)), o.updatedAt = _, h.push(o));
  }
  return { changed: h, deleted: u };
}
class wn {
  constructor(a) {
    a = a || {}, this.indexedDB = a.indexedDB || globalThis.indexedDB, this.keyRange = a.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = a.dbName || gn, this.now = a.now || (() => Date.now()), this.uuid = a.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((a, b) => {
      const v = this.indexedDB.open(this.dbName, _n);
      v.onupgradeneeded = (_) => {
        const h = _.target.result;
        let u;
        h.objectStoreNames.contains($) ? u = _.target.transaction.objectStore($) : u = h.createObjectStore($, { keyPath: "entryId" }), u.indexNames.contains("by_scope_chain") || u.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), u.indexNames.contains("by_scope_seq") || u.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), h.objectStoreNames.contains(Y) || h.createObjectStore(Y, { keyPath: "key" });
      }, v.onerror = () => b(tt(v, "Queue database open failed")), v.onsuccess = (_) => {
        this._db = _.target.result, this._db.onversionchange = () => this.close(), a(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((a, b) => {
      const v = this.indexedDB.deleteDatabase(this.dbName);
      v.onsuccess = () => a(), v.onerror = () => b(tt(v, "Queue database delete failed")), v.onblocked = () => b(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(a) {
    return this.open().then((b) => b ? new Promise((v, _) => {
      const u = b.transaction($, "readonly").objectStore($).index("by_scope_seq").getAll(mt(this.keyRange, a));
      u.onsuccess = () => v(u.result || []), u.onerror = () => _(tt(u, "Queue scope read failed"));
    }) : []);
  }
  enqueue(a, b) {
    return b = b || {}, this.open().then((v) => v ? new Promise((_, h) => {
      const u = v.transaction([Y, $], "readwrite"), o = u.objectStore(Y), c = u.objectStore($), r = le(a);
      let f = null;
      const p = (y) => {
        const i = y + 1;
        f = {
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
        }, o.put({ key: r, value: i }), c.put(f);
      }, m = o.get(r);
      m.onerror = () => h(tt(m, "Queue sequence read failed")), m.onsuccess = () => {
        const y = m.result;
        if (y && typeof y.value == "number") {
          p(y.value);
          return;
        }
        const i = c.index("by_scope_seq").getAll(mt(this.keyRange, a));
        i.onerror = () => h(tt(i, "Queue sequence migration failed")), i.onsuccess = () => {
          const s = (i.result || []).reduce((t, e) => Math.max(t, e.seq || 0), 0);
          p(s);
        };
      }, u.oncomplete = () => _(f), u.onerror = () => h(u.error || new Error("Queue enqueue transaction failed")), u.onabort = () => h(u.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(a, b, v) {
    return this.open().then((_) => _ ? new Promise((h, u) => {
      const o = _.transaction($, "readwrite"), c = o.objectStore($), r = c.index("by_scope_seq").getAll(mt(this.keyRange, a)), f = this.now();
      let p = { entries: [], wakeups: [] };
      r.onerror = () => u(tt(r, "Queue claim read failed")), r.onsuccess = () => {
        p = yn(r.result || [], b, v, f);
        for (const m of p.entries) c.put(m);
      }, o.oncomplete = () => h(p), o.onerror = () => u(o.error || new Error("Queue claim transaction failed")), o.onabort = () => u(o.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(a, b) {
    return this._updateEntry(a, b, (v, _) => (_.delete(v.entryId), { status: "acked", entry: v }));
  }
  nack(a, b, v, _) {
    _ = _ || {};
    const h = _.maxAttempts || 8, u = _.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((o) => o ? new Promise((c, r) => {
      const f = o.transaction([$, Y], "readwrite"), p = f.objectStore($), m = f.objectStore(Y), y = p.get(b);
      let i = null;
      y.onerror = () => r(tt(y, "Queue nack read failed")), y.onsuccess = () => {
        const s = y.result;
        if (!(!s || s.scope !== a)) {
          if (v === "drop") {
            p.delete(s.entryId), i = { status: "dropped", entry: s };
            return;
          }
          if (ce(s), s.updatedAt = this.now(), v === "auth") {
            s.status = "pending", p.put(s), m.put({ key: Ct(a), value: "auth" }), i = { status: "auth", entry: s };
            return;
          }
          if (v === "retry") {
            if (s.attempts = (s.attempts || 0) + 1, s.attempts >= h) {
              s.status = "failed", s.nextAttemptAt = 0, p.put(s), i = { status: "failed", entry: s };
              return;
            }
            const t = u[Math.min(s.attempts - 1, u.length - 1)];
            s.status = "pending", s.nextAttemptAt = this.now() + t, p.put(s), i = { status: "retry", entry: s, delay: t };
          }
        }
      }, f.oncomplete = () => c(i), f.onerror = () => r(f.error || new Error("Queue nack transaction failed")), f.onabort = () => r(f.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(a, b, v) {
    return this._remapTransaction(a, null, b, v);
  }
  resolveCreate(a, b, v, _) {
    return this._remapTransaction(a, b, v, _);
  }
  _remapTransaction(a, b, v, _) {
    return this.open().then((h) => h ? new Promise((u, o) => {
      const c = h.transaction($, "readwrite"), r = c.objectStore($), f = r.index("by_scope_seq").getAll(mt(this.keyRange, a));
      let p = { changed: [], deleted: [] };
      f.onerror = () => o(tt(f, "Queue remap read failed")), f.onsuccess = () => {
        p = vn(f.result || [], b, v, _, this.now());
        for (const m of p.deleted) r.delete(m);
        for (const m of p.changed) r.put(m);
      }, c.oncomplete = () => u(p.changed), c.onerror = () => o(c.error || new Error("Queue remap transaction failed")), c.onabort = () => o(c.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(a) {
    return this.open().then((b) => b ? new Promise((v, _) => {
      const h = b.transaction($, "readwrite"), u = h.objectStore($), o = u.index("by_scope_seq").getAll(mt(this.keyRange, a));
      let c = 0;
      o.onerror = () => _(tt(o, "Queue failed-entry read failed")), o.onsuccess = () => {
        for (const r of o.result || [])
          r.status === "failed" && (r.status = "pending", r.attempts = 0, r.nextAttemptAt = 0, r.updatedAt = this.now(), ce(r), u.put(r), c++);
      }, h.oncomplete = () => v(c), h.onerror = () => _(h.error || new Error("Queue failed-entry reset failed")), h.onabort = () => _(h.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(a) {
    return this.open().then((b) => b ? new Promise((v, _) => {
      const u = b.transaction(Y, "readonly").objectStore(Y).get(Ct(a));
      u.onsuccess = () => {
        const o = u.result ? u.result.value : !1;
        v(o || !1);
      }, u.onerror = () => _(tt(u, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(a, b) {
    return this.open().then((v) => {
      if (v)
        return new Promise((_, h) => {
          const u = v.transaction(Y, "readwrite"), o = typeof b == "string" ? b : b ? "manual" : !1;
          u.objectStore(Y).put({ key: Ct(a), value: o }), u.oncomplete = () => _(), u.onerror = () => h(u.error || new Error("Queue pause-state write failed")), u.onabort = () => h(u.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(a) {
    return this.open().then((b) => {
      if (b)
        return new Promise((v, _) => {
          const h = b.transaction([$, Y], "readwrite"), o = h.objectStore($).index("by_scope_seq").openCursor(mt(this.keyRange, a));
          o.onsuccess = (c) => {
            const r = c.target.result;
            r && (r.delete(), r.continue());
          }, o.onerror = () => _(tt(o, "Queue clear failed")), h.objectStore(Y).delete(le(a)), h.objectStore(Y).delete(Ct(a)), h.oncomplete = () => v(), h.onerror = () => _(h.error || new Error("Queue clear transaction failed")), h.onabort = () => _(h.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(a, b, v) {
    return this.open().then((_) => _ ? new Promise((h, u) => {
      const o = _.transaction($, "readwrite"), c = o.objectStore($), r = c.get(b);
      let f = null;
      r.onerror = () => u(tt(r, "Queue entry read failed")), r.onsuccess = () => {
        const p = r.result;
        !p || p.scope !== a || (f = v(p, c));
      }, o.oncomplete = () => h(f), o.onerror = () => u(o.error || new Error("Queue entry transaction failed")), o.onabort = () => u(o.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const l = "data-ln-api-queue", a = "lnApiQueue", b = [2e3, 5e3, 15e3, 6e4, 3e5], v = 8, _ = 6e4;
  if (window[a] !== void 0) return;
  function h() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (f) => {
        const p = Math.random() * 16 | 0;
        return (f === "x" ? p : p & 3 | 8).toString(16);
      });
    }
  }
  const u = new wn({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: h
  });
  function o(r) {
    this.dom = r, r[a] = this;
    const f = r.closest("[data-ln-data-coordinator]");
    this.scope = r.id || (f ? f.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = h(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const p = this;
    return u.open().then((m) => m ? u.getPaused(p.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((m) => {
      if (p._paused = !!m, p._paused) {
        const y = typeof m == "string" ? m : "auth";
        L(p.dom, "ln-api-queue:paused", { reason: y, restored: !0 });
      }
      return p._emitPendingCount();
    }).then(() => p._drain()).catch((m) => {
      console.error("[ln-api-queue] Initialization failed:", m), L(p.dom, "ln-api-queue:error", { operation: "initialize", error: m });
    }), this;
  }
  o.prototype._isOnline = function() {
    const r = this.dom.getAttribute("data-ln-api-queue-online");
    return r === "true" ? !0 : r === "false" ? !1 : navigator.onLine;
  }, o.prototype._emitPendingCount = function() {
    const r = this;
    return u.allForScope(r.scope).then((f) => (L(r.dom, "ln-api-queue:pending-count", { count: f.length, scope: r.scope }), f.length === 0 && L(r.dom, "ln-api-queue:drained", { scope: r.scope }), f));
  }, o.prototype._clearTimer = function(r) {
    const f = this._timers.get(r);
    f && (clearTimeout(f), this._timers.delete(r));
  }, o.prototype._scheduleTimer = function(r, f) {
    const p = Math.max(0, f), m = this._timers.get(r);
    m && clearTimeout(m);
    const y = this, i = setTimeout(() => {
      y._timers.delete(r), y._drain();
    }, p);
    this._timers.set(r, i);
  }, o.prototype._drain = function() {
    const r = this;
    return r._paused || !r._isOnline() ? Promise.resolve() : (r._drainPromise || (r._drainPromise = u.claimReady(r.scope, r._workerId, _).then((f) => {
      for (const p of f.wakeups)
        r._scheduleTimer(p.chainKey, p.at - Date.now());
      for (const p of f.entries)
        r._clearTimer(p.chainKey), L(r.dom, "ln-api-queue:send", {
          entryId: p.entryId,
          chainKey: p.chainKey,
          op: p.op,
          targetId: p.targetId,
          payload: p.payload,
          expectedVersion: p.expectedVersion,
          idempotencyKey: p.entryId,
          meta: p.meta
        });
    }).catch((f) => {
      console.error("[ln-api-queue] Drain failed:", f), L(r.dom, "ln-api-queue:error", { operation: "drain", error: f });
    }).finally(() => {
      r._drainPromise = null;
    })), r._drainPromise);
  }, o.prototype._onEnqueue = function(r) {
    const f = this;
    return u.enqueue(f.scope, r.detail || {}).then((p) => {
      if (p)
        return f._emitPendingCount().then((m) => (L(f.dom, "ln-api-queue:enqueued", {
          entryId: p.entryId,
          chainKey: p.chainKey,
          count: m.length
        }), f._drain()));
    }).catch((p) => {
      L(f.dom, "ln-api-queue:error", { operation: "enqueue", error: p });
    });
  }, o.prototype._onAck = function(r) {
    const f = this, p = r.detail || {};
    return u.ack(f.scope, p.entryId).then(() => f._emitPendingCount()).then(() => f._drain()).catch((m) => {
      L(f.dom, "ln-api-queue:error", { operation: "ack", entryId: p.entryId, error: m });
    });
  }, o.prototype._onNack = function(r) {
    const f = this, p = r.detail || {};
    return u.nack(f.scope, p.entryId, p.reason, {
      maxAttempts: v,
      backoff: b
    }).then((m) => {
      if (m)
        return m.status === "failed" ? L(f.dom, "ln-api-queue:failed", {
          entryId: m.entry.entryId,
          chainKey: m.entry.chainKey,
          attempts: m.entry.attempts
        }) : m.status === "retry" ? f._scheduleTimer(m.entry.chainKey, m.delay) : m.status === "auth" && (f._paused = !0, L(f.dom, "ln-api-queue:paused", { reason: "auth" }), L(f.dom, "ln-api-queue:auth-required", {
          entryId: m.entry.entryId,
          chainKey: m.entry.chainKey
        })), f._emitPendingCount().then(() => {
          if (m.status === "dropped") return f._drain();
        });
    }).catch((m) => {
      L(f.dom, "ln-api-queue:error", { operation: "nack", entryId: p.entryId, error: m });
    });
  }, o.prototype._onRemap = function(r) {
    const f = this, p = r.detail || {};
    return u.remap(f.scope, p.oldKey, p.newId).catch((m) => {
      L(f.dom, "ln-api-queue:error", { operation: "remap", error: m });
    });
  }, o.prototype._onResolveCreate = function(r) {
    const f = this, p = r.detail || {};
    return u.resolveCreate(f.scope, p.entryId, p.oldKey, p.newId).then(() => f._emitPendingCount()).then(() => f._drain()).catch((m) => {
      L(f.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: p.entryId,
        error: m
      });
    });
  }, o.prototype._onResume = function() {
    const r = this;
    return u.setPaused(r.scope, !1).then(() => (r._paused = !1, L(r.dom, "ln-api-queue:resumed", {}), r._drain())).catch((f) => {
      L(r.dom, "ln-api-queue:error", { operation: "resume", error: f });
    });
  }, o.prototype._onPause = function() {
    const r = this;
    return u.setPaused(r.scope, "manual").then(() => {
      r._paused = !0, L(r.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((f) => {
      L(r.dom, "ln-api-queue:error", { operation: "pause", error: f });
    });
  }, o.prototype._onDrain = function() {
    const r = this;
    return u.resetFailed(r.scope).then(() => {
      const f = r._drainPromise;
      return f ? f.then(() => r._drain()) : r._drain();
    }).catch((f) => {
      L(r.dom, "ln-api-queue:error", { operation: "manual-drain", error: f });
    });
  }, o.prototype._onClear = function() {
    const r = this;
    return r._timers.forEach((f) => clearTimeout(f)), r._timers.clear(), u.clear(r.scope).then(() => {
      r._paused = !1, L(r.dom, "ln-api-queue:pending-count", { count: 0, scope: r.scope }), L(r.dom, "ln-api-queue:drained", { scope: r.scope });
    }).catch((f) => {
      L(r.dom, "ln-api-queue:error", { operation: "clear", error: f });
    });
  }, o.prototype._bindEvents = function() {
    const r = this;
    r._handlers = {
      enqueue: (f) => r._onEnqueue(f),
      ack: (f) => r._onAck(f),
      nack: (f) => r._onNack(f),
      remap: (f) => r._onRemap(f),
      resolveCreate: (f) => r._onResolveCreate(f),
      resume: () => r._onResume(),
      pause: () => r._onPause(),
      drain: () => r._onDrain(),
      clear: () => r._onClear()
    }, r.dom.addEventListener("ln-api-queue:request-enqueue", r._handlers.enqueue), r.dom.addEventListener("ln-api-queue:ack", r._handlers.ack), r.dom.addEventListener("ln-api-queue:nack", r._handlers.nack), r.dom.addEventListener("ln-api-queue:request-remap", r._handlers.remap), r.dom.addEventListener("ln-api-queue:resolve-create", r._handlers.resolveCreate), r.dom.addEventListener("ln-api-queue:request-resume", r._handlers.resume), r.dom.addEventListener("ln-api-queue:request-pause", r._handlers.pause), r.dom.addEventListener("ln-api-queue:request-drain", r._handlers.drain), r.dom.addEventListener("ln-api-queue:request-clear", r._handlers.clear);
  }, o.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const r = this;
    r.dom.removeEventListener("ln-api-queue:request-enqueue", r._handlers.enqueue), r.dom.removeEventListener("ln-api-queue:ack", r._handlers.ack), r.dom.removeEventListener("ln-api-queue:nack", r._handlers.nack), r.dom.removeEventListener("ln-api-queue:request-remap", r._handlers.remap), r.dom.removeEventListener("ln-api-queue:resolve-create", r._handlers.resolveCreate), r.dom.removeEventListener("ln-api-queue:request-resume", r._handlers.resume), r.dom.removeEventListener("ln-api-queue:request-pause", r._handlers.pause), r.dom.removeEventListener("ln-api-queue:request-drain", r._handlers.drain), r.dom.removeEventListener("ln-api-queue:request-clear", r._handlers.clear), window.removeEventListener("online", r._onlineHandler), r._timers.forEach((f) => clearTimeout(f)), r._timers.clear(), L(r.dom, "ln-api-queue:destroyed", { scope: r.scope }), delete r.dom[a];
  };
  function c(r) {
    const f = r[a];
    f && f._drain();
  }
  B(l, a, o, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: c
  });
})();
function De(l) {
  if (l == null || l === "") return null;
  const a = Number(l);
  return Number.isFinite(a) ? a : null;
}
function gt(l) {
  return String(Math.round(l * 1e3) / 1e3);
}
function En(l, a, b) {
  const v = De(l);
  return v === null || v < 0 ? 0 : Math.min(v, Math.min(a, b) / 2);
}
function An(l) {
  if (typeof l != "string") return null;
  const a = l.trim().split(/[\s,]+/).map(Number);
  return a.length !== 4 || a.some((b) => !Number.isFinite(b)) || a[2] <= 0 || a[3] <= 0 ? null : { x: a[0], y: a[1], width: a[2], height: a[3] };
}
function Sn(l, a) {
  a = a || {};
  const b = a.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, v = a.xField || "label", _ = a.yField || "value", h = a.includeZero !== !1, u = En(a.padding, b.width, b.height), o = Array.isArray(l) ? l : [], c = [];
  for (let T = 0; T < o.length; T++) {
    const x = o[T] || {}, k = De(x[_]);
    k !== null && c.push({
      record: x,
      sourceIndex: T,
      label: x[v] == null ? String(T + 1) : String(x[v]),
      value: k
    });
  }
  if (c.length === 0)
    return {
      points: [],
      linePoints: "",
      areaPoints: "",
      count: 0,
      min: null,
      max: null,
      domainMin: 0,
      domainMax: 1,
      baselineY: b.y + b.height - u
    };
  const r = c.map((T) => T.value), f = Math.min(...r), p = Math.max(...r);
  let m = h ? Math.min(0, f) : f, y = h ? Math.max(0, p) : p;
  if (m === y)
    if (m === 0)
      y = 1;
    else {
      const T = Math.max(Math.abs(m) * 0.1, 1);
      m -= T, y += T;
    }
  const i = b.x + u, s = b.y + u, t = Math.max(0, b.width - u * 2), e = Math.max(0, b.height - u * 2), n = c.length > 1 ? t / (c.length - 1) : 0, d = y - m, g = (T) => s + (y - T) / d * e, E = c.map((T, x) => ({
    ...T,
    x: c.length === 1 ? i + t / 2 : i + x * n,
    y: g(T.value)
  })), w = m <= 0 && y >= 0 ? 0 : m, A = g(w), S = E.map((T) => gt(T.x) + "," + gt(T.y)).join(" "), q = [
    gt(E[0].x) + "," + gt(A),
    S,
    gt(E[E.length - 1].x) + "," + gt(A)
  ].join(" ");
  return {
    points: E,
    linePoints: S,
    areaPoints: q,
    count: E.length,
    min: f,
    max: p,
    domainMin: m,
    domainMax: y,
    baselineY: A
  };
}
(function() {
  const l = "data-ln-chart", a = "lnChart", b = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[a] !== void 0) return;
  function v(o) {
    if (!o) return null;
    const c = o.split(":"), r = c[0].trim();
    return r ? {
      field: r,
      direction: c[1] && c[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
    } : null;
  }
  function _(o, c) {
    if (o == null || !Number.isFinite(o)) return "";
    try {
      return new Intl.NumberFormat(W(c)).format(o);
    } catch {
      return String(o);
    }
  }
  function h(o, c) {
    o && (o.textContent = c);
  }
  function u(o) {
    this.dom = o, this.name = o.getAttribute(l) || "", this.source = o.getAttribute("data-ln-chart-source") || this.name, this.plot = o.querySelector("[data-ln-chart-plot]"), this.line = o.querySelector("[data-ln-chart-line]"), this.area = o.querySelector("[data-ln-chart-area]"), this.labels = o.querySelector("[data-ln-chart-labels]"), this.empty = o.querySelector("[data-ln-chart-empty]"), this.minimum = o.querySelector("[data-ln-chart-min]"), this.maximum = o.querySelector("[data-ln-chart-max]"), this.count = o.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const c = this;
    return this._onSetData = function(r) {
      const f = r.detail || {};
      c._data = Array.isArray(f.data) ? f.data : [], c.isLoaded = !0, c._setLoading(!1), c._render();
    }, this._onSetLoading = function(r) {
      c._setLoading(!!(r.detail && r.detail.loading));
    }, this._onRefresh = function() {
      c.requestData();
    }, o.addEventListener("ln-chart:set-data", this._onSetData), o.addEventListener("ln-chart:set-loading", this._onSetLoading), o.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  u.prototype._readOptions = function() {
    const o = this.dom.getAttribute("data-ln-chart-padding"), c = o === null ? NaN : Number(o), r = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(c) && c >= 0 ? c : 16,
      type: r === "area" || r === "polygon" ? "area" : "line",
      viewBox: this.plot && An(this.plot.getAttribute("viewBox")) || b
    };
  }, u.prototype._setLoading = function(o) {
    this.dom.classList.toggle("ln-chart--loading", o), this.dom.setAttribute("aria-busy", o ? "true" : "false");
  }, u.prototype._renderLabels = function(o) {
    if (!this.labels || (this.labels.replaceChildren(), o.count === 0)) return;
    const c = this.name + "-label", r = '[data-ln-template="' + c + '"]';
    if (!this.dom.querySelector(r) && !document.querySelector(r)) return;
    const f = ct(this.dom, c, "ln-chart");
    if (f)
      for (const p of o.points) {
        const m = f.cloneNode(!0);
        At(m, {
          label: p.label,
          value: _(p.value, this.dom)
        }), this.labels.appendChild(m);
      }
  }, u.prototype._render = function() {
    const o = this._readOptions(), c = Sn(this._data, o);
    this.model = c, this.line && (this.line.setAttribute("points", c.linePoints), this.line.toggleAttribute("hidden", c.count === 0)), this.area && (this.area.setAttribute("points", c.areaPoints), this.area.toggleAttribute("hidden", c.count === 0 || o.type !== "area"));
    const r = c.count === 0;
    this.dom.classList.toggle("ln-chart--empty", r), this.empty && this.empty.toggleAttribute("hidden", !r), h(this.minimum, _(c.min, this.dom)), h(this.maximum, _(c.max, this.dom)), h(this.count, _(c.count, this.dom)), this._renderLabels(c), L(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: c.count,
      min: c.min,
      max: c.max
    });
  }, u.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, L(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: v(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, u.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[a]);
  }, B(l, a, u, "ln-chart", {
    extraAttributes: [
      "data-ln-chart-source",
      "data-ln-chart-x",
      "data-ln-chart-y",
      "data-ln-chart-type",
      "data-ln-chart-padding",
      "data-ln-chart-zero",
      "data-ln-chart-sort"
    ],
    onAttributeChange: function(o, c) {
      const r = o[a];
      if (r) {
        if (c === "data-ln-chart-source" || c === "data-ln-chart-sort") {
          r.requestData();
          return;
        }
        r._render();
      }
    }
  });
})();
(function() {
  const l = "data-ln-options", a = "lnOptions";
  if (window[a] !== void 0) return;
  function b(v) {
    this.dom = v, this._storeName = v.getAttribute(l), this._valueField = v.getAttribute("data-ln-options-value") || "id", this._labelField = v.getAttribute("data-ln-options-label") || "name";
    const _ = this;
    return this._onSetData = function(h) {
      _._rebuild(h.detail.data || []);
    }, v.addEventListener("ln-options:set-data", this._onSetData), L(v, "ln-options:request-data", { options: this._storeName }), this;
  }
  b.prototype._rebuild = function(v) {
    const _ = this.dom, h = this._valueField, u = this._labelField, o = _.value, c = _.querySelectorAll("option");
    for (let f = c.length - 1; f >= 0; f--)
      c[f].value !== "" && _.removeChild(c[f]);
    for (let f = 0; f < v.length; f++) {
      const p = v[f], m = document.createElement("option");
      m.value = String(p[h]), m.textContent = p[u] != null ? p[u] : "", _.appendChild(m);
    }
    const r = _.options;
    for (let f = 0; f < r.length; f++)
      if (r[f].value === o) {
        _.value = o;
        break;
      }
  }, b.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[a]);
  }, B(l, a, b, "ln-options");
})();
(function() {
  const l = "data-ln-stat", a = "lnStat";
  if (window[a] !== void 0) return;
  function b(_) {
    if (!_) return null;
    const h = _.indexOf(":");
    if (h === -1) return null;
    const u = _.slice(0, h), o = _.slice(h + 1), c = {};
    return c[u] = [o], c;
  }
  function v(_) {
    return this.dom = _, this._storeName = _.getAttribute(l), this._filters = b(_.getAttribute("data-ln-stat-filter")), this._onSetCount = function(h) {
      _.textContent = String(h.detail.count), _.classList.remove("is-loading");
    }, _.addEventListener("ln-stat:set-count", this._onSetCount), L(_, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  v.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[a]);
  }, B(l, a, v, "ln-stat");
})();
(function() {
  const l = "ln-icon-sprite", a = "#ln-icon-", b = "#ln-icon-custom-", v = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set();
  let h = null;
  const u = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), o = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), c = "lni:", r = "lni:v", f = "1";
  function p() {
    try {
      if (localStorage.getItem(r) !== f) {
        for (let n = localStorage.length - 1; n >= 0; n--) {
          const d = localStorage.key(n);
          d && d.indexOf(c) === 0 && localStorage.removeItem(d);
        }
        localStorage.setItem(r, f);
      }
    } catch {
    }
  }
  p();
  function m() {
    return h || (h = document.getElementById(l), h || (h = document.createElementNS("http://www.w3.org/2000/svg", "svg"), h.id = l, h.setAttribute("hidden", ""), h.setAttribute("aria-hidden", "true"), h.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(h, document.body.firstChild))), h;
  }
  function y(n) {
    return n.indexOf(b) === 0 ? o + "/" + n.slice(b.length) + ".svg" : u + "/" + n.slice(a.length) + ".svg";
  }
  function i(n, d) {
    const g = d.match(/viewBox="([^"]+)"/), E = g ? g[1] : "0 0 24 24", w = d.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), A = w ? w[1].trim() : "", S = d.match(/<svg([^>]*)>/i), q = S ? S[1] : "", T = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    T.id = n, T.setAttribute("viewBox", E), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(x) {
      const k = q.match(new RegExp(x + '="([^"]*)"'));
      k && T.setAttribute(x, k[1]);
    }), T.innerHTML = A, m().querySelector("defs").appendChild(T);
  }
  function s(n) {
    if (v.has(n) || _.has(n)) return;
    if (n.indexOf(b) === 0 && !o) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", n);
      return;
    }
    const d = n.slice(1);
    try {
      const E = localStorage.getItem(c + d);
      if (E) {
        i(d, E), v.add(n);
        return;
      }
    } catch {
    }
    _.add(n);
    const g = y(n);
    fetch(g).then(function(E) {
      if (!E.ok) throw new Error(E.status);
      return E.text();
    }).then(function(E) {
      i(d, E), v.add(n), _.delete(n);
      try {
        localStorage.setItem(c + d, E);
      } catch {
      }
    }).catch(function(E) {
      console.error("[ln-icon] Fetch failed for:", d, E), _.delete(n);
    });
  }
  function t(n) {
    const d = 'use[href^="' + a + '"], use[href^="' + b + '"]', g = n.querySelectorAll ? n.querySelectorAll(d) : [];
    if (n.matches && n.matches(d)) {
      const E = n.getAttribute("href");
      E && s(E);
    }
    Array.prototype.forEach.call(g, function(E) {
      const w = E.getAttribute("href");
      w && s(w);
    });
  }
  function e() {
    t(document), new MutationObserver(function(n) {
      n.forEach(function(d) {
        if (d.type === "childList")
          d.addedNodes.forEach(function(g) {
            g.nodeType === 1 && t(g);
          });
        else if (d.type === "attributes" && d.attributeName === "href") {
          const g = d.target.getAttribute("href");
          g && (g.indexOf(a) === 0 || g.indexOf(b) === 0) && s(g);
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
  const l = "data-ln-debug", a = "lnDebug";
  if (window[a] !== void 0) return;
  function b(v) {
    return this.dom = v, this;
  }
  b.prototype.destroy = function() {
    delete this.dom[a];
  }, B(l, a, b, "ln-debug");
})();
