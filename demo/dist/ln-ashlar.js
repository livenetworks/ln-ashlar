function Ae(o) {
  let i = !1;
  for (let b = 0; b < o.length; b++) {
    const y = o[b];
    if (!(y === "" || y == null) && (i = !0, !Number.isFinite(Number(y))))
      return "string";
  }
  return i ? "number" : "string";
}
function Se(o, i, b, y) {
  if (b === "number") {
    const f = parseFloat(o), s = parseFloat(i);
    return (isNaN(f) ? 0 : f) - (isNaN(s) ? 0 : s);
  }
  const m = o != null ? String(o) : "", g = i != null ? String(i) : "";
  return y ? y.compare(m, g) : m < g ? -1 : m > g ? 1 : 0;
}
if (typeof window < "u") {
  const o = console.warn;
  console.warn = function(...i) {
    typeof i[0] == "string" && (i[0].startsWith("[ln-") || i[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || o.apply(console, i);
  };
}
const jt = {};
function Rt(o, i) {
  jt[o] || (jt[o] = document.querySelector('[data-ln-template="' + o + '"]'));
  const b = jt[o];
  return b ? b.content.cloneNode(!0) : (console.warn("[" + (i || "ln-core") + '] Template "' + o + '" not found'), null);
}
function C(o, i, b) {
  o.dispatchEvent(new CustomEvent(i, {
    bubbles: !0,
    detail: b || {}
  }));
}
function G(o, i, b) {
  const y = new CustomEvent(i, {
    bubbles: !0,
    cancelable: !0,
    detail: b || {}
  });
  return o.dispatchEvent(y), y;
}
function Ce(o, i, b) {
  o._applyFilterAndSort(), o._vStart = -1, o._vEnd = -1, o._render(), o._updateFooter();
  const y = {
    sort: o.currentSort,
    filters: o.currentFilters,
    search: o.currentSearch
  };
  y[b] = o.name, C(o.dom, i, y);
}
function nt(o, i) {
  if (!o || !i) return o;
  const b = o.querySelectorAll("[data-ln-field]");
  for (let f = 0; f < b.length; f++) {
    const s = b[f], u = s.getAttribute("data-ln-field");
    i[u] != null && (s.textContent = i[u]);
  }
  const y = o.querySelectorAll("[data-ln-attr]");
  for (let f = 0; f < y.length; f++) {
    const s = y[f], u = s.getAttribute("data-ln-attr").split(",");
    for (let d = 0; d < u.length; d++) {
      const _ = u[d].trim().split(":");
      if (_.length !== 2) continue;
      const c = _[0].trim(), p = _[1].trim();
      i[p] != null && s.setAttribute(c, i[p]);
    }
  }
  const m = o.querySelectorAll("[data-ln-show]");
  for (let f = 0; f < m.length; f++) {
    const s = m[f], u = s.getAttribute("data-ln-show");
    u in i && s.classList.toggle("hidden", !i[u]);
  }
  const g = o.querySelectorAll("[data-ln-class]");
  for (let f = 0; f < g.length; f++) {
    const s = g[f], u = s.getAttribute("data-ln-class").split(",");
    for (let d = 0; d < u.length; d++) {
      const _ = u[d].trim().split(":");
      if (_.length !== 2) continue;
      const c = _[0].trim(), p = _[1].trim();
      p in i && s.classList.toggle(c, !!i[p]);
    }
  }
  return o;
}
function un(o, i) {
  o.matches && o.matches("[data-ln-form], [data-ln-fillable]") && o.dispatchEvent(new CustomEvent("ln-fill", { detail: i ?? null, bubbles: !0 }));
  const b = o.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let y = 0; y < b.length; y++)
    b[y].dispatchEvent(new CustomEvent("ln-fill", { detail: i ?? null, bubbles: !0 }));
  return o;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(o) {
  if (!(!o.target.matches || !o.target.matches("[data-ln-fillable]")))
    if (o.detail)
      nt(o.target, o.detail);
    else {
      const i = o.target.querySelectorAll("[data-ln-field]");
      for (let b = 0; b < i.length; b++)
        i[b].textContent = "";
    }
})));
function xt(o, i) {
  if (!o || !i) return o;
  const b = document.createTreeWalker(o, NodeFilter.SHOW_TEXT);
  for (; b.nextNode(); ) {
    const g = b.currentNode;
    g.textContent.indexOf("{{") !== -1 && (g.textContent = g.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(f, s) {
        return i[s] !== void 0 ? i[s] : "";
      }
    ));
  }
  const y = function(g, f) {
    return i[f] !== void 0 ? i[f] : "";
  }, m = Array.from(o.querySelectorAll("*"));
  o.nodeType === 1 && m.push(o);
  for (let g = 0; g < m.length; g++) {
    const f = m[g], s = f.attributes;
    for (let u = 0; u < s.length; u++) {
      const d = s[u];
      d.value.indexOf("{{") !== -1 && f.setAttribute(d.name, d.value.replace(/\{\{\s*(\w+)\s*\}\}/g, y));
    }
  }
  return o;
}
function hn(o, i, b, y, m, g) {
  const f = {};
  for (let u = 0; u < o.children.length; u++) {
    const d = o.children[u], _ = d.getAttribute("data-ln-render-key");
    _ && (f[_] = d);
  }
  const s = document.createDocumentFragment();
  for (let u = 0; u < i.length; u++) {
    const d = i[u], _ = String(y(d));
    let c = f[_];
    if (c)
      m(c, d, u);
    else {
      const p = Rt(b, g);
      if (!p || (xt(p, d), c = p.firstElementChild, !c)) continue;
      c.setAttribute("data-ln-render-key", _), m(c, d, u);
    }
    s.appendChild(c);
  }
  o.textContent = "", o.appendChild(s);
}
function lt(o, i) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      lt(o, i);
    }), console.warn("[" + i + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  o();
}
function ft(o, i, b) {
  if (o) {
    const y = o.querySelector('[data-ln-template="' + i + '"]');
    if (y) return y.content.cloneNode(!0);
  }
  return Rt(i, b);
}
function Nt(o, i) {
  const b = {}, y = o.querySelectorAll("[" + i + "]");
  for (let m = 0; m < y.length; m++)
    b[y[m].getAttribute(i)] = y[m].textContent, y[m].remove();
  return b;
}
function Vt(o, i, b, y) {
  if (o.nodeType !== 1) return;
  const g = i.indexOf("[") !== -1 || i.indexOf(".") !== -1 || i.indexOf("#") !== -1 ? i : "[" + i + "]", f = Array.from(o.querySelectorAll(g));
  o.matches && o.matches(g) && f.push(o);
  for (const s of f)
    s[b] || (s[b] = new y(s));
}
function Lt(o) {
  return !!(o.offsetWidth || o.offsetHeight || o.getClientRects().length);
}
function Le(o) {
  return !!(!o || o.ctrlKey || o.metaKey || o.shiftKey || o.altKey || typeof o.button == "number" && o.button !== 0);
}
function fn(o) {
  if (!o) return !1;
  if (typeof o.closest == "function")
    return !!o.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const i = String(o.tagName || "").toLowerCase();
  return i === "input" || i === "textarea" || i === "select" || !!o.isContentEditable;
}
function Te(o) {
  return !!(!o || o.disabled || typeof o.getAttribute == "function" && o.getAttribute("aria-disabled") === "true" || typeof o.closest == "function" && o.closest("[inert]"));
}
function pn(o, i) {
  return !o || !document.contains(o) || Te(o) || i && typeof o[i] != "function" ? !1 : Lt(o);
}
function mn(o) {
  const i = o.querySelector('input[name="_method"]');
  return ((i && i.value !== "" ? i.value : o.method) || "").toUpperCase();
}
function qe(o, i) {
  const b = !!(i && i.typed), y = i && i.exclude, m = {}, g = o.elements, f = {};
  if (b)
    for (let s = 0; s < g.length; s++) {
      const u = g[s];
      u.name && u.type === "checkbox" && !u.disabled && (f[u.name] = (f[u.name] || 0) + 1);
    }
  for (let s = 0; s < g.length; s++) {
    const u = g[s];
    if (!(!u.name || u.disabled || u.type === "file" || u.type === "submit" || u.type === "button") && !(y && u.matches && u.matches(y)))
      if (u.type === "checkbox")
        b && f[u.name] === 1 ? m[u.name] = u.checked : (m[u.name] || (m[u.name] = []), u.checked && m[u.name].push(u.value));
      else if (u.type === "radio")
        u.checked && (m[u.name] = u.value);
      else if (u.type === "select-multiple") {
        m[u.name] = [];
        for (let d = 0; d < u.options.length; d++)
          u.options[d].selected && m[u.name].push(u.options[d].value);
      } else if (b && u.type === "hidden")
        m[u.name] = u.value;
      else if (b && (u.type === "number" || u.type === "range")) {
        const d = Number(u.value);
        m[u.name] = u.value === "" || isNaN(d) ? null : d;
      } else
        m[u.name] = u.value;
  }
  return m;
}
function gn(o) {
  if (typeof o != "string") return !!o;
  const i = o.trim().toLowerCase();
  return i !== "false" && i !== "0" && i !== "" && i !== "off" && i !== "no";
}
function xe(o, i) {
  const b = o.elements, y = [], m = {};
  for (let g = 0; g < b.length; g++) {
    const f = b[g];
    f.name && f.type === "checkbox" && (m[f.name] = (m[f.name] || 0) + 1);
  }
  for (let g = 0; g < b.length; g++) {
    const f = b[g];
    if (f.type === "file" || f.type === "submit" || f.type === "button") continue;
    const s = f.getAttribute("data-ln-fill-as") || f.name;
    if (!s || !(s in i)) continue;
    const u = i[s];
    if (f.type === "checkbox") {
      if (Array.isArray(u))
        f.checked = u.indexOf(f.value) !== -1;
      else if (m[f.name] > 1) {
        const d = String(u).split(",").map(function(_) {
          return _.trim();
        });
        f.checked = d.indexOf(f.value) !== -1;
      } else
        f.checked = gn(u);
      y.push(f);
    } else if (f.type === "radio")
      f.checked = f.value === String(u), y.push(f);
    else if (f.type === "select-multiple") {
      if (Array.isArray(u))
        for (let d = 0; d < f.options.length; d++)
          f.options[d].selected = u.indexOf(f.options[d].value) !== -1;
      y.push(f);
    } else
      f.value = u, y.push(f);
  }
  return y;
}
const pe = {
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
function Q(o) {
  const i = o ? o.closest("[lang]") : null, b = (i ? i.getAttribute("lang") || i.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!b) return "en-US";
  const y = b.trim().toLowerCase();
  return y.indexOf("-") === -1 && pe[y] ? pe[y] : b;
}
function Pt() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, lt(function() {
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
function wt(o) {
  return o.hasAttribute("data-ln-value") ? o.getAttribute("data-ln-value") : o.textContent.trim();
}
function ke(o, i, { get: b, set: y }) {
  Object.defineProperty(o, "value", {
    get: function() {
      return b ? b.call(this) : i.get.call(this);
    },
    set: function(m) {
      y ? y.call(this, m, (g) => i.set.call(this, g)) : i.set.call(this, m);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function _n() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function Wt() {
  if (typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1), window.lnCore._bootHolds === 0 && window.lnCore._bootQueue)) {
    const o = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let i = 0; i < o.length; i++)
      o[i]();
  }
}
function bn() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function it(o) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(o) : setTimeout(o, 0)) : o();
}
function H(o, i, b, y, m = {}) {
  const g = m.extraAttributes || [], f = m.onAttributeChange || null, s = m.onSubtreeChange || null, u = m.onInit || null;
  function d(c) {
    const p = c || document.body;
    Vt(p, o, i, b), u && u(p);
  }
  lt(function() {
    const c = new MutationObserver(function(h) {
      for (let r = 0; r < h.length; r++) {
        const a = h[r];
        if (a.type === "childList") {
          if (s && a.target) {
            const t = o.indexOf("[") !== -1 || o.indexOf(".") !== -1 || o.indexOf("#") !== -1 ? o : "[" + o + "]", e = a.target.nodeType === 1 ? a.target.matches(t) ? a.target : a.target.closest(t) : a.target.parentElement ? a.target.parentElement.closest(t) : null;
            e && s(e, a);
          }
          for (let n = 0; n < a.addedNodes.length; n++) {
            const t = a.addedNodes[n];
            t.nodeType === 1 && (Vt(t, o, i, b), u && u(t));
          }
          for (let n = 0; n < a.removedNodes.length; n++) {
            const t = a.removedNodes[n];
            if (t.nodeType === 1) {
              const l = o.indexOf("[") !== -1 || o.indexOf(".") !== -1 || o.indexOf("#") !== -1 ? o : "[" + o + "]", v = Array.from(t.querySelectorAll(l));
              t.matches && t.matches(l) && v.push(t);
              for (let w = 0; w < v.length; w++) {
                const E = v[w];
                if (!document.contains(E)) {
                  const S = E[i];
                  S && typeof S.destroy == "function" && S.destroy();
                }
              }
            }
          }
        } else a.type === "attributes" && (f && a.target[i] ? f(a.target, a.attributeName) : (Vt(a.target, o, i, b), u && u(a.target)));
      }
    });
    let p = [];
    if (o.indexOf("[") !== -1) {
      const h = /\[([\w-]+)/g;
      let r;
      for (; (r = h.exec(o)) !== null; )
        p.push(r[1]);
    } else
      p.push(o);
    c.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: p.concat(g)
    });
  }, y || (o.indexOf("[") === -1 ? o.replace("data-", "") : "component")), window[i] = d;
  function _() {
    bn() > 0 ? it(function() {
      d(document.body);
    }) : d(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", _) : _(), d;
}
function Ie(o, i) {
  if (o.ctrlKey || o.metaKey || o.shiftKey || o.altKey || o.button !== 0 || !i) return !1;
  const b = i.getAttribute("href");
  return !(!b || i.getAttribute("target") === "_blank" || i.hasAttribute("download") || b.startsWith("mailto:") || b.startsWith("tel:") || b === "#" || b.startsWith("#") || i.hostname && i.hostname !== window.location.hostname);
}
function ct(...o) {
  return o.filter((i) => i != null && i !== "").map((i, b) => b === 0 ? i.replace(/\/+$/, "") : i.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function St(o, i) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, o, i ? { Authorization: i } : null);
}
function De(o, i = "ln-core") {
  try {
    return o ? JSON.parse(o) : {};
  } catch (b) {
    return console.error(`[${i}] Invalid headers JSON:`, b), {};
  }
}
const Re = {};
function yn(o, i) {
  Re[o] = i;
}
function vn(o) {
  return Re[o] || { ingress: (i) => i, egress: (i) => i };
}
const Oe = {};
function ee(o, i) {
  if (!o || typeof i != "object") return;
  const b = o.toLowerCase().split("-")[0];
  Oe[b] = i;
}
function Tt(o) {
  if (!o) return null;
  const i = o.toLowerCase().split("-")[0];
  return Oe[i] || null;
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = yn, window.lnCore.getDataMapper = vn, window.lnCore.registerLocaleFallback = ee, window.lnCore.getLocaleFallback = Tt, window.lnCore.fillTemplate = xt, window.lnCore.fill = nt, window.lnCore.lnFill = un, window.lnCore.renderList = hn, window.lnCore.ensureLocaleObserver = Pt);
function ne(o, i) {
  let b = !1;
  return function() {
    b || (b = !0, queueMicrotask(function() {
      b = !1, o();
    }));
  };
}
function Me(o) {
  o = o || {};
  let i = o.windowSize > 0 ? o.windowSize : 1e3, b = o.pageSize > 0 ? o.pageSize : 200, y = o.threshold != null ? o.threshold : 25, m = o.fetchDebounce != null ? o.fetchDebounce : 120;
  const g = typeof o.requestPage == "function" ? o.requestPage : function() {
  }, f = typeof o.onChange == "function" ? o.onChange : function() {
  }, s = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set();
  let _ = 0, c = 0, p = 0, h = { sort: null, filters: {}, search: "" }, r = null, a = 0, n = 0, t = !1;
  function e(E) {
    u.set(E, ++a);
  }
  function l() {
    return !!(h && (h.search || h.filters && Object.keys(h.filters).length));
  }
  function v() {
    if (s.size <= i) return;
    const E = Array.from(s.keys()).sort(function(L, x) {
      return (u.get(L) || 0) - (u.get(x) || 0);
    });
    let S = 0;
    for (; s.size > i && S < E.length; )
      s.delete(E[S]), u.delete(E[S]), S++;
  }
  function w(E, S) {
    d.add(E), g(h, E, S);
  }
  return {
    get: function(E) {
      return s.get(E);
    },
    has: function(E) {
      return s.has(E);
    },
    peek: function() {
      return s.size ? s.values().next().value : void 0;
    },
    get logicalTotal() {
      return _;
    },
    get grandTotal() {
      return c;
    },
    get queryGen() {
      return p;
    },
    get size() {
      return s.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(E, S) {
      clearTimeout(r), n = E;
      for (let F = E; F < S; F++)
        s.has(F) && e(F);
      if (_ <= 0) return;
      const L = Math.max(0, E - y), x = Math.min(_, S + y), k = Math.floor(L / b), q = Math.floor(Math.max(0, x - 1) / b);
      let O = -1;
      for (let F = k; F <= q; F++) {
        const P = F * b, V = Math.min(b, _ - P);
        let U = !1;
        const B = Math.max(P, L), K = Math.min(P + V, x);
        for (let rt = B; rt < K; rt++)
          if (!s.has(rt)) {
            U = !0;
            break;
          }
        if (U && !d.has(P)) {
          O = P;
          break;
        }
      }
      O !== -1 && (r = setTimeout(function() {
        w(O, b);
      }, m));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(E) {
      if (E = E || {}, E.queryGen != null && E.queryGen !== p) return !1;
      const S = E.offset || 0, L = E.data || [];
      let x = 0;
      for (let k = 0; k < L.length; k++)
        L[k] != null && x++;
      if (x === 0 && (E.provisional || E.filtered > 0))
        return d.delete(S), !1;
      t && (s.clear(), u.clear(), t = !1), E.provisional || (c = E.total != null ? E.total : c, _ = E.filtered != null ? E.filtered : E.data ? E.data.length : _);
      for (let k = 0; k < L.length; k++)
        L[k] != null && (s.set(S + k, L[k]), e(S + k));
      return d.delete(S), v(), f(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(E) {
      E && (h = E), w(0, b);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(E) {
      p++, d.clear(), clearTimeout(r), E && (h = E), t = !0, w(0, b);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      p++, d.clear(), clearTimeout(r), t = !0;
      const E = Math.max(0, Math.floor(n / b) * b);
      w(E, b);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(E) {
      d.delete(E);
    },
    destroy: function() {
      clearTimeout(r), s.clear(), u.clear(), d.clear();
    },
    configure: function(E) {
      E = E || {};
      let S = !1;
      if (E.windowSize != null && E.windowSize > 0 && E.windowSize !== i) {
        const L = E.windowSize < i;
        i = E.windowSize, L && v(), S = !0;
      }
      E.pageSize != null && E.pageSize > 0 && (b = E.pageSize), E.threshold != null && E.threshold >= 0 && (y = E.threshold), E.fetchDebounce != null && E.fetchDebounce >= 0 && (m = E.fetchDebounce), S && f();
    },
    setGrandTotal: function(E) {
      E == null || isNaN(E) || E < 0 || (c = E, l() || (_ = E), f());
    }
  };
}
const wn = "ln:";
let bt = null;
function Fe() {
  if (bt !== null) return bt;
  try {
    if (typeof localStorage > "u")
      return bt = !1, !1;
    const o = "__ln_test__";
    localStorage.setItem(o, o), localStorage.removeItem(o), bt = !0;
  } catch {
    bt = !1;
  }
  return bt;
}
function En() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function Ne(o, i) {
  const b = i.getAttribute("data-ln-persist"), y = b !== null && b !== "" ? b : i.id;
  return y ? wn + o + ":" + En() + ":" + y : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', i), null);
}
function Ht(o, i) {
  if (!Fe()) return null;
  const b = Ne(o, i);
  if (!b) return null;
  try {
    const y = localStorage.getItem(b);
    return y !== null ? JSON.parse(y) : null;
  } catch {
    return null;
  }
}
function gt(o, i, b) {
  if (!Fe()) return;
  const y = Ne(o, i);
  if (y)
    try {
      b == null ? localStorage.removeItem(y) : localStorage.setItem(y, JSON.stringify(b));
    } catch {
    }
}
function Pe(o) {
  return (o || "").replace(/^#/, "");
}
function Bt(o) {
  const i = o === void 0 ? location.hash : o, b = {}, y = Pe(i);
  if (!y) return b;
  const m = y.split("&");
  for (let g = 0; g < m.length; g++) {
    const f = m[g];
    if (!f) continue;
    const s = f.indexOf(":"), u = s > -1 ? f.slice(0, s) : f, d = s > -1 ? f.slice(s + 1) : "";
    if (u)
      try {
        b[u] = decodeURIComponent(d);
      } catch {
        b[u] = d;
      }
  }
  return b;
}
function Y(o) {
  if (!o) return null;
  const i = Bt();
  return o in i ? i[o] : null;
}
function Z(o, i) {
  if (!o) return;
  const b = Bt();
  i == null ? delete b[o] : b[o] = String(i);
  const m = Object.keys(b).map(function(g) {
    const f = b[g];
    return f === "" ? g : g + ":" + encodeURIComponent(f);
  }).join("&");
  Pe(location.hash) !== m && (location.hash = m);
}
function ie(o) {
  return o.button === 1 || o.ctrlKey || o.metaKey || o.shiftKey ? !1 : (o.preventDefault(), !0);
}
function _t(o, i) {
  if (!o || !o.hasAttribute("data-ln-hash")) return null;
  const b = o.getAttribute("data-ln-hash");
  if (b && b.trim() !== "") return b.trim();
  const y = o.getAttribute("data-ln-sort") || o.getAttribute("data-ln-search-for") || o.getAttribute("data-ln-search") || o.getAttribute("data-ln-filter") || o.id;
  return y ? i ? y + "-" + i : y : i || null;
}
function He(o, i) {
  return !i || i === "none" || o === null || o === void 0 ? null : String(o) + "." + i;
}
function Gt(o) {
  return !o || typeof o != "string" ? null : o.endsWith(".asc") ? { fieldOrColumn: o.slice(0, -4), direction: "asc" } : o.endsWith(".desc") ? { fieldOrColumn: o.slice(0, -5), direction: "desc" } : null;
}
function Be(o, i) {
  return !o || !Array.isArray(i) || i.length === 0 ? null : o + ":" + i.map(encodeURIComponent).join(",");
}
function Qt(o) {
  if (!o || typeof o != "string") return null;
  const i = o.indexOf(":");
  if (i === -1) return null;
  const b = o.slice(0, i), y = o.slice(i + 1), m = y ? y.split(",").map(function(g) {
    try {
      return decodeURIComponent(g);
    } catch {
      return g;
    }
  }).filter(Boolean) : [];
  return { key: b, values: m };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Bt, window.lnCore.hashGet = Y, window.lnCore.hashSet = Z, window.lnCore.hashLinkClick = ie, window.lnCore.resolveHashNamespace = _t, window.lnCore.hashSortEncode = He, window.lnCore.hashSortDecode = Gt, window.lnCore.hashFilterEncode = Be, window.lnCore.hashFilterDecode = Qt);
function Ot(o, i, b, y) {
  const m = typeof y == "number" ? y : 4, g = window.innerWidth, f = window.innerHeight, s = i.width, u = i.height, d = (b || "bottom").split("-"), _ = d[0], c = d[1] === "start" || d[1] === "end" ? d[1] : "center", p = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, h = p[_] || p.bottom;
  function r(l) {
    return l === "top" || l === "bottom" ? c === "start" ? o.left : c === "end" ? o.right - s : o.left + (o.width - s) / 2 : c === "start" ? o.top : c === "end" ? o.bottom - u : o.top + (o.height - u) / 2;
  }
  function a(l) {
    let v, w, E = !0;
    return l === "top" ? (v = o.top - m - u, w = r(l), v < 0 && (E = !1)) : l === "bottom" ? (v = o.bottom + m, w = r(l), v + u > f && (E = !1)) : l === "left" ? (v = r(l), w = o.left - m - s, w < 0 && (E = !1)) : (v = r(l), w = o.right + m, w + s > g && (E = !1)), { top: v, left: w, side: l, fits: E };
  }
  let n = null;
  for (let l = 0; l < h.length; l++) {
    const v = a(h[l]);
    if (v.fits) {
      n = v;
      break;
    }
  }
  n || (n = a(h[0]));
  let t = n.top, e = n.left;
  return s >= g ? e = 0 : (e < 0 && (e = 0), e + s > g && (e = g - s)), u >= f ? t = 0 : (t < 0 && (t = 0), t + u > f && (t = f - u)), { top: t, left: e, placement: n.side };
}
function $t(o) {
  if (!o) return { width: 0, height: 0 };
  const i = o.style, b = i.visibility, y = i.display, m = i.position;
  i.visibility = "hidden", i.display = "block", i.position = "fixed";
  const g = o.offsetWidth, f = o.offsetHeight;
  return i.visibility = b, i.display = y, i.position = m, { width: g, height: f };
}
let ht = null;
async function me(o) {
  if (!o) {
    ht = null;
    return;
  }
  try {
    const i = new TextEncoder(), b = await crypto.subtle.digest("SHA-256", i.encode(o));
    ht = await crypto.subtle.importKey(
      "raw",
      b,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (i) {
    console.error("[ln-core/crypto] Key derivation failed:", i), ht = null;
  }
}
function dt() {
  return ht;
}
async function An(o, i = ht) {
  const b = i || ht;
  if (!b || o === void 0 || o === null) return o;
  try {
    const y = new TextEncoder(), m = crypto.getRandomValues(new Uint8Array(12)), g = typeof o == "string" ? o : JSON.stringify(o), f = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: m },
      b,
      y.encode(g)
    ), s = btoa(String.fromCharCode(...m)), u = btoa(String.fromCharCode(...new Uint8Array(f)));
    return {
      encrypted: !0,
      iv: s,
      data: u
    };
  } catch (y) {
    return console.error("[ln-core/crypto] Encryption failed:", y), o;
  }
}
async function Sn(o, i = ht) {
  const b = i || ht;
  if (!o || !o.encrypted || !b) return o;
  try {
    const y = new TextDecoder(), m = Uint8Array.from(atob(o.iv), (u) => u.charCodeAt(0)), g = Uint8Array.from(atob(o.data), (u) => u.charCodeAt(0)), f = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: m },
      b,
      g
    ), s = y.decode(f);
    try {
      return JSON.parse(s);
    } catch {
      return s;
    }
  } catch (y) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", y), { ...o, decryptionError: !0 };
  }
}
function Cn(o) {
  if (typeof o == "string") return o;
  if (o && typeof o == "object") {
    if (typeof o.href == "string") return o.href;
    if (typeof o.url == "string") return o.url;
  }
  return String(o || "");
}
function Ln(o, i) {
  return i && i.method ? String(i.method).toUpperCase() : o && typeof o == "object" && o.method ? String(o.method).toUpperCase() : "GET";
}
function Tn(o, i) {
  return (i || "GET") + " " + (o || "");
}
function qn(o) {
  const i = (o || "").toUpperCase();
  return i === "GET" || i === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const o = window.fetch.bind(window), i = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
  function y(f, s) {
    s = s || {};
    const u = Cn(f), d = Ln(f, s), _ = Tn(u, d);
    qn(d) && i.has(_) && (i.get(_).abort(), i.delete(_));
    const c = new AbortController(), p = s.signal;
    let h = null;
    p && (p.aborted ? c.abort(p.reason) : (h = function() {
      c.abort(p.reason);
    }, p.addEventListener("abort", h, { once: !0 })));
    const r = Object.assign({}, s, { signal: c.signal });
    return i.set(_, c), o(f, r).finally(function() {
      p && h && p.removeEventListener("abort", h), i.get(_) === c && i.delete(_);
    });
  }
  y.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = y;
  function m(f) {
    if (!f.detail || !f.detail.url) return;
    const s = f.target, u = (f.detail.method || (f.detail.body ? "POST" : "GET")).toUpperCase(), d = f.detail.key;
    d && b.has(d) && (b.get(d).abort(), b.delete(d));
    const _ = new AbortController(), c = f.detail.signal;
    let p = null;
    c && (c.aborted ? _.abort(c.reason) : (p = function() {
      _.abort(c.reason);
    }, c.addEventListener("abort", p, { once: !0 }))), d && b.set(d, _);
    const h = { method: u, signal: _.signal };
    f.detail.body !== void 0 && (h.body = f.detail.body), window.fetch(f.detail.url, h).then(function(r) {
      c && p && c.removeEventListener("abort", p), d && b.get(d) === _ && b.delete(d), C(s, "ln-http:response", {
        ok: r.ok,
        status: r.status,
        response: r
      });
    }).catch(function(r) {
      c && p && c.removeEventListener("abort", p), d && b.get(d) === _ && b.delete(d), !(r && r.name === "AbortError") && C(s, "ln-http:error", {
        ok: !1,
        status: 0,
        error: r
      });
    });
  }
  function g(f) {
    const s = f.detail || {};
    s.all ? window.lnHttp.cancelAll() : s.key ? window.lnHttp.cancelByKey(s.key) : s.url && window.lnHttp.cancel(s.url);
  }
  document.addEventListener("ln-http:request", m), document.addEventListener("ln-http:cancel", g), window.lnHttp = {
    cancel: function(f) {
      let s = !1;
      return i.forEach(function(u, d) {
        d.endsWith(" " + f) && (u.abort(), i.delete(d), s = !0);
      }), s;
    },
    cancelByKey: function(f) {
      return b.has(f) ? (b.get(f).abort(), b.delete(f), !0) : !1;
    },
    cancelAll: function() {
      i.forEach(function(f) {
        f.abort();
      }), i.clear(), b.forEach(function(f) {
        f.abort();
      }), b.clear();
    },
    get inflight() {
      const f = [];
      return i.forEach(function(s, u) {
        const d = u.indexOf(" ");
        f.push({ method: u.slice(0, d), url: u.slice(d + 1) });
      }), b.forEach(function(s, u) {
        f.push({ key: u });
      }), f;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", m), document.removeEventListener("ln-http:cancel", g), window.fetch = o, delete window.lnHttp;
    }
  };
})();
(function() {
  const o = "template[data-ln-include]", i = "lnInclude";
  if (window[i] !== void 0) return;
  const b = /* @__PURE__ */ new Map();
  function y(m) {
    if (this.dom = m, this.url = m.getAttribute("data-ln-include"), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    _n(), this._held = !0;
    const g = this, f = this.url;
    let s = b.get(f);
    return s || (s = fetch(f).then(function(u) {
      if (!u.ok)
        throw new Error("HTTP error! status: " + u.status);
      return u.text();
    }).catch(function(u) {
      throw b.delete(f), u;
    }), b.set(f, s)), s.then(function(u) {
      if (g._destroyed) return;
      const d = document.createElement("template");
      d.innerHTML = u, g.dom.content.appendChild(d.content), C(g.dom, "ln-include:loaded", { target: g.dom, url: g.url }), g._held && (g._held = !1, Wt());
    }).catch(function(u) {
      g._destroyed || (console.error("[ln-include] Failed to fetch template from " + g.url + ":", u), C(g.dom, "ln-include:error", { target: g.dom, url: g.url, error: u }), g._held && (g._held = !1, Wt()));
    }), this;
  }
  y.prototype.destroy = function() {
    this.dom[i] && (this._destroyed = !0, this._held && (this._held = !1, Wt()), delete this.dom[i]);
  }, H(o, i, y, "ln-include");
})();
(function() {
  const o = "data-ln-form", i = "lnForm", b = "data-ln-form-action-edit", y = "data-ln-form-action-method";
  if (window[i] !== void 0) return;
  function m(g) {
    this.dom = g, this._baseAction = g.getAttribute("action") || "";
    const f = this;
    return this._onLnFill = function(s) {
      s.target === f.dom && (s.detail ? (f.fill(s.detail), f._applyActionMode(s.detail)) : f.dom.reset());
    }, this._onReset = function() {
      f._applyActionMode(null);
    }, g.addEventListener("ln-fill", this._onLnFill), g.addEventListener("reset", this._onReset), this;
  }
  m.prototype.fill = function(g) {
    const f = xe(this.dom, g);
    for (let s = 0; s < f.length; s++) {
      const u = f[s], d = u.tagName === "SELECT" || u.type === "checkbox" || u.type === "radio";
      u.dispatchEvent(new Event(d ? "change" : "input", { bubbles: !0 }));
    }
  }, m.prototype._ensureMethodInput = function() {
    let g = this.dom.querySelector('input[name="_method"]');
    return g || (g = document.createElement("input"), g.type = "hidden", g.name = "_method", g.value = "", this.dom.appendChild(g)), g;
  }, m.prototype._applyActionMode = function(g) {
    if (!this.dom.hasAttribute(b)) return;
    const f = g && g.id != null && g.id !== "" ? g.id : null, s = this._ensureMethodInput();
    if (f !== null) {
      const u = this.dom.getAttribute(b);
      u ? this.dom.setAttribute("action", u.replace(":id", encodeURIComponent(f))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(f)), s.value = this.dom.getAttribute(y) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), s.value = "";
  }, m.prototype.destroy = function() {
    this.dom[i] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), C(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[i]);
  }, H(o, i, m, "ln-form");
})();
(function() {
  const o = "data-ln-validate", i = "lnValidate", b = "data-ln-validate-errors", y = "data-ln-validate-error", m = "ln-validate-valid", g = "ln-validate-invalid", f = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[i] !== void 0) return;
  function s(u) {
    this.dom = u, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const d = this, _ = u.tagName, c = u.type, p = _ === "SELECT" || c === "checkbox" || c === "radio";
    this._onInput = function() {
      d._touched = !0, d.validate();
    }, this._onChange = function() {
      d._touched = !0, d.validate();
    }, this._onSetCustom = function(a) {
      const n = a.detail && a.detail.error;
      if (!n) return;
      d._customErrors.add(n), d._touched = !0;
      const t = u.closest(".form-element");
      if (t) {
        const e = t.querySelector("[" + y + '="' + n + '"]');
        e && e.classList.remove("hidden");
      }
      u.classList.remove(m), u.classList.add(g), u.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(a) {
      const n = a.detail && a.detail.error, t = u.closest(".form-element");
      if (n) {
        if (d._customErrors.delete(n), t) {
          const e = t.querySelector("[" + y + '="' + n + '"]');
          e && e.classList.add("hidden");
        }
      } else
        d._customErrors.forEach(function(e) {
          if (t) {
            const l = t.querySelector("[" + y + '="' + e + '"]');
            l && l.classList.add("hidden");
          }
        }), d._customErrors.clear();
      d._touched && d.validate();
    }, p || u.addEventListener("input", this._onInput), u.addEventListener("change", this._onChange), u.addEventListener("ln-validate:set-custom", this._onSetCustom), u.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const h = u.form;
    return h && (h.hasAttribute("novalidate") || h.setAttribute("novalidate", ""), this._onFormReset = function() {
      d.reset();
    }, this._onValidateRequest = function(a) {
      d._touched = !0, !d.validate() && a.detail && a.detail.invalidFields && a.detail.invalidFields.push(d.dom);
    }, h.addEventListener("reset", this._onFormReset), h.addEventListener("ln-validate:request-validate", this._onValidateRequest), h._lnValidateGateBound || (h._lnValidateGateBound = !0, h.addEventListener("submit", function(a) {
      const n = { invalidFields: [] };
      C(h, "ln-validate:request-validate", n), n.invalidFields.length > 0 && (a.preventDefault(), n.invalidFields.sort((t, e) => t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), n.invalidFields[0].focus());
    }))), (u.value && u.value.trim() !== "" || u.checked) && (this._touched = !0, this.validate()), this;
  }
  s.prototype.validate = function() {
    const u = this.dom, d = u.validity, c = u.checkValidity() && this._customErrors.size === 0, p = u.closest(".form-element");
    if (p) {
      const r = p.querySelector("[" + b + "]");
      if (r) {
        const a = r.querySelectorAll("[" + y + "]");
        for (let n = 0; n < a.length; n++) {
          const t = a[n].getAttribute(y), e = f[t];
          e && (d[e] ? a[n].classList.remove("hidden") : a[n].classList.add("hidden"));
        }
      }
    }
    return u.classList.toggle(m, c), u.classList.toggle(g, !c), u.setAttribute("aria-invalid", c ? "false" : "true"), C(u, c ? "ln-validate:valid" : "ln-validate:invalid", { target: u, field: u.name }), c;
  }, s.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(m, g), this.dom.removeAttribute("aria-invalid");
    const u = this.dom.closest(".form-element");
    if (u) {
      const d = u.querySelectorAll("[" + y + "]");
      for (let _ = 0; _ < d.length; _++)
        d[_].classList.add("hidden");
    }
  }, Object.defineProperty(s.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), s.prototype.destroy = function() {
    if (!this.dom[i]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const u = this.dom.form;
    u && (this._onFormReset && u.removeEventListener("reset", this._onFormReset), this._onValidateRequest && u.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(m, g), this.dom.removeAttribute("aria-invalid"), C(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[i];
  }, H(o, i, s, "ln-validate");
})();
(function() {
  const o = "data-ln-ajax", i = "lnAjax", b = "data-ln-form-scope";
  if (window[i] !== void 0) return;
  function y(c) {
    if (!c.hasAttribute(o) || c[i]) return;
    c[i] = !0;
    const p = u(c);
    m(p.links), g(p.forms);
  }
  function m(c) {
    for (const p of c) {
      if (p[i + "Trigger"] || p.hostname && p.hostname !== window.location.hostname) continue;
      const h = p.getAttribute("href");
      if (h && h.includes("#")) continue;
      const r = function(a) {
        if (!Ie(a, p)) return;
        a.preventDefault();
        const n = p.getAttribute("href");
        n && s("GET", n, null, p);
      };
      p.addEventListener("click", r), p[i + "Trigger"] = r;
    }
  }
  function g(c) {
    for (const p of c) {
      if (p[i + "Trigger"]) continue;
      if (p.hasAttribute(b)) {
        p[i + "ScopeWarned"] || (p[i + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const h = function(r) {
        if (r.defaultPrevented) return;
        r.preventDefault();
        const a = p.method.toUpperCase(), n = p.action, t = new FormData(p);
        for (const e of p.querySelectorAll('button, input[type="submit"]'))
          e.disabled = !0;
        s(a, n, t, p, function() {
          for (const e of p.querySelectorAll('button, input[type="submit"]'))
            e.disabled = !1;
        });
      };
      p.addEventListener("submit", h), p[i + "Trigger"] = h;
    }
  }
  function f(c) {
    if (!c[i]) return;
    const p = u(c);
    for (const h of p.links)
      h[i + "Trigger"] && (h.removeEventListener("click", h[i + "Trigger"]), delete h[i + "Trigger"]);
    for (const h of p.forms)
      h[i + "Trigger"] && (h.removeEventListener("submit", h[i + "Trigger"]), delete h[i + "Trigger"]);
    delete c[i];
  }
  function s(c, p, h, r, a) {
    if (G(r, "ln-ajax:before-start", { method: c, url: p }).defaultPrevented) return;
    C(r, "ln-ajax:start", { method: c, url: p }), r.classList.add("ln-ajax--loading");
    const t = document.createElement("span");
    t.className = "ln-ajax-spinner", r.appendChild(t);
    function e() {
      r.classList.remove("ln-ajax--loading");
      const S = r.querySelector(".ln-ajax-spinner");
      S && S.remove(), a && a();
    }
    let l = p;
    const v = document.querySelector('meta[name="csrf-token"]'), w = v ? v.getAttribute("content") : null;
    h instanceof FormData && w && h.append("_token", w);
    const E = {
      method: c,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (w && (E.headers["X-CSRF-TOKEN"] = w), c === "GET" && h) {
      const S = new URLSearchParams(h);
      l = p + (p.includes("?") ? "&" : "?") + S.toString();
    } else c !== "GET" && h && (E.body = h);
    fetch(l, E).then(function(S) {
      const L = S.ok, x = S.status;
      return S.text().then(function(k) {
        let q = null, O = null;
        if (k && k.trim())
          try {
            q = JSON.parse(k);
          } catch (F) {
            O = F;
          }
        return { ok: L, status: x, data: q, parseError: O };
      });
    }).then(function(S) {
      const L = S.status, x = S.data, k = S.parseError;
      if (S.ok && !k) {
        if (x && x.title && (document.title = x.title), x && x.content)
          for (const q in x.content) {
            const O = document.getElementById(q);
            O && (O.innerHTML = x.content[q]);
          }
        if (r.tagName === "A") {
          const q = r.getAttribute("href");
          q && window.history.pushState({ ajax: !0 }, "", q);
        } else r.tagName === "FORM" && r.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", l);
        C(r, "ln-ajax:success", { method: c, url: l, data: x });
      } else
        C(r, "ln-ajax:error", {
          method: c,
          url: l,
          status: L,
          data: x,
          error: k || null
        });
      C(r, "ln-ajax:complete", { method: c, url: l }), e();
    }).catch(function(S) {
      C(r, "ln-ajax:error", { method: c, url: l, status: 0, data: null, error: S }), C(r, "ln-ajax:complete", { method: c, url: l }), e();
    });
  }
  function u(c) {
    const p = { links: [], forms: [] };
    return c.tagName === "A" && c.getAttribute(o) !== "false" ? p.links.push(c) : c.tagName === "FORM" && c.getAttribute(o) !== "false" ? p.forms.push(c) : (p.links = Array.from(c.querySelectorAll('a:not([data-ln-ajax="false"])')), p.forms = Array.from(c.querySelectorAll('form:not([data-ln-ajax="false"])'))), p;
  }
  function d() {
    lt(function() {
      new MutationObserver(function(p) {
        for (const h of p)
          if (h.type === "childList") {
            for (const r of h.addedNodes)
              if (r.nodeType === 1 && (y(r), !r.hasAttribute(o))) {
                for (const n of r.querySelectorAll("[" + o + "]"))
                  y(n);
                const a = r.closest && r.closest("[" + o + "]");
                if (a && a.getAttribute(o) !== "false") {
                  const n = u(r);
                  m(n.links), g(n.forms);
                }
              }
          } else h.type === "attributes" && y(h.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [o]
      });
    }, "ln-ajax");
  }
  function _() {
    for (const c of document.querySelectorAll("[" + o + "]"))
      y(c);
  }
  window[i] = y, window[i].destroy = f, d(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", _) : _();
})();
const Ue = {
  navigate: function(o) {
    qt(o, { historyAction: "push" });
  },
  replace: function(o) {
    qt(o, { historyAction: "replace" });
  },
  current: function() {
    return Xt ? {
      path: Yt,
      params: je,
      query: Ve,
      route: Xt,
      regions: Ke
    } : null;
  }
}, re = "data-ln-route", ze = "lnRoute";
typeof window < "u" && (window.lnRouter = Ue);
const at = /* @__PURE__ */ new Map(), ge = /* @__PURE__ */ new WeakMap();
let Ke = /* @__PURE__ */ new Map(), _e = !1, Yt = null, je = {}, Ve = {}, Xt = null, Jt = !1;
function be(o, i, b) {
  Jt ? queueMicrotask(function() {
    C(o, i, b);
  }) : C(o, i, b);
}
function Mt(o) {
  try {
    const g = new URL(o, window.location.origin);
    o = g.pathname + g.search + g.hash;
  } catch {
  }
  let [i] = o.split("#"), [b, y] = i.split("?");
  const m = {};
  if (y) {
    const g = new URLSearchParams(y);
    for (const [f, s] of g.entries())
      m[f] = s;
  }
  return b = b.replace(/\/+$/, ""), b === "" && (b = "/"), { path: b, query: m };
}
function We(o, i) {
  if (o.pattern === "*") return 1;
  if (i.pattern === "*") return -1;
  const b = o.segments, y = i.segments, m = Math.max(b.length, y.length);
  for (let g = 0; g < m; g++) {
    const f = b[g], s = y[g];
    if (f === void 0) return 1;
    if (s === void 0) return -1;
    if (f === "*") return 1;
    if (s === "*") return -1;
    const u = f.startsWith(":"), d = s.startsWith(":");
    if (u && !d) return 1;
    if (!u && d) return -1;
  }
  return 0;
}
function Ge(o, i) {
  const b = o.split("/").filter(Boolean);
  for (const y of i) {
    if (y.pattern === "*")
      return {
        route: y,
        params: { wildcard: o }
      };
    const m = y.segments, g = {};
    let f = !0;
    if (!(b.length > m.length && m[m.length - 1] !== "*")) {
      for (let s = 0; s < m.length; s++) {
        const u = m[s], d = b[s];
        if (u === "*") {
          g.wildcard = b.slice(s).join("/");
          break;
        }
        if (d === void 0) {
          f = !1;
          break;
        }
        if (u.startsWith(":"))
          g[u.slice(1)] = decodeURIComponent(d);
        else if (u !== d) {
          f = !1;
          break;
        }
      }
      if (f && (m.indexOf("*") !== -1 || b.length <= m.length))
        return { route: y, params: g };
    }
  }
  return null;
}
function Zt(o, i) {
  if (o !== "__primary__") {
    const y = document.getElementById(i.target);
    return y || console.warn(`[ln-router] Explicit target element #${i.target} not found in DOM`), y;
  }
  const b = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return b || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), b;
}
function xn(o) {
  if (!o) return;
  const i = Array.from(o.querySelectorAll("*")), b = [o].concat(i);
  for (const m of b)
    for (const g of Object.keys(m))
      if (g.startsWith("ln") && m[g] && typeof m[g].destroy == "function")
        try {
          m[g].destroy();
        } catch (f) {
          console.error(`[ln-router] Error destroying component ${g} on element:`, m, f);
        }
  const y = document.querySelectorAll('[data-ln-popover="open"]');
  for (const m of y) {
    const g = m.lnPopover;
    if (g && g.trigger && o.contains(g.trigger))
      try {
        g.destroy();
      } catch (f) {
        console.error("[ln-router] Error destroying open popover:", f);
      }
  }
}
function qt(o, i = {}) {
  const { path: b, query: y } = Mt(o), m = /* @__PURE__ */ new Map();
  for (const [_, c] of at)
    m.set(_, Ge(b, c.sorted));
  const g = at.has("__primary__"), f = m.get("__primary__");
  if (g && !f) {
    be(document.body, "ln-router:not-found", { path: b });
    return;
  }
  let s = null;
  if (f && (s = Zt("__primary__", f.route), !s || G(s, "ln-router:before-navigate", {
    from: Yt,
    to: o,
    params: f.params,
    query: y
  }).defaultPrevented))
    return;
  const u = [];
  for (const [_, c] of m) {
    if (!c) continue;
    const p = Zt(_, c.route);
    p && (_ !== "__primary__" && p.hasAttribute("data-ln-route-keep") && ge.get(p) === c.route.templateNode || u.push({ regionKey: _, match: c, targetEl: p }));
  }
  i.historyAction === "push" ? window.history.pushState(null, "", o) : i.historyAction === "replace" && window.history.replaceState(null, "", o);
  const d = function() {
    for (const { regionKey: _, match: c, targetEl: p } of u) {
      if (!(i.isHydration && p.hasAttribute("data-ln-router-hydrate") && p.children.length > 0)) {
        xn(p);
        const r = c.route.templateNode.content.cloneNode(!0);
        p.replaceChildren(r);
      }
      if (ge.set(p, c.route.templateNode), _ === "__primary__" && (c.route.title && (document.title = c.route.title), !i.isHydration)) {
        p.hasAttribute("tabindex") || p.setAttribute("tabindex", "-1");
        const r = p.querySelector("h1, h2, h3, h4, h5, h6");
        r ? (r.setAttribute("tabindex", "-1"), r.focus()) : p.focus(), p.scrollIntoView({ block: "start", behavior: "instant" });
      }
      be(p, "ln-router:navigated", {
        path: o,
        params: c.params,
        query: y,
        route: c.route,
        target: p,
        region: _
      });
    }
    f && (Yt = o, je = f.params, Ve = y, Xt = f.route), Ke = new Map(
      Array.from(m.entries()).map(([_, c]) => [_, c ? { route: c.route, params: c.params } : null])
    );
  };
  document.startViewTransition && !i.isHydration ? document.startViewTransition(d) : d();
}
function kn(o) {
  const i = o.target.closest("a");
  if (!i || !Ie(o, i)) return;
  const b = i.getAttribute("href"), { path: y } = Mt(b), m = at.get("__primary__");
  if (!m) return;
  Ge(y, m.sorted) && (o.preventDefault(), qt(b, { historyAction: "push" }));
}
function In(o, i) {
  const b = Object.keys(o), y = Object.keys(i);
  if (b.length !== y.length) return !1;
  for (let m = 0; m < b.length; m++) {
    const g = b[m];
    if (o[g] !== i[g]) return !1;
  }
  return !0;
}
function Dn() {
  const o = window.location.pathname + window.location.search, i = Ue.current();
  if (i && i.path != null) {
    const b = Mt(o);
    if (Mt(i.path).path === b.path && In(i.query, b.query))
      return;
  }
  qt(o, { historyAction: "skip" });
}
function Rn() {
  _e || (_e = !0, lt(function() {
    document.addEventListener("click", kn), window.addEventListener("popstate", Dn), Jt = !0;
    const o = window.location.pathname + window.location.search + window.location.hash;
    qt(o, { historyAction: "replace", isHydration: !0 }), Jt = !1;
  }, "ln-router"));
}
function On(o) {
  const i = o.getAttribute(re);
  if (!i) return;
  const b = o.getAttribute("data-ln-route-target") || null;
  if (b === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${i}" rejected.`);
    return;
  }
  const y = b || "__primary__";
  at.has(y) || at.set(y, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const m = at.get(y);
  if (m.routes.has(i)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${i}" in region "${y}"`);
    return;
  }
  const g = o.getAttribute("data-ln-route-title"), f = i.split("/").filter(Boolean), s = {
    pattern: i,
    segments: f,
    target: b,
    title: g,
    templateNode: o
  }, u = Zt(y, s);
  u && u.contains(o) && console.warn(`[ln-router] Route template with pattern "${i}" is declared inside its own outlet element:`, o), m.routes.set(i, s), m.sorted = Array.from(m.routes.values()).sort(We);
}
function Mn(o) {
  const i = o.getAttribute(re);
  if (!i) return;
  const y = o.getAttribute("data-ln-route-target") || null || "__primary__", m = at.get(y);
  m && (m.routes.delete(i), m.sorted = Array.from(m.routes.values()).sort(We), m.routes.size === 0 && at.delete(y));
}
function Qe(o) {
  return this.dom = o, On(o), this;
}
Qe.prototype.destroy = function() {
  Mn(this.dom), delete this.dom[ze];
};
H(re, ze, Qe, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    at.size > 0 && Rn();
  }
});
(function() {
  const o = "data-ln-modal", i = "lnModal";
  if (window[i] !== void 0) return;
  function b(m) {
    this.dom = m, this.isOpen = m.getAttribute(o) === "open";
    const g = this;
    return this._onRequestOpen = function() {
      g.dom.setAttribute(o, "open");
    }, this._onRequestClose = function() {
      g.dom.setAttribute(o, "close");
    }, this._onCancel = function(f) {
      f.preventDefault(), g.dom.setAttribute(o, "close");
    }, this._onClickClose = function(f) {
      const s = f.target.closest("[data-ln-modal-close]");
      s && g.dom.contains(s) && (f.preventDefault(), g.dom.setAttribute(o, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  b.prototype.open = function() {
    this.dom.setAttribute(o, "open");
  }, b.prototype.close = function() {
    this.dom.setAttribute(o, "close");
  }, b.prototype.toggle = function() {
    const m = this.dom.getAttribute(o);
    this.dom.setAttribute(o, m === "open" ? "close" : "open");
  }, b.prototype.destroy = function() {
    if (this.dom[i]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const m = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + o + '="open"]'),
          function(f) {
            return f !== m;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      C(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[i];
    }
  };
  function y(m) {
    const g = m[i];
    if (!g) return;
    const s = m.getAttribute(o) === "open";
    if (s !== g.isOpen)
      if (s) {
        if (G(m, "ln-modal:before-open", { modalId: m.id, target: m }).defaultPrevented) {
          m.setAttribute(o, "close");
          return;
        }
        g.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof m.showModal == "function" && m.showModal();
        const d = m.querySelector("[autofocus]");
        if (d && Lt(d))
          d.focus();
        else {
          const _ = m.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), c = Array.prototype.find.call(_, Lt);
          if (c) c.focus();
          else {
            const p = m.querySelectorAll("a[href], button:not([disabled])"), h = Array.prototype.find.call(p, Lt);
            h && h.focus();
          }
        }
        C(m, "ln-modal:open", { modalId: m.id, target: m });
      } else {
        if (G(m, "ln-modal:before-close", { modalId: m.id, target: m }).defaultPrevented) {
          m.setAttribute(o, "open");
          return;
        }
        g.isOpen = !1, C(m, "ln-modal:close", { modalId: m.id, target: m }), typeof m.close == "function" && m.close(), document.querySelector("[" + o + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  H(o, i, b, "ln-modal", {
    onAttributeChange: y
  });
})();
(function() {
  const o = "data-ln-ui-coordinator", i = "lnUiCoordinator", b = "data-ln-ui-coordinator-dict";
  if (window[i] !== void 0) return;
  function y(n) {
    const t = {};
    let e = n;
    const l = [];
    for (; e; ) {
      const v = e.closest("[" + o + "]");
      if (!v) break;
      v[i] && v[i].dict && l.unshift(v[i].dict), e = v.parentElement;
    }
    for (const v of l)
      Object.assign(t, v);
    return t;
  }
  function m(n, t) {
    if (t) {
      if (n) {
        const l = n.closest("[" + o + "]");
        if (l) {
          if (l.id === t && l.hasAttribute("data-ln-modal")) return l;
          const v = l.querySelector("#" + CSS.escape(t) + '[data-ln-modal], [data-ln-modal="' + t + '"]');
          if (v) return v;
        }
      }
      const e = document.getElementById(t) || document.querySelector('[data-ln-modal="' + t + '"]');
      if (e) return e;
    }
    if (n) {
      const e = n.closest("[" + o + "]");
      if (e) {
        if (e.hasAttribute("data-ln-modal")) return e;
        const v = e.querySelector("[data-ln-modal]");
        if (v) return v;
      }
      const l = n.closest("[data-ln-modal]");
      if (l) return l;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function g(n, t) {
    if (n !== "edit") return "";
    if (t) {
      const e = t.getAttribute("data-ln-fill-id");
      if (e) return e;
    }
    return "edit";
  }
  function f(n) {
    if (!n) return;
    const t = n.querySelectorAll("[data-ln-field]");
    for (let l = 0; l < t.length; l++)
      t[l].textContent = "";
    const e = n.querySelectorAll("form");
    for (let l = 0; l < e.length; l++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(e[l], null) : e[l].reset();
  }
  document.addEventListener("click", function(n) {
    if (n.ctrlKey || n.metaKey || n.button === 1) return;
    const t = n.target.closest("[data-ln-modal-for]");
    if (t) {
      const l = t.getAttribute("data-ln-modal-for"), v = m(t, l);
      if (v && v.lnModal) {
        n.preventDefault();
        const w = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, E = {}, S = t.dataset;
        for (const k in S) {
          if (!k.startsWith("lnModal") || w[k]) continue;
          const q = k.slice(7);
          q && (E[q.charAt(0).toLowerCase() + q.slice(1)] = S[k]);
        }
        const L = Object.keys(E).length > 0;
        t.hasAttribute("data-ln-modal-mode") ? v.dataset.lnModalMode = t.getAttribute("data-ln-modal-mode") : v.dataset.lnModalMode = L ? "edit" : "new", L && window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(v, E) : v.dataset.lnModalMode === "new" && f(v), v.getAttribute("data-ln-modal") === "open" ? C(v, "ln-modal:request-close", {}) : (v.id && Z(v.id, g(v.dataset.lnModalMode, t)), C(v, "ln-modal:request-open", {}));
      }
      return;
    }
    const e = n.target.closest('a[href^="#"]');
    if (e) {
      const l = Bt(e.getAttribute("href"));
      for (const v in l) {
        const w = document.getElementById(v);
        if (w && w.lnModal) {
          if (!ie(n)) return;
          Z(v, l[v]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(n) {
    const t = n.target;
    if (!t || !t.lnModal) return;
    (t.dataset.lnModalMode || "new") === "new" && f(t);
  }), document.addEventListener("ln-modal:open", function(n) {
    const t = n.target;
    if (!t || !t.lnModal || !t.id) return;
    let e = Y(t.id);
    e === null && (e = g(t.dataset.lnModalMode, null), Z(t.id, e)), e ? (t.dataset.lnModalMode = "edit", t.dispatchEvent(new CustomEvent("ln-fill:request", {
      bubbles: !0,
      detail: { id: e }
    }))) : (t.dataset.lnModalMode = "new", f(t));
  });
  let s = !1;
  function u() {
    if (!s) {
      s = !0;
      try {
        const n = document.querySelectorAll("[data-ln-modal][id]");
        for (let t = 0; t < n.length; t++) {
          const e = n[t];
          if (!e.lnModal) continue;
          const l = e.id, v = Y(l), w = v !== null, E = e.lnModal.isOpen;
          if (w) {
            const S = v ? "edit" : "new";
            e.dataset.lnModalMode = S, E ? v ? e.dispatchEvent(new CustomEvent("ln-fill:request", {
              bubbles: !0,
              detail: { id: v }
            })) : f(e) : C(e, "ln-modal:request-open", {});
          } else E && C(e, "ln-modal:request-close", {});
        }
      } finally {
        s = !1;
      }
    }
  }
  function d() {
    const n = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let t = 0; t < n.length; t++) {
      const e = n[t];
      e.lnModal && Y(e.id) === null && Z(e.id, g(e.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", u);
  function _() {
    d(), u();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    it(_);
  }) : it(_);
  function c(n) {
    const e = (n.detail || {}).data;
    if (e && e.message) {
      const v = e.message;
      window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
        detail: {
          type: v.type || "success",
          title: v.title || "",
          message: v.body || ""
        }
      }));
    }
    const l = n.target.closest("[data-ln-modal]");
    l && l.lnModal && (l.id && Z(l.id, null), C(l, "ln-modal:request-close", {}), f(l));
  }
  function p(n) {
    const t = n.detail || {}, e = t.data, l = t.status || 0, v = y(n.target);
    if (e && e.message) {
      const w = e.message;
      window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
        detail: {
          type: w.type || "error",
          title: w.title || "",
          message: w.body || ""
        }
      }));
    } else l === 0 ? window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
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
  document.addEventListener("ln-ajax:success", c), document.addEventListener("ln-ajax:error", p);
  function h(n) {
    const t = n.detail || {}, e = y(n.target), l = t.message || (t.reason === "max-size" ? e["upload-max-size"] || "File is too large" : t.reason === "max-files" ? e["upload-max-files"] || "Maximum file count exceeded" : e["upload-invalid-type"] || "This file type is not allowed"), v = e["upload-invalid-title"] || "Invalid File";
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: v,
        message: l
      }
    }));
  }
  function r(n) {
    const t = n.detail || {}, e = y(n.target), l = t.message || e["upload-failed"] || "Failed to upload file", v = e["upload-error-title"] || "Upload Error";
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: v,
        message: l
      }
    }));
  }
  document.addEventListener("ln-upload:invalid", h), document.addEventListener("ln-upload:error", r), document.addEventListener("ln-modal:close", function(n) {
    const t = n.target;
    !t || !t.lnModal || (t.id && Y(t.id) !== null && Z(t.id, null), t.dataset.lnModalMode === "new" && f(t));
  });
  function a(n) {
    return this.dom = n, this.dict = Nt(n, b), this;
  }
  a.prototype.destroy = function() {
    this.dom[i] && (this.dict = {}, delete this.dom[i]);
  }, H(o, i, a, "ln-ui-coordinator");
})();
const st = {};
function Ft(o) {
  const i = o || "default";
  if (!st[i]) {
    const b = new Intl.NumberFormat(o, { useGrouping: !0 }), y = b.formatToParts(1234.5);
    let m = "", g = ".";
    for (let f = 0; f < y.length; f++)
      y[f].type === "group" && (m = y[f].value), y[f].type === "decimal" && (g = y[f].value);
    st[i] = { groupSep: m, decimalSep: g, fmt: b };
  }
  return st[i];
}
function $e(o, i, b) {
  if (o == null || typeof o != "string") return "";
  let y = o.trim();
  return y === "" ? "" : (y = y.replace(/[$€£¥]/g, ""), i && (y = y.split(i).join("")), y = y.replace(/\s/g, ""), b && b !== "." && (y = y.replace(b, ".")), y = y.replace(/[^\d.-]/g, ""), y);
}
function kt(o, i) {
  if (typeof o == "number") return isNaN(o) ? NaN : o;
  if (o == null || typeof o != "string") return NaN;
  const b = o.trim();
  if (b === "" || b === "-") return NaN;
  const { groupSep: y, decimalSep: m } = Ft(i), g = $e(b, y, m);
  if (g === "" || g === "-" || g === ".") return NaN;
  const f = parseFloat(g);
  return isNaN(f) ? NaN : f;
}
function ot(o, i, b = {}) {
  if (typeof o != "number" || isNaN(o)) return "";
  const y = i || "default", m = b.maxDecimals != null ? parseInt(b.maxDecimals, 10) : null, g = b.userDecimals != null ? b.userDecimals : null;
  if (m !== null) {
    const f = y + "|max:" + m;
    return st[f] || (st[f] = new Intl.NumberFormat(i, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: m
    })), st[f].format(o);
  }
  if (g !== null && g > 0) {
    const f = y + "|exact:" + g;
    return st[f] || (st[f] = new Intl.NumberFormat(i, {
      useGrouping: !0,
      minimumFractionDigits: g,
      maximumFractionDigits: g
    })), st[f].format(o);
  }
  return Ft(i).fmt.format(o);
}
function Fn(o, i) {
  if (!o) return 0;
  if (i <= 0)
    return o.startsWith("-") ? 1 : 0;
  let b = i, y = 0;
  for (let m = 0; m < o.length && b > 0; m++)
    y = m + 1, /[0-9]/.test(o[m]) && b--;
  return b > 0 && (y = o.length), y;
}
(function() {
  const o = "data-ln-number", i = "lnNumber";
  if (window[i] !== void 0) return;
  const b = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function y(m) {
    if (m[i]) return m[i];
    m[i] = this, this.dom = m;
    const g = this;
    if (this._onLocaleChange = function() {
      g.isTextElement ? g._formatTextContent() : isNaN(g.value) || g._displayFormatted(g.value);
    }, Pt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), m.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const f = document.createElement("input");
    f.type = "hidden", f.name = m.name, m.removeAttribute("name"), m.hasAttribute("data-ln-fill-as") && f.setAttribute("data-ln-fill-as", m.getAttribute("data-ln-fill-as")), m.type = "text", m.setAttribute("inputmode", "decimal"), m.insertAdjacentElement("afterend", f), this._hidden = f, Object.defineProperty(f, "value", {
      get: function() {
        return b.get.call(f);
      },
      set: function(u) {
        if (b.set.call(f, u), u !== "" && !isNaN(parseFloat(u))) {
          const d = g.dom.getAttribute("data-ln-number-decimals");
          g._setDisplayRaw(ot(parseFloat(u), Q(g.dom), { maxDecimals: d }));
        } else
          g._setDisplayRaw("");
        g.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), ke(m, b, {
      get: function() {
        return b.get.call(m);
      },
      set: function(u) {
        if (u === "") {
          g._setDisplayRaw(""), g._setHiddenRaw(""), m.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const d = typeof u == "number" ? u : kt(String(u), Q(m));
        if (isNaN(d))
          g._setDisplayRaw(String(u)), g._setHiddenRaw("");
        else {
          g._setHiddenRaw(d);
          const _ = m.getAttribute("data-ln-number-decimals");
          g._setDisplayRaw(ot(d, Q(m), { maxDecimals: _ }));
        }
        m.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      g._handleInput();
    }, m.addEventListener("input", this._onInput), this._onKeyDown = function(u) {
      if (u.key !== "Backspace") return;
      const d = m.selectionStart, _ = m.selectionEnd;
      if (d !== _ || d === 0) return;
      const c = Ft(Q(m)), p = b.get.call(m), h = p[d - 1];
      if (h === c.groupSep || /\s/.test(h)) {
        u.preventDefault();
        const r = d - 2 >= 0 ? d - 2 : 0, a = p.slice(0, r) + p.slice(d);
        b.set.call(m, a), m.setSelectionRange(r, r), m.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, m.addEventListener("keydown", this._onKeyDown), this._onPaste = function(u) {
      u.preventDefault();
      const d = (u.clipboardData || window.clipboardData).getData("text"), _ = kt(d, Q(m));
      g.value = isNaN(_) ? NaN : _;
    }, m.addEventListener("paste", this._onPaste);
    const s = m.value;
    if (s !== "") {
      const u = kt(s, Q(m));
      if (!isNaN(u)) {
        const d = m.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(u), this._setDisplayRaw(ot(u, Q(m), { maxDecimals: d })), m.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return this;
  }
  y.prototype._initTextElement = function() {
    const m = this.dom;
    let g = m.getAttribute("data-ln-value"), f = m.getAttribute("data-ln-number"), s = null;
    g !== null && g !== "" ? s = g : f !== null && f !== "" && f !== "true" ? s = f : s = m.textContent.trim();
    const u = kt(s, Q(m));
    isNaN(u) ? this._rawValue = null : (this._rawValue = u, m.hasAttribute("data-ln-value") || m.setAttribute("data-ln-value", String(u)), this._formatTextContent());
  }, y.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const m = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = ot(this._rawValue, Q(this.dom), { maxDecimals: m });
    }
  }, y.prototype._handleInput = function() {
    const m = this.dom, g = b.get.call(m);
    if (g === "") {
      this._setHiddenRaw(""), C(m, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (g === "-") {
      this._setHiddenRaw(""), C(m, "ln-number:input", { value: NaN, formatted: "-" });
      return;
    }
    const f = m.selectionStart;
    let s = 0;
    for (let l = 0; l < f; l++)
      /[0-9]/.test(g[l]) && s++;
    const u = Q(m), d = Ft(u);
    let _ = g, c = $e(g, d.groupSep, d.decimalSep), p = parseFloat(c);
    if (isNaN(p)) {
      this._setHiddenRaw(""), C(m, "ln-number:input", { value: NaN, formatted: g });
      return;
    }
    const h = m.getAttribute("data-ln-number-decimals"), r = c.indexOf(".");
    if (h !== null && r !== -1) {
      const l = parseInt(h, 10), v = c.slice(r + 1);
      if (l === 0)
        c = c.slice(0, r), _ = _.split(d.decimalSep)[0], p = parseFloat(c), this._setDisplayRaw(_);
      else if (v.length > l) {
        c = c.slice(0, r + 1 + l);
        const w = _.split(d.decimalSep);
        _ = w[0] + d.decimalSep + w[1].slice(0, l), p = parseFloat(c), this._setDisplayRaw(_);
      }
    }
    const a = m.getAttribute("data-ln-number-max");
    if (a !== null && p > parseFloat(a)) {
      const l = parseFloat(a), v = ot(l, u, { maxDecimals: h });
      this._setDisplayRaw(v), this._setHiddenRaw(l), m.setSelectionRange(v.length, v.length), C(m, "ln-number:input", { value: l, formatted: v });
      return;
    }
    if (_.endsWith(d.decimalSep) || d.decimalSep !== "." && _.endsWith(".")) {
      this._setHiddenRaw(p), C(m, "ln-number:input", { value: p, formatted: _ });
      return;
    }
    const n = c.indexOf(".");
    if (n !== -1 && c.slice(n + 1).endsWith("0")) {
      this._setHiddenRaw(p), C(m, "ln-number:input", { value: p, formatted: _ });
      return;
    }
    let t;
    if (h !== null)
      t = ot(p, u, { maxDecimals: h });
    else {
      const l = n !== -1 ? c.slice(n + 1).length : 0;
      t = ot(p, u, { userDecimals: l });
    }
    this._setDisplayRaw(t);
    const e = Fn(t, s);
    m.setSelectionRange(e, e), this._setHiddenRaw(p), C(m, "ln-number:input", { value: p, formatted: t });
  }, y.prototype._setHiddenRaw = function(m) {
    this._hidden && b.set.call(this._hidden, String(m));
  }, y.prototype._setDisplayRaw = function(m) {
    this.isTextElement ? this.dom.textContent = String(m) : b.set.call(this.dom, String(m));
  }, y.prototype._displayFormatted = function(m) {
    if (this.isTextElement)
      this._formatTextContent();
    else {
      const g = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(ot(m, Q(this.dom), { maxDecimals: g }));
    }
  }, Object.defineProperty(y.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const m = b.get.call(this._hidden);
      return m === "" ? NaN : parseFloat(m);
    },
    set: function(m) {
      if (this.isTextElement) {
        typeof m != "number" || isNaN(m) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = m, this.dom.setAttribute("data-ln-value", String(m)), this._formatTextContent());
        return;
      }
      if (typeof m != "number" || isNaN(m)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(m);
      const g = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(ot(m, Q(this.dom), { maxDecimals: g })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(y.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : b.get.call(this.dom);
    }
  }), y.prototype.destroy = function() {
    this.dom[i] && (this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), C(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[i]);
  }, H(o, i, y, "ln-number", {
    extraAttributes: [
      "data-ln-value",
      "data-ln-number-decimals",
      "data-ln-number-min",
      "data-ln-number-max",
      "lang"
    ],
    onAttributeChange: function(m) {
      const g = m[i];
      g && (g.isTextElement ? g._initTextElement() : isNaN(g.value) || g._displayFormatted(g.value));
    }
  });
})();
(function() {
  const o = "data-ln-date", i = "lnDate";
  if (window[i] !== void 0) return;
  const b = {}, y = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function m(t, e) {
    const l = t + "|" + JSON.stringify(e);
    return b[l] || (b[l] = new Intl.DateTimeFormat(t, e)), b[l];
  }
  const g = /^(short|medium|long)(\s+datetime)?$/, f = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function s(t) {
    return !t || t === "" ? { dateStyle: "medium" } : t.match(g) ? f[t] : null;
  }
  function u(t, e, l) {
    const v = t.getDate(), w = t.getMonth(), E = t.getFullYear(), S = t.getHours(), L = t.getMinutes();
    let x, k;
    const q = Tt(l), O = (l || "").toLowerCase().split("-")[0], P = m(l, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0], V = q && P !== O;
    V && q.monthsLong ? x = q.monthsLong[w] : x = m(l, { month: "long" }).format(t), V && q.monthsShort ? k = q.monthsShort[w] : k = m(l, { month: "short" }).format(t);
    const U = {
      yyyy: String(E),
      yy: String(E).slice(-2),
      MMMM: x,
      MMM: k,
      MM: String(w + 1).padStart(2, "0"),
      M: String(w + 1),
      dd: String(v).padStart(2, "0"),
      d: String(v),
      HH: String(S).padStart(2, "0"),
      mm: String(L).padStart(2, "0")
    };
    return e.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(B) {
      return U[B];
    });
  }
  function d(t, e, l) {
    const v = s(e);
    if (v) {
      const w = m(l, v), E = (l || "").toLowerCase().split("-")[0], S = w.resolvedOptions().locale.toLowerCase().split("-")[0];
      return Tt(l) && S !== E ? u(t, "dd.MM.yyyy", l) : w.format(t);
    }
    return u(t, e, l);
  }
  function _(t) {
    if (!t) return "";
    const e = t.getFullYear(), l = String(t.getMonth() + 1).padStart(2, "0"), v = String(t.getDate()).padStart(2, "0");
    return e + "-" + l + "-" + v;
  }
  function c(t, e, l) {
    C(t.dom, "ln-date:change", {
      value: e,
      formatted: t.dom.value,
      date: l
    }), t.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function p(t, e, l, v) {
    t._setHiddenRaw(e), y.set.call(t._picker, e), t._lastISO = e, v !== void 0 ? (t._isFormatting = !0, t.dom.value = v, t._isFormatting = !1) : l && t._displayFormatted(l), c(t, e, l);
  }
  function h(t) {
    t._setHiddenRaw(""), y.set.call(t._picker, ""), t._isFormatting = !0, t.dom.value = "", t._isFormatting = !1, t._lastISO = "", c(t, "", null);
  }
  r.prototype._initTextElement = function() {
    const t = this.dom;
    let e = t.getAttribute("data-ln-value"), l = t.getAttribute("data-ln-date"), v = t.getAttribute("datetime"), w = null;
    e !== null && e !== "" ? w = e : v !== null && v !== "" ? w = v : l !== null && l !== "" && l !== "true" && !g.test(l) ? w = l : w = t.textContent.trim();
    let E = a(w) || n(w);
    if (!E && w)
      if (isNaN(w))
        E = new Date(w);
      else {
        const S = Number(w);
        E = new Date(S > 1e11 ? S : S * 1e3);
      }
    if (E && !isNaN(E.getTime())) {
      const S = _(E);
      this._rawValue = S, t.hasAttribute("data-ln-value") || t.setAttribute("data-ln-value", S), this._formatTextContent();
    } else
      this._rawValue = null;
  }, r.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const t = a(this._rawValue);
      if (t) {
        let l = this.dom.getAttribute("data-ln-date-format");
        if (!l) {
          const w = this.dom.getAttribute("data-ln-date");
          w && g.test(w) && (l = w);
        }
        const v = Q(this.dom);
        this.dom.textContent = d(t, l || "medium", v);
      }
    }
  };
  function r(t) {
    if (t[i]) return t[i];
    t[i] = this, this.dom = t;
    const e = this;
    if (this._onLocaleChange = function() {
      if (e.isTextElement)
        e._formatTextContent();
      else if (e.value) {
        const q = a(e.value);
        q && e._displayFormatted(q);
      }
    }, Pt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), t.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const l = t.value, v = t.name, E = (t.closest(".form-element, form") || t.parentNode).querySelectorAll("[data-ln-date-dict]");
    for (let q = 0; q < E.length; q++) {
      const O = E[q].getAttribute("data-ln-date-dict");
      if (O) {
        const F = Nt(E[q], "data-ln-date-dict-key");
        F["months-long"] && (F.monthsLong = F["months-long"].split(",").map((P) => P.trim())), F["months-short"] && (F.monthsShort = F["months-short"].split(",").map((P) => P.trim())), ee(O, F);
      }
    }
    const S = document.createElement("span");
    S.setAttribute("data-ln-date-field", ""), t.parentNode.insertBefore(S, t), S.appendChild(t), this._wrapper = S;
    const L = document.createElement("input");
    L.type = "hidden", L.name = v, t.removeAttribute("name"), t.hasAttribute("data-ln-fill-as") && L.setAttribute("data-ln-fill-as", t.getAttribute("data-ln-fill-as")), t.insertAdjacentElement("afterend", L), this._hidden = L;
    const x = document.createElement("input");
    x.type = "date", x.tabIndex = -1, x.setAttribute("tabindex", "-1"), x.setAttribute("aria-hidden", "true"), x.setAttribute("aria-label", t.getAttribute("data-ln-date-label") || "Date picker"), x.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", L.insertAdjacentElement("afterend", x), this._picker = x, t.type = "text";
    const k = document.createElement("button");
    if (k.type = "button", k.setAttribute("aria-label", t.getAttribute("data-ln-date-label") || "Open date picker"), k.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', x.insertAdjacentElement("afterend", k), this._btn = k, this._lastISO = "", Object.defineProperty(L, "value", {
      get: function() {
        return y.get.call(L);
      },
      set: function(q) {
        if (y.set.call(L, q), q && q !== "") {
          const O = a(q);
          O && p(e, q, O);
        } else q === "" && h(e);
      }
    }), ke(t, y, {
      get: function() {
        return y.get.call(t);
      },
      set: function(q, O) {
        if (e._isFormatting) {
          O(q);
          return;
        }
        if (!q || q === "") {
          O(""), h(e);
          return;
        }
        const F = a(q) || n(q);
        if (F) {
          const P = _(F), V = t.getAttribute(o) || "", U = Q(t), B = d(F, V, U);
          O(B), p(e, P, F, B);
        } else
          O(String(q)), h(e);
      }
    }), this._onPickerChange = function() {
      const q = x.value;
      if (q) {
        const O = a(q);
        O && p(e, q, O);
      } else
        h(e);
    }, x.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const q = e.dom.value.trim();
      if (q === "") {
        e._lastISO !== "" && h(e);
        return;
      }
      if (e._lastISO) {
        const F = a(e._lastISO);
        if (F) {
          const P = e.dom.getAttribute(o) || "", V = Q(e.dom);
          if (q === d(F, P, V)) return;
        }
      }
      const O = n(q);
      if (O) {
        const F = _(O);
        p(e, F, O);
      } else if (e._lastISO) {
        const F = a(e._lastISO);
        F && e._displayFormatted(F);
      } else
        e.dom.value = "";
    }, t.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      e._openPicker();
    }, k.addEventListener("click", this._onBtnClick), l && l !== "") {
      const q = a(l);
      q && p(e, l, q);
    }
    return this;
  }
  function a(t) {
    if (!t || typeof t != "string") return null;
    const e = t.split("T"), l = e[0].split("-");
    if (l.length < 3) return null;
    const v = parseInt(l[0], 10), w = parseInt(l[1], 10) - 1, E = parseInt(l[2], 10);
    if (isNaN(v) || isNaN(w) || isNaN(E)) return null;
    let S = 0, L = 0;
    if (e[1]) {
      const k = e[1].split(":");
      S = parseInt(k[0], 10) || 0, L = parseInt(k[1], 10) || 0;
    }
    const x = new Date(v, w, E, S, L);
    return x.getFullYear() !== v || x.getMonth() !== w || x.getDate() !== E ? null : x;
  }
  function n(t) {
    if (!t || typeof t != "string" || (t = t.trim(), t.length < 6)) return null;
    let e, l;
    if (t.indexOf(".") !== -1)
      e = ".", l = t.split(".");
    else if (t.indexOf("/") !== -1)
      e = "/", l = t.split("/");
    else if (t.indexOf("-") !== -1)
      e = "-", l = t.split("-");
    else
      return null;
    if (l.length !== 3) return null;
    const v = [];
    for (let x = 0; x < 3; x++) {
      const k = parseInt(l[x], 10);
      if (isNaN(k)) return null;
      v.push(k);
    }
    let w, E, S;
    e === "." ? (w = v[0], E = v[1], S = v[2]) : e === "/" ? (E = v[0], w = v[1], S = v[2]) : l[0].length === 4 ? (S = v[0], E = v[1], w = v[2]) : (w = v[0], E = v[1], S = v[2]), S < 100 && (S += S < 50 ? 2e3 : 1900);
    const L = new Date(S, E - 1, w);
    return L.getFullYear() !== S || L.getMonth() !== E - 1 || L.getDate() !== w ? null : L;
  }
  r.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, r.prototype._setHiddenRaw = function(t) {
    y.set.call(this._hidden, t);
  }, r.prototype._displayFormatted = function(t) {
    const e = this.dom.getAttribute(o) || "", l = Q(this.dom);
    this._isFormatting = !0, this.dom.value = d(t, e, l), this._isFormatting = !1;
  }, Object.defineProperty(r.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : y.get.call(this._hidden);
    },
    set: function(t) {
      if (this.isTextElement) {
        if (!t || t === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const l = a(t) || n(t);
        if (!l) return;
        const v = _(l);
        this._rawValue = v, this.dom.setAttribute("data-ln-value", v), this._formatTextContent();
        return;
      }
      if (!t || t === "") {
        h(this);
        return;
      }
      const e = a(t);
      e && p(this, t, e);
    }
  }), Object.defineProperty(r.prototype, "date", {
    get: function() {
      const t = this.value;
      return t ? a(t) : null;
    },
    set: function(t) {
      if (!t || !(t instanceof Date) || isNaN(t.getTime())) {
        this.value = "";
        return;
      }
      this.value = _(t);
    }
  }), Object.defineProperty(r.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), r.prototype.destroy = function() {
    if (!this.dom[i]) return;
    if (this.isTextElement) {
      C(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[i];
      return;
    }
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const t = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", t && (this.dom.value = t), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), C(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[i];
  }, H(o, i, r, "ln-date", {
    extraAttributes: ["data-ln-date-format", "data-ln-date-locale", "data-ln-value", "datetime", "lang"],
    onAttributeChange: function(t) {
      const e = t[i];
      if (e) {
        if (e.isTextElement)
          e._initTextElement();
        else if (e.value) {
          const l = a(e.value);
          l && e._displayFormatted(l);
        }
      }
    }
  });
})();
(function() {
  const o = "data-ln-nav", i = "lnNav";
  if (window[i] !== void 0) return;
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const g = history.pushState;
    history.pushState = function() {
      g.apply(history, arguments);
      for (const s of history._lnNavCallbacks)
        s();
    };
    const f = history.replaceState;
    history.replaceState = function() {
      f.apply(history, arguments);
      for (const s of history._lnNavCallbacks)
        s();
    }, history._lnNavPatched = !0;
  }
  function b(g) {
    return this.dom = g, this.activeClass = g.getAttribute(o) || "active", this.exact = g.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(g, { childList: !0, subtree: !0 }), this.update(), this;
  }
  b.prototype.update = function() {
    if (!this.activeClass || G(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const f = Array.from(this.dom.querySelectorAll("a")), s = window.location.pathname, u = y(s), d = [];
    for (const _ of f) {
      const c = _.getAttribute("href");
      if (!c || c === "#" || c.startsWith("#") || c.startsWith("javascript:") || c.startsWith("mailto:") || c.startsWith("tel:")) {
        _.classList.remove(this.activeClass), _.removeAttribute("aria-current");
        continue;
      }
      if (_.hostname && _.hostname !== window.location.hostname) {
        _.classList.remove(this.activeClass), _.removeAttribute("aria-current");
        continue;
      }
      const p = y(c), h = p === u, r = !this.exact && p !== "/" && u.startsWith(p + "/");
      h || r ? (_.classList.add(this.activeClass), _.setAttribute("aria-current", "page"), d.push(_)) : (_.classList.remove(this.activeClass), _.removeAttribute("aria-current"));
    }
    C(this.dom, "ln-nav:update", { target: this.dom, activeLinks: d });
  }, b.prototype.destroy = function() {
    if (!this.dom[i]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const g = history._lnNavCallbacks.indexOf(this.updateHandler);
    g !== -1 && history._lnNavCallbacks.splice(g, 1), C(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[i];
  };
  function y(g) {
    try {
      return new URL(g, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return g.replace(/\/$/, "") || "/";
    }
  }
  function m(g, f) {
    const s = g[i];
    if (s) {
      if (f === o) {
        if (!g.hasAttribute(o)) {
          s.destroy();
          return;
        }
        const u = s.activeClass, d = g.getAttribute(o) || "active";
        if (u !== d) {
          const _ = g.querySelectorAll("a");
          for (const c of _)
            u && c.classList.remove(u);
          s.activeClass = d;
        }
      } else f === "data-ln-nav-exact" && (s.exact = g.hasAttribute("data-ln-nav-exact"));
      s.update();
    }
  }
  H(o, i, b, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: m
  });
})();
(function() {
  const o = "data-ln-tabs", i = "lnTabs";
  if (window[i] !== void 0 && window[i] !== null) return;
  function b(g, f) {
    const s = (g.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (s) return s;
    if (g.tagName !== "A") return "";
    const u = g.getAttribute("href") || "";
    if (!u.startsWith("#")) return "";
    const d = u.slice(1);
    if (!d) return "";
    const _ = d.split("&");
    if (f)
      for (const h of _) {
        const r = h.indexOf(":");
        if (r > 0 && h.slice(0, r).toLowerCase().trim() === f)
          return h.slice(r + 1).toLowerCase().trim();
      }
    const c = _[_.length - 1] || "", p = c.indexOf(":");
    return (p > 0 ? c.slice(p + 1) : c).toLowerCase().trim();
  }
  function y(g) {
    return this.dom = g, this.activeKey = null, m.call(this), this;
  }
  function m() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const g = this.tabs.filter((u) => u.tagName === "A" && (u.getAttribute("href") || "").startsWith("#")), f = g.length > 0 && g.length === this.tabs.length;
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = f && !!this.nsKey, g.length > 0 && g.length !== this.tabs.length ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : f && !this.nsKey && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const u of this.tabs) {
      const d = b(u, this.nsKey);
      d ? this.mapTabs[d] = u : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', u);
    }
    for (const u of this.panels) {
      const d = (u.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      d && (this.mapPanels[d] = u);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const s = this;
    this._clickHandlers = [];
    for (const u of this.tabs) {
      if (u[i + "Trigger"]) continue;
      const d = function(_) {
        const c = u.tagName === "A";
        if (!c && (_.ctrlKey || _.metaKey || _.button === 1)) return;
        const p = b(u, s.nsKey);
        p && (c && !ie(_) || (s.hashEnabled ? Y(s.nsKey) === p ? s.dom.setAttribute("data-ln-tabs-active", p) : Z(s.nsKey, p) : s.dom.setAttribute("data-ln-tabs-active", p)));
      };
      u.addEventListener("click", d), u[i + "Trigger"] = d, s._clickHandlers.push({ el: u, handler: d });
    }
    if (this._onRequestSelect = function(u) {
      const d = u.detail && (u.detail.key || u.detail.tab);
      d && s.select(d);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!s.hashEnabled) return;
      const u = Y(s.nsKey);
      s.dom.setAttribute("data-ln-tabs-active", u !== null ? u : s.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let u = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const d = Ht("tabs", this.dom);
        d !== null && d in this.mapPanels && (u = d);
      }
      this.dom.setAttribute("data-ln-tabs-active", u);
    }
  }
  y.prototype.select = function(g) {
    const f = (g + "").toLowerCase().trim();
    f && (this.hashEnabled ? Y(this.nsKey) === f ? this.dom.setAttribute("data-ln-tabs-active", f) : Z(this.nsKey, f) : this.dom.setAttribute("data-ln-tabs-active", f));
  }, y.prototype._applyActive = function(g) {
    var s;
    if ((!g || !(g in this.mapPanels)) && (g = this.defaultKey), g === this.activeKey) return;
    const f = this.activeKey;
    if (f !== null && G(this.dom, "ln-tabs:before-change", {
      key: g,
      previousKey: f,
      tab: this.mapTabs[g],
      panel: this.mapPanels[g],
      target: this.dom
    }).defaultPrevented) {
      f in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", f), this.hashEnabled && Y(this.nsKey) !== f && Z(this.nsKey, f));
      return;
    }
    this.activeKey = g;
    for (const u in this.mapTabs) {
      const d = this.mapTabs[u];
      u === g ? (d.setAttribute("data-active", ""), d.setAttribute("aria-selected", "true")) : (d.removeAttribute("data-active"), d.setAttribute("aria-selected", "false"));
    }
    for (const u in this.mapPanels) {
      const d = this.mapPanels[u], _ = u === g;
      d.classList.toggle("hidden", !_), d.setAttribute("aria-hidden", _ ? "false" : "true");
    }
    if (this.autoFocus) {
      const u = (s = this.mapPanels[g]) == null ? void 0 : s.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      u && setTimeout(() => u.focus({ preventScroll: !0 }), 0);
    }
    C(this.dom, "ln-tabs:change", {
      key: g,
      previousKey: f,
      tab: this.mapTabs[g],
      panel: this.mapPanels[g],
      target: this.dom
    }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && gt("tabs", this.dom, g);
  }, y.prototype.destroy = function() {
    if (this.dom[i]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: g, handler: f } of this._clickHandlers)
        g.removeEventListener("click", f), delete g[i + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), C(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[i];
    }
  }, H(o, i, y, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(g) {
      const f = g.getAttribute("data-ln-tabs-active");
      g[i]._applyActive(f);
    }
  });
})();
(function() {
  const o = "data-ln-toggle", i = "lnToggle", b = "data-ln-toggle-for", y = "data-ln-toggle-action", m = "data-ln-persist";
  if (window[i] !== void 0) return;
  const g = /* @__PURE__ */ new Set();
  let f = null;
  function s(h, r) {
    return r === "open" ? "open" : r === "close" || h === "open" ? "close" : "open";
  }
  function u() {
    f || (f = function(h) {
      if (Le(h)) return;
      const r = h.target.closest("[" + b + "]");
      if (!r || Te(r)) return;
      const a = r.getAttribute(b);
      if (!a) return;
      const n = document.getElementById(a);
      if (!n || !n[i]) return;
      h.preventDefault();
      const t = r.getAttribute(y) || "toggle", e = n.getAttribute(o);
      n.setAttribute(o, s(e, t));
    }, document.addEventListener("click", f));
  }
  function d() {
    g.size > 0 || !f || (document.removeEventListener("click", f), f = null);
  }
  function _(h, r) {
    if (!h || !h.id) return;
    const a = document.querySelectorAll(
      "[" + b + '="' + h.id + '"]'
    );
    for (let n = 0; n < a.length; n++)
      a[n].setAttribute("aria-expanded", r ? "true" : "false");
  }
  function c(h) {
    this.dom = h;
    const r = this;
    if (this._onRequestOpen = function() {
      r.open();
    }, this._onRequestClose = function() {
      r.close();
    }, this._onRequestToggle = function() {
      r.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), h.hasAttribute(m)) {
      const a = Ht("toggle", h);
      a !== null && h.setAttribute(o, a === "open" ? "open" : "close");
    }
    return this.isOpen = h.getAttribute(o) === "open", this.isOpen && h.classList.add("open"), _(h, this.isOpen), g.add(this), u(), this;
  }
  c.prototype.open = function() {
    this.dom.setAttribute(o, "open");
  }, c.prototype.close = function() {
    this.dom.setAttribute(o, "close");
  }, c.prototype.toggle = function() {
    const h = this.dom.getAttribute(o);
    this.dom.setAttribute(o, s(h, "toggle"));
  }, c.prototype.destroy = function() {
    this.dom[i] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), g.delete(this), delete this.dom[i], d(), C(this.dom, "ln-toggle:destroyed", { target: this.dom }));
  };
  function p(h) {
    const r = h[i];
    if (!r) return;
    const n = h.getAttribute(o) === "open";
    if (n !== r.isOpen)
      if (n) {
        if (G(h, "ln-toggle:before-open", { target: h }).defaultPrevented) {
          h.setAttribute(o, "close");
          return;
        }
        r.isOpen = !0, h.classList.add("open"), _(h, !0), C(h, "ln-toggle:open", { target: h }), h.hasAttribute(m) && gt("toggle", h, "open");
      } else {
        if (G(h, "ln-toggle:before-close", { target: h }).defaultPrevented) {
          h.setAttribute(o, "open");
          return;
        }
        r.isOpen = !1, h.classList.remove("open"), _(h, !1), C(h, "ln-toggle:close", { target: h }), h.hasAttribute(m) && gt("toggle", h, "close");
      }
  }
  H(o, i, c, "ln-toggle", {
    onAttributeChange: p
  });
})();
(function() {
  const o = "data-ln-accordion", i = "lnAccordion";
  if (window[i] !== void 0) return;
  function b(y) {
    return this.dom = y, this._onToggleOpen = function(m) {
      if (m.detail.target.closest("[data-ln-accordion]") !== y) return;
      const g = y.querySelectorAll("[data-ln-toggle]");
      for (const f of g)
        f !== m.detail.target && f.closest("[data-ln-accordion]") === y && f.getAttribute("data-ln-toggle") === "open" && f.setAttribute("data-ln-toggle", "close");
      C(y, "ln-accordion:change", { target: m.detail.target });
    }, y.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  b.prototype.destroy = function() {
    this.dom[i] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), C(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[i]);
  }, H(o, i, b, "ln-accordion");
})();
(function() {
  const o = "data-ln-dropdown", i = "lnDropdown", b = "data-ln-dropdown-position", y = "data-ln-dropdown-placement", m = "bottom-end";
  if (window[i] !== void 0) return;
  function g(f) {
    this.dom = f, this.toggleEl = f.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = f.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const s = this;
    return this._onRequestOpen = function() {
      s.toggleEl && s.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      s.toggleEl && s.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (s.toggleEl) {
        const u = s.toggleEl.getAttribute("data-ln-toggle");
        s.toggleEl.setAttribute("data-ln-toggle", u === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(u) {
      const d = s.toggleEl && s.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (u.key === "Escape") {
        d && (u.preventDefault(), u.stopPropagation(), s.toggleEl.setAttribute("data-ln-toggle", "close"), s.triggerBtn && s.triggerBtn.focus());
        return;
      }
      if (u.key === "Tab") {
        d && (s.triggerBtn && s.triggerBtn.focus(), s.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const _ = s._getMenuItems();
      if (_.length === 0) return;
      if (!d && (u.key === "ArrowDown" || u.key === "ArrowUp")) {
        u.preventDefault(), s.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const p = s._getMenuItems();
          p.length > 0 && s._focusItem(p, u.key === "ArrowDown" ? 0 : p.length - 1);
        }, 0);
        return;
      }
      if (!d) return;
      const c = _.indexOf(document.activeElement);
      if (u.key === "ArrowDown") {
        u.preventDefault();
        const p = c < _.length - 1 ? c + 1 : 0;
        s._focusItem(_, p);
      } else if (u.key === "ArrowUp") {
        u.preventDefault();
        const p = c > 0 ? c - 1 : _.length - 1;
        s._focusItem(_, p);
      } else u.key === "Home" ? (u.preventDefault(), s._focusItem(_, 0)) : u.key === "End" && (u.preventDefault(), s._focusItem(_, _.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(u) {
      !u.detail || u.detail.target !== s.toggleEl || (s.triggerBtn && s.triggerBtn.setAttribute("aria-expanded", "true"), typeof s.toggleEl.showPopover == "function" && s.toggleEl.showPopover(), s._initMenuAria(), s._reposition(), s._addOutsideClickListener(), s._addScrollRepositionListener(), s._addResizeCloseListener(), C(f, "ln-dropdown:open", { target: u.detail.target }));
    }, this._onToggleClose = function(u) {
      !u.detail || u.detail.target !== s.toggleEl || (s.triggerBtn && s.triggerBtn.setAttribute("aria-expanded", "false"), s._removeOutsideClickListener(), s._removeScrollRepositionListener(), s._removeResizeCloseListener(), s.toggleEl.style.top = "", s.toggleEl.style.left = "", s.toggleEl.removeAttribute(y), typeof s.toggleEl.hidePopover == "function" && s.toggleEl.matches(":popover-open") && s.toggleEl.hidePopover(), C(f, "ln-dropdown:close", { target: u.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  g.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const f = this.toggleEl.querySelectorAll("li");
    for (const u of f)
      u.setAttribute("role", "none");
    const s = this._getMenuItems();
    for (let u = 0; u < s.length; u++)
      s[u].setAttribute("role", "menuitem"), s[u].setAttribute("tabindex", u === 0 ? "0" : "-1");
  }, g.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, g.prototype._focusItem = function(f, s) {
    for (let u = 0; u < f.length; u++)
      f[u].setAttribute("tabindex", u === s ? "0" : "-1");
    f[s] && f[s].focus();
  }, g.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const f = this.triggerBtn.getBoundingClientRect(), s = $t(this.toggleEl), u = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, d = this.dom.getAttribute(b) || m, _ = Ot(f, s, d, u);
    this.toggleEl.style.top = _.top + "px", this.toggleEl.style.left = _.left + "px", this.toggleEl.setAttribute(y, _.placement);
  }, g.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const f = this;
    this._boundDocClick = function(s) {
      f.dom.contains(s.target) || f.toggleEl && f.toggleEl.contains(s.target) || f.toggleEl && f.toggleEl.getAttribute("data-ln-toggle") === "open" && f.toggleEl.setAttribute("data-ln-toggle", "close");
    }, f._docClickTimeout = setTimeout(function() {
      f._docClickTimeout = null, document.addEventListener("click", f._boundDocClick);
    }, 0);
  }, g.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, g.prototype._addScrollRepositionListener = function() {
    const f = this;
    this._boundScrollReposition = function() {
      f._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, g.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, g.prototype._addResizeCloseListener = function() {
    const f = this;
    this._boundResizeClose = function() {
      f.toggleEl && f.toggleEl.getAttribute("data-ln-toggle") === "open" && f.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, g.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, g.prototype.destroy = function() {
    this.dom[i] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute(y), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), C(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[i]);
  }, H(o, i, g, "ln-dropdown");
})();
(function() {
  const o = "data-ln-popover", i = "lnPopover", b = "data-ln-popover-for", y = "data-ln-popover-position";
  if (window[i] !== void 0) return;
  const m = [];
  let g = null;
  function f() {
    g || (g = function(_) {
      if (_.key !== "Escape" || m.length === 0) return;
      m[m.length - 1].close();
    }, document.addEventListener("keydown", g));
  }
  function s() {
    m.length > 0 || g && (document.removeEventListener("keydown", g), g = null);
  }
  function u(_) {
    this.dom = _, this.isOpen = _.getAttribute(o) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const c = this;
    return this._onRequestOpen = function(p) {
      const h = p.detail && p.detail.trigger ? p.detail.trigger : null;
      c.open(h);
    }, this._onRequestClose = function() {
      c.close();
    }, this._onRequestToggle = function(p) {
      const h = p.detail && p.detail.trigger ? p.detail.trigger : null;
      c.toggle(h);
    }, _.addEventListener("ln-popover:request-open", this._onRequestOpen), _.addEventListener("ln-popover:request-close", this._onRequestClose), _.addEventListener("ln-popover:request-toggle", this._onRequestToggle), _.hasAttribute("tabindex") || _.setAttribute("tabindex", "-1"), _.hasAttribute("role") || _.setAttribute("role", "dialog"), _.hasAttribute("popover") || _.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  u.prototype.open = function(_) {
    this.isOpen || (this.trigger = _ || null, this.dom.setAttribute(o, "open"));
  }, u.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(o, "closed");
  }, u.prototype.toggle = function(_) {
    this.isOpen ? this.close() : this.open(_);
  }, u.prototype._applyOpen = function(_) {
    this.isOpen = !0, _ && (this.trigger = _), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const c = $t(this.dom);
    if (this.trigger) {
      const a = this.trigger.getBoundingClientRect(), n = this.dom.getAttribute(y) || "bottom", t = Ot(a, c, n, 8);
      this.dom.style.top = t.top + "px", this.dom.style.left = t.left + "px", this.dom.setAttribute("data-ln-popover-placement", t.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const p = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), h = Array.prototype.find.call(p, Lt);
    h ? h.focus() : this.dom.focus();
    const r = this;
    this._boundDocClick = function(a) {
      r.dom.contains(a.target) || r.trigger && r.trigger.contains(a.target) || r.close();
    }, r._docClickTimeout = setTimeout(function() {
      r._docClickTimeout = null, document.addEventListener("click", r._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!r.trigger) return;
      const a = r.trigger.getBoundingClientRect(), n = $t(r.dom), t = r.dom.getAttribute(y) || "bottom", e = Ot(a, n, t, 8);
      r.dom.style.top = e.top + "px", r.dom.style.left = e.left + "px", r.dom.setAttribute("data-ln-popover-placement", e.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), m.push(this), f(), C(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, u.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const _ = m.indexOf(this);
    _ !== -1 && m.splice(_, 1), s(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, C(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, u.prototype.destroy = function() {
    this.dom[i] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[i], C(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function d(_) {
    this.dom = _;
    const c = _.getAttribute(b);
    return _.setAttribute("aria-haspopup", "dialog"), _.setAttribute("aria-expanded", "false"), _.setAttribute("aria-controls", c), this._onClick = function(p) {
      if (p.ctrlKey || p.metaKey || p.button === 1) return;
      p.preventDefault();
      const h = document.getElementById(c);
      if (!h) return;
      h[i] && (h[i].trigger = _);
      const r = h.getAttribute(o);
      h.setAttribute(o, r === "open" ? "closed" : "open");
    }, _.addEventListener("click", this._onClick), this;
  }
  d.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[i + "Trigger"];
  }, H(o, i, u, "ln-popover", {
    onAttributeChange: function(_) {
      const c = _[i];
      if (!c) return;
      const h = _.getAttribute(o) === "open";
      if (h !== c.isOpen)
        if (h) {
          if (G(_, "ln-popover:before-open", {
            popoverId: _.id,
            target: _,
            trigger: c.trigger
          }).defaultPrevented) {
            _.setAttribute(o, "closed");
            return;
          }
          c._applyOpen(c.trigger);
        } else {
          if (G(_, "ln-popover:before-close", {
            popoverId: _.id,
            target: _,
            trigger: c.trigger
          }).defaultPrevented) {
            _.setAttribute(o, "open");
            return;
          }
          c._applyClose();
        }
    }
  }), H(b, i + "Trigger", d, "ln-popover-trigger");
})();
(function() {
  const o = "data-ln-tooltip-enhance", i = "data-ln-tooltip", b = "data-ln-tooltip-position", y = "lnTooltipEnhance", m = "ln-tooltip-portal";
  if (window[y] !== void 0) return;
  let g = 0, f = null, s = null, u = null, d = null, _ = null, c = null;
  function p() {
    return f && f.parentNode || (f = document.getElementById(m), f || (f = document.createElement("div"), f.id = m, document.body.appendChild(f)), f.hasAttribute("popover") || f.setAttribute("popover", "manual")), f;
  }
  function h() {
    c || (c = function(e) {
      e.key === "Escape" && n();
    }, document.addEventListener("keydown", c));
  }
  function r() {
    c && (document.removeEventListener("keydown", c), c = null);
  }
  function a(e) {
    if (u === e) return;
    n();
    const l = e.getAttribute(i) || e.getAttribute("title");
    if (!l) return;
    p(), typeof f.showPopover == "function" && f.showPopover(), e.hasAttribute("title") && (d = e.getAttribute("title"), e.removeAttribute("title"));
    const v = e.getAttribute("aria-describedby");
    v ? _ = v : _ = null;
    const w = document.createElement("div");
    w.className = "ln-tooltip", w.textContent = l, e[y + "Uid"] || (g += 1, e[y + "Uid"] = "ln-tooltip-" + g), w.id = e[y + "Uid"], f.appendChild(w);
    const E = w.offsetWidth, S = w.offsetHeight, L = e.getBoundingClientRect(), x = e.getAttribute(b) || "top", k = Ot(L, { width: E, height: S }, x, 6);
    w.style.top = k.top + "px", w.style.left = k.left + "px", w.setAttribute("data-ln-tooltip-placement", k.placement), _ ? e.setAttribute("aria-describedby", _ + " " + w.id) : e.setAttribute("aria-describedby", w.id), s = w, u = e, h();
  }
  function n() {
    if (!s) {
      r();
      return;
    }
    u && (_ !== null ? u.setAttribute("aria-describedby", _) : u.removeAttribute("aria-describedby"), _ = null, d !== null && u.setAttribute("title", d)), d = null, s.parentNode && s.parentNode.removeChild(s), s = null, u = null, f && typeof f.hidePopover == "function" && f.matches(":popover-open") && f.hidePopover(), r();
  }
  function t(e) {
    return this.dom = e, e.hasAttribute("data-ln-tooltip-enhanced") || (e.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      a(e);
    }, this._onLeave = function() {
      u === e && !e.contains(document.activeElement) && n();
    }, this._onFocus = function() {
      a(e);
    }, this._onBlur = function() {
      u === e && !e.matches(":hover") && n();
    }, e.addEventListener("mouseenter", this._onEnter), e.addEventListener("mouseleave", this._onLeave), e.addEventListener("focus", this._onFocus, !0), e.addEventListener("blur", this._onBlur, !0), this;
  }
  t.prototype.destroy = function() {
    const e = this.dom;
    e.removeEventListener("mouseenter", this._onEnter), e.removeEventListener("mouseleave", this._onLeave), e.removeEventListener("focus", this._onFocus, !0), e.removeEventListener("blur", this._onBlur, !0), u === e && n(), this._addedEnhancedAttr && e.removeAttribute("data-ln-tooltip-enhanced"), delete e[y], delete e[y + "Uid"], C(e, "ln-tooltip:destroyed", { trigger: e });
  }, H(
    "[" + o + "], [data-ln-tooltip-enhanced], [" + i + "][title]",
    y,
    t,
    "ln-tooltip"
  );
})();
(function() {
  const o = "data-ln-toast", i = "lnToast", b = "ln-toast-item";
  if (window[i] !== void 0) return;
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
  function m(r) {
    if (!r || !(r instanceof HTMLElement)) return;
    if (r.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof r.hidePopover == "function" && r.matches(":popover-open"))
      try {
        r.hidePopover();
      } catch {
      }
  }
  function g(r) {
    this.dom = r, this.timeoutDefault = +(r.getAttribute("data-ln-toast-timeout") ?? 6e3), this.max = +(r.getAttribute("data-ln-toast-max") ?? 5);
    const a = Array.from(r.querySelectorAll("[data-ln-toast-item]"));
    for (; a.length > this.max; ) r.removeChild(a.shift());
    for (const n of a) c(n, this);
    return a.length > 0 && y(r), this;
  }
  g.prototype.enqueue = function(r) {
    if (!r) return;
    const a = f(r, this.dom);
    if (!a) return;
    const n = Number.isFinite(r.timeout) ? r.timeout : this.timeoutDefault;
    u(this, a), n > 0 && (a._timer = setTimeout(() => d(a), n));
  }, g.prototype.clear = function() {
    for (const r of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      d(r);
  }, g.prototype.destroy = function() {
    if (this.dom[i]) {
      for (const r of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        d(r);
      m(this.dom), C(this.dom, "ln-toast:destroyed", { target: this.dom }), delete this.dom[i];
    }
  };
  function f(r, a) {
    const n = ((r.type || "") + "").trim().toLowerCase(), t = ft(a, b, "ln-toast");
    if (!t)
      return console.warn('[ln-toast] Template "' + b + '" not found'), null;
    nt(t, {
      type: n,
      title: r.title,
      message: typeof r.message == "string" ? r.message : void 0
    });
    const e = t.firstElementChild;
    if (!e) return null;
    e.hasAttribute("data-ln-toast-item") || e.setAttribute("data-ln-toast-item", ""), e.classList.add("ln-enter");
    const l = e.querySelector(".body");
    l && s(l, r);
    const v = e.querySelector("[data-ln-toast-close]");
    return v && v.addEventListener("click", function() {
      d(e);
    }), e;
  }
  function s(r, a) {
    if (Array.isArray(a.message)) {
      const n = document.createElement("ul");
      for (const t of a.message) {
        const e = document.createElement("li");
        e.textContent = t, n.appendChild(e);
      }
      r.appendChild(n);
    }
    if (a.data && a.data.errors) {
      const n = document.createElement("ul");
      for (const t of Object.values(a.data.errors).flat()) {
        const e = document.createElement("li");
        e.textContent = t, n.appendChild(e);
      }
      r.appendChild(n);
    }
  }
  function u(r, a) {
    const n = Array.from(r.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; n.length >= r.max && n.length > 0; ) r.dom.removeChild(n.shift());
    r.dom.appendChild(a), y(r.dom), requestAnimationFrame(() => a.classList.remove("ln-enter"));
  }
  function d(r) {
    if (!r || !r.parentNode) return;
    const a = r.parentNode;
    clearTimeout(r._timer), r.classList.remove("ln-enter"), r.classList.add("ln-out"), setTimeout(() => {
      r.parentNode && (r.parentNode.removeChild(r), m(a));
    }, 200);
  }
  function _(r) {
    let a = r && r.container;
    return typeof a == "string" && (a = document.querySelector(a)), a instanceof HTMLElement || (a = document.querySelector("[" + o + "]") || document.getElementById("ln-toast-container")), a || null;
  }
  function c(r, a) {
    if (r._lnToastHydrated) return;
    r._lnToastHydrated = !0;
    const n = r.querySelector("[data-ln-toast-close]");
    n && n.addEventListener("click", function() {
      d(r);
    });
    const t = +(r.getAttribute("data-ln-toast-timeout") ?? a.timeoutDefault);
    t > 0 && (r._timer = setTimeout(function() {
      d(r);
    }, t));
  }
  function p(r) {
    const a = r.detail || {}, n = _(a);
    if (!n) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (n[i] || (n[i] = new g(n))).enqueue(a);
  }
  function h(r) {
    const a = r && r.detail || {};
    if (a.container) {
      const n = _(a);
      n && (n[i] || (n[i] = new g(n))).clear();
    } else {
      const n = document.querySelectorAll("[" + o + "]");
      for (const t of Array.from(n))
        (t[i] || (t[i] = new g(t))).clear();
    }
  }
  lt(function() {
    window.addEventListener("ln-toast:enqueue", p), window.addEventListener("ln-toast:clear", h), window.addEventListener("ln-modal:open", function() {
      const r = document.querySelectorAll("[" + o + "]");
      for (const a of Array.from(r))
        a.querySelectorAll("[data-ln-toast-item]").length > 0 && y(a);
    });
  }, "ln-toast"), H(o, i, g, "ln-toast");
})();
(function() {
  const o = "data-ln-upload", i = "lnUpload", b = "data-ln-upload-dict", y = "data-ln-upload-accept", m = "data-ln-upload-delete", g = "data-ln-upload-max-size", f = "data-ln-upload-max-files", s = "data-ln-upload-file-field", u = "data-ln-upload-ids-field", d = "file", _ = "file_ids[]";
  if (window[i] !== void 0) return;
  function c(t) {
    return t ? t.split(",").map(function(e) {
      return e.trim().toLowerCase();
    }).filter(Boolean).map(function(e) {
      return e.startsWith(".") ? e.slice(1) : e;
    }) : null;
  }
  function p(t) {
    return !t || !t.includes(".") ? "" : t.split(".").pop().toLowerCase();
  }
  function h(t, e) {
    if (!e || e.length === 0) return !0;
    const l = p(t.name), v = (t.type || "").toLowerCase();
    return e.some(function(w) {
      if (w.includes("/")) {
        if (w.endsWith("/*")) {
          const E = w.slice(0, -1);
          return v.startsWith(E);
        }
        return v === w;
      }
      return l === w;
    });
  }
  function r(t, e, l) {
    if (typeof t != "number" || isNaN(t) || t === 0)
      return "0 " + (l["unit-b"] || "B");
    const v = 1024, w = [
      l["unit-b"] || "B",
      l["unit-kb"] || "KB",
      l["unit-mb"] || "MB",
      l["unit-gb"] || "GB"
    ], E = Math.floor(Math.log(t) / Math.log(v)), S = Math.min(E, w.length - 1), L = t / Math.pow(v, S);
    return new Intl.NumberFormat(e, {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0
    }).format(L) + " " + w[S];
  }
  function a() {
    const t = document.querySelector('meta[name="csrf-token"]');
    return t ? t.getAttribute("content") : "";
  }
  function n(t) {
    this.dom = t, this.dict = Nt(t, b), this.locale = Q(t), this.zone = t.querySelector("[data-ln-upload-zone]") || t, this.list = t.querySelector("[data-ln-upload-list]"), this.input = t.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', t), this.uploadUrl = t.getAttribute(o) || "", this.deleteUrlPattern = t.getAttribute(m) || "", this.fileFieldName = t.getAttribute(s) || d, this.idsFieldName = t.getAttribute(u) || _, this.maxSize = +t.getAttribute(g) || 0, this.maxFiles = +t.getAttribute(f) || 0;
    const e = t.getAttribute(y) || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = c(e), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  n.prototype._hydrate = function() {
    const t = this;
    if (!this.list) return;
    const e = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let v = 0; v < e.length; v++) {
      const w = e[v], E = w.getAttribute("data-ln-upload-id"), S = "file-" + ++t.fileIdCounter;
      w.setAttribute("data-ln-upload-local-id", S);
      const L = w.querySelector('[data-ln-field="name"]'), x = w.querySelector('[data-ln-field="sizeText"]'), k = w.getAttribute("data-ln-upload-size"), q = k ? parseInt(k, 10) : null;
      t.uploadedFiles.set(S, {
        serverId: E || null,
        name: L ? L.textContent.trim() : "",
        size: q !== null && !isNaN(q) ? q : x ? x.textContent.trim() : ""
      });
    }
    const l = this.dom.querySelectorAll('input[type="hidden"]');
    for (let v = 0; v < l.length; v++) {
      const w = l[v];
      if (w.name === t.idsFieldName && w.value && !Array.from(t.uploadedFiles.values()).some(function(S) {
        return String(S.serverId) === String(w.value);
      })) {
        const S = "file-" + ++t.fileIdCounter;
        t.uploadedFiles.set(S, {
          serverId: w.value,
          name: "",
          size: ""
        });
      }
    }
    this._syncHiddenInputs();
  }, n.prototype._syncHiddenInputs = function() {
    const t = this, e = this.dom.querySelectorAll('input[type="hidden"]');
    for (let l = 0; l < e.length; l++)
      e[l].name === t.idsFieldName && e[l].remove();
    for (const [, l] of this.uploadedFiles)
      if (l.serverId) {
        const v = document.createElement("input");
        v.type = "hidden", v.name = t.idsFieldName, v.value = l.serverId, t.dom.appendChild(v);
      }
  }, n.prototype._bindEvents = function() {
    const t = this;
    this._onZoneClick = function(e) {
      t.zone === t.dom && e.target.closest("[data-ln-upload-list], [data-ln-upload-action], input, button, a") || t.input && e.target !== t.input && t.input.click();
    }, this._onInputChange = function() {
      t.input && t.input.files && (t.upload(t.input.files), t.input.value = "");
    }, this._onDragEnter = function(e) {
      e.preventDefault(), e.stopPropagation(), t._dragDepth++, t.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragOver = function(e) {
      e.preventDefault(), e.stopPropagation(), t.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragLeave = function(e) {
      e.preventDefault(), e.stopPropagation(), t._dragDepth--, t._dragDepth <= 0 && (t._dragDepth = 0, t.zone.removeAttribute("data-ln-upload-state"));
    }, this._onDrop = function(e) {
      e.preventDefault(), e.stopPropagation(), t._dragDepth = 0, t.zone.removeAttribute("data-ln-upload-state"), e.dataTransfer && e.dataTransfer.files && t.upload(e.dataTransfer.files);
    }, this._onListClick = function(e) {
      const l = e.target.closest('[data-ln-upload-action="remove"]');
      if (!l || !t.list || !t.list.contains(l) || l.disabled) return;
      const v = l.closest("[data-ln-upload-item]");
      if (v) {
        const w = v.getAttribute("data-ln-upload-local-id");
        w && t.remove(w);
      }
    }, this._onRequestUpload = function(e) {
      e.detail && e.detail.files && t.upload(e.detail.files);
    }, this._onRequestRemove = function(e) {
      if (e.detail) {
        const l = e.detail.localId !== void 0 ? e.detail.localId : e.detail.serverId;
        l !== void 0 && t.remove(l);
      }
    }, this._onRequestClear = function() {
      t.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, n.prototype.upload = function(t) {
    const e = this, l = Array.from(t);
    for (let v = 0; v < l.length; v++) {
      const w = l[v];
      if (e.maxFiles > 0 && e.uploadedFiles.size >= e.maxFiles) {
        C(e.dom, "ln-upload:invalid", {
          file: w,
          reason: "max-files"
        });
        continue;
      }
      if (!h(w, e.allowedExts)) {
        C(e.dom, "ln-upload:invalid", {
          file: w,
          reason: "accept"
        });
        continue;
      }
      if (e.maxSize > 0 && w.size > e.maxSize) {
        C(e.dom, "ln-upload:invalid", {
          file: w,
          reason: "max-size"
        });
        continue;
      }
      G(e.dom, "ln-upload:before-upload", { file: w }).defaultPrevented || e._uploadSingleFile(w);
    }
  }, n.prototype._uploadSingleFile = function(t) {
    const e = this, l = "file-" + ++e.fileIdCounter, v = p(t.name);
    let w = null;
    if (this.list) {
      const k = ft(this.dom, "ln-upload-item", "ln-upload");
      if (k && (w = k.firstElementChild, w)) {
        w.setAttribute("data-ln-upload-item", ""), w.setAttribute("data-ln-upload-local-id", l), w.setAttribute("data-ln-upload-ext", v), w.setAttribute("data-ln-upload-state", "uploading"), nt(w, {
          name: t.name,
          sizeText: "0%",
          removeLabel: e.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const q = w.querySelector('[data-ln-upload-action="remove"]');
        q && (q.disabled = !0);
        const O = w.querySelector("[data-ln-progress]");
        O && O.setAttribute("data-ln-progress", "0"), e.list.appendChild(w);
      }
    }
    const E = new FormData();
    E.append(e.fileFieldName, t);
    const S = this.dom.querySelectorAll("input, select, textarea");
    for (let k = 0; k < S.length; k++) {
      const q = S[k];
      !q.name || q.name === e.idsFieldName || q.type === "file" || (q.type === "checkbox" || q.type === "radio") && !q.checked || E.append(q.name, q.value);
    }
    const L = new XMLHttpRequest();
    e.uploadedFiles.set(l, {
      serverId: null,
      name: t.name,
      size: t.size,
      xhr: L
    }), L.upload.addEventListener("progress", function(k) {
      if (k.lengthComputable) {
        const q = Math.round(k.loaded / k.total * 100);
        if (w) {
          const O = w.querySelector("[data-ln-progress]");
          O && O.setAttribute("data-ln-progress", String(q)), nt(w, { sizeText: q + "%" });
        }
        C(e.dom, "ln-upload:progress", {
          localId: l,
          file: t,
          percent: q,
          loaded: k.loaded,
          total: k.total
        });
      }
    }), L.addEventListener("load", function() {
      const k = e.uploadedFiles.get(l);
      if (k && delete k.xhr, L.status >= 200 && L.status < 300) {
        let q;
        try {
          q = JSON.parse(L.responseText);
        } catch (F) {
          x(e.dict.error || "Error", L.status, F);
          return;
        }
        const O = q.id || q.serverId;
        if (w) {
          w.removeAttribute("data-ln-upload-state"), O && w.setAttribute("data-ln-upload-id", String(O)), nt(w, {
            sizeText: r(q.size || t.size, e.locale, e.dict),
            uploading: !1
          });
          const F = w.querySelector('[data-ln-upload-action="remove"]');
          F && (F.disabled = !1);
        }
        k && (k.serverId = O, k.size = q.size || t.size, k.name = q.name || t.name), e._syncHiddenInputs(), C(e.dom, "ln-upload:uploaded", {
          localId: l,
          serverId: O,
          name: q.name || t.name,
          size: q.size || t.size,
          response: q
        });
      } else {
        let q = "";
        try {
          q = JSON.parse(L.responseText).message || "";
        } catch {
        }
        x(q, L.status, null);
      }
    }), L.addEventListener("error", function() {
      const k = e.uploadedFiles.get(l);
      k && delete k.xhr, x("", 0, null);
    });
    function x(k, q, O) {
      if (w) {
        w.setAttribute("data-ln-upload-state", "error"), nt(w, {
          sizeText: e.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const F = w.querySelector('[data-ln-upload-action="remove"]');
        F && (F.disabled = !1);
      }
      C(e.dom, "ln-upload:error", {
        file: t,
        message: k,
        status: q,
        error: O
      });
    }
    e.uploadUrl ? (L.open("POST", e.uploadUrl), L.setRequestHeader("X-CSRF-TOKEN", a()), L.setRequestHeader("X-Requested-With", "XMLHttpRequest"), L.setRequestHeader("Accept", "application/json"), L.send(E)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, n.prototype.remove = function(t) {
    const e = this;
    let l = null, v = null;
    if (e.uploadedFiles.has(t))
      l = t, v = e.uploadedFiles.get(t);
    else
      for (const [L, x] of e.uploadedFiles)
        if (String(x.serverId) === String(t)) {
          l = L, v = x;
          break;
        }
    if (!l || !v || G(e.dom, "ln-upload:before-remove", {
      localId: l,
      serverId: v.serverId
    }).defaultPrevented) return;
    const E = e.list ? e.list.querySelector('[data-ln-upload-local-id="' + l + '"]') : null;
    if (v.xhr && typeof v.xhr.abort == "function" && v.xhr.abort(), !v.serverId) {
      E && E.remove(), e.uploadedFiles.delete(l), e._syncHiddenInputs(), C(e.dom, "ln-upload:removed", { localId: l, serverId: null });
      return;
    }
    let S = null;
    if (e.deleteUrlPattern ? S = e.deleteUrlPattern.replace("{id}", encodeURIComponent(v.serverId)) : e.uploadUrl && e.uploadUrl.includes("{id}") && (S = e.uploadUrl.replace("{id}", encodeURIComponent(v.serverId))), !S) {
      E && E.remove(), e.uploadedFiles.delete(l), e._syncHiddenInputs(), C(e.dom, "ln-upload:removed", { localId: l, serverId: v.serverId });
      return;
    }
    E && (E.setAttribute("data-ln-upload-state", "deleting"), nt(E, { deleting: !0 })), fetch(S, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": a(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(L) {
      L.ok ? (E && E.remove(), e.uploadedFiles.delete(l), e._syncHiddenInputs(), C(e.dom, "ln-upload:removed", {
        localId: l,
        serverId: v.serverId
      })) : (E && (E.removeAttribute("data-ln-upload-state"), nt(E, { deleting: !1 })), C(e.dom, "ln-upload:error", {
        file: v,
        message: "",
        status: L.status
      }));
    }).catch(function(L) {
      E && (E.removeAttribute("data-ln-upload-state"), nt(E, { deleting: !1 })), C(e.dom, "ln-upload:error", {
        file: v,
        message: "",
        status: 0,
        error: L
      });
    });
  }, n.prototype.clear = function() {
    const t = this;
    if (!G(t.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, l] of this.uploadedFiles)
        if (l.xhr && typeof l.xhr.abort == "function" && l.xhr.abort(), l.serverId) {
          let v = null;
          t.deleteUrlPattern ? v = t.deleteUrlPattern.replace("{id}", encodeURIComponent(l.serverId)) : t.uploadUrl && t.uploadUrl.includes("{id}") && (v = t.uploadUrl.replace("{id}", encodeURIComponent(l.serverId))), v && fetch(v, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": a(),
              "X-Requested-With": "XMLHttpRequest",
              Accept: "application/json"
            }
          }).catch(function() {
          });
        }
      t.uploadedFiles.clear(), t.list && (t.list.innerHTML = ""), t._syncHiddenInputs(), C(t.dom, "ln-upload:cleared", {});
    }
  }, n.prototype.getFileIds = function() {
    return Array.from(this.uploadedFiles.values()).map(function(t) {
      return t.serverId;
    }).filter(Boolean);
  }, n.prototype.getFiles = function() {
    return Array.from(this.uploadedFiles.values()).map(function(t) {
      return {
        serverId: t.serverId,
        name: t.name,
        size: t.size
      };
    });
  }, n.prototype.destroy = function() {
    if (this.dom[i]) {
      for (const [, t] of this.uploadedFiles)
        t.xhr && typeof t.xhr.abort == "function" && t.xhr.abort();
      this.zone.removeEventListener("click", this._onZoneClick), this.input && this.input.removeEventListener("change", this._onInputChange), this.zone.removeEventListener("dragenter", this._onDragEnter), this.zone.removeEventListener("dragover", this._onDragOver), this.zone.removeEventListener("dragleave", this._onDragLeave), this.zone.removeEventListener("drop", this._onDrop), this.list && this.list.removeEventListener("click", this._onListClick), this.dom.removeEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.removeEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.removeEventListener("ln-upload:request-clear", this._onRequestClear), this.uploadedFiles.clear(), this.dict = {}, C(this.dom, "ln-upload:destroyed", { target: this.dom }), delete this.dom[i];
    }
  }, H(o, i, n, "ln-upload");
})();
(function() {
  const o = "lnExternalLinks";
  if (window[o] !== void 0) return;
  function i(s) {
    return s.hostname && s.hostname !== window.location.hostname;
  }
  function b(s) {
    if (s.getAttribute("data-ln-external-link") === "processed" || !i(s)) return;
    s.target = "_blank";
    const u = (s.rel || "").split(/\s+/).filter(Boolean);
    u.includes("noopener") || u.push("noopener"), u.includes("noreferrer") || u.push("noreferrer"), s.rel = u.join(" ");
    const d = document.createElement("span");
    d.className = "sr-only", d.textContent = "(opens in new tab)", s.appendChild(d), s.setAttribute("data-ln-external-link", "processed"), C(s, "ln-external-links:processed", {
      link: s,
      href: s.href
    });
  }
  function y(s) {
    s = s || document.body;
    for (const u of s.querySelectorAll("a, area"))
      b(u);
  }
  function m() {
    lt(function() {
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
  function g() {
    lt(function() {
      new MutationObserver(function(u) {
        for (const d of u) {
          if (d.type === "childList") {
            for (const _ of d.addedNodes)
              if (_.nodeType === 1 && (_.matches && (_.matches("a") || _.matches("area")) && b(_), _.querySelectorAll))
                for (const c of _.querySelectorAll("a, area"))
                  b(c);
          }
          if (d.type === "attributes" && d.attributeName === "href") {
            const _ = d.target;
            _.matches && (_.matches("a") || _.matches("area")) && b(_);
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
    m(), g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      y();
    }) : y();
  }
  window[o] = {
    process: y
  }, f();
})();
(function() {
  const o = "data-ln-link", i = "lnLink";
  if (window[i] !== void 0) return;
  let b = null;
  function y() {
    b = document.createElement("div"), b.className = "ln-link-status", document.body.appendChild(b);
  }
  function m(t) {
    b && (b.textContent = t, b.classList.add("ln-link-status--visible"));
  }
  function g() {
    b && b.classList.remove("ln-link-status--visible");
  }
  function f(t, e) {
    if (e.target.closest("a, button, input, select, textarea")) return;
    const l = t.querySelector("a");
    if (!l) return;
    const v = l.getAttribute("href");
    if (!v) return;
    if (e.ctrlKey || e.metaKey || e.button === 1) {
      window.open(v, "_blank");
      return;
    }
    G(t, "ln-link:navigate", { target: t, href: v, link: l }).defaultPrevented || l.click();
  }
  function s(t) {
    const e = t.querySelector("a");
    if (!e) return;
    const l = e.getAttribute("href");
    l && m(l);
  }
  function u() {
    g();
  }
  function d(t) {
    t[i + "Row"] || !t.querySelector("a") || (t[i + "Row"] = !0, t._lnLinkClick = function(l) {
      f(t, l);
    }, t._lnLinkEnter = function() {
      s(t);
    }, t.addEventListener("click", t._lnLinkClick), t.addEventListener("mouseenter", t._lnLinkEnter), t.addEventListener("mouseleave", u));
  }
  function _(t) {
    t[i + "Row"] && (t._lnLinkClick && t.removeEventListener("click", t._lnLinkClick), t._lnLinkEnter && t.removeEventListener("mouseenter", t._lnLinkEnter), t.removeEventListener("mouseleave", u), delete t._lnLinkClick, delete t._lnLinkEnter, delete t[i + "Row"]);
  }
  function c(t) {
    if (!t[i + "Init"]) return;
    const e = t.tagName;
    if (e === "TABLE" || e === "TBODY") {
      const l = e === "TABLE" && t.querySelector("tbody") || t;
      for (const v of l.querySelectorAll("tr"))
        _(v);
    } else
      _(t);
    delete t[i + "Init"];
  }
  function p(t) {
    if (t[i + "Init"]) return;
    t[i + "Init"] = !0;
    const e = t.tagName;
    if (e === "TABLE" || e === "TBODY") {
      const l = e === "TABLE" && t.querySelector("tbody") || t;
      for (const v of l.querySelectorAll("tr"))
        d(v);
    } else
      d(t);
  }
  function h(t) {
    t.hasAttribute && t.hasAttribute(o) && p(t);
    const e = t.querySelectorAll ? t.querySelectorAll("[" + o + "]") : [];
    for (const l of e)
      p(l);
  }
  function r() {
    lt(function() {
      new MutationObserver(function(e) {
        for (const l of e)
          if (l.type === "childList") {
            for (const v of l.addedNodes)
              if (v.nodeType === 1) {
                h(v);
                const w = v.closest("[" + o + "]");
                if (w)
                  if (v.tagName === "TR")
                    d(v);
                  else {
                    const E = w.tagName;
                    if (E === "TABLE" || E === "TBODY") {
                      const S = v.querySelectorAll ? v.querySelectorAll("tr") : [];
                      for (const L of S)
                        d(L);
                    }
                  }
              }
          } else l.type === "attributes" && (l.target.hasAttribute && l.target.hasAttribute(o) ? h(l.target) : c(l.target));
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [o]
      });
    }, "ln-link");
  }
  function a(t) {
    h(t);
  }
  window[i] = { init: a, destroy: c };
  function n() {
    y(), r(), a(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
const Ct = ["Ctrl", "Alt", "Shift", "Meta"], Nn = {
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
function Ye(o) {
  if (o === " ") return "Space";
  const i = String(o || "").trim();
  if (!i) return "";
  const b = Nn[i.toLowerCase()];
  return b || (i.length === 1 || /^f\d{1,2}$/i.test(i) ? i.toUpperCase() : i.charAt(0).toUpperCase() + i.slice(1));
}
function Xe(o) {
  const i = String(o || "").replace(/\s*\+\s*/g, "+").trim();
  if (!i) return "";
  const b = i.split("+"), y = /* @__PURE__ */ new Set();
  let m = "";
  for (let f = 0; f < b.length; f++) {
    const s = Ye(b[f]);
    if (!s) return "";
    if (Ct.indexOf(s) !== -1) {
      y.add(s);
      continue;
    }
    if (m) return "";
    m = s;
  }
  if (!m) return "";
  const g = [];
  for (let f = 0; f < Ct.length; f++)
    y.has(Ct[f]) && g.push(Ct[f]);
  return g.push(m), g.join("+");
}
function Pn(o) {
  const i = String(o || "").replace(/\s*\+\s*/g, "+").trim();
  if (!i) return [];
  const b = i.split(/[\s,]+/), y = [];
  for (let m = 0; m < b.length; m++) {
    const g = Xe(b[m]);
    g && y.indexOf(g) === -1 && y.push(g);
  }
  return y;
}
function Hn(o, i) {
  const b = String(i || "").trim();
  if (!b || /[\s,]/.test(b)) return "";
  const y = String(o || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(y) ? "" : Xe(y ? y + "+" + b : b);
}
function Bn(o) {
  if (!o) return "";
  const i = Ye(o.key);
  if (!i || Ct.indexOf(i) !== -1) return "";
  const b = [];
  return o.ctrlKey && b.push("Ctrl"), o.altKey && b.push("Alt"), o.shiftKey && b.push("Shift"), o.metaKey && b.push("Meta"), b.push(i), b.join("+");
}
function Un(o) {
  if (!o || !o.tagName) return null;
  const i = String(o.tagName).toLowerCase();
  if (i === "button" || i === "a" && o.hasAttribute && o.hasAttribute("href")) return "click";
  if (i === "input" || i === "textarea" || i === "select" || o.isContentEditable) return "focus";
  if (o.hasAttribute && o.hasAttribute("contenteditable")) {
    const b = o.getAttribute("contenteditable");
    if (b === "" || String(b).toLowerCase() !== "false") return "focus";
  }
  return null;
}
function zn(o, i, b, y) {
  if (!o || !i || b !== "click" || o.target !== i || o.ctrlKey || o.altKey || o.shiftKey || o.metaKey) return !1;
  const m = String(i.tagName || "").toLowerCase();
  return m === "button" ? y === "Enter" || y === "Space" : m === "a" && i.hasAttribute && i.hasAttribute("href") && y === "Enter";
}
(function() {
  const o = "data-ln-key", i = "lnKey", b = "data-ln-key-target", y = "data-ln-key-allow-input", m = "data-ln-key-modifier", g = "data-ln-key-for", f = "lnKeyFor";
  if (window[i] !== void 0) return;
  const s = /* @__PURE__ */ new Set();
  let u = null;
  function d() {
    u || (u = function(r) {
      if (r.defaultPrevented || r.isComposing || r.repeat) return;
      const a = Bn(r);
      if (!a) return;
      const n = fn(r.target), t = document.querySelectorAll("[" + o + "], [" + g + "]");
      let e = null, l = !1, v = !1;
      for (let S = 0; S < t.length; S++) {
        const L = t[S], x = L[i] || L[f];
        if (!x || !x.matches(a) || n && !x.allowsInput()) continue;
        const k = x.resolveTarget(), q = Un(k);
        if (!(!q || !pn(k, q))) {
          if (zn(r, k, q, a)) {
            v = !0;
            continue;
          }
          e ? l = !0 : e = { host: L, target: k, action: q };
        }
      }
      if (v || !e) return;
      l && console.warn('[ln-key] Duplicate active shortcut "' + a + '"; first DOM match wins.');
      const w = {
        source: e.host,
        target: e.target,
        action: e.action,
        key: a,
        event: r
      };
      G(e.host, "ln-key:before-trigger", w).defaultPrevented || (r.preventDefault(), e.target[e.action](), C(e.host, "ln-key:trigger", w));
    }, document.addEventListener("keydown", u));
  }
  function _() {
    s.size > 0 || !u || (document.removeEventListener("keydown", u), u = null);
  }
  function c(r) {
    return this.dom = r, this.shortcuts = [], s.add(this), this.sync(), d(), this;
  }
  c.prototype.sync = function() {
    this.shortcuts = Pn(this.dom.getAttribute(o));
  }, c.prototype.matches = function(r) {
    return this.shortcuts.indexOf(r) !== -1;
  }, c.prototype.allowsInput = function() {
    return this.dom.hasAttribute(y);
  }, c.prototype.resolveTarget = function() {
    const r = this.dom.getAttribute(b);
    return r ? h(r, b) : this.dom;
  }, c.prototype.destroy = function() {
    this.dom[i] && (s.delete(this), delete this.dom[i], _(), C(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function p(r) {
    return this.dom = r, s.add(this), d(), this;
  }
  p.prototype._modifierContext = function() {
    return this.dom.closest("[" + m + "]");
  }, p.prototype.shortcut = function() {
    const r = this._modifierContext(), a = r ? r.getAttribute(m) : "";
    return Hn(a, this.dom.textContent);
  }, p.prototype.matches = function(r) {
    return this.shortcut() === r;
  }, p.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(y)) return !0;
    const r = this._modifierContext();
    return !!(r && r.hasAttribute(y));
  }, p.prototype.resolveTarget = function() {
    return h(this.dom.getAttribute(g), g);
  }, p.prototype.destroy = function() {
    this.dom[f] && (s.delete(this), delete this.dom[f], _(), C(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function h(r, a) {
    if (!r) return null;
    try {
      const n = document.querySelector(r);
      return n || console.warn("[ln-key] Target not found for " + a + ' selector "' + r + '".'), n;
    } catch {
      return console.warn("[ln-key] Invalid " + a + ' selector "' + r + '".'), null;
    }
  }
  H(o, i, c, "ln-key", {
    extraAttributes: [b, y],
    onAttributeChange: function(r) {
      const a = r[i];
      if (a) {
        if (!r.hasAttribute(o)) {
          a.destroy();
          return;
        }
        a.sync();
      }
    }
  }), H(g, f, p, "ln-key-for", {
    onAttributeChange: function(r) {
      const a = r[f];
      a && !r.hasAttribute(g) && a.destroy();
    }
  });
})();
(function() {
  const o = "[data-ln-progress]", i = "lnProgress";
  if (window[i] !== void 0) return;
  function b(g) {
    return this.dom = g, this._parentObserver = null, m.call(this), y.call(this), this;
  }
  b.prototype.destroy = function() {
    this.dom[i] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[i]);
  };
  function y() {
    const g = this, f = this.dom.parentElement;
    if (!f) return;
    const s = new MutationObserver(function(u) {
      for (const d of u)
        d.attributeName === "data-ln-progress-max" && m.call(g);
    });
    s.observe(f, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = s;
  }
  function m() {
    const g = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, f = this.dom.parentElement, u = (f && f.hasAttribute("data-ln-progress-max") ? parseFloat(f.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let d = u > 0 ? g / u * 100 : 0;
    d < 0 && (d = 0), d > 100 && (d = 100), this.dom.style.width = d + "%";
    const _ = Math.max(0, Math.min(g, u));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(u)), this.dom.setAttribute("aria-valuenow", String(_)), C(this.dom, "ln-progress:change", { target: this.dom, value: g, max: u, percentage: d });
  }
  H(
    o,
    i,
    b,
    "ln-progress",
    {
      extraAttributes: ["data-ln-progress-max"],
      onAttributeChange: function(g) {
        const f = g[i];
        f && m.call(f);
      }
    }
  );
})();
function Kn(o, i) {
  if (!Array.isArray(o) || !Array.isArray(i)) return o !== i;
  if (o.length !== i.length) return !0;
  for (let b = 0; b < o.length; b++)
    if (o[b] !== i[b]) return !0;
  return !1;
}
function Je(o, i) {
  if (!i || i.length === 0) return !0;
  if (o == null) return !1;
  const b = String(o).trim().toLowerCase();
  for (let y = 0; y < i.length; y++)
    if (String(i[y]).trim().toLowerCase() === b)
      return !0;
  return !1;
}
function jn(o, i) {
  if (!i || typeof i != "object") return !0;
  const b = Object.keys(i);
  if (b.length === 0) return !0;
  for (let y = 0; y < b.length; y++) {
    const m = i[b[y]], g = o[m.col] || "";
    if (!Je(g, m.values))
      return !1;
  }
  return !0;
}
function Vn(o) {
  if (!Array.isArray(o)) return { key: null, values: [] };
  let i = null;
  const b = [];
  for (let y = 0; y < o.length; y++) {
    const m = o[y];
    !i && m.key && (i = m.key), m.checked && !m.isReset && m.value && b.push(m.value);
  }
  return { key: i, values: b };
}
(function() {
  const o = "data-ln-filter", i = "lnFilter", b = "data-ln-filter-key", y = "data-ln-filter-value", m = "data-ln-filter-hide", g = "data-ln-filter-reset", f = "data-ln-filter-col", s = "data-ln-hash", u = /* @__PURE__ */ new WeakMap();
  if (window[i] !== void 0) return;
  function d(r) {
    return r.hasAttribute(g) || !r.getAttribute(y);
  }
  function _(r) {
    const a = r.dom.querySelectorAll("[" + b + "]"), n = [];
    for (let e = 0; e < a.length; e++) {
      const l = a[e];
      n.push({
        key: l.getAttribute(b),
        value: l.getAttribute(y) || "",
        checked: l.checked,
        isReset: d(l)
      });
    }
    const t = Vn(n);
    return { key: t.key, values: t.values, targetId: r.targetId };
  }
  function c(r, a, n) {
    const t = r.querySelectorAll("[" + b + "]"), e = Array.isArray(n) && n.length > 0;
    for (let l = 0; l < t.length; l++) {
      const v = t[l];
      d(v) ? v.checked = !e : e && v.getAttribute(b) === a && n.indexOf(v.getAttribute(y)) !== -1 ? v.checked = !0 : v.checked = !1;
    }
  }
  function p(r) {
    this.dom = r, this.targetId = r.getAttribute(o);
    const a = r.getAttribute(f);
    this.colIndex = a !== null ? parseInt(a, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = _t(r, "filter"), this.hashEnabled = !!this.nsKey;
    const n = this, t = ne(function() {
      n._render();
    });
    this._queueRender = t, this._attachHandlers(), this._onHashChange = function() {
      if (n._destroyed || !n.hashEnabled) return;
      const l = Y(n.nsKey), v = Qt(l);
      v && v.key && v.values.length > 0 ? c(n.dom, v.key, v.values) : c(n.dom, null, []), n._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let e = !1;
    if (this.hashEnabled) {
      const l = Y(this.nsKey), v = Qt(l);
      v && v.key && v.values.length > 0 && (c(r, v.key, v.values), it(function() {
        n._destroyed || n._render();
      }), e = !0);
    }
    if (!e && r.hasAttribute("data-ln-persist")) {
      const l = Ht("filter", r);
      l && l.key && Array.isArray(l.values) && l.values.length > 0 && (c(r, l.key, l.values), it(function() {
        n._destroyed || n._render();
      }), e = !0);
    }
    if (!e) {
      const l = r.querySelectorAll("[" + b + "]");
      for (let v = 0; v < l.length; v++)
        if (l[v].checked && !d(l[v])) {
          it(function() {
            n._destroyed || n._render();
          });
          break;
        }
    }
    return this;
  }
  p.prototype._attachHandlers = function() {
    const r = this;
    this._onDomChange = function(a) {
      const n = a.target;
      if (!n || !n.hasAttribute || !n.hasAttribute(b)) return;
      const t = Array.from(r.dom.querySelectorAll("[" + b + "]"));
      if (d(n)) {
        for (let e = 0; e < t.length; e++)
          d(t[e]) || (t[e].checked = !1);
        n.checked = !0, r._queueRender();
        return;
      }
      if (n.checked) {
        for (let l = 0; l < t.length; l++)
          d(t[l]) && (t[l].checked = !1);
        let e = !1;
        for (let l = 0; l < t.length; l++)
          if (d(t[l])) {
            e = !0;
            break;
          }
        if (e) {
          let l = !0;
          for (let v = 0; v < t.length; v++)
            if (!d(t[v]) && !t[v].checked) {
              l = !1;
              break;
            }
          if (l)
            for (let v = 0; v < t.length; v++)
              d(t[v]) ? t[v].checked = !0 : t[v].checked = !1;
        }
      } else {
        let e = !1;
        for (let l = 0; l < t.length; l++)
          if (!d(t[l]) && t[l].checked) {
            e = !0;
            break;
          }
        if (!e)
          for (let l = 0; l < t.length; l++)
            d(t[l]) && (t[l].checked = !0);
      }
      r._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, p.prototype._render = function() {
    const r = this, a = _(this), n = this._lastSnapshot;
    if (!(!n || n.key !== a.key || Kn(n.values, a.values))) return;
    const e = a.key === null || a.values.length === 0, l = document.getElementById(r.targetId), v = {
      key: a.key,
      values: a.values.slice(),
      targetId: r.targetId
    };
    C(r.dom, "ln-filter:change", v);
    let w = !1;
    l && l !== r.dom && G(l, "ln-filter:change", v).defaultPrevented && (w = !0);
    const E = n && n.values.length > 0, S = a.values.length === 0;
    if (E && S) {
      const L = { targetId: r.targetId };
      C(r.dom, "ln-filter:reset", L), l && l !== r.dom && C(l, "ln-filter:reset", L);
    }
    if (this._lastSnapshot = { key: a.key, values: a.values.slice() }, this.dom.hasAttribute("data-ln-persist") && (a.key && a.values.length > 0 ? gt("filter", this.dom, { key: a.key, values: a.values.slice() }) : gt("filter", this.dom, null)), this.hashEnabled) {
      const L = Be(a.key, a.values);
      Z(this.nsKey, L);
    }
    if (!w)
      if (r.colIndex !== null)
        r._filterTableRows(a);
      else {
        if (!l) return;
        const L = l.children;
        for (let x = 0; x < L.length; x++) {
          const k = L[x];
          if (k.removeAttribute(m), e) continue;
          const q = k.getAttribute("data-" + a.key);
          q !== null && (Je(q, a.values) || k.setAttribute(m, "true"));
        }
      }
  }, p.prototype._filterTableRows = function(r) {
    const a = document.getElementById(this.targetId);
    if (!a) return;
    const n = a.tagName === "TABLE" ? a : a.querySelector("table");
    if (!n) return;
    const t = r.key || this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex, e = r.values;
    u.has(n) || u.set(n, {});
    const l = u.get(n);
    t && e.length > 0 ? l[t] = { col: this.colIndex, values: e.slice() } : t && delete l[t];
    const v = n.tBodies;
    for (let w = 0; w < v.length; w++) {
      const E = v[w].rows;
      for (let S = 0; S < E.length; S++) {
        const L = E[S], x = {};
        for (let k = 0; k < L.cells.length; k++)
          x[k] = L.cells[k].textContent.trim();
        jn(x, l) ? L.removeAttribute(m) : L.setAttribute(m, "true");
      }
    }
  }, p.prototype.destroy = function() {
    if (this.dom[i]) {
      if (this._destroyed = !0, this.colIndex !== null) {
        const r = document.getElementById(this.targetId);
        if (r) {
          const a = r.tagName === "TABLE" ? r : r.querySelector("table");
          if (a && u.has(a)) {
            const n = u.get(a), t = this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex;
            t && n[t] && delete n[t], Object.keys(n).length === 0 && u.delete(a);
          }
        }
      }
      this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[i];
    }
  };
  function h(r, a) {
    const n = r[i];
    !n || n._destroyed || a === s && (n.hashEnabled && n._onHashChange && window.removeEventListener("hashchange", n._onHashChange), n.nsKey = _t(r, "filter"), n.hashEnabled = !!n.nsKey, n.hashEnabled && window.addEventListener("hashchange", n._onHashChange));
  }
  H(o, i, p, "ln-filter", {
    extraAttributes: [s],
    onAttributeChange: h
  });
})();
function te(o) {
  return String(o || "").trim().toLowerCase();
}
function Wn(o) {
  const i = te(o);
  return i ? i.split(/\s+/).filter(Boolean) : [];
}
function Gn(o) {
  if (o == null) return null;
  const i = String(o).split(",").map((b) => b.trim()).filter(Boolean);
  return i.length ? i : null;
}
function Qn(o, i) {
  if (!i || i.length === 0) return !0;
  if (!o) return !1;
  const b = String(o).toLowerCase();
  for (let y = 0; y < i.length; y++)
    if (b.indexOf(i[y]) === -1) return !1;
  return !0;
}
function $n(o) {
  return !o || o.length === 0 ? "" : o.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
(function() {
  const o = "data-ln-search", i = "lnSearch", b = "data-ln-search-for", y = "lnSearchControl", m = "data-ln-search-items", g = "data-ln-search-fields", f = "data-ln-search-exclude", s = "data-ln-search-hide", u = "data-ln-hash";
  if (window[i] !== void 0) return;
  function d(e) {
    const l = _t(e, "search");
    if (l) return l;
    if (e.id) {
      const v = document.querySelector("[" + b + '="' + e.id + '"]');
      if (v) {
        const w = _t(v, "search");
        if (w) return w;
      }
    }
    return null;
  }
  function _(e) {
    return e.matches("input, textarea") ? e : e.querySelector("input, textarea");
  }
  function c(e, l) {
    const v = e.childNodes;
    for (let w = 0; w < v.length; w++) {
      const E = v[w];
      if (E.nodeType === 3) {
        l.push(E.nodeValue);
        continue;
      }
      E.nodeType === 1 && (E.hasAttribute(f) || c(E, l));
    }
  }
  function p(e) {
    if (e._lnSearchText !== void 0) return e._lnSearchText;
    const l = [];
    c(e, l);
    const v = $n(l);
    return e._lnSearchText = v, v;
  }
  function h(e, l) {
    if (!e.id) return;
    const v = document.querySelectorAll("[" + b + '="' + e.id + '"]');
    for (const w of v) {
      const E = _(w);
      E && E.value !== l && (E.value = l);
    }
  }
  function r(e) {
    this.dom = e, this.term = e.getAttribute(o) || "", this._destroyed = !1;
    const l = this;
    return this.nsKey = d(e), this.hashEnabled = !!this.nsKey, this._onHashChange = function() {
      if (l._destroyed || !l.hashEnabled) return;
      const v = Y(l.nsKey), w = l.dom.getAttribute(o) || "";
      v !== null && v !== w ? l.dom.setAttribute(o, v) : v === null && w !== "" && l.dom.setAttribute(o, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), it(function() {
      if (!l._destroyed) {
        if (l.hashEnabled) {
          const v = Y(l.nsKey);
          if (v !== null && v !== l.term) {
            l.term = v, l.dom.setAttribute(o, v), h(l.dom, v), l._apply();
            return;
          }
        }
        te(l.term) && (h(l.dom, l.term), l._apply());
      }
    }), this;
  }
  r.prototype._apply = function() {
    const e = this.dom, l = te(this.term), v = Wn(l);
    this.hashEnabled && Z(this.nsKey, this.term ? this.term : null);
    const w = Gn(e.getAttribute(g));
    if (G(e, "ln-search:change", {
      term: l,
      tokens: v,
      targetId: e.id,
      fields: w
    }).defaultPrevented) return;
    const S = e.getAttribute(m), L = S ? e.querySelectorAll(S) : e.children;
    for (let x = 0; x < L.length; x++) {
      const k = L[x];
      if (k.removeAttribute(s), k.hasAttribute(f) || v.length === 0) continue;
      const q = p(k);
      Qn(q, v) || k.setAttribute(s, "true");
    }
  }, r.prototype.destroy = function() {
    this.dom[i] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[i]);
  };
  function a(e) {
    if (this.dom = e, this.targetId = e.getAttribute(b), this.input = _(e), this._attachHandler(), this.input && this.input.value.trim()) {
      const l = this;
      it(function() {
        const v = document.getElementById(l.targetId);
        v && ((v.getAttribute(o) || "").trim() || l._write(l.input.value));
      });
    }
    return this;
  }
  a.prototype._write = function(e) {
    const l = document.getElementById(this.targetId);
    l && l.getAttribute(o) !== e && l.setAttribute(o, e);
  }, a.prototype._attachHandler = function() {
    if (!this.input) return;
    const e = this;
    this._onInput = function() {
      e._write(e.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, a.prototype.destroy = function() {
    this.dom[y] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[y]);
  };
  function n(e) {
    const l = e.getAttribute("data-ln-search-clear-for");
    if (l) {
      const L = document.getElementById(l), x = document.querySelector("[" + b + '="' + l + '"]'), k = x ? _(x) : null;
      return { target: L, input: k };
    }
    const v = e.closest("[" + o + "]");
    if (v) {
      const L = v.id ? document.querySelector("[" + b + '="' + v.id + '"]') : null, x = L ? _(L) : null;
      return { target: v, input: x };
    }
    const w = e.closest("[data-ln-table-source], [data-ln-list-source]");
    if (w) {
      const L = w.getAttribute("data-ln-table-source") || w.getAttribute("data-ln-list-source"), x = L ? document.getElementById(L) : null;
      if (x && x.hasAttribute(o)) {
        const k = document.querySelector("[" + b + '="' + L + '"]'), q = k ? _(k) : null;
        return { target: x, input: q };
      }
    }
    const E = e.closest("[" + b + "]");
    if (E) {
      const L = E.getAttribute(b), x = L ? document.getElementById(L) : null, k = _(E);
      return { target: x, input: k };
    }
    const S = e.parentElement;
    if (S) {
      const L = S.querySelector("[" + b + "]");
      if (L) {
        const x = L.getAttribute(b), k = x ? document.getElementById(x) : null, q = _(L);
        return { target: k, input: q };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(e) {
    const l = e.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!l) return;
    const v = n(l);
    !v.target && !v.input || (e.preventDefault(), v.input && (v.input.value = "", v.input.focus()), v.target && v.target.setAttribute(o, ""));
  });
  function t(e, l) {
    const v = e[i];
    if (!v || v._destroyed) return;
    if (l === u) {
      v._onHashChange && window.removeEventListener("hashchange", v._onHashChange), v.nsKey = d(e), v.hashEnabled = !!v.nsKey, v.hashEnabled && window.addEventListener("hashchange", v._onHashChange);
      return;
    }
    const w = e.getAttribute(o) || "";
    w !== v.term && (v.term = w, h(e, w), v._apply());
  }
  H(o, i, r, "ln-search", {
    extraAttributes: [u],
    onAttributeChange: t,
    onSubtreeChange: function(e, l) {
      const v = l.target;
      v && v._lnSearchText !== void 0 && delete v._lnSearchText, v && v.parentElement && v.parentElement._lnSearchText !== void 0 && delete v.parentElement._lnSearchText;
    }
  }), H(b, y, a, "ln-search-control");
})();
function ut(o) {
  const i = String(o || "").trim().toLowerCase();
  return i === "asc" || i === "ascending" ? "asc" : i === "desc" || i === "descending" ? "desc" : "none";
}
function Yn(o) {
  const i = ut(o);
  return i === "asc" ? "ascending" : i === "desc" ? "descending" : "none";
}
function Xn(o, i) {
  return !o || !i ? !1 : o.field !== null && o.field !== void 0 && i.field !== null && i.field !== void 0 ? o.field === i.field : o.column !== null && o.column !== void 0 && i.column !== null && i.column !== void 0 ? String(o.column) === String(i.column) : !1;
}
function Jn(o, i, b, y) {
  const m = ut(o);
  if (m === "none") return () => 0;
  const g = m === "desc" ? -1 : 1, f = typeof y == "function" ? y : (s) => s;
  return function(s, u) {
    const d = f(s), _ = f(u);
    return Se(d, _, i, b) * g;
  };
}
(function() {
  const o = "data-ln-sort", i = "lnSort", b = "data-ln-sort-field", y = "data-ln-sort-state", m = "data-ln-sort-dir", g = "data-ln-sort-items", f = "data-ln-hash";
  if (window[i] !== void 0) return;
  const s = /* @__PURE__ */ new WeakMap();
  function u(c, p) {
    if (p) {
      const h = c.querySelector('[data-ln-field="' + p + '"]');
      if (h) return wt(h);
    }
    return wt(c);
  }
  function d(c) {
    this.dom = c, this.targetId = c.getAttribute(o), this.field = c.getAttribute(b) || null;
    const p = c.closest("th");
    this.column = !this.field && p ? p.cellIndex : null, this.itemsSelector = c.getAttribute(g) || null, this._state = ut(c.getAttribute(y)), this._destroyed = !1, this.nsKey = _t(c, "sort"), this.hashEnabled = !!this.nsKey;
    const h = this;
    this._onClick = function(a) {
      const n = a.target.closest("[" + m + "]");
      if (!n) return;
      const t = ut(n.getAttribute(m));
      h._apply(t);
    }, c.addEventListener("click", this._onClick), this._onSortChange = function(a) {
      if (h._destroyed || !a.detail) return;
      const n = h._resolveTarget();
      if (!(n && (a.target === n || n.contains(a.target)) || a.detail.targetId && a.detail.targetId === h.targetId)) return;
      if (Xn(
        { field: h.field, column: h.column },
        { field: a.detail.field, column: a.detail.column }
      )) {
        const l = ut(a.detail.direction);
        l && c.getAttribute(y) !== l && (h._state = l, c.setAttribute(y, l), h._updateAriaSort(l));
        return;
      }
      c.getAttribute(y) !== "none" && (h._state = "none", c.setAttribute(y, "none"), h._updateAriaSort("none")), c.hasAttribute("data-ln-persist") && gt("sort", c, null);
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (h._destroyed || !h.hashEnabled) return;
      const a = Y(h.nsKey), n = Gt(a);
      if (n)
        h.field !== null && n.fieldOrColumn === h.field || h.column !== null && String(h.column) === n.fieldOrColumn ? h._state !== n.direction && h._apply(n.direction, !0) : h._state !== "none" && (h._state = "none", c.setAttribute(y, "none"), h._updateAriaSort("none"));
      else if (h._state !== "none") {
        h._state = "none", c.setAttribute(y, "none"), h._updateAriaSort("none");
        const t = h._resolveTarget();
        t && (G(t, "ln-sort:change", {
          field: h.field,
          column: h.column,
          direction: "none",
          targetId: h.targetId
        }).defaultPrevented || h._defaultSort(t, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let r = !1;
    if (this.hashEnabled) {
      const a = Y(this.nsKey), n = Gt(a);
      n && ((h.field !== null && n.fieldOrColumn === h.field || h.column !== null && String(h.column) === n.fieldOrColumn) && it(function() {
        h._destroyed || h._apply(n.direction, !0);
      }), r = !0);
    }
    if (!r && c.hasAttribute("data-ln-persist")) {
      const a = Ht("sort", c);
      a && a.direction && a.direction !== "none" && it(function() {
        h._destroyed || h._apply(a.direction, !0);
      }), r = !0;
    }
    if (!r) {
      const a = ut(c.getAttribute(y));
      a && a !== "none" && it(function() {
        h._destroyed || h._apply(a, !0);
      });
    }
    return this;
  }
  d.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, d.prototype._updateAriaSort = function(c) {
    const p = this.dom.closest("th");
    p && p.setAttribute("aria-sort", Yn(c));
  }, d.prototype._apply = function(c, p) {
    if (this._destroyed) return;
    const h = ut(c);
    this._state = h, this.dom.getAttribute(y) !== h && this.dom.setAttribute(y, h), this._updateAriaSort(h);
    const r = this._resolveTarget();
    if (!r) return;
    const a = {
      field: this.field,
      column: this.column,
      direction: h,
      targetId: this.targetId
    };
    if (!p && (this.dom.hasAttribute("data-ln-persist") && gt("sort", this.dom, h === "none" ? null : a), this.hashEnabled)) {
      const t = He(this.field !== null ? this.field : this.column, h);
      Z(this.nsKey, t);
    }
    G(r, "ln-sort:change", a).defaultPrevented || this._defaultSort(r, h);
  }, d.prototype._defaultSort = function(c, p) {
    const h = this.itemsSelector ? Array.from(c.querySelectorAll(this.itemsSelector)) : Array.from(c.children);
    if (!h.length) return;
    const r = h[0].parentNode;
    s.has(c) || s.set(c, h.slice());
    let a;
    if (p === "none")
      a = (s.get(c) || h).filter(function(e) {
        return e.parentNode === r;
      });
    else {
      const t = this.field, e = h.map(function(E) {
        return u(E, t);
      }), l = Ae(e), v = typeof Intl < "u" ? new Intl.Collator(Q(this.dom), { sensitivity: "base" }) : null, w = Jn(p, l, v, function(E) {
        return u(E, t);
      });
      a = h.slice().sort(w);
    }
    const n = document.createDocumentFragment();
    for (let t = 0; t < a.length; t++) n.appendChild(a[t]);
    r.appendChild(n);
  }, d.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[i]);
  };
  function _(c, p) {
    const h = c[i];
    if (!(!h || h._destroyed))
      if (p === b) {
        h.field = c.getAttribute(b) || null;
        const r = c.closest("th");
        h.column = !h.field && r ? r.cellIndex : null;
      } else if (p === g)
        h.itemsSelector = c.getAttribute(g) || null;
      else if (p === y) {
        const r = ut(c.getAttribute(y));
        r !== h._state && h._apply(r);
      } else p === o ? h.targetId = c.getAttribute(o) : p === f && (h.hashEnabled && h._onHashChange && window.removeEventListener("hashchange", h._onHashChange), h.nsKey = _t(c, "sort"), h.hashEnabled = !!h.nsKey, h.hashEnabled && window.addEventListener("hashchange", h._onHashChange));
  }
  H(o, i, d, "ln-sort", {
    extraAttributes: [b, g, y, f],
    onAttributeChange: _
  });
})();
(function() {
  const o = "data-ln-table", i = "lnTable", b = "data-ln-table-empty";
  if (window[i] !== void 0) return;
  typeof Intl < "u" && new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" });
  function u(c, p) {
    if (c == null || isNaN(c)) return "";
    try {
      return new Intl.NumberFormat(Q(p)).format(c);
    } catch {
      return String(c);
    }
  }
  function d(c) {
    let p = c.parentElement;
    for (; p && p !== document.body && p !== document.documentElement; ) {
      const r = getComputedStyle(p).overflowY;
      if (r === "auto" || r === "scroll") return p;
      p = p.parentElement;
    }
    return null;
  }
  function _(c) {
    this.dom = c, this.table = c.querySelector("table"), this.tbody = c.querySelector("[data-ln-table-body]") || c.querySelector("tbody"), this.thead = c.querySelector("thead");
    const p = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = p ? Array.from(p.querySelectorAll("th")) : [], this._totalSpan = c.querySelector("[data-ln-table-total]"), this._filteredSpan = c.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== c ? this._filteredSpan.parentElement : null), this._selectedSpan = c.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== c ? this._selectedSpan.parentElement : null), this.isDataDriven = c.hasAttribute("data-ln-table-source"), this.name = c.getAttribute(o) || "", this.source = c.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const h = this;
    return this._onSetSearch = function(r) {
      const a = (r.detail && r.detail.query != null ? r.detail.query : r.detail && r.detail.term != null ? r.detail.term : "").trim();
      h.isDataDriven ? (h.currentSearch = a, C(c, "ln-table:search", {
        table: h.name,
        query: h.currentSearch
      }), h._requestData()) : (h._searchTerm = a.toLowerCase(), h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter(), C(c, "ln-table:filter", {
        term: h._searchTerm,
        matched: h._filteredData.length,
        total: h._data.length
      }));
    }, c.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(r) {
      r.preventDefault(), h._onSetSearch(r);
    }, c.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      h.isDataDriven ? (h.currentFilters = {}, h.currentSearch = "", C(c, "ln-table:clear-filters", { table: h.name }), h._requestData()) : (h._searchTerm = "", h._columnFilters = {}, h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter(), C(c, "ln-table:filter", {
        term: "",
        matched: h._filteredData.length,
        total: h._data.length
      }));
    }, c.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectable = c.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && c.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(r) {
      const a = r.detail || {}, n = a.data || [], t = a.total != null ? a.total : n.length;
      if (!(h._hasInitialSeed && !h.isLoaded && n.length === 0 && t === 0)) {
        if (h._windowed) {
          h._cache.ingest(a) && !a.provisional && c.classList.remove("ln-table--loading");
          return;
        }
        h._data = n, h._lastTotal = t, h._lastFiltered = a.filtered != null ? a.filtered : h._data.length, h.totalCount = h._lastTotal, h.visibleCount = h._lastFiltered, h.isLoaded = !0, h._hasInitialSeed = !1, c.classList.remove("ln-table--loading"), h._vStart = -1, h._vEnd = -1, h._applyFilterAndSort(), h._render(), h._updateFooter(), C(c, "ln-table:rendered", {
          table: h.name,
          total: h.totalCount,
          visible: h.visibleCount
        });
      }
    }, c.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(r) {
      const a = r.detail && r.detail.loading;
      c.classList.toggle("ln-table--loading", !!a), a && (h.isLoaded = !1);
    }, c.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(r) {
      !h._windowed || !h._cache || h._cache.release(r.detail && r.detail.offset);
    }, c.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !h._windowed || !h._cache || h._cache.revalidate();
    }, c.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !h._windowed || !h._cache || h._requestData();
    }, c.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(r) {
      r.preventDefault(), h.currentSort = r.detail.direction === "none" ? null : { field: r.detail.field, direction: r.detail.direction }, h._requestData();
    }, c.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(r) {
      if (r.target.closest("[data-ln-table-row-select]") || r.target.closest("[data-ln-table-row-action]") || r.target.closest("a") || r.target.closest("button") || r.ctrlKey || r.metaKey || r.button === 1) return;
      const a = r.target.closest("[data-ln-table-row]");
      if (!a) return;
      const n = a.getAttribute("data-ln-table-row-id"), t = a._lnRecord || {};
      C(c, "ln-table:row-click", {
        table: h.name,
        id: n,
        record: t
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(r) {
      const a = r.target.closest("[data-ln-table-row-action]");
      if (!a) return;
      r.stopPropagation();
      const n = a.closest("[data-ln-table-row]");
      if (!n) return;
      const t = a.getAttribute("data-ln-table-row-action"), e = n.getAttribute("data-ln-table-row-id"), l = n._lnRecord || {};
      C(c, "ln-table:row-action", {
        table: h.name,
        id: e,
        action: t,
        record: l
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : C(c, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      h.tbody.rows.length > 0 && (h._emptyTbodyObserver.disconnect(), h._emptyTbodyObserver = null, h._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(r) {
      r.preventDefault();
      const a = r.detail.direction === "none" ? null : r.detail.direction;
      h._sortCol = a === null ? -1 : r.detail.column, h._sortDir = a, h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), C(c, "ln-table:sorted", {
        column: r.detail.column,
        direction: r.detail.direction,
        matched: h._filteredData.length,
        total: h._data.length
      });
    }, c.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(r) {
      if (r.preventDefault(), !r.detail) return;
      const a = r.detail.key, n = r.detail.values || [];
      if (a) {
        if (n.length === 0)
          delete h._columnFilters[a];
        else {
          const t = [];
          for (let e = 0; e < n.length; e++)
            t.push(n[e].toLowerCase());
          h._columnFilters[a] = t;
        }
        h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter(), C(c, "ln-table:filter", {
          term: h._searchTerm,
          matched: h._filteredData.length,
          total: h._data.length
        });
      }
    }, c.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  _.prototype._parseRows = function() {
    const c = this.tbody.rows, p = this.ths;
    this._data = [], c.length > 0 && (this._rowHeight = c[0].offsetHeight || 40), this._lockColumnWidths();
    for (let h = 0; h < c.length; h++) {
      const r = c[h], a = [], n = [], t = [];
      for (let l = 0; l < r.cells.length; l++) {
        const v = r.cells[l], w = v.textContent.trim();
        a[l] = wt(v), n[l] = w.toLowerCase(), v.querySelector("[data-ln-table-row-action]") || t.push(w.toLowerCase());
      }
      let e = null;
      if (this.isDataDriven) {
        e = {};
        const l = r.getAttribute("data-ln-table-row-id");
        l != null && (e.id = l);
        for (let v = 0; v < p.length; v++) {
          const w = p[v].getAttribute("data-ln-table-col");
          if (w) {
            const E = v;
            if (E < r.cells.length) {
              const S = r.cells[E];
              e[w] = wt(S);
            }
          }
        }
      }
      this._data.push({
        values: a,
        rawTexts: n,
        html: r.outerHTML,
        searchText: t.join(" "),
        id: this.isDataDriven && e ? e.id : void 0,
        ...e
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), C(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, _.prototype._applyFilterAndSort = function() {
    this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
  }, _.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const c = document.createElement("colgroup");
    this.ths.forEach(function(p) {
      const h = document.createElement("col");
      h.style.width = p.offsetWidth + "px", c.appendChild(h);
    }), this.table.insertBefore(c, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = c;
  }, _.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const c = this._lastTotal, p = this.visibleCount;
        if (c === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || p === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const c = this._filteredData.length;
        c === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : c > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, _.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const c = this._filteredData, p = document.createDocumentFragment();
      for (let h = 0; h < c.length; h++) {
        const r = this._buildRow(c[h]);
        if (!r) break;
        p.appendChild(r);
      }
      this.tbody.replaceChildren(p), this._selectable && this._updateSelectAll();
    } else {
      const c = [], p = this._filteredData;
      for (let h = 0; h < p.length; h++) c.push(p[h].html);
      this.tbody.innerHTML = c.join(""), this._selectable && this._restoreSelection();
    }
  }, _.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const c = this;
    if (!this._rowHeight)
      if (this.tbody && this.tbody.rows.length > 0)
        this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
      else {
        let h = null;
        if (this._windowed) {
          const r = this._cache ? this._cache.peek() : null;
          h = r ? this._buildRow(r) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (h = this._buildRow(this._data[0]));
        h && this.tbody && (this.tbody.appendChild(h), this._rowHeight = h.offsetHeight || 40, h.remove());
      }
    this.isDataDriven ? this._scrollContainer = d(this.dom) : this._scrollContainer = null;
    const p = this._scrollContainer || window;
    this._scrollHandler = function() {
      c._rafId || (c._rafId = requestAnimationFrame(function() {
        c._rafId = null, c._windowed ? c._renderWindowed() : c._renderVirtual();
      }));
    }, p.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, _.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, _.prototype._renderVirtual = function() {
    const c = this._filteredData, p = c.length, h = this._rowHeight;
    if (!h || !p) return;
    const r = this.thead ? this.thead.offsetHeight : 0, a = this._scrollContainer;
    let n, t;
    if (a) {
      const S = this.table.getBoundingClientRect(), L = a.getBoundingClientRect(), x = S.top - L.top + a.scrollTop + r;
      n = a.scrollTop - x, t = a.clientHeight;
    } else {
      const x = this.table.getBoundingClientRect().top + window.scrollY + r;
      n = window.scrollY - x, t = window.innerHeight;
    }
    let e = Math.max(0, Math.floor(n / h) - 15);
    e = Math.min(e, p);
    const l = Math.min(e + Math.ceil(t / h) + 30, p);
    if (e === this._vStart && l === this._vEnd) return;
    this._vStart = e, this._vEnd = l;
    const v = this.ths.length || 1, w = e * h, E = (p - l) * h;
    if (this.isDataDriven) {
      const S = document.createDocumentFragment();
      if (w > 0) {
        const L = document.createElement("tr");
        L.className = "ln-table__spacer", L.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", v), x.style.height = w + "px", L.appendChild(x), S.appendChild(L);
      }
      for (let L = e; L < l; L++) {
        const x = this._buildRow(c[L]);
        x && S.appendChild(x);
      }
      if (E > 0) {
        const L = document.createElement("tr");
        L.className = "ln-table__spacer", L.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", v), x.style.height = E + "px", L.appendChild(x), S.appendChild(L);
      }
      this.tbody.replaceChildren(S), this._selectable && this._updateSelectAll();
    } else {
      let S = "";
      w > 0 && (S += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + v + '" style="height:' + w + 'px;padding:0;border:none"></td></tr>');
      for (let L = e; L < l; L++) S += c[L].html;
      E > 0 && (S += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + v + '" style="height:' + E + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = S, this._selectable && this._restoreSelection();
    }
  }, _.prototype._buildPlaceholderRow = function() {
    const c = document.createElement("tr");
    c.className = "ln-table__placeholder", c.setAttribute("aria-hidden", "true");
    const p = document.createElement("td");
    return p.setAttribute("colspan", this.ths.length || 1), p.style.height = this._rowHeight + "px", c.appendChild(p), c;
  }, _.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const c = this._rowHeight;
    if (!c) return;
    const p = this._cache.logicalTotal, h = this.thead ? this.thead.offsetHeight : 0, r = this._scrollContainer;
    let a, n;
    if (r) {
      const S = this.table.getBoundingClientRect(), L = r.getBoundingClientRect(), x = S.top - L.top + r.scrollTop + h;
      a = r.scrollTop - x, n = r.clientHeight;
    } else {
      const x = this.table.getBoundingClientRect().top + window.scrollY + h;
      a = window.scrollY - x, n = window.innerHeight;
    }
    let t = Math.max(0, Math.floor(a / c) - 15);
    t = Math.min(t, p);
    const e = Math.min(t + Math.ceil(n / c) + 30, p), l = this.ths.length || 1, v = t * c, w = (p - e) * c, E = document.createDocumentFragment();
    if (v > 0) {
      const S = document.createElement("tr");
      S.className = "ln-table__spacer", S.setAttribute("aria-hidden", "true");
      const L = document.createElement("td");
      L.setAttribute("colspan", l), L.style.height = v + "px", S.appendChild(L), E.appendChild(S);
    }
    for (let S = t; S < e; S++)
      if (this._cache.has(S)) {
        const L = this._buildRow(this._cache.get(S));
        L && E.appendChild(L);
      } else
        E.appendChild(this._buildPlaceholderRow());
    if (w > 0) {
      const S = document.createElement("tr");
      S.className = "ln-table__spacer", S.setAttribute("aria-hidden", "true");
      const L = document.createElement("td");
      L.setAttribute("colspan", l), L.style.height = w + "px", S.appendChild(L), E.appendChild(S);
    }
    this.tbody.replaceChildren(E), this._vStart = t, this._vEnd = e, this._cache.ensure(t, e);
  }, _.prototype._showEmptyState = function() {
    const c = this.ths.length || 1;
    let p = null, h = null;
    if (this.isDataDriven) {
      const r = this._lastTotal != null ? this._lastTotal : this._data.length, n = this.visibleCount === 0 && r > 0, t = n ? this.name + "-empty-filtered" : this.name + "-empty";
      if (h = ft(this.dom, t, "ln-table"), !h) {
        const e = this.dom.querySelector("template[data-ln-table-empty]");
        if (e) {
          const l = n ? "search" : "initial", v = e.content.querySelector('[data-ln-table-empty-when="' + l + '"]') || e.content.firstElementChild;
          v && (h = document.importNode(v, !0));
        }
      }
      if (h)
        if (h.tagName === "TR")
          p = h;
        else {
          const e = document.createElement("td");
          e.setAttribute("colspan", String(c)), e.appendChild(h);
          const l = document.createElement("tr");
          l.className = "ln-table__empty", l.appendChild(e), p = l;
        }
    } else {
      const r = this.dom.querySelector("template[" + b + "]"), a = document.createElement("td");
      a.setAttribute("colspan", String(c)), r && a.appendChild(document.importNode(r.content, !0));
      const n = document.createElement("tr");
      n.className = "ln-table__empty", n.appendChild(a), p = n;
    }
    p ? this.tbody.replaceChildren(p) : this.tbody.replaceChildren(), C(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, _.prototype._fillRow = function(c, p) {
    xt(c, p);
    const h = c.querySelectorAll("[data-ln-table-cell-attr]");
    for (let r = 0; r < h.length; r++) {
      const a = h[r], n = a.getAttribute("data-ln-table-cell-attr").split(",");
      for (let t = 0; t < n.length; t++) {
        const e = n[t].trim().split(":");
        if (e.length !== 2) continue;
        const l = e[0].trim(), v = e[1].trim();
        p[l] != null && a.setAttribute(v, p[l]);
      }
    }
  }, _.prototype._buildRow = function(c) {
    let p = ft(this.dom, this.name + "-row", "ln-table");
    if (!p) {
      const r = this.dom.querySelector("template[data-ln-table-row]");
      r && (p = document.importNode(r.content, !0));
    }
    let h = p ? p.querySelector("[data-ln-table-row]") || p.firstElementChild : null;
    if (h)
      this._fillRow(h, c);
    else if (c && c.html) {
      const r = document.createElement("tbody");
      r.innerHTML = c.html, h = r.firstElementChild;
    } else {
      h = document.createElement("tr"), h.setAttribute("data-ln-table-row", "");
      const r = this.ths;
      for (let a = 0; a < r.length; a++) {
        const n = r[a].hasAttribute("data-ln-table-col-select"), t = document.createElement("td");
        if (n) {
          const e = document.createElement("input");
          e.type = "checkbox", e.setAttribute("data-ln-table-row-select", ""), e.setAttribute("aria-label", "Select row"), t.appendChild(e);
        } else {
          const e = r[a].getAttribute("data-ln-table-col");
          e && c[e] != null && (t.textContent = String(c[e]));
        }
        h.appendChild(t);
      }
    }
    if (h._lnRecord = c, c.id != null && h.setAttribute("data-ln-table-row-id", c.id), this._selectable && c.id != null && this.selectedIds.has(String(c.id))) {
      h.classList.add("ln-row-selected");
      const r = h.querySelector("[data-ln-table-row-select]");
      r && (r.checked = !0);
    }
    return h;
  }, _.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Ce(this, "ln-table:request-data", "table");
  }, _.prototype._enterWindowedMode = function() {
    const c = this, p = this.dom, h = parseInt(p.getAttribute("data-ln-table-window"), 10), r = parseInt(p.getAttribute("data-ln-table-window-page"), 10), a = parseInt(p.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !c._windowed || !c._cache || (c.totalCount = c._cache.grandTotal, c.visibleCount = c._cache.logicalTotal, c._lastTotal = c._cache.grandTotal, c.isLoaded = !0, c._vStart = -1, c._vEnd = -1, c._render(), c._updateFooter(), C(p, "ln-table:rendered", {
        table: c.name,
        total: c.totalCount,
        visible: c.visibleCount
      }));
    }, this._renderBatch = ne(this._onCacheChange), this._cache = Me({
      windowSize: h > 0 ? h : 1e3,
      pageSize: r > 0 ? r : 200,
      threshold: a >= 0 ? a : 25,
      fetchDebounce: 120,
      requestPage: function(n, t, e) {
        C(p, "ln-table:request-data", {
          table: c.name,
          sort: n.sort,
          filters: n.filters,
          search: n.search,
          offset: t,
          limit: e,
          queryGen: c._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, _.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let c = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(c) && this._totalSpan) {
        const h = this._totalSpan.textContent.replace(/[^\d]/g, "");
        h && (c = parseInt(h, 10));
      }
      const p = c > 0 ? c : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: p,
        filtered: p
      });
    } else
      this.dom.classList.add("ln-table--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, _.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, _.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const c = this.tbody.querySelectorAll("[data-ln-table-row]");
    let p = c.length > 0;
    for (let h = 0; h < c.length; h++) {
      const r = c[h].getAttribute("data-ln-table-row-id");
      if (r != null && !this.selectedIds.has(r)) {
        p = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = p;
  }, _.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const c = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let p = 0; p < c.length; p++) {
      const h = c[p].getAttribute("data-ln-table-row-id"), r = h != null && this.selectedIds.has(h);
      c[p].classList.toggle("ln-row-selected", r);
      const a = c[p].querySelector("[data-ln-table-row-select]");
      a && (a.checked = r);
    }
    this._updateSelectAll();
  }, Object.defineProperty(_.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), _.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const c = this;
    if (this._onSelectionChange = function(p) {
      const h = p.target.closest("[data-ln-table-row-select]");
      if (!h) return;
      const r = h.closest("[data-ln-table-row]");
      if (!r) return;
      const a = r.getAttribute("data-ln-table-row-id");
      a != null && (h.checked ? (c.selectedIds.add(a), r.classList.add("ln-row-selected")) : (c.selectedIds.delete(a), r.classList.remove("ln-row-selected")), c.selectedCount = c.selectedIds.size, c._updateSelectAll(), c._updateFooter(), C(c.dom, "ln-table:select", {
        table: c.name,
        selectedIds: c.selectedIds,
        count: c.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const p = document.createElement("input");
      p.type = "checkbox";
      const h = c.dom.querySelector('[data-ln-table-dict="select-all"]'), r = c.dom.getAttribute("data-ln-table-select-all-label") || (h ? h.textContent.trim() : null) || "Select all";
      p.setAttribute("aria-label", r), this._selectAllCheckbox.appendChild(p), this._selectAllCheckbox = p;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const p = c._selectAllCheckbox.checked, h = c.tbody ? c.tbody.querySelectorAll("[data-ln-table-row]") : [];
      for (let r = 0; r < h.length; r++) {
        const a = h[r].getAttribute("data-ln-table-row-id"), n = h[r].querySelector("[data-ln-table-row-select]");
        a != null && (p ? (c.selectedIds.add(a), h[r].classList.add("ln-row-selected")) : (c.selectedIds.delete(a), h[r].classList.remove("ln-row-selected")), n && (n.checked = p));
      }
      c.selectedCount = c.selectedIds.size, C(c.dom, "ln-table:select-all", {
        table: c.name,
        selected: p
      }), C(c.dom, "ln-table:select", {
        table: c.name,
        selectedIds: c.selectedIds,
        count: c.selectedCount
      }), c._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const p = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let h = 0; h < p.length; h++) {
        const r = p[h].querySelector("[data-ln-table-row-select]"), a = p[h].getAttribute("data-ln-table-row-id");
        r && r.checked && a != null && (this.selectedIds.add(a), p[h].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, _.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const c = this.dom.querySelector("[data-ln-table-col-select]");
    if (c) {
      const p = c.querySelector('input[type="checkbox"]');
      p && p.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const p = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let h = 0; h < p.length; h++) {
        p[h].classList.remove("ln-row-selected");
        const r = p[h].querySelector("[data-ln-table-row-select]");
        r && (r.checked = !1);
      }
    }
    this._updateFooter();
  }, _.prototype._updateFooter = function() {
    let c = 0, p = 0;
    this.isDataDriven ? (c = this._lastTotal != null ? this._lastTotal : this._data.length, p = this.visibleCount) : (c = this._data.length, p = this._filteredData.length);
    const h = p < c;
    if (this._totalSpan && (this._totalSpan.textContent = u(c, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = h ? u(p, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !h), this._selectedSpan) {
      const r = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = r > 0 ? u(r, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", r === 0);
    }
  }, _.prototype.destroy = function() {
    this.dom[i] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[i]);
  }, H(o, i, _, "ln-table", {
    extraAttributes: [
      "data-ln-table-window",
      "data-ln-table-window-page",
      "data-ln-table-window-threshold",
      "data-ln-table-count"
    ],
    onAttributeChange: function(c, p) {
      const h = c[i];
      if (!(!h || !h.isDataDriven)) {
        if (p === "data-ln-table-window") {
          const r = c.hasAttribute("data-ln-table-window");
          if (r && !h._windowed)
            h._enterWindowedMode(), h._kickWindowInitial();
          else if (!r && h._windowed)
            h._exitWindowedMode();
          else if (r && h._windowed) {
            const a = parseInt(c.getAttribute("data-ln-table-window"), 10);
            a > 0 && h._cache.configure({ windowSize: a });
          }
          return;
        }
        if (!(!h._windowed || !h._cache)) {
          if (p === "data-ln-table-window-page") {
            const r = parseInt(c.getAttribute("data-ln-table-window-page"), 10);
            r > 0 && h._cache.configure({ pageSize: r });
          } else if (p === "data-ln-table-window-threshold") {
            const r = parseInt(c.getAttribute("data-ln-table-window-threshold"), 10);
            r >= 0 && h._cache.configure({ threshold: r });
          } else if (p === "data-ln-table-count") {
            const r = parseInt(c.getAttribute("data-ln-table-count"), 10);
            r >= 0 && h._cache.setGrandTotal(r);
          }
        }
      }
    }
  });
})();
(function() {
  const o = "data-ln-table-coordinator", i = "lnTableCoordinator";
  if (window[i] !== void 0) return;
  document.addEventListener("keydown", function(f) {
    if (f.key !== "/" || f.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const s = document.querySelector("[" + o + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!s) return;
    const u = s.tagName === "INPUT" || s.tagName === "TEXTAREA" ? s : s.querySelector('input[type="search"], input[type="text"], input');
    u && (f.preventDefault(), u.focus());
  });
  function b(f) {
    return this.dom = f, g(this), this;
  }
  function y(f, s) {
    const u = s ? '[data-ln-search-for="' + s + '"]' : "[data-ln-search-for]", d = f.querySelector(u) || document.querySelector(u);
    return d ? d.tagName === "INPUT" || d.tagName === "TEXTAREA" ? d : d.querySelector("input, textarea") : null;
  }
  function m(f, s) {
    if (s) {
      const d = f.querySelectorAll('[data-ln-filter="' + s + '"]');
      if (d.length > 0) return d;
      const _ = document.querySelectorAll('[data-ln-filter="' + s + '"]');
      if (_.length > 0) return _;
    }
    const u = f.querySelectorAll("[data-ln-filter]");
    return u.length > 0 ? u : document.querySelectorAll("[data-ln-filter]");
  }
  function g(f) {
    const s = f.dom;
    function u(d) {
      const _ = d.target;
      if (_ && _.hasAttribute && _.hasAttribute("data-ln-table")) return _;
      const c = d.detail && d.detail.targetId || _ && _.id;
      return c ? s.querySelector('[data-ln-table-source="' + c + '"]') || s.querySelector('[data-ln-table="' + c + '"]') : null;
    }
    f._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(d) {
        if (!d.detail) return;
        const _ = u(d);
        if (!_ || !_.hasAttribute || !_.hasAttribute("data-ln-table")) return;
        const c = d.detail.key, p = d.detail.values || [], h = _.querySelectorAll("th");
        for (let r = 0; r < h.length; r++)
          if (h[r].getAttribute("data-ln-table-filter-col") === c) {
            const a = h[r].querySelector("[data-ln-table-col-filter]");
            a && a.classList.toggle("ln-filter-active", p.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(d) {
        const _ = d.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!_) return;
        const c = _.closest("[data-ln-table]") || s.querySelector("[data-ln-table]");
        if (!c || !c.lnTable) return;
        const p = c.lnTable.name || c.id, h = c.querySelectorAll("th");
        for (let t = 0; t < h.length; t++) {
          const e = h[t].querySelector("[data-ln-table-col-filter]");
          e && e.classList.remove("ln-filter-active");
        }
        const r = c.getAttribute("data-ln-table-source") || c.id, a = r ? document.getElementById(r) : null;
        if (a && a.hasAttribute("data-ln-search"))
          a.setAttribute("data-ln-search", "");
        else {
          const t = y(s, r);
          t && t.value !== "" && (t.value = "", t.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const n = m(s, r);
        for (let t = 0; t < n.length; t++) {
          const e = n[t].querySelector("[data-ln-filter-reset]");
          if (!e) continue;
          const l = n[t].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!e.checked || l) && (e.checked = !0, e.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        c.hasAttribute("data-ln-table-source") || C(c, "ln-table:request-clear-filters", { table: p });
      }
    }, s.addEventListener("ln-filter:change", f._handlers.filter), s.addEventListener("click", f._handlers.clear);
  }
  b.prototype.destroy = function() {
    this.dom[i] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[i]);
  }, H(o, i, b, "ln-table-coordinator");
})();
(function() {
  const o = "data-ln-list", i = "lnList", b = "data-ln-list-empty";
  if (window[i] !== void 0) return;
  function u(r, a) {
    if (r == null || isNaN(r)) return "";
    try {
      return new Intl.NumberFormat(Q(a)).format(r);
    } catch {
      return String(r);
    }
  }
  function d(r) {
    let a = r;
    for (; a && a !== document.body && a !== document.documentElement; ) {
      const t = getComputedStyle(a).overflowY;
      if (t === "auto" || t === "scroll") return a;
      a = a.parentElement;
    }
    return null;
  }
  function _(r) {
    const a = r._scrollContainer || d(r.dom);
    return {
      container: a,
      top: a ? a.scrollTop : window.scrollY
    };
  }
  function c(r) {
    r.container ? r.container.scrollTop = r.top : window.scrollTo(window.scrollX, r.top);
  }
  function p(r) {
    if (!r) return 0;
    const a = getComputedStyle(r), n = parseFloat(a.marginTop) || 0, t = parseFloat(a.marginBottom) || 0;
    return r.offsetHeight + n + t;
  }
  function h(r) {
    this.dom = r, this.tbody = r.querySelector("[data-ln-list-body]") || r, this.isDataDriven = r.hasAttribute("data-ln-list-source"), this.name = r.getAttribute(o) || "", this.source = r.getAttribute("data-ln-list-source") || "", this._totalSpan = r.querySelector("[data-ln-list-total]"), this._filteredSpan = r.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== r ? this._filteredSpan.parentElement : null), this._selectedSpan = r.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== r ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const a = this;
    return this._onSetSearch = function(n) {
      const t = (n.detail && n.detail.query != null ? n.detail.query : n.detail && n.detail.term != null ? n.detail.term : "").trim();
      a.isDataDriven ? (a.currentSearch = t, C(r, "ln-list:search", {
        list: a.name,
        query: a.currentSearch
      }), a._requestData()) : (a._searchTerm = t.toLowerCase(), a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), C(r, "ln-list:filter", {
        term: a._searchTerm,
        matched: a._filteredData.length,
        total: a._data.length
      }));
    }, r.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(n) {
      n.preventDefault(), a._onSetSearch(n);
    }, r.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      a.isDataDriven ? (a.currentFilters = {}, a.currentSearch = "", C(r, "ln-list:clear-filters", { list: a.name }), a._requestData()) : (a._searchTerm = "", a._filters = {}, a._sortField = null, a._sortDir = null, a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), C(r, "ln-list:filter", {
        term: "",
        matched: a._filteredData.length,
        total: a._data.length
      }));
    }, r.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectable = r.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, r.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(n) {
      const t = n.detail || {}, e = t.data || [], l = t.total != null ? t.total : e.length;
      if (!(a._hasInitialSeed && !a.isLoaded && e.length === 0 && l === 0)) {
        if (a._windowed) {
          a._cache.ingest(t) && !t.provisional && r.classList.remove("ln-list--loading");
          return;
        }
        a._data = e, a._lastTotal = l, a._lastFiltered = t.filtered != null ? t.filtered : a._data.length, a.totalCount = a._lastTotal, a.visibleCount = a._lastFiltered, a.isLoaded = !0, a._hasInitialSeed = !1, r.classList.remove("ln-list--loading"), a._vStart = -1, a._vEnd = -1, a._applyFilterAndSort(), a._render(), a._updateFooter(), C(r, "ln-list:rendered", {
          list: a.name,
          total: a.totalCount,
          visible: a.visibleCount
        });
      }
    }, r.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(n) {
      const t = n.detail && n.detail.loading;
      r.classList.toggle("ln-list--loading", !!t), t && (a.isLoaded = !1);
    }, r.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(n) {
      !a._windowed || !a._cache || a._cache.release(n.detail && n.detail.offset);
    }, r.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !a._windowed || !a._cache || a._cache.revalidate();
    }, r.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !a._windowed || !a._cache || a._requestData();
    }, r.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(n) {
      n.detail.field != null && (n.preventDefault(), a.currentSort = n.detail.direction === "none" ? null : { field: n.detail.field, direction: n.detail.direction }, a._requestData());
    }, r.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(n) {
      if (n.target.closest("[data-ln-item-select]") || n.target.closest("[data-ln-item-action]") || n.target.closest("a") || n.target.closest("button") || n.ctrlKey || n.metaKey || n.button === 1) return;
      const t = n.target.closest("[data-ln-item]");
      if (!t) return;
      const e = t.getAttribute("data-ln-item-id"), l = t._lnRecord || {};
      C(r, "ln-list:item-click", {
        list: a.name,
        id: e,
        record: l
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(n) {
      const t = n.target.closest("[data-ln-item-action]");
      if (!t) return;
      n.stopPropagation();
      const e = t.closest("[data-ln-item]");
      if (!e) return;
      const l = t.getAttribute("data-ln-item-action"), v = e.getAttribute("data-ln-item-id"), w = e._lnRecord || {};
      C(r, "ln-list:item-action", {
        list: a.name,
        id: v,
        action: l,
        record: w
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : C(r, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      a.tbody.children.length > 0 && (a._emptyObserver.disconnect(), a._emptyObserver = null, a._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(n) {
      if (n.preventDefault(), !n.detail) return;
      const t = n.detail.key, e = n.detail.values || [];
      if (t) {
        if (e.length === 0)
          delete a._filters[t];
        else {
          const l = [];
          for (let v = 0; v < e.length; v++)
            l.push(e[v].toLowerCase());
          a._filters[t] = l;
        }
        a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), C(r, "ln-list:filter", {
          term: a._searchTerm,
          matched: a._filteredData.length,
          total: a._data.length
        });
      }
    }, r.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(n) {
      if (n.detail && n.detail.field == null) return;
      n.preventDefault();
      const t = n.detail && n.detail.direction === "none" ? null : n.detail && n.detail.direction;
      a._sortField = t === null ? null : n.detail && n.detail.field, a._sortDir = t, a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), C(r, "ln-list:sorted", {
        field: a._sortField,
        direction: n.detail && n.detail.direction,
        matched: a._filteredData.length,
        total: a._data.length
      });
    }, r.addEventListener("ln-sort:change", this._onSort)), this;
  }
  h.prototype._parseChildren = function() {
    const r = Array.from(this.tbody.children).filter((a) => !a.classList.contains("ln-list__spacer"));
    this._data = [], r.length > 0 && (this._itemHeight = p(r[0]) || 50);
    for (let a = 0; a < r.length; a++) {
      const n = r[a], t = n.getAttribute("data-ln-item-id") || n.getAttribute("id"), e = n.textContent.trim().toLowerCase();
      let l = null;
      if (this.isDataDriven) {
        l = {}, t != null && (l.id = t);
        const E = n.querySelectorAll("[data-ln-list-field]");
        for (let S = 0; S < E.length; S++) {
          const L = E[S], x = L.getAttribute("data-ln-list-field");
          x && (l[x] = wt(L));
        }
      }
      const v = {}, w = n.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let E = 0; E < w.length; E++) {
        const S = w[E], L = S.getAttribute("data-ln-list-field") || S.getAttribute("data-ln-field");
        L && (v[L] = wt(S));
      }
      for (let E = 0; E < n.attributes.length; E++) {
        const S = n.attributes[E];
        if (S.name.startsWith("data-") && !S.name.startsWith("data-ln-")) {
          const L = S.name.slice(5);
          L && (v[L] = S.value);
        }
      }
      this._data.push({
        html: n.outerHTML,
        id: t,
        searchText: e,
        fields: v,
        ...l || {}
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), C(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, h.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const r = this._searchTerm, a = r ? r.split(/\s+/).filter(Boolean) : [], n = this._filters || {}, t = Object.keys(n).length > 0;
      if (a.length === 0 && !t ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(e) {
        if (a.length > 0 && !a.every(function(v) {
          return e.searchText && e.searchText.indexOf(v) !== -1;
        }))
          return !1;
        if (t)
          for (const l in n) {
            const v = n[l];
            if (v && v.length > 0) {
              const w = e.fields && e.fields[l] !== void 0 ? e.fields[l] : e[l] !== void 0 ? e[l] : null, E = w != null ? String(w).toLowerCase() : "";
              if (v.indexOf(E) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const e = this._sortField, l = this._sortDir === "desc" ? -1 : 1, v = typeof Intl < "u" ? new Intl.Collator(Q(this.dom), { sensitivity: "base" }) : null, w = this._filteredData.map(function(S) {
          return S.fields && S.fields[e] !== void 0 ? S.fields[e] : S[e];
        }), E = Ae(w);
        this._filteredData.sort(function(S, L) {
          const x = S.fields && S.fields[e] !== void 0 ? S.fields[e] : S[e], k = L.fields && L.fields[e] !== void 0 ? L.fields[e] : L[e];
          return Se(x, k, E, v) * l;
        });
      }
    }
  }, h.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const r = this._lastTotal, a = this.visibleCount;
        if (r === 0 || this._filteredData.length === 0 || a === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const r = this._filteredData.length;
        r === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : r > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, h.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const r = this._filteredData, a = document.createDocumentFragment();
      for (let t = 0; t < r.length; t++) {
        const e = this._buildItem(r[t]);
        e && a.appendChild(e);
      }
      const n = _(this);
      this.tbody.replaceChildren(a), c(n), this._selectable && this._updateSelectAll();
    } else {
      const r = [], a = this._filteredData;
      for (let t = 0; t < a.length; t++) r.push(a[t].html);
      const n = _(this);
      this.tbody.innerHTML = r.join(""), c(n), this._selectable && this._restoreSelection();
    }
  }, h.prototype._readGridLayout = function() {
    const r = getComputedStyle(this.tbody), a = r.gridTemplateColumns;
    let n = 1;
    if (a && a !== "none") {
      const e = a.trim().split(/\s+/).filter(Boolean);
      e.length > 0 && (n = e.length);
    }
    const t = parseFloat(r.rowGap);
    return { columns: n, rowGap: isNaN(t) ? 0 : t };
  }, h.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const r = this._cache.peek(), a = r ? this._buildItem(r) : this._buildPlaceholderItem();
      a && (this.tbody.textContent = "", this.tbody.appendChild(a), this._itemHeight = p(a) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const r = this._buildItem(this._data[0]);
        r && (this.tbody.textContent = "", this.tbody.appendChild(r), this._itemHeight = p(r) || 50, this.tbody.textContent = "");
      }
    } else {
      const r = this.tbody.children;
      r.length > 0 && (this._itemHeight = p(r[0]) || 50);
    }
  }, h.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const r = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = d(this.dom);
    const a = this._scrollContainer || window;
    this._scrollHandler = function() {
      r._rafId || (r._rafId = requestAnimationFrame(function() {
        r._rafId = null, r._windowed ? r._renderWindowed() : r._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      r._itemHeight = 0, r._measureItemHeight(), r._vStart = -1, r._vEnd = -1, r._windowed ? r._renderWindowed() : r._renderVirtual();
    }, a.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, h.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, h.prototype._renderVirtual = function() {
    const r = this._filteredData, a = r.length, n = this._itemHeight;
    if (!n || !a) return;
    const t = this._scrollContainer;
    let e, l;
    if (t) {
      const U = this.tbody.getBoundingClientRect(), B = t.getBoundingClientRect(), K = t === this.tbody ? 0 : U.top - B.top + t.scrollTop;
      e = t.scrollTop - K, l = t.clientHeight;
    } else {
      const B = this.tbody.getBoundingClientRect().top + window.scrollY;
      e = window.scrollY - B, l = window.innerHeight;
    }
    const v = this._readGridLayout(), w = v.columns, E = v.rowGap, S = n + E, L = Math.ceil(a / w);
    let x = Math.max(0, Math.floor(e / S) - 15);
    x = Math.min(x, L);
    const k = Math.ceil(l / S) + 30, q = Math.min(x + k, L), O = Math.min(x * w, a), F = Math.min(q * w, a);
    if (O === this._vStart && F === this._vEnd) return;
    this._vStart = O, this._vEnd = F;
    const P = x * S, V = (L - q) * S;
    if (this.isDataDriven) {
      const U = document.createDocumentFragment();
      if (P > 0) {
        const K = document.createElement(this.isUl ? "li" : "div");
        K.className = "ln-list__spacer", K.setAttribute("aria-hidden", "true"), K.style.height = P + "px", U.appendChild(K);
      }
      for (let K = O; K < F; K++) {
        const rt = this._buildItem(r[K]);
        rt && U.appendChild(rt);
      }
      if (V > 0) {
        const K = document.createElement(this.isUl ? "li" : "div");
        K.className = "ln-list__spacer", K.setAttribute("aria-hidden", "true"), K.style.height = V + "px", U.appendChild(K);
      }
      const B = _(this);
      this.tbody.replaceChildren(U), c(B), this._selectable && this._updateSelectAll();
    } else {
      let U = "";
      P > 0 && (U += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${P}px"></${this.isUl ? "li" : "div"}>`);
      for (let K = O; K < F; K++)
        U += r[K].html;
      V > 0 && (U += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${V}px"></${this.isUl ? "li" : "div"}>`);
      const B = _(this);
      this.tbody.innerHTML = U, c(B), this._selectable && this._restoreSelection();
    }
  }, h.prototype._buildPlaceholderItem = function() {
    const r = document.createElement(this.isUl ? "li" : "div");
    return r.className = "ln-list__placeholder", r.setAttribute("aria-hidden", "true"), r.style.height = this._itemHeight + "px", r;
  }, h.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const r = this._itemHeight;
    if (!r) return;
    const a = this._scrollContainer;
    let n, t;
    if (a) {
      const B = this.tbody.getBoundingClientRect(), K = a.getBoundingClientRect(), rt = a === this.tbody ? 0 : B.top - K.top + a.scrollTop;
      n = a.scrollTop - rt, t = a.clientHeight;
    } else {
      const K = this.tbody.getBoundingClientRect().top + window.scrollY;
      n = window.scrollY - K, t = window.innerHeight;
    }
    const e = this._readGridLayout(), l = e.columns, v = e.rowGap, w = r + v, E = this._cache.logicalTotal, S = Math.ceil(E / l);
    let L = Math.max(0, Math.floor(n / w) - 15);
    L = Math.min(L, S);
    const x = Math.ceil(t / w) + 30, k = Math.min(L + x, S), q = Math.min(L * l, E), O = Math.min(k * l, E), F = L * w, P = (S - k) * w, V = document.createDocumentFragment();
    if (F > 0) {
      const B = document.createElement(this.isUl ? "li" : "div");
      B.className = "ln-list__spacer", B.setAttribute("aria-hidden", "true"), B.style.height = F + "px", V.appendChild(B);
    }
    for (let B = q; B < O; B++)
      if (this._cache.has(B)) {
        const K = this._buildItem(this._cache.get(B));
        K && V.appendChild(K);
      } else
        V.appendChild(this._buildPlaceholderItem());
    if (P > 0) {
      const B = document.createElement(this.isUl ? "li" : "div");
      B.className = "ln-list__spacer", B.setAttribute("aria-hidden", "true"), B.style.height = P + "px", V.appendChild(B);
    }
    const U = _(this);
    this.tbody.replaceChildren(V), c(U), this._vStart = q, this._vEnd = O, this._cache.ensure(q, O);
  }, h.prototype._showEmptyState = function() {
    let r = null;
    if (this.isDataDriven) {
      const a = this._lastTotal != null ? this._lastTotal : this._data.length, t = this.visibleCount === 0 && a > 0, e = t ? this.name + "-empty-filtered" : this.name + "-empty";
      if (r = ft(this.dom, e, "ln-list"), !r) {
        const l = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (l) {
          const v = t ? "search" : "initial", w = l.content.querySelector(`[data-ln-empty-when="${v}"]`) || l.content.firstElementChild;
          w && (r = document.importNode(w, !0));
        }
      }
    } else {
      const a = this.dom.querySelector(`template[${b}]`);
      if (a) {
        const n = a.content.firstElementChild;
        n && (r = document.importNode(n, !0));
      }
    }
    if (r)
      if (r.tagName === "LI" || r.tagName === "TR")
        this.tbody.replaceChildren(r);
      else {
        const a = document.createElement(this.isUl ? "li" : "div");
        a.appendChild(r), this.tbody.replaceChildren(a);
      }
    else
      this.tbody.replaceChildren();
    C(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, h.prototype._buildItem = function(r) {
    let a = ft(this.dom, this.name + "-row", "ln-list");
    if (!a) {
      const t = this.dom.querySelector("template[data-ln-item]");
      t && (a = document.importNode(t.content, !0));
    }
    let n = a ? a.querySelector("[data-ln-item]") || a.firstElementChild : null;
    if (n)
      xt(n, r), nt(n, r);
    else if (r && r.html) {
      const t = document.createElement(this.isUl ? "ul" : "div");
      t.innerHTML = r.html, n = t.firstElementChild;
    } else if (n = document.createElement(this.isUl ? "li" : "div"), n.setAttribute("data-ln-item", ""), r && typeof r == "object") {
      for (const t in r)
        if (t !== "html" && r[t] != null) {
          const e = document.createElement("span");
          e.setAttribute("data-ln-field", t), e.textContent = String(r[t]), n.appendChild(e);
        }
    }
    if (n._lnRecord = r, r && r.id != null && (n.setAttribute("data-ln-item-id", r.id), this._selectable && this.selectedIds.has(String(r.id)))) {
      n.classList.add("ln-item-selected");
      const t = n.querySelector("[data-ln-item-select]");
      t && (t.checked = !0);
    }
    return n;
  }, h.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const r = this.tbody.querySelectorAll("[data-ln-item]");
    for (let a = 0; a < r.length; a++) {
      const n = r[a].getAttribute("data-ln-item-id"), t = n != null && this.selectedIds.has(String(n));
      r[a].classList.toggle("ln-item-selected", t);
      const e = r[a].querySelector("[data-ln-item-select]");
      e && (e.checked = t);
    }
    this._updateSelectAll();
  }, h.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const r = this;
    this._onSelectionChange = function(a) {
      const n = a.target.closest("[data-ln-item-select]");
      if (!n) return;
      const t = n.closest("[data-ln-item]");
      if (!t) return;
      const e = t.getAttribute("data-ln-item-id");
      e != null && (n.checked ? (r.selectedIds.add(String(e)), t.classList.add("ln-item-selected")) : (r.selectedIds.delete(String(e)), t.classList.remove("ln-item-selected")), r._updateSelectAll(), r._updateFooter(), C(r.dom, "ln-list:select", {
        list: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const a = r._selectAllCheckbox.checked, n = r.tbody.querySelectorAll("[data-ln-item]");
      for (let t = 0; t < n.length; t++) {
        const e = n[t], l = e.getAttribute("data-ln-item-id"), v = e.querySelector("[data-ln-item-select]");
        l != null && (a ? (r.selectedIds.add(String(l)), e.classList.add("ln-item-selected")) : (r.selectedIds.delete(String(l)), e.classList.remove("ln-item-selected")), v && (v.checked = a));
      }
      C(r.dom, "ln-list:select-all", { list: r.name, selected: a }), C(r.dom, "ln-list:select", {
        list: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedIds.size
      }), r._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, h.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const r = this.tbody.querySelectorAll("[data-ln-item]");
    let a = r.length > 0;
    for (let n = 0; n < r.length; n++) {
      const t = r[n].getAttribute("data-ln-item-id");
      if (t != null && !this.selectedIds.has(String(t))) {
        a = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = a;
  }, h.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Ce(this, "ln-list:request-data", "list");
  }, h.prototype._enterWindowedMode = function() {
    const r = this, a = this.dom, n = parseInt(a.getAttribute("data-ln-list-window"), 10), t = parseInt(a.getAttribute("data-ln-list-window-page"), 10), e = parseInt(a.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !r._windowed || !r._cache || (r.totalCount = r._cache.grandTotal, r.visibleCount = r._cache.logicalTotal, r._lastTotal = r._cache.grandTotal, r.isLoaded = !0, r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), C(a, "ln-list:rendered", {
        list: r.name,
        total: r.totalCount,
        visible: r.visibleCount
      }));
    }, this._renderBatch = ne(this._onCacheChange), this._cache = Me({
      windowSize: n > 0 ? n : 1e3,
      pageSize: t > 0 ? t : 200,
      threshold: e >= 0 ? e : 25,
      fetchDebounce: 120,
      requestPage: function(l, v, w) {
        C(a, "ln-list:request-data", {
          list: r.name,
          sort: l.sort,
          filters: l.filters,
          search: l.search,
          offset: v,
          limit: w,
          queryGen: r._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, h.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const r = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), a = r > 0 ? r : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: a,
        filtered: a
      });
    } else
      this.dom.classList.add("ln-list--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, h.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, h.prototype._updateFooter = function() {
    let r = 0, a = 0;
    this.isDataDriven ? (r = this._lastTotal != null ? this._lastTotal : this._data.length, a = this.visibleCount) : (r = this._data.length, a = this._filteredData.length);
    const n = a < r;
    if (this._totalSpan && (this._totalSpan.textContent = u(r, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = n ? u(a, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !n), this._selectedSpan) {
      const t = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = t > 0 ? u(t, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", t === 0);
    }
  }, h.prototype.destroy = function() {
    this.dom[i] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[i]);
  }, H(o, i, h, "ln-list", {
    extraAttributes: [
      "data-ln-list-window",
      "data-ln-list-window-page",
      "data-ln-list-window-threshold",
      "data-ln-list-count"
    ],
    onAttributeChange: function(r, a) {
      const n = r[i];
      if (!(!n || !n.isDataDriven)) {
        if (a === "data-ln-list-window") {
          const t = r.hasAttribute("data-ln-list-window");
          if (t && !n._windowed)
            n._enterWindowedMode(), n._kickWindowInitial();
          else if (!t && n._windowed)
            n._exitWindowedMode();
          else if (t && n._windowed) {
            const e = parseInt(r.getAttribute("data-ln-list-window"), 10);
            e > 0 && n._cache.configure({ windowSize: e });
          }
          return;
        }
        if (!(!n._windowed || !n._cache)) {
          if (a === "data-ln-list-window-page") {
            const t = parseInt(r.getAttribute("data-ln-list-window-page"), 10);
            t > 0 && n._cache.configure({ pageSize: t });
          } else if (a === "data-ln-list-window-threshold") {
            const t = parseInt(r.getAttribute("data-ln-list-window-threshold"), 10);
            t >= 0 && n._cache.configure({ threshold: t });
          } else if (a === "data-ln-list-count") {
            const t = parseInt(r.getAttribute("data-ln-list-count"), 10);
            t >= 0 && n._cache.setGrandTotal(t);
          }
        }
      }
    }
  });
})();
(function() {
  const o = "data-ln-circular-progress", i = "lnCircularProgress";
  if (window[i] !== void 0) return;
  const b = "http://www.w3.org/2000/svg", y = 36, m = 16, g = 2 * Math.PI * m;
  function f(_) {
    return this.dom = _, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, u.call(this), d.call(this), this;
  }
  f.prototype.destroy = function() {
    this.dom[i] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("role"), this.dom.removeAttribute("aria-valuemin"), this.dom.removeAttribute("aria-valuemax"), this.dom.removeAttribute("aria-valuenow"), this.dom.removeAttribute("aria-valuetext"), delete this.dom[i]);
  };
  function s(_, c) {
    const p = document.createElementNS(b, _);
    for (const h in c)
      p.setAttribute(h, c[h]);
    return p;
  }
  function u() {
    this.svg = s("svg", {
      viewBox: "0 0 " + y + " " + y,
      "aria-hidden": "true"
    }), this.trackCircle = s("circle", {
      cx: y / 2,
      cy: y / 2,
      r: m,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = s("circle", {
      cx: y / 2,
      cy: y / 2,
      r: m,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": g,
      "stroke-dashoffset": g,
      transform: "rotate(-90 " + y / 2 + " " + y / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function d() {
    const _ = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, c = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let p = c > 0 ? _ / c * 100 : 0;
    p < 0 && (p = 0), p > 100 && (p = 100);
    const h = g - p / 100 * g;
    this.progressCircle.setAttribute("stroke-dashoffset", h);
    const r = this.dom.getAttribute("data-ln-circular-progress-label"), a = r !== null ? r : Math.round(p) + "%";
    this.labelEl.textContent = a, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(c));
    const n = Math.max(0, Math.min(_, c));
    this.dom.setAttribute("aria-valuenow", String(n)), this.dom.setAttribute("aria-valuetext", a), C(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: _,
      max: c,
      percentage: p
    });
  }
  H(o, i, f, "ln-circular-progress", {
    extraAttributes: ["data-ln-circular-progress-max", "data-ln-circular-progress-label"],
    onAttributeChange: function(_) {
      const c = _[i];
      c && d.call(c);
    }
  });
})();
(function() {
  const o = "data-ln-sortable", i = "lnSortable", b = "data-ln-sortable-handle";
  if (window[i] !== void 0) return;
  function y(g) {
    this.dom = g, this.isEnabled = g.getAttribute(o) !== "disabled", this._dragging = null, g.setAttribute("aria-roledescription", "sortable list");
    const f = this;
    return this._onPointerDown = function(s) {
      f.isEnabled && f._handlePointerDown(s);
    }, g.addEventListener("pointerdown", this._onPointerDown), this;
  }
  y.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(o, "");
  }, y.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(o, "disabled");
  }, y.prototype.destroy = function() {
    this.dom[i] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), C(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[i]);
  }, y.prototype._handlePointerDown = function(g) {
    let f = g.target.closest("[" + b + "]"), s;
    if (f) {
      for (s = f; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + b + "]")) return;
      for (s = g.target; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
      f = s;
    }
    const d = Array.from(this.dom.children).indexOf(s);
    if (G(this.dom, "ln-sortable:before-drag", {
      item: s,
      index: d
    }).defaultPrevented) return;
    g.preventDefault(), f.setPointerCapture(g.pointerId), this._dragging = s, s.classList.add("ln-sortable--dragging"), s.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), C(this.dom, "ln-sortable:drag-start", {
      item: s,
      index: d
    });
    const c = this, p = function(r) {
      c._handlePointerMove(r);
    }, h = function(r) {
      c._handlePointerEnd(r), f.removeEventListener("pointermove", p), f.removeEventListener("pointerup", h), f.removeEventListener("pointercancel", h);
    };
    f.addEventListener("pointermove", p), f.addEventListener("pointerup", h), f.addEventListener("pointercancel", h);
  }, y.prototype._handlePointerMove = function(g) {
    if (!this._dragging) return;
    const f = Array.from(this.dom.children), s = this._dragging;
    for (const u of f)
      u.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const u of f) {
      if (u === s) continue;
      const d = u.getBoundingClientRect(), _ = d.top + d.height / 2;
      if (g.clientY >= d.top && g.clientY < _) {
        u.classList.add("ln-sortable--drop-before");
        break;
      } else if (g.clientY >= _ && g.clientY <= d.bottom) {
        u.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, y.prototype._handlePointerEnd = function(g) {
    if (!this._dragging) return;
    const f = this._dragging, s = Array.from(this.dom.children), u = s.indexOf(f);
    let d = null, _ = null;
    for (const c of s) {
      if (c.classList.contains("ln-sortable--drop-before")) {
        d = c, _ = "before";
        break;
      }
      if (c.classList.contains("ln-sortable--drop-after")) {
        d = c, _ = "after";
        break;
      }
    }
    for (const c of s)
      c.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (f.classList.remove("ln-sortable--dragging"), f.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), d && d !== f) {
      _ === "before" ? this.dom.insertBefore(f, d) : this.dom.insertBefore(f, d.nextElementSibling);
      const p = Array.from(this.dom.children).indexOf(f);
      C(this.dom, "ln-sortable:reordered", {
        item: f,
        oldIndex: u,
        newIndex: p
      });
    }
    this._dragging = null;
  };
  function m(g) {
    const f = g[i];
    if (!f) return;
    const s = g.getAttribute(o) !== "disabled";
    s !== f.isEnabled && (f.isEnabled = s, C(g, s ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: g }));
  }
  H(o, i, y, "ln-sortable", {
    onAttributeChange: m
  });
})();
(function() {
  const o = "data-ln-confirm", i = "lnConfirm", b = "data-ln-confirm-timeout";
  if (window[i] !== void 0) return;
  function m(f) {
    const s = parseFloat(f.getAttribute(b));
    return isNaN(s) || s <= 0 ? 3 : s;
  }
  function g(f) {
    this.dom = f, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = f.querySelector("[data-ln-confirm-idle]"), this.activeEl = f.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = f.textContent.trim(), this.confirmText = f.getAttribute(o) || "Confirm?");
    const s = this;
    return this._onClick = function(u) {
      if (!Le(u))
        if (!s.confirming)
          u.preventDefault(), u.stopImmediatePropagation(), s._enterConfirm();
        else {
          if (s._submitted) return;
          s._submitted = !0, u.stopPropagation(), s._reset();
        }
    }, f.addEventListener("click", this._onClick), this;
  }
  g.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const f = this.activeEl ? this.activeEl.textContent.trim() : "";
      f && (this.dom.setAttribute("aria-label", f), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const f = this.dom.querySelector("svg.ln-icon use");
      f && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = f.getAttribute("href"), f.setAttribute("href", "#ln-icon-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.dom.setAttribute("aria-label", this.confirmText), this.dom.setAttribute("aria-live", "polite")) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), C(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, g.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const f = this, s = m(this.dom) * 1e3;
    this.revertTimer = setTimeout(function() {
      f._reset();
    }, s);
  }, g.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const f = this.dom.querySelector("svg.ln-icon use");
      f && this.originalIconHref && f.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, g.prototype.destroy = function() {
    this.dom[i] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[i], C(this.dom, "ln-confirm:destroyed", { target: this.dom }));
  }, H(o, i, g, "ln-confirm");
})();
(function() {
  const o = "data-ln-translations", i = "lnTranslations";
  if (window[i] !== void 0) return;
  const b = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function y(m) {
    this.dom = m, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = m.getAttribute(o + "-default") || "", this.placeholderLabel = m.getAttribute(o + "-placeholder") || "{lang} translation", this.removeLabel = m.getAttribute(o + "-remove-label") || "Remove {lang}", this.badgesEl = m.querySelector("[" + o + "-active]"), this.menuEl = m.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const g = m.getAttribute(o + "-locales");
    if (this.locales = b, g)
      try {
        this.locales = JSON.parse(g);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const f = this;
    return this._onRequestAdd = function(s) {
      s.detail && s.detail.lang && f.addLanguage(s.detail.lang);
    }, this._onRequestRemove = function(s) {
      s.detail && s.detail.lang && f.removeLanguage(s.detail.lang);
    }, m.addEventListener("ln-translations:request-add", this._onRequestAdd), m.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  y.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const m = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const g of m) {
      const f = g.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const s of f)
        s.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, y.prototype._detectExisting = function() {
    const m = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const g of m) {
      const f = g.getAttribute("data-ln-translatable-lang");
      f && f !== this.defaultLang && this.activeLanguages.add(f);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, y.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const m = this;
    let g = 0;
    for (const s in this.locales) {
      if (!this.locales.hasOwnProperty(s) || this.activeLanguages.has(s)) continue;
      g++;
      const u = Rt("ln-translations-menu-item", "ln-translations");
      if (!u) return;
      const d = u.querySelector("[data-ln-translations-lang]");
      d.setAttribute("data-ln-translations-lang", s), d.textContent = this.locales[s], d.addEventListener("click", function(_) {
        _.ctrlKey || _.metaKey || _.button === 1 || (_.preventDefault(), _.stopPropagation(), m.menuEl.getAttribute("data-ln-toggle") === "open" && m.menuEl.setAttribute("data-ln-toggle", "close"), m.addLanguage(s));
      }), this.menuEl.appendChild(u);
    }
    const f = this.dom.querySelector("[" + o + "-add]");
    f && (f.hidden = g === 0);
  }, y.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const m = this;
    this.activeLanguages.forEach(function(g) {
      const f = Rt("ln-translations-badge", "ln-translations");
      if (!f) return;
      const s = f.querySelector("[data-ln-translations-lang]");
      s.setAttribute("data-ln-translations-lang", g);
      const u = s.querySelector("span");
      u.textContent = m.locales[g] || g.toUpperCase();
      const d = s.querySelector("button"), _ = m.locales[g] || g.toUpperCase();
      d.setAttribute("aria-label", m.removeLabel.replace("{lang}", _)), d.addEventListener("click", function(c) {
        c.ctrlKey || c.metaKey || c.button === 1 || (c.preventDefault(), c.stopPropagation(), m.removeLanguage(g));
      }), m.badgesEl.appendChild(f);
    });
  }, y.prototype.addLanguage = function(m, g) {
    if (this.activeLanguages.has(m)) return;
    const f = this.locales[m] || m;
    if (G(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: m,
      langName: f
    }).defaultPrevented) return;
    this.activeLanguages.add(m), g = g || {};
    const u = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const d of u) {
      const _ = d.getAttribute("data-ln-translatable"), c = d.getAttribute("data-ln-translations-prefix") || "", p = d.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!p) continue;
      const h = p.cloneNode(p.tagName === "SELECT");
      c ? h.name = c + "[trans][" + m + "][" + _ + "]" : h.name = "trans[" + m + "][" + _ + "]", h.value = g[_] !== void 0 ? g[_] : "", h.removeAttribute("id"), "placeholder" in h && (h.placeholder = this.placeholderLabel.replace("{lang}", f)), h.setAttribute("data-ln-translatable-lang", m);
      const r = d.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), a = r.length > 0 ? r[r.length - 1] : p;
      a.parentNode.insertBefore(h, a.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), C(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: m,
      langName: f
    });
  }, y.prototype.removeLanguage = function(m) {
    if (!this.activeLanguages.has(m) || G(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: m
    }).defaultPrevented) return;
    const f = this.dom.querySelectorAll('[data-ln-translatable-lang="' + m + '"]');
    for (const s of f)
      s.parentNode.removeChild(s);
    this.activeLanguages.delete(m), this._updateDropdown(), this._updateBadges(), C(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: m
    });
  }, y.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, y.prototype.hasLanguage = function(m) {
    return this.activeLanguages.has(m);
  }, y.prototype.destroy = function() {
    if (!this.dom[i]) return;
    const m = this.defaultLang, g = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const f of g)
      f.getAttribute("data-ln-translatable-lang") !== m && f.parentNode.removeChild(f);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[i];
  }, H(o, i, y, "ln-translations");
})();
(function() {
  const o = "data-ln-autosave", i = "lnAutosave", b = "data-ln-autosave-clear", y = "data-ln-autosave-debounce-input", m = '[data-ln-autosave-exclude], input[type="password"]', g = "ln-autosave:";
  if (window[i] !== void 0) return;
  function s(c) {
    const p = u(c);
    if (!p) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", c);
      return;
    }
    this.dom = c, this.key = p;
    let h = null;
    function r() {
      const e = qe(c, { exclude: m });
      try {
        localStorage.setItem(p, JSON.stringify(e));
      } catch {
        return;
      }
      C(c, "ln-autosave:saved", { target: c, data: e });
    }
    function a() {
      let e;
      try {
        e = localStorage.getItem(p);
      } catch {
        return;
      }
      if (!e) return;
      let l;
      try {
        l = JSON.parse(e);
      } catch {
        return;
      }
      if (G(c, "ln-autosave:before-restore", { target: c, data: l }).defaultPrevented) return;
      const w = xe(c, l);
      for (let E = 0; E < w.length; E++)
        w[E].dispatchEvent(new Event("input", { bubbles: !0 })), w[E].dispatchEvent(new Event("change", { bubbles: !0 }));
      C(c, "ln-autosave:restored", { target: c, data: l });
    }
    function n() {
      try {
        localStorage.removeItem(p);
      } catch {
        return;
      }
      C(c, "ln-autosave:cleared", { target: c });
    }
    this._onFocusout = function(e) {
      const l = e.target;
      d(l) && l.name && !l.matches(m) && r();
    }, this._onChange = function(e) {
      const l = e.target;
      d(l) && l.name && !l.matches(m) && r();
    }, this._onSubmit = function() {
      n();
    }, this._onReset = function() {
      n();
    }, this._onClearClick = function(e) {
      e.target.closest("[" + b + "]") && n();
    }, c.addEventListener("focusout", this._onFocusout), c.addEventListener("change", this._onChange), c.addEventListener("submit", this._onSubmit), c.addEventListener("reset", this._onReset), c.addEventListener("click", this._onClearClick);
    const t = _(c);
    return t > 0 && (this._onInput = function(e) {
      const l = e.target;
      !d(l) || !l.name || l.matches(m) || (h !== null && clearTimeout(h), h = setTimeout(r, t));
    }, c.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return h;
    }, a(), this;
  }
  s.prototype.destroy = function() {
    if (this.dom[i]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const c = this._getInputTimer();
        c !== null && clearTimeout(c);
      }
      C(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[i];
    }
  };
  function u(c) {
    const h = c.getAttribute(o) || c.id;
    return h ? g + window.location.pathname + ":" + h : null;
  }
  function d(c) {
    const p = c.tagName;
    return p === "INPUT" || p === "TEXTAREA" || p === "SELECT";
  }
  function _(c) {
    if (!c.hasAttribute(y)) return 0;
    const p = c.getAttribute(y);
    if (p === "" || p === null) return 1e3;
    const h = parseInt(p, 10);
    return isNaN(h) || h < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", c), 1e3) : h;
  }
  H(o, i, s, "ln-autosave");
})();
(function() {
  const o = "data-ln-autoresize", i = "lnAutoresize";
  if (window[i] !== void 0) return;
  function b(y) {
    if (y.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", y.tagName), this;
    this.dom = y;
    const m = this;
    return this._onInput = function() {
      m._resize();
    }, y.addEventListener("input", this._onInput), this._resize(), this;
  }
  b.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, b.prototype.destroy = function() {
    this.dom[i] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[i]);
  }, H(o, i, b, "ln-autoresize");
})();
(function() {
  const o = "data-ln-editor", i = "lnEditor";
  if (window[i] !== void 0) return;
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
  }, m = {
    "heading-2": "h2",
    "heading-3": "h3",
    "heading-4": "h4",
    blockquote: "blockquote",
    code: "pre",
    paragraph: "p"
  }, g = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let f = 0;
  function s(n) {
    return !!(y[n] || m[n] || g[n] || n === "link");
  }
  function u(n) {
    this.dom = n;
    const t = this;
    if (this._textarea = n.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", n), this;
    const e = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), e && this._surface.setAttribute("data-placeholder", e);
    const l = this._textarea.id;
    if (l) {
      const S = n.querySelector('label[for="' + l + '"]');
      S && (S.id || (S.id = l + "-label"), this._surface.setAttribute("aria-labelledby", S.id));
    }
    this._surface.id = l ? l + "-surface" : "ln-editor-surface-" + ++f;
    const v = this._textarea.value.trim();
    v && (this._surface.innerHTML = v);
    const w = n.querySelector('[role="toolbar"]');
    if (w && w.nextSibling ? n.insertBefore(this._surface, w.nextSibling) : n.appendChild(this._surface), w) {
      w.setAttribute("aria-controls", this._surface.id);
      const S = w.querySelectorAll("[data-ln-editor-action]");
      for (let L = 0; L < S.length; L++) {
        const x = S[L].getAttribute("data-ln-editor-action");
        s(x) && S[L].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      t._syncToTextarea(), C(t.dom, "ln-editor:changed", {
        html: t._textarea.value,
        target: t.dom
      });
    }, this._onMousedownToolbar = function(S) {
      S.target.closest("[data-ln-editor-action]") && S.preventDefault();
    }, this._onClickToolbar = function(S) {
      const L = S.target.closest("[data-ln-editor-action]");
      if (!L) return;
      const x = L.getAttribute("data-ln-editor-action");
      t._execAction(x);
    }, this._onPaste = function(S) {
      c(t, S);
    }, this._onKeydown = function(S) {
      r(t, S);
    }, this._onSelectionChange = function() {
      document.contains(t._surface) && t._updateActiveStates();
    }, this._onFocus = function() {
      C(t.dom, "ln-editor:focus", { target: t.dom });
    }, this._onBlur = function() {
      t._syncToTextarea(), C(t.dom, "ln-editor:blur", { target: t.dom });
    }, this._onTextareaInput = function() {
      t._surface.innerHTML !== t._textarea.value && (t._surface.innerHTML = t._textarea.value, C(t.dom, "ln-editor:changed", {
        html: t._textarea.value,
        target: t.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), w && (w.addEventListener("mousedown", this._onMousedownToolbar), w.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(S) {
      const L = S.detail && S.detail.html;
      L !== void 0 && (t._surface.innerHTML = L, t._syncToTextarea(), C(t.dom, "ln-editor:changed", {
        html: t._textarea.value,
        target: t.dom
      }));
    }, n.addEventListener("ln-editor:set-content", this._onSetContent);
    const E = this._textarea.form;
    return E && (this._onFormReset = function() {
      setTimeout(function() {
        t._surface.innerHTML = t._textarea.value, C(n, "ln-editor:changed", {
          html: t._textarea.value,
          target: n
        });
      }, 0);
    }, E.addEventListener("reset", this._onFormReset)), this;
  }
  u.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, u.prototype._execAction = function(n) {
    if (!(!n || G(this.dom, "ln-editor:before-change", {
      action: n,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), y[n])
        document.execCommand(y[n], !1, null);
      else if (m[n]) {
        const e = m[n], l = d(this._surface);
        l && l.toLowerCase() === e ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + e + ">");
      } else g[n] ? document.execCommand(g[n], !1, null) : n === "link" ? a(this) : n === "unlink" ? document.execCommand("unlink", !1, null) : n === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, u.prototype._updateActiveStates = function() {
    const n = this.dom.querySelector('[role="toolbar"]');
    if (!n) return;
    const t = window.getSelection();
    if (!t || t.rangeCount === 0) return;
    const e = t.anchorNode;
    if (!e || !this._surface.contains(e)) return;
    const l = n.querySelectorAll("[data-ln-editor-action]");
    for (let v = 0; v < l.length; v++) {
      const w = l[v], E = w.getAttribute("data-ln-editor-action");
      let S = !1;
      if (y[E])
        try {
          S = document.queryCommandState(y[E]);
        } catch {
        }
      else if (m[E]) {
        const L = d(this._surface);
        S = L && L.toLowerCase() === m[E];
      } else if (g[E])
        try {
          S = document.queryCommandState(g[E]);
        } catch {
        }
      else E === "link" && (S = !!_(t.anchorNode, "A", this._surface));
      s(E) && w.setAttribute("aria-pressed", String(S)), S ? w.classList.add("ln-editor-active") : w.classList.remove("ln-editor-active");
    }
  }, u.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, u.prototype.setHTML = function(n) {
    this._surface && (this._surface.innerHTML = n, this._syncToTextarea(), C(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, u.prototype.destroy = function() {
    if (!this.dom[i]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const n = this.dom.querySelector('[role="toolbar"]');
    n && (n.removeEventListener("mousedown", this._onMousedownToolbar), n.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const t = this._textarea ? this._textarea.form : null;
    if (t && this._onFormReset && t.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const e = this.dom.querySelector(".ln-editor__link-popover");
      e && e.remove();
    }
    C(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[i];
  };
  function d(n) {
    const t = window.getSelection();
    if (!t || t.rangeCount === 0) return null;
    let e = t.anchorNode;
    if (!e) return null;
    for (; e && e !== n; ) {
      if (e.nodeType === 1) {
        const l = e.tagName;
        if (l === "H2" || l === "H3" || l === "H4" || l === "BLOCKQUOTE" || l === "PRE" || l === "P")
          return l;
      }
      e = e.parentNode;
    }
    return null;
  }
  function _(n, t, e) {
    for (; n && n !== e; ) {
      if (n.nodeType === 1 && n.tagName === t)
        return n;
      n = n.parentNode;
    }
    return null;
  }
  function c(n, t) {
    t.preventDefault();
    let e = "";
    if (t.clipboardData && (e = t.clipboardData.getData("text/html"), !e)) {
      const v = t.clipboardData.getData("text/plain");
      v && (e = v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), e = "<p>" + e + "</p>");
    }
    if (!e) return;
    const l = p(e);
    l && document.execCommand("insertHTML", !1, l);
  }
  function p(n) {
    const t = document.createElement("div");
    return t.innerHTML = n, h(t), t.innerHTML;
  }
  function h(n) {
    const t = Array.from(n.childNodes);
    for (let e = 0; e < t.length; e++) {
      const l = t[e];
      if (l.nodeType !== 3) {
        if (l.nodeType !== 1) {
          n.removeChild(l);
          continue;
        }
        if (b[l.tagName]) {
          const v = Array.from(l.attributes);
          for (let w = 0; w < v.length; w++) {
            const E = v[w].name;
            if (l.tagName === "A" && E === "href") {
              const S = l.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(S) || l.removeAttribute("href");
            } else
              l.removeAttribute(E);
          }
          l.tagName === "A" && l.setAttribute("rel", "noopener noreferrer"), h(l);
        } else {
          for (; l.firstChild; )
            n.insertBefore(l.firstChild, l);
          n.removeChild(l);
        }
      }
    }
  }
  function r(n, t) {
    if (!(t.ctrlKey || t.metaKey)) return;
    let e = null;
    switch (t.key.toLowerCase()) {
      case "b":
        e = "bold";
        break;
      case "i":
        e = "italic";
        break;
      case "u":
        e = "underline";
        break;
      case "k":
        e = "link";
        break;
    }
    e && (t.preventDefault(), n._execAction(e));
  }
  function a(n) {
    const t = window.getSelection();
    if (!t || t.rangeCount === 0) return;
    const e = _(t.anchorNode, "A", n._surface), l = t.getRangeAt(0).cloneRange();
    n._closeLinkPopover && n._closeLinkPopover();
    const v = ft(n.dom, "ln-editor-link-popover", "ln-editor");
    if (!v) return;
    const w = v.firstElementChild;
    if (!w) return;
    const E = w.querySelector('input[type="url"]'), S = w.querySelector('[data-ln-editor-action="confirm-link"]'), L = w.querySelector('[data-ln-editor-action="cancel-link"]');
    e && (E.value = e.getAttribute("href") || "");
    const x = n.dom.querySelector('[role="toolbar"]');
    x ? x.after(w) : n.dom.insertBefore(w, n._surface), E.focus();
    function k() {
      const U = window.getSelection();
      U.removeAllRanges(), U.addRange(l);
    }
    function q() {
      document.removeEventListener("mousedown", V), n._closeLinkPopover = null, w.remove();
    }
    function O() {
      const U = E.value.trim();
      if (q(), k(), n._surface.focus(), U)
        if (e)
          e.setAttribute("href", U), e.setAttribute("rel", "noopener noreferrer"), n._syncToTextarea(), C(n.dom, "ln-editor:changed", {
            html: n._textarea.value,
            target: n.dom
          });
        else {
          document.execCommand("createLink", !1, U);
          const B = window.getSelection();
          if (B && B.anchorNode) {
            const K = _(B.anchorNode, "A", n._surface);
            K && (K.setAttribute("rel", "noopener noreferrer"), n._syncToTextarea());
          }
        }
      else e && document.execCommand("unlink", !1, null);
    }
    function F() {
      q(), k(), n._surface.focus();
    }
    function P() {
      q();
    }
    function V(U) {
      const B = n.dom.contains(U.target) && U.target.closest('[data-ln-editor-action="link"]');
      !w.contains(U.target) && !B && P();
    }
    n._closeLinkPopover = q, S.addEventListener("click", O), L.addEventListener("click", F), E.addEventListener("keydown", function(U) {
      U.key === "Enter" ? (U.preventDefault(), O()) : U.key === "Escape" && (U.preventDefault(), F());
    }), document.addEventListener("mousedown", V);
  }
  H(o, i, u, "ln-editor");
})();
(function() {
  const o = "lnFill";
  if (window[o] !== void 0) return;
  const i = { lnFillForm: !0, lnFillStore: !0 };
  function b(m) {
    const g = {}, f = m.dataset;
    for (const s in f) {
      if (!s.startsWith("lnFill") || i[s]) continue;
      const u = s.slice(6);
      u && (g[u.charAt(0).toLowerCase() + u.slice(1)] = f[s]);
    }
    return g;
  }
  function y(m, g) {
    const f = window.CSS && CSS.escape ? CSS.escape(g) : g, s = document.querySelectorAll('[data-ln-fill-id="' + f + '"]');
    if (s.length === 0) return null;
    for (let u = 0; u < s.length; u++) {
      const d = s[u].getAttribute("data-ln-fill-form");
      if (d) {
        const _ = document.getElementById(d);
        if (_ && m.contains(_)) return s[u];
      }
    }
    return s[0];
  }
  document.addEventListener("click", function(m) {
    if (m.ctrlKey || m.metaKey || m.button === 1) return;
    const g = m.target.closest("[data-ln-fill-form]");
    if (!g) return;
    const f = g.getAttribute("href");
    if (f && f.indexOf("#") !== -1) return;
    const s = g.getAttribute("data-ln-fill-form"), u = document.getElementById(s);
    if (!u) return;
    const d = b(g), _ = Object.keys(d).length > 0;
    window.lnCore.lnFill(u, _ ? d : null);
  }), document.addEventListener("ln-fill:request", function(m) {
    const g = m.detail;
    if (!g) return;
    const f = m.target, s = g.id;
    if (s == null) {
      window.lnCore.lnFill(f, null);
      return;
    }
    const u = y(f, s);
    if (!u) return;
    const d = b(u);
    window.lnCore.lnFill(f, d);
  }), window[o] = !0;
})();
(function() {
  const o = "data-ln-slug-from", i = "lnSlug";
  if (window[i] !== void 0) return;
  function b(m) {
    return String(m).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function y(m) {
    if (m.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", m.tagName), this;
    const g = m.form;
    if (!g)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", m), this;
    const f = m.getAttribute(o), s = g.elements[f];
    if (!s)
      return console.warn('[ln-slug] Source field "' + f + '" not found in form:', m), this;
    if (typeof s.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + f + '" is a RadioNodeList (same-name group) — single source field required:', m), this;
    this.dom = m, this.source = s, this._pristine = m.value === "", this._mirroring = !1;
    const u = this;
    return this._onSource = function() {
      u._pristine && u._mirror();
    }, this._onSlug = function() {
      u._mirroring || (u._pristine = u.dom.value === "");
    }, s.addEventListener("input", this._onSource), m.addEventListener("input", this._onSlug), this._pristine && s.value && s.value.trim() !== "" && this._mirror(), this;
  }
  y.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = b(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, y.prototype.destroy = function() {
    this.dom[i] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[i]);
  }, H(o, i, y, "ln-slug");
})();
(function() {
  const o = "data-ln-time", i = "lnTime";
  if (window[i] !== void 0) return;
  const b = {}, y = {};
  function m(w) {
    return w.getAttribute("data-ln-time-locale") || Q(w);
  }
  function g(w, E) {
    const S = (w || "") + "|" + JSON.stringify(E);
    return b[S] || (b[S] = new Intl.DateTimeFormat(w, E)), b[S];
  }
  function f(w) {
    const E = w || "";
    return y[E] || (y[E] = new Intl.RelativeTimeFormat(w, { numeric: "auto", style: "narrow" })), y[E];
  }
  const s = /* @__PURE__ */ new Set();
  let u = null;
  function d() {
    u || (u = setInterval(c, 6e4));
  }
  function _() {
    u && (clearInterval(u), u = null);
  }
  function c() {
    for (const w of s) {
      if (!document.body.contains(w.dom)) {
        s.delete(w);
        continue;
      }
      t(w);
    }
    s.size === 0 && _();
  }
  function p(w, E) {
    const S = Tt(E), L = (E || "").toLowerCase().split("-")[0], x = g(E, { dateStyle: "long", timeStyle: "short" }), k = x.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (S && k !== L && S.monthsLong) {
      const q = S.monthsLong[w.getMonth()], O = w.getDate(), F = w.getFullYear(), P = String(w.getHours()).padStart(2, "0"), V = String(w.getMinutes()).padStart(2, "0");
      return `${O} ${q} ${F} во ${P}:${V}`;
    }
    return x.format(w);
  }
  function h(w, E) {
    const S = /* @__PURE__ */ new Date(), L = { month: "short", day: "numeric" };
    w.getFullYear() !== S.getFullYear() && (L.year = "numeric");
    const x = Tt(E), k = (E || "").toLowerCase().split("-")[0], q = g(E, L), O = q.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (x && O !== k && x.monthsShort) {
      const F = x.monthsShort[w.getMonth()], P = w.getDate(), V = w.getFullYear() !== S.getFullYear() ? " " + w.getFullYear() : "";
      return `${P} ${F}${V}`;
    }
    return q.format(w);
  }
  function r(w, E) {
    return g(E, { dateStyle: "medium" }).format(w);
  }
  function a(w, E) {
    return g(E, { timeStyle: "short" }).format(w);
  }
  function n(w, E) {
    const S = Math.floor(Date.now() / 1e3), x = Math.floor(w.getTime() / 1e3) - S, k = Math.abs(x);
    if (k < 10) return f(E).format(0, "second");
    let q, O;
    if (k < 60)
      q = "second", O = x;
    else if (k < 3600)
      q = "minute", O = Math.round(x / 60);
    else if (k < 86400)
      q = "hour", O = Math.round(x / 3600);
    else if (k < 604800)
      q = "day", O = Math.round(x / 86400);
    else if (k < 2592e3)
      q = "week", O = Math.round(x / 604800);
    else
      return h(w, E);
    return f(E).format(O, q);
  }
  function t(w) {
    const E = w.dom.getAttribute("datetime");
    if (!E) return;
    const S = Number(E);
    if (isNaN(S)) return;
    const L = new Date(S * 1e3), x = w.dom.getAttribute(o) || "short", k = m(w.dom);
    let q;
    switch (x) {
      case "relative":
        q = n(L, k);
        break;
      case "full":
        q = p(L, k);
        break;
      case "date":
        q = r(L, k);
        break;
      case "time":
        q = a(L, k);
        break;
      default:
        q = h(L, k);
        break;
    }
    w.dom.textContent = q, x !== "full" && (w.dom.title = p(L, k));
  }
  function e(w) {
    this.dom = w;
    const E = this;
    return this._onLocaleChange = function() {
      t(E);
    }, Pt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), t(this), w.getAttribute(o) === "relative" && (s.add(this), d()), this;
  }
  e.prototype.render = function() {
    t(this);
  }, e.prototype.destroy = function() {
    this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), s.delete(this), s.size === 0 && _(), delete this.dom[i];
  };
  function l(w) {
    const E = w[i];
    if (!E) return;
    w.getAttribute(o) === "relative" ? (s.add(E), d()) : (s.delete(E), s.size === 0 && _()), t(E);
  }
  function v(w) {
    w.nodeType === 1 && w.hasAttribute && w.hasAttribute(o) && w[i] && t(w[i]);
  }
  H(o, i, e, "ln-time", {
    extraAttributes: ["datetime", "data-ln-time-locale", "lang"],
    onAttributeChange: l,
    onInit: v
  });
})();
function Zn(o = {}) {
  let i = o.windowSize > 0 ? o.windowSize : 1e3, b = o.pageSize > 0 ? o.pageSize : 200, y = o.fetchDebounce != null ? o.fetchDebounce : 120;
  const m = typeof o.requestPage == "function" ? o.requestPage : () => {
  }, g = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Set();
  let s = 0, u = 0, d = 0, _ = !1, c = null;
  function p(a, n) {
    g.delete(a), g.set(a, n);
  }
  function h() {
    if (g.size <= i) return [];
    const a = [];
    for (; g.size > i; ) {
      const t = g.keys().next().value;
      a.push(g.get(t)), g.delete(t);
    }
    const n = new Set(g.values());
    return a.filter((t) => !n.has(t));
  }
  function r(a, n) {
    f.add(a), clearTimeout(c), c = setTimeout(() => m(a, b, n), y);
  }
  return {
    get logicalTotal() {
      return s;
    },
    set logicalTotal(a) {
      s = a;
    },
    get grandTotal() {
      return u;
    },
    set grandTotal(a) {
      u = a;
    },
    get queryGen() {
      return d;
    },
    set queryGen(a) {
      d = a;
    },
    get size() {
      return g.size;
    },
    // Whether a server ordering exists for the current query at all — false
    // from reset() until the first ingest(). Distinct from a missing page.
    get hasLoaded() {
      return _;
    },
    getId: (a) => {
      if (!g.has(a)) return;
      const n = g.get(a);
      return p(a, n), n;
    },
    ensure: (a, n, t) => {
      if (!_ && !f.has(0)) return r(0, t);
      if (s <= 0) return;
      const e = Math.max(0, a), l = Math.min(s, n);
      for (let v = e; v < l; v++)
        if (!g.has(v)) {
          const w = Math.floor(v / b) * b;
          if (!f.has(w)) return r(w, t);
        }
    },
    ingest: (a, n, t, e, l) => {
      if (l != null && l !== d) return [];
      _ = !0, t != null && (u = t), e != null && (s = e);
      for (let v = 0; v < n.length; v++)
        p(a + v, n[v]);
      return f.delete(a), h();
    },
    reset: function() {
      d++, this.clear();
    },
    clear: () => {
      _ = !1, g.clear(), f.clear(), clearTimeout(c);
    },
    configure: (a = {}) => {
      a.windowSize > 0 && a.windowSize !== i && (i = a.windowSize, h()), a.pageSize > 0 && (b = a.pageSize), a.fetchDebounce >= 0 && (y = a.fetchDebounce);
    }
  };
}
(function() {
  const o = "data-ln-data-store", i = "lnDataStore", b = "data-ln-data-store-no-local-query";
  if (window[i] !== void 0) return;
  const y = "ln_app_cache", m = "_meta", g = "1.0";
  let f = null, s = null;
  const u = {};
  function d(A) {
    A && A.name === "QuotaExceededError" && C(document, "ln-data-store:quota-exceeded", { error: A });
  }
  function _() {
    const A = {};
    for (const T of document.querySelectorAll(`[${o}]`)) {
      const I = T.id;
      if (I) {
        const D = T.getAttribute("data-ln-data-store-indexes") || "";
        A[I] = {
          indexes: D.split(",").map((R) => R.trim()).filter(Boolean)
        };
      }
    }
    return A;
  }
  function c() {
    return s || (s = new Promise((A) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), A(null);
      const T = _(), I = Object.keys(T), D = indexedDB.open(y);
      D.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), A(null);
      }, D.onsuccess = (R) => {
        const M = R.target.result, N = Array.from(M.objectStoreNames);
        if (!(!N.includes(m) || I.some((et) => !N.includes(et))))
          return p(M), f = M, A(M);
        const j = M.version;
        M.close();
        const W = indexedDB.open(y, j + 1);
        W.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, W.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), A(null);
        }, W.onupgradeneeded = (et) => {
          const X = et.target.result;
          X.objectStoreNames.contains(m) || X.createObjectStore(m, { keyPath: "key" });
          for (const pt of I)
            if (!X.objectStoreNames.contains(pt)) {
              const At = X.createObjectStore(pt, { keyPath: "id" });
              for (const Kt of T[pt].indexes)
                At.createIndex(Kt, Kt, { unique: !1 });
            }
        }, W.onsuccess = (et) => {
          const X = et.target.result;
          p(X), f = X, A(X);
        };
      };
    }), s);
  }
  function p(A) {
    A.onversionchange = () => {
      A.close(), f = null, s = null;
    };
  }
  function h() {
    return f ? Promise.resolve(f) : (s = null, c());
  }
  async function r(A) {
    if (!dt() || !A) return A;
    const T = { ...A }, I = T.id, D = await An(T);
    return !D || !D.encrypted ? A : {
      id: I,
      encrypted: !0,
      iv: D.iv,
      data: D.data
    };
  }
  async function a(A) {
    return !A || !A.encrypted || !dt() ? A : Sn(A);
  }
  const n = (A, T) => h().then((I) => I ? I.transaction(A, T).objectStore(A) : null);
  function t(A) {
    return new Promise((T, I) => {
      A.onsuccess = () => T(A.result), A.onerror = () => {
        d(A.error), I(A.error);
      };
    });
  }
  const e = (A) => n(A, "readonly").then((T) => T ? t(T.getAll()) : []).then((T) => dt() ? Promise.all(T.map((I) => a(I))) : T), l = (A, T) => n(A, "readonly").then((I) => I ? t(I.get(T)) : null).then((I) => I ? a(I) : null), v = (A, T) => h().then((I) => {
    if (!I) return [];
    const R = I.transaction(A, "readonly").objectStore(A), M = T.map((N) => t(R.get(N)));
    return Promise.all(M).then((N) => dt() ? Promise.all(N.map((z) => a(z))) : N);
  }), w = (A, T) => (dt() ? r(T) : Promise.resolve(T)).then((D) => n(A, "readwrite").then((R) => R ? t(R.put(D)) : null)), E = (A, T) => n(A, "readwrite").then((I) => I ? t(I.delete(T)) : null), S = (A) => n(A, "readwrite").then((T) => T ? t(T.clear()) : null), L = (A) => n(A, "readonly").then((T) => T ? t(T.count()) : 0), x = (A) => n(m, "readonly").then((T) => T ? t(T.get(A)) : null), k = (A, T) => n(m, "readwrite").then((I) => {
    if (I)
      return T.key = A, t(I.put(T));
  });
  function q(A) {
    this.dom = A, this._name = A.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", A);
    const T = A.getAttribute("data-ln-data-store-stale"), I = parseInt(T, 10);
    this._staleThreshold = T === "never" || T === "-1" ? -1 : isNaN(I) ? 300 : I;
    const D = A.getAttribute("data-ln-data-store-search-fields") || "";
    this._searchFields = D.split(",").map((M) => M.trim()).filter(Boolean), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null };
    const R = A.getAttribute("data-ln-data-store-window");
    if (R !== null) {
      const M = parseInt(R, 10) || 1e3, N = parseInt(A.getAttribute("data-ln-data-store-window-page"), 10) || 200;
      this._windowIndex = Zn({
        windowSize: M,
        pageSize: N,
        requestPage: (z, j, W) => {
          C(this.dom, "ln-data-store:request-page", {
            store: this._name,
            offset: z,
            limit: j,
            query: W,
            queryGen: this._windowIndex.queryGen
          });
        }
      });
    } else
      this._windowIndex = null;
    return this.windowed = this._windowIndex !== null, this.noLocalQuery = A.hasAttribute(b), this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), u[this._name] = this, O(this), this.ready = tn(this), this;
  }
  function O(A) {
    A._handlers = {
      create: (T) => F(A, "create", T.detail, () => V(A, T.detail)),
      update: (T) => F(A, "update", T.detail, () => U(A, T.detail)),
      delete: (T) => F(A, "delete", T.detail, () => B(A, T.detail)),
      "bulk-delete": (T) => F(A, "bulk-delete", T.detail, () => K(A, T.detail)),
      "sync-failed": (T) => {
        A.isSyncing = !1, C(A.dom, "ln-data-store:sync-error", {
          store: A._name,
          error: T.detail && T.detail.error,
          status: T.detail && T.detail.status
        });
      }
    };
    for (const [T, I] of Object.entries(A._handlers))
      A.dom.addEventListener(`ln-data-store:request-${T}`, I);
    A._queryHandlers = {
      "ln-search:change": (T) => {
        T.preventDefault();
        const I = T.detail && T.detail.term != null ? T.detail.term : "";
        I !== A.query.search && (A.query.search = I, zt(A));
      },
      "ln-filter:change": (T) => {
        T.preventDefault();
        const I = T.detail && T.detail.key;
        if (!I) return;
        const D = (T.detail.values || []).slice(), R = A.query.filters[I];
        (R ? R.length === D.length && R.every((N, z) => N === D[z]) : !D.length) || (D.length ? A.query.filters[I] = D : delete A.query.filters[I], zt(A));
      },
      "ln-sort:change": (T) => {
        T.preventDefault();
        const I = T.detail && T.detail.field, D = T.detail && T.detail.direction, R = D && D !== "none" ? { field: I, direction: D } : null, M = A.query.sort;
        !M && !R || M && R && M.field === R.field && M.direction === R.direction || (A.query.sort = R, zt(A));
      }
    };
    for (const [T, I] of Object.entries(A._queryHandlers))
      A.dom.addEventListener(T, I);
  }
  function F(A, T, I, D) {
    const R = I && I.requestId;
    return A._mutationChain = A._mutationChain.then(() => A.ready).then(() => {
      if (A.initializationError) throw A.initializationError;
      return D();
    }).catch((M) => rt(A, T, R, M)), A._mutationChain;
  }
  function P(A, T = 0) {
    return L(A._name).then((I) => {
      if (A._windowIndex || A.windowed) {
        const D = A.totalCount != null ? A.totalCount : I;
        A.totalCount = Math.max(0, D + T);
      } else
        A.totalCount = I;
      return A.hasCache = !0, A.isLoaded = !0, A.canServe = !0, k(A._name, {
        schema_version: g,
        last_synced_at: A.lastSyncedAt,
        has_cache: !0,
        record_count: A.totalCount
      });
    });
  }
  function V(A, { tempId: T, data: I = {}, requestId: D } = {}) {
    const R = { ...I, id: T };
    return w(A._name, R).then(() => P(A, 1)).then(() => {
      C(A.dom, "ln-data-store:created", { store: A._name, record: R, tempId: T, requestId: D });
    });
  }
  function U(A, { id: T, data: I = {}, requestId: D } = {}) {
    return l(A._name, T).then((R) => {
      if (!R) throw new Error(`Record not found: ${T}`);
      const M = { ...R, ...I }, N = I.id;
      return (N !== void 0 && N !== T ? en(A._name, T, M) : w(A._name, M)).then(() => P(A, 0)).then(() => {
        C(A.dom, "ln-data-store:updated", { store: A._name, record: M, previous: R, requestId: D });
      });
    });
  }
  function B(A, { id: T, requestId: I } = {}) {
    return l(A._name, T).then((D) => {
      if (!D) {
        C(A.dom, "ln-data-store:deleted", { store: A._name, id: T, requestId: I, missing: !0 });
        return;
      }
      return E(A._name, T).then(() => P(A, -1)).then(() => {
        C(A.dom, "ln-data-store:deleted", { store: A._name, id: T, requestId: I });
      });
    });
  }
  function K(A, { ids: T = [], requestId: I } = {}) {
    return T.length ? Promise.all(T.map((D) => l(A._name, D))).then((D) => {
      const R = D.filter(Boolean).map((M) => M.id);
      return Ut(A._name, R).then(() => P(A, -R.length)).then(() => {
        C(A.dom, "ln-data-store:deleted", { store: A._name, ids: R, requestId: I });
      });
    }) : (C(A.dom, "ln-data-store:deleted", { store: A._name, ids: [], requestId: I }), Promise.resolve());
  }
  function rt(A, T, I, D) {
    console.error("[ln-data-store] " + T + " failed:", D), C(A.dom, "ln-data-store:mutation-error", {
      store: A._name,
      action: T,
      requestId: I,
      error: D
    });
  }
  function tn(A) {
    return c().then((T) => {
      if (!T) throw new Error("IndexedDB is unavailable");
      return x(A._name);
    }).then((T) => {
      if (A.initializationError = null, T && T.schema_version === g)
        A.lastSyncedAt = T.last_synced_at || null, A.totalCount = T.record_count || 0, A.hasCache = T.has_cache === !0 || A.totalCount > 0, A.hasCache && (A.isLoaded = !0, A.canServe = !0, C(A.dom, "ln-data-store:ready", { store: A._name, count: A.totalCount, source: "cache" })), A.isInitialized = !0, C(A.dom, "ln-data-store:initialized", { store: A._name, hasCache: A.hasCache, lastSyncedAt: A.lastSyncedAt, count: A.totalCount });
      else {
        if (T && T.schema_version !== g)
          return S(A._name).then(() => k(A._name, { schema_version: g, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            A.isInitialized = !0, A.hasCache = !1, C(A.dom, "ln-data-store:initialized", { store: A._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        A.isInitialized = !0, A.hasCache = !1, C(A.dom, "ln-data-store:initialized", { store: A._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((T) => (A.isInitialized = !0, A.isLoaded = !1, A.canServe = !1, A.hasCache = !1, A.isSyncing = !1, A.initializationError = T, C(A.dom, "ln-data-store:initialization-error", { store: A._name, error: T }), { ok: !1, error: T }));
  }
  function oe(A) {
    A.isSyncing = !0, C(A.dom, "ln-data-store:request-remote-sync", { since: A.lastSyncedAt });
  }
  function se(A, T) {
    return h().then((I) => I ? (dt() ? Promise.all(T.map((R) => r(R))) : Promise.resolve(T)).then((R) => new Promise((M, N) => {
      const z = I.transaction(A, "readwrite"), j = z.objectStore(A);
      R.forEach((W) => j.put(W)), z.oncomplete = () => M(), z.onerror = () => {
        d(z.error), N(z.error);
      };
    })) : void 0);
  }
  function Ut(A, T) {
    return h().then((I) => {
      if (I)
        return new Promise((D, R) => {
          const M = I.transaction(A, "readwrite"), N = M.objectStore(A);
          T.forEach((z) => N.delete(z)), M.oncomplete = () => D(), M.onerror = () => R(M.error);
        });
    });
  }
  function en(A, T, I) {
    return (dt() ? r(I) : Promise.resolve(I)).then((R) => h().then((M) => {
      if (M)
        return new Promise((N, z) => {
          const j = M.transaction(A, "readwrite"), W = j.objectStore(A);
          W.put(R), W.delete(T), j.oncomplete = () => N(), j.onerror = () => {
            d(j.error), z(j.error);
          };
        });
    }));
  }
  const nn = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function rn(A, T) {
    if (!T || !T.field) return A;
    const { field: I, direction: D } = T, R = D === "desc";
    return [...A].sort((M, N) => {
      const z = M[I], j = N[I];
      if (z == null && j == null) return 0;
      if (z == null) return R ? 1 : -1;
      if (j == null) return R ? -1 : 1;
      const W = typeof z == "string" && typeof j == "string" ? nn.compare(z, j) : z < j ? -1 : z > j ? 1 : 0;
      return R ? -W : W;
    });
  }
  function ae(A) {
    return A ? Object.keys(A).filter((T) => Array.isArray(A[T]) && A[T].length > 0) : [];
  }
  function le(A, T, I) {
    return T.every((D) => I[D].map(String).includes(String(A[D])));
  }
  function ce(A, T) {
    const I = ae(T);
    return I.length ? A.filter((D) => le(D, I, T)) : A;
  }
  function de(A) {
    return String(A || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function ue(A, T, I) {
    return T.every(
      (D) => I.some((R) => {
        const M = A[R];
        return M != null && String(M).toLowerCase().includes(D);
      })
    );
  }
  function on(A, T, I) {
    if (!T || !I || !I.length) return A;
    const D = de(T);
    return D.length ? A.filter((R) => ue(R, D, I)) : A;
  }
  function sn(A, T, I) {
    if (!A.length) return 0;
    if (I === "count") return A.length;
    const D = A.map((M) => parseFloat(M[T])).filter((M) => !isNaN(M)), R = D.reduce((M, N) => M + N, 0);
    return I === "sum" ? R : I === "avg" && D.length ? R / D.length : 0;
  }
  function Et(A, T) {
    if (!A.presenters || !A.presenters.computed) return T;
    const I = A.presenters.computed;
    return T.map((D) => {
      if (!D) return null;
      const R = { ...D };
      for (const [M, N] of Object.entries(I))
        try {
          R[M] = N(D);
        } catch (z) {
          console.error(`[ln-data-store] Decorator computed field failed for ${M}`, z);
        }
      return R;
    });
  }
  function an(A) {
    return !A.sort && !dt();
  }
  function ln(A, T, I) {
    const D = ae(T.filters), R = T.search ? de(T.search) : [], M = A._searchFields, N = R.length > 0 && M && M.length > 0;
    return n(A._name, "readonly").then((z) => z ? new Promise((j, W) => {
      const et = [], X = z.openCursor();
      X.onsuccess = () => {
        const pt = X.result;
        if (!pt || et.length >= I) {
          j(et);
          return;
        }
        const At = pt.value;
        (!D.length || le(At, D, T.filters)) && (!N || ue(At, R, M)) && et.push(At), pt.continue();
      }, X.onerror = () => W(X.error);
    }) : []);
  }
  function he(A, T, I) {
    const D = T.length;
    I.filters && (T = ce(T, I.filters)), I.search && (T = on(T, I.search, A._searchFields));
    const R = T.length;
    if (I.sort && (T = rn(T, I.sort)), I.offset || I.limit) {
      const M = I.offset || 0, N = I.limit || T.length;
      T = T.slice(M, M + N);
    }
    return { records: T, total: D, filtered: R };
  }
  function fe(A, T, I) {
    const D = [];
    for (let M = T; M < T + I; M++) {
      const N = A._windowIndex.getId(M);
      D.push(N);
    }
    const R = Array.from(new Set(D.filter((M) => M !== void 0)));
    return v(A._name, R).then((M) => {
      const N = /* @__PURE__ */ new Map();
      for (let j = 0; j < M.length; j++) {
        const W = M[j];
        W && N.set(String(W.id), W);
      }
      const z = [];
      for (let j = 0; j < D.length; j++) {
        const W = D[j];
        if (W === void 0)
          z.push(null);
        else {
          const et = N.get(String(W));
          z.push(et || null);
        }
      }
      return {
        data: Et(A, z),
        total: A._windowIndex.grandTotal,
        filtered: A._windowIndex.logicalTotal,
        offset: T,
        queryGen: A._windowIndex.queryGen
      };
    });
  }
  q.prototype.getAll = function(A = {}) {
    const T = this;
    if (T._windowIndex) {
      const I = A.offset || 0, D = A.limit || 200;
      if (T._windowIndex.ensure(I, I + D, A), !T._windowIndex.hasLoaded && !T.noLocalQuery) {
        const R = I + D, M = (N) => N.length ? {
          data: Et(T, N),
          offset: I,
          queryGen: T._windowIndex.queryGen,
          provisional: !0
        } : fe(T, I, D);
        return an(A) ? ln(T, A, R).then((N) => M(N.slice(I, R))) : e(T._name).then((N) => M(he(T, N, A).records));
      }
      return fe(T, I, D);
    }
    return e(T._name).then((I) => {
      const D = he(T, I, A);
      return {
        data: Et(T, D.records),
        total: D.total,
        filtered: D.filtered
      };
    });
  }, q.prototype.getById = function(A) {
    return l(this._name, A).then((T) => T ? Et(this, [T])[0] : null);
  }, q.prototype.count = function(A) {
    return A && Object.keys(A).length > 0 ? e(this._name).then((I) => ce(I, A).length) : this.totalCount != null ? Promise.resolve(this.totalCount) : L(this._name);
  }, q.prototype.aggregate = function(A, T) {
    return e(this._name).then((I) => sn(I, A, T));
  }, q.prototype.setPresenters = function(A) {
    this.presenters = A;
  }, q.prototype.applySync = function(A, T, I, D) {
    D = D || {};
    const R = this;
    if (R._windowIndex && D.queryGen != null && D.queryGen !== R._windowIndex.queryGen)
      return Promise.resolve();
    A.length > 0 || T.length > 0;
    let M = Promise.resolve();
    return A.length > 0 && (M = M.then(() => se(R._name, A))), T.length > 0 && (M = M.then(() => Ut(R._name, T))), M.then(() => {
      if (R._windowIndex && (D.offset != null || D.total != null)) {
        const N = D.offset != null ? D.offset : 0, z = A.map((W) => W.id), j = R._windowIndex.ingest(N, z, D.total, D.filtered, D.queryGen);
        if (j && j.length) return Ut(R._name, j);
      }
    }).then(() => L(R._name)).then((N) => (R.totalCount = D.total !== void 0 ? D.total : N, R.hasCache = !0, k(R._name, {
      schema_version: g,
      last_synced_at: I,
      has_cache: !0,
      record_count: R.totalCount
    }))).then(() => {
      const N = !R.isLoaded;
      R.isLoaded = !0, R.canServe = !0, R.isSyncing = !1, R.lastSyncedAt = I, N ? (C(R.dom, "ln-data-store:loaded", { store: R._name, count: R.totalCount, meta: D }), C(R.dom, "ln-data-store:ready", { store: R._name, count: R.totalCount, source: "server", meta: D })) : C(R.dom, "ln-data-store:synced", {
        store: R._name,
        added: A.length,
        deleted: T.length,
        changed: !0,
        meta: D
      });
    }).catch((N) => {
      R.isSyncing = !1, console.error("[ln-data-store] applySync failed:", N);
    });
  }, q.prototype.applyQuery = function(A, T) {
    T = T || {};
    const I = this;
    let D = Promise.resolve();
    return A.length > 0 && (D = D.then(() => se(I._name, A))), D.then(() => L(I._name)).then((R) => (I.totalCount = T.total !== void 0 ? T.total : R, A.length > 0 && (I.canServe = !0), Et(I, A))).catch((R) => (console.error("[ln-data-store] applyQuery failed:", R), []));
  }, q.prototype.forceSync = function() {
    this.isSyncing || oe(this);
  }, q.prototype.fullReload = function() {
    const A = this;
    return S(A._name).then(() => k(A._name, {
      schema_version: g,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      A.isLoaded = !1, A.hasCache = !1, A.lastSyncedAt = null, A.totalCount = 0, oe(A);
    });
  }, q.prototype.destroy = function() {
    if (this._windowIndex && (this._windowIndex.clear(), this._windowIndex = null, this.windowed = !1), this._handlers) {
      for (const [A, T] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${A}`, T);
      this._handlers = null;
    }
    if (this._queryHandlers) {
      for (const [A, T] of Object.entries(this._queryHandlers))
        this.dom.removeEventListener(A, T);
      this._queryHandlers = null;
    }
    delete u[this._name], delete this.dom[i], C(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function cn() {
    return h().then((A) => {
      if (!A) return;
      const T = Array.from(A.objectStoreNames);
      return new Promise((I, D) => {
        const R = A.transaction(T, "readwrite");
        T.forEach((M) => R.objectStore(M).clear()), R.oncomplete = () => I(), R.onerror = () => D(R.error);
      });
    }).then(() => {
      Object.values(u).forEach((A) => {
        A.isLoaded = !1, A.canServe = !1, A.isInitialized = !1, A.initializationError = null, A.hasCache = !1, A.isSyncing = !1, A.lastSyncedAt = null, A.totalCount = 0;
      });
    });
  }
  function zt(A) {
    A._windowIndex && A._windowIndex.reset(), C(A.dom, "ln-data-store:query-changed", {
      store: A._name,
      query: {
        filters: Object.assign({}, A.query.filters),
        search: A.query.search,
        sort: A.query.sort ? Object.assign({}, A.query.sort) : null
      }
    });
  }
  function dn(A, T) {
    const I = A[i];
    !I || T !== b || (I.noLocalQuery = A.hasAttribute(b));
  }
  H(o, i, q, "ln-data-store", {
    extraAttributes: [b],
    onAttributeChange: dn
  }), window[i].clearAll = cn, window[i].init = window[i], window[i].setStorageKey = me, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = me);
})();
const ti = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function mt(...o) {
  return o.filter((i) => i != null && i !== "").map((i, b) => {
    const y = String(i);
    return b === 0 ? y.replace(/\/+$/, "") : y.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function ei(o, i) {
  if (!o || typeof o != "object") return "";
  const b = Object.assign({}, ti);
  if (i && typeof i == "object")
    for (const m in i)
      i[m] !== void 0 && i[m] !== null && i[m] !== "" && (b[m] = i[m]);
  const y = new URLSearchParams();
  return o.search && y.append(b.search, o.search), o.offset != null && y.append(b.offset, o.offset), o.limit != null && y.append(b.limit, o.limit), o.sort && o.sort.field && o.sort.direction && (y.append(b.sortField, o.sort.field), y.append(b.sortDir, o.sort.direction)), o.filters && typeof o.filters == "object" && Object.keys(o.filters).forEach((m) => {
    const g = o.filters[m];
    Array.isArray(g) && g.length > 0 && y.append(m, g.join(","));
  }), y.toString();
}
function ni(o, i, b) {
  let y = mt(o, i);
  return b && (y += (y.indexOf("?") !== -1 ? "&" : "?") + b), y;
}
function ye(o) {
  const i = o && o.content !== void 0 ? o.content : o, b = o && o.message ? o.message : null;
  return { record: i, message: b };
}
(function() {
  const o = "data-ln-api-connector", i = "lnApiConnector", b = "lnConnector";
  if (window[i] !== void 0) return;
  function y(s) {
    return s.ok ? s.status === 204 ? null : s.json() : s.json().catch(() => null).then((u) => {
      const d = new Error("HTTP " + s.status + ": " + s.statusText);
      throw d.status = s.status, d.data = u, d;
    });
  }
  function m(s) {
    return this.dom = s, s[i] = this, s[b] = this, this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, g(this), this;
  }
  m.prototype.refreshConfig = function() {
    const s = this.dom;
    this.baseUrl = s.getAttribute("data-ln-api-base-url") || "", this.path = s.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin", this.rawHeaders = s.getAttribute("data-ln-api-headers"), this.headers = De(this.rawHeaders);
    const u = {}, d = s.getAttribute("data-ln-api-param-offset");
    d && (u.offset = d);
    const _ = s.getAttribute("data-ln-api-param-limit");
    _ && (u.limit = _);
    const c = s.getAttribute("data-ln-api-param-search");
    c && (u.search = c);
    const p = s.getAttribute("data-ln-api-param-sort-field");
    p && (u.sortField = p);
    const h = s.getAttribute("data-ln-api-param-sort-dir");
    h && (u.sortDir = h), this.paramKeys = u;
    const r = s.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = r !== null ? +r : 300, C(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, m.prototype._reqHeaders = function(s) {
    const u = Object.assign({}, this.headers);
    return !u.Accept && !u.accept && (u.Accept = "application/json"), !u["Content-Type"] && !u["content-type"] && (u["Content-Type"] = "application/json"), s && (u["X-Idempotency-Key"] = s), u;
  }, m.prototype.cancel = function(s) {
    return s && this._inflight.has(s) ? (this._inflight.get(s).abort(), this._inflight.delete(s), !0) : !1;
  }, m.prototype.fetchDelta = function(s, u) {
    const d = this;
    let _ = mt(d.baseUrl, d.path);
    s != null && s !== "" && (_ += (_.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(s));
    const c = u || "sync";
    d._inflight.has(c) && d._inflight.get(c).abort();
    const p = new AbortController();
    return d._inflight.set(c, p), window.fetch(_, {
      method: "GET",
      headers: d._reqHeaders(),
      credentials: d.credentials,
      signal: p.signal
    }).then(y).finally(function() {
      d._inflight.get(c) === p && d._inflight.delete(c);
    });
  }, m.prototype.query = function(s, u) {
    const d = this, _ = ei(s, d.paramKeys), c = ni(d.baseUrl, d.path, _), p = u || "query";
    d._inflight.has(p) && d._inflight.get(p).abort();
    const h = new AbortController();
    return d._inflight.set(p, h), window.fetch(c, {
      method: "GET",
      headers: d._reqHeaders(),
      credentials: d.credentials,
      signal: h.signal
    }).then(y).finally(function() {
      d._inflight.get(p) === h && d._inflight.delete(p);
    });
  }, m.prototype.create = function(s, u, d) {
    const _ = this;
    return window.fetch(mt(_.baseUrl, u || _.path), {
      method: "POST",
      headers: _._reqHeaders(d),
      credentials: _.credentials,
      body: JSON.stringify(s)
    }).then(y);
  }, m.prototype.update = function(s, u, d, _, c) {
    const p = this;
    d != null && (u = Object.assign({}, u, { expected_version: d }));
    const h = _ ? mt(p.baseUrl, _) : mt(p.baseUrl, p.path, s);
    return window.fetch(h, {
      method: "PUT",
      headers: p._reqHeaders(c),
      credentials: p.credentials,
      body: JSON.stringify(u)
    }).then(y);
  }, m.prototype.delete = function(s, u, d) {
    const _ = this;
    return window.fetch(mt(_.baseUrl, u || _.path, s), {
      method: "DELETE",
      headers: _._reqHeaders(d),
      credentials: _.credentials
    }).then(y);
  }, m.prototype.bulkDelete = function(s, u, d) {
    const _ = this;
    return window.fetch(mt(_.baseUrl, u || _.path, "bulk-delete"), {
      method: "DELETE",
      headers: _._reqHeaders(d),
      credentials: _.credentials,
      body: JSON.stringify({ ids: s })
    }).then(y);
  };
  function g(s) {
    s._handlers = {
      sync: function(u) {
        const d = u.detail || {}, _ = d.meta && d.meta.targetEl ? d.meta.targetEl : null;
        s.fetchDelta(d.since, _).then(function(c) {
          C(s.dom, "ln-api-connector:fetched", { data: c, since: d.since, meta: d.meta || null });
        }).catch(function(c) {
          c && c.name === "AbortError" || C(s.dom, "ln-api-connector:error", {
            action: "sync",
            error: c.message,
            status: c.status || 0,
            data: c.data || null,
            since: d.since,
            meta: d.meta || null
          });
        });
      },
      query: function(u) {
        const d = u.detail || {}, _ = d.query || d, c = d.meta && d.meta.targetEl ? d.meta.targetEl : null, p = c || "query", h = s.queryDebounce;
        function r(n, t, e) {
          s.query(t, e).then(function(l) {
            const v = l || {};
            C(s.dom, "ln-api-connector:fetched", {
              data: v.data || (Array.isArray(v) ? v : []),
              total: v.total,
              filtered: v.filtered,
              offset: t.offset,
              queryGen: t.queryGen,
              meta: n.meta || null
            });
          }).catch(function(l) {
            l && l.name === "AbortError" || C(s.dom, "ln-api-connector:error", {
              action: "query",
              error: l.message,
              status: l.status || 0,
              data: l.data || null,
              meta: n.meta || null
            });
          });
        }
        if (h === 0) {
          r(d, _, c);
          return;
        }
        s._queryTimers.has(p) && clearTimeout(s._queryTimers.get(p));
        const a = setTimeout(function() {
          s._queryTimers.delete(p), r(d, _, c);
        }, h);
        s._queryTimers.set(p, a);
      },
      cancel: function(u) {
        const d = u.detail || {}, _ = d.meta && d.meta.targetEl ? d.meta.targetEl : d.targetEl || d.key;
        _ && s.cancel(_);
      },
      create: function(u) {
        const d = u.detail || {};
        s.create(d.data, d.url, d.idempotencyKey).then(function(_) {
          const c = ye(_);
          C(s.dom, "ln-api-connector:created", {
            record: c.record,
            tempId: d.tempId,
            message: c.message,
            meta: d.meta || null
          });
        }).catch(function(_) {
          _ && _.name === "AbortError" || C(s.dom, "ln-api-connector:error", {
            action: "create",
            error: _.message,
            status: _.status || 0,
            data: _.data || null,
            tempId: d.tempId,
            meta: d.meta || null
          });
        });
      },
      update: function(u) {
        const d = u.detail || {};
        s.update(d.id, d.data, d.expected_version, d.url, d.idempotencyKey).then(function(_) {
          const c = ye(_);
          C(s.dom, "ln-api-connector:updated", {
            record: c.record,
            id: d.id,
            message: c.message,
            meta: d.meta || null
          });
        }).catch(function(_) {
          _ && _.name === "AbortError" || C(s.dom, "ln-api-connector:error", {
            action: "update",
            error: _.message,
            status: _.status || 0,
            data: _.data || null,
            id: d.id,
            conflictData: _.status === 409 ? _.data : null,
            meta: d.meta || null
          });
        });
      },
      delete: function(u) {
        const d = u.detail || {};
        s.delete(d.id, d.url, d.idempotencyKey).then(function(_) {
          const c = _ && _.message ? _.message : null;
          C(s.dom, "ln-api-connector:deleted", {
            response: _,
            id: d.id,
            message: c,
            meta: d.meta || null
          });
        }).catch(function(_) {
          _ && _.name === "AbortError" || C(s.dom, "ln-api-connector:error", {
            action: "delete",
            error: _.message,
            status: _.status || 0,
            data: _.data || null,
            id: d.id,
            meta: d.meta || null
          });
        });
      },
      bulkDelete: function(u) {
        const d = u.detail || {};
        s.bulkDelete(d.ids, d.url, d.idempotencyKey).then(function(_) {
          const c = _ && _.message ? _.message : null;
          C(s.dom, "ln-api-connector:bulk-deleted", {
            response: _,
            ids: d.ids,
            message: c,
            meta: d.meta || null
          });
        }).catch(function(_) {
          _ && _.name === "AbortError" || C(s.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: _.message,
            status: _.status || 0,
            data: _.data || null,
            ids: d.ids,
            meta: d.meta || null
          });
        });
      }
    }, s.dom.addEventListener("ln-api-connector:request-sync", s._handlers.sync), s.dom.addEventListener("ln-api-connector:request-query", s._handlers.query), s.dom.addEventListener("ln-api-connector:request-fetch", s._handlers.query), s.dom.addEventListener("ln-api-connector:request-cancel", s._handlers.cancel), s.dom.addEventListener("ln-api-connector:request-create", s._handlers.create), s.dom.addEventListener("ln-api-connector:request-update", s._handlers.update), s.dom.addEventListener("ln-api-connector:request-delete", s._handlers.delete), s.dom.addEventListener("ln-api-connector:request-bulk-delete", s._handlers.bulkDelete);
  }
  m.prototype.destroy = function() {
    if (!this.dom[i]) return;
    const s = this;
    s._inflight && (s._inflight.forEach(function(u) {
      u.abort();
    }), s._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(u) {
      u && clearTimeout(u);
    }), this._queryTimers.clear()), this._handlers && (s.dom.removeEventListener("ln-api-connector:request-sync", s._handlers.sync), s.dom.removeEventListener("ln-api-connector:request-query", s._handlers.query), s.dom.removeEventListener("ln-api-connector:request-fetch", s._handlers.query), s.dom.removeEventListener("ln-api-connector:request-cancel", s._handlers.cancel), s.dom.removeEventListener("ln-api-connector:request-create", s._handlers.create), s.dom.removeEventListener("ln-api-connector:request-update", s._handlers.update), s.dom.removeEventListener("ln-api-connector:request-delete", s._handlers.delete), s.dom.removeEventListener("ln-api-connector:request-bulk-delete", s._handlers.bulkDelete), s._handlers = null), C(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[i], delete this.dom[b];
  };
  function f(s) {
    const u = s[i];
    u && u.refreshConfig();
  }
  H(o, i, m, "ln-api-connector", {
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
    onAttributeChange: f
  });
})();
(function() {
  const o = "data-ln-couchdb-connector", i = "lnCouchDbConnector", b = "lnConnector";
  if (window[i] !== void 0) return;
  function y(p) {
    const h = p && p.content !== void 0 ? p.content : p, r = p && p.message ? p.message : null;
    return { content: h, message: r };
  }
  function m(p) {
    return this.dom = p, p[i] = this, p[b] = this, this.refreshConfig(), this._handlers = null, _(this), this;
  }
  m.prototype.refreshConfig = function() {
    const p = this.dom;
    this.url = p.getAttribute("data-ln-couchdb-url") || "", this.db = p.getAttribute("data-ln-couchdb-db") || "", this.auth = p.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const h = p.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = De(h, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), h.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), C(p, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function g(p, h, r) {
    const a = Object.assign({}, St(p.headers, p.auth), r || {});
    return h && (a["Idempotency-Key"] = h), a;
  }
  m.prototype.fetchDelta = function(p) {
    const h = this, r = ["include_docs=true", "feed=normal"];
    p && r.push("since=" + encodeURIComponent(p));
    const a = ct(h.url, h.db, "_changes") + "?" + r.join("&");
    return window.fetch(a, { method: "GET", headers: St(h.headers, h.auth), credentials: h.credentials }).then((n) => {
      if (!n.ok) throw new Error("HTTP " + n.status + ": " + n.statusText);
      return n.json();
    }).then((n) => {
      const t = n.results || [];
      return {
        data: t.filter((e) => !e.deleted && e.doc).map((e) => Object.assign({}, e.doc, { id: e.doc._id })),
        deleted: t.filter((e) => e.deleted).map((e) => e.id),
        synced_at: n.last_seq || p || ""
      };
    });
  };
  function f(p, h, r) {
    const a = Object.assign({ _id: h.id }, h);
    return a._id || delete a._id, window.fetch(ct(p.url, p.db), {
      method: "POST",
      headers: g(p, r),
      credentials: p.credentials,
      body: JSON.stringify(a)
    }).then((n) => {
      if (!n.ok) throw new Error("HTTP " + n.status + ": " + n.statusText);
      return n.json();
    }).then((n) => {
      const t = y(n), e = t.content;
      return { record: Object.assign({}, a, { id: e.id, _id: e.id, _rev: e.rev }), message: t.message };
    });
  }
  m.prototype.create = function(p, h) {
    return f(this, p, h).then((r) => r.record);
  };
  function s(p, h, r, a) {
    const n = Object.assign({ id: String(h), _id: String(h) }, r), t = n._rev || n.rev;
    return (t ? Promise.resolve(t) : window.fetch(ct(p.url, p.db, null, h), { method: "GET", headers: St(p.headers, p.auth), credentials: p.credentials }).then((l) => {
      if (!l.ok) throw new Error("Could not retrieve document for revision mapping");
      return l.json().then((v) => v._rev);
    })).then((l) => {
      const v = Object.assign({}, n, { _rev: l });
      delete v.rev;
      const w = g(p, a, { "If-Match": l });
      return window.fetch(ct(p.url, p.db, null, h), {
        method: "PUT",
        headers: w,
        credentials: p.credentials,
        body: JSON.stringify(v)
      }).then((E) => {
        if (E.ok) return E.json().then((S) => {
          const L = y(S);
          return { record: Object.assign({}, v, { _rev: L.content.rev }), message: L.message };
        });
        if (E.status === 409) return E.json().then((S) => {
          const L = new Error("Conflict");
          throw L.status = 409, L.data = S, L;
        });
        throw new Error("HTTP " + E.status + ": " + E.statusText);
      });
    });
  }
  m.prototype.update = function(p, h, r) {
    return s(this, p, h, r).then((a) => a.record);
  };
  function u(p, h, r, a) {
    return (r ? Promise.resolve(r) : window.fetch(ct(p.url, p.db, null, h), { method: "GET", headers: St(p.headers, p.auth), credentials: p.credentials }).then((t) => {
      if (!t.ok) throw new Error("Could not retrieve document for revision delete");
      return t.json().then((e) => e._rev);
    })).then((t) => {
      const e = ct(p.url, p.db, null, h) + "?rev=" + encodeURIComponent(t);
      return window.fetch(e, { method: "DELETE", headers: g(p, a), credentials: p.credentials }).then((l) => {
        if (!l.ok) throw new Error("HTTP " + l.status + ": " + l.statusText);
        return l.json();
      }).then((l) => {
        const v = y(l);
        return { response: v.content, message: v.message };
      });
    });
  }
  m.prototype.delete = function(p, h, r) {
    return u(this, p, h, r).then((a) => a.response);
  };
  function d(p, h, r) {
    return !h || h.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(ct(p.url, p.db, "_all_docs"), {
      method: "POST",
      headers: St(p.headers, p.auth),
      credentials: p.credentials,
      body: JSON.stringify({ keys: h })
    }).then((a) => {
      if (!a.ok) throw new Error("HTTP " + a.status + ": " + a.statusText);
      return a.json();
    }).then((a) => {
      const t = (a.rows || []).filter((e) => !e.error && e.value && e.value.rev).map((e) => ({ _id: e.id, _rev: e.value.rev, _deleted: !0 }));
      return t.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(ct(p.url, p.db, "_bulk_docs"), {
        method: "POST",
        headers: g(p, r),
        credentials: p.credentials,
        body: JSON.stringify({ docs: t })
      }).then((e) => {
        if (!e.ok) throw new Error("HTTP " + e.status + ": " + e.statusText);
        return e.json();
      }).then((e) => {
        const l = y(e);
        return { response: { ok: !0, results: l.content, deletedCount: t.length }, message: l.message };
      });
    });
  }
  m.prototype.bulkDelete = function(p, h) {
    return d(this, p, h).then((r) => r.response);
  };
  function _(p) {
    p._handlers = {
      sync: function(r) {
        const a = r.detail || {};
        p.fetchDelta(a.since).then(function(n) {
          C(p.dom, "ln-couchdb-connector:fetched", { data: n, since: a.since, meta: a.meta || null });
        }).catch(function(n) {
          C(p.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: n.message,
            status: n.status || 0,
            since: a.since,
            meta: a.meta || null
          });
        });
      },
      create: function(r) {
        const a = r.detail || {};
        f(p, a.data, a.idempotencyKey).then(function(n) {
          C(p.dom, "ln-couchdb-connector:created", { record: n.record, tempId: a.tempId, message: n.message, meta: a.meta || null });
        }).catch(function(n) {
          C(p.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: n.message,
            status: n.status || 0,
            tempId: a.tempId,
            meta: a.meta || null
          });
        });
      },
      update: function(r) {
        const a = r.detail || {}, n = Object.assign({}, a.data);
        a.expected_version !== void 0 && (n._rev = a.expected_version), s(p, a.id, n, a.idempotencyKey).then(function(t) {
          C(p.dom, "ln-couchdb-connector:updated", { record: t.record, id: a.id, message: t.message, meta: a.meta || null });
        }).catch(function(t) {
          C(p.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: t.message,
            status: t.status || 0,
            id: a.id,
            data: t.status === 409 ? t.data : null,
            conflictData: t.status === 409 ? t.data : null,
            meta: a.meta || null
          });
        });
      },
      delete: function(r) {
        const a = r.detail || {};
        u(p, a.id, a.rev, a.idempotencyKey).then(function(n) {
          C(p.dom, "ln-couchdb-connector:deleted", { response: n.response, id: a.id, message: n.message, meta: a.meta || null });
        }).catch(function(n) {
          C(p.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: n.message,
            status: n.status || 0,
            id: a.id,
            meta: a.meta || null
          });
        });
      },
      bulkDelete: function(r) {
        const a = r.detail || {};
        d(p, a.ids, a.idempotencyKey).then(function(n) {
          C(p.dom, "ln-couchdb-connector:bulk-deleted", { response: n.response, ids: a.ids, message: n.message, meta: a.meta || null });
        }).catch(function(n) {
          C(p.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: n.message,
            status: n.status || 0,
            ids: a.ids,
            meta: a.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector"].forEach(function(r) {
      p.dom.addEventListener(r + ":request-sync", p._handlers.sync), p.dom.addEventListener(r + ":request-fetch", p._handlers.sync), p.dom.addEventListener(r + ":request-create", p._handlers.create), p.dom.addEventListener(r + ":request-update", p._handlers.update), p.dom.addEventListener(r + ":request-delete", p._handlers.delete), p.dom.addEventListener(r + ":request-bulk-delete", p._handlers.bulkDelete);
    });
  }
  m.prototype.destroy = function() {
    if (!this.dom[i]) return;
    const p = this;
    p._handlers && (["ln-couchdb-connector", "ln-api-connector"].forEach(function(r) {
      p.dom.removeEventListener(r + ":request-sync", p._handlers.sync), p.dom.removeEventListener(r + ":request-fetch", p._handlers.sync), p.dom.removeEventListener(r + ":request-create", p._handlers.create), p.dom.removeEventListener(r + ":request-update", p._handlers.update), p.dom.removeEventListener(r + ":request-delete", p._handlers.delete), p.dom.removeEventListener(r + ":request-bulk-delete", p._handlers.bulkDelete);
    }), p._handlers = null), C(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[i], delete this.dom[b];
  };
  function c(p) {
    const h = p[i];
    h && h.refreshConfig();
  }
  H(o, i, m, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: c
  });
})();
function ii(o) {
  return o = o || {}, {
    sort: o.sort,
    filters: o.filters,
    search: o.search,
    offset: o.offset,
    limit: o.limit,
    queryGen: o.queryGen
  };
}
function It(o, i) {
  const b = !o || !!o.initializationError, y = !!(o && o.noLocalQuery && !o.windowed);
  return i && (b || !o.canServe || y) ? "remote" : o && !o.initializationError ? "store" : "none";
}
function ve(o, i) {
  const b = Object.assign({}, o);
  return i && (b.filters = i.filters, b.search = i.search, b.sort = i.sort), b;
}
class ri {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(i) {
    return new Promise((b, y) => {
      this._pending.set(i, { resolve: b, reject: y });
    });
  }
  resolve(i) {
    return this._settle(i, !1);
  }
  reject(i) {
    return this._settle(i, !0);
  }
  close(i) {
    const b = i || new Error("Mutation receipt registry closed");
    for (const y of this._pending.values()) y.reject(b);
    this._pending.clear();
  }
  _settle(i, b) {
    const y = i && i.requestId;
    if (!y) return !1;
    const m = this._pending.get(y);
    return m ? (this._pending.delete(y), b ? m.reject(i.error || new Error("Store mutation failed")) : m.resolve(i), !0) : !1;
  }
}
(function() {
  const o = "data-ln-data-coordinator", i = "lnDataCoordinator", b = "lnCoordinator", y = "data-ln-form-scope";
  if (window[i] !== void 0) return;
  const m = /* @__PURE__ */ new Set();
  let g = !1, f = null, s = null, u = null;
  function d() {
    g || (g = !0, f = function() {
      C(document, "ln-data-store:online", {}), m.forEach(function(n) {
        n._maybeSync();
      });
    }, s = function() {
      C(document, "ln-data-store:offline", {});
    }, u = function() {
      document.visibilityState === "visible" && m.forEach(function(n) {
        const t = n.findChildren(), e = t.store;
        e && t.connector && e.isInitialized && !e.initializationError && !e.isSyncing && !n._noAutosync && (!e.hasCache || n._isStale()) && e.forceSync();
      });
    }, window.addEventListener("online", f), window.addEventListener("offline", s), document.addEventListener("visibilitychange", u));
  }
  function _() {
    g && (m.size > 0 || (window.removeEventListener("online", f), window.removeEventListener("offline", s), document.removeEventListener("visibilitychange", u), f = null, s = null, u = null, g = !1));
  }
  function c() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
        const e = Math.random() * 16 | 0;
        return (t === "x" ? e : e & 3 | 8).toString(16);
      });
    }
  }
  const p = ["ln-api-connector", "ln-couchdb-connector"];
  function h(n) {
    return this.dom = n, this._name = n.id, this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", n), n[i] = this, n[b] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new ri(), this._dict = Nt(n, "data-ln-data-coordinator-dict"), this._parseStaleAttributes(), this.refreshMapper(), r(this), m.add(this), d(), this._checkInitialSync(), this;
  }
  h.prototype._parseStaleAttributes = function() {
    const t = this.findChildren().storeEl, e = this.dom.getAttribute("data-ln-data-coordinator-stale") || (t ? t.getAttribute("data-ln-data-store-stale") : null), l = parseInt(e, 10);
    this._staleThreshold = e === "never" || e === "-1" ? -1 : isNaN(l) ? 300 : l;
    const v = this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (t ? t.hasAttribute("data-ln-data-store-no-autosync") : !1);
    this._noAutosync = !!v;
  }, h.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const t = this.findChildren().store;
    return !t || !t.lastSyncedAt ? !0 : Date.now() / 1e3 - t.lastSyncedAt > this._staleThreshold;
  }, h.prototype._maybeSync = function() {
    const n = this.findChildren(), t = n.store;
    !t || t.initializationError || !n.connector || this._noAutosync || !t.isInitialized || t.isSyncing || (!t.hasCache || this._isStale()) && t.forceSync();
  }, h.prototype._checkInitialSync = function() {
    const n = this, e = this.findChildren().store;
    e && Promise.resolve(e.ready).then(function() {
      const l = n.findChildren(), v = l.store;
      if (v && v.initializationError) {
        n._reportReconciliationError("store-initialize", v.initializationError, null);
        return;
      }
      !v || !l.connector || n._noAutosync || v.isSyncing || (!v.hasCache || n._isStale()) && v.forceSync();
    }).catch(function(l) {
      n._reportReconciliationError("store-initialize", l, null);
    });
  }, h.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const t = this.dom.getAttribute("data-ln-data-mapper") || this.dom.id;
    t && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(t)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(e) {
      return e;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(e) {
      return e;
    });
  }, h.prototype.findChildren = function() {
    const n = this.dom.querySelector("[data-ln-data-store]"), t = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]"), e = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: n,
      connectorEl: t,
      queueEl: e,
      store: n ? n.lnDataStore || n.lnStore : null,
      connector: t ? t.lnConnector || t.lnApiConnector || t.lnCouchDbConnector : null,
      queue: e ? e.lnApiQueue : null
    };
  }, h.prototype._handleSubmitRecord = function(n) {
    const t = this.findChildren();
    if (!t.storeEl) {
      console.warn('[ln-data-coordinator] form submit claimed but no [data-ln-data-store] child found in "' + (this._name || "") + '"');
      return;
    }
    const e = n.data || {}, l = e.id, v = e.expected_version, w = Object.assign({}, e);
    delete w.id, delete w.expected_version;
    const E = n.method.toUpperCase();
    E === "POST" ? this._fanOutCreate(t, w, n.action) : (E === "PUT" || E === "PATCH") && this._fanOutUpdate(t, l, w, v, n.action);
  }, h.prototype._fanOutCreate = function(n, t, e) {
    this.refreshMapper();
    const l = "_temp_" + c();
    C(n.storeEl, "ln-data-store:request-create", { tempId: l, data: t }), n.queue ? C(n.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: l,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(t),
      expectedVersion: null,
      meta: { tempId: l, action: e }
    }) : n.connector && C(n.connectorEl, "ln-api-connector:request-create", {
      data: this.mapper.egress(t),
      url: e,
      meta: { entryId: c(), queued: !1, op: "create", tempId: l }
    });
  }, h.prototype._fanOutUpdate = function(n, t, e, l, v) {
    this.refreshMapper(), C(n.storeEl, "ln-data-store:request-update", { id: t, data: e }), n.queue ? C(n.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: t,
      op: "update",
      targetId: t,
      payload: this.mapper.egress(e),
      expectedVersion: l,
      meta: { id: t, action: v }
    }) : n.connector && C(n.connectorEl, "ln-api-connector:request-update", {
      id: t,
      data: this.mapper.egress(e),
      expected_version: l,
      url: v,
      meta: { entryId: c(), queued: !1, op: "update", id: t }
    });
  }, h.prototype._fanOutDelete = function(n, t) {
    this.refreshMapper(), C(n.storeEl, "ln-data-store:request-delete", { id: t }), n.queue ? C(n.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: t,
      op: "delete",
      targetId: t,
      payload: null,
      expectedVersion: null,
      meta: { id: t }
    }) : n.connector && C(n.connectorEl, "ln-api-connector:request-delete", {
      id: t,
      meta: { entryId: c(), queued: !1, op: "delete", id: t }
    });
  }, h.prototype._fanOutBulkDelete = function(n, t) {
    this.refreshMapper();
    const e = t.join(",");
    C(n.storeEl, "ln-data-store:request-bulk-delete", { ids: t }), n.queue ? C(n.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: e,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: t },
      expectedVersion: null,
      meta: { bulkKey: e, ids: t }
    }) : n.connector && C(n.connectorEl, "ln-api-connector:request-bulk-delete", {
      ids: t,
      meta: { entryId: c(), queued: !1, op: "bulk-delete", bulkKey: e }
    });
  }, h.prototype._toastFromMessage = function(n) {
    n && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: n.type || "success",
        title: n.title || "",
        message: n.body || ""
      }
    }));
  }, h.prototype._toastFromDict = function(n) {
    const t = this._dict[n];
    t && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: "error", title: "", message: t }
    }));
  }, h.prototype._requestStoreMutation = function(n, t, e) {
    const l = n.storeEl;
    if (!l) return Promise.reject(new Error("Store element not found"));
    const v = c(), w = this._mutationReceipts.wait(v);
    return C(l, "ln-data-store:request-" + t, Object.assign({}, e, { requestId: v })), w;
  }, h.prototype._reportReconciliationError = function(n, t, e) {
    C(this.dom, "ln-data-coordinator:error", {
      operation: n,
      error: t,
      meta: e || null
    });
  };
  function r(n) {
    n._handlers = {
      sync: function(t) {
        n.refreshMapper();
        const e = n.findChildren();
        if (!e.store || !e.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        C(e.connectorEl, "ln-api-connector:request-sync", { since: t.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(t) {
        const e = n.findChildren();
        if (!e.connectorEl) return;
        const l = t.detail || {};
        C(e.connectorEl, "ln-api-connector:request-query", {
          query: Object.assign({}, l.query, {
            offset: l.offset,
            limit: l.limit,
            queryGen: l.queryGen
          })
        });
      },
      reqCreate: function(t) {
        const e = n.findChildren();
        e.storeEl && n._fanOutCreate(e, t.detail.data || {}, t.detail.action);
      },
      reqUpdate: function(t) {
        const e = n.findChildren();
        e.storeEl && n._fanOutUpdate(e, t.detail.id, t.detail.data || {}, t.detail.expected_version, t.detail.action);
      },
      reqDelete: function(t) {
        const e = n.findChildren();
        e.storeEl && n._fanOutDelete(e, t.detail.id);
      },
      reqBulkDelete: function(t) {
        const e = n.findChildren();
        e.storeEl && n._fanOutBulkDelete(e, t.detail.ids || []);
      },
      queueFailed: function() {
        n._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(t) {
        n.refreshMapper();
        const e = n.findChildren();
        if (!e.store || !e.connector || !e.queue) return;
        const l = t.detail || {}, v = l.entryId, w = l.op, E = l.targetId, S = l.payload, L = l.expectedVersion, x = l.meta || {}, k = x.action || null, q = l.idempotencyKey || v;
        w === "create" ? C(e.connectorEl, "ln-api-connector:request-create", {
          data: S,
          url: k,
          idempotencyKey: q,
          meta: { entryId: v, queued: !0, op: "create", tempId: x.tempId }
        }) : w === "update" ? C(e.connectorEl, "ln-api-connector:request-update", {
          id: E,
          data: S,
          expected_version: L,
          url: k,
          idempotencyKey: q,
          meta: { entryId: v, queued: !0, op: "update", id: E }
        }) : w === "delete" ? C(e.connectorEl, "ln-api-connector:request-delete", {
          id: E,
          idempotencyKey: q,
          meta: { entryId: v, queued: !0, op: "delete", id: E }
        }) : w === "bulk-delete" ? C(e.connectorEl, "ln-api-connector:request-bulk-delete", {
          ids: S && S.ids ? S.ids : [],
          idempotencyKey: q,
          meta: { entryId: v, queued: !0, op: "bulk-delete", bulkKey: x.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", w);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(t) {
        const e = t.target;
        if (t.defaultPrevented) return;
        const l = e.hasAttribute(y) ? e.getAttribute(y) : null;
        if (l === null) return;
        let v;
        if (l ? v = l === n._name : v = e.closest("[data-ln-data-coordinator]") === n.dom, !v) return;
        const w = mn(e);
        if (w !== "POST" && w !== "PUT" && w !== "PATCH") return;
        t.preventDefault();
        const E = qe(e);
        delete E._method, delete E._token, n._handleSubmitRecord({ data: E, method: w, action: e.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(t) {
        const e = t.detail.meta || {}, l = n.findChildren();
        n.refreshMapper();
        const v = t.detail.data;
        let w = [], E = [], S = null;
        Array.isArray(v) ? (w = v, S = Math.floor(Date.now() / 1e3)) : v && (w = Array.isArray(v.data) ? v.data : [], E = Array.isArray(v.deleted) ? v.deleted : [], S = v.synced_at !== void 0 ? v.synced_at : v.since !== void 0 ? v.since : null);
        const L = w.map((x) => n.mapper.ingress(x));
        if (l.store && !l.store.initializationError)
          e.kind ? e.kind === "table" || e.kind === "list" || e.kind === "chart" ? l.store.applyQuery(L, { total: t.detail.total }).then(function(x) {
            C(e.targetEl, "ln-" + e.kind + ":set-loading", { loading: !1 }), C(e.targetEl, "ln-" + e.kind + ":set-data", {
              data: x,
              total: t.detail.total !== void 0 ? t.detail.total : x.length,
              filtered: t.detail.filtered !== void 0 ? t.detail.filtered : x.length,
              offset: t.detail.offset,
              queryGen: t.detail.queryGen
            }), n._boundDelivered.set(e.targetEl, !0);
          }) : e.kind === "options" ? l.store.applyQuery(L, { total: t.detail.total }).then(function() {
            return l.store.getAll({});
          }).then(function(x) {
            C(e.targetEl, "ln-options:set-data", { data: x.data });
          }) : e.kind === "stat" && l.store.applyQuery(L, { total: t.detail.total }).then(function() {
            const x = t.detail.filtered !== void 0 ? t.detail.filtered : t.detail.total !== void 0 ? t.detail.total : L.length;
            C(e.targetEl, "ln-stat:set-count", { count: x });
          }) : l.store.applySync(L, E, S || Math.floor(Date.now() / 1e3), {
            total: t.detail.total,
            filtered: t.detail.filtered,
            offset: t.detail.offset,
            queryGen: t.detail.queryGen,
            targetEl: e.targetEl
          });
        else if (e.targetEl && e.kind) {
          if (e.kind === "table" || e.kind === "list" || e.kind === "chart")
            C(e.targetEl, "ln-" + e.kind + ":set-loading", { loading: !1 }), C(e.targetEl, "ln-" + e.kind + ":set-data", {
              data: L,
              total: t.detail.total !== void 0 ? t.detail.total : L.length,
              filtered: t.detail.filtered !== void 0 ? t.detail.filtered : L.length,
              offset: t.detail.offset,
              queryGen: t.detail.queryGen
            }), n._boundDelivered.set(e.targetEl, !0);
          else if (e.kind === "options")
            C(e.targetEl, "ln-options:set-data", { data: L });
          else if (e.kind === "stat") {
            const x = t.detail.filtered !== void 0 ? t.detail.filtered : t.detail.total !== void 0 ? t.detail.total : L.length;
            C(e.targetEl, "ln-stat:set-count", { count: x });
          }
        }
      },
      connCreated: function(t) {
        const e = n.findChildren();
        if (!e.storeEl) return;
        const l = t.detail.meta || {}, v = n.mapper.ingress(t.detail.record);
        n._requestStoreMutation(e, "update", { id: l.tempId, data: v }).then(function() {
          n._toastFromMessage(t.detail.message), l.queued && e.queue && C(e.queueEl, "ln-api-queue:resolve-create", {
            entryId: l.entryId,
            oldKey: l.tempId,
            newId: v.id
          });
        }).catch(function(w) {
          n._reportReconciliationError("create-reconcile", w, l);
        });
      },
      connUpdated: function(t) {
        const e = n.findChildren();
        if (!e.storeEl) return;
        const l = t.detail.meta || {}, v = n.mapper.ingress(t.detail.record);
        n._requestStoreMutation(e, "update", { id: l.id, data: v }).then(function() {
          n._toastFromMessage(t.detail.message), l.queued && e.queue && C(e.queueEl, "ln-api-queue:ack", { entryId: l.entryId });
        }).catch(function(w) {
          n._reportReconciliationError("update-reconcile", w, l);
        });
      },
      connDeleted: function(t) {
        const e = n.findChildren();
        if (!e.storeEl) return;
        const l = t.detail.meta || {};
        n._toastFromMessage(t.detail.message), l.queued && e.queue && C(e.queueEl, "ln-api-queue:ack", { entryId: l.entryId });
      },
      connBulkDeleted: function(t) {
        const e = n.findChildren();
        if (!e.storeEl) return;
        const l = t.detail.meta || {};
        n._toastFromMessage(t.detail.message), l.queued && e.queue && C(e.queueEl, "ln-api-queue:ack", { entryId: l.entryId });
      },
      connError: function(t) {
        const e = t.detail || {}, l = e.meta || {}, v = l.op || e.action, w = e.status || 0, E = n.findChildren();
        if (v === "sync") {
          E.storeEl && C(E.storeEl, "ln-data-store:request-sync-failed", {
            error: e.error,
            status: w
          }), console.error("[ln-data-coordinator] Sync failed:", e.error);
          return;
        }
        if (v === "query") {
          l.targetEl && l.kind && (C(l.targetEl, "ln-" + l.kind + ":set-loading", { loading: !1 }), (l.kind === "table" || l.kind === "list") && C(l.targetEl, "ln-" + l.kind + ":page-failed", { offset: l.offset })), n._reportReconciliationError("query", e.error || e, l);
          return;
        }
        if (!E.storeEl) return;
        const S = w === 401 || w === 419, L = w === 0 || w >= 500, x = w === 409 || w === 412;
        if (S) {
          n._toastFromDict("auth"), l.queued && E.queue && C(E.queueEl, "ln-api-queue:nack", { entryId: l.entryId, reason: "auth" });
          return;
        }
        if (L) {
          l.queued && E.queue ? C(E.queueEl, "ln-api-queue:nack", { entryId: l.entryId, reason: "retry" }) : n._toastFromDict("network");
          return;
        }
        let k = Promise.resolve();
        if (x && v === "update") {
          const q = e.data && e.data.remote ? n.mapper.ingress(e.data.remote) : null;
          q && (k = n._requestStoreMutation(E, "update", { id: l.id, data: q })), n._toastFromDict("conflict");
        } else v === "create" && (k = n._requestStoreMutation(E, "delete", { id: l.tempId })), n._toastFromDict("rejected");
        l.queued && E.queue ? k.then(function() {
          C(E.queueEl, "ln-api-queue:nack", { entryId: l.entryId, reason: "drop" });
        }).catch(function(q) {
          n._reportReconciliationError("deterministic-reconcile", q, l);
        }) : k.catch(function(q) {
          n._reportReconciliationError("deterministic-reconcile", q, l);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(t) {
        const e = n.findChildren(), l = e.store;
        if (!l || l.initializationError || !e.connector || n._noAutosync || l.isSyncing) return;
        (t.detail || {}).hasCache ? n._isStale() && l.forceSync() : l.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(t) {
        n._serveData(t, "table");
      },
      reqListData: function(t) {
        n._serveData(t, "list");
      },
      reqChartData: function(t) {
        n._serveData(t, "chart");
      },
      reqOptions: function(t) {
        n._serveOptions(t);
      },
      reqStat: function(t) {
        n._serveStat(t);
      },
      refreshQuery: function() {
        n._refreshAll(null, !0);
      },
      refresh: function(t) {
        n._mutationReceipts.resolve(t.detail), n._refreshAll(null, !1);
      },
      mutationError: function(t) {
        n._mutationReceipts.reject(t.detail);
      },
      refreshSynced: function(t) {
        t.detail && t.detail.changed && n._refreshAll(t.detail.meta, !1);
      }
    }, n.dom.addEventListener("ln-data-store:request-remote-sync", n._handlers.sync), n.dom.addEventListener("ln-data-store:request-page", n._handlers.requestPage), n.dom.addEventListener("ln-data-coordinator:request-create", n._handlers.reqCreate), n.dom.addEventListener("ln-data-coordinator:request-update", n._handlers.reqUpdate), n.dom.addEventListener("ln-data-coordinator:request-delete", n._handlers.reqDelete), n.dom.addEventListener("ln-data-coordinator:request-bulk-delete", n._handlers.reqBulkDelete), n.dom.addEventListener("ln-api-queue:send", n._handlers.queueSend), n.dom.addEventListener("ln-api-queue:failed", n._handlers.queueFailed), n.dom.addEventListener("ln-data-store:initialized", n._handlers.storeInitialized), document.addEventListener("submit", n._handlers.formSubmit), p.forEach(function(t) {
      n.dom.addEventListener(t + ":fetched", n._handlers.connFetched), n.dom.addEventListener(t + ":created", n._handlers.connCreated), n.dom.addEventListener(t + ":updated", n._handlers.connUpdated), n.dom.addEventListener(t + ":deleted", n._handlers.connDeleted), n.dom.addEventListener(t + ":bulk-deleted", n._handlers.connBulkDeleted), n.dom.addEventListener(t + ":error", n._handlers.connError);
    }), document.addEventListener("ln-table:request-data", n._handlers.reqTableData), document.addEventListener("ln-list:request-data", n._handlers.reqListData), document.addEventListener("ln-chart:request-data", n._handlers.reqChartData), document.addEventListener("ln-options:request-data", n._handlers.reqOptions), document.addEventListener("ln-stat:request-count", n._handlers.reqStat), n.dom.addEventListener("ln-data-store:ready", n._handlers.refresh), n.dom.addEventListener("ln-data-store:created", n._handlers.refresh), n.dom.addEventListener("ln-data-store:updated", n._handlers.refresh), n.dom.addEventListener("ln-data-store:deleted", n._handlers.refresh), n.dom.addEventListener("ln-data-store:mutation-error", n._handlers.mutationError), n.dom.addEventListener("ln-data-store:synced", n._handlers.refreshSynced), n.dom.addEventListener("ln-data-store:query-changed", n._handlers.refreshQuery);
  }
  h.prototype._ownsStore = function(n) {
    const t = this.findChildren();
    return !!(t.store && t.store._name === n && n);
  }, h.prototype._serveData = function(n, t) {
    const e = n.target, l = t === "table" ? "data-ln-table-source" : t === "list" ? "data-ln-list-source" : "data-ln-chart-source", v = e.getAttribute(l);
    if (!v || !this._ownsStore(v)) return;
    const w = n.detail || {}, E = ii(w);
    this._boundQueries.set(e, E);
    const S = this.findChildren(), L = this, x = S.store;
    return (x && x.ready ? x.ready : Promise.resolve()).then(function() {
      const q = It(x, S.connector), O = ve(E, x && x.query);
      if (q === "remote") {
        C(e, "ln-" + t + ":set-loading", { loading: !0 }), C(S.connectorEl, "ln-api-connector:request-query", {
          query: O,
          meta: { targetEl: e, kind: t, offset: O.offset, limit: O.limit }
        });
        return;
      }
      if (q !== "store") {
        C(e, "ln-" + t + ":set-loading", { loading: !1 });
        return;
      }
      return x.getAll(O).then(function(F) {
        const P = {
          data: F.data,
          total: F.total,
          filtered: F.filtered,
          offset: w.offset !== void 0 ? w.offset : F.offset,
          queryGen: w.queryGen !== void 0 ? w.queryGen : F.queryGen,
          // The store answered from its own records while the server query
          // is still out; the view renders it but keeps the refresh showing.
          provisional: F.provisional === !0
        };
        C(e, "ln-" + t + ":set-data", P), L._boundDelivered.set(e, !0);
      });
    }).catch(function(q) {
      C(e, "ln-" + t + ":set-loading", { loading: !1 }), C(L.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: t,
        store: v,
        target: e,
        error: q
      });
    });
  }, h.prototype._serveOptions = function(n) {
    const t = n.target, e = t.getAttribute("data-ln-options");
    if (!this._ownsStore(e)) return;
    const l = this.findChildren(), v = l.store, w = v && v.ready ? v.ready : Promise.resolve(), E = this;
    return w.then(function() {
      const S = It(v, l.connector);
      if (S === "remote") {
        C(l.connectorEl, "ln-api-connector:request-query", {
          query: {},
          meta: { targetEl: t, kind: "options" }
        });
        return;
      }
      if (S === "store")
        return v.getAll({}).then(function(L) {
          C(t, "ln-options:set-data", { data: L.data });
        });
    }).catch(function(S) {
      E._reportReconciliationError("options-query", S, { targetEl: t, kind: "options" });
    });
  }, h.prototype._serveStat = function(n) {
    const t = n.target, e = t.getAttribute("data-ln-stat");
    if (!this._ownsStore(e)) return;
    const l = n.detail && n.detail.filters ? n.detail.filters : null, v = this.findChildren(), w = v.store, E = w && w.ready ? w.ready : Promise.resolve(), S = this;
    return E.then(function() {
      const L = l && Object.keys(l).length > 0, k = !!(v.connector && w && ((w.windowed || w._windowIndex) && L || w.noLocalQuery)) ? "remote" : It(w, v.connector);
      if (k === "remote") {
        C(v.connectorEl, "ln-api-connector:request-query", {
          query: { filters: l },
          meta: { targetEl: t, kind: "stat" }
        });
        return;
      }
      if (k === "store")
        return w.count(l).then(function(q) {
          C(t, "ln-stat:set-count", { count: q });
        });
    }).catch(function(L) {
      S._reportReconciliationError("stat-query", L, { targetEl: t, kind: "stat" });
    });
  }, h.prototype._refreshAll = function(n, t) {
    const e = this, l = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let v = 0; v < l.length; v++) {
      const w = l[v];
      let E, S;
      if (w.hasAttribute("data-ln-table-source") ? (E = w.getAttribute("data-ln-table-source"), S = "table") : w.hasAttribute("data-ln-list-source") ? (E = w.getAttribute("data-ln-list-source"), S = "list") : w.hasAttribute("data-ln-chart-source") ? (E = w.getAttribute("data-ln-chart-source"), S = "chart") : w.hasAttribute("data-ln-options") ? (E = w.getAttribute("data-ln-options"), S = "options") : w.hasAttribute("data-ln-stat") && (E = w.getAttribute("data-ln-stat"), S = "stat"), !e._ownsStore(E)) continue;
      const L = e.findChildren(), x = L.store;
      if (S === "table" || S === "list") {
        const k = S === "table" ? "data-ln-table-window" : "data-ln-list-window";
        if (w.hasAttribute(k)) {
          C(w, "ln-" + S + (t ? ":request-invalidate" : ":request-revalidate"), {});
          continue;
        }
      }
      if (S === "table" || S === "list" || S === "chart") {
        const k = e._boundQueries.get(w) || { sort: null, filters: {}, search: "" }, q = ve(k, x.query);
        if (It(x, L.connector) === "remote") {
          C(w, "ln-" + S + ":set-loading", { loading: !0 }), C(L.connectorEl, "ln-api-connector:request-query", {
            query: q,
            meta: { targetEl: w, kind: S, offset: q.offset, limit: q.limit }
          });
          continue;
        }
        (function(O, F) {
          x.getAll(q).then(function(P) {
            const V = {
              data: P.data,
              total: n && n.total !== void 0 ? n.total : P.total,
              filtered: n && n.filtered !== void 0 ? n.filtered : P.filtered,
              offset: P.offset !== void 0 ? P.offset : n && n.offset !== void 0 ? n.offset : k.offset,
              queryGen: P.queryGen !== void 0 ? P.queryGen : n && n.queryGen !== void 0 ? n.queryGen : k.queryGen
            };
            C(O, "ln-" + F + ":set-loading", { loading: !1 }), C(O, "ln-" + F + ":set-data", V), e._boundDelivered.set(O, !0);
          });
        })(w, S);
      } else if (S === "options")
        (function(k) {
          x.getAll({}).then(function(q) {
            C(k, "ln-options:set-data", { data: q.data });
          });
        })(w);
      else if (S === "stat") {
        const k = w.getAttribute("data-ln-stat-filter");
        let q = null;
        if (k) {
          const O = k.indexOf(":");
          if (O !== -1) {
            const F = k.slice(0, O), P = k.slice(O + 1);
            q = {}, q[F] = [P];
          }
        }
        (function(O, F) {
          x.count(F).then(function(P) {
            C(O, "ln-stat:set-count", { count: P });
          });
        })(w, q);
      }
    }
  }, h.prototype.destroy = function() {
    if (!this.dom[i]) return;
    const n = this;
    n._handlers && (n.dom.removeEventListener("ln-data-store:request-remote-sync", n._handlers.sync), n.dom.removeEventListener("ln-data-store:request-page", n._handlers.requestPage), n.dom.removeEventListener("ln-data-coordinator:request-create", n._handlers.reqCreate), n.dom.removeEventListener("ln-data-coordinator:request-update", n._handlers.reqUpdate), n.dom.removeEventListener("ln-data-coordinator:request-delete", n._handlers.reqDelete), n.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", n._handlers.reqBulkDelete), n.dom.removeEventListener("ln-api-queue:send", n._handlers.queueSend), n.dom.removeEventListener("ln-api-queue:failed", n._handlers.queueFailed), n.dom.removeEventListener("ln-data-store:initialized", n._handlers.storeInitialized), document.removeEventListener("submit", n._handlers.formSubmit), p.forEach(function(t) {
      n.dom.removeEventListener(t + ":fetched", n._handlers.connFetched), n.dom.removeEventListener(t + ":created", n._handlers.connCreated), n.dom.removeEventListener(t + ":updated", n._handlers.connUpdated), n.dom.removeEventListener(t + ":deleted", n._handlers.connDeleted), n.dom.removeEventListener(t + ":bulk-deleted", n._handlers.connBulkDeleted), n.dom.removeEventListener(t + ":error", n._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", n._handlers.reqTableData), document.removeEventListener("ln-list:request-data", n._handlers.reqListData), document.removeEventListener("ln-chart:request-data", n._handlers.reqChartData), document.removeEventListener("ln-options:request-data", n._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", n._handlers.reqStat), n.dom.removeEventListener("ln-data-store:ready", n._handlers.refresh), n.dom.removeEventListener("ln-data-store:created", n._handlers.refresh), n.dom.removeEventListener("ln-data-store:updated", n._handlers.refresh), n.dom.removeEventListener("ln-data-store:deleted", n._handlers.refresh), n.dom.removeEventListener("ln-data-store:mutation-error", n._handlers.mutationError), n.dom.removeEventListener("ln-data-store:synced", n._handlers.refreshSynced), n.dom.removeEventListener("ln-data-store:query-changed", n._handlers.refreshQuery), n._handlers = null), n._boundQueries = null, n._boundDelivered = null, n._mutationReceipts.close(new Error("Data coordinator destroyed")), n._mutationReceipts = null, m.delete(this), _(), delete this.dom[i], delete this.dom[b];
  };
  function a(n, t) {
    const e = n[i];
    e && t === "data-ln-data-mapper" && e.refreshMapper();
  }
  H(o, i, h, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: a
  });
})();
const oi = "ln_api_queue", si = 2, $ = "outbox", J = "_queue_meta";
function tt(o, i) {
  return o.error || new Error(i);
}
function yt(o, i) {
  return o.bound([i, -1 / 0], [i, 1 / 0]);
}
function we(o) {
  return "seq:" + o;
}
function Dt(o) {
  return "paused:" + o;
}
function Ee(o) {
  o.leaseOwner = null, o.leaseUntil = 0;
}
function ai(o, i, b) {
  return typeof o != "string" || o.indexOf(i) === -1 ? o : o.split(i).join(b);
}
function li(o, i, b, y) {
  const m = /* @__PURE__ */ new Map(), g = [], f = [];
  for (const s of o || [])
    m.has(s.chainKey) || m.set(s.chainKey, []), m.get(s.chainKey).push(s);
  return m.forEach((s, u) => {
    s.sort((_, c) => _.seq - c.seq);
    const d = s[0];
    if (!(!d || d.status === "failed")) {
      if (d.status === "inflight" && (d.leaseUntil || 0) > y) {
        f.push({ chainKey: u, at: d.leaseUntil });
        return;
      }
      if ((d.nextAttemptAt || 0) > y) {
        f.push({ chainKey: u, at: d.nextAttemptAt });
        return;
      }
      d.status = "inflight", d.leaseOwner = i, d.leaseUntil = y + b, d.updatedAt = y, g.push(d);
    }
  }), { entries: g, wakeups: f };
}
function ci(o, i, b, y, m) {
  const g = [], f = [];
  for (const s of o || []) {
    if (s.entryId === i) {
      f.push(s.entryId);
      continue;
    }
    s.chainKey === b && (s.chainKey = y, s.targetId === b && (s.targetId = y), s.meta && s.meta.id === b && (s.meta.id = y), s.meta && typeof s.meta.action == "string" && (s.meta.action = ai(s.meta.action, b, y)), s.updatedAt = m, g.push(s));
  }
  return { changed: g, deleted: f };
}
class di {
  constructor(i) {
    i = i || {}, this.indexedDB = i.indexedDB || globalThis.indexedDB, this.keyRange = i.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = i.dbName || oi, this.now = i.now || (() => Date.now()), this.uuid = i.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((i, b) => {
      const y = this.indexedDB.open(this.dbName, si);
      y.onupgradeneeded = (m) => {
        const g = m.target.result;
        let f;
        g.objectStoreNames.contains($) ? f = m.target.transaction.objectStore($) : f = g.createObjectStore($, { keyPath: "entryId" }), f.indexNames.contains("by_scope_chain") || f.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), f.indexNames.contains("by_scope_seq") || f.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), g.objectStoreNames.contains(J) || g.createObjectStore(J, { keyPath: "key" });
      }, y.onerror = () => b(tt(y, "Queue database open failed")), y.onsuccess = (m) => {
        this._db = m.target.result, this._db.onversionchange = () => this.close(), i(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((i, b) => {
      const y = this.indexedDB.deleteDatabase(this.dbName);
      y.onsuccess = () => i(), y.onerror = () => b(tt(y, "Queue database delete failed")), y.onblocked = () => b(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(i) {
    return this.open().then((b) => b ? new Promise((y, m) => {
      const f = b.transaction($, "readonly").objectStore($).index("by_scope_seq").getAll(yt(this.keyRange, i));
      f.onsuccess = () => y(f.result || []), f.onerror = () => m(tt(f, "Queue scope read failed"));
    }) : []);
  }
  enqueue(i, b) {
    return b = b || {}, this.open().then((y) => y ? new Promise((m, g) => {
      const f = y.transaction([J, $], "readwrite"), s = f.objectStore(J), u = f.objectStore($), d = we(i);
      let _ = null;
      const c = (h) => {
        const r = h + 1;
        _ = {
          entryId: this.uuid(),
          scope: i,
          chainKey: b.chainKey,
          seq: r,
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
        }, s.put({ key: d, value: r }), u.put(_);
      }, p = s.get(d);
      p.onerror = () => g(tt(p, "Queue sequence read failed")), p.onsuccess = () => {
        const h = p.result;
        if (h && typeof h.value == "number") {
          c(h.value);
          return;
        }
        const r = u.index("by_scope_seq").getAll(yt(this.keyRange, i));
        r.onerror = () => g(tt(r, "Queue sequence migration failed")), r.onsuccess = () => {
          const a = (r.result || []).reduce((n, t) => Math.max(n, t.seq || 0), 0);
          c(a);
        };
      }, f.oncomplete = () => m(_), f.onerror = () => g(f.error || new Error("Queue enqueue transaction failed")), f.onabort = () => g(f.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(i, b, y) {
    return this.open().then((m) => m ? new Promise((g, f) => {
      const s = m.transaction($, "readwrite"), u = s.objectStore($), d = u.index("by_scope_seq").getAll(yt(this.keyRange, i)), _ = this.now();
      let c = { entries: [], wakeups: [] };
      d.onerror = () => f(tt(d, "Queue claim read failed")), d.onsuccess = () => {
        c = li(d.result || [], b, y, _);
        for (const p of c.entries) u.put(p);
      }, s.oncomplete = () => g(c), s.onerror = () => f(s.error || new Error("Queue claim transaction failed")), s.onabort = () => f(s.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(i, b) {
    return this._updateEntry(i, b, (y, m) => (m.delete(y.entryId), { status: "acked", entry: y }));
  }
  nack(i, b, y, m) {
    m = m || {};
    const g = m.maxAttempts || 8, f = m.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((s) => s ? new Promise((u, d) => {
      const _ = s.transaction([$, J], "readwrite"), c = _.objectStore($), p = _.objectStore(J), h = c.get(b);
      let r = null;
      h.onerror = () => d(tt(h, "Queue nack read failed")), h.onsuccess = () => {
        const a = h.result;
        if (!(!a || a.scope !== i)) {
          if (y === "drop") {
            c.delete(a.entryId), r = { status: "dropped", entry: a };
            return;
          }
          if (Ee(a), a.updatedAt = this.now(), y === "auth") {
            a.status = "pending", c.put(a), p.put({ key: Dt(i), value: "auth" }), r = { status: "auth", entry: a };
            return;
          }
          if (y === "retry") {
            if (a.attempts = (a.attempts || 0) + 1, a.attempts >= g) {
              a.status = "failed", a.nextAttemptAt = 0, c.put(a), r = { status: "failed", entry: a };
              return;
            }
            const n = f[Math.min(a.attempts - 1, f.length - 1)];
            a.status = "pending", a.nextAttemptAt = this.now() + n, c.put(a), r = { status: "retry", entry: a, delay: n };
          }
        }
      }, _.oncomplete = () => u(r), _.onerror = () => d(_.error || new Error("Queue nack transaction failed")), _.onabort = () => d(_.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(i, b, y) {
    return this._remapTransaction(i, null, b, y);
  }
  resolveCreate(i, b, y, m) {
    return this._remapTransaction(i, b, y, m);
  }
  _remapTransaction(i, b, y, m) {
    return this.open().then((g) => g ? new Promise((f, s) => {
      const u = g.transaction($, "readwrite"), d = u.objectStore($), _ = d.index("by_scope_seq").getAll(yt(this.keyRange, i));
      let c = { changed: [], deleted: [] };
      _.onerror = () => s(tt(_, "Queue remap read failed")), _.onsuccess = () => {
        c = ci(_.result || [], b, y, m, this.now());
        for (const p of c.deleted) d.delete(p);
        for (const p of c.changed) d.put(p);
      }, u.oncomplete = () => f(c.changed), u.onerror = () => s(u.error || new Error("Queue remap transaction failed")), u.onabort = () => s(u.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(i) {
    return this.open().then((b) => b ? new Promise((y, m) => {
      const g = b.transaction($, "readwrite"), f = g.objectStore($), s = f.index("by_scope_seq").getAll(yt(this.keyRange, i));
      let u = 0;
      s.onerror = () => m(tt(s, "Queue failed-entry read failed")), s.onsuccess = () => {
        for (const d of s.result || [])
          d.status === "failed" && (d.status = "pending", d.attempts = 0, d.nextAttemptAt = 0, d.updatedAt = this.now(), Ee(d), f.put(d), u++);
      }, g.oncomplete = () => y(u), g.onerror = () => m(g.error || new Error("Queue failed-entry reset failed")), g.onabort = () => m(g.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(i) {
    return this.open().then((b) => b ? new Promise((y, m) => {
      const f = b.transaction(J, "readonly").objectStore(J).get(Dt(i));
      f.onsuccess = () => {
        const s = f.result ? f.result.value : !1;
        y(s || !1);
      }, f.onerror = () => m(tt(f, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(i, b) {
    return this.open().then((y) => {
      if (y)
        return new Promise((m, g) => {
          const f = y.transaction(J, "readwrite"), s = typeof b == "string" ? b : b ? "manual" : !1;
          f.objectStore(J).put({ key: Dt(i), value: s }), f.oncomplete = () => m(), f.onerror = () => g(f.error || new Error("Queue pause-state write failed")), f.onabort = () => g(f.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(i) {
    return this.open().then((b) => {
      if (b)
        return new Promise((y, m) => {
          const g = b.transaction([$, J], "readwrite"), s = g.objectStore($).index("by_scope_seq").openCursor(yt(this.keyRange, i));
          s.onsuccess = (u) => {
            const d = u.target.result;
            d && (d.delete(), d.continue());
          }, s.onerror = () => m(tt(s, "Queue clear failed")), g.objectStore(J).delete(we(i)), g.objectStore(J).delete(Dt(i)), g.oncomplete = () => y(), g.onerror = () => m(g.error || new Error("Queue clear transaction failed")), g.onabort = () => m(g.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(i, b, y) {
    return this.open().then((m) => m ? new Promise((g, f) => {
      const s = m.transaction($, "readwrite"), u = s.objectStore($), d = u.get(b);
      let _ = null;
      d.onerror = () => f(tt(d, "Queue entry read failed")), d.onsuccess = () => {
        const c = d.result;
        !c || c.scope !== i || (_ = y(c, u));
      }, s.oncomplete = () => g(_), s.onerror = () => f(s.error || new Error("Queue entry transaction failed")), s.onabort = () => f(s.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const o = "data-ln-api-queue", i = "lnApiQueue", b = [2e3, 5e3, 15e3, 6e4, 3e5], y = 8, m = 6e4;
  if (window[i] !== void 0) return;
  function g() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (_) => {
        const c = Math.random() * 16 | 0;
        return (_ === "x" ? c : c & 3 | 8).toString(16);
      });
    }
  }
  const f = new di({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: g
  });
  function s(d) {
    this.dom = d, d[i] = this;
    const _ = d.closest("[data-ln-data-coordinator]");
    this.scope = d.id || (_ ? _.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = g(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const c = this;
    return f.open().then((p) => p ? f.getPaused(c.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((p) => {
      if (c._paused = !!p, c._paused) {
        const h = typeof p == "string" ? p : "auth";
        C(c.dom, "ln-api-queue:paused", { reason: h, restored: !0 });
      }
      return c._emitPendingCount();
    }).then(() => c._drain()).catch((p) => {
      console.error("[ln-api-queue] Initialization failed:", p), C(c.dom, "ln-api-queue:error", { operation: "initialize", error: p });
    }), this;
  }
  s.prototype._isOnline = function() {
    const d = this.dom.getAttribute("data-ln-api-queue-online");
    return d === "true" ? !0 : d === "false" ? !1 : navigator.onLine;
  }, s.prototype._emitPendingCount = function() {
    const d = this;
    return f.allForScope(d.scope).then((_) => (C(d.dom, "ln-api-queue:pending-count", { count: _.length, scope: d.scope }), _.length === 0 && C(d.dom, "ln-api-queue:drained", { scope: d.scope }), _));
  }, s.prototype._clearTimer = function(d) {
    const _ = this._timers.get(d);
    _ && (clearTimeout(_), this._timers.delete(d));
  }, s.prototype._scheduleTimer = function(d, _) {
    const c = Math.max(0, _), p = this._timers.get(d);
    p && clearTimeout(p);
    const h = this, r = setTimeout(() => {
      h._timers.delete(d), h._drain();
    }, c);
    this._timers.set(d, r);
  }, s.prototype._drain = function() {
    const d = this;
    return d._paused || !d._isOnline() ? Promise.resolve() : (d._drainPromise || (d._drainPromise = f.claimReady(d.scope, d._workerId, m).then((_) => {
      for (const c of _.wakeups)
        d._scheduleTimer(c.chainKey, c.at - Date.now());
      for (const c of _.entries)
        d._clearTimer(c.chainKey), C(d.dom, "ln-api-queue:send", {
          entryId: c.entryId,
          chainKey: c.chainKey,
          op: c.op,
          targetId: c.targetId,
          payload: c.payload,
          expectedVersion: c.expectedVersion,
          idempotencyKey: c.entryId,
          meta: c.meta
        });
    }).catch((_) => {
      console.error("[ln-api-queue] Drain failed:", _), C(d.dom, "ln-api-queue:error", { operation: "drain", error: _ });
    }).finally(() => {
      d._drainPromise = null;
    })), d._drainPromise);
  }, s.prototype._onEnqueue = function(d) {
    const _ = this;
    return f.enqueue(_.scope, d.detail || {}).then((c) => {
      if (c)
        return _._emitPendingCount().then((p) => (C(_.dom, "ln-api-queue:enqueued", {
          entryId: c.entryId,
          chainKey: c.chainKey,
          count: p.length
        }), _._drain()));
    }).catch((c) => {
      C(_.dom, "ln-api-queue:error", { operation: "enqueue", error: c });
    });
  }, s.prototype._onAck = function(d) {
    const _ = this, c = d.detail || {};
    return f.ack(_.scope, c.entryId).then(() => _._emitPendingCount()).then(() => _._drain()).catch((p) => {
      C(_.dom, "ln-api-queue:error", { operation: "ack", entryId: c.entryId, error: p });
    });
  }, s.prototype._onNack = function(d) {
    const _ = this, c = d.detail || {};
    return f.nack(_.scope, c.entryId, c.reason, {
      maxAttempts: y,
      backoff: b
    }).then((p) => {
      if (p)
        return p.status === "failed" ? C(_.dom, "ln-api-queue:failed", {
          entryId: p.entry.entryId,
          chainKey: p.entry.chainKey,
          attempts: p.entry.attempts
        }) : p.status === "retry" ? _._scheduleTimer(p.entry.chainKey, p.delay) : p.status === "auth" && (_._paused = !0, C(_.dom, "ln-api-queue:paused", { reason: "auth" }), C(_.dom, "ln-api-queue:auth-required", {
          entryId: p.entry.entryId,
          chainKey: p.entry.chainKey
        })), _._emitPendingCount().then(() => {
          if (p.status === "dropped") return _._drain();
        });
    }).catch((p) => {
      C(_.dom, "ln-api-queue:error", { operation: "nack", entryId: c.entryId, error: p });
    });
  }, s.prototype._onRemap = function(d) {
    const _ = this, c = d.detail || {};
    return f.remap(_.scope, c.oldKey, c.newId).catch((p) => {
      C(_.dom, "ln-api-queue:error", { operation: "remap", error: p });
    });
  }, s.prototype._onResolveCreate = function(d) {
    const _ = this, c = d.detail || {};
    return f.resolveCreate(_.scope, c.entryId, c.oldKey, c.newId).then(() => _._emitPendingCount()).then(() => _._drain()).catch((p) => {
      C(_.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: c.entryId,
        error: p
      });
    });
  }, s.prototype._onResume = function() {
    const d = this;
    return f.setPaused(d.scope, !1).then(() => (d._paused = !1, C(d.dom, "ln-api-queue:resumed", {}), d._drain())).catch((_) => {
      C(d.dom, "ln-api-queue:error", { operation: "resume", error: _ });
    });
  }, s.prototype._onPause = function() {
    const d = this;
    return f.setPaused(d.scope, "manual").then(() => {
      d._paused = !0, C(d.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((_) => {
      C(d.dom, "ln-api-queue:error", { operation: "pause", error: _ });
    });
  }, s.prototype._onDrain = function() {
    const d = this;
    return f.resetFailed(d.scope).then(() => {
      const _ = d._drainPromise;
      return _ ? _.then(() => d._drain()) : d._drain();
    }).catch((_) => {
      C(d.dom, "ln-api-queue:error", { operation: "manual-drain", error: _ });
    });
  }, s.prototype._onClear = function() {
    const d = this;
    return d._timers.forEach((_) => clearTimeout(_)), d._timers.clear(), f.clear(d.scope).then(() => {
      d._paused = !1, C(d.dom, "ln-api-queue:pending-count", { count: 0, scope: d.scope }), C(d.dom, "ln-api-queue:drained", { scope: d.scope });
    }).catch((_) => {
      C(d.dom, "ln-api-queue:error", { operation: "clear", error: _ });
    });
  }, s.prototype._bindEvents = function() {
    const d = this;
    d._handlers = {
      enqueue: (_) => d._onEnqueue(_),
      ack: (_) => d._onAck(_),
      nack: (_) => d._onNack(_),
      remap: (_) => d._onRemap(_),
      resolveCreate: (_) => d._onResolveCreate(_),
      resume: () => d._onResume(),
      pause: () => d._onPause(),
      drain: () => d._onDrain(),
      clear: () => d._onClear()
    }, d.dom.addEventListener("ln-api-queue:request-enqueue", d._handlers.enqueue), d.dom.addEventListener("ln-api-queue:ack", d._handlers.ack), d.dom.addEventListener("ln-api-queue:nack", d._handlers.nack), d.dom.addEventListener("ln-api-queue:request-remap", d._handlers.remap), d.dom.addEventListener("ln-api-queue:resolve-create", d._handlers.resolveCreate), d.dom.addEventListener("ln-api-queue:request-resume", d._handlers.resume), d.dom.addEventListener("ln-api-queue:request-pause", d._handlers.pause), d.dom.addEventListener("ln-api-queue:request-drain", d._handlers.drain), d.dom.addEventListener("ln-api-queue:request-clear", d._handlers.clear);
  }, s.prototype.destroy = function() {
    if (!this.dom[i]) return;
    const d = this;
    d.dom.removeEventListener("ln-api-queue:request-enqueue", d._handlers.enqueue), d.dom.removeEventListener("ln-api-queue:ack", d._handlers.ack), d.dom.removeEventListener("ln-api-queue:nack", d._handlers.nack), d.dom.removeEventListener("ln-api-queue:request-remap", d._handlers.remap), d.dom.removeEventListener("ln-api-queue:resolve-create", d._handlers.resolveCreate), d.dom.removeEventListener("ln-api-queue:request-resume", d._handlers.resume), d.dom.removeEventListener("ln-api-queue:request-pause", d._handlers.pause), d.dom.removeEventListener("ln-api-queue:request-drain", d._handlers.drain), d.dom.removeEventListener("ln-api-queue:request-clear", d._handlers.clear), window.removeEventListener("online", d._onlineHandler), d._timers.forEach((_) => clearTimeout(_)), d._timers.clear(), C(d.dom, "ln-api-queue:destroyed", { scope: d.scope }), delete d.dom[i];
  };
  function u(d) {
    const _ = d[i];
    _ && _._drain();
  }
  H(o, i, s, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: u
  });
})();
function Ze(o) {
  if (o == null || o === "") return null;
  const i = Number(o);
  return Number.isFinite(i) ? i : null;
}
function vt(o) {
  return String(Math.round(o * 1e3) / 1e3);
}
function ui(o, i, b) {
  const y = Ze(o);
  return y === null || y < 0 ? 0 : Math.min(y, Math.min(i, b) / 2);
}
function hi(o) {
  if (typeof o != "string") return null;
  const i = o.trim().split(/[\s,]+/).map(Number);
  return i.length !== 4 || i.some((b) => !Number.isFinite(b)) || i[2] <= 0 || i[3] <= 0 ? null : { x: i[0], y: i[1], width: i[2], height: i[3] };
}
function fi(o, i) {
  i = i || {};
  const b = i.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, y = i.xField || "label", m = i.yField || "value", g = i.includeZero !== !1, f = ui(i.padding, b.width, b.height), s = Array.isArray(o) ? o : [], u = [];
  for (let k = 0; k < s.length; k++) {
    const q = s[k] || {}, O = Ze(q[m]);
    O !== null && u.push({
      record: q,
      sourceIndex: k,
      label: q[y] == null ? String(k + 1) : String(q[y]),
      value: O
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
      baselineY: b.y + b.height - f
    };
  const d = u.map((k) => k.value), _ = Math.min(...d), c = Math.max(...d);
  let p = g ? Math.min(0, _) : _, h = g ? Math.max(0, c) : c;
  if (p === h)
    if (p === 0)
      h = 1;
    else {
      const k = Math.max(Math.abs(p) * 0.1, 1);
      p -= k, h += k;
    }
  const r = b.x + f, a = b.y + f, n = Math.max(0, b.width - f * 2), t = Math.max(0, b.height - f * 2), e = u.length > 1 ? n / (u.length - 1) : 0, l = h - p, v = (k) => a + (h - k) / l * t, w = u.map((k, q) => ({
    ...k,
    x: u.length === 1 ? r + n / 2 : r + q * e,
    y: v(k.value)
  })), E = p <= 0 && h >= 0 ? 0 : p, S = v(E), L = w.map((k) => vt(k.x) + "," + vt(k.y)).join(" "), x = [
    vt(w[0].x) + "," + vt(S),
    L,
    vt(w[w.length - 1].x) + "," + vt(S)
  ].join(" ");
  return {
    points: w,
    linePoints: L,
    areaPoints: x,
    count: w.length,
    min: _,
    max: c,
    domainMin: p,
    domainMax: h,
    baselineY: S
  };
}
(function() {
  const o = "data-ln-chart", i = "lnChart", b = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[i] !== void 0) return;
  function y(s) {
    if (!s) return null;
    const u = s.split(":"), d = u[0].trim();
    return d ? {
      field: d,
      direction: u[1] && u[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
    } : null;
  }
  function m(s, u) {
    if (s == null || !Number.isFinite(s)) return "";
    try {
      return new Intl.NumberFormat(Q(u)).format(s);
    } catch {
      return String(s);
    }
  }
  function g(s, u) {
    s && (s.textContent = u);
  }
  function f(s) {
    this.dom = s, this.name = s.getAttribute(o) || "", this.source = s.getAttribute("data-ln-chart-source") || this.name, this.plot = s.querySelector("[data-ln-chart-plot]"), this.line = s.querySelector("[data-ln-chart-line]"), this.area = s.querySelector("[data-ln-chart-area]"), this.labels = s.querySelector("[data-ln-chart-labels]"), this.empty = s.querySelector("[data-ln-chart-empty]"), this.minimum = s.querySelector("[data-ln-chart-min]"), this.maximum = s.querySelector("[data-ln-chart-max]"), this.count = s.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const u = this;
    return this._onSetData = function(d) {
      const _ = d.detail || {};
      u._data = Array.isArray(_.data) ? _.data : [], u.isLoaded = !0, u._setLoading(!1), u._render();
    }, this._onSetLoading = function(d) {
      u._setLoading(!!(d.detail && d.detail.loading));
    }, this._onRefresh = function() {
      u.requestData();
    }, s.addEventListener("ln-chart:set-data", this._onSetData), s.addEventListener("ln-chart:set-loading", this._onSetLoading), s.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  f.prototype._readOptions = function() {
    const s = this.dom.getAttribute("data-ln-chart-padding"), u = s === null ? NaN : Number(s), d = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(u) && u >= 0 ? u : 16,
      type: d === "area" || d === "polygon" ? "area" : "line",
      viewBox: this.plot && hi(this.plot.getAttribute("viewBox")) || b
    };
  }, f.prototype._setLoading = function(s) {
    this.dom.classList.toggle("ln-chart--loading", s), this.dom.setAttribute("aria-busy", s ? "true" : "false");
  }, f.prototype._renderLabels = function(s) {
    if (!this.labels || (this.labels.replaceChildren(), s.count === 0)) return;
    const u = this.name + "-label", d = '[data-ln-template="' + u + '"]';
    if (!this.dom.querySelector(d) && !document.querySelector(d)) return;
    const _ = ft(this.dom, u, "ln-chart");
    if (_)
      for (const c of s.points) {
        const p = _.cloneNode(!0);
        xt(p, {
          label: c.label,
          value: m(c.value, this.dom)
        }), this.labels.appendChild(p);
      }
  }, f.prototype._render = function() {
    const s = this._readOptions(), u = fi(this._data, s);
    this.model = u, this.line && (this.line.setAttribute("points", u.linePoints), this.line.toggleAttribute("hidden", u.count === 0)), this.area && (this.area.setAttribute("points", u.areaPoints), this.area.toggleAttribute("hidden", u.count === 0 || s.type !== "area"));
    const d = u.count === 0;
    this.dom.classList.toggle("ln-chart--empty", d), this.empty && this.empty.toggleAttribute("hidden", !d), g(this.minimum, m(u.min, this.dom)), g(this.maximum, m(u.max, this.dom)), g(this.count, m(u.count, this.dom)), this._renderLabels(u), C(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: u.count,
      min: u.min,
      max: u.max
    });
  }, f.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, C(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: y(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, f.prototype.destroy = function() {
    this.dom[i] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[i]);
  }, H(o, i, f, "ln-chart", {
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
      const d = s[i];
      if (d) {
        if (u === "data-ln-chart-source" || u === "data-ln-chart-sort") {
          d.requestData();
          return;
        }
        d._render();
      }
    }
  });
})();
(function() {
  const o = "data-ln-options", i = "lnOptions";
  if (window[i] !== void 0) return;
  function b(y) {
    this.dom = y, this._storeName = y.getAttribute(o), this._valueField = y.getAttribute("data-ln-options-value") || "id", this._labelField = y.getAttribute("data-ln-options-label") || "name";
    const m = this;
    return this._onSetData = function(g) {
      m._rebuild(g.detail.data || []);
    }, y.addEventListener("ln-options:set-data", this._onSetData), C(y, "ln-options:request-data", { options: this._storeName }), this;
  }
  b.prototype._rebuild = function(y) {
    const m = this.dom, g = this._valueField, f = this._labelField, s = m.value, u = m.querySelectorAll("option");
    for (let _ = u.length - 1; _ >= 0; _--)
      u[_].value !== "" && m.removeChild(u[_]);
    for (let _ = 0; _ < y.length; _++) {
      const c = y[_], p = document.createElement("option");
      p.value = String(c[g]), p.textContent = c[f] != null ? c[f] : "", m.appendChild(p);
    }
    const d = m.options;
    for (let _ = 0; _ < d.length; _++)
      if (d[_].value === s) {
        m.value = s;
        break;
      }
  }, b.prototype.destroy = function() {
    this.dom[i] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[i]);
  }, H(o, i, b, "ln-options");
})();
(function() {
  const o = "data-ln-stat", i = "lnStat";
  if (window[i] !== void 0) return;
  function b(m) {
    if (!m) return null;
    const g = m.indexOf(":");
    if (g === -1) return null;
    const f = m.slice(0, g), s = m.slice(g + 1), u = {};
    return u[f] = [s], u;
  }
  function y(m) {
    return this.dom = m, this._storeName = m.getAttribute(o), this._filters = b(m.getAttribute("data-ln-stat-filter")), this._onSetCount = function(g) {
      m.textContent = String(g.detail.count), m.classList.remove("is-loading");
    }, m.addEventListener("ln-stat:set-count", this._onSetCount), C(m, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  y.prototype.destroy = function() {
    this.dom[i] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[i]);
  }, H(o, i, y, "ln-stat");
})();
(function() {
  const o = "ln-icon-sprite", i = "#ln-icon-", b = "#ln-icon-custom-", y = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set();
  let g = null;
  const f = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), s = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), u = "lni:", d = "lni:v", _ = "1";
  function c() {
    try {
      if (localStorage.getItem(d) !== _) {
        for (let e = localStorage.length - 1; e >= 0; e--) {
          const l = localStorage.key(e);
          l && l.indexOf(u) === 0 && localStorage.removeItem(l);
        }
        localStorage.setItem(d, _);
      }
    } catch {
    }
  }
  c();
  function p() {
    return g || (g = document.getElementById(o), g || (g = document.createElementNS("http://www.w3.org/2000/svg", "svg"), g.id = o, g.setAttribute("hidden", ""), g.setAttribute("aria-hidden", "true"), g.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(g, document.body.firstChild))), g;
  }
  function h(e) {
    return e.indexOf(b) === 0 ? s + "/" + e.slice(b.length) + ".svg" : f + "/" + e.slice(i.length) + ".svg";
  }
  function r(e, l) {
    const v = l.match(/viewBox="([^"]+)"/), w = v ? v[1] : "0 0 24 24", E = l.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), S = E ? E[1].trim() : "", L = l.match(/<svg([^>]*)>/i), x = L ? L[1] : "", k = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    k.id = e, k.setAttribute("viewBox", w), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(q) {
      const O = x.match(new RegExp(q + '="([^"]*)"'));
      O && k.setAttribute(q, O[1]);
    }), k.innerHTML = S, p().querySelector("defs").appendChild(k);
  }
  function a(e) {
    if (y.has(e) || m.has(e)) return;
    if (e.indexOf(b) === 0 && !s) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", e);
      return;
    }
    const l = e.slice(1);
    try {
      const w = localStorage.getItem(u + l);
      if (w) {
        r(l, w), y.add(e);
        return;
      }
    } catch {
    }
    m.add(e);
    const v = h(e);
    fetch(v).then(function(w) {
      if (!w.ok) throw new Error(w.status);
      return w.text();
    }).then(function(w) {
      r(l, w), y.add(e), m.delete(e);
      try {
        localStorage.setItem(u + l, w);
      } catch {
      }
    }).catch(function(w) {
      console.error("[ln-icon] Fetch failed for:", l, w), m.delete(e);
    });
  }
  function n(e) {
    const l = 'use[href^="' + i + '"], use[href^="' + b + '"]', v = e.querySelectorAll ? e.querySelectorAll(l) : [];
    if (e.matches && e.matches(l)) {
      const w = e.getAttribute("href");
      w && a(w);
    }
    Array.prototype.forEach.call(v, function(w) {
      const E = w.getAttribute("href");
      E && a(E);
    });
  }
  function t() {
    n(document), new MutationObserver(function(e) {
      e.forEach(function(l) {
        if (l.type === "childList")
          l.addedNodes.forEach(function(v) {
            v.nodeType === 1 && n(v);
          });
        else if (l.type === "attributes" && l.attributeName === "href") {
          const v = l.target.getAttribute("href");
          v && (v.indexOf(i) === 0 || v.indexOf(b) === 0) && a(v);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t) : t();
})();
(function() {
  const o = "data-ln-debug", i = "lnDebug";
  if (window[i] !== void 0) return;
  function b(y) {
    return this.dom = y, this;
  }
  b.prototype.destroy = function() {
    delete this.dom[i];
  }, H(o, i, b, "ln-debug");
})();
