function le(e) {
  let n = !1;
  for (let u = 0; u < e.length; u++) {
    const m = e[u];
    if (!(m === "" || m == null) && (n = !0, !Number.isFinite(Number(m))))
      return "string";
  }
  return n ? "number" : "string";
}
function ce(e, n, u, m) {
  if (u === "number") {
    const c = parseFloat(e), r = parseFloat(n);
    return (isNaN(c) ? 0 : c) - (isNaN(r) ? 0 : r);
  }
  const l = e != null ? String(e) : "", h = n != null ? String(n) : "";
  return m ? m.compare(l, h) : l < h ? -1 : l > h ? 1 : 0;
}
if (typeof window < "u") {
  const e = console.warn;
  console.warn = function(...n) {
    typeof n[0] == "string" && (n[0].startsWith("[ln-") || n[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || e.apply(console, n);
  };
}
const $t = {};
function Pt(e, n) {
  $t[e] || ($t[e] = document.querySelector('[data-ln-template="' + e + '"]'));
  const u = $t[e];
  return u ? u.content.cloneNode(!0) : (console.warn("[" + (n || "ln-core") + '] Template "' + e + '" not found'), null);
}
function S(e, n, u) {
  e.dispatchEvent(new CustomEvent(n, {
    bubbles: !0,
    detail: u || {}
  }));
}
function W(e, n, u) {
  const m = new CustomEvent(n, {
    bubbles: !0,
    cancelable: !0,
    detail: u || {}
  });
  return e.dispatchEvent(m), m;
}
function Oe(e, n, u) {
  e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), e._updateFooter();
  const m = {
    sort: e.currentSort,
    filters: e.currentFilters,
    search: e.currentSearch
  };
  m[u] = e.name, S(e.dom, n, m);
}
function rt(e, n) {
  if (!e || !n) return e;
  const u = e.querySelectorAll("[data-ln-field]");
  for (let c = 0; c < u.length; c++) {
    const r = u[c], d = r.getAttribute("data-ln-field");
    n[d] != null && (r.textContent = n[d]);
  }
  const m = e.querySelectorAll("[data-ln-attr]");
  for (let c = 0; c < m.length; c++) {
    const r = m[c], d = r.getAttribute("data-ln-attr").split(",");
    for (let f = 0; f < d.length; f++) {
      const y = d[f].trim().split(":");
      if (y.length !== 2) continue;
      const p = y[0].trim(), _ = y[1].trim();
      n[_] != null && r.setAttribute(p, n[_]);
    }
  }
  const l = e.querySelectorAll("[data-ln-show]");
  for (let c = 0; c < l.length; c++) {
    const r = l[c], d = r.getAttribute("data-ln-show");
    d in n && r.classList.toggle("hidden", !n[d]);
  }
  const h = e.querySelectorAll("[data-ln-class]");
  for (let c = 0; c < h.length; c++) {
    const r = h[c], d = r.getAttribute("data-ln-class").split(",");
    for (let f = 0; f < d.length; f++) {
      const y = d[f].trim().split(":");
      if (y.length !== 2) continue;
      const p = y[0].trim(), _ = y[1].trim();
      _ in n && r.classList.toggle(p, !!n[_]);
    }
  }
  return e;
}
function Sn(e, n) {
  e.matches && e.matches("[data-ln-form], [data-ln-fillable]") && e.dispatchEvent(new CustomEvent("ln-fill", { detail: n ?? null, bubbles: !0 }));
  const u = e.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let m = 0; m < u.length; m++)
    u[m].dispatchEvent(new CustomEvent("ln-fill", { detail: n ?? null, bubbles: !0 }));
  return e;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(e) {
  if (!(!e.target.matches || !e.target.matches("[data-ln-fillable]")))
    if (e.detail)
      rt(e.target, e.detail);
    else {
      const n = e.target.querySelectorAll("[data-ln-field]");
      for (let u = 0; u < n.length; u++)
        n[u].textContent = "";
    }
})));
function It(e, n) {
  if (!e || !n) return e;
  const u = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
  for (; u.nextNode(); ) {
    const h = u.currentNode;
    h.textContent.indexOf("{{") !== -1 && (h.textContent = h.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(c, r) {
        return n[r] !== void 0 ? n[r] : "";
      }
    ));
  }
  const m = function(h, c) {
    return n[c] !== void 0 ? n[c] : "";
  }, l = Array.from(e.querySelectorAll("*"));
  e.nodeType === 1 && l.push(e);
  for (let h = 0; h < l.length; h++) {
    const c = l[h], r = c.attributes;
    for (let d = 0; d < r.length; d++) {
      const f = r[d];
      f.value.indexOf("{{") !== -1 && c.setAttribute(f.name, f.value.replace(/\{\{\s*(\w+)\s*\}\}/g, m));
    }
  }
  return e;
}
function Cn(e, n, u, m, l, h) {
  const c = {};
  for (let d = 0; d < e.children.length; d++) {
    const f = e.children[d], y = f.getAttribute("data-ln-render-key");
    y && (c[y] = f);
  }
  const r = document.createDocumentFragment();
  for (let d = 0; d < n.length; d++) {
    const f = n[d], y = String(m(f));
    let p = c[y];
    if (p)
      l(p, f, d);
    else {
      const _ = Pt(u, h);
      if (!_ || (It(_, f), p = _.firstElementChild, !p)) continue;
      p.setAttribute("data-ln-render-key", y), l(p, f, d);
    }
    r.appendChild(p);
  }
  e.textContent = "", e.appendChild(r);
}
function ct(e, n) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      ct(e, n);
    }), console.warn("[" + n + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  e();
}
function pt(e, n, u) {
  if (e) {
    const m = e.querySelector('[data-ln-template="' + n + '"]');
    if (m) return m.content.cloneNode(!0);
  }
  return Pt(n, u);
}
function zt(e, n) {
  const u = {}, m = e.querySelectorAll("[" + n + "]");
  for (let l = 0; l < m.length; l++)
    u[m[l].getAttribute(n)] = m[l].textContent, m[l].remove();
  return u;
}
function Xt(e, n, u, m) {
  if (e.nodeType !== 1) return;
  const h = n.indexOf("[") !== -1 || n.indexOf(".") !== -1 || n.indexOf("#") !== -1 ? n : "[" + n + "]", c = Array.from(e.querySelectorAll(h));
  e.matches && e.matches(h) && c.push(e);
  for (const r of c)
    r[u] || (r[u] = new m(r));
}
function xt(e) {
  return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}
function Me(e) {
  return !!(!e || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || typeof e.button == "number" && e.button !== 0);
}
function Ln(e) {
  if (!e) return !1;
  if (typeof e.closest == "function")
    return !!e.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const n = String(e.tagName || "").toLowerCase();
  return n === "input" || n === "textarea" || n === "select" || !!e.isContentEditable;
}
function Fe(e) {
  return !!(!e || e.disabled || typeof e.getAttribute == "function" && e.getAttribute("aria-disabled") === "true" || typeof e.closest == "function" && e.closest("[inert]"));
}
function Tn(e, n) {
  return !e || !document.contains(e) || Fe(e) || n && typeof e[n] != "function" ? !1 : xt(e);
}
function qn(e) {
  const n = e.querySelector('input[name="_method"]');
  return ((n && n.value !== "" ? n.value : e.method) || "").toUpperCase();
}
function Ne(e, n) {
  const u = !!(n && n.typed), m = n && n.exclude, l = {}, h = e.elements, c = {};
  if (u)
    for (let r = 0; r < h.length; r++) {
      const d = h[r];
      d.name && d.type === "checkbox" && !d.disabled && (c[d.name] = (c[d.name] || 0) + 1);
    }
  for (let r = 0; r < h.length; r++) {
    const d = h[r];
    if (!(!d.name || d.disabled || d.type === "file" || d.type === "submit" || d.type === "button") && !(m && d.matches && d.matches(m)))
      if (d.type === "checkbox")
        u && c[d.name] === 1 ? l[d.name] = d.checked : (l[d.name] || (l[d.name] = []), d.checked && l[d.name].push(d.value));
      else if (d.type === "radio")
        d.checked && (l[d.name] = d.value);
      else if (d.type === "select-multiple") {
        l[d.name] = [];
        for (let f = 0; f < d.options.length; f++)
          d.options[f].selected && l[d.name].push(d.options[f].value);
      } else if (u && d.type === "hidden")
        l[d.name] = d.value;
      else if (u && (d.type === "number" || d.type === "range")) {
        const f = Number(d.value);
        l[d.name] = d.value === "" || isNaN(f) ? null : f;
      } else
        l[d.name] = d.value;
  }
  return l;
}
function xn(e) {
  if (typeof e != "string") return !!e;
  const n = e.trim().toLowerCase();
  return n !== "false" && n !== "0" && n !== "" && n !== "off" && n !== "no";
}
function Pe(e, n) {
  const u = e.elements, m = [], l = {};
  for (let h = 0; h < u.length; h++) {
    const c = u[h];
    c.name && c.type === "checkbox" && (l[c.name] = (l[c.name] || 0) + 1);
  }
  for (let h = 0; h < u.length; h++) {
    const c = u[h];
    if (c.type === "file" || c.type === "submit" || c.type === "button") continue;
    const r = c.getAttribute("data-ln-fill-as") || c.name;
    if (!r || !(r in n)) continue;
    const d = n[r];
    if (c.type === "checkbox") {
      if (Array.isArray(d))
        c.checked = d.indexOf(c.value) !== -1;
      else if (l[c.name] > 1) {
        const f = String(d).split(",").map(function(y) {
          return y.trim();
        });
        c.checked = f.indexOf(c.value) !== -1;
      } else
        c.checked = xn(d);
      m.push(c);
    } else if (c.type === "radio")
      c.checked = c.value === String(d), m.push(c);
    else if (c.type === "select-multiple") {
      if (Array.isArray(d))
        for (let f = 0; f < c.options.length; f++)
          c.options[f].selected = d.indexOf(c.options[f].value) !== -1;
      m.push(c);
    } else
      c.value = d, m.push(c);
  }
  return m;
}
const ye = {
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
function V(e) {
  const n = e ? e.closest("[lang]") : null, u = (n ? n.getAttribute("lang") || n.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!u) return "en-US";
  const m = u.trim().toLowerCase();
  return m.indexOf("-") === -1 && ye[m] ? ye[m] : u;
}
function Kt() {
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
function At(e) {
  return e.hasAttribute("data-ln-value") ? e.getAttribute("data-ln-value") : e.textContent.trim();
}
function He(e, n, { get: u, set: m }) {
  Object.defineProperty(e, "value", {
    get: function() {
      return u ? u.call(this) : n.get.call(this);
    },
    set: function(l) {
      m ? m.call(this, l, (h) => n.set.call(this, h)) : n.set.call(this, l);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function kn() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function Yt() {
  if (typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1), window.lnCore._bootHolds === 0 && window.lnCore._bootQueue)) {
    const e = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let n = 0; n < e.length; n++)
      e[n]();
  }
}
function In() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function ot(e) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(e) : setTimeout(e, 0)) : e();
}
function M(e, n, u, m, l = {}) {
  const h = l.extraAttributes || [], c = l.onAttributeChange || null, r = l.onSubtreeChange || null, d = l.onInit || null;
  function f(p) {
    const _ = p || document.body;
    Xt(_, e, n, u), d && d(_);
  }
  ct(function() {
    const p = new MutationObserver(function(g) {
      for (let i = 0; i < g.length; i++) {
        const s = g[i];
        if (s.type === "childList") {
          if (r && s.target) {
            const o = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", a = s.target.nodeType === 1 ? s.target.matches(o) ? s.target : s.target.closest(o) : s.target.parentElement ? s.target.parentElement.closest(o) : null;
            a && r(a, s);
          }
          for (let t = 0; t < s.addedNodes.length; t++) {
            const o = s.addedNodes[t];
            o.nodeType === 1 && (Xt(o, e, n, u), d && d(o));
          }
          for (let t = 0; t < s.removedNodes.length; t++) {
            const o = s.removedNodes[t];
            if (o.nodeType === 1) {
              const b = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", v = Array.from(o.querySelectorAll(b));
              o.matches && o.matches(b) && v.push(o);
              for (let w = 0; w < v.length; w++) {
                const A = v[w];
                if (!document.contains(A)) {
                  const C = A[n];
                  C && typeof C.destroy == "function" && C.destroy();
                }
              }
            }
          }
        } else s.type === "attributes" && (c && s.target[n] ? c(s.target, s.attributeName) : (Xt(s.target, e, n, u), d && d(s.target)));
      }
    });
    let _ = [];
    if (e.indexOf("[") !== -1) {
      const g = /\[([\w-]+)/g;
      let i;
      for (; (i = g.exec(e)) !== null; )
        _.push(i[1]);
    } else
      _.push(e);
    p.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: _.concat(h)
    });
  }, m || (e.indexOf("[") === -1 ? e.replace("data-", "") : "component")), window[n] = f;
  function y() {
    In() > 0 ? ot(function() {
      f(document.body);
    }) : f(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", y) : y(), f;
}
function Be(e, n) {
  if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || !n) return !1;
  const u = n.getAttribute("href");
  return !(!u || n.getAttribute("target") === "_blank" || n.hasAttribute("download") || u.startsWith("mailto:") || u.startsWith("tel:") || u === "#" || u.startsWith("#") || n.hostname && n.hostname !== window.location.hostname);
}
function dt(...e) {
  return e.filter((n) => n != null && n !== "").map((n, u) => u === 0 ? n.replace(/\/+$/, "") : n.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function Lt(e, n) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, e, n ? { Authorization: n } : null);
}
function Ue(e, n = "ln-core") {
  try {
    return e ? JSON.parse(e) : {};
  } catch (u) {
    return console.error(`[${n}] Invalid headers JSON:`, u), {};
  }
}
const ze = {};
function Dn(e, n) {
  ze[e] = n;
}
function Rn(e) {
  return ze[e] || { ingress: (n) => n, egress: (n) => n };
}
const Ke = {};
function de(e, n) {
  if (!e || typeof n != "object") return;
  const u = e.toLowerCase().split("-")[0];
  Ke[u] = n;
}
function _t(e) {
  if (!e) return null;
  const n = e.toLowerCase().split("-")[0];
  return Ke[n] || null;
}
de("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = Dn, window.lnCore.getDataMapper = Rn, window.lnCore.registerLocaleFallback = de, window.lnCore.getLocaleFallback = _t, window.lnCore.fillTemplate = It, window.lnCore.fill = rt, window.lnCore.lnFill = Sn, window.lnCore.renderList = Cn, window.lnCore.ensureLocaleObserver = Kt);
function ue(e, n) {
  let u = !1;
  return function() {
    u || (u = !0, queueMicrotask(function() {
      u = !1, e();
    }));
  };
}
function je(e) {
  e = e || {};
  let n = e.windowSize > 0 ? e.windowSize : 1e3, u = e.pageSize > 0 ? e.pageSize : 200, m = e.threshold != null ? e.threshold : 25, l = e.fetchDebounce != null ? e.fetchDebounce : 120;
  const h = typeof e.requestPage == "function" ? e.requestPage : function() {
  }, c = typeof e.onChange == "function" ? e.onChange : function() {
  }, r = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Set();
  let y = 0, p = 0, _ = 0, g = { sort: null, filters: {}, search: "" }, i = null, s = 0, t = 0, o = !1;
  function a(A) {
    d.set(A, ++s);
  }
  function b() {
    return !!(g && (g.search || g.filters && Object.keys(g.filters).length));
  }
  function v() {
    if (r.size <= n) return;
    const A = Array.from(r.keys()).sort(function(L, q) {
      return (d.get(L) || 0) - (d.get(q) || 0);
    });
    let C = 0;
    for (; r.size > n && C < A.length; )
      r.delete(A[C]), d.delete(A[C]), C++;
  }
  function w(A, C) {
    f.add(A), h(g, A, C);
  }
  return {
    get: function(A) {
      return r.get(A);
    },
    has: function(A) {
      return r.has(A);
    },
    peek: function() {
      return r.size ? r.values().next().value : void 0;
    },
    get logicalTotal() {
      return y;
    },
    get grandTotal() {
      return p;
    },
    get queryGen() {
      return _;
    },
    get size() {
      return r.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(A, C) {
      clearTimeout(i), t = A;
      for (let N = A; N < C; N++)
        r.has(N) && a(N);
      if (y <= 0) return;
      const L = Math.max(0, A - m), q = Math.min(y, C + m), x = Math.floor(L / u), D = Math.floor(Math.max(0, q - 1) / u);
      let F = -1;
      for (let N = x; N <= D; N++) {
        const H = N * u, Q = Math.min(u, y - H);
        let B = !1;
        const U = Math.max(H, L), z = Math.min(H + Q, q);
        for (let st = U; st < z; st++)
          if (!r.has(st)) {
            B = !0;
            break;
          }
        if (B && !f.has(H)) {
          F = H;
          break;
        }
      }
      F !== -1 && (i = setTimeout(function() {
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
        return f.delete(C), !1;
      o && (r.clear(), d.clear(), o = !1), A.provisional || (p = A.total != null ? A.total : p, y = A.filtered != null ? A.filtered : A.data ? A.data.length : y);
      for (let x = 0; x < L.length; x++)
        L[x] != null && (r.set(C + x, L[x]), a(C + x));
      return f.delete(C), v(), c(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(A) {
      A && (g = A), w(0, u);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(A) {
      _++, f.clear(), clearTimeout(i), A && (g = A), o = !0, w(0, u);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      _++, f.clear(), clearTimeout(i), o = !0;
      const A = Math.max(0, Math.floor(t / u) * u);
      w(A, u);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(A) {
      f.delete(A);
    },
    destroy: function() {
      clearTimeout(i), r.clear(), d.clear(), f.clear();
    },
    configure: function(A) {
      A = A || {};
      let C = !1;
      if (A.windowSize != null && A.windowSize > 0 && A.windowSize !== n) {
        const L = A.windowSize < n;
        n = A.windowSize, L && v(), C = !0;
      }
      A.pageSize != null && A.pageSize > 0 && (u = A.pageSize), A.threshold != null && A.threshold >= 0 && (m = A.threshold), A.fetchDebounce != null && A.fetchDebounce >= 0 && (l = A.fetchDebounce), C && c();
    },
    setGrandTotal: function(A) {
      A == null || isNaN(A) || A < 0 || (p = A, b() || (y = A), c());
    }
  };
}
const On = "ln:";
let vt = null;
function Ve() {
  if (vt !== null) return vt;
  try {
    if (typeof localStorage > "u")
      return vt = !1, !1;
    const e = "__ln_test__";
    localStorage.setItem(e, e), localStorage.removeItem(e), vt = !0;
  } catch {
    vt = !1;
  }
  return vt;
}
function Mn() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function We(e, n) {
  const u = n.getAttribute("data-ln-persist"), m = u !== null && u !== "" ? u : n.id;
  return m ? On + e + ":" + Mn() + ":" + m : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', n), null);
}
function jt(e, n) {
  if (!Ve()) return null;
  const u = We(e, n);
  if (!u) return null;
  try {
    const m = localStorage.getItem(u);
    return m !== null ? JSON.parse(m) : null;
  } catch {
    return null;
  }
}
function bt(e, n, u) {
  if (!Ve()) return;
  const m = We(e, n);
  if (m)
    try {
      u == null ? localStorage.removeItem(m) : localStorage.setItem(m, JSON.stringify(u));
    } catch {
    }
}
function Ge(e) {
  return (e || "").replace(/^#/, "");
}
function Vt(e) {
  const n = e === void 0 ? location.hash : e, u = {}, m = Ge(n);
  if (!m) return u;
  const l = m.split("&");
  for (let h = 0; h < l.length; h++) {
    const c = l[h];
    if (!c) continue;
    const r = c.indexOf(":"), d = r > -1 ? c.slice(0, r) : c, f = r > -1 ? c.slice(r + 1) : "";
    if (d)
      try {
        u[d] = decodeURIComponent(f);
      } catch {
        u[d] = f;
      }
  }
  return u;
}
function X(e) {
  if (!e) return null;
  const n = Vt();
  return e in n ? n[e] : null;
}
function et(e, n) {
  if (!e) return;
  const u = Vt();
  n == null ? delete u[e] : u[e] = String(n);
  const l = Object.keys(u).map(function(h) {
    const c = u[h];
    return c === "" ? h : h + ":" + encodeURIComponent(c);
  }).join("&");
  Ge(location.hash) !== l && (location.hash = l);
}
function he(e) {
  return e.button === 1 || e.ctrlKey || e.metaKey || e.shiftKey ? !1 : (e.preventDefault(), !0);
}
function yt(e, n) {
  if (!e || !e.hasAttribute("data-ln-hash")) return null;
  const u = e.getAttribute("data-ln-hash");
  if (u && u.trim() !== "") return u.trim();
  const m = e.getAttribute("data-ln-sort") || e.getAttribute("data-ln-search-for") || e.getAttribute("data-ln-search") || e.getAttribute("data-ln-filter") || e.id;
  return m ? n ? m + "-" + n : m : n || null;
}
function Qe(e, n) {
  return !n || n === "none" || e === null || e === void 0 ? null : String(e) + "." + n;
}
function Zt(e) {
  return !e || typeof e != "string" ? null : e.endsWith(".asc") ? { fieldOrColumn: e.slice(0, -4), direction: "asc" } : e.endsWith(".desc") ? { fieldOrColumn: e.slice(0, -5), direction: "desc" } : null;
}
function $e(e, n) {
  return !e || !Array.isArray(n) || n.length === 0 ? null : e + ":" + n.map(encodeURIComponent).join(",");
}
function te(e) {
  if (!e || typeof e != "string") return null;
  const n = e.indexOf(":");
  if (n === -1) return null;
  const u = e.slice(0, n), m = e.slice(n + 1), l = m ? m.split(",").map(function(h) {
    try {
      return decodeURIComponent(h);
    } catch {
      return h;
    }
  }).filter(Boolean) : [];
  return { key: u, values: l };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Vt, window.lnCore.hashGet = X, window.lnCore.hashSet = et, window.lnCore.hashLinkClick = he, window.lnCore.resolveHashNamespace = yt, window.lnCore.hashSortEncode = Qe, window.lnCore.hashSortDecode = Zt, window.lnCore.hashFilterEncode = $e, window.lnCore.hashFilterDecode = te);
function Ht(e, n, u, m) {
  const l = typeof m == "number" ? m : 4, h = window.innerWidth, c = window.innerHeight, r = n.width, d = n.height, f = (u || "bottom").split("-"), y = f[0], p = f[1] === "start" || f[1] === "end" ? f[1] : "center", _ = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, g = _[y] || _.bottom;
  function i(b) {
    return b === "top" || b === "bottom" ? p === "start" ? e.left : p === "end" ? e.right - r : e.left + (e.width - r) / 2 : p === "start" ? e.top : p === "end" ? e.bottom - d : e.top + (e.height - d) / 2;
  }
  function s(b) {
    let v, w, A = !0;
    return b === "top" ? (v = e.top - l - d, w = i(b), v < 0 && (A = !1)) : b === "bottom" ? (v = e.bottom + l, w = i(b), v + d > c && (A = !1)) : b === "left" ? (v = i(b), w = e.left - l - r, w < 0 && (A = !1)) : (v = i(b), w = e.right + l, w + r > h && (A = !1)), { top: v, left: w, side: b, fits: A };
  }
  let t = null;
  for (let b = 0; b < g.length; b++) {
    const v = s(g[b]);
    if (v.fits) {
      t = v;
      break;
    }
  }
  t || (t = s(g[0]));
  let o = t.top, a = t.left;
  return r >= h ? a = 0 : (a < 0 && (a = 0), a + r > h && (a = h - r)), d >= c ? o = 0 : (o < 0 && (o = 0), o + d > c && (o = c - d)), { top: o, left: a, placement: t.side };
}
function ee(e) {
  if (!e) return { width: 0, height: 0 };
  const n = e.style, u = n.visibility, m = n.display, l = n.position;
  n.visibility = "hidden", n.display = "block", n.position = "fixed";
  const h = e.offsetWidth, c = e.offsetHeight;
  return n.visibility = u, n.display = m, n.position = l, { width: h, height: c };
}
let ft = null;
async function ve(e) {
  if (!e) {
    ft = null;
    return;
  }
  try {
    const n = new TextEncoder(), u = await crypto.subtle.digest("SHA-256", n.encode(e));
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
async function Fn(e, n = ft) {
  const u = n || ft;
  if (!u || e === void 0 || e === null) return e;
  try {
    const m = new TextEncoder(), l = crypto.getRandomValues(new Uint8Array(12)), h = typeof e == "string" ? e : JSON.stringify(e), c = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: l },
      u,
      m.encode(h)
    ), r = btoa(String.fromCharCode(...l)), d = btoa(String.fromCharCode(...new Uint8Array(c)));
    return {
      encrypted: !0,
      iv: r,
      data: d
    };
  } catch (m) {
    return console.error("[ln-core/crypto] Encryption failed:", m), e;
  }
}
async function Nn(e, n = ft) {
  const u = n || ft;
  if (!e || !e.encrypted || !u) return e;
  try {
    const m = new TextDecoder(), l = Uint8Array.from(atob(e.iv), (d) => d.charCodeAt(0)), h = Uint8Array.from(atob(e.data), (d) => d.charCodeAt(0)), c = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: l },
      u,
      h
    ), r = m.decode(c);
    try {
      return JSON.parse(r);
    } catch {
      return r;
    }
  } catch (m) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", m), { ...e, decryptionError: !0 };
  }
}
function Xe(e, n = 100, u = 0) {
  const m = parseFloat(String(e)) || 0, l = parseFloat(String(n)) || 100, h = parseFloat(String(u)) || 0, c = Math.max(h, Math.min(m, l)), r = l - h;
  let d = 0;
  return r > 0 && (d = (c - h) / r * 100), d = Math.max(0, Math.min(100, d)), {
    value: m,
    min: h,
    max: l,
    clampedValue: c,
    percentage: d
  };
}
function Y(e) {
  if (e == null || e === "") return null;
  if (e instanceof Date)
    return isNaN(e.getTime()) ? null : e;
  const n = Number(e);
  if (!isNaN(n) && n > 0) {
    const u = n < 1e11 ? n * 1e3 : n, m = new Date(u);
    return isNaN(m.getTime()) ? null : m;
  }
  if (typeof e == "string") {
    const u = e.trim();
    if (!u) return null;
    const m = new Date(u);
    return isNaN(m.getTime()) ? null : m;
  }
  return null;
}
function Tt(e) {
  if (!e || !(e instanceof Date) || isNaN(e.getTime())) return "";
  const n = e.getFullYear(), u = String(e.getMonth() + 1).padStart(2, "0"), m = String(e.getDate()).padStart(2, "0");
  return n + "-" + u + "-" + m;
}
const at = {};
function Bt(e) {
  const n = e || "default";
  if (!at[n]) {
    const u = new Intl.NumberFormat(e, { useGrouping: !0 }), m = u.formatToParts(1234.5);
    let l = "", h = ".";
    for (let c = 0; c < m.length; c++)
      m[c].type === "group" && (l = m[c].value), m[c].type === "decimal" && (h = m[c].value);
    at[n] = { groupSep: l, decimalSep: h, fmt: u };
  }
  return at[n];
}
function Ye(e, n, u) {
  if (e == null || typeof e != "string") return "";
  let m = e.trim();
  return m === "" ? "" : (m = m.replace(/[$€£¥]/g, ""), n && (m = m.split(n).join("")), m = m.replace(/\s/g, ""), u && u !== "." && (m = m.replace(u, ".")), m = m.replace(/[^\d.-]/g, ""), m);
}
function Dt(e, n) {
  if (typeof e == "number") return isNaN(e) ? NaN : e;
  if (e == null || typeof e != "string") return NaN;
  const u = e.trim();
  if (u === "" || u === "-") return NaN;
  const m = Bt(n), l = Ye(u, m.groupSep, m.decimalSep);
  if (l === "" || l === "-") return NaN;
  const h = parseFloat(l);
  return isNaN(h) ? NaN : h;
}
function tt(e, n, u = {}) {
  if (typeof e != "number" || isNaN(e) || !Number.isFinite(e)) return "";
  const m = n || "default", l = u.maxDecimals != null ? parseInt(u.maxDecimals, 10) : null, h = u.userDecimals != null ? u.userDecimals : null;
  if (l !== null) {
    const c = m + "|max:" + l;
    return at[c] || (at[c] = new Intl.NumberFormat(n, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: l
    })), at[c].format(e);
  }
  if (h !== null && h > 0) {
    const c = m + "|exact:" + h;
    return at[c] || (at[c] = new Intl.NumberFormat(n, {
      useGrouping: !0,
      minimumFractionDigits: h,
      maximumFractionDigits: h
    })), at[c].format(e);
  }
  return Bt(n).fmt.format(e);
}
function ne(e) {
  return String(e || "").trim().toLowerCase();
}
function Je(e) {
  const n = ne(e);
  return n ? n.split(/\s+/).filter(Boolean) : [];
}
function Pn(e) {
  if (e == null) return null;
  const n = String(e).split(",").map((u) => u.trim()).filter(Boolean);
  return n.length ? n : null;
}
function Ze(e, n) {
  if (!n || n.length === 0) return !0;
  if (!e) return !1;
  const u = String(e).toLowerCase();
  for (let m = 0; m < n.length; m++)
    if (u.indexOf(n[m]) === -1) return !1;
  return !0;
}
function Hn(e) {
  return !e || e.length === 0 ? "" : e.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function fe(e, n) {
  if (!n || n.length === 0) return !0;
  if (e == null) return !1;
  const u = String(e).trim().toLowerCase();
  for (let m = 0; m < n.length; m++)
    if (String(n[m]).trim().toLowerCase() === u)
      return !0;
  return !1;
}
function Bn(e) {
  if (typeof e == "string") return e;
  if (e && typeof e == "object") {
    if (typeof e.href == "string") return e.href;
    if (typeof e.url == "string") return e.url;
  }
  return String(e || "");
}
function Un(e, n) {
  return n && n.method ? String(n.method).toUpperCase() : e && typeof e == "object" && e.method ? String(e.method).toUpperCase() : "GET";
}
function zn(e, n) {
  return (n || "GET") + " " + (e || "");
}
function Kn(e) {
  const n = (e || "").toUpperCase();
  return n === "GET" || n === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const e = window.fetch.bind(window), n = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map();
  function m(c, r) {
    r = r || {};
    const d = Bn(c), f = Un(c, r), y = zn(d, f);
    Kn(f) && n.has(y) && (n.get(y).abort(), n.delete(y));
    const p = new AbortController(), _ = r.signal;
    let g = null;
    _ && (_.aborted ? p.abort(_.reason) : (g = function() {
      p.abort(_.reason);
    }, _.addEventListener("abort", g, { once: !0 })));
    const i = Object.assign({}, r, { signal: p.signal });
    return n.set(y, p), e(c, i).finally(function() {
      _ && g && _.removeEventListener("abort", g), n.get(y) === p && n.delete(y);
    });
  }
  m.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = m;
  function l(c) {
    if (!c.detail || !c.detail.url) return;
    const r = c.target, d = (c.detail.method || (c.detail.body ? "POST" : "GET")).toUpperCase(), f = c.detail.key;
    f && u.has(f) && (u.get(f).abort(), u.delete(f));
    const y = new AbortController(), p = c.detail.signal;
    let _ = null;
    p && (p.aborted ? y.abort(p.reason) : (_ = function() {
      y.abort(p.reason);
    }, p.addEventListener("abort", _, { once: !0 }))), f && u.set(f, y);
    const g = { method: d, signal: y.signal };
    c.detail.body !== void 0 && (g.body = c.detail.body), window.fetch(c.detail.url, g).then(function(i) {
      p && _ && p.removeEventListener("abort", _), f && u.get(f) === y && u.delete(f), S(r, "ln-http:response", {
        ok: i.ok,
        status: i.status,
        response: i
      });
    }).catch(function(i) {
      p && _ && p.removeEventListener("abort", _), f && u.get(f) === y && u.delete(f), !(i && i.name === "AbortError") && S(r, "ln-http:error", {
        ok: !1,
        status: 0,
        error: i
      });
    });
  }
  function h(c) {
    const r = c.detail || {};
    r.all ? window.lnHttp.cancelAll() : r.key ? window.lnHttp.cancelByKey(r.key) : r.url && window.lnHttp.cancel(r.url);
  }
  document.addEventListener("ln-http:request", l), document.addEventListener("ln-http:cancel", h), window.lnHttp = {
    cancel: function(c) {
      let r = !1;
      return n.forEach(function(d, f) {
        f.endsWith(" " + c) && (d.abort(), n.delete(f), r = !0);
      }), r;
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
      return n.forEach(function(r, d) {
        const f = d.indexOf(" ");
        c.push({ method: d.slice(0, f), url: d.slice(f + 1) });
      }), u.forEach(function(r, d) {
        c.push({ key: d });
      }), c;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", l), document.removeEventListener("ln-http:cancel", h), window.fetch = e, delete window.lnHttp;
    }
  };
})();
(function() {
  const e = "template[data-ln-include]", n = "lnInclude";
  if (window[n] !== void 0) return;
  const u = /* @__PURE__ */ new Map();
  function m(l) {
    if (this.dom = l, this.url = l.getAttribute("data-ln-include"), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    kn(), this._held = !0;
    const h = this, c = this.url;
    let r = u.get(c);
    return r || (r = fetch(c).then(function(d) {
      if (!d.ok)
        throw new Error("HTTP error! status: " + d.status);
      return d.text();
    }).catch(function(d) {
      throw u.delete(c), d;
    }), u.set(c, r)), r.then(function(d) {
      if (h._destroyed) return;
      const f = document.createElement("template");
      f.innerHTML = d, h.dom.content.appendChild(f.content), S(h.dom, "ln-include:loaded", { target: h.dom, url: h.url }), h._held && (h._held = !1, Yt());
    }).catch(function(d) {
      h._destroyed || (console.error("[ln-include] Failed to fetch template from " + h.url + ":", d), S(h.dom, "ln-include:error", { target: h.dom, url: h.url, error: d }), h._held && (h._held = !1, Yt()));
    }), this;
  }
  m.prototype.destroy = function() {
    this.dom[n] && (this._destroyed = !0, this._held && (this._held = !1, Yt()), delete this.dom[n]);
  }, M(e, n, m, "ln-include");
})();
(function() {
  const e = "data-ln-form", n = "lnForm", u = "data-ln-form-action-edit", m = "data-ln-form-action-method";
  if (window[n] !== void 0) return;
  function l(h) {
    this.dom = h, this._baseAction = h.getAttribute("action") || "";
    const c = this;
    return this._onLnFill = function(r) {
      r.target === c.dom && (r.detail ? (c.fill(r.detail), c._applyActionMode(r.detail)) : c.dom.reset());
    }, this._onReset = function() {
      c._applyActionMode(null);
    }, h.addEventListener("ln-fill", this._onLnFill), h.addEventListener("reset", this._onReset), this;
  }
  l.prototype.fill = function(h) {
    const c = Pe(this.dom, h);
    for (let r = 0; r < c.length; r++) {
      const d = c[r], f = d.tagName === "SELECT" || d.type === "checkbox" || d.type === "radio";
      d.dispatchEvent(new Event(f ? "change" : "input", { bubbles: !0 }));
    }
  }, l.prototype._ensureMethodInput = function() {
    let h = this.dom.querySelector('input[name="_method"]');
    return h || (h = document.createElement("input"), h.type = "hidden", h.name = "_method", h.value = "", this.dom.appendChild(h)), h;
  }, l.prototype._applyActionMode = function(h) {
    if (!this.dom.hasAttribute(u)) return;
    const c = h && h.id != null && h.id !== "" ? h.id : null, r = this._ensureMethodInput();
    if (c !== null) {
      const d = this.dom.getAttribute(u);
      d ? this.dom.setAttribute("action", d.replace(":id", encodeURIComponent(c))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(c)), r.value = this.dom.getAttribute(m) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), r.value = "";
  }, l.prototype.destroy = function() {
    this.dom[n] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), S(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[n]);
  }, M(e, n, l, "ln-form");
})();
const we = {
  required: "valueMissing",
  typeMismatch: "typeMismatch",
  tooShort: "tooShort",
  tooLong: "tooLong",
  patternMismatch: "patternMismatch",
  rangeUnderflow: "rangeUnderflow",
  rangeOverflow: "rangeOverflow"
};
function Ee(e, n = 0) {
  return e ? !!(e.valid && n === 0) : n === 0;
}
function jn(e, n) {
  const u = [];
  if (e) {
    const m = Object.keys(we);
    for (let l = 0; l < m.length; l++) {
      const h = m[l], c = we[h];
      e[c] && u.push(h);
    }
  }
  if (n) {
    const m = Array.from(n);
    for (let l = 0; l < m.length; l++)
      m[l] && u.indexOf(m[l]) === -1 && u.push(m[l]);
  }
  return u;
}
(function() {
  const e = "data-ln-validate", n = "lnValidate", u = "data-ln-validate-errors", m = "data-ln-validate-error", l = "ln-validate-valid", h = "ln-validate-invalid";
  if (window[n] !== void 0) return;
  function c(r) {
    this.dom = r, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const d = this, f = r.tagName, y = r.type, p = f === "SELECT" || y === "checkbox" || y === "radio";
    this._onInput = function() {
      d._touched = !0, d.validate();
    }, this._onChange = function() {
      d._touched = !0, d.validate();
    }, this._onSetCustom = function(i) {
      const s = i.detail && i.detail.error;
      if (!s) return;
      d._customErrors.add(s), d._touched = !0;
      const t = r.closest(".form-element");
      if (t) {
        const o = t.querySelector("[" + m + '="' + s + '"]');
        o && o.classList.remove("hidden");
      }
      r.classList.remove(l), r.classList.add(h), r.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(i) {
      const s = i.detail && i.detail.error, t = r.closest(".form-element");
      if (s) {
        if (d._customErrors.delete(s), t) {
          const o = t.querySelector("[" + m + '="' + s + '"]');
          o && o.classList.add("hidden");
        }
      } else
        d._customErrors.forEach(function(o) {
          if (t) {
            const a = t.querySelector("[" + m + '="' + o + '"]');
            a && a.classList.add("hidden");
          }
        }), d._customErrors.clear();
      d._touched && d.validate();
    }, p || r.addEventListener("input", this._onInput), r.addEventListener("change", this._onChange), r.addEventListener("ln-validate:set-custom", this._onSetCustom), r.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const _ = r.form;
    return _ && (_.hasAttribute("novalidate") || _.setAttribute("novalidate", ""), this._onFormReset = function() {
      d.reset();
    }, this._onValidateRequest = function(i) {
      d._touched = !0, !d.validate() && i.detail && i.detail.invalidFields && i.detail.invalidFields.push(d.dom);
    }, _.addEventListener("reset", this._onFormReset), _.addEventListener("ln-validate:request-validate", this._onValidateRequest), _._lnValidateGateBound || (_._lnValidateGateBound = !0, _.addEventListener("submit", function(i) {
      const s = { invalidFields: [] };
      S(_, "ln-validate:request-validate", s), s.invalidFields.length > 0 && (i.preventDefault(), s.invalidFields.sort((t, o) => t.compareDocumentPosition(o) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), s.invalidFields[0].focus());
    }))), (r.value && r.value.trim() !== "" || r.checked) && (this._touched = !0, this.validate()), this;
  }
  c.prototype.validate = function() {
    const r = this.dom, d = r.validity, f = Ee(d, this._customErrors.size), y = jn(d, this._customErrors), p = r.closest(".form-element");
    if (p) {
      const g = p.querySelector("[" + u + "]");
      if (g) {
        const i = g.querySelectorAll("[" + m + "]");
        for (let s = 0; s < i.length; s++) {
          const t = i[s].getAttribute(m);
          i[s].classList.toggle("hidden", !y.includes(t));
        }
      }
    }
    return r.classList.toggle(l, f), r.classList.toggle(h, !f), r.setAttribute("aria-invalid", f ? "false" : "true"), S(r, f ? "ln-validate:valid" : "ln-validate:invalid", { target: r, field: r.name, errors: y }), f;
  }, c.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(l, h), this.dom.removeAttribute("aria-invalid");
    const r = this.dom.closest(".form-element");
    if (r) {
      const d = r.querySelectorAll("[" + m + "]");
      for (let f = 0; f < d.length; f++)
        d[f].classList.add("hidden");
    }
  }, Object.defineProperty(c.prototype, "isValid", {
    get: function() {
      return Ee(this.dom.validity, this._customErrors.size);
    }
  }), c.prototype.destroy = function() {
    if (!this.dom[n]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const r = this.dom.form;
    r && (this._onFormReset && r.removeEventListener("reset", this._onFormReset), this._onValidateRequest && r.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(l, h), this.dom.removeAttribute("aria-invalid"), S(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[n];
  }, M(e, n, c, "ln-validate");
})();
(function() {
  const e = "data-ln-ajax", n = "lnAjax", u = "data-ln-form-scope";
  if (window[n] !== void 0) return;
  function m(p) {
    if (!p.hasAttribute(e) || p[n]) return;
    p[n] = !0;
    const _ = d(p);
    l(_.links), h(_.forms);
  }
  function l(p) {
    for (const _ of p) {
      if (_[n + "Trigger"] || _.hostname && _.hostname !== window.location.hostname) continue;
      const g = _.getAttribute("href");
      if (g && g.includes("#")) continue;
      const i = function(s) {
        if (!Be(s, _)) return;
        s.preventDefault();
        const t = _.getAttribute("href");
        t && r("GET", t, null, _);
      };
      _.addEventListener("click", i), _[n + "Trigger"] = i;
    }
  }
  function h(p) {
    for (const _ of p) {
      if (_[n + "Trigger"]) continue;
      if (_.hasAttribute(u)) {
        _[n + "ScopeWarned"] || (_[n + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const g = function(i) {
        if (i.defaultPrevented) return;
        i.preventDefault();
        const s = _.method.toUpperCase(), t = _.action, o = new FormData(_);
        for (const a of _.querySelectorAll('button, input[type="submit"]'))
          a.disabled = !0;
        r(s, t, o, _, function() {
          for (const a of _.querySelectorAll('button, input[type="submit"]'))
            a.disabled = !1;
        });
      };
      _.addEventListener("submit", g), _[n + "Trigger"] = g;
    }
  }
  function c(p) {
    if (!p[n]) return;
    const _ = d(p);
    for (const g of _.links)
      g[n + "Trigger"] && (g.removeEventListener("click", g[n + "Trigger"]), delete g[n + "Trigger"]);
    for (const g of _.forms)
      g[n + "Trigger"] && (g.removeEventListener("submit", g[n + "Trigger"]), delete g[n + "Trigger"]);
    delete p[n];
  }
  function r(p, _, g, i, s) {
    if (W(i, "ln-ajax:before-start", { method: p, url: _ }).defaultPrevented) return;
    S(i, "ln-ajax:start", { method: p, url: _ }), i.classList.add("ln-ajax--loading");
    const o = document.createElement("span");
    o.className = "ln-ajax-spinner", i.appendChild(o);
    function a() {
      i.classList.remove("ln-ajax--loading");
      const C = i.querySelector(".ln-ajax-spinner");
      C && C.remove(), s && s();
    }
    let b = _;
    const v = document.querySelector('meta[name="csrf-token"]'), w = v ? v.getAttribute("content") : null;
    g instanceof FormData && w && g.append("_token", w);
    const A = {
      method: p,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (w && (A.headers["X-CSRF-TOKEN"] = w), p === "GET" && g) {
      const C = new URLSearchParams(g);
      b = _ + (_.includes("?") ? "&" : "?") + C.toString();
    } else p !== "GET" && g && (A.body = g);
    fetch(b, A).then(function(C) {
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
        if (i.tagName === "A") {
          const D = i.getAttribute("href");
          D && window.history.pushState({ ajax: !0 }, "", D);
        } else i.tagName === "FORM" && i.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", b);
        S(i, "ln-ajax:success", { method: p, url: b, data: q });
      } else
        S(i, "ln-ajax:error", {
          method: p,
          url: b,
          status: L,
          data: q,
          error: x || null
        });
      S(i, "ln-ajax:complete", { method: p, url: b }), a();
    }).catch(function(C) {
      S(i, "ln-ajax:error", { method: p, url: b, status: 0, data: null, error: C }), S(i, "ln-ajax:complete", { method: p, url: b }), a();
    });
  }
  function d(p) {
    const _ = { links: [], forms: [] };
    return p.tagName === "A" && p.getAttribute(e) !== "false" ? _.links.push(p) : p.tagName === "FORM" && p.getAttribute(e) !== "false" ? _.forms.push(p) : (_.links = Array.from(p.querySelectorAll('a:not([data-ln-ajax="false"])')), _.forms = Array.from(p.querySelectorAll('form:not([data-ln-ajax="false"])'))), _;
  }
  function f() {
    ct(function() {
      new MutationObserver(function(_) {
        for (const g of _)
          if (g.type === "childList") {
            for (const i of g.addedNodes)
              if (i.nodeType === 1 && (m(i), !i.hasAttribute(e))) {
                for (const t of i.querySelectorAll("[" + e + "]"))
                  m(t);
                const s = i.closest && i.closest("[" + e + "]");
                if (s && s.getAttribute(e) !== "false") {
                  const t = d(i);
                  l(t.links), h(t.forms);
                }
              }
          } else g.type === "attributes" && m(g.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [e]
      });
    }, "ln-ajax");
  }
  function y() {
    for (const p of document.querySelectorAll("[" + e + "]"))
      m(p);
  }
  window[n] = m, window[n].destroy = c, f(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", y) : y();
})();
const tn = {
  navigate: function(e) {
    kt(e, { historyAction: "push" });
  },
  replace: function(e) {
    kt(e, { historyAction: "replace" });
  },
  current: function() {
    return re ? {
      path: ie,
      params: rn,
      query: on,
      route: re,
      regions: nn
    } : null;
  }
}, pe = "data-ln-route", en = "lnRoute";
typeof window < "u" && (window.lnRouter = tn);
const lt = /* @__PURE__ */ new Map(), Ae = /* @__PURE__ */ new WeakMap();
let nn = /* @__PURE__ */ new Map(), Se = !1, ie = null, rn = {}, on = {}, re = null, oe = !1;
function Ce(e, n, u) {
  oe ? queueMicrotask(function() {
    S(e, n, u);
  }) : S(e, n, u);
}
function Ut(e) {
  try {
    const h = new URL(e, window.location.origin);
    e = h.pathname + h.search + h.hash;
  } catch {
  }
  let [n] = e.split("#"), [u, m] = n.split("?");
  const l = {};
  if (m) {
    const h = new URLSearchParams(m);
    for (const [c, r] of h.entries())
      l[c] = r;
  }
  return u = u.replace(/\/+$/, ""), u === "" && (u = "/"), { path: u, query: l };
}
function sn(e, n) {
  if (e.pattern === "*") return 1;
  if (n.pattern === "*") return -1;
  const u = e.segments, m = n.segments, l = Math.max(u.length, m.length);
  for (let h = 0; h < l; h++) {
    const c = u[h], r = m[h];
    if (c === void 0) return 1;
    if (r === void 0) return -1;
    if (c === "*") return 1;
    if (r === "*") return -1;
    const d = c.startsWith(":"), f = r.startsWith(":");
    if (d && !f) return 1;
    if (!d && f) return -1;
  }
  return 0;
}
function an(e, n) {
  const u = e.split("/").filter(Boolean);
  for (const m of n) {
    if (m.pattern === "*")
      return {
        route: m,
        params: { wildcard: e }
      };
    const l = m.segments, h = {};
    let c = !0;
    if (!(u.length > l.length && l[l.length - 1] !== "*")) {
      for (let r = 0; r < l.length; r++) {
        const d = l[r], f = u[r];
        if (d === "*") {
          h.wildcard = u.slice(r).join("/");
          break;
        }
        if (f === void 0) {
          c = !1;
          break;
        }
        if (d.startsWith(":"))
          h[d.slice(1)] = decodeURIComponent(f);
        else if (d !== f) {
          c = !1;
          break;
        }
      }
      if (c && (l.indexOf("*") !== -1 || u.length <= l.length))
        return { route: m, params: h };
    }
  }
  return null;
}
function se(e, n) {
  if (e !== "__primary__") {
    const m = document.getElementById(n.target);
    return m || console.warn(`[ln-router] Explicit target element #${n.target} not found in DOM`), m;
  }
  const u = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return u || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), u;
}
function Vn(e) {
  if (!e) return;
  const n = Array.from(e.querySelectorAll("*")), u = [e].concat(n);
  for (const l of u)
    for (const h of Object.keys(l))
      if (h.startsWith("ln") && l[h] && typeof l[h].destroy == "function")
        try {
          l[h].destroy();
        } catch (c) {
          console.error(`[ln-router] Error destroying component ${h} on element:`, l, c);
        }
  const m = document.querySelectorAll('[data-ln-popover="open"]');
  for (const l of m) {
    const h = l.lnPopover;
    if (h && h.trigger && e.contains(h.trigger))
      try {
        h.destroy();
      } catch (c) {
        console.error("[ln-router] Error destroying open popover:", c);
      }
  }
}
function kt(e, n = {}) {
  const { path: u, query: m } = Ut(e), l = /* @__PURE__ */ new Map();
  for (const [y, p] of lt)
    l.set(y, an(u, p.sorted));
  const h = lt.has("__primary__"), c = l.get("__primary__");
  if (h && !c) {
    Ce(document.body, "ln-router:not-found", { path: u });
    return;
  }
  let r = null;
  if (c && (r = se("__primary__", c.route), !r || W(r, "ln-router:before-navigate", {
    from: ie,
    to: e,
    params: c.params,
    query: m
  }).defaultPrevented))
    return;
  const d = [];
  for (const [y, p] of l) {
    if (!p) continue;
    const _ = se(y, p.route);
    _ && (y !== "__primary__" && _.hasAttribute("data-ln-route-keep") && Ae.get(_) === p.route.templateNode || d.push({ regionKey: y, match: p, targetEl: _ }));
  }
  n.historyAction === "push" ? window.history.pushState(null, "", e) : n.historyAction === "replace" && window.history.replaceState(null, "", e);
  const f = function() {
    for (const { regionKey: y, match: p, targetEl: _ } of d) {
      if (!(n.isHydration && _.hasAttribute("data-ln-router-hydrate") && _.children.length > 0)) {
        Vn(_);
        const i = p.route.templateNode.content.cloneNode(!0);
        _.replaceChildren(i);
      }
      if (Ae.set(_, p.route.templateNode), y === "__primary__" && (p.route.title && (document.title = p.route.title), !n.isHydration)) {
        _.hasAttribute("tabindex") || _.setAttribute("tabindex", "-1");
        const i = _.querySelector("h1, h2, h3, h4, h5, h6");
        i ? (i.setAttribute("tabindex", "-1"), i.focus()) : _.focus(), _.scrollIntoView({ block: "start", behavior: "instant" });
      }
      Ce(_, "ln-router:navigated", {
        path: e,
        params: p.params,
        query: m,
        route: p.route,
        target: _,
        region: y
      });
    }
    c && (ie = e, rn = c.params, on = m, re = c.route), nn = new Map(
      Array.from(l.entries()).map(([y, p]) => [y, p ? { route: p.route, params: p.params } : null])
    );
  };
  document.startViewTransition && !n.isHydration ? document.startViewTransition(f) : f();
}
function Wn(e) {
  const n = e.target.closest("a");
  if (!n || !Be(e, n)) return;
  const u = n.getAttribute("href"), { path: m } = Ut(u), l = lt.get("__primary__");
  if (!l) return;
  an(m, l.sorted) && (e.preventDefault(), kt(u, { historyAction: "push" }));
}
function Gn(e, n) {
  const u = Object.keys(e), m = Object.keys(n);
  if (u.length !== m.length) return !1;
  for (let l = 0; l < u.length; l++) {
    const h = u[l];
    if (e[h] !== n[h]) return !1;
  }
  return !0;
}
function Qn() {
  const e = window.location.pathname + window.location.search, n = tn.current();
  if (n && n.path != null) {
    const u = Ut(e);
    if (Ut(n.path).path === u.path && Gn(n.query, u.query))
      return;
  }
  kt(e, { historyAction: "skip" });
}
function $n() {
  Se || (Se = !0, ct(function() {
    document.addEventListener("click", Wn), window.addEventListener("popstate", Qn), oe = !0;
    const e = window.location.pathname + window.location.search + window.location.hash;
    kt(e, { historyAction: "replace", isHydration: !0 }), oe = !1;
  }, "ln-router"));
}
function Xn(e) {
  const n = e.getAttribute(pe);
  if (!n) return;
  const u = e.getAttribute("data-ln-route-target") || null;
  if (u === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${n}" rejected.`);
    return;
  }
  const m = u || "__primary__";
  lt.has(m) || lt.set(m, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const l = lt.get(m);
  if (l.routes.has(n)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${n}" in region "${m}"`);
    return;
  }
  const h = e.getAttribute("data-ln-route-title"), c = n.split("/").filter(Boolean), r = {
    pattern: n,
    segments: c,
    target: u,
    title: h,
    templateNode: e
  }, d = se(m, r);
  d && d.contains(e) && console.warn(`[ln-router] Route template with pattern "${n}" is declared inside its own outlet element:`, e), l.routes.set(n, r), l.sorted = Array.from(l.routes.values()).sort(sn);
}
function Yn(e) {
  const n = e.getAttribute(pe);
  if (!n) return;
  const m = e.getAttribute("data-ln-route-target") || null || "__primary__", l = lt.get(m);
  l && (l.routes.delete(n), l.sorted = Array.from(l.routes.values()).sort(sn), l.routes.size === 0 && lt.delete(m));
}
function ln(e) {
  return this.dom = e, Xn(e), this;
}
ln.prototype.destroy = function() {
  Yn(this.dom), delete this.dom[en];
};
M(pe, en, ln, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    lt.size > 0 && $n();
  }
});
(function() {
  const e = "data-ln-modal", n = "lnModal";
  if (window[n] !== void 0) return;
  function u(l) {
    this.dom = l, this.isOpen = l.getAttribute(e) === "open";
    const h = this;
    return this._onRequestOpen = function() {
      h.dom.setAttribute(e, "open");
    }, this._onRequestClose = function() {
      h.dom.setAttribute(e, "close");
    }, this._onCancel = function(c) {
      c.preventDefault(), h.dom.setAttribute(e, "close");
    }, this._onClickClose = function(c) {
      const r = c.target.closest("[data-ln-modal-close]");
      r && h.dom.contains(r) && (c.preventDefault(), h.dom.setAttribute(e, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  u.prototype.open = function() {
    this.dom.setAttribute(e, "open");
  }, u.prototype.close = function() {
    this.dom.setAttribute(e, "close");
  }, u.prototype.toggle = function() {
    const l = this.dom.getAttribute(e);
    this.dom.setAttribute(e, l === "open" ? "close" : "open");
  }, u.prototype.destroy = function() {
    if (this.dom[n]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const l = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + e + '="open"]'),
          function(c) {
            return c !== l;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      S(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[n];
    }
  };
  function m(l) {
    const h = l[n];
    if (!h) return;
    const r = l.getAttribute(e) === "open";
    if (r !== h.isOpen)
      if (r) {
        if (W(l, "ln-modal:before-open", { modalId: l.id, target: l }).defaultPrevented) {
          l.setAttribute(e, "close");
          return;
        }
        h.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof l.showModal == "function" && l.showModal();
        const f = l.querySelector("[autofocus]");
        if (f && xt(f))
          f.focus();
        else {
          const y = l.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), p = Array.prototype.find.call(y, xt);
          if (p) p.focus();
          else {
            const _ = l.querySelectorAll("a[href], button:not([disabled])"), g = Array.prototype.find.call(_, xt);
            g && g.focus();
          }
        }
        S(l, "ln-modal:open", { modalId: l.id, target: l });
      } else {
        if (W(l, "ln-modal:before-close", { modalId: l.id, target: l }).defaultPrevented) {
          l.setAttribute(e, "open");
          return;
        }
        h.isOpen = !1, S(l, "ln-modal:close", { modalId: l.id, target: l }), typeof l.close == "function" && l.close(), document.querySelector("[" + e + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  M(e, n, u, "ln-modal", {
    onAttributeChange: m
  });
})();
(function() {
  const e = "data-ln-ui-coordinator", n = "lnUiCoordinator", u = "data-ln-ui-coordinator-dict";
  if (window[n] !== void 0) return;
  function m(t) {
    const o = {};
    let a = t;
    const b = [];
    for (; a; ) {
      const v = a.closest("[" + e + "]");
      if (!v) break;
      v[n] && v[n].dict && b.unshift(v[n].dict), a = v.parentElement;
    }
    for (const v of b)
      Object.assign(o, v);
    return o;
  }
  function l(t, o) {
    if (o) {
      if (t) {
        const b = t.closest("[" + e + "]");
        if (b) {
          if (b.id === o && b.hasAttribute("data-ln-modal")) return b;
          const v = b.querySelector("#" + CSS.escape(o) + '[data-ln-modal], [data-ln-modal="' + o + '"]');
          if (v) return v;
        }
      }
      const a = document.getElementById(o) || document.querySelector('[data-ln-modal="' + o + '"]');
      if (a) return a;
    }
    if (t) {
      const a = t.closest("[" + e + "]");
      if (a) {
        if (a.hasAttribute("data-ln-modal")) return a;
        const v = a.querySelector("[data-ln-modal]");
        if (v) return v;
      }
      const b = t.closest("[data-ln-modal]");
      if (b) return b;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function h(t, o) {
    if (t !== "edit") return "";
    if (o) {
      const a = o.getAttribute("data-ln-fill-id");
      if (a) return a;
    }
    return "edit";
  }
  function c(t) {
    if (!t) return;
    const o = t.querySelectorAll("[data-ln-field]");
    for (let b = 0; b < o.length; b++)
      o[b].textContent = "";
    const a = t.querySelectorAll("form");
    for (let b = 0; b < a.length; b++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(a[b], null) : a[b].reset();
  }
  document.addEventListener("click", function(t) {
    if (t.ctrlKey || t.metaKey || t.button === 1) return;
    const o = t.target.closest("[data-ln-modal-for]");
    if (o) {
      const b = o.getAttribute("data-ln-modal-for"), v = l(o, b);
      if (v && v.lnModal) {
        t.preventDefault();
        const w = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, A = {}, C = o.dataset;
        for (const x in C) {
          if (!x.startsWith("lnModal") || w[x]) continue;
          const D = x.slice(7);
          D && (A[D.charAt(0).toLowerCase() + D.slice(1)] = C[x]);
        }
        const L = Object.keys(A).length > 0;
        o.hasAttribute("data-ln-modal-mode") ? v.dataset.lnModalMode = o.getAttribute("data-ln-modal-mode") : v.dataset.lnModalMode = L ? "edit" : "new", L && window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(v, A) : v.dataset.lnModalMode === "new" && c(v), v.getAttribute("data-ln-modal") === "open" ? S(v, "ln-modal:request-close", {}) : (v.id && et(v.id, h(v.dataset.lnModalMode, o)), S(v, "ln-modal:request-open", {}));
      }
      return;
    }
    const a = t.target.closest('a[href^="#"]');
    if (a) {
      const b = Vt(a.getAttribute("href"));
      for (const v in b) {
        const w = document.getElementById(v);
        if (w && w.lnModal) {
          if (!he(t)) return;
          et(v, b[v]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(t) {
    const o = t.target;
    if (!o || !o.lnModal) return;
    (o.dataset.lnModalMode || "new") === "new" && c(o);
  }), document.addEventListener("ln-modal:open", function(t) {
    const o = t.target;
    if (!o || !o.lnModal || !o.id) return;
    let a = X(o.id);
    a === null && (a = h(o.dataset.lnModalMode, null), et(o.id, a)), a ? (o.dataset.lnModalMode = "edit", o.dispatchEvent(new CustomEvent("ln-fill:request", {
      bubbles: !0,
      detail: { id: a }
    }))) : (o.dataset.lnModalMode = "new", c(o));
  });
  let r = !1;
  function d() {
    if (!r) {
      r = !0;
      try {
        const t = document.querySelectorAll("[data-ln-modal][id]");
        for (let o = 0; o < t.length; o++) {
          const a = t[o];
          if (!a.lnModal) continue;
          const b = a.id, v = X(b), w = v !== null, A = a.lnModal.isOpen;
          if (w) {
            const C = v ? "edit" : "new";
            a.dataset.lnModalMode = C, A ? v ? a.dispatchEvent(new CustomEvent("ln-fill:request", {
              bubbles: !0,
              detail: { id: v }
            })) : c(a) : S(a, "ln-modal:request-open", {});
          } else A && S(a, "ln-modal:request-close", {});
        }
      } finally {
        r = !1;
      }
    }
  }
  function f() {
    const t = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let o = 0; o < t.length; o++) {
      const a = t[o];
      a.lnModal && X(a.id) === null && et(a.id, h(a.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", d);
  function y() {
    f(), d();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    ot(y);
  }) : ot(y);
  function p(t) {
    const a = (t.detail || {}).data;
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
    const b = t.target.closest("[data-ln-modal]");
    b && b.lnModal && (b.id && et(b.id, null), S(b, "ln-modal:request-close", {}), c(b));
  }
  function _(t) {
    const o = t.detail || {}, a = o.data, b = o.status || 0, v = m(t.target);
    if (a && a.message) {
      const w = a.message;
      window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
        detail: {
          type: w.type || "error",
          title: w.title || "",
          message: w.body || ""
        }
      }));
    } else b === 0 ? window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
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
  document.addEventListener("ln-ajax:success", p), document.addEventListener("ln-ajax:error", _);
  function g(t) {
    const o = t.detail || {}, a = m(t.target), b = o.message || (o.reason === "max-size" ? a["upload-max-size"] || "File is too large" : o.reason === "max-files" ? a["upload-max-files"] || "Maximum file count exceeded" : a["upload-invalid-type"] || "This file type is not allowed"), v = a["upload-invalid-title"] || "Invalid File";
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: v,
        message: b
      }
    }));
  }
  function i(t) {
    const o = t.detail || {}, a = m(t.target), b = o.message || a["upload-failed"] || "Failed to upload file", v = a["upload-error-title"] || "Upload Error";
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: v,
        message: b
      }
    }));
  }
  document.addEventListener("ln-upload:invalid", g), document.addEventListener("ln-upload:error", i), document.addEventListener("ln-modal:close", function(t) {
    const o = t.target;
    !o || !o.lnModal || (o.id && X(o.id) !== null && et(o.id, null), o.dataset.lnModalMode === "new" && c(o));
  });
  function s(t) {
    return this.dom = t, this.dict = zt(t, u), this;
  }
  s.prototype.destroy = function() {
    this.dom[n] && (this.dict = {}, delete this.dom[n]);
  }, M(e, n, s, "ln-ui-coordinator");
})();
function Jn(e, n) {
  if (!e) return 0;
  if (n <= 0)
    return e.startsWith("-") ? 1 : 0;
  let u = n, m = 0;
  for (let l = 0; l < e.length && u > 0; l++)
    m = l + 1, /[0-9]/.test(e[l]) && u--;
  return u > 0 && (m = e.length), m;
}
(function() {
  const e = "data-ln-number", n = "lnNumber";
  if (window[n] !== void 0) return;
  const u = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function m(l) {
    if (l[n]) return l[n];
    l[n] = this, this.dom = l;
    const h = this;
    if (this._onLocaleChange = function() {
      h.isTextElement ? h._formatTextContent() : isNaN(h.value) || h._displayFormatted(h.value);
    }, Kt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), l.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const c = document.createElement("input");
    c.type = "hidden", c.name = l.name, l.removeAttribute("name"), l.hasAttribute("data-ln-fill-as") && c.setAttribute("data-ln-fill-as", l.getAttribute("data-ln-fill-as")), l.type = "text", l.setAttribute("inputmode", "decimal"), l.insertAdjacentElement("afterend", c), this._hidden = c, Object.defineProperty(c, "value", {
      get: function() {
        return u.get.call(c);
      },
      set: function(d) {
        if (u.set.call(c, d), d !== "" && !isNaN(parseFloat(d))) {
          const f = h.dom.getAttribute("data-ln-number-decimals");
          h._setDisplayRaw(tt(parseFloat(d), V(h.dom), { maxDecimals: f }));
        } else
          h._setDisplayRaw("");
        h.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), He(l, u, {
      get: function() {
        return u.get.call(l);
      },
      set: function(d) {
        if (d === "") {
          h._setDisplayRaw(""), h._setHiddenRaw(""), l.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const f = typeof d == "number" ? d : Dt(String(d), V(l));
        if (isNaN(f))
          h._setDisplayRaw(String(d)), h._setHiddenRaw("");
        else {
          h._setHiddenRaw(f);
          const y = l.getAttribute("data-ln-number-decimals");
          h._setDisplayRaw(tt(f, V(l), { maxDecimals: y }));
        }
        l.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      h._handleInput();
    }, l.addEventListener("input", this._onInput), this._onKeyDown = function(d) {
      if (d.key !== "Backspace") return;
      const f = l.selectionStart, y = l.selectionEnd;
      if (f !== y || f === 0) return;
      const p = Bt(V(l)), _ = u.get.call(l), g = _[f - 1];
      if (g === p.groupSep || /\s/.test(g)) {
        d.preventDefault();
        const i = f - 2 >= 0 ? f - 2 : 0, s = _.slice(0, i) + _.slice(f);
        u.set.call(l, s), l.setSelectionRange(i, i), l.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, l.addEventListener("keydown", this._onKeyDown), this._onPaste = function(d) {
      d.preventDefault();
      const f = (d.clipboardData || window.clipboardData).getData("text"), y = Dt(f, V(l));
      h.value = isNaN(y) ? NaN : y;
    }, l.addEventListener("paste", this._onPaste);
    const r = l.value;
    if (r !== "") {
      const d = Dt(r, V(l));
      if (!isNaN(d)) {
        const f = l.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(d), this._setDisplayRaw(tt(d, V(l), { maxDecimals: f })), l.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return this;
  }
  m.prototype._initTextElement = function() {
    const l = this.dom;
    let h = l.getAttribute("data-ln-value"), c = l.getAttribute("data-ln-number"), r = null;
    h !== null && h !== "" ? r = h : c !== null && c !== "" && c !== "true" ? r = c : r = l.textContent.trim();
    const d = Dt(r, V(l));
    isNaN(d) ? this._rawValue = null : (this._rawValue = d, l.hasAttribute("data-ln-value") || l.setAttribute("data-ln-value", String(d)), this._formatTextContent());
  }, m.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const l = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = tt(this._rawValue, V(this.dom), { maxDecimals: l });
    }
  }, m.prototype._handleInput = function() {
    const l = this.dom, h = u.get.call(l);
    if (h === "") {
      this._setHiddenRaw(""), S(l, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (h === "-") {
      this._setHiddenRaw(""), S(l, "ln-number:input", { value: NaN, formatted: "-" });
      return;
    }
    const c = l.selectionStart;
    let r = 0;
    for (let b = 0; b < c; b++)
      /[0-9]/.test(h[b]) && r++;
    const d = V(l), f = Bt(d);
    let y = h, p = Ye(h, f.groupSep, f.decimalSep), _ = parseFloat(p);
    if (isNaN(_)) {
      this._setHiddenRaw(""), S(l, "ln-number:input", { value: NaN, formatted: h });
      return;
    }
    const g = l.getAttribute("data-ln-number-decimals"), i = p.indexOf(".");
    if (g !== null && i !== -1) {
      const b = parseInt(g, 10), v = p.slice(i + 1);
      if (b === 0)
        p = p.slice(0, i), y = y.split(f.decimalSep)[0], _ = parseFloat(p), this._setDisplayRaw(y);
      else if (v.length > b) {
        p = p.slice(0, i + 1 + b);
        const w = y.split(f.decimalSep);
        y = w[0] + f.decimalSep + w[1].slice(0, b), _ = parseFloat(p), this._setDisplayRaw(y);
      }
    }
    const s = l.getAttribute("data-ln-number-max");
    if (s !== null && _ > parseFloat(s)) {
      const b = parseFloat(s), v = tt(b, d, { maxDecimals: g });
      this._setDisplayRaw(v), this._setHiddenRaw(b), l.setSelectionRange(v.length, v.length), S(l, "ln-number:input", { value: b, formatted: v });
      return;
    }
    if (y.endsWith(f.decimalSep) || f.decimalSep !== "." && y.endsWith(".")) {
      this._setHiddenRaw(_), S(l, "ln-number:input", { value: _, formatted: y });
      return;
    }
    const t = p.indexOf(".");
    if (t !== -1 && p.slice(t + 1).endsWith("0")) {
      this._setHiddenRaw(_), S(l, "ln-number:input", { value: _, formatted: y });
      return;
    }
    let o;
    if (g !== null)
      o = tt(_, d, { maxDecimals: g });
    else {
      const b = t !== -1 ? p.slice(t + 1).length : 0;
      o = tt(_, d, { userDecimals: b });
    }
    this._setDisplayRaw(o);
    const a = Jn(o, r);
    l.setSelectionRange(a, a), this._setHiddenRaw(_), S(l, "ln-number:input", { value: _, formatted: o });
  }, m.prototype._setHiddenRaw = function(l) {
    this._hidden && u.set.call(this._hidden, String(l));
  }, m.prototype._setDisplayRaw = function(l) {
    this.isTextElement ? this.dom.textContent = String(l) : u.set.call(this.dom, String(l));
  }, m.prototype._displayFormatted = function(l) {
    if (this.isTextElement)
      this._formatTextContent();
    else {
      const h = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(tt(l, V(this.dom), { maxDecimals: h }));
    }
  }, Object.defineProperty(m.prototype, "value", {
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
      const h = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(tt(l, V(this.dom), { maxDecimals: h })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(m.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : u.get.call(this.dom);
    }
  }), m.prototype.destroy = function() {
    this.dom[n] && (this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), S(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[n]);
  }, M(e, n, m, "ln-number", {
    extraAttributes: [
      "data-ln-value",
      "data-ln-number-decimals",
      "data-ln-number-min",
      "data-ln-number-max",
      "lang"
    ],
    onAttributeChange: function(l) {
      const h = l[n];
      h && (h.isTextElement ? h._initTextElement() : isNaN(h.value) || h._displayFormatted(h.value));
    }
  });
})();
const ae = /^(short|medium|long)(\s+datetime)?$/, Zn = {
  short: { dateStyle: "short" },
  medium: { dateStyle: "medium" },
  long: { dateStyle: "long" },
  "short datetime": { dateStyle: "short", timeStyle: "short" },
  "medium datetime": { dateStyle: "medium", timeStyle: "short" },
  "long datetime": { dateStyle: "long", timeStyle: "short" }
};
function ti(e) {
  return !e || e === "" ? { dateStyle: "medium" } : String(e).trim().match(ae) ? Zn[e.trim()] : null;
}
function Rt(e) {
  if (!e || typeof e != "string") return null;
  const n = e.trim();
  if (n.length < 6) return null;
  let u, m;
  if (n.indexOf(".") !== -1)
    u = ".", m = n.split(".");
  else if (n.indexOf("/") !== -1)
    u = "/", m = n.split("/");
  else if (n.indexOf("-") !== -1)
    u = "-", m = n.split("-");
  else
    return null;
  if (m.length !== 3) return null;
  const l = [];
  for (let f = 0; f < 3; f++) {
    const y = parseInt(m[f], 10);
    if (isNaN(y)) return null;
    l.push(y);
  }
  let h, c, r;
  u === "." ? (h = l[0], c = l[1], r = l[2]) : u === "/" ? (c = l[0], h = l[1], r = l[2]) : m[0].length === 4 ? (r = l[0], c = l[1], h = l[2]) : (h = l[0], c = l[1], r = l[2]), r < 100 && (r += r < 50 ? 2e3 : 1900);
  const d = new Date(r, c - 1, h);
  return d.getFullYear() !== r || d.getMonth() !== c - 1 || d.getDate() !== h ? null : d;
}
function Jt(e, n, u, m) {
  if (!e || !(e instanceof Date) || isNaN(e.getTime()) || !n || typeof n != "string") return "";
  const l = e.getDate(), h = e.getMonth(), c = e.getFullYear(), r = e.getHours(), d = e.getMinutes();
  let f, y;
  const p = (u || "").toLowerCase().split("-")[0];
  let _ = !1;
  try {
    const s = new Intl.DateTimeFormat(u, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    _ = !!(m && s !== p);
  } catch {
    _ = !!m;
  }
  if (_ && m && m.monthsLong)
    f = m.monthsLong[h];
  else
    try {
      f = new Intl.DateTimeFormat(u, { month: "long" }).format(e);
    } catch {
      f = String(h + 1);
    }
  if (_ && m && m.monthsShort)
    y = m.monthsShort[h];
  else
    try {
      y = new Intl.DateTimeFormat(u, { month: "short" }).format(e);
    } catch {
      y = String(h + 1);
    }
  const g = {
    yyyy: String(c),
    yy: String(c).slice(-2),
    MMMM: f,
    MMM: y,
    MM: String(h + 1).padStart(2, "0"),
    M: String(h + 1),
    dd: String(l).padStart(2, "0"),
    d: String(l),
    HH: String(r).padStart(2, "0"),
    mm: String(d).padStart(2, "0")
  };
  return n.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(i) {
    return g[i] !== void 0 ? g[i] : i;
  });
}
function Ot(e, n, u, m) {
  if (!e || !(e instanceof Date) || isNaN(e.getTime())) return "";
  const l = ti(n);
  if (l)
    try {
      const h = new Intl.DateTimeFormat(u, l), c = (u || "").toLowerCase().split("-")[0], r = h.resolvedOptions().locale.toLowerCase().split("-")[0];
      return m && r !== c ? Jt(e, "dd.MM.yyyy", u, m) : h.format(e);
    } catch {
      return Jt(e, "dd.MM.yyyy", u, m);
    }
  return Jt(e, n || "dd.MM.yyyy", u, m);
}
(function() {
  const e = "data-ln-date", n = "lnDate";
  if (window[n] !== void 0) return;
  const u = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function m(r, d, f) {
    S(r.dom, "ln-date:change", {
      value: d,
      formatted: r.dom.value,
      date: f
    }), r.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function l(r, d, f, y) {
    r._setHiddenRaw(d), u.set.call(r._picker, d), r._lastISO = d, y !== void 0 ? (r._isFormatting = !0, r.dom.value = y, r._isFormatting = !1) : f && r._displayFormatted(f), m(r, d, f);
  }
  function h(r) {
    r._setHiddenRaw(""), u.set.call(r._picker, ""), r._isFormatting = !0, r.dom.value = "", r._isFormatting = !1, r._lastISO = "", m(r, "", null);
  }
  function c(r) {
    if (r[n]) return r[n];
    r[n] = this, this.dom = r;
    const d = this;
    if (this._onLocaleChange = function() {
      if (d.isTextElement)
        d._formatTextContent();
      else if (d.value) {
        const t = Y(d.value);
        t && d._displayFormatted(t);
      }
    }, Kt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), r.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const f = r.value, y = r.name, p = r.closest(".form-element, form") || r.parentNode;
    if (p) {
      const t = p.querySelectorAll("[data-ln-date-dict]");
      for (let o = 0; o < t.length; o++) {
        const a = t[o].getAttribute("data-ln-date-dict");
        if (a) {
          const b = zt(t[o], "data-ln-date-dict-key");
          b["months-long"] && (b.monthsLong = b["months-long"].split(",").map((v) => v.trim())), b["months-short"] && (b.monthsShort = b["months-short"].split(",").map((v) => v.trim())), de(a, b);
        }
      }
    }
    const _ = document.createElement("span");
    _.setAttribute("data-ln-date-field", ""), r.parentNode.insertBefore(_, r), _.appendChild(r), this._wrapper = _;
    const g = document.createElement("input");
    g.type = "hidden", g.name = y, r.removeAttribute("name"), r.hasAttribute("data-ln-fill-as") && g.setAttribute("data-ln-fill-as", r.getAttribute("data-ln-fill-as")), r.insertAdjacentElement("afterend", g), this._hidden = g;
    const i = document.createElement("input");
    i.type = "date", i.tabIndex = -1, i.setAttribute("tabindex", "-1"), i.setAttribute("aria-hidden", "true"), i.setAttribute("aria-label", r.getAttribute("data-ln-date-label") || "Date picker"), i.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", g.insertAdjacentElement("afterend", i), this._picker = i, r.type = "text";
    const s = document.createElement("button");
    if (s.type = "button", s.setAttribute("aria-label", r.getAttribute("data-ln-date-label") || "Open date picker"), s.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', i.insertAdjacentElement("afterend", s), this._btn = s, this._lastISO = "", Object.defineProperty(g, "value", {
      get: function() {
        return u.get.call(g);
      },
      set: function(t) {
        if (u.set.call(g, t), t && t !== "") {
          const o = Y(t);
          o && l(d, t, o);
        } else t === "" && h(d);
      }
    }), He(r, u, {
      get: function() {
        return u.get.call(r);
      },
      set: function(t, o) {
        if (d._isFormatting) {
          o(t);
          return;
        }
        if (!t || t === "") {
          o(""), h(d);
          return;
        }
        const a = Y(t) || Rt(t);
        if (a) {
          const b = Tt(a), v = r.getAttribute(e) || "", w = V(r), A = _t(w), C = Ot(a, v, w, A);
          o(C), l(d, b, a, C);
        } else
          o(String(t)), h(d);
      }
    }), this._onPickerChange = function() {
      const t = i.value;
      if (t) {
        const o = Y(t);
        o && l(d, t, o);
      } else
        h(d);
    }, i.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const t = d.dom.value.trim();
      if (t === "") {
        d._lastISO !== "" && h(d);
        return;
      }
      if (d._lastISO) {
        const a = Y(d._lastISO);
        if (a) {
          const b = d.dom.getAttribute(e) || "", v = V(d.dom), w = _t(v);
          if (t === Ot(a, b, v, w)) return;
        }
      }
      const o = Rt(t);
      if (o) {
        const a = Tt(o);
        l(d, a, o);
      } else if (d._lastISO) {
        const a = Y(d._lastISO);
        a && d._displayFormatted(a);
      } else
        d.dom.value = "";
    }, r.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      d._openPicker();
    }, s.addEventListener("click", this._onBtnClick), f && f !== "") {
      const t = Y(f);
      t && l(d, f, t);
    }
    return this;
  }
  c.prototype._initTextElement = function() {
    const r = this.dom, d = r.getAttribute("data-ln-value"), f = r.getAttribute("data-ln-date"), y = r.getAttribute("datetime");
    let p = null;
    d !== null && d !== "" ? p = d : y !== null && y !== "" ? p = y : f !== null && f !== "" && f !== "true" && !ae.test(f) ? p = f : p = r.textContent.trim();
    const _ = Y(p) || Rt(p);
    if (_ && !isNaN(_.getTime())) {
      const g = Tt(_);
      this._rawValue = g, r.hasAttribute("data-ln-value") || r.setAttribute("data-ln-value", g), this._formatTextContent();
    } else
      this._rawValue = null;
  }, c.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const r = Y(this._rawValue);
      if (r) {
        let f = this.dom.getAttribute("data-ln-date-format");
        if (!f) {
          const _ = this.dom.getAttribute("data-ln-date");
          _ && ae.test(_) && (f = _);
        }
        const y = V(this.dom), p = _t(y);
        this.dom.textContent = Ot(r, f || "medium", y, p);
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
  }, c.prototype._setHiddenRaw = function(r) {
    u.set.call(this._hidden, r);
  }, c.prototype._displayFormatted = function(r) {
    const d = this.dom.getAttribute(e) || "", f = V(this.dom), y = _t(f);
    this._isFormatting = !0, this.dom.value = Ot(r, d, f, y), this._isFormatting = !1;
  }, Object.defineProperty(c.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : u.get.call(this._hidden);
    },
    set: function(r) {
      if (this.isTextElement) {
        if (!r || r === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const f = Y(r) || Rt(r);
        if (!f) return;
        const y = Tt(f);
        this._rawValue = y, this.dom.setAttribute("data-ln-value", y), this._formatTextContent();
        return;
      }
      if (!r || r === "") {
        h(this);
        return;
      }
      const d = Y(r);
      d && l(this, r, d);
    }
  }), Object.defineProperty(c.prototype, "date", {
    get: function() {
      const r = this.value;
      return r ? Y(r) : null;
    },
    set: function(r) {
      if (!r || !(r instanceof Date) || isNaN(r.getTime())) {
        this.value = "";
        return;
      }
      this.value = Tt(r);
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
    const r = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", r && (this.dom.value = r), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), S(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[n];
  }, M(e, n, c, "ln-date", {
    extraAttributes: ["data-ln-date-format", "data-ln-date-locale", "data-ln-value", "datetime", "lang"],
    onAttributeChange: function(r) {
      const d = r[n];
      if (d) {
        if (d.isTextElement)
          d._initTextElement();
        else if (d.value) {
          const f = Y(d.value);
          f && d._displayFormatted(f);
        }
      }
    }
  });
})();
(function() {
  const e = "data-ln-nav", n = "lnNav";
  if (window[n] !== void 0) return;
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const h = history.pushState;
    history.pushState = function() {
      h.apply(history, arguments);
      for (const r of history._lnNavCallbacks)
        r();
    };
    const c = history.replaceState;
    history.replaceState = function() {
      c.apply(history, arguments);
      for (const r of history._lnNavCallbacks)
        r();
    }, history._lnNavPatched = !0;
  }
  function u(h) {
    return this.dom = h, this.activeClass = h.getAttribute(e) || "active", this.exact = h.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(h, { childList: !0, subtree: !0 }), this.update(), this;
  }
  u.prototype.update = function() {
    if (!this.activeClass || W(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const c = Array.from(this.dom.querySelectorAll("a")), r = window.location.pathname, d = m(r), f = [];
    for (const y of c) {
      const p = y.getAttribute("href");
      if (!p || p === "#" || p.startsWith("#") || p.startsWith("javascript:") || p.startsWith("mailto:") || p.startsWith("tel:")) {
        y.classList.remove(this.activeClass), y.removeAttribute("aria-current");
        continue;
      }
      if (y.hostname && y.hostname !== window.location.hostname) {
        y.classList.remove(this.activeClass), y.removeAttribute("aria-current");
        continue;
      }
      const _ = m(p), g = _ === d, i = !this.exact && _ !== "/" && d.startsWith(_ + "/");
      g || i ? (y.classList.add(this.activeClass), y.setAttribute("aria-current", "page"), f.push(y)) : (y.classList.remove(this.activeClass), y.removeAttribute("aria-current"));
    }
    S(this.dom, "ln-nav:update", { target: this.dom, activeLinks: f });
  }, u.prototype.destroy = function() {
    if (!this.dom[n]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const h = history._lnNavCallbacks.indexOf(this.updateHandler);
    h !== -1 && history._lnNavCallbacks.splice(h, 1), S(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[n];
  };
  function m(h) {
    try {
      return new URL(h, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return h.replace(/\/$/, "") || "/";
    }
  }
  function l(h, c) {
    const r = h[n];
    if (r) {
      if (c === e) {
        if (!h.hasAttribute(e)) {
          r.destroy();
          return;
        }
        const d = r.activeClass, f = h.getAttribute(e) || "active";
        if (d !== f) {
          const y = h.querySelectorAll("a");
          for (const p of y)
            d && p.classList.remove(d);
          r.activeClass = f;
        }
      } else c === "data-ln-nav-exact" && (r.exact = h.hasAttribute("data-ln-nav-exact"));
      r.update();
    }
  }
  M(e, n, u, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: l
  });
})();
function Le(e, n, u, m) {
  const l = (e || "").toLowerCase().trim();
  if (l) return l;
  if ((n || "").toUpperCase() !== "A") return "";
  const h = u || "";
  if (!h.startsWith("#")) return "";
  const c = h.slice(1);
  if (!c) return "";
  const r = c.split("&"), d = (m || "").toLowerCase().trim();
  if (d)
    for (const p of r) {
      const _ = p.indexOf(":");
      if (_ > 0 && p.slice(0, _).toLowerCase().trim() === d)
        return p.slice(_ + 1).toLowerCase().trim();
    }
  const f = r[r.length - 1] || "", y = f.indexOf(":");
  return (y > 0 ? f.slice(y + 1) : f).toLowerCase().trim();
}
function ei(e, n) {
  if (!Array.isArray(e) || e.length === 0)
    return { hashEnabled: !1, warning: null };
  const u = e.filter(
    (h) => (h.tagName || "").toUpperCase() === "A" && (h.href || "").startsWith("#")
  ), m = u.length > 0 && u.length === e.length, l = (n || "").toLowerCase().trim();
  return u.length > 0 && u.length !== e.length ? { hashEnabled: !1, warning: "mixed" } : m && !l ? { hashEnabled: !1, warning: "missing-namespace" } : {
    hashEnabled: m && !!l,
    warning: null
  };
}
function ni(e, n, u) {
  const m = (e || "").toLowerCase().trim();
  return m && Array.isArray(n) && n.includes(m) ? m : (u || "").toLowerCase().trim();
}
(function() {
  const e = "data-ln-tabs", n = "lnTabs";
  if (window[n] !== void 0 && window[n] !== null) return;
  function u(l) {
    return this.dom = l, this.activeKey = null, m.call(this), this;
  }
  function m() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const l = this.tabs.map((r) => ({
      tagName: r.tagName,
      href: r.getAttribute("href")
    }));
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim();
    const h = ei(l, this.nsKey);
    this.hashEnabled = h.hashEnabled, h.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : h.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const r of this.tabs) {
      const d = Le(r.getAttribute("data-ln-tab"), r.tagName, r.getAttribute("href"), this.nsKey);
      d ? this.mapTabs[d] = r : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', r);
    }
    for (const r of this.panels) {
      const d = (r.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      d && (this.mapPanels[d] = r);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const c = this;
    this._clickHandlers = [];
    for (const r of this.tabs) {
      if (r[n + "Trigger"]) continue;
      const d = function(f) {
        const y = r.tagName === "A";
        if (!y && (f.ctrlKey || f.metaKey || f.button === 1)) return;
        const p = Le(r.getAttribute("data-ln-tab"), r.tagName, r.getAttribute("href"), c.nsKey);
        p && (y && !he(f) || (c.hashEnabled ? X(c.nsKey) === p ? c.dom.setAttribute("data-ln-tabs-active", p) : et(c.nsKey, p) : c.dom.setAttribute("data-ln-tabs-active", p)));
      };
      r.addEventListener("click", d), r[n + "Trigger"] = d, c._clickHandlers.push({ el: r, handler: d });
    }
    if (this._onRequestSelect = function(r) {
      const d = r.detail && (r.detail.key || r.detail.tab);
      d && c.select(d);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!c.hashEnabled) return;
      const r = X(c.nsKey);
      c.dom.setAttribute("data-ln-tabs-active", r !== null ? r : c.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let r = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const d = jt("tabs", this.dom);
        d !== null && d in this.mapPanels && (r = d);
      }
      this.dom.setAttribute("data-ln-tabs-active", r);
    }
  }
  u.prototype.select = function(l) {
    const h = (l + "").toLowerCase().trim();
    h && (this.hashEnabled ? X(this.nsKey) === h ? this.dom.setAttribute("data-ln-tabs-active", h) : et(this.nsKey, h) : this.dom.setAttribute("data-ln-tabs-active", h));
  }, u.prototype._applyActive = function(l) {
    var c;
    if (l = ni(l, Object.keys(this.mapPanels), this.defaultKey), l === this.activeKey) return;
    const h = this.activeKey;
    if (h !== null && W(this.dom, "ln-tabs:before-change", {
      key: l,
      previousKey: h,
      tab: this.mapTabs[l],
      panel: this.mapPanels[l],
      target: this.dom
    }).defaultPrevented) {
      h in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", h), this.hashEnabled && X(this.nsKey) !== h && et(this.nsKey, h));
      return;
    }
    this.activeKey = l;
    for (const r in this.mapTabs) {
      const d = this.mapTabs[r];
      r === l ? (d.setAttribute("data-active", ""), d.setAttribute("aria-selected", "true")) : (d.removeAttribute("data-active"), d.setAttribute("aria-selected", "false"));
    }
    for (const r in this.mapPanels) {
      const d = this.mapPanels[r], f = r === l;
      d.classList.toggle("hidden", !f), d.setAttribute("aria-hidden", f ? "false" : "true");
    }
    if (this.autoFocus) {
      const r = (c = this.mapPanels[l]) == null ? void 0 : c.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      r && setTimeout(() => r.focus({ preventScroll: !0 }), 0);
    }
    S(this.dom, "ln-tabs:change", {
      key: l,
      previousKey: h,
      tab: this.mapTabs[l],
      panel: this.mapPanels[l],
      target: this.dom
    }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && bt("tabs", this.dom, l);
  }, u.prototype.destroy = function() {
    if (this.dom[n]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: l, handler: h } of this._clickHandlers)
        l.removeEventListener("click", h), delete l[n + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), S(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[n];
    }
  }, M(e, n, u, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(l) {
      const h = l.getAttribute("data-ln-tabs-active");
      l[n]._applyActive(h);
    }
  });
})();
(function() {
  const e = "data-ln-toggle", n = "lnToggle", u = "data-ln-toggle-for", m = "data-ln-toggle-action", l = "data-ln-persist";
  if (window[n] !== void 0) return;
  const h = /* @__PURE__ */ new Set();
  let c = null;
  function r(g, i) {
    return i === "open" ? "open" : i === "close" || g === "open" ? "close" : "open";
  }
  function d() {
    c || (c = function(g) {
      if (Me(g)) return;
      const i = g.target.closest("[" + u + "]");
      if (!i || Fe(i)) return;
      const s = i.getAttribute(u);
      if (!s) return;
      const t = document.getElementById(s);
      if (!t || !t[n]) return;
      g.preventDefault();
      const o = i.getAttribute(m) || "toggle", a = t.getAttribute(e);
      t.setAttribute(e, r(a, o));
    }, document.addEventListener("click", c));
  }
  function f() {
    h.size > 0 || !c || (document.removeEventListener("click", c), c = null);
  }
  function y(g, i) {
    if (!g || !g.id) return;
    const s = document.querySelectorAll(
      "[" + u + '="' + g.id + '"]'
    );
    for (let t = 0; t < s.length; t++)
      s[t].setAttribute("aria-expanded", i ? "true" : "false");
  }
  function p(g) {
    this.dom = g;
    const i = this;
    if (this._onRequestOpen = function() {
      i.open();
    }, this._onRequestClose = function() {
      i.close();
    }, this._onRequestToggle = function() {
      i.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), g.hasAttribute(l)) {
      const s = jt("toggle", g);
      s !== null && g.setAttribute(e, s === "open" ? "open" : "close");
    }
    return this.isOpen = g.getAttribute(e) === "open", this.isOpen && g.classList.add("open"), y(g, this.isOpen), h.add(this), d(), this;
  }
  p.prototype.open = function() {
    this.dom.setAttribute(e, "open");
  }, p.prototype.close = function() {
    this.dom.setAttribute(e, "close");
  }, p.prototype.toggle = function() {
    const g = this.dom.getAttribute(e);
    this.dom.setAttribute(e, r(g, "toggle"));
  }, p.prototype.destroy = function() {
    this.dom[n] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), h.delete(this), delete this.dom[n], f(), S(this.dom, "ln-toggle:destroyed", { target: this.dom }));
  };
  function _(g) {
    const i = g[n];
    if (!i) return;
    const t = g.getAttribute(e) === "open";
    if (t !== i.isOpen)
      if (t) {
        if (W(g, "ln-toggle:before-open", { target: g }).defaultPrevented) {
          g.setAttribute(e, "close");
          return;
        }
        i.isOpen = !0, g.classList.add("open"), y(g, !0), S(g, "ln-toggle:open", { target: g }), g.hasAttribute(l) && bt("toggle", g, "open");
      } else {
        if (W(g, "ln-toggle:before-close", { target: g }).defaultPrevented) {
          g.setAttribute(e, "open");
          return;
        }
        i.isOpen = !1, g.classList.remove("open"), y(g, !1), S(g, "ln-toggle:close", { target: g }), g.hasAttribute(l) && bt("toggle", g, "close");
      }
  }
  M(e, n, p, "ln-toggle", {
    onAttributeChange: _
  });
})();
(function() {
  const e = "data-ln-accordion", n = "lnAccordion";
  if (window[n] !== void 0) return;
  function u(m) {
    return this.dom = m, this._onToggleOpen = function(l) {
      if (l.detail.target.closest("[data-ln-accordion]") !== m) return;
      const h = m.querySelectorAll("[data-ln-toggle]");
      for (const c of h)
        c !== l.detail.target && c.closest("[data-ln-accordion]") === m && c.getAttribute("data-ln-toggle") === "open" && c.setAttribute("data-ln-toggle", "close");
      S(m, "ln-accordion:change", { target: l.detail.target });
    }, m.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  u.prototype.destroy = function() {
    this.dom[n] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), S(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[n]);
  }, M(e, n, u, "ln-accordion");
})();
(function() {
  const e = "data-ln-dropdown", n = "lnDropdown", u = "data-ln-dropdown-position", m = "data-ln-dropdown-placement", l = "bottom-end";
  if (window[n] !== void 0) return;
  function h(c) {
    this.dom = c, this.toggleEl = c.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = c.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const r = this;
    return this._onRequestOpen = function() {
      r.toggleEl && r.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      r.toggleEl && r.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (r.toggleEl) {
        const d = r.toggleEl.getAttribute("data-ln-toggle");
        r.toggleEl.setAttribute("data-ln-toggle", d === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(d) {
      const f = r.toggleEl && r.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (d.key === "Escape") {
        f && (d.preventDefault(), d.stopPropagation(), r.toggleEl.setAttribute("data-ln-toggle", "close"), r.triggerBtn && r.triggerBtn.focus());
        return;
      }
      if (d.key === "Tab") {
        f && (r.triggerBtn && r.triggerBtn.focus(), r.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const y = r._getMenuItems();
      if (y.length === 0) return;
      if (!f && (d.key === "ArrowDown" || d.key === "ArrowUp")) {
        d.preventDefault(), r.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const _ = r._getMenuItems();
          _.length > 0 && r._focusItem(_, d.key === "ArrowDown" ? 0 : _.length - 1);
        }, 0);
        return;
      }
      if (!f) return;
      const p = y.indexOf(document.activeElement);
      if (d.key === "ArrowDown") {
        d.preventDefault();
        const _ = p < y.length - 1 ? p + 1 : 0;
        r._focusItem(y, _);
      } else if (d.key === "ArrowUp") {
        d.preventDefault();
        const _ = p > 0 ? p - 1 : y.length - 1;
        r._focusItem(y, _);
      } else d.key === "Home" ? (d.preventDefault(), r._focusItem(y, 0)) : d.key === "End" && (d.preventDefault(), r._focusItem(y, y.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(d) {
      !d.detail || d.detail.target !== r.toggleEl || (r.triggerBtn && r.triggerBtn.setAttribute("aria-expanded", "true"), typeof r.toggleEl.showPopover == "function" && r.toggleEl.showPopover(), r._initMenuAria(), r._reposition(), r._addOutsideClickListener(), r._addScrollRepositionListener(), r._addResizeCloseListener(), S(c, "ln-dropdown:open", { target: d.detail.target }));
    }, this._onToggleClose = function(d) {
      !d.detail || d.detail.target !== r.toggleEl || (r.triggerBtn && r.triggerBtn.setAttribute("aria-expanded", "false"), r._removeOutsideClickListener(), r._removeScrollRepositionListener(), r._removeResizeCloseListener(), r.toggleEl.style.top = "", r.toggleEl.style.left = "", r.toggleEl.removeAttribute(m), typeof r.toggleEl.hidePopover == "function" && r.toggleEl.matches(":popover-open") && r.toggleEl.hidePopover(), S(c, "ln-dropdown:close", { target: d.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  h.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const c = this.toggleEl.querySelectorAll("li");
    for (const d of c)
      d.setAttribute("role", "none");
    const r = this._getMenuItems();
    for (let d = 0; d < r.length; d++)
      r[d].setAttribute("role", "menuitem"), r[d].setAttribute("tabindex", d === 0 ? "0" : "-1");
  }, h.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, h.prototype._focusItem = function(c, r) {
    for (let d = 0; d < c.length; d++)
      c[d].setAttribute("tabindex", d === r ? "0" : "-1");
    c[r] && c[r].focus();
  }, h.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const c = this.triggerBtn.getBoundingClientRect(), r = ee(this.toggleEl), d = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, f = this.dom.getAttribute(u) || l, y = Ht(c, r, f, d);
    this.toggleEl.style.top = y.top + "px", this.toggleEl.style.left = y.left + "px", this.toggleEl.setAttribute(m, y.placement);
  }, h.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const c = this;
    this._boundDocClick = function(r) {
      c.dom.contains(r.target) || c.toggleEl && c.toggleEl.contains(r.target) || c.toggleEl && c.toggleEl.getAttribute("data-ln-toggle") === "open" && c.toggleEl.setAttribute("data-ln-toggle", "close");
    }, c._docClickTimeout = setTimeout(function() {
      c._docClickTimeout = null, document.addEventListener("click", c._boundDocClick);
    }, 0);
  }, h.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, h.prototype._addScrollRepositionListener = function() {
    const c = this;
    this._boundScrollReposition = function() {
      c._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, h.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, h.prototype._addResizeCloseListener = function() {
    const c = this;
    this._boundResizeClose = function() {
      c.toggleEl && c.toggleEl.getAttribute("data-ln-toggle") === "open" && c.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, h.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, h.prototype.destroy = function() {
    this.dom[n] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute(m), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), S(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[n]);
  }, M(e, n, h, "ln-dropdown");
})();
(function() {
  const e = "data-ln-popover", n = "lnPopover", u = "data-ln-popover-for", m = "data-ln-popover-position";
  if (window[n] !== void 0) return;
  const l = [];
  let h = null;
  function c() {
    h || (h = function(y) {
      if (y.key !== "Escape" || l.length === 0) return;
      l[l.length - 1].close();
    }, document.addEventListener("keydown", h));
  }
  function r() {
    l.length > 0 || h && (document.removeEventListener("keydown", h), h = null);
  }
  function d(y) {
    this.dom = y, this.isOpen = y.getAttribute(e) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const p = this;
    return this._onRequestOpen = function(_) {
      const g = _.detail && _.detail.trigger ? _.detail.trigger : null;
      p.open(g);
    }, this._onRequestClose = function() {
      p.close();
    }, this._onRequestToggle = function(_) {
      const g = _.detail && _.detail.trigger ? _.detail.trigger : null;
      p.toggle(g);
    }, y.addEventListener("ln-popover:request-open", this._onRequestOpen), y.addEventListener("ln-popover:request-close", this._onRequestClose), y.addEventListener("ln-popover:request-toggle", this._onRequestToggle), y.hasAttribute("tabindex") || y.setAttribute("tabindex", "-1"), y.hasAttribute("role") || y.setAttribute("role", "dialog"), y.hasAttribute("popover") || y.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  d.prototype.open = function(y) {
    this.isOpen || (this.trigger = y || null, this.dom.setAttribute(e, "open"));
  }, d.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(e, "closed");
  }, d.prototype.toggle = function(y) {
    this.isOpen ? this.close() : this.open(y);
  }, d.prototype._applyOpen = function(y) {
    this.isOpen = !0, y && (this.trigger = y), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const p = ee(this.dom);
    if (this.trigger) {
      const s = this.trigger.getBoundingClientRect(), t = this.dom.getAttribute(m) || "bottom", o = Ht(s, p, t, 8);
      this.dom.style.top = o.top + "px", this.dom.style.left = o.left + "px", this.dom.setAttribute("data-ln-popover-placement", o.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const _ = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), g = Array.prototype.find.call(_, xt);
    g ? g.focus() : this.dom.focus();
    const i = this;
    this._boundDocClick = function(s) {
      i.dom.contains(s.target) || i.trigger && i.trigger.contains(s.target) || i.close();
    }, i._docClickTimeout = setTimeout(function() {
      i._docClickTimeout = null, document.addEventListener("click", i._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!i.trigger) return;
      const s = i.trigger.getBoundingClientRect(), t = ee(i.dom), o = i.dom.getAttribute(m) || "bottom", a = Ht(s, t, o, 8);
      i.dom.style.top = a.top + "px", i.dom.style.left = a.left + "px", i.dom.setAttribute("data-ln-popover-placement", a.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), l.push(this), c(), S(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, d.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const y = l.indexOf(this);
    y !== -1 && l.splice(y, 1), r(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, S(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, d.prototype.destroy = function() {
    this.dom[n] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[n], S(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function f(y) {
    this.dom = y;
    const p = y.getAttribute(u);
    return y.setAttribute("aria-haspopup", "dialog"), y.setAttribute("aria-expanded", "false"), y.setAttribute("aria-controls", p), this._onClick = function(_) {
      if (_.ctrlKey || _.metaKey || _.button === 1) return;
      _.preventDefault();
      const g = document.getElementById(p);
      if (!g) return;
      g[n] && (g[n].trigger = y);
      const i = g.getAttribute(e);
      g.setAttribute(e, i === "open" ? "closed" : "open");
    }, y.addEventListener("click", this._onClick), this;
  }
  f.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[n + "Trigger"];
  }, M(e, n, d, "ln-popover", {
    onAttributeChange: function(y) {
      const p = y[n];
      if (!p) return;
      const g = y.getAttribute(e) === "open";
      if (g !== p.isOpen)
        if (g) {
          if (W(y, "ln-popover:before-open", {
            popoverId: y.id,
            target: y,
            trigger: p.trigger
          }).defaultPrevented) {
            y.setAttribute(e, "closed");
            return;
          }
          p._applyOpen(p.trigger);
        } else {
          if (W(y, "ln-popover:before-close", {
            popoverId: y.id,
            target: y,
            trigger: p.trigger
          }).defaultPrevented) {
            y.setAttribute(e, "open");
            return;
          }
          p._applyClose();
        }
    }
  }), M(u, n + "Trigger", f, "ln-popover-trigger");
})();
(function() {
  const e = "data-ln-tooltip-enhance", n = "data-ln-tooltip", u = "data-ln-tooltip-position", m = "lnTooltipEnhance", l = "ln-tooltip-portal";
  if (window[m] !== void 0) return;
  let h = 0, c = null, r = null, d = null, f = null, y = null, p = null;
  function _() {
    return c && c.parentNode || (c = document.getElementById(l), c || (c = document.createElement("div"), c.id = l, document.body.appendChild(c)), c.hasAttribute("popover") || c.setAttribute("popover", "manual")), c;
  }
  function g() {
    p || (p = function(a) {
      a.key === "Escape" && t();
    }, document.addEventListener("keydown", p));
  }
  function i() {
    p && (document.removeEventListener("keydown", p), p = null);
  }
  function s(a) {
    if (d === a) return;
    t();
    const b = a.getAttribute(n) || a.getAttribute("title");
    if (!b) return;
    _(), typeof c.showPopover == "function" && c.showPopover(), a.hasAttribute("title") && (f = a.getAttribute("title"), a.removeAttribute("title"));
    const v = a.getAttribute("aria-describedby");
    v ? y = v : y = null;
    const w = document.createElement("div");
    w.className = "ln-tooltip", w.textContent = b, a[m + "Uid"] || (h += 1, a[m + "Uid"] = "ln-tooltip-" + h), w.id = a[m + "Uid"], c.appendChild(w);
    const A = w.offsetWidth, C = w.offsetHeight, L = a.getBoundingClientRect(), q = a.getAttribute(u) || "top", x = Ht(L, { width: A, height: C }, q, 6);
    w.style.top = x.top + "px", w.style.left = x.left + "px", w.setAttribute("data-ln-tooltip-placement", x.placement), y ? a.setAttribute("aria-describedby", y + " " + w.id) : a.setAttribute("aria-describedby", w.id), r = w, d = a, g();
  }
  function t() {
    if (!r) {
      i();
      return;
    }
    d && (y !== null ? d.setAttribute("aria-describedby", y) : d.removeAttribute("aria-describedby"), y = null, f !== null && d.setAttribute("title", f)), f = null, r.parentNode && r.parentNode.removeChild(r), r = null, d = null, c && typeof c.hidePopover == "function" && c.matches(":popover-open") && c.hidePopover(), i();
  }
  function o(a) {
    return this.dom = a, a.hasAttribute("data-ln-tooltip-enhanced") || (a.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      s(a);
    }, this._onLeave = function() {
      d === a && !a.contains(document.activeElement) && t();
    }, this._onFocus = function() {
      s(a);
    }, this._onBlur = function() {
      d === a && !a.matches(":hover") && t();
    }, a.addEventListener("mouseenter", this._onEnter), a.addEventListener("mouseleave", this._onLeave), a.addEventListener("focus", this._onFocus, !0), a.addEventListener("blur", this._onBlur, !0), this;
  }
  o.prototype.destroy = function() {
    const a = this.dom;
    a.removeEventListener("mouseenter", this._onEnter), a.removeEventListener("mouseleave", this._onLeave), a.removeEventListener("focus", this._onFocus, !0), a.removeEventListener("blur", this._onBlur, !0), d === a && t(), this._addedEnhancedAttr && a.removeAttribute("data-ln-tooltip-enhanced"), delete a[m], delete a[m + "Uid"], S(a, "ln-tooltip:destroyed", { trigger: a });
  }, M(
    "[" + e + "], [data-ln-tooltip-enhanced], [" + n + "][title]",
    m,
    o,
    "ln-tooltip"
  );
})();
(function() {
  const e = "data-ln-toast", n = "lnToast", u = "ln-toast-item";
  if (window[n] !== void 0) return;
  function m(i) {
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
  function l(i) {
    if (!i || !(i instanceof HTMLElement)) return;
    if (i.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof i.hidePopover == "function" && i.matches(":popover-open"))
      try {
        i.hidePopover();
      } catch {
      }
  }
  function h(i) {
    this.dom = i, this.timeoutDefault = +(i.getAttribute("data-ln-toast-timeout") ?? 6e3), this.max = +(i.getAttribute("data-ln-toast-max") ?? 5);
    const s = Array.from(i.querySelectorAll("[data-ln-toast-item]"));
    for (; s.length > this.max; ) i.removeChild(s.shift());
    for (const t of s) p(t, this);
    return s.length > 0 && m(i), this;
  }
  h.prototype.enqueue = function(i) {
    if (!i) return;
    const s = c(i, this.dom);
    if (!s) return;
    const t = Number.isFinite(i.timeout) ? i.timeout : this.timeoutDefault;
    d(this, s), t > 0 && (s._timer = setTimeout(() => f(s), t));
  }, h.prototype.clear = function() {
    for (const i of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      f(i);
  }, h.prototype.destroy = function() {
    if (this.dom[n]) {
      for (const i of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        f(i);
      l(this.dom), S(this.dom, "ln-toast:destroyed", { target: this.dom }), delete this.dom[n];
    }
  };
  function c(i, s) {
    const t = ((i.type || "") + "").trim().toLowerCase(), o = pt(s, u, "ln-toast");
    if (!o)
      return console.warn('[ln-toast] Template "' + u + '" not found'), null;
    rt(o, {
      type: t,
      title: i.title,
      message: typeof i.message == "string" ? i.message : void 0
    });
    const a = o.firstElementChild;
    if (!a) return null;
    a.hasAttribute("data-ln-toast-item") || a.setAttribute("data-ln-toast-item", ""), a.classList.add("ln-enter");
    const b = a.querySelector(".body");
    b && r(b, i);
    const v = a.querySelector("[data-ln-toast-close]");
    return v && v.addEventListener("click", function() {
      f(a);
    }), a;
  }
  function r(i, s) {
    if (Array.isArray(s.message)) {
      const t = document.createElement("ul");
      for (const o of s.message) {
        const a = document.createElement("li");
        a.textContent = o, t.appendChild(a);
      }
      i.appendChild(t);
    }
    if (s.data && s.data.errors) {
      const t = document.createElement("ul");
      for (const o of Object.values(s.data.errors).flat()) {
        const a = document.createElement("li");
        a.textContent = o, t.appendChild(a);
      }
      i.appendChild(t);
    }
  }
  function d(i, s) {
    const t = Array.from(i.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; t.length >= i.max && t.length > 0; ) i.dom.removeChild(t.shift());
    i.dom.appendChild(s), m(i.dom), requestAnimationFrame(() => s.classList.remove("ln-enter"));
  }
  function f(i) {
    if (!i || !i.parentNode) return;
    const s = i.parentNode;
    clearTimeout(i._timer), i.classList.remove("ln-enter"), i.classList.add("ln-out"), setTimeout(() => {
      i.parentNode && (i.parentNode.removeChild(i), l(s));
    }, 200);
  }
  function y(i) {
    let s = i && i.container;
    return typeof s == "string" && (s = document.querySelector(s)), s instanceof HTMLElement || (s = document.querySelector("[" + e + "]") || document.getElementById("ln-toast-container")), s || null;
  }
  function p(i, s) {
    if (i._lnToastHydrated) return;
    i._lnToastHydrated = !0;
    const t = i.querySelector("[data-ln-toast-close]");
    t && t.addEventListener("click", function() {
      f(i);
    });
    const o = +(i.getAttribute("data-ln-toast-timeout") ?? s.timeoutDefault);
    o > 0 && (i._timer = setTimeout(function() {
      f(i);
    }, o));
  }
  function _(i) {
    const s = i.detail || {}, t = y(s);
    if (!t) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (t[n] || (t[n] = new h(t))).enqueue(s);
  }
  function g(i) {
    const s = i && i.detail || {};
    if (s.container) {
      const t = y(s);
      t && (t[n] || (t[n] = new h(t))).clear();
    } else {
      const t = document.querySelectorAll("[" + e + "]");
      for (const o of Array.from(t))
        (o[n] || (o[n] = new h(o))).clear();
    }
  }
  ct(function() {
    window.addEventListener("ln-toast:enqueue", _), window.addEventListener("ln-toast:clear", g), window.addEventListener("ln-modal:open", function() {
      const i = document.querySelectorAll("[" + e + "]");
      for (const s of Array.from(i))
        s.querySelectorAll("[data-ln-toast-item]").length > 0 && m(s);
    });
  }, "ln-toast"), M(e, n, h, "ln-toast");
})();
function ii(e) {
  if (!e) return null;
  const n = String(e).split(",").map((u) => u.trim().toLowerCase()).filter(Boolean).map((u) => u.startsWith(".") ? u.slice(1) : u);
  return n.length ? n : null;
}
function ri(e) {
  return !e || typeof e != "string" || !e.includes(".") ? "" : e.split(".").pop().toLowerCase();
}
function oi(e, n) {
  if (!n || n.length === 0) return !0;
  if (!e) return !1;
  const u = ri(e.name), m = String(e.type || "").toLowerCase();
  return n.some((l) => {
    if (l.includes("/")) {
      if (l.endsWith("/*")) {
        const h = l.slice(0, -1);
        return m.startsWith(h);
      }
      return m === l;
    }
    return u === l;
  });
}
function si(e, n = "en", u = {}) {
  if (typeof e != "number" || isNaN(e) || e === 0)
    return "0 " + (u["unit-b"] || "B");
  const m = 1024, l = [
    u["unit-b"] || "B",
    u["unit-kb"] || "KB",
    u["unit-mb"] || "MB",
    u["unit-gb"] || "GB"
  ], h = Math.floor(Math.log(e) / Math.log(m)), c = Math.min(h, l.length - 1), r = e / Math.pow(m, c);
  return new Intl.NumberFormat(n, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(r) + " " + l[c];
}
(function() {
  const e = "data-ln-upload", n = "lnUpload", u = "data-ln-upload-dict", m = "data-ln-upload-accept", l = "data-ln-upload-delete", h = "data-ln-upload-max-size", c = "data-ln-upload-max-files", r = "data-ln-upload-file-field", d = "data-ln-upload-ids-field", f = "file", y = "file_ids[]";
  if (window[n] !== void 0) return;
  function p(i, s, t) {
    return si(i, s, t);
  }
  function _() {
    const i = document.querySelector('meta[name="csrf-token"]');
    return i ? i.getAttribute("content") : "";
  }
  function g(i) {
    this.dom = i, this.dict = zt(i, u), this.locale = V(i), this.zone = i.querySelector("[data-ln-upload-zone]") || i, this.list = i.querySelector("[data-ln-upload-list]"), this.input = i.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', i), this.uploadUrl = i.getAttribute(e) || "", this.deleteUrlPattern = i.getAttribute(l) || "", this.fileFieldName = i.getAttribute(r) || f, this.idsFieldName = i.getAttribute(d) || y, this.maxSize = +i.getAttribute(h) || 0, this.maxFiles = +i.getAttribute(c) || 0;
    const s = i.getAttribute(m) || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = ii(s), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  g.prototype._hydrate = function() {
    const i = this;
    if (!this.list) return;
    const s = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let o = 0; o < s.length; o++) {
      const a = s[o], b = a.getAttribute("data-ln-upload-id"), v = "file-" + ++i.fileIdCounter;
      a.setAttribute("data-ln-upload-local-id", v);
      const w = a.querySelector('[data-ln-field="name"]'), A = a.querySelector('[data-ln-field="sizeText"]'), C = a.getAttribute("data-ln-upload-size"), L = C ? parseInt(C, 10) : null;
      i.uploadedFiles.set(v, {
        serverId: b || null,
        name: w ? w.textContent.trim() : "",
        size: L !== null && !isNaN(L) ? L : A ? A.textContent.trim() : ""
      });
    }
    const t = this.dom.querySelectorAll('input[type="hidden"]');
    for (let o = 0; o < t.length; o++) {
      const a = t[o];
      if (a.name === i.idsFieldName && a.value && !Array.from(i.uploadedFiles.values()).some(function(v) {
        return String(v.serverId) === String(a.value);
      })) {
        const v = "file-" + ++i.fileIdCounter;
        i.uploadedFiles.set(v, {
          serverId: a.value,
          name: "",
          size: ""
        });
      }
    }
    this._syncHiddenInputs();
  }, g.prototype._syncHiddenInputs = function() {
    const i = this, s = this.dom.querySelectorAll('input[type="hidden"]');
    for (let t = 0; t < s.length; t++)
      s[t].name === i.idsFieldName && s[t].remove();
    for (const [, t] of this.uploadedFiles)
      if (t.serverId) {
        const o = document.createElement("input");
        o.type = "hidden", o.name = i.idsFieldName, o.value = t.serverId, i.dom.appendChild(o);
      }
  }, g.prototype._bindEvents = function() {
    const i = this;
    this._onZoneClick = function(s) {
      i.zone === i.dom && s.target.closest("[data-ln-upload-list], [data-ln-upload-action], input, button, a") || i.input && s.target !== i.input && i.input.click();
    }, this._onInputChange = function() {
      i.input && i.input.files && (i.upload(i.input.files), i.input.value = "");
    }, this._onDragEnter = function(s) {
      s.preventDefault(), s.stopPropagation(), i._dragDepth++, i.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragOver = function(s) {
      s.preventDefault(), s.stopPropagation(), i.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragLeave = function(s) {
      s.preventDefault(), s.stopPropagation(), i._dragDepth--, i._dragDepth <= 0 && (i._dragDepth = 0, i.zone.removeAttribute("data-ln-upload-state"));
    }, this._onDrop = function(s) {
      s.preventDefault(), s.stopPropagation(), i._dragDepth = 0, i.zone.removeAttribute("data-ln-upload-state"), s.dataTransfer && s.dataTransfer.files && i.upload(s.dataTransfer.files);
    }, this._onListClick = function(s) {
      const t = s.target.closest('[data-ln-upload-action="remove"]');
      if (!t || !i.list || !i.list.contains(t) || t.disabled) return;
      const o = t.closest("[data-ln-upload-item]");
      if (o) {
        const a = o.getAttribute("data-ln-upload-local-id");
        a && i.remove(a);
      }
    }, this._onRequestUpload = function(s) {
      s.detail && s.detail.files && i.upload(s.detail.files);
    }, this._onRequestRemove = function(s) {
      if (s.detail) {
        const t = s.detail.localId !== void 0 ? s.detail.localId : s.detail.serverId;
        t !== void 0 && i.remove(t);
      }
    }, this._onRequestClear = function() {
      i.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, g.prototype.upload = function(i) {
    const s = this, t = Array.from(i);
    for (let o = 0; o < t.length; o++) {
      const a = t[o];
      if (s.maxFiles > 0 && s.uploadedFiles.size >= s.maxFiles) {
        S(s.dom, "ln-upload:invalid", {
          file: a,
          reason: "max-files"
        });
        continue;
      }
      if (!oi(a, s.allowedExts)) {
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
  }, g.prototype._uploadSingleFile = function(i) {
    const s = this, t = "file-" + ++s.fileIdCounter, o = _getExtension(i.name);
    let a = null;
    if (this.list) {
      const C = pt(this.dom, "ln-upload-item", "ln-upload");
      if (C && (a = C.firstElementChild, a)) {
        a.setAttribute("data-ln-upload-item", ""), a.setAttribute("data-ln-upload-local-id", t), a.setAttribute("data-ln-upload-ext", o), a.setAttribute("data-ln-upload-state", "uploading"), rt(a, {
          name: i.name,
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
    const b = new FormData();
    b.append(s.fileFieldName, i);
    const v = this.dom.querySelectorAll("input, select, textarea");
    for (let C = 0; C < v.length; C++) {
      const L = v[C];
      !L.name || L.name === s.idsFieldName || L.type === "file" || (L.type === "checkbox" || L.type === "radio") && !L.checked || b.append(L.name, L.value);
    }
    const w = new XMLHttpRequest();
    s.uploadedFiles.set(t, {
      serverId: null,
      name: i.name,
      size: i.size,
      xhr: w
    }), w.upload.addEventListener("progress", function(C) {
      if (C.lengthComputable) {
        const L = Math.round(C.loaded / C.total * 100);
        if (a) {
          const q = a.querySelector("[data-ln-progress]");
          q && q.setAttribute("data-ln-progress", String(L)), rt(a, { sizeText: L + "%" });
        }
        S(s.dom, "ln-upload:progress", {
          localId: t,
          file: i,
          percent: L,
          loaded: C.loaded,
          total: C.total
        });
      }
    }), w.addEventListener("load", function() {
      const C = s.uploadedFiles.get(t);
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
          a.removeAttribute("data-ln-upload-state"), q && a.setAttribute("data-ln-upload-id", String(q)), rt(a, {
            sizeText: p(L.size || i.size, s.locale, s.dict),
            uploading: !1
          });
          const x = a.querySelector('[data-ln-upload-action="remove"]');
          x && (x.disabled = !1);
        }
        C && (C.serverId = q, C.size = L.size || i.size, C.name = L.name || i.name), s._syncHiddenInputs(), S(s.dom, "ln-upload:uploaded", {
          localId: t,
          serverId: q,
          name: L.name || i.name,
          size: L.size || i.size,
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
      const C = s.uploadedFiles.get(t);
      C && delete C.xhr, A("", 0, null);
    });
    function A(C, L, q) {
      if (a) {
        a.setAttribute("data-ln-upload-state", "error"), rt(a, {
          sizeText: s.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const x = a.querySelector('[data-ln-upload-action="remove"]');
        x && (x.disabled = !1);
      }
      S(s.dom, "ln-upload:error", {
        file: i,
        message: C,
        status: L,
        error: q
      });
    }
    s.uploadUrl ? (w.open("POST", s.uploadUrl), w.setRequestHeader("X-CSRF-TOKEN", _()), w.setRequestHeader("X-Requested-With", "XMLHttpRequest"), w.setRequestHeader("Accept", "application/json"), w.send(b)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, g.prototype.remove = function(i) {
    const s = this;
    let t = null, o = null;
    if (s.uploadedFiles.has(i))
      t = i, o = s.uploadedFiles.get(i);
    else
      for (const [w, A] of s.uploadedFiles)
        if (String(A.serverId) === String(i)) {
          t = w, o = A;
          break;
        }
    if (!t || !o || W(s.dom, "ln-upload:before-remove", {
      localId: t,
      serverId: o.serverId
    }).defaultPrevented) return;
    const b = s.list ? s.list.querySelector('[data-ln-upload-local-id="' + t + '"]') : null;
    if (o.xhr && typeof o.xhr.abort == "function" && o.xhr.abort(), !o.serverId) {
      b && b.remove(), s.uploadedFiles.delete(t), s._syncHiddenInputs(), S(s.dom, "ln-upload:removed", { localId: t, serverId: null });
      return;
    }
    let v = null;
    if (s.deleteUrlPattern ? v = s.deleteUrlPattern.replace("{id}", encodeURIComponent(o.serverId)) : s.uploadUrl && s.uploadUrl.includes("{id}") && (v = s.uploadUrl.replace("{id}", encodeURIComponent(o.serverId))), !v) {
      b && b.remove(), s.uploadedFiles.delete(t), s._syncHiddenInputs(), S(s.dom, "ln-upload:removed", { localId: t, serverId: o.serverId });
      return;
    }
    b && (b.setAttribute("data-ln-upload-state", "deleting"), rt(b, { deleting: !0 })), fetch(v, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": _(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(w) {
      w.ok ? (b && b.remove(), s.uploadedFiles.delete(t), s._syncHiddenInputs(), S(s.dom, "ln-upload:removed", {
        localId: t,
        serverId: o.serverId
      })) : (b && (b.removeAttribute("data-ln-upload-state"), rt(b, { deleting: !1 })), S(s.dom, "ln-upload:error", {
        file: o,
        message: "",
        status: w.status
      }));
    }).catch(function(w) {
      b && (b.removeAttribute("data-ln-upload-state"), rt(b, { deleting: !1 })), S(s.dom, "ln-upload:error", {
        file: o,
        message: "",
        status: 0,
        error: w
      });
    });
  }, g.prototype.clear = function() {
    const i = this;
    if (!W(i.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, t] of this.uploadedFiles)
        if (t.xhr && typeof t.xhr.abort == "function" && t.xhr.abort(), t.serverId) {
          let o = null;
          i.deleteUrlPattern ? o = i.deleteUrlPattern.replace("{id}", encodeURIComponent(t.serverId)) : i.uploadUrl && i.uploadUrl.includes("{id}") && (o = i.uploadUrl.replace("{id}", encodeURIComponent(t.serverId))), o && fetch(o, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": _(),
              "X-Requested-With": "XMLHttpRequest",
              Accept: "application/json"
            }
          }).catch(function() {
          });
        }
      i.uploadedFiles.clear(), i.list && (i.list.innerHTML = ""), i._syncHiddenInputs(), S(i.dom, "ln-upload:cleared", {});
    }
  }, g.prototype.getFileIds = function() {
    return Array.from(this.uploadedFiles.values()).map(function(i) {
      return i.serverId;
    }).filter(Boolean);
  }, g.prototype.getFiles = function() {
    return Array.from(this.uploadedFiles.values()).map(function(i) {
      return {
        serverId: i.serverId,
        name: i.name,
        size: i.size
      };
    });
  }, g.prototype.destroy = function() {
    if (this.dom[n]) {
      for (const [, i] of this.uploadedFiles)
        i.xhr && typeof i.xhr.abort == "function" && i.xhr.abort();
      this.zone.removeEventListener("click", this._onZoneClick), this.input && this.input.removeEventListener("change", this._onInputChange), this.zone.removeEventListener("dragenter", this._onDragEnter), this.zone.removeEventListener("dragover", this._onDragOver), this.zone.removeEventListener("dragleave", this._onDragLeave), this.zone.removeEventListener("drop", this._onDrop), this.list && this.list.removeEventListener("click", this._onListClick), this.dom.removeEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.removeEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.removeEventListener("ln-upload:request-clear", this._onRequestClear), this.uploadedFiles.clear(), this.dict = {}, S(this.dom, "ln-upload:destroyed", { target: this.dom }), delete this.dom[n];
    }
  }, M(e, n, g, "ln-upload");
})();
(function() {
  const e = "lnExternalLinks";
  if (window[e] !== void 0) return;
  function n(r) {
    return r.hostname && r.hostname !== window.location.hostname;
  }
  function u(r) {
    if (r.getAttribute("data-ln-external-link") === "processed" || !n(r)) return;
    r.target = "_blank";
    const d = (r.rel || "").split(/\s+/).filter(Boolean);
    d.includes("noopener") || d.push("noopener"), d.includes("noreferrer") || d.push("noreferrer"), r.rel = d.join(" ");
    const f = document.createElement("span");
    f.className = "sr-only", f.textContent = "(opens in new tab)", r.appendChild(f), r.setAttribute("data-ln-external-link", "processed"), S(r, "ln-external-links:processed", {
      link: r,
      href: r.href
    });
  }
  function m(r) {
    r = r || document.body;
    for (const d of r.querySelectorAll("a, area"))
      u(d);
  }
  function l() {
    ct(function() {
      document.body.addEventListener("click", function(r) {
        const d = r.target.closest("a, area");
        d && d.getAttribute("data-ln-external-link") === "processed" && S(d, "ln-external-links:clicked", {
          link: d,
          href: d.href,
          text: d.textContent || d.title || ""
        });
      });
    }, "ln-external-links");
  }
  function h() {
    ct(function() {
      new MutationObserver(function(d) {
        for (const f of d) {
          if (f.type === "childList") {
            for (const y of f.addedNodes)
              if (y.nodeType === 1 && (y.matches && (y.matches("a") || y.matches("area")) && u(y), y.querySelectorAll))
                for (const p of y.querySelectorAll("a, area"))
                  u(p);
          }
          if (f.type === "attributes" && f.attributeName === "href") {
            const y = f.target;
            y.matches && (y.matches("a") || y.matches("area")) && u(y);
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
    l(), h(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      m();
    }) : m();
  }
  window[e] = {
    process: m
  }, c();
})();
(function() {
  const e = "data-ln-link", n = "lnLink";
  if (window[n] !== void 0) return;
  let u = null;
  function m() {
    u = document.createElement("div"), u.className = "ln-link-status", document.body.appendChild(u);
  }
  function l(o) {
    u && (u.textContent = o, u.classList.add("ln-link-status--visible"));
  }
  function h() {
    u && u.classList.remove("ln-link-status--visible");
  }
  function c(o, a) {
    if (a.target.closest("a, button, input, select, textarea")) return;
    const b = o.querySelector("a");
    if (!b) return;
    const v = b.getAttribute("href");
    if (!v) return;
    if (a.ctrlKey || a.metaKey || a.button === 1) {
      window.open(v, "_blank");
      return;
    }
    W(o, "ln-link:navigate", { target: o, href: v, link: b }).defaultPrevented || b.click();
  }
  function r(o) {
    const a = o.querySelector("a");
    if (!a) return;
    const b = a.getAttribute("href");
    b && l(b);
  }
  function d() {
    h();
  }
  function f(o) {
    o[n + "Row"] || !o.querySelector("a") || (o[n + "Row"] = !0, o._lnLinkClick = function(b) {
      c(o, b);
    }, o._lnLinkEnter = function() {
      r(o);
    }, o.addEventListener("click", o._lnLinkClick), o.addEventListener("mouseenter", o._lnLinkEnter), o.addEventListener("mouseleave", d));
  }
  function y(o) {
    o[n + "Row"] && (o._lnLinkClick && o.removeEventListener("click", o._lnLinkClick), o._lnLinkEnter && o.removeEventListener("mouseenter", o._lnLinkEnter), o.removeEventListener("mouseleave", d), delete o._lnLinkClick, delete o._lnLinkEnter, delete o[n + "Row"]);
  }
  function p(o) {
    if (!o[n + "Init"]) return;
    const a = o.tagName;
    if (a === "TABLE" || a === "TBODY") {
      const b = a === "TABLE" && o.querySelector("tbody") || o;
      for (const v of b.querySelectorAll("tr"))
        y(v);
    } else
      y(o);
    delete o[n + "Init"];
  }
  function _(o) {
    if (o[n + "Init"]) return;
    o[n + "Init"] = !0;
    const a = o.tagName;
    if (a === "TABLE" || a === "TBODY") {
      const b = a === "TABLE" && o.querySelector("tbody") || o;
      for (const v of b.querySelectorAll("tr"))
        f(v);
    } else
      f(o);
  }
  function g(o) {
    o.hasAttribute && o.hasAttribute(e) && _(o);
    const a = o.querySelectorAll ? o.querySelectorAll("[" + e + "]") : [];
    for (const b of a)
      _(b);
  }
  function i() {
    ct(function() {
      new MutationObserver(function(a) {
        for (const b of a)
          if (b.type === "childList") {
            for (const v of b.addedNodes)
              if (v.nodeType === 1) {
                g(v);
                const w = v.closest("[" + e + "]");
                if (w)
                  if (v.tagName === "TR")
                    f(v);
                  else {
                    const A = w.tagName;
                    if (A === "TABLE" || A === "TBODY") {
                      const C = v.querySelectorAll ? v.querySelectorAll("tr") : [];
                      for (const L of C)
                        f(L);
                    }
                  }
              }
          } else b.type === "attributes" && (b.target.hasAttribute && b.target.hasAttribute(e) ? g(b.target) : p(b.target));
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [e]
      });
    }, "ln-link");
  }
  function s(o) {
    g(o);
  }
  window[n] = { init: s, destroy: p };
  function t() {
    m(), i(), s(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t) : t();
})();
const qt = ["Ctrl", "Alt", "Shift", "Meta"], ai = {
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
function cn(e) {
  if (e === " ") return "Space";
  const n = String(e || "").trim();
  if (!n) return "";
  const u = ai[n.toLowerCase()];
  return u || (n.length === 1 || /^f\d{1,2}$/i.test(n) ? n.toUpperCase() : n.charAt(0).toUpperCase() + n.slice(1));
}
function dn(e) {
  const n = String(e || "").replace(/\s*\+\s*/g, "+").trim();
  if (!n) return "";
  const u = n.split("+"), m = /* @__PURE__ */ new Set();
  let l = "";
  for (let c = 0; c < u.length; c++) {
    const r = cn(u[c]);
    if (!r) return "";
    if (qt.indexOf(r) !== -1) {
      m.add(r);
      continue;
    }
    if (l) return "";
    l = r;
  }
  if (!l) return "";
  const h = [];
  for (let c = 0; c < qt.length; c++)
    m.has(qt[c]) && h.push(qt[c]);
  return h.push(l), h.join("+");
}
function li(e) {
  const n = String(e || "").replace(/\s*\+\s*/g, "+").trim();
  if (!n) return [];
  const u = n.split(/[\s,]+/), m = [];
  for (let l = 0; l < u.length; l++) {
    const h = dn(u[l]);
    h && m.indexOf(h) === -1 && m.push(h);
  }
  return m;
}
function ci(e, n) {
  const u = String(n || "").trim();
  if (!u || /[\s,]/.test(u)) return "";
  const m = String(e || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(m) ? "" : dn(m ? m + "+" + u : u);
}
function di(e) {
  if (!e) return "";
  const n = cn(e.key);
  if (!n || qt.indexOf(n) !== -1) return "";
  const u = [];
  return e.ctrlKey && u.push("Ctrl"), e.altKey && u.push("Alt"), e.shiftKey && u.push("Shift"), e.metaKey && u.push("Meta"), u.push(n), u.join("+");
}
function ui(e) {
  if (!e || !e.tagName) return null;
  const n = String(e.tagName).toLowerCase();
  if (n === "button" || n === "a" && e.hasAttribute && e.hasAttribute("href")) return "click";
  if (n === "input" || n === "textarea" || n === "select" || e.isContentEditable) return "focus";
  if (e.hasAttribute && e.hasAttribute("contenteditable")) {
    const u = e.getAttribute("contenteditable");
    if (u === "" || String(u).toLowerCase() !== "false") return "focus";
  }
  return null;
}
function hi(e, n, u, m) {
  if (!e || !n || u !== "click" || e.target !== n || e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return !1;
  const l = String(n.tagName || "").toLowerCase();
  return l === "button" ? m === "Enter" || m === "Space" : l === "a" && n.hasAttribute && n.hasAttribute("href") && m === "Enter";
}
(function() {
  const e = "data-ln-key", n = "lnKey", u = "data-ln-key-target", m = "data-ln-key-allow-input", l = "data-ln-key-modifier", h = "data-ln-key-for", c = "lnKeyFor";
  if (window[n] !== void 0) return;
  const r = /* @__PURE__ */ new Set();
  let d = null;
  function f() {
    d || (d = function(i) {
      if (i.defaultPrevented || i.isComposing || i.repeat) return;
      const s = di(i);
      if (!s) return;
      const t = Ln(i.target), o = document.querySelectorAll("[" + e + "], [" + h + "]");
      let a = null, b = !1, v = !1;
      for (let C = 0; C < o.length; C++) {
        const L = o[C], q = L[n] || L[c];
        if (!q || !q.matches(s) || t && !q.allowsInput()) continue;
        const x = q.resolveTarget(), D = ui(x);
        if (!(!D || !Tn(x, D))) {
          if (hi(i, x, D, s)) {
            v = !0;
            continue;
          }
          a ? b = !0 : a = { host: L, target: x, action: D };
        }
      }
      if (v || !a) return;
      b && console.warn('[ln-key] Duplicate active shortcut "' + s + '"; first DOM match wins.');
      const w = {
        source: a.host,
        target: a.target,
        action: a.action,
        key: s,
        event: i
      };
      W(a.host, "ln-key:before-trigger", w).defaultPrevented || (i.preventDefault(), a.target[a.action](), S(a.host, "ln-key:trigger", w));
    }, document.addEventListener("keydown", d));
  }
  function y() {
    r.size > 0 || !d || (document.removeEventListener("keydown", d), d = null);
  }
  function p(i) {
    return this.dom = i, this.shortcuts = [], r.add(this), this.sync(), f(), this;
  }
  p.prototype.sync = function() {
    this.shortcuts = li(this.dom.getAttribute(e));
  }, p.prototype.matches = function(i) {
    return this.shortcuts.indexOf(i) !== -1;
  }, p.prototype.allowsInput = function() {
    return this.dom.hasAttribute(m);
  }, p.prototype.resolveTarget = function() {
    const i = this.dom.getAttribute(u);
    return i ? g(i, u) : this.dom;
  }, p.prototype.destroy = function() {
    this.dom[n] && (r.delete(this), delete this.dom[n], y(), S(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function _(i) {
    return this.dom = i, r.add(this), f(), this;
  }
  _.prototype._modifierContext = function() {
    return this.dom.closest("[" + l + "]");
  }, _.prototype.shortcut = function() {
    const i = this._modifierContext(), s = i ? i.getAttribute(l) : "";
    return ci(s, this.dom.textContent);
  }, _.prototype.matches = function(i) {
    return this.shortcut() === i;
  }, _.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(m)) return !0;
    const i = this._modifierContext();
    return !!(i && i.hasAttribute(m));
  }, _.prototype.resolveTarget = function() {
    return g(this.dom.getAttribute(h), h);
  }, _.prototype.destroy = function() {
    this.dom[c] && (r.delete(this), delete this.dom[c], y(), S(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function g(i, s) {
    if (!i) return null;
    try {
      const t = document.querySelector(i);
      return t || console.warn("[ln-key] Target not found for " + s + ' selector "' + i + '".'), t;
    } catch {
      return console.warn("[ln-key] Invalid " + s + ' selector "' + i + '".'), null;
    }
  }
  M(e, n, p, "ln-key", {
    extraAttributes: [u, m],
    onAttributeChange: function(i) {
      const s = i[n];
      if (s) {
        if (!i.hasAttribute(e)) {
          s.destroy();
          return;
        }
        s.sync();
      }
    }
  }), M(h, c, _, "ln-key-for", {
    onAttributeChange: function(i) {
      const s = i[c];
      s && !i.hasAttribute(h) && s.destroy();
    }
  });
})();
function fi(e, n, u = 100) {
  if (n != null && n !== "") {
    const m = parseFloat(String(n));
    if (!isNaN(m) && m > 0) return m;
  }
  if (e != null && e !== "") {
    const m = parseFloat(String(e));
    if (!isNaN(m) && m > 0) return m;
  }
  return u;
}
(function() {
  const e = "[data-ln-progress]", n = "lnProgress";
  if (window[n] !== void 0) return;
  function u(h) {
    return this.dom = h, this._parentObserver = null, l.call(this), m.call(this), this;
  }
  u.prototype.destroy = function() {
    this.dom[n] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[n]);
  };
  function m() {
    const h = this, c = this.dom.parentElement;
    if (!c) return;
    const r = new MutationObserver(function(d) {
      for (const f of d)
        f.attributeName === "data-ln-progress-max" && l.call(h);
    });
    r.observe(c, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = r;
  }
  function l() {
    const h = this.dom.getAttribute("data-ln-progress"), c = this.dom.parentElement, r = c ? c.getAttribute("data-ln-progress-max") : null, d = this.dom.getAttribute("data-ln-progress-max"), f = fi(d, r, 100), y = Xe(h, f);
    this.dom.style.width = y.percentage + "%", this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(y.min)), this.dom.setAttribute("aria-valuemax", String(y.max)), this.dom.setAttribute("aria-valuenow", String(y.clampedValue)), S(this.dom, "ln-progress:change", {
      target: this.dom,
      value: y.value,
      max: y.max,
      percentage: y.percentage
    });
  }
  M(
    e,
    n,
    u,
    "ln-progress",
    {
      extraAttributes: ["data-ln-progress-max"],
      onAttributeChange: function(h) {
        const c = h[n];
        c && l.call(c);
      }
    }
  );
})();
function pi(e, n) {
  if (!Array.isArray(e) || !Array.isArray(n)) return e !== n;
  if (e.length !== n.length) return !0;
  for (let u = 0; u < e.length; u++)
    if (e[u] !== n[u]) return !0;
  return !1;
}
function mi(e, n) {
  if (!n || typeof n != "object") return !0;
  const u = Object.keys(n);
  if (u.length === 0) return !0;
  for (let m = 0; m < u.length; m++) {
    const l = n[u[m]], h = e[l.col] || "";
    if (!fe(h, l.values))
      return !1;
  }
  return !0;
}
function gi(e) {
  if (!Array.isArray(e)) return { key: null, values: [] };
  let n = null;
  const u = [];
  for (let m = 0; m < e.length; m++) {
    const l = e[m];
    !n && l.key && (n = l.key), l.checked && !l.isReset && l.value && u.push(l.value);
  }
  return { key: n, values: u };
}
(function() {
  const e = "data-ln-filter", n = "lnFilter", u = "data-ln-filter-key", m = "data-ln-filter-value", l = "data-ln-filter-hide", h = "data-ln-filter-reset", c = "data-ln-filter-col", r = "data-ln-hash", d = /* @__PURE__ */ new WeakMap();
  if (window[n] !== void 0) return;
  function f(i) {
    return i.hasAttribute(h) || !i.getAttribute(m);
  }
  function y(i) {
    const s = i.dom.querySelectorAll("[" + u + "]"), t = [];
    for (let a = 0; a < s.length; a++) {
      const b = s[a];
      t.push({
        key: b.getAttribute(u),
        value: b.getAttribute(m) || "",
        checked: b.checked,
        isReset: f(b)
      });
    }
    const o = gi(t);
    return { key: o.key, values: o.values, targetId: i.targetId };
  }
  function p(i, s, t) {
    const o = i.querySelectorAll("[" + u + "]"), a = Array.isArray(t) && t.length > 0;
    for (let b = 0; b < o.length; b++) {
      const v = o[b];
      f(v) ? v.checked = !a : a && v.getAttribute(u) === s && t.indexOf(v.getAttribute(m)) !== -1 ? v.checked = !0 : v.checked = !1;
    }
  }
  function _(i) {
    this.dom = i, this.targetId = i.getAttribute(e);
    const s = i.getAttribute(c);
    this.colIndex = s !== null ? parseInt(s, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = yt(i, "filter"), this.hashEnabled = !!this.nsKey;
    const t = this, o = ue(function() {
      t._render();
    });
    this._queueRender = o, this._attachHandlers(), this._onHashChange = function() {
      if (t._destroyed || !t.hashEnabled) return;
      const b = X(t.nsKey), v = te(b);
      v && v.key && v.values.length > 0 ? p(t.dom, v.key, v.values) : p(t.dom, null, []), t._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let a = !1;
    if (this.hashEnabled) {
      const b = X(this.nsKey), v = te(b);
      v && v.key && v.values.length > 0 && (p(i, v.key, v.values), ot(function() {
        t._destroyed || t._render();
      }), a = !0);
    }
    if (!a && i.hasAttribute("data-ln-persist")) {
      const b = jt("filter", i);
      b && b.key && Array.isArray(b.values) && b.values.length > 0 && (p(i, b.key, b.values), ot(function() {
        t._destroyed || t._render();
      }), a = !0);
    }
    if (!a) {
      const b = i.querySelectorAll("[" + u + "]");
      for (let v = 0; v < b.length; v++)
        if (b[v].checked && !f(b[v])) {
          ot(function() {
            t._destroyed || t._render();
          });
          break;
        }
    }
    return this;
  }
  _.prototype._attachHandlers = function() {
    const i = this;
    this._onDomChange = function(s) {
      const t = s.target;
      if (!t || !t.hasAttribute || !t.hasAttribute(u)) return;
      const o = Array.from(i.dom.querySelectorAll("[" + u + "]"));
      if (f(t)) {
        for (let a = 0; a < o.length; a++)
          f(o[a]) || (o[a].checked = !1);
        t.checked = !0, i._queueRender();
        return;
      }
      if (t.checked) {
        for (let b = 0; b < o.length; b++)
          f(o[b]) && (o[b].checked = !1);
        let a = !1;
        for (let b = 0; b < o.length; b++)
          if (f(o[b])) {
            a = !0;
            break;
          }
        if (a) {
          let b = !0;
          for (let v = 0; v < o.length; v++)
            if (!f(o[v]) && !o[v].checked) {
              b = !1;
              break;
            }
          if (b)
            for (let v = 0; v < o.length; v++)
              f(o[v]) ? o[v].checked = !0 : o[v].checked = !1;
        }
      } else {
        let a = !1;
        for (let b = 0; b < o.length; b++)
          if (!f(o[b]) && o[b].checked) {
            a = !0;
            break;
          }
        if (!a)
          for (let b = 0; b < o.length; b++)
            f(o[b]) && (o[b].checked = !0);
      }
      i._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, _.prototype._render = function() {
    const i = this, s = y(this), t = this._lastSnapshot;
    if (!(!t || t.key !== s.key || pi(t.values, s.values))) return;
    const a = s.key === null || s.values.length === 0, b = document.getElementById(i.targetId), v = {
      key: s.key,
      values: s.values.slice(),
      targetId: i.targetId
    };
    S(i.dom, "ln-filter:change", v);
    let w = !1;
    b && b !== i.dom && W(b, "ln-filter:change", v).defaultPrevented && (w = !0);
    const A = t && t.values.length > 0, C = s.values.length === 0;
    if (A && C) {
      const L = { targetId: i.targetId };
      S(i.dom, "ln-filter:reset", L), b && b !== i.dom && S(b, "ln-filter:reset", L);
    }
    if (this._lastSnapshot = { key: s.key, values: s.values.slice() }, this.dom.hasAttribute("data-ln-persist") && (s.key && s.values.length > 0 ? bt("filter", this.dom, { key: s.key, values: s.values.slice() }) : bt("filter", this.dom, null)), this.hashEnabled) {
      const L = $e(s.key, s.values);
      et(this.nsKey, L);
    }
    if (!w)
      if (i.colIndex !== null)
        i._filterTableRows(s);
      else {
        if (!b) return;
        const L = b.children;
        for (let q = 0; q < L.length; q++) {
          const x = L[q];
          if (x.removeAttribute(l), a) continue;
          const D = x.getAttribute("data-" + s.key);
          D !== null && (fe(D, s.values) || x.setAttribute(l, "true"));
        }
      }
  }, _.prototype._filterTableRows = function(i) {
    const s = document.getElementById(this.targetId);
    if (!s) return;
    const t = s.tagName === "TABLE" ? s : s.querySelector("table");
    if (!t) return;
    const o = i.key || this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex, a = i.values;
    d.has(t) || d.set(t, {});
    const b = d.get(t);
    o && a.length > 0 ? b[o] = { col: this.colIndex, values: a.slice() } : o && delete b[o];
    const v = t.tBodies;
    for (let w = 0; w < v.length; w++) {
      const A = v[w].rows;
      for (let C = 0; C < A.length; C++) {
        const L = A[C], q = {};
        for (let x = 0; x < L.cells.length; x++)
          q[x] = L.cells[x].textContent.trim();
        mi(q, b) ? L.removeAttribute(l) : L.setAttribute(l, "true");
      }
    }
  }, _.prototype.destroy = function() {
    if (this.dom[n]) {
      if (this._destroyed = !0, this.colIndex !== null) {
        const i = document.getElementById(this.targetId);
        if (i) {
          const s = i.tagName === "TABLE" ? i : i.querySelector("table");
          if (s && d.has(s)) {
            const t = d.get(s), o = this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex;
            o && t[o] && delete t[o], Object.keys(t).length === 0 && d.delete(s);
          }
        }
      }
      this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[n];
    }
  };
  function g(i, s) {
    const t = i[n];
    !t || t._destroyed || s === r && (t.hashEnabled && t._onHashChange && window.removeEventListener("hashchange", t._onHashChange), t.nsKey = yt(i, "filter"), t.hashEnabled = !!t.nsKey, t.hashEnabled && window.addEventListener("hashchange", t._onHashChange));
  }
  M(e, n, _, "ln-filter", {
    extraAttributes: [r],
    onAttributeChange: g
  });
})();
(function() {
  const e = "data-ln-search", n = "lnSearch", u = "data-ln-search-for", m = "lnSearchControl", l = "data-ln-search-items", h = "data-ln-search-fields", c = "data-ln-search-exclude", r = "data-ln-search-hide", d = "data-ln-hash";
  if (window[n] !== void 0) return;
  function f(a) {
    const b = yt(a, "search");
    if (b) return b;
    if (a.id) {
      const v = document.querySelector("[" + u + '="' + a.id + '"]');
      if (v) {
        const w = yt(v, "search");
        if (w) return w;
      }
    }
    return null;
  }
  function y(a) {
    return a.matches("input, textarea") ? a : a.querySelector("input, textarea");
  }
  function p(a, b) {
    const v = a.childNodes;
    for (let w = 0; w < v.length; w++) {
      const A = v[w];
      if (A.nodeType === 3) {
        b.push(A.nodeValue);
        continue;
      }
      A.nodeType === 1 && (A.hasAttribute(c) || p(A, b));
    }
  }
  function _(a) {
    if (a._lnSearchText !== void 0) return a._lnSearchText;
    const b = [];
    p(a, b);
    const v = Hn(b);
    return a._lnSearchText = v, v;
  }
  function g(a, b) {
    if (!a.id) return;
    const v = document.querySelectorAll("[" + u + '="' + a.id + '"]');
    for (const w of v) {
      const A = y(w);
      A && A.value !== b && (A.value = b);
    }
  }
  function i(a) {
    this.dom = a, this.term = a.getAttribute(e) || "", this._destroyed = !1;
    const b = this;
    return this.nsKey = f(a), this.hashEnabled = !!this.nsKey, this._onHashChange = function() {
      if (b._destroyed || !b.hashEnabled) return;
      const v = X(b.nsKey), w = b.dom.getAttribute(e) || "";
      v !== null && v !== w ? b.dom.setAttribute(e, v) : v === null && w !== "" && b.dom.setAttribute(e, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), ot(function() {
      if (!b._destroyed) {
        if (b.hashEnabled) {
          const v = X(b.nsKey);
          if (v !== null && v !== b.term) {
            b.term = v, b.dom.setAttribute(e, v), g(b.dom, v), b._apply();
            return;
          }
        }
        ne(b.term) && (g(b.dom, b.term), b._apply());
      }
    }), this;
  }
  i.prototype._apply = function() {
    const a = this.dom, b = ne(this.term), v = Je(b);
    this.hashEnabled && et(this.nsKey, this.term ? this.term : null);
    const w = Pn(a.getAttribute(h));
    if (W(a, "ln-search:change", {
      term: b,
      tokens: v,
      targetId: a.id,
      fields: w
    }).defaultPrevented) return;
    const C = a.getAttribute(l), L = C ? a.querySelectorAll(C) : a.children;
    for (let q = 0; q < L.length; q++) {
      const x = L[q];
      if (x.removeAttribute(r), x.hasAttribute(c) || v.length === 0) continue;
      const D = _(x);
      Ze(D, v) || x.setAttribute(r, "true");
    }
  }, i.prototype.destroy = function() {
    this.dom[n] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[n]);
  };
  function s(a) {
    if (this.dom = a, this.targetId = a.getAttribute(u), this.input = y(a), this._attachHandler(), this.input && this.input.value.trim()) {
      const b = this;
      ot(function() {
        const v = document.getElementById(b.targetId);
        v && ((v.getAttribute(e) || "").trim() || b._write(b.input.value));
      });
    }
    return this;
  }
  s.prototype._write = function(a) {
    const b = document.getElementById(this.targetId);
    b && b.getAttribute(e) !== a && b.setAttribute(e, a);
  }, s.prototype._attachHandler = function() {
    if (!this.input) return;
    const a = this;
    this._onInput = function() {
      a._write(a.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, s.prototype.destroy = function() {
    this.dom[m] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[m]);
  };
  function t(a) {
    const b = a.getAttribute("data-ln-search-clear-for");
    if (b) {
      const L = document.getElementById(b), q = document.querySelector("[" + u + '="' + b + '"]'), x = q ? y(q) : null;
      return { target: L, input: x };
    }
    const v = a.closest("[" + e + "]");
    if (v) {
      const L = v.id ? document.querySelector("[" + u + '="' + v.id + '"]') : null, q = L ? y(L) : null;
      return { target: v, input: q };
    }
    const w = a.closest("[data-ln-table-source], [data-ln-list-source]");
    if (w) {
      const L = w.getAttribute("data-ln-table-source") || w.getAttribute("data-ln-list-source"), q = L ? document.getElementById(L) : null;
      if (q && q.hasAttribute(e)) {
        const x = document.querySelector("[" + u + '="' + L + '"]'), D = x ? y(x) : null;
        return { target: q, input: D };
      }
    }
    const A = a.closest("[" + u + "]");
    if (A) {
      const L = A.getAttribute(u), q = L ? document.getElementById(L) : null, x = y(A);
      return { target: q, input: x };
    }
    const C = a.parentElement;
    if (C) {
      const L = C.querySelector("[" + u + "]");
      if (L) {
        const q = L.getAttribute(u), x = q ? document.getElementById(q) : null, D = y(L);
        return { target: x, input: D };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(a) {
    const b = a.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!b) return;
    const v = t(b);
    !v.target && !v.input || (a.preventDefault(), v.input && (v.input.value = "", v.input.focus()), v.target && v.target.setAttribute(e, ""));
  });
  function o(a, b) {
    const v = a[n];
    if (!v || v._destroyed) return;
    if (b === d) {
      v._onHashChange && window.removeEventListener("hashchange", v._onHashChange), v.nsKey = f(a), v.hashEnabled = !!v.nsKey, v.hashEnabled && window.addEventListener("hashchange", v._onHashChange);
      return;
    }
    const w = a.getAttribute(e) || "";
    w !== v.term && (v.term = w, g(a, w), v._apply());
  }
  M(e, n, i, "ln-search", {
    extraAttributes: [d],
    onAttributeChange: o,
    onSubtreeChange: function(a, b) {
      const v = b.target;
      v && v._lnSearchText !== void 0 && delete v._lnSearchText, v && v.parentElement && v.parentElement._lnSearchText !== void 0 && delete v.parentElement._lnSearchText;
    }
  }), M(u, m, s, "ln-search-control");
})();
function ht(e) {
  const n = String(e || "").trim().toLowerCase();
  return n === "asc" || n === "ascending" ? "asc" : n === "desc" || n === "descending" ? "desc" : "none";
}
function _i(e) {
  const n = ht(e);
  return n === "asc" ? "ascending" : n === "desc" ? "descending" : "none";
}
function bi(e, n) {
  return !e || !n ? !1 : e.field !== null && e.field !== void 0 && n.field !== null && n.field !== void 0 ? e.field === n.field : e.column !== null && e.column !== void 0 && n.column !== null && n.column !== void 0 ? String(e.column) === String(n.column) : !1;
}
function yi(e, n, u, m) {
  const l = ht(e);
  if (l === "none") return () => 0;
  const h = l === "desc" ? -1 : 1, c = typeof m == "function" ? m : (r) => r;
  return function(r, d) {
    const f = c(r), y = c(d);
    return ce(f, y, n, u) * h;
  };
}
(function() {
  const e = "data-ln-sort", n = "lnSort", u = "data-ln-sort-field", m = "data-ln-sort-state", l = "data-ln-sort-dir", h = "data-ln-sort-items", c = "data-ln-hash";
  if (window[n] !== void 0) return;
  const r = /* @__PURE__ */ new WeakMap();
  function d(p, _) {
    if (_) {
      const g = p.querySelector('[data-ln-field="' + _ + '"]');
      if (g) return At(g);
    }
    return At(p);
  }
  function f(p) {
    this.dom = p, this.targetId = p.getAttribute(e), this.field = p.getAttribute(u) || null;
    const _ = p.closest("th");
    this.column = !this.field && _ ? _.cellIndex : null, this.itemsSelector = p.getAttribute(h) || null, this._state = ht(p.getAttribute(m)), this._destroyed = !1, this.nsKey = yt(p, "sort"), this.hashEnabled = !!this.nsKey;
    const g = this;
    this._onClick = function(s) {
      const t = s.target.closest("[" + l + "]");
      if (!t) return;
      const o = ht(t.getAttribute(l));
      g._apply(o);
    }, p.addEventListener("click", this._onClick), this._onSortChange = function(s) {
      if (g._destroyed || !s.detail) return;
      const t = g._resolveTarget();
      if (!(t && (s.target === t || t.contains(s.target)) || s.detail.targetId && s.detail.targetId === g.targetId)) return;
      if (bi(
        { field: g.field, column: g.column },
        { field: s.detail.field, column: s.detail.column }
      )) {
        const b = ht(s.detail.direction);
        b && p.getAttribute(m) !== b && (g._state = b, p.setAttribute(m, b), g._updateAriaSort(b));
        return;
      }
      p.getAttribute(m) !== "none" && (g._state = "none", p.setAttribute(m, "none"), g._updateAriaSort("none")), p.hasAttribute("data-ln-persist") && bt("sort", p, null);
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (g._destroyed || !g.hashEnabled) return;
      const s = X(g.nsKey), t = Zt(s);
      if (t)
        g.field !== null && t.fieldOrColumn === g.field || g.column !== null && String(g.column) === t.fieldOrColumn ? g._state !== t.direction && g._apply(t.direction, !0) : g._state !== "none" && (g._state = "none", p.setAttribute(m, "none"), g._updateAriaSort("none"));
      else if (g._state !== "none") {
        g._state = "none", p.setAttribute(m, "none"), g._updateAriaSort("none");
        const o = g._resolveTarget();
        o && (W(o, "ln-sort:change", {
          field: g.field,
          column: g.column,
          direction: "none",
          targetId: g.targetId
        }).defaultPrevented || g._defaultSort(o, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let i = !1;
    if (this.hashEnabled) {
      const s = X(this.nsKey), t = Zt(s);
      t && ((g.field !== null && t.fieldOrColumn === g.field || g.column !== null && String(g.column) === t.fieldOrColumn) && ot(function() {
        g._destroyed || g._apply(t.direction, !0);
      }), i = !0);
    }
    if (!i && p.hasAttribute("data-ln-persist")) {
      const s = jt("sort", p);
      s && s.direction && s.direction !== "none" && ot(function() {
        g._destroyed || g._apply(s.direction, !0);
      }), i = !0;
    }
    if (!i) {
      const s = ht(p.getAttribute(m));
      s && s !== "none" && ot(function() {
        g._destroyed || g._apply(s, !0);
      });
    }
    return this;
  }
  f.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, f.prototype._updateAriaSort = function(p) {
    const _ = this.dom.closest("th");
    _ && _.setAttribute("aria-sort", _i(p));
  }, f.prototype._apply = function(p, _) {
    if (this._destroyed) return;
    const g = ht(p);
    this._state = g, this.dom.getAttribute(m) !== g && this.dom.setAttribute(m, g), this._updateAriaSort(g);
    const i = this._resolveTarget();
    if (!i) return;
    const s = {
      field: this.field,
      column: this.column,
      direction: g,
      targetId: this.targetId
    };
    if (!_ && (this.dom.hasAttribute("data-ln-persist") && bt("sort", this.dom, g === "none" ? null : s), this.hashEnabled)) {
      const o = Qe(this.field !== null ? this.field : this.column, g);
      et(this.nsKey, o);
    }
    W(i, "ln-sort:change", s).defaultPrevented || this._defaultSort(i, g);
  }, f.prototype._defaultSort = function(p, _) {
    const g = this.itemsSelector ? Array.from(p.querySelectorAll(this.itemsSelector)) : Array.from(p.children);
    if (!g.length) return;
    const i = g[0].parentNode;
    r.has(p) || r.set(p, g.slice());
    let s;
    if (_ === "none")
      s = (r.get(p) || g).filter(function(a) {
        return a.parentNode === i;
      });
    else {
      const o = this.field, a = g.map(function(A) {
        return d(A, o);
      }), b = le(a), v = typeof Intl < "u" ? new Intl.Collator(V(this.dom), { sensitivity: "base" }) : null, w = yi(_, b, v, function(A) {
        return d(A, o);
      });
      s = g.slice().sort(w);
    }
    const t = document.createDocumentFragment();
    for (let o = 0; o < s.length; o++) t.appendChild(s[o]);
    i.appendChild(t);
  }, f.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[n]);
  };
  function y(p, _) {
    const g = p[n];
    if (!(!g || g._destroyed))
      if (_ === u) {
        g.field = p.getAttribute(u) || null;
        const i = p.closest("th");
        g.column = !g.field && i ? i.cellIndex : null;
      } else if (_ === h)
        g.itemsSelector = p.getAttribute(h) || null;
      else if (_ === m) {
        const i = ht(p.getAttribute(m));
        i !== g._state && g._apply(i);
      } else _ === e ? g.targetId = p.getAttribute(e) : _ === c && (g.hashEnabled && g._onHashChange && window.removeEventListener("hashchange", g._onHashChange), g.nsKey = yt(p, "sort"), g.hashEnabled = !!g.nsKey, g.hashEnabled && window.addEventListener("hashchange", g._onHashChange));
  }
  M(e, n, f, "ln-sort", {
    extraAttributes: [u, h, m, c],
    onAttributeChange: y
  });
})();
function Te(e, n, u, m, l = 15) {
  if (m <= 0 || u <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const h = Math.max(0, e || 0), c = Math.max(0, n || 0), r = Math.floor(h / u), d = Math.ceil(c / u), f = Math.max(0, r - l), y = Math.min(m, r + d + l), p = f * u, _ = Math.max(0, (m - y) * u);
  return { start: f, end: y, topPadding: p, bottomPadding: _ };
}
function vi(e, n) {
  const u = Array.isArray(e) ? e.length : 0, m = n instanceof Set ? n : new Set(n || []);
  let l = 0;
  if (Array.isArray(e))
    for (let r = 0; r < e.length; r++)
      m.has(e[r]) && l++;
  else
    l = m.size;
  const h = u > 0 && l === u, c = l > 0 && l < u;
  return { totalCount: u, selectedCount: l, isAllSelected: h, isIndeterminate: c };
}
function qe(e, n, u) {
  const m = new Set(e);
  return n == null || ((u !== void 0 ? u : !m.has(n)) ? m.add(n) : m.delete(n)), m;
}
function xe(e, n, u) {
  const m = new Set(e);
  if (!Array.isArray(n)) return m;
  if (u)
    for (let l = 0; l < n.length; l++)
      n[l] != null && m.add(n[l]);
  else
    for (let l = 0; l < n.length; l++)
      m.delete(n[l]);
  return m;
}
(function() {
  const e = "data-ln-table", n = "lnTable", u = "data-ln-table-empty";
  if (window[n] !== void 0) return;
  typeof Intl < "u" && new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" });
  function d(p, _) {
    if (p == null || isNaN(p)) return "";
    try {
      return new Intl.NumberFormat(V(_)).format(p);
    } catch {
      return String(p);
    }
  }
  function f(p) {
    let _ = p.parentElement;
    for (; _ && _ !== document.body && _ !== document.documentElement; ) {
      const i = getComputedStyle(_).overflowY;
      if (i === "auto" || i === "scroll") return _;
      _ = _.parentElement;
    }
    return null;
  }
  function y(p) {
    this.dom = p, this.table = p.querySelector("table"), this.tbody = p.querySelector("[data-ln-table-body]") || p.querySelector("tbody"), this.thead = p.querySelector("thead");
    const _ = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = _ ? Array.from(_.querySelectorAll("th")) : [], this._totalSpan = p.querySelector("[data-ln-table-total]"), this._filteredSpan = p.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== p ? this._filteredSpan.parentElement : null), this._selectedSpan = p.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== p ? this._selectedSpan.parentElement : null), this.isDataDriven = p.hasAttribute("data-ln-table-source"), this.name = p.getAttribute(e) || "", this.source = p.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const g = this;
    return this._onSetSearch = function(i) {
      const s = (i.detail && i.detail.query != null ? i.detail.query : i.detail && i.detail.term != null ? i.detail.term : "").trim();
      g.isDataDriven ? (g.currentSearch = s, S(p, "ln-table:search", {
        table: g.name,
        query: g.currentSearch
      }), g._requestData()) : (g._searchTerm = s.toLowerCase(), g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), S(p, "ln-table:filter", {
        term: g._searchTerm,
        matched: g._filteredData.length,
        total: g._data.length
      }));
    }, p.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(i) {
      i.preventDefault(), g._onSetSearch(i);
    }, p.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      g.isDataDriven ? (g.currentFilters = {}, g.currentSearch = "", S(p, "ln-table:clear-filters", { table: g.name }), g._requestData()) : (g._searchTerm = "", g._columnFilters = {}, g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), S(p, "ln-table:filter", {
        term: "",
        matched: g._filteredData.length,
        total: g._data.length
      }));
    }, p.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectable = p.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && p.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(i) {
      const s = i.detail || {}, t = s.data || [], o = s.total != null ? s.total : t.length;
      if (!(g._hasInitialSeed && !g.isLoaded && t.length === 0 && o === 0)) {
        if (g._windowed) {
          g._cache.ingest(s) && !s.provisional && p.classList.remove("ln-table--loading");
          return;
        }
        g._data = t, g._lastTotal = o, g._lastFiltered = s.filtered != null ? s.filtered : g._data.length, g.totalCount = g._lastTotal, g.visibleCount = g._lastFiltered, g.isLoaded = !0, g._hasInitialSeed = !1, p.classList.remove("ln-table--loading"), g._vStart = -1, g._vEnd = -1, g._applyFilterAndSort(), g._render(), g._updateFooter(), S(p, "ln-table:rendered", {
          table: g.name,
          total: g.totalCount,
          visible: g.visibleCount
        });
      }
    }, p.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(i) {
      const s = i.detail && i.detail.loading;
      p.classList.toggle("ln-table--loading", !!s), s && (g.isLoaded = !1);
    }, p.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(i) {
      !g._windowed || !g._cache || g._cache.release(i.detail && i.detail.offset);
    }, p.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !g._windowed || !g._cache || g._cache.revalidate();
    }, p.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !g._windowed || !g._cache || g._requestData();
    }, p.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(i) {
      i.preventDefault(), g.currentSort = i.detail.direction === "none" ? null : { field: i.detail.field, direction: i.detail.direction }, g._requestData();
    }, p.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(i) {
      if (i.target.closest("[data-ln-table-row-select]") || i.target.closest("[data-ln-table-row-action]") || i.target.closest("a") || i.target.closest("button") || i.ctrlKey || i.metaKey || i.button === 1) return;
      const s = i.target.closest("[data-ln-table-row]");
      if (!s) return;
      const t = s.getAttribute("data-ln-table-row-id"), o = s._lnRecord || {};
      S(p, "ln-table:row-click", {
        table: g.name,
        id: t,
        record: o
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(i) {
      const s = i.target.closest("[data-ln-table-row-action]");
      if (!s) return;
      i.stopPropagation();
      const t = s.closest("[data-ln-table-row]");
      if (!t) return;
      const o = s.getAttribute("data-ln-table-row-action"), a = t.getAttribute("data-ln-table-row-id"), b = t._lnRecord || {};
      S(p, "ln-table:row-action", {
        table: g.name,
        id: a,
        action: o,
        record: b
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : S(p, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      g.tbody.rows.length > 0 && (g._emptyTbodyObserver.disconnect(), g._emptyTbodyObserver = null, g._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(i) {
      i.preventDefault();
      const s = i.detail.direction === "none" ? null : i.detail.direction;
      g._sortCol = s === null ? -1 : i.detail.column, g._sortDir = s, g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), S(p, "ln-table:sorted", {
        column: i.detail.column,
        direction: i.detail.direction,
        matched: g._filteredData.length,
        total: g._data.length
      });
    }, p.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(i) {
      if (i.preventDefault(), !i.detail) return;
      const s = i.detail.key, t = i.detail.values || [];
      if (s) {
        if (t.length === 0)
          delete g._columnFilters[s];
        else {
          const o = [];
          for (let a = 0; a < t.length; a++)
            o.push(t[a].toLowerCase());
          g._columnFilters[s] = o;
        }
        g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), S(p, "ln-table:filter", {
          term: g._searchTerm,
          matched: g._filteredData.length,
          total: g._data.length
        });
      }
    }, p.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  y.prototype._parseRows = function() {
    const p = this.tbody.rows, _ = this.ths;
    this._data = [], p.length > 0 && (this._rowHeight = p[0].offsetHeight || 40), this._lockColumnWidths();
    for (let g = 0; g < p.length; g++) {
      const i = p[g], s = [], t = [], o = [];
      for (let b = 0; b < i.cells.length; b++) {
        const v = i.cells[b], w = v.textContent.trim();
        s[b] = At(v), t[b] = w.toLowerCase(), v.querySelector("[data-ln-table-row-action]") || o.push(w.toLowerCase());
      }
      let a = null;
      if (this.isDataDriven) {
        a = {};
        const b = i.getAttribute("data-ln-table-row-id");
        b != null && (a.id = b);
        for (let v = 0; v < _.length; v++) {
          const w = _[v].getAttribute("data-ln-table-col");
          if (w) {
            const A = v;
            if (A < i.cells.length) {
              const C = i.cells[A];
              a[w] = At(C);
            }
          }
        }
      }
      this._data.push({
        values: s,
        rawTexts: t,
        html: i.outerHTML,
        searchText: o.join(" "),
        id: this.isDataDriven && a ? a.id : void 0,
        ...a
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, y.prototype._applyFilterAndSort = function() {
    this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
  }, y.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const p = document.createElement("colgroup");
    this.ths.forEach(function(_) {
      const g = document.createElement("col");
      g.style.width = _.offsetWidth + "px", p.appendChild(g);
    }), this.table.insertBefore(p, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = p;
  }, y.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const p = this._lastTotal, _ = this.visibleCount;
        if (p === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || _ === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const p = this._filteredData.length;
        p === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : p > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, y.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const p = this._filteredData, _ = document.createDocumentFragment();
      for (let g = 0; g < p.length; g++) {
        const i = this._buildRow(p[g]);
        if (!i) break;
        _.appendChild(i);
      }
      this.tbody.replaceChildren(_), this._selectable && this._updateSelectAll();
    } else {
      const p = [], _ = this._filteredData;
      for (let g = 0; g < _.length; g++) p.push(_[g].html);
      this.tbody.innerHTML = p.join(""), this._selectable && this._restoreSelection();
    }
  }, y.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const p = this;
    if (!this._rowHeight)
      if (this.tbody && this.tbody.rows.length > 0)
        this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
      else {
        let g = null;
        if (this._windowed) {
          const i = this._cache ? this._cache.peek() : null;
          g = i ? this._buildRow(i) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (g = this._buildRow(this._data[0]));
        g && this.tbody && (this.tbody.appendChild(g), this._rowHeight = g.offsetHeight || 40, g.remove());
      }
    this.isDataDriven ? this._scrollContainer = f(this.dom) : this._scrollContainer = null;
    const _ = this._scrollContainer || window;
    this._scrollHandler = function() {
      p._rafId || (p._rafId = requestAnimationFrame(function() {
        p._rafId = null, p._windowed ? p._renderWindowed() : p._renderVirtual();
      }));
    }, _.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, y.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, y.prototype._renderVirtual = function() {
    const p = this._filteredData, _ = p.length, g = this._rowHeight;
    if (!g || !_) return;
    const i = this.thead ? this.thead.offsetHeight : 0, s = this._scrollContainer;
    let t, o;
    if (s) {
      const L = this.table.getBoundingClientRect(), q = s.getBoundingClientRect(), x = L.top - q.top + s.scrollTop + i;
      t = s.scrollTop - x, o = s.clientHeight;
    } else {
      const x = this.table.getBoundingClientRect().top + window.scrollY + i;
      t = window.scrollY - x, o = window.innerHeight;
    }
    const a = Te(t, o, g, _, 15), b = a.start, v = a.end;
    if (b === this._vStart && v === this._vEnd) return;
    this._vStart = b, this._vEnd = v;
    const w = this.ths.length || 1, A = a.topPadding, C = a.bottomPadding;
    if (this.isDataDriven) {
      const L = document.createDocumentFragment();
      if (A > 0) {
        const q = document.createElement("tr");
        q.className = "ln-table__spacer", q.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", w), x.style.height = A + "px", q.appendChild(x), L.appendChild(q);
      }
      for (let q = b; q < v; q++) {
        const x = this._buildRow(p[q]);
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
      for (let q = b; q < v; q++) L += p[q].html;
      C > 0 && (L += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + w + '" style="height:' + C + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = L, this._selectable && this._restoreSelection();
    }
  }, y.prototype._buildPlaceholderRow = function() {
    const p = document.createElement("tr");
    p.className = "ln-table__placeholder", p.setAttribute("aria-hidden", "true");
    const _ = document.createElement("td");
    return _.setAttribute("colspan", this.ths.length || 1), _.style.height = this._rowHeight + "px", p.appendChild(_), p;
  }, y.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const p = this._rowHeight;
    if (!p) return;
    const _ = this._cache.logicalTotal, g = this.thead ? this.thead.offsetHeight : 0, i = this._scrollContainer;
    let s, t;
    if (i) {
      const L = this.table.getBoundingClientRect(), q = i.getBoundingClientRect(), x = L.top - q.top + i.scrollTop + g;
      s = i.scrollTop - x, t = i.clientHeight;
    } else {
      const x = this.table.getBoundingClientRect().top + window.scrollY + g;
      s = window.scrollY - x, t = window.innerHeight;
    }
    const o = Te(s, t, p, _, 15), a = o.start, b = o.end, v = this.ths.length || 1, w = o.topPadding, A = o.bottomPadding, C = document.createDocumentFragment();
    if (w > 0) {
      const L = document.createElement("tr");
      L.className = "ln-table__spacer", L.setAttribute("aria-hidden", "true");
      const q = document.createElement("td");
      q.setAttribute("colspan", v), q.style.height = w + "px", L.appendChild(q), C.appendChild(L);
    }
    for (let L = a; L < b; L++)
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
    this.tbody.replaceChildren(C), this._vStart = a, this._vEnd = b, this._cache.ensure(a, b);
  }, y.prototype._showEmptyState = function() {
    const p = this.ths.length || 1;
    let _ = null, g = null;
    if (this.isDataDriven) {
      const i = this._lastTotal != null ? this._lastTotal : this._data.length, t = this.visibleCount === 0 && i > 0, o = t ? this.name + "-empty-filtered" : this.name + "-empty";
      if (g = pt(this.dom, o, "ln-table"), !g) {
        const a = this.dom.querySelector("template[data-ln-table-empty]");
        if (a) {
          const b = t ? "search" : "initial", v = a.content.querySelector('[data-ln-table-empty-when="' + b + '"]') || a.content.firstElementChild;
          v && (g = document.importNode(v, !0));
        }
      }
      if (g)
        if (g.tagName === "TR")
          _ = g;
        else {
          const a = document.createElement("td");
          a.setAttribute("colspan", String(p)), a.appendChild(g);
          const b = document.createElement("tr");
          b.className = "ln-table__empty", b.appendChild(a), _ = b;
        }
    } else {
      const i = this.dom.querySelector("template[" + u + "]"), s = document.createElement("td");
      s.setAttribute("colspan", String(p)), i && s.appendChild(document.importNode(i.content, !0));
      const t = document.createElement("tr");
      t.className = "ln-table__empty", t.appendChild(s), _ = t;
    }
    _ ? this.tbody.replaceChildren(_) : this.tbody.replaceChildren(), S(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, y.prototype._fillRow = function(p, _) {
    It(p, _);
    const g = p.querySelectorAll("[data-ln-table-cell-attr]");
    for (let i = 0; i < g.length; i++) {
      const s = g[i], t = s.getAttribute("data-ln-table-cell-attr").split(",");
      for (let o = 0; o < t.length; o++) {
        const a = t[o].trim().split(":");
        if (a.length !== 2) continue;
        const b = a[0].trim(), v = a[1].trim();
        _[b] != null && s.setAttribute(v, _[b]);
      }
    }
  }, y.prototype._buildRow = function(p) {
    let _ = pt(this.dom, this.name + "-row", "ln-table");
    if (!_) {
      const i = this.dom.querySelector("template[data-ln-table-row]");
      i && (_ = document.importNode(i.content, !0));
    }
    let g = _ ? _.querySelector("[data-ln-table-row]") || _.firstElementChild : null;
    if (g)
      this._fillRow(g, p);
    else if (p && p.html) {
      const i = document.createElement("tbody");
      i.innerHTML = p.html, g = i.firstElementChild;
    } else {
      g = document.createElement("tr"), g.setAttribute("data-ln-table-row", "");
      const i = this.ths;
      for (let s = 0; s < i.length; s++) {
        const t = i[s].hasAttribute("data-ln-table-col-select"), o = document.createElement("td");
        if (t) {
          const a = document.createElement("input");
          a.type = "checkbox", a.setAttribute("data-ln-table-row-select", ""), a.setAttribute("aria-label", "Select row"), o.appendChild(a);
        } else {
          const a = i[s].getAttribute("data-ln-table-col");
          a && p[a] != null && (o.textContent = String(p[a]));
        }
        g.appendChild(o);
      }
    }
    if (g._lnRecord = p, p.id != null && g.setAttribute("data-ln-table-row-id", p.id), this._selectable && p.id != null && this.selectedIds.has(String(p.id))) {
      g.classList.add("ln-row-selected");
      const i = g.querySelector("[data-ln-table-row-select]");
      i && (i.checked = !0);
    }
    return g;
  }, y.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Oe(this, "ln-table:request-data", "table");
  }, y.prototype._enterWindowedMode = function() {
    const p = this, _ = this.dom, g = parseInt(_.getAttribute("data-ln-table-window"), 10), i = parseInt(_.getAttribute("data-ln-table-window-page"), 10), s = parseInt(_.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !p._windowed || !p._cache || (p.totalCount = p._cache.grandTotal, p.visibleCount = p._cache.logicalTotal, p._lastTotal = p._cache.grandTotal, p.isLoaded = !0, p._vStart = -1, p._vEnd = -1, p._render(), p._updateFooter(), S(_, "ln-table:rendered", {
        table: p.name,
        total: p.totalCount,
        visible: p.visibleCount
      }));
    }, this._renderBatch = ue(this._onCacheChange), this._cache = je({
      windowSize: g > 0 ? g : 1e3,
      pageSize: i > 0 ? i : 200,
      threshold: s >= 0 ? s : 25,
      fetchDebounce: 120,
      requestPage: function(t, o, a) {
        S(_, "ln-table:request-data", {
          table: p.name,
          sort: t.sort,
          filters: t.filters,
          search: t.search,
          offset: o,
          limit: a,
          queryGen: p._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, y.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let p = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(p) && this._totalSpan) {
        const g = this._totalSpan.textContent.replace(/[^\d]/g, "");
        g && (p = parseInt(g, 10));
      }
      const _ = p > 0 ? p : this._data.length;
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
  }, y.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, y.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const p = this.tbody.querySelectorAll("[data-ln-table-row]"), _ = [];
    for (let i = 0; i < p.length; i++) {
      const s = p[i].getAttribute("data-ln-table-row-id");
      s != null && _.push(s);
    }
    const g = vi(_, this.selectedIds);
    this._selectAllCheckbox.checked = g.isAllSelected, this._selectAllCheckbox.indeterminate = g.isIndeterminate;
  }, y.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const p = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let _ = 0; _ < p.length; _++) {
      const g = p[_].getAttribute("data-ln-table-row-id"), i = g != null && this.selectedIds.has(g);
      p[_].classList.toggle("ln-row-selected", i);
      const s = p[_].querySelector("[data-ln-table-row-select]");
      s && (s.checked = i);
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
    const p = this;
    if (this._onSelectionChange = function(_) {
      const g = _.target.closest("[data-ln-table-row-select]");
      if (!g) return;
      const i = g.closest("[data-ln-table-row]");
      if (!i) return;
      const s = i.getAttribute("data-ln-table-row-id");
      s != null && (p.selectedIds = qe(p.selectedIds, s, g.checked), i.classList.toggle("ln-row-selected", g.checked), p.selectedCount = p.selectedIds.size, p._updateSelectAll(), p._updateFooter(), S(p.dom, "ln-table:select", {
        table: p.name,
        selectedIds: p.selectedIds,
        count: p.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const _ = document.createElement("input");
      _.type = "checkbox";
      const g = p.dom.querySelector('[data-ln-table-dict="select-all"]'), i = p.dom.getAttribute("data-ln-table-select-all-label") || (g ? g.textContent.trim() : null) || "Select all";
      _.setAttribute("aria-label", i), this._selectAllCheckbox.appendChild(_), this._selectAllCheckbox = _;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const _ = p._selectAllCheckbox.checked, g = p.tbody ? p.tbody.querySelectorAll("[data-ln-table-row]") : [], i = [];
      for (let s = 0; s < g.length; s++) {
        const t = g[s].getAttribute("data-ln-table-row-id"), o = g[s].querySelector("[data-ln-table-row-select]");
        t != null && (i.push(t), g[s].classList.toggle("ln-row-selected", _), o && (o.checked = _));
      }
      p.selectedIds = xe(p.selectedIds, i, _), p.selectedCount = p.selectedIds.size, S(p.dom, "ln-table:select-all", {
        table: p.name,
        selected: _
      }), S(p.dom, "ln-table:select", {
        table: p.name,
        selectedIds: p.selectedIds,
        count: p.selectedCount
      }), p._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const _ = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let g = 0; g < _.length; g++) {
        const i = _[g].querySelector("[data-ln-table-row-select]"), s = _[g].getAttribute("data-ln-table-row-id");
        i && i.checked && s != null && (p.selectedIds = qe(p.selectedIds, s, !0), _[g].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, y.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const p = this.dom.querySelector("[data-ln-table-col-select]");
    if (p) {
      const _ = p.querySelector('input[type="checkbox"]');
      _ && _.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = xe(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const _ = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let g = 0; g < _.length; g++) {
        _[g].classList.remove("ln-row-selected");
        const i = _[g].querySelector("[data-ln-table-row-select]");
        i && (i.checked = !1);
      }
    }
    this._updateFooter();
  }, y.prototype._updateFooter = function() {
    let p = 0, _ = 0;
    this.isDataDriven ? (p = this._lastTotal != null ? this._lastTotal : this._data.length, _ = this.visibleCount) : (p = this._data.length, _ = this._filteredData.length);
    const g = _ < p;
    if (this._totalSpan && (this._totalSpan.textContent = d(p, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = g ? d(_, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !g), this._selectedSpan) {
      const i = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = i > 0 ? d(i, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", i === 0);
    }
  }, y.prototype.destroy = function() {
    this.dom[n] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[n]);
  }, M(e, n, y, "ln-table", {
    extraAttributes: [
      "data-ln-table-window",
      "data-ln-table-window-page",
      "data-ln-table-window-threshold",
      "data-ln-table-count"
    ],
    onAttributeChange: function(p, _) {
      const g = p[n];
      if (!(!g || !g.isDataDriven)) {
        if (_ === "data-ln-table-window") {
          const i = p.hasAttribute("data-ln-table-window");
          if (i && !g._windowed)
            g._enterWindowedMode(), g._kickWindowInitial();
          else if (!i && g._windowed)
            g._exitWindowedMode();
          else if (i && g._windowed) {
            const s = parseInt(p.getAttribute("data-ln-table-window"), 10);
            s > 0 && g._cache.configure({ windowSize: s });
          }
          return;
        }
        if (!(!g._windowed || !g._cache)) {
          if (_ === "data-ln-table-window-page") {
            const i = parseInt(p.getAttribute("data-ln-table-window-page"), 10);
            i > 0 && g._cache.configure({ pageSize: i });
          } else if (_ === "data-ln-table-window-threshold") {
            const i = parseInt(p.getAttribute("data-ln-table-window-threshold"), 10);
            i >= 0 && g._cache.configure({ threshold: i });
          } else if (_ === "data-ln-table-count") {
            const i = parseInt(p.getAttribute("data-ln-table-count"), 10);
            i >= 0 && g._cache.setGrandTotal(i);
          }
        }
      }
    }
  });
})();
(function() {
  const e = "data-ln-table-coordinator", n = "lnTableCoordinator";
  if (window[n] !== void 0) return;
  document.addEventListener("keydown", function(c) {
    if (c.key !== "/" || c.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const r = document.querySelector("[" + e + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!r) return;
    const d = r.tagName === "INPUT" || r.tagName === "TEXTAREA" ? r : r.querySelector('input[type="search"], input[type="text"], input');
    d && (c.preventDefault(), d.focus());
  });
  function u(c) {
    return this.dom = c, h(this), this;
  }
  function m(c, r) {
    const d = r ? '[data-ln-search-for="' + r + '"]' : "[data-ln-search-for]", f = c.querySelector(d) || document.querySelector(d);
    return f ? f.tagName === "INPUT" || f.tagName === "TEXTAREA" ? f : f.querySelector("input, textarea") : null;
  }
  function l(c, r) {
    if (r) {
      const f = c.querySelectorAll('[data-ln-filter="' + r + '"]');
      if (f.length > 0) return f;
      const y = document.querySelectorAll('[data-ln-filter="' + r + '"]');
      if (y.length > 0) return y;
    }
    const d = c.querySelectorAll("[data-ln-filter]");
    return d.length > 0 ? d : document.querySelectorAll("[data-ln-filter]");
  }
  function h(c) {
    const r = c.dom;
    function d(f) {
      const y = f.target;
      if (y && y.hasAttribute && y.hasAttribute("data-ln-table")) return y;
      const p = f.detail && f.detail.targetId || y && y.id;
      return p ? r.querySelector('[data-ln-table-source="' + p + '"]') || r.querySelector('[data-ln-table="' + p + '"]') : null;
    }
    c._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(f) {
        if (!f.detail) return;
        const y = d(f);
        if (!y || !y.hasAttribute || !y.hasAttribute("data-ln-table")) return;
        const p = f.detail.key, _ = f.detail.values || [], g = y.querySelectorAll("th");
        for (let i = 0; i < g.length; i++)
          if (g[i].getAttribute("data-ln-table-filter-col") === p) {
            const s = g[i].querySelector("[data-ln-table-col-filter]");
            s && s.classList.toggle("ln-filter-active", _.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(f) {
        const y = f.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!y) return;
        const p = y.closest("[data-ln-table]") || r.querySelector("[data-ln-table]");
        if (!p || !p.lnTable) return;
        const _ = p.lnTable.name || p.id, g = p.querySelectorAll("th");
        for (let o = 0; o < g.length; o++) {
          const a = g[o].querySelector("[data-ln-table-col-filter]");
          a && a.classList.remove("ln-filter-active");
        }
        const i = p.getAttribute("data-ln-table-source") || p.id, s = i ? document.getElementById(i) : null;
        if (s && s.hasAttribute("data-ln-search"))
          s.setAttribute("data-ln-search", "");
        else {
          const o = m(r, i);
          o && o.value !== "" && (o.value = "", o.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const t = l(r, i);
        for (let o = 0; o < t.length; o++) {
          const a = t[o].querySelector("[data-ln-filter-reset]");
          if (!a) continue;
          const b = t[o].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!a.checked || b) && (a.checked = !0, a.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        p.hasAttribute("data-ln-table-source") || S(p, "ln-table:request-clear-filters", { table: _ });
      }
    }, r.addEventListener("ln-filter:change", c._handlers.filter), r.addEventListener("click", c._handlers.clear);
  }
  u.prototype.destroy = function() {
    this.dom[n] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[n]);
  }, M(e, n, u, "ln-table-coordinator");
})();
(function() {
  const e = "data-ln-list", n = "lnList", u = "data-ln-list-empty";
  if (window[n] !== void 0) return;
  function d(i, s) {
    if (i == null || isNaN(i)) return "";
    try {
      return new Intl.NumberFormat(V(s)).format(i);
    } catch {
      return String(i);
    }
  }
  function f(i) {
    let s = i;
    for (; s && s !== document.body && s !== document.documentElement; ) {
      const o = getComputedStyle(s).overflowY;
      if (o === "auto" || o === "scroll") return s;
      s = s.parentElement;
    }
    return null;
  }
  function y(i) {
    const s = i._scrollContainer || f(i.dom);
    return {
      container: s,
      top: s ? s.scrollTop : window.scrollY
    };
  }
  function p(i) {
    i.container ? i.container.scrollTop = i.top : window.scrollTo(window.scrollX, i.top);
  }
  function _(i) {
    if (!i) return 0;
    const s = getComputedStyle(i), t = parseFloat(s.marginTop) || 0, o = parseFloat(s.marginBottom) || 0;
    return i.offsetHeight + t + o;
  }
  function g(i) {
    this.dom = i, this.tbody = i.querySelector("[data-ln-list-body]") || i, this.isDataDriven = i.hasAttribute("data-ln-list-source"), this.name = i.getAttribute(e) || "", this.source = i.getAttribute("data-ln-list-source") || "", this._totalSpan = i.querySelector("[data-ln-list-total]"), this._filteredSpan = i.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== i ? this._filteredSpan.parentElement : null), this._selectedSpan = i.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== i ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const s = this;
    return this._onSetSearch = function(t) {
      const o = (t.detail && t.detail.query != null ? t.detail.query : t.detail && t.detail.term != null ? t.detail.term : "").trim();
      s.isDataDriven ? (s.currentSearch = o, S(i, "ln-list:search", {
        list: s.name,
        query: s.currentSearch
      }), s._requestData()) : (s._searchTerm = o.toLowerCase(), s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), s._updateFooter(), S(i, "ln-list:filter", {
        term: s._searchTerm,
        matched: s._filteredData.length,
        total: s._data.length
      }));
    }, i.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(t) {
      t.preventDefault(), s._onSetSearch(t);
    }, i.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      s.isDataDriven ? (s.currentFilters = {}, s.currentSearch = "", S(i, "ln-list:clear-filters", { list: s.name }), s._requestData()) : (s._searchTerm = "", s._filters = {}, s._sortField = null, s._sortDir = null, s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), s._updateFooter(), S(i, "ln-list:filter", {
        term: "",
        matched: s._filteredData.length,
        total: s._data.length
      }));
    }, i.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectable = i.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, i.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(t) {
      const o = t.detail || {}, a = o.data || [], b = o.total != null ? o.total : a.length;
      if (!(s._hasInitialSeed && !s.isLoaded && a.length === 0 && b === 0)) {
        if (s._windowed) {
          s._cache.ingest(o) && !o.provisional && i.classList.remove("ln-list--loading");
          return;
        }
        s._data = a, s._lastTotal = b, s._lastFiltered = o.filtered != null ? o.filtered : s._data.length, s.totalCount = s._lastTotal, s.visibleCount = s._lastFiltered, s.isLoaded = !0, s._hasInitialSeed = !1, i.classList.remove("ln-list--loading"), s._vStart = -1, s._vEnd = -1, s._applyFilterAndSort(), s._render(), s._updateFooter(), S(i, "ln-list:rendered", {
          list: s.name,
          total: s.totalCount,
          visible: s.visibleCount
        });
      }
    }, i.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(t) {
      const o = t.detail && t.detail.loading;
      i.classList.toggle("ln-list--loading", !!o), o && (s.isLoaded = !1);
    }, i.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(t) {
      !s._windowed || !s._cache || s._cache.release(t.detail && t.detail.offset);
    }, i.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !s._windowed || !s._cache || s._cache.revalidate();
    }, i.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !s._windowed || !s._cache || s._requestData();
    }, i.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(t) {
      t.detail.field != null && (t.preventDefault(), s.currentSort = t.detail.direction === "none" ? null : { field: t.detail.field, direction: t.detail.direction }, s._requestData());
    }, i.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(t) {
      if (t.target.closest("[data-ln-item-select]") || t.target.closest("[data-ln-item-action]") || t.target.closest("a") || t.target.closest("button") || t.ctrlKey || t.metaKey || t.button === 1) return;
      const o = t.target.closest("[data-ln-item]");
      if (!o) return;
      const a = o.getAttribute("data-ln-item-id"), b = o._lnRecord || {};
      S(i, "ln-list:item-click", {
        list: s.name,
        id: a,
        record: b
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(t) {
      const o = t.target.closest("[data-ln-item-action]");
      if (!o) return;
      t.stopPropagation();
      const a = o.closest("[data-ln-item]");
      if (!a) return;
      const b = o.getAttribute("data-ln-item-action"), v = a.getAttribute("data-ln-item-id"), w = a._lnRecord || {};
      S(i, "ln-list:item-action", {
        list: s.name,
        id: v,
        action: b,
        record: w
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : S(i, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      s.tbody.children.length > 0 && (s._emptyObserver.disconnect(), s._emptyObserver = null, s._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(t) {
      if (t.preventDefault(), !t.detail) return;
      const o = t.detail.key, a = t.detail.values || [];
      if (o) {
        if (a.length === 0)
          delete s._filters[o];
        else {
          const b = [];
          for (let v = 0; v < a.length; v++)
            b.push(a[v].toLowerCase());
          s._filters[o] = b;
        }
        s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), s._updateFooter(), S(i, "ln-list:filter", {
          term: s._searchTerm,
          matched: s._filteredData.length,
          total: s._data.length
        });
      }
    }, i.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(t) {
      if (t.detail && t.detail.field == null) return;
      t.preventDefault();
      const o = t.detail && t.detail.direction === "none" ? null : t.detail && t.detail.direction;
      s._sortField = o === null ? null : t.detail && t.detail.field, s._sortDir = o, s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), s._updateFooter(), S(i, "ln-list:sorted", {
        field: s._sortField,
        direction: t.detail && t.detail.direction,
        matched: s._filteredData.length,
        total: s._data.length
      });
    }, i.addEventListener("ln-sort:change", this._onSort)), this;
  }
  g.prototype._parseChildren = function() {
    const i = Array.from(this.tbody.children).filter((s) => !s.classList.contains("ln-list__spacer"));
    this._data = [], i.length > 0 && (this._itemHeight = _(i[0]) || 50);
    for (let s = 0; s < i.length; s++) {
      const t = i[s], o = t.getAttribute("data-ln-item-id") || t.getAttribute("id"), a = t.textContent.trim().toLowerCase();
      let b = null;
      if (this.isDataDriven) {
        b = {}, o != null && (b.id = o);
        const A = t.querySelectorAll("[data-ln-list-field]");
        for (let C = 0; C < A.length; C++) {
          const L = A[C], q = L.getAttribute("data-ln-list-field");
          q && (b[q] = At(L));
        }
      }
      const v = {}, w = t.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let A = 0; A < w.length; A++) {
        const C = w[A], L = C.getAttribute("data-ln-list-field") || C.getAttribute("data-ln-field");
        L && (v[L] = At(C));
      }
      for (let A = 0; A < t.attributes.length; A++) {
        const C = t.attributes[A];
        if (C.name.startsWith("data-") && !C.name.startsWith("data-ln-")) {
          const L = C.name.slice(5);
          L && (v[L] = C.value);
        }
      }
      this._data.push({
        html: t.outerHTML,
        id: o,
        searchText: a,
        fields: v,
        ...b || {}
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, g.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const i = this._searchTerm, s = i ? i.split(/\s+/).filter(Boolean) : [], t = this._filters || {}, o = Object.keys(t).length > 0;
      if (s.length === 0 && !o ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(a) {
        if (s.length > 0 && !s.every(function(v) {
          return a.searchText && a.searchText.indexOf(v) !== -1;
        }))
          return !1;
        if (o)
          for (const b in t) {
            const v = t[b];
            if (v && v.length > 0) {
              const w = a.fields && a.fields[b] !== void 0 ? a.fields[b] : a[b] !== void 0 ? a[b] : null, A = w != null ? String(w).toLowerCase() : "";
              if (v.indexOf(A) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const a = this._sortField, b = this._sortDir === "desc" ? -1 : 1, v = typeof Intl < "u" ? new Intl.Collator(V(this.dom), { sensitivity: "base" }) : null, w = this._filteredData.map(function(C) {
          return C.fields && C.fields[a] !== void 0 ? C.fields[a] : C[a];
        }), A = le(w);
        this._filteredData.sort(function(C, L) {
          const q = C.fields && C.fields[a] !== void 0 ? C.fields[a] : C[a], x = L.fields && L.fields[a] !== void 0 ? L.fields[a] : L[a];
          return ce(q, x, A, v) * b;
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
  }, g.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const i = this._filteredData, s = document.createDocumentFragment();
      for (let o = 0; o < i.length; o++) {
        const a = this._buildItem(i[o]);
        a && s.appendChild(a);
      }
      const t = y(this);
      this.tbody.replaceChildren(s), p(t), this._selectable && this._updateSelectAll();
    } else {
      const i = [], s = this._filteredData;
      for (let o = 0; o < s.length; o++) i.push(s[o].html);
      const t = y(this);
      this.tbody.innerHTML = i.join(""), p(t), this._selectable && this._restoreSelection();
    }
  }, g.prototype._readGridLayout = function() {
    const i = getComputedStyle(this.tbody), s = i.gridTemplateColumns;
    let t = 1;
    if (s && s !== "none") {
      const a = s.trim().split(/\s+/).filter(Boolean);
      a.length > 0 && (t = a.length);
    }
    const o = parseFloat(i.rowGap);
    return { columns: t, rowGap: isNaN(o) ? 0 : o };
  }, g.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const i = this._cache.peek(), s = i ? this._buildItem(i) : this._buildPlaceholderItem();
      s && (this.tbody.textContent = "", this.tbody.appendChild(s), this._itemHeight = _(s) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const i = this._buildItem(this._data[0]);
        i && (this.tbody.textContent = "", this.tbody.appendChild(i), this._itemHeight = _(i) || 50, this.tbody.textContent = "");
      }
    } else {
      const i = this.tbody.children;
      i.length > 0 && (this._itemHeight = _(i[0]) || 50);
    }
  }, g.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const i = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = f(this.dom);
    const s = this._scrollContainer || window;
    this._scrollHandler = function() {
      i._rafId || (i._rafId = requestAnimationFrame(function() {
        i._rafId = null, i._windowed ? i._renderWindowed() : i._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      i._itemHeight = 0, i._measureItemHeight(), i._vStart = -1, i._vEnd = -1, i._windowed ? i._renderWindowed() : i._renderVirtual();
    }, s.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, g.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, g.prototype._renderVirtual = function() {
    const i = this._filteredData, s = i.length, t = this._itemHeight;
    if (!t || !s) return;
    const o = this._scrollContainer;
    let a, b;
    if (o) {
      const B = this.tbody.getBoundingClientRect(), U = o.getBoundingClientRect(), z = o === this.tbody ? 0 : B.top - U.top + o.scrollTop;
      a = o.scrollTop - z, b = o.clientHeight;
    } else {
      const U = this.tbody.getBoundingClientRect().top + window.scrollY;
      a = window.scrollY - U, b = window.innerHeight;
    }
    const v = this._readGridLayout(), w = v.columns, A = v.rowGap, C = t + A, L = Math.ceil(s / w);
    let q = Math.max(0, Math.floor(a / C) - 15);
    q = Math.min(q, L);
    const x = Math.ceil(b / C) + 30, D = Math.min(q + x, L), F = Math.min(q * w, s), N = Math.min(D * w, s);
    if (F === this._vStart && N === this._vEnd) return;
    this._vStart = F, this._vEnd = N;
    const H = q * C, Q = (L - D) * C;
    if (this.isDataDriven) {
      const B = document.createDocumentFragment();
      if (H > 0) {
        const z = document.createElement(this.isUl ? "li" : "div");
        z.className = "ln-list__spacer", z.setAttribute("aria-hidden", "true"), z.style.height = H + "px", B.appendChild(z);
      }
      for (let z = F; z < N; z++) {
        const st = this._buildItem(i[z]);
        st && B.appendChild(st);
      }
      if (Q > 0) {
        const z = document.createElement(this.isUl ? "li" : "div");
        z.className = "ln-list__spacer", z.setAttribute("aria-hidden", "true"), z.style.height = Q + "px", B.appendChild(z);
      }
      const U = y(this);
      this.tbody.replaceChildren(B), p(U), this._selectable && this._updateSelectAll();
    } else {
      let B = "";
      H > 0 && (B += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${H}px"></${this.isUl ? "li" : "div"}>`);
      for (let z = F; z < N; z++)
        B += i[z].html;
      Q > 0 && (B += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${Q}px"></${this.isUl ? "li" : "div"}>`);
      const U = y(this);
      this.tbody.innerHTML = B, p(U), this._selectable && this._restoreSelection();
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
    const s = this._scrollContainer;
    let t, o;
    if (s) {
      const U = this.tbody.getBoundingClientRect(), z = s.getBoundingClientRect(), st = s === this.tbody ? 0 : U.top - z.top + s.scrollTop;
      t = s.scrollTop - st, o = s.clientHeight;
    } else {
      const z = this.tbody.getBoundingClientRect().top + window.scrollY;
      t = window.scrollY - z, o = window.innerHeight;
    }
    const a = this._readGridLayout(), b = a.columns, v = a.rowGap, w = i + v, A = this._cache.logicalTotal, C = Math.ceil(A / b);
    let L = Math.max(0, Math.floor(t / w) - 15);
    L = Math.min(L, C);
    const q = Math.ceil(o / w) + 30, x = Math.min(L + q, C), D = Math.min(L * b, A), F = Math.min(x * b, A), N = L * w, H = (C - x) * w, Q = document.createDocumentFragment();
    if (N > 0) {
      const U = document.createElement(this.isUl ? "li" : "div");
      U.className = "ln-list__spacer", U.setAttribute("aria-hidden", "true"), U.style.height = N + "px", Q.appendChild(U);
    }
    for (let U = D; U < F; U++)
      if (this._cache.has(U)) {
        const z = this._buildItem(this._cache.get(U));
        z && Q.appendChild(z);
      } else
        Q.appendChild(this._buildPlaceholderItem());
    if (H > 0) {
      const U = document.createElement(this.isUl ? "li" : "div");
      U.className = "ln-list__spacer", U.setAttribute("aria-hidden", "true"), U.style.height = H + "px", Q.appendChild(U);
    }
    const B = y(this);
    this.tbody.replaceChildren(Q), p(B), this._vStart = D, this._vEnd = F, this._cache.ensure(D, F);
  }, g.prototype._showEmptyState = function() {
    let i = null;
    if (this.isDataDriven) {
      const s = this._lastTotal != null ? this._lastTotal : this._data.length, o = this.visibleCount === 0 && s > 0, a = o ? this.name + "-empty-filtered" : this.name + "-empty";
      if (i = pt(this.dom, a, "ln-list"), !i) {
        const b = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (b) {
          const v = o ? "search" : "initial", w = b.content.querySelector(`[data-ln-empty-when="${v}"]`) || b.content.firstElementChild;
          w && (i = document.importNode(w, !0));
        }
      }
    } else {
      const s = this.dom.querySelector(`template[${u}]`);
      if (s) {
        const t = s.content.firstElementChild;
        t && (i = document.importNode(t, !0));
      }
    }
    if (i)
      if (i.tagName === "LI" || i.tagName === "TR")
        this.tbody.replaceChildren(i);
      else {
        const s = document.createElement(this.isUl ? "li" : "div");
        s.appendChild(i), this.tbody.replaceChildren(s);
      }
    else
      this.tbody.replaceChildren();
    S(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, g.prototype._buildItem = function(i) {
    let s = pt(this.dom, this.name + "-row", "ln-list");
    if (!s) {
      const o = this.dom.querySelector("template[data-ln-item]");
      o && (s = document.importNode(o.content, !0));
    }
    let t = s ? s.querySelector("[data-ln-item]") || s.firstElementChild : null;
    if (t)
      It(t, i), rt(t, i);
    else if (i && i.html) {
      const o = document.createElement(this.isUl ? "ul" : "div");
      o.innerHTML = i.html, t = o.firstElementChild;
    } else if (t = document.createElement(this.isUl ? "li" : "div"), t.setAttribute("data-ln-item", ""), i && typeof i == "object") {
      for (const o in i)
        if (o !== "html" && i[o] != null) {
          const a = document.createElement("span");
          a.setAttribute("data-ln-field", o), a.textContent = String(i[o]), t.appendChild(a);
        }
    }
    if (t._lnRecord = i, i && i.id != null && (t.setAttribute("data-ln-item-id", i.id), this._selectable && this.selectedIds.has(String(i.id)))) {
      t.classList.add("ln-item-selected");
      const o = t.querySelector("[data-ln-item-select]");
      o && (o.checked = !0);
    }
    return t;
  }, g.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const i = this.tbody.querySelectorAll("[data-ln-item]");
    for (let s = 0; s < i.length; s++) {
      const t = i[s].getAttribute("data-ln-item-id"), o = t != null && this.selectedIds.has(String(t));
      i[s].classList.toggle("ln-item-selected", o);
      const a = i[s].querySelector("[data-ln-item-select]");
      a && (a.checked = o);
    }
    this._updateSelectAll();
  }, g.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const i = this;
    this._onSelectionChange = function(s) {
      const t = s.target.closest("[data-ln-item-select]");
      if (!t) return;
      const o = t.closest("[data-ln-item]");
      if (!o) return;
      const a = o.getAttribute("data-ln-item-id");
      a != null && (t.checked ? (i.selectedIds.add(String(a)), o.classList.add("ln-item-selected")) : (i.selectedIds.delete(String(a)), o.classList.remove("ln-item-selected")), i._updateSelectAll(), i._updateFooter(), S(i.dom, "ln-list:select", {
        list: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const s = i._selectAllCheckbox.checked, t = i.tbody.querySelectorAll("[data-ln-item]");
      for (let o = 0; o < t.length; o++) {
        const a = t[o], b = a.getAttribute("data-ln-item-id"), v = a.querySelector("[data-ln-item-select]");
        b != null && (s ? (i.selectedIds.add(String(b)), a.classList.add("ln-item-selected")) : (i.selectedIds.delete(String(b)), a.classList.remove("ln-item-selected")), v && (v.checked = s));
      }
      S(i.dom, "ln-list:select-all", { list: i.name, selected: s }), S(i.dom, "ln-list:select", {
        list: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedIds.size
      }), i._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, g.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const i = this.tbody.querySelectorAll("[data-ln-item]");
    let s = i.length > 0;
    for (let t = 0; t < i.length; t++) {
      const o = i[t].getAttribute("data-ln-item-id");
      if (o != null && !this.selectedIds.has(String(o))) {
        s = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = s;
  }, g.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Oe(this, "ln-list:request-data", "list");
  }, g.prototype._enterWindowedMode = function() {
    const i = this, s = this.dom, t = parseInt(s.getAttribute("data-ln-list-window"), 10), o = parseInt(s.getAttribute("data-ln-list-window-page"), 10), a = parseInt(s.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !i._windowed || !i._cache || (i.totalCount = i._cache.grandTotal, i.visibleCount = i._cache.logicalTotal, i._lastTotal = i._cache.grandTotal, i.isLoaded = !0, i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), S(s, "ln-list:rendered", {
        list: i.name,
        total: i.totalCount,
        visible: i.visibleCount
      }));
    }, this._renderBatch = ue(this._onCacheChange), this._cache = je({
      windowSize: t > 0 ? t : 1e3,
      pageSize: o > 0 ? o : 200,
      threshold: a >= 0 ? a : 25,
      fetchDebounce: 120,
      requestPage: function(b, v, w) {
        S(s, "ln-list:request-data", {
          list: i.name,
          sort: b.sort,
          filters: b.filters,
          search: b.search,
          offset: v,
          limit: w,
          queryGen: i._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, g.prototype._kickWindowInitial = function() {
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
  }, g.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, g.prototype._updateFooter = function() {
    let i = 0, s = 0;
    this.isDataDriven ? (i = this._lastTotal != null ? this._lastTotal : this._data.length, s = this.visibleCount) : (i = this._data.length, s = this._filteredData.length);
    const t = s < i;
    if (this._totalSpan && (this._totalSpan.textContent = d(i, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = t ? d(s, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !t), this._selectedSpan) {
      const o = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = o > 0 ? d(o, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", o === 0);
    }
  }, g.prototype.destroy = function() {
    this.dom[n] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[n]);
  }, M(e, n, g, "ln-list", {
    extraAttributes: [
      "data-ln-list-window",
      "data-ln-list-window-page",
      "data-ln-list-window-threshold",
      "data-ln-list-count"
    ],
    onAttributeChange: function(i, s) {
      const t = i[n];
      if (!(!t || !t.isDataDriven)) {
        if (s === "data-ln-list-window") {
          const o = i.hasAttribute("data-ln-list-window");
          if (o && !t._windowed)
            t._enterWindowedMode(), t._kickWindowInitial();
          else if (!o && t._windowed)
            t._exitWindowedMode();
          else if (o && t._windowed) {
            const a = parseInt(i.getAttribute("data-ln-list-window"), 10);
            a > 0 && t._cache.configure({ windowSize: a });
          }
          return;
        }
        if (!(!t._windowed || !t._cache)) {
          if (s === "data-ln-list-window-page") {
            const o = parseInt(i.getAttribute("data-ln-list-window-page"), 10);
            o > 0 && t._cache.configure({ pageSize: o });
          } else if (s === "data-ln-list-window-threshold") {
            const o = parseInt(i.getAttribute("data-ln-list-window-threshold"), 10);
            o >= 0 && t._cache.configure({ threshold: o });
          } else if (s === "data-ln-list-count") {
            const o = parseInt(i.getAttribute("data-ln-list-count"), 10);
            o >= 0 && t._cache.setGrandTotal(o);
          }
        }
      }
    }
  });
})();
(function() {
  const e = "data-ln-circular-progress", n = "lnCircularProgress";
  if (window[n] !== void 0) return;
  const u = "http://www.w3.org/2000/svg", m = 36, l = 16, h = 2 * Math.PI * l;
  function c(y) {
    return this.dom = y, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, d.call(this), f.call(this), this;
  }
  c.prototype.destroy = function() {
    this.dom[n] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[n]);
  };
  function r(y, p) {
    const _ = document.createElementNS(u, y);
    for (const [g, i] of Object.entries(p))
      _.setAttribute(g, i);
    return _;
  }
  function d() {
    this.svg = r("svg", {
      viewBox: "0 0 " + m + " " + m,
      width: m,
      height: m
    }), this.svg.classList.add("ln-circular-progress__svg"), this.trackCircle = r("circle", {
      cx: m / 2,
      cy: m / 2,
      r: l,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = r("circle", {
      cx: m / 2,
      cy: m / 2,
      r: l,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": h,
      "stroke-dashoffset": h,
      transform: "rotate(-90 " + m / 2 + " " + m / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function f() {
    const y = this.dom.getAttribute("data-ln-circular-progress"), p = this.dom.getAttribute("data-ln-circular-progress-max"), _ = Xe(y, p || 100), g = h - _.percentage / 100 * h;
    this.progressCircle.setAttribute("stroke-dashoffset", g);
    const i = this.dom.getAttribute("data-ln-circular-progress-label"), s = i !== null ? i : Math.round(_.percentage) + "%";
    this.labelEl.textContent = s, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(_.min)), this.dom.setAttribute("aria-valuemax", String(_.max)), this.dom.setAttribute("aria-valuenow", String(_.clampedValue)), this.dom.setAttribute("aria-valuetext", s), S(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: _.value,
      max: _.max,
      percentage: _.percentage
    });
  }
  M(e, n, c, "ln-circular-progress", {
    extraAttributes: ["data-ln-circular-progress-max", "data-ln-circular-progress-label"],
    onAttributeChange: function(y) {
      const p = y[n];
      p && f.call(p);
    }
  });
})();
(function() {
  const e = "data-ln-sortable", n = "lnSortable", u = "data-ln-sortable-handle";
  if (window[n] !== void 0) return;
  function m(h) {
    this.dom = h, this.isEnabled = h.getAttribute(e) !== "disabled", this._dragging = null, h.setAttribute("aria-roledescription", "sortable list");
    const c = this;
    return this._onPointerDown = function(r) {
      c.isEnabled && c._handlePointerDown(r);
    }, h.addEventListener("pointerdown", this._onPointerDown), this;
  }
  m.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(e, "");
  }, m.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(e, "disabled");
  }, m.prototype.destroy = function() {
    this.dom[n] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), S(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[n]);
  }, m.prototype._handlePointerDown = function(h) {
    let c = h.target.closest("[" + u + "]"), r;
    if (c) {
      for (r = c; r && r.parentElement !== this.dom; )
        r = r.parentElement;
      if (!r || r.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + u + "]")) return;
      for (r = h.target; r && r.parentElement !== this.dom; )
        r = r.parentElement;
      if (!r || r.parentElement !== this.dom) return;
      c = r;
    }
    const f = Array.from(this.dom.children).indexOf(r);
    if (W(this.dom, "ln-sortable:before-drag", {
      item: r,
      index: f
    }).defaultPrevented) return;
    h.preventDefault(), c.setPointerCapture(h.pointerId), this._dragging = r, r.classList.add("ln-sortable--dragging"), r.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), S(this.dom, "ln-sortable:drag-start", {
      item: r,
      index: f
    });
    const p = this, _ = function(i) {
      p._handlePointerMove(i);
    }, g = function(i) {
      p._handlePointerEnd(i), c.removeEventListener("pointermove", _), c.removeEventListener("pointerup", g), c.removeEventListener("pointercancel", g);
    };
    c.addEventListener("pointermove", _), c.addEventListener("pointerup", g), c.addEventListener("pointercancel", g);
  }, m.prototype._handlePointerMove = function(h) {
    if (!this._dragging) return;
    const c = Array.from(this.dom.children), r = this._dragging;
    for (const d of c)
      d.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const d of c) {
      if (d === r) continue;
      const f = d.getBoundingClientRect(), y = f.top + f.height / 2;
      if (h.clientY >= f.top && h.clientY < y) {
        d.classList.add("ln-sortable--drop-before");
        break;
      } else if (h.clientY >= y && h.clientY <= f.bottom) {
        d.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, m.prototype._handlePointerEnd = function(h) {
    if (!this._dragging) return;
    const c = this._dragging, r = Array.from(this.dom.children), d = r.indexOf(c);
    let f = null, y = null;
    for (const p of r) {
      if (p.classList.contains("ln-sortable--drop-before")) {
        f = p, y = "before";
        break;
      }
      if (p.classList.contains("ln-sortable--drop-after")) {
        f = p, y = "after";
        break;
      }
    }
    for (const p of r)
      p.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (c.classList.remove("ln-sortable--dragging"), c.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), f && f !== c) {
      y === "before" ? this.dom.insertBefore(c, f) : this.dom.insertBefore(c, f.nextElementSibling);
      const _ = Array.from(this.dom.children).indexOf(c);
      S(this.dom, "ln-sortable:reordered", {
        item: c,
        oldIndex: d,
        newIndex: _
      });
    }
    this._dragging = null;
  };
  function l(h) {
    const c = h[n];
    if (!c) return;
    const r = h.getAttribute(e) !== "disabled";
    r !== c.isEnabled && (c.isEnabled = r, S(h, r ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: h }));
  }
  M(e, n, m, "ln-sortable", {
    onAttributeChange: l
  });
})();
(function() {
  const e = "data-ln-confirm", n = "lnConfirm", u = "data-ln-confirm-timeout";
  if (window[n] !== void 0) return;
  function l(c) {
    const r = parseFloat(c.getAttribute(u));
    return isNaN(r) || r <= 0 ? 3 : r;
  }
  function h(c) {
    this.dom = c, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = c.querySelector("[data-ln-confirm-idle]"), this.activeEl = c.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = c.textContent.trim(), this.confirmText = c.getAttribute(e) || "Confirm?");
    const r = this;
    return this._onClick = function(d) {
      if (!Me(d))
        if (!r.confirming)
          d.preventDefault(), d.stopImmediatePropagation(), r._enterConfirm();
        else {
          if (r._submitted) return;
          r._submitted = !0, d.stopPropagation(), r._reset();
        }
    }, c.addEventListener("click", this._onClick), this;
  }
  h.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const c = this.activeEl ? this.activeEl.textContent.trim() : "";
      c && (this.dom.setAttribute("aria-label", c), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const c = this.dom.querySelector("svg.ln-icon use");
      c && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = c.getAttribute("href"), c.setAttribute("href", "#ln-icon-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.dom.setAttribute("aria-label", this.confirmText), this.dom.setAttribute("aria-live", "polite")) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), S(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, h.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const c = this, r = l(this.dom) * 1e3;
    this.revertTimer = setTimeout(function() {
      c._reset();
    }, r);
  }, h.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const c = this.dom.querySelector("svg.ln-icon use");
      c && this.originalIconHref && c.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, h.prototype.destroy = function() {
    this.dom[n] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[n], S(this.dom, "ln-confirm:destroyed", { target: this.dom }));
  }, M(e, n, h, "ln-confirm");
})();
(function() {
  const e = "data-ln-translations", n = "lnTranslations";
  if (window[n] !== void 0) return;
  const u = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function m(l) {
    this.dom = l, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = l.getAttribute(e + "-default") || "", this.placeholderLabel = l.getAttribute(e + "-placeholder") || "{lang} translation", this.removeLabel = l.getAttribute(e + "-remove-label") || "Remove {lang}", this.badgesEl = l.querySelector("[" + e + "-active]"), this.menuEl = l.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const h = l.getAttribute(e + "-locales");
    if (this.locales = u, h)
      try {
        this.locales = JSON.parse(h);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const c = this;
    return this._onRequestAdd = function(r) {
      r.detail && r.detail.lang && c.addLanguage(r.detail.lang);
    }, this._onRequestRemove = function(r) {
      r.detail && r.detail.lang && c.removeLanguage(r.detail.lang);
    }, l.addEventListener("ln-translations:request-add", this._onRequestAdd), l.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  m.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const l = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const h of l) {
      const c = h.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const r of c)
        r.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, m.prototype._detectExisting = function() {
    const l = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const h of l) {
      const c = h.getAttribute("data-ln-translatable-lang");
      c && c !== this.defaultLang && this.activeLanguages.add(c);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, m.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const l = this;
    let h = 0;
    for (const r in this.locales) {
      if (!this.locales.hasOwnProperty(r) || this.activeLanguages.has(r)) continue;
      h++;
      const d = Pt("ln-translations-menu-item", "ln-translations");
      if (!d) return;
      const f = d.querySelector("[data-ln-translations-lang]");
      f.setAttribute("data-ln-translations-lang", r), f.textContent = this.locales[r], f.addEventListener("click", function(y) {
        y.ctrlKey || y.metaKey || y.button === 1 || (y.preventDefault(), y.stopPropagation(), l.menuEl.getAttribute("data-ln-toggle") === "open" && l.menuEl.setAttribute("data-ln-toggle", "close"), l.addLanguage(r));
      }), this.menuEl.appendChild(d);
    }
    const c = this.dom.querySelector("[" + e + "-add]");
    c && (c.hidden = h === 0);
  }, m.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const l = this;
    this.activeLanguages.forEach(function(h) {
      const c = Pt("ln-translations-badge", "ln-translations");
      if (!c) return;
      const r = c.querySelector("[data-ln-translations-lang]");
      r.setAttribute("data-ln-translations-lang", h);
      const d = r.querySelector("span");
      d.textContent = l.locales[h] || h.toUpperCase();
      const f = r.querySelector("button"), y = l.locales[h] || h.toUpperCase();
      f.setAttribute("aria-label", l.removeLabel.replace("{lang}", y)), f.addEventListener("click", function(p) {
        p.ctrlKey || p.metaKey || p.button === 1 || (p.preventDefault(), p.stopPropagation(), l.removeLanguage(h));
      }), l.badgesEl.appendChild(c);
    });
  }, m.prototype.addLanguage = function(l, h) {
    if (this.activeLanguages.has(l)) return;
    const c = this.locales[l] || l;
    if (W(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: l,
      langName: c
    }).defaultPrevented) return;
    this.activeLanguages.add(l), h = h || {};
    const d = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const f of d) {
      const y = f.getAttribute("data-ln-translatable"), p = f.getAttribute("data-ln-translations-prefix") || "", _ = f.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!_) continue;
      const g = _.cloneNode(_.tagName === "SELECT");
      p ? g.name = p + "[trans][" + l + "][" + y + "]" : g.name = "trans[" + l + "][" + y + "]", g.value = h[y] !== void 0 ? h[y] : "", g.removeAttribute("id"), "placeholder" in g && (g.placeholder = this.placeholderLabel.replace("{lang}", c)), g.setAttribute("data-ln-translatable-lang", l);
      const i = f.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), s = i.length > 0 ? i[i.length - 1] : _;
      s.parentNode.insertBefore(g, s.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: l,
      langName: c
    });
  }, m.prototype.removeLanguage = function(l) {
    if (!this.activeLanguages.has(l) || W(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: l
    }).defaultPrevented) return;
    const c = this.dom.querySelectorAll('[data-ln-translatable-lang="' + l + '"]');
    for (const r of c)
      r.parentNode.removeChild(r);
    this.activeLanguages.delete(l), this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: l
    });
  }, m.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, m.prototype.hasLanguage = function(l) {
    return this.activeLanguages.has(l);
  }, m.prototype.destroy = function() {
    if (!this.dom[n]) return;
    const l = this.defaultLang, h = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const c of h)
      c.getAttribute("data-ln-translatable-lang") !== l && c.parentNode.removeChild(c);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[n];
  }, M(e, n, m, "ln-translations");
})();
const wi = "ln-autosave:", Ei = 1e3;
function Ai(e, n) {
  return n ? wi + (e || "") + ":" + n : null;
}
function Si(e, n = Ei) {
  if (e == null) return 0;
  if (e === "") return n;
  const u = parseInt(String(e), 10);
  return isNaN(u) || u < 0 ? n : u;
}
(function() {
  const e = "data-ln-autosave", n = "lnAutosave", u = "data-ln-autosave-clear", m = "data-ln-autosave-debounce-input", l = '[data-ln-autosave-exclude], input[type="password"]';
  if (window[n] !== void 0) return;
  function h(r) {
    const d = r.tagName;
    return d === "INPUT" || d === "TEXTAREA" || d === "SELECT";
  }
  function c(r) {
    const f = r.getAttribute(e) || r.id, y = Ai(window.location.pathname, f);
    if (!y) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", r);
      return;
    }
    this.dom = r, this.key = y;
    let p = null;
    function _() {
      const t = Ne(r, { exclude: l });
      try {
        localStorage.setItem(y, JSON.stringify(t));
      } catch {
        return;
      }
      S(r, "ln-autosave:saved", { target: r, data: t });
    }
    function g() {
      let t;
      try {
        t = localStorage.getItem(y);
      } catch {
        return;
      }
      if (!t) return;
      let o;
      try {
        o = JSON.parse(t);
      } catch {
        return;
      }
      if (W(r, "ln-autosave:before-restore", { target: r, data: o }).defaultPrevented) return;
      const b = Pe(r, o);
      for (let v = 0; v < b.length; v++)
        b[v].dispatchEvent(new Event("input", { bubbles: !0 })), b[v].dispatchEvent(new Event("change", { bubbles: !0 }));
      S(r, "ln-autosave:restored", { target: r, data: o });
    }
    function i() {
      try {
        localStorage.removeItem(y);
      } catch {
        return;
      }
      S(r, "ln-autosave:cleared", { target: r });
    }
    this._onFocusout = function(t) {
      const o = t.target;
      h(o) && o.name && !o.matches(l) && _();
    }, this._onChange = function(t) {
      const o = t.target;
      h(o) && o.name && !o.matches(l) && _();
    }, this._onSubmit = function() {
      i();
    }, this._onReset = function() {
      i();
    }, this._onClearClick = function(t) {
      t.target.closest("[" + u + "]") && i();
    }, r.addEventListener("focusout", this._onFocusout), r.addEventListener("change", this._onChange), r.addEventListener("submit", this._onSubmit), r.addEventListener("reset", this._onReset), r.addEventListener("click", this._onClearClick);
    const s = Si(r.getAttribute(m));
    return s > 0 && (this._onInput = function(t) {
      const o = t.target;
      !h(o) || !o.name || o.matches(l) || (p !== null && clearTimeout(p), p = setTimeout(_, s));
    }, r.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return p;
    }, g(), this;
  }
  c.prototype.destroy = function() {
    if (this.dom[n]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const r = this._getInputTimer();
        r !== null && clearTimeout(r);
      }
      S(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[n];
    }
  }, M(e, n, c, "ln-autosave");
})();
(function() {
  const e = "data-ln-autoresize", n = "lnAutoresize";
  if (window[n] !== void 0) return;
  function u(m) {
    if (m.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", m.tagName), this;
    this.dom = m;
    const l = this;
    return this._onInput = function() {
      l._resize();
    }, m.addEventListener("input", this._onInput), this._resize(), this;
  }
  u.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, u.prototype.destroy = function() {
    this.dom[n] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[n]);
  }, M(e, n, u, "ln-autoresize");
})();
(function() {
  const e = "data-ln-editor", n = "lnEditor";
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
  }, m = {
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
  }, h = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let c = 0;
  function r(t) {
    return !!(m[t] || l[t] || h[t] || t === "link");
  }
  function d(t) {
    this.dom = t;
    const o = this;
    if (this._textarea = t.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", t), this;
    const a = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), a && this._surface.setAttribute("data-placeholder", a);
    const b = this._textarea.id;
    if (b) {
      const C = t.querySelector('label[for="' + b + '"]');
      C && (C.id || (C.id = b + "-label"), this._surface.setAttribute("aria-labelledby", C.id));
    }
    this._surface.id = b ? b + "-surface" : "ln-editor-surface-" + ++c;
    const v = this._textarea.value.trim();
    v && (this._surface.innerHTML = v);
    const w = t.querySelector('[role="toolbar"]');
    if (w && w.nextSibling ? t.insertBefore(this._surface, w.nextSibling) : t.appendChild(this._surface), w) {
      w.setAttribute("aria-controls", this._surface.id);
      const C = w.querySelectorAll("[data-ln-editor-action]");
      for (let L = 0; L < C.length; L++) {
        const q = C[L].getAttribute("data-ln-editor-action");
        r(q) && C[L].setAttribute("aria-pressed", "false");
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
      p(o, C);
    }, this._onKeydown = function(C) {
      i(o, C);
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
    }, t.addEventListener("ln-editor:set-content", this._onSetContent);
    const A = this._textarea.form;
    return A && (this._onFormReset = function() {
      setTimeout(function() {
        o._surface.innerHTML = o._textarea.value, S(t, "ln-editor:changed", {
          html: o._textarea.value,
          target: t
        });
      }, 0);
    }, A.addEventListener("reset", this._onFormReset)), this;
  }
  d.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, d.prototype._execAction = function(t) {
    if (!(!t || W(this.dom, "ln-editor:before-change", {
      action: t,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), m[t])
        document.execCommand(m[t], !1, null);
      else if (l[t]) {
        const a = l[t], b = f(this._surface);
        b && b.toLowerCase() === a ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + a + ">");
      } else h[t] ? document.execCommand(h[t], !1, null) : t === "link" ? s(this) : t === "unlink" ? document.execCommand("unlink", !1, null) : t === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, d.prototype._updateActiveStates = function() {
    const t = this.dom.querySelector('[role="toolbar"]');
    if (!t) return;
    const o = window.getSelection();
    if (!o || o.rangeCount === 0) return;
    const a = o.anchorNode;
    if (!a || !this._surface.contains(a)) return;
    const b = t.querySelectorAll("[data-ln-editor-action]");
    for (let v = 0; v < b.length; v++) {
      const w = b[v], A = w.getAttribute("data-ln-editor-action");
      let C = !1;
      if (m[A])
        try {
          C = document.queryCommandState(m[A]);
        } catch {
        }
      else if (l[A]) {
        const L = f(this._surface);
        C = L && L.toLowerCase() === l[A];
      } else if (h[A])
        try {
          C = document.queryCommandState(h[A]);
        } catch {
        }
      else A === "link" && (C = !!y(o.anchorNode, "A", this._surface));
      r(A) && w.setAttribute("aria-pressed", String(C)), C ? w.classList.add("ln-editor-active") : w.classList.remove("ln-editor-active");
    }
  }, d.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, d.prototype.setHTML = function(t) {
    this._surface && (this._surface.innerHTML = t, this._syncToTextarea(), S(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, d.prototype.destroy = function() {
    if (!this.dom[n]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const t = this.dom.querySelector('[role="toolbar"]');
    t && (t.removeEventListener("mousedown", this._onMousedownToolbar), t.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const o = this._textarea ? this._textarea.form : null;
    if (o && this._onFormReset && o.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const a = this.dom.querySelector(".ln-editor__link-popover");
      a && a.remove();
    }
    S(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[n];
  };
  function f(t) {
    const o = window.getSelection();
    if (!o || o.rangeCount === 0) return null;
    let a = o.anchorNode;
    if (!a) return null;
    for (; a && a !== t; ) {
      if (a.nodeType === 1) {
        const b = a.tagName;
        if (b === "H2" || b === "H3" || b === "H4" || b === "BLOCKQUOTE" || b === "PRE" || b === "P")
          return b;
      }
      a = a.parentNode;
    }
    return null;
  }
  function y(t, o, a) {
    for (; t && t !== a; ) {
      if (t.nodeType === 1 && t.tagName === o)
        return t;
      t = t.parentNode;
    }
    return null;
  }
  function p(t, o) {
    o.preventDefault();
    let a = "";
    if (o.clipboardData && (a = o.clipboardData.getData("text/html"), !a)) {
      const v = o.clipboardData.getData("text/plain");
      v && (a = v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), a = "<p>" + a + "</p>");
    }
    if (!a) return;
    const b = _(a);
    b && document.execCommand("insertHTML", !1, b);
  }
  function _(t) {
    const o = document.createElement("div");
    return o.innerHTML = t, g(o), o.innerHTML;
  }
  function g(t) {
    const o = Array.from(t.childNodes);
    for (let a = 0; a < o.length; a++) {
      const b = o[a];
      if (b.nodeType !== 3) {
        if (b.nodeType !== 1) {
          t.removeChild(b);
          continue;
        }
        if (u[b.tagName]) {
          const v = Array.from(b.attributes);
          for (let w = 0; w < v.length; w++) {
            const A = v[w].name;
            if (b.tagName === "A" && A === "href") {
              const C = b.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(C) || b.removeAttribute("href");
            } else
              b.removeAttribute(A);
          }
          b.tagName === "A" && b.setAttribute("rel", "noopener noreferrer"), g(b);
        } else {
          for (; b.firstChild; )
            t.insertBefore(b.firstChild, b);
          t.removeChild(b);
        }
      }
    }
  }
  function i(t, o) {
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
    a && (o.preventDefault(), t._execAction(a));
  }
  function s(t) {
    const o = window.getSelection();
    if (!o || o.rangeCount === 0) return;
    const a = y(o.anchorNode, "A", t._surface), b = o.getRangeAt(0).cloneRange();
    t._closeLinkPopover && t._closeLinkPopover();
    const v = pt(t.dom, "ln-editor-link-popover", "ln-editor");
    if (!v) return;
    const w = v.firstElementChild;
    if (!w) return;
    const A = w.querySelector('input[type="url"]'), C = w.querySelector('[data-ln-editor-action="confirm-link"]'), L = w.querySelector('[data-ln-editor-action="cancel-link"]');
    a && (A.value = a.getAttribute("href") || "");
    const q = t.dom.querySelector('[role="toolbar"]');
    q ? q.after(w) : t.dom.insertBefore(w, t._surface), A.focus();
    function x() {
      const B = window.getSelection();
      B.removeAllRanges(), B.addRange(b);
    }
    function D() {
      document.removeEventListener("mousedown", Q), t._closeLinkPopover = null, w.remove();
    }
    function F() {
      const B = A.value.trim();
      if (D(), x(), t._surface.focus(), B)
        if (a)
          a.setAttribute("href", B), a.setAttribute("rel", "noopener noreferrer"), t._syncToTextarea(), S(t.dom, "ln-editor:changed", {
            html: t._textarea.value,
            target: t.dom
          });
        else {
          document.execCommand("createLink", !1, B);
          const U = window.getSelection();
          if (U && U.anchorNode) {
            const z = y(U.anchorNode, "A", t._surface);
            z && (z.setAttribute("rel", "noopener noreferrer"), t._syncToTextarea());
          }
        }
      else a && document.execCommand("unlink", !1, null);
    }
    function N() {
      D(), x(), t._surface.focus();
    }
    function H() {
      D();
    }
    function Q(B) {
      const U = t.dom.contains(B.target) && B.target.closest('[data-ln-editor-action="link"]');
      !w.contains(B.target) && !U && H();
    }
    t._closeLinkPopover = D, C.addEventListener("click", F), L.addEventListener("click", N), A.addEventListener("keydown", function(B) {
      B.key === "Enter" ? (B.preventDefault(), F()) : B.key === "Escape" && (B.preventDefault(), N());
    }), document.addEventListener("mousedown", Q);
  }
  M(e, n, d, "ln-editor");
})();
(function() {
  const e = "lnFill";
  if (window[e] !== void 0) return;
  const n = { lnFillForm: !0, lnFillStore: !0 };
  function u(l) {
    const h = {}, c = l.dataset;
    for (const r in c) {
      if (!r.startsWith("lnFill") || n[r]) continue;
      const d = r.slice(6);
      d && (h[d.charAt(0).toLowerCase() + d.slice(1)] = c[r]);
    }
    return h;
  }
  function m(l, h) {
    const c = window.CSS && CSS.escape ? CSS.escape(h) : h, r = document.querySelectorAll('[data-ln-fill-id="' + c + '"]');
    if (r.length === 0) return null;
    for (let d = 0; d < r.length; d++) {
      const f = r[d].getAttribute("data-ln-fill-form");
      if (f) {
        const y = document.getElementById(f);
        if (y && l.contains(y)) return r[d];
      }
    }
    return r[0];
  }
  document.addEventListener("click", function(l) {
    if (l.ctrlKey || l.metaKey || l.button === 1) return;
    const h = l.target.closest("[data-ln-fill-form]");
    if (!h) return;
    const c = h.getAttribute("href");
    if (c && c.indexOf("#") !== -1) return;
    const r = h.getAttribute("data-ln-fill-form"), d = document.getElementById(r);
    if (!d) return;
    const f = u(h), y = Object.keys(f).length > 0;
    window.lnCore.lnFill(d, y ? f : null);
  }), document.addEventListener("ln-fill:request", function(l) {
    const h = l.detail;
    if (!h) return;
    const c = l.target, r = h.id;
    if (r == null) {
      window.lnCore.lnFill(c, null);
      return;
    }
    const d = m(c, r);
    if (!d) return;
    const f = u(d);
    window.lnCore.lnFill(c, f);
  }), window[e] = !0;
})();
function Ci(e, n = "-") {
  if (e == null) return "";
  const u = n || "-", m = u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(e).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, u).replace(new RegExp(`${m}+`, "g"), u).replace(new RegExp(`^${m}+|${m}+$`, "g"), "");
}
(function() {
  const e = "data-ln-slug-from", n = "lnSlug";
  if (window[n] !== void 0) return;
  function u(m) {
    if (m.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", m.tagName), this;
    const l = m.form;
    if (!l)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", m), this;
    const h = m.getAttribute(e), c = l.elements[h];
    if (!c)
      return console.warn('[ln-slug] Source field "' + h + '" not found in form:', m), this;
    if (typeof c.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + h + '" is a RadioNodeList (same-name group) — single source field required:', m), this;
    this.dom = m, this.source = c, this._pristine = m.value === "", this._mirroring = !1;
    const r = this;
    return this._onSource = function() {
      r._pristine && r._mirror();
    }, this._onSlug = function() {
      r._mirroring || (r._pristine = r.dom.value === "");
    }, c.addEventListener("input", this._onSource), m.addEventListener("input", this._onSlug), this._pristine && c.value && c.value.trim() !== "" && this._mirror(), this;
  }
  u.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = Ci(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, u.prototype.destroy = function() {
    this.dom[n] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[n]);
  }, M(e, n, u, "ln-slug");
})();
function Li(e, n = Date.now()) {
  if (!e)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const u = typeof n == "number" ? n : n.getTime(), m = e.getTime(), l = Math.floor((m - u) / 1e3), h = Math.abs(l);
  return h < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : h < 60 ? { value: l, unit: "second", isOlderThanMonth: !1 } : h < 3600 ? { value: Math.round(l / 60), unit: "minute", isOlderThanMonth: !1 } : h < 86400 ? { value: Math.round(l / 3600), unit: "hour", isOlderThanMonth: !1 } : h < 604800 ? { value: Math.round(l / 86400), unit: "day", isOlderThanMonth: !1 } : h < 2592e3 ? { value: Math.round(l / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(l / 2592e3), unit: "month", isOlderThanMonth: !0 };
}
function Mt(e, n, u = /* @__PURE__ */ new Date()) {
  switch (e) {
    case "full":
      return { dateStyle: "long", timeStyle: "short" };
    case "date":
      return { dateStyle: "medium" };
    case "time":
      return { timeStyle: "short" };
    case "short":
    default: {
      const m = { month: "short", day: "numeric" };
      return n && n.getFullYear() !== u.getFullYear() && (m.year = "numeric"), m;
    }
  }
}
(function() {
  const e = "data-ln-time", n = "lnTime";
  if (window[n] !== void 0) return;
  const u = {}, m = {};
  function l(w) {
    return w.getAttribute("data-ln-time-locale") || V(w);
  }
  function h(w, A) {
    const C = (w || "") + "|" + JSON.stringify(A);
    return u[C] || (u[C] = new Intl.DateTimeFormat(w, A)), u[C];
  }
  function c(w) {
    const A = w || "";
    return m[A] || (m[A] = new Intl.RelativeTimeFormat(w, { numeric: "auto", style: "narrow" })), m[A];
  }
  const r = /* @__PURE__ */ new Set();
  let d = null;
  function f() {
    d || (d = setInterval(p, 6e4));
  }
  function y() {
    d && (clearInterval(d), d = null);
  }
  function p() {
    for (const w of r) {
      if (!document.body.contains(w.dom)) {
        r.delete(w);
        continue;
      }
      o(w);
    }
    r.size === 0 && y();
  }
  function _(w, A) {
    const C = _t(A), L = (A || "").toLowerCase().split("-")[0], q = h(A, Mt("full", w)), x = q.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (C && x !== L && C.monthsLong) {
      const D = C.monthsLong[w.getMonth()], F = w.getDate(), N = w.getFullYear(), H = String(w.getHours()).padStart(2, "0"), Q = String(w.getMinutes()).padStart(2, "0");
      return `${F} ${D} ${N} во ${H}:${Q}`;
    }
    return q.format(w);
  }
  function g(w, A) {
    const C = Mt("short", w), L = _t(A), q = (A || "").toLowerCase().split("-")[0], x = h(A, C), D = x.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (L && D !== q && L.monthsShort) {
      const F = L.monthsShort[w.getMonth()], N = w.getDate(), H = C.year ? " " + w.getFullYear() : "";
      return `${N} ${F}${H}`;
    }
    return x.format(w);
  }
  function i(w, A) {
    return h(A, Mt("date", w)).format(w);
  }
  function s(w, A) {
    return h(A, Mt("time", w)).format(w);
  }
  function t(w, A) {
    const C = Li(w);
    return C.isOlderThanMonth ? g(w, A) : c(A).format(C.value, C.unit);
  }
  function o(w) {
    const A = w.dom.getAttribute("datetime");
    if (!A) return;
    const C = Y(A);
    if (!C) return;
    const L = w.dom.getAttribute(e) || "short", q = l(w.dom);
    let x;
    switch (L) {
      case "relative":
        x = t(C, q);
        break;
      case "full":
        x = _(C, q);
        break;
      case "date":
        x = i(C, q);
        break;
      case "time":
        x = s(C, q);
        break;
      default:
        x = g(C, q);
        break;
    }
    w.dom.textContent = x, L !== "full" && (w.dom.title = _(C, q));
  }
  function a(w) {
    this.dom = w;
    const A = this;
    return this._onLocaleChange = function() {
      o(A);
    }, Kt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), o(this), w.getAttribute(e) === "relative" && (r.add(this), f()), this;
  }
  a.prototype.render = function() {
    o(this);
  }, a.prototype.destroy = function() {
    this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), r.delete(this), r.size === 0 && y(), delete this.dom[n];
  };
  function b(w) {
    const A = w[n];
    if (!A) return;
    w.getAttribute(e) === "relative" ? (r.add(A), f()) : (r.delete(A), r.size === 0 && y()), o(A);
  }
  function v(w) {
    w.nodeType === 1 && w.hasAttribute && w.hasAttribute(e) && w[n] && o(w[n]);
  }
  M(e, n, a, "ln-time", {
    extraAttributes: ["datetime", "data-ln-time-locale", "lang"],
    onAttributeChange: b,
    onInit: v
  });
})();
function Ti(e = {}) {
  let n = e.windowSize > 0 ? e.windowSize : 1e3, u = e.pageSize > 0 ? e.pageSize : 200, m = e.fetchDebounce != null ? e.fetchDebounce : 120;
  const l = typeof e.requestPage == "function" ? e.requestPage : () => {
  }, h = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Set();
  let r = 0, d = 0, f = 0, y = !1, p = null;
  function _(s, t) {
    h.delete(s), h.set(s, t);
  }
  function g() {
    if (h.size <= n) return [];
    const s = [];
    for (; h.size > n; ) {
      const o = h.keys().next().value;
      s.push(h.get(o)), h.delete(o);
    }
    const t = new Set(h.values());
    return s.filter((o) => !t.has(o));
  }
  function i(s, t) {
    c.add(s), clearTimeout(p), p = setTimeout(() => l(s, u, t), m);
  }
  return {
    get logicalTotal() {
      return r;
    },
    set logicalTotal(s) {
      r = s;
    },
    get grandTotal() {
      return d;
    },
    set grandTotal(s) {
      d = s;
    },
    get queryGen() {
      return f;
    },
    set queryGen(s) {
      f = s;
    },
    get size() {
      return h.size;
    },
    // Whether a server ordering exists for the current query at all — false
    // from reset() until the first ingest(). Distinct from a missing page.
    get hasLoaded() {
      return y;
    },
    getId: (s) => {
      if (!h.has(s)) return;
      const t = h.get(s);
      return _(s, t), t;
    },
    ensure: (s, t, o) => {
      if (!y && !c.has(0)) return i(0, o);
      if (r <= 0) return;
      const a = Math.max(0, s), b = Math.min(r, t);
      for (let v = a; v < b; v++)
        if (!h.has(v)) {
          const w = Math.floor(v / u) * u;
          if (!c.has(w)) return i(w, o);
        }
    },
    ingest: (s, t, o, a, b) => {
      if (b != null && b !== f) return [];
      y = !0, o != null && (d = o), a != null && (r = a);
      for (let v = 0; v < t.length; v++)
        _(s + v, t[v]);
      return c.delete(s), g();
    },
    reset: function() {
      f++, this.clear();
    },
    clear: () => {
      y = !1, h.clear(), c.clear(), clearTimeout(p);
    },
    configure: (s = {}) => {
      s.windowSize > 0 && s.windowSize !== n && (n = s.windowSize, g()), s.pageSize > 0 && (u = s.pageSize), s.fetchDebounce >= 0 && (m = s.fetchDebounce);
    }
  };
}
function qi(e, n, u) {
  if (!Array.isArray(e) || !n || !n.field) return e;
  const { field: m, direction: l } = n, h = l === "desc", c = e.map((d) => d ? d[m] : void 0), r = le(c);
  return [...e].sort((d, f) => {
    const y = d ? d[m] : void 0, p = f ? f[m] : void 0, _ = ce(y, p, r, u);
    return h ? -_ : _;
  });
}
function xi(e, n) {
  if (!Array.isArray(e) || !n || typeof n != "object") return e;
  const u = Object.keys(n).filter((m) => Array.isArray(n[m]) && n[m].length > 0);
  return u.length ? e.filter((m) => m ? u.every((l) => fe(m[l], n[l])) : !1) : e;
}
function ki(e, n, u) {
  if (!Array.isArray(e) || !n || !u || !u.length) return e;
  const m = Je(n);
  return m.length ? e.filter((l) => l ? m.every(
    (h) => u.some((c) => {
      const r = l[c];
      return r != null && Ze(String(r), [h]);
    })
  ) : !1) : e;
}
function Ii(e, n, u) {
  if (!Array.isArray(e) || !e.length) return 0;
  if (u === "count") return e.length;
  const m = e.map((h) => h && h[n] != null ? parseFloat(h[n]) : NaN).filter((h) => Number.isFinite(h)), l = m.reduce((h, c) => h + c, 0);
  return u === "sum" ? l : u === "avg" && m.length ? l / m.length : 0;
}
function Di(e, n = {}, u = [], m) {
  if (!Array.isArray(e))
    return { records: [], total: 0, filtered: 0 };
  const l = e.length;
  let h = e;
  n.filters && (h = xi(h, n.filters)), n.search && (h = ki(h, n.search, u));
  const c = h.length;
  if (n.sort && (h = qi(h, n.sort, m)), n.offset || n.limit) {
    const r = n.offset || 0, d = n.limit || h.length;
    h = h.slice(r, r + d);
  }
  return { records: h, total: l, filtered: c };
}
function Ri(e, n) {
  return !Array.isArray(e) || !n || typeof n != "object" ? e : e.map((u) => {
    if (!u) return null;
    const m = { ...u };
    for (const [l, h] of Object.entries(n))
      if (typeof h == "function")
        try {
          m[l] = h(u);
        } catch {
          m[l] = void 0;
        }
    return m;
  });
}
(function() {
  const e = "data-ln-data-store", n = "lnDataStore", u = "data-ln-data-store-no-local-query";
  if (window[n] !== void 0) return;
  const m = "ln_app_cache", l = "_meta", h = "1.0";
  let c = null, r = null;
  const d = {};
  function f(E) {
    E && E.name === "QuotaExceededError" && S(document, "ln-data-store:quota-exceeded", { error: E });
  }
  function y() {
    const E = {};
    for (const T of document.querySelectorAll(`[${e}]`)) {
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
  function p() {
    return r || (r = new Promise((E) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), E(null);
      const T = y(), k = Object.keys(T), I = indexedDB.open(m);
      I.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), E(null);
      }, I.onsuccess = (R) => {
        const O = R.target.result, P = Array.from(O.objectStoreNames);
        if (!(!P.includes(l) || k.some((it) => !P.includes(it))))
          return _(O), c = O, E(O);
        const j = O.version;
        O.close();
        const G = indexedDB.open(m, j + 1);
        G.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, G.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), E(null);
        }, G.onupgradeneeded = (it) => {
          const J = it.target.result;
          J.objectStoreNames.contains(l) || J.createObjectStore(l, { keyPath: "key" });
          for (const mt of k)
            if (!J.objectStoreNames.contains(mt)) {
              const Ct = J.createObjectStore(mt, { keyPath: "id" });
              for (const Qt of T[mt].indexes)
                Ct.createIndex(Qt, Qt, { unique: !1 });
            }
        }, G.onsuccess = (it) => {
          const J = it.target.result;
          _(J), c = J, E(J);
        };
      };
    }), r);
  }
  function _(E) {
    E.onversionchange = () => {
      E.close(), c = null, r = null;
    };
  }
  function g() {
    return c ? Promise.resolve(c) : (r = null, p());
  }
  async function i(E) {
    if (!ut() || !E) return E;
    const T = { ...E }, k = T.id, I = await Fn(T);
    return !I || !I.encrypted ? E : {
      id: k,
      encrypted: !0,
      iv: I.iv,
      data: I.data
    };
  }
  async function s(E) {
    return !E || !E.encrypted || !ut() ? E : Nn(E);
  }
  const t = (E, T) => g().then((k) => k ? k.transaction(E, T).objectStore(E) : null);
  function o(E) {
    return new Promise((T, k) => {
      E.onsuccess = () => T(E.result), E.onerror = () => {
        f(E.error), k(E.error);
      };
    });
  }
  const a = (E) => t(E, "readonly").then((T) => T ? o(T.getAll()) : []).then((T) => ut() ? Promise.all(T.map((k) => s(k))) : T), b = (E, T) => t(E, "readonly").then((k) => k ? o(k.get(T)) : null).then((k) => k ? s(k) : null), v = (E, T) => g().then((k) => {
    if (!k) return [];
    const R = k.transaction(E, "readonly").objectStore(E), O = T.map((P) => o(R.get(P)));
    return Promise.all(O).then((P) => ut() ? Promise.all(P.map((K) => s(K))) : P);
  }), w = (E, T) => (ut() ? i(T) : Promise.resolve(T)).then((I) => t(E, "readwrite").then((R) => R ? o(R.put(I)) : null)), A = (E, T) => t(E, "readwrite").then((k) => k ? o(k.delete(T)) : null), C = (E) => t(E, "readwrite").then((T) => T ? o(T.clear()) : null), L = (E) => t(E, "readonly").then((T) => T ? o(T.count()) : 0), q = (E) => t(l, "readonly").then((T) => T ? o(T.get(E)) : null), x = (E, T) => t(l, "readwrite").then((k) => {
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
      this._windowIndex = Ti({
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
    return this.windowed = this._windowIndex !== null, this.noLocalQuery = E.hasAttribute(u), this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), d[this._name] = this, F(this), this.ready = hn(this), this;
  }
  function F(E) {
    E._handlers = {
      create: (T) => N(E, "create", T.detail, () => Q(E, T.detail)),
      update: (T) => N(E, "update", T.detail, () => B(E, T.detail)),
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
        k !== E.query.search && (E.query.search = k, Gt(E));
      },
      "ln-filter:change": (T) => {
        T.preventDefault();
        const k = T.detail && T.detail.key;
        if (!k) return;
        const I = (T.detail.values || []).slice(), R = E.query.filters[k];
        (R ? R.length === I.length && R.every((P, K) => P === I[K]) : !I.length) || (I.length ? E.query.filters[k] = I : delete E.query.filters[k], Gt(E));
      },
      "ln-sort:change": (T) => {
        T.preventDefault();
        const k = T.detail && T.detail.field, I = T.detail && T.detail.direction, R = I && I !== "none" ? { field: k, direction: I } : null, O = E.query.sort;
        !O && !R || O && R && O.field === R.field && O.direction === R.direction || (E.query.sort = R, Gt(E));
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
  function H(E, T = 0) {
    return L(E._name).then((k) => {
      if (E._windowIndex || E.windowed) {
        const I = E.totalCount != null ? E.totalCount : k;
        E.totalCount = Math.max(0, I + T);
      } else
        E.totalCount = k;
      return E.hasCache = !0, E.isLoaded = !0, E.canServe = !0, x(E._name, {
        schema_version: h,
        last_synced_at: E.lastSyncedAt,
        has_cache: !0,
        record_count: E.totalCount
      });
    });
  }
  function Q(E, { tempId: T, data: k = {}, requestId: I } = {}) {
    const R = { ...k, id: T };
    return w(E._name, R).then(() => H(E, 1)).then(() => {
      S(E.dom, "ln-data-store:created", { store: E._name, record: R, tempId: T, requestId: I });
    });
  }
  function B(E, { id: T, data: k = {}, requestId: I } = {}) {
    return b(E._name, T).then((R) => {
      if (!R) throw new Error(`Record not found: ${T}`);
      const O = { ...R, ...k }, P = k.id;
      return (P !== void 0 && P !== T ? fn(E._name, T, O) : w(E._name, O)).then(() => H(E, 0)).then(() => {
        S(E.dom, "ln-data-store:updated", { store: E._name, record: O, previous: R, requestId: I });
      });
    });
  }
  function U(E, { id: T, requestId: k } = {}) {
    return b(E._name, T).then((I) => {
      if (!I) {
        S(E.dom, "ln-data-store:deleted", { store: E._name, id: T, requestId: k, missing: !0 });
        return;
      }
      return A(E._name, T).then(() => H(E, -1)).then(() => {
        S(E.dom, "ln-data-store:deleted", { store: E._name, id: T, requestId: k });
      });
    });
  }
  function z(E, { ids: T = [], requestId: k } = {}) {
    return T.length ? Promise.all(T.map((I) => b(E._name, I))).then((I) => {
      const R = I.filter(Boolean).map((O) => O.id);
      return Wt(E._name, R).then(() => H(E, -R.length)).then(() => {
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
  function hn(E) {
    return p().then((T) => {
      if (!T) throw new Error("IndexedDB is unavailable");
      return q(E._name);
    }).then((T) => {
      if (E.initializationError = null, T && T.schema_version === h)
        E.lastSyncedAt = T.last_synced_at || null, E.totalCount = T.record_count || 0, E.hasCache = T.has_cache === !0 || E.totalCount > 0, E.hasCache && (E.isLoaded = !0, E.canServe = !0, S(E.dom, "ln-data-store:ready", { store: E._name, count: E.totalCount, source: "cache" })), E.isInitialized = !0, S(E.dom, "ln-data-store:initialized", { store: E._name, hasCache: E.hasCache, lastSyncedAt: E.lastSyncedAt, count: E.totalCount });
      else {
        if (T && T.schema_version !== h)
          return C(E._name).then(() => x(E._name, { schema_version: h, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            E.isInitialized = !0, E.hasCache = !1, S(E.dom, "ln-data-store:initialized", { store: E._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        E.isInitialized = !0, E.hasCache = !1, S(E.dom, "ln-data-store:initialized", { store: E._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((T) => (E.isInitialized = !0, E.isLoaded = !1, E.canServe = !1, E.hasCache = !1, E.isSyncing = !1, E.initializationError = T, S(E.dom, "ln-data-store:initialization-error", { store: E._name, error: T }), { ok: !1, error: T }));
  }
  function me(E) {
    E.isSyncing = !0, S(E.dom, "ln-data-store:request-remote-sync", { since: E.lastSyncedAt });
  }
  function ge(E, T) {
    return g().then((k) => k ? (ut() ? Promise.all(T.map((R) => i(R))) : Promise.resolve(T)).then((R) => new Promise((O, P) => {
      const K = k.transaction(E, "readwrite"), j = K.objectStore(E);
      R.forEach((G) => j.put(G)), K.oncomplete = () => O(), K.onerror = () => {
        f(K.error), P(K.error);
      };
    })) : void 0);
  }
  function Wt(E, T) {
    return g().then((k) => {
      if (k)
        return new Promise((I, R) => {
          const O = k.transaction(E, "readwrite"), P = O.objectStore(E);
          T.forEach((K) => P.delete(K)), O.oncomplete = () => I(), O.onerror = () => R(O.error);
        });
    });
  }
  function fn(E, T, k) {
    return (ut() ? i(k) : Promise.resolve(k)).then((R) => g().then((O) => {
      if (O)
        return new Promise((P, K) => {
          const j = O.transaction(E, "readwrite"), G = j.objectStore(E);
          G.put(R), G.delete(T), j.oncomplete = () => P(), j.onerror = () => {
            f(j.error), K(j.error);
          };
        });
    }));
  }
  const pn = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function mn(E) {
    return E ? Object.keys(E).filter((T) => Array.isArray(E[T]) && E[T].length > 0) : [];
  }
  function gn(E, T, k) {
    return T.every((I) => k[I].map(String).includes(String(E[I])));
  }
  function _n(E) {
    return String(E || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function bn(E, T, k) {
    return T.every(
      (I) => k.some((R) => {
        const O = E[R];
        return O != null && String(O).toLowerCase().includes(I);
      })
    );
  }
  function yn(E, T, k) {
    return Ii(E, T, k);
  }
  function St(E, T) {
    return Ri(T, E.presenters && E.presenters.computed);
  }
  function vn(E) {
    return !E.sort && !ut();
  }
  function wn(E, T, k) {
    const I = mn(T.filters), R = T.search ? _n(T.search) : [], O = E._searchFields, P = R.length > 0 && O && O.length > 0;
    return t(E._name, "readonly").then((K) => K ? new Promise((j, G) => {
      const it = [], J = K.openCursor();
      J.onsuccess = () => {
        const mt = J.result;
        if (!mt || it.length >= k) {
          j(it);
          return;
        }
        const Ct = mt.value;
        (!I.length || gn(Ct, I, T.filters)) && (!P || bn(Ct, R, O)) && it.push(Ct), mt.continue();
      }, J.onerror = () => G(J.error);
    }) : []);
  }
  function _e(E, T, k) {
    return Di(T, k, E._searchFields, pn);
  }
  function be(E, T, k) {
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
          const it = P.get(String(G));
          K.push(it || null);
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
        } : be(T, k, I);
        return vn(E) ? wn(T, E, R).then((P) => O(P.slice(k, R))) : a(T._name).then((P) => O(_e(T, P, E).records));
      }
      return be(T, k, I);
    }
    return a(T._name).then((k) => {
      const I = _e(T, k, E);
      return {
        data: St(T, I.records),
        total: I.total,
        filtered: I.filtered
      };
    });
  }, D.prototype.getById = function(E) {
    return b(this._name, E).then((T) => T ? St(this, [T])[0] : null);
  }, D.prototype.count = function(E) {
    return E && Object.keys(E).length > 0 ? a(this._name).then((k) => _filter(k, E).length) : this.totalCount != null ? Promise.resolve(this.totalCount) : L(this._name);
  }, D.prototype.aggregate = function(E, T) {
    return a(this._name).then((k) => yn(k, E, T));
  }, D.prototype.setPresenters = function(E) {
    this.presenters = E;
  }, D.prototype.applySync = function(E, T, k, I) {
    I = I || {};
    const R = this;
    if (R._windowIndex && I.queryGen != null && I.queryGen !== R._windowIndex.queryGen)
      return Promise.resolve();
    E.length > 0 || T.length > 0;
    let O = Promise.resolve();
    return E.length > 0 && (O = O.then(() => ge(R._name, E))), T.length > 0 && (O = O.then(() => Wt(R._name, T))), O.then(() => {
      if (R._windowIndex && (I.offset != null || I.total != null)) {
        const P = I.offset != null ? I.offset : 0, K = E.map((G) => G.id), j = R._windowIndex.ingest(P, K, I.total, I.filtered, I.queryGen);
        if (j && j.length) return Wt(R._name, j);
      }
    }).then(() => L(R._name)).then((P) => (R.totalCount = I.total !== void 0 ? I.total : P, R.hasCache = !0, x(R._name, {
      schema_version: h,
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
    return E.length > 0 && (I = I.then(() => ge(k._name, E))), I.then(() => L(k._name)).then((R) => (k.totalCount = T.total !== void 0 ? T.total : R, E.length > 0 && (k.canServe = !0), St(k, E))).catch((R) => (console.error("[ln-data-store] applyQuery failed:", R), []));
  }, D.prototype.forceSync = function() {
    this.isSyncing || me(this);
  }, D.prototype.fullReload = function() {
    const E = this;
    return C(E._name).then(() => x(E._name, {
      schema_version: h,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      E.isLoaded = !1, E.hasCache = !1, E.lastSyncedAt = null, E.totalCount = 0, me(E);
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
    delete d[this._name], delete this.dom[n], S(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function En() {
    return g().then((E) => {
      if (!E) return;
      const T = Array.from(E.objectStoreNames);
      return new Promise((k, I) => {
        const R = E.transaction(T, "readwrite");
        T.forEach((O) => R.objectStore(O).clear()), R.oncomplete = () => k(), R.onerror = () => I(R.error);
      });
    }).then(() => {
      Object.values(d).forEach((E) => {
        E.isLoaded = !1, E.canServe = !1, E.isInitialized = !1, E.initializationError = null, E.hasCache = !1, E.isSyncing = !1, E.lastSyncedAt = null, E.totalCount = 0;
      });
    });
  }
  function Gt(E) {
    E._windowIndex && E._windowIndex.reset(), S(E.dom, "ln-data-store:query-changed", {
      store: E._name,
      query: {
        filters: Object.assign({}, E.query.filters),
        search: E.query.search,
        sort: E.query.sort ? Object.assign({}, E.query.sort) : null
      }
    });
  }
  function An(E, T) {
    const k = E[n];
    !k || T !== u || (k.noLocalQuery = E.hasAttribute(u));
  }
  M(e, n, D, "ln-data-store", {
    extraAttributes: [u],
    onAttributeChange: An
  }), window[n].clearAll = En, window[n].init = window[n], window[n].setStorageKey = ve, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = ve);
})();
const Oi = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function gt(...e) {
  return e.filter((n) => n != null && n !== "").map((n, u) => {
    const m = String(n);
    return u === 0 ? m.replace(/\/+$/, "") : m.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function Mi(e, n) {
  if (!e || typeof e != "object") return "";
  const u = Object.assign({}, Oi);
  if (n && typeof n == "object")
    for (const l in n)
      n[l] !== void 0 && n[l] !== null && n[l] !== "" && (u[l] = n[l]);
  const m = new URLSearchParams();
  return e.search && m.append(u.search, e.search), e.offset != null && m.append(u.offset, e.offset), e.limit != null && m.append(u.limit, e.limit), e.sort && e.sort.field && e.sort.direction && (m.append(u.sortField, e.sort.field), m.append(u.sortDir, e.sort.direction)), e.filters && typeof e.filters == "object" && Object.keys(e.filters).forEach((l) => {
    const h = e.filters[l];
    Array.isArray(h) && h.length > 0 && m.append(l, h.join(","));
  }), m.toString();
}
function Fi(e, n, u) {
  let m = gt(e, n);
  return u && (m += (m.indexOf("?") !== -1 ? "&" : "?") + u), m;
}
function ke(e) {
  const n = e && e.content !== void 0 ? e.content : e, u = e && e.message ? e.message : null;
  return { record: n, message: u };
}
(function() {
  const e = "data-ln-api-connector", n = "lnApiConnector", u = "lnConnector";
  if (window[n] !== void 0) return;
  function m(r) {
    return r.ok ? r.status === 204 ? null : r.json() : r.json().catch(() => null).then((d) => {
      const f = new Error("HTTP " + r.status + ": " + r.statusText);
      throw f.status = r.status, f.data = d, f;
    });
  }
  function l(r) {
    return this.dom = r, r[n] = this, r[u] = this, this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, h(this), this;
  }
  l.prototype.refreshConfig = function() {
    const r = this.dom;
    this.baseUrl = r.getAttribute("data-ln-api-base-url") || "", this.path = r.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin", this.rawHeaders = r.getAttribute("data-ln-api-headers"), this.headers = Ue(this.rawHeaders);
    const d = {}, f = r.getAttribute("data-ln-api-param-offset");
    f && (d.offset = f);
    const y = r.getAttribute("data-ln-api-param-limit");
    y && (d.limit = y);
    const p = r.getAttribute("data-ln-api-param-search");
    p && (d.search = p);
    const _ = r.getAttribute("data-ln-api-param-sort-field");
    _ && (d.sortField = _);
    const g = r.getAttribute("data-ln-api-param-sort-dir");
    g && (d.sortDir = g), this.paramKeys = d;
    const i = r.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = i !== null ? +i : 300, S(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, l.prototype._reqHeaders = function(r) {
    const d = Object.assign({}, this.headers);
    return !d.Accept && !d.accept && (d.Accept = "application/json"), !d["Content-Type"] && !d["content-type"] && (d["Content-Type"] = "application/json"), r && (d["X-Idempotency-Key"] = r), d;
  }, l.prototype.cancel = function(r) {
    return r && this._inflight.has(r) ? (this._inflight.get(r).abort(), this._inflight.delete(r), !0) : !1;
  }, l.prototype.fetchDelta = function(r, d) {
    const f = this;
    let y = gt(f.baseUrl, f.path);
    r != null && r !== "" && (y += (y.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(r));
    const p = d || "sync";
    f._inflight.has(p) && f._inflight.get(p).abort();
    const _ = new AbortController();
    return f._inflight.set(p, _), window.fetch(y, {
      method: "GET",
      headers: f._reqHeaders(),
      credentials: f.credentials,
      signal: _.signal
    }).then(m).finally(function() {
      f._inflight.get(p) === _ && f._inflight.delete(p);
    });
  }, l.prototype.query = function(r, d) {
    const f = this, y = Mi(r, f.paramKeys), p = Fi(f.baseUrl, f.path, y), _ = d || "query";
    f._inflight.has(_) && f._inflight.get(_).abort();
    const g = new AbortController();
    return f._inflight.set(_, g), window.fetch(p, {
      method: "GET",
      headers: f._reqHeaders(),
      credentials: f.credentials,
      signal: g.signal
    }).then(m).finally(function() {
      f._inflight.get(_) === g && f._inflight.delete(_);
    });
  }, l.prototype.create = function(r, d, f) {
    const y = this;
    return window.fetch(gt(y.baseUrl, d || y.path), {
      method: "POST",
      headers: y._reqHeaders(f),
      credentials: y.credentials,
      body: JSON.stringify(r)
    }).then(m);
  }, l.prototype.update = function(r, d, f, y, p) {
    const _ = this;
    f != null && (d = Object.assign({}, d, { expected_version: f }));
    const g = y ? gt(_.baseUrl, y) : gt(_.baseUrl, _.path, r);
    return window.fetch(g, {
      method: "PUT",
      headers: _._reqHeaders(p),
      credentials: _.credentials,
      body: JSON.stringify(d)
    }).then(m);
  }, l.prototype.delete = function(r, d, f) {
    const y = this;
    return window.fetch(gt(y.baseUrl, d || y.path, r), {
      method: "DELETE",
      headers: y._reqHeaders(f),
      credentials: y.credentials
    }).then(m);
  }, l.prototype.bulkDelete = function(r, d, f) {
    const y = this;
    return window.fetch(gt(y.baseUrl, d || y.path, "bulk-delete"), {
      method: "DELETE",
      headers: y._reqHeaders(f),
      credentials: y.credentials,
      body: JSON.stringify({ ids: r })
    }).then(m);
  };
  function h(r) {
    r._handlers = {
      sync: function(d) {
        const f = d.detail || {}, y = f.meta && f.meta.targetEl ? f.meta.targetEl : null;
        r.fetchDelta(f.since, y).then(function(p) {
          S(r.dom, "ln-api-connector:fetched", { data: p, since: f.since, meta: f.meta || null });
        }).catch(function(p) {
          p && p.name === "AbortError" || S(r.dom, "ln-api-connector:error", {
            action: "sync",
            error: p.message,
            status: p.status || 0,
            data: p.data || null,
            since: f.since,
            meta: f.meta || null
          });
        });
      },
      query: function(d) {
        const f = d.detail || {}, y = f.query || f, p = f.meta && f.meta.targetEl ? f.meta.targetEl : null, _ = p || "query", g = r.queryDebounce;
        function i(t, o, a) {
          r.query(o, a).then(function(b) {
            const v = b || {};
            S(r.dom, "ln-api-connector:fetched", {
              data: v.data || (Array.isArray(v) ? v : []),
              total: v.total,
              filtered: v.filtered,
              offset: o.offset,
              queryGen: o.queryGen,
              meta: t.meta || null
            });
          }).catch(function(b) {
            b && b.name === "AbortError" || S(r.dom, "ln-api-connector:error", {
              action: "query",
              error: b.message,
              status: b.status || 0,
              data: b.data || null,
              meta: t.meta || null
            });
          });
        }
        if (g === 0) {
          i(f, y, p);
          return;
        }
        r._queryTimers.has(_) && clearTimeout(r._queryTimers.get(_));
        const s = setTimeout(function() {
          r._queryTimers.delete(_), i(f, y, p);
        }, g);
        r._queryTimers.set(_, s);
      },
      cancel: function(d) {
        const f = d.detail || {}, y = f.meta && f.meta.targetEl ? f.meta.targetEl : f.targetEl || f.key;
        y && r.cancel(y);
      },
      create: function(d) {
        const f = d.detail || {};
        r.create(f.data, f.url, f.idempotencyKey).then(function(y) {
          const p = ke(y);
          S(r.dom, "ln-api-connector:created", {
            record: p.record,
            tempId: f.tempId,
            message: p.message,
            meta: f.meta || null
          });
        }).catch(function(y) {
          y && y.name === "AbortError" || S(r.dom, "ln-api-connector:error", {
            action: "create",
            error: y.message,
            status: y.status || 0,
            data: y.data || null,
            tempId: f.tempId,
            meta: f.meta || null
          });
        });
      },
      update: function(d) {
        const f = d.detail || {};
        r.update(f.id, f.data, f.expected_version, f.url, f.idempotencyKey).then(function(y) {
          const p = ke(y);
          S(r.dom, "ln-api-connector:updated", {
            record: p.record,
            id: f.id,
            message: p.message,
            meta: f.meta || null
          });
        }).catch(function(y) {
          y && y.name === "AbortError" || S(r.dom, "ln-api-connector:error", {
            action: "update",
            error: y.message,
            status: y.status || 0,
            data: y.data || null,
            id: f.id,
            conflictData: y.status === 409 ? y.data : null,
            meta: f.meta || null
          });
        });
      },
      delete: function(d) {
        const f = d.detail || {};
        r.delete(f.id, f.url, f.idempotencyKey).then(function(y) {
          const p = y && y.message ? y.message : null;
          S(r.dom, "ln-api-connector:deleted", {
            response: y,
            id: f.id,
            message: p,
            meta: f.meta || null
          });
        }).catch(function(y) {
          y && y.name === "AbortError" || S(r.dom, "ln-api-connector:error", {
            action: "delete",
            error: y.message,
            status: y.status || 0,
            data: y.data || null,
            id: f.id,
            meta: f.meta || null
          });
        });
      },
      bulkDelete: function(d) {
        const f = d.detail || {};
        r.bulkDelete(f.ids, f.url, f.idempotencyKey).then(function(y) {
          const p = y && y.message ? y.message : null;
          S(r.dom, "ln-api-connector:bulk-deleted", {
            response: y,
            ids: f.ids,
            message: p,
            meta: f.meta || null
          });
        }).catch(function(y) {
          y && y.name === "AbortError" || S(r.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: y.message,
            status: y.status || 0,
            data: y.data || null,
            ids: f.ids,
            meta: f.meta || null
          });
        });
      }
    }, r.dom.addEventListener("ln-api-connector:request-sync", r._handlers.sync), r.dom.addEventListener("ln-api-connector:request-query", r._handlers.query), r.dom.addEventListener("ln-api-connector:request-fetch", r._handlers.query), r.dom.addEventListener("ln-api-connector:request-cancel", r._handlers.cancel), r.dom.addEventListener("ln-api-connector:request-create", r._handlers.create), r.dom.addEventListener("ln-api-connector:request-update", r._handlers.update), r.dom.addEventListener("ln-api-connector:request-delete", r._handlers.delete), r.dom.addEventListener("ln-api-connector:request-bulk-delete", r._handlers.bulkDelete);
  }
  l.prototype.destroy = function() {
    if (!this.dom[n]) return;
    const r = this;
    r._inflight && (r._inflight.forEach(function(d) {
      d.abort();
    }), r._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(d) {
      d && clearTimeout(d);
    }), this._queryTimers.clear()), this._handlers && (r.dom.removeEventListener("ln-api-connector:request-sync", r._handlers.sync), r.dom.removeEventListener("ln-api-connector:request-query", r._handlers.query), r.dom.removeEventListener("ln-api-connector:request-fetch", r._handlers.query), r.dom.removeEventListener("ln-api-connector:request-cancel", r._handlers.cancel), r.dom.removeEventListener("ln-api-connector:request-create", r._handlers.create), r.dom.removeEventListener("ln-api-connector:request-update", r._handlers.update), r.dom.removeEventListener("ln-api-connector:request-delete", r._handlers.delete), r.dom.removeEventListener("ln-api-connector:request-bulk-delete", r._handlers.bulkDelete), r._handlers = null), S(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[n], delete this.dom[u];
  };
  function c(r) {
    const d = r[n];
    d && d.refreshConfig();
  }
  M(e, n, l, "ln-api-connector", {
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
  const e = "data-ln-couchdb-connector", n = "lnCouchDbConnector", u = "lnConnector";
  if (window[n] !== void 0) return;
  function m(_) {
    const g = _ && _.content !== void 0 ? _.content : _, i = _ && _.message ? _.message : null;
    return { content: g, message: i };
  }
  function l(_) {
    return this.dom = _, _[n] = this, _[u] = this, this.refreshConfig(), this._handlers = null, y(this), this;
  }
  l.prototype.refreshConfig = function() {
    const _ = this.dom;
    this.url = _.getAttribute("data-ln-couchdb-url") || "", this.db = _.getAttribute("data-ln-couchdb-db") || "", this.auth = _.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const g = _.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = Ue(g, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), g.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(_, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function h(_, g, i) {
    const s = Object.assign({}, Lt(_.headers, _.auth), i || {});
    return g && (s["Idempotency-Key"] = g), s;
  }
  l.prototype.fetchDelta = function(_) {
    const g = this, i = ["include_docs=true", "feed=normal"];
    _ && i.push("since=" + encodeURIComponent(_));
    const s = dt(g.url, g.db, "_changes") + "?" + i.join("&");
    return window.fetch(s, { method: "GET", headers: Lt(g.headers, g.auth), credentials: g.credentials }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const o = t.results || [];
      return {
        data: o.filter((a) => !a.deleted && a.doc).map((a) => Object.assign({}, a.doc, { id: a.doc._id })),
        deleted: o.filter((a) => a.deleted).map((a) => a.id),
        synced_at: t.last_seq || _ || ""
      };
    });
  };
  function c(_, g, i) {
    const s = Object.assign({ _id: g.id }, g);
    return s._id || delete s._id, window.fetch(dt(_.url, _.db), {
      method: "POST",
      headers: h(_, i),
      credentials: _.credentials,
      body: JSON.stringify(s)
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const o = m(t), a = o.content;
      return { record: Object.assign({}, s, { id: a.id, _id: a.id, _rev: a.rev }), message: o.message };
    });
  }
  l.prototype.create = function(_, g) {
    return c(this, _, g).then((i) => i.record);
  };
  function r(_, g, i, s) {
    const t = Object.assign({ id: String(g), _id: String(g) }, i), o = t._rev || t.rev;
    return (o ? Promise.resolve(o) : window.fetch(dt(_.url, _.db, null, g), { method: "GET", headers: Lt(_.headers, _.auth), credentials: _.credentials }).then((b) => {
      if (!b.ok) throw new Error("Could not retrieve document for revision mapping");
      return b.json().then((v) => v._rev);
    })).then((b) => {
      const v = Object.assign({}, t, { _rev: b });
      delete v.rev;
      const w = h(_, s, { "If-Match": b });
      return window.fetch(dt(_.url, _.db, null, g), {
        method: "PUT",
        headers: w,
        credentials: _.credentials,
        body: JSON.stringify(v)
      }).then((A) => {
        if (A.ok) return A.json().then((C) => {
          const L = m(C);
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
  l.prototype.update = function(_, g, i) {
    return r(this, _, g, i).then((s) => s.record);
  };
  function d(_, g, i, s) {
    return (i ? Promise.resolve(i) : window.fetch(dt(_.url, _.db, null, g), { method: "GET", headers: Lt(_.headers, _.auth), credentials: _.credentials }).then((o) => {
      if (!o.ok) throw new Error("Could not retrieve document for revision delete");
      return o.json().then((a) => a._rev);
    })).then((o) => {
      const a = dt(_.url, _.db, null, g) + "?rev=" + encodeURIComponent(o);
      return window.fetch(a, { method: "DELETE", headers: h(_, s), credentials: _.credentials }).then((b) => {
        if (!b.ok) throw new Error("HTTP " + b.status + ": " + b.statusText);
        return b.json();
      }).then((b) => {
        const v = m(b);
        return { response: v.content, message: v.message };
      });
    });
  }
  l.prototype.delete = function(_, g, i) {
    return d(this, _, g, i).then((s) => s.response);
  };
  function f(_, g, i) {
    return !g || g.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(dt(_.url, _.db, "_all_docs"), {
      method: "POST",
      headers: Lt(_.headers, _.auth),
      credentials: _.credentials,
      body: JSON.stringify({ keys: g })
    }).then((s) => {
      if (!s.ok) throw new Error("HTTP " + s.status + ": " + s.statusText);
      return s.json();
    }).then((s) => {
      const o = (s.rows || []).filter((a) => !a.error && a.value && a.value.rev).map((a) => ({ _id: a.id, _rev: a.value.rev, _deleted: !0 }));
      return o.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(dt(_.url, _.db, "_bulk_docs"), {
        method: "POST",
        headers: h(_, i),
        credentials: _.credentials,
        body: JSON.stringify({ docs: o })
      }).then((a) => {
        if (!a.ok) throw new Error("HTTP " + a.status + ": " + a.statusText);
        return a.json();
      }).then((a) => {
        const b = m(a);
        return { response: { ok: !0, results: b.content, deletedCount: o.length }, message: b.message };
      });
    });
  }
  l.prototype.bulkDelete = function(_, g) {
    return f(this, _, g).then((i) => i.response);
  };
  function y(_) {
    _._handlers = {
      sync: function(i) {
        const s = i.detail || {};
        _.fetchDelta(s.since).then(function(t) {
          S(_.dom, "ln-couchdb-connector:fetched", { data: t, since: s.since, meta: s.meta || null });
        }).catch(function(t) {
          S(_.dom, "ln-couchdb-connector:error", {
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
        c(_, s.data, s.idempotencyKey).then(function(t) {
          S(_.dom, "ln-couchdb-connector:created", { record: t.record, tempId: s.tempId, message: t.message, meta: s.meta || null });
        }).catch(function(t) {
          S(_.dom, "ln-couchdb-connector:error", {
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
        s.expected_version !== void 0 && (t._rev = s.expected_version), r(_, s.id, t, s.idempotencyKey).then(function(o) {
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
      delete: function(i) {
        const s = i.detail || {};
        d(_, s.id, s.rev, s.idempotencyKey).then(function(t) {
          S(_.dom, "ln-couchdb-connector:deleted", { response: t.response, id: s.id, message: t.message, meta: s.meta || null });
        }).catch(function(t) {
          S(_.dom, "ln-couchdb-connector:error", {
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
        f(_, s.ids, s.idempotencyKey).then(function(t) {
          S(_.dom, "ln-couchdb-connector:bulk-deleted", { response: t.response, ids: s.ids, message: t.message, meta: s.meta || null });
        }).catch(function(t) {
          S(_.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: t.message,
            status: t.status || 0,
            ids: s.ids,
            meta: s.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector"].forEach(function(i) {
      _.dom.addEventListener(i + ":request-sync", _._handlers.sync), _.dom.addEventListener(i + ":request-fetch", _._handlers.sync), _.dom.addEventListener(i + ":request-create", _._handlers.create), _.dom.addEventListener(i + ":request-update", _._handlers.update), _.dom.addEventListener(i + ":request-delete", _._handlers.delete), _.dom.addEventListener(i + ":request-bulk-delete", _._handlers.bulkDelete);
    });
  }
  l.prototype.destroy = function() {
    if (!this.dom[n]) return;
    const _ = this;
    _._handlers && (["ln-couchdb-connector", "ln-api-connector"].forEach(function(i) {
      _.dom.removeEventListener(i + ":request-sync", _._handlers.sync), _.dom.removeEventListener(i + ":request-fetch", _._handlers.sync), _.dom.removeEventListener(i + ":request-create", _._handlers.create), _.dom.removeEventListener(i + ":request-update", _._handlers.update), _.dom.removeEventListener(i + ":request-delete", _._handlers.delete), _.dom.removeEventListener(i + ":request-bulk-delete", _._handlers.bulkDelete);
    }), _._handlers = null), S(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[n], delete this.dom[u];
  };
  function p(_) {
    const g = _[n];
    g && g.refreshConfig();
  }
  M(e, n, l, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: p
  });
})();
function Ni(e) {
  return e = e || {}, {
    sort: e.sort,
    filters: e.filters,
    search: e.search,
    offset: e.offset,
    limit: e.limit,
    queryGen: e.queryGen
  };
}
function Ft(e, n) {
  const u = !e || !!e.initializationError, m = !!(e && e.noLocalQuery && !e.windowed);
  return n && (u || !e.canServe || m) ? "remote" : e && !e.initializationError ? "store" : "none";
}
function Ie(e, n) {
  const u = Object.assign({}, e);
  return n && (u.filters = n.filters, u.search = n.search, u.sort = n.sort), u;
}
class Pi {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(n) {
    return new Promise((u, m) => {
      this._pending.set(n, { resolve: u, reject: m });
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
    for (const m of this._pending.values()) m.reject(u);
    this._pending.clear();
  }
  _settle(n, u) {
    const m = n && n.requestId;
    if (!m) return !1;
    const l = this._pending.get(m);
    return l ? (this._pending.delete(m), u ? l.reject(n.error || new Error("Store mutation failed")) : l.resolve(n), !0) : !1;
  }
}
(function() {
  const e = "data-ln-data-coordinator", n = "lnDataCoordinator", u = "lnCoordinator", m = "data-ln-form-scope";
  if (window[n] !== void 0) return;
  const l = /* @__PURE__ */ new Set();
  let h = !1, c = null, r = null, d = null;
  function f() {
    h || (h = !0, c = function() {
      S(document, "ln-data-store:online", {}), l.forEach(function(t) {
        t._maybeSync();
      });
    }, r = function() {
      S(document, "ln-data-store:offline", {});
    }, d = function() {
      document.visibilityState === "visible" && l.forEach(function(t) {
        const o = t.findChildren(), a = o.store;
        a && o.connector && a.isInitialized && !a.initializationError && !a.isSyncing && !t._noAutosync && (!a.hasCache || t._isStale()) && a.forceSync();
      });
    }, window.addEventListener("online", c), window.addEventListener("offline", r), document.addEventListener("visibilitychange", d));
  }
  function y() {
    h && (l.size > 0 || (window.removeEventListener("online", c), window.removeEventListener("offline", r), document.removeEventListener("visibilitychange", d), c = null, r = null, d = null, h = !1));
  }
  function p() {
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
  function g(t) {
    return this.dom = t, this._name = t.id, this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", t), t[n] = this, t[u] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new Pi(), this._dict = zt(t, "data-ln-data-coordinator-dict"), this._parseStaleAttributes(), this.refreshMapper(), i(this), l.add(this), f(), this._checkInitialSync(), this;
  }
  g.prototype._parseStaleAttributes = function() {
    const o = this.findChildren().storeEl, a = this.dom.getAttribute("data-ln-data-coordinator-stale") || (o ? o.getAttribute("data-ln-data-store-stale") : null), b = parseInt(a, 10);
    this._staleThreshold = a === "never" || a === "-1" ? -1 : isNaN(b) ? 300 : b;
    const v = this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (o ? o.hasAttribute("data-ln-data-store-no-autosync") : !1);
    this._noAutosync = !!v;
  }, g.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const o = this.findChildren().store;
    return !o || !o.lastSyncedAt ? !0 : Date.now() / 1e3 - o.lastSyncedAt > this._staleThreshold;
  }, g.prototype._maybeSync = function() {
    const t = this.findChildren(), o = t.store;
    !o || o.initializationError || !t.connector || this._noAutosync || !o.isInitialized || o.isSyncing || (!o.hasCache || this._isStale()) && o.forceSync();
  }, g.prototype._checkInitialSync = function() {
    const t = this, a = this.findChildren().store;
    a && Promise.resolve(a.ready).then(function() {
      const b = t.findChildren(), v = b.store;
      if (v && v.initializationError) {
        t._reportReconciliationError("store-initialize", v.initializationError, null);
        return;
      }
      !v || !b.connector || t._noAutosync || v.isSyncing || (!v.hasCache || t._isStale()) && v.forceSync();
    }).catch(function(b) {
      t._reportReconciliationError("store-initialize", b, null);
    });
  }, g.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const o = this.dom.getAttribute("data-ln-data-mapper") || this.dom.id;
    o && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(o)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(a) {
      return a;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(a) {
      return a;
    });
  }, g.prototype.findChildren = function() {
    const t = this.dom.querySelector("[data-ln-data-store]"), o = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]"), a = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: t,
      connectorEl: o,
      queueEl: a,
      store: t ? t.lnDataStore || t.lnStore : null,
      connector: o ? o.lnConnector || o.lnApiConnector || o.lnCouchDbConnector : null,
      queue: a ? a.lnApiQueue : null
    };
  }, g.prototype._handleSubmitRecord = function(t) {
    const o = this.findChildren();
    if (!o.storeEl) {
      console.warn('[ln-data-coordinator] form submit claimed but no [data-ln-data-store] child found in "' + (this._name || "") + '"');
      return;
    }
    const a = t.data || {}, b = a.id, v = a.expected_version, w = Object.assign({}, a);
    delete w.id, delete w.expected_version;
    const A = t.method.toUpperCase();
    A === "POST" ? this._fanOutCreate(o, w, t.action) : (A === "PUT" || A === "PATCH") && this._fanOutUpdate(o, b, w, v, t.action);
  }, g.prototype._fanOutCreate = function(t, o, a) {
    this.refreshMapper();
    const b = "_temp_" + p();
    S(t.storeEl, "ln-data-store:request-create", { tempId: b, data: o }), t.queue ? S(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: b,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(o),
      expectedVersion: null,
      meta: { tempId: b, action: a }
    }) : t.connector && S(t.connectorEl, "ln-api-connector:request-create", {
      data: this.mapper.egress(o),
      url: a,
      meta: { entryId: p(), queued: !1, op: "create", tempId: b }
    });
  }, g.prototype._fanOutUpdate = function(t, o, a, b, v) {
    this.refreshMapper(), S(t.storeEl, "ln-data-store:request-update", { id: o, data: a }), t.queue ? S(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: o,
      op: "update",
      targetId: o,
      payload: this.mapper.egress(a),
      expectedVersion: b,
      meta: { id: o, action: v }
    }) : t.connector && S(t.connectorEl, "ln-api-connector:request-update", {
      id: o,
      data: this.mapper.egress(a),
      expected_version: b,
      url: v,
      meta: { entryId: p(), queued: !1, op: "update", id: o }
    });
  }, g.prototype._fanOutDelete = function(t, o) {
    this.refreshMapper(), S(t.storeEl, "ln-data-store:request-delete", { id: o }), t.queue ? S(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: o,
      op: "delete",
      targetId: o,
      payload: null,
      expectedVersion: null,
      meta: { id: o }
    }) : t.connector && S(t.connectorEl, "ln-api-connector:request-delete", {
      id: o,
      meta: { entryId: p(), queued: !1, op: "delete", id: o }
    });
  }, g.prototype._fanOutBulkDelete = function(t, o) {
    this.refreshMapper();
    const a = o.join(",");
    S(t.storeEl, "ln-data-store:request-bulk-delete", { ids: o }), t.queue ? S(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: a,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: o },
      expectedVersion: null,
      meta: { bulkKey: a, ids: o }
    }) : t.connector && S(t.connectorEl, "ln-api-connector:request-bulk-delete", {
      ids: o,
      meta: { entryId: p(), queued: !1, op: "bulk-delete", bulkKey: a }
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
    const o = this._dict[t];
    o && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: "error", title: "", message: o }
    }));
  }, g.prototype._requestStoreMutation = function(t, o, a) {
    const b = t.storeEl;
    if (!b) return Promise.reject(new Error("Store element not found"));
    const v = p(), w = this._mutationReceipts.wait(v);
    return S(b, "ln-data-store:request-" + o, Object.assign({}, a, { requestId: v })), w;
  }, g.prototype._reportReconciliationError = function(t, o, a) {
    S(this.dom, "ln-data-coordinator:error", {
      operation: t,
      error: o,
      meta: a || null
    });
  };
  function i(t) {
    t._handlers = {
      sync: function(o) {
        t.refreshMapper();
        const a = t.findChildren();
        if (!a.store || !a.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        S(a.connectorEl, "ln-api-connector:request-sync", { since: o.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(o) {
        const a = t.findChildren();
        if (!a.connectorEl) return;
        const b = o.detail || {};
        S(a.connectorEl, "ln-api-connector:request-query", {
          query: Object.assign({}, b.query, {
            offset: b.offset,
            limit: b.limit,
            queryGen: b.queryGen
          })
        });
      },
      reqCreate: function(o) {
        const a = t.findChildren();
        a.storeEl && t._fanOutCreate(a, o.detail.data || {}, o.detail.action);
      },
      reqUpdate: function(o) {
        const a = t.findChildren();
        a.storeEl && t._fanOutUpdate(a, o.detail.id, o.detail.data || {}, o.detail.expected_version, o.detail.action);
      },
      reqDelete: function(o) {
        const a = t.findChildren();
        a.storeEl && t._fanOutDelete(a, o.detail.id);
      },
      reqBulkDelete: function(o) {
        const a = t.findChildren();
        a.storeEl && t._fanOutBulkDelete(a, o.detail.ids || []);
      },
      queueFailed: function() {
        t._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(o) {
        t.refreshMapper();
        const a = t.findChildren();
        if (!a.store || !a.connector || !a.queue) return;
        const b = o.detail || {}, v = b.entryId, w = b.op, A = b.targetId, C = b.payload, L = b.expectedVersion, q = b.meta || {}, x = q.action || null, D = b.idempotencyKey || v;
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
        const b = a.hasAttribute(m) ? a.getAttribute(m) : null;
        if (b === null) return;
        let v;
        if (b ? v = b === t._name : v = a.closest("[data-ln-data-coordinator]") === t.dom, !v) return;
        const w = qn(a);
        if (w !== "POST" && w !== "PUT" && w !== "PATCH") return;
        o.preventDefault();
        const A = Ne(a);
        delete A._method, delete A._token, t._handleSubmitRecord({ data: A, method: w, action: a.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(o) {
        const a = o.detail.meta || {}, b = t.findChildren();
        t.refreshMapper();
        const v = o.detail.data;
        let w = [], A = [], C = null;
        Array.isArray(v) ? (w = v, C = Math.floor(Date.now() / 1e3)) : v && (w = Array.isArray(v.data) ? v.data : [], A = Array.isArray(v.deleted) ? v.deleted : [], C = v.synced_at !== void 0 ? v.synced_at : v.since !== void 0 ? v.since : null);
        const L = w.map((q) => t.mapper.ingress(q));
        if (b.store && !b.store.initializationError)
          a.kind ? a.kind === "table" || a.kind === "list" || a.kind === "chart" ? b.store.applyQuery(L, { total: o.detail.total }).then(function(q) {
            S(a.targetEl, "ln-" + a.kind + ":set-loading", { loading: !1 }), S(a.targetEl, "ln-" + a.kind + ":set-data", {
              data: q,
              total: o.detail.total !== void 0 ? o.detail.total : q.length,
              filtered: o.detail.filtered !== void 0 ? o.detail.filtered : q.length,
              offset: o.detail.offset,
              queryGen: o.detail.queryGen
            }), t._boundDelivered.set(a.targetEl, !0);
          }) : a.kind === "options" ? b.store.applyQuery(L, { total: o.detail.total }).then(function() {
            return b.store.getAll({});
          }).then(function(q) {
            S(a.targetEl, "ln-options:set-data", { data: q.data });
          }) : a.kind === "stat" && b.store.applyQuery(L, { total: o.detail.total }).then(function() {
            const q = o.detail.filtered !== void 0 ? o.detail.filtered : o.detail.total !== void 0 ? o.detail.total : L.length;
            S(a.targetEl, "ln-stat:set-count", { count: q });
          }) : b.store.applySync(L, A, C || Math.floor(Date.now() / 1e3), {
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
            }), t._boundDelivered.set(a.targetEl, !0);
          else if (a.kind === "options")
            S(a.targetEl, "ln-options:set-data", { data: L });
          else if (a.kind === "stat") {
            const q = o.detail.filtered !== void 0 ? o.detail.filtered : o.detail.total !== void 0 ? o.detail.total : L.length;
            S(a.targetEl, "ln-stat:set-count", { count: q });
          }
        }
      },
      connCreated: function(o) {
        const a = t.findChildren();
        if (!a.storeEl) return;
        const b = o.detail.meta || {}, v = t.mapper.ingress(o.detail.record);
        t._requestStoreMutation(a, "update", { id: b.tempId, data: v }).then(function() {
          t._toastFromMessage(o.detail.message), b.queued && a.queue && S(a.queueEl, "ln-api-queue:resolve-create", {
            entryId: b.entryId,
            oldKey: b.tempId,
            newId: v.id
          });
        }).catch(function(w) {
          t._reportReconciliationError("create-reconcile", w, b);
        });
      },
      connUpdated: function(o) {
        const a = t.findChildren();
        if (!a.storeEl) return;
        const b = o.detail.meta || {}, v = t.mapper.ingress(o.detail.record);
        t._requestStoreMutation(a, "update", { id: b.id, data: v }).then(function() {
          t._toastFromMessage(o.detail.message), b.queued && a.queue && S(a.queueEl, "ln-api-queue:ack", { entryId: b.entryId });
        }).catch(function(w) {
          t._reportReconciliationError("update-reconcile", w, b);
        });
      },
      connDeleted: function(o) {
        const a = t.findChildren();
        if (!a.storeEl) return;
        const b = o.detail.meta || {};
        t._toastFromMessage(o.detail.message), b.queued && a.queue && S(a.queueEl, "ln-api-queue:ack", { entryId: b.entryId });
      },
      connBulkDeleted: function(o) {
        const a = t.findChildren();
        if (!a.storeEl) return;
        const b = o.detail.meta || {};
        t._toastFromMessage(o.detail.message), b.queued && a.queue && S(a.queueEl, "ln-api-queue:ack", { entryId: b.entryId });
      },
      connError: function(o) {
        const a = o.detail || {}, b = a.meta || {}, v = b.op || a.action, w = a.status || 0, A = t.findChildren();
        if (v === "sync") {
          A.storeEl && S(A.storeEl, "ln-data-store:request-sync-failed", {
            error: a.error,
            status: w
          }), console.error("[ln-data-coordinator] Sync failed:", a.error);
          return;
        }
        if (v === "query") {
          b.targetEl && b.kind && (S(b.targetEl, "ln-" + b.kind + ":set-loading", { loading: !1 }), (b.kind === "table" || b.kind === "list") && S(b.targetEl, "ln-" + b.kind + ":page-failed", { offset: b.offset })), t._reportReconciliationError("query", a.error || a, b);
          return;
        }
        if (!A.storeEl) return;
        const C = w === 401 || w === 419, L = w === 0 || w >= 500, q = w === 409 || w === 412;
        if (C) {
          t._toastFromDict("auth"), b.queued && A.queue && S(A.queueEl, "ln-api-queue:nack", { entryId: b.entryId, reason: "auth" });
          return;
        }
        if (L) {
          b.queued && A.queue ? S(A.queueEl, "ln-api-queue:nack", { entryId: b.entryId, reason: "retry" }) : t._toastFromDict("network");
          return;
        }
        let x = Promise.resolve();
        if (q && v === "update") {
          const D = a.data && a.data.remote ? t.mapper.ingress(a.data.remote) : null;
          D && (x = t._requestStoreMutation(A, "update", { id: b.id, data: D })), t._toastFromDict("conflict");
        } else v === "create" && (x = t._requestStoreMutation(A, "delete", { id: b.tempId })), t._toastFromDict("rejected");
        b.queued && A.queue ? x.then(function() {
          S(A.queueEl, "ln-api-queue:nack", { entryId: b.entryId, reason: "drop" });
        }).catch(function(D) {
          t._reportReconciliationError("deterministic-reconcile", D, b);
        }) : x.catch(function(D) {
          t._reportReconciliationError("deterministic-reconcile", D, b);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(o) {
        const a = t.findChildren(), b = a.store;
        if (!b || b.initializationError || !a.connector || t._noAutosync || b.isSyncing) return;
        (o.detail || {}).hasCache ? t._isStale() && b.forceSync() : b.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(o) {
        t._serveData(o, "table");
      },
      reqListData: function(o) {
        t._serveData(o, "list");
      },
      reqChartData: function(o) {
        t._serveData(o, "chart");
      },
      reqOptions: function(o) {
        t._serveOptions(o);
      },
      reqStat: function(o) {
        t._serveStat(o);
      },
      refreshQuery: function() {
        t._refreshAll(null, !0);
      },
      refresh: function(o) {
        t._mutationReceipts.resolve(o.detail), t._refreshAll(null, !1);
      },
      mutationError: function(o) {
        t._mutationReceipts.reject(o.detail);
      },
      refreshSynced: function(o) {
        o.detail && o.detail.changed && t._refreshAll(o.detail.meta, !1);
      }
    }, t.dom.addEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.addEventListener("ln-data-store:request-page", t._handlers.requestPage), t.dom.addEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.addEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.addEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.addEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.addEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.addEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.addEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.addEventListener("submit", t._handlers.formSubmit), _.forEach(function(o) {
      t.dom.addEventListener(o + ":fetched", t._handlers.connFetched), t.dom.addEventListener(o + ":created", t._handlers.connCreated), t.dom.addEventListener(o + ":updated", t._handlers.connUpdated), t.dom.addEventListener(o + ":deleted", t._handlers.connDeleted), t.dom.addEventListener(o + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.addEventListener(o + ":error", t._handlers.connError);
    }), document.addEventListener("ln-table:request-data", t._handlers.reqTableData), document.addEventListener("ln-list:request-data", t._handlers.reqListData), document.addEventListener("ln-chart:request-data", t._handlers.reqChartData), document.addEventListener("ln-options:request-data", t._handlers.reqOptions), document.addEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.addEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.addEventListener("ln-data-store:created", t._handlers.refresh), t.dom.addEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.addEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.addEventListener("ln-data-store:mutation-error", t._handlers.mutationError), t.dom.addEventListener("ln-data-store:synced", t._handlers.refreshSynced), t.dom.addEventListener("ln-data-store:query-changed", t._handlers.refreshQuery);
  }
  g.prototype._ownsStore = function(t) {
    const o = this.findChildren();
    return !!(o.store && o.store._name === t && t);
  }, g.prototype._serveData = function(t, o) {
    const a = t.target, b = o === "table" ? "data-ln-table-source" : o === "list" ? "data-ln-list-source" : "data-ln-chart-source", v = a.getAttribute(b);
    if (!v || !this._ownsStore(v)) return;
    const w = t.detail || {}, A = Ni(w);
    this._boundQueries.set(a, A);
    const C = this.findChildren(), L = this, q = C.store;
    return (q && q.ready ? q.ready : Promise.resolve()).then(function() {
      const D = Ft(q, C.connector), F = Ie(A, q && q.query);
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
        const H = {
          data: N.data,
          total: N.total,
          filtered: N.filtered,
          offset: w.offset !== void 0 ? w.offset : N.offset,
          queryGen: w.queryGen !== void 0 ? w.queryGen : N.queryGen,
          // The store answered from its own records while the server query
          // is still out; the view renders it but keeps the refresh showing.
          provisional: N.provisional === !0
        };
        S(a, "ln-" + o + ":set-data", H), L._boundDelivered.set(a, !0);
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
  }, g.prototype._serveOptions = function(t) {
    const o = t.target, a = o.getAttribute("data-ln-options");
    if (!this._ownsStore(a)) return;
    const b = this.findChildren(), v = b.store, w = v && v.ready ? v.ready : Promise.resolve(), A = this;
    return w.then(function() {
      const C = Ft(v, b.connector);
      if (C === "remote") {
        S(b.connectorEl, "ln-api-connector:request-query", {
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
  }, g.prototype._serveStat = function(t) {
    const o = t.target, a = o.getAttribute("data-ln-stat");
    if (!this._ownsStore(a)) return;
    const b = t.detail && t.detail.filters ? t.detail.filters : null, v = this.findChildren(), w = v.store, A = w && w.ready ? w.ready : Promise.resolve(), C = this;
    return A.then(function() {
      const L = b && Object.keys(b).length > 0, x = !!(v.connector && w && ((w.windowed || w._windowIndex) && L || w.noLocalQuery)) ? "remote" : Ft(w, v.connector);
      if (x === "remote") {
        S(v.connectorEl, "ln-api-connector:request-query", {
          query: { filters: b },
          meta: { targetEl: o, kind: "stat" }
        });
        return;
      }
      if (x === "store")
        return w.count(b).then(function(D) {
          S(o, "ln-stat:set-count", { count: D });
        });
    }).catch(function(L) {
      C._reportReconciliationError("stat-query", L, { targetEl: o, kind: "stat" });
    });
  }, g.prototype._refreshAll = function(t, o) {
    const a = this, b = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let v = 0; v < b.length; v++) {
      const w = b[v];
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
        const x = a._boundQueries.get(w) || { sort: null, filters: {}, search: "" }, D = Ie(x, q.query);
        if (Ft(q, L.connector) === "remote") {
          S(w, "ln-" + C + ":set-loading", { loading: !0 }), S(L.connectorEl, "ln-api-connector:request-query", {
            query: D,
            meta: { targetEl: w, kind: C, offset: D.offset, limit: D.limit }
          });
          continue;
        }
        (function(F, N) {
          q.getAll(D).then(function(H) {
            const Q = {
              data: H.data,
              total: t && t.total !== void 0 ? t.total : H.total,
              filtered: t && t.filtered !== void 0 ? t.filtered : H.filtered,
              offset: H.offset !== void 0 ? H.offset : t && t.offset !== void 0 ? t.offset : x.offset,
              queryGen: H.queryGen !== void 0 ? H.queryGen : t && t.queryGen !== void 0 ? t.queryGen : x.queryGen
            };
            S(F, "ln-" + N + ":set-loading", { loading: !1 }), S(F, "ln-" + N + ":set-data", Q), a._boundDelivered.set(F, !0);
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
            const N = x.slice(0, F), H = x.slice(F + 1);
            D = {}, D[N] = [H];
          }
        }
        (function(F, N) {
          q.count(N).then(function(H) {
            S(F, "ln-stat:set-count", { count: H });
          });
        })(w, D);
      }
    }
  }, g.prototype.destroy = function() {
    if (!this.dom[n]) return;
    const t = this;
    t._handlers && (t.dom.removeEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.removeEventListener("ln-data-store:request-page", t._handlers.requestPage), t.dom.removeEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.removeEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.removeEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.removeEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.removeEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.removeEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.removeEventListener("submit", t._handlers.formSubmit), _.forEach(function(o) {
      t.dom.removeEventListener(o + ":fetched", t._handlers.connFetched), t.dom.removeEventListener(o + ":created", t._handlers.connCreated), t.dom.removeEventListener(o + ":updated", t._handlers.connUpdated), t.dom.removeEventListener(o + ":deleted", t._handlers.connDeleted), t.dom.removeEventListener(o + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.removeEventListener(o + ":error", t._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", t._handlers.reqTableData), document.removeEventListener("ln-list:request-data", t._handlers.reqListData), document.removeEventListener("ln-chart:request-data", t._handlers.reqChartData), document.removeEventListener("ln-options:request-data", t._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.removeEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:created", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:mutation-error", t._handlers.mutationError), t.dom.removeEventListener("ln-data-store:synced", t._handlers.refreshSynced), t.dom.removeEventListener("ln-data-store:query-changed", t._handlers.refreshQuery), t._handlers = null), t._boundQueries = null, t._boundDelivered = null, t._mutationReceipts.close(new Error("Data coordinator destroyed")), t._mutationReceipts = null, l.delete(this), y(), delete this.dom[n], delete this.dom[u];
  };
  function s(t, o) {
    const a = t[n];
    a && o === "data-ln-data-mapper" && a.refreshMapper();
  }
  M(e, n, g, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: s
  });
})();
const Hi = "ln_api_queue", Bi = 2, $ = "outbox", Z = "_queue_meta";
function nt(e, n) {
  return e.error || new Error(n);
}
function wt(e, n) {
  return e.bound([n, -1 / 0], [n, 1 / 0]);
}
function De(e) {
  return "seq:" + e;
}
function Nt(e) {
  return "paused:" + e;
}
function Re(e) {
  e.leaseOwner = null, e.leaseUntil = 0;
}
function Ui(e, n, u) {
  return typeof e != "string" || e.indexOf(n) === -1 ? e : e.split(n).join(u);
}
function zi(e, n, u, m) {
  const l = /* @__PURE__ */ new Map(), h = [], c = [];
  for (const r of e || [])
    l.has(r.chainKey) || l.set(r.chainKey, []), l.get(r.chainKey).push(r);
  return l.forEach((r, d) => {
    r.sort((y, p) => y.seq - p.seq);
    const f = r[0];
    if (!(!f || f.status === "failed")) {
      if (f.status === "inflight" && (f.leaseUntil || 0) > m) {
        c.push({ chainKey: d, at: f.leaseUntil });
        return;
      }
      if ((f.nextAttemptAt || 0) > m) {
        c.push({ chainKey: d, at: f.nextAttemptAt });
        return;
      }
      f.status = "inflight", f.leaseOwner = n, f.leaseUntil = m + u, f.updatedAt = m, h.push(f);
    }
  }), { entries: h, wakeups: c };
}
function Ki(e, n, u, m, l) {
  const h = [], c = [];
  for (const r of e || []) {
    if (r.entryId === n) {
      c.push(r.entryId);
      continue;
    }
    r.chainKey === u && (r.chainKey = m, r.targetId === u && (r.targetId = m), r.meta && r.meta.id === u && (r.meta.id = m), r.meta && typeof r.meta.action == "string" && (r.meta.action = Ui(r.meta.action, u, m)), r.updatedAt = l, h.push(r));
  }
  return { changed: h, deleted: c };
}
class ji {
  constructor(n) {
    n = n || {}, this.indexedDB = n.indexedDB || globalThis.indexedDB, this.keyRange = n.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = n.dbName || Hi, this.now = n.now || (() => Date.now()), this.uuid = n.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((n, u) => {
      const m = this.indexedDB.open(this.dbName, Bi);
      m.onupgradeneeded = (l) => {
        const h = l.target.result;
        let c;
        h.objectStoreNames.contains($) ? c = l.target.transaction.objectStore($) : c = h.createObjectStore($, { keyPath: "entryId" }), c.indexNames.contains("by_scope_chain") || c.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), c.indexNames.contains("by_scope_seq") || c.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), h.objectStoreNames.contains(Z) || h.createObjectStore(Z, { keyPath: "key" });
      }, m.onerror = () => u(nt(m, "Queue database open failed")), m.onsuccess = (l) => {
        this._db = l.target.result, this._db.onversionchange = () => this.close(), n(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((n, u) => {
      const m = this.indexedDB.deleteDatabase(this.dbName);
      m.onsuccess = () => n(), m.onerror = () => u(nt(m, "Queue database delete failed")), m.onblocked = () => u(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(n) {
    return this.open().then((u) => u ? new Promise((m, l) => {
      const c = u.transaction($, "readonly").objectStore($).index("by_scope_seq").getAll(wt(this.keyRange, n));
      c.onsuccess = () => m(c.result || []), c.onerror = () => l(nt(c, "Queue scope read failed"));
    }) : []);
  }
  enqueue(n, u) {
    return u = u || {}, this.open().then((m) => m ? new Promise((l, h) => {
      const c = m.transaction([Z, $], "readwrite"), r = c.objectStore(Z), d = c.objectStore($), f = De(n);
      let y = null;
      const p = (g) => {
        const i = g + 1;
        y = {
          entryId: this.uuid(),
          scope: n,
          chainKey: u.chainKey,
          seq: i,
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
        }, r.put({ key: f, value: i }), d.put(y);
      }, _ = r.get(f);
      _.onerror = () => h(nt(_, "Queue sequence read failed")), _.onsuccess = () => {
        const g = _.result;
        if (g && typeof g.value == "number") {
          p(g.value);
          return;
        }
        const i = d.index("by_scope_seq").getAll(wt(this.keyRange, n));
        i.onerror = () => h(nt(i, "Queue sequence migration failed")), i.onsuccess = () => {
          const s = (i.result || []).reduce((t, o) => Math.max(t, o.seq || 0), 0);
          p(s);
        };
      }, c.oncomplete = () => l(y), c.onerror = () => h(c.error || new Error("Queue enqueue transaction failed")), c.onabort = () => h(c.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(n, u, m) {
    return this.open().then((l) => l ? new Promise((h, c) => {
      const r = l.transaction($, "readwrite"), d = r.objectStore($), f = d.index("by_scope_seq").getAll(wt(this.keyRange, n)), y = this.now();
      let p = { entries: [], wakeups: [] };
      f.onerror = () => c(nt(f, "Queue claim read failed")), f.onsuccess = () => {
        p = zi(f.result || [], u, m, y);
        for (const _ of p.entries) d.put(_);
      }, r.oncomplete = () => h(p), r.onerror = () => c(r.error || new Error("Queue claim transaction failed")), r.onabort = () => c(r.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(n, u) {
    return this._updateEntry(n, u, (m, l) => (l.delete(m.entryId), { status: "acked", entry: m }));
  }
  nack(n, u, m, l) {
    l = l || {};
    const h = l.maxAttempts || 8, c = l.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((r) => r ? new Promise((d, f) => {
      const y = r.transaction([$, Z], "readwrite"), p = y.objectStore($), _ = y.objectStore(Z), g = p.get(u);
      let i = null;
      g.onerror = () => f(nt(g, "Queue nack read failed")), g.onsuccess = () => {
        const s = g.result;
        if (!(!s || s.scope !== n)) {
          if (m === "drop") {
            p.delete(s.entryId), i = { status: "dropped", entry: s };
            return;
          }
          if (Re(s), s.updatedAt = this.now(), m === "auth") {
            s.status = "pending", p.put(s), _.put({ key: Nt(n), value: "auth" }), i = { status: "auth", entry: s };
            return;
          }
          if (m === "retry") {
            if (s.attempts = (s.attempts || 0) + 1, s.attempts >= h) {
              s.status = "failed", s.nextAttemptAt = 0, p.put(s), i = { status: "failed", entry: s };
              return;
            }
            const t = c[Math.min(s.attempts - 1, c.length - 1)];
            s.status = "pending", s.nextAttemptAt = this.now() + t, p.put(s), i = { status: "retry", entry: s, delay: t };
          }
        }
      }, y.oncomplete = () => d(i), y.onerror = () => f(y.error || new Error("Queue nack transaction failed")), y.onabort = () => f(y.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(n, u, m) {
    return this._remapTransaction(n, null, u, m);
  }
  resolveCreate(n, u, m, l) {
    return this._remapTransaction(n, u, m, l);
  }
  _remapTransaction(n, u, m, l) {
    return this.open().then((h) => h ? new Promise((c, r) => {
      const d = h.transaction($, "readwrite"), f = d.objectStore($), y = f.index("by_scope_seq").getAll(wt(this.keyRange, n));
      let p = { changed: [], deleted: [] };
      y.onerror = () => r(nt(y, "Queue remap read failed")), y.onsuccess = () => {
        p = Ki(y.result || [], u, m, l, this.now());
        for (const _ of p.deleted) f.delete(_);
        for (const _ of p.changed) f.put(_);
      }, d.oncomplete = () => c(p.changed), d.onerror = () => r(d.error || new Error("Queue remap transaction failed")), d.onabort = () => r(d.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(n) {
    return this.open().then((u) => u ? new Promise((m, l) => {
      const h = u.transaction($, "readwrite"), c = h.objectStore($), r = c.index("by_scope_seq").getAll(wt(this.keyRange, n));
      let d = 0;
      r.onerror = () => l(nt(r, "Queue failed-entry read failed")), r.onsuccess = () => {
        for (const f of r.result || [])
          f.status === "failed" && (f.status = "pending", f.attempts = 0, f.nextAttemptAt = 0, f.updatedAt = this.now(), Re(f), c.put(f), d++);
      }, h.oncomplete = () => m(d), h.onerror = () => l(h.error || new Error("Queue failed-entry reset failed")), h.onabort = () => l(h.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(n) {
    return this.open().then((u) => u ? new Promise((m, l) => {
      const c = u.transaction(Z, "readonly").objectStore(Z).get(Nt(n));
      c.onsuccess = () => {
        const r = c.result ? c.result.value : !1;
        m(r || !1);
      }, c.onerror = () => l(nt(c, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(n, u) {
    return this.open().then((m) => {
      if (m)
        return new Promise((l, h) => {
          const c = m.transaction(Z, "readwrite"), r = typeof u == "string" ? u : u ? "manual" : !1;
          c.objectStore(Z).put({ key: Nt(n), value: r }), c.oncomplete = () => l(), c.onerror = () => h(c.error || new Error("Queue pause-state write failed")), c.onabort = () => h(c.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(n) {
    return this.open().then((u) => {
      if (u)
        return new Promise((m, l) => {
          const h = u.transaction([$, Z], "readwrite"), r = h.objectStore($).index("by_scope_seq").openCursor(wt(this.keyRange, n));
          r.onsuccess = (d) => {
            const f = d.target.result;
            f && (f.delete(), f.continue());
          }, r.onerror = () => l(nt(r, "Queue clear failed")), h.objectStore(Z).delete(De(n)), h.objectStore(Z).delete(Nt(n)), h.oncomplete = () => m(), h.onerror = () => l(h.error || new Error("Queue clear transaction failed")), h.onabort = () => l(h.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(n, u, m) {
    return this.open().then((l) => l ? new Promise((h, c) => {
      const r = l.transaction($, "readwrite"), d = r.objectStore($), f = d.get(u);
      let y = null;
      f.onerror = () => c(nt(f, "Queue entry read failed")), f.onsuccess = () => {
        const p = f.result;
        !p || p.scope !== n || (y = m(p, d));
      }, r.oncomplete = () => h(y), r.onerror = () => c(r.error || new Error("Queue entry transaction failed")), r.onabort = () => c(r.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const e = "data-ln-api-queue", n = "lnApiQueue", u = [2e3, 5e3, 15e3, 6e4, 3e5], m = 8, l = 6e4;
  if (window[n] !== void 0) return;
  function h() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (y) => {
        const p = Math.random() * 16 | 0;
        return (y === "x" ? p : p & 3 | 8).toString(16);
      });
    }
  }
  const c = new ji({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: h
  });
  function r(f) {
    this.dom = f, f[n] = this;
    const y = f.closest("[data-ln-data-coordinator]");
    this.scope = f.id || (y ? y.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = h(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const p = this;
    return c.open().then((_) => _ ? c.getPaused(p.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((_) => {
      if (p._paused = !!_, p._paused) {
        const g = typeof _ == "string" ? _ : "auth";
        S(p.dom, "ln-api-queue:paused", { reason: g, restored: !0 });
      }
      return p._emitPendingCount();
    }).then(() => p._drain()).catch((_) => {
      console.error("[ln-api-queue] Initialization failed:", _), S(p.dom, "ln-api-queue:error", { operation: "initialize", error: _ });
    }), this;
  }
  r.prototype._isOnline = function() {
    const f = this.dom.getAttribute("data-ln-api-queue-online");
    return f === "true" ? !0 : f === "false" ? !1 : navigator.onLine;
  }, r.prototype._emitPendingCount = function() {
    const f = this;
    return c.allForScope(f.scope).then((y) => (S(f.dom, "ln-api-queue:pending-count", { count: y.length, scope: f.scope }), y.length === 0 && S(f.dom, "ln-api-queue:drained", { scope: f.scope }), y));
  }, r.prototype._clearTimer = function(f) {
    const y = this._timers.get(f);
    y && (clearTimeout(y), this._timers.delete(f));
  }, r.prototype._scheduleTimer = function(f, y) {
    const p = Math.max(0, y), _ = this._timers.get(f);
    _ && clearTimeout(_);
    const g = this, i = setTimeout(() => {
      g._timers.delete(f), g._drain();
    }, p);
    this._timers.set(f, i);
  }, r.prototype._drain = function() {
    const f = this;
    return f._paused || !f._isOnline() ? Promise.resolve() : (f._drainPromise || (f._drainPromise = c.claimReady(f.scope, f._workerId, l).then((y) => {
      for (const p of y.wakeups)
        f._scheduleTimer(p.chainKey, p.at - Date.now());
      for (const p of y.entries)
        f._clearTimer(p.chainKey), S(f.dom, "ln-api-queue:send", {
          entryId: p.entryId,
          chainKey: p.chainKey,
          op: p.op,
          targetId: p.targetId,
          payload: p.payload,
          expectedVersion: p.expectedVersion,
          idempotencyKey: p.entryId,
          meta: p.meta
        });
    }).catch((y) => {
      console.error("[ln-api-queue] Drain failed:", y), S(f.dom, "ln-api-queue:error", { operation: "drain", error: y });
    }).finally(() => {
      f._drainPromise = null;
    })), f._drainPromise);
  }, r.prototype._onEnqueue = function(f) {
    const y = this;
    return c.enqueue(y.scope, f.detail || {}).then((p) => {
      if (p)
        return y._emitPendingCount().then((_) => (S(y.dom, "ln-api-queue:enqueued", {
          entryId: p.entryId,
          chainKey: p.chainKey,
          count: _.length
        }), y._drain()));
    }).catch((p) => {
      S(y.dom, "ln-api-queue:error", { operation: "enqueue", error: p });
    });
  }, r.prototype._onAck = function(f) {
    const y = this, p = f.detail || {};
    return c.ack(y.scope, p.entryId).then(() => y._emitPendingCount()).then(() => y._drain()).catch((_) => {
      S(y.dom, "ln-api-queue:error", { operation: "ack", entryId: p.entryId, error: _ });
    });
  }, r.prototype._onNack = function(f) {
    const y = this, p = f.detail || {};
    return c.nack(y.scope, p.entryId, p.reason, {
      maxAttempts: m,
      backoff: u
    }).then((_) => {
      if (_)
        return _.status === "failed" ? S(y.dom, "ln-api-queue:failed", {
          entryId: _.entry.entryId,
          chainKey: _.entry.chainKey,
          attempts: _.entry.attempts
        }) : _.status === "retry" ? y._scheduleTimer(_.entry.chainKey, _.delay) : _.status === "auth" && (y._paused = !0, S(y.dom, "ln-api-queue:paused", { reason: "auth" }), S(y.dom, "ln-api-queue:auth-required", {
          entryId: _.entry.entryId,
          chainKey: _.entry.chainKey
        })), y._emitPendingCount().then(() => {
          if (_.status === "dropped") return y._drain();
        });
    }).catch((_) => {
      S(y.dom, "ln-api-queue:error", { operation: "nack", entryId: p.entryId, error: _ });
    });
  }, r.prototype._onRemap = function(f) {
    const y = this, p = f.detail || {};
    return c.remap(y.scope, p.oldKey, p.newId).catch((_) => {
      S(y.dom, "ln-api-queue:error", { operation: "remap", error: _ });
    });
  }, r.prototype._onResolveCreate = function(f) {
    const y = this, p = f.detail || {};
    return c.resolveCreate(y.scope, p.entryId, p.oldKey, p.newId).then(() => y._emitPendingCount()).then(() => y._drain()).catch((_) => {
      S(y.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: p.entryId,
        error: _
      });
    });
  }, r.prototype._onResume = function() {
    const f = this;
    return c.setPaused(f.scope, !1).then(() => (f._paused = !1, S(f.dom, "ln-api-queue:resumed", {}), f._drain())).catch((y) => {
      S(f.dom, "ln-api-queue:error", { operation: "resume", error: y });
    });
  }, r.prototype._onPause = function() {
    const f = this;
    return c.setPaused(f.scope, "manual").then(() => {
      f._paused = !0, S(f.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((y) => {
      S(f.dom, "ln-api-queue:error", { operation: "pause", error: y });
    });
  }, r.prototype._onDrain = function() {
    const f = this;
    return c.resetFailed(f.scope).then(() => {
      const y = f._drainPromise;
      return y ? y.then(() => f._drain()) : f._drain();
    }).catch((y) => {
      S(f.dom, "ln-api-queue:error", { operation: "manual-drain", error: y });
    });
  }, r.prototype._onClear = function() {
    const f = this;
    return f._timers.forEach((y) => clearTimeout(y)), f._timers.clear(), c.clear(f.scope).then(() => {
      f._paused = !1, S(f.dom, "ln-api-queue:pending-count", { count: 0, scope: f.scope }), S(f.dom, "ln-api-queue:drained", { scope: f.scope });
    }).catch((y) => {
      S(f.dom, "ln-api-queue:error", { operation: "clear", error: y });
    });
  }, r.prototype._bindEvents = function() {
    const f = this;
    f._handlers = {
      enqueue: (y) => f._onEnqueue(y),
      ack: (y) => f._onAck(y),
      nack: (y) => f._onNack(y),
      remap: (y) => f._onRemap(y),
      resolveCreate: (y) => f._onResolveCreate(y),
      resume: () => f._onResume(),
      pause: () => f._onPause(),
      drain: () => f._onDrain(),
      clear: () => f._onClear()
    }, f.dom.addEventListener("ln-api-queue:request-enqueue", f._handlers.enqueue), f.dom.addEventListener("ln-api-queue:ack", f._handlers.ack), f.dom.addEventListener("ln-api-queue:nack", f._handlers.nack), f.dom.addEventListener("ln-api-queue:request-remap", f._handlers.remap), f.dom.addEventListener("ln-api-queue:resolve-create", f._handlers.resolveCreate), f.dom.addEventListener("ln-api-queue:request-resume", f._handlers.resume), f.dom.addEventListener("ln-api-queue:request-pause", f._handlers.pause), f.dom.addEventListener("ln-api-queue:request-drain", f._handlers.drain), f.dom.addEventListener("ln-api-queue:request-clear", f._handlers.clear);
  }, r.prototype.destroy = function() {
    if (!this.dom[n]) return;
    const f = this;
    f.dom.removeEventListener("ln-api-queue:request-enqueue", f._handlers.enqueue), f.dom.removeEventListener("ln-api-queue:ack", f._handlers.ack), f.dom.removeEventListener("ln-api-queue:nack", f._handlers.nack), f.dom.removeEventListener("ln-api-queue:request-remap", f._handlers.remap), f.dom.removeEventListener("ln-api-queue:resolve-create", f._handlers.resolveCreate), f.dom.removeEventListener("ln-api-queue:request-resume", f._handlers.resume), f.dom.removeEventListener("ln-api-queue:request-pause", f._handlers.pause), f.dom.removeEventListener("ln-api-queue:request-drain", f._handlers.drain), f.dom.removeEventListener("ln-api-queue:request-clear", f._handlers.clear), window.removeEventListener("online", f._onlineHandler), f._timers.forEach((y) => clearTimeout(y)), f._timers.clear(), S(f.dom, "ln-api-queue:destroyed", { scope: f.scope }), delete f.dom[n];
  };
  function d(f) {
    const y = f[n];
    y && y._drain();
  }
  M(e, n, r, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: d
  });
})();
function un(e) {
  if (e == null || e === "") return null;
  const n = Number(e);
  return Number.isFinite(n) ? n : null;
}
function Et(e) {
  return String(Math.round(e * 1e3) / 1e3);
}
function Vi(e, n, u) {
  const m = un(e);
  return m === null || m < 0 ? 0 : Math.min(m, Math.min(n, u) / 2);
}
function Wi(e) {
  if (typeof e != "string") return null;
  const n = e.trim().split(/[\s,]+/).map(Number);
  return n.length !== 4 || n.some((u) => !Number.isFinite(u)) || n[2] <= 0 || n[3] <= 0 ? null : { x: n[0], y: n[1], width: n[2], height: n[3] };
}
function Gi(e) {
  if (!e || typeof e != "string") return null;
  const n = e.split(":"), u = n[0].trim();
  return u ? {
    field: u,
    direction: n[1] && n[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
  } : null;
}
function Qi(e, n) {
  n = n || {};
  const u = n.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, m = n.xField || "label", l = n.yField || "value", h = n.includeZero !== !1, c = Vi(n.padding, u.width, u.height), r = Array.isArray(e) ? e : [], d = [];
  for (let v = 0; v < r.length; v++) {
    const w = r[v] || {}, A = un(w[l]);
    A !== null && d.push({
      record: w,
      sourceIndex: v,
      label: w[m] == null ? String(v + 1) : String(w[m]),
      value: A
    });
  }
  if (d.length === 0)
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
  let f = d[0].value, y = d[0].value;
  for (let v = 1; v < d.length; v++)
    d[v].value < f && (f = d[v].value), d[v].value > y && (y = d[v].value);
  let p = f, _ = y;
  h && (p = Math.min(0, p), _ = Math.max(0, _)), p === _ && (_ === 0 ? _ = 1 : _ > 0 ? p = 0 : _ = 0);
  const g = Math.max(1, u.width - c * 2), i = Math.max(1, u.height - c * 2), s = _ - p, t = u.y + u.height - c - (0 - p) / s * i, o = [];
  for (let v = 0; v < d.length; v++) {
    const w = d[v], A = d.length === 1 ? 0.5 : v / (d.length - 1), C = u.x + c + A * g, L = u.y + u.height - c - (w.value - p) / s * i;
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
  let b = "";
  if (o.length > 0) {
    const v = o[0], w = o[o.length - 1], A = Et(v.x) + "," + Et(t), C = Et(w.x) + "," + Et(t);
    b = A + " " + a + " " + C;
  }
  return {
    points: o,
    linePoints: a,
    areaPoints: b,
    count: o.length,
    min: f,
    max: y,
    domainMin: p,
    domainMax: _,
    baselineY: t
  };
}
(function() {
  const e = "data-ln-chart", n = "lnChart", u = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[n] !== void 0) return;
  function m(h, c) {
    h && (h.textContent = c);
  }
  function l(h) {
    this.dom = h, this.name = h.getAttribute(e) || "", this.source = h.getAttribute("data-ln-chart-source") || this.name, this.plot = h.querySelector("[data-ln-chart-plot]"), this.line = h.querySelector("[data-ln-chart-line]"), this.area = h.querySelector("[data-ln-chart-area]"), this.labels = h.querySelector("[data-ln-chart-labels]"), this.empty = h.querySelector("[data-ln-chart-empty]"), this.minimum = h.querySelector("[data-ln-chart-min]"), this.maximum = h.querySelector("[data-ln-chart-max]"), this.count = h.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const c = this;
    return this._onSetData = function(r) {
      const d = r.detail || {};
      c._data = Array.isArray(d.data) ? d.data : [], c.isLoaded = !0, c._setLoading(!1), c._render();
    }, this._onSetLoading = function(r) {
      c._setLoading(!!(r.detail && r.detail.loading));
    }, this._onRefresh = function() {
      c.requestData();
    }, h.addEventListener("ln-chart:set-data", this._onSetData), h.addEventListener("ln-chart:set-loading", this._onSetLoading), h.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  l.prototype._readOptions = function() {
    const h = this.dom.getAttribute("data-ln-chart-padding"), c = h === null ? NaN : Number(h), r = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(c) && c >= 0 ? c : 16,
      type: r === "area" || r === "polygon" ? "area" : "line",
      viewBox: this.plot && Wi(this.plot.getAttribute("viewBox")) || u
    };
  }, l.prototype._setLoading = function(h) {
    this.dom.classList.toggle("ln-chart--loading", h), this.dom.setAttribute("aria-busy", h ? "true" : "false");
  }, l.prototype._renderLabels = function(h) {
    if (!this.labels || (this.labels.replaceChildren(), h.count === 0)) return;
    const c = this.name + "-label", r = '[data-ln-template="' + c + '"]';
    if (!this.dom.querySelector(r) && !document.querySelector(r)) return;
    const d = pt(this.dom, c, "ln-chart");
    if (!d) return;
    const f = V(this.dom);
    for (const y of h.points) {
      const p = d.cloneNode(!0);
      It(p, {
        label: y.label,
        value: tt(y.value, f)
      }), this.labels.appendChild(p);
    }
  }, l.prototype._render = function() {
    const h = this._readOptions(), c = Qi(this._data, h);
    this.model = c, this.line && (this.line.setAttribute("points", c.linePoints), this.line.toggleAttribute("hidden", c.count === 0)), this.area && (this.area.setAttribute("points", c.areaPoints), this.area.toggleAttribute("hidden", c.count === 0 || h.type !== "area"));
    const r = c.count === 0;
    this.dom.classList.toggle("ln-chart--empty", r), this.empty && this.empty.toggleAttribute("hidden", !r);
    const d = V(this.dom);
    m(this.minimum, tt(c.min, d)), m(this.maximum, tt(c.max, d)), m(this.count, tt(c.count, d)), this._renderLabels(c), S(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: c.count,
      min: c.min,
      max: c.max
    });
  }, l.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, S(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: Gi(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, l.prototype.destroy = function() {
    this.dom[n] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[n]);
  }, M(e, n, l, "ln-chart", {
    extraAttributes: [
      "data-ln-chart-source",
      "data-ln-chart-x",
      "data-ln-chart-y",
      "data-ln-chart-type",
      "data-ln-chart-padding",
      "data-ln-chart-zero",
      "data-ln-chart-sort"
    ],
    onAttributeChange: function(h, c) {
      const r = h[n];
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
  const e = "data-ln-options", n = "lnOptions";
  if (window[n] !== void 0) return;
  function u(m) {
    this.dom = m, this._storeName = m.getAttribute(e), this._valueField = m.getAttribute("data-ln-options-value") || "id", this._labelField = m.getAttribute("data-ln-options-label") || "name";
    const l = this;
    return this._onSetData = function(h) {
      l._rebuild(h.detail.data || []);
    }, m.addEventListener("ln-options:set-data", this._onSetData), S(m, "ln-options:request-data", { options: this._storeName }), this;
  }
  u.prototype._rebuild = function(m) {
    const l = this.dom, h = this._valueField, c = this._labelField, r = l.value, d = l.querySelectorAll("option");
    for (let y = d.length - 1; y >= 0; y--)
      d[y].value !== "" && l.removeChild(d[y]);
    for (let y = 0; y < m.length; y++) {
      const p = m[y], _ = document.createElement("option");
      _.value = String(p[h]), _.textContent = p[c] != null ? p[c] : "", l.appendChild(_);
    }
    const f = l.options;
    for (let y = 0; y < f.length; y++)
      if (f[y].value === r) {
        l.value = r;
        break;
      }
  }, u.prototype.destroy = function() {
    this.dom[n] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[n]);
  }, M(e, n, u, "ln-options");
})();
function $i(e) {
  if (!e || typeof e != "string") return null;
  const n = e.indexOf(":");
  if (n === -1) return null;
  const u = e.slice(0, n).trim(), m = e.slice(n + 1).trim();
  if (!u) return null;
  const l = {};
  return l[u] = [m], l;
}
function Xi(e) {
  return e == null ? "" : String(e);
}
(function() {
  const e = "data-ln-stat", n = "lnStat";
  if (window[n] !== void 0) return;
  function u(m) {
    return this.dom = m, this._storeName = m.getAttribute(e), this._filters = $i(m.getAttribute("data-ln-stat-filter")), this._onSetCount = function(l) {
      m.textContent = Xi(l.detail && l.detail.count), m.classList.remove("is-loading");
    }, m.addEventListener("ln-stat:set-count", this._onSetCount), S(m, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  u.prototype.destroy = function() {
    this.dom[n] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[n]);
  }, M(e, n, u, "ln-stat");
})();
(function() {
  const e = "ln-icon-sprite", n = "#ln-icon-", u = "#ln-icon-custom-", m = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set();
  let h = null;
  const c = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), r = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), d = "lni:", f = "lni:v", y = "1";
  function p() {
    try {
      if (localStorage.getItem(f) !== y) {
        for (let a = localStorage.length - 1; a >= 0; a--) {
          const b = localStorage.key(a);
          b && b.indexOf(d) === 0 && localStorage.removeItem(b);
        }
        localStorage.setItem(f, y);
      }
    } catch {
    }
  }
  p();
  function _() {
    return h || (h = document.getElementById(e), h || (h = document.createElementNS("http://www.w3.org/2000/svg", "svg"), h.id = e, h.setAttribute("hidden", ""), h.setAttribute("aria-hidden", "true"), h.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(h, document.body.firstChild))), h;
  }
  function g(a) {
    return a.indexOf(u) === 0 ? r + "/" + a.slice(u.length) + ".svg" : c + "/" + a.slice(n.length) + ".svg";
  }
  function i(a, b) {
    const v = b.match(/viewBox="([^"]+)"/), w = v ? v[1] : "0 0 24 24", A = b.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), C = A ? A[1].trim() : "", L = b.match(/<svg([^>]*)>/i), q = L ? L[1] : "", x = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    x.id = a, x.setAttribute("viewBox", w), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(D) {
      const F = q.match(new RegExp(D + '="([^"]*)"'));
      F && x.setAttribute(D, F[1]);
    }), x.innerHTML = C, _().querySelector("defs").appendChild(x);
  }
  function s(a) {
    if (m.has(a) || l.has(a)) return;
    if (a.indexOf(u) === 0 && !r) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", a);
      return;
    }
    const b = a.slice(1);
    try {
      const w = localStorage.getItem(d + b);
      if (w) {
        i(b, w), m.add(a);
        return;
      }
    } catch {
    }
    l.add(a);
    const v = g(a);
    fetch(v).then(function(w) {
      if (!w.ok) throw new Error(w.status);
      return w.text();
    }).then(function(w) {
      i(b, w), m.add(a), l.delete(a);
      try {
        localStorage.setItem(d + b, w);
      } catch {
      }
    }).catch(function(w) {
      console.error("[ln-icon] Fetch failed for:", b, w), l.delete(a);
    });
  }
  function t(a) {
    const b = 'use[href^="' + n + '"], use[href^="' + u + '"]', v = a.querySelectorAll ? a.querySelectorAll(b) : [];
    if (a.matches && a.matches(b)) {
      const w = a.getAttribute("href");
      w && s(w);
    }
    Array.prototype.forEach.call(v, function(w) {
      const A = w.getAttribute("href");
      A && s(A);
    });
  }
  function o() {
    t(document), new MutationObserver(function(a) {
      a.forEach(function(b) {
        if (b.type === "childList")
          b.addedNodes.forEach(function(v) {
            v.nodeType === 1 && t(v);
          });
        else if (b.type === "attributes" && b.attributeName === "href") {
          const v = b.target.getAttribute("href");
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
(function() {
  const e = "data-ln-debug", n = "lnDebug";
  if (window[n] !== void 0) return;
  function u(m) {
    return this.dom = m, this;
  }
  u.prototype.destroy = function() {
    delete this.dom[n];
  }, M(e, n, u, "ln-debug");
})();
