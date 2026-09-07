function ue(t) {
  let n = !1;
  for (let u = 0; u < t.length; u++) {
    const p = t[u];
    if (!(p === "" || p == null) && (n = !0, !Number.isFinite(Number(p))))
      return "string";
  }
  return n ? "number" : "string";
}
function he(t, n, u, p) {
  if (u === "number") {
    const c = parseFloat(t), i = parseFloat(n);
    return (isNaN(c) ? 0 : c) - (isNaN(i) ? 0 : i);
  }
  const l = t != null ? String(t) : "", d = n != null ? String(n) : "";
  return p ? p.compare(l, d) : l < d ? -1 : l > d ? 1 : 0;
}
if (typeof window < "u") {
  const t = console.warn;
  console.warn = function(...n) {
    typeof n[0] == "string" && (n[0].startsWith("[ln-") || n[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || t.apply(console, n);
  };
}
const Jt = {};
function Ht(t, n) {
  Jt[t] || (Jt[t] = document.querySelector('[data-ln-template="' + t + '"]'));
  const u = Jt[t];
  return u ? u.content.cloneNode(!0) : (console.warn("[" + (n || "ln-core") + '] Template "' + t + '" not found'), null);
}
function S(t, n, u) {
  t.dispatchEvent(new CustomEvent(n, {
    bubbles: !0,
    detail: u || {}
  }));
}
function W(t, n, u) {
  const p = new CustomEvent(n, {
    bubbles: !0,
    cancelable: !0,
    detail: u || {}
  });
  return t.dispatchEvent(p), p;
}
function Pe(t, n, u) {
  t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter();
  const p = {
    sort: t.currentSort,
    filters: t.currentFilters,
    search: t.currentSearch
  };
  p[u] = t.name, S(t.dom, n, p);
}
function ot(t, n) {
  if (!t || !n) return t;
  const u = t.querySelectorAll("[data-ln-field]");
  for (let c = 0; c < u.length; c++) {
    const i = u[c], f = i.getAttribute("data-ln-field");
    n[f] != null && (i.textContent = n[f]);
  }
  const p = t.querySelectorAll("[data-ln-attr]");
  for (let c = 0; c < p.length; c++) {
    const i = p[c], f = i.getAttribute("data-ln-attr").split(",");
    for (let h = 0; h < f.length; h++) {
      const b = f[h].trim().split(":");
      if (b.length !== 2) continue;
      const g = b[0].trim(), _ = b[1].trim();
      n[_] != null && i.setAttribute(g, n[_]);
    }
  }
  const l = t.querySelectorAll("[data-ln-show]");
  for (let c = 0; c < l.length; c++) {
    const i = l[c], f = i.getAttribute("data-ln-show");
    f in n && i.classList.toggle("hidden", !n[f]);
  }
  const d = t.querySelectorAll("[data-ln-class]");
  for (let c = 0; c < d.length; c++) {
    const i = d[c], f = i.getAttribute("data-ln-class").split(",");
    for (let h = 0; h < f.length; h++) {
      const b = f[h].trim().split(":");
      if (b.length !== 2) continue;
      const g = b[0].trim(), _ = b[1].trim();
      _ in n && i.classList.toggle(g, !!n[_]);
    }
  }
  return t;
}
function Rn(t, n) {
  t.matches && t.matches("[data-ln-form], [data-ln-fillable]") && t.dispatchEvent(new CustomEvent("ln-fill", { detail: n ?? null, bubbles: !0 }));
  const u = t.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let p = 0; p < u.length; p++)
    u[p].dispatchEvent(new CustomEvent("ln-fill", { detail: n ?? null, bubbles: !0 }));
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(t) {
  if (!(!t.target.matches || !t.target.matches("[data-ln-fillable]")))
    if (t.detail)
      ot(t.target, t.detail);
    else {
      const n = t.target.querySelectorAll("[data-ln-field]");
      for (let u = 0; u < n.length; u++)
        n[u].textContent = "";
    }
})));
function Dt(t, n) {
  if (!t || !n) return t;
  const u = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
  for (; u.nextNode(); ) {
    const d = u.currentNode;
    d.textContent.indexOf("{{") !== -1 && (d.textContent = d.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(c, i) {
        return n[i] !== void 0 ? n[i] : "";
      }
    ));
  }
  const p = function(d, c) {
    return n[c] !== void 0 ? n[c] : "";
  }, l = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && l.push(t);
  for (let d = 0; d < l.length; d++) {
    const c = l[d], i = c.attributes;
    for (let f = 0; f < i.length; f++) {
      const h = i[f];
      h.value.indexOf("{{") !== -1 && c.setAttribute(h.name, h.value.replace(/\{\{\s*(\w+)\s*\}\}/g, p));
    }
  }
  return t;
}
function On(t, n, u, p, l, d) {
  const c = {};
  for (let f = 0; f < t.children.length; f++) {
    const h = t.children[f], b = h.getAttribute("data-ln-render-key");
    b && (c[b] = h);
  }
  const i = document.createDocumentFragment();
  for (let f = 0; f < n.length; f++) {
    const h = n[f], b = String(p(h));
    let g = c[b];
    if (g)
      l(g, h, f);
    else {
      const _ = Ht(u, d);
      if (!_ || (Dt(_, h), g = _.firstElementChild, !g)) continue;
      g.setAttribute("data-ln-render-key", b), l(g, h, f);
    }
    i.appendChild(g);
  }
  t.textContent = "", t.appendChild(i);
}
function ct(t, n) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      ct(t, n);
    }), console.warn("[" + n + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  t();
}
function pt(t, n, u) {
  if (t) {
    const p = t.querySelector('[data-ln-template="' + n + '"]');
    if (p) return p.content.cloneNode(!0);
  }
  return Ht(n, u);
}
function Vt(t, n) {
  const u = {}, p = t.querySelectorAll("[" + n + "]");
  for (let l = 0; l < p.length; l++)
    u[p[l].getAttribute(n)] = p[l].textContent, p[l].remove();
  return u;
}
function Zt(t, n, u, p) {
  if (t.nodeType !== 1) return;
  const d = n.indexOf("[") !== -1 || n.indexOf(".") !== -1 || n.indexOf("#") !== -1 ? n : "[" + n + "]", c = Array.from(t.querySelectorAll(d));
  t.matches && t.matches(d) && c.push(t);
  for (const i of c)
    i[u] || (i[u] = new p(i));
}
function kt(t) {
  return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
}
function Be(t) {
  return !!(!t || t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || typeof t.button == "number" && t.button !== 0);
}
function Mn(t) {
  if (!t) return !1;
  if (typeof t.closest == "function")
    return !!t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const n = String(t.tagName || "").toLowerCase();
  return n === "input" || n === "textarea" || n === "select" || !!t.isContentEditable;
}
function He(t) {
  return !!(!t || t.disabled || typeof t.getAttribute == "function" && t.getAttribute("aria-disabled") === "true" || typeof t.closest == "function" && t.closest("[inert]"));
}
function Fn(t, n) {
  return !t || !document.contains(t) || He(t) || n && typeof t[n] != "function" ? !1 : kt(t);
}
function Nn(t) {
  const n = t.querySelector('input[name="_method"]');
  return ((n && n.value !== "" ? n.value : t.method) || "").toUpperCase();
}
function Ue(t, n) {
  const u = !!(n && n.typed), p = n && n.exclude, l = {}, d = t.elements, c = {};
  if (u)
    for (let i = 0; i < d.length; i++) {
      const f = d[i];
      f.name && f.type === "checkbox" && !f.disabled && (c[f.name] = (c[f.name] || 0) + 1);
    }
  for (let i = 0; i < d.length; i++) {
    const f = d[i];
    if (!(!f.name || f.disabled || f.type === "file" || f.type === "submit" || f.type === "button") && !(p && f.matches && f.matches(p)))
      if (f.type === "checkbox")
        u && c[f.name] === 1 ? l[f.name] = f.checked : (l[f.name] || (l[f.name] = []), f.checked && l[f.name].push(f.value));
      else if (f.type === "radio")
        f.checked && (l[f.name] = f.value);
      else if (f.type === "select-multiple") {
        l[f.name] = [];
        for (let h = 0; h < f.options.length; h++)
          f.options[h].selected && l[f.name].push(f.options[h].value);
      } else if (u && f.type === "hidden")
        l[f.name] = f.value;
      else if (u && (f.type === "number" || f.type === "range")) {
        const h = Number(f.value);
        l[f.name] = f.value === "" || isNaN(h) ? null : h;
      } else
        l[f.name] = f.value;
  }
  return l;
}
function Pn(t) {
  if (typeof t != "string") return !!t;
  const n = t.trim().toLowerCase();
  return n !== "false" && n !== "0" && n !== "" && n !== "off" && n !== "no";
}
function ze(t, n) {
  const u = t.elements, p = [], l = {};
  for (let d = 0; d < u.length; d++) {
    const c = u[d];
    c.name && c.type === "checkbox" && (l[c.name] = (l[c.name] || 0) + 1);
  }
  for (let d = 0; d < u.length; d++) {
    const c = u[d];
    if (c.type === "file" || c.type === "submit" || c.type === "button") continue;
    const i = c.getAttribute("data-ln-fill-as") || c.name;
    if (!i || !(i in n)) continue;
    const f = n[i];
    if (c.type === "checkbox") {
      if (Array.isArray(f))
        c.checked = f.indexOf(c.value) !== -1;
      else if (l[c.name] > 1) {
        const h = String(f).split(",").map(function(b) {
          return b.trim();
        });
        c.checked = h.indexOf(c.value) !== -1;
      } else
        c.checked = Pn(f);
      p.push(c);
    } else if (c.type === "radio")
      c.checked = c.value === String(f), p.push(c);
    else if (c.type === "select-multiple") {
      if (Array.isArray(f))
        for (let h = 0; h < c.options.length; h++)
          c.options[h].selected = f.indexOf(c.options[h].value) !== -1;
      p.push(c);
    } else
      c.value = f, p.push(c);
  }
  return p;
}
const Ae = {
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
function V(t) {
  const n = t ? t.closest("[lang]") : null, u = (n ? n.getAttribute("lang") || n.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!u) return "en-US";
  const p = u.trim().toLowerCase();
  return p.indexOf("-") === -1 && Ae[p] ? Ae[p] : u;
}
function Wt() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, ct(function() {
    new MutationObserver(function() {
      document.dispatchEvent(new CustomEvent("ln-core:locale-change", {
        bubbles: !0,
        detail: {}
      }));
    }).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["lang"],
      subtree: !0
    });
  }, "ln-core")));
}
function At(t) {
  return t.hasAttribute("data-ln-value") ? t.getAttribute("data-ln-value") : t.textContent.trim();
}
function Ke(t, n, { get: u, set: p }) {
  Object.defineProperty(t, "value", {
    get: function() {
      return u ? u.call(this) : n.get.call(this);
    },
    set: function(l) {
      p ? p.call(this, l, (d) => n.set.call(this, d)) : n.set.call(this, l);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function Bn() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function te() {
  if (typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1), window.lnCore._bootHolds === 0 && window.lnCore._bootQueue)) {
    const t = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let n = 0; n < t.length; n++)
      t[n]();
  }
}
function je() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function it(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function M(t, n, u, p, l = {}) {
  const d = l.extraAttributes || [], c = l.onAttributeChange || null, i = l.onSubtreeChange || null, f = l.onInit || null;
  function h(g) {
    const _ = g || document.body;
    Zt(_, t, n, u), f && f(_);
  }
  ct(function() {
    const g = new MutationObserver(function(m) {
      for (let r = 0; r < m.length; r++) {
        const s = m[r];
        if (s.type === "childList") {
          if (i && s.target) {
            const o = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", a = s.target.nodeType === 1 ? s.target.matches(o) ? s.target : s.target.closest(o) : s.target.parentElement ? s.target.parentElement.closest(o) : null;
            a && i(a, s);
          }
          for (let e = 0; e < s.addedNodes.length; e++) {
            const o = s.addedNodes[e];
            o.nodeType === 1 && (Zt(o, t, n, u), f && f(o));
          }
          for (let e = 0; e < s.removedNodes.length; e++) {
            const o = s.removedNodes[e];
            if (o.nodeType === 1) {
              const y = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", v = Array.from(o.querySelectorAll(y));
              o.matches && o.matches(y) && v.push(o);
              for (let w = 0; w < v.length; w++) {
                const A = v[w];
                if (!document.contains(A)) {
                  const C = A[n];
                  C && typeof C.destroy == "function" && C.destroy();
                }
              }
            }
          }
        } else s.type === "attributes" && (c && s.target[n] ? c(s.target, s.attributeName) : (Zt(s.target, t, n, u), f && f(s.target)));
      }
    });
    let _ = [];
    if (t.indexOf("[") !== -1) {
      const m = /\[([\w-]+)/g;
      let r;
      for (; (r = m.exec(t)) !== null; )
        _.push(r[1]);
    } else
      _.push(t);
    g.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: _.concat(d)
    });
  }, p || (t.indexOf("[") === -1 ? t.replace("data-", "") : "component")), window[n] = h;
  function b() {
    je() > 0 ? it(function() {
      h(document.body);
    }) : h(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", b) : b(), h;
}
function Ve(t, n) {
  if (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || t.button !== 0 || !n) return !1;
  const u = n.getAttribute("href");
  return !(!u || n.getAttribute("target") === "_blank" || n.hasAttribute("download") || u.startsWith("mailto:") || u.startsWith("tel:") || u === "#" || u.startsWith("#") || n.hostname && n.hostname !== window.location.hostname);
}
function dt(...t) {
  return t.filter((n) => n != null && n !== "").map((n, u) => u === 0 ? n.replace(/\/+$/, "") : n.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function Lt(t, n) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, t, n ? { Authorization: n } : null);
}
function We(t, n = "ln-core") {
  try {
    return t ? JSON.parse(t) : {};
  } catch (u) {
    return console.error(`[${n}] Invalid headers JSON:`, u), {};
  }
}
const Ge = {};
function Hn(t, n) {
  Ge[t] = n;
}
function Un(t) {
  return Ge[t] || { ingress: (n) => n, egress: (n) => n };
}
const $e = {};
function fe(t, n) {
  if (!t || typeof n != "object") return;
  const u = t.toLowerCase().split("-")[0];
  $e[u] = n;
}
function _t(t) {
  if (!t) return null;
  const n = t.toLowerCase().split("-")[0];
  return $e[n] || null;
}
fe("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = Hn, window.lnCore.getDataMapper = Un, window.lnCore.registerLocaleFallback = fe, window.lnCore.getLocaleFallback = _t, window.lnCore.fillTemplate = Dt, window.lnCore.fill = ot, window.lnCore.lnFill = Rn, window.lnCore.renderList = On, window.lnCore.ensureLocaleObserver = Wt);
function pe(t, n) {
  let u = !1;
  return function() {
    u || (u = !0, queueMicrotask(function() {
      u = !1, t();
    }));
  };
}
function Qe(t) {
  t = t || {};
  let n = t.windowSize > 0 ? t.windowSize : 1e3, u = t.pageSize > 0 ? t.pageSize : 200, p = t.threshold != null ? t.threshold : 25, l = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const d = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, c = typeof t.onChange == "function" ? t.onChange : function() {
  }, i = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Set();
  let b = 0, g = 0, _ = 0, m = { sort: null, filters: {}, search: "" }, r = null, s = 0, e = 0, o = !1;
  function a(A) {
    f.set(A, ++s);
  }
  function y() {
    return !!(m && (m.search || m.filters && Object.keys(m.filters).length));
  }
  function v() {
    if (i.size <= n) return;
    const A = Array.from(i.keys()).sort(function(L, q) {
      return (f.get(L) || 0) - (f.get(q) || 0);
    });
    let C = 0;
    for (; i.size > n && C < A.length; )
      i.delete(A[C]), f.delete(A[C]), C++;
  }
  function w(A, C) {
    h.add(A), d(m, A, C);
  }
  return {
    get: function(A) {
      return i.get(A);
    },
    has: function(A) {
      return i.has(A);
    },
    peek: function() {
      return i.size ? i.values().next().value : void 0;
    },
    get logicalTotal() {
      return b;
    },
    get grandTotal() {
      return g;
    },
    get queryGen() {
      return _;
    },
    get size() {
      return i.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(A, C) {
      clearTimeout(r), e = A;
      for (let N = A; N < C; N++)
        i.has(N) && a(N);
      if (b <= 0) return;
      const L = Math.max(0, A - p), q = Math.min(b, C + p), x = Math.floor(L / u), D = Math.floor(Math.max(0, q - 1) / u);
      let F = -1;
      for (let N = x; N <= D; N++) {
        const B = N * u, $ = Math.min(u, b - B);
        let H = !1;
        const U = Math.max(B, L), z = Math.min(B + $, q);
        for (let st = U; st < z; st++)
          if (!i.has(st)) {
            H = !0;
            break;
          }
        if (H && !h.has(B)) {
          F = B;
          break;
        }
      }
      F !== -1 && (r = setTimeout(function() {
        w(F, u);
      }, l));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(A) {
      if (A = A || {}, A.queryGen != null && A.queryGen !== _) return !1;
      const C = A.offset || 0, L = A.data || [];
      let q = 0;
      for (let x = 0; x < L.length; x++)
        L[x] != null && q++;
      if (q === 0 && (A.provisional || A.filtered > 0))
        return h.delete(C), !1;
      o && (i.clear(), f.clear(), o = !1), A.provisional || (g = A.total != null ? A.total : g, b = A.filtered != null ? A.filtered : A.data ? A.data.length : b);
      for (let x = 0; x < L.length; x++)
        L[x] != null && (i.set(C + x, L[x]), a(C + x));
      return h.delete(C), v(), c(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(A) {
      A && (m = A), w(0, u);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(A) {
      _++, h.clear(), clearTimeout(r), A && (m = A), o = !0, w(0, u);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      _++, h.clear(), clearTimeout(r), o = !0;
      const A = Math.max(0, Math.floor(e / u) * u);
      w(A, u);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(A) {
      h.delete(A);
    },
    destroy: function() {
      clearTimeout(r), i.clear(), f.clear(), h.clear();
    },
    configure: function(A) {
      A = A || {};
      let C = !1;
      if (A.windowSize != null && A.windowSize > 0 && A.windowSize !== n) {
        const L = A.windowSize < n;
        n = A.windowSize, L && v(), C = !0;
      }
      A.pageSize != null && A.pageSize > 0 && (u = A.pageSize), A.threshold != null && A.threshold >= 0 && (p = A.threshold), A.fetchDebounce != null && A.fetchDebounce >= 0 && (l = A.fetchDebounce), C && c();
    },
    setGrandTotal: function(A) {
      A == null || isNaN(A) || A < 0 || (g = A, y() || (b = A), c());
    }
  };
}
const zn = "ln:";
let vt = null;
function Xe() {
  if (vt !== null) return vt;
  try {
    if (typeof localStorage > "u")
      return vt = !1, !1;
    const t = "__ln_test__";
    localStorage.setItem(t, t), localStorage.removeItem(t), vt = !0;
  } catch {
    vt = !1;
  }
  return vt;
}
function Kn() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function Ye(t, n) {
  const u = n.getAttribute("data-ln-persist"), p = u !== null && u !== "" ? u : n.id;
  return p ? zn + t + ":" + Kn() + ":" + p : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', n), null);
}
function Gt(t, n) {
  if (!Xe()) return null;
  const u = Ye(t, n);
  if (!u) return null;
  try {
    const p = localStorage.getItem(u);
    return p !== null ? JSON.parse(p) : null;
  } catch {
    return null;
  }
}
function bt(t, n, u) {
  if (!Xe()) return;
  const p = Ye(t, n);
  if (p)
    try {
      u == null ? localStorage.removeItem(p) : localStorage.setItem(p, JSON.stringify(u));
    } catch {
    }
}
function Je(t) {
  return (t || "").replace(/^#/, "");
}
function $t(t) {
  const n = t === void 0 ? location.hash : t, u = {}, p = Je(n);
  if (!p) return u;
  const l = p.split("&");
  for (let d = 0; d < l.length; d++) {
    const c = l[d];
    if (!c) continue;
    const i = c.indexOf(":"), f = i > -1 ? c.slice(0, i) : c, h = i > -1 ? c.slice(i + 1) : "";
    if (f)
      try {
        u[f] = decodeURIComponent(h);
      } catch {
        u[f] = h;
      }
  }
  return u;
}
function X(t) {
  if (!t) return null;
  const n = $t();
  return t in n ? n[t] : null;
}
function et(t, n) {
  if (!t) return;
  const u = $t();
  n == null ? delete u[t] : u[t] = String(n);
  const l = Object.keys(u).map(function(d) {
    const c = u[d];
    return c === "" ? d : d + ":" + encodeURIComponent(c);
  }).join("&");
  Je(location.hash) !== l && (location.hash = l);
}
function me(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function yt(t, n) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const u = t.getAttribute("data-ln-hash");
  if (u && u.trim() !== "") return u.trim();
  const p = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return p ? n ? p + "-" + n : p : n || null;
}
function Ze(t, n) {
  return !n || n === "none" || t === null || t === void 0 ? null : String(t) + "." + n;
}
function ie(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function tn(t, n) {
  return !t || !Array.isArray(n) || n.length === 0 ? null : t + ":" + n.map(encodeURIComponent).join(",");
}
function re(t) {
  if (!t || typeof t != "string") return null;
  const n = t.indexOf(":");
  if (n === -1) return null;
  const u = t.slice(0, n), p = t.slice(n + 1), l = p ? p.split(",").map(function(d) {
    try {
      return decodeURIComponent(d);
    } catch {
      return d;
    }
  }).filter(Boolean) : [];
  return { key: u, values: l };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = $t, window.lnCore.hashGet = X, window.lnCore.hashSet = et, window.lnCore.hashLinkClick = me, window.lnCore.resolveHashNamespace = yt, window.lnCore.hashSortEncode = Ze, window.lnCore.hashSortDecode = ie, window.lnCore.hashFilterEncode = tn, window.lnCore.hashFilterDecode = re);
function Ut(t, n, u, p) {
  const l = typeof p == "number" ? p : 4, d = window.innerWidth, c = window.innerHeight, i = n.width, f = n.height, h = (u || "bottom").split("-"), b = h[0], g = h[1] === "start" || h[1] === "end" ? h[1] : "center", _ = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, m = _[b] || _.bottom;
  function r(y) {
    return y === "top" || y === "bottom" ? g === "start" ? t.left : g === "end" ? t.right - i : t.left + (t.width - i) / 2 : g === "start" ? t.top : g === "end" ? t.bottom - f : t.top + (t.height - f) / 2;
  }
  function s(y) {
    let v, w, A = !0;
    return y === "top" ? (v = t.top - l - f, w = r(y), v < 0 && (A = !1)) : y === "bottom" ? (v = t.bottom + l, w = r(y), v + f > c && (A = !1)) : y === "left" ? (v = r(y), w = t.left - l - i, w < 0 && (A = !1)) : (v = r(y), w = t.right + l, w + i > d && (A = !1)), { top: v, left: w, side: y, fits: A };
  }
  let e = null;
  for (let y = 0; y < m.length; y++) {
    const v = s(m[y]);
    if (v.fits) {
      e = v;
      break;
    }
  }
  e || (e = s(m[0]));
  let o = e.top, a = e.left;
  return i >= d ? a = 0 : (a < 0 && (a = 0), a + i > d && (a = d - i)), f >= c ? o = 0 : (o < 0 && (o = 0), o + f > c && (o = c - f)), { top: o, left: a, placement: e.side };
}
function oe(t) {
  if (!t) return { width: 0, height: 0 };
  const n = t.style, u = n.visibility, p = n.display, l = n.position;
  n.visibility = "hidden", n.display = "block", n.position = "fixed";
  const d = t.offsetWidth, c = t.offsetHeight;
  return n.visibility = u, n.display = p, n.position = l, { width: d, height: c };
}
let ft = null;
async function Se(t) {
  if (!t) {
    ft = null;
    return;
  }
  try {
    const n = new TextEncoder(), u = await crypto.subtle.digest("SHA-256", n.encode(t));
    ft = await crypto.subtle.importKey(
      "raw",
      u,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (n) {
    console.error("[ln-core/crypto] Key derivation failed:", n), ft = null;
  }
}
function ut() {
  return ft;
}
async function jn(t, n = ft) {
  const u = n || ft;
  if (!u || t === void 0 || t === null) return t;
  try {
    const p = new TextEncoder(), l = crypto.getRandomValues(new Uint8Array(12)), d = typeof t == "string" ? t : JSON.stringify(t), c = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: l },
      u,
      p.encode(d)
    ), i = btoa(String.fromCharCode(...l)), f = btoa(String.fromCharCode(...new Uint8Array(c)));
    return {
      encrypted: !0,
      iv: i,
      data: f
    };
  } catch (p) {
    return console.error("[ln-core/crypto] Encryption failed:", p), t;
  }
}
async function Vn(t, n = ft) {
  const u = n || ft;
  if (!t || !t.encrypted || !u) return t;
  try {
    const p = new TextDecoder(), l = Uint8Array.from(atob(t.iv), (f) => f.charCodeAt(0)), d = Uint8Array.from(atob(t.data), (f) => f.charCodeAt(0)), c = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: l },
      u,
      d
    ), i = p.decode(c);
    try {
      return JSON.parse(i);
    } catch {
      return i;
    }
  } catch (p) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", p), { ...t, decryptionError: !0 };
  }
}
function en(t, n = 100, u = 0) {
  const p = parseFloat(String(t)) || 0, l = parseFloat(String(n)) || 100, d = parseFloat(String(u)) || 0, c = Math.max(d, Math.min(p, l)), i = l - d;
  let f = 0;
  return i > 0 && (f = (c - d) / i * 100), f = Math.max(0, Math.min(100, f)), {
    value: p,
    min: d,
    max: l,
    clampedValue: c,
    percentage: f
  };
}
function Y(t) {
  if (t == null || t === "") return null;
  if (t instanceof Date)
    return isNaN(t.getTime()) ? null : t;
  const n = Number(t);
  if (!isNaN(n) && n > 0) {
    const u = n < 1e11 ? n * 1e3 : n, p = new Date(u);
    return isNaN(p.getTime()) ? null : p;
  }
  if (typeof t == "string") {
    const u = t.trim();
    if (!u) return null;
    const p = new Date(u);
    return isNaN(p.getTime()) ? null : p;
  }
  return null;
}
function Tt(t) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const n = t.getFullYear(), u = String(t.getMonth() + 1).padStart(2, "0"), p = String(t.getDate()).padStart(2, "0");
  return n + "-" + u + "-" + p;
}
const at = {};
function zt(t) {
  const n = t || "default";
  if (!at[n]) {
    const u = new Intl.NumberFormat(t, { useGrouping: !0 }), p = u.formatToParts(1234.5);
    let l = "", d = ".";
    for (let c = 0; c < p.length; c++)
      p[c].type === "group" && (l = p[c].value), p[c].type === "decimal" && (d = p[c].value);
    at[n] = { groupSep: l, decimalSep: d, fmt: u };
  }
  return at[n];
}
function nn(t, n, u) {
  if (t == null || typeof t != "string") return "";
  let p = t.trim();
  return p === "" ? "" : (p = p.replace(/[$€£¥]/g, ""), n && (p = p.split(n).join("")), p = p.replace(/\s/g, ""), u && u !== "." && (p = p.replace(u, ".")), p = p.replace(/[^\d.-]/g, ""), p);
}
function Rt(t, n) {
  if (typeof t == "number") return isNaN(t) ? NaN : t;
  if (t == null || typeof t != "string") return NaN;
  const u = t.trim();
  if (u === "" || u === "-") return NaN;
  const p = zt(n), l = nn(u, p.groupSep, p.decimalSep);
  if (l === "" || l === "-") return NaN;
  const d = parseFloat(l);
  return isNaN(d) ? NaN : d;
}
function tt(t, n, u = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const p = n || "default", l = u.maxDecimals != null ? parseInt(u.maxDecimals, 10) : null, d = u.userDecimals != null ? u.userDecimals : null;
  if (l !== null) {
    const c = p + "|max:" + l;
    return at[c] || (at[c] = new Intl.NumberFormat(n, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: l
    })), at[c].format(t);
  }
  if (d !== null && d > 0) {
    const c = p + "|exact:" + d;
    return at[c] || (at[c] = new Intl.NumberFormat(n, {
      useGrouping: !0,
      minimumFractionDigits: d,
      maximumFractionDigits: d
    })), at[c].format(t);
  }
  return zt(n).fmt.format(t);
}
function se(t) {
  return String(t || "").trim().toLowerCase();
}
function rn(t) {
  const n = se(t);
  return n ? n.split(/\s+/).filter(Boolean) : [];
}
function Wn(t) {
  if (t == null) return null;
  const n = String(t).split(",").map((u) => u.trim()).filter(Boolean);
  return n.length ? n : null;
}
function on(t, n) {
  if (!n || n.length === 0) return !0;
  if (!t) return !1;
  const u = String(t).toLowerCase();
  for (let p = 0; p < n.length; p++)
    if (u.indexOf(n[p]) === -1) return !1;
  return !0;
}
function Gn(t) {
  return !t || t.length === 0 ? "" : t.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function ge(t, n) {
  if (!n || n.length === 0) return !0;
  if (t == null) return !1;
  const u = String(t).trim().toLowerCase();
  for (let p = 0; p < n.length; p++)
    if (String(n[p]).trim().toLowerCase() === u)
      return !0;
  return !1;
}
function $n(t) {
  if (typeof t == "string") return t;
  if (t && typeof t == "object") {
    if (typeof t.href == "string") return t.href;
    if (typeof t.url == "string") return t.url;
  }
  return String(t || "");
}
function Qn(t, n) {
  return n && n.method ? String(n.method).toUpperCase() : t && typeof t == "object" && t.method ? String(t.method).toUpperCase() : "GET";
}
function Xn(t, n) {
  return (n || "GET") + " " + (t || "");
}
function Yn(t) {
  const n = (t || "").toUpperCase();
  return n === "GET" || n === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const t = window.fetch.bind(window), n = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map();
  function p(c, i) {
    i = i || {};
    const f = $n(c), h = Qn(c, i), b = Xn(f, h);
    Yn(h) && n.has(b) && (n.get(b).abort(), n.delete(b));
    const g = new AbortController(), _ = i.signal;
    let m = null;
    _ && (_.aborted ? g.abort(_.reason) : (m = function() {
      g.abort(_.reason);
    }, _.addEventListener("abort", m, { once: !0 })));
    const r = Object.assign({}, i, { signal: g.signal });
    return n.set(b, g), t(c, r).finally(function() {
      _ && m && _.removeEventListener("abort", m), n.get(b) === g && n.delete(b);
    });
  }
  p.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = p;
  function l(c) {
    if (!c.detail || !c.detail.url) return;
    const i = c.target, f = (c.detail.method || (c.detail.body ? "POST" : "GET")).toUpperCase(), h = c.detail.key;
    h && u.has(h) && (u.get(h).abort(), u.delete(h));
    const b = new AbortController(), g = c.detail.signal;
    let _ = null;
    g && (g.aborted ? b.abort(g.reason) : (_ = function() {
      b.abort(g.reason);
    }, g.addEventListener("abort", _, { once: !0 }))), h && u.set(h, b);
    const m = { method: f, signal: b.signal };
    c.detail.body !== void 0 && (m.body = c.detail.body), window.fetch(c.detail.url, m).then(function(r) {
      g && _ && g.removeEventListener("abort", _), h && u.get(h) === b && u.delete(h), S(i, "ln-http:response", {
        ok: r.ok,
        status: r.status,
        response: r
      });
    }).catch(function(r) {
      g && _ && g.removeEventListener("abort", _), h && u.get(h) === b && u.delete(h), !(r && r.name === "AbortError") && S(i, "ln-http:error", {
        ok: !1,
        status: 0,
        error: r
      });
    });
  }
  function d(c) {
    const i = c.detail || {};
    i.all ? window.lnHttp.cancelAll() : i.key ? window.lnHttp.cancelByKey(i.key) : i.url && window.lnHttp.cancel(i.url);
  }
  document.addEventListener("ln-http:request", l), document.addEventListener("ln-http:cancel", d), window.lnHttp = {
    cancel: function(c) {
      let i = !1;
      return n.forEach(function(f, h) {
        h.endsWith(" " + c) && (f.abort(), n.delete(h), i = !0);
      }), i;
    },
    cancelByKey: function(c) {
      return u.has(c) ? (u.get(c).abort(), u.delete(c), !0) : !1;
    },
    cancelAll: function() {
      n.forEach(function(c) {
        c.abort();
      }), n.clear(), u.forEach(function(c) {
        c.abort();
      }), u.clear();
    },
    get inflight() {
      const c = [];
      return n.forEach(function(i, f) {
        const h = f.indexOf(" ");
        c.push({ method: f.slice(0, h), url: f.slice(h + 1) });
      }), u.forEach(function(i, f) {
        c.push({ key: f });
      }), c;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", l), document.removeEventListener("ln-http:cancel", d), window.fetch = t, delete window.lnHttp;
    }
  };
})();
(function() {
  const t = "template[data-ln-include]", n = "lnInclude";
  if (window[n] !== void 0) return;
  const u = /* @__PURE__ */ new Map();
  function p(l) {
    if (this.dom = l, this.url = l.getAttribute("data-ln-include"), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    Bn(), this._held = !0;
    const d = this, c = this.url;
    let i = u.get(c);
    return i || (i = fetch(c).then(function(f) {
      if (!f.ok)
        throw new Error("HTTP error! status: " + f.status);
      return f.text();
    }).catch(function(f) {
      throw u.delete(c), f;
    }), u.set(c, i)), i.then(function(f) {
      if (d._destroyed) return;
      const h = document.createElement("template");
      h.innerHTML = f, d.dom.content.appendChild(h.content), S(d.dom, "ln-include:loaded", { target: d.dom, url: d.url }), d._held && (d._held = !1, te());
    }).catch(function(f) {
      d._destroyed || (console.error("[ln-include] Failed to fetch template from " + d.url + ":", f), S(d.dom, "ln-include:error", { target: d.dom, url: d.url, error: f }), d._held && (d._held = !1, te()));
    }), this;
  }
  p.prototype.destroy = function() {
    this.dom[n] && (this._destroyed = !0, this._held && (this._held = !1, te()), delete this.dom[n]);
  }, M(t, n, p, "ln-include");
})();
(function() {
  const t = "data-ln-form", n = "lnForm", u = "data-ln-form-action-edit", p = "data-ln-form-action-method";
  if (window[n] !== void 0) return;
  function l(d) {
    this.dom = d, this._baseAction = d.getAttribute("action") || "";
    const c = this;
    return this._onLnFill = function(i) {
      i.target === c.dom && (i.detail ? (c.fill(i.detail), c._applyActionMode(i.detail)) : c.dom.reset());
    }, this._onReset = function() {
      c._applyActionMode(null);
    }, d.addEventListener("ln-fill", this._onLnFill), d.addEventListener("reset", this._onReset), this;
  }
  l.prototype.fill = function(d) {
    const c = ze(this.dom, d);
    for (let i = 0; i < c.length; i++) {
      const f = c[i], h = f.tagName === "SELECT" || f.type === "checkbox" || f.type === "radio";
      f.dispatchEvent(new Event(h ? "change" : "input", { bubbles: !0 }));
    }
  }, l.prototype._ensureMethodInput = function() {
    let d = this.dom.querySelector('input[name="_method"]');
    return d || (d = document.createElement("input"), d.type = "hidden", d.name = "_method", d.value = "", this.dom.appendChild(d)), d;
  }, l.prototype._applyActionMode = function(d) {
    if (!this.dom.hasAttribute(u)) return;
    const c = d && d.id != null && d.id !== "" ? d.id : null, i = this._ensureMethodInput();
    if (c !== null) {
      const f = this.dom.getAttribute(u);
      f ? this.dom.setAttribute("action", f.replace(":id", encodeURIComponent(c))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(c)), i.value = this.dom.getAttribute(p) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), i.value = "";
  }, l.prototype.destroy = function() {
    this.dom[n] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), S(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[n]);
  }, M(t, n, l, "ln-form");
})();
const Ce = {
  required: "valueMissing",
  typeMismatch: "typeMismatch",
  tooShort: "tooShort",
  tooLong: "tooLong",
  patternMismatch: "patternMismatch",
  rangeUnderflow: "rangeUnderflow",
  rangeOverflow: "rangeOverflow"
};
function Le(t, n = 0) {
  return t ? !!(t.valid && n === 0) : n === 0;
}
function Jn(t, n) {
  const u = [];
  if (t) {
    const p = Object.keys(Ce);
    for (let l = 0; l < p.length; l++) {
      const d = p[l], c = Ce[d];
      t[c] && u.push(d);
    }
  }
  if (n) {
    const p = Array.from(n);
    for (let l = 0; l < p.length; l++)
      p[l] && u.indexOf(p[l]) === -1 && u.push(p[l]);
  }
  return u;
}
(function() {
  const t = "data-ln-validate", n = "lnValidate", u = "data-ln-validate-errors", p = "data-ln-validate-error", l = "ln-validate-valid", d = "ln-validate-invalid";
  if (window[n] !== void 0) return;
  function c(i) {
    this.dom = i, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const f = this, h = i.tagName, b = i.type, g = h === "SELECT" || b === "checkbox" || b === "radio";
    this._onInput = function() {
      f._touched = !0, f.validate();
    }, this._onChange = function() {
      f._touched = !0, f.validate();
    }, this._onSetCustom = function(r) {
      const s = r.detail && r.detail.error;
      if (!s) return;
      f._customErrors.add(s), f._touched = !0;
      const e = i.closest(".form-element");
      if (e) {
        const o = e.querySelector("[" + p + '="' + s + '"]');
        o && o.classList.remove("hidden");
      }
      i.classList.remove(l), i.classList.add(d), i.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(r) {
      const s = r.detail && r.detail.error, e = i.closest(".form-element");
      if (s) {
        if (f._customErrors.delete(s), e) {
          const o = e.querySelector("[" + p + '="' + s + '"]');
          o && o.classList.add("hidden");
        }
      } else
        f._customErrors.forEach(function(o) {
          if (e) {
            const a = e.querySelector("[" + p + '="' + o + '"]');
            a && a.classList.add("hidden");
          }
        }), f._customErrors.clear();
      f._touched && f.validate();
    }, g || i.addEventListener("input", this._onInput), i.addEventListener("change", this._onChange), i.addEventListener("ln-validate:set-custom", this._onSetCustom), i.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const _ = i.form;
    return _ && (_.hasAttribute("novalidate") || _.setAttribute("novalidate", ""), this._onFormReset = function() {
      f.reset();
    }, this._onValidateRequest = function(r) {
      f._touched = !0, !f.validate() && r.detail && r.detail.invalidFields && r.detail.invalidFields.push(f.dom);
    }, _.addEventListener("reset", this._onFormReset), _.addEventListener("ln-validate:request-validate", this._onValidateRequest), _._lnValidateGateBound || (_._lnValidateGateBound = !0, _.addEventListener("submit", function(r) {
      const s = { invalidFields: [] };
      S(_, "ln-validate:request-validate", s), s.invalidFields.length > 0 && (r.preventDefault(), s.invalidFields.sort((e, o) => e.compareDocumentPosition(o) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), s.invalidFields[0].focus());
    }))), (i.value && i.value.trim() !== "" || i.checked) && (this._touched = !0, this.validate()), this;
  }
  c.prototype.validate = function() {
    const i = this.dom, f = i.validity, h = Le(f, this._customErrors.size), b = Jn(f, this._customErrors), g = i.closest(".form-element");
    if (g) {
      const m = g.querySelector("[" + u + "]");
      if (m) {
        const r = m.querySelectorAll("[" + p + "]");
        for (let s = 0; s < r.length; s++) {
          const e = r[s].getAttribute(p);
          r[s].classList.toggle("hidden", !b.includes(e));
        }
      }
    }
    return i.classList.toggle(l, h), i.classList.toggle(d, !h), i.setAttribute("aria-invalid", h ? "false" : "true"), S(i, h ? "ln-validate:valid" : "ln-validate:invalid", { target: i, field: i.name, errors: b }), h;
  }, c.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(l, d), this.dom.removeAttribute("aria-invalid");
    const i = this.dom.closest(".form-element");
    if (i) {
      const f = i.querySelectorAll("[" + p + "]");
      for (let h = 0; h < f.length; h++)
        f[h].classList.add("hidden");
    }
  }, Object.defineProperty(c.prototype, "isValid", {
    get: function() {
      return Le(this.dom.validity, this._customErrors.size);
    }
  }), c.prototype.destroy = function() {
    if (!this.dom[n]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const i = this.dom.form;
    i && (this._onFormReset && i.removeEventListener("reset", this._onFormReset), this._onValidateRequest && i.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(l, d), this.dom.removeAttribute("aria-invalid"), S(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[n];
  }, M(t, n, c, "ln-validate");
})();
(function() {
  const t = "data-ln-ajax", n = "lnAjax", u = "data-ln-form-scope";
  if (window[n] !== void 0) return;
  function p(g) {
    if (!g.hasAttribute(t) || g[n]) return;
    g[n] = !0;
    const _ = f(g);
    l(_.links), d(_.forms);
  }
  function l(g) {
    for (const _ of g) {
      if (_[n + "Trigger"] || _.hostname && _.hostname !== window.location.hostname) continue;
      const m = _.getAttribute("href");
      if (m && m.includes("#")) continue;
      const r = function(s) {
        if (!Ve(s, _)) return;
        s.preventDefault();
        const e = _.getAttribute("href");
        e && i("GET", e, null, _);
      };
      _.addEventListener("click", r), _[n + "Trigger"] = r;
    }
  }
  function d(g) {
    for (const _ of g) {
      if (_[n + "Trigger"]) continue;
      if (_.hasAttribute(u)) {
        _[n + "ScopeWarned"] || (_[n + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const m = function(r) {
        if (r.defaultPrevented) return;
        r.preventDefault();
        const s = _.method.toUpperCase(), e = _.action, o = new FormData(_);
        for (const a of _.querySelectorAll('button, input[type="submit"]'))
          a.disabled = !0;
        i(s, e, o, _, function() {
          for (const a of _.querySelectorAll('button, input[type="submit"]'))
            a.disabled = !1;
        });
      };
      _.addEventListener("submit", m), _[n + "Trigger"] = m;
    }
  }
  function c(g) {
    if (!g[n]) return;
    const _ = f(g);
    for (const m of _.links)
      m[n + "Trigger"] && (m.removeEventListener("click", m[n + "Trigger"]), delete m[n + "Trigger"]);
    for (const m of _.forms)
      m[n + "Trigger"] && (m.removeEventListener("submit", m[n + "Trigger"]), delete m[n + "Trigger"]);
    delete g[n];
  }
  function i(g, _, m, r, s) {
    if (W(r, "ln-ajax:before-start", { method: g, url: _ }).defaultPrevented) return;
    S(r, "ln-ajax:start", { method: g, url: _ }), r.classList.add("ln-ajax--loading");
    const o = document.createElement("span");
    o.className = "ln-ajax-spinner", r.appendChild(o);
    function a() {
      r.classList.remove("ln-ajax--loading");
      const C = r.querySelector(".ln-ajax-spinner");
      C && C.remove(), s && s();
    }
    let y = _;
    const v = document.querySelector('meta[name="csrf-token"]'), w = v ? v.getAttribute("content") : null;
    m instanceof FormData && w && m.append("_token", w);
    const A = {
      method: g,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (w && (A.headers["X-CSRF-TOKEN"] = w), g === "GET" && m) {
      const C = new URLSearchParams(m);
      y = _ + (_.includes("?") ? "&" : "?") + C.toString();
    } else g !== "GET" && m && (A.body = m);
    fetch(y, A).then(function(C) {
      const L = C.ok, q = C.status;
      return C.text().then(function(x) {
        let D = null, F = null;
        if (x && x.trim())
          try {
            D = JSON.parse(x);
          } catch (N) {
            F = N;
          }
        return { ok: L, status: q, data: D, parseError: F };
      });
    }).then(function(C) {
      const L = C.status, q = C.data, x = C.parseError;
      if (C.ok && !x) {
        if (q && q.title && (document.title = q.title), q && q.content)
          for (const D in q.content) {
            const F = document.getElementById(D);
            F && (F.innerHTML = q.content[D]);
          }
        if (r.tagName === "A") {
          const D = r.getAttribute("href");
          D && window.history.pushState({ ajax: !0 }, "", D);
        } else r.tagName === "FORM" && r.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", y);
        S(r, "ln-ajax:success", { method: g, url: y, data: q });
      } else
        S(r, "ln-ajax:error", {
          method: g,
          url: y,
          status: L,
          data: q,
          error: x || null
        });
      S(r, "ln-ajax:complete", { method: g, url: y }), a();
    }).catch(function(C) {
      S(r, "ln-ajax:error", { method: g, url: y, status: 0, data: null, error: C }), S(r, "ln-ajax:complete", { method: g, url: y }), a();
    });
  }
  function f(g) {
    const _ = { links: [], forms: [] };
    return g.tagName === "A" && g.getAttribute(t) !== "false" ? _.links.push(g) : g.tagName === "FORM" && g.getAttribute(t) !== "false" ? _.forms.push(g) : (_.links = Array.from(g.querySelectorAll('a:not([data-ln-ajax="false"])')), _.forms = Array.from(g.querySelectorAll('form:not([data-ln-ajax="false"])'))), _;
  }
  function h() {
    ct(function() {
      new MutationObserver(function(_) {
        for (const m of _)
          if (m.type === "childList") {
            for (const r of m.addedNodes)
              if (r.nodeType === 1 && (p(r), !r.hasAttribute(t))) {
                for (const e of r.querySelectorAll("[" + t + "]"))
                  p(e);
                const s = r.closest && r.closest("[" + t + "]");
                if (s && s.getAttribute(t) !== "false") {
                  const e = f(r);
                  l(e.links), d(e.forms);
                }
              }
          } else m.type === "attributes" && p(m.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [t]
      });
    }, "ln-ajax");
  }
  function b() {
    for (const g of document.querySelectorAll("[" + t + "]"))
      p(g);
  }
  window[n] = p, window[n].destroy = c, h(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", b) : b();
})();
function Zn(t, { isHydration: n = !1, hasPrimaryRegion: u = !1, primaryMatch: p = null } = {}) {
  const l = u ? !p : !t.some((h) => h.match), d = [], c = [];
  for (const h of t)
    if (!(!h.targetEl && !h.isPending)) {
      if (!h.match) {
        const b = n && h.hasHydrate && h.hasChildren;
        !h.hasKeep && h.hasChildren && !b && h.targetEl && d.push(h);
        continue;
      }
      h.hasKeep && h.mountedTemplate === h.match.route.templateNode || c.push(Object.assign({}, h, {
        skipMount: n && h.hasHydrate && h.hasChildren
      }));
    }
  c.sort((h, b) => h.regionKey === "__primary__" ? -1 : b.regionKey === "__primary__" ? 1 : 0);
  const f = c.find((h) => h.regionKey === "__primary__") || c[0] || null;
  return { notFound: l, clears: d, swaps: c, owner: f };
}
const sn = {
  navigate: function(t) {
    It(t, { historyAction: "push" });
  },
  replace: function(t) {
    It(t, { historyAction: "replace" });
  },
  current: function() {
    return Kt === null ? null : {
      path: Kt,
      params: cn,
      query: dn,
      route: un,
      regions: ln
    };
  }
}, _e = "data-ln-route", an = "lnRoute";
typeof window < "u" && (window.lnRouter = sn);
const lt = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new WeakMap();
let ln = /* @__PURE__ */ new Map(), Te = !1, Kt = null, cn = {}, dn = {}, un = null, ae = !1;
function qe(t, n, u) {
  ae ? queueMicrotask(function() {
    S(t, n, u);
  }) : S(t, n, u);
}
function jt(t) {
  try {
    const d = new URL(t, window.location.origin);
    t = d.pathname + d.search + d.hash;
  } catch {
  }
  let [n] = t.split("#"), [u, p] = n.split("?");
  const l = {};
  if (p) {
    const d = new URLSearchParams(p);
    for (const [c, i] of d.entries())
      l[c] = i;
  }
  return u = u.replace(/\/+$/, ""), u === "" && (u = "/"), { path: u, query: l };
}
function hn(t, n) {
  if (t.pattern === "*") return 1;
  if (n.pattern === "*") return -1;
  const u = t.segments, p = n.segments, l = Math.max(u.length, p.length);
  for (let d = 0; d < l; d++) {
    const c = u[d], i = p[d];
    if (c === void 0) return 1;
    if (i === void 0) return -1;
    if (c === "*") return 1;
    if (i === "*") return -1;
    const f = c.startsWith(":"), h = i.startsWith(":");
    if (f && !h) return 1;
    if (!f && h) return -1;
  }
  return 0;
}
function fn(t, n) {
  const u = t.split("/").filter(Boolean);
  for (const p of n) {
    if (p.pattern === "*")
      return {
        route: p,
        params: { wildcard: t }
      };
    const l = p.segments, d = {};
    let c = !0;
    if (!(u.length > l.length && l[l.length - 1] !== "*")) {
      for (let i = 0; i < l.length; i++) {
        const f = l[i], h = u[i];
        if (f === "*") {
          d.wildcard = u.slice(i).join("/");
          break;
        }
        if (h === void 0) {
          c = !1;
          break;
        }
        if (f.startsWith(":"))
          d[f.slice(1)] = decodeURIComponent(h);
        else if (f !== h) {
          c = !1;
          break;
        }
      }
      if (c && (l.indexOf("*") !== -1 || u.length <= l.length))
        return { route: p, params: d };
    }
  }
  return null;
}
function le(t, n = {}) {
  const u = n.warn !== !1;
  if (t !== "__primary__") {
    const l = document.getElementById(t);
    return !l && u && console.warn(`[ln-router] Explicit target element #${t} not found in DOM`), l;
  }
  const p = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return !p && u && console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), p;
}
function xe(t) {
  if (!t) return;
  const n = Array.from(t.querySelectorAll("*")), u = [t].concat(n);
  for (const l of u)
    for (const d of Object.keys(l))
      if (d.startsWith("ln") && l[d] && typeof l[d].destroy == "function")
        try {
          l[d].destroy();
        } catch (c) {
          console.error(`[ln-router] Error destroying component ${d} on element:`, l, c);
        }
  const p = document.querySelectorAll('[data-ln-popover="open"]');
  for (const l of p) {
    const d = l.lnPopover;
    if (d && d.trigger && t.contains(d.trigger))
      try {
        d.destroy();
      } catch (c) {
        console.error("[ln-router] Error destroying open popover:", c);
      }
  }
}
function It(t, n = {}) {
  const { path: u, query: p } = jt(t), l = /* @__PURE__ */ new Map();
  for (const [_, m] of lt)
    l.set(_, fn(u, m.sorted));
  const d = l.get("__primary__") || null, c = le("__primary__", { warn: !!d }), i = lt.has("__primary__"), f = [];
  for (const [_, m] of l) {
    const r = _ === "__primary__" ? c : le(_, { warn: !1 }), s = !r && !!(d && d.route && d.route.templateNode && d.route.templateNode.content && d.route.templateNode.content.querySelector("#" + CSS.escape(_)));
    !r && !s && m && console.warn(`[ln-router] Explicit target element #${_} not found in DOM`), f.push({
      regionKey: _,
      match: m,
      targetEl: r,
      isPending: s,
      hasKeep: !!r && r.hasAttribute("data-ln-route-keep"),
      hasHydrate: !!r && r.hasAttribute("data-ln-router-hydrate"),
      hasChildren: !!r && r.children.length > 0,
      mountedTemplate: r && ee.get(r) || null
    });
  }
  const h = Zn(f, {
    isHydration: !!n.isHydration,
    hasPrimaryRegion: i,
    primaryMatch: d
  });
  if (h.notFound) {
    qe(document.body, "ln-router:not-found", { path: u });
    return;
  }
  if (W(c || document.body, "ln-router:before-navigate", {
    from: Kt,
    to: t,
    params: d ? d.params : {},
    query: p
  }).defaultPrevented) return;
  n.historyAction === "push" ? window.history.pushState(null, "", t) : n.historyAction === "replace" && window.history.replaceState(null, "", t);
  const g = function() {
    for (const _ of h.clears)
      xe(_.targetEl), _.targetEl.replaceChildren(), ee.delete(_.targetEl);
    for (const _ of h.swaps) {
      if ((_.isPending || !_.targetEl || !document.contains(_.targetEl)) && (_.targetEl = _.regionKey === "__primary__" ? c : document.getElementById(_.regionKey)), !_.targetEl) {
        console.warn(`[ln-router] Target element #${_.regionKey} could not be resolved`);
        continue;
      }
      if (_.skipMount || (xe(_.targetEl), _.targetEl.replaceChildren(_.match.route.templateNode.content.cloneNode(!0))), ee.set(_.targetEl, _.match.route.templateNode), h.owner && _.regionKey === h.owner.regionKey) {
        if (_.match.route.title) {
          let m = _.match.route.title;
          if (_.match.params)
            for (const [r, s] of Object.entries(_.match.params))
              m = m.replace(new RegExp("\\{\\{\\s*" + r + "\\s*\\}\\}", "g"), s);
          document.title = m;
        }
        if (!n.isHydration) {
          _.targetEl.hasAttribute("tabindex") || _.targetEl.setAttribute("tabindex", "-1");
          const m = _.targetEl.querySelector("h1, h2, h3, h4, h5, h6");
          m ? (m.setAttribute("tabindex", "-1"), m.focus()) : _.targetEl.focus(), _.regionKey === "__primary__" && _.targetEl.scrollIntoView({ block: "start", behavior: "instant" });
        }
      }
      qe(_.targetEl, "ln-router:navigated", {
        path: t,
        params: _.match.params,
        query: p,
        route: _.match.route,
        target: _.targetEl,
        region: _.regionKey
      });
    }
    Kt = t, dn = p, un = d ? d.route : null, cn = d ? d.params : {}, ln = new Map(
      Array.from(l.entries()).map(([_, m]) => [_, m ? { route: m.route, params: m.params } : null])
    );
  };
  document.startViewTransition && !n.isHydration ? document.startViewTransition(g) : g();
}
function ti(t) {
  const n = t.target.closest("a");
  if (!n || !Ve(t, n)) return;
  const u = n.getAttribute("href"), { path: p } = jt(u);
  for (const l of lt.values())
    if (fn(p, l.sorted)) {
      t.preventDefault(), It(u, { historyAction: "push" });
      return;
    }
}
function ei(t, n) {
  const u = Object.keys(t), p = Object.keys(n);
  if (u.length !== p.length) return !1;
  for (let l = 0; l < u.length; l++) {
    const d = u[l];
    if (t[d] !== n[d]) return !1;
  }
  return !0;
}
function ni() {
  const t = window.location.pathname + window.location.search, n = sn.current();
  if (n && n.path != null) {
    const u = jt(t);
    if (jt(n.path).path === u.path && ei(n.query, u.query))
      return;
  }
  It(t, { historyAction: "skip" });
}
function ii() {
  Te || (Te = !0, ct(function() {
    document.addEventListener("click", ti), window.addEventListener("popstate", ni), ae = !0;
    const t = window.location.pathname + window.location.search + window.location.hash;
    It(t, { historyAction: "replace", isHydration: !0 }), ae = !1;
  }, "ln-router"));
}
function ri(t) {
  const n = t.getAttribute(_e);
  if (!n) return;
  const u = t.getAttribute("data-ln-route-target") || null;
  if (u === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${n}" rejected.`);
    return;
  }
  const p = u || "__primary__";
  lt.has(p) || lt.set(p, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const l = lt.get(p);
  if (l.routes.has(n)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${n}" in region "${p}"`);
    return;
  }
  const d = t.getAttribute("data-ln-route-title"), c = n.split("/").filter(Boolean), i = {
    pattern: n,
    segments: c,
    target: u,
    title: d,
    templateNode: t
  }, f = le(p);
  f && f.contains(t) && console.warn(`[ln-router] Route template with pattern "${n}" is declared inside its own outlet element:`, t), l.routes.set(n, i), l.sorted = Array.from(l.routes.values()).sort(hn);
}
function oi(t) {
  const n = t.getAttribute(_e);
  if (!n) return;
  const p = t.getAttribute("data-ln-route-target") || null || "__primary__", l = lt.get(p);
  l && (l.routes.delete(n), l.sorted = Array.from(l.routes.values()).sort(hn), l.routes.size === 0 && lt.delete(p));
}
function pn(t) {
  return this.dom = t, ri(t), this;
}
pn.prototype.destroy = function() {
  oi(this.dom), delete this.dom[an];
};
M(_e, an, pn, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    lt.size > 0 && ii();
  }
});
(function() {
  const t = "data-ln-modal", n = "lnModal";
  if (window[n] !== void 0) return;
  function u(l) {
    this.dom = l, this.isOpen = l.getAttribute(t) === "open";
    const d = this;
    return this._onRequestOpen = function() {
      d.dom.setAttribute(t, "open");
    }, this._onRequestClose = function() {
      d.dom.setAttribute(t, "close");
    }, this._onCancel = function(c) {
      c.preventDefault(), d.dom.setAttribute(t, "close");
    }, this._onClickClose = function(c) {
      const i = c.target.closest("[data-ln-modal-close]");
      i && d.dom.contains(i) && (c.preventDefault(), d.dom.setAttribute(t, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  u.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, u.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, u.prototype.toggle = function() {
    const l = this.dom.getAttribute(t);
    this.dom.setAttribute(t, l === "open" ? "close" : "open");
  }, u.prototype.destroy = function() {
    if (this.dom[n]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const l = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + t + '="open"]'),
          function(c) {
            return c !== l;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      S(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[n];
    }
  };
  function p(l) {
    const d = l[n];
    if (!d) return;
    const i = l.getAttribute(t) === "open";
    if (i !== d.isOpen)
      if (i) {
        if (W(l, "ln-modal:before-open", { modalId: l.id, target: l }).defaultPrevented) {
          l.setAttribute(t, "close");
          return;
        }
        d.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof l.showModal == "function" && l.showModal();
        const h = l.querySelector("[autofocus]");
        if (h && kt(h))
          h.focus();
        else {
          const b = l.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), g = Array.prototype.find.call(b, kt);
          if (g) g.focus();
          else {
            const _ = l.querySelectorAll("a[href], button:not([disabled])"), m = Array.prototype.find.call(_, kt);
            m && m.focus();
          }
        }
        S(l, "ln-modal:open", { modalId: l.id, target: l });
      } else {
        if (W(l, "ln-modal:before-close", { modalId: l.id, target: l }).defaultPrevented) {
          l.setAttribute(t, "open");
          return;
        }
        d.isOpen = !1, S(l, "ln-modal:close", { modalId: l.id, target: l }), typeof l.close == "function" && l.close(), document.querySelector("[" + t + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  M(t, n, u, "ln-modal", {
    onAttributeChange: p
  });
})();
(function() {
  const t = "data-ln-ui-coordinator", n = "lnUiCoordinator", u = "data-ln-ui-coordinator-dict";
  if (window[n] !== void 0) return;
  function p(e) {
    const o = {};
    let a = e;
    const y = [];
    for (; a; ) {
      const v = a.closest("[" + t + "]");
      if (!v) break;
      v[n] && v[n].dict && y.unshift(v[n].dict), a = v.parentElement;
    }
    for (const v of y)
      Object.assign(o, v);
    return o;
  }
  function l(e, o) {
    if (o) {
      if (e) {
        const y = e.closest("[" + t + "]");
        if (y) {
          if (y.id === o && y.hasAttribute("data-ln-modal")) return y;
          const v = y.querySelector("#" + CSS.escape(o) + '[data-ln-modal], [data-ln-modal="' + o + '"]');
          if (v) return v;
        }
      }
      const a = document.getElementById(o) || document.querySelector('[data-ln-modal="' + o + '"]');
      if (a) return a;
    }
    if (e) {
      const a = e.closest("[" + t + "]");
      if (a) {
        if (a.hasAttribute("data-ln-modal")) return a;
        const v = a.querySelector("[data-ln-modal]");
        if (v) return v;
      }
      const y = e.closest("[data-ln-modal]");
      if (y) return y;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function d(e, o) {
    if (e !== "edit") return "";
    if (o) {
      const a = o.getAttribute("data-ln-fill-id");
      if (a) return a;
    }
    return "edit";
  }
  function c(e) {
    if (!e) return;
    const o = e.querySelectorAll("[data-ln-field]");
    for (let y = 0; y < o.length; y++)
      o[y].textContent = "";
    const a = e.querySelectorAll("form");
    for (let y = 0; y < a.length; y++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(a[y], null) : a[y].reset();
  }
  document.addEventListener("click", function(e) {
    if (e.ctrlKey || e.metaKey || e.button === 1) return;
    const o = e.target.closest("[data-ln-modal-for]");
    if (o) {
      const y = o.getAttribute("data-ln-modal-for"), v = l(o, y);
      if (v && v.lnModal) {
        e.preventDefault();
        const w = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, A = {}, C = o.dataset;
        for (const x in C) {
          if (!x.startsWith("lnModal") || w[x]) continue;
          const D = x.slice(7);
          D && (A[D.charAt(0).toLowerCase() + D.slice(1)] = C[x]);
        }
        const L = Object.keys(A).length > 0;
        o.hasAttribute("data-ln-modal-mode") ? v.dataset.lnModalMode = o.getAttribute("data-ln-modal-mode") : v.dataset.lnModalMode = L ? "edit" : "new", L && window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(v, A) : v.dataset.lnModalMode === "new" && c(v), v.getAttribute("data-ln-modal") === "open" ? S(v, "ln-modal:request-close", {}) : (v.id && et(v.id, d(v.dataset.lnModalMode, o)), S(v, "ln-modal:request-open", {}));
      }
      return;
    }
    const a = e.target.closest('a[href^="#"]');
    if (a) {
      const y = $t(a.getAttribute("href"));
      for (const v in y) {
        const w = document.getElementById(v);
        if (w && w.lnModal) {
          if (!me(e)) return;
          et(v, y[v]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(e) {
    const o = e.target;
    if (!o || !o.lnModal) return;
    (o.dataset.lnModalMode || "new") === "new" && c(o);
  }), document.addEventListener("ln-modal:open", function(e) {
    const o = e.target;
    if (!o || !o.lnModal || !o.id) return;
    let a = X(o.id);
    a === null && (a = d(o.dataset.lnModalMode, null), et(o.id, a)), a ? (o.dataset.lnModalMode = "edit", o.dispatchEvent(new CustomEvent("ln-fill:request", {
      bubbles: !0,
      detail: { id: a }
    }))) : (o.dataset.lnModalMode = "new", c(o));
  });
  let i = !1;
  function f() {
    if (!i) {
      i = !0;
      try {
        const e = document.querySelectorAll("[data-ln-modal][id]");
        for (let o = 0; o < e.length; o++) {
          const a = e[o];
          if (!a.lnModal) continue;
          const y = a.id, v = X(y), w = v !== null, A = a.lnModal.isOpen;
          if (w) {
            const C = v ? "edit" : "new";
            a.dataset.lnModalMode = C, A ? v ? a.dispatchEvent(new CustomEvent("ln-fill:request", {
              bubbles: !0,
              detail: { id: v }
            })) : c(a) : S(a, "ln-modal:request-open", {});
          } else A && S(a, "ln-modal:request-close", {});
        }
      } finally {
        i = !1;
      }
    }
  }
  function h() {
    const e = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let o = 0; o < e.length; o++) {
      const a = e[o];
      a.lnModal && X(a.id) === null && et(a.id, d(a.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", f);
  function b() {
    h(), f();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    it(b);
  }) : it(b);
  function g(e) {
    const a = (e.detail || {}).data;
    if (a && a.message) {
      const v = a.message;
      window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
        detail: {
          type: v.type || "success",
          title: v.title || "",
          message: v.body || ""
        }
      }));
    }
    const y = e.target.closest("[data-ln-modal]");
    y && y.lnModal && (y.id && et(y.id, null), S(y, "ln-modal:request-close", {}), c(y));
  }
  function _(e) {
    const o = e.detail || {}, a = o.data, y = o.status || 0, v = p(e.target);
    if (a && a.message) {
      const w = a.message;
      window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
        detail: {
          type: w.type || "error",
          title: w.title || "",
          message: w.body || ""
        }
      }));
    } else y === 0 ? window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: v["network-error-title"] || "",
        message: v["network-error"] || "Network error"
      }
    })) : window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: v["server-error-title"] || "",
        message: v["server-error"] || "Server error"
      }
    }));
  }
  document.addEventListener("ln-ajax:success", g), document.addEventListener("ln-ajax:error", _);
  function m(e) {
    const o = e.detail || {}, a = p(e.target), y = o.message || (o.reason === "max-size" ? a["upload-max-size"] || "File is too large" : o.reason === "max-files" ? a["upload-max-files"] || "Maximum file count exceeded" : a["upload-invalid-type"] || "This file type is not allowed"), v = a["upload-invalid-title"] || "Invalid File";
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: v,
        message: y
      }
    }));
  }
  function r(e) {
    const o = e.detail || {}, a = p(e.target), y = o.message || a["upload-failed"] || "Failed to upload file", v = a["upload-error-title"] || "Upload Error";
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: v,
        message: y
      }
    }));
  }
  document.addEventListener("ln-upload:invalid", m), document.addEventListener("ln-upload:error", r), document.addEventListener("ln-modal:close", function(e) {
    const o = e.target;
    !o || !o.lnModal || (o.id && X(o.id) !== null && et(o.id, null), o.dataset.lnModalMode === "new" && c(o));
  });
  function s(e) {
    return this.dom = e, this.dict = Vt(e, u), this;
  }
  s.prototype.destroy = function() {
    this.dom[n] && (this.dict = {}, delete this.dom[n]);
  }, M(t, n, s, "ln-ui-coordinator");
})();
function si(t, n) {
  if (!t) return 0;
  if (n <= 0)
    return t.startsWith("-") ? 1 : 0;
  let u = n, p = 0;
  for (let l = 0; l < t.length && u > 0; l++)
    p = l + 1, /[0-9]/.test(t[l]) && u--;
  return u > 0 && (p = t.length), p;
}
(function() {
  const t = "data-ln-number", n = "lnNumber";
  if (window[n] !== void 0) return;
  const u = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(l) {
    if (l[n]) return l[n];
    l[n] = this, this.dom = l;
    const d = this;
    if (this._onLocaleChange = function() {
      d.isTextElement ? d._formatTextContent() : isNaN(d.value) || d._displayFormatted(d.value);
    }, Wt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), l.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const c = document.createElement("input");
    c.type = "hidden", c.name = l.name, l.removeAttribute("name"), l.hasAttribute("data-ln-fill-as") && c.setAttribute("data-ln-fill-as", l.getAttribute("data-ln-fill-as")), l.type = "text", l.setAttribute("inputmode", "decimal"), l.insertAdjacentElement("afterend", c), this._hidden = c, Object.defineProperty(c, "value", {
      get: function() {
        return u.get.call(c);
      },
      set: function(f) {
        if (u.set.call(c, f), f !== "" && !isNaN(parseFloat(f))) {
          const h = d.dom.getAttribute("data-ln-number-decimals");
          d._setDisplayRaw(tt(parseFloat(f), V(d.dom), { maxDecimals: h }));
        } else
          d._setDisplayRaw("");
        d.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), Ke(l, u, {
      get: function() {
        return u.get.call(l);
      },
      set: function(f) {
        if (f === "") {
          d._setDisplayRaw(""), d._setHiddenRaw(""), l.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const h = typeof f == "number" ? f : Rt(String(f), V(l));
        if (isNaN(h))
          d._setDisplayRaw(String(f)), d._setHiddenRaw("");
        else {
          d._setHiddenRaw(h);
          const b = l.getAttribute("data-ln-number-decimals");
          d._setDisplayRaw(tt(h, V(l), { maxDecimals: b }));
        }
        l.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      d._handleInput();
    }, l.addEventListener("input", this._onInput), this._onKeyDown = function(f) {
      if (f.key !== "Backspace") return;
      const h = l.selectionStart, b = l.selectionEnd;
      if (h !== b || h === 0) return;
      const g = zt(V(l)), _ = u.get.call(l), m = _[h - 1];
      if (m === g.groupSep || /\s/.test(m)) {
        f.preventDefault();
        const r = h - 2 >= 0 ? h - 2 : 0, s = _.slice(0, r) + _.slice(h);
        u.set.call(l, s), l.setSelectionRange(r, r), l.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, l.addEventListener("keydown", this._onKeyDown), this._onPaste = function(f) {
      f.preventDefault();
      const h = (f.clipboardData || window.clipboardData).getData("text"), b = Rt(h, V(l));
      d.value = isNaN(b) ? NaN : b;
    }, l.addEventListener("paste", this._onPaste);
    const i = l.value;
    if (i !== "") {
      const f = Rt(i, V(l));
      if (!isNaN(f)) {
        const h = l.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(f), this._setDisplayRaw(tt(f, V(l), { maxDecimals: h })), l.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return this;
  }
  p.prototype._initTextElement = function() {
    const l = this.dom;
    let d = l.getAttribute("data-ln-value"), c = l.getAttribute("data-ln-number"), i = null;
    d !== null && d !== "" ? i = d : c !== null && c !== "" && c !== "true" ? i = c : i = l.textContent.trim();
    const f = Rt(i, V(l));
    isNaN(f) ? this._rawValue = null : (this._rawValue = f, l.hasAttribute("data-ln-value") || l.setAttribute("data-ln-value", String(f)), this._formatTextContent());
  }, p.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const l = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = tt(this._rawValue, V(this.dom), { maxDecimals: l });
    }
  }, p.prototype._handleInput = function() {
    const l = this.dom, d = u.get.call(l);
    if (d === "") {
      this._setHiddenRaw(""), S(l, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (d === "-") {
      this._setHiddenRaw(""), S(l, "ln-number:input", { value: NaN, formatted: "-" });
      return;
    }
    const c = l.selectionStart;
    let i = 0;
    for (let y = 0; y < c; y++)
      /[0-9]/.test(d[y]) && i++;
    const f = V(l), h = zt(f);
    let b = d, g = nn(d, h.groupSep, h.decimalSep), _ = parseFloat(g);
    if (isNaN(_)) {
      this._setHiddenRaw(""), S(l, "ln-number:input", { value: NaN, formatted: d });
      return;
    }
    const m = l.getAttribute("data-ln-number-decimals"), r = g.indexOf(".");
    if (m !== null && r !== -1) {
      const y = parseInt(m, 10), v = g.slice(r + 1);
      if (y === 0)
        g = g.slice(0, r), b = b.split(h.decimalSep)[0], _ = parseFloat(g), this._setDisplayRaw(b);
      else if (v.length > y) {
        g = g.slice(0, r + 1 + y);
        const w = b.split(h.decimalSep);
        b = w[0] + h.decimalSep + w[1].slice(0, y), _ = parseFloat(g), this._setDisplayRaw(b);
      }
    }
    const s = l.getAttribute("data-ln-number-max");
    if (s !== null && _ > parseFloat(s)) {
      const y = parseFloat(s), v = tt(y, f, { maxDecimals: m });
      this._setDisplayRaw(v), this._setHiddenRaw(y), l.setSelectionRange(v.length, v.length), S(l, "ln-number:input", { value: y, formatted: v });
      return;
    }
    if (b.endsWith(h.decimalSep) || h.decimalSep !== "." && b.endsWith(".")) {
      this._setHiddenRaw(_), S(l, "ln-number:input", { value: _, formatted: b });
      return;
    }
    const e = g.indexOf(".");
    if (e !== -1 && g.slice(e + 1).endsWith("0")) {
      this._setHiddenRaw(_), S(l, "ln-number:input", { value: _, formatted: b });
      return;
    }
    let o;
    if (m !== null)
      o = tt(_, f, { maxDecimals: m });
    else {
      const y = e !== -1 ? g.slice(e + 1).length : 0;
      o = tt(_, f, { userDecimals: y });
    }
    this._setDisplayRaw(o);
    const a = si(o, i);
    l.setSelectionRange(a, a), this._setHiddenRaw(_), S(l, "ln-number:input", { value: _, formatted: o });
  }, p.prototype._setHiddenRaw = function(l) {
    this._hidden && u.set.call(this._hidden, String(l));
  }, p.prototype._setDisplayRaw = function(l) {
    this.isTextElement ? this.dom.textContent = String(l) : u.set.call(this.dom, String(l));
  }, p.prototype._displayFormatted = function(l) {
    if (this.isTextElement)
      this._formatTextContent();
    else {
      const d = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(tt(l, V(this.dom), { maxDecimals: d }));
    }
  }, Object.defineProperty(p.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const l = u.get.call(this._hidden);
      return l === "" ? NaN : parseFloat(l);
    },
    set: function(l) {
      if (this.isTextElement) {
        typeof l != "number" || isNaN(l) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = l, this.dom.setAttribute("data-ln-value", String(l)), this._formatTextContent());
        return;
      }
      if (typeof l != "number" || isNaN(l)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(l);
      const d = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(tt(l, V(this.dom), { maxDecimals: d })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(p.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : u.get.call(this.dom);
    }
  }), p.prototype.destroy = function() {
    this.dom[n] && (this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), S(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[n]);
  }, M(t, n, p, "ln-number", {
    extraAttributes: [
      "data-ln-value",
      "data-ln-number-decimals",
      "data-ln-number-min",
      "data-ln-number-max",
      "lang"
    ],
    onAttributeChange: function(l) {
      const d = l[n];
      d && (d.isTextElement ? d._initTextElement() : isNaN(d.value) || d._displayFormatted(d.value));
    }
  });
})();
const ce = /^(short|medium|long)(\s+datetime)?$/, ai = {
  short: { dateStyle: "short" },
  medium: { dateStyle: "medium" },
  long: { dateStyle: "long" },
  "short datetime": { dateStyle: "short", timeStyle: "short" },
  "medium datetime": { dateStyle: "medium", timeStyle: "short" },
  "long datetime": { dateStyle: "long", timeStyle: "short" }
};
function li(t) {
  return !t || t === "" ? { dateStyle: "medium" } : String(t).trim().match(ce) ? ai[t.trim()] : null;
}
function Ot(t) {
  if (!t || typeof t != "string") return null;
  const n = t.trim();
  if (n.length < 6) return null;
  let u, p;
  if (n.indexOf(".") !== -1)
    u = ".", p = n.split(".");
  else if (n.indexOf("/") !== -1)
    u = "/", p = n.split("/");
  else if (n.indexOf("-") !== -1)
    u = "-", p = n.split("-");
  else
    return null;
  if (p.length !== 3) return null;
  const l = [];
  for (let h = 0; h < 3; h++) {
    const b = parseInt(p[h], 10);
    if (isNaN(b)) return null;
    l.push(b);
  }
  let d, c, i;
  u === "." ? (d = l[0], c = l[1], i = l[2]) : u === "/" ? (c = l[0], d = l[1], i = l[2]) : p[0].length === 4 ? (i = l[0], c = l[1], d = l[2]) : (d = l[0], c = l[1], i = l[2]), i < 100 && (i += i < 50 ? 2e3 : 1900);
  const f = new Date(i, c - 1, d);
  return f.getFullYear() !== i || f.getMonth() !== c - 1 || f.getDate() !== d ? null : f;
}
function ne(t, n, u, p) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !n || typeof n != "string") return "";
  const l = t.getDate(), d = t.getMonth(), c = t.getFullYear(), i = t.getHours(), f = t.getMinutes();
  let h, b;
  const g = (u || "").toLowerCase().split("-")[0];
  let _ = !1;
  try {
    const s = new Intl.DateTimeFormat(u, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    _ = !!(p && s !== g);
  } catch {
    _ = !!p;
  }
  if (_ && p && p.monthsLong)
    h = p.monthsLong[d];
  else
    try {
      h = new Intl.DateTimeFormat(u, { month: "long" }).format(t);
    } catch {
      h = String(d + 1);
    }
  if (_ && p && p.monthsShort)
    b = p.monthsShort[d];
  else
    try {
      b = new Intl.DateTimeFormat(u, { month: "short" }).format(t);
    } catch {
      b = String(d + 1);
    }
  const m = {
    yyyy: String(c),
    yy: String(c).slice(-2),
    MMMM: h,
    MMM: b,
    MM: String(d + 1).padStart(2, "0"),
    M: String(d + 1),
    dd: String(l).padStart(2, "0"),
    d: String(l),
    HH: String(i).padStart(2, "0"),
    mm: String(f).padStart(2, "0")
  };
  return n.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(r) {
    return m[r] !== void 0 ? m[r] : r;
  });
}
function Mt(t, n, u, p) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const l = li(n);
  if (l)
    try {
      const d = new Intl.DateTimeFormat(u, l), c = (u || "").toLowerCase().split("-")[0], i = d.resolvedOptions().locale.toLowerCase().split("-")[0];
      return p && i !== c ? ne(t, "dd.MM.yyyy", u, p) : d.format(t);
    } catch {
      return ne(t, "dd.MM.yyyy", u, p);
    }
  return ne(t, n || "dd.MM.yyyy", u, p);
}
(function() {
  const t = "data-ln-date", n = "lnDate";
  if (window[n] !== void 0) return;
  const u = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(i, f, h) {
    S(i.dom, "ln-date:change", {
      value: f,
      formatted: i.dom.value,
      date: h
    }), i.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function l(i, f, h, b) {
    i._setHiddenRaw(f), u.set.call(i._picker, f), i._lastISO = f, b !== void 0 ? (i._isFormatting = !0, i.dom.value = b, i._isFormatting = !1) : h && i._displayFormatted(h), p(i, f, h);
  }
  function d(i) {
    i._setHiddenRaw(""), u.set.call(i._picker, ""), i._isFormatting = !0, i.dom.value = "", i._isFormatting = !1, i._lastISO = "", p(i, "", null);
  }
  function c(i) {
    if (i[n]) return i[n];
    i[n] = this, this.dom = i;
    const f = this;
    if (this._onLocaleChange = function() {
      if (f.isTextElement)
        f._formatTextContent();
      else if (f.value) {
        const e = Y(f.value);
        e && f._displayFormatted(e);
      }
    }, Wt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), i.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const h = i.value, b = i.name, g = i.closest(".form-element, form") || i.parentNode;
    if (g) {
      const e = g.querySelectorAll("[data-ln-date-dict]");
      for (let o = 0; o < e.length; o++) {
        const a = e[o].getAttribute("data-ln-date-dict");
        if (a) {
          const y = Vt(e[o], "data-ln-date-dict-key");
          y["months-long"] && (y.monthsLong = y["months-long"].split(",").map((v) => v.trim())), y["months-short"] && (y.monthsShort = y["months-short"].split(",").map((v) => v.trim())), fe(a, y);
        }
      }
    }
    const _ = document.createElement("span");
    _.setAttribute("data-ln-date-field", ""), i.parentNode.insertBefore(_, i), _.appendChild(i), this._wrapper = _;
    const m = document.createElement("input");
    m.type = "hidden", m.name = b, i.removeAttribute("name"), i.hasAttribute("data-ln-fill-as") && m.setAttribute("data-ln-fill-as", i.getAttribute("data-ln-fill-as")), i.insertAdjacentElement("afterend", m), this._hidden = m;
    const r = document.createElement("input");
    r.type = "date", r.tabIndex = -1, r.setAttribute("tabindex", "-1"), r.setAttribute("aria-hidden", "true"), r.setAttribute("aria-label", i.getAttribute("data-ln-date-label") || "Date picker"), r.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", m.insertAdjacentElement("afterend", r), this._picker = r, i.type = "text";
    const s = document.createElement("button");
    if (s.type = "button", s.setAttribute("aria-label", i.getAttribute("data-ln-date-label") || "Open date picker"), s.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', r.insertAdjacentElement("afterend", s), this._btn = s, this._lastISO = "", Object.defineProperty(m, "value", {
      get: function() {
        return u.get.call(m);
      },
      set: function(e) {
        if (u.set.call(m, e), e && e !== "") {
          const o = Y(e);
          o && l(f, e, o);
        } else e === "" && d(f);
      }
    }), Ke(i, u, {
      get: function() {
        return u.get.call(i);
      },
      set: function(e, o) {
        if (f._isFormatting) {
          o(e);
          return;
        }
        if (!e || e === "") {
          o(""), d(f);
          return;
        }
        const a = Y(e) || Ot(e);
        if (a) {
          const y = Tt(a), v = i.getAttribute(t) || "", w = V(i), A = _t(w), C = Mt(a, v, w, A);
          o(C), l(f, y, a, C);
        } else
          o(String(e)), d(f);
      }
    }), this._onPickerChange = function() {
      const e = r.value;
      if (e) {
        const o = Y(e);
        o && l(f, e, o);
      } else
        d(f);
    }, r.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const e = f.dom.value.trim();
      if (e === "") {
        f._lastISO !== "" && d(f);
        return;
      }
      if (f._lastISO) {
        const a = Y(f._lastISO);
        if (a) {
          const y = f.dom.getAttribute(t) || "", v = V(f.dom), w = _t(v);
          if (e === Mt(a, y, v, w)) return;
        }
      }
      const o = Ot(e);
      if (o) {
        const a = Tt(o);
        l(f, a, o);
      } else if (f._lastISO) {
        const a = Y(f._lastISO);
        a && f._displayFormatted(a);
      } else
        f.dom.value = "";
    }, i.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      f._openPicker();
    }, s.addEventListener("click", this._onBtnClick), h && h !== "") {
      const e = Y(h);
      e && l(f, h, e);
    }
    return this;
  }
  c.prototype._initTextElement = function() {
    const i = this.dom, f = i.getAttribute("data-ln-value"), h = i.getAttribute("data-ln-date"), b = i.getAttribute("datetime");
    let g = null;
    f !== null && f !== "" ? g = f : b !== null && b !== "" ? g = b : h !== null && h !== "" && h !== "true" && !ce.test(h) ? g = h : g = i.textContent.trim();
    const _ = Y(g) || Ot(g);
    if (_ && !isNaN(_.getTime())) {
      const m = Tt(_);
      this._rawValue = m, i.hasAttribute("data-ln-value") || i.setAttribute("data-ln-value", m), this._formatTextContent();
    } else
      this._rawValue = null;
  }, c.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const i = Y(this._rawValue);
      if (i) {
        let h = this.dom.getAttribute("data-ln-date-format");
        if (!h) {
          const _ = this.dom.getAttribute("data-ln-date");
          _ && ce.test(_) && (h = _);
        }
        const b = V(this.dom), g = _t(b);
        this.dom.textContent = Mt(i, h || "medium", b, g);
      }
    }
  }, c.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, c.prototype._setHiddenRaw = function(i) {
    u.set.call(this._hidden, i);
  }, c.prototype._displayFormatted = function(i) {
    const f = this.dom.getAttribute(t) || "", h = V(this.dom), b = _t(h);
    this._isFormatting = !0, this.dom.value = Mt(i, f, h, b), this._isFormatting = !1;
  }, Object.defineProperty(c.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : u.get.call(this._hidden);
    },
    set: function(i) {
      if (this.isTextElement) {
        if (!i || i === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const h = Y(i) || Ot(i);
        if (!h) return;
        const b = Tt(h);
        this._rawValue = b, this.dom.setAttribute("data-ln-value", b), this._formatTextContent();
        return;
      }
      if (!i || i === "") {
        d(this);
        return;
      }
      const f = Y(i);
      f && l(this, i, f);
    }
  }), Object.defineProperty(c.prototype, "date", {
    get: function() {
      const i = this.value;
      return i ? Y(i) : null;
    },
    set: function(i) {
      if (!i || !(i instanceof Date) || isNaN(i.getTime())) {
        this.value = "";
        return;
      }
      this.value = Tt(i);
    }
  }), Object.defineProperty(c.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), c.prototype.destroy = function() {
    if (!this.dom[n]) return;
    if (this.isTextElement) {
      S(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[n];
      return;
    }
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const i = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", i && (this.dom.value = i), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), S(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[n];
  }, M(t, n, c, "ln-date", {
    extraAttributes: ["data-ln-date-format", "data-ln-date-locale", "data-ln-value", "datetime", "lang"],
    onAttributeChange: function(i) {
      const f = i[n];
      if (f) {
        if (f.isTextElement)
          f._initTextElement();
        else if (f.value) {
          const h = Y(f.value);
          h && f._displayFormatted(h);
        }
      }
    }
  });
})();
(function() {
  const t = "data-ln-nav", n = "lnNav";
  if (window[n] !== void 0) return;
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const d = history.pushState;
    history.pushState = function() {
      d.apply(history, arguments);
      for (const i of history._lnNavCallbacks)
        i();
    };
    const c = history.replaceState;
    history.replaceState = function() {
      c.apply(history, arguments);
      for (const i of history._lnNavCallbacks)
        i();
    }, history._lnNavPatched = !0;
  }
  function u(d) {
    return this.dom = d, this.activeClass = d.getAttribute(t) || "active", this.exact = d.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(d, { childList: !0, subtree: !0 }), this.update(), this;
  }
  u.prototype.update = function() {
    if (!this.activeClass || W(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const c = Array.from(this.dom.querySelectorAll("a")), i = window.location.pathname, f = p(i), h = [];
    for (const b of c) {
      const g = b.getAttribute("href");
      if (!g || g === "#" || g.startsWith("#") || g.startsWith("javascript:") || g.startsWith("mailto:") || g.startsWith("tel:")) {
        b.classList.remove(this.activeClass), b.removeAttribute("aria-current");
        continue;
      }
      if (b.hostname && b.hostname !== window.location.hostname) {
        b.classList.remove(this.activeClass), b.removeAttribute("aria-current");
        continue;
      }
      const _ = p(g), m = _ === f, r = !this.exact && _ !== "/" && f.startsWith(_ + "/");
      m || r ? (b.classList.add(this.activeClass), b.setAttribute("aria-current", "page"), h.push(b)) : (b.classList.remove(this.activeClass), b.removeAttribute("aria-current"));
    }
    S(this.dom, "ln-nav:update", { target: this.dom, activeLinks: h });
  }, u.prototype.destroy = function() {
    if (!this.dom[n]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const d = history._lnNavCallbacks.indexOf(this.updateHandler);
    d !== -1 && history._lnNavCallbacks.splice(d, 1), S(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[n];
  };
  function p(d) {
    try {
      return new URL(d, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return d.replace(/\/$/, "") || "/";
    }
  }
  function l(d, c) {
    const i = d[n];
    if (i) {
      if (c === t) {
        if (!d.hasAttribute(t)) {
          i.destroy();
          return;
        }
        const f = i.activeClass, h = d.getAttribute(t) || "active";
        if (f !== h) {
          const b = d.querySelectorAll("a");
          for (const g of b)
            f && g.classList.remove(f);
          i.activeClass = h;
        }
      } else c === "data-ln-nav-exact" && (i.exact = d.hasAttribute("data-ln-nav-exact"));
      i.update();
    }
  }
  M(t, n, u, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: l
  });
})();
function ke(t, n, u, p) {
  const l = (t || "").toLowerCase().trim();
  if (l) return l;
  if ((n || "").toUpperCase() !== "A") return "";
  const d = u || "";
  if (!d.startsWith("#")) return "";
  const c = d.slice(1);
  if (!c) return "";
  const i = c.split("&"), f = (p || "").toLowerCase().trim();
  if (f)
    for (const g of i) {
      const _ = g.indexOf(":");
      if (_ > 0 && g.slice(0, _).toLowerCase().trim() === f)
        return g.slice(_ + 1).toLowerCase().trim();
    }
  const h = i[i.length - 1] || "", b = h.indexOf(":");
  return (b > 0 ? h.slice(b + 1) : h).toLowerCase().trim();
}
function ci(t, n) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const u = t.filter(
    (d) => (d.tagName || "").toUpperCase() === "A" && (d.href || "").startsWith("#")
  ), p = u.length > 0 && u.length === t.length, l = (n || "").toLowerCase().trim();
  return u.length > 0 && u.length !== t.length ? { hashEnabled: !1, warning: "mixed" } : p && !l ? { hashEnabled: !1, warning: "missing-namespace" } : {
    hashEnabled: p && !!l,
    warning: null
  };
}
function di(t, n, u) {
  const p = (t || "").toLowerCase().trim();
  return p && Array.isArray(n) && n.includes(p) ? p : (u || "").toLowerCase().trim();
}
(function() {
  const t = "data-ln-tabs", n = "lnTabs";
  if (window[n] !== void 0 && window[n] !== null) return;
  function u(l) {
    return this.dom = l, this.activeKey = null, p.call(this), this;
  }
  function p() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const l = this.tabs.map((i) => ({
      tagName: i.tagName,
      href: i.getAttribute("href")
    }));
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim();
    const d = ci(l, this.nsKey);
    this.hashEnabled = d.hashEnabled, d.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : d.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const i of this.tabs) {
      const f = ke(i.getAttribute("data-ln-tab"), i.tagName, i.getAttribute("href"), this.nsKey);
      f ? this.mapTabs[f] = i : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', i);
    }
    for (const i of this.panels) {
      const f = (i.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      f && (this.mapPanels[f] = i);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const c = this;
    this._clickHandlers = [];
    for (const i of this.tabs) {
      if (i[n + "Trigger"]) continue;
      const f = function(h) {
        const b = i.tagName === "A";
        if (!b && (h.ctrlKey || h.metaKey || h.button === 1)) return;
        const g = ke(i.getAttribute("data-ln-tab"), i.tagName, i.getAttribute("href"), c.nsKey);
        g && (b && !me(h) || (c.hashEnabled ? X(c.nsKey) === g ? c.dom.setAttribute("data-ln-tabs-active", g) : et(c.nsKey, g) : c.dom.setAttribute("data-ln-tabs-active", g)));
      };
      i.addEventListener("click", f), i[n + "Trigger"] = f, c._clickHandlers.push({ el: i, handler: f });
    }
    if (this._onRequestSelect = function(i) {
      const f = i.detail && (i.detail.key || i.detail.tab);
      f && c.select(f);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!c.hashEnabled) return;
      const i = X(c.nsKey);
      c.dom.setAttribute("data-ln-tabs-active", i !== null ? i : c.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let i = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const f = Gt("tabs", this.dom);
        f !== null && f in this.mapPanels && (i = f);
      }
      this.dom.setAttribute("data-ln-tabs-active", i);
    }
  }
  u.prototype.select = function(l) {
    const d = (l + "").toLowerCase().trim();
    d && (this.hashEnabled ? X(this.nsKey) === d ? this.dom.setAttribute("data-ln-tabs-active", d) : et(this.nsKey, d) : this.dom.setAttribute("data-ln-tabs-active", d));
  }, u.prototype._applyActive = function(l) {
    var c;
    if (l = di(l, Object.keys(this.mapPanels), this.defaultKey), l === this.activeKey) return;
    const d = this.activeKey;
    if (d !== null && W(this.dom, "ln-tabs:before-change", {
      key: l,
      previousKey: d,
      tab: this.mapTabs[l],
      panel: this.mapPanels[l],
      target: this.dom
    }).defaultPrevented) {
      d in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", d), this.hashEnabled && X(this.nsKey) !== d && et(this.nsKey, d));
      return;
    }
    this.activeKey = l;
    for (const i in this.mapTabs) {
      const f = this.mapTabs[i];
      i === l ? (f.setAttribute("data-active", ""), f.setAttribute("aria-selected", "true")) : (f.removeAttribute("data-active"), f.setAttribute("aria-selected", "false"));
    }
    for (const i in this.mapPanels) {
      const f = this.mapPanels[i], h = i === l;
      f.classList.toggle("hidden", !h), f.setAttribute("aria-hidden", h ? "false" : "true");
    }
    if (this.autoFocus) {
      const i = (c = this.mapPanels[l]) == null ? void 0 : c.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      i && setTimeout(() => i.focus({ preventScroll: !0 }), 0);
    }
    S(this.dom, "ln-tabs:change", {
      key: l,
      previousKey: d,
      tab: this.mapTabs[l],
      panel: this.mapPanels[l],
      target: this.dom
    }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && bt("tabs", this.dom, l);
  }, u.prototype.destroy = function() {
    if (this.dom[n]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: l, handler: d } of this._clickHandlers)
        l.removeEventListener("click", d), delete l[n + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), S(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[n];
    }
  }, M(t, n, u, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(l) {
      const d = l.getAttribute("data-ln-tabs-active");
      l[n]._applyActive(d);
    }
  });
})();
(function() {
  const t = "data-ln-toggle", n = "lnToggle", u = "data-ln-toggle-for", p = "data-ln-toggle-action", l = "data-ln-persist";
  if (window[n] !== void 0) return;
  const d = /* @__PURE__ */ new Set();
  let c = null;
  function i(m, r) {
    return r === "open" ? "open" : r === "close" || m === "open" ? "close" : "open";
  }
  function f() {
    c || (c = function(m) {
      if (Be(m)) return;
      const r = m.target.closest("[" + u + "]");
      if (!r || He(r)) return;
      const s = r.getAttribute(u);
      if (!s) return;
      const e = document.getElementById(s);
      if (!e || !e[n]) return;
      m.preventDefault();
      const o = r.getAttribute(p) || "toggle", a = e.getAttribute(t);
      e.setAttribute(t, i(a, o));
    }, document.addEventListener("click", c));
  }
  function h() {
    d.size > 0 || !c || (document.removeEventListener("click", c), c = null);
  }
  function b(m, r) {
    if (!m || !m.id) return;
    const s = document.querySelectorAll(
      "[" + u + '="' + m.id + '"]'
    );
    for (let e = 0; e < s.length; e++)
      s[e].setAttribute("aria-expanded", r ? "true" : "false");
  }
  function g(m) {
    this.dom = m;
    const r = this;
    if (this._onRequestOpen = function() {
      r.open();
    }, this._onRequestClose = function() {
      r.close();
    }, this._onRequestToggle = function() {
      r.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), m.hasAttribute(l)) {
      const s = Gt("toggle", m);
      s !== null && m.setAttribute(t, s === "open" ? "open" : "close");
    }
    return this.isOpen = m.getAttribute(t) === "open", this.isOpen && m.classList.add("open"), b(m, this.isOpen), d.add(this), f(), this;
  }
  g.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, g.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, g.prototype.toggle = function() {
    const m = this.dom.getAttribute(t);
    this.dom.setAttribute(t, i(m, "toggle"));
  }, g.prototype.destroy = function() {
    this.dom[n] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), d.delete(this), delete this.dom[n], h(), S(this.dom, "ln-toggle:destroyed", { target: this.dom }));
  };
  function _(m) {
    const r = m[n];
    if (!r) return;
    const e = m.getAttribute(t) === "open";
    if (e !== r.isOpen)
      if (e) {
        if (W(m, "ln-toggle:before-open", { target: m }).defaultPrevented) {
          m.setAttribute(t, "close");
          return;
        }
        r.isOpen = !0, m.classList.add("open"), b(m, !0), S(m, "ln-toggle:open", { target: m }), m.hasAttribute(l) && bt("toggle", m, "open");
      } else {
        if (W(m, "ln-toggle:before-close", { target: m }).defaultPrevented) {
          m.setAttribute(t, "open");
          return;
        }
        r.isOpen = !1, m.classList.remove("open"), b(m, !1), S(m, "ln-toggle:close", { target: m }), m.hasAttribute(l) && bt("toggle", m, "close");
      }
  }
  M(t, n, g, "ln-toggle", {
    onAttributeChange: _
  });
})();
(function() {
  const t = "data-ln-accordion", n = "lnAccordion";
  if (window[n] !== void 0) return;
  function u(p) {
    return this.dom = p, this._onToggleOpen = function(l) {
      if (l.detail.target.closest("[data-ln-accordion]") !== p) return;
      const d = p.querySelectorAll("[data-ln-toggle]");
      for (const c of d)
        c !== l.detail.target && c.closest("[data-ln-accordion]") === p && c.getAttribute("data-ln-toggle") === "open" && c.setAttribute("data-ln-toggle", "close");
      S(p, "ln-accordion:change", { target: l.detail.target });
    }, p.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  u.prototype.destroy = function() {
    this.dom[n] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), S(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[n]);
  }, M(t, n, u, "ln-accordion");
})();
(function() {
  const t = "data-ln-dropdown", n = "lnDropdown", u = "data-ln-dropdown-position", p = "data-ln-dropdown-placement", l = "bottom-end";
  if (window[n] !== void 0) return;
  function d(c) {
    this.dom = c, this.toggleEl = c.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = c.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const i = this;
    return this._onRequestOpen = function() {
      i.toggleEl && i.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      i.toggleEl && i.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (i.toggleEl) {
        const f = i.toggleEl.getAttribute("data-ln-toggle");
        i.toggleEl.setAttribute("data-ln-toggle", f === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(f) {
      const h = i.toggleEl && i.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (f.key === "Escape") {
        h && (f.preventDefault(), f.stopPropagation(), i.toggleEl.setAttribute("data-ln-toggle", "close"), i.triggerBtn && i.triggerBtn.focus());
        return;
      }
      if (f.key === "Tab") {
        h && (i.triggerBtn && i.triggerBtn.focus(), i.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const b = i._getMenuItems();
      if (b.length === 0) return;
      if (!h && (f.key === "ArrowDown" || f.key === "ArrowUp")) {
        f.preventDefault(), i.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const _ = i._getMenuItems();
          _.length > 0 && i._focusItem(_, f.key === "ArrowDown" ? 0 : _.length - 1);
        }, 0);
        return;
      }
      if (!h) return;
      const g = b.indexOf(document.activeElement);
      if (f.key === "ArrowDown") {
        f.preventDefault();
        const _ = g < b.length - 1 ? g + 1 : 0;
        i._focusItem(b, _);
      } else if (f.key === "ArrowUp") {
        f.preventDefault();
        const _ = g > 0 ? g - 1 : b.length - 1;
        i._focusItem(b, _);
      } else f.key === "Home" ? (f.preventDefault(), i._focusItem(b, 0)) : f.key === "End" && (f.preventDefault(), i._focusItem(b, b.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(f) {
      !f.detail || f.detail.target !== i.toggleEl || (i.triggerBtn && i.triggerBtn.setAttribute("aria-expanded", "true"), typeof i.toggleEl.showPopover == "function" && i.toggleEl.showPopover(), i._initMenuAria(), i._reposition(), i._addOutsideClickListener(), i._addScrollRepositionListener(), i._addResizeCloseListener(), S(c, "ln-dropdown:open", { target: f.detail.target }));
    }, this._onToggleClose = function(f) {
      !f.detail || f.detail.target !== i.toggleEl || (i.triggerBtn && i.triggerBtn.setAttribute("aria-expanded", "false"), i._removeOutsideClickListener(), i._removeScrollRepositionListener(), i._removeResizeCloseListener(), i.toggleEl.style.top = "", i.toggleEl.style.left = "", i.toggleEl.removeAttribute(p), typeof i.toggleEl.hidePopover == "function" && i.toggleEl.matches(":popover-open") && i.toggleEl.hidePopover(), S(c, "ln-dropdown:close", { target: f.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  d.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const c = this.toggleEl.querySelectorAll("li");
    for (const f of c)
      f.setAttribute("role", "none");
    const i = this._getMenuItems();
    for (let f = 0; f < i.length; f++)
      i[f].setAttribute("role", "menuitem"), i[f].setAttribute("tabindex", f === 0 ? "0" : "-1");
  }, d.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, d.prototype._focusItem = function(c, i) {
    for (let f = 0; f < c.length; f++)
      c[f].setAttribute("tabindex", f === i ? "0" : "-1");
    c[i] && c[i].focus();
  }, d.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const c = this.triggerBtn.getBoundingClientRect(), i = oe(this.toggleEl), f = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, h = this.dom.getAttribute(u) || l, b = Ut(c, i, h, f);
    this.toggleEl.style.top = b.top + "px", this.toggleEl.style.left = b.left + "px", this.toggleEl.setAttribute(p, b.placement);
  }, d.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const c = this;
    this._boundDocClick = function(i) {
      c.dom.contains(i.target) || c.toggleEl && c.toggleEl.contains(i.target) || c.toggleEl && c.toggleEl.getAttribute("data-ln-toggle") === "open" && c.toggleEl.setAttribute("data-ln-toggle", "close");
    }, c._docClickTimeout = setTimeout(function() {
      c._docClickTimeout = null, document.addEventListener("click", c._boundDocClick);
    }, 0);
  }, d.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, d.prototype._addScrollRepositionListener = function() {
    const c = this;
    this._boundScrollReposition = function() {
      c._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, d.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, d.prototype._addResizeCloseListener = function() {
    const c = this;
    this._boundResizeClose = function() {
      c.toggleEl && c.toggleEl.getAttribute("data-ln-toggle") === "open" && c.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, d.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, d.prototype.destroy = function() {
    this.dom[n] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute(p), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), S(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[n]);
  }, M(t, n, d, "ln-dropdown");
})();
(function() {
  const t = "data-ln-popover", n = "lnPopover", u = "data-ln-popover-for", p = "data-ln-popover-position";
  if (window[n] !== void 0) return;
  const l = [];
  let d = null;
  function c() {
    d || (d = function(b) {
      if (b.key !== "Escape" || l.length === 0) return;
      l[l.length - 1].close();
    }, document.addEventListener("keydown", d));
  }
  function i() {
    l.length > 0 || d && (document.removeEventListener("keydown", d), d = null);
  }
  function f(b) {
    this.dom = b, this.isOpen = b.getAttribute(t) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const g = this;
    return this._onRequestOpen = function(_) {
      const m = _.detail && _.detail.trigger ? _.detail.trigger : null;
      g.open(m);
    }, this._onRequestClose = function() {
      g.close();
    }, this._onRequestToggle = function(_) {
      const m = _.detail && _.detail.trigger ? _.detail.trigger : null;
      g.toggle(m);
    }, b.addEventListener("ln-popover:request-open", this._onRequestOpen), b.addEventListener("ln-popover:request-close", this._onRequestClose), b.addEventListener("ln-popover:request-toggle", this._onRequestToggle), b.hasAttribute("tabindex") || b.setAttribute("tabindex", "-1"), b.hasAttribute("role") || b.setAttribute("role", "dialog"), b.hasAttribute("popover") || b.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  f.prototype.open = function(b) {
    this.isOpen || (this.trigger = b || null, this.dom.setAttribute(t, "open"));
  }, f.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(t, "closed");
  }, f.prototype.toggle = function(b) {
    this.isOpen ? this.close() : this.open(b);
  }, f.prototype._applyOpen = function(b) {
    this.isOpen = !0, b && (this.trigger = b), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const g = oe(this.dom);
    if (this.trigger) {
      const s = this.trigger.getBoundingClientRect(), e = this.dom.getAttribute(p) || "bottom", o = Ut(s, g, e, 8);
      this.dom.style.top = o.top + "px", this.dom.style.left = o.left + "px", this.dom.setAttribute("data-ln-popover-placement", o.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const _ = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), m = Array.prototype.find.call(_, kt);
    m ? m.focus() : this.dom.focus();
    const r = this;
    this._boundDocClick = function(s) {
      r.dom.contains(s.target) || r.trigger && r.trigger.contains(s.target) || r.close();
    }, r._docClickTimeout = setTimeout(function() {
      r._docClickTimeout = null, document.addEventListener("click", r._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!r.trigger) return;
      const s = r.trigger.getBoundingClientRect(), e = oe(r.dom), o = r.dom.getAttribute(p) || "bottom", a = Ut(s, e, o, 8);
      r.dom.style.top = a.top + "px", r.dom.style.left = a.left + "px", r.dom.setAttribute("data-ln-popover-placement", a.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), l.push(this), c(), S(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, f.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const b = l.indexOf(this);
    b !== -1 && l.splice(b, 1), i(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, S(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, f.prototype.destroy = function() {
    this.dom[n] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[n], S(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function h(b) {
    this.dom = b;
    const g = b.getAttribute(u);
    return b.setAttribute("aria-haspopup", "dialog"), b.setAttribute("aria-expanded", "false"), b.setAttribute("aria-controls", g), this._onClick = function(_) {
      if (_.ctrlKey || _.metaKey || _.button === 1) return;
      _.preventDefault();
      const m = document.getElementById(g);
      if (!m) return;
      m[n] && (m[n].trigger = b);
      const r = m.getAttribute(t);
      m.setAttribute(t, r === "open" ? "closed" : "open");
    }, b.addEventListener("click", this._onClick), this;
  }
  h.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[n + "Trigger"];
  }, M(t, n, f, "ln-popover", {
    onAttributeChange: function(b) {
      const g = b[n];
      if (!g) return;
      const m = b.getAttribute(t) === "open";
      if (m !== g.isOpen)
        if (m) {
          if (W(b, "ln-popover:before-open", {
            popoverId: b.id,
            target: b,
            trigger: g.trigger
          }).defaultPrevented) {
            b.setAttribute(t, "closed");
            return;
          }
          g._applyOpen(g.trigger);
        } else {
          if (W(b, "ln-popover:before-close", {
            popoverId: b.id,
            target: b,
            trigger: g.trigger
          }).defaultPrevented) {
            b.setAttribute(t, "open");
            return;
          }
          g._applyClose();
        }
    }
  }), M(u, n + "Trigger", h, "ln-popover-trigger");
})();
(function() {
  const t = "data-ln-tooltip-enhance", n = "data-ln-tooltip", u = "data-ln-tooltip-position", p = "lnTooltipEnhance", l = "ln-tooltip-portal";
  if (window[p] !== void 0) return;
  let d = 0, c = null, i = null, f = null, h = null, b = null, g = null;
  function _() {
    return c && c.parentNode || (c = document.getElementById(l), c || (c = document.createElement("div"), c.id = l, document.body.appendChild(c)), c.hasAttribute("popover") || c.setAttribute("popover", "manual")), c;
  }
  function m() {
    g || (g = function(a) {
      a.key === "Escape" && e();
    }, document.addEventListener("keydown", g));
  }
  function r() {
    g && (document.removeEventListener("keydown", g), g = null);
  }
  function s(a) {
    if (f === a) return;
    e();
    const y = a.getAttribute(n) || a.getAttribute("title");
    if (!y) return;
    _(), typeof c.showPopover == "function" && c.showPopover(), a.hasAttribute("title") && (h = a.getAttribute("title"), a.removeAttribute("title"));
    const v = a.getAttribute("aria-describedby");
    v ? b = v : b = null;
    const w = document.createElement("div");
    w.className = "ln-tooltip", w.textContent = y, a[p + "Uid"] || (d += 1, a[p + "Uid"] = "ln-tooltip-" + d), w.id = a[p + "Uid"], c.appendChild(w);
    const A = w.offsetWidth, C = w.offsetHeight, L = a.getBoundingClientRect(), q = a.getAttribute(u) || "top", x = Ut(L, { width: A, height: C }, q, 6);
    w.style.top = x.top + "px", w.style.left = x.left + "px", w.setAttribute("data-ln-tooltip-placement", x.placement), b ? a.setAttribute("aria-describedby", b + " " + w.id) : a.setAttribute("aria-describedby", w.id), i = w, f = a, m();
  }
  function e() {
    if (!i) {
      r();
      return;
    }
    f && (b !== null ? f.setAttribute("aria-describedby", b) : f.removeAttribute("aria-describedby"), b = null, h !== null && f.setAttribute("title", h)), h = null, i.parentNode && i.parentNode.removeChild(i), i = null, f = null, c && typeof c.hidePopover == "function" && c.matches(":popover-open") && c.hidePopover(), r();
  }
  function o(a) {
    return this.dom = a, a.hasAttribute("data-ln-tooltip-enhanced") || (a.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      s(a);
    }, this._onLeave = function() {
      f === a && !a.contains(document.activeElement) && e();
    }, this._onFocus = function() {
      s(a);
    }, this._onBlur = function() {
      f === a && !a.matches(":hover") && e();
    }, a.addEventListener("mouseenter", this._onEnter), a.addEventListener("mouseleave", this._onLeave), a.addEventListener("focus", this._onFocus, !0), a.addEventListener("blur", this._onBlur, !0), this;
  }
  o.prototype.destroy = function() {
    const a = this.dom;
    a.removeEventListener("mouseenter", this._onEnter), a.removeEventListener("mouseleave", this._onLeave), a.removeEventListener("focus", this._onFocus, !0), a.removeEventListener("blur", this._onBlur, !0), f === a && e(), this._addedEnhancedAttr && a.removeAttribute("data-ln-tooltip-enhanced"), delete a[p], delete a[p + "Uid"], S(a, "ln-tooltip:destroyed", { trigger: a });
  }, M(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + n + "][title]",
    p,
    o,
    "ln-tooltip"
  );
})();
(function() {
  const t = "data-ln-toast", n = "lnToast", u = "ln-toast-item";
  if (window[n] !== void 0) return;
  function p(r) {
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
  function l(r) {
    if (!r || !(r instanceof HTMLElement)) return;
    if (r.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof r.hidePopover == "function" && r.matches(":popover-open"))
      try {
        r.hidePopover();
      } catch {
      }
  }
  function d(r) {
    this.dom = r, this.timeoutDefault = +(r.getAttribute("data-ln-toast-timeout") ?? 6e3), this.max = +(r.getAttribute("data-ln-toast-max") ?? 5);
    const s = Array.from(r.querySelectorAll("[data-ln-toast-item]"));
    for (; s.length > this.max; ) r.removeChild(s.shift());
    for (const e of s) g(e, this);
    return s.length > 0 && p(r), this;
  }
  d.prototype.enqueue = function(r) {
    if (!r) return;
    const s = c(r, this.dom);
    if (!s) return;
    const e = Number.isFinite(r.timeout) ? r.timeout : this.timeoutDefault;
    f(this, s), e > 0 && (s._timer = setTimeout(() => h(s), e));
  }, d.prototype.clear = function() {
    for (const r of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      h(r);
  }, d.prototype.destroy = function() {
    if (this.dom[n]) {
      for (const r of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        h(r);
      l(this.dom), S(this.dom, "ln-toast:destroyed", { target: this.dom }), delete this.dom[n];
    }
  };
  function c(r, s) {
    const e = ((r.type || "") + "").trim().toLowerCase(), o = pt(s, u, "ln-toast");
    if (!o)
      return console.warn('[ln-toast] Template "' + u + '" not found'), null;
    ot(o, {
      type: e,
      title: r.title,
      message: typeof r.message == "string" ? r.message : void 0
    });
    const a = o.firstElementChild;
    if (!a) return null;
    a.hasAttribute("data-ln-toast-item") || a.setAttribute("data-ln-toast-item", ""), a.classList.add("ln-enter");
    const y = a.querySelector(".body");
    y && i(y, r);
    const v = a.querySelector("[data-ln-toast-close]");
    return v && v.addEventListener("click", function() {
      h(a);
    }), a;
  }
  function i(r, s) {
    if (Array.isArray(s.message)) {
      const e = document.createElement("ul");
      for (const o of s.message) {
        const a = document.createElement("li");
        a.textContent = o, e.appendChild(a);
      }
      r.appendChild(e);
    }
    if (s.data && s.data.errors) {
      const e = document.createElement("ul");
      for (const o of Object.values(s.data.errors).flat()) {
        const a = document.createElement("li");
        a.textContent = o, e.appendChild(a);
      }
      r.appendChild(e);
    }
  }
  function f(r, s) {
    const e = Array.from(r.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; e.length >= r.max && e.length > 0; ) r.dom.removeChild(e.shift());
    r.dom.appendChild(s), p(r.dom), requestAnimationFrame(() => s.classList.remove("ln-enter"));
  }
  function h(r) {
    if (!r || !r.parentNode) return;
    const s = r.parentNode;
    clearTimeout(r._timer), r.classList.remove("ln-enter"), r.classList.add("ln-out"), setTimeout(() => {
      r.parentNode && (r.parentNode.removeChild(r), l(s));
    }, 200);
  }
  function b(r) {
    let s = r && r.container;
    return typeof s == "string" && (s = document.querySelector(s)), s instanceof HTMLElement || (s = document.querySelector("[" + t + "]") || document.getElementById("ln-toast-container")), s || null;
  }
  function g(r, s) {
    if (r._lnToastHydrated) return;
    r._lnToastHydrated = !0;
    const e = r.querySelector("[data-ln-toast-close]");
    e && e.addEventListener("click", function() {
      h(r);
    });
    const o = +(r.getAttribute("data-ln-toast-timeout") ?? s.timeoutDefault);
    o > 0 && (r._timer = setTimeout(function() {
      h(r);
    }, o));
  }
  function _(r) {
    const s = r.detail || {}, e = b(s);
    if (!e) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (e[n] || (e[n] = new d(e))).enqueue(s);
  }
  function m(r) {
    const s = r && r.detail || {};
    if (s.container) {
      const e = b(s);
      e && (e[n] || (e[n] = new d(e))).clear();
    } else {
      const e = document.querySelectorAll("[" + t + "]");
      for (const o of Array.from(e))
        (o[n] || (o[n] = new d(o))).clear();
    }
  }
  ct(function() {
    window.addEventListener("ln-toast:enqueue", _), window.addEventListener("ln-toast:clear", m), window.addEventListener("ln-modal:open", function() {
      const r = document.querySelectorAll("[" + t + "]");
      for (const s of Array.from(r))
        s.querySelectorAll("[data-ln-toast-item]").length > 0 && p(s);
    });
  }, "ln-toast"), M(t, n, d, "ln-toast");
})();
function ui(t) {
  if (!t) return null;
  const n = String(t).split(",").map((u) => u.trim().toLowerCase()).filter(Boolean).map((u) => u.startsWith(".") ? u.slice(1) : u);
  return n.length ? n : null;
}
function mn(t) {
  return !t || typeof t != "string" || !t.includes(".") ? "" : t.split(".").pop().toLowerCase();
}
function hi(t, n) {
  if (!n || n.length === 0) return !0;
  if (!t) return !1;
  const u = mn(t.name), p = String(t.type || "").toLowerCase();
  return n.some((l) => {
    if (l.includes("/")) {
      if (l.endsWith("/*")) {
        const d = l.slice(0, -1);
        return p.startsWith(d);
      }
      return p === l;
    }
    return u === l;
  });
}
function fi(t, n = "en", u = {}) {
  if (typeof t != "number" || isNaN(t) || t === 0)
    return "0 " + (u["unit-b"] || "B");
  const p = 1024, l = [
    u["unit-b"] || "B",
    u["unit-kb"] || "KB",
    u["unit-mb"] || "MB",
    u["unit-gb"] || "GB"
  ], d = Math.floor(Math.log(t) / Math.log(p)), c = Math.min(d, l.length - 1), i = t / Math.pow(p, c);
  return new Intl.NumberFormat(n, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(i) + " " + l[c];
}
(function() {
  const t = "data-ln-upload", n = "lnUpload", u = "data-ln-upload-dict", p = "data-ln-upload-accept", l = "data-ln-upload-delete", d = "data-ln-upload-max-size", c = "data-ln-upload-max-files", i = "data-ln-upload-file-field", f = "data-ln-upload-ids-field", h = "file", b = "file_ids[]";
  if (window[n] !== void 0) return;
  function g(r, s, e) {
    return fi(r, s, e);
  }
  function _() {
    const r = document.querySelector('meta[name="csrf-token"]');
    return r ? r.getAttribute("content") : "";
  }
  function m(r) {
    this.dom = r, this.dict = Vt(r, u), this.locale = V(r), this.zone = r.querySelector("[data-ln-upload-zone]") || r, this.list = r.querySelector("[data-ln-upload-list]"), this.input = r.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', r), this.uploadUrl = r.getAttribute(t) || "", this.deleteUrlPattern = r.getAttribute(l) || "", this.fileFieldName = r.getAttribute(i) || h, this.idsFieldName = r.getAttribute(f) || b, this.maxSize = +r.getAttribute(d) || 0, this.maxFiles = +r.getAttribute(c) || 0;
    const s = r.getAttribute(p) || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = ui(s), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  m.prototype._hydrate = function() {
    const r = this;
    if (!this.list) return;
    const s = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let o = 0; o < s.length; o++) {
      const a = s[o], y = a.getAttribute("data-ln-upload-id"), v = "file-" + ++r.fileIdCounter;
      a.setAttribute("data-ln-upload-local-id", v);
      const w = a.querySelector('[data-ln-field="name"]'), A = a.querySelector('[data-ln-field="sizeText"]'), C = a.getAttribute("data-ln-upload-size"), L = C ? parseInt(C, 10) : null;
      r.uploadedFiles.set(v, {
        serverId: y || null,
        name: w ? w.textContent.trim() : "",
        size: L !== null && !isNaN(L) ? L : A ? A.textContent.trim() : ""
      });
    }
    const e = this.dom.querySelectorAll('input[type="hidden"]');
    for (let o = 0; o < e.length; o++) {
      const a = e[o];
      if (a.name === r.idsFieldName && a.value && !Array.from(r.uploadedFiles.values()).some(function(v) {
        return String(v.serverId) === String(a.value);
      })) {
        const v = "file-" + ++r.fileIdCounter;
        r.uploadedFiles.set(v, {
          serverId: a.value,
          name: "",
          size: ""
        });
      }
    }
    this._syncHiddenInputs();
  }, m.prototype._syncHiddenInputs = function() {
    const r = this, s = this.dom.querySelectorAll('input[type="hidden"]');
    for (let e = 0; e < s.length; e++)
      s[e].name === r.idsFieldName && s[e].remove();
    for (const [, e] of this.uploadedFiles)
      if (e.serverId) {
        const o = document.createElement("input");
        o.type = "hidden", o.name = r.idsFieldName, o.value = e.serverId, r.dom.appendChild(o);
      }
  }, m.prototype._bindEvents = function() {
    const r = this;
    this._onZoneClick = function(s) {
      r.zone === r.dom && s.target.closest("[data-ln-upload-list], [data-ln-upload-action], input, button, a") || r.input && s.target !== r.input && r.input.click();
    }, this._onInputChange = function() {
      r.input && r.input.files && (r.upload(r.input.files), r.input.value = "");
    }, this._onDragEnter = function(s) {
      s.preventDefault(), s.stopPropagation(), r._dragDepth++, r.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragOver = function(s) {
      s.preventDefault(), s.stopPropagation(), r.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragLeave = function(s) {
      s.preventDefault(), s.stopPropagation(), r._dragDepth--, r._dragDepth <= 0 && (r._dragDepth = 0, r.zone.removeAttribute("data-ln-upload-state"));
    }, this._onDrop = function(s) {
      s.preventDefault(), s.stopPropagation(), r._dragDepth = 0, r.zone.removeAttribute("data-ln-upload-state"), s.dataTransfer && s.dataTransfer.files && r.upload(s.dataTransfer.files);
    }, this._onListClick = function(s) {
      const e = s.target.closest('[data-ln-upload-action="remove"]');
      if (!e || !r.list || !r.list.contains(e) || e.disabled) return;
      const o = e.closest("[data-ln-upload-item]");
      if (o) {
        const a = o.getAttribute("data-ln-upload-local-id");
        a && r.remove(a);
      }
    }, this._onRequestUpload = function(s) {
      s.detail && s.detail.files && r.upload(s.detail.files);
    }, this._onRequestRemove = function(s) {
      if (s.detail) {
        const e = s.detail.localId !== void 0 ? s.detail.localId : s.detail.serverId;
        e !== void 0 && r.remove(e);
      }
    }, this._onRequestClear = function() {
      r.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, m.prototype.upload = function(r) {
    const s = this, e = Array.from(r);
    for (let o = 0; o < e.length; o++) {
      const a = e[o];
      if (s.maxFiles > 0 && s.uploadedFiles.size >= s.maxFiles) {
        S(s.dom, "ln-upload:invalid", {
          file: a,
          reason: "max-files"
        });
        continue;
      }
      if (!hi(a, s.allowedExts)) {
        S(s.dom, "ln-upload:invalid", {
          file: a,
          reason: "accept"
        });
        continue;
      }
      if (s.maxSize > 0 && a.size > s.maxSize) {
        S(s.dom, "ln-upload:invalid", {
          file: a,
          reason: "max-size"
        });
        continue;
      }
      W(s.dom, "ln-upload:before-upload", { file: a }).defaultPrevented || s._uploadSingleFile(a);
    }
  }, m.prototype._uploadSingleFile = function(r) {
    const s = this, e = "file-" + ++s.fileIdCounter, o = mn(r.name);
    let a = null;
    if (this.list) {
      const C = pt(this.dom, "ln-upload-item", "ln-upload");
      if (C && (a = C.firstElementChild, a)) {
        a.setAttribute("data-ln-upload-item", ""), a.setAttribute("data-ln-upload-local-id", e), a.setAttribute("data-ln-upload-ext", o), a.setAttribute("data-ln-upload-state", "uploading"), ot(a, {
          name: r.name,
          sizeText: "0%",
          removeLabel: s.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const L = a.querySelector('[data-ln-upload-action="remove"]');
        L && (L.disabled = !0);
        const q = a.querySelector("[data-ln-progress]");
        q && q.setAttribute("data-ln-progress", "0"), s.list.appendChild(a);
      }
    }
    const y = new FormData();
    y.append(s.fileFieldName, r);
    const v = this.dom.querySelectorAll("input, select, textarea");
    for (let C = 0; C < v.length; C++) {
      const L = v[C];
      !L.name || L.name === s.idsFieldName || L.type === "file" || (L.type === "checkbox" || L.type === "radio") && !L.checked || y.append(L.name, L.value);
    }
    const w = new XMLHttpRequest();
    s.uploadedFiles.set(e, {
      serverId: null,
      name: r.name,
      size: r.size,
      xhr: w
    }), w.upload.addEventListener("progress", function(C) {
      if (C.lengthComputable) {
        const L = Math.round(C.loaded / C.total * 100);
        if (a) {
          const q = a.querySelector("[data-ln-progress]");
          q && q.setAttribute("data-ln-progress", String(L)), ot(a, { sizeText: L + "%" });
        }
        S(s.dom, "ln-upload:progress", {
          localId: e,
          file: r,
          percent: L,
          loaded: C.loaded,
          total: C.total
        });
      }
    }), w.addEventListener("load", function() {
      const C = s.uploadedFiles.get(e);
      if (C && delete C.xhr, w.status >= 200 && w.status < 300) {
        let L;
        try {
          L = JSON.parse(w.responseText);
        } catch (x) {
          A(s.dict.error || "Error", w.status, x);
          return;
        }
        const q = L.id || L.serverId;
        if (a) {
          a.removeAttribute("data-ln-upload-state"), q && a.setAttribute("data-ln-upload-id", String(q)), ot(a, {
            sizeText: g(L.size || r.size, s.locale, s.dict),
            uploading: !1
          });
          const x = a.querySelector('[data-ln-upload-action="remove"]');
          x && (x.disabled = !1);
        }
        C && (C.serverId = q, C.size = L.size || r.size, C.name = L.name || r.name), s._syncHiddenInputs(), S(s.dom, "ln-upload:uploaded", {
          localId: e,
          serverId: q,
          name: L.name || r.name,
          size: L.size || r.size,
          response: L
        });
      } else {
        let L = "";
        try {
          L = JSON.parse(w.responseText).message || "";
        } catch {
        }
        A(L, w.status, null);
      }
    }), w.addEventListener("error", function() {
      const C = s.uploadedFiles.get(e);
      C && delete C.xhr, A("", 0, null);
    });
    function A(C, L, q) {
      if (a) {
        a.setAttribute("data-ln-upload-state", "error"), ot(a, {
          sizeText: s.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const x = a.querySelector('[data-ln-upload-action="remove"]');
        x && (x.disabled = !1);
      }
      S(s.dom, "ln-upload:error", {
        file: r,
        message: C,
        status: L,
        error: q
      });
    }
    s.uploadUrl ? (w.open("POST", s.uploadUrl), w.setRequestHeader("X-CSRF-TOKEN", _()), w.setRequestHeader("X-Requested-With", "XMLHttpRequest"), w.setRequestHeader("Accept", "application/json"), w.send(y)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, m.prototype.remove = function(r) {
    const s = this;
    let e = null, o = null;
    if (s.uploadedFiles.has(r))
      e = r, o = s.uploadedFiles.get(r);
    else
      for (const [w, A] of s.uploadedFiles)
        if (String(A.serverId) === String(r)) {
          e = w, o = A;
          break;
        }
    if (!e || !o || W(s.dom, "ln-upload:before-remove", {
      localId: e,
      serverId: o.serverId
    }).defaultPrevented) return;
    const y = s.list ? s.list.querySelector('[data-ln-upload-local-id="' + e + '"]') : null;
    if (o.xhr && typeof o.xhr.abort == "function" && o.xhr.abort(), !o.serverId) {
      y && y.remove(), s.uploadedFiles.delete(e), s._syncHiddenInputs(), S(s.dom, "ln-upload:removed", { localId: e, serverId: null });
      return;
    }
    let v = null;
    if (s.deleteUrlPattern ? v = s.deleteUrlPattern.replace("{id}", encodeURIComponent(o.serverId)) : s.uploadUrl && s.uploadUrl.includes("{id}") && (v = s.uploadUrl.replace("{id}", encodeURIComponent(o.serverId))), !v) {
      y && y.remove(), s.uploadedFiles.delete(e), s._syncHiddenInputs(), S(s.dom, "ln-upload:removed", { localId: e, serverId: o.serverId });
      return;
    }
    y && (y.setAttribute("data-ln-upload-state", "deleting"), ot(y, { deleting: !0 })), fetch(v, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": _(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(w) {
      w.ok ? (y && y.remove(), s.uploadedFiles.delete(e), s._syncHiddenInputs(), S(s.dom, "ln-upload:removed", {
        localId: e,
        serverId: o.serverId
      })) : (y && (y.removeAttribute("data-ln-upload-state"), ot(y, { deleting: !1 })), S(s.dom, "ln-upload:error", {
        file: o,
        message: "",
        status: w.status
      }));
    }).catch(function(w) {
      y && (y.removeAttribute("data-ln-upload-state"), ot(y, { deleting: !1 })), S(s.dom, "ln-upload:error", {
        file: o,
        message: "",
        status: 0,
        error: w
      });
    });
  }, m.prototype.clear = function() {
    const r = this;
    if (!W(r.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, e] of this.uploadedFiles)
        if (e.xhr && typeof e.xhr.abort == "function" && e.xhr.abort(), e.serverId) {
          let o = null;
          r.deleteUrlPattern ? o = r.deleteUrlPattern.replace("{id}", encodeURIComponent(e.serverId)) : r.uploadUrl && r.uploadUrl.includes("{id}") && (o = r.uploadUrl.replace("{id}", encodeURIComponent(e.serverId))), o && fetch(o, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": _(),
              "X-Requested-With": "XMLHttpRequest",
              Accept: "application/json"
            }
          }).catch(function() {
          });
        }
      r.uploadedFiles.clear(), r.list && (r.list.innerHTML = ""), r._syncHiddenInputs(), S(r.dom, "ln-upload:cleared", {});
    }
  }, m.prototype.getFileIds = function() {
    return Array.from(this.uploadedFiles.values()).map(function(r) {
      return r.serverId;
    }).filter(Boolean);
  }, m.prototype.getFiles = function() {
    return Array.from(this.uploadedFiles.values()).map(function(r) {
      return {
        serverId: r.serverId,
        name: r.name,
        size: r.size
      };
    });
  }, m.prototype.destroy = function() {
    if (this.dom[n]) {
      for (const [, r] of this.uploadedFiles)
        r.xhr && typeof r.xhr.abort == "function" && r.xhr.abort();
      this.zone.removeEventListener("click", this._onZoneClick), this.input && this.input.removeEventListener("change", this._onInputChange), this.zone.removeEventListener("dragenter", this._onDragEnter), this.zone.removeEventListener("dragover", this._onDragOver), this.zone.removeEventListener("dragleave", this._onDragLeave), this.zone.removeEventListener("drop", this._onDrop), this.list && this.list.removeEventListener("click", this._onListClick), this.dom.removeEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.removeEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.removeEventListener("ln-upload:request-clear", this._onRequestClear), this.uploadedFiles.clear(), this.dict = {}, S(this.dom, "ln-upload:destroyed", { target: this.dom }), delete this.dom[n];
    }
  }, M(t, n, m, "ln-upload");
})();
(function() {
  const t = "lnExternalLinks";
  if (window[t] !== void 0) return;
  function n(i) {
    return i.hostname && i.hostname !== window.location.hostname;
  }
  function u(i) {
    if (i.getAttribute("data-ln-external-link") === "processed" || !n(i)) return;
    i.target = "_blank";
    const f = (i.rel || "").split(/\s+/).filter(Boolean);
    f.includes("noopener") || f.push("noopener"), f.includes("noreferrer") || f.push("noreferrer"), i.rel = f.join(" ");
    const h = document.createElement("span");
    h.className = "sr-only", h.textContent = "(opens in new tab)", i.appendChild(h), i.setAttribute("data-ln-external-link", "processed"), S(i, "ln-external-links:processed", {
      link: i,
      href: i.href
    });
  }
  function p(i) {
    i = i || document.body;
    for (const f of i.querySelectorAll("a, area"))
      u(f);
  }
  function l() {
    ct(function() {
      document.body.addEventListener("click", function(i) {
        const f = i.target.closest("a, area");
        f && f.getAttribute("data-ln-external-link") === "processed" && S(f, "ln-external-links:clicked", {
          link: f,
          href: f.href,
          text: f.textContent || f.title || ""
        });
      });
    }, "ln-external-links");
  }
  function d() {
    ct(function() {
      new MutationObserver(function(f) {
        for (const h of f) {
          if (h.type === "childList") {
            for (const b of h.addedNodes)
              if (b.nodeType === 1 && (b.matches && (b.matches("a") || b.matches("area")) && u(b), b.querySelectorAll))
                for (const g of b.querySelectorAll("a, area"))
                  u(g);
          }
          if (h.type === "attributes" && h.attributeName === "href") {
            const b = h.target;
            b.matches && (b.matches("a") || b.matches("area")) && u(b);
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
  function c() {
    l(), d(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      p();
    }) : p();
  }
  window[t] = {
    process: p
  }, c();
})();
(function() {
  const t = "data-ln-link", n = "lnLink";
  if (window[n] !== void 0) return;
  let u = null;
  function p() {
    u = document.createElement("div"), u.className = "ln-link-status", document.body.appendChild(u);
  }
  function l(o) {
    u && (u.textContent = o, u.classList.add("ln-link-status--visible"));
  }
  function d() {
    u && u.classList.remove("ln-link-status--visible");
  }
  function c(o, a) {
    if (a.target.closest("a, button, input, select, textarea")) return;
    const y = o.querySelector("a");
    if (!y) return;
    const v = y.getAttribute("href");
    if (!v) return;
    if (a.ctrlKey || a.metaKey || a.button === 1) {
      window.open(v, "_blank", "noopener,noreferrer");
      return;
    }
    W(o, "ln-link:navigate", { target: o, href: v, link: y }).defaultPrevented || y.click();
  }
  function i(o) {
    const a = o.querySelector("a");
    if (!a) return;
    const y = a.getAttribute("href");
    y && l(y);
  }
  function f() {
    d();
  }
  function h(o) {
    o[n + "Row"] || !o.querySelector("a") || (o[n + "Row"] = !0, o._lnLinkClick = function(y) {
      c(o, y);
    }, o._lnLinkEnter = function() {
      i(o);
    }, o.addEventListener("click", o._lnLinkClick), o.addEventListener("mouseenter", o._lnLinkEnter), o.addEventListener("mouseleave", f));
  }
  function b(o) {
    o[n + "Row"] && (o._lnLinkClick && o.removeEventListener("click", o._lnLinkClick), o._lnLinkEnter && o.removeEventListener("mouseenter", o._lnLinkEnter), o.removeEventListener("mouseleave", f), delete o._lnLinkClick, delete o._lnLinkEnter, delete o[n + "Row"]);
  }
  function g(o) {
    if (!o[n + "Init"]) return;
    const a = o.tagName;
    if (a === "TABLE" || a === "TBODY") {
      const y = a === "TABLE" && o.querySelector("tbody") || o;
      for (const v of y.querySelectorAll("tr"))
        b(v);
    } else
      b(o);
    delete o[n + "Init"];
  }
  function _(o) {
    if (o[n + "Init"]) return;
    o[n + "Init"] = !0;
    const a = o.tagName;
    if (a === "TABLE" || a === "TBODY") {
      const y = a === "TABLE" && o.querySelector("tbody") || o;
      for (const v of y.querySelectorAll("tr"))
        h(v);
    } else
      h(o);
  }
  function m(o) {
    o.hasAttribute && o.hasAttribute(t) && _(o);
    const a = o.querySelectorAll ? o.querySelectorAll("[" + t + "]") : [];
    for (const y of a)
      _(y);
  }
  function r() {
    ct(function() {
      new MutationObserver(function(a) {
        for (const y of a)
          if (y.type === "childList") {
            for (const v of y.addedNodes)
              if (v.nodeType === 1) {
                m(v);
                const w = v.closest("[" + t + "]");
                if (w)
                  if (v.tagName === "TR")
                    h(v);
                  else {
                    const A = w.tagName;
                    if (A === "TABLE" || A === "TBODY") {
                      const C = v.querySelectorAll ? v.querySelectorAll("tr") : [];
                      for (const L of C)
                        h(L);
                    }
                  }
              }
          } else y.type === "attributes" && (y.target.hasAttribute && y.target.hasAttribute(t) ? m(y.target) : g(y.target));
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [t]
      });
    }, "ln-link");
  }
  function s(o) {
    m(o);
  }
  window[n] = { init: s, destroy: g };
  function e() {
    p(), r(), s(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", e) : e();
})();
const xt = ["Ctrl", "Alt", "Shift", "Meta"], pi = {
  alt: "Alt",
  control: "Ctrl",
  ctrl: "Ctrl",
  meta: "Meta",
  command: "Meta",
  cmd: "Meta",
  option: "Alt",
  shift: "Shift",
  esc: "Escape",
  escape: "Escape",
  space: "Space",
  spacebar: "Space",
  enter: "Enter",
  return: "Enter",
  tab: "Tab",
  backspace: "Backspace",
  delete: "Delete",
  del: "Delete",
  insert: "Insert",
  home: "Home",
  end: "End",
  pageup: "PageUp",
  pagedown: "PageDown",
  arrowup: "ArrowUp",
  up: "ArrowUp",
  arrowdown: "ArrowDown",
  down: "ArrowDown",
  arrowleft: "ArrowLeft",
  left: "ArrowLeft",
  arrowright: "ArrowRight",
  right: "ArrowRight"
};
function gn(t) {
  if (t === " ") return "Space";
  const n = String(t || "").trim();
  if (!n) return "";
  const u = pi[n.toLowerCase()];
  return u || (n.length === 1 || /^f\d{1,2}$/i.test(n) ? n.toUpperCase() : n.charAt(0).toUpperCase() + n.slice(1));
}
function _n(t) {
  const n = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!n) return "";
  const u = n.split("+"), p = /* @__PURE__ */ new Set();
  let l = "";
  for (let c = 0; c < u.length; c++) {
    const i = gn(u[c]);
    if (!i) return "";
    if (xt.indexOf(i) !== -1) {
      p.add(i);
      continue;
    }
    if (l) return "";
    l = i;
  }
  if (!l) return "";
  const d = [];
  for (let c = 0; c < xt.length; c++)
    p.has(xt[c]) && d.push(xt[c]);
  return d.push(l), d.join("+");
}
function mi(t) {
  const n = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!n) return [];
  const u = n.split(/[\s,]+/), p = [];
  for (let l = 0; l < u.length; l++) {
    const d = _n(u[l]);
    d && p.indexOf(d) === -1 && p.push(d);
  }
  return p;
}
function gi(t, n) {
  const u = String(n || "").trim();
  if (!u || /[\s,]/.test(u)) return "";
  const p = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(p) ? "" : _n(p ? p + "+" + u : u);
}
function _i(t) {
  if (!t) return "";
  const n = gn(t.key);
  if (!n || xt.indexOf(n) !== -1) return "";
  const u = [];
  return t.ctrlKey && u.push("Ctrl"), t.altKey && u.push("Alt"), t.shiftKey && u.push("Shift"), t.metaKey && u.push("Meta"), u.push(n), u.join("+");
}
function bi(t) {
  if (!t || !t.tagName) return null;
  const n = String(t.tagName).toLowerCase();
  if (n === "button" || n === "a" && t.hasAttribute && t.hasAttribute("href")) return "click";
  if (n === "input" || n === "textarea" || n === "select" || t.isContentEditable) return "focus";
  if (t.hasAttribute && t.hasAttribute("contenteditable")) {
    const u = t.getAttribute("contenteditable");
    if (u === "" || String(u).toLowerCase() !== "false") return "focus";
  }
  return null;
}
function yi(t, n, u, p) {
  if (!t || !n || u !== "click" || t.target !== n || t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) return !1;
  const l = String(n.tagName || "").toLowerCase();
  return l === "button" ? p === "Enter" || p === "Space" : l === "a" && n.hasAttribute && n.hasAttribute("href") && p === "Enter";
}
(function() {
  const t = "data-ln-key", n = "lnKey", u = "data-ln-key-target", p = "data-ln-key-allow-input", l = "data-ln-key-modifier", d = "data-ln-key-for", c = "lnKeyFor";
  if (window[n] !== void 0) return;
  const i = /* @__PURE__ */ new Set();
  let f = null;
  function h() {
    f || (f = function(r) {
      if (r.defaultPrevented || r.isComposing || r.repeat) return;
      const s = _i(r);
      if (!s) return;
      const e = Mn(r.target), o = document.querySelectorAll("[" + t + "], [" + d + "]");
      let a = null, y = !1, v = !1;
      for (let C = 0; C < o.length; C++) {
        const L = o[C], q = L[n] || L[c];
        if (!q || !q.matches(s) || e && !q.allowsInput()) continue;
        const x = q.resolveTarget(), D = bi(x);
        if (!(!D || !Fn(x, D))) {
          if (yi(r, x, D, s)) {
            v = !0;
            continue;
          }
          a ? y = !0 : a = { host: L, target: x, action: D };
        }
      }
      if (v || !a) return;
      y && console.warn('[ln-key] Duplicate active shortcut "' + s + '"; first DOM match wins.');
      const w = {
        source: a.host,
        target: a.target,
        action: a.action,
        key: s,
        event: r
      };
      W(a.host, "ln-key:before-trigger", w).defaultPrevented || (r.preventDefault(), a.target[a.action](), S(a.host, "ln-key:trigger", w));
    }, document.addEventListener("keydown", f));
  }
  function b() {
    i.size > 0 || !f || (document.removeEventListener("keydown", f), f = null);
  }
  function g(r) {
    return this.dom = r, this.shortcuts = [], i.add(this), this.sync(), h(), this;
  }
  g.prototype.sync = function() {
    this.shortcuts = mi(this.dom.getAttribute(t));
  }, g.prototype.matches = function(r) {
    return this.shortcuts.indexOf(r) !== -1;
  }, g.prototype.allowsInput = function() {
    return this.dom.hasAttribute(p);
  }, g.prototype.resolveTarget = function() {
    const r = this.dom.getAttribute(u);
    return r ? m(r, u) : this.dom;
  }, g.prototype.destroy = function() {
    this.dom[n] && (i.delete(this), delete this.dom[n], b(), S(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function _(r) {
    return this.dom = r, i.add(this), h(), this;
  }
  _.prototype._modifierContext = function() {
    return this.dom.closest("[" + l + "]");
  }, _.prototype.shortcut = function() {
    const r = this._modifierContext(), s = r ? r.getAttribute(l) : "";
    return gi(s, this.dom.textContent);
  }, _.prototype.matches = function(r) {
    return this.shortcut() === r;
  }, _.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(p)) return !0;
    const r = this._modifierContext();
    return !!(r && r.hasAttribute(p));
  }, _.prototype.resolveTarget = function() {
    return m(this.dom.getAttribute(d), d);
  }, _.prototype.destroy = function() {
    this.dom[c] && (i.delete(this), delete this.dom[c], b(), S(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function m(r, s) {
    if (!r) return null;
    try {
      const e = document.querySelector(r);
      return e || console.warn("[ln-key] Target not found for " + s + ' selector "' + r + '".'), e;
    } catch {
      return console.warn("[ln-key] Invalid " + s + ' selector "' + r + '".'), null;
    }
  }
  M(t, n, g, "ln-key", {
    extraAttributes: [u, p],
    onAttributeChange: function(r) {
      const s = r[n];
      if (s) {
        if (!r.hasAttribute(t)) {
          s.destroy();
          return;
        }
        s.sync();
      }
    }
  }), M(d, c, _, "ln-key-for", {
    onAttributeChange: function(r) {
      const s = r[c];
      s && !r.hasAttribute(d) && s.destroy();
    }
  });
})();
function vi(t, n, u = 100) {
  if (n != null && n !== "") {
    const p = parseFloat(String(n));
    if (!isNaN(p) && p > 0) return p;
  }
  if (t != null && t !== "") {
    const p = parseFloat(String(t));
    if (!isNaN(p) && p > 0) return p;
  }
  return u;
}
(function() {
  const t = "[data-ln-progress]", n = "lnProgress";
  if (window[n] !== void 0) return;
  function u(d) {
    return this.dom = d, this._parentObserver = null, l.call(this), p.call(this), this;
  }
  u.prototype.destroy = function() {
    this.dom[n] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[n]);
  };
  function p() {
    const d = this, c = this.dom.parentElement;
    if (!c) return;
    const i = new MutationObserver(function(f) {
      for (const h of f)
        h.attributeName === "data-ln-progress-max" && l.call(d);
    });
    i.observe(c, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = i;
  }
  function l() {
    const d = this.dom.getAttribute("data-ln-progress"), c = this.dom.parentElement, i = c ? c.getAttribute("data-ln-progress-max") : null, f = this.dom.getAttribute("data-ln-progress-max"), h = vi(f, i, 100), b = en(d, h);
    this.dom.style.width = b.percentage + "%", this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(b.min)), this.dom.setAttribute("aria-valuemax", String(b.max)), this.dom.setAttribute("aria-valuenow", String(b.clampedValue)), S(this.dom, "ln-progress:change", {
      target: this.dom,
      value: b.value,
      max: b.max,
      percentage: b.percentage
    });
  }
  M(
    t,
    n,
    u,
    "ln-progress",
    {
      extraAttributes: ["data-ln-progress-max"],
      onAttributeChange: function(d) {
        const c = d[n];
        c && l.call(c);
      }
    }
  );
})();
function wi(t, n) {
  if (!Array.isArray(t) || !Array.isArray(n)) return t !== n;
  if (t.length !== n.length) return !0;
  for (let u = 0; u < t.length; u++)
    if (t[u] !== n[u]) return !0;
  return !1;
}
function Ei(t, n) {
  if (!n || typeof n != "object") return !0;
  const u = Object.keys(n);
  if (u.length === 0) return !0;
  for (let p = 0; p < u.length; p++) {
    const l = n[u[p]], d = t[l.col] || "";
    if (!ge(d, l.values))
      return !1;
  }
  return !0;
}
function Ai(t) {
  if (!Array.isArray(t)) return { key: null, values: [] };
  let n = null;
  const u = [];
  for (let p = 0; p < t.length; p++) {
    const l = t[p];
    !n && l.key && (n = l.key), l.checked && !l.isReset && l.value && u.push(l.value);
  }
  return { key: n, values: u };
}
(function() {
  const t = "data-ln-filter", n = "lnFilter", u = "data-ln-filter-key", p = "data-ln-filter-value", l = "data-ln-filter-hide", d = "data-ln-filter-reset", c = "data-ln-filter-col", i = "data-ln-hash", f = /* @__PURE__ */ new WeakMap();
  if (window[n] !== void 0) return;
  function h(r) {
    return r.hasAttribute(d) || !r.getAttribute(p);
  }
  function b(r) {
    const s = r.dom.querySelectorAll("[" + u + "]"), e = [];
    for (let a = 0; a < s.length; a++) {
      const y = s[a];
      e.push({
        key: y.getAttribute(u),
        value: y.getAttribute(p) || "",
        checked: y.checked,
        isReset: h(y)
      });
    }
    const o = Ai(e);
    return { key: o.key, values: o.values, targetId: r.targetId };
  }
  function g(r, s, e) {
    const o = r.querySelectorAll("[" + u + "]"), a = Array.isArray(e) && e.length > 0;
    for (let y = 0; y < o.length; y++) {
      const v = o[y];
      h(v) ? v.checked = !a : a && v.getAttribute(u) === s && e.indexOf(v.getAttribute(p)) !== -1 ? v.checked = !0 : v.checked = !1;
    }
  }
  function _(r) {
    this.dom = r, this.targetId = r.getAttribute(t);
    const s = r.getAttribute(c);
    this.colIndex = s !== null ? parseInt(s, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = yt(r, "filter"), this.hashEnabled = !!this.nsKey;
    const e = this, o = pe(function() {
      e._render();
    });
    this._queueRender = o, this._attachHandlers(), this._onHashChange = function() {
      if (e._destroyed || !e.hashEnabled) return;
      const y = X(e.nsKey), v = re(y);
      v && v.key && v.values.length > 0 ? g(e.dom, v.key, v.values) : g(e.dom, null, []), e._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let a = !1;
    if (this.hashEnabled) {
      const y = X(this.nsKey), v = re(y);
      v && v.key && v.values.length > 0 && (g(r, v.key, v.values), it(function() {
        e._destroyed || e._render();
      }), a = !0);
    }
    if (!a && r.hasAttribute("data-ln-persist")) {
      const y = Gt("filter", r);
      y && y.key && Array.isArray(y.values) && y.values.length > 0 && (g(r, y.key, y.values), it(function() {
        e._destroyed || e._render();
      }), a = !0);
    }
    if (!a) {
      const y = r.querySelectorAll("[" + u + "]");
      for (let v = 0; v < y.length; v++)
        if (y[v].checked && !h(y[v])) {
          it(function() {
            e._destroyed || e._render();
          });
          break;
        }
    }
    return this;
  }
  _.prototype._attachHandlers = function() {
    const r = this;
    this._onDomChange = function(s) {
      const e = s.target;
      if (!e || !e.hasAttribute || !e.hasAttribute(u)) return;
      const o = Array.from(r.dom.querySelectorAll("[" + u + "]"));
      if (h(e)) {
        for (let a = 0; a < o.length; a++)
          h(o[a]) || (o[a].checked = !1);
        e.checked = !0, r._queueRender();
        return;
      }
      if (e.checked) {
        for (let y = 0; y < o.length; y++)
          h(o[y]) && (o[y].checked = !1);
        let a = !1;
        for (let y = 0; y < o.length; y++)
          if (h(o[y])) {
            a = !0;
            break;
          }
        if (a) {
          let y = !0;
          for (let v = 0; v < o.length; v++)
            if (!h(o[v]) && !o[v].checked) {
              y = !1;
              break;
            }
          if (y)
            for (let v = 0; v < o.length; v++)
              h(o[v]) ? o[v].checked = !0 : o[v].checked = !1;
        }
      } else {
        let a = !1;
        for (let y = 0; y < o.length; y++)
          if (!h(o[y]) && o[y].checked) {
            a = !0;
            break;
          }
        if (!a)
          for (let y = 0; y < o.length; y++)
            h(o[y]) && (o[y].checked = !0);
      }
      r._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, _.prototype._render = function() {
    const r = this, s = b(this), e = this._lastSnapshot;
    if (!(!e || e.key !== s.key || wi(e.values, s.values))) return;
    const a = s.key === null || s.values.length === 0, y = document.getElementById(r.targetId), v = {
      key: s.key,
      values: s.values.slice(),
      targetId: r.targetId
    };
    S(r.dom, "ln-filter:change", v);
    let w = !1;
    y && y !== r.dom && W(y, "ln-filter:change", v).defaultPrevented && (w = !0);
    const A = e && e.values.length > 0, C = s.values.length === 0;
    if (A && C) {
      const L = { targetId: r.targetId };
      S(r.dom, "ln-filter:reset", L), y && y !== r.dom && S(y, "ln-filter:reset", L);
    }
    if (this._lastSnapshot = { key: s.key, values: s.values.slice() }, this.dom.hasAttribute("data-ln-persist") && (s.key && s.values.length > 0 ? bt("filter", this.dom, { key: s.key, values: s.values.slice() }) : bt("filter", this.dom, null)), this.hashEnabled) {
      const L = tn(s.key, s.values);
      et(this.nsKey, L);
    }
    if (!w)
      if (r.colIndex !== null)
        r._filterTableRows(s);
      else {
        if (!y) return;
        const L = y.children;
        for (let q = 0; q < L.length; q++) {
          const x = L[q];
          if (x.removeAttribute(l), a) continue;
          const D = x.getAttribute("data-" + s.key);
          D !== null && (ge(D, s.values) || x.setAttribute(l, "true"));
        }
      }
  }, _.prototype._filterTableRows = function(r) {
    const s = document.getElementById(this.targetId);
    if (!s) return;
    const e = s.tagName === "TABLE" ? s : s.querySelector("table");
    if (!e) return;
    const o = r.key || this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex, a = r.values;
    f.has(e) || f.set(e, {});
    const y = f.get(e);
    o && a.length > 0 ? y[o] = { col: this.colIndex, values: a.slice() } : o && delete y[o];
    const v = e.tBodies;
    for (let w = 0; w < v.length; w++) {
      const A = v[w].rows;
      for (let C = 0; C < A.length; C++) {
        const L = A[C], q = {};
        for (let x = 0; x < L.cells.length; x++)
          q[x] = L.cells[x].textContent.trim();
        Ei(q, y) ? L.removeAttribute(l) : L.setAttribute(l, "true");
      }
    }
  }, _.prototype.destroy = function() {
    if (this.dom[n]) {
      if (this._destroyed = !0, this.colIndex !== null) {
        const r = document.getElementById(this.targetId);
        if (r) {
          const s = r.tagName === "TABLE" ? r : r.querySelector("table");
          if (s && f.has(s)) {
            const e = f.get(s), o = this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex;
            o && e[o] && delete e[o], Object.keys(e).length === 0 && f.delete(s);
          }
        }
      }
      this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[n];
    }
  };
  function m(r, s) {
    const e = r[n];
    !e || e._destroyed || s === i && (e.hashEnabled && e._onHashChange && window.removeEventListener("hashchange", e._onHashChange), e.nsKey = yt(r, "filter"), e.hashEnabled = !!e.nsKey, e.hashEnabled && window.addEventListener("hashchange", e._onHashChange));
  }
  M(t, n, _, "ln-filter", {
    extraAttributes: [i],
    onAttributeChange: m
  });
})();
(function() {
  const t = "data-ln-search", n = "lnSearch", u = "data-ln-search-for", p = "lnSearchControl", l = "data-ln-search-items", d = "data-ln-search-fields", c = "data-ln-search-exclude", i = "data-ln-search-hide", f = "data-ln-hash";
  if (window[n] !== void 0) return;
  function h(a) {
    const y = yt(a, "search");
    if (y) return y;
    if (a.id) {
      const v = document.querySelector("[" + u + '="' + a.id + '"]');
      if (v) {
        const w = yt(v, "search");
        if (w) return w;
      }
    }
    return null;
  }
  function b(a) {
    return a.matches("input, textarea") ? a : a.querySelector("input, textarea");
  }
  function g(a, y) {
    const v = a.childNodes;
    for (let w = 0; w < v.length; w++) {
      const A = v[w];
      if (A.nodeType === 3) {
        y.push(A.nodeValue);
        continue;
      }
      A.nodeType === 1 && (A.hasAttribute(c) || g(A, y));
    }
  }
  function _(a) {
    if (a._lnSearchText !== void 0) return a._lnSearchText;
    const y = [];
    g(a, y);
    const v = Gn(y);
    return a._lnSearchText = v, v;
  }
  function m(a, y) {
    if (!a.id) return;
    const v = document.querySelectorAll("[" + u + '="' + a.id + '"]');
    for (const w of v) {
      const A = b(w);
      A && A.value !== y && (A.value = y);
    }
  }
  function r(a) {
    this.dom = a, this.term = a.getAttribute(t) || "", this._destroyed = !1;
    const y = this;
    return this.nsKey = h(a), this.hashEnabled = !!this.nsKey, this._onHashChange = function() {
      if (y._destroyed || !y.hashEnabled) return;
      const v = X(y.nsKey), w = y.dom.getAttribute(t) || "";
      v !== null && v !== w ? y.dom.setAttribute(t, v) : v === null && w !== "" && y.dom.setAttribute(t, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), it(function() {
      if (!y._destroyed) {
        if (y.hashEnabled) {
          const v = X(y.nsKey);
          if (v !== null && v !== y.term) {
            y.term = v, y.dom.setAttribute(t, v), m(y.dom, v), y._apply();
            return;
          }
        }
        se(y.term) && (m(y.dom, y.term), y._apply());
      }
    }), this;
  }
  r.prototype._apply = function() {
    const a = this.dom, y = se(this.term), v = rn(y);
    this.hashEnabled && et(this.nsKey, this.term ? this.term : null);
    const w = Wn(a.getAttribute(d));
    if (W(a, "ln-search:change", {
      term: y,
      tokens: v,
      targetId: a.id,
      fields: w
    }).defaultPrevented) return;
    const C = a.getAttribute(l), L = C ? a.querySelectorAll(C) : a.children;
    for (let q = 0; q < L.length; q++) {
      const x = L[q];
      if (x.removeAttribute(i), x.hasAttribute(c) || v.length === 0) continue;
      const D = _(x);
      on(D, v) || x.setAttribute(i, "true");
    }
  }, r.prototype.destroy = function() {
    this.dom[n] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[n]);
  };
  function s(a) {
    if (this.dom = a, this.targetId = a.getAttribute(u), this.input = b(a), this._attachHandler(), this.input && this.input.value.trim()) {
      const y = this;
      it(function() {
        const v = document.getElementById(y.targetId);
        v && ((v.getAttribute(t) || "").trim() || y._write(y.input.value));
      });
    }
    return this;
  }
  s.prototype._write = function(a) {
    const y = document.getElementById(this.targetId);
    y && y.getAttribute(t) !== a && y.setAttribute(t, a);
  }, s.prototype._attachHandler = function() {
    if (!this.input) return;
    const a = this;
    this._onInput = function() {
      a._write(a.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, s.prototype.destroy = function() {
    this.dom[p] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[p]);
  };
  function e(a) {
    const y = a.getAttribute("data-ln-search-clear-for");
    if (y) {
      const L = document.getElementById(y), q = document.querySelector("[" + u + '="' + y + '"]'), x = q ? b(q) : null;
      return { target: L, input: x };
    }
    const v = a.closest("[" + t + "]");
    if (v) {
      const L = v.id ? document.querySelector("[" + u + '="' + v.id + '"]') : null, q = L ? b(L) : null;
      return { target: v, input: q };
    }
    const w = a.closest("[data-ln-table-source], [data-ln-list-source]");
    if (w) {
      const L = w.getAttribute("data-ln-table-source") || w.getAttribute("data-ln-list-source"), q = L ? document.getElementById(L) : null;
      if (q && q.hasAttribute(t)) {
        const x = document.querySelector("[" + u + '="' + L + '"]'), D = x ? b(x) : null;
        return { target: q, input: D };
      }
    }
    const A = a.closest("[" + u + "]");
    if (A) {
      const L = A.getAttribute(u), q = L ? document.getElementById(L) : null, x = b(A);
      return { target: q, input: x };
    }
    const C = a.parentElement;
    if (C) {
      const L = C.querySelector("[" + u + "]");
      if (L) {
        const q = L.getAttribute(u), x = q ? document.getElementById(q) : null, D = b(L);
        return { target: x, input: D };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(a) {
    const y = a.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!y) return;
    const v = e(y);
    !v.target && !v.input || (a.preventDefault(), v.input && (v.input.value = "", v.input.focus()), v.target && v.target.setAttribute(t, ""));
  });
  function o(a, y) {
    const v = a[n];
    if (!v || v._destroyed) return;
    if (y === f) {
      v._onHashChange && window.removeEventListener("hashchange", v._onHashChange), v.nsKey = h(a), v.hashEnabled = !!v.nsKey, v.hashEnabled && window.addEventListener("hashchange", v._onHashChange);
      return;
    }
    const w = a.getAttribute(t) || "";
    w !== v.term && (v.term = w, m(a, w), v._apply());
  }
  M(t, n, r, "ln-search", {
    extraAttributes: [f],
    onAttributeChange: o,
    onSubtreeChange: function(a, y) {
      const v = y.target;
      v && v._lnSearchText !== void 0 && delete v._lnSearchText, v && v.parentElement && v.parentElement._lnSearchText !== void 0 && delete v.parentElement._lnSearchText;
    }
  }), M(u, p, s, "ln-search-control");
})();
function ht(t) {
  const n = String(t || "").trim().toLowerCase();
  return n === "asc" || n === "ascending" ? "asc" : n === "desc" || n === "descending" ? "desc" : "none";
}
function Si(t) {
  const n = ht(t);
  return n === "asc" ? "ascending" : n === "desc" ? "descending" : "none";
}
function Ci(t, n) {
  return !t || !n ? !1 : t.field !== null && t.field !== void 0 && n.field !== null && n.field !== void 0 ? t.field === n.field : t.column !== null && t.column !== void 0 && n.column !== null && n.column !== void 0 ? String(t.column) === String(n.column) : !1;
}
function Li(t, n, u, p) {
  const l = ht(t);
  if (l === "none") return () => 0;
  const d = l === "desc" ? -1 : 1, c = typeof p == "function" ? p : (i) => i;
  return function(i, f) {
    const h = c(i), b = c(f);
    return he(h, b, n, u) * d;
  };
}
(function() {
  const t = "data-ln-sort", n = "lnSort", u = "data-ln-sort-field", p = "data-ln-sort-state", l = "data-ln-sort-dir", d = "data-ln-sort-items", c = "data-ln-hash";
  if (window[n] !== void 0) return;
  const i = /* @__PURE__ */ new WeakMap();
  function f(g, _) {
    if (_) {
      const m = g.querySelector('[data-ln-field="' + _ + '"]');
      if (m) return At(m);
    }
    return At(g);
  }
  function h(g) {
    this.dom = g, this.targetId = g.getAttribute(t), this.field = g.getAttribute(u) || null;
    const _ = g.closest("th");
    this.column = !this.field && _ ? _.cellIndex : null, this.itemsSelector = g.getAttribute(d) || null, this._state = ht(g.getAttribute(p)), this._destroyed = !1, this.nsKey = yt(g, "sort"), this.hashEnabled = !!this.nsKey;
    const m = this;
    this._onClick = function(s) {
      const e = s.target.closest("[" + l + "]");
      if (!e) return;
      const o = ht(e.getAttribute(l));
      m._apply(o);
    }, g.addEventListener("click", this._onClick), this._onSortChange = function(s) {
      if (m._destroyed || !s.detail) return;
      const e = m._resolveTarget();
      if (!(e && (s.target === e || e.contains(s.target)) || s.detail.targetId && s.detail.targetId === m.targetId)) return;
      if (Ci(
        { field: m.field, column: m.column },
        { field: s.detail.field, column: s.detail.column }
      )) {
        const y = ht(s.detail.direction);
        y && g.getAttribute(p) !== y && (m._state = y, g.setAttribute(p, y), m._updateAriaSort(y));
        return;
      }
      g.getAttribute(p) !== "none" && (m._state = "none", g.setAttribute(p, "none"), m._updateAriaSort("none")), g.hasAttribute("data-ln-persist") && bt("sort", g, null);
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (m._destroyed || !m.hashEnabled) return;
      const s = X(m.nsKey), e = ie(s);
      if (e)
        m.field !== null && e.fieldOrColumn === m.field || m.column !== null && String(m.column) === e.fieldOrColumn ? m._state !== e.direction && m._apply(e.direction, !0) : m._state !== "none" && (m._state = "none", g.setAttribute(p, "none"), m._updateAriaSort("none"));
      else if (m._state !== "none") {
        m._state = "none", g.setAttribute(p, "none"), m._updateAriaSort("none");
        const o = m._resolveTarget();
        o && (W(o, "ln-sort:change", {
          field: m.field,
          column: m.column,
          direction: "none",
          targetId: m.targetId
        }).defaultPrevented || m._defaultSort(o, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let r = !1;
    if (this.hashEnabled) {
      const s = X(this.nsKey), e = ie(s);
      e && ((m.field !== null && e.fieldOrColumn === m.field || m.column !== null && String(m.column) === e.fieldOrColumn) && it(function() {
        m._destroyed || m._apply(e.direction, !0);
      }), r = !0);
    }
    if (!r && g.hasAttribute("data-ln-persist")) {
      const s = Gt("sort", g);
      s && s.direction && s.direction !== "none" && it(function() {
        m._destroyed || m._apply(s.direction, !0);
      }), r = !0;
    }
    if (!r) {
      const s = ht(g.getAttribute(p));
      s && s !== "none" && it(function() {
        m._destroyed || m._apply(s, !0);
      });
    }
    return this;
  }
  h.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, h.prototype._updateAriaSort = function(g) {
    const _ = this.dom.closest("th");
    _ && _.setAttribute("aria-sort", Si(g));
  }, h.prototype._apply = function(g, _) {
    if (this._destroyed) return;
    const m = ht(g);
    this._state = m, this.dom.getAttribute(p) !== m && this.dom.setAttribute(p, m), this._updateAriaSort(m);
    const r = this._resolveTarget();
    if (!r) return;
    const s = {
      field: this.field,
      column: this.column,
      direction: m,
      targetId: this.targetId
    };
    if (!_ && (this.dom.hasAttribute("data-ln-persist") && bt("sort", this.dom, m === "none" ? null : s), this.hashEnabled)) {
      const o = Ze(this.field !== null ? this.field : this.column, m);
      et(this.nsKey, o);
    }
    W(r, "ln-sort:change", s).defaultPrevented || this._defaultSort(r, m);
  }, h.prototype._defaultSort = function(g, _) {
    const m = this.itemsSelector ? Array.from(g.querySelectorAll(this.itemsSelector)) : Array.from(g.children);
    if (!m.length) return;
    const r = m[0].parentNode;
    i.has(g) || i.set(g, m.slice());
    let s;
    if (_ === "none")
      s = (i.get(g) || m).filter(function(a) {
        return a.parentNode === r;
      });
    else {
      const o = this.field, a = m.map(function(A) {
        return f(A, o);
      }), y = ue(a), v = typeof Intl < "u" ? new Intl.Collator(V(this.dom), { sensitivity: "base" }) : null, w = Li(_, y, v, function(A) {
        return f(A, o);
      });
      s = m.slice().sort(w);
    }
    const e = document.createDocumentFragment();
    for (let o = 0; o < s.length; o++) e.appendChild(s[o]);
    r.appendChild(e);
  }, h.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[n]);
  };
  function b(g, _) {
    const m = g[n];
    if (!(!m || m._destroyed))
      if (_ === u) {
        m.field = g.getAttribute(u) || null;
        const r = g.closest("th");
        m.column = !m.field && r ? r.cellIndex : null;
      } else if (_ === d)
        m.itemsSelector = g.getAttribute(d) || null;
      else if (_ === p) {
        const r = ht(g.getAttribute(p));
        r !== m._state && m._apply(r);
      } else _ === t ? m.targetId = g.getAttribute(t) : _ === c && (m.hashEnabled && m._onHashChange && window.removeEventListener("hashchange", m._onHashChange), m.nsKey = yt(g, "sort"), m.hashEnabled = !!m.nsKey, m.hashEnabled && window.addEventListener("hashchange", m._onHashChange));
  }
  M(t, n, h, "ln-sort", {
    extraAttributes: [u, d, p, c],
    onAttributeChange: b
  });
})();
function Ie(t, n, u, p, l = 15) {
  if (p <= 0 || u <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const d = Math.max(0, t || 0), c = Math.max(0, n || 0), i = Math.floor(d / u), f = Math.ceil(c / u), h = Math.max(0, i - l), b = Math.min(p, i + f + l), g = h * u, _ = Math.max(0, (p - b) * u);
  return { start: h, end: b, topPadding: g, bottomPadding: _ };
}
function Ti(t, n) {
  const u = Array.isArray(t) ? t.length : 0, p = n instanceof Set ? n : new Set(n || []);
  let l = 0;
  if (Array.isArray(t))
    for (let i = 0; i < t.length; i++)
      p.has(t[i]) && l++;
  else
    l = p.size;
  const d = u > 0 && l === u, c = l > 0 && l < u;
  return { totalCount: u, selectedCount: l, isAllSelected: d, isIndeterminate: c };
}
function De(t, n, u) {
  const p = new Set(t);
  return n == null || ((u !== void 0 ? u : !p.has(n)) ? p.add(n) : p.delete(n)), p;
}
function Re(t, n, u) {
  const p = new Set(t);
  if (!Array.isArray(n)) return p;
  if (u)
    for (let l = 0; l < n.length; l++)
      n[l] != null && p.add(n[l]);
  else
    for (let l = 0; l < n.length; l++)
      p.delete(n[l]);
  return p;
}
(function() {
  const t = "data-ln-table", n = "lnTable", u = "data-ln-table-empty";
  if (window[n] !== void 0) return;
  typeof Intl < "u" && new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" });
  function f(g, _) {
    if (g == null || isNaN(g)) return "";
    try {
      return new Intl.NumberFormat(V(_)).format(g);
    } catch {
      return String(g);
    }
  }
  function h(g) {
    let _ = g.parentElement;
    for (; _ && _ !== document.body && _ !== document.documentElement; ) {
      const r = getComputedStyle(_).overflowY;
      if (r === "auto" || r === "scroll") return _;
      _ = _.parentElement;
    }
    return null;
  }
  function b(g) {
    this.dom = g, this.table = g.querySelector("table"), this.tbody = g.querySelector("[data-ln-table-body]") || g.querySelector("tbody"), this.thead = g.querySelector("thead");
    const _ = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = _ ? Array.from(_.querySelectorAll("th")) : [], this._totalSpan = g.querySelector("[data-ln-table-total]"), this._filteredSpan = g.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== g ? this._filteredSpan.parentElement : null), this._selectedSpan = g.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== g ? this._selectedSpan.parentElement : null), this.isDataDriven = g.hasAttribute("data-ln-table-source"), this.name = g.getAttribute(t) || "", this.source = g.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const m = this;
    return this._onSetSearch = function(r) {
      const s = (r.detail && r.detail.query != null ? r.detail.query : r.detail && r.detail.term != null ? r.detail.term : "").trim();
      m.isDataDriven ? (m.currentSearch = s, S(g, "ln-table:search", {
        table: m.name,
        query: m.currentSearch
      }), m._requestData()) : (m._searchTerm = s.toLowerCase(), m._applyFilterAndSort(), m._vStart = -1, m._vEnd = -1, m._render(), m._updateFooter(), S(g, "ln-table:filter", {
        term: m._searchTerm,
        matched: m._filteredData.length,
        total: m._data.length
      }));
    }, g.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(r) {
      r.preventDefault(), m._onSetSearch(r);
    }, g.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      m.isDataDriven ? (m.currentFilters = {}, m.currentSearch = "", S(g, "ln-table:clear-filters", { table: m.name }), m._requestData()) : (m._searchTerm = "", m._columnFilters = {}, m._applyFilterAndSort(), m._vStart = -1, m._vEnd = -1, m._render(), m._updateFooter(), S(g, "ln-table:filter", {
        term: "",
        matched: m._filteredData.length,
        total: m._data.length
      }));
    }, g.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectable = g.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && g.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(r) {
      const s = r.detail || {}, e = s.data || [], o = s.total != null ? s.total : e.length;
      if (!(m._hasInitialSeed && !m.isLoaded && e.length === 0 && o === 0)) {
        if (m._windowed) {
          m._cache.ingest(s) && !s.provisional && g.classList.remove("ln-table--loading");
          return;
        }
        m._data = e, m._lastTotal = o, m._lastFiltered = s.filtered != null ? s.filtered : m._data.length, m.totalCount = m._lastTotal, m.visibleCount = m._lastFiltered, m.isLoaded = !0, m._hasInitialSeed = !1, g.classList.remove("ln-table--loading"), m._vStart = -1, m._vEnd = -1, m._applyFilterAndSort(), m._render(), m._updateFooter(), S(g, "ln-table:rendered", {
          table: m.name,
          total: m.totalCount,
          visible: m.visibleCount
        });
      }
    }, g.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(r) {
      const s = r.detail && r.detail.loading;
      g.classList.toggle("ln-table--loading", !!s), s && (m.isLoaded = !1);
    }, g.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(r) {
      !m._windowed || !m._cache || m._cache.release(r.detail && r.detail.offset);
    }, g.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !m._windowed || !m._cache || m._cache.revalidate();
    }, g.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !m._windowed || !m._cache || m._requestData();
    }, g.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(r) {
      r.preventDefault(), m.currentSort = r.detail.direction === "none" ? null : { field: r.detail.field, direction: r.detail.direction }, m._requestData();
    }, g.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(r) {
      if (r.target.closest("[data-ln-table-row-select]") || r.target.closest("[data-ln-table-row-action]") || r.target.closest("a") || r.target.closest("button") || r.ctrlKey || r.metaKey || r.button === 1) return;
      const s = r.target.closest("[data-ln-table-row]");
      if (!s) return;
      const e = s.getAttribute("data-ln-table-row-id"), o = s._lnRecord || {};
      S(g, "ln-table:row-click", {
        table: m.name,
        id: e,
        record: o
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(r) {
      const s = r.target.closest("[data-ln-table-row-action]");
      if (!s) return;
      const e = s.closest("[data-ln-table-row]");
      if (!e) return;
      const o = s.getAttribute("data-ln-table-row-action"), a = e.getAttribute("data-ln-table-row-id"), y = e._lnRecord || {};
      S(g, "ln-table:row-action", {
        table: m.name,
        id: a,
        action: o,
        record: y
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : S(g, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      m.tbody.rows.length > 0 && (m._emptyTbodyObserver.disconnect(), m._emptyTbodyObserver = null, m._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(r) {
      r.preventDefault();
      const s = r.detail.direction === "none" ? null : r.detail.direction;
      m._sortCol = s === null ? -1 : r.detail.column, m._sortDir = s, m._applyFilterAndSort(), m._vStart = -1, m._vEnd = -1, m._render(), S(g, "ln-table:sorted", {
        column: r.detail.column,
        direction: r.detail.direction,
        matched: m._filteredData.length,
        total: m._data.length
      });
    }, g.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(r) {
      if (r.preventDefault(), !r.detail) return;
      const s = r.detail.key, e = r.detail.values || [];
      if (s) {
        if (e.length === 0)
          delete m._columnFilters[s];
        else {
          const o = [];
          for (let a = 0; a < e.length; a++)
            o.push(e[a].toLowerCase());
          m._columnFilters[s] = o;
        }
        m._applyFilterAndSort(), m._vStart = -1, m._vEnd = -1, m._render(), m._updateFooter(), S(g, "ln-table:filter", {
          term: m._searchTerm,
          matched: m._filteredData.length,
          total: m._data.length
        });
      }
    }, g.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  b.prototype._parseRows = function() {
    const g = this.tbody.rows, _ = this.ths;
    this._data = [], g.length > 0 && (this._rowHeight = g[0].offsetHeight || 40), this._lockColumnWidths();
    for (let m = 0; m < g.length; m++) {
      const r = g[m], s = [], e = [], o = [];
      for (let y = 0; y < r.cells.length; y++) {
        const v = r.cells[y], w = v.textContent.trim();
        s[y] = At(v), e[y] = w.toLowerCase(), v.querySelector("[data-ln-table-row-action]") || o.push(w.toLowerCase());
      }
      let a = null;
      if (this.isDataDriven) {
        a = {};
        const y = r.getAttribute("data-ln-table-row-id");
        y != null && (a.id = y);
        for (let v = 0; v < _.length; v++) {
          const w = _[v].getAttribute("data-ln-table-col");
          if (w) {
            const A = v;
            if (A < r.cells.length) {
              const C = r.cells[A];
              a[w] = At(C);
            }
          }
        }
      }
      this._data.push({
        values: s,
        rawTexts: e,
        html: r.outerHTML,
        searchText: o.join(" "),
        id: this.isDataDriven && a ? a.id : void 0,
        ...a
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, b.prototype._applyFilterAndSort = function() {
    this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
  }, b.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const g = document.createElement("colgroup");
    this.ths.forEach(function(_) {
      const m = document.createElement("col");
      m.style.width = _.offsetWidth + "px", g.appendChild(m);
    }), this.table.insertBefore(g, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = g;
  }, b.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const g = this._lastTotal, _ = this.visibleCount;
        if (g === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || _ === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const g = this._filteredData.length;
        g === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : g > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, b.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const g = this._filteredData, _ = document.createDocumentFragment();
      for (let m = 0; m < g.length; m++) {
        const r = this._buildRow(g[m]);
        if (!r) break;
        _.appendChild(r);
      }
      this.tbody.replaceChildren(_), this._selectable && this._updateSelectAll();
    } else {
      const g = [], _ = this._filteredData;
      for (let m = 0; m < _.length; m++) g.push(_[m].html);
      this.tbody.innerHTML = g.join(""), this._selectable && this._restoreSelection();
    }
  }, b.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const g = this;
    if (!this._rowHeight)
      if (this.tbody && this.tbody.rows.length > 0)
        this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
      else {
        let m = null;
        if (this._windowed) {
          const r = this._cache ? this._cache.peek() : null;
          m = r ? this._buildRow(r) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (m = this._buildRow(this._data[0]));
        m && this.tbody && (this.tbody.appendChild(m), this._rowHeight = m.offsetHeight || 40, m.remove());
      }
    this.isDataDriven ? this._scrollContainer = h(this.dom) : this._scrollContainer = null;
    const _ = this._scrollContainer || window;
    this._scrollHandler = function() {
      g._rafId || (g._rafId = requestAnimationFrame(function() {
        g._rafId = null, g._windowed ? g._renderWindowed() : g._renderVirtual();
      }));
    }, _.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, b.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, b.prototype._renderVirtual = function() {
    const g = this._filteredData, _ = g.length, m = this._rowHeight;
    if (!m || !_) return;
    const r = this.thead ? this.thead.offsetHeight : 0, s = this._scrollContainer;
    let e, o;
    if (s) {
      const L = this.table.getBoundingClientRect(), q = s.getBoundingClientRect(), x = L.top - q.top + s.scrollTop + r;
      e = s.scrollTop - x, o = s.clientHeight;
    } else {
      const x = this.table.getBoundingClientRect().top + window.scrollY + r;
      e = window.scrollY - x, o = window.innerHeight;
    }
    const a = Ie(e, o, m, _, 15), y = a.start, v = a.end;
    if (y === this._vStart && v === this._vEnd) return;
    this._vStart = y, this._vEnd = v;
    const w = this.ths.length || 1, A = a.topPadding, C = a.bottomPadding;
    if (this.isDataDriven) {
      const L = document.createDocumentFragment();
      if (A > 0) {
        const q = document.createElement("tr");
        q.className = "ln-table__spacer", q.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", w), x.style.height = A + "px", q.appendChild(x), L.appendChild(q);
      }
      for (let q = y; q < v; q++) {
        const x = this._buildRow(g[q]);
        x && L.appendChild(x);
      }
      if (C > 0) {
        const q = document.createElement("tr");
        q.className = "ln-table__spacer", q.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", w), x.style.height = C + "px", q.appendChild(x), L.appendChild(q);
      }
      this.tbody.replaceChildren(L), this._selectable && this._updateSelectAll();
    } else {
      let L = "";
      A > 0 && (L += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + w + '" style="height:' + A + 'px;padding:0;border:none"></td></tr>');
      for (let q = y; q < v; q++) L += g[q].html;
      C > 0 && (L += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + w + '" style="height:' + C + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = L, this._selectable && this._restoreSelection();
    }
  }, b.prototype._buildPlaceholderRow = function() {
    const g = document.createElement("tr");
    g.className = "ln-table__placeholder", g.setAttribute("aria-hidden", "true");
    const _ = document.createElement("td");
    return _.setAttribute("colspan", this.ths.length || 1), _.style.height = this._rowHeight + "px", g.appendChild(_), g;
  }, b.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const g = this._rowHeight;
    if (!g) return;
    const _ = this._cache.logicalTotal, m = this.thead ? this.thead.offsetHeight : 0, r = this._scrollContainer;
    let s, e;
    if (r) {
      const L = this.table.getBoundingClientRect(), q = r.getBoundingClientRect(), x = L.top - q.top + r.scrollTop + m;
      s = r.scrollTop - x, e = r.clientHeight;
    } else {
      const x = this.table.getBoundingClientRect().top + window.scrollY + m;
      s = window.scrollY - x, e = window.innerHeight;
    }
    const o = Ie(s, e, g, _, 15), a = o.start, y = o.end, v = this.ths.length || 1, w = o.topPadding, A = o.bottomPadding, C = document.createDocumentFragment();
    if (w > 0) {
      const L = document.createElement("tr");
      L.className = "ln-table__spacer", L.setAttribute("aria-hidden", "true");
      const q = document.createElement("td");
      q.setAttribute("colspan", v), q.style.height = w + "px", L.appendChild(q), C.appendChild(L);
    }
    for (let L = a; L < y; L++)
      if (this._cache.has(L)) {
        const q = this._buildRow(this._cache.get(L));
        q && C.appendChild(q);
      } else
        C.appendChild(this._buildPlaceholderRow());
    if (A > 0) {
      const L = document.createElement("tr");
      L.className = "ln-table__spacer", L.setAttribute("aria-hidden", "true");
      const q = document.createElement("td");
      q.setAttribute("colspan", v), q.style.height = A + "px", L.appendChild(q), C.appendChild(L);
    }
    this.tbody.replaceChildren(C), this._vStart = a, this._vEnd = y, this._cache.ensure(a, y);
  }, b.prototype._showEmptyState = function() {
    const g = this.ths.length || 1;
    let _ = null, m = null;
    if (this.isDataDriven) {
      const r = this._lastTotal != null ? this._lastTotal : this._data.length, e = this.visibleCount === 0 && r > 0, o = e ? this.name + "-empty-filtered" : this.name + "-empty";
      if (m = pt(this.dom, o, "ln-table"), !m) {
        const a = this.dom.querySelector("template[data-ln-table-empty]");
        if (a) {
          const y = e ? "search" : "initial", v = a.content.querySelector('[data-ln-table-empty-when="' + y + '"]') || a.content.firstElementChild;
          v && (m = document.importNode(v, !0));
        }
      }
      if (m)
        if (m.tagName === "TR")
          _ = m;
        else {
          const a = document.createElement("td");
          a.setAttribute("colspan", String(g)), a.appendChild(m);
          const y = document.createElement("tr");
          y.className = "ln-table__empty", y.appendChild(a), _ = y;
        }
    } else {
      const r = this.dom.querySelector("template[" + u + "]"), s = document.createElement("td");
      s.setAttribute("colspan", String(g)), r && s.appendChild(document.importNode(r.content, !0));
      const e = document.createElement("tr");
      e.className = "ln-table__empty", e.appendChild(s), _ = e;
    }
    _ ? this.tbody.replaceChildren(_) : this.tbody.replaceChildren(), S(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, b.prototype._fillRow = function(g, _) {
    Dt(g, _);
    const m = g.querySelectorAll("[data-ln-table-cell-attr]");
    for (let r = 0; r < m.length; r++) {
      const s = m[r], e = s.getAttribute("data-ln-table-cell-attr").split(",");
      for (let o = 0; o < e.length; o++) {
        const a = e[o].trim().split(":");
        if (a.length !== 2) continue;
        const y = a[0].trim(), v = a[1].trim();
        _[y] != null && s.setAttribute(v, _[y]);
      }
    }
  }, b.prototype._buildRow = function(g) {
    let _ = pt(this.dom, this.name + "-row", "ln-table");
    if (!_) {
      const r = this.dom.querySelector("template[data-ln-table-row]");
      r && (_ = document.importNode(r.content, !0));
    }
    let m = _ ? _.querySelector("[data-ln-table-row]") || _.firstElementChild : null;
    if (m)
      this._fillRow(m, g);
    else if (g && g.html) {
      const r = document.createElement("tbody");
      r.innerHTML = g.html, m = r.firstElementChild;
    } else {
      m = document.createElement("tr"), m.setAttribute("data-ln-table-row", "");
      const r = this.ths;
      for (let s = 0; s < r.length; s++) {
        const e = r[s].hasAttribute("data-ln-table-col-select"), o = document.createElement("td");
        if (e) {
          const a = document.createElement("input");
          a.type = "checkbox", a.setAttribute("data-ln-table-row-select", ""), a.setAttribute("aria-label", "Select row"), o.appendChild(a);
        } else {
          const a = r[s].getAttribute("data-ln-table-col");
          a && g[a] != null && (o.textContent = String(g[a]));
        }
        m.appendChild(o);
      }
    }
    if (m._lnRecord = g, g.id != null && m.setAttribute("data-ln-table-row-id", g.id), this._selectable && g.id != null && this.selectedIds.has(String(g.id))) {
      m.classList.add("ln-row-selected");
      const r = m.querySelector("[data-ln-table-row-select]");
      r && (r.checked = !0);
    }
    return m;
  }, b.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Pe(this, "ln-table:request-data", "table");
  }, b.prototype._enterWindowedMode = function() {
    const g = this, _ = this.dom, m = parseInt(_.getAttribute("data-ln-table-window"), 10), r = parseInt(_.getAttribute("data-ln-table-window-page"), 10), s = parseInt(_.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !g._windowed || !g._cache || (g.totalCount = g._cache.grandTotal, g.visibleCount = g._cache.logicalTotal, g._lastTotal = g._cache.grandTotal, g.isLoaded = !0, g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), S(_, "ln-table:rendered", {
        table: g.name,
        total: g.totalCount,
        visible: g.visibleCount
      }));
    }, this._renderBatch = pe(this._onCacheChange), this._cache = Qe({
      windowSize: m > 0 ? m : 1e3,
      pageSize: r > 0 ? r : 200,
      threshold: s >= 0 ? s : 25,
      fetchDebounce: 120,
      requestPage: function(e, o, a) {
        S(_, "ln-table:request-data", {
          table: g.name,
          sort: e.sort,
          filters: e.filters,
          search: e.search,
          offset: o,
          limit: a,
          queryGen: g._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, b.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let g = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(g) && this._totalSpan) {
        const m = this._totalSpan.textContent.replace(/[^\d]/g, "");
        m && (g = parseInt(m, 10));
      }
      const _ = g > 0 ? g : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: _,
        filtered: _
      });
    } else
      this.dom.classList.add("ln-table--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, b.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, b.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const g = this.tbody.querySelectorAll("[data-ln-table-row]"), _ = [];
    for (let r = 0; r < g.length; r++) {
      const s = g[r].getAttribute("data-ln-table-row-id");
      s != null && _.push(s);
    }
    const m = Ti(_, this.selectedIds);
    this._selectAllCheckbox.checked = m.isAllSelected, this._selectAllCheckbox.indeterminate = m.isIndeterminate;
  }, b.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const g = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let _ = 0; _ < g.length; _++) {
      const m = g[_].getAttribute("data-ln-table-row-id"), r = m != null && this.selectedIds.has(m);
      g[_].classList.toggle("ln-row-selected", r);
      const s = g[_].querySelector("[data-ln-table-row-select]");
      s && (s.checked = r);
    }
    this._updateSelectAll();
  }, Object.defineProperty(b.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), b.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const g = this;
    if (this._onSelectionChange = function(_) {
      const m = _.target.closest("[data-ln-table-row-select]");
      if (!m) return;
      const r = m.closest("[data-ln-table-row]");
      if (!r) return;
      const s = r.getAttribute("data-ln-table-row-id");
      s != null && (g.selectedIds = De(g.selectedIds, s, m.checked), r.classList.toggle("ln-row-selected", m.checked), g.selectedCount = g.selectedIds.size, g._updateSelectAll(), g._updateFooter(), S(g.dom, "ln-table:select", {
        table: g.name,
        selectedIds: g.selectedIds,
        count: g.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const _ = document.createElement("input");
      _.type = "checkbox";
      const m = g.dom.querySelector('[data-ln-table-dict="select-all"]'), r = g.dom.getAttribute("data-ln-table-select-all-label") || (m ? m.textContent.trim() : null) || "Select all";
      _.setAttribute("aria-label", r), this._selectAllCheckbox.appendChild(_), this._selectAllCheckbox = _;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const _ = g._selectAllCheckbox.checked, m = g.tbody ? g.tbody.querySelectorAll("[data-ln-table-row]") : [], r = [];
      for (let s = 0; s < m.length; s++) {
        const e = m[s].getAttribute("data-ln-table-row-id"), o = m[s].querySelector("[data-ln-table-row-select]");
        e != null && (r.push(e), m[s].classList.toggle("ln-row-selected", _), o && (o.checked = _));
      }
      g.selectedIds = Re(g.selectedIds, r, _), g.selectedCount = g.selectedIds.size, S(g.dom, "ln-table:select-all", {
        table: g.name,
        selected: _
      }), S(g.dom, "ln-table:select", {
        table: g.name,
        selectedIds: g.selectedIds,
        count: g.selectedCount
      }), g._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const _ = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let m = 0; m < _.length; m++) {
        const r = _[m].querySelector("[data-ln-table-row-select]"), s = _[m].getAttribute("data-ln-table-row-id");
        r && r.checked && s != null && (g.selectedIds = De(g.selectedIds, s, !0), _[m].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, b.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const g = this.dom.querySelector("[data-ln-table-col-select]");
    if (g) {
      const _ = g.querySelector('input[type="checkbox"]');
      _ && _.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = Re(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const _ = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let m = 0; m < _.length; m++) {
        _[m].classList.remove("ln-row-selected");
        const r = _[m].querySelector("[data-ln-table-row-select]");
        r && (r.checked = !1);
      }
    }
    this._updateFooter();
  }, b.prototype._updateFooter = function() {
    let g = 0, _ = 0;
    this.isDataDriven ? (g = this._lastTotal != null ? this._lastTotal : this._data.length, _ = this.visibleCount) : (g = this._data.length, _ = this._filteredData.length);
    const m = _ < g;
    if (this._totalSpan && (this._totalSpan.textContent = f(g, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = m ? f(_, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !m), this._selectedSpan) {
      const r = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = r > 0 ? f(r, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", r === 0);
    }
  }, b.prototype.destroy = function() {
    this.dom[n] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[n]);
  }, M(t, n, b, "ln-table", {
    extraAttributes: [
      "data-ln-table-window",
      "data-ln-table-window-page",
      "data-ln-table-window-threshold",
      "data-ln-table-count"
    ],
    onAttributeChange: function(g, _) {
      const m = g[n];
      if (!(!m || !m.isDataDriven)) {
        if (_ === "data-ln-table-window") {
          const r = g.hasAttribute("data-ln-table-window");
          if (r && !m._windowed)
            m._enterWindowedMode(), m._kickWindowInitial();
          else if (!r && m._windowed)
            m._exitWindowedMode();
          else if (r && m._windowed) {
            const s = parseInt(g.getAttribute("data-ln-table-window"), 10);
            s > 0 && m._cache.configure({ windowSize: s });
          }
          return;
        }
        if (!(!m._windowed || !m._cache)) {
          if (_ === "data-ln-table-window-page") {
            const r = parseInt(g.getAttribute("data-ln-table-window-page"), 10);
            r > 0 && m._cache.configure({ pageSize: r });
          } else if (_ === "data-ln-table-window-threshold") {
            const r = parseInt(g.getAttribute("data-ln-table-window-threshold"), 10);
            r >= 0 && m._cache.configure({ threshold: r });
          } else if (_ === "data-ln-table-count") {
            const r = parseInt(g.getAttribute("data-ln-table-count"), 10);
            r >= 0 && m._cache.setGrandTotal(r);
          }
        }
      }
    }
  });
})();
(function() {
  const t = "data-ln-table-coordinator", n = "lnTableCoordinator";
  if (window[n] !== void 0) return;
  document.addEventListener("keydown", function(c) {
    if (c.key !== "/" || c.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const i = document.querySelector("[" + t + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!i) return;
    const f = i.tagName === "INPUT" || i.tagName === "TEXTAREA" ? i : i.querySelector('input[type="search"], input[type="text"], input');
    f && (c.preventDefault(), f.focus());
  });
  function u(c) {
    return this.dom = c, d(this), this;
  }
  function p(c, i) {
    const f = i ? '[data-ln-search-for="' + i + '"]' : "[data-ln-search-for]", h = c.querySelector(f) || document.querySelector(f);
    return h ? h.tagName === "INPUT" || h.tagName === "TEXTAREA" ? h : h.querySelector("input, textarea") : null;
  }
  function l(c, i) {
    if (i) {
      const h = c.querySelectorAll('[data-ln-filter="' + i + '"]');
      if (h.length > 0) return h;
      const b = document.querySelectorAll('[data-ln-filter="' + i + '"]');
      if (b.length > 0) return b;
    }
    const f = c.querySelectorAll("[data-ln-filter]");
    return f.length > 0 ? f : document.querySelectorAll("[data-ln-filter]");
  }
  function d(c) {
    const i = c.dom;
    function f(h) {
      const b = h.target;
      if (b && b.hasAttribute && b.hasAttribute("data-ln-table")) return b;
      const g = h.detail && h.detail.targetId || b && b.id;
      return g ? i.querySelector('[data-ln-table-source="' + g + '"]') || i.querySelector('[data-ln-table="' + g + '"]') : null;
    }
    c._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(h) {
        if (!h.detail) return;
        const b = f(h);
        if (!b || !b.hasAttribute || !b.hasAttribute("data-ln-table")) return;
        const g = h.detail.key, _ = h.detail.values || [], m = b.querySelectorAll("th");
        for (let r = 0; r < m.length; r++)
          if (m[r].getAttribute("data-ln-table-filter-col") === g) {
            const s = m[r].querySelector("[data-ln-table-col-filter]");
            s && s.classList.toggle("ln-filter-active", _.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(h) {
        const b = h.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!b) return;
        const g = b.closest("[data-ln-table]") || i.querySelector("[data-ln-table]");
        if (!g || !g.lnTable) return;
        const _ = g.lnTable.name || g.id, m = g.querySelectorAll("th");
        for (let o = 0; o < m.length; o++) {
          const a = m[o].querySelector("[data-ln-table-col-filter]");
          a && a.classList.remove("ln-filter-active");
        }
        const r = g.getAttribute("data-ln-table-source") || g.id, s = r ? document.getElementById(r) : null;
        if (s && s.hasAttribute("data-ln-search"))
          s.setAttribute("data-ln-search", "");
        else {
          const o = p(i, r);
          o && o.value !== "" && (o.value = "", o.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const e = l(i, r);
        for (let o = 0; o < e.length; o++) {
          const a = e[o].querySelector("[data-ln-filter-reset]");
          if (!a) continue;
          const y = e[o].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!a.checked || y) && (a.checked = !0, a.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        g.hasAttribute("data-ln-table-source") || S(g, "ln-table:request-clear-filters", { table: _ });
      }
    }, i.addEventListener("ln-filter:change", c._handlers.filter), i.addEventListener("click", c._handlers.clear);
  }
  u.prototype.destroy = function() {
    this.dom[n] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[n]);
  }, M(t, n, u, "ln-table-coordinator");
})();
(function() {
  const t = "data-ln-list", n = "lnList", u = "data-ln-list-empty";
  if (window[n] !== void 0) return;
  function f(r, s) {
    if (r == null || isNaN(r)) return "";
    try {
      return new Intl.NumberFormat(V(s)).format(r);
    } catch {
      return String(r);
    }
  }
  function h(r) {
    let s = r;
    for (; s && s !== document.body && s !== document.documentElement; ) {
      const o = getComputedStyle(s).overflowY;
      if (o === "auto" || o === "scroll") return s;
      s = s.parentElement;
    }
    return null;
  }
  function b(r) {
    const s = r._scrollContainer || h(r.dom);
    return {
      container: s,
      top: s ? s.scrollTop : window.scrollY
    };
  }
  function g(r) {
    r.container ? r.container.scrollTop = r.top : window.scrollTo(window.scrollX, r.top);
  }
  function _(r) {
    if (!r) return 0;
    const s = getComputedStyle(r), e = parseFloat(s.marginTop) || 0, o = parseFloat(s.marginBottom) || 0;
    return r.offsetHeight + e + o;
  }
  function m(r) {
    this.dom = r, this.tbody = r.querySelector("[data-ln-list-body]") || r, this.isDataDriven = r.hasAttribute("data-ln-list-source"), this.name = r.getAttribute(t) || "", this.source = r.getAttribute("data-ln-list-source") || "", this._totalSpan = r.querySelector("[data-ln-list-total]"), this._filteredSpan = r.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== r ? this._filteredSpan.parentElement : null), this._selectedSpan = r.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== r ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const s = this;
    return this._onSetSearch = function(e) {
      const o = (e.detail && e.detail.query != null ? e.detail.query : e.detail && e.detail.term != null ? e.detail.term : "").trim();
      s.isDataDriven ? (s.currentSearch = o, S(r, "ln-list:search", {
        list: s.name,
        query: s.currentSearch
      }), s._requestData()) : (s._searchTerm = o.toLowerCase(), s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), s._updateFooter(), S(r, "ln-list:filter", {
        term: s._searchTerm,
        matched: s._filteredData.length,
        total: s._data.length
      }));
    }, r.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(e) {
      e.preventDefault(), s._onSetSearch(e);
    }, r.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      s.isDataDriven ? (s.currentFilters = {}, s.currentSearch = "", S(r, "ln-list:clear-filters", { list: s.name }), s._requestData()) : (s._searchTerm = "", s._filters = {}, s._sortField = null, s._sortDir = null, s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), s._updateFooter(), S(r, "ln-list:filter", {
        term: "",
        matched: s._filteredData.length,
        total: s._data.length
      }));
    }, r.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectable = r.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, r.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(e) {
      const o = e.detail || {}, a = o.data || [], y = o.total != null ? o.total : a.length;
      if (!(s._hasInitialSeed && !s.isLoaded && a.length === 0 && y === 0)) {
        if (s._windowed) {
          s._cache.ingest(o) && !o.provisional && r.classList.remove("ln-list--loading");
          return;
        }
        s._data = a, s._lastTotal = y, s._lastFiltered = o.filtered != null ? o.filtered : s._data.length, s.totalCount = s._lastTotal, s.visibleCount = s._lastFiltered, s.isLoaded = !0, s._hasInitialSeed = !1, r.classList.remove("ln-list--loading"), s._vStart = -1, s._vEnd = -1, s._applyFilterAndSort(), s._render(), s._updateFooter(), S(r, "ln-list:rendered", {
          list: s.name,
          total: s.totalCount,
          visible: s.visibleCount
        });
      }
    }, r.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(e) {
      const o = e.detail && e.detail.loading;
      r.classList.toggle("ln-list--loading", !!o), o && (s.isLoaded = !1);
    }, r.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(e) {
      !s._windowed || !s._cache || s._cache.release(e.detail && e.detail.offset);
    }, r.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !s._windowed || !s._cache || s._cache.revalidate();
    }, r.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !s._windowed || !s._cache || s._requestData();
    }, r.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(e) {
      e.detail.field != null && (e.preventDefault(), s.currentSort = e.detail.direction === "none" ? null : { field: e.detail.field, direction: e.detail.direction }, s._requestData());
    }, r.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(e) {
      if (e.target.closest("[data-ln-item-select]") || e.target.closest("[data-ln-item-action]") || e.target.closest("a") || e.target.closest("button") || e.ctrlKey || e.metaKey || e.button === 1) return;
      const o = e.target.closest("[data-ln-item]");
      if (!o) return;
      const a = o.getAttribute("data-ln-item-id"), y = o._lnRecord || {};
      S(r, "ln-list:item-click", {
        list: s.name,
        id: a,
        record: y
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(e) {
      const o = e.target.closest("[data-ln-item-action]");
      if (!o) return;
      const a = o.closest("[data-ln-item]");
      if (!a) return;
      const y = o.getAttribute("data-ln-item-action"), v = a.getAttribute("data-ln-item-id"), w = a._lnRecord || {};
      S(r, "ln-list:item-action", {
        list: s.name,
        id: v,
        action: y,
        record: w
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : S(r, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      s.tbody.children.length > 0 && (s._emptyObserver.disconnect(), s._emptyObserver = null, s._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(e) {
      if (e.preventDefault(), !e.detail) return;
      const o = e.detail.key, a = e.detail.values || [];
      if (o) {
        if (a.length === 0)
          delete s._filters[o];
        else {
          const y = [];
          for (let v = 0; v < a.length; v++)
            y.push(a[v].toLowerCase());
          s._filters[o] = y;
        }
        s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), s._updateFooter(), S(r, "ln-list:filter", {
          term: s._searchTerm,
          matched: s._filteredData.length,
          total: s._data.length
        });
      }
    }, r.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(e) {
      if (e.detail && e.detail.field == null) return;
      e.preventDefault();
      const o = e.detail && e.detail.direction === "none" ? null : e.detail && e.detail.direction;
      s._sortField = o === null ? null : e.detail && e.detail.field, s._sortDir = o, s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), s._updateFooter(), S(r, "ln-list:sorted", {
        field: s._sortField,
        direction: e.detail && e.detail.direction,
        matched: s._filteredData.length,
        total: s._data.length
      });
    }, r.addEventListener("ln-sort:change", this._onSort)), this;
  }
  m.prototype._parseChildren = function() {
    const r = Array.from(this.tbody.children).filter((s) => !s.classList.contains("ln-list__spacer"));
    this._data = [], r.length > 0 && (this._itemHeight = _(r[0]) || 50);
    for (let s = 0; s < r.length; s++) {
      const e = r[s], o = e.getAttribute("data-ln-item-id") || e.getAttribute("id"), a = e.textContent.trim().toLowerCase();
      let y = null;
      if (this.isDataDriven) {
        y = {}, o != null && (y.id = o);
        const A = e.querySelectorAll("[data-ln-list-field]");
        for (let C = 0; C < A.length; C++) {
          const L = A[C], q = L.getAttribute("data-ln-list-field");
          q && (y[q] = At(L));
        }
      }
      const v = {}, w = e.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let A = 0; A < w.length; A++) {
        const C = w[A], L = C.getAttribute("data-ln-list-field") || C.getAttribute("data-ln-field");
        L && (v[L] = At(C));
      }
      for (let A = 0; A < e.attributes.length; A++) {
        const C = e.attributes[A];
        if (C.name.startsWith("data-") && !C.name.startsWith("data-ln-")) {
          const L = C.name.slice(5);
          L && (v[L] = C.value);
        }
      }
      this._data.push({
        html: e.outerHTML,
        id: o,
        searchText: a,
        fields: v,
        ...y || {}
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, m.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const r = this._searchTerm, s = r ? r.split(/\s+/).filter(Boolean) : [], e = this._filters || {}, o = Object.keys(e).length > 0;
      if (s.length === 0 && !o ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(a) {
        if (s.length > 0 && !s.every(function(v) {
          return a.searchText && a.searchText.indexOf(v) !== -1;
        }))
          return !1;
        if (o)
          for (const y in e) {
            const v = e[y];
            if (v && v.length > 0) {
              const w = a.fields && a.fields[y] !== void 0 ? a.fields[y] : a[y] !== void 0 ? a[y] : null, A = w != null ? String(w).toLowerCase() : "";
              if (v.indexOf(A) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const a = this._sortField, y = this._sortDir === "desc" ? -1 : 1, v = typeof Intl < "u" ? new Intl.Collator(V(this.dom), { sensitivity: "base" }) : null, w = this._filteredData.map(function(C) {
          return C.fields && C.fields[a] !== void 0 ? C.fields[a] : C[a];
        }), A = ue(w);
        this._filteredData.sort(function(C, L) {
          const q = C.fields && C.fields[a] !== void 0 ? C.fields[a] : C[a], x = L.fields && L.fields[a] !== void 0 ? L.fields[a] : L[a];
          return he(q, x, A, v) * y;
        });
      }
    }
  }, m.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const r = this._lastTotal, s = this.visibleCount;
        if (r === 0 || this._filteredData.length === 0 || s === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const r = this._filteredData.length;
        r === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : r > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, m.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const r = this._filteredData, s = document.createDocumentFragment();
      for (let o = 0; o < r.length; o++) {
        const a = this._buildItem(r[o]);
        a && s.appendChild(a);
      }
      const e = b(this);
      this.tbody.replaceChildren(s), g(e), this._selectable && this._updateSelectAll();
    } else {
      const r = [], s = this._filteredData;
      for (let o = 0; o < s.length; o++) r.push(s[o].html);
      const e = b(this);
      this.tbody.innerHTML = r.join(""), g(e), this._selectable && this._restoreSelection();
    }
  }, m.prototype._readGridLayout = function() {
    const r = getComputedStyle(this.tbody), s = r.gridTemplateColumns;
    let e = 1;
    if (s && s !== "none") {
      const a = s.trim().split(/\s+/).filter(Boolean);
      a.length > 0 && (e = a.length);
    }
    const o = parseFloat(r.rowGap);
    return { columns: e, rowGap: isNaN(o) ? 0 : o };
  }, m.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const r = this._cache.peek(), s = r ? this._buildItem(r) : this._buildPlaceholderItem();
      s && (this.tbody.textContent = "", this.tbody.appendChild(s), this._itemHeight = _(s) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const r = this._buildItem(this._data[0]);
        r && (this.tbody.textContent = "", this.tbody.appendChild(r), this._itemHeight = _(r) || 50, this.tbody.textContent = "");
      }
    } else {
      const r = this.tbody.children;
      r.length > 0 && (this._itemHeight = _(r[0]) || 50);
    }
  }, m.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const r = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = h(this.dom);
    const s = this._scrollContainer || window;
    this._scrollHandler = function() {
      r._rafId || (r._rafId = requestAnimationFrame(function() {
        r._rafId = null, r._windowed ? r._renderWindowed() : r._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      r._itemHeight = 0, r._measureItemHeight(), r._vStart = -1, r._vEnd = -1, r._windowed ? r._renderWindowed() : r._renderVirtual();
    }, s.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, m.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, m.prototype._renderVirtual = function() {
    const r = this._filteredData, s = r.length, e = this._itemHeight;
    if (!e || !s) return;
    const o = this._scrollContainer;
    let a, y;
    if (o) {
      const H = this.tbody.getBoundingClientRect(), U = o.getBoundingClientRect(), z = o === this.tbody ? 0 : H.top - U.top + o.scrollTop;
      a = o.scrollTop - z, y = o.clientHeight;
    } else {
      const U = this.tbody.getBoundingClientRect().top + window.scrollY;
      a = window.scrollY - U, y = window.innerHeight;
    }
    const v = this._readGridLayout(), w = v.columns, A = v.rowGap, C = e + A, L = Math.ceil(s / w);
    let q = Math.max(0, Math.floor(a / C) - 15);
    q = Math.min(q, L);
    const x = Math.ceil(y / C) + 30, D = Math.min(q + x, L), F = Math.min(q * w, s), N = Math.min(D * w, s);
    if (F === this._vStart && N === this._vEnd) return;
    this._vStart = F, this._vEnd = N;
    const B = q * C, $ = (L - D) * C;
    if (this.isDataDriven) {
      const H = document.createDocumentFragment();
      if (B > 0) {
        const z = document.createElement(this.isUl ? "li" : "div");
        z.className = "ln-list__spacer", z.setAttribute("aria-hidden", "true"), z.style.height = B + "px", H.appendChild(z);
      }
      for (let z = F; z < N; z++) {
        const st = this._buildItem(r[z]);
        st && H.appendChild(st);
      }
      if ($ > 0) {
        const z = document.createElement(this.isUl ? "li" : "div");
        z.className = "ln-list__spacer", z.setAttribute("aria-hidden", "true"), z.style.height = $ + "px", H.appendChild(z);
      }
      const U = b(this);
      this.tbody.replaceChildren(H), g(U), this._selectable && this._updateSelectAll();
    } else {
      let H = "";
      B > 0 && (H += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${B}px"></${this.isUl ? "li" : "div"}>`);
      for (let z = F; z < N; z++)
        H += r[z].html;
      $ > 0 && (H += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${$}px"></${this.isUl ? "li" : "div"}>`);
      const U = b(this);
      this.tbody.innerHTML = H, g(U), this._selectable && this._restoreSelection();
    }
  }, m.prototype._buildPlaceholderItem = function() {
    const r = document.createElement(this.isUl ? "li" : "div");
    return r.className = "ln-list__placeholder", r.setAttribute("aria-hidden", "true"), r.style.height = this._itemHeight + "px", r;
  }, m.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const r = this._itemHeight;
    if (!r) return;
    const s = this._scrollContainer;
    let e, o;
    if (s) {
      const U = this.tbody.getBoundingClientRect(), z = s.getBoundingClientRect(), st = s === this.tbody ? 0 : U.top - z.top + s.scrollTop;
      e = s.scrollTop - st, o = s.clientHeight;
    } else {
      const z = this.tbody.getBoundingClientRect().top + window.scrollY;
      e = window.scrollY - z, o = window.innerHeight;
    }
    const a = this._readGridLayout(), y = a.columns, v = a.rowGap, w = r + v, A = this._cache.logicalTotal, C = Math.ceil(A / y);
    let L = Math.max(0, Math.floor(e / w) - 15);
    L = Math.min(L, C);
    const q = Math.ceil(o / w) + 30, x = Math.min(L + q, C), D = Math.min(L * y, A), F = Math.min(x * y, A), N = L * w, B = (C - x) * w, $ = document.createDocumentFragment();
    if (N > 0) {
      const U = document.createElement(this.isUl ? "li" : "div");
      U.className = "ln-list__spacer", U.setAttribute("aria-hidden", "true"), U.style.height = N + "px", $.appendChild(U);
    }
    for (let U = D; U < F; U++)
      if (this._cache.has(U)) {
        const z = this._buildItem(this._cache.get(U));
        z && $.appendChild(z);
      } else
        $.appendChild(this._buildPlaceholderItem());
    if (B > 0) {
      const U = document.createElement(this.isUl ? "li" : "div");
      U.className = "ln-list__spacer", U.setAttribute("aria-hidden", "true"), U.style.height = B + "px", $.appendChild(U);
    }
    const H = b(this);
    this.tbody.replaceChildren($), g(H), this._vStart = D, this._vEnd = F, this._cache.ensure(D, F);
  }, m.prototype._showEmptyState = function() {
    let r = null;
    if (this.isDataDriven) {
      const s = this._lastTotal != null ? this._lastTotal : this._data.length, o = this.visibleCount === 0 && s > 0, a = o ? this.name + "-empty-filtered" : this.name + "-empty";
      if (r = pt(this.dom, a, "ln-list"), !r) {
        const y = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (y) {
          const v = o ? "search" : "initial", w = y.content.querySelector(`[data-ln-empty-when="${v}"]`) || y.content.firstElementChild;
          w && (r = document.importNode(w, !0));
        }
      }
    } else {
      const s = this.dom.querySelector(`template[${u}]`);
      if (s) {
        const e = s.content.firstElementChild;
        e && (r = document.importNode(e, !0));
      }
    }
    if (r)
      if (r.tagName === "LI" || r.tagName === "TR")
        this.tbody.replaceChildren(r);
      else {
        const s = document.createElement(this.isUl ? "li" : "div");
        s.appendChild(r), this.tbody.replaceChildren(s);
      }
    else
      this.tbody.replaceChildren();
    S(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, m.prototype._buildItem = function(r) {
    let s = pt(this.dom, this.name + "-row", "ln-list");
    if (!s) {
      const o = this.dom.querySelector("template[data-ln-item]");
      o && (s = document.importNode(o.content, !0));
    }
    let e = s ? s.querySelector("[data-ln-item]") || s.firstElementChild : null;
    if (e)
      Dt(e, r), ot(e, r);
    else if (r && r.html) {
      const o = document.createElement(this.isUl ? "ul" : "div");
      o.innerHTML = r.html, e = o.firstElementChild;
    } else if (e = document.createElement(this.isUl ? "li" : "div"), e.setAttribute("data-ln-item", ""), r && typeof r == "object") {
      for (const o in r)
        if (o !== "html" && r[o] != null) {
          const a = document.createElement("span");
          a.setAttribute("data-ln-field", o), a.textContent = String(r[o]), e.appendChild(a);
        }
    }
    if (e._lnRecord = r, r && r.id != null && (e.setAttribute("data-ln-item-id", r.id), this._selectable && this.selectedIds.has(String(r.id)))) {
      e.classList.add("ln-item-selected");
      const o = e.querySelector("[data-ln-item-select]");
      o && (o.checked = !0);
    }
    return e;
  }, m.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const r = this.tbody.querySelectorAll("[data-ln-item]");
    for (let s = 0; s < r.length; s++) {
      const e = r[s].getAttribute("data-ln-item-id"), o = e != null && this.selectedIds.has(String(e));
      r[s].classList.toggle("ln-item-selected", o);
      const a = r[s].querySelector("[data-ln-item-select]");
      a && (a.checked = o);
    }
    this._updateSelectAll();
  }, m.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const r = this;
    this._onSelectionChange = function(s) {
      const e = s.target.closest("[data-ln-item-select]");
      if (!e) return;
      const o = e.closest("[data-ln-item]");
      if (!o) return;
      const a = o.getAttribute("data-ln-item-id");
      a != null && (e.checked ? (r.selectedIds.add(String(a)), o.classList.add("ln-item-selected")) : (r.selectedIds.delete(String(a)), o.classList.remove("ln-item-selected")), r._updateSelectAll(), r._updateFooter(), S(r.dom, "ln-list:select", {
        list: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const s = r._selectAllCheckbox.checked, e = r.tbody.querySelectorAll("[data-ln-item]");
      for (let o = 0; o < e.length; o++) {
        const a = e[o], y = a.getAttribute("data-ln-item-id"), v = a.querySelector("[data-ln-item-select]");
        y != null && (s ? (r.selectedIds.add(String(y)), a.classList.add("ln-item-selected")) : (r.selectedIds.delete(String(y)), a.classList.remove("ln-item-selected")), v && (v.checked = s));
      }
      S(r.dom, "ln-list:select-all", { list: r.name, selected: s }), S(r.dom, "ln-list:select", {
        list: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedIds.size
      }), r._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, m.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const r = this.tbody.querySelectorAll("[data-ln-item]");
    let s = r.length > 0;
    for (let e = 0; e < r.length; e++) {
      const o = r[e].getAttribute("data-ln-item-id");
      if (o != null && !this.selectedIds.has(String(o))) {
        s = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = s;
  }, m.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Pe(this, "ln-list:request-data", "list");
  }, m.prototype._enterWindowedMode = function() {
    const r = this, s = this.dom, e = parseInt(s.getAttribute("data-ln-list-window"), 10), o = parseInt(s.getAttribute("data-ln-list-window-page"), 10), a = parseInt(s.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !r._windowed || !r._cache || (r.totalCount = r._cache.grandTotal, r.visibleCount = r._cache.logicalTotal, r._lastTotal = r._cache.grandTotal, r.isLoaded = !0, r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), S(s, "ln-list:rendered", {
        list: r.name,
        total: r.totalCount,
        visible: r.visibleCount
      }));
    }, this._renderBatch = pe(this._onCacheChange), this._cache = Qe({
      windowSize: e > 0 ? e : 1e3,
      pageSize: o > 0 ? o : 200,
      threshold: a >= 0 ? a : 25,
      fetchDebounce: 120,
      requestPage: function(y, v, w) {
        S(s, "ln-list:request-data", {
          list: r.name,
          sort: y.sort,
          filters: y.filters,
          search: y.search,
          offset: v,
          limit: w,
          queryGen: r._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, m.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const r = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), s = r > 0 ? r : this._data.length;
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
  }, m.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, m.prototype._updateFooter = function() {
    let r = 0, s = 0;
    this.isDataDriven ? (r = this._lastTotal != null ? this._lastTotal : this._data.length, s = this.visibleCount) : (r = this._data.length, s = this._filteredData.length);
    const e = s < r;
    if (this._totalSpan && (this._totalSpan.textContent = f(r, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = e ? f(s, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !e), this._selectedSpan) {
      const o = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = o > 0 ? f(o, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", o === 0);
    }
  }, m.prototype.destroy = function() {
    this.dom[n] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[n]);
  }, M(t, n, m, "ln-list", {
    extraAttributes: [
      "data-ln-list-window",
      "data-ln-list-window-page",
      "data-ln-list-window-threshold",
      "data-ln-list-count"
    ],
    onAttributeChange: function(r, s) {
      const e = r[n];
      if (!(!e || !e.isDataDriven)) {
        if (s === "data-ln-list-window") {
          const o = r.hasAttribute("data-ln-list-window");
          if (o && !e._windowed)
            e._enterWindowedMode(), e._kickWindowInitial();
          else if (!o && e._windowed)
            e._exitWindowedMode();
          else if (o && e._windowed) {
            const a = parseInt(r.getAttribute("data-ln-list-window"), 10);
            a > 0 && e._cache.configure({ windowSize: a });
          }
          return;
        }
        if (!(!e._windowed || !e._cache)) {
          if (s === "data-ln-list-window-page") {
            const o = parseInt(r.getAttribute("data-ln-list-window-page"), 10);
            o > 0 && e._cache.configure({ pageSize: o });
          } else if (s === "data-ln-list-window-threshold") {
            const o = parseInt(r.getAttribute("data-ln-list-window-threshold"), 10);
            o >= 0 && e._cache.configure({ threshold: o });
          } else if (s === "data-ln-list-count") {
            const o = parseInt(r.getAttribute("data-ln-list-count"), 10);
            o >= 0 && e._cache.setGrandTotal(o);
          }
        }
      }
    }
  });
})();
(function() {
  const t = "data-ln-circular-progress", n = "lnCircularProgress";
  if (window[n] !== void 0) return;
  const u = "http://www.w3.org/2000/svg", p = 36, l = 16, d = 2 * Math.PI * l;
  function c(b) {
    return this.dom = b, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, f.call(this), h.call(this), this;
  }
  c.prototype.destroy = function() {
    this.dom[n] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[n]);
  };
  function i(b, g) {
    const _ = document.createElementNS(u, b);
    for (const [m, r] of Object.entries(g))
      _.setAttribute(m, r);
    return _;
  }
  function f() {
    this.svg = i("svg", {
      viewBox: "0 0 " + p + " " + p,
      width: p,
      height: p
    }), this.svg.classList.add("ln-circular-progress__svg"), this.trackCircle = i("circle", {
      cx: p / 2,
      cy: p / 2,
      r: l,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = i("circle", {
      cx: p / 2,
      cy: p / 2,
      r: l,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": d,
      "stroke-dashoffset": d,
      transform: "rotate(-90 " + p / 2 + " " + p / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function h() {
    const b = this.dom.getAttribute("data-ln-circular-progress"), g = this.dom.getAttribute("data-ln-circular-progress-max"), _ = en(b, g || 100), m = d - _.percentage / 100 * d;
    this.progressCircle.setAttribute("stroke-dashoffset", m);
    const r = this.dom.getAttribute("data-ln-circular-progress-label"), s = r !== null ? r : Math.round(_.percentage) + "%";
    this.labelEl.textContent = s, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(_.min)), this.dom.setAttribute("aria-valuemax", String(_.max)), this.dom.setAttribute("aria-valuenow", String(_.clampedValue)), this.dom.setAttribute("aria-valuetext", s), S(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: _.value,
      max: _.max,
      percentage: _.percentage
    });
  }
  M(t, n, c, "ln-circular-progress", {
    extraAttributes: ["data-ln-circular-progress-max", "data-ln-circular-progress-label"],
    onAttributeChange: function(b) {
      const g = b[n];
      g && h.call(g);
    }
  });
})();
(function() {
  const t = "data-ln-sortable", n = "lnSortable", u = "data-ln-sortable-handle";
  if (window[n] !== void 0) return;
  function p(d) {
    this.dom = d, this.isEnabled = d.getAttribute(t) !== "disabled", this._dragging = null, d.setAttribute("aria-roledescription", "sortable list");
    const c = this;
    return this._onPointerDown = function(i) {
      c.isEnabled && c._handlePointerDown(i);
    }, d.addEventListener("pointerdown", this._onPointerDown), this;
  }
  p.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(t, "");
  }, p.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(t, "disabled");
  }, p.prototype.destroy = function() {
    this.dom[n] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), S(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[n]);
  }, p.prototype._handlePointerDown = function(d) {
    let c = d.target.closest("[" + u + "]"), i;
    if (c) {
      for (i = c; i && i.parentElement !== this.dom; )
        i = i.parentElement;
      if (!i || i.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + u + "]")) return;
      for (i = d.target; i && i.parentElement !== this.dom; )
        i = i.parentElement;
      if (!i || i.parentElement !== this.dom) return;
      c = i;
    }
    const h = Array.from(this.dom.children).indexOf(i);
    if (W(this.dom, "ln-sortable:before-drag", {
      item: i,
      index: h
    }).defaultPrevented) return;
    d.preventDefault(), c.setPointerCapture(d.pointerId), this._dragging = i, i.classList.add("ln-sortable--dragging"), i.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), S(this.dom, "ln-sortable:drag-start", {
      item: i,
      index: h
    });
    const g = this, _ = function(r) {
      g._handlePointerMove(r);
    }, m = function(r) {
      g._handlePointerEnd(r), c.removeEventListener("pointermove", _), c.removeEventListener("pointerup", m), c.removeEventListener("pointercancel", m);
    };
    c.addEventListener("pointermove", _), c.addEventListener("pointerup", m), c.addEventListener("pointercancel", m);
  }, p.prototype._handlePointerMove = function(d) {
    if (!this._dragging) return;
    const c = Array.from(this.dom.children), i = this._dragging;
    for (const f of c)
      f.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const f of c) {
      if (f === i) continue;
      const h = f.getBoundingClientRect(), b = h.top + h.height / 2;
      if (d.clientY >= h.top && d.clientY < b) {
        f.classList.add("ln-sortable--drop-before");
        break;
      } else if (d.clientY >= b && d.clientY <= h.bottom) {
        f.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, p.prototype._handlePointerEnd = function(d) {
    if (!this._dragging) return;
    const c = this._dragging, i = Array.from(this.dom.children), f = i.indexOf(c);
    let h = null, b = null;
    for (const g of i) {
      if (g.classList.contains("ln-sortable--drop-before")) {
        h = g, b = "before";
        break;
      }
      if (g.classList.contains("ln-sortable--drop-after")) {
        h = g, b = "after";
        break;
      }
    }
    for (const g of i)
      g.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (c.classList.remove("ln-sortable--dragging"), c.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), h && h !== c) {
      b === "before" ? this.dom.insertBefore(c, h) : this.dom.insertBefore(c, h.nextElementSibling);
      const _ = Array.from(this.dom.children).indexOf(c);
      S(this.dom, "ln-sortable:reordered", {
        item: c,
        oldIndex: f,
        newIndex: _
      });
    }
    this._dragging = null;
  };
  function l(d) {
    const c = d[n];
    if (!c) return;
    const i = d.getAttribute(t) !== "disabled";
    i !== c.isEnabled && (c.isEnabled = i, S(d, i ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: d }));
  }
  M(t, n, p, "ln-sortable", {
    onAttributeChange: l
  });
})();
(function() {
  const t = "data-ln-confirm", n = "lnConfirm", u = "data-ln-confirm-timeout";
  if (window[n] !== void 0) return;
  function l(c) {
    const i = parseFloat(c.getAttribute(u));
    return isNaN(i) || i <= 0 ? 3 : i;
  }
  function d(c) {
    this.dom = c, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = c.querySelector("[data-ln-confirm-idle]"), this.activeEl = c.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = c.textContent.trim(), this.confirmText = c.getAttribute(t) || "Confirm?");
    const i = this;
    return this._onClick = function(f) {
      if (!Be(f))
        if (!i.confirming)
          f.preventDefault(), f.stopImmediatePropagation(), i._enterConfirm();
        else {
          if (i._submitted) return;
          i._submitted = !0, f.stopPropagation(), i._reset();
        }
    }, c.addEventListener("click", this._onClick), this;
  }
  d.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const c = this.activeEl ? this.activeEl.textContent.trim() : "";
      c && (this.dom.setAttribute("aria-label", c), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const c = this.dom.querySelector("svg.ln-icon use");
      c && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = c.getAttribute("href"), c.setAttribute("href", "#ln-icon-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.dom.setAttribute("aria-label", this.confirmText), this.dom.setAttribute("aria-live", "polite")) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), S(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, d.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const c = this, i = l(this.dom) * 1e3;
    this.revertTimer = setTimeout(function() {
      c._reset();
    }, i);
  }, d.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const c = this.dom.querySelector("svg.ln-icon use");
      c && this.originalIconHref && c.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, d.prototype.destroy = function() {
    this.dom[n] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[n], S(this.dom, "ln-confirm:destroyed", { target: this.dom }));
  }, M(t, n, d, "ln-confirm");
})();
(function() {
  const t = "data-ln-translations", n = "lnTranslations";
  if (window[n] !== void 0) return;
  const u = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function p(l) {
    this.dom = l, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = l.getAttribute(t + "-default") || "", this.placeholderLabel = l.getAttribute(t + "-placeholder") || "{lang} translation", this.removeLabel = l.getAttribute(t + "-remove-label") || "Remove {lang}", this.badgesEl = l.querySelector("[" + t + "-active]"), this.menuEl = l.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const d = l.getAttribute(t + "-locales");
    if (this.locales = u, d)
      try {
        this.locales = JSON.parse(d);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const c = this;
    return this._onRequestAdd = function(i) {
      i.detail && i.detail.lang && c.addLanguage(i.detail.lang);
    }, this._onRequestRemove = function(i) {
      i.detail && i.detail.lang && c.removeLanguage(i.detail.lang);
    }, l.addEventListener("ln-translations:request-add", this._onRequestAdd), l.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  p.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const l = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const d of l) {
      const c = d.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const i of c)
        i.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, p.prototype._detectExisting = function() {
    const l = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const d of l) {
      const c = d.getAttribute("data-ln-translatable-lang");
      c && c !== this.defaultLang && this.activeLanguages.add(c);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, p.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const l = this;
    let d = 0;
    for (const i in this.locales) {
      if (!this.locales.hasOwnProperty(i) || this.activeLanguages.has(i)) continue;
      d++;
      const f = Ht("ln-translations-menu-item", "ln-translations");
      if (!f) return;
      const h = f.querySelector("[data-ln-translations-lang]");
      h.setAttribute("data-ln-translations-lang", i), h.textContent = this.locales[i], h.addEventListener("click", function(b) {
        b.ctrlKey || b.metaKey || b.button === 1 || (b.preventDefault(), b.stopPropagation(), l.menuEl.getAttribute("data-ln-toggle") === "open" && l.menuEl.setAttribute("data-ln-toggle", "close"), l.addLanguage(i));
      }), this.menuEl.appendChild(f);
    }
    const c = this.dom.querySelector("[" + t + "-add]");
    c && (c.hidden = d === 0);
  }, p.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const l = this;
    this.activeLanguages.forEach(function(d) {
      const c = Ht("ln-translations-badge", "ln-translations");
      if (!c) return;
      const i = c.querySelector("[data-ln-translations-lang]");
      i.setAttribute("data-ln-translations-lang", d);
      const f = i.querySelector("span");
      f.textContent = l.locales[d] || d.toUpperCase();
      const h = i.querySelector("button"), b = l.locales[d] || d.toUpperCase();
      h.setAttribute("aria-label", l.removeLabel.replace("{lang}", b)), h.addEventListener("click", function(g) {
        g.ctrlKey || g.metaKey || g.button === 1 || (g.preventDefault(), g.stopPropagation(), l.removeLanguage(d));
      }), l.badgesEl.appendChild(c);
    });
  }, p.prototype.addLanguage = function(l, d) {
    if (this.activeLanguages.has(l)) return;
    const c = this.locales[l] || l;
    if (W(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: l,
      langName: c
    }).defaultPrevented) return;
    this.activeLanguages.add(l), d = d || {};
    const f = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const h of f) {
      const b = h.getAttribute("data-ln-translatable"), g = h.getAttribute("data-ln-translations-prefix") || "", _ = h.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!_) continue;
      const m = _.cloneNode(_.tagName === "SELECT");
      g ? m.name = g + "[trans][" + l + "][" + b + "]" : m.name = "trans[" + l + "][" + b + "]", m.value = d[b] !== void 0 ? d[b] : "", m.removeAttribute("id"), "placeholder" in m && (m.placeholder = this.placeholderLabel.replace("{lang}", c)), m.setAttribute("data-ln-translatable-lang", l);
      const r = h.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), s = r.length > 0 ? r[r.length - 1] : _;
      s.parentNode.insertBefore(m, s.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: l,
      langName: c
    });
  }, p.prototype.removeLanguage = function(l) {
    if (!this.activeLanguages.has(l) || W(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: l
    }).defaultPrevented) return;
    const c = this.dom.querySelectorAll('[data-ln-translatable-lang="' + l + '"]');
    for (const i of c)
      i.parentNode.removeChild(i);
    this.activeLanguages.delete(l), this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: l
    });
  }, p.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, p.prototype.hasLanguage = function(l) {
    return this.activeLanguages.has(l);
  }, p.prototype.destroy = function() {
    if (!this.dom[n]) return;
    const l = this.defaultLang, d = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const c of d)
      c.getAttribute("data-ln-translatable-lang") !== l && c.parentNode.removeChild(c);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[n];
  }, M(t, n, p, "ln-translations");
})();
const qi = "ln-autosave:", xi = 1e3;
function ki(t, n) {
  return n ? qi + (t || "") + ":" + n : null;
}
function Ii(t, n = xi) {
  if (t == null) return 0;
  if (t === "") return n;
  const u = parseInt(String(t), 10);
  return isNaN(u) || u < 0 ? n : u;
}
(function() {
  const t = "data-ln-autosave", n = "lnAutosave", u = "data-ln-autosave-clear", p = "data-ln-autosave-debounce-input", l = '[data-ln-autosave-exclude], input[type="password"]';
  if (window[n] !== void 0) return;
  function d(i) {
    const f = i.tagName;
    return f === "INPUT" || f === "TEXTAREA" || f === "SELECT";
  }
  function c(i) {
    const h = i.getAttribute(t) || i.id, b = ki(window.location.pathname, h);
    if (!b) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", i);
      return;
    }
    this.dom = i, this.key = b;
    let g = null;
    function _() {
      const e = Ue(i, { exclude: l });
      try {
        localStorage.setItem(b, JSON.stringify(e));
      } catch {
        return;
      }
      S(i, "ln-autosave:saved", { target: i, data: e });
    }
    function m() {
      let e;
      try {
        e = localStorage.getItem(b);
      } catch {
        return;
      }
      if (!e) return;
      let o;
      try {
        o = JSON.parse(e);
      } catch {
        return;
      }
      if (W(i, "ln-autosave:before-restore", { target: i, data: o }).defaultPrevented) return;
      const y = ze(i, o);
      for (let v = 0; v < y.length; v++)
        y[v].dispatchEvent(new Event("input", { bubbles: !0 })), y[v].dispatchEvent(new Event("change", { bubbles: !0 }));
      S(i, "ln-autosave:restored", { target: i, data: o });
    }
    function r() {
      try {
        localStorage.removeItem(b);
      } catch {
        return;
      }
      S(i, "ln-autosave:cleared", { target: i });
    }
    this._onFocusout = function(e) {
      const o = e.target;
      d(o) && o.name && !o.matches(l) && _();
    }, this._onChange = function(e) {
      const o = e.target;
      d(o) && o.name && !o.matches(l) && _();
    }, this._onSubmit = function() {
      r();
    }, this._onReset = function() {
      r();
    }, this._onClearClick = function(e) {
      e.target.closest("[" + u + "]") && r();
    }, i.addEventListener("focusout", this._onFocusout), i.addEventListener("change", this._onChange), i.addEventListener("submit", this._onSubmit), i.addEventListener("reset", this._onReset), i.addEventListener("click", this._onClearClick);
    const s = Ii(i.getAttribute(p));
    return s > 0 && (this._onInput = function(e) {
      const o = e.target;
      !d(o) || !o.name || o.matches(l) || (g !== null && clearTimeout(g), g = setTimeout(_, s));
    }, i.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return g;
    }, m(), this;
  }
  c.prototype.destroy = function() {
    if (this.dom[n]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const i = this._getInputTimer();
        i !== null && clearTimeout(i);
      }
      S(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[n];
    }
  }, M(t, n, c, "ln-autosave");
})();
(function() {
  const t = "data-ln-autoresize", n = "lnAutoresize";
  if (window[n] !== void 0) return;
  function u(p) {
    if (p.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", p.tagName), this;
    this.dom = p;
    const l = this;
    return this._onInput = function() {
      l._resize();
    }, p.addEventListener("input", this._onInput), this._resize(), this;
  }
  u.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, u.prototype.destroy = function() {
    this.dom[n] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[n]);
  }, M(t, n, u, "ln-autoresize");
})();
(function() {
  const t = "data-ln-editor", n = "lnEditor";
  if (window[n] !== void 0) return;
  const u = {
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
  }, p = {
    bold: "bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "strikeThrough"
  }, l = {
    "heading-2": "h2",
    "heading-3": "h3",
    "heading-4": "h4",
    blockquote: "blockquote",
    code: "pre",
    paragraph: "p"
  }, d = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let c = 0;
  function i(e) {
    return !!(p[e] || l[e] || d[e] || e === "link");
  }
  function f(e) {
    this.dom = e;
    const o = this;
    if (this._textarea = e.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", e), this;
    const a = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), a && this._surface.setAttribute("data-placeholder", a);
    const y = this._textarea.id;
    if (y) {
      const C = e.querySelector('label[for="' + y + '"]');
      C && (C.id || (C.id = y + "-label"), this._surface.setAttribute("aria-labelledby", C.id));
    }
    this._surface.id = y ? y + "-surface" : "ln-editor-surface-" + ++c;
    const v = this._textarea.value.trim();
    v && (this._surface.innerHTML = v);
    const w = e.querySelector('[role="toolbar"]');
    if (w && w.nextSibling ? e.insertBefore(this._surface, w.nextSibling) : e.appendChild(this._surface), w) {
      w.setAttribute("aria-controls", this._surface.id);
      const C = w.querySelectorAll("[data-ln-editor-action]");
      for (let L = 0; L < C.length; L++) {
        const q = C[L].getAttribute("data-ln-editor-action");
        i(q) && C[L].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      o._syncToTextarea(), S(o.dom, "ln-editor:changed", {
        html: o._textarea.value,
        target: o.dom
      });
    }, this._onMousedownToolbar = function(C) {
      C.target.closest("[data-ln-editor-action]") && C.preventDefault();
    }, this._onClickToolbar = function(C) {
      const L = C.target.closest("[data-ln-editor-action]");
      if (!L) return;
      const q = L.getAttribute("data-ln-editor-action");
      o._execAction(q);
    }, this._onPaste = function(C) {
      g(o, C);
    }, this._onKeydown = function(C) {
      r(o, C);
    }, this._onSelectionChange = function() {
      document.contains(o._surface) && o._updateActiveStates();
    }, this._onFocus = function() {
      S(o.dom, "ln-editor:focus", { target: o.dom });
    }, this._onBlur = function() {
      o._syncToTextarea(), S(o.dom, "ln-editor:blur", { target: o.dom });
    }, this._onTextareaInput = function() {
      o._surface.innerHTML !== o._textarea.value && (o._surface.innerHTML = o._textarea.value, S(o.dom, "ln-editor:changed", {
        html: o._textarea.value,
        target: o.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), w && (w.addEventListener("mousedown", this._onMousedownToolbar), w.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(C) {
      const L = C.detail && C.detail.html;
      L !== void 0 && (o._surface.innerHTML = L, o._syncToTextarea(), S(o.dom, "ln-editor:changed", {
        html: o._textarea.value,
        target: o.dom
      }));
    }, e.addEventListener("ln-editor:set-content", this._onSetContent);
    const A = this._textarea.form;
    return A && (this._onFormReset = function() {
      setTimeout(function() {
        o._surface.innerHTML = o._textarea.value, S(e, "ln-editor:changed", {
          html: o._textarea.value,
          target: e
        });
      }, 0);
    }, A.addEventListener("reset", this._onFormReset)), this;
  }
  f.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, f.prototype._execAction = function(e) {
    if (!(!e || W(this.dom, "ln-editor:before-change", {
      action: e,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), p[e])
        document.execCommand(p[e], !1, null);
      else if (l[e]) {
        const a = l[e], y = h(this._surface);
        y && y.toLowerCase() === a ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + a + ">");
      } else d[e] ? document.execCommand(d[e], !1, null) : e === "link" ? s(this) : e === "unlink" ? document.execCommand("unlink", !1, null) : e === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, f.prototype._updateActiveStates = function() {
    const e = this.dom.querySelector('[role="toolbar"]');
    if (!e) return;
    const o = window.getSelection();
    if (!o || o.rangeCount === 0) return;
    const a = o.anchorNode;
    if (!a || !this._surface.contains(a)) return;
    const y = e.querySelectorAll("[data-ln-editor-action]");
    for (let v = 0; v < y.length; v++) {
      const w = y[v], A = w.getAttribute("data-ln-editor-action");
      let C = !1;
      if (p[A])
        try {
          C = document.queryCommandState(p[A]);
        } catch {
        }
      else if (l[A]) {
        const L = h(this._surface);
        C = L && L.toLowerCase() === l[A];
      } else if (d[A])
        try {
          C = document.queryCommandState(d[A]);
        } catch {
        }
      else A === "link" && (C = !!b(o.anchorNode, "A", this._surface));
      i(A) && w.setAttribute("aria-pressed", String(C)), C ? w.classList.add("ln-editor-active") : w.classList.remove("ln-editor-active");
    }
  }, f.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, f.prototype.setHTML = function(e) {
    this._surface && (this._surface.innerHTML = e, this._syncToTextarea(), S(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, f.prototype.destroy = function() {
    if (!this.dom[n]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const e = this.dom.querySelector('[role="toolbar"]');
    e && (e.removeEventListener("mousedown", this._onMousedownToolbar), e.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const o = this._textarea ? this._textarea.form : null;
    if (o && this._onFormReset && o.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const a = this.dom.querySelector(".ln-editor__link-popover");
      a && a.remove();
    }
    S(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[n];
  };
  function h(e) {
    const o = window.getSelection();
    if (!o || o.rangeCount === 0) return null;
    let a = o.anchorNode;
    if (!a) return null;
    for (; a && a !== e; ) {
      if (a.nodeType === 1) {
        const y = a.tagName;
        if (y === "H2" || y === "H3" || y === "H4" || y === "BLOCKQUOTE" || y === "PRE" || y === "P")
          return y;
      }
      a = a.parentNode;
    }
    return null;
  }
  function b(e, o, a) {
    for (; e && e !== a; ) {
      if (e.nodeType === 1 && e.tagName === o)
        return e;
      e = e.parentNode;
    }
    return null;
  }
  function g(e, o) {
    o.preventDefault();
    let a = "";
    if (o.clipboardData && (a = o.clipboardData.getData("text/html"), !a)) {
      const v = o.clipboardData.getData("text/plain");
      v && (a = v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), a = "<p>" + a + "</p>");
    }
    if (!a) return;
    const y = _(a);
    y && document.execCommand("insertHTML", !1, y);
  }
  function _(e) {
    const o = document.createElement("div");
    return o.innerHTML = e, m(o), o.innerHTML;
  }
  function m(e) {
    const o = Array.from(e.childNodes);
    for (let a = 0; a < o.length; a++) {
      const y = o[a];
      if (y.nodeType !== 3) {
        if (y.nodeType !== 1) {
          e.removeChild(y);
          continue;
        }
        if (u[y.tagName]) {
          const v = Array.from(y.attributes);
          for (let w = 0; w < v.length; w++) {
            const A = v[w].name;
            if (y.tagName === "A" && A === "href") {
              const C = y.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(C) || y.removeAttribute("href");
            } else
              y.removeAttribute(A);
          }
          y.tagName === "A" && y.setAttribute("rel", "noopener noreferrer"), m(y);
        } else {
          for (; y.firstChild; )
            e.insertBefore(y.firstChild, y);
          e.removeChild(y);
        }
      }
    }
  }
  function r(e, o) {
    if (!(o.ctrlKey || o.metaKey)) return;
    let a = null;
    switch (o.key.toLowerCase()) {
      case "b":
        a = "bold";
        break;
      case "i":
        a = "italic";
        break;
      case "u":
        a = "underline";
        break;
      case "k":
        a = "link";
        break;
    }
    a && (o.preventDefault(), e._execAction(a));
  }
  function s(e) {
    const o = window.getSelection();
    if (!o || o.rangeCount === 0) return;
    const a = b(o.anchorNode, "A", e._surface), y = o.getRangeAt(0).cloneRange();
    e._closeLinkPopover && e._closeLinkPopover();
    const v = pt(e.dom, "ln-editor-link-popover", "ln-editor");
    if (!v) return;
    const w = v.firstElementChild;
    if (!w) return;
    const A = w.querySelector('input[type="url"]'), C = w.querySelector('[data-ln-editor-action="confirm-link"]'), L = w.querySelector('[data-ln-editor-action="cancel-link"]');
    a && (A.value = a.getAttribute("href") || "");
    const q = e.dom.querySelector('[role="toolbar"]');
    q ? q.after(w) : e.dom.insertBefore(w, e._surface), A.focus();
    function x() {
      const H = window.getSelection();
      H.removeAllRanges(), H.addRange(y);
    }
    function D() {
      document.removeEventListener("mousedown", $), e._closeLinkPopover = null, w.remove();
    }
    function F() {
      const H = A.value.trim();
      if (D(), x(), e._surface.focus(), H)
        if (a)
          a.setAttribute("href", H), a.setAttribute("rel", "noopener noreferrer"), e._syncToTextarea(), S(e.dom, "ln-editor:changed", {
            html: e._textarea.value,
            target: e.dom
          });
        else {
          document.execCommand("createLink", !1, H);
          const U = window.getSelection();
          if (U && U.anchorNode) {
            const z = b(U.anchorNode, "A", e._surface);
            z && (z.setAttribute("rel", "noopener noreferrer"), e._syncToTextarea());
          }
        }
      else a && document.execCommand("unlink", !1, null);
    }
    function N() {
      D(), x(), e._surface.focus();
    }
    function B() {
      D();
    }
    function $(H) {
      const U = e.dom.contains(H.target) && H.target.closest('[data-ln-editor-action="link"]');
      !w.contains(H.target) && !U && B();
    }
    e._closeLinkPopover = D, C.addEventListener("click", F), L.addEventListener("click", N), A.addEventListener("keydown", function(H) {
      H.key === "Enter" ? (H.preventDefault(), F()) : H.key === "Escape" && (H.preventDefault(), N());
    }), document.addEventListener("mousedown", $);
  }
  M(t, n, f, "ln-editor");
})();
(function() {
  const t = "lnFill";
  if (window[t] !== void 0) return;
  const n = { lnFillForm: !0, lnFillStore: !0 };
  function u(l) {
    const d = {}, c = l.dataset;
    for (const i in c) {
      if (!i.startsWith("lnFill") || n[i]) continue;
      const f = i.slice(6);
      f && (d[f.charAt(0).toLowerCase() + f.slice(1)] = c[i]);
    }
    return d;
  }
  function p(l, d) {
    const c = window.CSS && CSS.escape ? CSS.escape(d) : d, i = document.querySelectorAll('[data-ln-fill-id="' + c + '"]');
    if (i.length === 0) return null;
    for (let f = 0; f < i.length; f++) {
      const h = i[f].getAttribute("data-ln-fill-form");
      if (h) {
        const b = document.getElementById(h);
        if (b && l.contains(b)) return i[f];
      }
    }
    return i[0];
  }
  document.addEventListener("click", function(l) {
    if (l.ctrlKey || l.metaKey || l.button === 1) return;
    const d = l.target.closest("[data-ln-fill-form]");
    if (!d) return;
    const c = d.getAttribute("href");
    if (c && c.indexOf("#") !== -1) return;
    const i = d.getAttribute("data-ln-fill-form"), f = document.getElementById(i);
    if (!f) return;
    const h = u(d), b = Object.keys(h).length > 0;
    window.lnCore.lnFill(f, b ? h : null);
  }), document.addEventListener("ln-fill:request", function(l) {
    const d = l.detail;
    if (!d) return;
    const c = l.target, i = d.id;
    if (i == null) {
      window.lnCore.lnFill(c, null);
      return;
    }
    const f = p(c, i);
    if (!f) return;
    const h = u(f);
    window.lnCore.lnFill(c, h);
  }), window[t] = !0;
})();
function Di(t, n = "-") {
  if (t == null) return "";
  const u = n || "-", p = u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, u).replace(new RegExp(`${p}+`, "g"), u).replace(new RegExp(`^${p}+|${p}+$`, "g"), "");
}
(function() {
  const t = "data-ln-slug-from", n = "lnSlug";
  if (window[n] !== void 0) return;
  function u(p) {
    if (p.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", p.tagName), this;
    const l = p.form;
    if (!l)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", p), this;
    const d = p.getAttribute(t), c = l.elements[d];
    if (!c)
      return console.warn('[ln-slug] Source field "' + d + '" not found in form:', p), this;
    if (typeof c.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + d + '" is a RadioNodeList (same-name group) — single source field required:', p), this;
    this.dom = p, this.source = c, this._pristine = p.value === "", this._mirroring = !1;
    const i = this;
    return this._onSource = function() {
      i._pristine && i._mirror();
    }, this._onSlug = function() {
      i._mirroring || (i._pristine = i.dom.value === "");
    }, c.addEventListener("input", this._onSource), p.addEventListener("input", this._onSlug), this._pristine && c.value && c.value.trim() !== "" && this._mirror(), this;
  }
  u.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = Di(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, u.prototype.destroy = function() {
    this.dom[n] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[n]);
  }, M(t, n, u, "ln-slug");
})();
function Ri(t, n = Date.now()) {
  if (!t)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const u = typeof n == "number" ? n : n.getTime(), p = t.getTime(), l = Math.floor((p - u) / 1e3), d = Math.abs(l);
  return d < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : d < 60 ? { value: l, unit: "second", isOlderThanMonth: !1 } : d < 3600 ? { value: Math.round(l / 60), unit: "minute", isOlderThanMonth: !1 } : d < 86400 ? { value: Math.round(l / 3600), unit: "hour", isOlderThanMonth: !1 } : d < 604800 ? { value: Math.round(l / 86400), unit: "day", isOlderThanMonth: !1 } : d < 2592e3 ? { value: Math.round(l / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(l / 2592e3), unit: "month", isOlderThanMonth: !0 };
}
function Ft(t, n, u = /* @__PURE__ */ new Date()) {
  switch (t) {
    case "full":
      return { dateStyle: "long", timeStyle: "short" };
    case "date":
      return { dateStyle: "medium" };
    case "time":
      return { timeStyle: "short" };
    case "short":
    default: {
      const p = { month: "short", day: "numeric" };
      return n && n.getFullYear() !== u.getFullYear() && (p.year = "numeric"), p;
    }
  }
}
(function() {
  const t = "data-ln-time", n = "lnTime";
  if (window[n] !== void 0) return;
  const u = {}, p = {};
  function l(w) {
    return w.getAttribute("data-ln-time-locale") || V(w);
  }
  function d(w, A) {
    const C = (w || "") + "|" + JSON.stringify(A);
    return u[C] || (u[C] = new Intl.DateTimeFormat(w, A)), u[C];
  }
  function c(w) {
    const A = w || "";
    return p[A] || (p[A] = new Intl.RelativeTimeFormat(w, { numeric: "auto", style: "narrow" })), p[A];
  }
  const i = /* @__PURE__ */ new Set();
  let f = null;
  function h() {
    f || (f = setInterval(g, 6e4));
  }
  function b() {
    f && (clearInterval(f), f = null);
  }
  function g() {
    for (const w of i) {
      if (!document.body.contains(w.dom)) {
        i.delete(w);
        continue;
      }
      o(w);
    }
    i.size === 0 && b();
  }
  function _(w, A) {
    const C = _t(A), L = (A || "").toLowerCase().split("-")[0], q = d(A, Ft("full", w)), x = q.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (C && x !== L && C.monthsLong) {
      const D = C.monthsLong[w.getMonth()], F = w.getDate(), N = w.getFullYear(), B = String(w.getHours()).padStart(2, "0"), $ = String(w.getMinutes()).padStart(2, "0");
      return `${F} ${D} ${N} во ${B}:${$}`;
    }
    return q.format(w);
  }
  function m(w, A) {
    const C = Ft("short", w), L = _t(A), q = (A || "").toLowerCase().split("-")[0], x = d(A, C), D = x.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (L && D !== q && L.monthsShort) {
      const F = L.monthsShort[w.getMonth()], N = w.getDate(), B = C.year ? " " + w.getFullYear() : "";
      return `${N} ${F}${B}`;
    }
    return x.format(w);
  }
  function r(w, A) {
    return d(A, Ft("date", w)).format(w);
  }
  function s(w, A) {
    return d(A, Ft("time", w)).format(w);
  }
  function e(w, A) {
    const C = Ri(w);
    return C.isOlderThanMonth ? m(w, A) : c(A).format(C.value, C.unit);
  }
  function o(w) {
    const A = w.dom.getAttribute("datetime");
    if (!A) return;
    const C = Y(A);
    if (!C) return;
    const L = w.dom.getAttribute(t) || "short", q = l(w.dom);
    let x;
    switch (L) {
      case "relative":
        x = e(C, q);
        break;
      case "full":
        x = _(C, q);
        break;
      case "date":
        x = r(C, q);
        break;
      case "time":
        x = s(C, q);
        break;
      default:
        x = m(C, q);
        break;
    }
    w.dom.textContent = x, L !== "full" && (w.dom.title = _(C, q));
  }
  function a(w) {
    this.dom = w;
    const A = this;
    return this._onLocaleChange = function() {
      o(A);
    }, Wt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), o(this), w.getAttribute(t) === "relative" && (i.add(this), h()), this;
  }
  a.prototype.render = function() {
    o(this);
  }, a.prototype.destroy = function() {
    this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), i.delete(this), i.size === 0 && b(), delete this.dom[n];
  };
  function y(w) {
    const A = w[n];
    if (!A) return;
    w.getAttribute(t) === "relative" ? (i.add(A), h()) : (i.delete(A), i.size === 0 && b()), o(A);
  }
  function v(w) {
    w.nodeType === 1 && w.hasAttribute && w.hasAttribute(t) && w[n] && o(w[n]);
  }
  M(t, n, a, "ln-time", {
    extraAttributes: ["datetime", "data-ln-time-locale", "lang"],
    onAttributeChange: y,
    onInit: v
  });
})();
function Oi(t = {}) {
  let n = t.windowSize > 0 ? t.windowSize : 1e3, u = t.pageSize > 0 ? t.pageSize : 200, p = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const l = typeof t.requestPage == "function" ? t.requestPage : () => {
  }, d = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Set();
  let i = 0, f = 0, h = 0, b = !1, g = null;
  function _(s, e) {
    d.delete(s), d.set(s, e);
  }
  function m() {
    if (d.size <= n) return [];
    const s = [];
    for (; d.size > n; ) {
      const o = d.keys().next().value;
      s.push(d.get(o)), d.delete(o);
    }
    const e = new Set(d.values());
    return s.filter((o) => !e.has(o));
  }
  function r(s, e) {
    c.add(s), clearTimeout(g), g = setTimeout(() => l(s, u, e), p);
  }
  return {
    get logicalTotal() {
      return i;
    },
    set logicalTotal(s) {
      i = s;
    },
    get grandTotal() {
      return f;
    },
    set grandTotal(s) {
      f = s;
    },
    get queryGen() {
      return h;
    },
    set queryGen(s) {
      h = s;
    },
    get size() {
      return d.size;
    },
    // Whether a server ordering exists for the current query at all — false
    // from reset() until the first ingest(). Distinct from a missing page.
    get hasLoaded() {
      return b;
    },
    getId: (s) => {
      if (!d.has(s)) return;
      const e = d.get(s);
      return _(s, e), e;
    },
    ensure: (s, e, o) => {
      if (!b && !c.has(0)) return r(0, o);
      if (i <= 0) return;
      const a = Math.max(0, s), y = Math.min(i, e);
      for (let v = a; v < y; v++)
        if (!d.has(v)) {
          const w = Math.floor(v / u) * u;
          if (!c.has(w)) return r(w, o);
        }
    },
    ingest: (s, e, o, a, y) => {
      if (y != null && y !== h) return [];
      b = !0, o != null && (f = o), a != null && (i = a);
      for (let v = 0; v < e.length; v++)
        _(s + v, e[v]);
      return c.delete(s), m();
    },
    reset: function() {
      h++, this.clear();
    },
    clear: () => {
      b = !1, d.clear(), c.clear(), clearTimeout(g);
    },
    configure: (s = {}) => {
      s.windowSize > 0 && s.windowSize !== n && (n = s.windowSize, m()), s.pageSize > 0 && (u = s.pageSize), s.fetchDebounce >= 0 && (p = s.fetchDebounce);
    }
  };
}
function Mi(t, n, u) {
  if (!Array.isArray(t) || !n || !n.field) return t;
  const { field: p, direction: l } = n, d = l === "desc", c = t.map((f) => f ? f[p] : void 0), i = ue(c);
  return [...t].sort((f, h) => {
    const b = f ? f[p] : void 0, g = h ? h[p] : void 0, _ = he(b, g, i, u);
    return d ? -_ : _;
  });
}
function bn(t, n) {
  if (!Array.isArray(t) || !n || typeof n != "object") return t;
  const u = Object.keys(n).filter((p) => Array.isArray(n[p]) && n[p].length > 0);
  return u.length ? t.filter((p) => p ? u.every((l) => ge(p[l], n[l])) : !1) : t;
}
function Fi(t, n, u) {
  if (!Array.isArray(t) || !n || !u || !u.length) return t;
  const p = rn(n);
  return p.length ? t.filter((l) => l ? p.every(
    (d) => u.some((c) => {
      const i = l[c];
      return i != null && on(String(i), [d]);
    })
  ) : !1) : t;
}
function Ni(t, n, u) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (u === "count") return t.length;
  const p = t.map((d) => d && d[n] != null ? parseFloat(d[n]) : NaN).filter((d) => Number.isFinite(d)), l = p.reduce((d, c) => d + c, 0);
  return u === "sum" ? l : u === "avg" && p.length ? l / p.length : 0;
}
function Pi(t, n = {}, u = [], p) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const l = t.length;
  let d = t;
  n.filters && (d = bn(d, n.filters)), n.search && (d = Fi(d, n.search, u));
  const c = d.length;
  if (n.sort && (d = Mi(d, n.sort, p)), n.offset || n.limit) {
    const i = n.offset || 0, f = n.limit || d.length;
    d = d.slice(i, i + f);
  }
  return { records: d, total: l, filtered: c };
}
function Bi(t, n) {
  return !Array.isArray(t) || !n || typeof n != "object" ? t : t.map((u) => {
    if (!u) return null;
    const p = { ...u };
    for (const [l, d] of Object.entries(n))
      if (typeof d == "function")
        try {
          p[l] = d(u);
        } catch {
          p[l] = void 0;
        }
    return p;
  });
}
(function() {
  const t = "data-ln-data-store", n = "lnDataStore", u = "data-ln-data-store-no-local-query";
  if (window[n] !== void 0) return;
  const p = "ln_app_cache", l = "_meta", d = "1.0";
  let c = null, i = null;
  const f = {};
  function h(E) {
    E && E.name === "QuotaExceededError" && S(document, "ln-data-store:quota-exceeded", { error: E });
  }
  function b() {
    const E = {};
    for (const T of document.querySelectorAll(`[${t}]`)) {
      const k = T.id;
      if (k) {
        const I = T.getAttribute("data-ln-data-store-indexes") || "";
        E[k] = {
          indexes: I.split(",").map((R) => R.trim()).filter(Boolean)
        };
      }
    }
    return E;
  }
  function g() {
    return i || (i = new Promise((E) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), E(null);
      const T = b(), k = Object.keys(T), I = indexedDB.open(p);
      I.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), E(null);
      }, I.onsuccess = (R) => {
        const O = R.target.result, P = Array.from(O.objectStoreNames);
        if (!(!P.includes(l) || k.some((rt) => !P.includes(rt))))
          return _(O), c = O, E(O);
        const j = O.version;
        O.close();
        const G = indexedDB.open(p, j + 1);
        G.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, G.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), E(null);
        }, G.onupgradeneeded = (rt) => {
          const J = rt.target.result;
          J.objectStoreNames.contains(l) || J.createObjectStore(l, { keyPath: "key" });
          for (const mt of k)
            if (!J.objectStoreNames.contains(mt)) {
              const Ct = J.createObjectStore(mt, { keyPath: "id" });
              for (const Yt of T[mt].indexes)
                Ct.createIndex(Yt, Yt, { unique: !1 });
            }
        }, G.onsuccess = (rt) => {
          const J = rt.target.result;
          _(J), c = J, E(J);
        };
      };
    }), i);
  }
  function _(E) {
    E.onversionchange = () => {
      E.close(), c = null, i = null;
    };
  }
  function m() {
    return c ? Promise.resolve(c) : (i = null, g());
  }
  async function r(E) {
    if (!ut() || !E) return E;
    const T = { ...E }, k = T.id, I = await jn(T);
    return !I || !I.encrypted ? E : {
      id: k,
      encrypted: !0,
      iv: I.iv,
      data: I.data
    };
  }
  async function s(E) {
    return !E || !E.encrypted || !ut() ? E : Vn(E);
  }
  const e = (E, T) => m().then((k) => k ? k.transaction(E, T).objectStore(E) : null);
  function o(E) {
    return new Promise((T, k) => {
      E.onsuccess = () => T(E.result), E.onerror = () => {
        h(E.error), k(E.error);
      };
    });
  }
  const a = (E) => e(E, "readonly").then((T) => T ? o(T.getAll()) : []).then((T) => ut() ? Promise.all(T.map((k) => s(k))) : T), y = (E, T) => e(E, "readonly").then((k) => k ? o(k.get(T)) : null).then((k) => k ? s(k) : null), v = (E, T) => m().then((k) => {
    if (!k) return [];
    const R = k.transaction(E, "readonly").objectStore(E), O = T.map((P) => o(R.get(P)));
    return Promise.all(O).then((P) => ut() ? Promise.all(P.map((K) => s(K))) : P);
  }), w = (E, T) => (ut() ? r(T) : Promise.resolve(T)).then((I) => e(E, "readwrite").then((R) => R ? o(R.put(I)) : null)), A = (E, T) => e(E, "readwrite").then((k) => k ? o(k.delete(T)) : null), C = (E) => e(E, "readwrite").then((T) => T ? o(T.clear()) : null), L = (E) => e(E, "readonly").then((T) => T ? o(T.count()) : 0), q = (E) => e(l, "readonly").then((T) => T ? o(T.get(E)) : null), x = (E, T) => e(l, "readwrite").then((k) => {
    if (k)
      return T.key = E, o(k.put(T));
  });
  function D(E) {
    this.dom = E, this._name = E.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", E);
    const T = E.getAttribute("data-ln-data-store-stale"), k = parseInt(T, 10);
    this._staleThreshold = T === "never" || T === "-1" ? -1 : isNaN(k) ? 300 : k;
    const I = E.getAttribute("data-ln-data-store-search-fields") || "";
    this._searchFields = I.split(",").map((O) => O.trim()).filter(Boolean), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null };
    const R = E.getAttribute("data-ln-data-store-window");
    if (R !== null) {
      const O = parseInt(R, 10) || 1e3, P = parseInt(E.getAttribute("data-ln-data-store-window-page"), 10) || 200;
      this._windowIndex = Oi({
        windowSize: O,
        pageSize: P,
        requestPage: (K, j, G) => {
          S(this.dom, "ln-data-store:request-page", {
            store: this._name,
            offset: K,
            limit: j,
            query: G,
            queryGen: this._windowIndex.queryGen
          });
        }
      });
    } else
      this._windowIndex = null;
    return this.windowed = this._windowIndex !== null, this.noLocalQuery = E.hasAttribute(u), this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), f[this._name] = this, F(this), this.ready = wn(this), this;
  }
  function F(E) {
    E._handlers = {
      create: (T) => N(E, "create", T.detail, () => $(E, T.detail)),
      update: (T) => N(E, "update", T.detail, () => H(E, T.detail)),
      delete: (T) => N(E, "delete", T.detail, () => U(E, T.detail)),
      "bulk-delete": (T) => N(E, "bulk-delete", T.detail, () => z(E, T.detail)),
      "sync-failed": (T) => {
        E.isSyncing = !1, S(E.dom, "ln-data-store:sync-error", {
          store: E._name,
          error: T.detail && T.detail.error,
          status: T.detail && T.detail.status
        });
      }
    };
    for (const [T, k] of Object.entries(E._handlers))
      E.dom.addEventListener(`ln-data-store:request-${T}`, k);
    E._queryHandlers = {
      "ln-search:change": (T) => {
        T.preventDefault();
        const k = T.detail && T.detail.term != null ? T.detail.term : "";
        k !== E.query.search && (E.query.search = k, Xt(E));
      },
      "ln-filter:change": (T) => {
        T.preventDefault();
        const k = T.detail && T.detail.key;
        if (!k) return;
        const I = (T.detail.values || []).slice(), R = E.query.filters[k];
        (R ? R.length === I.length && R.every((P, K) => P === I[K]) : !I.length) || (I.length ? E.query.filters[k] = I : delete E.query.filters[k], Xt(E));
      },
      "ln-sort:change": (T) => {
        T.preventDefault();
        const k = T.detail && T.detail.field, I = T.detail && T.detail.direction, R = I && I !== "none" ? { field: k, direction: I } : null, O = E.query.sort;
        !O && !R || O && R && O.field === R.field && O.direction === R.direction || (E.query.sort = R, Xt(E));
      }
    };
    for (const [T, k] of Object.entries(E._queryHandlers))
      E.dom.addEventListener(T, k);
  }
  function N(E, T, k, I) {
    const R = k && k.requestId;
    return E._mutationChain = E._mutationChain.then(() => E.ready).then(() => {
      if (E.initializationError) throw E.initializationError;
      return I();
    }).catch((O) => st(E, T, R, O)), E._mutationChain;
  }
  function B(E, T = 0) {
    return L(E._name).then((k) => {
      if (E._windowIndex || E.windowed) {
        const I = E.totalCount != null ? E.totalCount : k;
        E.totalCount = Math.max(0, I + T);
      } else
        E.totalCount = k;
      return E.hasCache = !0, E.isLoaded = !0, E.canServe = !0, x(E._name, {
        schema_version: d,
        last_synced_at: E.lastSyncedAt,
        has_cache: !0,
        record_count: E.totalCount
      });
    });
  }
  function $(E, { tempId: T, data: k = {}, requestId: I } = {}) {
    const R = { ...k, id: T };
    return w(E._name, R).then(() => B(E, 1)).then(() => {
      S(E.dom, "ln-data-store:created", { store: E._name, record: R, tempId: T, requestId: I });
    });
  }
  function H(E, { id: T, data: k = {}, requestId: I } = {}) {
    return y(E._name, T).then((R) => {
      if (!R) throw new Error(`Record not found: ${T}`);
      const O = { ...R, ...k }, P = k.id;
      return (P !== void 0 && P !== T ? En(E._name, T, O) : w(E._name, O)).then(() => B(E, 0)).then(() => {
        S(E.dom, "ln-data-store:updated", { store: E._name, record: O, previous: R, requestId: I });
      });
    });
  }
  function U(E, { id: T, requestId: k } = {}) {
    return y(E._name, T).then((I) => {
      if (!I) {
        S(E.dom, "ln-data-store:deleted", { store: E._name, id: T, requestId: k, missing: !0 });
        return;
      }
      return A(E._name, T).then(() => B(E, -1)).then(() => {
        S(E.dom, "ln-data-store:deleted", { store: E._name, id: T, requestId: k });
      });
    });
  }
  function z(E, { ids: T = [], requestId: k } = {}) {
    return T.length ? Promise.all(T.map((I) => y(E._name, I))).then((I) => {
      const R = I.filter(Boolean).map((O) => O.id);
      return Qt(E._name, R).then(() => B(E, -R.length)).then(() => {
        S(E.dom, "ln-data-store:deleted", { store: E._name, ids: R, requestId: k });
      });
    }) : (S(E.dom, "ln-data-store:deleted", { store: E._name, ids: [], requestId: k }), Promise.resolve());
  }
  function st(E, T, k, I) {
    console.error("[ln-data-store] " + T + " failed:", I), S(E.dom, "ln-data-store:mutation-error", {
      store: E._name,
      action: T,
      requestId: k,
      error: I
    });
  }
  function wn(E) {
    return g().then((T) => {
      if (!T) throw new Error("IndexedDB is unavailable");
      return q(E._name);
    }).then((T) => {
      if (E.initializationError = null, T && T.schema_version === d)
        E.lastSyncedAt = T.last_synced_at || null, E.totalCount = T.record_count || 0, E.hasCache = T.has_cache === !0 || E.totalCount > 0, E.hasCache && (E.isLoaded = !0, E.canServe = !0, S(E.dom, "ln-data-store:ready", { store: E._name, count: E.totalCount, source: "cache" })), E.isInitialized = !0, S(E.dom, "ln-data-store:initialized", { store: E._name, hasCache: E.hasCache, lastSyncedAt: E.lastSyncedAt, count: E.totalCount });
      else {
        if (T && T.schema_version !== d)
          return C(E._name).then(() => x(E._name, { schema_version: d, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            E.isInitialized = !0, E.hasCache = !1, S(E.dom, "ln-data-store:initialized", { store: E._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        E.isInitialized = !0, E.hasCache = !1, S(E.dom, "ln-data-store:initialized", { store: E._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((T) => (E.isInitialized = !0, E.isLoaded = !1, E.canServe = !1, E.hasCache = !1, E.isSyncing = !1, E.initializationError = T, S(E.dom, "ln-data-store:initialization-error", { store: E._name, error: T }), { ok: !1, error: T }));
  }
  function ye(E) {
    E.isSyncing = !0, S(E.dom, "ln-data-store:request-remote-sync", { since: E.lastSyncedAt });
  }
  function ve(E, T) {
    return m().then((k) => k ? (ut() ? Promise.all(T.map((R) => r(R))) : Promise.resolve(T)).then((R) => new Promise((O, P) => {
      const K = k.transaction(E, "readwrite"), j = K.objectStore(E);
      R.forEach((G) => j.put(G)), K.oncomplete = () => O(), K.onerror = () => {
        h(K.error), P(K.error);
      };
    })) : void 0);
  }
  function Qt(E, T) {
    return m().then((k) => {
      if (k)
        return new Promise((I, R) => {
          const O = k.transaction(E, "readwrite"), P = O.objectStore(E);
          T.forEach((K) => P.delete(K)), O.oncomplete = () => I(), O.onerror = () => R(O.error);
        });
    });
  }
  function En(E, T, k) {
    return (ut() ? r(k) : Promise.resolve(k)).then((R) => m().then((O) => {
      if (O)
        return new Promise((P, K) => {
          const j = O.transaction(E, "readwrite"), G = j.objectStore(E);
          G.put(R), G.delete(T), j.oncomplete = () => P(), j.onerror = () => {
            h(j.error), K(j.error);
          };
        });
    }));
  }
  const An = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function Sn(E) {
    return E ? Object.keys(E).filter((T) => Array.isArray(E[T]) && E[T].length > 0) : [];
  }
  function Cn(E, T, k) {
    return T.every((I) => k[I].map(String).includes(String(E[I])));
  }
  function Ln(E) {
    return String(E || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function Tn(E, T, k) {
    return T.every(
      (I) => k.some((R) => {
        const O = E[R];
        return O != null && String(O).toLowerCase().includes(I);
      })
    );
  }
  function qn(E, T, k) {
    return Ni(E, T, k);
  }
  function St(E, T) {
    return Bi(T, E.presenters && E.presenters.computed);
  }
  function xn(E) {
    return !E.sort && !ut();
  }
  function kn(E, T, k) {
    const I = Sn(T.filters), R = T.search ? Ln(T.search) : [], O = E._searchFields, P = R.length > 0 && O && O.length > 0;
    return e(E._name, "readonly").then((K) => K ? new Promise((j, G) => {
      const rt = [], J = K.openCursor();
      J.onsuccess = () => {
        const mt = J.result;
        if (!mt || rt.length >= k) {
          j(rt);
          return;
        }
        const Ct = mt.value;
        (!I.length || Cn(Ct, I, T.filters)) && (!P || Tn(Ct, R, O)) && rt.push(Ct), mt.continue();
      }, J.onerror = () => G(J.error);
    }) : []);
  }
  function we(E, T, k) {
    return Pi(T, k, E._searchFields, An);
  }
  function Ee(E, T, k) {
    const I = [];
    for (let O = T; O < T + k; O++) {
      const P = E._windowIndex.getId(O);
      I.push(P);
    }
    const R = Array.from(new Set(I.filter((O) => O !== void 0)));
    return v(E._name, R).then((O) => {
      const P = /* @__PURE__ */ new Map();
      for (let j = 0; j < O.length; j++) {
        const G = O[j];
        G && P.set(String(G.id), G);
      }
      const K = [];
      for (let j = 0; j < I.length; j++) {
        const G = I[j];
        if (G === void 0)
          K.push(null);
        else {
          const rt = P.get(String(G));
          K.push(rt || null);
        }
      }
      return {
        data: St(E, K),
        total: E._windowIndex.grandTotal,
        filtered: E._windowIndex.logicalTotal,
        offset: T,
        queryGen: E._windowIndex.queryGen
      };
    });
  }
  D.prototype.getAll = function(E = {}) {
    const T = this;
    if (T._windowIndex) {
      const k = E.offset || 0, I = E.limit || 200;
      if (T._windowIndex.ensure(k, k + I, E), !T._windowIndex.hasLoaded && !T.noLocalQuery) {
        const R = k + I, O = (P) => P.length ? {
          data: St(T, P),
          offset: k,
          queryGen: T._windowIndex.queryGen,
          provisional: !0
        } : Ee(T, k, I);
        return xn(E) ? kn(T, E, R).then((P) => O(P.slice(k, R))) : a(T._name).then((P) => O(we(T, P, E).records));
      }
      return Ee(T, k, I);
    }
    return a(T._name).then((k) => {
      const I = we(T, k, E);
      return {
        data: St(T, I.records),
        total: I.total,
        filtered: I.filtered
      };
    });
  }, D.prototype.getById = function(E) {
    return y(this._name, E).then((T) => T ? St(this, [T])[0] : null);
  }, D.prototype.count = function(E) {
    return E && Object.keys(E).length > 0 ? a(this._name).then((k) => bn(k, E).length) : this.totalCount != null ? Promise.resolve(this.totalCount) : L(this._name);
  }, D.prototype.aggregate = function(E, T) {
    return a(this._name).then((k) => qn(k, E, T));
  }, D.prototype.setPresenters = function(E) {
    this.presenters = E;
  }, D.prototype.applySync = function(E, T, k, I) {
    I = I || {};
    const R = this;
    if (R._windowIndex && I.queryGen != null && I.queryGen !== R._windowIndex.queryGen)
      return Promise.resolve();
    E.length > 0 || T.length > 0;
    let O = Promise.resolve();
    return E.length > 0 && (O = O.then(() => ve(R._name, E))), T.length > 0 && (O = O.then(() => Qt(R._name, T))), O.then(() => {
      if (R._windowIndex && (I.offset != null || I.total != null)) {
        const P = I.offset != null ? I.offset : 0, K = E.map((G) => G.id), j = R._windowIndex.ingest(P, K, I.total, I.filtered, I.queryGen);
        if (j && j.length) return Qt(R._name, j);
      }
    }).then(() => L(R._name)).then((P) => (R.totalCount = I.total !== void 0 ? I.total : P, R.hasCache = !0, x(R._name, {
      schema_version: d,
      last_synced_at: k,
      has_cache: !0,
      record_count: R.totalCount
    }))).then(() => {
      const P = !R.isLoaded;
      R.isLoaded = !0, R.canServe = !0, R.isSyncing = !1, R.lastSyncedAt = k, P ? (S(R.dom, "ln-data-store:loaded", { store: R._name, count: R.totalCount, meta: I }), S(R.dom, "ln-data-store:ready", { store: R._name, count: R.totalCount, source: "server", meta: I })) : S(R.dom, "ln-data-store:synced", {
        store: R._name,
        added: E.length,
        deleted: T.length,
        changed: !0,
        meta: I
      });
    }).catch((P) => {
      R.isSyncing = !1, console.error("[ln-data-store] applySync failed:", P);
    });
  }, D.prototype.applyQuery = function(E, T) {
    T = T || {};
    const k = this;
    let I = Promise.resolve();
    return E.length > 0 && (I = I.then(() => ve(k._name, E))), I.then(() => L(k._name)).then((R) => (k.totalCount = T.total !== void 0 ? T.total : R, E.length > 0 && (k.canServe = !0), St(k, E))).catch((R) => (console.error("[ln-data-store] applyQuery failed:", R), []));
  }, D.prototype.forceSync = function() {
    this.isSyncing || ye(this);
  }, D.prototype.fullReload = function() {
    const E = this;
    return C(E._name).then(() => x(E._name, {
      schema_version: d,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      E.isLoaded = !1, E.hasCache = !1, E.lastSyncedAt = null, E.totalCount = 0, ye(E);
    });
  }, D.prototype.destroy = function() {
    if (this._windowIndex && (this._windowIndex.clear(), this._windowIndex = null, this.windowed = !1), this._handlers) {
      for (const [E, T] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${E}`, T);
      this._handlers = null;
    }
    if (this._queryHandlers) {
      for (const [E, T] of Object.entries(this._queryHandlers))
        this.dom.removeEventListener(E, T);
      this._queryHandlers = null;
    }
    delete f[this._name], delete this.dom[n], S(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function In() {
    return m().then((E) => {
      if (!E) return;
      const T = Array.from(E.objectStoreNames);
      return new Promise((k, I) => {
        const R = E.transaction(T, "readwrite");
        T.forEach((O) => R.objectStore(O).clear()), R.oncomplete = () => k(), R.onerror = () => I(R.error);
      });
    }).then(() => {
      Object.values(f).forEach((E) => {
        E.isLoaded = !1, E.canServe = !1, E.isInitialized = !1, E.initializationError = null, E.hasCache = !1, E.isSyncing = !1, E.lastSyncedAt = null, E.totalCount = 0;
      });
    });
  }
  function Xt(E) {
    E._windowIndex && E._windowIndex.reset(), S(E.dom, "ln-data-store:query-changed", {
      store: E._name,
      query: {
        filters: Object.assign({}, E.query.filters),
        search: E.query.search,
        sort: E.query.sort ? Object.assign({}, E.query.sort) : null
      }
    });
  }
  function Dn(E, T) {
    const k = E[n];
    !k || T !== u || (k.noLocalQuery = E.hasAttribute(u));
  }
  M(t, n, D, "ln-data-store", {
    extraAttributes: [u],
    onAttributeChange: Dn
  }), window[n].clearAll = In, window[n].init = window[n], window[n].setStorageKey = Se, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Se);
})();
const Hi = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function gt(...t) {
  return t.filter((n) => n != null && n !== "").map((n, u) => {
    const p = String(n);
    return u === 0 ? p.replace(/\/+$/, "") : p.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function Ui(t, n) {
  if (!t || typeof t != "object") return "";
  const u = Object.assign({}, Hi);
  if (n && typeof n == "object")
    for (const l in n)
      n[l] !== void 0 && n[l] !== null && n[l] !== "" && (u[l] = n[l]);
  const p = new URLSearchParams();
  return t.search && p.append(u.search, t.search), t.offset != null && p.append(u.offset, t.offset), t.limit != null && p.append(u.limit, t.limit), t.sort && t.sort.field && t.sort.direction && (p.append(u.sortField, t.sort.field), p.append(u.sortDir, t.sort.direction)), t.filters && typeof t.filters == "object" && Object.keys(t.filters).forEach((l) => {
    const d = t.filters[l];
    Array.isArray(d) && d.length > 0 && p.append(l, d.join(","));
  }), p.toString();
}
function zi(t, n, u) {
  let p = gt(t, n);
  return u && (p += (p.indexOf("?") !== -1 ? "&" : "?") + u), p;
}
function Oe(t) {
  const n = t && t.content !== void 0 ? t.content : t, u = t && t.message ? t.message : null;
  return { record: n, message: u };
}
(function() {
  const t = "data-ln-api-connector", n = "lnApiConnector", u = "lnConnector";
  if (window[n] !== void 0) return;
  function p(i) {
    return i.ok ? i.status === 204 ? null : i.json() : i.json().catch(() => null).then((f) => {
      const h = new Error("HTTP " + i.status + ": " + i.statusText);
      throw h.status = i.status, h.data = f, h;
    });
  }
  function l(i) {
    return this.dom = i, i[n] = this, i[u] = this, this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, d(this), this;
  }
  l.prototype.refreshConfig = function() {
    const i = this.dom;
    this.baseUrl = i.getAttribute("data-ln-api-base-url") || "", this.path = i.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin", this.rawHeaders = i.getAttribute("data-ln-api-headers"), this.headers = We(this.rawHeaders);
    const f = {}, h = i.getAttribute("data-ln-api-param-offset");
    h && (f.offset = h);
    const b = i.getAttribute("data-ln-api-param-limit");
    b && (f.limit = b);
    const g = i.getAttribute("data-ln-api-param-search");
    g && (f.search = g);
    const _ = i.getAttribute("data-ln-api-param-sort-field");
    _ && (f.sortField = _);
    const m = i.getAttribute("data-ln-api-param-sort-dir");
    m && (f.sortDir = m), this.paramKeys = f;
    const r = i.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = r !== null ? +r : 300, S(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, l.prototype._reqHeaders = function(i) {
    const f = Object.assign({}, this.headers);
    return !f.Accept && !f.accept && (f.Accept = "application/json"), !f["Content-Type"] && !f["content-type"] && (f["Content-Type"] = "application/json"), i && (f["X-Idempotency-Key"] = i), f;
  }, l.prototype.cancel = function(i) {
    return i && this._inflight.has(i) ? (this._inflight.get(i).abort(), this._inflight.delete(i), !0) : !1;
  }, l.prototype.fetchDelta = function(i, f) {
    const h = this;
    let b = gt(h.baseUrl, h.path);
    i != null && i !== "" && (b += (b.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(i));
    const g = f || "sync";
    h._inflight.has(g) && h._inflight.get(g).abort();
    const _ = new AbortController();
    return h._inflight.set(g, _), window.fetch(b, {
      method: "GET",
      headers: h._reqHeaders(),
      credentials: h.credentials,
      signal: _.signal
    }).then(p).finally(function() {
      h._inflight.get(g) === _ && h._inflight.delete(g);
    });
  }, l.prototype.query = function(i, f) {
    const h = this, b = Ui(i, h.paramKeys), g = zi(h.baseUrl, h.path, b), _ = f || "query";
    h._inflight.has(_) && h._inflight.get(_).abort();
    const m = new AbortController();
    return h._inflight.set(_, m), window.fetch(g, {
      method: "GET",
      headers: h._reqHeaders(),
      credentials: h.credentials,
      signal: m.signal
    }).then(p).finally(function() {
      h._inflight.get(_) === m && h._inflight.delete(_);
    });
  }, l.prototype.create = function(i, f, h) {
    const b = this;
    return window.fetch(gt(b.baseUrl, f || b.path), {
      method: "POST",
      headers: b._reqHeaders(h),
      credentials: b.credentials,
      body: JSON.stringify(i)
    }).then(p);
  }, l.prototype.update = function(i, f, h, b, g) {
    const _ = this;
    h != null && (f = Object.assign({}, f, { expected_version: h }));
    const m = b ? gt(_.baseUrl, b) : gt(_.baseUrl, _.path, i);
    return window.fetch(m, {
      method: "PUT",
      headers: _._reqHeaders(g),
      credentials: _.credentials,
      body: JSON.stringify(f)
    }).then(p);
  }, l.prototype.delete = function(i, f, h) {
    const b = this;
    return window.fetch(gt(b.baseUrl, f || b.path, i), {
      method: "DELETE",
      headers: b._reqHeaders(h),
      credentials: b.credentials
    }).then(p);
  }, l.prototype.bulkDelete = function(i, f, h) {
    const b = this;
    return window.fetch(gt(b.baseUrl, f || b.path, "bulk-delete"), {
      method: "DELETE",
      headers: b._reqHeaders(h),
      credentials: b.credentials,
      body: JSON.stringify({ ids: i })
    }).then(p);
  };
  function d(i) {
    i._handlers = {
      sync: function(f) {
        const h = f.detail || {}, b = h.meta && h.meta.targetEl ? h.meta.targetEl : null;
        i.fetchDelta(h.since, b).then(function(g) {
          S(i.dom, "ln-api-connector:fetched", { data: g, since: h.since, meta: h.meta || null });
        }).catch(function(g) {
          g && g.name === "AbortError" || S(i.dom, "ln-api-connector:error", {
            action: "sync",
            error: g.message,
            status: g.status || 0,
            data: g.data || null,
            since: h.since,
            meta: h.meta || null
          });
        });
      },
      query: function(f) {
        const h = f.detail || {}, b = h.query || h, g = h.meta && h.meta.targetEl ? h.meta.targetEl : null, _ = g || "query", m = i.queryDebounce;
        function r(e, o, a) {
          i.query(o, a).then(function(y) {
            const v = y || {};
            S(i.dom, "ln-api-connector:fetched", {
              data: v.data || (Array.isArray(v) ? v : []),
              total: v.total,
              filtered: v.filtered,
              offset: o.offset,
              queryGen: o.queryGen,
              meta: e.meta || null
            });
          }).catch(function(y) {
            y && y.name === "AbortError" || S(i.dom, "ln-api-connector:error", {
              action: "query",
              error: y.message,
              status: y.status || 0,
              data: y.data || null,
              meta: e.meta || null
            });
          });
        }
        if (m === 0) {
          r(h, b, g);
          return;
        }
        i._queryTimers.has(_) && clearTimeout(i._queryTimers.get(_));
        const s = setTimeout(function() {
          i._queryTimers.delete(_), r(h, b, g);
        }, m);
        i._queryTimers.set(_, s);
      },
      cancel: function(f) {
        const h = f.detail || {}, b = h.meta && h.meta.targetEl ? h.meta.targetEl : h.targetEl || h.key;
        b && i.cancel(b);
      },
      create: function(f) {
        const h = f.detail || {};
        i.create(h.data, h.url, h.idempotencyKey).then(function(b) {
          const g = Oe(b);
          S(i.dom, "ln-api-connector:created", {
            record: g.record,
            tempId: h.tempId,
            message: g.message,
            meta: h.meta || null
          });
        }).catch(function(b) {
          b && b.name === "AbortError" || S(i.dom, "ln-api-connector:error", {
            action: "create",
            error: b.message,
            status: b.status || 0,
            data: b.data || null,
            tempId: h.tempId,
            meta: h.meta || null
          });
        });
      },
      update: function(f) {
        const h = f.detail || {};
        i.update(h.id, h.data, h.expected_version, h.url, h.idempotencyKey).then(function(b) {
          const g = Oe(b);
          S(i.dom, "ln-api-connector:updated", {
            record: g.record,
            id: h.id,
            message: g.message,
            meta: h.meta || null
          });
        }).catch(function(b) {
          b && b.name === "AbortError" || S(i.dom, "ln-api-connector:error", {
            action: "update",
            error: b.message,
            status: b.status || 0,
            data: b.data || null,
            id: h.id,
            conflictData: b.status === 409 ? b.data : null,
            meta: h.meta || null
          });
        });
      },
      delete: function(f) {
        const h = f.detail || {};
        i.delete(h.id, h.url, h.idempotencyKey).then(function(b) {
          const g = b && b.message ? b.message : null;
          S(i.dom, "ln-api-connector:deleted", {
            response: b,
            id: h.id,
            message: g,
            meta: h.meta || null
          });
        }).catch(function(b) {
          b && b.name === "AbortError" || S(i.dom, "ln-api-connector:error", {
            action: "delete",
            error: b.message,
            status: b.status || 0,
            data: b.data || null,
            id: h.id,
            meta: h.meta || null
          });
        });
      },
      bulkDelete: function(f) {
        const h = f.detail || {};
        i.bulkDelete(h.ids, h.url, h.idempotencyKey).then(function(b) {
          const g = b && b.message ? b.message : null;
          S(i.dom, "ln-api-connector:bulk-deleted", {
            response: b,
            ids: h.ids,
            message: g,
            meta: h.meta || null
          });
        }).catch(function(b) {
          b && b.name === "AbortError" || S(i.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: b.message,
            status: b.status || 0,
            data: b.data || null,
            ids: h.ids,
            meta: h.meta || null
          });
        });
      }
    }, i.dom.addEventListener("ln-api-connector:request-sync", i._handlers.sync), i.dom.addEventListener("ln-api-connector:request-query", i._handlers.query), i.dom.addEventListener("ln-api-connector:request-fetch", i._handlers.query), i.dom.addEventListener("ln-api-connector:request-cancel", i._handlers.cancel), i.dom.addEventListener("ln-api-connector:request-create", i._handlers.create), i.dom.addEventListener("ln-api-connector:request-update", i._handlers.update), i.dom.addEventListener("ln-api-connector:request-delete", i._handlers.delete), i.dom.addEventListener("ln-api-connector:request-bulk-delete", i._handlers.bulkDelete);
  }
  l.prototype.destroy = function() {
    if (!this.dom[n]) return;
    const i = this;
    i._inflight && (i._inflight.forEach(function(f) {
      f.abort();
    }), i._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(f) {
      f && clearTimeout(f);
    }), this._queryTimers.clear()), this._handlers && (i.dom.removeEventListener("ln-api-connector:request-sync", i._handlers.sync), i.dom.removeEventListener("ln-api-connector:request-query", i._handlers.query), i.dom.removeEventListener("ln-api-connector:request-fetch", i._handlers.query), i.dom.removeEventListener("ln-api-connector:request-cancel", i._handlers.cancel), i.dom.removeEventListener("ln-api-connector:request-create", i._handlers.create), i.dom.removeEventListener("ln-api-connector:request-update", i._handlers.update), i.dom.removeEventListener("ln-api-connector:request-delete", i._handlers.delete), i.dom.removeEventListener("ln-api-connector:request-bulk-delete", i._handlers.bulkDelete), i._handlers = null), S(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[n], delete this.dom[u];
  };
  function c(i) {
    const f = i[n];
    f && f.refreshConfig();
  }
  M(t, n, l, "ln-api-connector", {
    extraAttributes: [
      "data-ln-api-base-url",
      "data-ln-api-path",
      "data-ln-api-headers",
      "data-ln-api-param-offset",
      "data-ln-api-param-limit",
      "data-ln-api-param-search",
      "data-ln-api-param-sort-field",
      "data-ln-api-param-sort-dir",
      "data-ln-api-connector-query-debounce"
    ],
    onAttributeChange: c
  });
})();
(function() {
  const t = "data-ln-couchdb-connector", n = "lnCouchDbConnector", u = "lnConnector";
  if (window[n] !== void 0) return;
  function p(_) {
    const m = _ && _.content !== void 0 ? _.content : _, r = _ && _.message ? _.message : null;
    return { content: m, message: r };
  }
  function l(_) {
    return this.dom = _, _[n] = this, _[u] = this, this.refreshConfig(), this._handlers = null, b(this), this;
  }
  l.prototype.refreshConfig = function() {
    const _ = this.dom;
    this.url = _.getAttribute("data-ln-couchdb-url") || "", this.db = _.getAttribute("data-ln-couchdb-db") || "", this.auth = _.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const m = _.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = We(m, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), m.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(_, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function d(_, m, r) {
    const s = Object.assign({}, Lt(_.headers, _.auth), r || {});
    return m && (s["Idempotency-Key"] = m), s;
  }
  l.prototype.fetchDelta = function(_) {
    const m = this, r = ["include_docs=true", "feed=normal"];
    _ && r.push("since=" + encodeURIComponent(_));
    const s = dt(m.url, m.db, "_changes") + "?" + r.join("&");
    return window.fetch(s, { method: "GET", headers: Lt(m.headers, m.auth), credentials: m.credentials }).then((e) => {
      if (!e.ok) throw new Error("HTTP " + e.status + ": " + e.statusText);
      return e.json();
    }).then((e) => {
      const o = e.results || [];
      return {
        data: o.filter((a) => !a.deleted && a.doc).map((a) => Object.assign({}, a.doc, { id: a.doc._id })),
        deleted: o.filter((a) => a.deleted).map((a) => a.id),
        synced_at: e.last_seq || _ || ""
      };
    });
  };
  function c(_, m, r) {
    const s = Object.assign({ _id: m.id }, m);
    return s._id || delete s._id, window.fetch(dt(_.url, _.db), {
      method: "POST",
      headers: d(_, r),
      credentials: _.credentials,
      body: JSON.stringify(s)
    }).then((e) => {
      if (!e.ok) throw new Error("HTTP " + e.status + ": " + e.statusText);
      return e.json();
    }).then((e) => {
      const o = p(e), a = o.content;
      return { record: Object.assign({}, s, { id: a.id, _id: a.id, _rev: a.rev }), message: o.message };
    });
  }
  l.prototype.create = function(_, m) {
    return c(this, _, m).then((r) => r.record);
  };
  function i(_, m, r, s) {
    const e = Object.assign({ id: String(m), _id: String(m) }, r), o = e._rev || e.rev;
    return (o ? Promise.resolve(o) : window.fetch(dt(_.url, _.db, null, m), { method: "GET", headers: Lt(_.headers, _.auth), credentials: _.credentials }).then((y) => {
      if (!y.ok) throw new Error("Could not retrieve document for revision mapping");
      return y.json().then((v) => v._rev);
    })).then((y) => {
      const v = Object.assign({}, e, { _rev: y });
      delete v.rev;
      const w = d(_, s, { "If-Match": y });
      return window.fetch(dt(_.url, _.db, null, m), {
        method: "PUT",
        headers: w,
        credentials: _.credentials,
        body: JSON.stringify(v)
      }).then((A) => {
        if (A.ok) return A.json().then((C) => {
          const L = p(C);
          return { record: Object.assign({}, v, { _rev: L.content.rev }), message: L.message };
        });
        if (A.status === 409) return A.json().then((C) => {
          const L = new Error("Conflict");
          throw L.status = 409, L.data = C, L;
        });
        throw new Error("HTTP " + A.status + ": " + A.statusText);
      });
    });
  }
  l.prototype.update = function(_, m, r) {
    return i(this, _, m, r).then((s) => s.record);
  };
  function f(_, m, r, s) {
    return (r ? Promise.resolve(r) : window.fetch(dt(_.url, _.db, null, m), { method: "GET", headers: Lt(_.headers, _.auth), credentials: _.credentials }).then((o) => {
      if (!o.ok) throw new Error("Could not retrieve document for revision delete");
      return o.json().then((a) => a._rev);
    })).then((o) => {
      const a = dt(_.url, _.db, null, m) + "?rev=" + encodeURIComponent(o);
      return window.fetch(a, { method: "DELETE", headers: d(_, s), credentials: _.credentials }).then((y) => {
        if (!y.ok) throw new Error("HTTP " + y.status + ": " + y.statusText);
        return y.json();
      }).then((y) => {
        const v = p(y);
        return { response: v.content, message: v.message };
      });
    });
  }
  l.prototype.delete = function(_, m, r) {
    return f(this, _, m, r).then((s) => s.response);
  };
  function h(_, m, r) {
    return !m || m.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(dt(_.url, _.db, "_all_docs"), {
      method: "POST",
      headers: Lt(_.headers, _.auth),
      credentials: _.credentials,
      body: JSON.stringify({ keys: m })
    }).then((s) => {
      if (!s.ok) throw new Error("HTTP " + s.status + ": " + s.statusText);
      return s.json();
    }).then((s) => {
      const o = (s.rows || []).filter((a) => !a.error && a.value && a.value.rev).map((a) => ({ _id: a.id, _rev: a.value.rev, _deleted: !0 }));
      return o.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(dt(_.url, _.db, "_bulk_docs"), {
        method: "POST",
        headers: d(_, r),
        credentials: _.credentials,
        body: JSON.stringify({ docs: o })
      }).then((a) => {
        if (!a.ok) throw new Error("HTTP " + a.status + ": " + a.statusText);
        return a.json();
      }).then((a) => {
        const y = p(a);
        return { response: { ok: !0, results: y.content, deletedCount: o.length }, message: y.message };
      });
    });
  }
  l.prototype.bulkDelete = function(_, m) {
    return h(this, _, m).then((r) => r.response);
  };
  function b(_) {
    _._handlers = {
      sync: function(r) {
        const s = r.detail || {};
        _.fetchDelta(s.since).then(function(e) {
          S(_.dom, "ln-couchdb-connector:fetched", { data: e, since: s.since, meta: s.meta || null });
        }).catch(function(e) {
          S(_.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: e.message,
            status: e.status || 0,
            since: s.since,
            meta: s.meta || null
          });
        });
      },
      create: function(r) {
        const s = r.detail || {};
        c(_, s.data, s.idempotencyKey).then(function(e) {
          S(_.dom, "ln-couchdb-connector:created", { record: e.record, tempId: s.tempId, message: e.message, meta: s.meta || null });
        }).catch(function(e) {
          S(_.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: e.message,
            status: e.status || 0,
            tempId: s.tempId,
            meta: s.meta || null
          });
        });
      },
      update: function(r) {
        const s = r.detail || {}, e = Object.assign({}, s.data);
        s.expected_version !== void 0 && (e._rev = s.expected_version), i(_, s.id, e, s.idempotencyKey).then(function(o) {
          S(_.dom, "ln-couchdb-connector:updated", { record: o.record, id: s.id, message: o.message, meta: s.meta || null });
        }).catch(function(o) {
          S(_.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: o.message,
            status: o.status || 0,
            id: s.id,
            data: o.status === 409 ? o.data : null,
            conflictData: o.status === 409 ? o.data : null,
            meta: s.meta || null
          });
        });
      },
      delete: function(r) {
        const s = r.detail || {};
        f(_, s.id, s.rev, s.idempotencyKey).then(function(e) {
          S(_.dom, "ln-couchdb-connector:deleted", { response: e.response, id: s.id, message: e.message, meta: s.meta || null });
        }).catch(function(e) {
          S(_.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: e.message,
            status: e.status || 0,
            id: s.id,
            meta: s.meta || null
          });
        });
      },
      bulkDelete: function(r) {
        const s = r.detail || {};
        h(_, s.ids, s.idempotencyKey).then(function(e) {
          S(_.dom, "ln-couchdb-connector:bulk-deleted", { response: e.response, ids: s.ids, message: e.message, meta: s.meta || null });
        }).catch(function(e) {
          S(_.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: e.message,
            status: e.status || 0,
            ids: s.ids,
            meta: s.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector"].forEach(function(r) {
      _.dom.addEventListener(r + ":request-sync", _._handlers.sync), _.dom.addEventListener(r + ":request-fetch", _._handlers.sync), _.dom.addEventListener(r + ":request-create", _._handlers.create), _.dom.addEventListener(r + ":request-update", _._handlers.update), _.dom.addEventListener(r + ":request-delete", _._handlers.delete), _.dom.addEventListener(r + ":request-bulk-delete", _._handlers.bulkDelete);
    });
  }
  l.prototype.destroy = function() {
    if (!this.dom[n]) return;
    const _ = this;
    _._handlers && (["ln-couchdb-connector", "ln-api-connector"].forEach(function(r) {
      _.dom.removeEventListener(r + ":request-sync", _._handlers.sync), _.dom.removeEventListener(r + ":request-fetch", _._handlers.sync), _.dom.removeEventListener(r + ":request-create", _._handlers.create), _.dom.removeEventListener(r + ":request-update", _._handlers.update), _.dom.removeEventListener(r + ":request-delete", _._handlers.delete), _.dom.removeEventListener(r + ":request-bulk-delete", _._handlers.bulkDelete);
    }), _._handlers = null), S(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[n], delete this.dom[u];
  };
  function g(_) {
    const m = _[n];
    m && m.refreshConfig();
  }
  M(t, n, l, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: g
  });
})();
function Ki(t) {
  return t = t || {}, {
    sort: t.sort,
    filters: t.filters,
    search: t.search,
    offset: t.offset,
    limit: t.limit,
    queryGen: t.queryGen
  };
}
function Nt(t, n) {
  const u = !t || !!t.initializationError, p = !!(t && t.noLocalQuery && !t.windowed);
  return n && (u || !t.canServe || p) ? "remote" : t && !t.initializationError ? "store" : "none";
}
function Me(t, n) {
  const u = Object.assign({}, t);
  return n && (u.filters = n.filters, u.search = n.search, u.sort = n.sort), u;
}
class ji {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(n) {
    return new Promise((u, p) => {
      this._pending.set(n, { resolve: u, reject: p });
    });
  }
  resolve(n) {
    return this._settle(n, !1);
  }
  reject(n) {
    return this._settle(n, !0);
  }
  close(n) {
    const u = n || new Error("Mutation receipt registry closed");
    for (const p of this._pending.values()) p.reject(u);
    this._pending.clear();
  }
  _settle(n, u) {
    const p = n && n.requestId;
    if (!p) return !1;
    const l = this._pending.get(p);
    return l ? (this._pending.delete(p), u ? l.reject(n.error || new Error("Store mutation failed")) : l.resolve(n), !0) : !1;
  }
}
(function() {
  const t = "data-ln-data-coordinator", n = "lnDataCoordinator", u = "lnCoordinator", p = "data-ln-form-scope";
  if (window[n] !== void 0) return;
  const l = /* @__PURE__ */ new Set();
  let d = !1, c = null, i = null, f = null;
  function h() {
    d || (d = !0, c = function() {
      S(document, "ln-data-store:online", {}), l.forEach(function(e) {
        e._maybeSync();
      });
    }, i = function() {
      S(document, "ln-data-store:offline", {});
    }, f = function() {
      document.visibilityState === "visible" && l.forEach(function(e) {
        const o = e.findChildren(), a = o.store;
        a && o.connector && a.isInitialized && !a.initializationError && !a.isSyncing && !e._noAutosync && (!a.hasCache || e._isStale()) && a.forceSync();
      });
    }, window.addEventListener("online", c), window.addEventListener("offline", i), document.addEventListener("visibilitychange", f));
  }
  function b() {
    d && (l.size > 0 || (window.removeEventListener("online", c), window.removeEventListener("offline", i), document.removeEventListener("visibilitychange", f), c = null, i = null, f = null, d = !1));
  }
  function g() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (o) => {
        const a = Math.random() * 16 | 0;
        return (o === "x" ? a : a & 3 | 8).toString(16);
      });
    }
  }
  const _ = ["ln-api-connector", "ln-couchdb-connector"];
  function m(e) {
    return this.dom = e, this._name = e.getAttribute("data-ln-data-coordinator") || e.id, this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", e), e[n] = this, e[u] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new ji(), this._dict = Vt(e, "data-ln-data-coordinator-dict"), this._parseStaleAttributes(), this.refreshMapper(), r(this), l.add(this), h(), this._checkInitialSync(), this;
  }
  m.prototype._parseStaleAttributes = function() {
    const o = this.findChildren().storeEl, a = this.dom.getAttribute("data-ln-data-coordinator-stale") || (o ? o.getAttribute("data-ln-data-store-stale") : null), y = parseInt(a, 10);
    this._staleThreshold = a === "never" || a === "-1" ? -1 : isNaN(y) ? 300 : y;
    const v = this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (o ? o.hasAttribute("data-ln-data-store-no-autosync") : !1);
    this._noAutosync = !!v;
  }, m.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const o = this.findChildren().store;
    return !o || !o.lastSyncedAt ? !0 : Date.now() / 1e3 - o.lastSyncedAt > this._staleThreshold;
  }, m.prototype._maybeSync = function() {
    const e = this.findChildren(), o = e.store;
    !o || o.initializationError || !e.connector || this._noAutosync || !o.isInitialized || o.isSyncing || (!o.hasCache || this._isStale()) && o.forceSync();
  }, m.prototype._checkInitialSync = function() {
    const e = this, a = this.findChildren().store;
    a && Promise.resolve(a.ready).then(function() {
      const y = e.findChildren(), v = y.store;
      if (v && v.initializationError) {
        e._reportReconciliationError("store-initialize", v.initializationError, null);
        return;
      }
      !v || !y.connector || e._noAutosync || v.isSyncing || (!v.hasCache || e._isStale()) && v.forceSync();
    }).catch(function(y) {
      e._reportReconciliationError("store-initialize", y, null);
    });
  }, m.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const o = this.dom.getAttribute("data-ln-data-mapper") || this.dom.id;
    o && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(o)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(a) {
      return a;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(a) {
      return a;
    });
  }, m.prototype.findChildren = function() {
    const e = this.dom.querySelector("[data-ln-data-store]"), o = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]"), a = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: e,
      connectorEl: o,
      queueEl: a,
      store: e ? e.lnDataStore || e.lnStore : null,
      connector: o ? o.lnConnector || o.lnApiConnector || o.lnCouchDbConnector : null,
      queue: a ? a.lnApiQueue : null
    };
  }, m.prototype._handleSubmitRecord = function(e) {
    const o = this.findChildren();
    if (!o.storeEl) {
      console.warn('[ln-data-coordinator] form submit claimed but no [data-ln-data-store] child found in "' + (this._name || "") + '"');
      return;
    }
    const a = e.data || {}, y = a.id, v = a.expected_version, w = Object.assign({}, a);
    delete w.id, delete w.expected_version;
    const A = e.method.toUpperCase();
    A === "POST" ? this._fanOutCreate(o, w, e.action) : (A === "PUT" || A === "PATCH") && this._fanOutUpdate(o, y, w, v, e.action);
  }, m.prototype._fanOutCreate = function(e, o, a) {
    this.refreshMapper();
    const y = "_temp_" + g();
    S(e.storeEl, "ln-data-store:request-create", { tempId: y, data: o }), e.queue ? S(e.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: y,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(o),
      expectedVersion: null,
      meta: { tempId: y, action: a }
    }) : e.connector && S(e.connectorEl, "ln-api-connector:request-create", {
      data: this.mapper.egress(o),
      url: a,
      meta: { entryId: g(), queued: !1, op: "create", tempId: y }
    });
  }, m.prototype._fanOutUpdate = function(e, o, a, y, v) {
    this.refreshMapper(), S(e.storeEl, "ln-data-store:request-update", { id: o, data: a }), e.queue ? S(e.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: o,
      op: "update",
      targetId: o,
      payload: this.mapper.egress(a),
      expectedVersion: y,
      meta: { id: o, action: v }
    }) : e.connector && S(e.connectorEl, "ln-api-connector:request-update", {
      id: o,
      data: this.mapper.egress(a),
      expected_version: y,
      url: v,
      meta: { entryId: g(), queued: !1, op: "update", id: o }
    });
  }, m.prototype._fanOutDelete = function(e, o) {
    this.refreshMapper(), S(e.storeEl, "ln-data-store:request-delete", { id: o }), e.queue ? S(e.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: o,
      op: "delete",
      targetId: o,
      payload: null,
      expectedVersion: null,
      meta: { id: o }
    }) : e.connector && S(e.connectorEl, "ln-api-connector:request-delete", {
      id: o,
      meta: { entryId: g(), queued: !1, op: "delete", id: o }
    });
  }, m.prototype._fanOutBulkDelete = function(e, o) {
    this.refreshMapper();
    const a = o.join(",");
    S(e.storeEl, "ln-data-store:request-bulk-delete", { ids: o }), e.queue ? S(e.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: a,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: o },
      expectedVersion: null,
      meta: { bulkKey: a, ids: o }
    }) : e.connector && S(e.connectorEl, "ln-api-connector:request-bulk-delete", {
      ids: o,
      meta: { entryId: g(), queued: !1, op: "bulk-delete", bulkKey: a }
    });
  }, m.prototype._toastFromMessage = function(e) {
    e && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: e.type || "success",
        title: e.title || "",
        message: e.body || ""
      }
    }));
  }, m.prototype._toastFromDict = function(e) {
    const o = this._dict[e];
    o && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: "error", title: "", message: o }
    }));
  }, m.prototype._requestStoreMutation = function(e, o, a) {
    const y = e.storeEl;
    if (!y) return Promise.reject(new Error("Store element not found"));
    const v = g(), w = this._mutationReceipts.wait(v);
    return S(y, "ln-data-store:request-" + o, Object.assign({}, a, { requestId: v })), w;
  }, m.prototype._reportReconciliationError = function(e, o, a) {
    S(this.dom, "ln-data-coordinator:error", {
      operation: e,
      error: o,
      meta: a || null
    });
  };
  function r(e) {
    e._handlers = {
      sync: function(o) {
        e.refreshMapper();
        const a = e.findChildren();
        if (!a.store || !a.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        S(a.connectorEl, "ln-api-connector:request-sync", { since: o.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(o) {
        const a = e.findChildren();
        if (!a.connectorEl) return;
        const y = o.detail || {};
        S(a.connectorEl, "ln-api-connector:request-query", {
          query: Object.assign({}, y.query, {
            offset: y.offset,
            limit: y.limit,
            queryGen: y.queryGen
          })
        });
      },
      reqCreate: function(o) {
        const a = e.findChildren();
        a.storeEl && e._fanOutCreate(a, o.detail.data || {}, o.detail.action);
      },
      reqUpdate: function(o) {
        const a = e.findChildren();
        a.storeEl && e._fanOutUpdate(a, o.detail.id, o.detail.data || {}, o.detail.expected_version, o.detail.action);
      },
      reqDelete: function(o) {
        const a = e.findChildren();
        a.storeEl && e._fanOutDelete(a, o.detail.id);
      },
      reqBulkDelete: function(o) {
        const a = e.findChildren();
        a.storeEl && e._fanOutBulkDelete(a, o.detail.ids || []);
      },
      queueFailed: function() {
        e._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(o) {
        e.refreshMapper();
        const a = e.findChildren();
        if (!a.store || !a.connector || !a.queue) return;
        const y = o.detail || {}, v = y.entryId, w = y.op, A = y.targetId, C = y.payload, L = y.expectedVersion, q = y.meta || {}, x = q.action || null, D = y.idempotencyKey || v;
        w === "create" ? S(a.connectorEl, "ln-api-connector:request-create", {
          data: C,
          url: x,
          idempotencyKey: D,
          meta: { entryId: v, queued: !0, op: "create", tempId: q.tempId }
        }) : w === "update" ? S(a.connectorEl, "ln-api-connector:request-update", {
          id: A,
          data: C,
          expected_version: L,
          url: x,
          idempotencyKey: D,
          meta: { entryId: v, queued: !0, op: "update", id: A }
        }) : w === "delete" ? S(a.connectorEl, "ln-api-connector:request-delete", {
          id: A,
          idempotencyKey: D,
          meta: { entryId: v, queued: !0, op: "delete", id: A }
        }) : w === "bulk-delete" ? S(a.connectorEl, "ln-api-connector:request-bulk-delete", {
          ids: C && C.ids ? C.ids : [],
          idempotencyKey: D,
          meta: { entryId: v, queued: !0, op: "bulk-delete", bulkKey: q.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", w);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(o) {
        const a = o.target;
        if (o.defaultPrevented) return;
        const y = a.hasAttribute(p) ? a.getAttribute(p) : null;
        if (y === null) return;
        let v;
        if (y ? v = y === e._name || e._ownsStore(y) : v = a.closest("[data-ln-data-coordinator]") === e.dom, !v) return;
        const w = Nn(a);
        if (w !== "POST" && w !== "PUT" && w !== "PATCH") return;
        o.preventDefault();
        const A = Ue(a);
        delete A._method, delete A._token, e._handleSubmitRecord({ data: A, method: w, action: a.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(o) {
        const a = o.detail.meta || {}, y = e.findChildren();
        e.refreshMapper();
        const v = o.detail.data;
        let w = [], A = [], C = null;
        Array.isArray(v) ? (w = v, C = Math.floor(Date.now() / 1e3)) : v && (w = Array.isArray(v.data) ? v.data : [], A = Array.isArray(v.deleted) ? v.deleted : [], C = v.synced_at !== void 0 ? v.synced_at : v.since !== void 0 ? v.since : null);
        const L = w.map((q) => e.mapper.ingress(q));
        if (y.store && !y.store.initializationError)
          a.kind ? a.kind === "table" || a.kind === "list" || a.kind === "chart" ? y.store.applyQuery(L, { total: o.detail.total }).then(function(q) {
            S(a.targetEl, "ln-" + a.kind + ":set-loading", { loading: !1 }), S(a.targetEl, "ln-" + a.kind + ":set-data", {
              data: q,
              total: o.detail.total !== void 0 ? o.detail.total : q.length,
              filtered: o.detail.filtered !== void 0 ? o.detail.filtered : q.length,
              offset: o.detail.offset,
              queryGen: o.detail.queryGen
            }), e._boundDelivered.set(a.targetEl, !0);
          }) : a.kind === "options" ? y.store.applyQuery(L, { total: o.detail.total }).then(function() {
            return y.store.getAll({});
          }).then(function(q) {
            S(a.targetEl, "ln-options:set-data", { data: q.data });
          }) : a.kind === "stat" && y.store.applyQuery(L, { total: o.detail.total }).then(function() {
            const q = o.detail.filtered !== void 0 ? o.detail.filtered : o.detail.total !== void 0 ? o.detail.total : L.length;
            S(a.targetEl, "ln-stat:set-count", { count: q });
          }) : y.store.applySync(L, A, C || Math.floor(Date.now() / 1e3), {
            total: o.detail.total,
            filtered: o.detail.filtered,
            offset: o.detail.offset,
            queryGen: o.detail.queryGen,
            targetEl: a.targetEl
          });
        else if (a.targetEl && a.kind) {
          if (a.kind === "table" || a.kind === "list" || a.kind === "chart")
            S(a.targetEl, "ln-" + a.kind + ":set-loading", { loading: !1 }), S(a.targetEl, "ln-" + a.kind + ":set-data", {
              data: L,
              total: o.detail.total !== void 0 ? o.detail.total : L.length,
              filtered: o.detail.filtered !== void 0 ? o.detail.filtered : L.length,
              offset: o.detail.offset,
              queryGen: o.detail.queryGen
            }), e._boundDelivered.set(a.targetEl, !0);
          else if (a.kind === "options")
            S(a.targetEl, "ln-options:set-data", { data: L });
          else if (a.kind === "stat") {
            const q = o.detail.filtered !== void 0 ? o.detail.filtered : o.detail.total !== void 0 ? o.detail.total : L.length;
            S(a.targetEl, "ln-stat:set-count", { count: q });
          }
        }
      },
      connCreated: function(o) {
        const a = e.findChildren();
        if (!a.storeEl) return;
        const y = o.detail.meta || {}, v = e.mapper.ingress(o.detail.record);
        e._requestStoreMutation(a, "update", { id: y.tempId, data: v }).then(function() {
          e._toastFromMessage(o.detail.message), y.queued && a.queue && S(a.queueEl, "ln-api-queue:resolve-create", {
            entryId: y.entryId,
            oldKey: y.tempId,
            newId: v.id
          });
        }).catch(function(w) {
          e._reportReconciliationError("create-reconcile", w, y);
        });
      },
      connUpdated: function(o) {
        const a = e.findChildren();
        if (!a.storeEl) return;
        const y = o.detail.meta || {}, v = e.mapper.ingress(o.detail.record);
        e._requestStoreMutation(a, "update", { id: y.id, data: v }).then(function() {
          e._toastFromMessage(o.detail.message), y.queued && a.queue && S(a.queueEl, "ln-api-queue:ack", { entryId: y.entryId });
        }).catch(function(w) {
          e._reportReconciliationError("update-reconcile", w, y);
        });
      },
      connDeleted: function(o) {
        const a = e.findChildren();
        if (!a.storeEl) return;
        const y = o.detail.meta || {};
        e._toastFromMessage(o.detail.message), y.queued && a.queue && S(a.queueEl, "ln-api-queue:ack", { entryId: y.entryId });
      },
      connBulkDeleted: function(o) {
        const a = e.findChildren();
        if (!a.storeEl) return;
        const y = o.detail.meta || {};
        e._toastFromMessage(o.detail.message), y.queued && a.queue && S(a.queueEl, "ln-api-queue:ack", { entryId: y.entryId });
      },
      connError: function(o) {
        const a = o.detail || {}, y = a.meta || {}, v = y.op || a.action, w = a.status || 0, A = e.findChildren();
        if (v === "sync") {
          A.storeEl && S(A.storeEl, "ln-data-store:request-sync-failed", {
            error: a.error,
            status: w
          }), console.error("[ln-data-coordinator] Sync failed:", a.error);
          return;
        }
        if (v === "query") {
          y.targetEl && y.kind && (S(y.targetEl, "ln-" + y.kind + ":set-loading", { loading: !1 }), (y.kind === "table" || y.kind === "list") && S(y.targetEl, "ln-" + y.kind + ":page-failed", { offset: y.offset })), e._reportReconciliationError("query", a.error || a, y);
          return;
        }
        if (!A.storeEl) return;
        const C = w === 401 || w === 419, L = w === 0 || w >= 500, q = w === 409 || w === 412;
        if (C) {
          e._toastFromDict("auth"), y.queued && A.queue && S(A.queueEl, "ln-api-queue:nack", { entryId: y.entryId, reason: "auth" });
          return;
        }
        if (L) {
          y.queued && A.queue ? S(A.queueEl, "ln-api-queue:nack", { entryId: y.entryId, reason: "retry" }) : e._toastFromDict("network");
          return;
        }
        let x = Promise.resolve();
        if (q && v === "update") {
          const D = a.data && a.data.remote ? e.mapper.ingress(a.data.remote) : null;
          D && (x = e._requestStoreMutation(A, "update", { id: y.id, data: D })), e._toastFromDict("conflict");
        } else v === "create" && (x = e._requestStoreMutation(A, "delete", { id: y.tempId })), e._toastFromDict("rejected");
        y.queued && A.queue ? x.then(function() {
          S(A.queueEl, "ln-api-queue:nack", { entryId: y.entryId, reason: "drop" });
        }).catch(function(D) {
          e._reportReconciliationError("deterministic-reconcile", D, y);
        }) : x.catch(function(D) {
          e._reportReconciliationError("deterministic-reconcile", D, y);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(o) {
        const a = e.findChildren(), y = a.store;
        if (!y || y.initializationError || !a.connector || e._noAutosync || y.isSyncing) return;
        (o.detail || {}).hasCache ? e._isStale() && y.forceSync() : y.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(o) {
        e._serveData(o, "table");
      },
      reqListData: function(o) {
        e._serveData(o, "list");
      },
      reqChartData: function(o) {
        e._serveData(o, "chart");
      },
      reqOptions: function(o) {
        e._serveOptions(o);
      },
      reqStat: function(o) {
        e._serveStat(o);
      },
      refreshQuery: function() {
        e._refreshAll(null, !0);
      },
      refresh: function(o) {
        e._mutationReceipts.resolve(o.detail), e._refreshAll(null, !1);
      },
      mutationError: function(o) {
        e._mutationReceipts.reject(o.detail);
      },
      refreshSynced: function(o) {
        o.detail && o.detail.changed && e._refreshAll(o.detail.meta, !1);
      }
    }, e.dom.addEventListener("ln-data-store:request-remote-sync", e._handlers.sync), e.dom.addEventListener("ln-data-store:request-page", e._handlers.requestPage), e.dom.addEventListener("ln-data-coordinator:request-create", e._handlers.reqCreate), e.dom.addEventListener("ln-data-coordinator:request-update", e._handlers.reqUpdate), e.dom.addEventListener("ln-data-coordinator:request-delete", e._handlers.reqDelete), e.dom.addEventListener("ln-data-coordinator:request-bulk-delete", e._handlers.reqBulkDelete), e.dom.addEventListener("ln-api-queue:send", e._handlers.queueSend), e.dom.addEventListener("ln-api-queue:failed", e._handlers.queueFailed), e.dom.addEventListener("ln-data-store:initialized", e._handlers.storeInitialized), document.addEventListener("submit", e._handlers.formSubmit), _.forEach(function(o) {
      e.dom.addEventListener(o + ":fetched", e._handlers.connFetched), e.dom.addEventListener(o + ":created", e._handlers.connCreated), e.dom.addEventListener(o + ":updated", e._handlers.connUpdated), e.dom.addEventListener(o + ":deleted", e._handlers.connDeleted), e.dom.addEventListener(o + ":bulk-deleted", e._handlers.connBulkDeleted), e.dom.addEventListener(o + ":error", e._handlers.connError);
    }), document.addEventListener("ln-table:request-data", e._handlers.reqTableData), document.addEventListener("ln-list:request-data", e._handlers.reqListData), document.addEventListener("ln-chart:request-data", e._handlers.reqChartData), document.addEventListener("ln-options:request-data", e._handlers.reqOptions), document.addEventListener("ln-stat:request-count", e._handlers.reqStat), e.dom.addEventListener("ln-data-store:ready", e._handlers.refresh), e.dom.addEventListener("ln-data-store:created", e._handlers.refresh), e.dom.addEventListener("ln-data-store:updated", e._handlers.refresh), e.dom.addEventListener("ln-data-store:deleted", e._handlers.refresh), e.dom.addEventListener("ln-data-store:mutation-error", e._handlers.mutationError), e.dom.addEventListener("ln-data-store:synced", e._handlers.refreshSynced), e.dom.addEventListener("ln-data-store:query-changed", e._handlers.refreshQuery);
  }
  m.prototype._ownsStore = function(e) {
    const o = this.findChildren();
    return !!(o.store && o.store._name === e && e);
  }, m.prototype._serveData = function(e, o) {
    const a = e.target, y = o === "table" ? "data-ln-table-source" : o === "list" ? "data-ln-list-source" : "data-ln-chart-source", v = a.getAttribute(y);
    if (!v || !this._ownsStore(v)) return;
    const w = e.detail || {}, A = Ki(w);
    this._boundQueries.set(a, A);
    const C = this.findChildren(), L = this, q = C.store;
    return (q && q.ready ? q.ready : Promise.resolve()).then(function() {
      const D = Nt(q, C.connector), F = Me(A, q && q.query);
      if (D === "remote") {
        S(a, "ln-" + o + ":set-loading", { loading: !0 }), S(C.connectorEl, "ln-api-connector:request-query", {
          query: F,
          meta: { targetEl: a, kind: o, offset: F.offset, limit: F.limit }
        });
        return;
      }
      if (D !== "store") {
        S(a, "ln-" + o + ":set-loading", { loading: !1 });
        return;
      }
      return q.getAll(F).then(function(N) {
        const B = {
          data: N.data,
          total: N.total,
          filtered: N.filtered,
          offset: w.offset !== void 0 ? w.offset : N.offset,
          queryGen: w.queryGen !== void 0 ? w.queryGen : N.queryGen,
          // The store answered from its own records while the server query
          // is still out; the view renders it but keeps the refresh showing.
          provisional: N.provisional === !0
        };
        S(a, "ln-" + o + ":set-data", B), L._boundDelivered.set(a, !0);
      });
    }).catch(function(D) {
      S(a, "ln-" + o + ":set-loading", { loading: !1 }), S(L.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: o,
        store: v,
        target: a,
        error: D
      });
    });
  }, m.prototype._serveOptions = function(e) {
    const o = e.target, a = o.getAttribute("data-ln-options");
    if (!this._ownsStore(a)) return;
    const y = this.findChildren(), v = y.store, w = v && v.ready ? v.ready : Promise.resolve(), A = this;
    return w.then(function() {
      const C = Nt(v, y.connector);
      if (C === "remote") {
        S(y.connectorEl, "ln-api-connector:request-query", {
          query: {},
          meta: { targetEl: o, kind: "options" }
        });
        return;
      }
      if (C === "store")
        return v.getAll({}).then(function(L) {
          S(o, "ln-options:set-data", { data: L.data });
        });
    }).catch(function(C) {
      A._reportReconciliationError("options-query", C, { targetEl: o, kind: "options" });
    });
  }, m.prototype._serveStat = function(e) {
    const o = e.target, a = o.getAttribute("data-ln-stat");
    if (!this._ownsStore(a)) return;
    const y = e.detail && e.detail.filters ? e.detail.filters : null, v = this.findChildren(), w = v.store, A = w && w.ready ? w.ready : Promise.resolve(), C = this;
    return A.then(function() {
      const L = y && Object.keys(y).length > 0, x = !!(v.connector && w && ((w.windowed || w._windowIndex) && L || w.noLocalQuery)) ? "remote" : Nt(w, v.connector);
      if (x === "remote") {
        S(v.connectorEl, "ln-api-connector:request-query", {
          query: { filters: y },
          meta: { targetEl: o, kind: "stat" }
        });
        return;
      }
      if (x === "store")
        return w.count(y).then(function(D) {
          S(o, "ln-stat:set-count", { count: D });
        });
    }).catch(function(L) {
      C._reportReconciliationError("stat-query", L, { targetEl: o, kind: "stat" });
    });
  }, m.prototype._refreshAll = function(e, o) {
    const a = this, y = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let v = 0; v < y.length; v++) {
      const w = y[v];
      let A, C;
      if (w.hasAttribute("data-ln-table-source") ? (A = w.getAttribute("data-ln-table-source"), C = "table") : w.hasAttribute("data-ln-list-source") ? (A = w.getAttribute("data-ln-list-source"), C = "list") : w.hasAttribute("data-ln-chart-source") ? (A = w.getAttribute("data-ln-chart-source"), C = "chart") : w.hasAttribute("data-ln-options") ? (A = w.getAttribute("data-ln-options"), C = "options") : w.hasAttribute("data-ln-stat") && (A = w.getAttribute("data-ln-stat"), C = "stat"), !a._ownsStore(A)) continue;
      const L = a.findChildren(), q = L.store;
      if (C === "table" || C === "list") {
        const x = C === "table" ? "data-ln-table-window" : "data-ln-list-window";
        if (w.hasAttribute(x)) {
          S(w, "ln-" + C + (o ? ":request-invalidate" : ":request-revalidate"), {});
          continue;
        }
      }
      if (C === "table" || C === "list" || C === "chart") {
        const x = a._boundQueries.get(w) || { sort: null, filters: {}, search: "" }, D = Me(x, q.query);
        if (Nt(q, L.connector) === "remote") {
          S(w, "ln-" + C + ":set-loading", { loading: !0 }), S(L.connectorEl, "ln-api-connector:request-query", {
            query: D,
            meta: { targetEl: w, kind: C, offset: D.offset, limit: D.limit }
          });
          continue;
        }
        (function(F, N) {
          q.getAll(D).then(function(B) {
            const $ = {
              data: B.data,
              total: e && e.total !== void 0 ? e.total : B.total,
              filtered: e && e.filtered !== void 0 ? e.filtered : B.filtered,
              offset: B.offset !== void 0 ? B.offset : e && e.offset !== void 0 ? e.offset : x.offset,
              queryGen: B.queryGen !== void 0 ? B.queryGen : e && e.queryGen !== void 0 ? e.queryGen : x.queryGen
            };
            S(F, "ln-" + N + ":set-loading", { loading: !1 }), S(F, "ln-" + N + ":set-data", $), a._boundDelivered.set(F, !0);
          });
        })(w, C);
      } else if (C === "options")
        (function(x) {
          q.getAll({}).then(function(D) {
            S(x, "ln-options:set-data", { data: D.data });
          });
        })(w);
      else if (C === "stat") {
        const x = w.getAttribute("data-ln-stat-filter");
        let D = null;
        if (x) {
          const F = x.indexOf(":");
          if (F !== -1) {
            const N = x.slice(0, F), B = x.slice(F + 1);
            D = {}, D[N] = [B];
          }
        }
        (function(F, N) {
          q.count(N).then(function(B) {
            S(F, "ln-stat:set-count", { count: B });
          });
        })(w, D);
      }
    }
  }, m.prototype.destroy = function() {
    if (!this.dom[n]) return;
    const e = this;
    e._handlers && (e.dom.removeEventListener("ln-data-store:request-remote-sync", e._handlers.sync), e.dom.removeEventListener("ln-data-store:request-page", e._handlers.requestPage), e.dom.removeEventListener("ln-data-coordinator:request-create", e._handlers.reqCreate), e.dom.removeEventListener("ln-data-coordinator:request-update", e._handlers.reqUpdate), e.dom.removeEventListener("ln-data-coordinator:request-delete", e._handlers.reqDelete), e.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", e._handlers.reqBulkDelete), e.dom.removeEventListener("ln-api-queue:send", e._handlers.queueSend), e.dom.removeEventListener("ln-api-queue:failed", e._handlers.queueFailed), e.dom.removeEventListener("ln-data-store:initialized", e._handlers.storeInitialized), document.removeEventListener("submit", e._handlers.formSubmit), _.forEach(function(o) {
      e.dom.removeEventListener(o + ":fetched", e._handlers.connFetched), e.dom.removeEventListener(o + ":created", e._handlers.connCreated), e.dom.removeEventListener(o + ":updated", e._handlers.connUpdated), e.dom.removeEventListener(o + ":deleted", e._handlers.connDeleted), e.dom.removeEventListener(o + ":bulk-deleted", e._handlers.connBulkDeleted), e.dom.removeEventListener(o + ":error", e._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", e._handlers.reqTableData), document.removeEventListener("ln-list:request-data", e._handlers.reqListData), document.removeEventListener("ln-chart:request-data", e._handlers.reqChartData), document.removeEventListener("ln-options:request-data", e._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", e._handlers.reqStat), e.dom.removeEventListener("ln-data-store:ready", e._handlers.refresh), e.dom.removeEventListener("ln-data-store:created", e._handlers.refresh), e.dom.removeEventListener("ln-data-store:updated", e._handlers.refresh), e.dom.removeEventListener("ln-data-store:deleted", e._handlers.refresh), e.dom.removeEventListener("ln-data-store:mutation-error", e._handlers.mutationError), e.dom.removeEventListener("ln-data-store:synced", e._handlers.refreshSynced), e.dom.removeEventListener("ln-data-store:query-changed", e._handlers.refreshQuery), e._handlers = null), e._boundQueries = null, e._boundDelivered = null, e._mutationReceipts.close(new Error("Data coordinator destroyed")), e._mutationReceipts = null, l.delete(this), b(), delete this.dom[n], delete this.dom[u];
  };
  function s(e, o) {
    const a = e[n];
    a && o === "data-ln-data-mapper" && a.refreshMapper();
  }
  M(t, n, m, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: s
  });
})();
const Vi = "ln_api_queue", Wi = 2, Q = "outbox", Z = "_queue_meta";
function nt(t, n) {
  return t.error || new Error(n);
}
function wt(t, n) {
  return t.bound([n, -1 / 0], [n, 1 / 0]);
}
function Fe(t) {
  return "seq:" + t;
}
function Pt(t) {
  return "paused:" + t;
}
function Ne(t) {
  t.leaseOwner = null, t.leaseUntil = 0;
}
function Gi(t, n, u) {
  return typeof t != "string" || t.indexOf(n) === -1 ? t : t.split(n).join(u);
}
function $i(t, n, u, p) {
  const l = /* @__PURE__ */ new Map(), d = [], c = [];
  for (const i of t || [])
    l.has(i.chainKey) || l.set(i.chainKey, []), l.get(i.chainKey).push(i);
  return l.forEach((i, f) => {
    i.sort((b, g) => b.seq - g.seq);
    const h = i[0];
    if (!(!h || h.status === "failed")) {
      if (h.status === "inflight" && (h.leaseUntil || 0) > p) {
        c.push({ chainKey: f, at: h.leaseUntil });
        return;
      }
      if ((h.nextAttemptAt || 0) > p) {
        c.push({ chainKey: f, at: h.nextAttemptAt });
        return;
      }
      h.status = "inflight", h.leaseOwner = n, h.leaseUntil = p + u, h.updatedAt = p, d.push(h);
    }
  }), { entries: d, wakeups: c };
}
function Qi(t, n, u, p, l) {
  const d = [], c = [];
  for (const i of t || []) {
    if (i.entryId === n) {
      c.push(i.entryId);
      continue;
    }
    i.chainKey === u && (i.chainKey = p, i.targetId === u && (i.targetId = p), i.meta && i.meta.id === u && (i.meta.id = p), i.meta && typeof i.meta.action == "string" && (i.meta.action = Gi(i.meta.action, u, p)), i.updatedAt = l, d.push(i));
  }
  return { changed: d, deleted: c };
}
class Xi {
  constructor(n) {
    n = n || {}, this.indexedDB = n.indexedDB || globalThis.indexedDB, this.keyRange = n.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = n.dbName || Vi, this.now = n.now || (() => Date.now()), this.uuid = n.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((n, u) => {
      const p = this.indexedDB.open(this.dbName, Wi);
      p.onupgradeneeded = (l) => {
        const d = l.target.result;
        let c;
        d.objectStoreNames.contains(Q) ? c = l.target.transaction.objectStore(Q) : c = d.createObjectStore(Q, { keyPath: "entryId" }), c.indexNames.contains("by_scope_chain") || c.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), c.indexNames.contains("by_scope_seq") || c.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), d.objectStoreNames.contains(Z) || d.createObjectStore(Z, { keyPath: "key" });
      }, p.onerror = () => u(nt(p, "Queue database open failed")), p.onsuccess = (l) => {
        this._db = l.target.result, this._db.onversionchange = () => this.close(), n(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((n, u) => {
      const p = this.indexedDB.deleteDatabase(this.dbName);
      p.onsuccess = () => n(), p.onerror = () => u(nt(p, "Queue database delete failed")), p.onblocked = () => u(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(n) {
    return this.open().then((u) => u ? new Promise((p, l) => {
      const c = u.transaction(Q, "readonly").objectStore(Q).index("by_scope_seq").getAll(wt(this.keyRange, n));
      c.onsuccess = () => p(c.result || []), c.onerror = () => l(nt(c, "Queue scope read failed"));
    }) : []);
  }
  enqueue(n, u) {
    return u = u || {}, this.open().then((p) => p ? new Promise((l, d) => {
      const c = p.transaction([Z, Q], "readwrite"), i = c.objectStore(Z), f = c.objectStore(Q), h = Fe(n);
      let b = null;
      const g = (m) => {
        const r = m + 1;
        b = {
          entryId: this.uuid(),
          scope: n,
          chainKey: u.chainKey,
          seq: r,
          op: u.op,
          targetId: u.targetId !== void 0 ? u.targetId : null,
          payload: u.payload,
          expectedVersion: u.expectedVersion !== void 0 ? u.expectedVersion : null,
          meta: u.meta || {},
          attempts: 0,
          nextAttemptAt: 0,
          status: "pending",
          leaseOwner: null,
          leaseUntil: 0,
          createdAt: this.now(),
          updatedAt: this.now()
        }, i.put({ key: h, value: r }), f.put(b);
      }, _ = i.get(h);
      _.onerror = () => d(nt(_, "Queue sequence read failed")), _.onsuccess = () => {
        const m = _.result;
        if (m && typeof m.value == "number") {
          g(m.value);
          return;
        }
        const r = f.index("by_scope_seq").getAll(wt(this.keyRange, n));
        r.onerror = () => d(nt(r, "Queue sequence migration failed")), r.onsuccess = () => {
          const s = (r.result || []).reduce((e, o) => Math.max(e, o.seq || 0), 0);
          g(s);
        };
      }, c.oncomplete = () => l(b), c.onerror = () => d(c.error || new Error("Queue enqueue transaction failed")), c.onabort = () => d(c.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(n, u, p) {
    return this.open().then((l) => l ? new Promise((d, c) => {
      const i = l.transaction(Q, "readwrite"), f = i.objectStore(Q), h = f.index("by_scope_seq").getAll(wt(this.keyRange, n)), b = this.now();
      let g = { entries: [], wakeups: [] };
      h.onerror = () => c(nt(h, "Queue claim read failed")), h.onsuccess = () => {
        g = $i(h.result || [], u, p, b);
        for (const _ of g.entries) f.put(_);
      }, i.oncomplete = () => d(g), i.onerror = () => c(i.error || new Error("Queue claim transaction failed")), i.onabort = () => c(i.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(n, u) {
    return this._updateEntry(n, u, (p, l) => (l.delete(p.entryId), { status: "acked", entry: p }));
  }
  nack(n, u, p, l) {
    l = l || {};
    const d = l.maxAttempts || 8, c = l.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((i) => i ? new Promise((f, h) => {
      const b = i.transaction([Q, Z], "readwrite"), g = b.objectStore(Q), _ = b.objectStore(Z), m = g.get(u);
      let r = null;
      m.onerror = () => h(nt(m, "Queue nack read failed")), m.onsuccess = () => {
        const s = m.result;
        if (!(!s || s.scope !== n)) {
          if (p === "drop") {
            g.delete(s.entryId), r = { status: "dropped", entry: s };
            return;
          }
          if (Ne(s), s.updatedAt = this.now(), p === "auth") {
            s.status = "pending", g.put(s), _.put({ key: Pt(n), value: "auth" }), r = { status: "auth", entry: s };
            return;
          }
          if (p === "retry") {
            if (s.attempts = (s.attempts || 0) + 1, s.attempts >= d) {
              s.status = "failed", s.nextAttemptAt = 0, g.put(s), r = { status: "failed", entry: s };
              return;
            }
            const e = c[Math.min(s.attempts - 1, c.length - 1)];
            s.status = "pending", s.nextAttemptAt = this.now() + e, g.put(s), r = { status: "retry", entry: s, delay: e };
          }
        }
      }, b.oncomplete = () => f(r), b.onerror = () => h(b.error || new Error("Queue nack transaction failed")), b.onabort = () => h(b.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(n, u, p) {
    return this._remapTransaction(n, null, u, p);
  }
  resolveCreate(n, u, p, l) {
    return this._remapTransaction(n, u, p, l);
  }
  _remapTransaction(n, u, p, l) {
    return this.open().then((d) => d ? new Promise((c, i) => {
      const f = d.transaction(Q, "readwrite"), h = f.objectStore(Q), b = h.index("by_scope_seq").getAll(wt(this.keyRange, n));
      let g = { changed: [], deleted: [] };
      b.onerror = () => i(nt(b, "Queue remap read failed")), b.onsuccess = () => {
        g = Qi(b.result || [], u, p, l, this.now());
        for (const _ of g.deleted) h.delete(_);
        for (const _ of g.changed) h.put(_);
      }, f.oncomplete = () => c(g.changed), f.onerror = () => i(f.error || new Error("Queue remap transaction failed")), f.onabort = () => i(f.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(n) {
    return this.open().then((u) => u ? new Promise((p, l) => {
      const d = u.transaction(Q, "readwrite"), c = d.objectStore(Q), i = c.index("by_scope_seq").getAll(wt(this.keyRange, n));
      let f = 0;
      i.onerror = () => l(nt(i, "Queue failed-entry read failed")), i.onsuccess = () => {
        for (const h of i.result || [])
          h.status === "failed" && (h.status = "pending", h.attempts = 0, h.nextAttemptAt = 0, h.updatedAt = this.now(), Ne(h), c.put(h), f++);
      }, d.oncomplete = () => p(f), d.onerror = () => l(d.error || new Error("Queue failed-entry reset failed")), d.onabort = () => l(d.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(n) {
    return this.open().then((u) => u ? new Promise((p, l) => {
      const c = u.transaction(Z, "readonly").objectStore(Z).get(Pt(n));
      c.onsuccess = () => {
        const i = c.result ? c.result.value : !1;
        p(i || !1);
      }, c.onerror = () => l(nt(c, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(n, u) {
    return this.open().then((p) => {
      if (p)
        return new Promise((l, d) => {
          const c = p.transaction(Z, "readwrite"), i = typeof u == "string" ? u : u ? "manual" : !1;
          c.objectStore(Z).put({ key: Pt(n), value: i }), c.oncomplete = () => l(), c.onerror = () => d(c.error || new Error("Queue pause-state write failed")), c.onabort = () => d(c.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(n) {
    return this.open().then((u) => {
      if (u)
        return new Promise((p, l) => {
          const d = u.transaction([Q, Z], "readwrite"), i = d.objectStore(Q).index("by_scope_seq").openCursor(wt(this.keyRange, n));
          i.onsuccess = (f) => {
            const h = f.target.result;
            h && (h.delete(), h.continue());
          }, i.onerror = () => l(nt(i, "Queue clear failed")), d.objectStore(Z).delete(Fe(n)), d.objectStore(Z).delete(Pt(n)), d.oncomplete = () => p(), d.onerror = () => l(d.error || new Error("Queue clear transaction failed")), d.onabort = () => l(d.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(n, u, p) {
    return this.open().then((l) => l ? new Promise((d, c) => {
      const i = l.transaction(Q, "readwrite"), f = i.objectStore(Q), h = f.get(u);
      let b = null;
      h.onerror = () => c(nt(h, "Queue entry read failed")), h.onsuccess = () => {
        const g = h.result;
        !g || g.scope !== n || (b = p(g, f));
      }, i.oncomplete = () => d(b), i.onerror = () => c(i.error || new Error("Queue entry transaction failed")), i.onabort = () => c(i.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", n = "lnApiQueue", u = [2e3, 5e3, 15e3, 6e4, 3e5], p = 8, l = 6e4;
  if (window[n] !== void 0) return;
  function d() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (b) => {
        const g = Math.random() * 16 | 0;
        return (b === "x" ? g : g & 3 | 8).toString(16);
      });
    }
  }
  const c = new Xi({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: d
  });
  function i(h) {
    this.dom = h, h[n] = this;
    const b = h.closest("[data-ln-data-coordinator]");
    this.scope = h.id || (b ? b.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = d(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const g = this;
    return c.open().then((_) => _ ? c.getPaused(g.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((_) => {
      if (g._paused = !!_, g._paused) {
        const m = typeof _ == "string" ? _ : "auth";
        S(g.dom, "ln-api-queue:paused", { reason: m, restored: !0 });
      }
      return g._emitPendingCount();
    }).then(() => g._drain()).catch((_) => {
      console.error("[ln-api-queue] Initialization failed:", _), S(g.dom, "ln-api-queue:error", { operation: "initialize", error: _ });
    }), this;
  }
  i.prototype._isOnline = function() {
    const h = this.dom.getAttribute("data-ln-api-queue-online");
    return h === "true" ? !0 : h === "false" ? !1 : navigator.onLine;
  }, i.prototype._emitPendingCount = function() {
    const h = this;
    return c.allForScope(h.scope).then((b) => (S(h.dom, "ln-api-queue:pending-count", { count: b.length, scope: h.scope }), b.length === 0 && S(h.dom, "ln-api-queue:drained", { scope: h.scope }), b));
  }, i.prototype._clearTimer = function(h) {
    const b = this._timers.get(h);
    b && (clearTimeout(b), this._timers.delete(h));
  }, i.prototype._scheduleTimer = function(h, b) {
    const g = Math.max(0, b), _ = this._timers.get(h);
    _ && clearTimeout(_);
    const m = this, r = setTimeout(() => {
      m._timers.delete(h), m._drain();
    }, g);
    this._timers.set(h, r);
  }, i.prototype._drain = function() {
    const h = this;
    return h._paused || !h._isOnline() ? Promise.resolve() : (h._drainPromise || (h._drainPromise = c.claimReady(h.scope, h._workerId, l).then((b) => {
      for (const g of b.wakeups)
        h._scheduleTimer(g.chainKey, g.at - Date.now());
      for (const g of b.entries)
        h._clearTimer(g.chainKey), S(h.dom, "ln-api-queue:send", {
          entryId: g.entryId,
          chainKey: g.chainKey,
          op: g.op,
          targetId: g.targetId,
          payload: g.payload,
          expectedVersion: g.expectedVersion,
          idempotencyKey: g.entryId,
          meta: g.meta
        });
    }).catch((b) => {
      console.error("[ln-api-queue] Drain failed:", b), S(h.dom, "ln-api-queue:error", { operation: "drain", error: b });
    }).finally(() => {
      h._drainPromise = null;
    })), h._drainPromise);
  }, i.prototype._onEnqueue = function(h) {
    const b = this;
    return c.enqueue(b.scope, h.detail || {}).then((g) => {
      if (g)
        return b._emitPendingCount().then((_) => (S(b.dom, "ln-api-queue:enqueued", {
          entryId: g.entryId,
          chainKey: g.chainKey,
          count: _.length
        }), b._drain()));
    }).catch((g) => {
      S(b.dom, "ln-api-queue:error", { operation: "enqueue", error: g });
    });
  }, i.prototype._onAck = function(h) {
    const b = this, g = h.detail || {};
    return c.ack(b.scope, g.entryId).then(() => b._emitPendingCount()).then(() => b._drain()).catch((_) => {
      S(b.dom, "ln-api-queue:error", { operation: "ack", entryId: g.entryId, error: _ });
    });
  }, i.prototype._onNack = function(h) {
    const b = this, g = h.detail || {};
    return c.nack(b.scope, g.entryId, g.reason, {
      maxAttempts: p,
      backoff: u
    }).then((_) => {
      if (_)
        return _.status === "failed" ? S(b.dom, "ln-api-queue:failed", {
          entryId: _.entry.entryId,
          chainKey: _.entry.chainKey,
          attempts: _.entry.attempts
        }) : _.status === "retry" ? b._scheduleTimer(_.entry.chainKey, _.delay) : _.status === "auth" && (b._paused = !0, S(b.dom, "ln-api-queue:paused", { reason: "auth" }), S(b.dom, "ln-api-queue:auth-required", {
          entryId: _.entry.entryId,
          chainKey: _.entry.chainKey
        })), b._emitPendingCount().then(() => {
          if (_.status === "dropped") return b._drain();
        });
    }).catch((_) => {
      S(b.dom, "ln-api-queue:error", { operation: "nack", entryId: g.entryId, error: _ });
    });
  }, i.prototype._onRemap = function(h) {
    const b = this, g = h.detail || {};
    return c.remap(b.scope, g.oldKey, g.newId).catch((_) => {
      S(b.dom, "ln-api-queue:error", { operation: "remap", error: _ });
    });
  }, i.prototype._onResolveCreate = function(h) {
    const b = this, g = h.detail || {};
    return c.resolveCreate(b.scope, g.entryId, g.oldKey, g.newId).then(() => b._emitPendingCount()).then(() => b._drain()).catch((_) => {
      S(b.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: g.entryId,
        error: _
      });
    });
  }, i.prototype._onResume = function() {
    const h = this;
    return c.setPaused(h.scope, !1).then(() => (h._paused = !1, S(h.dom, "ln-api-queue:resumed", {}), h._drain())).catch((b) => {
      S(h.dom, "ln-api-queue:error", { operation: "resume", error: b });
    });
  }, i.prototype._onPause = function() {
    const h = this;
    return c.setPaused(h.scope, "manual").then(() => {
      h._paused = !0, S(h.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((b) => {
      S(h.dom, "ln-api-queue:error", { operation: "pause", error: b });
    });
  }, i.prototype._onDrain = function() {
    const h = this;
    return c.resetFailed(h.scope).then(() => {
      const b = h._drainPromise;
      return b ? b.then(() => h._drain()) : h._drain();
    }).catch((b) => {
      S(h.dom, "ln-api-queue:error", { operation: "manual-drain", error: b });
    });
  }, i.prototype._onClear = function() {
    const h = this;
    return h._timers.forEach((b) => clearTimeout(b)), h._timers.clear(), c.clear(h.scope).then(() => {
      h._paused = !1, S(h.dom, "ln-api-queue:pending-count", { count: 0, scope: h.scope }), S(h.dom, "ln-api-queue:drained", { scope: h.scope });
    }).catch((b) => {
      S(h.dom, "ln-api-queue:error", { operation: "clear", error: b });
    });
  }, i.prototype._bindEvents = function() {
    const h = this;
    h._handlers = {
      enqueue: (b) => h._onEnqueue(b),
      ack: (b) => h._onAck(b),
      nack: (b) => h._onNack(b),
      remap: (b) => h._onRemap(b),
      resolveCreate: (b) => h._onResolveCreate(b),
      resume: () => h._onResume(),
      pause: () => h._onPause(),
      drain: () => h._onDrain(),
      clear: () => h._onClear()
    }, h.dom.addEventListener("ln-api-queue:request-enqueue", h._handlers.enqueue), h.dom.addEventListener("ln-api-queue:ack", h._handlers.ack), h.dom.addEventListener("ln-api-queue:nack", h._handlers.nack), h.dom.addEventListener("ln-api-queue:request-remap", h._handlers.remap), h.dom.addEventListener("ln-api-queue:resolve-create", h._handlers.resolveCreate), h.dom.addEventListener("ln-api-queue:request-resume", h._handlers.resume), h.dom.addEventListener("ln-api-queue:request-pause", h._handlers.pause), h.dom.addEventListener("ln-api-queue:request-drain", h._handlers.drain), h.dom.addEventListener("ln-api-queue:request-clear", h._handlers.clear);
  }, i.prototype.destroy = function() {
    if (!this.dom[n]) return;
    const h = this;
    h.dom.removeEventListener("ln-api-queue:request-enqueue", h._handlers.enqueue), h.dom.removeEventListener("ln-api-queue:ack", h._handlers.ack), h.dom.removeEventListener("ln-api-queue:nack", h._handlers.nack), h.dom.removeEventListener("ln-api-queue:request-remap", h._handlers.remap), h.dom.removeEventListener("ln-api-queue:resolve-create", h._handlers.resolveCreate), h.dom.removeEventListener("ln-api-queue:request-resume", h._handlers.resume), h.dom.removeEventListener("ln-api-queue:request-pause", h._handlers.pause), h.dom.removeEventListener("ln-api-queue:request-drain", h._handlers.drain), h.dom.removeEventListener("ln-api-queue:request-clear", h._handlers.clear), window.removeEventListener("online", h._onlineHandler), h._timers.forEach((b) => clearTimeout(b)), h._timers.clear(), S(h.dom, "ln-api-queue:destroyed", { scope: h.scope }), delete h.dom[n];
  };
  function f(h) {
    const b = h[n];
    b && b._drain();
  }
  M(t, n, i, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: f
  });
})();
function yn(t) {
  if (t == null || t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}
function Et(t) {
  return String(Math.round(t * 1e3) / 1e3);
}
function Yi(t, n, u) {
  const p = yn(t);
  return p === null || p < 0 ? 0 : Math.min(p, Math.min(n, u) / 2);
}
function Ji(t) {
  if (typeof t != "string") return null;
  const n = t.trim().split(/[\s,]+/).map(Number);
  return n.length !== 4 || n.some((u) => !Number.isFinite(u)) || n[2] <= 0 || n[3] <= 0 ? null : { x: n[0], y: n[1], width: n[2], height: n[3] };
}
function Zi(t) {
  if (!t || typeof t != "string") return null;
  const n = t.split(":"), u = n[0].trim();
  return u ? {
    field: u,
    direction: n[1] && n[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
  } : null;
}
function tr(t, n) {
  n = n || {};
  const u = n.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, p = n.xField || "label", l = n.yField || "value", d = n.includeZero !== !1, c = Yi(n.padding, u.width, u.height), i = Array.isArray(t) ? t : [], f = [];
  for (let v = 0; v < i.length; v++) {
    const w = i[v] || {}, A = yn(w[l]);
    A !== null && f.push({
      record: w,
      sourceIndex: v,
      label: w[p] == null ? String(v + 1) : String(w[p]),
      value: A
    });
  }
  if (f.length === 0)
    return {
      points: [],
      linePoints: "",
      areaPoints: "",
      count: 0,
      min: null,
      max: null,
      domainMin: 0,
      domainMax: 1,
      baselineY: u.y + u.height - c
    };
  let h = f[0].value, b = f[0].value;
  for (let v = 1; v < f.length; v++)
    f[v].value < h && (h = f[v].value), f[v].value > b && (b = f[v].value);
  let g = h, _ = b;
  d && (g = Math.min(0, g), _ = Math.max(0, _)), g === _ && (_ === 0 ? _ = 1 : _ > 0 ? g = 0 : _ = 0);
  const m = Math.max(1, u.width - c * 2), r = Math.max(1, u.height - c * 2), s = _ - g, e = u.y + u.height - c - (0 - g) / s * r, o = [];
  for (let v = 0; v < f.length; v++) {
    const w = f[v], A = f.length === 1 ? 0.5 : v / (f.length - 1), C = u.x + c + A * m, L = u.y + u.height - c - (w.value - g) / s * r;
    o.push({
      record: w.record,
      sourceIndex: w.sourceIndex,
      label: w.label,
      value: w.value,
      x: C,
      y: L,
      pointString: Et(C) + "," + Et(L)
    });
  }
  const a = o.map((v) => v.pointString).join(" ");
  let y = "";
  if (o.length > 0) {
    const v = o[0], w = o[o.length - 1], A = Et(v.x) + "," + Et(e), C = Et(w.x) + "," + Et(e);
    y = A + " " + a + " " + C;
  }
  return {
    points: o,
    linePoints: a,
    areaPoints: y,
    count: o.length,
    min: h,
    max: b,
    domainMin: g,
    domainMax: _,
    baselineY: e
  };
}
(function() {
  const t = "data-ln-chart", n = "lnChart", u = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[n] !== void 0) return;
  function p(d, c) {
    d && (d.textContent = c);
  }
  function l(d) {
    this.dom = d, this.name = d.getAttribute(t) || "", this.source = d.getAttribute("data-ln-chart-source") || this.name, this.plot = d.querySelector("[data-ln-chart-plot]"), this.line = d.querySelector("[data-ln-chart-line]"), this.area = d.querySelector("[data-ln-chart-area]"), this.labels = d.querySelector("[data-ln-chart-labels]"), this.empty = d.querySelector("[data-ln-chart-empty]"), this.minimum = d.querySelector("[data-ln-chart-min]"), this.maximum = d.querySelector("[data-ln-chart-max]"), this.count = d.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const c = this;
    return this._onSetData = function(i) {
      const f = i.detail || {};
      c._data = Array.isArray(f.data) ? f.data : [], c.isLoaded = !0, c._setLoading(!1), c._render();
    }, this._onSetLoading = function(i) {
      c._setLoading(!!(i.detail && i.detail.loading));
    }, this._onRefresh = function() {
      c.requestData();
    }, d.addEventListener("ln-chart:set-data", this._onSetData), d.addEventListener("ln-chart:set-loading", this._onSetLoading), d.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  l.prototype._readOptions = function() {
    const d = this.dom.getAttribute("data-ln-chart-padding"), c = d === null ? NaN : Number(d), i = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(c) && c >= 0 ? c : 16,
      type: i === "area" || i === "polygon" ? "area" : "line",
      viewBox: this.plot && Ji(this.plot.getAttribute("viewBox")) || u
    };
  }, l.prototype._setLoading = function(d) {
    this.dom.classList.toggle("ln-chart--loading", d), this.dom.setAttribute("aria-busy", d ? "true" : "false");
  }, l.prototype._renderLabels = function(d) {
    if (!this.labels || (this.labels.replaceChildren(), d.count === 0)) return;
    const c = this.name + "-label", i = '[data-ln-template="' + c + '"]';
    if (!this.dom.querySelector(i) && !document.querySelector(i)) return;
    const f = pt(this.dom, c, "ln-chart");
    if (!f) return;
    const h = V(this.dom);
    for (const b of d.points) {
      const g = f.cloneNode(!0);
      Dt(g, {
        label: b.label,
        value: tt(b.value, h)
      }), this.labels.appendChild(g);
    }
  }, l.prototype._render = function() {
    const d = this._readOptions(), c = tr(this._data, d);
    this.model = c, this.line && (this.line.setAttribute("points", c.linePoints), this.line.toggleAttribute("hidden", c.count === 0)), this.area && (this.area.setAttribute("points", c.areaPoints), this.area.toggleAttribute("hidden", c.count === 0 || d.type !== "area"));
    const i = c.count === 0;
    this.dom.classList.toggle("ln-chart--empty", i), this.empty && this.empty.toggleAttribute("hidden", !i);
    const f = V(this.dom);
    p(this.minimum, tt(c.min, f)), p(this.maximum, tt(c.max, f)), p(this.count, tt(c.count, f)), this._renderLabels(c), S(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: c.count,
      min: c.min,
      max: c.max
    });
  }, l.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, S(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: Zi(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, l.prototype.destroy = function() {
    this.dom[n] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[n]);
  }, M(t, n, l, "ln-chart", {
    extraAttributes: [
      "data-ln-chart-source",
      "data-ln-chart-x",
      "data-ln-chart-y",
      "data-ln-chart-type",
      "data-ln-chart-padding",
      "data-ln-chart-zero",
      "data-ln-chart-sort"
    ],
    onAttributeChange: function(d, c) {
      const i = d[n];
      if (i) {
        if (c === "data-ln-chart-source" || c === "data-ln-chart-sort") {
          i.requestData();
          return;
        }
        i._render();
      }
    }
  });
})();
(function() {
  const t = "data-ln-options", n = "lnOptions";
  if (window[n] !== void 0) return;
  function u(p) {
    this.dom = p, this._storeName = p.getAttribute(t), this._valueField = p.getAttribute("data-ln-options-value") || "id", this._labelField = p.getAttribute("data-ln-options-label") || "name";
    const l = this;
    return this._onSetData = function(d) {
      l._rebuild(d.detail.data || []);
    }, p.addEventListener("ln-options:set-data", this._onSetData), S(p, "ln-options:request-data", { options: this._storeName }), this;
  }
  u.prototype._rebuild = function(p) {
    const l = this.dom, d = this._valueField, c = this._labelField, i = l.value, f = l.querySelectorAll("option");
    for (let b = f.length - 1; b >= 0; b--)
      f[b].value !== "" && l.removeChild(f[b]);
    for (let b = 0; b < p.length; b++) {
      const g = p[b], _ = document.createElement("option");
      _.value = String(g[d]), _.textContent = g[c] != null ? g[c] : "", l.appendChild(_);
    }
    const h = l.options;
    for (let b = 0; b < h.length; b++)
      if (h[b].value === i) {
        l.value = i;
        break;
      }
  }, u.prototype.destroy = function() {
    this.dom[n] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[n]);
  }, M(t, n, u, "ln-options");
})();
function er(t) {
  if (!t || typeof t != "string") return null;
  const n = t.indexOf(":");
  if (n === -1) return null;
  const u = t.slice(0, n).trim(), p = t.slice(n + 1).trim();
  if (!u) return null;
  const l = {};
  return l[u] = [p], l;
}
function nr(t) {
  return t == null ? "" : String(t);
}
(function() {
  const t = "data-ln-stat", n = "lnStat";
  if (window[n] !== void 0) return;
  function u(p) {
    return this.dom = p, this._storeName = p.getAttribute(t), this._filters = er(p.getAttribute("data-ln-stat-filter")), this._onSetCount = function(l) {
      p.textContent = nr(l.detail && l.detail.count), p.classList.remove("is-loading");
    }, p.addEventListener("ln-stat:set-count", this._onSetCount), S(p, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  u.prototype.destroy = function() {
    this.dom[n] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[n]);
  }, M(t, n, u, "ln-stat");
})();
(function() {
  const t = "ln-icon-sprite", n = "#ln-icon-", u = "#ln-icon-custom-", p = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set();
  let d = null;
  const c = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), i = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), f = "lni:", h = "lni:v", b = "1";
  function g() {
    try {
      if (localStorage.getItem(h) !== b) {
        for (let a = localStorage.length - 1; a >= 0; a--) {
          const y = localStorage.key(a);
          y && y.indexOf(f) === 0 && localStorage.removeItem(y);
        }
        localStorage.setItem(h, b);
      }
    } catch {
    }
  }
  g();
  function _() {
    return d || (d = document.getElementById(t), d || (d = document.createElementNS("http://www.w3.org/2000/svg", "svg"), d.id = t, d.setAttribute("hidden", ""), d.setAttribute("aria-hidden", "true"), d.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(d, document.body.firstChild))), d;
  }
  function m(a) {
    return a.indexOf(u) === 0 ? i + "/" + a.slice(u.length) + ".svg" : c + "/" + a.slice(n.length) + ".svg";
  }
  function r(a, y) {
    const v = y.match(/viewBox="([^"]+)"/), w = v ? v[1] : "0 0 24 24", A = y.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), C = A ? A[1].trim() : "", L = y.match(/<svg([^>]*)>/i), q = L ? L[1] : "", x = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    x.id = a, x.setAttribute("viewBox", w), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(D) {
      const F = q.match(new RegExp(D + '="([^"]*)"'));
      F && x.setAttribute(D, F[1]);
    }), x.innerHTML = C, _().querySelector("defs").appendChild(x);
  }
  function s(a) {
    if (p.has(a) || l.has(a)) return;
    if (a.indexOf(u) === 0 && !i) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", a);
      return;
    }
    const y = a.slice(1);
    try {
      const w = localStorage.getItem(f + y);
      if (w) {
        r(y, w), p.add(a);
        return;
      }
    } catch {
    }
    l.add(a);
    const v = m(a);
    fetch(v).then(function(w) {
      if (!w.ok) throw new Error(w.status);
      return w.text();
    }).then(function(w) {
      r(y, w), p.add(a), l.delete(a);
      try {
        localStorage.setItem(f + y, w);
      } catch {
      }
    }).catch(function(w) {
      console.error("[ln-icon] Fetch failed for:", y, w), l.delete(a);
    });
  }
  function e(a) {
    const y = 'use[href^="' + n + '"], use[href^="' + u + '"]', v = a.querySelectorAll ? a.querySelectorAll(y) : [];
    if (a.matches && a.matches(y)) {
      const w = a.getAttribute("href");
      w && s(w);
    }
    Array.prototype.forEach.call(v, function(w) {
      const A = w.getAttribute("href");
      A && s(A);
    });
  }
  function o() {
    e(document), new MutationObserver(function(a) {
      a.forEach(function(y) {
        if (y.type === "childList")
          y.addedNodes.forEach(function(v) {
            v.nodeType === 1 && e(v);
          });
        else if (y.type === "attributes" && y.attributeName === "href") {
          const v = y.target.getAttribute("href");
          v && (v.indexOf(n) === 0 || v.indexOf(u) === 0) && s(v);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
const be = /* @__PURE__ */ new Set([
  "data-ln-accordion",
  "data-ln-ajax",
  "data-ln-api-base-url",
  "data-ln-api-connector",
  "data-ln-api-connector-query-debounce",
  "data-ln-api-headers",
  "data-ln-api-param-limit",
  "data-ln-api-param-offset",
  "data-ln-api-param-search",
  "data-ln-api-param-sort-dir",
  "data-ln-api-param-sort-field",
  "data-ln-api-path",
  "data-ln-api-queue",
  "data-ln-api-queue-online",
  "data-ln-attr",
  "data-ln-autoresize",
  "data-ln-autosave",
  "data-ln-autosave-clear",
  "data-ln-autosave-debounce-input",
  "data-ln-autosave-exclude",
  "data-ln-chart",
  "data-ln-chart-area",
  "data-ln-chart-count",
  "data-ln-chart-empty",
  "data-ln-chart-labels",
  "data-ln-chart-line",
  "data-ln-chart-max",
  "data-ln-chart-min",
  "data-ln-chart-padding",
  "data-ln-chart-plot",
  "data-ln-chart-sort",
  "data-ln-chart-source",
  "data-ln-chart-type",
  "data-ln-chart-x",
  "data-ln-chart-y",
  "data-ln-chart-zero",
  "data-ln-circular-progress",
  "data-ln-circular-progress-label",
  "data-ln-circular-progress-max",
  "data-ln-class",
  "data-ln-confirm",
  "data-ln-confirm-active",
  "data-ln-confirm-idle",
  "data-ln-confirm-timeout",
  "data-ln-couchdb-auth",
  "data-ln-couchdb-connector",
  "data-ln-couchdb-db",
  "data-ln-couchdb-headers",
  "data-ln-couchdb-url",
  "data-ln-data-coordinator",
  "data-ln-data-coordinator-dict",
  "data-ln-data-coordinator-no-autosync",
  "data-ln-data-coordinator-stale",
  "data-ln-data-mapper",
  "data-ln-data-store",
  "data-ln-data-store-indexes",
  "data-ln-data-store-no-autosync",
  "data-ln-data-store-no-local-query",
  "data-ln-data-store-search-fields",
  "data-ln-data-store-stale",
  "data-ln-data-store-window",
  "data-ln-data-store-window-page",
  "data-ln-date",
  "data-ln-date-dict",
  "data-ln-date-dict-key",
  "data-ln-date-field",
  "data-ln-date-format",
  "data-ln-date-label",
  "data-ln-date-locale",
  "data-ln-debug",
  "data-ln-dropdown",
  "data-ln-dropdown-menu",
  "data-ln-dropdown-placement",
  "data-ln-dropdown-position",
  "data-ln-editor",
  "data-ln-editor-action",
  "data-ln-editor-source",
  "data-ln-empty",
  "data-ln-empty-state",
  "data-ln-empty-when",
  "data-ln-error",
  "data-ln-external-link",
  "data-ln-field",
  "data-ln-fill-as",
  "data-ln-fill-form",
  "data-ln-fill-id",
  "data-ln-fillable",
  "data-ln-filter",
  "data-ln-filter-col",
  "data-ln-filter-hide",
  "data-ln-filter-key",
  "data-ln-filter-options",
  "data-ln-filter-reset",
  "data-ln-filter-search",
  "data-ln-filter-value",
  "data-ln-form",
  "data-ln-form-action-edit",
  "data-ln-form-action-method",
  "data-ln-form-scope",
  "data-ln-hash",
  "data-ln-include",
  "data-ln-item",
  "data-ln-item-action",
  "data-ln-item-id",
  "data-ln-item-select",
  "data-ln-key",
  "data-ln-key-allow-input",
  "data-ln-key-for",
  "data-ln-key-modifier",
  "data-ln-key-target",
  "data-ln-link",
  "data-ln-list",
  "data-ln-list-body",
  "data-ln-list-count",
  "data-ln-list-empty",
  "data-ln-list-field",
  "data-ln-list-filtered",
  "data-ln-list-select-all",
  "data-ln-list-selectable",
  "data-ln-list-selected",
  "data-ln-list-source",
  "data-ln-list-total",
  "data-ln-list-window",
  "data-ln-list-window-page",
  "data-ln-list-window-threshold",
  "data-ln-mapper",
  "data-ln-modal",
  "data-ln-modal-close",
  "data-ln-modal-for",
  "data-ln-modal-mode",
  "data-ln-modal-when",
  "data-ln-nav",
  "data-ln-nav-exact",
  "data-ln-number",
  "data-ln-number-decimals",
  "data-ln-number-max",
  "data-ln-number-min",
  "data-ln-options",
  "data-ln-options-label",
  "data-ln-options-value",
  "data-ln-outlet",
  "data-ln-panel",
  "data-ln-persist",
  "data-ln-popover",
  "data-ln-popover-for",
  "data-ln-popover-placement",
  "data-ln-popover-position",
  "data-ln-progress",
  "data-ln-progress-max",
  "data-ln-render-key",
  "data-ln-route",
  "data-ln-route-keep",
  "data-ln-route-target",
  "data-ln-route-title",
  "data-ln-router-hydrate",
  "data-ln-search",
  "data-ln-search-clear",
  "data-ln-search-clear-for",
  "data-ln-search-exclude",
  "data-ln-search-fields",
  "data-ln-search-for",
  "data-ln-search-hide",
  "data-ln-search-items",
  "data-ln-show",
  "data-ln-slug-from",
  "data-ln-sort",
  "data-ln-sort-dir",
  "data-ln-sort-field",
  "data-ln-sort-icon",
  "data-ln-sort-items",
  "data-ln-sort-state",
  "data-ln-sortable",
  "data-ln-sortable-handle",
  "data-ln-stat",
  "data-ln-stat-card",
  "data-ln-stat-filter",
  "data-ln-stat-label",
  "data-ln-stat-trend",
  "data-ln-stat-value",
  "data-ln-step",
  "data-ln-step-label",
  "data-ln-stepper",
  "data-ln-store",
  "data-ln-tab",
  "data-ln-table",
  "data-ln-table-body",
  "data-ln-table-cell-attr",
  "data-ln-table-clear",
  "data-ln-table-clear-all",
  "data-ln-table-col",
  "data-ln-table-col-filter",
  "data-ln-table-col-select",
  "data-ln-table-col-sort",
  "data-ln-table-coordinator",
  "data-ln-table-count",
  "data-ln-table-dict",
  "data-ln-table-empty",
  "data-ln-table-empty-when",
  "data-ln-table-filter-col",
  "data-ln-table-filtered",
  "data-ln-table-row",
  "data-ln-table-row-action",
  "data-ln-table-row-id",
  "data-ln-table-row-select",
  "data-ln-table-select-all-label",
  "data-ln-table-selectable",
  "data-ln-table-selected",
  "data-ln-table-sort",
  "data-ln-table-source",
  "data-ln-table-total",
  "data-ln-table-window",
  "data-ln-table-window-page",
  "data-ln-table-window-threshold",
  "data-ln-tabs",
  "data-ln-tabs-active",
  "data-ln-tabs-default",
  "data-ln-tabs-focus",
  "data-ln-tabs-key",
  "data-ln-template",
  "data-ln-time",
  "data-ln-time-locale",
  "data-ln-toast",
  "data-ln-toast-close",
  "data-ln-toast-item",
  "data-ln-toast-max",
  "data-ln-toast-timeout",
  "data-ln-toast-when",
  "data-ln-toggle",
  "data-ln-toggle-action",
  "data-ln-toggle-for",
  "data-ln-tooltip",
  "data-ln-tooltip-enhance",
  "data-ln-tooltip-enhanced",
  "data-ln-tooltip-placement",
  "data-ln-tooltip-position",
  "data-ln-translatable",
  "data-ln-translatable-lang",
  "data-ln-translations",
  "data-ln-translations-active",
  "data-ln-translations-add",
  "data-ln-translations-lang",
  "data-ln-translations-locales",
  "data-ln-translations-prefix",
  "data-ln-ui-coordinator",
  "data-ln-ui-coordinator-dict",
  "data-ln-upload",
  "data-ln-upload-accept",
  "data-ln-upload-action",
  "data-ln-upload-delete",
  "data-ln-upload-dict",
  "data-ln-upload-ext",
  "data-ln-upload-file-field",
  "data-ln-upload-id",
  "data-ln-upload-ids-field",
  "data-ln-upload-item",
  "data-ln-upload-list",
  "data-ln-upload-local-id",
  "data-ln-upload-max-files",
  "data-ln-upload-max-size",
  "data-ln-upload-progress",
  "data-ln-upload-size",
  "data-ln-upload-state",
  "data-ln-upload-zone",
  "data-ln-validate",
  "data-ln-validate-error",
  "data-ln-validate-errors",
  "data-ln-value",
  "data-ln-websocket-connector"
]);
function ir(t, n) {
  if (t === n) return 0;
  if (!t.length) return n.length;
  if (!n.length) return t.length;
  const u = [];
  for (let p = 0; p <= n.length; p++) u[p] = [p];
  for (let p = 0; p <= t.length; p++) u[0][p] = p;
  for (let p = 1; p <= n.length; p++)
    for (let l = 1; l <= t.length; l++)
      n.charAt(p - 1) === t.charAt(l - 1) ? u[p][l] = u[p - 1][l - 1] : u[p][l] = Math.min(
        u[p - 1][l - 1] + 1,
        u[p][l - 1] + 1,
        u[p - 1][l] + 1
      );
  return u[n.length][t.length];
}
function rr(t, n = be) {
  if (n.has(t)) return null;
  let u = null, p = 1 / 0;
  for (const d of n) {
    const c = ir(t, d);
    c < p && (p = c, u = d);
  }
  const l = Math.max(3, Math.floor(t.length * 0.4));
  return p <= l ? u : null;
}
function vn(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function or(t = document) {
  const n = t.ownerDocument || t, u = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!u) return [];
  const p = [], l = [u, ...u.querySelectorAll("*")];
  for (let d = 0; d < l.length; d++) {
    const c = l[d];
    if (c.attributes)
      for (let i = 0; i < c.attributes.length; i++) {
        const f = c.attributes[i];
        if (f.name.startsWith("data-ln-") && f.name.endsWith("-for")) {
          const h = (f.value || "").trim();
          if (!h) {
            p.push({
              type: "id-empty",
              element: c,
              attribute: f.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${c.tagName.toLowerCase()} ${f.name}="">.`
            });
            continue;
          }
          n.getElementById(h) || n.querySelector("#" + vn(h)) || p.push({
            type: "id-unresolved",
            element: c,
            attribute: f.name,
            targetId: h,
            message: `[ln-debug] Unresolved ID reference: <${c.tagName.toLowerCase()} ${f.name}="${h}"> targets "#${h}", but no element with id="${h}" exists in the document.`
          });
        }
      }
  }
  return p;
}
function sr(t = document) {
  const n = t.ownerDocument || t, u = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!u) return [];
  const p = [], l = [u, ...u.querySelectorAll("*")];
  for (let d = 0; d < l.length; d++) {
    const c = l[d];
    if (c.attributes)
      for (let i = 0; i < c.attributes.length; i++) {
        const f = c.attributes[i];
        if (f.name.startsWith("data-ln-") && (f.name.endsWith("-source") || f.name.endsWith("-store")) && f.name !== "data-ln-data-store") {
          const b = (f.value || "").trim();
          if (!b) {
            p.push({
              type: "store-empty",
              element: c,
              attribute: f.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${c.tagName.toLowerCase()} ${f.name}="">.`
            });
            continue;
          }
          const g = vn(b), _ = n.querySelector(`[data-ln-data-store="${g}"], [data-ln-store="${g}"]`), m = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(b);
          !_ && !m && p.push({
            type: "store-unresolved",
            element: c,
            attribute: f.name,
            storeName: b,
            message: `[ln-debug] Unresolved store reference: <${c.tagName.toLowerCase()} ${f.name}="${b}"> targets store "${b}", but no [data-ln-data-store="${b}"] exists in the document.`
          });
        }
      }
  }
  return p;
}
function ar(t = document) {
  t.ownerDocument;
  const n = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!n) return [];
  const u = [], p = Array.from(n.querySelectorAll("[data-ln-data-store]"));
  n.hasAttribute && n.hasAttribute("data-ln-data-store") && p.unshift(n);
  const l = /* @__PURE__ */ new Map();
  for (let d = 0; d < p.length; d++) {
    const c = p[d], i = (c.getAttribute("data-ln-data-store") || "").trim();
    i && (l.has(i) || l.set(i, []), l.get(i).push(c));
  }
  for (const [d, c] of l.entries())
    c.length > 1 && u.push({
      type: "store-duplicate",
      storeName: d,
      elements: c,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${d}". Store names must be unique across the document.`
    });
  return u;
}
function lr(t = document, n = be) {
  const u = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!u) return [];
  const p = [], l = [u, ...u.querySelectorAll("*")];
  for (let d = 0; d < l.length; d++) {
    const c = l[d];
    if (c.attributes)
      for (let i = 0; i < c.attributes.length; i++) {
        const f = c.attributes[i];
        if (f.name.startsWith("data-ln-") && !n.has(f.name)) {
          const h = rr(f.name, n), b = h ? ` Did you mean "${h}"?` : "";
          p.push({
            type: "attribute-unknown",
            element: c,
            attribute: f.name,
            suggestion: h,
            message: `[ln-debug] Unknown attribute "${f.name}" on <${c.tagName.toLowerCase()}>.${b}`
          });
        }
      }
  }
  return p;
}
function de(t = typeof document < "u" ? document : null, n = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const u = n.validAttributes || be, p = or(t), l = sr(t), d = ar(t), c = lr(t, u), i = [
    ...p,
    ...l,
    ...d,
    ...c
  ];
  if (!n.silent)
    for (let f = 0; f < i.length; f++)
      console.warn(i[f].message);
  return {
    idIssues: p,
    storeIssues: l,
    uniquenessIssues: d,
    spellingIssues: c,
    total: i.length
  };
}
let qt = null;
function Bt(t = typeof document < "u" ? document : null, n = 50, u = null) {
  if (!t) return;
  qt && (clearTimeout(qt), qt = null);
  function p() {
    qt = setTimeout(() => {
      qt = null;
      const l = de(t);
      u && u(l);
    }, n);
  }
  je() > 0 ? it(p) : p();
}
(function() {
  const t = "data-ln-debug", n = "lnDebug";
  if (typeof window < "u" && window[n] !== void 0) return;
  function u(p) {
    return this.dom = p, Bt(p.ownerDocument || document), this;
  }
  u.prototype.verify = function(p, l) {
    return de(p || (this.dom ? this.dom.ownerDocument || this.dom : document), l);
  }, u.prototype.destroy = function() {
    delete this.dom[n];
  }, typeof window < "u" && (window.lnDebug = {
    verify: function(p, l) {
      return de(p || document, l);
    },
    schedule: function(p, l, d) {
      return Bt(p || document, l, d);
    }
  }), M(t, n, u, "ln-debug", {
    onInit: function(p) {
      typeof document < "u" && Bt(p && p.ownerDocument ? p.ownerDocument : document);
    },
    onSubtreeChange: function(p) {
      typeof document < "u" && Bt(p && p.ownerDocument ? p.ownerDocument : document);
    }
  });
})();
